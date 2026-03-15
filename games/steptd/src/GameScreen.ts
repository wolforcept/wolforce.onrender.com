import { Assets, Graphics, MigScreen, Rect, Vec2 } from "miglib";
import { Board } from "./Board";
import { FONT, FONT_LARGE } from "./Main";
import { Tile, TileDetail } from "./Tile";
import { Tower, towerActions, TowerType } from "./Tower";
import { Enemy, enemyActions, EnemyType } from "./Enemy";
import { UIUtils } from "./UIUtils";
import { Util } from "./Util";
import { RenderOptions } from "miglib/dist/RenderOptions";

const DEBUG = true;

interface Tween {
    startTime?: number
    isRemoved?: boolean
    duration: number
    isSimultaneous: boolean
    tween: (g: Graphics, t: number) => void
    resolve: () => void
}

interface SpawnBase {
    type: "plus" | "enemy"
}

interface SpawnEnemy extends SpawnBase {
    type: "enemy"
    enemy: Enemy;
}

interface SpawnIncrease extends SpawnBase {
    type: "plus"
    amount: number;
}

export interface GameData {
    board: Board
    money: number
    steps: number
    tier: number
    exp: number
    nextEnemySpawn: SpawnEnemy | SpawnIncrease;
    options: TowerType[]
    buyingOptions: null | Tower[]
}

export class GameScreen implements MigScreen {

    // constants
    tileSize = 64;

    // data
    data: GameData = {
        board: new Board(),
        money: 99999,
        steps: 0,
        tier: 1,
        exp: 0,
        nextEnemySpawn: { type: "plus", amount: 1 },
        options: ["hitter"],
        buyingOptions: null,
    }
    get board() { return this.data.board; }
    get money() { return this.data.money; }
    get steps() { return this.data.steps; }
    get expPrice() { return Math.min(99, 10 + this.data.tier); }
    get expNeeded() { return 10 + this.data.tier * 2 };

    // animation
    isAnimating = false;
    tweens: Tween[] = [];
    immediateTweens: Tween[] = [];

    // shop
    selectedShopTile: Tower | null = null;
    selectedBuyingOption: number = 0;
    hidingShop = false;

    // board
    boardX = 0;
    boardY = this.tileSize;
    // board move
    selectedTile: Tile | null = null;
    draggingTile: Tile | null = null;
    pressedOnTile: Tile | null = null;
    // board mouse input
    pressStartPos: Vec2 = { x: 0, y: 0 }
    wasPressed = false;
    justPressed = false;
    justReleased = false;

    get tilewh(): { w: number, h: number } { return { w: this.tileSize, h: this.tileSize } }

    constructor(private assets: Assets) {
        this.data = { ...this.data, ...this.loadData() }
        if (this.steps === 0) {

            this.data.nextEnemySpawn = { type: "enemy", enemy: Enemy.make(this.steps, this.getEnemyStartingCounter()) };
            this.stepEnd();
            this.data.nextEnemySpawn = { type: "enemy", enemy: Enemy.make(this.steps, this.getEnemyStartingCounter()) };
            this.stepEnd();
        }
        this.data.nextEnemySpawn = { type: "plus", amount: 1 };
        this.data.steps++;
        setInterval(() => this.saveData(), 10000);
    }

    loadData(): GameData | null {
        const dataItem = localStorage.getItem("savedata");
        console.log(dataItem)
        if (!dataItem) return null;
        const data = JSON.parse(dataItem) as GameData;

        if (!data) return null;
        return data;
    }

    saveData() {
        const str = JSON.stringify(this.data);
        localStorage.setItem("savedata", str);
        console.log("Data Saved")
    }

    stepEnd() {

        this.selectedShopTile = null;
        this.selectedTile = null;

        this.data.steps++;

        for (let x = 0; x < this.board.boardW; x++) {
            for (let y = 0; y < this.board.boardH; y++) {
                const tile = Board.get(this.board, { x, y });
                if (tile?.kind === "Tower") this.towerStep(tile as Tower, { x, y });
                if (tile?.kind === "Enemy") this.enemyStep(tile as Enemy, { x, y });

            }
        }

        if (this.data.nextEnemySpawn.type === "plus")
            this.increaseCounterOfEnemies(this.data.nextEnemySpawn);

        if (this.data.nextEnemySpawn.type === "enemy")
            this.addEnemyToBoard(this.data.nextEnemySpawn.enemy);
        this.createNextSpawn();
        if (DEBUG) console.log(this.data.nextEnemySpawn)
    }

