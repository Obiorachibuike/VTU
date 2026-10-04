import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import ContactBanner from "../components/contact-banner";
import ContactForm from "../components/contact-form";
import SEO from "../components/SEO";

function Contact() {
  return (
    <> 
    <SEO
    title="Contact Page"
    description="Recharge your Data,Airtime,Tv Subscription,etc at Cheap,Affordable and Fast Rate"
    canonical="http://localhost:3000/contact"
  />
      <Header />
      <ContactBanner />
      <div className="background">
        <ContactForm />
      </div>
    <Footer />
    </>
  );
}

export default Contact;
