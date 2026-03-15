import { Tile, TileActions } from "./Tile";
import { Graphics, Vec2 } from "miglib";
import { Board } from "./Board";
import { Enemy } from "./Enemy";
import { GameData } from "./GameScreen";

export type TowerType =
    "hitter" | "hitter2" | "hitter3" | "hitter4" | "hitter5" | "hitter6" |
    "gravity" // "boost" | "burst" | "nexus"

export interface Tower extends Tile {
    readonly kind: "Tower"
    readonly type: TowerType
    counter: number
}


export namespace Tower {

    export function make(type: TowerType): Tower {
        return { kind: "Tower", counter: 0, type } satisfies Tower;
    }

    export function render(g: Graphics, tower: Tower, isInBoard: boolean, pos: Vec2, size: number, isSelected: boolean) {
        const { range } = towerActions[tower.type];

        const finalPos = isInBoard ? { x: pos.x * size, y: pos.y * size } : pos;

        g.renderImage("tower/" + tower.type, finalPos.x, finalPos.y, { w: size, h: size });

        if (isSelected)
            Tile.renderRange(g, finalPos, tower, range, size)
    }

}

interface TowerEvent { tower: Tower; pos: Vec2; }
interface TowerAppearEvent extends TowerEvent { }
interface TowerStepEvent extends TowerEvent { }
interface TowerKillEvent extends TowerEvent { }
interface TowerMoveEvent extends TowerEvent { from: Vec2; to: Vec2 }
interface TowerSellEvent extends TowerEvent { }
interface TowerActivateEvent extends TowerEvent { action: (data: GameData, ev: TowerEvent) => void }

export interface TowerActions extends TileActions {
    buyRenderPos?: Vec2
    get cost(): number;
    onAppear?       /**/(data: GameData, ev: TowerAppearEvent): void;
    onStep?         /**/(data: GameData, ev: TowerStepEvent): void;
    onEnemyKilled?  /**/(data: GameData, ev: TowerKillEvent): void;
    onTileMoved?    /**/(data: GameData, ev: TowerMoveEvent): void;
    onSell?         /**/(data: GameData, ev: TowerSellEvent): void;
    onActivate?     /**/(data: GameData, ev: TowerActivateEvent): void;
}

function onStep_normalHit(dmg: number): ((data: GameData, ev: TowerStepEvent) => void) {
    return ({ board }: GameData, { pos, tower }: TowerStepEvent) => {
        const { range } = towerActions[tower.type];
        range.forEach(pos2 => {
            const enemy = Board.get(board, { x: pos.x + pos2.x, y: pos.y + pos2.y }) as Enemy;
            if (enemy && enemy.kind === "Enemy") {
                enemy.counter--;
            }
        })
    }
}
export const towerActions: Record<TowerType, TowerActions> = {

    hitter: {
        detail: "Basic Hitter:\nhits enemies in the same row and column",
        range: [p(1, 0), p(-1, 0), p(0, 1), p(0, -1)],
        cost: 10,
        onStep: onStep_normalHit(1),
    },

    hitter2: {
        detail: "Basic Hitter:\nhits enemies diagonally.",
        range: [p(1, 1), p(-1, -1), p(-1, 1), p(1, -1)],
        cost: 10,
        onStep: onStep_normalHit(1),
    },

    hitter3: {
        detail: "Basic Hitter:\nhits enemies in the same row and column",
        range: [p(1, 0), p(2, 0), p(-1, 0), p(-2, 0), p(0, 1), p(0, 2), p(0, -1), p(0, -2)],
        cost: 25,
        onStep: onStep_normalHit(1),
    },

    hitter4: {
        detail: "Basic Hitter:\nhits enemies all around it.",
        range: [p(1, 0), p(-1, 0), p(0, 1), p(0, -1), p(1, 1), p(-1, -1), p(-1, 1), p(1, -1)],
        cost: 25,
        onStep: onStep_normalHit(1),
    },

    hitter5: {
        detail: "Basic Hitter:\nhits enemies twice",
        range: [p(1, 0), p(-1, 0), p(0, 1), p(0, -1)],
        cost: 36,
        onStep: onStep_normalHit(2),
    },

    hitter6: {
        detail: "Basic Hitter:\nhits enemies twice, all around it.",
        range: [p(1, 0), p(-1, 0), p(0, 1), p(0, -1), p(1, 1), p(-1, -1), p(-1, 1), p(1, -1)],
        cost: 42,
        onStep: onStep_normalHit(2),
    },

    gravity: {
        detail: "Gravity: pushes enemies down",
        range: [p(0, 1), p(0, 2), p(0, 3), p(0, 4)],
        cost: 10,
        buyRenderPos: { x: 0, y: -2 },
        onStep({ board }, { pos, tower }) {
            const { range } = towerActions[tower.type];
            range.forEach(pos => {
                const enemy = Board.get(board, pos) as Enemy;
                if (enemy && enemy.kind === "Enemy") {
                    const newPos = { x: pos.x, y: pos.y + 1 };
                    if (Board.isValid(board, newPos) && !Board.get(board, newPos)) {
                        Board.deleteTile(board, pos);
                        Board.set(board, newPos, enemy);
                    }
                }
            })
        },
    },

    // fazer umas quantas torres, fazer o render dos details das torres, fazer o ecra de escolher a torre entre 3, fazer botoes de comprar torres arrastando, 

}

function p(x: number, y: number): Vec2 {
    return { x, y };
}