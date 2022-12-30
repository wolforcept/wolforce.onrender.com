import { FC, ReactElement, useRef } from "react";
import Draggable from "react-draggable";
import { DesktopFunctions } from "./Desktop";
import { WindowInitProps } from "./Window";

export interface DesktopIconProps {
    x: number;
    y: number;
    imgSrc: string;
    initProps: WindowInitProps;
    makeComponent: () => ReactElement;
}

const ICON_SIZE = 64;

const DesktopIcon: FC<DesktopIconProps> = ({ x, y, imgSrc, initProps, makeComponent }) => {

    const nodeRef = useRef(null);

    function onDoubleClick() {
        DesktopFunctions.openApp(initProps, makeComponent);
    }

    return (
        <Draggable grid={[ICON_SIZE / 2, ICON_SIZE / 2]} nodeRef={nodeRef} defaultClassName='desktopIcon' defaultPosition={{ x: x * ICON_SIZE, y: y * ICON_SIZE }}>
            <div ref={nodeRef} onClick={(event: any) => {
                if (event.detail === 2) {
                    onDoubleClick()
                }
            }}>
                <img draggable='false' src={imgSrc} width='100%'></img>
            </div >
        </Draggable >
    )
}

export default DesktopIcon;