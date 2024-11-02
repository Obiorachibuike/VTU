import Link from "next/link"
import "./styles/footer.css"

function Footer() {
  return (
    <>
         <section className="footer">
      <div className="footer-row">
        <div className="footer-col">
          <h4>Info</h4>
          <ul className="links">
            <li><Link href="#">About Us</Link></li>
            <li><Link href="#">Compressions</Link></li>
            <li><Link href="#">Customers</Link></li>
            <li><Link href="#">Service</Link></li>
            <li><Link href="#">Collection</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <ul className="links">
            <li><Link href="#">Free Designs</Link></li>
            <li><Link href="#">Latest Designs</Link></li>
            <li><Link href="#">Themes</Link></li>
            <li><Link href="#">Popular Designs</Link></li>
            <li><Link href="#">Art Skills</Link></li>
            <li><Link href="#">New Uploads</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Legal</h4>
          <ul className="links">
            <li><Link href="#">Customer Agreement</Link></li>
            <li><Link href="#">Privacy Policy</Link></li>
            <li><Link href="#">GDPR</Link></li>
            <li><Link href="#">Security</Link></li>
            <li><Link href="#">Testimonials</Link></li>
            <li><Link href="#">Media Kit</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Newsletter</h4>
          <p>
            Subscribe to our newsletter for a weekly dose
            of news, updates, helpful tips, and
            exclusive offers.
          </p>
          <form action="#">
            <input type="email" placeholder="Your email" required />
            <button type="submit">SUBSCRIBE</button>
          </form>
          <div className="icons">
            <i className="fa-brands fa-facebook-f"></i>
            <i className="fa-brands fa-twitter"></i>
            <i className="fa-brands fa-linkedin"></i>
            <i className="fa-brands fa-github"></i>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default Footer