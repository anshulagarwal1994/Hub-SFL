import React, { Component } from "react";
// import Shipment from './ShipmentList';
// import MyShipment from '../MyShipment/MyShipment';
import ReactTable from "react-table";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import GridContainer from "components/Grid/GridContainer.js";
import moment from "moment";
import GridItem from "components/Grid/GridItem.js";
import api from "../../utils/apiClient";
import { CommonConfig } from "../../utils/constant";
import cogoToast from "cogo-toast";
import SimpleBackdrop from "../../utils/general";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CustomInput from "components/CustomInput/CustomInput.js";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import DirectionsBoatIcon from "@material-ui/icons/DirectionsBoat";
import Datetime from "react-datetime";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { stubFalse } from "lodash";
import { useDetectClickOutside } from "react-detect-click-outside";
import { query } from "chartist";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const useStyles = () => makeStyles(styles);
const classes = useStyles();

class ShipmentNavigation extends Component {
  constructor(props) {
    // this.ref = useDetectClickOutside.bind((onTriggered = closeDropdown));
    super(props);
    this.state = {
      //Navigation
      Steps: [
        {
          stepName: "Shipment",
          stepId: "shipment",
          classname: "active",
        },
        {
          stepName: "My Shipment",
          stepId: "myshipment",
          classname: "inactive",
        },
        {
          stepName: "Search",
          stepId: "search",
          classname: "inactive",
        },
      ],

      //Shipment List
      Loading: false,
      serviceValue: [],
      filterProps: [],
      previousFilterList: [],
      sortProps: [],
      previousSortList: [],
      shipmentList: [],
      Access: [],
      loggedUser: 0,
      finalLength: 0,
      shipmentstatusList: [],

      //Search Shipment
      checkdata: "",
      checkAll: false,
      serachshowhide: false,
      UserName: "",
      currentLogin: {},
      checkUserName: false,
      ManagedByList: [],
      ManagedBy: "",
      ShipmentTypeList: [],
      ShipmentType: "",
      ServiceNameList: [],
      ServiceName: "",
      SubServiceNameList: [],
      SubServiceName: "",
      StatusList: [],
      ShipmentStatus: [],
      AllClearStatusList: [],
      AllClear: "",
      expand: false,

      ShipmentDate: "",
      shipmentDateErr: false,
      shipmentDateChange: false,
      shipmentDateHelperText: "",

      ContactName: "",
      contactNameErr: false,
      contactNameChange: false,
      contactNameHelperText: "",

      ContactNumber: "",
      contactNumberErr: false,
      contactNumberChange: false,
      contactNumberHelperText: "",

      Email: "",
      emailErr: false,
      emailChange: false,
      emailHelperText: "",

      StatusQuery: "",
      newvalidate: false,
      TrackingNumber: "",
      trackingNumberErr: false,
      trackingNumberChange: false,
      trackingNumberHelperText: "",

      CardNumber: "",
      cardNumberErr: false,
      cardNumberChange: false,
      cardNumberHelperText: "",

      AccountNumber: "",
      accountNumberErr: false,
      accountNumberChange: false,
      accountNumberHelperText: "",

      ConfirmationNumber: "",
      confirmationNumberErr: false,
      confirmationNumberChange: false,
      confirmationNumberHelperText: "",

      Amount: "",
      SearchAccess: [],
      SearchList: [],
      SearchClicked: false,
      searchfinalLength: 0,

      // My Shipment
      IsDropDownShow: false,
      //ref: useDetectClickOutside({ onTriggered: IsDropDownShow }),
      myshipmentserviceValue: [],
      myshipmentfilterProps: [],
      myshipmentpreviousFilterList: [],
      myshipment: [],
      myshipmentpreviousSortList: [],
      myshipmentshipmentList: [],
      myshipmentAccess: [],
      myshipmentfinalLength: 0,
      myshipmentstatusList: [],
      shipmentquery: "",
    };
  }

  async componentDidMount() {
    this.setState({
      Access: CommonConfig.getUserAccess("Shipment"),
      loggedUser: CommonConfig.loggedInUserData().PersonID,
      myshipmentAccess: CommonConfig.getUserAccess("Shipment"),
      SearchAccess: CommonConfig.getUserAccess("Search Shipment"),
      checkUserName:
        CommonConfig.getUserAccess("Search Shipment").AllAccess === 1
          ? false
          : true,
      currentLogin: {
        value: CommonConfig.loggedInUserData().PersonID,
        label: CommonConfig.loggedInUserData().Name,
      },
    });
    let APIcheck = true;
    if (
      this.props.history.location.state !== undefined &&
      this.props.history.location.state !== null
    ) {
      if (this.props.history.location.state.type === "MyShipment") {
        this.showHide("myshipment");
      } else {
        this.showHide();
      }
    } else {
      this.showHide();
    }
    // await this.getShipmentListByStatus(' AND(sm.ShipmentStatus = "New Request") ',"Myshipment");
    await this.getManagedBy();
    await this.getShipmentType();
    await this.getStatusList();
    await this.getAllClearStatus();
    if (
      this.props.history.location.state !== undefined &&
      this.props.history.location.state !== null
    ) {
      if (this.props.history.location.state.type === "Shipment") {
        this.setState({
          previousFilterList: this.props.history.location.state.filterlist,
          shipmentstatusList: this.props.history.location.state
            .shipmentstatusList,
          previousSortList: this.props.history.location.state.sortlist,
        });
        this.shipmentStatusChange(
          "",
          this.props.history.location.state.shipmentstatusList,
          "Shipment"
        );
        APIcheck = false;
      }
    } else {
      var finalSort = {
        id: "ShipmentDate",
        desc: true,
      };

      this.setState({ previousSortList: [finalSort] });
    }
    let myAPIcheck = true;
    this.setState({
      checkdata: [
        {
          value: "New Request",
          label: "New Request",
          IsSelected: true,
          Index: 1,
        },
      ],
    });
    this.getShipmentListByStatus("Shipment");
    if (APIcheck) {
      let newFilter = [{ label: "New Request", value: "New Request" }];
      this.shipmentStatusChange("", newFilter, "Shipment");
      this.getShipmentListByStatus("Shipment");
    }
    if (
      this.props.history.location.state !== undefined &&
      this.props.history.location.state !== null
    ) {
      if (this.props.history.location.state.type === "MyShipment") {
        this.setState({
          myshipmentpreviousFilterList: this.props.history.location.state
            .myfilterlist,
          myshipmentstatusList: this.props.history.location.state
            .myshipmentstatusList,
          myshipmentpreviousSortList: this.props.history.location.state
            .mysortlist,
        });
        this.shipmentStatusChange(
          "",
          this.props.history.location.state.myshipmentstatusList,
          "Myshipment"
        );
        myAPIcheck = false;
      }
    } else {
      var finalSort = {
        id: "ShipmentDate",
        desc: true,
      };

      this.setState({ myshipmentpreviousSortList: [finalSort] });
    }
    if (myAPIcheck) {
      this.setState({
        checkdata: `All`,
      });
      let allFilter = [{ label: "New Request", value: "New Request" }];
      this.shipmentStatusChange("", allFilter, "Myshipment");
      this.getShipmentListByStatus("Myshipment");
    }
  }

  // Shipment Methods

