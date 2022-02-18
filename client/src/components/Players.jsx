import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { CreateStage } from "../helpers/StageHelper";
import { UsersStage, SliderMaps } from "./styles/UsersStage";
// import { updatePlayers } from "../redux/actions";
// import { InitStage } from '../helpers/StageHelper';

export const Players = (props) => {
  //console.log('Players');

  //     id: "tuIA2GVZWK_VIKIQAAAN"
  // map: (20) [Array(10), Array(10), Array(10), Array(10)]
  // name: "asdfsa"
  // rows: 0
  // scor: 0
  // status: nul

  const [players, setPlayers] = useState([]);

  const updatePlayers = (data) => {
      console.log(players, data);
      let newP =[... players];
      let P_index = newP.findIndex(p => p.id === data.id)
      if (P_index !== -1){
          newP[P_index] = data;
          setPlayers(newP);
      }
      else{
          console.log('prev', players);
          console.log('data', data);
          setPlayers(prev => [...prev, data]);
      }
  }
  useEffect(() => {
    setPlayers(props.players);
    console.log(props.players, "<<<<<<<P>>>>>>>>>>.");
  }, [props.players]);

  useEffect(() => {
    console.log("update component Players");
    props.socket.socket("/").on("updatePlayers", (data) => {
      console.log(data, "players update <<<pppp>>>>");
      setPlayers([data]);
    // updatePlayers(data);
    //   props.updatePlayers(data);
    });

    return () => {
      props.socket.socket("/").off("updatePlayers");
    };
  }, []);

  const lisMaps = () => {
    return players.map((p, key) => {
      return (
        <div
          key={key}
          style={{
            background: "rgba(0,0,0,0.3)",
            margin: "10px",
            borderRadius: "5px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
              background: "rgba(0,0,0,0.3)",
              padding: "5px",
              borderRadius: "5px 5px 0 0",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <span>{`N: ${p.name}`}</span>
            <span>{`S: ${p.scor}`}</span>
            <span>{`R: ${p.rows}`}</span>
          </div>
          <SliderMaps x={p.map[0].length} y={p.map.length}>
            {CreateStage(p.map)}
          </SliderMaps>
        </div>
      );
    });
  };

  return <UsersStage>{lisMaps()}</UsersStage>;
};

const mapStateToProps = (state) => {
  return {
    players: state.players,
    socket: state.socket.socket,
  };
};

export default connect(mapStateToProps, {
//   updatePlayers,
})(Players);
