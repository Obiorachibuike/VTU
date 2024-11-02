import React from 'react'
import SideNav from '../dashboard_component/side_nav'
import Top from '../dashboard_component/top'
import DataForm from '../dashboard_component/data_form'
import Layout from "../Layout/Layout"
import '../styles/airtime.css'
// import SEO from '@/app/components/SEO'

function Data() {
  return (
    <div>
         {/* <SEO
        title="Data Subcription Page"
        description="Recharge your Data,Airtime,Tv Subscription,etc at Cheap,Affordable and Fast Rate"
        canonical="http://localhost:3000/dashboard/data"
      /> */}
        <Layout >
              <DataForm />
        </Layout>
    </div>
  )
}

export default Data