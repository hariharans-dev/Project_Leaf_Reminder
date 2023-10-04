import Login from "./pages/login/login";
import 'bootstrap/dist/css/bootstrap.css';
import Layout from "./pages/dashboard/layout";
import Home from "./pages/dashboard/home";
import Blogs from "./pages/dashboard/blog";
import Contact from "./pages/dashboard/contact";
import NoPage from "./pages/dashboard/nopage";
import Server_error from "./pages/error/servererror";
import Forget_user from "./pages/login/forgetuser";
import Forget_otp from "./pages/login/forgetotp";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Forgetpassword from "./pages/login/forgetpassword";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Login />} />
          </Route>
          <Route path="/forgetpassword/*">
            <Route path="forgetuser" element={<Forget_user />} />
            <Route path="verifyotp" element={<Forget_otp />} />
            <Route path="forgetpassword" element={<Forgetpassword />} />
          </Route>

          <Route path="/dashboard/*" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="blog" element={<Blogs />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NoPage />} />
          </Route>
          <Route path="/error" element={<Server_error />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
