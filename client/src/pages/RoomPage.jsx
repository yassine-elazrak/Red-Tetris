import React from 'react'
import { connect, useSelector } from 'react-redux'


import { createStage } from '../helpers/StageHelper'

export const RoomPage = (props) => {
    // console.log(props);
    const { room, auth } = useSelector(state => state);
    // console.log(room);
    return (
        <div>
            <h1>Welcome {auth.user.name}  at Room page</h1>
            <h1>{room.name}</h1>
        </div>
    )
}

export default RoomPage;
