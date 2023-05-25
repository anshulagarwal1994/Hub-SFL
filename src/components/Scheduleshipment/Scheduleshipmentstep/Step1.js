/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import api from "../../../utils/apiClient";
import { CommonConfig } from "../../../utils/constant";
import cogoToast from "cogo-toast";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import MenuItem from "@material-ui/core/MenuItem";
import SimpleBackdrop from "utils/general";

const useStyles = makeStyles(styles);
const classes = () => {
  return useStyles();
};

class Scheduleshipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      FromFedExCityList: [],
      ToFedExCityList: [],
      FromUPSCityList: [],
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
      Loading: false,
    };
  }

  
  async componentDidMount() {
    // await this.getuserDetails();
    await this.GetCountry();
    this.showLoader();
    setTimeout(() => {
      if (localStorage.getItem("sealsleadid")) {
        this.getsealsleaddetialsforshipment();
        document.getElementById("Wizard-stepContent-212").style.display =
        "none";
      document.getElementById("Wizard-stepContent-211").style.display =
        "block";
      }
    }, 500);
 
    if (
      this.props.props.history.location.state !== undefined &&
      this.props.props.history.location.state != null
    ) {
      var FromCountryData = JSON.parse(
        this.props.props.history.location.state.GetRateData.UpsData.FromCountry
      );
      var ToCountryData = JSON.parse(
        this.props.props.history.location.state.GetRateData.UpsData.ToCountry
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

      setTimeout(() => {
        if (FromCountryData.IsFedexCity == 1) {
          this.ChangeFromCountry(selectedFromCountry);
          this.hideLoader();
        }

        if (ToCountryData.IsFedexCity == 1) {
          this.ChangeToCountry(selectedToCountry);
          this.hideLoader();
        }
      }, 2500);

      this.setState({
        FromSelectedCountry: selectedFromCountry,
        ToSelectedCountry: selectedToCountry,
        SubServiceName: this.props.props.history.location.state.ServiceName,
        ServiceName: this.props.props.history.location.state.MainServiceName,
        selectedShipmentType: this.props.props.history.location.state
          .ServiceType,
        GetRate: GetRate,
        disableGetrate: true,
      });
    }
  }

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
    
    if (!localStorage.getItem("sealsleadid")) {

    

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
    }

    return IsFormValid;
  }

  async getsealsleaddetialsforshipment() {
    this.showLoader();
    try {
      var data = { SalesLeadManagementID: localStorage.getItem("sealsleadid") };

      let result = await api.post("salesLead/getSalesLeadDetailsById", data);

      if (result.data.success) {
        this.setState({ skipstep2: true });

        var pickupcountry = _.filter(this.state.CountryList, {
          CountryID: result.data.data.FromCountryID,
        });

        var dropoffcountry = _.filter(this.state.CountryList, {
          CountryID: result.data.data.ToCountryID,
        });

        var MainServiceName = localStorage.getItem("Mainname");
        var ServiceName = localStorage.getItem("Subname");
        var ServiceType = localStorage.getItem("ServiceType");
        
        
        let selectedPickUPCountry = {
          value: pickupcountry[0].CountryID,
          label: pickupcountry[0].CountryName,
        };

        let selectedDropoffCountry = {
          value: dropoffcountry[0].CountryID,
          label: dropoffcountry[0].CountryName,
        };

        var UserDetails = this.state.UserDetails;
        if (
          pickupcountry[0].IsFedexCity === 0 &&
          pickupcountry[0].IsUpsCity !== 1 &&
          result.data.data.FromZipCode
        ) {
          UserDetails.disableGetrate = true;
          UserDetails.disablefromZipcode = true;
          UserDetails.disablefromCity = true;
          UserDetails.isDisableFields = true;
          UserDetails.disablefromState = false;
        } else {
          UserDetails.disableGetrate = true;
          UserDetails.disablefromZipcode = false;
          UserDetails.disablefromCity = true;
          UserDetails.isDisableFields = true;
          UserDetails.disablefromState = false;
        }
        if (
          dropoffcountry[0].IsFedexCity === 0 &&
          dropoffcountry[0].IsUpsCity !== 1 &&
          result.data.data.ToZipCode
        ) {
          UserDetails.disableGetrate = true;
          UserDetails.disabletoZipcode = true;
          UserDetails.disabletoCity = true;
          UserDetails.isDisableFields = true;
          UserDetails.disabletoState = false;
        } else {
          UserDetails.disableGetrate = true;
          UserDetails.disabletoZipcode = false;
          UserDetails.disabletoCity = true;
          UserDetails.isDisableFields = true;
          UserDetails.disabletoState = false;
        }

        UserDetails.CompanyName = result.data.data.CompanyName;
        UserDetails.ContactName = result.data.data.ContactName;
        UserDetails.State = result.data.data.FromState;
        UserDetails.ZipCode = result.data.data.FromZipCode;
        UserDetails.City = result.data.data.FromCity;
        UserDetails.ToState =
          result.data.data.ToState != "undefined" ||
          result.data.data.ToState != undefined
            ? result.data.data.ToState
            : "";
        UserDetails.ToZipCode = result.data.data.ToZipCode;
        UserDetails.ToCity =
          result.data.data.ToCity != "undefined" ||
          result.data.data.ToCity != undefined
            ? result.data.data.ToCity
            : "";
        var EmailAddress = result.data.data.Email;
        var Phone = result.data.data.PhoneNumber;
        var PackageList = result.data.data.PackageList;
        var PckgList = [];
        PackageList.forEach((element) => {
          var list = {
            PackageChargableWeight: element.ChargeableWeight,
            PackageHeight: element.DimensionH,
            PackageInsuredValue: 0,
            PackageLength: element.DimensionL,
            PackageNumber: element.Quantity,
            PackageWeight: element.ActualWeight,
            PackageWidth: element.DimensionW,
          };
          PckgList.push(list);
        });

        this.setState({
          FromSelectedCountry: selectedPickUPCountry,
          ToSelectedCountry: selectedDropoffCountry,
          selectedShipmentType: ServiceType,
          Phone1: Phone,
          Phone2: "",
          Email: EmailAddress,
          UserDetails: UserDetails,
          PckgList: PckgList,
          PackageType:
            result.data.data.PackageList[0].PackageType === 2
              ? "Envelop"
              : "Package",
          ServiceName: MainServiceName,
          disableGetrate: true,
          SubServiceName: ServiceName,
        });
        this.hideLoader();
      }
      this.hideLoader();
      
      
    } catch (error) {
      this.hideLoader();
      console.log("error..", error);
      cogoToast.error("Something Went Wrong");
    }
  }

  GetCountry() {
    this.showLoader();
    try {
      api
        .get("location/getCountryList")
        .then((res) => {
          if (res.success) {
            var Country = res.data;
            // this.getuserDetails();
            this.setState({ CountryList: Country });
            if (!localStorage.getItem("sealsleadid")) {
              var selectedCountryList = _.filter(Country, {
                CountryCode: "US",
              });
              if (
                CommonConfig.isEmpty(
                  this.props.props.history.location.state
                ) === true
              ) {
                var GetRate = this.state.GetRate;

                GetRate.FromCountry = selectedCountryList[0];
                GetRate.ToCountry = selectedCountryList[0];

                this.setState({ GetRate: GetRate, Loading: false });
              } else {
                this.setState({ Loading: false });
              }
              
            } else {
              
              console.log("else called ......");
            }
          }
        })
        .catch((err) => {
          this.hideLoader();
          console.log("err..", err);
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {
      this.hideLoader();
      console.log("error..", error);
      cogoToast.error("Something Went Wrong");
    }
  }

  getuserDetails() {
    let data = {
      UserID: CommonConfig.loggedInUserData().PersonID,
    };
    try {
      this.showLoader();
      api
        .post("userManagement/getUserDetails", data)
        .then((res) => {
          this.hideLoader();
          if (res.success) {
            let userData = res.data;
            if (
              this.props.props.history.location.state !== undefined &&
              this.props.props.history.location.state != null
            ) {
              if (this.props.props.history.location.state.skipstep1) {
                var FromCountryData = JSON.parse(
                  this.props.props.history.location.state.GetRateData.UpsData
                    .FromCountry
                );
                if (
                  !CommonConfig.isEmpty(
                    this.props.props.history.location.state.GetRateData.UpsData
                      .FromZipCode
                  )
                ) {
                  if (
                    FromCountryData.CountryID ===
                      userData.UserDetails[0].CountryID &&
                    this.props.props.history.location.state.GetRateData.UpsData
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

                this.setState({
                  UserDetails: userDetails,
                });
              }
            } else if (this.state.skipstep2) {
              if (!CommonConfig.isEmpty(this.state.UserDetails.ZipCode)) {
                if (
                  this.FromSelectedCountry.CountryID ===
                    userData.UserDetails[0].CountryID &&
                  this.state.UserDetails.ZipCode ===
                    userData.UserDetails[0].ZipCode
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
                    this.setState({
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
              if (userData.UserDetails.length) {
                let userDetails = this.state.UserDetails;
                userDetails.AccountNumber =
                  userData.UserDetails[0].AccountNumber;
                // console.log("UserDetails......",userDetails);
                this.setState({
                  UserDetails: userDetails,
                });
              }
            } else {
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

    if (
      GetRate.FromCountry.CountryCode != undefined &&
      GetRate.FromCountry.CountryCode === "US"
    ) {
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
    } else {
      this.setState({ FromFedExCityList: [] });
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
    }
    if (GetRate.ToCountry.IsUpsCity) {
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
    const FromCountryOptions = this.state.CountryList.map((fromCountry) => {
      return { value: fromCountry.CountryID, label: fromCountry.CountryName };
    });
    const ToCountryOptions = this.state.CountryList.map((tocountry) => {
      return { value: tocountry.CountryID, label: tocountry.CountryName };
    });

    return (
      <div>
        <GridContainer className="MuiGrid-justify-xs-center schedulecenter">
          <GridItem xs={12} sm={12} md={6}>
            <form>
              <div className="select-spl">
                <FormControl fullWidth error={this.state.shipmentTypeErr}>
                  <InputLabel className={classes.selectLabel}>
                    Select Shipment Type
                  </InputLabel>
                  <Select
                    fullWidth={true}
                    value={this.state.selectedShipmentType}
                    disabled={this.state.disableGetrate}
                    MenuProps={{ className: classes.selectMenu }}
                    classes={{ select: classes.select }}
                    onChange={(event) => this.ShipmentTypeChange(event)}
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
                  onChange={(event, value) => this.ChangeFromCountry(value)}
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
                      helperText={this.state.fromCountryHelperText}
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
                  onChange={(event, value) => this.ChangeToCountry(value)}
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
                      helperText={this.state.toCountryHelperText}
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
              </FormControl>
            </form>
          </GridItem>
          {this.state.Loading === true ? (
            <div className="loading">
              <SimpleBackdrop />
            </div>
          ) : null}
        </GridContainer>
      </div>
    );
  }
}

Scheduleshipment.propTypes = {
  classes: PropTypes.object,
};

export default withStyles()(Scheduleshipment);
