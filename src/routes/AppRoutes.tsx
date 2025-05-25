import {BrowserRouter, Route, Routes} from "react-router-dom";
import WelcomePage from "../pages/WelcomePage.tsx";
import {LoginPage} from "../pages/LoginPage.tsx";
import {SignUpPage} from "../pages/SignUpPage.tsx";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
            </Routes>
        </BrowserRouter>
    )
}