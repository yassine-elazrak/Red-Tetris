export const STAGE_WIDTH = 10;
export const STAGE_HEIGHT = 20;

const gnerateId = () => {
    const Ids = '0IJLOSZD';
    const gen = Ids[Math.floor(Math.random() * Ids.length)];
    return gen === '0' ? 0 : gen;
}
export const createStage = () => {
    console.log('test');
    const stage = Array.from(Array(STAGE_HEIGHT), () =>
        new Array(STAGE_WIDTH).fill(0));

    return stage

}