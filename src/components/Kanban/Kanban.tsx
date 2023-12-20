import { Button, Menu, Textarea } from '@mantine/core';
import RestConnector from 'components/Connector/RestConnector';
import { FC, useEffect, useRef, useState } from 'react';
import { IconCheck, IconPlus, IconSettings, IconTrash } from '@tabler/icons';
import ConnectionFooter from 'components/Windows/ConnectionFooter';
import Draggable from 'react-draggable';
import { RestInterface } from 'components/Connector/RestInterface';
import './Kanban.scss';

interface Pos {
    x: number
    y: number
}

interface PosOf {
    x: number
    y: number
    id: number
}

interface Panel {
    pos: Pos
    text: string
}

interface RenderPostProps {
    id: number
    initialPos: Pos
    initialText: string
    setButtons: (pos: PosOf) => void
    setModified: (modified: boolean) => void
}

const RenderPost: FC<RenderPostProps> = function ({ id, initialPos, initialText, setButtons, setModified }) {

    const ref: any = useRef(null)
    const [position, setPosition] = useState<Pos>({ x: 0, y: 0 })
    const [text, setText] = useState<string>('')

    function onDrag(e: any, pos: Pos) {
        setPosition(pos)
        setButtons({ id, ...pos })
        setModified(true)
        console.log('setting modifiend')
    }

    function onTextChanged(event: any) {
        setText(event.currentTarget.value)
        setModified(true)
    }

    return (
        <Draggable nodeRef={ref} position={position} onDrag={onDrag}>
            <div ref={ref} onMouseEnter={() => setButtons({ id, ...position })} style={{ position: 'absolute' }}>
                <Textarea autosize value={text} onChange={onTextChanged} />
            </div>
        </Draggable>
    )
}

function Kanban() {

    const [rest] = useState(new RestInterface('localhost', '3001', 'kanban'))
    const [posts, setPosts] = useState([] as Array<Panel>)
    const [connected, setConnected] = useState(false)
    const [buttons, setButtons] = useState(undefined as ({ x: number, y: number, id: number } | undefined))
    const [modified, setModified] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('modified: ' + modified);
            if (modified) {
                savePosts()
                setModified(false)
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // useState(setInterval(() => {
    //     console.log('.')
    //     if (modified) {
    //         console.log('!')
    //         savePosts()
    //         setModified(false)
    //     }
    // }, 5000))

    const connector = <RestConnector rest={rest} callback={() => connect()} title={'Kanban Board'} gameId={'kanban'}></RestConnector>;
    if (!connected)
        return connector;

    function connect() {
        setConnected(true)
        getPosts().then(x => x ? setPosts(x) : console.log('posts is falsy: ' + JSON.stringify(posts)))
    }

    async function getPosts(): Promise<Panel[]> {
        const got = (await rest.get())
        console.log(got);
        return got;
    }

    function savePosts() {
        if (connected)
            rest.post(posts)
    }

    function add(type: 'text') {
        setPosts([...posts, {
            pos: { x: 0, y: 0 },
            text: 'write on me!'
        }])
        savePosts()
        console.log('saved!')
    }

    function onDelete() {
        if (buttons && buttons.id >= 0 && buttons.id <= posts.length) {
            const newPosts = [...posts]
            newPosts.splice(buttons.id, 1)
            setPosts(newPosts)
            setButtons(undefined)
        }
    }

    // document.addEventListener("contextmenu", (event) => {
    //     event.preventDefault();
    //     console.log('right click!')
    // });


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'space-between', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
                {posts.map((x, i) => <RenderPost key={i} id={i} initialPos={x.pos} initialText={x.text} setButtons={setButtons} setModified={setModified} />)}
            </div>
            {buttons && <Button onClick={onDelete} style={{ position: 'absolute', padding: 0, width: 22, height: 22, left: buttons.x, top: 15 + buttons.y }}><IconTrash size={16} /></Button>}

            {/* bottom part */}
            <Button style={{ position: 'absolute', bottom: 10, right: 10, padding: "0 5px", borderRadius: 100, border: '1px solid rgb(255,255,255,0.2)' }} onClick={() => add('text')}><IconPlus /></Button>
            <Menu shadow="md" width={200}>
                <Menu.Target>
                    <Button style={{ position: 'absolute', bottom: 10, right: 50, padding: "0 5px", borderRadius: 100, border: '1px solid rgb(255,255,255,0.2)' }}><IconCheck /></Button>
                </Menu.Target>

                <Menu.Dropdown>
                    {/* <Menu.Label>Application</Menu.Label> */}
                    <Menu.Item icon={<IconSettings size={14} />} onClick={() => add('text')}>Settings</Menu.Item>
                    {/* <Menu.Item icon={<IconMessageCircle size={14} />}>Messages</Menu.Item>
                <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item> */}
                    {/* <Menu.Item
                    icon={<IconSearch size={14} />}
                    rightSection={<Text size="xs" color="dimmed">⌘K</Text>}
                >
                    Search
                </Menu.Item> */}

                    {/* <Menu.Divider /> */}

                    {/* <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item icon={<IconArrowsLeftRight size={14} />}>Transfer my data</Menu.Item>
                <Menu.Item color="red" icon={<IconTrash size={14} />}>Delete my account</Menu.Item> */}
                </Menu.Dropdown>
            </Menu>
            <ConnectionFooter roomcode={connected ? rest.roomcode : 'not connected'} />
        </div>
    )
}


export default Kanban;
