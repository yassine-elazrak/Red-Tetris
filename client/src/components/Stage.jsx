import React from 'react';
import { useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { Layout, Card, Button } from 'antd';

import { createStage, STAGE_HEIGHT, STAGE_WIDTH } from '../helpers/StageHelper';
import { TETROMINOES, randomTetromino} from '../helpers/Tetrominoes';
import { CellStyle } from './styles/CellStyle';

const { Content, Sider } = Layout;

const Stage = (props) => {

    const { room, auth } = props;

    console.log(props);
    const map = createStage();

    console.log(map);

    

    const stage = map.map(row => {
        return row.map((tetrIndex, index) => {
            return <CellStyle
                key={index} type={tetrIndex}
                color={TETROMINOES[tetrIndex].color} />
        })
    })

    return (
        <Layout style={{
            background: 'none',
            width: '100vw',
            height: 'auto',
            border: '1px solid green',
            background: 'none',
        }}>
            <Sider>
                <h1>Hello</h1>
            </Sider>
            <Card type='inner'
                actions={[
                    <Button type='primary'>
                        Leave Room </Button>,
                    <Button type='primary'>
                        Start Game </Button>

                ]} style={{
                    width: '100%',
                }} >
                <Content style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    background: 'none',
                    // padding: 0,
                    // margin: 0,
                }}>
                    <div className="stage" style={{
                        display: 'grid',
                        gridTemplateRows: `repeat(${STAGE_HEIGHT},
                            calc(25vh / ${STAGE_WIDTH}))`,
                        gridTemplateColumns: `repeat(${STAGE_WIDTH}, 1fr)`,
                        gridGap: '1px',
                        width: '60%',
                        // maxWidth: '25vw',
                        border: '1px solid #000',
                        background: '#fff',
                        borderRadius: '5px',
                        margin: 'auto',
                    }}>
                        {stage}
                    </div>
                    <div className="info" style={{
                        background: 'green',
                        // width: '10%',
                        padding: '20px',
                        // margin: 'auto',
                    }}
                    >
                        <div>
                            <h1>Next Piece</h1>
                            <h1>Score</h1>
                            <h1>Level</h1>
                        </div>
                    </div>
                </Content>
            </Card>
            <Sider>
                <h1>Hello World</h1>
            </Sider>
        </Layout>
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
