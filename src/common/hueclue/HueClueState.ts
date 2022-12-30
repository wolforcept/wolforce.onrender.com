export default interface HueClueState {
    round: number
    guessingColor: undefined | { color: string, x: number, y: number }
    type: 'clue' | 'vote' | 'waitingForOthersToVote' | 'scoring'
    clues: string[]
    scores: any
    cluegiver: string
    playerColors: any
    votes: any
}