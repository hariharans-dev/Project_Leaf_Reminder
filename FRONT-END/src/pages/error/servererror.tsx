import { useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function Server_error() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [cookies, setCookie, removeCookie] = useCookies();

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
              navigate("/dashboard");
            } else {
              navigate("/");
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
      <h1>error code 404</h1>
    </>
  );
}
