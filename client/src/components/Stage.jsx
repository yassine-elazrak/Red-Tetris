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
            calc(28vh / ${STAGE_WIDTH}))`,
            gridTemplateColumns: `repeat(${STAGE_WIDTH}, 1fr)`,
            gridGap: '1px',
            width: '100%',
            background: 'none',
            margin: 'auto',

        }}>
            {CreateStage(props.stage)}
        </div>
    )
}

export default Stage;