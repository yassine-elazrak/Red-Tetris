import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { Form, Input, Button, message, Card, Select, Tabs } from "antd";

import { gold, red } from "@ant-design/colors";
import {
  inviteRequest,
  onlineUsers,
  changeStatusRoom,
  onlineUsersUpdate,
  leaveRoom,
} from "../redux/actions";

const { Meta } = Card;
const { Option } = Select;
const { TabPane } = Tabs;

const InviteUsers = (props) => {
  // ////console.log(props, 'props2');

  const [dataSource, setDataSource] = useState([]);
  const [inveted, setInveted] = useState([]);
  const [usersRoom, setUsersRoom] = useState([]);
  const [input, setInput] = useState({
    value: "",
    id: null,
    error: false,
    errorMessage: "Please enter a valid username at least 3 characters long",
  });
  const handleSearch = (value) => {
    setInput({
      ...input,
      value: value,
    });
  };
  // listen for changes in the online users
  useEffect(() => {
    const data = props.users.online.map((user) => {
      return {
        value: user.name,
        id: user.id,
        isJoined: user.isJoined,
        inveted: false,
      };
    });
    // ////console.log(data, "data");
    setDataSource(data);
  }, [props.users]);

  const handleSubmit = (e) => {
    e.preventDefault();
    input.value.length > 2
      ? setInput({
          ...input,
          error: false,
        })
      : setInput({
          ...input,
          error: true,
        });
    if (input.error || !input.id) return;
    // ////console.log(input.id, props.room.id, "input.value");
    props.inviteRequest({
      userId: input.id,
      roomId: props.room.id,
    });
    setInput({
      ...input,
      value: "",
      id: null,
    });
    // setInveted([...inveted, input.id]);
  };

  useEffect(() => {
    props.invite.error && message.error(props.invite.error);
  }, [props.invite.error]);

  useEffect(() => {
    if (props.room.error){
      message.error(props.room.error)
      return;
    }
    //console.log('room update <<<<<<<<<<<');
    setUsersRoom(props.room.users);
    setInveted(props.room.invit);
  }, [props.room]);

  useEffect(() => {
    //console.log('users room update', usersRoom);
  }, [usersRoom])

  useEffect(() => {
    const data = dataSource.map((user) => {
      return {
        ...user,
        inveted: props.room.invit.find(
          (invited) => invited.userId === user.id
        )
          ? true
          : false,
      };
    });

    setDataSource(data);
    setInveted(props.room.invit);
  }, [props.room.invit]);

  // useEffect(() => {
  //   props.room.error && message.error(props.room.error);
  // }, [props.room.error]);

  useEffect(() => {
    props.socket.socket("/").on("updateUsers", (data) => {
      props.onlineUsersUpdate(data);
    });

    props.onlineUsers();

    return () => {
      props.socket.socket("/").off("updateUsers");
    };
  }, []);

  const handleSelect = (id) => {
    const value = dataSource.filter((item) => item.id === id);
    setInput({
      ...input,
      value: value[0].value,
      id: value[0].id,
      error: false,
    });
  };

  // filter the dataSource to only show the users that are included value
  const filterOption = (inputValue, option) => {
    return (
      (Array.isArray(option.children)
        ? option.children.join("")
        : option.children
      )
        .toUpperCase()
        .indexOf(inputValue.toUpperCase()) !== -1
    );
  };

  const options = dataSource.map((item) => {
    return (
      item.id !== props.profile.id &&
      !item.inveted && (
        <Option key={item.id} value={item.id} disabled={item.isJoined}>
          {item.value}
          <span
            style={{
              color: "#ccc",
              fontSize: "12px",
              fontWeight: "normal",
              position: "absolute",
              right: "20px",
            }}
          >{`Status: ${item.isJoined ? "is Joind" : "is Free"}`}</span>
        </Option>
      )
    );
  });

  const form = (
    <Form>
      <Input.Group
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Form.Item
          name="inviteUsers"
          help={input.error ? props.invite.error : ""}
          validateStatus={
            input.error ? "error" : input.value.length > 2 ? "success" : ""
          }
          style={{
            width: "80%",
            maxWidth: "40vh",
          }}
        >
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Search for a user"
            notFoundContent="No users Online"
            filterOption={filterOption}
            onSelect={handleSelect}
            onSearch={handleSearch}
          >
            {options}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            onClick={handleSubmit}
            disabled={input.error || !(input.value.length && input.id)}
            loading={
              props.room.isLoading ||
              props.invite.isLoading ||
              props.users.isLoading
            }
          >
            Invite
          </Button>
        </Form.Item>
      </Input.Group>
    </Form>
  );

  const inviteList = () => {
    return inveted.map((invite, index) => {
      return (
        <div
          key={index}
          style={{
            width: "100%",
            display: "inline-block",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            // flex: 2,
            backgroundColor: index % 2 === 0 ? "#fafafa" : "#f0f0f0",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
              alignItems: "center",
              flex: 2,
            }}
          >
            <span>{invite.userId}</span>
            <span>{invite.userName}</span>
            <span
              style={{
                color:
                  invite.status === "accepted"
                    ? "#6FCF97"
                    : invite.status === "waiting"
                    ? gold.primary
                    : red[4],
                padding: "5px",
                borderRadius: "5px",
                margin: "5px",
              }}
            >
              {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
            </span>
          </div>
        </div>
      );
    });
  };

  const UsersInRoom = () => {
    //console.log('get users room >>>>>>>>>>>>');
    return usersRoom.map((user, key) => {
     return (
        <div
          key={key}
          style={{
            width: "100%",
            display: "inline-block",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
            backgroundColor: key % 2 === 0 ? "#fafafa" : "#f0f0f0",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
              alignItems: "center",
              flex: 2,
            }}
          >
            <span>{user.id}</span>
            <span>{user.id === props.profile.id ? "You" : user.name}</span>
            <span>{!user.status ? 'Joined' : user.status}</span>
          </div>
        </div>
      );
    });
  };

  return (
    <Card
      md={20}
      title={form}
      type="inner"
      actions={[
        <Button
          onClick={() => props.leaveRoom()}
          type="primary"
          style={{
            display: "flex",
            margin: "auto",
            marginTop: "10px",
          }}
        >
          Leave Room
        </Button>,
        <Button
          type="primary"
          onClick={() => props.changeStatusRoom({roomId: props.room.id, status: "closed"})}
          style={{
            display: "flex",
            margin: "auto",
            marginTop: "10px",
          }}
        >
          Close Room
        </Button>,
      ]}
      style={{
        justifyContent: "center",
      }}
    >
      {/* Tabs Start */}
      <Tabs defaultActiveKey="1">
        <TabPane tab="Users inveted" key="1" type="card">
          <div
            style={{
              margin: 0,
              padding: 0,
              width: "100%",
              display: "inline-block",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "5px",
              boxShadow: "0px 0px 5px #d9d9d9",
              maxHeight: "60vh",
              overflowY: "auto",
            }}
          >
            <Meta
              type="inner"
              title={
                <div
                  style={{
                    width: "100%",
                    display: "inline-block",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    paddingTop: "5px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    <p>UserId</p>
                    <p>Name</p>
                    <p>Status</p>
                  </div>
                </div>
              }
              style={{
                backgroundColor: "#f0f0f0",
                padding: 0,
                margin: 0,
                width: "100%",
              }}
            />
            {inviteList()}
          </div>
        </TabPane>
        <TabPane tab="Users joind" key="2">
          <div
            style={{
              margin: 0,
              padding: 0,
              width: "100%",
              display: "inline-block",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "5px",
              boxShadow: "0px 0px 5px #d9d9d9",
              maxHeight: "60vh",
              overflowY: "auto",
            }}
          >
            <Meta
              type="inner"
              title={
                <div
                  style={{
                    width: "100%",
                    display: "inline-block",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    paddingTop: "5px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    <p>UserId</p>
                    <p>Name</p>
                    <p>Status</p>
                  </div>
                </div>
              }
              style={{
                backgroundColor: "#f0f0f0",
                padding: 0,
                margin: 0,
                width: "100%",
              }}
            />
            {UsersInRoom()}
          </div>
        </TabPane>
        {/* Tabs End */}
      </Tabs>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    room: state.room,
    profile: state.profile,
    invite: state.invitation,
    users: state.users,
    socket: state.socket.socket,
  };
};

export default connect(mapStateToProps, {
  inviteRequest,
  onlineUsers,
  changeStatusRoom,
  onlineUsersUpdate,
  leaveRoom,
})(InviteUsers);
