import React from 'react';
import { connect } from 'react-redux';

import { CreateStage, } from '../helpers/StageHelper';
import { UsersStage, SliderMaps } from './styles/UsersStage';


export const Players = (props) => {
    const fakeMap = [
        {
            id: 1,
            userId: 1,
            userName: 'user1',
            lines: 3,
            score: 100,
            map: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 'L', 'L', 'L', 0, 0, 0, 0],
                ['L', 'O', 'O', 'L', 0, 0, 0, 0, 0, 0],
                ['L', 'O', 'O', 'J', 'T', 'T', 'T', 0, 0, 0],
                ['L', 'L', 'J', 'J', 0, 'T', 0, 0, 0, 0],
                ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],

            ]
        },
    ];

    const Maps = CreateStage(fakeMap[0].map);

    const listMaps = () => {
        return (
            <SliderMaps x={Maps[0].length} y={Maps.length}>
                {Maps}
            </SliderMaps>
        )
    }


    return (
        <UsersStage >
            {listMaps()}
            {listMaps()}
            {listMaps()}
            {listMaps()}
            {listMaps()}
        </UsersStage>
    );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(Players);
