import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import ServiceBanner from '../components/service_banner'
// import SEO from '../components/SEO'

function Service() {
  return (
    <div>
       {/* <SEO
        title="Service Page"
        description="Recharge your Data,Airtime,Tv Subscription,etc at Cheap,Affordable and Fast Rate"
        canonical="http://localhost:3000/service"
      /> */}
       <Header />

        <ServiceBanner />
        <Footer />
    </div>
  )
}

export default Service