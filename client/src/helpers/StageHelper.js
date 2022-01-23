export const STAGE_WIDTH = 10;
export const STAGE_HEIGHT = 20;

const gnerateId = () => {
    const Ids = '0IJLOSZ';
    return Ids[Math.floor(Math.random() * Ids.length)];
}
export const createStage = () => {
    console.log('test');
    const stage = Array.from(Array(STAGE_HEIGHT), () =>
        new Array(STAGE_WIDTH).fill(0));

    return stage

}