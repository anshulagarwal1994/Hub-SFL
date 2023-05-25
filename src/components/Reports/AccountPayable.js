import React, { Component } from "react";
import GridContainer from "components/Grid/GridContainer.js";
import { CommonConfig } from "../../utils/constant";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CustomInput from "components/CustomInput/CustomInput.js";
import CardBody from "components/Card/CardBody.js";
import InputLabel from "@material-ui/core/InputLabel";
import Card from "components/Card/Card";
import HeadsetMic from "@material-ui/icons/HeadsetMic";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
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

const useStyles = () => makeStyles(styles);
const classes = useStyles();

class AccountPayable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FromDate: "",
      ToDate: "",
      PaidStatus: "",
      VendorList: [],
      VendorName: "",
      InvoiceNumber: "",
      PayableList: [],
      VendorNameList: [],
      yesNo: [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
        { value: "N/A", label: "N/A" },
      ],
    };
  }

  componentDidMount() {
    this.getVendorName();
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

  inputChange = (e, type) => {
    if (type === "PaidStatus") {
      this.setState({ PaidStatus: e.target.value });
    }
    if (type === "InvoiceNumber") {
      this.setState({ InvoiceNumber: e.target.value });
    }
  };

  dateChange = (date, type) => {
    if (type === "FromDate") {
      this.setState({ FromDate: date });
    } else if (type === "ToDate") {
      this.setState({ ToDate: date });
    }
  };

  selectChange = (value, type) => {
    if (type === "VendorName") {
      this.setState({ VendorName: value });
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
              this.setState({
                PayableList: res.data.AccountData,
                VendorNameList: res.data.VendorList,
              });
            } else {
              cogoToast.error("Something went wrong");
            }
          })
          .catch((err) => {
            cogoToast.error("Something went wrong");
            console.log("err......", err);
            this.hideLoader();
          });
      } catch (err) {
        console.log("error..", err);
      }
    } else {
      cogoToast.error("Please enter from/to date");
    }
  };

  resetReport = () => {
    this.setState({
      FromDate: "",
      ToDate: "",
      VendorName: "",
      PaidStatus: "",
      InvoiceNumber: "",
      PayableList: [],
      VendorNameList: [],
    });
  };

  viewPayable = () => {
    return this.state.VendorNameList.map((vendor) => {
      return (
        <>
          <thead>
            <tr>
              <th>{vendor.VendorName}</th>
              <th></th>
              <th></th>
              <th></th>
              <th>
                {"$ " +
                  parseFloat(this.totalAmount(vendor.VendorName)).toFixed(2)}
              </th>
              <th>
                {vendor.expand ? (
                  <Button
                    justIcon
                    color="facebook"
                    className="Plus-btn mt-33"
                    onClick={() => this.toggle(vendor.Index)}
                  >
                    <i className={"fas fa-plus"} />
                  </Button>
                ) : (
                  <Button
                    justIcon
                    color="danger"
                    className="Plus-btn mt-33"
                    onClick={() => this.toggle(vendor.Index)}
                  >
                    <i className={"fas fa-minus"} />
                  </Button>
                )}
              </th>
            </tr>
          </thead>
          <div style={{ display: vendor.expand ? "none" : "block" }}>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Tracking</td>
                <td>Customer Name</td>
                <td>Invoice Number</td>
                <td>Date</td>
                <td>Amount</td>
                <td>Status</td>
              </tr>
              {this.vendorPayable(vendor.VendorName)}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </div>
        </>
      );
    });
  };

  toggle = (idx) => {
    let vendorList = this.state.VendorNameList;
    let index = vendorList.findIndex((x) => x.Index === idx);
    vendorList[index]["expand"] = !vendorList[index]["expand"];
    this.setState({ VendorNameList: vendorList });
  };

  vendorPayable = (VendorName) => {
    return this.state.PayableList.filter(
      (x) => x.VendorName === VendorName
    ).map((payable) => {
      return (
        <tr>
          <td>{payable.TrackingNumber}</td>
          <td>{payable.ContactName}</td>
          <td>{payable.InvoiceNumber}</td>
          <td>
            {moment(payable.PaymentIssuedDate).format(
              CommonConfig.dateFormat.dateOnly
            )}
          </td>
          <td>
            {payable.Amount
              ? "$ " + parseFloat(payable.Amount).toFixed(2)
              : "$ " + 0.0}
          </td>
          <td>{payable.PaidStatus}</td>
        </tr>
      );
    });
  };

  totalAmount = (VendorName) => {
    let vendorList = this.state.PayableList.filter(
      (x) => x.VendorName === VendorName
    );
    let finalAmount = 0.0;
    for (var j = 0; j < vendorList.length; j++) {
      finalAmount = finalAmount + vendorList[j]["Amount"];
    }
    return finalAmount;
  };

  finalAmount = () => {
    let vendorList = this.state.PayableList;
    let finalAmount = 0.0;
    for (var j = 0; j < vendorList.length; j++) {
      finalAmount = finalAmount + vendorList[j]["Amount"];
    }
    return finalAmount;
  };

  render() {
    const {
      FromDate,
      ToDate,
      VendorName,
      InvoiceNumber,
      PaidStatus,
    } = this.state;
    const VendorList = this.state.VendorList.map((type) => {
      return { value: type.VendorName, label: type.VendorName };
    });
    return (
      <GridItem xs={12} sm={12} md={12}>
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
        <Card className="z-index-9">
          <CardHeader className="btn-right-outer" color="primary" icon>
            <CardIcon color="primary">
              <HeadsetMic />
            </CardIcon>
            <h4 className="margin-right-auto text-color-black">
              Account Payable
            </h4>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={12} md={3} className="z-index-9">
                <div className="date-input mt-15">
                  <InputLabel className={classes.label}>From Date</InputLabel>
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
              <GridItem xs={12} sm={12} md={3} className="z-index-9">
                <div className="date-input mt-15">
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
              <GridItem xs={12} sm={12} md={2}>
                <div className="select-spl">
                  <FormControl className={classes.formControl} fullWidth>
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
              <GridItem xs={12} sm={12} md={2}>
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
              <GridItem xs={12} sm={12} md={2}>
                <CustomInput
                  labelText="Invoice Number"
                  inputProps={{
                    value: InvoiceNumber,
                    onChange: (event) =>
                      this.inputChange(event, "InvoiceNumber"),
                  }}
                />
              </GridItem>
            </GridContainer>

            <div className="sub-btn">
              <Button
                className="signup-btn"
                onClick={() => this.searchReport()}
              >
                Search
              </Button>
              <Button className="cancel-btn" onClick={() => this.resetReport()}>
                Reset
              </Button>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <GridContainer className="MuiGrid-justify-xs-center">
              <GridItem xs={12} sm={12} md={12}>
                <div className="package-table">
                  <table>
                    {this.viewPayable()}
                    {this.state.VendorNameList.length ? (
                      <tr>
                        <td className="right" colspan="4">
                          Total Amount:
                        </td>
                        <td>
                          <b>
                            {"$ " + parseFloat(this.finalAmount()).toFixed(2)}
                          </b>
                        </td>
                      </tr>
                    ) : null}
                  </table>
                </div>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    );
  }
}

export default AccountPayable;
