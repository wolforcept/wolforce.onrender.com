import { Vec2 } from "miglib";
import { Tile } from "./Tile";

export class Board {

    public readonly boardW = 5;
    public readonly boardH = 6;
    _board: { [key: string]: Tile } = {};

}

export namespace Board {

    export function remove(board: Board, pos: Vec2) {
        delete board._board[keyFromPos(pos)];
    }

    export function set(board: Board, pos: Vec2, tile: Tile) {
        if (!isValid(board, pos)) return;
        board._board[keyFromPos(pos)] = tile;
    }

    export function get(board: Board, pos: Vec2): Tile | null {
        if (!isValid(board, pos)) return null;
        return board._board[keyFromPos(pos)] || null;
    }

    export function findFreePos(board: Board): Vec2 | null {
        const freePositions: Vec2[] = [];
        for (let y = 0; y < board.boardH; y++) {
            for (let x = 0; x < board.boardW; x++) {
                const pos = { x, y };
                if (Board.get(board, pos)) continue;
                freePositions.push(pos);
            }
        }
        if (freePositions.length === 0) return null;
        return freePositions[Math.floor(Math.random() * freePositions.length)];
    }

    export function isValid(board: Board, pos: Vec2) {
        return pos.x >= 0 && pos.y >= 0 && pos.x < board.boardW && pos.y < board.boardH;
    }

    export function deleteTile(board: Board, pos: Vec2) {
        if (!isValid(board, pos)) return;
        remove(board, pos);
    }

    export function posFromKey(key: string): Vec2 {
        const [x, y] = key.split(",").map(Number);
        return { x, y };
    }

    export function keyFromPos(pos: Vec2): string {
        return pos.x + "," + pos.y;
    }

    export function getNumberOfEnemies(board: Board) {
        let sum = 0;
        for (const tile of (Object.values(board._board)))
            if (tile.kind === "Enemy") sum++;
        return sum;
    }

    export function onTileMoved(board: Board, pos1: Vec2, pos2: Vec2): boolean {
        if (!isValid(board, pos1) || !isValid(board, pos2)) return false;
        if (pos1.x === pos2.x && pos1.y === pos2.y) return false;

        const tile1 = get(board, pos1);
        const tile2 = get(board, pos2);

        if (!tile1) return false;

        if (!tile2) {
            remove(board, pos1);
            set(board, pos2, tile1);
            return true;
        }

        if (tile2.kind !== "Enemy") {
            set(board, pos2, tile1);
            set(board, pos1, tile2);
            return true;
        }

        return false;

    }
}
