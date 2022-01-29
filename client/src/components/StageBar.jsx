import React from 'react';

import { TetrominoStyle } from './styles/TetrominoStyle';
import { TETROMINOES } from '../helpers/Tetrominoes';

const StageBar = (props) => {
    const { shape, score, rows } = props;
    const shapeLnegth = shape.length;

    const mapShape = (shape) => {
        return shape.map((row, key) => {
            return row.map((tetromino, key) => {
                return <TetrominoStyle
                    key={key}
                    type={tetromino}
                    color={TETROMINOES[tetromino].color} />
            })
        });
    }



    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            padding: '10px',
            paddingTop: '20px',
            background: 'rgba(0,0,0,0.3)',
            color: 'rgba(255,255,255,0.8)',
        }}>
            <div style={{
                display: 'grid',
                gridTemplateRows: `repeat(${shapeLnegth},
                    calc(100% / ${shapeLnegth}))`,
                gridTemplateColumns: `repeat(${shapeLnegth}, 1fr)`,
                gridGap: '1px',
                width: `calc(15px * ${shapeLnegth})`,

            }} >
                {mapShape(shape)}
            </div>
            <span>{`SCORE ${score}`}</span>
            <span>{`ROWS ${rows}`}</span>
        </div>
    )
}

export default StageBar;