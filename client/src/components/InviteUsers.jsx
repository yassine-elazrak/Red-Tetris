import React, {useEffect, useState} from 'react';
import { connect, useDispatch } from 'react-redux';
import { inviteRequest } from "../actions/invite";

import { Form, Input, Button, message, Card, AutoComplete } from 'antd';

import { yellow, red } from '@ant-design/colors';

const { Meta } = Card;
const { Option } = AutoComplete;

const InviteUsers = (props) => {

    const dataSource = [
        {
            name : 'John',
            id : 1
        },
        {
            name : 'Jane',
            id : 2
        },
        {
            name : 'Jack',
            id : 3
        },
        {
            name : 'Jill',
            id : 4
        },
        {
            name : 'Jenny',
            id : 5
        },
        {
            name : 'Jenny',
            id : 6
        },
        {
            name : 'Jenny',
            id : 7
        },
        {
            name : 'Jenny',
            id : 8
        },
        {
            name : 'Jenny',
            id : 9
        },
        {
            name : 'Jenny',
            id : 10
        },
    ];



    const [input, setInput] = useState({
        value: "",
        error: false,
        errorMessage: "Please enter a valid username at least 3 characters long"
    });

    const handleChange = (e) => {
        console.log(e);
        // setInput({
        //     ...input,
        //     value: e.target.value,
        //     error: e.target.value.length < 3,
        // });
    }

    const handleSubmit = (e) => {
        console.log('e', e);
        e.preventDefault();
        input.value.length > 2 ? setInput({
            ...input,
            error: false
        }) : setInput({
            ...input,
            error: true,
        });
        if (input.value.length > 2 && !input.error) {
            const fackId = Math.floor(Math.random() * 100);
            const data = {
                roomId: props.room.id,
                userId: fackId,
                userName: input.value,
            }
            props.inviteRequest(data);
        }

    }

    useEffect(() => {
        if (props.invite.error){
            message.error(props.invite.error);
          
        }
    }, [props.invite.error]);

  

    const handleSelect = (value) => {
        console.log('value', value);
        setInput({
            ...input,
            value: value,
            error: false,
        });
    }

  const options = dataSource.map(item => {
        return (
            <Option key={item.id}
                    value={item.name}
                    onClick={() => handleSelect(item)}
            >{item.name}</Option>
        )
    });
    const form = (
        <Form
        style={{
            // width: '100%',
        }}
    >
        <Input.Group style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
        }}>
            <Form.Item
                name="inviteUsers"
                help={input.error ? props.invite.error : ""}
                validateStatus={input.error ? "error" : input.value.length > 2 ? "success" : ""}
                style={{
                    width: '80%',
                    maxWidth: '40vh',
                }}
            >
                <AutoComplete
                    style={{
                    }}
                    onSelect={handleSelect}
                    onSearch={handleChange}
                    placeholder="Enter username"
                    value={input.value}
                    // dataSource={options}
                    filterOption={(inputValue, options) =>
                        options.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                 >
                 {options}
                 </AutoComplete>
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={handleSubmit}
                    disabled={
                        input.error ||
                        input.value.length < 3 ||
                        props.room.error
                    }
                    loading={props.room.isLoading}
                >
                    Invite
                </Button>
            </Form.Item>
        </Input.Group>
    </Form>
    );

    const divBackground = ['none', '#f5f5f5'];

    const divAccepted = (name, id) => {
        return (
            <div style={{
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                alignItems: 'center',
                flex: 2,
                }}>
                    <span>{id}</span>
                    <span>{name}</span>
                    <span style={{
                        backgroundColor: "#6FCF97",
                        padding: '5px',
                        borderRadius: '5px',
                        margin: '5px',
                    }}>Joined</span>
            </div>
        )
    }

    const divWaiting = (name, id) => {
        return (
                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    flex: 2,
                    }}>
                        <span>{id}</span>
                        <span>{name}</span>
                        <span style={{
                            backgroundColor: yellow[5],
                            padding: '5px',
                            borderRadius: '5px',
                            margin: '5px',
                        }}>Waiting</span>
                </div>
        )
    }

    const divCancled = (name, id) => {
        return (
            <div style={{
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                alignItems: 'center',
                flex: 2,
                }}>
                    <span>{id}</span>
                    <span>{name}</span>
                    <span style={{
                        backgroundColor: red[4],
                        padding: '5px',
                        borderRadius: '5px',
                        margin: '5px',
                    }}>Canceled</span>
            </div>
        )
    }


    const inviteList = props.invite.invites.map((invite, index) => {
        return (
            <div key={index} style={{
                // marginTop: '5px',
                width: '100%',
                display: 'inline-block',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 2,
                backgroundColor: divBackground[index % 2],
                }}>
                    {invite.status === 'accepted' ? divAccepted(invite.userName, invite.userId) :
                    invite.status === 'waiting' ?   divWaiting(invite.userName, invite.userId) :
                                                    divCancled(invite.userName, invite.userId)}
            </div>
        )
    })

    return (
        <Card title={form} type='inner'
        style={{
            width: '100%',
            padding: 0,
            margin: 0,
            display: 'inline-block',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            }}>


        
        <div style={{
            // marginTop: '5px',
            margin: 0,
            padding: 0,
            height: '100%',
            width: '100%',
            display: 'inline-block',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 2,
            border: '1px solid #d9d9d9',
            borderRadius: '5px',
            boxShadow: '0px 0px 5px #d9d9d9',
            }}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'inline-block',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    backgroundColor: '#fafafa',
                    paddingTop: '5px',
                    margin: 0,
                    }}>
                        <div style={{
                            width: '100%',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-around',
                            alignItems: 'top',
                            flex: 2,
                            }}>
                                <p>UserId</p>
                                <p>Name</p>
                                <p>Status</p>
                        </div>
            </div>
                {inviteList}
        </div>
        <Meta type='inner' title={
            <Button type="primary" style={{
                display: 'flex',
                margin: 'auto',
                marginTop: '10px',
                }}>
                Start Game
            </Button>
        } style={{
            backgroundColor: '#fff',
        }} />
        </Card>

    )
}

const mapStateToProps = (state) => {
    return {
        room: state.room,
        auth: state.auth,
        invite: state.invite,
    }
}

export default connect(mapStateToProps, { inviteRequest })(InviteUsers);