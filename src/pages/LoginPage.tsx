import {useNavigate} from "react-router-dom";
import LoginAndSignUpComponent from "../components/LoginAndSignUp/LoginAndSignUpComponent.tsx";

export function LoginPage() {
    const navigate = useNavigate();

    return <LoginAndSignUpComponent isLoginForm redirectNavigate={() => navigate("/sign-up")} />
}