import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import StartMenuItem from "./StartMenuItem";
import type { LinkApp, DesktopActions } from "./Interfaces";
import { Util } from "../utils/Util";

const styles: { [key: string]: CSSProperties } = {
    menu: {
        position: "fixed",
        bottom: "40px",
        left: 0,
        backgroundColor: "#c0c0c0",
        border: "2px solid black",
        boxShadow: "3px 3px 3px #00000055",
        minWidth: "160px",
        fontFamily: "sans-serif",
        fontSize: "13px",
        padding: "2px 0",
        outline: "none",
    },
    input: {
        backgroundColor: "transparent",
        border: "none",
        borderBottom: "1px solid #00000066",
        marginBottom: 2,
        width: "90%",
        marginLeft: "4%",
        outline: "none",
    }
};

interface StartMenuProps {
    ref: RefObject<HTMLDivElement | null>
    onBlur: () => void
    linkApps: LinkApp[];
    desktopActions: DesktopActions
}

export default function StartMenu({ ref, onBlur, linkApps: items, desktopActions }: StartMenuProps) {

    const [searchValue, setSearchValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleOnKeyDown = () => {
        if (inputRef.current)
            inputRef.current.focus();
    }

    const handleOnBlur = () => {
        setSearchValue("");
        onBlur();
    }

    return (
        <div
            style={styles.menu}
            tabIndex={-1}
            ref={ref}
            onBlur={handleOnBlur}
            onKeyDown={handleOnKeyDown}
        >
            {
                (searchValue ?
                    Util.flattenMenuItems(items).filter(x => x.title?.toLowerCase().includes(searchValue.toLowerCase())) :
                    items
                ).map((item, i) => (
                    <StartMenuItem key={i} linkApp={item} desktopActions={desktopActions} />
                ))}
            <input
                style={styles.input}
                value={searchValue}
                ref={inputRef}
                onChange={(e) => setSearchValue(e.target.value)}
            />
        </div>
    );
}