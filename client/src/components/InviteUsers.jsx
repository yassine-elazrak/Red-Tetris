import React, {useEffect, useState} from 'react';
import { connect, useDispatch } from 'react-redux';
import { inviteRequest } from "../actions/invite";

import { Form, Input, Button, message, Card } from 'antd';

import { yellow, red } from '@ant-design/colors';

const { Meta } = Card;

const InviteUsers = (props) => {

    const [input, setInput] = useState({
        value: "",
        error: false,
        errorMessage: "Please enter a valid username at least 3 characters long"
    });

    const handleChange = (e) => {
        setInput({
            ...input,
            value: e.target.value,
            error: e.target.value.length < 3,
        });
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
            const fackId = Math.floor(Math.random() * 10);
            const data = {
                roomId: props.room.room.id,
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
                <Input
                    value={input.value}
                    onChange={handleChange}
                    placeholder="Invite Users"
                />
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


    return (
        <Card title={form} type='inner'
        cover={
            <span style={{
                width: '100%',
                borderBlockEnd: '1px solid #d9d9d9',
                textAlign: 'center',
                display: 'inline-block',
                fontSize: '20px',
                padding: '5px',
            }}>
                users inveted</span>
          }
        
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
            marginTop: '5px',
            width: '100%',
            display: 'inline-block',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 2,
            }}>
                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    alignItems: 'top',
                    flex: 2,
                    }}>
                        <p>user name</p>
                        <span style={{
                            backgroundColor: red[4],
                            padding: '5px',
                            borderRadius: '5px',
                            margin: '5px',
                        }}>Canceled</span>
                </div>
        </div>
        <div style={{
            marginTop: '5px',
            width: '100%',
            display: 'inline-block',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 2,
            }}>
                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    alignItems: 'top',
                    flex: 2,
                    }}>
                        <p>user name</p>
                        <span style={{
                            backgroundColor: "#6FCF97",
                            padding: '5px',
                            borderRadius: '5px',
                            margin: '5px',
                        }}>Joined</span>
                </div>
        </div>
        <div style={{
            marginTop: '5px',
            width: '100%',
            display: 'inline-block',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 2,
            }}>
                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    alignItems: 'top',
                    flex: 2,
                    }}>
                        <p>user name</p>
                        <span style={{
                            backgroundColor: yellow[5],
                            padding: '5px',
                            borderRadius: '5px',
                            margin: '5px',
                        }}>Waiting</span>
                </div>
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