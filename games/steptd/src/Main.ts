import { Starter, Assets, Keys, Font, FontCharData } from "miglib";
import { GameScreen } from "./GameScreen";
import { towerActions } from "./Tower";


function fromStringArray(...chars: Array<string>): Record<string, FontCharData> {
    const obj: Record<string, FontCharData> = {};

    for (let i = 0; i < chars.length; i++) {
        const c = chars[i].charAt(0);
        const w = chars[i].length > 1 ? (Number)(chars[i].charAt(1)) : 6;
        const offsetY = chars[i].length > 2 ? (Number)(chars[i].charAt(2)) : 0;
        obj[c] = {
            x: i % 10 * 6,
            y: Math.floor(i / 10) * 6,
            w, h: 6,
            offsetY,
        };
    }

    return obj;
}

const chardata: Record<string, FontCharData> = fromStringArray("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b5", "c4", "d5", "e5", "f3", "g51", "h5", "i2", "j3", "k5", "l2", "m", "n4", "o5", "p51", "q51", "r5", "s4", "t4", "u5", "v", "w", "x4", "y51", "z5", " ", " ", " ", " ", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".2", ",2", ":2", ";2", "!2", "?", "'", "\\4", "/4", "(3", ")3", "[3", "]3", "{4", "}4", "<4", ">4", "|2", "_", "+", "&7", "%", "$", "@7", "^", "~", "`", "#", "-", "=", "\"4", " ");

export const FONT = new Font("font", chardata, 3);
export const FONT_LARGE = new Font("font", chardata, 4);

(window as any).miglib = new Starter((assets: Assets) => {

    assets.loadImage("font", "font.png");

    // UI elements
    assets.loadImage("button", "button.png");
    assets.loadImage("bar", "bar.png");
    assets.loadImage("bar_add", "bar_add.png");
    assets.loadImage("cursor", "cursor.png");
    assets.loadImage("range", "range.png");
    assets.loadImage("hover_transparency", "hover_transparency.png");
    assets.loadImage("plus", "plus.png");
    assets.loadImage("equals", "equals.png");
    assets.loadImage("arrow", "arrow.png");
    assets.loadImage("panel_red", "panel_red.png");
    assets.loadImage("panel_blue", "panel_blue.png");
    assets.loadImage("damage", "damage.png");
    assets.loadImage("damage_boost", "damage_boost.png");
    assets.loadImage("money", "money.png");
    assets.loadImage("moneymini", "moneymini.png");

    // Terrain
    assets.loadImage("background", "background.png");
    assets.loadImage("path", "path.png");

    // Towers
    Object.keys(towerActions).forEach(towerType => {
        assets.loadImage("tower/" + towerType, "tower/" + towerType + ".png");
    });

    // Enemies
    assets.loadImage("enemy/basic", "enemy/basic.png");
    assets.loadImage("enemy/fast", "enemy/fast.png");
    assets.loadImage("enemy/boss", "enemy/boss.png");

    for (let i = 1; i <= 8; i++) {
        assets.loadImage("enemy/number/" + i, "enemy/number/" + i + ".png");
    }

    return new GameScreen(assets);

});

export const SCALE_FACTOR = 3;
export const DEBUG_MODE = true;
