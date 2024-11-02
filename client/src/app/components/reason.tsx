import Image from "next/image";
import "./styles/reason.css";

function Reason() {
  return (
    <>
      <div className="reason-container">
        <div className="reason-cont">
          <div className="reason-content">
            <h1 className="heading">Why Choose Us?</h1>
          </div>
          <div className="reason-hold">
            <div className="reason-offer">
              <div className="reason-image-cont">
                <Image src="/image/feature_icon_2.png" alt="" className="reason-image" width={50} height={50} />
              </div>
              <div className="deal">
                <div className="product-detail">
                  <h1 className="product">Premium Customer Support</h1>
                </div>
                <div className="reason-detail-cont">
                  <h2 className="reason-detail">
                    Our customer service is top notch,friendly,fast and
                    incomparable, Get accross to us through all available
                    channels provided in app
                  </h2>
                </div>
              </div>
            </div>
            <div className="reason-offer">
              <div className="reason-image-cont">
                <Image src="/image/feature_icon.png" alt="" className="reason-image" width={50} height={50} />
              </div>
              <div className="deal">
                <div className="product-detail">
                  <h1 className="product">Intant Topup</h1>
                </div>
                <div className="reason-detail-cont">
                  <h2 className="reason-detail">
                    We use cuttin-edge technology to run our services. Our
                    delivery and wallet funding are secured and automated
                  </h2>
                </div>
              </div>
            </div>
            <div className="reason-offer">
              <div className="reason-image-cont">
                <Image src="/image/icon3.png" alt="" className="offer-image"    width={50}
                        height={50}/>
              </div>
              <div className="deal">
                <div className="product-detail">
                  <h1 className="product">Versatility and Reliability</h1>
                </div>
                <div className="offer-detail-cont">
                  <h2 className="offer-detail">
                    Our platform is a fully optimized platform for reliability
                    and dependability. You get 100% value of any transaction you
                    perform
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>
    </>
  );
}

export default Reason;