    towerStep(tower: Tower, pos: Vec2) {
        const stepAction = towerActions[tower.type].onStep;
        if (stepAction) {
            this.tweens.push({
                isSimultaneous: false,
                duration: 333,
                tween: (g: Graphics, t: number) => {
                    const screenPos = this.boardToScreenPos(pos);
                    // screenPos.x += 4 * Math.sin(t * Math.PI * 5);
                    const addedSize = this.tileSize * .1 * Math.sin(t * Math.PI * 2);
                    screenPos.x -= addedSize / 2;
                    screenPos.y -= addedSize / 2;
                    Tower.render(g, tower, false, screenPos, this.tileSize + addedSize, false);
                },
                resolve: () => {
                    stepAction(this.data, { pos, tower });
                    this.finallizeStep();
                },
            });
        }
    }

    enemyStep(enemy: Enemy, pos: Vec2) {
        const stepAction = enemyActions[enemy.type].onStep;
        if (stepAction) stepAction(this.data, { pos, enemy });
    }

    createNextSpawn() {
        const rand = Math.random();

        if (Board.getNumberOfEnemies(this.board) > 1) {

            if (rand < 0.25) {
                this.data.nextEnemySpawn = ({ type: "plus", amount: 2 } satisfies SpawnIncrease);
                return;
            }

            if (rand < 0.8) {
                this.data.nextEnemySpawn = ({ type: "plus", amount: 1 } satisfies SpawnIncrease);
                return;
            }
        }

        this.data.nextEnemySpawn = ({ type: "enemy", enemy: Enemy.make(this.steps, this.getEnemyStartingCounter()) } satisfies SpawnEnemy);

    }

    finallizeStep() {
        for (let x = 0; x < this.board.boardW; x++) {
            for (let y = 0; y < this.board.boardH; y++) {
                const tile = Board.get(this.board, { x, y });
                if (tile?.kind === "Enemy") {
                    const enemy = tile as Enemy;
                    if (enemy.counter < 0) {
                        Board.deleteTile(this.board, { x, y });
                        const onDeath = enemyActions[enemy.type].onDeath;
                        if (onDeath) {
                            const { exp, money } = onDeath(this.data, { enemy, pos: { x, y } });
                            this.data.exp += exp;
                            this.data.money += money;
                        }
                    }
                }
            }
        }
    }

    //

    onShow(g: Graphics): void {
    }

    onRender(g: Graphics): void {
        g.sketch.clear();

        this.boardX = Math.floor(g.width / 2 - this.board.boardW * this.tileSize / 2);

        if (!this.wasPressed && g.mouseIsPressed) this.justPressed = true;
        if (this.wasPressed && !g.mouseIsPressed) this.justReleased = true;
        this.wasPressed = g.mouseIsPressed;
        if (this.justPressed) this.pressStartPos = { x: g.mx, y: g.my };


        if (this.data.exp >= this.expNeeded && !this.data.buyingOptions) this.makeBuyingOptions();
        if (!this.isAnimating && this.data.buyingOptions) {
            let dy = this.boardY - this.tileSize;

            if (!this.hidingShop) {

                dy = this.renderTop(g, dy);
                dy = this.renderBuyingOptions(g, this.data.buyingOptions, dy);

                this.renderDetails(g, dy)
            }

            dy = g.height - this.tileSize;

            this.renderButton(g, { x: this.boardX, y: dy }, this.hidingShop ? "Back" : "Hide", this.hidingShop ? 24 : 32, () => {
                this.hidingShop = !this.hidingShop;
            });

            this.renderButton(g, { x: this.boardX + this.tileSize * 3, y: dy }, "Add", 34, () => {
                console.log("buy");
            });

        }

        if (!this.data.buyingOptions || this.hidingShop) {

            let dy = this.boardY - this.tileSize;

            this.renderBoard(g);
            dy = this.renderTop(g, dy);
            dy += this.board.boardH * this.tileSize + 10;
            dy = this.renderBar(g, dy);
            dy = this.renderShop(g, dy);
            this.renderDetails(g, dy);
            this.finallizeRender(g);
        }

        this.justPressed = false;
        this.justReleased = false;

        this.isAnimating = false;
    }

