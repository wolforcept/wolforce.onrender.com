import type { LinkApp } from "./components/Interfaces";

const itemsUrl = "items.json";

export default class Data {

    public static saveLocal(name: string, item: any) {
        localStorage.setItem(name, JSON.stringify(item));
    }

    public static loadLocal<T>(name: string): T | undefined {
        const loaded = localStorage.getItem(name)
        if (!loaded) return undefined
        return JSON.parse(loaded);
    }


    static async fetchExternalItems(): Promise<LinkApp[]> {
        try {
            const response = await fetch(itemsUrl);

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Invalid format: 'items' array missing");
            }

            return data as LinkApp[];
        } catch (error) {
            console.error("Error fetching external items:", error);
            return [];
        }
    }

}