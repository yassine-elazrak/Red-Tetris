import React from 'react';
import { useSelector } from 'react-redux';
import { connect } from 'react-redux';

import { createStage, STAGE_HEIGHT, STAGE_WIDTH } from '../helpers/StageHelper';
import Tetrominoes from '../helpers/Tetrominoes';

const Stage = (props) => {

    const { room, auth } = props;

    console.log(props);
    const map = createStage();

    console.log(map);

    const stage = map.map(row => {
        return row.map((tetrIndex, index) => {
            return <div key={index} style={{
                width: '20px',
                height: '20px',
                border: '1px solid black',
                // position: 'absolute',
                backgroundColor: Tetrominoes[tetrIndex].color,
            }}></div>
        })
    })

    return (
        <div>
            <div className="stage" style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${STAGE_WIDTH}, calc(100% / ${STAGE_WIDTH}))`,
            }}>
                {stage}
            </div>
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        room: state.room,
        // stage: state.stage
    }
}

export default connect(mapStateToProps, {})(Stage);