    renderBuyingOptions(g: Graphics, buying: Tower[], dy: number): number {

        const hPartis = 6;
        const h = this.tileSize * hPartis;
        UIUtils.render9Patch(g, "panel_blue", this.boardX, dy, this.board.boardW, hPartis, 16, this.tileSize);

        const renderOptions: RenderOptions = { w: this.tileSize, h: this.tileSize };

        const gap = 10;
        let dx = this.boardX + this.board.boardW * this.tileSize / 2 - buying.length * this.tileSize / 2 - (buying.length - 1) * gap / 2;

        const dy0 = dy;
        dy += h;
        const dy1 = dy + 38;

        for (let i = 0; i < buying.length; i++) {
            const tower = buying[i];
            const isSelected = i === this.selectedBuyingOption;
            const pos = { x: dx, y: dy1 };

            const isHovered = this.renderShopTower(g, pos.x, pos.y, tower.type);

            if (isSelected) {
                const buyRenderPos = towerActions[tower.type].buyRenderPos || { x: 0, y: 0 };
                Tower.render(g, tower, false, {
                    x: buyRenderPos.x * this.tileSize + this.boardX + this.board.boardW * this.tileSize / 2 - this.tileSize / 2,
                    y: buyRenderPos.y * this.tileSize + dy0 + h / 2 - this.tileSize / 2
                }, this.tileSize, isSelected)
                g.renderImage("cursor", pos.x, pos.y, renderOptions)
            }
            dx += this.tileSize + gap
            if (this.justPressed && Util.containsMouse({ ...pos, w: this.tileSize, h: this.tileSize }, g)) {
                this.selectedBuyingOption = i;
            }
        }

        return dy + this.tileSize * 2;
    }

    renderButton(g: Graphics, pos: { x: number; y: number; }, text: string, dx: number, callback: () => void) {

        const wh = { w: this.tileSize * 2, h: this.tileSize };
        g.renderImage("button", pos.x, pos.y, wh);
        FONT_LARGE.render(g, pos.x + dx, pos.y + 20, text);
        const hover = Util.containsMouse({ ...pos, ...wh }, g);
        if (this.justReleased && hover) callback();
    }

    makeBuyingOptions() {
        this.data.buyingOptions = Util.shuffle([...(Object.keys(towerActions) as TowerType[])]).splice(0, 3).map(Tower.make);
        this.hidingShop = false;
        this.saveData();
    }

