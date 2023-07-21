import React, { Component } from "react";
// react component for creating dynamic tables

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import HeadsetMic from "@material-ui/icons/HeadsetMic";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/PriorityHigh";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import { CommonConfig } from "../../utils/constant";
import Icon from "@material-ui/core/Icon";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import moment from "moment";
import momentTimezone from "moment-timezone";
import Note from "@material-ui/icons/Assessment";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import SaveIcon from "@material-ui/icons/Save";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import api from "../../utils/apiClient";
import { fileBase } from "../../utils/config";
import { green } from "@material-ui/core/colors";
import { red } from "@material-ui/core/colors";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import cogoToast from "cogo-toast";
import SimpleBackdrop from "../../utils/general";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
};
const useStyles = () => makeStyles(styles);
const classes = useStyles();

class EditCallBack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CallBackID: 0,
      CustomerName: "",
      CustomerNameErr: false,
      CustomerNameHelperText: "",
      CustomerNameCheck: false,

      TrackingNumber: "",
      trackingnumberErr: false,
      trackingnumberHelperText: "",
      trackingnumberCheck: false,

      EmailAddress: "",
      emailaddressErr: false,
      emailaddressHelperText: "",
      emailaddressCheck: false,

      TimetoCall: "",
      timetocallErr: "",
      timetocallHelperText: "",

      ContactNumber: "",
      contactnumberErr: false,
      contactnumberHelperText: "",
      contactnumberCheck: false,

      CreatedDate: "",
      dateErr: "",
      dateHelperText: "",
      Loading: false,
      notes: [],
      notesDisabled: true,
      Attachments: [],
      noteErr: false,

      Path: [],
      ReadAccess: 0,
      WriteAccess: 0,
      DeleteAccess: 0,
      AbsolutePath: "",
      selectedRequestStatus: "",
      selectedWorkingOnRequest: "",
      requestStatus: [
        { value: "New", label: "New" },
        { value: "Open", label: "Open" },
        { value: "Closed", label: "Closed" },
        { value: "Cancelled", label: "Cancelled" },
      ],
      WorkingonRequest: [],
      open: false,
      close: false,
    };
  }

  async componentDidMount() {
    await this.managedBY();
    this.setState({
      ReadAccess: CommonConfig.getUserAccess("Call Back").ReadAccess,
      WriteAccess: CommonConfig.getUserAccess("Call Back").WriteAccess,
    });
    this.setState({
      DeleteAccess: CommonConfig.getUserAccess("Call Back").DeleteAccess,
    });
    setTimeout(() => {
      this.geteditCallback();
    }, 1500);
  }

  reCallApi = () => {
    this.geteditCallback();
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClickCancel = () => {
    this.setState({ close: true, open: false });
  };

  managedBY = () => {
    try {
      api.get("callback/getManageCallBackUser").then((result) => {
        if (result.success) {
          this.setState({ WorkingonRequest: result.Data });
        } else {
          cogoToast.error("Something went wrong");
        }
      });
    } catch (err) {
      cogoToast.error("Something Went Wrong");
    }
  };

  geteditCallback = () => {
    let data = {
      CallBackID: this.props.match.params.id,
    };
    this.setState({ CallBackID: data.CallBackID });
    try {
      this.setState({ Loading: true });
      api.post("callback/GetCallBackDetailsById/", data).then((result) => {
        if (result.data.success) {
          this.setState({ Loading: false });
          if (
            result.data.data.NoteList != null &&
            result.data.data.NoteList.length > 0
          ) {
            var i = 0;
            result.data.data.NoteList.map((Obj) => {
              Obj.Index = i;
              i++;
              return Obj;
            });
            result.data.data.NoteList.map((Obj) => {
              Obj.disabled = i;
              i++;
              return Obj;
            });
            this.setState({
              notes: result.data.data.NoteList,
              notesDisabled: true,
            });
          }
          var managedBY = this.state.WorkingonRequest.find(
            (x) => x.PersonID === result.data.data.WorkingOnRequest
          );
          var selectedManagedby = {};
          if (managedBY !== undefined && managedBY !== null) {
            selectedManagedby = {
              value: managedBY.PersonID,
              label: managedBY.Name,
            };
          }
          this.setState({
            CustomerName: result.data.data.CustomerName,
            EmailAddress: result.data.data.Email,
            TrackingNumber: result.data.data.TrackingNumber,
            TimetoCall: result.data.data.TimeToCall,
            ContactNumber: result.data.data.PhoneNum,
            CreatedDate: result.data.data.CreatedOn,
            selectedRequestStatus: result.data.data.RequestStatus,
            selectedWorkingOnRequest: selectedManagedby,
          });
          this.handleAddNotesRow();
        } else {
          this.setState({ Loading: false });
          cogoToast.error("Something Went Wrong");
        }
      });
    } catch (err) {
      this.setState({ Loading: false });
      cogoToast.error("Something Went Wrong");
    }
  };

  handleOnChange = (event, type) => {
    if (type === "emailaddress") {
      this.setState({
        emailaddressCheck: true,
        EmailAddress: event.target.value,
        emailaddressErr: false,
        emailaddressHelperText: "",
      });
    } else if (type === "contactnumber") {
      if (event.target.value.length <= 15) {
        this.setState({
          contactnumberCheck: true,
          ContactNumber: event.target.value.replace(/\D/, ""),
          contactnumberErr: false,
          contactnumberHelperText: "",
        });
      }
    }
  };

  handleChange = (event, type) => {
    if (type === "customername") {
      let customernameVal = event.target.value;
      if (CommonConfig.isEmpty(customernameVal)) {
        this.setState({
          CustomerName: customernameVal,
          CustomerNameErr: true,
          CustomerNameHelperText: "Please enter customername",
        });
      } else {
        this.setState({
          CustomerName: customernameVal,
          CustomerNameErr: false,
          CustomerNameHelperText: "",
        });
      }
    } else if (type === "emailaddress") {
      this.setState({ emailaddressCheck: true });
      let emailaddressVal = event.target.value;
      if (CommonConfig.isEmpty(emailaddressVal)) {
        this.setState({
          EmailAddress: emailaddressVal,
          emailaddressErr: true,
          emailaddressHelperText: "Please enter emailaddress",
        });
      } else if (!emailaddressVal.match(CommonConfig.RegExp.email)) {
        this.setState({
          EmailAddress: emailaddressVal,
          emailaddressErr: true,
          emailaddressHelperText: "Please enter valid emailaddress",
        });
      } else {
        this.setState({
          EmailAddress: emailaddressVal,
          emailaddressErr: false,
          emailaddressHelperText: "",
        });
      }
    } else if (type === "contactnumber") {
      this.setState({ contactnumberCheck: true });
      let contactnumberVal = event.target.value;
      if (CommonConfig.isEmpty(contactnumberVal)) {
        this.setState({
          ContactNumber: contactnumberVal,
          contactnumberErr: true,
          contactnumberHelperText: "Please enter contactnumber",
        });
      } else if (
        contactnumberVal.trim() !== contactnumberVal ||
        !contactnumberVal.match(CommonConfig.RegExp.phoneNumber)
      ) {
        this.setState({
          ContactNumber: contactnumberVal,
          contactnumberErr: true,
          contactnumberHelperText: "Please enter valid Contact number",
        });
      } else if (contactnumberVal.length < 5 || contactnumberVal.length > 15) {
        this.setState({
          ContactNumber: contactnumberVal,
          contactnumberErr: true,
          contactnumberHelperText: "Please enter valid Contact number",
        });
      } else {
        this.setState({
          ContactNumber: contactnumberVal,
          contactnumberErr: false,
          contactnumberHelperText: "",
        });
      }
    } else if (type === "trackingnumber") {
      let trackingnumberVal = event.target.value.replace(/\D/, "");
      if (CommonConfig.isEmpty(trackingnumberVal)) {
        this.setState({
          TrackingNumber: trackingnumberVal,
          trackingnumberErr: true,
          trackingnumberHelperText: "Please enter tracking number",
        });
      } else {
        this.setState({
          TrackingNumber: trackingnumberVal,
          trackingnumberErr: false,
          trackingnumberHelperText: "",
        });
      }
    }
  };

  handleFiles = (event, Index) => {
    const { files } = event.target;
    var notes = [...this.state.notes];
    var noteIndex = notes.findIndex((x) => x.Index === Index);
    if (noteIndex !== -1 && files !== undefined && files.length > 0) {
      let dateNow = new Date().getTime();
      notes[noteIndex]["DateTime"] = dateNow;
      notes[noteIndex]["AttachmentName"] = files[0].name;
      notes[noteIndex]["AttachmentStatus"] = "Active";
      files[0]["Index"] = Index;
      var AttachmentIndex = this.state.Attachments.findIndex(
        (x) => x.Index === Index
      );
      if (AttachmentIndex !== -1) {
        this.state.Attachments.splice(AttachmentIndex, 1);
      }
      this.state.Attachments.push(files[0]);
    }
    this.setState({ notes: notes });
  };

  saveCallBack = (redirect) => {
    var FinalNotes = this.state.notes.filter(
      (x) => x.NoteText !== "" && x.NoteText !== null
    );
    if (
      this.state.CustomerNameErr ||
      this.state.contactnumberErr ||
      this.state.emailaddressErr ||
      this.state.notes.length === 0 ||
      this.state.trackingnumberErr
    ) {
      this.setState({ saveErr: true });
      cogoToast.error(
        "There were found error in the form.Please correct and resubmit"
      );
    } else {
      let data = {
        NoteList: FinalNotes,
        userid: CommonConfig.loggedInUserData().PersonID,
        CallBackID: this.state.CallBackID,
        CustomerName: this.state.CustomerName,
        PhoneNum: this.state.ContactNumber,
        Email: this.state.EmailAddress,
        CountryCode: null,
        AreaCode: null,
        Ext: null,
        WorkingOnRequest: this.state.selectedWorkingOnRequest.value,
        RequestStatus: this.state.selectedRequestStatus,
        trackingNumber: this.state.TrackingNumber,
      };

      var formData = new FormData();
      formData.append("data", JSON.stringify(data));
      if (this.state.Attachments.length > 0) {
        this.state.Attachments.forEach((file) => {
          formData.append("Attachments", file);
        });
      }
      try {
        this.setState({ Loading: true });
        api.post("callBack/addCallBack", formData).then((result) => {
          if (result.success) {
            this.setState({ Loading: false });
            cogoToast.success("Updated Successfully");
            if (redirect) {
              this.props.history.push({
                pathname: "/admin/CallBack",
                state: {
                  filterlist: this.props.history.location.state.filterlist,
                  sortlist: this.props.history.location.state.sortlist,
                  statusList: this.props.history.location.state.statusList,
                },
              });
            } else {
              this.reCallApi();
            }
          } else {
            this.setState({ Loading: false });
            cogoToast.error("Something Went Wrong");
          }
        });
      } catch (err) {
        cogoToast.error("Something Went Wrong");
      }
    }
  };

  requestChange = (event, value, type) => {
    if (type === "requeststatus") {
      this.setState({ selectedRequestStatus: value });
    } else if (type === "workingonrequest") {
      this.setState({ selectedWorkingOnRequest: value });
    }
  };

  handleAddNotesRow = () => {
    var addnotes = this.state.notes.filter(
      (x) => x.Status === "Active" && (x.NoteText === null || x.NoteText === "")
    );
    if (addnotes.length === 0) {
      var todayDate = new Date();
      const note = {
        NoteText: "",
        NoteType: null,
        NoteTitle: null,
        Status: "Active",
        AttachmentID: null,
        AttachmentType: null,
        AttachmentName: null,
        CreatedOn: moment(todayDate).format(CommonConfig.dateFormat.dateTime),
        disabled: false,
        closebutton: true,
        CreatedBy: CommonConfig.loggedInUserData().PersonID,
        NoteID: null,
        CreatedByNote: CommonConfig.loggedInUserData().Name,
        AddedBy: CommonConfig.loggedInUserData().Name,
        Index: this.state.notes.length + 1,
      };
      //  var sortedNoteArray = this.state.notes.sort(function(a, b){return a.NoteID - b.NoteID});
      //  console.log("sortedNoteArray",sortedNoteArray);
      this.setState({
        notesDisabled: false,
        notes: [...this.state.notes, note],
      });
    } else {
      cogoToast.error("Please fill above notes first");
    }
  };

  handleChangeNotes = (idx) => (event) => {
    const { value } = event.target;
    const notes = [...this.state.notes];
    var noteIndex = notes.findIndex((x) => x.Index === idx);
    if (noteIndex !== -1) {
      notes[noteIndex]["NoteText"] = value;
      if (
        notes[noteIndex]["NoteText"] === null ||
        notes[noteIndex]["NoteText"] === ""
      ) {
        this.setState({ noteErr: true });
      } else {
        this.setState({ noteErr: false });
      }
    }
    this.setState({ notes: notes });
  };

  handleNotesRemoveRow = (idx) => {
    const removeNotes = [...this.state.notes];
    var noteIndex = this.state.notes.findIndex((x) => x.Index === idx);
    if (noteIndex !== -1) {
      removeNotes[noteIndex]["Status"] = "Inactive";
      this.setState({ notes: removeNotes });
    }
  };

  viewNotes = () => {
    return this.state.notes
      .filter((x) => x.Status === "Active")
      .map((notes, idx) => {
        return (
          <tr>
            <td style={{ width: "154px" }}>
              {momentTimezone(notes.CreatedOn)
                .tz(CommonConfig.UStimezone)
                .format(CommonConfig.dateFormat.dateTime)}
            </td>
            <td style={{ width: "597px" }}>
              {notes.disabled ? (
                <p
                  id="noteText"
                  dangerouslySetInnerHTML={{
                    __html: notes.NoteText.replace(/\r?\n/g, "<br />"),
                  }}
                ></p>
              ) : (
                <div className="table-textarea">
                  <textarea
                    name="NoteText"
                    disabled={notes.disabled}
                    value={notes.NoteText}
                    onChange={this.handleChangeNotes(notes.Index)}
                  ></textarea>
                </div>
              )}
            </td>
            {notes.disabled &&
            (notes.AttachmentPath === null ||
              notes.AttachmentPath === "" ||
              notes.AttachmentPath === undefined) ? (
              <td></td>
            ) : notes.disabled && notes.AttachmentPath ? (
              <td>
                <a
                  target="_blank"
                  className="normal-btn"
                  href={fileBase + notes.AttachmentPath}
                >
                  View Image
                </a>
              </td>
            ) : (
              <td>
                <div className="custom-file-browse">
                  <span>Choose File</span>
                  <input
                    type="file"
                    name="selectedfile"
                    id="file"
                    style={{ width: 140, border: 0 }}
                    onChange={(event) => this.handleFiles(event, notes.Index)}
                  />
                </div>
                <br /> <span>{notes.AttachmentName}</span>
              </td>
            )}
            <td className="pck-action-column">
              {this.state.DeleteAccess === 1 ? (
                <Button
                  justIcon
                  color="danger"
                  className="Plus-btn "
                  onClick={() => this.handleNotesRemoveRow(notes.Index)}
                >
                  <i className={"fas fa-minus"} />
                </Button>
              ) : null}
              {this.state.notes.filter((x) => x.Status === "Active").length ===
              idx + 1 ? (
                <Button
                  justIcon
                  color="facebook"
                  onClick={() => this.handleAddNotesRow()}
                  className="Plus-btn "
                >
                  <i className={"fas fa-plus"} />
                </Button>
              ) : null}
              <Tooltip title={notes.CreatedByNote} arrow>
                <Button className="Plus-btn info-icon" justIcon color="twitter">
                  <InfoIcon />
                </Button>
              </Tooltip>
            </td>
          </tr>
        );
      });
  };

  cancelCallback = () => {
    this.props.history.push({
      pathname: "/admin/CallBack",
      state: {
        filterlist: this.props.history.location.state.filterlist,
        sortlist: this.props.history.location.state.sortlist,
        statusList: this.props.history.location.state.statusList,
      },
    });
  };

  handleDelete = () => {
    this.setState({
      open: false,
    });
    try {
      let data = {
        CallBackID: this.state.CallBackID,
      };
      api.post("callBack/deleteCallBackById", data).then((result) => {
        if (result) {
          this.hideLoader();
          cogoToast.success("Deleted Successfully");

          this.props.history.push({
            pathname: "/admin/CallBack",
            state: {
              filterlist: this.props.history.location.state.filterlist,
              sortlist: this.props.history.location.state.sortlist,
              statusList: this.props.history.location.state.statusList,
            },
          });
        } else {
          this.hideLoader();
          cogoToast.error("Something went wrong");
        }
      });
    } catch (err) {
      this.hideLoader();
      cogoToast.error("Something Went Wrong");
    }
  };

  showLoader = () => {
    this.setState({ Loading: true });
  };

  hideLoader = () => {
    this.setState({ Loading: false });
  };

  handleSearchBack = () => {
    if (this.props.history.location.state.searchData) {
      window.location.href =
        "/admin/Search/" + this.props.history.location.state.searchData;
    } else {
      cogoToast.error("Search data not found.");
    }
  };

  render() {
    const {
      CustomerName,
      EmailAddress,
      TimetoCall,
      ContactNumber,
      CreatedDate,
      TrackingNumber,
      selectedRequestStatus,
      selectedWorkingOnRequest,
      WriteAccess,
      DeleteAccess,
    } = this.state;
    const requeststatus = {
      options: this.state.requestStatus.map((option) => option.label),
    };
    const workingonrequest = this.state.WorkingonRequest.map(
      (WorkingonRequest) => {
        return {
          value: WorkingonRequest.PersonID,
          label: WorkingonRequest.Name,
        };
      }
    );
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
                <HeadsetMic />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">
                Edit Call Back
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6}>
                  <Autocomplete
                    {...requeststatus}
                    id="Request Status"
                    value={selectedRequestStatus}
                    RequestStatus
                    onChange={(event, value) =>
                      this.requestChange(event, value, "requeststatus")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Status"
                        margin="normal"
                        fullWidth
                      />
                    )}
                  />

                  <CustomInput
                    labelText="Customer Name"
                    id="customername"
                    error={this.state.CustomerNameErr}
                    helperText={this.state.CustomerNameHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: CustomerName,
                      onChange: (event) =>
                        this.handleChange(event, "customername"),
                      onFocus: () =>
                        this.setState({
                          CustomerNameCheck: false,
                          CustomerNameErr: false,
                          CustomerNameHelperText: "",
                        }),
                      onBlur: (event) =>
                        this.handleChange(event, "customername"),
                      endAdornment:
                        this.state.CustomerNameCheck !== true ? (
                          <Icon className={classes.User}>account_circle</Icon>
                        ) : this.state.CustomerNameErr ? (
                          <InputAdornment position="end">
                            <CloseIcon
                              style={{ color: red[500] }}
                              className={useStyles.danger}
                            />
                          </InputAdornment>
                        ) : (
                          <InputAdornment position="end">
                            {" "}
                            <DoneIcon
                              style={{ color: green[500] }}
                              className={useStyles.success}
                            />
                          </InputAdornment>
                        ),
                    }}
                  />
                  <CustomInput
                    labelText="Email Address *"
                    id="registeremail"
                    error={this.state.emailaddressErr}
                    helperText={this.state.emailaddressHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      onChange: (event) =>
                        this.handleOnChange(event, "emailaddress"),
                      value: EmailAddress,
                      onFocus: () =>
                        this.setState({
                          emailaddressCheck: false,
                          emailaddressErr: false,
                          emailaddressHelperText: "",
                        }),
                      onBlur: (event) =>
                        this.handleChange(event, "emailaddress"),
                      endAdornment:
                        this.state.emailaddressCheck !== true ? (
                          <Icon className={classes.inputAdornmentIcon}>
                            email
                          </Icon>
                        ) : this.state.emailaddressErr ? (
                          <InputAdornment position="end">
                            <CloseIcon
                              style={{ color: red[500] }}
                              className={useStyles.danger}
                            />
                          </InputAdornment>
                        ) : (
                          <InputAdornment position="end">
                            {" "}
                            <DoneIcon
                              style={{ color: green[500] }}
                              className={useStyles.success}
                            />
                          </InputAdornment>
                        ),
                    }}
                  />
                  <CustomInput
                    labelText="Time To Call"
                    id="timetocall"
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      disabled: true,
                      value: TimetoCall,
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          className={classes.inputAdornment}
                        >
                          <Icon className={classes.inputAdornmentIcon}>
                            calendar_today
                          </Icon>
                        </InputAdornment>
                      ),
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <Autocomplete
                    options={workingonrequest}
                    id="WorkingonRequest"
                    getOptionLabel={(option) =>
                      option.label ? option.label : option
                    }
                    onChange={(event, value) =>
                      this.requestChange(event, value, "workingonrequest")
                    }
                    value={selectedWorkingOnRequest}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Managed By"
                        margin="normal"
                        fullWidth
                      />
                    )}
                  />
                  <CustomInput
                    labelText="Contact Number"
                    id="contactnumber"
                    error={this.state.contactnumberErr}
                    helperText={this.state.contactnumberHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      onChange: (event) =>
                        this.handleOnChange(event, "contactnumber"),
                      onFocus: () =>
                        this.setState({
                          contactnumberCheck: false,
                          contactnumberErr: false,
                          contactnumberHelperText: "",
                        }),
                      onBlur: (event) =>
                        this.handleChange(event, "contactnumber"),
                      value: ContactNumber,
                      endAdornment:
                        this.state.contactnumberCheck !== true ? (
                          <Icon className={classes.inputAdornmentIcon}>
                            phone
                          </Icon>
                        ) : this.state.contactnumberErr ? (
                          <InputAdornment position="end">
                            <CloseIcon
                              style={{ color: red[500] }}
                              className={useStyles.danger}
                            />
                          </InputAdornment>
                        ) : (
                          <InputAdornment position="end">
                            {" "}
                            <DoneIcon
                              style={{ color: green[500] }}
                              className={useStyles.success}
                            />
                          </InputAdornment>
                        ),
                    }}
                  />
                  <CustomInput
                    labelText="Date"
                    id="datetime"
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      disabled: true,
                      value: moment(CreatedDate).format(
                        CommonConfig.dateFormat.dateTime
                      ),
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          className={classes.inputAdornment}
                        >
                          <Icon className={classes.inputAdornmentIcon}>
                            calendar_today
                          </Icon>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <CustomInput
                    labelText="Tracking Number"
                    id="trackingnumber"
                    formControlProps={{ fullWidth: true }}
                    error={this.state.trackingnumberErr}
                    helperText={this.state.trackingnumberHelperText}
                    inputProps={{
                      value: TrackingNumber,
                      onChange: (event) =>
                        this.handleChange(event, "trackingnumber"),
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          className={classes.inputAdornment}
                        >
                          <Icon className={classes.inputAdornmentIcon}>
                            local_shipping
                          </Icon>
                        </InputAdornment>
                      ),
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
          <Card>
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <Note />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">Notes</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <div className="package-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Comments</th>
                          <th>Attachment</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>{this.viewNotes()}</tbody>
                    </table>
                  </div>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
          <div className="shipment-submit">
            <div className="left">
              {DeleteAccess === 1 ? (
                <Button color="danger" onClick={this.handleClickOpen}>
                  Delete
                </Button>
              ) : null}
            </div>
            <div className="center">
              {this.props.history.location.state.searchData ? (
                <Button
                  onClick={() => this.handleSearchBack()}
                  color="secondary"
                >
                  Back To Search
                </Button>
              ) : null}
            </div>
            <div className="right">
              {WriteAccess === 1 ? (
                <>
                  <Button color="rose" onClick={() => this.saveCallBack(false)}>
                    Save
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => this.saveCallBack(true)}
                  >
                    Save & Exit
                  </Button>
                </>
              ) : null}
              <Button color="secondary" onClick={this.cancelCallback}>
                Cancel
              </Button>
            </div>
          </div>
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
        </GridItem>
      </GridContainer>
    );
  }
}
export default EditCallBack;
