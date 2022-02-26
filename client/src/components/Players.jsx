import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { CreateStage } from "../helpers/StageHelper";
import { UsersStage, SliderMaps } from "./styles/UsersStage";
import { updateOnePlayer } from "../redux/actions";
import { Spin } from "antd";

export const Players = (props) => {
  const [currentPlayers, setCurrentPlayers] = useState([]);

  useEffect(() => {
    setCurrentPlayers(props.players.players);
  }, [props.players]);

  const {socket, updateOnePlayer} = props;


  useEffect(() => {
    if (socket) {
      socket.socket("/").on("updateOnePlayer", (data) => {
        updateOnePlayer(data)
      });

      return () => {
        socket.socket("/").off("updateOnePlayer");
      };
    }
  }, [socket, updateOnePlayer]);

  const lisMaps = () => {
    return currentPlayers.map((p, key) => {
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
          <Spin
            spinning={!p.status ? false : true}
            indicator={null}
            tip={p.status}
            style={{
              color: p.status === 'gameOver' ? 'red' : p.status === 'continue' ? 'black' : '#02FD3E',
              fontSize: 20,
            }}
          >
            <SliderMaps x={p.map[0].length} y={p.map.length}>
              {CreateStage(p.map)}
            </SliderMaps>
          </Spin>
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
  updateOnePlayer,
})(Players);
