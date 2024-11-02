import React from 'react'
import SideNav from '../dashboard_component/side_nav'
import Top from '../dashboard_component/top'
import SubcriptionForm from '../dashboard_component/subcription_form'
import '../styles/airtime.css'
import Layout from '../Layout/Layout'
// import SEO from '@/app/components/SEO'

function page() {
  return (
    <div>
         {/* <SEO
        title="Subcription Page"
        description="Recharge your Data,Airtime,Tv Subscription,etc at Cheap,Affordable and Fast Rate"
        canonical="http://localhost:3000/dashboard/subscription"
      /> */}
      <Layout >
      <SubcriptionForm />
      </Layout>
    </div>
  )
}

export default page