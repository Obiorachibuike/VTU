'use client';

import Image from 'next/image'; // Import Next.js Image component
import Banner from './components/banner'; // Import Banner component
import Services from './components/services'; // Import Services component (corrected the typo)
import Footer from './components/footer'; // Import Footer component
import Header from './components/header'; // Import Header component
import Offer from './components/offer'; // Import Offer component (although not used in this code snippet)
import Reason from './components/reason'; // Import Reason component
import SEO from './components/SEO'; // Import SEO component
import { UserProvider } from './dashboard/Context/UserContext'; // Import UserProvider from UserContext
import { ThemeProvider } from './dashboard/Context/ThemeContext';

export default function Home() {
  return (
    // <UserProvider> 
   
    <UserProvider>
      <ThemeProvider>
    <>
      {/* <SEO
        title="Home Page"
        description="Recharge your Data, Airtime, TV Subscription, etc. at Cheap, Affordable and Fast Rate"
        canonical="http://localhost:3000/"
      /> */}
      <Header /> {/* Render the Header component */}
      <main>
        <Banner /> {/* Render the Banner component */}
        <div
          className="background"
          style={{
            backgroundColor: '#e8e3e3',
            paddingTop: '133px',
            paddingBottom: '133px',
          }}
        >
          <Services /> {/* Render the Services component */}
          <Reason /> {/* Render the Reason component */}
        </div>
      </main>
      <Footer /> {/* Render the Footer component */}
       </>
       </ThemeProvider>
       </UserProvider>
    // {/* </UserProvider> */}
  );
}
