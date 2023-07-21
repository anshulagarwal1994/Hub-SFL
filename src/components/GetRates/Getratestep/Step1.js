import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputAdornment from "@material-ui/core/InputAdornment";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Dialog from "@material-ui/core/Dialog";
import Icon from "@material-ui/core/Icon";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Button from "components/CustomButtons/Button.js";
import Grid from "@material-ui/core/Grid";
import api from "../../../utils/apiClient";
import { CommonConfig } from "../../../utils/constant";
import moment from "moment";
import _ from "lodash";
import cogoToast from "cogo-toast";
import Datetime from "react-datetime";
import DeleteIcon from "@material-ui/icons/Delete";
import SimpleBackdrop from "../../../utils/general";
import axios from "axios";

const useStyles = () => makeStyles(styles);
const classes = useStyles();

var yesterday = Datetime.moment().subtract(1, "day");

var valid = function(current) {
  return (
    current.day() !== 0 && current.day() !== 6 && current.isAfter(yesterday)
  );
};

class Step1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      packageWeight: "Weight (lbs)*",
      dimenstionType: "Dimenstion (L + W + H)*",
      finalGetResults: [],
      CountryList: [],
      StateList: [],
      FromCityList: [],
      FromFedExCityList: [],
      FromUPSCityList: [],
      ToCityList: [],
      ToFedExCityList: [],
      ToUPSCityList: [],
      PackageDetails: [],
      fromZipError: false,
      toZipError: false,
      fromCityError: false,
      fromFedexCityError: false,
      fromUpsCityError: false,
      toCityError: false,
      toFedExCityError: false,
      toUpsCityError: false,

      toZipCodeErr: false,
      toZipCodeHelperText: "",

      fromZipCodeErr: false,
      fromZipCodeHelperText: "",

      dialogNameHelperText: "",
      dialogEmailHelperText: "",
      dialogPhoneHelperText: "",

      dialogPhoneErr: false,
      dialogNameErr: false,
      dialogEmailErr: false,

      disableBtn: 1,
      StartDate: moment().toDate(),
      SelectedWeightType: "LB",
      packedBy: [{ value: "KG", label: "KG" }, { value: "LB", label: "LB" }],
      SelectedDimensitionType: "Inches",
      DimensitionpackedBy: [
        { value: "Inches", label: "Inches" },
        { value: "CM", label: "CM" },
      ],
      Residential: [
        { value: "No", label: "No" },
        { value: "Yes", label: "Yes" },
      ],
      SelectedPackageType: "Package",
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
        WeightType: "LB",
        SelectedWeightType: "",
        PickUp: "No",
        Residential: "No",

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

      Loading: false,
      IsResidential: false,
      IsPickup: false,
      IsPackage: true,
      ErrorMessage: null,

      FromSelectedCity: {},
      FromFedExSelectedCity: {},
      FromUPSSelectedCity: {},
      ToFedExSelectedCity: {},
      ToUPSSelectedCity: {},
      ToSelectedCity: {},

      FromSelectedCountry: {},
      ToSelectedCountry: {},

      SelectedResidential: { value: "No", label: "No" },
      SelectedPickupType: { value: "No", label: "No" },
      MaxPackageCount: 20,

      ObjEnvelope: {
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
      FromZipCodeOptional: false,
      ToZipCodeOptional: false,
      FinalGetRate: {},
      //--------------------- Email Config Data ---------------------------------------------------------------//
      ImgArr: [],
      sendMailInfo: {
        Frommail: "",
        TOmail: "",
        CCmail: "",
        BCCmail: "",
        Subjectmail: "",
        Bodymail: "",
        Type: "",
        attachments: "",
      },
      sendmailopen: false,
      rateArr: [],
      EmailAddress: "",
      Phone: "",
      ContactName: "",
      fromStateName: "",
      toStateName: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getData();

    if (!CommonConfig.isEmpty(this.props.props.history.location.state)) {
      this.setState({
        CountryList: this.props.props.history.location.state.state.CountryList,
        ErrorMessage: this.props.props.history.location.state.state
          .ErrorMessage,
        FinalGetRate: this.props.props.history.location.state.state
          .FinalGetRate,
        FromCityList: this.props.props.history.location.state.state
          .FromCityList,
        FromFedExCityList: this.props.props.history.location.state.state
          .FromFedExCityList,
        FromFedExSelectedCity: this.props.props.history.location.state.state
          .FromFedExSelectedCity,
        FromSelectedCity: this.props.props.history.location.state.state
          .FromSelectedCity,
        FromSelectedCountry: this.props.props.history.location.state.state
          .FromSelectedCountry,
        FromState: this.props.props.history.location.state.state.FromState,
        FromUPSCityList: this.props.props.history.location.state.state
          .FromUPSCityList,
        FromUPSSelectedCity: this.props.props.history.location.state.state
          .FromUPSSelectedCity,
        FromZipCode: this.props.props.history.location.state.state.FromZipCode,
        GetRate: this.props.props.history.location.state.state.GetRate,
        IsPackage: this.props.props.history.location.state.state.IsPackage,
        IsPickup: this.props.props.history.location.state.state.IsPickup,
        IsResidential: this.props.props.history.location.state.state
          .IsResidential,
        Loading: this.props.props.history.location.state.state.Loading,
        MaxPackageCount: this.props.props.history.location.state.state
          .MaxPackageCount,
        ObjEnvelope: this.props.props.history.location.state.state.ObjEnvelope,
        ObjPackage: this.props.props.history.location.state.state.ObjPackage,
        PackageDetails: this.props.props.history.location.state.state
          .PackageDetails,
        PackageType: this.props.props.history.location.state.state.PackageType,
        PickupType: this.props.props.history.location.state.state.PickupType,
        Residential: this.props.props.history.location.state.state.Residential,
        SelectedPackageType: this.props.props.history.location.state.state
          .SelectedPackageType,
        SelectedPickupType: this.props.props.history.location.state.state
          .SelectedPickupType,
        SelectedResidential: this.props.props.history.location.state.state
          .SelectedResidential,
        StartDate: this.props.props.history.location.state.state.StartDate,
        StateList: this.props.props.history.location.state.state.StateList,
        ToCityList: this.props.props.history.location.state.state.ToCityList,
        ToFedExCityList: this.props.props.history.location.state.state
          .ToFedExCityList,
        ToFedExSelectedCity: this.props.props.history.location.state.state
          .ToFedExSelectedCity,
        ToSelectedCity: this.props.props.history.location.state.state
          .ToSelectedCity,
        ToSelectedCountry: this.props.props.history.location.state.state
          .ToSelectedCountry,
        ToState: this.props.props.history.location.state.state.ToState,
        ToUPSCityList: this.props.props.history.location.state.state
          .ToUPSCityList,
        ToUPSSelectedCity: this.props.props.history.location.state.state
          .ToUPSSelectedCity,
        ToZipCode: this.props.props.history.location.state.state.ToZipCode,
        disableBtn: this.props.props.history.location.state.state.disableBtn,
        finalGetResults: this.props.props.history.location.state.state
          .finalGetResults,
        fromCityError: this.props.props.history.location.state.state
          .fromCityError,
        fromCityHelperText: this.props.props.history.location.state.state
          .fromCityHelperText,
        fromFedexCityError: this.props.props.history.location.state.state
          .fromFedexCityError,
        fromUpsCityError: this.props.props.history.location.state.state
          .fromUpsCityError,
        fromZipCodeErr: this.props.props.history.location.state.state
          .fromUpsCityError,
        fromZipCodeHelperText: this.props.props.history.location.state.state
          .fromZipCodeHelperText,
        fromZipError: this.props.props.history.location.state.state
          .fromZipError,
        toCityError: this.props.props.history.location.state.state.toCityError,
        toCityHelperText: this.props.props.history.location.state.state
          .toCityHelperText,
        toFedExCityError: this.props.props.history.location.state.state
          .toFedExCityError,
        toUpsCityError: this.props.props.history.location.state.state
          .toUpsCityError,
        toZipCodeErr: this.props.props.history.location.state.state
          .toZipCodeErr,
        toZipCodeHelperText: this.props.props.history.location.state.state
          .toZipCodeHelperText,
        toZipError: this.props.props.history.location.state.state.toZipError,
      });
    } else {
      this.GetCountry();
      this.setState({ PackageDetails: [this.state.ObjPackage] });
    }
    // if (!CommonConfig.isEmpty(this.props.history.location)) {
    //     this.state = this.props.history.location.state.state;
    // }
  }
  getData = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    console.log(res.data);
    //setIP(res.data.IPv4);
  };
  formatDate(RequestDate) {
    var day = new Date(RequestDate).getDate();
    var monthIndex = new Date(RequestDate).getMonth();
    var year = new Date(RequestDate).getFullYear();

    return year + "" + (monthIndex + 1) + "" + day;
  }
  packedBy = () => {
    return this.state.packedBy.map((content) => {
      return (
        <MenuItem
          classes={{ root: classes.selectMenuItem }}
          value={content.value}
        >
          {" "}
          {content.label}{" "}
        </MenuItem>
      );
    });
  };
  showLoader = () => {
    this.setState({ Loading: true });
  };

  hideLoader = () => {
    this.setState({ Loading: false });
  };

  GetCountry() {
    try {
      api
        .get("location/getCountryList")
        .then((res) => {
          if (res.success) {
            this.hideLoader();
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
          console.log("err...", err);
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {}
  }

  ChangeFromCountry = (event) => {
    if (CommonConfig.isEmpty(event)) {
      return null;
    }
    this.setState({
      fromZipCodeErr: false,
      fromZipCodeHelperText: "",
      fromCityError: false,
      fromCityHelperText: "",
      fromZipError: false,
      fromFedexCityError: false,
      fromFedexCityHelperText: "",
      fromUpsCityError: false,
      fromUpsCityHelperText: "",
    });

    var SelectedCountry = _.findIndex(this.state.CountryList, function(
      country
    ) {
      return country.CountryName === event.label;
    });

    var GetRate = this.state.GetRate;
    GetRate.FromCountry = this.state.CountryList[SelectedCountry];
    GetRate.FromState = "";

    var SelectedCity;
    if (GetRate.FromCountry.CountryCode === "IN") {
      this.setState({
        SelectedWeightType: "KG",
        SelectedDimensitionType: "CM",
      });
    } else {
      this.setState({
        SelectedWeightType: "LB",
        SelectedDimensitionType: "Inches",
      });
    }

    if (
      GetRate.FromCountry.CountryCode === "US" ||
      GetRate.FromCountry.CountryCode === "CN"
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

    if (
      GetRate.FromCountry.IsFedexCity ||
      GetRate.FromCountry.CountryCode === "CN"
    ) {
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
    this.setState({
      toZipCodeErr: false,
      toZipCodeHelperText: "",
      toCityError: false,
      toCityHelperText: "",
      toFedExCityError: false,
      toFedexCityHelperText: "",
      toUpsCityError: false,
      toUpsCityHelperText: "",
    });
    var SelectedCity;

    var SelectedCountry = _.findIndex(this.state.CountryList, function(
      country
    ) {
      return country.CountryName === event.label;
    });

    var GetRate = this.state.GetRate;
    GetRate.ToCountry = this.state.CountryList[SelectedCountry];
    GetRate.ToState = "";
    if (
      GetRate.ToCountry.CountryCode === "US" ||
      GetRate.ToCountry.CountryCode === "CN"
    ) {
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

    if (
      GetRate.ToCountry.IsFedexCity ||
      GetRate.ToCountry.CountryCode === "CN"
    ) {
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

  ChangeFromCity = (event, type) => {
    if (type === "FedEx") {
      if (CommonConfig.isEmpty(event)) {
        return null;
      } else {
        this.setState({ FromFedExSelectedCity: event });
        var GetRate = this.state.GetRate;
        GetRate.FromFedExCity = event;
        this.setState({ GetRate: GetRate });
      }
    } else if (type === "UPS") {
      if (CommonConfig.isEmpty(event)) {
        return null;
      } else {
        this.setState({ FromUPSSelectedCity: event });
        var GetRate = this.state.GetRate;
        GetRate.FromUPSCity = event;
        this.setState({ GetRate: GetRate });
      }
    } else {
      if (CommonConfig.isEmpty(event)) {
        return null;
      } else {
        this.setState({ FromSelectedCity: event });
        var GetRate = this.state.GetRate;
        GetRate.FromCity = event;
        this.setState({ GetRate: GetRate });
      }
    }
  };

  ChangeToCity = (event, type) => {
    if (type === "FedEx") {
      if (CommonConfig.isEmpty(event)) {
        return null;
      } else {
        this.setState({ ToFedExSelectedCity: event });
        let GetRate = this.state.GetRate;
        GetRate.ToFedExCity = event;
        this.setState({ GetRate: GetRate });
      }
    } else if (type === "UPS") {
      if (CommonConfig.isEmpty(event)) {
        return null;
      } else {
        this.setState({ ToUPSSelectedCity: event });
        let GetRate = this.state.GetRate;
        GetRate.ToUPSCity = event;
        this.setState({ GetRate: GetRate });
      }
    } else {
      if (CommonConfig.isEmpty(event)) {
        return null;
      } else {
        this.setState({ ToSelectedCity: event });
        let GetRate = this.state.GetRate;
        GetRate.ToCity = event;
        this.setState({ GetRate: GetRate });
      }
    }
  };

  ChangeFromZipUS = (e) => {
    var zip = e.target.value;
    if (zip.length) {
      if (zip.length) {
        this.showLoader();
        var SelectedCity = { value: null, label: null };
        this.setState({
          FromFedExSelectedCity:
            this.state.GetRate.FromCountry.IsFedexCity === 1
              ? this.state.FromFedExSelectedCity.value
              : { label: "Select City" }, //SelectedCity,
          FromUPSSelectedCity: SelectedCity,
          FromSelectedCity: SelectedCity,
        });

        fetch(
          CommonConfig.zipCodeAPIKey(zip, this.state.FromSelectedCountry.label)
        )
          .then((result) => result.json())
          .then((data) => {
            if (data["status"] === "OK") {
              if (
                data["results"][0] &&
                data["results"][0].hasOwnProperty("postcode_localities")
              ) {
                var FinalCity = [];
                var state = "";
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

                this.setState({ FromCityList: FinalCity });
                let fromStatename = "";
                if (
                  state == "" &&
                  _.filter(data["results"][0]["address_components"], function(
                    data
                  ) {
                    return data.types[0] === "administrative_area_level_1";
                  }).length > 0
                ) {
                  state = _.filter(
                    data["results"][0]["address_components"],
                    function(data) {
                      return data.types[0] === "administrative_area_level_1";
                    }
                  )[0].short_name;

                  fromStatename = _.filter(
                    data["results"][0]["address_components"],
                    function(data) {
                      return data.types[0] === "administrative_area_level_1";
                    }
                  )[0].long_name;
                }

                var GetRate = this.state.GetRate;
                GetRate.FromCity =
                  FinalCity.length > 0 ? FinalCity[0].City_code : "";
                GetRate.FromFedExCity = null;
                GetRate.FromUPSCity = null;
                GetRate.FromState = state && state.length === 2 ? state : "";
                GetRate.FromZipCode = zip;

                if (GetRate.FromCountry.CountryCode === "CN") {
                  var SelectedCity =
                    FinalCity.length > 0
                      ? {
                          value: FinalCity[0].City_code,
                          label: FinalCity[0].Name,
                        }
                      : { label: "Select City" };
                  this.setState({
                    GetRate: GetRate,
                    FromState: state,
                    FromFedExSelectedCity: SelectedCity,
                    fromStateName: fromStatename,
                  });
                } else {
                  var SelectedCity =
                    GetRate.FromCountry.CountryCode === "US"
                      ? {
                          value: FinalCity[0].City_code,
                          label: FinalCity[0].Name,
                        }
                      : { value: "Not Required", label: "Not Required" };
                  this.setState({
                    GetRate: GetRate,
                    FromState: state,
                    FromSelectedCity: SelectedCity,
                    fromStateName: fromStatename,
                  });
                }
                if (FinalCity.length === 0) {
                  var CityData = {
                    CityType: "FedEx",
                    CountryId: GetRate.FromCountry.CountryID,
                  };
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
                    .catch((err) => {
                      console.log("No FedEx city found", err);
                    });
                } else {
                  this.setState({ FromFedExCityList: [] });
                }
              } else if (data["results"][0]) {
                var FinalCity = [];
                var city = "";
                var state = "";

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
                    return data.types[0] === "administrative_area_level_1";
                  }).length > 0
                ) {
                  city = _.filter(
                    data["results"][0]["address_components"],
                    function(data) {
                      return data.types[0] === "administrative_area_level_1";
                    }
                  )[0].long_name;
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
                } else if (city == "") {
                  city = "";
                }
                let fromStatename = "";
                if (
                  state == "" &&
                  _.filter(data["results"][0]["address_components"], function(
                    data
                  ) {
                    return data.types[0] === "administrative_area_level_1";
                  }).length > 0
                ) {
                  state = _.filter(
                    data["results"][0]["address_components"],
                    function(data) {
                      return data.types[0] === "administrative_area_level_1";
                    }
                  )[0].short_name;

                  fromStatename = _.filter(
                    data["results"][0]["address_components"],
                    function(data) {
                      return data.types[0] === "administrative_area_level_1";
                    }
                  )[0].long_name;
                }

                FinalCity.push({
                  Citycode: city,
                  CityName: city,
                });

                this.setState({
                  FromCityList: [
                    {
                      City_code: FinalCity[0].Citycode,
                      Name: FinalCity[0].CityName,
                    },
                  ],
                  FromCity: FinalCity[0].Citycode,
                  FromState: state,
                  fromStateName: fromStatename,
                });

                var GetRate = this.state.GetRate;
                GetRate.FromCity = FinalCity[0].Citycode;
                GetRate.FromFedExCity = null;
                GetRate.FromUPSCity = null;
                GetRate.FromState = state && state.length === 2 ? state : "";
                GetRate.FromZipCode = zip;

                if (GetRate.FromCountry.CountryCode === "CN") {
                  var SelectedCity =
                    FinalCity.length > 0
                      ? {
                          value: FinalCity[0].Citycode,
                          label: FinalCity[0].CityName,
                        }
                      : { label: "Select City" };
                  this.setState({
                    GetRate: GetRate,
                    FromFedExSelectedCity: SelectedCity,
                  });
                } else {
                  var SelectedCity =
                    GetRate.FromCountry.CountryCode === "US"
                      ? {
                          value: FinalCity[0].Citycode,
                          label: FinalCity[0].CityName,
                        }
                      : { value: "Not Required", label: "Not Required" };
                  this.setState({
                    GetRate: GetRate,
                    FromSelectedCity: SelectedCity,
                  });
                }
                if (FinalCity.length === 0) {
                  var CityData = {
                    CityType: "FedEx",
                    CountryId: GetRate.FromCountry.CountryID,
                  };
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
                    .catch((err) => {
                      console.log("No FedEx city found", err);
                    });
                } else {
                  this.setState({ FromFedExCityList: [] });
                }
              } else {
                this.setState({ FromCityList: [] });
                var GetRate = this.state.GetRate;
                GetRate.FromCity = null;
                GetRate.FromFedExCity = null;
                GetRate.FromUPSCity = null;
                GetRate.FromState = null;
                GetRate.FromZipCode = "";
                this.setState({ GetRate: GetRate });
              }
            } else {
              cogoToast.error("Zip code not found");
              this.setState({ FromCityList: [] });
              var GetRate = this.state.GetRate;
              GetRate.FromCity = null;
              GetRate.FromFedExCity = null;
              GetRate.FromUPSCity = null;
              GetRate.FromState = null;
              GetRate.FromZipCode = "";
              this.setState({ GetRate: GetRate });
            }
            this.hideLoader();
          });
      } else if (this.state.GetRate.FromCountry.IsFedexCity === 0) {
        var GetRate = this.state.GetRate;
        GetRate.FromCity = null;
        GetRate.FromFedExCity = null;
        GetRate.FromUPSCity = null;
        GetRate.FromState = null;
        GetRate.FromZipCode = zip;
        this.setState({ GetRate: GetRate });
      } else {
        var GetRate = this.state.GetRate;
        GetRate.FromCity = null;

        GetRate.FromZipCode = zip;
        this.setState({ GetRate: GetRate });
      }
    } else {
      var GetRate = this.state.GetRate;
      GetRate.FromZipCode = zip;
      this.setState({ GetRate: GetRate, FromFedExSelectedCity: {} });
    }
    this.setState({ disableBtn: 1 });
  };

  ChangeToZipUS = (e) => {
    this.setState({ disableBtn: 0 });
    if (e.target.name === "ToZipCode") {
      if (
        !e.target.value ||
        e.target.value === undefined ||
        e.target.value === null
      ) {
        this.setState({ ToZipError: false });
        this.show("ToZipCode", true, "ToZipError", "Please enter To zipcode");
      } else {
        this.setState({ ToZipError: false });
        this.show("ToZipCode", false, "ToZipError", "");
      }
    }
    var zip = e.target.value;
    if (zip.length) {
      this.showLoader();
      var SelectedCity = { value: null, label: null };
      this.setState({
        ToFedExSelectedCity:
          this.state.GetRate.ToCountry.IsFedexCity === 1
            ? (this.state.ToFedExCity = this.state.ToFedExSelectedCity)
            : { label: "Select City" },
      });
      this.setState({ ToUPSSelectedCity: SelectedCity });
      this.setState({ ToSelectedCity: SelectedCity });

      fetch(CommonConfig.zipCodeAPIKey(zip, this.state.ToSelectedCountry.label))
        .then((result) => result.json())
        .then((data) => {
          if (data["status"] === "OK") {
            if (
              data["results"][0] &&
              data["results"][0].hasOwnProperty("postcode_localities")
            ) {
              var FinalCity = [];
              var state = "";
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

              this.setState({ ToCityList: FinalCity });
              let toStatename = "";
              if (
                state == "" &&
                _.filter(data["results"][0]["address_components"], function(
                  data
                ) {
                  return data.types[0] === "administrative_area_level_1";
                }).length > 0
              ) {
                state = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    return data.types[0] === "administrative_area_level_1";
                  }
                )[0].short_name;

                toStatename = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    return data.types[0] === "administrative_area_level_1";
                  }
                )[0].long_name;
              }

              var GetRate = this.state.GetRate;
              GetRate.ToCity =
                FinalCity.length > 0 ? FinalCity[0].City_code : "";
              GetRate.ToFedExCity = null;
              GetRate.ToUPSCity = null;
              GetRate.ToState = state && state.length === 2 ? state : "";
              GetRate.ToZipCode = zip;
              this.setState({
                GetRate: GetRate,
                toStateName: toStatename,
                ToState: state,
              });
              if (GetRate.ToCountry.CountryCode === "CN") {
                var SelectedCity =
                  FinalCity.length > 0
                    ? {
                        value: FinalCity[0].City_code,
                        label: FinalCity[0].Name,
                      }
                    : { label: "Select City" };
                this.setState({
                  GetRate: GetRate,
                  ToState: state,
                  ToFedExSelectedCity: SelectedCity,
                });
              } else {
                var SelectedCity =
                  GetRate.ToCountry.CountryCode === "US"
                    ? {
                        value: FinalCity[0].City_code,
                        label: FinalCity[0].Name,
                      }
                    : { value: "Not Required", label: "Not Required" };
                this.setState({
                  GetRate: GetRate,
                  ToState: state,
                  ToSelectedCity: SelectedCity,
                });
              }
              if (FinalCity.length === 0) {
                var CityData = {
                  CityType: "FedEx",
                  CountryId: GetRate.ToCountry.CountryID,
                };
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
                    console.log("No FedEx city found", err);
                  });
              } else {
                this.setState({ ToFedExCityList: [] });
              }
            } else if (data["results"][0]) {
              var FinalCity = [];
              var city = "";
              var state = "";
              var GetRate = this.state.GetRate;

              if (
                city == "" &&
                _.filter(data["results"][0]["address_components"], function(
                  data
                ) {
                  return data.types[0] === "locality";
                }).length > 0 &&
                GetRate.ToCountry.CountryCode !== "RU"
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
                }).length > 0 &&
                GetRate.ToCountry.CountryCode !== "RU"
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
                }).length > 0 &&
                GetRate.ToCountry.CountryCode !== "RU"
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
                }).length > 0 &&
                GetRate.ToCountry.CountryCode !== "RU"
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
              } else if (
                city == "" &&
                _.filter(data["results"][0]["address_components"], function(
                  data
                ) {
                  return data.types[0] === "locality";
                }).length > 0 &&
                GetRate.ToCountry.CountryCode === "RU"
              ) {
                city = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    return data.types[0] === "locality";
                  }
                )[0].long_name;
              } else if (city == "") {
                city = "";
              }

              let toStatename = "";
              if (
                state == "" &&
                _.filter(data["results"][0]["address_components"], function(
                  data
                ) {
                  return data.types[0] === "administrative_area_level_1";
                }).length > 0
              ) {
                state = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    return data.types[0] === "administrative_area_level_1";
                  }
                )[0].short_name;
                toStatename = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    return data.types[0] === "administrative_area_level_1";
                  }
                )[0].long_name;
              }

              FinalCity.push({
                Citycode: city,
                CityName: city,
              });

              this.setState({
                ToCityList: [
                  {
                    City_code: FinalCity[0].Citycode,
                    Name: FinalCity[0].CityName,
                  },
                ],
                ToCity: FinalCity[0].Citycode,
                toStateName: toStatename,
                ToState: state,
              });

              GetRate.ToCity = FinalCity[0].Citycode;
              GetRate.ToFedExCity =
                GetRate.ToFedExCity != null ? GetRate.ToFedExCity : null;
              GetRate.ToUPSCity = null;
              GetRate.ToState = state && state.length === 2 ? state : "";
              GetRate.ToZipCode = zip;

              if (GetRate.ToCountry.CountryCode === "CN") {
                var SelectedCity =
                  FinalCity.length > 0
                    ? {
                        value: FinalCity[0].Citycode,
                        label: FinalCity[0].CityName,
                      }
                    : { label: "Select City" };
                this.setState({
                  GetRate: GetRate,
                  ToFedExSelectedCity: SelectedCity,
                });
              } else {
                var SelectedCity =
                  GetRate.ToCountry.CountryCode === "US"
                    ? {
                        value: FinalCity[0].Citycode,
                        label: FinalCity[0].CityName,
                      }
                    : { value: "Not Required", label: "Not Required" };
                this.setState({
                  GetRate: GetRate,
                  ToSelectedCity: SelectedCity,
                });
              }
              if (FinalCity.length === 0) {
                var CityData = {
                  CityType: "FedEx",
                  CountryId: GetRate.ToCountry.CountryID,
                };
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
                    console.log("No FedEx city found", err);
                  });
              } else {
                this.setState({ ToFedExCityList: [] });
              }
            } else {
              this.setState({ ToCityList: [] });
              var GetRate = this.state.GetRate;
              GetRate.ToFedExCity = null;
              GetRate.ToUPSCity = null;
              GetRate.ToCity = null;
              GetRate.ToState = null;
              GetRate.ToZipCode = "";
              this.setState({ GetRate: GetRate });
            }
          } else {
            cogoToast.error("Zip code not found");
            this.setState({ ToCityList: [] });
            var GetRate = this.state.GetRate;
            // GetRate.ToFedExCity = null;
            GetRate.ToUPSCity = null;
            GetRate.ToCity = null;
            GetRate.ToState = null;
            GetRate.ToZipCode = zip;
            this.setState({ GetRate: GetRate });
          }
          this.hideLoader();
        });
    } else {
      var GetRate = this.state.GetRate;
      GetRate.ToZipCode = zip;
      this.setState({ GetRate: GetRate, ToFedExSelectedCity: {} });
    }
    this.setState({ disableBtn: 1 });
  };
  changeWeightType(e) {
    if (e.target.value === "KG") {
      this.setState({
        SelectedDimensitionType: "CM",
      });
    } else {
      this.setState({
        SelectedDimensitionType: "Inches",
      });
    }
    this.setState({
      SelectedWeightType: e.target.value,
    });

    debugger;
  }
  PackageTypeChange(e) {
    this.setState({ SelectedPackageType: e.target.value });
    var GetRate = this.state.GetRate;
    GetRate.PackageType = e.target.value;

    if (GetRate.PackageType == "Envelope") {
      this.setState({
        IsPackage: false,
        PackageDetails: [this.state.ObjEnvelope],
      });

      GetRate.TotalWeight = 0.5;
      GetRate.TotalChargableWeight = 0.5;
      GetRate.TotalInsuredValue = 0.0;
      GetRate.PackageNumber = 1;
      this.setState({ GetRate: GetRate });
    } else {
      this.setState({
        IsPackage: true,
        PackageDetails: [this.state.ObjPackage],
      });

      GetRate.TotalWeight = "";
      GetRate.TotalInsuredValue = "";
      GetRate.TotalChargableWeight = "";
      this.setState({ GetRate: GetRate });
    }
  }

  ChangeResidential = (e) => {
    this.setState({ SelectedResidential: e.target.value });
    if (e.target.value == "yes") {
      this.setState({ IsResidential: true });
    } else {
      this.setState({ IsResidential: false });
    }
  };

  handleChange(date) {
    this.setState({ StartDate: moment(date).toDate() });
  }

  changedropdown(e, type) {
    if (type === "PackedType") {
      this.setState({ packageWeight: e.target.value });
      debugger;
    }
  }
  AddNewRowData = function() {
    if (this.state.PackageDetails.length >= this.state.MaxPackageCount) {
      alert("Sorry you can not add more packages.");
    } else {
      var PackageDetails = this.state.PackageDetails;
      PackageDetails.push(this.state.ObjPackage);
      this.setState({ PackageDetails: PackageDetails });
      this.Calculate();
    }
  };

  DeleteRowData = (DeleteIndex) => (evt) => {
    var PackageDetails = this.state.PackageDetails;
    PackageDetails.splice(DeleteIndex, 1);
    this.setState({ PackageDetails: PackageDetails }, function() {
      this.Calculate();
    });
  };

  InputValidate = (name, PIndex) => (evt) => {
    let x = document.getElementsByName("PackageWeight");

    const NewPackageDetails = this.state.PackageDetails.map(
      (Package, index) => {
        if (PIndex == index) {
          if (name == "PackageNumber") {
            if (
              (evt.target.value === "" ||
                CommonConfig.RegExp.number.test(evt.target.value)) &&
              Number(evt.target.value) <= 999
            ) {
              return { ...Package, PackageNumber: evt.target.value };
            } else {
              return { ...Package, PackageNumber: Package.PackageNumber };
            }
          } else if (name == "PackageWeight") {
            if (
              (evt.target.value === "" ||
                CommonConfig.RegExp.number.test(evt.target.value)) &&
              Number(evt.target.value) <= 999
            ) {
              return {
                ...Package,
                PackageWeight: evt.target.value.replace(/^0+/, ""),
              };
            } else {
              return { ...Package, PackageWeight: Package.PackageWeight };
            }
          } else if (name == "PackageWidth") {
            if (
              (evt.target.value === "" ||
                CommonConfig.RegExp.number.test(evt.target.value)) &&
              Number(evt.target.value) <= 99
            ) {
              return {
                ...Package,
                PackageWidth: evt.target.value.replace(/^0+/, ""),
              };
            } else {
              return { ...Package, PackageWidth: Package.PackageWidth };
            }
          } else if (name == "PackageLength") {
            if (
              (evt.target.value === "" ||
                CommonConfig.RegExp.number.test(evt.target.value)) &&
              Number(evt.target.value) <= 99
            ) {
              return {
                ...Package,
                PackageLength: evt.target.value.replace(/^0+/, ""),
              };
            } else {
              return { ...Package, PackageLength: Package.PackageLength };
            }
          } else if (name == "PackageHeight") {
            if (
              (evt.target.value === "" ||
                CommonConfig.RegExp.number.test(evt.target.value)) &&
              Number(evt.target.value) <= 99
            ) {
              return {
                ...Package,
                PackageHeight: evt.target.value.replace(/^0+/, ""),
              };
            } else {
              return { ...Package, PackageHeight: Package.PackageHeight };
            }
          } else if (name == "PackageChargableWeight") {
            return {
              ...Package,
              PackageChargableWeight: evt.target.value.replace(/^0+/, ""),
            };
          } else if (name == "PackageInsuredValue") {
            if (
              (evt.target.value === "" ||
                CommonConfig.RegExp.number.test(evt.target.value)) &&
              Number(evt.target.value) <= 10000
            ) {
              return {
                ...Package,
                PackageInsuredValue: evt.target.value.replace(/^0+/, ""),
              };
            } else {
              return {
                ...Package,
                PackageInsuredValue: Package.PackageInsuredValue,
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
    if (
      this.state.GetRate.FromCountry.CountryCode &&
      this.state.GetRate.ToCountry.CountryCode
    ) {
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
        debugger;
        if (
          this.state.GetRate.FromCountry.CountryCode == "US" &&
          this.state.GetRate.ToCountry.CountryCode == "US"
        ) {
          if (this.state.SelectedWeightType === "KG") {
            Total =
              Math.ceil(parseFloat((WE * LE * HE) / 5000)) *
              PackageDetails[i].PackageNumber;
          } else {
            Total =
              Math.ceil(parseFloat((WE * LE * HE) / 166)) *
              PackageDetails[i].PackageNumber;
          }
        } else {
          if (this.state.SelectedWeightType === "KG") {
            Total =
              Math.ceil(parseFloat((WE * LE * HE) / 5000)) *
              PackageDetails[i].PackageNumber;
          } else {
            Total =
              Math.ceil(parseFloat((WE * LE * HE) / 139)) *
              PackageDetails[i].PackageNumber;
          }
        }

        // if (
        //   this.state.GetRate.FromCountry.CountryCode == "IN" &&
        //   this.state.GetRate.ToCountry.CountryCode == "US"
        // ) {
        //   Total =
        //     Math.ceil(parseFloat(parseFloat(Total) / parseFloat(2.2))) *
        //     PackageDetails[i].PackageNumber;
        // }

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

  handleZipChange = (e, type) => {
    var zip = e.target.value;
    if (type === "fromzipcode") {
      this.setState({ FromZipCode: zip });
    } else if (type === "tozipcode") {
      this.setState({ ToZipCode: zip });
    }
  };

  sendMailBlur = (event, type) => {
    if (type == "ContactName") {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          dialogNameErr: true,
          dialogNameHelperText: "Please enter name",
        });
      } else {
        this.setState({
          dialogNameErr: false,
          dialogNameHelperText: "",
        });
      }
    } else if (type == "Email") {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          dialogEmailErr: true,
          dialogEmailHelperText: "Please enter email",
        });
      } else if (!event.target.value.match(CommonConfig.RegExp.email)) {
        this.setState({
          dialogEmailErr: true,
          dialogEmailHelperText: "Please enter valid email",
        });
      } else {
        this.setState({
          dialogEmailErr: false,
          dialogEmailHelperText: "",
        });
      }
    } else if (type == "Phone") {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          dialogPhoneErr: true,
          dialogPhoneHelperText: "Please enter phone",
        });
      } else if (!event.target.value.match(CommonConfig.RegExp.phoneNumber)) {
        this.setState({
          dialogPhoneErr: true,
          dialogPhoneHelperText: "Please enter valid phone",
        });
      } else if (
        event.target.value.length < 5 ||
        event.target.value.length > 15
      ) {
        this.setState({
          dialogPhoneErr: true,
          dialogPhoneHelperText: "Please enter valid phone",
        });
      } else {
        this.setState({
          dialogPhoneErr: false,
          dialogPhoneHelperText: "",
        });
      }
    }
  };

  handleBlur = (event, type) => {
    if (type === "fromzipcode") {
      var zip = event.target.value;

      if (CommonConfig.isEmpty(zip)) {
        this.setState({
          FromZipCode: zip,
          fromZipCodeErr: true,
          fromZipCodeHelperText: "Please enter from Zip Code ",
        });
      } else if (zip.length > 7) {
        this.setState({
          FromZipCode: zip,
          fromZipCodeErr: true,
          fromZipCodeHelperText: "From Zip Code is not valid ",
        });
      } else {
        this.ChangeFromZipUS(event);
        this.setState({
          FromZipCode: zip,
          fromZipCodeErr: false,
          fromZipCodeHelperText: "",
        });
      }
    } else if (type === "tozipcode") {
      var zip = event.target.value;

      if (CommonConfig.isEmpty(zip)) {
        this.setState({
          ToZipCode: zip,
          toZipCodeErr: true,
          toZipCodeHelperText: "Please enter to Zip Code ",
        });
      } else if (zip.length > 7) {
        this.setState({
          ToZipCode: zip,
          toZipCodeErr: true,
          toZipCodeHelperText: "To Zip Code is not valid ",
        });
      } else {
        this.ChangeToZipUS(event);
        this.setState({
          ToZipCode: zip,
          toZipCodeErr: false,
          toZipCodeHelperText: "",
        });
      }
    }
  };

  handleChange_Value1(type) {
    if (type === "FromCity") {
      let selectedCity = this.state.FromSelectedCity.value;

      if (!selectedCity || selectedCity == undefined || selectedCity == null) {
        this.setState({
          fromCityError: true,
          fromCityHelperText: "Please Select from City",
        });
      } else {
        this.setState({ fromCityError: false });
      }
    }

    if (type === "FromFedExCity") {
      let selectedCity = this.state.FromFedExSelectedCity.value;

      if (
        selectedCity == "" ||
        selectedCity == undefined ||
        selectedCity == null
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
        selectedCity == "" ||
        selectedCity == undefined ||
        selectedCity == null
      ) {
        this.setState({
          fromUpsCityError: true,
          fromUpsCityHelperText: "Please select from ups city",
        });
      } else {
        this.setState({ fromUpsCityError: false, fromUpsCityHelperText: "" });
      }
    }

    if (type === "ToCity") {
      let selectedCity = this.state.ToSelectedCity.value;

      if (
        selectedCity == "" ||
        selectedCity == undefined ||
        selectedCity == null
      ) {
        this.setState({
          toCityError: true,
          toCityHelperText: "Please select to city",
        });
      } else {
        this.setState({ toCityError: false, toCityHelperText: "" });
      }
    }

    if (type === "ToFedExCity") {
      let selectedCity = this.state.ToFedExSelectedCity.value;

      if (
        selectedCity == "" ||
        selectedCity == undefined ||
        selectedCity == null
      ) {
        this.setState({
          toFedExCityError: true,
          toFedExCityHelperText: "Please select to fedex city",
        });
      } else {
        this.setState({ toFedExCityError: false, toFedExCityHelperText: "" });
      }
    }

    if (type === "ToUPSCity") {
      let selectedCity = this.state.ToUPSSelectedCity.value;

      if (
        selectedCity == "" ||
        selectedCity == undefined ||
        selectedCity == null
      ) {
        this.setState({
          toUpsCityError: true,
          toUpsCityHelperText: "Please select to ups city",
        });
      } else {
        this.setState({ toUpsCityError: false, toUpsCityHelperText: "" });
      }
    }
  }

  async GetRateData() {
    this.showLoader();
    var FinalGetRate = {};
    var UpsData = {};
    this.state.GetRate.FromCountry.FromZipCodeOptional = false;
    this.state.GetRate.ToCountry.ToZipCodeOptional = false;
    if (
      this.state.GetRate.FromCountry.IsFedexCity === 1 &&
      this.state.GetRate.FromCountry.IsUpsCity === 1
    ) {
      this.state.GetRate.FromCountry.FromZipCodeOptional = true;
    }
    if (
      this.state.GetRate.ToCountry.IsFedexCity === 1 &&
      this.state.GetRate.ToCountry.IsUpsCity === 1
    ) {
      this.state.GetRate.ToCountry.ToZipCodeOptional = true;
    }
    FinalGetRate.PackageType = this.state.GetRate.PackageType;
    // FinalGetRate.WeightType = this.state.GetRate.WeightType;
    FinalGetRate.WeightType = this.state.SelectedWeightType;
    UpsData.FromCountry = JSON.stringify(this.state.GetRate.FromCountry);

    UpsData.FromCity =
      this.state.GetRate.FromCity != null &&
      this.state.GetRate.FromCity.value &&
      this.state.GetRate.FromCity.value !== undefined
        ? this.state.GetRate.FromCity.value
        : this.state.GetRate.FromCity;
    UpsData.FromUPSCity = this.state.GetRate.FromUPSCity;
    UpsData.FromFedExCity = this.state.GetRate.FromFedExCity;
    UpsData.FromZipCode = this.state.GetRate.FromZipCode;
    UpsData.FromStateProvinceCode = this.state.GetRate.FromState
      ? this.state.GetRate.FromState
      : "";

    UpsData.ToCountry = JSON.stringify(this.state.GetRate.ToCountry);

    UpsData.ToCity =
      this.state.GetRate.ToCity !== null &&
      this.state.GetRate.ToCity.value &&
      this.state.GetRate.ToCity.value !== undefined
        ? this.state.GetRate.ToCity.value
        : this.state.GetRate.ToCity;
    UpsData.ToUPSCity = this.state.GetRate.ToUPSCity;
    UpsData.ToFedExCity = this.state.GetRate.ToFedExCity;
    UpsData.ToZipCode = this.state.GetRate.ToZipCode;
    UpsData.ToStateProvinceCode = this.state.GetRate.ToState
      ? this.state.GetRate.ToState
      : "";

    FinalGetRate.UpsData = UpsData;

    var PackageNumber = [];
    var Weight = [];
    var DimeL = [];
    var DimeW = [];
    var DimeH = [];
    var ChargableWeight = [];
    var InsuredValues = [];

    var PackagedetailsFinalValues = [];

    var TotalPackageNumber = 0;
    var TotalLength = 0;
    var TotalWidth = 0;
    var TotalHeight = 0;
    var TotalInsuredValues = 0;

    for (var i = 0; i < this.state.PackageDetails.length; i++) {
      if (this.state.PackageDetails[i].PackageNumber) {
        TotalPackageNumber =
          TotalPackageNumber +
          parseInt(this.state.PackageDetails[i].PackageNumber);
        PackageNumber.push(
          this.state.PackageDetails[i].PackageNumber.toString()
        );
      } else {
        this.state.PackageDetails[i].PackageNumber = "1";
        TotalPackageNumber =
          TotalPackageNumber +
          parseInt(this.state.PackageDetails[i].PackageNumber);
        PackageNumber.push(
          this.state.PackageDetails[i].PackageNumber.toString()
        );
      }

      Weight.push(this.state.PackageDetails[i].PackageWeight.toString());

      if (this.state.PackageDetails[i].PackageLength.toString()) {
        DimeL.push(this.state.PackageDetails[i].PackageLength.toString());
      } else {
        this.state.PackageDetails[i].PackageLength = "1";
        DimeL.push(this.state.PackageDetails[i].PackageLength.toString());
      }

      if (this.state.PackageDetails[i].PackageWidth) {
        DimeW.push(this.state.PackageDetails[i].PackageWidth.toString());
      } else {
        this.state.PackageDetails[i].PackageWidth = "1";
        DimeW.push(this.state.PackageDetails[i].PackageWidth.toString());
      }

      if (this.state.PackageDetails[i].PackageHeight) {
        DimeH.push(this.state.PackageDetails[i].PackageHeight.toString());
      } else {
        this.state.PackageDetails[i].PackageHeight = "1";
        DimeH.push(this.state.PackageDetails[i].PackageHeight.toString());
      }

      if (this.state.PackageDetails[i].PackageChargableWeight) {
        ChargableWeight.push(
          this.state.PackageDetails[i].PackageChargableWeight.toString()
        );
      }

      if (this.state.PackageDetails[i].PackageInsuredValue) {
        InsuredValues.push(
          this.state.PackageDetails[i].PackageInsuredValue.toString()
        );
      } else {
        this.state.PackageDetails[i].PackageInsuredValue = "0";
        InsuredValues.push(
          this.state.PackageDetails[i].PackageInsuredValue.toString()
        );
      }
      TotalLength += parseInt(this.state.PackageDetails[i].PackageLength);
      TotalWidth += parseInt(this.state.PackageDetails[i].PackageWidth);
      TotalHeight += parseInt(this.state.PackageDetails[i].PackageHeight);
      TotalInsuredValues += parseInt(
        this.state.PackageDetails[i].PackageInsuredValue
      );
    }
    this.Calculate();

    FinalGetRate.PackageNumber = PackageNumber;
    FinalGetRate.Weight = Weight;
    FinalGetRate.DimeL = DimeL;
    FinalGetRate.DimeW = DimeW;
    FinalGetRate.DimeH = DimeH;
    FinalGetRate.TotalLength = TotalLength;
    FinalGetRate.TotalWidth = TotalWidth;
    FinalGetRate.TotalInsuredValues = TotalInsuredValues;
    FinalGetRate.TotalHeight = TotalHeight;
    FinalGetRate.ChargableWeight = ChargableWeight;
    FinalGetRate.InsuredValues = InsuredValues;
    FinalGetRate.SelectedWeightType = this.state.SelectedWeightType;
    if (this.state.GetRate.TotalInsuredValue) {
      FinalGetRate.Total = this.state.GetRate.TotalInsuredValue.toString();
    }

    if (this.state.GetRate.TotalWeight) {
      FinalGetRate.TotalWeight = this.state.GetRate.TotalChargableWeight;
    }
    FinalGetRate.IsResidencial =
      this.state.SelectedResidential === "yes" ? true : false;
    FinalGetRate.IsPickUp = this.state.GetRate.PickUp === "Yes" ? true : false;

    FinalGetRate.WeightCount = Weight.length;
    FinalGetRate.LengthCount = DimeL.length;
    FinalGetRate.WidthCount = DimeW.length;
    FinalGetRate.HeightCount = DimeH.length;

    FinalGetRate.PackCount = TotalPackageNumber.toString();
    FinalGetRate.PackageDetailsCount = TotalPackageNumber;
    FinalGetRate.PackageDetailsText = TotalPackageNumber.toString();

    if (this.state.GetRate.TotalWeight) {
      FinalGetRate.EnvelopeWeightLBSText = this.state.GetRate.TotalChargableWeight;
    }

    FinalGetRate.ShipDate = this.state.StartDate;
    FinalGetRate.PackageDetails = this.state.PackageDetails;
    FinalGetRate.AgentCode = CommonConfig.loggedInUserData().PersonID;
    this.setState({ FinalGetRate: FinalGetRate });

    var data = JSON.stringify({ quoteData: FinalGetRate });

    let res = await api.post("getQuote/getRates", data);
    debugger;
    if (res.success) {
      this.setState({ finalGetResults: res.data, Loading: false });
    } else {
      this.hideLoader();
      cogoToast.error("Something Went Wrong");
    }

    return this.state.finalGetResults;
  }
  // ============== SEND MAIL VALIDATE ================================
  validateSendMailData() {
    let IsFormValid = true;

    if (CommonConfig.isEmpty(this.state.ContactName)) {
      IsFormValid = false;
      this.setState({
        dialogNameErr: true,
        dialogNameHelperText: "Please enter name",
      });
    } else if (CommonConfig.isEmpty(this.state.EmailAddress)) {
      IsFormValid = false;
      this.setState({
        dialogEmailErr: true,
        dialogEmailHelperText: "Please enter email",
      });
    } else if (!this.state.EmailAddress.match(CommonConfig.RegExp.email)) {
      IsFormValid = false;
      this.setState({
        dialogEmailErr: true,
        dialogEmailHelperText: "Please enter valid email",
      });
    } else if (CommonConfig.isEmpty(this.state.Phone)) {
      IsFormValid = false;
      this.setState({
        dialogPhoneErr: true,
        dialogPhoneHelperText: "Please enter phone",
      });
    } else if (!this.state.Phone.match(CommonConfig.RegExp.phoneNumber)) {
      IsFormValid = false;
      this.setState({
        dialogPhoneErr: true,
        dialogPhoneHelperText: "Please enter valid phone",
      });
    } else if (this.state.Phone.length < 5 || this.state.Phone.length > 15) {
      IsFormValid = false;
      this.setState({
        dialogPhoneErr: true,
        dialogPhoneHelperText: "Please enter valid phone",
      });
    } else {
      IsFormValid = true;
      this.setState({
        dialogPhoneErr: false,
        dialogEmailHelperText: "",
        dialogNameHelperText: "",
        dialogPhoneHelperText: "",
      });
    }
    return IsFormValid;
  }

  validate() {
    var GetRate = this.state.GetRate;
    let IsFormValid = true;

    if (
      GetRate.FromCountry.CountryCode == "US" ||
      GetRate.FromCountry.IsUpsCity == 0
    ) {
      if (CommonConfig.isEmpty(this.state.FromZipCode)) {
        IsFormValid = false;
        this.setState({
          fromZipCodeErr: true,
          fromZipCodeHelperText: "Please enter From ZipCode",
        });
      } else if (this.state.FromZipCode.length > 7) {
        IsFormValid = false;
        this.setState({
          fromZipCodeErr: true,
          fromZipCodeHelperText: "From Zipcode is not valid ",
        });
      } else {
        this.setState({ fromZipCodeErr: false, fromZipCodeHelperText: "" });
      }
    }

    if (
      GetRate.ToCountry.CountryCode === "US" ||
      GetRate.ToCountry.IsUpsCity === 0
    ) {
      if (CommonConfig.isEmpty(this.state.ToZipCode)) {
        IsFormValid = false;
        this.setState({
          toZipCodeErr: true,
          toZipCodeHelperText: "Please enter to Zipcode",
        });
      } else if (this.state.ToZipCode.length > 7) {
        IsFormValid = false;
        this.setState({
          toZipCodeErr: true,
          toZipCodeHelperText: "To Zipcode is not valid ",
        });
      } else {
        this.setState({ toZipCodeErr: false, toZipCodeHelperText: "" });
      }
    }

    if (GetRate.FromCountry.IsFedexCity == 1) {
      let selectedCity = this.state.FromFedExSelectedCity.value;

      if (
        selectedCity === "" ||
        selectedCity === undefined ||
        selectedCity === null
      ) {
        IsFormValid = false;
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

    if (GetRate.ToCountry.IsFedexCity == 1) {
      let selectedCity = this.state.ToFedExSelectedCity.value;

      if (
        selectedCity === "" ||
        selectedCity === undefined ||
        selectedCity === null
      ) {
        IsFormValid = false;
        this.setState({
          toFedExCityError: true,
          toFedExCityHelperText: "Please select to fedex city",
        });
      } else {
        this.setState({ toFedExCityError: false, toFedExCityHelperText: "" });
      }
    }

    if (GetRate.FromCountry.IsUpsCity == 1) {
      let selectedCity = this.state.FromUPSSelectedCity.value;

      if (
        selectedCity === "" ||
        selectedCity === undefined ||
        selectedCity === null
      ) {
        IsFormValid = false;
        this.setState({
          fromUpsCityError: true,
          fromUpsCityHelperText: "Please select from ups city",
        });
      } else {
        this.setState({ fromUpsCityError: false, fromUpsCityHelperText: "" });
      }
    }

    if (GetRate.ToCountry.IsUpsCity == 1) {
      let selectedCity = this.state.ToUPSSelectedCity.value;

      if (
        selectedCity === "" ||
        selectedCity === undefined ||
        selectedCity === null
      ) {
        IsFormValid = false;
        this.setState({
          toUpsCityError: true,
          toUpsCityHelperText: "Please select to ups city",
        });
      } else {
        this.setState({ toUpsCityError: false, toUpsCityHelperText: "" });
      }
    }

    if (
      GetRate.FromCountry.CountryCode === "US" ||
      GetRate.FromCountry.IsFedexCity === 0
    ) {
      let selectedCity = this.state.FromSelectedCity.value;

      if (!selectedCity || selectedCity == undefined || selectedCity == null) {
        IsFormValid = false;
        this.setState({
          fromCityError: true,
          fromCityHelperText: "Please Select from City",
        });
      } else {
        this.setState({ fromCityError: false });
      }
    }

    if (
      GetRate.ToCountry.CountryCode === "US" ||
      GetRate.ToCountry.IsFedexCity === 0
    ) {
    }
    if (!Object.values(this.state.FromSelectedCity).length) {
      IsFormValid = false;
      this.setState({
        fromCityError: true,
        fromCityHelperText: "Please select from city",
      });
    } else {
      this.setState({ fromCityError: false, fromCityHelperText: "" });
    }

    return IsFormValid;
  }
  sendState() {
    return this.state;
  }
  ResetGetRateData = () => {
    var GetRate = this.state.GetRate;

    if (
      GetRate.FromCountry.CountryCode == "US" ||
      GetRate.FromCountry.IsUpsCity == 0
    ) {
      document.getElementById("FromZipCode").value = "";
    }
    if (
      GetRate.ToCountry.CountryCode == "US" ||
      GetRate.ToCountry.IsUpsCity == 0
    ) {
      document.getElementById("ToZipCode").value = "";
    }

    GetRate.FromCountry = "";
    GetRate.ToCountry = "";
    GetRate.TotalWeight = "";
    GetRate.TotalChargableWeight = "";
    GetRate.TotalInsuredValue = "";
    this.state.finalGetResults = [];
    var ObjPackage = this.state.ObjPackage;
    ObjPackage.PackageNumber = 1;
    ObjPackage.PackageWeight = "";
    ObjPackage.PackageWidth = "";
    ObjPackage.PackageLength = "";
    ObjPackage.PackageHeight = "";
    ObjPackage.PackageChargableWeight = "";
    ObjPackage.PackageInsuredValue = 0;

    let x = document.getElementsByName("PackageWeight");
    x[0].className = "form-control";

    this.setState({
      PackageDetails: [this.state.ObjPackage],
      GetRate: GetRate,
      finalGetResults: [],
      CountryList: [],
      SelectedPackageType: "Package",
      FromCityList: [],
      ToCityList: [],
      FromSelectedCity: {},
      ToSelectedCity: {},
      FromFedExSelectedCity: {},
      FromUPSSelectedCity: {},
      ToFedExSelectedCity: {},
      ToUPSSelectedCity: {},
      fromZipCodeErr: false,
      FromZipCode: "",
      ToZipCode: "",
      fromZipCodeHelperText: "",
      toZipCodeErr: false,
      toZipCodeHelperText: "",
      fromCityError: false,
      fromCityHelperText: "",
      fromFedexCityError: false,
      fromFedexCityHelperText: "",
      fromUpsCityError: false,
      fromUpsCityHelperText: "",
      toCityError: false,
      toCityHelperText: "",
      toFedExCityError: false,
      toFedExCityHelperText: "",
      toUpsCityError: false,
      toUpsCityHelperText: "",
    });

    this.GetCountry();
    this.hideLoader();
  };

  sendGetRateEmail = async (rateArr) => {
    try {
      api.post("getQuote/GetRateImages").then((res) => {
        if (res.data) {
          let imgArr = res.data[0];
          rateArr.map((rate) => {
            let imgURL = imgArr.filter(
              (x) => x.MainServiceName === rate.MainServiceName
            );
            rate.urlIMG = imgURL[0] ? imgURL[0]["IMGURL"] : "";
          });
          this.setState({
            sendmailopen: true,
            rateArr: rateArr,
          });
        }
      });
    } catch (err) {}
  };

  htmlDecode(input) {
    var e = document.createElement("div");
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  handleapiSendMail = () => {
    if (this.validateSendMailData()) {
      this.setState({
        sendmailopen: false,
      });

      this.showLoader();
      let getRate = this.state.GetRate;

      let packgList = this.state.PackageDetails;
      packgList.map((obj) => {
        obj.PackageType = this.state.IsPackage ? 1 : 2;
        obj.Quantity = obj.PackageNumber;
        obj.ActualWeight = obj.PackageWeight;
        obj.DimensionL = obj.PackageLength;
        obj.DimensionW = obj.PackageWidth;
        obj.DimensionH = obj.PackageHeight;
        obj.ChargeableWeight = obj.PackageChargableWeight;
        obj.CFT = 0;
        obj.SortOrder = "";
        obj.Status = "Active";
        obj.SalesLeadPackageDetailID = null;
      });

      let data = {
        userid: CommonConfig.loggedInUserData().PersonID,
        SalesLeadManagementID: null,
        ManagedBy: null,
        SalesLeadDate: null,
        FromCountryID: getRate.FromCountry.CountryID,
        ToCountryID: getRate.ToCountry.CountryID,
        SalesLeadsType: "",
        ContactName: this.state.ContactName,
        CompanyName: "",
        Email: this.state.EmailAddress,
        PhoneNumber: this.state.Phone,
        FromCity: getRate.FromCity
          ? getRate.FromCity.value
            ? getRate.FromCity.value
            : getRate.FromCity
          : "",
        FromState: this.state.fromStateName,
        FromZipCode: getRate.FromZipCode,
        ToCity: getRate.ToCity
          ? getRate.ToCity.value
            ? getRate.ToCity.value
            : getRate.ToCity
          : getRate.ToFedExCity
          ? getRate.ToFedExCity.value
            ? getRate.ToFedExCity.value
            : getRate.ToFedExCity
          : "",
        ToState: this.state.toStateName,
        ToZipCode: getRate.ToZipCode,
        SalesLeadFollowupDate: null,
        TentativeMoveDate: null,
        ReferredBy: null,
        IPAddress: null,
        MACAddress: null,
        DeliveryType:
          getRate.Residential === "Yes" ? "Residential" : "Commercial",
        ProposalStatus: "New",
        PackageList: packgList,
        NoteList: [],
      };
      let packagetype;
      if (packgList[0].PackageType === 1) {
        packagetype = "Boxes";
      } else if (packgList[0].PackageType === 2) {
        packagetype = "Document";
      } else if (packgList[0].PackageType === 3) {
        packagetype = "Furniture";
      } else if (packgList[0].PackageType === 4) {
        packagetype = "Television";
      } else if (packgList[0].PackageType === 5) {
        packagetype = "Auto";
      }
      let manageData = {
        Email: this.state.EmailAddress,
        Phone: this.state.Phone,
        PersonID: CommonConfig.loggedInUserData().PersonID,
        newpackagetype: "",
      };
      if (CommonConfig.isEmpty(data.ManagedBy) || data.ManagedBy === 0) {
        api
          .post("salesLead/getManagedByPhoneOREmail", manageData)
          .then((result) => {
            if (result.success) {
              if (result.data.length > 0) {
                data.ManagedBy = result.data[0].ManagedBy;
              }
            }
          })
          .catch((err) => {
            console.log("error", err);
          });
      }
      setTimeout(() => {
        try {
          api
            .post("salesLead/addSalesLead", data)
            .then((res) => {
              if (res.success) {
                var arr1 = [];
                var arr2 = [];
                var arr = [];

                this.state.rateArr.forEach((obj) => {
                  if (obj.IsError) {
                    arr2.push(obj);
                  } else {
                    arr1.push(obj);
                  }
                });
                arr = arr1.concat(arr2);
                if (arr.length > 0) {
                  let emailData = {
                    SalesLeadID: res.data,
                    ChargableWeight: this.state.FinalGetRate.ChargableWeight,
                    RateData: arr,
                    IsResidential: this.state.IsResidential,
                    RateType: "Hub",
                  };
                  api
                    .post("salesLead/sendGetRateEmail", emailData)
                    .then((response) => {
                      this.hideLoader();
                      if (response.success) {
                        cogoToast.success(response.data.message);
                      }
                    })
                    .catch((err) => {
                      console.log("error", err);
                    });
                } else {
                  this.hideLoader();
                }
              }
            })
            .catch((err) => {
              console.log("error", err);
            });
        } catch (err) {}
      }, 2000);
    }
  };

  changeInput = (e, type) => {
    if (type === "ContactName") {
      if (CommonConfig.isEmpty(e.target.value)) {
        this.setState({
          dialogNameHelperText: "Please Enter Contact Name",
        });
      } else {
        this.setState({
          ContactName: e.target.value,
        });
      }
    } else if (type === "Phone") {
      this.setState({
        Phone: e.target.value,
      });
    } else if (type === "Email") {
      this.setState({
        EmailAddress: e.target.value,
      });
    }
  };
  render() {
    const FromCountryOptions = this.state.CountryList.map((fromCountry) => {
      return { value: fromCountry.CountryID, label: fromCountry.CountryName };
    });
    const ToCountryOptions = this.state.CountryList.map((tocountry) => {
      return { value: tocountry.CountryID, label: tocountry.CountryName };
    });

    var FromFedExCityListDisplay = this.state.FromFedExCityList.map((city) => {
      return { value: city.CityCode, label: city.CityName };
    });
    var FromUPSCityListDisplay = this.state.FromUPSCityList.map((city) => {
      return { value: city.CityCode, label: city.CityName };
    });
    var FromCityListDisplay = this.state.FromCityList.map((city) => {
      return { value: city.City_code, label: city.Name };
    });
    var ToFedExCityListDisplay = this.state.ToFedExCityList.map((city) => {
      return { value: city.CityCode, label: city.CityName };
    });
    var ToUPSCityListDisplay = this.state.ToUPSCityList.map((city) => {
      return { value: city.CityCode, label: city.CityName };
    });
    var ToCityListDisplay = this.state.ToCityList.map((city) => {
      return { value: city.City_code, label: city.Name };
    });
    var FromSection = (
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <FormControl fullWidth>
            <Autocomplete
              options={FromCountryOptions}
              id="FromCountry"
              getOptionLabel={(option) => option.label}
              value={this.state.FromSelectedCountry}
              autoSelect
              onChange={(event, value) => this.ChangeFromCountry(value)}
              renderInput={(params) => (
                <TextField {...params} label="From Country" fullWidth />
              )}
            />
          </FormControl>
        </GridItem>

        {this.state.GetRate.FromCountry.CountryCode === "US" ? (
          <GridItem xs={12} sm={12} md={4}>
            <FormControl fullWidth>
              <CustomInput
                id="FromZipCode"
                labelText="From Zip Code"
                fullWidth
                error={this.state.fromZipCodeErr}
                helperText={this.state.fromZipCodeHelperText}
                inputProps={{
                  onBlur: (e) => this.handleBlur(e, "fromzipcode"),
                  onChange: (e) => this.handleZipChange(e, "fromzipcode"),
                  value: this.state.FromZipCode,
                }}
              />
            </FormControl>
          </GridItem>
        ) : this.state.GetRate.FromCountry.IsFedexCity === 1 ? (
          <GridItem xs={12} sm={12} md={4}>
            <FormControl fullWidth>
              <Autocomplete
                options={FromFedExCityListDisplay}
                id="FromFedExCity"
                getOptionLabel={(option) => option.label}
                value={this.state.FromFedExSelectedCity}
                autoSelect
                onBlur={(e) => this.handleChange_Value1("FromFedExCity")}
                onChange={(event, value) => this.ChangeFromCity(value, "FedEx")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="From FedEX City"
                    fullWidth
                    error={this.state.fromFedexCityError}
                    helperText={this.state.fromFedexCityHelperText}
                  />
                )}
              />
            </FormControl>
          </GridItem>
        ) : (
          <GridItem xs={12} sm={12} md={4}>
            <FormControl fullWidth>
              <CustomInput
                id="FromZipCode"
                labelText="From Zip Code"
                fullWidth
                error={this.state.fromZipCodeErr}
                helperText={this.state.fromZipCodeHelperText}
                inputProps={{
                  onBlur: (e) => this.handleBlur(e, "fromzipcode"),
                  onChange: (e) => this.handleZipChange(e, "fromzipcode"),
                  value: this.state.FromZipCode,
                }}
              />
            </FormControl>
          </GridItem>
        )}

        {this.state.GetRate.FromCountry.CountryCode === "US" ||
        (this.state.GetRate.FromCountry.IsFedexCity === 0 &&
          this.state.GetRate.FromCountry.IsUpsCity !== 1) ? (
          this.state.GetRate.FromCountry.CountryCode === "CN" ? (
            <Grid item xs={4}>
              <Autocomplete
                options={FromFedExCityListDisplay}
                id="FromFedExCity"
                getOptionLabel={(option) => option.label}
                value={this.state.FromFedExSelectedCity}
                autoSelect
                onBlur={(e) => this.handleChange_Value1("FromFedExCity")}
                onChange={(event, value) => this.ChangeFromCity(value, "FedEx")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="From FedEX City"
                    fullWidth
                    error={this.state.fromFedexCityError}
                    helperText={this.state.fromFedexCityHelperText}
                  />
                )}
              />
            </Grid>
          ) : (
            <GridItem xs={12} sm={12} md={4}>
              <Autocomplete
                options={FromCityListDisplay}
                id="FromCity"
                getOptionLabel={(option) => option.label}
                value={this.state.FromSelectedCity}
                disabled={
                  this.state.GetRate.FromCountry.CountryCode !== "US" &&
                  this.state.GetRate.FromCountry.IsFedexCity === 0
                    ? true
                    : false
                }
                autoSelect
                onBlur={(e) => this.handleChange_Value1("FromCity")}
                onChange={(event, value) => this.ChangeFromCity(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="From City"
                    fullWidth
                    error={this.state.fromCityError}
                    helperText={this.state.fromCityHelperText}
                  />
                )}
              />
            </GridItem>
          )
        ) : this.state.GetRate.FromCountry.IsUpsCity === 1 ? (
          <GridItem xs={12} sm={12} md={4}>
            <FormControl fullWidth>
              <Autocomplete
                options={FromUPSCityListDisplay}
                id="FromUPSCity"
                getOptionLabel={(option) => option.label}
                value={this.state.FromUPSSelectedCity}
                autoSelect
                onBlur={(e) => this.handleChange_Value1("FromUPSCity")}
                onChange={(event, value) => this.ChangeFromCity(value, "UPS")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="From City(UPS)"
                    fullWidth
                    error={this.state.fromUpsCityError}
                    helperText={this.state.fromUpsCityHelperText}
                  />
                )}
              />
            </FormControl>
          </GridItem>
        ) : (
          <GridItem xs={12} sm={12} md={4}>
            <FormControl fullWidth>
              <TextField
                id="FromZipCode"
                label="From Zip Code"
                fullWidth
                error={this.state.fromZipCodeErr}
                value={this.state.FromZipCode}
                helperText={this.state.fromZipCodeHelperText}
                onChange={(e) => this.handleZipChange(e, "fromzipcode")}
                onBlur={(e) => this.ChangeFromZipUS(e)}
              />
            </FormControl>
          </GridItem>
        )}
      </GridContainer>
    );

    var ToSection = (
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Autocomplete
            options={ToCountryOptions}
            id="toCountry"
            getOptionLabel={(option) => option.label}
            value={this.state.ToSelectedCountry}
            autoSelect
            onChange={(event, value) => this.ChangeToCountry(value)}
            renderInput={(params) => (
              <TextField {...params} label="To Country" fullWidth />
            )}
          />
        </Grid>

        {this.state.GetRate.ToCountry.CountryCode === "US" ? (
          <Grid item xs={4}>
            <FormControl fullWidth>
              <CustomInput
                labelText="To Zip Code"
                id="ToZipCode"
                fullWidth
                error={this.state.toZipCodeErr}
                helperText={this.state.toZipCodeHelperText}
                inputProps={{
                  value: this.state.ToZipCode,
                  onBlur: (e) => this.handleBlur(e, "tozipcode"),
                  onChange: (e) => this.handleZipChange(e, "tozipcode"),
                }}
              />
            </FormControl>
          </Grid>
        ) : this.state.GetRate.ToCountry.IsFedexCity === 1 ? (
          <Grid item xs={4}>
            <Autocomplete
              options={ToFedExCityListDisplay}
              id="ToFedExCity"
              getOptionLabel={(option) => option.label}
              value={this.state.ToFedExSelectedCity}
              autoSelect
              onBlur={(e) => this.handleChange_Value1("ToFedExCity")}
              onChange={(event, value) => this.ChangeToCity(value, "FedEx")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="To City (FedEx)"
                  fullWidth
                  error={this.state.toFedExCityError}
                  helperText={this.state.toFedExCityHelperText}
                />
              )}
            />
          </Grid>
        ) : (
          <Grid item xs={4}>
            <FormControl fullWidth>
              <CustomInput
                id="ToZipCode"
                labelText="To Zip Code"
                fullWidth
                error={this.state.toZipCodeErr}
                helperText={this.state.toZipCodeHelperText}
                inputProps={{
                  value: this.state.ToZipCode,
                  onBlur: (e) => this.handleBlur(e, "tozipcode"),
                  onChange: (e) => this.handleZipChange(e, "tozipcode"),
                }}
              />
            </FormControl>
          </Grid>
        )}

        {this.state.GetRate.ToCountry.CountryCode === "US" ||
        (this.state.GetRate.ToCountry.IsFedexCity === 0 &&
          this.state.GetRate.ToCountry.IsUpsCity !== 1) ? (
          this.state.GetRate.ToCountry.CountryCode === "CN" ? (
            <Grid item xs={4}>
              <Autocomplete
                options={ToFedExCityListDisplay}
                id="ToFedExCity"
                getOptionLabel={(option) => option.label}
                value={this.state.ToFedExSelectedCity}
                autoSelect
                onBlur={(e) => this.handleChange_Value1("ToFedExCity")}
                onChange={(event, value) => this.ChangeToCity(value, "FedEx")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="To City"
                    fullWidth
                    error={this.state.toFedExCityError}
                    helperText={this.state.toFedExCityHelperText}
                  />
                )}
              />
            </Grid>
          ) : (
            <Grid item xs={4}>
              <Autocomplete
                options={ToCityListDisplay}
                id="toCity"
                getOptionLabel={(option) => option.label}
                value={this.state.ToSelectedCity}
                disabled={
                  this.state.GetRate.ToCountry.CountryCode !== "US" &&
                  this.state.GetRate.ToCountry.IsFedexCity === 0
                    ? true
                    : false
                }
                autoSelect
                onBlur={(e) => this.handleChange_Value1("ToCity")}
                onChange={(event, value) => this.ChangeToCity(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="To City"
                    fullWidth
                    error={this.state.toCityError}
                    helperText={this.state.toCityHelperText}
                  />
                )}
              />
            </Grid>
          )
        ) : this.state.GetRate.ToCountry.IsUpsCity === 1 ? (
          <Grid item xs={4}>
            <Autocomplete
              options={ToUPSCityListDisplay}
              id="ToUPSCity"
              getOptionLabel={(option) => option.label}
              value={this.state.ToUPSSelectedCity}
              autoSelect
              onBlur={(e) => this.handleChange_Value1("ToUPSCity")}
              onChange={(event, value) => this.ChangeToCity(value, "UPS")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="To City (UPS)"
                  fullWidth
                  error={this.state.toUpsCityError}
                  helperText={this.state.toUpsCityHelperText}
                />
              )}
            />
          </Grid>
        ) : (
          <Grid item xs={4}>
            <FormControl fullWidth>
              <CustomInput
                id="ToZipCode"
                labelText="To Zip Code"
                fullWidth
                error={this.state.toZipCodeErr}
                helperText={this.state.toZipCodeHelperText}
                inputProps={{
                  value: this.state.ToZipCode,
                  onBlur: (e) => this.handleBlur(e, "tozipcode"),
                  onChange: (e) => this.handleZipChange(e, "tozipcode"),
                }}
              />
            </FormControl>
          </Grid>
        )}
      </Grid>
    );

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
            <div class="inline-input">
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
            </div>
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
          <td style={{ width: "160px" }}>
            <input
              type="text"
              name="PackageInsuredValue"
              id="PackageInsuredValue"
              value={Package.PackageInsuredValue}
              onChange={this.InputValidate("PackageInsuredValue", i)}
              disabled={!this.state.IsPackage}
            />
          </td>
          {/* {this.state.PackageDetails.length > 1 ? */}
          <td style={{ width: 45 }}>
            {i > 0 ? (
              <DeleteIcon value={" Delete"} onClick={this.DeleteRowData(i)} />
            ) : null}
          </td>
          {/* : null} */}
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

        <GridContainer>
          <GridItem md="12">
            {FromSection}
            {ToSection}
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem md="4">
            <div className="select-spl">
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel
                  htmlFor="selectshipmenttype"
                  className={classes.selectLabel}
                >
                  Residential
                </InputLabel>
                <Select
                  onChange={(event) => this.ChangeResidential(event)}
                  inputProps={{ name: "residential?", id: "residential" }}
                  defaultValue="no"
                >
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="yes"
                  >
                    {" "}
                    Yes{" "}
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="no"
                  >
                    {" "}
                    No{" "}
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </GridItem>
          <GridItem md={4}>
            <div className="select-spl">
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel
                  htmlFor="selectshipmenttype"
                  className={classes.selectLabel}
                >
                  Packages Type
                </InputLabel>
                <Select
                  fullWidth={true}
                  MenuProps={{ className: classes.selectMenu }}
                  classes={{ select: classes.select }}
                  onChange={(event) => this.PackageTypeChange(event)}
                  value={this.state.SelectedPackageType}
                  inputProps={{ name: "residential?", id: "packagetype" }}
                  defaultValue="Package"
                >
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="Package"
                  >
                    {" "}
                    Package{" "}
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected,
                    }}
                    value="Envelope"
                  >
                    {" "}
                    Envelope{" "}
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </GridItem>
          <GridItem md={4}>
            <div className="date-spl slam">
              <InputLabel className={classes.label}>Ship Date</InputLabel>
              <FormControl fullWidth>
                <Datetime
                  defaultValue={Datetime.moment()}
                  timeFormat={false}
                  inputProps={{ placeholder: "Ship Date" }}
                  selected={this.state.StartDate}
                  onChange={this.handleChange}
                  isValidDate={valid}
                  closeOnSelect={true}
                />
              </FormControl>
            </div>
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <h3>Package Details</h3>
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <div className="package-table">
              <table>
                <thead>
                  <tr>
                    <th>No of Packages</th>
                    <th>
                      <div className="with-drp">
                        Weight
                        <FormControl className={classes.formControl} fullWidth>
                          <Select
                            fullWidth={true}
                            MenuProps={{ className: classes.selectMenu }}
                            classes={{ select: classes.select }}
                            onChange={(event) => this.changeWeightType(event)}
                            value={this.state.SelectedWeightType}
                            inputProps={{
                              name: "residential?",
                              id: "packagetype",
                            }}
                            defaultValue="LB"
                          >
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected,
                              }}
                              value="LB"
                            >
                              {" "}
                              LB{" "}
                            </MenuItem>
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected,
                              }}
                              value="KG"
                            >
                              {" "}
                              KG{" "}
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </th>
                    <th>
                      <div className="with-drp">
                        {this.state.dimenstionType}{" "}
                        <FormControl className={classes.formControl} fullWidth>
                          <Select
                            //   fullWidth={true}
                            disabled={true}
                            MenuProps={{ className: classes.selectMenu }}
                            classes={{ select: classes.select }}
                            onChange={(event) => this.changeWeightType(event)}
                            value={this.state.SelectedDimensitionType}
                            inputProps={{
                              name: "residential?",
                              id: "packagetype",
                            }}
                            defaultValue={this.state.SelectedDimensitionType}
                          >
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected,
                              }}
                              value="Inches"
                            >
                              {" "}
                              Inches{" "}
                            </MenuItem>
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected,
                              }}
                              value="CM"
                            >
                              {" "}
                              CM{" "}
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </th>
                    <th>
                      <div className="with-drp">
                        <span className="nowrap">Chargeble Weight </span>
                        <FormControl className={classes.formControl} fullWidth>
                          <Select
                            disabled={true}
                            readOnly={true}
                            fullWidth={true}
                            MenuProps={{ className: classes.selectMenu }}
                            classes={{ select: classes.select }}
                            onChange={(event) => this.changeWeightType(event)}
                            value={this.state.SelectedWeightType}
                            inputProps={{
                              name: "residential?",
                              id: "packagetype",
                            }}
                            defaultValue="LB"
                          >
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected,
                              }}
                              value="LB"
                            >
                              {" "}
                              LB{" "}
                            </MenuItem>
                            <MenuItem
                              classes={{
                                root: classes.selectMenuItem,
                                selected: classes.selectMenuItemSelected,
                              }}
                              value="KG"
                            >
                              {" "}
                              KG{" "}
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </th>
                    <th>Insured Value (USD)*</th>
                    <th></th>
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
                    <td style={{ width: 45 }}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </GridItem>
        </GridContainer>

        <div>
          <Dialog
            maxWidth={671}
            open={this.state.sendmailopen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Send Email</DialogTitle>
            <DialogContent>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Contact Name"
                    id="contactname"
                    error={this.state.dialogNameErr}
                    helperText={this.state.dialogNameHelperText}
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      value: this.state.ContactName,
                      onChange: (event) => {
                        this.changeInput(event, "ContactName");
                      },
                      onBlur: (e) => this.sendMailBlur(e, "ContactName"),
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          className={classes.inputAdornment}
                        >
                          <Icon className={classes.inputAdornmentIcon}>
                            email
                          </Icon>
                        </InputAdornment>
                      ),
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Email"
                    id="Email"
                    error={this.state.dialogEmailErr}
                    helperText={this.state.dialogEmailHelperText}
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      value: this.state.EmailAddress,
                      onChange: (event) => {
                        this.changeInput(event, "Email");
                      },
                      onBlur: (e) => this.sendMailBlur(e, "Email"),
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          className={classes.inputAdornment}
                        >
                          <Icon className={classes.inputAdornmentIcon}>
                            email
                          </Icon>
                        </InputAdornment>
                      ),
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Phone"
                    id="Phone"
                    error={this.state.dialogPhoneErr}
                    helperText={this.state.dialogPhoneHelperText}
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      onChange: (event) => {
                        this.changeInput(event, "Phone");
                      },
                      onBlur: (e) => this.sendMailBlur(e, "Phone"),
                      value: this.state.Phone,
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          className={classes.inputAdornment}
                        >
                          <Icon className={classes.inputAdornmentIcon}>
                            email
                          </Icon>
                        </InputAdornment>
                      ),
                    }}
                  />
                </GridItem>
              </GridContainer>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.setState({ sendmailopen: false })}
                color="secondary"
              >
                Cancel
              </Button>

              <Button
                onClick={() => this.handleapiSendMail()}
                color="primary"
                autoFocus
              >
                Send
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}
export default withStyles()(Step1);
