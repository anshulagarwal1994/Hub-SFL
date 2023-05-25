import React, { Component } from "react";
import ReactTable from "react-table";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import GridContainer from "components/Grid/GridContainer.js";
import moment from "moment";
import GridItem from "components/Grid/GridItem.js";
import Store from "@material-ui/icons/Store";
import api from "../../utils/apiClient";
import { CommonConfig } from "../../utils/constant";
import cogoToast from "cogo-toast";
import SimpleBackdrop from "../../utils/general";
import HeadsetMic from "@material-ui/icons/HeadsetMic";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CustomInput from "components/CustomInput/CustomInput.js";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Checkbox from "@material-ui/core/Checkbox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

class ShipmentList extends Component {
  constructor(props) {
    super(props);

    this.state = {
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

      //Search Shipment
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
      Loading: false,
      expand: false,

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
    };
  }

  async componentDidMount() {
    this.setState({
      Access: CommonConfig.getUserAccess("Shipment"),
      loggedUser: CommonConfig.loggedInUserData().PersonID,

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
    await this.getShipmentList();

    await this.getManagedBy();
    await this.getShipmentType();
    await this.getStatusList();
    if (
      this.props.history.location.state !== undefined &&
      this.props.history.location.state !== null
    ) {
      this.setState({
        previousFilterList: this.props.history.location.state.filterlist,
        previousSortList: this.props.history.location.state.sortlist,
      });
    } else {
      var finalSort = {
        id: "ShipmentDate",
        desc: true,
      };

      this.setState({ previousSortList: [finalSort] });
    }
  }

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

  // Search Shipment

  toggle = (e) => {
    this.setState({
      expand: !this.state.expand,
    });
  };

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

  validate() {
    let IsValid = true;
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
        TrackingNumber: e.target.value,
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
          CommonConfig.isEmpty(this.state.StatusQuery) &&
          CommonConfig.isEmpty(this.state.ShipmentType) &&
          CommonConfig.isEmpty(this.state.Amount) &&
          CommonConfig.isEmpty(this.state.UserName)
        )
      ) {
        try {
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
                this.setState({ shipmentList: res.data[0] });
              } else {
                cogoToast.error("Something went wrong s1");
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
        cogoToast.error("Please select/enter atleast one field.");
      }
    } else {
      cogoToast.error(
        "There were errors found in form.Please correct error and resubmit form."
      );
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
    });
    this.getShipmentList();
  };

  render() {
    const {
      shipmentList,
      SearchAccess,
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
      contactNameErr,
      contactNameHelperText,
      contactNumberHelperText,
      contactNumberErr,
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

    const Columns = [
      {
        Header: "Date",
        id: "ShipmentDate",
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

    return (
      <GridContainer className="UserList-outer">
        <GridItem xs={12}>
          {this.state.Loading === true ? (
            <div className="loading">
              <SimpleBackdrop />
            </div>
          ) : null}
          <Card>
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <Store />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">
                Shipment List
              </h4>
            </CardHeader>
            <CardBody>
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
            </CardBody>
          </Card>
          {SearchAccess.ReadAccess === 1 ? (
            <Card style={{ paddingBottom: "5px" }}>
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <HeadsetMic />
                </CardIcon>
                <h4 className="margin-right-auto text-color-black">
                  Search Shipment
                </h4>
                <button className="expand-icon" onClick={(e) => this.toggle(e)}>
                  <ExpandMoreIcon />
                </button>
              </CardHeader>
              <div style={{ display: this.state.expand ? "block" : "none" }}>
                <CardBody>
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
                  </GridContainer>

                  <div className="shipment-submit">
                    <div className="right">
                      <Button color="rose" onClick={() => this.searchReport()}>
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
                </CardBody>
              </div>
            </Card>
          ) : null}
        </GridItem>
      </GridContainer>
    );
  }
}

export default ShipmentList;
