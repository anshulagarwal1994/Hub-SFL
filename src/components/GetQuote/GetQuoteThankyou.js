import React, { Component } from "react";

const tickIcon = require("../../assets/img/get-quote/success.svg");
const logoImage = require("../../assets/img/logo-new.svg");
const backIcon = require("../../assets/img/back-icon.svg");

class GetQuoteThankyou extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="get-quote-wrap">
        <div className="quote-header">
          <div className="container">
            <div className="header-inner">
              <div className="logo">
                <a href="https://www.sflworldwide.com/">
                  <img src={logoImage} alt="SFL Worldwide" />
                </a>
              </div>
              <div className="header-right">
                <a href="https://www.sflworldwide.com/">
                  <img src={backIcon} alt="Back" />
                  Back to Home
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="get-quote-success-outer">
          <div className="container">
            <div className="quote-success">
              <img src={tickIcon} alt="Success" />
              <h3>WONDERFUL! THANK YOU FOR SUBMITTING YOUR REQUEST.</h3>
              <p>
                One of our representatives will call you or email you shortly
                with pricing you will love!
              </p>

              <a
                className="next-btn"
                href="https://hubuat.sflworldwide.com/auth/get-quote"
              >
                Get a New Quote
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GetQuoteThankyou;
