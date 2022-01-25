import React from 'react';
import { TETROMINOES } from './Tetrominoes';
import { CellStyle } from '../components/styles/CellStyle';


export const STAGE_WIDTH = 10;
export const STAGE_HEIGHT = 20;

const gnerateId = () => {
    const Ids = '0IJLOSZD';
    const gen = Ids[Math.floor(Math.random() * Ids.length)];
    return gen === '0' ? 0 : gen;
}
export const InitStage = () => {
    // console.log('test');
    const stage = Array.from(Array(STAGE_HEIGHT), () =>
        new Array(STAGE_WIDTH).fill(0));

    return stage

}

export const CreateStage = (map) => {
    // console.log(map);
   const Stage = map?.map(row =>{
       return row.map((cell, key) => {
           return <CellStyle key={key} type={cell} color={TETROMINOES[cell].color}/>
       })
    })
    // console.log(Stage);
    return Stage;
}