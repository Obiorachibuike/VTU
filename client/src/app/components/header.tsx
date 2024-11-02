import Link from "next/link"
import "./styles/header.css"

function Header() {
  return (
    <>
           <section className="header">
      <div className="header-row">
        <div className="header-col">
        <div className="head-cont">
        <div className="logo-cont">
          <h1 className="logo">Sub<span>Hub</span>247</h1>
        </div>
        <div className="links-cont">
          <ul className="unlist">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About </Link></li>
            <li><Link href="/service">Service</Link></li>
            <li><Link href="/FAQ">FAQ</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            {/* <li><Link href="#">Collection</Link></li> */}
          </ul>
        </div>
        <div className="button-cont">
          <Link href="/login"><button className="button">Login</button></Link>
          <Link href="/sign_up"><button className="button">SignUp</button></Link>
        </div>
        </div>
        </div>

      

       

       
      </div>
    </section>
    </>
  )
}

export default Header