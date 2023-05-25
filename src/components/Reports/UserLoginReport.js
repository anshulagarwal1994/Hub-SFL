// org
import React, { Component } from "react";
import * as XLSX from "xlsx";
import GridItem from "../Grid/GridItem.js";
import CustomInput from "../CustomInput/CustomInput.js";
import GridContainer from "../Grid/GridContainer.js";
import ReactTable from "react-table";
import CardBody from "../Card/CardBody.js";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputLabel from "@material-ui/core/InputLabel";
import Datetime from "react-datetime";
import FormControl from "@material-ui/core/FormControl";
import HeadsetMic from "@material-ui/icons/HeadsetMic";
import Card from "../Card/Card.js";
import CardHeader from "../Card/CardHeader.js";
import { CommonConfig } from "../../utils/constant.js";
import moment from "moment";
import api from "../../utils/apiClient";
import Button from "../CustomButtons/Button.js";
import cogoToast from "cogo-toast";
import SimpleBackdrop from "../../utils/general";
import CardIcon from "../Card/CardIcon.js";
import ArchiveIcon from "@material-ui/icons/Archive";
import GateRatesIcon from "@material-ui/icons/AttachMoney";
import { makeStyles } from "@material-ui/core/styles";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { DownloadTableExcel } from "react-export-table-to-excel";
import zipcelx from "zipcelx";
import {
  Checkbox,
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import { size } from "lodash";
const useStyles = () => makeStyles(styles);
const classes = useStyles();

var fileNameSet = "";

setInterval(() => {
  var currdate = new Date();
  fileNameSet =
    "LR-" +
    currdate.getFullYear() +
    (currdate.getMonth() + 1) +
    currdate.getDate() +
    "-" +
    currdate.getHours() +
    currdate.getMinutes() +
    currdate.getSeconds();
  // console.log("FileName = ",fileNameSet)
}, 1000);

class UserLoginReport extends Component {
  constructor(props) {
    super(props);

    this.tableRef = React.createRef(null);
    this.state = {
      file: "",
      fileSetName: "",
      ExcelJSONData: [],
      KeywordListAllData: [],
      Loading: false,
      isCommitted: false,
      committedLength: 0,
      notCommitedLength: 0,
      notCommitedList: [],
      fileName: "",
      FromDate: new Date(),
      ToDate: new Date(),
      isPreviewClicked: false,
      ManagedBy: "",
      managedByList: [],
      IpAddress: "",
      totalRowCount: "",
      LoginType: "",
      logintype: [
        { value: "1", label: "First Login" },
        { value: "0", label: "All Login" },
      ],
      logintypevalue: [],
      LoginTypeValue: "",
      UserNameValue: "",
    };
  }

  // requestChange(event, value, type) {
  //   if (type === "logintype") {
  //     if (value.label == "First Login") {
  //       this.setState({ LoginType: value.value });
  //     } else {
  //       this.setState({ LoginType: value.value });
  //     }
  //   }
  // }

  requestChange(event, value, type) {
    if (type === "logintypevalue") {
      this.setState({ LoginTypeValue: value.props.value });
      console.log("checkreffredbyydata", value.props.value);
    }
  }
  componentDidMount() {
    this.validate1();
    this.getManagedBy();
    var element = document.getElementById("myDIVcloseOpen");
    element.classList.remove("Close-Menu");
    element.classList.add("Open-Menu");

    var getSiteData = this.state.logintype.map((item) => ({
      id: item.value,
      label: item.label,
    }));
    this.setState({
      logintypevalue: getSiteData,
    });

    // https://hubapi.sflworldwide.com/contactus/getUserReport
  }
  LoginTypeOption = () => {
    return this.state.logintypevalue.map((content) => {
      return (
        <MenuItem classes={{ root: classes.selectMenuItem }} value={content.id}>
          {" "}
          {content.label}{" "}
        </MenuItem>
      );
    });
  };
  getManagedBy() {
    try {
      api
        .get("contactus/spGetUserListTracker")
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

  validate1() {
    // try {
    // this.showLoador();\

    var getDataAccess = 0;
    if (CommonConfig.getUserAccess("User Login Report").AllAccess === 1) {
      getDataAccess = 0;
    }

    if (
      CommonConfig.getUserAccess("User Login Report").AllAccess === 0 &&
      CommonConfig.getUserAccess("User Login Report").ReadAccess === 1
    ) {
      getDataAccess = 1;
    }
    var data = {};
    if (getDataAccess === 0) {
      data = {
        Timedate: "Welcome",
      };
    } else {
      data = {
        Timedate: "Welcome",
        UserId: CommonConfig.loggedInUserData().PersonID,
      };
    }

    api
      .post("contactus/getUserReport", data)
      .then((res) => {
        if (res.success) {
          // var Country = res.data;
          // this.setState({ CountryList: Country });
          this.setState({ totalRowCount: res.data.length });
          this.setState({ KeywordListAllData: res.data });
          console.log("Hello data = ", fileNameSet);
          this.setState({ fileSetName: fileNameSet });
        }
      })
      .catch((err) => {
        console.log("err..", err);
      });
    //   } catch (err) {
    //     // this.hideLoador();
    //     cogoToast.error("Something went wrong");
    //   }
  }

  closedeletemodalKeyword = () => {
    this.setState({ DeleteRequestKeyword: false });
  };

  openDeleteRequestModalKeyword(recordDeleteId) {
    console.log(recordDeleteId);
    this.setState({
      DeleteRequestKeyword: true,
      DeleteRequestIdKeyword: recordDeleteId,
    });
  }

  fileUpload = (e) => {
    var fileName = document.getElementById("file").value.toLowerCase();
    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
      alert("Please upload *.xlsx file only.");
      return false;
    } else {
      this.setState({
        file: e.target.files[0],
        fileName: e.target.files[0] ? e.target.files[0].name : "",
      });
    }
  };

  sheet2arr = (sheet) => {
    var result = [];
    var row;
    var rowNum;
    var colNum;
    var range = XLSX.utils.decode_range(sheet["!ref"]);
    for (rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
      row = [];
      for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
        var nextCell = sheet[XLSX.utils.encode_cell({ r: rowNum, c: colNum })];
        if (typeof nextCell === "undefined") {
          row.push(void 0);
        } else {
          if (nextCell.w !== undefined) {
            if (nextCell.w.includes(",")) {
              nextCell.w.replace(/,/g, "");
            }
            row.push(nextCell.w);
          }
        }
      }
      result.push(row);
    }
    return result;
  };

  validate() {
    let IsValid = true;

    if (
      (!CommonConfig.isEmpty(this.state.FromDate) &&
        CommonConfig.isEmpty(this.state.ToDate)) ||
      (CommonConfig.isEmpty(this.state.FromDate) &&
        !CommonConfig.isEmpty(this.state.ToDate))
    ) {
      IsValid = false;
    }
    return IsValid;
  }

  readFile() {
    if (this.validate()) {
      this.setState({ isPreviewClicked: true });
      var f = this.state.file;
      const reader = new FileReader();
      reader.onload = (evt) => {
        // evt = on_file_select event
        /* Parse data */
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        //Converting into array of array(removing , from amount)
        let tempData = this.sheet2arr(ws);
        //Looping for formatting JSON from array of array
        let finalJson = this.formatJSON(tempData);

        this.setState({
          ExcelJSONData: finalJson,
        });
      };
      reader.readAsBinaryString(f);
    } else {
      cogoToast.error("Please select *.xlsx file");
    }
  }

  formatJSON(json) {
    var result = [];
    if (json.length > 0) {
      let headers = json[0];
      for (var j = 1; j < json.length; j++) {
        var obj = {};
        var currentline;
        currentline = json[j];
        for (var i = 0; i < headers.length; i++) {
          obj[headers[i].replace(/ /g, "")] = currentline[i];
        }
        result.push(obj);
      }
    }
    return result;
  }

  viewPaymentIssued = () => {
    return this.state.ExcelJSONData.map((issued, index) => {
      issued.ShipmentType = issued.ShipmentType;
      issued.LocationType = issued.LocationType;
      issued.DutiesPaidBy = issued.DutiesPaidBy;
      issued.FromCountryName = issued.FromCountryName;
      issued.FromCountryCode = issued.FromCountryCode;
      issued.FromCompanyName = issued.FromCompanyName;
      issued.FromContactName = issued.FromContactName;
      issued.FromAddrerss = issued.FromAddrerss;
      issued.FromCityName = issued.FromCityName;
      issued.FromStateName = issued.FromStateName;
      issued.FromZipCode = issued.FromZipCode;
      issued.FromPhoneNumber1 = issued.FromPhoneNumber1;
      issued.FromPhoneNumber2 = issued.FromPhoneNumber2;
      issued.FromEmail = issued.FromEmail;

      issued.ToCountryName = issued.ToCountryName;
      issued.ToCountryCode = issued.ToCountryCode;
      issued.ToCompanyName = issued.ToCompanyName;
      issued.ToContactName = issued.ToContactName;
      issued.ToAddrerss = issued.ToAddrerss;
      issued.ToCityName = issued.ToCityName;
      issued.ToStateName = issued.ToStateName;
      issued.ToZipCode = issued.ToZipCode;
      issued.ToPhoneNumber1 = issued.ToPhoneNumber1;
      issued.ToPhoneNumber2 = issued.ToPhoneNumber2;
      issued.ToEmail = issued.ToEmail;

      issued.PackageType = issued.PackageType;
      issued.TotalPackage = issued.TotalPackage;
      issued.PaymentType = issued.PaymentType;
      issued.PerPackageWeight = issued.PerPackageWeight;
      issued.UnitOfWeight = issued.UnitOfWeight;
      issued.BoxLength = issued.BoxLength;
      issued.BoxWidth = issued.BoxWidth;
      issued.BoxHeight = issued.BoxHeight;
      issued.BoxChargableWeight = issued.BoxChargableWeight;
      issued.InsuredValue = issued.InsuredValue;
      issued.TotalWeight = issued.TotalWeight;
      issued.TotalInsuredValue = issued.TotalInsuredValue;

      return (
        <tr key={index}>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ShipmentType,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.LocationType,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.DutiesPaidBy,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromCountryName,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromCountryCode,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromCompanyName,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromContactName,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromAddrerss,
              }}
            />
          </td>

          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromCityName,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromStateName,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromZipCode,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromPhoneNumber1,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromPhoneNumber2,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromEmail,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToCountryName,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToCountryCode,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToCompanyName,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToContactName,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToAddrerss,
              }}
            />
          </td>

          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToCityName,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToStateName,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToZipCode,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToPhoneNumber1,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToPhoneNumber2,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToEmail,
              }}
            />
          </td>

          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.PackageType,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.TotalPackage,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.PaymentType,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.PerPackageWeight,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.UnitOfWeight,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.BoxLength,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.BoxWidth,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.BoxHeight,
              }}
            />
          </td>

          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.BoxChargableWeight,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.InsuredValue,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.TotalWeight,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.TotalInsuredValue,
              }}
            />
          </td>
        </tr>
      );
    });
  };

  viewNotCommitted = () => {
    return this.state.notCommitedList.map((issued, index) => {
      return (
        <tr key={index}>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ShipmentType,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.LocationType,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.DutiesPaidBy,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromCountryName,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromCountryCode,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromCompanyName,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromContactName,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromAddrerss,
              }}
            />
          </td>

          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromCityName,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromStateName,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromZipCode,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromPhoneNumber1,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromPhoneNumber2,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.FromEmail,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToCountryName,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToCountryCode,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToCompanyName,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToContactName,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToAddrerss,
              }}
            />
          </td>

          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToCityName,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToStateName,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToZipCode,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToPhoneNumber1,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToPhoneNumber2,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.ToEmail,
              }}
            />
          </td>

          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.PackageType,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.TotalPackage,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.PaymentType,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.PerPackageWeight,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.UnitOfWeight,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.BoxLength,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.BoxWidth,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.BoxHeight,
              }}
            />
          </td>

          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.BoxChargableWeight,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.InsuredValue,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.TotalWeight,
              }}
            />
          </td>
          <td className="wd-80">
            <CustomInput
              inputProps={{
                disabled: true,
                value: issued.TotalInsuredValue,
              }}
            />
          </td>
        </tr>
      );
    });
  };

  showLoader() {
    this.setState({ Loading: true });
  }

  hideLoader() {
    this.setState({ Loading: false });
  }

  selectChange = (event, value, type) => {
    if (value != null) {
      if (type === "ManagedBy") {
        this.setState({ ManagedBy: value });
      }
    }
  };

  saveReport = () => {
    let finalJson = [];

    for (var j = 0; j < this.state.ExcelJSONData.length; j++) {
      let obj = {};
      obj.ShipmentType = this.state.ExcelJSONData[j]["ShipmentType"];
      obj.LocationType = this.state.ExcelJSONData[j]["LocationType"];
      obj.DutiesPaidBy = this.state.ExcelJSONData[j]["DutiesPaidBy"];
      obj.FromCountryName = this.state.ExcelJSONData[j]["FromCountryName"];
      obj.FromCountryCode = this.state.ExcelJSONData[j]["FromCountryCode"];
      obj.FromCompanyName = this.state.ExcelJSONData[j]["FromCompanyName"];
      obj.FromContactName = this.state.ExcelJSONData[j]["FromContactName"];
      obj.FromAddrerss = this.state.ExcelJSONData[j]["FromAddrerss"];
      obj.FromCityName = this.state.ExcelJSONData[j]["FromCityName"];
      obj.FromStateName = this.state.ExcelJSONData[j]["FromStateName"];
      obj.FromZipCode = this.state.ExcelJSONData[j]["FromZipCode"];
      obj.FromPhoneNumber1 = this.state.ExcelJSONData[j]["FromPhoneNumber1"];
      obj.FromPhoneNumber2 = this.state.ExcelJSONData[j]["FromPhoneNumber2"];
      obj.FromEmail = this.state.ExcelJSONData[j]["FromEmail"];

      obj.ToCountryName = this.state.ExcelJSONData[j]["ToCountryName"];
      obj.ToCountryCode = this.state.ExcelJSONData[j]["ToCountryCode"];
      obj.ToCompanyName = this.state.ExcelJSONData[j]["ToCompanyName"];
      obj.ToContactName = this.state.ExcelJSONData[j]["ToContactName"];
      obj.ToAddrerss = this.state.ExcelJSONData[j]["ToAddrerss"];
      obj.ToCityName = this.state.ExcelJSONData[j]["ToCityName"];
      obj.ToStateName = this.state.ExcelJSONData[j]["ToStateName"];
      obj.ToZipCode = this.state.ExcelJSONData[j]["ToZipCode"];
      obj.ToPhoneNumber1 = this.state.ExcelJSONData[j]["ToPhoneNumber1"];
      obj.ToPhoneNumber2 = this.state.ExcelJSONData[j]["ToPhoneNumber2"];
      obj.ToEmail = this.state.ExcelJSONData[j]["ToEmail"];

      obj.PackageType = this.state.ExcelJSONData[j]["PackageType"];
      obj.TotalPackage = this.state.ExcelJSONData[j]["TotalPackage"];
      obj.PaymentType = this.state.ExcelJSONData[j]["PaymentType"];
      obj.PerPackageWeight = this.state.ExcelJSONData[j]["PerPackageWeight"];
      obj.UnitOfWeight = this.state.ExcelJSONData[j]["UnitOfWeight"];
      obj.BoxLength = this.state.ExcelJSONData[j]["BoxLength"];
      obj.BoxWidth = this.state.ExcelJSONData[j]["BoxWidth"];
      obj.BoxHeight = this.state.ExcelJSONData[j]["BoxHeight"];
      obj.BoxChargableWeight = this.state.ExcelJSONData[j][
        "BoxChargableWeight"
      ];
      obj.InsuredValue = this.state.ExcelJSONData[j]["InsuredValue"];
      obj.TotalWeight = this.state.ExcelJSONData[j]["TotalWeight"];
      obj.TotalInsuredValue = this.state.ExcelJSONData[j]["TotalInsuredValue"];
      finalJson.push(obj);
    }
    let data = {
      paymentIssued: finalJson,
      userid: CommonConfig.loggedInUserData().PersonID,
    };
    this.showLoader();
    try {
      api
        .post("scheduleshipment/InsertBulkShipment", data)
        .then((res) => {
          this.hideLoader();
          if (res.success) {
            cogoToast.success("Updated successfully");
            this.setState({
              isCommitted: true,
              committedLength: res.data.committed,
            });
            if (res.data.notCommitedList.length) {
              this.setState({
                notCommitedList: res.data.notCommitedList,
                notCommitedLength: res.data.notCommited,
              });
            }
          } else {
            cogoToast.error("Something went wrong");
          }
        })
        .catch((err) => {
          cogoToast.error("Something went wrong");
          console.log("error", err);
        });
    } catch (err) {
      cogoToast.error("Something went wrong");
      console.log("error", err);
    }
  };

  dateChange = (date, type) => {
    this.setState({
      [type]: date,
    });
  };

  resetReport = () => {
    console.log("Here");
    window.location.reload();
    // this.setState({
    //   FromDate: "",
    //   ToDate: "",
    //   ManagedBy: "",
    // });
  };

  searchReport = () => {
    // debugger;
    if (this.validate()) {
      this.setState({ searchClicked: true });
      try {
        this.showLoader();
        let data = {};
        debugger;
        if (
          CommonConfig.getUserAccess("User Login Report").AllAccess === 0 &&
          CommonConfig.getUserAccess("User Login Report").ReadAccess === 1
        ) {
          data = {
            FromDate: CommonConfig.isEmpty(this.state.FromDate)
              ? ""
              : moment(this.state.FromDate)
                  .startOf("day")
                  .format(CommonConfig.dateFormat.dbDateTime)
                  .toString(),
            ToDate: CommonConfig.isEmpty(this.state.ToDate)
              ? ""
              : moment(this.state.ToDate)
                  .endOf("day")
                  .format(CommonConfig.dateFormat.dbDateTime)
                  .toString(),
            ManagedBy: CommonConfig.loggedInUserData().PersonID,
            IpAddress: "",
            logintype: 0,
            username: CommonConfig.loggedInUserData().LoginID,
          };
          console.log("checkconfigdata", data);
        }
        if (CommonConfig.getUserAccess("User Login Report").AllAccess === 1) {
          data = {
            FromDate: CommonConfig.isEmpty(this.state.FromDate)
              ? ""
              : moment(this.state.FromDate)
                  .startOf("day")
                  .format(CommonConfig.dateFormat.dbDateTime)
                  .toString(),
            ToDate: CommonConfig.isEmpty(this.state.ToDate)
              ? ""
              : moment(this.state.ToDate)
                  .endOf("day")
                  .format(CommonConfig.dateFormat.dbDateTime)
                  .toString(),
            ManagedBy: this.state.ManagedBy ? this.state.ManagedBy.value : 0,
            IpAddress: this.state.IpAddress,
            logintype: this.state.LoginTypeValue,
            username: this.state.UserNameValue
              ? this.state.UserNameValue
              : "Test",
          };
        }
        console.log("Data = ", data);
        api
          .post("contactus/getUserReportByData", data)
          .then((res) => {
            this.hideLoader();
            if (res.success) {
              // this.setState({ KeywordListAllData: "" });
              this.setState({ totalRowCount: 0 });
              console.log("res = ", res.data);
              this.setState({ KeywordListAllData: res.data });
              this.setState({ totalRowCount: res.data.length });
              console.log("Hello data = ", res);
              this.setState({ fileSetName: fileNameSet });
            } else {
              cogoToast.error("Please enter from/to date");
            }
          })
          .catch((err) => {
            cogoToast.error("Something went wrong");
            this.hideLoader();
          });
      } catch (err) {
        console.log("error..", err);
      }
    } else {
      cogoToast.error("Please enter from/to date");
    }

    // this.finalAmountPayable();
  };

  handleChange = (event, type) => {
    if (type === "trackingnumber") {
      //   this.setState({ trackingnumberCheck: true });
      let trackingnumberVal = event.target.value;
      console.log("trackingnumberVal", trackingnumberVal);
      //   if (CommonConfig.isEmpty(trackingnumberVal)) {
      this.setState({
        IpAddress: trackingnumberVal,
      });
    } else if (type === "UserName") {
      let UserNameValue = event.target.value;
      console.log("checkuservalue", UserNameValue);
      this.setState({
        UserNameValue: UserNameValue,
      });
    }
  };

  handleDelete = (record) => {
    console.log(record);
    var data = {
      userLoginId: record,
      //Attachment: Attachment,
    };

    if (CommonConfig.getUserAccess("User Login Report").AllAccess === 1) {
      api.post("contactus/deleteUserReport", data).then((res) => {
        this.closedeletemodalKeyword();
        this.validate1();
      });
    }

    if (
      CommonConfig.getUserAccess("User Login Report").AllAccess === 0 &&
      CommonConfig.getUserAccess("User Login Report").ReadAccess === 1
    ) {
      cogoToast.error("Sorry you don't have access to delete this");
    }
  };

  render() {
    const logintype = this.state.logintype.map((x) => {
      return { value: x.value, label: x.label };
    });
    // const logintype = {
    //   options: this.state.logintype.map((x) => x.label),
    // };

    const managedBy = this.state.managedByList.map((type) => {
      return { value: type.PersonID, label: type.userName };
    });
    const {
      LoginTypeValue,
      fileName,
      LoginType,
      fileSetName,
      KeywordListAllData,
      FromDate,
      ToDate,
      ManagedBy,
      totalRowCount,
      fileNameSet,
    } = this.state;
    const KeywordListData = [];

    const KeywordListDataLinks = [
      {
        Header: "User ID",
        accessor: "LoginID",
        width: 70,
      },

      {
        Header: "User Name",
        accessor: "UserName",
        width: 130,
      },
      {
        Header: "Name",
        accessor: "Name",
        width: 130,
      },

      {
        Header: "IP Address",
        accessor: "ipaddress",
        width: 100,
      },

      // {
      //   Header: "URL",
      //   accessor: "url",
      //   width: 75,
      // },
      {
        Header: "Location",
        accessor: "location",
        width: 200,
      },
      {
        Header: "Login Date",
        accessor: "MYDATE",
        width: 100,
      },
      {
        Header: "Login Time",
        // Cell: (data) => {
        //   if (data.original.CurrentTime) {
        //     return moment(data.original.CurrentTime)
        //       .utc()
        //       .format("hh:mm A");
        //   }
        //   return "";
        // },
        accessor: "MyTIME",

        width: 100,
      },

      {
        Header: "Actions",
        accessor: "Actions",
        align: "left",
        width: 80,
        maxWidth: 80,
        filterable: false,
        Cell: (record) => {
          return (
            // ): null}
            <div className="table-common-btn">
              {CommonConfig.getUserAccess("User Login Report").DeleteAccess ===
              1 ? (
                <Button
                  justIcon
                  color="danger"
                  onClick={() =>
                    this.openDeleteRequestModalKeyword(record.original.LoginID)
                  }
                >
                  <i class="fas fa-trash"></i>
                </Button>
              ) : null}
            </div>
          );
        },
        sortable: false,
      },
    ];

    console.log(
      "checkacessdata",
      CommonConfig.getUserAccess("User Login Report").AllAccess
    );

    console.log("datttaaaadd", this.state.username);

    const handelExportToExcel = (evt) => {
      const headData = Object.keys(KeywordListAllData[0]).map((col) => ({
        value: col,
        type: "string",
      }));
      const bodyData = KeywordListAllData.map((item) =>
        Object.values(item).map((value) => ({
          value,
          type: typeof value,
        }))
      );
      const config = {
        filename: fileSetName,
        sheet: {
          data: [headData, ...bodyData],
          columns: headData.map((col) => ({ wch: 2000 })),
        },
      };
      zipcelx(config);
    };

    // const handelExportToExcel = (evt) => {
    //   debugger;
    //   const headData = Object.keys(KeywordListAllData[0]).map((col) => ({
    //     value: col,
    //     type: "string",
    //   }));
    //   const bodyData = KeywordListAllData.map((item) =>
    //     Object.values(item).map((value) => ({
    //       value,
    //       type: typeof value,
    //     }))
    //   );
    //   const config = {
    //     filename: "LoginReport",
    //     sheet: {
    //       data: [headData, ...bodyData],
    //     },
    //   };

    //   const sheet = zipcelx.utils.json_to_sheet([...headData, ...bodyData]);
    //   const columnWidths = [];
    //   const range = zipcelx.utils.decode_range(sheet["!ref"]);
    //   for (let c = range.s.c; c <= range.e.c; ++c) {
    //     let maxCellLength = 0;
    //     for (let r = range.s.r + 1; r <= range.e.r; ++r) {
    //       const cell = sheet[zipcelx.utils.encode_cell({ r, c })];
    //       if (cell) {
    //         const cellLength = zipcelx.utils.format_cell(cell).length;
    //         if (cellLength > maxCellLength) {
    //           maxCellLength = cellLength;
    //         }
    //       }
    //     }
    //     if (maxCellLength > 0) {
    //       columnWidths[c] = { wch: maxCellLength + 2 };
    //     }
    //   }
    //   config.sheet.columns = columnWidths;
    //   zipcelx(config);
    // };
    return (
      // <GridContainer className="UserList-outer">
      //     {this.state.Loading === true ? (
      //         <div className="loading">
      //             <SimpleBackdrop />
      //         </div>
      //     ) : null}
      //     <GridItem xs={12}>
      //     <div className="shipment-pane" id="keywordmanage">

      //                         <ReactTable
      //                             data={KeywordListAllData}
      //                             minRows={0}
      //                             filterable
      //                             defaultFilterMethod={CommonConfig.filterCaseInsensitive}
      //                             resizable={false}
      //                             columns={KeywordListDataLinks}
      //                             defaultPageSize={10}
      //                             showPaginationBottom={true}
      //                             className="-striped -highlight chatMgtList"
      //                         />
      //                     </div>
      //     </GridItem>

      // </GridContainer>
      <GridContainer className="UserList-outer">
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}

        <GridItem xs={12}>
          <Card>
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <HeadsetMic />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">
                User Login Details
              </h4>

              <div className="filter-wrap"></div>
            </CardHeader>
            <GridItem xs={12} sm={12} md={12}>
              <div className="user-report-filter" id="myDIVcloseOpen">
                <GridContainer>
                  <GridItem xs={12} sm={12} md={2}>
                    <div className="date-spl">
                      <InputLabel className={classes.label}>
                        From Date
                      </InputLabel>
                      <FormControl fullWidth>
                        <Datetime
                          dateFormat={"MM/DD/YYYY"}
                          timeFormat={false}
                          value={FromDate}
                          onChange={(date) => this.dateChange(date, "FromDate")}
                          closeOnSelect={true}
                          renderInput={(params) => (
                            <TextField {...params} fullWidth />
                          )}
                        />
                      </FormControl>
                    </div>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <div className="date-spl">
                      <InputLabel className={classes.label}>To Date</InputLabel>
                      <FormControl fullWidth>
                        <Datetime
                          dateFormat={"MM/DD/YYYY"}
                          timeFormat={false}
                          value={ToDate}
                          onChange={(date) => this.dateChange(date, "ToDate")}
                          closeOnSelect={true}
                          renderInput={(params) => (
                            <TextField {...params} fullWidth />
                          )}
                        />
                      </FormControl>
                    </div>
                  </GridItem>
                  {CommonConfig.getUserAccess("User Login Report").AllAccess ===
                  1 ? (
                    //  <div>
                    <GridItem xs={12} sm={3} md={2}>
                      {/* <div class="select-spl"> */}
                      <CustomInput
                        labelText="User Name"
                        id="username"
                        formControlProps={{ fullWidth: true }}
                        inputProps={{
                          onBlur: (event) =>
                            this.handleChange(event, "UserName"),
                        }}
                      />
                      {/* <Autocomplete
                          id="combo-box-demo"
                          options={managedBy}
                          value={ManagedBy}
                          // disabled={viewAllClear === false ? false : true}
                          onChange={(event, value) =>
                            this.selectChange(event, value, "ManagedBy")
                          }
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <TextField {...params} label="User Name" />
                          )}
                        /> */}
                      {/* </div> */}
                    </GridItem>
                  ) : //  </div>

                  null}

                  {CommonConfig.getUserAccess("User Login Report").AllAccess ===
                  1 ? (
                    //  <div>
                    <GridItem xs={12} sm={3} md={2}>
                      {/* <div class="select-spl"> */}
                      <CustomInput
                        labelText="IP Address"
                        id="IpAddress"
                        formControlProps={{ fullWidth: true }}
                        inputProps={{
                          onBlur: (event) =>
                            this.handleChange(event, "trackingnumber"),
                        }}
                      />
                      {/* </div> */}
                    </GridItem>
                  ) : //  </div>

                  null}
                  {CommonConfig.getUserAccess("User Login Report").AllAccess ===
                  1 ? (
                    <GridItem xs={12} sm={12} md={2}>
                      <FormControl fullWidth>
                        {/* <Autocomplete
                          // {...logintype}
                          id="combo-box-demo"
                          options={logintype}
                          value={LoginType}
                          onChange={(event, value) =>
                            this.requestChange(event, value, "logintype")
                          }
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <TextField {...params} label="Login Type" />
                          )}
                        /> */}

                        <div className="select-spl">
                          <FormControl fullWidth>
                            <InputLabel
                              htmlFor="username"
                              className={classes.selectLabel}
                            >
                              Login Type
                            </InputLabel>
                            <Select
                              fullWidth={true}
                              id="username"
                              name="logintypevalue"
                              value={LoginTypeValue}
                              onChange={(event, value) =>
                                this.requestChange(
                                  event,
                                  value,
                                  "logintypevalue"
                                )
                              }
                            >
                              {this.LoginTypeOption()}
                            </Select>
                          </FormControl>
                        </div>

                        {/* <Autocomplete
                          id="logintype"
                          options={logintype}
                          value={LoginType}
                          // disabled={viewAllClear === false ? false : true}
                          onChange={(event, value) =>
                            this.requestChange(event, value, "logintype")
                          }
                          // getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <TextField {...params} label="Login Type" />
                          )}
                        /> */}
                      </FormControl>
                    </GridItem>
                  ) : null}
                  <GridItem xs={12} sm={12} md={2}>
                    <GridContainer>
                      <div className="shipment-submit user-report-btn mt-20">
                        <Button
                          className="fa-icon-userReport"
                          color="rose"
                          onClick={() => this.searchReport()}
                        >
                          <i class="fa fa-search"></i>
                        </Button>
                        <Button
                          className="fa-icon-userReport"
                          color="secondary"
                          onClick={() => this.resetReport()}
                        >
                          <i class="fa fa-sync"></i>
                        </Button>
                        {/* <DownloadTableExcel
                          filename={fileSetName}
                          sheet="users"
                          currentTableRef={this.tableRef.current}
                        ></DownloadTableExcel> */}
                        <Button
                          justIcon
                          color="danger"
                          onClick={handelExportToExcel}
                        >
                          <i class="fas fa-download"></i>
                        </Button>
                        {/* <Button color="rose">
                              {" "}
                              <i class="fas fa-download"></i>
                              
                            </Button> */}
                      </div>
                    </GridContainer>
                  </GridItem>
                </GridContainer>
              </div>
            </GridItem>

            <CardBody>
              <div className="tbl-spacing">
                <table ref={this.tableRef} style={{ display: "none" }}>
                  <tbody>
                    <tr>
                      <th>User ID</th>
                      <th>User Name</th>
                      <th>Name</th>
                      <th>IP Address</th>
                      <th>Location</th>
                      <th>Login Date</th>
                      <th>Login Time</th>
                    </tr>
                    {this.state.KeywordListAllData.map((item) => (
                      <tr>
                        <td>{item.LoginID}</td>
                        <td>{item.UserName}</td>
                        <td>{item.Name}</td>
                        <td>{item.ipaddress}</td>
                        <td>{item.location}</td>
                        <td>{item.MYDATE}</td>
                        <td>{item.MyTIME}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <ReactTable
                  data={KeywordListAllData}
                  minRows={2}
                  filterable
                  defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                  resizable={false}
                  columns={KeywordListDataLinks}
                  defaultPageSize={10}
                  showPaginationBottom={true}
                  className="-striped -highlight"
                />
              </div>

              <div className="t-count">Total Count : {totalRowCount}</div>
            </CardBody>
          </Card>
        </GridItem>

        <div>
          <Dialog
            open={this.state.DeleteRequestKeyword}
            onClose={this.closedeletemodalKeyword}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Confirm Delete"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure, you want to delete this record?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closedeletemodalKeyword} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() =>
                  this.handleDelete(this.state.DeleteRequestIdKeyword)
                }
                color="primary"
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </GridContainer>
    );
  }
}

export default UserLoginReport;
