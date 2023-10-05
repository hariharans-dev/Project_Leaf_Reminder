import { useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./style/servererror.css";
import logo_png from "../../assets/full logo.png";

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
      <div className="error-page">
        <div className="logo_png_frame">
          <img className="logo_png" src={logo_png} alt="logo" />
        </div>
        <div className="server-error d-flex justify-content-center align-items-center">
          <div className="">
            <div className="error-content d-flex justify-content-center align-items-center">
              ERROR
            </div>
            <div className="error-status-content d-flex justify-content-center align-items-center">
              404
            </div>
            <div className="content d-flex justify-content-center align-items-center">
              OOPS, SORRY WE COULDN'T FIND THE PAGE YOUR'E LOOKING FOR
            </div>
            <div className="content d-flex justify-content-center align-items-center">
              PLEASE, RETURN TO THE{" "}
              <button className="homepage btn" onClick={() => navigate("/")}>
                HOMEPAGE
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
