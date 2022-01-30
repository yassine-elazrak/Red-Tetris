import React from 'react';

import {
    CreateStage,
    STAGE_HEIGHT,
    STAGE_WIDTH
} from '../helpers/StageHelper';

const Stage = (props) => {
    // console.log('Stage');
    return (
        <div style={{
            display: 'grid',
            gridTemplateRows: `repeat(${STAGE_HEIGHT},
            calc(31vh / ${STAGE_WIDTH}))`,
            gridTemplateColumns: `repeat(${STAGE_WIDTH},
                calc(40vh / ${STAGE_WIDTH}))`,
            gridGap: '1px',
            // width: '31vh',
            // background: 'green',
            margin: 0,
            padding: 0,
            // border: '1px solid black',
            justifyContent: 'center',

        }}>
            {CreateStage(props.stage)}
        </div>
    )
}

export default Stage;