import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Layout, Row, Col, Button, Popover } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import {
    InitStage,
    CreateStage,
    STAGE_HEIGHT,
    STAGE_WIDTH
} from '../helpers/StageHelper';
import { TETROMINOES, randomTetromino } from '../helpers/Tetrominoes';
import { CellStyle } from './styles/CellStyle';

import Message from './Message';
import Players from './Players';

import {
    createStage,
    updateStage,
    updateCell,
} from "../redux/actions";



const { Content } = Layout;

const Stage = (props) => {


    const { room, stage } = props;

    const [currentCell, setCurrentCell] = useState(stage.cell.current);
    const [nextCell, setNextCell] = useState(stage.cell.next);
    const [currentStage, setCurrentStage] = useState(stage.stage);
    const [score, setScore] = useState(stage.score);
    const [rows, setRows] = useState(stage.rows);
    const [start, setStart] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        let stage = InitStage();
        let next = randomTetromino();
        props.createStage({ stage });
        props.updateCell({ next });
        document.getElementById('Content').focus();
    }, []);

    useEffect(() => {
        setCurrentCell(props.stage.cell.current);
        setNextCell(props.stage.cell.next);
        setCurrentStage(props.stage.stage);
        setScore(props.stage.score);
        setRows(props.stage.rows);
    }, [
        props.stage.cell,
        props.stage.cell.current,
        props.stage.cell.next,
    ]);

    const updateCell = () => {
        let next = randomTetromino();
        props.updateCell({ next });
    }

    const resetGame = () => {
        let stage = InitStage();
        let next = randomTetromino();
        props.createStage({ stage });
        props.updateCell({ next });
        setStart(false);
        setPaused(false);
        setGameOver(false);
        setScore(0);
        setRows(0);
    }

    const nextTetromino = TETROMINOES[nextCell].shape.map(row => {
        return row.map((cell, key) => {
            return <CellStyle
                key={key}
                type={cell}
                color={TETROMINOES[cell].color} />
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
                    gridTemplateRows: `repeat(${TETROMINOES[nextCell].shape[0].length},
                        calc(100% / ${TETROMINOES[nextCell].shape[0].length}))`,
                    gridTemplateColumns: `repeat(${TETROMINOES[nextCell].shape.length}, 1fr)`,
                    gridGap: '1px',
                    width: `calc(15px * ${TETROMINOES[nextCell].shape.length})`,

                }} >
                    {nextTetromino}
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
                // padding: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                // background: 'grey',
                // width: '100%',
            }}>
                {start ? (
                    <Button
                        type="primary"
                        onClick={() => {
                            resetGame();
                        }}
                    >
                        Restart
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        onClick={() => {
                            setStart(true);
                            updateCell();
                        }
                        }
                    >
                        Start
                    </Button>
                )}
                {start && (paused ? (
                    <Button
                        type="primary"
                        onClick={() => {
                            setPaused(false);
                        }}
                    >
                        Resume
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        onClick={() => {
                            setPaused(true);
                        }}
                    >
                        Pause
                    </Button>
                ))}
                <Button type="primary" >
                    Leave
                </Button>
            </div>
        )
    }


    return (
        <Content id="Content" role="button" tabIndex="0" onKeyDown={(e) => {
            console.log(e);
        }}
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
    updateCell,
})(Stage);
