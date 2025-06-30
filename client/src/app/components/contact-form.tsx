import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles/contact-form.css";
import { faMapMarkerAlt, faPhoneAlt, faEnvelope } from "@fortawesome/free-solid-svg-icons";

function ContactForm() {
  return (
    <div>
      <div className="container">
        <div className="content">
          <div className="left-side">
            <div className="address details">
              <FontAwesomeIcon className="fas fa-map-marker-alt icon" icon={faMapMarkerAlt} />
              <div className="topic">Address</div>
              <div className="text-one">Surkhet, NP12</div>
              <div className="text-two">Birendranagar 06</div>
            </div>
            <div className="phone details">
              <FontAwesomeIcon className="fas fa-phone-alt icon" icon={faPhoneAlt} />
              <div className="topic">Phone</div>
              <div className="text-one">+0098 9893 5647</div>
              <div className="text-two">+0096 3434 5678</div>
            </div>
            <div className="email details">
              <FontAwesomeIcon className="fas fa-envelope icon" icon={faEnvelope} />
              <div className="topic">Email</div>
              <div className="text-one">codinglab@gmail.com</div>
              <div className="text-two">info.codinglab@gmail.com</div>
            </div>
          </div>
          <div className="right-side">
            <div className="topic-text">Send us a message</div>
            <p>
              If you have any work from me or any types of queries related to my
              tutorial, you can send me message from here. It&apos;s my pleasure to
              help you.
            </p>
            <form action="#">
              <div className="input-box">
                <input type="text" placeholder="Enter your name" required />
              </div>
              <div className="input-box">
                <input type="email" placeholder="Enter your email" required />
              </div>
              <div className="input-box message-box">
                <textarea rows={5} placeholder="Enter your message" required></textarea>
              </div>
              <div className="contact-button">
                <input type="submit" value="Send Now" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;