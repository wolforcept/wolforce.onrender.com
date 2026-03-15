import { Graphics, Rect, Vec2, Util as MigUtil } from "miglib";

export class Util extends MigUtil {


    static containsMouse(bounds: Rect, g: Graphics) {
        return this.contains(bounds, { x: g.mx, y: g.my });
    }

    static contains(r: Rect, p: Vec2): boolean {
        return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
    }

    static toDigits(n: number, d: number): string {
        let str = "" + n;
        while (str.length < d) str = "0" + str;
        return str;
    }

    // static shuffle<T>(arr: T[]): T[] {
    //     for (let i = arr.length - 1; i > 0; i--) {
    //         const j = Math.floor(Math.random() * (i + 1));
    //         [arr[i], arr[j]] = [arr[j], arr[i]];
    //     }
    //     return arr;
    // }

    static shuffle<T>(arr: T[], rand?: () => number): T[] {
        for (let i = arr.length - 1; i > 0; i--) {
            const r = rand ? rand() : Math.random();
            const j = Math.floor(r * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    static sfc32(a: number, b: number, c: number, d: number) {
        return function () {
            a |= 0; b |= 0; c |= 0; d |= 0;
            let t = (a + b | 0) + d | 0;
            d = d + 1 | 0;
            a = b ^ b >>> 9;
            b = c + (c << 3) | 0;
            c = (c << 21 | c >>> 11);
            c = c + t | 0;
            return (t >>> 0) / 4294967296;
        }
    }

    static seededRandom(seed: number) {
        // const seedgen = () => (2 ** 32) >>> 0;
        const getRand = this.sfc32(seed, 0, 0, 0);
        for (let i = 0; i < 20; i++) getRand();
        return getRand;
    }

}