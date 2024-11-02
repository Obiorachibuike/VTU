import React from 'react'
import TransactionDetails from '../dashboard_component/transaction_details'
import SideNav from '../dashboard_component/side_nav'
import Top from '../dashboard_component/top'
import '../styles/airtime.css'
import Layout from '../Layout/Layout'
// import SEO from '@/app/components/SEO'



function Transaction() {
  return (
    <div>
       {/* <SEO
        title="Transactions Page"
        description="Recharge your Data,Airtime,Tv Subscription,etc at Cheap,Affordable and Fast Rate"
        canonical="http://localhost:3000/dashboard/transactions"
      /> */}
        <Layout >
          <div className="transaction_details">

        <TransactionDetails />
          </div>
        </Layout>
     {/* <TransactionDetails /> */}
    </div>
  )
}

export default Transaction