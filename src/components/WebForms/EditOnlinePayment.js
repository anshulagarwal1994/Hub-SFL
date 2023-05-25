import React, { Component } from "react";
// react component for creating dynamic tables

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons

// core components
import GridContainer from "components/Grid/GridContainer.js";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import Icon from "@material-ui/core/Icon";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Datetime from "react-datetime";
import User from "@material-ui/icons/AccountCircle";
import CreditCard from "@material-ui/icons/CreditCard";
import BankDetails from "@material-ui/icons/AccountBalance";
import TextField from "@material-ui/core/TextField";
import api from "../../utils/apiClient";
import SimpleBackdrop from "../../utils/general";
import { CommonConfig } from "../../utils/constant";
import moment from "moment";
import { green } from "@material-ui/core/colors";
import { red } from "@material-ui/core/colors";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import cogoToast from "cogo-toast";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import EqualizerIcon from "@material-ui/icons/Equalizer";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
};

const useStyles = makeStyles(styles);

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

class EditOnlinePayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PaymentId: "",

      PaymentDate: "",
      PaymentDateErr: false,
      PaymentDateHelperText: "",

      PaymentStatus: "",
      paymentstatusErr: false,
      paymentstatusHelperText: "",
      paymentstatusCheck: false,

      ContactName: "",
      contactnameErr: false,
      contactnameHelperText: "",
      contactnameCheck: false,

      EmailAddress: "",
      emailaddressErr: false,
      emailaddressHelperText: "",
      emailaddressCheck: false,

      ContactNumber: "",
      contactnumberErr: false,
      contactnumberHelperText: "",
      contactnumberCheck: false,

      PaymentType: "",
      paymenttypeErr: false,
      paymenttypeHelperText: "",
      paymenttypeCheck: false,

      TrackingNumber: "",
      trackingnumberErr: false,
      trackingnumberHelperText: "",
      trackingnumberCheck: false,

      InvoiceAmount: "",
      invoiceamountErr: false,
      invoiceamountHelperText: "",
      invoiceamountCheck: false,

      CardType: "",
      cardtypeErr: false,
      cardtypeHelperText: "",
      cardtypeCheck: false,

      NameOnCard: "",
      nameoncardErr: false,
      nameoncardHelperText: "",
      nameoncardCheck: false,

      CardNumber: "",
      cardnumberErr: false,
      cardnumberHelperText: "",
      cardnumberCheck: false,

      CardExpDate: "",
      cardexpdateErr: false,
      cardexpdateHelperText: "",
      cardexpdateCheck: false,

      BillingZipCode: "",
      billingzipcodeErr: false,
      billingzipcodeHelperText: "",
      billingzipcodeCheck: false,

      CVV: "",
      cvvErr: false,
      cvvHelperText: "",
      cvvCheck: false,
      accountnumberCheck: true,
      routingnumberCheck: true,
      nameonaccountCheck: true,
      banknameCheck: true,

      saveErr: false,
      PaymentOption: "",
      NameonAccount: "",
      nameonaccountErr: false,
      banknameErr: false,
      accountnumberErr: false,
      routingnumberErr: false,

      BankName: "",
      banknameHelperText: "",
      routingnumberHelperText: "",
      accountnumberHelperText: "",
      nameonaccountHelperText: "",
      AccountNumber: "",
      RoutingNumber: "",

      ReadAccess: 0,
      WriteAccess: 0,
      DeleteAccess: 0,
      paymentStatus: [
        { value: "New", label: "New" },
        { value: "Open", label: "Open" },
        { value: "Closed", label: "Closed" },
        { value: "Cancelled", label: "Cancelled" },
      ],
      paymentOption: [
        { value: "Credit Card", label: "Credit Card" },
        { value: "Bank Detail", label: "Bank Detail" },
      ],
      open: false,
      close: false,
      PaidList: [],
      CommonDatePaid: "",
      CommonConfirmationNumber: "",
      CommonAllClear: "",
    };
  }

  componentDidMount() {
    this.setState({
      ReadAccess: CommonConfig.getUserAccess("Online Payment").ReadAccess,
      WriteAccess: CommonConfig.getUserAccess("Online Payment").WriteAccess,
      DeleteAccess: CommonConfig.getUserAccess("Online Payment").DeleteAccess,
    });
    this.getEditPaymentData();
  }

  reCallApi = () => {
    this.getEditPaymentData();
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClickCancel = () => {
    this.setState({ close: true, open: false });
  };

  requestChange = (event, value, type) => {
    if (type === "paymentstatus") {
      this.setState({ paymentstatusCheck: true });
      if (
        event.target.value === undefined ||
        event.target.value === "" ||
        event.target.value === null
      ) {
        this.setState({
          PaymentStatus: event.target.value,
          paymentstatusErr: true,
          paymentstatusHelperText: "Please Select any one option",
        });
      } else {
        this.setState({
          PaymentStatus: event.target.value,
          paymentstatusErr: false,
          paymentstatusHelperText: "",
        });
      }
    }
  };

  getEditPaymentData() {
    let data = { PaymentID: this.props.match.params.id };
    try {
      this.showLoader();
      api
        .post("payment/getPaymentDetailsById/", data)
        .then((result) => {
          this.setState({ Loading: false });

          if (result.data.success) {
            let trackingList = result.data.data[1];
            let j = 1;
            trackingList.map((OBJ) => {
              OBJ.Index = j++;
              OBJ.AllClear = false;
              OBJ.Balance =
                Number(OBJ.InvoiceAmount) - Number(OBJ.ReceivedAmount);
              return OBJ;
            });
            result.data.data = result.data.data[0];
            var invoice = result.data.data[0].InvoiceAmount.toFixed(2);
            this.setState({
              PaymentId: result.data.data[0].PaymentID,
              PaymentDate: result.data.data[0].CreatedOn,
              PaymentStatus: result.data.data[0].PaymentStatus,
              ContactName: result.data.data[0].ContactName,
              EmailAddress: result.data.data[0].Email,
              ContactNumber: result.data.data[0].PhoneNum,
              PaymentType: result.data.data[0].PaymentType,
              TrackingNumber: result.data.data[0].TrackingNumber,
              InvoiceAmount: "$ " + invoice,
              CardType: result.data.data[0].CardType,
              NameOnCard: result.data.data[0].CardName,
              CardNumber: result.data.data[0].CardNumber,
              CardExpDate: result.data.data[0].CardExpiry,
              BillingZipCode: result.data.data[0].CardZipCode,
              CVV: result.data.data[0].CardCVV,
              NameonAccount: result.data.data[0].NameonAccount,
              BankName: result.data.data[0].BankName,
              RoutingNumber: result.data.data[0].RoutingNumber,
              AccountNumber: result.data.data[0].AccountNumber,
              PaidList: trackingList,
            });
            this.hideLoader();
          } else {
            this.hideLoader();
            cogoToast.error("Something went wrong");
          }
        })
        .catch((err) => {
          this.hideLoader();
          cogoToast.error("Something went wrong");
        });
    } catch (err) {
      this.hideLoader();
      cogoToast.error("Something went wrong");
    }
  }

  handleOnChange = (event, type) => {
    if (type === "emailaddress") {
      this.setState({ emailaddressCheck: true });
      this.setState({
        EmailAddress: event.target.value,
        emailaddressErr: false,
        emailaddressHelperText: "",
      });
    } else if (type === "contactnumber") {
      if (event.target.value.length <= 15) {
        this.setState({ contactnumberCheck: true });
        this.setState({
          ContactNumber: event.target.value.replace(/\D/, ""),
          contactnumberErr: false,
          contactnumberHelperText: "",
        });
      }
    }
  };

  handleChange = (event, type) => {
    if (type === "paymentdate") {
      let paymentdateVal = event.target.value;
      if (paymentdateVal === "" || paymentdateVal === null) {
        this.setState({
          PaymentDate: paymentdateVal,
          PaymentDateErr: true,
          PaymentDateHelperText: "Please enter payment date",
        });
      } else {
        this.setState({
          PaymentDate: paymentdateVal,
          PaymentDateErr: false,
          PaymentDateHelperText: "",
        });
      }
    } else if (type === "emailaddress") {
      this.setState({ emailaddressCheck: true });
      let emailaddressVal = event.target.value;
      if (emailaddressVal === "" || emailaddressVal === null) {
        this.setState({
          EmailAddress: emailaddressVal,
          emailaddressErr: true,
          emailaddressHelperText: "Please enter email address",
        });
      } else if (!emailaddressVal.match(CommonConfig.RegExp.email)) {
        this.setState({
          EmailAddress: emailaddressVal,
          emailaddressErr: true,
          emailaddressHelperText: "Please enter valid email address",
        });
      } else {
        this.setState({
          EmailAddress: emailaddressVal,
          emailaddressErr: false,
          emailaddressHelperText: "",
        });
      }
    } else if (type === "contactname") {
      this.setState({ contactnameCheck: true });
      let contactnameVal = event.target.value;
      if (contactnameVal === "" || contactnameVal === null) {
        this.setState({
          ContactName: contactnameVal,
          contactnameErr: true,
          contactnameHelperText: "Please enter contact name",
        });
      } else {
        this.setState({
          ContactName: contactnameVal,
          contactnameErr: false,
          contactnameHelperText: "",
        });
      }
    } else if (type === "contactnumber") {
      this.setState({ contactnumberCheck: true });
      let contactnumberVal = event.target.value.replace(/\D/, "");
      let regExp = /^[0-9]{10,15}$/;
      if (contactnumberVal === "" || contactnumberVal === null) {
        this.setState({
          ContactNumber: contactnumberVal,
          contactnumberErr: true,
          contactnumberHelperText: "Please enter contact number",
        });
      } else if (
        contactnumberVal.trim() !== contactnumberVal ||
        !contactnumberVal.match(regExp)
      ) {
        this.setState({
          ContactNumber: contactnumberVal,
          contactnumberErr: true,
          contactnumberHelperText: "Please enter valid contact number",
        });
      } else {
        this.setState({
          ContactNumber: contactnumberVal,
          contactnumberErr: false,
          contactnumberHelperText: "",
        });
      }
    } else if (type === "trackingnumber") {
      let trackingnumberVal = event.target.value.replace(/\D/, "");

      if (trackingnumberVal === "" || trackingnumberVal === null) {
        this.setState({
          TrackingNumber: trackingnumberVal,
          trackingnumberErr: true,
          trackingnumberHelperText: "Please enter trackingnumber",
        });
      } else {
        this.setState({
          TrackingNumber: trackingnumberVal,
          trackingnumberErr: false,
          trackingnumberHelperText: "",
        });
      }
    } else if (type === "invoiceamount") {
      let invoiceamountVal = event.target.value;
      if (invoiceamountVal === "" || invoiceamountVal === null) {
        this.setState({
          InvoiceAmount: invoiceamountVal,
          invoiceamountErr: true,
          invoiceamountHelperText: "Please enter invoiceamount",
        });
      } else {
        this.setState({
          InvoiceAmount: invoiceamountVal,
          invoiceamountErr: false,
          invoiceamountHelperText: "",
        });
      }
    } else if (type === "nameoncard") {
      let nameoncardVal = event.target.value;
      this.setState({ nameoncardCheck: true });
      if (nameoncardVal === "" || nameoncardVal === null) {
        this.setState({
          NameOnCard: nameoncardVal,
          nameoncardErr: true,
          nameoncardHelperText: "Please enter nameoncard",
        });
      } else {
        this.setState({
          NameOnCard: nameoncardVal,
          nameoncardErr: false,
          nameoncardHelperText: "",
        });
      }
    } else if (type === "cardnumber") {
      this.setState({ cardtypeCheck: true });
      let cardnumberVal = event.target.value.replace(/\D/, "");
      if (cardnumberVal === "" || cardnumberVal === null) {
        this.setState({
          CardNumber: cardnumberVal,
          cardnumberErr: true,
          cardnumberHelperText: "Please enter cardnumber",
        });
      } else {
        this.setState({
          CardNumber: cardnumberVal,
          cardnumberErr: false,
          cardnumberHelperText: "",
        });
      }
    } else if (type === "cvv") {
      this.setState({ cvvCheck: true });
      let cvvVal = event.target.value.replace(/\D/, "");
      if (cvvVal === "" || cvvVal === null) {
        this.setState({
          CVV: cvvVal,
          cvvErr: true,
          cvvHelperText: "Please enter cvv",
        });
      } else {
        this.setState({ CVV: cvvVal, cvvErr: false, cvvHelperText: "" });
      }
    } else if (type === "cardexpdate") {
      this.setState({ cardexpdateCheck: true });
      let cardexpdateVal = event.target.value;
      if (cardexpdateVal === "" || cardexpdateVal === null) {
        this.setState({
          CardExpDate: cardexpdateVal,
          cardexpdateErr: true,
          cardexpdateHelperText: "Please enter cardexpdate",
        });
      } else {
        this.setState({
          CardExpDate: cardexpdateVal,
          cardexpdateErr: false,
          cardexpdateHelperText: "",
        });
      }
    } else if (type === "billingzipcode") {
      this.setState({ billingzipcodeCheck: true });
      let billingzipcodeVal = event.target.value;
      if (billingzipcodeVal === "" || billingzipcodeVal === null) {
        this.setState({
          BillingZipCode: billingzipcodeVal,
          billingzipcodeErr: true,
          billingzipcodeHelperText: "Please enter billingzipcode",
        });
      } else {
        if (!Number(billingzipcodeVal)) {
          return;
        } else {
          this.setState({
            BillingZipCode: billingzipcodeVal,
            billingzipcodeErr: false,
            billingzipcodeHelperText: "",
          });
        }
      }
    } else if (type === "cardtype") {
      this.setState({ cardtypeCheck: true });
      let cardtypeVal = event.target.value;
      if (cardtypeVal === "" || cardtypeVal === null) {
        this.setState({
          CardType: cardtypeVal,
          cardtypeErr: true,
          cardtypeHelperText: "Please enter cardtype",
        });
      } else {
        this.setState({
          CardType: cardtypeVal,
          cardtypeErr: false,
          cardtypeHelperText: "",
        });
      }
    } else if (type === "bankname") {
      this.setState({ banknameCheck: true });
      let banknameVal = event.target.value;
      if (banknameVal === "" || banknameVal === null) {
        this.setState({
          BankName: banknameVal,
          banknameErr: true,
          banknameHelperText: "Please enter bank name",
        });
      } else {
        this.setState({
          BankName: banknameVal,
          banknameErr: false,
          banknameHelperText: "",
        });
      }
    } else if (type === "nameonaccount") {
      this.setState({ nameonaccountCheck: true });
      let nameonaccountVal = event.target.value;
      if (nameonaccountVal === "" || nameonaccountVal === null) {
        this.setState({
          NameonAccount: nameonaccountVal,
          nameonaccountErr: true,
          nameonaccountHelperText: "Please enter name on account",
        });
      } else {
        this.setState({
          NameonAccount: nameonaccountVal,
          nameonaccountErr: false,
          nameonaccountHelperText: "",
        });
      }
    } else if (type === "routingnumber") {
      this.setState({ routingnumberCheck: true });
      let routingnumberVal = event.target.value.replace(/\D/, "");
      if (routingnumberVal === "" || routingnumberVal === null) {
        this.setState({
          RoutingNumber: routingnumberVal,
          routingnumberErr: true,
          routingnumberHelperText: "Please enter routiong number",
        });
      } else {
        this.setState({
          RoutingNumber: routingnumberVal,
          routingnumberErr: false,
          routingnumberHelperText: "",
        });
      }
    } else if (type === "accountnumber") {
      this.setState({ accountnumberCheck: true });
      let accountnumberVal = event.target.value.replace(/\D/, "");
      if (accountnumberVal === "" || accountnumberVal === null) {
        this.setState({
          AccountNumber: accountnumberVal,
          accountnumberErr: true,
          accountnumberHelperText: "Please enter account number",
        });
      } else {
        this.setState({
          AccountNumber: accountnumberVal,
          accountnumberErr: false,
          accountnumberHelperText: "",
        });
      }
    }
  };

  validate() {
    let IsValid = true;
    if (CommonConfig.isEmpty(this.state.EmailAddress)) {
      this.setState({
        emailaddressErr: true,
        emailaddressHelperText: "Please enter email",
      });
      IsValid = false;
    }
    if (this.state.emailaddressErr) {
      this.setState({
        emailaddressErr: true,
        emailaddressHelperText: "Please enter valid email",
      });
      IsValid = false;
    }
    if (this.state.contactnumberErr) {
      this.setState({
        contactnumberErr: true,
        contactnumberHelperText: "Please enter valid contact number",
      });
      IsValid = false;
    }
    if (CommonConfig.isEmpty(this.state.ContactNumber)) {
      this.setState({
        contactnumberErr: true,
        contactnumberHelperText: "Please enter contact number",
      });
      IsValid = false;
    }
    if (this.state.PaymentType === "Credit Card") {
      if (CommonConfig.isEmpty(this.state.CardNumber)) {
        this.setState({
          cardnumberErr: true,
          cardnumberHelperText: "Please enter card number",
        });
        IsValid = false;
      }
      if (CommonConfig.isEmpty(this.state.NameOnCard)) {
        this.setState({
          nameoncardErr: true,
          nameoncardHelperText: "Please enter name on card",
        });
        IsValid = false;
      }
      if (CommonConfig.isEmpty(this.state.CVV)) {
        this.setState({ cvvErr: true, cvvHelperText: "Please enter cvv" });
        IsValid = false;
      }
      if (CommonConfig.isEmpty(this.state.BillingZipCode)) {
        this.setState({
          billingzipcodeErr: true,
          billingzipcodeHelperText: "Please enter billing zip code",
        });
        IsValid = false;
      }
    }
    if (this.state.PaymentType === "Bank") {
      if (CommonConfig.isEmpty(this.state.NameonAccount)) {
        this.setState({
          nameonaccountErr: true,
          nameonaccountHelperText: "Please enter account number",
        });
        IsValid = false;
      }
      if (CommonConfig.isEmpty(this.state.RoutingNumber)) {
        this.setState({
          routingnumberErr: true,
          routingnumberHelperText: "Please enter routing number",
        });
        IsValid = false;
      }
      if (CommonConfig.isEmpty(this.state.AccountNumber)) {
        this.setState({
          accountnumberErr: true,
          accountnumberHelperText: "Please enter account number",
        });
        IsValid = false;
      }
      if (CommonConfig.isEmpty(this.state.BankName)) {
        this.setState({
          banknameErr: true,
          banknameHelperText: "Please enter bank name",
        });
        IsValid = false;
      }
    }
    if (CommonConfig.isEmpty(this.state.InvoiceAmount)) {
      this.setState({
        invoiceamountErr: true,
        invoiceamountHelperText: "Please enter invoice amount",
      });
      IsValid = false;
    }
    return IsValid;
  }

  Save = (redirect) => {
    if (this.validate()) {
      this.setState({ saveErr: false });
      let paidArr = this.state.PaidList;
      paidArr.map((pay) => {
        // pay.AllClear = pay.AllClear === "Yes" ? true : pay.AllClear === "No" ? false : pay.AllClear;
        pay.DatePaid = moment(pay.DatePaid).format(
          CommonConfig.dateFormat.dbDateTime
        );
        return pay;
      });
      let data = {
        PaymentID: this.state.PaymentId,
        ContactName: this.state.ContactName,
        PhoneNum: this.state.ContactNumber,
        Email: this.state.EmailAddress,
        TrackingNumber: this.state.TrackingNumber,
        InvoiceAmount: this.state.InvoiceAmount.replace("$ ", ""),
        PaymentType: this.state.PaymentType,
        CardType: this.state.CardType,
        CardName: this.state.NameOnCard,
        CardNumber: this.state.CardNumber,
        CardExpiry: this.state.CardExpDate,
        CardCVV: this.state.CVV,
        CardZipCode: this.state.BillingZipCode,
        CreatedOn: this.state.PaymentDate,
        PaymentStatus: this.state.PaymentStatus,
        BankName: this.state.BankName,
        AccountNumber: this.state.AccountNumber,
        RoutingNumber: this.state.RoutingNumber,
        NameonAccount: this.state.NameonAccount,
        userid: CommonConfig.loggedInUserData().PersonID,
        PaidList: paidArr.filter(
          (x) => CommonConfig.isEmpty(x.ConfirmationNumber) !== true
        ),
      };
      try {
        this.showLoader();
        api
          .post("payment/addPayment/", data)
          .then((result) => {
            if (result.success) {
              this.hideLoader();
              cogoToast.success("Updated Successfully");
              if (redirect) {
                this.props.history.push({
                  pathname: "/admin/OnlinePayment",
                  state: {
                    filterlist: this.props.history.location.state.filterlist,
                    sortlist: this.props.history.location.state.sortlist,
                    statusList: this.props.history.location.state.statusList,
                  },
                });
              } else {
                this.reCallApi();
              }
            } else {
              this.hideLoader();
              cogoToast.error("Something went wrong");
            }
          })
          .catch((err) => {
            this.hideLoader();
            cogoToast.error("Something went wrong");
          });
      } catch (err) {
        cogoToast.error("Something went wrong");
      }
    } else {
      this.setState({ saveErr: true });
      cogoToast.error(
        "There were errors found on the form. Please correct and resubmit."
      );
    }
  };

  handleCancel = () => {
    this.props.history.push({
      pathname: "/admin/OnlinePayment",
      state: {
        filterlist: this.props.history.location.state.filterlist,
        sortlist: this.props.history.location.state.sortlist,
        statusList: this.props.history.location.state.statusList,
      },
    });
  };
  handleSearchBack = () => {
    if (this.props.history.location.state.searchData) {
      window.location.href =
        "/admin/Search/" + this.props.history.location.state.searchData;
    } else {
      cogoToast.error("Search data not found.");
    }
  };
  showLoader = () => {
    this.setState({ Loading: true });
  };

  hideLoader = () => {
    this.setState({ Loading: false });
  };

  handleDelete = () => {
    this.setState({
      open: false,
    });
    try {
      this.showLoader();
      let data = {
        PaymentID: this.state.PaymentId,
      };
      api.post("payment/deletePaymentById", data).then((result) => {
        if (result) {
          this.hideLoader();
          cogoToast.success("Deleted Successfully");
          this.props.history.push({
            pathname: "/admin/OnlinePayment",
            state: {
              filterlist: this.props.history.location.state.filterlist,
              sortlist: this.props.history.location.state.sortlist,
              statusList: this.props.history.location.state.statusList,
            },
          });
        } else {
          this.hideLoader();
          cogoToast.error("Something went wrong");
        }
      });
    } catch (err) {
      this.hideLoader();
      cogoToast.error("Something Went Wrong");
    }
  };

  handleCommonRadio = (e, type) => {
    if (type === "AllClear") this.setState({ CommonAllClear: e.target.value });
    else if (type === "ConfirmationNumber")
      this.setState({ CommonConfirmationNumber: e.target.value });

    let payableList = this.state.PaidList;
    for (var j = 0; j < payableList.length; j++) {
      payableList[j][type] = e.target.value;
    }
    this.setState({ PaidList: payableList });
  };

  paymentDateChange = (date, idx) => {
    let payableList = this.state.PaidList;
    let index = payableList.findIndex((x) => x.Index === idx);
    payableList[index]["DatePaid"] = date;
    this.setState({ PaidList: payableList });
  };

  handleRadioChange = (e, type, idx) => {
    let payableList = this.state.PaidList;
    let index = payableList.findIndex((x) => x.Index === idx);
    payableList[index][type] = e.target.value;
    this.setState({ PaidList: payableList });
  };

  commonPaymentDate = (date) => {
    let payableList = this.state.PaidList;
    for (var j = 0; j < payableList.length; j++) {
      payableList[j]["DatePaid"] = date;
    }
    this.setState({ PaidList: payableList, CommonDatePaid: date });
  };

  viewTrackingDetails = () => {
    return this.state.PaidList.map((pay, index) => {
      return (
        <tr>
          <td>
            <Datetime
              dateFormat={"MM/DD/YYYY"}
              timeFormat={false}
              value={moment(pay.DatePaid)}
              onChange={(date) => this.paymentDateChange(date, pay.Index)}
              closeOnSelect={true}
              renderInput={(params) => (
                <TextField {...params} margin="normal" fullWidth />
              )}
            />
          </td>
          <td>{pay.TrackingNumber}</td>
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
          <td>ACH Collection</td>
          <td>{pay.AccountNumber}</td>
          <td>
            <TextField
              onChange={(event) =>
                this.handleRadioChange(event, "ConfirmationNumber", pay.Index)
              }
              value={pay.ConfirmationNumber}
            />
          </td>
          <td>
            {pay.Balance ? "$ " + parseFloat(pay.Balance).toFixed(2) : "$ 0.00"}
          </td>
          <td>
            <div className="payable-radio-single">
              <RadioGroup
                aria-label="Status"
                name="Status"
                value={pay.AllClear}
                row
                onChange={(e) =>
                  this.handleRadioChange(e, "AllClear", pay.Index)
                }
              >
                <FormControlLabel
                  value={"Yes"}
                  control={<Radio />}
                  label="Yes"
                />
                <FormControlLabel value={"No"} control={<Radio />} label="No" />
                <FormControlLabel
                  value={"Not Ready"}
                  control={<Radio />}
                  label="N/A"
                />
              </RadioGroup>
            </div>
          </td>
        </tr>
      );
    });
  };

  render() {
    const {
      PaymentDate,
      PaymentStatus,
      ContactName,
      CommonDatePaid,
      CommonConfirmationNumber,
      EmailAddress,
      ContactNumber,
      TrackingNumber,
      InvoiceAmount,
      CommonAllClear,
      NameOnCard,
      CardNumber,
      PaymentType,
      CardExpDate,
      BillingZipCode,
      CVV,
      paymentStatus,
      BankName,
      NameonAccount,
      RoutingNumber,
      AccountNumber,
      WriteAccess,
      DeleteAccess,
    } = this.state;
    const paymentstatus = {
      options: paymentStatus.map((option) => option.label),
    };

    return (
      <GridContainer className="UserList-outer">
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
        <GridItem xs={12} sm={12} md={12}>
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
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Contact Name"
                    id="contactname"
                    error={this.state.contactnameErr}
                    helperText={this.state.contactnameHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: ContactName,
                      onChange: (event) =>
                        this.handleChange(event, "contactname"),
                      onBlur: (event) =>
                        this.handleChange(event, "contactname"),
                      onFocus: (event) =>
                        this.setState({
                          contactnameCheck: false,
                          contactnameErr: false,
                          contactnameHelperText: "",
                        }),
                      endAdornment:
                        this.state.contactnameCheck !== true ? (
                          <Icon>account_box</Icon>
                        ) : this.state.contactnameErr ? (
                          <InputAdornment position="end">
                            <CloseIcon
                              style={{ color: red[500] }}
                              className={useStyles.danger}
                            />
                          </InputAdornment>
                        ) : (
                          <InputAdornment position="end">
                            {" "}
                            <DoneIcon
                              style={{ color: green[500] }}
                              className={useStyles.success}
                            />
                          </InputAdornment>
                        ),
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText=" Contact Number"
                    id="contactnumber"
                    error={this.state.contactnumberErr}
                    helperText={this.state.contactnumberHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: ContactNumber,
                      onChange: (event) =>
                        this.handleOnChange(event, "contactnumber"),
                      onBlur: (event) =>
                        this.handleChange(event, "contactnumber"),
                      onFocus: (event) =>
                        this.setState({
                          contactnumberCheck: false,
                          contactnumberErr: false,
                          contactnumberHelperText: "",
                        }),
                      endAdornment:
                        this.state.contactnumberCheck !== true ? (
                          <Icon>assignment_ind</Icon>
                        ) : this.state.contactnumberErr ? (
                          <InputAdornment position="end">
                            <CloseIcon
                              style={{ color: red[500] }}
                              className={useStyles.danger}
                            />
                          </InputAdornment>
                        ) : (
                          <InputAdornment position="end">
                            {" "}
                            <DoneIcon
                              style={{ color: green[500] }}
                              className={useStyles.success}
                            />
                          </InputAdornment>
                        ),
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Email Address *"
                    id="registeremail"
                    error={this.state.emailaddressErr}
                    helperText={this.state.emailaddressHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: EmailAddress,
                      onChange: (event) =>
                        this.handleOnChange(event, "emailaddress"),
                      onBlur: (event) =>
                        this.handleChange(event, "emailaddress"),
                      onFocus: (event) =>
                        this.setState({
                          emailaddressCheck: false,
                          emailaddressErr: false,
                          emailaddressHelperText: "",
                        }),
                      endAdornment:
                        this.state.emailaddressCheck !== true ? (
                          <Icon>email </Icon>
                        ) : this.state.emailaddressErr ? (
                          <InputAdornment position="end">
                            <CloseIcon
                              style={{ color: red[500] }}
                              className={useStyles.danger}
                            />
                          </InputAdornment>
                        ) : (
                          <InputAdornment position="end">
                            {" "}
                            <DoneIcon
                              style={{ color: green[500] }}
                              className={useStyles.success}
                            />
                          </InputAdornment>
                        ),
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Tracking Number"
                    id="trackingnumber"
                    error={this.state.trackingnumberErr}
                    helperText={this.state.trackingnumberHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: TrackingNumber,
                      onChange: (event) =>
                        this.handleChange(event, "trackingnumber"),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icon>local_shipping</Icon>
                        </InputAdornment>
                      ),
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Date"
                    id="date"
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: moment(PaymentDate).format(
                        CommonConfig.dateFormat.dateTime
                      ),
                      disabled: true,
                      onChange: (event) =>
                        this.handleChange(event, "paymentdate"),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icon>calendar_today </Icon>
                        </InputAdornment>
                      ),
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <FormControl fullWidth>
                    <Autocomplete
                      {...paymentstatus}
                      id="Payment Status"
                      value={PaymentStatus}
                      onBlur={(event, value) =>
                        this.requestChange(event, value, "paymentstatus")
                      }
                      onFocus={(event) =>
                        this.setState({
                          paymentstatusCheck: false,
                          paymentstatusErr: false,
                          paymentstatusHelperText: "",
                        })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={this.state.paymentstatusErr}
                          helperText={this.state.paymentstatusHelperText}
                          label="Payment Status"
                          fullWidth
                        />
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridContainer justify="left">
                  <GridItem xs={12} sm={12} md={6}>
                    <FormControl
                      fullWidth
                      className="input-select-outer"
                    ></FormControl>
                  </GridItem>
                </GridContainer>
              </GridContainer>
            </CardBody>
          </Card>
          {PaymentType === "Credit Card" ? (
            <Card>
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <CreditCard />
                </CardIcon>

                <h4 className="margin-right-auto text-color-black">
                  Credit Card Details
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Card Number"
                      id="cardnumber"
                      error={this.state.cardnumberErr}
                      helperText={this.state.cardnumberHelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: CardNumber,
                        onChange: (event) =>
                          this.handleChange(event, "cardnumber"),
                        onBlur: (event) =>
                          this.handleChange(event, "cardnumber"),
                        onFocus: (event) =>
                          this.setState({
                            cardnumberCheck: false,
                            cardnumberErr: false,
                            cardnumberHelperText: "",
                          }),
                        endAdornment:
                          this.state.cardnumberCheck !== true ? (
                            <Icon>chrome_reader_mode</Icon>
                          ) : this.state.cardnumberErr ? (
                            <InputAdornment position="end">
                              <CloseIcon
                                style={{ color: red[500] }}
                                className={useStyles.danger}
                              />
                            </InputAdornment>
                          ) : (
                            <InputAdornment position="end">
                              {" "}
                              <DoneIcon
                                style={{ color: green[500] }}
                                className={useStyles.success}
                              />
                            </InputAdornment>
                          ),
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText=" Invoice Amount"
                      id="invoiceamount"
                      error={this.state.invoiceamountErr}
                      helperText={this.state.invoiceamountHelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: InvoiceAmount,
                        onChange: (event) =>
                          this.handleChange(event, "invoiceamount"),
                        onBlur: (event) =>
                          this.handleChange(event, "invoiceamount"),
                        onFocus: (event) =>
                          this.setState({
                            invoiceamountCheck: false,
                            invoiceamountErr: false,
                            invoiceamountHelperText: "",
                          }),
                        endAdornment:
                          this.state.emailaddressCheck !== true ? (
                            <Icon>receipt</Icon>
                          ) : this.state.invoiceamountErr ? (
                            <InputAdornment position="end">
                              <CloseIcon
                                style={{ color: red[500] }}
                                className={useStyles.danger}
                              />
                            </InputAdornment>
                          ) : (
                            <InputAdornment position="end">
                              {" "}
                              <DoneIcon
                                style={{ color: green[500] }}
                                className={useStyles.success}
                              />
                            </InputAdornment>
                          ),
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Name on Card"
                      id="nameoncard"
                      error={this.state.nameoncardErr}
                      helperText={this.state.nameoncardHelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: NameOnCard,
                        onChange: (event) =>
                          this.handleChange(event, "nameoncard"),
                        onBlur: (event) =>
                          this.handleChange(event, "nameoncard"),
                        onFocus: (event) =>
                          this.setState({
                            nameoncardCheck: false,
                            nameoncardErr: false,
                            nameoncardHelperText: "",
                          }),
                        endAdornment:
                          this.state.nameoncardCheck !== true ? (
                            <Icon>perm_contact_calendar</Icon>
                          ) : this.state.nameoncardErr ? (
                            <InputAdornment position="end">
                              <CloseIcon
                                style={{ color: red[500] }}
                                className={useStyles.danger}
                              />
                            </InputAdornment>
                          ) : (
                            <InputAdornment position="end">
                              {" "}
                              <DoneIcon
                                style={{ color: green[500] }}
                                className={useStyles.success}
                              />
                            </InputAdornment>
                          ),
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="CVV"
                      id="cvv"
                      error={this.state.cvvErr}
                      helperText={this.state.cvvHelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: CVV,
                        onChange: (event) => this.handleChange(event, "cvv"),
                        onBlur: (event) => this.handleChange(event, "cvv"),
                        onFocus: (event) =>
                          this.setState({
                            cvvCheck: false,
                            cvvErr: false,
                            cvvHelperText: "",
                          }),
                        endAdornment:
                          this.state.cvvCheck !== true ? (
                            <Icon>credit_card</Icon>
                          ) : this.state.cvvErr ? (
                            <InputAdornment position="end">
                              <CloseIcon
                                style={{ color: red[500] }}
                                className={useStyles.danger}
                              />
                            </InputAdornment>
                          ) : (
                            <InputAdornment position="end">
                              {" "}
                              <DoneIcon
                                style={{ color: green[500] }}
                                className={useStyles.success}
                              />
                            </InputAdornment>
                          ),
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText=" Card Exp. Date"
                      id="cardexpdate"
                      error={this.state.cardexpdateErr}
                      helperText={this.state.cardexpdateHelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: CardExpDate,
                        onChange: (event) =>
                          this.handleChange(event, "cardexpdate"),
                        onBlur: (event) =>
                          this.handleChange(event, "cardexpdate"),
                        onFocus: (event) =>
                          this.setState({
                            cardexpdateCheck: false,
                            cardexpdateErr: false,
                            cardexpdateHelperText: "",
                          }),
                        endAdornment:
                          this.state.cardexpdateCheck !== true ? (
                            <Icon>calendar_today</Icon>
                          ) : this.state.cardexpdateErr ? (
                            <InputAdornment position="end">
                              <CloseIcon
                                style={{ color: red[500] }}
                                className={useStyles.danger}
                              />
                            </InputAdornment>
                          ) : (
                            <InputAdornment position="end">
                              {" "}
                              <DoneIcon
                                style={{ color: green[500] }}
                                className={useStyles.success}
                              />
                            </InputAdornment>
                          ),
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Billing Zip Code"
                      id="billingzipcode "
                      error={this.state.billingzipcodeErr}
                      helperText={this.state.billingzipcodeHelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: BillingZipCode,
                        onFocus: (event) =>
                          this.setState({
                            billingzipcodeCheck: false,
                            billingzipcodeErr: false,
                            billingzipcodeHelperText: "",
                          }),
                        onChange: (event) =>
                          this.handleChange(event, "billingzipcode"),
                        onBlur: (event) =>
                          this.handleChange(event, "billingzipcode"),
                        endAdornment:
                          this.state.billingzipcodeCheck !== true ? (
                            <Icon>drafts</Icon>
                          ) : this.state.billingzipcodeErr ? (
                            <InputAdornment position="end">
                              <CloseIcon
                                style={{ color: red[500] }}
                                className={useStyles.danger}
                              />
                            </InputAdornment>
                          ) : (
                            <InputAdornment position="end">
                              {" "}
                              <DoneIcon
                                style={{ color: green[500] }}
                                className={useStyles.success}
                              />
                            </InputAdornment>
                          ),
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer justify="center">
                  <div>
                    <Dialog
                      open={this.state.open}
                      onClose={this.state.close}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"Confirm Delete"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Are you sure want to delete?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={this.handleClickCancel}
                          color="primary"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={this.handleDelete}
                          color="primary"
                          autoFocus
                        >
                          Delete
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                </GridContainer>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <BankDetails />
                </CardIcon>
                <h4 className="margin-right-auto text-color-black">
                  Bank Details
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer justify="center">
                  <GridItem xs={12}>
                    <CustomInput
                      labelText={<span> Name on Bank Account </span>}
                      id="nameonbankaccount"
                      error={this.state.nameonaccountErr}
                      helperText={this.state.nameonaccountHelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: NameonAccount,
                        onChange: (event) =>
                          this.handleChange(event, "nameonaccount"),
                        onBlur: (event) =>
                          this.handleChange(event, "nameonaccount"),
                        onFocus: (event) =>
                          this.setState({
                            nameonaccountCheck: false,
                            nameonaccountErr: false,
                            nameonaccountHelperText: "",
                          }),
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={styles.inputAdornment}
                          >
                            <Icon className={styles.User}>
                              {" "}
                              account_balance{" "}
                            </Icon>{" "}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText={<span> Bank Name </span>}
                      id="bankname"
                      error={this.state.banknameErr}
                      helperText={this.state.banknameHelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: BankName,
                        onChange: (event) =>
                          this.handleChange(event, "bankname"),
                        onBlur: (event) => this.handleChange(event, "bankname"),
                        onFocus: (event) =>
                          this.setState({
                            banknameCheck: false,
                            banknameErr: false,
                            banknameHelperText: "",
                          }),
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={styles.inputAdornment}
                          >
                            <Icon className={styles.User}>domain</Icon>{" "}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText=" Invoice Amount"
                      id="invoiceamount"
                      error={this.state.invoiceamountErr}
                      helperText={this.state.invoiceamountHelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: InvoiceAmount,
                        onChange: (event) =>
                          this.handleChange(event, "invoiceamount"),
                        onBlur: (event) =>
                          this.handleChange(event, "invoiceamount"),
                        onFocus: () =>
                          this.setState({
                            invoiceamountCheck: false,
                            invoiceamountErr: false,
                            invoiceamountHelperText: "",
                          }),
                        endAdornment:
                          this.state.emailaddressCheck !== true ? (
                            <Icon>receipt</Icon>
                          ) : this.state.invoiceamountErr ? (
                            <InputAdornment position="end">
                              <CloseIcon
                                style={{ color: red[500] }}
                                className={useStyles.danger}
                              />
                            </InputAdornment>
                          ) : (
                            <InputAdornment position="end">
                              {" "}
                              <DoneIcon
                                style={{ color: green[500] }}
                                className={useStyles.success}
                              />
                            </InputAdornment>
                          ),
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText={<span> Account Number </span>}
                      id="accountnumber"
                      error={this.state.accountnumberErr}
                      helperText={this.state.accountnumberHelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: AccountNumber,
                        onChange: (event) =>
                          this.handleChange(event, "accountnumber"),
                        onBlur: (event) =>
                          this.handleChange(event, "accountnumber"),
                        onFocus: (event) =>
                          this.setState({
                            accountnumberCheck: false,
                            accountnumberErr: false,
                            accountnumberHelperText: "",
                          }),
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={styles.inputAdornment}
                          >
                            <Icon className={styles.User}> assessment </Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText={<span> ABA Routing Number </span>}
                      id="abaroutingnumber"
                      error={this.state.routingnumberErr}
                      helperText={this.state.routingnumberHelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: RoutingNumber,
                        onChange: (event) =>
                          this.handleChange(event, "routingnumber"),
                        onBlur: (event) =>
                          this.handleChange(event, "routingnumber"),
                        onFocus: (event) =>
                          this.setState({
                            routingnumberCheck: false,
                            routingnumberErr: false,
                            routingnumberHelperText: "",
                          }),
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={styles.inputAdornment}
                          >
                            <Icon className={styles.User}>
                              {" "}
                              chrome_reader_mode{" "}
                            </Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer justify="center">
                  <div>
                    <Dialog
                      open={this.state.open}
                      onClose={this.state.close}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"Confirm Delete"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Are you sure want to delete?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={this.handleClickCancel}
                          color="primary"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={this.handleDelete}
                          color="primary"
                          autoFocus
                        >
                          Delete
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                </GridContainer>
              </CardBody>
            </Card>
          )}
          {this.state.PaidList.length ? (
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
                          <td className="semibold">Payment Date</td>
                          <td className="semibold">Tracking</td>
                          <td className="semibold">Invoice Amount</td>
                          <td className="semibold">Payment Received</td>
                          <td className="semibold">Payment Type</td>
                          <td className="semibold">Number</td>
                          <td className="semibold">Confirmation</td>
                          <td className="semibold">Balance Due</td>
                          <td className="semibold">Is Clear</td>
                        </tr>
                        {this.viewTrackingDetails()}
                        <tr>
                          <td className="semibold">
                            <Datetime
                              dateFormat={"MM/DD/YYYY"}
                              timeFormat={false}
                              value={moment(CommonDatePaid)}
                              onChange={(date) => this.commonPaymentDate(date)}
                              closeOnSelect={true}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  margin="normal"
                                  fullWidth
                                />
                              )}
                            />
                          </td>
                          <td className="semibold"></td>
                          <td className="semibold"></td>
                          <td className="semibold"></td>
                          <td className="semibold"></td>
                          <td className="semibold"></td>
                          {/* <td className="semibold right">Total:</td>
                                            <td className="semibold">{this.state.InvoiceAmount}</td> */}

                          <td className="semibold">
                            <TextField
                              onChange={(event) =>
                                this.handleCommonRadio(
                                  event,
                                  "ConfirmationNumber"
                                )
                              }
                              value={CommonConfirmationNumber}
                            />
                          </td>
                          <td className="semibold"></td>
                          <td>
                            <div className="payable-radio-single">
                              <RadioGroup
                                aria-label="Status"
                                name="Status"
                                value={CommonAllClear}
                                row
                                onChange={(e) =>
                                  this.handleCommonRadio(e, "AllClear")
                                }
                              >
                                <FormControlLabel
                                  value={"Yes"}
                                  control={<Radio />}
                                  label="Yes"
                                />
                                <FormControlLabel
                                  value={"No"}
                                  control={<Radio />}
                                  label="No"
                                />
                                <FormControlLabel
                                  value={"Not Ready"}
                                  control={<Radio />}
                                  label="N/A"
                                />
                              </RadioGroup>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </GridItem>
              </CardBody>
            </Card>
          ) : null}
          <div className="shipment-submit">
            <div className="left">
              {DeleteAccess === 1 ? (
                <Button color="danger" onClick={this.handleClickOpen}>
                  Delete
                </Button>
              ) : null}
            </div>
            <div className="right">
              {WriteAccess === 1 ? (
                <>
                  <Button color="rose" onClick={(event) => this.Save(false)}>
                    {" "}
                    Save
                  </Button>
                  <Button color="primary" onClick={(event) => this.Save(true)}>
                    {" "}
                    Save & Exit
                  </Button>
                </>
              ) : null}
              <Button color="secondary" onClick={this.handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </GridItem>
      </GridContainer>
    );
  }
}
export default EditOnlinePayment;
