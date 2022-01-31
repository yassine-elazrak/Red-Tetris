import React from 'react';
import { Badge, Space, Card } from 'antd';

import { TetrominoStyle } from './styles/TetrominoStyle';
import { TETROMINOES } from '../helpers/Tetrominoes';

const StageBar = (props) => {
    const { shape, score, rows } = props;
    const shapeLnegth = shape.length;

    const mapShape = (shape) => {
        return shape.map((row) => {
            return row.map((tetromino, key) => {
                // console.log(tetromino);
                return <TetrominoStyle
                    key={key}
                    type={[tetromino, 'clear']}
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
            {/* SCORE */}
            <Badge
                className="site-badge-count-109"
                count={100}
                overflowCount={9999}
                showZero
                // text={`${score}`}
                // status='success'
                
                style={{
                    background: '#6FCF97',
                    color: '#fff',
                    
                }}
            >
            </Badge>
            <span>{`ROWS ${rows}`}</span>
        </div>
    )
}

export default StageBar;