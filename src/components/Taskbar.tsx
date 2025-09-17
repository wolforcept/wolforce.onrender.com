import { useEffect, useRef, useState, type CSSProperties } from "react";
import Data from "../Data";
import type { LinkApp, DesktopActions, Window } from "./Interfaces";
import StartMenu from "./StartMenu";

const styles: { [key: string]: CSSProperties } = {
    taskbar: {
        position: "fixed",
        bottom: 0,
        width: "100%",
        backgroundColor: "#d4d0c8",
        // borderTop: 1px solid white,
        padding: "4px",
        display: "flex",
        flexDirection: "row",
        cursor: "pointer",
    },
    button: {
        display: "flex",
        flexDirection: "row",
        fontFamily: "\"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif",
        fontWeight: "bold",
        fontSize: "120%",
        alignItems: "center",
        borderRight: "2px solid #808080",
        borderBottom: "2px solid #808080",
        userSelect: "none",

        // "&:hover": {
        //     background: "#efefef"
        // },
    },
    taskbarWindow: {
        display: "flex",
        flexDirection: "row",
        fontFamily: "\"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif",
        fontWeight: "bold",
        fontSize: "100%",
        alignItems: "center",
        border: "2px solid #808080",
        userSelect: "none",
        paddingLeft: 4,
        paddingRight: 4,
        marginLeft: 4,
    }
}

interface TaskbarProps {
    isStartMenuVisible: boolean
    desktopActions: DesktopActions,
    openedWindows: Window[]
}

export default function Taskbar({ isStartMenuVisible, desktopActions, openedWindows }: TaskbarProps) {

    const [items, setItems] = useState<LinkApp[]>([]);

    const buttonRef = useRef<HTMLDivElement>(null);
    const startMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isStartMenuVisible && startMenuRef.current)
            startMenuRef.current.focus();
    }, [isStartMenuVisible, startMenuRef])

    useEffect(() => {
        Data.fetchExternalItems().then(items => setItems(items))
    }, [])

    const handleOnBlur = () => {
        setTimeout(() => {
            if (startMenuRef.current && !startMenuRef.current.contains(document.activeElement))
                desktopActions.hideStartMenu();
        }, 50)
    }

    return (
        <div id="taskbar" style={styles.taskbar}>
            <div id="startButtonWrapper"
                ref={buttonRef}
                onClick={() => desktopActions.toggleStartMenu()}
                style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    border: "2px solid white",
                    borderBottom: "2px solid #404040",
                    borderRight: "2px solid #404040",
                    float: "left",
                }}>
                <div id="startButton" style={styles.button}>
                    <img src="https://wolforcept.github.io/images/icon128.png" style={{ marginRight: "4px", height: "26px" }} />
                    <span style={{ marginRight: "4px", transform: "translateY(-1px)" }}>Start</span>
                </div>
            </div>
            <div style={{ visibility: isStartMenuVisible ? "visible" : "hidden", userSelect: "none" }}>
                <StartMenu ref={startMenuRef} onBlur={handleOnBlur} items={items} desktopActions={desktopActions} />
            </div>
            {openedWindows.map(win => {

                return (<div style={styles.taskbarWindow}>{win.title}</div>)
            })}
        </div >
    );
}