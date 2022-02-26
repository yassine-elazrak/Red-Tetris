import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { Button, Input, message, Form } from "antd";
import { SendOutlined } from "@ant-design/icons";
import moment from "moment";

import {
  BoxMessage,
  MessageContent,
  MessageUserName,
  MessageText,
  MessageCreatedAt,
} from "./styles/BoxMessage";

import { sentMessage, receiveMessage, clearMessages } from "../redux/actions";
const Message = (props) => {
  const { profile } = props;
  const [form] = Form.useForm();
  const [inputError, setInputError] = useState(false);
  const [messages, setMessages] = useState([]);



  const handleSubmit = (e) => {
    const newMessage = {
      roomId: props.room.id,
      ...e, // {message: "input value"}
    };
    props.sentMessage(newMessage);
    form.resetFields();
  };

  const { clearMessages, receiveMessage, socket } = props;

  useEffect(() => {
    clearMessages();
    if (socket) {
      socket.socket("/").on("message", (data) => {
        receiveMessage(data);
      });
      return () => {
        socket.socket("/").off("message");
      };
    }
  }, [socket, clearMessages, receiveMessage]);

  useEffect(() => {
    if (props.messenger.error) message.error(props.messenger.error);
    setMessages(props.messenger.messages);
  }, [props.messenger]);

  // scrool to bottom wheres new message
  useEffect(() => {
    const chat = document.getElementById("chatBox");
    chat.scrollTop = chat.scrollHeight;
  }, [messages]);

  const MessageSide = () => {
    return (
      <BoxMessage
        id="chatBox"
        style={{
          height: "calc(100vh - 250px)",
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
      <Form onFinish={handleSubmit}
        form={form}
      >
        <Form.Item
          name="message"
          rules={[
            () => ({
              validator(_, value) {
                if (!value || value.trim().length < 3) {
                  setInputError(true);
                  return Promise.reject(new Error('Please enter  at least 3 characters long!'));
                }
                setInputError(false);
                return Promise.resolve();
              },
            })
          ]}
        >
          <Input
            allowClear={true}
            style={{
              padding: 0,
            }}
            suffix={
              <Button
                type="primary"
                htmlType="submit"
                disabled={inputError}
                loading={props.messenger.loading}
              >
                <SendOutlined />
              </Button>
            }
          />
        </Form.Item>
      </Form>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    room: state.room,
    messenger: state.message,
    socket: state.socket.socket,
  };
};

export default connect(mapStateToProps, {
  sentMessage,
  receiveMessage,
  clearMessages,
})(Message);
