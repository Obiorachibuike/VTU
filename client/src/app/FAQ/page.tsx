import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import Faq from '../components/faq'
import FaqBanner from '../components/faq-banner'
// import SEO from '../components/SEO'

function FAQ() {
  return (
    <div>
{*
    //    <SEO
    //     title="FAQ Page"
    //     description="Recharge your Data,Airtime,Tv Subscription,etc at Cheap,Affordable and Fast Rate"
    //     canonical="http://localhost:3000/FAQ"
    //   />

*}
       <Header />
        <FaqBanner />
        <Faq />
       <Footer />
    </div>
  )
}

export default FAQ