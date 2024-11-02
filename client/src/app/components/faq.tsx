import Link from "next/link";
import "./styles/faq.css"

function Faq() {
  return (
    <div>
      <div id="content">
        <div className="container">
          <div className="card p-4">
            <h3 className="text-6">
              <center>Get answers to your queries</center>
            </h3>
<hr />
            <div className="row align">
              <div className="col-md-3">
                <h3 className="text-5 font-weight-400">
                  Frequently Asked Questions
                </h3>
              </div>

              <div className="col-md-9">
                <div className="accordion accordion-alternate" id="accordion">
                  <div className="card">
                    <div className="card-header" id="heading1">
                      <h5 className="mb-0">
                        {" "}
                        <Link
                          href="#"
                          className="collapsed"
                          data-toggle="collapse"
                          data-target="#faq1"
                          aria-expanded="false"
                          aria-controls="faq1"
                        >
                          How does the Wallet system work?
                        </Link>{" "}
                      </h5>
                    </div>
                    <div
                      id="faq1"
                      className="collapse"
                      aria-labelledby="heading1"
                      data-parent="#accordion"
                    >
                      <div className="card-body">
                        {" "}
                        As an End-user, you may load your wallet and
                        subsequently buy airtime from the wallet balance for
                        ease of planning and payment without activating your
                        account. As a Reseller or Business you must activate
                        your wallet to enable you earn commission on airtime,
                        data sales and all of our products. To load your wallet,
                        click Credit wallet from your dashboard, after that
                        crediting your wallet, click on become a reseller then
                        follow the simple steps. You can save your card on our
                        fully secured and encrypted environment, so that you
                        will not have to input your 16/19-digit PAN number for
                        subsequent transactions.
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header" id="heading2">
                      <h5 className="mb-0">
                        {" "}
                        <Link
                          href="#"
                          className="collapsed"
                          data-toggle="collapse"
                          data-target="#faq2"
                          aria-expanded="false"
                          aria-controls="faq2"
                        >
                          Are there minimum or maximum amounts that can be paid?
                        </Link>{" "}
                      </h5>
                    </div>
                    <div
                      id="faq2"
                      className="collapse"
                      aria-labelledby="heading2"
                      data-parent="#accordion"
                    >
                      <div className="card-body">
                        {" "}
                        The minimum wallet funding on VTU BIZ is N100 and a
                        maximum limit as defined by each service. The maximum
                        limits for Bill payments and fund transfers is as
                        defined by your bank and can be adjusted by personal
                        request to the bank.{" "}
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header" id="heading3">
                      <h5 className="mb-0">
                        {" "}
                        <Link
                          href="#"
                          className="collapsed"
                          data-toggle="collapse"
                          data-target="#faq3"
                          aria-expanded="false"
                          aria-controls="faq3"
                        >
                          What types of cards can I use to make payment on VTU
                          BIZ?
                        </Link>{" "}
                      </h5>
                    </div>
                    <div
                      id="faq3"
                      className="collapse"
                      aria-labelledby="heading3"
                      data-parent="#accordion"
                    >
                      <div className="card-body">
                        {" "}
                        You can make payment for all transaction types using
                        Naira MasterCard, Visa or Verve card. The card can be a
                        Debit/Pre-paid/Credit Card.
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header" id="heading4">
                      <h5 className="mb-0">
                        {" "}
                        <Link
                          href="#"
                          className="collapsed"
                          data-toggle="collapse"
                          data-target="#faq4"
                          aria-expanded="false"
                          aria-controls="faq4"
                        >
                          Do I need any paperwork/documentation to register on
                          VTU BIZ as End-user or Agent?
                        </Link>{" "}
                      </h5>
                    </div>
                    <div
                      id="faq4"
                      className="collapse"
                      aria-labelledby="heading4"
                      data-parent="#accordion"
                    >
                      <div className="card-body">
                        {" "}
                        No. You don't need any paper work to register as an
                        End-User or Agent. All you need do is select which
                        category of user you want to belong. All registration is
                        done and completed once.{" "}
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header" id="heading5">
                      <h5 className="mb-0">
                        {" "}
                        <Link
                          href="#"
                          className="collapsed"
                          data-toggle="collapse"
                          data-target="#faq5"
                          aria-expanded="false"
                          aria-controls="faq5"
                        >
                          How do I reset/change my password?
                        </Link>{" "}
                      </h5>
                    </div>
                    <div
                      id="faq5"
                      className="collapse"
                      aria-labelledby="heading5"
                      data-parent="#accordion"
                    >
                      <div className="card-body">
                        {" "}
                        Click on the "Change password" link on the home settings
                        page and follow the instructions given.{" "}
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header" id="heading6">
                      <h5 className="mb-0">
                        {" "}
                        <Link
                          href="#"
                          className="collapsed"
                          data-toggle="collapse"
                          data-target="#faq6"
                          aria-expanded="false"
                          aria-controls="faq6"
                        >
                          Why can't I log into my account?{" "}
                        </Link>{" "}
                      </h5>
                    </div>
                    <div
                      id="faq6"
                      className="collapse"
                      aria-labelledby="heading6"
                      data-parent="#accordion"
                    >
                      <div className="card-body">
                        {" "}
                        Check your internet connection; Check your E-mail and
                        Password; Use "Forgot Password" if you cannot remember
                        the previous one; If you still have trouble accessing
                        your account, please{" "}
                        <Link href="contact-us.html">Contact Us</Link> for assistance
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
              <div className="text-center my-3 my-md-5">
                <p className="text-4 mb-3">
                  Can't find what you're looking for? Our support team are here
                  to help
                </p>
                <Link href="/contact" className="btn btn-primary">
                  Contact Us
                </Link>{" "}
              </div>
          
          </div>
        </div>
      </div>
    </div>
  );
}

export default Faq;
