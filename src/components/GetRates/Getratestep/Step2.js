import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "components/CustomButtons/Button.js";
import api from "../../../utils/apiClient";
import { CommonConfig } from "../../../utils/constant";
import cogoToast from "cogo-toast";
import _ from "lodash";
import moment from "moment";
import SimpleBackdrop from "../../../utils/general";

const useStyles = () => makeStyles(styles);
const classes = useStyles();

class Step2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      CountryList: [],
      Loading: false,
      FromCountry: {},
      ToCountry: {},
      FromSelectedCountry: {},
      ToSelectedCountry: {},
      FromSelectedCity: {},
      ToSelectedCity: {},
      FromCityList: [],
      ToCityList: [],

      PackageDetails: [],

      FromState: "",
      ToState: "",

      NoOfTv: 0,
      volumeAmount: "",

      FromZipCode: "",
      ToZipCode: "",

      TotalWeight: 0,
      TotalChargableWeight: 0,
      TotalInsuredValue: 0,
      TotalCFT: 0,

      No_TV: [
        { value: 0, label: "0" },
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        { value: 4, label: "4" },
        { value: 5, label: "5" },
        { value: 6, label: "6" },
        { value: 7, label: "7" },
        { value: 8, label: "8" },
        { value: 9, label: "9" },
        { value: 10, label: "10" },
      ],
      ObjPackage: {
        PackageNumber: 1,
        PackageWeight: "",
        PackageWidth: "",
        PackageLength: "",
        PackageHeight: "",
        PackageChargableWeight: "",
        PackageInsuredValue: 0,
        PackageCFT: 0,
      },
      pickUpValue: "Non FEDEX",
      PickUpType: [
        { value: "FEDEX", label: "FedEx" },
        { value: "Non FEDEX", label: "Non FedEx" },
      ],
      fromZipCodeErr: false,
      fromZipCodeHelperText: "",
      toZipCodeErr: false,
      toZipCodeHelperText: "",
      fromCityErr: false,
      fromCityHelperText: "",
      volumeErr: false,
      volumeHelperText: "",
    };
  }
  componentDidMount() {
    this.GetCountry();
    this.setState({ PackageDetails: [this.state.ObjPackage] });
  }
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

            var FromselectedCountryList = _.filter(Country, {
              CountryCode: "US",
            });
            var ToselectedCountryList = _.filter(Country, {
              CountryCode: "IN",
            });

            var FromSelectedCountry = {
              value: FromselectedCountryList[0].CountryID,
              label: FromselectedCountryList[0].CountryName,
            };

            var ToSelectedCountry = {
              value: ToselectedCountryList[0].CountryID,
              label: ToselectedCountryList[0].CountryName,
            };

            this.setState({
              FromSelectedCountry: FromSelectedCountry,
              ToSelectedCountry: ToSelectedCountry,
              FromCountry: FromselectedCountryList[0],
              ToCountry: ToselectedCountryList[0],
            });
          }
        })
        .catch((err) => {
          console.log("err...", err);
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {}
  }
  ResetGetRateData = () => {
    document.getElementById("fromzipcode").value = "";
    document.getElementById("tozipcode").value = "";

    var ObjPackage = {
      PackageNumber: 1,
      PackageWeight: "",
      PackageWidth: "",
      PackageLength: "",
      PackageHeight: "",
      PackageChargableWeight: "",
      PackageInsuredValue: 0,
      PackageCFT: 0,
    };

    this.setState({
      FromZipCode: "",
      ToZipCode: "",
      pickUpValue: "Non FEDEX",
      FromCityList: [],
      ToCityList: [],
      FromSelectedCity: {},
      ToSelectedCity: {},
      NoOfTv: 0,
      TotalWeight: 0,
      TotalChargableWeight: 0,
      TotalInsuredValue: 0,
      TotalCFT: 0,
      PackageDetails: [ObjPackage],
      fromZipCodeErr: false,
      fromZipCodeHelperText: "",
      toZipCodeErr: false,
      toZipCodeHelperText: "",
      fromCityErr: false,
      fromCityHelperText: "",
      volumeErr: false,
      volumeHelperText: "",
    });
  };

  handleBlur = (event, type) => {
    if (type === "volume") {
      let val = event.target.value;
      if (CommonConfig.isEmpty(val)) {
        this.setState({
          volumeAmount: val,
          volumeErr: true,
          volumeHelperText: "Please Enter Volume",
        });
      } else {
        this.setState({ volumeAmount: val });
      }
    } else if (type === "fromzipcode") {
      var zip = event.target.value;

      if (CommonConfig.isEmpty(zip)) {
        this.setState({
          FromZipCode: zip,
          fromZipCodeErr: true,
          fromZipCodeHelperText: "Please enter from Zipcode ",
        });
      } else if (zip.length < 5) {
        this.setState({
          FromZipCode: zip,
          fromZipCodeErr: true,
          fromZipCodeHelperText: "From Zipcode is not valid ",
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
          toZipCodeHelperText: "Please enter to Zipcode ",
        });
      } else if (zip.length < 6) {
        this.setState({
          ToZipCode: zip,
          toZipCodeErr: true,
          toZipCodeHelperText: "To Zipcode is not valid ",
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
  handleChange = (event, type) => {
    if (type === "volume") {
      let val = event.target.value;

      if (val === "" || CommonConfig.RegExp.number.test(val)) {
        this.setState({ volumeAmount: val });
      } else {
        this.setState({ volumeAmount: this.state.volumeAmount });
      }
    } else if (type === "fromzipcode") {
      var zip = event.target.value;

      if (zip.trim() !== zip || !zip.match(CommonConfig.RegExp.phoneNumber)) {
        this.setState({ FromZipCode: this.state.FromZipCode });
      } else if (zip.length > 5) {
        this.setState({ FromZipCode: this.state.FromZipCode });
      } else {
        this.setState({ FromZipCode: zip });
      }
    } else if (type === "tozipcode") {
      var zip = event.target.value;

      if (zip.trim() !== zip || !zip.match(CommonConfig.RegExp.phoneNumber)) {
        this.setState({ ToZipCode: this.state.ToZipCode });
      } else if (zip.length > 6) {
        this.setState({ ToZipCode: this.state.ToZipCode });
      } else {
        this.setState({ ToZipCode: zip });
      }
    }
  };

  AddNewRowData = function() {
    if (this.state.PackageDetails.length > 20) {
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
    const NewPackageDetails = this.state.PackageDetails.map(
      (Package, index) => {
        if (PIndex == index) {
          if (name == "PackageNumber") {
            return { ...Package, PackageNumber: evt.target.value };
          } else if (name == "PackageWeight") {
            if (
              (evt.target.value === "" ||
                CommonConfig.RegExp.number.test(evt.target.value)) &&
              Number(evt.target.value) <= 999
            ) {
              return { ...Package, PackageWeight: evt.target.value };
            } else {
              return { ...Package, PackageWeight: Package.PackageWeight };
            }
          } else if (name == "PackageWidth") {
            if (
              (evt.target.value === "" ||
                CommonConfig.RegExp.number.test(evt.target.value)) &&
              Number(evt.target.value) <= 99
            ) {
              return { ...Package, PackageWidth: evt.target.value };
            } else {
              return { ...Package, PackageWidth: Package.PackageWidth };
            }
          } else if (name == "PackageLength") {
            if (
              (evt.target.value === "" ||
                CommonConfig.RegExp.number.test(evt.target.value)) &&
              Number(evt.target.value) <= 99
            ) {
              return { ...Package, PackageLength: evt.target.value };
            } else {
              return { ...Package, PackageLength: Package.PackageLength };
            }
          } else if (name == "PackageHeight") {
            if (
              (evt.target.value === "" ||
                CommonConfig.RegExp.number.test(evt.target.value)) &&
              Number(evt.target.value) <= 99
            ) {
              return { ...Package, PackageHeight: evt.target.value };
            } else {
              return { ...Package, PackageHeight: Package.PackageHeight };
            }
          } else if (name == "PackageChargableWeight") {
            return { ...Package, PackageChargableWeight: evt.target.value };
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

  appendTV() {
    const No_OF_TV = this.state.No_TV;
    return No_OF_TV.map((no) => {
      return <MenuItem value={no.value}> {no.value} </MenuItem>;
    });
  }

  appendPickUPType() {
    const pickUpType = this.state.PickUpType;
    return pickUpType.map((type) => {
      return <MenuItem value={type.value}> {type.label} </MenuItem>;
    });
  }

  pickUpChange(e) {
    this.setState({ pickUpValue: e.target.value });
  }

  NoOfTvChange(e) {
    this.setState({ NoOfTv: e.target.value });
  }

  Calculate() {
    if (
      this.state.FromCountry.CountryCode &&
      this.state.ToCountry.CountryCode
    ) {
      var TotalChargeWeight = 0;
      var TotalInsuredValue = 0;
      var TotalWeight = 0;
      var TotalChargable = 0;
      var TotalCFT = 0;

      var PackageDetails = [...this.state.PackageDetails];
      for (var i = 0; i < PackageDetails.length; i++) {
        var WE = 0;
        var LE = 0;
        var HE = 0;
        var Insure = 0;
        var Total = 0;
        var Weight = 0;
        var Chargable = 0;
        var CFT = 0;

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
          this.state.FromCountry.CountryCode == "US" &&
          this.state.ToCountry.CountryCode == "US"
        ) {
          Total =
            Math.ceil(parseFloat((WE * LE * HE) / 166)) *
            PackageDetails[i].PackageNumber;
        } else {
          Total =
            Math.ceil(parseFloat((WE * LE * HE) / 139)) *
            PackageDetails[i].PackageNumber;
          CFT = (
            parseFloat((WE * LE * HE) / 1728) * PackageDetails[i].PackageNumber
          ).toFixed(2);
          PackageDetails[i].PackageCFT = CFT;
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
        TotalCFT = Number(TotalCFT + CFT);
      }

      this.setState({ PackageDetails: PackageDetails });

      if (this.state.TotalWeight > 0) {
        this.setState({ TotalWeight: TotalWeight });
      } else {
        this.setState({ TotalWeight: 1 });
      }

      if (TotalInsuredValue > 0) {
        this.setState({ TotalInsuredValue: TotalInsuredValue });
      } else {
        this.setState({ TotalInsuredValue: 0 });
      }

      if (TotalChargable > 0) {
        this.setState({ TotalChargableWeight: TotalChargable });
      } else {
        this.setState({ TotalChargableWeight: 0 });
      }

      if (TotalCFT > 0) {
        this.setState({ TotalCFT: Math.ceil(TotalCFT) });
      } else {
        this.setState({ TotalCFT: 0 });
      }
    }
  }

  ChangeFromCity = (event) => {
    this.setState({ FromSelectedCity: event });
  };

  ChangeFromZipUS = (e) => {
    var zip = e.target.value;

    if (zip.length) {
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
                var selectedCity = {
                  value: FinalCity[0].City_code,
                  label: FinalCity[0].Name,
                };
              } else if (CityData2.length > 0) {
                CityData2 = CityData2[0].long_name;
                FinalCity.push({
                  City_code: CityData2,
                  Name: CityData2,
                });
                var selectedCity = {
                  value: FinalCity[0].City_code,
                  label: FinalCity[0].Name,
                };
              } else if (CityData3.length > 0) {
                CityData3 = CityData3[0].long_name;
                FinalCity.push({
                  City_code: CityData3,
                  Name: CityData3,
                });
                var selectedCity = {
                  value: FinalCity[0].City_code,
                  label: FinalCity[0].Name,
                };
              } else if (CityData4.length > 0) {
                CityData4 = CityData4[0].long_name;
                FinalCity.push({
                  City_code: CityData4,
                  Name: CityData4,
                });
                var selectedCity = {
                  value: FinalCity[0].City_code,
                  label: FinalCity[0].Name,
                };
              }

              var state = _.filter(
                data["results"][0]["address_components"],
                function(data) {
                  return data.types[0] === "administrative_area_level_1";
                }
              )[0].short_name;
              if (countryShortName === this.state.FromSelectedCountry.label) {
                this.setState({
                  FromCityList: FinalCity,
                  FromZipCode: zip,
                  FromState: state,
                  FromSelectedCity: selectedCity,
                });
              } else {
                this.setState({
                  FromCityList: [],
                  FromZipCode: zip,
                  FromState: "",
                  FromSelectedCity: {},
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
                  return data.types[0] === "administrative_area_level_1";
                }).length > 0
              ) {

                // console.log("testing = 0" , data["results"][0]["address_components"])
                if(data["results"][0]["address_components"].types == undefined){
                  city = data["results"][0]["address_components"][1].long_name
                }else{
                  city = _.filter(
                    data["results"][0]["address_components"],
                    function(data) {
                      return data.types[0] === "administrative_area_level_2";
                    }
                  )[0].long_name;
                }
                
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

              var selectedCity = {
                value: FinalCity[0].City_code,
                label: FinalCity[0].Name,
              };

              if (countryShortName === this.state.FromSelectedCountry.label) {
                this.setState({
                  FromCityList: FinalCity,
                  FromZipCode: zip,
                  FromState: state,
                  FromSelectedCity: selectedCity,
                });
              } else {
                this.setState({
                  FromCityList: [],
                  FromZipCode: zip,
                  FromState: "",
                  FromSelectedCity: {},
                });
              }
            } else {
              this.setState({
                FromCityList: [],
                FromZipCode: "",
              });
            }
          } else {
            cogoToast.error("Zip code not found");
          }
        });
    }
  };

  ChangeToZipUS = (e) => {
    var zip = e.target.value;

    if (zip.length) {
      fetch(CommonConfig.zipCodeAPIKey(zip, this.state.ToSelectedCountry.label))
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
                var selectedCity = {
                  value: FinalCity[0].City_code,
                  label: FinalCity[0].Name,
                };
              } else if (CityData2.length > 0) {
                CityData2 = CityData2[0].long_name;
                FinalCity.push({
                  City_code: CityData2,
                  Name: CityData2,
                });
                var selectedCity = {
                  value: FinalCity[0].City_code,
                  label: FinalCity[0].Name,
                };
              } else if (CityData3.length > 0) {
                CityData3 = CityData3[0].long_name;
                FinalCity.push({
                  City_code: CityData3,
                  Name: CityData3,
                });
                var selectedCity = {
                  value: FinalCity[0].City_code,
                  label: FinalCity[0].Name,
                };
              } else if (CityData4.length > 0) {
                CityData4 = CityData4[0].long_name;
                FinalCity.push({
                  City_code: CityData4,
                  Name: CityData4,
                });
                var selectedCity = {
                  value: FinalCity[0].City_code,
                  label: FinalCity[0].Name,
                };
              }

              var state = _.filter(
                data["results"][0]["address_components"],
                function(data) {
                  return data.types[0] === "administrative_area_level_1";
                }
              )[0].short_name;
              if (countryShortName === this.state.ToSelectedCountry.label) {
                this.setState({
                  ToCityList: FinalCity,
                  ToZipCode: zip,
                  ToState: state,
                  ToSelectedCity: selectedCity,
                });
              } else {
                this.setState({
                  ToCityList: [],
                  ToZipCode: zip,
                  ToState: "",
                  ToSelectedCity: {},
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

              var selectedCity = {
                value: FinalCity[0].City_code,
                label: FinalCity[0].Name,
              };

              if (countryShortName === this.state.ToSelectedCountry.label) {
                this.setState({
                  ToCityList: FinalCity,
                  ToZipCode: zip,
                  ToState: state,
                  ToSelectedCity: selectedCity,
                });
              } else {
                this.setState({
                  ToCityList: [],
                  ToZipCode: zip,
                  ToState: "",
                  ToSelectedCity: {},
                });
              }
            } else {
              this.setState({
                ToCityList: [],
                ToZipCode: "",
                ToSelectedCity: {},
              });
            }
          } else {
            cogoToast.error("Zip code not found");
            this.setState({
              ToCityList: [],
              ToZipCode: "",
              ToSelectedCity: {},
            });
          }
        });
    }
  };

  async GetOceanRate() {
    this.showLoader();
    var FinalGetRate = {};

    FinalGetRate.FromCountry = JSON.stringify(this.state.FromCountry);
    FinalGetRate.ToCountry = JSON.stringify(this.state.ToCountry);
    FinalGetRate.FromCity =
      this.state.FromSelectedCity != null &&
      this.state.FromSelectedCity.value &&
      this.state.FromSelectedCity.value !== undefined
        ? this.state.FromSelectedCity.value
        : this.state.FromSelectedCity;
    FinalGetRate.ToCity =
      this.state.ToSelectedCity !== null &&
      this.state.ToSelectedCity.value &&
      this.state.ToSelectedCity.value !== undefined
        ? this.state.ToSelectedCity.value
        : this.state.ToSelectedCity;
    FinalGetRate.FromZipCode = this.state.FromZipCode;
    FinalGetRate.ToZipCode = this.state.ToZipCode;
    FinalGetRate.FromStateProvinceCode = this.state.FromState || "";
    FinalGetRate.ToStateProvinceCode = this.state.ToState || "";
    FinalGetRate.ShipDate = moment().toDate();

    var PackageNumber = [];
    var Weight = [];
    var DimeL = [];
    var DimeW = [];
    var DimeH = [];
    var ChargableWeight = [];
    var InsuredValues = [];

    var TotalPackageNumber = 0;
    var TotalLength = 0;
    var TotalWidth = 0;
    var TotalHeight = 0;
    var TotalInsuredValues = 0;
    var TotalCFT = 0;

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
      TotalCFT += Math.ceil(this.state.PackageDetails[i].PackageCFT);
    }

    FinalGetRate.PackageNumber = PackageNumber;
    FinalGetRate.Weight = Weight;
    FinalGetRate.DimeL = DimeL;
    FinalGetRate.DimeW = DimeW;
    FinalGetRate.DimeH = DimeH;
    FinalGetRate.TotalLength = TotalLength;
    FinalGetRate.TotalWidth = TotalWidth;
    FinalGetRate.TotalInsuredValues = TotalInsuredValues;
    FinalGetRate.TotalHeight = TotalHeight;
    FinalGetRate.TotalCFT =
      this.state.pickUpValue === "FEDEX" ? TotalCFT : this.state.volumeAmount;
    FinalGetRate.ChargableWeight = ChargableWeight;
    FinalGetRate.InsuredValues = InsuredValues;
    FinalGetRate.ShipDate = moment().toDate();
    FinalGetRate.PackageDetails = this.state.PackageDetails;
    FinalGetRate.AgentCode = CommonConfig.loggedInUserData().PersonID;

    FinalGetRate.WeightCount = Weight.length;
    FinalGetRate.LengthCount = DimeL.length;
    FinalGetRate.WidthCount = DimeW.length;
    FinalGetRate.HeightCount = DimeH.length;

    FinalGetRate.PackCount = TotalPackageNumber.toString();
    FinalGetRate.PackageDetailsCount = TotalPackageNumber;
    FinalGetRate.PackageDetailsText = TotalPackageNumber.toString();
    FinalGetRate.PickUpType = this.state.pickUpValue;
    FinalGetRate.NoOfTV = this.state.NoOfTv;

    if (this.state.TotalInsuredValue) {
      FinalGetRate.Total = this.state.TotalInsuredValue.toString();
    }

    if (this.state.TotalWeight) {
      FinalGetRate.TotalWeight = this.state.TotalChargableWeight;
    }

    var data = JSON.stringify(FinalGetRate);

    let res = await api.post("getQuote/getOceanRate", data);

    if (res.success) {
      this.setState({ finalGetResults: res.data, Loading: false });
    } else {
      this.hideLoader();
      cogoToast.error("Something Went Wrong");
    }

    return this.state.finalGetResults;
  }

  validate() {
    let IsFormValid = true;

    if (CommonConfig.isEmpty(this.state.FromZipCode)) {
      IsFormValid = false;
      this.setState({
        fromZipCodeErr: true,
        fromZipCodeHelperText: "Please enter From ZipCode",
      });
    } else if (this.state.FromZipCode.length < 5) {
      IsFormValid = false;
      this.setState({
        fromZipCodeErr: true,
        fromZipCodeHelperText: "From Zipcode is not valid ",
      });
    } else {
      this.setState({ fromZipCodeErr: false, fromZipCodeHelperText: "" });
    }

    if (CommonConfig.isEmpty(this.state.ToZipCode)) {
      IsFormValid = false;
      this.setState({
        toZipCodeErr: true,
        toZipCodeHelperText: "Please enter to Zipcode",
      });
    } else if (this.state.ToZipCode.length < 6) {
      IsFormValid = false;
      this.setState({
        toZipCodeErr: true,
        toZipCodeHelperText: "To Zipcode is not valid ",
      });
    } else {
      this.setState({ toZipCodeErr: false, toZipCodeHelperText: "" });
    }

    if (!Object.values(this.state.FromSelectedCity).length) {
      IsFormValid = false;
      this.setState({
        fromCityErr: true,
        fromCityHelperText: "Please select from city",
      });
    } else {
      this.setState({ fromCityErr: false, fromCityHelperText: "" });
    }

    if (this.state.pickUpValue === "Non FEDEX") {
      if (CommonConfig.isEmpty(this.state.volumeAmount)) {
        IsFormValid = false;
        this.setState({
          volumeErr: true,
          volumeHelperText: "Please enter volume",
        });
      }
    }

    return IsFormValid;
  }
  
  render() {
    const FromCountryOptions = this.state.CountryList.map((fromCountry) => {
      return { value: fromCountry.CountryID, label: fromCountry.CountryName };
    });
    const ToCountryOptions = this.state.CountryList.map((tocountry) => {
      return { value: tocountry.CountryID, label: tocountry.CountryName };
    });

    const FromCityListDisplay = this.state.FromCityList.map((city) => {
      return { value: city.City_code, label: city.Name };
    });
    const ToCityListDisplay = this.state.ToCityList.map((city) => {
      return { value: city.City_code, label: city.Name };
    });

    var FromSection = (
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <FormControl fullWidth>
            <Autocomplete
              disabled
              options={FromCountryOptions}
              id="FromCountry"
              getOptionLabel={(option) => option.label}
              value={this.state.FromSelectedCountry}
              autoSelect
              renderInput={(params) => (
                <TextField {...params} label="From Country" fullWidth />
              )}
            />
          </FormControl>
        </GridItem>

        <GridItem xs={12} sm={12} md={4}>
          <FormControl fullWidth>
            <CustomInput
              id="fromzipcode"
              labelText="From Zip Code"
              error={this.state.fromZipCodeErr}
              helperText={this.state.fromZipCodeHelperText}
              fullWidth
              inputProps={{
                value: this.state.FromZipCode,
                onBlur: (e) => this.handleBlur(e, "fromzipcode"),
                onChange: (e) => this.handleChange(e, "fromzipcode"),
                onFocus: () =>
                  this.setState({
                    fromZipCodeErr: false,
                    fromZipCodeHelperText: "",
                  }),
              }}
            />
          </FormControl>
        </GridItem>

        <GridItem xs={12} sm={12} md={4}>
          <Autocomplete
            options={FromCityListDisplay}
            id="FromCity"
            getOptionLabel={(option) => option.label}
            value={this.state.FromSelectedCity}
            autoSelect
            onChange={(event, value) => this.ChangeFromCity(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="From City"
                error={this.state.fromCityErr}
                helperText={this.state.fromCityHelperText}
                fullWidth
              />
            )}
          />
        </GridItem>
      </GridContainer>
    );

    var ToSection = (
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Autocomplete
            disabled
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

        <Grid item xs={4}>
          <FormControl fullWidth>
            <CustomInput
              id="tozipcode"
              labelText="To Zip Code"
              error={this.state.toZipCodeErr}
              helperText={this.state.toZipCodeHelperText}
              fullWidth
              inputProps={{
                value: this.state.ToZipCode,
                onBlur: (e) => this.handleBlur(e, "tozipcode"),
                onChange: (e) => this.handleChange(e, "tozipcode"),
                onFocus: () =>
                  this.setState({
                    toZipCodeErr: false,
                    toZipCodeHelperText: "",
                  }),
              }}
            />
          </FormControl>
        </Grid>

        <Grid item xs={4}>
          <Autocomplete
            options={ToCityListDisplay}
            id="toCity"
            value={this.state.ToSelectedCity}
            getOptionLabel={(option) => option.label}
            disabled
            autoSelect
            renderInput={(params) => (
              <TextField {...params} label="To City" fullWidth />
            )}
          />
        </Grid>
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
              onChange={this.InputValidate("PackageNumber", i)}
              value={Package.PackageNumber}
            />
          </td>
          <td>
            <input
              type="text"
              name="PackageWeight"
              id="PackageWeight"
              onChange={this.InputValidate("PackageWeight", i)}
              value={Package.PackageWeight}
            />
          </td>
          <td>
            <div className="inline-input">
              <input
                type="text"
                name="PackageLength"
                id="PackageLength"
                onChange={this.InputValidate("PackageLength", i)}
                value={Package.PackageLength}
              />

              <input
                type="text"
                name="PackageWidth"
                id="PackageWidth"
                onChange={this.InputValidate("PackageWidth", i)}
                value={Package.PackageWidth}
              />

              <input
                type="text"
                name="PackageHeight"
                id="PackageHeight"
                onChange={this.InputValidate("PackageHeight", i)}
                value={Package.PackageHeight}
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
          <td>
            <input
              type="text"
              name="PackageCFT"
              id="PackageCFT"
              disabled={true}
              value={Package.PackageCFT}
            />
          </td>
          {this.state.PackageDetails.length > 1 ? (
            <td>
              {i > 0 ? (
                <DeleteIcon value="Delete" onClick={this.DeleteRowData(i)} />
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

        <GridContainer>
          <GridItem md="12">{FromSection}</GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem md="12">{ToSection}</GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={12} sm={4} md={4}>
            <div className="select-spl">
              <FormControl className="mb18" fullWidth>
                <InputLabel
                  htmlFor="selectshipmenttype"
                  className={classes.selectLabel}
                >
                  No of TVs?
                </InputLabel>
                <Select
                  value={this.state.NoOfTv}
                  onChange={(event) => this.NoOfTvChange(event)}
                >
                  {this.appendTV()}
                </Select>
              </FormControl>
            </div>
          </GridItem>
          <GridItem xs={12} sm={4} md={4}>
            <div className="select-spl">
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel
                  htmlFor="selectshipmenttype"
                  className={classes.selectLabel}
                >
                  Pickup Type?
                </InputLabel>
                <Select
                  value={this.state.pickUpValue}
                  onChange={(event) => this.pickUpChange(event)}
                >
                  {this.appendPickUPType()}
                </Select>
              </FormControl>
            </div>
          </GridItem>
          {this.state.pickUpValue === "Non FEDEX" ? (
            <GridItem xs={12} sm={4} md={4}>
              <FormControl className={classes.formControl} fullWidth>
                <CustomInput
                  id="volume"
                  labelText="Enter Volume"
                  error={this.state.volumeErr}
                  helperText={this.state.volumeHelperText}
                  inputProps={{
                    value: this.state.volumeAmount,
                    onBlur: (event) => this.handleBlur(event, "volume"),
                    onChange: (event) => this.handleChange(event, "volume"),
                    onFocus: () =>
                      this.setState({ volumeErr: false, volumeHelperText: "" }),
                  }}
                />
              </FormControl>
            </GridItem>
          ) : null}
        </GridContainer>
        {this.state.pickUpValue === "FEDEX" ? (
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <h3>Package Details</h3>
              <div className="package-table">
                <table>
                  <thead>
                    <tr>
                      <th>No of Packages</th>
                      <th>Weight (lbs)*</th>
                      <th>Dimenstion (L + W + H in Inches)*</th>
                      <th>Chargeble Weight</th>
                      <th>CFT</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>{PackageDetails}</tbody>
                  <tfoot>
                    <tr>
                      <td>
                        <Button
                          value="Add New Row"
                          onClick={() => this.AddNewRowData()}
                        >
                          {" "}
                          Add New Row{" "}
                        </Button>
                      </td>
                      <td>
                        <input
                          type="number"
                          name="TotalWeight"
                          id="TotalWeight"
                          value={this.state.TotalWeight}
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
                          value={this.state.TotalChargableWeight}
                          min="0"
                          max="999999999"
                          disabled={true}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="TotalCFT"
                          id="TotalCFT"
                          value={this.state.TotalCFT}
                          min="0"
                          max="999999999"
                          disabled={true}
                        />
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </GridItem>
          </GridContainer>
        ) : null}
      </div>
    );
  }
}

export default withStyles()(Step2);
