import chalk from "chalk";

export class Player {
    constructor () {
        this.gold = 300;
        this.win = true;
        this.Firstcharacter = null;
        this.Secondcharacter = null;
        this.Thirdcharacter = null;
    }
}


// 루시우스 (받는 피해량 반감)
export class Tanker1 {
    constructor () {
        this.name = `루시우스`;
        this.description = ``;
        this.grade = 1;
        this.Maxexperience = 1;
        this.experience =0;
        this.hp = 120;
        this.skillcool = 5000;
        this.Bufftime = 0;
        this.BattletimeUse = -this.skillcool/2;
        // 자신에게 대미지 지속시간동안 대미지를 반감 시켜주는 버프발동 및 공격력의 피해
        this.skill = function (Battletime, logs, player, monster) {
            this.Bufftime -= 100;
            if(Battletime > this.skillcool + this.BattletimeUse && this.hp>0) {
                this.BattletimeUse += this.skillcool;
                const Deal = Math.ceil(Math.random() * this.attackpower);
                this.Bufftime = 3000;
                monster.hp -= Deal;
                logs.push(`${chalk.blue(`${this.name}`)}가 신성한 축복을 시전하여 ${chalk.red(`${monster.name}`)}에게 ${chalk.red(`${Deal}`)}의 피해를 입히고 ${chalk.green(`${this.Bufftime/1000}`)}초 동안 본인이 받는피해가 반으로 줄어듭니다!!`);
            }
        }
    }
    get Maxhp () {
        return 60 + this.grade * 60;
    }
    get attackpower () {
        return 6 + this.grade * 6;
    }
}


// 레오나 (상대 행동 불능)
export class Tanker2 {
    constructor () {
        this.name = `레오나`;
        this.description = ``;
        this.grade = 1;
        this.Maxexperience = 1;
        this.experience =0;
        this.hp = 110;
        this.skillcool = 2500;
        this.Bufftime = 0;
        this.BattletimeUse = -this.skillcool/2;
        // 상대에게 1초간 스턴을 가하고 공격력의 2배의 피해를 가함
        this.skill = function (Battletime, logs, player, monster) {
            if(Battletime > this.skillcool + this.BattletimeUse && this.hp>0) {
                this.BattletimeUse += this.skillcool;
                const Deal = Math.ceil((0.8 + Math.random()*0.4) * 2 * this.attackpower)
                monster.BattletimeUse += 1000;
                monster.hp -= Deal;
                logs.push(`${chalk.blue(`${this.name}`)}가 ${chalk.red(`${monster.name}`)}에게 천공의 검을 사용하여 ${chalk.red(`1`)}초간 스턴을 가하고 ${chalk.red(`${Deal}의 피해를 입혔습니다.`)}!`);
            }
        }
    }
    get Maxhp () {
        return 65 + this.grade * 65;
    }
    get attackpower () {
        return 7 + this.grade * 7;
    }
}


// 트위스티드페이트 (랜덤한 횟수로공격)
export class Dealer1 {
    constructor () {
        this.name = `트위스티드페이트`;
        this.description = `주사위를 굴려 한번에 여러번 공격을 가하는 캐릭터입니다.`;
        this.grade = 1;
        this.Maxexperience = 1;
        this.experience =0;
        this.hp = 70;
        this.skillcool = 2700;
        this.Bufftime = 0;
        this.BattletimeUse = -this.skillcool/2;
        // 공격력 만큼의 피해를 1~6번 랜덤하게 가함
        this.skill = function (Battletime, logs, player, monster) {
            if(Battletime > this.skillcool + this.BattletimeUse && this.hp>0) {
                this.BattletimeUse += this.skillcool;
                const Luck = Math.floor(Math.random()*6 + 1);
                const Deal = Math.ceil((0.8 + Math.random()*0.4) * this.attackpower);
                monster.hp -= Deal * Luck;
                logs.push(`행운의 주사위에서${chalk.blue(`${Luck}`)}의 숫자가 나왔습니다. ${chalk.blue(`${this.name}`)}가 ${chalk.red(`${monster.name}`)}에게 ${chalk.red(`${Deal}`)}의 피해를${chalk.red(`${Luck}`)}번 가하였습니다!!`);
            }
        }
    }
    get Maxhp () {
        return 35 + this.grade * 35;
    }
    get attackpower () {
        return 12 + this.grade * 12;
    }
}


// 흐웨이 (최대체력 비례피해)
export class Dealer2 {
    constructor () {
        this.name = `흐웨이`;
        this.description = `최대체력 비례 대미지를 가지고 있는 딜러입니다.`;
        this.grade = 1;
        this.Maxexperience = 1;
        this.experience =0;
        this.hp = 80;
        this.skillcool = 2200;
        this.Bufftime = 0;
        this.BattletimeUse = -this.skillcool/2;
        //공격력의 2배 + 보스 최대체력5% 만큼의 피해를 가함
        this.skill = function (Battletime, logs, player, monster) {
            if(Battletime > this.skillcool + this.BattletimeUse && this.hp>0) {
                this.BattletimeUse += this.skillcool;
                const Deal = Math.ceil((0.8 + Math.random()*0.4) * this.attackpower * 2 + monster.Maxhp * 0.05);
                monster.hp -= Deal;
                logs.push(`${chalk.blue(`${this.name}`)}가 녹아내린 균열을 사용하여 ${chalk.red(`${monster.name}`)}에게 ${chalk.red(`${Deal}`)}의 피해를 입혔습니다.`);
            }
        }
    }
    get Maxhp () {
        return 40 + this.grade * 40;
    }
    get attackpower () {
        return 10 + this.grade * 10;
    }
}


