import { Component } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import CreateService from "./services/createService";
import Services from "./services/services";
import Service from "./services/service";
import CreatePage from "./pages/createPage";
import Pages from "./pages/pages";
import Page from "./pages/page";
import Checkers from "./checkers/checkers";
import Checker from "./checkers/checker";

import "./common.scss";

class App extends Component {
    render() {
        return <BrowserRouter>
            <header>
                <Link to="/">Home</Link>
                <Link to="/services">Services</Link>
                <Link to="/pages">Pages</Link>
                <Link to="/checkers">Checkers</Link>
            </header>
            <main>
                <Routes>
                    <Route path="/" element={<div>Home</div>} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/create" element={<CreateService />} />
                    <Route path="/services/:serviceId" element={<Service />} />
                    <Route path="/pages" element={<Pages />} />
                    <Route path="/pages/create" element={<CreatePage />} />
                    <Route path="/pages/:pageId" element={<Page />} />
                    <Route path="/checkers" element={<Checkers />} />
                    <Route path="/checkers/:checkerId" element={<Checker />} />
                    <Route path="*" element={<div>This page does not exists</div>} />
                </Routes>
            </main>
        </BrowserRouter>;
    }
}

createRoot(document.getElementById("root")).render(<App />);
