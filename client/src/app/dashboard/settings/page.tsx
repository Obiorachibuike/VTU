import React from "react";
import SideNav from "../dashboard_component/side_nav";
import Top from "../dashboard_component/top";
import Settings from "../dashboard_component/settings";
import Call from "../dashboard_component/call";
import "../styles/airtime.css";
import Layout from "../Layout/Layout";
// import SEO from "@/app/components/SEO";

function page() {
  return (
    <div>
         {/* <SEO
        title="Settings Page"
        description="Recharge your Data,Airtime,Tv Subscription,etc at Cheap,Affordable and Fast Rate"
        canonical="http://localhost:3000/dashboard/settings"
      /> */}
    <Layout >
    <div className="airtime-container">
          <div className="airtime-cont" style={{
            padding: 52 + "px",
          paddingTop: 90 + "px",
          }}>
            <div className="airtime-content">
            <div className="title-group mb-3">
        <h1 className="h2 mb-0">Settings</h1>
      </div>
              <div
                className="arrange"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                <Settings />
                <Call />
                {/* <TransactionDetails /> */}
              </div>
            </div>
          </div>
        </div>
    </Layout>
    </div>
  );
}

export default page;
