import React, { useState } from "react";

import { Form, Input, Button} from "antd";


const FormUserName = () => {

    const [input, setInput] = useState({
        value: "",
        error: false
    });


    const handleChange = (e) => {
        setInput({
            value: e.target.value,
            error: false
        });
        console.log('value:' + input.value);
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        input.value.length > 0 ? setInput({
            ...input,
            error: false
        }) : setInput({
            ...input,
            error: true
        });
        console.log('value:' + input.error);
    }


   



    return (
        <Form
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // border: '1px solid red',
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
                    help={input.error ? 'Please input your username!' : ''}
                    hasFeedback
                    validateStatus={!input.error && input.value ? 'success' : input.error ? 'error' : ''}
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

                        }}
                        size="large"
                        color="#6FCF97"
                        onClick={handleSubmit}
                        >
                        Create
                    </Button>
                </Form.Item>
            </Input.Group>
        </Form>
    );
}

export default FormUserName;