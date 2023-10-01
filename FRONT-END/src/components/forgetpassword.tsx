import Button from "./Button";
import { useState, useEffect } from "react";
import Inputtag from "./Inputtag";
import axios, { AxiosResponse } from "axios";
import "./style/forget.css";

interface Props {
  doneforgetpassword: (value: string) => void;
  error: (value: boolean) => void;
}

function Forgetpassword({ doneforgetpassword, error }: Props) {
  var [servererror, setservererror] = useState(false);
  var [forgetpassworderror, setforgetpassworderror] = useState("");

  var [user, setuser] = useState("");
  var [usertab, setusertab] = useState(true);

  var [otp, setotp] = useState("");
  var [otptab, setotptab] = useState(false);
  var [forget_key, set_forgetkey] = useState("");

  var [forgetpassword, setforgetpassword] = useState("");
  var [reforgetpassword, setreforgetpassword] = useState("");
  var [forgettab, setforgettab] = useState(false);

  useEffect(() => {
    error(servererror);
  }, [servererror]);

  const validatepassword = (password: string): boolean => {
    const PasswordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,15}$/;
    return PasswordPattern.test(password);
  };
  const validateotp = (input: string): boolean => {
    const sixDigitNumberPattern = /^\d{6}$/;
    return sixDigitNumberPattern.test(input);
  };
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
              setservererror(true);
            } else {
              const status = response.data.status;
              if (status == 200) {
                setforgetpassworderror("");
                setusertab(false);
                setotptab(true);
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
              setservererror(true);
            } else {
              const status = response.data.status;
              if (status == 200) {
                setforgetpassworderror("");
                set_forgetkey(response.data.forget_password_key);
                setotptab(false);
                setforgettab(true);
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
              setservererror(true);
            } else {
              const status = response.data.status;
              if (status == 200) {
                setotptab(false);
                setforgettab(false);
                setusertab(false);
                doneforgetpassword("password changed");
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
              setservererror(true);
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

  return (
    <>
      <div className="center-box">
        <div className="user">
          {usertab && (
            <div id="user_input">
              <Inputtag
                type="text"
                theme="d-block mt-2 mb-2"
                placeholder={"user"}
                value={user}
                content={(value: string) => {
                  setuser(value);
                }}
              />
            </div>
          )}
          {usertab && (
            <div className="status text-danger">{forgetpassworderror}</div>
          )}
          {usertab && (
            <Button
              theme="btn-outline-danger mt-3 mb-2"
              content="generate otp"
              onclick={generate_otp}
            />
          )}
          <div className="back">
            {usertab && (
              <Button
                theme="btn-secondary d-block"
                content="back"
                onclick={() => {
                  doneforgetpassword("");
                  setforgetpassworderror("");
                }}
              />
            )}
          </div>
        </div>
        <div className="otp">
          <div>
            {otptab && (
              <Inputtag
                theme="d-block"
                type="text"
                placeholder="otp"
                content={(value: string) => {
                  setotp(value);
                }}
              />
            )}
          </div>
          {otptab && (
            <div className="status text-danger">{forgetpassworderror}</div>
          )}
          <div>
            {otptab && (
              <Button
                theme="btn-outline-danger mt-3 mb-2"
                content="verify otp"
                onclick={verify_otp}
              />
            )}
          </div>
          {otptab && (
            <Button
              theme="btn-outline-danger mt-1 mb-2"
              content="resend otp"
              onclick={resend_otp}
            />
          )}
          {otptab && (
            <Button
              theme="btn-secondary back"
              content="back"
              onclick={() => {
                setotptab(false);
                setusertab(true);
                setforgetpassworderror("");
              }}
            />
          )}
        </div>
        <div className="forgetpassword">
          <div>
            {forgettab && (
              <Inputtag
                theme="d-block mb-2"
                type="text"
                placeholder="password"
                content={(value: string) => {
                  setforgetpassword(value);
                }}
              />
            )}
            {forgettab && (
              <Inputtag
                theme="d-block"
                type="text"
                placeholder="re-enter password"
                content={(value: string) => {
                  setreforgetpassword(value);
                }}
              />
            )}
            {forgettab && (
              <div className="status text-danger">{forgetpassworderror}</div>
            )}
          </div>
          {forgettab && (
            <Button
              theme="btn-primary mt-2 mb-2"
              content="change password"
              onclick={changepassword}
            />
          )}
          {forgettab && (
            <Button
              theme="btn-secondary back"
              content="back"
              onclick={() => {
                setotptab(true);
                setforgettab(false);
                setforgetpassworderror("");
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Forgetpassword;
