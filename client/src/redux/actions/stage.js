import {
    STAGE_CREATE,
    STAGE_UPDATE,
    CELL_UPDATE
} from "../types";

export const createStage = (stage) => {
    return async (dispatch) => {
        dispatch(success(stage, STAGE_CREATE));
    }
};

export const updateStage = (stage) => {
    return async (dispatch) => {
        dispatch(success(stage, STAGE_UPDATE));
    }
};

export const updateCell = (current) => {
    return async (dispatch) => {
        dispatch(success(current, CELL_UPDATE));
    }
};




const success = (data, type) => {
    return {
        type: type,
        payload: data
    }
}