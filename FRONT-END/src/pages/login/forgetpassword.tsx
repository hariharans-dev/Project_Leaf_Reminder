import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./style/forgetpassword.css";

import forget_password_img from "../../assets/forget_password_img.jpg";
import logo from "../../assets/logo.png";

export default function Forgetpassword() {
  var [forgetpassworderror, setforgetpassworderror] = useState("");

  var [forgetpassword, setforgetpassword] = useState("");
  var [reforgetpassword, setreforgetpassword] = useState("");

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const forget_key = searchParams.get("forget_password_key") + "";
  const user = searchParams.get("user") + "";

  const validatepassword = (password: string): boolean => {
    const PasswordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,15}$/;
    return PasswordPattern.test(password);
  };

  const changepassword = () => {
    const data = { forget_password_key: forget_key, password: forgetpassword };
    const url = "http://localhost:4000/user/forgetpassword";
    const headers = {
      "Content-Type": "application/json",
    };

    var accept = true;

    if (forgetpassword === "" || reforgetpassword === "") {
      setforgetpassworderror("field not given");
      accept = false;
    } else if (forgetpassword !== reforgetpassword) {
      setforgetpassworderror("both password does not match");
      accept = false;
    } else if (validatepassword(forgetpassword) == false) {
      setforgetpassworderror(
        "length: 10-15, at least one number, at least one special character (e.g., !, @, #, $, %, etc, no spaces), one uppercase"
      );
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
                navigate("/?status=password changed");
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
      <div className="otp">
        <div className="row">
          <div className="col-lg-6 col-md-6 left-box d-flex justify-content-center align-items-center">
            <div>
              <div className="welcome-content d-flex justify-content-center">
                WELCOME TO LEAF REMINDER
              </div>
              <div className="coat-content d-flex justify-content-center">
                WHERE CONVINENCE MEETS <span className="green-text">GREEN</span>
              </div>
              <div className="round-img-frame d-flex justify-content-center">
                <img
                  src={forget_password_img}
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
                    navigate("/forgetpassword/verifyotp?user=" + user);
                  }}
                >
                  <span className="back-arrow material-symbols-outlined">
                    arrow_back
                  </span>
                </button>
                <img src={logo} alt="logo" className="logo-img" />
              </div>
              <div className="bottom d-flex justify-content-center align-items-center">
                <div>
                  <div className="reset-content">RESET YOUR PASSWORD</div>
                  <div>
                    <div className="user1 d-flex flex-column">
                      <label className="label-text d-flex justify-content-between">
                        Enter the Password
                      </label>
                      <input
                        type="password"
                        className="input"
                        placeholder="ENTER YOUR PASSWORD"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value;
                          setforgetpassword(value);
                        }}
                      />
                    </div>
                    <div className="user2 d-flex flex-column">
                      <label className="label-text d-flex justify-content-between">
                        Re-Enter the Password
                      </label>
                      <input
                        type="password"
                        className="input"
                        placeholder="RE-ENTER YOUR PASSWORD"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value;
                          setreforgetpassword(value);
                        }}
                      />
                    </div>
                    <div className="login-button d-flex justify-content-center">
                      <button
                        className="btn login-button"
                        onClick={changepassword}
                      >
                        CHANGE PASSWORD
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
    </>
  );
}
