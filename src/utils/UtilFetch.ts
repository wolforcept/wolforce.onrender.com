export async function fetchJson<T = any[]>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch JSON from ${url}: ${res.statusText}`);
    }
    const data: T = await res.json();
    return data;
}
