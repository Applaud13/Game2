import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import { Dealer1, Dealer2, Supporter1, Supporter2, Tanker1, Tanker2 } from './character.js';
import { Boss1, Boss2, Boss3 } from './boss.js';
import { startGame } from "./game.js";
import wavPlayer from 'node-wav-player';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// 현재 파일의 디렉토리 경로
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// 줄무늬 : displayLobby, HOF, Moveshop에서 사용
const line = chalk.magentaBright('='.repeat(4)) + chalk.blueBright('='.repeat(4));
const line2 = chalk.blueBright('='.repeat(4)) + chalk.magentaBright('='.repeat(4));
let Line = ``;
for (let i = 0; i < 6; i++) { Line += line };
let Line2 = ``;
for (let i = 0; i < 6; i++) { Line2 += line2 };


// 아레나 정보보기 용도
const tanker1 = new Tanker1();
const tanker2 = new Tanker2();
const dealer1 = new Dealer1();
const dealer2 = new Dealer2();
const supporter1 = new Supporter1();
const supporter2 = new Supporter2();
const boss1 = new Boss1(1);
const boss2 = new Boss2(1);
const boss3 = new Boss3(1);


// 게임 시작 함수
function start() {

    // 게임 입장 사운드
    const start = path.join(__dirname, 'sounds', 'start.wav');
    wavPlayer.play({ path: start }).then(() => { });
    displayLobby();
    handleUserInput();
}


