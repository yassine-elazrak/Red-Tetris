import React from 'react';
import { useSelector } from 'react-redux';

const Stage = (props) => {

    const { room, auth } = useSelector(state => state);

    return (
        <h1>Welcome {auth.name}  at Stage page</h1>
    )
}


export default Stage;
