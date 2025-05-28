import {useNavigate} from "react-router-dom";
import LoginAndSignUpComponent from "../components/LoginAndSignUp/LoginAndSignUpComponent.tsx";
import {signUpAsync} from "../api/authApi.ts";
import type {ILoginAndSignUpForm, ISignUp} from "../types.ts";

export function SignUpPage() {
    const navigate = useNavigate();

    const onSignUp = async (e: ILoginAndSignUpForm) => {
        const data: ISignUp = {
            googleID: null,
            email: e.email,
            name: e.name,
            password: e.password,
            surname: '',
            phoneNumber: '',
            age: 0,
            role: '0',
            adress: '',
            country: ''
        }

        const response = await signUpAsync(data);

        localStorage.setItem("token", JSON.stringify("Bearer" + " " + response));
        navigate("/my-assets");
    }

    return <LoginAndSignUpComponent isLoginForm={false} redirectNavigate={() => navigate("/login")} onSubmit={onSignUp} />
}