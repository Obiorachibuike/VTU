import React from "react";
import SideNav from "../dashboard_component/side_nav";
import Top from "../dashboard_component/top";
import "../styles/airtime.css";
import AirtimeForm from "../dashboard_component/airtime_form";
import PaybillsForm from "../dashboard_component/pay_bills_form";
import Layout from "../Layout/Layout";
// import SEO from '@/app/components/SEO'
// import SEO from '@/app/components/SEO'

function page() {
  return (
    <div>
      {/* <SEO
        title="Pay_bills Page"
        description="Recharge your Data,Airtime,Tv Subscription,etc at Cheap,Affordable and Fast Rate"
        canonical="http://localhost:3000/dashboard/pay_bills"
      /> */}
      <Layout>
        <PaybillsForm />
      </Layout>
    </div>
  );
}

export default page;
