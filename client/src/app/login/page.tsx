
// import SEO from "../components/SEO";
import LoginFormPage from "../components/form-page/login_form_page";
import LoginForm from "../components/login-form";
import { UserProvider } from "../dashboard/Context/UserContext";


function Login() {
  return (
    <UserProvider>

    <>
     {/* <SEO
        title="Login Page"
        description="Recharge your Data,Airtime,Tv Subscription,etc at Cheap,Affordable and Fast Rate"
        canonical="http://localhost:3000/login"
        /> */}
    <LoginFormPage />
    </>
        </UserProvider>
  );
}

export default Login;