    renderBar(g: Graphics, dy: number): number {

        const maxValue = this.expNeeded;
        const value = this.data.exp;

        const y = dy - 6;
        const startX = this.boardX;
        const barWidth = (this.board.boardW - 1) * this.tileSize;

        {
            let renderOptions: RenderOptions = { w: this.tileSize, h: this.tileSize * 10 / 16, sw: 16, sh: 10 };

            g.renderImage("bar", startX, y, renderOptions);
            g.renderImage("bar", startX + barWidth - this.tileSize, y, { ...renderOptions, sx: 32 });
            for (let x = this.tileSize; x < barWidth - this.tileSize; x += this.tileSize)
                g.renderImage("bar", startX + x, y, { ...renderOptions, sx: 16 });

            // render overlay bar depending on value
            const overlayWidth = Math.max(0, Math.min(barWidth, barWidth * value / maxValue));
            renderOptions = { ...renderOptions, sy: 10 };

            const sw = (percent: number) => Math.ceil(16 * percent);
            const w = (percent: number) => Math.ceil(this.tileSize * (sw(percent) / 16));

            if (overlayWidth <= 0) {
                // nothing to render
            } else if (overlayWidth <= this.tileSize) {
                // Only partial left cap

                const percent = overlayWidth / this.tileSize;
                g.renderImage("bar", startX, y, { ...renderOptions, w: w(percent), sw: sw(percent) });

            } else if (overlayWidth >= barWidth - this.tileSize) {
                // Full left cap + middles + partial/full right cap
                const percent = (overlayWidth - (barWidth - this.tileSize)) / this.tileSize;
                g.renderImage("bar", startX, y, renderOptions);
                for (let x = this.tileSize; x < barWidth - this.tileSize; x += this.tileSize)
                    g.renderImage("bar", startX + x, y, { ...renderOptions, sx: 16 });
                g.renderImage("bar", startX + barWidth - this.tileSize, y, { ...renderOptions, sx: 32, w: w(percent), sw: sw(percent) });

            } else {
                // Left cap + partial middle section
                g.renderImage("bar", startX, y, renderOptions);

                for (let x = this.tileSize; x < barWidth - this.tileSize; x += this.tileSize) {
                    const percent = Math.min(1, Math.max(0, (overlayWidth - x) / this.tileSize));
                    if (percent <= 0) break;
                    g.renderImage("bar", startX + x, y, { ...renderOptions, sx: 16, w: w(percent), sw: sw(percent) });
                }
            }
        }

        // render buy bar button
        {
            const x = startX + barWidth;
            const size = { w: this.tileSize, h: this.tileSize };
            g.renderImage("bar_add", x, y, size)
            g.renderImage("moneymini", x - 4, y + 9, size)
            FONT.render(g, x + 10, y + 11, this.expPrice + "")

            if (this.canAct() && this.justReleased && Util.containsMouse({ x, y, ...size }, g) && this.money >= this.expPrice) {
                this.data.money -= this.expPrice;
                this.data.exp++;
            }
        }

        return dy + this.tileSize;
    }

    renderShop(g: Graphics, dy: number): number {
        for (let i = 0; i < this.data.options.length; i++) {
            const type = this.data.options[i];
            const screenX = this.boardX + i * this.tileSize;
            const screenY = dy;
            const isHovered = this.renderShopTower(g, screenX, screenY, type,);

            if (isHovered && this.justPressed && this.canAct()) {
                this.selectedShopTile = Tower.make(type);
            }

        }

        if (this.selectedShopTile) {
            const type = this.selectedShopTile.type as TowerType;
            // render tile possible final position
            const boardPos = this.mouseToBoardPos(g);
            const finalScreenPos = this.boardToScreenPos(boardPos);
            if (Board.isValid(this.board, this.screenToBoardPos(finalScreenPos)))
                Tower.render(g, this.selectedShopTile, false, finalScreenPos, this.tileSize, true);

            // render tile at mouse
            const mx = g.mx - this.tileSize / 2;
            const my = g.my - this.tileSize / 2;
            Tower.render(g, this.selectedShopTile, false, { x: mx, y: my }, this.tileSize, false);
            // g.renderImage("cursor", x, y, this.tilewh);

            if (this.justReleased) {

                if (this.canAct()) {
                    const cost = towerActions[type].cost;
                    if (Board.isValid(this.board, boardPos) && this.money >= cost) {
                        this.data.money -= cost;
                        this.addTower(boardPos, type);
                        this.stepEnd();
                    }
                }

                this.selectedShopTile = null;
            }
        }

        return dy + this.tileSize;
    }

    renderShopTower(g: Graphics, x: number, y: number, type: TowerType): boolean {
        const cost = towerActions[type].cost;
        FONT.render(g, x + 6, y - 22, "" + cost);

        g.renderImage("moneymini", x - 4, y - 24, this.tilewh);
        g.renderImage("tower/" + type, x, y, this.tilewh);

        return Util.containsMouse({ x, y, w: this.tileSize, h: this.tileSize }, g);
    }

    renderTile(g: Graphics, pos: Vec2, tile: Tile) {
        const isSelected = tile === this.selectedTile;
        if (tile.kind === "Tower") Tower.render(g, tile as Tower, true, pos, this.tileSize, isSelected);
        if (tile.kind === "Enemy") Enemy.render(g, tile as Enemy, true, pos, this.tileSize, isSelected);
    }

