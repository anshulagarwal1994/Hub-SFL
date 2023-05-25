import React from "react";
import PropTypes from "prop-types";
// core components
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Datetime from "react-datetime";
import Tooltip from "@material-ui/core/Tooltip";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import InfoIcon from "@material-ui/icons/Info";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Icon from "@material-ui/core/Icon";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import SimpleBackdrop from "../../utils/general";
import _ from "lodash";
// import $ from 'jquery';
import CardIcon from "components/Card/CardIcon.js";
import cogoToast from "cogo-toast";
import FlightTakeoff from "@material-ui/icons/FlightTakeoff";
import ReactTable from "react-table";
import CardBody from "components/Card/CardBody.js";
import moment from "moment";
import api from "../../utils/apiClient";
import FormControl from "@material-ui/core/FormControl";
import { fileBase } from "../../utils/config";
import { CommonConfig } from "utils/constant.js";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";

var creditCardType = require("credit-card-type");
var valid = require("card-validator");

const useStyles = () => makeStyles(styles);
const classes = useStyles();

class MyShipmentNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Steps: [
        {
          stepName: "Customer Details",
          stepId: "customerdetails",
          classname: "active",
        },
        { stepName: "Package", stepId: "package", classname: "inactive" },
        {
          stepName: "Commercial Inv.",
          stepId: "commercialinvoice",
          classname: "inactive",
        },
        { stepName: "Accounts", stepId: "accounts", classname: "inactive" },
        { stepName: "Tracking", stepId: "tracking", classname: "inactive" },
        // { stepName: "Insurance & Claim", stepComponent: Step6, stepId: "Insurance&Claim" },
        {
          stepName: "Documentation",
          stepId: "documentations",
          classname: "inactive",
        },
      ],
      shipmentTypeList: [],
      ManagedBy: "",
      managedByList: [],
      TrackingNumber: "",
      ServiceType: "",
      SubServiceType: "",
      CreatedBy: "",
      ShipmentDate: "",
      ShipmentType: "",
      notes: [],
      ServiceList: [],
      SubServiceList: [],
      Subservicename: true,
      subServiceName: [],
      ServiceName: "",
      SubServiceName: "",
      ShipmentStatus: "",
      ShipmentStatusList: [],
      ContainerName: "",
      ContainerNameList: [],
      deleteopen: false,
      CountryList: [],

      TotalReceivedCost: 0,
      DatePaidOn: "",

      FromAddress: {},
      FromCompanyName: "",
      FromContactName: "",
      FromAddressLine1: "",
      FromAddressLine2: "",
      FromAddressLine3: "",
      FromZipCode: "",
      FromPhone1: "",
      FromPhone2: "",
      FromEmail: "",

      ToAddress: {},
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
      YesNo: [{ value: true, label: "Yes" }, { value: false, label: "No" }],
      FromMovingBack: false,
      FromEligibleForTR: false,
      FromOriginalPassortAvailable: false,
      fromCityAutoComplete: false,
      fromStateAutoComplete: false,
      fromGoogleAPICityList: [],
      fromStateList: [],

      toCityAutoComplete: false,
      toStateAutoComplete: false,
      toGoogleAPICityList: [],
      toStateList: [],

      fromState: "",
      fromCity: "",
      toState: "",
      toCity: "",
      PickupDate: "",
      DutiesPaidBy: "",
      LocationType: "",
      IsPickup: false,
      ReadOnly: true,
      IsDisabled: true,

      PackageList: [],
      PackageContentList: [],
      PackageType: "",
      packedBy: [
        { value: "Owner", label: "Owner" },
        { value: "Mover", label: "Mover" },
      ],
      optionYes: [{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }],
      TotalPackages: 0,

      commercialList: [],
      TotalCostCommercial: 0,

      totalCFT: 0,
      totalChargableWeight: 0,
      totalInsuredValue: 0.0,

      PaymentList: [],
      TotalCostInvoice: 0,
      TotalCostReceived: 0,
      TotalCostIssued: 0,
      paymentReceived: [],
      paymentIssued: [],
      bankList: [],
      creditCardList: [],
      ServiceDescriptionList: [],
      PaymentTypeList: [],
      VendorList: [],
      PaymentMethodType: [
        { value: "Bank", label: "Bank" },
        { value: "Credit Card", label: "Credit Card" },
      ],
      yesNo: [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
        { value: "N/A", label: "N/A" },
      ],

      Month: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
        { value: "9", label: "9" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" },
      ],

      Year: [
        { value: "2020", label: "2020" },
        { value: "2021", label: "2021" },
        { value: "2022", label: "2022" },
        { value: "2023", label: "2023" },
        { value: "2024", label: "2024" },
        { value: "2025", label: "2025" },
        { value: "2026", label: "2026" },
        { value: "2027", label: "2027" },
        { value: "2028", label: "2028" },
        { value: "2029", label: "2029" },
        { value: "2030", label: "2030" },
      ],

      trackingNumberList: [],
      trackingManualList: [],
      TrackingServiceList: [],
      DocumentTrackingList: [],
      activeInactive: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
      Attachments: [
        {
          Index: 1,
          FileName: "",
          DocumentType: "Commercial Invoice",
          Status: "Active",
          AttachmentName: "Commercial Invoice",
          TrackingNumber: "1",
          DocumentCreatedOn: moment().format(CommonConfig.dateFormat.dateOnly),
          DocumentCreatedBy: "Auto",
        },
        {
          Index: 2,
          FileName: "",
          DocumentType: "Invoice",
          AttachmentName: "Invoice",
          TrackingNumber: "2",
          Status: "Active",
          DocumentCreatedOn: moment().format(CommonConfig.dateFormat.dateOnly),
          DocumentCreatedBy: "Auto",
        },
        {
          Index: 3,
          FileName: "",
          DocumentType: "Contract",
          isGenerated: false,
          Status: "Active",
          AttachmentName: "",
          TrackingNumber: "3",
          DocumentCreatedOn: moment().format(CommonConfig.dateFormat.dateOnly),
          DocumentCreatedBy: "Auto",
        },
      ],
      Loading: false,
      objAttachment: {
        Index: 1,
        DocumentType: "",
        FileName: "",
        Status: "Active",
        DocumentCreatedOn: moment().format(CommonConfig.dateFormat.dateOnly),
        DocumentCreatedBy: CommonConfig.loggedInUserData().Name,
      },
      DocumentTypeList: [],
      AttachmentList: [],
      openpayment: false,
      status: "unpaid",
      Access: {},
      AllClear: false,
      IsChanged: false,
      confirmAllClear: false,
      PaymentShowData: {},
      FromAddressObj: {},
      ToAddressObj: {},
      CommercialInvoiceList: [],
      DocumentManagedBy: "",
      DocumentInvoiceDate: "",
      DocumentInvoiceData: [],
      IsAlreadyAESFilled: false,
      IsAESOpen: false,
      saveClicked: {
        saveClick: false,
        redirect: false,
      },
      // Moving Back India States
      visaCategoryList: [
        { value: "Indian Passport", label: "Indian Passport" },
        { value: "OCI Card", label: "OCI Card" },
        { value: "PIO Card", label: "PIO Card" },
        { value: "Visitor Visa", label: "Visitor Visa" },
      ],
      NameAsPerPassport: "",
      YearsOutsideIndia: "",
      StayInIndia: "",
      LatestArrivalDate: "",
      AppliedForTR: "",
      AbleToProvidePassport: "",
      VisaCategory: "",
      VisaValidDate: "",
      VisaCategory: "",
      movingBackIndia: "",
      movingBackIndiaErr: false,
      movingBackIndiaHelperText: "",
      nameAsperPassportErr: false,
      nameAsperPassportHelperText: "",
      stayinIndiaErr: false,
      stayinIndiaHelperText: "",
      appliedForTRErr: false,
      appliedForTRHelperText: "",
      ableToProvidePassportErr: false,
      ableToProvidePassportHelperText: "",
      indianCitizenErr: false,
      indianCitizenHelperText: "",
      visaCategoryErr: false,
      visaCategoryHelperText: "",
      visaDateErr: false,
      visaDateHelperText: "",
      arrivalDateErr: false,
      arrivalDateHelperText: "",
      yearsOutsideIndiaErr: false,
      yearsOutsideIndiaHelperText: "",
      isBackIndia: false,
      yesOrNo: [{ value: true, label: "Yes" }, { value: false, label: "No" }],
      yearsLength: [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 },
        { value: 4, label: 4 },
        { value: "5+", label: "5+" },
      ],
      UserAdditionalDetailsID: null,
      isMovingIndiaChanged: false,
      IsPackageAccess: "",
    };
  }

  async componentDidMount() {
    await this.getCountry();
    this.setState({
      Access: CommonConfig.getUserAccess("My Shipment"),
      IsDisabled:
        CommonConfig.getUserAccess("My Shipment").AllAccess === 1
          ? false
          : true,
      ReadOnly:
        CommonConfig.getUserAccess("My Shipment").DeleteAccess === 1
          ? false
          : true,
    });
    this.showLoader();
    this.showHide();
    await this.getShipmentType();
    await this.getStatusList();
    await this.getManagedBy();
    await this.getShipmentInfo();
    await this.getAddressDetails();
    await this.getAdditionalDetails();
    await this.getContainerName();
    await this.getPackageContent();
    await this.getPackageDetail();
    await this.getCommercialInvoiceDetail();
    await this.getAccountDetail();
    await this.getServiceDescription();
    await this.getpaymentType();
    await this.getVendorName();
    await this.getnotesByID();
    await this.trackingService();
    await this.getDocumentType();
    await this.getTrackingDetail();
    await this.getShipmentManualTracking();
    await this.getDocumentation();
    await this.addnewRowTrackingNumber();
  }

  async reCallApi() {
    await this.getShipmentType();
    await this.getStatusList();
    await this.getManagedBy();
    await this.getShipmentInfo();
    await this.getAddressDetails();
    await this.getAdditionalDetails();
    await this.getContainerName();
    await this.getPackageContent();
    await this.getPackageDetail();
    await this.getCommercialInvoiceDetail();
    await this.getAccountDetail();
    await this.getServiceDescription();
    await this.getpaymentType();
    await this.getVendorName();
    await this.getnotesByID();
    await this.trackingService();
    await this.getDocumentType();
    await this.getTrackingDetail();
    await this.getShipmentManualTracking();
    await this.getDocumentation();
    await this.addnewRowTrackingNumber();
  }

  showHide() {
    document.getElementById("customerdetails").style.display = "block";
    document.getElementById("package").style.display = "none";
    document.getElementById("commercialinvoice").style.display = "none";
    document.getElementById("accounts").style.display = "none";
    document.getElementById("tracking").style.display = "none";
    document.getElementById("documentations").style.display = "none";
  }

  getManagedBy() {
    try {
      api
        .get("scheduleshipment/getShipmentManagedBy")
        .then((result) => {
          this.setState({ managedByList: result.data });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  getServiceByShipmentType(serviceType) {
    try {
      let data = {
        ServiceType: serviceType,
      };
      api
        .post("userManagement/getServiceByShipmentType", data)
        .then((result) => {
          if (result.success) {
            this.setState({
              ServiceList: result.data,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  getSubserviceName(ServiceName, ShipmentType) {
    try {
      let data = {
        ServiceName: ServiceName,
        ServiceType: ShipmentType,
      };
      api
        .post("userManagement/getSubserviceName", data)
        .then((result) => {
          if (result.success) {
            this.setState({
              SubServiceList: result.data,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  getShipmentType() {
    try {
      let data = {
        stringMapType: "SHIPMENTTYPE",
      };

      api.post("stringMap/getStringMap", data).then((result) => {
          this.setState({ shipmentTypeList: result.data });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  getPackageContent = () => {
    try {
      let data = {
        stringMapType: "PACKAGECONTENT",
      };

      api
        .post("stringMap/getStringMap", data)
        .then((result) => {
          this.setState({ PackageContentList: result.data });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  };

  getDocumentType = () => {
    try {
      let data = {
        stringMapType: "DOCUMENTATIONTYPE",
        Type: "Public",
      };

      api
        .post("stringMap/getDocumentStringMap", data)
        .then((result) => {
          this.setState({ DocumentTypeList: result.data });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  };

  getStatusList = () => {
    try {
      let data = {
        stringMapType: "SHIPMENTSTATUS",
      };

      api
        .post("stringMap/getStringMap", data)
        .then((result) => {
          this.setState({ ShipmentStatusList: result.data });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  };

  getShipmentInfo() {
    try {
      let data = {
        ShippingID: this.props.location.state.ShipppingID,
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

          var containerName = {
            value: res.data[0].ContainerID,
            label: res.data[0].ContainerName,
          };

          this.setState(
            {
              ManagedBy: managedBy,
              DocumentManagedBy: res.data[0].ManagedByName,
              TrackingNumber: res.data[0].TrackingNumber,
              CreatedBy: res.data[0].CreatedBy,
              ServiceName: serviceName,
              SubServiceName: subServiceName,
              Subservicename: false,
              ShipmentDate: res.data[0].ShipmentDate,
              IsPackageAccess: !CommonConfig.isEmpty(
                res.data[0].IsPackageAccess
              )
                ? res.data[0].IsPackageAccess.data[0] === 0
                  ? false
                  : true
                : false,
              ShipmentType: shipmentType,
              ShipmentStatus: res.data[0].ShipmentStatus,
              ContainerName: containerName,
              AllClear: !CommonConfig.isEmpty(res.data[0].AllClear)
                ? res.data[0].AllClear.data[0] === 0
                  ? false
                  : true
                : false,
            },
            function() {
              this.removePackageTab();
            }
          );
          this.getServiceByShipmentType(shipmentType.value);
          this.getSubserviceName(serviceName.value, shipmentType.value);
        }
      });
    } catch (error) {
      console.log("error...", error);
    }
  }

  removePackageTab = () => {
    if (!this.state.IsPackageAccess) {
      let steps = this.state.Steps;
      let idx = steps.findIndex((x) => x.stepId === "package");
      steps.splice(idx, 1);
      this.setState({ Steps: steps });
    }
  };

  getTrackingDetail() {
    try {
      let data = {
        ShippingID: this.props.location.state.ShipppingID,
      };
      api
        .post("scheduleshipment/getShipmentTrackingDetail", data)
        .then((result) => {
          var i = 1;
          result.data.map((Obj) => {
            Obj.Index = i;
            i++;
            if (Obj.TrackingStatus === "Active") {
              let trackingID = {
                TrackingNumber: Obj.TrackingID,
                Carrier: Obj.Carrier,
              };
              this.state.DocumentTrackingList.push(trackingID);
            }
            return Obj;
          });
          this.setState({ trackingNumberList: result.data });
          if (result.data.length === 0) {
            this.addnewRowTrackingNumber();
          }
        })
        .catch((err) => {
          console.log("error......", err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  getAdditionalDetails() {
    try {
      let data = {
        ShippingID: this.props.location.state.ShipppingID,
      };

      api.post("scheduleshipment/getAdditionalDetails", data).then((res) => {
        if (res.success) {
          if (res.data.length > 0) {
            this.setState({
              movingBackIndia:
                res.data[0].MovingBackToIndia.data[0] === 0 ? false : true,
              isBackIndia:
                res.data[0].MovingBackToIndia.data[0] === 0 ? false : true,
              NameAsPerPassport: res.data[0].NameAsPerPassport,
              YearsOutsideIndia: res.data[0].YearsOutsideIndia,
              StayInIndia: res.data[0].StayInIndia.data[0] === 0 ? false : true,
              LatestArrivalDate: res.data[0].LatestArrivalDate
                ? moment(res.data[0].LatestArrivalDate).format(
                    CommonConfig.dateFormat.dateOnly
                  )
                : "",
              AppliedForTR:
                res.data[0].AppliedForTR.data[0] === 0 ? false : true,
              AbleToProvidePassport:
                res.data[0].AbleToProvidePassport.data[0] === 0 ? false : true,
              VisaValidDate: res.data[0].VisaValidDate
                ? moment(res.data[0].VisaValidDate).format(
                    CommonConfig.dateFormat.dateOnly
                  )
                : "",
              VisaCategory: res.data[0].ArrivalCategory,
              UserAdditionalDetailsID: res.data[0].UserAdditionalDetailsID,
            });
          }
        }
      });
    } catch (error) {
      console.log("error...", error);
    }
  }

  getShipmentManualTracking() {
    try {
      let data = {
        ShippingID: this.props.location.state.ShipppingID,
      };
      api
        .post("scheduleshipment/getShipmentManualTracking", data)
        .then((result) => {
          var i = 1;
          result.data.map((Obj) => {
            Obj.Index = i;
            i++;
            return Obj;
          });
          this.setState({ trackingManualList: result.data });
          if (result.data.length === 0) {
            this.addnewRowTrackingManual();
          }
        })
        .catch((err) => {
          console.log("error......", err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  getnotesByID() {
    try {
      let data = {
        ShippingID: this.props.location.state.ShipppingID,
      };
      api
        .post("scheduleshipment/getShipmentNotesByID", data)
        .then((result) => {
          var i = 0;
          result.data.map((Obj) => {
            Obj.Index = i;
            i++;
            return Obj;
          });
          result.data.map((Obj) => {
            Obj.disabled = i;
            i++;
            return Obj;
          });
          this.setState({ notes: result.data });
          this.handleAddNotesRow();
        })
        .catch((err) => {
          console.log("error......", err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  getDocumentation() {
    try {
      let data = {
        ShippingID: this.props.location.state.ShipppingID,
      };
      api
        .post("scheduleshipment/getDocumentation", data)
        .then((result) => {
          var i = 4;
          var pass = 0;
          result.data.map((Obj) => {
            var n = Obj.AttachmentPath.includes("auth/esign_client");
            Obj.Index = i;
            if (n) {
              Obj.Index = 3;
              Obj.isGenerated = true;
              Obj.TrackingNumber = "3";
              Obj.DocumentCreatedOn = moment().format(
                CommonConfig.dateFormat.dateOnly
              );
              Obj.DocumentCreatedBy = "Auto";
              this.state.Attachments.splice(2, 1);
            }
            i++;
            return Obj;
          });
          for (var k = 0; k < result.data.length; k++) {
            for (var j = 0; j < this.state.DocumentTypeList.length; j++) {
              if (
                this.state.DocumentTypeList[j].Description ===
                result.data[k].DocumentType
              ) {
                this.state.Attachments.push(result.data[k]);
              }
              if (result.data[k].DocumentType == "Passport Copy") {
                pass++;
              }
            }
          }
          if (this.state.ShipmentType.value == "Ocean" && pass == 0) {
            var data = {
              Index: i,
              FileName: "",
              DocumentType: "Passport Copy",
              Status: "Inactive",
              DateTime: new Date().getTime(),
              DocumentCreatedOn: moment().format(
                CommonConfig.dateFormat.dateOnly
              ),
              DocumentCreatedBy: "Auto",
            };
            this.state.Attachments.push(data);
          }
          // if (result.data.length === 0) {
          //   this.setState({
          //     Attachments: [
          //       ...this.state.Attachments,
          //       this.state.objAttachment,
          //     ],
          //   });
          // }
        })
        .catch((err) => {
          console.log("error......", err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  handleAddNotesRow = () => {
    var addnotes = this.state.notes.filter(
      (x) => x.Status === "Active" && (x.NoteText === null || x.NoteText === "")
    );
    if (addnotes.length === 0) {
      var todayDate = new Date();
      const note = {
        NoteText: "",
        NoteType: null,
        NoteTitle: null,
        Status: "Active",
        AttachmentID: null,
        AttachmentType: null,
        AttachmentName: null,
        CreatedOn: moment(todayDate).format(CommonConfig.dateFormat.dateTime),
        disabled: false,
        closebutton: true,
        CreatedBy: CommonConfig.loggedInUserData().PersonID,
        NoteID: null,
        CreatedByNote: CommonConfig.loggedInUserData().Name,
        AddedBy: CommonConfig.loggedInUserData().Name,
        Index: this.state.notes.length + 1,
      };
      this.setState({
        notesDisabled: false,
        notes: [...this.state.notes, note],
      });
    } else {
      cogoToast.error("Please fill above note first");
    }
  };

  handleChangeNotes = (event, idx) => {
    const { value } = event.target;
    const notes = [...this.state.notes];
    var noteIndex = notes.findIndex((x) => x.Index === idx);
    if (noteIndex !== -1) {
      notes[noteIndex]["NoteText"] = value;
      if (
        notes[noteIndex]["NoteText"] === null ||
        notes[noteIndex]["NoteText"] === ""
      ) {
        this.setState({ noteErr: true });
      } else {
        this.setState({ noteErr: false });
      }
    }
    this.setState({ notes: notes });
  };

  handleNotesRemoveRow = (Index) => {
    const removeNotes = [...this.state.notes];
    var noteIndex = this.state.notes.findIndex((x) => x.Index === Index);
    if (noteIndex !== -1) {
      removeNotes[noteIndex]["Status"] = "Inactive";
      removeNotes[noteIndex]["AttachmentStatus"] = "Inactive";
      this.setState({ notes: removeNotes });
      if (removeNotes.filter((x) => x.Status === "Active").length === 0) {
        this.handleAddNotesRow();
      }
    }
  };

  selectChange = (event, value, type) => {
    if (value != null) {
      if (type === "ServiceType") {
        this.setState({
          Subservicename: false,
          ServiceName: value,
          SubServiceName: "",
        });
        this.getSubserviceName(value.value, this.state.ShipmentType.value);
      } else if (type === "SubServiceType") {
        this.setState({ SubServiceName: value });
      } else if (type === "ManagedBy") {
        this.setState({ ManagedBy: value });
      } else if (type === "ContainerName") {
        this.setState({ ContainerName: value });
      } else if (type === "ShipmentType") {
        this.setState({
          ShipmentType: value,
          SubServiceName: "",
          ServiceName: "",
          SubServiceList: [],
        });
        this.getServiceByShipmentType(value.value);
      }
    }
  };

  viewNotes = () => {
    return this.state.notes
      .filter((x) => x.Status === "Active")
      .map((notes, idx) => {
        return (
          <tr>
            <td style={{ width: 154 }}>
              {moment(notes.CreatedOn).format(CommonConfig.dateFormat.dateTime)}
            </td>
            <td style={{ maxWidth: 600, margin: 0, height: 68, width: 600 }}>
              {notes.disabled ? (
                <p
                  id="noteText"
                  dangerouslySetInnerHTML={{
                    __html: notes.NoteText.replace(/\r?\n/g, "<br />"),
                  }}
                ></p>
              ) : (
                <div className="table-textarea">
                  <textarea
                    name="NoteText"
                    style={{ width: 650, margin: 0, height: 68 }}
                    disabled={notes.disabled}
                    value={notes.NoteText}
                    onChange={(event) =>
                      this.handleChangeNotes(event, notes.Index)
                    }
                  ></textarea>
                </div>
              )}
            </td>
            <td className="pck-action-column">
              <div className="pck-subbtn">
                {/* {this.state.DeleteAccess === 1? */}
                <Button
                  justIcon
                  color="danger"
                  className="Plus-btn "
                  onClick={() => this.handleNotesRemoveRow(notes.Index)}
                  disabled={this.state.notesDisabled}
                >
                  <i className={"fas fa-minus"} />
                </Button>
                {this.state.notes.filter((x) => x.Status === "Active")
                  .length ===
                idx + 1 ? (
                  <Button
                    justIcon
                    color="facebook"
                    onClick={() => this.handleAddNotesRow()}
                    className="Plus-btn "
                  >
                    <i className={"fas fa-plus"} />
                  </Button>
                ) : null}
                <Tooltip title={notes.CreatedByNote} arrow>
                  <Button
                    className="Plus-btn info-icon"
                    justIcon
                    color="twitter"
                  >
                    <InfoIcon />
                  </Button>
                </Tooltip>
              </div>
            </td>
          </tr>
        );
      });
  };

  navigateChange = (key) => {
    let stepsList = this.state.Steps;
    let activeIndex = stepsList.findIndex((x) => x.classname === "active");
    if (key !== activeIndex) {
      stepsList[key]["classname"] = "active";
      stepsList[activeIndex]["classname"] = "inactive";
      this.setState({ Steps: stepsList });
      let divID = stepsList[key]["stepId"];
      let activeDiv = stepsList[activeIndex]["stepId"];
      document.getElementById(divID).style.display = "block";
      document.getElementById(activeDiv).style.display = "none";
    }
  };

  disableCommercial = (PackageType) => {
    let stepsList = this.state.Steps;
    let activeIndex = stepsList.findIndex((x) => x.classname === "active");
    if (activeIndex === 2 && PackageType === "Envelop") {
      stepsList[activeIndex + 1]["classname"] = "active";
      stepsList[activeIndex]["classname"] = "Inactive";
      this.setState({ Steps: stepsList });
      let divID = stepsList[activeIndex + 1]["stepId"];
      let activeDiv = stepsList[activeIndex]["stepId"];
      document.getElementById(divID).style.display = "block";
      document.getElementById(activeDiv).style.display = "none";
    }
  };

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

  showLoader() {
    this.setState({ Loading: true });
  }

  hideLoader() {
    this.setState({ Loading: false });
  }

  getAddressDetails() {
    try {
      let data = {
        ShippingID: this.props.location.state.ShipppingID,
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
                fromCity: fromRes[0].City,
                toState: toRes[0].State,
                toCity: toRes[0].City,
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

  getContainerName = () => {
    try {
      api
        .get("scheduleshipment/getContainerName")
        .then((res) => {
          if (res.success) {
            this.setState({ ContainerNameList: res.data });
          }
        })
        .catch((err) => {
          console.log("error", err);
        });
    } catch (err) {
      console.log("error...", err);
    }
  };

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

  selectChangeTab1 = (event, value, type) => {
    if (value != null) {
      if (type === "FromCountry") {
        this.setState({
          selectedFromCountry: value,
          fromCity: "",
          fromState: "",
        });
        this.getStates(value);
      } else if (type === "ToCountry") {
        this.setState({ selectedToCountry: value, toCity: "", toState: "" });
        this.toStates(value);
      } else if (type === "MovingBack") {
        this.setState({ FromMovingBack: value });
      } else if (type === "PassportAvailable") {
        this.setState({ FromOriginalPassortAvailable: value });
      } else if (type === "EligibleTR") {
        this.setState({ FromEligibleForTR: value });
      }
    }
  };

  handleChangeFrom = (event, type) => {
    if (type === "companyname") {
      let CompanyName = event.target.value;
      this.setState({ FromCompanyName: CompanyName });
    } else if (type === "contactname") {
      let ContactName = event.target.value;
      this.setState({ FromContactName: ContactName });
    } else if (type === "address1") {
      let AddressLine1 = event.target.value;
      this.setState({ FromAddressLine1: AddressLine1 });
    } else if (type === "address2") {
      let AddressLine2 = event.target.value;
      this.setState({ FromAddressLine2: AddressLine2 });
    } else if (type === "address3") {
      let AddressLine3 = event.target.value;
      this.setState({ FromAddressLine3: AddressLine3 });
    } else if (type === "zip") {
      let ZipCode = event.target.value;
      this.setState({ FromZipCode: ZipCode });
    } else if (type === "phone1") {
      let Phone1 = event.target.value;
      if (event.target.value.length <= 15) {
        this.setState({ FromPhone1: Phone1 });
      }
    } else if (type === "phone2") {
      let Phone2 = event.target.value;
      if (event.target.value.length <= 15) {
        this.setState({ FromPhone2: Phone2 });
      }
    } else if (type === "email") {
      let Email = event.target.value;
      this.setState({ FromEmail: Email });
    }
  };

  handleChangeTo = (event, type) => {
    if (type === "companyname") {
      let CompanyName = event.target.value;
      this.setState({ ToCompanyName: CompanyName });
    } else if (type === "contactname") {
      let ContactName = event.target.value;
      this.setState({ ToContactName: ContactName });
    } else if (type === "address1") {
      let AddressLine1 = event.target.value;
      this.setState({ ToAddressLine1: AddressLine1 });
    } else if (type === "address2") {
      let AddressLine2 = event.target.value;
      this.setState({ ToAddressLine2: AddressLine2 });
    } else if (type === "address3") {
      let AddressLine3 = event.target.value;
      this.setState({ ToAddressLine3: AddressLine3 });
    } else if (type === "zip") {
      let ZipCode = event.target.value;
      this.setState({ ToZipCode: ZipCode });
    } else if (type === "phone1") {
      let Phone1 = event.target.value;
      if (event.target.value.length <= 15) {
        this.setState({ ToPhone1: Phone1 });
      }
    } else if (type === "phone2") {
      let Phone2 = event.target.value;
      if (event.target.value.length <= 15) {
        this.setState({ ToPhone2: Phone2 });
      }
    } else if (type === "email") {
      let Email = event.target.value;
      this.setState({ ToEmail: Email });
    }
  };

  senderZipChange = (zip) => {
    if (zip.length) {
      fetch(CommonConfig.zipCodeAPIKey(zip))
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
                  return data.types[0] === "locality";
                }
              )[0].long_name;

              FinalCity.push({
                City_code: CityData,
                Name: CityData,
              });

              var state = _.filter(
                data["results"][0]["address_components"],
                function(data) {
                  return data.types[0] === "administrative_area_level_1";
                }
              )[0].long_name;

              var SelectedCity = {
                value: FinalCity[0].City_code,
                label: FinalCity[0].Name,
              };

              var SelectedState = { value: state, label: state };

              if (countryShortName === this.state.selectedFromCountry.label) {
                this.setState({
                  fromCityAutoComplete: FinalCity.length ? true : false,
                  fromStateAutoComplete: this.state.fromStateList.length
                    ? true
                    : false,
                  fromGoogleAPICityList: FinalCity,
                  fromState: this.state.fromStateList.length
                    ? SelectedState
                    : state,
                  fromCity: SelectedCity,
                });
              } else {
                this.setState({
                  fromCityAutoComplete: false,
                  fromStateAutoComplete: this.state.fromStateList.length
                    ? true
                    : false,
                  fromGoogleAPICityList: [],
                  fromState: "",
                  fromCity: "",
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

              if (countryShortName === this.state.selectedFromCountry.label) {
                this.setState({
                  fromCityAutoComplete: FinalCity.length ? true : false,
                  fromStateAutoComplete: this.state.fromStateList.length
                    ? true
                    : false,
                  fromGoogleAPICityList: FinalCity,
                  fromState: this.state.fromStateList.length
                    ? SelectedState
                    : state,
                  fromCity: SelectedCity,
                });
              } else {
                this.setState({
                  fromCityAutoComplete: false,
                  fromStateAutoComplete: this.state.fromStateList.length
                    ? true
                    : false,
                  fromGoogleAPICityList: [],
                  fromState: "",
                  fromCity: "",
                });
              }
            }
          } else {
            this.setState({
              fromCityAutoComplete: false,
              fromStateAutoComplete: this.state.fromStateList.length
                ? true
                : false,
              fromGoogleAPICityList: [],
              fromState: "",
              fromCity: "",
            });
          }
        });
    }
  };

  recipientZipChange = (zip) => {
    if (zip.length) {
      fetch(CommonConfig.zipCodeAPIKey(zip))
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
                  return data.types[0] === "locality";
                }
              )[0].long_name;

              FinalCity.push({
                City_code: CityData,
                Name: CityData,
              });

              var state = _.filter(
                data["results"][0]["address_components"],
                function(data) {
                  return data.types[0] === "administrative_area_level_1";
                }
              )[0].long_name;

              var SelectedCity = {
                value: FinalCity[0].City_code,
                label: FinalCity[0].Name,
              };

              var SelectedState = { value: state, label: state };

              if (countryShortName === this.state.selectedToCountry.label) {
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

              if (countryShortName === this.state.selectedToCountry.label) {
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
            }
          } else {
            this.setState({
              toCityAutoComplete: false,
              toStateAutoComplete: this.state.toStateList.length ? true : false,
              toGoogleAPICityList: [],
              toState: "",
              toCity: "",
            });
          }
        });
    }
  };

  handleBlur = (event, type) => {
    if (type === "FromZipCode") {
      let Fromaddress = this.state.FromAddress;
      Fromaddress.ZipCode = event.target.value;
      this.setState({ FromAddress: Fromaddress });
      this.senderZipChange(event.target.value);
    } else if (type === "ToZipCode") {
      let toAddress = this.state.ToAddress;
      toAddress.ZipCode = event.target.value;
      this.setState({ ToAddress: toAddress });
      this.recipientZipChange(event.target.value);
    }
  };

  appendMonths() {
    return this.state.Month.map((mm) => {
      return (
        <MenuItem classes={{ root: classes.selectMenuItem }} value={mm.value}>
          {" "}
          {mm.label}{" "}
        </MenuItem>
      );
    });
  }

  appendYears() {
    return this.state.Year.map((yy) => {
      return (
        <MenuItem classes={{ root: classes.selectMenuItem }} value={yy.value}>
          {" "}
          {yy.label}{" "}
        </MenuItem>
      );
    });
  }

  ChangeToCity = (event, value) => {
    if (value != null) {
      this.setState({ toCity: value });
    }
  };

  handleCityStateChange = (event, type) => {
    if (type === "toState") {
      this.setState({ toState: event.target.value });
    } else if (type === "toCity") {
      this.setState({ toCity: event.target.value });
    } else if (type === "fromState") {
      this.setState({ fromState: event.target.value });
    } else if (type === "fromCity") {
      this.setState({ fromCity: event.target.value });
    }
  };

  ChangeToState = (event, value) => {
    if (value != null) {
      this.setState({ toState: value });
    }
  };

  ChangeFromCity = (event, value) => {
    if (value != null) {
      this.setState({ fromCity: value });
    }
  };

  ChangeFromState = (event, value) => {
    if (value != null) {
      this.setState({ fromState: value });
    }
  };

  getPackageDetail() {
    try {
      let data = {
        ShippingID: this.props.history.location.state.ShipppingID,
      };
      api
        .post("scheduleshipment/getShipmentPackageByID", data)
        .then((res) => {
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
            // if(res.data.length === 0){
            //     this.addPackageRow();
            // }
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

  dateChange = (date, type, index) => {
    if (type === "InvoiceDate") {
      let paymentInvoiceList = this.state.PaymentList;
      let idx = paymentInvoiceList.findIndex((x) => x.Index === index);
      paymentInvoiceList[idx][type] = date;
      this.setState({ PaymentList: paymentInvoiceList });
    } else if (type === "PaymentIssuedDate" || type === "DatePaid") {
      let paymentIssued = this.state.paymentIssued;
      let idx = paymentIssued.findIndex((x) => x.Index === index);
      paymentIssued[idx][type] = date;
      this.setState({ paymentIssued: paymentIssued });
    } else if (type === "PaymentReceivedDate") {
      let paymentReceived = this.state.paymentReceived;
      let idx = paymentReceived.findIndex((x) => x.Index === index);
      paymentReceived[idx][type] = date;
      this.setState({ paymentReceived: paymentReceived });
    } else if (type === "PickupDate") {
      let TrackingList = this.state.trackingManualList;
      let idx = TrackingList.findIndex((x) => x.Index === index);
      TrackingList[idx][type] = date;
      this.setState({ trackingManualList: TrackingList });
    }
  };

  paymentDateChange = (date, type, index) => {
    if (type === "Credit Card") {
      let creditCardList = this.state.creditCardList;
      let idx = creditCardList.findIndex((x) => x.Index === index);
      creditCardList[idx]["PaidDate"] = date;
      this.setState({ creditCardList: creditCardList });
    } else if (type === "Bank") {
      let bankList = this.state.bankList;
      let idx = bankList.findIndex((x) => x.Index === index);
      bankList[idx]["PaidDate"] = date;
      this.setState({ bankList: bankList });
    }
  };

  handleChangeInvoiceAccount = (event, type, index) => {
    const { value } = event.target;
    const PaymentList = this.state.PaymentList;
    let idx = PaymentList.findIndex((x) => x.Index === index);
    if (type === "Description") {
      PaymentList[idx][type] = value;
    }
    if (type === "Amount") {
      if (value.match(/^[-+]?\d{0,}(\.\d{0,2})?$/) || value === "") {
        PaymentList[idx][type] = value;
        PaymentList[idx]["TotalAmount"] =
          PaymentList[idx]["Amount"] * PaymentList[idx]["Quantity"];
      }
    }
    if (type === "Quantity") {
      PaymentList[idx][type] = value.replace(/\D/g, "");
      PaymentList[idx]["TotalAmount"] =
        PaymentList[idx]["Amount"] * PaymentList[idx]["Quantity"];
    }
    this.setState({ PaymentList: PaymentList });
    this.CostCalculator("Invoice");
  };

  CostCalculator = (type, IsFalse) => {
    if (type === "Invoice") {
      let paymentList = this.state.PaymentList.filter(
        (x) => x.Status === "Active"
      );
      var totalCost = 0;
      for (var i = 0; i < paymentList.length; i++) {
        totalCost = Number(totalCost) + Number(paymentList[i].TotalAmount);
      }
      this.setState({ TotalCostInvoice: totalCost });
    }
    if (type === "Received") {
      let paymentReceived = this.state.paymentReceived.filter(
        (x) => x.Status === "Active"
      );
      var totalCost = 0;
      for (var i = 0; i < paymentReceived.length; i++) {
        totalCost = Number(totalCost) + Number(paymentReceived[i].Amount);
      }
      this.setState({ TotalCostReceived: totalCost });
    }
    if (type === "Issued") {
      let paymentIssued = this.state.paymentIssued.filter(
        (x) => x.Status === "Active"
      );
      var totalCost = 0;
      for (var i = 0; i < paymentIssued.length; i++) {
        totalCost = Number(totalCost) + Number(paymentIssued[i].Amount);
      }
      this.setState({ TotalCostIssued: totalCost });
    }
    if (type === "Commercial") {
      let commercialList = this.state.commercialList.filter(
        (x) => x.Status === "Active"
      );
      var totalCost = 0;
      for (var i = 0; i < commercialList.length; i++) {
        totalCost = Number(totalCost) + Number(commercialList[i].TotalValue);
      }
      this.setState({ TotalCostCommercial: totalCost });
      if (IsFalse) {
        this.showAESMessage(totalCost);
      }
    }
  };

  handleChangepaymentReceived = (event, type, index) => {
    const { value } = event.target;
    const paymentReceived = this.state.paymentReceived;
    let idx = paymentReceived.findIndex((x) => x.Index === index);
    if (type === "ConfirmationNumber" || type === "Number") {
      paymentReceived[idx][type] = value;
    }
    if (type === "Amount") {
      if (value.match(/^[-+]?\d{0,}(\.\d{0,2})?$/) || value === "") {
        paymentReceived[idx][type] = value;
      }
    }
    this.setState({ paymentReceived: paymentReceived });
    this.CostCalculator("Received");
  };

  handleChangeviewPaymentIssued = (event, type, index) => {
    const { value } = event.target;
    const paymentIssued = this.state.paymentIssued;
    let idx = paymentIssued.findIndex((x) => x.Index === index);
    if (type === "InvoiceNumber" || type === "PaidStatus") {
      paymentIssued[idx][type] = value;
    }
    if (type === "Amount") {
      if (value.match(/^[-+]?\d{0,}(\.\d{0,2})?$/) || value === "") {
        paymentIssued[idx][type] = value;
      }
    }
    this.setState({ paymentIssued: paymentIssued });
    this.CostCalculator("Issued");
  };

  handleChangeBank = (event, type, index) => {
    const { value } = event.target;
    const bankList = this.state.bankList;
    let idx = bankList.findIndex((x) => x.Index === index);
    if (type === "RoutingNumber" || type === "AccountNumber") {
      bankList[idx][type] = value.replace(/\D/g, "");
    } else if (type === "InvoiceAmount") {
      if (value.match(/^[-+]?\d{0,}(\.\d{0,2})?$/) || value === "") {
        bankList[idx][type] = value;
      }
    } else {
      bankList[idx][type] = value;
    }
    this.setState({ bankList: bankList });
  };

  handleChangeCreditCard = (event, type, index) => {
    const { value } = event.target;
    const creditCardList = this.state.creditCardList;
    let idx = creditCardList.findIndex((x) => x.Index === index);
    if (type === "CardNumber" || type === "CardZipCode" || type === "CardCVV") {
      creditCardList[idx][type] = value.replace(/\D/g, "");
    } else if (type === "InvoiceAmount") {
      if (value.match(/^[-+]?\d{0,}(\.\d{0,2})?$/) || value === "") {
        creditCardList[idx][type] = value;
      }
    } else {
      creditCardList[idx][type] = value;
    }
    this.setState({ creditCardList: creditCardList });
  };

  handleChangePackage = (event, type, index) => {
    const { value } = event.target;
    const PackageList = this.state.PackageList;
    var idx = PackageList.findIndex((x) => x.Index === index);
    if (type === "PackageContent") {
      if (value !== null) {
        PackageList[idx][type] = value.value;
      }
    } else if (type === "PackageNumber") {
      PackageList[idx][type] = value;
    } else if (
      type === "Sequence" ||
      type === "EstimetedWeight" ||
      type === "Height" ||
      type === "Width" ||
      type === "Length"
    ) {
      PackageList[idx][type] = value.replace(/\D/g, "");
    } else if (type === "InsuredValue") {
      if (value.match(/^\d{1,}(\.\d{0,2})?$/) || value === "") {
        PackageList[idx][type] = value;
      }
    }
    this.setState({ PackageList: PackageList }, function() {
      this.Calculate();
    });
  };

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

  selectChangeTab2 = (event, type, idx) => {
    let index = this.state.PackageList.findIndex((x) => x.Index === idx);
    if (type === "TV") {
      let packgeList = this.state.PackageList;
      packgeList[index][type] = event.target.value;
      this.setState({ PackageList: packgeList });
    } else if (type === "Stretch") {
      let packgeList = this.state.PackageList;
      packgeList[index][type] = event.target.value;
      this.setState({ PackageList: packgeList });
    } else if (type === "Crating") {
      let packgeList = this.state.PackageList;
      packgeList[index][type] = event.target.value;
      this.setState({ PackageList: packgeList });
    } else if (type === "Repack") {
      let packgeList = this.state.PackageList;
      packgeList[index][type] = event.target.value;
      this.setState({ PackageList: packgeList });
    } else if (type === "PackedType") {
      let packgeList = this.state.PackageList;
      packgeList[index][type] = event.target.value;
      this.setState({ PackageList: packgeList });
    }
  };

  optionYes = () => {
    return this.state.YesNo.map((content) => {
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

  addPackageRow = () => {
    let PackageList = this.state.PackageList;
    var row = {
      EstimetedWeight: 0,
      Height: 0,
      Length: 0,
      Width: 0,
      ChargableWeight: 0,
      PackageNumber:
        PackageList.filter((x) => x.Status === "Active").length + 1,
      Sequence: 0,
      CreatedBy: CommonConfig.loggedInUserData().Name,
      TV: false,
      Crating: false,
      Stretch: false,
      Repack: false,
      PackageContent: "",
      CFT: parseFloat(0).toFixed(2),
      PackedType: "",
      ShippingPackageDetailID: null,
      InsuredValue: parseFloat(0).toFixed(2),
      Status: "Active",
      Index: this.state.PackageList.length + 1,
    };
    PackageList.push(row);
    this.setState({
      PackageList: PackageList,
      TotalPackages: PackageList.filter((x) => x.Status === "Active").length,
    });
    this.addnewRowCommercial();
  };

  removePackageRow = (index) => {
    var PackageList = this.state.PackageList;
    let Index = this.state.PackageList.findIndex((x) => x.Index === index);
    if (Index !== -1) {
      this.removeCommercialByPackageNumber(PackageList[Index]["PackageNumber"]);
      PackageList[Index]["Status"] = "Inactive";
      for (var i = Index; i < PackageList.length; i++) {
        if (PackageList[i]["Status"] === "Active") {
          PackageList[i]["PackageNumber"] = PackageList[i].PackageNumber - 1;
        }
      }
      this.setState({
        PackageList: PackageList,
        TotalPackages: PackageList.filter((x) => x.Status === "Active").length,
      });
      this.Calculate();
    }
  };

  formatPackageValue = (event, type, index) => {
    let PackageList = this.state.PackageList;
    let idx = this.state.PackageList.findIndex((x) => x.Index === index);
    let regexp = /^[0-9]+(\.[0-9][0-9])?$/;
    let val = parseFloat(event.target.value).toFixed(2);
    if (regexp.test(val)) {
      PackageList[idx][type] = val;
      this.setState({ PackageList: PackageList });
    }
  };

  renderPackageNumber = () => {
    return this.state.PackageList.filter((x) => x.Status === "Active").map(
      (content, key) => {
        return (
          <MenuItem classes={{ root: classes.selectMenuItem }} value={key + 1}>
            {" "}
            {key + 1}{" "}
          </MenuItem>
        );
      }
    );
  };

  packageContentChange = (value, type, idx) => {
    if (value != null) {
      let packageList = this.state.PackageList;
      let index = this.state.PackageList.findIndex((x) => x.Index === idx);
      packageList[index][type] = value.value;
      this.setState({ PackageList: packageList });
    }
  };

  viewPackage = () => {
    const PackageContentList = this.state.PackageContentList.map((type) => {
      return { value: type.Description, label: type.Description };
    });
    return this.state.PackageList.filter((x) => x.Status === "Active").map(
      (packages, idx) => {
        const PackageContent = {
          value: packages.PackageContent,
          label: packages.PackageContent,
        };
        return (
          <tr>
            <td>
              <div className="package-select table-select small">
                <FormControl className={classes.formControl} fullWidth>
                  <Select
                    id="package_number"
                    name="package_number"
                    value={packages.PackageNumber}
                    className="form-control"
                    disabled={true}
                    onChange={(event) =>
                      this.handleChangePackage(
                        event,
                        "PackageNumber",
                        packages.Index
                      )
                    }
                  >
                    {this.renderPackageNumber()}
                  </Select>
                </FormControl>
              </div>
            </td>
            {this.state.ShipmentType.value == "Ocean" ? (
              <>
                <td>
                  <TextField
                    name="sequence"
                    id="sequence"
                    disabled={true}
                    value={packages.Sequence}
                    onChange={(event) =>
                      this.handleChangePackage(
                        event,
                        "Sequence",
                        packages.Index
                      )
                    }
                    inputProps={{
                      maxLength: 3,
                    }}
                    InputProps={{
                      disableUnderline: true,
                    }}
                  />
                </td>
                <td>
                  <div className="package-select">
                    <Autocomplete
                      id="package_number"
                      options={PackageContentList}
                      value={PackageContent}
                      disabled={true}
                      getOptionLabel={(option) => option.label}
                      onChange={(event, value) =>
                        this.packageContentChange(
                          value,
                          "PackageContent",
                          packages.Index
                        )
                      }
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                </td>
              </>
            ) : null}
            <td>
              <TextField
                id="proposaltype"
                // type="weight"
                name="weight"
                disabled={true}
                value={packages.EstimetedWeight}
                onChange={(event) =>
                  this.handleChangePackage(
                    event,
                    "EstimetedWeight",
                    packages.Index
                  )
                }
                inputProps={{
                  maxLength: 3,
                }}
                InputProps={{
                  disableUnderline: true,
                }}
              />
            </td>
            <td>
              <TextField
                // type="length"
                name="length"
                id="proposaltype"
                disabled={true}
                onChange={(event) =>
                  this.handleChangePackage(event, "Length", packages.Index)
                }
                value={packages.Length}
                inputProps={{
                  maxLength: 3,
                }}
                InputProps={{
                  disableUnderline: true,
                }}
              />
            </td>
            <td>
              <TextField
                // type="length"
                name="width"
                id="proposaltype"
                disabled={true}
                value={packages.Width}
                onChange={(event) =>
                  this.handleChangePackage(event, "Width", packages.Index)
                }
                inputProps={{
                  maxLength: 3,
                }}
                InputProps={{
                  disableUnderline: true,
                }}
              />
            </td>
            <td>
              <TextField
                // type="number"
                name="height"
                id="proposaltype"
                value={packages.Height}
                disabled={true}
                onChange={(event) =>
                  this.handleChangePackage(event, "Height", packages.Index)
                }
                inputProps={{
                  maxLength: 3,
                }}
                InputProps={{
                  disableUnderline: true,
                }}
              />
            </td>
            <td>
              <TextField
                type="number"
                name="chargableweight"
                id="proposaltype"
                disabled={true}
                value={packages.ChargableWeight}
                inputProps={{}}
                InputProps={{
                  disableUnderline: true,
                }}
              />
            </td>
            {this.state.ShipmentType.value !== "Ocean" ? (
              <td>
                <TextField
                  // type="number"
                  name="insurance"
                  id="insurance"
                  disabled={true}
                  value={packages.InsuredValue}
                  onChange={(event) =>
                    this.handleChangePackage(
                      event,
                      "InsuredValue",
                      packages.Index
                    )
                  }
                  onBlur={(event) =>
                    this.formatPackageValue(
                      event,
                      "InsuredValue",
                      packages.Index
                    )
                  }
                  inputProps={{
                    maxLength: 6,
                  }}
                  InputProps={{
                    disableUnderline: true,
                  }}
                />
              </td>
            ) : null}

            {this.state.ShipmentType.value === "Ocean" ? (
              <>
                <td>
                  <CustomInput
                    type="number"
                    name="cft"
                    id="proposaltype"
                    inputProps={{
                      value:
                        packages.CFT !== null
                          ? parseFloat(packages.CFT).toFixed(2)
                          : 0.0,
                      disabled: true,
                    }}
                  />
                </td>
                <td>
                  <div className="table-select package-select">
                    <FormControl className={classes.formControl} fullWidth>
                      <Select
                        id="package_number"
                        name="package_number"
                        value={packages.PackedType}
                        className="form-control"
                        disabled={true}
                        onChange={(event) =>
                          this.selectChangeTab2(
                            event,
                            "PackedType",
                            packages.Index
                          )
                        }
                      >
                        {this.packedBy()}
                      </Select>
                    </FormControl>
                  </div>
                </td>
              </>
            ) : null}
            {/* <td>
              <div className="pck-subbtn">
                {idx !== 0 ? (
                  <Button
                    justIcon
                    color="danger"
                    className="Plus-btn "
                    onClick={() => this.removePackageRow(packages.Index)}
                  >
                    <i className={"fas fa-minus"} />
                  </Button>
                ) : null}
                {this.state.PackageList.filter((x) => x.Status === "Active")
                  .length ===
                  idx + 1 ? (
                    <Button
                      justIcon
                      color="facebook"
                      onClick={() => this.addPackageRow()}
                      className="Plus-btn "
                    >
                      <i className={"fas fa-plus"} />
                    </Button>
                  ) : null}
              </div>
            </td> */}
          </tr>
        );
      }
    );
  };

  changePackage = (event, type) => {
    if (type === "AllClear") {
      if (this.state.AllClear !== event.target.value) {
        if (this.state.AllClear) {
          this.openConfirmAllClear();
        } else {
          this.setState({
            AllClear: event.target.value,
            IsChanged: true,
          });
        }
      }
    }
    if (type === "PackageType") {
      if (event.target.value === "Package") {
        let PackageList = this.state.PackageList;
        for (var i = 1; i < PackageList.length; i++) {
          PackageList[i]["Status"] = "Active";
        }

        this.setState({
          PackageType: event.target.value,
          PackageList: PackageList,
        });
      }
      if (event.target.value === "Envelop") {
        var PackageList = this.state.PackageList;
        PackageList[0]["EstimetedWeight"] = 0.5;
        PackageList[0]["Quantity"] = 1;
        PackageList[0]["Length"] = 10;
        PackageList[0]["Width"] = 13;
        PackageList[0]["Height"] = 1;
        PackageList[0]["ChargableWeight"] = 0.5;
        PackageList[0]["CFT"] = 0.0;
        PackageList[0]["Status"] = "Active";
        for (var i = 1; i < PackageList.length; i++) {
          PackageList[i]["Status"] = "Inactive";
        }
        this.setState({
          PackageList: PackageList,
          PackageType: event.target.value,
        });
        this.disableCommercial(event.target.value);
      }
    }
  };

  openConfirmAllClear = () => {
    this.setState({ confirmAllClear: true });
  };

  AllClearConfirm = () => {
    try {
      let data = {
        AllClear: false,
        TrackingNumber: this.state.TrackingNumber,
        Amount: this.state.TotalCostReceived,
        ManagedBy: this.state.ManagedBy.value,
        userid: CommonConfig.loggedInUserData().PersonID,
      };
      api
        .post("scheduleshipment/addCommissionByAllClear", data)
        .then((res) => {
          if (res.success) {
            this.setState({
              AllClear: false,
              confirmAllClear: false,
            });
          } else {
            this.setState({ confirmAllClear: false });
          }
        })
        .catch((err) => {
          console.log("error..", err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  getCommercialInvoiceDetail() {
    try {
      let data = {
        ShippingID: this.props.history.location.state.ShipppingID,
      };
      api
        .post("scheduleshipment/getShipmentCommercialInvoiceByID", data)
        .then((res) => {
          if (res.success) {
            var l = 1;
            res.data.map((Obj) => {
              Obj.Index = l;
              l++;
              return Obj;
            });
            this.setState({
              commercialList: res.data,
              CommercialInvoiceList: res.data,
            });
            // if (res.data.length === 0) {
            //   this.addnewRowCommercial();
            // }
            this.CostCalculator("Commercial", false);
          }
        })
        .catch((err) => {
          console.log("error..", err);
        });
    } catch (err) {
      console.log(err);
    }
  }

  removeCommercialInvoice = (index) => {
    var commercialList = this.state.commercialList;
    let Index = this.state.commercialList.findIndex((x) => x.Index === index);
    if (Index !== -1) {
      commercialList[Index]["Status"] = "Inactive";
      this.setState({ commercialList: commercialList });
      this.CostCalculator("Commercial", true);
    }
  };

  removeCommercialByPackageNumber = (packageNumber) => {
    var commercialList = this.state.commercialList;
    for (var i = 0; i < commercialList.length; i++) {
      if (commercialList[i]["PackageNumber"] === packageNumber) {
        commercialList[i]["Status"] = "Inactive";
      } else {
        commercialList[i]["PackageNumber"] =
          commercialList[i]["PackageNumber"] > packageNumber
            ? commercialList[i]["PackageNumber"] - 1
            : commercialList[i]["PackageNumber"];
      }
    }
    this.setState({ commercialList: commercialList });
    this.CostCalculator("Commercial", true);
  };

  addnewRowCommercial = () => {
    let commercialList = this.state.commercialList;
    let packageNumbeList = commercialList.filter((x) => x.Status === "Active");
    const row = {
      PackageNumber:
        packageNumbeList.length > 0
          ? packageNumbeList[packageNumbeList.length - 1]["PackageNumber"] + 1
          : 1,
      Status: "Active",
      ContentDescription: "",
      ShippingCommercialInvoiceID: null,
      Quantity: 0,
      ValuePerQuantity: parseFloat(0).toFixed(2),
      TotalValue: parseFloat(0).toFixed(2),
      Index: this.state.commercialList.length + 1,
    };
    commercialList.push(row);
    this.setState({ commercialList: commercialList });
    this.CostCalculator("Commercial", true);
  };

  addAESFillingInvoice = () => {
    const row = {
      ServiceDescription: "AES Filling Charges",
      InvoiceDate: moment().toDate(),
      Descriptiom: "",
      Quantity: 1,
      Amount: parseFloat(75).toFixed(2),
      TotalAmount: parseFloat(75).toFixed(2),
      CreatedByName: CommonConfig.loggedInUserData().Name,
      Status: "Active",
      ShippingInvoiceID: null,
      Index: this.state.PaymentList.length + 1,
    };
    this.setState(
      {
        PaymentList: [...this.state.PaymentList, row],
        IsAESOpen: false,
        IsAlreadyAESFilled: true,
      },
      function() {
        if (this.state.saveClicked.saveClick) {
          this.handleSave(this.state.saveClicked.redirect);
        } else {
          this.CostCalculator("Invoice");
        }
      }
    );
  };

  showAESMessage = (totalCost) => {
    let cost = totalCost ? totalCost : this.state.TotalCostCommercial;
    if (cost > 2500 && !this.state.IsAlreadyAESFilled) {
      this.setState({ IsAESOpen: true });
      // this.addAESFillingInvoice();
    }
  };

  formatValue = (event, type, index) => {
    let CommercialList = this.state.commercialList;
    let idx = this.state.commercialList.findIndex((x) => x.Index === index);
    let regexp = /^[0-9]+(\.[0-9][0-9])?$/;
    let val = parseFloat(event.target.value).toFixed(2);
    if (regexp.test(val)) {
      CommercialList[idx][type] = val;
      this.setState({ commercialList: CommercialList });
    }
  };

  viewCommercialInvoice = () => {
    var disableCommercialInvoice =
      this.state.ShipmentStatus == "New Request" ||
      this.state.ShipmentStatus == "In Consolidation" ||
      this.state.ShipmentStatus == "Pickup Scheduled"
        ? false
        : true;
    return this.state.commercialList
      .filter((x) => x.Status === "Active")
      .map((commercial, idx) => {
        return (
          <tr>
            <td className="wd-130">
              <div className="package-select">
                <FormControl className={classes.formControl} fullWidth>
                  <Select
                    id="package_number"
                    name="package_number"
                    value={commercial.PackageNumber}
                    className="form-control"
                    disabled={disableCommercialInvoice}
                    onChange={(event) =>
                      this.handleCommercialInvoiceChange(
                        event,
                        "PackageNumber",
                        commercial.Index
                      )
                    }
                  >
                    {this.renderPackageNumber()}
                  </Select>
                </FormControl>
              </div>
            </td>
            <td>
              <div className="width-full">
                <TextField
                  value={commercial.ContentDescription}
                  disabled={disableCommercialInvoice}
                  onChange={(event) =>
                    this.handleCommercialInvoiceChange(
                      event,
                      "ContentDescription",
                      commercial.Index
                    )
                  }
                  inputProps={{}}
                  InputProps={{
                    disableUnderline: true,
                  }}
                />
              </div>
            </td>
            {this.state.ShipmentType.value !== "Ocean" ? (
              <>
                <td className="wd-num">
                  <TextField
                    disabled={disableCommercialInvoice}
                    value={commercial.Quantity}
                    onChange={(event) =>
                      this.handleCommercialInvoiceChange(
                        event,
                        "Quantity",
                        commercial.Index
                      )
                    }
                    inputProps={{
                      maxLength: 3,
                    }}
                    InputProps={{
                      disableUnderline: true,
                    }}
                  />
                </td>
                <td className="wd-num">
                  <TextField
                    disabled={disableCommercialInvoice}
                    value={commercial.ValuePerQuantity}
                    onChange={(event) =>
                      this.handleCommercialInvoiceChange(
                        event,
                        "ValuePerQuantity",
                        commercial.Index
                      )
                    }
                    onBlur={(event) =>
                      this.formatValue(
                        event,
                        "ValuePerQuantity",
                        commercial.Index
                      )
                    }
                    inputProps={{}}
                    InputProps={{
                      disableUnderline: true,
                    }}
                  />
                </td>
              </>
            ) : null}
            <td className="wd-num">
              <TextField
                value={
                  this.state.ShipmentType.value === "Ocean"
                    ? commercial.TotalValue
                    : parseFloat(commercial.TotalValue).toFixed(2)
                }
                onChange={(event) =>
                  this.handleCommercialInvoiceChange(
                    event,
                    "TotalValue",
                    commercial.Index
                  )
                }
                disabled={
                  this.state.ShipmentType.value === "Ocean" &&
                  disableCommercialInvoice == false
                    ? false
                    : true
                }
                onBlur={(event) =>
                  this.formatValue(event, "TotalValue", commercial.Index)
                }
                inputProps={{}}
                InputProps={{
                  disableUnderline: true,
                }}
              />
            </td>
            {/* <td className="pck-action-column">
              {idx !== 0 ? (
                <Button
                  justIcon
                  color="danger"
                  className="Plus-btn "
                  onClick={() => this.removeCommercialInvoice(commercial.Index)}
                >
                  <i className={"fas fa-minus"} />
                </Button>
              ) : null}

              {this.state.commercialList.filter((x) => x.Status === "Active")
                .length ===
                idx + 1 ? (
                  <Button
                    justIcon
                    color="facebook"
                    onClick={() => this.addnewRowCommercial()}
                    className="Plus-btn "
                  >
                    <i className={"fas fa-plus"} />
                  </Button>
                ) : null}
            </td> */}
          </tr>
        );
      });
  };

  handleCommercialInvoiceChange = (event, type, index) => {
    let idx = this.state.commercialList.findIndex((x) => x.Index === index);
    if (type === "PackageNumber") {
      let commercialList = this.state.commercialList;
      commercialList[idx][type] = event.target.value;
      this.setState({ commercialList: commercialList });
    } else if (type === "ContentDescription") {
      if (
        (this.state.ShipmentType.value === "Ocean" &&
          event.target.value.length <= 200) ||
        event.target.value.length <= 60
      ) {
        let commercialList = this.state.commercialList;
        commercialList[idx][type] = event.target.value;
        this.setState({ commercialList: commercialList });
      }
    } else if (type === "Quantity") {
      let commercialList = this.state.commercialList;
      commercialList[idx][type] = event.target.value.replace(/\D/g, "");
      commercialList[idx]["TotalValue"] =
        commercialList[idx][type] * commercialList[idx]["ValuePerQuantity"];
      this.setState({ commercialList: commercialList });
      this.CostCalculator("Commercial", true);
    } else if (type === "TotalValue") {
      let commercialList = this.state.commercialList;
      if (
        event.target.value.match(/^\d{1,}(\.\d{0,2})?$/) ||
        event.target.value === ""
      ) {
        commercialList[idx][type] = event.target.value;
        this.setState({ commercialList: commercialList });
        this.CostCalculator("Commercial", true);
      }
    } else if (type === "ValuePerQuantity") {
      let commercialList = this.state.commercialList;
      if (
        event.target.value.match(/^\d{1,}(\.\d{0,2})?$/) ||
        event.target.value === ""
      ) {
        commercialList[idx][type] = event.target.value;
        commercialList[idx]["TotalValue"] =
          commercialList[idx][type] * commercialList[idx]["Quantity"];
        this.setState({ commercialList: commercialList });
        this.CostCalculator("Commercial", true);
      }
    }
  };

  handleAdditionalChange = (event, type) => {
    if (type === "MovingBackIndia") {
      this.setState({
        movingBackIndia: event.target.value,
        isBackIndia: event.target.value,
        movingBackIndiaErr: false,
        movingBackIndiaHelperText: "",
      });
    } else if (type === "StayInIndia") {
      this.setState({
        StayInIndia: event.target.value,
        stayinIndiaErr: false,
        stayinIndiaHelperText: "",
      });
    } else if (type === "AppliedForTR") {
      this.setState({
        AppliedForTR: event.target.value,
        appliedForTRErr: false,
        appliedForTRHelperText: "",
      });
    } else if (type === "AbleToProvidePassport") {
      this.setState({
        AbleToProvidePassport: event.target.value,
        ableToProvidePassportErr: false,
        ableToProvidePassportHelperText: "",
      });
    } else if (type === "VisaCategory") {
      this.setState({
        VisaCategory: event.target.value,
        visaCategoryErr: false,
        visaCategoryHelperText: "",
      });
    } else if (type === "NameAsPerPassport") {
      this.setState({
        NameAsPerPassport: event.target.value,
        nameAsperPassportErr: false,
        nameAsperPassportHelperText: "",
      });
    } else if (type === "YearsOutsideIndia") {
      this.setState({
        YearsOutsideIndia: event.target.value,
        yearsOutsideIndiaErr: false,
        yearsOutsideIndiaHelperText: "",
      });
    }
  };

  visaCategoryMenu = () => {
    return this.state.visaCategoryList.map((yn) => {
      return (
        <MenuItem classes={{ root: classes.selectMenuItem }} value={yn.value}>
          {" "}
          {yn.label}{" "}
        </MenuItem>
      );
    });
  };

  yearsRender = () => {
    return this.state.yearsLength.map((year) => {
      return (
        <MenuItem classes={{ root: classes.selectMenuItem }} value={year.value}>
          {year.label}
        </MenuItem>
      );
    });
  };

  yesOrNo = () => {
    return this.state.yesOrNo.map((yn) => {
      return (
        <MenuItem classes={{ root: classes.selectMenuItem }} value={yn.value}>
          {" "}
          {yn.label}{" "}
        </MenuItem>
      );
    });
  };

  getAccountDetail() {
    try {
      let data = {
        ShippingID: this.props.history.location.state.ShipppingID,
      };
      api
        .post("scheduleshipment/getAccountDetail", data)
        .then((res) => {
          if (res.success) {
            var i = 1;
            res.data.InvoiceData.map((Obj) => {
              Obj.Index = i;
              Obj.Amount = parseFloat(Obj.Amount).toFixed(2);
              if (Obj.ServiceDescription === "AES Filling Charges") {
                this.setState({ IsAlreadyAESFilled: true });
              }
              i++;
              return Obj;
            });
            var j = 1;
            res.data.PaymentReceivedData.map((Obj) => {
              Obj.Index = j;
              Obj.Amount = parseFloat(Obj.Amount).toFixed(2);
              j++;
              return Obj;
            });

            var k = 1;
            res.data.PaymentIssuedData.map((Obj) => {
              Obj.Index = k;
              Obj.Amount = parseFloat(Obj.Amount).toFixed(2);
              k++;
              return Obj;
            });
            let creditCardObj = res.data.PaymentDetailData.filter(
              (x) => x.PaymentType === "Credit Card"
            );
            var l = 1;
            creditCardObj.map((Obj) => {
              Obj.Index = l;
              Obj.InvoiceAmount = parseFloat(Obj.InvoiceAmount).toFixed(2);
              let index = Obj.CardExpiry.indexOf("-");
              Obj.CardExpiryMonth = Obj.CardExpiry.substring(0, index);
              Obj.CardExpiryYear = Obj.CardExpiry.substring(
                index + 1,
                Obj.CardExpiry.length
              );
              l++;
              return Obj;
            });

            let bankObj = res.data.PaymentDetailData.filter(
              (x) => x.PaymentType === "Bank"
            );
            var t = 1;
            bankObj.map((Obj) => {
              Obj.Index = t;
              Obj.InvoiceAmount = parseFloat(Obj.InvoiceAmount).toFixed(2);
              t++;
              return Obj;
            });

            this.setState({
              PaymentList: res.data.InvoiceData,
              DocumentInvoiceData: res.data.InvoiceData,
              paymentReceived: res.data.PaymentReceivedData,
              paymentIssued: res.data.PaymentIssuedData,
              bankList: bankObj,
              creditCardList: creditCardObj,
            });

            let printInvoiceData = {
              ShippingID:
                this.props.location.state &&
                this.props.location.state.ShipppingID
                  ? this.props.location.state.ShipppingID
                  : null,
              InvoiceData: this.state.DocumentInvoiceData,
              TotalReceivedCost: this.state.TotalReceivedCost,
              DatePaidOn: this.state.DatePaidOn,
              FromAddress: this.state.FromAddressObj,
              DocumentManagedBy: this.state.DocumentManagedBy,
              TrackingNumber: this.state.TrackingNumber,
              DocumentInvoiceDueDate: this.state.DocumentInvoiceDueDate,
              ToAddress: this.state.ToAddressObj,
            };
            localStorage.setItem(
              "printInvoice",
              JSON.stringify(printInvoiceData)
            );

            var totalCost = 0;
            let datePaid = "";
            for (var i = 0; i < res.data.PaymentReceivedData.length; i++) {
              datePaid = res.data.PaymentReceivedData[0].PaymentReceivedDate;
              totalCost =
                Number(totalCost) +
                Number(res.data.PaymentReceivedData[i].Amount);
            }
            this.setState({
              TotalReceivedCost: totalCost,
              DatePaidOn: datePaid,
            });

            if (res.data.InvoiceData.length === 0) {
              this.addnewRowInvoice();
            }

            if (res.data.PaymentReceivedData.length === 0) {
              this.addRowPaymentReceived();
            }

            if (res.data.PaymentIssuedData.length === 0) {
              this.addRowPaymentIssued();
            }

            if (
              res.data.PaymentDetailData.filter((x) => x.PaymentType === "Bank")
                .length === 0
            ) {
              this.addRowBank();
            }

            if (
              res.data.PaymentDetailData.filter(
                (x) => x.PaymentType === "Credit Card"
              ).length === 0
            ) {
              this.addRowCreditCard();
            }
            this.CostCalculator("Invoice");
            this.CostCalculator("Received");
            this.CostCalculator("Issued");
          }
        })
        .catch((err) => {
          console.log("error...", err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  getServiceDescription() {
    try {
      let data = {
        stringMapType: "INVENTORY",
      };

      api
        .post("stringMap/getStringMap", data)
        .then((result) => {
          this.setState({ ServiceDescriptionList: result.data });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  getpaymentType() {
    try {
      let data = {
        stringMapType: "PAYMENTTYPE",
      };

      api
        .post("stringMap/getStringMap", data)
        .then((result) => {
          this.setState({ PaymentTypeList: result.data });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  getVendorName() {
    try {
      api
        .get("vendor/getVendorNameList")
        .then((result) => {
          this.setState({ VendorList: result.data });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  renderServiceDescription = () => {
    return this.state.ServiceDescriptionList.map((content) => {
      return (
        <MenuItem
          classes={{ root: classes.selectMenuItem }}
          value={content.Description}
        >
          {" "}
          {content.Description}{" "}
        </MenuItem>
      );
    });
  };

  addnewRowInvoice = () => {
    const row = {
      ServiceDescription: "",
      InvoiceDate: moment().toDate(),
      Descriptiom: "",
      Quantity: 0,
      Amount: parseFloat(0).toFixed(2),
      TotalAmount: parseFloat(0).toFixed(2),
      CreatedByName: CommonConfig.loggedInUserData().Name,
      Status: "Active",
      ShippingInvoiceID: null,
      Index: this.state.PaymentList.length + 1,
    };
    this.setState({ PaymentList: [...this.state.PaymentList, row] });
  };

  addRowPaymentReceived = () => {
    const row = {
      PaymentReceivedDate: moment().toDate(),
      PaymentType: "",
      Amount: parseFloat(0).toFixed(2),
      ConfirmationNumber: "",
      CreatedByName: CommonConfig.loggedInUserData().Name,
      Status: "Active",
      Number: "",
      ShippingPaymentReceivedID: null,
      Index: this.state.paymentReceived.length + 1,
    };
    this.setState({ paymentReceived: [...this.state.paymentReceived, row] });
  };

  addRowPaymentIssued = () => {
    const row = {
      PaymentIssuedDate: moment().toDate(),
      VendorName: "",
      InvoiceNumber: "",
      DatePaid: "",
      Amount: parseFloat(0).toFixed(2),
      CreatedByName: CommonConfig.loggedInUserData().Name,
      Status: "Active",
      ShippingPaymentIssuedID: null,
      Index: this.state.paymentIssued.length + 1,
    };
    this.setState({ paymentIssued: [...this.state.paymentIssued, row] });
  };

  addRowCreditCard = () => {
    const row = {
      CreatedByName: CommonConfig.loggedInUserData().Name,
      Status: "Active",
      PaymentID: null,
      AccountNumber: "",
      BankName: "",
      CardCVV: "",
      CardName: "",
      CardExpiryYear: "",
      CardExpiryMonth: "",
      CardNumber: "",
      CardType: "",
      CardZipCode: "",
      ContactName: "",
      InvoiceAmount: parseFloat(0).toFixed(2),
      NameonAccount: "",
      PaidDate: "",
      PaymentStatus: "New",
      PaymentType: "Credit Card",
      RoutingNumber: "",
      Index: this.state.creditCardList.length + 1,
    };
    this.setState({ creditCardList: [...this.state.creditCardList, row] });
  };

  addRowBank = () => {
    const row = {
      CreatedByName: CommonConfig.loggedInUserData().Name,
      Status: "Active",
      PaymentID: null,
      AccountNumber: "",
      BankName: "",
      CardCVV: "",
      CardName: "",
      CardExpiryYear: "",
      CardExpiryMonth: "",
      CardNumber: "",
      CardType: "",
      CardZipCode: "",
      ContactName: "",
      InvoiceAmount: parseFloat(0).toFixed(2),
      NameonAccount: "",
      PaidDate: "",
      PaymentStatus: "New",
      PaymentType: "Bank",
      RoutingNumber: "",
      Index: this.state.bankList.length + 1,
    };
    this.setState({ bankList: [...this.state.bankList, row] });
  };

  removePaymentRecieved = (index) => {
    var paymentList = this.state.paymentReceived;
    let Index = this.state.paymentReceived.findIndex((x) => x.Index === index);
    if (Index !== -1) {
      paymentList[Index]["Status"] = "Inactive";
      this.setState({ paymentReceived: paymentList });
      this.CostCalculator("Received");
    }
  };

  removePaymentIssued = (index) => {
    var paymentList = this.state.paymentIssued;
    let Index = this.state.paymentIssued.findIndex((x) => x.Index === index);
    if (Index !== -1) {
      paymentList[Index]["Status"] = "Inactive";
      this.setState({ paymentIssued: paymentList });
      this.CostCalculator("Issued");
    }
  };

  removeInvoice = (index) => {
    var paymentList = this.state.PaymentList;
    let Index = this.state.PaymentList.findIndex((x) => x.Index === index);
    if (Index !== -1) {
      paymentList[Index]["Status"] = "Inactive";
      this.setState({ PaymentList: paymentList });
      this.CostCalculator("Invoice");
    }
  };

  removeCreditCard = (index) => {
    var paymentList = this.state.creditCardList;
    let Index = this.state.creditCardList.findIndex((x) => x.Index === index);
    if (Index !== -1) {
      paymentList[Index]["Status"] = "Inactive";
      this.setState({ creditCardList: paymentList });
    }
  };

  removeBank = (index) => {
    var paymentList = this.state.bankList;
    let Index = this.state.bankList.findIndex((x) => x.Index === index);
    if (Index !== -1) {
      paymentList[Index]["Status"] = "Inactive";
      this.setState({ bankList: paymentList });
    }
  };

  selectChangeTab3 = (value, type, index) => {
    if (value != null) {
      if (type === "ServiceDescription") {
        let paymentList = this.state.PaymentList;
        let idx = this.state.PaymentList.findIndex((x) => x.Index === index);
        paymentList[idx][type] = value.value;
        this.setState({ PaymentList: paymentList });
      } else if (type === "VendorName") {
        let paymentIssued = this.state.paymentIssued;
        let idx = this.state.paymentIssued.findIndex((x) => x.Index === index);
        paymentIssued[idx][type] = value.value;
        this.setState({ paymentIssued: paymentIssued });
      } else if (type === "PaymentType") {
        let paymentReceived = this.state.paymentReceived;
        let idx = this.state.paymentReceived.findIndex(
          (x) => x.Index === index
        );
        paymentReceived[idx][type] = value.value;
        this.setState({ paymentReceived: paymentReceived });
      }
    }
  };

  handleAmountChange = (event, type, index) => {
    if (type === "IssuedAmount") {
      let paymentIssued = this.state.paymentIssued;
      let idx = this.state.paymentIssued.findIndex((x) => x.Index === index);
      let regexp = /^[0-9]+(\.[0-9][0-9])?$/;
      let val = parseFloat(event.target.value).toFixed(2);
      if (regexp.test(val)) {
        paymentIssued[idx]["Amount"] = val;
        this.setState({ paymentIssued: paymentIssued });
      }
    } else if (type === "InvoiceAmount") {
      let PaymentList = this.state.PaymentList;
      let idx = this.state.PaymentList.findIndex((x) => x.Index === index);
      let regexp = /^[0-9]+(\.[0-9][0-9])?$/;
      let val = parseFloat(event.target.value).toFixed(2);
      if (regexp.test(val)) {
        PaymentList[idx]["Amount"] = val;
        this.setState({ PaymentList: PaymentList });
      }
    } else if (type === "ReceivedAmount") {
      let paymentReceived = this.state.paymentReceived;
      let idx = this.state.paymentReceived.findIndex((x) => x.Index === index);
      let regexp = /^[0-9]+(\.[0-9][0-9])?$/;
      let val = parseFloat(event.target.value).toFixed(2);
      if (regexp.test(val)) {
        paymentReceived[idx]["Amount"] = val;
        this.setState({ paymentReceived: paymentReceived });
      }
    }
  };

  yesNo = () => {
    return this.state.yesNo.map((content) => {
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

  viewInvoice = () => {
    const ServiceList = this.state.ServiceDescriptionList.map((type) => {
      return { value: type.Description, label: type.Description };
    });
    return this.state.PaymentList.filter((x) => x.Status === "Active").map(
      (payment, idx) => {
        const ServiceDescription = {
          value: payment.ServiceDescription,
          label: payment.ServiceDescription,
        };
        return (
          <tr>
            <td className="wd-date">
              <div className="package-dateinput">
                <CustomInput
                  inputProps={{
                    value: moment(payment.InvoiceDate).format(
                      CommonConfig.dateFormat.dateOnly
                    ),
                    disabled: true,
                  }}
                />
              </div>
            </td>
            <td>
              <div className="package-select">
                <Autocomplete
                  id="package_number"
                  options={ServiceList}
                  value={ServiceDescription}
                  disabled="true"
                  getOptionLabel={(option) => option.label}
                  onChange={(event, value) =>
                    this.selectChangeTab3(
                      value,
                      "ServiceDescription",
                      payment.Index
                    )
                  }
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
            </td>
            <td className="">
              <div className="width-full">
                <CustomInput
                  inputProps={{
                    onChange: (event) =>
                      this.handleChangeInvoiceAccount(
                        event,
                        "Description",
                        payment.Index
                      ),
                    value: payment.Description,
                    disabled: true,
                  }}
                />
              </div>
            </td>
            <td className="wd-num">
              <CustomInput
                name="Quantity"
                id="proposaltype"
                type="number"
                inputProps={{
                  onChange: (event) =>
                    this.handleChangeInvoiceAccount(
                      event,
                      "Quantity",
                      payment.Index
                    ),
                  value: payment.Quantity,
                  disabled: true,
                }}
              />
            </td>
            <td className="wd-num">
              <CustomInput
                name="Amount"
                id="proposaltype"
                type="number"
                inputProps={{
                  onChange: (event) =>
                    this.handleChangeInvoiceAccount(
                      event,
                      "Amount",
                      payment.Index
                    ),
                  onBlur: (event) =>
                    this.handleAmountChange(
                      event,
                      "InvoiceAmount",
                      payment.Index
                    ),
                  value: payment.Amount,
                  disabled: true,
                }}
              />
            </td>
            <td className="wd-num">
              <CustomInput
                name="TotalAmount"
                id="proposaltype"
                type="number"
                inputProps={{
                  disabled: true,
                  value: parseFloat(payment.TotalAmount).toFixed(2),
                }}
              />
            </td>
            {/* <td className="pck-action-column">
              {idx !== 0 && !this.state.AllClear ? (
                <Button
                  justIcon
                  color="danger"
                  className="Plus-btn"
                  onClick={() => this.removeInvoice(payment.Index)}
                >
                  <i className={"fas fa-minus"} />
                </Button>
              ) : null}
              {this.state.PaymentList.filter((x) => x.Status === "Active")
                .length ===
                idx + 1 && !this.state.AllClear ? (
                  <Button
                    justIcon
                    color="facebook"
                    onClick={() => this.addnewRowInvoice()}
                    className="Plus-btn "
                  >
                    <i className={"fas fa-plus"} />
                  </Button>
                ) : null}
              <Tooltip title={payment.CreatedByName} arrow>
                <Button className="Plus-btn info-icon" justIcon color="twitter">
                  <InfoIcon />
                </Button>
              </Tooltip>
            </td> */}
          </tr>
        );
      }
    );
  };

  viewPaymentIssued = () => {
    const VendorList = this.state.VendorList.map((type) => {
      return { value: type.VendorName, label: type.VendorName };
    });
    return this.state.paymentIssued
      .filter((x) => x.Status === "Active")
      .map((payment, idx) => {
        const vendorName = {
          value: payment.VendorName,
          label: payment.VendorName,
        };
        return (
          <tr>
            <td className="wd-date">
              <div className="package-dateinput">
                <Datetime
                  dateFormat={"MM/DD/YYYY"}
                  timeFormat={false}
                  value={moment(payment.PaymentIssuedDate)}
                  onChange={(date) =>
                    this.dateChange(date, "PaymentIssuedDate", payment.Index)
                  }
                  closeOnSelect={true}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </div>
            </td>
            <td style={{ width: "315px" }}>
              <div className="package-select">
                <Autocomplete
                  id="package_number"
                  options={VendorList}
                  value={vendorName}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, value) =>
                    this.selectChangeTab3(value, "VendorName", payment.Index)
                  }
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
            </td>
            <td className="wd-150">
              <CustomInput
                inputProps={{
                  onChange: (event) =>
                    this.handleChangeviewPaymentIssued(
                      event,
                      "InvoiceNumber",
                      payment.Index
                    ),
                  value: payment.InvoiceNumber,
                }}
              />
            </td>
            <td className="wd-date">
              <div className="package-dateinput">
                <Datetime
                  dateFormat={"MM/DD/YYYY"}
                  timeFormat={false}
                  value={moment(payment.DatePaid)}
                  onChange={(date) =>
                    this.dateChange(date, "DatePaid", payment.Index)
                  }
                  closeOnSelect={true}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </div>
            </td>
            <td className="wd-100">
              <div className="package-select">
                <FormControl className={classes.formControl} fullWidth>
                  <Select
                    id="package_number"
                    value={payment.PaidStatus}
                    name="package_number"
                    className="form-control"
                    onChange={(event) =>
                      this.handleChangeviewPaymentIssued(
                        event,
                        "PaidStatus",
                        payment.Index
                      )
                    }
                  >
                    {this.yesNo()}
                  </Select>
                </FormControl>
              </div>
            </td>
            <td className="wd-num">
              <CustomInput
                name="Amount"
                id="proposaltype"
                type="number"
                inputProps={{
                  onChange: (event) =>
                    this.handleChangeviewPaymentIssued(
                      event,
                      "Amount",
                      payment.Index
                    ),
                  onBlur: (event) =>
                    this.handleAmountChange(
                      event,
                      "IssuedAmount",
                      payment.Index
                    ),
                  value: payment.Amount,
                }}
              />
            </td>
            <td className="pck-action-column">
              {idx !== 0 ? (
                <Button
                  justIcon
                  color="danger"
                  className="Plus-btn "
                  onClick={() => this.removePaymentIssued(payment.Index)}
                >
                  <i className={"fas fa-minus"} />
                </Button>
              ) : null}
              {this.state.paymentIssued.filter((x) => x.Status === "Active")
                .length ===
                idx + 1 ||
              this.state.paymentIssued.filter((x) => x.Status === "Active")
                .length === 0 ? (
                <Button
                  justIcon
                  color="facebook"
                  onClick={() => this.addRowPaymentIssued()}
                  className="Plus-btn "
                >
                  <i className={"fas fa-plus"} />
                </Button>
              ) : null}
              <Tooltip title={payment.CreatedByName} arrow>
                <Button justIcon color="twitter" className="Plus-btn info-icon">
                  <InfoIcon />
                </Button>
              </Tooltip>
            </td>
          </tr>
        );
      });
  };

  viewCreditCardList = () => {
    const { ReadOnly } = this.state;
    return this.state.creditCardList
      .filter((x) => x.Status === "Active")
      .map((method, idx) => {
        const CardNumber = ReadOnly
          ? "XXXX XXXX XXXX" +
            method.CardNumber.toString().slice(method.CardNumber.length - 4)
          : method.CardNumber;
        return (
          <tr>
            <td style={{ width: "176px" }} className="wd-date input-full">
              <CustomInput
                inputProps={{
                  onChange: (event) =>
                    this.handleChangeCreditCard(
                      event,
                      "CardName",
                      method.Index
                    ),
                  value: method.CardName,
                  disabled: ReadOnly,
                }}
              />
            </td>
            <td style={{ width: "168px" }} className="input-full">
              <CustomInput
                className="mr-5"
                inputProps={{
                  onChange: (event) =>
                    this.handleChangeCreditCard(
                      event,
                      "CardNumber",
                      method.Index
                    ),
                  value: CardNumber,
                  disabled: ReadOnly,
                }}
              />
            </td>
            <td className="wd-num">
              <div className="table-select package-select">
                <FormControl className={useStyles.formControl}>
                  <Select
                    id="package_number"
                    value={method.CardExpiryMonth}
                    disabled={ReadOnly}
                    name="package_number"
                    className="form-control"
                    onChange={(event) =>
                      this.handleChangeCreditCard(
                        event,
                        "CardExpiryMonth",
                        method.Index
                      )
                    }
                  >
                    {this.appendMonths()}
                  </Select>
                </FormControl>
                <FormControl className={useStyles.formControl}>
                  <Select
                    id="package_number"
                    value={method.CardExpiryYear}
                    name="package_number"
                    disabled={ReadOnly}
                    className="form-control"
                    onChange={(event) =>
                      this.handleChangeCreditCard(
                        event,
                        "CardExpiryYear",
                        method.Index
                      )
                    }
                  >
                    {this.appendYears()}
                  </Select>
                </FormControl>
              </div>
              {/* <CustomInput
                  name="CardCVV"
                  id="proposaltype"
                  type="number"
                  inputProps={{
                    onChange: (event) =>
                      this.handleChangeCreditCard(
                        event,
                        "CardCVV",
                        method.Index
                      ),
                    value: method.CardCVV,
                    disabled: ReadOnly
                  }}
                />     */}
            </td>
            <td className="wd-num">
              <CustomInput
                name="CardZipCode"
                id="proposaltype"
                type="number"
                inputProps={{
                  onChange: (event) =>
                    this.handleChangeCreditCard(
                      event,
                      "CardZipCode",
                      method.Index
                    ),
                  value: method.CardZipCode,
                  disabled: ReadOnly,
                }}
              />
            </td>
            <td className="wd-date wd-100">
              <div className="package-dateinput">
                {!ReadOnly ? (
                  <Datetime
                    dateFormat={"MM/DD/YYYY"}
                    timeFormat={false}
                    value={moment(method.PaidDate)}
                    onChange={(date) =>
                      this.paymentDateChange(date, "Credit Card", method.Index)
                    }
                    closeOnSelect={true}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                ) : (
                  <CustomInput
                    inputProps={{
                      value: moment(method.PaidDate).format(
                        CommonConfig.dateFormat.dateOnly
                      ),
                      disabled: true,
                    }}
                  />
                )}
              </div>
            </td>
            <td className="wd-num">
              <CustomInput
                name="InvoiceAmount"
                id="proposaltype"
                type="number"
                inputProps={{
                  onChange: (event) =>
                    this.handleChangeCreditCard(
                      event,
                      "InvoiceAmount",
                      method.Index
                    ),
                  value: method.InvoiceAmount,
                  disabled: ReadOnly,
                }}
              />
            </td>
            <td className="pck-action-column">
              {idx !== 0 && !ReadOnly ? (
                <Button
                  justIcon
                  color="danger"
                  className="Plus-btn"
                  onClick={() => this.removeCreditCard(method.Index)}
                >
                  <i className={"fas fa-minus"} />
                </Button>
              ) : null}
              {this.state.creditCardList.filter((x) => x.Status === "Active")
                .length ===
                idx + 1 && !ReadOnly ? (
                <Button
                  justIcon
                  color="facebook"
                  onClick={() => this.addRowCreditCard()}
                  className="Plus-btn "
                >
                  <i className={"fas fa-plus"} />
                </Button>
              ) : null}

              {this.state.Access.DeleteAccess === 1 ? (
                <Button
                  justIcon
                  color="facebook"
                  onClick={() => this.handlePayment(method, "CC")}
                  className="Plus-btn "
                >
                  <i className={"fab fa-amazon-pay"} />
                </Button>
              ) : null}
              <Tooltip title={method.CreatedByName} arrow>
                <Button justIcon color="twitter" className="Plus-btn info-icon">
                  <InfoIcon />
                </Button>
              </Tooltip>
            </td>
          </tr>
        );
      });
  };

  viewBankList = () => {
    const { ReadOnly } = this.state;
    return this.state.bankList
      .filter((x) => x.Status === "Active")
      .map((method, idx) => {
        return (
          <tr>
            <td style={{ width: "197px" }} className="wd-full input-full">
              <CustomInput
                inputProps={{
                  onChange: (event) =>
                    this.handleChangeBank(event, "NameonAccount", method.Index),
                  value: method.NameonAccount,
                  disabled: ReadOnly,
                }}
              />
            </td>
            <td style={{ width: "186px" }}>
              <div className="pck-nowrap-input">
                <CustomInput
                  className="mr-5"
                  inputProps={{
                    onChange: (event) =>
                      this.handleChangeBank(
                        event,
                        "AccountNumber",
                        method.Index
                      ),
                    value: method.AccountNumber,
                    disabled: ReadOnly,
                  }}
                />
              </div>
            </td>
            <td style={{ width: "156px" }} className="input-full">
              <CustomInput
                inputProps={{
                  onChange: (event) =>
                    this.handleChangeBank(event, "RoutingNumber", method.Index),
                  value: method.RoutingNumber,
                  disabled: ReadOnly,
                }}
              />
            </td>
            <td className="input-full">
              <CustomInput
                className="mr-5"
                inputProps={{
                  onChange: (event) =>
                    this.handleChangeBank(event, "BankName", method.Index),
                  value: method.BankName,
                  disabled: ReadOnly,
                }}
              />
            </td>
            <td className="wd-date wd-100">
              <div className="package-dateinput">
                {!ReadOnly ? (
                  <Datetime
                    dateFormat={"MM/DD/YYYY"}
                    timeFormat={false}
                    value={moment(method.PaidDate)}
                    onChange={(date) =>
                      this.paymentDateChange(date, "Bank", method.Index)
                    }
                    closeOnSelect={true}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                ) : (
                  <CustomInput
                    inputProps={{
                      value: !CommonConfig.isEmpty(method.PaidDate)
                        ? moment(method.PaidDate).format(
                            CommonConfig.dateFormat.dateOnly
                          )
                        : "",
                      disabled: true,
                    }}
                  />
                )}
              </div>
            </td>
            <td className="wd-num">
              <CustomInput
                name="InvoiceAmount"
                id="proposaltype"
                type="number"
                inputProps={{
                  onChange: (event) =>
                    this.handleChangeBank(event, "InvoiceAmount", method.Index),
                  value: method.InvoiceAmount,
                  disabled: ReadOnly,
                }}
              />
            </td>
            <td className="pck-action-column">
              {idx !== 0 && !ReadOnly ? (
                <Button
                  justIcon
                  color="danger"
                  className="Plus-btn"
                  onClick={() => this.removeBank(method.Index)}
                >
                  <i className={"fas fa-minus"} />
                </Button>
              ) : null}
              {this.state.bankList.filter((x) => x.Status === "Active")
                .length ===
                idx + 1 && !ReadOnly ? (
                <Button
                  justIcon
                  color="facebook"
                  onClick={() => this.addRowBank()}
                  className="Plus-btn "
                >
                  <i className={"fas fa-plus"} />
                </Button>
              ) : null}

              {/* {this.state.Access.DeleteAccess === 1 ?
                <Button
                  justIcon
                  color="facebook"
                  onClick={() => this.handlePayment(method,'Bank')}
                  className="Plus-btn "
                >
                  <i className={"fab fa-amazon-pay"} />
                </Button>
                :
                null
              } */}

              <Tooltip title={method.CreatedByName} arrow>
                <Button justIcon color="twitter" className="Plus-btn info-icon">
                  <InfoIcon />
                </Button>
              </Tooltip>
            </td>
          </tr>
        );
      });
  };

  paymentReceived = () => {
    const PaymentTypeList = this.state.PaymentTypeList.map((type) => {
      return { value: type.Description, label: type.Description };
    });
    const { ReadOnly, AllClear } = this.state;
    return this.state.paymentReceived
      .filter((x) => x.Status === "Active")
      .map((payment, idx) => {
        const paymentType = {
          value: payment.PaymentType,
          label: payment.PaymentType,
        };
        const CardNumber = ReadOnly
          ? "XXXX XXXX XXXX" +
            payment.Number.toString().slice(payment.Number.length - 4)
          : payment.Number;
        return (
          <tr>
            <td className="wd-date">
              <div className="package-dateinput">
                {!ReadOnly && !AllClear ? (
                  <Datetime
                    dateFormat={"MM/DD/YYYY"}
                    timeFormat={false}
                    value={moment(payment.PaymentReceivedDate)}
                    onChange={(date) =>
                      this.dateChange(
                        date,
                        "PaymentReceivedDate",
                        payment.Index
                      )
                    }
                    closeOnSelect={true}
                    renderInput={(params) => (
                      <TextField {...params} disabled={ReadOnly} fullWidth />
                    )}
                  />
                ) : (
                  <CustomInput
                    inputProps={{
                      value: moment(payment.PaymentReceivedDate).format(
                        CommonConfig.dateFormat.dateOnly
                      ),
                      disabled: true,
                    }}
                  />
                )}
              </div>
            </td>
            <td style={{ width: "222px" }}>
              <div className="package-select">
                <Autocomplete
                  id="package_number"
                  options={PaymentTypeList}
                  value={paymentType}
                  disabled="true"
                  getOptionLabel={(option) => option.label}
                  onChange={(event, value) =>
                    this.selectChangeTab3(value, "PaymentType", payment.Index)
                  }
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
            </td>
            <td className="wd-328 input-full">
              <CustomInput
                inputProps={{
                  onChange: (event) =>
                    this.handleChangepaymentReceived(
                      event,
                      "Number",
                      payment.Index
                    ),
                  value: CardNumber,
                  disabled: true,
                }}
              />
            </td>
            <td className="wd-328  input-full">
              <CustomInput
                inputProps={{
                  onChange: (event) =>
                    this.handleChangepaymentReceived(
                      event,
                      "ConfirmationNumber",
                      payment.Index
                    ),
                  value: payment.ConfirmationNumber,
                  disabled: true,
                }}
              />
            </td>
            <td className="wd-num">
              <CustomInput
                name="Amount"
                id="proposaltype"
                type="number"
                inputProps={{
                  value: payment.Amount,
                  disabled: true,
                  onChange: (event) =>
                    this.handleChangepaymentReceived(
                      event,
                      "Amount",
                      payment.Index
                    ),
                  onBlur: (event) =>
                    this.handleAmountChange(
                      event,
                      "ReceivedAmount",
                      payment.Index
                    ),
                }}
              />
            </td>
          </tr>
        );
      });
  };

  onErrorHandler = (response) => {
    this.setState({
      status: ["failure", response.messages.message.map((err) => err.text)],
    });
  };

  onSuccessHandler = (response) => {
    this.setState({ status: ["failure", []] });
  };

  handlePayment = (event, type) => {
    event.TrackingNumber = this.state.TrackingNumber;

    if (type == "CC") {
      var numberValidation = valid.number(event.CardNumber);

      if (!numberValidation.isValid) {
        cogoToast.error("Invalid Credit Card Number");
        return;
      }

      var visaCards = creditCardType(event.CardNumber);

      if (visaCards[0]) {
        event.CardType = visaCards[0].type;
      } else {
        event.CardType = "visa";
      }
    }

    // if (type == 'Bank'){

    // }

    this.setState({
      openpayment: true,
      PaymentShowData: event,
    });
  };

  trackingService() {
    try {
      api
        .get("userManagement/getServiceName")
        .then((result) => {
          if (result.success) {
            this.setState({ TrackingServiceList: result.data });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  removeTrackingNumber = (index) => {
    var trackingNumberList = this.state.trackingNumberList;
    let Index = this.state.trackingNumberList.findIndex(
      (x) => x.Index === index
    );
    if (Index !== -1) {
      trackingNumberList[Index]["Status"] = "Inactive";
      this.setState({ trackingNumberList: trackingNumberList });
    }
  };

  addnewRowTrackingNumber = () => {
    const row = {
      TrackingID: "",
      TrackingDate: moment().toDate(),
      TrackingStatus: "",
      Carrier: "",
      Type: "",
      Comments: "",
      Status: "Active",
      ShipppingTrackingID: null,
      CreatedByName: CommonConfig.loggedInUserData().Name,
      Index: this.state.trackingNumberList.length + 1,
    };
    this.setState({
      trackingNumberList: [...this.state.trackingNumberList, row],
    });
  };

  activeInactive = () => {
    return this.state.activeInactive.map((content) => {
      return (
        <MenuItem
          classes={{ root: useStyles.selectMenuItem }}
          value={content.value}
        >
          {" "}
          {content.label}{" "}
        </MenuItem>
      );
    });
  };

  handleChangetrackingNumber = (event, type, index) => {
    const { value } = event.target;
    const trackingNumberList = this.state.trackingNumberList;
    let idx = this.state.trackingNumberList.findIndex((x) => x.Index === index);
    if (
      type === "TrackingID" ||
      type === "Comments" ||
      type === "TrackingStatus"
    ) {
      trackingNumberList[idx][type] = value;
    }
    this.setState({ trackingNumberList: trackingNumberList });
  };

  handleSelectChange = (value, type, index) => {
    if (value != null) {
      let TrackingList = this.state.trackingNumberList;
      let idx = this.state.trackingNumberList.findIndex(
        (x) => x.Index === index
      );
      TrackingList[idx][type] = value.value;
      this.setState({ trackingNumberList: TrackingList });
    }
  };

  addnewRowTrackingManual = () => {
    const row = {
      ShippingManualTrackingID: null,
      PickupDate: moment().toDate(),
      PickupTime: moment().format(CommonConfig.dateFormat.timeOnly),
      TrackingStatus: "",
      Type: "",
      Updates: "",
      Status: "Active",
      CreatedOn: moment().toDate(),
      CreatedByName: CommonConfig.loggedInUserData().Name,
      Index: this.state.trackingManualList.length + 1,
    };
    this.setState({
      trackingManualList: [...this.state.trackingManualList, row],
    });
  };

  removeTrackingManualRow = (index) => {
    var trackingManualList = this.state.trackingManualList;
    let Index = this.state.trackingManualList.findIndex(
      (x) => x.Index === index
    );
    if (Index !== -1) {
      trackingManualList[Index]["Status"] = "Inactive";
      this.setState({ trackingManualList: trackingManualList });
    }
  };

  handleManualTrackingChange = (event, type, index) => {
    let trackingManualList = this.state.trackingManualList;
    let idx = trackingManualList.findIndex((x) => x.Index === index);
    trackingManualList[idx][type] = event.target.value;
    this.setState({ trackingManualList: trackingManualList });
  };

  viewTrackingManual = () => {
    return this.state.trackingManualList
      .filter((x) => x.Status === "Active")
      .map((trackingManual, idx) => {
        return (
          <tr>
            {/* <td className="wd-date">
              <div className="package-dateinput">
                <CustomInput
                  id="proposaltype"
                  inputProps={{
                    disabled: true,
                    value: moment(trackingManual.CreatedOn).format(
                      CommonConfig.dateFormat.dateOnly
                    ),
                  }}
                />
              </div>
            </td>
            <td className="wd-time">
              <CustomInput
                id="proposaltype"
                type="number"
                inputProps={{
                  value: moment(trackingManual.CreatedOn).format(
                    CommonConfig.dateFormat.timeOnly
                  ),
                  disabled: true,
                }}
              />
            </td> */}
            <td className="wd-date">
              <div className="package-dateinput">
                <TextField
                  id="time"
                  // onChange={(event) => this.handleManualTrackingChange(event, "PickupTime", trackingManual.Index)}
                  value={moment(trackingManual.PickupDate).format("MM/DD/YYYY")}
                  inputProps={{
                    disabled: true,
                  }}
                />
                {/* <Datetime
                  dateFormat={"MM/DD/YYYY"}
                  timeFormat={false}
                  disabled={true}
                  value={moment(trackingManual.PickupDate)}
                  // onChange={(date) =>
                  //   this.dateChange(date, "PickupDate", trackingManual.Index)
                  // }
                  // closeOnSelect={true}
                  renderInput={(params) => (
                    <TextField {...params}  fullWidth />
                  )}
                /> */}
              </div>
            </td>
            {/* <td className="wd-time">
              <form noValidate>
                <TextField
                  id="time"
                  type="time"
                  onChange={(event) => this.handleManualTrackingChange(event, "PickupTime", trackingManual.Index)}
                  value={trackingManual.PickupTime}
                  inputProps={{
                    disabled: true,
                    step: 300, // 5 min
                  }}
                />
              </form>
            </td> */}
            <td className="wd-time">
              <CustomInput
                id="proposaltype"
                type="number"
                inputProps={{
                  value: moment(trackingManual.PickupTime, "HH:mm:ss").format(
                    CommonConfig.dateFormat.time12Only
                  ),
                  onChange: (event) =>
                    this.handleManualTrackingChange(
                      event,
                      "PickupTime",
                      trackingManual.Index
                    ),
                }}
              />
            </td>
            <td className="wd-full">
              <CustomInput
                id="proposaltype"
                type="text"
                inputProps={{
                  disabled: true,
                  value: trackingManual.Updates,
                  onChange: (event) =>
                    this.handleManualTrackingChange(
                      event,
                      "Updates",
                      trackingManual.Index
                    ),
                }}
              />
            </td>
            {/* <td className="pck-action-column">
              {idx !== 0 ? (
                <Button
                  justIcon
                  color="danger"
                  className="Plus-btn"
                  onClick={() =>
                    this.removeTrackingManualRow(trackingManual.Index)
                  }
                >
                  <i className={"fas fa-minus"} />
                </Button>
              ) : null}
              {this.state.trackingManualList.filter(
                (x) => x.Status === "Active"
              ).length ===
                idx + 1 ? (
                  <Button
                    justIcon
                    color="facebook"
                    onClick={() => this.addnewRowTrackingManual()}
                    className="Plus-btn "
                  >
                    <i className={"fas fa-plus"} />
                  </Button>
                ) : null}

              <Tooltip title={trackingManual.CreatedByName} arrow>
                <Button justIcon color="twitter" className="Plus-btn info-icon">
                  <InfoIcon />
                </Button>
              </Tooltip>
            </td> */}
          </tr>
        );
      });
  };

  viewTrackingNumber = () => {
    const serviceName = this.state.TrackingServiceList.map((type) => {
      return { value: type.MainServiceName, label: type.MainServiceName };
    });

    return this.state.trackingNumberList
      .filter((x) => x.Status === "Active")
      .map((trackingnumber, idx) => {
        const Carrier = {
          value: trackingnumber.Carrier,
          label: trackingnumber.Carrier,
        };
        return (
          <tr>
            <td className="wd-num">
              <CustomInput
                id="proposaltype"
                inputProps={{
                  value: idx + 1,
                }}
              />
            </td>
            <td className="wd-date">
              <div className="package-dateinput">
                <CustomInput
                  id="proposaltype"
                  inputProps={{
                    disabled: true,
                    value: moment(trackingnumber.TrackingDate).format(
                      CommonConfig.dateFormat.dateOnly
                    ),
                  }}
                />
              </div>
            </td>
            <td style={{ width: 167 }} className="input-full">
              <CustomInput
                id="proposaltype"
                type="number"
                inputProps={{
                  value: trackingnumber.TrackingID,
                  onChange: (event) =>
                    this.handleChangetrackingNumber(
                      event,
                      "TrackingID",
                      trackingnumber.Index
                    ),
                }}
              />
            </td>
            <td>
              <div className="package-select">
                <Autocomplete
                  id="combo-box-demo"
                  options={serviceName}
                  value={Carrier}
                  onChange={(event, value) =>
                    this.handleSelectChange(
                      value,
                      "Carrier",
                      trackingnumber.Index
                    )
                  }
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => <TextField {...params} />}
                ></Autocomplete>
              </div>
            </td>
            <td className="">
              <div className="wd-240 width-full">
                <CustomInput
                  id="proposaltype"
                  type="number"
                  inputProps={{
                    value: trackingnumber.Comments,
                    onChange: (event) =>
                      this.handleChangetrackingNumber(
                        event,
                        "Comments",
                        trackingnumber.Index
                      ),
                  }}
                />
              </div>
            </td>
            <td>
              <div className="table-select package-select">
                <FormControl className={useStyles.formControl} fullWidth>
                  <Select
                    id="package_number"
                    value={trackingnumber.TrackingStatus}
                    name="package_number"
                    className="form-control"
                    onChange={(event) =>
                      this.handleChangetrackingNumber(
                        event,
                        "TrackingStatus",
                        trackingnumber.Index
                      )
                    }
                  >
                    {this.activeInactive()}
                  </Select>
                </FormControl>
              </div>
            </td>
            <td className="pck-action-column">
              {idx !== 0 ? (
                <Button
                  justIcon
                  color="danger"
                  className="Plus-btn"
                  onClick={() =>
                    this.removeTrackingNumber(trackingnumber.Index)
                  }
                >
                  <i className={"fas fa-minus"} />
                </Button>
              ) : null}
              {this.state.trackingNumberList.filter(
                (x) => x.Status === "Active"
              ).length ===
              idx + 1 ? (
                <Button
                  justIcon
                  color="facebook"
                  onClick={() => this.addnewRowTrackingNumber()}
                  className="Plus-btn "
                >
                  <i className={"fas fa-plus"} />
                </Button>
              ) : null}

              <Tooltip title={trackingnumber.CreatedByName} arrow>
                <Button justIcon color="twitter" className="Plus-btn info-icon">
                  <InfoIcon />
                </Button>
              </Tooltip>
            </td>
          </tr>
        );
      });
  };

  AddNewRowData = () => {
    let attachments = this.state.Attachments.filter(
      (x) => x.Status === "Active"
    );
    let IsValid = true;
    for (
      let i = 0;
      i < this.state.Attachments.filter((x) => x.Status === "Active").length;
      i++
    ) {
      if (
        !attachments[i].hasOwnProperty("AttachmentName") &&
        !attachments[i].hasOwnProperty("isGenerated")
      ) {
        IsValid = false;
      }
    }
    var AttachmentList = this.state.Attachments.filter(
      (x) => x.Status === "Active"
    );
    if (IsValid) {
      const objAttachment = {
        Index: AttachmentList.filter((x) => x.Status === "Active").length + 1,
        FileName: "",
        DocumentType: "",
        Status: "Inactive",
        DocumentCreatedOn: moment().format(CommonConfig.dateFormat.dateOnly),
        DocumentCreatedBy: CommonConfig.loggedInUserData().Name,
      };
      this.setState({
        Attachments: [...this.state.Attachments, objAttachment],
      });
    } else {
      cogoToast.error("Please fill above row first");
    }
  };

  handleDocumentChange = (e, record) => {
    var Index = this.state.Attachments.indexOf(record.original);
    this.state.Attachments[Index]["FileName"] = e.target.value;
    this.setState({ Attachments: [...this.state.Attachments] });
  };

  fileUpload = (event, record) => {
    const files = event.target.files[0];
    let dateNow = new Date().getTime();
    if (event.target.files[0].size / 1024 / 1024 < 4) {
      let AttachmentList = this.state.Attachments;
      let Index = this.state.Attachments.indexOf(record.original);
      AttachmentList[Index]["AttachmentName"] = files.name;
      AttachmentList[Index]["DateTime"] = dateNow;
      AttachmentList[Index]["AttachmentType"] = files.type;
      AttachmentList[Index]["AttachmentID"] = null;
      AttachmentList[Index]["Status"] = "Inactive";
      this.setState({
        Attachments: AttachmentList,
        AttachmentList: [...this.state.AttachmentList, files],
      });
    } else {
      cogoToast.error("File size is more then 4MB");
    }
  };

  handleDocumentDelete = (e, record) => {
    var AttachmentList = this.state.Attachments;
    var Index = AttachmentList.indexOf(record);
    AttachmentList[Index]["Status"] = "Delete";
    if (AttachmentList.filter((x) => x.Status === "Active").length === 0) {
      AttachmentList.push(this.state.objAttachment);
    }
    this.setState({ Attachments: AttachmentList });
  };

  selectDocumentType = (value, record) => {
    if (value != null) {
      var AttachmentList = this.state.Attachments;
      var Index = AttachmentList.indexOf(record.original);
      AttachmentList[Index]["DocumentType"] = value.value;
      this.setState({ Attachments: AttachmentList });
    }
  };

  stringTruncate = (filename) => {
    var maxLength = 15;
    if (filename !== undefined && filename !== null) {
      if (filename.length > 15) {
        filename = filename.substring(0, maxLength) + "...";
      } else {
        filename = filename;
      }
    }
    return filename;
  };

  renderDocumentName = (cellInfo) => {
    return (
      <div className="table-input-slam">
        <CustomInput
          inputProps={{
            value: cellInfo.original.FileName,
            disabled:
              cellInfo.original.TrackingNumber ||
              cellInfo.original.Status === "Active"
                ? true
                : false,
            onChange: (event) => this.handleDocumentChange(event, cellInfo),
          }}
        />
      </div>
    );
  };

  documentTypeList = () => {
    return this.state.DocumentTypeList.map((document) => {
      return (
        <MenuItem
          classes={{ root: classes.selectMenuItem }}
          value={document.Description}
        >
          {" "}
          {document.Description}{" "}
        </MenuItem>
      );
    });
  };

  shipmentStatusList = () => {
    return this.state.ShipmentStatusList.map((document) => {
      return (
        <MenuItem
          classes={{ root: classes.selectMenuItem }}
          value={document.Description}
        >
          {" "}
          {document.Description}{" "}
        </MenuItem>
      );
    });
  };

  renderDocumentType = (cellInfo) => {
    const documentType = this.state.DocumentTypeList.map((type) => {
      return { value: type.Description, label: type.Description };
    });
    const DocumentType = {
      value: cellInfo.original.DocumentType,
      label: cellInfo.original.DocumentType,
    };
    return (
      <div className="package-select">
        <Autocomplete
          id="package_number"
          options={documentType}
          value={DocumentType}
          disabled={
            cellInfo.original.TrackingNumber ||
            cellInfo.original.Status === "Active"
              ? true
              : false
          }
          getOptionLabel={(option) => option.label}
          onChange={(event, value) => this.selectDocumentType(value, cellInfo)}
          renderInput={(params) => <TextField {...params} />}
        />
      </div>
    );
  };

  validate = () => {
    let IsValid = true;
    if (
      this.state.TotalCostCommercial > 2500 &&
      !this.state.IsAlreadyAESFilled
    ) {
      IsValid = false;
    }
    return IsValid;
  };

  handleDelete = () => {
    this.setState({ deleteopen: true });
  };

  deleteShipment = () => {
    this.showLoader();
    try {
      var data = {
        ShippingID: this.props.location.state.ShipppingID,
      };
      this.setState({ deleteopen: false });
      api
        .post("scheduleshipment/deleteShipmentByID", data)
        .then((result) => {
          this.hideLoader();
          if (result.success) {
            cogoToast.success("Deleted Successfully");
            this.props.history.push({
              pathname: "/admin/ShipmentList",
              state: {
                myfilterlist:
                  this.props.history.location.state.myfilterlist !== undefined
                    ? this.props.history.location.state.myfilterlist
                    : null,
                type:
                  this.props.history.location.state.type !== undefined
                    ? this.props.history.location.state.type
                    : "MyShipment",
                myshipmentstatusList:
                  this.props.history.location.state.myshipmentstatusList !==
                  undefined
                    ? this.props.history.location.state.myshipmentstatusList
                    : [],
                mysortlist:
                  this.props.history.location.state.mysortlist !== undefined
                    ? this.props.history.location.state.mysortlist
                    : null,
              },
            });
          } else {
            cogoToast.error("Something went wrong");
          }
        })
        .catch((err) => {
          this.hideLoader();
          console.log(err);
          cogoToast.error("Something went wrong");
        });
    } catch (err) {
      this.hideLoader();
      console.log("error", err);
      cogoToast.error("Something went wrong");
    }
  };

  handleSave = (redirect) => {
    if (this.validate()) {
      let packobj = this.state.PackageList.filter(
        (x) =>
          (x.Status === "Inactive" && x.ShippingPackageDetailID !== null) ||
          ((x) => x.Status === "Active")
      );
      let scheduleobj = this.state.ShipmentType.value;
      let senderobj = this.state.FromAddress;
      let recipientobj = this.state.ToAddress;
      let commercialData = this.state.commercialList;
      let paymentInvoiceData = this.state.PaymentList.filter(
        (x) =>
          (x.Status === "Inactive" && x.ShippingInvoiceID !== null) ||
          (x.Status === "Active" && x.ServiceDescription !== "")
      );
      let TrackingData = this.state.trackingNumberList.filter(
        (x) =>
          (x.Status === "Inactive" && x.ShippingTrackingID !== null) ||
          (x.Status === "Active" && x.TrackingID !== "")
      );
      let ManualTrackingData = this.state.trackingManualList.filter(
        (x) =>
          (x.Status === "Inactive" && x.ShippingManualTrackingID !== null) ||
          (x.Status === "Active" && x.Updates !== "")
      );
      let paymentReceivedData = this.state.paymentReceived.filter(
        (x) =>
          (x.Status === "Inactive" && x.ShippingPaymentReceivedID !== null) ||
          (x.Status === "Active" && x.PaymentType !== "")
      );
      let paymentIssued = this.state.paymentIssued.filter(
        (x) =>
          (x.Status === "Inactive" && x.ShippingPaymentIssuedID !== null) ||
          (x.Status === "Active" && x.VendorName !== "")
      );
      let creditCardObj = this.state.creditCardList.filter(
        (x) =>
          (x.Status === "Inactive" && x.PaymentID !== null) ||
          (x.Status === "Active" && x.CardName !== "")
      );
      let bankObj = this.state.bankList.filter(
        (x) =>
          (x.Status === "Inactive" && x.PaymentID !== null) ||
          (x.Status === "Active" && x.NameonAccount !== "")
      );
      let packages_data = [];
      let com_data = [];
      var paymentdata = [];
      if (scheduleobj === "Air" || scheduleobj === "Ground") {
        if (this.state.PackageType === "Package") {
          for (var i = 0; i < packobj.length; i++) {
            let package_details = {};
            package_details = {
              shipments_tracking_number: "",
              PackageNumber: packobj[i].PackageNumber,
              package_number: packobj[i].Sequence,
              weight: packobj[i].EstimetedWeight,
              unit_of_weight: "LBS",
              length: packobj[i].Length,
              width: packobj[i].Width,
              height: packobj[i].Height,
              chargable_weight: packobj[i].ChargableWeight,
              insured_value: packobj[i].InsuredValue,
              Sequence: packobj[i].Sequence,
              PackageContent: packobj[i].PackageContent,
              PackedType: packobj[i].PackedType,
              Status: packobj[i].Status,
              TV: false,
              Stretch: false,
              Repack: false,
              Crating: false,
              PackageID: packobj[i].ShippingPackageDetailID,
            };
            packages_data.push(package_details);
          }
        } else if (this.state.PackageType === "Envelop") {
          let package_details = {};
          package_details = {
            shipments_tracking_number: "",
            PackageNumber: packobj[0].PackageNumber,
            package_number: packobj[0].Sequence,
            weight: packobj[0].EstimetedWeight,
            unit_of_weight: "LBS",
            length: packobj[0].Length,
            width: packobj[0].Width,
            height: packobj[0].Height,
            chargable_weight: packobj[0].ChargableWeight,
            insured_value: packobj[0].InsuredValue,
            Sequence: packobj[0].Sequence,
            PackedType: packobj[0].PackedType,
            Status: packobj[0].Status,
            PackageContent: packobj[0].PackageContent,
            TV: false,
            Stretch: false,
            Repack: false,
            Crating: false,
            PackageID: packobj[0].ShippingPackageDetailID,
          };

          packages_data.push(package_details);
        }
      } else if (scheduleobj === "Ocean") {
        if (this.state.PackageType === "Package") {
          for (var i = 0; i < packobj.length; i++) {
            let package_details = {};
            package_details = {
              shipments_tracking_number: "",
              PackageNumber: packobj[i].PackageNumber,
              package_number: packobj[i].Sequence,
              weight: packobj[i].EstimetedWeight,
              unit_of_weight: "LBS",
              length: packobj[i].Length,
              width: packobj[i].Width,
              height: packobj[i].Height,
              chargable_weight: packobj[i].ChargableWeight,
              insured_value: packobj[i].InsuredValue,
              Sequence: packobj[i].Sequence,
              Status: packobj[i].Status,
              TV: false,
              Stretch: false,
              Repack: false,
              Crating: false,
              PackageContent: packobj[i].PackageContent,
              PackedType: packobj[i].PackedType,
              CFT: packobj[i].CFT,
              PackageID: packobj[i].ShippingPackageDetailID,
            };
            packages_data.push(package_details);
          }
        } else if (this.state.PackageType === "Envelop") {
          let package_details = {};
          package_details = {
            shipments_tracking_number: "",
            PackageNumber: packobj[0].PackageNumber,
            package_number: packobj[0].Sequence,
            weight: packobj[0].EstimetedWeight,
            unit_of_weight: "LBS",
            length: packobj[0].Length,
            width: packobj[0].Width,
            height: packobj[0].Height,
            chargable_weight: packobj[0].ChargableWeight,
            insured_value: parseFloat(packobj[0].InsuredValue).toFixed(2),
            Sequence: packobj[0].Sequence,
            Status: packobj[0].Status,
            TV: false,
            Stretch: false,
            Repack: false,
            Crating: false,
            PackageContent: packobj[0].PackageContent,
            PackedType: packobj[0].PackedType,
            CFT: parseFloat(packobj[0].CFT).toFixed(2),
            PackageID: packobj[0].ShippingPackageDetailID,
          };

          packages_data.push(package_details);
        }
      }

      var packages = packages_data;
      for (var i = 0; i < commercialData.length; i++) {
        let commercail_details = {};
        commercail_details = {
          shipments_tracking_number: "",
          package_number: commercialData[i].PackageNumber,
          content_description: commercialData[i].ContentDescription,
          quantity: commercialData[i].Quantity,
          value_per_qty: commercialData[i].ValuePerQuantity,
          total_value: commercialData[i].TotalValue,
          Status: commercialData[i].Status,
          CommercialInvoiceID: commercialData[i].ShippingCommercialInvoiceID,
        };
        com_data.push(commercail_details);
      }
      var commercial = com_data;

      var shipments = {
        tracking_number: "",
        shipment_type: scheduleobj,
        location_type: this.state.LocationType,
        is_pickup: !CommonConfig.isEmpty(this.state.IsPickup.data)
          ? this.state.IsPickup.data[0] === 0
            ? false
            : true
          : this.state.IsPickup,
        ShipmentStatus: this.state.ShipmentStatus,
        pickup_date:
          CommonConfig.isEmpty(this.state.PickupDate) != true
            ? moment(this.state.PickupDate)
                .format("YYYY-MM-DD HH:mm:ss")
                .toString()
            : null,
        package_type: !CommonConfig.isEmpty(packobj)
          ? this.state.PackageType
          : "",
        total_packages: packobj.filter((x) => x.Status === "Active").length,
        ContainerID: !CommonConfig.isEmpty(this.state.ContainerName.value)
          ? this.state.ContainerName.value
          : null,
        promo_code: "",
        is_agree: "",
        total_weight: !CommonConfig.isEmpty(senderobj)
          ? senderobj.TotalWeight
          : 0,
        total_chargable_weight: !CommonConfig.isEmpty(
          this.state.totalChargableWeight
        )
          ? this.state.totalChargableWeight
          : 0.0,
        total_insured_value: !CommonConfig.isEmpty(this.state.totalInsuredValue)
          ? this.state.totalInsuredValue
          : 0.0,
        duties_paid_by: this.state.DutiesPaidBy,
        total_declared_value: !CommonConfig.isEmpty(senderobj)
          ? senderobj.TotalDeclaredValue
          : 0,
        // dutyType: this.state.dutyType,
        userName: CommonConfig.loggedInUserData().LoginID,
        managed_by: this.state.ManagedBy.value,
        ServiceName: this.state.ServiceName.value,
        SubServiceName: this.state.SubServiceName.value,
        ShippingID: this.props.history.location.state.ShipppingID,
      };

      var from_address = {
        AddressID: senderobj.FromAddressID,
        country_id: this.state.selectedFromCountry.value,
        country_name: this.state.selectedFromCountry.label,
        company_name: this.state.FromCompanyName,
        contact_name: this.state.FromContactName,
        address_1: this.state.FromAddressLine1,
        address_2: this.state.FromAddressLine2,
        address_3: this.state.FromAddressLine3,
        MovingBack: CommonConfig.isEmpty(this.state.FromMovingBack.value)
          ? this.state.FromMovingBack
          : this.state.FromMovingBack.value,
        OriginalPassportAvailable: CommonConfig.isEmpty(
          this.state.FromOriginalPassortAvailable.value
        )
          ? this.state.FromOriginalPassortAvailable
          : this.state.FromOriginalPassortAvailable.value,
        EligibleForTR: CommonConfig.isEmpty(this.state.FromEligibleForTR.value)
          ? this.state.FromEligibleForTR
          : this.state.FromEligibleForTR.value,
        city_id: 1,
        city_name: CommonConfig.isEmpty(this.state.fromCity.value)
          ? this.state.fromCity
          : this.state.fromCity.value,
        state_id: 1,
        state_name: CommonConfig.isEmpty(this.state.fromState.value)
          ? this.state.fromState
          : this.state.fromState.value,
        zip_code: this.state.FromZipCode,
        phone1: this.state.FromPhone1,
        phone2: this.state.FromPhone2,
        email: this.state.FromEmail,
      };

      var to_address = {
        AddressID: recipientobj.ToAddressID,
        country_id: this.state.selectedToCountry.value,
        country_name: this.state.selectedToCountry.label,
        company_name: this.state.ToCompanyName,
        contact_name: this.state.ToContactName,
        address_1: this.state.ToAddressLine1,
        address_2: this.state.ToAddressLine2,
        address_3: this.state.ToAddressLine3,
        city_id: 2,
        city_name: CommonConfig.isEmpty(this.state.toCity.value)
          ? this.state.toCity
          : this.state.toCity.value,
        state_id: 1,
        state_name: CommonConfig.isEmpty(this.state.toState.value)
          ? this.state.toState
          : this.state.toState.value,
        zip_code: this.state.ToZipCode,
        phone1: this.state.ToPhone1,
        phone2: this.state.ToPhone2,
        email: this.state.ToEmail,
      };
      for (var j = 0; j < bankObj.length; j++) {
        let paymentData = {};
        paymentData = {
          PaymentID: bankObj[j]["PaymentID"],
          PaymentType: bankObj[j]["PaymentType"],
          name_on_card: bankObj[j]["CardName"],
          card_number: bankObj[j]["CardNumber"],
          card_type: bankObj[j]["CardType"],
          expiration_month: bankObj[j]["CardExpiryMonth"],
          expiration_year: bankObj[j]["CardExpiryYear"],
          cvv_code: bankObj[j]["CardCVV"],
          zip_code: bankObj[j]["CardZipCode"],
          name_on_bank_account: bankObj[j]["NameonAccount"],
          bank_name: bankObj[j]["BankName"],
          account_number: bankObj[j]["AccountNumber"],
          routing_number: bankObj[j]["RoutingNumber"],
          Status: bankObj[j]["Status"],
          InvoiceAmount: bankObj[j]["InvoiceAmount"],
          DatePaid: bankObj[j]["PaidDate"],
        };

        paymentdata.push(paymentData);
      }

      for (var j = 0; j < creditCardObj.length; j++) {
        let paymentData = {};
        paymentData = {
          PaymentID: creditCardObj[j]["PaymentID"],
          PaymentType: creditCardObj[j]["PaymentType"],
          name_on_card: creditCardObj[j]["CardName"],
          card_number: creditCardObj[j]["CardNumber"],
          card_type: creditCardObj[j]["CardType"],
          expiration_month: creditCardObj[j]["CardExpiryMonth"],
          expiration_year: creditCardObj[j]["CardExpiryYear"],
          cvv_code: creditCardObj[j]["CardCVV"],
          zip_code: creditCardObj[j]["CardZipCode"],
          name_on_bank_account: creditCardObj[j]["NameonAccount"],
          bank_name: creditCardObj[j]["BankName"],
          account_number: creditCardObj[j]["AccountNumber"],
          routing_number: creditCardObj[j]["RoutingNumber"],
          Status: creditCardObj[j]["Status"],
          InvoiceAmount: creditCardObj[j]["InvoiceAmount"],
          DatePaid: creditCardObj[j]["PaidDate"],
        };

        paymentdata.push(paymentData);
      }

      var FinalNotes = this.state.notes.filter(
        (x) => x.NoteText !== "" && x.NoteText !== null
      );
      var finalAttachment = [];
      for (var i = 0; i < this.state.Attachments.length; i++) {
        if (!this.state.Attachments[i].hasOwnProperty("TrackingNumber")) {
          if (this.state.Attachments[i].hasOwnProperty("AttachmentName")) {
            finalAttachment.push(this.state.Attachments[i]);
          }
        }
      }
      var objdata = {};
      if (this.state.IsChanged) {
        objdata = {
          UserID: CommonConfig.loggedInUserData().PersonID,
          TrackingNumber: this.state.TrackingNumber,
          shipments: shipments,
          trackingData: TrackingData,
          from_address: from_address,
          to_address: to_address,
          PaymentData: paymentdata,
          manualTrackingData: ManualTrackingData,
          packages: packages,
          commercial: commercial,
          Notes: FinalNotes,
          invoiceData: paymentInvoiceData,
          paymentReceivedData: paymentReceivedData,
          paymentIssued: paymentIssued,
          TotalCommercialvalue: "",
          sendemail: 1,
          DocumentList: finalAttachment,
          AllClear: this.state.AllClear,
          Amount: this.state.TotalCostReceived,
        };
      } else {
        objdata = {
          UserID: CommonConfig.loggedInUserData().PersonID,
          TrackingNumber: this.state.TrackingNumber,
          shipments: shipments,
          trackingData: TrackingData,
          from_address: from_address,
          to_address: to_address,
          PaymentData: paymentdata,
          manualTrackingData: ManualTrackingData,
          packages: packages,
          commercial: commercial,
          Notes: FinalNotes,
          invoiceData: paymentInvoiceData,
          paymentReceivedData: paymentReceivedData,
          paymentIssued: paymentIssued,
          TotalCommercialvalue: "",
          sendemail: 1,
          DocumentList: finalAttachment,
        };
      }
      var formData = new FormData();
      formData.append("data", JSON.stringify(objdata));

      if (this.state.AttachmentList.length > 0) {
        this.state.AttachmentList.forEach((file) => {
          formData.append("Attachments", file);
        });
      }
      this.showLoader();

      try {
        api
          .post("scheduleshipment/addshipments", formData)
          .then((res) => {
            if (res.success) {
              this.hideLoader();
              cogoToast.success("Updated Successfully");
              if (redirect) {
                this.props.history.push({
                  pathname: "/admin/ShipmentList",
                  state: {
                    myfilterlist:
                      this.props.history.location.state.myfilterlist !==
                      undefined
                        ? this.props.history.location.state.myfilterlist
                        : null,
                    type:
                      this.props.history.location.state.type !== undefined
                        ? this.props.history.location.state.type
                        : "MyShipment",
                    myshipmentstatusList:
                      this.props.history.location.state.myshipmentstatusList !==
                      undefined
                        ? this.props.history.location.state.myshipmentstatusList
                        : [],
                    mysortlist:
                      this.props.history.location.state.mysortlist !== undefined
                        ? this.props.history.location.state.mysortlist
                        : null,
                  },
                });
              } else {
                this.reCallApi();
              }
            } else {
              console.log("Schedule Shipment is Not Created in else");
              cogoToast.error("Schedule Shipment is Not Created!");
            }
          })
          .catch((err) => {
            console.log("error...", err);
          });
      } catch (err) {
        console.log("error..", err);
      }
    } else {
      let saveClicked = this.state.saveClicked;
      saveClicked.saveClick = true;
      saveClicked.redirect = redirect;
      this.setState({ IsAESOpen: true, saveClicked: saveClicked });
    }
  };

  handlePackageNoChange = (event) => {
    this.setState({ TotalPackages: event.target.value.replace(/\D/g, "") });
  };

  pickupChange = (date, type) => {
    if (type === "PickupDate") {
      this.setState({ PickupDate: date });
    }
  };

  typeChange = (event, type) => {
    if (type === "LocationType") {
      this.setState({ LocationType: event.target.value });
    } else if (type === "DutiesPaidBy") {
      this.setState({ DutiesPaidBy: event.target.value });
    } else if (type === "ShipmentStatus") {
      this.setState({ ShipmentStatus: event.target.value });
    }
  };

  handlePackageNoBlur = (event) => {
    let packageLength = this.state.PackageList.filter(
      (x) => x.Status === "Active"
    ).length;
    let CILength = this.state.commercialList.filter(
      (x) => x.Status === "Active"
    ).length;
    let packageList = this.state.PackageList.filter(
      (x) => x.Status === "Active"
    );
    let CIList = this.state.commercialList.filter((x) => x.Status === "Active");

    let val = Number(this.state.TotalPackages);

    if (val !== packageLength && val > packageLength) {
      let finalLength = val - packageLength;
      for (var i = 0; i < finalLength; i++) {
        this.addPackageRow();
      }
    } else if (val !== packageLength && val < packageLength) {
      let length = packageLength - val;
      let index = packageLength - 1;
      for (var k = 0; k < length; k++, index--) {
        if (
          packageList[index]["EstimetedWeight"] !== "" &&
          packageList[index]["EstimetedWeight"] !== 0
        ) {
          cogoToast.error(
            `Data found at row ${index}.Please remove row from Action`
          );
        } else {
          this.removePackageRow(packageList[index]["Index"]);
          this.removeCommercialInvoice(CIList[index]["Index"]);
        }
      }
    }
  };

  paymentPayAPI = () => {
    this.showLoader();
    var from_address = {
      contact_name: this.state.FromContactName,
      zip_code: this.state.FromZipCode,
    };

    var to_address = {
      contact_name: this.state.ToContactName,
      zip_code: this.state.ToZipCode,
    };
    this.state.PaymentShowData.from_address = from_address;
    this.state.PaymentShowData.to_address = to_address;
    this.state.PaymentShowData.UserID = CommonConfig.loggedInUserData().PersonID;
    this.state.PaymentShowData.ShippingID = this.props.history.location.state.ShipppingID;
    this.state.PaymentShowData.ContactName = this.state.FromContactName;
    try {
      api
        .post("authorizeNet/authorizeCreditCard", this.state.PaymentShowData)
        .then((result) => {
          if (result.success) {
            this.setState({ openpayment: false });
            this.hideLoader();
            cogoToast.success("Payment Done");
            window.location.reload();
          } else {
            this.setState({ openpayment: false });
            this.hideLoader();
            cogoToast.error(
              result.transactionResponse.errors.error[0].errorText
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  };

  PaymentPayChange = (event, type) => {
    if (type == "Amount") {
      var setdata = this.state.PaymentShowData;
      setdata.InvoiceAmount = event.target.value;
      this.setState({ PaymentShowData: setdata });
    }
    if (type == "CardZipCode") {
      this.state.PaymentShowData.CardZipCode = event.target.value;
    }
    if (type == "CardType") {
      this.state.PaymentShowData.CardType = event.target.value;
    }
    if (type == "CardCVV") {
      if (Number(this.state.PaymentShowData.CardCVV) == 0) {
        this.state.PaymentShowData.CVV = event.target.value;
      }
    }
    if (type == "CardNumber") {
      this.state.PaymentShowData.CardNumber = event.target.value;
    }
    if (type == "CardName") {
      this.state.PaymentShowData.CardName = event.target.value;
    }
    if (type == "TrackingNumber") {
      this.state.PaymentShowData.TrackingNumber = event.target.value;
    }
  };

  handleCancel = () => {
    this.props.history.push({
      pathname: "/admin/ShipmentList",
      state: {
        myfilterlist:
          this.props.history.location.state.myfilterlist !== undefined
            ? this.props.history.location.state.myfilterlist
            : null,
        type:
          this.props.history.location.state.type !== undefined
            ? this.props.history.location.state.type
            : "MyShipment",
        myshipmentstatusList:
          this.props.history.location.state.myshipmentstatusList !== undefined
            ? this.props.history.location.state.myshipmentstatusList
            : [],
        mysortlist:
          this.props.history.location.state.mysortlist !== undefined
            ? this.props.history.location.state.mysortlist
            : null,
      },
    });
  };

  viewShipmentCommercial = (type) => {
    if (type === "Commercial Invoice") {
      let printCommercialData = {
        ShippingID: this.props.location.state.ShipppingID,
        TotalReceivedCost: this.state.TotalReceivedCost,
        DatePaidOn: this.state.DatePaidOn,
        FromAddress: this.state.FromAddressObj,
        TrackingNumber: this.state.TrackingNumber,
        DocumentTrackingList: this.state.DocumentTrackingList,
        ToAddress: this.state.ToAddressObj,
        CommercialList: this.state.CommercialInvoiceList,
      };
      localStorage.setItem(
        "printCommercial",
        JSON.stringify(printCommercialData)
      );
      window.open(
        window.location.origin + "/auth/PrintCommercialInvoice",
        "_blank"
      );
    } else {
      let printInvoiceData = {
        ShippingID: this.props.location.state.ShipppingID,
        TotalReceivedCost: this.state.TotalReceivedCost,
        DatePaidOn: this.state.DatePaidOn,
        InvoiceData: this.state.DocumentInvoiceData,
        FromAddress: this.state.FromAddressObj,
        DocumentManagedBy: this.state.DocumentManagedBy,
        TrackingNumber: this.state.TrackingNumber,
        ToAddress: this.state.ToAddressObj,
      };
      localStorage.setItem("printInvoice", JSON.stringify(printInvoiceData));
      window.open(window.location.origin + "/auth/PrintInvoice", "_blank");
    }
  };

  render() {
    const {
      AllClear,
      TrackingNumber,
      ManagedBy,
      IsPickup,
      CreatedBy,
      ServiceName,
      PackageType,
      TotalPackages,
      TotalCostInvoice,
      Access,
      ReadOnly,
      TotalCostReceived,
      TotalCostIssued,
      TotalCostCommercial,
      PickupDate,
      DutiesPaidBy,
      LocationType,
      SubServiceName,
      Subservicename,
      ShipmentDate,
      ShipmentType,
      Steps,
      selectedFromCountry,
      ShipmentStatus,
      selectedToCountry,
      totalCFT,
      totalChargableWeight,
      YesNo,
      fromState,
      fromCity,
      toCity,
      toState,
      ContainerName,
      FromMovingBack,
      FromEligibleForTR,
      FromOriginalPassortAvailable,
      totalInsuredValue,
      isBackIndia,
      VisaCategory,
    } = this.state;
    const shipmentType = this.state.shipmentTypeList.map((type) => {
      return { value: type.Description, label: type.Description };
    });
    const containerName = this.state.ContainerNameList.map((container) => {
      return { value: container.ContainerID, label: container.ContainerName };
    });
    const managedBy = this.state.managedByList.map((type) => {
      return { value: type.UserID, label: type.Name };
    });
    const serviceName = this.state.ServiceList.map((type) => {
      return { value: type.MainServiceName, label: type.MainServiceName };
    });
    const subServiceName = this.state.SubServiceList.map((type) => {
      return { value: type.ServiceName, label: type.ServiceName };
    });
    const CountryOption = this.state.CountryList.map((Country) => {
      return { value: Country.CountryID, label: Country.CountryName };
    });
    const fromCityOptions = this.state.fromGoogleAPICityList.map((city) => {
      return { value: city.City_code, label: city.Name };
    });
    const fromStateOptions = this.state.fromStateList.map((state) => {
      return { value: state.StateName, label: state.StateName };
    });
    const toCityOptions = this.state.toGoogleAPICityList.map((city) => {
      return { value: city.City_code, label: city.Name };
    });
    const toStateOptions = this.state.toStateList.map((state) => {
      return { value: state.StateName, label: state.StateName };
    });
    const columns = [
      {
        Header: "Document Type",
        width: 225,
        filterable: false,
        sortable: false,
        maxWidth: 225,
        Cell: this.renderDocumentType,
      },
      {
        Header: "Document Name",
        accessor: "Name",
        width: 225,
        filterable: false,
        sortable: false,
        maxWidth: 225,
        Cell: this.renderDocumentName,
      },
      {
        Header: "CreatedOn",
        id: "DocumentCreatedOn",
        sortMethod: (a, b) => {
          return CommonConfig.dateSortMethod(a, b);
        },
        accessor: (data) => {
          return moment(data.DocumentCreatedOn).format(
            CommonConfig.dateFormat.dateOnly
          );
        },
        width: 110,
        filterable: false,
        sortable: false,
        maxWidth: 110,
      },
      {
        Header: "Attachment",
        accessor: "actions",
        width: 80,
        filterable: false,
        sortable: false,
        Cell: (record) => {
          return (
            <div>
              {record.original.AttachmentPath ? (
                !record.original.AttachmentPath.includes(
                  "auth/esign_client"
                ) ? (
                  <div>
                    <a
                      href={fileBase + record.original.AttachmentPath}
                      className="normal-btn sm-orange"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      VIEW FILE
                    </a>
                  </div>
                ) : (
                  <div>
                    <a
                      href={record.original.AttachmentPath + "/false"}
                      className="normal-btn sm-orange"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      VIEW FILE
                    </a>
                  </div>
                )
              ) : record.original.TrackingNumber &&
                record.original.DocumentType != "Passport Copy" ? (
                <Button
                  className="normal-btn sm-orange"
                  onClick={() =>
                    this.viewShipmentCommercial(record.original.DocumentType)
                  }
                >
                  View File
                </Button>
              ) : (
                <div>
                  <div className="custom-file-browse">
                    <span>Upload</span>
                    <input
                      type="file"
                      name="selectedfile"
                      id="file"
                      accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf, image/*"
                      className="normal-btn sm-orange"
                      onChange={(event) => this.fileUpload(event, record)}
                    />
                  </div>
                  <p>{this.stringTruncate(record.original.AttachmentName)}</p>
                </div>
              )}
            </div>
          );
        },
      },
      {
        width: 100,
        filterable: false,
        sortable: false,
        Header: "Status",
        Cell: (record) => {
          if (record.original.Status === "Active") {
            return (
              <Button color="success" className="normal-btn sm-orange">
                Approved
              </Button>
            );
          } else {
            return (
              <Button color="danger" className="normal-btn sm-orange">
                Pending
              </Button>
            );
          }
        },
      },
      {
        width: 100,
        filterable: false,
        sortable: false,
        Header: "Actions",
        Cell: (record) => {
          return (
            <div className="align-right">
              {(record.index !== 0 || record.original.AttachmentPath) &&
              !record.original.TrackingNumber &&
              record.original.Status === "Inactive" ? (
                <Button
                  justIcon
                  color="danger"
                  className="Plus-btn"
                  onClick={(e) => this.handleDocumentDelete(e, record.original)}
                >
                  <i className={"fas fa-minus"} />
                </Button>
              ) : null}
              {this.state.Attachments.filter((x) => x.Status != "Delete")
                .length ===
              record.index + 1 ? (
                <div className="align-right">
                  <Button
                    justIcon
                    color="facebook"
                    onClick={() => this.AddNewRowData()}
                    className="Plus-btn "
                  >
                    <i className={"fas fa-plus"} />
                  </Button>
                </div>
              ) : null}
              <Tooltip title={record.original.DocumentCreatedBy} arrow>
                <Button className="Plus-btn info-icon" justIcon color="twitter">
                  <InfoIcon />
                </Button>
              </Tooltip>
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
        <GridContainer justify="center" className="schedule-pickup-main-outer">
          <GridItem xs={12} sm={12}>
            <Card>
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <FlightTakeoff />
                </CardIcon>
                <h4 className="margin-right-auto text-color-black">
                  Shipment Information
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={4} md={3}>
                    <div className="select-spl">
                      <FormControl fullWidth>
                        <InputLabel
                          htmlFor="packagetype"
                          className={classes.selectLabel}
                        >
                          Shipment Status
                        </InputLabel>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu,
                          }}
                          classes={{
                            select: classes.select,
                          }}
                          id="package_number"
                          name="package_number"
                          value={ShipmentStatus}
                          disabled="true"
                          onChange={(event) =>
                            this.typeChange(event, "ShipmentStatus")
                          }
                        >
                          {this.shipmentStatusList()}
                        </Select>
                      </FormControl>
                    </div>
                  </GridItem>
                  <GridItem xs={12} sm={4} md={3}>
                    <FormControl fullWidth>
                      <CustomInput
                        type="number"
                        labelText="Tracking Number"
                        id="package_number"
                        name="package_number"
                        inputProps={{
                          disabled: true,
                          value: TrackingNumber,
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={4} md={3}>
                    <div className="select-spl">
                      <FormControl fullWidth>
                        <InputLabel
                          htmlFor="packagetype"
                          className={classes.selectLabel}
                        >
                          Package Type
                        </InputLabel>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu,
                          }}
                          classes={{
                            select: classes.select,
                          }}
                          disabled="true"
                          value={PackageType}
                          onChange={(event) =>
                            this.changePackage(event, "PackageType")
                          }
                          inputProps={{
                            name: "packagetype",
                            id: "packagetype",
                          }}
                        >
                          <MenuItem
                            value="Envelop"
                            classes={{
                              root: classes.selectMenuItem,
                            }}
                          >
                            Envelop
                          </MenuItem>
                          <MenuItem
                            value="Package"
                            classes={{
                              root: classes.selectMenuItem,
                            }}
                          >
                            Package
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </GridItem>
                  <GridItem xs={12} sm={4} md={3}>
                    <CustomInput
                      type="number"
                      labelText="No. of Packages"
                      id="package_number"
                      name="package_number"
                      inputProps={{
                        disabled: true,
                        value: TotalPackages,
                        onChange: (event) => this.handlePackageNoChange(event),
                        // onBlur : (event) => this.handlePackageNoBlur(event)
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={3} md={3}>
                    <Autocomplete
                      id="combo-box-demo"
                      options={managedBy}
                      value={ManagedBy}
                      disabled="true"
                      onChange={(event, value) =>
                        this.selectChange(event, value, "ManagedBy")
                      }
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => (
                        <TextField {...params} label="Managed By" />
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={3} md={3}>
                    <Autocomplete
                      id="combo-box-demo"
                      options={shipmentType}
                      value={ShipmentType}
                      disabled="true"
                      onChange={(event, value) =>
                        this.selectChange(event, value, "ShipmentType")
                      }
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => (
                        <TextField {...params} label="Shipment Type" />
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={3} md={3}>
                    <Autocomplete
                      id="combo-box-demo"
                      options={serviceName}
                      disabled="true"
                      value={ServiceName}
                      onChange={(event, value) =>
                        this.selectChange(event, value, "ServiceType")
                      }
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => (
                        <TextField {...params} label="Service Type" />
                      )}
                    ></Autocomplete>
                  </GridItem>
                  <GridItem xs={12} sm={3} md={3}>
                    <Autocomplete
                      id="combo-box-demo"
                      disabled={Subservicename}
                      value={SubServiceName}
                      options={subServiceName}
                      onChange={(event, value) =>
                        this.selectChange(event, value, "SubServiceType")
                      }
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => (
                        <TextField {...params} label="Sub Service Type" />
                      )}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer justify="center" className="schedule-pickup-main-outer">
          <GridItem xs={12} sm={12}>
            <div className="shipment-nav">
              <ul>
                {Steps.map((step, key) => {
                  return key === 2 &&
                    (this.state.PackageType === "Envelop" ||
                      this.state.selectedFromCountry.value ===
                        this.state.selectedToCountry.value) ? null : (
                    <li>
                      <a
                        className={step.classname}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          this.navigateChange(key);
                        }}
                      >
                        <span>{step.stepName}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="shipment-content">
              <div className="shipment-pane" id="customerdetails">
                <div className="shipment-box">
                  <Card>
                    <CardHeader
                      className="btn-right-outer"
                      color="primary"
                      icon
                    >
                      <h4 className="margin-right-auto text-color-black">
                        Sender Information
                      </h4>
                    </CardHeader>
                    <CardBody className="shipment-cardbody">
                      <GridContainer className="MuiGrid-justify-xs-center">
                        <GridItem xs={12} sm={12} md={3}>
                          <CustomInput
                            labelText="Contact Name"
                            id="proposaltype"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              disabled: true,
                              value: this.state.FromContactName,
                              onChange: (event) =>
                                this.handleChangeFrom(event, "contactname"),
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.User}>
                                    perm_identity
                                  </Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          <CustomInput
                            labelText="Address Line 1"
                            id="proposaltype"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              disabled: true,
                              value: this.state.FromAddressLine1,
                              onChange: (event) =>
                                this.handleChangeFrom(event, "address1"),
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.User}>
                                    location_on
                                  </Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          <CustomInput
                            labelText="Address Line 2"
                            id="proposaltype"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              disabled: true,
                              value: this.state.FromAddressLine2,
                              onChange: (event) =>
                                this.handleChangeFrom(event, "address2"),
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.User}>
                                    location_on
                                  </Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          <CustomInput
                            labelText="Address Line 3"
                            id="proposaltype"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              disabled: true,
                              value: this.state.FromAddressLine3,
                              onChange: (event) =>
                                this.handleChangeFrom(event, "address3"),
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.User}>language</Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </GridItem>
                      </GridContainer>
                      <GridContainer className="MuiGrid-justify-xs-center">
                        <GridItem xs={12} sm={12} md={3}>
                          <Autocomplete
                            options={CountryOption}
                            id="FromCountry"
                            getOptionLabel={(option) =>
                              option.label ? option.label : option
                            }
                            value={selectedFromCountry}
                            autoSelect
                            disabled="true"
                            onChange={(event, value) =>
                              this.selectChangeTab1(event, value, "FromCountry")
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={this.state.pickupcountryErr}
                                helperText={this.state.pickupcountryHelperText}
                                label="From Country"
                                fullWidth
                              />
                            )}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          <CustomInput
                            labelText="Zip"
                            id="proposaltype"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              disabled: true,
                              value: this.state.FromZipCode,
                              onChange: (event) =>
                                this.handleChangeFrom(event, "zip"),
                              onBlur: (event) =>
                                this.handleBlur(event, "FromZipCode"),
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.User}>
                                    local_post_office
                                  </Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          {this.state.fromCityAutoComplete === false ? (
                            <CustomInput
                              labelText="City"
                              id="city"
                              formControlProps={{ fullWidth: true }}
                              inputProps={{
                                disabled: true,
                                value: fromCity,
                                onChange: (event) =>
                                  this.handleCityStateChange(event, "fromCity"),
                                endAdornment: (
                                  <InputAdornment
                                    position="end"
                                    className={classes.inputAdornment}
                                  >
                                    <Icon>location_city</Icon>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          ) : (
                            <Autocomplete
                              options={fromCityOptions}
                              id="fromcity"
                              autoSelect
                              disabled="true"
                              getOptionLabel={(option) => option.label}
                              value={fromCity}
                              onChange={(event, value) =>
                                this.ChangeFromCity(event, value)
                              }
                              renderInput={(params) => (
                                <TextField {...params} label="City" fullWidth />
                              )}
                            />
                          )}
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          {this.state.fromStateAutoComplete === false ? (
                            <CustomInput
                              labelText="State"
                              id="state"
                              formControlProps={{ fullWidth: true }}
                              inputProps={{
                                disabled: true,
                                value: fromState,
                                onChange: (event) =>
                                  this.handleCityStateChange(
                                    event,
                                    "fromState"
                                  ),
                                endAdornment: (
                                  <InputAdornment
                                    position="end"
                                    className={classes.inputAdornment}
                                  >
                                    <Icon>location_city</Icon>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          ) : (
                            <Autocomplete
                              options={fromStateOptions}
                              id="fromState"
                              autoSelect
                              disabled="true"
                              getOptionLabel={(option) => option.label}
                              value={fromState}
                              onChange={(event, value) =>
                                this.ChangeFromState(event, value)
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
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
                            labelText="Company Name"
                            id="proposaltype"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              disabled: true,
                              value: this.state.FromCompanyName,
                              onChange: (event) =>
                                this.handleChangeFrom(event, "companyname"),
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.User}>
                                    assignment_ind
                                  </Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          <CustomInput
                            labelText="Phone 1"
                            id="proposaltype"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: this.state.FromPhone1,
                              disabled: true,
                              onChange: (event) =>
                                this.handleChangeFrom(event, "phone1"),
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.User}>call</Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          <CustomInput
                            labelText="Phone 2"
                            id="proposaltype"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: this.state.FromPhone2,
                              disabled: true,
                              onChange: (event) =>
                                this.handleChangeFrom(event, "phone2"),
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.User}>call</Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          <CustomInput
                            labelText="Email"
                            id="registeremail"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: this.state.FromEmail,
                              disabled: true,
                              onChange: (event) =>
                                this.handleChangeFrom(event, "email"),
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
                    </CardBody>
                  </Card>
                </div>

                <div className="shipment-box">
                  <Card>
                    <CardHeader
                      className="btn-right-outer"
                      color="primary"
                      icon
                    >
                      <h4 className="margin-right-auto text-color-black">
                        Receipent Details
                      </h4>
                    </CardHeader>
                    <CardBody className="shipment-cardbody">
                      <GridContainer className="MuiGrid-justify-xs-center">
                        <GridItem xs={12} sm={12} md={3}>
                          <CustomInput
                            labelText="Contact Name"
                            id="proposaltype"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              disabled: true,
                              value: this.state.ToContactName,
                              onChange: (event) =>
                                this.handleChangeTo(event, "contactname"),
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.User}>
                                    perm_identity
                                  </Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          <CustomInput
                            labelText="Address Line 1"
                            id="proposaltype"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              disabled: true,
                              value: this.state.ToAddressLine1,
                              onChange: (event) =>
                                this.handleChangeTo(event, "address1"),
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.User}>
                                    location_on
                                  </Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          <CustomInput
                            labelText="Address Line 2"
                            id="proposaltype"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              disabled: true,
                              value: this.state.ToAddressLine2,
                              onChange: (event) =>
                                this.handleChangeTo(event, "address2"),
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.User}>
                                    location_on
                                  </Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          <CustomInput
                            labelText="Address Line 3"
                            id="proposaltype"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              disabled: true,
                              value: this.state.ToAddressLine3,
                              onChange: (event) =>
                                this.handleChangeTo(event, "address3"),
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.User}>language</Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </GridItem>
                      </GridContainer>
                      <GridContainer className="MuiGrid-justify-xs-center">
                        <GridItem xs={12} sm={12} md={3}>
                          <FormControl fullWidth>
                            <Autocomplete
                              options={CountryOption}
                              id="ToCountry"
                              getOptionLabel={(option) =>
                                option.label ? option.label : option
                              }
                              disabled="true"
                              value={selectedToCountry}
                              autoSelect
                              onChange={(event, value) =>
                                this.selectChangeTab1(event, value, "ToCountry")
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  error={this.state.pickupcountryErr}
                                  helperText={
                                    this.state.pickupcountryHelperText
                                  }
                                  label="To Country"
                                  fullWidth
                                />
                              )}
                            />
                          </FormControl>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          <CustomInput
                            labelText="Zip"
                            id="proposaltype"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              disabled: true,
                              value: this.state.ToZipCode,
                              onChange: (event) =>
                                this.handleChangeTo(event, "zip"),
                              onBlur: (event) =>
                                this.handleBlur(event, "ToZipCode"),
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.User}>
                                    local_post_office
                                  </Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          {this.state.toCityAutoComplete === false ? (
                            <CustomInput
                              labelText="City"
                              id="city"
                              formControlProps={{ fullWidth: true }}
                              inputProps={{
                                disabled: true,
                                value: toCity,
                                onChange: (event) =>
                                  this.handleCityStateChange(event, "toCity"),
                                endAdornment: (
                                  <InputAdornment
                                    position="end"
                                    className={classes.inputAdornment}
                                  >
                                    <Icon>location_city</Icon>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          ) : (
                            <Autocomplete
                              options={toCityOptions}
                              id="tocity"
                              autoSelect
                              disabled="true"
                              getOptionLabel={(option) => option.label}
                              value={toCity}
                              onChange={(event, value) =>
                                this.ChangeToCity(event, value)
                              }
                              renderInput={(params) => (
                                <TextField {...params} label="City" fullWidth />
                              )}
                            />
                          )}
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          {this.state.toStateAutoComplete === false ? (
                            <CustomInput
                              labelText="State"
                              id="state"
                              formControlProps={{ fullWidth: true }}
                              inputProps={{
                                disabled: true,
                                value: toState,
                                onChange: (event) =>
                                  this.handleCityStateChange(event, "toState"),
                                endAdornment: (
                                  <InputAdornment
                                    position="end"
                                    className={classes.inputAdornment}
                                  >
                                    <Icon>location_city</Icon>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          ) : (
                            <Autocomplete
                              options={toStateOptions}
                              id="toState"
                              autoSelect
                              getOptionLabel={(option) => option.label}
                              value={toState}
                              disabled="true"
                              onChange={(event, value) =>
                                this.ChangeToState(event, value)
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
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
                            labelText="Company Name"
                            id="proposaltype"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              disabled: true,
                              value: this.state.ToCompanyName,
                              onChange: (event) =>
                                this.handleChangeTo(event, "companyname"),
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.User}>
                                    assignment_ind
                                  </Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          <CustomInput
                            labelText="Phone 1"
                            id="proposaltype"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: this.state.ToPhone1,
                              disabled: true,
                              onChange: (event) =>
                                this.handleChangeTo(event, "phone1"),
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.User}>call</Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          <CustomInput
                            labelText="Phone 2"
                            id="proposaltype"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: this.state.ToPhone2,
                              disabled: true,
                              onChange: (event) =>
                                this.handleChangeTo(event, "phone2"),
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.User}>call</Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          <CustomInput
                            labelText="Email"
                            id="registeremail"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: this.state.ToEmail,
                              disabled: true,
                              onChange: (event) =>
                                this.handleChangeTo(event, "email"),
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
                    </CardBody>
                  </Card>
                </div>

                <div className="shipment-box mb-0">
                  <Card>
                    <CardHeader
                      className="btn-right-outer"
                      color="primary"
                      icon
                    >
                      <h4 className="margin-right-auto text-color-black">
                        Additional Details
                      </h4>
                    </CardHeader>
                    <CardBody className="shipment-cardbody">
                      <GridContainer>
                        <GridItem xs={12} sm={4} md={4}>
                          <CustomInput
                            labelText="Ship Date"
                            id="proposaltype"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              disabled: true,
                              value: moment(ShipmentDate).format(CommonConfig.dateFormat.dateOnly),
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.User}>person</Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4}>
                          <div className="select-spl">
                            <FormControl fullWidth>
                              <InputLabel
                                htmlFor="packagetype"
                                className={classes.selectLabel}
                              >
                                Location Type
                              </InputLabel>
                              <Select
                                disabled={true}
                                MenuProps={{
                                  className: classes.selectMenu,
                                }}
                                classes={{
                                  select: classes.select,
                                }}
                                value={LocationType}
                                onChange={(event) =>
                                  this.typeChange(event, "LocationType")
                                }
                              >
                                <MenuItem
                                  value="Residential"
                                  classes={{
                                    root: classes.selectMenuItem,
                                  }}
                                >
                                  Residential
                                </MenuItem>
                                <MenuItem
                                  value="Commercial"
                                  classes={{
                                    root: classes.selectMenuItem,
                                  }}
                                >
                                  Commercial
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </div>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4}>
                          <div className="select-spl">
                            <FormControl fullWidth>
                              <InputLabel
                                htmlFor="packagetype"
                                className={classes.selectLabel}
                              >
                                Duties & Taxes Paid By
                              </InputLabel>
                              <Select
                                disabled={true}
                                MenuProps={{
                                  className: classes.selectMenu,
                                }}
                                classes={{
                                  select: classes.select,
                                }}
                                value={DutiesPaidBy}
                                onChange={(event) =>
                                  this.typeChange(event, "DutiesPaidBy")
                                }
                              >
                                <MenuItem
                                  value="Recipient"
                                  classes={{
                                    root: classes.selectMenuItem,
                                  }}
                                >
                                  Recipient
                                </MenuItem>
                                <MenuItem
                                  value="Sender"
                                  classes={{
                                    root: classes.selectMenuItem,
                                  }}
                                >
                                  Sender
                                </MenuItem>
                                <MenuItem
                                  value="Not Applicable"
                                  classes={{
                                    root: classes.selectMenuItem,
                                  }}
                                >
                                  Not Applicable
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </div>
                        </GridItem>
                      </GridContainer>
                      {this.state.ShipmentType.value === "Ocean" ? (
                        <>
                          <GridContainer>
                            <GridItem sm={4} md={4}>
                              <div className="select-spl">
                                <FormControl
                                  fullWidth
                                  error={this.state.movingBackIndiaErr}
                                >
                                  <InputLabel className={classes.selectLabel}>
                                    Are you moving back to India?
                                  </InputLabel>
                                  <Select
                                    disabled={true}
                                    value={this.state.movingBackIndia}
                                    inputProps={{
                                      name: "movingBackIndia",
                                      id: "movingBackIndia",
                                    }}
                                  >
                                    {this.yesOrNo()}
                                  </Select>
                                  <FormHelperText>
                                    {this.state.movingBackIndiaHelperText}
                                  </FormHelperText>
                                </FormControl>
                              </div>
                            </GridItem>
                            {isBackIndia ? (
                              <>
                                <GridItem sm={4} md={4}>
                                  <CustomInput
                                    formControlProps={{ fullWidth: true }}
                                    labelText="Your Name as per passport?"
                                    error={this.state.nameAsperPassportErr}
                                    helperText={
                                      this.state.nameAsperPassportHelperText
                                    }
                                    inputProps={{
                                      disabled: true,
                                      value: this.state.NameAsPerPassport,
                                    }}
                                  />
                                </GridItem>
                                <GridItem sm={4} md={4}>
                                  <div className="select-spl">
                                    <FormControl
                                      fullWidth
                                      error={this.state.yearsOutsideIndiaErr}
                                    >
                                      <InputLabel
                                        className={classes.selectLabel}
                                      >
                                        For how many years you have outside
                                        India?
                                      </InputLabel>
                                      <Select
                                        disabled={true}
                                        value={this.state.YearsOutsideIndia}
                                        inputProps={{
                                          name: "yearsoutsideIndia",
                                          id: "yearsoutsideIndia",
                                        }}
                                      >
                                        {this.yearsRender()}
                                      </Select>
                                      <FormHelperText>
                                        {this.state.yearsOutsideIndiaHelperText}
                                      </FormHelperText>
                                    </FormControl>
                                  </div>
                                </GridItem>
                              </>
                            ) : null}
                          </GridContainer>
                          {isBackIndia ? (
                            // <>
                            <GridContainer>
                              <GridItem sm={4} md={4}>
                                <div className="select-spl">
                                  <FormControl
                                    fullWidth
                                    error={this.state.stayinIndiaErr}
                                  >
                                    <InputLabel className={classes.selectLabel}>
                                      Stayed in India for more than 6 months in
                                      last 2 years?
                                    </InputLabel>
                                    <Select
                                      disabled={true}
                                      value={this.state.StayInIndia}
                                      inputProps={{
                                        name: "stayinIndia",
                                        id: "stayinIndia",
                                      }}
                                    >
                                      {this.yesOrNo()}
                                    </Select>
                                    <FormHelperText>
                                      {this.state.stayinIndiaHelperText}
                                    </FormHelperText>
                                  </FormControl>
                                </div>
                              </GridItem>
                              <GridItem sm={4} md={4}>
                                <div className="select-spl">
                                  <FormControl
                                    fullWidth
                                    error={this.state.appliedForTRErr}
                                  >
                                    <InputLabel className={classes.selectLabel}>
                                      Have you applied for TR in last 3 years?
                                    </InputLabel>
                                    <Select
                                      disabled={true}
                                      value={this.state.AppliedForTR}
                                      inputProps={{
                                        name: "appliedForTR",
                                        id: "appliedForTR",
                                      }}
                                    >
                                      {this.yesOrNo()}
                                    </Select>
                                    <FormHelperText>
                                      {this.state.appliedForTRHelperText}
                                    </FormHelperText>
                                  </FormControl>
                                </div>
                              </GridItem>
                              <GridItem sm={4} md={4}>
                                <div className="select-spl">
                                  <FormControl
                                    fullWidth
                                    error={this.state.ableToProvidePassportErr}
                                  >
                                    <InputLabel className={classes.selectLabel}>
                                      Will Provide Passport for Custom
                                      Clearance?
                                    </InputLabel>
                                    <Select
                                      disabled={true}
                                      value={this.state.AbleToProvidePassport}
                                      inputProps={{
                                        name: "ableToProvidePassport",
                                        id: "ableToProvidePassport",
                                      }}
                                    >
                                      {this.yesOrNo()}
                                    </Select>
                                    <FormHelperText>
                                      {
                                        this.state
                                          .ableToProvidePassportHelperText
                                      }
                                    </FormHelperText>
                                  </FormControl>
                                </div>
                              </GridItem>
                            </GridContainer>
                          ) : null}
                          {isBackIndia ? (
                            <GridContainer>
                              <GridItem sm={4} md={4}>
                                <CustomInput
                                  formControlProps={{ fullWidth: true }}
                                  labelText="Your latest arrival date in India?"
                                  error={this.state.arrivalDateErr}
                                  helperText={this.state.arrivalDateHelperText}
                                  inputProps={{
                                    disabled: true,
                                    value: moment(
                                      this.state.LatestArrivalDate
                                    ).format(CommonConfig.dateFormat.dateOnly),
                                  }}
                                />
                              </GridItem>
                              <GridItem sm={4} md={4}>
                                <div className="select-spl">
                                  <FormControl
                                    fullWidth
                                    error={this.state.visaCategoryErr}
                                  >
                                    <InputLabel className={classes.selectLabel}>
                                      Arriving in India with?
                                    </InputLabel>
                                    <Select
                                      disabled={true}
                                      value={this.state.VisaCategory}
                                      inputProps={{
                                        name: "visaCategory",
                                        id: "visaCategory",
                                      }}
                                    >
                                      {this.visaCategoryMenu()}
                                    </Select>
                                    <FormHelperText>
                                      {this.state.visaCategoryHelperText}
                                    </FormHelperText>
                                  </FormControl>
                                </div>
                              </GridItem>
                              <GridItem sm={4} md={4}>
                                <CustomInput
                                  formControlProps={{ fullWidth: true }}
                                  labelText="Validity Date"
                                  error={this.state.visaDateErr}
                                  helperText={this.state.visaDateHelperText}
                                  inputProps={{
                                    disabled: true,
                                    value: moment(
                                      this.state.VisaValidDate
                                    ).format(CommonConfig.dateFormat.dateOnly),
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                          ) : null}
                        </>
                      ) : null}
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={4}>
                          <CustomInput
                            labelText="Username"
                            id="proposaltype"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              disabled: true,
                              value: CreatedBy,
                            }}
                          />
                        </GridItem>
                        {IsPickup ? (
                          <GridItem xs={12} sm={12} md={4}>
                            <CustomInput
                              formControlProps={{ fullWidth: true }}
                              labelText="Pickup Date"
                              inputProps={{
                                disabled: true,
                                value: moment(PickupDate).format(
                                  CommonConfig.dateFormat.dateOnly
                                ),
                              }}
                            />
                          </GridItem>
                        ) : null}
                      </GridContainer>
                    </CardBody>
                  </Card>
                </div>
              </div>
              <div className="shipment-pane" id="package">
                <Card>
                  <CardHeader className="btn-right-outer" color="primary" icon>
                    <h4 className="margin-right-auto text-color-black">
                      Package
                    </h4>
                  </CardHeader>
                  <CardBody className="shipment-cardbody">
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>
                        <div className="package-table">
                          <table id="PackageTable">
                            <thead>
                              <tr>
                                <th>Number</th>
                                {this.state.ShipmentType.value === "Ocean" ? (
                                  <>
                                    <th>Sequence</th>
                                    <th>Package Content</th>
                                  </>
                                ) : null}
                                <th>Weight</th>
                                <th>Dim(L)</th>
                                <th>Dim(W)</th>
                                <th>Dim(H)</th>
                                <th>Charge Weight</th>
                                {this.state.ShipmentType.value !== "Ocean" ? (
                                  <th>Insurance</th>
                                ) : null}
                                {this.state.ShipmentType.value === "Ocean" ? (
                                  <>
                                    <th>CFT</th>
                                    <th>Packed Type</th>
                                  </>
                                ) : null}
                                {/* <th>Action</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {this.viewPackage()}

                              <tr>
                                {this.state.ShipmentType.value !== "Ocean" ? (
                                  <td className="text-align-right" colSpan="5">
                                    <b>Total :</b>
                                  </td>
                                ) : (
                                  <td className="text-align-right" colSpan="7">
                                    <b>Total :</b>
                                  </td>
                                )}

                                {this.state.ShipmentType.value !== "Ocean" ? (
                                  <>
                                    <td>
                                      <CustomInput
                                        inputProps={{
                                          value: totalChargableWeight,
                                          disabled: true,
                                        }}
                                      />
                                    </td>
                                    <td colspan="1">
                                      <CustomInput
                                        inputProps={{
                                          value: parseFloat(
                                            totalInsuredValue
                                          ).toFixed(2),
                                          disabled: true,
                                        }}
                                      />
                                    </td>
                                  </>
                                ) : (
                                  <td>
                                    <CustomInput
                                      inputProps={{
                                        value: totalChargableWeight,
                                        disabled: true,
                                      }}
                                    />
                                  </td>
                                )}
                                {this.state.ShipmentType.value !==
                                "Ocean" ? null : (
                                  <td colSpan="2">
                                    <CustomInput
                                      inputProps={{
                                        value: parseFloat(totalCFT).toFixed(2),
                                        disabled: true,
                                      }}
                                    />
                                  </td>
                                )}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                </Card>
              </div>
              <div className="shipment-pane" id="commercialinvoice">
                <Card>
                  <CardHeader className="btn-right-outer" color="primary" icon>
                    <h4 className="margin-right-auto text-color-black">
                      Commercial Invoice
                    </h4>
                  </CardHeader>
                  <CardBody className="shipment-cardbody">
                    <GridContainer className="MuiGrid-justify-xs-center">
                      <GridItem xs={12} sm={12} md={12}>
                        <div className="package-table">
                          <table>
                            <thead>
                              <tr>
                                <th>Package Number</th>
                                <th>Package Content</th>
                                {this.state.ShipmentType.value !== "Ocean" ? (
                                  <>
                                    <th>Quantity</th>
                                    <th>Value Per Qty</th>
                                  </>
                                ) : null}
                                <th>Total Value</th>
                                {/* <th>Action</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {this.viewCommercialInvoice()}
                              <tr>
                                {this.state.ShipmentType.value !== "Ocean" ? (
                                  <td className="text-align-right" colSpan="4">
                                    <b>Total Cost:</b>
                                  </td>
                                ) : (
                                  <td className="text-align-right" colSpan="2">
                                    <b>Total Cost:</b>
                                  </td>
                                )}
                                <td colSpan="2">
                                  <CustomInput
                                    inputProps={{
                                      value: parseFloat(
                                        TotalCostCommercial
                                      ).toFixed(2),
                                      disabled: true,
                                    }}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                </Card>
              </div>
              <div className="shipment-pane" id="accounts">
                <Card>
                  <CardHeader className="btn-right-outer" color="primary" icon>
                    <h4 className="margin-right-auto text-color-black">
                      Invoice
                    </h4>
                  </CardHeader>
                  <CardBody className="shipment-cardbody">
                    <GridContainer className="MuiGrid-justify-xs-center">
                      <GridItem xs={12} sm={12} md={12}>
                        <div className="package-table no-scroll">
                          <table>
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Service</th>
                                <th>Description</th>
                                <th>Qty</th>
                                <th>Cost</th>
                                <th>Total</th>
                                {/* <th>Action</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {this.viewInvoice()}
                              <tr>
                                <td className="text-align-right" colSpan="4">
                                  <b>Total Cost:</b>
                                </td>
                                <td className="text-align-right">
                                  <CustomInput
                                    inputProps={{
                                      value: parseFloat(
                                        TotalCostInvoice
                                      ).toFixed(2),
                                      disabled: true,
                                    }}
                                  />
                                </td>
                                <td></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader className="btn-right-outer" color="primary" icon>
                    <h4 className="margin-right-auto text-color-black">
                      Payment Made
                    </h4>
                  </CardHeader>
                  <CardBody className="shipment-cardbody">
                    <GridContainer className="MuiGrid-justify-xs-center">
                      <GridItem xs={12} sm={12} md={12}>
                        <div className="package-table no-scroll">
                          <table>
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Payment Type</th>
                                <th>Number</th>
                                <th>Confirmation</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.paymentReceived()}
                              <tr>
                                <td className="text-align-right" colSpan="4">
                                  <b>Total Cost:</b>
                                </td>
                                <td className="text-align-right">
                                  <CustomInput
                                    inputProps={{
                                      value: parseFloat(
                                        TotalCostReceived
                                      ).toFixed(2),
                                      disabled: true,
                                    }}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                </Card>
              </div>
              <div className="shipment-pane" id="tracking">
                <Card>
                  <CardHeader className="btn-right-outer" color="primary" icon>
                    <h4 className="margin-right-auto text-color-black">
                      Tracking
                    </h4>
                  </CardHeader>
                  <CardBody className="shipment-cardbody">
                    <GridContainer className="MuiGrid-justify-xs-center">
                      <GridItem xs={12} sm={12} md={12}>
                        <div className="package-table no-scroll">
                          <table>
                            <thead>
                              <tr>
                                {/* <th>Actual Date</th>
                                <th>Actual Time</th> */}
                                <th>Date</th>
                                <th>Time</th>
                                <th>Updates</th>
                                {/* <th>Action</th> */}
                              </tr>
                            </thead>
                            <tbody>{this.viewTrackingManual()}</tbody>
                          </table>
                        </div>
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                </Card>
              </div>
              <div className="shipment-pane" id="documentations">
                <Card>
                  <CardHeader className="btn-right-outer" color="primary" icon>
                    <h4 className="margin-right-auto text-color-black">
                      Documentation
                    </h4>
                  </CardHeader>
                  <CardBody className="shipment-cardbody">
                    <GridContainer justify="center">
                      <GridItem xs={12} sm={12} md={12}>
                        <div className="custom-react-table">
                          <ReactTable
                            data={this.state.Attachments.filter(
                              (x) => x.Status != "Delete"
                            )}
                            sortable={true}
                            filterable={true}
                            resizable={false}
                            minRows={2}
                            columns={columns}
                            defaultPageSize={10}
                            align="left"
                            className="-striped -highlight"
                          />
                        </div>
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                </Card>
              </div>
            </div>
          </GridItem>
        </GridContainer>

        <div>
          <Dialog
            open={this.state.confirmAllClear}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Confirm AllClear ?
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure want to change?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.setState({ confirmAllClear: false })}
                color="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={() => this.AllClearConfirm()}
                color="primary"
                autoFocus
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </div>
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
                color="secondary"
              >
                Cancel
              </Button>
              {/* {this.state.Access.DeleteAccess === 1 ? */}
              <Button
                onClick={() => this.deleteShipment()}
                color="primary"
                autoFocus
              >
                Delete
              </Button>
              {/* :null} */}
            </DialogActions>
          </Dialog>
        </div>
        <div>
          <Dialog
            open={this.state.openpayment}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Card Details</DialogTitle>
            <DialogContent>
              <CustomInput
                type="number"
                labelText="CardType"
                name="CardType"
                id="TotalPackages"
                inputProps={{
                  onChange: (event) => {
                    this.PaymentPayChange(event, "CardType");
                  },
                  value: this.state.PaymentShowData.CardType,
                  disabled: true,
                }}
              />
              <CustomInput
                type="number"
                labelText="CardExpiry Date"
                name="CardExpiry Date"
                id="TotalPackages"
                inputProps={{
                  // onChange: (event) => { this.PaymentPayChange(event, 'CardName') },
                  value:
                    this.state.PaymentShowData.CardExpiryMonth +
                    "/" +
                    this.state.PaymentShowData.CardExpiryYear,
                  disabled: true,
                }}
              />
              <CustomInput
                type="number"
                labelText="CardName"
                name="CardName"
                id="TotalPackages"
                inputProps={{
                  onChange: (event) => {
                    this.PaymentPayChange(event, "CardName");
                  },
                  value: this.state.PaymentShowData.CardName,
                  disabled: true,
                }}
              />
              <CustomInput
                type="number"
                labelText="CardCVV"
                name="CardCVV"
                id="CardCVV"
                inputProps={{
                  onChange: (eee) => {
                    this.PaymentPayChange(eee, "CardCVV");
                  },
                  value:
                    Number(this.state.PaymentShowData.CardCVV) == 0
                      ? this.state.PaymentShowData.CVV
                      : this.state.PaymentShowData.CardCVV,
                  disabled:
                    Number(this.state.PaymentShowData.CardCVV) == 0
                      ? false
                      : true,
                }}
              />
              <CustomInput
                type="number"
                labelText="CardNumber"
                name="CardNumber"
                id="TotalPackages"
                inputProps={{
                  onChange: (event) => {
                    this.PaymentPayChange(event, "CardNumber");
                  },
                  value: this.state.PaymentShowData.CardNumber,
                  disabled: true,
                }}
              />
              <CustomInput
                type="number"
                labelText="CardZipCode"
                name="CardZipCode"
                id="TotalPackages"
                inputProps={{
                  onChange: (event) => {
                    this.PaymentPayChange(event, "CardZipCode");
                  },
                  value: this.state.PaymentShowData.CardZipCode,
                  disabled: true,
                }}
              />
            </DialogContent>

            <DialogTitle id="alert-dialog-title">Charge Details</DialogTitle>
            <DialogContent>
              <div className="select-spl">
                <FormControl fullWidth className="input-select-outer">
                  <InputLabel
                    htmlFor="packagetype"
                    className={classes.selectLabel}
                  >
                    Charge Type:
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu,
                    }}
                    classes={{
                      select: classes.select,
                    }}
                    value={this.state.PaymentShowData.ChargeType}
                    onChange={(event) => {
                      this.state.PaymentShowData.ChargeType =
                        event.target.value;
                    }}
                    // inputProps={{ disabled: ReadOnly }}
                  >
                    <MenuItem
                      value={"Charge"}
                      classes={{
                        root: classes.selectMenuItem,
                      }}
                    >
                      Charge
                    </MenuItem>
                    <MenuItem
                      value={"Refund"}
                      classes={{
                        root: classes.selectMenuItem,
                      }}
                    >
                      Refund
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
              <CustomInput
                type="number"
                labelText="TrackingNumber"
                name="TrackingNumber"
                id="TotalPackages"
                inputProps={{
                  onChange: (event) => {
                    this.PaymentPayChange(event, "TrackingNumber");
                  },
                  value: this.state.TrackingNumber,
                  disabled: true,
                }}
              />
              <CustomInput
                type="number"
                labelText="Amount"
                name="Amount"
                id="TotalPackages"
                inputProps={{
                  onChange: (event) => {
                    this.PaymentPayChange(event, "Amount");
                  },
                  value: this.state.PaymentShowData.InvoiceAmount,
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.setState({ openpayment: false })}
                color="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={() => this.paymentPayAPI()}
                color="primary"
                autoFocus
              >
                Charge Now
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        <div>
          <Dialog
            open={this.state.IsAESOpen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Automated Export System (AES) Filing Requirement
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                As export/commercial value of your shipment is more than $2500
                value Automated Export System (AES) filing is required.
                Additional AES filing fees of $75.00 will be applied on your
                shipment.{" "}
                <a href="https://www.cbp.gov/sites/default/files/assets/documents/2016-Mar/AES%20Key%20Words%20Document.pdf">
                  Click here
                </a>{" "}
                to review AES Quick Reference Guide{" "}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.setState({ IsAESOpen: false })}
                color="secondary"
                className="aesfilling-btn"
              >
                <b>REJECT</b>
                <span>Change Commercial Value</span>
              </Button>
              <Button
                onClick={() => this.addAESFillingInvoice()}
                color="primary"
                className="aesfilling-btn"
              >
                <b>ACCEPT</b>
                <span>Charge AES Filing Fees</span>
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        <div className="shipment-submit">
          {this.state.ShipmentStatus === "New Request" ||
          this.state.ShipmentStatus === "Pickup Scheduled" ||
          this.state.ShipmentStatus === "In Consolidation" ? (
            <div className="right">
              {this.state.Access.WriteAccess === 1 ? (
                <>
                  <Button
                    justify="center"
                    color="rose"
                    onClick={() => this.handleSave(false)}
                  >
                    Save
                  </Button>
                  <Button
                    justify="center"
                    color="primary"
                    onClick={() => this.handleSave(true)}
                  >
                    Save & Exit
                  </Button>
                </>
              ) : null}

              <Button
                justify="center"
                color="secondary"
                onClick={() => this.handleCancel()}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="center">
              <Button
                justify="center"
                color="danger"
                onClick={() => this.handleCancel()}
              >
                Back to My Shipment
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
MyShipmentNew.propTypes = {
  classes: PropTypes.object,
};

export default withStyles()(MyShipmentNew);
