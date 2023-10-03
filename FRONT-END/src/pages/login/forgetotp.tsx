import Button from "../../components/Button";
import { useState } from "react";
import Inputtag from "../../components/Inputtag";
import axios, { AxiosResponse } from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./style/forget.css";

export default function Forget_otp() {
  var [otp, setotp] = useState("");
  var [forgetpassworderror, setforgetpassworderror] = useState("");
  const [searchParams] = useSearchParams();

  const user = searchParams.get("user") + "";

  const navigate = useNavigate();

  const validateotp = (input: string): boolean => {
    const sixDigitNumberPattern = /^\d{6}$/;
    return sixDigitNumberPattern.test(input);
  };
  const validateemail = (email: string): boolean => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };
  const resend_otp = () => {
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
                setforgetpassworderror("otp sent again");
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
  const verify_otp = () => {
    const data = { user: user, otp: otp };
    const url = "http://localhost:4000/user/verifyotp";
    const headers = {
      "Content-Type": "application/json",
    };

    var accept = true;
    if (otp === "") {
      setforgetpassworderror("field not given");
      accept = false;
    } else if (!validateotp(otp)) {
      setforgetpassworderror("otp should be a 6 digit number");
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
                setforgetpassworderror("");
                navigate(
                  "/forgetpassword/forgetpassword?forget_password_key=" +
                    response.data.forget_password_key +
                    "&user=" +
                    user
                );
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
        <div className="otp">
          <div>
            <Inputtag
              theme="d-block"
              type="text"
              placeholder="otp"
              content={(value: string) => {
                setotp(value);
              }}
            />
          </div>
          <div className="status text-danger">{forgetpassworderror}</div>

          <div>
            <Button
              theme="btn-outline-danger mt-3 mb-2"
              content="verify otp"
              onclick={verify_otp}
            />
          </div>
          <Button
            theme="btn-outline-danger mt-1 mb-2"
            content="resend otp"
            onclick={resend_otp}
          />

          <Button
            theme="btn-secondary back"
            content="back"
            onclick={() => {
              navigate("/forgetpassword/forgetuser");
            }}
          />
        </div>
      </div>
    </>
  );
}
