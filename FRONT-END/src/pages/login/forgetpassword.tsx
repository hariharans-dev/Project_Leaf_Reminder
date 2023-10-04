import Button from "../../components/Button";
import { useState } from "react";
import Inputtag from "../../components/Inputtag";
import axios, { AxiosResponse } from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./style/forget.css";

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
      <div className="center-box">
        <div className="forgetpassword">
          <div>
            <Inputtag
              theme="d-block mb-2"
              type="text"
              placeholder="password"
              content={(value: string) => {
                setforgetpassword(value);
              }}
            />
            <Inputtag
              theme="d-block"
              type="text"
              placeholder="re-enter password"
              content={(value: string) => {
                setreforgetpassword(value);
              }}
            />

            <div className="status text-danger">{forgetpassworderror}</div>
          </div>
          <Button
            theme="btn-primary mt-2 mb-2"
            content="change password"
            onclick={changepassword}
          />

          <Button
            theme="btn-secondary back"
            content="back"
            onclick={() => {
              setforgetpassworderror("");
              navigate("/forgetpassword/verifyotp?user=" + user);
            }}
          />
        </div>
      </div>
    </>
  );
}
