import React from 'react'
import { connect, useSelector } from 'react-redux'

export const RoomPage = (props) => {
    // console.log(props);
    const { room, auth } = useSelector(state => state);
    // console.log(room);
    return (
        <h1>Welcome {auth.user.name} at Room page</h1>
    )
}

export default RoomPage;
