import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import api from "utils/apiClient";
import Autocomplete from "@material-ui/lab/Autocomplete";
import User from "@material-ui/icons/AccountCircle";
import TextField from "@material-ui/core/TextField";
import { CommonConfig } from "utils/constant";
import { green } from "@material-ui/core/colors";
import { red } from "@material-ui/core/colors";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import cogoToast from "cogo-toast";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
};

const useStyles = makeStyles(styles);

class EditService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceID: "",
      loading: false,
      ServiceName: "",
      ServiceNameErr: false,
      ServiceNameCheck: false,
      ServiceNameHelperText: "",

      DisplayName: "",
      DisplayNameErr: false,
      DisplayNameCheck: false,
      DisplayNameHelperText: "",

      DefaultMarkup: "",
      DefaultMarkupErr: false,
      DefaultMarkupCheck: false,
      DefaultMarkupHelperText: "",

      EnvelopMarkup: "",
      EnvelopMarkupErr: false,
      EnvelopMarkupCheck: false,
      EnvelopMarkupHelperText: "",

      ServiceType: "",
      ServiceTypeErr: false,
      ServiceTypeCheck: false,
      ServiceTypeHelperText: "",

      DefaultMarkupType: "",
      defaultMarkupTypeErr: false,
      defaultMarkupTypeHelperText: "",
      defaultMarkupTypeCheck: false,
      defaultMarkupType: [
        { value: "Usd", label: "USD" },
        { value: "Percentage", label: "Percentage" },
      ],
      MainServiceName: "",
      MainServiceNameCheck: false,
      mainservicenameErr: false,
      mainserviceHelperText: "",
      TrackingLink: "",
      TrackingLinkCheck: false,
      trackinglinkErr: false,
      trackinglinkHelperText: "",
    };
    this.requestChange = this.requestChange.bind(this);
  }

  componentDidMount() {
    this.getEditServiceData();
  }

  getEditServiceData() {
    let data = {
      serviceID: this.props.location.state.Id,
    };

    this.setState({ loading: true });
    api.post("userManagement/getServiceByID", data).then((result) => {
      this.setState({ loading: false });
      this.setState({
        serviceID: result.data.ServiceID,
        ServiceName: result.data.ServiceName,
        DisplayName: result.data.DisplayName,
        DefaultMarkup: result.data.Markup,
        EnvelopMarkup: result.data.EnvelopMarkup,
        DefaultMarkupType: result.data.MarkupType,
        ServiceType: result.data.ServiceType,
        MainServiceName: result.data.MainServiceName,
        TrackingLink: result.data.TrackingLink,
      });
    });
  }
  update = (redirect) => {
    if (
      (CommonConfig.isEmpty(this.state.ServiceName) &&
        CommonConfig.isEmpty(this.state.DisplayName) &&
        CommonConfig.isEmpty(this.state.DefaultMarkup) &&
        CommonConfig.isEmpty(this.state.EnvelopMarkup) &&
        CommonConfig.isEmpty(this.state.DefaultMarkupType)) ||
      (this.state.ServiceNameErr === true ||
        this.state.DisplayNameErr === true ||
        this.state.DefaultMarkupErr === true ||
        this.state.EnvelopMarkupErr === true ||
        this.state.defaultMarkupTypeErr === true)
    ) {
      this.setState({ saveErr: true });
      cogoToast.error(
        "There were errors found on the form. Please correct and resubmit."
      );
    } else {
      this.setState({ saveErr: false });
      let data = {
        serviceID: this.state.serviceID,
        serviceName: this.state.ServiceName,
        displayName: this.state.DisplayName,
        MainServiceName: this.state.MainServiceName,
        TrackingLink: this.state.TrackingLink,
        markup: this.state.DefaultMarkup,
        envelopmarkup: this.state.EnvelopMarkup,
        MarkupType: this.state.DefaultMarkupType,
        ServiceType: this.state.ServiceType,
      };
      try {
        api.post("userManagement/addUpdateService", data).then((result) => {
          if (result.success) {
            this.setState({ loading: true });
            if (redirect) {
              this.props.history.push({
                pathname: "/admin/Service",
                state: {
                  filterlist: this.props.history.location.state.filterlist,
                  sortlist: this.props.history.location.state.sortlist,
                },
              });
            } else {
              this.getEditServiceData();
            }
            cogoToast.success("Update Sucessfully");
          } else {
            this.setState({ loading: false });
            cogoToast.error("Something went wrong");
          }
        });
      } catch (err) {
        console.log("error", err);
      }
    }
  };

  cancel = () => {
    this.props.history.push({
      pathname: "/admin/Service",
      state: {
        filterlist: this.props.history.location.state.filterlist,
        sortlist: this.props.history.location.state.sortlist,
      },
    });
  };

  requestChange(event, value, type) {
    if (type === "defaultmarkuptype") {
      this.setState({ De: true });
      if (
        event.target.value === undefined ||
        event.target.value === "" ||
        event.target.value === null
      ) {
        this.setState({
          DefaultMarkupType: event.target.value,
          defaultMarkupTypeErr: true,
          defaultMarkupTypeHelperText: "Please Select any one option",
        });
      } else {
        this.setState({
          DefaultMarkupType: event.target.value,
          defaultMarkupTypeErr: false,
          defaultMarkupTypeHelperText: "",
        });
      }
    }
  }

  handleChange = (event, type) => {
    if (type === "servicename") {
      this.setState({ ServiceNameCheck: true });
      let servicenameVal = event.target.value;
      if (servicenameVal === "" || servicenameVal === null) {
        this.setState({
          ServiceName: servicenameVal,
          ServiceNameErr: true,
          ServiceNameHelperText: "Please enter Service Name",
        });
      } else {
        this.setState({
          ServiceName: servicenameVal,
          ServiceNameErr: false,
          ServiceNameHelperText: "",
        });
      }
    } else if (type === "displayname") {
      this.setState({ DisplayNameCheck: true });
      let dislpaynameVal = event.target.value;
      if (dislpaynameVal === "" || dislpaynameVal === null) {
        this.setState({
          DisplayName: dislpaynameVal,
          DisplayNameErr: true,
          DisplayNameHelperText: "Please enter Display Name",
        });
      } else {
        this.setState({
          DisplayName: dislpaynameVal,
          DisplayNameErr: false,
          DisplayNameHelperText: "",
        });
      }
    } else if (type === "defaultmarkup") {
      this.setState({ DefaultMarkupCheck: true });
      let defaultmarkupVal = event.target.value;
      if (defaultmarkupVal === "" || defaultmarkupVal === null) {
        this.setState({
          DefaultMarkup: defaultmarkupVal,
          DefaultMarkupErr: true,
          DefaultMarkupHelperText: "Please enter Default Number",
        });
      } else {
        this.setState({
          DefaultMarkup: defaultmarkupVal,
          DefaultMarkupErr: false,
          DefaultMarkupHelperText: "",
        });
      }
    } else if (type === "envelopmarkup") {
      this.setState({ EnvelopMarkupCheck: true });
      let envelopmarkupVal = event.target.value;
      if (envelopmarkupVal === "" || envelopmarkupVal === null) {
        this.setState({
          EnvelopMarkup: envelopmarkupVal,
          EnvelopMarkupErr: true,
          EnvelopMarkupHelperText: "Please enter Service Name",
        });
      } else {
        this.setState({
          EnvelopMarkup: envelopmarkupVal,
          EnvelopMarkupErr: false,
          EnvelopMarkupHelperText: "",
        });
      }
    } else if (type === "servicetype") {
      this.setState({ ServiceTypeCheck: true });
      let servicetypeVal = event.target.value;
      if (servicetypeVal === "" || servicetypeVal === null) {
        this.setState({
          ServiceType: servicetypeVal,
          ServiceTypeErr: true,
          ServiceTypeHelperText: "Please enter Service Type",
        });
      } else {
        this.setState({
          ServiceType: servicetypeVal,
          ServiceTypeErr: false,
          ServiceTypeHelperText: "",
        });
      }
    } else if (type === "mainservicename") {
      this.setState({ MainServiceNameCheck: true });
      let Val = event.target.value;
      if (Val === "" || Val === null) {
        this.setState({
          MainServiceName: Val,
          mainservicenameErr: true,
          mainserviceHelperText: "Please enter Service Name",
        });
      } else {
        this.setState({
          MainServiceName: Val,
          mainservicenameErr: false,
          mainserviceHelperText: "",
        });
      }
    } else if (type === "trackinglink") {
      this.setState({ TrackingLinkCheck: true });
      let Val = event.target.value;
      if (Val === "" || Val === null) {
        this.setState({
          TrackingLink: Val,
          trackinglinkErr: true,
          trackinglinkHelperText: "Please enter Tracking Link",
        });
      } else {
        this.setState({
          TrackingLink: Val,
          trackinglinkErr: false,
          trackinglinkHelperText: "",
        });
      }
    }
  };
  render() {
    const { defaultMarkupType } = this.state;
    const { ServiceName } = this.state;
    const { DisplayName } = this.state;
    const { DefaultMarkup } = this.state;
    const { EnvelopMarkup } = this.state;
    const { DefaultMarkupType } = this.state;

    const defaultmarkuptype = {
      options: defaultMarkupType.map((option) => option.label),
    };
    return (
      <GridContainer className="UserList-outer">
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <User />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">
                Edit Service
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Shipment Type"
                    id="servicetype"
                    error={this.state.ServiceTypeErr}
                    helperText={this.state.ServiceTypeHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: this.state.ServiceType,
                      onChange: (event) =>
                        this.handleChange(event, "servicetype"),
                      onBlur: (event) =>
                        this.handleChange(event, "servicetype"),
                      onFocus: (event) =>
                        this.setState({
                          ServiceTypeCheck: false,
                          ServiceTypeErr: false,
                          ServiceTypeHelperText: "",
                        }),
                      endAdornment:
                        this.state.ServiceTypeCheck !== true ? (
                          <Icon>email </Icon>
                        ) : this.state.ServiceTypeErr ? (
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
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText=" Display Name"
                    id="displayname"
                    error={this.state.DisplayNameErr}
                    helperText={this.state.DisplayNameHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: this.state.DisplayName,
                      onChange: (event) =>
                        this.handleChange(event, "displayname"),
                      onBlur: (event) =>
                        this.handleChange(event, "displayname"),
                      onFocus: (event) =>
                        this.setState({
                          DisplayNameCheck: false,
                          DisplayNameErr: false,
                          DisplayNameHelperText: "",
                        }),
                      endAdornment:
                        this.state.DisplayNameCheck !== true ? (
                          <Icon>assignment_ind</Icon>
                        ) : this.state.DisplayNameErr ? (
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
                </GridItem>
              </GridContainer>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Service Name"
                    id="servicename"
                    error={this.state.mainservicenameErr}
                    helperText={this.state.mainserviceHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: this.state.MainServiceName,
                      onChange: (event) =>
                        this.handleChange(event, "mainservicename"),
                      onBlur: (event) =>
                        this.handleChange(event, "mainservicename"),
                      onFocus: () =>
                        this.setState({
                          MainServiceNameCheck: false,
                          mainservicenameErr: false,
                          mainserviceHelperText: "",
                        }),
                      endAdornment:
                        this.state.MainServiceNameCheck !== true ? (
                          <Icon>account_box</Icon>
                        ) : this.state.mainservicenameErr ? (
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
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Sub Service Name"
                    id="servicename"
                    error={this.state.ServiceNameErr}
                    helperText={this.state.ServiceNameHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: this.state.ServiceName,
                      onChange: (event) =>
                        this.handleChange(event, "servicename"),
                      onBlur: (event) =>
                        this.handleChange(event, "servicename"),
                      onFocus: (event) =>
                        this.setState({
                          ServiceNameCheck: false,
                          ServiceNameErr: false,
                          ServiceNameHelperText: "",
                        }),
                      endAdornment:
                        this.state.ServiceNameCheck !== true ? (
                          <Icon>account_box</Icon>
                        ) : this.state.ServiceNameErr ? (
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
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <FormControl fullWidth>
                    <Autocomplete
                      {...defaultmarkuptype}
                      id="Default Markup Type"
                      value={this.state.DefaultMarkupType}
                      onBlur={(event, value) =>
                        this.requestChange(event, value, "defaultmarkuptype")
                      }
                      onFocus={(event) =>
                        this.setState({
                          defaultMarkupTypeCheck: false,
                          defaultMarkupTypeErr: false,
                          defaultMarkupTypeHelperText: "",
                        })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Default Markup Type"
                          error={this.state.defaultMarkupTypeErr}
                          helperText={this.state.defaultMarkupTypeHelperText}
                          fullWidth
                        />
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Default Markup *"
                    id="defaultmarkup"
                    error={this.state.DefaultMarkupErr}
                    helperText={this.state.DefaultMarkupHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: this.state.DefaultMarkup,
                      onChange: (event) =>
                        this.handleChange(event, "defaultmarkup"),
                      onBlur: (event) =>
                        this.handleChange(event, "defaultmarkup"),
                      onFocus: (event) =>
                        this.setState({
                          DefaultMarkupCheck: false,
                          DefaultMarkupErr: false,
                          DefaultMarkupHelperText: "",
                        }),
                      endAdornment:
                        this.state.DefaultMarkupCheck !== true ? (
                          <Icon>email </Icon>
                        ) : this.state.DefaultMarkupErr ? (
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
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Envelop Markup *"
                    id="envelopmarkup"
                    error={this.state.EnvelopMarkupErr}
                    helperText={this.state.EnvelopMarkupHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: this.state.EnvelopMarkup,
                      onChange: (event) =>
                        this.handleChange(event, "envelopmarkup"),
                      onBlur: (event) =>
                        this.handleChange(event, "envelopmarkup"),
                      onFocus: (event) =>
                        this.setState({
                          EnvelopMarkupCheck: false,
                          EnvelopMarkupErr: false,
                          EnvelopMarkupHelperText: "",
                        }),
                      endAdornment:
                        this.state.EnvelopMarkupCheck !== true ? (
                          <Icon>email </Icon>
                        ) : this.state.EnvelopMarkupErr ? (
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
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Tracking Link"
                    id="trackinglink"
                    error={this.state.trackinglinkErr}
                    helperText={this.state.trackinglinkHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: this.state.TrackingLink,
                      onChange: (event) =>
                        this.handleChange(event, "trackinglink"),
                      onBlur: (event) =>
                        this.handleChange(event, "trackinglink"),
                      onFocus: (event) =>
                        this.setState({
                          TrackingLinkCheck: false,
                          trackinglinkErr: false,
                          trackinglinkHelperText: "",
                        }),
                      endAdornment:
                        this.state.TrackingLinkCheck !== true ? (
                          <Icon>email </Icon>
                        ) : this.state.trackinglinkErr ? (
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
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
          <div className="shipment-submit">
            <div className="right">
              <Button color="rose" onClick={(event) => this.update(false)}>
                Save
              </Button>
              <Button color="primary" onClick={(event) => this.update(true)}>
                Save & Exit
              </Button>
              <Button color="secondary" onClick={() => this.cancel()}>
                Cancel
              </Button>
            </div>
          </div>
        </GridItem>
      </GridContainer>
    );
  }
}
export default EditService;
