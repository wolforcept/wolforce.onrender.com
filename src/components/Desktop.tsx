import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import Data from "./../Data";
import type { Pos, WindowData, DesktopActions, LinkApp, Ico } from "./Interfaces";
import DesktopIcon from "./DesktopIcon";
import DesktopWindow from "./DesktopWindow";
import Taskbar from "./Taskbar";
import { Util } from "../utils/Util";

const styles: { [key: string]: CSSProperties } = {
    desktop: {
        position: "fixed",
        backgroundColor: "#ffffff",
    }
}

export default function Desktop() {

    const [linkApps, internalSetLinkApps] = useState<LinkApp[]>([]);
    const [flattenedLinkApps, setFlattenedLinkApps] = useState<LinkApp[]>([]);

    const setLinkApps = (linkApps: LinkApp[]) => {
        setFlattenedLinkApps(Util.flattenMenuItems(linkApps));
        internalSetLinkApps(linkApps);
    }

    useEffect(() => {
        Data.fetchExternalItems().then(linkApps => {
            setLinkApps(linkApps);

            const storedIcons = Data.loadLocal<Ico[]>("desktop_icons")
            if (storedIcons) setIcons(storedIcons)
            else setIcons(defaultIcons(linkApps));
        })
    }, [])

    const defaultIcons = (linkApps: LinkApp[]) => {

        const flattenedLinkApps = Util.flattenMenuItems(linkApps);

        return [
            { x: 1 * 64, y: 2 * 64, id: "hearthwell" },
            { x: 3 * 64, y: 4 * 64, id: "wordaria" },
            { x: 6 * 64, y: 4 * 64, id: "images" },
        ]
    };

    const afterRenderQueue = useRef<(() => void)[]>([]);

    useLayoutEffect(() => {
        afterRenderQueue.current.forEach(cb => cb());
        afterRenderQueue.current = [];
    });

    function runAfterNextRender(cb: () => void) {
        afterRenderQueue.current.push(cb);
    }

    //#region WINDOW DATA
    const [windows, setWindows] = useState<WindowData[]>([]);
    const [focusedWindow, setFocusedWindow] = useState<number | null>(null);

    const openNewWindow = (linkApp: LinkApp) => {

        const { link, width, height, title } = linkApp;

        if (!link) return;

        const id = Date.now();
        const iframe = (
            <iframe
                src={linkApp.link}
                style={{ width: "100%", height: "100%" }}
                onLoad={() => console.log("loaded")}
            >
            </iframe>
        )

        setWindows(prev => [
            ...prev,
            {
                id,
                link,
                title: title ?? "New Window",
                content: iframe,
                initialWidth: width || 500,
                initialHeight: height || 500,
            }
        ]);

        // runAfterNextRender(() => {
        // windows[id]
        // console.log("test")

        // });

        setFocusedWindow(id);

    };

    const removeWindow = (id: number) => {
        setWindows(prev => prev.filter(w => w.id !== id));
    };
    //#endregion

    //#region ICON DATA

    const [icons, setInternalIcons] = useState<Ico[]>([])

    const setIcons = (icons: Ico[]) => {
        setInternalIcons(icons)
        Data.saveLocal("desktop_icons", icons)
    }

    const setIconPosition = (i: number, pos: Pos) => {
        const newIcons = [...icons]
        newIcons[i].x = pos.x
        newIcons[i].y = pos.y
        setIcons(newIcons)
    }

    const openIco = (linkApp: LinkApp) => {

    }

    const getIcoImg = (ico: Ico) => {
        const linkApp = flattenedLinkApps.find(x => x.title?.toLowerCase() === ico.id);
        if (linkApp && linkApp.image) return linkApp.image;
        return "./images/transparent.png"
    }

    //#endregion

    //#region START MENU DATA
    const [isStartMenuVisible, _setIsStartMenuVisible] = useState(false);
    const setIsStartMenuVisible = (b: boolean) => {
        if (b) setFocusedWindow(null);
        _setIsStartMenuVisible(b);
    }
    //#endregion

    const openLink = (linkApp: LinkApp) => {
        const { link } = linkApp;

        if (!link) return;

        if (link.startsWith("desktopAction://")) {
            const actionName = link.substring(16).split(":")[0];
            const actionArgs = link.substring(16).split(":")[1].split(",");
            (desktopActions as any)[actionName](...actionArgs)
        } else if (link.startsWith("external://")) {
            window.open(link.substring(11), "_blank", "noreferrer");
        } else {
            openNewWindow(linkApp)
        }
    }

    const desktopActions: DesktopActions = {
        openNewWindow,
        hideStartMenu: () => setIsStartMenuVisible(false),
        toggleStartMenu: () => setIsStartMenuVisible(!isStartMenuVisible),
        restoreDefaultIcons: () => setIcons([...defaultIcons(linkApps)]),
        openLink
    }

    return (
        <div style={styles.desktop}>

            <Taskbar linkApps={linkApps} desktopActions={desktopActions} isStartMenuVisible={isStartMenuVisible} openedWindows={windows} />

            {icons.map((ico, index) => (
                <DesktopIcon
                    key={index}
                    getPosition={() => icons[index]}
                    setPosition={(pos) => setIconPosition(index, pos)}
                    doAction={openIco}
                    ico={ico}
                    image={getIcoImg(ico)}
                    getOthers={() =>
                        icons.filter(x => x !== null).filter((_, i) => i !== index)
                    }
                />
            ))}

            {windows.map(win => (
                <DesktopWindow
                    key={win.id}
                    win={win}
                    id={win.id}
                    onClose={() => removeWindow(win.id)}
                    isFocused={focusedWindow === win.id}
                    setFocused={(id) => setFocusedWindow(id)}
                >
                    {win.content}
                </DesktopWindow>
            ))}

        </div>
    );

}
