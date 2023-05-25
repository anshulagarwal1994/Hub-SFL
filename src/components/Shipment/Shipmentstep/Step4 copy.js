/*eslint-disable*/
import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

class Step4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      simpleSelect: "",
      desgin: false,
      code: false,
      develop: false,

      fullnameErr: false,
      usernameErr: false,
      emailErr: false,
      passwordErr: false,
      mobileErr: false,

      fullnameHelperText: "",
      usernameHelperText: "",
      emailHelperText: "",
      passwordHelperText: "",
      mobileHelperText: "",
      mobileLength: "",

      open: false,
      // passwordOpen:false,

      checkUserName: false,
      checkEmail: false,
      checkPassword: false,
      checkMobile: false,
      checkLetter: false,
      checkUpperCase: false,
      checkLowerCase: false,
      checkNumber: false,
      checkSpecialCharacter: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange = (event, type) => {
    if (type === "fullname") {
      let val = event.target.value;

      if (val === "" || val === null) {
        this.setState({
          fullnameErr: true,
          fullnameHelperText: "Please enter Full Name",
        });
      } else if (val.trim() !== val) {
        this.setState({
          fullnameErr: true,
          fullnameHelperText: "Please enter valid Full Name",
        });
      } else {
        this.setState({ fullnameErr: false, fullnameHelperText: "" });
      }
    } else if (type === "username") {
      this.setState({ checkUserName: true });
      let usernameVal = event.target.value;

      if (usernameVal === "" || usernameVal === null) {
        this.setState({
          usernameErr: true,
          open: true,
          usernameHelperText: "Please enter User Name",
        });
      } else if (usernameVal.trim() !== usernameVal) {
        this.setState({
          usernameErr: true,
          open: true,
          usernameHelperText: "Please enter valid User Name",
        });
      } else {
        this.setState({
          usernameErr: false,
          open: false,
          usernameHelperText: "",
        });
      }
    } else if (type === "email") {
      this.setState({ checkEmail: true });
      let emailVal = event.target.value;
      let regExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9-]+\.[A-Z]{2,6}$/gi;
      if (emailVal === "" || emailVal === null) {
        this.setState({
          emailErr: true,
          open: true,
          emailHelperText: "Please enter Email",
        });
      } else if (emailVal.trim() !== emailVal || !emailVal.match(regExp)) {
        this.setState({
          emailErr: true,
          open: true,
          emailHelperText: "Please enter valid Email",
        });
      } else {
        this.setState({ emailErr: false, open: false, emailHelperText: "" });
      }
    } else if (type === "mobile") {
      this.setState({ checkMobile: true });
      let mobileVal = event.target.value;
      let mobileLen = event.target.value.length;
      let regExp = /^[0-9]{10,15}$/;
      this.setState({ mobileLength: mobileLen });

      if (mobileVal === "" || mobileVal === null) {
        this.setState({
          mobileErr: true,
          open: true,
          mobileHelperText: "Please enter Mobile Number",
        });
      } else if (mobileVal.trim() !== mobileVal || !mobileVal.match(regExp)) {
        this.setState({
          mobileErr: true,
          open: true,
          mobileHelperText: "Please enter valid Mobile Number",
        });
      } else {
        this.setState({ mobileErr: false, open: false, mobileHelperText: "" });
      }
    } else if (type === "password") {
      this.setState({ checkPassword: true });
      let passwordVal = event.target.value;
      let passwordLen = event.target.value.length;
      let regExpNumber = /[0-9]/g;
      let regExpUpperCase = /[A-Z]/g;
      let regExpLowerCase = /[a-z]/g;
      let regExpSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/g;
      let regExp = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/;
      this.setState({ passwordLength: passwordLen });

      if (
        passwordVal === "" ||
        passwordVal === null ||
        passwordVal === undefined
      ) {
        this.setState({
          passwordErr: true,
          open: true,
          passwordHelperText: "Please enter password",
        });
      } else if (passwordVal) {
        if (passwordVal.match(regExpNumber)) {
          this.setState({ checkNumber: true });
        } else {
          this.setState({ checkNumber: false });
        }
        if (passwordVal.match(regExpUpperCase)) {
          this.setState({ checkUpperCase: true });
        } else {
          this.setState({ checkUpperCase: false });
        }
        if (passwordVal.match(regExpLowerCase)) {
          this.setState({ checkLowerCase: true });
        } else {
          this.setState({ checkLowerCase: false });
        }
        if (passwordVal.match(regExpSpecialCharacter)) {
          this.setState({ checkSpecialCharacter: true });
        } else {
          this.setState({ checkSpecialCharacter: false });
        }
      } else {
        this.setState({ passwordErr: false, passwordHelperText: "" });
      }
    }
  };

  render() {
    const { usernameErr } = this.state;
    const { emailErr } = this.state;
    const { mobileErr } = this.state;
    const { passwordErr } = this.state;
    const { checkPassword } = this.state;
    const { checkNumber } = this.state;
    const { checkUpperCase } = this.state;
    const { checkLowerCase } = this.state;
    const { checkSpecialCharacter } = this.state;

    return (
      <div>
        <GridContainer className="MuiGrid-justify-xs-center">
          <GridItem xs={12} sm={12} md={12}>
            <h3>Invoice</h3>
            <div className="package-table">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Value</th>
                    <th>Total</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Shipping</td>
                    <td className="text-align-right">1</td>
                    <td className="text-align-right">$25.00</td>
                    <td className="text-align-right">$25.00</td>
                    <td>Door to Door Shipping Charges</td>
                  </tr>
                  <tr>
                    <td>AWB Charges</td>
                    <td className="text-align-right">1</td>
                    <td className="text-align-right">$25.00</td>
                    <td className="text-align-right">$25.00</td>
                    <td>Air Way Bill Charges</td>
                  </tr>
                  <tr>
                    <td>Boxes</td>
                    <td className="text-align-right">1</td>
                    <td className="text-align-right">$25.00</td>
                    <td className="text-align-right">$25.00</td>
                    <td>18x18x24 DW Boxes</td>
                  </tr>
                  <tr>
                    <td>Total</td>
                    <td className="text-align-right"></td>
                    <td className="text-align-right"></td>
                    <td className="text-align-right">$75.00</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <h3>Payment Details</h3>
          </GridItem>
          <GridItem xs={12} sm={6} md={6}>
            <h4>Bank Detail</h4>
            <div className="package-table">
              <table>
                <thead>
                  <tr>
                    <td>Name of Bank Account</td>
                    <td>Parth Gohel</td>
                  </tr>
                  <tr>
                    <td>Bank Name</td>
                    <td>Chase Bank</td>
                  </tr>
                  <tr>
                    <td>Account Number</td>
                    <td>1234567890</td>
                  </tr>
                  <tr>
                    <td>Routing Number</td>
                    <td>111000614</td>
                  </tr>
                  <tr>
                    <td>Amount</td>
                    <td>$55.00</td>
                  </tr>
                </thead>
              </table>
            </div>
          </GridItem>
          <GridItem xs={12} sm={6} md={6}>
            <h4>Credit Card Detail</h4>
            <div className="package-table">
              <table>
                <thead>
                  <tr>
                    <td>Name on Card</td>
                    <td>Parth Gohel</td>
                  </tr>
                  <tr>
                    <td>Card Number</td>
                    <td>444555666777888</td>
                  </tr>
                  <tr>
                    <td>Exp Date</td>
                    <td>5-20</td>
                  </tr>
                  <tr>
                    <td>CVV Number</td>
                    <td>123</td>
                  </tr>
                  <tr>
                    <td>Billing Zip Code</td>
                    <td>75063</td>
                  </tr>
                  <tr>
                    <td>Amount</td>
                    <td>$55.00</td>
                  </tr>
                </thead>
              </table>
            </div>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <h3>Payables & Receivables</h3>
            <div className="package-table">
              <table>
                <thead>
                  <tr>
                    <th>Job Date</th>
                    <th>Account Type</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Invoice Number</th>
                    <th>Paid/Received Date</th>
                    <th>Amount</th>
                    <th>Updated By</th>
                  </tr>
                  <tr>
                    <td className="text-align-right">05-05-2019</td>
                    <td>Payable</td>
                    <td>FedEx</td>
                    <td>Shipping Charges</td>
                    <td>000006VF627509</td>
                    <td className="text-align-right">12-12-2019</td>
                    <td className="text-align-right">$45</td>
                    <td>Purveen S.</td>
                  </tr>
                </thead>
              </table>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles()(Step4);
