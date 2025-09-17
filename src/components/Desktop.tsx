import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import Data from "./../Data";
import type { Icon, Pos, Window, DesktopActions } from "./Interfaces";
import DesktopIcon from "./DesktopIcon";
import DesktopWindow from "./DesktopWindow";
import Taskbar from "./Taskbar";

const styles: { [key: string]: CSSProperties } = {
    desktop: {
        position: "fixed",
        backgroundColor: "#ffffff",
    }
}

const defaultIcons: Icon[] = [
    {
        x: 1 * 64,
        y: 2 * 64,
        id: "hearthwell",
        link: "/games/hearthwell",
        image: "/images/mods/hearthwell/hearthwell64.png"
    },
    {
        x: 3 * 64,
        y: 4 * 64,
        id: "wordaria",
        link: "/games/wordaria",
        image: "/images/mobile/wordaria/wordaria64.png"
    },
];

interface DesktopProps {
}

export default function Desktop({ }: DesktopProps) {

    const afterRenderQueue = useRef<(() => void)[]>([]);

    useLayoutEffect(() => {
        afterRenderQueue.current.forEach(cb => cb());
        afterRenderQueue.current = [];
    });

    function runAfterNextRender(cb: () => void) {
        afterRenderQueue.current.push(cb);
    }

    //#region WINDOW DATA
    const [windows, setWindows] = useState<Window[]>([]);

    const openNewWindow = (link: string, width?: number, height?: number) => {
        const id = Date.now();
        const iframe = (
            <iframe
                src={link}
                style={{ width: "100%", height: "100%" }}
                onLoad={() => console.log("loaded")}
            >
            </iframe>
        )

        setWindows(prev => [
            ...prev,
            {
                id,
                title: "New Window",
                content: iframe,
                initialWidth: width || 500,
                initialHeight: height || 500,
            }
        ]);

        runAfterNextRender(() => {
            windows[id]
        });

    };

    const removeWindow = (id: number) => {
        setWindows(prev => prev.filter(w => w.id !== id));
    };
    //#endregion

    //#region ICON DATA

    const [icons, setInternalIcons] = useState<Icon[]>([])

    const setIcons = (icons: Icon[]) => {
        setInternalIcons(icons)
        Data.saveLocal("desktop_icons", icons)
    }

    const setIconPosition = (i: number, pos: Pos) => {
        const newIcons = [...icons]
        newIcons[i].x = pos.x
        newIcons[i].y = pos.y
        setIcons(newIcons)
    }

    useEffect(() => {
        const storedIcons = Data.loadLocal<Icon[]>("desktop_icons")
        if (storedIcons)
            setIcons(storedIcons)
        else
            setIcons(defaultIcons)
    }, []);

    //#endregion

    //#region START MENU DATA
    const [isStartMenuVisible, setIsStartMenuVisible] = useState(false);
    //#endregion

    const openLink = (link: string) => {
        if (link.startsWith("desktopAction://")) {
            const actionName = link.substring(16).split(":")[0];
            const actionArgs = link.substring(16).split(":")[1].split(",");
            (desktopActions as any)[actionName](...actionArgs)
        } else if (link.startsWith("external://")) {
            window.open(link.substring(11), "_blank", "noreferrer");
        } else {
            openNewWindow(link)
        }
    }

    const desktopActions: DesktopActions = {
        openNewWindow,
        hideStartMenu: () => setIsStartMenuVisible(false),
        toggleStartMenu: () => setIsStartMenuVisible(!isStartMenuVisible),
        restoreDefaultIcons: () => setIcons([...defaultIcons]),
        openLink
    }

    return (
        <div style={styles.desktop}>

            {icons.map((icon, index) => (
                <DesktopIcon
                    key={index}
                    getPosition={() => icons[index]}
                    setPosition={(pos) => setIconPosition(index, pos)}
                    doAction={() => icon.link && openLink(icon.link)}
                    icon={icon.image}
                    getOthers={() =>
                        icons.filter(x => x !== null).filter((_, i) => i !== index)
                    }
                />
            ))}

            {windows.map(win => (
                <DesktopWindow
                    title={win.title}
                    key={win.id}
                    initialWidth={win.initialWidth}
                    initialHeight={win.initialHeight}
                    onClose={() => removeWindow(win.id)}
                    id={win.id}
                >
                    {win.content}
                </DesktopWindow>
            ))}

            <Taskbar desktopActions={desktopActions} isStartMenuVisible={isStartMenuVisible} openedWindows={windows} />
        </div>
    );

}
