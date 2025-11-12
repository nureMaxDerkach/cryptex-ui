import {useNavigate} from "react-router-dom";
import LoginAndSignUpComponent from "../components/LoginAndSignUp/LoginAndSignUpComponent.tsx";
import type {ILogin, ILoginAndSignUpForm} from "../types.ts";
import {loginAsync} from "../api/authApi.ts";

export function LoginPage() {
    const navigate = useNavigate();

    const onLogin = async (e: ILoginAndSignUpForm) => {
        const data: ILogin = {
            email: e.email,
            password: e.password,
        }

        try {
            const token = await loginAsync(data);

            localStorage.setItem("token", "Bearer " + token);

            navigate("/tabs");
        } catch (error) {
            console.error("Login failed:", error);
        }
    }

    return <LoginAndSignUpComponent isLoginForm redirectNavigate={() => navigate("/sign-up")} onSubmit={onLogin} />
}