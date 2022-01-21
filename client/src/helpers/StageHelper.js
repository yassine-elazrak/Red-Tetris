export const STAGE_WIDTH = 10;
export const STAGE_HEIGHT = 20;

export const createStage = () => {
    Array.from(Array(STAGE_HEIGHT), () => new Array(STAGE_WIDTH).fill([0, "black"]));
}