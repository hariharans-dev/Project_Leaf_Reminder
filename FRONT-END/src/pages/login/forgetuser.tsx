import Inputtag from "../../components/Inputtag";
import Button from "../../components/Button";
import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import "./style/forget.css";

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
      <div className="center-box">
        <div className="user">
          <div id="user_input">
            <Inputtag
              type="text"
              theme="d-block mt-2 mb-2"
              placeholder={"user"}
              content={(value: string) => {
                setuser(value);
              }}
            />
          </div>
          <div className="status text-danger">{forgetpassworderror}</div>

          <Button
            theme="btn-outline-danger mt-3 mb-2"
            content="generate otp"
            onclick={generate_otp}
          />

          <div className="back">
            <Button
              theme="btn-secondary d-block"
              content="back"
              onclick={() => {
                setforgetpassworderror("");
                navigate("/");
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
