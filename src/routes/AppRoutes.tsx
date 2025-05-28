import {BrowserRouter, Route, Routes} from "react-router-dom";
import WelcomePage from "../pages/WelcomePage.tsx";
import {LoginPage} from "../pages/LoginPage.tsx";
import {SignUpPage} from "../pages/SignUpPage.tsx";
import {MyAssetsPage} from "../pages/MyAssetsPage.tsx";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route path="/my-assets" element={<MyAssetsPage />} />
            </Routes>
        </BrowserRouter>
    )
}