// import React, { useState } from "react";
// import PropTypes from "prop-types";
// import { useNavigate } from "react-router-dom";
// import { Form, Input, Button, Typography, Alert } from "antd";
// import { loginUser, signUpUser } from "../service/authService.js";
// import styles from "../assets/style/Pages/Login.module.scss"; // Import SCSS file

// const { Title } = Typography;

// function Login({ setUser }) {
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   const handleSubmit = async (values) => {
//     const { email, password,name  } = values;
//     if (isSignUp) {
//       const { success, error } = await signUpUser(
//         email,
//         password,
//         name,
//         setSuccessMessage,
//         setError
//       );
//       if (!success) {
//         setError(error);
//       }
//     } else {
//       const { user, error } = await loginUser(
//         email,
//         password,
//         setUser,
//         setError,
//         navigate
//       );
//       if (!user) {
//         setError(error);
//       }
//     }
//   };

//   const forgetPassword = () => {
//     navigate("/forget-password");
//   };

//   const handleBlur = (field) => {
//     form.validateFields([field]);
//   };

//   return (
//     <div className={styles["login-container"]}>
//       <div className={styles["login-form"]}>
//         <div className={styles["header-form"]}>
//           <Title level={2} className={styles["title"]}>
//             {isSignUp ? "Sign Up" : "Login"}
//           </Title>
//           <img
//             src="/public/images/logo.jpg"
//             alt="logo"
//             className={styles["logo-header"]}
//           />
//         </div>
//         <Form
//           form={form}
//           onFinish={handleSubmit}
//         >
//           {isSignUp && (
//             <Form.Item
//               label="Name"
//               name="name"
//               rules={[{ required: true, message: "Please input your name!" }]}
//             >
//               <Input
//                 onBlur={() => handleBlur('name')}
//               />
//             </Form.Item>
//           )}
//           <Form.Item
//             label="Email"
//             name="email"
//             rules={[{ required: true, message: "Please input your email!" }]}
//           >
//             <Input
//               type="email"
//               onBlur={() => handleBlur('email')}
//             />
//           </Form.Item>
//           <Form.Item
//             label="Password"
//             name="password"
//             rules={[{ required: true, message: "Please input your password!" }]}
//           >
//             <Input.Password
//               onBlur={() => handleBlur('password')}
//             />
//           </Form.Item>
//           {error && <Alert message={error} type="error" showIcon />}
//           {successMessage && (
//             <div>
//               <Alert message={successMessage} type="success" showIcon />
//             </div>
//           )}
//           <Form.Item>
//             <Button
//               className={styles["btn-login"]}
//               type="primary"
//               htmlType="submit"
//               block
//             >
//               {isSignUp ? "Sign Up" : "Login"}
//             </Button>
//             <Button
//               type="link"
//               onClick={forgetPassword}
//               className={styles["link-forget"]}
//             >
//               Forgot Password
//             </Button>
//           </Form.Item>
//         </Form>
//         <Button
//           type="link"
//           className={styles["link-button"]}
//           onClick={() => setIsSignUp(!isSignUp)}
//           block
//         >
//           {isSignUp
//             ? "Already have an account? Login"
//             : "Need an account? Sign Up"}
//         </Button>
//       </div>
//     </div>
//   );
// }

// Login.propTypes = {
//   setUser: PropTypes.func.isRequired,
// };

// export default Login;
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Alert } from "antd";
import { loginUser, signUpUser } from "../service/authService.js";
import styles from "../assets/style/Pages/Login.module.scss"; // Import SCSS file

const { Title } = Typography;

function Login({ setUser }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  

  const handleSubmit = async (values) => {
    const { email, password, name } = values;
    if (isSignUp) {
      const { success, error } = await signUpUser(
        email,
        password,
        name,
        setSuccessMessage,
        setError
      );
      if (!success) {
        setError(error);
      }
    } else {
      const { user, error } = await loginUser(
        email,
        password,
        setUser,
        setError,
        navigate
      );
      if (!user) {
        setError(error);
      } else {
        localStorage.setItem("user", JSON.stringify(user)); // Save user data to local storage
        setUser(user); // Update state
        navigate(user.role === "admin" ? "/account-management" : "/employee");
      }
    }
  };

  const forgetPassword = () => {
    navigate("/forget-password");
  };

  const handleBlur = (field) => {
    form.validateFields([field]);
  };

  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-form"]}>
        <div className={styles["header-form"]}>
          <Title level={2} className={styles["title"]}>
            {isSignUp ? "Sign Up" : "Login"}
          </Title>
          <img
            src="/public/images/logo.jpg"
            alt="logo"
            className={styles["logo-header"]}
          />
        </div>
        <Form form={form} onFinish={handleSubmit}>
          {isSignUp && (
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input onBlur={() => handleBlur("name")} />
            </Form.Item>
          )}
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input type="email" onBlur={() => handleBlur("email")} />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password onBlur={() => handleBlur("password")} />
          </Form.Item>
          {error && <Alert message={error} type="error" showIcon />}
          {successMessage && (
            <div>
              <Alert message={successMessage} type="success" showIcon />
            </div>
          )}
          <Form.Item>
            <Button
              className={styles["btn-login"]}
              type="primary"
              htmlType="submit"
              block
            >
              {isSignUp ? "Sign Up" : "Login"}
            </Button>
            <Button
              type="link"
              onClick={forgetPassword}
              className={styles["link-forget"]}
            >
              Forgot Password
            </Button>
          </Form.Item>
        </Form>
        <Button
          type="link"
          className={styles["link-button"]}
          onClick={() => setIsSignUp(!isSignUp)}
          block
        >
          {isSignUp
            ? "Already have an account? Login"
            : "Need an account? Sign Up"}
        </Button>
      </div>
    </div>
  );
}

Login.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Login;
