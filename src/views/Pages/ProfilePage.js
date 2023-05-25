import React, { Component } from "react";
import PropTypes from "prop-types";
import api from "../../utils/apiClient";
import cogoToast from "cogo-toast";
import SimpleBackdrop from "../../utils/general";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import _ from "lodash";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";

import InputLabel from "@material-ui/core/InputLabel";
import Button from "components/CustomButtons/Button.js";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import CustomInput from "components/CustomInput/CustomInput.js";
import { green } from "@material-ui/core/colors";
import { red } from "@material-ui/core/colors";
import FormHelperText from "@material-ui/core/FormHelperText";

import PermContactCalendarOutlinedIcon from "@material-ui/icons/PermContactCalendarOutlined";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import { CommonConfig } from "../../utils/constant";
import Typography from "@material-ui/core/Typography";
import {
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
  MDBContainer,
} from "mdbreact";

const useStyles = makeStyles(styles);

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      userName: "",
      Email: "",
      EmailID: "",
      Password: "",
      ConfirmPassword: "",
      CurrentPassword: "",
      Mobile: "",
      MobileID: "",

      fullnameErr: false,
      usernameErr: false,
      emailErr: false,
      passwordErr: false,
      mobileErr: false,
      confirmpasswordErr: false,
      currentpasswordErr: false,
      Loading: false,

      fullnameHelperText: "",
      usernameHelperText: "",
      emailHelperText: "",
      passwordHelperText: "",
      confirmpasswordHelperText: "",
      currentpasswordHelperText: "",
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
      ManagedByValue: null,
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
      openPassword: false,

      PaperSizeList: [],
      PaperSize: "",
      PaperReviewLink: "",
    };
  }

  async componentDidMount() {
    await this.getCountry();
    this.getUserDetail();
    this.getPaperSizeList();
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
            pId: CommonConfig.loggedInUserData().PersonID,
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

  reCallApi = () => {
    this.getUserDetail();
  };

  getUserDetail() {
    let data = {
      UserID: CommonConfig.loggedInUserData().PersonID,
    };
    this.showLoader();
    try {
      api
        .post("userManagement/getUserDetails", data)
        .then((res) => {
          this.hideLoader();
          if (res.success) {
            let userData = res.data;
            if (userData.UserDetails[0]) {
              var Country = this.state.CountryList.filter(
                (x) => x.CountryID === userData.UserDetails[0].CountryID
              );
              var registeredCountry = Country[0]
                ? {
                    value: Country[0].CountryID,
                    label: Country[0].CountryName,
                  }
                : "";
              this.setState({
                Country: registeredCountry,
                AccountNumber: userData.UserDetails[0].AccountNumber,
                ManagedBy: userData.UserDetails[0].ManagedByName,
                ManagedByValue: userData.UserDetails[0].ManagedBy,
                CompanyName: userData.UserDetails[0].CompanyName,
                AddressLine1: userData.UserDetails[0].AddressLine1,
                AddressLine2: userData.UserDetails[0].AddressLine2,
                AddressLine3: userData.UserDetails[0].AddressLine3,
                userName: userData.UserDetails[0].LoginID,
                ZipCode: userData.UserDetails[0].ZipCode,
                City: userData.UserDetails[0].City,
                State: userData.UserDetails[0].State,
                fullName: userData.UserDetails[0].ContactName,
                UserDetailID: userData.UserDetails[0].UserDetailID,
              });
            }
            if (userData.PhoneDetails.length > 0) {
              this.setState({
                Mobile: userData.PhoneDetails[0].PhoneNum,
                Mobile1: userData.PhoneDetails[1]
                  ? userData.PhoneDetails[1].PhoneNum
                  : "",
                Email: userData.PhoneDetails[0].Email,
                EmailID: userData.PhoneDetails[0].EmailID,
                MobileID: userData.PhoneDetails[0].PhoneID,
                Mobile1ID: userData.PhoneDetails[1]
                  ? userData.PhoneDetails[1].PhoneID
                  : null,
              });
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

  async getCountry() {
    try {
      await api
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

  showLoader = () => {
    this.setState({ Loading: true });
  };

  hideLoader = () => {
    this.setState({ Loading: false });
  };

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

              // var SelectedCity = {
              //   value: FinalCity[0].City_code,
              //   label: FinalCity[0].Name,
              // };

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
            cogoToast.error("Zip code not found");
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

  handleChange = (event, type) => {
    if (type === "fullname") {
      let val = event.target.value;
      this.setState({ checkFullname: true });
      if (val === "" || val === null) {
        this.setState({
          fullName: val,
          fullnameErr: true,
          fullnameHelperText: "Please enter Contat Name",
        });
      } else if (val.trim() !== val) {
        this.setState({
          fullName: val,
          fullnameErr: true,
          fullnameHelperText: "Please enter valid Contact Name",
        });
      } else {
        this.setState({
          fullName: val,
          fullnameErr: false,
          fullnameHelperText: "",
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
      if (CommonConfig.isEmpty(passwordVal)) {
        this.setState({
          passwordErr: true,
          checkNumber: false,
          checkLetter: false,
          checkLowerCase: false,
          checkSpecialCharacter: false,
          checkUpperCase: false,
          Password: passwordVal,
          passwordHelperText: "Please enter Password",
        });
      } else if (passwordVal) {
        if (passwordVal.match(CommonConfig.RegExp.regExpNumber)) {
          this.setState({
            Password: passwordVal,
            checkNumber: true,
            passwordErr: false,
            passwordHelperText: "",
          });
        } else {
          this.setState({
            Password: passwordVal,
            checkNumber: false,
            passwordErr: true,
            passwordHelperText: "",
          });
        }
        if (passwordVal.match(CommonConfig.RegExp.regExpUpperCase)) {
          this.setState({
            Password: passwordVal,
            checkUpperCase: true,
            passwordErr: false,
            passwordHelperText: "",
          });
        } else {
          this.setState({
            Password: passwordVal,
            checkUpperCase: false,
            passwordErr: true,
            passwordHelperText: "",
          });
        }
        if (passwordVal.match(CommonConfig.RegExp.regExpLowerCase)) {
          this.setState({
            Password: passwordVal,
            checkLowerCase: true,
            passwordErr: false,
            passwordHelperText: "",
          });
        } else {
          this.setState({
            Password: passwordVal,
            checkLowerCase: false,
            passwordErr: true,
            passwordHelperText: "",
          });
        }
        if (passwordVal.length >= 8) {
          this.setState({
            Password: passwordVal,
            checkLetter: true,
            passwordErr: false,
            passwordHelperText: "",
          });
        } else {
          this.setState({
            Password: passwordVal,
            checkLetter: false,
            passwordErr: true,
            passwordHelperText: "",
          });
        }
        if (passwordVal.match(CommonConfig.RegExp.regExpSpecialCharacter)) {
          this.setState({
            Password: passwordVal,
            checkSpecialCharacter: true,
            passwordErr: false,
            passwordHelperText: "",
          });
        } else {
          this.setState({
            Password: passwordVal,
            checkSpecialCharacter: false,
            passwordErr: true,
            passwordHelperText: "",
          });
        }
      } else {
        this.setState({
          passwordErr: false,
          passwordHelperText: "",
          Password: passwordVal,
        });
      }
    } else if (type === "confirmpassword") {
      let passwordVal = event.target.value;
      if (
        passwordVal === "" ||
        passwordVal === null ||
        passwordVal === undefined
      ) {
        this.setState({
          ConfirmPassword: passwordVal,
          confirmpasswordErr: true,
          confirmpasswordHelperText: "Please enter confirm password",
        });
      } else {
        this.setState({
          ConfirmPassword: passwordVal,
          confirmpasswordErr: false,
          confirmpasswordHelperText: "",
        });
      }
    } else if (type === "currentpassword") {
      let passwordVal = event.target.value;
      if (
        passwordVal === "" ||
        passwordVal === null ||
        passwordVal === undefined
      ) {
        this.setState({
          CurrentPassword: passwordVal,
          currentpasswordErr: true,
          currentpasswordHelperText: "Please enter current password",
        });
      } else {
        this.setState({
          CurrentPassword: passwordVal,
          currentpasswordErr: false,
          currentpasswordHelperText: "",
        });
      }
    } else if (type === "companyname") {
      this.setState({ checkcompanyName: true });
      let companyVal = event.target.value;
      this.setState({
        CompanyName: companyVal,
        companyNameErr: false,
        companyNameHelperText: "",
      });
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

  handlePasswordBlur = (e, type) => {
    if (type === "Confirm Password" || type === "Password") {
      if (this.state.Password === this.state.ConfirmPassword) {
        this.setState({
          confirmpasswordHelperText: "",
          confirmpasswordErr: false,
        });
      }
      if (CommonConfig.isEmpty(this.state.ConfirmPassword)) {
        this.setState({
          confirmpasswordHelperText: "Please enter confirm password",
          confirmpasswordErr: true,
        });
      }
      if (CommonConfig.isEmpty(this.state.Password)) {
        this.setState({
          passwordHelperText: "Please enter password",
          passwordErr: true,
        });
      }
      if (this.state.Password !== this.state.ConfirmPassword) {
        this.setState({
          confirmpasswordHelperText:
            "password and confirm password do not match",
          confirmpasswordErr: true,
        });
      }
    } else if (type === "Current Password") {
      if (CommonConfig.isEmpty(this.state.CurrentPassword)) {
        this.setState({
          currentpasswordHelperText: "Please enter current password",
          currentpasswordErr: true,
        });
      }
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
      } else if (type === "PaperSize") {
        this.setState({ PaperSize: value });
      }
    }
  };

  validate() {
    let IsFormValid = true;
    if (!CommonConfig.isEmpty(this.state.Password)) {
      if (CommonConfig.isEmpty(this.state.ConfirmPassword)) {
        IsFormValid = false;
        this.setState({
          confirmpasswordHelperText: "Please enter confirm password",
          confirmpasswordErr: true,
        });
      }
      if (CommonConfig.isEmpty(this.state.Password)) {
        IsFormValid = false;
        this.setState({
          passwordHelperText: "Please enter password",
          passwordErr: true,
        });
      }
      if (this.state.passwordErr) {
        IsFormValid = false;
        this.setState({
          passwordHelperText: "Please enter valid password",
          passwordErr: true,
        });
      }
      if (this.state.Password !== this.state.ConfirmPassword) {
        IsFormValid = false;
        this.setState({
          confirmpasswordHelperText:
            "password and confirm password do not match",
          confirmpasswordErr: true,
        });
      }
      if (CommonConfig.isEmpty(this.state.CurrentPassword)) {
        IsFormValid = false;
        this.setState({
          currentpasswordHelperText: "Please enter current password",
          currentpasswordErr: true,
        });
      }
    }
    return IsFormValid;
  }

  releaseLock = () => {
    let data = {
      ShippingID: "",
      UserID: CommonConfig.loggedInUserData().PersonID,
      ReleaseAll: 1,
    };
    api
      .post("scheduleshipment/releaseShipmentLockByID", data)
      .then((res) => {
        if (res.success) {
          // cogoToast.success("Shipment unlocked successfully");
        } else {
          // cogoToast.error(res.message);
        }
      })
      .catch((err) => {
        console.log("setLock err", err);
      });
  };
  saveUser = () => {
    if (this.validate()) {
      let data;
      let UserDetails = {
        AccountNumber: this.state.AccountNumber,
        ManagedBy: this.state.ManagedByValue,
        CompanyName: this.state.CompanyName,
        AddressLine1: this.state.AddressLine1,
        AddressLine2: this.state.AddressLine2,
        AddressLine3: this.state.AddressLine3,
        ZipCode: this.state.ZipCode,
        ContactName: this.state.fullName,
        City: this.state.City.value ? this.state.City.value : this.state.City,
        State: this.state.State.value
          ? this.state.State.value
          : this.state.State,
        ContactName: this.state.fullName,
        CountryID: this.state.Country.value
          ? this.state.Country.value
          : this.state.Country,
        UserDetailID: this.state.UserDetailID,
      };
      if (!CommonConfig.isEmpty(this.state.Password)) {
        data = {
          Name: this.state.fullName,
          Password: this.state.Password,
          CurrentPassword: this.state.CurrentPassword,
          Email: this.state.Email,
          Phone: this.state.Mobile,
          Phone2: this.state.Mobile1,
          UserId: CommonConfig.loggedInUserData().PersonID,
          EmailID: this.state.EmailID,
          PhoneID: this.state.MobileID,
          Phone2ID: this.state.Mobile1ID,
          UserName:
            this.state.userName || CommonConfig.loggedInUserData().LoginID,
          UserDetails: UserDetails,
        };
      } else {
        data = {
          Name: this.state.fullName,
          Email: this.state.Email,
          Phone: this.state.Mobile,
          Phone2: this.state.Mobile1,
          UserId: CommonConfig.loggedInUserData().PersonID,
          EmailID: this.state.EmailID,
          PhoneID: this.state.MobileID,
          Phone2ID: this.state.Mobile1ID,
          UserDetails: UserDetails,
        };
      }
      this.showLoader();
      try {
        api.post("userManagement/addUpdateUserProfile", data).then((res) => {
          this.hideLoader();
          if (res.success) {
            var paperData = {
              uId: CommonConfig.loggedInUserData().PersonID,
              SelectedPaperSize: this.state.PaperSize.value,
            };
            if (res.data.message && res.data.success) {
              cogoToast.success(res.data.message);
              this.setState({ openPassword: false });
              api
                .post("userManagement/updateUserPaperSize", paperData)
                .then((res2) => {
                  if (res.data.redirect) {
                    this.releaseLock();
                    this.showLoader();
                    var receiver = document.getElementById("receiver")
                      .contentWindow;
                    receiver.postMessage("", "https://www.sflworldwide.com");
                    localStorage.clear();
                    // sessionStorage.clear();
                    setTimeout(() => {
                      this.props.history.push("/login-page");
                      this.hideLoader();
                    }, 4000);
                  } else {
                    this.reCallApi();
                  }
                });
            } else {
              cogoToast.error(res.data.message);
            }
          } else {
            cogoToast.error("Something went wrong");
          }
        });
      } catch (err) {
        console.log("error.....", err);
      }
    } else {
      cogoToast.error("Please correct error and resubmit the form");
    }
  };

  openPassword = () => {
    this.setState({ openPassword: true });
  };

  cancelpassword = () => {
    this.setState({ openPassword: false });
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
    const {
      checkNumber,
      checkUpperCase,
      checkLowerCase,
      checkSpecialCharacter,
      checkLetter,
    } = this.state;
    const CityOptions = this.state.GoogleAPICityList.map((city) => {
      return { value: city.City_code, label: city.Name };
    });

    const paperSize = this.state.PaperSizeList.map((type) => {
      return { value: type.ID, label: type.PaperDisplayName };
    });

    const StateOptions = this.state.StateList.map((state) => {
      return { value: state.StateName, label: state.StateName };
    });
    const CountryOptions = this.state.CountryList.map((fromCountry) => {
      return { value: fromCountry.CountryID, label: fromCountry.CountryName };
    });
    return (
      <GridContainer>
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader className="btn-right-outer" color="success" icon>
              <CardIcon color="primary">
                <PermContactCalendarOutlinedIcon />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">
                User Profile
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText={<span>User Name</span>}
                    id="username"
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value:
                        userName || CommonConfig.loggedInUserData().LoginID,
                      disabled: true,
                      endAdornment: <Icon>account_circle</Icon>,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
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
                      value={"******************"}
                      disabled={true}
                      formControlProps={{ fullWidth: true }}
                      aria-describedby="simple-popover"
                      helperText={this.state.passwordHelperText}
                      inputProps={{
                        onChange: (event) =>
                          this.handleChange(event, "password"),
                        onBlur: (event) => this.handleChange(event, "password"),
                        onFocus: () =>
                          this.setState({
                            passwordErr: false,
                            passwordHelperText: "",
                            checkPassword: true,
                          }),
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <Button
                            color="primary"
                            style={{ width: "2px", height: "0px" }}
                            onClick={() => this.openPassword()}
                          >
                            Update
                          </Button>
                        </InputAdornment>
                      }
                    />
                    <FormHelperText>
                      {this.state.passwordHelperText}
                    </FormHelperText>
                  </FormControl>
                </GridItem>
                {/* <GridItem xs={12} sm={12} md={1}>
                                    <div className="update-btn">
                                    <Button
                                        color="primary"
                                        size="sm"
                                        onClick={() => this.openPassword()}
                                    >
                                        Update
                                    </Button>
                                    </div>
                                </GridItem> */}
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText={<span>Account Number</span>}
                    id="accountNumber"
                    name="accountNumber"
                    variant="outlined"
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: AccountNumber,
                      disabled: true,
                      endAdornment: <Icon>account_balance_wallet</Icon>,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText={<span>Managed By</span>}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: ManagedBy,
                      disabled: true,
                      endAdornment: <Icon>perm_identity</Icon>,
                    }}
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
                          <Icon>business</Icon>
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
                          <Icon>my_location</Icon>
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
                          <Icon>my_location</Icon>
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
                          <Icon>my_location</Icon>
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
                      onChange: (event) => this.handleChange(event, "zip"),
                      value: ZipCode,
                      endAdornment:
                        this.state.checkZipCode !== true ? (
                          <Icon>pin_drop</Icon>
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
                        onChange: (event) => this.handleChange(event, "City"),
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={useStyles.inputAdornment}
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
                        this.ChangeCountry(value, "City")
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
                        onChange: (event) => this.handleChange(event, "State"),
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={useStyles.inputAdornment}
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
                      onBlur: (event) => this.handleChange(event, "fullname"),
                      onChange: (event) => this.handleChange(event, "fullname"),
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
                      onBlur: (event) => this.handleChange(event, "mobile"),
                      onChange: (event) => this.handleChange(event, "mobile"),
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
                      onBlur: (event) => this.handleChange(event, "mobile1"),
                      onChange: (event) => this.handleChange(event, "mobile1"),
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
                      onBlur: (event) => this.handleChange(event, "email"),
                      onFocus: () =>
                        this.setState({
                          emailErr: false,
                          emailHelperText: "",
                          checkEmail: false,
                        }),
                      onChange: (event) => this.handleChange(event, "email"),
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
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <h3 className="margin-right-auto text-color-black">
                    Page Size Preview
                  </h3>
                </GridItem>
                {this.generatePreviewLink()}
              </GridContainer>
            </CardBody>
          </Card>
          <div className="shipment-submit">
            <div className="right">
              <Button color="rose" onClick={() => this.saveUser()}>
                Save
              </Button>
            </div>
          </div>
        </GridItem>
        <div>
          <Dialog
            className="profile-password-dialog"
            maxWidth={590}
            open={this.state.openPassword}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Update Password</DialogTitle>
            <DialogContent>
              <FormControl
                fullWidth
                className="pass-input"
                error={this.state.currentpasswordErr}
              >
                <InputLabel htmlFor="standard-adornment-password">
                  Current Password
                </InputLabel>
                <Input
                  label="Current Password"
                  id="password"
                  type="password"
                  value={this.state.CurrentPassword}
                  formControlProps={{ fullWidth: true }}
                  aria-describedby="simple-popover"
                  helperText={this.state.currentpasswordHelperText}
                  inputProps={{
                    onChange: (event) =>
                      this.handleChange(event, "currentpassword"),
                    onBlur: (event) =>
                      this.handlePasswordBlur(event, "Current Password"),
                    onFocus: () =>
                      this.setState({
                        currentpasswordErr: false,
                        currentpasswordHelperText: "",
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
                  {this.state.currentpasswordHelperText}
                </FormHelperText>
              </FormControl>
              <div style={{ position: "relative" }}>
                <MDBContainer>
                  <MDBPopover
                    className="ps-popover-outer"
                    placement="top"
                    popover
                    id="popper1"
                  >
                    <FormControl
                      fullWidth
                      className="pass-input"
                      error={this.state.passwordErr}
                    >
                      <InputLabel htmlFor="standard-adornment-password">
                        New Password
                      </InputLabel>
                      <Input
                        label="New Password"
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
                            this.handleChange(event, "Password"),
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
                    <div className="ps-popover-inner">
                      <MDBPopoverHeader>
                        Your password must have:
                      </MDBPopoverHeader>
                      <MDBPopoverBody>
                        <React.Fragment>
                          {checkUpperCase ? (
                            <Typography style={{ color: "#2E7D32" }}>
                              <i class="far fa-check-circle"></i>One uppercase
                              letter
                            </Typography>
                          ) : (
                            <Typography color="error">
                              <i class="far fa-check-circle"></i>One uppercase
                              letter
                            </Typography>
                          )}
                          {checkLowerCase ? (
                            <Typography style={{ color: "#2E7D32" }}>
                              <i class="far fa-check-circle"></i>One lowercase
                              letter
                            </Typography>
                          ) : (
                            <Typography color="error">
                              <i class="far fa-check-circle"></i>One lowercase
                              letter
                            </Typography>
                          )}
                          {checkSpecialCharacter ? (
                            <Typography style={{ color: "#2E7D32" }}>
                              <i class="far fa-check-circle"></i>One special
                              character
                            </Typography>
                          ) : (
                            <Typography color="error">
                              <i class="far fa-check-circle"></i>One special
                              character
                            </Typography>
                          )}
                          {checkNumber ? (
                            <Typography style={{ color: "#2E7D32" }}>
                              <i class="far fa-check-circle"></i>One number
                            </Typography>
                          ) : (
                            <Typography color="error">
                              <i class="far fa-check-circle"></i>One number
                            </Typography>
                          )}
                          {checkLetter ? (
                            <Typography style={{ color: "#2E7D32" }}>
                              <i class="far fa-check-circle"></i>Minimum 8
                              characters
                            </Typography>
                          ) : (
                            <Typography color="error">
                              <i class="far fa-check-circle"></i>Minimum 8
                              characters
                            </Typography>
                          )}
                        </React.Fragment>
                      </MDBPopoverBody>
                    </div>
                  </MDBPopover>
                </MDBContainer>
              </div>
              <FormControl
                fullWidth
                className="pass-input"
                error={this.state.confirmpasswordErr}
              >
                <InputLabel htmlFor="standard-adornment-password">
                  Confirm Password
                </InputLabel>
                <Input
                  label="Confirm Password"
                  id="password"
                  type="password"
                  value={this.state.ConfirmPassword}
                  formControlProps={{ fullWidth: true }}
                  aria-describedby="simple-popover"
                  helperText={this.state.confirmpasswordHelperText}
                  inputProps={{
                    onChange: (event) =>
                      this.handleChange(event, "confirmpassword"),
                    onBlur: (event) =>
                      this.handlePasswordBlur(event, "Confirm Password"),
                    onFocus: () =>
                      this.setState({
                        confirmpasswordErr: false,
                        confirmpasswordHelperText: "",
                      }),
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <Icon>lock</Icon>
                    </InputAdornment>
                  }
                />
                <FormHelperText>
                  {this.state.confirmpasswordHelperText}
                </FormHelperText>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.cancelpassword()} color="secondary">
                Cancel
              </Button>
              <Button onClick={() => this.saveUser()} color="primary" autoFocus>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </GridContainer>
    );
  }
}

export default ProfilePage;
