import React, { useState, useEffect } from 'react';
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
    console.log('Message');

    const fackeMessage = () => {
        const message = [];
        for (let i = 0; i < 20; i++) {
            let id = Math.floor(Math.random() * 10);
            message.push({
                userId: id,
                userName: 'user' + id,
                message: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsam, architecto!",
                createdAt: moment().format()
            })
        }
        return message;
    }

    const { auth } = props;
    const [input, setInput] = useState({
        value: '',
        error: false
    })

    const [messages, setMessages] = useState(fackeMessage());
    const handleChange = (e) => {
        setInput({
            ...input,
            value: e.target.value
        })
        console.log(input.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(moment().format());
        const newMessage = {
            userId: auth.id,
            userName: auth.name,
            message: input.value,
            createdAt: moment().format()
        }
        setMessages([...messages, newMessage])
        setInput({
            value: '',
            error: false
        })
    }

    // scrool to bottom wheres new message
    useEffect(() => {
        const chat = document.getElementById('chatBox');
        chat.scrollTop = chat.scrollHeight;
    }, [messages])



    const MessageSide = () => {
        console.log(messages);
        return (
            <BoxMessage id='chatBox'>
                {messages?.map((item, id) => {
                    return (
                        <MessageContent
                            key={id}
                            userId={item.userId}
                            authId={auth.id}>
                            <MessageUserName
                                userId={item.userId}
                                authId={auth.id}>
                                <span>{item.userId === auth.id ? 'You' : item.userName}</span>
                            </MessageUserName>
                            <MessageText
                                userId={item.userId}
                                authId={auth.id}>
                                <span>{item.message}</span>
                            </MessageText>
                            <MessageCreatedAt
                                userId={item.userId}
                                authId={auth.id}>
                                <span>{moment(item.createdAt).fromNow()}</span>
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
                    value={input.value}
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
