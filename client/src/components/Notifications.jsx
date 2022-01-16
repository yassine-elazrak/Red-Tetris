import React, { useState } from "react";
import { Menu, Dropdown, Badge } from "antd";
import { BellOutlined } from '@ant-design/icons';


import { red } from '@ant-design/colors';

const { SubMenu } = Menu;

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
            read: true
        },
        {
            title: "New message from John Doe",
            time: "3 minutes ago",
            read: true
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
        const newNotifs = notifs.map((notif, key) => {
            if (e.key.split("-")[1] === key) {
                notif.read = false;
            }
            return notif;
        });
        setNotifs(newNotifs);
        

        console.log(e.key.split("-")[1]);
    }


    const mapnotifs = notifs.map((notif, key) => {
        return (
            !notif.read ?
            <SubMenu key={key} expandIcon title={
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div>
                        <p>{notif.title}</p>
                        <p style={{ fontSize: "12px", color: "#8c8c8c" }}>{notif.time}</p>
                    </div>
                </div>
            }>
                <Menu.Item key={'accept-' + key} onClick={handnotif}
                    style={{
                        backgroundColor: "#6FCF97",
                        borderRadius: "3px",
                        margin: "5px",
                        color: "#fff",

                    }}>
                    Accept
                </Menu.Item>

                <Menu.Item key={'cancel-' + key} style={{
                    backgroundColor: red[5],
                    borderRadius: "3px",
                    margin: "5px",
                    color: "#fff",
                }}>
                    Cancel
                </Menu.Item>
            </SubMenu>
            :
            <SubMenu key={key} expandIcon disabled title={
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div>
                        <p>{notif.title}</p>
                        <p style={{ fontSize: "12px", color: "#8c8c8c" }}>{notif.time}</p>
                    </div>
                </div>
            }>
            </SubMenu>
        )
    })

    const menu = (
        <Menu mode="vertical" trigger={['click']} >
            {mapnotifs}
        </Menu>
    );

    return (
        <Dropdown overlay={menu} trigger={['click']} >
            <div className="ant-dropdown-link" style={{padding: '8px 0px', cursor: 'pointer'}} >
                <Badge count={notifs.length} showZero className="site-badge-count-109" style={{backgroundColor: "#6FCF97", color: '#fff', margin: 0, padding: 0}} >
                    <BellOutlined style={{fontSize: 25, margin: 0, padding: 0}} />
                </Badge>
            </div>
        </Dropdown>
    );
}

export default NotifComponent;
