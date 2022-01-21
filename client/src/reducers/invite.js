import {
    INVITE_REQUEST,
    INVITE_FAILURE,
    INVITE_ACCEPT,
    INVITE_DECLINE,
    INVITE_REFRESH,
    INVITE_REMOVE_ALL,
    LOADING_INVITES,
} from '../actions/types';

const initialState = {
    isLoading: false,
    error: null,
    room_id: null,
    invites: [],
}

const newInvite = (state, action) => {
    const fackStatus = ['accepted', 'declined', 'waiting'];
    const fackStatusIndex = Math.floor(Math.random() * fackStatus.length);
    const data = {
        userId: action.payload.userId,
        userName: action.payload.userName,
        status: fackStatus[fackStatusIndex], // waiting, accepted, declined
    };
    const index = state.invites.findIndex(invite => invite.userId === data.userId);
    if (index === -1) {
        state.invites.unshift(data);
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
            invite.status = 'accepted';
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
            invite.status = 'declined';
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

const removeAll = (state) => {
    const data = {
        ...state,
        invites: [],
    }
    localStorage.setItem('invite', JSON.stringify(data));
}

const refresh = () => {
    const data = localStorage.getItem('invite');
    if (data) {
        const jsonData = JSON.parse(data);
        return {
            ...jsonData,
            isLoading: false,
            error: null,
        }
    } else {
        return initialState;
    }
}

export default function inviteReducer(state = initialState, action) {
    switch (action.type) {
        case LOADING_INVITES:
            return {
                ...state,
                isLoading: true,
            }
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
            return refresh();
        case INVITE_REMOVE_ALL:
            return removeAll(state);
        default:
            return state;
    }
}