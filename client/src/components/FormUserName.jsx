import React, { useState, useEffect } from "react";
// import socketio from 'socket.io-client';


import { Form, Input, Button, message} from "antd";

import { connect } from "react-redux";
import { login } from "../redux/actions";

const FormUserName = (props) => {

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
        e.preventDefault();
        input.value.length > 2 ? setInput({
            ...input,
            error: false
        }) : setInput({
            ...input,
            error: true
        });
        if (input.value.length > 2 && !input.error) {
            props.login(input.value);
        }
        console.log(input.value);
    }


    useEffect(() => {
        // console.log(props.auth);
        if (props.auth.error){
            message.error(props.auth.error);
        }
    }, [props.auth.error]);

    // useEffect(() => {
    //     console.log(socketio, 'socketio');

    // }, [io]);

    return (
        <Form size="large"
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                
            }}
            onSubmit={handleSubmit}
            >
            
            <Input.Group compact
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
                >
                <Form.Item
                    name="username"
                    style={{
                        width: 'calc(100% - 90px)',
                        maxWidth: '40vh',
                    }}
                    help={input.error ? input.errorMessage : ''}
                    hasFeedback
                    validateStatus={input.error ? 'error' : input.value.length > 2 ? 'success' : ''}
                    >
                    <Input
                        onChange={handleChange}
                        placeholder="Enter your name" 
                        name="username"
                        autoFocus
                    />
                </Form.Item>
                    <Button
                        htmlType="submit"
                        type="primary"
                        className="login-form-button"
                        style={{
                            background:'#6FCF97',
                            color: '#fff',

                        }}
                        onClick={handleSubmit}
                        disabled={input.error || input.value.length < 3 || props.auth.isLoading}
                        loading={props.auth.isLoading}
                        >
                        Log in
                    </Button>
            </Input.Group>
        </Form>
    );
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
    }
}

export default connect(mapStateToProps, { login })(FormUserName);