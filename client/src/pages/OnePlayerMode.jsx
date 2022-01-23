import React from 'react';
import { connect } from 'react-redux';

import Stage from '../components/Stage';


const OnePlayerMode = (props) => {
    return (
        <Stage />
    )
}

const mapStateToProps = (state) => {
    return {
        room: state.room,
        auth: state.auth
    }
}

export default connect(mapStateToProps)(OnePlayerMode);