import { Button, Card, Select, Space, TextInput, Title } from "@mantine/core";
import { FC, useState } from "react";
import Socket from "./Socket";
import { animalNames } from "assets/Animal"
import AnimalImage from "components/AnimalImage/AnimalImage";

interface ConnectorProps {
    socket: Socket;
    callback: (() => void)
}

const Connector: FC<ConnectorProps> = ({ socket, callback }) => {

    const [username, setUsername] = useState<string>('');
    const [animal, setAnimal] = useState<string>(animalNames[Math.floor((Math.random() * animalNames.length))]);
    const [roomcode, setRoomcode] = useState(Math.random().toString().substring(2, 20));

    function submit() {
        if (username && animal)
            socket.connect(username, animal, roomcode, callback)
    }

    return (
        <div className="Connector fill">
            <Card w={400} m='auto'>
                <Title align="center">Hue Clue</Title>
                <Space h="md" />
                <Space h="md" />
                <table width={"100%"}>
                    <tbody>
                        <tr>
                            <td>
                                <AnimalImage animal={animal} height={64} />
                            </td>
                            <td>
                                <TextInput
                                    placeholder="username"
                                    label="Username"
                                    radius="md"
                                    size="md"
                                    value={username} onChange={e => setUsername(e.currentTarget.value)}
                                />
                                <Space h="sm" />
                                <Select placeholder="player icon" data={animalNames} value={animal} onChange={e => setAnimal(e as string)} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Space h="md" />
                <TextInput
                    placeholder="game code"
                    label="Game Code"
                    radius="md"
                    size="md"
                    value={roomcode} onChange={e => setRoomcode(e.currentTarget.value)}
                />
                <Space h="xs" />
                <Button w={'100%'} variant="default" onClick={submit}>Enter</Button>
            </Card>
        </div>
    )
}

export default Connector;
