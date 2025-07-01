'use client';

import { ThemeProvider } from "./Context/ThemeContext";
import { UserProvider } from "./Context/UserContext";
import Main from "./dashboard_component/main";
import SideNav from "./dashboard_component/side_nav";
import Layout from "./Layout/Layout";
import "./styles/airtime.css";
// import SEO from "../components/SEO"; // Uncomment if SEO component is used

const DashBoard = () => {
  return (
    <>
      {/* Optional SEO */}
      {/* <SEO
        title="Dashboard Page"
        description="Recharge your Data, Airtime, TV Subscription, etc. at Cheap, Affordable, and Fast Rates"
        canonical="http://localhost:3000/dashboard"
      /> */}

      <ThemeProvider>
        <UserProvider>
          <Layout>
            <Main />
          </Layout>
        </UserProvider>
      </ThemeProvider>
    </>
  );
};

export default DashBoard;