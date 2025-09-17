import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import StartMenuItem from "./StartMenuItem";
import type { LinkApp, DesktopActions } from "./Interfaces";


const styles: { [key: string]: CSSProperties } = {
    menu: {
        position: "absolute",
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

function flattenMenuItems(items: LinkApp[]): LinkApp[] {
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

interface StartMenuProps {
    ref: RefObject<HTMLDivElement | null>
    onBlur: () => void
    items: LinkApp[];
    desktopActions: DesktopActions
}

export default function StartMenu({ ref, onBlur, items, desktopActions }: StartMenuProps) {

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
                    flattenMenuItems(items).filter(x => x.name?.toLowerCase().includes(searchValue.toLowerCase())) :
                    items
                ).map((item, i) => (
                    <StartMenuItem key={i} item={item} desktopActions={desktopActions} />
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