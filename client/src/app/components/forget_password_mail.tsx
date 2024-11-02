import "./styles/forget-password-mail.css";

function ForgetPasswordMail() {
  return (
    <>
      <div className="login-content">
        <form method="POST" className="form">
          <p className="message"></p>
          <div className="form-data">
            <h1 className="info">Verify your Email</h1>
            <p className="info-detail">
              We will send you a link to your Email to reset your password
            </p>
          </div>
          <div className="form-data">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="Input Your Email"
            />
          </div>
          <div className="button-cont">
            <button className="button">Send</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ForgetPasswordMail;
