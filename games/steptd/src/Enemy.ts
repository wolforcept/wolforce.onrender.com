import { Graphics, Vec2 } from "miglib";
import { GameData } from "./GameScreen";
import { Tile, TileActions } from "./Tile";

export type EnemyType = "basic" | "fast" | "boss"

export interface Enemy extends Tile {

    readonly kind: "Enemy";
    readonly type: EnemyType
    counter: number

    // static makeTypeFromCounter(step: number, counter: number): { type: EnemyType, newCounter: number } {


    // }


    // renderDetail(g: Graphics, detailX: number, detailY: number): void {
    //     FONT.render(g, detailX + 22, detailY + 22, this.type);
    // }

    // get range(): Vec2[] { return []; }

}

export namespace Enemy {
    export function make(step: number, _counter: number) {

        let counter = _counter;
        let type: EnemyType = "basic";

        if (step > 10 && Math.random() < 0.1) {
            type = "boss"; counter -= 3
        };

        if (step > 5 && Math.random() < 0.3) {
            type = "fast"; counter -= 2
        }

        return { kind: "Enemy", type, counter } satisfies Enemy
    }

    export function render(g: Graphics, enemy: Enemy, isInBoard: boolean, pos: Vec2, size: number, isSelected: boolean) {

        const finalPos = isInBoard ? { x: pos.x * size, y: pos.y * size } : pos;

        g.renderImage("enemy/" + enemy.type, pos.x, pos.y, { w: size, h: size });
        g.renderImage("enemy/number/" + enemy.counter, pos.x, pos.y, { w: size, h: size });

        const { range } = enemyActions[enemy.type];
        if (isSelected)
            Tile.renderRange(g, pos, enemy, range, size)
    }
}


interface EnemyEvent { enemy: Enemy; pos: Vec2; }
interface EnemyStepEvent extends EnemyEvent { }
interface EnemyDeathEvent extends EnemyEvent { }

interface EnemyActions extends TileActions {
    onStep?(data: GameData, ev: EnemyStepEvent): void;
    onDeath?(data: GameData, ev: EnemyDeathEvent): { exp: number, money: number };
}

export const enemyActions: Record<EnemyType, EnemyActions> = {
    basic: {
        detail: "",
        range: [],
        onDeath(data, ev) {
            return { exp: 1, money: 1 }
        }
    },
    fast: {
        detail: "",
        range: [],
        onDeath(data, ev) {
            return { exp: 1, money: 1 }
        }
    },
    boss: {
        detail: "",
        range: [],
        onDeath(data, ev) {
            return { exp: 1, money: 1 }
        }
    },
}