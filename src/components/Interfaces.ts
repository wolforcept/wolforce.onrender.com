
export interface Pos {
    x: number
    y: number
}

export interface Dim {
    w: number
    h: number
}

export interface Icon {
    x: number
    y: number
    id: string
    link?: string;
    image?: string;
}

export interface Window {
    id: number;
    title: string;
    content: React.ReactNode;
    initialWidth: number;
    initialHeight: number;
}

export interface LinkApp {
    id: string;
    name?: string;
    image?: string;
    link?: string;
    children?: LinkApp[]
}

export interface DesktopActions {
    openLink(link: string): void
    toggleStartMenu(): void
    hideStartMenu(): void
    openNewWindow(link: string, width?: number, height?: number): void
    restoreDefaultIcons(): void
}