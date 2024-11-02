
// import SEO from "../components/SEO";
import Footer from "../components/footer";
import SignUpPage from "../components/form-page/sign_up";
import Header from "../components/header";

function SignUp() {
  return (
    <>
       {/* <SEO
        title="Signup Page"
        description="Recharge your Data,Airtime,Tv Subscription,etc at Cheap,Affordable and Fast Rate"
        canonical="http://localhost:3000/sign_up"
      /> */}
    <Header />
      <SignUpPage />
      <Footer />
    </>
  );
}

export default SignUp;
