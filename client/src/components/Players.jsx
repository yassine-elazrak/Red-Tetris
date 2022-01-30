import React from 'react';
import { connect } from 'react-redux';

import { CreateStage, } from '../helpers/StageHelper';
import { UsersStage, SliderMaps } from './styles/UsersStage';
import { InitStage } from '../helpers/StageHelper';


export const Players = (props) => {
    console.log('Players');

    const fakeMap = [
        {
            id: 1,
            userId: 1,
            userName: 'user1',
            lines: 3,
            score: 100,
            map: InitStage(),
        },
        {
            id: 1,
            userId: 1,
            userName: 'user1',
            lines: 3,
            score: 100,
            map: InitStage(),
        },
        {
            id: 1,
            userId: 1,
            userName: 'user1',
            lines: 3,
            score: 100,
            map: InitStage(),
        },
        {
            id: 1,
            userId: 1,
            userName: 'user1',
            lines: 3,
            score: 100,
            map: InitStage(),
        },
        {
            id: 1,
            userId: 1,
            userName: 'zaynoune',
            lines: 3,
            score: 100,
            map: InitStage(),
        },
    ];


    const lisMaps = fakeMap.map((map, index) => {
        return (
            <div key={index} style={{
                background: 'rgba(0,0,0,0.3)',
                margin: '10px',
                borderRadius: '5px',
            }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '5px',
                    borderRadius: '5px 5px 0 0',
                    color: 'rgba(255,255,255,0.5)',
                }}>
                    <span>{`N: ${map.userName}`}</span>
                    <span>{`S: ${map.score}`}</span>
                    <span>{`L: ${map.lines}`}</span>
                </div>
                <SliderMaps x={map.map[0].length} y={map.map.length}>
                    {CreateStage(map.map)}
                </SliderMaps>
            </div>
        )
    })

    return (
        <UsersStage >
            {lisMaps}
        </UsersStage>
    );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(Players);
