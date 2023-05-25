import React from "react";
import PropTypes from "prop-types";
// core components
import { makeStyles } from "@material-ui/core/styles";
import ShipmentWizard from "../Shipment/ShipmentWizard.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Icon from "@material-ui/core/Icon";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import withStyles from "@material-ui/core/styles/withStyles";
import Step1 from "./Shipmentstep/Step1.js";
import Step2 from "./Shipmentstep/Step2.js";
import Step3 from "./Shipmentstep/Step3.js";
import Step4 from "./Shipmentstep/Step4.js";
import Step5 from "./Shipmentstep/Step5.js";
import Step7 from "./Shipmentstep/Step7.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import cogoToast from "cogo-toast";
import FlightTakeoff from "@material-ui/icons/FlightTakeoff";
import CardBody from "components/Card/CardBody.js";
// import Datetime from "react-datetime";
import moment from "moment";
import api from "../../utils/apiClient";
import { fileBase } from "../../utils/config";
import { CommonConfig } from "utils/constant.js";

const useStyles = () => makeStyles(styles);
const classes = useStyles();

class Shipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shipmentTypeList: [],
      ManagedBy: "",
      managedByList: [],
      TrackingNumber: "",
      ServiceType: "",
      SubServiceType: "",
      CreatedBy: "",
      ShipmentDate: "",
      ShipmentType: "",
      notes: [],
      ServiceList: [],
      SubServiceList: [],
      Subservicename: true,
      subServiceName: [],
      ServiceName: "",
      SubServiceName: "",
    };
  }

  async componentDidMount() {
    await this.getShipmentType();
    await this.getManagedBy();
    await this.getService();
    await this.getShipmentInfo();
    this.handleAddNotesRow();
  }

  getManagedBy() {
    try {
      api
        .get("scheduleshipment/getShipmentManagedBy")
        .then((result) => {
          this.setState({ managedByList: result.data });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }
  getService() {
    try {
      api
        .get("userManagement/getServiceName")
        .then((result) => {
          if (result.success) {
            this.setState({
              ServiceList: result.data.ServiceName,
              subServiceName: result.data.SubServiceName,
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

  getShipmentType() {
    try {
      let data = {
        stringMapType: "SHIPMENTTYPE",
      };

      api
        .post("stringMap/getstringMap", data)
        .then((result) => {
          this.setState({ shipmentTypeList: result.data });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  getShipmentInfo() {
    try {
      let data = {
        ShippingID: this.props.location.state.ShipppingID,
      };
      api.post("scheduleshipment/getShipmentInfo", data).then((res) => {
        if (res.success) {
          var shipmentType = {
            value: res.data[0].ShipmentType,
            label: res.data[0].ShipmentType,
          };
          var managedBy = {
            value: res.data[0].ManagedBy,
            label: res.data[0].ManagedByName,
          };
          this.setState({
            ManagedBy: managedBy,
            TrackingNumber: res.data[0].TrackingNumber,
            CreatedBy: res.data[0].CreatedBy,
            ServiceType: res.data[0].ServiceName,
            SubServiceType: res.data[0].SubServiceName,
            ShipmentDate: res.data[0].ShipmentDate,
            ShipmentType: shipmentType,
          });
        }
      });
    } catch (error) {
      console.log("error...", error);
    }
  }

  change(event, type) {
    console.log("change called..");
  }

  sendState() {
    return this.state;
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
        closebutton: true,
        CreatedBy: CommonConfig.loggedInUserData().PersonID,
        NoteID: null,
        CreatedByNote: CommonConfig.loggedInUserData().Name,
        AddedBy: CommonConfig.loggedInUserData().Name,
        Index: this.state.notes.length + 1,
      };
      this.setState({
        notesDisabled: false,
        notes: [...this.state.notes, note],
      });
    } else {
      cogoToast.error("Please fill above note first");
    }
  };

  handleChangeNotes = (event, idx) => {
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

  handleNotesRemoveRow = (Index) => {
    const removeNotes = [...this.state.notes];
    var noteIndex = this.state.notes.findIndex((x) => x.Index === Index);
    if (noteIndex !== -1) {
      removeNotes[noteIndex]["Status"] = "Inactive";
      removeNotes[noteIndex]["AttachmentStatus"] = "Inactive";
      this.setState({ notes: removeNotes });
    }
  };

  selectChange = (event, value, type) => {
    if (type === "ServiceType") {
      var service = this.state.subServiceName;
      var finalService = service.filter(
        (x) =>
          x.MainServiceName === value.value &&
          x.ServiceType === this.state.ShipmentType.value
      );
      this.setState({
        Subservicename: false,
        SubServiceList: finalService,
        ServiceName: value,
        SubServiceName: "",
      });
    } else if (type === "SubServiceType") {
      this.setState({ SubServiceName: value });
    } else if (type === "ManagedBy") {
      this.setState({ ManagedBy: value });
    } else if (type === "ShipmentType") {
      var service = this.state.subServiceName;
      var finalService = service.filter(
        (x) =>
          x.ServiceType === value.value &&
          x.MainServiceName === this.state.ServiceName.value
      );
      this.setState({
        ShipmentType: value,
        SubServiceList: finalService,
        SubServiceName: "",
      });
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
                    style={{ width: 582, margin: 0, height: 68 }}
                    disabled={notes.disabled}
                    value={notes.NoteText}
                    onChange={(event) =>
                      this.handleChangeNotes(event, notes.Index)
                    }
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
                <br />
                <p>{notes.AttachmentName}</p>
              </td>
            )}
            <td>{notes.CreatedByNote}</td>
            <td>
              <div className="pck-subbtn">
                {/* {this.state.DeleteAccess === 1? */}
                <Button
                  justIcon
                  color="danger"
                  className="Plus-btn "
                  onClick={() => this.handleNotesRemoveRow(notes.Index)}
                  disabled={this.state.notesDisabled}
                >
                  <i className={"fas fa-minus"} />
                </Button>
                <Button
                  justIcon
                  color="facebook"
                  onClick={() => this.handleAddNotesRow()}
                  className="Plus-btn "
                >
                  <i className={"fas fa-plus"} />
                </Button>
              </div>
              {/* this.handleAddNotesRow */}
              {/* ):(null)
              } */}
            </td>
          </tr>
        );
      });
  };

  handleSave = () => {
    console.log("this.props.....", this.props.step);
  };

  render() {
    const {
      TrackingNumber,
      ManagedBy,
      CreatedBy,
      ServiceName,
      SubServiceName,
      Subservicename,
      ShipmentDate,
      ShipmentType,
    } = this.state;
    const shipmentType = this.state.shipmentTypeList.map((type) => {
      return { value: type.Description, label: type.Description };
    });
    const managedBy = this.state.managedByList.map((type) => {
      return { value: type.UserID, label: type.Name };
    });
    const serviceName = this.state.ServiceList.map((type) => {
      return { value: type.MainServiceName, label: type.MainServiceName };
    });
    const subServiceName = this.state.SubServiceList.map((type) => {
      return { value: type.ServiceName, label: type.ServiceName };
    });

    return (
      <div>
        <GridContainer justify="center" className="schedule-pickup-main-outer">
          <GridItem xs={12} sm={12}>
            <Card>
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <FlightTakeoff />
                </CardIcon>
                <h4 className="margin-right-auto text-color-black">
                  Shipment Information
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={4} md={3}>
                    <CustomInput
                      labelText="Tracking Number"
                      id="trackingnumber"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        disabled: true,
                        value: TrackingNumber,
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={classes.inputAdornment}
                          >
                            <Icon className={classes.User}>
                              format_list_numbered
                            </Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={4} md={3}>
                    <CustomInput
                      labelText="Username"
                      id="proposaltype"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        disabled: true,
                        value: CreatedBy,
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={classes.inputAdornment}
                          >
                            <Icon className={classes.User}>person</Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={4} md={3}>
                    <CustomInput
                      labelText="Ship Date"
                      id="proposaltype"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        disabled: true,
                        value: moment(ShipmentDate).format(
                          CommonConfig.dateFormat.dateOnly
                        ),
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={classes.inputAdornment}
                          >
                            <Icon className={classes.User}>person</Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={3} md={3}>
                    <Autocomplete
                      id="combo-box-demo"
                      options={managedBy}
                      value={ManagedBy}
                      onChange={(event, value) =>
                        this.selectChange(event, value, "ManagedBy")
                      }
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => (
                        <TextField {...params} label="Managed By" />
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={3} md={3}>
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
                  <GridItem xs={12} sm={3} md={3}>
                    <Autocomplete
                      id="combo-box-demo"
                      options={serviceName}
                      value={ServiceName}
                      onChange={(event, value) =>
                        this.selectChange(event, value, "ServiceType")
                      }
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => (
                        <TextField {...params} label="Service Type" />
                      )}
                    ></Autocomplete>
                  </GridItem>
                  <GridItem xs={12} sm={3} md={3}>
                    <Autocomplete
                      id="combo-box-demo"
                      disabled={Subservicename}
                      value={SubServiceName}
                      options={subServiceName}
                      onChange={(event, value) =>
                        this.selectChange(event, value, "SubServiceType")
                      }
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => (
                        <TextField {...params} label="Sub Service Type" />
                      )}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer justify="center" className="schedule-pickup-main-outer">
          <GridItem xs={12} sm={12}>
            <Card>
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <FlightTakeoff />
                </CardIcon>
                <h4 className="margin-right-auto text-color-black">Shipment</h4>
              </CardHeader>
              <ShipmentWizard
                //validate
                steps={[
                  {
                    stepName: "Customer Details",
                    stepComponent: Step1,
                    stepId: "customerdetails",
                    returnState: this.sendState(),
                  },
                  {
                    stepName: "Package",
                    stepComponent: Step2,
                    stepId: "package",
                    returnState: this.sendState(),
                  },
                  {
                    stepName: "Commercial Inv.",
                    stepComponent: Step3,
                    stepId: "commercialinvoice",
                    returnState: this.sendState(),
                  },
                  {
                    stepName: "Accounts",
                    stepComponent: Step4,
                    stepId: "accounts",
                    returnState: this.sendState(),
                  },
                  {
                    stepName: "Tracking",
                    stepComponent: Step5,
                    stepId: "tracking",
                    returnState: this.sendState(),
                  },
                  // { stepName: "Insurance & Claim", stepComponent: Step6, stepId: "Insurance&Claim" },
                  {
                    stepName: "Documentation",
                    stepComponent: Step7,
                    stepId: "documentation",
                    returnState: this.sendState(),
                  },
                ]}
                title=""
                subtitle=""
                history={this.props.history}
                props={this.props}
                //finishButtonClick={e => alert(e)}
              />
            </Card>
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={12} sm={12}>
            <Card>
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <FlightTakeoff />
                </CardIcon>
                <h4 className="margin-right-auto text-color-black">Notes</h4>
              </CardHeader>
              <div className="notes-table">
                <div className="package-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Comments</th>
                        <th>Attachment</th>
                        <th>Added By</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>{this.viewNotes()}</tbody>
                  </table>
                  {/* <Button justify="center" onClick={this.handleAddNotesRow}>Add New Row</Button> */}
                </div>
              </div>
            </Card>
          </GridItem>
        </GridContainer>
        {/* <Button justify="center" color="rose" onClick={() => this.handleSave()} >Save</Button> */}
      </div>
    );
  }
}
Shipment.propTypes = {
  classes: PropTypes.object,
};

export default withStyles()(Shipment);
// export default function Scheduleshipment() {
//     return (
//         <div>
//             <GridContainer justify="center" className="schedule-pickup-main-outer">
//                 <GridItem xs={12} sm={12}>
//                     <Card>
//                         <CardHeader className="btn-right-outer" color="primary" icon>
//                             <CardIcon color="primary">
//                                 <FlightTakeoff />
//                             </CardIcon>
//                             <h4 className="margin-right-auto text-color-black">Shipment Information</h4>
//                         </CardHeader>
//                         <CardBody>
//                             <GridContainer>
//                                 <GridItem xs={12} sm={4} md={4}>
//                                     <CustomInput
//                                         // success={this.state.firstnameState === "success"}
//                                         //error={this.state.firstnameState === "error"}
//                                         labelText={
//                                             <span>
//                                                 Tracking Number
//                                                         </span>
//                                         }
//                                         id="proposaltype"
//                                         formControlProps={{
//                                             fullWidth: true
//                                         }}
//                                         inputProps={{
//                                             onChange: event => this.change(event, "proposaltype"),
//                                             endAdornment: (
//                                                 <InputAdornment
//                                                     position="end"
//                                                     className={classes.inputAdornment}
//                                                 >
//                                                     <Icon className={classes.User}>
//                                                     format_list_numbered
//                                                             </Icon>
//                                                 </InputAdornment>
//                                             )
//                                         }}
//                                     />
//                                 </GridItem>
//                                 <GridItem xs={12} sm={4} md={4}>
//                                     <CustomInput
//                                         // success={this.state.firstnameState === "success"}
//                                         //error={this.state.firstnameState === "error"}
//                                         labelText={
//                                             <span>
//                                                 Service Type
//                                                         </span>
//                                         }
//                                         id="proposaltype"
//                                         formControlProps={{
//                                             fullWidth: true
//                                         }}
//                                         inputProps={{
//                                             onChange: event => this.change(event, "proposaltype"),
//                                             endAdornment: (
//                                                 <InputAdornment
//                                                     position="end"
//                                                     className={classes.inputAdornment}
//                                                 >
//                                                     <Icon className={classes.User}>
//                                                     local_airport
//                                                             </Icon>
//                                                 </InputAdornment>
//                                             )
//                                         }}
//                                     />
//                                 </GridItem>
//                                 <GridItem xs={12} sm={4} md={4}>
//                                     <CustomInput
//                                         // success={this.state.firstnameState === "success"}
//                                         //error={this.state.firstnameState === "error"}
//                                         labelText={
//                                             <span>
//                                                 Managed By
//                                                         </span>
//                                         }
//                                         id="proposaltype"
//                                         formControlProps={{
//                                             fullWidth: true
//                                         }}
//                                         inputProps={{
//                                             onChange: event => this.change(event, "proposaltype"),
//                                             endAdornment: (
//                                                 <InputAdornment
//                                                     position="end"
//                                                     className={classes.inputAdornment}
//                                                 >
//                                                     <Icon className={classes.User}>
//                                                     account_circle
//                                                             </Icon>
//                                                 </InputAdornment>
//                                             )
//                                         }}
//                                     />
//                                 </GridItem>
//                             </GridContainer>
//                             <GridContainer>
//                                 <GridItem xs={12} sm={3} md={3}>
//                                     <CustomInput
//                                         // success={this.state.firstnameState === "success"}
//                                         //error={this.state.firstnameState === "error"}
//                                         labelText={
//                                             <span>
//                                                 Shipment Type
//                                                         </span>
//                                         }
//                                         id="proposaltype"
//                                         formControlProps={{
//                                             fullWidth: true
//                                         }}
//                                         inputProps={{
//                                             onChange: event => this.change(event, "proposaltype"),
//                                             endAdornment: (
//                                                 <InputAdornment
//                                                     position="end"
//                                                     className={classes.inputAdornment}
//                                                 >
//                                                     <Icon className={classes.User}>
//                                                     directions_boat
//                                                             </Icon>
//                                                 </InputAdornment>
//                                             )
//                                         }}
//                                     />
//                                 </GridItem>
//                                 <GridItem xs={12} sm={3} md={3}>
//                                     <CustomInput
//                                         // success={this.state.firstnameState === "success"}
//                                         //error={this.state.firstnameState === "error"}
//                                         labelText={
//                                             <span>
//                                                 Sub Service Type
//                                                         </span>
//                                         }
//                                         id="proposaltype"
//                                         formControlProps={{
//                                             fullWidth: true
//                                         }}
//                                         inputProps={{
//                                             onChange: event => this.change(event, "proposaltype"),
//                                             endAdornment: (
//                                                 <InputAdornment
//                                                     position="end"
//                                                     className={classes.inputAdornment}
//                                                 >
//                                                     <Icon className={classes.User}>
//                                                     move_to_inbox
//                                                             </Icon>
//                                                 </InputAdornment>
//                                             )
//                                         }}
//                                     />
//                                 </GridItem>
//                                 <GridItem xs={12} sm={3} md={3}>
//                                     <CustomInput
//                                         // success={this.state.firstnameState === "success"}
//                                         //error={this.state.firstnameState === "error"}
//                                         labelText={
//                                             <span>
//                                                 Username
//                                                         </span>
//                                         }
//                                         id="proposaltype"
//                                         formControlProps={{
//                                             fullWidth: true
//                                         }}
//                                         inputProps={{
//                                             onChange: event => this.change(event, "proposaltype"),
//                                             endAdornment: (
//                                                 <InputAdornment
//                                                     position="end"
//                                                     className={classes.inputAdornment}
//                                                 >
//                                                     <Icon className={classes.User}>
//                                                     person
//                                                             </Icon>
//                                                 </InputAdornment>
//                                             )
//                                         }}
//                                     />
//                                 </GridItem>
//                                 <GridItem xs={12} sm={3} md={3}>
//                                     <CustomInput
//                                         // success={this.state.firstnameState === "success"}
//                                         //error={this.state.firstnameState === "error"}
//                                         labelText={
//                                             <span>
//                                                 Shipment Date
//                                                         </span>
//                                         }
//                                         id="proposaltype"
//                                         formControlProps={{
//                                             fullWidth: true
//                                         }}
//                                         inputProps={{
//                                             onChange: event => this.change(event, "proposaltype"),
//                                             endAdornment: (
//                                                 <InputAdornment
//                                                     position="end"
//                                                     className={classes.inputAdornment}
//                                                 >
//                                                     <Icon className={classes.User}>
//                                                     date_range
//                                                             </Icon>
//                                                 </InputAdornment>
//                                             )
//                                         }}
//                                     />
//                                 </GridItem>
//                             </GridContainer>
//                         </CardBody>
//                     </Card>
//                 </GridItem>
//             </GridContainer>

//             <GridContainer justify="center" className="schedule-pickup-main-outer">
//                 <GridItem xs={12} sm={12}>
//                     <Card>
//                         <CardHeader className="btn-right-outer" color="primary" icon>
//                             <CardIcon color="primary">
//                                 <FlightTakeoff />
//                             </CardIcon>
//                             <h4 className="margin-right-auto text-color-black">Shipment</h4>
//                         </CardHeader>
//                         <Wizard
//                             //validate
//                             steps={[
//                                 { stepName: "Customer Details", stepComponent: Step1, stepId: "customerdetails" },
//                                 { stepName: "Package", stepComponent: Step2, stepId: "package" },
//                                 { stepName: "Commercial Inv.", stepComponent: Step3, stepId: "commercialinvoice" },
//                                 { stepName: "Accounts", stepComponent: Step4, stepId: "accounts" },
//                                 { stepName: "Tracking", stepComponent: Step5, stepId: "tracking" },
//                                 { stepName: "Insurance & Claim", stepComponent: Step6, stepId: "Insurance&Claim" },
//                                 { stepName: "Documentation", stepComponent: Step7, stepId: "documentation" }
//                             ]}
//                             title=""
//                             subtitle=""
//                         //finishButtonClick={e => alert(e)}
//                         />
//                     </Card>
//                 </GridItem>
//             </GridContainer>

//             <GridContainer>
//                 <GridItem xs={12} sm={12}>
//                     <Card>
//                         <CardHeader className="btn-right-outer" color="primary" icon>
//                             <CardIcon color="primary">
//                                 <FlightTakeoff />
//                             </CardIcon>
//                             <h4 className="margin-right-auto text-color-black">Notes</h4>
//                         </CardHeader>
//                         <div className="notes-table">
//                             <div className="package-table">
//                                 <table>
//                                     <thead>
//                                         <tr>
//                                             <th>Date</th>
//                                             <th>Comments</th>
//                                             <th>Attachment</th>
//                                             <th>Added By</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         <tr>
//                                             <td>12/15/2020</td>
//                                             <td>This is comments area where user will enter whatever</td>
//                                             <td>View</td>
//                                             <td>Punit M</td>
//                                         </tr>
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </Card>
//                 </GridItem>
//             </GridContainer>
//         </div>
//     );
// }
