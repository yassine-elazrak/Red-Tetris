import React, { useState } from "react";

import { Form, Input, Button} from "antd";


const FormUserName = () => {

    const [input, setInput] = useState({
        value: "",
        error: " "
    });

    const onChange = (e) => {
        // value(e.target.value);
        console.log(e.target.value);
        setInput({
            ...input,
            value: e.target.value,
        });
        console.log('value:' + input.value);
    }


    const onSubmit = (e) => {
        // e.preventDefault();
        console.log('value:' + input.value);
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
                initialValues: { username: input.value },
                
            }}
            onSubmit={onSubmit}
            // name="username"
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
                    // help={input.error}
                    hasFeedback
                    // validateStatus={input.error ? 'error' : 'success'}
                    rules={[{
                        required: true,
                        message: 'Please input your username!',
                    }]}
                    >
                    <Input
                        onChange={onChange}
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
                        // onClick={onSubmit}
                        >
                        Create
                    </Button>
                </Form.Item>
            </Input.Group>
        </Form>
    );
}

export default FormUserName;