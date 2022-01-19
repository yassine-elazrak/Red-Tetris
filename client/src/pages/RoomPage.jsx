import React from 'react'
import { connect } from 'react-redux'
import { leaveRoom, closeRoom } from '../actions/room'

export const RoomPage = (props) => {
    console.log(props);
    return (
        <h1>RoomPage2</h1>
    )
}

const mapStateToProps = (state) => ({
    room: state.room,
    user: state.auth.user,

})


export default RoomPage;
