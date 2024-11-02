// import SEO from "../components/SEO"
import { ThemeProvider } from "./Context/ThemeContext";
import { UserProvider } from "./Context/UserContext";
import Main from "./dashboard_component/main";
import SideNav from "./dashboard_component/side_nav";
import Layout from "./Layout/Layout";
import "./styles/airtime.css";

const DashBoard = () => {
  return (
    <>
      {/* <SEO
        title="Dashboard Page"
        description="Recharge your Data,Airtime,Tv Subscription,etc at Cheap,Affordable and Fast Rate"
        canonical="http://localhost:3000/dashboard"
      /> */}

      {/* <ThemeProvider> */}
    
    <Layout>
      {/* <UserProvider> */}
        <Main />
      {/* </UserProvider> */}
    </Layout>
      {/* </ThemeProvider> */}
    </>
  );
};

export default DashBoard;
