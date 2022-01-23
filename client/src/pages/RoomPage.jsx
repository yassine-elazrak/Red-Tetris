import React from 'react'
import { connect, useSelector } from 'react-redux'


// import { createStage } from '../helpers/StageHelper'
import Stage from '../components/Stage'

export const RoomPage = (props) => {
    // console.log(props);
    const { room, auth } = useSelector(state => state);
    // console.log(room);
    return (
        <div>
            <Stage />
        </div>
    )
}

export default RoomPage;