// 소라카 (아군 전체 치유)
export class Supporter1 {
    constructor () {
        this.name = `소라카`;
        this.description = `아군 전체를 회복시켜주는 힐러입니다.`;
        this.grade = 1;
        this.Maxexperience = 1;
        this.experience =0;
        this.hp = 80;
        this.skillcool = 4500;
        this.Bufftime = 0;
        this.BattletimeUse = -this.skillcool/2;
        //공격력의 1.5배만큼 살아있는 아군 모두를 치유한 후 공격력의 2배만큼 상대에게 피해를 가함
        this.skill = function (Battletime, logs, player, monster) {
            if(Battletime > this.skillcool + this.BattletimeUse && this.hp>0) {
                this.BattletimeUse += this.skillcool;
                // 힐 적용
                const Heal = Math.ceil((0.8 + Math.random()*0.4) * this.attackpower * 1.5);
                player.Firstcharacter.hp > 0 ? player.Firstcharacter.hp += Math.min(Heal, player.Firstcharacter.Maxhp - player.Firstcharacter.hp) : null;
                player.Secondcharacter.hp > 0 ? player.Secondcharacter.hp += Math.min(Heal, player.Secondcharacter.Maxhp - player.Secondcharacter.hp) : null;
                player.Thirdcharacter.hp > 0 ? player.Thirdcharacter.hp += Math.min(Heal, player.Thirdcharacter.Maxhp - player.Thirdcharacter.hp) : null;
                // 딜 적용
                const Deal = Math.ceil(this.attackpower * 2);
                monster.hp -= Deal;
                logs.push(`${chalk.blue(`${this.name}`)}가 별의기원을 사용하여 ${chalk.blue(`아군모두`)}의 체력을${chalk.green(`${Heal}`)}만큼 회복시키고 ${chalk.red(`${monster.name}`)}에게 ${chalk.red(`${Deal}`)}의 피해를 입혔습니다!!`);
            }
        }
    }
    get Maxhp () {
        return 40 + this.grade * 40;
    }
    get attackpower () {
        return 8 + this.grade * 8;
    }
}


// 나미 (위험한 아군 치유)
export class Supporter2 {
    constructor () {
        this.name = `나미`;
        this.description = `가장 위험에 처한 아군 1명을 빠르게 치유해주는 힐러입니다.`;
        this.grade = 1;
        this.Maxexperience = 1;
        this.experience =0;
        this.hp = 80;
        this.skillcool = 4000;
        this.Bufftime = 0;
        this.BattletimeUse = -this.skillcool/2;
        //공격력의 2배만큼 살아있는 아군 중 현재 체력비율이 가장낮은 아군을 치유하고 적에게 공격력의 3배만큼 피해
        this.skill = function (Battletime, logs, player, monster) {
            if(Battletime > this.skillcool + this.BattletimeUse && this.hp>0) {
                this.BattletimeUse += this.skillcool;
                // 체력 비율이 낮은 아군을 찾아 힐 시전
                const Heal = Math.ceil((0.8 + Math.random()*0.4) * this.attackpower * 2);
                const HPrate1 = player.Firstcharacter.hp/player.Firstcharacter.Maxhp;
                const HPrate2 = player.Secondcharacter.hp/player.Secondcharacter.Maxhp;
                const HPrate3 = player.Thirdcharacter.hp/player.Thirdcharacter.Maxhp;
                const Dangerous = Math.min(HPrate1, HPrate2, HPrate3);
                let DangerousName;
                if(Dangerous === HPrate1 && HPrate1 > 0){
                    player.Firstcharacter.hp += Math.min(Heal, player.Firstcharacter.Maxhp - player.Firstcharacter.hp);
                    DangerousName = player.Firstcharacter.name;
                } else if (Dangerous === HPrate2 && HPrate2 > 0) {
                    player.Secondcharacter.hp += Math.min(Heal, player.Secondcharacter.Maxhp - player.Secondcharacter.hp);
                    DangerousName = player.Secondcharacter.name;
                } else {
                    player.Thirdcharacter.hp += Math.min(Heal, player.Thirdcharacter.Maxhp - player.Thirdcharacter.hp);
                    DangerousName = player.Thirdcharacter.name;
                }
                // 공격력의 3배 딜 시전
                const Deal = Math.ceil(this.attackpower * 3);
                logs.push(`${chalk.blue(`${this.name}`)}가 파도의 축복을 사용하여 ${chalk.blue(`${DangerousName}`)} 체력을${chalk.green(`${Heal}`)}만큼 회복시키고 ${chalk.red(`${monster.name}`)}에게 ${chalk.red(`${Deal}`)}의 피해를 입혔습니다!!`);
            }
        }
    }
    get Maxhp () {
        return 40 + this.grade * 40;
    }
    get attackpower () {
        return 9 + this.grade * 9;
    }
}