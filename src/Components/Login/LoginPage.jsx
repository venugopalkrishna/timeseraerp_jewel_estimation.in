import { Button, Form, Input, message } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import textLogo from "../Assets/textLogo.png";
import logo from "../Assets/tlogo.png";
import jewelryLogo from "../Assets/jewelry-logo.jpg";
import jewelryLogo1 from "../Assets/jewelry-logo1.png";
import jewelLogo from "../Assets/jewel-log.jpg";
import timeseraLogo from "../Assets/timesers-logo.png";
import mainLogo from "../Assets/main-logo.jpg";
import backGroundImage from "../Assets/backgroundimage2.jpg";
import style from "./LoginPage.module.css";
import { CREATE_jwel } from "../Config/Config";
// import backgroundImage from "../assets/backgroundImage.png"; // Add this

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("tenantName")) {
      navigate("/home");
    } else {
      navigate("/");
    }
  }, [navigate]);

  const userAPI = async (name) => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableName?tableName=FIRM_CONFIGURE`,
        {
          headers: {
            tenantName: name,
          },
        }
      );

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        const imageUrls = data[0]?.EPASS1.split(",");
        localStorage.setItem("images", imageUrls);
        localStorage.setItem("userName", data[0]?.FIRMNAME);
        localStorage.setItem("city", data[0]?.CITY);
        localStorage.setItem("singleImage", data[0]?.EPASS2);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const userConditionAPI = async (values, name) => {
    const { username, password } = values;
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=LOGINUSER_PROFILE&where=USERNAME='${username}'`,
        {
          headers: {
            tenantName: name,
          },
        }
      );

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem("userType", data[0].USER_TYPE);
        localStorage.setItem("ipAddress", data[0].PRINTERIP);
        localStorage.setItem("printModel", data[0].PRINT_MODEL);
        localStorage.setItem("loginName", data[0].USERNAME);
        localStorage.setItem("wastMc", data[0].WAST_MC);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const onFinish = async (values) => {
    const { username, password } = values;
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Tenant/CheckValidTenant?userName=${username}&password=${password}`
      );

      if (response?.data) {
        localStorage.setItem("isLoggedIn", "true"); // Store login status
        localStorage.setItem("tenantName", response?.data);
        onLogin(response?.data);
        userAPI(response?.data);
        userConditionAPI(values, response?.data);
        navigate("/home");
      } else {
        message.error("Invalid username or password");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className={style.loginContainer}>
      <div className={style.backgroundImageContainer}>
        <img
          src={mainLogo}
          alt="Background"
          className={style.backgroundImage}
        />
        <div
          style={{
            zIndex: "999",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className={style.logoSection}>
            <img src={logo} alt="Logo" style={{ width: "35px" }} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <img
                src={timeseraLogo}
                alt="Text Logo"
                style={{ width: "150px" }}
              />
              <h3
                style={{
                  color: "rgb(176, 152, 64)",
                  fontSize: "10px",
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                Jewellery Estimation APP
              </h3>
            </div>
          </div>
          <h3
            style={{
              color: "#0C1E48",
              fontSize: "14px",
              fontWeight: 700,
              display: "flex",
              justifyContent: "center",
            }}
          >
            Login to your account
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "80px",
            }}
          >
            <Form
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              initialValues={{ remember: true }}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please enter your username" },
                ]}
              >
                <Input
                  placeholder="Enter your username"
                  className={style.inputField}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password
                  placeholder="Enter your password"
                  className={style.inputField1}
                />
              </Form.Item>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    // className={style.submitBtn}
                    style={{
                      backgroundColor: " #50bb8f",
                      color: "black",
                      border: "none",
                      borderRadius: "4px",
                      padding: "10px 20px",
                      fontSize: "16px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      // border: "2px solid #0C1E48",
                      height: "40px",
                      width: "100px",
                    }}
                  >
                    Submit
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </div>
      {/* <div className={style.loginBox}> */}
      {/* <div className={style.logoSection}>
        <img src={logo} alt="Logo" className={style.logoImage} />
        <img src={textLogo} alt="Text Logo" className={style.logoImage1} />
      </div>
      <h3>Login to your account</h3>

      <Form
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{ remember: true }}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please enter your username" }]}
        >
          <Input
            placeholder="Enter your username"
            className={style.inputField}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password
            placeholder="Enter your password"
            className={style.inputField}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className={style.submitBtn}>
            Submit
          </Button>
        </Form.Item>
      </Form> */}
      {/* </div> */}
    </div>
  );
};

export default LoginPage;
