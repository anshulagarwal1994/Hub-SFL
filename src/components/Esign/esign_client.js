import React from "react";
import PropTypes from "prop-types";
// core components
import withStyles from "@material-ui/core/styles/withStyles";
import moment from "moment";
import Button from "components/CustomButtons/Button.js";
import { CommonConfig } from "../../utils/constant";
import cogoToast from "cogo-toast";
import api from "../../utils/apiClient";
import SignatureCanvas from "react-signature-canvas";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import SimpleBackdrop from "../../utils/general";

import publicIp from "public-ip";
const useStyles = () => makeStyles(styles);
const classes = useStyles();

class esign_client extends React.Component {
  constructor(props) {
    super(props);
    this.sigPad = {};
    this.state = {
      trimmedDataURL: null,
      InclusionsListShow: [],
      ExclusionsListShow: [],
      ManagedBy: "",
      TrackingNumber: "",
      Loading: false,

      FromCompanyName: "",
      FromContactName: "",
      FromAddressLine1: "",
      FromAddressLine2: "",
      FromAddressLine3: "",
      FromZipCode: "",
      FromPhone1: "",
      FromPhone2: "",
      FromEmail: "",

      ToCompanyName: "",
      ToContactName: "",
      ToAddressLine1: "",
      ToAddressLine2: "",
      ToAddressLine3: "",
      ToZipCode: "",
      ToPhone1: "",
      ToPhone2: "",
      ToEmail: "",
      selectedFromCountry: {},
      selectedToCountry: {},

      fromCityAutoComplete: false,
      fromStateAutoComplete: false,
      fromGoogleAPICityList: [],
      fromStateList: [],

      toCityAutoComplete: false,
      toStateAutoComplete: false,
      toGoogleAPICityList: [],
      toStateList: [],

      fromState: "",
      fromStateShow: "",
      fromCity: "",
      toState: "",
      toStateShow: "",
      toCity: "",

      invoiceList: [],
      TotalCostCommercial: 0,

      sendmailopen: false,
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
      ShowContra: false,
      ShipmentType: "",
      SubServiceName: "",
      DocumentManagedBy: "",
      TotalInvoiceCost: 0.0,
      totalCFT: 0.0,
      initialHere: [
        {
          "1": "",
        },
        {
          "2": "",
        },
        {
          "3": "",
        },
        {
          "4": "",
        },
        {
          "5": "",
        },
      ],
      isVisible: false,
      hideIntital: false,
    };
  }

  async componentDidMount() {
    this.setState({
      hideIntital: this.props.location.pathname.includes("/false"),
    });
    await this.checkContraId();
    await this.getCountry();
  }

