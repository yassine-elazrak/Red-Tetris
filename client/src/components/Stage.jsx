import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Layout, Row, Col } from 'antd';
import {
    InitStage,
    CreateStage,
    STAGE_HEIGHT,
    STAGE_WIDTH
} from '../helpers/StageHelper';
import { TETROMINOES, randomTetromino } from '../helpers/Tetrominoes';
import { CellStyle } from './styles/CellStyle';
import { UsersStage } from './styles/UsersStage';

import Message from './Message';
import Players from './Players';


const { Content, Sider } = Layout;

const Stage = (props) => {


    const { room, auth } = props;

    const stage = CreateStage(InitStage());

    const rendom = randomTetromino();

    const nextTetromino = rendom.shape.map(row => {
        return row.map((cell, key) => {
            return <CellStyle
                key={key}
                type={cell}
                color={TETROMINOES[cell].color} />
        })
    })

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
                    gridTemplateRows: `repeat(${rendom.shape[0].length},
                        calc(100% / ${rendom.shape[0].length}))`,
                    gridTemplateColumns: `repeat(${rendom.shape.length}, 1fr)`,
                    gridGap: '1px',
                    width: `calc(15px * ${rendom.shape.length})`,

                }} >
                    {nextTetromino}
                </div>
                <span>SCOR 120</span>
                <span>LINES 2</span>
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

            }}>
                {stage}
            </div>
        )
    }

    return (
        <Content style={{
            background: 'rgba(0, 0, 0, 0.7)',
            padding: 0,
            margin: 0,
            height: 'calc(100vh - 90px)',
            // paddingTop: 'px',
            paddingBottom: '30px',
            marginTop: '-10px',
            marginBottom: '-20px',
        }}>
            <Row style={{
            }}>
                <Col span={24} style={{
                    // background: 'rgba(0, 0, 0, 0.7)',

                }}>
                    {header()}
                </Col>
            </Row>
            <Row style={{
                height: 'calc(100vh - 220px)',
            }}>
                <Col span={8} style={{
                    margin: 'auto',
                }}>
                    <Players />
                </Col>
                <Col span={8} style={{
                    padding: '10px',
                    margin: 'auto',
                }}>
                    {body()}
                </Col>
                <Col span={8} style={{
                    height: '100%',
                }}>
                    <Message />

                </Col>
            </Row>
            <Row style={{
            }}>
                <Col span={16} offset={8}>
                    <div style={{
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
    }
}

export default connect(mapStateToProps, {})(Stage);
