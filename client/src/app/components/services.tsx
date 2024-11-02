import Offer from "./offer"
import "./styles/service.css"

function Services() {
  return (
    <>
        <div className="service-container">
            <div className="service-cont">
                <div className="service-content">
                    <div className="service-heading">
                        <h1 className="heading">Our Services</h1>
                    </div>
                    <div className="offer-details-cont">
                    <div className="offer-details">
                        <Offer src = "/image/data.png" detail = "Buy Data For All Network" product= "Mobile Data"/>
                        <Offer src = "/image/block1.png" detail = "Buy Airtime For All Network" product = "Airtime" />
                        <Offer src = "/image/data.png" detail = "Print Data Pin For All Network"  product = "Data Pin"/>
                        <Offer src = "/image/block1.png" detail = "Print Airtime Pin For All Network" product= "Airtime Pin" />
                       
                      
                    </div>
                    <div className="offer-details">
                        <Offer src = "/image/oxygen.jpeg" detail = "Buy Mega Data For All Network"  product= "Mega Data" />
                        <Offer src = "/image/DSTV.jpg" detail = "Recharge Your DSTV"  product= "DSTV Subscription"/>
                        <Offer src = "/image/GoTV.jpg" detail = "Recharge Your GOTV "  product= "GoTV Subscription"/>
                        <Offer src = "/image/startimes.jpeg" detail = "Recharge Your Startimes"  product= "Startime Subscrition" />
                       
                    </div>
                    <div className="offer-details">
                        <Offer src = "/image/data.png" detail = "Buy Data For All Network"  product= "Airtime Pin" />
                        <Offer src = "/image/data.png" detail = "Buy Data For All Network"  product= "Airtime Pin" />
                        <Offer src = "/image/data.png" detail = "Buy Data For All Network"  product= "Airtime Pin" />
                        <Offer src = "/image/data.png" detail = "Buy Data For All Network"  product= "Airtime Pin" />
                       
                    </div>
                </div>
            </div>
            </div>
        </div>
    </>
  )
}

export default Services