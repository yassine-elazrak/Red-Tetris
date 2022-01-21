import {
    CURRENT_ONLINE_USERS,
    LOADING_ONLINE_USERS,
} from '../types';


const initialState = {
    isLoading: false,
    online: [],
};


const generateRandomUser = (value) => {
    const users = [];
    for (let i = 0; i < 100; i++) {
        users.push({
            id: i,
            name: Math.random().toString(36).substring(7),
        });
    }
    const newusers = users.filter(user => user.name.toLowerCase().includes(value.toLowerCase()));
    return newusers;
};



export default function usersReducer(state = initialState, action) {
    switch (action.type) {
        case CURRENT_ONLINE_USERS:
            console.log(action.payload);
            return {
                ...state,
                isLoading: false,
                online: generateRandomUser(action.payload.value),
            };
        case LOADING_ONLINE_USERS:
            return {
                ...state,
                isLoading: true,
            };
        default:
            return state;
    }
}
