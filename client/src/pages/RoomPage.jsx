import React from 'react'
import { connect } from 'react-redux'
import { leaveRoom, closeRoom } from '../actions/room'
// don't forget to create a new action of inviteUser

export const RoomPage = (props) => {
    console.log(props);
    return (
        <div>
            RoomPage
        </div>
    )
}

const mapStateToProps = (state) => ({
    room: state.room,
    user: state.auth.user,

})


export default connect(mapStateToProps, {leaveRoom, closeRoom})(RoomPage)
