import React, { useEffect, useState } from "react";
import { Menu, Badge, Popover } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { connect } from "react-redux";

import "./styles/NotificationsStyled.css";

const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;
const NotifComponent = (props) => {
  // don't forget to create a new action of newNotification
  // push notification to the user

  const testnotif = [
    {
      title: "New message from John Doe",
      time: "3 minutes ago",
      read: false,
    },
    {
      title: "New message from John Doe",
      time: "3 minutes ago",
      read: false,
    },
    {
      title: "New message from John Doe",
      time: "3 minutes ago",
      read: false,
    },
    {
      title: "New message from John Doe",
      time: "3 minutes ago",
      read: false,
    },
    {
      title: "New message from John Doe",
      time: "3 minutes ago",
      read: false,
    },
    {
      title: "New message from John Doe",
      time: "3 minutes ago",
      read: false,
    },
    {
      title: "New message from John Doe",
      time: "3 minutes ago",
      read: false,
    },
    {
      title: "New message from John Doe",
      time: "3 minutes ago",
      read: false,
    },
    {
      title: "New message from John Doe",
      time: "3 minutes ago",
      read: false,
    },
  ];
  const [notifs, setNotifs] = useState(testnotif);

  const handnotif = (e) => {
    const id = parseInt(e.key.split("-")[1]);
    const newNotifs = notifs.map((notif, key) => {
      if (id === key) {
        notif.read = true;
      }
      return notif;
    });
    setNotifs(newNotifs);
  };

  const lenght = notifs.filter((notif) => notif.read === false).length;

  useEffect(() => {
    if (props.socket.socket) {
      props.socket.socket.socket("/").on("notification", (data) => {
        console.log(data, "notification");
      });
      return () => {
        props.socket.socket.socket("/").off("notification");
      };
    }
  }, [props.socket]);

  const mapnotifs = notifs.map((notif, key) => {
    return !notif.read ? (
      <SubMenu
        key={`notif-${key}`}
        expandIcon
        title={<p style={{}}>{notif.title}</p>}
      >
        <MenuItemGroup className="ulNotif">
          <Menu.Item
            key={`accept-${key}`}
            className="ant-btn ant-btn-primary"
            onClick={handnotif}
            style={{
              background: "#6FCF97",
              border: "none",
              margin: 5,
              textAlign: "center",
              alignItems: "center",
              display: "inline-flex",
              justifyContent: "center",
              padding: 0,
              color: "#fff",
              height: 35,
            }}
          >
            Accept
          </Menu.Item>
          <Menu.Item
            key={`cancel-${key}`}
            className="ant-btn ant-btn-primary ant-btn-dangerous"
            onClick={handnotif}
            style={{
              margin: 5,
              textAlign: "center",
              alignItems: "center",
              display: "inline-flex",
              justifyContent: "center",
              padding: 0,
              height: 35,
              border: "none",
            }}
          >
            Cancel
          </Menu.Item>
        </MenuItemGroup>
      </SubMenu>
    ) : (
      <Menu.Item key={`notif-${key}`} disabled>
        <div style={{ height: 30 }}>
          <div>
            <p>{notif.title}</p>
            <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
              {notif.time}
            </span>
          </div>
        </div>
      </Menu.Item>
    );
  });

  const menu = (
    <Menu
      multiple
      mode="inline"
      trigger={["click"]}
      selectable={false}
      style={{
        width: "100%",
        maxHeight: "calc(100vh - 200px)",
        overflowY: "auto",
        overflowX: "hidden",
        backgroundColor: "#fff",
        borderRadius: "5px",
        boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e8e8e8",
      }}
    >
      {mapnotifs}
    </Menu>
  );

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        marginTop: "5px",
      }}
    >
      <Popover
        content={menu}
        trigger="click"
        placement="bottomRight"
        overlayClassName="notif-popover"
        autoAdjustOverflow={false}
        // getPopupContainer={trigger => trigger.parentNode}
        // arrowContent={null}
        title={
          <p style={{ fontSize: "16px", color: "#8c8c8c" }}>Notifications</p>
        }
      >
        <Badge
          count={lenght}
          showZero
          className="site-badge-count-109"
          style={{
            cursor: "pointer",
            // border: "1px solid #d9d9d9",
            backgroundColor: "#6FCF97",
            // color: '#fff',
            margin: 0,
            padding: 0,
          }}
        >
          <BellOutlined
            style={{ fontSize: 25, margin: 0, padding: 0, cursor: "pointer" }}
          />
        </Badge>
      </Popover>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    socket: state.socket,
  };
};

export default connect(mapStateToProps, {})(NotifComponent);