    renderDetails(g: Graphics, y: number) {
        const tile = this.selectedTile || this.selectedShopTile || this.data.buyingOptions?.[this.selectedBuyingOption];
        if (tile) {

            const panelColor = tile.kind === "Enemy" ? "panel_red" : "panel_blue";
            const x = this.boardX;
            UIUtils.render9Patch(g, panelColor, x, y, this.board.boardW, 4, 16, this.tileSize);

            if (tile.kind === "Tower") this.renderDetail(g, towerActions[tile.type as TowerType].detail, x, y);
            if (tile.kind === "Enemy") this.renderDetail(g, enemyActions[tile.type as EnemyType].detail, x, y);
        }
    }

    renderDetail(g: Graphics, detail: TileDetail, x: number, y: number) {
        if (typeof detail === "string") {
            FONT.render(g, x + 22, y + 22, detail);
        } else {
            detail(g, x, y);
        }
    }

    renderTop(g: Graphics, dy: number): number {

        let x = this.boardX;
        let y = dy;
        const ty = y + 22;

        if (typeof this.data.nextEnemySpawn === "number") {
            FONT_LARGE.render(g, x + 20, ty, this.data.nextEnemySpawn + "");
        } else {
            if (this.data.nextEnemySpawn.type === "plus") {
                g.renderImage("plus", x, y, this.tilewh);
                g.renderImage("enemy/number/" + this.data.nextEnemySpawn.amount, x, y, this.tilewh);
            }

            if (this.data.nextEnemySpawn.type === "enemy") {
                Enemy.render(g, this.data.nextEnemySpawn.enemy, true, { x, y }, this.tileSize, false);
            }
        }

        x += this.tileSize * (this.board.boardW - 3) + 10

        FONT_LARGE.render(g, x, ty, Util.toDigits(this.money, 5));

        x += this.tileSize * 2;

        g.renderImage("money", x, y, this.tilewh)

        return dy + this.tileSize;
    }

    renderBoard(g: Graphics) {

        let anyHover = null;
        const wasDragging = !!this.draggingTile;

        let renderAfter: null | (() => void) = null;

        for (let x = 0; x < this.board.boardW; x++) {
            for (let y = 0; y < this.board.boardH; y++) {
                // const key = this.keyFromPos({ x, y });
                const tile = Board.get(this.board, { x, y });
                const screenPos = this.boardToScreenPos({ x, y });

                if (!tile) {
                    g.renderImage("background", screenPos.x, screenPos.y, this.tilewh);
                    continue;
                }

                const screenBounds: Rect = { ...screenPos, w: this.tileSize, h: this.tileSize };
                const isHovered = Util.containsMouse(screenBounds, g);
                anyHover ||= isHovered;

                const moved = Vec2.dist(this.pressStartPos, { x: g.mx, y: g.my }) > 1;

                if (isHovered && this.justPressed) {
                    this.selectedTile = tile;
                    if (this.canAct()) this.pressedOnTile = tile;
                }

                const isSelected = this.selectedTile === tile;

                if (g.mouseIsPressed && this.pressedOnTile === tile && isSelected && moved && tile.kind !== "Enemy" && this.canAct())
                    this.draggingTile = tile;

                const isBeingMoved = this.draggingTile === tile;


                if (isBeingMoved) {

                    g.sketch.tint(g.sketch.color(255, 255, 255, 100));

                    const boardPos = this.mouseToBoardPos(g);

                    if (this.justReleased) {
                        // Move tile to new position
                        this.doMove({ x, y }, boardPos);
                    }

                    renderAfter = () => {

                        // render tile possible final position
                        const finalScreenPos = this.boardToScreenPos(boardPos);
                        if (Board.isValid(this.board, this.screenToBoardPos(finalScreenPos)))
                            Tile.render(g, tile, false, finalScreenPos, this.tileSize, true);

                        // render tile at mouse
                        const x = g.mx - this.tileSize / 2;
                        const y = g.my - this.tileSize / 2;
                        Tile.render(g, tile, false, { x, y }, this.tileSize, true);
                        // g.renderImage("cursor", x, y, this.tilewh);
                    }

                }

                g.sketch.tint(g.sketch.color(255, 255, 255, 255));

                if (isSelected && !isBeingMoved) g.renderImage("cursor", screenPos.x, screenPos.y, this.tilewh);
                Tile.render(g, tile, false, screenPos, this.tileSize, isSelected && !isBeingMoved);

                if (this.justReleased) this.pressedOnTile = null;

            }
        };

        renderAfter && renderAfter();

        if (!anyHover && !wasDragging && this.justReleased)
            this.selectedTile = null;

    }

