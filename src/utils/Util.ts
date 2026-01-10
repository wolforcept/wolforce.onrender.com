import type { LinkApp } from "../components/Interfaces";

export class Util {
    static flattenMenuItems(items: LinkApp[]): LinkApp[] {
        const result: LinkApp[] = [];

        const traverse = (itemList: LinkApp[]) => {
            for (const item of itemList) {
                result.push(item);
                if (item.children) {
                    traverse(item.children);
                }
            }
        };

        traverse(items);
        return result;
    }
}