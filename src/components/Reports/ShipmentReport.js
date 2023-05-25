import React, { Component } from "react";
// import CustomInput from "components/CustomInput/CustomInput";
import GridContainer from "components/Grid/GridContainer.js";
import { CommonConfig } from "../../utils/constant";
import ReactTable from "react-table";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CustomInput from "components/CustomInput/CustomInput.js";
import CardBody from "components/Card/CardBody.js";
import Card from "components/Card/Card";
import HeadsetMic from "@material-ui/icons/HeadsetMic";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import cogoToast from "cogo-toast";
import api from "../../utils/apiClient";
import moment from "moment";
import SimpleBackdrop from "../../utils/general";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Checkbox from "@material-ui/core/Checkbox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const useStyles = () => makeStyles(styles);
const classes = useStyles();

class ShipmentReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      ShipmentReport: [],
      Loading: false,
      Access: [],
      finalAmount: 0,
      ContactName: "",
      ContactNumber: "",
      Email: "",
      StatusQuery: "",
      TrackingNumber: "",
      CardNumber: "",
      AccountNumber: "",
      ConfirmationNumber: "",
      Amount: "",
    };
  }

  async componentDidMount() {
    this.setState({
      Access: CommonConfig.getUserAccess("Shipment Report"),
      checkUserName:
        CommonConfig.getUserAccess("Shipment Report").AllAccess === 1
          ? false
          : true,
      currentLogin: {
        value: CommonConfig.loggedInUserData().PersonID,
        label: CommonConfig.loggedInUserData().Name,
      },
    });
    await this.getManagedBy();
    await this.getShipmentType();
    await this.getStatusList();
  }

  showLoader() {
    this.setState({ Loading: true });
  }

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
          this.setState({ StatusList: result.data });
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

  setLength = (len) => {
    this.setState({ finalLength: len });
  };

  // finalAmount = (amountData) => {
  //     let amount = 0
  //     for(var j = 0; j < amountData.length; j++){
  //         amount = amount + Number(amountData[j].Amount.replace('$',''));
  //     }
  //     this.setState({finalAmount : parseFloat(amount).toFixed(2)});
  // }

  checkProps = (e) => {
    if (this.state.finalLength !== e.sortedData.length) {
      this.setLength(e.sortedData.length);
      // this.finalAmount(e.sortedData);
    }
    return "";
  };

  validate() {
    let IsValid = true;
    return IsValid;
  }

  handleChange = (e, type) => {
    if (type === "UserName") {
      this.setState({ UserName: e.target.value });
    }
    if (type === "ContactName") {
      this.setState({ ContactName: e.target.value });
    }
    if (type === "ContactNumber") {
      this.setState({ ContactNumber: e.target.value });
    }
    if (type === "Email") {
      this.setState({ Email: e.target.value });
    }
    if (type === "TrackingNumber") {
      this.setState({ TrackingNumber: e.target.value });
    }
    if (type === "CardNumber") {
      this.setState({ CardNumber: e.target.value });
    }
    if (type === "AccountNumber") {
      this.setState({ AccountNumber: e.target.value });
    }
    if (type === "ConfirmationNumber") {
      this.setState({ ConfirmationNumber: e.target.value });
    }
    if (type === "Amount") {
      this.setState({ Amount: e.target.value });
    }
  };

  searchReport() {
    if (this.validate()) {
      try {
        let data = {
          ContactName: CommonConfig.isEmpty(this.state.ContactName)
            ? ""
            : this.state.ContactName,
          ContactNumber: CommonConfig.isEmpty(this.state.ContactNumber)
            ? ""
            : this.state.ContactNumber,
          Email: CommonConfig.isEmpty(this.state.Email) ? "" : this.state.Email,
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
          ShipmentStatus: CommonConfig.isEmpty(this.state.StatusQuery)
            ? ""
            : this.state.StatusQuery,
        };
        this.showLoader();
        api
          .post("reports/getShipmentReport", data)
          .then((res) => {
            this.hideLoader();
            if (res.success) {
              this.setState({ ShipmentReport: res.data[0] });
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

  resetReport = () => {
    this.showLoader();
    this.setState({
      UserName: "",
      ManagedBy: "",
      ShipmentType: "",
      StatusQuery: "",
      ServiceName: "",
      SubServiceName: "",
      Amount: "",
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
      ShipmentReport: [],
    });
    this.hideLoader();
  };

  render() {
    const Columns = [
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
      // {
      //     Header: "Actions",
      //     accessor: "actions",
      //     sortable: false,
      //     filterable: false,
      //     width: 70,
      //     Cell: record => {
      //     return (
      //     <div className="table-common-btn">
      //       <Button justIcon color="info" onClick={() => this.editShipment(record)}>
      //            <i className="fas fa-edit"></i>
      //       </Button>
      //     </div>
      //     );
      //   },
      // }
    ];

    const viewAllcolumns = [
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
      // {
      //     Header: "Actions",
      //     accessor: "actions",
      //     sortable: false,
      //     filterable: false,
      //     width: 65,
      //     Cell: record => {
      //     return (
      //     <div className="table-common-btn">
      //       <Button justIcon color="info" onClick={() => this.editShipment(record)}>
      //            <i className="fas fa-edit"></i>
      //       </Button>
      //     </div>
      //     );
      //   },
      // }
    ];

    const {
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
      ShipmentReport,
      currentLogin,
      finalAmount,
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
    return (
      <GridItem xs={12} sm={12} md={12}>
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
        <Card>
          <CardHeader className="btn-right-outer" color="primary" icon>
            <CardIcon color="primary">
              <HeadsetMic />
            </CardIcon>
            <h4 className="margin-right-auto text-color-black">
              Search Shipment
            </h4>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={12} md={3}>
                <CustomInput
                  labelText="Customer Name"
                  formControlProps={{
                    fullWidth: true,
                  }}
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
                  inputProps={{
                    onChange: (event) => this.handleChange(event, "Email"),
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
                <div className="multiselect">
                  <Autocomplete
                    multiple
                    size="small"
                    id="filtercheckbox"
                    options={statusList}
                    value={ShipmentStatus}
                    getOptionLabel={(option) => option.label}
                    onChange={(event, value) =>
                      this.selectChange(event, value, "ShipmentStatus")
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
                <CustomInput
                  labelText="Credit Card"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) => this.handleChange(event, "CardNumber"),
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
                    onChange: (event) => this.handleChange(event, "Amount"),
                    value: Amount,
                  }}
                />
              </GridItem>
            </GridContainer>

            <GridContainer>
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
                    <TextField {...params} label="Managed By" margin="normal" />
                  )}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={3}>
                <CustomInput
                  labelText="User Name"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) => this.handleChange(event, "UserName"),
                    value: UserName,
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
        <GridContainer justify="center">
          <Card>
            <CardBody>
              <ReactTable
                data={ShipmentReport}
                minRows={2}
                pageText={
                  `Total rows : ` +
                  this.state.finalLength +
                  ` Total Amount : ` +
                  finalAmount
                }
                defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                getPaginationProps={(e) => this.checkProps(e)}
                filterable
                resizable={false}
                columns={
                  this.state.Access.AllAccess === 1 ? viewAllcolumns : Columns
                }
                defaultPageSize={10}
                showPaginationBottom={true}
                className="-striped -highlight"
              />
            </CardBody>
          </Card>
        </GridContainer>
      </GridItem>
    );
  }
}

export default ShipmentReport;
