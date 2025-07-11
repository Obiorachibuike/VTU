import Image from "next/image";
import "./styles/banner.css";

function Banner() {
  return (
    <div>
      <div className="banner-container">
        <div className="banner-cont">
          <div className="banner-content">
            <div className="banner">
              <div className="overlay">
                <div className="banner-details">
                  <h1 className="heading">
                    Welcome To SubHub247 Inastant Topup Platform
                  </h1>
                  <div className="banner-detail-cont">
                    <div className="banner-detail-heading">
                      <h2 className="heading">Inastant Topup Platform</h2>
                    </div>
                    <div className="banner-detail-detail">
                      <p className="detail">
                        Buy Mobile Data, Airtime, Pay Electric Bill, TV
                        Subcription, Educational Payment, Print Recharge Card
                        &amp; Data Pin at a very high speed
                      </p>
                    </div>
                    <div className="buutton-cont">
                      <button
                        className="button"
                        style={{
                          marginTop: "30px",
                          width: "150px",
                          backgroundColor: "#228ec8",
                        }}
                      >
                        Let&apos;s Get Started
                      </button>
                    </div>
                  </div>
                </div>
                <div className="network-cont">
                  <div className="network-content">
                    <div className="network">
                      <Image
                        src="/image/mtn.jpg"
                        alt="MTN Logo"
                        className="mtn img"
                        width={50}
                        height={50}
                      />
                    </div>
                    <div className="network">
                      <Image
                        src="/image/glo.jpg"
                        alt="Glo Logo"
                        className="glo img"
                        width={50}
                        height={50}
                      />
                    </div>
                    <div className="network">
                      <Image
                        src="/image/airtel.jpg"
                        alt="Airtel Logo"
                        className="airtel img"
                        width={50}
                        height={50}
                      />
                    </div>
                    <div className="network">
                      <Image
                        src="/image/9mobile.jpg"
                        alt="9mobile Logo"
                        className="mobile img"
                        width={50}
                        height={50}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;