  async checkContraId() {
    this.showLoader();
    try {
      var location_data = {};
      navigator.geolocation.getCurrentPosition(function(position) {
        location_data = position;
      });
      var data = {
        ShippingID: this.props.match.params.id,
        ContractID: this.props.match.params.uuid,
        publicIpv4: await publicIp.v4(),
        lat: location_data.latitude,
        lng: location_data.longitude,
      };
      api
        .post("scheduleshipment/CheckContractID", data)
        .then(async (res) => {
          if (res.success) {
            await this.getInExData("Inclusions");
            await this.getInExData("Exclusions");
            await this.getShipmentInfo();
            await this.getAddressDetails();
            await this.getInvoiceDetails();
            await this.checkInsurance();
            await this.getPackageDetail();
            if (res.data) {
              const dateLimit = moment(
                res.data.EndDate,
                "YYYY-MM-DDTHH:mm:ss.SSSZ"
              );
              const now = moment();
              if (dateLimit.isValid() && now.isBefore(dateLimit)) {
                this.setState({ ShowContra: true });
                // cogoToast.success("Valid");
              } else {
                this.setState({ ShowContra: false });
                cogoToast.error("Expired");
              }
            } else {
              this.setState({ Showdata: false, ShowContra: false });
              cogoToast.error("Not data Avalable");
            }
          } else {
            cogoToast.error("Somthing went wrong");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }
  async getInExData(type) {
    try {
      var data = {
        ShippingID: this.props.match.params.id,
        ContractID: this.props.match.params.uuid,
        type: type,
      };
      api
        .post("scheduleshipment/getInExData", data)
        .then(async (res) => {
          if (res.success) {
            if (res.data) {
              this.setdata(type, res.data);
            }
          } else {
            cogoToast.error("Somthing went wrong");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }
  setdata(lable, value) {
    var arrayTemp = [];
    if (lable == "Inclusions") {
      if (value.length > 1) {
        this.setState({ InclusionsListShow: [] });
        value.forEach((element) => {
          var tempdata = {
            value: element.Inclusions,
            label: element.Inclusions,
          };
          arrayTemp.push(tempdata);
        });
        this.setState({ InclusionsListShow: arrayTemp });
      }
    }
    if (lable == "Exclusions") {
      if (value.length > 1) {
        this.setState({ ExclusionsListShow: [] });
        value.forEach((element) => {
          var tempdata = {
            value: element.Exclusions,
            label: element.Exclusions,
          };
          arrayTemp.push(tempdata);
        });
        this.setState({ ExclusionsListShow: arrayTemp });
      }
    }
  }
  async getinfo() {
    try {
      console.log("publicIp.v4()", await publicIp.v4());
      navigator.geolocation.getCurrentPosition(function(position) {
        // console.log("Latitude is :", position.coords.latitude);
        // console.log("Longitude is :", position.coords.longitude);
      });
    } catch (error) {
      console.log(error);
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

  getPackageDetail() {
    try {
      let data = {
        ShippingID: this.props.match.params.id,
      };
      api
        .post("scheduleshipment/getShipmentPackageByID", data)
        .then((res) => {
          this.hideLoader();
          if (res.success) {
            var l = 1;
            res.data.map((Obj) => {
              Obj.Index = l;
              Obj.InsuredValue = parseFloat(Obj.InsuredValue).toFixed(2);
              l++;
              return Obj;
            });
            this.setState({
              PackageList: res.data,
              PackageType: res.data[0].PackageType,
              TotalPackages: res.data[0].TotalPackages,
            });

            this.Calculate();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  getInvoiceDetails() {
    try {
      let data = {
        ShippingID: this.props.match.params.id,
      };
      api.post("scheduleshipment/getInvoiceDetail", data).then((res) => {
        this.hideLoader();
        if (res.success) {
          this.setState({
            invoiceList: res.data.invoiceData,
          });
          var i = 0;
          var totalCost = 0.0;
          for (i = 0; i < res.data.invoiceData.length; i++) {
            totalCost += res.data.invoiceData[i]["TotalAmount"];
          }
          this.setState({ TotalInvoiceCost: totalCost });
        } else {
          cogoToast.error("Something went wrong");
        }
      });
    } catch (err) {
      console.log("error......", err);
    }
  }

  getAddressDetails() {
    try {
      let data = {
        ShippingID: this.props.match.params.id,
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
              let fromOBJ = {
                AddressDetail: fromRes[0],
                CountryName: selectedFromCountry.label,
              };
              let toOBJ = {
                AddressDetail: toRes[0],
                CountryName: selectedToCountry.label,
              };
              this.setState({
                FromAddress: fromRes[0],
                FromCompanyName: fromRes[0].CompanyName,
                FromContactName: fromRes[0].ContactName,
                FromAddressLine1: fromRes[0].AddressLine1,
                FromAddressLine2: fromRes[0].AddressLine2,
                FromAddressLine3: fromRes[0].AddressLine3,
                FromZipCode: fromRes[0].ZipCode,
                FromPhone1: fromRes[0].Phone1,
                FromPhone2: fromRes[0].Phone2,
                FromEmail: fromRes[0].Email,
                FromAddressObj: fromOBJ,

                ToAddress: toRes[0],
                ToCompanyName: toRes[0].CompanyName,
                ToContactName: toRes[0].ContactName,
                ToAddressLine1: toRes[0].AddressLine1,
                ToAddressLine2: toRes[0].AddressLine2,
                ToAddressLine3: toRes[0].AddressLine3,
                ToZipCode: toRes[0].ZipCode,
                ToPhone1: toRes[0].Phone1,
                ToPhone2: toRes[0].Phone2,
                ToEmail: toRes[0].Email,
                ToAddressObj: toOBJ,

                fromState: fromRes[0].State,
                fromStateShow: fromRes[0].State,
                fromCity: fromRes[0].City,
                toState: toRes[0].State,
                toStateShow: toRes[0].State,
                toCity: toRes[0].City,
                ManagedByEmail: fromRes[0].ManagedByEmail,
                LocationType: fromRes[0].LocationType,
                DutiesPaidBy: fromRes[0].DutiesPaidBy,
                PickupDate: fromRes[0].PickupDate,
                IsPickup: fromRes[0].IsPickup.data[0] === 0 ? false : true,
                PackageType: fromRes[0].PackageType,
                FromMovingBack: fromMovingBack,
                FromEligibleForTR: fromEligibleForTr,
                FromOriginalPassortAvailable: fromOriginalPassortAvailable,
                selectedFromCountry: selectedFromCountry,
                selectedToCountry: selectedToCountry,
              });

              this.getStates(selectedFromCountry);
              this.toStates(selectedToCountry);
              this.hideLoader();
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

  checkInsurance() {
    try {
      let data = {
        ShippingID: this.props.match.params.id,
      };
      api.post("scheduleshipment/checkInsurancetaken", data).then((res) => {
        this.hideLoader();
        if (res.success) {
          this.setState({ isVisible: res.data.length > 0 ? false : true });
        } else {
          cogoToast.error("Something went wrong");
        }
      });
    } catch (err) {
      console.log("error......", err);
    }
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
            if (res.data.length) {
              var ToState = {
                value: this.state.toState,
                label: this.state.toState,
              };

              this.setState({
                toStateList: res.data,
                toState: ToState,
                toStateAutoComplete: res.data.length ? true : false,
              });
            } else {
              this.setState({
                toStateList: res.data,
                toStateAutoComplete: res.data.length ? true : false,
              });
            }
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
            if (res.data.length) {
              var FromState = {
                value: this.state.fromState,
                label: this.state.fromState,
              };

              this.setState({
                fromStateList: res.data,
                fromState: FromState,
                fromStateAutoComplete: res.data.length ? true : false,
              });
            } else {
              this.setState({
                fromStateList: res.data,
                fromStateAutoComplete: res.data.length ? true : false,
              });
            }
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

  getPackageDetail() {
    try {
      let data = {
        ShippingID: this.props.match.params.id,
      };
      api
        .post("scheduleshipment/getShipmentPackageByID", data)
        .then((res) => {
          if (res.success) {
            var l = 1;
            res.data.map((Obj) => {
              Obj.Index = l;
              l++;
              return Obj;
            });
            this.setState({
              PackageList: res.data,
            });
            this.Calculate();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  Calculate = () => {
    if (
      this.state.selectedFromCountry.value &&
      this.state.selectedToCountry.value
    ) {
      var TotalChargeWeight = 0;
      var TotalCFT = 0;
      var TotalWeight = 0;
      var TotalChargable = 0;
      var TotalInsuredvalue = 0;

      var PackageList = this.state.PackageList;
      for (var i = 0; i < PackageList.length; i++) {
        if (PackageList[i].Status === "Active") {
          var WE = 0;
          var LE = 0;
          var HE = 0;
          var Total = 0;
          var Weight = 0;
          var CFT = 0;
          var Chargable = 0;

          if (PackageList[i].EstimetedWeight) {
            Weight = PackageList[i].EstimetedWeight * 1;
          }

          if (PackageList[i].Width) {
            WE = PackageList[i].Width;
          }

          if (PackageList[i].Length) {
            LE = PackageList[i].Length;
          }

          if (PackageList[i].Height) {
            HE = PackageList[i].Height;
          }

          if (
            this.state.selectedFromCountry.value === 202 &&
            this.state.selectedToCountry.value === 202
          ) {
            Total = Math.ceil(parseFloat((WE * LE * HE) / 166)) * 1;
          } else {
            Total = Math.ceil(parseFloat((WE * LE * HE) / 139)) * 1;
          }

          if (
            this.state.selectedFromCountry.value === 89 &&
            this.state.selectedToCountry.value === 202
          ) {
            Total =
              Math.ceil(parseFloat(parseFloat(Total) / parseFloat(2.2))) * 1;
          }

          if (Weight > Total) {
            PackageList[i].ChargableWeight = Weight;
            TotalChargeWeight = parseInt(TotalChargeWeight) + parseInt(Weight);
          } else {
            PackageList[i].ChargableWeight = Total;
            TotalChargeWeight = parseInt(TotalChargeWeight) + parseInt(Total);
          }

          if (PackageList[i].ChargableWeight) {
            Chargable = PackageList[i].ChargableWeight;
          }
          CFT = parseFloat((WE * LE * HE) / 1728).toFixed(2) * 1;
          PackageList[i].CFT = CFT;
          TotalWeight = TotalWeight + Weight;
          TotalInsuredvalue =
            Number(TotalInsuredvalue) + Number(PackageList[i].InsuredValue);
          TotalCFT = TotalCFT + CFT;
          TotalChargable = TotalChargable + Chargable;
        }
      }
      this.setState({
        PackageList: PackageList,
        totalChargableWeight: TotalChargable,
        totalCFT: TotalCFT,
        totalInsuredValue: TotalInsuredvalue,
      });
    }
  };

  showLoader() {
    this.setState({ Loading: true });
  }

  hideLoader() {
    this.setState({ Loading: false });
  }

  getShipmentInfo() {
    try {
      let data = {
        ShippingID: this.props.match.params.id,
      };
      api.post("scheduleshipment/getShipmentInfo", data).then((res) => {
        if (res.success) {
          var shipmentType = {
            value: res.data[0].ShipmentType,
            label: res.data[0].ShipmentType,
          };
          var managedBy = {
            value: res.data[0].ManagedBy,
            label: res.data[0].ManagedByName,
          };

          var serviceName = {
            value: res.data[0].ServiceName,
            label: res.data[0].ServiceName,
          };

          var subServiceName = {
            value: res.data[0].SubServiceName,
            label: res.data[0].SubServiceName,
          };

          this.setState({
            ManagedBy: managedBy,
            TrackingNumber: res.data[0].TrackingNumber,
            ServiceName: serviceName,
            SubServiceName: subServiceName,
            DocumentManagedBy: res.data[0].ManagedByName,
            ShipmentType: shipmentType,
          });
        }
      });
    } catch (error) {
      console.log("error...", error);
    }
  }

  renderInvoice = () => {
    return this.state.invoiceList.map((invoice, idx) => {
      return (
        <tr>
          <td
            data-label=""
            style={{
              border: "1px solid #000",
              padding: "3px",
              width: "20px",
              textAlign: "center",
            }}
          >
            {idx + 1}.
          </td>
          <td
            data-label="DESCRIPTION OF SERVICES"
            style={{ border: "1px solid #000", padding: "3px" }}
          >
            {invoice.ServiceDescription}
            {invoice.Description ? " - " + invoice.Description : ""}
          </td>
          <td
            data-label="COST (IN USD)"
            style={{
              border: "1px solid #000",
              padding: "3px",
              textAlign: "right",
              width: "170px",
            }}
          >
            {invoice.TotalAmount ? "$" : null}
            {invoice.TotalAmount
              ? parseFloat(invoice.TotalAmount).toFixed(2)
              : null}
          </td>
        </tr>
      );
    });
  };

  renderInclusionsListShow = () => {
    return this.state.InclusionsListShow.map((invoice, idx) => {
      return <li>{invoice.label}</li>;
    });
  };

  renderExclusionsListShow = () => {
    return this.state.ExclusionsListShow.map((invoice, idx) => {
      return <li>{invoice.label}</li>;
    });
  };

  clear = () => {
    this.sigPad.clear();
  };

  validate() {
    let IsFormValid = true;
    if (CommonConfig.isEmpty(this.state.initialHere[0]["1"])) {
      IsFormValid = false;
      this.scrolldiv(1);
      return IsFormValid;
    }
    if (CommonConfig.isEmpty(this.state.initialHere[1]["2"])) {
      IsFormValid = false;
      this.scrolldiv(2);
      return IsFormValid;
    }
    if (CommonConfig.isEmpty(this.state.initialHere[2]["3"])) {
      IsFormValid = false;
      this.scrolldiv(3);
      return IsFormValid;
    }
    if (CommonConfig.isEmpty(this.state.initialHere[3]["4"])) {
      IsFormValid = false;
      this.scrolldiv(4);
      return IsFormValid;
    }
    if (
      CommonConfig.isEmpty(this.state.initialHere[4]["5"]) &&
      this.state.isVisible === true
    ) {
      IsFormValid = false;
      this.scrolldiv(1.5);
      return IsFormValid;
    }
    if (this.sigPad.isEmpty()) {
      IsFormValid = false;
      this.scrolldiv(3.5);
      return IsFormValid;
    }
    return IsFormValid;
  }

  trim = () => {
    if (this.validate()) {
      this.setState({
        trimmedDataURL: this.sigPad.getTrimmedCanvas().toDataURL("image/png"),
      });
     
      try {
        this.showLoader();
        var data = {
          TotalCostInvoice: parseFloat(this.state.TotalInvoiceCost).toFixed(2),
          ShippingID: this.props.match.params.id,
          PaymentList: this.state.invoiceList,
          ShipmentType: this.state.ShipmentType.value,
          totalCFT: this.state.totalCFT,
          InclusionsListShow: this.state.InclusionsListShow,
          ExclusionsListShow: this.state.ExclusionsListShow,
          dateTime: new Date().getTime(),
          Initial: this.state.initialHere,
          isVisible: this.state.isVisible ? 1 : 0,
          img: this.sigPad.getTrimmedCanvas().toDataURL("image/png"),
        };
        api
          .post("scheduleshipment/GeneratedContract", data)
          .then((res) => {
            this.hideLoader();
            if (res.success) {
              cogoToast.success(res.data.data);
              window.close();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      cogoToast.error("Please correct error and resubmit form");
    }
  };

  scrolldiv(pageNumber) {
    window.scrollTo(
      0,
      this.findPosition(document.getElementById("footer-" + pageNumber))
    );
  }

  findPosition(obj) {
    var currenttop = 0;
    if (obj.offsetParent) {
      do {
        currenttop += obj.offsetTop - 30;
      } while ((obj = obj.offsetParent));
      return [currenttop];
    }
  }

  changePasssword = (event, type) => {
    this.setState({ Passsword: event.target.value });
  };

  headerHtml = () => {
    return (
      <table className="res-table" style={{ width: "100%" }}>
        <tr>
          <td className="center mpb-10">
            <img src="https://www.sflworldwide.com/wp-content/uploads/2019/05/logo.png" />
          </td>
          <td style={{ width: "60%", textAlign: "right" }}>
            3364 Garden Brook Drive, Farmers Branch, Texas – 75234<br></br>
            Phone: 972-255-7447 Fax: 877-741-3134<br></br>
            contact@sflworldwide.com | www.SFLWorldwide.com<br></br>
            <b>Negotiated Rate Arrangements</b>
          </td>
        </tr>
      </table>
    );
  };

  footerHtml = (pageNumber) => {
    return (
      <table className="footer-esign table">
        <tr>
          <td id={"footer-" + pageNumber} className="relative">
            Initial Here:
            <input
              disabled={this.state.hideIntital}
              onChange={(e) => this.intialHereChange(e, pageNumber)}
              maxlength="3"
            />
            {/* {pageNumber < 4 ? 
                <button onClick={() => this.scrolldiv(pageNumber+1)}>Click</button>
                :
                null
              } */}
            {pageNumber < 4 ? (
              pageNumber === 1 && this.state.isVisible === true ? (
                <div className="flag-label">
                  <span onClick={() => this.scrolldiv(pageNumber + 0.5)}>
                    Sign
                  </span>
                </div>
              ) : (
                <div className="flag-label">
                  <span onClick={() => this.scrolldiv(pageNumber + 1)}>
                    Sign
                  </span>
                </div>
              )
            ) : (
              <div className="flag-label">
                <span>Sign</span>
              </div>
            )}
          </td>
          <td className="footer-esign center">
            <b>SFL WORLDWIDE LLC | FMC License No.: 025184</b>
          </td>
          <td className="footer-esign right">
            Page <b>{pageNumber}</b> of <b>4</b>
          </td>
        </tr>
      </table>
    );
  };

  intialHereChange = (e, pageNumber) => {
    let intialHere = this.state.initialHere;
    intialHere[pageNumber - 1][pageNumber] = e.target.value;
    this.setState({ initialHere: intialHere });
  };

  render() {
    return (
      <div className="esign-page-table">
        <div className="sign-warning">
          <button onClick={() => this.scrolldiv(1)}>Start</button>
        </div>
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
        {this.state.ShowContra ? (
          <div>
            <div className="page-break">
              {this.headerHtml()}
              <div class="table-pane active">
                <table style={{ width: "100%", marginTop: "15px" }}>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#fff",
                        background: "#002060",
                      }}
                    >
                      Contract for Overseas Relocation Services (LCL)
                    </td>
                  </tr>
                </table>
                <table style={{ width: "100%" }}>
                  <tr>
                    <td
                      style={{ width: "50%", padding: "0px" }}
                      className="td-mobile-full"
                    >
                      <table style={{ width: "100%", tableLayout: "fixed" }}>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "20%",
                              padding: "3px",
                            }}
                          >
                            <b>Customer Name</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "30%",
                              padding: "3px",
                            }}
                          >
                            {this.state.FromContactName}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "20%",
                              padding: "3px",
                            }}
                          >
                            <b>Origin City:</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "30%",
                              padding: "3px",
                            }}
                          >
                            {this.state.fromCity}, {this.state.fromStateShow} -{" "}
                            {this.state.FromZipCode} ,{" "}
                            {this.state.selectedFromCountry.label}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "20%",
                              padding: "3px",
                            }}
                          >
                            <b>Phone:</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "30%",
                              padding: "3px",
                            }}
                          >
                            {this.state.FromPhone1}
                            {!CommonConfig.isEmpty(this.state.FromPhone2)
                              ? ","
                              : ""}
                            {this.state.FromPhone2}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "20%",
                              padding: "3px",
                            }}
                          >
                            <b>Est. Volume</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "30%",
                              padding: "3px",
                            }}
                          >
                            {this.state.totalCFT}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "20%",
                              padding: "3px",
                            }}
                          >
                            <b>Commodity</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "30%",
                              padding: "3px",
                            }}
                          >
                            HHG
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "20%",
                              padding: "3px",
                            }}
                          >
                            <b>Service</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "30%",
                              padding: "3px",
                            }}
                          >
                            {this.state.SubServiceName.value}
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td
                      style={{ width: "50%", padding: "0px" }}
                      className="td-mobile-full"
                    >
                      <table style={{ width: "100%", tableLayout: "fixed" }}>
                        <tr>
                          <td
                            className="mobile-align-left"
                            style={{
                              border: "1px solid #000",
                              width: "20%",
                              padding: "3px",
                              textAlign: "right",
                            }}
                          >
                            <b>Quote Ref.:</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "30%",
                              padding: "3px",
                            }}
                          >
                            {this.state.TrackingNumber}
                          </td>
                        </tr>
                        <tr>
                          <td
                            className="mobile-align-left"
                            style={{
                              border: "1px solid #000",
                              width: "20%",
                              padding: "3px",
                              textAlign: "right",
                            }}
                          >
                            <b>Delivery City:</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "30%",
                              padding: "3px",
                            }}
                          >
                            {this.state.toCity}, {this.state.toStateShow} -{" "}
                            {this.state.ToZipCode} ,{" "}
                            {this.state.selectedToCountry.label}
                          </td>
                        </tr>
                        <tr>
                          <td
                            className="mobile-align-left"
                            style={{
                              border: "1px solid #000",
                              width: "20%",
                              padding: "3px",
                              textAlign: "right",
                            }}
                          >
                            <b>Email Id:</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "30%",
                              padding: "3px",
                            }}
                          >
                            <a href="#">{this.state.FromEmail}</a>
                          </td>
                        </tr>
                        <tr>
                          <td
                            className="mobile-align-left"
                            style={{
                              border: "1px solid #000",
                              width: "20%",
                              padding: "3px",
                              textAlign: "right",
                            }}
                          >
                            <b>Tracking No.</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "30%",
                              padding: "3px",
                            }}
                          >
                            {this.state.TrackingNumber}
                          </td>
                        </tr>
                        <tr>
                          <td
                            className="mobile-align-left"
                            style={{
                              border: "1px solid #000",
                              width: "20%",
                              padding: "3px",
                              textAlign: "right",
                            }}
                          >
                            <b>Mode</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "30%",
                              padding: "3px",
                            }}
                          >
                            {this.state.ShipmentType.value}
                          </td>
                        </tr>
                        <tr>
                          <td
                            className="mobile-align-left"
                            style={{
                              border: "1px solid #000",
                              width: "20%",
                              padding: "3px",
                              textAlign: "right",
                            }}
                          >
                            <b>Sales Rep.</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "30%",
                              padding: "3px",
                            }}
                          >
                            {this.state.DocumentManagedBy}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <table style={{ width: "100%", marginTop: "10px" }}>
                  <tr>
                    <td
                      colspan="2"
                      style={{
                        fontWeight: "bold",
                        padding: "3px",
                        border: "1px solid #000",
                        background: "#ffc000",
                      }}
                    >
                      DESCRIPTION OF SERVICES
                    </td>
                    <td
                      style={{
                        fontWeight: "bold",
                        padding: "3px",
                        border: "1px solid #000",
                        background: "#ffc000",
                        textAlign: "right",
                      }}
                    >
                      COST (IN USD)
                    </td>
                  </tr>
                  {this.renderInvoice()}
                  <tr>
                    <td
                      colspan="2"
                      style={{
                        fontWeight: "bold",
                        padding: "3px",
                        border: "1px solid #000",
                        background: "#ffc000",
                        textAlign: "right",
                      }}
                    >
                      TOTAL Cost:
                    </td>
                    <td
                      data-label="Total Cost:"
                      style={{
                        fontWeight: "bold",
                        padding: "3px",
                        border: "1px solid #000",
                        background: "#ffc000",
                        textAlign: "right",
                      }}
                    >
                      $ {parseFloat(this.state.TotalInvoiceCost).toFixed(2)}
                    </td>
                  </tr>
                </table>
                <table style={{ width: "100%", marginTop: "10px" }}>
                  <tr>
                    <td
                      colspan="2"
                      style={{
                        border: "1px solid #000",
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: "#fff",
                        background: "#002060",
                      }}
                    >
                      Best Price{" "}
                      <span style={{ borderBottom: "1px solid #fff" }}>
                        Guaranteed
                      </span>
                      . We Will Meet or Beat the Best Door to Door Rates!
                    </td>
                  </tr>
                </table>
                <table style={{ width: "100%" }}>
                  <tr>
                    <th
                      scope="col"
                      style={{
                        fontWeight: "bold",
                        padding: "3px",
                        border: "1px solid #000",
                        background: "#ffc000",
                        width: "50%",
                        textAlign: "left",
                      }}
                    >
                      Inclusions
                    </th>
                  </tr>
                  <tr>
                    <td
                      data-label="Inclusions"
                      style={{ width: "50%", border: "1px solid #000" }}
                    >
                      <ul>{this.renderInclusionsListShow()}</ul>
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="col"
                      style={{
                        fontWeight: "bold",
                        padding: "3px",
                        border: "1px solid #000",
                        background: "#ffc000",
                        width: "50%",
                        textAlign: "left",
                      }}
                    >
                      Exclusions (If Applicable)
                    </th>
                  </tr>
                  <tr>
                    <td
                      data-label="Exclusions (If Applicable)"
                      style={{ width: "50%", border: "1px solid #000" }}
                    >
                      <ul>{this.renderExclusionsListShow()}</ul>
                    </td>
                  </tr>
                </table>
              </div>
              {this.footerHtml(1)}
            </div>
            <div className="page-break">
              {this.headerHtml()}
              <div className="table-pane">
                <table
                  style={{ width: "100%", marginTop: "10px" }}
                  class="page res-table"
                >
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: "#fff",
                        background: "#002060",
                      }}
                    >
                      Insurance Options
                    </td>
                  </tr>
                </table>
                <table
                  style={{ width: "100%", fontSize: "12px" }}
                  class="page res-table res-table-right"
                >
                  <tr className="mobile-hide">
                    <th
                      scope="col"
                      style={{
                        fontWeight: "bold",
                        padding: "3px",
                        border: "1px solid #000",
                        background: "#ffc000",
                        width: "33.33%",
                        textAlign: "center",
                      }}
                    >
                      Mover’s Liability
                    </th>
                    <th
                      scope="col"
                      style={{
                        fontWeight: "bold",
                        padding: "3px",
                        border: "1px solid #000",
                        background: "#ffc000",
                        width: "33.33%",
                        textAlign: "center",
                      }}
                    >
                      Selective Risk Policy
                    </th>
                    <th
                      scope="col"
                      style={{
                        fontWeight: "bold",
                        padding: "3px",
                        border: "1px solid #000",
                        background: "#ffc000",
                        width: "33.33%",
                        textAlign: "center",
                      }}
                    >
                      All Risk Policy
                    </th>
                  </tr>
                  <tr>
                    <td
                      data-label="Mover’s Liability"
                      style={{
                        fontWeight: "bold",
                        border: "1px solid #000",
                        padding: "3px",
                        textAlign: "center",
                      }}
                    >
                      $0 Deductible
                    </td>
                    <td
                      data-label="Selective Risk Policy"
                      style={{
                        fontWeight: "bold",
                        border: "1px solid #000",
                        padding: "3px",
                        textAlign: "center",
                      }}
                    >
                      $250 Deductible
                    </td>
                    <td
                      data-label="All Risk Policy"
                      style={{
                        fontWeight: "bold",
                        border: "1px solid #000",
                        padding: "3px",
                        textAlign: "center",
                      }}
                    >
                      $1000 Deductible
                    </td>
                  </tr>
                  <tr>
                    <td
                      data-label="Mover’s Liability"
                      style={{
                        border: "1px solid #000",
                        padding: "3px",
                        textAlign: "center",
                      }}
                    >
                      $0 Deductible
                    </td>
                    <td
                      data-label="Selective Risk Policy"
                      style={{
                        border: "1px solid #000",
                        padding: "3px",
                        textAlign: "center",
                      }}
                    >
                      $250 Deductible
                    </td>
                    <td
                      data-label="All Risk Policy"
                      style={{
                        border: "1px solid #000",
                        padding: "3px",
                        textAlign: "center",
                      }}
                    >
                      $500 Deductible
                    </td>
                  </tr>
                  <tr>
                    <td
                      data-label="Mover’s Liability"
                      style={{
                        border: "1px solid #000",
                        padding: "3px",
                        textAlign: "center",
                        position: "relative",
                      }}
                    >
                      No premium
                      <div className="flag-label">
                        <span onClick={() => this.scrolldiv(2)}>Sign</span>
                      </div>
                      {this.state.isVisible ? (
                        <input
                          id="footer-1.5"
                          maxlength="3"
                          disabled={this.state.hideIntital}
                          onChange={(e) => this.intialHereChange(e, 5)}
                        />
                      ) : null}
                    </td>
                    <td
                      data-label="Selective Risk Policy"
                      style={{
                        border: "1px solid #000",
                        padding: "3px",
                        textAlign: "center",
                      }}
                    >
                      5.00% premium with<br></br>a $50 minimum
                    </td>
                    <td
                      data-label="All Risk Policy"
                      style={{
                        border: "1px solid #000",
                        padding: "3px",
                        textAlign: "center",
                      }}
                    >
                      3.00% premium with<br></br>a $300 minimum
                    </td>
                  </tr>
                  {/* <tr>
                <td style={{border: '1px solid #000', padding:'5px',textAlign: 'center'}}>Maximum Mover liability of<br></br>$0.60 per lbs. / package</td>
                <td style={{border: '1px solid #000', padding:'5px',textAlign: 'center'}}>Detailed breakup of valued<br></br>goods to be packed by MOVERS</td>
                <td style={{border: '1px solid #000', padding:'5px',textAlign: 'center'}}>Detailed breakup of valued<br></br>goods to be packed by MOVERS</td>
              </tr> */}
                </table>
                <table
                  style={{ width: "100%", marginTop: "10px", fontSize: "11px" }}
                >
                  <tr>
                    <td>
                      <b>Mover’s Liability Explained:</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        Movers Liability provides Loss Only coverage of $0.60
                        Per LBS per article or package. Movers Liability does
                        not provide any coverage on missing or damaged items not
                        mentioned on the packing list.
                      </p>
                    </td>
                  </tr>
                </table>
                <table style={{ width: "100%", fontSize: "11px" }}>
                  <tr>
                    <td>
                      <b>Selective Risk Explained:</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        Under Selective Risk Insurance shipper can insurance
                        selective item(s) and does not need to take insurance on
                        entire shipment. Your shipment is covered against risks
                        such as breakage, damage, theft, fire, earthquake,
                        collision, accidents, etc. Shipment packed by owner is
                        not covered under Selective Risk Insurance. If the
                        shipment is Packed by owner and required repacking at
                        our warehouse; selective risk insurance will be
                        activated from SFL Worldwide warehouse once items are
                        inspected and repacked professionally. Shipment will be
                        covered at current value and does not cover shipping
                        charges, packing charges, customs duty etc. It is
                        shipper responsibility to review and accept terms and
                        condition offered by the insurance company or selects
                        any other insurance provider if needed.
                      </p>
                    </td>
                  </tr>
                </table>
                <table style={{ width: "100%", fontSize: "11px" }}>
                  <tr>
                    <td>
                      <b>All Risk Explained:</b>
                    </td>
                  </tr>
                  <tr>
                    <p>
                      Your shipment is covered against risks such as breakage,
                      damage, theft, fire, earthquake, collision, accidents,
                      etc. Shipment packed by owner is not covered under All
                      Risk Insurance. If the shipment is Packed by owner and
                      required repacking at our warehouse; all risk insurance
                      will be activated from SFL Worldwide warehouse once items
                      are inspected and repacked professionally. Shipment will
                      be covered at current value and does not cover shipping
                      charges, packing charges, customs duty etc. SFL Worldwide
                      will take insurance from 3rd party Insurance Company and
                      will not be responsible or liable for any judgment made by
                      the insurance company. It is shipper responsibility to
                      review and accept terms and condition offered by the
                      insurance company or selects any other insurance provider
                      if needed.
                    </p>
                  </tr>
                  <table
                    style={{
                      width: "100%",
                      marginTop: "10px",
                      fontSize: "12px",
                    }}
                    class="page res-table"
                  >
                    <tr className="mobile-hide">
                      <td
                        colspan="2"
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "11px",
                          fontWeight: "bold",
                          color: "#fff",
                          background: " #002060",
                          width: "70%",
                        }}
                      >
                        Documents Required at Origin
                      </td>
                      <td
                        rowspan="2"
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "11px",
                          fontWeight: "bold",
                          color: "#fff",
                          background: " #002060",
                        }}
                      >
                        Documents Required at Destination
                      </td>
                    </tr>
                    <tr className="mobile-hide">
                      <td
                        style={{
                          fontWeight: "bold",
                          padding: "3px",
                          border: "1px solid #000",
                          background: "#ffc000",
                        }}
                      >
                        Foreign Passport Holder(s)
                      </td>
                      <td
                        style={{
                          fontWeight: "bold",
                          padding: "3px",
                          border: "1px solid #000",
                          background: "#ffc000",
                        }}
                      >
                        Indian Passport Holder(s)
                      </td>
                    </tr>
                    <tr>
                      <td
                        data-label="Documents Required at Origin - Foreign Passport Holder(s)"
                        style={{
                          border: "1px solid #000",
                          verticalAlign: "top",
                        }}
                      >
                        <ul style={{ fontSize: "11px" }}>
                          <li>
                            Scanned copy of passport photo page only (not the
                            entire passport)
                          </li>
                          <li>Copy of Visa / OCI / PIO card</li>
                          <li>
                            Copy of EIN number / Authorization to us to apply
                            for and obtain EIN on your behalf
                          </li>
                          <li>
                            Signatures on export forms that will be provided by
                            us
                          </li>
                        </ul>
                      </td>
                      <td
                        data-label="Documents Required at Origin - Indian Passport Holder(s)"
                        style={{
                          border: "1px solid #000",
                          verticalAlign: "top",
                        }}
                      >
                        <ul style={{ fontSize: "11px" }}>
                          <li>
                            Scanned copy of passport photo page (not entire
                            passport)
                          </li>
                          <li>
                            Signatures on export forms that will be provided by
                            us
                          </li>
                        </ul>
                      </td>
                      <td
                        data-label="Documents Required at Destination"
                        style={{
                          border: "1px solid #000",
                          verticalAlign: "top",
                        }}
                      >
                        <ul style={{ fontSize: "11px" }}>
                          <li>Original Passport</li>
                          <li>OCI / PIO Card, if holding foreign passport</li>
                          <li>
                            Signature on Customs forms that will be provided by
                            us
                          </li>
                        </ul>
                      </td>
                    </tr>
                  </table>
                  <tr>
                    <td>
                      <b>
                        Shipper's presence in India when the shipment reaches is
                        mandatory. If the shipper has not arrived into India or
                        has to travel out again when the shipment reaches, we
                        cannot clear it and additional charges may incur. We
                        would need Original Passport along with Customer's
                        Signatures on Custom Documentation which will be
                        provided by SFL Worldwide as without this document we
                        won't able to clear shipment from customs and additional
                        charges will incur which SFL Worldwide will not be
                        liable for.
                      </b>
                    </td>
                  </tr>
                </table>
              </div>
              {this.footerHtml(2)}
            </div>
            <div className="page-break">
              {this.headerHtml()}
              <div className="table-pane">
                <table style={{ width: "100%", marginTop: "10px" }}>
                  <tr>
                    <td style={{ paddingTop: "20px" }}>
                      <b>Transit Times:</b> SFL Worldwide is only liable for
                      loss of entire package or article that is expressly stated
                      in the household goods descriptive inventory and may occur
                      while your shipment is in our physical possession. Our
                      maximum liability for such loss is limited to an amount
                      not exceeding $0.60 per pound package. SFL Worldwide will
                      not be liable for any damage or missing content inside any
                      package or article. Our liability only covers if entire
                      box/package/article is missing. We are not liable for loss
                      or damage that may occur after the shipment leaves our
                      physical possession.
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingTop: "20px" }}>
                      <b>Our Liability:</b> SFL Worldwide is only liable for
                      loss of entire package or article that is expressly stated
                      in the household goods descriptive inventory and may occur
                      while your shipment is in our physical possession. Our
                      maximum liability for such loss is limited to an amount
                      not exceeding $0.60 per pound package. SFL Worldwide will
                      not be liable for any damage or missing content inside any
                      package or article. Our liability only covers if entire
                      box/package/article is missing. We are not liable for loss
                      or damage that may occur after the shipment leaves our
                      physical possession.
                      <br></br>
                      An optional extended protection plan for your household
                      goods, personal effects and automobiles moving by land,
                      sea and/or air is available subject to your application,
                      acceptance, payment of premiums and compliance with the
                      terms and conditions of our 3rd party insurance
                      underwriter at least 4 days prior to the pickup of your
                      shipment. SFL Worldwide, LLC does recommend that you
                      purchase an extended protection plan for your shipment.
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingTop: "20px" }}>
                      If the shipment arrives at the warehouse in damaged
                      condition, we can either return shipment back to the
                      shipper or dispose shipment at written confirmation from
                      the shipper. Depending upon the option selected to and
                      from shipping charges and disposal fees will be applied.
                      SFL Worldwide is not liable for any damage of loss of the
                      shipment arrived in damaged conditional at SFL or its
                      authorized receiving center. If your shipment does not
                      arrive within 3 weeks from pickup date to our warehouse or
                      we are not able to trace the part or full shipment, SFL
                      Worldwide will compensate under Movers Liability Converge.
                    </td>
                  </tr>

                  <table class="page">
                    <tr>
                      <td style={{ paddingTop: "20px" }}>
                        <b>Quote Validity:</b> We appreciate and thank you for
                        the opportunity to submit this proposal for
                        international relocation services. The scope of services
                        to be performed by SFL Worldwide and its agents are
                        limited to the performance of only those services
                        expressly stated in this proposal. Please note, that our
                        services are entirely flexible and can be adapted to
                        your changing requirements. The prices stated herein are
                        valid for a period of Thirty (30) days from the date of
                        this proposal.
                      </td>
                    </tr>
                    <tr>
                      <td style={{ paddingTop: "20px" }}>
                        <b>Payment Terms:</b> All charges, as above must be paid
                        by check or wire transfer within seven days from the
                        receipt of our trade invoice after pickup of your
                        shipment. Credit Card will be only accepted for payment
                        under $500.00 and credit card fees will be charged at 3%
                        if payment is being made by Credit Card. If payment is
                        not made by due date late fees of $35.00 and interest of
                        14.99 % per annum will be applied.
                      </td>
                    </tr>
                    <tr>
                      <td style={{ paddingTop: "20px" }}>
                        <b>Weight Limit:</b> You are allowed to keep the weight
                        equal to the dimensional weight of the box. For Example:
                        If you are using a box with dimension 18x18x24 Inches,
                        so the dimensional weight of this box is 56lbs therefore
                        you can fill this box up to 56 lbs. Here if the actual
                        weight exceeds the allowed limit you will be charged as
                        $2/lb. for additional Lbs. If any of your box is more
                        than 50lbs then there will be additional Charge of
                        $25.00 for that particular box for Over Weight Charges.
                        <br></br>
                        Overseas shipping entails handling of cargo multiple
                        times and therefore standard boxes do not have the
                        quality or cardboard strength to sustain all the
                        handling. You must buy Double Walled or Heavy-Duty boxes
                        to ship your belongings which is easily available from
                        Home Depot or Lowes Stores. If boxes are received in
                        damaged condition to our warehouse additional $ 25.00
                        repacking charges per box will be applied to repack
                        damaged boxes.
                      </td>
                    </tr>
                  </table>
                </table>
              </div>

              {this.footerHtml(3)}
            </div>
            <div className="page-break">
              {this.headerHtml()}

              <div className="table-pane">
                <table
                  style={{ width: "100%", marginTop: "10px" }}
                  class="page"
                >
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: "#fff",
                        background: " #002060",
                        width: "50%",
                      }}
                    >
                      Your rights and responsibilities
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid #000" }}>
                      <ul>
                        <li>
                          Our House Bill of Lading is the title to your cargo.
                        </li>
                        <li>
                          By signing this contract, you agree that our Household
                          Goods Descriptive Inventory is the official document
                          that contains the pickup date, delivery date, quantity
                          and description of your packages shipped and received.
                        </li>
                        <li>
                          You agree to denote damages to items during packing or
                          loading at the origin in our Household Goods
                          Descriptive Inventory prior to signing and dating at
                          the origin.
                        </li>
                        <li>
                          You agree to denote any missing or damaged packages
                          along with your signature upon delivery of your
                          shipment in our Household Goods Descriptive Inventory
                          prior to signing and dating at the destination.
                        </li>
                        <li>
                          In the event that your shipment is not delivered in
                          whole, you agree to submit your claim in writing to us
                          within 120 days after pickup. We will attempt to
                          locate your shipment within 4 weeks of receiving your
                          written claim. If we are unable to locate your
                          shipment in four weeks and if you have purchased an
                          extended protection plan with us, we will file a claim
                          with the insurance company during the fifth week. If
                          you have not purchased an extended protection plan or
                          if your claim is denied by the insurance company you
                          will be compensated per Movers Liability stated above.
                        </li>
                        <li>
                          In the event that your shipment is delivered in part
                          or in the case of any damages, you agree to submit
                          your claim in writing to us within 7 days after
                          delivery. You agree to denote the missing / damaged
                          packages in our Household Goods Descriptive Inventory
                          during delivery. Upon receipt of your written claim
                          and if you have purchased an All-Risk insurance
                          extended protection plan with us we will file a claim
                          with the insurance company. If you have not purchased
                          All Risk Insurance or if your insurance claim is
                          denied by the insurance company you will be
                          compensated per Movers Liability stated above.
                        </li>
                        <li>
                          You may address your claim to SFL Worldwide at
                          contact@sflworldwide.com or By Faxing at
                          1-888-609-0778
                        </li>
                        <li>
                          Please confirm acceptance of this proposal by signing
                          and returning this proposal along with booking deposit
                          USD 250.00 so that we can lock the rates and process
                          your booking. Balance Payment is due in full upon
                          receipt of our Invoice which will be sent after pickup
                          of your shipment.
                        </li>
                        <li>
                          Service provided pursuant to this NVOCC Negotiated
                          Rate Arrangement (NRA) is subject to Carrier's
                          governing rules tariff, which is accessible at
                          www.dpiusa.com in compliance with FMC Regulations as
                          provided in 46 CFR 532.7.”
                        </li>
                        <li>
                          Any legal disputes will be subject to the jurisdiction
                          of Texas State Law where SFL Worldwide LLC is
                          registered.
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        fontSize: "11px",
                        textAlign: "center",
                        fontWeight: "bold",
                        padding: "15px 5px",
                      }}
                    >
                      SFL Worldwide LLc<br></br>
                      3364 Garden Brook Drive, Farmers Branch, TX - 75234
                      <br></br>
                      Website: www.SFLWorldwide.com | Fax: 888-609-0778
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: "#fff",
                        background: " #002060",
                        width: "50%",
                      }}
                    >
                      Signature Confirmation{" "}
                      <i style={{ fontWeight: "normal" }}>
                        (Please sign when ready to confirm)
                      </i>
                      :
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        position: "relative",
                        height: "80px",
                        border: "1px solid #000",
                        borderWidth: "1px 1px 0 1px",
                        padding: "0 10px",
                      }}
                    >
                      <div className="flag-label">
                        <span>Sign</span>
                      </div>
                      <table className="res-table" style={{ width: "100%" }}>
                        <tr>
                          <td
                            style={{ padding: "5px 0", width: "30%" }}
                            id="footer-3.5"
                          >
                            <SignatureCanvas
                              penColor="black"
                              ref={(ref) => {
                                this.sigPad = ref;
                              }}
                              canvasProps={{
                                width: 230,
                                height: 150,
                                className: "sigCanvas",
                              }}
                            />
                          </td>
                          <td
                            style={{
                              padding: "5px 0",
                              width: "50%",
                              verticalAlign: "bottom",
                              paddingLeft: "5px",
                            }}
                          >
                            {moment(this.state.currentDate).format(
                              CommonConfig.dateFormat.dateOnly
                            )}
                          </td>
                          <td
                            style={{
                              padding: "5px 0",
                              textAlign: "right",
                              verticalAlign: "bottom",
                            }}
                          >
                            {this.state.DocumentManagedBy}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "0 10px",
                        borderWidth: "0 1px 1px 1px",
                      }}
                    >
                      <table
                        style={{ width: "100%", borderTop: "1px solid #000" }}
                      >
                        <tr>
                          <td style={{ padding: "5px 0", width: "37%" }}>
                            Customer Signature
                          </td>
                          <td style={{ padding: "5px 0", width: "40%" }}>
                            Date
                          </td>
                          <td style={{ padding: "5px 0", textAlign: "right" }}>
                            Working on Proposal
                          </td>
                        </tr>
                        <tr>
                          <td
                            colspan="3"
                            style={{
                              textAlign: "center",
                              paddingBottom: "5px",
                            }}
                          >
                            By signing above, you agree that they are
                            incorporated herein by reference and apply to this
                            account.
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
              {this.footerHtml(4)}
            </div>

            <div className="table-pane"></div>
            {/* <table style={{ width: '100%', marginTop: "10px" }}>
            <tr>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: '3px', fontSize: '11px', fontWeight: 'bold', 'color': '#fff', background: ' #002060', width: '50%' }}>Dimensional Weight (Lbs)</td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: '3px', fontSize: '11px', fontWeight: 'bold', 'color': '#fff', background: ' #002060', width: '50%' }}>Cubic Ft.</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: '3px' }}>
                <img style={{ maxWidth: '100%' }} src={dimensional_logo} alt="" />
              </td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: '3px' }}>
                <img style={{ maxWidth: '100%' }} src={cubitlogo} alt="" />
              </td>
            </tr>
          </table> */}
            <div>
              {!this.state.hideIntital ? (
                <>
                  <Button onClick={() => this.clear()}>clear</Button>
                  <Button onClick={() => this.trim()}>Submit</Button>
                </>
              ) : null}
            </div>
          </div>
        ) : (
          <div>
            <div>
              {this.state.Showdata ? (
                <>
                  <div>
                    <div>
                      <a href="https://hub.sflworldwide.com/">
                        {/* // <a href=" http://phpstack-773983-2884162.cloudwaysapps.com/"> */}
                        <img
                          src="https://www.sflworldwide.com/wp-content/uploads/2019/05/logo.png"
                          width="185"
                          height="55"
                        />
                      </a>
                    </div>
                  </div>
                  <div>
                    <h1>Document Expired</h1>
                    <p>This document expired on November 30, 2020 </p>
                    <p>For more information, please contact:</p>
                    <span>Uvesh Saiyad</span>
                    <br />
                    <a href="mailto:uvesh.saiyad@cognisun.com">
                      uvesh.saiyad@cognisun.com
                    </a>
                    <p>+91 8460408687</p>
                  </div>
                </>
              ) : null
              // <div>
              //   <h1>Data Not Found</h1>
              //   <p>For more information, please contact:</p>
              //   <span>Uvesh Saiyad</span><br />
              //   <a href="mailto:uvesh.saiyad@cognisun.com">uvesh.saiyad@cognisun.com</a>
              //   <p>+91 8460408687</p>
              // </div>
              }
            </div>
          </div>
        )}
      </div>
    );
  }
}
esign_client.propTypes = {
  classes: PropTypes.object,
};

export default withStyles()(esign_client);
