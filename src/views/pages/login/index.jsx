import "./index.css";
import React, { useState } from "react";
import { Button, Form, Input } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

function Login() {
    const [form] = Form.useForm();
    const [formLayout, setFormLayout] = useState('horizontal');
    
    const onFormLayoutChange = ({ layout }) => {
      setFormLayout(layout);
    };
    
    return (
        <div className="login">
            <div className="left-element">
                <h1 className="title">WELCOME BACK</h1>
                <p className="sub-title">Welcome back! Please enter your details.</p>
                
                <Form
                    layout={formLayout}
                    form={form}
                    initialValues={{
                        layout: formLayout,
                    }}
                    onValuesChange={onFormLayoutChange}
                    style={{
                        maxWidth: formLayout === 'inline' ? 'none' : 500,
                    }}
                >
                    {/* Email */}
                    <div className="input-group">
                        <h4 className="form-input">Email</h4>
                        <Form.Item>
                            <Input placeholder="Enter your email" />
                        </Form.Item>
                    </div>

                    {/* Password */}
                    <div className="input-group">
                        <h4 className="form-input">Password</h4>
                        <Form.Item>
                            <Input placeholder="Enter your password" />
                        </Form.Item>
                    </div>

                    {/* Forgot password */}
                    <Form.Item>
                    <a href="https://example.com" target="_blank" rel="noopener noreferrer" className = "forgot-password">
                        Forgot the password?
                    </a>
                    </Form.Item>
                    {/* Submit button */}
                    <Form.Item>
                        <Button type="primary" className ="button2">Sign in</Button>
                    </Form.Item>

                    {/* Social sign-in */}
                    <Form.Item>
                        <Button className="social-button" >
                            <FontAwesomeIcon icon={faGoogle} />
                            Sign in with Google
                        </Button>
                    </Form.Item>
                    {/* Sign up link */}
                    <Form.Item>
                        Don't have an account? <a href="/signup"  style={{ color: '#3D9C38' }}>Sign up to free!</a>
                    </Form.Item>
                </Form>
            </div>

            {/* Right side image */}
            <div className="right-element">
                <img
                    src={require("../../../assets/images/login.png")}
                    alt="images"
                    className="imagesland"
                />
            </div>
        </div>
    );
}

export default Login;
