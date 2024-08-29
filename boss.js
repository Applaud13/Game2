import chalk from "chalk";


// 강한 공격을 가하는 보스 (그림자 처형자)
export class Boss1 {
    constructor(stage) {
        this.name = `그림자 처형자`;
        this.Maxhp = 200 + stage * 80;
        this.hp = 200 + stage * 80;
        this.skillcool = 700;
        this.BattletimeUse = -350;
        this.attackpower = 7 + stage * 5;
    }


    skill = function (Battletime, logs, player) {
        if (Battletime > this.skillcool + this.BattletimeUse) {

            // 쿨타임 적용
            this.BattletimeUse += this.skillcool;


            // 스킬 : 타겟 1명에게 피해를 가함
            let Deal = Math.floor((0.8 + Math.random() * 0.4) * this.attackpower);


            // 살아있는 가장 가까운 적을 타겟으로 함
            let Target = player.Thirdcharacter;
            if (player.Firstcharacter.hp > 0) {
                Target = player.Firstcharacter;
                if (Target.Bufftime>0) {
                    Deal = Math.floor(Deal * 0.5);
                }
            } else if (player.Secondcharacter.hp > 0) {
                Target = player.Secondcharacter;
            }

            // 최종 공격 실행
            Target.hp -= Deal;
            logs.push(`${chalk.red(`${this.name}`)}가 죽음의 표식을 사용하여 ${chalk.blue(`${Target.name}`)}에게 ${chalk.red(`${Deal}`)}의 피해를 입혔습니다.`);
        }
    }
}


// 체력이 높은 보스 (철갑 레비아탄)
export class Boss2 {
    constructor(stage) {
        this.name = `철갑 레비아탄`;
        this.Maxhp = 300 + stage * 120;
        this.hp = 300 + stage * 120;
        this.skillcool = 600;
        this.BattletimeUse = -300;
        this.attackpower = 6 + 4 * stage;
    }


    skill = function (Battletime, logs, player) {
        if (Battletime > this.skillcool + this.BattletimeUse) {

            // 쿨타임 적용
            this.BattletimeUse += this.skillcool;


            // 스킬 : 타겟 1명에게 피해를 가함
            let Deal = Math.floor((0.8 + Math.random() * 0.4) * this.attackpower);


            // 살아있는 가장 가까운 적을 타겟으로 함
            let Target = player.Thirdcharacter;
            if (player.Firstcharacter.hp > 0) {
                Target = player.Firstcharacter;
                if (Target.Bufftime>0) {
                    Deal = Math.floor(Deal * 0.5);
                }
            } else if (player.Secondcharacter.hp > 0) {
                Target = player.Secondcharacter;
            }

            // 최종 공격 실행
            Target.hp -= Deal;
            logs.push(`${chalk.red(`${this.name}`)}이 철갑의 강타를 사용하여 ${chalk.blue(`${Target.name}`)}에게 ${chalk.red(`${Deal}`)}의 피해를 입혔습니다.`);
        }
    }
}


// 적군 전체에게 공격을 가하는 보스 (심연의 폭군)
export class Boss3 {
    constructor(stage) {
        this.name = `심연의 폭군`;
        this.Maxhp = 180 + stage * 70;
        this.hp = 180 + stage * 70;
        this.skillcool = 800;
        this.BattletimeUse = -400;
        this.attackpower = 9 + stage * 5;
    }


    skill = function (Battletime, logs, player) {
        if (Battletime > this.skillcool + this.BattletimeUse) {

            // 쿨타임 적용
            this.BattletimeUse += this.skillcool;


            // 스킬 : 모든 적에게 피해를 가함
            let Deal = Math.floor((0.8 + Math.random() * 0.4) * this.attackpower * 0.5);


            // 최종 공격 실행
            player.Firstcharacter.Bufftime>0 ? player.Firstcharacter.hp -= Math.floor(Deal/2) : player.Firstcharacter.hp -= Deal;
            player.Secondcharacter.hp -= Deal;
            player.Thirdcharacter.hp -= Deal;
            logs.push(`${chalk.red(`${this.name}`)}이 멸망의 파도를 사용하여 ${chalk.blue(`아군 모두`)}에게 ${chalk.red(`${Deal}`)}의 피해를 입혔습니다.`);
        }
    }
}
