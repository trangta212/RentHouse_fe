import "./index.css";
import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
function SignUp() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    lastname: "",
    password: "",
    confirmPassword: "",
  });
  const [mailError, setMailError] = useState('');
  const [pass1Error, setPass1Error] = useState('');
  const [pass2Error, setPass2Error] = useState('');

  const validateEmail = (email) => {
    // Sử dụng biểu thức chính quy để kiểm tra định dạng email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const handleMailChange = (e) => {
      const email = e.target.value;
      setValues({...values, email});
      if (!validateEmail(email)) {
        setMailError('Invalid email');
      } else {
        setMailError('');
      }
    };
    const handlePassWordChange = (e) => {
      const password = e.target.value;
      setValues({ ...values,  password }); // Cập nhật trường password1
  
      const passwordRequirements = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,20}$/;
      if (!passwordRequirements.test(values.password1)) {
          setPass1Error('The password must contain at least one uppercase letter, one number, and one special character, and be between 6 and 20 characters long!');
          return;
      } else {
        setPass1Error(''); // Xóa thông báo lỗi nếu giống nhau
      } 
    };
  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setValues({ ...values,  confirmPassword }); // Cập nhật trường password2
    };
  const handleNameChange = (e) => {
      const lastname = e.target.value;
      setValues({ ...values, lastname }); // Cập nhật trường password2
      };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    if (values.password.length === 0) {
      setPass1Error('Please enter your password!'); // Thông báo lỗi nếu không nhập
      return;
    }   
    const passwordRequirements = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,20}$/;
    if (!passwordRequirements.test(values.password)) {
        setPass1Error('Passwords must contain at least 1 uppercase letter, 1 number, and 1 special character, and be between 6 and 20 characters!');
        return;
    } else {
      setPass1Error(''); // Xóa thông báo lỗi nếu giống nhau
    } 

    // Kiểm tra xem password1 và password2 có giống nhau không
    if (values.confirmPassword !== values.password) {
      setPass2Error('The password you reentered is incorrect'); // Thiết lập thông báo lỗi
      return;
    } else {
        setPass2Error(''); // Xóa thông báo lỗi nếu giống nhau
    }

    try {
      console.log(values.email);
      const response = await axios.post("http://localhost:8000/api/auth/register", {
        email: values.email,
        password: values.password,
        lastName: values.lastname,
        role: "user",
      });

      // Xử lý khi đăng nhập thành công
    if (response.status === 200) {
      toast.success(response.data.message);
      sessionStorage.setItem("authToken", response.data.token);
      //Xử lý token
      const parts = response.data.token.split('.'); // Tách token thành 3 phần
      const payload = parts[1];
      const decodedPayload = JSON.parse(atob(payload)); // Giải mã Base64
      
      sessionStorage.setItem("auth", JSON.stringify(decodedPayload));
      setTimeout(() => {
        navigate("/home");
      }, 3000);
    }
  } catch (error) {
    // Xử lý lỗi từ server
    console.log(error.response.data.error);
    toast.error(error.response.data.error)
  }
  };

  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState("horizontal");

  const onFormLayoutChange = ({ layout }) => {
    setFormLayout(layout);
  };

  return (
    <div className="signup">
      {/* Right side image */}
      <div className="right-element">
        <img
          src={require("../../../assets/images/signup.png")}
          alt="images"
          className="imagesland"
        />
      </div>
      <div className="left-element">
        <h1 className="title">CREATE AN ACCOUNT</h1>
        <Form
          layout={formLayout}
          form={form}
          initialValues={{
            layout: formLayout,
          }}
          onValuesChange={onFormLayoutChange}
          style={{
            maxWidth: formLayout === "inline" ? "none" : 500,
          }}
        >
          {/* Email */}
          <div className="input-group">
            <h4 className="form-input">Email Address</h4>
            <Form.Item
      name="email"
      rules={[
        {
          required: true,
          message: 'Vui lòng nhập email!',
        },
        {
          type: 'email',
          message: 'Email không hợp lệ!',
        },
        {
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex kiểm tra email hợp lệ
          message: 'Email phải có định dạng hợp lệ (vd: example@mail.com)',
        },
        {
          min: 6,
          message: 'Email phải có ít nhất 6 ký tự!',
        },
        {
          max: 50,
          message: 'Email không được dài quá 50 ký tự!',
        },
      ]}
      validateTrigger="onBlur" // Kiểm tra khi rời khỏi ô nhập
    >
      <Input placeholder="Enter your email" />
    </Form.Item>
          </div>

          {/* Password */}
          <div className="input-group">
            <h4 className="form-input">Full name</h4>
            <Form.Item>
              <Input
                placeholder="Enter your password"
                name="lastname"
                value={values.lastname}
                onChange={handleNameChange}
              />
            </Form.Item>
          </div>

          {/* Password */}
          <div className="input-group">
            <h4 className="form-input">Password</h4>
            <Form.Item>
              <Input
                placeholder="Create your password"
                name="password"
                value={values.password}
                onChange={handlePassWordChange}
              />
            </Form.Item>
          </div>
          <div className="explain-error">
              {pass1Error || <span>&nbsp;</span>} 
            </div>
          {/* Password */}
          <div className="input-group">
            <h4 className="form-input">Confirm Password</h4>
            <Form.Item>
              <Input
                placeholder="Create your password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </Form.Item>
          </div>
          <div className="explain-error">
              {pass2Error || <span>&nbsp;</span>} 
            </div>

          {/* Submit button */}
          <Form.Item>
            <Button type="primary" className="button2" onClick={handleSubmit}> 
              Sign up
            </Button>
          </Form.Item>

          {/* Sign up link */}
          <Form.Item>
            <p>
              Already have an account?
              <Link to="/login" style={{ color: "#3D9C38" }}>
                Login
              </Link>
            </p>
          </Form.Item>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default SignUp;
