import Login from "./pages/login/login";
import Forgetpassword from "./pages/login/forgetpassword";
import Layout from "./pages/dashboard/layout";
import Home from "./pages/dashboard/home";
import Blogs from "./pages/dashboard/blog";
import Contact from "./pages/dashboard/contact";
import NoPage from "./pages/dashboard/nopage";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Server_error from "./pages/error/servererror";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Login />} />
            <Route path="/forgetpassword" element={<Forgetpassword />} />
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
