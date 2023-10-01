import "bootstrap/dist/css/bootstrap.min.css";
import User_login from "../components/user_login";
import { useEffect, useState } from "react";
import Forgetpassword from "../components/forgetpassword";
import Dashboard from "../components/dashboard";
import axios, { AxiosResponse } from "axios";

interface Props {
  error: (value: boolean) => void;
  loginauth: (value: boolean) => void;
}

function Login({ error, loginauth }: Props) {
  var [forgetpasswordcontent, setforgetpasswordcontent] = useState("");
  var [servererror, setservererror] = useState(false);

  var [login, setlogin] = useState(true);
  var [forgetpassword, setforgetpassword] = useState(false);
  var [dashboard, setdashboard] = useState(false);

  useEffect(() => {
    error(servererror);
  }, [servererror]);

  const onlogin = () => {
    setlogin(false);
    loginauth(true);
  };
  const onforgetpasswordclick = () => {
    setlogin(false);
    setforgetpassword(true);
  };
  const doneforgetpassword = (value: string) => {
    setforgetpasswordcontent(value);
    console.log("done forget password");
    setlogin(true);
    setforgetpassword(false);
  };
  const errorhandle = (error: boolean) => {
    setservererror(error);
  };

  // useEffect(() => {
  //   const data = {};
  //   const url = "http://localhost:4000/user/login-session";
  //   const headers = {
  //     "Content-Type": "application/json",
  //   };
  //   const axiosInstance = axios.create({
  //     withCredentials: true,
  //   });

  //   try {
  //     axiosInstance
  //       .post(url, data, { headers })
  //       .then((response: AxiosResponse) => {
  //         console.log("Response:", response.data);
  //         if (response.data.status == 500) {
  //           setservererror(true);
  //         } else {
  //           const status = response.data.status;
  //           if (
  //             status == 200 &&
  //             response.data.message === "session authenticated"
  //           ) {
  //             onlogin();
  //           }
  //         }
  //       })
  //       .catch((error) => {
  //         if (error.response) {
  //           console.error(
  //             "Server Error:",
  //             error.response.status,
  //             error.response.data
  //           );
  //           setservererror(true);
  //         } else if (error.request) {
  //           setservererror(true);
  //           console.error("No Response:", error.request);
  //         } else {
  //           setservererror(true);
  //           console.error("Error:", error.message);
  //         }
  //       });
  //   } catch (error) {
  //     setservererror(true);
  //   }
  // }, []);

  return (
    <>
      {login && (
        <User_login
          error={errorhandle}
          login={onlogin}
          content={forgetpasswordcontent}
          forgetpassword={onforgetpasswordclick}
        />
      )}
      {forgetpassword && (
        <Forgetpassword
          error={errorhandle}
          doneforgetpassword={doneforgetpassword}
        />
      )}
      {dashboard && <Dashboard />}
    </>
  );
}

export default Login;
