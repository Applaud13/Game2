import chalk from "chalk";

// 강한 공격을 가하는 보스 (그림자 처형자)
export class Boss1 {
    constructor(stage) {
        this.name = `그림자 처형자`;
        this.Maxhp = 160 + stage * 110;
        this.hp = 160 + stage * 110;
        this.skillcool = 700;
        this.BattletimeUse = -350;
        this.attackpower = 7 + stage * 5;
        this.skill = function (Battletime, logs, player) {
            if (Battletime > this.skillcool + this.BattletimeUse) {

                // 쿨타임 적용
                this.BattletimeUse += this.skillcool;


                // 스킬 : 전방부터 살아있는 적을 타깃으로하여 공격력 만큼의 피해를 가함
                let Deal = Math.floor((0.8 + Math.random() * 0.4) * this.attackpower);


                // 살아있는 전방 타깃 탐색
                let Target = player.Thirdcharacter;
                if (player.Firstcharacter.hp > 0) {
                    Target = player.Firstcharacter;
                    if (Target.Bufftime) {
                        Deal = Math.floor(Deal * 0.5);
                    }
                } else if (player.Secondcharacter.hp > 0) {
                    Target = player.Secondcharacter;
                }

                // 최종 공격 실행
                Target.hp -= Deal;
                logs.push(`${chalk.red(`${this.name}`)}이 죽음의 표식을 사용하여 ${chalk.blue(`${Target.name}`)}에게 ${chalk.red(`${Deal}`)}의 피해를 입혔습니다!!`);
            }
        }
    }
}


// 체력이 높은 보스 (철갑 레비아탄)
export class Boss2 {
    constructor(stage) {
        this.name = `철갑 레비아탄`;
        this.Maxhp = 250 + stage * 180;
        this.hp = 250 + stage * 180;
        this.skillcool = 600;
        this.BattletimeUse = -300;
        this.attackpower = 6 + 4 * stage;
        this.skill = function (Battletime, logs, player) {
            if (Battletime > this.skillcool + this.BattletimeUse) {

                // 쿨타임 적용
                this.BattletimeUse += this.skillcool;


                // 스킬 : 전방부터 살아있는 적을 타깃으로하여 공격력만큼의 피해를 가함
                let Deal = Math.floor((0.8 + Math.random() * 0.4) * this.attackpower);


                // 살아있는 전방 타깃 탐색
                let Target = player.Thirdcharacter;
                if (player.Firstcharacter.hp > 0) {
                    Target = player.Firstcharacter;
                    if (Target.Bufftime) {
                        Deal = Math.floor(Deal * 0.5);
                    }
                } else if (player.Secondcharacter.hp > 0) {
                    Target = player.Secondcharacter;
                }

                // 최종 공격 실행
                Target.hp -= Deal;
                logs.push(`${chalk.red(`${this.name}`)}이 철갑의 강타를 사용하여 ${chalk.blue(`${Target.name}`)}에게 ${chalk.red(`${Deal}`)}의 피해를 입혔습니다!!`);
            }
        }
    }
}


// 적군 전체에게 공격을 가하는 보스 (심연의 폭군)
export class Boss3 {
    constructor(stage) {
        this.name = `심연의 폭군`;
        this.Maxhp = 140 + stage * 100;
        this.hp = 140 + stage * 100;
        this.skillcool = 800;
        this.BattletimeUse = -600;
        this.attackpower = 8 + stage * 5;
        this.skill = function (Battletime, logs, player) {
            if (Battletime > this.skillcool + this.BattletimeUse) {

                // 쿨타임 적용
                this.BattletimeUse += this.skillcool;


                // 스킬 : 모든 적에게 공격력의 절반의 피해를 가함
                let Deal = Math.floor((0.8 + Math.random() * 0.4) * this.attackpower * 0.5);


                // 최종 공격 실행
                player.Firstcharacter.Bufftime ? player.Firstcharacter.hp -= Math.floor(Deal/2) : player.Firstcharacter.hp -= Deal;
                player.Secondcharacter.hp -= Deal;
                player.Thirdcharacter.hp -= Deal;
                logs.push(`${chalk.red(`${this.name}`)}이 멸망의 파도을 사용하여 ${chalk.blue(`아군 모두`)}에게 ${chalk.red(`${Deal}`)}의 피해를 입혔습니다!!`);
            }
        }
    }
}
