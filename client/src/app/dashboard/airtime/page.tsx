import React from 'react'
import AirtimeForm from '../dashboard_component/airtime_form'
import SideNav from '../dashboard_component/side_nav'
import Top from '../dashboard_component/top'
import '../styles/airtime.css'
import { UserProvider } from '../Context/UserContext'
// import SEO from '@/app/components/SEO'

function Airtime() {
  return (
    <>
       {/* <SEO
        title="Airtime Subscription Page"
        description="Recharge your Data,Airtime,Tv Subscription,etc at Cheap,Affordable and Fast Rate"
        canonical="http://localhost:3000/dashboard/airtime"
      /> */}
      <UserProvider >

      <SideNav />
      <section className='dashboard'>
        <Top />
        <div className="airtime-container">
            <div className="airtime-cont">
                <div className="airtime-content">
              
                    <AirtimeForm />
                </div>
            </div>
        </div>
      </section>
      </UserProvider>
    </>
  )
}

export default Airtime