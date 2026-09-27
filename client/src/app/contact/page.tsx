import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import ContactBanner from "../components/contact-banner";
import ContactForm from "../components/contact-form";
export const metadata = {
  title: 'Contact SubHub247',
  description: 'Contact the SubHub247 support team.',
};

function Contact() {
  return (
    <> 
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
