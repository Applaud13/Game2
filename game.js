import chalk from 'chalk';
import { Moveshop } from './index.js';
import { shop } from './shop.js';
import { Player, Dealer1, Dealer2, Supporter1, Supporter2, Tanker1, Tanker2 } from './character.js';
import { Boss1, Boss2, Boss3 } from './boss.js';
import wavPlayer from 'node-wav-player';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// 현재 파일의 디렉토리 경로 (사운드 관련)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// 게임 시작
export async function startGame() {

  // 기본 캐릭터 생성
  const player = new Player();
  const tanker1 = new Tanker1();
  const tanker2 = new Tanker2();
  const dealer1 = new Dealer1();
  const dealer2 = new Dealer2();
  const supporter1 = new Supporter1();
  const supporter2 = new Supporter2();
  let stage = 1;
  let monster;


  // 보스생성 → 정비 → 전투 (패배할때까지 반복)
  while (player.win) {


    // 3종류 중 랜덤 보스 생성
    const RandomBoss = Math.floor(Math.random() * 3);
    switch (RandomBoss) {
      case 0:
        monster = new Boss1(stage);
        break;

      case 1:
        monster = new Boss2(stage);
        break;

      case 2:
        monster = new Boss3(stage);
        break;
    }


    // 상점에서 정비
    await shop(player, stage, monster, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);


    // 전투
    await battle(stage, player, monster);
    stage++;


    // 승리 로딩
    await Moveshop(player, stage);

  }

  end(stage - 1);
}


// 게임 종료 함수 : startGame에서 사용
function end(stage) {

  // 게임 종료 소리 재생
  const gameover = path.join(__dirname, 'sounds', 'gameover.wav');
  wavPlayer.play({ path: gameover }).then(() => { });


  // 순위 저장 및 불러오기 함수
  const filePath = 'data.json';
  const savedata = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
  const loaddata = () => {
    const Basicdata = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(Basicdata);
  }


  // index0에 현재 stage저장 및 순위 재정렬 (1~5번은 5~1등)
  const Rank = loaddata();
  Rank[0] = stage;
  Rank.sort((a, b) => a - b);
  savedata(Rank);


  // 순위권에 들어갈 경우 / 안들어갈 경우 최종 메시지 노출
  console.clear();
  if (stage >= Rank[1]) {
    console.log(`${chalk.red(`${stage}스테이지까지 까지 오시나디.. 대단합니다! 당신의 등수가 순위표에 올라갔습니다!`)}`)
  } else {
    console.log(`${chalk.red(`${stage}스테이지까지 까지 오셨군요.. 아쉽습니다! 다음에는 순위권에 도전해보세요!`)}`)
  }
  console.log(chalk.green(`        순위표`));
  Rank[5] === stage ? console.log(chalk.red.bold(`    현재 1등 : ${Rank[5]}스테이지`)) : console.log(chalk.green(`    현재 1등 : ${Rank[5]}스테이지`));
  Rank[4] === stage ? console.log(chalk.red.bold(`    현재 2등 : ${Rank[4]}스테이지`)) : console.log(chalk.green(`    현재 2등 : ${Rank[4]}스테이지`));
  Rank[3] === stage ? console.log(chalk.red.bold(`    현재 3등 : ${Rank[3]}스테이지`)) : console.log(chalk.green(`    현재 3등 : ${Rank[3]}스테이지`));
  Rank[2] === stage ? console.log(chalk.red.bold(`    현재 4등 : ${Rank[2]}스테이지`)) : console.log(chalk.green(`    현재 4등 : ${Rank[2]}스테이지`));
  Rank[1] === stage ? console.log(chalk.red.bold(`    현재 5등 : ${Rank[1]}스테이지`)) : console.log(chalk.green(`    현재 5등 : ${Rank[1]}스테이지`));

}


// 전투 : startGame에서 사용
async function battle (stage, player, monster) {

  let logs = [];


  // 전투시간, 승리 초기화
  let Battletime = 0;
  player.win = false;


  // 아군 전멸 or 보스 섬멸 시까지 반복 전투
  while (player.Firstcharacter.hp > 0 || player.Secondcharacter.hp > 0 || player.Thirdcharacter.hp > 0) {

    console.clear();
    displayStatus(stage, player, monster);


    // 로그는 21개까지만 노출
    if (logs.length > 21) {
      logs.shift();
    }
    logs.forEach(log => { console.log(log); });


    // 캐릭터들 과 보스가 스킬 사용
    player.Firstcharacter.skill(Battletime, logs, player, monster);
    player.Secondcharacter.skill(Battletime, logs, player, monster);
    player.Thirdcharacter.skill(Battletime, logs, player, monster);
    monster.skill(Battletime, logs, player);


    // 몬스터 사망시 승리 함수 실행
    if (monster.hp <= 0) {
      WinBattle(stage, player);
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
    Battletime += 100;
  }

};


// 전투 승리 시 전투에 참여한 캐릭터 스킬 초기화 / 골드,이자 획득 : battle에서 사용)
function WinBattle(stage, player) {
  player.win = true;
  player.Firstcharacter.BattletimeUse = player.Firstcharacter.skillcool * -0.5;
  player.Secondcharacter.BattletimeUse = player.Secondcharacter.skillcool * -0.5;
  player.Thirdcharacter.BattletimeUse = player.Thirdcharacter.skillcool * -0.5;
  player.gold = Math.ceil(player.gold * 1.2);
  player.gold += 300 + Math.ceil((Math.random() * 0.4 + 0.8) * stage * (stage + 1) * 5);
}


// 상태 UI : Battle에서 사용
function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.blueBright(
      `| ${player.Firstcharacter.name} : ${player.Firstcharacter.Maxhp}/${player.Firstcharacter.hp} `,
    ) +
    chalk.blueBright(
      `| ${player.Secondcharacter.name} : ${player.Secondcharacter.Maxhp}/${player.Secondcharacter.hp} `,
    ) +
    chalk.blueBright(
      `| ${player.Thirdcharacter.name} : ${player.Thirdcharacter.Maxhp}/${player.Thirdcharacter.hp} `,
    ) +
    chalk.redBright(
      `| ${monster.name}Lv${stage} : ${monster.Maxhp}/${monster.hp}|`,
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));

  // 체력 바 노출
  console.log(`${HPbarMake(player.Firstcharacter)}     ${HPbarMake(player.Secondcharacter)}     ${HPbarMake(player.Thirdcharacter)}   ${chalk.red(`|`)}   ${HPbarMake(monster)}\n`);

}


// 체력 바 제작 함수 : displayStatus에서 사용
function HPbarMake(character) {
  const HPrate = Math.ceil(character.hp / character.Maxhp * 20);
  let HPbar = `${chalk.blue(`${character.name}`)}: `;
  if (HPrate <= 0) {
    HPbar = `${chalk.red(`${character.name}`)}: `;
    HPbar += `${chalk.bgRed(` `)}`.repeat(20);
  }
  else if (HPrate <= 6) {
    HPbar += `${chalk.bgRed(` `)}`.repeat(HPrate);
    HPbar += `${chalk.bgGray(` `)}`.repeat(20 - HPrate);
  } else if (HPrate <= 12) {
    HPbar += `${chalk.bgHex('#FFA500')(` `)}`.repeat(HPrate);
    HPbar += `${chalk.bgGray(` `)}`.repeat(20 - HPrate);
  } else {
    HPbar += `${chalk.bgGreen(` `)}`.repeat(HPrate);
    HPbar += `${chalk.bgGray(` `)}`.repeat(20 - HPrate);
  }
  return HPbar;
};