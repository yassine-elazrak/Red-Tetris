import React from 'react';


import InviteUsers from '../components/InviteUsers';
import { useSelector } from 'react-redux';

const MultiPlayerMode = () => {
    const { room, profile } = useSelector(state => state);


    return (
        <InviteUsers />
    )
}

export default MultiPlayerMode;