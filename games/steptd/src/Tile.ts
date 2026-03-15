import { Graphics, Rect, Vec2 } from "miglib";
import { FONT } from "./Main";
import { Board } from "./Board";
import { Tower, TowerType } from "./Tower";
import { Enemy, EnemyType } from "./Enemy";


export interface Tile {

    readonly kind: "Tower" | "Enemy"
    readonly type: TowerType | EnemyType

}

export namespace Tile {
    export function renderRange(g: Graphics, pos: Vec2, tile: Tile, range: Vec2[], size: number) {
        for (const r of range) {
            // if (board.isValid({ x: pos.x + r.x, y: pos.y + r.y }))
            g.renderImage("range", pos.x + r.x * size, pos.y + r.y * size, { w: size, h: size });
        }
    }

    export function render(g: Graphics, tile: Tile, isInBoard: boolean, pos: Vec2, size: number, isSelected: boolean) {
        if (tile.kind === "Tower") Tower.render(g, tile as Tower, isInBoard, pos, size, isSelected)
        if (tile.kind === "Enemy") Enemy.render(g, tile as Enemy, isInBoard, pos, size, isSelected)
    }
}


export interface TileActions {
    detail: TileDetail
    get range(): Vec2[];
}

export type TileDetail = string | ((g: Graphics, detailX: number, detailY: number) => void)