import Button from "../../components/Button";
import { useEffect, useState } from "react";
import Inputtag from "../../components/Inputtag";
import axios, { AxiosResponse } from "axios";
import { useCookies } from "react-cookie";
import "./style/login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  var [user, setuser] = useState("");
  var [password, setpassword] = useState("");
  var [status, setstatus] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();

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
      <div className="login-box">
        <div className="box">
          <Inputtag
            theme="d-block mt-2 mb-3"
            type="text"
            placeholder="user"
            content={(value: string) => {
              setuser(value);
            }}
          />
          <Inputtag
            theme="d-block mt-2 mb-3"
            type="text"
            placeholder="password"
            content={(value: string) => {
              setpassword(value);
            }}
          />

          <Button
            theme=""
            content="forgetpassword"
            onclick={() => {
              navigate("/forgetpassword");
            }}
          />
          <div className="login-btn">
            <Button
              theme="btn-outline-danger btn-lg"
              content="login"
              onclick={handlelogin}
            />
          </div>
          <h3>{status}</h3>
        </div>
      </div>
    </>
  );
}
