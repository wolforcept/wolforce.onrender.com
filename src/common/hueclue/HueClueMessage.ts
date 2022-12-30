export default interface HueClueMessage {
    type: 'submitClue' | 'submitColor' | 'goToNextRound'
    payload: any
}