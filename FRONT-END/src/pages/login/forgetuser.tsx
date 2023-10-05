import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import "./style/forget_user.css";

import forget_user_img from "../../assets/forget-user.jpg";
import logo_png from "../../assets/logo.png";

export default function Forget_user() {
  var [user, setuser] = useState("");
  var [forgetpassworderror, setforgetpassworderror] = useState("");
  var [user, setuser] = useState("");

  const navigate = useNavigate();

  function validateemail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
  const generate_otp = () => {
    const data = { user: user };
    const url = "http://localhost:4000/user/sendotp";
    const headers = {
      "Content-Type": "application/json",
    };

    var accept = true;

    if (user === "") {
      setforgetpassworderror("field not given");
      accept = false;
    } else if (!validateemail(user)) {
      setforgetpassworderror("should be a valid email");
      accept = false;
    }
    if (accept) {
      try {
        axios
          .post(url, data, { headers })
          .then((response: AxiosResponse) => {
            console.log("Response:", response.data);
            if (response.data.status == 500) {
              navigate("/error");
            } else {
              const status = response.data.status;
              if (status == 200) {
                setforgetpassworderror("otp generated");
                navigate("/forgetpassword/verifyotp?user=" + user);
              } else {
                setforgetpassworderror(response.data.message);
              }
            }
          })
          .catch((error) => {
            if (error.response) {
              console.error(
                "Server Error:",
                error.response.status,
                error.response.data
              );
              navigate("/error");
            } else if (error.request) {
              navigate("/error");
              console.error("No Response:", error.request);
            } else {
              navigate("/error");
              console.error("Error:", error.message);
            }
          });
      } catch (error) {
        navigate("/error");
      }
    }
  };
  return (
    <>
      <div className="forget-user">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 col-md-6 left-box d-flex justify-content-center align-items-center">
              <div>
                <div className="welcome-content d-flex justify-content-center">
                  WELCOME TO LEAF REMINDER
                </div>
                <div className="coat-content d-flex justify-content-center">
                  WHERE CONVINENCE MEETS{" "}
                  <span className="green-text">GREEN</span>
                </div>
                <div className="round-img-frame d-flex justify-content-center">
                  <img
                    src={forget_user_img}
                    alt=""
                    className="round-img rounded-circle"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 right-box">
              <div className="d-flex flex-column">
                <div className="top d-flex justify-content-between">
                  <button
                    className="btn"
                    onClick={() => {
                      setforgetpassworderror("");
                      navigate("/");
                    }}
                  >
                    <span className="back-arrow material-symbols-outlined">
                      arrow_back
                    </span>
                  </button>
                  <img src={logo_png} alt="logo" className="logo-img" />
                </div>
                <div className="bottom d-flex justify-content-center align-items-center">
                  <div>
                    <div className="reset-content">RESET YOUR PASSWORD</div>
                    <div>
                      <div className="user d-flex flex-column">
                        <label className="label-text d-flex justify-content-between">
                          Enter the Username
                        </label>
                        <input
                          type="text"
                          className="input"
                          placeholder="ENTER USERNAME"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const value = e.target.value;
                            setuser(value);
                          }}
                        />
                      </div>
                      <div className="login-button d-flex justify-content-center">
                        <button
                          className="btn login-button"
                          onClick={generate_otp}
                        >
                          GENERATE OTP
                        </button>
                      </div>
                      <div className="d-flex justify-content-center m-3">
                        <p className="text-danger">{forgetpassworderror}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
