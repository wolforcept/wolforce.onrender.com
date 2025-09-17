import { useEffect, useRef, useState } from "react";
import type { Pos } from "./Interfaces";

const style: React.CSSProperties = {
    position: "fixed",
    minWidth: "64px",
    maxWidth: "64px",
    minHeight: "64px",
    maxHeight: "64px",
    cursor: "grab",
    userSelect: "none",
    padding: 2,
    borderRadius: 4
}

interface DesktopIconProps {
    doAction: () => void
    getPosition: () => Pos
    setPosition: (pos: Pos) => void
    icon: any
    altText?: string
    getOthers: () => Pos[]
}

export default function DesktopIcon({ doAction, getPosition, setPosition, icon, altText, getOthers }: DesktopIconProps) {

    const boxRef = useRef<HTMLDivElement>(null)
    const [lastPosition, setLastPosition] = useState<Pos>({ ...getPosition() })
    const [offset, setOffset] = useState<Pos | null>(null)
    const [isHovered, setIsHovered] = useState(false)
    const movedDistance = useRef(0);
    const lastClick = useRef(0);


    function existsAt(x: number, y: number): boolean {
        for (let pos of getOthers())
            if (pos.x === x && pos.y === y) return true;
        return false;
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        const box = boxRef.current
        if (box) {
            movedDistance.current = 0;
            const pos = getPosition();
            setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y })
            e.preventDefault()
        }
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (offset) {
            movedDistance.current++;
            setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y })
        }
        e.preventDefault()
    }

    const handleMouseUp = (e: MouseEvent) => {
        if (movedDistance.current === 0) {
            const now = Date.now();
            console.log(now - lastClick.current)
            if (now - lastClick.current < 300)
                doAction();
            lastClick.current = now;
        }
        if (offset) {
            const x = 64 * Math.round((e.clientX - offset.x) / 64)
            const y = 64 * Math.round((e.clientY - offset.y) / 64)
            if (existsAt(x, y)) {
                setPosition({ ...lastPosition })
            } else {
                setPosition({ x, y })
                setLastPosition({ x, y })
            }
        }
        setOffset(null)
        e.preventDefault()
    };

    useEffect(() => {
        if (offset) {
            window.addEventListener("mousemove", handleMouseMove)
            window.addEventListener("mouseup", handleMouseUp)
        } else {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        };
    }, [offset])

    const pos = getPosition();

    return (
        <div
            ref={boxRef}
            onMouseDown={handleMouseDown}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                ...style,
                top: pos.y, left: pos.x,
                border: isHovered ? "1px solid #FFFFFF44" : "1px solid transparent"
            }}>
            <img src={icon} alt={altText} style={{ width: 64, height: 64, filter: "drop-shadow(2px 3px 2px #00000055)" }} />
            <img src="https://i.imgur.com/rVcbILM.png" style={{ position: "absolute", left: 0, bottom: 0 }} />
        </div>
    );
}