import {useNavigate} from "react-router-dom";
import LoginAndSignUpComponent from "../components/LoginAndSignUp/LoginAndSignUpComponent.tsx";
import {signUpAsync} from "../api/authApi.ts";
import type {ILoginAndSignUpForm, ISignUp} from "../types.ts";

export function SignUpPage() {
    const navigate = useNavigate();

    const onSignUp = async (e: ILoginAndSignUpForm) => {
        // Оновлено: тепер ми беремо всі дані з форми 'e'
        const data: ISignUp = {
            googleID: null,
            email: e.email,
            name: e.name,
            password: e.password,
            surname: e.surname,
            phoneNumber: e.phoneNumber,
            age: Number(e.age),
            role: 'User',
            adress: e.adress,
            country: e.country
        }

        try {
            const token = await signUpAsync(data);

            localStorage.setItem("token", "Bearer " + token);

            navigate("/tabs");
        } catch (error) {
            console.error("Sign up failed:", error);
        }
    }

    return <LoginAndSignUpComponent isLoginForm={false} redirectNavigate={() => navigate("/login")} onSubmit={onSignUp} />
}