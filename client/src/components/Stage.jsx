import React from 'react';
import { useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { Layout, Card, Button, Row, Col } from 'antd';

import { createStage, STAGE_HEIGHT, STAGE_WIDTH } from '../helpers/StageHelper';
import { TETROMINOES, randomTetromino } from '../helpers/Tetrominoes';
import { CellStyle } from './styles/CellStyle';

const { Content, Sider } = Layout;

const Stage = (props) => {

    // const stage = useSelector(state => state.stage);
    // const tetromino = useSelector(state => state.tetromino);
    // const dispatch = useDispatch();


    const { room, auth } = props;

    console.log(props);
    const map = createStage();

    const fackeMessage = [
        {
            id: 1,
            userId: 1,
            userName: 'user1',
            message: 'hello',
            createdAt: '2020-01-01'
        },
        {
            id: 2,
            userId: 2,
            userName: 'user2',
            message: 'hello',
            createdAt: '2020-01-01'
        },
        {
            id: 3,
            userId: 3,
            userName: 'user3',
            message: 'hello',
            createdAt: '2020-01-01'
        },
        {
            id: 4,
            userId: 4,
            userName: 'user4',
            message: 'hello',
            createdAt: '2020-01-01'
        },
        {
            id: 5,
            userId: 5,
            userName: 'user5',
            message: 'hello',
            createdAt: '2020-01-01'
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
                height: '100%',
                width: '100%',
                // background: 'rgba(0,0,0,0.5)',
                borderRight: '1px solid #ccc',
                overflow: 'auto',
                padding: '10px'
            }}>
                {fackeMessage.map(item => {
                    return (
                        <div key={item.id}>
                            {/* <span>{auth.id}</span>
                            <span>{item.userName}</span>
                            <span>{item.message}</span>
                            <span>{item.createdAt}</span>
                            <span>{item.id}</span> */}
                        </div>
                    )
                })}
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
                border: '1px solid red',
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
                border: '1px solid red',

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
            paddingTop: '30px',
            paddingBottom: '30px',
            marginTop: '-10px',
            marginBottom: '-20px',
            }}>
        <Row style={{
            border: '1px solid red',
        }}>
            <Col span={24}>
                {header()}
            </Col>
        </Row>
        <Row style={{
            border: '1px solid green',
        }}>
            <Col span={8} style={{
                border: '1px solid blue',
            }}>
                <LeftSide />
            </Col>
            <Col span={8} style={{
                border: '1px solid blue',
            }}>
                {body()}
            </Col>
            <Col span={8} style={{
                border: '1px solid grey',
            }}>
                <MessageSide />
            </Col>
        </Row>
        <Row style={{
            border: '1px solid red',
        }}>
            <Col span={24}>
                <div style={{
                    border: '1px solid red',
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
