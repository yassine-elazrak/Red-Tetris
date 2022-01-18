import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Checkbox} from "antd";
import { connect } from "react-redux";
import { createRoom } from "../actions/room";


const FormRoomName = (props) => {
    const [input, setInput] = useState({
        value: "",
        error: false,
        errorMessage: "Please enter a valid room name at least 3 characters long"
    });

    const [checked, setChecked] = useState(false);

    const handleChange = (e) => {
        setInput({
            ...input,
            value: e.target.value,
            error: e.target.value.length < 3,
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: input.value,
            isPrivate: checked,
            user: props.user
        }
        // console.log(data);
        input.value.length > 2 ? setInput({
            ...input,
            error: false
        }) : setInput({
            ...input,
            error: true
        });
        if (input.value.length > 2 && !input.error) {
            props.createRoom(data);
        }
    }

    useEffect(() => {
        if (props.error){
            message.error(props.error);
        }
    }, [props.error]);


    
    return (
        <Form
        style={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        }}
        onSubmit={handleSubmit}
        >
            <Form.Item
                name="onlyOnePlayer"
                // valuePropName="checked"
                style={{
                    display: 'inline-block',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    
                }}
                >
                <Checkbox checked={checked} onChange={(e) => setChecked(!checked)}
                style={{
                    display: 'flex',
                    margin: 'auto',
                    width: 'calc(100% - 90px)',
                    maxWidth: '49vh',
                }}
                
                >Only One Player</Checkbox>
            </Form.Item>
        
        <Input.Group size="large"
            style={{
                display: 'flex',
                justifyContent: 'center',
                flex: '1',
            }}
            >

            <Form.Item
                name="roomname"
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
                    placeholder="Enter room name" 
                    name="roomname"
                />
            </Form.Item>
            <Form.Item>
                <Button loading={props.isLoading}
                    htmlType="submit"
                    type="primary"
                    className="login-form-button"
                    style={{
                        flex: '1',
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
        isLoading: state.room.isLoading,
        error: state.room.error,
        user: state.auth.user
    }
}

const RoomName = connect(mapStateToProps, {createRoom})(FormRoomName);

export default RoomName;