  getShipmentList() {
    this.showLoader();
    try {
      api
        .get("scheduleshipment/getShipmentList")
        .then((res) => {
          this.setState({ Loading: false });
          if (res.success) {
            if (this.state.Access.AllAccess === 1) {
              this.setState({ shipmentList: res.data });
            } else {
              let shipmentList = res.data.filter(
                (x) => x.ManagedBy === this.state.loggedUser
              );
              this.setState({ shipmentList: shipmentList });
            }
          } else {
            cogoToast.error("Something Went Wrong");
          }
        })
        .catch((err) => {
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {}
  }

  editShipment = (record) => {
    const { history } = this.props;
    history.push({
      pathname: "ShipmentNew",
      state: {
        ShipppingID: record.original.ShippingID,
        filterlist: this.state.filterProps,
        type: "Shipment",
        shipmentstatusList: this.state.shipmentstatusList,
        sortlist: this.state.sortProps,
      },
    });
  };

  filterMethod = (event, value) => {
    this.setState({ serviceValue: value });
  };

  setFilterProps = (filterValue) => {
    this.setState({
      filterProps: filterValue.filtered,
      sortProps: filterValue.sorted,
    });
  };

  filterProps = (e) => {
    if (this.state.filterProps !== e.filtered) {
      this.setFilterProps(e);
    }
    if (this.state.sortProps !== e.sorted) {
      this.setFilterProps(e);
    }
    return "";
  };

  setLength = (len) => {
    this.setState({ finalLength: len });
  };

  checkProps = (e) => {
    if (this.state.finalLength !== e.sortedData.length) {
      this.setLength(e.sortedData.length);
    }
    return "";
  };

  shipmentStatusChange = (e, value, type) => {
    if (value !== null) {
      if (type === "Shipment") {
        if (value.length !== 0) {
          let query = "";
          this.state.shipmentquery = "";
          let StatusQuery = "";
          let allValue = value.filter((x) => x.value === "All");
          if (allValue.length !== 0) {
            StatusQuery = `All`;
            query = query + StatusQuery;
            this.state.shipmentquery = this.state.shipmentquery + StatusQuery;
          } else {
            for (var j = 0; j < value.length; j++) {
              if (j === 0) {
                if (value.length === 1) {
                  StatusQuery =
                    ` AND ( sm.ShipmentStatus = "` + value[j].value + `")`;
                } else {
                  StatusQuery =
                    ` AND ( sm.ShipmentStatus = "` + value[j].value + `"`;
                }
              } else if (j + 1 === value.length) {
                StatusQuery =
                  ` OR sm.ShipmentStatus = "` + value[j].value + `")`;
              } else {
                StatusQuery =
                  ` OR sm.ShipmentStatus = "` + value[j].value + `"`;
              }
              query = query + StatusQuery;
              this.state.shipmentquery = this.state.shipmentquery + StatusQuery;
            }
          }
        }
        if (value.length !== 0) {
          let allValue = value.filter((x) => x.value === "All");
          if (allValue.length !== 0) {
            var dataset = this.state.StatusList.filter(
              (x) => x.value !== "All"
            );
            this.setState({ shipmentstatusList: dataset });
          } else {
            this.setState({ shipmentstatusList: value });
          }
        } else {
          this.setState({ shipmentstatusList: value, shipmentquery: "" });
        }
      } else if (type === "Myshipment") {
        if (value.length !== 0) {
          let query = "";
          this.state.shipmentquery = "";
          let StatusQuery = "";
          var dataset = "";
          let allValue = value.filter((x) => x.value === "All");
          if (allValue.length !== 0) {
            StatusQuery = `All`;
            query = query + StatusQuery;
            this.state.shipmentquery = this.state.shipmentquery + StatusQuery;
          } else {
            for (var j = 0; j < value.length; j++) {
              if (j === 0) {
                if (value.length === 1) {
                  StatusQuery =
                    ` AND ( sm.ShipmentStatus = "` + value[j].value + `")`;
                } else {
                  StatusQuery =
                    ` AND ( sm.ShipmentStatus = "` + value[j].value + `"`;
                }
              } else if (j + 1 === value.length) {
                StatusQuery =
                  ` OR sm.ShipmentStatus = "` + value[j].value + `")`;
              } else {
                StatusQuery =
                  ` OR sm.ShipmentStatus = "` + value[j].value + `"`;
              }
              query = query + StatusQuery;
              this.state.shipmentquery = this.state.shipmentquery + StatusQuery;
            }
          }
        }
        if (value.length !== 0) {
          let allValue = value.filter((x) => x.value === "All");
          if (allValue.length !== 0) {
            var dataset = this.state.StatusList.filter(
              (x) => x.value !== "All"
            );
            this.setState({ myshipmentstatusList: dataset });
          } else {
            this.setState({ myshipmentstatusList: value });
          }
        } else {
          this.setState({ myshipmentstatusList: value, shipmentquery: "" });
        }
      }
    }
  };

  getShipmentListByStatus = (type) => {
    try {
      debugger;
      let Query = "";
      let inputdata = this.state.checkdata;
      if (inputdata === "All") {
        Query = inputdata;
      } else if (inputdata.length === 1) {
        Query = ` AND ( sm.ShipmentStatus = "` + inputdata[0].value + `")`;
      } else {
        for (var j = 0; j < inputdata.length; j++) {
          if (j === 0) {
            Query = ` AND ( sm.ShipmentStatus = "` + inputdata[j].value + `"`;
          } else {
            Query =
              Query + ` OR  sm.ShipmentStatus = "` + inputdata[j].value + `"`;
          }
        }
        if (!CommonConfig.isEmpty(Query)) {
          Query = Query + `)`;
        }
      }
      console.log("query: ", Query);
      let data = {
        ContactName: "",
        ContactNumber: "",
        Email: "",
        TrackingNumber: "",
        CardNumber: "",
        AccountNumber: "",
        ConfirmationNumber: "",
        Amount: "",
        LoginID:
          type === "Myshipment" ? CommonConfig.loggedInUserData().LoginID : "",
        IsLike: 0,
        AllClear: "",
        ManagedBy: "",
        ShipmentType: "",
        ServiceName: "",
        SubServiceName: "",
        ShipmentDate: "",
        ShipmentStatus: CommonConfig.isEmpty(Query) ? "" : Query,
      };
      this.showLoader();
      api
        .post("reports/getShipmentReport", data)
        .then((res) => {
          this.hideLoader();
          if (res.success === true) {
            if (type === "Shipment") {
              if (this.state.Access.AllAccess === 1) {
                this.setState({ shipmentList: res.data[0] });
              } else {
                let shipmentList = res.data[0].filter(
                  (x) => x.ManagedBy === this.state.loggedUser
                );
                this.setState({ shipmentList: shipmentList });
              }
            } else {
              this.setState({ myshipmentshipmentList: res.data[0] });
            }
          } else {
            cogoToast.error("Something went wrong");
          }
        })
        .catch((err) => {
          this.hideLoader();
          cogoToast.error("Something went wrong 2");
        });
    } catch (err) {
      cogoToast.error("Something went wrong 3");
    }
    //}
  };

  // Search Shipment

  toggle = (e) => {
    this.setState({
      expand: !this.state.expand,
    });
  };

  showLoader() {
    this.setState({ Loading: true });
  }

  getAllClearStatus() {
    try {
      let data = {
        stringMapType: "ALLCLEARSTATUS",
      };

      api
        .post("stringMap/getstringMap", data)
        .then((result) => {
          this.setState({ AllClearStatusList: result.data });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  allClearMenu = () => {
    return this.state.AllClearStatusList.map((yn) => {
      let val =
        yn.Description === "Yes"
          ? 1
          : yn.Description === "No"
          ? 0
          : yn.Description;
      return (
        <MenuItem classes={{ root: classes.selectMenuItem }} value={val}>
          {" "}
          {yn.ExtDescription}{" "}
        </MenuItem>
      );
    });
  };

  hideLoader() {
    this.setState({ Loading: false });
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

  getShipmentType() {
    try {
      let data = {
        stringMapType: "SHIPMENTTYPE",
      };

      api
        .post("stringMap/getstringMap", data)
        .then((result) => {
          this.setState({ ShipmentTypeList: result.data });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      cogoToast.error("Something went wrong");
      console.log(err);
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
              ServiceNameList: result.data,
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
              SubServiceNameList: result.data,
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

  getStatusList = () => {
    try {
      let data = {
        stringMapType: "SHIPMENTSTATUS",
      };
      api
        .post("stringMap/getstringMap", data)
        .then((result) => {
          const statusList = result.data.map((type) => {
            return { value: type.Description, label: type.Description };
          });
          var i = 0;
          statusList.map((OBJ) => {
            OBJ.IsSelected = false;
            OBJ.Index = i;
            i++;
            return OBJ;
          });
          statusList
            .filter((x) => x.value === "New Request")
            .map((OBJ) => {
              OBJ.IsSelected = true;
              return OBJ;
            });
          this.setState({ StatusList: statusList });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  };

  selectChange = (event, value, type) => {
    if (value !== null) {
      if (type === "ManagedBy") {
        this.setState({ ManagedBy: value });
      } else if (type === "ShipmentType") {
        this.setState({
          ShipmentType: value,
          ServiceName: "",
          SubServiceName: "",
          ServiceNameList: [],
          SubServiceNameList: [],
        });
        this.getServiceByShipmentType(value.value);
      } else if (type === "ServiceName") {
        this.setState({
          ServiceName: value,
          SubServiceName: "",
          SubServiceNameList: [],
        });
        this.getSubserviceName(value.value, this.state.ShipmentType.value);
      } else if (type === "SubServiceName") {
        this.setState({ SubServiceName: value });
      } else if (type === "ShipmentStatus") {
        let allValue = value.filter((x) => x.value === "All");
        var dataset;
        if (value.length !== 0) {
          let query = "";
          this.state.shipmentquery = "";
          let StatusQuery = "";
          let allValue = value.filter((x) => x.value === "All");
          if (allValue.length !== 0) {
            StatusQuery = `All`;
            query = query + StatusQuery;
            this.state.shipmentquery = this.state.shipmentquery + StatusQuery;
          } else {
            for (var j = 0; j < value.length; j++) {
              if (j === 0) {
                if (value.length === 1) {
                  StatusQuery =
                    ` AND ( sm.ShipmentStatus = "` + value[j].value + `")`;
                } else {
                  StatusQuery =
                    ` AND ( sm.ShipmentStatus = "` + value[j].value + `"`;
                }
              } else if (j + 1 === value.length) {
                StatusQuery =
                  ` OR sm.ShipmentStatus = "` + value[j].value + `")`;
              } else {
                StatusQuery =
                  ` OR sm.ShipmentStatus = "` + value[j].value + `"`;
              }
              query = query + StatusQuery;
              this.state.shipmentquery = this.state.shipmentquery + StatusQuery;
            }
          }
          // this.setState({ StatusQuery: query });
          this.setState({ StatusQuery: this.state.shipmentquery });
          if (value.length !== 0) {
            let allValue = value.filter((x) => x.value === "All");
            if (allValue.length !== 0) {
              dataset = this.state.StatusList.filter((x) => x.value !== "All");
            }
          }
        } else {
          this.setState({ ShipmentStatus: [], shipmentquery: "" });
        }
        if (allValue.length !== 0) {
          this.setState({ ShipmentStatus: dataset });
        } else {
          this.setState({ ShipmentStatus: value, shipmentquery: "" });
        }
      }
    }
  };

  validate() {
    let IsValid = true;
    debugger;
    if (this.state.checkdata.length === 0) {
      IsValid = false;
      // this.setState({ newvalidate: true });
      //cogoToast.error("Please select shipment status");
    }
    if (
      this.state.contactNameChange &&
      this.state.ContactName.length < 3 &&
      !CommonConfig.isEmpty(this.state.ContactName)
    ) {
      IsValid = false;
      this.setState({
        contactNameErr: true,
        contactNameHelperText: "Please enter atleast 3 character",
      });
    }
    if (
      this.state.contactNumberChange &&
      this.state.ContactNumber.length < 3 &&
      !CommonConfig.isEmpty(this.state.ContactNumber)
    ) {
      IsValid = false;
      this.setState({
        contactNumberErr: true,
        contactNumberHelperText: "Please enter atleast 3 character",
      });
    }
    if (
      this.state.emailChange &&
      this.state.Email.length < 3 &&
      !CommonConfig.isEmpty(this.state.Email)
    ) {
      IsValid = false;
      this.setState({
        emailErr: true,
        emailHelperText: "Please enter atleast 3 character",
      });
    }
    if (
      this.state.trackingNumberChange &&
      this.state.TrackingNumber.length < 3 &&
      !CommonConfig.isEmpty(this.state.TrackingNumber)
    ) {
      IsValid = false;
      this.setState({
        trackingNumberErr: true,
        trackingNumberHelperText: "Please enter atleast 3 character",
      });
    }
    if (
      this.state.accountNumberChange &&
      this.state.AccountNumber.length < 3 &&
      !CommonConfig.isEmpty(this.state.AccountNumber)
    ) {
      IsValid = false;
      this.setState({
        accountNumberErr: true,
        accountNumberHelperText: "Please enter atleast 3 character",
      });
    }
    if (
      this.state.cardNumberChange &&
      this.state.CardNumber.length < 3 &&
      !CommonConfig.isEmpty(this.state.CardNumber)
    ) {
      IsValid = false;
      this.setState({
        cardNumberErr: true,
        cardNumberHelperText: "Please enter atleast 3 character",
      });
    }
    if (
      this.state.confirmationNumberChange &&
      this.state.ConfirmationNumber.length < 3 &&
      !CommonConfig.isEmpty(this.state.ConfirmationNumber)
    ) {
      IsValid = false;
      this.setState({
        confirmationNumberErr: true,
        confirmationNumberHelperText: "Please enter atleast 3 character",
      });
    }

    return IsValid;
  }

  handleChange = (e, type) => {
    if (type === "UserName") {
      this.setState({ UserName: e.target.value });
    }
    if (type === "ContactName") {
      this.setState({
        ContactName: e.target.value,
        contactNameChange: true,
        contactNameErr: false,
        contactNameHelperText: "",
      });
    }
    if (type === "ContactNumber") {
      this.setState({
        ContactNumber: e.target.value,
        contactNumberChange: true,
        contactNumberErr: false,
        contactNumberHelperText: "",
      });
    }
    if (type === "Email") {
      this.setState({
        Email: e.target.value,
        emailChange: true,
        emailErr: false,
        emailHelperText: "",
      });
    }
    if (type === "TrackingNumber") {
      this.setState({
        TrackingNumber: e.target.value.trim(),
        trackingNumberChange: true,
        trackingNumberErr: false,
        trackingNumberHelperText: "",
      });
    }
    if (type === "CardNumber") {
      this.setState({
        CardNumber: e.target.value,
        cardNumberChange: true,
        cardNumberErr: false,
        cardNumberHelperText: "",
      });
    }
    if (type === "AccountNumber") {
      this.setState({
        AccountNumber: e.target.value,
        accountNumberChange: true,
        accountNumberErr: false,
        accountNumberHelperText: "",
      });
    }
    if (type === "ConfirmationNumber") {
      this.setState({
        ConfirmationNumber: e.target.value,
        confirmationNumberChange: true,
        confirmationNumberErr: false,
        confirmationNumberHelperText: "",
      });
    }
    if (type === "Amount") {
      this.setState({ Amount: e.target.value, amountChange: true });
    }
    if (type === "AllClear") {
      this.setState({ AllClear: e.target.value });
    }
  };

  dateChange = (date, type) => {
    this.setState({
      [type]: date,
    });
  };

  searchReport() {
    if (this.validate()) {
      if (
        !(
          CommonConfig.isEmpty(this.state.ContactName) &&
          CommonConfig.isEmpty(this.state.ConfirmationNumber) &&
          CommonConfig.isEmpty(this.state.Email) &&
          CommonConfig.isEmpty(this.state.ContactNumber) &&
          CommonConfig.isEmpty(this.state.TrackingNumber) &&
          CommonConfig.isEmpty(this.state.AccountNumber) &&
          CommonConfig.isEmpty(this.state.CardNumber) &&
          CommonConfig.isEmpty(this.state.ManagedBy) &&
          this.state.checkdata.length === 0 &&
          // CommonConfig.isEmpty(this.state.checkdata) &&
          CommonConfig.isEmpty(this.state.ShipmentType) &&
          CommonConfig.isEmpty(this.state.Amount) &&
          CommonConfig.isEmpty(this.state.UserName) &&
          CommonConfig.isEmpty(this.state.ShipmentDate) &&
          CommonConfig.isEmpty(this.state.AllClear)
        )
      ) {
        try {
          let Query = "";
          let inputdata = this.state.checkdata;
          if (inputdata === "All") {
            Query = inputdata;
          } else if (inputdata.length === 1) {
            Query = ` AND ( sm.ShipmentStatus = "` + inputdata[0].value + `")`;
          } else {
            for (var j = 0; j < inputdata.length; j++) {
              if (j === 0) {
                Query =
                  ` AND ( sm.ShipmentStatus = "` + inputdata[j].value + `"`;
              } else {
                Query =
                  Query +
                  ` OR  sm.ShipmentStatus = "` +
                  inputdata[j].value +
                  `"`;
              }
            }
            if (!CommonConfig.isEmpty(Query)) {
              Query = Query + `)`;
            }
          }
          let data = {
            ContactName: CommonConfig.isEmpty(this.state.ContactName)
              ? ""
              : this.state.ContactName,
            ContactNumber: CommonConfig.isEmpty(this.state.ContactNumber)
              ? ""
              : this.state.ContactNumber,
            Email: CommonConfig.isEmpty(this.state.Email)
              ? ""
              : this.state.Email,
            TrackingNumber: CommonConfig.isEmpty(this.state.TrackingNumber)
              ? ""
              : this.state.TrackingNumber,
            CardNumber: CommonConfig.isEmpty(this.state.CardNumber)
              ? ""
              : this.state.CardNumber,
            AccountNumber: CommonConfig.isEmpty(this.state.AccountNumber)
              ? ""
              : this.state.AccountNumber,
            ConfirmationNumber: CommonConfig.isEmpty(
              this.state.ConfirmationNumber
            )
              ? ""
              : this.state.ConfirmationNumber,
            Amount: CommonConfig.isEmpty(this.state.Amount)
              ? ""
              : this.state.Amount,
            LoginID: CommonConfig.isEmpty(this.state.UserName)
              ? ""
              : this.state.UserName,
            AllClear: CommonConfig.isEmpty(this.state.AllClear)
              ? ""
              : this.state.AllClear,
            IsLike: 1,
            ManagedBy: this.state.checkUserName
              ? this.state.currentLogin.value
              : CommonConfig.isEmpty(this.state.ManagedBy)
              ? ""
              : this.state.ManagedBy.value,
            ShipmentType: CommonConfig.isEmpty(this.state.ShipmentType)
              ? ""
              : this.state.ShipmentType.value,
            ServiceName: CommonConfig.isEmpty(this.state.ServiceName)
              ? ""
              : this.state.ServiceName.value,
            SubServiceName: CommonConfig.isEmpty(this.state.SubServiceName)
              ? ""
              : this.state.SubServiceName.value,
            ShipmentDate: CommonConfig.isEmpty(this.state.ShipmentDate)
              ? ""
              : moment(this.state.ShipmentDate)
                  .format(CommonConfig.dateFormat.dbDateOnly)
                  .toString(),
            ShipmentStatus: CommonConfig.isEmpty(Query) ? "" : Query,
          };
          this.setState({ SearchClicked: true, IsDropDownShow: false });

          this.showLoader();
          if (data.AllClear == "Ready for Yes") {
            data.AllClear = 3;
          }
          api
            .post("reports/getShipmentReport", data)
            .then((res) => {
              this.hideLoader();
              console.log("res data: ", res);
              if (res.success) {
                this.setState({ SearchList: res.data[0] });
              } else {
                cogoToast.error("Something went wrong");
              }
            })
            .catch((err) => {
              this.hideLoader();
              cogoToast.error("Something went wrong in Search Report");
            });
        } catch (err) {
          this.hideLoader();
          console.log("err", err);
        }
      } else {
        cogoToast.error("Please select/enter atleast one field.");
      }
    } else {
      if (this.state.checkdata.length === 0) {
        cogoToast.error("Please select shipment status");
      } else {
        cogoToast.error(
          "There were errors found in form.Please correct error and resubmit form."
        );
      }
    }
  }

  viewShipment = (ShippingID) => {
    const { history } = this.props;
    history.push({
      pathname: "ShipmentNew",
      state: {
        ShipppingID: ShippingID,
        filterlist: [],
        sortlist: [],
      },
    });
  };

  resetReport = () => {
    this.setState({
      UserName: "",
      SearchClicked: false,
      ManagedBy: "",
      ShipmentType: "",
      StatusQuery: "",
      ServiceName: "",
      ShipmentDate: "",
      SubServiceName: "",
      Amount: "",
      AllClear: "",
      AccountNumber: "",
      ConfirmationNumber: "",
      CardNumber: "",
      Email: "",
      ContactName: "",
      ContactNumber: "",
      TrackingNumber: "",
      ShipmentStatus: [],
      ServiceNameList: [],
      SubServiceNameList: [],
      SearchList: [],
    });
  };

  searchShipmentlen = (len) => {
    this.setState({ searchfinalLength: len });
  };

  searchCheckProps = (e) => {
    if (this.state.searchfinalLength !== e.sortedData.length) {
      this.searchShipmentlen(e.sortedData.length);
    }
    return "";
  };

  // My Shipment Methods

  myshipmentgetShipmentList() {
    try {
      let data = {
        LoginID: CommonConfig.loggedInUserData().PersonID,
      };
      api
        .post("scheduleshipment/getMyShipmentList", data)
        .then((res) => {
          this.setState({ Loading: false });
          if (res.success) {
            this.setState({ myshipmentshipmentList: res.data });
          } else {
            cogoToast.error("Something Went Wrong");
          }
        })
        .catch((err) => {
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {}
  }
  // showSearch = () => {
  //   this.setState({ serachshowhide: true });
  // };

  editMyShipment = (record) => {
    const { history } = this.props;
    history.push({
      pathname: "MyShipmentNew",
      state: {
        ShipppingID: record.original.ShippingID,
        myfilterlist: this.state.myshipmentfilterProps,
        type: "MyShipment",
        myshipmentstatusList: this.state.myshipmentstatusList,
        mysortlist: this.state.myshipment,
      },
    });
  };

  myshipmentfilterMethod = (event, value) => {
    this.setState({ myshipmentserviceValue: value });
  };

  myshipmentsetFilterProps = (filterValue) => {
    this.setState({
      myshipmentfilterProps: filterValue.filtered,
      myshipment: filterValue.sorted,
    });
  };

  myshipmentfilterProps = (e) => {
    if (this.state.myshipmentfilterProps !== e.filtered) {
      this.myshipmentsetFilterProps(e);
    }
    if (this.state.myshipment !== e.sorted) {
      this.myshipmentsetFilterProps(e);
    }
    return "";
  };

  myshipmentsetLength = (len) => {
    this.setState({ myshipmentfinalLength: len });
  };

  myshipmentcheckProps = (e) => {
    if (this.state.myshipmentfinalLength !== e.sortedData.length) {
      this.myshipmentsetLength(e.sortedData.length);
    }
    return "";
  };

  // Navigation Methods
  navigateChange = (key) => {
    let stepsList = this.state.Steps;
    let activeIndex = stepsList.findIndex((x) => x.classname === "active");
    if (key !== activeIndex) {
      stepsList[key]["classname"] = "active";
      stepsList[activeIndex]["classname"] = "inactive";

      this.setState({
        Steps: stepsList,
        checkdata: [],
        checkAll: false,
      });
      let divID = stepsList[key]["stepId"];
      if (divID === "myshipment") {
        this.state.StatusList.map((OBJ) => {
          OBJ.IsSelected = true;
          return OBJ;
        });
      } else if (divID === "shipment") {
        this.state.StatusList.filter((x) => x.value !== "New Request").map(
          (OBJ) => {
            OBJ.IsSelected = false;
            return OBJ;
          }
        );
        this.state.StatusList.filter((x) => x.value === "New Request").map(
          (OBJ) => {
            OBJ.IsSelected = true;
            return OBJ;
          }
        );
      } else {
        this.state.StatusList.map((OBJ) => {
          OBJ.IsSelected = false;
          return OBJ;
        });
      }
      let activeDiv = stepsList[activeIndex]["stepId"];
      document.getElementById(divID).style.display = "block";
      document.getElementById(activeDiv).style.display = "none";
    }
  };

  showHide = (type) => {
    if (
      CommonConfig.getUserAccess("Search Shipment") &&
      CommonConfig.getUserAccess("Shipment") &&
      CommonConfig.getUserAccess("My Shipment")
    ) {
      if (
        CommonConfig.getUserAccess("Search Shipment").ReadAccess === 1 &&
        CommonConfig.getUserAccess("Shipment").ReadAccess === 1 &&
        CommonConfig.getUserAccess("My Shipment").ReadAccess === 1
      ) {
        if (CommonConfig.isEmpty(type)) {
          document.getElementById("shipment").style.display = "block";
          document.getElementById("search").style.display = "none";
          document.getElementById("myshipment").style.display = "none";
        } else {
          let stepsList = this.state.Steps;
          let index = stepsList.findIndex((x) => x.stepId === type);
          let activeIndex = stepsList.findIndex(
            (x) => x.classname === "active"
          );
          stepsList[activeIndex]["classname"] = "inactive";
          stepsList[index]["classname"] = "active";
          for (var j = 0; j < stepsList.length; j++) {
            if (j !== index) {
              document.getElementById(stepsList[j]["stepId"]).style.display =
                "none";
            }
            if (j === index) {
              document.getElementById(stepsList[j]["stepId"]).style.display =
                "block";
            }
          }
        }
      }
      if (CommonConfig.getUserAccess("Search Shipment").ReadAccess === 0) {
        let currentSteps = this.state.Steps;
        let index = this.state.Steps.findIndex((x) => x.stepId === "search");
        currentSteps.splice(index, 1);
        currentSteps[0]["classname"] = "active";
        document.getElementById(currentSteps[0]["stepId"]).style.display =
          "block";
        for (var j = 1; j < currentSteps.length; j++) {
          document.getElementById(currentSteps[j]["stepId"]).style.display =
            "none";
        }
        this.setState({ Steps: currentSteps });
        document.getElementById("search").style.display = "none";
      }
      if (CommonConfig.getUserAccess("Shipment").ReadAccess === 0) {
        let currentSteps = this.state.Steps;
        let index = this.state.Steps.findIndex((x) => x.stepId === "shipment");
        currentSteps.splice(index, 1);
        currentSteps[0]["classname"] = "active";
        document.getElementById(currentSteps[0]["stepId"]).style.display =
          "block";
        for (var j = 1; j < currentSteps.length; j++) {
          document.getElementById(currentSteps[j]["stepId"]).style.display =
            "none";
        }
        this.setState({ Steps: currentSteps });
        document.getElementById("shipment").style.display = "none";
      }
      if (CommonConfig.getUserAccess("My Shipment").ReadAccess === 0) {
        let currentSteps = this.state.Steps;
        let index = this.state.Steps.findIndex(
          (x) => x.stepId === "myshipment"
        );
        currentSteps.splice(index, 1);
        currentSteps[0]["classname"] = "active";
        document.getElementById(currentSteps[0]["stepId"]).style.display =
          "block";
        for (var j = 1; j < currentSteps.length; j++) {
          document.getElementById(currentSteps[j]["stepId"]).style.display =
            "none";
        }
        this.setState({ Steps: currentSteps });
        document.getElementById("myshipment").style.display = "none";
      }
    }
  };

  searchrenderInputMethod = (params) => {
    return <TextField {...params} label="Shipment Status" variant="outlined" />;
  };

  renderOption = (option) => {
    let selectedValue =
      this.state.ShipmentStatus.findIndex((x) => x.value === option.value) !==
      -1
        ? true
        : false;
    return (
      <React.Fragment>
        <Checkbox
          icon={icon}
          checkedIcon={checkedIcon}
          style={{ marginRight: 8 }}
          checked={selectedValue}
        />
        {option.label}
      </React.Fragment>
    );
  };

  shipmentrenderOption = (option) => {
    let selectedValue =
      this.state.shipmentstatusList.findIndex(
        (x) => x.value === option.value
      ) !== -1
        ? true
        : false;
    return (
      <React.Fragment>
        <Checkbox
          icon={icon}
          checkedIcon={checkedIcon}
          style={{ marginRight: 8 }}
          checked={selectedValue}
        />
        {option.label}
      </React.Fragment>
    );
  };

  myshipmentrenderOption = (option) => {
    let selectedValue =
      this.state.myshipmentstatusList.findIndex(
        (x) => x.value === option.value
      ) !== -1
        ? true
        : false;
    return (
      <React.Fragment>
        <Checkbox
          icon={icon}
          checkedIcon={checkedIcon}
          style={{ marginRight: 8 }}
          checked={selectedValue}
        />
        {option.label}
      </React.Fragment>
    );
  };

  optionProps = (option, value) => {
    if (option.value === value.value) {
      return true;
    } else {
      return false;
    }
  };

  shipmentrenderInputMethod = (params) => {
    return <TextField {...params} label="Shipment Status" variant="outlined" />;
  };

  myshipmentrenderInputMethod = (params) => {
    return <TextField {...params} label="Shipment Status" variant="outlined" />;
  };

  showSearchFilter = (type) => {
    this.setState({ IsDropDownShow: false });
    this.getShipmentListByStatus(type); // "Shipment"
  };

  closedropdown = (e) => {
    this.setState({ IsDropDownShow: false });
  };

  handleCheckboxChange = (e, record, type) => {
    debugger;
    let checkedArr = this.state.StatusList;
    if (type !== "All") {
      checkedArr
        .filter((x) => x.value === "All")
        .map((OBJ) => {
          OBJ.IsSelected = false;
          return OBJ;
        });
      checkedArr[record.Index]["IsSelected"] = e.target.checked;
      this.setState({
        checkAll: e.target.checked,
        //StatusList[0].IsSelected:true
      });
      let previousList = checkedArr.filter((x) => x.IsSelected === true);
      let arrType = "previousSelected" + this.state.chatlist;
      this.setState({ checkdata: previousList });
      this.state.shipmentquery = this.state.checkdata;
      this.state.StatusQuery = this.state.checkdata;
      this.setState({
        Type: checkedArr,
        [arrType]: previousList,
      });
    } else {
      this.setState({ shipmentquery: "" });
      checkedArr.map((OBJ) => {
        OBJ.IsSelected = e.target.checked;
        return OBJ;
      });
      this.state.shipmentquery = this.state.StatusQuery;
      this.setState({
        checkAll: e.target.checked,
      });
      let previousList = checkedArr.filter((x) => x.IsSelected === true);
      let arrType = "previousSelectedStatusList";
      if (previousList.length === 0) {
        this.state.checkdata = "";
      } else {
        this.state.checkdata = `All`;
      }
      this.setState({
        StatusList: checkedArr,
        [arrType]: previousList,
        StatusQuery: this.state.shipmentquery,
      });

    }
    console.log("checkedArr = ",checkedArr);
  };

  render() {
    const {
      shipmentList,
      SearchAccess,
      SearchList,
      SearchClicked,
      checkUserName,
      UserName,
      ManagedBy,
      ShipmentType,
      ServiceName,
      SubServiceName,
      ContactName,
      ContactNumber,
      Email,
      TrackingNumber,
      CardNumber,
      AccountNumber,
      ConfirmationNumber,
      Amount,
      ShipmentStatus,
      currentLogin,
      shipmentstatusList,
      myshipmentstatusList,
      contactNameErr,
      contactNameHelperText,
      contactNumberHelperText,
      contactNumberErr,
      ShipmentDate,
      emailErr,
      emailHelperText,
      accountNumberHelperText,
      accountNumberErr,
      cardNumberHelperText,
      cardNumberErr,
      trackingNumberErr,
      trackingNumberHelperText,
      confirmationNumberHelperText,
      confirmationNumberErr,
      AllClear,
    } = this.state;

    const shipmentType = this.state.ShipmentTypeList.map((type) => {
      return { value: type.Description, label: type.Description };
    });
    // const statusList = this.state.StatusList.map((type) => {
    //   return { value: type.Description, label: type.Description };
    // });
    const managedBy = this.state.ManagedByList.map((type) => {
      return { value: type.UserID, label: type.Name };
    });
    const serviceName = this.state.ServiceNameList.map((type) => {
      return { value: type.MainServiceName, label: type.MainServiceName };
    });
    const subServiceName = this.state.SubServiceNameList.map((type) => {
      return { value: type.ServiceName, label: type.ServiceName };
    });

    const Columns = [
      {
        Header: "Date",
        id: "ShipmentDate",
        sortMethod: (a, b) => {
          return CommonConfig.dateSortMethod(a, b);
        },
        accessor: (data) => {
          // console.log("data....",data);
          return moment(data.ShipmentDate).format(
            CommonConfig.dateFormat.dateOnly
          );
        },
        maxWidth: 100,
      },
      {
        Header: "Tracking",
        accessor: "TrackingNumber",
        width: 85,
      },
      {
        Header: "Sender",
        accessor: "FromContactName",
        width: 95,
      },
      {
        Header: "City",
        accessor: "FromCity",
        width: 80,
      },
      {
        Header: "State",
        accessor: "FromState",
        width: 80,
      },
      {
        Header: "Receiver",
        accessor: "ToContactName",
        width: 95,
      },
      {
        Header: "City",
        accessor: "ToCity",
        width: 85,
      },
      {
        Header: "State",
        accessor: "ToState",
        width: 85,
      },
      {
        Header: "Type",
        accessor: "ShipmentType",
        width: 73,
      },
      {
        Header: "Status",
        accessor: "ShipmentStatus",
        width: 100,
      },
      {
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        filterable: false,
        width: 70,
        Cell: (record) => {
          return (
            <div className="table-common-btn">
              <Button
                justIcon
                color="info"
                onClick={() => this.editShipment(record)}
              >
                <i className="fas fa-edit"></i>
              </Button>
            </div>
          );
        },
      },
    ];

    const viewAllcolumns = [
      {
        Header: "Date",
        id: "ShipmentDate",
        sortMethod: (a, b) => {
          return CommonConfig.dateSortMethod(a, b);
        },
        accessor: (data) => {
          // console.log("data....",data);
          return moment(data.ShipmentDate).format(
            CommonConfig.dateFormat.dateOnly
          );
        },
        maxWidth: 85,
      },
      {
        Header: "Tracking",
        sortMethod: (a, b) => {},
        accessor: "TrackingNumber",
        width: 83,
      },
      {
        Header: "Managed By",
        accessor: "ManagedByName",
        width: 87,
      },
      {
        Header: "Sender",
        accessor: "FromContactName",
        width: 90,
      },
      {
        Header: "State",
        accessor: "FromState",
        width: 80,
      },
      {
        Header: "Country",
        accessor: "FromCountry",
        width: 80,
      },
      {
        Header: "Receiver",
        accessor: "ToContactName",
        width: 95,
      },
      {
        Header: "State",
        accessor: "ToState",
        width: 85,
      },
      {
        Header: "Country",
        accessor: "ToCountry",
        width: 85,
      },
      {
        Header: "Type",
        accessor: "ShipmentType",
        width: 73,
      },
      {
        Header: "Status",
        accessor: "ShipmentStatus",
        width: 100,
      },
      {
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        filterable: false,
        width: 65,
        Cell: (record) => {
          return (
            <div className="table-common-btn">
              <Button
                justIcon
                color="info"
                onClick={() => this.editShipment(record)}
              >
                <i className="fas fa-edit"></i>
              </Button>
            </div>
          );
        },
      },
    ];

    const { myshipmentshipmentList } = this.state;

    const myshipmentColumns = [
      {
        Header: "Date",
        id: "ShipmentDate",
        sortMethod: (a, b) => {
          return CommonConfig.dateSortMethod(a, b);
        },
        accessor: (data) => {
          return moment(data.ShipmentDate).format(
            CommonConfig.dateFormat.dateOnly
          );
        },
        maxWidth: 100,
      },
      {
        Header: "Tracking",
        accessor: "TrackingNumber",
        width: 85,
      },
      {
        Header: "Sender",
        accessor: "FromContactName",
        width: 95,
      },
      {
        Header: "City",
        accessor: "FromCity",
        width: 80,
      },
      {
        Header: "State",
        accessor: "FromState",
        width: 80,
      },
      {
        Header: "Receiver",
        accessor: "ToContactName",
        width: 95,
      },
      {
        Header: "City",
        accessor: "ToCity",
        width: 85,
      },
      {
        Header: "State",
        accessor: "ToState",
        width: 85,
      },
      {
        Header: "Type",
        accessor: "ShipmentType",
        width: 73,
      },
      {
        Header: "Status",
        accessor: "ShipmentStatus",
        width: 100,
      },
      {
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        filterable: false,
        width: 70,
        Cell: (record) => {
          return (
            <div className="table-common-btn">
              <Button
                justIcon
                color="info"
                onClick={() => this.editMyShipment(record)}
              >
                <i className="fas fa-edit"></i>
              </Button>
            </div>
          );
        },
      },
    ];

    const myShipmentviewAllcolumns = [
      {
        Header: "Date",
        id: "ShipmentDate",
        sortMethod: (a, b) => {
          return CommonConfig.dateSortMethod(a, b);
        },
        accessor: (data) => {
          return moment(data.ShipmentDate).format(
            CommonConfig.dateFormat.dateOnly
          );
        },
        maxWidth: 85,
      },
      {
        Header: "Tracking",
        accessor: "TrackingNumber",
        width: 83,
      },
      {
        Header: "Managed By",
        accessor: "ManagedByName",
        width: 87,
      },
      {
        Header: "Sender",
        accessor: "FromContactName",
        width: 90,
      },
      {
        Header: "City",
        accessor: "FromCity",
        width: 80,
      },
      {
        Header: "State",
        accessor: "FromState",
        width: 80,
      },
      {
        Header: "Receiver",
        accessor: "ToContactName",
        width: 95,
      },
      {
        Header: "City",
        accessor: "ToCity",
        width: 85,
      },
      {
        Header: "State",
        accessor: "ToState",
        width: 85,
      },
      {
        Header: "Type",
        accessor: "ShipmentType",
        width: 73,
      },
      {
        Header: "Status",
        accessor: "ShipmentStatus",
        width: 100,
      },
      {
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        filterable: false,
        width: 65,
        Cell: (record) => {
          return (
            <div className="table-common-btn">
              <Button
                justIcon
                color="info"
                onClick={() => this.editMyShipment(record)}
              >
                <i className="fas fa-edit"></i>
              </Button>
            </div>
          );
        },
      },
    ];

    return (
      <GridContainer
        justifyContent="center"
        className="schedule-pickup-main-outer"
      >
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}

        <Card>
          <CardHeader className="btn-right-outer" color="primary" icon>
            <CardIcon color="primary">
              <DirectionsBoatIcon />
            </CardIcon>

            <h4 className="margin-right-auto text-color-black">Shipment</h4>
            {this.state.Steps.findIndex((x) => x.classname === "active") !==
            -1 ? (
              this.state.Steps[
                this.state.Steps.findIndex((x) => x.classname === "active")
              ]["stepId"] === "shipment" ? (
                <div className="filter-wrap">
                  <div
                    className="filter-top-right"
                    onMouseLeave={() =>
                      this.setState({ IsDropDownShow: false })
                    }
                    onMouseOver={() => this.setState({ IsDropDownShow: true })}
                  >
                    <Button
                      className="cm-toggle"
                      color="rose"
                      // onClick={() =>
                      //   this.setState({
                      //     IsDropDownShow:
                      //       this.state.IsDropDownShow === true ? false : true,
                      //   })
                      // }
                    >
                      Search Shipment Status <ExpandMoreIcon />
                    </Button>
                    {this.state.IsDropDownShow === true ? (
                      <div className="cm-dropdown" ref={this.state.ref}>
                        <div className="overflow-handle">
                          {this.state.StatusList.map((step, key) => {
                            return (
                              <li>
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={step.IsSelected}
                                    onChange={(e) =>
                                      this.handleCheckboxChange(
                                        e,
                                        step,
                                        step.value
                                      )
                                    }
                                  />{" "}
                                  {step.value}
                                </label>
                              </li>
                            );
                          })}
                        </div>
                        <div className="cms-wrap">
                          <Button
                            className="cm-search-btn"
                            color="rose"
                            onClick={() => this.showSearchFilter("Shipment")}
                          >
                            Search
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : this.state.Steps[
                  this.state.Steps.findIndex((x) => x.classname === "active")
                ]["stepId"] === "myshipment" ? (
                <div className="filter-wrap">
                  <div
                    className="filter-top-right"
                    onMouseLeave={() =>
                      this.setState({ IsDropDownShow: false })
                    }
                    onMouseOver={() => this.setState({ IsDropDownShow: true })}
                  >
                    <Button
                      className="cm-toggle"
                      color="rose"
                      // onClick={() =>
                      //   this.setState({
                      //     IsDropDownShow:
                      //       this.state.IsDropDownShow === true ? false : true,
                      //   })
                      // }
                    >
                      Search Shipment Status
                      <ExpandMoreIcon />
                    </Button>
                    {this.state.IsDropDownShow === true ? (
                      <div className="cm-dropdown">
                        <div className="overflow-handle">
                          {this.state.StatusList.map((step, key) => {
                            return (
                              <li>
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={step.IsSelected}
                                    onChange={(e) =>
                                      this.handleCheckboxChange(
                                        e,
                                        step,
                                        step.value
                                      )
                                    }
                                  />{" "}
                                  {step.value}
                                </label>
                              </li>
                            );
                          })}
                        </div>
                        <div className="cms-wrap">
                          <Button
                            className="cm-search-btn"
                            color="rose"
                            onClick={() => this.showSearchFilter("Myshipment")}
                          >
                            Search
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : this.state.Steps[
                  this.state.Steps.findIndex((x) => x.classname === "active")
                ]["stepId"] === "search" ? (
                <div className="filter-wrap">
                  <div
                    className="filter-top-right"
                    onMouseLeave={() =>
                      this.setState({ IsDropDownShow: false })
                    }
                    onMouseOver={() => this.setState({ IsDropDownShow: true })}
                  >
                    <Button
                      className="cm-toggle"
                      color="rose"
                      // onClick={() =>
                      //   this.setState({
                      //     IsDropDownShow:
                      //       this.state.IsDropDownShow === true ? false : true,
                      //   })
                      // }
                    >
                      Search Shipment Status
                      <ExpandMoreIcon />
                    </Button>
                    {this.state.IsDropDownShow === true ? (
                      <div className="cm-dropdown">
                        <div className="overflow-handle">
                          {this.state.StatusList.map((step, key) => {
                            return (
                              <li>
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={step.IsSelected}
                                    onChange={(e) =>
                                      this.handleCheckboxChange(
                                        e,
                                        step,
                                        step.value
                                      )
                                    }
                                  />{" "}
                                  {step.value}
                                </label>
                              </li>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null
            ) : null}
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
              <div className="shipment-pane" id="shipment">
                <ReactTable
                  data={shipmentList}
                  minRows={2}
                  pageText={"Total rows : " + this.state.finalLength}
                  defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                  getPaginationProps={(e) => this.checkProps(e)}
                  getTheadFilterProps={(e) => this.filterProps(e)}
                  filterable
                  defaultSorted={this.state.previousSortList}
                  defaultFiltered={this.state.previousFilterList}
                  resizable={false}
                  columns={
                    this.state.Access.AllAccess === 1 ? viewAllcolumns : Columns
                  }
                  defaultPageSize={10}
                  showPaginationBottom={true}
                  className="-striped -highlight"
                />
              </div>
              <div className="shipment-pane" id="myshipment">
                <ReactTable
                  data={myshipmentshipmentList}
                  minRows={2}
                  pageText={"Total rows : " + this.state.myshipmentfinalLength}
                  defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                  getPaginationProps={(e) => this.myshipmentcheckProps(e)}
                  getTheadFilterProps={(e) => this.myshipmentfilterProps(e)}
                  filterable
                  defaultSorted={this.state.myshipmentpreviousSortList}
                  defaultFiltered={this.state.myshipmentpreviousFilterList}
                  resizable={false}
                  columns={
                    this.state.myshipmentAccess.AllAccess === 1
                      ? myShipmentviewAllcolumns
                      : myshipmentColumns
                  }
                  defaultPageSize={10}
                  showPaginationBottom={true}
                  className="-striped -highlight"
                />
              </div>
              <div className="shipment-pane" id="search">
                {SearchAccess.ReadAccess === 1 ? (
                  <>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                          labelText="Customer Name"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          error={contactNameErr}
                          helperText={contactNameHelperText}
                          inputProps={{
                            onChange: (event) =>
                              this.handleChange(event, "ContactName"),
                            value: ContactName,
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                          labelText="Customer Number"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          error={contactNumberErr}
                          helperText={contactNumberHelperText}
                          inputProps={{
                            onChange: (event) =>
                              this.handleChange(event, "ContactNumber"),
                            value: ContactNumber,
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                          labelText="Customer Email"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          error={emailErr}
                          helperText={emailHelperText}
                          inputProps={{
                            onChange: (event) =>
                              this.handleChange(event, "Email"),
                            value: Email,
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                          labelText="Tracking Number"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          error={trackingNumberErr}
                          helperText={trackingNumberHelperText}
                          inputProps={{
                            onChange: (event) =>
                              this.handleChange(event, "TrackingNumber"),
                            value: TrackingNumber,
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={3}>
                        <Autocomplete
                          id="combo-box-demo"
                          options={shipmentType}
                          value={ShipmentType}
                          onChange={(event, value) =>
                            this.selectChange(event, value, "ShipmentType")
                          }
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <TextField {...params} label="Shipment Type" />
                          )}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={3}>
                        <Autocomplete
                          id="combo-box-demo"
                          options={serviceName}
                          value={ServiceName}
                          onChange={(event, value) =>
                            this.selectChange(event, value, "ServiceName")
                          }
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <TextField {...params} label="Service Type" />
                          )}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={3}>
                        <Autocomplete
                          id="combo-box-demo"
                          options={subServiceName}
                          value={SubServiceName}
                          onChange={(event, value) =>
                            this.selectChange(event, value, "SubServiceName")
                          }
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <TextField {...params} label="Sub Service Type" />
                          )}
                        />
                      </GridItem>

                      <GridItem xs={12} sm={12} md={3}>
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
                            <TextField
                              {...params}
                              label="Managed By"
                              margin="normal"
                            />
                          )}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                          labelText="Credit Card"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          error={cardNumberErr}
                          helperText={cardNumberHelperText}
                          inputProps={{
                            onChange: (event) =>
                              this.handleChange(event, "CardNumber"),
                            value: CardNumber,
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                          labelText="Bank Account"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          error={accountNumberErr}
                          helperText={accountNumberHelperText}
                          inputProps={{
                            onChange: (event) =>
                              this.handleChange(event, "AccountNumber"),
                            value: AccountNumber,
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                          labelText="Confirmation Number"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          error={confirmationNumberErr}
                          helperText={confirmationNumberHelperText}
                          inputProps={{
                            onChange: (event) =>
                              this.handleChange(event, "ConfirmationNumber"),
                            value: ConfirmationNumber,
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                          labelText="Payment Received"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            onChange: (event) =>
                              this.handleChange(event, "Amount"),
                            value: Amount,
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                          labelText="User Name"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            onChange: (event) =>
                              this.handleChange(event, "UserName"),
                            value: UserName,
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={3} className="z-index-9">
                        <div className="date-spl">
                          <InputLabel className={classes.label}>
                            Shipment Date
                          </InputLabel>
                          <FormControl fullWidth>
                            <Datetime
                              dateFormat={"MM/DD/YYYY"}
                              timeFormat={false}
                              value={ShipmentDate}
                              onChange={(date) =>
                                this.dateChange(date, "ShipmentDate")
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
                        <div className="select-spl">
                          <FormControl fullWidth>
                            <InputLabel
                              htmlFor="packagetype"
                              className={classes.selectLabel}
                            >
                              All Clear ?
                            </InputLabel>
                            <Select
                              MenuProps={{
                                className: classes.selectMenu,
                              }}
                              classes={{
                                select: classes.select,
                              }}
                              value={AllClear}
                              onChange={(event) =>
                                this.handleChange(event, "AllClear")
                              }
                            >
                              {this.allClearMenu()}
                            </Select>
                          </FormControl>
                        </div>
                      </GridItem>
                    </GridContainer>

                    <div className="shipment-submit">
                      <div className="right">
                        <Button
                          color="rose"
                          onClick={() => this.searchReport()}
                        >
                          Search
                        </Button>
                        <Button
                          color="secondary"
                          onClick={() => this.resetReport()}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </>
                ) : null}
                {SearchClicked ? (
                  <ReactTable
                    data={SearchList}
                    minRows={2}
                    pageText={"Total rows : " + this.state.searchfinalLength}
                    defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                    getPaginationProps={(e) => this.searchCheckProps(e)}
                    // getTheadFilterProps={(e) => this.searchShipmentlen(e)}
                    filterable
                    defaultSorted={this.state.previousSortList}
                    defaultFiltered={this.state.previousFilterList}
                    resizable={false}
                    columns={
                      this.state.Access.AllAccess === 1
                        ? viewAllcolumns
                        : Columns
                    }
                    defaultPageSize={10}
                    showPaginationBottom={true}
                    className="-striped -highlight"
                  />
                ) : null}
              </div>
            </div>
          </CardBody>
        </Card>
      </GridContainer>
    );
  }
}

export default ShipmentNavigation;
