import React from 'react'
import { useSelector } from 'react-redux'


// import { createStage } from '../helpers/StageHelper'
import GameSpace from '../components/GameSpace'

export const RoomPage = (props) => {
    // //console.log(props);
    const { room, profile } = useSelector(state => state);
    // //console.log(room);
    return (
        <div>
            <GameSpace />
        </div>
    )
}

export default RoomPage;
