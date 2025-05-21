import {useNavigate} from "react-router-dom";
import LoginAndSignUpComponent from "../components/LoginAndSignUp/LoginAndSignUpComponent.tsx";

export function SignUpPage() {
    const navigate = useNavigate();

    return <LoginAndSignUpComponent isLoginForm={false} redirectNavigate={() => navigate("/login")} />
}