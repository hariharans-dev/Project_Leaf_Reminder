import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../pages/layout";
import Home from "../pages/home";
import Blogs from "../pages/blog";
import Contact from "../pages/contact";
import NoPage from "../pages/nopage";

export default function Dashboard() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
