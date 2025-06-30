import Link from "next/link";
import "./styles/faq.css";

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
                  {[
                    {
                      id: 1,
                      question: "How does the Wallet system work?",
                      answer: `As an End-user, you may load your wallet and subsequently buy airtime from the wallet balance for ease of planning and payment without activating your account. As a Reseller or Business you must activate your wallet to enable you earn commission on airtime, data sales and all of our products. To load your wallet, click Credit wallet from your dashboard, after that crediting your wallet, click on become a reseller then follow the simple steps. You can save your card on our fully secured and encrypted environment, so that you will not have to input your 16/19-digit PAN number for subsequent transactions.`,
                    },
                    {
                      id: 2,
                      question: "Are there minimum or maximum amounts that can be paid?",
                      answer: `The minimum wallet funding on VTU BIZ is N100 and a maximum limit as defined by each service. The maximum limits for Bill payments and fund transfers is as defined by your bank and can be adjusted by personal request to the bank.`,
                    },
                    {
                      id: 3,
                      question: "What types of cards can I use to make payment on VTU BIZ?",
                      answer: `You can make payment for all transaction types using Naira MasterCard, Visa or Verve card. The card can be a Debit/Pre-paid/Credit Card.`,
                    },
                    {
                      id: 4,
                      question: "Do I need any paperwork/documentation to register on VTU BIZ as End-user or Agent?",
                      answer: `No. You don&apos;t need any paper work to register as an End-User or Agent. All you need do is select which category of user you want to belong. All registration is done and completed once.`,
                    },
                    {
                      id: 5,
                      question: "How do I reset/change my password?",
                      answer: `Click on the &quot;Change password&quot; link on the home settings page and follow the instructions given.`,
                    },
                    {
                      id: 6,
                      question: "Why can&apos;t I log into my account?",
                      answer: `Check your internet connection; Check your E-mail and Password; Use &quot;Forgot Password&quot; if you cannot remember the previous one; If you still have trouble accessing your account, please `,
                      extra: (
                        <Link href="/contact">
                          Contact Us
                        </Link>
                      ),
                    },
                  ].map(({ id, question, answer, extra }) => (
                    <div className="card" key={id}>
                      <div className="card-header" id={`heading${id}`}>
                        <h5 className="mb-0">
                          <button
                            className="collapsed btn btn-link"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#faq${id}`}
                            aria-expanded="false"
                            aria-controls={`faq${id}`}
                          >
                            {question}
                          </button>
                        </h5>
                      </div>
                      <div
                        id={`faq${id}`}
                        className="collapse"
                        aria-labelledby={`heading${id}`}
                        data-bs-parent="#accordion"
                      >
                        <div className="card-body">
                          {answer} {extra}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center my-3 my-md-5">
              <p className="text-4 mb-3">
                Can&apos;t find what you&apos;re looking for? Our support team is here to help.
              </p>
              <Link href="/contact" className="btn btn-primary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Faq;