// 로비 화면을 출력하는 함수 : start에서 사용
function displayLobby() {

    console.clear();

    // 타이틀 텍스트
    console.log(
        chalk.cyan(
            figlet.textSync('Heros Arena', {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    );

    // 상단 경계선
    console.log(Line)
    console.log(Line2)
    console.log(Line)


    // 게임 이름
    console.log(chalk.yellowBright.bold('영웅의 아레나에 오신것을 환영합니다!!'));

    // 설명 텍스트
    console.log(chalk.green('옵션을 선택해주세요.'));
    console.log();

    // 옵션들
    console.log(chalk.green('1.') + chalk.white(' 새로운 게임 시작'));
    console.log(chalk.green('2.') + chalk.white(' 영웅의 전당 둘러보기'));
    console.log(chalk.green('3.') + chalk.white(' 아레나 정보'));
    console.log(chalk.green('9.') + chalk.white(' 종료'));

    // 하단 경계선
    console.log(Line)
    console.log(Line2)
    console.log(Line)

    // 하단 설명
    console.log(chalk.gray('1-4 사이의 수를 입력한 뒤 엔터를 누르세요.'));
}


// 유저 입력을 받아 처리하는 함수 : start에서 사용
function handleUserInput() {
    const choice = readlineSync.question('입력: ');

    switch (choice) {

        // 게임시작
        case '1':
            startGame();
            break;


        // 명예의 전당
        case '2':
            HOF();
            console.clear();
            displayLobby()
            handleUserInput();
            break;


        // 게임 상세정보
        case '3':
            ArenaInfo();
            console.clear();
            displayLobby()
            handleUserInput();
            break;


        case '9':
            console.log(chalk.red('게임을 종료합니다.'));
            process.exit(0);


        default:
            console.log(chalk.red('올바른 선택을 하세요.'));
            handleUserInput();
    }
}


// 명예의 전당  : handleUserInput에서 사용
function HOF() {

    console.clear();

    // 입장 소리 재생
    const hof = path.join(__dirname, 'sounds', 'hof.wav');
    wavPlayer.play({ path: hof }).then(() => { });


    // 타이틀 텍스트
    console.log(
        chalk.cyan(
            figlet.textSync('Heros Arena', {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    );


    // 상단 UI
    const line = chalk.bgBlueBright(' '.repeat(50));
    console.log(Line)
    console.log(Line2)
    console.log(Line)
    console.log(chalk.yellowBright.bold('        명예의 전당에 오신걸 환영합니다!'));
    console.log();


    // 순위 나열
    const filePath = 'data.json';
    const loaddata = () => {
        const Basicdata = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(Basicdata);
    }
    const Rank = loaddata();
    console.log(chalk.green('현재1위: ') + chalk.white(` ${Rank[5]}스테이지`));
    console.log(chalk.green('현재2위: ') + chalk.white(` ${Rank[4]}스테이지`));
    console.log(chalk.green('현재3위: ') + chalk.white(` ${Rank[3]}스테이지`));
    console.log(chalk.green('현재4위: ') + chalk.white(` ${Rank[2]}스테이지`));
    console.log(chalk.green('현재5위: ') + chalk.white(` ${Rank[1]}스테이지 \n`));


    // 하단 UI
    console.log(Line)
    console.log(Line2)
    console.log(Line)


    // 뒤로가기
    console.log(chalk.gray('뒤로가실려면 9번을 눌러주세요.'));
    function HOFout() {
        const choice = readlineSync.question('입력: ');
        switch (choice) {
            case '9':
                break;
            default:
                console.log(chalk.red('올바른 선택을 하세요.'));
                HOFout();
        }
    }
    HOFout();
}

// 아레나 정보  : handleUserInput에서 사용
function ArenaInfo() {

    console.clear();

    // 타이틀 텍스트
    console.log(
        chalk.cyan(
            figlet.textSync('Arenas Information', {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    );


    // 영웅 설명 UI
    const line = chalk.bgBlueBright(' '.repeat(50));
    console.log(Line+Line)
    console.log(Line2+Line2)
    console.log();
    console.log(`${chalk.blueBright(`${tanker1.name}`)}: 신성한 축복을 사용하여 일정시간동안 ${chalk.greenBright(`자신이 받는 피해를 감소`)}시키는 ${chalk.greenBright.bold(`탱커`)}입니다.`);
    console.log(`${chalk.blueBright(`${tanker2.name}`)}: 천공의 검을 사용하여 상대보스에게 ${chalk.greenBright(`스턴을 가해`)}아군을 지키는 ${chalk.greenBright.bold(`탱커`)}입니다.`);
    console.log(`${chalk.blueBright(`${dealer1.name}`)}: 행운의 주사위를 굴려 상대보스에게 ${chalk.greenBright(`나온 숫자만큼 공격`)}하는 ${chalk.greenBright.bold(`딜러`)}입니다.`);
    console.log(`${chalk.blueBright(`${dealer2.name}`)}: 녹아내린 균열을 사용하여 상대보스에게 ${chalk.greenBright(`최대체력 비례 피해`)}를 입히는 ${chalk.greenBright.bold(`딜러`)}입니다.`);
    console.log(`${chalk.blueBright(`${supporter1.name}`)}: 별의 기원을 사용하여 ${chalk.greenBright(`모든 아군을 치유`)}하는 ${chalk.greenBright.bold(`힐러`)}입니다.`);
    console.log(`${chalk.blueBright(`${supporter2.name}`)}: 파도의 축복을 사용하여 ${chalk.greenBright(`가장 위험에 처한 아군`)}을 치유해주는 ${chalk.greenBright.bold(`힐러`)}입니다.`);


    // 보스 설명 UI
    console.log();
    console.log(Line2+Line2)
    console.log(Line+Line)
    console.log();
    console.log(`${chalk.redBright(`${boss1.name}`)}: 죽음의 표식을 사용하여 ${chalk.redBright(`가까운 적을 강하게 공격`)}하는 몬스터입니다.`);
    console.log(`${chalk.redBright(`${boss2.name}`)}: 철갑의 강타를 사용하여 ${chalk.redBright(`가까운 적을 공격하는 체력이 높은`)} 몬스터입니다.`);
    console.log(`${chalk.redBright(`${boss3.name}`)}: 멸망의 파도를 사용하여 ${chalk.redBright(`적군 전체에게 광역피해를`)}입히는 몬스터입니다.`);
    console.log();
    console.log(Line+Line)
    console.log(Line2+Line2)


    // 뒤로가기
    console.log(chalk.gray('뒤로가실려면 9번을 눌러주세요.'));
    function Out() {
        const choice = readlineSync.question('입력: ');
        switch (choice) {
            case '9':
                break;
            default:
                console.log(chalk.red('올바른 선택을 하세요.'));
                Out();
        }
    }
    Out();
}


// 상점으로 이동 / 승리 사운드 : game.js의 startGame에서 사용 (문서상단 Line 사용)
export async function Moveshop(player, stage) {

    if (player.win) {
        const victory = path.join(__dirname, 'sounds', 'victory.wav');
        wavPlayer.play({ path: victory }).then(() => { });
        let space = ``;
        for (let i = 0; i < 60; i++) {
            console.clear();
            let goline = chalk.magentaBright('='.repeat(88 - i)) + chalk.redBright('='.repeat(8)) + chalk.magentaBright('='.repeat(i));
            if (i % 2 === 0) {
                console.log(Line + Line)
                console.log(Line2 + Line2)
                console.log(`${chalk.whiteBright(`                                   ${stage} 스테이지 클리어!!`)}`)
                console.log(Line2 + Line2)
                console.log(Line + Line)
            } else {
                console.log(Line2 + Line2)
                console.log(Line + Line)
                console.log(`${chalk.redBright(`                                   ${stage} 스테이지 클리어!!`)}`)
                console.log(Line + Line)
                console.log(Line2 + Line2)
            }
            if (i % 8 < 4) {
                console.log(`${chalk.green((`\n\n\n 상점으로 이동중입니다!!          ${space}🏄‍♂️`))}`)
                console.log(goline);
                console.log(goline);
                console.log(goline);
            } else {
                console.log(`${chalk.green((`\n\n                                  ${space}🏄‍♂️`))}`)
                console.log(`${chalk.green((` 상점으로 이동중입니다!!`))}`)
                console.log(goline);
                console.log(goline);
                console.log(goline);
            }
            space += ` `;
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
}


// 게임 실행!!
start();