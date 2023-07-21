/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import api from "../../utils/apiClient";
import { CommonConfig } from "../../utils/constant";
import cogoToast from "cogo-toast";
import SimpleBackdrop from "../../utils/general";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import InputLabel from "@material-ui/core/InputLabel";
import _ from "lodash";
import Button from "components/CustomButtons/Button.js";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import { green } from "@material-ui/core/colors";
import { red } from "@material-ui/core/colors";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import Cardbody from "components/Card/CardBody.js";
import Adduser from "@material-ui/icons/AccountCircle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormHelperText from "@material-ui/core/FormHelperText";

const useStyles = makeStyles(styles);

const classes = () => {
  return useStyles();
};

class Step1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Steps: [
        {
          stepName: "User Details",
          stepId: "userdetails",
          classname: "active",
        },
        {
          stepName: "Access Details",
          stepId: "accessdetails",
          classname: "inactive",
        },
        {
          stepName: "Markup Details",
          stepId: "markupdetails",
          classname: "inactive",
        },
      ],
      Status: "",
      UserStatusList: [
        {
          label: "Active",
          value: "Active",
        },
        {
          label: "Inactive",
          value: "Inactive",
        },
      ],
      fullName: "",
      userName: "",
      Email: "",
      EmailID: "",
      Password: "",
      Mobile: "",
      MobileID: "",
      userModules: [],
      serviceList: [],

      fullnameErr: false,
      usernameErr: false,
      emailErr: false,
      passwordErr: false,
      mobileErr: false,
      Loading: false,

      fullnameHelperText: "",
      usernameHelperText: "",
      emailHelperText: "",
      passwordHelperText: "",
      mobileHelperText: "",

      checkFullname: false,
      checkUserName: false,
      checkEmail: false,
      checkPassword: false,
      checkMobile: false,
      checkLetter: false,
      checkUpperCase: false,
      checkLowerCase: false,
      checkNumber: false,
      checkSpecialCharacter: false,
      LeadAssignment: false,
      LeadWriteClick: false,

      AccountNumber: "",
      checkAccountNumber: false,
      accountNumberErr: false,
      accountNumberHelperText: "",

      ManagedBy: "",
      managedByErr: false,
      managedByHelperText: "",
      managedByList: [],

      CompanyName: "",
      companyNameErr: false,
      companyNameHelperText: "",
      checkCompanyName: false,

      AddressLine1: "",
      addressLine1Err: false,
      addressLine1HelperText: "",
      checkAddressLine1: false,

      AddressLine2: "",
      checkAddressLine2: false,
      addressLine2Err: false,
      addressLine2HelperText: "",

      AddressLine3: "",
      checkAddressLine3: false,
      addressLine3Err: false,
      addressLine3HelperText: "",

      ZipCode: "",
      zipCodeErr: false,
      zipCodeHelperText: "",
      checkZipCode: false,

      City: "",
      cityErr: false,
      cityHelperText: "",
      checkCity: false,

      State: "",
      stateErr: false,
      stateHelperText: "",
      checkState: false,

      Country: {},
      CountryList: [],
      countryErr: false,
      countryHelperText: "",

      CityAutoComplete: false,
      StateAutoComplete: false,
      GoogleAPICityList: [],
      StateList: [],

      Mobile1: "",
      Mobile1ID: null,
      mobile1Err: false,
      mobile1HelperText: "",
      checkMobile1: false,
      UserDetailID: null,

      PaperSizeList: [],
      PaperSize: "",
      PaperReviewLink: "",
      LoginpersonId: "",
    };
  }

  componentDidMount() {
    this.showHide();
    this.getCountry();
    this.getManagedBy();
    this.getUserDetail();
    this.getPaperSizeList();
    this.setState({ LoginpersonId: CommonConfig.loggedInUserData().PersonID });
  }

  generatePreviewLink = () => {
    return this.state.PaperSizeList.map((value) => {
      return (
        <GridItem>
          <u>
            <a href={value.PaperPreviewLink} target="_blank">
              {value.PaperDisplayName}
            </a>
          </u>
        </GridItem>
      );
    });
  };

  getPaperSizeList = () => {
    try {
      api.post("userManagement/getPaperSizeList", {}).then((res) => {
        if (res.success) {
          this.setState({ PaperSizeList: res.data });
          let data = {
            pId: CommonConfig.isEmpty(this.props.location.state)
              ? 1
              : Number(this.props.location.state),
          };
          api.post("userManagement/getPaperSizeById", data).then((res) => {
            let paperData = {
              label: res.data[0].PaperDisplayName,
              value: res.data[0].ID,
            };

            this.setState({ PaperSize: paperData });
          });
        }
      });
    } catch (err) {}
  };

  getCountry() {
    try {
      api
        .get("location/getCountryList")
        .then((res) => {
          if (res.success) {
            var Country = res.data;
            this.setState({ CountryList: Country });
          }
        })
        .catch((err) => {
          console.log("err..", err);
        });
    } catch (error) {}
  }

  getManagedBy() {
    try {
      api
        .get("scheduleshipment/getShipmentManagedBy")
        .then((result) => {
          this.setState({ managedByList: result.data });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  getStates(countryData) {
    try {
      let data = {
        countryId: countryData.value,
      };

      api
        .post("location/getStateList", data)
        .then((res) => {
          if (res.success) {
            this.showLoader();

            this.setState({
              StateList: res.data,
              StateAutoComplete: res.data.length ? true : false,
            });

            this.hideLoader();
          }
        })
        .catch((err) => {
          this.hideLoader();
          console.log("err...", err);
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {
      this.hideLoader();
    }
  }

  getUserDetail() {
    try {
      this.showLoader();

      let data = {
        userId: this.props.location.state,
      };
      let calledApi = CommonConfig.isEmpty(this.props.location.state)
        ? "userManagement/getUserModule"
        : "userManagement/getUserDataByID";

      api
        .post(calledApi, data)
        .then((res) => {
          if (res.success) {
            let userData = res.data;
            debugger;
            this.setState({
              userModules: userData.userModule,
              serviceList: userData.userMarkup,
            });
            if (userData.UserData) {
              this.setState({
                Status: !CommonConfig.isEmpty(this.props.location.state)
                  ? {
                      value: userData.UserData[0].Status,
                      label: userData.UserData[0].Status,
                    }
                  : "",
                fullName: !CommonConfig.isEmpty(this.props.location.state)
                  ? userData.UserData[0].Name
                  : "",
                Email: !CommonConfig.isEmpty(this.props.location.state)
                  ? userData.UserData[0].Email
                  : "",
                userName: !CommonConfig.isEmpty(this.props.location.state)
                  ? userData.UserData[0].LoginID
                  : "",
                Mobile: !CommonConfig.isEmpty(this.props.location.state)
                  ? userData.UserData[0].PhoneNum
                  : "",
                Mobile1: !CommonConfig.isEmpty(this.props.location.state)
                  ? userData.UserData[1]
                    ? userData.UserData[1].PhoneNum
                    : ""
                  : "",
                EmailID: !CommonConfig.isEmpty(this.props.location.state)
                  ? userData.UserData[0].EmailID
                  : null,
                MobileID: !CommonConfig.isEmpty(this.props.location.state)
                  ? userData.UserData[0].PhoneID
                  : null,
                Mobile1ID: !CommonConfig.isEmpty(this.props.location.state)
                  ? userData.UserData[1]
                    ? userData.UserData[1].PhoneID
                    : null
                  : null,
              });
            }
            if (!CommonConfig.isEmpty(userData.userDetails)) {
              if (userData.userDetails[0]) {
                var Country = this.state.CountryList.filter(
                  (x) => x.CountryID === userData.userDetails[0].CountryID
                );
                var selectedCountry = Country[0]
                  ? {
                      value: Country[0].CountryID,
                      label: Country[0].CountryName,
                    }
                  : "";

                var managedBy = userData.userDetails[0]
                  ? {
                      value: userData.userDetails[0].ManagedBy,
                      label: userData.userDetails[0].ManagedByName,
                    }
                  : "";
                this.setState({
                  AccountNumber: userData.userDetails[0].AccountNumber,
                  ManagedBy: managedBy,
                  CompanyName: userData.userDetails[0].CompanyName,
                  AddressLine1: userData.userDetails[0].AddressLine1,
                  AddressLine2: userData.userDetails[0].AddressLine2,
                  AddressLine3: userData.userDetails[0].AddressLine3,
                  ZipCode: userData.userDetails[0].ZipCode,
                  City: userData.userDetails[0].City,
                  State: userData.userDetails[0].State,
                  UserDetailID: userData.userDetails[0].UserDetailID,
                  Country: selectedCountry,
                });
                this.getStates(selectedCountry.value);
              }
            }

            this.hideLoader();
          }
        })
        .catch((err) => {
          console.log("err....", err);
          this.hideLoader();
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {
      this.hideLoader();
      console.log("err....", error);
      cogoToast.error("Something Went Wrong");
    }
  }

  showLoader = () => {
    this.setState({ Loading: true });
  };

  hideLoader = () => {
    this.setState({ Loading: false });
  };

  handleChange = (event, type) => {
    if (type === "fullname") {
      let val = event.target.value;
      this.setState({ checkFullname: true });
      if (val === "" || val === null) {
        this.setState({
          fullName: val,
          fullnameErr: true,
          fullnameHelperText: "Please enter Full Name",
        });
      } else if (val.trim() !== val) {
        this.setState({
          fullName: val,
          fullnameErr: true,
          fullnameHelperText: "Please enter valid Full Name",
        });
      } else {
        this.setState({
          fullName: val,
          fullnameErr: false,
          fullnameHelperText: "",
        });
      }
    } else if (type === "username") {
      this.setState({ checkUserName: true });
      let usernameVal = event.target.value;
      if (CommonConfig.isEmpty(usernameVal)) {
        this.setState({
          userName: usernameVal,
          usernameErr: true,
          usernameHelperText: "Please enter User Name",
        });
      } else if (usernameVal.trim() !== usernameVal) {
        this.setState({
          userName: usernameVal,
          usernameErr: true,
          usernameHelperText: "Please enter valid User Name",
        });
      } else {
        this.setState({
          userName: usernameVal,
          usernameErr: false,
          usernameHelperText: "",
        });
      }
    } else if (type === "email") {
      this.setState({ checkEmail: true });
      let emailVal = event.target.value;
      let regExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9-]+\.[A-Z]{2,6}$/gi;
      if (emailVal === "" || emailVal === null) {
        this.setState({
          Email: emailVal,
          emailErr: true,
          emailHelperText: "Please enter Email",
        });
      } else if (emailVal.trim() !== emailVal || !emailVal.match(regExp)) {
        this.setState({
          Email: emailVal,
          emailErr: true,
          emailHelperText: "Please enter valid Email",
        });
      } else {
        this.setState({
          Email: emailVal,
          emailErr: false,
          emailHelperText: "",
        });
      }
    } else if (type === "mobile") {
      this.setState({ checkMobile: true });
      let mobileVal = event.target.value;
      let regExp = /^[0-9]{10,15}$/;

      if (mobileVal === "" || mobileVal === null) {
        this.setState({
          Mobile: mobileVal,
          mobileErr: true,
          mobileHelperText: "Please enter Mobile Number",
        });
      } else if (mobileVal.trim() !== mobileVal || !mobileVal.match(regExp)) {
        this.setState({
          Mobile: mobileVal,
          mobileErr: true,
          mobileHelperText: "Please enter valid Mobile Number",
        });
      } else {
        this.setState({
          Mobile: mobileVal,
          mobileErr: false,
          mobileHelperText: "",
        });
      }
    } else if (type === "password") {
      this.setState({ checkPassword: true });
      let passwordVal = event.target.value;
      let passwordLen = event.target.value.length;
      this.setState({ passwordLength: passwordLen });

      if (
        passwordVal === "" ||
        passwordVal === null ||
        passwordVal === undefined
      ) {
        this.setState({
          Password: passwordVal,
          passwordErr: true,
          passwordHelperText: "Please enter password",
        });
      } else {
        this.setState({
          Password: passwordVal,
          passwordErr: false,
          passwordHelperText: "",
        });
      }
    } else if (type === "accountnumber") {
      this.setState({ checkaccountNumber: true });
      let accountVal = event.target.value.replace(/\D/g, "");
      if (accountVal === "" || accountVal === null) {
        this.setState({
          AccountNumber: accountVal,
          accountNumberErr: true,
          accountNumberHelperText: "Please enter Account Number",
        });
      } else if (accountVal.trim() !== accountVal) {
        this.setState({
          AccountNumber: accountVal,
          accountNumberErr: true,
          accountNumberHelperText: "Please enter valid Account Number",
        });
      } else {
        this.setState({
          AccountNumber: accountVal,
          accountNumberErr: false,
          accountNumberHelperText: "",
        });
      }
    } else if (type === "companyname") {
      this.setState({ checkcompanyName: true });
      let companyVal = event.target.value;
      if (companyVal === "" || companyVal === null) {
        this.setState({
          CompanyName: companyVal,
          companyNameErr: true,
          companyNameHelperText: "Please enter Company Name",
        });
      } else {
        this.setState({
          CompanyName: companyVal,
          companyNameErr: false,
          companyNameHelperText: "",
        });
      }
    } else if (type === "addressline1") {
      this.setState({ checkAddressLine1: true });
      let addressVal = event.target.value;
      if (addressVal === "" || addressVal === null) {
        this.setState({
          AddressLine1: addressVal,
          addressLine1Err: true,
          addressLine1HelperText: "Please enter Address Line 1",
        });
      } else {
        this.setState({
          AddressLine1: addressVal,
          addressLine1Err: false,
          addressLine1HelperText: "",
        });
      }
    } else if (type === "addressline2") {
      this.setState({ checkAddressLine2: true });
      let addressVal = event.target.value;
      if (addressVal === "" || addressVal === null) {
        this.setState({
          AddressLine2: addressVal,
          addressLine2Err: true,
          addressLine2HelperText: "Please enter Address Line 2",
        });
      } else {
        this.setState({
          AddressLine2: addressVal,
          addressLine2Err: false,
          addressLine2HelperText: "",
        });
      }
    } else if (type === "addressline3") {
      this.setState({ checkAddressLine3: true });
      let addressVal = event.target.value;
      if (addressVal === "" || addressVal === null) {
        this.setState({
          AddressLine3: addressVal,
          addressLine3Err: true,
          addressLine3HelperText: "Please enter Address Line 3",
        });
      } else {
        this.setState({
          AddressLine3: addressVal,
          addressLine3Err: false,
          addressLine3HelperText: "",
        });
      }
    } else if (type === "zip") {
      this.setState({ checkZipCode: true });
      let addressVal = event.target.value.replace(/\D/g, "");
      if (addressVal === "" || addressVal === null) {
        this.setState({
          ZipCode: addressVal,
          zipCodeErr: true,
          zipCodeHelperText: "Please enter Zip Code",
        });
      } else {
        this.setState({
          ZipCode: addressVal,
          zipCodeErr: false,
          zipCodeHelperText: "",
        });
      }
    } else if (type === "City") {
      this.setState({ City: event.target.value });
    } else if (type === "State") {
      this.setState({ State: event.target.value });
    } else if (type === "mobile1") {
      this.setState({ checkMobile1: true });
      let mobileVal = event.target.value;
      let regExp = /^[0-9]{10,15}$/;

      if (mobileVal === "" || mobileVal === null) {
        this.setState({
          Mobile1: mobileVal,
          mobile1Err: true,
          mobile1HelperText: "Please enter Phone Number",
        });
      } else if (mobileVal.trim() !== mobileVal || !mobileVal.match(regExp)) {
        this.setState({
          Mobile1: mobileVal,
          mobile1Err: true,
          mobile1HelperText: "Please enter valid Mobile Number",
        });
      } else {
        this.setState({
          Mobile1: mobileVal,
          mobile1Err: false,
          mobile1HelperText: "",
        });
      }
    }
  };

  handleBlurUser = (event, type) => {
    if (type === "username") {
      let usernameVal = event.target.value;
      if (CommonConfig.isEmpty(usernameVal)) {
        this.setState({
          userName: usernameVal,
          usernameErr: true,
          usernameHelperText: "Please enter User Name",
        });
      } else if (usernameVal.trim() !== usernameVal) {
        this.setState({
          userName: usernameVal,
          usernameErr: true,
          usernameHelperText: "Please enter valid User Name",
        });
      } else if (usernameVal.length < 8) {
        this.setState({
          userName: usernameVal,
          usernameErr: true,
          usernameHelperText: "Please enter alteast 8 characters",
        });
      } else {
        this.setState({
          userName: usernameVal,
          usernameErr: false,
          usernameHelperText: "",
        });
      }
    }
  };

  handledInput = (e, id, MarkupType, Type) => {
    debugger;
    let MarkupData = this.state.serviceList;
    let i = MarkupData.findIndex((x) => x.ServiceID === id);

    let x = document.getElementsByTagName("input");
    let val = e.target.value;
    if (Type === "EnvelopMarkup") {
      if (CommonConfig.isEmpty(val)) {
        MarkupData[i].EnvelopMarkup = "";
        x[i].className = "form-control is-invalid";
      } else if (CommonConfig.RegExp.onlyNumber.test(val)) {
      } else {
        if (MarkupType === "USD") {
          MarkupData[i].EnvelopMarkup = val;
        } else if (MarkupType === "Percentage" && val < 100) {
          MarkupData[i].EnvelopMarkup = val;
        }
      }
    } else if (Type === "Markup") {
      if (CommonConfig.isEmpty(val)) {
        MarkupData[i].Markup = "";
        x[i].className = "form-control is-invalid";
      } else if (CommonConfig.RegExp.onlyNumber.test(val)) {
      } else {
        if (MarkupType === "USD") {
          MarkupData[i].Markup = val;
        } else if (MarkupType === "Percentage" && val < 100) {
          MarkupData[i].Markup = val;
        }
      }
    } else {
      if (CommonConfig.isEmpty(val)) {
        MarkupData[i].Markup = "";
        x[i].className = "form-control is-invalid";
      } else if (CommonConfig.RegExp.onlyNumber.test(val)) {
      } else {
        if (MarkupType === "USD") {
          MarkupData[i].Markup = val;
        } else if (MarkupType === "Percentage" && val < 100) {
          MarkupData[i].Markup = val;
        }
      }
    }
    this.setState({ serviceList: MarkupData });
  };

  handleBlur = (e, id, MarkupType, Type) => {
    let MarkupData = this.state.serviceList;
    let i = MarkupData.findIndex((x) => x.ServiceID === id);

    let x = document.getElementsByTagName("input");
    let val = Math.round(e.target.value).toFixed(2);
    if (Type === "EnvelopMarkup") {
      if (CommonConfig.RegExp.onlyDecimal.test(val)) {
        if (MarkupType === "USD") {
          MarkupData[i].EnvelopMarkup = parseFloat(val).toFixed(2);
          x[i].className = "form-control";
        } else if (MarkupType === "Percentage" && val < 100) {
          MarkupData[i].EnvelopMarkup = parseFloat(val).toFixed(2);
          x[i].className = "form-control";
        }
      } else {
        x[i].className = "form-control is-invalid";
      }
    } else if (Type === "Markup") {
      if (CommonConfig.RegExp.onlyDecimal.test(val)) {
        if (MarkupType === "USD") {
          MarkupData[i].Markup = parseFloat(val).toFixed(2);
          x[i].className = "form-control";
        } else if (MarkupType === "Percentage" && val < 100) {
          MarkupData[i].Markup = parseFloat(val).toFixed(2);
          x[i].className = "form-control";
        }
      } else {
        x[i].className = "form-control is-invalid";
      }
    } else {
      if (CommonConfig.RegExp.onlyDecimal.test(val)) {
        if (MarkupType === "USD") {
          MarkupData[i].Markup = parseFloat(val).toFixed(2);
          x[i].className = "form-control";
        } else if (MarkupType === "Percentage" && val < 100) {
          MarkupData[i].Markup = parseFloat(val).toFixed(2);
          x[i].className = "form-control";
        }
      } else {
        x[i].className = "form-control is-invalid";
      }
    }

    this.setState({ serviceList: MarkupData });
  };

  handledropdown = (e, id) => {
    let serviceNameList = this.state.serviceList;
    let x = serviceNameList.findIndex((x) => x.ServiceID === id);
    serviceNameList[x].MarkupType = e.target.value;
    this.setState({ serviceList: serviceNameList });
  };

  handleInputChange = (e, access) => {
    let userModules = this.state.userModules;
    let cbVal = e.target.checked;
    let cbName = e.target.name;

    if (access === "Read") {
      let x = userModules.findIndex((x) => x.MenuKey === cbName);
      userModules[x].ReadAccess = cbVal ? 1 : 0;
      this.setState({ userModules: userModules });
    }

    if (access === "Write") {
      let x = userModules.findIndex((x) => x.MenuKey === cbName);
      userModules[x].WriteAccess = cbVal ? 1 : 0;
      this.setState({ userModules: userModules });
      if (cbName === "Sales Lead") {
        this.setState({ LeadAssignment: cbVal, LeadWriteClick: true });
      }
    }

    if (access === "Delete") {
      let x = userModules.findIndex((x) => x.MenuKey === cbName);
      userModules[x].DeleteAccess = cbVal ? 1 : 0;
      this.setState({ userModules: userModules });
    }

    if (access === "All") {
      let x = userModules.findIndex((x) => x.MenuKey === cbName);
      userModules[x].AllAccess = cbVal ? 1 : 0;
      userModules[x].ReadAccess = cbVal ? 1 : 0;
      userModules[x].WriteAccess = cbVal ? 1 : 0;
      userModules[x].DeleteAccess = cbVal ? 1 : 0;
      this.setState({ userModules: userModules });
    }

    if (access === "ReadAll") {
      userModules.forEach((item) => {
        item.ReadAccess = cbVal;
      });
      this.setState({ userModules: userModules });
    }

    if (access === "WriteAll") {
      userModules.forEach((item) => {
        item.WriteAccess = cbVal;
      });
      this.setState({ userModules: userModules });
    }

    if (access === "DeleteAll") {
      userModules.forEach((item) => {
        item.DeleteAccess = cbVal;
      });
      this.setState({ userModules: userModules });
    }

    if (access === "AllAccess") {
      userModules.forEach((item) => {
        item.ReadAccess = cbVal;
        item.WriteAccess = cbVal;
        item.DeleteAccess = cbVal;
        item.AllAccess = cbVal;
      });
      this.setState({ userModules: userModules });
    }
  };

  validate() {
    let IsFormValid = true;
    if (this.state.usernameErr) {
      IsFormValid = false;
    }
    return IsFormValid;
  }

  activeInactiveUser = (e) => {
    debugger;
    this.setState({ Status: e });
    // let data = {
    //   personID: Number(this.props.location.state),
    //   status: this.state.Status.value,
    // };

    // try {
    //   this.setState({ Loading: true });
    //   api
    //     .post("userManagement/activeInactiveUser", data)
    //     .then((res) => {
    //       if (res.success) {
    //         this.getUserDetail();
    //       } else {
    //         cogoToast.error("Something Went Wrong");
    //       }
    //     })
    //     .catch((err) => {
    //       cogoToast.error("Something Went Wrong");
    //     });
    // } catch (error) {}
  };

  deleteUser = () => {
    debugger;
    this.showLoader();
    var userid = Number(this.props.location.state);
    console.log("innnnn", userid);
    var data = {
      userid: userid,
    };
    api.post("userManagement/deleteUser", data).then((res) => {
      this.hideLoader();
      console.log("res....", res);
      if (res.message === "User is Deleted Successfully") {
        cogoToast.success(res.message);
        this.props.history.push({
          pathname: "/admin/UserList",
          state: {
            filterlist: this.props.history.location.filterlist,
            sortlist: this.props.history.location.sortlist,
          },
        });
      } else {
        cogoToast.error(res.message);
      }
    });
  };
  saveUser = (redirect) => {
    if (this.validate()) {
      try {
        this.showLoader();
        let UserDetails = {
          AccountNumber: this.state.AccountNumber,
          ManagedBy: this.state.ManagedBy.value,
          CompanyName: this.state.CompanyName,
          AddressLine1: this.state.AddressLine1,
          AddressLine2: this.state.AddressLine2,
          AddressLine3: this.state.AddressLine3,
          ZipCode: this.state.ZipCode,
          City: this.state.City.value ? this.state.City.value : this.state.City,
          State: this.state.State.value
            ? this.state.State.value
            : this.state.State,
          ContactName: this.state.fullName,
          CountryID: this.state.Country.value,
          UserDetailID: this.state.UserDetailID,
          Status: this.state.Status.value,
        };

        var data = {};
        if (CommonConfig.isEmpty(this.state.Password) !== true) {
          data = {
            Name: this.state.fullName,
            UserName: this.state.userName,
            Password: this.state.Password,
            Email: this.state.Email,
            Phone: this.state.Mobile,
            Phone2: this.state.Mobile1,
            LeadAssignment: this.state.LeadAssignment,
            LeadWriteClick: this.state.LeadWriteClick,
            UserDetails: UserDetails,
            moduleData: this.state.userModules,
            markupdata: this.state.serviceList,
            UserId: CommonConfig.isEmpty(this.props.location.state)
              ? 1
              : Number(this.props.location.state),
            EmailID: this.state.EmailID,
            PhoneID: this.state.MobileID,
            Phone2ID: this.state.Mobile1ID,
            SelectedPaperSize: this.state.PaperSize.value,
            Status: this.state.Status.value,
          };
        } else {
          data = {
            Name: this.state.fullName,
            UserName: this.state.userName,
            Email: this.state.Email,
            Phone: this.state.Mobile,
            Phone2: this.state.Mobile1,
            Phone2ID: this.state.Mobile1ID,
            UserDetails: UserDetails,
            LeadAssignment: this.state.LeadAssignment,
            LeadWriteClick: this.state.LeadWriteClick,
            moduleData: this.state.userModules,
            markupdata: this.state.serviceList,
            UserId: CommonConfig.isEmpty(this.props.location.state)
              ? 1
              : Number(this.props.location.state),
            EmailID: this.state.EmailID,
            PhoneID: this.state.MobileID,
            Status: this.state.Status.value,
            SelectedPaperSize: this.state.PaperSize.value,
          };
        }
        let calledApi = CommonConfig.isEmpty(this.props.location.state)
          ? "authentication/userRegister"
          : "userManagement/updateUserByID";

        api
          .post(calledApi, data)
          .then((res) => {
            if (res.success) {
              if (!CommonConfig.isEmpty(this.props.location.state)) {
                var data = {
                  markupdata: this.state.serviceList,
                  UserId: CommonConfig.isEmpty(this.props.location.state)
                    ? 1
                    : Number(this.props.location.state),
                };
                api
                  .post("userManagement/updateMarkupByUser", data)
                  .then((res) => {
                    if (redirect) {
                      this.props.history.push({
                        pathname: "/admin/UserList",
                        state: {
                          filterlist: this.props.history.location.filterlist,
                          sortlist: this.props.history.location.sortlist,
                        },
                      });
                    } else {
                      this.getUserDetail();
                    }
                  });
              } else {
                if (redirect) {
                  this.props.history.push({
                    pathname: "/admin/UserList",
                    state: {
                      filterlist: this.props.history.location.filterlist,
                      sortlist: this.props.history.location.sortlist,
                    },
                  });
                } else {
                  this.getUserDetail();
                }
              }
            } else {
              cogoToast.error(res.message);
            }
          })
          .catch((err) => {
            this.hideLoader();
            cogoToast.error(err);
          });
      } catch (error) {
        this.hideLoader();
        cogoToast.error("Something Went Wrong");
      }
    } else {
      cogoToast.error("Please correct error and resubmit the form");
    }
  };

  cancelUser = () => {
    this.props.history.push({
      pathname: "/admin/UserList",
      state: {
        filterlist: this.props.history.location.filterlist,
        sortlist: this.props.history.location.sortlist,
      },
    });
  };

  renderMarkup = () => {
    return this.state.serviceList.map((service) => {
      const {
        ServiceID,
        ServiceName,
        DisplayName,
        Markup,
        EnvelopMarkup,
        MarkupType,
      } = service;

      return (
        <tr key={ServiceID}>
          <td>{ServiceName}</td>
          <td>{DisplayName}</td>
          <td>
            <input
              type="text"
              name="Markup"
              id="Markup"
              className="form-control"
              value={Markup}
              onChange={(event) =>
                this.handledInput(event, ServiceID, MarkupType, "Markup")
              }
              onBlur={(e) =>
                this.handleBlur(e, ServiceID, MarkupType, "Markup")
              }
            />
          </td>
          <td>
            <input
              type="text"
              name="EnvelopMarkup"
              id="EnvelopMarkup"
              className="form-control"
              value={EnvelopMarkup}
              onChange={(event) =>
                this.handledInput(event, ServiceID, MarkupType, "EnvelopMarkup")
              }
              onBlur={(e) =>
                this.handleBlur(e, ServiceID, MarkupType, "EnvelopMarkup")
              }
            />
          </td>
          <td>
            <FormControl fullWidth className={classes.selectFormControl}>
              <Select
                MenuProps={{ className: classes.selectMenu }}
                classes={{ select: classes.select }}
                value={MarkupType}
                inputProps={{
                  name: "simpleSelect",
                  id: "simple-select",
                }}
                onChange={(event) => this.handledropdown(event, ServiceID)}
              >
                <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected,
                  }}
                  value="Percentage"
                >
                  Percentage
                </MenuItem>
                <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected,
                  }}
                  value="USD"
                >
                  USD
                </MenuItem>
              </Select>
            </FormControl>
          </td>
        </tr>
      );
    });
  };

  renderModule = () => {
    return this.state.userModules.map((modules) => {
      const {
        ModuleID,
        MenuKey,
        ReadAccess,
        WriteAccess,
        DeleteAccess,
        AllAccess,
        DisplayName,
      } = modules;

      return (
        <tr>
          <td>{DisplayName}</td>
          <td>
            <div className="th-check">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={ReadAccess}
                    name={MenuKey}
                    onChange={(event) => this.handleInputChange(event, "Read")}
                  />
                }
                classes={{ label: classes.label, root: classes.labelRoot }}
              />
            </div>
          </td>
          <td>
            <div className="th-check">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={WriteAccess}
                    name={MenuKey}
                    onChange={(event) => this.handleInputChange(event, "Write")}
                  />
                }
                classes={{ label: classes.label, root: classes.labelRoot }}
              />
            </div>
          </td>
          <td>
            <div className="th-check">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={DeleteAccess}
                    name={MenuKey}
                    onChange={(event) =>
                      this.handleInputChange(event, "Delete")
                    }
                  />
                }
                classes={{ label: classes.label, root: classes.labelRoot }}
              />
            </div>
          </td>
          <td>
            <div className="th-check">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={AllAccess}
                    name={MenuKey}
                    onChange={(event) => this.handleInputChange(event, "All")}
                  />
                }
                classes={{ label: classes.label, root: classes.labelRoot }}
              />
            </div>
          </td>
        </tr>
      );
    });
  };

  handleSearchBack = () => {
    if (this.props.history.location.searchData) {
      window.location.href =
        "/admin/Search/" + this.props.history.location.searchData;
    } else {
      cogoToast.error("Search data not found.");
    }
  };
  navigateChange = (key) => {
    let stepsList = this.state.Steps;
    let activeIndex = stepsList.findIndex((x) => x.classname === "active");
    if (key !== activeIndex) {
      stepsList[key]["classname"] = "active";
      stepsList[activeIndex]["classname"] = "inactive";
      this.setState({ Steps: stepsList });
      let divID = stepsList[key]["stepId"];
      let activeDiv = stepsList[activeIndex]["stepId"];
      document.getElementById(divID).style.display = "block";
      document.getElementById(activeDiv).style.display = "none";
    }
  };

  showHide() {
    document.getElementById("userdetails").style.display = "block";
    document.getElementById("accessdetails").style.display = "none";
    document.getElementById("markupdetails").style.display = "none";
  }

  zipChange = (zip) => {
    if (zip.length) {
      fetch(CommonConfig.zipCodeAPIKey(zip, this.state.Country.label))
        .then((result) => result.json())
        .then((data) => {
          this.showLoader();
          if (data["status"] === "OK") {
            if (
              data["results"][0] &&
              data["results"][0].hasOwnProperty("postcode_localities")
            ) {
              var FinalCity = [];
              var countryShortName = "";

              countryShortName = _.filter(
                data["results"][0]["address_components"],
                function(data) {
                  return data.types[0] === "country";
                }
              )[0].long_name;
              var CityData = _.filter(
                data["results"][0]["address_components"],
                function(data) {
                  if (data.types[0] == "locality") {
                    return data.types[0] === "locality";
                  }
                }
              );

              var CityData2 = _.filter(
                data["results"][0]["address_components"],
                function(data) {
                  if (data.types[0] == "neighborhood") {
                    return data.types[0] === "neighborhood";
                  }
                }
              );

              var CityData3 = _.filter(
                data["results"][0]["address_components"],
                function(data) {
                  if (data.types[0] == "administrative_area_level_2") {
                    return data.types[0] === "administrative_area_level_2";
                  }
                }
              );

              var CityData4 = _.filter(
                data["results"][0]["address_components"],
                function(data) {
                  if (data.types[0] == "administrative_area_level_1") {
                    return data.types[0] === "administrative_area_level_1";
                  }
                }
              );

              if (CityData.length > 0) {
                CityData = CityData[0].long_name;
                FinalCity.push({
                  City_code: CityData,
                  Name: CityData,
                });
                var SelectedCity = {
                  value: FinalCity[0].City_code,
                  label: FinalCity[0].Name,
                };
              } else if (CityData2.length > 0) {
                CityData2 = CityData2[0].long_name;
                FinalCity.push({
                  City_code: CityData2,
                  Name: CityData2,
                });
                var SelectedCity = {
                  value: FinalCity[0].City_code,
                  label: FinalCity[0].Name,
                };
              } else if (CityData3.length > 0) {
                CityData3 = CityData3[0].long_name;
                FinalCity.push({
                  City_code: CityData3,
                  Name: CityData3,
                });
                var SelectedCity = {
                  value: FinalCity[0].City_code,
                  label: FinalCity[0].Name,
                };
              } else if (CityData4.length > 0) {
                CityData4 = CityData4[0].long_name;
                FinalCity.push({
                  City_code: CityData4,
                  Name: CityData4,
                });
                var SelectedCity = {
                  value: FinalCity[0].City_code,
                  label: FinalCity[0].Name,
                };
              }

              var state = _.filter(
                data["results"][0]["address_components"],
                function(data) {
                  return data.types[0] === "administrative_area_level_1";
                }
              )[0].long_name;
              var SelectedState = { value: state, label: state };

              if (countryShortName === this.state.Country.label) {
                this.setState({
                  CityAutoComplete: FinalCity.length ? true : false,
                  StateAutoComplete: this.state.StateList.length ? true : false,
                  GoogleAPICityList: FinalCity,
                  State: this.state.StateList.length ? SelectedState : state,
                  City: SelectedCity,
                });
              } else {
                this.setState({
                  CityAutoComplete: false,
                  StateAutoComplete: this.state.StateList.length ? true : false,
                  GoogleAPICityList: [],
                  State: "",
                  City: "",
                });
              }
              this.hideLoader();
            } else if (data["results"][0]) {
              var FinalCity = [];
              var city = "";
              var countryShortName = "";

              countryShortName = _.filter(
                data["results"][0]["address_components"],
                function(data) {
                  return data.types[0] === "country";
                }
              )[0].long_name;

              if (
                city == "" &&
                _.filter(data["results"][0]["address_components"], function(
                  data
                ) {
                  return data.types[0] === "locality";
                }).length > 0
              ) {
                city = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    return data.types[0] === "locality";
                  }
                )[0].short_name;
              } else if (
                city == "" &&
                _.filter(data["results"][0]["address_components"], function(
                  data
                ) {
                  return data.types[0] === "administrative_area_level_3";
                }).length > 0
              ) {
                city = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    return data.types[0] === "administrative_area_level_3";
                  }
                )[0].short_name;
              } else if (
                city == "" &&
                _.filter(data["results"][0]["address_components"], function(
                  data
                ) {
                  return data.types[0] === "political";
                }).length > 0
              ) {
                city = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    return data.types[0] === "political";
                  }
                )[0].short_name;
              } else if (
                city == "" &&
                _.filter(data["results"][0]["address_components"], function(
                  data
                ) {
                  return data.types[0] === "neighborhood";
                }).length > 0
              ) {
                city = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    return data.types[0] === "neighborhood";
                  }
                )[0].short_name;
              } else if (
                city == "" &&
                _.filter(data["results"][0]["address_components"], function(
                  data
                ) {
                  return data.types[0] === "administrative_area_level_2";
                }).length > 0
              ) {
                city = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    return data.types[0] === "administrative_area_level_2";
                  }
                )[0].long_name;
              } else if (
                city == "" &&
                _.filter(data["results"][0]["address_components"], function(
                  data
                ) {
                  return data.types[0] === "administrative_area_level_1";
                }).length > 0
              ) {
                city = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    return data.types[0] === "administrative_area_level_1";
                  }
                )[0].long_name;
              } else if (city == "") {
                city = "";
              }

              var state = _.filter(
                data["results"][0]["address_components"],
                function(data) {
                  return data.types[0] === "administrative_area_level_1";
                }
              )[0].long_name;

              FinalCity.push({
                City_code: city,
                Name: city,
              });

              var SelectedCity = {
                value: FinalCity[0].City_code,
                label: FinalCity[0].Name,
              };

              var SelectedState = { value: state, label: state };

              if (countryShortName === this.state.Country.label) {
                this.setState({
                  CityAutoComplete: FinalCity.length ? true : false,
                  StateAutoComplete: this.state.StateList.length ? true : false,
                  GoogleAPICityList: FinalCity,
                  State: this.state.StateList.length ? SelectedState : state,
                  City: SelectedCity,
                });
              } else {
                this.setState({
                  CityAutoComplete: false,
                  StateAutoComplete: this.state.StateList.length ? true : false,
                  GoogleAPICityList: [],
                  State: "",
                  City: "",
                });
              }
              this.hideLoader();
            }
          } else {
            this.setState({
              CityAutoComplete: false,
              StateAutoComplete: this.state.StateList.length ? true : false,
              GoogleAPICityList: [],
              State: "",
              City: "",
            });
            this.hideLoader();
          }
        });
    }
  };

  handleZipBlur = (e, type) => {
    if (type === "zip") {
      this.zipChange(e.target.value);
    }
  };

  ChangeCountry = (value, type) => {
    if (value !== null) {
      if (type === "Country") {
        this.setState({ Country: value });
        this.getStates(value);
      } else if (type === "City") {
        this.setState({ City: value });
      } else if (type === "State") {
        this.setState({ State: value });
      } else if (type === "ManagedBy") {
        this.setState({ ManagedBy: value });
      } else if (type === "PaperSize") {
        this.setState({ PaperSize: value });
      }
    }
  };

  render() {
    const {
      fullName,
      userName,
      Email,
      Mobile,
      AccountNumber,
      ManagedBy,
      CompanyName,
      AddressLine1,
      AddressLine2,
      AddressLine3,
      ZipCode,
      City,
      State,
      Country,
      Mobile1,
    } = this.state;

    const managedBy = this.state.managedByList.map((type) => {
      return { value: type.UserID, label: type.Name };
    });

    const paperSize = this.state.PaperSizeList.map((type) => {
      return { value: type.ID, label: type.PaperDisplayName };
    });

    const userstatus = this.state.UserStatusList.map((type) => {
      return { value: type.value, label: type.label };
    });

    const CityOptions = this.state.GoogleAPICityList.map((city) => {
      return { value: city.City_code, label: city.Name };
    });
    const StateOptions = this.state.StateList.map((state) => {
      return { value: state.StateName, label: state.StateName };
    });
    const CountryOptions = this.state.CountryList.map((fromCountry) => {
      return { value: fromCountry.CountryID, label: fromCountry.CountryName };
    });
    return (
      <div>
        <GridContainer className="MuiGrid-justify-xs-center">
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <Adduser />
                </CardIcon>
                <h4 className="margin-right-auto text-color-black">
                  User Management
                </h4>
              </CardHeader>
              <Cardbody>
                <div className="shipment-nav">
                  <ul>
                    {this.state.Steps.map((step, key) => {
                      return (
                        <li>
                          <a
                            className={step.classname}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              this.navigateChange(key);
                            }}
                          >
                            <span>{step.stepName}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="shipment-content">
                  <div className="shipment-pane mt-20" id="userdetails">
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                          labelText={<span>User Name</span>}
                          id="username"
                          error={this.state.usernameErr}
                          helperText={this.state.usernameHelperText}
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onFocus: () =>
                              this.setState({
                                checkUserName: false,
                                usernameErr: false,
                                usernameHelperText: "",
                              }),
                            onBlur: (event) =>
                              this.handleBlurUser(event, "username"),
                            onChange: (event) =>
                              this.handleChange(event, "username"),
                            value: userName,
                            endAdornment:
                              this.state.checkUserName !== true ? (
                                <Icon>account_circle</Icon>
                              ) : this.state.usernameErr ? (
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
                      <GridItem xs={12} sm={12} md={3}>
                        {this.props.match.params.id ? null : (
                          <FormControl
                            fullWidth
                            className="pass-input"
                            error={this.state.passwordErr}
                          >
                            <InputLabel htmlFor="standard-adornment-password">
                              Password
                            </InputLabel>
                            <Input
                              label="Password"
                              id="password"
                              type="password"
                              value={this.state.Password}
                              formControlProps={{ fullWidth: true }}
                              aria-describedby="simple-popover"
                              helperText={this.state.passwordHelperText}
                              inputProps={{
                                onChange: (event) =>
                                  this.handleChange(event, "password"),
                                onBlur: (event) =>
                                  this.handleChange(event, "password"),
                                onFocus: () =>
                                  this.setState({
                                    passwordErr: false,
                                    passwordHelperText: "",
                                    checkPassword: true,
                                  }),
                              }}
                              endAdornment={
                                <InputAdornment position="end">
                                  <Icon>lock</Icon>
                                </InputAdornment>
                              }
                            />
                            <FormHelperText>
                              {this.state.passwordHelperText}
                            </FormHelperText>
                          </FormControl>
                        )}
                      </GridItem>
                      <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                          labelText={<span>Account Number</span>}
                          id="accountNumber"
                          name="accountNumber"
                          variant="outlined"
                          error={this.state.accountNumberErr}
                          helperText={this.state.accountNumberHelperText}
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onFocus: () =>
                              this.setState({
                                checkAccountNumber: false,
                                accountNumberErr: false,
                                accountNumberHelperText: "",
                              }),
                            onBlur: (event) =>
                              this.handleChange(event, "accountnumber"),
                            onChange: (event) =>
                              this.handleChange(event, "accountnumber"),
                            value: AccountNumber,
                            endAdornment:
                              this.state.checkAccountNumber !== true ? (
                                <Icon>person</Icon>
                              ) : this.state.accountNumberErr ? (
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
                      <GridItem xs={12} sm={12} md={3}>
                        <Autocomplete
                          id="combo-box-demo"
                          options={managedBy}
                          value={ManagedBy}
                          onChange={(event, value) =>
                            this.ChangeCountry(value, "ManagedBy")
                          }
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <TextField {...params} label="Managed By" />
                          )}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                          labelText={<span>Company Name</span>}
                          id="CompanyName"
                          name="CompanyName"
                          variant="outlined"
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onFocus: () =>
                              this.setState({
                                checkcompanyName: false,
                                companyNameErr: false,
                                companyNameHelperText: "",
                              }),
                            onBlur: (event) =>
                              this.handleChange(event, "companyname"),
                            onChange: (event) =>
                              this.handleChange(event, "companyname"),
                            value: CompanyName,
                            endAdornment:
                              this.state.checkcompanyName !== true ? (
                                <Icon>person</Icon>
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
                      <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                          labelText={<span>Address Line 1</span>}
                          id="addressline1"
                          name="addressline1"
                          variant="outlined"
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onFocus: () =>
                              this.setState({
                                checkAddressLine1: false,
                                addressLine1Err: false,
                                addressLine1HelperText: "",
                              }),
                            onBlur: (event) =>
                              this.handleChange(event, "addressline1"),
                            onChange: (event) =>
                              this.handleChange(event, "addressline1"),
                            value: AddressLine1,
                            endAdornment:
                              this.state.checkAddressLine1 !== true ? (
                                <Icon>person</Icon>
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
                      <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                          labelText={<span>Address Line 2</span>}
                          id="addressline2"
                          name="addressline2"
                          variant="outlined"
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onFocus: () =>
                              this.setState({
                                checkAddressLine2: false,
                                addressLine2Err: false,
                                addressLine2HelperText: "",
                              }),
                            onBlur: (event) =>
                              this.handleChange(event, "addressline2"),
                            onChange: (event) =>
                              this.handleChange(event, "addressline2"),
                            value: AddressLine2,
                            endAdornment:
                              this.state.checkAddressLine2 !== true ? (
                                <Icon>person</Icon>
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
                      <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                          labelText={<span>Address Line 3</span>}
                          id="addressline3"
                          name="addressline3"
                          variant="outlined"
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onFocus: () =>
                              this.setState({
                                checkAddressLine3: false,
                                addressLine3Err: false,
                                addressLine3HelperText: "",
                              }),
                            onBlur: (event) =>
                              this.handleChange(event, "addressline3"),
                            onChange: (event) =>
                              this.handleChange(event, "addressline3"),
                            value: AddressLine3,
                            endAdornment:
                              this.state.checkAddressLine3 !== true ? (
                                <Icon>person</Icon>
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
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={3}>
                        <Autocomplete
                          options={CountryOptions}
                          id="Country"
                          getOptionLabel={(option) => option.label}
                          value={Country}
                          autoSelect
                          onChange={(event, value) =>
                            this.ChangeCountry(value, "Country")
                          }
                          renderInput={(params) => (
                            <TextField {...params} label="Country" />
                          )}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                          labelText={<span>Zip</span>}
                          id="zip"
                          name="zip"
                          variant="outlined"
                          error={this.state.zipCodeErr}
                          helperText={this.state.zipCodeHelperText}
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onFocus: () =>
                              this.setState({
                                checkZipCode: false,
                                zipCodeErr: false,
                                zipCodeHelperText: "",
                              }),
                            onBlur: (event) => this.handleZipBlur(event, "zip"),
                            onChange: (event) =>
                              this.handleChange(event, "zip"),
                            value: ZipCode,
                            endAdornment:
                              this.state.checkZipCode !== true ? (
                                <Icon>person</Icon>
                              ) : this.state.zipCodeErr ? (
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
                      <GridItem xs={12} sm={12} md={3}>
                        {this.state.CityAutoComplete === false ? (
                          <CustomInput
                            labelText="City"
                            id="city"
                            formControlProps={{ fullWidth: true }}
                            inputProps={{
                              value: City,
                              onChange: (event) =>
                                this.handleChange(event, "City"),
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon>location_city</Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        ) : (
                          <Autocomplete
                            options={CityOptions}
                            id="fromcity"
                            autoSelect
                            getOptionLabel={(option) => option.label}
                            value={City}
                            onChange={(event, value) =>
                              this.ChangeCountry(event, value, "City")
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                margin="normal"
                                label="City"
                                fullWidth
                              />
                            )}
                          />
                        )}
                      </GridItem>
                      <GridItem xs={12} sm={12} md={3}>
                        {this.state.StateAutoComplete === false ? (
                          <CustomInput
                            labelText="State"
                            id="state"
                            formControlProps={{ fullWidth: true }}
                            inputProps={{
                              value: State,
                              onChange: (event) =>
                                this.handleChange(event, "State"),
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon>location_city</Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        ) : (
                          <Autocomplete
                            options={StateOptions}
                            id="State"
                            autoSelect
                            getOptionLabel={(option) => option.label}
                            value={State}
                            onChange={(event, value) =>
                              this.ChangeCountry(value, "State")
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                margin="normal"
                                label="State"
                                fullWidth
                              />
                            )}
                          />
                        )}
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                          labelText={<span>Contact Name</span>}
                          id="fullname"
                          name="fullname"
                          variant="outlined"
                          error={this.state.fullnameErr}
                          helperText={this.state.fullnameHelperText}
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onFocus: () =>
                              this.setState({
                                checkFullname: false,
                                fullnameErr: false,
                                fullnameHelperText: "",
                              }),
                            onBlur: (event) =>
                              this.handleChange(event, "fullname"),
                            onChange: (event) =>
                              this.handleChange(event, "fullname"),
                            value: fullName,
                            endAdornment:
                              this.state.checkFullname !== true ? (
                                <Icon>person</Icon>
                              ) : this.state.fullnameErr ? (
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
                      <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                          labelText={<span>Phone 1</span>}
                          id="mobile"
                          error={this.state.mobileErr}
                          helperText={this.state.mobileHelperText}
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onBlur: (event) =>
                              this.handleChange(event, "mobile"),
                            onChange: (event) =>
                              this.handleChange(event, "mobile"),
                            onFocus: () =>
                              this.setState({
                                checkMobile: false,
                                mobileErr: false,
                                mobileHelperText: "",
                              }),
                            value: Mobile,
                            endAdornment:
                              this.state.checkMobile !== true ? (
                                <Icon>phone</Icon>
                              ) : this.state.mobileErr ? (
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
                      <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                          labelText={<span>Phone 2</span>}
                          id="mobile"
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onBlur: (event) =>
                              this.handleChange(event, "mobile1"),
                            onChange: (event) =>
                              this.handleChange(event, "mobile1"),
                            onFocus: () =>
                              this.setState({
                                checkMobile1: false,
                                mobile1Err: false,
                                mobile1HelperText: "",
                              }),
                            value: Mobile1,
                            endAdornment:
                              this.state.checkMobile1 !== true ? (
                                <Icon>phone</Icon>
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
                      <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                          labelText="Email"
                          id="Email"
                          error={this.state.emailErr}
                          formControlProps={{ fullWidth: true }}
                          helperText={this.state.emailHelperText}
                          inputProps={{
                            onBlur: (event) =>
                              this.handleChange(event, "email"),
                            onFocus: () =>
                              this.setState({
                                emailErr: false,
                                emailHelperText: "",
                                checkEmail: false,
                              }),
                            onChange: (event) =>
                              this.handleChange(event, "email"),
                            value: Email,
                            endAdornment:
                              this.state.checkEmail !== true ? (
                                <Icon>email</Icon>
                              ) : this.state.emailErr ? (
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
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={3}>
                        <Autocomplete
                          id="combo-box-demo"
                          options={paperSize}
                          value={this.state.PaperSize}
                          onChange={(event, value) =>
                            this.ChangeCountry(value, "PaperSize")
                          }
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <TextField {...params} label="Paper Size" />
                          )}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={3}>
                        <Autocomplete
                          id="combo-box-demo"
                          options={userstatus}
                          value={this.state.Status}
                          onChange={(event, value) =>
                            this.activeInactiveUser(value)
                          }
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <TextField {...params} label="User Status" />
                          )}
                        />
                      </GridItem>
                    </GridContainer>

                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>
                        <h3 className="margin-right-auto text-color-black">
                          Page Size Preview
                        </h3>
                      </GridItem>
                      {this.generatePreviewLink()}
                    </GridContainer>
                  </div>
                  <div className="shipment-pane mt-20" id="accessdetails">
                    <div className="package-table lead-access-table">
                      <table>
                        <thead>
                          <tr>
                            <th className="wd-330">Module Name</th>
                            <th className="align-center">
                              <div className="th-check">
                                Read Access<br></br>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={(event) =>
                                        this.handleInputChange(event, "ReadAll")
                                      }
                                    />
                                  }
                                  classes={{
                                    label: classes.label,
                                    root: classes.labelRoot,
                                  }}
                                />
                              </div>
                            </th>
                            <th className="align-center">
                              <div className="th-check">
                                Write Access<br></br>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={(event) =>
                                        this.handleInputChange(
                                          event,
                                          "WriteAll"
                                        )
                                      }
                                    />
                                  }
                                  classes={{
                                    label: classes.label,
                                    root: classes.labelRoot,
                                  }}
                                />
                              </div>
                            </th>
                            <th className="align-center">
                              <div className="th-check">
                                Delete Access<br></br>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={(event) =>
                                        this.handleInputChange(
                                          event,
                                          "DeleteAll"
                                        )
                                      }
                                    />
                                  }
                                  classes={{
                                    label: classes.label,
                                    root: classes.labelRoot,
                                  }}
                                />
                              </div>
                            </th>
                            <th className="align-center">
                              <div className="th-check">
                                All Access<br></br>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={(event) =>
                                        this.handleInputChange(
                                          event,
                                          "AllAccess"
                                        )
                                      }
                                    />
                                  }
                                  classes={{
                                    label: classes.label,
                                    root: classes.labelRoot,
                                  }}
                                />
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>{this.renderModule()}</tbody>
                      </table>
                    </div>
                  </div>
                  <div className="shipment-pane mt-20" id="markupdetails">
                    <div className="package-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Service Name</th>
                            <th>Display Name</th>
                            <th>Package Markup</th>
                            <th>Envelop Markup</th>
                            <th>Markup Type</th>
                          </tr>
                        </thead>
                        <tbody>{this.renderMarkup()}</tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Cardbody>
            </Card>
            {this.state.LoginpersonId === 1 ||
            this.state.LoginpersonId === 18 ? (
              <div className="shipment-submit">
                <div className="left">
                  <Button
                    justify="center"
                    color="danger"
                    onClick={() => this.deleteUser()}
                  >
                    Delete
                  </Button>
                </div>

                <div className="right">
                  {CommonConfig.isEmpty(this.props.location.state) ? null : (
                    <Button color="rose" onClick={() => this.saveUser(false)}>
                      Save
                    </Button>
                  )}
                  <Button color="primary" onClick={() => this.saveUser(true)}>
                    Save & Exit
                  </Button>
                  <Button color="secondary" onClick={() => this.cancelUser()}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : null}
          </GridItem>
        </GridContainer>
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
      </div>
    );
  }
}

Step1.propTypes = {
  classes: PropTypes.object,
};

export default withStyles()(Step1);
