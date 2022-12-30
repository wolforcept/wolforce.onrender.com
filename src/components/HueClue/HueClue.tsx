import { ActionIcon, Button, Container, CopyButton, Space, Text, TextInput, Tooltip } from '@mantine/core';
import Connector from 'components/Connector/Connector';
import Socket from 'components/Connector/Socket';
import { ReactElement, useState } from 'react';
import HueClueState from "common/hueclue/HueClueState";
import HueClueMessage from "common/hueclue/HueClueMessage";
import Message from 'common/Message';
import './HueClue.scss';
import Player from 'common/Player';
import { IconZoomQuestion, IconArrowRight, IconCheck, IconCopy } from '@tabler/icons';
import AnimalImage from 'components/AnimalImage/AnimalImage';
import Canvas from 'components/Canvas/Canvas';
import HueCueColors from 'common/hueclue/HueClueColors'
import { getAnimalSrc } from 'assets/Animal';
import HueClueColors from 'common/hueclue/HueClueColors';

const verbose = false;

function HueClue() {

    const [isConnected, setIsConnected] = useState(false)
    const [socket] = useState(new Socket('hueclue', onMessage))
    const [state, setState] = useState(null as (null | HueClueState))
    const [players, setPlayers] = useState([] as Player[]);
    const [clue, setClue] = useState("");
    const [colorIsHeld, setColorIsHeld] = useState(false);
    const [color, setColor] = useState<{ color: string, x: number, y: number } | undefined>(undefined);

    const connector = <Connector socket={socket} callback={() => setIsConnected(true)}></Connector>;
    if (!isConnected)
        return connector;

    function onMessage(m: Message) {

        switch (m.type) {
            case 'state':
                setState(JSON.parse(m.payload) as HueClueState)
                if (verbose) console.log("[HueCue] updated state")
                if (verbose) console.log(state)
                break;

            case 'players':
                const players = JSON.parse(m.payload) as Player[]
                if (players) {
                    setPlayers(players)
                    if (verbose) console.log("[HueCue] updated players")
                    if (verbose) console.log(players)
                }
                break;
        }

    }

    function onCanvasMouseDown(x: number, y: number) {
        setColorIsHeld(true)
    }

    function onCanvasMouseUp(x: number, y: number) {
        setColorIsHeld(false)
    }

    function onCanvasMouseMove(x: number, y: number) {
        if (colorIsHeld && state?.type === 'vote')
            setColor({ color: HueCueColors.colors[x][y], x, y })
    }

    function createColorTable(): ReactElement {

        const w = HueCueColors.canvasWidth;
        const h = HueCueColors.canvasHeight;

        return <Canvas w={w} h={h} onMouseDown={onCanvasMouseDown} onMouseMove={onCanvasMouseMove} onMouseUp={onCanvasMouseUp} draw={
            (ctx: CanvasRenderingContext2D) => {
                for (var x = 0; x < w; x++) {
                    for (var y = 0; y < h; y++) {
                        ctx.fillStyle = HueCueColors.colors[x][y];
                        ctx.fillRect(x, y, 1, 1);
                    }
                }
            }
        }></Canvas >
        // const rows: Array<ReactElement> = [];
        // const nrs: Array<ReactElement> = [];

        // let i = 0;

        // nrs.push(<td key={i++} style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}></td>)
        // for (let r = 0; r < NUMBERS; r++)
        //     nrs.push(<td key={i++} className='cell' style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>{r + 1}</td>)
        // rows.push(<tr key={i++}>{nrs}</tr>)

        // const nC = LETTERS.length - 1;
        // const nR = NUMBERS - 1;
        // const cC = 255 / nC;
        // const cR = 255 / nR;

        // for (let c = 0; c < LETTERS.length; c++) {

        //     const nrs: Array<ReactElement> = [];

        //     nrs.push(<td key={i++} className='cell' style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>{LETTERS[c]}</td>)
        //     const green = c * cC;
        //     for (let r = 0; r < NUMBERS; r++) {
        //         const red = r * cR;
        //         const blue = (nR - r) * cR;

        //         const _centerness1 = (1 - Math.abs((c - nC / 2) * 2 / nC));
        //         const _centerness2 = (1 - Math.abs((r - nR / 2) * 2 / nR));
        //         const centerness = _centerness1 * _centerness2 * 128;

        //         nrs.push(<td onClick={() => sendInput("clickColor", { x: c, y: r })} key={i++} className='cell' style={{ backgroundColor: `rgba(${red + centerness}, ${green + centerness}, ${blue + centerness})` }}></td>)
        //     }

        //     rows.push(<tr key={i++}>{nrs}</tr>)

        // }
        // return rows;
    }

    function createAllPlayerColorMarkers() {
        if (!state || state.type !== 'scoring' || !state.playerColors)
            return <></>

        const names = Object.keys(state.playerColors);
        return names.map((username: string) => {

            return state.playerColors[username].map(({ color, x, y }: { color: string, x: number, y: number }) => {
                return createPlayerColorMarker(
                    {
                        username,
                        animal: players?.find(x => x.username === username)?.animal ?? ""
                    },
                    color,
                    x, HueCueColors.canvasHeight - y,
                    socket.player?.username === username
                )
            })
        })

    }

    function createColorMarker(color: string, x: number, y: number, guessingColor: boolean = false, ownColor: boolean = false): ReactElement {
        const dx = -HueCueColors.canvasWidth + x - 25;
        const dy = y - 45;
        return <svg key={"color" + color + x + y} className='colorMarker' style={{ zIndex: guessingColor ? 10 : 9, position: 'absolute', transform: `translate(${dx}px, ${dy}px)` }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke={guessingColor ? "white" : "black"} fill={color} stroke-linecap="round">
            <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path>
        </svg>
    }

    function createPlayerColorMarker(player: Player, color: string, x: number, y: number, ownColor: boolean): ReactElement {
        // const dx = -HueCueColors.canvasWidth + x - 25;
        const dx = x - 25;
        const dy = -y - 45;
        return <div className='colorMarker' style={{ zIndex: ownColor ? 15 : 9, position: 'absolute', transform: `translate(${dx}px, ${dy}px)` }}>
            <svg key={"color" + color + x + y} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="black" fill={color} stroke-linecap="round">
                <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path>
            </svg>
            <img height={24} alt={player.animal} src={getAnimalSrc(player.animal)} ></img>
        </div>
    }

    const scores: ReactElement[] = [];
    if (state) {
        Object.entries(state.scores).forEach(([username, score]) => {
            scores.push(<div>
                <AnimalImage animal={players.find(x => x.username === username)?.animal ?? ""} height={32} />
                <Text className='username' display='inline' key={username} >{username}: </Text>
                <Text display='inline' weight={'bold'}>{"" + score}</Text>
                <Space h="md" />
            </div>)
        });
    }

    function sendClue(): void {
        if (state)
            setState({ ...state, type: "vote" })
        socket.sendInput({ type: 'submitClue', payload: clue } as HueClueMessage)
    }

    function submitColor(): void {
        socket.sendInput({ type: 'submitColor', payload: color } as HueClueMessage)
        if (state)
            setState({ ...state, type: "waitingForOthersToVote" })
    }

    function submitGoToNextRound(): void {
        socket.sendInput({ type: 'goToNextRound' } as HueClueMessage)
    }

    return (
        <div className='hueclue'>
            <div className="main">

                <div className="left">
                    <div className='score'>
                        <h3>Score:</h3>
                        {scores}
                    </div>
                    <div>

                        {state && (state.type === 'vote' || state.type === 'waitingForOthersToVote') &&
                            (
                                state?.cluegiver !== socket.player?.username && color
                                    ? <>
                                        {
                                            color.color.length > 7
                                                ? <>
                                                    <h3 style={{ paddingBottom: 100, paddingTop: 105 }}>Invalid Color</h3>
                                                </>
                                                : <>
                                                    <h3>Your color:</h3>
                                                    <div className='yourColor' style={{ backgroundColor: color.color }}></div>
                                                    {state.type === 'vote'
                                                        ? <Button className='submitColorButton' onClick={() => submitColor()}>Submit</Button>
                                                        : <Space h="xl" />
                                                    }
                                                </>
                                        }
                                    </>
                                    : <h4>Players are choosing their locations!</h4>
                            )
                        }

                        {state?.type === 'clue' &&
                            (
                                state?.cluegiver === socket.player?.username
                                    ? <Container>
                                        <h3>Color to Guess:</h3>
                                        {state.guessingColor && <div className='yourColor' style={{ backgroundColor: state.guessingColor.color }}></div>}
                                        <Space h='xl' />
                                    </Container>
                                    : <>
                                        <h4>Current Clue Giver:</h4>
                                        <Text>{state ? state.cluegiver : ""}</Text>
                                    </>
                            )
                        }

                        {state?.type === 'scoring' && state?.cluegiver === socket.player?.username &&
                            <>
                                <Button onClick={() => submitGoToNextRound()}>Next Round</Button>
                                <Space h='xl' />
                            </>
                        }
                    </div>
                </div>

                <div className="colorWheel">
                    {createColorTable()}

                    {state?.guessingColor &&
                        createColorMarker(state.guessingColor.color, state.guessingColor.x, state.guessingColor.y, true)
                    }

                    {state?.type === 'vote' && color && state.cluegiver !== socket.player?.username &&
                        createColorMarker(color.color, color.x, color.y)
                    }

                    {state?.type === 'vote' && state.cluegiver === socket.player?.username &&
                        Object.keys(state.playerColors).map((username) => {
                            return <>{
                                state.playerColors[username].map(({ color, x, y }: { color: string, x: number, y: number }) => {
                                    console.log({ pc: state.playerColors, color, x, y })
                                    return createColorMarker(color, x, y)
                                })
                            }</>
                        })
                    }

                    {createAllPlayerColorMarkers()}
                </div>

                <div className='right' >
                    <div className='top'>
                        <h3>Clues:</h3>

                        {state && state.clues.length > 0 ? state.clues.map((x, i) => <Text key={i}>{x}</Text>) : <Text>No clues yet.</Text>}


                    </div>
                    <div className='bottom'>
                        {state?.type === 'vote' &&
                            (
                                state?.cluegiver !== socket.player?.username
                                    ? <h4>Pick a location based on the clues!</h4>
                                    : <h4>Players are choosing their locations!</h4>
                            )
                        }

                        {state?.type === 'clue' &&
                            (
                                state?.cluegiver === socket.player?.username
                                    ? <Container>
                                        <h4>You are the Clue Giver:</h4>
                                        <TextInput
                                            icon={<IconZoomQuestion size={18} stroke={1.5} />}
                                            radius="md"
                                            size="md"
                                            rightSection={
                                                <ActionIcon onClick={() => sendClue()} size={32} radius="md" variant="filled">
                                                    <IconArrowRight size={18} stroke={1.5} />
                                                </ActionIcon>
                                            }
                                            placeholder="Send a clue!"
                                            rightSectionWidth={42}
                                            value={clue}
                                            onChange={(e) => { setClue(e.target.value) }}
                                        />

                                    </Container>
                                    : <>
                                        <h4>Current Clue Giver:</h4>
                                        <Text>{state ? state.cluegiver : ""}</Text>
                                    </>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="footer">
                <Text className='roomcodeLabel'>Room Code: </Text>
                <Text>{socket.roomcode ?? ""}</Text>
                <CopyButton value={socket.roomcode ?? ""} timeout={2000}>
                    {({ copied, copy }) => (
                        <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="bottom">
                            <ActionIcon className='copyIcon' color={copied ? 'teal' : 'gray'} onClick={copy}>
                                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                            </ActionIcon>
                        </Tooltip>
                    )}
                </CopyButton>
            </div>
        </div>
    )
}

export default HueClue;