import {
    STAGE_CREATE,
    STAGE_UPDATE,
    CELL_UPDATE
} from '../types';

const initialState = {
    stage: [],
    cell: {
        current: 0,
        next: 0,
    },
    score: 20,
    rows: 20,
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
        case CELL_UPDATE:
            return {
                ...state,
                cell: {
                    current: state.cell.next,
                    next: action.payload.next,
                },
            };
        default:
            return state;
    }
}

export default stage;
