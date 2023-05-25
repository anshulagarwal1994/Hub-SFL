import React, { Component } from "react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import Cardbody from "components/Card/CardBody.js";
import Adduser from "@material-ui/icons/AccountCircle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import api from "../../../utils/apiClient";
import moment from "moment";
import { CommonConfig } from "../../../utils/constant";
import cogoToast from "cogo-toast";
import SimpleBackdrop from "../../../utils/general";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import Button from "components/CustomButtons/Button.js";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Datetime from "react-datetime";
import TextField from "@material-ui/core/TextField";
import { InputLabel } from "@material-ui/core";

const useStyles = makeStyles(styles);

class EditLeadAccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timezoneModule: [],

      contentModule: [],
      StartDate: "",
      startdateErr: false,
      startdateHelperText: "",
      EndDate: "",
      enddateErr: false,
      enddateHelperText: "",
      DayLimit: 0,
      daylimitErr: false,
      daylimitHelperText: "",
      OpenLimit: 0,
      openlimitErr: false,
      openlimitHelperText: "",
      NewLimit: 0,
      newlimitErr: false,
      newlimitHelperText: "",
      Hawaii: 0,
      Alaska: 0,
      Mountain: 0,
      Pacific: 0,
      Central: 0,
      Eastern: 0,
      Document: 0,
      TV: 0,
      Furniture: 0,
      Auto: 0,
      Boxes: 0,
      Loading: false,
      Access: [],
    };
  }

  componentDidMount() {
    this.getAccessDetail();
    this.setState({
      Access: CommonConfig.getUserAccess("Lead Assignment"),
    });
  }

  showLoador = () => {
    this.setState({ Loading: true });
  };

  hideLoador = () => {
    this.setState({ Loading: false });
  };

  getAccessDetail() {
    this.showLoador();
    try {
      let data = {
        PersonID: this.props.location.state.UserID,
      };
      api
        .post("usermanagement/getLeadAssignmentDetailByID", data)
        .then((res) => {
          if (res.success) {
            this.hideLoador();
            this.setState({
              NewLimit: res.data.LeadAssignmentData.NewLimit,
              OpenLimit: res.data.LeadAssignmentData.OpenLimit,
              DayLimit: res.data.LeadAssignmentData.DayLimit,
              StartDate: res.data.LeadAssignmentData.LeaveStartDate,
              EndDate: res.data.LeadAssignmentData.LeaveEndDate,
              LeadAssignmentID: res.data.LeadAssignmentData.LeadAssignmentID,
              timezoneModule: res.data.TimeZoneData,
              Hawaii: res.data.TimeZoneData[0].Hawaii,
              Alaska: res.data.TimeZoneData[0].Alaska,
              Pacific: res.data.TimeZoneData[0].Pacific,
              Eastern: res.data.TimeZoneData[0].Eastern,
              Mountain: res.data.TimeZoneData[0].Mountain,
              Central: res.data.TimeZoneData[0].Central,
              contentModule: res.data.ContentData,
            });
            this.setupContent();
          } else {
            this.hideLoador();
            cogoToast.error("Something went wrong");
          }
        })
        .catch((err) => {
          this.hideLoador();
          console.log(err);
          cogoToast.error("Something went wrong");
        });
    } catch (err) {
      console.log("error....", err);
    }
  }

  setupContent = () => {
    let ContentList = this.state.contentModule;
    for (var i = 0; i < ContentList.length; i++) {
      if (ContentList[i].hasOwnProperty("ContentName")) {
        if (ContentList[i]["ContentName"] === "Document") {
          this.setState({ Document: ContentList[i]["IsAccess"] == 1 ? 1 : 0 });
        } else if (ContentList[i]["ContentName"] === "Television") {
          this.setState({ TV: ContentList[i]["IsAccess"] == 1 ? 1 : 0 });
        } else if (ContentList[i]["ContentName"] === "Furniture") {
          this.setState({ Furniture: ContentList[i]["IsAccess"] == 1 ? 1 : 0 });
        } else if (ContentList[i]["ContentName"] === "Boxes") {
          this.setState({ Boxes: ContentList[i]["IsAccess"] == 1 ? 1 : 0 });
        } else if (ContentList[i]["ContentName"] === "Auto") {
          this.setState({ Auto: ContentList[i]["IsAccess"] == 1 ? 1 : 0 });
        }
      }
    }
  };

  handleDateChange = (date, type) => {
    if (type === "start") {
      this.setState({
        StartDate: date,
        startdateErr: false,
        startdateHelperText: "",
      });
    } else if (type === "end") {
      this.setState({
        EndDate: date,
        enddateErr: false,
        enddateHelperText: "",
      });
    }
  };

  handleContentChange = (event, type) => {
    let cvalue = event.target.checked;
    var contentList = this.state.contentModule;

    if (type === "document") {
      var index = contentList.findIndex((x) => x.ContentName === "Document");
      contentList[index]["IsAccess"] = cvalue ? 1 : 0;
      this.setState({ Document: cvalue ? 1 : 0, contentModule: contentList });
    } else if (type === "boxes") {
      var index = contentList.findIndex((x) => x.ContentName === "Boxes");
      contentList[index]["IsAccess"] = cvalue ? 1 : 0;
      this.setState({ Boxes: cvalue ? 1 : 0, contentModule: contentList });
    } else if (type === "furniture") {
      var index = contentList.findIndex((x) => x.ContentName === "Furniture");
      contentList[index]["IsAccess"] = cvalue ? 1 : 0;
      this.setState({ Furniture: cvalue ? 1 : 0, contentModule: contentList });
    } else if (type === "tv") {
      var index = contentList.findIndex((x) => x.ContentName === "Television");
      contentList[index]["IsAccess"] = cvalue ? 1 : 0;
      this.setState({ TV: cvalue ? 1 : 0, contentModule: contentList });
    } else if (type === "auto") {
      var index = contentList.findIndex((x) => x.ContentName === "Auto");
      contentList[index]["IsAccess"] = cvalue ? 1 : 0;
      this.setState({ Auto: cvalue ? 1 : 0, contentModule: contentList });
    }
  };

  handleSave = (redirect) => {
    this.showLoador();
    var data = {
      PersonID: this.props.location.state.UserID,
      userId: CommonConfig.loggedInUserData().PersonID,
      DayLimit: this.state.DayLimit,
      OpenLimit: this.state.OpenLimit,
      NewLimit: this.state.NewLimit,
      LeaveStartDate:
        CommonConfig.isEmpty(this.state.StartDate) != true
          ? moment(this.state.StartDate)
              //.startOf("day")
              .format("YYYY-MM-DD HH:mm:ss")
              .toString()
          : null,
      LeaveEndDate:
        CommonConfig.isEmpty(this.state.EndDate) != true
          ? moment(this.state.EndDate)
              //.endOf("day")
              .format("YYYY-MM-DD HH:mm:ss")
              .toString()
          : null,
      LeadAssignmentID: this.state.LeadAssignmentID,
      Hawaii: this.state.Hawaii,
      Alaska: this.state.Alaska,
      Pacific: this.state.Pacific,
      Mountain: this.state.Mountain,
      Central: this.state.Central,
      Eastern: this.state.Eastern,
      ContentList: this.state.contentModule,
    };
    api
      .post("userManagement/addUpdateLeadAssignment", data)
      .then((res) => {
        if (res.success) {
          this.hideLoador();
          if (redirect) {
            this.props.history.push({
              pathname: "/admin/LeadUserList",
              state: {
                filterlist: this.props.history.location.state.filterlist,
                sortlist: this.props.history.location.state.sortlist,
              },
            });
          } else {
            this.getAccessDetail();
          }
        } else {
          debugger;
          this.hideLoador();
          cogoToast.error("Something went wrong");
        }
      })
      .catch((err) => {
        debugger;
        this.hideLoador();
        cogoToast.error("Something went wrong");
        console.log("err....", err);
      });
  };

  handleCheckboxChange = (event, type) => {
    let cvalue = event.target.checked;

    if (type === "hawaii") {
      this.setState({ Hawaii: cvalue ? 1 : 0 });
    } else if (type === "alaska") {
      this.setState({ Alaska: cvalue ? 1 : 0 });
    } else if (type === "pacific") {
      this.setState({ Pacific: cvalue ? 1 : 0 });
    } else if (type === "mountain") {
      this.setState({ Mountain: cvalue ? 1 : 0 });
    } else if (type === "central") {
      this.setState({ Central: cvalue ? 1 : 0 });
    } else if (type === "eastern") {
      this.setState({ Eastern: cvalue ? 1 : 0 });
    }
  };

  handleInputChange = (event, type) => {
    let Val = event.target.value;
    if (type === "daylimit") {
      if (CommonConfig.isEmpty(this.state.DayLimit)) {
        this.setState({
          DayLimit: Val,
          daylimitErr: true,
          daylimitHelperText: "Please enter daily limit",
        });
      } else {
        this.setState({
          DayLimit: Val,
          daylimitErr: false,
          daylimitHelperText: "",
        });
      }
    } else if (type === "newlimit") {
      if (CommonConfig.isEmpty(this.state.NewLimit)) {
        this.setState({
          NewLimit: Val,
          newlimitErr: true,
          newlimitHelperText: "Please enter new limit",
        });
      } else {
        this.setState({
          NewLimit: Val,
          newlimitErr: false,
          newlimitHelperText: "",
        });
      }
    } else if (type === "openlimit") {
      if (CommonConfig.isEmpty(this.state.OpenLimit)) {
        this.setState({
          OpenLimit: Val,
          openlimitErr: true,
          openlimitHelperText: "Please enter open limit",
        });
      } else {
        this.setState({
          OpenLimit: Val,
          openlimitErr: false,
          openlimitHelperText: "",
        });
      }
    }
  };
  cancelLead = () => {
    this.props.history.push({
      pathname: "/admin/LeadUserList",
      state: {
        filterlist: this.props.history.location.state.filterlist,
        sortlist: this.props.history.location.state.sortlist,
      },
    });
  };

  setNull = () => {
    this.setState({ StartDate: null, EndDate: null });
  };

  render() {
    const {
      DayLimit,
      daylimitErr,
      daylimitHelperText,
      OpenLimit,
      openlimitErr,
      openlimitHelperText,
      NewLimit,
      newlimitHelperText,
      newlimitErr,
      Boxes,
      TV,
      Furniture,
      Document,
      Auto,
      Hawaii,
      Alaska,
      Pacific,
      Mountain,
      Central,
      Eastern,
    } = this.state;

    return (
      <GridContainer className="UserList-outer">
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <Adduser />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">
                Lead Access Details
              </h4>
            </CardHeader>
            <Cardbody>
              <div className="package-table lead-access-table">
                <table style={{ tableLayout: "fixed" }}>
                  <thead>
                    <tr>
                      <th>USA Timezone Access</th>
                      <th className="align-center">
                        <div className="th-check">
                          Hawaii<br></br>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={Hawaii}
                                name="Hawaii"
                                onChange={(event) =>
                                  this.handleCheckboxChange(event, "hawaii")
                                }
                              />
                            }
                            classes={{
                              label: useStyles.label,
                              root: useStyles.labelRoot,
                            }}
                          />
                        </div>
                      </th>
                      <th className="align-center">
                        <div className="th-check">
                          Alaska <br></br>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={Alaska}
                                name="Alaska"
                                onChange={(event) =>
                                  this.handleCheckboxChange(event, "alaska")
                                }
                              />
                            }
                            classes={{
                              label: useStyles.label,
                              root: useStyles.labelRoot,
                            }}
                          />
                        </div>
                      </th>
                      <th className="align-center">
                        <div className="th-check">
                          Pacific <br></br>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={Pacific}
                                name="Pacific"
                                onChange={(event) =>
                                  this.handleCheckboxChange(event, "pacific")
                                }
                              />
                            }
                            classes={{
                              label: useStyles.label,
                              root: useStyles.labelRoot,
                            }}
                          />
                        </div>
                      </th>
                      <th className="align-center">
                        <div className="th-check">
                          Mountain<br></br>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={Mountain}
                                name="Mountain"
                                onChange={(event) =>
                                  this.handleCheckboxChange(event, "mountain")
                                }
                              />
                            }
                            classes={{
                              label: useStyles.label,
                              root: useStyles.labelRoot,
                            }}
                          />
                        </div>
                      </th>
                      <th className="align-center">
                        <div className="th-check">
                          Central<br></br>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={Central}
                                name="Central"
                                onChange={(event) =>
                                  this.handleCheckboxChange(event, "central")
                                }
                              />
                            }
                            classes={{
                              label: useStyles.label,
                              root: useStyles.labelRoot,
                            }}
                          />
                        </div>
                      </th>
                      <th className="align-center">
                        <div className="th-check">
                          Eastern<br></br>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={Eastern}
                                name="Eastern"
                                onChange={(event) =>
                                  this.handleCheckboxChange(event, "eastern")
                                }
                              />
                            }
                            classes={{
                              label: useStyles.label,
                              root: useStyles.labelRoot,
                            }}
                          />
                        </div>
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div className="package-table lead-access-table">
                <table style={{ tableLayout: "fixed" }}>
                  <thead>
                    <tr>
                      <th>Content Access</th>
                      <th className="align-center">
                        <div className="th-check">
                          Document<br></br>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={Document}
                                name="Document"
                                onChange={(event) =>
                                  this.handleContentChange(event, "document")
                                }
                              />
                            }
                            classes={{
                              label: useStyles.label,
                              root: useStyles.labelRoot,
                            }}
                          />
                        </div>
                      </th>
                      <th className="align-center">
                        <div className="th-check">
                          Boxes <br></br>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={Boxes}
                                name="Boxes"
                                onChange={(event) =>
                                  this.handleContentChange(event, "boxes")
                                }
                              />
                            }
                            classes={{
                              label: useStyles.label,
                              root: useStyles.labelRoot,
                            }}
                          />
                        </div>
                      </th>
                      <th className="align-center">
                        <div className="th-check">
                          Furniture <br></br>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={Furniture}
                                name="Furniture"
                                onChange={(event) =>
                                  this.handleContentChange(event, "furniture")
                                }
                              />
                            }
                            classes={{
                              label: useStyles.label,
                              root: useStyles.labelRoot,
                            }}
                          />
                        </div>
                      </th>
                      <th className="align-center">
                        <div className="th-check">
                          Television<br></br>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={TV}
                                name="TV"
                                onChange={(event) =>
                                  this.handleContentChange(event, "tv")
                                }
                              />
                            }
                            classes={{
                              label: useStyles.label,
                              root: useStyles.labelRoot,
                            }}
                          />
                        </div>
                      </th>
                      <th className="align-center">
                        <div className="th-check">
                          Auto<br></br>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={Auto}
                                name="Auto"
                                onChange={(event) =>
                                  this.handleContentChange(event, "auto")
                                }
                              />
                            }
                            classes={{
                              label: useStyles.label,
                              root: useStyles.labelRoot,
                            }}
                          />
                        </div>
                      </th>
                      <th className="align-center"></th>
                    </tr>
                  </thead>
                </table>
              </div>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <FormControl className="mb-0" fullWidth>
                    <CustomInput
                      labelText="Max Sales Lead per Day"
                      id="daylimit"
                      formControlProps={{ fullWidth: true }}
                      error={daylimitErr}
                      helperText={daylimitHelperText}
                      inputProps={{
                        value: DayLimit,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className="requiredicon">perm_identity</Icon>
                          </InputAdornment>
                        ),
                        onChange: (event) =>
                          this.handleInputChange(event, "daylimit"),
                        onFocus: () =>
                          this.setState({
                            daylimitErr: false,
                            daylimitHelperText: "",
                          }),
                      }}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <FormControl className="mb-0" fullWidth>
                    <CustomInput
                      labelText="Max Sales Lead [ New Request]"
                      id="newlimit"
                      formControlProps={{ fullWidth: true }}
                      error={newlimitErr}
                      helperText={newlimitHelperText}
                      inputProps={{
                        value: NewLimit,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className="requiredicon">perm_identity</Icon>
                          </InputAdornment>
                        ),
                        onChange: (event) =>
                          this.handleInputChange(event, "newlimit"),
                        onFocus: () =>
                          this.setState({
                            newlimitErr: false,
                            newlimitHelperText: "",
                          }),
                      }}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <FormControl className="mb-0" fullWidth>
                    <CustomInput
                      labelText="Max Sales Lead [ Open]"
                      id="openlimit"
                      formControlProps={{ fullWidth: true }}
                      error={openlimitErr}
                      helperText={openlimitHelperText}
                      inputProps={{
                        value: OpenLimit,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className="requiredicon">perm_identity</Icon>
                          </InputAdornment>
                        ),
                        onChange: (event) =>
                          this.handleInputChange(event, "openlimit"),
                        onFocus: () =>
                          this.setState({
                            openlimitErr: false,
                            openlimitHelperText: "",
                          }),
                      }}
                    />
                  </FormControl>
                </GridItem>

                <GridItem xs={12} sm={12} md={4}>
                  <InputLabel style={{ marginTop: "35px" }}>
                    Do Not Assign
                  </InputLabel>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <div className="dt-vs date-spl">
                    <FormControl fullWidth>
                      <Datetime
                        dateFormat={"MM/DD/YYYY"}
                        timeFormat={false}
                        selected={moment(this.state.StartDate)}
                        value={moment(this.state.StartDate)}
                        inputProps={{ placeholder: "Start Date" }}
                        onChange={(date) =>
                          this.handleDateChange(date, "start")
                        }
                        closeOnSelect={true}
                        renderInput={(params) => (
                          <TextField
                            style={{ marginTop: "-15px" }}
                            error={this.state.startdateErr}
                            helperText={this.state.startdateHelperText}
                            {...params}
                            label="Start Date"
                            margin="normal"
                            fullWidth
                          />
                        )}
                      />
                      <Icon className="date-icon tp-slam">date_range</Icon>
                    </FormControl>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <div className="dt-vs date-spl">
                    <FormControl fullWidth>
                      <Datetime
                        dateFormat={"MM/DD/YYYY"}
                        timeFormat={false}
                        selected={moment(this.state.EndDate)}
                        value={moment(this.state.EndDate)}
                        inputProps={{ placeholder: "End Date" }}
                        onChange={(date) => this.handleDateChange(date, "end")}
                        closeOnSelect={true}
                        renderInput={(params) => (
                          <TextField
                            style={{ marginTop: "-15px" }}
                            error={this.state.enddateErr}
                            helperText={this.state.enddateHelperText}
                            {...params}
                            label="End Date"
                            margin="normal"
                            fullWidth
                          />
                        )}
                      />
                      <Icon className="date-icon tp-slam">date_range</Icon>
                    </FormControl>
                  </div>
                </GridItem>
              </GridContainer>
            </Cardbody>
          </Card>
          <div className="shipment-submit">
            <div className="right">
              {this.state.Access.WriteAccess === 1 ? (
                <>
                  <Button color="rose" onClick={() => this.handleSave(false)}>
                    Save
                  </Button>
                  <Button color="primary" onClick={() => this.handleSave(true)}>
                    Save & Exit
                  </Button>
                </>
              ) : null}
              <Button color="secondary" onClick={() => this.cancelLead()}>
                Cancel
              </Button>
            </div>
          </div>
        </GridItem>
      </GridContainer>
    );
  }
}

export default EditLeadAccess;
