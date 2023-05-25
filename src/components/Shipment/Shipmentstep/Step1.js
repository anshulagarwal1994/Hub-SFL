/*eslint-disable*/
import React, { Component } from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import TextField from "@material-ui/core/TextField";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import { CommonConfig } from "../../../utils/constant";
import SimpleBackdrop from "../../../utils/general";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import FormControl from "@material-ui/core/FormControl";
import api from "../../../utils/apiClient";
import Autocomplete from "@material-ui/lab/Autocomplete";

// material ui icons

const useStyles = makeStyles(styles);
const classes = () => {
  return useStyles();
};

class Step1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CountryList: [],
      FromAddress: {},
      ToAddress: {},
      selectedFromCountry: {},
      selectedToCountry: {},
      YesNo: [{ value: true, label: "Yes" }, { value: false, label: "No" }],
      FromMovingBack: false,
      FromEligibleForTR: false,
      FromOriginalPassortAvailable: false,
      ShipmentType: "",
      fromCityAutoComplete: false,
      fromStateAutoComplete: false,
      fromGoogleAPICityList: [],
      fromStateList: [],

      toCityAutoComplete: false,
      toStateAutoComplete: false,
      toGoogleAPICityList: [],
      toStateList: [],

      fromState: "",
      fromCity: "",
    };
  }

  componentWillReceiveProps(nextProps) {
    // console.log("nextProps",nextProps);
  }

  async componentDidMount() {
    await this.getCountry();
    await this.getAddressDetails();
  }

  toStates(countryData) {
    try {
      let data = {
        countryId: countryData.value,
      };

      api
        .post("location/getStateList", data)
        .then((res) => {
          if (res.success) {
            this.setState({
              toStateList: res.data,
              toStateAutoComplete: res.data.length ? true : false,
            });
          }
        })
        .catch((err) => {
          console.log("err...", err);
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {}
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

  showLoader() {}

  hideLoader() {}

  sendState() {
    return this.state;
  }

  getAddressDetails() {
    try {
      let data = {
        ShippingID: this.props.history.location.state.ShipppingID,
      };
      api
        .post("scheduleshipment/getShipmentByID", data)
        .then((res) => {
          if (res.success) {
            if (res.data.length) {
              let fromRes = res.data.filter(
                (x) => x.EntityType === "FromAddress"
              );
              let toRes = res.data.filter((x) => x.EntityType === "ToAddress");
              var fromCountry = this.state.CountryList.filter(
                (x) => x.CountryID === fromRes[0].CountryID
              );
              var toCountry = this.state.CountryList.filter(
                (x) => x.CountryID === toRes[0].CountryID
              );
              var selectedFromCountry = {
                value: fromCountry[0].CountryID,
                label: fromCountry[0].CountryName,
              };
              var selectedToCountry = {
                value: toCountry[0].CountryID,
                label: toCountry[0].CountryName,
              };
              var fromMovingBack = {
                value: fromRes[0].MovingBack.data[0] === 0 ? false : true,
                label: fromRes[0].MovingBack.data[0] === 0 ? "No" : "Yes",
              };
              var fromEligibleForTr = {
                value: fromRes[0].EligibleForTR.data[0] === 0 ? false : true,
                label: fromRes[0].EligibleForTR.data[0] === 0 ? "No" : "Yes",
              };
              var fromOriginalPassortAvailable = {
                value:
                  fromRes[0].OriginalPassportAvailable.data[0] === 0
                    ? false
                    : true,
                label:
                  fromRes[0].OriginalPassportAvailable.data[0] === 0
                    ? "No"
                    : "Yes",
              };
              this.setState({
                FromAddress: fromRes[0],
                ToAddress: toRes[0],
                ShipmentType: fromRes[0].ShipmentType,
                FromMovingBack: fromMovingBack,
                FromEligibleForTR: fromEligibleForTr,
                FromOriginalPassortAvailable: fromOriginalPassortAvailable,
                selectedFromCountry: selectedFromCountry,
                selectedToCountry: selectedToCountry,
              });
              this.getStates(selectedFromCountry);
              this.toStates(selectedToCountry);
              this.senderZipChange(fromRes[0].ZipCode);
              this.recipientZipChange(toRes[0].ZipCode);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error...", err);
    }
  }

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
          // cogoToast.error("Something Went Wrong");
        });
    } catch (error) {}
  }

  selectChange = (event, value, type) => {
    if (type === "FromCountry") {
      this.setState({
        selectedFromCountry: value,
        fromCity: "",
        fromState: "",
      });
      this.getStates(value);
    } else if (type === "ToCountry") {
      this.setState({ selectedToCountry: value, toCity: "", toState: "" });
      this.toStates(value);
    } else if (type === "MovingBack") {
      this.setState({ FromMovingBack: value });
    } else if (type === "PassportAvailable") {
      this.setState({ FromOriginalPassortAvailable: value });
    } else if (type === "EligibleTR") {
      this.setState({ FromEligibleForTR: value });
    }
  };

  handleChangeFrom = (event, type) => {
    if (type === "companyname") {
      let fromAddress = this.state.FromAddress;
      fromAddress.CompanyName = event.target.value;
      this.setState({ FromAddress: fromAddress });
    } else if (type === "contactname") {
      let fromAddress = this.state.FromAddress;
      fromAddress.ContactName = event.target.value;
      this.setState({ FromAddress: fromAddress });
    } else if (type === "address1") {
      let fromAddress = this.state.FromAddress;
      fromAddress.AddressLine1 = event.target.value;
      this.setState({ FromAddress: fromAddress });
    } else if (type === "address2") {
      let fromAddress = this.state.FromAddress;
      fromAddress.AddressLine2 = event.target.value;
      this.setState({ FromAddress: fromAddress });
    } else if (type === "address3") {
      let fromAddress = this.state.FromAddress;
      fromAddress.AddressLine3 = event.target.value;
      this.setState({ FromAddress: fromAddress });
    } else if (type === "zip") {
      let fromAddress = this.state.FromAddress;
      fromAddress.ZipCode = event.target.value;
      this.setState({ FromAddress: fromAddress });
    } else if (type === "phone1") {
      let fromAddress = this.state.FromAddress;
      fromAddress.Phone1 = event.target.value;
      this.setState({ FromAddress: fromAddress });
    } else if (type === "phone2") {
      let fromAddress = this.state.FromAddress;
      fromAddress.Phone2 = event.target.value;
      this.setState({ FromAddress: fromAddress });
    } else if (type === "email") {
      let fromAddress = this.state.FromAddress;
      fromAddress.Email = event.target.value;
      this.setState({ FromAddress: fromAddress });
    }
  };

  handleChangeTo = (event, type) => {
    if (type === "companyname") {
      let toAddress = this.state.ToAddress;
      toAddress.CompanyName = event.target.value;
      this.setState({ ToAddress: toAddress });
    } else if (type === "contactname") {
      let toAddress = this.state.ToAddress;
      toAddress.ContactName = event.target.value;
      this.setState({ ToAddress: toAddress });
    } else if (type === "address1") {
      let toAddress = this.state.ToAddress;
      toAddress.AddressLine1 = event.target.value;
      this.setState({ ToAddress: toAddress });
    } else if (type === "address2") {
      let toAddress = this.state.ToAddress;
      toAddress.AddressLine2 = event.target.value;
      this.setState({ ToAddress: toAddress });
    } else if (type === "address3") {
      let toAddress = this.state.ToAddress;
      toAddress.AddressLine3 = event.target.value;
      this.setState({ ToAddress: toAddress });
    } else if (type === "zip") {
      let toAddress = this.state.ToAddress;
      toAddress.ZipCode = event.target.value;
      this.setState({ ToAddress: toAddress });
    } else if (type === "phone1") {
      let toAddress = this.state.ToAddress;
      toAddress.Phone1 = event.target.value;
      this.setState({ ToAddress: toAddress });
    } else if (type === "phone2") {
      let toAddress = this.state.ToAddress;
      toAddress.Phone2 = event.target.value;
      this.setState({ ToAddress: toAddress });
    } else if (type === "email") {
      let toAddress = this.state.ToAddress;
      toAddress.Email = event.target.value;
      this.setState({ ToAddress: toAddress });
    }
  };

  senderZipChange = (zip) => {
    if (zip.length) {
      fetch(
        CommonConfig.zipCodeAPIKey(zip, this.state.selectedFromCountry.label)
      )
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

              if (countryShortName === this.state.selectedFromCountry.label) {
                this.setState({
                  fromCityAutoComplete: FinalCity.length ? true : false,
                  fromStateAutoComplete: this.state.fromStateList.length
                    ? true
                    : false,
                  fromGoogleAPICityList: FinalCity,
                  fromState: this.state.fromStateList.length
                    ? SelectedState
                    : state,
                  fromCity: SelectedCity,
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

              if (countryShortName === this.state.selectedFromCountry.label) {
                this.setState({
                  fromCityAutoComplete: FinalCity.length ? true : false,
                  fromStateAutoComplete: this.state.fromStateList.length
                    ? true
                    : false,
                  fromGoogleAPICityList: FinalCity,
                  fromState: this.state.fromStateList.length
                    ? SelectedState
                    : state,
                  fromCity: SelectedCity,
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
            }
          } else {
            cogoToast.error("Zip code not found");
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
        });
    }
  };

  recipientZipChange = (zip) => {
    if (zip.length) {
      fetch(CommonConfig.zipCodeAPIKey(zip, this.state.selectedToCountry.label))
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

              if (countryShortName === this.state.selectedToCountry.label) {
                this.setState({
                  toCityAutoComplete: FinalCity.length ? true : false,
                  toStateAutoComplete: this.state.toStateList.length
                    ? true
                    : false,
                  toGoogleAPICityList: FinalCity,
                  toState: this.state.toStateList.length
                    ? SelectedState
                    : state,
                  toCity: SelectedCity,
                });
              } else {
                this.setState({
                  toCityAutoComplete: false,
                  toStateAutoComplete: this.state.toStateList.length
                    ? true
                    : false,
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

              if (countryShortName === this.state.selectedToCountry.label) {
                this.setState({
                  toCityAutoComplete: FinalCity.length ? true : false,
                  toStateAutoComplete: this.state.toStateList.length
                    ? true
                    : false,
                  toGoogleAPICityList: FinalCity,
                  toState: this.state.toStateList.length
                    ? SelectedState
                    : state,
                  toCity: SelectedCity,
                });
              } else {
                this.setState({
                  toCityAutoComplete: false,
                  toStateAutoComplete: this.state.toStateList.length
                    ? true
                    : false,
                  toGoogleAPICityList: [],
                  toState: "",
                  toCity: "",
                });
              }
            }
          } else {
            cogoToast.error("Zip code not found");
            this.setState({
              toCityAutoComplete: false,
              toStateAutoComplete: this.state.toStateList.length ? true : false,
              toGoogleAPICityList: [],
              toState: "",
              toCity: "",
            });
          }
        });
    }
  };

  handleBlur = (event, type) => {
    if (type === "FromZipCode") {
      let Fromaddress = this.state.FromAddress;
      Fromaddress.ZipCode = event.target.value;
      this.setState({ FromAddress: Fromaddress });
      this.senderZipChange(event.target.value);
    } else if (type === "ToZipCode") {
      let toAddress = this.state.ToAddress;
      toAddress.ZipCode = event.target.value;
      this.setState({ ToAddress: toAddress });
      this.recipientZipChange(event.target.value);
    }
  };

  ChangeToCity = (event, value) => {
    if (value != null) {
      this.setState({ toCity: value });
    }
  };

  ChangeToState = (event, value) => {
    if (value != null) {
      this.setState({ toState: value });
    }
  };

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

  handleSave = (allStates) => {
    console.log("Step1.......", allStates);
  };

  render() {
    const {
      selectedFromCountry,
      selectedToCountry,
      FromAddress,
      ToAddress,
      YesNo,
      fromState,
      fromCity,
      toCity,
      toState,
      FromMovingBack,
      FromEligibleForTR,
      FromOriginalPassortAvailable,
    } = this.state;

    const CountryOption = this.state.CountryList.map((Country) => {
      return { value: Country.CountryID, label: Country.CountryName };
    });
    const fromCityOptions = this.state.fromGoogleAPICityList.map((city) => {
      return { value: city.City_code, label: city.Name };
    });
    const fromStateOptions = this.state.fromStateList.map((state) => {
      return { value: state.StateName, label: state.StateName };
    });
    const toCityOptions = this.state.toGoogleAPICityList.map((city) => {
      return { value: city.City_code, label: city.Name };
    });
    const toStateOptions = this.state.toStateList.map((state) => {
      return { value: state.StateName, label: state.StateName };
    });

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <h4>Sender Information</h4>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <FormControl fullWidth>
              <Autocomplete
                options={CountryOption}
                id="FromCountry"
                getOptionLabel={(option) =>
                  option.label ? option.label : option
                }
                value={selectedFromCountry}
                autoSelect
                onChange={(event, value) =>
                  this.selectChange(event, value, "FromCountry")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={this.state.pickupcountryErr}
                    helperText={this.state.pickupcountryHelperText}
                    label="From Country"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="Company Name"
              id="proposaltype"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                value: FromAddress.CompanyName,
                onChange: (event) =>
                  this.handleChangeFrom(event, "companyname"),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className={classes.User}>assignment_ind</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="Contact Name"
              id="proposaltype"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                value: FromAddress.ContactName,
                onChange: (event) =>
                  this.handleChangeFrom(event, "contactname"),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className={classes.User}>perm_identity</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer className="MuiGrid-justify-xs-center">
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="Address Line 1"
              id="proposaltype"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                value: FromAddress.AddressLine1,
                onChange: (event) => this.handleChangeFrom(event, "address1"),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className={classes.User}>location_on</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="Address Line 2"
              id="proposaltype"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                value: FromAddress.AddressLine2,
                onChange: (event) => this.handleChangeFrom(event, "address2"),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className={classes.User}>location_on</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="Address Line 3"
              id="proposaltype"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                value: FromAddress.AddressLine3,
                onChange: (event) => this.handleChangeFrom(event, "address3"),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className={classes.User}>language</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer className="MuiGrid-justify-xs-center">
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="Zip"
              id="proposaltype"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                value: FromAddress.ZipCode,
                onChange: (event) => this.handleChangeFrom(event, "zip"),
                onBlur: (event) => this.handleBlur(event, "FromZipCode"),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className={classes.User}>local_post_office</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            {this.state.fromCityAutoComplete === false ? (
              <CustomInput
                labelText="City"
                id="city"
                // error={fromCityErr}
                // helperText={fromCityHelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: fromCity,
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
                      <Icon>location_city</Icon>
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
                onChange={(event, value) => this.ChangeFromCity(event, value)}
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
            {/* <CustomInput
                            labelText="City"
                            id="proposaltype"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                value:FromAddress.City,
                               onChange: event => this.handleChangeFrom(event,"city"),
                                endAdornment: (
                                    <InputAdornment position="end" className={classes.inputAdornment}>
                                        <Icon className={classes.User}>
                                            location_city
                                        </Icon>
                                    </InputAdornment>
                                )
                            }}
                        /> */}
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            {this.state.fromStateAutoComplete === false ? (
              <CustomInput
                labelText="State"
                id="state"
                // error={fromStateErr}
                // helperText={fromStateHelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: fromState,
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
                      <Icon>location_city</Icon>
                    </InputAdornment>
                  ),
                }}
              />
            ) : (
              <Autocomplete
                options={fromStateOptions}
                id="fromState"
                autoSelect
                getOptionLabel={(option) => option.label}
                value={fromState}
                onChange={(event, value) => this.ChangeFromState(event, value)}
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
            {/* <CustomInput
                            labelText="State"
                            id="proposaltype"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                value:FromAddress.State,
                                onChange: event => this.handleChangeFrom(event,"state"),
                                endAdornment: (
                                    <InputAdornment position="end" className={classes.inputAdornment}>
                                        <Icon className={classes.User}>
                                            map
                                        </Icon>
                                    </InputAdornment>
                                )
                            }}
                        /> */}
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="Phone 1"
              id="proposaltype"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                value: FromAddress.Phone1,
                onChange: (event) => this.handleChangeFrom(event, "phone1"),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className={classes.User}>call</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="Phone 2"
              id="proposaltype"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                value: FromAddress.Phone2,
                onChange: (event) => this.handleChangeFrom(event, "phone2"),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className={classes.User}>call</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="Email"
              id="registeremail"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                value: FromAddress.Email,
                onChange: (event) => this.handleChangeFrom(event, "email"),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className={classes.inputAdornmentIcon}>email</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
        </GridContainer>
        {this.state.ShipmentType === "Ocean" ? (
          <GridContainer className="MuiGrid-justify-xs-center">
            <GridItem xs={12} sm={12} md={4}>
              <FormControl fullWidth>
                <Autocomplete
                  options={YesNo}
                  id="FromCountry"
                  getOptionLabel={(option) =>
                    option.label ? option.label : option
                  }
                  value={FromMovingBack}
                  autoSelect
                  onChange={(event, value) =>
                    this.selectChange(event, value, "MovingBack")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={this.state.pickupcountryErr}
                      helperText={this.state.pickupcountryHelperText}
                      label="Moving Back ?"
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <FormControl fullWidth>
                <Autocomplete
                  options={YesNo}
                  id="FromCountry"
                  getOptionLabel={(option) =>
                    option.label ? option.label : option
                  }
                  value={FromOriginalPassortAvailable}
                  autoSelect
                  onChange={(event, value) =>
                    this.selectChange(event, value, "PassportAvailable")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={this.state.pickupcountryErr}
                      helperText={this.state.pickupcountryHelperText}
                      label="Original Passport Avaliable ?"
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <FormControl fullWidth>
                <Autocomplete
                  options={YesNo}
                  id="FromCountry"
                  getOptionLabel={(option) =>
                    option.label ? option.label : option
                  }
                  value={FromEligibleForTR}
                  autoSelect
                  onChange={(event, value) =>
                    this.selectChange(event, value, "EligibleTR")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={this.state.pickupcountryErr}
                      helperText={this.state.pickupcountryHelperText}
                      label="Eligible for TR ?"
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
              </FormControl>
            </GridItem>
          </GridContainer>
        ) : null}
        <GridContainer className="mt-20">
          <GridItem xs={12} sm={12} md={4}>
            <h4>Receipent Details</h4>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <FormControl fullWidth>
              <Autocomplete
                options={CountryOption}
                id="ToCountry"
                getOptionLabel={(option) =>
                  option.label ? option.label : option
                }
                value={selectedToCountry}
                autoSelect
                onChange={(event, value) =>
                  this.selectChange(event, value, "ToCountry")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={this.state.pickupcountryErr}
                    helperText={this.state.pickupcountryHelperText}
                    label="To Country"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="Company Name"
              id="proposaltype"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                value: ToAddress.CompanyName,
                onChange: (event) => this.handleChangeTo(event, "companyname"),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className={classes.User}>assignment_ind</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="Contact Name"
              id="proposaltype"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                value: ToAddress.ContactName,
                onChange: (event) => this.handleChangeTo(event, "contactname"),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className={classes.User}>perm_identity</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer className="MuiGrid-justify-xs-center">
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="Address Line 1"
              id="proposaltype"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                value: ToAddress.AddressLine1,
                onChange: (event) => this.handleChangeTo(event, "address1"),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className={classes.User}>location_on</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="Address Line 2"
              id="proposaltype"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                value: ToAddress.AddressLine2,
                onChange: (event) => this.handleChangeTo(event, "address2"),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className={classes.User}>location_on</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="Address Line 3"
              id="proposaltype"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                value: ToAddress.AddressLine3,
                onChange: (event) => this.handleChangeTo(event, "address3"),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className={classes.User}>language</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer className="MuiGrid-justify-xs-center">
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="Zip"
              id="proposaltype"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                value: ToAddress.ZipCode,
                onChange: (event) => this.handleChangeTo(event, "zip"),
                onBlur: (event) => this.handleBlur(event, "ToZipCode"),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className={classes.User}>local_post_office</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            {this.state.toCityAutoComplete === false ? (
              <CustomInput
                labelText="City"
                id="city"
                // error={toCityErr}
                // helperText={toCityHelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: toCity,
                  onBlur: (event) => this.handleBlur(event, "tocity"),
                  onChange: (event) => this.handleChange(event, "tocity"),
                  onFocus: (event) =>
                    this.setState({ toCityErr: false, toCityHelperText: "" }),
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
                options={toCityOptions}
                id="tocity"
                autoSelect
                getOptionLabel={(option) => option.label}
                value={toCity}
                onChange={(event, value) => this.ChangeToCity(event, value)}
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
            {/* <CustomInput
                            labelText="City"
                            id="proposaltype"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                value:ToAddress.City,
                                onChange: event => this.handleChangeTo(event,"city"),
                                endAdornment: (
                                    <InputAdornment position="end"  className={classes.inputAdornment}>
                                        <Icon className={classes.User}>
                                            location_city
                                        </Icon>
                                    </InputAdornment>
                                )
                            }}
                        /> */}
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            {this.state.toStateAutoComplete === false ? (
              <CustomInput
                labelText="State"
                id="state"
                // error={toStateErr}
                // helperText={toStateHelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: toState,
                  onBlur: (event) => this.handleBlur(event, "tostate"),
                  onChange: (event) => this.handleChange(event, "tostate"),
                  onFocus: (event) =>
                    this.setState({ toStateErr: false, toStateHelperText: "" }),
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
                options={toStateOptions}
                id="toState"
                autoSelect
                getOptionLabel={(option) => option.label}
                value={toState}
                onChange={(event, value) => this.ChangeToState(event, value)}
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
            {/* <CustomInput
                            labelText="State"
                            id="proposaltype"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                value:ToAddress.State,
                                onChange: event => this.handleChangeTo(event,"state"),
                                endAdornment: (
                                    <InputAdornment  position="end" className={classes.inputAdornment}>
                                        <Icon className={classes.User}>
                                            map
                                        </Icon>
                                    </InputAdornment>
                                )
                            }}
                        /> */}
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="Phone 1"
              id="proposaltype"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                value: ToAddress.Phone1,
                onChange: (event) => this.handleChangeTo(event, "phone1"),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className={classes.User}>call</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="Phone 2"
              id="proposaltype"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                value: ToAddress.Phone2,
                onChange: (event) => this.handleChangeTo(event, "phone2"),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className={classes.User}>call</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText="Email"
              id="registeremail"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                value: ToAddress.Email,
                onChange: (event) => this.handleChangeTo(event, "email"),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    className={classes.inputAdornment}
                  >
                    <Icon className={classes.inputAdornmentIcon}>email</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Step1.propTypes = {
  classes: PropTypes.object,
};

export default withStyles()(Step1);
