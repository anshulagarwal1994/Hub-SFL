import React, { Component } from "react";
import GridContainer from "components/Grid/GridContainer.js";
// import Icon from "@material-ui/core/Icon";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import moment from "moment";
import CustomInput from "components/CustomInput/CustomInput.js";
import User from "@material-ui/icons/AccountCircle";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import cogoToast from "cogo-toast";
import api from "../../utils/apiClient";
import { CommonConfig } from "../../utils/constant";
import BankDetails from "@material-ui/icons/AccountBalance";
import Radio from "@material-ui/core/Radio";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import SimpleBackdrop from "../../utils/general";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import thankyouIMG from "../../assets/img/thankyou.jpg";
var creditCardType = require("credit-card-type");
var valid = require("card-validator");

const classes = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing.unit / 2,
    top: theme.spacing.unit / 2,
    color: theme.palette.grey[500],
  },
}));
class confirmOnlinePayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ContactName: "",
      ContactNumber: "",
      EmailAddress: "",
      PaymentDate: "",
      PaymentStatus: "New",
      AccountNumber: "",
      PayOptionValue: "Credit Card",
      cardType: "",

      Month: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
        { value: "9", label: "9" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" },
      ],

      Year: [
        { value: "2020", label: "2020" },
        { value: "2021", label: "2021" },
        { value: "2022", label: "2022" },
        { value: "2023", label: "2023" },
        { value: "2024", label: "2024" },
        { value: "2025", label: "2025" },
        { value: "2026", label: "2026" },
        { value: "2027", label: "2027" },
        { value: "2028", label: "2028" },
        { value: "2029", label: "2029" },
        { value: "2030", label: "2030" },
      ],

      cardNumber: "",
      cardNumberErr: false,
      cardNumberHelperText: "",

      Cvv: "",
      cvvErr: false,
      cvvHelperText: "",

      BillingZipCode: "",
      BillingZipCodeErr: false,
      BillingZipCodeHelperText: "",

      NameOnBankAccount: "",
      NameOnBankAccountErr: false,
      NameOnBankAccountHelperText: "",

      BankName: "",
      BankNameErr: false,
      BanknameHelperText: "",

      BankAccountNumber: "",
      BankAccountNumberErr: false,
      BankAccountNumberHelperText: "",

      ConfirmBankAccountNumber: "",
      ConfirmBankAccountNumberErr: false,
      ConfirmBankAccountNumberHelperText: "",

      ABAroutingNumber: "",
      ABAroutingNumberErr: false,
      ABAroutingNumberHelperText: "",

      ConfirmABAroutingNumber: "",
      ConfirmABAroutingNumberErr: false,
      ConfirmABAroutingNumberHelperText: "",

      month_value: "",
      monthErr: false,
      monthHelperText: "",

      year_value: "",
      yearErr: false,
      yearHelperText: "",
      PaidList: [],
      TotalInvoiceAmount: 0,
      AccountLabel: "Tracking",
      Loading: false,
      IsAccountNumber: false,
      previousTab: "",
      IsSearchClicked: false,
    };
  }

  componentDidMount() {
    let paidArr = this.props.location.state.paidList;

    let totalInvoiceAmount = 0;
    for (let j = 0; j < paidArr.length; j++) {
      totalInvoiceAmount += paidArr[j]["Balance"];
    }
    this.setState({
      TotalInvoiceAmount: totalInvoiceAmount,
      previousTab: this.props.location.state
        ? this.props.location.state.currentTab
        : "",
      PaidList: paidArr,
    });
    this.getUserDetails();
  }

  getUserDetails() {
    let data = {
      UserID: CommonConfig.loggedInUserData().PersonID,
    };
    try {
      this.showLoader();
      api
        .post("userManagement/getUserDetails", data)
        .then((res) => {
          this.hideLoader();
          if (res.data.UserDetails.length > 0) {
            let userData = res.data.UserDetails[0];
            this.setState({
              ContactName: userData.ContactName,
              AccountNumber: userData.AccountNumber,
              IsAccountNumber: CommonConfig.isEmpty(userData.AccountNumber)
                ? false
                : true,
              AccountLabel: userData.AccountNumber ? "Account" : "Tracking",
            });
          }
          if (res.data.PhoneDetails.length > 0) {
            let phoneData = res.data.PhoneDetails[0];
            this.setState({
              ContactNumber: phoneData.PhoneNum,
              EmailAddress: phoneData.Email,
            });
          }
        })
        .catch((err) => {
          console.log("error....", err);
        });
    } catch (err) {
      console.log("error....", err);
    }
  }

  appendYears() {
    return this.state.Year.map((yy) => {
      return (
        <MenuItem classes={{ root: classes.selectMenuItem }} value={yy.value}>
          {" "}
          {yy.label}{" "}
        </MenuItem>
      );
    });
  }

  appendMonths() {
    return this.state.Month.map((mm) => {
      return (
        <MenuItem classes={{ root: classes.selectMenuItem }} value={mm.value}>
          {" "}
          {mm.label}{" "}
        </MenuItem>
      );
    });
  }

  handleBlur = (event, type) => {
    if (type === "cardnumber") {
      let cardNo = event.target.value.replace(/\D/g, "");
      let cardType = creditCardType(cardNo);

      if (CommonConfig.isEmpty(cardNo)) {
        this.setState({
          cardNumber: cardNo,
          cardNumberErr: true,
          cardNumberHelperText: "Please enter Card Number",
        });
      } else if (cardNo.length > 16) {
        this.setState({
          cardNumber: cardNo,
          cardNumberErr: true,
          cardNumberHelperText: "card number should be max 16 digit",
        });
      } else if (!valid.number(cardNo).isValid) {
        this.setState({
          cardNumber: cardNo,
          cardNumberErr: true,
          cardNumberHelperText: "Please enter valid Card Number",
        });
      } else {
        this.setState({
          cardNumber: cardNo,
          cardType:
            !CommonConfig.isEmpty(cardType) && cardType.length
              ? cardType[0].type
              : "",
          cardNumberErr: false,
          cardNumberHelperText: "",
        });
      }
    } else if (type === "nameoncard") {
      let cardName = event.target.value;

      if (CommonConfig.isEmpty(cardName)) {
        this.setState({
          cardName: cardName,
          cardNameErr: true,
          cardNameHelperText: "Please enter Card Name",
        });
      } else if (CommonConfig.RegExp.companyName.test(event.target.value)) {
        this.setState({
          cardName: cardName,
          cardNameErr: true,
          cardNameHelperText: "card name is not valid",
        });
      } else if (cardName.length > 54) {
        this.setState({
          cardName: cardName,
          cardNameErr: true,
          cardNameHelperText: "card name is should be max 54 characters",
        });
      } else {
        this.setState({
          cardName: cardName,
          cardNameErr: false,
          cardNameHelperText: "",
        });
      }
    } else if (type === "cvv") {
      let cvvNo = event.target.value;

      if (CommonConfig.isEmpty(cvvNo)) {
        this.setState({
          Cvv: cvvNo,
          cvvErr: true,
          cvvHelperText: "Please enter CVV",
        });
      } else if (!CommonConfig.RegExp.number.test(cvvNo)) {
        this.setState({
          Cvv: cvvNo,
          cvvErr: true,
          cvvHelperText: "cvv is not valid",
        });
      } else if (cvvNo.length > 3) {
        this.setState({
          Cvv: cvvNo,
          cvvErr: true,
          cvvHelperText: "cvv should be max 3 digit",
        });
      } else {
        this.setState({ Cvv: cvvNo, cvvErr: false, cvvHelperText: "" });
      }
    } else if (type === "billingzipcode") {
      let billingCode = event.target.value;

      if (CommonConfig.isEmpty(billingCode)) {
        this.setState({
          BillingZipCode: billingCode,
          BillingZipCodeErr: true,
          BillingZipCodeHelperText: "Please enter Billing ZipCode",
        });
      } else if (!CommonConfig.RegExp.number.test(billingCode)) {
        this.setState({
          BillingZipCode: billingCode,
          BillingZipCodeErr: true,
          BillingZipCodeHelperText: "Billing Zip Code is not valid",
        });
      } else if (billingCode.length > 5) {
        this.setState({
          BillingZipCode: billingCode,
          BillingZipCodeErr: true,
          BillingZipCodeHelperText: "Billing zip code should be max 5 digit",
        });
      } else {
        this.setState({
          BillingZipCode: billingCode,
          BillingZipCodeErr: false,
          BillingZipCodeHelperText: "",
        });
      }
    } else if (type === "nameonbankaccount") {
      let val = event.target.value;

      if (CommonConfig.isEmpty(val)) {
        this.setState({
          NameOnBankAccount: val,
          NameOnBankAccountErr: true,
          NameOnBankAccountHelperText: "Please enter Name ",
        });
      } else if (CommonConfig.RegExp.companyName.test(val)) {
        this.setState({
          NameOnBankAccount: val,
          NameOnBankAccountErr: true,
          NameOnBankAccountHelperText: "Account name is not valid",
        });
      } else if (val.length > 54) {
        this.setState({
          NameOnBankAccount: val,
          NameOnBankAccountErr: true,
          NameOnBankAccountHelperText:
            "Account name is should be max 54 characters",
        });
      } else {
        this.setState({
          NameOnBankAccount: val,
          NameOnBankAccountErr: false,
          NameOnBankAccountHelperText: "",
        });
      }
    } else if (type === "bankname") {
      let val = event.target.value;

      if (CommonConfig.isEmpty(val)) {
        this.setState({
          BankName: val,
          BankNameErr: true,
          BanknameHelperText: "Please enter Bank Name ",
        });
      } else if (val.length > 54) {
        this.setState({
          BankName: val,
          BankNameErr: true,
          BanknameHelperText: "Bank name is should be max 54 characters",
        });
      } else {
        this.setState({
          BankName: val,
          BankNameErr: false,
          BanknameHelperText: "",
        });
      }
    } else if (type === "accountnumber") {
      let val = event.target.value;

      if (CommonConfig.isEmpty(val)) {
        this.setState({
          BankAccountNumber: val,
          BankAccountNumberErr: true,
          BankAccountNumberHelperText: "Please enter Account Number ",
        });
      } else if (!CommonConfig.RegExp.number.test(val)) {
        this.setState({
          BankAccountNumber: val,
          BankAccountNumberErr: true,
          BankAccountNumberHelperText: "Account Number is not valid",
        });
      } else if (val.length > 16) {
        this.setState({
          BankAccountNumber: val,
          BankAccountNumberErr: true,
          BankAccountNumberHelperText:
            "Account Number is should be max 16 characters",
        });
      } else {
        this.setState({
          BankAccountNumber: val,
          BankAccountNumberErr: false,
          BankAccountNumberHelperText: "",
        });
      }
    } else if (type === "confirmaccountnumber") {
      let val = event.target.value;

      if (CommonConfig.isEmpty(val)) {
        this.setState({
          ConfirmBankAccountNumber: val,
          ConfirmBankAccountNumberErr: true,
          ConfirmBankAccountNumberHelperText: "Please enter Account Number ",
        });
      } else if (val.length > 16) {
        this.setState({
          ConfirmBankAccountNumber: val,
          ConfirmBankAccountNumberErr: true,
          ConfirmBankAccountNumberHelperText:
            "Account Number is should be max 16 characters",
        });
      } else if (!CommonConfig.RegExp.number.test(val)) {
        this.setState({
          ConfirmBankAccountNumber: val,
          ConfirmBankAccountNumberErr: true,
          ConfirmBankAccountNumberHelperText: "Account Number is not valid",
        });
      } else {
        if (this.state.BankAccountNumber !== val) {
          cogoToast.error("Account number does not match");
        } else {
          this.setState({
            ConfirmBankAccountNumber: val,
            ConfirmBankAccountNumberErr: false,
            ConfirmBankAccountNumberHelperText: "",
          });
        }
      }
    } else if (type === "abaroutingnumber") {
      let val = event.target.value;

      if (CommonConfig.isEmpty(val)) {
        this.setState({
          ABAroutingNumber: val,
          ABAroutingNumberErr: true,
          ABAroutingNumberHelperText: "Please enter Routing number",
        });
      } else if (val.length > 54) {
        this.setState({
          ABAroutingNumber: val,
          ABAroutingNumberErr: true,
          ABAroutingNumberHelperText:
            "ABARouting Number is should be max 54 characters",
        });
      } else if (!CommonConfig.RegExp.number.test(val)) {
        this.setState({
          ABAroutingNumber: val,
          ABAroutingNumberErr: true,
          ABAroutingNumberHelperText: "ABARouting Number is not valid",
        });
      } else {
        this.setState({
          ABAroutingNumber: val,
          ABAroutingNumberErr: false,
          ABAroutingNumberHelperText: "",
        });
      }
    } else if (type === "cabaroutingnumber") {
      let val = event.target.value;

      if (CommonConfig.isEmpty(val)) {
        this.setState({
          ConfirmABAroutingNumber: val,
          ConfirmABAroutingNumberErr: true,
          ConfirmABAroutingNumberHelperText: "Please enter Routing number",
        });
      } else if (val.length > 54) {
        this.setState({
          ConfirmABAroutingNumber: val,
          ConfirmABAroutingNumberErr: true,
          ConfirmABAroutingNumberHelperText:
            "ABARouting Number is should be max 54 characters",
        });
      } else if (!CommonConfig.RegExp.number.test(val)) {
        this.setState({
          ConfirmABAroutingNumber: val,
          ConfirmABAroutingNumberErr: true,
          ConfirmABAroutingNumberHelperText: "ABARouting Number is not valid",
        });
      } else {
        if (this.state.ABAroutingNumber !== val) {
          cogoToast.error("Routing number does not match");
        } else {
          this.setState({
            ConfirmABAroutingNumber: val,
            ConfirmABAroutingNumberErr: false,
            ConfirmABAroutingNumberHelperText: "",
          });
        }
      }
    }
  };

  changemonth = (event) => {
    if (CommonConfig.isEmpty(event.target.value)) {
      this.setState({ monthErr: true, monthHelperText: "Please select Month" });
    } else {
      this.setState({ month_value: event.target.value });
    }
  };

  changeyear = (event) => {
    if (CommonConfig.isEmpty(event.target.value)) {
      this.setState({ yearErr: true, yearHelperText: "Please select Year" });
    } else {
      this.setState({ year_value: event.target.value });
    }
  };

  async validate() {
    let IsFormValid = true;
    if (this.state.PayOptionValue === "Credit Card") {
      if (CommonConfig.isEmpty(this.state.cardNumber)) {
        IsFormValid = false;
        this.setState({
          cardNumberErr: true,
          cardNumberHelperText: "Please enter card number",
        });
      }
      if (this.state.cardNumberErr) {
        IsFormValid = false;
        this.setState({
          cardNumberErr: true,
          cardNumberHelperText: "Please enter valid card number",
        });
      }
      if (CommonConfig.isEmpty(this.state.cardName)) {
        IsFormValid = false;
        this.setState({
          cardNameErr: true,
          cardNameHelperText: "Please enter card name",
        });
      }
      if (CommonConfig.isEmpty(this.state.Cvv)) {
        IsFormValid = false;
        this.setState({ cvvErr: true, cvvHelperText: "Please enter cvv" });
      }
      if (CommonConfig.isEmpty(this.state.BillingZipCode)) {
        IsFormValid = false;
        this.setState({
          BillingZipCodeErr: true,
          BillingZipCodeHelperText: "Please enter billingzipcode",
        });
      }
      if (IsFormValid) {
        let authorizeRes = await this.authorizeCard();
        if (!authorizeRes) {
          IsFormValid = false;
          this.setState({
            cardNumberErr: true,
            cardNumberHelperText:
              "Transaction Declined – Credit Card information was invalid",
          });
        }
      }
    }
    if (this.state.PayOptionValue === "Bank") {
      if (CommonConfig.isEmpty(this.state.NameOnBankAccount)) {
        IsFormValid = false;
        this.setState({
          NameOnBankAccountErr: true,
          NameOnBankAccountHelperText: "Please enter account name",
        });
      }
      if (CommonConfig.isEmpty(this.state.BankName)) {
        IsFormValid = false;
        this.setState({
          BankNameErr: true,
          BanknameHelperText: "Please enter bank name",
        });
      }
      if (CommonConfig.isEmpty(this.state.BankAccountNumber)) {
        IsFormValid = false;
        this.setState({
          BankAccountNumberErr: true,
          BankAccountNumberHelperText: "Please enter account no",
        });
      }
      if (CommonConfig.isEmpty(this.state.ConfirmBankAccountNumber)) {
        IsFormValid = false;
        this.setState({
          ConfirmBankAccountNumberErr: true,
          ConfirmBankAccountNumberHelperText: "Please enter same account no",
        });
      }
      if (CommonConfig.isEmpty(this.state.ABAroutingNumber)) {
        IsFormValid = false;
        this.setState({
          ABAroutingNumberErr: true,
          ABAroutingNumberHelperText: "Please enter routing no",
        });
      }
      if (CommonConfig.isEmpty(this.state.ConfirmABAroutingNumber)) {
        IsFormValid = false;
        this.setState({
          ConfirmABAroutingNumberErr: true,
          ConfirmABAroutingNumberHelperText: "Please enter same routing no",
        });
      }
    }
    return IsFormValid;
  }

  authorizeCard = async () => {
    let validCard = true;
    let data = {
      CardNumber: this.state.cardNumber,
      ExpiryDate:
        (Number(this.state.month_value) <= 9
          ? "0" + this.state.month_value
          : this.state.month_value) + this.state.year_value.substring(2, 4),
      CardCVV: this.state.Cvv,
      FromObj: {
        FirstName: "",
        LastName: "",
        CompanyName: "",
        Address: "3364,Garden Brook View",
        City: "",
        State: "",
        ZipCode: "75234",
        Country: "",
      },
      ToObj: {
        FirstName: "",
        LastName: "",
        CompanyName: "",
        Address: "",
        City: "",
        State: "",
        ZipCode: "",
        Country: "",
      },
    };
    let cardResponse = await api.post("authorizeNet/validateCreditCard", data);
    if (!cardResponse.data.IsCardValid) {
      validCard = false;
    }
    return await validCard;
  };

  viewCreditCardDetails = () => {
    return (
      <GridItem xs={12} sm={12} md={12}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <FormControl className="mb-0" fullWidth>
              <CustomInput
                labelText="Name on card"
                id="nameoncard"
                error={this.state.cardNameErr}
                helperText={this.state.cardNameHelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: this.state.cardName,
                  onChange: (event) => this.handleBlur(event, "nameoncard"),
                  onBlur: (event) => this.handleBlur(event, "nameoncard"),
                  onFocus: () =>
                    this.setState({
                      cardNameErr: false,
                      cardNameHelperText: "",
                    }),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      className={classes.inputAdornment}
                    >
                      <Icon className="requiredicon">credit_card</Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <FormControl className="mb-0" fullWidth>
              <CustomInput
                labelText="Card Number"
                id="cardnumber"
                error={this.state.cardNumberErr}
                helperText={this.state.cardNumberHelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: this.state.cardNumber,
                  onChange: (event) => this.handleBlur(event, "cardnumber"),
                  onBlur: (event) => this.handleBlur(event, "cardnumber"),
                  onFocus: () =>
                    this.setState({
                      cardNumberErr: false,
                      cardNumberHelperText: "",
                    }),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      className={classes.inputAdornment}
                    >
                      <Icon className="requiredicon">credit_card</Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <div className="select-spl">
              <FormControl fullWidth error={this.state.monthErr}>
                <InputLabel className={classes.selectLabel}>Month</InputLabel>
                <Select
                  value={this.state.month_value}
                  onChange={(event) => this.changemonth(event)}
                  onFocus={() =>
                    this.setState({ monthErr: false, monthHelperText: "" })
                  }
                >
                  {this.appendMonths()}
                </Select>
                <FormHelperText>{this.state.monthHelperText}</FormHelperText>
              </FormControl>
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <div className="select-spl">
              <FormControl fullWidth error={this.state.yearErr}>
                <InputLabel className={classes.selectLabel}>Year</InputLabel>
                <Select
                  value={this.state.year_value}
                  onChange={(event) => this.changeyear(event)}
                  onFocus={() =>
                    this.setState({ yearErr: false, yearHelperText: "" })
                  }
                >
                  {this.appendYears()}
                </Select>
                <FormHelperText>{this.state.yearHelperText}</FormHelperText>
              </FormControl>
            </div>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <CustomInput
              labelText="CVV Code"
              id="cvv"
              error={this.state.cvvErr}
              helperText={this.state.cvvHelperText}
              formControlProps={{ fullWidth: true }}
              inputProps={{
                value: this.state.Cvv,
                onBlur: (event) => this.handleBlur(event, "cvv"),
                onChange: (event) => this.handleBlur(event, "cvv"),
                onFocus: () =>
                  this.setState({ cvvErr: false, cvvHelperText: "" }),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className="requiredicon">lock</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <CustomInput
              labelText="Billing Zip Code"
              id="billingzipcode"
              error={this.state.BillingZipCodeErr}
              helperText={this.state.BillingZipCodeHelperText}
              formControlProps={{ fullWidth: true }}
              inputProps={{
                value: this.state.BillingZipCode,
                onBlur: (event) => this.handleBlur(event, "billingzipcode"),
                onChange: (event) => this.handleBlur(event, "billingzipcode"),
                onFocus: () =>
                  this.setState({
                    BillingZipCodeErr: false,
                    BillingZipCodeHelperText: "",
                  }),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className="requiredicon">drafts</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
        </GridContainer>
      </GridItem>
    );
  };

  viewBankDetails = () => {
    return (
      <GridItem xs={12} sm={12} md={12} className="payment-secion-main-outer">
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <CustomInput
              labelText="Name On Bank Account"
              id="nameonbankaccount"
              error={this.state.NameOnBankAccountErr}
              helperText={this.state.NameOnBankAccountHelperText}
              formControlProps={{ fullWidth: true }}
              inputProps={{
                value: this.state.NameOnBankAccount,
                onBlur: (event) => this.handleBlur(event, "nameonbankaccount"),
                onChange: (event) =>
                  this.handleBlur(event, "nameonbankaccount"),
                onFocus: () =>
                  this.setState({
                    NameOnBankAccountErr: false,
                    NameOnBankAccountHelperText: "",
                  }),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className="requiredicon">account_balance</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <CustomInput
              labelText="Bank Name"
              id="bankname"
              error={this.state.BankNameErr}
              helperText={this.state.BanknameHelperText}
              formControlProps={{ fullWidth: true }}
              inputProps={{
                value: this.state.BankName,
                onBlur: (event) => this.handleBlur(event, "bankname"),
                onChange: (event) => this.handleBlur(event, "bankname"),
                onFocus: () =>
                  this.setState({ BankNameErr: false, BanknameHelperText: "" }),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className="requiredicon">store</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <CustomInput
              labelText="Account Number"
              id="accountnumber"
              error={this.state.BankAccountNumberErr}
              helperText={this.state.BankAccountNumberHelperText}
              formControlProps={{ fullWidth: true }}
              inputProps={{
                value: this.state.BankAccountNumber,
                onBlur: (event) => this.handleBlur(event, "accountnumber"),
                onChange: (event) => this.handleBlur(event, "accountnumber"),
                onFocus: () =>
                  this.setState({
                    BankAccountNumberErr: false,
                    BankAccountNumberHelperText: "",
                  }),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className="requiredicon">account_circle</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <CustomInput
              labelText="Confirm Account Number"
              id="confirmaccountnumber"
              error={this.state.ConfirmBankAccountNumberErr}
              helperText={this.state.ConfirmBankAccountNumberHelperText}
              formControlProps={{ fullWidth: true }}
              inputProps={{
                value: this.state.ConfirmBankAccountNumber,
                onBlur: (event) =>
                  this.handleBlur(event, "confirmaccountnumber"),
                onChange: (event) =>
                  this.handleBlur(event, "confirmaccountnumber"),
                onFocus: () =>
                  this.setState({
                    ConfirmBankAccountNumberErr: false,
                    ConfirmBankAccountNumberHelperText: "",
                  }),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className="requiredicon">account_circle</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <CustomInput
              labelText="ABA Routing Number"
              id="abaroutingnumber"
              error={this.state.ABAroutingNumberErr}
              helperText={this.state.ABAroutingNumberHelperText}
              formControlProps={{ fullWidth: true }}
              inputProps={{
                value: this.state.ABAroutingNumber,
                onBlur: (event) => this.handleBlur(event, "abaroutingnumber"),
                onChange: (event) => this.handleBlur(event, "abaroutingnumber"),
                onFocus: () =>
                  this.setState({
                    ABAroutingNumberErr: false,
                    ABAroutingNumberHelperText: "",
                  }),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className="requiredicon">lock</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <CustomInput
              labelText="Confirm ABA Routing Number"
              id="cabaroutingnumber"
              error={this.state.ConfirmABAroutingNumberErr}
              helperText={this.state.ConfirmABAroutingNumberHelperText}
              formControlProps={{ fullWidth: true }}
              inputProps={{
                value: this.state.ConfirmABAroutingNumber,
                onBlur: (event) => this.handleBlur(event, "cabaroutingnumber"),
                onChange: (event) =>
                  this.handleBlur(event, "cabaroutingnumber"),
                onFocus: (event) =>
                  this.setState({
                    ConfirmABAroutingNumberErr: false,
                    ConfirmBankAccountNumberHelperText: "",
                  }),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className="requiredicon">lock</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
        </GridContainer>
      </GridItem>
    );
  };

  paymentOptionChange = (e) => {
    this.setState({
      PayOptionValue: e.target.name,
    });
  };

  showLoader() {
    this.setState({ Loading: true });
  }

  hideLoader() {
    this.setState({ Loading: false });
  }

  savePayment = () => {
    this.validate().then((res) => {
      if (res) {
        let paymentData = [];
        if (this.state.IsAccountNumber) {
          let data = {
            PaymentID: null,
            ContactName: this.state.ContactName,
            PhoneNum: this.state.ContactNumber,
            Email: this.state.EmailAddress,
            TrackingNumber: this.state.AccountNumber,
            InvoiceAmount: this.state.TotalInvoiceAmount,
            PaymentType: this.state.PayOptionValue,
            CardType: this.state.cardType,
            CardName: this.state.cardName,
            CardNumber: this.state.cardNumber,
            CardExpiry: this.state.month_value + "-" + this.state.year_value,
            CardCVV: this.state.Cvv,
            CardZipCode: this.state.BillingZipCode,
            PaymentStatus: "New",
            BankName: this.state.BankName,
            AccountNumber: this.state.BankAccountNumber,
            RoutingNumber: this.state.ABAroutingNumber,
            NameonAccount: this.state.NameOnBankAccount,
            userid: CommonConfig.loggedInUserData().PersonID,
          };
          paymentData.push(data);
        } else {
          for (var j = 0; j < this.state.PaidList.length; j++) {
            let payData = {
              PaymentID: null,
              ContactName: this.state.ContactName,
              PhoneNum: this.state.ContactNumber,
              Email: this.state.EmailAddress,
              TrackingNumber: this.state.PaidList[j]["TrackingNumber"],
              InvoiceAmount: this.state.PaidList[j]["Balance"],
              PaymentType: this.state.PayOptionValue,
              CardType: this.state.cardType,
              CardName: this.state.cardName,
              CardNumber: this.state.cardNumber,
              CardExpiry: this.state.month_value + "-" + this.state.year_value,
              CardCVV: this.state.Cvv,
              CardZipCode: this.state.BillingZipCode,
              PaymentStatus: "New",
              BankName: this.state.BankName,
              AccountNumber: this.state.BankAccountNumber,
              RoutingNumber: this.state.ABAroutingNumber,
              NameonAccount: this.state.NameOnBankAccount,
              userid: CommonConfig.loggedInUserData().PersonID,
            };
            paymentData.push(payData);
          }
        }

        let finalObj = {
          PaymentData: paymentData,
          PaidList: this.state.PaidList,
          IsAccountNumber: this.state.IsAccountNumber,
          userid: CommonConfig.loggedInUserData().PersonID,
        };

        try {
          this.showLoader();
          api
            .post("scheduleshipment/addPaymentByBillingInvoice", finalObj)
            .then((res) => {
              this.setState({
                IsSearchClicked: true,
              });
              this.hideLoader();
              if (res.success) {
                cogoToast.success("Data saved successfully");
                // this.props.history.push("/admin/Billing");
              } else {
                cogoToast.error("Something went wrong");
              }
            })
            .catch((err) => {
              this.hideLoader();
              console.log("error....", err);
            });
        } catch (err) {
          console.log("error....", err);
        }
      } else {
        cogoToast.error("Please correct error and resubmit the form.");
      }
    });
  };

  cancelPayment = () => {
    this.props.history.push({
      pathname: "Billing",
      state: {
        currentTab: this.state.previousTab,
      },
    });
  };

  viewTrackingDetails = () => {
    return this.state.PaidList.map((pay, index) => {
      return (
        <tr>
          <td>{pay.TrackingNumber}</td>
          <td>{pay.InvoiceDate}</td>
          <td>{pay.FromContactName}</td>
          <td>{pay.ToContactName}</td>
          <td>
            {pay.InvoiceAmount
              ? "$ " + parseFloat(pay.InvoiceAmount).toFixed(2)
              : "$ 0.00"}
          </td>
          <td>
            {pay.ReceivedAmount
              ? "$ " + parseFloat(pay.ReceivedAmount).toFixed(2)
              : "$ 0.00"}
          </td>
          <td>
            {pay.Balance ? "$ " + parseFloat(pay.Balance).toFixed(2) : "$ 0.00"}
          </td>
          <td>{pay.DueDate}</td>
        </tr>
      );
    });
  };

  render() {
    const {
      ContactName,
      ContactNumber,
      EmailAddress,
      AccountNumber,
      PaymentDate,
      PaymentStatus,
      TotalInvoiceAmount,
      AccountLabel,
      IsSearchClicked,
    } = this.state;

    return (
      <GridItem xs={12} sm={12} md={12}>
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
        {!IsSearchClicked ? (
          <div id="mainDiv">
            <Card>
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <User />
                </CardIcon>
                <h4 className="margin-right-auto text-color-black">
                  Customer Details
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Contact Name"
                      id="contactname"
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: ContactName,
                        disabled: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Contact Number"
                      id="contactnumber"
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: ContactNumber,
                        disabled: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Email Address"
                      id="emailaddress"
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: EmailAddress,
                        disabled: true,
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText={AccountLabel + " Number"}
                      id="trackingnumber"
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: AccountNumber,
                        disabled: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Payment Date"
                      id="paymentdate"
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: moment().format(
                          CommonConfig.dateFormat.dateOnly
                        ),
                        disabled: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Invoice Amount"
                      id="invoiceamount"
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: TotalInvoiceAmount
                          ? parseFloat(TotalInvoiceAmount).toFixed(2)
                          : TotalInvoiceAmount,
                        disabled: true,
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardIcon color="primary">
                  <BankDetails />
                </CardIcon>
                <h4 className="margin-right-auto text-color-black">
                  Payment Details
                </h4>
              </CardHeader>
              <CardBody>
                <div className="radio-inline">
                  <label className="full-width">Selected Payment Type</label>
                  <label>
                    <Radio
                      name="Credit Card"
                      checked={
                        this.state.PayOptionValue === "Credit Card"
                          ? true
                          : false
                      }
                      onChange={(event) => this.paymentOptionChange(event)}
                    />
                    Credit Card
                  </label>
                  <label>
                    <Radio
                      name="Bank"
                      checked={
                        this.state.PayOptionValue === "Bank" ? true : false
                      }
                      onChange={(event) => this.paymentOptionChange(event)}
                    />
                    Bank
                  </label>
                </div>
                <div>
                  {this.state.PayOptionValue === "Credit Card"
                    ? this.viewCreditCardDetails()
                    : this.viewBankDetails()}
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <EqualizerIcon />
                </CardIcon>
                <h4 className="margin-right-auto text-color-black">
                  Payment Details
                </h4>
              </CardHeader>
              <CardBody>
                <GridItem xs={12} sm={12} md={12}>
                  <div className="package-table accounts-reports-table">
                    <table style={{ width: "100%" }}>
                      <tbody>
                        <tr>
                          <td className="semibold">Tracking</td>
                          <td className="semibold">Invoice Date</td>
                          <td className="semibold">Sender</td>
                          <td className="semibold">Receipient</td>
                          <td className="semibold">Amount</td>
                          <td className="semibold">Paid</td>
                          <td className="semibold">Balance</td>
                          <td className="semibold">Due Date</td>
                        </tr>
                        {this.viewTrackingDetails()}
                        <tr>
                          <td className="semibold right" colSpan="6">
                            Total:
                          </td>
                          <td className="semibold">
                            {"$ " +
                              parseFloat(this.state.TotalInvoiceAmount).toFixed(
                                2
                              )}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </GridItem>
              </CardBody>
            </Card>
            <div className="shipment-submit">
              <div className="right">
                <Button onClick={() => this.savePayment()} color="primary">
                  Pay Now
                </Button>
                <Button onClick={() => this.cancelPayment()} color="secondary">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="payment-confirm-outer">
            <div className="payment-confirm-box">
              <span>
                <i className="fa fa-check"></i>
              </span>
              <h3>Thank you for your payment</h3>
              <p>
                Your payment will be process within 1 business days. For any
                additional information please fell free to contact your account
                representative.
              </p>
              <img src={thankyouIMG} />
            </div>
          </div>
        )}
      </GridItem>
    );
  }
}

export default confirmOnlinePayment;
