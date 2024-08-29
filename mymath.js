export class MyMath  {
    static randomN = function(number) {
        return number * (0.8 + Math.random()*0.4)
    }

    static damgecalculate = function(deal, defense) {
        return Math.ceil(MyMath .randomN(deal) * 100 / (100 + defense))
    }
}