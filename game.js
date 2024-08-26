import chalk from 'chalk';
import { shop } from './shop.js';
import { Player, Dealer1, Dealer2, Supporter1, Supporter2, Tanker1, Tanker2 } from './character.js';
import { Boss1, Boss2, Boss3 } from './boss.js';


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

  // 체력 바 만들기
  console.log(`${HPbarMake(player.Firstcharacter)}     ${HPbarMake(player.Secondcharacter)}     ${HPbarMake(player.Thirdcharacter)}   ${chalk.red(`|`)}   ${HPbarMake(monster)}\n`);
  

  // 체력 바 만들기 함수
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



}

const battle = async (stage, player, monster) => {

  let logs = [];
  let Battletime = 0;
  player.win = false;

  // 아군 전멸 or 보스 섬멸 시까지 무한 전투
  while (player.Firstcharacter.hp > 0 || player.Secondcharacter.hp > 0 || player.Thirdcharacter.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);


    // 로그는 24개까지만 추가
    if (logs.length > 24) {
      logs.shift();
    }
    logs.forEach(log => { console.log(log); });


    // 플레이어 캐릭터 및 보스 스킬 사용
    player.Firstcharacter.skill(Battletime, logs, player, monster);
    player.Secondcharacter.skill(Battletime, logs, player, monster);
    player.Thirdcharacter.skill(Battletime, logs, player, monster);
    monster.skill(Battletime, logs, player);


    // 몬스터 사망시 승리 함수 실행
    if(monster.hp <= 0) {
      WinBattle(stage, player);
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
    Battletime += 100;
  }


  // 전투 종료 시 전투에 참여한 캐릭터 배틀 타임 초기화
  function WinBattle(stage, player) {
    player.win = true;
    player.Firstcharacter.BattletimeUse = player.Firstcharacter.skillcool * -0.5;
    player.Secondcharacter.BattletimeUse = player.Secondcharacter.skillcool * -0.5;
    player.Thirdcharacter.BattletimeUse = player.Thirdcharacter.skillcool * -0.5;
    player.gold = Math.ceil(player.gold*1.2);
    player.gold += 200 + Math.ceil((Math.random() * 0.4 + 0.8)* stage * (stage+1) * 5);
  }
};

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

    // 3종류의 보스 중 랜덤으로 보스 1마리 생성
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
  }
}