    finallizeRender(g: Graphics) {

        const now = performance.now();

        if (this.immediateTweens.length > 0) {
            this.isAnimating = true;

            for (const tween of this.immediateTweens) {

                const now = performance.now();
                if (!tween.startTime) tween.startTime = now;
                const t = (now - tween.startTime) / tween.duration;
                if (t >= 1) {
                    tween.resolve();
                    tween.isRemoved = true;
                } else {
                    tween.tween(g, t);
                }
            }

            for (let i = 0; i < this.immediateTweens.length; i++) {
                if (this.immediateTweens[i].isRemoved) {
                    this.immediateTweens.splice(i, 1);
                    i--;
                }
            }

            return;
        }

        if (this.tweens.length > 0) {
            this.isAnimating = true;

            const tween = this.tweens[0];
            if (!tween.startTime) tween.startTime = now;
            const t = (now - tween.startTime) / tween.duration;
            if (t >= 1) {
                tween.resolve();
                this.tweens.splice(0, 1);
            } else {
                tween.tween(g, t);
            }
        }

    }

    //

    doMove(from: Vec2, to: Vec2) {
        if (!this.canAct()) return;
        const success = Board.onTileMoved(this.board, from, to);
        this.draggingTile = null;
        if (success) this.stepEnd();
    }

    addTower(pos: Vec2, type: TowerType, callback?: () => void) {

        const { x, y } = pos;
        const towerToAdd = Tower.make(type);

        this.immediateTweens.push({
            isSimultaneous: false,
            duration: 500,
            tween: (g: Graphics, t: number) => {
                const screenPos = this.boardToScreenPos({ x, y });
                // const offsetY = (1 - t) * this.tileSize;
                g.sketch.tint(g.sketch.color(255, 255, 255, t * 255));
                const offsetSize = Math.sin(t * Math.PI) * 20;
                Tower.render(g, towerToAdd, false, { x: screenPos.x - offsetSize / 2, y: screenPos.y - offsetSize / 2 }, this.tileSize + offsetSize, false);
                g.sketch.tint(g.sketch.color(255, 255, 255, 255))
            },
            resolve: () => {
                Board.set(this.board, { x, y }, towerToAdd);
                if (callback) callback();
            }
        })
    }

    getEnemyStartingCounter() {
        const k = 5; // max counter when t is infinite (assymptote)
        const b = 20; // how fast the function rises (higher b = slower rise)
        const variance = 2; // how much the counter can vary randomly
        const strictVal = (-k * b) / (this.steps + b) + k;
        return Math.max(0, Math.round(strictVal + Math.random() * variance - variance / 2));
    }

    addRandomEnemy(callback?: () => void) {
        const enemyToAdd = Enemy.make(this.steps, this.getEnemyStartingCounter());
        this.addEnemyToBoard(enemyToAdd, callback);
    }

    addEnemyToBoard(enemyToAdd: Enemy, callback?: () => void) {

        const newPos = Board.findFreePos(this.board);
        if (!newPos) return; // TODO lose the game
        const { x, y } = newPos;

        const actualAdd = () => {
            this.immediateTweens.push({
                isSimultaneous: false,
                duration: 500,
                tween: (g: Graphics, t: number) => {
                    const screenPos = this.boardToScreenPos({ x, y });
                    // const offsetY = (1 - t) * this.tileSize;
                    g.sketch.tint(g.sketch.color(255, 255, 255, t * 255));
                    const offsetSize = Math.sin(t * Math.PI) * 20;
                    Enemy.render(g, enemyToAdd, false, { x: screenPos.x - offsetSize / 2, y: screenPos.y - offsetSize / 2 }, this.tileSize + offsetSize, false);
                    g.sketch.tint(g.sketch.color(255, 255, 255, 255))
                },
                resolve: () => {
                    Board.set(this.board, { x, y }, enemyToAdd);
                    if (callback) callback();
                }
            });
        };

        this.makeTweenFromInitialToPos(false, { x, y }, (g, screenPos, t) => {
            Enemy.render(g, enemyToAdd, false, screenPos, this.tileSize, false);
        }, actualAdd);

    }

