import "./styles/about_banner.css"

function AboutBanner() {
  return (
    <>
      <div className="banner-container">
        <div className="banner-cont">
          <div className="banner-content">
            <div className="about-banner">
              <div className="about-overlay">
                <div className="banner-details">
                  <h1 className="heading">
                   ABOUT  <span>US</span>
                  </h1>
                  {/* <div className="banner-detail-cont">
                    <div className="banner-detail-heading">
                      <h2 className="heading">Inastant Topup Platform</h2>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutBanner;
