import { useState } from "react";
import type { LinkApp, DesktopActions } from "./Interfaces";

interface StartMenuItemProps {
    item: LinkApp;
    desktopActions: DesktopActions
}

export default function StartMenuItem({ item, desktopActions }: StartMenuItemProps) {
    const [open, setOpen] = useState(false);

    const hasChildren = item.children && item.children.length > 0;

    return (
        <div
            style={{
                position: "relative",
                backgroundColor: open ? "#000080" : "transparent",
                color: open ? "#fff" : "#000",
                padding: "4px 8px",
                cursor: "default",
                whiteSpace: "nowrap",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onClick={(e) => {
                if (!hasChildren && item.link) {
                    desktopActions.openLink(item.link);
                    desktopActions.hideStartMenu();
                }
                e.stopPropagation();
            }}
        >
            <span>{item.name}</span>
            {hasChildren && <span style={{ marginLeft: "8px" }}>▶</span>}
            {hasChildren && open && (
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: "100%",
                        backgroundColor: "#c0c0c0",
                        border: "2px solid black",
                        boxShadow: "2px 2px #808080",
                        minWidth: "160px",
                        zIndex: 100,
                    }}
                >
                    {item.children!.map((child: any, i: number) => (
                        <StartMenuItem key={i} item={child} desktopActions={desktopActions} />
                    ))}
                </div>
            )}
        </div>
    );
}
