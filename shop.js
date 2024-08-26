import readlineSync from 'readline-sync';
import chalk from 'chalk';


// 상점 함수
export async function shop(player, stage, monster, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2) {

    // 상점에서 캐릭터 뽑기 및 버프 구입
    let logs = [];
    function purchase() {
        console.clear();
        ShopStatus(player, stage, monster, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
        console.log(`${chalk.green(`1.캐릭터 뽑기1회(100원)  2.캐릭터 뽑기10회(1000원)  3.구현중  9.상점 나가기`)}`);
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
                    logs.push(chalk.red(`골드가 ${100 - player.gold}원 부족합니다.`));
                }
                purchase();
                break;


            // 캐릭터 뽑기 10회 선택   
            case '2':
                if (player.gold >= 1000) {
                    player.gold -= 1000;
                    for (let i = 0; i < 10; i++) {
                        characterpick(logs, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);
                    }
                } else {
                    logs.push(chalk.red(`골드가 ${1000 - player.gold}원 부족합니다.`));
                }
                purchase();
                break;


            case '3':
                logs.push(`구현중`);
                purchase();
                break;
            case '9':
                break;

            default:
                console.log(chalk.red('올바른 선택을 하세요.'));
                purchase();
        }
    }
    purchase();


    // 출전 캐릭터 3명 선택
    console.clear();
    characterStatus(monster, stage, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2);

    
    // 전방 캐릭터 선택
    const choice1 = CharacterChioce1();
    console.log(`${chalk.blueBright(`${player.Firstcharacter.name}`)}(이)가 전방을 책임지고 있습니다! \n`);


    // 중앙 캐릭터 선택 (choice1을 받아서 중복인지 확인)
    const choice2 = CharacterChioce2(choice1);
    console.log(`${chalk.blueBright(`${player.Secondcharacter.name}`)}(이)가 중앙에서 예열중입니다! \n`);


    // 후열 캐릭터 선택 (choice1,choice2를 받아서 중복인지 확인)
    CharacterChioce3(choice1, choice2);
    console.log(`${chalk.blueBright(`${player.Thirdcharacter.name}`)}(이)가 후방을 맡고있습니다! \n`);

    
    // 선택된 캐릭터 체력정보 업데이트
    player.Firstcharacter.hp = player.Firstcharacter.Maxhp;
    player.Secondcharacter.hp = player.Secondcharacter.Maxhp;
    player.Thirdcharacter.hp = player.Thirdcharacter.Maxhp;

    // 캐릭터 선택 관련 함수
    function CharacterChioce1() {
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
                CharacterChioce1();
        }
        return choice;
    }
    function CharacterChioce2(choice1) {
        const choice = readlineSync.question('중앙 캐릭터를 선택하세요');
        if (choice1 == choice) {
            console.log(`이미 선택된 캐릭터 입니다.`)
            CharacterChioce2(choice1);
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
                    CharacterChioce2(choice1);
            }
        }
        return choice;
    }
    function CharacterChioce3(choice1, choice2) {
        let choice = readlineSync.question('후방 캐릭터를 선택하세요');
        if (choice1 == choice || choice2 == choice) {
            console.log(`이미 선택된 캐릭터 입니다.`)
            CharacterChioce3(choice1, choice2);
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
                    CharacterChioce3(choice1, choice2);
            }
        }
    }
}


// 상점 UI
function ShopStatus(player, stage, monster, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2) {
    console.log(chalk.magentaBright(`\n=== Current Status ===`));
    console.log(
        chalk.redBright(`| Stage: ${stage} |`) +
        chalk.blueBright(`${chalk.yellow(`| 골드 : ${player.gold} |`)}| ${tanker1.name}${tanker1.grade}성  ${tanker2.name}${tanker2.grade}성  ${dealer1.name}${dealer1.grade}성  ${dealer2.name}${dealer2.grade}성  ${supporter1.name}${supporter1.grade}성  ${supporter2.name}${supporter2.grade}성 |${chalk.red(`| 다음보스 : ${monster.name} |`)}`)
    );
    console.log(chalk.magentaBright(`=====================\n`));
}


