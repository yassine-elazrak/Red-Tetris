import React from 'react';
import { connect } from 'react-redux';

import GameSpace from '../components/GameSpace';


const OnePlayerMode = (props) => {
    // console.log(props, 'props');
    return (
        <GameSpace />
    )
}

const mapStateToProps = (state) => {
    return {
        room: state.room,
        auth: state.auth
    }
}

export default connect(mapStateToProps)(OnePlayerMode);