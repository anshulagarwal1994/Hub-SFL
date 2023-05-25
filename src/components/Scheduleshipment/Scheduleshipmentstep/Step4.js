/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import moment from "moment";
//import FormControlLabel from "@material-ui/core/FormControlLabel";
import withStyles from "@material-ui/core/styles/withStyles";
import cogoToast from "cogo-toast";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import { CommonConfig } from "../../../utils/constant";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Radio from "@material-ui/core/Radio";
// material ui icons

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import MenuItem from "@material-ui/core/MenuItem";
import { createFalse } from "typescript";

const useStyles = makeStyles(styles);
const classes = () => {
  return useStyles();
};

class Scheduleshipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      simpleSelect: "",
      desgin: false,
      code: false,
      develop: false,

      PackageDetails: [],

      PackageType: [
        { value: "Envelop", label: "Documents (Under 0.5Lbs)" },
        { value: "Package", label: "Package" },
      ],

      DutiesandTaxes: [
        { value: "Recipient", label: "Recipient [No Additional Fees]" },
        { value: "Sender", label: "Sender [Additional $15 Fees Applies]" },
      ],

      shipmentType: "",
      fromCountryCode: "",
      toCountryCode: "",

      dutyType: "Recipient",
      selectedPackageType: "Package",

      globalCommercialcount: 1,

      IsPackage: true,
      IsCommercial: true,

      commercialData: [],

      GetRate: {
        WeightType: "LBS",
        PickUp: "No",
        Residential: "No",

        TotalWeight: 0,
        TotalChargableWeight: 0,
        TotalInsuredValue: 0,
      },

      ObjDocument: {
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
        PackageWeight: 0.0,
        PackageWidth: 0.0,
        PackageLength: 0.0,
        PackageHeight: 0.0,
        PackageChargableWeight: 0,
        PackageInsuredValue: 0,
      },

      ObjCommercial: {
        package_number: 1,
        content_description: "",
        quantity: "",
        value_per_qty: "",
        total_value: 0,
      },

      commercialDataHeader: {
        package_number: "Package Number",
        content_description: "Content Description",
        quantity: "Quantity",
        value_per_qty: "Value Per Qty",
        total_value: "Total Value",
      },

      No_packageType: [
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
      ],

      values: [{ name: "1", id: 1 }],

      selectedPackageNumbers: { value: "1", label: "1" },
      disableGetrate: false,
      IsAlreadyAESFilled: false,
      IsAESOpen: false,
      PaymentInvoiceData: [],
      IsInsuredValueError: false,
    };

    this.state.PackageDetails = [this.state.ObjPackage];

    this.state.commercial_data = [];
    for (var i = 0; i < this.state.globalCommercialcount; i++) {
      this.state.commercialData.push(this.state.ObjCommercial);
    }
  }
  
  componentWillReceiveProps(nextProps) {
    const schedulePickup = nextProps.allStates.schedulepickup;

    if (
      nextProps.props.location.state !== undefined &&
      nextProps.props.location.state !== null
    ) {
      if (
        nextProps.props.location.state.GetRateData != undefined &&
        nextProps.props.location.state.GetRateData != ""
      ) {
        let packageLen =
          nextProps.props.location.state.GetRateData.PackageDetails.length;
        let packObj = { value: packageLen, label: packageLen };
        this.setState({
          selectedPackageType:
            nextProps.props.location.state.GetRateData.PackageType === "Package"
              ? "Package"
              : "Envelop",
          IsPackage:
            nextProps.props.location.state.GetRateData.PackageType === "Package"
              ? true
              : false,
          PackageDetails:
            nextProps.props.location.state.GetRateData.PackageDetails,
          disableGetrate: true,
          selectedPackageNumbers: packObj,
        });

        if (this.state.selectedPackageNumbers.value > 0) {
          this.PackageCount(this.state.selectedPackageNumbers.value);
        }
        this.state.disableGetrate = true;
        this.Calculate();
      }
    }
    if (!CommonConfig.isEmpty(schedulePickup)) {
      // if(nextProps.props.location.state && nextProps.props.location.state.GetRateData != undefined && nextProps.props.location.state.GetRateData !=''){
      if (nextProps.allStates.schedulepickup.skipstep2) {
        let packageLength = nextProps.allStates.schedulepickup.PckgList.length;
        let packOBJ = { value: packageLength, label: packageLength };
        this.setState({
          selectedPackageType:
            nextProps.allStates.schedulepickup.PackageType === "Package"
              ? "Package"
              : "Envelop",
          disableGetrate: true,
          IsPackage:
            nextProps.allStates.schedulepickup.PackageType === "Package"
              ? true
              : false,
          PackageDetails: nextProps.allStates.schedulepickup.PckgList,
          selectedPackageNumbers: packOBJ,
        });
        this.state.disableGetrate = true;
        this.Calculate();
      }
      // }

      this.setState({
        fromCountryCode: schedulePickup.GetRate.FromCountry.CountryCode,
        toCountryCode: schedulePickup.GetRate.ToCountry.CountryCode,
        shipmentType: schedulePickup.selectedShipmentType,
        IsCommercial:
          schedulePickup.FromSelectedCountry.value ===
          schedulePickup.ToSelectedCountry.value
            ? false
            : true,
      });

      this.packageType(this.state.selectedPackageType);
    }
  }

  handleSimple = (event) => {
    this.setState({ simpleSelect: event.target.value });
  };

  sendState() {
    return this.state;
  }

  packageType = (event) => {
    if (event == this.state.selectedPackageType) {
      var GetRate = this.state.GetRate;

      if (event == "Envelop") {
        this.setState({
          IsPackage: false,
          PackageDetails: [this.state.ObjDocument],
        });

        GetRate.TotalWeight = 0.5;
        GetRate.TotalChargableWeight = 0.5;
        GetRate.TotalInsuredValue = 0.0;
        GetRate.PackageNumber = 1;
        this.setState({ GetRate: GetRate });
      } else if (event == "Package") {
        this.setState({
          IsPackage: true,
        });
        for (var i = 0; i < this.state.PackageDetails.length; i++) {
          GetRate.TotalWeight = this.state.PackageDetails[i].PackageWeight;
          GetRate.TotalInsuredValue = this.state.PackageDetails[
            i
          ].PackageInsuredValue;
          GetRate.TotalChargableWeight = "";
        }
        this.Calculate();
        // this.setState({ GetRate: GetRate });
      }
    } else {
      var GetRate = this.state.GetRate;

      this.setState({ selectedPackageType: event.target.value });

      if (event.target.value == "Envelop") {
        this.setState({
          IsPackage: false,
          PackageDetails: [this.state.ObjDocument],
        });

        GetRate.TotalWeight = 0.5;
        GetRate.TotalChargableWeight = 0.5;
        GetRate.TotalInsuredValue = 0.0;
        GetRate.PackageNumber = 1;
        this.setState({ GetRate: GetRate });
      } else if (event.target.value == "Package") {
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
  };

  appendNoOfPackages() {
    return this.state.No_packageType.map((no) => {
      return (
        <MenuItem classes={{ root: classes.selectMenuItem }} value={no.value}>
          {" "}
          {no.value}{" "}
        </MenuItem>
      );
    });
  }

  appendDutiesandTaxes() {
    return this.state.DutiesandTaxes.map((dutiesType) => {
      return (
        <MenuItem
          classes={{ root: classes.selectMenuItem }}
          value={dutiesType.value}
        >
          {" "}
          {dutiesType.label}{" "}
        </MenuItem>
      );
    });
  }

  PackageCount = (event) => {
    if (event > 0) {
      // console.log("package details ......", this.state.PackageDetails);
      var totalpackage = Number(event);

      if (totalpackage > this.state.PackageDetails.length) {
        for (let i = this.state.PackageDetails.length; i < totalpackage; i++) {
          this.AddNewRowData();
        }
      } else if (totalpackage == this.state.PackageDetails.length) {
      } else if (totalpackage < this.state.PackageDetails.length) {
        var PackageDetails = this.state.PackageDetails;
        var toremove = totalpackage - this.state.PackageDetails.length;
        PackageDetails.splice(toremove, this.state.PackageDetails.length);
        this.state.values.splice(toremove, this.state.values.length);

        this.setState({ PackageDetails: PackageDetails });
      }
    } else {
      this.setState({
        selectedPackageNumbers: {
          label: event.target.value,
          value: event.target.value,
        },
      });
      var totalpackage = Number(event.target.value);

      if (totalpackage > this.state.PackageDetails.length) {
        for (let i = this.state.PackageDetails.length; i < totalpackage; i++) {
          this.AddNewRowData();
        }
      } else if (totalpackage == this.state.PackageDetails.length) {
      } else if (totalpackage < this.state.PackageDetails.length) {
        var PackageDetails = this.state.PackageDetails;
        var toremove = totalpackage - this.state.PackageDetails.length;
        PackageDetails.splice(toremove, this.state.PackageDetails.length);
        this.state.values.splice(toremove, this.state.values.length);

        this.setState({ PackageDetails: PackageDetails });
      }
    }
  };

  OpenGetrate = (value) => {
    this.setState({ IsInsuredValueError: false });
    if (value) {
      const { history } = this.props.props;
      var stateset = {};
      if (!CommonConfig.isEmpty(this.props.props.location.state)) {
        if (this.props.props.location.state.skipstep1 === true) {
          stateset = this.props.props.location.state.state;
        }
      }
      history.push({
        pathname: "GetRates",
        state: { state: stateset },
      });
    }
  };

  changeDutyType = (event) => {
    this.setState({ dutyType: event.target.value });
  };

  AddNewRowData = function() {
    if (this.state.PackageDetails.length >= this.state.MaxPackageCount) {
      alert("Sorry you can not add more packages.");
    } else {
      var PackageDetails = this.state.PackageDetails;
      PackageDetails.push(this.state.ObjPackage);

      let arr = [];
      for (let i = 0; i < PackageDetails.length; i++) {
        let val = i + 1;
        arr.push({ name: String(val), id: val });
      }
      this.setState({
        values: arr,
        PackageDetails: PackageDetails,
        selectedPackageNumbers: {
          label: PackageDetails.length,
          value: PackageDetails.length,
        },
      });
      this.Calculate();
    }
  };

  Calculate() {
    if (this.state.fromCountryCode && this.state.toCountryCode) {
      var TotalChargeWeight = 0;
      var TotalInsuredValue = 0;
      var TotalWeight = 0;
      var TotalChargable = 0;
      console.log('packagedetail: ',this.state.PackageDetails);
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

        if (
          this.state.fromCountryCode == "US" &&
          this.state.toCountryCode == "US"
        ) {
          Total =
            Math.ceil(parseFloat((WE * LE * HE) / 166)) *
            PackageDetails[i].PackageNumber;
        } else {
          Total =
            Math.ceil(parseFloat((WE * LE * HE) / 139)) *
            PackageDetails[i].PackageNumber;
        }

        if (
          this.state.fromCountryCode == "IN" &&
          this.state.toCountryCode == "US"
        ) {
          Total =
            Math.ceil(parseFloat(parseFloat(Total) / parseFloat(2.2))) *
            PackageDetails[i].PackageNumber;
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

  OnCommercialValueChange = (name, Cindex) => (event) => {
    var newCommercialDetail = this.state.commercialData.map((data, index) => {
      if (Cindex === index) {
        let re = /^[0-9\b]+$/;
        let nameRegExp = /^[a-zA-Z]+[a-zA-Z-\s']*$/;

        if (name === "package_number") {
          return { ...data, package_number: event.target.value };
        } else if (name === "content_description") {
          if (
            event.target.value === "" ||
            nameRegExp.test(event.target.value)
          ) {
            return { ...data, content_description: event.target.value };
          } else {
            return { ...data, content_description: data.content_description };
          }
        } else if (name === "quantity") {
          if (
            (event.target.value === "" || re.test(event.target.value)) &&
            Number(event.target.value) <= 99
          ) {
            return { ...data, quantity: event.target.value };
          } else {
            return { ...data, quantity: data.quantity };
          }
        } else if (name === "value_per_qty") {
          let regexp = /[a-zA-Z~`!@#$%^&*()_+=-{}|:"<>?,;']+$/;

          if (
            event.target.value === "" ||
            event.target.value === null ||
            event.target.value === undefined
          ) {
            return { ...data, value_per_qty: "" };
          } else if (regexp.test(event.target.value)) {
            return {
              ...data,
              value_per_qty: this.state.commercialData[index].value_per_qty,
            };
          } else if (event.target.value <= 9999) {
            return { ...data, value_per_qty: event.target.value };
          } else {
            return {
              ...data,
              value_per_qty: this.state.commercialData[index].value_per_qty,
            };
          }
        } else if (name === "total_value") {
          return { ...data, total_value: event.target.value };
        }
      } else {
        return { ...data };
      }
    });

    this.setState({ commercialData: newCommercialDetail }, function() {
      this.CalculateComercial();
    });
  };

  InputValidate = (name, PIndex) => (evt) => {
    const NewPackageDetails = this.state.PackageDetails.map(
      (Package, index) => {
        if (PIndex === index) {
          if (name === "PackageNumber") {
            return { ...Package, PackageNumber: evt.target.value };
          } else if (name === "PackageWeight") {
            if (
              (evt.target.value === "" ||
                CommonConfig.RegExp.number.test(evt.target.value)) &&
              Number(evt.target.value) <= 999
            ) {
              return { ...Package, PackageWeight: evt.target.value };
            } else {
              return { ...Package, PackageWeight: Package.PackageWeight };
            }
          } else if (name === "PackageWidth") {
            if (
              (evt.target.value === "" ||
                CommonConfig.RegExp.number.test(evt.target.value)) &&
              Number(evt.target.value) <= 99
            ) {
              return { ...Package, PackageWidth: evt.target.value };
            } else {
              return { ...Package, PackageWidth: Package.PackageWidth };
            }
          } else if (name === "PackageLength") {
            if (
              (evt.target.value === "" ||
                CommonConfig.RegExp.number.test(evt.target.value)) &&
              Number(evt.target.value) <= 99
            ) {
              return { ...Package, PackageLength: evt.target.value };
            } else {
              return { ...Package, PackageLength: Package.PackageLength };
            }
          } else if (name === "PackageHeight") {
            if (
              (evt.target.value === "" ||
                CommonConfig.RegExp.number.test(evt.target.value)) &&
              Number(evt.target.value) <= 99
            ) {
              return { ...Package, PackageHeight: evt.target.value };
            } else {
              return { ...Package, PackageHeight: Package.PackageHeight };
            }
          } else if (name === "PackageChargableWeight") {
            return { ...Package, PackageChargableWeight: evt.target.value };
          } else if (name === "PackageInsuredValue") {
            if (CommonConfig.isEmpty(evt.target.value)) {
              return { ...Package, PackageInsuredValue: "" };
            } else if (CommonConfig.RegExp.onlyNumber.test(evt.target.value)) {
              return {
                ...Package,
                PackageInsuredValue: this.state.PackageDetails[index]
                  .PackageInsuredValue,
              };
            } else if (evt.target.value <= 9999) {
              return { ...Package, PackageInsuredValue: evt.target.value };
            } else {
              return {
                ...Package,
                PackageInsuredValue: this.state.PackageDetails[index]
                  .PackageInsuredValue,
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

  DeleteRowData = (DeleteIndex) => (evt) => {
    var PackageDetails = this.state.PackageDetails;
    PackageDetails.splice(DeleteIndex, 1);

    let arr = [];
    for (let i = 0; i < this.state.PackageDetails.length; i++) {
      let val = i + 1;
      arr.push({ name: String(val), id: val });
    }
    this.setState(
      {
        values: arr,
        PackageDetails: PackageDetails,
        selectedPackageNumbers: { value: PackageDetails.length },
      },
      function() {
        this.Calculate();
      }
    );
  };

  showAESMessage = (totalCost) => {
    let cost = totalCost ? totalCost : this.state.totalCommercial;
    if (cost > 2500 && !this.state.IsAlreadyAESFilled) {
      this.setState({ IsAESOpen: true });
    }
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
      Index: this.state.PaymentInvoiceData.length + 1,
    };
    this.setState({
      PaymentInvoiceData: [...this.state.PaymentInvoiceData, row],
      IsAESOpen: false,
      IsAlreadyAESFilled: true,
    });
  };

  appendNoOfCommercials() {
    return this.state.values.map((v, i) => {
      return (
        <MenuItem classes={{ root: classes.selectMenuItem }} value={v.id}>
          {v.name}
        </MenuItem>
      );
    });
  }

  formatCommercialValue = (name, Cindex) => (event) => {
    var newCommercialDetail = this.state.commercialData.map((data, index) => {
      if (Cindex === index) {
        if (name === "value_per_qty") {
          let regexp = /^[0-9]+(\.[0-9][0-9])?$/;
          let val = parseFloat(event.target.value).toFixed(2);

          if (regexp.test(val)) {
            return { ...data, value_per_qty: val };
          } else {
            return { ...data };
          }
        }
      } else {
        return { ...data };
      }
    });

    this.setState({ commercialData: newCommercialDetail }, function() {
      this.CalculateComercial();
    });
  };

  DeleteRowData_commercial = (DeleteIndex) => (evt) => {
    var commercialData = this.state.commercialData;
    commercialData.splice(DeleteIndex, 1);
    this.setState({ commercialData: commercialData }, function() {
      this.CalculateComercial();
    });
  };

  renderTableHeader() {
    let header = Object.keys(this.state.commercialData[0]);
    return header.map((key, index) => {
      return <th key={index}>{this.state.commercialDataHeader[key]}</th>;
    });
  }

  CalculateComercial() {
    var ComercialDetails = [...this.state.commercialData];
    let totalCommercial = 0;

    for (var i = 0; i < ComercialDetails.length; i++) {
      var Quantity = 0;
      var ValuePerQty = 0;
      let total_value = 0;

      if (ComercialDetails[i].quantity != "") {
        Quantity = ComercialDetails[i].quantity;
      }

      if (ComercialDetails[i].value_per_qty != "") {
        ValuePerQty = ComercialDetails[i].value_per_qty;
      }

      if (Quantity && ValuePerQty) {
        total_value = Quantity * ValuePerQty;
        ComercialDetails[i].total_value = parseFloat(total_value).toFixed(2);
        //  ComercialDetails[i].total_value = Quantity * ValuePerQty;
      } else {
        ComercialDetails[i].total_value = parseFloat(0).toFixed(2);
      }

      totalCommercial = totalCommercial + total_value;
    }

    this.setState({
      commercialData: ComercialDetails,
      totalCommercial: parseFloat(totalCommercial).toFixed(2),
    });
    this.showAESMessage(totalCommercial);
    // this.showInsuredValueError();
  }

  showInsuredValueError() {
    if (this.state.totalCommercial) {
      if (Number(this.state.GetRate.TotalInsuredValue) != 0) {
        if (
          Number(this.state.GetRate.TotalInsuredValue) >
          Number(this.state.totalCommercial)
        ) {
          this.setState({ IsInsuredValueError: true });
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  renderTableData() {
    return this.state.commercialData.map((commercialData, index) => {
      return (
        <tr key={index}>
          <td>
            <Select
              id="package_number"
              name="package_number"
              className="form-control"
              onChange={this.OnCommercialValueChange("package_number", index)} //value={index + 1}
              value={Number(this.state.commercialData[index].package_number)}
            >
              {this.appendNoOfCommercials()}
            </Select>
            {/* <Input type="text" name="package_number" id="package_number" disabled onChange={this.OnCommercialValueChange('package_number', index)}  value={commercialData.package_number} /> */}
          </td>
          <td>
            <input
              type="text"
              className="more-width"
              name="descriptionofcontent"
              id="descriptionofcontent"
              onChange={this.OnCommercialValueChange(
                "content_description",
                index
              )}
              value={commercialData.content_description}
            />
          </td>
          <td>
            <input
              type="text"
              name="quantity"
              id="quantity"
              value={commercialData.quantity}
              onChange={this.OnCommercialValueChange("quantity", index)}
              className="text-right"
            />
          </td>
          <td>
            <input
              type="text"
              name="valueperqty"
              id="value_per_qty"
              value={commercialData.value_per_qty}
              onChange={this.OnCommercialValueChange("value_per_qty", index)}
              className="text-right"
              onBlur={this.formatCommercialValue("value_per_qty", index)}
            />
          </td>
          <td>
            <input
              type="text"
              name="totalvalue"
              id="total_value"
              disabled
              className="text-right"
              value={commercialData.total_value}
              onChange={this.OnCommercialValueChange("total_value", index)}
            />
          </td>
          {this.state.commercialData.length > 1 ? (
            <td>
              {index > 0 ? (
                <DeleteIcon
                  value={" Delete"}
                  onClick={this.DeleteRowData_commercial(index)}
                />
              ) : null}
            </td>
          ) : null}
        </tr>
      );
    });
  }

  AddNewRowData_commercial = () => {
    if (this.state.commercialData.length >= this.state.MaxPackageCount) {
      cogoToast.error("Sorry you can not add more packages");
    } else {
      var PackageDetails_commercial = this.state.commercialData;
      PackageDetails_commercial.push(this.state.ObjCommercial);
      this.setState({ commercialData: PackageDetails_commercial });
    }
  };

  handleRadio = (value) => {
    this.setState({ dutyType: value });
  };

  validate(event) {
    let IsFormValid = true;
    let count = 0;
    if (
      this.state.IsCommercial === true &&
      this.state.selectedPackageType === "Package"
    ) {
      if (this.state.commercialData.length > 0) {
        var CommercialData = this.state.commercialData;
        for (var i = 0; i < CommercialData.length; i++) {
          if (
            !CommonConfig.isEmpty(CommercialData[i]["content_description"]) &&
            !CommonConfig.isEmpty(CommercialData[i]["quantity"]) &&
            !CommonConfig.isEmpty(CommercialData[i]["value_per_qty"])
          ) {
            count++;
          }
        }
      }
      if (count > 0) {
        IsFormValid = true;
      } else {
        cogoToast.error("Please fill atleast one Commercial Invoice");
        IsFormValid = false;
      }
    }
    if (
      this.state.totalCommercial > 2500 &&
      !this.state.IsAlreadyAESFilled &&
      this.state.IsCommercial === true &&
      this.state.selectedPackageType === "Package"
    ) {
      this.setState({ IsAESOpen: true });
      IsFormValid = false;
    }
    if (this.state.totalCommercial) {
      if (Number(this.state.GetRate.TotalInsuredValue) != 0) {
        if (
          Number(this.state.GetRate.TotalInsuredValue) >
          Number(this.state.totalCommercial)
        ) {
          this.setState({ IsInsuredValueError: true });
          IsFormValid = false;
        }
      }
    }
    return IsFormValid;
  }

  render() {
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
              disabled={
                !this.state.IsPackage || this.state.disableGetrate
                  ? true
                  : false
              }
            />
          </td>
          <td>
            <input
              type="text"
              name="PackageWeight"
              id="PackageWeight"
              value={Package.PackageWeight}
              onChange={this.InputValidate("PackageWeight", i)}
              disabled={
                !this.state.IsPackage || this.state.disableGetrate
                  ? true
                  : false
              }
            />
          </td>
          <td>
            <div className="inline-input">
              <input
                type="text"
                name="PackageLength"
                id="PackageLength"
                value={Package.PackageLength}
                onChange={this.InputValidate("PackageLength", i)}
                disabled={
                  !this.state.IsPackage || this.state.disableGetrate
                    ? true
                    : false
                }
              />
              <input
                type="text"
                name="PackageWidth"
                id="PackageWidth"
                value={Package.PackageWidth}
                onChange={this.InputValidate("PackageWidth", i)}
                disabled={
                  !this.state.IsPackage || this.state.disableGetrate
                    ? true
                    : false
                }
              />
              <input
                type="text"
                name="PackageHeight"
                id="PackageHeight"
                value={Package.PackageHeight}
                onChange={this.InputValidate("PackageHeight", i)}
                disabled={
                  !this.state.IsPackage || this.state.disableGetrate
                    ? true
                    : false
                }
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
              name="PackageInsuredValue"
              id="PackageInsuredValue"
              value={Package.PackageInsuredValue}
              onChange={this.InputValidate("PackageInsuredValue", i)}
              disabled={
                !this.state.IsPackage || this.state.disableGetrate
                  ? true
                  : false
              }
            />
          </td>
          {this.state.PackageDetails.length > 1 ? (
            <td>
              {i > 0 ? (
                <DeleteIcon value={" Delete"} onClick={this.DeleteRowData(i)} />
              ) : null}
            </td>
          ) : null}
        </tr>
      );
    }

    return (
      <div>
        <form>
          <GridContainer>
            <GridItem xs={12} sm={3} md={3}>
              <div className="select-spl">
                <FormControl fullWidth>
                  <InputLabel className={classes.selectLabel}>
                    Package Type <small>(required)</small>
                  </InputLabel>
                  <Select
                    value={this.state.selectedPackageType}
                    disabled={this.state.disableGetrate}
                    onChange={(event) => this.packageType(event)}
                    inputProps={{ name: "packagetype", id: "packagetype" }}
                  >
                    {this.state.PackageType.map((packageType) => {
                      return (
                        <MenuItem
                          classes={{ root: classes.selectMenuItem }}
                          value={packageType.value}
                        >
                          {packageType.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
            </GridItem>

            {this.state.selectedPackageType === "Package" ? (
              <GridItem xs={12} sm={3} md={2} className="ml-auto">
                <div className="select-spl">
                  <FormControl fullWidth>
                    <InputLabel className={classes.selectLabel}>
                      No. of Packages
                    </InputLabel>
                    <Select
                      disabled={this.state.disableGetrate}
                      value={this.state.selectedPackageNumbers.value}
                      onChange={(event) => this.PackageCount(event)}
                    >
                      {this.appendNoOfPackages()}
                    </Select>
                  </FormControl>
                </div>
              </GridItem>
            ) : null}

            {this.state.IsCommercial &&
            this.state.selectedPackageType === "Package" ? (
              <GridItem xs={12} sm={4} md={4}>
                <div className="select-spl">
                  <FormControl fullWidth>
                    <InputLabel className={classes.selectLabel}>
                      Duties & Taxes Paid By
                    </InputLabel>
                    <Select
                      value={this.state.dutyType}
                      onChange={(event) => this.changeDutyType(event)}
                    >
                      {this.appendDutiesandTaxes()}
                    </Select>
                  </FormControl>
                </div>
              </GridItem>
            ) : null}

            <GridItem xs={12} sm={12} md={12}>
              <div className="package-table">
                <table>
                  <thead>
                    <tr>
                      <th>No of Packages</th>
                      <th>Weight (lbs)*</th>
                      <th>Dimenstion (L + W + H in Inches)*</th>
                      <th>Chargeble Weight</th>
                      <th>Insured Value (USD)*</th>
                      {PackageDetails.length > 1 ? <th>&nbsp;</th> : null}
                    </tr>
                  </thead>
                  <tbody>{PackageDetails}</tbody>
                  <tfoot>
                    <tr>
                      <td>
                        {this.state.IsPackage == true &&
                        !this.state.disableGetrate ? (
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
                        {this.state.GetRate.TotalWeight}
                        {/* <input type="number" name="TotalWeight" id="TotalWeight" value={this.state.GetRate.TotalWeight} min="0" max="999999999" disabled={true} /> */}
                      </td>
                      <td colSpan="1"></td>
                      <td>
                        {this.state.GetRate.TotalChargableWeight}
                        {/* <input type="number" name="TotalChargableWeight" id="TotalChargableWeight" value={this.state.GetRate.TotalChargableWeight} min="0" max="999999999" disabled={true} /> */}
                      </td>
                      <td>
                        $ {this.state.GetRate.TotalInsuredValue}
                        {/* <input type="number" name="TotalInsuredValue" id="TotalInsuredValue" value={this.state.GetRate.TotalInsuredValue} min="0" max="999999999" disabled={true} /> */}
                      </td>
                      {PackageDetails.length > 1 ? <td>&nbsp;</td> : null}
                    </tr>
                  </tfoot>
                </table>
              </div>

              {this.state.IsCommercial &&
              this.state.selectedPackageType === "Package" ? (
                <div>
                  <div className="commercial-radio">
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>
                        <h3>Commercial Invoice</h3>
                      </GridItem>
                    </GridContainer>
                  </div>

                  <div className="package-table commercial-table">
                    <table>
                      <thead>
                        <tr>
                          {this.renderTableHeader()}
                          {this.state.commercialData.length > 1 ? (
                            <th>&nbsp;</th>
                          ) : null}
                        </tr>
                      </thead>
                      <tbody>{this.renderTableData()}</tbody>
                      <tfoot>
                        <tr>
                          <td>
                            <Button
                              onClick={(event) =>
                                this.AddNewRowData_commercial()
                              }
                            >
                              Add New Row
                            </Button>
                          </td>
                          <td colSpan="3">Total Value</td>
                          <td> $ {this.state.totalCommercial} </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              ) : null}
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
                      As export/commercial value of your shipment is more than
                      $2500 value Automated Export System (AES) filing is
                      required. Additional AES filing fees of $75.00 will be
                      applied on your shipment.{" "}
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
              <div>
                <Dialog
                  open={this.state.IsInsuredValueError}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    Insured Value cannot exceed Customs value
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Please change "Value Per Qty" in Commercial Invoice or
                      Update "Insured Value" in Get Rate
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => this.OpenGetrate(false)}
                      color="secondary"
                      className="aesfilling-btn"
                    >
                      <b>Update Commercial Value</b>
                      {/* <span>Change Commercial Value</span> */}
                    </Button>
                    {this.props.props.history.location.state !== undefined &&
                    this.props.props.history.location.state != null ? (
                      this.props.props.history.location.state.skipstep1 ? (
                        <Button
                          onClick={() => this.OpenGetrate(true)}
                          color="primary"
                          className="aesfilling-btn"
                        >
                          <b>Update Insured Value</b>
                          {/* <span>Chh</span> */}
                        </Button>
                      ) : null
                    ) : null}
                  </DialogActions>
                </Dialog>
              </div>
            </GridItem>
          </GridContainer>
        </form>
      </div>
    );
  }
}

Scheduleshipment.propTypes = {
  classes: PropTypes.object,
};

export default withStyles()(Scheduleshipment);
