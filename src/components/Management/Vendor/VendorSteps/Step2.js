/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import InputAdornment from "@material-ui/core/InputAdornment";
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import FormControl from "@material-ui/core/FormControl";
import api from "../../../../utils/apiClient";
import { CommonConfig } from "../../../../utils/constant";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateIcon from "@material-ui/icons/Create";
import cogoToast from "cogo-toast";
import SimpleBackdrop from "../../../../utils/general";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import ReactTable from "react-table";

class Step2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,

      CountryList: [],
      selectedCountry: {},
      countryErr: false,
      countryHelperText: "",

      contactList: [],

      contactName: "",
      contactNameErr: false,
      contactNameHelperText: "",

      country: "",
      title: "",

      addressLine1: "",
      addressLine1Err: false,
      addressLine1HelperText: "",

      addressLine2: "",
      addressLine2Err: false,
      addressLine2HelperText: "",

      addressLine3: "",
      addressLine3Err: false,
      addressLine3HelperText: "",

      email: "",
      emailErr: false,
      emailHelperText: "",

      phone1: "",
      phone1Err: false,
      phone1HelperText: "",

      phone1Ext: "",
      phone1ExtErr: false,
      phone1ExtHelperText: "",
      phone2Ext: "",

      phone2: "",
      phone2Err: false,
      phone2HelperText: "",

      zipCode: "",
      zipCodeErr: false,
      zipCodeHelperText: "",

      cityAutoComplete: false,
      stateAutoComplete: false,
      googleApiCityList: [],
      stateList: [],

      city: "",
      cityErr: false,
      cityHelperText: "",

      state: "",
      stateErr: false,
      stateHelperText: "",

      Loading: false,
      isEdit: false,
      vendorId: !CommonConfig.isEmpty(this.props.history.location.state)
        ? this.props.history.location.state.vendorId
        : "",
      contactListKey: "",
      open: false,
      deleteopen: false,
      close: false,
      Access: [],
      AttachmentListArray:[],
    };
  }

  handleSimple = (event) => {
    this.setState({ simpleSelect: event.target.value });
  };

  ChangeCountry = (value) => {
    this.setState({ selectedCountry: value });
    this.getStates(value);
  };

  handleChange = (event, type) => {
    let val = event.target.value;

    if (type === "contactName") {
      this.setState({ contactName: val });
    } else if (type === "title") {
      this.setState({ title: val });
    } else if (type === "addressLine1") {
      this.setState({ addressLine1: val });
    } else if (type === "addressLine2") {
      this.setState({ addressLine2: val });
    } else if (type === "addressLine3") {
      this.setState({ addressLine3: val });
    } else if (type === "zipCode") {
      this.setState({ zipCode: val });
    } else if (type === "email") {
      this.setState({ email: val });
    } else if (type === "phone1") {
      if (event.target.value.length <= 15) {
        this.setState({ phone1: val });
      }
    } else if (type === "phone2") {
      if (event.target.value.length <= 15) {
        this.setState({ phone2: val });
      }
    } else if (type === "state") {
      this.setState({ state: val });
    } else if (type === "city") {
      this.setState({ city: val });
    } else if (type === "phone1Ext") {
      this.setState({ phone1Ext: val });
    } else if (type === "phone2Ext") {
      this.setState({ phone2Ext: val });
    }
  };
  handleBlur = (event, type) => {
    let val = event.target.value;

    if (type === "") {
    }
    if (type === "contactName") {
      if (CommonConfig.isEmpty(val)) {
        this.setState({
          contactName: val,
          contactNameErr: true,
          contactNameHelperText: "Please enter Contact Name",
        });
      } else {
        this.setState({
          contactName: val,
          contactNameErr: false,
          contactNameHelperText: "",
        });
      }
    } else if (type === "addressLine1") {
      if (CommonConfig.isEmpty(val)) {
        this.setState({
          addressLine1: val,
          addressLine1Err: true,
          addressLine1HelperText: "Please enter Address",
        });
      } else if (val.length > 54) {
        this.setState({
          addressLine1: val,
          addressLine1Err: true,
          addressLine1HelperText: "Addressline 1 should be max 54 characters",
        });
      } else {
        this.setState({
          addressLine1: val,
          addressLine1Err: false,
          addressLine1HelperText: "",
        });
      }
    } else if (type === "addressline2") {
      if (!CommonConfig.isEmpty(val)) {
        if (val.length > 54) {
          this.setState({
            addressLine2: val,
            addressLine2Err: true,
            addressLine2HelperText: "Addressline 2 should be max 54 characters",
          });
        } else {
          this.setState({
            addressLine2: val,
            addressLine2Err: false,
            addressLine2HelperText: "",
          });
        }
      }
    } else if (type === "addressline3") {
      if (!CommonConfig.isEmpty(val)) {
        if (val.length > 54) {
          this.setState({
            addressLine3: val,
            addressLine3Err: true,
            addressLine3HelperText: "Addressline 3 should be max 54 characters",
          });
        } else {
          this.setState({
            addressLine3: val,
            addressLine3Err: false,
            addressLine3HelperText: "",
          });
        }
      }
    } else if (type === "zipCode") {
      if (CommonConfig.isEmpty(val)) {
        this.setState({
          zipCode: val,
          zipCodeErr: true,
          zipCodeHelperText: "Please enter Zip Code",
        });
      } else if (
        val.trim() !== val ||
        !val.match(CommonConfig.RegExp.zipCode)
      ) {
        this.setState({
          zipCode: val,
          zipCodeErr: true,
          zipCodeHelperText: "Zipcode is not valid",
        });
      } else if (val.length > 12) {
        this.setState({
          zipCode: val,
          zipCodeErr: true,
          zipCodeHelperText: "Zipcode length should be max 12 character",
        });
      } else {
        this.setState({
          zipCode: val,
          zipCodeErr: false,
          zipCodeHelperText: "",
        });
        this.zipChange(val);
      }
    } else if (type === "city") {
      if (CommonConfig.isEmpty(val)) {
        this.setState({
          city: val,
          cityErr: true,
          cityHelperText: "Please enter City",
        });
      } else if (CommonConfig.RegExp.companyName.test(val)) {
        this.setState({
          city: val,
          cityErr: true,
          cityHelperText: "City is not valid",
        });
      } else if (val.length > 54) {
        this.setState({
          city: val,
          cityErr: true,
          cityHelperText: "City shoule be max 54 characters",
        });
      } else {
        this.setState({ city: val, cityErr: false, cityHelperText: "" });
      }
    } else if (type === "state") {
      if (CommonConfig.isEmpty(val)) {
        this.setState({
          state: val,
          stateErr: true,
          stateHelperText: "Please enter State",
        });
      } else if (CommonConfig.RegExp.companyName.test(val)) {
        this.setState({
          state: val,
          stateErr: true,
          stateHelperText: "State is not valid",
        });
      } else if (val.length > 54) {
        this.setState({
          state: val,
          stateErr: true,
          stateHelperText: "State shoule be max 54 characters",
        });
      } else {
        this.setState({ state: val, stateErr: false, stateHelperText: "" });
      }
    } else if (type === "phone1") {
      if (!val.match(CommonConfig.RegExp.phoneNumber)) {
        this.setState({
          phone1: val,
          phone1Err: true,
          phone1HelperText: "Please enter valid Phone No.",
        });
      } else if (val.length < 5 || val.length > 15) {
        this.setState({
          phone1: val,
          phone1Err: true,
          phone1HelperText: "Please enter valid Phone No.",
        });
      } else {
        this.setState({ phone1: val, phone1Err: false, phone1HelperText: "" });
      }
    } else if (type === "phone1Ext") {
      if (val.length > 6) {
        this.setState({
          phone1Ext: val,
          phone1ExtErr: true,
          phone1ExtHelperText: "Please enter valid extension",
        });
      } else {
        this.setState({
          phone1Ext: val,
          phone1ExtErr: false,
          phone1ExtHelperText: "",
        });
      }
    } else if (type === "phone2") {
      if (!CommonConfig.isEmpty(val)) {
        if (!val.match(CommonConfig.RegExp.phoneNumber)) {
          this.setState({
            phone2: val,
            phone2Err: true,
            phone2HelperText: "Please enter valid Phone No.",
          });
        } else if (val.length < 5 || val.length > 15) {
          this.setState({
            phone1: val,
            phone1Err: true,
            phone1HelperText: "Please enter valid Phone No.",
          });
        } else {
          this.setState({
            phone2: val,
            phone2Err: false,
            phone2HelperText: "",
          });
        }
      }
    } else if (type === "email") {
      if (!val.match(CommonConfig.RegExp.email)) {
        this.setState({
          email: val,
          emailErr: true,
          emailHelperText: "Please enter valid Email",
        });
      } else {
        this.setState({ email: val, emailErr: false, emailHelperText: "" });
      }
    }
  };

  validate(event) {
    let IsFormValid = true;

    if (!this.state.contactList.length) {
      IsFormValid = false;
      cogoToast.error("Please Add atleast 1 Contact.");
    }
    return IsFormValid;
  }

  validateAddContact(event) {
    let IsFormValid = true;

    if (CommonConfig.isEmpty(this.state.contactName)) {
      IsFormValid = false;
      this.setState({
        contactNameErr: true,
        contactNameHelperText: "Please Enter Name.",
      });
    }
    if (CommonConfig.isEmpty(this.state.addressLine1)) {
      IsFormValid = false;
      this.setState({
        addressLine1Err: true,
        addressLine1HelperText: "Please Enter Address",
      });
    }
    if (CommonConfig.isEmpty(this.state.zipCode)) {
      IsFormValid = false;
      this.setState({
        zipCodeErr: true,
        zipCodeHelperText: "Please Enter ZipCode.",
      });
    }
    if (this.state.cityAutoComplete === false) {
      if (CommonConfig.isEmpty(this.state.city)) {
        IsFormValid = false;
        this.setState({ cityErr: true, cityHelperText: "Please Enter City" });
      }
    } else {
      if (CommonConfig.isEmpty(this.state.city)) {
        IsFormValid = false;
        this.setState({ cityErr: true, cityHelperText: "Please Enter City" });
      }
    }

    if (this.state.stateAutoComplete === false) {
      if (CommonConfig.isEmpty(this.state.state)) {
        IsFormValid = false;
        this.setState({
          stateErr: true,
          stateHelperText: "Please Enter State",
        });
      }
    } else {
      if (CommonConfig.isEmpty(this.state.state)) {
        IsFormValid = false;
        this.setState({
          stateErr: true,
          stateHelperText: "Please Select State",
        });
      }
    }
    if (!Object.values(this.state.selectedCountry).length) {
      IsFormValid = false;
      this.setState({
        countryErr: true,
        countryHelperText: "Please Select Country",
      });
    } else {
      this.setState({ countryErr: false, countryHelperText: "" });
    }

    return IsFormValid;
  }

  componentDidMount() {
    this.setState({ Access: CommonConfig.getUserAccess("Vendor Management") });
    this.getCountry();

    if (!CommonConfig.isEmpty(this.state.vendorId)) {
      this.getContacts(this.state.vendorId);
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
        });
    } catch (error) {}
  }

  ChangeFromCity = (event, value) => {
    if (value != null) {
      this.setState({ city: value });
    }
  };
  ChangeFromState = (event, value) => {
    if (value != null) {
      this.setState({ state: value });
    }
  };

  sendState() {
    return this.state;
  }

  addContact = () => {
    let valid = this.validateAddContact();
    if (valid) {
      var phoneArray = [
        { phone: this.state.phone1, phoneExt: this.state.phone1Ext },
      ];
      var phone2 = { phone: this.state.phone2, phoneExt: this.state.phone2Ext };
      phoneArray.push(phone2);

      if (this.state.isEdit) {
        let contacts = this.state.contactList;
        const key = this.state.contactListKey;

        (contacts[key].Name = this.state.contactName),
          (contacts[key].Title = this.state.title),
          (contacts[key].Country = this.state.selectedCountry.label),
          (contacts[key].AddressLine1 = this.state.addressLine1),
          (contacts[key].AddressLine2 = this.state.addressLine2),
          (contacts[key].AddressLine3 = this.state.addressLine3),
          (contacts[key].ZipCode = this.state.zipCode),
          (contacts[key].City = CommonConfig.isEmpty(this.state.city.label)
            ? this.state.city
            : this.state.city.label),
          (contacts[key].State = CommonConfig.isEmpty(this.state.state.label)
            ? this.state.state
            : this.state.state.label),
          (contacts[key].Email = this.state.email),
          (contacts[key].Phone = phoneArray);

        this.setState({ contactList: contacts, isEdit: false });
        this.ResetContact();
      } else {
        var contactArray = [
          {
            Id: this.state.contactList.length,
            Name: this.state.contactName,
            Title: this.state.title,
            Country: this.state.selectedCountry.label,
            AddressLine1: this.state.addressLine1,
            AddressLine2: this.state.addressLine2,
            AddressLine3: this.state.addressLine3,
            ZipCode: this.state.zipCode,
            City: CommonConfig.isEmpty(this.state.city.label)
              ? this.state.city
              : this.state.city.label,
            State: CommonConfig.isEmpty(this.state.state.label)
              ? this.state.state
              : this.state.state.label,
            Email: this.state.email,
            Phone: phoneArray,
          },
        ];
        this.setState({
          contactList: this.state.contactList.concat(contactArray),
        });
        this.ResetContact();
      }
    }
  };

  ResetContact() {
    this.setState({
      contactName: "",
      title: "",
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      email: "",
      phone1: "",
      phone1Ext: "",
      phone2Ext: "",
      phone2: "",
      city: "",
      state: "",
      zipCode: "",
      selectedCountry: {},
    });
  }

  showLoader = () => {
    this.setState({ Loading: true });
  };

  hideLoader = () => {
    this.setState({ Loading: false });
  };

  zipChange = (zip) => {
    this.setState({
      stateErr: false,
      cityErr: false,
      stateHelperText: "",
      cityHelperText: "",
    });
    if (zip.length) {
      fetch(CommonConfig.zipCodeAPIKey(zip, this.state.selectedCountry.label))
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
              var SelectedState = { value: state, label: state };

              if (countryShortName === this.state.selectedCountry.label) {
                this.setState({
                  cityAutoComplete: FinalCity.length ? true : false,
                  stateAutoComplete: this.state.stateList.length ? true : false,
                  googleApiCityList: FinalCity,
                  state: this.state.stateList.length ? SelectedState : state,
                  city: SelectedCity,
                });
              } else {
                this.setState({
                  cityAutoComplete: false,
                  stateAutoComplete: this.state.stateList.length ? true : false,
                  googleApiCityList: [],
                  state: "",
                  city: "",
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

              if (countryShortName === this.state.selectedCountry.label) {
                this.setState({
                  cityAutoComplete: FinalCity.length ? true : false,
                  stateAutoComplete: this.state.stateList.length ? true : false,
                  googleApiCityList: FinalCity,
                  state: this.state.stateList.length ? SelectedState : state,
                  city: SelectedCity,
                });
              } else {
                this.setState({
                  cityAutoComplete: false,
                  stateAutoComplete: this.state.stateList.length ? true : false,
                  googleApiCityList: [],
                  state: "",
                  city: "",
                });
              }
              this.hideLoader();
            }
          } else {
            cogoToast.error("Zip code not found");
            this.setState({
              cityAutoComplete: false,
              stateAutoComplete: this.state.stateList.length ? true : false,
              googleApiCityList: [],
              state: "",
              city: "",
            });
            this.hideLoader();
          }
        });
    }
  };

  getStates(countryData) {
    try {
      this.showLoader();

      let data = {
        countryId: countryData.value,
      };

      api
        .post("location/getStateList", data)
        .then((res) => {
          if (res.success) {
            this.setState({
              stateList: res.data,
              stateAutoComplete: res.data.length ? true : false,
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

  editContact = (data, key) => {
    console.log("data = ",data)
    const selectedCountry = this.state.CountryList.find(
      (x) => x.CountryName === data.Country
    );
    const country = {
      value: selectedCountry.CountryID,
      label: selectedCountry.CountryName,
    };
    console.log("Length = ", data.Phone.length);
    var phoneLength = data.Phone.length;

    if(phoneLength == 0){

      this.setState({
        contactName: data.Name,
        title: data.Title,
        addressLine1: data.AddressLine1,
        addressLine2: data.AddressLine2,
        addressLine3: data.AddressLine3,
        email: data.Email,
        zipCode: data.ZipCode,
        city: data.City,
        state: data.State,
        selectedCountry: country,
        phone1:  "",
        phone2:  "",
        phone1Ext:"",
        phone2Ext:  "",
        isEdit: true,
        contactListKey: key,
      });

    } else if(phoneLength == 1){
      this.setState({
        contactName: data.Name,
        title: data.Title,
        addressLine1: data.AddressLine1,
        addressLine2: data.AddressLine2,
        addressLine3: data.AddressLine3,
        email: data.Email,
        zipCode: data.ZipCode,
        city: data.City,
        state: data.State,
        selectedCountry: country,
        phone1: data.Phone[0].phone ? data.Phone[0].phone : "",
        phone2: "",
        phone1Ext: data.Phone[0].phoneExt ? data.Phone[0].phoneExt :"",
        phone2Ext: "",
        isEdit: true,
        contactListKey: key,
      });
    }else{
      this.setState({
        contactName: data.Name,
        title: data.Title,
        addressLine1: data.AddressLine1,
        addressLine2: data.AddressLine2,
        addressLine3: data.AddressLine3,
        email: data.Email,
        zipCode: data.ZipCode,
        city: data.City,
        state: data.State,
        selectedCountry: country,
        phone1: data.Phone[0].phone ? data.Phone[0].phone : "",
        phone2: data.Phone[1].phone ? data.Phone[1].phone : "",
        phone1Ext: data.Phone[0].phoneExt ? data.Phone[0].phoneExt :"",
        phone2Ext: data.Phone[1].phoneExt ? data.Phone[1].phoneExt : "",
        isEdit: true,
        contactListKey: key,
      });
    }

    
    // this.zipChange(data.ZipCode);
  };

  deleteContact = () => {
    let contacts = this.state.contactList;

    contacts.splice(this.state.contactListKey, 1);
    this.setState({ contactList: contacts, open: false });
  };

  getContacts(vendorId) {
    try {
      debugger
      this.showLoader();
      api
        .get("vendor/getVendorContacts/" + vendorId)
        .then((res) => {
          if (res.success) {
            this.hideLoader();
            var finalContact = res.data;
            // for (var i = 0; i < finalContact.length; i++) {
            //   finalContact[i].Phone[0].phoneExt =
            //     finalContact[i].Phone[0].phoneExt !== null
            //       ? finalContact[i].Phone[0].phoneExt
            //       : "";
            //   finalContact[i].Phone[1].phoneExt =
            //     finalContact[i].Phone[1].phoneExt !== null
            //       ? finalContact[i].Phone[1].phoneExt
            //       : "";
            // }
            this.setState({ contactList: finalContact });
          }
        })
        .catch((err) => {
          this.hideLoader();
          console.log("err..", err);
          // cogoToast.error("Something Went Wrong");
        });
    } catch (error) {
      this.hideLoader();
      console.log("err..", error);
    }
  }

  deleteVendor = () => {
    try {
      this.showLoader();
      let data = {
        VendorID: this.state.vendorId,
        Attachments:this.state.AttachmentListArray
      };

      console.log("AttachmentListArray = ",this.state.AttachmentListArray)

      api
        .post("/vendor/deleteVendor", data)
        .then((res) => {
          if (res.success) {
            this.hideLoader();
            this.props.history.push({
              pathname: "/admin/Vendor",
              state: {
                filterlist:
                  this.props.history.location.state.filterlist !== undefined
                    ? this.props.history.location.state.filterlist
                    : null,
                sortlist:
                  this.props.history.location.state.sortlist !== undefined
                    ? this.props.history.location.state.sortlist
                    : null,
                serviceValue:
                  this.props.history.location.state.serviceValue !== undefined
                    ? this.props.history.location.state.serviceValue
                    : null,
              },
            });
          }
        })
        .catch((err) => {
          console.log("error", err);
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  deleteVendorByID(allStates) {
    console.log("allStates.vendordetails = ",allStates.vendordetails)
    this.state.AttachmentListArray = allStates.vendordetails.Attachments
    this.setState({ deleteopen: true });
  }

  addVendor(allStates) {
    let vendorDetails = allStates.vendordetails;
    var finalAttachment = [];
    for (var i = 0; i < vendorDetails.Attachments.length; i++) {
      if (vendorDetails.Attachments[i].hasOwnProperty("AttachmentName")) {
        finalAttachment.push(vendorDetails.Attachments[i]);
      }
    }
    let data = {
      vendorName: vendorDetails.vendorName,
      vendorWebsite: vendorDetails.vendorWebsite,
      vendorType: vendorDetails.vendorType,
      isBulkUpload: vendorDetails.isBulkUpload,
      comments: vendorDetails.comments,
      carrierLink: vendorDetails.carrierLink,
      service: vendorDetails.offeredService,
      contacts: this.state.contactList,
      userId: CommonConfig.loggedInUserData().PersonID,
      DocumentList: finalAttachment,
    };
    var formData = new FormData();
    formData.append("data", JSON.stringify(data));

    if (vendorDetails.AttachmentList.length > 0) {
      vendorDetails.AttachmentList.forEach((file) => {
        formData.append("Attachments", file);
      });
    }

    try {
      this.showLoader();
      api
        .post("vendor/addVendor", formData)
        .then((res) => {
          if (res.success) {
            this.hideLoader();
            this.props.history.push({
              pathname: "/admin/Vendor",
              state: { filterlist: [], sortlist: [], serviceValue: "" },
            });
          }
        })
        .catch((err) => {
          this.hideLoader();
          console.log("err..", err);
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {
      this.hideLoader();
      cogoToast.error("Something Went Wrong");
      console.log("error..", error);
    }
  }

  editVendor(allStates) {
    let vendorDetails = allStates.vendordetails;
    var finalAttachment = [];
    for (var i = 0; i < vendorDetails.Attachments.length; i++) {
      if (vendorDetails.Attachments[i].hasOwnProperty("AttachmentName")) {
        finalAttachment.push(vendorDetails.Attachments[i]);
      }
    }
    let data = {
      vendorId: this.state.vendorId,
      vendorName: vendorDetails.vendorName,
      vendorWebsite: vendorDetails.vendorWebsite,
      vendorType: vendorDetails.vendorType,
      isBulkUpload: vendorDetails.isBulkUpload,
      carrierLink: vendorDetails.carrierLink,
      comments: vendorDetails.comments,
      service: vendorDetails.offeredService,
      contacts: this.state.contactList,
      userId: CommonConfig.loggedInUserData().PersonID,
      DocumentList: finalAttachment,
    };

    var formData = new FormData();
    formData.append("data", JSON.stringify(data));

    if (vendorDetails.AttachmentList.length > 0) {
      vendorDetails.AttachmentList.forEach((file) => {
        formData.append("Attachments", file);
      });
    }
    try {
      this.showLoader();
      api
        .post("vendor/EditVendor", formData)
        .then((res) => {
          if (res.success) {
            this.props.history.push({
              pathname: "/admin/Vendor",
              state: {
                filterlist:
                  this.props.history.location.state.filterlist !== undefined
                    ? this.props.history.location.state.filterlist
                    : null,
                sortlist:
                  this.props.history.location.state.sortlist !== undefined
                    ? this.props.history.location.state.sortlist
                    : null,
                serviceValue:
                  this.props.history.location.state.serviceValue !== undefined
                    ? this.props.history.location.state.serviceValue
                    : null,
              },
            });
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

  render() {
    const CountryOptions = this.state.CountryList.map((Country) => {
      return { value: Country.CountryID, label: Country.CountryName };
    });
    const CityOptions = this.state.googleApiCityList.map((city) => {
      return { value: city.City_code, label: city.Name };
    });
    const StateOptions = this.state.stateList.map((state) => {
      return { value: state.StateName, label: state.StateName };
    });
    const columns = [
      {
        Header: "Name",
        accessor: "Name",
        width: 180,
      },
      {
        Header: "Title",
        accessor: "Title",
        width: 180,
      },
      {
        Header: "City",
        accessor: "City",
        width: 100,
      },
      {
        Header: "State",
        accessor: "State",
        width: 100,
      },
      {
        Header: "Email",
        accessor: "Email",
        width: 220,
      },
      {
        Header: "Phone",
        accessor: "Phone",
        id: "phone",
        width: 125,
        Cell: (record) => {
          if (Object.values(record.value).length) {
            return (
              <div>
                <span>{record.value[0].phone}</span>
              </div>
            );
          } else {
            return null;
          }
        },
      },
      {
        Header: "Action",
        filterable: false,
        sortable: false,
        Cell: (record) => {
          return (
            <div className="align-right">
              {this.state.Access.WriteAccess === 1 ? (
                <CreateIcon
                  onClick={() =>
                    this.editContact(record.original, record.index)
                  }
                />
              ) : null}
              {this.state.Access.DeleteAccess === 1 ? (
                <DeleteIcon
                  onClick={() =>
                    this.setState({ open: true, contactListKey: record.index })
                  }
                />
              ) : null}
            </div>
          );
        },
      },
    ];
    return (
      <div>
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
        <form>
          <GridContainer>
            <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                error={this.state.contactNameErr}
                helperText={this.state.contactNameHelperText}
                labelText="Name"
                id="name"
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon className="requiredicon">perm_identity</Icon>
                    </InputAdornment>
                  ),
                  value: this.state.contactName,
                  onChange: (e) => this.handleChange(e, "contactName"),
                  onBlur: (e) => this.handleBlur(e, "contactName"),
                  onFocus: (event) =>
                    this.setState({
                      contactNameErr: false,
                      contactNameHelperText: "",
                    }),
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                labelText="Title"
                id="title"
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon>account_circle</Icon>
                    </InputAdornment>
                  ),
                  value: this.state.title,
                  onChange: (e) => this.handleChange(e, "title"),
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <FormControl fullWidth>
                <Autocomplete
                  options={CountryOptions}
                  id="Country"
                  getOptionLabel={(option) => option.label}
                  value={this.state.selectedCountry}
                  autoSelect
                  onChange={(event, value) => this.ChangeCountry(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country"
                      error={this.state.countryErr}
                      helperText={this.state.countryHelperText}
                      fullWidth
                    />
                  )}
                />
              </FormControl>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                labelText={<span>Address Line 1</span>}
                error={this.state.addressLine1Err}
                helperText={this.state.addressLine1HelperText}
                id="addressline1"
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon className="requiredicon">location_city</Icon>
                    </InputAdornment>
                  ),
                  value: this.state.addressLine1,
                  onChange: (e) => this.handleChange(e, "addressLine1"),
                  onBlur: (e) => this.handleBlur(e, "addressLine1"),
                  onFocus: (event) =>
                    this.setState({
                      addressLine1Err: false,
                      addressLine1HelperText: "",
                    }),
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                labelText={<span>Address Line 2</span>}
                error={this.state.addressLine2Err}
                helperText={this.state.addressLine2HelperText}
                id="addressline2"
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon>location_city</Icon>
                    </InputAdornment>
                  ),
                  value: this.state.addressLine2,
                  onChange: (e) => this.handleChange(e, "addressLine2"),
                  onBlur: (e) => this.handleBlur(e, "addressLine2"),
                  onFocus: (event) =>
                    this.setState({
                      addressLine2Err: false,
                      addressLine2HelperText: "",
                    }),
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                labelText={<span>Address Line 3</span>}
                error={this.state.addressLine3Err}
                helperText={this.state.addressLine3HelperText}
                id="addressline3"
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon>location_city</Icon>
                    </InputAdornment>
                  ),
                  value: this.state.addressLine3,
                  onChange: (e) => this.handleChange(e, "addressLine3"),
                  onBlur: (e) => this.handleBlur(e, "addressLine3"),
                  onFocus: (event) =>
                    this.setState({
                      addressLine3Err: false,
                      addressLine3HelperText: "",
                    }),
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                labelText={<span>Zip</span>}
                id="zipCode"
                error={this.state.zipCodeErr}
                helperText={this.state.zipCodeHelperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon className="requiredicon">location_city</Icon>
                    </InputAdornment>
                  ),
                  value: this.state.zipCode,
                  onBlur: (event) => this.handleBlur(event, "zipCode"),
                  onChange: (e) => this.handleChange(e, "zipCode"),
                  onFocus: (event) =>
                    this.setState({ zipCodeErr: false, zipCodeHelperText: "" }),
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              {this.state.cityAutoComplete === false ? (
                <CustomInput
                  labelText={<span>City</span>}
                  id="city"
                  error={this.state.cityErr}
                  helperText={this.state.cityHelperText}
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon className="requiredicon">location_city</Icon>
                      </InputAdornment>
                    ),
                    value: this.state.city,
                    onChange: (e) => this.handleChange(e, "city"),
                    onBlur: (e) => this.handleBlur(e, "city"),
                    onFocus: () =>
                      this.setState({ cityErr: false, cityHelperText: "" }),
                  }}
                />
              ) : (
                <Autocomplete
                  options={CityOptions}
                  id="cityAutoComplete"
                  autoSelect
                  getOptionLabel={(option) => option.label}
                  value={this.state.city}
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
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              {this.state.stateAutoComplete === false ? (
                <CustomInput
                  labelText={<span>State</span>}
                  id="state"
                  error={this.state.stateErr}
                  helperText={this.state.stateHelperText}
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon className="requiredicon">public</Icon>
                      </InputAdornment>
                    ),
                    value: this.state.state,
                    onChange: (e) => this.handleChange(e, "state"),
                    onBlur: (e) => this.handleBlur(e, "state"),
                    onFocus: () =>
                      this.setState({ stateErr: false, stateHelperText: "" }),
                  }}
                />
              ) : (
                <Autocomplete
                  options={StateOptions}
                  id="stateAutoComplete"
                  autoSelect
                  getOptionLabel={(option) => option.label}
                  value={this.state.state}
                  onChange={(event, value) =>
                    this.ChangeFromState(event, value)
                  }
                  onFocus={() =>
                    this.setState({ stateErr: false, stateHelperText: "" })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      error={this.state.stateErr}
                      helperText={this.state.stateHelperText}
                      label="State"
                      fullWidth
                    />
                  )}
                />
              )}
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                labelText={<span>Email</span>}
                error={this.state.emailErr}
                helperText={this.state.emailHelperText}
                id="email"
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon>email</Icon>
                    </InputAdornment>
                  ),
                  value: this.state.email,
                  onChange: (e) => this.handleChange(e, "email"),
                  onBlur: (e) => this.handleBlur(e, "email"),
                  onFocus: (event) =>
                    this.setState({ emailErr: false, emailHelperText: "" }),
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={3}>
              <CustomInput
                labelText={<span>Work Phone</span>}
                error={this.state.phone1Err}
                helperText={this.state.phone1HelperText}
                id="phone1"
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon>local_phone</Icon>
                    </InputAdornment>
                  ),
                  value: this.state.phone1,
                  onChange: (e) => this.handleChange(e, "phone1"),
                  onBlur: (e) => this.handleBlur(e, "phone1"),
                  onFocus: (event) =>
                    this.setState({ phone1Err: false, phone1HelperText: "" }),
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={1}>
              <CustomInput
                id="phone1Ext"
                labelText="Extension"
                error={this.state.phone1ExtErr}
                helperText={this.state.phone1ExtHelperText}
                inputProps={{
                  value: this.state.phone1Ext,
                  onChange: (e) => this.handleChange(e, "phone1Ext"),
                  onBlur: (e) => this.handleBlur(e, "phone1Ext"),
                  onFocus: () =>
                    this.setState({
                      phone1ExtErr: false,
                      phone1ExtHelperText: "",
                    }),
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                labelText={<span>Cell Phone</span>}
                error={this.state.phone2Err}
                helperText={this.state.phone2HelperText}
                id="phone2"
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon>local_phone</Icon>
                    </InputAdornment>
                  ),
                  value: this.state.phone2,
                  onChange: (e) => this.handleChange(e, "phone2"),
                  onBlur: (e) => this.handleBlur(e, "phone2"),
                  onFocus: (event) =>
                    this.setState({ phone2Err: false, phone2HelperText: "" }),
                }}
              />
            </GridItem>
          </GridContainer>
          <div className="shipment-submit">
            <div className="right">
              <Button onClick={() => this.addContact()}>
                {this.state.isEdit ? "Save" : "Add Contact"}
              </Button>
            </div>
          </div>

          <GridContainer>
            <GridItem xs={12} sm={6} md={6}>
              <h3 className="margin-right-auto text-color-black">
                Contact List
              </h3>
            </GridItem>
          </GridContainer>
          <GridContainer>
            {this.state.contactList.length ? (
              <GridItem xs={12} sm={12} md={12}>
                <ReactTable
                  data={this.state.contactList}
                  sortable={true}
                  filterable={true}
                  resizable={false}
                  showPagination={true}
                  minRows={2}
                  defaultPageSize={10}
                  columns={columns}
                  align="center"
                  className="-striped -highlight contact-list-vendor"
                />
              </GridItem>
            ) : null}
          </GridContainer>
          <div>
            <Dialog
              open={this.state.deleteopen}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure want to delete?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => this.setState({ deleteopen: false })}
                  color="primary"
                >
                  Cancel
                </Button>
                {this.state.Access.DeleteAccess === 1 ? (
                  <Button
                    onClick={() => this.deleteVendor()}
                    color="primary"
                    autoFocus
                  >
                    Delete
                  </Button>
                ) : null}
              </DialogActions>
            </Dialog>
          </div>
          <div>
            <Dialog
              open={this.state.open}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure want to delete?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => this.setState({ open: false })}
                  color="primary"
                >
                  Cancel
                </Button>
                {this.state.Access.DeleteAccess === 1 ? (
                  <Button
                    onClick={() => this.deleteContact()}
                    color="primary"
                    autoFocus
                  >
                    Delete
                  </Button>
                ) : null}
              </DialogActions>
            </Dialog>
          </div>
        </form>
      </div>
    );
  }
}

Step2.propTypes = {
  classes: PropTypes.object,
};

export default withStyles()(Step2);
