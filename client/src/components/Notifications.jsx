import React, { useState } from "react";
import { Menu, Dropdown, Badge, Popover, Button } from "antd";
import { BellOutlined } from '@ant-design/icons';


import { red } from '@ant-design/colors';

import "./styles/NotificationsStyled.css";

const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;
const NotifComponent = () => {

    const testnotif = [
        {
            title: "New message from John Doe",
            time: "3 minutes ago",
            read: false
        },
        {
            title: "New message from John Doe",
            time: "3 minutes ago",
            read: false
        },
        {
            title: "New message from John Doe",
            time: "3 minutes ago",
            read: false
        },
        {
            title: "New message from John Doe",
            time: "3 minutes ago",
            read: false
        },
        {
            title: "New message from John Doe",
            time: "3 minutes ago",
            read: false
        },
        {
            title: "New message from John Doe",
            time: "3 minutes ago",
            read: false
        },
        {
            title: "New message from John Doe",
            time: "3 minutes ago",
            read: false
        },
        {
            title: "New message from John Doe",
            time: "3 minutes ago",
            read: false
        },
        {
            title: "New message from John Doe",
            time: "3 minutes ago",
            read: false
        },
    ]
    const [notifs, setNotifs] = useState(testnotif);

    const handnotif = (e) => {
        console.log(e);
        const id = parseInt(e.key.split("-")[1]);
        const action = e.key.split("-")[0];
        console.log(id);
        const newNotifs = notifs.map((notif, key) => {
            if (id === key) {
                console.log(notif);
                notif.read = true;
            }
            return notif;
        });
        setNotifs(newNotifs);
    }

    const lenght = notifs.filter(notif => notif.read === false).length;


    const mapnotifs = notifs.map((notif, key) => {
        return (
            !notif.read ?
            <SubMenu key={`notif-${key}`} expandIcon title={
                <div style={{ height: 30, display: "inline-flex" }}>
                    <div>
                        <p>{notif.title}</p>
                        <span style={{ fontSize: "12px", color: "#8c8c8c" }}>{notif.time}</span>
                    </div>
                </div>
            }>
                <MenuItemGroup className="ulNotif">
                    <Menu.Item key={`accept-${key}`} className="ant-btn ant-btn-primary" onClick={handnotif} style={{
                        // background: "green",
                        margin: 5,
                        textAlign: "center",
                        alignItems: "center",
                        display: "inline-flex",
                        justifyContent: "center",
                        padding: 0,
                        color: "#fff",
                    }}>
                        Accept
                    </Menu.Item>
                    <Menu.Item key={`cancel-${key}`} className="ant-btn ant-btn-primary ant-btn-dangerous" onClick={handnotif} style={{
                        margin: 5,
                        textAlign: "center",
                        alignItems: "center",
                        display: "inline-flex",
                        justifyContent: "center",
                        padding: 0,
                    }}>
                        Cancel
                    </Menu.Item>
                </MenuItemGroup>
            </SubMenu>
            :
            <Menu.Item key={`notif-${key}`} disabled>
                <div style={{ height: 30 }}>
                    <div>
                        <p>{notif.title}</p>
                        <span style={{ fontSize: "12px", color: "#8c8c8c" }}>{notif.time}</span>
                    </div>
                </div>
            </Menu.Item>

        )
    })

    const menu = (
        <Menu multiple mode="inline" trigger={['click']} selectable={false} selectable={false}  style={{
            width: "100%",
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
            overflowX: "hidden",
            backgroundColor: "#fff",
            borderRadius: "5px",
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e8e8e8",
            }}>
            {mapnotifs}
      </Menu>
    );

    return (
        <div style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            marginTop: "5px",
        }}>
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
                <Badge count={lenght} showZero className="site-badge-count-109" style={{cursor: "pointer", border: "1px solid #d9d9d9",backgroundColor: "#6FCF97", color: '#fff', margin: 0, padding: 0}} >
                    <BellOutlined style={{fontSize: 25, margin: 0, padding: 0, cursor: 'pointer'}} />
                </Badge>
            </Popover>
        </div>
        



    );
}

export default NotifComponent;
