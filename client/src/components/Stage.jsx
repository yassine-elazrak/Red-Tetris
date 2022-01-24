import React from 'react';
import { useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { Layout, Card, Button } from 'antd';

import { createStage, STAGE_HEIGHT, STAGE_WIDTH } from '../helpers/StageHelper';
import { TETROMINOES, randomTetromino } from '../helpers/Tetrominoes';
import { CellStyle } from './styles/CellStyle';

const { Content, Sider } = Layout;

const Stage = (props) => {

    const { room, auth } = props;

    console.log(props);
    const map = createStage();

    console.log(map);



    const stage = map.map(row => {
        return row.map((Index, key) => {
            return <CellStyle
                key={key} type={Index}
                color={TETROMINOES[Index].color} />
        })
    })

    const rendom = randomTetromino();

    const nextTetromino = rendom.shape.map(row => {
        // console.log(randomTetromino());
        console.log(rendom);
        return row.map((cell, key) => {
            return <CellStyle
                key={key}
                type={cell}
                color={TETROMINOES[cell].color} />
        })
    })

    const RightSide = () => {
        return (
            <div style={{
                // display: 'flex',
                // flexWrap: 'wrap',
                // justifyContent: 'space-around',
                // alignItems: 'center',
                // flex: 2,
            }}>
                <span>RigthSide</span>
            </div>
        )
    }

    const LeftSide = () => {
        return (
            <div style={{
                // display: 'flex',
                // flexWrap: 'wrap',
                // justifyContent: 'space-around',
                // alignItems: 'center',
                // flex: 2,
            }}>
                <span>LeftSide</span>
            </div>
        )
    }

    const header = () => {
        return (
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateRows: `repeat(${rendom.shape[0].length},
                        calc(100% / ${rendom.shape[0].length}))`,
                    gridTemplateColumns: `repeat(${rendom.shape.length}, 1fr)`,
                    gridGap: '1px',
                    width: `calc(15px * ${rendom.shape.length})`,
                    
                }} >
                    {nextTetromino}
                </div>
                <span>SCOR N*</span>
                <span>LINES N*</span>
            </div>
        )
    }


    const body = () => {
        return (
            <div style={{
                display: 'grid',
                gridTemplateRows: `repeat(${STAGE_HEIGHT},
                calc(28vh / ${STAGE_WIDTH}))`,
                display: 'grid',
                gridTemplateColumns: `repeat(${STAGE_WIDTH}, 1fr)`,
                gridGap: '1px',
                width: '30vw',
                maxWidth: '400px',
                background: '#fff',
                margin: 'auto',

            }}>
                {stage}
            </div>
        )
    }

    return (

        <Card style={{
            width: '100%',
            padding: 0,
            margin: 0,
            border: 'none',
        }} title={header()} actions={[
            <Button type="primary" style={{
                display: 'flex',
                margin: 'auto',
                marginTop: '10px',
            }}>
                Leave Room
            </Button>,
            <Button type="primary"
                style={{
                    display: 'flex',
                    margin: 'auto',
                    marginTop: '10px',
                }}>
                Start Game
            </Button>
        ]}>
            {body()}
        </Card>
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
