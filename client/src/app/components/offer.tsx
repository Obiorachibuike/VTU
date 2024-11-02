import "./styles/offer.css";
import Image from "next/image";

function Offer({ src, detail, product }:any) {
  return (
    <>
      <div className="offer-container">
        <div className="offer-cont">
          <div className="offer-content">
            <div className="offer-image-cont">
              <Image src={src} alt="" className="offer-image" width={300} height={300} />
            </div>
            <div className="deal">
            <div className="product-detail">
              <h1 className="product">{product}</h1>
            </div>
            <div className="offer-detail-cont">
              <h2 className="offer-detail">{detail}</h2>
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Offer;
