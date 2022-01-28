import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Layout, Row, Col, Button, Popover, Modal, Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import {
    InitStage,
    CreateStage,
    STAGE_HEIGHT,
    STAGE_WIDTH
} from '../helpers/StageHelper';
import { TETROMINOES, randomTetromino } from '../helpers/Tetrominoes';
import { TetrominoStyle } from './styles/TetrominoStyle';

import Message from './Message';
import Players from './Players';

import {
    createStage,
    updateStage,
    // updateCell,
    updateTetromino,
} from "../redux/actions";

import { useStage } from "../hooks/Stage";



const { Content } = Layout;

const Stage = (props) => {


    const { room, stage } = props;

    const [
        currentStage, updateStage,
        dropRow, setDropRow,
        score, updateScore,
        rows, updateRows,
        gameOver, updateGameOver,
        gameWon, updateGameWon,
        gameStart, startGame,
        gamePause, pauseGame,
        currentTetromino, updateCurrentTetromino,
        nextTetromino, updateNextTetromino,
        resetGame,
        moveTetromino,
        rotateTetromino,
    ] = useStage();

    // useEffect(() => {
    //     pushToStage(currentTetromino);
    // }, [gameStart]);

    useEffect(() => {
        // let stage = InitStage();
        // let next = randomTetromino();
        // // let current = randomTetromino();
        // props.createStage({ stage });
        // props.updateTetromino({ next });
        // updateNextTetromino(randomTetromino());
        document.getElementById('Content').focus();
    }, []);




    const updateTetromino = () => {
        // let next = randomTetromino();
        // const pos = TETROMINOES[nextTetromino].pos.map(
        //     (index) => ([index[0], index[1] + 3])
        // );
        // console.log(pos);
        // updateCurrentTetromino();
        updateNextTetromino(randomTetromino());
        // props.updateTetromino(randomTetromino());
    }

    const nextTetrominoShape = TETROMINOES[nextTetromino].shape.map(row => {
        if (!row)
            return;
        return row.map((tetromino, key) => {
            return <TetrominoStyle
                key={key}
                type={tetromino}
                color={TETROMINOES[tetromino].color} />
        })
    });

    const header = () => {

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
                    gridTemplateRows: `repeat(${TETROMINOES[nextTetromino].shape[0].length},
                        calc(100% / ${TETROMINOES[nextTetromino].shape[0].length}))`,
                    gridTemplateColumns: `repeat(${TETROMINOES[nextTetromino].shape.length}, 1fr)`,
                    gridGap: '1px',
                    width: `calc(15px * ${TETROMINOES[nextTetromino].shape.length})`,

                }} >
                    {nextTetrominoShape}
                </div>
                <span>{`SCORE ${score}`}</span>
                <span>{`ROWS ${rows}`}</span>
            </div>
        )
    }


    const body = () => {
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
                {CreateStage(currentStage)}
            </div>
        )
    }

    const bouttons = () => {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                {gameStart ? (
                    <Button
                        type="primary"
                        onClick={() => {
                            resetGame(randomTetromino());
                        }}
                    >
                        Restart
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        onClick={() => {
                            startGame(true);
                            // updateTetromino();
                            // moveTetromino({x: 0, y: 0});
                            // console.log(currentTetromino);
                        }
                        }
                    >
                        Start
                    </Button>
                )}
                {gameStart && (gamePause ? (
                    <Button
                        type="primary"
                        onClick={() => {
                            pauseGame(false);
                        }}
                    >
                        Resume
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        onClick={() => {
                            pauseGame(true);
                        }}
                    >
                        Pause
                    </Button>
                ))}
                <Button
                    type="primary"
                    onClick={() => {
                        updateTetromino();
                    }}
                >
                    Leave
                </Button>
            </div>
        )
    }

    const handlekeys = (e) => {
        console.log(e.keyCode);
        if (!gameStart) return;
        if (e.keyCode === 37) {
            moveTetromino({ x: -1, y: 0 });
        } else if (e.keyCode === 39) {
            moveTetromino({ x: 1, y: 0 });
        } else if (e.keyCode === 40) {
            moveTetromino({ x: 0, y: 1 });
        }
        else if (e.keyCode === 38) {
            rotateTetromino();
        }
    }

    const handleAlertGameOver = () => {
        if (gameOver) {
            Modal.error({
                title: 'Game Over',
                content: 'Game Over',
                onOk() {
                    resetGame(randomTetromino());
                },
            });
        }
    }

    useEffect(() => {
        handleAlertGameOver();
    }, [gameOver]);


    return (
        <Content id="Content" role="button" tabIndex="0" onKeyDown={handlekeys}
            style={{
                background: 'rgba(0, 0, 0, 0.7)',
                padding: 0,
                margin: 0,
                height: 'calc(100vh - 90px)',
                paddingBottom: '30px',
                marginTop: '-10px',
                marginBottom: '-20px',
            }}>
            <Row style={{
            }}>
                <Col span={24}>
                    {header()}
                </Col>
            </Row>
            <Row style={{
                height: 'calc(100vh - 220px)',
            }}>

                {!room.isPravite &&
                    <Col xs={0} sm={0} md={6} lg={7} xl={6} xxl={5} style={{
                        margin: 'auto',
                    }}>
                        <Players />
                    </Col>
                }
                <Col xs={14} sm={13} md={12} lg={10} xl={9} xxl={8} style={{
                    padding: '10px',
                    margin: 'auto',
                    // width: '100%',
                }}>
                    {body()}
                    <Row style={{
                        marginTop: '20px',
                    }}>
                        <Col xs={0} sm={0} md={24} lg={24} xl={24} xxl={24}>
                            {bouttons()}
                        </Col>
                        <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0} style={{
                            padding: '10px',
                        }}>
                            <Popover
                                trigger={'click'}
                                content={bouttons()}
                                placement="topRight"
                                color={'rgba(0,0,0,0.8)'}
                                overlayStyle={{
                                    width: '90%',
                                }}>
                                <Button type="primary" shape="circle" style={{
                                    padding: '5px',
                                    display: 'flex',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                }} >
                                    <SettingOutlined style={{
                                        margin: 'auto',
                                        fontSize: '20px',
                                    }} />
                                </Button>
                            </Popover>
                        </Col>
                    </Row>
                </Col>
                {!room.isPravite &&
                    <Col xs={10} sm={11} md={6} lg={7} xl={6} xxl={5} style={{
                        height: '100%',
                    }}>
                        <Message />

                    </Col>
                }
            </Row>

        </Content>
    )
}


const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        room: state.room,
        stage: state.stage,
    }
}

export default connect(mapStateToProps, {
    createStage,
    updateStage,
    updateTetromino,
})(Stage);
