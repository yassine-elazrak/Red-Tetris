import {
    STAGE_CREATE,
    STAGE_UPDATE,
    TETROMINOES_UPDATE
} from '../types';

const initialState = {
    stage: [],
    tetromino: {
        current: 0,
        next: 0,
    },
    score: 0,
    rows: 0,
};



const stage = (state = initialState, action) => {
    switch (action.type) {
        case STAGE_CREATE:
            return {
                ...state,
                stage: action.payload.stage,
            };
        case STAGE_UPDATE:
            return {
                ...state,
                stage: action.payload.stage,
            };
        case TETROMINOES_UPDATE:
            return {
                ...state,
                tetromino: {
                    current: state.tetromino.next,
                    next: action.payload.next,
                },
            };
        default:
            return state;
    }
}

export default stage;
