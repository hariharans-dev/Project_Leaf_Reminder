import "bootstrap/dist/css/bootstrap.css";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import Inputtag from "../../components/Inputtag";
import axios, { AxiosResponse } from "axios";
import { useCookies } from "react-cookie";
import { useNavigate, useSearchParams } from "react-router-dom";

import loginimage from "../../assets/login.jpg";
import logo from "../../assets/logo.jpg";
import "./style/login.css";
import Forgetpassword from "./forgetpassword";

export default function Login() {
  var [user, setuser] = useState("");
  var [password, setpassword] = useState("");
  var [status, setstatus] = useState("");

  const [cookies, setCookie, removeCookie] = useCookies();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const createcookie = (
    name: string,
    value: string,
    path: string,
    daysToExpire: number
  ) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + daysToExpire);

    console.log("cookie created");
    setCookie(name, value, { path: path, expires: expirationDate });
  };

  // const deletecookie=(name: string, path?: string) =>{
  //   console.log("cookie removed");
  //   removeCookie(name, { path: path });
  // }
  const login = () => {
    navigate("/dashboard");
  };

  const handlelogin = () => {
    const data = { user: user, password: password };
    const url = "http://localhost:4000/user/login";
    const headers = {
      "Content-Type": "application/json",
    };

    if (user === "" || password === "") {
      setstatus("field not given");
    } else {
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
                setstatus("");
                createcookie("session_id", response.data.session_id, "/", 1);
                console.log("cookie created");
                login();
              } else {
                setstatus(response.data.message);
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

  useEffect(() => {
    const content =
      searchParams.get("status") == null ? "" : searchParams.get("status");
    setstatus(content + "");
    const data = { session_id: cookies.session_id };
    console.log(data);
    const url = "http://localhost:4000/user/login-session";
    const headers = {
      "Content-Type": "application/json",
    };

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
              console.log("cookie login");
              login();
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
  }, []);

  return (
    <>
      <div className="login">
        <div className="container-fluid">
          <div className="row box">
            <div className="col-lg-6 col-md-6 d-flex justify-content-center align-items-center left-box">
              <div className="mt-3">
                <div className="welcome-content d-flex justify-content-center m-2">
                  WELCOME TO LEAF REMINDER
                </div>
                <div className="coat-content d-flex justify-content-center mt-2">
                  WHERE CONVINENCE MEETS
                  <span className="green-text">GREEN</span>
                </div>
                <div className="img-fluid d-flex justify-content-center login-img-frame">
                  <img
                    className="login-img rounded-circle"
                    src={loginimage}
                    alt="photo"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 d-flex justify-content-center align-items-center right-box">
              <div className="mt-3">
                <div className="mb-5 d-flex justify-content-center">
                  <img className="logo-img" src={logo} alt="logo" />
                </div>
                <div>
                  <div className="label-text d-flex flex-column">
                    <div>Enter Your Username</div>
                    <input
                      placeholder="ENTER YOUR USERNAME"
                      className="ipt p-2 pl-4 input"
                      type="text"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value;
                        setuser(value);
                      }}
                    />
                  </div>
                  <div className="label-text d-flex flex-column">
                    <div>Enter Your Password</div>
                    <input
                      placeholder="ENTER YOUR PASSWORD"
                      className="ipt p-2 pl-4 input"
                      type="password"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value;
                        setpassword(value);
                      }}
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      className="forgetpassword-text btn"
                      onClick={() => {
                        navigate("/forgetpassword/forgetuser");
                      }}
                    >
                      Forget Password?
                    </button>
                  </div>
                  <div className="d-flex justify-content-center">
                    <button
                      className="btn login-button w-100"
                      onClick={handlelogin}
                    >
                      LOGIN
                    </button>
                  </div>
                  <div className="d-flex justify-content-center m-1">
                    <p className="text-danger">{status}</p>
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
