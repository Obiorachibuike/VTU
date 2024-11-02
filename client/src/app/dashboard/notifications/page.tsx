import React from 'react'
import '../styles/airtime.css'
import NoficationPage from '../dashboard_component/nofication_page'
import SideNav from '../dashboard_component/side_nav'
import Top from '../dashboard_component/top'

function page() {
  return (
    <div>
    {/* <SEO
     title="Transactions Page"
     description="Recharge your Data,Airtime,Tv Subscription,etc at Cheap,Affordable and Fast Rate"
     canonical="http://localhost:3000/dashboard/transactions"
   /> */}
         <SideNav />
   <section className='dashboard'>
     <Top />
     <div className="airtime-container">
         <div className="airtime-cont">
             <div className="airtime-content">
           
                 <NoficationPage />
             </div>
         </div>
     </div>
   </section>
  {/* <TransactionDetails /> */}
 </div>
  )
}

export default page