import React from 'react';
import { Badge, Space } from 'antd';

import { TetrominoStyle } from './styles/TetrominoStyle';
import { TETROMINOES } from '../helpers/Tetrominoes';

const StageBar = (props) => {
    const { shape, score, rows } = props;
    const shapeLnegth = shape.length;

    const mapShape = (shape) => {
        return shape.map((row) => {
            return row.map((tetromino, key) => {
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
            <Space>
                SCOR
                <Badge
                    showZero
                    className="site-badge-count-109"
                    count={score}
                    overflowCount={9999}
                    style={{
                        backgroundColor: 'rgba(0,0,0, 0.0)',
                        borderColor: 'rgba(0, 0, 0, 0)',
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '18px',
                    }}
                />
            </Space>
            <Space>
                ROWS
                <Badge
                    showZero
                    className="site-badge-count-109"
                    count={rows}
                    overflowCount={9999}
                    style={{
                        backgroundColor: 'rgba(0,0,0, 0.0)',
                        borderColor: 'rgba(0, 0, 0, 0)',
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '18px',
                    }}
                />
            </Space>
        </div>
    )
}

export default StageBar;