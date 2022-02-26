import React, { useEffect, useState } from "react";
import { Menu, Badge, Popover, notification, message } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { connect } from "react-redux";

import "./styles/NotificationsStyled.css";

import { pushNotification, changeStatusInvite } from "../redux/actions";

const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;
const NotifComponent = (props) => {

  const [notifs, setNotifs] = useState([]);
  const [contNotifs, setContNotifs] = useState(0);

  const handnotif = (e) => {
    let split = e.key.split("-");
    const id = parseInt(split[1]);
    const action = split[0];
    notifs.forEach((notif, key) => {
      if (id === key) {
        props.changeStatusInvite({
          event: action + "Invitation",
          roomId: notif.roomId,
          notifId: notif.id,
        });
      }
      return notif;
    });
  };

  useEffect(() => {
    if (!notifs.length) return;
    let cont = notifs.filter((notif) => notif.read === false).length;
    setContNotifs(cont);
  }, [notifs]);

  useEffect(() => {
    setNotifs(props.profile.notif);
  }, [props.profile.notif]);

  const { socket, pushNotification } = props;

  useEffect(() => {
    if (socket.socket) {
      socket.socket.socket("/").on("notification", (data) => {
        notification.info({
          message: "New notification",
          description: data.message,
        });
        pushNotification(data);
      });
      return () => {
        socket.socket.socket("/").off("notification");
      };
    }
  }, [socket, pushNotification]);

  useEffect(() => {
    props.notifications.error && message.error(props.notifications.error);
  }, [props.notifications.error]);

  const mapnotifs = notifs.map((item, key) => {
    return item.type === "invitation" && !item.read ? (
      <SubMenu key={`notif-${key}`} title={item.message}>
        <MenuItemGroup className="ulNotif" >
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
            key={`decline-${key}`}
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
            Decline
          </Menu.Item>
        </MenuItemGroup>
      </SubMenu>
    ) : (
      <SubMenu
        disabled={true}
        expandIcon
        key={`notif-${key}`}
        title={item.message}
      />
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
        content={notifs.length ? menu : null}
        trigger="click"
        placement="bottomRight"
        overlayClassName="notif-popover"
        autoAdjustOverflow={false}
        title={
          <p style={{ fontSize: "16px", color: "#8c8c8c" }}>Notifications</p>
        }
      >
        <Badge
          count={contNotifs}
          showZero
          className="site-badge-count-109"
          style={{
            cursor: "pointer",
            backgroundColor: "#6FCF97",
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
    profile: state.profile,
    socket: state.socket,
    notifications: state.notifications,
  };
};

export default connect(mapStateToProps, {
  pushNotification,
  changeStatusInvite,
})(NotifComponent);
