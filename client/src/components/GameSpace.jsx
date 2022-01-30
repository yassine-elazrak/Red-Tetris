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
import StageBar from './StageBar';
import Stage from './Stage';

import {
    createStage,
    updateStage,
    // updateCell,
    updateTetromino,
} from "../redux/actions";

import { useStage } from "../hooks/useStage";
import { usePlayer } from '../hooks/useplayer';



const { Content } = Layout;

const GameSpace = (props) => {


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
        nextTetromino,
        resetGame,
        moveTetromino,
        rotateTetromino,
    ] = useStage();

    useEffect(() => {
        document.getElementById('Content').focus();
    }, []);


    const handlekeys = (e) => {
        // console.log(e.keyCode);
        if (!gameStart) return;
        if (e.keyCode === 37) {
            moveTetromino(currentStage, currentTetromino, { x: -1, y: 0 });
        } else if (e.keyCode === 39) {
            moveTetromino(currentStage, currentTetromino, { x: 1, y: 0 });
        } else if (e.keyCode === 40) {
            moveTetromino(currentStage, currentTetromino, { x: 0, y: 1 });
        }
        else if (e.keyCode === 38) {
            rotateTetromino(currentStage, currentTetromino);
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

    // console.log('render');

    useEffect(() => {
        handleAlertGameOver();
    }, [gameOver]);


    const bottons = () => {
        return (
            <div style={{
                // border: '1px solid black',
                padding: '10px',
                margin: 0,
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <Button
                    type="primary"
                    onClick={() => {
                        gameStart ?
                            resetGame(randomTetromino())
                            : startGame();
                    }}
                > {gameStart ? 'Reset' : 'Start'}
                </Button>

                {gameStart && (
                    <Button
                        type="primary"
                        onClick={() => {
                            pauseGame(!gamePause);
                        }}
                    > {gamePause ? 'Resume' : 'Pause'}
                    </Button>
                )}
                <Button
                    type="primary"
                    onClick={() => {
                        updateTetromino();
                    }}
                > Leave </Button>
            </div>
        )
    }



    return (
        <Content
            id="Content"
            role="button"
            tabIndex="0"
            onKeyDown={(e) => handlekeys(e)}
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
                    <StageBar
                        shape={TETROMINOES[nextTetromino].shape}
                        score={score}
                        rows={rows}
                        color={TETROMINOES[nextTetromino].color}
                    />
                </Col>
            </Row>
            <Row style={{
                height: 'calc(100vh - 220px)',
            }}>
                {/* if rome dos't private show maps palyers  */}
                {!room.isPravite &&
                    <Col xs={0} sm={0} md={6} lg={7} xl={6} xxl={5} style={{
                        margin: 'auto',
                    }}>
                        <Players />
                    </Col>
                }
                <Col xs={24} sm={13} md={12} lg={10} xl={9} xxl={9} style={{
                    padding: '0px',
                    // backgroundColor: '#000',
                    margin: 'auto',
                    width: '100%',
                }}>
                    {/* Current Stage */}
                    <Stage stage={currentStage}/>
                    <Row style={{
                        marginTop: '0',
                    }}>
                        <Col xs={0} sm={0} md={24} lg={24} xl={24} xxl={24}
                            style={{
                                padding: 0,
                                // border: '1px solid black',
                            }}>
                            {/* Bottons */}
                            {bottons()}
                        </Col>
                        <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0} style={{
                            // padding: '10px',
                            marginTop: '10px',
                            paddingLeft: '10px',
                            // display: 'flex',
                            // justifyContent: 'space-between',
                        }}>
                            {/* on mobile change style */}
                            <Popover
                                trigger={'click'}
                                content={bottons()}
                                placement="topRight"
                                color={'rgba(0,0,0,0.8)'}
                                overlayStyle={{
                                    width: '90%',
                                }}>
                                <Button type="primary" shape="circle" style={{
                                    // padding: '5px',
                                    display: 'flex',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    margin: 0,
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
                    <Col xs={0} sm={11} md={6} lg={7} xl={6} xxl={5} style={{
                        height: '100%',
                    }}>
                        {/* message component */}
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
})(GameSpace);
