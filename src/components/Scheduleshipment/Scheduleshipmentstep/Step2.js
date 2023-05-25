/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import api from "../../../utils/apiClient";
import { CommonConfig } from "../../../utils/constant";
import cogoToast from "cogo-toast";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import TextField from "@material-ui/core/TextField";
import Datetime from "react-datetime";
import moment from "moment";
import Button from "components/CustomButtons/Button.js";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import SimpleBackdrop from "../../../utils/general";
// material ui icons

import MenuItem from "@material-ui/core/MenuItem";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";

const useStyles = makeStyles(styles);
const classes = () => {
  return useStyles();
};

class Scheduleshipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      simpleSelect: "",
      desgin: false,
      code: false,
      develop: false,
      Loading: false,
      fromCountryName: "",
      fromCountryID: 0,
      fromCountryCode: "",
      FromSelectedCountry: {},

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

      fromFedexCityList: [],
      fromFedExCity: "",
      FromFedExSelectedCity: {},
      fromFedexCityError: false,
      fromFedexCityHelperText: "",

      fromUPSCityList: [],
      fromUPSCity: "",
      FromUPSSelectedCity: {},
      fromUPSCityError: false,
      fromUPSCityHelperText: "",

      getRate: {},

      IsFedexORUpsCity: false,

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

      FromZipcodeOptional: false,
    };
  }

  handleSimple = (event) => {
    this.setState({ simpleSelect: event.target.value });
  };

  componentDidMount() {
    var yesterday = this.state.pickUpDate;

    var valid = function(current) {
      return (
        current.day() !== 0 && current.day() !== 6 && current.isAfter(yesterday)
      );
    };
    this.setState({ valid: valid });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps &&
      nextProps.allStates !== null &&
      nextProps.allStates.schedulepickup
    ) {
      if (nextProps.allStates.schedulepickup.FromFedExCityList.length > 0) {
        if (
          nextProps.allStates.schedulepickup.GetRate.FromCountry
            .IsZipAvailable == 0
        ) {
          this.setState({
            disablefromZipcode: true,
            disablefromState: true,
            fromFedexCityList: nextProps.allStates.schedulepickup
              .FromFedExCityList
              ? nextProps.allStates.schedulepickup.FromFedExCityList
              : this.state.fromFedExCity,
          });
          if (this.props.props.location.state != undefined) {
            this.ChangeFromFedexCity(
              this.props.props.location.state.GetRateData.UpsData.FromFedExCity,
              "FedEx"
            );
          }
        } else {
            this.setState({
              disablefromZipcode: false,
              disablefromState: false,
              fromFedexCityList: nextProps.allStates.schedulepickup
                .ToFedExCityList
                ? nextProps.allStates.schedulepickup.FromFedExCityList
                : this.state.fromFedExCity,
            });
          if (this.props.props.location.state != undefined) {
            this.ChangeFromFedexCity(
              this.props.props.location.state.GetRateData.UpsData.FromFedExCity,
              "FedEx"
            );
          }
        }
      } else {
        this.setState({ fromFedexCityList: [] });
      }
    }

    if (
      nextProps.allStates.schedulepickup != undefined ||
      nextProps.allStates.schedulepickup != null
    ) {
      if (nextProps.allStates.schedulepickup.selectedShipmentType) {
        this.setState({
          selectedShipmentType:
            nextProps.allStates.schedulepickup.selectedShipmentType,
        });
      }
      if (
        !CommonConfig.isEmpty(
          nextProps.allStates.schedulepickup.RegisteredCountry
        )
      ) {
        if (
          nextProps.allStates.schedulepickup.RegisteredCountry.value !==
          nextProps.allStates.schedulepickup.FromSelectedCountry.value
        ) {
          if (
            nextProps.allStates.schedulepickup.UserDetails &&
            !this.state.IsChanged
          ) {
            this.setState({
              fromCompanyName: nextProps.allStates.schedulepickup.UserDetails
                .CompanyName
                ? nextProps.allStates.schedulepickup.UserDetails.CompanyName
                : this.state.fromCompanyName,
              fromContactName: nextProps.allStates.schedulepickup.UserDetails
                .ContactName
                ? nextProps.allStates.schedulepickup.UserDetails.ContactName
                : this.state.fromContactName,
              fromAddressLine1: nextProps.allStates.schedulepickup.UserDetails
                .AddressLine1
                ? nextProps.allStates.schedulepickup.UserDetails.AddressLine1
                : this.state.fromAddressLine1,
              fromAddressLine2: nextProps.allStates.schedulepickup.UserDetails
                .AddressLine2
                ? nextProps.allStates.schedulepickup.UserDetails.AddressLine2
                : this.state.fromAddressLine2,
              fromAddressLine3: nextProps.allStates.schedulepickup.UserDetails
                .AddressLine3
                ? nextProps.allStates.schedulepickup.UserDetails.AddressLine3
                : this.state.fromAddressLine3,
              fromCity: nextProps.allStates.schedulepickup.UserDetails.City
                ? nextProps.allStates.schedulepickup.UserDetails.City
                : this.state.fromCity,
              fromZipCode: nextProps.allStates.schedulepickup.UserDetails
                .ZipCode
                ? nextProps.allStates.schedulepickup.UserDetails.ZipCode
                : this.state.fromZipCode,
              fromState: nextProps.allStates.schedulepickup.UserDetails.State
                ? nextProps.allStates.schedulepickup.UserDetails.State
                : this.state.fromState,
              getRate: nextProps.allStates.schedulepickup.GetRate,
              fromFedexCityList: nextProps.allStates.schedulepickup
                .FromFedExCityList
                ? nextProps.allStates.schedulepickup.FromFedExCityList
                : this.state.fromFedExCity,
              fromUPSCityList: nextProps.allStates.schedulepickup
                .FromUPSCityList
                ? nextProps.allStates.schedulepickup.FromUPSCityList
                : this.state.fromFedExCity,
            });
            this.state.fromState = nextProps.allStates.schedulepickup
              .UserDetails.State
              ? nextProps.allStates.schedulepickup.UserDetails.State
              : this.state.fromState;
          }
          if (!this.state.IsChanged) {
            this.setState({
              fromPhone1: nextProps.allStates.schedulepickup.Phone1
                ? nextProps.allStates.schedulepickup.Phone1
                : this.state.fromPhone1,
              fromPhone2: nextProps.allStates.schedulepickup.Phone2
                ? nextProps.allStates.schedulepickup.Phone2
                : this.state.fromPhone2,
              fromEmail: nextProps.allStates.schedulepickup.Email
                ? nextProps.allStates.schedulepickup.Email
                : this.state.fromEmail,
            });
          }
        }
      }
      if (nextProps.allStates.schedulepickup.skipstep2) {
        if (
          nextProps.allStates.schedulepickup.UserDetails &&
          !this.state.IsChanged
        ) {
          this.setState({
            fromCompanyName: nextProps.allStates.schedulepickup.UserDetails
              .CompanyName
              ? nextProps.allStates.schedulepickup.UserDetails.CompanyName
              : this.state.fromCompanyName,
            fromContactName: nextProps.allStates.schedulepickup.UserDetails
              .ContactName
              ? nextProps.allStates.schedulepickup.UserDetails.ContactName
              : this.state.fromContactName,
            fromCity: nextProps.allStates.schedulepickup.UserDetails.City
              ? nextProps.allStates.schedulepickup.UserDetails.City
              : this.state.fromCity,
            fromFedexCityList: nextProps.allStates.schedulepickup
              .FromFedExCityList
              ? nextProps.allStates.schedulepickup.FromFedExCityList
              : this.state.fromFedExCity,
            fromZipCode: nextProps.allStates.schedulepickup.UserDetails.ZipCode
              ? nextProps.allStates.schedulepickup.UserDetails.ZipCode
              : this.state.fromZipCode,
            fromState: nextProps.allStates.schedulepickup.UserDetails.State
              ? nextProps.allStates.schedulepickup.UserDetails.State
              : this.state.fromState,
            disableGetrate:
              nextProps.allStates.schedulepickup.UserDetails.disableGetrate,
            disablefromZipcode:
              nextProps.allStates.schedulepickup.UserDetails.disablefromZipcode,
            disablefromCity:
              nextProps.allStates.schedulepickup.UserDetails.disablefromCity,
            disablefromState:
              nextProps.allStates.schedulepickup.UserDetails.disablefromState,
            isDisableFields:
              nextProps.allStates.schedulepickup.UserDetails.isDisableFields,
          });
          this.state.fromState = nextProps.allStates.schedulepickup.UserDetails
            .State
            ? nextProps.allStates.schedulepickup.UserDetails.State
            : this.state.fromState;
          this.state.disableGetrate = nextProps.allStates.schedulepickup
            .UserDetails.disableGetrate
            ? nextProps.allStates.schedulepickup.UserDetails.disableGetrate
            : this.state.disableGetrate;
          this.state.disablefromZipcode = nextProps.allStates.schedulepickup
            .UserDetails.disablefromZipcode
            ? nextProps.allStates.schedulepickup.UserDetails.disablefromZipcode
            : this.state.disablefromZipcode;
          this.state.disablefromCity = nextProps.allStates.schedulepickup
            .UserDetails.disablefromCity
            ? nextProps.allStates.schedulepickup.UserDetails.disablefromCity
            : this.state.disablefromCity;
          this.state.disablefromState = nextProps.allStates.schedulepickup
            .UserDetails.disablefromState
            ? nextProps.allStates.schedulepickup.UserDetails.disablefromState
            : this.state.disablefromState;
          this.state.isDisableFields = nextProps.allStates.schedulepickup
            .UserDetails.isDisableFields
            ? nextProps.allStates.schedulepickup.UserDetails.isDisableFields
            : this.state.isDisableFields;
        }
        if (!this.state.IsChanged) {
          this.setState({
            fromPhone1: nextProps.allStates.schedulepickup.Phone1
              ? nextProps.allStates.schedulepickup.Phone1
              : this.state.fromPhone1,
            fromPhone2: nextProps.allStates.schedulepickup.Phone2
              ? nextProps.allStates.schedulepickup.Phone2
              : this.state.fromPhone2,
            fromEmail: nextProps.allStates.schedulepickup.Email
              ? nextProps.allStates.schedulepickup.Email
              : this.state.fromEmail,
          });
        }
      }

      let Fromobj = nextProps.allStates.schedulepickup.FromSelectedCountry;

      this.setState({ FromSelectedCountry: Fromobj });
      this.getStates(Fromobj);
    }
    if (
      nextProps.props.location.state !== undefined &&
      nextProps.props.location.state != null
    ) {
      // console.log("GetRate data step 2...........",JSON.parse(nextProps.props.location.state.GetRateData.UpsData.FromCountry))
      var FromCountryData = JSON.parse(
        nextProps.props.location.state.GetRateData.UpsData.FromCountry
      );
      if (
        nextProps.allStates.schedulepickup != undefined ||
        nextProps.allStates.schedulepickup != null
      ) {
        if (
          !CommonConfig.isEmpty(
            nextProps.allStates.schedulepickup.RegisteredCountry
          )
        ) {
          if (
            FromCountryData.CountryID ===
            nextProps.allStates.schedulepickup.RegisteredCountry.value
          ) {
            this.setState({ isSkip: true });
          }
        }
      }
      this.setState({
        fromZipCode:
          nextProps.props.location.state.GetRateData.UpsData.FromZipCode,
        selectedPickupType:
          nextProps.props.location.state.GetRateData.IsPickUp === false ? 0 : 1,
        disablefromZipcode: true,
        isDisableFields: true,
        disablefromCity: true,
        disablefromState: true,
        fromZipCodeErr: false,
        fromZipCodeHelperText: "",
      });

      if (
        nextProps.props.location.state.GetRateData.UpsData.FromZipCode &&
        (JSON.parse(
          nextProps.props.location.state.GetRateData.UpsData.FromCountry
        ).IsFedexCity === 0 &&
          JSON.parse(
            nextProps.props.location.state.GetRateData.UpsData.FromCountry
          ).IsUpsCity !== 1)
      ) {
        setTimeout(() => {
          this.senderZipChange(this.state.fromZipCode);
        }, 2500);

        this.setState({
          fromCity: nextProps.props.location.state.GetRateData.UpsData.FromCity,
          disablefromZipcode: true,
          disablefromCity: false,
          disablefromState: false,
        });
      } else {
        this.setState({
          disablefromZipcode: false,
          disablefromCity: true,
          isDisableFields: true,
          disablefromState: false,
          fromCity:
            nextProps.props.location.state.GetRateData.UpsData.FromUPSCity
              .label,
        });
        // console.log("get rate data next props step 2 else ..... ",nextProps.props.location.state.GetRateData)
      }

      if (
        nextProps.props.location.state.GetRateData.UpsData.FromFedExCity &&
        nextProps.props.location.state.MainServiceName === "FedEx" &&
        nextProps.props.location.state.state.GetRate.FromCountry.IsFedexCity ===
          1
      ) {
        if (
          nextProps.props.location.state.state.GetRate.FromCountry
            .IsZipAvailable == 1
        ) {
          this.setState({ isZipAvailable: true });
        }
        // console.log("get rate data next FromFedExCity props step 2 ..... ",nextProps.props.location.state.GetRateData)
        this.setState({
          disablefromZipcode: true,
          disablefromCity: true,
          isDisableFields: true,
          disablefromState: true,
          fromCity: "",
          FromFedExSelectedCity:
            nextProps.props.location.state.GetRateData.UpsData.FromFedExCity,
        });
      }

      if (
        nextProps.props.location.state.GetRateData.UpsData.FromUPSCity &&
        nextProps.props.location.state.MainServiceName !== "FedEx" &&
        nextProps.props.location.state.state.GetRate.FromCountry.IsUpsCity === 1
      ) {
        this.setState({
          disablefromZipcode: false,
          disablefromCity: true,
          isDisableFields: true,
          disablefromState: false,
          fromCity:
            nextProps.props.location.state.GetRateData.UpsData.FromUPSCity
              .label,
        });
        // console.log("get rate data next FromFedExCity props step 2 ..... ",nextProps.props.location.state.GetRateData)
      } else if (
        nextProps.props.location.state.GetRateData.UpsData.FromFedExCity &&
        nextProps.props.location.state.MainServiceName !== "FedEx" &&
        nextProps.props.location.state.state.GetRate.FromCountry.IsUpsCity === 0
      ) {
        this.setState({
          disablefromZipcode: false,
          disablefromCity: true,
          isDisableFields: true,
          disablefromState: false,
          fromCity:
            nextProps.props.location.state.GetRateData.UpsData.FromFedExCity
              .label,
        });
      }
      if (nextProps.props.location.state.ServiceType) {
        this.setState({
          selectedShipmentType: nextProps.props.location.state.ServiceType,
        });
      }
      if (nextProps.props.location.state.GetRateData.UpsData) {
        if (
          JSON.parse(
            nextProps.props.location.state.GetRateData.UpsData.FromCountry
          ).FromZipCodeOptional === true
        ) {
          this.setState({
            FromZipcodeOptional: true,
            disablefromZipcode: true,
          });
        }
      }
    }

    if (
      nextProps.allStates.schedulepickup != undefined ||
      nextProps.allStates.schedulepickup != null
    ) {
      if (nextProps.allStates.schedulepickup.selectedShipmentType) {
        this.setState({
          selectedShipmentType:
            nextProps.allStates.schedulepickup.selectedShipmentType,
        });
      }
      if (
        !CommonConfig.isEmpty(
          nextProps.allStates.schedulepickup.RegisteredCountry
        )
      ) {
        if (
          nextProps.allStates.schedulepickup.RegisteredCountry.value ===
          nextProps.allStates.schedulepickup.FromSelectedCountry.value
        ) {
          if (
            nextProps.allStates.schedulepickup.UserDetails &&
            !this.state.IsChanged
          ) {
            console.log('datatttt2:',nextProps.allStates.schedulepickup.UserDetails
    .AddressLine1,' --------- ',this.state.fromAddressLine1);
            this.setState({
              fromCompanyName: nextProps.allStates.schedulepickup.UserDetails
                .CompanyName
                ? nextProps.allStates.schedulepickup.UserDetails.CompanyName
                : this.state.fromCompanyName,
              fromContactName: nextProps.allStates.schedulepickup.UserDetails
                .ContactName
                ? nextProps.allStates.schedulepickup.UserDetails.ContactName
                : this.state.fromContactName,
              fromAddressLine1: nextProps.allStates.schedulepickup.UserDetails
                .AddressLine1
                ? nextProps.allStates.schedulepickup.UserDetails.AddressLine1
                : this.state.fromAddressLine1,
              fromAddressLine2: nextProps.allStates.schedulepickup.UserDetails
                .AddressLine2
                ? nextProps.allStates.schedulepickup.UserDetails.AddressLine2
                : this.state.fromAddressLine2,
              fromAddressLine3: nextProps.allStates.schedulepickup.UserDetails
                .AddressLine3
                ? nextProps.allStates.schedulepickup.UserDetails.AddressLine3
                : this.state.fromAddressLine3,
              fromCity: nextProps.allStates.schedulepickup.UserDetails.City
                ? nextProps.allStates.schedulepickup.UserDetails.City
                : this.state.fromCity,
              fromFedexCityList: nextProps.allStates.schedulepickup
                .FromFedExCityList
                ? nextProps.allStates.schedulepickup.FromFedExCityList
                : this.state.fromFedExCity,
              fromZipCode: nextProps.allStates.schedulepickup.UserDetails
                .ZipCode
                ? nextProps.allStates.schedulepickup.UserDetails.ZipCode
                : this.state.fromZipCode,
              fromState: nextProps.allStates.schedulepickup.UserDetails.State
                ? nextProps.allStates.schedulepickup.UserDetails.State
                : this.state.fromState,
            });
            this.state.fromState = nextProps.allStates.schedulepickup
              .UserDetails.State
              ? nextProps.allStates.schedulepickup.UserDetails.State
              : this.state.fromState;
          }
          if (!this.state.IsChanged) {
            this.setState({
              fromPhone1: nextProps.allStates.schedulepickup.Phone1
                ? nextProps.allStates.schedulepickup.Phone1
                : this.state.fromPhone1,
              fromPhone2: nextProps.allStates.schedulepickup.Phone2
                ? nextProps.allStates.schedulepickup.Phone2
                : this.state.fromPhone2,
              fromEmail: nextProps.allStates.schedulepickup.Email
                ? nextProps.allStates.schedulepickup.Email
                : this.state.fromEmail,
            });
          }
        }
      }
      let Fromobj = nextProps.allStates.schedulepickup.FromSelectedCountry;
      this.setState({ FromSelectedCountry: Fromobj });
      this.getStates(Fromobj);
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
              fromStateList: res.data,
              fromStateAutoComplete: res.data.length ? true : false,
            });
            // this.senderZipChange(this.state.fromZipCode);
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

  showLoader = () => {
    this.setState({ Loading: true });
  };

  hideLoader = () => {
    this.setState({ Loading: false });
  };

  handleChange = (event, type) => {
    this.setState({ IsChanged: true });
    if (type === "fromcompanyname") {
      if (event.target.value.length <= 35) {
        this.setState({ fromCompanyName: event.target.value });
      }
    } else if (type === "fromcontactname") {
      if (event.target.value.length <= 35) {
        this.setState({ fromContactName: event.target.value });
      }
    } else if (type === "fromaddressline1") {
      if (event.target.value.length > 35) {
        this.setState({
          fromAddressLine1: this.state.fromAddressLine1,
          fromAddressLine1Err: true,
          fromAddressLine1HelperText:
            "Addressline 1 should be max 35 characters",
        });
      } else {
        this.setState({
          fromAddressLine1: event.target.value,
          fromAddressLine1Err: false,
          fromAddressLine1HelperText: "",
        });
      }
    } else if (type === "fromaddressline2") {
      if (event.target.value.length <= 35) {
        this.setState({ fromAddressLine2: event.target.value });
      }
    } else if (type === "fromaddressline3") {
      if (event.target.value.length <= 35) {
        this.setState({ fromAddressLine3: event.target.value });
      }
    } else if (type === "fromzipcode") {
      this.setState({ fromZipCode: event.target.value.replace(/\s/g, "") });
    } else if (type === "fromcity") {
      this.setState({
        fromCity: event.target.value,
      });
      //fromCity.label = this.state.fromCity;
    } else if (type === "fromstate") {
      this.setState({ fromState: event.target.value });
    } else if (type === "fromemail") {
      this.setState({ fromEmail: event.target.value });
    } else if (type === "fromphone1") {
      if (event.target.value.length <= 15) {
        this.setState({ fromPhone1: event.target.value.replace(/\D/g, "") });
      }
    } else if (type === "fromphone2") {
      if (event.target.value.length <= 15) {
        this.setState({ fromPhone2: event.target.value.replace(/\D/g, "") });
      }
    }
  };

  ChangeFromFedexCity = (event, type) => {
    if (type === "FedEx") {
      if (CommonConfig.isEmpty(event)) {
        return null;
      } else {
        this.setState({ FromFedExSelectedCity: event });
        var GetRate = this.state.getRate;
        GetRate.FromFedExCity = event;
        this.setState({ getRate: GetRate });
      }
    } else if (type === "UPS") {
      if (CommonConfig.isEmpty(event)) {
        return null;
      } else {
        this.setState({ FromUPSSelectedCity: event });
        var GetRate = this.state.getRate;
        GetRate.FromUPSCity = event;
        this.setState({ getRate: GetRate });
      }
    }
  };

  handleChange_Value1(type) {
    if (type === "FromFedExCity") {
      let selectedCity = this.state.FromFedExSelectedCity.value;

      if (
        this.state.FromSelectedCountry.value !== 107 &&
        (selectedCity == "" ||
          selectedCity == undefined ||
          selectedCity == null)
      ) {
        this.setState({
          fromFedexCityError: true,
          fromFedexCityHelperText: "Please select from fedex city",
        });
      } else {
        this.setState({
          fromFedexCityError: false,
          fromFedexCityHelperText: "",
        });
      }
    }
    if (type === "FromUPSCity") {
      let selectedCity = this.state.FromUPSSelectedCity.value;

      if (
        this.state.FromSelectedCountry.value !== 107 &&
        (selectedCity == "" ||
          selectedCity == undefined ||
          selectedCity == null)
      ) {
        this.setState({
          fromUPSCityError: true,
          fromUPSCityHelperText: "Please select from ups city",
        });
      } else {
        this.setState({ fromUPSCityError: false, fromUPSCityHelperText: "" });
      }
    }
  }

  ChangeFromCity = (event, value) => {
    if (value != null) {
      this.setState({ fromCity: value });
    }
  };

  ChangeFromState = (event, value) => {
    if (value != null) {
      this.setState({ fromState: value });
    }
  };

  handleBlur = (event, type) => {
    if (type === "fromcompanyname") {
      if (!CommonConfig.isEmpty(event.target.value)) {
        if (event.target.value.length > 35) {
          this.setState({
            fromCompanyName: event.target.value,
            fromCompanyNameErr: true,
            fromCompanyNameHelperText: "Company name is not valid.",
          });
        } else if (CommonConfig.RegExp.companyName.test(event.target.value)) {
          this.setState({
            fromCompanyName: event.target.value,
            fromCompanyNameErr: true,
            fromCompanyNameHelperText: "Company name is not valid.",
          });
        } else {
          this.setState({
            fromCompanyName: event.target.value,
            fromCompanyNameErr: false,
            fromCompanyNameHelperText: "",
          });
        }
      } else if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          fromCompanyName: event.target.value,
          fromCompanyNameErr: false,
          fromCompanyNameHelperText: "",
        });
      }
    } else if (type === "fromcontactname") {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          fromContactName: event.target.value,
          fromContactNameErr: true,
          fromContactNameHelperText: "Please enter sender Contact name",
        });
      } else if (event.target.value.length > 35) {
        this.setState({
          fromContactName: event.target.value,
          fromContactNameErr: true,
          fromContactNameHelperText: "Company name is not valid.",
        });
      } else {
        this.setState({
          fromContactName: event.target.value,
          fromContactNameErr: false,
          fromContactNameHelperText: "",
        });
      }
    } else if (type === "fromaddressline1") {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          fromAddressLine1: event.target.value,
          fromAddressLine1Err: true,
          fromAddressLine1HelperText: "Please enter sender Address",
        });
      } else if (event.target.value.length > 35) {
        this.setState({
          fromAddressLine1: event.target.value,
          fromAddressLine1Err: true,
          fromAddressLine1HelperText:
            "Addressline 1 should be max 35 characters",
        });
      } else {
        this.setState({
          fromAddressLine1: event.target.value,
          fromAddressLine1Err: false,
          fromAddressLine1HelperText: "",
        });
      }
    } else if (type === "fromaddressline2") {
      if (!CommonConfig.isEmpty(event.target.value)) {
        if (event.target.value.length > 35) {
          this.setState({
            fromAddressLine2: event.target.value,
            fromAddressLine2Err: true,
            fromAddressLine2HelperText:
              "Addressline 2 should be max 35 characters",
          });
        } else {
          this.setState({
            fromAddressLine2: event.target.value,
            fromAddressLine2Err: false,
            fromAddressLine2HelperText: "",
          });
        }
      }
    } else if (type === "fromaddressline3") {
      if (!CommonConfig.isEmpty(event.target.value)) {
        if (event.target.value.length > 35) {
          this.setState({
            fromAddressLine3: event.target.value,
            fromAddressLine3Err: true,
            fromAddressLine3HelperText:
              "Addressline 3 should be max 35 characters",
          });
        } else {
          this.setState({
            fromAddressLine3: event.target.value,
            fromAddressL3ne1Err: false,
            fromAddressLine3HelperText: "",
          });
        }
      }
    } else if (
      type === "fromzipcode" &&
      this.state.FromSelectedCountry.value !== 107
    ) {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          fromZipCode: event.target.value,
          fromZipCodeErr: true,
          fromZipCodeHelperText: "Please enter sender Zip Code ",
        });
      } else if (
        event.target.value.trim() !== event.target.value ||
        !event.target.value.match(CommonConfig.RegExp.zipCode)
      ) {
        this.setState({
          fromZipCode: event.target.value,
          fromZipCodeErr: true,
          fromZipCodeHelperText: "Zipcode is not valid ",
        });
      } else if (event.target.value.length > 12) {
        this.setState({
          fromZipCode: event.target.value,
          fromZipCodeErr: true,
          fromZipCodeHelperText: "Zipcode length should be max 12 character",
        });
      } else {
        this.senderZipChange(event.target.value.replace(/\s/g, ""));

        this.setState({
          fromZipCode: event.target.value.replace(/\s/g, ""),
          fromZipCodeErr: false,
          fromZipCodeHelperText: "",
        });
      }
    } else if (
      type === "fromcity" &&
      this.state.FromSelectedCountry.value !== 107
    ) {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          fromCity: event.target.value,
          fromCityErr: true,
          fromCityHelperText: "Please enter sender City",
        });
      } else if (CommonConfig.RegExp.companyName.test(event.target.value)) {
        this.setState({
          fromCity: event.target.value,
          fromCityErr: true,
          fromCityHelperText: "City is not valid",
        });
      } else if (event.target.value.length > 35) {
        this.setState({
          fromCity: event.target.value,
          fromCityErr: true,
          fromCityHelperText: "City shoule be max 35 characters",
        });
      } else {
        this.setState({
          fromCity: event.target.value,
          fromCityErr: false,
          fromCityHelperText: "",
        });
        //fromCity.label = this.state.fromCity;
      }
    } else if (
      type === "fromstate" &&
      this.state.FromSelectedCountry.value !== 107
    ) {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          fromState: event.target.value,
          fromStateErr: true,
          fromStateHelperText: "Please enter sender State",
        });
      } else if (CommonConfig.RegExp.companyName.test(event.target.value)) {
        this.setState({
          fromState: event.target.value,
          fromStateErr: true,
          fromStateHelperText: "State is not valid",
        });
      } else if (event.target.value.length > 35) {
        this.setState({
          fromState: event.target.value,
          fromStateErr: true,
          fromStateHelperText: "State shoule be max 35 characters",
        });
      } else {
        this.setState({
          fromState: event.target.value,
          fromStateErr: false,
          fromStateHelperText: "",
        });
      }
    } else if (type === "fromphone1") {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          fromPhone1: event.target.value,
          fromPhone1Err: true,
          fromPhone1HelperText: "Please enter sender Phone No.",
        });
      } else if (!event.target.value.match(CommonConfig.RegExp.phoneNumber)) {
        this.setState({
          fromPhone1: event.target.value,
          fromPhone1Err: true,
          fromPhone1HelperText: "Please enter valid Phone No.",
        });
      } else if (
        event.target.value.length < 5 ||
        event.target.value.length > 15
      ) {
        this.setState({
          fromPhone1: event.target.value,
          fromPhone1Err: true,
          fromPhone1HelperText: "Please enter valid Phone No.",
        });
      } else {
        this.setState({
          fromPhone1: event.target.value,
          fromPhone1Err: false,
          fromPhone1HelperText: "",
        });
      }
    } else if (type === "fromphone2") {
      if (!CommonConfig.isEmpty(event.target.value)) {
        if (!event.target.value.match(CommonConfig.RegExp.phoneNumber)) {
          this.setState({
            fromPhone2: event.target.value,
            fromPhone2Err: true,
            fromPhone2HelperText: "Please enter valid Phone No.",
          });
        } else if (
          event.target.value.length < 5 ||
          event.target.value.length > 15
        ) {
          this.setState({
            fromPhone2: event.target.value,
            fromPhone2Err: true,
            fromPhone2HelperText: "Please enter valid Phone No.",
          });
        } else {
          this.setState({
            fromPhone2: event.target.value,
            fromPhone2Err: false,
            fromPhone2HelperText: "",
          });
        }
      }
    } else if (type === "fromemail") {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          fromEmail: event.target.value,
          fromEmailErr: true,
          fromEmailHelperText: "Please enter sender Email ",
        });
      } else if (!event.target.value.match(CommonConfig.RegExp.email)) {
        this.setState({
          fromEmail: event.target.value,
          fromEmailErr: true,
          fromEmailHelperText: "Please enter valid Email",
        });
      } else {
        this.setState({
          fromEmail: event.target.value,
          fromEmailErr: false,
          fromEmailHelperText: "",
        });
      }
    }
  };

  isPickUpNeed = (event, type) => {
    if (type === "PickUp") {
      if (event.target.value === 0) {
        this.setState({
          selectedPickupType: event.target.value,
          IsPickUp: false,
        });
      } else if (event.target.value === 1) {
        this.setState({
          selectedPickupType: event.target.value,
          IsPickUp: true,
        });
      }
    } else if (type === "MovingBackIndia") {
      this.setState({
        movingBackIndia: event.target.value,
        isBackIndia: event.target.value,
        movingBackIndiaErr: false,
        movingBackIndiaHelperText: "",
      });
    } else if (type === "StayInIndia") {
      this.setState({
        StayInIndia: event.target.value,
        stayinIndiaErr: false,
        stayinIndiaHelperText: "",
      });
    } else if (type === "AppliedForTR") {
      this.setState({
        AppliedForTR: event.target.value,
        appliedForTRErr: false,
        appliedForTRHelperText: "",
      });
    } else if (type === "AbleToProvidePassport") {
      this.setState(
        {
          AbleToProvidePassport: event.target.value,
          ableToProvidePassportErr: false,
          ableToProvidePassportHelperText: "",
        },
        function() {
          this.provideClearance();
        }
      );
    } else if (type === "VisaCategory") {
      this.setState({
        VisaCategory: event.target.value,
        visaCategoryErr: false,
        visaCategoryHelperText: "",
      });
    } else if (type === "NameAsPerPassport") {
      this.setState({
        NameAsPerPassport: event.target.value,
        nameAsperPassportErr: false,
        nameAsperPassportHelperText: "",
      });
    } else if (type === "YearsOutsideIndia") {
      this.setState({
        YearsOutsideIndia: event.target.value,
        yearsOutsideIndiaErr: false,
        yearsOutsideIndiaHelperText: "",
      });
    }
  };

  provideClearance = () => {
    if (!this.state.AbleToProvidePassport) {
      this.setState({
        IsProvideClearance: true,
      });
    }
  };

  appendPickType() {
    return this.state.selectedShipmentType === "Ocean"
      ? this.state.pickup_type_ocean.map((pickup) => {
          return (
            <MenuItem
              classes={{ root: classes.selectMenuItem }}
              value={pickup.value}
            >
              {" "}
              {pickup.label}{" "}
            </MenuItem>
          );
        })
      : this.state.pickup_type.map((pickup) => {
          return (
            <MenuItem
              classes={{ root: classes.selectMenuItem }}
              value={pickup.value}
            >
              {" "}
              {pickup.label}{" "}
            </MenuItem>
          );
        });
    // return  this.state.pickup_type.map(pickup => {
    //         return(
    //           <MenuItem classes={{root: classes.selectMenuItem}} value={pickup.value}> {pickup.label}  </MenuItem>
    //         )
    //     });
  }

  yesOrNo = () => {
    return this.state.yesOrNo.map((yn) => {
      return (
        <MenuItem classes={{ root: classes.selectMenuItem }} value={yn.value}>
          {" "}
          {yn.label}{" "}
        </MenuItem>
      );
    });
  };

  visaCategoryMenu = () => {
    return this.state.visaCategoryList.map((yn) => {
      return (
        <MenuItem classes={{ root: classes.selectMenuItem }} value={yn.value}>
          {" "}
          {yn.label}{" "}
        </MenuItem>
      );
    });
  };

  handleDateChange = (date, type) => {
    if (type === "PickUp") {
      this.setState({ pickUpDate: date });
    } else if (type === "ArrivalDate") {
      this.setState({
        LatestArrivalDate: date,
        arrivalDateErr: false,
        arrivalDateHelperText: "",
      });
    } else if (type === "VisaValidDate") {
      this.setState({
        VisaValidDate: date,
        visaDateErr: false,
        visaDateHelperText: "",
      });
    }
  };

  sendState() {
    return this.state;
  }

  validate(event) {
    let IsFormValid = true;

    if (CommonConfig.isEmpty(this.state.fromContactName)) {
      IsFormValid = false;
      this.setState({
        fromContactNameErr: true,
        fromContactNameHelperText: "Please enter sender Contact Name",
      });
    }
    if (CommonConfig.isEmpty(this.state.fromAddressLine1)) {
      IsFormValid = false;
      this.setState({
        fromAddressLine1Err: true,
        fromAddressLine1HelperText: "Please enter sender Address",
      });
    }
    // if (
    //   CommonConfig.isEmpty(this.state.fromZipCode) &&
    //   !this.state.FromZipcodeOptional &&
    //   this.state.FromSelectedCountry.value !== 107
    // ) {
    //   IsFormValid = false;
    //   this.setState({
    //     fromZipCodeErr: true,
    //     fromZipCodeHelperText: "Please enter sender Zipcode",
    //   });
    // }

    // ============ fed ex city validation =======================================
    let selectedCity = this.state.FromFedExSelectedCity.value;

    if (
      (selectedCity == "" ||
        selectedCity == undefined ||
        selectedCity == null) &&
      this.state.disablefromState == true &&
      this.state.FromSelectedCountry.value !== 107
    ) {
      IsFormValid = false;
      this.setState({
        fromFedexCityError: true,
        fromFedexCityHelperText: "Please select from fedex city",
      });
    }

    // ============ fed ex city validation end ================================

    if (
      this.state.fromCityAutoComplete === false &&
      this.state.disablefromZipcode == false &&
      this.state.FromSelectedCountry.value !== 107
    ) {
      if (CommonConfig.isEmpty(this.state.fromCity)) {
        IsFormValid = false;
        this.setState({
          fromCityErr: true,
          fromCityHelperText: "Please enter sender City",
        });
      }
    }

    if (
      this.state.fromStateAutoComplete === false &&
      this.state.disablefromState == false &&
      this.state.FromSelectedCountry.value !== 107
    ) {
      if (CommonConfig.isEmpty(this.state.fromState)) {
        IsFormValid = false;
        this.setState({
          fromStateErr: true,
          fromStateHelperText: "Please enter sender State",
        });
      }
    }

    if (CommonConfig.isEmpty(this.state.fromPhone1)) {
      IsFormValid = false;
      this.setState({
        fromPhone1Err: true,
        fromPhone1HelperText: "Please enter sender Phone No.",
      });
    }

    if (this.state.fromPhone1Err) {
      IsFormValid = false;
      this.setState({
        fromPhone1Err: true,
        fromPhone1HelperText: "Please enter valid sender Phone No.",
      });
    }

    if (this.state.fromPhone2Err) {
      IsFormValid = false;
      this.setState({
        fromPhone2Err: true,
        fromPhone2HelperText: "Please enter valid sender Phone No.",
      });
    }

    if (CommonConfig.isEmpty(this.state.fromEmail)) {
      IsFormValid = false;
      this.setState({
        fromEmailErr: true,
        fromEmailHelperText: "Please enter sender Email",
      });
    }

    if (this.state.fromEmailErr) {
      IsFormValid = false;
      this.setState({
        fromEmailErr: true,
        fromEmailHelperText: "Please enter valid sender Email",
      });
    }

    if (this.state.fromCompanyNameErr) {
      IsFormValid = false;
      this.setState({
        fromCompanyNameErr: true,
        fromCompanyNameHelperText: "Please enter valid company name",
      });
    }

    if (this.state.fromAddressLine1Err) {
      IsFormValid = false;
      this.setState({
        fromAddressLine1Err: true,
        fromAddressLine1HelperText: "Please enter valid address line 1",
      });
    }

    if (this.state.fromAddressLine2Err) {
      IsFormValid = false;
      this.setState({
        fromAddressLine2Err: true,
        fromAddressLine2HelperText: "Please enter valid address line 2",
      });
    }

    if (this.state.fromAddressLine3Err) {
      IsFormValid = false;
      this.setState({
        fromAddressLine3Err: true,
        fromAddressLine3HelperText: "Please enter valid address line 3",
      });
    }

    if (
      this.state.fromZipCodeErr &&
      this.state.FromSelectedCountry.value !== 107
    ) {
      IsFormValid = false;
      this.setState({
        fromZipCodeErr: true,
        fromZipCodeHelperText: "Please enter valid zip code",
      });
    }
    if (this.state.selectedShipmentType === "Ocean") {
      if (CommonConfig.isEmpty(this.state.movingBackIndia)) {
        IsFormValid = false;
        this.setState({
          movingBackIndiaErr: true,
          movingBackIndiaHelperText: "Please select any one",
        });
      }

      if (this.state.movingBackIndia === true) {
        if (CommonConfig.isEmpty(this.state.NameAsPerPassport)) {
          IsFormValid = false;
          this.setState({
            nameAsperPassportErr: true,
            nameAsperPassportHelperText: "Please enter Name as Per Passport",
          });
        }

        if (CommonConfig.isEmpty(this.state.StayInIndia)) {
          IsFormValid = false;
          this.setState({
            stayinIndiaErr: true,
            stayinIndiaHelperText: "Please select any one",
          });
        }

        if (CommonConfig.isEmpty(this.state.AppliedForTR)) {
          IsFormValid = false;
          this.setState({
            appliedForTRErr: true,
            appliedForTRHelperText: "Please select any one",
          });
        }

        if (CommonConfig.isEmpty(this.state.AbleToProvidePassport)) {
          IsFormValid = false;
          this.setState({
            ableToProvidePassportErr: true,
            ableToProvidePassportHelperText: "Please select any one",
          });
        }

        if (CommonConfig.isEmpty(this.state.YearsOutsideIndia)) {
          IsFormValid = false;
          this.setState({
            yearsOutsideIndiaErr: true,
            yearsOutsideIndiaHelperText: "Please select one",
          });
        }

        if (CommonConfig.isEmpty(this.state.LatestArrivalDate)) {
          IsFormValid = false;
          this.setState({
            arrivalDateErr: true,
            arrivalDateHelperText: "Please select Latest Arrival Date",
          });
        }

        if (CommonConfig.isEmpty(this.state.VisaCategory)) {
          IsFormValid = false;
          this.setState({
            visaCategoryErr: true,
            visaCategoryHelperText: "Please select Visa Category",
          });
        }
        if (CommonConfig.isEmpty(this.state.VisaValidDate)) {
          IsFormValid = false;
          this.setState({
            visaDateErr: true,
            visaDateHelperText: "Please select Visa Date",
          });
        }
      }

      if (this.state.movingBackIndia === false) {
        this.setState({
          NameAsPerPassport: "",
          YearsOutsideIndia: "",
          StayInIndia: "",
          LatestArrivalDate: "",
          AppliedForTR: "",
          AbleToProvidePassport: "",
          VisaValidDate: "",
          VisaCategory: "",
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
          visaCategoryErr: false,
          visaCategoryHelperText: "",
          visaDateErr: false,
          visaDateHelperText: "",
          arrivalDateErr: false,
          arrivalDateHelperText: "",
          yearsOutsideIndiaErr: false,
          yearsOutsideIndiaHelperText: "",
        });
      }
    }
    // if (
    //   this.state.FromSelectedCountry.value === 107 &&
    //   CommonConfig.isEmpty(this.state.fromCity)
    // ) {
    //   IsFormValid = false;
    //   this.setState({
    //     fromCityErr: true,
    //     fromCityHelperText: "Please select from  city",
    //   });
    // }
    return IsFormValid;
  }

  senderZipChange = (zip) => {
    if (this.state.FromSelectedCountry.value !== 107) {
      if (zip.length && (!this.state.isDisableFields || !this.state.isSkip)) {
        fetch(
          CommonConfig.zipCodeAPIKey(zip, this.state.FromSelectedCountry.label)
        )
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

                // var CityData = data["results"][0]["postcode_localities"];
                // _.forEach(CityData, function(value, key) {
                //   FinalCity.push({
                //     City_code: value,
                //     Name: value,
                //   });
                // });

                // var CityData = _.filter(
                //   data["results"][0]["address_components"],
                //   function(data) {
                //     return data.types[0] === "locality";
                //   }
                // )[0].long_name;

                // FinalCity.push({
                //   City_code: CityData,
                //   Name: CityData,
                // });

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
                    if (data.types[0] == "postal_town") {
                      return data.types[0] === "postal_town";
                    }
                  }
                );

                var CityData5 = _.filter(
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
                } else if (CityData5.length > 0) {
                  CityData5 = CityData5[0].long_name;
                  FinalCity.push({
                    City_code: CityData5,
                    Name: CityData5,
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

                // var SelectedCity = {
                //   value: FinalCity[0].City_code,
                //   label: FinalCity[0].Name,
                // };

                var SelectedState = { value: state, label: state };
                if (countryShortName === this.state.FromSelectedCountry.label) {
                  this.setState({
                    fromCityAutoComplete: FinalCity.length ? true : false,
                    fromStateAutoComplete: this.state.fromStateList.length
                      ? true
                      : false,
                    fromGoogleAPICityList: FinalCity,
                    fromState: this.state.fromStateList.length
                      ? SelectedState
                      : state,
                    fromCity: SelectedCity.label,
                  });
                } else {
                  this.setState({
                    fromCityAutoComplete: false,
                    fromStateAutoComplete: this.state.fromStateList.length
                      ? true
                      : false,
                    fromGoogleAPICityList: [],
                    fromState: "",
                    fromCity: "",
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
                if (countryShortName === this.state.FromSelectedCountry.label) {
                  console.log(
                    "this.state.fromFedexCityList",
                    this.state.fromFedexCityList
                  );
                  this.setState({
                    fromCityAutoComplete: FinalCity.length ? true : false,
                    fromStateAutoComplete: this.state.fromStateList.length
                      ? true
                      : false,
                    fromGoogleAPICityList: FinalCity,
                    fromState: this.state.fromStateList.length
                      ? SelectedState
                      : state,
                    fromCity:
                      this.state.fromFedexCityList.length > 0
                        ? ""
                        : SelectedCity,
                    FromFedExSelectedCity:
                      this.state.fromFedexCityList.length > 0
                        ? SelectedCity
                        : "",
                  });
                } else {
                  this.setState({
                    fromCityAutoComplete: false,
                    fromStateAutoComplete: this.state.fromStateList.length
                      ? true
                      : false,
                    fromGoogleAPICityList: [],
                    fromState: "",
                    fromCity: "",
                    fromZipCodeErr: false,
                    fromZipCodeHelperText: "",
                  });
                }
                this.hideLoader();
              }
            } else {
              // cogoToast.error("Zip code not found");
              this.setState({
                fromCityAutoComplete: false,
                fromStateAutoComplete: this.state.fromStateList.length
                  ? true
                  : false,
                fromGoogleAPICityList: [],
                fromState: "",
                fromCity: "",
                // fromZipCodeErr: true,
                // fromZipCodeHelperText: "Please enter valid Zipcode",
              });
              this.hideLoader();
            }
          });
      }
    }
  };

  yearsRender = () => {
    return this.state.yearsLength.map((year) => {
      return (
        <MenuItem classes={{ root: classes.selectMenuItem }} value={year.value}>
          {year.label}
        </MenuItem>
      );
    });
  };

  setProvideClearance = () => {
    this.setState({
      IsProvideClearance: false,
    });
  };
  render() {
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
      fromFedExCity,
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

    const fromStateAutoCompleteVal =
      typeof fromState !== "object"
        ? { value: fromState, label: fromState }
        : fromState;
    console.log("fromStateAutoCompleteVal...", fromStateAutoCompleteVal);
    console.log("fromState...", fromState);
    const fromCityAutoCompleteVal =
      typeof fromCity !== "object"
        ? { value: fromCity, label: fromCity }
        : fromCity;
    console.log("fromCityAutoCompleteVal...", fromCityAutoCompleteVal);
    console.log("fromCity...", fromCity);
    const fromCityOptions = this.state.fromGoogleAPICityList.map((city) => {
      return { value: city.City_code, label: city.Name };
    });
    const fromStateOptions = this.state.fromStateList.map((state) => {
      return { value: state.StateName, label: state.StateName };
    });

    var FromFedExCityListDisplay = this.state.fromFedexCityList.map((city) => {
      return { value: city.CityCode, label: city.CityName };
    });
    var FromUPSCityListDisplay = this.state.fromUPSCityList.map((city) => {
      return { value: city.CityCode, label: city.CityName };
    });

    return (
      <div>
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
        <form className="datePicker">
          <GridContainer>
            <GridItem sm={4} md={4}>
              <CustomInput
                id="fromcountry"
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: this.state.FromSelectedCountry.label,
                  disabled: true,
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      className={classes.inputAdornment}
                    >
                      <Icon className={classes.User}>public </Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </GridItem>
            <GridItem sm={4} md={4}>
              <CustomInput
                id="companyname"
                maxLength="11"
                labelText="Company Name"
                error={fromCompanyNameErr}
                helperText={fromCompanyNameHelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: fromCompanyName,
                  onBlur: (event) => this.handleBlur(event, "fromcompanyname"),
                  onChange: (event) =>
                    this.handleChange(event, "fromcompanyname"),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      className={classes.inputAdornment}
                    >
                      <Icon className={classes.User}>business</Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </GridItem>
            <GridItem sm={4} md={4}>
              <CustomInput
                success={false}
                labelText="Contact Name"
                id="contactname"
                error={fromContactNameErr}
                helperText={fromContactNameHelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: fromContactName,
                  onBlur: (event) => this.handleBlur(event, "fromcontactname"),
                  onChange: (event) =>
                    this.handleChange(event, "fromcontactname"),
                  onFocus: (event) =>
                    this.setState({
                      fromContactNameErr: false,
                      fromContactNameHelperText: "",
                    }),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      className={classes.inputAdornment}
                    >
                      <Icon className="requiredicon">person</Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </GridItem>
          </GridContainer>

          <GridContainer>
            <GridItem sm={4} md={4}>
              <CustomInput
                id="addressline1"
                labelText="Address Line 1"
                error={fromAddressLine1Err}
                helperText={fromAddressLine1HelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: fromAddressLine1,
                  onBlur: (event) => this.handleBlur(event, "fromaddressline1"),
                  onChange: (event) =>
                    this.handleChange(event, "fromaddressline1"),
                  onFocus: () =>
                    this.setState({
                      fromAddressLine1Err: false,
                      fromAddressLine1HelperText: "",
                    }),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      className={classes.inputAdornment}
                    >
                      <Icon className="requiredicon">room</Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </GridItem>
            <GridItem sm={4} md={4}>
              <CustomInput
                id="addressline2"
                labelText="Address Line 2"
                error={fromAddressLine2Err}
                helperText={fromAddressLine2HelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: fromAddressLine2,
                  onBlur: (event) => this.handleBlur(event, "fromaddressline2"),
                  onChange: (event) =>
                    this.handleChange(event, "fromaddressline2"),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      className={classes.inputAdornment}
                    >
                      <Icon className={classes.User}>room</Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </GridItem>
            <GridItem sm={4} md={4}>
              <CustomInput
                labelText="Address Line 3"
                id="addressline3"
                error={fromAddressLine3Err}
                helperText={fromAddressLine3HelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: fromAddressLine3,
                  onBlur: (event) => this.handleBlur(event, "fromaddressline3"),
                  onChange: (event) =>
                    this.handleChange(event, "fromaddressline3"),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      className={classes.inputAdornment}
                    >
                      <Icon className={classes.User}>room</Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </GridItem>
          </GridContainer>

          <GridContainer>
            <GridItem sm={4} md={4}>
              <CustomInput
                labelText="Zip Code"
                error={fromZipCodeErr}
                helperText={fromZipCodeHelperText}
                id="zipcode"
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: this.state.FromZipcodeOptional
                    ? "Not Required"
                    : this.state.disablefromState
                    ? "Not Required"
                    : fromZipCode,
                  disabled: this.state.disablefromZipcode,
                  onBlur: (event) => this.handleBlur(event, "fromzipcode"),
                  onChange: (event) => this.handleChange(event, "fromzipcode"),
                  onFocus: () =>
                    this.setState({
                      fromZipCodeErr: false,
                      fromZipCodeHelperText: "",
                    }),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      className={classes.inputAdornment}
                    >
                      <Icon className="requiredicon"> drafts</Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </GridItem>

            {this.props &&
            this.props.allStates !== null &&
            this.props.allStates.schedulepickup &&
            this.props.allStates.schedulepickup.GetRate &&
            this.props.allStates.schedulepickup.GetRate.FromCountry
              .IsFedexCity == 1 ? (
              <GridItem xs={12} sm={12} md={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    options={FromFedExCityListDisplay}
                    id="FromFedExCity"
                    getOptionLabel={(option) => option.label}
                    value={this.state.FromFedExSelectedCity}
                    autoSelect
                    onBlur={(e) => this.handleChange_Value1("FromFedExCity")}
                    onChange={(event, value) =>
                      this.ChangeFromFedexCity(value, "FedEx")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="From City"
                        fullWidth
                        error={this.state.fromFedexCityError}
                        helperText={this.state.fromFedexCityHelperText}
                      />
                    )}
                  />
                </FormControl>
              </GridItem>
            ) : (
              <GridItem sm={4} md={4}>
                {this.state.fromCityAutoComplete === false ? (
                  <CustomInput
                    labelText="City"
                    id="city"
                    error={fromCityErr}
                    helperText={fromCityHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: fromCity.label ? fromCity.label : fromCity,
                      disabled: this.state.disablefromCity,
                      onBlur: (event) => this.handleBlur(event, "fromcity"),
                      onChange: (event) => this.handleChange(event, "fromcity"),
                      onFocus: () =>
                        this.setState({
                          fromCityErr: false,
                          fromCityHelperText: "",
                        }),
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          className={classes.inputAdornment}
                        >
                          <Icon className="requiredicon">location_city</Icon>
                        </InputAdornment>
                      ),
                    }}
                  />
                ) : (
                  <CustomInput
                    labelText="City"
                    id="city"
                    error={fromCityErr}
                    helperText={fromCityHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: fromCity.label ? fromCity.label : fromCity,
                      disabled: this.state.disablefromCity,
                      onBlur: (event) => this.handleBlur(event, "fromcity"),
                      onChange: (event) => this.handleChange(event, "fromcity"),
                      onFocus: () =>
                        this.setState({
                          fromCityErr: false,
                          fromCityHelperText: "",
                        }),
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          className={classes.inputAdornment}
                        >
                          <Icon className="requiredicon">location_city</Icon>
                        </InputAdornment>
                      ),
                    }}
                  />
                  // <Autocomplete
                  //   options={fromCityOptions}
                  //   id="fromcity"
                  //   autoSelect
                  //   disabled={this.state.disablefromCity}
                  //   getOptionLabel={(option) => option.label}
                  //   value={fromCityAutoCompleteVal}
                  //   onChange={(event, value) =>
                  //     this.ChangeFromCity(event, value)
                  //   }
                  //   renderInput={(params) => (
                  //     <TextField
                  //       {...params}
                  //       margin="normal"
                  //       label="City2"
                  //       fullWidth
                  //     />
                  //   )}
                  // />
                )}
              </GridItem>
            )}

            <GridItem sm={4} md={4}>
              {this.state.fromStateAutoComplete === false ? (
                <CustomInput
                  labelText="State"
                  id="state"
                  error={fromStateErr}
                  helperText={fromStateHelperText}
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    value: this.state.disablefromState
                      ? "Not Required"
                      : fromState,
                    disabled: this.state.disablefromState,
                    onBlur: (event) => this.handleBlur(event, "fromstate"),
                    onChange: (event) => this.handleChange(event, "fromstate"),
                    onFocus: () =>
                      this.setState({
                        fromStateErr: false,
                        fromStateHelperText: "",
                      }),
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        className={classes.inputAdornment}
                      >
                        <Icon className="requiredicon">location_city</Icon>
                      </InputAdornment>
                    ),
                  }}
                />
              ) : (
                <Autocomplete
                  options={fromStateOptions}
                  id="fromState"
                  autoSelect
                  disabled={this.state.disablefromState}
                  getOptionLabel={(option) => option.label}
                  value={fromStateAutoCompleteVal}
                  onChange={(event, value) =>
                    this.ChangeFromState(event, value)
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
            <GridItem sm={4} md={4}>
              <CustomInput
                labelText="Phone 1"
                id="phone1"
                error={fromPhone1Err}
                helperText={fromPhone1HelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: fromPhone1,
                  onBlur: (event) => this.handleBlur(event, "fromphone1"),
                  onChange: (event) => this.handleChange(event, "fromphone1"),
                  onFocus: () =>
                    this.setState({
                      fromPhone1Err: false,
                      fromPhone1HelperText: "",
                    }),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      className={classes.inputAdornment}
                    >
                      <Icon className="requiredicon"> phone</Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </GridItem>
            <GridItem sm={4} md={4}>
              <CustomInput
                labelText="Phone 2"
                id="phone2"
                error={fromPhone2Err}
                helperText={fromPhone2HelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: fromPhone2,
                  onBlur: (event) => this.handleBlur(event, "fromphone2"),
                  onChange: (event) => this.handleChange(event, "fromphone2"),
                  onFocus: (event) =>
                    this.setState({
                      fromPhone2Err: false,
                      fromPhone2HelperText: "",
                    }),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      className={classes.inputAdornment}
                    >
                      <Icon className={classes.User}>phone_in_talk</Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </GridItem>
            <GridItem sm={4} md={4}>
              <CustomInput
                labelText="Email Address"
                id="email"
                error={fromEmailErr}
                helperText={fromEmailHelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: fromEmail,
                  onBlur: (event) => this.handleBlur(event, "fromemail"),
                  onChange: (event) => this.handleChange(event, "fromemail"),
                  onFocus: (event) =>
                    this.setState({
                      fromEmailErr: false,
                      fromEmailHelperText: "",
                    }),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      className={classes.inputAdornment}
                    >
                      <Icon className="requiredicon">email</Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </GridItem>
          </GridContainer>
          {selectedShipmentType === "Ocean" ? (
            <>
              <GridContainer>
                <GridItem sm={4} md={4}>
                  <div className="select-spl">
                    <FormControl
                      fullWidth
                      error={this.state.movingBackIndiaErr}
                    >
                      <InputLabel className={classes.selectLabel}>
                        Are you moving back to India?
                      </InputLabel>
                      <Select
                        value={this.state.movingBackIndia}
                        onChange={(event) =>
                          this.isPickUpNeed(event, "MovingBackIndia")
                        }
                        inputProps={{
                          name: "movingBackIndia",
                          id: "movingBackIndia",
                        }}
                      >
                        onFocus=
                        {() =>
                          this.setState({
                            movingBackIndiaErr: false,
                            movingBackIndiaHelperText: "",
                          })
                        }
                        {this.yesOrNo()}
                      </Select>
                      <FormHelperText>
                        {this.state.movingBackIndiaHelperText}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </GridItem>
                {isBackIndia ? (
                  <>
                    <GridItem sm={4} md={4}>
                      <CustomInput
                        formControlProps={{ fullWidth: true }}
                        labelText="Your Name as per passport?"
                        error={this.state.nameAsperPassportErr}
                        helperText={this.state.nameAsperPassportHelperText}
                        inputProps={{
                          value: this.state.NameAsPerPassport,
                          onChange: (e) =>
                            this.isPickUpNeed(e, "NameAsPerPassport"),
                        }}
                      />
                    </GridItem>
                    <GridItem sm={4} md={4}>
                      <div className="select-spl">
                        <FormControl
                          fullWidth
                          error={this.state.yearsOutsideIndiaErr}
                        >
                          <InputLabel className={classes.selectLabel}>
                            How many years stayed outside India?
                          </InputLabel>
                          <Select
                            value={this.state.YearsOutsideIndia}
                            onChange={(event) =>
                              this.isPickUpNeed(event, "YearsOutsideIndia")
                            }
                            inputProps={{
                              name: "yearsoutsideIndia",
                              id: "yearsoutsideIndia",
                            }}
                          >
                            onFocus=
                            {() =>
                              this.setState({
                                yearsOutsideIndiaErr: false,
                                yearsOutsideIndiaHelperText: "",
                              })
                            }
                            {this.yearsRender()}
                          </Select>
                          <FormHelperText>
                            {this.state.yearsOutsideIndiaHelperText}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </GridItem>
                  </>
                ) : null}
              </GridContainer>
              {isBackIndia ? (
                <GridContainer>
                  <GridItem sm={4} md={4}>
                    <div className="select-spl">
                      <FormControl fullWidth error={this.state.stayinIndiaErr}>
                        <InputLabel className={classes.selectLabel}>
                          Stayed in India for more than 6 months in last 2
                          years?
                        </InputLabel>
                        <Select
                          value={this.state.StayInIndia}
                          onChange={(event) =>
                            this.isPickUpNeed(event, "StayInIndia")
                          }
                          inputProps={{
                            name: "stayinIndia",
                            id: "stayinIndia",
                          }}
                        >
                          onFocus=
                          {() =>
                            this.setState({
                              stayinIndiaErr: false,
                              stayinIndiaHelperText: "",
                            })
                          }
                          {this.yesOrNo()}
                        </Select>
                        <FormHelperText>
                          {this.state.stayinIndiaHelperText}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </GridItem>
                  <GridItem sm={4} md={4}>
                    <div className="select-spl">
                      <FormControl fullWidth error={this.state.appliedForTRErr}>
                        <InputLabel className={classes.selectLabel}>
                          Have you applied for TR in last 3 years?
                        </InputLabel>
                        <Select
                          value={this.state.AppliedForTR}
                          onChange={(event) =>
                            this.isPickUpNeed(event, "AppliedForTR")
                          }
                          inputProps={{
                            name: "appliedForTR",
                            id: "appliedForTR",
                          }}
                        >
                          onFocus=
                          {() =>
                            this.setState({
                              appliedForTRErr: false,
                              appliedForTRHelperText: "",
                            })
                          }
                          {this.yesOrNo()}
                        </Select>
                        <FormHelperText>
                          {this.state.appliedForTRHelperText}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </GridItem>
                  <GridItem sm={4} md={4}>
                    <div className="select-spl">
                      <FormControl
                        fullWidth
                        error={this.state.ableToProvidePassportErr}
                      >
                        <InputLabel className={classes.selectLabel}>
                          Will Provide Original Passport for Custom Clearance?
                        </InputLabel>
                        <Select
                          value={this.state.AbleToProvidePassport}
                          onChange={(event) =>
                            this.isPickUpNeed(event, "AbleToProvidePassport")
                          }
                          inputProps={{
                            name: "ableToProvidePassport",
                            id: "ableToProvidePassport",
                          }}
                        >
                          onFocus=
                          {() =>
                            this.setState({
                              ableToProvidePassportErr: false,
                              ableToProvidePassportHelperText: "",
                            })
                          }
                          {this.yesOrNo()}
                        </Select>
                        <FormHelperText>
                          {this.state.ableToProvidePassportHelperText}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </GridItem>
                </GridContainer>
              ) : null}
              {isBackIndia ? (
                <GridContainer>
                  <GridItem sm={4} md={4} className="z-index-9">
                    <div style={{ marginTop: "18px" }} className="date-input">
                      <InputLabel className={classes.label}>
                        Your latest arrival date in India?
                      </InputLabel>
                      <FormControl fullWidth>
                        <Datetime
                          timeFormat={false}
                          value={this.state.LatestArrivalDate}
                          onChange={(date) =>
                            this.handleDateChange(date, "ArrivalDate")
                          }
                          closeOnSelect={true}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              margin="normal"
                              fullWidth
                              error={this.state.arrivalDateErr}
                              helperText={this.state.arrivalDateHelperText}
                            />
                          )}
                        />
                      </FormControl>
                    </div>
                  </GridItem>
                  <GridItem sm={4} md={4}>
                    <div className="select-spl">
                      <FormControl fullWidth error={this.state.visaCategoryErr}>
                        <InputLabel className={classes.selectLabel}>
                          Arriving in India with?
                        </InputLabel>
                        <Select
                          value={this.state.VisaCategory}
                          onChange={(event) =>
                            this.isPickUpNeed(event, "VisaCategory")
                          }
                          inputProps={{
                            name: "visaCategory",
                            id: "visaCategory",
                          }}
                        >
                          onFocus=
                          {() =>
                            this.setState({
                              visaCategoryErr: false,
                              visaCategoryHelperText: "",
                            })
                          }
                          {this.visaCategoryMenu()}
                        </Select>
                        <FormHelperText>
                          {this.state.visaCategoryHelperText}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </GridItem>
                  <GridItem sm={4} md={4}>
                    <div style={{ marginTop: "18px" }} className="date-input">
                      <InputLabel className={classes.label}>
                        Validity Date
                      </InputLabel>
                      <FormControl fullWidth>
                        <Datetime
                          timeFormat={false}
                          value={this.state.VisaValidDate}
                          onChange={(date) =>
                            this.handleDateChange(date, "VisaValidDate")
                          }
                          closeOnSelect={true}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              margin="normal"
                              fullWidth
                              error={this.state.visaDateErr}
                              helperText={this.state.visaDateHelperText}
                            />
                          )}
                        />
                      </FormControl>
                    </div>
                  </GridItem>
                </GridContainer>
              ) : null}
            </>
          ) : null}

          <div>
            <Dialog
              open={IsProvideClearance}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                Will provide Passport for Clearance
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Original Passport is required to qualify for Transfer of
                  Residence and get relief in custom duty. If Original Passport
                  is not available shipment cannot be clear under Transfer of
                  Residence and standard customs duty will be applied on entire
                  shipment per Indian Customs Regulations.
                  <div className="select-spl">
                    <FormControl
                      fullWidth
                      error={this.state.ableToProvidePassportErr}
                    >
                      <InputLabel className={classes.selectLabel}>
                        Will Provide Original Passport for Custom Clearance?
                      </InputLabel>
                      <Select
                        value={this.state.AbleToProvidePassport}
                        onChange={(event) =>
                          this.isPickUpNeed(event, "AbleToProvidePassport")
                        }
                        inputProps={{
                          name: "ableToProvidePassport",
                          id: "ableToProvidePassport",
                        }}
                      >
                        onFocus=
                        {() =>
                          this.setState({
                            ableToProvidePassportErr: false,
                            ableToProvidePassportHelperText: "",
                          })
                        }
                        {this.yesOrNo()}
                      </Select>
                      <FormHelperText>
                        {this.state.ableToProvidePassportHelperText}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => this.setState({ IsProvideClearance: false })}
                  color="primary"
                  className="aesfilling-btn"
                >
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </form>
      </div>
    );
  }
}

Scheduleshipment.propTypes = {
  classes: PropTypes.object,
};

export default withStyles()(Scheduleshipment);
