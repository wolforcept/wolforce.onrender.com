export type MessageType = 'joinRoom' | 'joinedRoom' | 'getState' | 'state' | 'input' | 'players';

export default interface Message {
    type: MessageType
    roomcode: string
    gamename: string
    payload?: any
    sender: string
}

