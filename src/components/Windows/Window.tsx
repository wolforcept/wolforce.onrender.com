import { FC, useRef, useState } from 'react';
import Draggable from 'react-draggable'
import { Text, createStyles, Card, Group } from '@mantine/core';
import { IconSquareArrowDown, IconSquareX } from '@tabler/icons';
import { DesktopFunctions } from './Desktop';

const BAR_HEIGHT = 32,
    MINIMIZED_WIDTH = 125;

const useStyles = createStyles((theme) => ({
    windowBar: {
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        cursor: 'grab',
        backgroundColor: theme.colors.dark[5],
        justifyContent: 'space-between',
        padding: 0,
        height: BAR_HEIGHT,
    },

    windowId: {
        paddingLeft: 5,
        paddingRight: 20,
        opacity: 0,
        ':hover': {
            opacity: 1
        }
    },

    windowBarDragging: { cursor: 'grabbing', },

    barButton: {
        cursor: 'pointer',
        transform: 'translatey(3px)',
        opacity: .6,

        ":hover": {
            opacity: 1
        }
    },

    minimized: {
        width: MINIMIZED_WIDTH,
        margin: 8,
        marginTop: 'auto',
        textAlign: 'center',
        cursor: 'pointer',
    },

}));

export interface WindowInitProps {
    title: string,
    w: number | undefined, h: number | undefined
}

interface WindowProps {
    initProps: WindowInitProps;
    children?: any;
    id: number;
}

const Window: FC<WindowProps> = ({ initProps, children, id }) => {

    const nodeRef = useRef(null);
    const [activeDrags, setActiveDrags] = useState(0)
    const [width, setWidth] = useState(initProps.w)
    const [height, setHeight] = useState(initProps.h)
    const [isResizing, setIsResizing] = useState(undefined as (undefined | { x: number, y: number }))
    const [isMinimized, setIsMinimized] = useState(false)

    const onStart = () => {
        setActiveDrags(activeDrags + 1);
    };

    const onStop = () => {
        setActiveDrags(activeDrags - 1);
    };

    const startResize = (e: any) => {
        e.preventDefault();
        setIsResizing({ x: e.clientX, y: e.clientY })
    }
    const stopResize = (e: any) => {
        e.preventDefault();
        setIsResizing(undefined)
    }

    const resize = (e: any) => {
        if (isResizing !== undefined) {
            startResize(e)
            setWidth(width ?? 0 + (e.clientX - isResizing.x))
            setHeight(height ?? 0 + (e.clientY - isResizing.y))
        }
    }

    const close = () => {
        DesktopFunctions.closeApp(id);
    }

    const { classes, cx } = useStyles();

    let cardStyle: any = { display: isMinimized ? 'none' : 'block' };
    if (width !== undefined || height !== undefined)
        cardStyle = { ...cardStyle, width: isMinimized ? MINIMIZED_WIDTH : width, height: isMinimized ? BAR_HEIGHT : height }
    return (<>
        <Card shadow="xl" p={0} radius="md" withBorder
            className={classes.minimized}
            onClick={() => setIsMinimized(!isMinimized)}
        >{initProps.title}</Card>
        <Draggable nodeRef={nodeRef} handle=".draggableHandle" {...{ onStart, onStop }} defaultClassName='windowsWindow'>
            <Card ref={nodeRef} shadow="xl" p={0} radius="md" withBorder className={'resizeWrapper'}
                style={cardStyle} >
                <Group className={cx('draggableHandle', activeDrags > 0 ? cx(classes.windowBar, classes.windowBarDragging) : classes.windowBar)} >
                    <Card.Section className={classes.windowId}>{id}</Card.Section>
                    <Text>{initProps.title}</Text>
                    <Card.Section>
                        {!isMinimized && <>
                            <IconSquareArrowDown className={classes.barButton} onClick={() => setIsMinimized(true)} />
                            <IconSquareX className={classes.barButton} onClick={close} />
                        </>}
                    </Card.Section>
                </Group>
                {children}
                <div className={isResizing ? "resizePointMoving" : "resizePoint"} onMouseDown={startResize} onMouseUp={stopResize} onMouseLeave={stopResize} onMouseMove={resize}></div>
            </Card>
        </Draggable >
    </>)
}

export default Window;
