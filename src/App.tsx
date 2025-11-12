import AppRoutes from "./routes/AppRoutes.tsx";
import {FooterPage} from "./pages/FooterPage.tsx";
import {HeaderPage} from "./pages/Header.tsx";

function App() {
    return (
        <>
            <HeaderPage/>
            <AppRoutes/>
            <FooterPage/>
        </>
    )
}

export default App
