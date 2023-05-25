import React, { Component } from "react";
import GridContainer from "components/Grid/GridContainer.js";
import { CommonConfig } from "../../utils/constant";
import ReactTable from "react-table";
import SalesLeadIcon from "@material-ui/icons/Assessment";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CardBody from "components/Card/CardBody.js";
import InputLabel from "@material-ui/core/InputLabel";
import Card from "components/Card/Card";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import { makeStyles } from "@material-ui/core/styles";
import Datetime from "react-datetime";
import FormControl from "@material-ui/core/FormControl";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import cogoToast from "cogo-toast";
import api from "../../utils/apiClient";
import moment from "moment";
import SimpleBackdrop from "../../utils/general";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { Checkbox, FormControlLabel } from "@material-ui/core";

const useStyles = () => makeStyles(styles);
const classes = useStyles();

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

class AllSalesReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Steps: [
        {
          stepName: "Sales - All",
          stepId: "allsales",
          classname: "active",
          Type: "allsales",
        },
        {
          stepName: "Sales - Clear",
          stepId: "clearsales",
          classname: "inactive",
          Type: "clearsales",
        },
        {
          stepName: "Sales - Unclear",
          stepId: "unclearsales",
          classname: "inactive",
          Type: "unclearsales",
        },
      ],

      //All Sales

      AllShipmentByCommissionList: [],
      finalLengthAllSales: 0,
      finalAmountAllSales: 0,
      ManagedByListAllSales: [],
      ManagedByAllSales: "",
      checkUserNameAllSales: false,
      currentLoginAllSales: {},
      FromDateAllSales: "",
      AllSalesAccess: {},
      SalesClearDeleteAccess: [],
      ToDateAllSales: "",
      Loading: false,
      allSalesSearch: false,
      checkAll: false,
      clearsales: [],
      open: false,
      close: false,

      // Shipment Not Cleared
      ShipmentNotClearedList: [],
      finalLengthUnclear: 0,
      finalAmountUnclear: 0,
      UnclearAccess: {},
      unclearSearch: false,

      // Sales Commission

      ShipmentByCommissionList: [],
      finalLength: 0,
      finalAmount: 0,
      ManagedByList: [],
      ManagedByQuery: "",
      ManagedBy: "",
      checkUserName: false,
      currentLogin: {},
      FromDate: "",
      ToDate: "",
      Access: {},
      clearSalesSearch: false,
    };
  }

  //All Sales Methods

  viewShipment = (ShippingID) => {
    const { history } = this.props;
    history.push({
      pathname: "ShipmentNew",
      state: {
        ShipppingID: ShippingID,
        filterlist: [],
        sortlist: [],
        FromDateAllSales: "",
        ToDateAllSales: "",
      },
    });
  };

  showLoader() {
    this.setState({ Loading: true });
  }

  hideLoader() {
    this.setState({ Loading: false });
  }

  async componentDidMount() {
    this.setState({
      AllSalesAccess: CommonConfig.getUserAccess("All Sales"),
      SalesClearDeleteAccess: CommonConfig.getUserAccess("Sales Commission"),
      UnclearAccess: CommonConfig.getUserAccess("Shipment Not Cleared"),
      checkUserNameAllSales:
        CommonConfig.getUserAccess("All Sales").AllAccess === 1 ? false : true,
      currentLoginAllSales: {
        value: CommonConfig.loggedInUserData().PersonID,
        label: CommonConfig.loggedInUserData().Name,
      },
      Access: CommonConfig.getUserAccess("Sales Commission"),
      checkUserName:
        CommonConfig.getUserAccess("Sales Commission").AllAccess === 1
          ? false
          : true,
      currentLogin: {
        value: CommonConfig.loggedInUserData().PersonID,
        label: CommonConfig.loggedInUserData().Name,
      },
    });
    if (!CommonConfig.isEmpty(this.props.location.state)) {
      this.showHide(this.props.location.state.id);
      let stepIndex = this.state.Steps.findIndex(
        (x) => x.stepId === this.props.location.state.id
      );
      this.navigateChange(stepIndex);
    } else {
      this.showHide("");
    }
    await this.getShipmentList();
    await this.getManagedByAllSales();
    await this.getManagedBy();
  }

  searchCommissionAllSales = () => {
    if (this.validateAllSales()) {
      this.setState({ allSalesSearch: true });
      this.showLoader();
      try {
        let data = {
          ManagedBy: this.state.checkUserNameAllSales
            ? this.state.currentLoginAllSales.value
            : CommonConfig.isEmpty(this.state.ManagedByAllSales)
            ? ""
            : this.state.ManagedByAllSales.value,
          FromDate: CommonConfig.isEmpty(this.state.FromDateAllSales)
            ? ""
            : moment(this.state.FromDateAllSales)
                .startOf("day")
                .format(CommonConfig.dateFormat.dbDateTime)
                .toString(),
          ToDate: CommonConfig.isEmpty(this.state.ToDateAllSales)
            ? ""
            : moment(this.state.ToDateAllSales)
                .endOf("day")
                .format(CommonConfig.dateFormat.dbDateTime)
                .toString(),
        };
        api
          .post("reports/getAllSales", data)
          .then((res) => {
            this.hideLoader();
            if (res.success) {
              this.setState({ AllShipmentByCommissionList: res.data });
            } else {
              cogoToast.error("Something went wrong");
            }
          })
          .catch((err) => {
            this.hideLoader();
            cogoToast.error("Something went wrong");
            console.log("error...", err);
          });
      } catch (err) {
        this.hideLoader();
        console.log("error....", err);
        cogoToast.error("Something went wrong");
      }
    } else {
      cogoToast.error("Please enter from/to date");
    }
  };
  handleClickCancel = () => {
    this.setState({ close: true, open: false });
  };
  handleDelete = () => {
    this.setState({ open: false });
    let data = this.state.previousSelectedclearsales;
    api.post("reports/SalesClearDeleteOption", data).then((res) => {
      this.hideLoader();
      if (res.success) {
        // this.setState({ AllShipmentByCommissionList: res.data });
        cogoToast.success("data delete successfully.");
        this.searchCommission("clearsales");
      }
    });
  };

  validateAllSales() {
    let IsValid = true;

    if (
      (!CommonConfig.isEmpty(this.state.FromDateAllSales) &&
        CommonConfig.isEmpty(this.state.ToDateAllSales)) ||
      (CommonConfig.isEmpty(this.state.FromDateAllSales) &&
        !CommonConfig.isEmpty(this.state.ToDateAllSales))
    ) {
      IsValid = false;
    }
    return IsValid;
  }

  getManagedByAllSales() {
    try {
      api
        .get("scheduleshipment/getShipmentManagedBy")
        .then((res) => {
          if (res.success) {
            for (var j = 0; j < res.data.length; j++) {
              this.state.ManagedByListAllSales.push(res.data[j]);
            }
          }
        })
        .catch((err) => {
          cogoToast.error("Something went wrong");
          console.log(err);
        });
    } catch (err) {
      cogoToast.error("Something went wrong");
      console.log(err);
    }
  }

  resetCommissionAllSales = () => {
    this.setState({
      AllShipmentByCommissionList: [],
      ManagedByAllSales: "",
      FromDateAllSales: "",
      ToDateAllSales: "",
      allSalesSearch: false,
    });
  };

  selectChangeAllSales = (event, value, type) => {
    if (value !== null) {
      if (type === "ManagedBy") {
        this.setState({ ManagedByAllSales: value });
      }
    }
  };

  dateChangeAllSales = (date, type) => {
    if (type === "FromDate") {
      this.setState({ FromDateAllSales: date });
    } else if (type === "ToDate") {
      this.setState({ ToDateAllSales: date });
    }
  };

  setLengthAllSales = (len) => {
    this.setState({ finalLengthAllSales: len });
  };

  finalAmountAllSales = (amountData) => {
    let amount = 0;
    for (var j = 0; j < amountData.length; j++) {
      amount = amount + Number(amountData[j].Amount.replace("$", ""));
    }
    this.setState({ finalAmountAllSales: parseFloat(amount).toFixed(2) });
  };

  checkPropsAllSales = (e) => {
    if (this.state.finalLengthAllSales !== e.sortedData.length) {
      this.setLengthAllSales(e.sortedData.length);
      this.finalAmountAllSales(e.sortedData);
    }
    return "";
  };

  //Sales Commission (Clear Sales) Methods

  searchCommission = (Type) => {
    if (this.validate()) {
      this.setState({ clearSalesSearch: true });
      this.showLoader();
      try {
        let data = {
          ManagedBy: this.state.checkUserName
            ? this.state.currentLogin.value
            : CommonConfig.isEmpty(this.state.ManagedBy)
            ? ""
            : this.state.ManagedBy.value,
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
        };
        api
          .post("reports/getShipmentListByCommission", data)
          .then((res) => {
            this.hideLoader();
            if (res.success) {
              this.setState({ ShipmentByCommissionList: res.data });
              let openArr = res.data;
              openArr = openArr.filter(
                (v, i, a) =>
                  a.findIndex((t) => t.CommisionId === v.CommisionId) === i
              );
              var i = 0;
              openArr.map((OBJ) => {
                OBJ.IsSelected = false;
                OBJ.Index = i;
                i++;
                return OBJ;
              });
              debugger;
              this.setState({
                [Type]: openArr,
              });
            } else {
              cogoToast.error("Something went wrong");
            }
          })
          .catch((err) => {
            this.hideLoader();
            cogoToast.error("Something went wrong");
            console.log("error...", err);
          });
      } catch (err) {
        this.hideLoader();
        console.log("error....", err);
        cogoToast.error("Something went wrong");
      }
    } else {
      cogoToast.error("Please enter from/to date");
    }
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

  getManagedBy() {
    try {
      api
        .get("scheduleshipment/getShipmentManagedBy")
        .then((res) => {
          if (res.success) {
            for (var j = 0; j < res.data.length; j++) {
              this.state.ManagedByList.push(res.data[j]);
            }
          }
        })
        .catch((err) => {
          cogoToast.error("Something went wrong");
          console.log(err);
        });
    } catch (err) {
      cogoToast.error("Something went wrong");
      console.log(err);
    }
  }

  resetCommission = () => {
    this.setState({
      ShipmentByCommissionList: [],
      ManagedBy: "",
      FromDate: "",
      ToDate: "",
      clearSalesSearch: false,
    });
  };

  selectChange = (event, value, type) => {
    if (value !== null) {
      if (type === "ManagedBy") {
        this.setState({ ManagedBy: value });
      }
    }
  };

  dateChange = (date, type) => {
    if (type === "FromDate") {
      this.setState({ FromDate: date });
    } else if (type === "ToDate") {
      this.setState({ ToDate: date });
    }
  };

  setLength = (len, type) => {
    this.setState({ finalLength: len });
  };
  //   setLengthInvoice(len, type) {
  //     console.log("len", len);
  //     this.setState({
  //       [type]: len,
  //     });
  //   }
  finalAmount = (amountData) => {
    let amount = 0;
    for (var j = 0; j < amountData.length; j++) {
      amount = amount + Number(amountData[j].Amount.replace("$", ""));
    }
    this.setState({ finalAmount: parseFloat(amount).toFixed(2) });
  };

  checkProps = (e, type) => {
    if (this.state.finalLength !== e.sortedData.length) {
      this.setLength(e.sortedData.length);
      this.finalAmount(e.sortedData);
    }
    // if (this.state[type] !== e.sortedData.length) {
    //   this.setLengthInvoice(e.sortedData.length, type);
    //   this.finalAmount(e.sortedData);
    // }
    return "";
  };

  //Shipment Not Cleared (Unclear Sales) Sales Methods

  getShipmentList = () => {
    try {
      api
        .get("reports/getShipmentAllCleared")
        .then((res) => {
          if (res.success) {
            if (this.state.UnclearAccess.AllAccess === 1) {
              this.setState({ ShipmentNotClearedList: res.data });
            } else {
              let shipmentList = res.data.filter(
                (x) =>
                  x.ManagedName === CommonConfig.loggedInUserData().PersonID
              );
              this.setState({ ShipmentNotClearedList: shipmentList });
            }
          }
        })
        .catch((err) => {
          cogoToast.error("Something went wrong");
          console.log("error...", err);
        });
    } catch (err) {
      console.log("error....", err);
      cogoToast.error("Something went wrong");
    }
  };

  setLengthUnclear = (len) => {
    this.setState({ finalLengthUnclear: len });
  };

  finalAmountUnclear = (amountData) => {
    let amount = 0;
    for (var j = 0; j < amountData.length; j++) {
      amount = amount + Number(amountData[j].Amount.replace("$", ""));
    }
    this.setState({ finalAmountUnclear: parseFloat(amount).toFixed(2) });
  };

  checkPropsUnclear = (e) => {
    if (this.state.finalLengthUnclear !== e.sortedData.length) {
      this.setLengthUnclear(e.sortedData.length);
      this.finalAmountUnclear(e.sortedData);
    }
    return "";
  };

  // navigate methods

  showHide(show) {
    if (
      CommonConfig.getUserAccess("All Sales") &&
      CommonConfig.getUserAccess("Sales Commission") &&
      CommonConfig.getUserAccess("Shipment Not Cleared")
    ) {
      if (
        CommonConfig.getUserAccess("All Sales").ReadAccess === 1 &&
        CommonConfig.getUserAccess("Sales Commission").ReadAccess === 1 &&
        CommonConfig.getUserAccess("Shipment Not Cleared").ReadAccess === 1
      ) {
        let steps = this.state.Steps;
        for (var i = 0; i < steps.length; i++) {
          if (steps[i]["stepId"] === show) {
            document.getElementById(show).style.display = "block";
            steps[i]["className"] = "active";
          } else {
            document.getElementById(steps[i]["stepId"]).style.display = "none";
            steps[i]["className"] = "inactive";
          }
        }
        // document.getElementById("allsales").style.display = "block";
        // document.getElementById("clearsales").style.display = "none";
        // document.getElementById("unclearsales").style.display = "none";
      }
      if (CommonConfig.getUserAccess("All Sales").ReadAccess === 0) {
        let currentSteps = this.state.Steps;
        let index = this.state.Steps.findIndex((x) => x.stepId === "allsales");
        currentSteps.splice(index, 1);
        currentSteps[0]["classname"] = "active";
        for (var j = 1; j < currentSteps.length; j++) {
          document.getElementById(currentSteps[j]["stepId"]).style.display =
            "none";
        }
        this.setState({ Steps: currentSteps });
        document.getElementById("allsales").style.display = "none";
      }
      if (CommonConfig.getUserAccess("Sales Commission").ReadAccess === 0) {
        let currentSteps = this.state.Steps;
        let index = this.state.Steps.findIndex(
          (x) => x.stepId === "clearsales"
        );
        currentSteps.splice(index, 1);
        currentSteps[0]["classname"] = "active";
        for (var j = 1; j < currentSteps.length; j++) {
          document.getElementById(currentSteps[j]["stepId"]).style.display =
            "none";
        }
        this.setState({ Steps: currentSteps });
        document.getElementById("clearsales").style.display = "none";
      }
      if (CommonConfig.getUserAccess("Shipment Not Cleared").ReadAccess === 0) {
        let currentSteps = this.state.Steps;
        let index = this.state.Steps.findIndex(
          (x) => x.stepId === "unclearsales"
        );
        currentSteps.splice(index, 1);
        currentSteps[0]["classname"] = "active";
        for (var j = 1; j < currentSteps.length; j++) {
          document.getElementById(currentSteps[j]["stepId"]).style.display =
            "none";
        }
        this.setState({ Steps: currentSteps });
        document.getElementById("unclearsales").style.display = "none";
      }
      if (show !== undefined && show !== "") {
        let steps = this.state.Steps;
        for (var i = 0; i < steps.length; i++) {
          if (steps[i]["stepId"] === show) {
            document.getElementById(show).style.display = "block";
            steps[i]["className"] = "active";
          } else {
            document.getElementById(steps[i]["stepId"]).style.display = "none";
            steps[i]["className"] = "inactive";
          }
        }
      }
    }
  }

  checkboxHeader = (props) => {
    return (
      <div>
        <input
          type="checkbox"
          checked={this.state.checkAll}
          onChange={(e) => this.handleCheckboxChange(e, props, "All")}
        />
      </div>
    );
  };

  renderCheckbox = (record) => {
    return (
      <div>
        <input
          type="checkbox"
          checked={record.original.IsSelected}
          onChange={(e) => this.handleCheckboxChange(e, record, "Single")}
        />
      </div>
    );
  };

  handleCheckboxChange = (e, record, type) => {
    debugger;
    let Type = this.state.currentTab;

    let checkedArr = this.state[Type];
    if (type === "Single") {
      checkedArr[record.original.Index]["IsSelected"] = e.target.checked;
    } else {
      let propsArr = record.data.map((x) => x._original);
      checkedArr.map((OBJ) => {
        OBJ.IsSelected =
          propsArr.findIndex((x) => x.Index === OBJ.Index) !== -1
            ? e.target.checked
            : OBJ.IsSelected;
        return OBJ;
      });

      this.setState({
        checkAll: e.target.checked,
      });
    }
    let previousList = checkedArr.filter((x) => x.IsSelected === true);
    let arrType = "previousSelected" + Type;

    this.setState({
      [Type]: checkedArr,
      [arrType]: previousList,
    });
  };
  deletedata = () => {
    if (this.state.previousSelectedclearsales.length > 0) {
      this.setState({ open: true });
    } else {
      cogoToast.error("Please select the data");
    }
  };
  navigateChange = (key) => {
    let stepsList = this.state.Steps;
    let activeIndex = stepsList.findIndex((x) => x.classname === "active");
    this.setState({
      clearsales: [],
      checkAll: false,
    });
    if (key !== activeIndex) {
      stepsList[key]["classname"] = "active";
      stepsList[activeIndex]["classname"] = "inactive";
      this.setState({
        Steps: stepsList,
        currentTab: stepsList[key]["Type"],
      });

      let divID = stepsList[key]["stepId"];
      let activeDiv = stepsList[activeIndex]["stepId"];
      document.getElementById(divID).style.display = "block";
      document.getElementById(activeDiv).style.display = "none";
      // this.searchCommission(stepsList[key]["Type"]);
    }
  };

  render() {
    //All Sales
    const allsalesColumns = [
      {
        Header: "Date",
        id: "ShipmentDate",
        sortMethod: (a, b) => {
          return CommonConfig.dateSortMethod(a, b);
        },
        accessor: (data) => {
          return data.ShipmentDate;
        },
        width: 85,
      },
      {
        Header: "Tracking",
        id: "Tracking",
        accessor: "TrackingNumber",
        width: 80,
      },
      {
        Header: "Contact Name",
        accessor: "ContactName",
        width: 100,
      },
      {
        Header: "From",
        accessor: "FromCountry",
        width: 80,
      },
      {
        Header: "To",
        accessor: "ToCountry",
        width: 80,
      },
      {
        Header: "Status",
        accessor: "ShipmentStatus",
        width: 100,
      },
      {
        Header: "Shipment",
        accessor: "ShipmentType",
        width: 81,
      },
      {
        Header: "Service",
        accessor: "ServiceName",
        width: 80,
      },
      {
        Header: "Sub Service",
        accessor: "SubServiceName",
        width: 73,
      },
      {
        Header: "Username",
        accessor: "UserName",
        width: 90,
      },
      {
        Header: "Managed By",
        accessor: "ManagedBy",
        width: 90,
      },
      {
        Header: "Amount",
        id: "Amount",
        sortMethod: (a, b) => {
          a = a.split("$ ")[1] !== undefined ? a.split("$ ")[1] : 0;
          b = b.split("$ ")[1] !== undefined ? b.split("$ ")[1] : 0;
          a = Number(a);
          b = Number(b);
          if (a.length === b.length) {
            return a > b ? 1 : -1;
          }
          return a.length > b.length ? 1 : -1;
        },
        accessor: (data) => {
          return CommonConfig.isEmpty(data.FinalAmount)
            ? ""
            : "$ " + parseFloat(data.FinalAmount).toFixed(2);
        },
        width: 70,
      },
    ];

    const {
      AllShipmentByCommissionList,
      FromDateAllSales,
      ToDateAllSales,
      finalLengthAllSales,
      finalAmountAllSales,
      ManagedByAllSales,
      checkUserNameAllSales,
      currentLoginAllSales,
    } = this.state;

    const managedByAllSales = this.state.ManagedByListAllSales.map((type) => {
      return { value: type.UserID, label: type.Name };
    });

    let salesColumns = [];
    salesColumns =
      this.state.SalesClearDeleteAccess.DeleteAccess === 1
        ? [
            {
              Header: (props) => this.checkboxHeader(props),
              Cell: this.renderCheckbox,
              sortable: false,
              filterable: false,
              width: 40,
            },
          ]
        : [];
    const clearcolumns = [
      ...salesColumns,

      {
        Header: "Date",
        id: "ShipmentDate",
        sortMethod: (a, b) => {
          return CommonConfig.dateSortMethod(a, b);
        },
        accessor: (data) => {
          return data.ShipmentDate;
        },
        width: 85,
      },
      {
        Header: "Tracking",
        id: "Tracking",
        accessor: "TrackingNumber",
        width: 80,
      },
      {
        Header: "Contact Name",
        accessor: "ContactName",
        width: 100,
      },
      {
        Header: "From",
        accessor: "FromCountry",
        width: 80,
      },
      {
        Header: "To",
        accessor: "ToCountry",
        width: 80,
      },
      {
        Header: "Status",
        accessor: "ShipmentStatus",
        width: 100,
      },
      {
        Header: "Shipment",
        accessor: "ShipmentType",
        width: 81,
      },
      {
        Header: "Service",
        accessor: "ServiceName",
        width: 80,
      },
      {
        Header: "Sub Service",
        accessor: "SubServiceName",
        width: 73,
      },
      {
        Header: "Username",
        accessor: "UserName",
        width: 90,
      },
      {
        Header: "Managed By",
        accessor: "ManagedBy",
        width: 90,
      },
      {
        Header: "Amount",
        id: "Amount",
        sortMethod: (a, b) => {
          a = a.split("$ ")[1] !== undefined ? a.split("$ ")[1] : 0;
          b = b.split("$ ")[1] !== undefined ? b.split("$ ")[1] : 0;
          a = Number(a);
          b = Number(b);
          if (a.length === b.length) {
            return a > b ? 1 : -1;
          }
          return a.length > b.length ? 1 : -1;
        },
        accessor: (data) => {
          if (data.CommissionStatus === "Active") {
            return CommonConfig.isEmpty(data.CommissionAmount)
              ? ""
              : "$ " + parseFloat(data.CommissionAmount).toFixed(2);
          } else {
            return CommonConfig.isEmpty(data.CommissionAmount)
              ? ""
              : "$ -" + parseFloat(data.CommissionAmount).toFixed(2);
          }
        },
        width: 70,
      },
    ];

    const {
      ShipmentByCommissionList,
      FromDate,
      ToDate,
      finalLength,
      finalAmount,
      ManagedBy,
      checkUserName,
      currentLogin,
    } = this.state;

    const managedBy = this.state.ManagedByList.map((type) => {
      return { value: type.UserID, label: type.Name };
    });

    //Unclear
    const unclearColumns = [
      {
        Header: "Date",
        id: "ShipmentDate",
        sortMethod: (a, b) => {
          return CommonConfig.dateSortMethod(a, b);
        },
        accessor: (data) => {
          return data.ShipmentDate;
        },
        width: 85,
      },
      {
        Header: "Tracking",
        id: "Tracking",
        accessor: "TrackingNumber",
        width: 90,
      },
      {
        Header: "Contact Name",
        accessor: "ContactName",
        width: 90,
      },
      {
        Header: "From",
        accessor: "FromCountry",
        width: 80,
      },
      {
        Header: "To",
        accessor: "ToCountry",
        width: 80,
      },
      {
        Header: "Status",
        accessor: "ShipmentStatus",
        width: 100,
      },
      {
        Header: "Shipment",
        accessor: "ShipmentType",
        width: 81,
      },
      {
        Header: "Service",
        accessor: "ServiceName",
        width: 80,
      },
      {
        Header: "Sub Service",
        accessor: "SubServiceName",
        width: 73,
      },
      {
        Header: "Username",
        accessor: "UserName",
        width: 90,
      },
      {
        Header: "Managed By",
        accessor: "ManagedBy",
        width: 90,
      },
      {
        Header: "Amount",
        id: "Amount",
        sortMethod: (a, b) => {
          a = a.split("$ ")[1] !== undefined ? a.split("$ ")[1] : 0;
          b = b.split("$ ")[1] !== undefined ? b.split("$ ")[1] : 0;
          a = Number(a);
          b = Number(b);
          if (a.length === b.length) {
            return a > b ? 1 : -1;
          }
          return a.length > b.length ? 1 : -1;
        },
        accessor: (data) => {
          return CommonConfig.isEmpty(data.FinalAmount)
            ? ""
            : "$ " + parseFloat(data.FinalAmount).toFixed(2);
        },
        width: 70,
      },
    ];
    const {
      ShipmentNotClearedList,
      finalLengthUnclear,
      finalAmountUnclear,
    } = this.state;

    return (
      <GridContainer justify="center" className="schedule-pickup-main-outer">
        <GridItem xs={12} sm={12}>
          <Card className="z-index-9">
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <SalesLeadIcon />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">
                Sales Reports
              </h4>
            </CardHeader>
            <CardBody>
              <div className="shipment-nav">
                <ul>
                  {this.state.Steps.map((step, key) => {
                    return (
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
              <div className="shipment-content mt-20">
                <div className="shipment-pane" id="allsales">
                  <GridItem>
                    <GridContainer justify="center">
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={4} className="z-index-9">
                          <div className="date-spl">
                            <InputLabel className={classes.label}>
                              Start Date
                            </InputLabel>
                            <FormControl fullWidth>
                              <Datetime
                                dateFormat={"MM/DD/YYYY"}
                                timeFormat={false}
                                value={FromDateAllSales}
                                onChange={(date) =>
                                  this.dateChangeAllSales(date, "FromDate")
                                }
                                closeOnSelect={true}
                                renderInput={(params) => (
                                  <TextField {...params} fullWidth />
                                )}
                              />
                            </FormControl>
                          </div>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4} className="z-index-9">
                          <div className="date-spl">
                            <InputLabel className={classes.label}>
                              End Date
                            </InputLabel>
                            <FormControl fullWidth>
                              <Datetime
                                dateFormat={"MM/DD/YYYY"}
                                timeFormat={false}
                                value={ToDateAllSales}
                                onChange={(date) =>
                                  this.dateChangeAllSales(date, "ToDate")
                                }
                                closeOnSelect={true}
                                renderInput={(params) => (
                                  <TextField {...params} fullWidth />
                                )}
                              />
                            </FormControl>
                          </div>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          <FormControl fullWidth className="mt-2">
                            <Autocomplete
                              id="combo-box-demo"
                              options={managedByAllSales}
                              value={
                                checkUserNameAllSales
                                  ? currentLoginAllSales
                                  : ManagedByAllSales
                              }
                              disabled={checkUserNameAllSales}
                              onChange={(event, value) =>
                                this.selectChangeAllSales(
                                  event,
                                  value,
                                  "ManagedBy"
                                )
                              }
                              getOptionLabel={(option) => option.label}
                              renderInput={(params) => (
                                <TextField {...params} label="Managed By" />
                              )}
                            />
                          </FormControl>
                        </GridItem>
                      </GridContainer>

                      <div className="shipment-submit  mt-20">
                        <div className="right">
                          <Button
                            color="rose"
                            onClick={() => this.searchCommissionAllSales()}
                          >
                            Search
                          </Button>
                          <Button
                            color="secondary"
                            onClick={() => this.resetCommissionAllSales()}
                          >
                            Reset
                          </Button>
                        </div>
                      </div>
                      {this.state.allSalesSearch ? (
                        <ReactTable
                          data={AllShipmentByCommissionList}
                          minRows={2}
                          pageText={
                            "Total rows : " +
                            finalLengthAllSales +
                            "\xa0\xa0\xa0\xa0\xa0\xa0\xa0" +
                            " Total Amount : $ " +
                            finalAmountAllSales
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                            "\xa0\xa0\xa0\xa0\xa0\xa0\xa0"
                          }
                          defaultFilterMethod={
                            CommonConfig.filterCaseInsensitive
                          }
                          getPaginationProps={(e) => this.checkPropsAllSales(e)}
                          filterable
                          sortable
                          resizable={false}
                          columns={allsalesColumns}
                          defaultPageSize={10}
                          showPaginationBottom={true}
                          className="-striped -highlight all-account-react"
                        />
                      ) : null}
                    </GridContainer>
                  </GridItem>
                </div>
                <div className="shipment-pane" id="clearsales">
                  <GridItem>
                    {this.state.Loading === true ? (
                      <div className="loading">
                        <SimpleBackdrop />
                      </div>
                    ) : null}
                    <GridContainer justify="center">
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={4} className="z-index-9">
                          <div className="date-spl">
                            <InputLabel className={classes.label}>
                              Start Date
                            </InputLabel>
                            <FormControl fullWidth>
                              <Datetime
                                dateFormat={"MM/DD/YYYY"}
                                timeFormat={false}
                                value={FromDate}
                                onChange={(date) =>
                                  this.dateChange(date, "FromDate")
                                }
                                closeOnSelect={true}
                                renderInput={(params) => (
                                  <TextField {...params} fullWidth />
                                )}
                              />
                            </FormControl>
                          </div>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4} className="z-index-9">
                          <div className="date-spl">
                            <InputLabel className={classes.label}>
                              End Date
                            </InputLabel>
                            <FormControl fullWidth>
                              <Datetime
                                dateFormat={"MM/DD/YYYY"}
                                timeFormat={false}
                                value={ToDate}
                                onChange={(date) =>
                                  this.dateChange(date, "ToDate")
                                }
                                closeOnSelect={true}
                                renderInput={(params) => (
                                  <TextField {...params} fullWidth />
                                )}
                              />
                            </FormControl>
                          </div>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          <FormControl fullWidth className="mt-2">
                            <Autocomplete
                              id="combo-box-demo"
                              options={managedBy}
                              value={checkUserName ? currentLogin : ManagedBy}
                              disabled={checkUserName}
                              onChange={(event, value) =>
                                this.selectChange(event, value, "ManagedBy")
                              }
                              getOptionLabel={(option) => option.label}
                              renderInput={(params) => (
                                <TextField {...params} label="Managed By" />
                              )}
                            />
                          </FormControl>
                        </GridItem>
                      </GridContainer>

                      <div className="shipment-submit  mt-20">
                        <div className="right">
                          {this.state.SalesClearDeleteAccess.DeleteAccess ===
                          1 ? (
                            <Button
                              color="rose"
                              onClick={() => this.deletedata()}
                            >
                              Delete
                            </Button>
                          ) : null}
                          <Button
                            color="rose"
                            onClick={() => this.searchCommission("clearsales")}
                          >
                            Search
                          </Button>
                          <Button
                            color="secondary"
                            onClick={() => this.resetCommission()}
                          >
                            Reset
                          </Button>
                        </div>
                      </div>

                      {this.state.clearSalesSearch ? (
                        <ReactTable
                          data={ShipmentByCommissionList}
                          minRows={2}
                          pageText={
                            "Total rows : " +
                            finalLength +
                            "\xa0\xa0\xa0\xa0\xa0\xa0\xa0" +
                            " Total Amount : $ " +
                            finalAmount
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                            "\xa0\xa0\xa0\xa0\xa0\xa0\xa0"
                          }
                          defaultFilterMethod={
                            CommonConfig.filterCaseInsensitive
                          }
                          getPaginationProps={(e) =>
                            this.checkProps(e, "clearsales")
                          }
                          filterable
                          resizable={false}
                          columns={clearcolumns}
                          defaultPageSize={10}
                          showPaginationBottom={true}
                          className="-striped -highlight all-account-react"
                        />
                      ) : null}
                    </GridContainer>
                  </GridItem>
                </div>
                <div className="shipment-pane" id="unclearsales">
                  <GridItem>
                    <GridContainer justify="center">
                      <ReactTable
                        data={ShipmentNotClearedList}
                        minRows={2}
                        pageText={
                          "Total rows : " +
                          finalLengthUnclear +
                          "\xa0\xa0\xa0\xa0\xa0\xa0\xa0" +
                          " Total Amount : $ " +
                          finalAmountUnclear
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                          "\xa0\xa0\xa0\xa0\xa0\xa0\xa0"
                        }
                        defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                        getPaginationProps={(e) => this.checkPropsUnclear(e)}
                        filterable
                        resizable={false}
                        columns={unclearColumns}
                        defaultPageSize={10}
                        showPaginationBottom={true}
                        className="-striped -highlight all-account-react"
                      />
                    </GridContainer>
                  </GridItem>
                </div>
              </div>
            </CardBody>
          </Card>
        </GridItem>
        <div>
          <Dialog
            open={this.state.open}
            onClose={this.state.close}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Confirm Delete"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure want to delete?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClickCancel} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleDelete} color="primary" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </GridContainer>
    );
  }
}

export default AllSalesReport;
