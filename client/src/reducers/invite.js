import {
    INVITE_REQUEST,
    INVITE_FAILURE,
    INVITE_ACCEPT,
    INVITE_DECLINE,
    INVITE_REFRESH,
    INVITE_REMOVE_ALL,
} from '../actions/types';

const initialState = {
    isLoading: false,
    error: null,
    room_id: null,
    invites: [],
}

const newInvite = (state, action) => {
    const data = {
        userId: action.payload.userId,
        userName: action.payload.userName,
        state: 'waiting',
    };
    const index = state.invites.findIndex(invite => invite.userId === data.userId);
    if (index === -1) {
        state.invites.push(data);
        localStorage.setItem('invite', JSON.stringify(state));
        return {
            ...state,
            error: null,
            isLoading: false,
            room_id: action.payload.roomId,
    }
    } else {
        return {
            ...state,
            error: `${data.userName} is already invited`,
            isLoading: false,
        }
    }
}

const accept = (state, action) => {
    const newInvites = state.invites.map(invite => {
        if (invite.id === action.payload.id) {
            invite.state = 'accepted';
        }
        return invite;
    });
    const data = {
        ...state,
        error: null,
        isLoading: false,
        invites: newInvites,
    }
    localStorage.setItem('invite', JSON.stringify(data));
    return data;
}

const decline = (state, action) => {
    const newInvites = state.invites.map(invite => {
        if (invite.id === action.payload.id) {
            invite.state = 'declined';
        }
        return invite;
    });
    const data = {
        ...state,
        error: null,
        isLoading: false,
        invites: newInvites,
    }
    localStorage.setItem('invite', JSON.stringify(data));
}

const removeAll = (state, action) => {
    const data = {
        ...state,
        invites: [],
    }
    localStorage.setItem('invite', JSON.stringify(data));
}

export default function inviteReducer(state = initialState, action) {
    switch (action.type) {
        case INVITE_REQUEST:
            return newInvite(state, action);
        case INVITE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case INVITE_ACCEPT:
            return accept(state, action);
        case INVITE_DECLINE:
            return decline(state, action);
        case INVITE_REFRESH:
            return {
                ...state,
                isLoading: false,
                error: null,
                room_id: action.payload.room_id,
                invites: action.payload.invites,
            };
        case INVITE_REMOVE_ALL:
            return removeAll(state, action);
        default:
            return state;
    }
}