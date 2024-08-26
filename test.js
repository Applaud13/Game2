export class Tanker1 {
    constructor () {
        this.name = `루시우스`;
        this.description = ``;
        this.grade = 1;
        this.Maxexperience = 1;
        this.experience =0;
        this.hp = 90;
    }
    get Maxhp() {
        return 45 + this.grade * 45;
    }
    get attackpower() {
        return 8 + this.grade * 8;
    }
}

const tanker = new Tanker1();
console.log(tanker.Maxhp); // 90 (45 + 1 * 45)
console.log(tanker.attackpower); // 16 (8 + 1 * 8)

tanker.grade = 2; // grade를 2로 변경
console.log(tanker.Maxhp); // 135 (45 + 2 * 45)
console.log(tanker.attackpower); // 24 (8 + 2 * 8)
