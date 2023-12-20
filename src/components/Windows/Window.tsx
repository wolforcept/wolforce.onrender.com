import { FC, useLayoutEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable'
import { Text, createStyles, Card, Group, Image, Space, Menu } from '@mantine/core';
import { IconArrowsLeftRight, IconBoxMultiple, IconBoxOff, IconMaximize, IconMessageCircle, IconPhoto, IconSearch, IconSettings, IconSquareArrowDown, IconSquareX, IconTrash, IconX, IconXboxX } from '@tabler/icons';
import { DesktopFunctions } from './Desktop';
import { useClickOutside } from '@mantine/hooks';

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
        opacity: 1,
        ':hover': {
            opacity: 1
        },
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
        // minWidth: MINIMIZED_WIDTH,
        margin: 8,
        marginTop: 'auto',
        textAlign: 'center',
        cursor: 'pointer',
    },

}));

export interface WindowInitProps {
    title: string,
    w?: number, h?: number,
    scroll?: boolean,
    icon?: string
}

interface WindowProps {
    initProps?: WindowInitProps;
    children?: any;
    id: number;
}

const Window: FC<WindowProps> = ({ initProps, children, id }) => {

    const nodeRef = useRef(null as any);
    const [activeDrags, setActiveDrags] = useState(0)
    const [width, setWidth] = useState<number | undefined>(initProps?.w)
    const [height, setHeight] = useState<number | undefined>(initProps?.h)
    const [isResizing, setIsResizing] = useState(undefined as (undefined | { x: number, y: number }))
    const [isMinimized, setIsMinimized] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 } as ({ x: number, y: number }))
    const [prevPosSize, setPrevPosSize] = useState<undefined | { x: number, y: number, w: number | undefined, h: number | undefined }>(undefined)
    const [contextMenuOpened, setContextMenuOpened] = useState(false);
    const clickOutsideRef = useClickOutside(() => setContextMenuOpened(false));

    useLayoutEffect(() => {
        if (nodeRef.current) {
            if (width === undefined)
                setWidth(nodeRef.current.offsetWidth)
            if (height === undefined)
                setHeight(nodeRef.current.offsetHeight)
        }
    }, [width, height]);

    const onDrag = (e: any, position: any) => {
        const { x, y } = position;
        if (prevPosSize !== undefined) {
            prevPosSize?.w && setWidth(prevPosSize.w)
            prevPosSize?.h && setHeight(prevPosSize.h)
            setPosition({ x: e.clientX - ((prevPosSize?.w ?? 0) / 2), y: e.clientY })
            console.log(e)
        } else {
            setPosition({ x, y })
        }
        setPrevPosSize(undefined)
    }

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
            setWidth((width ?? 0) + (e.clientX - isResizing.x))
            setHeight((height ?? 0) + (e.clientY - isResizing.y))
            setPrevPosSize(undefined)
        }
    }

    const close = () => {
        DesktopFunctions.closeApp(id);
    }

    const closeOthers = () => {
        DesktopFunctions.closeAppsFiltered(x => x.props.id !== id)
    }

    const closeAll = () => {
        DesktopFunctions.closeAppsFiltered(x => true)
    }

    const toggleFullscreen = () => {
        if (prevPosSize === undefined) {
            setPrevPosSize({ ...position, w: width, h: height })
            setPosition({ x: 0, y: 0 })
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        } else {
            setPosition({ x: prevPosSize.x, y: prevPosSize.y })
            prevPosSize?.w && setWidth(prevPosSize.w);
            prevPosSize?.h && setHeight(prevPosSize.h);
            setPrevPosSize(undefined)
        }
    }

    const { classes, cx } = useStyles();

    let cardStyle: any = {
        display: isMinimized ? 'none' : 'block',
        overflow: 'visible',
        width: isMinimized ? MINIMIZED_WIDTH : width,
        height: isMinimized ? BAR_HEIGHT : height,
    }

    return (<>

        <Menu shadow="md" width={200} opened={contextMenuOpened} >
            <Menu.Target>
                <Card shadow="xl" p={0} radius="md" withBorder
                    className={classes.minimized}
                    style={{ paddingLeft: 8, paddingRight: 8, backgroundColor: isMinimized ? undefined : "#ffffff20" }}
                    onClick={() => setIsMinimized(!isMinimized)}
                    onContextMenu={(e) => { e.preventDefault(); setContextMenuOpened(true) }}
                >
                    <div className='unselectable'>
                        {initProps?.icon && <img height='24px' alt={initProps.title} src={initProps.icon} style={{ marginRight: 10 }} />}
                        {initProps?.title ?? ''}
                    </div>
                </Card>
            </Menu.Target>

            <Menu.Dropdown>
                <div ref={clickOutsideRef}>
                    {/* <Menu.Label>Application</Menu.Label> */}
                    <Menu.Item color="red" icon={<IconX size={14} />} onClick={close}>Close</Menu.Item>
                    <Menu.Item color="red" icon={<IconBoxMultiple size={14} />} onClick={closeAll}>Close All</Menu.Item>
                    <Menu.Item color="red" icon={<IconBoxMultiple size={14} />} onClick={() => { closeOthers(); setContextMenuOpened(false) }} >Close Others</Menu.Item>
                    <Menu.Item icon={<IconMaximize size={14} />} onClick={() => { toggleFullscreen(); setContextMenuOpened(false) }}>Maximize</Menu.Item>
                    {/* <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item> */}
                    {/* <Menu.Item
                        icon={<IconSearch size={14} />}
                        rightSection={<Text size="xs" color="dimmed">⌘K</Text>}
                    >
                        Search
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Label>Danger zone</Menu.Label>
                    <Menu.Item icon={<IconArrowsLeftRight size={14} />}>Transfer my data</Menu.Item>
                    <Menu.Item color="red" icon={<IconTrash size={14} />}>Delete my account</Menu.Item> */}
                </div>
            </Menu.Dropdown>
        </Menu>


        <Draggable nodeRef={nodeRef} handle=".draggableHandle" position={position} {...{ onStart, onStop }} onDrag={onDrag} defaultClassName='Window'>
            <Card ref={nodeRef} shadow="xl" p={0} radius="md" withBorder className={'WindowCard'}
                style={cardStyle} >
                <Group className={cx('draggableHandle', activeDrags > 0 ? cx(classes.windowBar, classes.windowBarDragging) : classes.windowBar)} >
                    <Card.Section className={classes.windowId}>
                        {initProps?.icon && <img height='24px' alt={initProps.title} src={initProps.icon} />}
                    </Card.Section>
                    <Text>{initProps?.title ?? ''}</Text>
                    <Card.Section>
                        {!isMinimized && <>
                            <IconSquareArrowDown className={classes.barButton} onClick={() => setIsMinimized(true)} />
                            <IconMaximize className={classes.barButton} onClick={() => toggleFullscreen()} />
                            <IconSquareX className={classes.barButton} onClick={close} />
                        </>}
                    </Card.Section>
                </Group>
                <div style={{ width: '100%', height: `calc(100% - 34px)`, overflowY: initProps?.scroll ? 'auto' : 'hidden', overflowX: 'hidden' }}>
                    {children}
                </div>
                <div className={isResizing !== undefined ? "resizePointMoving" : "resizePoint"} onMouseDown={startResize} onMouseUp={stopResize} onMouseLeave={stopResize} onMouseMove={resize}></div>
            </Card>
        </Draggable >
    </>)
}

export default Window;
