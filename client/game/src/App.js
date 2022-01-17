import React, { useState, useEffect } from "react";
// import queryString from 'query-string';
import io from "socket.io-client";
// import { Redirect } from 'react-router';

function App() {

const ENDPOINT = 'http://127.0.0.1:5000';
// useEffect(() => {
  // const { name, room } = queryString.parse(location.search);
  const socket = io(ENDPOINT);
  // socket.emit('join', { name: 'user', room: 'room' });
  // socket.on('message', message => {
  //   console.log(message);
  // });
  // socket.on('connection', () => {
  //   console.log(users);
  // });

//   socket.emit('join', { name : "room" }, (error) => {
  
// //   });
// }, []);



  return (
    <div>
        <h2>hello </h2>
    </div>
  );
}

export default App;
