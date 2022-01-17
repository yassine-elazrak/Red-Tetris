import React, { useState } from "react";

import { Form, Input, Button} from "antd";

import { connect } from "react-redux";
import { login} from "../actions/auth";


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
    }

   



    return (
        <Form
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
            
            <Input.Group size="large"
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
                        display: 'inline-block',
                        pading: '0px',
                        margin: '0px',
                    }}
                    help={input.error ? input.errorMessage : ''}
                    hasFeedback
                    validateStatus={input.error ? 'error' : input.value.length > 2 ? 'success' : ''}
                    >
                    <Input
                        onChange={handleChange}
                        placeholder="Enter your name" 
                        name="username"
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        htmlType="submit"
                        type="primary"
                        className="login-form-button"
                        style={{
                            width: '90px',
                            display: 'inline-block',
                            background:'#6FCF97',
                            color: '#fff',

                        }}
                        size="large"
                        onClick={handleSubmit}
                        disabled={input.error || input.value.length < 3 || props.isLoading}
                        >
                        Create
                    </Button>
                </Form.Item>
            </Input.Group>
        </Form>
    );
}

const mapStateToProps = (state) => {
    return {
        auth: state.user,
        isLoading: state.isLoading
    }
}

const LogIn = connect(mapStateToProps, { login })(FormUserName);

export default LogIn;