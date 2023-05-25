import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import HeadsetMic from "@material-ui/icons/HeadsetMic";
import DeleteIcon from "@material-ui/icons/Delete";
import Note from "@material-ui/icons/Assessment";
import GridContainer from "components/Grid/GridContainer.js";
import { FormHelperText, InputLabel } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Icon from "@material-ui/core/Icon";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import Datetime from "react-datetime";
import CardHeader from "components/Card/CardHeader.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import moment from "moment";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import TextField from "@material-ui/core/TextField";
import SimpleBackdrop from "../../../utils/general";
import { CommonConfig } from "../../../utils/constant";
import api from "../../../utils/apiClient";
import { fileBase } from "../../../utils/config";
import cogoToast from "cogo-toast";
import FormControl from "@material-ui/core/FormControl";
import ReactTable from "react-table";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
};
const useStyles = () => makeStyles(styles);
const classes = useStyles();

class addContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ContainerName: "",
      containernameErr: false,
      containernameHelperText: "",

      ContainerSize: "",
      ContainerSizeList: [],
      containersizeErr: false,
      containersizeHelperText: "",

      CurrentStatus: "",
      CurrentStatusList: [],
      currentstatusErr: false,
      currentstatusHelperText: "",

      ContainerStatus: "",
      containerstatusErr: false,
      containerstatusHelperText: "",

      ContainerNumber: "",
      containernumberErr: false,
      containernumberHelperText: "",

      SealNumber: "",
      sealnumberErr: false,
      sealnumberHelperText: "",

      BookingNumber: "",
      bookingnumberErr: false,
      bookingnumberHelperText: "",

      BOLNumber: "",
      BOLnumberErr: false,
      BOLnumberHelperText: "",

      PointOfOrigin: "",
      pointoforiginErr: false,
      pointoforiginHelperText: "",

      PortOfLoading: "",
      portofloadingErr: false,
      portofloadingHelperText: "",

      PortOfUnloading: "",
      portofunloadingErr: false,
      portofunloadingHelperText: "",

      PlaceOfDeliveryByOnCarrier: "",
      placeofdeliveryErr: false,
      placeofdeliveryHelperText: "",

      VesselNumber: "",
      vesselnumberErr: false,
      vesselnumberHelperText: "",

      HBLDate: "",
      hbldateErr: false,
      hbldateHelperText: "",

      LoadDate: "",
      loaddateErr: false,
      loaddateHelperText: "",

      SailingDate: "",
      sailingdateErr: false,
      sailingdateHelperText: "",

      ArrivalDate: "",
      arrivaldateErr: false,
      arrivaldateHelperText: "",

      FreightForwarder: "",
      FreightForwarderList: [],
      freightforwarderErr: false,
      freightforwarderHelperText: "",

      Carrier: "",
      CarrierList: [],
      carrierErr: false,
      carrierHelperText: "",

      NotifyParty: "",
      NotifyPartyList: [],
      notifypartyErr: false,
      notifypartyHelperText: "",

      CustomsBroker: "",
      CustomsBrokerList: [],
      customsbrokerErr: false,
      customsbrokerHelperText: "",
      notes: [],
      Attachments: [],
      DocumentList: [],
      AttachmentList: [],
      Access: [],
      CreatedBy: "",
      CreatedOn: "",
      objAttachment: {
        Index: 0,
        FileName: "",
        Status: "Active",
        DocumentCreatedOn: moment().format(CommonConfig.dateFormat.dateOnly),
        DocumentCreatedBy: CommonConfig.loggedInUserData().Name,
      },
    };
  }

  componentDidMount() {
    this.stringMapSize();
    this.stringmapStatus();
    this.vendorList();
    this.handleAddNotesRow();
    var currentDate = new Date();
    this.setState({
      Access: CommonConfig.getUserAccess("Container Management"),
      CreatedBy: CommonConfig.loggedInUserData().Name,
      CreatedOn: moment(currentDate).format(CommonConfig.dateFormat.dateOnly),
      Attachments: [this.state.objAttachment],
    });
  }
  stringmapStatus = () => {
    try {
      let data = {
        stringMapType: "CONTAINERSTATUS",
      };
      api.post("stringMap/getStringMap", data).then((result) => {
        if (result.success) {
          this.setState({ CurrentStatusList: result.data });
        } else {
          cogoToast.error("Something went wrong");
        }
      });
    } catch (err) {
      cogoToast.error("Something Went Wrong");
    }
  };
  vendorList = () => {
    try {
      let data = {
        serviceName: "Shipping Lines",
      };
      api.post("vendor/getVendorListByServiceName", data).then((res) => {
        if (res.success) {
          this.setState({ CarrierList: res.data });
        } else {
          cogoToast.error("Something went wrong");
        }
      });
    } catch (err) {}
    try {
      let data = {
        serviceName: "Customs Broker",
      };
      api.post("vendor/getVendorListByServiceName", data).then((res) => {
        if (res.success) {
          this.setState({ CustomsBrokerList: res.data });
        } else {
          cogoToast.error("Something went wrong");
        }
      });
    } catch (err) {}
    try {
      let data = {
        serviceName: "Freight Forwarder",
      };
      api.post("vendor/getVendorListByServiceName", data).then((res) => {
        if (res.success) {
          this.setState({
            FreightForwarderList: res.data,
            NotifyPartyList: res.data,
          });
        } else {
          cogoToast.error("Something went wrong");
        }
      });
    } catch (err) {}
  };

  stringmapStatus = () => {
    try {
      let data = {
        stringMapType: "CONTAINERSTATUS",
      };
      api.post("stringMap/getStringMap", data).then((result) => {
        if (result.success) {
          this.setState({ CurrentStatusList: result.data });
        } else {
          cogoToast.error("Something went wrong");
        }
      });
    } catch (err) {
      cogoToast.error("Something Went Wrong");
    }
  };
  stringMapSize = () => {
    try {
      let data = {
        stringMapType: "CONTAINERSIZE",
      };
      api.post("stringMap/getStringMap", data).then((result) => {
        if (result.success) {
          this.setState({ ContainerSizeList: result.data });
        } else {
          cogoToast.error("Something went wrong");
        }
      });
    } catch (err) {
      cogoToast.error("Something Went Wrong");
    }
  };
  handleChange = (event, type) => {
    let Val = event.target.value;
    if (type === "containername") {
      this.setState({ ContainerName: Val });
    } else if (type === "containernumber") {
      this.setState({ ContainerNumber: Val });
    } else if (type === "sealnumber") {
      this.setState({ SealNumber: Val });
    } else if (type === "bookingnumber") {
      this.setState({ BookingNumber: Val });
    } else if (type === "bolnumber") {
      this.setState({ BOLNumber: Val });
    } else if (type === "pointoforigin") {
      this.setState({ PointOfOrigin: Val });
    } else if (type === "portofloading") {
      this.setState({ PortOfLoading: Val });
    } else if (type === "portofunloading") {
      this.setState({ PortOfUnloading: Val });
    } else if (type === "placeofdelivery") {
      this.setState({ PlaceOfDeliveryByOnCarrier: Val });
    } else if (type === "vesselnumber") {
      this.setState({ VesselNumber: Val });
    }
  };
  validate = () => {
    let IsFormValid = true;

    if (CommonConfig.isEmpty(this.state.ContainerName)) {
      this.setState({
        containernameErr: true,
        containernameHelperText: "Please enter container name",
      });
      IsFormValid = false;
    }

    if (CommonConfig.isEmpty(this.state.ContainerSize)) {
      this.setState({
        containersizeErr: true,
        containersizeHelperText: "Please enter container size",
      });
      IsFormValid = false;
    }

    if (CommonConfig.isEmpty(this.state.ContainerStatus)) {
      this.setState({
        containerstatusErr: true,
        containerstatusHelperText: "Please enter container status",
      });
      IsFormValid = false;
    }

    if (CommonConfig.isEmpty(this.state.CurrentStatus)) {
      this.setState({
        currentstatusErr: true,
        currentstatusHelperText: "Please enter current status",
      });
      IsFormValid = false;
    }
    return IsFormValid;
  };
  handleBlur = (event, type) => {
    let Val = event.target.value;

    if (type === "containername") {
      if (CommonConfig.isEmpty(this.state.ContainerName)) {
        this.setState({
          ContainerName: Val,
          containernameErr: true,
          containernameHelperText: "Please enter container name",
        });
      } else {
        this.setState({
          ContainerName: Val,
          containernameErr: false,
          containernameHelperText: "",
        });
      }
    } else if (type === "containersize") {
      if (CommonConfig.isEmpty(this.state.ContainerSize)) {
        this.setState({
          ContainerSize: Val,
          containersizeErr: true,
          containersizeHelperText: "Please enter container size",
        });
      } else {
        this.setState({
          ContainerName: Val,
          containersizeErr: false,
          containersizeHelperText: "",
        });
      }
    } else if (type === "currentstatus") {
      if (CommonConfig.isEmpty(this.state.CurrentStatus)) {
        this.setState({
          CurrentStatus: Val,
          currentstatusErr: true,
          currentstatusHelperText: "Please enter current status",
        });
      } else {
        this.setState({
          CurrentStatus: Val,
          currentstatusErr: false,
          currentstatusHelperText: "",
        });
      }
    } else if (type === "containerstatus") {
      if (CommonConfig.isEmpty(this.state.ContainerStatus)) {
        debugger;
        console.log("logactive", Val);
        this.setState({
          ContainerStatus: Val,
          containerstatusErr: true,
          containerstatusHelperText: "Please enter status",
        });
      } else {
        debugger;
        this.setState({
          ContainerStatus: Val,
          containerstatusErr: false,
          containerstatusHelperText: "",
        });
        console.log("container active =", this.state.ContainerStatus);
      }
    }
  };

  hideLoader = () => {
    this.setState({ Loading: false });
  };

  showLoader = () => {
    this.setState({ Loading: true });
  };

  handleSubmit = () => {
    if (this.validate()) {
      var finalAttachment = [];
      for (var i = 0; i < this.state.Attachments.length; i++) {
        if (this.state.Attachments[i].hasOwnProperty("AttachmentName")) {
          finalAttachment.push(this.state.Attachments[i]);
        }
      }
      var FinalNotes = this.state.notes.filter(
        (x) => x.NoteText !== "" && x.NoteText !== null
      );
      debugger;
      console.log("handle submit", this.state.ContainerStatus);
      let data = {
        NoteList: FinalNotes,
        DocumentList: finalAttachment,
        userId: CommonConfig.loggedInUserData().PersonID,
        ContainerID: null,
        ContainerName: this.state.ContainerName,
        ContainerSize: this.state.ContainerSize,
        CurrentStatus: this.state.CurrentStatus,
        ContainerStatus: this.state.ContainerStatus,
        ContainerNumber: this.state.ContainerNumber,
        SealNumber: this.state.SealNumber,
        BookingNumber: this.state.BookingNumber,
        BOLNumber: this.state.BOLNumber,
        PointOfOrigin: this.state.PointOfOrigin,
        PortOfLoading: this.state.PortOfLoading,
        PortOfUnloading: this.state.PortOfUnloading,
        PlaceOfDeliveryByOnCarrier: this.state.PlaceOfDeliveryByOnCarrier,
        VesselNumber: this.state.VesselNumber,
        HBLDate:
          CommonConfig.isEmpty(this.state.HBLDate) != true
            ? moment(this.state.HBLDate)
                .format("YYYY-MM-DD HH:mm:ss")
                .toString()
            : null,
        LoadDate:
          CommonConfig.isEmpty(this.state.LoadDate) != true
            ? moment(this.state.LoadDate)
                .format("YYYY-MM-DD HH:mm:ss")
                .toString()
            : null,
        SailingDate:
          CommonConfig.isEmpty(this.state.SailingDate) != true
            ? moment(this.state.SailingDate)
                .format("YYYY-MM-DD HH:mm:ss")
                .toString()
            : null,
        ArrivalDate:
          CommonConfig.isEmpty(this.state.ArrivalDate) != true
            ? moment(this.state.ArrivalDate)
                .format("YYYY-MM-DD HH:mm:ss")
                .toString()
            : null,
        FreightForwarder: this.state.FreightForwarder,
        Carrier: this.state.Carrier,
        NotifyParty: this.state.NotifyParty,
        CustomsBroker: this.state.CustomsBroker,
      };
      console.log("hndledata", data.ContainerStatus);
      debugger;
      var formData = new FormData();
      formData.append("data", JSON.stringify(data));
      if (this.state.AttachmentList.length > 0) {
        this.state.AttachmentList.forEach((file) => {
          formData.append("Attachments", file);
        });
      }
      this.showLoader();
      api.post("container/addContainer/", formData).then((result) => {
        if (result.success) {
          this.hideLoader();
          cogoToast.success("Container Added Successfully");
          this.props.history.push({
            pathname: "/admin/Container",
          });
        } else {
          this.hideLoader();
          cogoToast.error("Something Went Wrong");
          this.props.history.push({
            pathname: "/admin/Container",
          });
        }
      });
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
        CreatedOn: moment(todayDate).format(CommonConfig.dateFormat.dateTime),
        CreatedBy: CommonConfig.loggedInUserData().PersonID,
        CreatedByNote: CommonConfig.loggedInUserData().Name,
        NoteID: null,
        Index: this.state.notes.length + 1,
      };
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

  handleNotesRemoveRow = (idx) => () => {
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
            <td>
              {moment(notes.CreatedOn).format(CommonConfig.dateFormat.dateTime)}
            </td>
            <td style={{ maxWidth: 600, margin: 0, height: 68, width: 600 }}>
              {notes.NoteID ? (
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
                    style={{ width: 582, margin: 0, height: 68 }}
                    value={notes.NoteText}
                    onChange={this.handleChangeNotes(notes.Index)}
                  ></textarea>
                </div>
              )}
            </td>
            <td>{notes.CreatedByNote}</td>
            <td>
              {" "}
              {this.state.Access.DeleteAccess === 1 ? (
                <DeleteIcon
                  onClick={this.handleNotesRemoveRow(notes.Index)}
                  disabled={this.state.notesDisabled}
                />
              ) : null}
            </td>
          </tr>
        );
      });
  };

  cancelContainer = () => {
    this.props.history.push({
      pathname: "/admin/Container",
    });
  };

  handleDate = (date, type) => {
    if (type === "hbl") {
      this.setState({
        HBLDate: date,
        hbldateErr: false,
        hbldateHelperText: "",
      });
    } else if (type === "load") {
      this.setState({
        LoadDate: date,
        loaddateErr: false,
        loaddateHelperText: "",
      });
    } else if (type === "sailing") {
      this.setState({
        SailingDate: date,
        sailingdateErr: false,
        sailingdateHelperText: "",
      });
    } else if (type === "arrival") {
      this.setState({
        ArrivalDate: date,
        arrivaldateErr: false,
        arrivaldateHelperText: "",
      });
    }
  };

  selectChange = (e, type) => {
    let Val = e.target.value;
    if (type === "containersize") {
      this.setState({
        ContainerSize: Val,
        containersizeErr: false,
        containersizeHelperText: "",
      });
    } else if (type === "containerstatus") {
      this.setState({
        ContainerStatus: Val,
        containerstatusErr: false,
        containerstatusHelperText: "",
      });
    } else if (type === "currentstatus") {
      this.setState({
        CurrentStatus: Val,
        currentstatusErr: false,
        currentstatusHelperText: "",
      });
    } else if (type === "carrier") {
      this.setState({ Carrier: Val, carrierErr: false, carrierHelperText: "" });
    } else if (type === "customsbroker") {
      this.setState({
        CustomsBroker: Val,
        customsbrokerErr: false,
        carrierHelperText: "",
      });
    } else if (type === "notify") {
      this.setState({
        NotifyParty: Val,
        notifypartyErr: false,
        notifypartyHelperText: "",
      });
    } else if (type === "freight") {
      this.setState({
        FreightForwarder: Val,
        freightforwarderErr: false,
        freightforwarderHelperText: "",
      });
    }
  };

  containerSize = () => {
    return this.state.ContainerSizeList.map((container) => {
      return (
        <MenuItem value={container.StringMapKey}>
          {container.StringMapName}
        </MenuItem>
      );
    });
  };

  containerStatus = () => {
    return this.state.CurrentStatusList.map((container) => {
      return (
        <MenuItem value={container.StringMapKey}>
          {container.StringMapName}
        </MenuItem>
      );
    });
  };

  carrierList = () => {
    return this.state.CarrierList.map((container) => {
      return <MenuItem value={container.Name}>{container.Name}</MenuItem>;
    });
  };

  customsBroker = () => {
    return this.state.CustomsBrokerList.map((container) => {
      return <MenuItem value={container.Name}>{container.Name}</MenuItem>;
    });
  };
  freightForwarderMap = () => {
    return this.state.FreightForwarderList.map((container) => {
      return <MenuItem value={container.Name}>{container.Name}</MenuItem>;
    });
  };

  AddNewRowData = () => {
    let attachments = this.state.Attachments;
    let IsValid = true;
    for (let i = 0; i < this.state.Attachments.length; i++) {
      if (!attachments[i].hasOwnProperty("AttachmentName")) {
        IsValid = false;
      }
    }
    var AttachmentList = this.state.Attachments.filter(
      (x) => x.Status === "Active" && (x.FileName === "" || x.FileName === null)
    );
    if (AttachmentList.length === 0 && IsValid) {
      const objAttachment = {
        Index: AttachmentList.filter((x) => x.Status === "Active").length + 1,
        FileName: "",
        Status: "Active",
        DocumentCreatedOn: moment().format(CommonConfig.dateFormat.dateOnly),
        DocumentCreatedBy: CommonConfig.loggedInUserData().Name,
      };
      this.setState({
        Attachments: [...this.state.Attachments, objAttachment],
      });
    } else {
      cogoToast.error("Please fill above row first");
    }
  };

  handleDocumentChange = (e, record) => {
    var Index = this.state.Attachments.indexOf(record.original);
    this.state.Attachments[Index]["FileName"] = e.target.value;
    this.setState({ Attachments: [...this.state.Attachments] });
  };
  stringTruncate = (filename) => {
    var maxLength = 15;
    if (filename !== undefined && filename !== null) {
      if (filename.length > 15) {
        filename = filename.substring(0, maxLength) + "...";
      } else {
        filename = filename;
      }
    }
    return filename;
  };
  fileUpload = (event, record) => {
    const files = event.target.files[0];
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
    if(!allowedExtensions.exec(files.name)){
      cogoToast.error('Please upload file having extensions .jpeg/.jpg/.png/.pdf only.');
    }else{

      if (files.size > 5000000) {
        cogoToast.error("please upload the file maximum 5MB");
      } else {
        let AttachmentList = this.state.Attachments;
        let Index = this.state.Attachments.indexOf(record.original);
        let dateNow = new Date().getTime();
        AttachmentList[Index]["DateTime"] = dateNow;
        AttachmentList[Index]["AttachmentName"] = files.name;
        AttachmentList[Index]["AttachmentType"] = files.type;
        AttachmentList[Index]["AttachmentID"] = null;
        AttachmentList[Index]["Status"] = "Active";
        this.setState({
          Attachments: AttachmentList,
          AttachmentList: [...this.state.AttachmentList, files],
        });
      }
    }
    
  };
  handleDocumentDelete = (e, record) => {
    var AttachmentList = this.state.Attachments;
    var Index = AttachmentList.indexOf(record);
    AttachmentList[Index]["Status"] = "Inactive";
    this.setState({ Attachments: AttachmentList });
  };
  renderDocumentName = (cellInfo) => {
    return (
      <div className="table-input-slam">
        <CustomInput
          inputProps={{
            value: cellInfo.original.FileName,
            onChange: (event) => this.handleDocumentChange(event, cellInfo),
          }}
        />
      </div>
    );
  };
  render() {
    const columns = [
      {
        Header: "Document Name",
        accessor: "Name",
        width: 220,
        maxWidth: 220,
        Cell: this.renderDocumentName,
      },
      {
        Header: "CreatedOn",
        accessor: "DocumentCreatedOn",
        sortMethod: (a, b) => {
          return CommonConfig.dateSortMethod(a, b);
        },
        width: 220,
        maxWidth: 220,
      },
      {
        Header: "Added By",
        accessor: "DocumentCreatedBy",
        width: 280,
        maxWidth: 280,
      },
      {
        Header: "Attachment",
        accessor: "actions",
        width: 80,
        filterable: false,
        sortable: false,
        Cell: (record) => {
          return (
            <div>
              {record.original.AttachmentPath ? (
                <div>
                  <a
                    href={fileBase + record.original.AttachmentPath}
                    className="normal-btn sm-orange"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    View File
                  </a>
                </div>
              ) : this.state.Access.WriteAccess === 1 ? (
                <div>
                  <div className="custom-file-browse">
                    <span>Upload</span>
                    <input
                      type="file"
                      name="selectedfile"
                      id="file"
                      style={{ width: 140, border: 0 }}
                      onChange={(event) => this.fileUpload(event, record)}
                    />
                  </div>
                  <p>{this.stringTruncate(record.original.AttachmentName)}</p>
                </div>
              ) : null}
            </div>
          );
        },
      },
      {
        width: 100,
        filterable: false,
        sortable: false,
        Header: "Actions",
        Cell: (record) => {
          return record.original.AttachmentPath ? (
            <div className="align-right">
              {this.state.Access.DeleteAccess === 1 ? (
                <DeleteIcon
                  onClick={(e) => this.handleDocumentDelete(e, record.original)}
                />
              ) : null}
            </div>
          ) : this.state.Attachments.filter((x) => x.Status === "Active")
              .length ===
            record.index + 1 ? (
            <div className="align-right">
              <Icon color="secondary" onClick={() => this.AddNewRowData()}>
                add_circle
              </Icon>
            </div>
          ) : null;
        },
      },
    ];

    const {
      ContainerName,
      containernameErr,
      containernameHelperText,
      ContainerSize,
      containersizeErr,
      containersizeHelperText,
      CurrentStatus,
      currentstatusErr,
      currentstatusHelperText,
      ContainerStatus,
      containerstatusErr,
      containerstatusHelperText,
      ContainerNumber,
      containernumberErr,
      containernumberHelperText,
      SealNumber,
      sealnumberErr,
      sealnumberHelperText,
      BookingNumber,
      bookingnumberErr,
      bookingnumberHelperText,
      BOLNumber,
      BOLnumberErr,
      BOLnumberHelperText,
      PointOfOrigin,
      pointoforiginErr,
      pointoforiginHelperText,
      PortOfLoading,
      portofloadingErr,
      portofloadingHelperText,
      PortOfUnloading,
      portofunloadingErr,
      portofunloadingHelperText,
      PlaceOfDeliveryByOnCarrier,
      placeofdeliveryErr,
      placeofdeliveryHelperText,
      VesselNumber,
      vesselnumberErr,
      vesselnumberHelperText,
      HBLDate,
      hbldateErr,
      hbldateHelperText,
      CreatedOn,
      LoadDate,
      loaddateErr,
      loaddateHelperText,
      SailingDate,
      sailingdateErr,
      sailingdateHelperText,
      ArrivalDate,
      arrivaldateErr,
      arrivaldateHelperText,
      FreightForwarder,
      freightforwarderErr,
      freightforwarderHelperText,
      Carrier,
      carrierErr,
      carrierHelperText,
      CreatedBy,
      NotifyParty,
      notifypartyErr,
      notifypartyHelperText,
      CustomsBroker,
      customsbrokerErr,
      customsbrokerHelperText,
      Access,
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
                <HeadsetMic />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">
                Add Container
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <FormControl className="mb-0" fullWidth>
                    <CustomInput
                      labelText="Container Name"
                      id="containername"
                      formControlProps={{ fullWidth: true }}
                      error={containernameErr}
                      helperText={containernameHelperText}
                      inputProps={{
                        value: ContainerName,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className="requiredicon">perm_identity</Icon>
                          </InputAdornment>
                        ),
                        onChange: (event) =>
                          this.handleChange(event, "containername"),
                        onBlur: (event) =>
                          this.handleBlur(event, "containername"),
                        onFocus: () =>
                          this.setState({
                            containernameErr: false,
                            containernameHelperText: "",
                          }),
                      }}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <div className="select-spl">
                    <FormControl error={containersizeErr} fullWidth>
                      <InputLabel>Container Size</InputLabel>
                      <Select
                        value={ContainerSize}
                        onChange={(event) =>
                          this.selectChange(event, "containersize")
                        }
                        onFocus={() =>
                          this.setState({
                            containersizeErr: false,
                            containersizeHelperText: "",
                          })
                        }
                        inputProps={{
                          name: "containersize",
                          id: "containersize",
                        }}
                      >
                        {" "}
                        {this.containerSize()}
                      </Select>
                      <FormHelperText>{containersizeHelperText}</FormHelperText>
                    </FormControl>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <div className="select-spl">
                    <FormControl error={currentstatusErr} fullWidth>
                      <InputLabel>Current Status</InputLabel>
                      <Select
                        value={CurrentStatus}
                        onChange={(event) =>
                          this.selectChange(event, "currentstatus")
                        }
                        onFocus={() =>
                          this.setState({
                            currentstatusErr: false,
                            currentstatusHelperText: "",
                          })
                        }
                        inputProps={{
                          name: "currentstatus",
                          id: "currentstatus",
                        }}
                      >
                        {this.containerStatus()}
                      </Select>
                      <FormHelperText>{currentstatusHelperText}</FormHelperText>
                    </FormControl>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <FormControl className="mb-0" fullWidth>
                    <CustomInput
                      labelText="Container Number"
                      id="containernumber"
                      formControlProps={{ fullWidth: true }}
                      error={containernumberErr}
                      helperText={containernumberHelperText}
                      inputProps={{
                        value: ContainerNumber,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon>perm_identity</Icon>
                          </InputAdornment>
                        ),
                        onChange: (event) =>
                          this.handleChange(event, "containernumber"),
                        onBlur: (event) =>
                          this.handleBlur(event, "containernumber"),
                        onFocus: () =>
                          this.setState({
                            containernumberErr: false,
                            containernumberHelperText: "",
                          }),
                      }}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <FormControl className="mb-0" fullWidth>
                    <CustomInput
                      labelText="Vessel Number"
                      id="vesselnumber"
                      formControlProps={{ fullWidth: true }}
                      error={vesselnumberErr}
                      helperText={vesselnumberHelperText}
                      inputProps={{
                        value: VesselNumber,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon>perm_identity</Icon>
                          </InputAdornment>
                        ),
                        onChange: (event) =>
                          this.handleChange(event, "vesselnumber"),
                        onBlur: (event) =>
                          this.handleBlur(event, "vesselnumber"),
                        onFocus: () =>
                          this.setState({
                            vesselnumberErr: false,
                            vesselnumberHelperText: "",
                          }),
                      }}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <FormControl className="mb-0" fullWidth>
                    <CustomInput
                      labelText="Seal Number"
                      id="containernumber"
                      formControlProps={{ fullWidth: true }}
                      error={sealnumberErr}
                      helperText={sealnumberHelperText}
                      inputProps={{
                        value: SealNumber,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon>perm_identity</Icon>
                          </InputAdornment>
                        ),
                        onChange: (event) =>
                          this.handleChange(event, "sealnumber"),
                        onBlur: (event) => this.handleBlur(event, "sealnumber"),
                        onFocus: () =>
                          this.setState({
                            sealnumberErr: false,
                            sealnumberHelperText: "",
                          }),
                      }}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <FormControl className="mb-0" fullWidth>
                    <CustomInput
                      labelText="Booking Number"
                      id="bookingnumber"
                      formControlProps={{ fullWidth: true }}
                      error={bookingnumberErr}
                      helperText={bookingnumberHelperText}
                      inputProps={{
                        value: BookingNumber,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon>perm_identity</Icon>
                          </InputAdornment>
                        ),
                        onChange: (event) =>
                          this.handleChange(event, "bookingnumber"),
                        onBlur: (event) =>
                          this.handleBlur(event, "bookingnumber"),
                        onFocus: () =>
                          this.setState({
                            bookingnumberErr: false,
                            bookingnumberHelperText: "",
                          }),
                      }}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <FormControl className="mb-0" fullWidth>
                    <CustomInput
                      labelText="BOL Number"
                      id="bolnumber"
                      formControlProps={{ fullWidth: true }}
                      error={BOLnumberErr}
                      helperText={BOLnumberHelperText}
                      inputProps={{
                        value: BOLNumber,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon>perm_identity</Icon>
                          </InputAdornment>
                        ),
                        onChange: (event) =>
                          this.handleChange(event, "bolnumber"),
                        onBlur: (event) => this.handleBlur(event, "bolnumber"),
                        onFocus: () =>
                          this.setState({
                            BOLnumberErr: false,
                            BOLnumberHelperText: "",
                          }),
                      }}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="Point of Origin"
                    id="pointoforigin"
                    formControlProps={{ fullWidth: true }}
                    error={pointoforiginErr}
                    helperText={pointoforiginHelperText}
                    inputProps={{
                      value: PointOfOrigin,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icon>perm_identity</Icon>
                        </InputAdornment>
                      ),
                      onChange: (event) =>
                        this.handleChange(event, "pointoforigin"),
                      onBlur: (event) =>
                        this.handleBlur(event, "pointoforigin"),
                      onFocus: () =>
                        this.setState({
                          pointoforiginErr: false,
                          pointoforiginHelperText: "",
                        }),
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <FormControl className="mb-0" fullWidth>
                    <CustomInput
                      labelText="Port of Loading"
                      id="pointofloading"
                      formControlProps={{ fullWidth: true }}
                      error={portofloadingErr}
                      helperText={portofloadingHelperText}
                      inputProps={{
                        value: PortOfLoading,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon>perm_identity</Icon>
                          </InputAdornment>
                        ),
                        onChange: (event) =>
                          this.handleChange(event, "portofloading"),
                        onBlur: (event) =>
                          this.handleBlur(event, "portofloading"),
                        onFocus: () =>
                          this.setState({
                            portofloadingErr: false,
                            portofloadingHelperText: "",
                          }),
                      }}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <FormControl className="mb-0" fullWidth>
                    <CustomInput
                      labelText="Port of Unloading"
                      id="pointofunloading"
                      formControlProps={{ fullWidth: true }}
                      error={portofunloadingErr}
                      helperText={portofunloadingHelperText}
                      inputProps={{
                        value: PortOfUnloading,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon>perm_identity</Icon>
                          </InputAdornment>
                        ),
                        onChange: (event) =>
                          this.handleChange(event, "portofunloading"),
                        onBlur: (event) =>
                          this.handleBlur(event, "portofunloading"),
                        onFocus: () =>
                          this.setState({
                            portofunloadingErr: false,
                            portofunloadingHelperText: "",
                          }),
                      }}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <FormControl className="mb-0" fullWidth>
                    <CustomInput
                      labelText="Place of Delivery by On-Carrier"
                      id="placeofdelivery"
                      formControlProps={{ fullWidth: true }}
                      error={placeofdeliveryErr}
                      helperText={placeofdeliveryHelperText}
                      inputProps={{
                        value: PlaceOfDeliveryByOnCarrier,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon>perm_identity</Icon>
                          </InputAdornment>
                        ),
                        onChange: (event) =>
                          this.handleChange(event, "placeofdelivery"),
                        onBlur: (event) =>
                          this.handleBlur(event, "placeofdelivery"),
                        onFocus: () =>
                          this.setState({
                            placeofdeliveryErr: false,
                            placeofdeliveryHelperText: "",
                          }),
                      }}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <div className="dt-vs date-spl">
                    <FormControl fullWidth>
                      <Datetime
                        dateFormat={"MM/DD/YYYY"}
                        timeFormat={false}
                        selected={moment(HBLDate)}
                        inputProps={{ placeholder: "HBL Date" }}
                        onChange={(date) => this.handleDate(date, "hbl")}
                        closeOnSelect={true}
                        renderInput={(params) => (
                          <TextField
                            style={{ marginTop: "-15px" }}
                            error={hbldateErr}
                            helperText={hbldateHelperText}
                            {...params}
                            label="HBL Date"
                            margin="normal"
                            fullWidth
                          />
                        )}
                      />
                      <Icon className="date-icon tp-slam">date_range</Icon>
                    </FormControl>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <div className="dt-vs date-spl">
                    <FormControl fullWidth>
                      <Datetime
                        dateFormat={"MM/DD/YYYY"}
                        timeFormat={false}
                        selected={moment(LoadDate)}
                        inputProps={{ placeholder: "Load Date" }}
                        onChange={(date) => this.handleDate(date, "load")}
                        closeOnSelect={true}
                        renderInput={(params) => (
                          <TextField
                            style={{ marginTop: "-15px" }}
                            error={loaddateErr}
                            helperText={loaddateHelperText}
                            {...params}
                            label="Load Date"
                            margin="normal"
                            fullWidth
                          />
                        )}
                      />
                      <Icon className="date-icon tp-slam">date_range</Icon>
                    </FormControl>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <div className="dt-vs date-spl">
                    <FormControl fullWidth>
                      <Datetime
                        dateFormat={"MM/DD/YYYY"}
                        timeFormat={false}
                        selected={moment(SailingDate)}
                        inputProps={{ placeholder: "Sailing Date" }}
                        onChange={(date) => this.handleDate(date, "sailing")}
                        closeOnSelect={true}
                        renderInput={(params) => (
                          <TextField
                            style={{ marginTop: "-15px" }}
                            error={sailingdateErr}
                            helperText={sailingdateHelperText}
                            {...params}
                            label="Sailing Date"
                            margin="normal"
                            fullWidth
                          />
                        )}
                      />
                      <Icon className="date-icon tp-slam">date_range</Icon>
                    </FormControl>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <div className="dt-vs date-spl">
                    <FormControl fullWidth>
                      <Datetime
                        dateFormat={"MM/DD/YYYY"}
                        timeFormat={false}
                        selected={moment(ArrivalDate)}
                        inputProps={{ placeholder: "Arrival Date" }}
                        onChange={(date) => this.handleDate(date, "arrival")}
                        closeOnSelect={true}
                        renderInput={(params) => (
                          <TextField
                            style={{ marginTop: "-15px" }}
                            error={arrivaldateErr}
                            helperText={arrivaldateHelperText}
                            {...params}
                            label="Arrival Date"
                            margin="normal"
                            fullWidth
                          />
                        )}
                      />
                      <Icon className="date-icon tp-slam">date_range</Icon>
                    </FormControl>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <div className="select-spl">
                    <FormControl error={freightforwarderErr} fullWidth>
                      <InputLabel>Freight Forwarder</InputLabel>
                      <Select
                        value={FreightForwarder}
                        onChange={(event) =>
                          this.selectChange(event, "freight")
                        }
                        onFocus={() =>
                          this.setState({
                            freightforwarderErr: false,
                            freightforwarderHelperText: "",
                          })
                        }
                        inputProps={{
                          name: "freight",
                          id: "freight",
                        }}
                      >
                        {" "}
                        {this.freightForwarderMap()}
                      </Select>
                      <FormHelperText>
                        {freightforwarderHelperText}
                      </FormHelperText>
                    </FormControl>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <div className="select-spl">
                    <FormControl error={carrierErr} fullWidth>
                      <InputLabel>Carrier</InputLabel>
                      <Select
                        value={Carrier}
                        onChange={(event) =>
                          this.selectChange(event, "carrier")
                        }
                        onFocus={() =>
                          this.setState({
                            carrierErr: false,
                            carrierHelperText: "",
                          })
                        }
                        inputProps={{
                          name: "carrier",
                          id: "carrier",
                        }}
                      >
                        {" "}
                        {this.carrierList()}
                      </Select>
                      <FormHelperText>{carrierHelperText}</FormHelperText>
                    </FormControl>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <div className="select-spl">
                    <FormControl error={notifypartyErr} fullWidth>
                      <InputLabel>Notify Party</InputLabel>
                      <Select
                        value={NotifyParty}
                        onChange={(event) => this.selectChange(event, "notify")}
                        onFocus={() =>
                          this.setState({
                            notifypartyErr: false,
                            notifypartyHelperText: "",
                          })
                        }
                        inputProps={{
                          name: "notify",
                          id: "notify",
                        }}
                      >
                        {this.freightForwarderMap()}
                      </Select>
                      <FormHelperText>{notifypartyHelperText}</FormHelperText>
                    </FormControl>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <div className="select-spl">
                    <FormControl error={customsbrokerErr} fullWidth>
                      <InputLabel>Customs Broker</InputLabel>
                      <Select
                        value={CustomsBroker}
                        onChange={(event) =>
                          this.selectChange(event, "customsbroker")
                        }
                        onFocus={() =>
                          this.setState({
                            customsbrokerErr: false,
                            customsbrokerHelperText: "",
                          })
                        }
                        inputProps={{
                          name: "customsbroker",
                          id: "customsbroker",
                        }}
                      >
                        {" "}
                        {this.customsBroker()}
                      </Select>
                      <FormHelperText>{customsbrokerHelperText}</FormHelperText>
                    </FormControl>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <FormControl className="mb-0" fullWidth>
                    <CustomInput
                      labelText="Created On"
                      id="createdon"
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: CreatedOn,
                        disabled: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className="requiredicon">perm_identity</Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <FormControl className="mb-0" fullWidth>
                    <CustomInput
                      labelText="Created By"
                      id="pointofloading"
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: CreatedBy,
                        disabled: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className="requiredicon">perm_identity</Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <div className="select-spl">
                    <FormControl error={containerstatusErr} fullWidth>
                      <InputLabel>Active</InputLabel>
                      <Select
                        value={ContainerStatus}
                        onChange={(event) =>
                          this.selectChange(event, "containerstatus")
                        }
                        onFocus={() =>
                          this.setState({
                            containerstatusErr: false,
                            containerstatusHelperText: "",
                          })
                        }
                        inputProps={{
                          name: "containerstatus",
                          id: "containerstatus",
                        }}
                      >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                      <FormHelperText>
                        {containerstatusHelperText}
                      </FormHelperText>
                    </FormControl>
                  </div>
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
                          <th>Added By</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>{this.viewNotes()}</tbody>
                    </table>
                  </div>
                  <Button justify="center" onClick={this.handleAddNotesRow}>
                    Add New Row
                  </Button>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
          <Card>
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <Note />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">
                Documentation
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={12}>
                  <ReactTable
                    data={this.state.Attachments.filter(
                      (x) => x.Status === "Active"
                    )}
                    sortable={true}
                    filterable={true}
                    resizable={false}
                    minRows={2}
                    columns={columns}
                    defaultPageSize={10}
                    align="center"
                    className="-striped -highlight"
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
          <div className="shipment-submit">
            <div className="right">
              {Access.WriteAccess === 1 ? (
                <Button color="rose" onClick={() => this.handleSubmit()}>
                  Save
                </Button>
              ) : null}
              <Button color="secondary" onClick={() => this.cancelContainer()}>
                Cancel
              </Button>
            </div>
          </div>
        </GridItem>
      </GridContainer>
    );
  }
}

export default addContainer;
