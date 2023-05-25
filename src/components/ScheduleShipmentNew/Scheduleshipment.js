import React, { Component } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Datetime from "react-datetime";
import Tooltip from "@material-ui/core/Tooltip";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import FormHelperText from "@material-ui/core/FormHelperText";
import InfoIcon from "@material-ui/icons/PriorityHigh";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Icon from "@material-ui/core/Icon";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import SimpleBackdrop from "../../utils/general";
import _ from "lodash";
import CardIcon from "components/Card/CardIcon.js";
import cogoToast from "cogo-toast";
import FlightTakeoff from "@material-ui/icons/FlightTakeoff";
import ReactTable from "react-table";
import CardBody from "components/Card/CardBody.js";
import moment from "moment";
import api from "../../utils/apiClient";
import FormControl from "@material-ui/core/FormControl";
import { fileBase } from "../../utils/config";
import { CommonConfig } from "utils/constant.js";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
const useStyles = () => makeStyles(styles);
const classes = useStyles();

class Scheduleshipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Access: {},
      Steps: [
        {
          stepName: "Schedule Pickup",
          stepId: "SchedulePickup",
          classname: "active",
        },
        { stepName: "Sender", stepId: "Sender", classname: "inactive" },
        { stepName: "Recipient", stepId: "Recipient", classname: "inactive" },
        { stepName: "Package", stepId: "Package", classname: "inactive" },
        { stepName: "Payment", stepId: "Payment", classname: "inactive" },
      ],

      CountryList: [],
      shipment_type: [
        { value: "Air", label: "Air" },
        { value: "Ground", label: "Ground" },
        { value: "Ocean", label: "Ocean" },
      ],

      selectedShipmentType: "",
      shipmentTypeErr: false,
      shipmentTypeHelperText: "",

      GetRate: {
        FromCountry: "",
        ToCountry: "",
      },

      FromSelectedCountry: {},
      ToSelectedCountry: {},
      fromCountryErr: false,
      fromCountryHelperText: "",
      toCountryErr: false,
      toCountryHelperText: "",
      ServiceName: "",
      SubServiceName: "",

      // User Register Data
      Phone1: "",
      Phone2: "",
      Email: "",
      RegisteredCountry: "",
      UserDetails: {},
      disableGetrate: false,
      skipstep1: false,
      skipstep2: false,
      simpleSelect: "",
      desgin: false,
      code: false,
      develop: false,
      Loading: false,
      fromCountryName: "",
      fromCountryID: 0,
      fromCountryCode: "",
      fromCompanyName: "",
      fromCompanyNameErr: false,
      fromCompanyNameHelperText: "",

      fromContactName: "",
      fromContactNameErr: false,
      fromContactNameHelperText: "",

      fromAddressLine1: "",
      fromAddressLine2: "",
      fromAddressLine3: "",
      fromAddressLine1Err: false,
      fromAddressLine1HelperText: "",
      fromAddressLine2Err: false,
      fromAddressLine2HelperText: "",
      fromAddressLine3Err: false,
      fromAddressLine3HelperText: "",

      fromZipCode: "",
      fromZipCodeErr: false,
      fromZipCodeHelperText: "",

      fromState: "",
      fromStateErr: false,
      fromStateHelperText: "",

      fromCity: "",
      fromCityErr: false,
      fromCityHelperText: "",

      fromPhone1: "",
      fromPhone1Err: false,
      fromPhone1HelperText: "",

      fromPhone2: "",
      fromPhone2Err: false,
      fromPhone2HelperText: "",

      fromEmail: "",
      fromEmailErr: false,
      fromEmailHelperText: "",

      selectedPickupType: "0",
      IsPickUp: false,
      DoyouNeedPickup: "",
      valid: moment().toDate(),
      pickUpDate: moment().toDate(),
      selectedShipmentType: "",
      pickup_type: [
        { value: 1, label: "Yes - Additional Charge may apply" },
        { value: 0, label: "No - I will Drop off my Package" },
      ],
      pickup_type_ocean: [
        { value: 1, label: "Yes" },
        { value: 0, label: "No - I will Drop off my Package" },
      ],
      yesOrNo: [{ value: true, label: "Yes" }, { value: false, label: "No" }],
      visaCategoryList: [
        { value: "Indian Passport", label: "Indian Passport" },
        { value: "OCI Card", label: "OCI Card" },
        { value: "PIO Card", label: "PIO Card" },
        { value: "Visitor Visa", label: "Visitor Visa" },
      ],
      fromCityAutoComplete: false,
      fromStateAutoComplete: false,
      fromGoogleAPICityList: [],
      fromStateList: [],
      IsChanged: false,
      disableGetrate: false,
      disablefromZipcode: false,
      disablefromCity: false,
      disablefromState: false,
      NameAsPerPassport: "",
      YearsOutsideIndia: "",
      StayInIndia: "",
      LatestArrivalDate: "",
      AppliedForTR: "",
      AbleToProvidePassport: "",
      VisaCategory: "",
      VisaValidDate: "",
      movingBackIndia: "",
      movingBackIndiaErr: false,
      movingBackIndiaHelperText: "",
      nameAsperPassportErr: false,
      nameAsperPassportHelperText: "",
      stayinIndiaErr: false,
      stayinIndiaHelperText: "",
      appliedForTRErr: false,
      appliedForTRHelperText: "",
      ableToProvidePassportErr: false,
      ableToProvidePassportHelperText: "",
      visaCategoryErr: false,
      visaCategoryHelperText: "",
      visaDateErr: false,
      visaDateHelperText: "",
      arrivalDateErr: false,
      arrivalDateHelperText: "",
      yearsOutsideIndiaErr: false,
      yearsOutsideIndiaHelperText: "",
      isBackIndia: false,
      yearsLength: [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 },
        { value: 4, label: 4 },
        { value: "5+", label: "5+" },
      ],
      isDisableFields: false,
      isSkip: false,
      IsProvideClearance: false,
    };
  }

  async componentDidMount() {
    this.showHide();
    this.setState({
      Access: CommonConfig.getUserAccess("Schedule Shipment"),
      IsDisabled:
        CommonConfig.getUserAccess("Schedule Shipment").AllAccess === 1
          ? false
          : true,
      ReadOnly:
        CommonConfig.getUserAccess("Schedule Shipment").DeleteAccess === 1
          ? false
          : true,
    });

    await this.GetCountry();
    if (
      this.props.history.location.state !== undefined &&
      this.props.history.location.state != null
    ) {
      var FromCountryData = JSON.parse(
        this.props.history.location.state.GetRateData.UpsData.FromCountry
      );
      var ToCountryData = JSON.parse(
        this.props.history.location.state.GetRateData.UpsData.ToCountry
      );
      var selectedToCountry = {
        value: ToCountryData.CountryID,
        label: ToCountryData.CountryName,
      };

      var selectedFromCountry = {
        value: FromCountryData.CountryID,
        label: FromCountryData.CountryName,
      };

      var GetRate = this.state.GetRate;

      GetRate.FromCountry = FromCountryData;
      GetRate.ToCountry = ToCountryData;
      this.setState({
        FromSelectedCountry: selectedFromCountry,
        ToSelectedCountry: selectedToCountry,
        SubServiceName: this.props.history.location.state.ServiceName,
        ServiceName: this.props.history.location.state.MainServiceName,
        selectedShipmentType: this.props.history.location.state.ServiceType,
        GetRate: GetRate,
        disableGetrate: true,
      });
    }

    await this.getuserDetails();
    var yesterday = this.state.pickUpDate;

    var valid = function(current) {
      return (
        current.day() !== 0 && current.day() !== 6 && current.isAfter(yesterday)
      );
    };
    this.setState({ valid: valid });
  }
  handleSimple = (event) => {
    this.setState({ simpleSelect: event.target.value });
  };
  showHide() {
    this.state.Steps.map((step, index) => {
      index === 0
        ? (document.getElementById(step.stepId).style.display = "block")
        : (document.getElementById(step.stepId).style.display = "none");
    });
  }

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

  showLoader = () => {
    this.setState({ Loading: true });
  };

  hideLoader = () => {
    this.setState({ Loading: false });
  };

  sendState() {
    return this.state;
  }

  validate(event) {
    let IsFormValid = true;

    if (CommonConfig.isEmpty(this.state.selectedShipmentType)) {
      IsFormValid = false;
      this.setState({
        shipmentTypeErr: true,
        shipmentTypeHelperText: "Please select shipment type",
      });
    } else {
      this.setState({ shipmentTypeErr: false, shipmentTypeHelperText: "" });
    }

    if (!Object.values(this.state.FromSelectedCountry).length) {
      IsFormValid = false;
      this.setState({
        fromCountryErr: true,
        fromCountryHelperText: "Please select from country",
      });
    } else {
      this.setState({ fromCountryErr: false, fromCountryHelperText: "" });
    }

    if (!Object.values(this.state.ToSelectedCountry).length) {
      IsFormValid = false;
      this.setState({
        toCountryErr: true,
        toCountryHelperText: "Please select to country",
      });
    } else {
      this.setState({ toCountryErr: false, toCountryHelperText: "" });
    }

    return IsFormValid;
  }

  GetCountry() {
    try {
      this.setState({ Loading: true });
      api
        .get("location/getCountryList")
        .then((res) => {
          if (res.success) {
            var Country = res.data;

            this.setState({ CountryList: Country });

            var selectedCountryList = _.filter(Country, { CountryCode: "US" });

            var SelectedCountry = {
              value: selectedCountryList[0].CountryID,
              label: selectedCountryList[0].CountryName,
            };
            if (
              CommonConfig.isEmpty(this.props.history.location.state) === true
            ) {
              var GetRate = this.state.GetRate;

              GetRate.FromCountry = selectedCountryList[0];
              GetRate.ToCountry = selectedCountryList[0];

              this.setState({ GetRate: GetRate, Loading: false });
            } else {
              this.setState({ Loading: false });
            }
          }
        })
        .catch((err) => {
          this.setState({ Loading: false });
          console.log("err..", err);
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {
      this.setState({ Loading: false });
      console.log("error..", error);
      cogoToast.error("Something Went Wrong");
    }
  }

  getuserDetails() {
    let data = {
      UserID: CommonConfig.loggedInUserData().PersonID,
    };
    try {
      api
        .post("userManagement/getUserDetails", data)
        .then((res) => {
          if (res.success) {
            let userData = res.data;
            if (
              this.props.history.location.state !== undefined &&
              this.props.history.location.state != null
            ) {
              if (this.props.history.location.state.skipstep1) {
                var FromCountryData = JSON.parse(
                  this.props.history.location.state.GetRateData.UpsData
                    .FromCountry
                );
                if (
                  !CommonConfig.isEmpty(
                    this.props.history.location.state.GetRateData.UpsData
                      .FromZipCode
                  )
                ) {
                  if (
                    FromCountryData.CountryID ===
                      userData.UserDetails[0].CountryID &&
                    this.props.history.location.state.GetRateData.UpsData
                      .FromZipCode === userData.UserDetails[0].ZipCode
                  ) {
                    if (userData.UserDetails[0]) {
                      var Country = this.state.CountryList.filter(
                        (x) => x.CountryID === userData.UserDetails[0].CountryID
                      );
                      var selectedCountry = Country[0]
                        ? {
                            value: Country[0].CountryID,
                            label: Country[0].CountryName,
                          }
                        : this.state.FromSelectedCountry;
                      var registeredCountry = Country[0]
                        ? {
                            value: Country[0].CountryID,
                            label: Country[0].CountryName,
                          }
                        : "";
                      this.setState({
                        RegisteredCountry: registeredCountry,
                        FromSelectedCountry: selectedCountry,
                        UserDetails: userData.UserDetails[0],
                      });
                    }
                    if (userData.PhoneDetails.length > 0) {
                      this.setState({
                        Phone1: userData.PhoneDetails[0].PhoneNum,
                        Phone2: userData.PhoneDetails[1]
                          ? userData.PhoneDetails[1].PhoneNum
                          : "",
                        Email: userData.PhoneDetails[0].Email,
                      });
                    }
                  }
                }
              }
              if (userData.UserDetails.length) {
                let userDetails = this.state.UserDetails;
                userDetails.AccountNumber =
                  userData.UserDetails[0].AccountNumber;
                // console.log("UserDetails......",userDetails);
                this.setState({
                  UserDetails: userDetails,
                });
              }
            }
            // else if(localStorage.getItem('sealsleadid')){
            //     if (this.state.skipstep2) {
            //         var FromCountryData = JSON.parse(this.props.history.location.state.GetRateData.UpsData.FromCountry);
            //         if(!CommonConfig.isEmpty(this.props.history.location.state.GetRateData.UpsData.FromZipCode)){
            //             if (FromCountryData.CountryID === userData.UserDetails[0].CountryID && this.props.history.location.state.GetRateData.UpsData.FromZipCode === userData.UserDetails[0].ZipCode) {
            //                 if (userData.UserDetails[0]) {
            //                     var Country = this.state.CountryList.filter((x) => x.CountryID === userData.UserDetails[0].CountryID);
            //                     var selectedCountry = Country[0] ? {
            //                         value: Country[0].CountryID,
            //                         label: Country[0].CountryName,
            //                     } : this.state.FromSelectedCountry;
            //                     var registeredCountry = Country[0] ? {
            //                         value: Country[0].CountryID,
            //                         label: Country[0].CountryName,
            //                     } : '';
            //                     this.setState({
            //                         RegisteredCountry: registeredCountry,
            //                         FromSelectedCountry: selectedCountry,
            //                         UserDetails: userData.UserDetails[0]
            //                     })
            //                 }
            //                 if (userData.PhoneDetails.length > 0) {
            //                     this.setState({
            //                         Phone1: userData.PhoneDetails[0].PhoneNum,
            //                         Phone2: userData.PhoneDetails[1] ? userData.PhoneDetails[1].PhoneNum : '',
            //                         Email: userData.PhoneDetails[0].Email
            //                     })
            //                 }
            //             }
            //         }

            //     }
            //     if(userData.UserDetails.length){
            //         let userDetails = this.state.UserDetails;
            //         userDetails.AccountNumber = userData.UserDetails[0].AccountNumber;
            //         // console.log("UserDetails......",userDetails);
            //         this.setState({
            //             UserDetails: userDetails
            //         })
            //     }
            // }
            else {
              if (userData.UserDetails[0]) {
                var Country = this.state.CountryList.filter(
                  (x) => x.CountryID === userData.UserDetails[0].CountryID
                );
                var selectedCountry = Country[0]
                  ? {
                      value: Country[0].CountryID,
                      label: Country[0].CountryName,
                    }
                  : this.state.FromSelectedCountry;
                var registeredCountry = Country[0]
                  ? {
                      value: Country[0].CountryID,
                      label: Country[0].CountryName,
                    }
                  : "";
                this.setState({
                  RegisteredCountry: registeredCountry,
                  FromSelectedCountry: selectedCountry,
                  UserDetails: userData.UserDetails[0],
                });
              }
              if (userData.PhoneDetails.length > 0) {
                this.setState({
                  Phone1: userData.PhoneDetails[0].PhoneNum,
                  Phone2: userData.PhoneDetails[1]
                    ? userData.PhoneDetails[1].PhoneNum
                    : "",
                  Email: userData.PhoneDetails[0].Email,
                });
              }
            }
          }
        })
        .catch((err) => {
          console.log("error", err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  ChangeFromCountry = (event) => {
    if (CommonConfig.isEmpty(event)) {
      return null;
    }

    var SelectedCountry = _.findIndex(this.state.CountryList, function(
      country
    ) {
      return country.CountryName === event.label;
    });

    var GetRate = this.state.GetRate;
    GetRate.FromCountry = this.state.CountryList[SelectedCountry];
    GetRate.FromState = "";

    var SelectedCity;

    if (GetRate.FromCountry.CountryCode === "US") {
      SelectedCity = { label: "Select City" };
    } else if (
      GetRate.FromCountry.IsFedexCity === 0 &&
      GetRate.FromCountry.IsUpsCity === 0
    ) {
      SelectedCity = { value: "Not Required", label: "Not Required" };
    } else {
      SelectedCity = { label: "Select City" };
    }

    this.setState({
      FromSelectedCountry: event,
      FromSelectedCity: SelectedCity,
      FromFedExSelectedCity: SelectedCity,
      FromUPSSelectedCity: SelectedCity,
      FromFedExCityList: [],
      FromUPSCityList: [],
      FromCityList: [],
    });

    if (
      GetRate.FromCountry.CountryCode === "US" &&
      GetRate.ToCountry.CountryCode === "US"
    ) {
      this.setState({ IsResidential: true });
    } else {
      this.setState({ IsResidential: false });
    }

    GetRate.FromZipCode = "";

    var CountryId = GetRate.FromCountry.CountryID;

    if (GetRate.FromCountry.IsFedexCity) {
      var CityData = { CityType: "FedEx", CountryId: CountryId };
      this.showLoader();
      api
        .post("location/getCityList", CityData)
        .then((res) => {
          if (res.success) {
            this.setState({ FromFedExCityList: res.data });
            this.hideLoader();
          } else {
            this.setState({ FromFedExCityList: [] });
            this.hideLoader();
          }
        })
        .catch((error) => {
          cogoToast.error("Something Went Wrong");
        });
    }

    if (GetRate.FromCountry.IsUpsCity) {
      var CityData = { CityType: "UPS", CountryId: CountryId };
      this.showLoader();
      api
        .post("location/getCityList", CityData)
        .then((res) => {
          if (res.success) {
            this.setState({ FromUPSCityList: res.data });
            this.hideLoader();
          } else {
            this.setState({ FromUPSCityList: [] });
            this.hideLoader();
          }
        })
        .catch((error) => {
          cogoToast.error("Something Went Wrong");
        });
    }

    if (
      GetRate.FromCountry.CountryCode === "US" &&
      GetRate.ToCountry.CountryCode === "IN"
    ) {
      this.setState({ IsPickupZone: true });
      GetRate.ToFedExCity = {};
      GetRate.ToUPSCity = {};
    } else {
      this.setState({ IsPickupZone: false });
    }

    this.setState({ GetRate: GetRate });
  };

  ChangeToCountry = (event) => {
    if (CommonConfig.isEmpty(event)) {
      return null;
    }

    var SelectedCity;

    var SelectedCountry = _.findIndex(this.state.CountryList, function(
      country
    ) {
      return country.CountryName === event.label;
    });

    var GetRate = this.state.GetRate;
    GetRate.ToCountry = this.state.CountryList[SelectedCountry];
    GetRate.ToState = "";

    if (GetRate.ToCountry.CountryCode === "US") {
      SelectedCity = { label: "Select City" };
    } else if (
      GetRate.ToCountry.IsFedexCity === 0 &&
      GetRate.ToCountry.IsUpsCity === 0
    ) {
      SelectedCity = { value: "Not Required", label: "Not Required" };
    } else {
      SelectedCity = { label: "Select City" };
    }

    this.setState({
      ToSelectedCountry: event,
      ToSelectedCity: SelectedCity,
      ToFedExSelectedCity: SelectedCity,
      ToUPSSelectedCity: SelectedCity,
      ToFedExCityList: [],
      ToUPSCityList: [],
      ToCityList: [],
    });

    if (
      GetRate.FromCountry.CountryCode === "US" &&
      GetRate.ToCountry.CountryCode === "US"
    ) {
      this.setState({ IsResidential: true });
    } else {
      this.setState({ IsResidential: false });
    }

    var CountryId = GetRate.ToCountry.CountryID;

    if (GetRate.ToCountry.IsFedexCity) {
      var CityData = { CityType: "FedEx", CountryId: CountryId };
      this.showLoader();
      api
        .post("location/getCityList", CityData)
        .then((res) => {
          if (res.success) {
            this.setState({ ToFedExCityList: res.data });
            this.hideLoader();
          } else {
            this.setState({ ToFedExCityList: [] });
            this.hideLoader();
          }
        })
        .catch((err) => {
          this.hideLoader();
          console.log("No FedEx city found", err);
        });
    }

    if (GetRate.ToCountry.IsUpsCity) {
      var CityData = { CityType: "UPS", CountryId: CountryId };
      this.showLoader();
      api
        .post("location/getCityList", CityData)
        .then((res) => {
          if (res.success) {
            this.setState({ ToUPSCityList: res.data });
            this.hideLoader();
          } else {
            this.setState({ ToUPSCityList: [] });
            this.hideLoader();
          }
        })
        .catch((err) => {
          this.hideLoader();
          console.log("No UPS city found", err);
        });
    }

    if (
      this.state.GetRate.FromCountry.CountryCode === "US" &&
      this.state.GetRate.ToCountry.CountryCode === "IN"
    ) {
      this.setState({ IsPickupZone: true });
      GetRate.ToFedExCity = {};
      GetRate.ToUPSCity = {};
    } else {
      this.setState({ IsPickupZone: false });
    }

    this.setState({ GetRate: GetRate });
  };

  ShipmentTypeChange = (event) => {
    this.setState({ selectedShipmentType: event.target.value });
  };

  appendShipmentType() {
    return this.state.shipment_type.map((shipmentType) => {
      return (
        <MenuItem
          classes={{
            root: classes.selectMenuItem,
            selected: classes.selectMenuItemSelected,
          }}
          value={shipmentType.value}
        >
          {" "}
          {shipmentType.label}{" "}
        </MenuItem>
      );
    });
  }
  render() {
    const { Steps } = this.state;
    const FromCountryOptions = this.state.CountryList.map((fromCountry) => {
      return { value: fromCountry.CountryID, label: fromCountry.CountryName };
    });
    const ToCountryOptions = this.state.CountryList.map((tocountry) => {
      return { value: tocountry.CountryID, label: tocountry.CountryName };
    });
    const fromCityOptions = this.state.fromGoogleAPICityList.map((city) => {
      return { value: city.City_code, label: city.Name };
    });
    const fromStateOptions = this.state.fromStateList.map((state) => {
      return { value: state.StateName, label: state.StateName };
    });
    const {
      IsProvideClearance,
      fromCompanyName,
      fromCompanyNameErr,
      fromCompanyNameHelperText,
      fromContactName,
      fromContactNameErr,
      fromContactNameHelperText,
      fromAddressLine1,
      fromAddressLine1Err,
      fromAddressLine1HelperText,
      fromAddressLine2,
      fromAddressLine2Err,
      fromAddressLine2HelperText,
      fromAddressLine3,
      fromAddressLine3Err,
      fromAddressLine3HelperText,
      fromCity,
      fromCityErr,
      fromCityHelperText,
      fromZipCode,
      fromZipCodeErr,
      fromZipCodeHelperText,
      fromState,
      fromStateErr,
      fromStateHelperText,
      fromPhone1,
      fromPhone1Err,
      fromPhone1HelperText,
      fromPhone2,
      fromPhone2Err,
      fromPhone2HelperText,
      fromEmail,
      fromEmailErr,
      fromEmailHelperText,
      isBackIndia,
      VisaCategory,
      selectedShipmentType,
    } = this.state;
    return (
      <div>
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
        <div>
          <GridContainer
            justify="center"
            className="schedule-pickup-main-outer"
          >
            <GridItem xs={12} sm={12}>
              <Card>
                <CardHeader className="btn-right-outer" color="primary" icon>
                  <CardIcon color="primary">
                    <FlightTakeoff />
                  </CardIcon>
                  <h4 className="margin-right-auto text-color-black">
                    Schedule Shipment
                  </h4>
                </CardHeader>

                <GridContainer
                  justify="center"
                  className="schedule-pickup-main-outer"
                >
                  <GridItem xs={12} sm={12}>
                    <div className="shipment-nav">
                      <ul>
                        {Steps.map((step, key) => {
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
                      <div className="shipment-pane" id="SchedulePickup">
                        <GridContainer className="MuiGrid-justify-xs-center">
                          <GridItem xs={12} sm={12} md={6}>
                            <form>
                              <div className="select-spl">
                                <FormControl
                                  fullWidth
                                  error={this.state.shipmentTypeErr}
                                >
                                  <InputLabel className={classes.selectLabel}>
                                    Select Shipment Type
                                  </InputLabel>
                                  <Select
                                    fullWidth={true}
                                    value={this.state.selectedShipmentType}
                                    disabled={this.state.disableGetrate}
                                    MenuProps={{
                                      className: classes.selectMenu,
                                    }}
                                    classes={{ select: classes.select }}
                                    onChange={(event) =>
                                      this.ShipmentTypeChange(event)
                                    }
                                    onFocus={() =>
                                      this.setState({
                                        shipmentTypeErr: false,
                                        shipmentTypeHelperText: "",
                                      })
                                    }
                                    inputProps={{
                                      name: "selectshipmenttype",
                                      id: "selectshipmenttype",
                                    }}
                                  >
                                    {this.appendShipmentType()}
                                  </Select>
                                  <FormHelperText>
                                    {this.state.shipmentTypeHelperText}
                                  </FormHelperText>
                                </FormControl>
                              </div>

                              <FormControl fullWidth>
                                <Autocomplete
                                  options={FromCountryOptions}
                                  id="FromCountry"
                                  getOptionLabel={(option) => option.label}
                                  value={this.state.FromSelectedCountry}
                                  autoSelect
                                  disabled={this.state.disableGetrate}
                                  onChange={(event, value) =>
                                    this.ChangeFromCountry(value)
                                  }
                                  onFocus={() =>
                                    this.setState({
                                      fromCountryErr: false,
                                      fromCountryHelperText: "",
                                    })
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="From Country"
                                      error={this.state.fromCountryErr}
                                      helperText={
                                        this.state.fromCountryHelperText
                                      }
                                      margin="normal"
                                      fullWidth
                                    />
                                  )}
                                />
                              </FormControl>

                              <FormControl fullWidth>
                                <Autocomplete
                                  options={ToCountryOptions}
                                  id="toCountry"
                                  getOptionLabel={(option) => option.label}
                                  value={this.state.ToSelectedCountry}
                                  autoSelect
                                  disabled={this.state.disableGetrate}
                                  onChange={(event, value) =>
                                    this.ChangeToCountry(value)
                                  }
                                  onFocus={() =>
                                    this.setState({
                                      toCountryErr: false,
                                      toCountryHelperText: "",
                                    })
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="To Country"
                                      error={this.state.toCountryErr}
                                      helperText={
                                        this.state.toCountryHelperText
                                      }
                                      margin="normal"
                                      fullWidth
                                    />
                                  )}
                                />
                              </FormControl>
                            </form>
                          </GridItem>
                        </GridContainer>
                      </div>
                      <div className="shipment-pane" id="Sender">
                        <h1>hello 1</h1>
                      </div>
                      <div className="shipment-pane" id="Recipient">
                        <h1>hello 1</h1>
                      </div>
                      <div className="shipment-pane" id="Package">
                        <h1>hello 1</h1>
                      </div>
                      <div className="shipment-pane" id="Payment">
                        <h1>hello 1</h1>
                      </div>
                    </div>
                  </GridItem>
                </GridContainer>
                <div className="shipment-submit">
                  {/* <div className="right">
                    {this.state.Access.WriteAccess === 1 &&
                    !this.state.isLock ? (
                      <>
                        <Button
                          justify="center"
                          color="rose"
                          onClick={() => this.handleSave(false)}
                        >
                          Save
                        </Button>
                        <Button
                          justify="center"
                          color="primary"
                          onClick={() => this.handleSave(true)}
                        >
                          Save & Exit
                        </Button>
                      </>
                    ) : null}

                    <Button
                      justify="center"
                      color="secondary"
                      onClick={() => this.handleCancel()}
                    >
                      Cancel
                    </Button>
                  </div> */}
                </div>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

Scheduleshipment.propTypes = {
  classes: PropTypes.object,
};

export default withStyles()(Scheduleshipment);
