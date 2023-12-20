import { Text, Transition } from "@mantine/core";
import { FC, ReactElement, useRef } from "react";
import Draggable from "react-draggable";
import { DesktopFunctions } from "./Desktop";
import { WindowInitProps } from "./Window";
import { useHover } from '@mantine/hooks';

export interface DesktopIconProps {
    x?: number
    y?: number
    imgSrc: string
    initProps?: WindowInitProps
    name: string
    makeComponent: () => ReactElement
    locked?: boolean
}

const ICON_SIZE = 64;

const DesktopIcon: FC<DesktopIconProps> = ({ x, y, imgSrc, initProps, name, makeComponent, locked }) => {

    const { hovered, ref } = useHover();
    const nodeRef = useRef(null);

    function onDoubleClick() {
        DesktopFunctions.openApp(initProps, makeComponent);
    }

    return (
        <Draggable grid={[ICON_SIZE / 2, ICON_SIZE / 2]} nodeRef={nodeRef} defaultClassName={locked ? 'desktopIcon locked' : 'desktopIcon'} defaultPosition={{ x: (x ?? 0) * ICON_SIZE, y: (y ?? 0) * ICON_SIZE }} disabled={locked}>
            <div ref={nodeRef} onClick={(event: any) => {
                if (event.detail === 2) {
                    onDoubleClick()
                }
            }} style={{ overflow: "hidden" }}>
                <div ref={ref}>
                    <Transition mounted={hovered} transition="fade" duration={1000} timingFunction="ease" >
                        {(styles) => <div style={{ ...styles, position: "absolute", width: "100%", height: '100%', top: 0, left: 0, background: 'linear-gradient(0deg, #25262bFF 20%, #25262b00 100%)' }}>
                            <Text align="center" w='100%' style={{ paddingTop: 45 }}>{name}</Text>
                        </div>}
                    </Transition>
                    <img alt={name} draggable='false' src={imgSrc} width='100%'></img>
                </div>
            </div>
        </Draggable >
    )
}

export default DesktopIcon;