/*eslint-disable*/
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import SimpleBackdrop from "../../utils/general";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import { CommonConfig } from "../../utils/constant";
import cogoToast from "cogo-toast";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import FlightTakeoff from "@material-ui/icons/FlightTakeoff";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import CloseIcon from "@material-ui/icons/Close";
import Button from "components/CustomButtons/Button.js";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Datetime from "react-datetime";
import DeleteIcon from "@material-ui/icons/Delete";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Radio from "@material-ui/core/Radio";
import MenuItem from "@material-ui/core/MenuItem";
import CardBody from "components/Card/CardBody";

const useStyles = makeStyles(styles);
const classes = () => {
  return useStyles();
};

class Scheduleshipmentnew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shipmentType: "",
      PackageDetails: [],

      checkedTerm: false,
      IsTermShow: false,
      dutyType: "Recipient",
      valid: moment().toDate(),
      Loading: false,

      DoyouNeedPickup: "",
      pickUpDate: moment().toDate(),

      from_address: {},
      to_address: {},

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

      toCountryID: 0,
      toCountryName: "",
      toCountryCode: "",
      toCompanyName: "",
      toCompanyNameErr: false,
      toCompanyNameHelperText: "",

      toContactName: "",
      toContactNameErr: false,
      toContactNameHelperText: "",

      toAddressLine1: "",
      toAddressLine2: "",
      toAddressLine3: "",
      toAddressLine1Err: false,
      toAddressLine1HelperText: "",
      toAddressLine2Err: false,
      toAddressLine2HelperText: "",
      toAddressLine3Err: false,
      toAddressLine3HelperText: "",

      toZipCode: "",
      toZipCodeErr: false,
      toZipCodeHelperText: "",

      toState: "",
      toStateErr: false,
      toStateHelperText: "",

      toCity: "",
      toCityErr: false,
      toCityHelperText: "",

      toPhone1: "",
      toPhone1Err: false,
      toPhone1HelperText: "",

      toPhone2: "",
      toPhone2Err: false,
      toPhone2HelperText: "",

      toEmail: "",
      toEmailErr: false,
      toEmailHelperText: "",

      cardNumber: "",
      cardNumberErr: false,
      cardNumberHelperText: "",

      cardName: "",
      CardNameErr: false,
      cardNameHelperText: "",

      cardType: "",

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
      year_value: "",

      selectedPaymentType: "Pay Online",
      selectPayonline: 1,
      selectBank: 2,
      hidePayonline: true,
      hideSelectbank: false,
      payOnline: 1,
      payBank: 1,

      fromCityAutoComplete: false,
      toCityAutoComplete: false,

      fromGoogleAPICityList: [],
      toGoogleAPICityList: [],

      Residential: [
        { value: "No", label: "No" },
        { value: "Yes", label: "Yes" },
      ],

      PickupType: [
        { value: "No", label: "No" },
        { value: "Yes", label: "Yes" },
      ],

      location_type: [
        { value: "Residential", label: "Residential" },
        { value: "Commercial", label: "Commercial" },
      ],

      pickup_type: [
        { value: 1, label: "Yes - Additional Charge may apply" },
        { value: 0, label: "No - I will Drop off my Package" },
      ],

      PackageType: [
        { value: "Envelop", label: "Documents (Under 0.5Lbs)" },
        { value: "Package", label: "Package" },
      ],

      GetRate: {
        WeightType: "LBS",
        PickUp: "No",
        Residential: "No",

        TotalWeight: 0,
        TotalChargableWeight: 0,
        TotalInsuredValue: 0,
      },

      IsPackage: true,
      IsPickUp: false,
      IsCommercial: true,
      SelectedLocationType: "Residential",
      selectedPackageType: "Package",
      selectedPickupType: 0,
      pickup_date: moment().toDate(),

      commercialData: [],
      totalCommercial: 0,

      values: [{ name: "1", id: 1 }],
      sr_no: [],

      globalCommercialcount: 1,

      commercialDataHeader: {
        package_number: "Package Number",
        content_description: "Content Description",
        quantity: "Quantity",
        value_per_qty: "Value Per Qty",
        total_value: "Total Value",
      },
      commercial_data: [],
      MaxPackageCount: 10,

      ObjDocument: {
        PackageNumber: 1,
        PackageWeight: 0.5,
        PackageWidth: 13,
        PackageLength: 10,
        PackageHeight: 1,
        PackageChargableWeight: 0.5,
        PackageInsuredValue: 0.0,
      },

      ObjPackage: {
        PackageNumber: 1,
        PackageWeight: "",
        PackageWidth: "",
        PackageLength: "",
        PackageHeight: "",
        PackageChargableWeight: "",
        PackageInsuredValue: 0,
      },

      No_packageType: [
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
      ],

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

      selectedPackageNumbers: { value: "1", label: "1" },
    };

    this.state.PackageDetails = [this.state.ObjPackage];
    this.state.ObjCommercial = {
      package_number: 1,
      content_description: "",
      quantity: "",
      value_per_qty: "",
      total_value: 0,
    };

    this.state.commercial_data = [];
    for (var i = 0; i < this.state.globalCommercialcount; i++) {
      this.state.commercialData.push(this.state.ObjCommercial);
    }
  }

  senderZipChange = (zip) => {
    if (zip.length) {
      fetch(CommonConfig.zipCodeAPIKey(zip))
        .then((result) => result.json())
        .then((data) => {
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

              var CityData = data["results"][0]["postcode_localities"];
              _.forEach(CityData, function(value, key) {
                FinalCity.push({
                  City_code: value,
                  Name: value,
                });
              });

              var state = _.filter(
                data["results"][0]["address_components"],
                function(data) {
                  return data.types[0] === "administrative_area_level_1";
                }
              )[0].short_name;

              var SelectedCity = {
                value: FinalCity[0].City_code,
                label: FinalCity[0].Name,
              };

              if (countryShortName === this.state.fromCountryName) {
                this.setState({
                  fromCityAutoComplete: FinalCity.length ? true : false,
                  fromGoogleAPICityList: FinalCity,
                  fromState: state,
                  fromCity: SelectedCity,
                });
              } else {
                this.setState({
                  fromCityAutoComplete: false,
                  fromGoogleAPICityList: [],
                  fromState: "",
                  fromCity: "",
                });
              }
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
              )[0].short_name;

              FinalCity.push({
                City_code: city,
                Name: city,
              });

              var SelectedCity = {
                value: FinalCity[0].City_code,
                label: FinalCity[0].Name,
              };

              if (countryShortName === this.state.fromCountryName) {
                this.setState({
                  fromCityAutoComplete: FinalCity.length ? true : false,
                  fromGoogleAPICityList: FinalCity,
                  fromState: state,
                  fromCity: SelectedCity,
                });
              } else {
                this.setState({
                  fromCityAutoComplete: false,
                  fromGoogleAPICityList: [],
                  fromState: "",
                  fromCity: "",
                });
              }
            }
          } else {
            this.setState({
              fromCityAutoComplete: false,
              fromGoogleAPICityList: [],
              fromState: "",
              fromCity: "",
            });
          }
        });
    }
  };

  recipientZipChange = (zip) => {
    if (zip.length) {
      fetch(CommonConfig.zipCodeAPIKey(zip))
        .then((result) => result.json())
        .then((data) => {
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

              var CityData = data["results"][0]["postcode_localities"];
              _.forEach(CityData, function(value, key) {
                FinalCity.push({
                  City_code: value,
                  Name: value,
                });
              });

              var state = _.filter(
                data["results"][0]["address_components"],
                function(data) {
                  return data.types[0] === "administrative_area_level_1";
                }
              )[0].short_name;

              var SelectedCity = {
                value: FinalCity[0].City_code,
                label: FinalCity[0].Name,
              };

              if (countryShortName === this.state.toCountryName) {
                this.setState({
                  toCityAutoComplete: FinalCity.length ? true : false,
                  toGoogleAPICityList: FinalCity,
                  toState: state,
                  toCity: SelectedCity,
                });
              } else {
                this.setState({
                  toCityAutoComplete: false,
                  toGoogleAPICityList: [],
                  toState: "",
                  toCity: "",
                });
              }
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
              )[0].short_name;

              FinalCity.push({
                City_code: city,
                Name: city,
              });

              var SelectedCity = {
                value: FinalCity[0].City_code,
                label: FinalCity[0].Name,
              };

              if (countryShortName === this.state.toCountryName) {
                this.setState({
                  toCityAutoComplete: FinalCity.length ? true : false,
                  toGoogleAPICityList: FinalCity,
                  toState: state,
                  toCity: SelectedCity,
                });
              } else {
                this.setState({
                  toCityAutoComplete: false,
                  toGoogleAPICityList: [],
                  toState: "",
                  toCity: "",
                });
              }
            }
          } else {
            this.setState({
              toCityAutoComplete: false,
              toGoogleAPICityList: [],
              toState: "",
              toCity: "",
            });
          }
        });
    }
  };

  componentDidMount() {
    let shipmentObj = JSON.parse(localStorage.getItem("shipmentObj"));

    if (
      shipmentObj.FromCountry.CountryName === shipmentObj.ToCountry.CountryName
    ) {
      this.setState({ IsCommercial: false });
    }

    var yesterday = this.state.pickUpDate;

    var valid = function(current) {
      return (
        current.day() !== 0 && current.day() !== 6 && current.isAfter(yesterday)
      );
    };

    this.setState({
      fromCountryID: shipmentObj.FromCountry.CountryID,
      fromCountryName: shipmentObj.FromCountry.CountryName,
      fromCountryCode: shipmentObj.FromCountry.CountryCode,
      toCountryID: shipmentObj.ToCountry.CountryID,
      toCountryName: shipmentObj.ToCountry.CountryName,
      toCountryCode: shipmentObj.ToCountry.CountryCode,
      shipmentType: shipmentObj.ShipType,
      valid: valid,
    });
  }

  showLoader = () => {
    this.setState({ Loading: true });
  };

  hideLoader = () => {
    this.setState({ Loading: false });
  };

  handleChange = (event, type) => {
    if (type === "fromcompanyname") {
      this.setState({ fromCompanyName: event.target.value });
    } else if (type === "fromcontactname") {
      this.setState({ fromContactName: event.target.value });
    } else if (type === "fromaddressline1") {
      if (event.target.value.length > 54) {
        this.setState({
          fromAddressLine1: this.state.fromAddressLine1,
          fromAddressLine1Err: true,
          fromAddressLine1HelperText:
            "Addressline 1 should be max 54 characters",
        });
      } else {
        this.setState({
          fromAddressLine1: event.target.value,
          fromAddressLine1Err: false,
          fromAddressLine1HelperText: "",
        });
      }
    } else if (type === "fromaddressline2") {
      this.setState({ fromAddressLine2: event.target.value });
    } else if (type === "fromaddressline3") {
      this.setState({ fromAddressLine3: event.target.value });
    } else if (type === "fromzipcode") {
      this.setState({ fromZipCode: event.target.value });
    } else if (type === "fromcity") {
      this.setState({ fromCity: event.target.value });
    } else if (type === "fromstate") {
      this.setState({ fromState: event.target.value });
    } else if (type === "fromemail") {
      this.setState({ fromEmail: event.target.value });
    } else if (type === "fromphone1") {
      this.setState({ fromPhone1: event.target.value });
    } else if (type === "fromphone2") {
      this.setState({ fromPhone2: event.target.value });
    } else if (type === "tocompanyname") {
      this.setState({ toCompanyName: event.target.value });
    } else if (type === "tocontactname") {
      this.setState({ toContactName: event.target.value });
    } else if (type === "toaddressline1") {
      this.setState({ toAddressLine1: event.target.value });
    } else if (type === "toaddressline2") {
      this.setState({ toAddressLine2: event.target.value });
    } else if (type === "toaddressline3") {
      this.setState({ toAddressLine3: event.target.value });
    } else if (type === "tozipcode") {
      this.setState({ toZipCode: event.target.value });
    } else if (type === "tocity") {
      this.setState({ toCity: event.target.value });
    } else if (type === "tostate") {
      this.setState({ toState: event.target.value });
    } else if (type === "toemail") {
      this.setState({ toEmail: event.target.value });
    } else if (type === "tophone1") {
      this.setState({ toPhone1: event.target.value });
    } else if (type === "tophone2") {
      this.setState({ toPhone2: event.target.value });
    }
  };

  handleBlur = (event, type) => {
    if (type === "fromcompanyname") {
      if (!CommonConfig.isEmpty(event.target.value)) {
        if (event.target.value.length > 54) {
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
      }
    } else if (type === "fromcontactname") {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          fromContactName: event.target.value,
          fromContactNameErr: true,
          fromContactNameHelperText: "Please enter Contact name",
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
          fromAddressLine1HelperText: "Please enter Address",
        });
      } else if (event.target.value.length > 54) {
        this.setState({
          fromAddressLine1: event.target.value,
          fromAddressLine1Err: true,
          fromAddressLine1HelperText:
            "Addressline 1 should be max 54 characters",
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
        if (event.taget.value.length > 54) {
          this.setState({
            fromAddressLine2: event.target.value,
            fromAddressLine2Err: true,
            fromAddressLine2HelperText:
              "Addressline 2 should be max 54 characters",
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
        if (event.taget.value.length > 54) {
          this.setState({
            fromAddressLine3: event.target.value,
            fromAddressLine3Err: true,
            fromAddressLine3HelperText:
              "Addressline 3 should be max 54 characters",
          });
        } else {
          this.setState({
            fromAddressLine3: event.target.value,
            fromAddressL3ne1Err: false,
            fromAddressLine3HelperText: "",
          });
        }
      }
    } else if (type === "fromzipcode") {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          fromZipCode: event.target.value,
          fromZipCodeErr: true,
          fromZipCodeHelperText: "Please enter Zip Code ",
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
        this.senderZipChange(event.target.value);
        this.setState({
          fromZipCode: event.target.value,
          fromZipCodeErr: false,
          fromZipCodeHelperText: "",
        });
      }
    } else if (type === "fromcity") {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          fromCity: event.target.value,
          fromCityErr: true,
          fromCityHelperText: "Please enter City",
        });
      } else if (CommonConfig.RegExp.companyName.test(event.target.value)) {
        this.setState({
          fromCity: event.target.value,
          fromCityErr: true,
          fromCityHelperText: "City is not valid",
        });
      } else if (event.target.value.length > 54) {
        this.setState({
          fromCity: event.target.value,
          fromCityErr: true,
          fromCityHelperText: "City shoule be max 54 characters",
        });
      } else {
        this.setState({
          fromCity: event.target.value,
          fromCityErr: false,
          fromCityHelperText: "",
        });
      }
    } else if (type === "fromstate") {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          fromState: event.target.value,
          fromStateErr: true,
          fromStateHelperText: "Please enter State",
        });
      } else if (CommonConfig.RegExp.companyName.test(event.target.value)) {
        this.setState({
          fromState: event.target.value,
          fromStateErr: true,
          fromStateHelperText: "State is not valid",
        });
      } else if (event.target.value.length > 54) {
        this.setState({
          fromState: event.target.value,
          fromStateErr: true,
          fromStateHelperText: "State shoule be max 54 characters",
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
          fromPhone1HelperText: "Please enter Phone No.",
        });
      } else if (!event.target.value.match(CommonConfig.RegExp.phoneNumber)) {
        this.setState({
          fromPhone1: event.target.value,
          fromPhone1Err: true,
          fromPhone1HelperText: "Please enter valid Phone No.",
        });
      } else if (
        event.target.value.length < 5 ||
        event.target.value.length > 12
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
          event.target.value.length > 12
        ) {
          this.setState({
            fromPhone1: event.target.value,
            fromPhone1Err: true,
            fromPhone1HelperText: "Please enter valid Phone No.",
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
          fromEmailHelperText: "Please enter Email ",
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
    } else if (type === "tocompanyname") {
      if (!CommonConfig.isEmpty(event.target.value)) {
        if (event.target.value.length > 54) {
          this.setState({
            toCompanyName: event.target.value,
            toCompanyNameErr: true,
            toompanyNameHelperText: "Company name is not valid.",
          });
        } else if (CommonConfig.RegExp.companyName.test(event.target.value)) {
          this.setState({
            toCompanyName: event.target.value,
            toCompanyNameErr: true,
            toCompanyNameHelperText: "Company name is not valid.",
          });
        } else {
          this.setState({
            toCompanyName: event.target.value,
            toCompanyNameErr: false,
            toCompanyNameHelperText: "",
          });
        }
      }
    } else if (type === "tocontactname") {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          toContactName: event.target.value,
          toContactNameErr: true,
          toContactNameHelperText: "Please enter Contact name",
        });
      } else {
        this.setState({
          toContactName: event.target.value,
          toContactNameErr: false,
          toContactNameHelperText: "",
        });
      }
    } else if (type === "toaddressline1") {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          toAddressLine1: event.target.value,
          toAddressLine1Err: true,
          toAddressLine1HelperText: "Please enter Address ",
        });
      } else if (event.target.value.length > 54) {
        this.setState({
          toAddressLine1: event.target.value,
          toAddressLine1Err: true,
          toAddressLine1HelperText: "Addressline 1 should be max 54 characters",
        });
      } else {
        this.setState({
          toAddressLine1: event.target.value,
          toAddressLine1Err: false,
          toAddressLine1HelperText: "",
        });
      }
    } else if (type === "toaddressline2") {
      if (!CommonConfig.isEmpty(event.target.value)) {
        if (event.target.value.length > 54) {
          this.setState({
            toAddressLine2: event.target.value,
            toAddressLine2Err: true,
            toAddressLine2HelperText:
              "Addressline 2 should be max 54 characters ",
          });
        } else {
          this.setState({
            toAddressLine2: event.target.value,
            toAddressLine2Err: false,
            toAddressLine2HelperText: "",
          });
        }
      }
    } else if (type === "toaddressline3") {
      if (!CommonConfig.isEmpty(event.target.value)) {
        if (event.target.value.length > 54) {
          this.setState({
            toAddressLine3: event.target.value,
            toAddressLine3Err: true,
            toAddressLine3HelperText:
              "Addressline 3 should be max 54 characters ",
          });
        } else {
          this.setState({
            toAddressLine3: event.target.value,
            toAddressLine3Err: false,
            toAddressLine3HelperText: "",
          });
        }
      }
    } else if (type === "tozipcode") {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          toZipCode: event.target.value,
          toZipCodeErr: true,
          toZipCodeHelperText: "Please enter Zip Code",
        });
      } else if (
        event.target.value.trim() !== event.target.value ||
        !event.target.value.match(CommonConfig.RegExp.zipCode)
      ) {
        this.setState({
          toZipCode: event.target.value,
          toZipCodeErr: true,
          toZipCodeHelperText: "Zipcode is not valid ",
        });
      } else if (event.target.value.length > 12) {
        this.setState({
          toZipCode: event.target.value,
          toZipCodeErr: true,
          toZipCodeHelperText: "Zipcode length should be max 12 character",
        });
      } else {
        this.recipientZipChange(event.target.value);
        this.setState({
          toZipCode: event.target.value,
          toZipCodeErr: false,
          toZipCodeHelperText: "",
        });
      }
    } else if (type === "tocity") {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          toCity: event.target.value,
          toCityErr: true,
          toCityHelperText: "Please enter City ",
        });
      } else if (CommonConfig.RegExp.companyName.test(event.target.value)) {
        this.setState({
          toCity: event.target.value,
          toCityErr: true,
          toCityHelperText: "City is not valid",
        });
      } else if (event.target.value.length > 54) {
        this.setState({
          toCity: event.target.value,
          toCityErr: true,
          toCityHelperText: "City shoule be max 54 characters",
        });
      } else {
        this.setState({
          toCity: event.target.value,
          toCityErr: false,
          toCityHelperText: "",
        });
      }
    } else if (type === "tostate") {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          toState: event.target.value,
          toStateErr: true,
          toStateHelperText: "Please enter State",
        });
      } else if (CommonConfig.RegExp.companyName.test(event.target.value)) {
        this.setState({
          toState: event.target.value,
          toStateErr: true,
          toStateHelperText: "State is not valid",
        });
      } else if (event.target.value.length > 54) {
        this.setState({
          toState: event.target.value,
          toStateErr: true,
          toStateHelperText: "State shoule be max 54 characters",
        });
      } else {
        this.setState({
          toState: event.target.value,
          toStateErr: false,
          toStateHelperText: "",
        });
      }
    } else if (type === "tophone1") {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          toPhone1: event.target.value,
          toPhone1Err: true,
          toPhone1HelperText: "Please enter Phone No.",
        });
      } else if (!event.target.value.match(CommonConfig.RegExp.phoneNumber)) {
        this.setState({
          toPhone1: event.target.value,
          toPhone1Err: true,
          toPhone1HelperText: "please enter valid Phone No.",
        });
      } else if (
        event.target.value.length < 5 ||
        event.target.value.length > 12
      ) {
        this.setState({
          toPhone1: event.target.value,
          toPhone1Err: true,
          toPhone1HelperText: "Please enter valid Phone No.",
        });
      } else {
        this.setState({
          toPhone1: event.target.value,
          toPhone1Err: false,
          toPhone1HelperText: "",
        });
      }
    } else if (type === "tophone2") {
      if (!CommonConfig.isEmpty(event.target.value)) {
        if (!event.target.value.match(CommonConfig.RegExp.phoneNumber)) {
          this.setState({
            toPhone2: event.target.value,
            toPhone2Err: true,
            toPhone2HelperText: "please enter valid Phone No.",
          });
        } else if (
          event.target.value.length < 5 ||
          event.target.value.length > 12
        ) {
          this.setState({
            toPhone2: event.target.value,
            toPhone2Err: true,
            toPhone2HelperText: "Please enter valid Phone No.",
          });
        } else {
          this.setState({
            toPhone2: event.target.value,
            toPhone2Err: false,
            toPhone2HelperText: "",
          });
        }
      }
    } else if (type === "toemail") {
      if (!CommonConfig.isEmpty(event.target.value)) {
        if (!event.target.value.match(CommonConfig.RegExp.email)) {
          this.setState({
            toEmail: event.target.value,
            toEmailErr: true,
            toEmailHelperText: "Please enter valid Email",
          });
        } else {
          this.setState({
            toEmail: event.target.value,
            toEmailErr: false,
            toEmailHelperText: "",
          });
        }
      }
    } else if (type === "cardnumber") {
      let cardNo = event.target.value;

      if (CommonConfig.isEmpty(cardNo)) {
        this.setState({
          cardNumber: cardNo,
          cardNumberErr: true,
          cardNumberHelperText: "Please enter Card Number",
        });
      } else if (!CommonConfig.RegExp.number.test(cardNo)) {
        this.setState({
          cardNumber: cardNo,
          cardNumberErr: true,
          cardNumberHelperText: "card number is not valid",
        });
      } else if (cardNo.length > 16) {
        this.setState({
          cardNumber: cardNo,
          cardNumberErr: true,
          cardNumberHelperText: "card number should be max 16 digit",
        });
      } else {
        let firstNumber = cardNo.charAt(0);
        let cardType =
          firstNumber === "4"
            ? "VISA"
            : firstNumber === "5"
            ? "Master Card"
            : firstNumber === "6"
            ? "Discover"
            : "";
        this.setState({
          cardNumber: cardNo,
          cardType: cardType,
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

  validate(event) {
    let IsFormValid = true;

    if (CommonConfig.isEmpty(this.state.fromContactName)) {
      IsFormValid = false;
      this.setState({
        fromContactNameErr: true,
        fromContactNameHelperText: "Please enter sender Contact name",
      });
    }
    if (CommonConfig.isEmpty(this.state.fromAddressLine1)) {
      IsFormValid = false;
      this.setState({
        fromAddressLine1Err: true,
        fromAddressLine1HelperText: "Please enter sender addressLine 1",
      });
    }
    if (CommonConfig.isEmpty(this.state.fromZipCode)) {
      IsFormValid = false;
      this.setState({
        fromZipCodeErr: true,
        fromZipCodeHelperText: "Please enter sender zipcode",
      });
    }
    if (this.state.fromCityAutoComplete === false) {
      if (CommonConfig.isEmpty(this.state.fromCity)) {
        IsFormValid = false;
        this.setState({
          fromCityErr: true,
          fromCityHelperText: "Please enter sender city",
        });
      }
    }
    if (CommonConfig.isEmpty(this.state.fromState)) {
      IsFormValid = false;
      this.setState({
        fromStateErr: true,
        fromStateHelperText: "Please enter sender state",
      });
    }
    if (CommonConfig.isEmpty(this.state.fromPhone1)) {
      IsFormValid = false;
      this.setState({
        fromPhone1Err: true,
        fromPhone1HelperText: "Please enter sender state",
      });
    }
    if (CommonConfig.isEmpty(this.state.fromEmail)) {
      IsFormValid = false;
      this.setState({
        fromEmailErr: true,
        fromEmailHelperText: "Please enter sender state",
      });
    }
    if (CommonConfig.isEmpty(this.state.toContactName)) {
      IsFormValid = false;
      this.setState({
        toContactNameErr: true,
        toContactNameHelperText: "Please enter recepient Contact name",
      });
    }
    if (CommonConfig.isEmpty(this.state.toAddressLine1)) {
      IsFormValid = false;
      this.setState({
        toAddressLine1Err: true,
        toAddressLine1HelperText: "Please enter recepient addressLine 1",
      });
    }
    if (CommonConfig.isEmpty(this.state.toZipCode)) {
      IsFormValid = false;
      this.setState({
        toZipCodeErr: true,
        toZipCodeHelperText: "Please enter recepient zipcode",
      });
    }
    if (this.state.toCityAutoComplete === false) {
      if (CommonConfig.isEmpty(this.state.toCity)) {
        IsFormValid = false;
        this.setState({
          toCityErr: true,
          toCityHelperText: "Please enter recepient city",
        });
      }
    }
    if (CommonConfig.isEmpty(this.state.toState)) {
      IsFormValid = false;
      this.setState({
        toStateErr: true,
        toStateHelperText: "Please enter recepient state",
      });
    }
    if (CommonConfig.isEmpty(this.state.toPhone1)) {
      IsFormValid = false;
      this.setState({
        toPhone1Err: true,
        toPhone1HelperText: "Please enter recepient state",
      });
    }
    if (this.state.selectedPaymentType === "Pay Online") {
      if (CommonConfig.isEmpty(this.state.cardNumber)) {
        IsFormValid = false;
        this.setState({
          cardNumberErr: true,
          cardNumberHelperText: "Please enter card number",
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
      if (CommonConfig.isEmpty(this.state.ABAroutingNumber)) {
        IsFormValid = false;
        this.setState({
          ABAroutingNumberErr: true,
          ABAroutingNumberHelperText: "Please enter routing no",
        });
      }
    }
    return IsFormValid;
  }

  fromCityChange = (event, value) => {
    this.setState({ fromCity: value });
  };

  toCityChange = (event, value) => {
    this.setState({ toCity: value });
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
    this.setState({ month_value: event.target.value });
  };

  changeyear = (event) => {
    this.setState({ year_value: event.target.value });
  };

  handleTerms = (event) => {
    this.setState({ checkedTerm: event.target.checked });
  };

  handleClose = () => {
    this.setState({ IsTermShow: false });
  };

  locationType = (event) => {
    this.setState({ SelectedLocationType: event.target.value });
  };

  packageType = (event) => {
    var GetRate = this.state.GetRate;

    this.setState({ selectedPackageType: event.target.value });

    if (event.target.value == "Envelop") {
      this.setState({
        IsPackage: false,
        PackageDetails: [this.state.ObjDocument],
      });

      GetRate.TotalWeight = 0.5;
      GetRate.TotalChargableWeight = 0.5;
      GetRate.TotalInsuredValue = 0.0;
      GetRate.PackageNumber = 1;
      this.setState({ GetRate: GetRate });
    } else if (event.target.value == "Package") {
      this.setState({
        IsPackage: true,
        PackageDetails: [this.state.ObjPackage],
      });

      GetRate.TotalWeight = "";
      GetRate.TotalInsuredValue = "";
      GetRate.TotalChargableWeight = "";
      this.setState({ GetRate: GetRate });
    }
  };

  isPickUpNeed = (event) => {
    if (event.target.value === 0) {
      this.setState({
        selectedPickupType: event.target.value,
        IsPickUp: false,
      });
    } else if (event.target.value === 1) {
      this.setState({ selectedPickupType: event.target.value, IsPickUp: true });
    }
  };

  handleDateChange = (date) => {
    this.setState({ pickUpDate: date });
  };

  AddNewRowData = function() {
    if (this.state.PackageDetails.length >= this.state.MaxPackageCount) {
      alert("Sorry you can not add more packages.");
    } else {
      var PackageDetails = this.state.PackageDetails;
      PackageDetails.push(this.state.ObjPackage);

      let arr = [];
      for (let i = 0; i < PackageDetails.length; i++) {
        let val = i + 1;
        arr.push({ name: String(val), id: val });
      }
      this.setState({
        values: arr,
        PackageDetails: PackageDetails,
        selectedPackageNumbers: {
          label: PackageDetails.length,
          value: PackageDetails.length,
        },
      });
      this.Calculate();
    }
  };

  DeleteRowData = (DeleteIndex) => (evt) => {
    var PackageDetails = this.state.PackageDetails;
    PackageDetails.splice(DeleteIndex, 1);

    let arr = [];
    for (let i = 0; i < this.state.PackageDetails.length; i++) {
      let val = i + 1;
      arr.push({ name: String(val), id: val });
    }
    this.setState(
      {
        values: arr,
        PackageDetails: PackageDetails,
        selectedPackageNumbers: { value: PackageDetails.length },
      },
      function() {
        this.Calculate();
      }
    );
  };

  InputValidate = (name, PIndex) => (evt) => {
    let x = document.getElementsByName("PackageWeight");

    const NewPackageDetails = this.state.PackageDetails.map(
      (Package, index) => {
        if (PIndex === index) {
          if (name === "PackageNumber") {
            return { ...Package, PackageNumber: evt.target.value };
          } else if (name === "PackageWeight") {
            if (
              (evt.target.value === "" ||
                CommonConfig.RegExp.number.test(evt.target.value)) &&
              Number(evt.target.value) <= 999
            ) {
              return { ...Package, PackageWeight: evt.target.value };
            } else {
              return { ...Package, PackageWeight: Package.PackageWeight };
            }
          } else if (name === "PackageWidth") {
            if (
              (evt.target.value === "" ||
                CommonConfig.RegExp.number.test(evt.target.value)) &&
              Number(evt.target.value) <= 99
            ) {
              return { ...Package, PackageWidth: evt.target.value };
            } else {
              return { ...Package, PackageWidth: Package.PackageWidth };
            }
          } else if (name === "PackageLength") {
            if (
              (evt.target.value === "" ||
                CommonConfig.RegExp.number.test(evt.target.value)) &&
              Number(evt.target.value) <= 99
            ) {
              return { ...Package, PackageLength: evt.target.value };
            } else {
              return { ...Package, PackageLength: Package.PackageLength };
            }
          } else if (name === "PackageHeight") {
            if (
              (evt.target.value === "" ||
                CommonConfig.RegExp.number.test(evt.target.value)) &&
              Number(evt.target.value) <= 99
            ) {
              return { ...Package, PackageHeight: evt.target.value };
            } else {
              return { ...Package, PackageHeight: Package.PackageHeight };
            }
          } else if (name === "PackageChargableWeight") {
            return { ...Package, PackageChargableWeight: evt.target.value };
          } else if (name === "PackageInsuredValue") {
            if (CommonConfig.isEmpty(evt.target.value)) {
              return { ...Package, PackageInsuredValue: "" };
            } else if (CommonConfig.RegExp.onlyNumber.test(evt.target.value)) {
              return {
                ...Package,
                PackageInsuredValue: this.state.PackageDetails[index]
                  .PackageInsuredValue,
              };
            } else if (evt.target.value <= 9999) {
              return { ...Package, PackageInsuredValue: evt.target.value };
            } else {
              return {
                ...Package,
                PackageInsuredValue: this.state.PackageDetails[index]
                  .PackageInsuredValue,
              };
            }
          }
        } else {
          return { ...Package };
        }
      }
    );

    this.setState({ PackageDetails: NewPackageDetails }, function() {
      this.Calculate();
    });
  };

  Calculate() {
    if (this.state.fromCountryCode && this.state.toCountryCode) {
      var TotalChargeWeight = 0;
      var TotalInsuredValue = 0;
      var TotalWeight = 0;
      var TotalChargable = 0;

      var PackageDetails = [...this.state.PackageDetails];
      for (var i = 0; i < PackageDetails.length; i++) {
        var WE = 0;
        var LE = 0;
        var HE = 0;
        var Insure = 0;
        var Total = 0;
        var Weight = 0;
        var Chargable = 0;

        if (PackageDetails[i].PackageWeight) {
          Weight =
            PackageDetails[i].PackageWeight * PackageDetails[i].PackageNumber;
        }

        if (PackageDetails[i].PackageWidth) {
          WE = PackageDetails[i].PackageWidth;
        }

        if (PackageDetails[i].PackageLength) {
          LE = PackageDetails[i].PackageLength;
        }

        if (PackageDetails[i].PackageHeight) {
          HE = PackageDetails[i].PackageHeight;
        }

        if (
          this.state.fromCountryCode == "US" &&
          this.state.toCountryCode == "US"
        ) {
          Total =
            Math.ceil(parseFloat((WE * LE * HE) / 166)) *
            PackageDetails[i].PackageNumber;
        } else {
          Total =
            Math.ceil(parseFloat((WE * LE * HE) / 139)) *
            PackageDetails[i].PackageNumber;
        }

        if (
          this.state.fromCountryCode == "IN" &&
          this.state.toCountryCode == "US"
        ) {
          Total =
            Math.ceil(parseFloat(parseFloat(Total) / parseFloat(2.2))) *
            PackageDetails[i].PackageNumber;
        }

        if (Weight > Total) {
          PackageDetails[i].PackageChargableWeight = Weight;
          TotalChargeWeight = parseInt(TotalChargeWeight) + parseInt(Weight);
        } else {
          PackageDetails[i].PackageChargableWeight = Total;
          TotalChargeWeight = parseInt(TotalChargeWeight) + parseInt(Total);
        }

        if (PackageDetails[i].PackageInsuredValue) {
          Insure =
            PackageDetails[i].PackageInsuredValue *
            PackageDetails[i].PackageNumber;
        } else {
          PackageDetails[i].PackageInsuredValue = 0;
          Insure =
            PackageDetails[i].PackageInsuredValue *
            PackageDetails[i].PackageNumber;
        }

        if (PackageDetails[i].PackageChargableWeight) {
          Chargable = PackageDetails[i].PackageChargableWeight;
        }

        TotalInsuredValue = TotalInsuredValue + Insure;
        TotalWeight = TotalWeight + Weight;
        TotalChargable = TotalChargable + Chargable;
      }
      this.setState({ PackageDetails: PackageDetails });

      var GetRate = this.state.GetRate;
      if (TotalWeight > 0) {
        GetRate.TotalWeight = TotalWeight;
      } else {
        GetRate.TotalWeight = 1;
      }

      if (TotalInsuredValue > 0) {
        GetRate.TotalInsuredValue = TotalInsuredValue;
      } else {
        GetRate.TotalInsuredValue = 0;
      }

      if (TotalChargable > 0) {
        GetRate.TotalChargableWeight = TotalChargable;
      } else {
        GetRate.TotalChargableWeight = 0;
      }
      this.setState({ GetRate: GetRate });
    }
  }

  PackageCount = (event) => {
    this.setState({
      selectedPackageNumbers: {
        label: event.target.value,
        value: event.target.value,
      },
    });
    var totalpackage = Number(event.target.value);

    if (totalpackage > this.state.PackageDetails.length) {
      for (let i = this.state.PackageDetails.length; i < totalpackage; i++) {
        this.AddNewRowData();
      }
    } else if (totalpackage == this.state.PackageDetails.length) {
    } else if (totalpackage < this.state.PackageDetails.length) {
      var PackageDetails = this.state.PackageDetails;
      var toremove = totalpackage - this.state.PackageDetails.length;
      PackageDetails.splice(toremove, this.state.PackageDetails.length);
      this.state.values.splice(toremove, this.state.values.length);

      this.setState({ PackageDetails: PackageDetails });
    }
  };

  renderTableHeader() {
    let header = Object.keys(this.state.commercialData[0]);
    // let header = Object.values(this.state.commercialData[0])
    return header.map((key, index) => {
      return <th key={index}>{this.state.commercialDataHeader[key]}</th>;
    });
  }

  appendNoOfCommercials() {
    return this.state.values.map((v, i) => {
      return (
        <MenuItem classes={{ root: classes.selectMenuItem }} value={v.id}>
          {v.name}
        </MenuItem>
      );
    });
  }

  renderTableData() {
    return this.state.commercialData.map((commercialData, index) => {
      return (
        <tr key={index}>
          <td>
            <Select
              id="package_number"
              name="package_number"
              className="form-control"
              onChange={this.OnCommercialValueChange("package_number", index)} //value={index + 1}
              value={Number(this.state.commercialData[index].package_number)}
            >
              {this.appendNoOfCommercials()}
            </Select>
            {/* <Input type="text" name="package_number" id="package_number" disabled onChange={this.OnCommercialValueChange('package_number', index)}  value={commercialData.package_number} /> */}
          </td>
          <td>
            <input
              type="text"
              className="more-width"
              name="descriptionofcontent"
              id="descriptionofcontent"
              onChange={this.OnCommercialValueChange(
                "content_description",
                index
              )}
              value={commercialData.content_description}
            />
          </td>
          <td>
            <input
              type="text"
              name="quantity"
              id="quantity"
              value={commercialData.quantity}
              onChange={this.OnCommercialValueChange("quantity", index)}
              className="text-right"
            />
          </td>
          <td>
            <input
              type="text"
              name="valueperqty"
              id="value_per_qty"
              value={commercialData.value_per_qty}
              onChange={this.OnCommercialValueChange("value_per_qty", index)}
              className="text-right"
              onBlur={this.formatCommercialValue("value_per_qty", index)}
            />
          </td>
          <td>
            <input
              type="text"
              name="totalvalue"
              id="total_value"
              disabled
              className="text-right"
              value={commercialData.total_value}
              onChange={this.OnCommercialValueChange("total_value", index)}
            />
          </td>
          {this.state.commercialData.length > 1 ? (
            <td>
              {index > 0 ? (
                <DeleteIcon
                  value={" Delete"}
                  onClick={this.DeleteRowData_commercial(index)}
                />
              ) : null}
            </td>
          ) : null}
        </tr>
      );
    });
  }

  OnCommercialValueChange = (name, Cindex) => (event) => {
    var newCommercialDetail = this.state.commercialData.map((data, index) => {
      if (Cindex === index) {
        let re = /^[0-9\b]+$/;
        let nameRegExp = /^[a-zA-Z]+[a-zA-Z-\s']*$/;

        if (name === "package_number") {
          return { ...data, package_number: event.target.value };
        } else if (name === "content_description") {
          if (
            event.target.value === "" ||
            nameRegExp.test(event.target.value)
          ) {
            return { ...data, content_description: event.target.value };
          } else {
            return { ...data, content_description: data.content_description };
          }
        } else if (name === "quantity") {
          if (
            (event.target.value === "" || re.test(event.target.value)) &&
            Number(event.target.value) <= 99
          ) {
            return { ...data, quantity: event.target.value };
          } else {
            return { ...data, quantity: data.quantity };
          }
        } else if (name === "value_per_qty") {
          let regexp = /[a-zA-Z~`!@#$%^&*()_+=-{}|:"<>?,;']+$/;

          if (
            event.target.value === "" ||
            event.target.value === null ||
            event.target.value === undefined
          ) {
            return { ...data, value_per_qty: "" };
          } else if (regexp.test(event.target.value)) {
            return {
              ...data,
              value_per_qty: this.state.commercialData[index].value_per_qty,
            };
          } else if (event.target.value <= 9999) {
            return { ...data, value_per_qty: event.target.value };
          } else {
            return {
              ...data,
              value_per_qty: this.state.commercialData[index].value_per_qty,
            };
          }
        } else if (name === "total_value") {
          return { ...data, total_value: event.target.value };
        }
      } else {
        return { ...data };
      }
    });

    this.setState({ commercialData: newCommercialDetail }, function() {
      this.CalculateComercial();
    });
  };

  formatCommercialValue = (name, Cindex) => (event) => {
    var newCommercialDetail = this.state.commercialData.map((data, index) => {
      if (Cindex === index) {
        if (name === "value_per_qty") {
          let regexp = /^[0-9]+(\.[0-9][0-9])?$/;
          let val = parseFloat(event.target.value).toFixed(2);

          if (regexp.test(val)) {
            return { ...data, value_per_qty: val };
          } else {
            return { ...data };
          }
        }
      } else {
        return { ...data };
      }
    });

    this.setState({ commercialData: newCommercialDetail }, function() {
      this.CalculateComercial();
    });
  };

  AddNewRowData_commercial = () => {
    if (this.state.commercialData.length >= this.state.MaxPackageCount) {
      cogoToast.error("Sorry you can not add more packages");
    } else {
      var PackageDetails_commercial = this.state.commercialData;
      PackageDetails_commercial.push(this.state.ObjCommercial);
      this.setState({ commercialData: PackageDetails_commercial });
    }
  };

  DeleteRowData_commercial = (DeleteIndex) => (evt) => {
    var commercialData = this.state.commercialData;
    commercialData.splice(DeleteIndex, 1);
    this.setState({ commercialData: commercialData }, function() {
      this.CalculateComercial();
    });
  };

  CalculateComercial() {
    var ComercialDetails = [...this.state.commercialData];
    let totalCommercial = 0;

    for (var i = 0; i < ComercialDetails.length; i++) {
      var Quantity = 0;
      var ValuePerQty = 0;
      let total_value = 0;

      if (ComercialDetails[i].quantity != "") {
        Quantity = ComercialDetails[i].quantity;
      }

      if (ComercialDetails[i].value_per_qty != "") {
        ValuePerQty = ComercialDetails[i].value_per_qty;
      }

      if (Quantity && ValuePerQty) {
        total_value = Quantity * ValuePerQty;
        ComercialDetails[i].total_value = parseFloat(total_value).toFixed(2);
        //  ComercialDetails[i].total_value = Quantity * ValuePerQty;
      } else {
        ComercialDetails[i].total_value = parseFloat(0).toFixed(2);
      }

      totalCommercial = totalCommercial + total_value;
    }

    this.setState({
      commercialData: ComercialDetails,
      totalCommercial: parseFloat(totalCommercial).toFixed(2),
    });
  }

  ShipmentTypeChange = (event) => {
    this.setState({ ShipmentType: event.target.value });
  };

  sendState() {
    return this.state;
  }

  appendNoOfPackages() {
    return this.state.No_packageType.map((no) => {
      return (
        <MenuItem classes={{ root: classes.selectMenuItem }} value={no.value}>
          {" "}
          {no.value}{" "}
        </MenuItem>
      );
    });
  }

  appendLocationType() {
    return this.state.location_type.map((location) => {
      return (
        <MenuItem
          classes={{ root: classes.selectMenuItem }}
          value={location.value}
        >
          {" "}
          {location.label}{" "}
        </MenuItem>
      );
    });
  }

  appendPickType() {
    return this.state.pickup_type.map((pickup) => {
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
  }

  postScheduleShipment = (event) => {
    document.getElementById("mainContent").scrollIntoView();

    if (this.validate(event)) {
      let packages_data = [];
      let com_data = [];

      if (
        this.state.shipmentType === "Air" ||
        this.state.shipmentType === "Ground"
      ) {
        if (this.state.selectedPackageType === "Package") {
          for (var i = 0; i < this.state.PackageDetails.length; i++) {
            let package_details = {};
            package_details = {
              shipments_tracking_number: "",
              package_number: this.state.PackageDetails[i].PackageNumber,
              weight: this.state.PackageDetails[i].PackageWeight,
              unit_of_weight: "LBS",
              length: this.state.PackageDetails[i].PackageLength,
              width: this.state.PackageDetails[i].PackageWidth,
              height: this.state.PackageDetails[i].PackageHeight,
              chargable_weight: this.state.PackageDetails[i]
                .PackageChargableWeight,
              insured_value: this.state.PackageDetails[i].PackageInsuredValue,
              is_active: 1,
              is_deleted: 0,
            };
            packages_data.push(package_details);
          }
        } else if (this.state.selectedPackageType === "Envelop") {
          let package_details = {};
          package_details = {
            shipments_tracking_number: "",
            package_number: this.state.PackageDetails[0].PackageNumber,
            weight: this.state.PackageDetails[0].PackageWeight,
            unit_of_weight: "LBS",
            length: this.state.PackageDetails[0].PackageLength,
            width: this.state.PackageDetails[0].PackageWidth,
            height: this.state.PackageDetails[0].PackageHeight,
            chargable_weight: this.state.PackageDetails[0]
              .PackageChargableWeight,
            insured_value: this.state.PackageDetails[0].PackageInsuredValue,
            is_active: 1,
            is_deleted: 0,
          };
          packages_data.push(package_details);
        }
      }
      var packages = packages_data;

      if (this.state.shipmentType !== "Ocean") {
        for (var i = 0; i < this.state.commercialData.length; i++) {
          let commercail_details = {};
          commercail_details = {
            shipments_tracking_number: "",
            package_number: this.state.commercialData[i].package_number,
            content_description: this.state.commercialData[i]
              .content_description,
            quantity: this.state.commercialData[i].quantity,
            value_per_qty: this.state.commercialData[i].value_per_qty,
            total_value: this.state.commercialData[i].total_value,
            is_active: 1,
            is_deleted: 0,
          };
          com_data.push(commercail_details);
        }
      }
      var commercial = com_data;

      var shipments = {
        tracking_number: "",
        shipment_type: this.state.shipmentType,
        location_type: this.state.SelectedLocationType,
        is_pickup: this.state.IsPickUp,
        pickup_date: this.state.pickUpDate,
        package_type: this.state.selectedPackageType,
        total_packages: "",
        is_pay_online: this.state.payOnline,
        is_pay_bank: this.state.payBank,
        promo_code: "",
        is_agree: "",
        total_weight: this.state.GetRate.TotalWeight,
        total_chargable_weight: this.state.GetRate.TotalChargableWeight,
        total_insured_value: this.state.GetRate.TotalInsuredValue,
        duties_paid_by: "self",
        total_declared_value: 0,
        dutyType: this.state.dutyType,
        userName: CommonConfig.loggedInUserData().LoginID,
      };

      var from_address = {
        country_id: this.state.fromCountryID,
        country_name: this.state.fromCountryName,
        company_name: this.state.fromCompanyName,
        contact_name: this.state.fromContactName,
        address_1: this.state.fromAddressLine1,
        address_2: this.state.fromAddressLine2,
        address_3: this.state.fromAddressLine3,
        city_id: 1,
        city_name: Object.values(this.state.fromCity).length
          ? this.state.fromCity.label
          : this.state.fromCity,
        state_id: 1,
        state_name: this.state.fromState,
        zip_code: this.state.fromZipCode,
        phone1: this.state.fromPhone1,
        phone2: this.state.fromPhone2,
        email: this.state.fromEmail,
        is_active: 1,
        is_deleted: 0,
      };

      var to_address = {
        country_id: this.state.toCountryID,
        country_name: this.state.toCountryName,
        company_name: this.state.toCompanyName,
        contact_name: this.state.toContactName,
        address_1: this.state.toAddressLine1,
        address_2: this.state.toAddressLine2,
        address_3: this.state.toAddressLine3,
        city_id: 2,
        city_name: Object.values(this.state.toCity).length
          ? this.state.toCity.label
          : this.state.toCity,
        state_id: 1,
        state_name: this.state.toState,
        zip_code: this.state.toZipCode,
        phone1: this.state.toPhone1,
        phone2: this.state.toPhone2,
        email: this.state.toEmail,
        is_active: 1,
        is_deleted: 0,
      };

      var payment_online = {
        name_on_card: this.state.cardName,
        card_number: this.state.cardNumber,
        card_type: this.state.cardType,
        expiration_month: this.state.month_value,
        expiration_year: this.state.year_value,
        cvv_code: this.state.Cvv,
        zip_code: this.state.BillingZipCode,
        is_active: 1,
        is_deleted: 0,
      };

      var payment_bank = {
        name_on_bank_account: this.state.NameOnBankAccount,
        bank_name: this.state.BankName,
        account_number: this.state.BankAccountNumber,
        routing_number: this.state.ABAroutingNumber,
        is_active: 1,
        is_deleted: 0,
      };

      let objdata = {
        shipments: shipments,
        from_address: from_address,
        to_address: to_address,
        payment_online: payment_online,
        payment_bank: payment_bank,
        paymentType: this.state.selectedPaymentType,
        packages: packages,
        commercial: commercial,
        TotalCommercialvalue: this.state.totalCommercial,
      };

      const apiUrl =
        "https://api.sflworldwide.com/scheduleshipment/addshipments";
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      this.showLoader();
      fetch(apiUrl, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(objdata),
      })
        .then((result) => result.json())
        .then((data) => {
          this.hideLoader();
          if (data.data.success === true) {
            localStorage.removeItem("shipmentObj");

            this.props.history.push({
              pathname: "/admin/ScheduleConfirmation",
              state: {
                Second_data: objdata,
                trackingNumber: data.data.data.tracking_number,
              },
            });
          } else {
            this.hideLoader();
            cogoToast.error("Schedule Shipment is Not Created!");
          }
        })
        .catch((err) => {
          this.hideLoader();
          cogoToast.error("Schedule Shipment is Not Created!");
        });
    } else {
    }
  };

  formatDate(RequestDate) {
    var day = new Date(RequestDate).getDate();
    var monthIndex = new Date(RequestDate).getMonth();
    var year = new Date(RequestDate).getFullYear();
    return year + "" + (monthIndex + 1) + "" + day;
  }

  onlinepaymentChange(e) {
    this.setState({
      selectedPaymentType: e.target.name,
      hideSelectbank: false,
      hidePayonline: true,
      payOnline: 1,
      payBank: 1,
    });
  }

  bankpaymentChange(e) {
    this.setState({
      selectedPaymentType: e.target.name,
      hideSelectbank: true,
      hidePayonline: false,
      payOnline: 0,
      payBank: 0,
    });
  }

  render() {
    const {
      fromCompanyName,
      fromCompanyNameErr,
      fromCompanyNameHelperText,
      fromCity,
      fromCityErr,
      fromCityHelperText,
      fromZipCode,
      fromZipCodeErr,
      fromZipCodeHelperText,
      fromContactName,
      fromContactNameErr,
      fromContactNameHelperText,
      fromState,
      fromStateErr,
      fromStateHelperText,
      fromEmail,
      fromEmailErr,
      fromEmailHelperText,
      fromAddressLine1,
      fromAddressLine1Err,
      fromAddressLine1HelperText,
      fromAddressLine2,
      fromAddressLine2Err,
      fromAddressLine2HelperText,
      fromAddressLine3,
      fromAddressLine3Err,
      fromAddressLine3HelperText,
      fromPhone1,
      fromPhone1Err,
      fromPhone1HelperText,
      fromPhone2,
      fromPhone2Err,
      fromPhone2HelperText,
      toCompanyName,
      toCompanyNameErr,
      toCompanyNameHelperText,
      toZipCode,
      toZipCodeErr,
      toZipCodeHelperText,
      toCity,
      toCityErr,
      toCityHelperText,
      toContactName,
      toContactNameErr,
      toContactNameHelperText,
      toState,
      toStateErr,
      toStateHelperText,
      toEmail,
      toEmailErr,
      toEmailHelperText,
      toAddressLine1,
      toAddressLine1Err,
      toAddressLine1HelperText,
      toAddressLine2,
      toAddressLine2Err,
      toAddressLine2HelperText,
      toAddressLine3,
      toAddressLine3Err,
      toAddressLine3HelperText,
      toPhone1,
      toPhone1Err,
      toPhone1HelperText,
      toPhone2,
      toPhone2Err,
      toPhone2HelperText,
      checkedTerm,
      shipmentType,
    } = this.state;

    const fromCityOptions = this.state.fromGoogleAPICityList.map((city) => {
      return { value: city.City_code, label: city.Name };
    });
    const toCityOptions = this.state.toGoogleAPICityList.map((city) => {
      return { value: city.City_code, label: city.Name };
    });

    const PackageDetails = [];

    for (let i = 0; i < this.state.PackageDetails.length; i++) {
      var Package = this.state.PackageDetails[i];
      PackageDetails.push(
        <tr>
          <td>
            <input
              type="text"
              name="PackageNumber"
              id="PackageNumber"
              value={Package.PackageNumber}
              onChange={this.InputValidate("PackageNumber", i)}
              disabled={!this.state.IsPackage}
            />
          </td>
          <td>
            <input
              type="text"
              name="PackageWeight"
              id="PackageWeight"
              value={Package.PackageWeight}
              onChange={this.InputValidate("PackageWeight", i)}
              disabled={!this.state.IsPackage}
            />
          </td>
          <td>
            <input
              type="text"
              name="PackageLength"
              id="PackageLength"
              value={Package.PackageLength}
              onChange={this.InputValidate("PackageLength", i)}
              disabled={!this.state.IsPackage}
            />

            <input
              type="text"
              name="PackageWidth"
              id="PackageWidth"
              value={Package.PackageWidth}
              onChange={this.InputValidate("PackageWidth", i)}
              disabled={!this.state.IsPackage}
            />

            <input
              type="text"
              name="PackageHeight"
              id="PackageHeight"
              value={Package.PackageHeight}
              onChange={this.InputValidate("PackageHeight", i)}
              disabled={!this.state.IsPackage}
            />
          </td>
          <td>
            <input
              type="text"
              name="PackageChargableWeight"
              id="PackageChargableWeight"
              onChange={this.InputValidate("PackageChargableWeight", i)}
              value={Package.PackageChargableWeight}
              disabled={true}
            />
          </td>
          <td>
            <input
              type="text"
              name="PackageInsuredValue"
              id="PackageInsuredValue"
              value={Package.PackageInsuredValue}
              onChange={this.InputValidate("PackageInsuredValue", i)}
              disabled={!this.state.IsPackage}
            />
          </td>
          {this.state.PackageDetails.length > 1 ? (
            <td>
              {i > 0 ? (
                <DeleteIcon value={" Delete"} onClick={this.DeleteRowData(i)} />
              ) : null}
            </td>
          ) : null}
        </tr>
      );
    }

    return (
      <div>
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
        <GridContainer id="mainContent" className="MuiGrid-justify-xs-center">
          <GridItem xs={12} sm={12} md={12}>
            <Card className="z-index-9">
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <FlightTakeoff />
                </CardIcon>
                <h4 className="margin-right-auto text-color-black">
                  Sender Information
                </h4>
                <h4 className="text-color-black">
                  Shipment Type : {shipmentType}
                </h4>
              </CardHeader>
              <CardBody>
                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <CustomInput
                      id="fromcountry"
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: this.state.fromCountryName,
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
                  </Grid>

                  <Grid item xs={4}>
                    <CustomInput
                      id="companyname"
                      labelText="Company Name"
                      error={fromCompanyNameErr}
                      helperText={fromCompanyNameHelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: fromCompanyName,
                        onBlur: (event) =>
                          this.handleBlur(event, "fromcompanyname"),
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
                  </Grid>

                  <Grid item xs={4}>
                    <CustomInput
                      success={false}
                      labelText="Contact Name"
                      id="contactname"
                      error={fromContactNameErr}
                      helperText={fromContactNameHelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: fromContactName,
                        onBlur: (event) =>
                          this.handleBlur(event, "fromcontactname"),
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
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <CustomInput
                      id="addressline1"
                      labelText="Address Line 1"
                      error={fromAddressLine1Err}
                      helperText={fromAddressLine1HelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: fromAddressLine1,
                        onBlur: (event) =>
                          this.handleBlur(event, "fromaddressline1"),
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
                  </Grid>

                  <Grid item xs={4}>
                    <CustomInput
                      id="addressline2"
                      labelText="Address Line 2"
                      error={fromAddressLine2Err}
                      helperText={fromAddressLine2HelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        onBlur: (event) =>
                          this.handleBlur(event, "fromaddressline2"),
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
                  </Grid>

                  <Grid item xs={4}>
                    <CustomInput
                      labelText="Address Line 3"
                      id="addressline3"
                      error={fromAddressLine3Err}
                      helperText={fromAddressLine3HelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        onBlur: (event) =>
                          this.handleBlur(event, "fromaddressline3"),
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
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <CustomInput
                      labelText="Zip Code"
                      error={fromZipCodeErr}
                      helperText={fromZipCodeHelperText}
                      id="zipcode"
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: fromZipCode,
                        onBlur: (event) =>
                          this.handleBlur(event, "fromzipcode"),
                        onChange: (event) =>
                          this.handleChange(event, "fromzipcode"),
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
                  </Grid>

                  <Grid item xs={4}>
                    {this.state.fromCityAutoComplete === false ? (
                      <CustomInput
                        labelText="City"
                        id="city"
                        error={fromCityErr}
                        helperText={fromCityHelperText}
                        formControlProps={{ fullWidth: true }}
                        inputProps={{
                          value: fromCity,
                          onBlur: (event) => this.handleBlur(event, "fromcity"),
                          onChange: (event) =>
                            this.handleChange(event, "fromcity"),
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
                              <Icon className="requiredicon">
                                location_city
                              </Icon>
                            </InputAdornment>
                          ),
                        }}
                      />
                    ) : (
                      <Autocomplete
                        options={fromCityOptions}
                        id="fromcity"
                        autoSelect
                        getOptionLabel={(option) => option.label}
                        value={fromCity}
                        onChange={(event, value) =>
                          this.fromCityChange(event, value)
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
                  </Grid>

                  <Grid item xs={4}>
                    <CustomInput
                      labelText="State"
                      id="state"
                      error={fromStateErr}
                      helperText={fromStateHelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: fromState,
                        onBlur: (event) => this.handleBlur(event, "fromstate"),
                        onChange: (event) =>
                          this.handleChange(event, "fromstate"),
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
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <CustomInput
                      labelText="Phone 1"
                      id="phone1"
                      error={fromPhone1Err}
                      helperText={fromPhone1HelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: fromPhone1,
                        onBlur: (event) => this.handleBlur(event, "fromphone1"),
                        onChange: (event) =>
                          this.handleChange(event, "fromphone1"),
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
                  </Grid>

                  <Grid item xs={4}>
                    <CustomInput
                      labelText="Phone 2"
                      id="phone2"
                      error={fromPhone2Err}
                      helperText={fromPhone2HelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: fromPhone2,
                        onBlur: (event) => this.handleBlur(event, "fromphone2"),
                        onChange: (event) =>
                          this.handleChange(event, "fromphone2"),
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
                  </Grid>

                  <Grid item xs={4}>
                    <CustomInput
                      labelText="Email Address"
                      id="email"
                      error={fromEmailErr}
                      helperText={fromEmailHelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: fromEmail,
                        onBlur: (event) => this.handleBlur(event, "fromemail"),
                        onChange: (event) =>
                          this.handleChange(event, "fromemail"),
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
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <div className="select-spl">
                      <FormControl fullWidth>
                        <InputLabel className={classes.selectLabel}>
                          Do You Need Pickup?
                        </InputLabel>
                        <Select
                          value={this.state.selectedPickupType}
                          onChange={(event) => this.isPickUpNeed(event)}
                          inputProps={{
                            name: "doyouneedpickup",
                            id: "doyouneedpickup",
                          }}
                        >
                          {this.appendPickType()}
                        </Select>
                      </FormControl>
                    </div>
                  </Grid>

                  <Grid item xs={4}>
                    {this.state.IsPickUp ? (
                      <div className="date-input">
                        <InputLabel className={classes.label}>
                          PickUp Date
                        </InputLabel>
                        <FormControl fullWidth>
                          <Datetime
                            defaultValue={moment().toDate()}
                            timeFormat={false}
                            inputProps={{ placeholder: "PickUp Date" }}
                            selected={this.state.pickUpDate}
                            onChange={this.handleDateChange}
                            isValidDate={this.state.valid}
                            closeOnSelect={true}
                          />
                        </FormControl>
                      </div>
                    ) : null}
                  </Grid>
                </Grid>
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <FlightTakeoff />
                </CardIcon>
                <h4 className="margin-right-auto text-color-black">
                  Recipient information
                </h4>
              </CardHeader>
              <CardBody>
                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <CustomInput
                      id="tocountry"
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: this.state.toCountryName,
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
                  </Grid>

                  <Grid item xs={4}>
                    <CustomInput
                      labelText="Company Name"
                      id="companyname"
                      error={toCompanyNameErr}
                      helperText={toCompanyNameHelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: toCompanyName,
                        onBlur: (event) =>
                          this.handleBlur(event, "tocompanyname"),
                        onChange: (event) =>
                          this.handleChange(event, "tocompanyname"),
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
                  </Grid>

                  <Grid item xs={4}>
                    <CustomInput
                      labelText="Contact Name"
                      id="contactname"
                      error={toContactNameErr}
                      helperText={toContactNameHelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: toContactName,
                        onBlur: (event) =>
                          this.handleBlur(event, "tocontactname"),
                        onChange: (event) =>
                          this.handleChange(event, "tocontactname"),
                        onFocus: (event) =>
                          this.setState({
                            toContactNameErr: false,
                            toContactNameHelperText: "",
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
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <CustomInput
                      labelText="Address Line 1"
                      id="addressline1"
                      error={toAddressLine1Err}
                      helperText={toAddressLine1HelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: toAddressLine1,
                        onBlur: (event) =>
                          this.handleBlur(event, "toaddressline1"),
                        onChange: (event) =>
                          this.handleChange(event, "toaddressline1"),
                        onFocus: () =>
                          this.setState({
                            toAddressLine1Err: false,
                            toAddressLine1HelperText: "",
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
                  </Grid>

                  <Grid item xs={4}>
                    <CustomInput
                      id="addressline2"
                      labelText="Address Line 2"
                      error={toAddressLine2Err}
                      helperText={toAddressLine2HelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        onBlur: (event) =>
                          this.handleBlur(event, "toaddressline2"),
                        onChange: (event) =>
                          this.handleChange(event, "toaddressline2"),
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
                  </Grid>

                  <Grid item xs={4}>
                    <CustomInput
                      labelText="Address Line 3"
                      id="addressline3"
                      error={toAddressLine3Err}
                      helperText={toAddressLine3HelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        onBlur: (event) =>
                          this.handleBlur(event, "toaddressline3"),
                        onChange: (event) =>
                          this.handleChange(event, "toaddressline3"),
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
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <CustomInput
                      labelText="Zip Code"
                      id="zipcode"
                      error={toZipCodeErr}
                      helperText={toZipCodeHelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: toZipCode,
                        onBlur: (event) => this.handleBlur(event, "tozipcode"),
                        onChange: (event) =>
                          this.handleChange(event, "tozipcode"),
                        onFocus: () =>
                          this.setState({
                            toZipCodeErr: false,
                            toZipCodeHelperText: "",
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
                  </Grid>

                  <Grid item xs={4}>
                    {this.state.toCityAutoComplete === false ? (
                      <CustomInput
                        labelText="City"
                        id="city"
                        error={toCityErr}
                        helperText={toCityHelperText}
                        formControlProps={{ fullWidth: true }}
                        inputProps={{
                          value: toCity,
                          onBlur: (event) => this.handleBlur(event, "tocity"),
                          onChange: (event) =>
                            this.handleChange(event, "tocity"),
                          onFocus: (event) =>
                            this.setState({
                              toCityErr: false,
                              toCityHelperText: "",
                            }),
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              className={classes.inputAdornment}
                            >
                              <Icon className="requiredicon">
                                location_city
                              </Icon>
                            </InputAdornment>
                          ),
                        }}
                      />
                    ) : (
                      <Autocomplete
                        options={toCityOptions}
                        id="tocity"
                        autoSelect
                        getOptionLabel={(option) => option.label}
                        value={toCity}
                        onChange={(event, value) =>
                          this.toCityChange(event, value)
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
                  </Grid>

                  <Grid item xs={4}>
                    <CustomInput
                      labelText="State"
                      id="state"
                      error={toStateErr}
                      helperText={toStateHelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: toState,
                        onBlur: (event) => this.handleBlur(event, "tostate"),
                        onChange: (event) =>
                          this.handleChange(event, "tostate"),
                        onFocus: (event) =>
                          this.setState({
                            toStateErr: false,
                            toStateHelperText: "",
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
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <CustomInput
                      labelText="Phone 1"
                      id="phone1"
                      error={toPhone1Err}
                      helperText={toPhone1HelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: toPhone1,
                        onBlur: (event) => this.handleBlur(event, "tophone1"),
                        onChange: (event) =>
                          this.handleChange(event, "tophone1"),
                        onFocus: (event) =>
                          this.setState({
                            toPhone1Err: false,
                            toPhone1HelperText: "",
                          }),
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={classes.inputAdornment}
                          >
                            <Icon className="requiredicon">phone_in_talk</Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <CustomInput
                      labelText="Phone 2"
                      id="phone2"
                      error={toPhone2Err}
                      helperText={toPhone2HelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: toPhone2,
                        onBlur: (event) => this.handleBlur(event, "tophone2"),
                        onChange: (event) =>
                          this.handleChange(event, "tophone2"),
                        onFocus: (event) =>
                          this.setState({
                            toPhone2Err: false,
                            toPhone2HelperText: "",
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
                  </Grid>

                  <Grid item xs={4}>
                    <CustomInput
                      labelText="Email Address *"
                      id="email"
                      error={toEmailErr}
                      helperText={toEmailHelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: toEmail,
                        onBlur: (event) => this.handleBlur(event, "toemail"),
                        onChange: (event) =>
                          this.handleChange(event, "toemail"),
                        onFocus: (event) =>
                          this.setState({
                            toEmailErr: false,
                            toEmailHelperText: "",
                          }),
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={classes.inputAdornment}
                          >
                            <Icon className={classes.User}>email</Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <InputLabel className={classes.selectLabel}>
                      Select Location Type
                    </InputLabel>
                    <Select
                      value={this.state.SelectedLocationType}
                      onChange={(event) => this.locationType(event)}
                      inputProps={{ name: "locationType", id: "locationType" }}
                    >
                      {this.appendLocationType()}
                    </Select>
                  </Grid>
                </Grid>
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <FlightTakeoff />
                </CardIcon>
                <h4 className="margin-right-auto text-color-black">
                  Package Details
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={3} md={3}>
                    <FormControl fullWidth>
                      <InputLabel className={classes.selectLabel}>
                        Package Type <small>(required)</small>
                      </InputLabel>
                      <Select
                        value={this.state.selectedPackageType}
                        onChange={(event) => this.packageType(event)}
                        inputProps={{ name: "packagetype", id: "packagetype" }}
                      >
                        {this.state.PackageType.map((packageType) => {
                          return (
                            <MenuItem
                              classes={{ root: classes.selectMenuItem }}
                              value={packageType.value}
                            >
                              {packageType.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </GridItem>

                  {this.state.selectedPackageType === "Package" ? (
                    <GridItem xs={12} sm={3} md={2}>
                      <FormControl fullWidth>
                        <InputLabel className={classes.selectLabel}>
                          No. of Packages
                        </InputLabel>
                        <Select
                          value={this.state.selectedPackageNumbers.value}
                          onChange={(event) => this.PackageCount(event)}
                        >
                          {this.appendNoOfPackages()}
                        </Select>
                      </FormControl>
                    </GridItem>
                  ) : null}

                  <GridItem xs={12} sm={12} md={12}>
                    <div className="package-table">
                      <table>
                        <thead>
                          <tr>
                            <th>No of Packages</th>
                            <th>Weight (lbs)*</th>
                            <th>Dimenstion (L + W + H in Inches)*</th>
                            <th>Chargeble Weight</th>
                            <th>Insured Value (USD)*</th>
                            {PackageDetails.length > 1 ? <th>&nbsp;</th> : null}
                          </tr>
                        </thead>
                        <tbody>{PackageDetails}</tbody>
                        <tfoot>
                          <tr>
                            <td>
                              {this.state.IsPackage == true ? (
                                <Button
                                  value={"Add New Row"}
                                  onClick={(event) => this.AddNewRowData()}
                                >
                                  {" "}
                                  Add New Row{" "}
                                </Button>
                              ) : null}
                            </td>
                            <td>
                              <input
                                type="number"
                                name="TotalWeight"
                                id="TotalWeight"
                                value={this.state.GetRate.TotalWeight}
                                min="0"
                                max="999999999"
                                disabled={true}
                              />
                            </td>
                            <td colSpan="1"></td>
                            <td>
                              <input
                                type="number"
                                name="TotalChargableWeight"
                                id="TotalChargableWeight"
                                value={this.state.GetRate.TotalChargableWeight}
                                min="0"
                                max="999999999"
                                disabled={true}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                name="TotalInsuredValue"
                                id="TotalInsuredValue"
                                value={this.state.GetRate.TotalInsuredValue}
                                min="0"
                                max="999999999"
                                disabled={true}
                              />
                            </td>
                            {PackageDetails.length > 1 ? <td>&nbsp;</td> : null}
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {this.state.IsCommercial &&
                    this.state.selectedPackageType === "Package" ? (
                      <div>
                        <div className="commercial-radio">
                          <GridContainer>
                            <GridItem xs={12} sm={4} md={4}>
                              <h3>Commercial Invoice</h3>
                            </GridItem>
                          </GridContainer>
                        </div>

                        <div className="package-table commercial-table">
                          <table>
                            <thead>
                              <tr>
                                {this.renderTableHeader()}
                                {this.state.commercialData.length > 1 ? (
                                  <th>&nbsp;</th>
                                ) : null}
                              </tr>
                            </thead>
                            <tbody>{this.renderTableData()}</tbody>
                            <tfoot>
                              <tr>
                                <td>
                                  <Button
                                    onClick={(event) =>
                                      this.AddNewRowData_commercial()
                                    }
                                  >
                                    Add New Row
                                  </Button>
                                </td>
                                <td colSpan="3">Total Value</td>
                                <td> {this.state.totalCommercial} </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    ) : null}
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <FlightTakeoff />
                </CardIcon>
                <h4 className="margin-right-auto text-color-black">
                  Payment Details
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <div className="radio-box">
                      <label className="full-width">
                        Selected Payment Type
                      </label>
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
                        Pay Online
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
                        Bank Details
                      </label>
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
                              onBlur: (event) =>
                                this.handleBlur(event, "nameoncard"),
                              onChange: (event) =>
                                this.handleChange(event, "nameoncard"),
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
                                  <Icon className="requiredicon">
                                    credit_card
                                  </Icon>
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
                              onBlur: (event) =>
                                this.handleBlur(event, "cardnumber"),
                              onChange: (event) =>
                                this.handleChange(event, "cardnumber"),
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
                                  <Icon className="requiredicon">
                                    credit_card
                                  </Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </FormControl>
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel className={classes.selectLabel}>
                            Month
                          </InputLabel>
                          <Select
                            value={this.state.month_value}
                            onChange={(event) => this.changemonth(event)}
                          >
                            {this.appendMonths()}
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel className={classes.selectLabel}>
                            Year
                          </InputLabel>
                          <Select
                            value={this.state.year_value}
                            onChange={(event) => this.changeyear(event)}
                          >
                            {this.appendYears()}
                          </Select>
                        </FormControl>
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
                            onBlur: (event) => this.handleBlur(event, "cvv"),
                            onChange: (event) =>
                              this.handleChange(event, "cvv"),
                            onFocus: () =>
                              this.setState({
                                cvvErr: false,
                                cvvHelperText: "",
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
                          labelText="Billing Zip Code"
                          id="billingzipcode"
                          error={this.state.BillingZipCodeErr}
                          helperText={this.state.BillingZipCodeHelperText}
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onBlur: (event) =>
                              this.handleBlur(event, "billingzipcode"),
                            onChange: (event) =>
                              this.handleChange(event, "billingzipcode"),
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
                            onChange: (event) =>
                              this.handleChange(event, "nameonbankaccount"),
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
                                <Icon className="requiredicon">
                                  account_balance
                                </Icon>
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
                            onBlur: (event) =>
                              this.handleBlur(event, "bankname"),
                            onChange: (event) =>
                              this.handleChange(event, "bankname"),
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
                            onChange: (event) =>
                              this.handleChange(event, "accountnumber"),
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
                                <Icon className="requiredicon">
                                  account_circle
                                </Icon>
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
                          helperText={
                            this.state.ConfirmBankAccountNumberHelperText
                          }
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onBlur: (event) =>
                              this.handleBlur(event, "confirmaccountnumber"),
                            onChange: (event) =>
                              this.handleChange(event, "confirmaccountnumber"),
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
                                <Icon className="requiredicon">
                                  account_circle
                                </Icon>
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
                            onChange: (event) =>
                              this.handleChange(event, "abaroutingnumber"),
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
                          helperText={
                            this.state.ConfirmABAroutingNumberHelperText
                          }
                          formControlProps={{ fullWidth: true }}
                          inputProps={{
                            onBlur: (event) =>
                              this.handleBlur(event, "cabaroutingnumber"),
                            onChange: (event) =>
                              this.handleChange(event, "cabaroutingnumber"),
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
              </CardBody>
            </Card>

            <GridItem xs={12} sm={12} md={12}>
              <Checkbox
                value="primary"
                onChange={(event) => this.handleTerms(event)}
                inputProps={{ "aria-label": "primary checkbox" }}
              />
              <Link
                onClick={() =>
                  this.setState({ IsTermShow: !this.state.IsTermShow })
                }
              >
                I Agree to below Terms and Condition
              </Link>
              <Dialog
                maxWidth="lg"
                id="dialog"
                onClose={() =>
                  this.setState({ IsTermShow: !this.state.IsTermShow })
                }
                aria-labelledby="customized-dialog-title"
                open={this.state.IsTermShow}
              >
                <DialogTitle
                  id="customized-dialog-title"
                  onClose={this.handleClose}
                >
                  SFL Worldwide LLC Terms and Conditions
                  {this.handleClose ? (
                    <IconButton
                      position="end"
                      aria-label="close"
                      className="modal-close"
                      onClick={this.handleClose}
                    >
                      <CloseIcon position="end" className="modal-close" />
                    </IconButton>
                  ) : null}{" "}
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
                      previous terms and conditions, amendments, supplements,
                      and other prior statements concerning the rates and
                      conditions of SFL Worldwide LLC service to which these
                      terms and conditions apply.
                    </p>
                    <p>
                      The SFL Worldwide LLC Terms & Conditions consists of the
                      Our Services information at SFL Worldwide.com (U.S. and
                      U.S. export); U.S., U.S. export, U.S. import and U.S.
                      retail rates; these SFL Worldwide LLC Terms and
                      Conditions; and the SFL Worldwide LLC Ground Tariff. The
                      information in the Our Services section of the SFL
                      Worldwide LLC Terms & Conditions is not part of the
                      contract of carriage. SFL Worldwide LLC reserves the right
                      to unilaterally modify, amend, change or supplement the
                      SFL Worldwide LLC Terms & Conditions, including, but not
                      limited to, the rates, services, features of service, and
                      these terms and conditions, without notice. Only an
                      officer in the Legal Department of SFL Worldwide LLC or
                      successor positions may authorize a supplement to, or
                      modification, change or amendment of, the SFL Worldwide
                      LLC Terms & Conditions. No other agent or employee of SFL
                      Worldwide LLC, its affiliates or subsidiaries, nor any
                      other person or party, is authorized to do so. This
                      restriction in modification does not apply to a
                      modification applicable to a single customer and included
                      in a SFL Worldwide LLC Sales or SFL Worldwide LLC Customer
                      agreement.To the extent a conflict exists between a SFL
                      Worldwide LLC Sales or SFL Worldwide LLC Customer
                      agreement and these SFL Worldwide LLC Terms and
                      Conditions, the SFL Worldwide LLC Sales or SFL Worldwide
                      LLC Customer agreement controls.
                    </p>
                    <p>
                      Any failure to enforce or apply a term, condition, or
                      provision of the SFL Worldwide LLC Terms & Conditions
                      shall not constitute a waiver of that term, condition or
                      provision or otherwise impair our right to enforce or
                      apply such a term, condition or provision in the future.
                    </p>
                    <p>International Shipments (U.S. Edition)</p>
                    <p>
                      If there is a conflict between these terms and conditions
                      and the terms and conditions on any SFL Worldwide LLC air
                      waybill, shipping label or other transit documentation,
                      the terms and conditions in the SFL Worldwide LLC Terms &
                      Conditions, as amended, modified, changed or supplemented,
                      will control to the extent they are not in conflict with
                      the rules relating to liability for international carriage
                      established by the Warsaw Convention, as amended, or
                      Montreal Convention, other applicable treaties or any
                      applicable tariff.
                    </p>
                    <p>
                      Rates and service quotations by our employees and agents
                      are based upon information you provide, but final rates
                      and service may vary based upon the shipment actually
                      tendered and the application of these terms and
                      conditions. Rates quoted will vary depending on whether{" "}
                      <br />
                      (1) the shipper is a SFL Worldwide LLC account holder and{" "}
                      <br />
                      (2) the shipper has discounts applied to his or her
                      account.
                    </p>
                    <p>
                      Shippers will be quoted SFL Worldwide LLC Standard List
                      Rates if they have a valid SFL Worldwide LLC account, do
                      not have discounts applied to their account and if they
                      charge their shipping to their account.
                    </p>
                    <p>
                      Shippers will be quoted Account-Specific Rates if they
                      have a valid SFL Worldwide LLC account, have discounts
                      applied to their account and if they charge their shipping
                      to their account.
                    </p>
                    <p>
                      Any conflict or inconsistency between the SFL Worldwide
                      LLC Terms & Conditions and other written or oral
                      statements concerning the rates, features of service, and
                      terms and conditions applicable to SFL Worldwide LLC
                      international services from the U.S. to international
                      locations and many terms regarding importation and inbound
                      clearance of shipments into the U.S. will be controlled by
                      the SFL Worldwide LLC Terms & Conditions, as modified,
                      amended or supplemented.
                    </p>
                    <p>
                      For the most current information regarding areas served
                      and delivery commitments, contact Customer Service at
                      1.877.741.3134
                    </p>
                    <ul style={{ listStyleType: "none" }}>
                      <li>
                        (1) What Shipment means: A shipment means all documents
                        and or parcels that travel under one airway bill, not
                        just any single document or envelope included in a
                        shipment. The sender certifies that the shipment details
                        are complete and accurate, and that shipment is properly
                        marked, addressed and packed to ensure safe
                        transportation, with ordinary care in handling. Customer
                        agrees that all shipments will be transported via air
                        courier and or cargo mode and may experience mode
                        changes during transit by carrier without any prior
                        notice. Shipment is within the carrier’s jurisdiction up
                        until carrier delivers to final destination address.
                      </li>
                      <li>
                        (2) ALL shipments are tendered to SFL Worldwide LLC via
                        our online schedule shipment system by which SFL
                        Worldwide tracks and monitors each shipment. It is
                        responsibility of the customer to make informed and
                        educated decisions related to shipment. SFL Worldwide
                        LLC will not be held responsible for customers filing
                        complaint(s) against mis-quotations, mis-communications,
                        incorrect information received by customer.
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
                        assessed dimensional-weight charges by SFL Worldwide
                        LLC. Packing, Overweight and Oversize charges is being
                        charged on Actuals.
                      </li>
                      <li>
                        (4) ALL Shipments will be tendered to SFL Worldwide, LLC
                        in a box/carton made of cardboard or any form of valid
                        container that can be sealed tightly to avoid damage or
                        leakage. Plastic bags, paper bags, torn suitcases are
                        not acceptable forms of container used for shipping.
                      </li>
                      <li>
                        (5) Shipments sent via FedEx or DHL carriers will be
                        brokered by them at the destination country. SFL
                        Worldwide is not responsible for any fees, duties,
                        storage & handling at destination country.
                      </li>
                      <li>
                        (6) SFL Worldwide, LLC is not responsible for notifying
                        sender of any additional documentation required at time
                        of shipment other than the shipping label and an invoice
                        as per standard requirement for shipping.
                      </li>
                      <li>
                        (7) The shipping carrier (FedEx, DHL) are responsible
                        for notifying customers on rules and regulations to be
                        followed at destination country upon shipment arrival at
                        destination country required for any clearance
                        procedures.
                      </li>
                      <li>
                        (8) Shipments tendered to SFL Worldwide LLC going to
                        destination country, India, via SFL Worldwide LLC
                        carrier will be brokered for clearance by agents
                        affiliated with SFL Worldwide LLC. Sender or Recipient
                        is ultimately responsible for any duties and taxes
                        levied for shipment in India.
                      </li>
                      <li>
                        (9) SFL Worldwide LLC is not responsible for any delays
                        caused in transporting shipment(s) locally within
                        destination country.
                      </li>
                      <li>
                        (10) SFL Worldwide LLC will not accept shipments
                        considered prohibited and or hazardous as per United
                        States Department of Transportation (USDOT),
                        International Air Transport Association (IATA), United
                        States Transportation Security Administration (TSA) or
                        the International Civil Aviation Organization (ICAO).
                      </li>
                      <li>(11) Documentation</li>
                      <ul style={{ listStyleType: "none" }}>
                        <li>
                          a) Proper & complete documentation by the parties is
                          compulsorily required along with accurate details of
                          the SHIPPER /RECEIVER’s name addresses telephone
                          numbers email ids and forms, permits, way bills
                          invoices, STN(Stock Transfer Note) etc. as per the
                          statutory requirements.
                        </li>
                        <li>
                          b) SFL Worldwide shall not be made responsible/ liable
                          in case of any deficiency in the documents/statutory
                          requirements and no claim of grievance of nay nature
                          shall be entertained if the same is arising out of the
                          reasons mentioned herein above.
                        </li>
                        <li>
                          c) Parties hereby undertake to make good the loss to
                          SFL Worldwide in case their shipment (s) cause damage
                          to other shipments loaded in the Vehicle due to
                          inherent nature and which is wrongly declared by the
                          parties OR in case of seizure by any Government
                          authority due to improper and incomplete documentation
                          as a result other shipment(s) also get delayed
                          resulting in a loss to SFL Worldwide.
                        </li>
                      </ul>
                      <li>
                        (12) Transit Time: Please be advised that transit time
                        varies based on the carrier. Delivery times vary by
                        carrier and are not always guaranteed 100% of the time.
                        The transit times are given assuming there aren’t any
                        delays that are unforeseen unless otherwise stated. SFL
                        Worldwide, LLC will not held liable for any delays
                        caused during transit of shipment which can affect final
                        delivery of shipment at destination country.
                      </li>
                      <li>
                        (13) LIEN: SFL Worldwide shall have a right to general
                        lien over all the shipment of parties towards any dues
                        payable to SFL Worldwide.
                      </li>
                      <li>
                        (14) Liabilities Not Assumed: SFL WORLDWIDE LLC WILL NOT
                        BE LIABLE FOR ANY DAMAGES IN EXCESS OF THE DECLARED
                        VALUE OR US$100 OR THE AMOUNT SET BY THE MONTREAL OR
                        WARSAW CONVENTIONS (AS AMENDED), WHICHEVER IS GREATER,
                        FOR CARRIAGE OF A SHIPMENT ARISING FROM TRANSPORTATION
                        SUBJECT TO THE TERMS AND CONDITIONS CONTAINED IN THE SFL
                        WORLDWIDE LLC TERMS & CONDITIONS, WHETHER OR NOT SFL
                        WORLDWIDE LLC KNEW OR SHOULD HAVE KNOWN THAT SUCH
                        DAMAGES MIGHT BE INCURRED. In no event shall SFL
                        Worldwide LLC, including, without limitation, agents,
                        contractors, employees and affiliates, be liable for any
                        special, incidental or consequential damages, including,
                        without limitation, loss of profits or income, whether
                        or not SFL Worldwide LLC had knowledge that such damages
                        might be incurred. If we inadvertently accept a shipment
                        with a destination city or cities that we do not serve
                        in a country to which SFL Worldwide LLC international
                        services are provided, we may attempt to complete the
                        delivery. However, we will not be liable and we will not
                        provide any proof of delivery. The delivery commitment
                        listed for such country will not apply, and the
                        applicable rate will be the highest for that country
                        plus the maximum extended service area surcharge. In
                        these cases, the money-back guarantee applies only to
                        the portion of the transportation provided directly by
                        us. We will not be liable or responsible for loss,
                        damage or delay caused by events we cannot control. We
                        will not be liable for, nor will any adjustment, refund
                        or credit of any kind be given as a result of any loss,
                        damage, delay, mis-delivery, non-delivery,
                        misinformation or any failure to provide information,
                        except such as may result from our sole negligence. We
                        will not be liable for, nor will any adjustment, refund
                        or credit of any kind be given as a result of, any loss,
                        damage, delay, misdelivery, non-delivery, misinformation
                        or failure to provide information caused by or resulting
                        in whole or in part from:
                      </li>
                      <ul style={{ listStyleType: "none" }}>
                        <li>
                          a) The act, default or omission of any person or
                          entity, other than SFL Worldwide LLC, including those
                          of any local, state or federal government agencies.
                        </li>
                        <li>
                          b) The nature of the shipment, including any defect,
                          characteristic or inherent vice of the shipment.
                        </li>
                        <li>
                          c) Your violation of any of the terms and conditions
                          contained in the SFL Worldwide LLC Terms and
                          Conditions, as amended or supplemented, or on an air
                          waybill, standard conditions of carriage, tariff or
                          other terms and conditions applicable to your
                          shipment, including, but not limited to, the improper
                          or insufficient packing, securing, marking and
                          addressing of shipments, or use of an account number
                          not in good credit standing, or failure to give
                          notices in the manner and time prescribed.
                        </li>
                        <li>
                          d) Perils of the air, public enemies, criminal acts of
                          any person(s) or entities including, but not limited
                          to, acts of terrorism, public authorities acting with
                          actual or apparent authority, authority of law, local
                          disputes, civil commotion, hazards incident to a state
                          of war, local, national or international weather
                          conditions (as determined solely by us), local,
                          national or international disruptions in air or ground
                          transportation networks (as determined solely by us),
                          strikes or anticipated strikes (of any entity,
                          including, but not limited to, other carriers, vendors
                          or suppliers), labor disruptions or shortages caused
                          by pandemic conditions or other public health event or
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
                          f) Damage or loss of articles packaged and sealed by
                          the sender or by person(s) acting at the sender's
                          direction, provided the seal is unbroken at the time
                          of delivery, the package retains its basic integrity,
                          and the recipient accepts the shipment without noting
                          the damage on the delivery record.
                        </li>
                        <li>
                          g) Our inability or failure to complete a delivery, or
                          a delay to any delivery, due to acts or omissions of
                          customs or other regulatory agencies.
                        </li>
                        <li>
                          h) Delays in delivery caused by adherence to SFL
                          Worldwide LLC policies regarding the payment of duties
                          and taxes or other charges.
                        </li>
                        <li>
                          i) Our inability to provide a copy of the delivery
                          record or a copy of the signature obtained at
                          delivery.
                        </li>
                        <li>
                          j) Erasure of data from or the loss or
                          irretrievability of data stored on magnetic tapes,
                          files or other storage media, or erasure or damage of
                          photographic images or soundtracks from exposed film.
                        </li>
                        <li>
                          k) The loss of any personal or financial information
                          including, but not limited to, social security
                          numbers, dates of birth, driver's license numbers,
                          credit card numbers and financial account information.
                        </li>
                        <li>
                          l) Our failure to honor package-orientation graphics
                          (e.g., 'up' arrows, 'this end up' markings), 'fragile'
                          labels or other special directions concerning
                          packages.
                        </li>
                        <li>
                          m) Your failure to ship goods in packaging approved by
                          us prior to shipment where such prior approval is
                          recommended or required.
                        </li>
                        <li>
                          n) The shipment of fluorescent tubes, neon lighting,
                          neon signs, X-ray tubes, laser tubes, light bulbs,
                          quartz crystal, quartz lamps, glass tubes such as
                          those used for specimens and glass containers such as
                          those used in laboratory test environments.
                        </li>
                        <li>
                          o) Our failure to notify you of any delay, loss or
                          damage in connection with your shipment or any
                          inaccuracy in such notice.
                        </li>
                        <li>
                          p) Shipments released without obtaining a signature if
                          a signature release is on file.
                        </li>
                        <li>
                          q) Our failure or inability to attempt to contact the
                          sender or recipient concerning an incomplete or
                          inaccurate address; incorrect, incomplete, inaccurate
                          or missing documentation; payment of duties and taxes
                          necessary to release a shipment; or an incomplete or
                          incorrect customs broker's address.
                        </li>
                        <li>
                          r) The failure to properly designate a delivery
                          address as a Residential Delivery or Commercial
                          Delivery, including delivery addresses that were
                          processed through any address verification function or
                          program.
                        </li>
                        <li>
                          s) Any package where SFL Worldwide LLC records do not
                          reflect that the package was tendered to SFL Worldwide
                          LLC by the shipper.
                        </li>
                        <li>
                          t) The shipper's failure to delete all shipments
                          entered into a SFL Worldwide LLC self-invoicing
                          system, Internet shipping device or any other
                          electronic shipping method used to ship a package,
                          when the shipment is not tendered to SFL Worldwide
                          LLC. If you fail to do so and seek a refund, credit or
                          invoice adjustment, you must comply with the notice
                          provisions in Invoice Adjustments/Overcharges in the
                          Billing section. SFL Worldwide LLC is not liable for
                          any refund, credit or adjustment unless you comply
                          with those notice provisions.
                        </li>
                        <li>
                          u) Your use of an incomplete, inaccurate, or invalid
                          SFL Worldwide LLC account number or your failure to
                          provide a valid SFL Worldwide LLC account number in
                          good credit standing in the billing instructions on
                          shipping documentation.
                        </li>
                        <li>
                          v) Damage to briefcases, luggage, garment bags,
                          aluminum cases, plastic cases, or other items when not
                          enclosed in outer packaging, or other general shipping
                          containers caused by adhesive labels, soiling or
                          marking incidental to transportation.
                        </li>
                        <li>
                          w) The shipment of perishables or commodities that
                          could be damaged by exposure to heat or cold,
                          including, but not limited to, the shipment of any
                          alcoholic beverages, plants and plant materials,
                          tobacco products, ostrich or emu eggs, or live
                          aquaculture.
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
                            Worldwide LLC packaging guidelines available online
                            at SFL Worldwide LLC.com/packaging.
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
                            guidance has been approved in writing by SFL
                            Worldwide LLC Packaging Design and Development and
                            the writing expressly accepts liability in the event
                            of a damaged shipment.
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
                            Packaging Design and Development has preapproved
                            your packaging prior to shipment. See the Alcoholic
                            Beverages section for further information.
                          </li>
                          <li>
                            e. Dangerous goods shipments that the shipper did
                            not properly declare, including proper
                            documentation, markings, labels and packaging. SFL
                            Worldwide LLC will not pay a claim on undeclared or
                            hidden dangerous goods and the SFL Worldwide LLC
                            Money-Back Guarantee does not apply.
                          </li>
                          <li>
                            f. SFL Worldwide LLC will not be liable for the
                            failure to provide any services or service options
                            where our records do not reflect that the services
                            or service options were selected by the shipper.
                          </li>
                        </ul>
                      </ul>
                      <li>
                        (15) Responsibility of Payments: Sender is responsible
                        for all transportation charges and will be billed using
                        a valid credit card via our online billing system.
                        Unless otherwise notified the recipient will be
                        responsible for all charges associated with clearance
                        such as duties and taxes at destination country. SFL
                        Worldwide is not responsible for any fees associated
                        with storage/handling, duties &taxes, customs
                        assessment, governmental penalties and fines, taxes, and
                        legal costs, related to the shipment. Customer (Sender
                        or Recipient) will be responsible for any costs incurred
                        in returning shipment to origin and or storing the
                        shipment at our warehouse at destination country.
                      </li>
                      <ul style={{ listStyleType: "none" }}>
                        <li>
                          a. All charges will be made with a valid credit card
                          (Visa, Master, Discover)
                        </li>
                        <li>
                          b. Shipment charges will be processed once shipment is
                          tendered to SFL Worldwide, LLC and 7 business days
                          after shipment is delivered at destination country.
                        </li>
                        <li>
                          c. Second transaction charge to customer is based on
                          weights and dimension differences at time of invoice
                          by carrier (FedEx, DHL)
                        </li>
                        <li>
                          d. All customers will have access to shipment invoices
                          via the online account on SFL Worldwide LLC’s website
                          www.sflworldwide.com
                        </li>
                        <li>
                          e. All declined, rejected and invalid credit cards
                          will incur a $5 processing fee.
                        </li>
                        <li>
                          f. If payment is not paid in full within 7 business
                          days of service then accounts will be forwarded to a
                          third party collection agency and or legal action will
                          be pursued with costs associated with legal fees and
                          attorney fees incurred by customer.
                        </li>
                      </ul>
                      <li>(16) Claims:</li>
                      <ul style={{ listStyleType: "none" }}>
                        <li>
                          A. We must receive notice of a claim due to damage
                          (visible or concealed), delay (including spoilage
                          claims) or shortage within 21 calendar days after
                          delivery of the shipment. We must receive notice of
                          all other claims, including, but not limited to,
                          claims for nondelivery or misdelivery, within 30 days
                          after the package was tendered to SFL Worldwide LLC
                          for shipment.
                        </li>
                        <li>
                          B. Notice of claims for which you are seeking more
                          than US$100 must be in writing. All claims must be
                          made within the time limits set forth above.
                        </li>
                        <li>
                          C. Your notice of claim must include complete shipper
                          and recipient information, as well as the SFL
                          Worldwide LLC tracking number, date of shipment,
                          number of pieces, and shipment weight. Failure to
                          provide us with notice in the manner and within the
                          time limits set forth in paragraphs (A) through (B)
                          will result in denial of your claim, and we will have
                          no liability or obligation to pay your claim. The
                          filing of a lawsuit does not constitute compliance
                          with these notice provisions.
                        </li>
                        <li>
                          D. Written documentation supporting the amount of your
                          claim must be delivered to us within 30 days after the
                          package was tendered to SFL Worldwide LLC for
                          shipment. Such documentation may include original
                          purchase invoices, estimates or invoices for repair,
                          expense statements, appraisals, final confirmation
                          screen if online order with proof of purchase, or
                          other records. These documents must be verifiable to
                          our satisfaction.
                        </li>
                        <li>
                          E. We are not obligated to act on any claim until all
                          transportation charges have been paid. The claim
                          amount may not be deducted from these charges or from
                          any outstanding balance owed to us.
                        </li>
                        <li>
                          F. SFL Worldwide LLC reserves the right to inspect a
                          damaged shipment on the recipient's premises as well
                          as the right to retrieve the damaged package for
                          inspection at a SFL Worldwide LLC facility. The terms
                          and conditions applicable to the original shipment
                          (including any declared value) will govern the
                          disposition of all claims in connection with the
                          shipment, including any claim relative to the
                          retrieval, inspection or return of the package. All of
                          the original shipping cartons, packing and contents
                          must be made available for our inspection and retained
                          until the claim is concluded.
                        </li>
                        <li>
                          G. Except in the case of concealed damage, receipt of
                          the shipment by the recipient without written notice
                          of damage on the air waybill is prima facie evidence
                          that the shipment was delivered in good condition.
                        </li>
                        <li>
                          H. We do not accept claims from customers whose
                          packages were sent through a package consolidator.
                        </li>
                        <li>
                          I. Only one claim can be filed in connection with a
                          shipment. Acceptance of payment of a claim shall
                          extinguish any right to recover in connection with
                          that shipment.
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
                          L. The normal claim processing times varies case by
                          case basis. Customer(s) will be contacted once claim
                          has been approved or rejected. If approved, a check
                          will be sent to customer via mail/courier.
                        </li>
                      </ul>
                      <li>
                        (17) Right to inspect: We reserve the right to inspect
                        your shipment to ensure proper packing and check for any
                        prohibited items. Any item that violates the prohibited
                        items list will be removed and returned to sender at
                        time of inspection. Customer will be responsible for
                        charges that might be incurred in returning item. Your
                        shipment may also be inspected upon arrival at
                        destination country and by Customs officials.
                      </li>
                      <li>
                        (18) Customs Clearance: All shipments that cross
                        international borders must be cleared through customs
                        and you may also be required to provide additional
                        information to obtain clearance from other regulatory
                        agencies in the destination country prior to delivery to
                        the recipient.
                      </li>
                      <ul style={{ listStyleType: "none" }}>
                        <li>
                          A. Except as provided under the SFL Worldwide LLC and
                          or affiliate agents will submit shipments to customs
                          and other regulatory agencies for clearance. Duties
                          and taxes or fees that may be assessed by any
                          regulatory agency may be advanced on behalf of the
                          sender and recipient provided appropriate credit
                          arrangements have been made in advance. SFL Worldwide
                          LLC and or affiliate agents may charge an ancillary
                          clearance service fee, where applicable, on
                          international shipments for clearance processing, for
                          services requested by the shipper, recipient or
                          importer of record, or to recover the costs passed to
                          SFL Worldwide LLC by the regulatory agency for
                          regulatory filing. The types and amounts of fees vary
                          by country.
                        </li>
                        <li>
                          B. In some instances, at our option, we accept
                          instructions from recipients to use a designated
                          customs broker other than SFL Worldwide LLC (or the
                          broker selected by carrier or affiliate agents) or the
                          broker designated by the shipper. In any event, SFL
                          Worldwide LLC(or the broker selected by carrier and or
                          affiliate agents) reserves the right to clear the
                          shipment if the broker cannot be determined or will
                          not perform clearance or if complete broker
                          information is not provided (including name, address,
                          phone number and postal code).
                        </li>
                        <li>
                          C. When shipments are held by customs or other
                          agencies due to incorrect or missing documentation, we
                          may attempt first to notify the recipient. If local
                          law requires the correct information or documentation
                          to be submitted by the recipient and the recipient
                          fails to do so within a reasonable time as we may
                          determine, the shipment may be considered
                          undeliverable. If the recipient fails to supply the
                          required information or documentation, and local law
                          allows the sender to provide the same, we may attempt
                          to notify the sender. If the sender also fails to
                          provide the information or documentation within a
                          reasonable time as we may determine, the shipment will
                          be considered undeliverable. We assume no
                          responsibility for our inability to complete a
                          delivery due to incorrect or missing documentation,
                          whether or not we attempt to notify the recipient or
                          sender.
                        </li>
                        <li>
                          D. Shipments requiring documentation in addition to
                          the SFL Worldwide LLC Air Waybill, the delivery (e.g.,
                          a Commercial Invoice) may require additional transit
                          time. Proper completion of necessary documentation,
                          with complete and accurate shipment information,
                          including the appropriate Harmonized Tariff Schedule
                          Code, is the shipper's responsibility.
                        </li>
                        <li>
                          E. Shipments that contain goods or products that are
                          regulated by multiple government agencies within the
                          destination country (such as the Department of
                          Agriculture, the Food and Drug Administration, the
                          Fish and Wildlife Service and the Federal
                          Communications Commission in the U.S. and comparable
                          agencies in the destination country) may require
                          additional time for clearance.
                        </li>
                        <li>
                          F. The sender is responsible for making sure goods
                          shipped internationally are acceptable for entry into
                          the destination country. All charges for shipment to
                          and return from countries where entry is not permitted
                          are the sender's responsibility.
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
                          I. For shipments that must be cleared through customs
                          by the recipient, SFL Worldwide LLC and affiliated
                          carrier agents can deliver the customs paperwork to
                          the recipient, and delivery of paperwork constitutes
                          timely delivery.
                        </li>
                      </ul>
                      <li>
                        (19) Delayed Shipments: We will make every effort to
                        deliver your shipment according to our regular delivery
                        schedules. However, SFL Worldwide LLC is not liable for
                        any delays caused by inclement weather, airlines,
                        customs, traffic, political agendas, national holidays,
                        state holidays, and religious holidays. Delays can also
                        occur due to customer not available at destination to
                        receive the parcel. Customer will be responsible for any
                        demurrage/storage fees incurred if shipment is held for
                        a period of time at shipping warehouse until recipient
                        can be contacted for delivery arrangements.
                      </li>
                      <li>
                        (20) SFL Worldwide, LLC is not liable for shipments
                        lost, mis-delivered, damage due to circumstances beyond
                        our control. This include but not limited to:
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
                          Worldwide. For example, the sender of the shipment,
                          the receiver, an interested third party, customs or
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
                        following, whether they arise in contractor any other
                        form of civil action, including negligence, and even if
                        they are our fault:
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
                          value of the documents or parcel. This does not
                          include any commercial utility or special value to the
                          shipper or any other person
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
                          c. Parcels (meaning any shipment with commercial
                          value)
                        </li>
                        <li>
                          d. The cost of repairing or replacing the parcel, or
                        </li>
                        <li>
                          e. The resale of fair market value of the parcel
                        </li>
                        <li>
                          f. The actual value of a parcel cannot be more than
                          original cost to you plus 10%
                        </li>
                      </ul>
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>
            </GridItem>
            <Button onClick={this.postScheduleShipment}>
              Schedule Shipment
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles()(Scheduleshipmentnew);
