import React, { Component } from "react";
import GridContainer from "components/Grid/GridContainer.js";
import { CommonConfig } from "../../utils/constant";
import ReactTable from "react-table";
import GridItem from "components/Grid/GridItem.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";
import TextField from "@material-ui/core/TextField";
import CardBody from "components/Card/CardBody.js";
import InputLabel from "@material-ui/core/InputLabel";
import Card from "components/Card/Card";
import { makeStyles } from "@material-ui/core/styles";
import Datetime from "react-datetime";
import FormControl from "@material-ui/core/FormControl";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import cogoToast from "cogo-toast";
import api from "../../utils/apiClient";
import moment from "moment";
import SimpleBackdrop from "../../utils/general";
import AssignmentIcon from "@material-ui/icons/Assignment";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogContent from "@material-ui/core/DialogContent";

const useStyles = () => makeStyles(styles);
const classes = useStyles();

class ReviewReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogText: "",
      CustomerEmail: "",
      passFilter: {},
      sendMail: {},
      FromDate: "",
      ToDate: "",
      Loading: false,
      finalLength: 0,
      finalLength2: 0,
      finalLength3: 0,
      SendMailList: [],
      PassFilterList: [],
      CaptureFilterList: [],
      filterProps: [],
      previousFilterList: [],
      previousSortList: [],
      searchClicked: false,
      showcomment: false,
      Steps: [
        {
          stepName: "Review Send",
          stepId: "reviewsend",
          classname: "active",
        },
        {
          stepName: "Passed Filter",
          stepId: "passedfilter",
          classname: "inactive",
        },
        {
          stepName: "Captured by Filter",
          stepId: "capturedbyfilter",
          classname: "inactive",
        },
      ],
    };
  }

  async componentDidMount() {
    document.getElementById("passedfilter").style.display = "none";
    document.getElementById("capturedbyfilter").style.display = "none";
    if (!CommonConfig.isEmpty(this.props.location.state)) {
      let stepIndex = this.state.Steps.findIndex(
        (x) => x.stepId === this.props.location.state.id
      );
    }
  }

  commentbox = (record) => {
    console.log("record", record.value);
    this.setState({ dialogText: record.value });
    this.setState({ showcomment: true });
  };

  inputChange = (e, type) => {
    this.setState({
      [type]: e.target.value,
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
      // setTimeout(() => {
      document.getElementById(divID).style.display = "block";
      // }, 5000);
      //  setTimeout(() => {
      document.getElementById(activeDiv).style.display = "none";
      //  }, 5000);
    }
  };

  dateChange = (date, type) => {
    this.setState({
      [type]: date,
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

          CustomerEmail: CommonConfig.isEmpty(this.state.CustomerEmail)
            ? ""
            : this.state.CustomerEmail,
        };
        api
          .post("reviewMangement/MailReport", data)
          .then((res) => {
            this.hideLoader();
            if (res.success) {
              this.setState({ SendMailList: res.Data[0] });
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

  PassFilterReport = () => {
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

          CustomerEmail: CommonConfig.isEmpty(this.state.CustomerEmail)
            ? ""
            : this.state.CustomerEmail,
        };
        api
          .post("reviewMangement/PassFilter", data)
          .then((res) => {
            this.hideLoader();
            if (res.success) {
              this.setState({ PassFilterList: res.Data[0] });
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

  CaptureFilterReport = () => {
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

          CustomerEmail: CommonConfig.isEmpty(this.state.CustomerEmail)
            ? ""
            : this.state.CustomerEmail,
        };
        api
          .post("reviewMangement/CapturedFilter", data)
          .then((res) => {
            this.hideLoader();
            if (res.success) {
              this.setState({ CaptureFilterList: res.Data[0] });
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

  showLoader() {
    this.setState({ Loading: true });
  }

  HandleChange = () => {
    this.setState({ showcomment: false });
    if (this.state.redirect) {
      this.props.history.push({
        pathname: "/ReviewReport",
      });
    }
  };

  setFilterProps = (filterValue) => {
    this.setState({
      filterProps: filterValue.filtered,
      sortProps: filterValue.sorted,
    });
  };

  setLength = (len, value) => {
    if (value == "third") {
      this.setState({ finalLength3: len });
    }

    if (value == "second") {
      this.setState({ finalLength2: len });
    }

    if (value == "first") {
      this.setState({ finalLength: len });
    }
  };

  checkProps = (e, value) => {
    if (value == "third") {
      if (this.state.finalLength3 !== e.sortedData.length) {
        this.setLength(e.sortedData.length, "third");
      }
    }
    if (value == "second") {
      if (this.state.finalLength2 !== e.sortedData.length) {
        this.setLength(e.sortedData.length, "second");
      }
    }
    if (value == "first") {
      if (this.state.finalLength !== e.sortedData.length) {
        this.setLength(e.sortedData.length, "first");
      }
    }
    return "";
  };

  activeInactiveEmail = (record) => {
    let data = {
      customeremail: record.original.CustomerEmail,
      status: record.original.Status === "Active" ? "Inactive" : "Active",
    };

    try {
      api
        .post("reviewMangement/activeInactiveEmail", data)
        .then((res) => {
          if (res.success) {
            this.searchReport();
          } else {
            cogoToast.error("Something Went Wrong");
          }
        })
        .catch((err) => {
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {}
  };

  render() {
    const {
      SendMailList,
      PassFilterList,
      CaptureFilterList,
      FromDate,
      ToDate,
      CustomerEmail,
    } = this.state;
    const viewAllcolumns = [
      {
        Header: "Date",
        // accessor: "DateTime",
        id: "DateTime",
        // sortMethod: (a, b) => {
        //     return CommonConfig.dateSortMethod(a, b);
        //   },
        accessor: (data) => {
          return moment(data.DateTime).format("MM/DD/YYYY");
        },

        maxWidth: 80,
      },
      {
        Header: "Tracking",
        accessor: "TrackingNumber",
        width: 75,
      },
      {
        Header: "Mail Type",
        accessor: "MailType",
        width: 80,
      },
      {
        Header: "Manage By",
        accessor: "UserName",
        width: 110,
      },
      {
        Header: "Sender",
        accessor: "Sender",
        width: 110,
      },
      {
        Header: "Receiver",
        accessor: "CustomerName",
        width: 160,
      },
      {
        Header: "Receiver Email",
        accessor: "CustomerEmail",
        width: 190,
      },
      {
        Header: "Status",
        width: 100,
        sortable: false,
        filterable: false,
        Cell: (record) => {
          if (record.original.Status === "Active") {
            return (
              <Button
                color="success"
                className="table-btn"
                onClick={() => this.activeInactiveEmail(record)}
              >
                Active
              </Button>
            );
          } else {
            return (
              <Button
                color="danger"
                className="table-btn"
                onClick={() => this.activeInactiveEmail(record)}
              >
                Inactive
              </Button>
            );
          }
        },
      },
    ];
    const passFiltercolumns = [
      {
        Header: "Date",
        id: "ReviewTime",
        accessor: (data) => {
          return moment(data.ReviewTime).format("MM/DD/YYYY");
        },
        maxWidth: 85,
      },
      {
        Header: "Tracking",
        accessor: "TrackingNumber",
        width: 83,
      },
      {
        Header: "Social Click",
        accessor: "SocialSite",
        width: 100,
      },
      {
        Header: "Manage By",
        accessor: "UserName",
        width: 150,
      },
      {
        Header: "Sender",
        accessor: "Sender",
        width: 110,
      },
      {
        Header: "Receiver",
        accessor: "CustomerName",
        width: 160,
      },
      {
        Header: "Receiver Email",
        accessor: "CustomerEmail",
        width: 200,
      },
    ];
    const captureFilterList = [
      {
        Header: "Date",
        id: "ReviewTime",
        accessor: (data) => {
          return moment(data.ReviewTime).format("MM/DD/YYYY");
        },
        maxWidth: 85,
      },
      {
        Header: "Tracking",
        accessor: "TrackingNumber",
        width: 83,
      },
      {
        Header: "Review",
        accessor: "Review",
        width: 50,
      },
      {
        Header: "Comment",
        accessor: "Commnet",
        width: 100,
        sortable: false,
        filterable: false,
        Cell: (record) => {
          return (
            <div className="table-common-btn">
              <Button
                color="success"
                className="table-btn"
                onClick={() => this.commentbox(record)}
              >
                Show
              </Button>
            </div>
          );
        },
      },
      {
        Header: "Manage By",
        accessor: "UserName",
        width: 110,
      },
      {
        Header: "Sender",
        accessor: "Sender",
        width: 80,
      },
      {
        Header: "Receiver",
        accessor: "CustomerName",
        width: 120,
      },
      {
        Header: "Receiver Email",
        accessor: "CustomerEmail",
        width: 200,
      },
    ];
    return (
      <div>
        <GridContainer justify="center" className="schedule-pickup-main-outer">
          {this.state.Loading === true ? (
            <div className="loading">
              <SimpleBackdrop />
            </div>
          ) : null}
          <GridItem xs={12} sm={12}>
            <Card className="z-index-9">
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <AssignmentIcon />
                </CardIcon>
                <h4 className="margin-right-auto text-color-black">
                  Review Reports
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
                  <div className="shipment-pane" id="reviewsend">
                    <GridContainer>
                      {this.state.Loading === true ? (
                        <div className="loading">
                          <SimpleBackdrop />
                        </div>
                      ) : null}
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
                      <GridItem xs={12} sm={12} md={3}>
                        <div className="mt-15">
                          <FormControl fullWidth>
                            <TextField
                              label="Customer Email"
                              value={CustomerEmail}
                              onChange={(event) =>
                                this.inputChange(event, "CustomerEmail")
                              }
                            />
                          </FormControl>
                        </div>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={2}>
                        <div className="">
                          <FormControl fullWidth>
                            <div className="shipment-submit  mt-10">
                              <div className="right">
                                <Button
                                  color="rose"
                                  onClick={() => this.searchReport()}
                                >
                                  Search
                                </Button>
                              </div>
                            </div>
                          </FormControl>
                        </div>
                      </GridItem>

                      <GridItem xs={12} sm={12} md={12}>
                        {this.state.searchClicked ? (
                          <ReactTable
                            data={SendMailList}
                            minRows={2}
                            pageText={"Total rows : " + this.state.finalLength}
                            defaultFilterMethod={
                              CommonConfig.filterCaseInsensitive
                            }
                            filterable
                            defaultSorted={this.state.previousSortList}
                            defaultFiltered={this.state.previousFilterList}
                            resizable={false}
                            columns={viewAllcolumns}
                            defaultPageSize={10}
                            showPaginationBottom={true}
                            getPaginationProps={(e) =>
                              this.checkProps(e, "first")
                            }
                            manualPagination={true}
                            className="-striped -highlight mt-20"
                          />
                        ) : null}
                      </GridItem>
                    </GridContainer>
                  </div>

                  <div className="shipment-pane" id="passedfilter">
                    <GridContainer>
                      {this.state.Loading === true ? (
                        <div className="loading">
                          <SimpleBackdrop />
                        </div>
                      ) : null}
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
                      <GridItem xs={12} sm={12} md={3}>
                        <div className="mt-15">
                          <FormControl fullWidth>
                            <TextField
                              label="Customer Email"
                              value={CustomerEmail}
                              onChange={(event) =>
                                this.inputChange(event, "CustomerEmail")
                              }
                            />
                          </FormControl>
                        </div>
                      </GridItem>

                      <GridItem xs={12} sm={12} md={2}>
                        <div className="">
                          <FormControl fullWidth>
                            <div className="shipment-submit  mt-10">
                              <div className="right">
                                <Button
                                  color="rose"
                                  onClick={() => this.PassFilterReport()}
                                >
                                  Search
                                </Button>
                              </div>
                            </div>
                          </FormControl>
                        </div>
                      </GridItem>

                      <GridItem xs={12} sm={12} md={12}>
                        {this.state.searchClicked ? (
                          <ReactTable
                            data={PassFilterList}
                            minRows={2}
                            pageText={"Total rows : " + this.state.finalLength2}
                            defaultFilterMethod={
                              CommonConfig.filterCaseInsensitive
                            }
                            filterable
                            defaultSorted={this.state.previousSortList}
                            defaultFiltered={this.state.previousFilterList}
                            resizable={false}
                            getPaginationProps={(e) =>
                              this.checkProps(e, "second")
                            }
                            columns={passFiltercolumns}
                            defaultPageSize={10}
                            showPaginationBottom={true}
                            manualPagination={true}
                            className="-striped -highlight pass-filter-table mt-20"
                          />
                        ) : null}
                      </GridItem>
                    </GridContainer>
                  </div>
                  <div className="shipment-pane" id="capturedbyfilter">
                    <GridContainer>
                      {this.state.Loading === true ? (
                        <div className="loading">
                          <SimpleBackdrop />
                        </div>
                      ) : null}
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
                      <GridItem xs={12} sm={12} md={3}>
                        <div className="mt-15">
                          <FormControl fullWidth>
                            <TextField
                              label="Customer Email"
                              value={CustomerEmail}
                              onChange={(event) =>
                                this.inputChange(event, "CustomerEmail")
                              }
                            />
                          </FormControl>
                        </div>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={2}>
                        <div className="">
                          <FormControl fullWidth>
                            <div className="shipment-submit  mt-10">
                              <div className="right">
                                <Button
                                  color="rose"
                                  onClick={() => this.CaptureFilterReport()}
                                >
                                  Search
                                </Button>
                              </div>
                            </div>
                          </FormControl>
                        </div>
                      </GridItem>

                      <GridItem xs={12} sm={12} md={12}>
                        {this.state.searchClicked ? (
                          <ReactTable
                            data={CaptureFilterList}
                            minRows={2}
                            pageText={"Total rows : " + this.state.finalLength3}
                            defaultFilterMethod={
                              CommonConfig.filterCaseInsensitive
                            }
                            filterable
                            defaultSorted={this.state.previousSortList}
                            defaultFiltered={this.state.previousFilterList}
                            resizable={false}
                            columns={captureFilterList}
                            defaultPageSize={10}
                            showPaginationBottom={true}
                            manualPagination={true}
                            getPaginationProps={(e) =>
                              this.checkProps(e, "third")
                            }
                            className="-striped -highlight mt-20"
                          />
                        ) : null}
                      </GridItem>
                    </GridContainer>
                  </div>
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <div>
          <Dialog
            open={this.state.showcomment}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {this.state.dialogText}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.HandleChange()} color="secondary">
                ok
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}

export default ReviewReport;
