import Button from "./Button";
import { useEffect, useState } from "react";
import Inputtag from "./Inputtag";
import axios, { AxiosResponse } from "axios";
import "./style/login.css";

interface Props {
  login: () => void;
  forgetpassword: () => void;
  content: string;
  error: (value: boolean) => void;
}

function User_login({ login, forgetpassword, content, error }: Props) {
  var [servererror, setservererror] = useState(false);

  var [user, setuser] = useState("");
  var [password, setpassword] = useState("");

  var [status, setstatus] = useState(content);

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
              setservererror(true);
            } else {
              const status = response.data.status;
              if (status == 200) {
                setstatus("");
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
              setservererror(true);
            } else if (error.request) {
              setservererror(true);
              console.error("No Response:", error.request);
            } else {
              setservererror(true);
              console.error("Error:", error.message);
            }
          });
      } catch (error) {
        setservererror(true);
      }
    }
  };
  useEffect(() => {
    error(servererror);
  }, [servererror]);

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

          <Button theme="" content="forgetpassword" onclick={forgetpassword} />
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

export default User_login;
