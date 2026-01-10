import React, { useEffect, useRef, useState, type CSSProperties, type FocusEventHandler } from "react";
import type { WindowData } from "./Interfaces";

let zCounter = 100; // global counter for stacking

const styles: { [key: string]: CSSProperties } = {
    window: {
        position: "fixed",
        border: "2px solid #000",
        backgroundColor: "#c0c0c0",
        boxShadow: "3px 3px 3px #00000044",
        overflow: "hidden",
        userSelect: "none",
        outline: "none",
    },
    titleBar: {
        backgroundColor: "#000080",
        color: "#fff",
        padding: "2px 6px",
        // cursor: "move",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "sans-serif",
        fontSize: "12px",
        userSelect: "none"
    },
    content: {
        backgroundColor: "#ffffff",
        fontFamily: "sans-serif",
        fontSize: "14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
    },
    resizeHandle: {
        position: "absolute",
        width: "12px",
        height: "12px",
        right: 0,
        bottom: 0,
        cursor: "nwse-resize",
        backgroundColor: "#FFFFFF01",
    },
    buttons: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        background: "#c0c0c0",
        border: "1px solid #000",
        width: "16px",
        height: "16px",
        fontSize: "10px",
        lineHeight: "14px",
        textAlign: "center",
        marginLeft: "4px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    darkener: {
        position: "absolute",
        top: 22,
        width: "100%",
        height: "100%",
        backgroundColor: "#222223CC",
        filter: "grayscale(100%)"
    }
};

export default function DesktopWindow({
    win,
    children,
    onClose,
    id,
    isFocused,
    setFocused
}: {
    win: WindowData
    children: React.ReactNode;
    onClose: () => void;
    id: number,
    isFocused: boolean,
    setFocused: (id: number) => void,
}) {

    const w = win.initialWidth;
    const h = win.initialHeight;
    const x = document.body.clientWidth / 2 - win.initialWidth / 2;
    const y = (document.body.clientHeight - 42) / 2 - win.initialHeight / 2;

    const windowRef = useRef<HTMLDivElement>(null);
    const originalSize = useRef({ width: w, height: h, x, y });
    const [size, setSize] = useState({ width: w, height: h });
    const [isTitleMouseDown, setIsTitleMouseDown] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [pos, setPos] = useState({ x, y });
    const offset = useRef({ x: 0, y: 0 });
    const [zIndex, setZIndex] = useState(++zCounter);
    // const [isDarkened, setIsDarkened] = useState(true);
    const mousePosRef = useRef({ x, y });

    const onMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            const newX = e.clientX - offset.current.x;
            const newY = e.clientY - offset.current.y;

            mousePosRef.current = { x: newX, y: newY };
            if (windowRef.current) {
                windowRef.current.style.left = `${newX}px`;
                windowRef.current.style.top = `${newY}px`;
            }
        } else if (isResizing) {
            const newWidth = e.clientX - pos.x;
            const newHeight = e.clientY - pos.y;
            setSize({ width: Math.max(150, newWidth), height: Math.max(100, newHeight) });
        }
        e.preventDefault();
    };

    const onMouseUp = (e: MouseEvent) => {
        if (isDragging)
            setPos({ ...mousePosRef.current });
        setIsDragging(false);
        setIsResizing(false);
        e.preventDefault();
    };

    useEffect(() => {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    });

    const handleTitleMouseUp = (e: React.MouseEvent) => {
        setIsTitleMouseDown(false);
    };

    const handleTitleMouseDown = (e: React.MouseEvent) => {
        setIsTitleMouseDown(true);
        setIsDragging(true);
        offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
        e.preventDefault();
    };

    const handleTitleMouseMoved = (e: React.MouseEvent) => {
        if (isDragging && isMaximized && isTitleMouseDown)
            toggleMaximize(e.clientX);
    };

    const handleResizeMouseDown = () => {
        setIsResizing(true);
    };

    const toggleMaximize = (fromDrag = 0) => {
        if (!isMaximized) {
            originalSize.current = { ...size, x: pos.x, y: pos.y };
            setPos({ x: 0, y: 0 });
            setSize({ width: window.innerWidth, height: window.innerHeight - 40 });
        } else {
            setPos({ x: originalSize.current.x, y: originalSize.current.y });
            setSize({ width: originalSize.current.width, height: originalSize.current.height });
        }
        setIsMaximized(!isMaximized);
        if (fromDrag !== 0) offset.current.x -= fromDrag - originalSize.current.width / 2;
    };

    const toggleMinimize = (fromDrag = 0) => {
        if (!isMaximized) {
            originalSize.current = { ...size, x: pos.x, y: pos.y };
            setPos({ x: 0, y: 0 });
            setSize({ width: window.innerWidth, height: window.innerHeight - 40 });
        } else {
            setPos({ x: originalSize.current.x, y: originalSize.current.y });
            setSize({ width: originalSize.current.width, height: originalSize.current.height });
        }
        setIsMaximized(!isMaximized);
        if (fromDrag !== 0) offset.current.x -= fromDrag - originalSize.current.width / 2;
    };

    const bringToFront = () => {
        setZIndex(++zCounter);
    };

    const onMouseDown = (e: React.MouseEvent) => {
        bringToFront();
        setFocused(id);
    }

    const openLinkInNewWindow = () => {
        window.open(win.link.substring(11), "_blank", "noreferrer");
    };

    return (
        <div
            id={`desktop-window-${id}`}
            style={{ ...styles.window, top: pos.y, left: pos.x, width: size.width, height: size.height, zIndex, filter: isFocused ? "none" : "grayscale(100%) brightness(0.6)" }}
            tabIndex={id}
            onMouseDown={onMouseDown}
            ref={windowRef}
        >
            {!isFocused && <div style={{ ...styles.darkener, pointerEvents: "auto" }} onMouseDown={() => setFocused(id)}></div>}
            <div style={styles.titleBar}
                onMouseDown={handleTitleMouseDown}
                onMouseUp={handleTitleMouseUp}
                onMouseMove={handleTitleMouseMoved}
            >
                <span>{win.title}</span>
                <div style={styles.buttons}>
                    <button style={styles.button} onClick={() => openLinkInNewWindow()}>🗗</button>
                    <button style={styles.button} onClick={() => toggleMinimize()}>-</button>
                    <button style={styles.button} onClick={() => toggleMaximize()}>⌗</button>
                    <button style={styles.button} onClick={onClose}>✕</button>
                </div>
            </div>
            <div style={styles.content}>{children}</div>
            {!isMaximized && (
                <div style={styles.resizeHandle} onMouseDown={handleResizeMouseDown} />
            )}
        </div>
    );
}
