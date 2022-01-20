import {
    CURRENT_USER,
} from '../actions/types';

const generateRandomUser = (value) => {
    const users = [];
    for (let i = 0; i < 100; i++) {
        users.push({
            id: i,
            name: Math.random().toString(36).substring(7),
        });
    }
    // return users;
    // return users.filter(user => user.name.includes(value));
    // console.log(value);
    // if (value) {
    //     console.log(value, 'value');
    //     console.log(users.filter(user => user.name.includes(value)));
    // }
    const newusers = users.filter(user => user.name.toLowerCase().includes(value.toLowerCase()));
    // console.log(newusers.length, 'users.length');
    return newusers;
};

const initialState = {
    isLoading: false,
    online: [],
};

export default function usersReducer(state = initialState, action) {
    switch (action.type) {
        case CURRENT_USER:
            console.log(action.payload);
            return {
                ...state,
                online: generateRandomUser(action.payload.value),
            };
        default:
            return state;
    }
}