// 출전 UI
function characterStatus(monster, stage, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2) {
    console.log(chalk.magentaBright(`\n=== Current Status ===`));
    console.log(
        chalk.redBright(`| 이번 스태이지 보스: ${monster.name}LV${stage} |`) +
        chalk.blueBright(`| ${tanker1.name}${tanker1.grade}성  ${tanker2.name}${tanker2.grade}성  ${dealer1.name}${dealer1.grade}성  ${dealer2.name}${dealer2.grade}성  ${supporter1.name}${supporter1.grade}성  ${supporter2.name}${supporter2.grade}성 |`)
    );
    console.log(chalk.magentaBright(`=====================\n`));
}


// 캐릭터 뽑기 함수
function characterpick(logs, tanker1, tanker2, dealer1, dealer2, supporter1, supporter2) {
    const pick = Math.floor(Math.random() * 6);
    switch (pick) {
        case 0:
            if (++tanker1.experience === tanker1.Maxexperience) {
                tanker1.experience = 0;
                tanker1.Maxexperience++;
                tanker1.grade++;
                logs.push(`${chalk.blue(`${tanker1.name}`)}이 ${chalk.red(`${tanker1.grade}`)}성으로 승급하였습니다!!`);
            }
            else {
                logs.push(`${chalk.blue(`${tanker1.name}`)}의 경험치가${chalk.red(`${tanker1.experience}`)}로 증가하였습니다!!`);
            }
            break;


        case 1:
            if (++tanker2.experience === tanker2.Maxexperience) {
                tanker2.experience = 0;
                tanker2.Maxexperience++;
                tanker2.grade++;
                logs.push(`${chalk.blue(`${tanker2.name}`)}가 ${chalk.red(`${tanker2.grade}`)}성으로 승급하였습니다!!`);
            }
            else {
                logs.push(`${chalk.blue(`${tanker2.name}`)}의 경험치가${chalk.red(`${tanker2.experience}`)}로 증가하였습니다!!`);
            }
            break;

        case 2:
            if (++dealer1.experience === dealer1.Maxexperience) {
                dealer1.experience = 0;
                dealer1.Maxexperience++;
                dealer1.grade++;
                logs.push(`${chalk.blue(`${dealer1.name}`)}이 ${chalk.red(`${dealer1.grade}`)}성으로 승급하였습니다!!`);
            }
            else {
                logs.push(`${chalk.blue(`${dealer1.name}`)}의 경험치가${chalk.red(`${dealer1.experience}`)}로 증가하였습니다!!`);
            }
            break;

        case 3:
            if (++dealer2.experience === dealer2.Maxexperience) {
                dealer2.experience = 0;
                dealer2.Maxexperience++;
                dealer2.grade++;
                logs.push(`${chalk.blue(`${dealer2.name}`)}이 ${chalk.red(`${dealer2.grade}`)}성으로 승급하였습니다!!`);
            }
            else {
                logs.push(`${chalk.blue(`${dealer2.name}`)}의 경험치가${chalk.red(`${dealer2.experience}`)}로 증가하였습니다!!`);
            }
            break;

        case 4:
            if (++supporter1.experience === supporter1.Maxexperience) {
                supporter1.experience = 0;
                supporter1.Maxexperience++;
                supporter1.grade++;
                logs.push(`${chalk.blue(`${supporter1.name}`)}가 ${chalk.red(`${supporter1.grade}`)}성으로 승급하였습니다!!`);
            }
            else {
                logs.push(`${chalk.blue(`${supporter1.name}`)}의 경험치가${chalk.red(`${supporter1.experience}`)}로 증가하였습니다!!`);
            }
            break;

        case 5:
            if (++supporter2.experience === supporter2.Maxexperience) {
                supporter2.experience = 0;
                supporter2.Maxexperience++;
                supporter2.grade++;
                logs.push(`${chalk.blue(`${supporter2.name}`)}가 ${chalk.red(`${supporter2.grade}`)}성으로 승급하였습니다!!`);
            }
            else {
                logs.push(`${chalk.blue(`${supporter2.name}`)}의 경험치가${chalk.red(`${supporter2.experience}`)}로 증가하였습니다!!`);
            }
            break;
    }
}

