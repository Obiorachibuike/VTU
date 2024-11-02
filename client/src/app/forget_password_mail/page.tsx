import React from 'react'
import ForgetPasswordMail from '../components/forget_password_mail'
// import SEO from '../components/SEO'

function ForgetPassword() {
  return (
    <div>
       {/* <SEO
        title="Forget_Password_Page Page"
        description="Recharge your Data,Airtime,Tv Subscription,etc at Cheap,Affordable and Fast Rate"
        canonical="http://localhost:3000/forget_password_mail"
      /> */}
          <div className="background" style={{width: 100 + "%", height: 635 + "px"}}>

        <ForgetPasswordMail />
          </div>
    </div>
    
  )
}

export default ForgetPassword