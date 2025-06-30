import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import Faq from '../components/faq'
import FaqBanner from '../components/faq-banner'
// import SEO from '../components/SEO'

function FAQ() {
  return (
    <div>
       <Header />
        <FaqBanner />
        <Faq />
       <Footer />
    </div>
  )
}

export default FAQ