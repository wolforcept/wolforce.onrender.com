import { useState } from "react";
import type { LinkApp, DesktopActions } from "./Interfaces";

interface StartMenuItemProps {
    linkApp: LinkApp;
    desktopActions: DesktopActions
}

export default function StartMenuItem({ linkApp, desktopActions }: StartMenuItemProps) {
    const [open, setOpen] = useState(false);

    const hasChildren = linkApp.children && linkApp.children.length > 0;

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
                if (!hasChildren && linkApp.link) {
                    desktopActions.openLink(linkApp);
                    desktopActions.hideStartMenu();
                }
                e.stopPropagation();
            }}
        >
            {linkApp.image && <img src={linkApp.image} height={16}></img>}
            <span>{(linkApp.link?.startsWith("external://") ? "🗗 " : "") + linkApp.title}</span>
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
                    {linkApp.children!.map((child: any, i: number) => (
                        <StartMenuItem key={i} linkApp={child} desktopActions={desktopActions} />
                    ))}
                </div>
            )}
        </div>
    );
}
