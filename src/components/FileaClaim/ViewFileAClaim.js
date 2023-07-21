import React, { Component } from "react";
import HeadsetMic from "@material-ui/icons/HeadsetMic";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import Select from "@material-ui/core/Select";
import CustomInput from "components/CustomInput/CustomInput.js";
import Icon from "@material-ui/core/Icon";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import SimpleBackdrop from "../../utils/general";
import api from "../../utils/apiClient";
import { fileBase } from "../../utils/config";
import TextField from "@material-ui/core/TextField";
import cogoToast from "cogo-toast";
import { CommonConfig } from "../../utils/constant";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ReactDropzone from "react-dropzone";
import moment from "moment";
import momentTimezone from "moment-timezone";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/PriorityHigh";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";

class ViewFileAClaim extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UserType: "",
      Comments: "",
      TrackingNumber: "",
      DesiredResolution: "",
      ClaimType: "",
      Path: [],

      ReadAccess: 0,
      WriteAccess: 0,
      DeleteAccess: 0,
      Loading: false,
      closeDialog: false,
      dialog: false,
      DocumentList: [],
      AbsolutePath: "",

      ManagedBy: "",
      managedbyErr: false,
      managedbyHelperText: "",
      managedby: [],

      Status: "",
      statusErr: false,
      statusHelperText: "",
      status: [],

      open: false,
      close: false,
      loggedUser: 0,
      notes: [],
      fileObj: [],
      fileArray: [],
      attachmentArray: [],
      ClaimAddedby: "",
      noteErr: false,
      personType: [],
      claimType: [],
    };
  }

  async componentDidMount() {
    await this.stringMapAPI();
    await this.persontypeList();
    await this.setState({
      ReadAccess: CommonConfig.getUserAccess("File a Claim").ReadAccess,
      WriteAccess: CommonConfig.getUserAccess("File a Claim").WriteAccess,
      DeleteAccess: CommonConfig.getUserAccess("File a Claim").DeleteAccess,
      loggedUser: CommonConfig.loggedInUserData().PersonID,
    });
    await this.getManagedby();
    await this.stringMapstatus();
    // await this.GetClaimDetailsById();
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClickCancel = () => {
    this.setState({ close: true, open: false });
  };

  persontypeList = () => {
    let data = {
      stringMapType: "CLAIMPERSONTYPE",
    };
    api
      .post("stringMap/getstringMap", data)
      .then((result) => {
        if (result.success) {
          this.setState({ personType: result.data });
        }
      })
      .catch((err) => {
        cogoToast.error("Something Went Wrong 5");
      });
  };

  stringMapAPI = () => {
    let data = { stringMapType: "CLAIMTYPE" };

    api
      .post("stringMap/getstringMap", data)
      .then((result) => {
        if (result.success) {
          this.setState({ claimType: result.data });
        }
      })
      .catch((err) => {
        cogoToast.error("Something Went Wrong");
      });
  };

  stringMapstatus = () => {
    let data = {
      stringMapType: "WEBFORMSTATUS",
    };

    api.post("stringMap/getstringMap", data).then((result) => {
      if (result.success) {
        this.setState({ status: result.data });
      }
    });
  };

  getManagedby = () => {
    api.get("claim/getManageClaimUser").then((result) => {
      if (result.success) {
        this.setState({ managedby: result.Data });
      } else {
        cogoToast.error("Something went wrong");
      }
      this.GetClaimDetailsById();
    });
  };

  GetClaimDetailsById() {
    var data = { ClaimID: this.props.match.params.id };
    try {
      this.setState({ Loading: true });
      api
        .post("claim/GetClaimDetailsById", data)
        .then((result) => {
          if (result.data) {
            this.setState({ Loading: false });
            var Workingon = this.state.managedby.find(
              (x) => x.PersonID === result.data.ManagedBy
            );
            var claim = this.state.status.find(
              (x) => x.StringMapName === result.data.ClaimStatus
            );
            var selectedmanagedby = {};
            var claimStatus = {};

            if (Workingon !== "" && Workingon !== undefined) {
              selectedmanagedby = {
                value: Workingon.PersonID,
                label: Workingon.Name,
              };
            }
            if (claim !== "" && claim !== undefined) {
              claimStatus = {
                value: claim.StringMapName,
                label: claim.Description,
              };
            }
            if (result.data.Notes.length > 0) {
              var i = 0;
              result.data.Notes.map((Obj) => {
                Obj.Index = i;
                i++;
                return Obj;
              });
              result.data.Notes.map((Obj) => {
                Obj.disabled = i;
                i++;
                return Obj;
              });
            }
            this.setState({
              UserType: result.data.ClaimPerson,
              Comments: result.data.Comments,
              TrackingNumber: result.data.TrackingNumber,
              DesiredResolution: result.data.DesiredResolution,
              ClaimType: result.data.TypeofClaim,
              ClaimAddedby: result.data.ClaimCreatedBy,
              ManagedBy: selectedmanagedby,
              Status: claimStatus,
              notes: result.data.Notes,
              DocumentList: result.data.DocumentList,
            });

            if (result.data.DocumentList.length) {
              this.setState({ Path: result.data.DocumentList });
            }
            this.handleAddNotesRow();
          } else {
            this.setState({ Loading: false });
            cogoToast.error("Something went wrong");
          }
        })
        .catch((err) => {
          this.setState({ Loading: false });
          cogoToast.error("Something went wrong");
        });
    } catch (err) {
      this.setState({ Loading: false });
      cogoToast.error("Something went wrong");
    }
  }

  deleteClaim = () => {
    var data = {
      claimID: this.props.match.params.id,
      Attachment: this.state.Path,
    };
    try {
      this.setState({ Loading: true });

      api
        .post("claim/deleteClaimByID/", data)
        .then((result) => {
          if (result.success) {
            this.setState({ Loading: false });
            cogoToast.success("Deleted Successfully");
            this.props.history.push({
              pathname: "/admin/FileaClaimList",
              state: {
                filterlist: this.props.history.location.state.filterlist,
                sortlist: this.props.history.location.state.sortlist,
                statusList: this.props.history.location.state.statusList,
              },
            });
          } else {
            this.setState({ Loading: false });
            cogoToast.error("Something went Wrong");
          }
        })
        .catch((err) => {
          this.setState({ Loading: false });
          cogoToast.error("Something went wrong");
        });
    } catch (err) {
      this.setState({ Loading: false });
      cogoToast.error("Something went wrong");
    }
  };

  cancelViewClaim = () => {
    this.props.history.push({
      pathname: "/admin/FileaClaimList",
      state: {
        filterlist: this.props.history.location.state.filterlist,
        sortlist: this.props.history.location.state.sortlist,
        statusList: this.props.history.location.state.statusList,
      },
    });
  };

  imageModal = (path) => {
    this.setState({
      dialog: true,
      closeDialog: true,
      AbsolutePath: path,
    });
  };

  handleCloseDialog = () => {
    this.setState({
      closeDialog: true,
      dialog: false,
    });
  };

  validate = () => {
    let IsValid = true;

    if (CommonConfig.isEmpty(this.state.ManagedBy)) {
      IsValid = false;
      this.setState({
        managedbyErr: true,
        managedbyHelperText: "Please select managed by",
      });
    }
    if (CommonConfig.isEmpty(this.state.Status)) {
      IsValid = false;
      this.setState({
        statusErr: true,
        statusHelperText: "Please select status",
      });
    }

    return IsValid;
  };

  handleSave = (redirect) => {
    if (this.validate()) {
      var finalNotes = this.state.notes.filter(
        (x) => x.NoteText !== "" && x.NoteText !== null
      );
      let data = {
        TrackingNumber: this.state.TrackingNumber,
        ClaimPerson: this.state.UserType,
        userid: CommonConfig.loggedInUserData().PersonID,
        DocumentList: this.state.Path,
        ClaimStatus: this.state.Status.value,
        TypeofClaim: this.state.ClaimType,
        Comments: this.state.Comments,
        NoteList: finalNotes,
        ClaimCreatedBy: this.state.ClaimAddedby,
        ClaimID: this.props.match.params.id,
        DesiredResolution: this.state.DesiredResolution,
        ManagedBy: this.state.ManagedBy.value,
        UpdatedBy: this.state.loggedUser,
      };

      var formData = new FormData();
      formData.append("data", JSON.stringify(data));
      if (this.state.attachmentArray.length) {
        this.state.attachmentArray.forEach((file) => {
          formData.append("Attachments", file);
        });
      }

      this.setState({ Loading: true });

      try {
        api
          .post("claim/addClaim", formData)
          .then((result) => {
            if (result.success) {
              this.setState({ Loading: false });
              cogoToast.success("Updated Successfully");
              if (redirect) {
                this.props.history.push({
                  pathname: "/admin/FileaClaimList",
                  state: {
                    filterlist: this.props.history.location.state.filterlist,
                    sortlist: this.props.history.location.state.sortlist,
                    statusList: this.props.history.location.state.statusList,
                  },
                });
              } else {
                this.GetClaimDetailsById();
              }
            } else {
              this.setState({ Loading: false });
              cogoToast.error("Something Went Wrong 3");
            }
          })
          .catch((err) => {
            this.setState({ Loading: false });
            cogoToast.error("Something went wrong 2");
          });
      } catch (err) {
        this.setState({ Loading: false });
        cogoToast.error("Something Went Wrong 1");
      }
    } else {
      cogoToast.error(
        "There were errors found.Please correct them and resubmit form."
      );
    }
  };

  deleteSelected = (event, file) => {
    var files = this.state.Path;
    var attachmentTemp = this.state.fileArray;
    var Index = files.indexOf(file);
    attachmentTemp.splice(file, 1);
    files[Index]["Status"] = "Inactive";
    this.setState({ Path: files });
  };

  deleteFile = (event, file) => {
    var files = this.state.Path;
    var arrTemp = this.state.attachmentArray;
    var attachmentTemp = this.state.fileArray;
    var Index = attachmentTemp.indexOf(file);
    attachmentTemp.splice(Index, 1);
    var fileIndex = files.findIndex((x) => x.AttachmentName === file.fileName);
    files[fileIndex]["Status"] = "Inactive";
    var arraryIndex = files.findIndex((x) => x.name === file.fileName);
    arrTemp.splice(arraryIndex, 1);
    this.setState({
      fileArray: attachmentTemp,
      Path: files,
      attachmentArray: arrTemp,
    });
  };

  stringTruncate = (filename) => {
    var maxLength = 15;
    if (filename.length > 15) {
      filename = filename.substring(0, maxLength) + "...";
      //filename = filename.substring(0 , Math.min(filename.length , filename.lastIndexOf(" "))) + "...";
    } else {
      filename = filename;
    }
    return filename;
  };

  claimType = () => {
    return this.state.claimType.map((content) => {
      return (
        <MenuItem value={content.StringMapKey}>
          {" "}
          {content.Description}{" "}
        </MenuItem>
      );
    });
  };

  personType = () => {
    return this.state.personType.map((content) => {
      return (
        <MenuItem value={content.StringMapKey}>
          {" "}
          {content.Description}{" "}
        </MenuItem>
      );
    });
  };

  filePreview = () => {
    return this.state.Path.filter(
      (x) => x.Status === "Active" && x.AttachmentID !== null
    ).map((Path) => {
      return (
        <div>
          <span className="img-box-outer">
            {Path.AttachmentType.includes("image") ? (
              <a
                href={
                  Path.AttachmentPath ===
                  "ClaimAttachment/" + Path.AttachmentName
                    ? fileBase + Path.AttachmentPath
                    : Path.AttachmentPath
                }
                rel="noopener noreferrer"
                target="_blank"
              >
                <img
                  alt="Preview"
                  src={
                    Path.AttachmentPath ===
                    "ClaimAttachment/" + Path.AttachmentName
                      ? fileBase + Path.AttachmentPath
                      : Path.AttachmentPath
                  }
                />
              </a>
            ) : (
              <a
                href={
                  Path.AttachmentPath ===
                  "ClaimAttachment/" + Path.AttachmentName
                    ? fileBase + Path.AttachmentPath
                    : Path.AttachmentPath
                }
                rel="noopener noreferrer"
                target="_blank"
              >
                <i className="material-icons">picture_as_pdf</i>
              </a>
            )}

            {this.state.DeleteAccess === 1 ? (
              <button
                className="delete-image"
                onClick={(event) => this.deleteSelected(event, Path)}
              >
                <Icon>clear</Icon>
              </button>
            ) : null}
          </span>
          <p>{this.stringTruncate(Path.AttachmentName)}</p>
        </div>
      );
    });
  };

  requestChange(event, value, type) {
    if (type === "status") {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          Status: value,
          statusErr: true,
          statusHelperText: "Please Select any one option",
        });
      } else {
        this.setState({
          Status: value,
          statusErr: false,
          statusHelperText: "",
        });
      }
    } else if (type === "managedby") {
      if (CommonConfig.isEmpty(event.target.value)) {
        this.setState({
          ManagedBy: value,
          managedbyErr: true,
          managedbyHelperText: "Please Select any one option",
        });
      } else {
        this.setState({
          ManagedBy: value,
          managedbyErr: false,
          managedbyHelperText: "",
        });
      }
    }
  }

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
        UpdatedOn: moment(todayDate).format(CommonConfig.dateFormat.dateTime),
        CreatedBy: CommonConfig.loggedInUserData().PersonID,
        NoteCreatedBy: CommonConfig.loggedInUserData().Name,
        NoteID: null,
        AddedBy: CommonConfig.loggedInUserData().Name,
        Index: this.state.notes.length + 1,
      };

      this.setState({ notes: [...this.state.notes, note] });
    } else {
      cogoToast.error("Please fill above notes first");
    }
  };

  handleChangeNotes = (event, idx) => {
    const { value } = event.target;
    const notes = this.state.notes;
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
    const removeNotes = this.state.notes;
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
                    value={notes.NoteText}
                    onChange={(event) =>
                      this.handleChangeNotes(event, notes.Index)
                    }
                  ></textarea>
                </div>
              )}
            </td>

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
              <Tooltip title={notes.NoteCreatedBy} arrow>
                <Button className="Plus-btn info-icon" justIcon color="twitter">
                  <InfoIcon />
                </Button>
              </Tooltip>
            </td>
          </tr>
        );
      });
  };

  acceptedFiles = (file, event) => {
    var filearray = [];

    this.setState({ fileObj: filearray });

    let arrobj = {
      AttachmentName: file[0].name,
      AttachmentType: file[0].type,
      Status: "Active",
      AttachmentID: null,
      DateTime: new Date().getTime(),
      SortOrder: 1,
    };
    this.state.Path.push(arrobj);

    this.setState({
      attachmentArray: [...this.state.attachmentArray, file[0]],
    });

    var fileType = file[0].type;

    this.state.fileObj.push(file);

    if (fileType.startsWith("image/")) {
      for (let i = 0; i < this.state.fileObj.length; i++) {
        var obj = {
          url: URL.createObjectURL(this.state.fileObj[i][0]),
          fileName: this.state.fileObj[i][0].name,
        };
      }

      this.setState({ fileArray: [...this.state.fileArray, obj] });
    } else {
      var obj = {
        url: this.state.fileObj,
        fileName: file[0].name,
      };

      this.setState({ fileArray: [...this.state.fileArray, obj] });
    }
  };

  preview = () => {
    return this.state.fileArray.map((file) => {
      return (
        <div>
          <span className="img-box-outer">
            {file.url.includes("blob") ? (
              <img alt="Preview" key={file.preview} src={file.url} />
            ) : (
              <Icon>picture_as_pdf</Icon>
            )}
            <button
              className="delete-image"
              onClick={(event) => this.deleteFile(event, file)}
            >
              {" "}
              <Icon> clear </Icon>{" "}
            </button>
          </span>
          <p> {this.stringTruncate(file.fileName)}</p>
        </div>
      );
    });
  };

  onPreviewDrop = (e) => {};

  handleSearchBack = () => {
    if (this.props.history.location.state.searchData) {
      window.location.href =
        "/admin/Search/" + this.props.history.location.state.searchData;
    } else {
      cogoToast.error("Search data not found.");
    }
  };

  selectChange = (event) => {
    const { name, value } = event.target;

    if (name === "persontype") {
      this.setState({ personTypeCheck: true });
      if (CommonConfig.isEmpty(value)) {
        this.setState({
          UserType: value,
          personTypeErr: true,
          personTypeHelperText: "Please Select any one option",
        });
      } else {
        this.setState({
          UserType: value,
          personTypeErr: false,
          personTypeHelperText: "",
        });
      }
    } else if (name === "claimtype") {
      this.setState({ claimTypeCheck: true });
      if (CommonConfig.isEmpty(value)) {
        this.setState({
          ClaimType: value,
          claimTypeErr: true,
          claimTypeHelperText: "Please Select any one option",
        });
      } else {
        this.setState({
          ClaimType: value,
          claimTypeErr: false,
          claimTypeHelperText: "",
        });
      }
    }
  };

  inputChange = (e, type) => {
    if (type === "TrackingNumber")
      this.setState({ TrackingNumber: e.target.value });
  };

  render() {
    const {
      UserType,
      ClaimType,
      TrackingNumber,
      ClaimAddedby,
      WriteAccess,
      DeleteAccess,
    } = this.state;
    const claimStatus = this.state.status.map((status) => {
      return { value: status.StringMapName, label: status.Description };
    });
    const managedBY = this.state.managedby.map((WorkingonRequest) => {
      return { value: WorkingonRequest.PersonID, label: WorkingonRequest.Name };
    });
    return (
      <GridContainer justify="center" className="EditVendor-mian-outer">
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}

        <GridItem xs={12} sm={12}>
          <Card>
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <HeadsetMic />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">View Claim</h4>
            </CardHeader>
            <CardBody>
              <GridContainer justify="center">
                <GridItem xs={12} sm={4} md={4}>
                  {this.state.DeleteAccess === 1 ? (
                    <div className="select-spl">
                      <FormControl fullWidth error={this.state.personTypeErr}>
                        <InputLabel htmlFor="selectperson">
                          Claim Submitted By
                        </InputLabel>
                        <Select
                          fullWidth={true}
                          id="persontype"
                          name="persontype"
                          value={this.state.UserType}
                          onChange={(event) => this.selectChange(event)}
                        >
                          {this.personType()}
                        </Select>
                        <FormHelperText>
                          {this.state.personTypeHelperText}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  ) : (
                    <CustomInput
                      labelText="Are you Select-one"
                      formControlProps={{ fullWidth: true }}
                      inputProps={{ disabled: true, value: UserType }}
                      id="claimsubmittedby"
                    />
                  )}
                </GridItem>

                <GridItem xs={12} sm={4} md={4}>
                  <CustomInput
                    labelText="Tracking Number"
                    id="trackingnumber"
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: TrackingNumber,
                      disabled: this.state.DeleteAccess === 1 ? false : true,
                      onChange: (event) =>
                        this.inputChange(event, "TrackingNumber"),
                    }}
                  />
                </GridItem>

                <GridItem xs={12} sm={4} md={4}>
                  {this.state.DeleteAccess === 1 ? (
                    <div className="select-spl">
                      <FormControl fullWidth error={this.state.claimTypeErr}>
                        <InputLabel htmlFor="selectclaim">
                          Type Of Claim
                        </InputLabel>
                        <Select
                          fullWidth={true}
                          id="claimtype"
                          name="claimtype"
                          value={this.state.ClaimType}
                          onChange={(event) => this.selectChange(event)}
                        >
                          {this.claimType()}
                        </Select>
                        <FormHelperText>
                          {this.state.claimTypeHelperText}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  ) : (
                    <CustomInput
                      labelText="Type Of Claim"
                      id="typeofclaim"
                      formControlProps={{ fullWidth: true }}
                      inputProps={{ disabled: true, value: ClaimType }}
                    />
                  )}
                </GridItem>

                <GridItem xs={12} sm={4} md={4}>
                  <Autocomplete
                    options={managedBY}
                    getOptionLabel={(option) =>
                      option.label ? option.label : option
                    }
                    id="managedby"
                    value={this.state.ManagedBy}
                    onChange={(event, value) =>
                      this.requestChange(event, value, "managedby")
                    }
                    onFocus={() =>
                      this.setState({
                        managedbyErr: false,
                        managedbyHelperText: "",
                      })
                    }
                    ManagedBy
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        label="Managed By"
                        error={this.state.managedbyErr}
                        helperText={this.state.managedbyHelperText}
                        fullWidth
                      />
                    )}
                  />
                </GridItem>

                <GridItem xs={12} sm={4} md={4}>
                  <Autocomplete
                    options={claimStatus}
                    getOptionLabel={(option) =>
                      option.label ? option.label : option
                    }
                    id="status"
                    value={this.state.Status}
                    onChange={(event, value) =>
                      this.requestChange(event, value, "status")
                    }
                    onFocus={(event) =>
                      this.setState({ statusErr: false, statusHelperText: "" })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        label="Status"
                        error={this.state.statusErr}
                        helperText={this.state.statusHelperText}
                        fullWidth
                      />
                    )}
                  />
                </GridItem>

                <GridItem xs={12} sm={4} md={4}>
                  <CustomInput
                    labelText="Added By"
                    id="addedby"
                    formControlProps={{ fullWidth: true }}
                    inputProps={{ disabled: true, value: ClaimAddedby }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <div className="normal-textarea">
                    <label>Comment</label>
                    <textarea
                      id="comments"
                      value={this.state.Comments}
                      rows={3}
                      disabled
                    />
                  </div>
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <div className="normal-textarea">
                    <label>Desired Resolution</label>
                    <textarea
                      id="desiredresolution"
                      rows={3}
                      value={this.state.DesiredResolution}
                      disabled
                    />
                  </div>
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <div className="img-uploaded">{this.filePreview()}</div>
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <ReactDropzone
                    onDropAccepted={(file, event) =>
                      this.acceptedFiles(file, event)
                    }
                    accept="image/*,.xls,.xlsx,.doc,.docx,.odt,.pdf,.png,.pptx,.ppt,.rtf"
                    onDrop={(e) => this.onPreviewDrop(e)}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <section className="dropzone-outer">
                        <div className="img-uploaded">{this.preview()}</div>
                        <div {...getRootProps()} className="dropzone-inner">
                          <input {...getInputProps()} />
                          <p>
                            {" "}
                            <span>Select File(s)...</span>
                          </p>
                          <small>
                            Only this extensions are supported
                            .bmp,.gif,.jpeg,.jpg,.tex,.xls,.xlsx,.doc,.docx,.odt,.pdf,.png,.pptx,.ppt,.rtf
                          </small>
                        </div>
                      </section>
                    )}
                  </ReactDropzone>
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  {this.state.notes.filter((x) => x.Status === "Active")
                    .length ? (
                    <div className="package-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Comments</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>{this.viewNotes()}</tbody>
                      </table>
                    </div>
                  ) : null}
                </GridItem>
              </GridContainer>

              <GridContainer justify="center">
                <div>
                  <Dialog
                    open={this.state.open}
                    onClose={this.state.close}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {" "}
                      "Confirm Delete"{" "}
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
                      <Button
                        onClick={this.deleteClaim}
                        color="primary"
                        autoFocus
                      >
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              </GridContainer>
            </CardBody>
          </Card>

          <div className="shipment-submit">
            <div className="left">
              {DeleteAccess === 1 ? (
                <Button onClick={this.handleClickOpen} color="danger">
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
                  <Button onClick={() => this.handleSave(false)} color="rose">
                    Save
                  </Button>
                  <Button onClick={() => this.handleSave(true)} color="primary">
                    Save & Exit
                  </Button>
                </>
              ) : null}

              <Button color="secondary" onClick={this.cancelViewClaim}>
                Cancel
              </Button>
            </div>
          </div>
        </GridItem>
      </GridContainer>
    );
  }
}
export default ViewFileAClaim;
