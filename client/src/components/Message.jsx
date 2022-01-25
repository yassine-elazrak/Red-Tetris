import React, { useState } from 'react';
import { connect } from 'react-redux';


import { Button, Input } from 'antd';
import { SendOutlined } from '@ant-design/icons'
import moment from 'moment'


import {
    BoxMessage,
    MessageContent,
    MessageUserName,
    MessageText,
    MessageCreatedAt
} from './styles/BoxMessage';

const Message = (props) => {
    const fackMessage = [
        {
            userId: 1,
            userName: 'user1',
            message: 'hello',
            createdAt: '2022-1-24 12:12:12'
        },
        {
            userId: 2,
            userName: 'user2',
            message: 'hi',
            createdAt: '2022-1-24 12:12:12'
        },
        {
            userId: 3,
            userName: 'user3',
            message: 'how are you',
            createdAt: '2022-1-24 12:12:12'
        },
    ]
    const { room, auth } = props;
    const [input, setInput] = useState({
        value: '',
        error: false
    })

    const [messages, setMessages] = useState(fackMessage);

    const handleChange = (e) => {
        setInput({
            ...input,
            value: e.target.value
        })
        console.log(input.value);
    }

    const handleSubmit = (e) => {
        // console.log(moment().format());
        const newMessage = {
            userId: auth.id,
            userName: auth.name,
            message: input.value,
            createdAt: moment().format()
        }
        setMessages([...messages, newMessage])
    }


    const MessageSide = () => {
        console.log(messages);
        return (
            <BoxMessage>
                {messages?.map((item, id) => {
                    return (
                        <MessageContent
                            key={id}
                            userId={item.userId}
                            authId={auth.id}>
                            <MessageUserName
                                userId={item.userId}
                                authId={auth.id}>
                                {item.userId === auth.id ? 'You' : item.userName}
                            </MessageUserName>
                            <MessageText
                                userId={item.userId}
                                authId={auth.id}>
                                {item.message}
                            </MessageText>
                            <MessageCreatedAt
                                userId={item.userId}
                                authId={auth.id}>
                                {moment(item.createdAt).fromNow()}
                            </MessageCreatedAt>
                        </MessageContent>

                    )
                }
                )}
            </BoxMessage>
        )
    }

    return (
        <>
            {MessageSide()}
            <Input.Group compact>
                <Input style={{
                    width: 'calc(100% - 60px)',
                    margin: 'auto'
                }}
                    onPressEnter={handleSubmit}
                    onChange={handleChange}
                    value={Input.value}
                />
                <Button type="primary" onClick={handleSubmit}>
                    <SendOutlined />
                </Button>
            </Input.Group>
        </>
    )
};

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        room: state.room
    }
}

export default connect(mapStateToProps, {})(Message);
