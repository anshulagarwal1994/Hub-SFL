import React from "react";
// core components
import moment from "moment";
import { CommonConfig } from "../../utils/constant";
import cogoToast from "cogo-toast";
import api from "../../utils/apiClient";
import SignatureCanvas from "react-signature-canvas";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import SimpleBackdrop from "../../utils/general";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "components/CustomButtons/Button.js";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";

import publicIp from "public-ip";
const useStyles = () => makeStyles(styles);
const classes = useStyles();

class esign_client_temp extends React.Component {
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
      ],
      isVisible: false,
      hideIntital: false,
      MovingBackToIndia: false,
      NameAsPerPassport: "",
      YearsOutsideIndia: "",
      StayInIndia: "",
      LatestArrivalDate: "",
      AppliedForTR: "",
      AbleToProvidePassport: "",
      VisaValidDate: "",
      ArrivalCategory: "",
      InsuranceType: "",
      ContainerType: "",
      NAText: "Not Applicable",
      OpenSignPad: false,
      signPadCopy: "",
      signname: "",
      previousSignname: false,
      textIMGURL: "",
      SignType: "Esign",
      isSignPadChange: false,
      previousSigned: false,
      isSignCleared: false,
      showAlreadySigned: false,
      showAlreadyExpired: false,
      showConfirmationPage: false,
      isFlicker: false,
      ManagedByEmail: "",
      SignedOnDate: "",
      ExpiredOnDate: "",
      ManagedByName: "",
      SignDate: "",
      SFLContactNumber: "1-972-255-7447",
      InsuranceWaiver: "",
      outofPageCount: "4",
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
            this.setState({
              ManagedByEmail: res.data.Email,
              SignedOnDate: res.data.SignedOn,
              ExpiredOnDate: res.data.ExpiredOn,
              ManagedByName: res.data.ManagedByName,
              InsuranceWaiver: res.data.InsuranceWaiver,
            });
            if (res.data.InsuranceWaiver === "Yes") {
              this.setState({
                outofPageCount: "5",
              });
            }
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
              if (res.data.Status === "Inactive") {
                this.setState({
                  ShowContra: false,
                  showAlreadySigned: true,
                });
                var element = document.getElementById("mainDiv");
                element.classList.add("expireClass");
              } else if (!(dateLimit.isValid() && now.isBefore(dateLimit))) {
                this.setState({
                  ShowContra: false,
                  showAlreadyExpired: true,
                });
                var element = document.getElementById("mainDiv");
                element.classList.add("expireClass");
              } else {
                this.setState({
                  ShowContra: true,
                  isFlicker: true,
                });
              }
            }
          } else {
            this.hideLoader();
            this.setState({ ShowContra: false });
            cogoToast.error("Expired");
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
                MovingBackToIndia: !CommonConfig.isEmpty(
                  fromRes[0].MovingBackToIndia
                )
                  ? fromRes[0].MovingBackToIndia.data[0] === 0
                    ? false
                    : true
                  : "",
                NameAsPerPassport: fromRes[0].NameAsPerPassport,
                YearsOutsideIndia: fromRes[0].YearsOutsideIndia,
                StayInIndia: !CommonConfig.isEmpty(fromRes[0].StayInIndia)
                  ? fromRes[0].StayInIndia.data[0] === 0
                    ? "No"
                    : "Yes"
                  : "",
                LatestArrivalDate: fromRes[0].LatestArrivalDate,
                AppliedForTR: !CommonConfig.isEmpty(fromRes[0].AppliedForTR)
                  ? fromRes[0].AppliedForTR.data[0] === 0
                    ? "No"
                    : "Yes"
                  : "",
                AbleToProvidePassport: !CommonConfig.isEmpty(
                  fromRes[0].AbleToProvidePassport
                )
                  ? fromRes[0].AbleToProvidePassport.data[0] === 0
                    ? "No"
                    : "Yes"
                  : "",
                VisaValidDate: fromRes[0].VisaValidDate,
                ArrivalCategory: fromRes[0].ArrivalCategory,
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
          if (res.data.length > 0) {
            this.setState({
              InsuranceType: res.data[0].ServiceDescription,
            });
          }
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
        totalCFT: parseFloat(TotalCFT).toFixed(2),
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
    if (this.state.SignType === "Type") {
      this.setState({
        signname: "",
      });
    } else {
      this.sigPad.clear();
    }
  };

  nameSignChange = (event) => {
    this.setState({
      signname: event.target.value,
    });
    if (!CommonConfig.isEmpty(event.target.value)) {
      this.setState({
        previousSignname: true,
      });
    }
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
    if (this.state.InsuranceWaiver === "Yes") {
      if (CommonConfig.isEmpty(this.state.initialHere[3]["4"])) {
        IsFormValid = false;
        this.scrolldiv(4);
        return IsFormValid;
      }
    }
    if (this.state.SignType === "Type") {
      if (CommonConfig.isEmpty(this.state.signname)) {
        IsFormValid = false;
        this.scrolldiv(this.state.InsuranceWaiver === "Yes" ? 5 : 4);
        return IsFormValid;
      }
    } else {
      if (this.sigPad !== null) {
        if (this.sigPad.isEmpty()) IsFormValid = false;
        this.scrolldiv(this.state.InsuranceWaiver === "Yes" ? 5 : 4);
        return IsFormValid;
      } else if (this.sigPad === null) {
        IsFormValid = false;
        this.scrolldiv(this.state.InsuranceWaiver === "Yes" ? 5 : 4);
        return IsFormValid;
      }
    }
    return IsFormValid;
  }

  trim = () => {
    debugger;
    console.log("1111111111@@@@@@@@@@@@@");
    if (this.validate()) {
      let imgURL = "";
      if (this.state.SignType === "Type") {
        let tCtx = document.getElementById("textCanvas").getContext("2d");
        tCtx.font = "30px Verdana";
        tCtx.fillText(this.state.signname, 50, 50);
        imgURL = tCtx.canvas.toDataURL();
      } else {
        console.log("convert jpg...");
        imgURL = this.sigPad.getTrimmedCanvas().toDataURL("image/jpg");
      }
      console.log("imgURL...", imgURL);
      try {
        this.showLoader();
        debugger;
        console.log("test esign_temp");
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
          img: imgURL,
          InsuranceWaiver: this.state.InsuranceWaiver,
        };

        api
          .post("scheduleshipment/GeneratedContract", data)
          .then((res) => {
            this.hideLoader();
            if (res.success) {
              var element = document.getElementById("mainDiv");
              element.classList.add("expireClass");
              cogoToast.success(res.data.data);
              this.setState({
                showConfirmationPage: true,
                SignDate: res.data.SignDate,
              });
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

  intialHereChange = (e, pageNumber) => {
    let intialHere = this.state.initialHere;
    intialHere[pageNumber - 1][pageNumber] = e.target.value;
    this.setState({ initialHere: intialHere });
  };

  signPadPopup = () => {
    this.setState({
      OpenSignPad: true,
      signname: "",
      previousSignname: false,
      previousSigned: this.state.isSignPadChange,
      isSignPadChange: false,
    });
    let canvasDiv = document.getElementById("canvas-div");
    canvasDiv.innerHTML = "";
    canvasDiv.innerHTML = `<canvas class ="canvas-outline" id='textCanvas'></canvas>`;
  };

  saveSign = () => {
    if (this.state.SignType === "Type") {
      let tCtx = document.getElementById("textCanvas").getContext("2d");
      let imgURL = "";
      tCtx.font = "30px Verdana";
      tCtx.fillText(this.state.signname, 50, 50);
      imgURL = tCtx.canvas.toDataURL();
      this.setState({
        textIMGURL: imgURL,
      });
    } else {
      this.setState({
        trimmedDataURL: this.sigPad.getTrimmedCanvas().toDataURL("image/png"),
      });
    }

    this.setState({
      OpenSignPad: false,
    });
  };

  handleCommonRadio = (e) => {
    this.setState({
      SignType: e.target.value,
    });
  };

  signChange = (e) => {
    this.setState({
      isSignPadChange: true,
      previousSigned: true,
    });
  };

  render() {
    const {
      InsuranceType,
      MovingBackToIndia,
      FromContactName,
      NameAsPerPassport,
      YearsOutsideIndia,
      StayInIndia,
      LatestArrivalDate,
      AppliedForTR,
      AbleToProvidePassport,
      VisaValidDate,
      ArrivalCategory,
      NAText,
      OpenSignPad,
      trimmedDataURL,
      SignType,
      showAlreadySigned,
      showAlreadyExpired,
      showConfirmationPage,
      DocumentManagedBy,
      ShowContra,
      isFlicker,
      ManagedByEmail,
      ExpiredOnDate,
      SignedOnDate,
      ManagedByName,
      SFLContactNumber,
      SignDate,
      InsuranceWaiver,
      outofPageCount,
    } = this.state;

    return (
      <div class="contract-table-outer" id="mainDiv">
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
        {!showAlreadySigned &&
        !showAlreadyExpired &&
        !showConfirmationPage &&
        isFlicker ? (
          <>
            <div className="sign-warning">
              <button onClick={() => this.scrolldiv(1)}>Start</button>
            </div>
            <div class="contaract-table-page font-11">
              <div class="header">
                <div class="logo">
                  <a href="https://www.sflworldwide.com/" target="_blank">
                    <img src="https://www.sflworldwide.com/wp-content/uploads/2019/05/logo.png" />
                  </a>
                  <div class="desktop-none">
                    3364 Garden Brook Drive, Farmers Branch, Texas – 75234
                    <br />
                    Phone: 972-255-7447 Fax: 877-741-3134
                    <br />
                  </div>
                </div>
                <div class="header-right">
                  <div class="mobile-none">
                    3364 Garden Brook Drive, Farmers Branch, Texas – 75234
                    <br />
                    Phone: 972-255-7447 Fax: 877-741-3134
                    <br />
                  </div>
                  contact@sflworldwide.com | www.SFLWorldwide.com
                  <br />
                  <b>Negotiated Rate Arrangements</b>
                </div>
              </div>

              <div class="table-responsive">
                <table style={{ width: "100%", marginTop: "15px" }}>
                  <tbody>
                    <tr>
                      <td
                        colSpan="4"
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                          padding: "5px",
                          fontSize: "13px",
                          fontWeight: "bold",
                          color: "#fff",
                          background: "#002060",
                        }}
                      >
                        Contract for Overseas Relocation Services
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="row">
                  <div class="half-col">
                    <table style={{ width: "100%" }}>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "30%",
                              padding: "5px",
                            }}
                          >
                            <b>Customer Name:</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "70%",
                              padding: "5px",
                            }}
                          >
                            {FromContactName}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "30%",
                              padding: "5px",
                            }}
                          >
                            <b>Origin City:</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "70%",
                              padding: "5px",
                            }}
                          >
                            {this.state.fromCity} - {this.state.FromZipCode}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "30%",
                              padding: "5px",
                            }}
                          >
                            <b>Phone:</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "70%",
                              padding: "5px",
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
                              width: "30%",
                              padding: "5px",
                            }}
                          >
                            <b>Est. Volume:</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "70%",
                              padding: "5px",
                            }}
                          >
                            {this.state.totalCFT} Cft.
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "30%",
                              padding: "5px",
                            }}
                          >
                            <b>Commodity:</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "70%",
                              padding: "5px",
                            }}
                          >
                            HHG
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "40%",
                              padding: "5px",
                            }}
                            class="mobile-align-left"
                          >
                            <b>Insurance:</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "60%",
                              padding: "5px",
                            }}
                          >
                            {this.state.isVisible
                              ? "Movers Liability"
                              : InsuranceType}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="half-col">
                    <table style={{ width: "100%" }}>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "40%",
                              padding: "5px",
                              textAlign: "right",
                            }}
                            class="mobile-align-left"
                          >
                            <b>Quote Ref.:</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "60%",
                              padding: "5px",
                            }}
                          >
                            {this.state.TrackingNumber}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "40%",
                              padding: "5px",
                              textAlign: "right",
                            }}
                            class="mobile-align-left"
                          >
                            <b>Delivery City:</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "60%",
                              padding: "5px",
                            }}
                          >
                            {this.state.toCity} - {this.state.ToZipCode}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "40%",
                              padding: "5px",
                              textAlign: "right",
                            }}
                            class="mobile-align-left"
                          >
                            <b>Email Id:</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "60%",
                              padding: "5px",
                            }}
                          >
                            <a href="#">{this.state.FromEmail}</a>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "40%",
                              padding: "5px",
                              textAlign: "right",
                            }}
                            class="mobile-align-left"
                          >
                            <b>Container Type:</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "60%",
                              padding: "5px",
                            }}
                          >
                            {this.state.SubServiceName.value}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "40%",
                              padding: "5px",
                              textAlign: "right",
                            }}
                            class="mobile-align-left"
                          >
                            <b>Mode:</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "60%",
                              padding: "5px",
                            }}
                          >
                            {this.state.ShipmentType.value}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "30%",
                              padding: "5px",
                              textAlign: "right",
                            }}
                          >
                            <b>Managed By:</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #000",
                              width: "70%",
                              padding: "5px",
                            }}
                          >
                            {DocumentManagedBy}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div class="table-responsive">
                <table style={{ width: "100%", marginTop: "20px" }}>
                  <tbody>
                    <tr>
                      <td
                        colSpan="2"
                        style={{
                          fontWeight: "bold",
                          padding: "5px",
                          border: "1px solid #000",
                          background: "#ffc000",
                        }}
                      >
                        DESCRIPTION OF SERVICES
                      </td>
                      <td
                        style={{
                          fontWeight: "bold",
                          padding: "5px",
                          border: "1px solid #000",
                          background: "#ffc000",
                          textAlign: "right",
                          width: "15%",
                        }}
                        class="mobile-wd-30"
                      >
                        COST (IN USD)
                      </td>
                    </tr>
                    {this.renderInvoice()}
                    <tr>
                      <td
                        colSpan="2"
                        style={{
                          fontWeight: "bold",
                          padding: "5px",
                          textAlign: "right",
                          border: "1px solid #000",
                          background: "#ffc000",
                        }}
                      >
                        TOTAL
                      </td>
                      <td
                        style={{
                          fontWeight: "bold",
                          padding: "5px",
                          border: "1px solid #000",
                          background: "#ffc000",
                          textAlign: "right",
                          width: "15%",
                        }}
                      >
                        $ {parseFloat(this.state.TotalInvoiceCost).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="table-responsive">
                <table style={{ width: "100%", marginTop: "20px" }}>
                  <tbody>
                    <tr>
                      <td
                        colSpan="2"
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                          padding: "5px",
                          fontSize: "13px",
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
                    <tr>
                      <td
                        style={{
                          fontWeight: "bold",
                          padding: "5px",
                          border: "1px solid #000",
                          background: "#ffc000",
                          width: "50%",
                        }}
                      >
                        Inclusions
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "50%", border: "1px solid #000" }}>
                        <ul class="icon-list">
                          {this.renderInclusionsListShow()}
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          fontWeight: "bold",
                          padding: "5px",
                          border: "1px solid #000",
                          background: "#ffc000",
                          width: "50%",
                        }}
                      >
                        Exclusions (If Applicable)
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "50%", border: "1px solid #000" }}>
                        <ul class="icon-list">
                          {this.renderExclusionsListShow()}
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div id="footer-1" class="footer">
                <div class="f-box">
                  <span>
                    Initial Here:{" "}
                    <input
                      disabled={this.state.hideIntital}
                      onChange={(e) => this.intialHereChange(e, 1)}
                      maxlength="10"
                    />
                  </span>
                </div>
                <div onClick={() => this.scrolldiv(2)} className="flag-label">
                  <span>Sign</span>
                </div>
                <div class="f-box-middle">
                  <b>SFL WORLDWIDE LLC | FMC License No.: 025184</b>
                </div>
                <div class="f-box right">
                  <span>
                    Page <b>1</b> of <b>{outofPageCount}</b>
                  </span>
                </div>
              </div>
            </div>

            <div class="contaract-table-page page">
              <div class="header">
                <div class="logo">
                  <a href="https://www.sflworldwide.com/" target="_blank">
                    <img src="https://www.sflworldwide.com/wp-content/uploads/2019/05/logo.png" />
                  </a>
                  <div class="desktop-none">
                    3364 Garden Brook Drive, Farmers Branch, Texas – 75234
                    <br />
                    Phone: 972-255-7447 Fax: 877-741-3134
                    <br />
                  </div>
                </div>
                <div class="header-right">
                  <div class="mobile-none">
                    3364 Garden Brook Drive, Farmers Branch, Texas – 75234
                    <br />
                    Phone: 972-255-7447 Fax: 877-741-3134
                    <br />
                  </div>
                  contact@sflworldwide.com | www.SFLWorldwide.com
                  <br />
                  <b>Negotiated Rate Arrangements</b>
                </div>
              </div>

              <div class="table-responsive">
                <table style={{ width: "100%", marginTop: "20px" }}>
                  <tbody>
                    <tr>
                      <td
                        colSpan="2"
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                          padding: "5px",
                          fontSize: "13px",
                          fontWeight: "bold",
                          color: "#fff",
                          background: "#002060",
                        }}
                      >
                        Moving Insurance options
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan="2"
                        style={{
                          fontWeight: "bold",
                          padding: "5px",
                          border: "1px solid #000",
                          background: "#ffc000",
                          textAlign: "left",
                        }}
                      >
                        Movers Liability Coverage
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          width: "80%",
                        }}
                      >
                        All licensed movers have a standard liability of 60
                        cents per pound per article. For example, if a 50–pound
                        article is damaged as a result of a move, the mover is
                        required to reimburse you $30 (50 lbs. X 0.60 = $30).
                        You can obtain additional insurance to protect your
                        items.
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          textAlign: "right",
                          width: "20%",
                        }}
                      >
                        <span class="nowrap">
                          Premium: <b>$ 0</b>
                        </span>
                        <br />
                        <span class="nowrap">
                          Deductible: <b>$ 0</b>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan="2"
                        style={{
                          fontWeight: "bold",
                          padding: "5px",
                          border: "1px solid #000",
                          background: "#ffc000",
                          textAlign: "left",
                        }}
                      >
                        Selective Insurance Coverage
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          width: "80%",
                        }}
                      >
                        Under Selective Risk Insurance shipper can insurance
                        selective item(s) and does not need to take insurance on
                        entire shipment. Your selective item(s) is covered
                        against risks such as breakage, damage, theft, fire,
                        earthquake, collision, accidents, etc. Shipment packed
                        by owner is not covered under Selective Risk Insurance.
                        If the shipment is Packed by owner and required
                        repacking at our warehouse; selective risk insurance
                        will be activated from SFL Worldwide warehouse once
                        items are inspected and repacked professionally.
                        Shipment will be covered at current value and does not
                        cover shipping charges, packing charges, customs duty
                        etc. It is shipper responsibility to review and accept
                        terms and condition offered under Selective Insurance or
                        selects any other insurance provider if needed.
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          textAlign: "right",
                          width: "20%",
                        }}
                      >
                        <span class="nowrap">
                          Premium: <b>5 %</b>
                        </span>
                        <br />
                        <span class="nowrap">
                          Deductible: <b>$ 250</b>
                        </span>
                        <br />
                        <span class="nowrap">
                          Minimum: <b>$ 50</b>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan="2"
                        style={{
                          fontWeight: "bold",
                          padding: "5px",
                          border: "1px solid #000",
                          background: "#ffc000",
                          textAlign: "left",
                        }}
                      >
                        All Risk Insurance Coverage{" "}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          width: "80%",
                        }}
                      >
                        Your shipment is covered against risks such as breakage,
                        damage, theft, fire, earthquake, collision, accidents,
                        etc. Shipment packed by owner is not covered under All
                        Risk Insurance. If the shipment is Packed by owner and
                        required repacking at our warehouse; all risk insurance
                        will be activated from SFL Worldwide warehouse once
                        items are inspected and repacked professionally.
                        Shipment will be covered at current value and does not
                        cover shipping charges, packing charges, customs duty
                        etc. It is shipper responsibility to review and accept
                        terms and condition offered by the insurance company or
                        selects any other insurance provider if needed.
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          textAlign: "right",
                          width: "20%",
                        }}
                      >
                        <span class="nowrap">
                          Premium: <b>3 %</b>
                        </span>
                        <br />
                        <span class="nowrap">
                          Deductible: <b>$ 1000</b>
                        </span>
                        <br />
                        <span class="nowrap">
                          Minimum: <b>$ 300</b>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="table-responsive">
                <table style={{ width: "100%", marginTop: "20px" }}>
                  <tbody>
                    <tr>
                      <td
                        colSpan="2"
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                          padding: "5px",
                          fontSize: "13px",
                          fontWeight: "bold",
                          color: "#fff",
                          background: "#002060",
                        }}
                      >
                        Documentation Requirement
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          fontWeight: "bold",
                          padding: "5px",
                          border: "1px solid #000",
                          background: "#ffc000",
                          width: "50%",
                        }}
                      >
                        Foreign Passport Holder(s)
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "50%", border: "1px solid #000" }}>
                        <ul class="icon-list">
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
                    </tr>
                    <tr>
                      <td
                        style={{
                          fontWeight: "bold",
                          padding: "5px",
                          border: "1px solid #000",
                          background: "#ffc000",
                          width: "50%",
                        }}
                      >
                        Indian Passport Holder(s)
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "50%", border: "1px solid #000" }}>
                        <ul class="icon-list">
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
                    </tr>
                    <tr>
                      <td
                        style={{
                          fontWeight: "bold",
                          padding: "5px",
                          border: "1px solid #000",
                          background: "#ffc000",
                          width: "50%",
                        }}
                      >
                        Documents Required at Destination
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "50%", border: "1px solid #000" }}>
                        <ul class="icon-list">
                          <li>Original Passport</li>
                          <li>OCI / PIO Card, if holding foreign passport</li>
                          <li>
                            Signature on Customs forms that will be provided by
                            us
                          </li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div id="footer-2" class="footer">
                <div class="f-box">
                  <span>
                    Initial Here:{" "}
                    <input
                      disabled={this.state.hideIntital}
                      onChange={(e) => this.intialHereChange(e, 2)}
                      maxlength="10"
                    />
                  </span>
                </div>
                <div onClick={() => this.scrolldiv(3)} className="flag-label">
                  <span>Sign</span>
                </div>
                <div class="f-box-middle">
                  <b>SFL WORLDWIDE LLC | FMC License No.: 025184</b>
                </div>
                <div class="f-box right">
                  <span>
                    Page <b>2</b> of <b>{outofPageCount}</b>
                  </span>
                </div>
              </div>
            </div>
            {InsuranceWaiver === "Yes" ? (
              <div class="contaract-table-page page">
                <div class="header">
                  <div class="logo">
                    <a href="https://www.sflworldwide.com/" target="_blank">
                      <img src="https://www.sflworldwide.com/wp-content/uploads/2019/05/logo.png" />
                    </a>
                    <div class="desktop-none">
                      3364 Garden Brook Drive, Farmers Branch, Texas – 75234
                      <br />
                      Phone: 972-255-7447 Fax: 877-741-3134
                      <br />
                    </div>
                  </div>
                  <div class="header-right">
                    <div class="mobile-none">
                      3364 Garden Brook Drive, Farmers Branch, Texas – 75234
                      <br />
                      Phone: 972-255-7447 Fax: 877-741-3134
                      <br />
                    </div>
                    contact@sflworldwide.com | www.SFLWorldwide.com
                    <br />
                    <b>Negotiated Rate Arrangements</b>
                  </div>
                </div>

                <div class="ins-wai-outer">
                  <div class="table-responsive">
                    <table style={{ width: "100%", marginTop: "20px" }}>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #000",
                              textAlign: "center",
                              padding: "5px",
                              fontSize: "20px",
                              fontWeight: "bold",
                              color: "#fff",
                              background: "#002060",
                            }}
                          >
                            Insurance Waiver
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              padding: "5px",
                              border: "1px solid #002060",
                              fontSize: "16px",
                              marginTop: "20px",
                            }}
                          >
                            I hereby agree to waive all insurance coverage
                            insurance offered by SFL Worldwide. I understand
                            that any damage incurred during transit or loss of
                            individual packages or loss of the entire shipment
                            will not be covered by SFL Worldwide, or any party
                            affiliated with the handling of my shipment. By
                            signing this form, I waive all rights to
                            subrogation.
                            <span
                              style={{
                                width: "100%",
                                display: "inline-block",
                                height: "600px",
                              }}
                            ></span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div id={"footer-3"} class="footer">
                  <div class="f-box">
                    <span>
                      Initial Here:{" "}
                      <input
                        disabled={this.state.hideIntital}
                        onChange={(e) => this.intialHereChange(e, 4)}
                        maxlength="10"
                      />
                    </span>
                  </div>
                  <div onClick={() => this.scrolldiv(4)} className="flag-label">
                    <span>Sign</span>
                  </div>
                  <div class="f-box-middle">
                    <b>SFL WORLDWIDE LLC | FMC License No.: 025184</b>
                  </div>
                  <div class="f-box right">
                    <span>
                      Page <b>{3}</b> of <b>{outofPageCount}</b>
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            <div class="contaract-table-page page">
              <div class="header">
                <div class="logo">
                  <a href="https://www.sflworldwide.com/" target="_blank">
                    <img src="https://www.sflworldwide.com/wp-content/uploads/2019/05/logo.png" />
                  </a>
                  <div class="desktop-none">
                    3364 Garden Brook Drive, Farmers Branch, Texas – 75234
                    <br />
                    Phone: 972-255-7447 Fax: 877-741-3134
                    <br />
                  </div>
                </div>
                <div class="header-right">
                  <div class="mobile-none">
                    3364 Garden Brook Drive, Farmers Branch, Texas – 75234
                    <br />
                    Phone: 972-255-7447 Fax: 877-741-3134
                    <br />
                  </div>
                  contact@sflworldwide.com | www.SFLWorldwide.com
                  <br />
                  <b>Negotiated Rate Arrangements</b>
                </div>
              </div>

              <div class="table-responsive">
                <table style={{ width: "100%", marginTop: "20px" }}>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                          padding: "5px",
                          fontSize: "13px",
                          fontWeight: "bold",
                          color: "#fff",
                          background: "#002060",
                        }}
                      >
                        Terms & Conditions
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{ padding: "5px", border: "1px solid #002060" }}
                      >
                        <b>
                          Shipper's presence in India when the shipment reaches
                          is mandatory. If the shipper has not arrived into
                          India or has to travel out again when the shipment
                          reaches, we cannot clear it and additional charges may
                          incur. We would need Original Passport along with
                          Customer's Signatures on Custom Documentation which
                          will be provided by SFL Worldwide as without this
                          document we won't able to clear shipment from customs
                          and additional charges will incur which SFL Worldwide
                          will not be liable for
                        </b>
                        <br />
                        <br />
                        <b>Transit Times:</b> Standard transit time would be 3
                        to 4 Months unforeseen any delays outside our control.
                        SFL Worldwide would not be able to control any delays on
                        account of the shipping lines as they do not fully
                        disclose to us the reasons for the delayed arrival.
                        These can typically be attributed to adverse weather
                        conditions, port congestion, and vessel maintenance or
                        in some instances delayed departure at the origin. SFL
                        Worldwide will not be responsible for any delays caused
                        due to customs clearance procedure.
                        <br />
                        <br />
                        <b>Palletization:</b> Palletizing is done for the
                        protection of your cargo and adds up to 30% the volume
                        of your shipment, please factor this in your
                        calculation, Palletization volume cannot be estimated
                        until actual measurement is done.
                        <br />
                        <br />
                        <b>Our Liability:</b> SFL Worldwide is only liable for
                        loss of entire package or article that is expressly
                        stated in the household goods descriptive inventory and
                        may occur while your shipment is in our physical
                        possession. Our maximum liability for such loss is
                        limited to an amount not exceeding $0.60 per pound
                        package. For items Packed by owner, SFL Worldwide will
                        not be liable for any damage or missing content inside
                        any package or article and our liability only covers if
                        entire box/package is missing. We are not liable for
                        loss or damage that may occur after the shipment leaves
                        our physical possession.
                        <br />
                        <br />
                        An optional extended protection plan for your household
                        goods, personal effects and automobiles moving by land,
                        sea and/or air is available subject to your application,
                        acceptance, payment of premiums and compliance with the
                        terms and conditions of our 3rd party insurance
                        underwriter at least 4 days prior to the pickup of your
                        shipment. SFL Worldwide, LLC does recommend that you
                        purchase an extended protection plan for your shipment.
                        <br />
                        <br />
                        If the shipment arrives at the warehouse in damaged
                        condition, we can either return shipment back to the
                        shipper or dispose shipment at written confirmation from
                        the shipper. Depending upon the option selected to and
                        from shipping charges and disposal fees will be applied.
                        SFL Worldwide is not liable for any damage of loss of
                        the shipment arrived in damaged conditional at SFL or
                        its authorized receiving center. If your shipment does
                        not arrive within 3 weeks from pickup date to our
                        warehouse or we are not able to trace the part or full
                        shipment, SFL Worldwide will compensate under Movers
                        Liability Coverage. <br />
                        <br />
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
                        <br />
                        <br />
                        <b>Payment Terms:</b> All charges, as above must be paid
                        by check or wire transfer within seven days from the
                        receipt of our trade invoice after pickup of your
                        shipment. Credit Card will be only accepted for payment
                        under $500.00 and credit card fees will be charged at 3%
                        if payment is being made by Credit Card. If payment is
                        not made by due date late fees of $35.00 and interest of
                        14.99 % per annum will be applied.
                        <br />
                        <br />
                        <b>Weight Limit:</b> You are allowed to keep the weight
                        equal to the dimensional weight of the box. For Example:
                        If you are using a box with dimension 18x18x24 Inches,
                        so the dimensional weight of this box is 56lbs therefore
                        you can fill this box up to 56 lbs. Here if the actual
                        weight exceeds the allowed limit you will be charged as
                        $2/lb. for additional Lbs. If any of your box is more
                        than 50lbs then there will be additional Charge of
                        $25.00 for that particular box for Over Weight Charges.
                        <br />
                        <br />
                        Overseas shipping entails handling of cargo multiple
                        times and therefore standard boxes do not have the
                        quality or cardboard strength to sustain all the
                        handling. You must buy Double Walled or Heavy-Duty boxes
                        to ship your belongings which is easily available from
                        Home Depot or Lowes Stores. If boxes are received in
                        damaged condition to our warehouse additional $ 15.00
                        repacking charges per box will be applied to repack
                        damaged boxes.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div
                id={InsuranceWaiver === "Yes" ? "footer-4" : "footer-3"}
                class="footer"
              >
                <div class="f-box">
                  <span>
                    Initial Here:{" "}
                    <input
                      disabled={this.state.hideIntital}
                      onChange={(e) => this.intialHereChange(e, 3)}
                      maxlength="10"
                    />
                  </span>
                </div>
                <div
                  onClick={() =>
                    this.scrolldiv(InsuranceWaiver === "Yes" ? 5 : 4)
                  }
                  className="flag-label"
                >
                  <span>Sign</span>
                </div>
                <div class="f-box-middle">
                  <b>SFL WORLDWIDE LLC | FMC License No.: 025184</b>
                </div>
                <div class="f-box right">
                  <span>
                    Page <b>{InsuranceWaiver === "Yes" ? 4 : 3}</b> of{" "}
                    <b>{outofPageCount}</b>
                  </span>
                </div>
              </div>
            </div>

            <div class="contaract-table-page page">
              <div class="header">
                <div class="logo">
                  <a href="https://www.sflworldwide.com/" target="_blank">
                    <img src="https://www.sflworldwide.com/wp-content/uploads/2019/05/logo.png" />
                  </a>
                  <div class="desktop-none">
                    3364 Garden Brook Drive, Farmers Branch, Texas – 75234
                    <br />
                    Phone: 972-255-7447 Fax: 877-741-3134
                    <br />
                  </div>
                </div>
                <div class="header-right">
                  <div class="mobile-none">
                    3364 Garden Brook Drive, Farmers Branch, Texas – 75234
                    <br />
                    Phone: 972-255-7447 Fax: 877-741-3134
                    <br />
                  </div>
                  contact@sflworldwide.com | www.SFLWorldwide.com
                  <br />
                  <b>Negotiated Rate Arrangements</b>
                </div>
              </div>
              {/* {MovingBackToIndia ?  */}
              <div class="table-responsive">
                <table style={{ width: "100%", marginTop: "20px" }}>
                  <tbody>
                    <tr>
                      <td
                        colSpan="2"
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                          padding: "5px",
                          fontSize: "13px",
                          fontWeight: "bold",
                          color: "#fff",
                          background: "#002060",
                        }}
                      >
                        Transfer of Residence Questionnaire
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          width: "50%",
                        }}
                      >
                        Are you Moving back to India?
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          textAlign: "left",
                          width: "50%",
                        }}
                      >
                        {MovingBackToIndia ? "Yes" : "No"}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          width: "50%",
                        }}
                      >
                        Your Name as per passport?
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          textAlign: "left",
                          width: "50%",
                        }}
                      >
                        {MovingBackToIndia ? NameAsPerPassport : NAText}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          width: "50%",
                        }}
                      >
                        How many years stayed outside India?
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          textAlign: "left",
                          width: "50%",
                        }}
                      >
                        {MovingBackToIndia ? YearsOutsideIndia : NAText}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          width: "50%",
                        }}
                      >
                        Stayed in India for more than 6 months in last 2 years?
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          textAlign: "left",
                          width: "50%",
                        }}
                      >
                        {MovingBackToIndia ? StayInIndia : NAText}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          width: "50%",
                        }}
                      >
                        Have you applied for TR in last 3 years?
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          textAlign: "left",
                          width: "50%",
                        }}
                      >
                        {MovingBackToIndia ? AppliedForTR : NAText}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          width: "50%",
                        }}
                      >
                        Will Provide Original Passport for Custom Clearance?
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          textAlign: "left",
                          width: "50%",
                        }}
                      >
                        {MovingBackToIndia ? AbleToProvidePassport : NAText}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          width: "50%",
                        }}
                      >
                        Your latest arrival date in India?
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          textAlign: "left",
                          width: "50%",
                        }}
                      >
                        {MovingBackToIndia
                          ? LatestArrivalDate
                            ? moment(LatestArrivalDate).format(
                                CommonConfig.dateFormat.dateOnly
                              )
                            : ""
                          : NAText}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          width: "50%",
                        }}
                      >
                        Arriving in India with?
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          textAlign: "left",
                          width: "50%",
                        }}
                      >
                        {MovingBackToIndia ? ArrivalCategory : NAText}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          width: "50%",
                        }}
                      >
                        Validity Date
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "5px",
                          textAlign: "left",
                          width: "50%",
                        }}
                      >
                        {MovingBackToIndia
                          ? VisaValidDate
                            ? moment(VisaValidDate).format(
                                CommonConfig.dateFormat.dateOnly
                              )
                            : ""
                          : NAText}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* :
                    null
                } */}

              <div class="table-responsive">
                <table style={{ width: "100%", marginTop: "20px" }}>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          border: "1px solid #000",
                          textAlign: "center",
                          padding: "5px",
                          fontSize: "13px",
                          fontWeight: "bold",
                          color: "#fff",
                          background: "#002060",
                        }}
                      >
                        Your rights and responsibilities
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{ padding: "5px", border: "1px solid #002060" }}
                      >
                        <ul class="icon-list">
                          <li>
                            Our House Bill of Lading is the title to your cargo.
                          </li>
                          <li>
                            By signing this contract, you agree that our
                            Household Goods Descriptive Inventory is the
                            official document that contains the pickup date,
                            delivery date, quantity and description of your
                            packages shipped and received.
                          </li>
                          <li>
                            You agree to denote damages to items during packing
                            or loading at the origin in our Household Goods
                            Descriptive Inventory prior to signing and dating at
                            the origin.
                          </li>
                          <li>
                            You agree to denote any missing or damaged packages
                            along with your signature upon delivery of your
                            shipment in our Household Goods Descriptive
                            Inventory prior to signing and dating at the
                            destination.
                          </li>
                          <li>
                            In the event that your shipment is not delivered in
                            whole, you agree to submit your claim in writing to
                            us within 120 days after pickup. We will attempt to
                            locate your shipment within 4 weeks of receiving
                            your written claim. If we are unable to locate your
                            shipment in four weeks and if you have purchased an
                            extended protection plan with us, we will file a
                            claim with the insurance company during the fifth
                            week. If you have not purchased an extended
                            protection plan or if your claim is denied by the
                            insurance company you will be compensated per Movers
                            Liability stated above.
                          </li>
                          <li>
                            In the event that your shipment is delivered in part
                            or in the case of any damages, you agree to submit
                            your claim in writing to us within 7 days after
                            delivery. You agree to denote the missing / damaged
                            packages in our Household Goods Descriptive
                            Inventory during delivery. Upon receipt of your
                            written claim and if you have purchased an All-Risk
                            insurance extended protection plan with us, we will
                            file a claim with the insurance company. If you have
                            not purchased All Risk Insurance or if your
                            insurance claim is denied by the insurance company
                            you will be compensated per Movers Liability stated
                            above.
                          </li>
                          <li>
                            You may address your claim to SFL Worldwide at
                            contact@sflworldwide.com or By Faxing at
                            1-888-609-0778
                          </li>
                          <li>
                            Please confirm acceptance of this proposal by
                            signing and returning this proposal along with
                            booking deposit USD 250.00 so that we can lock the
                            rates and process your booking. Balance Payment is
                            due in full upon receipt of our Invoice which will
                            be sent after pickup of your shipment.
                          </li>
                          <li>
                            Service provided pursuant to this NVOCC Negotiated
                            Rate Arrangement (NRA) is subject to Carrier's
                            governing rules tariff, which is accessible at
                            www.dpiusa.com in compliance with FMC Regulations as
                            provided in 46 CFR 532.7.”
                          </li>
                          <li>
                            Any legal disputes will be subject to the
                            jurisdiction of Texas State Law where SFL Worldwide
                            LLC is registered.
                          </li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="table-responsive">
                <table style={{ width: "100%" }}>
                  <tr>
                    <td
                      style={{
                        padding: "15px 5px 15px 5px",
                        border: "1px solid #002060",
                        textAlign: "center",
                      }}
                    >
                      <b>SFL Worldwide LLC</b>
                      <br />
                      <br />
                      3364 Garden Brook Drive,
                      <br />
                      Farmers Branch, TX - 75234
                      <br />
                      Website: www.SFLWorldwide.com | Phone: 1-800-691-2335
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        textAlign: "center",
                        padding: "5px",
                        fontSize: "13px",
                        fontWeight: "bold",
                        color: "#fff",
                        background: "#002060",
                      }}
                    >
                      Signature Confirmation{" "}
                      <i style={{ fontWeight: "normal" }}>
                        (Please sign when ready to confirm):
                      </i>
                    </td>
                  </tr>
                </table>
              </div>

              <div class="signature-box">
                <div className="flag-label">
                  <span>Click Here</span>
                </div>
                <div class="sign">
                  <div className="payable-radio-common">
                    <RadioGroup
                      aria-label="Status"
                      name="Status"
                      value={SignType}
                      row
                      onChange={(e) => this.handleCommonRadio(e)}
                    >
                      <FormControlLabel
                        value="Esign"
                        control={<Radio />}
                        label="Esign"
                      />
                      <FormControlLabel
                        value="Type"
                        control={<Radio />}
                        label="Type"
                      />
                    </RadioGroup>
                  </div>
                  {SignType === "Type" ? (
                    <input
                      className="signpad-input"
                      value={this.state.signname}
                      onChange={(e) => this.nameSignChange(e)}
                      maxlength="10"
                    />
                  ) : (
                    <SignatureCanvas
                      penColor="black"
                      ref={(ref) => {
                        this.sigPad = ref;
                      }}
                      onBegin={(e) => this.signChange(e)}
                      // onEnd={(e)=> this.signChange(e,"End")}
                      canvasProps={{
                        width: 230,
                        height: 150,
                        className: "sigCanvas",
                      }}
                    />
                  )}
                  <span>
                    <Button onClick={() => this.clear()} color="secondary">
                      Clear
                    </Button>
                    <Button color="primary" onClick={() => this.trim()}>
                      Submit
                    </Button>
                  </span>
                  <div
                    id="canvas-div"
                    style={{ display: "none", width: 230, height: 150 }}
                  >
                    <canvas className="canvas-outline" id="textCanvas"></canvas>
                  </div>
                  <span>Customer Signature</span>
                </div>
                <div class="date">
                  <p>{moment().format(CommonConfig.dateFormat.dateOnly)}</p>
                  <span>Date</span>
                </div>
                <div class="pr-user">
                  <p>{DocumentManagedBy}</p>
                  <span>Working on Proposal</span>
                </div>
              </div>

              <div
                id={InsuranceWaiver === "Yes" ? "footer-5" : "footer-4"}
                class="footer"
              >
                <div class="f-box"></div>
                <div class="f-box-middle">
                  <b>SFL WORLDWIDE LLC | FMC License No.: 025184</b>
                </div>
                <div class="f-box right">
                  <span>
                    Page <b>{InsuranceWaiver === "Yes" ? 5 : 4}</b> of{" "}
                    <b>{outofPageCount}</b>
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Dialog
                open={OpenSignPad}
                className="signpad-dialog"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">Signature</DialogTitle>
                <DialogContent>
                  <div className="payable-radio-common">
                    <RadioGroup
                      aria-label="Status"
                      name="Status"
                      value={SignType}
                      row
                      onChange={(e) => this.handleCommonRadio(e)}
                    >
                      <FormControlLabel
                        value="Esign"
                        control={<Radio />}
                        label="Esign"
                      />
                      <FormControlLabel
                        value="Type"
                        control={<Radio />}
                        label="Type"
                      />
                    </RadioGroup>
                  </div>
                  {SignType === "Type" ? (
                    <input
                      className="signpad-input"
                      value={this.state.signname}
                      onChange={(e) => this.nameSignChange(e)}
                      maxlength="10"
                    />
                  ) : (
                    <SignatureCanvas
                      penColor="black"
                      ref={(ref) => {
                        this.sigPad = ref;
                      }}
                      onBegin={(e) => this.signChange(e)}
                      // onEnd={(e)=> this.signChange(e,"End")}
                      canvasProps={{
                        width: 230,
                        height: 150,
                        className: "sigCanvas",
                      }}
                    />
                  )}
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() =>
                      this.setState({
                        OpenSignPad: false,
                      })
                    }
                    color="secondary"
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => this.clear()} color="secondary">
                    Clear
                  </Button>
                  {!this.state.hideIntital && this.state.ShowContra ? (
                    <Button
                      onClick={() => this.saveSign()}
                      color="primary"
                      autoFocus
                    >
                      Save
                    </Button>
                  ) : null}
                </DialogActions>
              </Dialog>
            </div>
            <div className="shipment-submit">
              <div className="right">
                {!this.state.hideIntital && this.state.ShowContra ? (
                  <Button color="primary" onClick={() => this.trim()}>
                    Submit
                  </Button>
                ) : null}
              </div>
            </div>
          </>
        ) : showAlreadyExpired ? (
          <div className="contract-expire-outer">
            <a href="https://www.sflworldwide.com/" target="_blank">
              <img src="https://hubapi.sflworldwide.com/document/SFL_logo_white.png" />
            </a>
            <div className="ct-expire-box">
              <h3>Contract Expired</h3>
              <p>This contract is already expired on {ExpiredOnDate}.</p>
              <p>For more information please contact :</p>
              <p className="mb-0">{ManagedByName}</p>
              <p className="mb-0">
                <a href={`mailto:` + ManagedByEmail}>{ManagedByEmail}</a>
              </p>
              <p>{SFLContactNumber}</p>
            </div>
          </div>
        ) : showAlreadySigned ? (
          <div className="contract-expire-outer">
            <a href="https://www.sflworldwide.com/" target="_blank">
              <img src="https://hubapi.sflworldwide.com/document/SFL_logo_white.png" />
            </a>
            <div className="ct-expire-box">
              <h3>Contract Signed</h3>
              <p>This contract is already signed on {SignedOnDate}.</p>
              <p>For more information please contact :</p>
              <p className="mb-0">{ManagedByName}</p>
              <p className="mb-0">
                <a href={`mailto:` + ManagedByEmail}>{ManagedByEmail}</a>
              </p>
              <p>{SFLContactNumber}</p>
            </div>
          </div>
        ) : showConfirmationPage ? (
          <div className="contract-expire-outer">
            <a href="https://www.sflworldwide.com/" target="_blank">
              <img src="https://hubapi.sflworldwide.com/document/SFL_logo_white.png" />
            </a>
            <div className="ct-expire-box">
              <h3>Contract Signed Successfully</h3>
              <p>
                This Contract is signed successfully on {SignDate}. Please check
                you email for copy of signed contract.
              </p>
              <p>For more information please contact :</p>
              <p className="mb-0">{ManagedByName}</p>
              <p className="mb-0">
                <a href={`mailto:` + ManagedByEmail}>{ManagedByEmail}</a>
              </p>
              <p>{SFLContactNumber}</p>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
export default esign_client_temp;
