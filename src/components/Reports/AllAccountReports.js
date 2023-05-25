import React, { Component } from "react";
import GridContainer from "components/Grid/GridContainer.js";
import { CommonConfig } from "../../utils/constant";
import ReactTable from "react-table";
import GridItem from "components/Grid/GridItem.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import CustomInput from "components/CustomInput/CustomInput.js";
import CardBody from "components/Card/CardBody.js";
import InputLabel from "@material-ui/core/InputLabel";
import Card from "components/Card/Card";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
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
import Checkbox from "@material-ui/core/Checkbox";
import Radio from "@material-ui/core/Radio";
import AssignmentIcon from "@material-ui/icons/Assignment";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const useStyles = () => makeStyles(styles);
const classes = useStyles();

class AllAccountReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Steps: [
        {
          stepName: "Account Payable",
          stepId: "accountpayable",
          classname: "active",
        },
        {
          stepName: "Account Receivable",
          stepId: "accountreceivable",
          classname: "inactive",
        },
        {
          stepName: "Profit and Loss",
          stepId: "profitandloss",
          classname: "inactive",
        },
        {
          stepName: "Payment Received",
          stepId: "paymentreceived",
          classname: "inactive",
        },
      ],

      //Account Payable
      FromDate: "",
      ToDate: "",
      PaidStatus: "",
      VendorList: [],
      VendorName: "",
      InvoiceNumber: "",
      PayableList: [],
      VendorPayableList: [],
      VendorNameList: [],
      yesNo: [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
        { value: "N/A", label: "N/A" },
      ],
      CommonRadio: "",
      CommonPaymentIssuedDate: "",
      commonConfirmationNumber: "",
      searchClicked: false,

      //Account Receivable
      UserName: "",
      TrackingNumber:"",
      currentLogin: {},
      checkUserName: false,
      FromDateReceivable: "",
      ToDateReceivable: "",
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
      StatusQuery: "",
      AccountReceivableReport: [],
      Loading: false,
      AccessReceivable: {},
      AccessPayable: {},
      finalAmount: 0,
      finalLength: 0,
      receivableClicked: false,
      receivableAllClear: "",

      //--------------------------- Profit and Loss ----------------------------------------------------
      UserNameProfit: "",
      checkUserNameProfit: false,
      FromDateProfit: "",
      ToDateProfit: "",
      StatusQueryProfit: "",
      ShipmentStatusProfit: [],
      ManagedByProfit: "",
      ShipmentTypeProfit: "",
      ServiceNameListProfit: [],
      ServiceNameProfit: "",
      SubServiceNameListProfit: [],
      SubServiceNameProfit: "",
      ProfitReport: [],
      AccessProfit: {},
      finalAmountProfit: 0,
      TotalReceivedAmount: 0,
      TotalIssuedAmount: 0,
      finalLengthProfit: 0,
      TotalProfitPercent: 0,
      profitClicked: false,
      ContainerName: "",
      AccountNumber: "",
      ContainerNameList: [],
      AllClearStatusList: [],
      AllClear: "",

      //--------------------------- Payment Received ---------------------------------------------------- //
      FromDateReceived: "",
      ToDateReceived: "",
      PaymentTypeReceived: "",
      PaymentTypeList: [],
      NumberReceived: "",
      ConfirmationNumber: "",
      AmountReceived: "",
      PaymentReceivedList: [],
      StatusQueryReceived: "",
      ShipmentStatusReceived: [],
      PaymentReceivedClicked: false,
      finalAmountPaymentReceived: 0,
      finalLengthPaymentReceived: 0,
      paymentReceivedAllClear: "",
      UserNameReceived: "",
    };
  }

  async componentDidMount() {
    this.setState({
      AccessReceivable: CommonConfig.getUserAccess("Account Receivable"),
      AccessPayable: CommonConfig.getUserAccess("Account Payable"),
      checkUserName:
        CommonConfig.getUserAccess("Account Receivable").AllAccess === 1
          ? false
          : true,
      AccessProfit: CommonConfig.getUserAccess("Profit and Loss Report"),
      checkUserNameProfit:
        CommonConfig.getUserAccess("Profit and Loss Report").AllAccess === 1
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
    await this.getManagedBy();
    await this.getShipmentType();
    await this.getStatusList();
    await this.getAllClearStatus();
    await this.getVendorName();
    await this.getContainerName();
    await this.getpaymentType();
  }

  // Account Payable Methods
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

  inputChange = (e, type) => {
    this.setState({
      [type]: e.target.value,
    });
  };

  dateChange = (date, type) => {
    this.setState({
      [type]: date,
    });
  };

  selectChange = (value, type) => {
    if (type === "VendorName") {
      this.setState({ VendorName: value });
    } else if (type === "PaymentType") {
      this.setState({ PaymentTypeReceived: value });
    } else if (type === "ShipmentStatus") {
      let query = "";
      let StatusQuery = "";
      for (var j = 0; j < value.length; j++) {
        if (j === 0) {
          if (value.length === 1) {
            StatusQuery =
              ` AND ( sm.ShipmentStatus = "` + value[j].value + `")`;
          } else {
            StatusQuery = ` AND ( sm.ShipmentStatus = "` + value[j].value + `"`;
          }
        } else if (j + 1 === value.length) {
          StatusQuery = ` OR sm.ShipmentStatus = "` + value[j].value + `")`;
        } else {
          StatusQuery = ` OR sm.ShipmentStatus = "` + value[j].value + `"`;
        }
        query = query + StatusQuery;
      }
      this.setState({
        ShipmentStatusReceived: value,
        StatusQueryReceived: query,
      });
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

  showLoader() {
    this.setState({ Loading: true });
  }

  hideLoader() {
    this.setState({ Loading: false });
  }

  searchReport = () => {
    if (this.validate()) {
      this.setState({ searchClicked: true });
      try {
        this.showLoader();
        let data = {
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
          PaidStatus: CommonConfig.isEmpty(this.state.PaidStatus)
            ? ""
            : this.state.PaidStatus,
          VendorName: CommonConfig.isEmpty(this.state.VendorName)
            ? ""
            : this.state.VendorName.value,
          InvoiceNumber: CommonConfig.isEmpty(this.state.InvoiceNumber)
            ? ""
            : this.state.InvoiceNumber,
        };
        api
          .post("reports/getAccountPayableReport", data)
          .then((res) => {
            this.hideLoader();
            if (res.success) {
              var i = 1;
              res.data.VendorList.map((obj) => {
                obj.expand = true;
                obj.Index = i;
                i++;
                return obj;
              });
              var j = 1;
              res.data.AccountData.map((obj) => {
                obj.Index = j;
                j++;
                return obj;
              });
              this.state.PayableList.length = 0;
              this.setState({
                VendorPayableList: res.data.AccountData,
                VendorNameList: res.data.VendorList,
                CommonRadio: "",
                commonConfirmationNumber: "",
              });
            } else {
              cogoToast.error("Something went wrong");
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

    this.finalAmountPayable();
  };

  resetReport = () => {
    this.setState({
      FromDate: "",
      ToDate: "",
      VendorName: "",
      PaidStatus: "",
      InvoiceNumber: "",
      CommonRadio: "",
      commonConfirmationNumber: "",
      PayableList: [],
      VendorPayableList:[],
      VendorNameList: [],
      searchClicked: false,
    });
  };

  viewPayable = () => {
    return this.state.VendorNameList.map((vendor) => {
      return (
        <>
          <table>
            <thead>
              <tr>
                <th colspan="5" className="payable-header v-middle">
                  {vendor.VendorName}
                </th>
                <th className="v-middle">
                  {"$ " +
                    parseFloat(this.totalAmount(vendor.VendorName)).toFixed(2)}
                </th>
                <th className="v-middle align-center">
                  {vendor.expand ? (
                    <Button
                      justIcon
                      color="facebook"
                      className="Plus-btn mtb-0"
                      onClick={() => this.toggle(vendor.Index)}
                    >
                      <i className={"fas fa-plus"} />
                    </Button>
                  ) : (
                    <Button
                      justIcon
                      color="danger"
                      className="Plus-btn mtb-0"
                      onClick={() => this.toggle(vendor.Index)}
                    >
                      <i className={"fas fa-minus"} />
                    </Button>
                  )}
                </th>
              </tr>
            </thead>
          </table>
          <table
            style={{ display: vendor.expand ? "none" : "table", width: "100%" }}
          >
            {/* <div style={{  display: (vendor.expand ? "none" : "block")}}> */}
            <tbody>
              <tr>
                <td className="semibold">Tracking</td>
                <td className="semibold">Customer Name</td>
                <td className="semibold">Invoice No.</td>
                <td className="semibold">Confirmation No.</td>
                <td className="semibold">Date</td>
                <td className="semibold">Amount</td>
                <td className="semibold">Status</td>
              </tr>
              {this.vendorPayable(vendor.VendorName)}
            </tbody>
            {/* </div> */}
          </table>
        </>
      );
    });
  };

  toggle = (idx) => {
    try {
      let data = {
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
        PaidStatus: CommonConfig.isEmpty(this.state.PaidStatus)
          ? ""
          : this.state.PaidStatus,
        VendorName: CommonConfig.isEmpty(this.state.VendorName)
          ? ""
          : this.state.VendorName.value,
        InvoiceNumber: CommonConfig.isEmpty(this.state.InvoiceNumber)
          ? ""
          : this.state.InvoiceNumber,
      };
      let vendorList = this.state.VendorNameList;
      let index = vendorList.findIndex((x) => x.Index === idx);

      if (vendorList[index]["expand"] === true) {
        this.showLoader();
        api
          .post("reports/getAccountPayableReport", data)
          .then((res) => {
           
            this.hideLoader();

            if (res.success) {
              var j = 1;
              res.data.AccountData.map((obj) => {
                obj.Index = j;
                j++;
                return obj;
              });
              let vendordata = this.state.VendorNameList.filter(
                (x) => x.Index === idx
              );

          this.setState({
            PayableList: res.data.AccountData.filter(
                  (x) =>
                    x.VendorName.toLowerCase() ===
                    vendordata[0].VendorName.toLowerCase()
            ),
          });
              vendorList.map((x) => {
                if (x.expand === false) {
                  x.expand = true;
                }
              });
              vendorList[index]["expand"] = !vendorList[index]["expand"];
              this.setState({
                VendorNameList: vendorList,
              });
        } else {
          cogoToast.error("Something went wrong");
        }
      })
      .catch((err) => {
        cogoToast.error("Something went wrong");
        this.hideLoader();
      });
     }else{
        vendorList[index]["expand"] = !vendorList[index]["expand"];
        this.setState({ VendorNameList: vendorList, PayableList: [] });
     }
    } catch (e) {
      console.log("error..", e);
    }
  };

  handleRadioChange = (e, type, idx) => {
    let payableList = this.state.PayableList;
    let index = payableList.findIndex((x) => x.Index === idx);
    payableList[index][type] = e.target.value;
    this.setState({ PayableList: payableList });
  };

  handleCommonRadio = (e, type) => {
    if (type === "PaidStatus") this.setState({ CommonRadio: e.target.value });
    else if (type === "ConfirmationNumber")
      this.setState({ commonConfirmationNumber: e.target.value });

    let payableList = this.state.PayableList;
    for (var j = 0; j < payableList.length; j++) {
      payableList[j][type] = e.target.value;
    }
    this.setState({ PayableList: payableList });
  };

  paymentDateChange = (date, idx) => {
    let payableList = this.state.PayableList;
    let index = payableList.findIndex((x) => x.Index === idx);
    payableList[index]["DatePaid"] = date;
    this.setState({ PayableList: payableList });
  };

  commonPaymentDate = (date) => {
    let payableList = this.state.PayableList;
    for (var j = 0; j < payableList.length; j++) {
      payableList[j]["DatePaid"] = date;
    }
    this.setState({ PayableList: payableList, CommonPaymentIssuedDate: date });
  };

  vendorPayable = (VendorName) => {
    return this.state.PayableList.filter(
      (x) => x.VendorName.toLowerCase() === VendorName.toLowerCase()
    ).map((payable) => {
      return (
        <tr>
          <td>{payable.TrackingNumber}</td>
          <td>{payable.ContactName}</td>
          <td>{payable.InvoiceNumber}</td>
          <td>
            <TextField
              onChange={(event) =>
                this.handleRadioChange(
                  event,
                  "ConfirmationNumber",
                  payable.Index
                )
              }
              value={payable.ConfirmationNumber}
            />
          </td>
          <td>
            {/* {moment(payable.DatePaid).format(CommonConfig.dateFormat.dateOnly)} */}
            {/* <div className="package-dateinput"> */}
            <Datetime
              dateFormat={"MM/DD/YYYY"}
              timeFormat={false}
              value={payable.DatePaid}
              onChange={(date) => this.paymentDateChange(date, payable.Index)}
              closeOnSelect={true}
              renderInput={(params) => (
                <TextField {...params} margin="normal" fullWidth />
              )}
            />
            {/* </div> */}
          </td>
          <td>
            {payable.Amount
              ? "$ " + parseFloat(payable.Amount).toFixed(2)
              : "$ " + 0.0}
          </td>
          <td>
            {/* {payable.PaidStatus} */}
            <div className="payable-radio-single">
              <RadioGroup
                aria-label="Status"
                name="Status"
                value={payable.PaidStatus}
                row
                onChange={(e) =>
                  this.handleRadioChange(e, "PaidStatus", payable.Index)
                }
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
                <FormControlLabel value="N/A" control={<Radio />} label="N/A" />
              </RadioGroup>
            </div>
          </td>
        </tr>
      );
    });
  };

  totalAmount = (VendorName) => {
    let vendorList = this.state.VendorPayableList.filter(
      (x) => x.VendorName.toLowerCase() === VendorName.toLowerCase()
    );
    let finalAmount = 0.0;
    for (var j = 0; j < vendorList.length; j++) {
      finalAmount = finalAmount + vendorList[j]["Amount"];
    }
    return finalAmount;
  };

  finalAmountPayable = () => {
    let vendorList = [];
    if (this.state.PayableList.length === 0) {
      vendorList = this.state.VendorPayableList;
    } else {
      vendorList = this.state.PayableList;
    }
    let finalAmount = 0.0;
    for (var j = 0; j < vendorList.length; j++) {
      finalAmount = finalAmount + vendorList[j]["Amount"];
    }
    return finalAmount;
    // let vendorList = this.state.PayableList;
    // let finalAmount = 0.0;
    // for (var j = 0; j < vendorList.length; j++) {
    //   finalAmount = finalAmount + vendorList[j]["Amount"];
    // }
    // return finalAmount;
  };

  handleSaveAccountIssued = () => {
    let data = {
      paymentIssued: this.state.PayableList,
      userid: CommonConfig.loggedInUserData().PersonID,
    };
    this.showLoader();
    try {
      api
        .post("scheduleshipment/addUpdatePaymentIssuedByReport", data)
        .then((res) => {
          this.hideLoader();
          if (res.success) {
            cogoToast.success("Updated successfully");
            this.resetReport();
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

  //Account Receivable Methods

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
            : yn.Description === "Ready for Yes"
              ? 3
              : "Not Ready";
      return (
        <MenuItem classes={{ root: classes.selectMenuItem }} value={val}>
          {" "}
          {yn.ExtDescription}{" "}
        </MenuItem>
      );
    });
  };

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

  getServiceByShipmentType(serviceType, type) {
    try {
      let data = {
        ServiceType: serviceType,
      };
      api
        .post("userManagement/getServiceByShipmentType", data)
        .then((result) => {
          if (result.success) {
            if (type === "Receivable") {
              this.setState({
                ServiceNameList: result.data,
              });
            } else if (type === "Profit") {
              this.setState({
                ServiceNameListProfit: result.data,
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  getSubserviceName(ServiceName, ShipmentType, type) {
    try {
      let data = {
        ServiceName: ServiceName,
        ServiceType: ShipmentType,
      };
      api
        .post("userManagement/getSubserviceName", data)
        .then((result) => {
          if (result.success) {
            if (type === "Receivable") {
              this.setState({
                SubServiceNameList: result.data,
              });
            } else if (type === "Profit") {
              this.setState({
                SubServiceNameListProfit: result.data,
              });
            }
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
          this.setState({ StatusList: result.data });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  };

  dateChangeReceivable = (date, type) => {
    if (type === "FromDate") {
      this.setState({ FromDateReceivable: date });
    } else if (type === "ToDate") {
      this.setState({ ToDateReceivable: date });
    }
  };

  dateChangeProfit = (date, type) => {
    if (type === "FromDate") {
      this.setState({ FromDateProfit: date });
    } else if (type === "ToDate") {
      this.setState({ ToDateProfit: date });
    }
  };

  selectChangeReceivable = (event, value, type) => {
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
        this.getServiceByShipmentType(value.value, "Receivable");
      } else if (type === "ServiceName") {
        this.setState({
          ServiceName: value,
          SubServiceName: "",
          SubServiceNameList: [],
        });
        this.getSubserviceName(
          value.value,
          this.state.ShipmentType.value,
          "Receivable"
        );
      } else if (type === "SubServiceName") {
        this.setState({ SubServiceName: value });
      } else if (type === "ShipmentStatus") {
        let query = "";
        let StatusQuery = "";
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
            StatusQuery = ` OR sm.ShipmentStatus = "` + value[j].value + `")`;
          } else {
            StatusQuery = ` OR sm.ShipmentStatus = "` + value[j].value + `"`;
          }
          query = query + StatusQuery;
        }
        this.setState({ ShipmentStatus: value, StatusQuery: query });
      }
    }
  };

  selectChangeProfit = (event, value, type) => {
    if (value !== null) {
      if (type === "ManagedBy") {
        this.setState({ ManagedByProfit: value });
      } else if (type === "ShipmentType") {
        this.setState({
          ShipmentTypeProfit: value,
          ServiceNameProfit: "",
          SubServiceNameProfit: "",
          ServiceNameListProfit: [],
          SubServiceNameListProfit: [],
        });
        this.getServiceByShipmentType(value.value, "Profit");
      } else if (type === "ServiceName") {
        this.setState({
          ServiceNameProfit: value,
          SubServiceNameProfit: "",
          SubServiceNameListProfit: [],
        });
        this.getSubserviceName(
          value.value,
          this.state.ShipmentTypeProfit.value,
          "Profit"
        );
      } else if (type === "SubServiceName") {
        this.setState({ SubServiceNameProfit: value });
      } else if (type === "ContainerName") {
        this.setState({ ContainerName: value });
      } else if (type === "ShipmentStatus") {
        let query = "";
        let StatusQuery = "";
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
            StatusQuery = ` OR sm.ShipmentStatus = "` + value[j].value + `")`;
          } else {
            StatusQuery = ` OR sm.ShipmentStatus = "` + value[j].value + `"`;
          }
          query = query + StatusQuery;
        }
        this.setState({
          ShipmentStatusProfit: value,
          StatusQueryProfit: query,
        });
      }
    }
  };

  setLength = (len) => {
    this.setState({ finalLength: len });
  };

  finalAmountReceivable = (amountData) => {
    let amount = 0;
    for (var j = 0; j < amountData.length; j++) {
      amount = amount + Number(amountData[j].Amount.replace("$", ""));
    }
    this.setState({ finalAmount: parseFloat(amount).toFixed(2) });
  };

  checkProps = (e) => {
    if (this.state.finalLength !== e.sortedData.length) {
      this.setLength(e.sortedData.length);
      this.finalAmountReceivable(e.sortedData);
    }
    return "";
  };

  validateReceivable() {
    let IsValid = true;

    if (
      (!CommonConfig.isEmpty(this.state.FromDateReceivable) &&
        CommonConfig.isEmpty(this.state.ToDateReceivable)) ||
      (CommonConfig.isEmpty(this.state.FromDateReceivable) &&
        !CommonConfig.isEmpty(this.state.ToDateReceivable))
    ) {
      IsValid = false;
    }
    return IsValid;
  }

  handleChange = (e, type) => {
    // if(type === "UserName"){
    this.setState({
      [type]: e.target.value,
    });
    // }
  };

  handleChangeProfit = (e, type) => {
    if (type === "UserName") {
      this.setState({ UserNameProfit: e.target.value });
    } else if (type === "AccountNumber") {
      this.setState({ AccountNumber: e.target.value });
    } else if (type === "ContainerName") {
      this.setState({ ContainerName: e.target.value });
    }
  };

  searchReceivableReport() {
    if (this.validateReceivable()) {
      this.setState({ receivableClicked: true });
      try {
        let data = {
          FromDate: CommonConfig.isEmpty(this.state.FromDateReceivable)
            ? ""
            : moment(this.state.FromDateReceivable)
              .startOf("day")
              .format(CommonConfig.dateFormat.dbDateTime)
              .toString(),
          ToDate: CommonConfig.isEmpty(this.state.ToDateReceivable)
            ? ""
            : moment(this.state.ToDateReceivable)
              .endOf("day")
              .format(CommonConfig.dateFormat.dbDateTime)
              .toString(),
          UserName: CommonConfig.isEmpty(this.state.UserName)
            ? ""
            : this.state.UserName,
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
          ShipmentStatus: CommonConfig.isEmpty(this.state.StatusQuery)
            ? ""
            : this.state.StatusQuery,
          IsClear: CommonConfig.isEmpty(this.state.receivableAllClear)
            ? ""
            : this.state.receivableAllClear,
          TrackingNumber:CommonConfig.isEmpty(this.state.TrackingNumber)
            ? ""
            : this.state.TrackingNumber,
        };
        this.showLoader();
        var testdata = []
        this.setState({ AccountReceivableReport: testdata });
        api
          .post("reports/getAccountReceivableReport", data)
          .then((res) => {
            this.hideLoader();
            if (res.success) {
              this.setState({ AccountReceivableReport: res.data });
            } else {
              cogoToast.error("Something went wrong");
            }
          })
          .catch((err) => {
            this.hideLoader();
            console.log("err", err);
          });
      } catch (err) {
        this.hideLoader();
        console.log("err", err);
      }
    } else {
      cogoToast.error("Please enter from/to date");
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

  resetReceivableReport = () => {
    this.showLoader();
    this.setState({
      FromDateReceivable: "",
      ToDateReceivable: "",
      UserName: "",
      ManagedBy: "",
      ShipmentType: "",
      ServiceName: "",
      SubServiceName: "",
      StatusQuery: "",
      receivableAllClear: "",
      TrackingNumber:"",
      ShipmentStatus: [],
      ServiceNameList: [],
      receivableClicked: false,
      SubServiceNameList: [],
      AccountReceivableReport: [],
    });
    this.hideLoader();
  };

  // ----------------------------------Navigate Methods --------------------------------------------------------//

  showHide(show) {
    if (
      CommonConfig.getUserAccess("Account Payable") &&
      CommonConfig.getUserAccess("Account Receivable") &&
      CommonConfig.getUserAccess("Profit and Loss Report") &&
      CommonConfig.getUserAccess("Payment Received")
    ) {
      if (
        CommonConfig.getUserAccess("Account Payable").ReadAccess === 1 &&
        CommonConfig.getUserAccess("Account Receivable").ReadAccess === 1 &&
        CommonConfig.getUserAccess("Profit and Loss Report").ReadAccess === 1 &&
        CommonConfig.getUserAccess("Payment Received").ReadAccess === 1
      ) {
        document.getElementById(show).style.display = "block";
        for (var i = 0; i < this.state.Steps.length; i++) {
          if (this.state.Steps[i]["stepId"] !== show) {
            document.getElementById(
              this.state.Steps[i]["stepId"]
            ).style.display = "none";
          }
        }
      }
      if (CommonConfig.getUserAccess("Account Payable").ReadAccess === 0) {
        let currentSteps = this.state.Steps;
        let index = this.state.Steps.findIndex(
          (x) => x.stepId === "accountpayable"
        );
        currentSteps.splice(index, 1);
        currentSteps[0]["classname"] = "active";
        this.setState({ Steps: currentSteps });
        document.getElementById("accountpayable").style.display = "none";
      }
      if (CommonConfig.getUserAccess("Account Receivable").ReadAccess === 0) {
        let currentSteps = this.state.Steps;
        let index = this.state.Steps.findIndex(
          (x) => x.stepId === "accountreceivable"
        );
        currentSteps.splice(index, 1);
        currentSteps[0]["classname"] = "active";
        this.setState({ Steps: currentSteps });
        document.getElementById("accountreceivable").style.display = "none";
      }
      // CommonConfig.getUserAccess("Payment Received")
      if (
        CommonConfig.getUserAccess("Profit and Loss Report").ReadAccess === 0
      ) {
        let currentSteps = this.state.Steps;
        let index = this.state.Steps.findIndex(
          (x) => x.stepId === "profitandloss"
        );
        currentSteps.splice(index, 1);
        currentSteps[0]["classname"] = "active";
        this.setState({ Steps: currentSteps });
        document.getElementById("profitandloss").style.display = "none";
      }
      if (CommonConfig.getUserAccess("Payment Received").ReadAccess === 0) {
        let currentSteps = this.state.Steps;
        let index = this.state.Steps.findIndex(
          (x) => x.stepId === "paymentreceived"
        );
        currentSteps.splice(index, 1);
        currentSteps[0]["classname"] = "active";
        this.setState({ Steps: currentSteps });
        document.getElementById("paymentreceived").style.display = "none";
      }
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

  validateProfit = () => {
    let IsValid = true;

    if (
      (!CommonConfig.isEmpty(this.state.FromDateProfit) &&
        CommonConfig.isEmpty(this.state.ToDateProfit)) ||
      (CommonConfig.isEmpty(this.state.FromDateReceivable) &&
        !CommonConfig.isEmpty(this.state.ToDateReceivable))
    ) {
      IsValid = false;
    }
    return IsValid;
  };

  searchProfitReport = () => {
    if (this.validateProfit()) {
      this.setState({ profitClicked: true });
      this.showLoader();
      try {
        let data = {
          FromDate: CommonConfig.isEmpty(this.state.FromDateProfit)
            ? ""
            : moment(this.state.FromDateProfit)
              .startOf("day")
              .format(CommonConfig.dateFormat.dbDateTime)
              .toString(),
          ToDate: CommonConfig.isEmpty(this.state.ToDateProfit)
            ? ""
            : moment(this.state.ToDateProfit)
              .endOf("day")
              .format(CommonConfig.dateFormat.dbDateTime)
              .toString(),
          UserName: CommonConfig.isEmpty(this.state.UserNameProfit)
            ? ""
            : this.state.UserNameProfit,
          AccountNumber: CommonConfig.isEmpty(this.state.AccountNumber)
            ? ""
            : this.state.AccountNumber,
          ContainerName: CommonConfig.isEmpty(this.state.ContainerName)
            ? ""
            : this.state.ContainerName.value,
          ManagedBy: this.state.checkUserNameProfit
            ? this.state.currentLogin.value
            : CommonConfig.isEmpty(this.state.ManagedByProfit)
              ? ""
              : this.state.ManagedByProfit.value,
          ShipmentType: CommonConfig.isEmpty(this.state.ShipmentTypeProfit)
            ? ""
            : this.state.ShipmentTypeProfit.value,
          ServiceName: CommonConfig.isEmpty(this.state.ServiceNameProfit)
            ? ""
            : this.state.ServiceNameProfit.value,
          SubServiceName: CommonConfig.isEmpty(this.state.SubServiceNameProfit)
            ? ""
            : this.state.SubServiceNameProfit.value,
          ShipmentStatus: CommonConfig.isEmpty(this.state.StatusQueryProfit)
            ? ""
            : this.state.StatusQueryProfit,
          IsClear: CommonConfig.isEmpty(this.state.AllClear)
            ? ""
            : this.state.AllClear,
          TrackingNumber: this.state.TrackingNumber,
        };
        this.showLoader();
        var testdata = []
        // this.setState({ AccountReceivableReport: testdata });
        this.setState({ ProfitReport: testdata });
        api
          .post("reports/getProfitandLossReport", data)
          .then((res) => {
            this.hideLoader();
            if (res.success) {
              this.setState({ ProfitReport: res.data[0] });
            } else {
              cogoToast.error("Something went wrong");
            }
          })
          .catch((err) => {
            this.hideLoader();
            console.log("err", err);
          });
      } catch (err) {
        this.hideLoader();
        console.log("err", err);
      }
    } else {
      cogoToast.error("Please enter from/to date");
    }
  };

  resetProfitReport = () => {
    this.setState({
      UserNameProfit: "",
      FromDateProfit: "",
      ToDateProfit: "",
      ManagedByProfit: "",
      ShipmentTypeProfit: "",
      ServiceNameListProfit: [],
      ServiceNameProfit: "",
      SubServiceNameListProfit: [],
      SubServiceNameProfit: "",
      ProfitReport: [],
      ShipmentStatusProfit: [],
      StatusQueryProfit: "",
      AccessProfit: {},
      profitClicked: false,
      ContainerName: "",
      AccountNumber: "",
      AllClear: "",
      TrackingNumber: "",
    });
  };

  finalAmountProfit = (amountData) => {
    let amount = 0;
    let receivedAmount = 0;
    let issuedAmount = 0;
    let profitPercent = 0;
    for (var j = 0; j < amountData.length; j++) {
      amount = amount + Number(amountData[j].Amount.replace("$", ""));
      receivedAmount =
        receivedAmount + Number(amountData[j].ReceivedAmount.replace("$", ""));
      issuedAmount =
        issuedAmount + Number(amountData[j].IssuedAmount.replace("$", ""));
    }
    if (issuedAmount === 0) {
      profitPercent = Number(amount) * 100;
    } else {
      profitPercent = (Number(amount) / Number(issuedAmount)) * 100;
    }
    this.setState({
      TotalProfitPercent: profitPercent,
      finalAmountProfit: parseFloat(amount).toFixed(2),
      TotalReceivedAmount: receivedAmount,
      TotalIssuedAmount: issuedAmount,
    });
  };

  checkPropsProfit = (e) => {
    if (this.state.finalLengthProfit !== e.sortedData.length) {
      this.setLengthProfit(e.sortedData.length);
      this.finalAmountProfit(e.sortedData);
    }
    return "";
  };

  setLengthProfit = (len) => {
    this.setState({ finalLengthProfit: len });
  };

  //----------------- Payment Received  -----------------------------------------------------//

  getpaymentType() {
    try {
      let data = {
        stringMapType: "PAYMENTTYPE",
      };

      api
        .post("stringMap/getstringMap", data)
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

  validatePaymentReceived = () => {
    let IsValid = true;

    if (
      (!CommonConfig.isEmpty(this.state.FromDateReceived) &&
        CommonConfig.isEmpty(this.state.ToDateReceived)) ||
      (CommonConfig.isEmpty(this.state.FromDateReceived) &&
        !CommonConfig.isEmpty(this.state.ToDateReceived))
    ) {
      IsValid = false;
    }
    return IsValid;
  };

  searchPaymentReceived = () => {
    if (this.validatePaymentReceived()) {
      this.setState({ PaymentReceivedClicked: true });
      try {
        let data = {
          FromDate: CommonConfig.isEmpty(this.state.FromDateReceived)
            ? ""
            : moment(this.state.FromDateReceived)
              .startOf("day")
              .format(CommonConfig.dateFormat.dbDateTime)
              .toString(),
          ToDate: CommonConfig.isEmpty(this.state.ToDateReceived)
            ? ""
            : moment(this.state.ToDateReceived)
              .endOf("day")
              .format(CommonConfig.dateFormat.dbDateTime)
              .toString(),
          PaymentType: CommonConfig.isEmpty(this.state.PaymentTypeReceived)
            ? ""
            : this.state.PaymentTypeReceived.value,
          Number: CommonConfig.isEmpty(this.state.NumberReceived)
            ? ""
            : this.state.NumberReceived,
          ConfirmationNumber: CommonConfig.isEmpty(
            this.state.ConfirmationNumber
          )
            ? ""
            : this.state.ConfirmationNumber,
          Amount: CommonConfig.isEmpty(this.state.AmountReceived)
            ? ""
            : this.state.AmountReceived,
          ShipmentStatus: CommonConfig.isEmpty(this.state.StatusQueryReceived)
            ? ""
            : this.state.StatusQueryReceived,
          IsClear: CommonConfig.isEmpty(this.state.paymentReceivedAllClear)
            ? ""
            : this.state.paymentReceivedAllClear,
          UserName: CommonConfig.isEmpty(this.state.UserNameReceived)
            ? ""
            : this.state.UserNameReceived,
        };
        this.showLoader();
        api
          .post("reports/getPaymentReceivedReport", data)
          .then((res) => {
            this.hideLoader();
            if (res.success) {
              this.setState({ PaymentReceivedList: res.data[0] });
            } else {
              cogoToast.error("Something went wrong");
            }
          })
          .catch((err) => {
            this.hideLoader();
            console.log("err", err);
          });
      } catch (err) {
        this.hideLoader();
        console.log("err", err);
      }
    } else {
      cogoToast.error("Please enter from/to date");
    }
  };

  resetPaymentReceived = () => {
    this.setState({
      FromDateReceived: "",
      ToDateReceived: "",
      PaymentTypeReceived: "",
      NumberReceived: "",
      ConfirmationNumber: "",
      ShipmentStatusReceived: [],
      StatusQueryReceived: "",
      AmountReceived: "",
      UserNameReceived: "",
      PaymentReceivedList: [],
      paymentReceivedAllClear: "",
      PaymentReceivedClicked: false,
    });
  };

  setLengthPaymentReceived = (len) => {
    this.setState({ finalLengthPaymentReceived: len });
  };

  finalAmountPaymentReceived = (amountData) => {
    let amount = 0;
    for (var j = 0; j < amountData.length; j++) {
      amount = amount + Number(amountData[j].Amount.replace("$", ""));
    }
    this.setState({
      finalAmountPaymentReceived: parseFloat(amount).toFixed(2),
    });
  };

  checkPropsPaymentReceived = (e) => {
    if (this.state.finalLengthPaymentReceived !== e.sortedData.length) {
      this.setLengthPaymentReceived(e.sortedData.length);
      this.finalAmountPaymentReceived(e.sortedData);
    }
    return "";
  };

  handleChangeReceived = (e, type) => {
    this.setState({
      [type]: e.target.value,
    });
  };

  render() {
    const {
      FromDate,
      ToDate,
      VendorName,
      InvoiceNumber,
      PaidStatus,
      CommonRadio,
      CommonPaymentIssuedDate,
      commonConfirmationNumber,
    } = this.state;
    const VendorList = this.state.VendorList.map((type) => {
      return { value: type.VendorName, label: type.VendorName };
    });
    const columns = [
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
      checkUserName,
      UserName,
      FromDateReceivable,
      ToDateReceivable,
      ManagedBy,
      ShipmentType,
      ServiceName,
      SubServiceName,
      ShipmentStatus,
      AccountReceivableReport,
      currentLogin,
      finalAmount,
      AllClear,
      receivableAllClear,
      paymentReceivedAllClear,
    } = this.state;
    const shipmentType = this.state.ShipmentTypeList.map((type) => {
      return { value: type.Description, label: type.Description };
    });
    const statusList = this.state.StatusList.map((type) => {
      return { value: type.Description, label: type.Description };
    });
    const managedBy = this.state.ManagedByList.map((type) => {
      return { value: type.UserID, label: type.Name };
    });
    const serviceName = this.state.ServiceNameList.map((type) => {
      return { value: type.MainServiceName, label: type.MainServiceName };
    });
    const subServiceName = this.state.SubServiceNameList.map((type) => {
      return { value: type.ServiceName, label: type.ServiceName };
    });

    // Profit and Loss
    const {
      ShipmentStatusProfit,
      TotalProfitPercent,
      checkUserNameProfit,
      UserNameProfit,
      FromDateProfit,
      ToDateProfit,
      ManagedByProfit,
      ShipmentTypeProfit,
      ServiceNameProfit,
      SubServiceNameProfit,
      ProfitReport,
      finalAmountProfit,
      ContainerName,
      AccountNumber,
    } = this.state;

    const serviceNameProfit = this.state.ServiceNameListProfit.map((type) => {
      return { value: type.MainServiceName, label: type.MainServiceName };
    });
    const subServiceNameProfit = this.state.SubServiceNameListProfit.map(
      (type) => {
        return { value: type.ServiceName, label: type.ServiceName };
      }
    );

    const containerName = this.state.ContainerNameList.map((container) => {
      return { value: container.ContainerID, label: container.ContainerName };
    });

    const columnsProfit = [
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
        Header: "Managed By",
        accessor: "ManagedByName",
        width: 100,
      },
      {
        Header: "Shipment Type",
        accessor: "ShipmentType",
        width: 80,
      },
      {
        Header: "Service Type",
        accessor: "ServiceName",
        width: 80,
      },
      {
        Header: "Sub Service Type",
        accessor: "SubServiceName",
        width: 100,
      },
      {
        Header: "Received",
        id: "ReceivedAmount",
        Footer: (
          <span>
            {CommonConfig.isEmpty(this.state.TotalReceivedAmount)
              ? ""
              : "$ " +
              parseFloat(this.state.TotalReceivedAmount)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </span>
        ),
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
          return CommonConfig.isEmpty(data.ReceivedAmount)
            ? ""
            : "$ " + parseFloat(data.ReceivedAmount).toFixed(2);
        },
        width: 110,
      },
      {
        Header: "Issued",
        id: "IssuedAmount",
        Footer: (
          <span>
            {CommonConfig.isEmpty(this.state.TotalIssuedAmount)
              ? ""
              : "$ " +
              parseFloat(this.state.TotalIssuedAmount)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </span>
        ),
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
          return CommonConfig.isEmpty(data.IssuedAmount)
            ? ""
            : "$ " + parseFloat(data.IssuedAmount).toFixed(2);
        },
        width: 81,
      },
      {
        Header: "Profit/Loss",
        id: "Amount",
        Footer: (
          <span>
            {CommonConfig.isEmpty(this.state.finalAmountProfit)
              ? ""
              : "$ " +
              parseFloat(this.state.finalAmountProfit)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </span>
        ),
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

    //------------------------------- Payment Received -------------------------------------------//

    const PaymentTypeList = this.state.PaymentTypeList.map((type) => {
      return { value: type.Description, label: type.Description };
    });

    const {
      FromDateReceived,
      ToDateReceived,
      PaymentTypeReceived,
      NumberReceived,
      UserNameReceived,
      ConfirmationNumber,
      finalAmountPaymentReceived,
      AmountReceived,
      PaymentReceivedList,
      ShipmentStatusReceived,
      TrackingNumber,
    } = this.state;

    const columnsReceived = [
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
        Header: "Managed By",
        accessor: "ManagedByName",
        width: 90,
      },
      {
        Header: "Customer Name",
        accessor: "FromContactName",
        width: 100,
      },
      {
        Header: "Payment Type",
        accessor: "PaymentType",
        width: 80,
      },
      {
        Header: "Number",
        accessor: "Number",
        width: 80,
      },
      {
        Header: "Confirmation Number",
        accessor: "ConfirmationNumber",
        width: 100,
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
          return CommonConfig.isEmpty(data.Amount)
            ? ""
            : "$ " + parseFloat(data.Amount).toFixed(2);
        },
        width: 80,
      },
    ];

    return (
      <GridContainer justify="center" className="schedule-pickup-main-outer">
        <GridItem xs={12} sm={12}>
          <Card className="z-index-9">
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <AssignmentIcon />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">
                Account Reports
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
                <div className="shipment-pane" id="accountpayable">
                  <GridItem xs={12} sm={12} md={12}>
                    {this.state.Loading === true ? (
                      <div className="loading">
                        <SimpleBackdrop />
                      </div>
                    ) : null}

                    <GridContainer>
                      <GridItem xs={12} sm={12} md={4}>
                        <Autocomplete
                          id="package_number"
                          options={VendorList}
                          value={VendorName}
                          getOptionLabel={(option) => option.label}
                          onChange={(event, value) =>
                            this.selectChange(value, "VendorName")
                          }
                          renderInput={(params) => (
                            <TextField
                              margin="normal"
                              label="Vendor Name"
                              {...params}
                            />
                          )}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={2} className="z-index-9">
                        <div className="date-spl">
                          <InputLabel className={classes.label}>
                            From Date
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
                      <GridItem xs={12} sm={12} md={2} className="z-index-9">
                        <div className="date-spl">
                          <InputLabel className={classes.label}>
                            To Date
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
                      <GridItem xs={12} sm={12} md={2}>
                        <div className="mt-15">
                          <FormControl fullWidth>
                            <TextField
                              label="Invoice Number"
                              value={InvoiceNumber}
                              onChange={(event) =>
                                this.inputChange(event, "InvoiceNumber")
                              }
                            />
                          </FormControl>
                        </div>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={2}>
                        <div className="select-spl">
                          <FormControl
                            className={classes.formControl}
                            fullWidth
                          >
                            <InputLabel className={classes.label}>
                              Paid Status
                            </InputLabel>
                            <Select
                              id="package_number"
                              value={PaidStatus}
                              name="package_number"
                              className="form-control"
                              onChange={(event) =>
                                this.inputChange(event, "PaidStatus")
                              }
                            >
                              {this.yesNo()}
                            </Select>
                          </FormControl>
                        </div>
                      </GridItem>
                    </GridContainer>

                    <div className="shipment-submit  mt-20">
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
                    {this.state.searchClicked ? (
                      <>
                        <GridContainer className="MuiGrid-justify-xs-center">
                          <GridItem xs={12} sm={12} md={12}>
                            <div className="package-table accounts-reports-table">
                              {this.viewPayable()}
                              {this.state.VendorNameList.length ? (
                                <table className="account-table-special">
                                  <tbody>
                                    <tr>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                      <td>
                                        <TextField
                                          onChange={(event) =>
                                            this.handleCommonRadio(
                                              event,
                                              "ConfirmationNumber"
                                            )
                                          }
                                          value={commonConfirmationNumber}
                                          placeholder="Confirmation No."
                                        />
                                      </td>
                                      <td>
                                        <Datetime
                                          dateFormat={"MM/DD/YYYY"}
                                          timeFormat={false}
                                          value={moment(
                                            CommonPaymentIssuedDate
                                          )}
                                          onChange={(date) =>
                                            this.commonPaymentDate(date)
                                          }
                                          closeOnSelect={true}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              margin="normal"
                                              fullWidth
                                              placeholder="Date"
                                            />
                                          )}
                                        />
                                      </td>
                                      <td>
                                        <b>
                                          {"$ " +
                                            parseFloat(
                                              this.finalAmountPayable()
                                            )
                                              .toFixed(2)
                                              .toString()
                                              .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ","
                                              )}
                                        </b>
                                      </td>
                                      <td>
                                        <div className="payable-radio-common">
                                          <RadioGroup
                                            aria-label="Status"
                                            name="Status"
                                            value={
                                              CommonRadio ||
                                              this.state.PaidStatus
                                            }
                                            row
                                            onChange={(e) =>
                                              this.handleCommonRadio(
                                                e,
                                                "PaidStatus"
                                              )
                                            }
                                          >
                                            <FormControlLabel
                                              value="Yes"
                                              control={<Radio />}
                                              label="Yes"
                                            />
                                            <FormControlLabel
                                              value="No"
                                              control={<Radio />}
                                              label="No"
                                            />
                                            <FormControlLabel
                                              value="N/A"
                                              control={<Radio />}
                                              label="N/A"
                                            />
                                          </RadioGroup>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              ) : null}
                            </div>
                          </GridItem>
                        </GridContainer>

                        <div className="shipment-submit  mt-20">
                          <div className="right">
                            <Button
                              color="rose"
                              onClick={() => this.handleSaveAccountIssued()}
                            >
                              Update
                            </Button>
                            <Button
                              color="secondary"
                              onClick={() => this.resetReport()}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </GridItem>
                </div>
                <div className="shipment-pane" id="accountreceivable">
                  <GridItem xs={12} sm={12} md={12}>
                    {this.state.Loading === true ? (
                      <div className="loading">
                        <SimpleBackdrop />
                      </div>
                    ) : null}
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={3}>
                        <div className="date-input mt-15">
                          <InputLabel className={classes.label}>
                            From Date
                          </InputLabel>
                          <FormControl fullWidth>
                            <Datetime
                              dateFormat={"MM/DD/YYYY"}
                              timeFormat={false}
                              value={FromDateReceivable}
                              onChange={(date) =>
                                this.dateChangeReceivable(date, "FromDate")
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
                        <div className="date-input mt-15">
                          <InputLabel className={classes.label}>
                            To Date
                          </InputLabel>
                          <FormControl fullWidth>
                            <Datetime
                              dateFormat={"MM/DD/YYYY"}
                              timeFormat={false}
                              value={ToDateReceivable}
                              onChange={(date) =>
                                this.dateChangeReceivable(date, "ToDate")
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
                      <GridItem xs={12} sm={12} md={3}>
                        <Autocomplete
                          id="combo-box-demo"
                          options={managedBy}
                          value={checkUserName ? currentLogin : ManagedBy}
                          disabled={checkUserName}
                          onChange={(event, value) =>
                            this.selectChangeReceivable(
                              event,
                              value,
                              "ManagedBy"
                            )
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
                        <Autocomplete
                          id="combo-box-demo"
                          options={shipmentType}
                          value={ShipmentType}
                          onChange={(event, value) =>
                            this.selectChangeReceivable(
                              event,
                              value,
                              "ShipmentType"
                            )
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
                            this.selectChangeReceivable(
                              event,
                              value,
                              "ServiceName"
                            )
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
                            this.selectChangeReceivable(
                              event,
                              value,
                              "SubServiceName"
                            )
                          }
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <TextField {...params} label="Sub Service Type" />
                          )}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={3}>
                        <div className="multiselect">
                          <Autocomplete
                            multiple
                            size="small"
                            id="filtercheckbox"
                            options={statusList}
                            value={ShipmentStatus}
                            getOptionLabel={(option) => option.label}
                            onChange={(event, value) =>
                              this.selectChangeReceivable(
                                event,
                                value,
                                "ShipmentStatus"
                              )
                            }
                            style={{ width: "100%" }}
                            renderOption={(option, { selected }) => (
                              <React.Fragment>
                                <Checkbox
                                  icon={icon}
                                  checkedIcon={checkedIcon}
                                  style={{ marginRight: 8 }}
                                  checked={selected}
                                />
                                {option.label}
                              </React.Fragment>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Status"
                                variant="outlined"
                              />
                            )}
                          />
                        </div>
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={3}>
                        <div className="select-spl">
                          <FormControl
                            className={classes.formControl}
                            fullWidth
                          >
                            <InputLabel className={classes.label}>
                              Is Clear ?
                            </InputLabel>
                            <Select
                              id="package_number"
                              value={receivableAllClear}
                              name="package_number"
                              className="form-control"
                              onChange={(event) =>
                                this.inputChange(event, "receivableAllClear")
                              }
                            >
                              {this.allClearMenu()}
                            </Select>
                          </FormControl>
                        </div>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={3}>
                                <CustomInput
                                labelText="Tracking Number"
                                formControlProps={{
                                    fullWidth: true,
                                }}
                                inputProps={{
                                    onChange: (event) => this.handleChange(event,"TrackingNumber"),
                                    value: TrackingNumber
                                }}
                                />
                            </GridItem>
                    </GridContainer>

                    <div className="shipment-submit  mt-20">
                      <div className="right">
                        <Button
                          color="rose"
                          onClick={() => this.searchReceivableReport()}
                        >
                          Search
                        </Button>
                        <Button
                          color="secondary"
                          onClick={() => this.resetReceivableReport()}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                    {this.state.receivableClicked ? (
                      <GridContainer justify="center">
                        <ReactTable
                          data={AccountReceivableReport}
                          minRows={2}
                          pageText={
                            "Total rows : " +
                            this.state.finalLength +
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
                          getPaginationProps={(e) => this.checkProps(e)}
                          filterable
                          resizable={false}
                          columns={columns}
                          defaultPageSize={10}
                          showPaginationBottom={true}
                          className=" -striped -highlight all-account-react"
                        />
                      </GridContainer>
                    ) : null}
                  </GridItem>
                </div>
                <div className="shipment-pane" id="profitandloss">
                  <GridContainer>
                    {this.state.Loading === true ? (
                      <div className="loading">
                        <SimpleBackdrop />
                      </div>
                    ) : null}

                    <GridItem xs={12} sm={12} md={3} className="z-index-9">
                      <div className="date-input mt-15">
                        <InputLabel className={classes.label}>
                          From Date
                        </InputLabel>
                        <FormControl fullWidth>
                          <Datetime
                            dateFormat={"MM/DD/YYYY"}
                            timeFormat={false}
                            value={FromDateProfit}
                            onChange={(date) =>
                              this.dateChangeProfit(date, "FromDate")
                            }
                            closeOnSelect={true}
                            renderInput={(params) => (
                              <TextField {...params} fullWidth />
                            )}
                          />
                        </FormControl>
                      </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3} className="z-index-9">
                      <div className="date-input mt-15">
                        <InputLabel className={classes.label}>
                          To Date
                        </InputLabel>
                        <FormControl fullWidth>
                          <Datetime
                            dateFormat={"MM/DD/YYYY"}
                            timeFormat={false}
                            value={ToDateProfit}
                            onChange={(date) =>
                              this.dateChangeProfit(date, "ToDate")
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
                      <CustomInput
                        labelText="User Name"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          onChange: (event) =>
                            this.handleChangeProfit(event, "UserName"),
                          value: UserNameProfit,
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <Autocomplete
                        id="combo-box-demo"
                        options={managedBy}
                        value={
                          checkUserNameProfit ? currentLogin : ManagedByProfit
                        }
                        disabled={checkUserNameProfit}
                        onChange={(event, value) =>
                          this.selectChangeProfit(event, value, "ManagedBy")
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
                      <Autocomplete
                        id="combo-box-demo"
                        options={shipmentType}
                        value={ShipmentTypeProfit}
                        onChange={(event, value) =>
                          this.selectChangeProfit(event, value, "ShipmentType")
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
                        options={serviceNameProfit}
                        value={ServiceNameProfit}
                        onChange={(event, value) =>
                          this.selectChangeProfit(event, value, "ServiceName")
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
                        options={subServiceNameProfit}
                        value={SubServiceNameProfit}
                        onChange={(event, value) =>
                          this.selectChangeProfit(
                            event,
                            value,
                            "SubServiceName"
                          )
                        }
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => (
                          <TextField {...params} label="Sub Service Type" />
                        )}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <CustomInput
                        labelText="Account Number"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          onChange: (event) =>
                            this.handleChangeProfit(event, "AccountNumber"),
                          value: AccountNumber,
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                      <FormControl fullWidth>
                        <Autocomplete
                          id="combo-box-demo"
                          options={containerName}
                          value={ContainerName}
                          onChange={(event, value) =>
                            this.selectChangeProfit(
                              event,
                              value,
                              "ContainerName"
                            )
                          }
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Container Name"
                              margin="normal"
                              fullWidth
                            />
                          )}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <div className="multiselect">
                        <Autocomplete
                          multiple
                          size="small"
                          id="filtercheckbox"
                          options={statusList}
                          value={ShipmentStatusProfit}
                          getOptionLabel={(option) => option.label}
                          onChange={(event, value) =>
                            this.selectChangeProfit(
                              event,
                              value,
                              "ShipmentStatus"
                            )
                          }
                          style={{ width: "100%" }}
                          renderOption={(option, { selected }) => (
                            <React.Fragment>
                              <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                              />
                              {option.label}
                            </React.Fragment>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Status"
                              variant="outlined"
                            />
                          )}
                        />
                      </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <div className="select-spl">
                        <FormControl className={classes.formControl} fullWidth>
                          <InputLabel className={classes.label}>
                            Is Clear ?
                          </InputLabel>
                          <Select
                            id="package_number"
                            value={AllClear}
                            name="package_number"
                            className="form-control"
                            onChange={(event) =>
                              this.inputChange(event, "AllClear")
                            }
                          >
                            {this.allClearMenu()}
                          </Select>
                        </FormControl>
                      </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                                <CustomInput
                                labelText="Tracking Number"
                                formControlProps={{
                                    fullWidth: true,
                                }}
                                inputProps={{
                                    onChange: (event) => this.handleChange(event,"TrackingNumber"),
                                    value: TrackingNumber
                                }}
                                />
                            </GridItem>
                  </GridContainer>
                  <div className="shipment-submit  mt-20">
                    <div className="right">
                      <Button
                        color="rose"
                        onClick={() => this.searchProfitReport()}
                      >
                        Search
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => this.resetProfitReport()}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                  {this.state.profitClicked ? (
                    <GridContainer justify="center">
                      <ReactTable
                        data={ProfitReport}
                        minRows={2}
                        pageText={
                          "Total rows : " +
                          this.state.finalLengthProfit +
                          "\xa0\xa0\xa0\xa0\xa0\xa0\xa0" +
                          " Profit Percentage : " +
                          (typeof TotalProfitPercent
                            ? parseFloat(TotalProfitPercent).toFixed(2)
                            : "0.00") +
                          " % " +
                          "\xa0\xa0\xa0\xa0\xa0\xa0\xa0"
                        }
                        defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                        getPaginationProps={(e) => this.checkPropsProfit(e)}
                        filterable
                        resizable={false}
                        columns={columnsProfit}
                        defaultPageSize={10}
                        showPaginationBottom={true}
                        className=" -striped -highlight all-account-react"
                      />
                    </GridContainer>
                  ) : null}
                </div>
                <div className="shipment-pane" id="paymentreceived">
                  <GridContainer>
                    {this.state.Loading === true ? (
                      <div className="loading">
                        <SimpleBackdrop />
                      </div>
                    ) : null}
                    <GridItem xs={12} sm={12} md={3} className="z-index-9">
                      <div className="date-spl">
                        <InputLabel className={classes.label}>
                          From Date
                        </InputLabel>
                        <FormControl fullWidth>
                          <Datetime
                            dateFormat={"MM/DD/YYYY"}
                            timeFormat={false}
                            value={FromDateReceived}
                            onChange={(date) =>
                              this.dateChange(date, "FromDateReceived")
                            }
                            closeOnSelect={true}
                            renderInput={(params) => (
                              <TextField {...params} fullWidth />
                            )}
                          />
                        </FormControl>
                      </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3} className="z-index-9">
                      <div className="date-spl">
                        <InputLabel className={classes.label}>
                          To Date
                        </InputLabel>
                        <FormControl fullWidth>
                          <Datetime
                            dateFormat={"MM/DD/YYYY"}
                            timeFormat={false}
                            value={ToDateReceived}
                            onChange={(date) =>
                              this.dateChange(date, "ToDateReceived")
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
                      <Autocomplete
                        id="package_number"
                        options={PaymentTypeList}
                        value={PaymentTypeReceived}
                        getOptionLabel={(option) => option.label}
                        onChange={(event, value) =>
                          this.selectChange(value, "PaymentType")
                        }
                        renderInput={(params) => (
                          <TextField
                            margin="normal"
                            label="Payment Type"
                            {...params}
                          />
                        )}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <CustomInput
                        labelText="Number"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          onChange: (event) =>
                            this.handleChange(event, "NumberReceived"),
                          value: NumberReceived,
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                      <CustomInput
                        labelText="Confirmation Number"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          onChange: (event) =>
                            this.handleChange(event, "ConfirmationNumber"),
                          value: ConfirmationNumber,
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <CustomInput
                        labelText="Amount"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          onChange: (event) =>
                            this.handleChange(event, "AmountReceived"),
                          value: AmountReceived,
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <div className="multiselect">
                        <Autocomplete
                          multiple
                          size="small"
                          id="filtercheckbox"
                          options={statusList}
                          value={ShipmentStatusReceived}
                          getOptionLabel={(option) => option.label}
                          onChange={(event, value) =>
                            this.selectChange(value, "ShipmentStatus")
                          }
                          style={{ width: "100%" }}
                          renderOption={(option, { selected }) => (
                            <React.Fragment>
                              <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                              />
                              {option.label}
                            </React.Fragment>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Status"
                              variant="outlined"
                            />
                          )}
                        />
                      </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <div className="select-spl">
                        <FormControl className={classes.formControl} fullWidth>
                          <InputLabel className={classes.label}>
                            Is Clear ?
                          </InputLabel>
                          <Select
                            id="package_number"
                            value={paymentReceivedAllClear}
                            name="package_number"
                            className="form-control"
                            onChange={(event) =>
                              this.inputChange(event, "paymentReceivedAllClear")
                            }
                          >
                            {this.allClearMenu()}
                          </Select>
                        </FormControl>
                      </div>
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
                            this.handleChangeReceived(
                              event,
                              "UserNameReceived"
                            ),
                          value: UserNameReceived,
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <div className="shipment-submit  mt-20">
                    <div className="right">
                      <Button
                        color="rose"
                        onClick={() => this.searchPaymentReceived()}
                      >
                        Search
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => this.resetPaymentReceived()}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>

                  {this.state.PaymentReceivedClicked ? (
                    <GridContainer justify="center">
                      <ReactTable
                        data={PaymentReceivedList}
                        minRows={2}
                        pageText={
                          "Total rows : " +
                          this.state.finalLengthPaymentReceived +
                          "\xa0\xa0\xa0\xa0\xa0\xa0\xa0" +
                          " Total Amount : $ " +
                          finalAmountPaymentReceived
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                          "\xa0\xa0\xa0\xa0\xa0\xa0\xa0"
                        }
                        defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                        getPaginationProps={(e) =>
                          this.checkPropsPaymentReceived(e)
                        }
                        filterable
                        resizable={false}
                        columns={columnsReceived}
                        defaultPageSize={10}
                        showPaginationBottom={true}
                        className=" -striped -highlight all-account-react"
                      />
                    </GridContainer>
                  ) : null}
                </div>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default AllAccountReports;
