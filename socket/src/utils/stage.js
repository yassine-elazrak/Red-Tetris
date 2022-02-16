
const STAGE_WIDTH = 10;
const STAGE_HEIGHT = 20;


class Stage {
    initStage = () => {
        const newStage = Array.from(Array(STAGE_HEIGHT), () =>
            new Array(STAGE_WIDTH).fill([0, 'clear']))
        return newStage;
    }
}

module.exports = {
    Stage,
    STAGE_WIDTH,
    STAGE_HEIGHT,
}
