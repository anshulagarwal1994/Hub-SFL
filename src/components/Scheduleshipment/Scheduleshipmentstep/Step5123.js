/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";

import InputLabel from "@material-ui/core/InputLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import SimpleBackdrop from "../../../utils/general";
import withStyles from "@material-ui/core/styles/withStyles";
import { CommonConfig } from "../../../utils/constant";
import api from "../../../utils/apiClient";
import moment from "moment";
import cogoToast from "cogo-toast";
import Icon from "@material-ui/core/Icon";
import Link from "@material-ui/core/Link";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import FormHelperText from "@material-ui/core/FormHelperText";
import CloseIcon from "@material-ui/icons/Close";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Radio from "@material-ui/core/Radio";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import PaymentIcon from "@material-ui/icons/Payment";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";

// import Geocode from "react-geocode";
var creditCardType = require("credit-card-type");
var valid = require("card-validator");
const sfl = require("../../../assets/img/get-quote/sfl.svg");
const seviceimage = require("../../../assets/img/get-quote/fedex.svg");
// Geocode.setApiKey("AIzaSyDIU6hx3WQi16Xd-5HlRgT6_QtLgpv1KKQ");
// Geocode.setLanguage("en");
// Geocode.setLocationType("ROOFTOP");

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

const AIRNotes = `Payment will be charged depending on weight and dimensions provided at time of booking. Once shipment arrives at
                  warehouse chargeable weight will be ascertained and correction will be charged or refunded as needed.`;

const OceanNotes = `Payment details is captured to reserve shipment, Bank/Credit Card will not be charged at this time.
                    Once your shipment is received at our warehouse chargeable weight/volume will be ascertain and payment will be charged upon approval.`;

class Scheduleshipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ipAddress: "",
      ipLocation: "",
      simpleSelect: "",
      getratedomain: parseFloat(localStorage.getItem("getRate")),
      Loading: false,
      saleslead: localStorage.getItem("sealsleadid"),
      salesleaddata: [],
      info_FromCity: "",
      info_FromState: "",
      info_FromZipCode: "",
      info_FromCountry: "",
      info_FromAddressline1: "",
      info_FromAddressline2: "",
      info_FromAddressline3: "",
      info_FromName: "",
      info_FromEmail: "",
      info_FromPhone: "",

      info_ToAddressline1: "",
      info_ToAddressline2: "",
      info_ToAddressline3: "",
      info_ToCountry: "",
      info_ToState: "",
      info_ToZipCode: "",
      info_ToCity: "",
      info_ToName: "",
      info_ToEmail: "",
      info_ToPhone: "",
      info_servicename: "",
      info_Subservicename: "",
      info_PackageNumber: "",
      info_WeightType: "",
      info_Packagetype: "",
      info_PackageLength: "",
      info_PackageWeight: "",
      info_PackageWidth: "",
      desgin: false,
      code: false,
      develop: false,
      selectedValue: null,

      selectTerm: false,
      selectTermErr: false,
      selectTermHelperText: "",

      checkedTerm: false,
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

      selectedPaymentType: "Pay Online",
      selectPayonline: 1,
      selectBank: 2,
      selectBillMyAccount: 3,
      hidePayonline: true,
      hideSelectbank: false,
      hideBillMyAccount: false,
      payOnline: 1,
      payBank: 1,
      payBillMyAccount: 1,
      shipMentType: "",
      ServiceName: "",
      IsBillMyAccount: false,
      BillMyAccountNumber: "",
      ManagedBy: null,
      Attachments: [],
      GetRateAccess: {},
    };
    this.handleTerms = this.handleTerms.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // this.getData();
    // navigator.geolocation.getCurrentPosition((position) => {
    // console.log("Latitude is :", position.coords.latitude);
    // console.log("Longitude is :", position.coords.longitude);

    // debugger;
    // Geocode.fromLatLng(
    //   position.coords.latitude,
    //   position.coords.longitude
    // ).then(
    //   (response) => {
    //     const address = response.results[0].formatted_address;
    //     console.log("addres=", address);
    //     this.setState({ ipLocation: address });
    //   },
    //   (error) => {
    //     console.error(error);
    //   }
    // );
    // });
    this.setState({
      GetRateAccess: CommonConfig.getUserAccess("Get Rates"),
    });
    if (
      nextProps.props.location.state != undefined &&
      nextProps.props.location.state != null
    ) {
      this.setState({
        ServiceName: nextProps.props.location.state.ServiceName,
      });
    }
    if (
      nextProps.allStates.schedulepickup != undefined ||
      nextProps.allStates.schedulepickup != null
    ) {
      if (
        !CommonConfig.isEmpty(
          nextProps.allStates.schedulepickup.UserDetails.AccountNumber
        )
      ) {
        this.setState({
          BillMyAccountNumber:
            nextProps.allStates.schedulepickup.UserDetails.AccountNumber,
          IsBillMyAccount: true,
        });
      }
      if (
        !CommonConfig.isEmpty(
          nextProps.allStates.schedulepickup.UserDetails.ManagedBy
        )
      ) {
        this.setState({
          ManagedBy: nextProps.allStates.schedulepickup.UserDetails.ManagedBy,
        });
      }
      if (!CommonConfig.isEmpty(nextProps.allStates.schedulepickup)) {
        this.setState({
          info_ToCountry:
            nextProps.allStates.schedulepickup.FromSelectedCountry.label,
        });
      }
      if (!CommonConfig.isEmpty(nextProps.allStates.schedulepickup)) {
        this.setState({
          info_servicename: nextProps.allStates.schedulepickup.ServiceName,
          info_Subservicename:
            nextProps.allStates.schedulepickup.SubServiceName,
        });
        // console.log(
        //   "111111",
        //   nextProps.allStates.schedulepickup.SubServiceName
        // );
      }
      this.setState({
        shipMentType: nextProps.allStates.schedulepickup.selectedShipmentType,
      });
    }
    if (!CommonConfig.isEmpty(nextProps.allStates.packagedetails)) {
      this.setState({
        info_PackageNumber:
          nextProps.allStates.packagedetails.GetRate.PackageNumber,
        info_WeightType: nextProps.allStates.packagedetails.GetRate.WeightType,
        info_Packagetype:
          nextProps.allStates.packagedetails.selectedPackageType,
        info_PackageLength:
          nextProps.allStates.packagedetails.PackageDetails[0].PackageLength,
        info_PackageWeight:
          nextProps.allStates.packagedetails.PackageDetails[0].PackageWeight,
        info_PackageWidth:
          nextProps.allStates.packagedetails.PackageDetails[0].PackageWidth,
      });
      // console.log(
      //   "test....",
      //   nextProps.allStates.packagedetails.PackageDetails[0].PackageLength
      // );
    }
    if (!CommonConfig.isEmpty(nextProps.allStates.senderinformation)) {
      this.setState({
        info_FromAddressline1:
          nextProps.allStates.senderinformation.fromAddressLine1,
        info_FromAddressline2:
          nextProps.allStates.senderinformation.fromAddressLine2,
        info_FromAddressline3:
          nextProps.allStates.senderinformation.fromAddressLine3,
        info_FromCity: nextProps.allStates.senderinformation.fromCity.label,
        info_FromState: nextProps.allStates.senderinformation.fromState.label,
        info_FromCountry:
          nextProps.allStates.senderinformation.FromSelectedCountry.label,
        info_FromZipCode: nextProps.allStates.senderinformation.fromZipCode,
        info_FromName: nextProps.allStates.senderinformation.fromContactName,
        info_FromEmail: nextProps.allStates.senderinformation.fromEmail,
        info_FromPhone: nextProps.allStates.senderinformation.fromPhone1,
      });
      //console.log("test....", nextProps.allStates.senderinformation);
    }

    if (!CommonConfig.isEmpty(nextProps.allStates.recipientinformation)) {
      this.setState({
        info_ToAddressline1:
          nextProps.allStates.recipientinformation.toAddressLine1,
        info_ToAddressline2:
          nextProps.allStates.recipientinformation.info_toAddressline2,
        info_ToAddressline3:
          nextProps.allStates.recipientinformation.toAddressLine3,
        info_ToCountry:
          nextProps.allStates.recipientinformation.ToSelectedCountry.label,
        info_ToState: nextProps.allStates.recipientinformation.toState,
        info_ToCity: nextProps.allStates.recipientinformation.toCity,
        info_ToZipCode: nextProps.allStates.recipientinformation.toZipCode,
        info_ToName: nextProps.allStates.recipientinformation.toContactName,
        info_ToEmail: nextProps.allStates.recipientinformation.toEmail,
        info_ToPhone: nextProps.allStates.recipientinformation.toPhone1,
      });
      console.log("test....", nextProps.allStates.recipientinformation);
    }

    // if (
    //   CommonConfig.isEmpty(this.state.salesleaddata) ||
    //   this.state.salesleaddata.length <= 0
    // ) {
    //   this.getdata(this.state.saleslead);
    // }
  }

  // getdata = (data) => {
  //   // data = 40631;
  //   let newdata = {
  //     SalesLeadManagementID: data,
  //   };
  //   api
  //     .post("salesLead/getSalesLeadDetailsById", newdata)
  //     .then((result) => {
  //       if (result) {
  //         console.log("tessts...", result);
  //         this.setState({ salesleaddata: result });
  //       }
  //       console.log("tes...", this.state.salesleaddata.data.data.FromCity);
  //       this.setState({
  //         info_FromCity: this.state.salesleaddata.data.data.FromCity,
  //         info_FromState: this.state.salesleaddata.data.data.FromState,
  //         info_FromZipCode: this.state.salesleaddata.data.data.FromZipCode,
  //         info_ToState: this.state.salesleaddata.data.data.ToState,
  //         info_ToZipCode: this.state.salesleaddata.data.data.ToZipCode,
  //         info_ToCity: this.state.salesleaddata.data.data.ToCity,
  //       });
  //     })
  //     .catch((err) => {
  //       console.log("error", err);
  //     });
  // };
  // getData = async () => {
  //   const res = await axios.get("https://geolocation-db.com/json/");
  //   console.log(res.data);
  //   this.setState({ ipAddress: res.data.IPv4 });
  //   this.setState({
  //     ipLocation:
  //       res.data.city +
  //       "," +
  //       res.data.state +
  //       "," +
  //       res.data.country_name +
  //       "," +
  //       res.data.postal,
  //   });
  //   console.log("iplocation", this.state.ipLocation);
  //   debugger;
  //   //setIP(res.data.IPv4);
  // };
  handleSimple = (event) => {
    this.setState({ simpleSelect: event.target.value });
  };

  handleTerms = (event) => {
    this.setState({ checkedTerm: true });
  };

  handleSelectTerm = (event) => {
    this.setState({ selectTerm: event.target.checked });
  };

  handleClose = (event) => {
    this.setState({ checkedTerm: false });
  };

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

  showLoader = () => {
    this.setState({ Loading: true });
  };

  hideLoader = () => {
    this.setState({ Loading: false });
  };

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

  onlinepaymentChange(e) {
    this.setState({
      selectedPaymentType: e.target.name,
      hideSelectbank: false,
      hidePayonline: true,
      hideBillMyAccount: false,
      payOnline: 1,
      payBank: 1,
    });
  }

  bankpaymentChange(e) {
    this.setState({
      selectedPaymentType: e.target.name,
      hideSelectbank: true,
      hideBillMyAccount: false,
      hidePayonline: false,
      payOnline: 0,
      payBank: 0,
    });
  }

  billmyAccountChange(e) {
    this.setState({
      selectedPaymentType: e.target.name,
      hideBillMyAccount: true,
      hideSelectbank: false,
      hidePayonline: false,
      payOnline: 0,
      payBank: 0,
      payBillMyAccount: 1,
    });
  }

  authorizeCard = async (allStates) => {
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
        Address: allStates.senderinformation.fromAddressLine1,
        City: "",
        State: "",
        ZipCode: allStates.senderinformation.fromZipCode,
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
    // console.log("cardResponse.......",cardResponse);

    return await validCard;
  };

  async validate(allStates) {
    let IsFormValid = true;

    if (this.state.selectedPaymentType === "Pay Online") {
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
      if (this.state.selectTerm == false) {
        cogoToast.error("Please agree the following terms");
        this.setState({
          selectTermErr: true,
          selectTermHelperText: "Please agree the following terms",
        });
        IsFormValid = false;
      }
      if (IsFormValid) {
        let authorizeRes = await this.authorizeCard(allStates);
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
    if (this.state.selectedPaymentType === "Bank Details") {
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
          BankNameHelperText: "Please enter bank name",
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
      if (this.state.selectTerm == false) {
        cogoToast.error("Please agree the following terms");
        this.setState({
          selectTermErr: true,
          selectTermHelperText: "Please agree the following terms",
        });
        IsFormValid = false;
      }
    }
    return IsFormValid;
  }

  postScheduleShipment = async (allStates) => {
    debugger;
    let packobj = allStates.packagedetails;
    this.showLoader();

    let scheduleobj = allStates.schedulepickup;
    let senderobj = allStates.senderinformation;
    let recipientobj = allStates.recipientinformation;
    var getrate = [];
    let packages_data = [];
    let com_data = [];
    let packCount = 0;
    if (
      scheduleobj.selectedShipmentType === "Air" ||
      scheduleobj.selectedShipmentType === "Ground"
    ) {
      if (packobj.selectedPackageType === "Package") {
        // debugger;
        for (var i = 0; i < packobj.PackageDetails.length; i++) {
          if (packobj.PackageDetails[i].PackageNumber > 1) {
            for (let j = 0; j < packobj.PackageDetails[i].PackageNumber; j++) {
              var package_details = {};
              packCount = packCount + 1;
              package_details = {
                shipments_tracking_number: "",
                PackageNumber: packCount,
                weight: packobj.PackageDetails[i].PackageWeight,
                unit_of_weight: "LBS",
                length: packobj.PackageDetails[i].PackageLength,
                width: packobj.PackageDetails[i].PackageWidth,
                height: packobj.PackageDetails[i].PackageHeight,
                TV: false,
                Crating: false,
                Repack: false,
                Stretch: false,
                chargable_weight:
                  packobj.PackageDetails[i].PackageChargableWeight,
                insured_value: packobj.PackageDetails[i].PackageInsuredValue,
              };
              packages_data.push(package_details);
            }
          } else {
            var package_details = {};
            packCount = packCount + 1;
            package_details = {
              shipments_tracking_number: "",
              PackageNumber: packCount,
              weight: packobj.PackageDetails[i].PackageWeight,
              unit_of_weight: "LBS",
              length: packobj.PackageDetails[i].PackageLength,
              width: packobj.PackageDetails[i].PackageWidth,
              height: packobj.PackageDetails[i].PackageHeight,
              TV: false,
              Crating: false,
              Repack: false,
              Stretch: false,
              chargable_weight:
                packobj.PackageDetails[i].PackageChargableWeight,
              insured_value: packobj.PackageDetails[i].PackageInsuredValue,
            };
            packages_data.push(package_details);
          }
        }
      } else if (packobj.selectedPackageType === "Envelop") {
        let package_details = {};
        package_details = {
          shipments_tracking_number: "",
          PackageNumber: packobj.PackageDetails[0].PackageNumber,
          weight: packobj.PackageDetails[0].PackageWeight,
          unit_of_weight: "LBS",
          length: packobj.PackageDetails[0].PackageLength,
          width: packobj.PackageDetails[0].PackageWidth,
          height: packobj.PackageDetails[0].PackageHeight,
          chargable_weight: packobj.PackageDetails[0].PackageChargableWeight,
          insured_value: packobj.PackageDetails[0].PackageInsuredValue,
          TV: false,
          Crating: false,
          Repack: false,
          Stretch: false,
          PackageID: null,
        };

        packages_data.push(package_details);
      }
    }
    var packages = packages_data;

    if (scheduleobj.selectedShipmentType !== "Ocean") {
      for (var i = 0; i < packobj.commercialData.length; i++) {
        let commercail_details = {};
        var packIndex = packobj.PackageDetails.findIndex(
          (x) => x.PackageNumber == packobj.commercialData[i].package_number
        );

        commercail_details = {
          shipments_tracking_number: "",
          package_number: packobj.commercialData[i].package_number,
          content_description:
            packobj.selectedPackageType === "Package"
              ? packobj.commercialData[i].content_description
              : "Document",
          quantity:
            packobj.selectedPackageType === "Package"
              ? packobj.commercialData[i].quantity
              : 1,
          value_per_qty:
            packobj.selectedPackageType === "Package"
              ? packobj.commercialData[i].value_per_qty
              : 0,
          total_value:
            packobj.selectedPackageType === "Package"
              ? packobj.commercialData[i].total_value
              : 0,
          CommercialInvoiceID: null,
        };

        com_data.push(commercail_details);
      }
    }
    var commercial = com_data;
    if (scheduleobj.ServiceName) {
      getrate = parseFloat(localStorage.getItem("getRate"));
    }
    var shipments = {
      // ipAddress: this.state.ipAddress,
      // ipLocation: this.state.ipLocation,
      tracking_number: "",
      shipment_type: scheduleobj.selectedShipmentType,
      location_type: recipientobj.SelectedLocationType,
      is_pickup: recipientobj.IsPickUp,
      pickup_date:
        CommonConfig.isEmpty(recipientobj.pickUpDate) != true
          ? moment(recipientobj.pickUpDate)
              .format("YYYY-MM-DD HH:mm:ss")
              .toString()
          : null,
      package_type: !CommonConfig.isEmpty(packobj)
        ? packobj.selectedPackageType
        : "Package",
      total_packages: !CommonConfig.isEmpty(packobj) ? packages_data.length : 0,
      is_pay_online: this.state.payOnline,
      is_pay_bank: this.state.payBank,
      promo_code: "",
      is_agree: "",
      total_weight: !CommonConfig.isEmpty(packobj)
        ? packobj.GetRate.TotalWeight
        : 0,
      total_chargable_weight: !CommonConfig.isEmpty(packobj)
        ? packobj.GetRate.TotalWeight
        : 0,
      total_insured_value: !CommonConfig.isEmpty(packobj)
        ? packobj.GetRate.TotalInsuredValue
        : 0,
      duties_paid_by: !CommonConfig.isEmpty(packobj) ? packobj.dutyType : "",
      total_declared_value: 0,
      dutyType: this.state.dutyType,
      userName: CommonConfig.loggedInUserData().LoginID,
      ServiceName: scheduleobj.ServiceName,
      SubServiceName: scheduleobj.SubServiceName,
      managed_by: this.state.ManagedBy,
      ShippingID: null,
      InvoiceDueDate: null,
    };

    var countryList = [];
    countryList.push(allStates.schedulepickup.CountryList);

    var fromcntryidx = countryList[0].findIndex(
      (x) => x.CountryName == senderobj.FromSelectedCountry.label
    );
    var tocntryidx = countryList[0].findIndex(
      (x) => x.CountryName == recipientobj.ToSelectedCountry.label
    );

    var selectedCoutryCode = countryList[0][fromcntryidx];
    var selectedTocntryCode = countryList[0][tocntryidx];

    var from_address = {
      AddressID: null,
      country_id: senderobj.FromSelectedCountry.value,
      country_name: senderobj.FromSelectedCountry.label,
      fromCountryCode: selectedCoutryCode.CountryCode,
      company_name: senderobj.fromCompanyName,
      contact_name: senderobj.fromContactName,
      address_1: senderobj.fromAddressLine1,
      address_2: senderobj.fromAddressLine2,
      address_3: senderobj.fromAddressLine3,
      MovingBack: false,
      OriginalPassportAvailable: false,
      EligibleForTR: false,
      city_id: 1,
      city_name:
        Object.keys(senderobj.FromFedExSelectedCity).length > 0
          ? ""
          : CommonConfig.isEmpty(senderobj.fromCity.label)
          ? senderobj.fromCity
          : senderobj.fromCity.label,
      fedex_city:
        Object.keys(senderobj.FromFedExSelectedCity).length > 0
          ? senderobj.FromFedExSelectedCity.label
          : "",
      state_id: 1,
      state_name:
        Object.keys(senderobj.FromFedExSelectedCity).length > 0 &&
        CommonConfig.isEmpty(senderobj.fromState)
          ? ""
          : CommonConfig.isEmpty(senderobj.fromState.label)
          ? senderobj.fromState
          : senderobj.fromState.label,
      zip_code: senderobj.fromZipCode,
      phone1: senderobj.fromPhone1,
      phone2: senderobj.fromPhone2,
      email: senderobj.fromEmail,
    };

    var to_address = {
      AddressID: null,
      country_id: recipientobj.ToSelectedCountry.value,
      country_name: recipientobj.ToSelectedCountry.label,
      toCountryCode: selectedTocntryCode.CountryCode,
      company_name: recipientobj.toCompanyName,
      contact_name: recipientobj.toContactName,
      address_1: recipientobj.toAddressLine1,
      address_2: recipientobj.toAddressLine2,
      address_3: recipientobj.toAddressLine3,
      city_id: 2,
      city_name:
        Object.keys(recipientobj.ToFedExSelectedCity).length > 0
          ? ""
          : CommonConfig.isEmpty(recipientobj.toCity.label)
          ? recipientobj.toCity
          : recipientobj.toCity.label,
      fedex_city:
        Object.keys(recipientobj.ToFedExSelectedCity).length > 0
          ? recipientobj.ToFedExSelectedCity.label
          : "",
      state_id: 1,
      state_name:
        Object.keys(recipientobj.ToFedExSelectedCity).length > 0 &&
        CommonConfig.isEmpty(recipientobj.toState)
          ? ""
          : CommonConfig.isEmpty(recipientobj.toState.label)
          ? recipientobj.toState
          : recipientobj.toState.label,
      zip_code: recipientobj.toZipCode,
      phone1: recipientobj.toPhone1,
      phone2: recipientobj.toPhone2,
      email: recipientobj.toEmail,
    };

    let data = {
      FromPhone1: senderobj.fromPhone1,
      FromPhone2: senderobj.fromPhone2,
      FromEmail: senderobj.fromEmail,
      ToPhone1: recipientobj.toPhone1,
      ToPhone2: recipientobj.toPhone2,
      ToEmail: recipientobj.toEmail,
    };

    if (
      CommonConfig.isEmpty(shipments.managed_by) ||
      shipments.managed_by === 0
    ) {
      let userManagedData = {
        userId: CommonConfig.loggedInUserData().PersonID,
      };
      await api
        .post("scheduleshipment/getManagedByFromUserId", userManagedData)
        .then((res) => {
          if (res.success) {
            if (res.data.length > 0) {
              if (!CommonConfig.isEmpty(res.data[0].ManagedBy)) {
                shipments.managed_by = res.data[0].ManagedBy;
              } else {
                api
                  .post(
                    "scheduleshipment/getManagedByPhoneOREmailShipment",
                    data
                  )
                  .then((result) => {
                    if (result.success) {
                      if (result.data.length > 0) {
                        shipments.managed_by = result.data[0].ManagedBy;
                      }
                    }
                  })
                  .catch((err) => {
                    console.log("error", err);
                  });
              }
            } else {
              api
                .post("scheduleshipment/getManagedByPhoneOREmailShipment", data)
                .then((result) => {
                  if (result.success) {
                    if (result.data.length > 0) {
                      shipments.managed_by = result.data[0].ManagedBy;
                    }
                  }
                })
                .catch((err) => {
                  console.log("error", err);
                });
            }
          }
        });
    }
    var payment_online = {
      PaymentID: null,
      name_on_card: this.state.cardName,
      card_number: this.state.cardNumber,
      card_type: this.state.cardType,
      expiration_month: this.state.month_value,
      expiration_year: this.state.year_value,
      cvv_code: this.state.Cvv,
      zip_code: this.state.BillingZipCode,
      name_on_bank_account: this.state.NameOnBankAccount,
      bank_name: this.state.BankName,
      account_number: this.state.BankAccountNumber,
      routing_number: this.state.ABAroutingNumber,
      InvoiceAmount: 0.0,
    };
    // var url = localStorage.getItem("rate url");
    // if (
    //   url === "https://hub.sflworldwide.com/admin/GetRates" ||
    //   url === "http://localhost:3000/admin/GetRates"
    // ) {
    //   var newurl = "GetRates";
    // } else {
    //   var newurl = "GetQuote";
    // }
    let Paymentdata = [];
    Paymentdata.push(payment_online);
    setTimeout(() => {
      let objdata = {
        UserID: CommonConfig.loggedInUserData().PersonID,
        ipAddress: this.state.ipAddress,
        TrackingNumber: null,
        shipments: shipments,
        MovingBackToIndia: senderobj.isBackIndia,
        from_address: from_address,
        to_address: to_address,
        PaymentData: Paymentdata,
        paymentType: this.state.selectedPaymentType,
        packages: packages,
        commercial: commercial,
        invoiceData: CommonConfig.isEmpty(allStates.packagedetails)
          ? []
          : allStates.packagedetails.PaymentInvoiceData,
        TotalCommercialvalue:
          packobj && packobj.selectedPackageType === "Package"
            ? packobj.totalCommercial
            : 0,
        TotalWeight: packobj && packobj.GetRate.TotalWeight,
      };

      if (scheduleobj.selectedShipmentType === "Ocean") {
        objdata.UserAdditionalData = {
          NameAsPerPassport: senderobj.NameAsPerPassport,
          YearsOutsideIndia: senderobj.YearsOutsideIndia,
          StayInIndia: senderobj.StayInIndia,
          LatestArrivalDate: senderobj.LatestArrivalDate
            ? moment(senderobj.LatestArrivalDate)
                .format(CommonConfig.dateFormat.dbDateTime)
                .toString()
            : null,
          AppliedForTR: senderobj.AppliedForTR,
          AbleToProvidePassport: senderobj.AbleToProvidePassport,
          VisaValidDate: senderobj.VisaValidDate
            ? moment(senderobj.VisaValidDate)
                .format(CommonConfig.dateFormat.dbDateTime)
                .toString()
            : null,
          VisaCategory: senderobj.VisaCategory,
        };
      }
      api
        .post("scheduleshipment/addshipments", objdata)
        .then(async (res) => {
          if (res.success) {
            let shipmentdata = {
              Second_data: objdata,
              trackingNumber: res.data.data,
              ShippingID: res.data.ShippingID,
              Attachments: [],
              showGetrate: false,
              showGetrateError: false,
              data: {},
            };

            var EtdDocID = "";
            if (objdata.shipments.ServiceName == "FedEx") {
              if (from_address.country_id != to_address.country_id) {
                await api
                  .post("fedexETDApi/fedexETD", shipmentdata)
                  .then((res) => {
                    console.log("checkdatttaaa", res);
                    EtdDocID = res.data.result[0].DocumentId;
                    var ETDDocInsert = {
                      LineNumber: res.data.result[0].LineNumber,
                      SFLTrackingNumber: shipmentdata.trackingNumber,
                      DocumentProducer: res.data.result[0].DocumentProducer,
                      DocumentType: res.data.result[0].DocumentType,
                      FileName: res.data.result[0].FileName,
                      Status: res.data.result[0].Status,
                      DocumentId: res.data.result[0].DocumentId,
                      Path: res.data.Path,
                    };

                    api
                      .post("fedexETDApi/insertFedexETDData", ETDDocInsert)
                      .then((res) => {});
                  });
              }
            }
            if (objdata.shipments.shipment_type == "Ocean") {
              var data = {
                ShippingID: res.data.ShippingID,
                Mode: "I",
                shipStatus: "",
                pickupDate: "",
              };

              api
                .post("scheduleshipment/autoOceanTracking", data)
                .then((res) => {
                  console.log(res);
                });
            }
            if (localStorage.getItem("sealsleadid")) {
              try {
                var data = {
                  SalesLeadId: localStorage.getItem("sealsleadid"),
                  ProposalStatus: "Closed",
                  ShipmentNumber: res.data.ShippingID,
                };
                api
                  .post("salesLead/changeStatusOfSalesLead", data)
                  .then((res) => {
                    if (res.success) {
                      localStorage.removeItem("sealsleadid");
                      localStorage.removeItem("Subname");
                      localStorage.removeItem("Mainname");
                      localStorage.removeItem("ServiceType");
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } catch (err) {
                console.log("error", err);
              }
            }

            if (
              objdata.shipments.ServiceName === "FedEx" &&
              objdata.from_address.country_name != "Canada" &&
              !CommonConfig.isEmpty(objdata.shipments.SubServiceName) &&
              this.state.GetRateAccess.WriteAccess === 1
            ) {
              var labelSize = localStorage.getItem("selectedPaperSize");
              try {
                var data = {
                  TrackingNumber: res.data.data,
                  isSendEmail: true,
                  UserID: CommonConfig.loggedInUserData().PersonID,
                  Rates: getrate,
                  LabelSpecification: labelSize,
                  EtdDocumentId: EtdDocID,
                };
                api
                  .post("scheduleshipment/Fedexship", data)
                  .then(async (result) => {
                    this.hideLoader();
                    shipmentdata.data = result.data;

                    if (result.data.success) {
                      // cogoToast.success(result.data.data);
                      if (result.data.data != "Comming Soon") {
                        this.shipmentStatusChange(shipmentdata.ShippingID);

                        this.getDocumentation(
                          shipmentdata.ShippingID,
                          shipmentdata
                        );
                      } else {
                        const { history } = this.props.props;
                        localStorage.setItem(
                          "shipmentObj",
                          JSON.stringify(shipmentdata)
                        );
                        history.push("/admin/ScheduleConfirmation");
                      }
                    } else {
                      shipmentdata.showGetrate = true;
                      shipmentdata.showGetrateError = true;
                      const { history } = this.props.props;
                      localStorage.setItem(
                        "shipmentObj",
                        JSON.stringify(shipmentdata)
                      );
                      history.push("/admin/ScheduleConfirmation");
                    }
                  })
                  .catch((err) => {
                    this.hideLoader();
                    console.log(err);
                  });
              } catch (err) {
                this.hideLoader();
                console.log("error", err);
              }
            } else {
              this.hideLoader();
              const { history } = this.props.props;
              localStorage.setItem("shipmentObj", JSON.stringify(shipmentdata));
              history.push("/admin/ScheduleConfirmation");
            }
            if (objdata.shipments.ServiceName) {
              try {
                var GenerateInvoice = {
                  TrackingNumber: res.data.data,
                  UserID: CommonConfig.loggedInUserData().PersonID,
                  Rates: getrate,
                };
                api
                  .post(
                    "scheduleshipment/GenerateInvoiceGetRate",
                    GenerateInvoice
                  )
                  .then(async (result) => {});
              } catch (error) {
                console.log(error);
              }
            }
          } else {
            this.hideLoader();
            cogoToast.error("Schedule Shipment is Not Created!");
          }
        })
        .catch((err) => {
          console.log("error...", err);
        });
    }, 2500);
  };

  async getDocumentation(ShippingID, shipmentdata) {
    try {
      let data = {
        ShippingID: ShippingID,
      };
      shipmentdata.showGetrate = true;
      shipmentdata.showGetrateError = false;
      await api
        .post("scheduleshipment/getDocumentation", data)
        .then(async (result) => {
          for (var j = 0; j < result.data.length; j++) {
            this.state.Attachments.push(result.data[j]);
          }
          shipmentdata.Attachments = this.state.Attachments;
          if (
            shipmentdata.Second_data.from_address.country_name !=
              shipmentdata.Second_data.to_address.country_name &&
            shipmentdata.Second_data.shipments.package_type === "Package"
          ) {
            let data = {
              dateTime: new Date().getTime() + "CommercialInvoice",
              Type: "Commercial_Invoice",
              ShippingID: ShippingID,
              UserID: CommonConfig.loggedInUserData().PersonID,
            };
            await api
              .post("scheduleshipment/generateCommercialInvoice", data)
              .then(async (res) => {
                if (res.success) {
                  var attachments = {
                    filename: "Invoice-" + res.data.tempFedexTraking + ".pdf",
                    path: res.data.data,
                    DocumentType: "Commercial Invoice",
                    contentType: "application/pdf",
                  };
                  shipmentdata.Attachments.push(attachments);
                  const { history } = this.props.props;
                  localStorage.setItem(
                    "shipmentObj",
                    JSON.stringify(shipmentdata)
                  );
                  history.push("/admin/ScheduleConfirmation");
                } else {
                  const { history } = this.props.props;
                  localStorage.setItem(
                    "shipmentObj",
                    JSON.stringify(shipmentdata)
                  );
                  history.push("/admin/ScheduleConfirmation");
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            const { history } = this.props.props;
            localStorage.setItem("shipmentObj", JSON.stringify(shipmentdata));
            history.push("/admin/ScheduleConfirmation");
          }
        })
        .catch((err) => {
          console.log("error......", err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  shipmentStatusChange = async (ShippingID) => {
    try {
      let data = {
        ShippingID: ShippingID,
        UserID: CommonConfig.loggedInUserData().PersonID,
      };
      await api
        .post("scheduleshipment/changeShipmentStatus", data)
        .then((res) => {
          return res.success;
        })
        .catch((err) => {
          console.log("error....", err);
          return false;
        });
    } catch (err) {
      console.log("error......", err);
    }
  };
  sendState() {
    return this.state;
  }

  render() {
    const {
      simpleSelect,
      salesleaddata,
      info_FromCountry,
      info_FromAddressline1,
      info_FromAddressline2,
      info_FromAddressline3,
      info_FromEmail,
      info_FromPhone,
      info_FromName,
      info_ToAddressline1,
      info_ToAddressline2,
      info_ToAddressline3,
      info_FromCity,
      info_FromState,
      info_FromZipCode,
      info_ToEmail,
      info_ToName,
      info_ToPhone,
      info_ToCountry,
      info_ToState,
      info_ToZipCode,
      info_ToCity,
      info_servicename,
      info_Subservicename,
      info_PackageNumber,
      info_WeightType,
      info_Packagetype,
      info_PackageLength,
      info_PackageWeight,
      info_PackageWidth,
    } = this.state;
    const new_tostate =
      typeof info_ToState === "object" ? info_ToState.label : info_ToState;
    const new_tocity =
      typeof info_ToCity === "object" ? info_ToCity.label : info_ToCity;
    const new_fromstate =
      typeof info_FromState === "object"
        ? info_FromState.label
        : info_FromState;
    const new_fromcity =
      typeof info_FromCity === "object" ? info_FromCity.label : info_FromCity;

    const { checkedTerm, BillMyAccountNumber } = this.state;
    return (
      <div>
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}

        <form>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              {this.state.IsBillMyAccount === false ? (
                <div className="note-cs">
                  <p>
                    {this.state.shipMentType === "Ocean"
                      ? OceanNotes
                      : AIRNotes}
                  </p>
                </div>
              ) : null}
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              {this.state.getratedomain ? (
                // <div className="payment-info-outer">
                //   <GridContainer>
                //     <GridItem xs={12} sm={6} md={6}>
                //       <div className="pay-address">
                //         <span>From Address :</span>
                //         <p>
                //           {info_FromAddressline1},{info_FromCity},
                //           {info_FromState},{info_FromCountry},{info_FromZipCode}
                //         </p>
                //         <div className="side-arrow">
                //           <ArrowForwardIosIcon />
                //         </div>
                //       </div>
                //     </GridItem>
                //     <GridItem xs={12} sm={6} md={6}>
                //       <div className="pay-address">
                //         <span>To Address :</span>
                //         <p>
                //           {info_ToAddressline1},{info_ToCity},{info_ToState},
                //           {info_ToCountry},{info_ToZipCode}
                //         </p>
                //       </div>
                //     </GridItem>
                //   </GridContainer>
                //   <GridContainer>
                //     <GridItem xs={12} sm={6} md={6}>
                //       <div className="service-name">
                //         <span>ServiceName :</span>
                //         <div className="selected-service">
                //           <img src={seviceimage}></img>
                //           <p>{info_servicename}</p>
                //         </div>
                //         <div className="truck-icn">
                //           <LocalShippingIcon />
                //         </div>
                //       </div>
                //     </GridItem>
                //     <GridItem xs={12} sm={6} md={6}>
                //       <div className="service-amount">
                //         <div className="paument-icn">
                //           <PaymentIcon />
                //         </div>
                //         <span>Amount :</span>
                //         <p>{this.state.getratedomain}</p>
                //       </div>
                //     </GridItem>
                //   </GridContainer>
                // </div>
                <div className="payment-info-outer">
                  <p>
                    <span>Ship From:</span>
                    {info_FromName} - {info_FromAddressline1}
                    {info_FromAddressline2} {info_FromAddressline3},
                    {info_FromCity},{info_FromState},{info_FromCountry},
                    {info_FromZipCode} | Phone: {info_FromPhone} | Email:
                    {info_FromEmail}
                  </p>
                  <p>
                    <span>Ship To:</span>
                    {info_ToName} - {info_ToAddressline1} {info_ToAddressline2}{" "}
                    {info_ToAddressline3},{new_tocity},{new_tostate} ,
                    {info_ToCountry},{info_ToZipCode}| Phone: {info_ToPhone}{" "}
                    {info_ToEmail ? "| Email : ".concat(info_ToEmail) : null}
                  </p>
                  <p className="spl">
                    <GridContainer>
                      <GridItem xs={12} sm={6} md={6} className="border-right">
                        <font className="relative">
                          <span>Package Details:</span>
                          {info_Packagetype} {info_PackageNumber}{" "}
                          {info_WeightType},{info_PackageLength}x
                          {info_PackageWidth}x{info_PackageWeight}
                        </font>
                      </GridItem>
                      <GridItem xs={12} sm={6} md={6}>
                        <font className="relative">
                          <span>Shipment Type:</span>
                          {info_servicename}, {info_Subservicename}
                        </font>
                        {/* <font className="relative">
                          <span>Sub Service Type:</span>
                          {info_Subservicename}
                        </font> */}
                      </GridItem>
                    </GridContainer>
                  </p>
                  <p className="last">
                    <span>Amount: </span>
                    <b> $ {this.state.getratedomain}</b>
                  </p>
                </div>
              ) : null}
              <div className="payment-type">
                <p>Selected Payment Type</p>
                <div className="radio-inline">
                  <label>
                    <Radio
                      name="Pay Online"
                      value={this.state.selectPayonline}
                      checked={
                        this.state.selectedPaymentType === "Pay Online"
                          ? true
                          : false
                      }
                      onChange={(event) => this.onlinepaymentChange(event)}
                    />
                    Credit Card
                  </label>
                  <label>
                    <Radio
                      name="Bank Details"
                      value={this.state.selectBank}
                      checked={
                        this.state.selectedPaymentType === "Bank Details"
                          ? true
                          : false
                      }
                      onChange={(event) => this.bankpaymentChange(event)}
                    />
                    Bank
                  </label>
                  {/* {this.state.IsBillMyAccount ? ( */}
                  <label>
                    <Radio
                      name="Bill My Account"
                      value={this.state.selectBank}
                      checked={
                        this.state.selectedPaymentType === "Bill My Account"
                          ? true
                          : false
                      }
                      onChange={(event) => this.billmyAccountChange(event)}
                    />
                    Bill My Account
                  </label>
                  {/* ) : null} */}
                </div>
              </div>
            </GridItem>
          </GridContainer>

          {this.state.hidePayonline === true ? (
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
                        onChange: (event) =>
                          this.handleBlur(event, "nameoncard"),
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
                        onChange: (event) =>
                          this.handleBlur(event, "cardnumber"),
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
                      <InputLabel className={classes.selectLabel}>
                        Month
                      </InputLabel>
                      <Select
                        value={this.state.month_value}
                        onChange={(event) => this.changemonth(event)}
                        onFocus={() =>
                          this.setState({
                            monthErr: false,
                            monthHelperText: "",
                          })
                        }
                      >
                        {this.appendMonths()}
                      </Select>
                      <FormHelperText>
                        {this.state.monthHelperText}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <div className="select-spl">
                    <FormControl fullWidth error={this.state.yearErr}>
                      <InputLabel className={classes.selectLabel}>
                        Year
                      </InputLabel>
                      <Select
                        value={this.state.year_value}
                        onChange={(event) => this.changeyear(event)}
                        onFocus={() =>
                          this.setState({ yearErr: false, yearHelperText: "" })
                        }
                      >
                        {this.appendYears()}
                      </Select>
                      <FormHelperText>
                        {this.state.yearHelperText}
                      </FormHelperText>
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
                      onBlur: (event) =>
                        this.handleBlur(event, "billingzipcode"),
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
          ) : null}

          {this.state.hideSelectbank === true ? (
            <GridItem
              xs={12}
              sm={12}
              md={12}
              className="payment-secion-main-outer"
            >
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Name On Bank Account"
                    id="nameonbankaccount"
                    error={this.state.NameOnBankAccountErr}
                    helperText={this.state.NameOnBankAccountHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      onBlur: (event) =>
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
                      onBlur: (event) => this.handleBlur(event, "bankname"),
                      onFocus: () =>
                        this.setState({
                          BankNameErr: false,
                          BanknameHelperText: "",
                        }),
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
                      onBlur: (event) =>
                        this.handleBlur(event, "accountnumber"),
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
                      onBlur: (event) =>
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
                      onBlur: (event) =>
                        this.handleBlur(event, "abaroutingnumber"),
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
                      onBlur: (event) =>
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
          ) : null}
          {this.state.hideBillMyAccount === true ? (
            <div className="billmy-account">
              Bill all charges to account number : {BillMyAccountNumber}
            </div>
          ) : null}

          <GridItem xs={12} sm={12} md={12}>
            {/* <FormControl fullWidth className="input-select-outer" error={this.state.selectTermErr} > */}
            <Checkbox
              value="primary"
              checked={this.state.selectTerm}
              onChange={(event) => this.handleSelectTerm(event)}
              inputProps={{ "aria-label": "primary checkbox" }}
            />
            <Link onClick={this.handleTerms}>
              I Agree to below Terms and Condition
            </Link>
            <Dialog
              maxWidth="lg"
              id="dialog"
              onClose={checkedTerm}
              aria-labelledby="customized-dialog-title"
              open={checkedTerm}
            >
              <DialogTitle
                id="customized-dialog-title"
                onClose={this.handleClose}
              >
                SFL Worldwide LLC Terms and Conditions
                {/* <MuiDialogTitle disableTypography className={classes.root}> */}
                {this.handleClose ? (
                  <IconButton
                    aria-label="close"
                    className="modal-close"
                    onClick={this.handleClose}
                  >
                    <CloseIcon className={classes.closeButton} />
                  </IconButton>
                ) : null}{" "}
                {/* </MuiDialogTitle>{" "} */}
              </DialogTitle>
              <DialogContent dividers>
                <div
                  style={{
                    padding: 3,
                    fontSize: 12,
                    height: 200,
                    overflowY: "scroll",
                  }}
                >
                  <p>
                    These SFL Worldwide LLC Terms and Conditions, contained in
                    the SFL Worldwide LLC Terms & Conditions, supersede all
                    previous terms and conditions, amendments, supplements, and
                    other prior statements concerning the rates and conditions
                    of SFL Worldwide LLC service to which these terms and
                    conditions apply.
                  </p>
                  <p>
                    The SFL Worldwide LLC Terms & Conditions consists of the Our
                    Services information at SFL Worldwide.com (U.S. and U.S.
                    export); U.S., U.S. export, U.S. import and U.S. retail
                    rates; these SFL Worldwide LLC Terms and Conditions; and the
                    SFL Worldwide LLC Ground Tariff. The information in the Our
                    Services section of the SFL Worldwide LLC Terms & Conditions
                    is not part of the contract of carriage. SFL Worldwide LLC
                    reserves the right to unilaterally modify, amend, change or
                    supplement the SFL Worldwide LLC Terms & Conditions,
                    including, but not limited to, the rates, services, features
                    of service, and these terms and conditions, without notice.
                    Only an officer in the Legal Department of SFL Worldwide LLC
                    or successor positions may authorize a supplement to, or
                    modification, change or amendment of, the SFL Worldwide LLC
                    Terms & Conditions. No other agent or employee of SFL
                    Worldwide LLC, its affiliates or subsidiaries, nor any other
                    person or party, is authorized to do so. This restriction in
                    modification does not apply to a modification applicable to
                    a single customer and included in a SFL Worldwide LLC Sales
                    or SFL Worldwide LLC Customer agreement.To the extent a
                    conflict exists between a SFL Worldwide LLC Sales or SFL
                    Worldwide LLC Customer agreement and these SFL Worldwide LLC
                    Terms and Conditions, the SFL Worldwide LLC Sales or SFL
                    Worldwide LLC Customer agreement controls.
                  </p>
                  <p>
                    Any failure to enforce or apply a term, condition, or
                    provision of the SFL Worldwide LLC Terms & Conditions shall
                    not constitute a waiver of that term, condition or provision
                    or otherwise impair our right to enforce or apply such a
                    term, condition or provision in the future.
                  </p>
                  <p>International Shipments (U.S. Edition)</p>
                  <p>
                    If there is a conflict between these terms and conditions
                    and the terms and conditions on any SFL Worldwide LLC air
                    waybill, shipping label or other transit documentation, the
                    terms and conditions in the SFL Worldwide LLC Terms &
                    Conditions, as amended, modified, changed or supplemented,
                    will control to the extent they are not in conflict with the
                    rules relating to liability for international carriage
                    established by the Warsaw Convention, as amended, or
                    Montreal Convention, other applicable treaties or any
                    applicable tariff.
                  </p>
                  <p>
                    Rates and service quotations by our employees and agents are
                    based upon information you provide, but final rates and
                    service may vary based upon the shipment actually tendered
                    and the application of these terms and conditions. Rates
                    quoted will vary depending on whether <br />
                    (1) the shipper is a SFL Worldwide LLC account holder and{" "}
                    <br />
                    (2) the shipper has discounts applied to his or her account.
                  </p>
                  <p>
                    Shippers will be quoted SFL Worldwide LLC Standard List
                    Rates if they have a valid SFL Worldwide LLC account, do not
                    have discounts applied to their account and if they charge
                    their shipping to their account.
                  </p>
                  <p>
                    Shippers will be quoted Account-Specific Rates if they have
                    a valid SFL Worldwide LLC account, have discounts applied to
                    their account and if they charge their shipping to their
                    account.
                  </p>
                  <p>
                    Any conflict or inconsistency between the SFL Worldwide LLC
                    Terms & Conditions and other written or oral statements
                    concerning the rates, features of service, and terms and
                    conditions applicable to SFL Worldwide LLC international
                    services from the U.S. to international locations and many
                    terms regarding importation and inbound clearance of
                    shipments into the U.S. will be controlled by the SFL
                    Worldwide LLC Terms & Conditions, as modified, amended or
                    supplemented.
                  </p>
                  <p>
                    For the most current information regarding areas served and
                    delivery commitments, contact Customer Service at
                    1.877.741.3134
                  </p>
                  <ul style={{ listStyleType: "none" }}>
                    <li>
                      (1) What Shipment means: A shipment means all documents
                      and or parcels that travel under one airway bill, not just
                      any single document or envelope included in a shipment.
                      The sender certifies that the shipment details are
                      complete and accurate, and that shipment is properly
                      marked, addressed and packed to ensure safe
                      transportation, with ordinary care in handling. Customer
                      agrees that all shipments will be transported via air
                      courier and or cargo mode and may experience mode changes
                      during transit by carrier without any prior notice.
                      Shipment is within the carrier’s jurisdiction up until
                      carrier delivers to final destination address.
                    </li>
                    <li>
                      (2) ALL shipments are tendered to SFL Worldwide LLC via
                      our online schedule shipment system by which SFL Worldwide
                      tracks and monitors each shipment. It is responsibility of
                      the customer to make informed and educated decisions
                      related to shipment. SFL Worldwide LLC will not be held
                      responsible for customers filing complaint(s) against
                      mis-quotations, mis-communications, incorrect information
                      received by customer.
                    </li>
                    <li>
                      (3) Shipment charges will be based on dimensional or
                      actual weights, whichever is higher. Dimensional-weight
                      pricing is applicable on a per-shipment basis to all
                      shipments in customer packaging. SFL Worldwide LLC
                      packaging may also be subject to dimensional-weight
                      pricing. If the dimensional weight exceeds the actual
                      weight, charges based on the dimensional weight will be
                      assessed. Customers who fail to apply the
                      dimensional-weight calculation to a package may be
                      assessed dimensional-weight charges by SFL Worldwide LLC.
                      Packing, Overweight and Oversize charges is being charged
                      on Actuals.
                    </li>
                    <li>
                      (4) ALL Shipments will be tendered to SFL Worldwide, LLC
                      in a box/carton made of cardboard or any form of valid
                      container that can be sealed tightly to avoid damage or
                      leakage. Plastic bags, paper bags, torn suitcases are not
                      acceptable forms of container used for shipping.
                    </li>
                    <li>
                      (5) Shipments sent via FedEx or DHL carriers will be
                      brokered by them at the destination country. SFL Worldwide
                      is not responsible for any fees, duties, storage &
                      handling at destination country.
                    </li>
                    <li>
                      (6) SFL Worldwide, LLC is not responsible for notifying
                      sender of any additional documentation required at time of
                      shipment other than the shipping label and an invoice as
                      per standard requirement for shipping.
                    </li>
                    <li>
                      (7) The shipping carrier (FedEx, DHL) are responsible for
                      notifying customers on rules and regulations to be
                      followed at destination country upon shipment arrival at
                      destination country required for any clearance procedures.
                    </li>
                    <li>
                      (8) Shipments tendered to SFL Worldwide LLC going to
                      destination country, India, via SFL Worldwide LLC carrier
                      will be brokered for clearance by agents affiliated with
                      SFL Worldwide LLC. Sender or Recipient is ultimately
                      responsible for any duties and taxes levied for shipment
                      in India.
                    </li>
                    <li>
                      (9) SFL Worldwide LLC is not responsible for any delays
                      caused in transporting shipment(s) locally within
                      destination country.
                    </li>
                    <li>
                      (10) SFL Worldwide LLC will not accept shipments
                      considered prohibited and or hazardous as per United
                      States Department of Transportation (USDOT), International
                      Air Transport Association (IATA), United States
                      Transportation Security Administration (TSA) or the
                      International Civil Aviation Organization (ICAO).
                    </li>
                    <li>(11) Documentation</li>
                    <ul style={{ listStyleType: "none" }}>
                      <li>
                        a) Proper & complete documentation by the parties is
                        compulsorily required along with accurate details of the
                        SHIPPER /RECEIVER’s name addresses telephone numbers
                        email ids and forms, permits, way bills invoices,
                        STN(Stock Transfer Note) etc. as per the statutory
                        requirements.
                      </li>
                      <li>
                        b) SFL Worldwide shall not be made responsible/ liable
                        in case of any deficiency in the documents/statutory
                        requirements and no claim of grievance of nay nature
                        shall be entertained if the same is arising out of the
                        reasons mentioned herein above.
                      </li>
                      <li>
                        c) Parties hereby undertake to make good the loss to SFL
                        Worldwide in case their shipment (s) cause damage to
                        other shipments loaded in the Vehicle due to inherent
                        nature and which is wrongly declared by the parties OR
                        in case of seizure by any Government authority due to
                        improper and incomplete documentation as a result other
                        shipment(s) also get delayed resulting in a loss to SFL
                        Worldwide.
                      </li>
                    </ul>
                    <li>
                      (12) Transit Time: Please be advised that transit time
                      varies based on the carrier. Delivery times vary by
                      carrier and are not always guaranteed 100% of the time.
                      The transit times are given assuming there aren’t any
                      delays that are unforeseen unless otherwise stated. SFL
                      Worldwide, LLC will not held liable for any delays caused
                      during transit of shipment which can affect final delivery
                      of shipment at destination country.
                    </li>
                    <li>
                      (13) LIEN: SFL Worldwide shall have a right to general
                      lien over all the shipment of parties towards any dues
                      payable to SFL Worldwide.
                    </li>
                    <li>
                      (14) Liabilities Not Assumed: SFL WORLDWIDE LLC WILL NOT
                      BE LIABLE FOR ANY DAMAGES IN EXCESS OF THE DECLARED VALUE
                      OR US$100 OR THE AMOUNT SET BY THE MONTREAL OR WARSAW
                      CONVENTIONS (AS AMENDED), WHICHEVER IS GREATER, FOR
                      CARRIAGE OF A SHIPMENT ARISING FROM TRANSPORTATION SUBJECT
                      TO THE TERMS AND CONDITIONS CONTAINED IN THE SFL WORLDWIDE
                      LLC TERMS & CONDITIONS, WHETHER OR NOT SFL WORLDWIDE LLC
                      KNEW OR SHOULD HAVE KNOWN THAT SUCH DAMAGES MIGHT BE
                      INCURRED. In no event shall SFL Worldwide LLC, including,
                      without limitation, agents, contractors, employees and
                      affiliates, be liable for any special, incidental or
                      consequential damages, including, without limitation, loss
                      of profits or income, whether or not SFL Worldwide LLC had
                      knowledge that such damages might be incurred. If we
                      inadvertently accept a shipment with a destination city or
                      cities that we do not serve in a country to which SFL
                      Worldwide LLC international services are provided, we may
                      attempt to complete the delivery. However, we will not be
                      liable and we will not provide any proof of delivery. The
                      delivery commitment listed for such country will not
                      apply, and the applicable rate will be the highest for
                      that country plus the maximum extended service area
                      surcharge. In these cases, the money-back guarantee
                      applies only to the portion of the transportation provided
                      directly by us. We will not be liable or responsible for
                      loss, damage or delay caused by events we cannot control.
                      We will not be liable for, nor will any adjustment, refund
                      or credit of any kind be given as a result of any loss,
                      damage, delay, mis-delivery, non-delivery, misinformation
                      or any failure to provide information, except such as may
                      result from our sole negligence. We will not be liable
                      for, nor will any adjustment, refund or credit of any kind
                      be given as a result of, any loss, damage, delay,
                      misdelivery, non-delivery, misinformation or failure to
                      provide information caused by or resulting in whole or in
                      part from:
                    </li>
                    <ul style={{ listStyleType: "none" }}>
                      <li>
                        a) The act, default or omission of any person or entity,
                        other than SFL Worldwide LLC, including those of any
                        local, state or federal government agencies.
                      </li>
                      <li>
                        b) The nature of the shipment, including any defect,
                        characteristic or inherent vice of the shipment.
                      </li>
                      <li>
                        c) Your violation of any of the terms and conditions
                        contained in the SFL Worldwide LLC Terms and Conditions,
                        as amended or supplemented, or on an air waybill,
                        standard conditions of carriage, tariff or other terms
                        and conditions applicable to your shipment, including,
                        but not limited to, the improper or insufficient
                        packing, securing, marking and addressing of shipments,
                        or use of an account number not in good credit standing,
                        or failure to give notices in the manner and time
                        prescribed.
                      </li>
                      <li>
                        d) Perils of the air, public enemies, criminal acts of
                        any person(s) or entities including, but not limited to,
                        acts of terrorism, public authorities acting with actual
                        or apparent authority, authority of law, local disputes,
                        civil commotion, hazards incident to a state of war,
                        local, national or international weather conditions (as
                        determined solely by us), local, national or
                        international disruptions in air or ground
                        transportation networks (as determined solely by us),
                        strikes or anticipated strikes (of any entity,
                        including, but not limited to, other carriers, vendors
                        or suppliers), labor disruptions or shortages caused by
                        pandemic conditions or other public health event or
                        circumstances, natural disasters (earthquakes, floods
                        and hurricanes are examples of natural disasters),
                        conditions that present a danger to our personnel, and
                        disruption or failure of communication and information
                        systems (including, but not limited to, our systems).
                      </li>
                      <li>
                        e) Our compliance with verbal or written delivery
                        instructions from the sender, recipient or persons
                        claiming to represent the shipper or recipient.
                      </li>
                      <li>
                        f) Damage or loss of articles packaged and sealed by the
                        sender or by person(s) acting at the sender's direction,
                        provided the seal is unbroken at the time of delivery,
                        the package retains its basic integrity, and the
                        recipient accepts the shipment without noting the damage
                        on the delivery record.
                      </li>
                      <li>
                        g) Our inability or failure to complete a delivery, or a
                        delay to any delivery, due to acts or omissions of
                        customs or other regulatory agencies.
                      </li>
                      <li>
                        h) Delays in delivery caused by adherence to SFL
                        Worldwide LLC policies regarding the payment of duties
                        and taxes or other charges.
                      </li>
                      <li>
                        i) Our inability to provide a copy of the delivery
                        record or a copy of the signature obtained at delivery.
                      </li>
                      <li>
                        j) Erasure of data from or the loss or irretrievability
                        of data stored on magnetic tapes, files or other storage
                        media, or erasure or damage of photographic images or
                        soundtracks from exposed film.
                      </li>
                      <li>
                        k) The loss of any personal or financial information
                        including, but not limited to, social security numbers,
                        dates of birth, driver's license numbers, credit card
                        numbers and financial account information.
                      </li>
                      <li>
                        l) Our failure to honor package-orientation graphics
                        (e.g., 'up' arrows, 'this end up' markings), 'fragile'
                        labels or other special directions concerning packages.
                      </li>
                      <li>
                        m) Your failure to ship goods in packaging approved by
                        us prior to shipment where such prior approval is
                        recommended or required.
                      </li>
                      <li>
                        n) The shipment of fluorescent tubes, neon lighting,
                        neon signs, X-ray tubes, laser tubes, light bulbs,
                        quartz crystal, quartz lamps, glass tubes such as those
                        used for specimens and glass containers such as those
                        used in laboratory test environments.
                      </li>
                      <li>
                        o) Our failure to notify you of any delay, loss or
                        damage in connection with your shipment or any
                        inaccuracy in such notice.
                      </li>
                      <li>
                        p) Shipments released without obtaining a signature if a
                        signature release is on file.
                      </li>
                      <li>
                        q) Our failure or inability to attempt to contact the
                        sender or recipient concerning an incomplete or
                        inaccurate address; incorrect, incomplete, inaccurate or
                        missing documentation; payment of duties and taxes
                        necessary to release a shipment; or an incomplete or
                        incorrect customs broker's address.
                      </li>
                      <li>
                        r) The failure to properly designate a delivery address
                        as a Residential Delivery or Commercial Delivery,
                        including delivery addresses that were processed through
                        any address verification function or program.
                      </li>
                      <li>
                        s) Any package where SFL Worldwide LLC records do not
                        reflect that the package was tendered to SFL Worldwide
                        LLC by the shipper.
                      </li>
                      <li>
                        t) The shipper's failure to delete all shipments entered
                        into a SFL Worldwide LLC self-invoicing system, Internet
                        shipping device or any other electronic shipping method
                        used to ship a package, when the shipment is not
                        tendered to SFL Worldwide LLC. If you fail to do so and
                        seek a refund, credit or invoice adjustment, you must
                        comply with the notice provisions in Invoice
                        Adjustments/Overcharges in the Billing section. SFL
                        Worldwide LLC is not liable for any refund, credit or
                        adjustment unless you comply with those notice
                        provisions.
                      </li>
                      <li>
                        u) Your use of an incomplete, inaccurate, or invalid SFL
                        Worldwide LLC account number or your failure to provide
                        a valid SFL Worldwide LLC account number in good credit
                        standing in the billing instructions on shipping
                        documentation.
                      </li>
                      <li>
                        v) Damage to briefcases, luggage, garment bags, aluminum
                        cases, plastic cases, or other items when not enclosed
                        in outer packaging, or other general shipping containers
                        caused by adhesive labels, soiling or marking incidental
                        to transportation.
                      </li>
                      <li>
                        w) The shipment of perishables or commodities that could
                        be damaged by exposure to heat or cold, including, but
                        not limited to, the shipment of any alcoholic beverages,
                        plants and plant materials, tobacco products, ostrich or
                        emu eggs, or live aquaculture.
                      </li>
                      <li>
                        x) The shipper's failure to provide accurate delivery
                        address information.
                      </li>
                      <li>
                        y) Damage to computers, or any components thereof, or
                        any electronic equipment when shipped in any packaging
                        other than:
                      </li>
                      <ul style={{ listStyleType: "none" }}>
                        <li>
                          a. The manufacturer's original packaging, which is
                          undamaged and has retained a good, rigid condition.
                        </li>
                        <li>
                          b. Packaging that is in accordance with the SFL
                          Worldwide LLC packaging guidelines available online at
                          SFL Worldwide LLC.com/packaging.
                        </li>
                        <li>
                          c. SFL Worldwide LLC laptop packaging, for shipments
                          of laptop computers.
                        </li>
                        <li>
                          d. SFL Worldwide LLC small electronic device
                          packaging, for shipments of cell phones, handheld
                          computers, MP3 players and similar items.
                        </li>
                      </ul>
                      <li>
                        z) Any shipment containing a prohibited item. (See the
                        Prohibited Items section.)
                      </li>
                      <ul style={{ listStyleType: "none" }}>
                        <li>
                          a. Our provision of packaging, advice, assistance or
                          guidance on the appropriate packaging of shipments
                          does not constitute acceptance of liability by SFL
                          Worldwide LLC unless such advice, assistance or
                          guidance has been approved in writing by SFL Worldwide
                          LLC Packaging Design and Development and the writing
                          expressly accepts liability in the event of a damaged
                          shipment.
                        </li>
                        <li>
                          b. Failing to meet our delivery commitment for any
                          shipments with an incomplete or incorrect address.
                          (See the Undeliverable Shipments section.)
                        </li>
                        <li>
                          c. Damages indicated by any shockwatch, tiltmeter or
                          temperature instruments.
                        </li>
                        <li>
                          d. Loss or damage to alcohol shipments unless an
                          approved packaging type is used or SFL Worldwide LLC
                          Packaging Design and Development has preapproved your
                          packaging prior to shipment. See the Alcoholic
                          Beverages section for further information.
                        </li>
                        <li>
                          e. Dangerous goods shipments that the shipper did not
                          properly declare, including proper documentation,
                          markings, labels and packaging. SFL Worldwide LLC will
                          not pay a claim on undeclared or hidden dangerous
                          goods and the SFL Worldwide LLC Money-Back Guarantee
                          does not apply.
                        </li>
                        <li>
                          f. SFL Worldwide LLC will not be liable for the
                          failure to provide any services or service options
                          where our records do not reflect that the services or
                          service options were selected by the shipper.
                        </li>
                      </ul>
                    </ul>
                    <li>
                      (15) Responsibility of Payments: Sender is responsible for
                      all transportation charges and will be billed using a
                      valid credit card via our online billing system. Unless
                      otherwise notified the recipient will be responsible for
                      all charges associated with clearance such as duties and
                      taxes at destination country. SFL Worldwide is not
                      responsible for any fees associated with storage/handling,
                      duties &taxes, customs assessment, governmental penalties
                      and fines, taxes, and legal costs, related to the
                      shipment. Customer (Sender or Recipient) will be
                      responsible for any costs incurred in returning shipment
                      to origin and or storing the shipment at our warehouse at
                      destination country.
                    </li>
                    <ul style={{ listStyleType: "none" }}>
                      <li>
                        a. All charges will be made with a valid credit card
                        (Visa, Master, Discover)
                      </li>
                      <li>
                        b. Shipment charges will be processed once shipment is
                        tendered to SFL Worldwide, LLC and 7 business days after
                        shipment is delivered at destination country.
                      </li>
                      <li>
                        c. Second transaction charge to customer is based on
                        weights and dimension differences at time of invoice by
                        carrier (FedEx, DHL)
                      </li>
                      <li>
                        d. All customers will have access to shipment invoices
                        via the online account on SFL Worldwide LLC’s website
                        www.sflworldwide.com
                      </li>
                      <li>
                        e. All declined, rejected and invalid credit cards will
                        incur a $5 processing fee.
                      </li>
                      <li>
                        f. If payment is not paid in full within 7 business days
                        of service then accounts will be forwarded to a third
                        party collection agency and or legal action will be
                        pursued with costs associated with legal fees and
                        attorney fees incurred by customer.
                      </li>
                    </ul>
                    <li>(16) Claims:</li>
                    <ul style={{ listStyleType: "none" }}>
                      <li>
                        A. We must receive notice of a claim due to damage
                        (visible or concealed), delay (including spoilage
                        claims) or shortage within 21 calendar days after
                        delivery of the shipment. We must receive notice of all
                        other claims, including, but not limited to, claims for
                        nondelivery or misdelivery, within 30 days after the
                        package was tendered to SFL Worldwide LLC for shipment.
                      </li>
                      <li>
                        B. Notice of claims for which you are seeking more than
                        US$100 must be in writing. All claims must be made
                        within the time limits set forth above.
                      </li>
                      <li>
                        C. Your notice of claim must include complete shipper
                        and recipient information, as well as the SFL Worldwide
                        LLC tracking number, date of shipment, number of pieces,
                        and shipment weight. Failure to provide us with notice
                        in the manner and within the time limits set forth in
                        paragraphs (A) through (B) will result in denial of your
                        claim, and we will have no liability or obligation to
                        pay your claim. The filing of a lawsuit does not
                        constitute compliance with these notice provisions.
                      </li>
                      <li>
                        D. Written documentation supporting the amount of your
                        claim must be delivered to us within 30 days after the
                        package was tendered to SFL Worldwide LLC for shipment.
                        Such documentation may include original purchase
                        invoices, estimates or invoices for repair, expense
                        statements, appraisals, final confirmation screen if
                        online order with proof of purchase, or other records.
                        These documents must be verifiable to our satisfaction.
                      </li>
                      <li>
                        E. We are not obligated to act on any claim until all
                        transportation charges have been paid. The claim amount
                        may not be deducted from these charges or from any
                        outstanding balance owed to us.
                      </li>
                      <li>
                        F. SFL Worldwide LLC reserves the right to inspect a
                        damaged shipment on the recipient's premises as well as
                        the right to retrieve the damaged package for inspection
                        at a SFL Worldwide LLC facility. The terms and
                        conditions applicable to the original shipment
                        (including any declared value) will govern the
                        disposition of all claims in connection with the
                        shipment, including any claim relative to the retrieval,
                        inspection or return of the package. All of the original
                        shipping cartons, packing and contents must be made
                        available for our inspection and retained until the
                        claim is concluded.
                      </li>
                      <li>
                        G. Except in the case of concealed damage, receipt of
                        the shipment by the recipient without written notice of
                        damage on the air waybill is prima facie evidence that
                        the shipment was delivered in good condition.
                      </li>
                      <li>
                        H. We do not accept claims from customers whose packages
                        were sent through a package consolidator.
                      </li>
                      <li>
                        I. Only one claim can be filed in connection with a
                        shipment. Acceptance of payment of a claim shall
                        extinguish any right to recover in connection with that
                        shipment.
                      </li>
                      <li>
                        J. When we resolve a claim by paying full value for a
                        shipment, we reserve the right to pick up the package
                        for salvage, and all rights, title to, and interest in
                        the package shall vest with us.
                      </li>
                      <li>
                        K. All claims must be filed online at
                        www.SFLWorldwide.com
                      </li>
                      <li>
                        L. The normal claim processing times varies case by case
                        basis. Customer(s) will be contacted once claim has been
                        approved or rejected. If approved, a check will be sent
                        to customer via mail/courier.
                      </li>
                    </ul>
                    <li>
                      (17) Right to inspect: We reserve the right to inspect
                      your shipment to ensure proper packing and check for any
                      prohibited items. Any item that violates the prohibited
                      items list will be removed and returned to sender at time
                      of inspection. Customer will be responsible for charges
                      that might be incurred in returning item. Your shipment
                      may also be inspected upon arrival at destination country
                      and by Customs officials.
                    </li>
                    <li>
                      (18) Customs Clearance: All shipments that cross
                      international borders must be cleared through customs and
                      you may also be required to provide additional information
                      to obtain clearance from other regulatory agencies in the
                      destination country prior to delivery to the recipient.
                    </li>
                    <ul style={{ listStyleType: "none" }}>
                      <li>
                        A. Except as provided under the SFL Worldwide LLC and or
                        affiliate agents will submit shipments to customs and
                        other regulatory agencies for clearance. Duties and
                        taxes or fees that may be assessed by any regulatory
                        agency may be advanced on behalf of the sender and
                        recipient provided appropriate credit arrangements have
                        been made in advance. SFL Worldwide LLC and or affiliate
                        agents may charge an ancillary clearance service fee,
                        where applicable, on international shipments for
                        clearance processing, for services requested by the
                        shipper, recipient or importer of record, or to recover
                        the costs passed to SFL Worldwide LLC by the regulatory
                        agency for regulatory filing. The types and amounts of
                        fees vary by country.
                      </li>
                      <li>
                        B. In some instances, at our option, we accept
                        instructions from recipients to use a designated customs
                        broker other than SFL Worldwide LLC (or the broker
                        selected by carrier or affiliate agents) or the broker
                        designated by the shipper. In any event, SFL Worldwide
                        LLC(or the broker selected by carrier and or affiliate
                        agents) reserves the right to clear the shipment if the
                        broker cannot be determined or will not perform
                        clearance or if complete broker information is not
                        provided (including name, address, phone number and
                        postal code).
                      </li>
                      <li>
                        C. When shipments are held by customs or other agencies
                        due to incorrect or missing documentation, we may
                        attempt first to notify the recipient. If local law
                        requires the correct information or documentation to be
                        submitted by the recipient and the recipient fails to do
                        so within a reasonable time as we may determine, the
                        shipment may be considered undeliverable. If the
                        recipient fails to supply the required information or
                        documentation, and local law allows the sender to
                        provide the same, we may attempt to notify the sender.
                        If the sender also fails to provide the information or
                        documentation within a reasonable time as we may
                        determine, the shipment will be considered
                        undeliverable. We assume no responsibility for our
                        inability to complete a delivery due to incorrect or
                        missing documentation, whether or not we attempt to
                        notify the recipient or sender.
                      </li>
                      <li>
                        D. Shipments requiring documentation in addition to the
                        SFL Worldwide LLC Air Waybill, the delivery (e.g., a
                        Commercial Invoice) may require additional transit time.
                        Proper completion of necessary documentation, with
                        complete and accurate shipment information, including
                        the appropriate Harmonized Tariff Schedule Code, is the
                        shipper's responsibility.
                      </li>
                      <li>
                        E. Shipments that contain goods or products that are
                        regulated by multiple government agencies within the
                        destination country (such as the Department of
                        Agriculture, the Food and Drug Administration, the Fish
                        and Wildlife Service and the Federal Communications
                        Commission in the U.S. and comparable agencies in the
                        destination country) may require additional time for
                        clearance.
                      </li>
                      <li>
                        F. The sender is responsible for making sure goods
                        shipped internationally are acceptable for entry into
                        the destination country. All charges for shipment to and
                        return from countries where entry is not permitted are
                        the sender's responsibility.
                      </li>
                      <li>
                        G. We assume no responsibility for shipments abandoned
                        in customs, and such shipments may be considered
                        undeliverable.
                      </li>
                      <li>
                        H. SFL Worldwide LLC does not accept any wildlife,
                        marine shipments and agricultural shipments
                      </li>
                      <li>
                        I. For shipments that must be cleared through customs by
                        the recipient, SFL Worldwide LLC and affiliated carrier
                        agents can deliver the customs paperwork to the
                        recipient, and delivery of paperwork constitutes timely
                        delivery.
                      </li>
                    </ul>
                    <li>
                      (19) Delayed Shipments: We will make every effort to
                      deliver your shipment according to our regular delivery
                      schedules. However, SFL Worldwide LLC is not liable for
                      any delays caused by inclement weather, airlines, customs,
                      traffic, political agendas, national holidays, state
                      holidays, and religious holidays. Delays can also occur
                      due to customer not available at destination to receive
                      the parcel. Customer will be responsible for any
                      demurrage/storage fees incurred if shipment is held for a
                      period of time at shipping warehouse until recipient can
                      be contacted for delivery arrangements.
                    </li>
                    <li>
                      (20) SFL Worldwide, LLC is not liable for shipments lost,
                      mis-delivered, damage due to circumstances beyond our
                      control. This include but not limited to:
                    </li>
                    <ul style={{ listStyleType: "none" }}>
                      <li>a. Weather – storms, flood</li>
                      <li>b. Earthquake</li>
                      <li>c. Political Riots</li>
                      <li>d. Strike</li>
                      <li>
                        e. “Force Majeure” such as war, plane crash or embargo
                      </li>
                      <li>
                        f. Any defect or characteristics to do with the nature
                        of shipment, even if known to us when we accept it.
                      </li>
                      <li>
                        g. Any action or omission by anyone outside SFL
                        Worldwide. For example, the sender of the shipment, the
                        receiver, an interested third party, customs or
                        government officials, the postal service, another
                        carrier or a third party who we contact to deliver to
                        destinations that we do not directly serve.
                      </li>
                      <li>
                        h. We are also not liable for electrical or magnetic
                        damage to, or erasure of, electronic or photographic
                        images or recordings
                      </li>
                    </ul>
                    <li>
                      (21) Consequential damages: We are not liable for the
                      following, whether they arise in contractor any other form
                      of civil action, including negligence, and even if they
                      are our fault:
                    </li>
                    <ul style={{ listStyleType: "none" }}>
                      <li>a. Consequential or special damages or loss</li>
                      <li>b. Other indirect loss</li>
                      <li>c. Breach of other contracts</li>
                    </ul>
                    <li>
                      (22) Consequential damages or loss include, but not
                      limited to: Income, Profit, Interest, Markets, use of
                      contents.
                    </li>
                    <ul style={{ listStyleType: "none" }}>
                      <li>
                        a. Extent of our liability: Our liability for lost or
                        damaged shipment is limited to the lowest of these 3
                        amounts:
                      </li>
                      <li>b. US $10 (or equivalent currency) or</li>
                      <li>
                        c. The actual amount of the loss or damaged or actual
                        value of the documents or parcel. This does not include
                        any commercial utility or special value to the shipper
                        or any other person
                      </li>
                    </ul>
                    <li>
                      (23) What “actual value” means: The lowest of the
                      following amounts, determined as the time and place we
                      accepted the shipment:
                    </li>
                    <ul style={{ listStyleType: "none" }}>
                      <li>
                        a. Documents (meaning any shipment without commercial
                        value)
                      </li>
                      <li>
                        b. The cost of replacing, reconstructing or
                        reconstituting the documents
                      </li>
                      <li>
                        c. Parcels (meaning any shipment with commercial value)
                      </li>
                      <li>
                        d. The cost of repairing or replacing the parcel, or
                      </li>
                      <li>e. The resale of fair market value of the parcel</li>
                      <li>
                        f. The actual value of a parcel cannot be more than
                        original cost to you plus 10%
                      </li>
                    </ul>
                  </ul>
                </div>
              </DialogContent>
            </Dialog>
            {/* <FormHelperText>{this.state.selectTermHelperText}</FormHelperText> */}
            {/* </FormControl> */}
          </GridItem>
        </form>
      </div>
    );
  }
}

Scheduleshipment.propTypes = {
  classes: PropTypes.object,
};

export default withStyles()(Scheduleshipment);
