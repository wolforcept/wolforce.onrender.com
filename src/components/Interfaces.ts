
export interface Pos {
    x: number
    y: number
}

export interface Dim {
    w: number
    h: number
}

export interface Ico {
    x: number
    y: number
    id: string
}

export interface WindowData {
    id: number;
    title: string;
    link: string;
    content: React.ReactNode;
    initialWidth: number;
    initialHeight: number;
}

export interface LinkApp {
    id: string;
    title?: string;
    link?: string;
    image?: string;
    width?: number;
    height?: number;
    children?: LinkApp[]
}

export interface DesktopActions {
    openLink(link: LinkApp): void
    toggleStartMenu(): void
    hideStartMenu(): void
    openNewWindow(link: LinkApp): void
    restoreDefaultIcons(): void
}