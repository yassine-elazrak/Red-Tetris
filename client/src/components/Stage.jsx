import React from 'react';
import { useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { Layout, Card, Button, Row, Col, Input } from 'antd';
import moment from 'moment'

import { createStage, STAGE_HEIGHT, STAGE_WIDTH } from '../helpers/StageHelper';
import { TETROMINOES, randomTetromino } from '../helpers/Tetrominoes';
import { CellStyle } from './styles/CellStyle';

const { Content, Sider } = Layout;

const Stage = (props) => {


    const { room, auth } = props;

    console.log(props);
    const map = createStage();

    const fackeMessage = [
        {
            id: 1,
            userId: 1,
            userName: 'user1',
            message: 'hello',
            createdAt: '2022-1-24 12:12:12'
        },
        {
            id: 2,
            userId: 2,
            userName: 'user2',
            message: 'hi',
            createdAt: '2022-1-24 12:12:12'
        },
        {
            id: 3,
            userId: 3,
            userName: 'user3',
            message: 'how are you',
            createdAt: '2022-1-24 12:12:12'
        },
        {
            id: 4,
            userId: 1,
            userName: 'user4',
            message: 'fine',
            createdAt: '2022-1-24 12:12:12'
        },
        {
            id: 5,
            userId: 5,
            userName: 'user5',
            message: 'good',
            createdAt: '2022-1-24 12:12:12'
        },
        {
            id: 6,
            userId: 6,
            userName: 'user6',
            message: 'nice',
            createdAt: '2022-1-24 12:12:12'
        },
    ]




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

    const MessageSide = () => {
        return (
            <div style={{
                width: '100%',
                // borderRight: '1px solid #ccc',
                overflowX: 'hidden',
                overflowY: 'auto',
                padding: '5px',
                height: 'calc(100% - 30px)',
            }}>
                {fackeMessage.map(item => {
                    return (
                        <div key={item.id} style={{
                            background: 'rgba(0,0,0,0.5)',
                            width: '90%',
                            paddingLeft: '5px',
                            paddingRight: '5px',
                            direction: `${item.userId === auth.id ? 'rtl' : 'ltr'}`,
                            float: `${item.userId === auth.id ? 'right' : 'left'}`,
                            marginBottom: '10px',
                            borderRadius: '10px',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gridTemplateRows: '1fr 1fr',
                            gridTemplateAreas: `
                            "userName createdAt"
                            "message message"
                            `
                        }}>
                            <div style={{
                                gridArea: 'userName',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: 'rgba(255,255,255,0.5)',
                                textAlign: 'start',
                                padding: '5px'
                            }}>{item.userId === auth.id ? 'You' : item.userName}</div>
                            <div style={{
                                gridArea: 'message',
                                fontSize: '12px',
                                color: '#ccc',
                                textAlign: 'start',
                                padding: '5px'
                            }}>{item.message}</div>
                            <div style={{
                                gridArea: 'createdAt',
                                fontSize: '12px',
                                color: 'rgba(255,255,255,0.5)',
                                textAlign: 'end',
                                padding: '5px'
                            }}>{moment(item.createdAt).fromNow()}</div>
                        </div>

                    )
                }
                )}
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
                // border: '1px solid red',
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
                padding: '10px',
                background: 'rgba(0,0,0,0.3)',
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
                background: 'none',
                margin: 'auto',
                // padding: '10px',
                // border: '1px solid red',

            }}>
                {stage}
            </div>
        )
    }

    // const fakeMessage = 

    return (
        <Content style={{
            background: 'rgba(0, 0, 0, 0.5)',
            padding: 0,
            margin: 0,
            height: 'calc(100vh - 90px)',
            paddingTop: '15px',
            paddingBottom: '30px',
            marginTop: '-10px',
            marginBottom: '-20px',
            // position: 'fixed',
        }}>
            <Row style={{
                // border: '1px solid red',
            }}>
                <Col span={24}>
                    {header()}
                </Col>
            </Row>
            <Row style={{
                // border: '1px solid green',
                // background: 'rgba(0, 0, 0, 0.5)',
                height: 'calc(100vh - 220px)',
            }}>
                <Col span={8} style={{
                    // border: '1px solid blue',
                }}>
                    <LeftSide />
                </Col>
                <Col span={8} style={{
                    // border: '1px solid blue',
                    padding: '10px',
                    margin: 'auto',
                }}>
                    {body()}
                </Col>
                <Col span={8} style={{
                    // border: '1px solid grey',
                    height: '100%',
                    // overflow: 'hidden',
                    // padding: '10px',
                }}>
                    <MessageSide />
                    <Input style={{
                        width: '100%'
                    }} />

                </Col>
            </Row>
            <Row style={{
                // border: '1px solid red',
            }}>
                <Col span={24}>
                    <div style={{
                        // border: '1px solid red',
                        padding: '10px',
                    }}>
                        <span>Footer</span>
                    </div>
                </Col>
            </Row>

        </Content>
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
