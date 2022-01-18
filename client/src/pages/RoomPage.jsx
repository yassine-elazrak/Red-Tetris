import React from 'react'
import { connect } from 'react-redux'
import { leaveRoom, closeRoom } from '../actions/room'
import { Layout, Menu} from 'antd'
import Icon from '@ant-design/icons';



const { Header, Content, Footer, Sider } = Layout;

// don't forget to create a new action of inviteUser

export const RoomPage = (props) => {
    console.log(props);
    return (
        <h1>RoomPage2</h1>
    //     <Layout>
    //         <Sider
    //             breakpoint="lg"
    //             collapsedWidth="0"
    //             onBreakpoint={broken => {
    //                 console.log(broken);
    //             }}
    //             onCollapse={(collapsed, type) => {
    //                 console.log(collapsed, type);
    //             }}
    //         >
    //             <div className="logo" />
    //             <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
    //                 <Menu.Item key="1">
    //                     <Icon type="user" />
    //                     <span className="nav-text">nav 1</span>
    //                 </Menu.Item>
    //                 <Menu.Item key="2">
    //                     <Icon type="video-camera" />
    //                     <span className="nav-text">nav 2</span>
    //                 </Menu.Item>
    //             </Menu>
    //         </Sider>
    //         <Layout>
    //             <Header style={{ background: '#fff', padding: 0 }} />
    //             <Content style={{ margin: '24px 16px 0' }}>
    //                 <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
    //                     <h1>Room Page</h1>
    //                 </div>
    //             </Content>
    //             <Footer style={{ textAlign: 'center' }}>
    //                 Ant Design ©2018 Created by Ant UED
    //             </Footer>
    //         </Layout>
    //     </Layout>

    )
}

const mapStateToProps = (state) => ({
    room: state.room,
    user: state.auth.user,

})


export default connect(mapStateToProps, {leaveRoom, closeRoom})(RoomPage)