    increaseCounterOfEnemies({ type, amount }: { type: "plus", amount: number }, callback?: () => void) {

        // get all enemies from board
        const enemyPoss: { enemy: Enemy, pos: Vec2 }[] = [];
        for (let x = 0; x < this.board.boardW; x++) {
            for (let y = 0; y < this.board.boardH; y++) {
                const tile = Board.get(this.board, { x, y });
                if (tile?.kind === "Enemy")
                    enemyPoss.push({ enemy: tile as Enemy, pos: { x, y } });
            }
        }

        const enemiesToIncrease = Util.shuffle(enemyPoss).splice(0, amount);

        for (const { enemy, pos } of enemiesToIncrease) {
            this.makeTweenFromInitialToPos(true, pos, (g, screenPos, t) => {
                g.renderImage("plus", screenPos.x, screenPos.y, this.tilewh);
            }, () => {
                enemy.counter++;
            })
        }

        // this.tweens.push({
        //     startTime: performance.now(),
        //     endTime: performance.now() + 666,
        //     tween: (g: Graphics, t: number) => {
        //         for (const { pos } of enemiesToIncrease) {
        //             // show plus going from start to enemy pos
        //             const screenFinalPos = this.boardToScreenPos(pos);
        //             const screenInitialPos = { x: this.boardX, y: this.boardY - this.tileSize };

        //             const screenPos = { x: screenInitialPos.x + (screenFinalPos.x - screenInitialPos.x) * t, y: screenInitialPos.y + (screenFinalPos.y - screenInitialPos.y) * t * t };
        //             g.renderImage("plus", screenPos.x, screenPos.y, this.tilewh);

        //             // const offsetY = (1 - t) * this.tileSize;
        //             // g.sketch.tint(g.sketch.color(255, 255, 255, t * 255));
        //             // const offsetSize = Math.sin(t * Math.PI) * 20;
        //             // enemyToAdd.render(g, this.board, { x: screenPos.x - offsetSize / 2, y: screenPos.y - offsetSize / 2 }, this.tileSize + offsetSize, false);
        //             g.sketch.tint(g.sketch.color(255, 255, 255, 255))
        //         }
        //     },
        //     resolve: () => {
        //         for (const { enemy } of enemiesToIncrease)
        //             enemy.counter++;
        //         if (callback) callback();
        //     }
        // })
    }

    makeTweenFromInitialToPos(isSimultaneous: boolean, boardPos: Vec2, render: (g: Graphics, screenPos: Vec2, t: number) => void, callback?: () => void) {
        this.tweens.push({
            isSimultaneous,
            duration: 666,
            tween: (g: Graphics, t: number) => {
                const screenFinalPos = this.boardToScreenPos(boardPos);
                const screenInitialPos = { x: this.boardX, y: this.boardY - this.tileSize };
                const screenPos = { x: screenInitialPos.x + (screenFinalPos.x - screenInitialPos.x) * t, y: screenInitialPos.y + (screenFinalPos.y - screenInitialPos.y) * t * t };
                render(g, screenPos, t);
            },
            resolve: () => {
                if (callback) callback();
            }
        });
    }

    //

    canAct() {
        return !this.isAnimating && !this.data.buyingOptions;
    }

    boardToScreenPos({ x, y }: Vec2): Vec2 {
        const screenX = this.boardX + x * this.tileSize;
        const screenY = this.boardY + y * this.tileSize;
        return { x: screenX, y: screenY };
    }

    screenToBoardPos({ x, y }: Vec2): Vec2 {
        const _x = Math.round((x - this.boardX) / this.tileSize);
        const _y = Math.round((y - this.boardY) / this.tileSize);
        return {
            x: Math.max(0, Math.min(this.board.boardW, _x)),
            y: Math.max(0, Math.min(this.board.boardH, _y)),
        };
    }

    mouseToBoardPos(g: Graphics): Vec2 {
        return this.screenToBoardPos({ x: g.mx - this.tileSize / 2, y: g.my - this.tileSize / 2 });
    }

}