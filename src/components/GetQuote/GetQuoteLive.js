import React, { Component } from "react";
import GridContainer from "components/Grid/GridContainer.js";
import { CommonConfig } from "../../utils/constant";
import GridItem from "components/Grid/GridItem.js";
import FormHelperText from "@material-ui/core/FormHelperText";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import cogoToast from "cogo-toast";
import api from "../../utils/apiClient";
import _, { indexOf, remove } from "lodash";
import SimpleBackdrop from "../../utils/general";
const logoImage = require("../../assets/img/logo-new.svg");
const backIcon = require("../../assets/img/back-icon.svg");
const envelopeIcon = require("../../assets/img/get-quote/envelope.svg");
const boxIcon = require("../../assets/img/get-quote/box.svg");
const tvIcon = require("../../assets/img/get-quote/tv.svg");
const furnitureIcon = require("../../assets/img/get-quote/furniture.svg");
const autoIcon = require("../../assets/img/get-quote/auto.svg");
const arrowRightWhite = require("../../assets/img/get-quote/arrow-right-white.svg");
const plusIcon = require("../../assets/img/get-quote/plus.svg");
const removeIcon = require("../../assets/img/get-quote/remove.svg");
var stepValidate = false;
var allValid = false;

class GetQuoteLive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CountryList: [],
      FromSelectedCountry: {},
      ToSelectedCountry: {},
      hidefromzipcode: false,
      hidetozipcode: false,

      FromCityList: [],
      ToCityList: [],

      FromSelectedCity: {},
      ToSelectedCity: {},
      FromCity: "",
      ToCity: "",
      flag: 0,
      flag2: 0,
      FromState: "",
      ToState: "",

      PersonID: "",
      UserAccess: "",
      BoxesErrText: "",
      ContactName: "",
      PhoneNumber: "",
      email: "",

      FromZip: "",
      ToZip: "",

      documentData: [],
      packagetype: "",

      NextButtonIdx: 0,
      IsResidential: 0,
      activeIndex: 0,

      showBoxDetails: false,
      showTVDetails: false,
      showCarDetails: false,

      Loading: false,
      fromStateName: "",
      toStateName: "",

      FromZipCode: "",
      FromZipCodeErr: false,
      FromZipCodeErrText: "",

      ToZipCode: "",
      ToZipCodeErr: false,
      ToZipCodeHelperText: "",

      tempboxDetails: [],
      boxDetails: [],
      tempTvDetails: [],
      tvDetails: [],
      tempCarDetails: [],
      carDetails: [],

      tempCountryList: [],

      finalImage: [],
      tempFinalImage: [],

      packgedata: {
        no_pack: [],
        weight: [],
        len: [],
        width: [],
        height: [],
        insuredValue: [],
      },

      Steps: [
        {
          stepName: "PACKAGE DETAILS",
          stepId: "packagedetails",
          classname: "active",
        },
        {
          stepName: "SHIPMENT DETAILS",
          stepId: "shipmentdetails",
          classname: "inactive",
        },
        {
          stepName: "SHIPPER DETAILS",
          stepId: "shipperdetails",
          classname: "inactive",
        },
        {
          stepName: "SHIP SMART",
          stepId: "shipsmart",
          classname: "inactive",
        },
      ],
    };
  }

  async componentDidMount() {
    //setTimeout(() => {
    await this.GetCountry();
    if (localStorage.getItem("loggedInUserData")) {
      var dataTest = JSON.parse(localStorage.getItem("loggedInUserData"));
      this.setState({
        PersonID: CommonConfig.loggedInUserData().PersonID,
        userName: CommonConfig.loggedInUserData().Name,
        UserAccess: dataTest.userModuleAccess[9].WriteAccess,
      });
    }
    var queryString = new Array();
    if (queryString.length == 0) {
      if (window.location.search.split("?").length > 1) {
        var params2 = window.location.search.split("?")[1].split("&");
        for (var i = 0; i < params2.length; i++) {
          var key = params2[i].split("=")[0];
          var value = decodeURIComponent(params2[i].split("=")[1]);
          queryString[key] = value;
        }
      }
    }

    if (queryString["package"] != null) {
      var packageDetailsArr = queryString["package"].split(",");

      for (var i = 0; i < packageDetailsArr.length; i++) {
        var packageName = "";
        if (packageDetailsArr[i] == "2") {
          packageName = "envelope";
        } else if (packageDetailsArr[i] == "1") {
          packageName = "box";
        } else if (packageDetailsArr[i] == "3") {
          packageName = "furniture";
        } else if (packageDetailsArr[i] == "4") {
          packageName = "television";
        } else if (packageDetailsArr[i] == "5") {
          packageName = "auto";
        }
        this.packageDetailsChange("", packageDetailsArr[i], packageName);
        setTimeout(() => {
          this.showLoader();
          this.navigateChange(1);
        }, 10);
      }
    }
    if (queryString["fullname"] != null && queryString["email"] != null) {
      var blogName = queryString["fullname"];
      var blogEmail = queryString["email"];
      var blogPhone = queryString["phone"];

      document.getElementById("ContactName").value = blogName;
      document.getElementById("Number").value = blogPhone;
      document.getElementById("email").value = blogEmail;

      this.setState({
        ContactName: blogName,
        email: blogEmail,
        PhoneNumber: blogPhone,
      });
    }
    setTimeout(() => {
      var from_country_home = parseInt(queryString["fromcountry"]);
      var to_country_home = parseInt(queryString["tocountry"]);

      if (
        from_country_home != undefined &&
        from_country_home != "" &&
        !isNaN(from_country_home)
      ) {
        var selectedCountryList = _.filter(this.state.tempCountryList[0], {
          CountryID: from_country_home,
        });

        if (selectedCountryList[0].IsZipAvailable === 0) {
          this.setState({ hidefromzipcode: false });
        } else {
          this.setState({ hidefromzipcode: true });
        }
        var SelectedCountry = {
          value: selectedCountryList[0].CountryID,
          label: selectedCountryList[0].CountryName,
        };
        this.setState({
          FromSelectedCountry: SelectedCountry,
        });
        document.getElementById("fromCountrySelect").value =
          selectedCountryList[0].CountryID;
      }
      if (
        to_country_home != undefined &&
        to_country_home != "" &&
        !isNaN(to_country_home)
      ) {
        var selectedToCountryList = _.filter(this.state.tempCountryList[0], {
          CountryID: to_country_home,
        });

        if (selectedToCountryList[0].IsZipAvailable === 0) {
          this.setState({ hidetozipcode: false });
        } else {
          this.setState({ hidetozipcode: true });
        }
        var SelectedToCountry = {
          value: selectedToCountryList[0].CountryID,
          label: selectedToCountryList[0].CountryName,
        };
        this.setState({
          ToSelectedCountry: SelectedToCountry,
        });
        document.getElementById("toCountrySelect").value =
          selectedToCountryList[0].CountryID;
      }
    }, 10);

    this.state.tempboxDetails.push(
      <div className="quote-collect-row" id="rows">
        <GridContainer>
          <GridItem xs={12} sm={2} md={2}>
            <div className="gt-input">
              <label>
                No. of <span>Boxes</span>
              </label>
              <select name="BoxDetails[No_Pack]" id="no_pack0">
                {this.getNumberofBox()}
              </select>
            </div>
          </GridItem>
          <GridItem xs={12} sm={2} md={2}>
            <div className="gt-input">
              <label>Weight</label>
              <div className="with-addon">
                <input
                  type="text"
                  maxLength={2}
                  name="BoxDetails[Weight]"
                  id="weight_pack0"
                  placeholder="Weight"
                  onFocus={() =>
                    this.setState({
                      BoxesErrText: "",
                    })
                  }
                ></input>
                <span>lbs</span>
              </div>
            </div>
          </GridItem>
          <GridItem xs={12} sm={5} md={5}>
            <div className="gt-input">
              <label>Dimensions</label>
              <GridContainer>
                <GridItem xs={4} sm={4} md={4}>
                  <div className="with-addon">
                    <input
                      type="text"
                      maxLength={2}
                      name="BoxDetails[Length]"
                      id="length0"
                      placeholder="Length"
                      onFocus={() =>
                        this.setState({
                          BoxesErrText: "",
                        })
                      }
                    ></input>
                    <span>in</span>
                  </div>
                </GridItem>
                <GridItem xs={4} sm={4} md={4}>
                  <div className="with-addon">
                    <input
                      type="text"
                      maxLength={2}
                      name="BoxDetails[Width]"
                      id="width0"
                      placeholder="Width"
                      onFocus={() =>
                        this.setState({
                          BoxesErrText: "",
                        })
                      }
                    ></input>
                    <span>in</span>
                  </div>
                </GridItem>
                <GridItem xs={4} sm={4} md={4}>
                  <div className="with-addon">
                    <input
                      type="text"
                      maxLength={2}
                      name="BoxDetails[Height]"
                      id="height0"
                      placeholder="Height"
                      onFocus={() =>
                        this.setState({
                          BoxesErrText: "",
                        })
                      }
                    ></input>
                    <span>in</span>
                  </div>
                </GridItem>
              </GridContainer>
            </div>
          </GridItem>
          <GridItem xs={12} sm={3} md={3}>
            <div className="add-btn">
              <a
                id="add_new_box0"
                onClick={() => this.addRowPackage("rows", "0", "Box")}
              >
                <img src={plusIcon}></img>Add more
              </a>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    );
    this.state.tempTvDetails.push(
      <div className="quote-collect-row" id="rowsteli">
        <GridContainer>
          <GridItem xs={12} sm={2} md={2}>
            <div className="gt-input">
              <label>
                <span>TV</span> Make
              </label>
              <input
                type="text"
                name="TelevisionDetails[Make]"
                id="no_packteli0"
                placeholder="TV Make"
                onFocus={() =>
                  this.setState({
                    TelevisionErrText: "",
                  })
                }
              ></input>
            </div>
          </GridItem>
          <GridItem xs={12} sm={1} md={1}>
            <div className="gt-input">
              <label>Model</label>
              <input
                type="text"
                name="TelevisionDetails[Model]"
                id="model_teli0"
                placeholder="TV Model"
                onFocus={() =>
                  this.setState({
                    TelevisionErrText: "",
                  })
                }
              ></input>
            </div>
          </GridItem>
          <GridItem xs={12} sm={2} md={2}>
            <div className="gt-input">
              <label>Weight</label>
              <div className="with-addon">
                <input
                  type="text"
                  maxLength={2}
                  name="TelevisionDetails[Weight]"
                  id="wight_packteli"
                  placeholder="Weight"
                  onFocus={() =>
                    this.setState({
                      TelevisionErrText: "",
                    })
                  }
                ></input>
                <span>lbs</span>
              </div>
            </div>
          </GridItem>
          <GridItem xs={12} sm={4} md={4}>
            <div className="gt-input">
              <label>Dimensions</label>
              <GridContainer>
                <GridItem xs={4} sm={4} md={4}>
                  <div className="with-addon">
                    <input
                      type="text"
                      maxLength={2}
                      name="TelevisionDetails[Length]"
                      id="lengthteli0"
                      placeholder="Length"
                      onFocus={() =>
                        this.setState({
                          TelevisionErrText: "",
                        })
                      }
                    ></input>
                    <span>in</span>
                  </div>
                </GridItem>
                <GridItem xs={4} sm={4} md={4}>
                  <div className="with-addon">
                    <input
                      type="text"
                      maxLength={2}
                      name="TelevisionDetails[Width]"
                      id="widthteli0"
                      placeholder="Width"
                      onFocus={() =>
                        this.setState({
                          TelevisionErrText: "",
                        })
                      }
                    ></input>
                    <span>in</span>
                  </div>
                </GridItem>
                <GridItem xs={4} sm={4} md={4}>
                  <div className="with-addon">
                    <input
                      type="text"
                      maxLength={2}
                      name="TelevisionDetails[Height]"
                      id="heightteli0"
                      placeholder="Height"
                      onFocus={() =>
                        this.setState({
                          TelevisionErrText: "",
                        })
                      }
                    ></input>
                    <span>in</span>
                  </div>
                </GridItem>
              </GridContainer>
            </div>
          </GridItem>
          <GridItem xs={12} sm={3} md={3}>
            <div className="add-btn">
              <a
                onClick={() => this.addRowTV("rowsteli", "0", "Tele")}
                id="add_new_tv0"
              >
                <img src={plusIcon}></img>Add more
              </a>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    );
    this.state.tempCarDetails.push(
      <div className="quote-collect-row">
        <GridContainer>
          <GridItem xs={12} sm={2} md={2}>
            <div className="gt-input">
              <label>
                <span>Auto</span> Make
              </label>
              <input
                type="text"
                name="CarDetails[Make]"
                id="car_make"
                placeholder="Car Make"
                onFocus={() =>
                  this.setState({
                    CarErrText: "",
                  })
                }
              ></input>
              <FormHelperText style={{ color: "red" }}>
                {this.state.CarErrText}
              </FormHelperText>
            </div>
          </GridItem>
          <GridItem xs={12} sm={2} md={2}>
            <div className="gt-input">
              <label>Car Model</label>
              <input
                type="text"
                name="CarDetails[Model]"
                id="car_model"
                placeholder="Car Model"
                onFocus={() =>
                  this.setState({
                    CarErrText: "",
                  })
                }
              ></input>
            </div>
            <FormHelperText style={{ color: "red" }}>
              {this.state.CarErrText}
            </FormHelperText>
          </GridItem>
          <GridItem xs={12} sm={2} md={2}>
            <div className="gt-input">
              <label>Car Year</label>
              <input
                type="text"
                name="CarDetails[Year]"
                id="car_year"
                placeholder="Car Year"
                onFocus={() =>
                  this.setState({
                    CarErrText: "",
                  })
                }
              ></input>
            </div>
          </GridItem>
          <GridItem xs={12} sm={2} md={2}>
            <div className="add-btn">
              <a
                id="add_new_car0"
                onClick={() => this.addCarData("rowscar0", "0", "Car")}
              >
                <img src={plusIcon}></img>Add more
              </a>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    );
    this.setState({
      boxDetails: this.state.tempboxDetails,
      tvDetails: this.state.tempTvDetails,
      carDetails: this.state.tempCarDetails,
    });
  }

  navigateChangeprevious = (key) => {
    let stepsList = this.state.Steps;
    let activeIndex = stepsList.findIndex((x) => x.classname === "active");
    this.setState({ activeIndex: activeIndex });
    if (activeIndex != 0) {
      if (key !== activeIndex) {
        this.setState({ NextButtonIdx: key });
        stepsList[key]["classname"] = "active";
        stepsList[activeIndex]["classname"] = "inactive";
        this.setState({ Steps: stepsList });
        let divID = stepsList[key]["stepId"];
        let activeDiv = stepsList[activeIndex]["stepId"];
        document.getElementById(divID).style.display = "block";
        document.getElementById(activeDiv).style.display = "none";
      }
    }
  };

  navigateChange = (key) => {
    if (this.state.flag == 1) {
      this.setState({ FromZip: "" });
      document.getElementById("fromzipSelect").value = "";
    } else if (this.state.flag2 == 1) {
      this.setState({
        ToZipErr: true,
        ToZipErrText: "To Zip code not found",
      });
      this.setState({ ToZip: "" });
      document.getElementById("TozipSelect").value = "";
      this.setState({
        FromZipCodeErr: false,
        ToZipCodeHelperText: "",
      });
    } else {
      let stepsList = this.state.Steps;
      let activeIndex = stepsList.findIndex((x) => x.classname === "active");
      this.setState({ activeIndex: activeIndex });

      this.hideLoader();
      var envelope = document.getElementById("envelope");
      var box = document.getElementById("box");
      var television = document.getElementById("television");
      var furniture = document.getElementById("furniture");
      var auto = document.getElementById("auto");

      var No_packBoxDetails = [];
      var WeightBoxDetails = [];
      var LengthBoxDetails = [];
      var WidthBoxDetails = [];
      var HeightBoxDetails = [];
      var MakeCarDetails = [];
      var ModelCarDetails = [];
      var YearCarDetails = [];
      var MakeTelevisionDetails = [];
      var ModelTelevisionDetails = [];
      var WeightTelevisionDetails = [];
      var LengthTelevisionDetails = [];
      var WidthTelevisionDetails = [];
      var HeightTelevisionDetails = [];

      if (activeIndex == 0) {
        for (var i = 0; i < this.state.documentData.length; i++) {
          if (
            this.state.documentData[i] == "1" ||
            this.state.documentData[i] == "3" ||
            this.state.documentData[i] == "4" ||
            this.state.documentData[i] == "5"
          ) {
            this.setState({ packagetype: "Package" });
          }
        }
      }
      if (
        activeIndex == 1 &&
        this.state.Steps[activeIndex].stepId == "containerdetails"
      ) {
        var nopack = [];
        var temp = document.getElementsByName("BoxDetails[No_Pack]");
        var boxarray = [].concat.apply(nopack, temp);
        No_packBoxDetails = boxarray.map((x) => {
          return x.value;
        });

        var weightpack = [];
        var temp = document.getElementsByName("BoxDetails[Weight]");
        var boxweightarray = [].concat.apply(weightpack, temp);
        WeightBoxDetails = boxweightarray.map((x) => {
          return x.value;
        });

        var lengthpack = [];
        var temp = document.getElementsByName("BoxDetails[Length]");
        var lengthboxarray = [].concat.apply(lengthpack, temp);
        LengthBoxDetails = lengthboxarray.map((x) => {
          return x.value;
        });

        var widthpack = [];
        var temp = document.getElementsByName("BoxDetails[Width]");
        var widthboxarray = [].concat.apply(widthpack, temp);
        WidthBoxDetails = widthboxarray.map((x) => {
          return x.value;
        });

        var heightpack = [];
        var temp = document.getElementsByName("BoxDetails[Height]");
        var heightboxarray = [].concat.apply(heightpack, temp);
        HeightBoxDetails = heightboxarray.map((x) => {
          return x.value;
        });

        var carmake = [];
        var temp = document.getElementsByName("CarDetails[Make]");
        var makecararray = [].concat.apply(carmake, temp);
        MakeCarDetails = makecararray.map((x) => {
          return x.value;
        });

        var modelcar = [];
        var temp = document.getElementsByName("CarDetails[Model]");
        var modelcararray = [].concat.apply(modelcar, temp);
        ModelCarDetails = modelcararray.map((x) => {
          return x.value;
        });

        var yearcar = [];
        var temp = document.getElementsByName("CarDetails[Year]");
        var yearcararray = [].concat.apply(yearcar, temp);
        YearCarDetails = yearcararray.map((x) => {
          return x.value;
        });

        var notele = [];
        var temp = document.getElementsByName("TelevisionDetails[Make]");
        var maketelearray = [].concat.apply(notele, temp);
        var No_packTelevisionDetails = maketelearray.map((x) => {
          return x.value;
        });

        var notele = [];
        var temp = document.getElementsByName("TelevisionDetails[Make]");
        var makenewtelearray = [].concat.apply(notele, temp);
        MakeTelevisionDetails = makenewtelearray.map((x) => {
          return x.value;
        });

        var notele = [];
        var temp = document.getElementsByName("TelevisionDetails[Model]");
        var modelnewtelearray = [].concat.apply(notele, temp);
        ModelTelevisionDetails = modelnewtelearray.map((x) => {
          return x.value;
        });

        var weighttele = [];
        var temp = document.getElementsByName("TelevisionDetails[Weight]");
        var weighttelearray = [].concat.apply(weighttele, temp);
        WeightTelevisionDetails = weighttelearray.map((x) => {
          return x.value;
        });

        var lengthtele = [];
        var temp = document.getElementsByName("TelevisionDetails[Length]");
        var lengthtelearray = [].concat.apply(lengthtele, temp);
        LengthTelevisionDetails = lengthtelearray.map((x) => {
          return x.value;
        });

        var widthtele = [];
        var temp = document.getElementsByName("TelevisionDetails[Width]");
        var widthtelearray = [].concat.apply(widthtele, temp);
        var WidthTelevisionDetails = widthtelearray.map((x) => {
          return x.value;
        });

        var heighttele = [];
        var temp = document.getElementsByName("TelevisionDetails[Height]");
        var heighttelearray = [].concat.apply(heighttele, temp);
        var HeightTelevisionDetails = heighttelearray.map((x) => {
          return x.value;
        });

        var doc = [];
        var temp = document.getElementsByName("DocumnetDetails[]");
        var docarray = [].concat.apply(doc, temp);
        var DocumnetDetails = docarray.map((x) => {
          return x.value;
        });
      }

      if (activeIndex == 0) {
        if (
          envelope.classList.contains("selected") ||
          box.classList.contains("selected") ||
          television.classList.contains("selected") ||
          furniture.classList.contains("selected") ||
          auto.classList.contains("selected")
        ) {
          stepValidate = true;
        } else {
          stepValidate = false;
          this.setState({
            PackageDetailsErr: true,
            PackageDetailsErrText: "Please select shipment content",
          });
        }
      } else if (
        activeIndex == 1 &&
        this.state.Steps[activeIndex].stepId == "containerdetails"
      ) {
        this.state.documentData.find((x) => {
          if (x === "1") {
            for (let i = 0; i < No_packBoxDetails.length; i++) {
              if (
                No_packBoxDetails[i] !== "" &&
                WeightBoxDetails[i] !== "" &&
                LengthBoxDetails[i] != "" &&
                WidthBoxDetails[i] !== "" &&
                HeightBoxDetails[i] !== ""
              ) {
                stepValidate = true;
              } else {
                stepValidate = false;
                this.setState({
                  BoxesErr: true,
                  BoxesErrText: "Please enter correct values",
                });
              }
              if (
                No_packBoxDetails[i] !== "" &&
                WeightBoxDetails[i] == "" &&
                LengthBoxDetails[i] == "" &&
                WidthBoxDetails[i] == "" &&
                HeightBoxDetails[i] == ""
              ) {
                stepValidate = false;
                this.setState({
                  BoxesErr: true,
                  BoxesErrText: "Please enter weight & dimensions",
                });
              }
              if (
                No_packBoxDetails[i] !== "" &&
                WeightBoxDetails[i] !== "" &&
                LengthBoxDetails[i] == "" &&
                WidthBoxDetails[i] == "" &&
                HeightBoxDetails[i] == ""
              ) {
                stepValidate = false;
                this.setState({
                  BoxesErr: true,
                  BoxesErrText: "Please enter  dimensions",
                });
              }
              if (
                No_packBoxDetails[i] !== "" &&
                WeightBoxDetails[i] == "" &&
                LengthBoxDetails[i] !== "" &&
                WidthBoxDetails[i] !== "" &&
                HeightBoxDetails[i] !== ""
              ) {
                stepValidate = false;
                this.setState({
                  BoxesErr: true,
                  BoxesErrText: "Please enter weight ",
                });
              }
              if (
                No_packBoxDetails[i] == "" &&
                WeightBoxDetails[i] !== "" &&
                LengthBoxDetails[i] !== "" &&
                WidthBoxDetails[i] !== "" &&
                HeightBoxDetails[i] !== ""
              ) {
                stepValidate = false;
                this.setState({
                  BoxesErr: true,
                  BoxesErrText: "Please enter No. of box  ",
                });
              }
              if (
                No_packBoxDetails[i] !== "" &&
                WeightBoxDetails[i] !== "" &&
                LengthBoxDetails[i] !== "" &&
                WidthBoxDetails[i] == "" &&
                HeightBoxDetails[i] == ""
              ) {
                stepValidate = false;
                this.setState({
                  BoxesErr: true,
                  BoxesErrText: "Please enter Dimensions width & Height",
                });
              }
              if (
                No_packBoxDetails[i] !== "" &&
                WeightBoxDetails[i] !== "" &&
                LengthBoxDetails[i] !== "" &&
                WidthBoxDetails[i] !== "" &&
                HeightBoxDetails[i] == ""
              ) {
                stepValidate = false;
                this.setState({
                  BoxesErr: true,
                  BoxesErrText: "Please enter Dimensions Height",
                });
              }
              if (
                No_packBoxDetails[i] !== "" &&
                WeightBoxDetails[i] !== "" &&
                LengthBoxDetails[i] == "" &&
                WidthBoxDetails[i] !== "" &&
                HeightBoxDetails[i] == ""
              ) {
                stepValidate = false;
                this.setState({
                  BoxesErr: true,
                  BoxesErrText: "Please enter Dimensions length & Height",
                });
              }
              if (
                No_packBoxDetails[i] !== "" &&
                WeightBoxDetails[i] !== "" &&
                LengthBoxDetails[i] == "" &&
                WidthBoxDetails[i] !== "" &&
                HeightBoxDetails[i] !== ""
              ) {
                stepValidate = false;
                this.setState({
                  BoxesErr: true,
                  BoxesErrText: "Please enter Dimensions length ",
                });
              }
              if (
                No_packBoxDetails[i] !== "" &&
                WeightBoxDetails[i] !== "" &&
                LengthBoxDetails[i] == "" &&
                WidthBoxDetails[i] == "" &&
                HeightBoxDetails[i] !== ""
              ) {
                stepValidate = false;
                this.setState({
                  BoxesErr: true,
                  BoxesErrText: "Please enter Dimensions length & width",
                });
              }
            }
          }
          if (x === "2") {
          }
          if (x === "3") {
          }

          if (x === "4") {
            for (let k = 0; k < No_packTelevisionDetails.length; k++) {
              if (
                No_packTelevisionDetails[k] !== "" &&
                WeightTelevisionDetails[k] !== "" &&
                LengthTelevisionDetails[k] !== "" &&
                WidthTelevisionDetails[k] !== "" &&
                HeightTelevisionDetails[k] !== ""
              ) {
                stepValidate = true;
              } else {
                stepValidate = false;
                this.setState({
                  TelevisionErrText: "Please Enter correct values",
                });
              }
              if (
                No_packTelevisionDetails[k] !== "" &&
                WeightTelevisionDetails[k] == "" &&
                LengthTelevisionDetails[k] == "" &&
                WidthTelevisionDetails[k] == "" &&
                HeightTelevisionDetails[k] == ""
              ) {
                stepValidate = false;
                this.setState({
                  TelevisionErrText:
                    "Please Enter Television Weight & Dimensions",
                });
              }
              if (
                No_packTelevisionDetails[k] !== "" &&
                WeightTelevisionDetails[k] !== "" &&
                LengthTelevisionDetails[k] == "" &&
                WidthTelevisionDetails[k] == "" &&
                HeightTelevisionDetails[k] == ""
              ) {
                stepValidate = false;
                this.setState({
                  TelevisionErrText: "Please Enter Television Dimensions",
                });
              }
              if (
                No_packTelevisionDetails[k] !== "" &&
                WeightTelevisionDetails[k] == "" &&
                LengthTelevisionDetails[k] !== "" &&
                WidthTelevisionDetails[k] !== "" &&
                HeightTelevisionDetails[k] !== ""
              ) {
                stepValidate = false;
                this.setState({
                  TelevisionErrText: "Please Enter Television Weight",
                });
              }
              if (
                No_packTelevisionDetails[k] == "" &&
                WeightTelevisionDetails[k] == "" &&
                LengthTelevisionDetails[k] !== "" &&
                WidthTelevisionDetails[k] !== "" &&
                HeightTelevisionDetails[k] !== ""
              ) {
                stepValidate = false;
                this.setState({
                  TelevisionErrText:
                    "Please Enter Television make & Television Weight",
                });
              }
              if (
                No_packTelevisionDetails[k] == "" &&
                WeightTelevisionDetails[k] !== "" &&
                LengthTelevisionDetails[k] == "" &&
                WidthTelevisionDetails[k] == "" &&
                HeightTelevisionDetails[k] == ""
              ) {
                stepValidate = false;
                this.setState({
                  TelevisionErrText:
                    "Please Enter Television make & Television Dimensions",
                });
              }
              if (
                No_packTelevisionDetails[k] !== "" &&
                WeightTelevisionDetails[k] !== "" &&
                LengthTelevisionDetails[k] !== "" &&
                WidthTelevisionDetails[k] == "" &&
                HeightTelevisionDetails[k] == ""
              ) {
                stepValidate = false;
                this.setState({
                  TelevisionErrText:
                    "Please Enter  Television Dimensions width & Height",
                });
              }
              if (
                No_packTelevisionDetails[k] !== "" &&
                WeightTelevisionDetails[k] !== "" &&
                LengthTelevisionDetails[k] !== "" &&
                WidthTelevisionDetails[k] !== "" &&
                HeightTelevisionDetails[k] == ""
              ) {
                stepValidate = false;
                this.setState({
                  TelevisionErrText:
                    "Please Enter  Television Dimensions Height",
                });
              }
              if (
                No_packTelevisionDetails[k] !== "" &&
                WeightTelevisionDetails[k] !== "" &&
                LengthTelevisionDetails[k] == "" &&
                WidthTelevisionDetails[k] == "" &&
                HeightTelevisionDetails[k] !== ""
              ) {
                stepValidate = false;
                this.setState({
                  TelevisionErrText:
                    "Please Enter  Television Dimensions length & width ",
                });
              }
              if (
                No_packTelevisionDetails[k] !== "" &&
                WeightTelevisionDetails[k] !== "" &&
                LengthTelevisionDetails[k] == "" &&
                WidthTelevisionDetails[k] !== "" &&
                HeightTelevisionDetails[k] !== ""
              ) {
                stepValidate = false;
                this.setState({
                  TelevisionErrText:
                    "Please Enter  Television Dimensions length",
                });
              }
              if (
                No_packTelevisionDetails[k] !== "" &&
                WeightTelevisionDetails[k] !== "" &&
                LengthTelevisionDetails[k] !== "" &&
                WidthTelevisionDetails[k] == "" &&
                HeightTelevisionDetails[k] !== ""
              ) {
                stepValidate = false;
                this.setState({
                  TelevisionErrText:
                    "Please Enter  Television Dimensions width ",
                });
              }
            }
          }
          if (x === "5") {
            for (let j = 0; j < MakeCarDetails.length; j++) {
              if (
                MakeCarDetails[j] !== "" &&
                ModelCarDetails[j] !== "" &&
                YearCarDetails[j] !== ""
              ) {
                stepValidate = true;
              } else {
                stepValidate = false;
                this.setState({
                  CarErrText: "Please enter correct values",
                });
              }
              if (
                MakeCarDetails[j] !== "" &&
                ModelCarDetails[j] == "" &&
                YearCarDetails[j] == ""
              ) {
                stepValidate = false;
                this.setState({
                  CarErrText: "Please enter car model & car year",
                });
              }
              if (
                MakeCarDetails[j] !== "" &&
                ModelCarDetails[j] !== "" &&
                YearCarDetails[j] == ""
              ) {
                stepValidate = false;
                this.setState({
                  CarErrText: "Please enter car year",
                });
              }
              if (
                MakeCarDetails[j] !== "" &&
                ModelCarDetails[j] == "" &&
                YearCarDetails[j] !== ""
              ) {
                stepValidate = false;
                this.setState({
                  CarErrText: "Please enter car model",
                });
              }
              if (
                MakeCarDetails[j] == "" &&
                ModelCarDetails[j] !== "" &&
                YearCarDetails[j] !== ""
              ) {
                stepValidate = false;
                this.setState({
                  CarErrText: "Please enter car make",
                });
              }
              if (
                MakeCarDetails[j] == "" &&
                ModelCarDetails[j] == "" &&
                YearCarDetails[j] !== ""
              ) {
                stepValidate = false;
                this.setState({
                  CarErrText: "Please enter car make & car model",
                });
              }
              if (
                MakeCarDetails[j] == "" &&
                ModelCarDetails[j] !== "" &&
                YearCarDetails[j] == ""
              ) {
                stepValidate = false;
                this.setState({
                  CarErrText: "Please enter car make & car year",
                });
              }
            }
          }
        });
      } else if (
        (activeIndex == 2 &&
          this.state.Steps[activeIndex].stepId == "shipmentdetails") ||
        (activeIndex == 1 &&
          this.state.Steps[activeIndex].stepId == "shipmentdetails")
      ) {
        if (
          document.getElementById("toCountrySelect").value == "" &&
          document.getElementById("fromCountrySelect").value == "" &&
          this.state.FromZip == "" &&
          this.state.ToZip == ""
        ) {
          stepValidate = false;
          cogoToast.error("Please select country");
        } else {
          if (document.getElementById("toCountrySelect").value == "") {
            stepValidate = false;
            this.setState({
              ToCountryErr: true,
              ToCountryErrText: "Please select To Country",
            });
          } else if (document.getElementById("fromCountrySelect").value == "") {
            stepValidate = false;
            cogoToast.error("Please select From Country");
          } else if (this.state.hidefromzipcode && this.state.FromZip == "") {
            stepValidate = false;
            this.setState({
              FromZipErr: true,
              FromZipErrText: "Please enter From Zip",
            });
          } else if (this.state.hidetozipcode && this.state.ToZip == "") {
            stepValidate = false;
            this.setState({
              ToZipCodeEnterText: "Please enter To Zip",
            });
          } else {
            stepValidate = true;
          }
        }
      } else if (
        (activeIndex == 2 &&
          this.state.Steps[activeIndex].stepId == "shipperdetails") ||
        (activeIndex == 3 &&
          this.state.Steps[activeIndex].stepId == "shipperdetails")
      ) {
        if (
          this.state.ContactName == "" &&
          this.state.PhoneNumber == "" &&
          this.state.email == ""
        ) {
          stepValidate = false;
          this.setState({
            cnameErrText: "Please enter contact name",
          });
        }
        if ((this, this.state.ContactName == "")) {
          stepValidate = false;
        }
        if ((this, this.state.PhoneNumber == "")) {
          stepValidate = false;
          this.setState({
            ContactNumberErrText: "Please enter phone number",
          });
          stepValidate = false;
        }
        if ((this, this.state.email == "")) {
          stepValidate = false;
          this.setState({
            EmailErrText: "Please enter email",
          });
        } else {
          stepValidate = true;
        }
      }
      if (
        (activeIndex == 2 &&
          this.state.Steps[activeIndex].stepId == "shipperdetails") ||
        (activeIndex == 3 &&
          this.state.Steps[activeIndex].stepId == "shipperdetails")
      ) {
        if (allValid) {
          if (key !== activeIndex) {
            this.setState({ NextButtonIdx: key });
            stepsList[key]["classname"] = "active";
            stepsList[activeIndex]["classname"] = "inactive";
            this.setState({ Steps: stepsList });
            let divID = stepsList[key]["stepId"];
            let activeDiv = stepsList[activeIndex]["stepId"];
            document.getElementById(divID).style.display = "block";
            document.getElementById(activeDiv).style.display = "none";
          }
        } else {
          stepValidate = false;
        }
      } else {
        if (stepValidate) {
          if (key !== activeIndex) {
            this.setState({ NextButtonIdx: key });
            stepsList[key]["classname"] = "active";
            stepsList[activeIndex]["classname"] = "inactive";
            this.setState({ Steps: stepsList });
            let divID = stepsList[key]["stepId"];
            let activeDiv = stepsList[activeIndex]["stepId"];
            document.getElementById(divID).style.display = "block";
            document.getElementById(activeDiv).style.display = "none";
          }
        }
      }

      if (stepValidate && allValid) {
        if (this.state.Steps[activeIndex].stepId == "shipperdetails") {
          if (
            this.state.documentData.length === 1 &&
            this.state.documentData.indexOf("3") === -1 &&
            this.state.documentData.indexOf("5") === -1 &&
            this.state.documentData.indexOf("4") === -1 &&
            (this.state.FromSelectedCountry.value == 202 ||
              this.state.FromSelectedCountry.value == 37)
          ) {
            var PackageRes = [];
            var PersonList = [];
            var finalManagedBy = [];
            var ManagedBY = "";
            var Access = 0;
            var elsecalled = 0;
            var PackageName = "";
            var newpackagetype = "";
            debugger;
            if (this.state.documentData[0] == 2) {
              debugger;
              newpackagetype = "Document";
            }
            if (this.state.documentData[0] == 1) {
              debugger;
              newpackagetype = "Boxes";
            }
            if (this.state.documentData[0] == 4) {
              debugger;
              newpackagetype = "Television";
            }
            if (this.state.documentData[0] == 3) {
              debugger;
              newpackagetype = "Furniture";
            }
            if (this.state.documentData[0] == 5) {
              debugger;
              newpackagetype = "Auto";
            }
            var manageData = {};
            {
              this.state.PersonID
                ? (manageData = {
                    Email: this.state.email,
                    Phone: this.state.PhoneNumber,
                    PersonID: this.state.PersonID,
                    newpackagetype: newpackagetype,
                  })
                : (manageData = {
                    Email: this.state.email,
                    Phone: this.state.PhoneNumber,
                    PersonID: 0,
                    newpackagetype: newpackagetype,
                  });
            }

            this.showLoader();
            api
              .post("salesLead/getManagedByPhoneOREmail", manageData)
              .then((res) => {
                if (res.data.length > 0) {
                  ManagedBY = res.data[0].ManagedBy;
                  var counterData = {
                    PersonID: res.data[0].ManagedBy,
                  };
                  api
                    .post("userManagement/updateLeadCounter", counterData)
                    .then((counterDatares) => {});
                } else if (
                  this.state.PersonID != "" &&
                  this.state.UserAccess == 1
                ) {
                  var leadCountData = {
                    PersonID: this.state.PersonID,
                  };
                  api
                    .post("userManagement/updateLeadCounter", leadCountData)
                    .then((res) => {});
                } else {
                  if (this.state.FromSelectedCountry.value == 202) {
                    fetch(
                      CommonConfig.zipCodeAPIKey(
                        this.state.FromZip,
                        this.state.FromSelectedCountry.label
                      )
                    )
                      .then((result) => result.json())
                      .then((data) => {
                        var lat =
                          data["results"][0]["geometry"]["location"]["lat"];
                        var lon =
                          data["results"][0]["geometry"]["location"]["lng"];

                        fetch(CommonConfig.timezoneAPI(lat, lon))
                          .then((res) => res.json())
                          .then((data) => {
                            var timeZoneName = "";
                            if (
                              data["timeZoneName"].indexOf("Central") !== -1
                            ) {
                              timeZoneName = "Central";
                            }
                            if (
                              data["timeZoneName"].indexOf("Eastern") !== -1
                            ) {
                              timeZoneName = "Eastern";
                            }
                            if (
                              data["timeZoneName"].indexOf("Mountain") !== -1
                            ) {
                              timeZoneName = "Mountain";
                            }
                            if (
                              data["timeZoneName"].indexOf("Pacific") !== -1
                            ) {
                              timeZoneName = "Pacific";
                            }
                            if (data["timeZoneName"].indexOf("Alaska") !== -1) {
                              timeZoneName = "Alaska";
                            }
                            if (data["timeZoneName"].indexOf("Hawaii") !== -1) {
                              timeZoneName = "Hawaii";
                            }

                            var timeData = {
                              TimeZoneName: timeZoneName,
                            };
                            api
                              .post(
                                "userManagement/getTimeZoneAccess",
                                timeData
                              )
                              .then(async (res) => {
                                if (res.data.length > 0) {
                                  for (var i = 0; i < res.data.length; i++) {
                                    var leadAssignId = {
                                      LeadAssignmentID:
                                        res.data[i].LeadAssignmentID,
                                    };

                                    await api
                                      .post(
                                        "userManagement/getContentAccess",
                                        leadAssignId
                                      )
                                      .then((contentres) => {
                                        for (
                                          var p = 0;
                                          p < this.state.documentData.length;
                                          p++
                                        ) {
                                          PackageRes = contentres.data;
                                          if (this.state.documentData[p] == 1) {
                                            PackageName = "Boxes";
                                          }
                                          if (this.state.documentData[p] == 2) {
                                            PackageName = "Document";
                                          }
                                          if (this.state.documentData[p] == 3) {
                                            PackageName = "Furniture";
                                          }
                                          if (this.state.documentData[p] == 4) {
                                            PackageName = "Television";
                                          }
                                          if (this.state.documentData[p] == 5) {
                                            PackageName = "Auto";
                                          }

                                          PackageRes.forEach((item) => {
                                            if (
                                              item.ContentName == PackageName
                                            ) {
                                              if (item.IsAccess == 1) {
                                                Access = 1;
                                              } else {
                                                Access = 0;
                                                elsecalled = 1;
                                              }
                                            }
                                          });

                                          if (
                                            this.state.documentData.length ==
                                            p + 1
                                          ) {
                                            if (
                                              Access == 1 &&
                                              elsecalled != 1
                                            ) {
                                              var person = {
                                                PersonID: res.data[i].PersonID,
                                              };
                                              PersonList.push(person);
                                            }
                                          }
                                        }
                                      });
                                  }
                                }
                              });
                          });
                      });

                    for (var pr = 0; pr < PersonList.length; pr++) {
                      var personleaddat = {
                        PersonID: PersonList[pr].PersonID,
                      };
                      api
                        .post("userManagement/getLeadConidtions", personleaddat)
                        .then((leadres) => {
                          if (leadres.success == 1) {
                            if (leadres.data.succes == 1) {
                              var personId = [
                                {
                                  PersonID: PersonList[pr].PersonID,
                                  CurrentLeadsCount:
                                    leadres.data.CurrentLeadsCount,
                                },
                              ];
                              finalManagedBy.push(personId);
                            }
                          }
                        });
                    }

                    if (finalManagedBy.length > 0) {
                      var minval = finalManagedBy.reduce((x, y) => {
                        return x.CurrentLeadsCount < y.CurrentLeadsCount
                          ? x.CurrentLeadsCount
                          : y.CurrentLeadsCount;
                      });

                      var key = finalManagedBy.findIndex((x) => {
                        return x.CurrentLeadsCount == minval;
                      });

                      ManagedBY = finalManagedBy[key].PersonID;
                      var leadnewcntdata = {
                        PersonID: ManagedBY,
                      };

                      api
                        .post(
                          "userManagement/updateLeadCounter",
                          leadnewcntdata
                        )
                        .then((updateres) => {});
                    } else {
                      ManagedBY = null;
                    }
                  } else if (
                    this.state.ToSelectedCountry.value == 202 &&
                    this.state.FromSelectedCountry.value != 202
                  ) {
                    fetch(
                      CommonConfig.zipCodeAPIKey(
                        this.state.FromZip,
                        this.state.FromSelectedCountry.label
                      )
                    )
                      .then((result) => result.json())
                      .then((data) => {
                        var lat =
                          data["results"][0]["geometry"]["location"]["lat"];
                        var lon =
                          data["results"][0]["geometry"]["location"]["lng"];

                        fetch(CommonConfig.timezoneAPI(lat, lon))
                          .then((res) => res.json())
                          .then((data) => {
                            var timeZoneName = "";
                            if (
                              data["timeZoneName"].indexOf(
                                "Central Daylight Time"
                              ) !== -1
                            ) {
                              timeZoneName = "Central";
                            }
                            if (
                              data["timeZoneName"].indexOf(
                                "Eastern Daylight Time"
                              ) !== -1
                            ) {
                              timeZoneName = "Eastern";
                            }
                            if (
                              data["timeZoneName"].indexOf(
                                "Mountain Daylight Time"
                              ) !== -1
                            ) {
                              timeZoneName = "Mountain";
                            }
                            if (
                              data["timeZoneName"].indexOf(
                                "Pacific Daylight Time"
                              ) !== -1
                            ) {
                              timeZoneName = "Pacific";
                            }
                            if (
                              data["timeZoneName"].indexOf(
                                "Alaska Daylight Time"
                              ) !== -1
                            ) {
                              timeZoneName = "Alaska";
                            }
                            if (
                              data["timeZoneName"].indexOf(
                                "Hawaii-Aleutian Standard Time"
                              ) !== -1
                            ) {
                              timeZoneName = "Hawaii";
                            }

                            var timeData = {
                              TimeZoneName: timeZoneName,
                            };
                            api
                              .post(
                                "userManagement/getTimeZoneAccess",
                                timeData
                              )
                              .then((res) => {
                                if (res.data.length > 0) {
                                  for (var i = 0; i < res.data.length; i++) {
                                    var leadAssignId = {
                                      LeadAssignmentID:
                                        res.data[i].LeadAssignmentID,
                                    };

                                    api
                                      .post(
                                        "userManagement/getContentAccess",
                                        leadAssignId
                                      )
                                      .then((contentres) => {
                                        for (
                                          var p = 0;
                                          p < this.state.documentData.length;
                                          p++
                                        ) {
                                          PackageRes = contentres.data;
                                          if (this.state.documentData[p] == 1) {
                                            PackageName = "Boxes";
                                          }
                                          if (this.state.documentData[p] == 2) {
                                            PackageName = "Document";
                                          }
                                          if (this.state.documentData[p] == 3) {
                                            PackageName = "Furniture";
                                          }
                                          if (this.state.documentData[p] == 4) {
                                            PackageName = "Television";
                                          }
                                          if (this.state.documentData[p] == 5) {
                                            PackageName = "Auto";
                                          }

                                          PackageRes.forEach((item) => {
                                            if (
                                              item.ContentName == PackageName
                                            ) {
                                              if (item.IsAccess == 1) {
                                                Access = 1;
                                              } else {
                                                Access = 0;
                                                elsecalled = 1;
                                              }
                                            }
                                          });

                                          if (
                                            this.state.documentData.length ==
                                            p + 1
                                          ) {
                                            if (
                                              Access == 1 &&
                                              elsecalled != 1
                                            ) {
                                              var person = {
                                                PersonID: res.data[i].PersonID,
                                              };
                                              PersonList.push(person);
                                            }
                                          }
                                        }
                                      });
                                  }
                                }
                              });
                          });
                      });

                    for (var pr = 0; pr < PersonList.length; pr++) {
                      var personleaddat = {
                        PersonID: PersonList[pr].PersonID,
                      };

                      api
                        .post("userManagement/getLeadConidtions", personleaddat)
                        .then((leadres) => {
                          if (leadres.success == 1) {
                            if (leadres.data.succes == 1) {
                              var personId = [
                                {
                                  PersonID: PersonList[pr].PersonID,
                                  CurrentLeadsCount:
                                    leadres.data.CurrentLeadsCount,
                                },
                              ];

                              finalManagedBy.push(personId);
                            }
                          }
                        });
                    }

                    if (finalManagedBy.length > 0) {
                      var minval = finalManagedBy.reduce((x, y) => {
                        return x.CurrentLeadsCount < y.CurrentLeadsCount
                          ? x.CurrentLeadsCount
                          : y.CurrentLeadsCount;
                      });

                      var key = finalManagedBy.findIndex((x) => {
                        return x.CurrentLeadsCount == minval;
                      });

                      ManagedBY = finalManagedBy[key].PersonID;
                      var leadnewcntdata = {
                        PersonID: ManagedBY,
                      };

                      api
                        .post(
                          "userManagement/updateLeadCounter",
                          leadnewcntdata
                        )
                        .then((updateres) => {});
                    } else {
                      ManagedBY = null;
                    }
                  } else {
                    ManagedBY = null;
                  }
                }

                var nopack = [];
                var temp = document.getElementsByName("BoxDetails[No_Pack]");
                var boxarray = [].concat.apply(nopack, temp);
                No_packBoxDetails = boxarray.map((x) => {
                  return x.value;
                });

                var weightpack = [];
                var temp = document.getElementsByName("BoxDetails[Weight]");
                var boxweightarray = [].concat.apply(weightpack, temp);
                WeightBoxDetails = boxweightarray.map((x) => {
                  return x.value;
                });

                var lengthpack = [];
                var temp = document.getElementsByName("BoxDetails[Length]");
                var lengthboxarray = [].concat.apply(lengthpack, temp);
                LengthBoxDetails = lengthboxarray.map((x) => {
                  return x.value;
                });

                var widthpack = [];
                var temp = document.getElementsByName("BoxDetails[Width]");
                var widthboxarray = [].concat.apply(widthpack, temp);
                WidthBoxDetails = widthboxarray.map((x) => {
                  return x.value;
                });

                var heightpack = [];
                var temp = document.getElementsByName("BoxDetails[Height]");
                var heightboxarray = [].concat.apply(heightpack, temp);
                HeightBoxDetails = heightboxarray.map((x) => {
                  return x.value;
                });

                var carmake = [];
                var temp = document.getElementsByName("CarDetails[Make]");
                var makecararray = [].concat.apply(carmake, temp);
                MakeCarDetails = makecararray.map((x) => {
                  return x.value;
                });

                var modelcar = [];
                var temp = document.getElementsByName("CarDetails[Model]");
                var modelcararray = [].concat.apply(modelcar, temp);
                ModelCarDetails = modelcararray.map((x) => {
                  return x.value;
                });

                var yearcar = [];
                var temp = document.getElementsByName("CarDetails[Year]");
                var yearcararray = [].concat.apply(yearcar, temp);
                YearCarDetails = yearcararray.map((x) => {
                  return x.value;
                });

                var notele = [];
                var temp = document.getElementsByName(
                  "TelevisionDetails[Make]"
                );
                var maketelearray = [].concat.apply(notele, temp);
                var No_packTelevisionDetails = maketelearray.map((x) => {
                  return x.value;
                });

                var notele = [];
                var temp = document.getElementsByName(
                  "TelevisionDetails[Make]"
                );
                var makenewtelearray = [].concat.apply(notele, temp);
                MakeTelevisionDetails = makenewtelearray.map((x) => {
                  return x.value;
                });

                var notele = [];
                var temp = document.getElementsByName(
                  "TelevisionDetails[Model]"
                );
                var modelnewtelearray = [].concat.apply(notele, temp);
                ModelTelevisionDetails = modelnewtelearray.map((x) => {
                  return x.value;
                });

                var weighttele = [];
                var temp = document.getElementsByName(
                  "TelevisionDetails[Weight]"
                );
                var weighttelearray = [].concat.apply(weighttele, temp);
                WeightTelevisionDetails = weighttelearray.map((x) => {
                  return x.value;
                });

                var lengthtele = [];
                var temp = document.getElementsByName(
                  "TelevisionDetails[Length]"
                );
                var lengthtelearray = [].concat.apply(lengthtele, temp);
                LengthTelevisionDetails = lengthtelearray.map((x) => {
                  return x.value;
                });

                var widthtele = [];
                var temp = document.getElementsByName(
                  "TelevisionDetails[Width]"
                );
                var widthtelearray = [].concat.apply(widthtele, temp);
                var WidthTelevisionDetails = widthtelearray.map((x) => {
                  return x.value;
                });

                var heighttele = [];
                var temp = document.getElementsByName(
                  "TelevisionDetails[Height]"
                );
                var heighttelearray = [].concat.apply(heighttele, temp);
                var HeightTelevisionDetails = heighttelearray.map((x) => {
                  return x.value;
                });

                var doc = [];
                var temp = document.getElementsByName("DocumnetDetails[]");
                var docarray = [].concat.apply(doc, temp);
                var DocumnetDetails = docarray.map((x) => {
                  return x.value;
                });

                if (this.state.packagetype === "Envelope") {
                  this.state.packgedata.no_pack.push(1);
                  this.state.packgedata.weight.push(0.5);
                  this.state.packgedata.len.push(10);
                  this.state.packgedata.width.push(13);
                  this.state.packgedata.height.push(1);
                  this.state.packgedata.insuredValue.push(0);
                } else {
                  this.state.documentData.find((x) => {
                    if (x === "1") {
                      for (let j = 0; j < No_packBoxDetails.length; j++) {
                        this.state.packgedata.no_pack.push(
                          No_packBoxDetails[j]
                        );
                        this.state.packgedata.weight.push(WeightBoxDetails[j]);
                        this.state.packgedata.len.push(LengthBoxDetails[j]);
                        this.state.packgedata.width.push(WidthBoxDetails[j]);
                        this.state.packgedata.height.push(HeightBoxDetails[j]);
                        this.state.packgedata.insuredValue.push(0);
                      }
                    }
                    if (x === "3") {
                    }
                    if (x === "4") {
                      for (let j = 0; j < MakeTelevisionDetails.length; j++) {
                        this.state.packgedata.no_pack.push(1);
                        this.state.packgedata.weight.push(
                          WeightTelevisionDetails[j]
                        );
                        this.state.packgedata.len.push(
                          LengthTelevisionDetails[j]
                        );
                        this.state.packgedata.width.push(
                          WidthTelevisionDetails[j]
                        );
                        this.state.packgedata.height.push(
                          HeightTelevisionDetails[j]
                        );
                        this.state.packgedata.insuredValue.push(0);
                      }
                    }
                    if (x === "5") {
                    }
                  });
                }

                setTimeout(() => {
                  let PackageDetails = [];
                  let CarDetails = [];
                  this.state.documentData.find((x) => {
                    if (x === "1") {
                      for (var i = 0; i < No_packBoxDetails.length; i++) {
                        var packageOBJ = {
                          PackageType: x,
                          ActualWeight: WeightBoxDetails[i],
                          DimensionL: LengthBoxDetails[i],
                          DimensionW: WidthBoxDetails[i],
                          DimensionH: HeightBoxDetails[i],
                          Status: "Active",
                          Quantity: No_packBoxDetails[i],
                        };
                        PackageDetails.push(packageOBJ);
                      }
                    }
                    if (x === "2") {
                      var envelopOBJ = {
                        PackageType: x,
                        ActualWeight: 0.5,
                        DimensionL: 10,
                        DimensionW: 13,
                        DimensionH: 1,
                        Status: "Active",
                        Quantity: 1,
                      };
                      PackageDetails.push(envelopOBJ);
                    }
                    if (x === "3") {
                      var packObj = {
                        PackageType: x,
                        ActualWeight: 0,
                        Status: "Active",
                        Quantity: 1,
                      };
                      PackageDetails.push(packObj);
                    }
                    if (x === "4") {
                      for (var i = 0; i < MakeTelevisionDetails.length; i++) {
                        var packageOBJ = {
                          PackageType: x,
                          ActualWeight: WeightTelevisionDetails[i],
                          DimensionL: LengthTelevisionDetails[i],
                          DimensionW: WidthTelevisionDetails[i],
                          DimensionH: HeightTelevisionDetails[i],
                          Status: "Active",
                          TVMake: MakeTelevisionDetails[i],
                          TVModel: ModelTelevisionDetails[i],
                          Quantity: 1,
                        };
                        PackageDetails.push(packageOBJ);
                      }
                    }
                    if (x === "5") {
                      for (var i = 0; i < MakeCarDetails.length; i++) {
                        var carOBJ = {
                          PackageType: x,
                          CarMake: MakeCarDetails[i],
                          CarModel: ModelCarDetails[i],
                          CarYear: YearCarDetails[i],
                          Status: "Active",
                        };
                        PackageDetails.push(carOBJ);
                      }
                    }
                  });

                  var salesLeadData = {
                    userid: 1,
                    SalesLeadManagementID: null,
                    ManagedBy: ManagedBY,
                    SalesLeadsType: null,
                    ContactName: this.state.ContactName,
                    CompanyName: "",
                    Email: this.state.email,
                    PhoneNumber: this.state.PhoneNumber,
                    FromState: this.state.FromState,
                    FromCity: this.state.FromCity,
                    ToCity: this.state.ToCity,
                    FromZipCode: this.state.FromZip,
                    ToZipCode: this.state.ToZip,
                    FromCountryID: this.state.FromSelectedCountry.value,
                    ToState: this.state.ToState,
                    ToCountryID: this.state.ToSelectedCountry.value,
                    SalesLeadDate: null,
                    SalesLeadFollowupDate: null,
                    TentativeMoveDate: null,
                    ReferredBy: "",
                    IPAddress: null,
                    MACAddress: null,
                    DeliveryType:
                      this.state.IsResidential == 1
                        ? "Residential"
                        : "Commercial",
                    ProposalStatus: "New",
                    PackageList: PackageDetails,
                    CarList: CarDetails,
                    NoteList: null,
                    WeightType: null,
                  };

                  var saleLeadId;
                  api
                    .post("salesLead/addSalesLead", salesLeadData)
                    .then((saleres) => {
                      var salesLeadID = saleres.data;
                      var TotalLength = 0;
                      var TotalWidth = 0;
                      var TotalHeight = 0;
                      var PackageDetails = [];
                      for (
                        var i = 0;
                        i < this.state.packgedata.no_pack.length;
                        i++
                      ) {
                        TotalLength += Number(this.state.packgedata.len[i]);
                        TotalWidth += Number(this.state.packgedata.width[i]);
                        TotalHeight += Number(this.state.packgedata.height[i]);
                        var packageOBJ = {
                          PackageNumber: this.state.packgedata.no_pack[i],
                          PackageWeight: this.state.packgedata.weight[i],
                          PackageWidth: this.state.packgedata.width[i],
                          PackageLength: this.state.packgedata.len[i],
                          PackageHeight: this.state.packgedata.height[i],
                          PackageChargableWeight: 0,
                          PackageInsuredValue: 0,
                        };
                        PackageDetails.push(packageOBJ);
                      }
                      var TotalChargeWeight = 0;
                      var TotalInsuredValue = 0;
                      var TotalWeight = 0;
                      var TotalChargable = 0;
                      var ChargableWeight = [];
                      var filterFromCountryData = this.state.CountryList.filter(
                        (x) =>
                          x.CountryID == this.state.FromSelectedCountry.value
                      );
                      var filterToCountryData = this.state.CountryList.filter(
                        (x) => x.CountryID == this.state.ToSelectedCountry.value
                      );
                      if (
                        filterFromCountryData[0].CountryCode &&
                        filterToCountryData[0].CountryCode
                      ) {
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
                              Number(PackageDetails[i].PackageWeight) *
                              Number(PackageDetails[i].PackageNumber);
                          }

                          if (PackageDetails[i].PackageWidth) {
                            WE = Number(PackageDetails[i].PackageWidth);
                          }

                          if (PackageDetails[i].PackageLength) {
                            LE = Number(PackageDetails[i].PackageLength);
                          }

                          if (PackageDetails[i].PackageHeight) {
                            HE = Number(PackageDetails[i].PackageHeight);
                          }

                          if (
                            filterFromCountryData[0].CountryCode == "US" &&
                            filterToCountryData[0].CountryCode == "US"
                          ) {
                            Total =
                              Math.ceil(parseFloat((WE * LE * HE) / 166)) *
                              Number(PackageDetails[i].PackageNumber);
                          } else {
                            Total =
                              Math.ceil(parseFloat((WE * LE * HE) / 139)) *
                              Number(PackageDetails[i].PackageNumber);
                          }

                          if (
                            filterFromCountryData[0].CountryCode == "IN" &&
                            filterToCountryData[0].CountryCode == "US"
                          ) {
                            Total =
                              Math.ceil(
                                parseFloat(parseFloat(Total) / parseFloat(2.2))
                              ) * Number(PackageDetails[i].PackageNumber);
                          }

                          if (Weight > Total) {
                            PackageDetails[i].PackageChargableWeight = Number(
                              Weight
                            );
                            TotalChargeWeight =
                              parseInt(TotalChargeWeight) + parseInt(Weight);
                          } else {
                            PackageDetails[i].PackageChargableWeight = Number(
                              Total
                            );
                            TotalChargeWeight =
                              parseInt(TotalChargeWeight) + parseInt(Total);
                          }

                          if (PackageDetails[i].PackageChargableWeight) {
                            ChargableWeight.push(
                              PackageDetails[
                                i
                              ].PackageChargableWeight.toString()
                            );
                          }

                          if (PackageDetails[i].PackageInsuredValue) {
                            Insure =
                              Number(PackageDetails[i].PackageInsuredValue) *
                              Number(PackageDetails[i].PackageNumber);
                          } else {
                            PackageDetails[i].PackageInsuredValue = 0;
                            Insure =
                              Number(PackageDetails[i].PackageInsuredValue) *
                              Number(PackageDetails[i].PackageNumber);
                          }

                          if (PackageDetails[i].PackageChargableWeight) {
                            Chargable = Number(
                              PackageDetails[i].PackageChargableWeight
                            );
                          }

                          TotalInsuredValue =
                            Number(TotalInsuredValue) + Number(Insure);
                          TotalWeight = Number(TotalWeight) + Number(Weight);
                          TotalChargable =
                            Number(TotalChargable) + Number(Chargable);
                        }
                      }
                      var PackageNumber1 = [];
                      var Weight1 = [];
                      var DimeL1 = [];
                      var DimeW1 = [];
                      var DimeH1 = [];
                      var ChargableWeight1 = [];
                      var InsuredValues1 = [];

                      var PackagedetailsFinalValues = [];

                      var TotalPackageNumber1 = 0;
                      var TotalLength1 = 0;
                      var TotalWidth1 = 0;
                      var TotalHeight1 = 0;
                      var TotalInsuredValues1 = 0;
                      for (var i = 0; i < PackageDetails.length; i++) {
                        if (PackageDetails[i].PackageNumber) {
                          TotalPackageNumber1 =
                            Number(TotalPackageNumber1) +
                            parseInt(PackageDetails[i].PackageNumber);
                          PackageNumber1.push(
                            PackageDetails[i].PackageNumber.toString()
                          );
                        } else {
                          PackageDetails[i].PackageNumber = "1";
                          TotalPackageNumber1 =
                            Number(TotalPackageNumber1) +
                            parseInt(PackageDetails[i].PackageNumber);
                          PackageNumber1.push(
                            PackageDetails[i].PackageNumber.toString()
                          );
                        }
                        Weight1.push(
                          PackageDetails[i].PackageWeight.toString()
                        );

                        if (PackageDetails[i].PackageLength.toString()) {
                          DimeL1.push(
                            PackageDetails[i].PackageLength.toString()
                          );
                        } else {
                          PackageDetails[i].PackageLength = "1";
                          DimeL1.push(
                            PackageDetails[i].PackageLength.toString()
                          );
                        }

                        if (PackageDetails[i].PackageWidth) {
                          DimeW1.push(
                            PackageDetails[i].PackageWidth.toString()
                          );
                        } else {
                          PackageDetails[i].PackageWidth = "1";
                          DimeW1.push(
                            PackageDetails[i].PackageWidth.toString()
                          );
                        }

                        if (PackageDetails[i].PackageHeight) {
                          DimeH1.push(
                            PackageDetails[i].PackageHeight.toString()
                          );
                        } else {
                          PackageDetails[i].PackageHeight = "1";
                          DimeH1.push(
                            PackageDetails[i].PackageHeight.toString()
                          );
                        }

                        if (PackageDetails[i].PackageChargableWeight) {
                          ChargableWeight1.push(
                            PackageDetails[i].PackageChargableWeight.toString()
                          );
                        }

                        if (PackageDetails[i].PackageInsuredValue) {
                          InsuredValues1.push(
                            PackageDetails[i].PackageInsuredValue.toString()
                          );
                        } else {
                          PackageDetails[i].PackageInsuredValue = "0";
                          InsuredValues1.push(
                            PackageDetails[i].PackageInsuredValue.toString()
                          );
                        }
                        TotalLength1 += parseInt(
                          PackageDetails[i].PackageLength
                        );
                        TotalWidth1 += parseInt(PackageDetails[i].PackageWidth);
                        TotalHeight1 += parseInt(
                          PackageDetails[i].PackageHeight
                        );
                        TotalInsuredValues1 += parseInt(
                          PackageDetails[i].PackageInsuredValue
                        );
                      }

                      TotalChargeWeight = 0;
                      TotalInsuredValue = 0;
                      TotalWeight = 0;
                      TotalChargable = 0;
                      ChargableWeight = [];
                      if (
                        filterFromCountryData[0].CountryCode &&
                        filterToCountryData[0].CountryCode
                      ) {
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
                              Number(PackageDetails[i].PackageWeight) *
                              Number(PackageDetails[i].PackageNumber);
                          }

                          if (PackageDetails[i].PackageWidth) {
                            WE = Number(PackageDetails[i].PackageWidth);
                          }

                          if (PackageDetails[i].PackageLength) {
                            LE = Number(PackageDetails[i].PackageLength);
                          }

                          if (PackageDetails[i].PackageHeight) {
                            HE = Number(PackageDetails[i].PackageHeight);
                          }

                          if (
                            filterFromCountryData[0].CountryCode == "US" &&
                            filterToCountryData[0].CountryCode == "US"
                          ) {
                            Total =
                              Math.ceil(parseFloat((WE * LE * HE) / 166)) *
                              Number(PackageDetails[i].PackageNumber);
                          } else {
                            Total =
                              Math.ceil(parseFloat((WE * LE * HE) / 139)) *
                              Number(PackageDetails[i].PackageNumber);
                          }

                          if (
                            filterFromCountryData[0].CountryCode == "IN" &&
                            filterToCountryData[0].CountryCode == "US"
                          ) {
                            Total =
                              Math.ceil(
                                parseFloat(parseFloat(Total) / parseFloat(2.2))
                              ) * Number(PackageDetails[i].PackageNumber);
                          }

                          if (Weight > Total) {
                            PackageDetails[i].PackageChargableWeight = Number(
                              Weight
                            );
                            TotalChargeWeight =
                              parseInt(TotalChargeWeight) + parseInt(Weight);
                          } else {
                            PackageDetails[i].PackageChargableWeight = Number(
                              Total
                            );
                            TotalChargeWeight =
                              parseInt(TotalChargeWeight) + parseInt(Total);
                          }

                          ChargableWeight.push(
                            PackageDetails[i].PackageChargableWeight.toString()
                          );

                          if (PackageDetails[i].PackageInsuredValue) {
                            Insure =
                              Number(PackageDetails[i].PackageInsuredValue) *
                              Number(PackageDetails[i].PackageNumber);
                          } else {
                            PackageDetails[i].PackageInsuredValue = 0;
                            Insure =
                              Number(PackageDetails[i].PackageInsuredValue) *
                              Number(PackageDetails[i].PackageNumber);
                          }

                          if (PackageDetails[i].PackageChargableWeight) {
                            Chargable = Number(
                              PackageDetails[i].PackageChargableWeight
                            );
                          }

                          TotalInsuredValue =
                            Number(TotalInsuredValue) + Number(Insure);
                          TotalWeight = Number(TotalWeight) + Number(Weight);
                          TotalChargable =
                            Number(TotalChargable) + Number(Chargable);
                        }
                      }

                      if (TotalChargable < 50) {
                        var data = {
                          data: {
                            quoteData: {
                              PackageType: this.state.packagetype,
                              WeightType: "LBS",
                              UpsData: {
                                FromCountry: JSON.stringify(
                                  filterFromCountryData[0]
                                ),
                                FromCity: this.state.FromCity,
                                FromUPSCity: "",
                                FromFedExCity: "",
                                FromZipCode: this.state.FromZip,
                                FromStateProvinceCode: this.state.fromStateName,
                                ToCountry: JSON.stringify(
                                  filterToCountryData[0]
                                ),
                                ToCity: this.state.ToCity,
                                ToUPSCity: "",
                                ToFedExCity: "",
                                ToZipCode: this.state.ToZip,
                                ToStateProvinceCode: this.state.toStateName,
                              },

                              PackageNumber: this.state.packgedata.no_pack,
                              Weight: this.state.packgedata.weight,
                              DimeL: this.state.packgedata.len,
                              DimeW: this.state.packgedata.width,
                              DimeH: this.state.packgedata.height,
                              TotalLength: TotalLength,
                              TotalWidth: TotalWidth,
                              TotalInsuredValues: TotalInsuredValue,
                              TotalHeight: TotalHeight,
                              ChargableWeight: ChargableWeight,
                              InsuredValues: this.state.packgedata.insuredValue,

                              TotalWeight: TotalChargable,
                              IsPickUp: false,
                              WeightCount: this.state.packgedata.weight.length,
                              LengthCount: this.state.packgedata.len.length,
                              WidthCount: this.state.packgedata.width.length,
                              HeightCount: this.state.packgedata.height.length,
                              PackCount: this.state.packgedata.no_pack.length,
                              PackageDetailsCount: this.state.packgedata.no_pack
                                .length,
                              PackageDetailsText: this.state.packgedata.no_pack
                                .length,
                              EnvelopeWeightLBSText: TotalChargable
                                ? TotalChargable
                                : 0,
                              ShipDate: new Date().toISOString(),

                              PackageDetails: PackageDetails,
                              AgentCode: 1,
                            },
                          },
                        };
                        if (this.state.IsResidential === true) {
                          data.data.quoteData.IsResidencial = true;
                        }
                        data.data.quoteData.PackageNumber = PackageNumber1;
                        data.data.quoteData.Weight = Weight1;
                        data.data.quoteData.DimeL = DimeL1;
                        data.data.quoteData.DimeW = DimeW1;
                        data.data.quoteData.DimeH = DimeH1;
                        data.data.quoteData.TotalLength = TotalLength1;
                        data.data.quoteData.TotalWidth = TotalWidth1;
                        data.data.quoteData.TotalInsuredValues = TotalInsuredValues1;
                        data.data.quoteData.TotalHeight = TotalHeight1;
                        data.data.quoteData.ChargableWeight = ChargableWeight1;
                        data.data.quoteData.InsuredValues = InsuredValues1;
                        data.data.quoteData.WeightCount = Weight1.length;
                        data.data.quoteData.LengthCount = DimeL1.length;
                        data.data.quoteData.WidthCount = DimeW1.length;
                        data.data.quoteData.HeightCount = DimeH1.length;

                        data.data.quoteData.PackCount = TotalPackageNumber1.toString();
                        data.data.quoteData.PackageDetailsCount = TotalPackageNumber1;
                        data.data.quoteData.PackageDetailsText = TotalPackageNumber1.toString();
                        let imgArray = [];

                        api.post("getQuote/GetRateImages").then((msg) => {
                          imgArray = msg.data[0];

                          api
                            .post("getQuote/getRates", data.data)
                            .then((msg) => {
                              this.hideLoader();

                              let contentText = "Boxes";
                              if (this.state.packagetype == "Envelope") {
                                contentText = "Envelop";
                                TotalChargable = 0.5;
                              }

                              var arr1 = [];
                              var arr2 = [];

                              msg.data.forEach((obj) => {
                                debugger;
                                if (obj.IsError) {
                                  if (
                                    obj.Delivery_Date !==
                                    "Service was validated at the country level, but might not be valid for the actual intended city for the destination."
                                  ) {
                                    arr2.push(obj);
                                  }
                                } else {
                                  if (
                                    obj.Delivery_Date !==
                                    "Service was validated at the country level, but might not be valid for the actual intended city for the destination."
                                  ) {
                                    arr1.push(obj);
                                  }
                                }
                              });
                              var msg = [];
                              msg.data = arr1.concat(arr2);

                              for (var idx = 0; idx < msg.data.length; idx++) {
                                const element = msg.data[idx];
                                let isError = element.IsError;
                                let Baseurl = window.btoa(
                                  msg.data[idx].ServiceType +
                                    "/" +
                                    msg.data[idx].MainServiceName +
                                    "/" +
                                    msg.data[idx].ServiceDisplayName +
                                    "/" +
                                    msg.data[idx].Rates.toFixed(2) +
                                    "",
                                  console.log(
                                    "rate",
                                    msg.data[idx].Rates.toFixed(2)
                                  )
                                );

                                let imgUrl = imgArray.filter(
                                  (x) =>
                                    x.MainServiceName ===
                                    element.MainServiceName
                                );
                                msg.data[idx].urlIMG = imgUrl[0].IMGURL;
                                let bookNowURL =
                                  `https://hubuat.sflworldwide.com/auth/SalesLeadsRedirect-page/` +
                                  Baseurl +
                                  `?saleid=` +
                                  encodeURIComponent(salesLeadID);
                                this.state.tempFinalImage.push(
                                  <div className="search-result-row">
                                    <div className="provide-img">
                                      <span>
                                        <img src={imgUrl[0].IMGURL}></img>
                                      </span>
                                    </div>
                                    <div className="provider-name">
                                      <h3>{element.ServiceDisplayName}</h3>
                                    </div>
                                    <div className="est-date">
                                      <span>Estimated Delivery</span>
                                      <p>{element.Delivery_Date}</p>
                                    </div>
                                    <div className="quote-price">
                                      <h3>{element.Rates.toFixed(2)}</h3>
                                    </div>
                                    <div className="book-quote">
                                      {element.Delivery_Date !==
                                      "Invalid Destination Postal Code." ? (
                                        <a
                                          href={bookNowURL}
                                          target="_blank"
                                          className="next-btn"
                                        >
                                          Book Now{" "}
                                          <img
                                            src={arrowRightWhite}
                                            alt="Next"
                                          />
                                        </a>
                                      ) : (
                                        <div className="Disablebook-quote a">
                                          <a
                                            target="_blank"
                                            className="next-btn"
                                          >
                                            Book Now{" "}
                                            <img
                                              src={arrowRightWhite}
                                              alt="Next"
                                            />
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              }
                              this.setState({
                                finalImage: this.state.tempFinalImage,
                              });

                              let mailData = {
                                SalesLeadID: salesLeadID,
                                ChargableWeight: ChargableWeight,
                                RateData: msg.data,
                              };
                              api
                                .post("salesLead/sendGetRateEmail", mailData)
                                .then((mailres) => {});
                            });
                        });
                      } else {
                        this.hideLoader();
                        this.props.history.push({
                          pathname: "/auth/get-quote-thanks",
                        });
                      }
                    });
                }, 3000);
              });
          } else {
            var PackageRes = [];
            var PersonList = [];
            var finalManagedBy = [];
            var ManagedBY = "";
            var Access = 0;
            var elsecalled = 0;
            var PackageName = "";
            var manageData = {};
            var newpackagetype = "";
            debugger;
            if (this.state.documentData[0] == 2) {
              debugger;
              newpackagetype = "Document";
            }
            if (this.state.documentData[0] == 1) {
              debugger;
              newpackagetype = "Boxes";
            }
            if (this.state.documentData[0] == 4) {
              debugger;
              newpackagetype = "Television";
            }
            if (this.state.documentData[0] == 3) {
              debugger;
              newpackagetype = "Furniture";
            }
            if (this.state.documentData[0] == 5) {
              debugger;
              newpackagetype = "Auto";
            }
            {
              this.state.PersonID
                ? (manageData = {
                    Email: this.state.email,
                    Phone: this.state.PhoneNumber,
                    PersonID: this.state.PersonID,
                    newpackagetype: newpackagetype,
                  })
                : (manageData = {
                    Email: this.state.email,
                    Phone: this.state.PhoneNumber,
                    PersonID: 0,
                    newpackagetype: newpackagetype,
                  });
            }

            this.showLoader();
            api
              .post("salesLead/getManagedByPhoneOREmail", manageData)
              .then((res) => {
                if (res.data.length > 0) {
                  var counterData = {
                    PersonID: res.data[0].ManagedBy,
                  };
                  ManagedBY = res.data[0].ManagedBy;
                  api
                    .post("userManagement/updateLeadCounter", counterData)
                    .then((res) => {});
                } else if (
                  this.state.PersonID != "" &&
                  this.state.UserAccess == 1
                ) {
                  var leadCountData = {
                    PersonID: res.data[0].ManagedBy,
                  };

                  api
                    .post("userManagement/updateLeadCounter", leadCountData)
                    .then((res) => {});
                } else {
                  if (this.state.FromSelectedCountry.value == 202) {
                    fetch(
                      CommonConfig.zipCodeAPIKey(
                        this.state.FromZip,
                        this.state.FromSelectedCountry.label
                      )
                    )
                      .then((result) => result.json())
                      .then((data) => {
                        var lat =
                          data["results"][0]["geometry"]["location"]["lat"];
                        var lon =
                          data["results"][0]["geometry"]["location"]["lng"];

                        fetch(CommonConfig.timezoneAPI(lat, lon))
                          .then((res) => res.json())
                          .then((data) => {
                            var timeZoneName = "";
                            if (
                              data["timeZoneName"].indexOf("Central") !== -1
                            ) {
                              timeZoneName = "Central";
                            }
                            if (
                              data["timeZoneName"].indexOf("Eastern") !== -1
                            ) {
                              timeZoneName = "Eastern";
                            }
                            if (
                              data["timeZoneName"].indexOf("Mountain") !== -1
                            ) {
                              timeZoneName = "Mountain";
                            }
                            if (
                              data["timeZoneName"].indexOf("Pacific") !== -1
                            ) {
                              timeZoneName = "Pacific";
                            }
                            if (data["timeZoneName"].indexOf("Alaska") !== -1) {
                              timeZoneName = "Alaska";
                            }
                            if (data["timeZoneName"].indexOf("Hawaii") !== -1) {
                              timeZoneName = "Hawaii";
                            }

                            var timeData = {
                              TimeZoneName: timeZoneName,
                            };
                            api
                              .post(
                                "userManagement/getTimeZoneAccess",
                                timeData
                              )
                              .then((res) => {
                                if (res.data.length > 0) {
                                  for (var i = 0; i < res.data.length; i++) {
                                    var leadAssignId = {
                                      LeadAssignmentID:
                                        res.data[i].LeadAssignmentID,
                                    };

                                    api
                                      .post(
                                        "userManagement/getContentAccess",
                                        leadAssignId
                                      )
                                      .then((contentres) => {
                                        for (
                                          var p = 0;
                                          p < this.state.documentData.length;
                                          p++
                                        ) {
                                          PackageRes = contentres.data;
                                          if (this.state.documentData[p] == 1) {
                                            PackageName = "Boxes";
                                          }
                                          if (this.state.documentData[p] == 2) {
                                            PackageName = "Document";
                                          }
                                          if (this.state.documentData[p] == 3) {
                                            PackageName = "Furniture";
                                          }
                                          if (this.state.documentData[p] == 4) {
                                            PackageName = "Television";
                                          }
                                          if (this.state.documentData[p] == 5) {
                                            PackageName = "Auto";
                                          }

                                          PackageRes.forEach((item) => {
                                            if (
                                              item.ContentName == PackageName
                                            ) {
                                              if (item.IsAccess == 1) {
                                                Access = 1;
                                              } else {
                                                Access = 0;
                                                elsecalled = 1;
                                              }
                                            }
                                          });

                                          if (
                                            this.state.documentData.length ==
                                            p + 1
                                          ) {
                                            if (
                                              Access == 1 &&
                                              elsecalled != 1
                                            ) {
                                              var person = {
                                                PersonID: res.data[i].PersonID,
                                              };
                                              PersonList.push(person);
                                            }
                                          }
                                        }
                                      });
                                  }
                                }
                              });
                          });
                      });

                    for (var pr = 0; pr < PersonList.length; pr++) {
                      var personleaddat = {
                        PersonID: PersonList[pr].PersonID,
                      };

                      api
                        .post("userManagement/getLeadConidtions", personleaddat)
                        .then((leadres) => {
                          if (leadres.success == 1) {
                            if (leadres.data.succes == 1) {
                              var personId = [
                                {
                                  PersonID: PersonList[pr].PersonID,
                                  CurrentLeadsCount:
                                    leadres.data.CurrentLeadsCount,
                                },
                              ];

                              finalManagedBy.push(personId);
                            }
                          }
                        });
                    }
                    if (finalManagedBy.length > 0) {
                      var minval = finalManagedBy.reduce((x, y) => {
                        return x.CurrentLeadsCount < y.CurrentLeadsCount
                          ? x.CurrentLeadsCount
                          : y.CurrentLeadsCount;
                      });

                      var key = finalManagedBy.findIndex((x) => {
                        return x.CurrentLeadsCount == minval;
                      });
                      ManagedBY = finalManagedBy[key].PersonID;
                      var leadnewcntdata = {
                        PersonID: ManagedBY,
                      };

                      api
                        .post(
                          "userManagement/updateLeadCounter",
                          leadnewcntdata
                        )
                        .then((updateres) => {});
                    } else {
                      ManagedBY = null;
                    }
                  } else if (
                    this.state.ToSelectedCountry.value == 202 &&
                    this.state.FromSelectedCountry.value != 202
                  ) {
                    fetch(
                      CommonConfig.zipCodeAPIKey(
                        this.state.FromZip,
                        this.state.FromSelectedCountry.label
                      )
                    )
                      .then((result) => result.json())
                      .then((data) => {
                        var lat =
                          data["results"][0]["geometry"]["location"]["lat"];
                        var lon =
                          data["results"][0]["geometry"]["location"]["lng"];

                        fetch(CommonConfig.timezoneAPI(lat, lon))
                          .then((res) => res.json())
                          .then((data) => {
                            var timeZoneName = "";
                            if (
                              data["timeZoneName"].indexOf(
                                "Central Daylight Time"
                              ) !== -1
                            ) {
                              timeZoneName = "Central";
                            }
                            if (
                              data["timeZoneName"].indexOf(
                                "Eastern Daylight Time"
                              ) !== -1
                            ) {
                              timeZoneName = "Eastern";
                            }
                            if (
                              data["timeZoneName"].indexOf(
                                "Mountain Daylight Time"
                              ) !== -1
                            ) {
                              timeZoneName = "Mountain";
                            }
                            if (
                              data["timeZoneName"].indexOf(
                                "Pacific Daylight Time"
                              ) !== -1
                            ) {
                              timeZoneName = "Pacific";
                            }
                            if (
                              data["timeZoneName"].indexOf(
                                "Alaska Daylight Time"
                              ) !== -1
                            ) {
                              timeZoneName = "Alaska";
                            }
                            if (
                              data["timeZoneName"].indexOf(
                                "Hawaii-Aleutian Standard Time"
                              ) !== -1
                            ) {
                              timeZoneName = "Hawaii";
                            }

                            var timeData = {
                              TimeZoneName: timeZoneName,
                            };
                            api
                              .post(
                                "userManagement/getTimeZoneAccess",
                                timeData
                              )
                              .then((res) => {
                                if (res.data.length > 0) {
                                  for (var i = 0; i < res.data.length; i++) {
                                    var leadAssignId = {
                                      LeadAssignmentID:
                                        res.data[i].LeadAssignmentID,
                                    };

                                    api
                                      .post(
                                        "userManagement/getContentAccess",
                                        leadAssignId
                                      )
                                      .then((contentres) => {
                                        for (
                                          var p = 0;
                                          p < this.state.documentData.length;
                                          p++
                                        ) {
                                          PackageRes = contentres.data;
                                          if (this.state.documentData[p] == 1) {
                                            PackageName = "Boxes";
                                          }
                                          if (this.state.documentData[p] == 2) {
                                            PackageName = "Document";
                                          }
                                          if (this.state.documentData[p] == 3) {
                                            PackageName = "Furniture";
                                          }
                                          if (this.state.documentData[p] == 4) {
                                            PackageName = "Television";
                                          }
                                          if (this.state.documentData[p] == 5) {
                                            PackageName = "Auto";
                                          }

                                          PackageRes.forEach((item) => {
                                            if (
                                              item.ContentName == PackageName
                                            ) {
                                              if (item.IsAccess == 1) {
                                                Access = 1;
                                              } else {
                                                Access = 0;
                                                elsecalled = 1;
                                              }
                                            }
                                          });

                                          if (
                                            this.state.documentData.length ==
                                            p + 1
                                          ) {
                                            if (
                                              Access == 1 &&
                                              elsecalled != 1
                                            ) {
                                              var person = {
                                                PersonID: res.data[i].PersonID,
                                              };
                                              PersonList.push(person);
                                            }
                                          }
                                        }
                                      });
                                  }
                                }
                              });
                          });
                      });
                    for (var pr = 0; pr < PersonList.length; pr++) {
                      var personleaddat = {
                        PersonID: PersonList[pr].PersonID,
                      };

                      api
                        .post("userManagement/getLeadConidtions", personleaddat)
                        .then((leadres) => {
                          if (leadres.success == 1) {
                            if (leadres.data.succes == 1) {
                              var personId = [
                                {
                                  PersonID: PersonList[pr].PersonID,
                                  CurrentLeadsCount:
                                    leadres.data.CurrentLeadsCount,
                                },
                              ];

                              finalManagedBy.push(personId);
                            }
                          }
                        });
                    }
                    if (finalManagedBy.length > 0) {
                      var minval = finalManagedBy.reduce((x, y) => {
                        return x.CurrentLeadsCount < y.CurrentLeadsCount
                          ? x.CurrentLeadsCount
                          : y.CurrentLeadsCount;
                      });

                      var key = finalManagedBy.findIndex((x) => {
                        return x.CurrentLeadsCount == minval;
                      });

                      ManagedBY = finalManagedBy[key].PersonID;
                      var leadnewcntdata = {
                        PersonID: ManagedBY,
                      };

                      api
                        .post(
                          "userManagement/updateLeadCounter",
                          leadnewcntdata
                        )
                        .then((updateres) => {});
                    } else {
                      ManagedBY = null;
                    }
                  } else {
                    ManagedBY = null;
                  }
                }
                var nopack = [];
                var temp = document.getElementsByName("BoxDetails[No_Pack]");
                var boxarray = [].concat.apply(nopack, temp);
                No_packBoxDetails = boxarray.map((x) => {
                  return x.value;
                });
                var weightpack = [];
                var temp = document.getElementsByName("BoxDetails[Weight]");
                var boxweightarray = [].concat.apply(weightpack, temp);
                WeightBoxDetails = boxweightarray.map((x) => {
                  return x.value;
                });
                var lengthpack = [];
                var temp = document.getElementsByName("BoxDetails[Length]");
                var lengthboxarray = [].concat.apply(lengthpack, temp);
                LengthBoxDetails = lengthboxarray.map((x) => {
                  return x.value;
                });
                var widthpack = [];
                var temp = document.getElementsByName("BoxDetails[Width]");
                var widthboxarray = [].concat.apply(widthpack, temp);
                WidthBoxDetails = widthboxarray.map((x) => {
                  return x.value;
                });
                var heightpack = [];
                var temp = document.getElementsByName("BoxDetails[Height]");
                var heightboxarray = [].concat.apply(heightpack, temp);
                HeightBoxDetails = heightboxarray.map((x) => {
                  return x.value;
                });
                var carmake = [];
                var temp = document.getElementsByName("CarDetails[Make]");
                var makecararray = [].concat.apply(carmake, temp);
                MakeCarDetails = makecararray.map((x) => {
                  return x.value;
                });
                var modelcar = [];
                var temp = document.getElementsByName("CarDetails[Model]");
                var modelcararray = [].concat.apply(modelcar, temp);
                ModelCarDetails = modelcararray.map((x) => {
                  return x.value;
                });
                var yearcar = [];
                var temp = document.getElementsByName("CarDetails[Year]");
                var yearcararray = [].concat.apply(yearcar, temp);
                YearCarDetails = yearcararray.map((x) => {
                  return x.value;
                });
                var notele = [];
                var temp = document.getElementsByName(
                  "TelevisionDetails[Make]"
                );
                var maketelearray = [].concat.apply(notele, temp);
                var No_packTelevisionDetails = maketelearray.map((x) => {
                  return x.value;
                });

                var notele = [];
                var temp = document.getElementsByName(
                  "TelevisionDetails[Make]"
                );
                var makenewtelearray = [].concat.apply(notele, temp);
                MakeTelevisionDetails = makenewtelearray.map((x) => {
                  return x.value;
                });
                var notele = [];
                var temp = document.getElementsByName(
                  "TelevisionDetails[Model]"
                );
                var modelnewtelearray = [].concat.apply(notele, temp);
                ModelTelevisionDetails = modelnewtelearray.map((x) => {
                  return x.value;
                });
                var weighttele = [];
                var temp = document.getElementsByName(
                  "TelevisionDetails[Weight]"
                );
                var weighttelearray = [].concat.apply(weighttele, temp);
                WeightTelevisionDetails = weighttelearray.map((x) => {
                  return x.value;
                });
                var lengthtele = [];
                var temp = document.getElementsByName(
                  "TelevisionDetails[Length]"
                );
                var lengthtelearray = [].concat.apply(lengthtele, temp);
                LengthTelevisionDetails = lengthtelearray.map((x) => {
                  return x.value;
                });
                var widthtele = [];
                var temp = document.getElementsByName(
                  "TelevisionDetails[Width]"
                );
                var widthtelearray = [].concat.apply(widthtele, temp);
                var WidthTelevisionDetails = widthtelearray.map((x) => {
                  return x.value;
                });

                var heighttele = [];
                var temp = document.getElementsByName(
                  "TelevisionDetails[Height]"
                );
                var heighttelearray = [].concat.apply(heighttele, temp);
                var HeightTelevisionDetails = heighttelearray.map((x) => {
                  return x.value;
                });
                var doc = [];
                var temp = document.getElementsByName("DocumnetDetails[]");
                var docarray = [].concat.apply(doc, temp);
                var DocumnetDetails = docarray.map((x) => {
                  return x.value;
                });
                setTimeout(() => {
                  let PackageDetails = [];
                  let CarDetails = [];
                  this.state.documentData.find((x) => {
                    if (x === "1") {
                      for (var i = 0; i < No_packBoxDetails.length; i++) {
                        var packageOBJ = {
                          PackageType: x,
                          ActualWeight: WeightBoxDetails[i],
                          DimensionL: LengthBoxDetails[i],
                          DimensionW: WidthBoxDetails[i],
                          DimensionH: HeightBoxDetails[i],
                          Status: "Active",
                          Quantity: No_packBoxDetails[i],
                        };
                        PackageDetails.push(packageOBJ);
                      }
                    }
                    if (x === "2") {
                      var envelopOBJ = {
                        PackageType: x,
                        ActualWeight: 0.5,
                        DimensionL: 10,
                        DimensionW: 13,
                        DimensionH: 1,
                        Status: "Active",
                        Quantity: 1,
                      };
                      PackageDetails.push(envelopOBJ);
                    }
                    if (x === "3") {
                      var packObj = {
                        PackageType: x,
                        ActualWeight: 0,
                        Status: "Active",
                        Quantity: 1,
                      };
                      PackageDetails.push(packObj);
                    }
                    if (x === "4") {
                      for (var i = 0; i < MakeTelevisionDetails.length; i++) {
                        var packageOBJ = {
                          PackageType: x,
                          ActualWeight: WeightTelevisionDetails[i],
                          DimensionL: LengthTelevisionDetails[i],
                          DimensionW: WidthTelevisionDetails[i],
                          DimensionH: HeightTelevisionDetails[i],
                          Status: "Active",
                          TVMake: MakeTelevisionDetails[i],
                          TVModel: ModelTelevisionDetails[i],
                          Quantity: 1,
                        };
                        PackageDetails.push(packageOBJ);
                      }
                    }
                    if (x === "5") {
                      for (var i = 0; i < MakeCarDetails.length; i++) {
                        var carOBJ = {
                          PackageType: x,
                          CarMake: MakeCarDetails[i],
                          CarModel: ModelCarDetails[i],
                          CarYear: YearCarDetails[i],
                          Status: "Active",
                        };
                        PackageDetails.push(carOBJ);
                      }
                    }
                  });
                  var salesLeadData = {
                    userid: 1,
                    SalesLeadManagementID: null,
                    ManagedBy: ManagedBY,
                    SalesLeadsType: null,
                    ContactName: this.state.ContactName,
                    CompanyName: "",
                    Email: this.state.email,
                    PhoneNumber: this.state.PhoneNumber,
                    FromState: this.state.FromState,
                    FromCity: this.state.FromCity,
                    ToCity: this.state.ToCity,
                    FromZipCode: this.state.FromZip,
                    ToZipCode: this.state.ToZip,
                    FromCountryID: this.state.FromSelectedCountry.value,
                    ToState: this.state.ToState,
                    ToCountryID: this.state.ToSelectedCountry.value,
                    SalesLeadDate: null,
                    SalesLeadFollowupDate: null,
                    TentativeMoveDate: null,
                    ReferredBy: "",
                    IPAddress: null,
                    MACAddress: null,
                    DeliveryType:
                      this.state.IsResidential == 1
                        ? "Residential"
                        : "Commercial",
                    ProposalStatus: "New",
                    PackageList: PackageDetails,
                    CarList: CarDetails,
                    NoteList: null,
                    WeightType: null,
                  };

                  api
                    .post("salesLead/addSalesLead", salesLeadData)
                    .then((saleres) => {
                      this.hideLoader();
                      this.props.history.push({
                        pathname: "/auth/get-quote-thanks",
                      });
                    });
                }, 3000);
              });
          }
        }
      }
    }
  };
  validate1 = () => {
    let IsValid = true;
    if (CommonConfig.isEmpty(this.state.FromZipCode)) {
      this.setState({ FromZipCodeErr: true });
      this.setState({ FromZipCodeErrText: "From Zip Code is required." });

      IsValid = false;
      window.scrollTo(0, 0);
    } else {
      this.setState({ FromZipCodeErr: false });
      this.setState({ FromZipCodeErrText: "" });
    }

    if (CommonConfig.isEmpty(this.state.packagecontent)) {
      this.setState({ FromZipCodeErr: true });
      this.setState({ FromZipCodeErrText: "From Zip Code is required." });

      IsValid = false;
      window.scrollTo(0, 0);
    } else {
      this.setState({ FromZipCodeErr: false });
      this.setState({ FromZipCodeErrText: "" });
    }
    return IsValid;
  };
  validate(event) {
    let IsFormValid = true;
    this.navigateChangeprevious(this.state.NextButtonIdx - 1);

    if (CommonConfig.isEmpty(this.state.ToZipCode)) {
      IsFormValid = false;
      this.setState({
        ToZipCodeErr: true,
        ToZipCodeHelperText: "To Zip Code is Requried.",
      });
    } else {
      this.setState({ ToZipCodeErr: false, ToZipCodeHelperText: "" });
    }
    return IsFormValid;
  }
  showLoader = () => {
    this.setState({ Loading: true });
  };

  hideLoader = () => {
    this.setState({ Loading: false });
  };

  async GetCountry() {
    try {
      await api
        .get("location/getCountryList")
        .then((res) => {
          if (res.success) {
            var Country = res.data;
            this.state.tempCountryList.push(res.data);
            this.setState({ CountryList: Country });
            document.getElementById("fromCountrySelect").value = "202";
            var selectedCountryList = _.filter(Country, { CountryID: 202 });

            if (selectedCountryList[0].IsZipAvailable === 0) {
              this.setState({ hidefromzipcode: false });
            } else {
              this.setState({ hidefromzipcode: true });
            }
            var SelectedCountry = {
              value: selectedCountryList[0].CountryID,
              label: selectedCountryList[0].CountryName,
            };
            this.setState({
              FromSelectedCountry: SelectedCountry,
            });
            //================== FOR TO COUNTRY =========================
            document.getElementById("toCountrySelect").value = "";
          }
        })
        .catch((err) => {
          console.log("err...", err);
        });
    } catch (error) {}
  }
  countryChange = (e, type) => {
    if (type === "from") {
      let CountryId = e.target.value;
      let forzip = _.findIndex(this.state.CountryList, function(country) {
        return country.CountryID == CountryId;
      });
      let zip = this.state.CountryList[forzip];
      if (zip.IsZipAvailable === 0) {
        this.setState({ hidefromzipcode: false });
        this.getCityList(zip.CountryID, "from");
      } else {
        this.setState({ hidefromzipcode: true });
      }
      var FromSelectedCountry = {
        value: zip.CountryID,
        label: zip.CountryName,
      };
      this.setState({ FromSelectedCountry: FromSelectedCountry });
    }
    if (type === "to") {
      let CountryId = e.target.value;
      let forzip = _.findIndex(this.state.CountryList, function(country) {
        return country.CountryID == CountryId;
      });
      let zip = this.state.CountryList[forzip];
      if (zip.IsZipAvailable === 0) {
        this.setState({ hidetozipcode: false });
        this.getCityList(zip.CountryID, "to");
      } else {
        this.setState({ hidetozipcode: true });
      }
      var ToSelectedCountry = {
        value: zip.CountryID,
        label: zip.CountryName,
      };
      this.setState({ ToSelectedCountry: ToSelectedCountry });
    }
  };

  getCityList = (value, type) => {
    var CityData = { CityType: "FedEx", CountryId: value };
    if (type === "from") {
      api
        .post("location/getCityList", CityData)
        .then((res) => {
          if (res.success) {
            this.setState({ FromCityList: res.data });
          } else {
            this.setState({ FromCityList: [] });
          }
        })
        .catch((error) => {});
    } else {
      api
        .post("location/getCityList", CityData)
        .then((res) => {
          if (res.success) {
            this.setState({ ToCityList: res.data });
          } else {
            this.setState({ ToCityList: [] });
          }
        })
        .catch((error) => {});
    }
  };

  packageDetailsChange = (e, value, type) => {
    this.setState({
      PackageDetailsErr: false,
      PackageDetailsErrText: "",
    });
    if (type === "envelope") {
      this.setState({ packagetype: "Envelope" });
    } else {
      this.setState({ packagetype: "Package" });
    }
    var elements = document.getElementById(type);
    if (elements.classList.contains("selected")) {
      elements.classList.remove("selected");
      var index = this.state.documentData.indexOf(value);
      if (index != -1) {
        this.state.documentData.splice(index, 1);
      }
      if (type == "box") {
        this.setState({ showBoxDetails: false });
      } else if (type == "television") {
        this.setState({ showTVDetails: false });
      } else if (type == "auto") {
        this.setState({ showCarDetails: false });
      }
    } else {
      elements.classList.add("selected");
      this.state.documentData.push(value);

      if (type == "box") {
        this.setState({ showBoxDetails: true });
      } else if (type == "television") {
        this.setState({ showTVDetails: true });
      } else if (type == "auto") {
        this.setState({ showCarDetails: true });
      }
    }
    // ============= CHECK WHETHER 2ND STEP TO BE SHOWED OR NOT ===============
    if (this.state.documentData.length != 0) {
      if (
        this.state.documentData.length == 1 &&
        this.state.documentData.includes("2")
      ) {
        if (this.state.Steps[1].stepId == "containerdetails") {
          this.state.Steps.splice(1, 1);
        }
      } else {
        if (this.state.documentData.includes("3")) {
          // FOR FURNITURE
          if (this.state.Steps[1].stepId == "containerdetails") {
            this.state.Steps.splice(1, 1);
          }
        } else {
          if (this.state.Steps[1].stepId != "containerdetails") {
            this.state.Steps.splice(1, 0, {
              stepName: "CONTAINER DETAILS",
              stepId: "containerdetails",
              classname: "inactive",
            });
          }
        }
      }
    }
  };

  renderCountryOptions() {
    return this.state.CountryList.map((value) => {
      return <option value={value.CountryID}>{value.CountryName}</option>;
    });
  }
  shipperInfoChange = (event, type) => {
    if (type === "ContactName") {
      this.setState({ ContactName: event.target.value });
    } else if (type === "Number") {
      this.setState({ PhoneNumber: event.target.value });
    } else if (type === "Email") {
      this.setState({ email: event.target.value });
    }
  };
  ChangeFromZipUS = (e) => {
    var zip = e.target.value;
    this.setState({ FromZip: zip });
    if (zip.length) {
      if (zip.length) {
        var SelectedCity = { value: null, label: null };

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
                this.setState({ FromState: fromStatename });
                var SelectedCity = {
                  value: FinalCity[0].City_code,
                  label: FinalCity[0].Name,
                };

                this.setState({
                  FromState: fromStatename,
                  FromSelectedCity: SelectedCity,
                  FromCity: SelectedCity.label,
                  fromStateName: state,
                });
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
                  FromState: fromStatename,
                  fromStateName: state,
                });
                this.setState({
                  FromSelectedCity: SelectedCity,
                  GetRate: GetRate,
                });
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
              this.state.flag = 0;
              this.setState({
                FromZipCodeErr: false,
                FromZipCodeErrText: "",
                FromZipNotFoundErrText: "",
              });
            } else {
              if (this.state.FromZip.length >= 4) {
                this.setState({
                  FromZipNotFoundErr: true,
                  FromZipNotFoundErrText: "Zip code not found",
                });
              }

              this.state.flag = 1;
              this.validate1();
              this.setState({ FromCityList: [] });
            }
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
    this.setState({ ToZip: zip });
    if (zip.length) {
      var SelectedCity = { value: null, label: null };
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
              this.setState({
                toStateName: state,
                ToState: toStatename,
              });
              this.setState({
                toStateName: state,
                ToState: toStatename,
                ToSelectedCity: SelectedCity,
                ToCity: SelectedCity.label,
              });
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
                }).length > 0
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
                toStateName: state,
                ToState: toStatename,
              });
              var SelectedCity = {
                value: FinalCity[0].Citycode,
                label: FinalCity[0].CityName,
              };
              this.setState({ ToSelectedCity: SelectedCity });
            } else {
              this.setState({ ToCityList: [] });
            }
            this.setState({
              ToZipCodeErr: true,
              ToZipCodeHelperText: "",
              ToZipCodeEnterText: "",
              ToZipErrText: "",
              ToZipErr: false,
            });
            this.state.flag2 = 0;
          } else {
            this.state.flag2 = 1;
            if (this.state.ToZip.lenght > 4) {
              cogoToast.error("Zip code not found 2");
            }
            this.setState({ ToCityList: [] });
          }
        });
    } else {
    }
    this.setState({ disableBtn: 1 });
  };
  renderCityOptions = (type) => {
    if (type === "from") {
      return this.state.FromCityList.map((x) => {
        return <option value={x.CityCode}>{x.CityName}</option>;
      });
    } else {
      return this.state.ToCityList.map((x) => {
        return <option value={x.CityCode}>{x.CityName}</option>;
      });
    }
  };

  CityChange = (event, type) => {
    if (type === "from") {
      let fromcity = {
        value: event.target.value,
        label: event.target.value,
      };

      this.setState({ FromSelectedCity: fromcity, FromCity: fromcity.value });
    } else {
      let tocity = {
        value: event.target.value,
        label: event.target.value,
      };
      this.setState({ ToSelectedCity: tocity, ToCity: tocity.value });
    }
  };

  getNumberofBox = () => {
    var noOfBox = [];
    for (var i = 1; i <= 25; i++) {
      noOfBox.push(i);
    }
    return noOfBox.map((x) => {
      return <option>{x}</option>;
    });
  };

  renderBoxDetails = () => {
    return this.state.boxDetails.map((x) => {
      return x;
    });
  };

  addRowPackage = (rowID, Index, type) => {
    let previousIndex = Number(Index);
    let currentIndex = previousIndex + 1;
    let rowId = "rowsbox" + currentIndex;
    let lengthIndex = "length" + currentIndex;
    let widthIndex = "width" + currentIndex;
    let weightIndex = "weight_pack" + currentIndex;
    let heightIndex = "height" + currentIndex;
    let no_packIndex = "no_pack" + currentIndex;
    let newBoxID = "add_new_box" + currentIndex;
    let divID = "action-box" + currentIndex;

    this.state.tempboxDetails.push(
      <div className="quote-collect-row" id={rowId}>
        <GridContainer>
          <GridItem xs={12} sm={2} md={2}>
            <div className="gt-input">
              <label>
                No. of <span>Boxes</span>
              </label>
              <select name="BoxDetails[No_Pack]" id={no_packIndex}>
                {this.getNumberofBox()}
              </select>
            </div>
          </GridItem>

          <GridItem xs={12} sm={2} md={2}>
            <div className="gt-input">
              <label>Weight</label>
              <div className="with-addon">
                <input
                  type="text"
                  maxLength={2}
                  name="BoxDetails[Weight]"
                  id={weightIndex}
                  placeholder="Weight"
                  onFocus={() =>
                    this.setState({
                      BoxesErrText: "",
                    })
                  }
                ></input>
                <span>lbs</span>
              </div>
            </div>
          </GridItem>
          <GridItem xs={12} sm={5} md={5}>
            <div className="gt-input">
              <label>Dimensions</label>
              <GridContainer>
                <GridItem xs={4} sm={4} md={4}>
                  <div className="with-addon">
                    <input
                      type="text"
                      maxLength={2}
                      name="BoxDetails[Length]"
                      id={lengthIndex}
                      placeholder="Length"
                      onFocus={() =>
                        this.setState({
                          BoxesErrText: "",
                        })
                      }
                    ></input>
                    <span>in</span>
                  </div>
                </GridItem>
                <GridItem xs={4} sm={4} md={4}>
                  <div className="with-addon">
                    <input
                      type="text"
                      maxLength={2}
                      name="BoxDetails[Width]"
                      id={widthIndex}
                      placeholder="Width"
                      onFocus={() =>
                        this.setState({
                          BoxesErrText: "",
                        })
                      }
                    ></input>
                    <span>in</span>
                  </div>
                </GridItem>
                <GridItem xs={4} sm={4} md={4}>
                  <div className="with-addon">
                    <input
                      type="text"
                      maxLength={2}
                      name="BoxDetails[Height]"
                      id={heightIndex}
                      placeholder="Height"
                      onFocus={() =>
                        this.setState({
                          BoxesErrText: "",
                        })
                      }
                    ></input>
                    <span>in</span>
                  </div>
                </GridItem>
              </GridContainer>
            </div>
          </GridItem>
          <GridItem xs={12} sm={3} md={3}>
            <div className="add-btn">
              <GridContainer>
                <GridItem xs={12} sm={6} md={6}>
                  <a
                    id={newBoxID}
                    onClick={() =>
                      this.addRowPackage(rowId, currentIndex, "Box")
                    }
                  >
                    <img src={plusIcon}></img>Add more
                  </a>
                </GridItem>
                <GridItem xs={12} sm={6} md={6}>
                  <a
                    onClick={() =>
                      this.removeboxpackage(rowId, currentIndex, "Box")
                    }
                    className="remove"
                  >
                    <img src={removeIcon}></img>Remove
                  </a>
                </GridItem>
              </GridContainer>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    );
    this.setState({ boxDetails: this.state.tempboxDetails });
    let prev2BoxID = "add_new_box" + previousIndex;
    document.getElementById(prev2BoxID).style.display = "none";
  };

  removeboxpackage = (rowID, Index, type) => {
    this.setState({ BoxesErrText: "" });
    var packidx = this.state.tempboxDetails.findIndex(
      (x) => x.props.id === rowID
    );
    this.state.tempboxDetails.splice(packidx, 1);
    this.setState({ boxDetails: this.state.tempboxDetails });
    var preIdx = Index - 1;
    var backidx = "add_new_box" + preIdx;
    document.getElementById(backidx).style.display = "block";
  };

  renderTvDetails = () => {
    return this.state.tvDetails.map((x) => {
      return x;
    });
  };

  addRowTV = (rowID, Index, type) => {
    let previousIndex = Number(Index);
    let currentIndex = previousIndex + 1;
    let rowId = "rowsteli" + currentIndex;
    let lengthIndex = "lengthteli" + currentIndex;
    let widthIndex = "widthteli" + currentIndex;
    let makeIndex = "no_packteli" + currentIndex;
    let modelIndex = "model_teli" + currentIndex;
    let heightIndex = "heightteli" + currentIndex;
    let newBoxID = "add_new_tv" + currentIndex;

    this.state.tempTvDetails.push(
      <div className="quote-collect-row" id={rowId}>
        <GridContainer>
          <GridItem xs={12} sm={2} md={2}>
            <div className="gt-input">
              <label>
                <span>TV</span> Make
              </label>
              <input
                type="text"
                name="TelevisionDetails[Make]"
                id={makeIndex}
                placeholder="TV Make"
                onFocus={() =>
                  this.setState({
                    TelevisionErrText: "",
                  })
                }
              ></input>
            </div>
          </GridItem>
          <GridItem xs={12} sm={1} md={1}>
            <div className="gt-input">
              <label>Model</label>
              <input
                type="text"
                name="TelevisionDetails[Model]"
                id={modelIndex}
                placeholder="TV Model"
                onFocus={() =>
                  this.setState({
                    TelevisionErrText: "",
                  })
                }
              ></input>
            </div>
          </GridItem>

          <GridItem xs={12} sm={2} md={2}>
            <div className="gt-input">
              <label>Weight</label>
              <div className="with-addon">
                <input
                  type="text"
                  maxLength={2}
                  name="TelevisionDetails[Weight]"
                  id="wight_packteli"
                  placeholder="Weight"
                  onFocus={() =>
                    this.setState({
                      TelevisionErrText: "",
                    })
                  }
                ></input>
                <span>lbs</span>
              </div>
            </div>
          </GridItem>
          <GridItem xs={12} sm={4} md={4}>
            <div className="gt-input">
              <label>Dimensions</label>
              <GridContainer>
                <GridItem xs={4} sm={4} md={4}>
                  <div className="with-addon">
                    <input
                      type="text"
                      maxLength={2}
                      name="TelevisionDetails[Length]"
                      id={lengthIndex}
                      placeholder="Length"
                      onFocus={() =>
                        this.setState({
                          TelevisionErrText: "",
                        })
                      }
                    ></input>
                    <span>in</span>
                  </div>
                </GridItem>
                <GridItem xs={4} sm={4} md={4}>
                  <div className="with-addon">
                    <input
                      type="text"
                      maxLength={2}
                      name="TelevisionDetails[Width]"
                      id={widthIndex}
                      placeholder="Width"
                      onFocus={() =>
                        this.setState({
                          TelevisionErrText: "",
                        })
                      }
                    ></input>
                    <span>in</span>
                  </div>
                </GridItem>
                <GridItem xs={4} sm={4} md={4}>
                  <div className="with-addon">
                    <input
                      type="text"
                      maxLength={2}
                      name="TelevisionDetails[Height]"
                      id={heightIndex}
                      placeholder="Height"
                      onFocus={() =>
                        this.setState({
                          TelevisionErrText: "",
                        })
                      }
                    ></input>
                    <span>in</span>
                  </div>
                </GridItem>
              </GridContainer>
            </div>
          </GridItem>
          <GridItem xs={12} sm={3} md={3}>
            <div className="add-btn">
              <GridContainer>
                <GridItem xs={12} sm={6} md={6}>
                  <a
                    onClick={() => this.addRowTV(rowId, currentIndex, "Tele")}
                    id={newBoxID}
                  >
                    <img src={plusIcon}></img>Add more
                  </a>
                </GridItem>
                <GridItem xs={12} sm={6} md={6}>
                  <a
                    onClick={() => this.removetv(rowId, currentIndex, "Box")}
                    className="remove"
                  >
                    <img src={removeIcon}></img>Remove
                  </a>
                </GridItem>
              </GridContainer>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    );

    this.setState({ tvDetails: this.state.tempTvDetails });
    let prev2BoxID = "add_new_tv" + previousIndex;
    document.getElementById(prev2BoxID).style.display = "none";
  };

  removetv = (rowID, Index, type) => {
    this.setState({ TelevisionErrText: "" });
    var tvidx = this.state.tempTvDetails.findIndex((x) => x.props.id === rowID);
    this.state.tempTvDetails.splice(tvidx, 1);
    this.setState({ tvDetails: this.state.tempTvDetails });
    var preIdx = Index - 1;
    var backidx = "add_new_tv" + preIdx;
    document.getElementById(backidx).style.display = "block";
  };

  renderCarDetails = () => {
    return this.state.carDetails.map((x) => {
      return x;
    });
  };

  addCarData = (rowID, Index, type) => {
    let previousIndex = Number(Index);
    let currentIndex = previousIndex + 1;
    let rowId = "rowscar" + currentIndex;
    let newBoxID = "add_new_car" + currentIndex;

    this.state.tempCarDetails.push(
      <div className="quote-collect-row" id={rowId}>
        <GridContainer>
          <GridItem xs={12} sm={2} md={2}>
            <div className="gt-input">
              <label>
                <span>Auto</span> Make
              </label>
              <input
                type="text"
                name="CarDetails[Make]"
                id="car_make"
                placeholder="Car Make"
                onFocus={() =>
                  this.setState({
                    CarErrText: "",
                  })
                }
              ></input>
            </div>
          </GridItem>
          <GridItem xs={12} sm={2} md={2}>
            <div className="gt-input">
              <label>Car Model</label>
              <input
                type="text"
                name="CarDetails[Model]"
                id="car_model"
                placeholder="Car Model"
                onFocus={() =>
                  this.setState({
                    CarErrText: "",
                  })
                }
              ></input>
            </div>
          </GridItem>
          <GridItem xs={12} sm={2} md={2}>
            <div className="gt-input">
              <label>Car Year</label>
              <input
                type="text"
                name="CarDetails[Year]"
                id="car_year"
                placeholder="Car Year"
                onFocus={() =>
                  this.setState({
                    CarErrText: "",
                  })
                }
              ></input>
            </div>
          </GridItem>
          <GridItem xs={12} sm={3} md={3}>
            <div className="add-btn">
              <GridContainer>
                <GridItem xs={12} sm={6} md={6}>
                  <a
                    id={newBoxID}
                    onClick={() => this.addCarData(rowId, currentIndex, "Car")}
                  >
                    <img src={plusIcon}></img>Add more
                  </a>
                </GridItem>
                <GridItem xs={12} sm={6} md={6}>
                  <a
                    onClick={() => this.removecar(rowId, currentIndex, "Car")}
                    className="remove"
                  >
                    <img src={removeIcon}></img>Remove
                  </a>
                </GridItem>
              </GridContainer>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    );
    this.setState({ carDetails: this.state.tempCarDetails });
    let prev2BoxID = "add_new_car" + previousIndex;
    document.getElementById(prev2BoxID).style.display = "none";
  };

  removecar = (rowID, Index, type) => {
    this.setState({ CarErrText: "" });
    var caridx = this.state.tempCarDetails.findIndex(
      (x) => x.props.id === rowID
    );
    this.state.tempCarDetails.splice(caridx, 1);
    this.setState({ carDetails: this.state.tempCarDetails });

    var preIdx = Index - 1;
    var backidx = "add_new_car" + preIdx;
    document.getElementById(backidx).style.display = "block";
  };

  validateShipperInfo = (evt, type) => {
    if (type == "cname") {
      if (this.state.ContactName != "") {
        if (this.state.ContactName.trim().length < 3) {
          stepValidate = false;
          allValid = false;
          this.setState({
            cnameErrText: "Please enter atleast 3 character",
          });
        } else {
          if (this.state.PhoneNumber != "" && this.state.email != "") {
            stepValidate = true;
            allValid = true;
          } else {
            stepValidate = false;
            allValid = false;
          }
        }
      } else {
        stepValidate = false;
        allValid = false;
        this.setState({
          cnameErrText: "",
        });
      }
    } else if (type === "phone") {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        this.setState({
          onlyNumberErrText: "Enter only digits",
        });

        stepValidate = false;
        allValid = false;
        return false;
      } else if (this.state.email != "") {
        stepValidate = true;
        allValid = true;
        return true;
      } else {
        stepValidate = false;
        allValid = false;
      }
    } else if (type === "phoneblur") {
      var phonenoRegex = /^\d{10}$/;
      if (this.state.PhoneNumber != "") {
        if (
          this.state.PhoneNumber.length < 10 ||
          !phonenoRegex.test(this.state.PhoneNumber)
        ) {
          this.setState({
            contactErrText: "Please enter valid phone number",
          });
          stepValidate = false;
          allValid = false;
        } else if (this.state.email != "") {
          stepValidate = true;
          allValid = true;
        } else {
          stepValidate = false;
          allValid = false;
        }
      } else {
        stepValidate = false;
        allValid = false;
        this.setState({
          contactErrText: "Please enter valid phone number",
        });
      }
    } else if (type === "email") {
      let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (this.state.email != "") {
        if (!emailRegex.test(this.state.email)) {
          this.setState({
            EmailErrText: "Please enter valid email",
          });
          stepValidate = false;
          allValid = false;
        } else {
          stepValidate = true;
          allValid = true;
        }
      } else {
        stepValidate = false;
        allValid = false;
      }
    }
  };
  isResidenceChange = (event) => {
    if (event.target.checked) {
      this.setState({ IsResidential: 1 });
    } else {
      this.setState({ IsResidential: 0 });
    }
  };
  render() {
    return (
      <div>
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
        <div className="get-quote-wrap">
          <div className="quote-header">
            <div className="container">
              <div className="header-inner">
                <div className="logo">
                  <a href="https://www.sflworldwide.com/">
                    <img src={logoImage} alt="SFL Worldwide" />
                  </a>
                </div>
                <div className="header-right">
                  {this.state.userName ? (
                    <div>Welcome {this.state.userName}</div>
                  ) : (
                    <a href="https://www.sflworldwide.com/">
                      <img src={backIcon} alt="Back" />
                      Back to Home
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="quote-content">
            <div
              id="packagedetails"
              className="quote-content-box package-step-1"
            >
              <div className="container">
                <div className="quote-title">
                  <h2>WHAT WOULD YOU LIKE TO SHIP OR MOVE?</h2>
                  <p>
                    Your special quote is just a few clicks away. We offer some
                    of the lowest, competitive prices in the industry and
                    anywhere online!
                  </p>
                </div>
                <div className="quote-inner-content">
                  <h3>Package Details</h3>
                  <div className="select-item">
                    <div id="package_content" className="select-item-group">
                      <a
                        value="2"
                        id="envelope"
                        onClick={(e) =>
                          this.packageDetailsChange(e, "2", "envelope")
                        }
                        href="javascript:;"
                      >
                        <span>
                          <img src={envelopeIcon} alt="Envelope" />
                        </span>
                        <p>Envelope</p>
                      </a>
                      <a
                        id="box"
                        value="1"
                        onClick={(e) =>
                          this.packageDetailsChange(e, "1", "box")
                        }
                        href="javascript:;"
                      >
                        <span>
                          <img src={boxIcon} alt="Box" />
                        </span>
                        <p>Box</p>
                      </a>
                      <a
                        id="television"
                        value="4"
                        onClick={(e) =>
                          this.packageDetailsChange(e, "4", "television")
                        }
                        href="javascript:;"
                        className=""
                      >
                        <span>
                          <img src={tvIcon} alt="Tv" />
                        </span>
                        <p>Television</p>
                      </a>
                      <a
                        id="furniture"
                        value="3"
                        onClick={(e) =>
                          this.packageDetailsChange(e, "3", "furniture")
                        }
                        href="javascript:;"
                        className=""
                      >
                        <span>
                          <img src={furnitureIcon} alt="Furniture" />
                        </span>
                        <p>Furniture</p>
                      </a>
                      <a
                        id="auto"
                        value="5"
                        onClick={(e) =>
                          this.packageDetailsChange(e, "5", "auto")
                        }
                        href="javascript:;"
                        className=""
                      >
                        <span>
                          <img src={autoIcon} alt="Auto" />
                        </span>
                        <p>Auto</p>
                      </a>
                    </div>
                    <FormHelperText style={{ color: "red" }}>
                      {this.state.PackageDetailsErrText}
                    </FormHelperText>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="quote-content-box package-step-2"
              id="containerdetails"
              style={{ display: "none" }}
            >
              <div className="container">
                <div className="quote-inner-content">
                  <h3>Package Details</h3>
                  <div className="quote-data">
                    {this.state.showBoxDetails ? (
                      <div id="mainBoxDiv">
                        <h4 className="sec-title">Boxes</h4>
                        {this.renderBoxDetails()}
                        <FormHelperText style={{ color: "red" }}>
                          {this.state.BoxesErrText}
                        </FormHelperText>
                      </div>
                    ) : null}

                    {this.state.showTVDetails ? (
                      <div>
                        <h4 className="sec-title">Television</h4>
                        {this.renderTvDetails()}
                        <FormHelperText style={{ color: "red" }}>
                          {this.state.TelevisionErrText}
                        </FormHelperText>
                      </div>
                    ) : null}
                    {this.state.showCarDetails ? (
                      <div>
                        <h4 className="sec-title">Auto</h4>
                        {this.renderCarDetails()}
                        <FormHelperText style={{ color: "red" }}>
                          {this.state.CarErrText}
                        </FormHelperText>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="quote-content-box package-step-3"
              id="shipmentdetails"
              style={{ display: "none" }}
            >
              <div className="container">
                <div className="quote-inner-content">
                  <h3>Shipment Details</h3>
                  <div className="quote-data">
                    <div className="quote-collect-row">
                      <GridContainer>
                        <GridItem xs={12} sm={4} md={4}>
                          <div className="gt-input">
                            <label>Sending from</label>
                            <select
                              id="fromCountrySelect"
                              onChange={(e) => this.countryChange(e, "from")}
                            >
                              {this.renderCountryOptions()}
                            </select>
                          </div>
                          {!this.state.hidefromzipcode ? (
                            <div className="gt-input mt-20">
                              <select
                                id="fromCitySelect"
                                onChange={(e) => this.CityChange(e, "from")}
                              >
                                <option value="">Select City</option>
                                {this.renderCityOptions("from")}
                              </select>
                            </div>
                          ) : (
                            <div className="gt-input mt-20">
                              <input
                                id="fromzipSelect"
                                type="text"
                                onKeyUp={(e) => this.ChangeFromZipUS(e)}
                                placeholder=" from Zip Code"
                                onFocus={() =>
                                  this.setState({
                                    FromZipErr: false,
                                    FromZipErrText: "",
                                    FromZipNotFoundErrText: "",
                                  })
                                }
                              ></input>
                              <FormHelperText style={{ color: "red" }}>
                                {this.state.FromZipErrText}
                              </FormHelperText>
                              <FormHelperText style={{ color: "red" }}>
                                {this.state.FromZipNotFoundErrText}
                              </FormHelperText>
                            </div>
                          )}
                        </GridItem>
                        <GridItem xs={12} sm={4} md={4}>
                          <div className="gt-input">
                            <label>Sending to</label>
                            <select
                              id="toCountrySelect"
                              onChange={(e) => this.countryChange(e, "to")}
                              onFocus={() =>
                                this.setState({
                                  ToCountryErr: false,
                                  ToCountryErrText: "",
                                })
                              }
                            >
                              <option value="">Select Country</option>
                              {this.renderCountryOptions()}
                            </select>
                          </div>
                          <FormHelperText style={{ color: "red" }}>
                            {this.state.ToCountryErrText}
                          </FormHelperText>
                          {!this.state.hidetozipcode ? (
                            <div className="gt-input mt-20">
                              <select
                                id="toCitySelect"
                                hidden={
                                  Object.keys(this.state.ToSelectedCountry)
                                    .length === 0
                                    ? "hidden"
                                    : ""
                                }
                                onChange={(e) => this.CityChange(e, "to")}
                              >
                                <option value="">Select City</option>
                                {this.renderCityOptions("to")}
                              </select>
                            </div>
                          ) : (
                            <div className="gt-input mt-20">
                              <input
                                id="TozipSelect"
                                type="text"
                                hidden={
                                  Object.keys(this.state.ToSelectedCountry)
                                    .length === 0
                                    ? "hidden"
                                    : ""
                                }
                                onKeyUp={(e) => this.ChangeToZipUS(e)}
                                placeholder="To Zip Code"
                                onFocus={() =>
                                  this.setState({
                                    ToZipCodeErr: false,
                                    ToZipCodeHelperText: "",
                                    ToZipCodeEnterText: "",
                                  })
                                }
                              ></input>
                              <FormHelperText>
                                {this.state.ToZipCodeHelperText}
                              </FormHelperText>
                              <FormHelperText style={{ color: "red" }}>
                                {this.state.ToZipErrText}
                              </FormHelperText>
                              <FormHelperText style={{ color: "red" }}>
                                {this.state.ToZipCodeEnterText}
                              </FormHelperText>
                            </div>
                          )}
                        </GridItem>
                      </GridContainer>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                          <input
                            type="checkbox"
                            onChange={(e) => this.isResidenceChange(e)}
                          />{" "}
                          I'm shipping to a residence
                        </GridItem>
                      </GridContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="quote-content-box package-step-4"
              id="shipperdetails"
              style={{ display: "none" }}
            >
              <div className="container">
                <div className="quote-inner-content">
                  <h3>Shipper Details</h3>
                  <div className="quote-data">
                    <div className="quote-collect-row">
                      <GridContainer>
                        <GridItem xs={12} sm={3} md={3}>
                          <div className="gt-input">
                            <label>Name</label>
                            <input
                              id="ContactName"
                              type="text"
                              onBlur={(e) =>
                                this.validateShipperInfo(e, "cname")
                              }
                              onChange={(e) =>
                                this.shipperInfoChange(e, "ContactName")
                              }
                              onFocus={() =>
                                this.setState({
                                  cnameErrText: "",
                                })
                              }
                              placeholder="Enter name"
                            ></input>
                            <FormHelperText style={{ color: "red" }}>
                              {this.state.cnameErrText}
                            </FormHelperText>
                          </div>
                        </GridItem>
                        <GridItem xs={12} sm={3} md={3}>
                          <div className="gt-input">
                            <label>Phone Number</label>
                            <input
                              id="Number"
                              type="tel"
                              maxlength="10"
                              onKeyPress={(e) =>
                                this.validateShipperInfo(e, "phone")
                              }
                              onBlur={(e) =>
                                this.validateShipperInfo(e, "phoneblur")
                              }
                              onChange={(e) =>
                                this.shipperInfoChange(e, "Number")
                              }
                              onFocus={() =>
                                this.setState({
                                  contactErrText: "",
                                  onlyNumberErrText: "",
                                  ContactNumberErrText: "",
                                })
                              }
                              placeholder="Enter phone number"
                            ></input>
                            <FormHelperText style={{ color: "red" }}>
                              {this.state.contactErrText}
                            </FormHelperText>
                            <FormHelperText style={{ color: "red" }}>
                              {this.state.onlyNumberErrText}
                            </FormHelperText>
                            <FormHelperText style={{ color: "red" }}>
                              {this.state.ContactNumberErrText}
                            </FormHelperText>
                          </div>
                        </GridItem>

                        <GridItem xs={12} sm={3} md={3}>
                          <div className="gt-input">
                            <label>Email</label>
                            <input
                              type="text"
                              id="email"
                              onBlur={(e) =>
                                this.validateShipperInfo(e, "email")
                              }
                              onChange={(e) =>
                                this.shipperInfoChange(e, "Email")
                              }
                              onFocus={() =>
                                this.setState({
                                  EmailErrText: "",
                                  shipperdetailsErrText: "",
                                })
                              }
                              placeholder="Enter email"
                            ></input>
                            <FormHelperText style={{ color: "red" }}>
                              {this.state.EmailErrText}
                            </FormHelperText>
                          </div>
                        </GridItem>
                      </GridContainer>
                    </div>
                    <FormHelperText style={{ color: "red" }}>
                      {this.state.ShiperInfoErrText}
                    </FormHelperText>
                    <FormHelperText style={{ color: "red" }}>
                      {this.state.shipperdetailsErrText}
                    </FormHelperText>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="quote-content-box package-step-5"
              id="shipsmart"
              style={{ display: "none" }}
            >
              <div className="container">
                <div className="quote-title quote-results-title">
                  <h2>Your search results</h2>
                  <p>
                    {this.state.FromSelectedCountry.label} to{" "}
                    {this.state.ToSelectedCountry.label}
                  </p>
                </div>
                <div className="quote-inner-content">
                  {this.state.finalImage}
                </div>
              </div>
            </div>
          </div>
          <div className="quote-footer">
            <div className="container">
              {(this.state.NextButtonIdx != 3 &&
                this.state.Steps[this.state.NextButtonIdx].stepId !=
                  "shipsmart") ||
              (this.state.NextButtonIdx != 4 &&
                this.state.Steps[this.state.NextButtonIdx].stepId !=
                  "shipsmart") ? (
                <div className="quote-footer-inner">
                  <a
                    className="prev-btn"
                    onClick={() =>
                      this.navigateChangeprevious(this.state.NextButtonIdx - 1)
                    }
                  >
                    <img src={backIcon} alt="Prev" /> PREVIOUS
                  </a>
                  <a
                    className="next-btn"
                    onClick={() =>
                      this.navigateChange(this.state.NextButtonIdx + 1)
                    }
                  >
                    NEXT <img src={arrowRightWhite} alt="Next" />
                  </a>
                </div>
              ) : (
                <div className="quote-footer-inner quote-completed">
                  <a
                    className="next-btn"
                    href="https://hubyat.sflworldwide.com/auth/get-quote"
                  >
                    Get a New Quote
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GetQuoteLive;
