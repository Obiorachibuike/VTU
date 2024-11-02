import React from 'react'
import SideNav from '../dashboard_component/side_nav'
import Top from '../dashboard_component/top'
import { ThemeProvider } from '../Context/ThemeContext'
import { UserProvider } from '../Context/UserContext'

function Layout({children}) {
  return (
    <>

   

            <SideNav />
            {/* <section className="dashboard" style={{ backgroundColor: "transparent" }}> */}
      <section className='dashboard'>
        <Top />
        <div className="airtime-container">
            <div className="airtime-cont">
                <div className="airtime-content">
              
                  {children}
                </div>
            </div>
        </div>
      {/* </section> */}
      </section>
    </>
  )
}

export default Layout