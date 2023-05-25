/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
//import FormControlLabel from "@material-ui/core/FormControlLabel";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import api from "../../utils/apiClient";
import { CommonConfig } from "../../utils/constant";
import cogoToast from "cogo-toast";
import Button from "components/CustomButtons/Button.js";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import FlightTakeoff from "@material-ui/icons/FlightTakeoff";
import CardBody from "components/Card/CardBody.js";

// material ui icons

import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles(styles);
const classes = () => {
  return useStyles();
};

class step2test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CountryList: [],
      StateList: [],
      FromCityList: [],
      FromFedExCityList: [],
      FromUPSCityList: [],
      ToCityList: [],
      ToFedExCityList: [],
      ToUPSCityList: [],
      PackageDetails: [],
      FromZipError: true,
      ToZipError: true,
      FromCityError: true,
      FromFedexCityError: true,
      FromUpsCityError: true,
      ToCityError: true,
      ToFedExCityError: true,
      ToUpsCityError: true,
      disableBtn: 1,

      Residential: [
        { value: "No", label: "No" },
        { value: "Yes", label: "Yes" },
      ],

      PackageType: [
        { value: "Package", label: "Package" },
        { value: "Envelope", label: "Envelope" },
      ],

      PickupType: [
        { value: "No", label: "No" },
        { value: "Yes", label: "Yes" },
      ],

      GetRate: {
        PackageType: "Package",
        WeightType: "LBS",
        PickUp: "No",
        Residential: "No",
        ShipmentType: "",

        FromCountry: "",
        ToCountry: "",

        FromState: "",
        ToState: "",

        FromCity: "",
        FromFedExCity: "",
        FromUPSCity: "",

        ToCity: "",
        ToFedExCity: "",
        ToUPSCity: "",

        FromZipCode: "",
        ToZipCode: "",

        TotalWeight: 0,
        TotalChargableWeight: 0,
        TotalInsuredValue: 0,
      },

      FromSelectedCountry: {},
      ToSelectedCountry: {},
    };
  }

  componentDidMount() {
    this.GetCountry();
  }

  showLoader = () => {
    this.setState({ Loading: true });
  };

  hideLoader = () => {
    this.setState({ Loading: false });
  };

  GetCountry() {
    this.setState({ Loading: true });
    try {
      this.setState({ Loading: true });
      api
        .get("location/getCountryList")
        .then((res) => {
          if (res.success) {
            this.setState({ Loading: false });
            var Country = res.data;
            this.setState({ CountryList: Country });

            var selectedCountryList = _.filter(Country, { CountryCode: "US" });

            var SelectedCountry = {
              value: selectedCountryList[0].CountryID,
              label: selectedCountryList[0].CountryName,
            };

            this.setState({
              FromSelectedCountry: SelectedCountry,
              ToSelectedCountry: SelectedCountry,
            });

            var GetRate = this.state.GetRate;

            GetRate.FromCountry = selectedCountryList[0];
            GetRate.ToCountry = selectedCountryList[0];
            this.setState({ GetRate: GetRate });
          }
        })
        .catch((err) => {
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {}
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
          } else {
            this.setState({ ToFedExCityList: [] });
          }
        })
        .catch((err) => {
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
          } else {
            this.setState({ ToUPSCityList: [] });
          }
        })
        .catch((err) => {
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
    var GetRate = this.state.GetRate;
    GetRate.ShipmentType = event.target.value;
    this.setState({ ShipmentType: event.target.value });
  };

  sendState() {
    return this.state;
  }

  changeStep() {
    let shipmentObj = {
      FromCountry: this.state.GetRate.FromCountry,
      ToCountry: this.state.GetRate.ToCountry,
      ShipType: this.state.GetRate.ShipmentType,
    };
    localStorage.setItem("shipmentObj", JSON.stringify(shipmentObj));
    this.props.history.push("Scheduleshipmentnew");
  }

  render() {
    const FromCountryOptions = this.state.CountryList.map((fromCountry) => {
      return { value: fromCountry.CountryID, label: fromCountry.CountryName };
    });
    const ToCountryOptions = this.state.CountryList.map((tocountry) => {
      return { value: tocountry.CountryID, label: tocountry.CountryName };
    });

    const { simpleSelect } = this.state;

    return (
      <div>
        <GridContainer className="MuiGrid-justify-xs-center">
          <Card>
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <FlightTakeoff />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">
                Schedule Shipment
              </h4>
            </CardHeader>
            <CardBody>
              <GridItem xs={12} sm={12} md={6}>
                <form>
                  <FormControl fullWidth className="input-select-outer">
                    <InputLabel
                      htmlFor="selectshipmenttype"
                      className={classes.selectLabel}
                    >
                      Select Shipment Type
                    </InputLabel>
                    <Select
                      fullWidth={true}
                      value={this.state.ShipmentType}
                      MenuProps={{ className: classes.selectMenu }}
                      classes={{ select: classes.select }}
                      onChange={(event) => this.ShipmentTypeChange(event)}
                      inputProps={{
                        name: "selectshipmenttype",
                        id: "selectshipmenttype",
                      }}
                      defaultValue={"Air"}
                    >
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        value="Air"
                      >
                        {" "}
                        Air{" "}
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        value="Ground"
                      >
                        {" "}
                        Ground{" "}
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        value="Ocean"
                      >
                        {" "}
                        Ocean{" "}
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth className="input-select-outer">
                    <Autocomplete
                      options={FromCountryOptions}
                      id="FromCountry"
                      getOptionLabel={(option) => option.label}
                      value={this.state.FromSelectedCountry}
                      autoSelect
                      onChange={(event, value) => this.ChangeFromCountry(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="From Country"
                          margin="normal"
                          fullWidth
                        />
                      )}
                    />
                  </FormControl>

                  <FormControl fullWidth className="input-select-outer">
                    <Autocomplete
                      options={ToCountryOptions}
                      id="toCountry"
                      getOptionLabel={(option) => option.label}
                      value={this.state.ToSelectedCountry}
                      autoSelect
                      onChange={(event, value) => this.ChangeToCountry(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="To Country"
                          margin="normal"
                          fullWidth
                        />
                      )}
                    />
                  </FormControl>
                </form>
              </GridItem>
            </CardBody>
          </Card>
          <GridContainer>
            <GridItem justify="right">
              <Button onClick={() => this.changeStep()}>Next</Button>
            </GridItem>
          </GridContainer>
        </GridContainer>
      </div>
    );
  }
}

export default step2test;
