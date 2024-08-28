import readlineSync from 'readline-sync';
import chalk from 'chalk';
import wavPlayer from 'node-wav-player';
import path from 'path';
import { fileURLToPath } from 'url';


// 현재 파일의 디렉토리 경로 (사운드 관련)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// 상점 함수
export async function shop(player, stage, monster, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2) {

    let logs = [];
    console.clear();


    // 마법 상점 관련 인자 생성 및 상점진입
    const MagicalshopN = Math.floor(Math.random() * 1.5);
    let free = 1;
    purchase(free, MagicalshopN, player, stage, monster, logs, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);


    // 출전 캐릭터 선택 사운드
    const fight = path.join(__dirname, 'sounds', 'fight.wav');
    wavPlayer.play({ path: fight }).then(() => { });


    // 출전 캐릭터 선택 화면
    console.clear();
    characterStatus(monster, stage, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);


    // 전방 캐릭터 선택 / 레디 사운드
    const choice1 = CharacterChioce1(player, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
    console.log(`${chalk.blueBright(`${player.Firstcharacter.name}`)}(이)가 전방을 책임지고 있습니다! \n`);
    const ready = path.join(__dirname, 'sounds', 'ready.wav');
    wavPlayer.play({ path: ready }).then(() => { });


    // 중앙 캐릭터 선택 (choice1을 받아서 중복인지 확인) / 레디 사운드
    const choice2 = CharacterChioce2(choice1, player, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
    console.log(`${chalk.blueBright(`${player.Secondcharacter.name}`)}(이)가 중앙에서 예열중입니다! \n`);
    wavPlayer.play({ path: ready }).then(() => { });


    // 후열 캐릭터 선택(choice1,choice2를 받아서 중복인지 확인) / 전쟁 사운드(6라운드 이상에서만 재생) 
    CharacterChioce3(choice1, choice2, player, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
    console.log(`${chalk.blueBright(`${player.Thirdcharacter.name}`)}(이)가 후방을 맡고있습니다! \n`);
    wavPlayer.play({ path: ready }).then(() => { });
    if (stage > 5) {
        const longbattle = path.join(__dirname, 'sounds', 'longbattle.wav');
        wavPlayer.play({ path: longbattle }).then(() => { });
    }


    // 전투지 이동 로딩 화면
    let space = ``;
    for (let i = 0; i < 50; i++) {
        const Move = `${chalk.green((` 다음 전투지로 이동중입니다${space}🥷`))}`
        process.stdout.clearLine(0);
        process.stdout.write(Move);
        process.stdout.cursorTo(0);
        space += ` `;
        await new Promise(resolve => setTimeout(resolve, 60));
    }


    // 출전 캐릭터 체력 업데이트
    player.Firstcharacter.hp = player.Firstcharacter.Maxhp;
    player.Secondcharacter.hp = player.Secondcharacter.Maxhp;
    player.Thirdcharacter.hp = player.Thirdcharacter.Maxhp;

}


// 구매 함수 : shop에서 사용
function purchase(free, MagicalshopN, player, stage, monster, logs, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2) {

    // 상점 기본 UI
    console.clear();
    ShopStatus(player, stage, monster, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
    if (MagicalshopN) {
        console.log(`${chalk.green(`1.캐릭터 뽑기1회(100원)  2.캐릭터 뽑기10회(1000원)  ${chalk.blue.bold(`3.마법의 상점 OPEN`)}  9.상점 나가기`)}`);
    }
    else {
        console.log(`${chalk.green(`1.캐릭터 뽑기1회(100원)  2.캐릭터 뽑기10회(1000원)  ${chalk.gray(`3.마법의 상점 Close`)} 9.상점 나가기`)}`);
    }


    // 선택 및 효과
    console.log(`무엇을 도와드릴까요?`);
    logs.forEach(log => { console.log(log) });
    const shopchoice = readlineSync.question('');
    switch (shopchoice) {

        // 캐릭터 뽑기 1회 선택
        case '1':
            if (player.gold >= 100) {
                characterpick(logs, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
                player.gold -= 100;
            } else {
                // 골드 부족 사운드 / 문구
                const fail = path.join(__dirname, 'sounds', 'fail.wav');
                wavPlayer.play({ path: fail }).then(() => { });
                logs.push(chalk.red(`골드가 ${100 - player.gold}원 부족합니다.`));
            }
            purchase(free, MagicalshopN, player, stage, monster, logs, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
            break;


        // 캐릭터 뽑기 10회 선택   
        case '2':
            if (player.gold >= 1000) {
                player.gold -= 1000;
                for (let i = 0; i < 10; i++) {
                    characterpick(logs, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
                }
            } else {
                // 골드 부족 사운드 / 문구
                const fail = path.join(__dirname, 'sounds', 'fail.wav');
                wavPlayer.play({ path: fail }).then(() => { });
                logs.push(chalk.red(`골드가 ${1000 - player.gold}원 부족합니다.`));
            }
            purchase(free, MagicalshopN, player, stage, monster, logs, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
            break;


        // 마법의 상점 진입 
        case '3':
            if (MagicalshopN) {
                Magicalshop(free, MagicalshopN, player, stage, monster, logs, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
            } else {
                // 상점 진입 실패 사운드 / 문구
                const fail = path.join(__dirname, 'sounds', 'fail.wav');
                wavPlayer.play({ path: fail }).then(() => { });
                logs.push(`${chalk.redBright(`오늘은 마법의 상점이 닫혀있습니다...`)}`)
                purchase(free, MagicalshopN, player, stage, monster, logs, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
            }
            break;


        case '9':
            break;


        default:
            logs.push(chalk.red('올바른 선택을 하세요.'));
            purchase(free, MagicalshopN, player, stage, monster, logs, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);

    }

}


// 상점 UI : purchase에서 사용
function ShopStatus(player, stage, monster, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2) {
    console.log(chalk.magentaBright(`\n=== Current Status ===`));
    console.log(
        chalk.redBright(`| Stage: ${stage} |`) +
        chalk.blueBright(`${chalk.yellow(`| 골드 : ${player.gold}원 |`)}| ${tanker1.name}${tanker1.grade}성  ${tanker2.name}${tanker2.grade}성  ${dealer1.name}${dealer1.grade}성  ${dealer2.name}${dealer2.grade}성  ${supporter1.name}${supporter1.grade}성  ${supporter2.name}${supporter2.grade}성 |${chalk.red(`| 다음보스 : ${monster.name} |`)}`)
    );
    console.log(chalk.magentaBright(`=====================\n`));
}


// 캐릭터 뽑기 함수 : purchase에서 사용
function characterpick(logs, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2) {

    const pick = Math.floor(Math.random() * 6);
    switch (pick) {
        case 0:
            if (++tanker1.experience === tanker1.Maxexperience) {

                // 승급 사운드
                const advancement = path.join(__dirname, 'sounds', 'advancement.wav');
                wavPlayer.play({ path: advancement }).then(() => { });


                // 승급 효과
                tanker1.experience = 0;
                tanker1.Maxexperience++;
                tanker1.grade++;
                logs.push(chalk.redBright(`${chalk.blue(`${tanker1.name}`)}이 ${chalk.red(`${tanker1.grade}`)}성으로 승급하였습니다!!`));
            }
            else {

                // 뽑기 사운드 / 효과
                const pick = path.join(__dirname, 'sounds', 'pick.wav');
                wavPlayer.play({ path: pick }).then(() => { });
                logs.push(`${chalk.blue(`${tanker1.name}`)}의 경험치가${chalk.red(`${tanker1.experience}`)}로 증가하였습니다!!`);
            }
            break;


        case 1:
            if (++tanker2.experience === tanker2.Maxexperience) {

                // 승급 사운드
                const advancement = path.join(__dirname, 'sounds', 'advancement.wav');
                wavPlayer.play({ path: advancement }).then(() => { });


                // 승급 효과
                tanker2.experience = 0;
                tanker2.Maxexperience++;
                tanker2.grade++;
                logs.push(chalk.redBright(`${chalk.blue(`${tanker2.name}`)}이 ${chalk.red(`${tanker2.grade}`)}성으로 승급하였습니다!!`));
            }
            else {

                // 뽑기 사운드 / 효과
                const pick = path.join(__dirname, 'sounds', 'pick.wav');
                wavPlayer.play({ path: pick }).then(() => { });
                logs.push(`${chalk.blue(`${tanker2.name}`)}의 경험치가${chalk.red(`${tanker2.experience}`)}로 증가하였습니다!!`);
            }
            break;


        case 2:
            if (++dealer1.experience === dealer1.Maxexperience) {

                // 승급 사운드
                const advancement = path.join(__dirname, 'sounds', 'advancement.wav');
                wavPlayer.play({ path: advancement }).then(() => { });


                // 승급 효과
                dealer1.experience = 0;
                dealer1.Maxexperience++;
                dealer1.grade++;
                logs.push(chalk.redBright(`${chalk.blue(`${dealer1.name}`)}이 ${chalk.red(`${dealer1.grade}`)}성으로 승급하였습니다!!`));
            }
            else {

                // 뽑기 사운드 / 효과
                const pick = path.join(__dirname, 'sounds', 'pick.wav');
                wavPlayer.play({ path: pick }).then(() => { });
                logs.push(`${chalk.blue(`${dealer1.name}`)}의 경험치가${chalk.red(`${dealer1.experience}`)}로 증가하였습니다!!`);
            }
            break;


        case 3:
            if (++dealer2.experience === dealer2.Maxexperience) {

                // 승급 사운드
                const advancement = path.join(__dirname, 'sounds', 'advancement.wav');
                wavPlayer.play({ path: advancement }).then(() => { });


                // 승급 효과
                dealer2.experience = 0;
                dealer2.Maxexperience++;
                dealer2.grade++;
                logs.push(chalk.redBright(`${chalk.blue(`${dealer2.name}`)}이 ${chalk.red(`${dealer2.grade}`)}성으로 승급하였습니다!!`));
            }
            else {

                // 뽑기 사운드 / 효과
                const pick = path.join(__dirname, 'sounds', 'pick.wav');
                wavPlayer.play({ path: pick }).then(() => { });
                logs.push(`${chalk.blue(`${dealer2.name}`)}의 경험치가${chalk.red(`${dealer2.experience}`)}로 증가하였습니다!!`);
            }
            break;


        case 4:
            if (++supporter1.experience === supporter1.Maxexperience) {

                // 승급 사운드
                const advancement = path.join(__dirname, 'sounds', 'advancement.wav');
                wavPlayer.play({ path: advancement }).then(() => { });


                // 승급 효과
                supporter1.experience = 0;
                supporter1.Maxexperience++;
                supporter1.grade++;
                logs.push(chalk.redBright(`${chalk.blue(`${supporter1.name}`)}이 ${chalk.red(`${supporter1.grade}`)}성으로 승급하였습니다!!`));
            }
            else {

                // 뽑기 사운드 / 효과
                const pick = path.join(__dirname, 'sounds', 'pick.wav');
                wavPlayer.play({ path: pick }).then(() => { });
                logs.push(`${chalk.blue(`${supporter1.name}`)}의 경험치가${chalk.red(`${supporter1.experience}`)}로 증가하였습니다!!`);
            }
            break;


        case 5:
            if (++supporter2.experience === supporter2.Maxexperience) {

                // 승급 사운드
                const advancement = path.join(__dirname, 'sounds', 'advancement.wav');
                wavPlayer.play({ path: advancement }).then(() => { });


                // 승급 효과
                supporter2.experience = 0;
                supporter2.Maxexperience++;
                supporter2.grade++;
                logs.push(chalk.redBright(`${chalk.blue(`${supporter2.name}`)}이 ${chalk.red(`${supporter2.grade}`)}성으로 승급하였습니다!!`));
            }
            else {

                // 뽑기 사운드 / 효과
                const pick = path.join(__dirname, 'sounds', 'pick.wav');
                wavPlayer.play({ path: pick }).then(() => { });
                logs.push(`${chalk.blue(`${supporter2.name}`)}의 경험치가${chalk.red(`${supporter2.experience}`)}로 증가하였습니다!!`);
            }
            break;
    }
}


// 마법의 상점 함수 : purchase에서 사용
function Magicalshop(free, MagicalshopN, player, stage, monster, logs, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2) {

    console.clear();

    // 무료뽑기 사용완료 구분
    ShopStatus(player, stage, monster, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
    if (free) {
        console.log(`${chalk.green(`${chalk.blue.bold(`0.무료뽑기 1회`)}  1.허약의 저주(200원)  2.시간의 사슬(200원)  3.신의 형벌(200원)  9.상점 나가기`)}`);
    } else {
        console.log(`${chalk.green(`${chalk.gray(`0.무료뽑기 1회`)}  1.허약의 저주(200원)  2.시간의 사슬(200원)  3.신의 형벌(200원)  9.상점 나가기`)}`);
    }


    console.log(`무엇을 고르시겠어요?`);
    logs.forEach(log => { console.log(log) });


    // 상품 선택 효과
    const shopchoice = readlineSync.question('');
    switch (shopchoice) {

        // 무료뽑기
        case '0':
            if (free) {
                free--;
                characterpick(logs, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
                Magicalshop(free, MagicalshopN, player, stage, monster, logs, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
            } else {
                const fail = path.join(__dirname, 'sounds', 'fail.wav');
                wavPlayer.play({ path: fail }).then(() => { });
                logs.push(`${chalk.red(`이번 무료뽑기는 이미 사용하셨습니다.`)}`)
                Magicalshop(free, MagicalshopN, player, stage, monster, logs, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
            }
            break;


        // 공격력 약화의 영약 
        case '1':

            // 보스 공격력 약 10% 하향
            if (player.gold >= 200) {
                player.gold -= 200;
                const purchase = path.join(__dirname, 'sounds', 'purchase.wav');
                wavPlayer.play({ path: purchase }).then(() => { });
                const powerweaken = Math.ceil((0.8 + Math.random() * 0.4) * monster.attackpower * 0.1);
                monster.attackpower -= powerweaken;
                logs.push(`${chalk.red(`${monster.name}`)}이(가) 허약의 저주에 걸려 이번 스테이지 동안 공격력이 ${chalk.red(powerweaken)}약화됩니다.`);
            } else {

                // 골드 부족 사운드 / 문구
                const fail = path.join(__dirname, 'sounds', 'fail.wav');
                wavPlayer.play({ path: fail }).then(() => { });
                logs.push(chalk.red(`골드가 ${200 - player.gold}원 부족합니다.`));
            }
            Magicalshop(free, MagicalshopN, player, stage, monster, logs, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
            break;


        case '2':

            // 보스 공격속도 쿨 약 15% 상승
            if (player.gold >= 200) {
                player.gold -= 200;
                const purchase = path.join(__dirname, 'sounds', 'purchase.wav');
                wavPlayer.play({ path: purchase }).then(() => { });
                const skillweaken = Math.ceil((0.8 + Math.random() * 0.4) * monster.skillcool * 0.15);
                monster.skillcool += skillweaken;
                logs.push(`${chalk.red(`${monster.name}`)}이(가) 시간의 사슬을 맞아 이번 스테이지 동안 공격속도가 ${chalk.red(`${Math.floor(100*skillweaken/(skillweaken + monster.skillcool))}%`)}감소합니다.`);
            } else {

                // 골드 부족 사운드 / 문구
                const fail = path.join(__dirname, 'sounds', 'fail.wav');
                wavPlayer.play({ path: fail }).then(() => { });
                logs.push(chalk.red(`골드가 ${200 - player.gold}원 부족합니다.`));
            }
            Magicalshop(free, MagicalshopN, player, stage, monster, logs, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
            break;


        case '3':

            // 보스 체력 약 10% 하락
            if (player.gold >= 200) {
                player.gold -= 200;
                const purchase = path.join(__dirname, 'sounds', 'purchase.wav');
                wavPlayer.play({ path: purchase }).then(() => { });
                const Hpdamaged = Math.ceil((0.8 + Math.random() * 0.4) * monster.hp * 0.1);
                monster.hp -= Hpdamaged;
                logs.push(`${chalk.red(`${monster.name}`)}가 신의 형벌을 맞아 ${chalk.red(Hpdamaged)}의 피해를 입습니다.`);
            } else {

                // 골드 부족 사운드 / 문구
                const fail = path.join(__dirname, 'sounds', 'fail.wav');
                wavPlayer.play({ path: fail }).then(() => { });
                logs.push(chalk.red(`골드가 ${200 - player.gold}원 부족합니다.`));
            }
            Magicalshop(free, MagicalshopN, player, stage, monster, logs, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
            break;


        // 함수 종료시 상점 재 생성 (free인자 업데이트)
        case '9':
            purchase(free, MagicalshopN, player, stage, monster, logs, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
            break;


        default:
            logs.push(chalk.red('올바른 선택을 하세요.'));
            Magicalshop(free, MagicalshopN, player, stage, monster, logs, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);

    }

}


// 출전 UI : shop에서 사용
function characterStatus(monster, stage, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2) {
    console.log(chalk.magentaBright(`\n=== Current Status ===`));
    console.log(
        chalk.redBright(`| 이번 스테이지 보스: ${monster.name}LV${stage} |`) +
        chalk.blueBright(`| ${tanker1.name}${tanker1.grade}성  ${tanker2.name}${tanker2.grade}성  ${dealer1.name}${dealer1.grade}성  ${dealer2.name}${dealer2.grade}성  ${supporter1.name}${supporter1.grade}성  ${supporter2.name}${supporter2.grade}성 |`)
    );
    console.log(chalk.magentaBright(`=====================\n`));
}


// 캐릭터 선택 관련 함수 : shop에서 사용
function CharacterChioce1(player, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2) {
    const choice = readlineSync.question('전방 캐릭터를 선택하세요');
    switch (choice) {
        case '1':
            player.Firstcharacter = tanker1;
            break;
        case '2':
            player.Firstcharacter = tanker2;
            break;
        case '3':
            player.Firstcharacter = dealer1;
            break;
        case '4':
            player.Firstcharacter = dealer2;
            break;
        case '5':
            player.Firstcharacter = supporter1;
            break;
        case '6':
            player.Firstcharacter = supporter2;
            break;
        default:
            console.log(chalk.red('올바른 선택을 하세요.'));
            return CharacterChioce1(player, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
    }
    return choice;
}
function CharacterChioce2(choice1, player, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2) {
    const choice = readlineSync.question('중앙 캐릭터를 선택하세요');
    if (choice1 == choice) {
        console.log(`이미 선택된 캐릭터 입니다.`)
        CharacterChioce2(choice1, player, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
    } else {
        switch (choice) {
            case '1':
                player.Secondcharacter = tanker1;
                break;
            case '2':
                player.Secondcharacter = tanker2;
                break;
            case '3':
                player.Secondcharacter = dealer1;
                break;
            case '4':
                player.Secondcharacter = dealer2;
                break;
            case '5':
                player.Secondcharacter = supporter1;
                break;
            case '6':
                player.Secondcharacter = supporter2;
                break;
            default:
                console.log(chalk.red('올바른 선택을 하세요.'));
                return CharacterChioce2(choice1, player, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
        }
    }
    return choice;
}
function CharacterChioce3(choice1, choice2, player, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2) {
    let choice = readlineSync.question('후방 캐릭터를 선택하세요');
    if (choice1 === choice || choice2 === choice) {
        console.log(`이미 선택된 캐릭터 입니다.`)
        return CharacterChioce3(choice1, choice2, player, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
    } else {
        switch (choice) {
            case '1':
                player.Thirdcharacter = tanker1;
                break;
            case '2':
                player.Thirdcharacter = tanker2;
                break;
            case '3':
                player.Thirdcharacter = dealer1;
                break;
            case '4':
                player.Thirdcharacter = dealer2;
                break;
            case '5':
                player.Thirdcharacter = supporter1;
                break;
            case '6':
                player.Thirdcharacter = supporter2;
                break;
            default:
                console.log(chalk.red('올바른 선택을 하세요.'));
                CharacterChioce3(choice1, choice2, player, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
        }
    }
}

