import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { Button, Input, message } from "antd";
import { SendOutlined, LoadingOutlined } from "@ant-design/icons";
import moment from "moment";

import {
  BoxMessage,
  MessageContent,
  MessageUserName,
  MessageText,
  MessageCreatedAt,
} from "./styles/BoxMessage";

import {
    sentMessage,
    receiveMessage,
    clearMessages,
} from "../redux/actions"

const { Search } = Input;
const Message = (props) => {
  console.log("Message");

  const fackeMessage = () => {
    const message = [];
    for (let i = 0; i < 20; i++) {
      let id = Math.floor(Math.random() * 10);
      message.push({
        userId: id,
        userName: "user" + id,
        message:
          "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsam, architecto!",
        createdAt: moment().format(),
      });
    }
    return message;
  };

  const { profile } = props;
  const [input, setInput] = useState({
    value: "",
    error: false,
  });

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleChange = (e) => {
    setInput({
      ...input,
      value: e.target.value,
    });
    console.log(input.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(moment().format());
    const newMessage2 = {
      userId: profile.id,
      userName: profile.name,
      message: input.value,
      createdAt: moment().format(),
    };
    const newMessage = {
        roomId : props.room.id,
        message : input.value,
    }
    props.sentMessage(newMessage);
    // setMessages([...messages, newMessage2]);
    setInput({
      value: "",
      error: false,
    });
  };

  useEffect(() => {
      props.clearMessages();
      props.socket.socket('/').on('message', data => {
          props.receiveMessage(data);
          console.log(data);
      })
      return () => {
          props.socket.socket('/').off('message');
      }
  }, []);

  useEffect(() => {
      if (props.messenger.error)
        message.error(props.messenger.error);
      setMessages( props.messenger.messages)
    console.log("messenger", props.messenger);
  }, [props.messenger])

  // scrool to bottom wheres new message
  useEffect(() => {
    const chat = document.getElementById("chatBox");
    chat.scrollTop = chat.scrollHeight;
  }, [messages]);

  const MessageSide = () => {
    console.log(messages);
    return (
      <BoxMessage
        id="chatBox"
        style={{
          height: "calc(100vh - 220px)",
        }}
      >
        {messages.map((item, id) => {
          return (
            <MessageContent
              key={id}
              userId={item.userId}
              profileId={profile.id}
            >
              <MessageUserName userId={item.userId} profileId={profile.id}>
                <span>
                  {item.userId === profile.id ? "You" : item.userName}
                </span>
              </MessageUserName>
              <MessageText userId={item.userId} profileId={profile.id}>
                <span>{item.message}</span>
              </MessageText>
              <MessageCreatedAt userId={item.userId} profileId={profile.id}>
                <span>{moment(item.createdAt).fromNow()}</span>
              </MessageCreatedAt>
            </MessageContent>
          );
        })}
      </BoxMessage>
    );
  };

  return (
    <>
      {MessageSide()}
      {/* <Input.Group compact style={{
                background: 'red',
            }}>
                <Input style={{
                }}
                    onPressEnter={handleSubmit}
                    onChange={handleChange}
                    value={input.value}
                />
                <Button
                type="primary"
                onClick={handleSubmit}
                loading= {loading}
                >
                    {loading ? (
                        <LoadingOutlined/>
                    ) : (
                        <SendOutlined />
                    )}
                </Button>
                    </Input.Group> */}
      <Input
      allowClear={true}
      onPressEnter={handleSubmit}
      onChange={handleChange}
      value={input.value}
      style={{
          padding: 0,
      }}
        suffix={
          <Button
          type="primary"
          onClick={handleSubmit}
          loading={props.messenger.loading}
          >
            <SendOutlined />
          </Button>
        }
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    room: state.room,
    messenger : state.message,
    socket : state.socket.socket,
  };
};

export default connect(mapStateToProps, {
    sentMessage,
    receiveMessage,
    clearMessages,
})(Message);
