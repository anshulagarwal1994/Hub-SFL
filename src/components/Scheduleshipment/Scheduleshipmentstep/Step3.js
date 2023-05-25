/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import Autocomplete from "@material-ui/lab/Autocomplete";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import TextField from "@material-ui/core/TextField";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Datetime from "react-datetime";
import moment from "moment";
import FormControl from "@material-ui/core/FormControl";
import Icon from "@material-ui/core/Icon";
import api from "../../../utils/apiClient";
import { CommonConfig } from "../../../utils/constant";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import cogoToast from "cogo-toast";
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

      toCountryID: 0,
      toCountryName: "",
      toCountryCode: "",
      toCompanyName: "",
      toCompanyNameErr: false,
      toCompanyNameHelperText: "",
      ToSelectedCountry: {},

      toFedexCityList: [],
      toFedExCity: "",
      ToFedExSelectedCity: {},
      toFedexCityError: false,
      toFedexCityHelperText: "",
      isFedexFromWordpress: false,
      isZipAvailable: false,

      getRate: {},

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

      toCityAutoComplete: false,
      toStateAutoComplete: false,
      toGoogleAPICityList: [],
      toStateList: [],

      SelectedLocationType: "Residential",
      locationTypeErr: false,
      loactionTypeHelperText: "",

      location_type: [
        { value: "Residential", label: "Residential" },
        { value: "Commercial", label: "Commercial" },
      ],
      disableGetrate: false,
      disabletoZipcode: false,
      disabletoCity: false,
      disabletoState: false,
      pickup_type: [
        { value: 1, label: "Yes - Additional Charge may apply" },
        { value: 0, label: "No - I will Drop off my Package" },
      ],
      pickup_type_ocean: [
        { value: 1, label: "Yes" },
        { value: 0, label: "No - I will Drop off my Package" },
      ],
      selectedPickupType: "0",
      IsPickUp: false,
      DoyouNeedPickup: "",
      valid: moment().toDate(),
      pickUpDate: moment().toDate(),
      pickupDateErr: false,
      isDateChanged: false,
      pickupDateHelperText: "",
      isDisableFields: false,
      toisSkip: false,
      ToZipcodeOptional: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    var yesterday = this.state.pickUpDate;
    var valid = function(current) {
      return (
        current.day() !== 0 && current.day() !== 6 && current.isAfter(yesterday)
      );
    };
    this.setState({ valid: valid });

    if (
      nextProps &&
      nextProps.allStates !== null &&
      nextProps.allStates.schedulepickup
    ) {
      this.changeToContry(nextProps.allStates.schedulepickup);
      // if (nextProps.allStates.schedulepickup.ToFedExCityList.length > 0) {

      // } else {
      //   this.setState({ toFedexCityList: [] });
      // }
    }

    if (
      nextProps.props.location.state !== undefined &&
      nextProps.props.location.state != null
    ) {
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
            this.setState({ toisSkip: true });
          }
        }
      }
      this.setState({
        toZipCode: nextProps.props.location.state.GetRateData.UpsData.ToZipCode,
        SelectedLocationType:
          nextProps.props.location.state.GetRateData.IsResidencial == true
            ? "Residential"
            : "Commercial",
        disableGetrate: true,
        disabletoZipcode: true,
        disabletoCity: true,
        disabletoState: true,
        isDisableFields: true,
        toZipCodeErr: false,
        toZipCodeHelperText: "",
      });

      if (
        nextProps.props.location.state.GetRateData.UpsData.ToZipCode &&
        (JSON.parse(
          nextProps.props.location.state.GetRateData.UpsData.ToCountry
        ).IsFedexCity === 0 &&
          JSON.parse(
            nextProps.props.location.state.GetRateData.UpsData.ToCountry
          ).IsUpsCity !== 1)
      ) {
        this.setState({
          toCity: nextProps.props.location.state.GetRateData.UpsData.ToCity,
          disabletoCity: false,
          isDisableFields: true,
          disabletoState: false,
        });
        this.recipientZipChange(
          nextProps.props.location.state.GetRateData.UpsData.ToZipCode
        );
      } else {
        this.setState({
          disabletoZipcode: false,
          disabletoCity: true,
          isDisableFields: true,
          disabletoState: false,
          toCity: nextProps.props.location.state.GetRateData.UpsData.ToFedExCity
            .label
            ? nextProps.props.location.state.GetRateData.UpsData.ToFedExCity
                .label
            : nextProps.props.location.state.GetRateData.UpsData.ToUPSCity
                .label,
        });
      }

      if (
        nextProps.props.location.state.GetRateData.UpsData.ToFedExCity &&
        nextProps.props.location.state.MainServiceName === "FedEx" &&
        nextProps.props.location.state.state.GetRate.ToCountry.IsFedexCity === 1
      ) {
        if (
          nextProps.props.location.state.state.GetRate.ToCountry
            .IsZipAvailable == 1
        ) {
          this.setState({ isZipAvailable: true });
        }
        this.setState({
          disabletoZipcode: true,
          disabletoCity: true,
          isDisableFields: true,
          disabletoState: true,
          toCity: "",
          ToFedExSelectedCity:
            nextProps.props.location.state.GetRateData.UpsData.ToFedExCity,
        });
      }

      if (
        nextProps.props.location.state.GetRateData.UpsData.ToUPSCity &&
        nextProps.props.location.state.MainServiceName !== "FedEx" &&
        nextProps.props.location.state.state.GetRate.ToCountry.IsUpsCity === 1
      ) {
        this.setState({
          disabletoZipcode: false,
          disabletoCity: true,
          isDisableFields: true,
          disabletoState: false,
          toCity:
            nextProps.props.location.state.GetRateData.UpsData.ToUPSCity.label,
          ToFedExSelectedCity:
            nextProps.props.location.state.GetRateData.UpsData.ToFedExCity,
        });
      }
      if (nextProps.props.location.state.GetRateData.UpsData) {
        if (
          JSON.parse(
            nextProps.props.location.state.GetRateData.UpsData.ToCountry
          ).ToZipCodeOptional === true
        ) {
          this.setState({
            ToZipcodeOptional: true,
            disabletoZipcode: true,
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
      if (nextProps.allStates.schedulepickup.skipstep2) {
        var SelectedCountry = _.findIndex(
          nextProps.allStates.schedulepickup.CountryList,
          function(country) {
            return (
              country.CountryName ===
              nextProps.allStates.schedulepickup.ToSelectedCountry.label
            );
          }
        );

        var SelectedCountryData =
          nextProps.allStates.schedulepickup.CountryList[SelectedCountry];

        if (SelectedCountryData.IsFedexCity == 1) {
          if (SelectedCountryData.IsZipAvailable) {
            this.setState({ isZipAvailable: true });
          }
          this.setState({
            disabletoZipcode: true,
            disabletoState: true,
            isFedexFromWordpress: true,
          });

          var changeFedexData = {
            label: nextProps.allStates.schedulepickup.UserDetails.ToCity,
            value: nextProps.allStates.schedulepickup.UserDetails.ToCity,
          };

          this.ChangeFromFedexCity(changeFedexData, "FedEx");
        }

        this.setState({
          toCity:
            SelectedCountryData.IsFedexCity == 1
              ? ""
              : nextProps.allStates.schedulepickup.UserDetails.ToCity
              ? nextProps.allStates.schedulepickup.UserDetails.ToCity
              : this.state.toCity,
          ToFedExSelectedCity:
            SelectedCountryData.IsFedexCity == 1 ? changeFedexData : "",
          toFedexCityList: nextProps.allStates.schedulepickup.ToFedExCityList
            ? nextProps.allStates.schedulepickup.ToFedExCityList
            : this.state.toFedExCity,
          toZipCode: nextProps.allStates.schedulepickup.UserDetails.ToZipCode
            ? nextProps.allStates.schedulepickup.UserDetails.ToZipCode
            : this.state.toZipCode,
          toState: nextProps.allStates.schedulepickup.UserDetails.ToState
            ? nextProps.allStates.schedulepickup.UserDetails.ToState
            : this.state.toState,
          disableGetrate:
            nextProps.allStates.schedulepickup.UserDetails.disableGetrate,
          disabletoZipcode:
            SelectedCountryData.IsFedexCity == 1
              ? true
              : nextProps.allStates.schedulepickup.UserDetails.disabletoZipcode,
          disabletoCity:
            nextProps.allStates.schedulepickup.UserDetails.disabletoCity,
          disabletoState:
            SelectedCountryData.IsFedexCity == 1
              ? true
              : nextProps.allStates.schedulepickup.UserDetails.disabletoState,
          isDisableFields:
            nextProps.allStates.schedulepickup.UserDetails.isDisableFields,
        });
        console.log("tostateeee", this.state.toState);
        this.state.toState = nextProps.allStates.schedulepickup.UserDetails
          .ToState
          ? nextProps.allStates.schedulepickup.UserDetails.ToState
          : this.state.toState;
        console.log("tostateeee2", this.state.toState);
        this.state.disableGetrate = nextProps.allStates.schedulepickup
          .UserDetails.disableGetrate
          ? nextProps.allStates.schedulepickup.UserDetails.disableGetrate
          : this.state.disableGetrate;
        this.state.disabletoZipcode = nextProps.allStates.schedulepickup
          .UserDetails.disabletoZipcode
          ? nextProps.allStates.schedulepickup.UserDetails.disabletoZipcode
          : this.state.disabletoZipcode;
        this.state.disabletoCity = nextProps.allStates.schedulepickup
          .UserDetails.disabletoCity
          ? nextProps.allStates.schedulepickup.UserDetails.disabletoCity
          : this.state.disabletoCity;
        this.state.disabletoState = nextProps.allStates.schedulepickup
          .UserDetails.disabletoState
          ? nextProps.allStates.schedulepickup.UserDetails.disabletoState
          : this.state.disabletoState;
        this.state.isDisableFields = nextProps.allStates.schedulepickup
          .UserDetails.isDisableFields
          ? nextProps.allStates.schedulepickup.UserDetails.isDisableFields
          : this.state.isDisableFields;
      }
      let obj = nextProps.allStates.schedulepickup.ToSelectedCountry;

      this.setState({ ToSelectedCountry: obj });
      this.getStates(obj);
    }
  }

  changeToContry(countrydata) {
    if (countrydata.ServiceName == "UPS") {
      if (countrydata.GetRate.ToCountry.IsUpsCity == 1) {
        var CityData = {
          CityType: "UPS",
          CountryId:
            countrydata.GetRate.ToCountry.CountryId != undefined
              ? countrydata.GetRate.ToCountry.CountryId
              : countrydata.ToSelectedCountry.value,
        };

        api
          .post("location/getCityList", CityData)
          .then((res) => {
            if (res.success) {
              if (res.data.length > 0) {
                if (countrydata.GetRate.ToCountry.IsZipAvailable == 0) {
                  this.setState({
                    disabletoZipcode: true,
                    disabletoState: true,
                    toFedexCityList: res.data,
                  });
                  if (this.props.props.location.state != undefined) {
                    this.ChangeFromFedexCity(
                      this.props.props.location.state.GetRateData.UpsData
                        .ToFedExCity,
                      "UPS"
                    );
                  }
                } else {
                  this.setState({
                    disabletoZipcode: false,
                    disabletoState: false,
                    toFedexCityList: res.data,
                  });
                  if (this.props.props.location.state != undefined) {
                    this.ChangeFromFedexCity(
                      this.props.props.location.state.GetRateData.UpsData
                        .ToFedExCity,
                      "UPS"
                    );
                  }
                }
              }
            } else {
              this.setState({ toFedexCityList: [] });
            }
          })
          .catch((err) => {
            this.hideLoader();
            console.log("No FedEx city found", err);
          });
      } else {
        var CityData = {
          CityType: "City",
          CountryId:
            countrydata.GetRate.ToCountry.CountryId != undefined
              ? countrydata.GetRate.ToCountry.CountryId
              : countrydata.ToSelectedCountry.value,
        };

        api
          .post("location/getCityList", CityData)
          .then((res) => {
            if (res.success) {
              if (res.data.length > 0) {
                if (countrydata.GetRate.ToCountry.IsZipAvailable == 0) {
                  this.setState({
                    disabletoZipcode: true,
                    disabletoState: true,
                    toFedexCityList: res.data,
                  });
                  if (this.props.props.location.state != undefined) {
                    this.ChangeFromFedexCity(
                      this.props.props.location.state.GetRateData.UpsData
                        .ToFedExCity,
                      "FedEx"
                    );
                  }
                } else {
                  this.setState({
                    disabletoZipcode: false,
                    disabletoState: false,
                    toFedexCityList: res.data,
                  });
                  if (this.props.props.location.state != undefined) {
                    this.ChangeFromFedexCity(
                      this.props.props.location.state.GetRateData.UpsData
                        .ToFedExCity,
                      "FedEx"
                    );
                  }
                }
              }
            } else {
              this.setState({ toFedexCityList: [] });
            }
          })
          .catch((err) => {
            this.hideLoader();
            console.log("No FedEx city found", err);
          });
      }
    } else if (countrydata.ServiceName == "FedEx") {
      if (countrydata.GetRate.ToCountry.IsFedexCity == 1) {
        var CityData = {
          CityType: "FedEx",
          CountryId:
            countrydata.GetRate.ToCountry.CountryId != undefined
              ? countrydata.GetRate.ToCountry.CountryId
              : countrydata.ToSelectedCountry.value,
        };

        api
          .post("location/getCityList", CityData)
          .then((res) => {
            if (res.success) {
              if (res.data.length > 0) {
                if (countrydata.GetRate.ToCountry.IsZipAvailable == 0) {
                  this.setState({
                    disabletoZipcode: true,
                    disabletoState: true,
                    toFedexCityList: res.data,
                  });
                  if (this.props.props.location.state != undefined) {
                    this.ChangeFromFedexCity(
                      this.props.props.location.state.GetRateData.UpsData
                        .ToFedExCity,
                      "FedEx"
                    );
                  }
                } else {
                  this.setState({
                    disabletoZipcode: false,
                    disabletoState: false,
                    toFedexCityList: res.data,
                  });
                  if (this.props.props.location.state != undefined) {
                    this.ChangeFromFedexCity(
                      this.props.props.location.state.GetRateData.UpsData
                        .ToFedExCity,
                      "FedEx"
                    );
                  }
                }
              }
            } else {
              this.setState({ toFedexCityList: [] });
            }
          })
          .catch((err) => {
            this.hideLoader();
            console.log("No FedEx city found", err);
          });
      } else {
        var CityData = {
          CityType: "City",
          CountryId:
            countrydata.GetRate.ToCountry.CountryId != undefined
              ? countrydata.GetRate.ToCountry.CountryId
              : countrydata.ToSelectedCountry.value,
        };

        api
          .post("location/getCityList", CityData)
          .then((res) => {
            if (res.success) {
              if (res.data.length > 0) {
                if (countrydata.GetRate.ToCountry.IsZipAvailable == 0) {
                  this.setState({
                    disabletoZipcode: true,
                    disabletoState: true,
                    toFedexCityList: res.data,
                  });
                  if (this.props.props.location.state != undefined) {
                    this.ChangeFromFedexCity(
                      this.props.props.location.state.GetRateData.UpsData
                        .ToFedExCity,
                      "FedEx"
                    );
                  }
                } else {
                  this.setState({
                    disabletoZipcode: false,
                    disabletoState: false,
                    toFedexCityList: res.data,
                  });
                  if (this.props.props.location.state != undefined) {
                    this.ChangeFromFedexCity(
                      this.props.props.location.state.GetRateData.UpsData
                        .ToFedExCity,
                      "FedEx"
                    );
                  }
                }
              }
            } else {
              this.setState({ toFedexCityList: [] });
            }
          })
          .catch((err) => {
            this.hideLoader();
            console.log("No FedEx city found", err);
          });
      }
    } else {
      var CityData = {
        CityType: "City",
        CountryId:
          countrydata.GetRate.ToCountry.CountryId != undefined
            ? countrydata.GetRate.ToCountry.CountryId
            : countrydata.ToSelectedCountry.value,
      };

      api
        .post("location/getCityList", CityData)
        .then((res) => {
          if (res.success) {
            if (res.data.length > 0) {
              if (countrydata.GetRate.ToCountry.IsZipAvailable == 0) {
                this.setState({
                  disabletoZipcode: true,
                  disabletoState: true,
                  toFedexCityList: res.data,
                });
                if (this.props.props.location.state != undefined) {
                  this.ChangeFromFedexCity(
                    this.props.props.location.state.GetRateData.UpsData
                      .ToFedExCity,
                    "FedEx"
                  );
                }
              } else {
                this.setState({
                  disabletoZipcode: false,
                  disabletoState: false,
                  toFedexCityList: res.data,
                });
                if (this.props.props.location.state != undefined) {
                  this.ChangeFromFedexCity(
                    this.props.props.location.state.GetRateData.UpsData
                      .ToFedExCity,
                    "FedEx"
                  );
                }
              }
            }
          } else {
            this.setState({ toFedexCityList: [] });
          }
        })
        .catch((err) => {
          this.hideLoader();
          console.log("No FedEx city found", err);
        });
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
            this.setState({
              toStateList: res.data,
              toStateAutoComplete: res.data.length ? true : false,
            });
            // if (this.state.disabletoZipcode == false) {
            //   this.recipientZipChange(this.state.toZipCode);
            // }
          }
        })
        .catch((err) => {
          console.log("err...", err);
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {}
  }

  handleSimple = (event) => {
    this.setState({ simpleSelect: event.target.value });
  };

  sendState() {
    return this.state;
  }

  recipientZipChange = (zip) => {
    if (this.state.ToSelectedCountry.value !== 107) {
      if (zip.length && (!this.state.isDisableFields || !this.state.isSkip)) {
        fetch(
          CommonConfig.zipCodeAPIKey(zip, this.state.ToSelectedCountry.label)
        )
          .then((result) => result.json())
          .then((data) => {
            if (data["status"] === "OK") {
              // this.setState({disabletoZipcode:true,disabletoCity:true,disabletoState:true});
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

                if (countryShortName === this.state.ToSelectedCountry.label) {
                  debugger;
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

                if (countryShortName === this.state.ToSelectedCountry.label) {
                  debugger;
                  this.setState({
                    toCityAutoComplete: FinalCity.length ? true : false,
                    toStateAutoComplete: this.state.toStateList.length
                      ? true
                      : false,
                    toGoogleAPICityList: FinalCity,
                    toState: this.state.toStateList.length
                      ? SelectedState
                      : state,
                    toCity:
                      this.state.toFedexCityList.length > 0 ? "" : SelectedCity,
                    ToFedExSelectedCity:
                      this.state.toFedexCityList.length > 0 ? SelectedCity : "",
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
              // cogoToast.error("Zip code not found");
              console.log("55555", this.state.toState);
              debugger;
              this.setState({
                toCityAutoComplete: false,
                toStateAutoComplete: this.state.toStateList.length
                  ? true
                  : false,
                toGoogleAPICityList: [],
                toState: "",
                toCity: "",
                disabletoZipcode: false,
                disabletoCity: false,
                disabletoState: false,
                // toZipCodeErr: true,
                // toZipCodeHelperText: "Zipcode is not valid ",
              });
              console.log("66666", this.state.toStateAutoComplete);
            }
          });
      }
    }
  };

  ChangeToCity = (event, value) => {
    if (value != null) {
      this.setState({ toCity: value });
    }
  };

  ChangeToState = (event, value) => {
    debugger;
    if (value != null) {
      this.setState({ toState: value });
    }
  };

  handleChange = (event, type) => {
    if (type === "tocompanyname") {
      if (event.target.value.length <= 35) {
        this.setState({ toCompanyName: event.target.value });
      }
    } else if (type === "tocontactname") {
      if (event.target.value.length <= 35) {
        this.setState({ toContactName: event.target.value });
      }
    } else if (type === "toaddressline1") {
      if (event.target.value.length <= 35) {
        this.setState({ toAddressLine1: event.target.value });
      }
    } else if (type === "toaddressline2") {
      if (event.target.value.length <= 35) {
        this.setState({ toAddressLine2: event.target.value });
      }
    } else if (type === "toaddressline3") {
      if (event.target.value.length <= 35) {
        this.setState({ toAddressLine3: event.target.value });
      }
    } else if (type === "tozipcode") {
      this.setState({ toZipCode: event.target.value.replace(/\s/g, "") });
    } else if (type === "tocity") {
      this.setState({ toCity: event.target.value });
    } else if (type === "tostate") {
      this.setState({ toState: event.target.value });
    } else if (type === "toemail") {
      this.setState({ toEmail: event.target.value });
    } else if (type === "tophone1") {
      if (event.target.value.length <= 15) {
        this.setState({ toPhone1: event.target.value.replace(/\D/g, "") });
      }
    } else if (type === "tophone2") {
      if (event.target.value.length <= 15) {
        this.setState({ toPhone2: event.target.value.replace(/\D/g, "") });
      }
    }
  };

  handleBlur = (event, type) => {
    if (type === "tocompanyname") {
      if (!CommonConfig.isEmpty(event.target.value)) {
        if (event.target.value.length > 35) {
          this.setState({
            toCompanyName: event.target.value,
            toCompanyNameErr: true,
            toompanyNameHelperText: "Company name should be max 35 characters.",
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
      } else if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          toCompanyName: event.target.value,
          toCompanyNameErr: false,
          toCompanyNameHelperText: "",
        });
      }
    } else if (type === "tocontactname") {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          toContactName: event.target.value,
          toContactNameErr: true,
          toContactNameHelperText: "Please enter recepient Contact name",
        });
      } else if (event.target.value.length > 35) {
        this.setState({
          toContactName: event.target.value,
          toContactNameErr: true,
          toContactNameHelperText: "Contact name should be max 35 characters.",
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
          toAddressLine1HelperText: "Please enter recepient Address ",
        });
      } else if (event.target.value.length > 35) {
        this.setState({
          toAddressLine1: event.target.value,
          toAddressLine1Err: true,
          toAddressLine1HelperText: "Addressline 1 should be max 35 characters",
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
        if (event.target.value.length > 35) {
          this.setState({
            toAddressLine2: event.target.value,
            toAddressLine2Err: true,
            toAddressLine2HelperText:
              "Addressline 2 should be max 35 characters ",
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
        if (event.target.value.length > 35) {
          this.setState({
            toAddressLine3: event.target.value,
            toAddressLine3Err: true,
            toAddressLine3HelperText:
              "Addressline 3 should be max 35 characters ",
          });
        } else {
          this.setState({
            toAddressLine3: event.target.value,
            toAddressLine3Err: false,
            toAddressLine3HelperText: "",
          });
        }
      }
    } else if (
      type === "tozipcode" &&
      this.state.ToSelectedCountry.value !== 107
    ) {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          toZipCode: event.target.value,
          toZipCodeErr: true,
          toZipCodeHelperText: "Please enter recepient Zip Code",
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
          toZipCode: event.target.value.replace(/\s/g, ""),
          toZipCodeErr: true,
          toZipCodeHelperText: "Zipcode length should be max 12 character",
        });
      } else {
        this.recipientZipChange(event.target.value.replace(/\s/g, ""));
        this.setState({
          toZipCode: event.target.value.replace(/\s/g, ""),
          toZipCodeErr: false,
          toZipCodeHelperText: "",
        });
      }
    } else if (type === "tocity") {
      if (
        CommonConfig.isEmpty(event.target.value) ||
        this.state.ToSelectedCountry.value === 107
      ) {
        this.setState({
          toCity: event.target.value,
          toCityErr: true,
          toCityHelperText: "Please enter recepient City ",
        });
      } else if (CommonConfig.RegExp.companyName.test(event.target.value)) {
        this.setState({
          toCity: event.target.value,
          toCityErr: true,
          toCityHelperText: "City is not valid",
        });
      } else if (event.target.value.length > 35) {
        this.setState({
          toCity: event.target.value,
          toCityErr: true,
          toCityHelperText: "City shoule be max 35 characters",
        });
      } else {
        this.setState({
          toCity: event.target.value,
          toCityErr: false,
          toCityHelperText: "",
        });
      }
    } else if (
      type === "tostate" &&
      this.state.ToSelectedCountry.value !== 107
    ) {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          toState: event.target.value,
          toStateErr: true,
          toStateHelperText: "Please enter recepient State",
        });
      } else if (CommonConfig.RegExp.companyName.test(event.target.value)) {
        this.setState({
          toState: event.target.value,
          toStateErr: true,
          toStateHelperText: "State is not valid",
        });
      } else if (event.target.value.length > 35) {
        this.setState({
          toState: event.target.value,
          toStateErr: true,
          toStateHelperText: "State shoule be max 35 characters",
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
          toPhone1HelperText: "Please enter recepient Phone No.",
        });
      } else if (!event.target.value.match(CommonConfig.RegExp.phoneNumber)) {
        this.setState({
          toPhone1: event.target.value,
          toPhone1Err: true,
          toPhone1HelperText: "please enter valid Phone No.",
        });
      } else if (
        event.target.value.length < 5 ||
        event.target.value.length > 15
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
          event.target.value.length > 15
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
        } else if (!event.target.value.match(CommonConfig.RegExp.email)) {
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
    }
  };

  ChangeFromFedexCity = (event, type) => {
    if (type === "FedEx") {
      if (CommonConfig.isEmpty(event)) {
        return null;
      } else {
        this.setState({ ToFedExSelectedCity: event });
        var GetRate = this.state.getRate;
        GetRate.ToFedExCity = event;
        this.setState({ getRate: GetRate });
      }
    } else if (type === "UPS") {
      if (CommonConfig.isEmpty(event)) {
        return null;
      } else {
        this.setState({ ToFedExSelectedCity: event });
        var GetRate = this.state.getRate;
        GetRate.FromUPSCity = event;
        this.setState({ getRate: GetRate });
      }
    }
  };

  handleChange_Value1(type) {
    if (type === "ToFedExCity") {
      let selectedCity = this.state.ToFedExSelectedCity.value;

      if (
        selectedCity == "" ||
        selectedCity == undefined ||
        selectedCity == null
      ) {
        this.setState({
          toFedexCityError: true,
          toFedexCityHelperText: "Please select to city",
        });
      } else {
        this.setState({
          toFedexCityError: false,
          toFedexCityHelperText: "",
        });
      }
    }
    // if (type === "FromUPSCity") {
    //   let selectedCity = this.state.FromUPSSelectedCity.value;

    //   if (
    //     selectedCity == "" ||
    //     selectedCity == undefined ||
    //     selectedCity == null
    //   ) {
    //     this.setState({
    //       fromUPSCityError: true,
    //       fromUPSCityHelperText: "Please select from ups city",
    //     });
    //   } else {
    //     this.setState({ fromUPSCityError: false, fromUPSCityHelperText: "" });
    //   }
    // }
  }

  validate(event) {
    let IsFormValid = true;

    if (CommonConfig.isEmpty(this.state.toContactName)) {
      IsFormValid = false;
      this.setState({
        toContactNameErr: true,
        toContactNameHelperText: "Please enter recepient Contact Name",
      });
    }
    if (this.state.toEmailErr && !CommonConfig.isEmpty(this.state.toEmail)) {
      IsFormValid = false;
      this.setState({
        toEmailErr: true,
        toEmailHelperText: "Please enter valid recepient email",
      });
    }
    if (CommonConfig.isEmpty(this.state.toAddressLine1)) {
      IsFormValid = false;
      this.setState({
        toAddressLine1Err: true,
        toAddressLine1HelperText: "Please enter recepient Address",
      });
    }
    if (
      CommonConfig.isEmpty(this.state.toZipCode) &&
      !this.state.ToZipcodeOptional &&
      this.state.disabletoZipcode == false &&
      this.state.ToSelectedCountry.value !== 107
    ) {
      IsFormValid = false;
      this.setState({
        toZipCodeErr: true,
        toZipCodeHelperText: "Please enter recepient Zipcode",
      });
    }
    if (
      (this.state.toCityAutoComplete === false &&
        this.state.disabletoZipcode == false) ||
      this.state.ToSelectedCountry.value === 107
    ) {
      let selectedCity = this.state.ToFedExSelectedCity.value;
      if (
        CommonConfig.isEmpty(this.state.toCity) &&
        CommonConfig.isEmpty(selectedCity)
      ) {
        IsFormValid = false;
        this.setState({
          toCityErr: true,
          toCityHelperText: "Please enter recepient City",
        });
      }
    }

    // ================ fed ex city validation =================================
    let selectedCity = this.state.ToFedExSelectedCity.value;

    if (
      (selectedCity == "" ||
        selectedCity == undefined ||
        this.state.ToSelectedCountry.value === 107 ||
        selectedCity == null) &&
      this.state.disabletoState == true
    ) {
      IsFormValid = false;
      this.setState({
        toFedexCityError: true,
        toFedexCityHelperText: "Please select to city",
      });
    }

    // ================= fed ex city validation end =======================

    if (
      CommonConfig.isEmpty(this.state.toState) &&
      this.state.disabletoState == false &&
      this.state.ToSelectedCountry.value !== 107
    ) {
      IsFormValid = false;
      this.setState({
        toStateErr: true,
        toStateHelperText: "Please enter recepient State",
      });
    }
    if (CommonConfig.isEmpty(this.state.toPhone1)) {
      IsFormValid = false;
      this.setState({
        toPhone1Err: true,
        toPhone1HelperText: "Please enter recepient Phone No.",
      });
    }
    if (this.state.toPhone1Err) {
      IsFormValid = false;
      this.setState({
        toPhone1Err: true,
        toPhone1HelperText: "Please enter valid recepient Phone No.",
      });
    }
    if (this.state.toPhone2Err) {
      IsFormValid = false;
      this.setState({
        toPhone2Err: true,
        toPhone2HelperText: "Please enter valid recepient Phone No.",
      });
    }
    if (this.state.toCompanyNameErr) {
      IsFormValid = false;
      this.setState({
        toCompanyNameErr: true,
        toCompanyNameHelperText: "Please enter valid company name",
      });
    }
    if (this.state.toAddressLine1Err) {
      IsFormValid = false;
      this.setState({
        toAddressLine1Err: true,
        toAddressLine1HelperText: "Please enter valid address line 1",
      });
    }
    if (this.state.toAddressLine2Err) {
      IsFormValid = false;
      this.setState({
        toAddressLine2Err: true,
        toAddressLine2HelperText: "Please enter valid address line ",
      });
    }
    if (this.state.toAddressLine3Err) {
      IsFormValid = false;
      this.setState({
        toAddressLine3Err: true,
        toAddressLine3HelperText: "Please enter valid address line 3",
      });
    }
    if (this.state.toZipCodeErr && this.state.ToSelectedCountry.value !== 107) {
      IsFormValid = false;
      this.setState({
        toZipCodeErr: true,
        toZipCodeErr: "Please enter valid zip code",
      });
    }
    if (CommonConfig.isEmpty(this.state.SelectedLocationType)) {
      IsFormValid = false;
      this.setState({
        locationTypeErr: true,
        loactionTypeHelperText: "Please select location type",
      });
    } else {
      this.setState({ locationTypeErr: false, loactionTypeHelperText: "" });
    }
    if (
      this.state.IsPickUp &&
      (CommonConfig.isEmpty(this.state.pickUpDate) || !this.state.isDateChanged)
    ) {
      IsFormValid = false;
      this.setState({
        pickupDateErr: true,
        pickupDateHelperText: "Please select pickup date",
      });
    }
    // if (
    //   this.state.ToSelectedCountry.value === 107 &&
    //   (CommonConfig.isEmpty(this.state.toCity) ||
    //     CommonConfig.isEmpty(selectedCity))
    // ) {
    //   IsFormValid = false;
    //   this.setState({
    //     toFedexCityError: true,
    //     toFedexCityHelperText: "Please select to city",
    //   });
    // }

    return IsFormValid;
  }

  locationType = (event) => {
    this.setState({ SelectedLocationType: event.target.value });
  };

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
    }
  };
  handleDateChange = (date, type) => {
    if (type === "PickUp") {
      this.setState({
        pickUpDate: date,
        isDateChanged: true,
        pickupDateErr: false,
        pickupDateHelperText: "",
      });
    }
  };

  render() {
    const {
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
    } = this.state;

    const toStateAutoCompleteval =
      typeof toState !== "object"
        ? { value: toState, label: toState }
        : toState;
    console.log("toStateAutoCompleteval", toStateAutoCompleteval);
    console.log("typeetoState", toState);

    const toCityOptions = this.state.toGoogleAPICityList.map((city) => {
      return { value: city.City_code, label: city.Name };
    });
    const toStateOptions = this.state.toStateList.map((state) => {
      return { value: state.StateName, label: state.StateName };
    });

    var ToFedExCityListDisplay = this.state.toFedexCityList.map((city) => {
      return { value: city.CityCode, label: city.CityName };
    });

    return (
      <div>
        <form>
          <GridContainer>
            <GridItem sm={4} md={4}>
              <CustomInput
                id="tocountry"
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: this.state.ToSelectedCountry.label,
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
                labelText="Company Name"
                id="companyname"
                error={toCompanyNameErr}
                helperText={toCompanyNameHelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: toCompanyName,
                  onBlur: (event) => this.handleBlur(event, "tocompanyname"),
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
            </GridItem>
            <GridItem sm={4} md={4}>
              <CustomInput
                labelText="Contact Name"
                id="contactname"
                error={toContactNameErr}
                helperText={toContactNameHelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: toContactName,
                  onBlur: (event) => this.handleBlur(event, "tocontactname"),
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
            </GridItem>
          </GridContainer>

          <GridContainer>
            <GridItem sm={4} md={4}>
              <CustomInput
                labelText="Address Line 1"
                id="addressline1"
                error={toAddressLine1Err}
                helperText={toAddressLine1HelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: toAddressLine1,
                  onBlur: (event) => this.handleBlur(event, "toaddressline1"),
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
            </GridItem>
            <GridItem sm={4} md={4}>
              <CustomInput
                id="addressline2"
                labelText="Address Line 2"
                error={toAddressLine2Err}
                helperText={toAddressLine2HelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: toAddressLine2,
                  onBlur: (event) => this.handleBlur(event, "toaddressline2"),
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
            </GridItem>
            <GridItem sm={4} md={4}>
              <CustomInput
                labelText="Address Line 3"
                id="addressline3"
                error={toAddressLine3Err}
                helperText={toAddressLine3HelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: toAddressLine3,
                  onBlur: (event) => this.handleBlur(event, "toaddressline3"),
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
            </GridItem>
          </GridContainer>

          <GridContainer>
            <GridItem sm={4} md={4}>
              <CustomInput
                labelText="Zip Code"
                id="zipcode"
                error={toZipCodeErr}
                helperText={toZipCodeHelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value:
                    this.state.disabletoState && !this.state.isZipAvailable
                      ? "Not Required"
                      : toZipCode,
                  disabled: this.state.disabletoZipcode,
                  onBlur: (event) => this.handleBlur(event, "tozipcode"),
                  onChange: (event) => this.handleChange(event, "tozipcode"),
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
            </GridItem>

            {(this.props &&
              this.props.allStates !== null &&
              this.props.allStates.schedulepickup &&
              this.props.allStates.schedulepickup.GetRate &&
              this.props.allStates.schedulepickup.GetRate.ToCountry
                .IsFedexCity == 1) ||
            this.state.isFedexFromWordpress ? (
              <GridItem xs={12} sm={12} md={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    options={ToFedExCityListDisplay}
                    id="FromFedExCity"
                    getOptionLabel={(option) => option.label}
                    value={this.state.ToFedExSelectedCity}
                    autoSelect
                    onBlur={(e) => this.handleChange_Value1("ToFedExCity")}
                    onChange={(event, value) =>
                      this.ChangeFromFedexCity(value, "FedEx")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="To City"
                        fullWidth
                        error={this.state.toFedexCityError}
                        helperText={this.state.toFedexCityHelperText}
                      />
                    )}
                  />
                </FormControl>
              </GridItem>
            ) : (
              <GridItem sm={4} md={4}>
                {this.state.toCityAutoComplete === false ? (
                  <CustomInput
                    labelText="City"
                    id="city"
                    error={toCityErr}
                    helperText={toCityHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: toCity.label ? toCity.label : toCity,
                      disabled: this.state.disabletoCity,
                      onBlur: (event) => this.handleBlur(event, "tocity"),
                      onChange: (event) => this.handleChange(event, "tocity"),
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
                          <Icon className="requiredicon">location_city</Icon>
                        </InputAdornment>
                      ),
                    }}
                  />
                ) : (
                  <CustomInput
                    labelText="City"
                    id="city"
                    error={toCityErr}
                    helperText={toCityHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: toCity.label ? toCity.label : toCity,
                      disabled: this.state.disabletoCity,
                      onBlur: (event) => this.handleBlur(event, "tocity"),
                      onChange: (event) => this.handleChange(event, "tocity"),
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
                          <Icon className="requiredicon">location_city</Icon>
                        </InputAdornment>
                      ),
                    }}
                  />
                  // <Autocomplete
                  //   options={toCityOptions}
                  //   id="tocity"
                  //   disabled={this.state.disabletoCity}
                  //   autoSelect
                  //   getOptionLabel={(option) => option.label}
                  //   value={toCity}
                  //   onChange={(event, value) => this.ChangeToCity(event, value)}
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
              {this.state.toStateAutoComplete === false ? (
                <CustomInput
                  labelText="State"
                  id="state"
                  error={toStateErr}
                  helperText={toStateHelperText}
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    value: this.state.disabletoState ? "Not Required" : toState,
                    // disabled: this.state.disabletoState,
                    onBlur: (event) => this.handleBlur(event, "tostate"),
                    onChange: (event) => this.handleChange(event, "tostate"),
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
              ) : (
                <Autocomplete
                  options={toStateOptions}
                  id="toState"
                  autoSelect
                  disabled={this.state.disabletoState}
                  getOptionLabel={(option) => option.label}
                  value={toStateAutoCompleteval}
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
            </GridItem>
          </GridContainer>

          <GridContainer>
            <GridItem sm={4} md={4}>
              <CustomInput
                labelText="Phone 1"
                id="phone1"
                error={toPhone1Err}
                helperText={toPhone1HelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: toPhone1,
                  onBlur: (event) => this.handleBlur(event, "tophone1"),
                  onChange: (event) => this.handleChange(event, "tophone1"),
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
            </GridItem>
            <GridItem sm={4} md={4}>
              <CustomInput
                labelText="Phone 2"
                id="phone2"
                error={toPhone2Err}
                helperText={toPhone2HelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: toPhone2,
                  onBlur: (event) => this.handleBlur(event, "tophone2"),
                  onChange: (event) => this.handleChange(event, "tophone2"),
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
            </GridItem>
            <GridItem sm={4} md={4}>
              <CustomInput
                labelText="Email Address"
                id="email"
                error={toEmailErr}
                helperText={toEmailHelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: toEmail,
                  onBlur: (event) => this.handleBlur(event, "toemail"),
                  onChange: (event) => this.handleChange(event, "toemail"),
                  onFocus: (event) =>
                    this.setState({ toEmailErr: false, toEmailHelperText: "" }),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      className={classes.inputAdornment}
                    >
                      <Icon>email</Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </GridItem>
          </GridContainer>

          <GridContainer>
            <GridItem sm={4} md={4}>
              <div className="select-spl">
                <FormControl fullWidth>
                  <InputLabel className={classes.selectLabel}>
                    Select Location Type
                  </InputLabel>
                  <Select
                    value={this.state.SelectedLocationType}
                    disabled={this.state.disableGetrate}
                    onChange={(event) => this.locationType(event)}
                    inputProps={{ name: "locationType", id: "locationType" }}
                  >
                    {this.appendLocationType()}
                  </Select>
                </FormControl>
              </div>
            </GridItem>
            <GridItem xs={4}>
              <div className="select-spl">
                <FormControl fullWidth error={this.state.PickupErr}>
                  <InputLabel className={classes.selectLabel}>
                    Do You Need Pickup?
                  </InputLabel>
                  <Select
                    value={this.state.selectedPickupType}
                    onChange={(event) => this.isPickUpNeed(event, "PickUp")}
                    inputProps={{
                      name: "doyouneedpickup",
                      id: "doyouneedpickup",
                    }}
                  >
                    onFocus=
                    {() =>
                      this.setState({ PickupErr: false, PickupHelperText: "" })
                    }
                    {this.appendPickType()}
                  </Select>
                  <FormHelperText>{this.state.PickupHelperText}</FormHelperText>
                </FormControl>
              </div>
            </GridItem>

            <GridItem xs={4} className="z-index-9">
              {this.state.IsPickUp ? (
                <div className="date-input" style={{ marginTop: "18px" }}>
                  <InputLabel className={classes.label}>PickUp Date</InputLabel>
                  <FormControl fullWidth>
                    <Datetime
                      timeFormat={false}
                      inputProps={{ placeholder: "PickUp Date" }}
                      selected={this.state.pickUpDate}
                      onChange={(date) => this.handleDateChange(date, "PickUp")}
                      isValidDate={this.state.valid}
                      closeOnSelect={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          margin="normal"
                          fullWidth
                          error={this.state.pickupDateErr}
                          helperText={this.state.pickupDateHelperText}
                        />
                      )}
                    />
                  </FormControl>
                </div>
              ) : null}
            </GridItem>
          </GridContainer>
        </form>
      </div>
    );
  }
}

Scheduleshipment.propTypes = {
  classes: PropTypes.object,
};

export default withStyles()(Scheduleshipment);
