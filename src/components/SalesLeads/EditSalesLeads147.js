import React, { Component } from "react";
import _, { result } from "lodash";
import TextField from "@material-ui/core/TextField";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/PriorityHigh";
import DeleteIcon from "@material-ui/icons/Delete";
import Note from "@material-ui/icons/Assessment";
import Package from "@material-ui/icons/Markunread";
import Badge from "@material-ui/core/Badge";
import moment from "moment";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { CommonConfig } from "../../utils/constant";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import Icon from "@material-ui/core/Icon";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import ReactTable from "react-table";
import InputAdornment from "@material-ui/core/InputAdornment";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SimpleBackdrop from "../../utils/general";
import api from "../../utils/apiClient";
import { fileBase } from "../../utils/config";
import Datetime from "react-datetime";
import { green } from "@material-ui/core/colors";
import { red } from "@material-ui/core/colors";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import cogoToast from "cogo-toast";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import tvSVG from "../../assets/img/tv-icon.svg";
import carSVG from "../../assets/img/car.svg";
import packageSVG from "../../assets/img/package.svg";
import HeaderLinks from "components/Navbars/AdminNavbarLinks";
const axios = require("axios").default;

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
};
const classes = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "right",
    right: theme.spacing.unit / 2,
    top: theme.spacing.unit / 2,
    color: theme.palette.grey[500],
  },
}));
var yesterday = moment().toDate();

var valid = function(current) {
  return (
    current.day() !== 0 && current.day() !== 6 && current.isAfter(yesterday)
  );
};
const useStyles = makeStyles(styles);

class EditSalesLeads extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ProposalTypeError: "",
      Referrederror: "",
      Followuprror: "",

      EditProposalData: [],
      SalesLeadManagementID: "",
      newurl: "",
      Managedby: "",
      managedbyErr: false,
      managedbyHelperText: "",

      ProposalType: 0,
      ProposalStatus: "",
      proposalstatusErr: false,
      proposalstatusHelperText: "",

      ContactName: "",
      contactnameErr: false,
      contactnameHelperText: "",
      contactnameCheck: false,

      EmailAddress: "",
      EmailAdd: "",

      emailaddressErr: false,
      emailaddressHelperText: "",
      emailaddressCheck: false,

      Phone: "",
      ContactNum: "",

      phoneErr: false,
      phoneHelperText: "",
      phoneCheck: false,

      PickupCountry: "",
      pickupcountryErr: false,
      pickupcountryHelperText: "",
      pickupcountryCheck: false,

      PickupCity: "",
      PickupCityList: [],
      pickupcityErr: false,
      pickupcityHelperText: "",
      pickupcityCheck: false,

      PickupState: "",
      pickupstateErr: false,
      pickupstateHelperText: "",
      pickupstateCheck: false,

      DropoffCountry: "",
      dropoffcountryErr: false,
      dropoffcountryHelperText: "",
      dropoffcountryCheck: false,

      DropoffCity: "",
      DropoffCityList: [],
      dropoffcityErr: false,
      dropoffcityHelperText: "",
      DropoffCityCheck: false,

      DropoffState: "",
      dropoffstateErr: false,
      dropoffstateHelperText: "",
      dropoffstateCheck: false,

      LeadDate: moment().toDate(),

      FollowupDate: "",
      followupdateErr: false,
      followupdateHelperText: "",
      followupdateCheck: false,

      DropoffCityZip: "",
      DropoffCityZipErr: false,
      DropoffCityZipHelperText: "",

      PickupCityZip: "",
      PickupCityErr: false,
      PickupCityZipHelperText: "",
      PickupCityZipErr: false,

      tentativedateErr: false,
      tentativedateHelperText: "",

      ReferredBy: "",
      ReferredbyErr: true,
      ReferredbyHelperText: "",

      LeadIPAddress: "",
      leadipaddressErr: false,
      leadipaddressHelperText: "",

      DeliveryType: "",
      deliverytypeErr: false,
      deliverytypeHelperText: "",

      Comments: "",
      commentsErr: false,
      commentsHelperText: "",
      Loading: false,

      PackageType: 0,
      Quantity: 0,
      ChargeableWeight: 0,
      BoxW: 0,
      BoxL: 0,
      BoxH: 0,
      CFT: 0,

      CountryList: [],
      PackageList: [],
      TVList: [],
      CarList: [],
      NoteList: [],
      Attachments: [],

      selectedPickUPCountry: {},
      selectedDropoffCountry: {},
      notes: [],
      Path: [],

      FromCity: "",
      FromState: "",

      AbsolutePath: "",
      managedby: [],
      selectedWorkingOnRequest: "",
      dropoffCountry: [],
      packageType: [
        { value: 1, label: "Boxes" },
        { value: 2, label: "Documents" },
        { value: 3, label: "Furniture" },
      ],
      // otherPackageType : [
      //   { value: 4, label: 'TV' },
      //   { value: 5, label: 'Auto' },
      // ],
      ReadAccess: 0,
      WriteAccess: 0,
      DeleteAccess: 0,
      pickupCountry: [],
      proposalstatus: [
        { value: "New", label: "New" },
        { value: "Open", label: "Open" },
        { value: "Closed", label: "Closed" },
        { value: "Cancelled", label: "Cancelled" },
        { value: "To be Deleted", label: "To be Deleted" },
      ],
      deliverytype: [
        { value: "Residential", label: "Residential" },
        { value: "Commercial", label: "Commercial" },
      ],
      proposaltype: [
        { value: "", label: "None" },
        { value: 1, label: "Air" },
        { value: 2, label: "Ocean" },
        { value: 3, label: "Ground" },
      ],
      referredby: [
        { value: "Google", label: "Google" },
        { value: "FunAsia", label: "FunAsia" },
        { value: "Social Media", label: "Social Media" },
        { value: "Referral", label: "Referral" },
        { value: "Outdoor Signage", label: "Outdoor Signage" },
        { value: "Others", label: "Others" },
      ],
      TentativeDate: moment().toDate(),
      StartDate: moment().toDate(),
      open: false,
      close: false,
      fromStateAutoComplete: false,
      fromStateList: [],
      toStateAutoComplete: false,
      toStateList: [],
      PickupCityInput: true,
      DropoffCityInput: true,
      IsPackageVisible: false,
      IsTvVisible: false,
      IsCarVisible: false,
      PhoneCount: 0,
      EmailCount: 0,
      // Correspondence Data

      CommuncationList: [],

      // Email Cofig Data
      sendmailopen: false,
      sendMailInfo: {
        Frommail: "",
        TOmail: "",
        CCmail: "",
        BCCmail: "",
        Subjectmail: "",
        Bodymail: "",
        Type: "",
        attachments: "",
      },
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClickCancel = () => {
    this.setState({ close: true, open: false });
  };

  showLoader = () => {
    this.setState({ Loading: true });
  };

  hideLoader = () => {
    this.setState({ Loading: false });
  };

  managedBy = () => {
    try {
      api
        .get("salesLead/getManageSalesLeadUser")
        .then((result) => {
          if (result.success) {
            this.setState({ managedby: result.Data });
          } else {
            cogoToast.error("Something went wrong");
          }
        })
        .catch((error) => {
          console.log("error....", error);

          cogoToast.error("Something went wrong");
        });
    } catch (err) {
      cogoToast.error("Something Went Wrong");
    }
  };

  handleOnChange = (event, type) => {
    if (type === "emailaddress") {
      this.setState({ emailaddressCheck: true });
      this.setState({
        EmailAddress: event.target.value,
        emailaddressErr: false,
        emailaddressHelperText: "",
      });
      // fetch(CommonConfig.EmailAPIKey(event.target.value))
      //   .then((res) => res.json())
      //   .then((data) => {
      //     this.setState({
      //       EmailAddress: event.target.value,
      //       emailaddressErr: false,
      //       // emailaddressHelperText: data.email_status,
      //     });
      //   });
    } else if (type === "phone") {
      this.setState({ phoneCheck: true });
      if (event.target.value.length <= 15) {
        this.setState({
          Phone: event.target.value,
          phoneErr: false,
          phoneHelperText: "",
        });
      }
    }
  };

  FromCountry = async (value) => {
    this.setState({
      selectedPickUPCountry: value,
      PickupCity: "",
      PickupCityZip: "",
      PickupState: "",
    });
    let res = await this.getState(value);

    if (res.success) {
      this.setState({
        fromStateList: res.data,
        fromStateAutoComplete: res.data.length ? true : false,
      });
    }
  };

  ToCountry = async (value) => {
    this.setState({
      selectedDropoffCountry: value,
      DropoffCityZip: "",
      DropoffCity: "",
      DropoffState: "",
    });

    let res = await this.getState(value);

    if (res.success) {
      this.setState({
        toStateList: res.data,
        toStateAutoComplete: res.data.length ? true : false,
      });
    }
  };

  requestChange(event, value, type) {
    if (type === "requeststatus") {
      this.setState({ selectedRequestStatus: value });
    } else if (type === "managedby") {
      this.setState({ selectedWorkingOnRequest: value });
    } else if (type === "proposaltype") {
      this.setState({ ProposalType: value.props.value });
    } else if (type === "proposalstatus") {
      this.setState({ ProposalStatus: value });
    } else if (type === "deliverytype") {
      this.setState({ DeliveryType: value });
    } else if (type === "pickupcity") {
      this.setState({ PickupCity: value });
    } else if (type === "dropoffcity") {
      this.setState({ DropoffCity: value });
    } else if (type === "dropoffstate") {
      this.setState({ DropoffState: value });
    } else if (type === "pickupstate") {
      this.setState({ PickupState: value });
    } else if (type === "referredby") {
      this.setState({ ReferredBy: value });
    }
  }

  handlechange = (event, type) => {
    if (type === "managedby") {
      let managedbyVal = event.target.value;
      if (CommonConfig.isEmpty(managedbyVal)) {
        this.setState({
          Managedby: managedbyVal,
          managedbyErr: true,
          managedbyHelperText: "Please enter Managed By",
        });
      } else {
        this.setState({
          Managedby: managedbyVal,
          managedbyErr: false,
          managedbyHelperText: "",
        });
      }
    } else if (type === "contactname") {
      this.setState({ contactnameCheck: true });
      let contactnameVal = event.target.value;
      if (CommonConfig.isEmpty(contactnameVal)) {
        this.setState({
          ContactName: contactnameVal,
          contactnameErr: true,
          contactnameHelperText: "Please enter contact name",
        });
      } else {
        this.setState({
          ContactName: contactnameVal,
          contactnameErr: false,
          contactnameHelperText: "",
        });
      }
    } else if (type === "emailaddress") {
      this.setState({ emailaddressCheck: true });
      let emailaddressVal = event.target.value;
      if (CommonConfig.isEmpty(emailaddressVal)) {
        this.setState({
          EmailAddress: emailaddressVal,
          emailaddressErr: true,
          emailaddressHelperText: "Please enter email address",
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
    } else if (type === "phone") {
      this.setState({ phoneCheck: true });
      let regExp = /^[0-9]{10,15}$/;
      let phoneVal = event.target.value;
      if (CommonConfig.isEmpty(phoneVal)) {
        this.setState({
          Phone: phoneVal,
          phoneErr: true,
          phoneHelperText: "Please enter phone",
        });
      } else if (phoneVal.trim() !== phoneVal || !phoneVal.match(regExp)) {
        this.setState({
          Phone: phoneVal,
          phoneErr: true,
          phoneHelperText: "Please enter valid phone",
        });
      } else {
        this.setState({
          Phone: phoneVal,
          phoneErr: false,
          phoneHelperText: "",
        });
      }
    } else if (type === "pickupcountry") {
      let pickupcountryVal = event.target.value;
      if (CommonConfig.isEmpty(pickupcountryVal)) {
        this.setState({
          PickupCountry: pickupcountryVal,
          PickupCityZipErr: true,
          PickupCityZipHelperText: "Please enter pickupcountry",
        });
      } else {
        this.setState({
          PickupCountry: pickupcountryVal,
          PickupCityZipErr: false,
          PickupCityZipHelperText: "",
        });
      }
    } else if (type === "pickupcity") {
      let pickupcityVal = event.target.value;
      if (CommonConfig.isEmpty(pickupcityVal)) {
        this.setState({
          PickupCity: pickupcityVal,
          pickupcityErr: true,
          pickupcityHelperText: "Please enter pickupcity",
        });
      } else {
        this.setState({
          PickupCity: pickupcityVal,
          pickupcityErr: false,
          pickupcityHelperText: "",
        });
      }
    } else if (type === "pickupcityzip") {
      let pickupcityzipVal = event.target.value;
      if (CommonConfig.isEmpty(pickupcityzipVal)) {
        this.setState({
          PickupCityZip: pickupcityzipVal,
          pickupcityzipErr: true,
          pickupcityzipHelperText: "Please enter pickup zip code",
        });
      } else {
        this.setState({
          PickupCityZip: pickupcityzipVal,
          pickupcityzipErr: false,
          pickupcityzipHelperText: "",
        });
      }
    } else if (type === "dropoffcityzip") {
      let dropoffcityval = event.target.value;
      if (CommonConfig.isEmpty(dropoffcityval)) {
        this.setState({
          DropoffCityZip: dropoffcityval,
          DropoffCityZipErr: true,
          DropoffCityZipHelperText: "Please enter dropoff zipcode",
        });
      } else {
        this.setState({
          DropoffCityZip: dropoffcityval,
          DropoffCityZipErr: false,
          DropoffCityZipHelperText: "",
        });
      }
    } else if (type === "pickupstate") {
      let pickupstateVal = event.target.value;
      if (CommonConfig.isEmpty(pickupstateVal)) {
        this.setState({
          PickupState: pickupstateVal,
          pickupstateErr: true,
          pickupstateHelperText: "Please enter pickup state",
        });
      } else {
        this.setState({
          PickupState: pickupstateVal,
          pickupstateErr: false,
          pickupstateHelperText: "",
        });
      }
    } else if (type === "dropoffcountry") {
      let dropoffcountryVal = event.target.value;
      if (CommonConfig.isEmpty(dropoffcountryVal)) {
        this.setState({
          DropoffCountry: dropoffcountryVal,
          dropoffcountryErr: true,
          dropoffcountryHelperText: "Please enter dropoff country",
        });
      } else {
        this.setState({
          DropoffCountry: dropoffcountryVal,
          dropoffcountryErr: false,
          dropoffcountryHelperText: "",
        });
      }
    } else if (type === "dropoffstate") {
      let dropoffstateVal = event.target.value;
      if (CommonConfig.isEmpty(dropoffstateVal)) {
        this.setState({
          DropoffState: dropoffstateVal,
          dropoffstateErr: true,
          dropoffstateHelperText: "Please enter dropoff state",
        });
      } else {
        this.setState({
          DropoffState: dropoffstateVal,
          dropoffstateErr: false,
          dropoffstateHelperText: "",
        });
      }
    } else if (type === "dropoffcity") {
      let dropoffcityVal = event.target.value;
      if (CommonConfig.isEmpty(dropoffcityVal)) {
        this.setState({
          DropoffCity: dropoffcityVal,
          dropoffcityErr: true,
          dropoffcityHelperText: "Please enter dropoff city",
        });
      } else {
        this.setState({
          DropoffCity: dropoffcityVal,
          dropoffcityErr: false,
          dropoffcityHelperText: "",
        });
      }
    } else if (type === "followupdate") {
      let followupdateVal = event.target.value;
      if (CommonConfig.isEmpty(followupdateVal)) {
        this.setState({
          FollowupDate: followupdateVal,
          followupdateErr: true,
          followupdateHelperText: "Please enter followupdate",
        });
      } else {
        this.setState({
          FollowupDate: followupdateVal,
          followupdateErr: false,
          followupdateHelperText: "",
        });
      }
    } else if (type === "tentativedate") {
      let tentativedateVal = event.target.value;
      if (CommonConfig.isEmpty(tentativedateVal)) {
        this.setState({
          TentativeDate: tentativedateVal,
          tentativedateErr: true,
          tentativedateHelperText: "Please enter tentative date",
        });
      } else {
        this.setState({
          TentativeDate: tentativedateVal,
          tentativedateErr: false,
          tentativedateHelperText: "",
        });
      }
    } else if (type === "referredby") {
      let referredbyVal = event.target.value;
      console.log("checkmandetvalue", referredbyVal);
      if (CommonConfig.isEmpty(referredbyVal)) {
        this.setState({
          ReferredBy: referredbyVal,
          referredbyErr: true,
          referredbyHelperText: "Please enter referredby",
        });
      } else {
        this.setState({
          ReferredBy: referredbyVal,
          referredbyErr: false,
          referredbyHelperText: "",
        });
      }
    } else if (type === "leadipaddress") {
      let leadipaddressVal = event.target.value;
      if (CommonConfig.isEmpty(leadipaddressVal)) {
        this.setState({
          LeadIPAddress: leadipaddressVal,
          leadipaddressErr: true,
          leadipaddressHelperText: "Please enter lead ip address",
        });
      } else {
        this.setState({
          LeadIPAddress: leadipaddressVal,
          leadipaddressErr: false,
          leadipaddressHelperText: "",
        });
      }
    } else if (type === "deliverytype") {
      let deliverytypeVal = event.target.value;
      if (CommonConfig.isEmpty(deliverytypeVal)) {
        this.setState({
          DeliveryType: deliverytypeVal,
          deliverytypeErr: true,
          deliverytypeHelperText: "Please enter delivery type",
        });
      } else {
        this.setState({
          DeliveryType: deliverytypeVal,
          deliverytypeErr: false,
          deliverytypeHelperText: "",
        });
      }
    } else if (type === "comments") {
      let commentsVal = event.target.value;
      if (CommonConfig.isEmpty(commentsVal)) {
        this.setState({
          Comments: commentsVal,
          commentsErr: true,
          commentsHelperText: "Please enter comments",
        });
      } else {
        this.setState({
          Comments: commentsVal,
          commentsErr: false,
          commentsHelperText: "",
        });
      }
    }
  };

  GetCountry = () => {
    try {
      this.showLoader();
      api
        .get("location/getCountryList")
        .then((res) => {
          if (res.success) {
            var Country = res.data;
            this.setState(
              {
                CountryList: Country,
              },
              function() {
                if (this.props.history.location.state.id !== "") {
                  this.getSalesLeadData();
                }
              }
            );
            this.hideLoader();
          }
        })
        .catch((err) => {
          console.log("error....", err);
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {
      cogoToast.error("Something Went Wrong");
    }
  };

  async componentDidMount() {
    this.setState({
      ReadAccess: CommonConfig.getUserAccess("Sales Lead").ReadAccess,
      WriteAccess: CommonConfig.getUserAccess("Sales Lead").WriteAccess,
      DeleteAccess: CommonConfig.getUserAccess("Sales Lead").DeleteAccess,
    });
    await this.GetCountry();
    await this.managedBy();
    if (this.props.history.location.state.id !== "") {
      await this.getCommunicationList();
    }
    //  await this.getSalesLeadData();
  }

  reCallApi = async () => {
    if (this.props.history.location.state.id !== "") {
      await this.getCommunicationList();
      await this.getSalesLeadData();
    }
  };

  async getSalesLeadData() {
    try {
      var data = {
        SalesLeadManagementID:
          this.props.history.location.state &&
          this.props.history.location.state.id
            ? this.props.history.location.state.id
            : null,
      };
      this.showLoader();

      let result = await api.post("salesLead/getSalesLeadDetailsById", data);
      if (result.data.success) {
        var pickupcountry = _.filter(this.state.CountryList, {
          CountryID: result.data.data.FromCountryID,
        });
        var dropoffcountry = _.filter(this.state.CountryList, {
          CountryID: result.data.data.ToCountryID,
        });
        let selectedPickUPCountry = {
          value: pickupcountry[0].CountryID,
          label: pickupcountry[0].CountryName,
        };

        let selectedDropoffCountry = {
          value: dropoffcountry[0].CountryID,
          label: dropoffcountry[0].CountryName,
        };
        let fromstateData = await this.getState(selectedPickUPCountry);

        let toStateData = await this.getState(selectedDropoffCountry);

        if (fromstateData.success) {
          this.setState({
            fromStateList: fromstateData.data,
            fromStateAutoComplete: fromstateData.data.length ? true : false,
          });
        }

        if (toStateData.success) {
          this.setState({
            toStateList: toStateData.data,
            toStateAutoComplete: toStateData.data.length ? true : false,
          });
        }
        var managedBY = this.state.managedby.find(
          (x) => x.PersonID === result.data.data.ManagedBy
        );
        var toState = this.state.toStateList.find(
          (x) => x.StateName === result.data.data.ToState
        );
        var selectedManagedby = {};
        var selectedtoState = {};

        if (toState !== undefined && toState !== null) {
          selectedtoState = {
            value: toState.StateName,
            label: toState.StateName,
          };
        }

        var fromState = this.state.fromStateList.find(
          (x) => x.StateName === result.data.data.FromState
        );
        var selectedfromstate = {};

        if (fromState !== undefined && fromState !== null) {
          selectedfromstate = {
            value: fromState.StateName,
            label: fromState.StateName,
          };
        }

        if (managedBY !== undefined && managedBY !== null) {
          selectedManagedby = {
            value: managedBY.PersonID,
            label: managedBY.Name,
          };
        }

        this.setState({
          newurl: result.data.data.newurl,
          ProposalType: result.data.data.SalesLeadsType,
          SalesLeadManagementID: result.data.data.SalesLeadManagementID,
          ProposalStatus: result.data.data.ProposalStatus,
          selectedWorkingOnRequest: selectedManagedby,
          DeliveryType: result.data.data.DeliveryType,
          ContactName: result.data.data.ContactName,
          CompanyName: result.data.data.CompanyName,
          EmailAddress: result.data.data.Email,
          ContactNum: result.data.data.PhoneNumber,
          EmailAdd: result.data.data.Email,
          PhoneCount: result.data.data.PhoneCount,
          EmailCount: result.data.data.EmailCount,
          Phone: result.data.data.PhoneNumber,
          selectedPickUPCountry: selectedPickUPCountry,
          PickupCity: result.data.data.FromCity,
          PickupState: this.state.fromStateAutoComplete
            ? selectedfromstate
            : result.data.data.FromState,
          PickupCityZip: result.data.data.FromZipCode,
          DropoffCityZip: result.data.data.ToZipCode,
          selectedDropoffCountry: selectedDropoffCountry,
          DropoffState: this.state.toStateAutoComplete
            ? selectedtoState
            : result.data.data.ToState,
          DropoffCity: result.data.data.ToCity,
          LeadDate: CommonConfig.isEmpty(result.data.data.CreatedOn)
            ? moment().format("MM/DD/YYYY")
            : moment(result.data.data.CreatedOn).format("MM/DD/YYYY"),
          TentativeDate: moment(result.data.data.TentativeMoveDate).isValid()
            ? result.data.data.TentativeMoveDate
            : "",
          ReferredBy: result.data.data.ReferredBy,
          LeadIPAddress: result.data.data.IPAddress,
          MACAddress: result.data.data.MACAddress,
          Comment: result.data.data.Comments,
          CreatedOn: result.data.data.CreatedOn,
          UpdatedOn: result.data.data.UpdatedOn,
          Status: result.data.data.Status,
          StartDate: moment(result.data.data.SalesLeadFollowupDate).isValid()
            ? result.data.data.SalesLeadFollowupDate
            : "",
          EndDate: result.data.data.EndDate,
          NoteList: result.data.data.NoteList,
        });
        let packList = result.data.data.PackageList.filter(
          (x) =>
            x.PackageType === 1 || x.PackageType === 2 || x.PackageType === 3
        );
        let tvList = result.data.data.PackageList.filter(
          (x) => x.PackageType === 4
        );
        let carList = result.data.data.PackageList.filter(
          (x) => x.PackageType === 5
        );
        if (packList.length > 0) {
          var j = 1;
          packList.map((Obj) => {
            Obj.Index = j;
            j++;
            return Obj;
          });
          this.setState({
            IsPackageVisible: true,
          });
        }
        if (tvList.length > 0) {
          var j = 1;
          tvList.map((Obj) => {
            Obj.Index = j;
            j++;
            return Obj;
          });
          this.setState({
            IsTvVisible: true,
          });
        }
        if (carList.length > 0) {
          var j = 1;
          carList.map((Obj) => {
            Obj.Index = j;
            j++;
            return Obj;
          });
          this.setState({
            IsCarVisible: true,
          });
        }
        var PckgList = packList;
        for (var i = 0; i < PckgList.length; i++) {
          if (PckgList[i].PackageType === 2) {
            PckgList[i].ActualWeight = 0.5;
            PckgList[i].Quantity = 1;
            PckgList[i].DimensionL = 10;
            PckgList[i].DimensionW = 13;
            PckgList[i].DimensionH = 1;
            PckgList[i].ChargeableWeight = 0.5;
            PckgList[i].CFT = 0.0;
          }
        }
        this.setState({
          PackageList: PckgList,
          CarList: carList,
          TVList: tvList,
        });
        // if(PckgList.length === 0){
        //   this.handleAddRow();
        // }
        // if(carList.length === 0){
        //   this.addCarRow();
        // }
        // if(tvList.length === 0){
        //   this.addTVRow();
        // }
        this.Calculate();
        if (result.data.data.NoteList.length > 0) {
          var k = 1;
          result.data.data.NoteList.map((Obj) => {
            Obj.Index = k;
            k++;
            return Obj;
          });
          var l = 1;
          result.data.data.NoteList.map((Obj) => {
            Obj.disabled = l;
            l++;
            return Obj;
          });
          this.setState({ notes: this.state.NoteList, notesDisabled: true });
          this.handleAddNotesRow();
        } else {
          this.handleAddNotesRow();
        }
        this.hideLoader();
      } else {
        this.hideLoader();
        cogoToast.error("Something Went Wrong");
      }
    } catch (err) {
      console.log("error...", err);
      cogoToast.error("Something went wrong");
    }
  }

  getCommunicationList() {
    try {
      let data = {
        EntityID:
          this.props.history.location.state &&
          this.props.history.location.state.id
            ? this.props.history.location.state.id
            : null,
        EntityType: "SalesLead",
      };
      api
        .post("scheduleshipment/getCommuncationDetail", data)
        .then((result) => {
          if (result.success) {
            this.setState({ CommuncationList: result.data });
          } else {
            this.hideLoader();
            cogoToast.error("Something went wrong");
          }
        })
        .catch((err) => {
          console.log("error......", err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  async getState(countryData) {
    try {
      let data = {
        countryId: countryData.value,
      };

      let res = api.post("location/getStateList", data);

      return res;
    } catch (error) {}
  }

  handleZipChange = (event, type) => {
    if (type === "pickupcityzip") {
      var Zipcode = event.target.value;

      var FinalCity = [];
      fetch(
        CommonConfig.zipCodeAPIKey(
          Zipcode,
          this.state.selectedPickUPCountry.label
        )
      )
        .then((result) => result.json())
        .then((data) => {
          if (data["status"] === "OK") {
            var IsValidCountry = false;
            var countryShortName = _.filter(
              data["results"][0]["address_components"],
              function(data) {
                return data.types[0] === "country";
              }
            )[0].long_name;

            if (this.state.selectedPickUPCountry.label === countryShortName) {
              IsValidCountry = true;
            }
            if (IsValidCountry) {
              if (
                data["results"][0] &&
                data["results"][0].hasOwnProperty("postcode_localities")
              ) {
                // var CityData = data["results"][0]["postcode_localities"];
                // _.forEach(CityData, function(value, key) {
                //   FinalCity.push({
                //     City_code: value,
                //     CityName: value,
                //   });
                // });

                // var CityData = _.filter(
                //   data["results"][0]["address_components"],
                //   function(data) {
                //     return data.types[0] === "locality";
                //   }
                // )[0].long_name;

                // FinalCity.push({
                //   City_code: CityData,
                //   CityName: CityData,
                // });

                var CityData = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    if (data.types[0] == "locality") {
                      return data.types[0] === "locality";
                    }
                  }
                );

                var CityData2 = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    if (data.types[0] == "neighborhood") {
                      return data.types[0] === "neighborhood";
                    }
                  }
                );

                var CityData3 = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    if (data.types[0] == "administrative_area_level_2") {
                      return data.types[0] === "administrative_area_level_2";
                    }
                  }
                );

                var CityData4 = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    if (data.types[0] == "administrative_area_level_1") {
                      return data.types[0] === "administrative_area_level_1";
                    }
                  }
                );

                if (CityData.length > 0) {
                  CityData = CityData[0].long_name;
                  FinalCity.push({
                    City_code: CityData,
                    CityName: CityData,
                  });
                } else if (CityData2.length > 0) {
                  CityData2 = CityData2[0].long_name;
                  FinalCity.push({
                    City_code: CityData2,
                    CityName: CityData2,
                  });
                } else if (CityData3.length > 0) {
                  CityData3 = CityData3[0].long_name;
                  FinalCity.push({
                    City_code: CityData3,
                    CityName: CityData3,
                  });
                } else if (CityData4.length > 0) {
                  CityData4 = CityData4[0].long_name;
                  FinalCity.push({
                    City_code: CityData4,
                    CityName: CityData4,
                  });
                }

                var state = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    return data.types[0] === "administrative_area_level_1";
                  }
                )[0].long_name;

                var SelectedState = { value: state, label: state };

                if (
                  FinalCity[0].CityName === "" ||
                  FinalCity[0].CityName === null ||
                  FinalCity[0].CityName === undefined
                ) {
                  this.setState({ PickupCityInput: true });
                } else {
                  this.setState({ PickupCityInput: false });
                }

                this.setState({
                  PickupCityList: FinalCity,
                  PickupCity: FinalCity[0].CityName,
                  PickupState: this.state.fromStateList.length
                    ? SelectedState
                    : state,
                  fromStateAutoComplete: this.state.fromStateList.length
                    ? true
                    : false,
                });
              } else if (data["results"][0]) {
                var city = "";

                if (
                  city === "" &&
                  _.filter(data["results"][0]["address_components"], function(
                    data
                  ) {
                    return data.types[0] === "locality";
                  }).length > 0
                ) {
                  city = _.filter(
                    data["results"][0]["address_components"],
                    function(data) {
                      return data.types[0] === "locality";
                    }
                  )[0].short_name;
                } else if (
                  city === "" &&
                  _.filter(data["results"][0]["address_components"], function(
                    data
                  ) {
                    return data.types[0] === "administrative_area_level_3";
                  }).length > 0
                ) {
                  city = _.filter(
                    data["results"][0]["address_components"],
                    function(data) {
                      return data.types[0] === "administrative_area_level_3";
                    }
                  )[0].short_name;
                } else if (
                  city === "" &&
                  _.filter(data["results"][0]["address_components"], function(
                    data
                  ) {
                    return data.types[0] === "political";
                  }).length > 0
                ) {
                  city = _.filter(
                    data["results"][0]["address_components"],
                    function(data) {
                      return data.types[0] === "political";
                    }
                  )[0].short_name;
                } else if (
                  city === "" &&
                  _.filter(data["results"][0]["address_components"], function(
                    data
                  ) {
                    return data.types[0] === "neighborhood";
                  }).length > 0
                ) {
                  city = _.filter(
                    data["results"][0]["address_components"],
                    function(data) {
                      return data.types[0] === "neighborhood";
                    }
                  )[0].short_name;
                } else if (
                  city == "" &&
                  _.filter(data["results"][0]["address_components"], function(
                    data
                  ) {
                    return data.types[0] === "administrative_area_level_1";
                  }).length > 0
                ) {
                  city = _.filter(
                    data["results"][0]["address_components"],
                    function(data) {
                      return data.types[0] === "administrative_area_level_2";
                    }
                  )[0].long_name;
                } else if (
                  city == "" &&
                  _.filter(data["results"][0]["address_components"], function(
                    data
                  ) {
                    return data.types[0] === "administrative_area_level_1";
                  }).length > 0
                ) {
                  city = _.filter(
                    data["results"][0]["address_components"],
                    function(data) {
                      return data.types[0] === "administrative_area_level_1";
                    }
                  )[0].long_name;
                } else if (city === "") {
                  city = "";
                }

                state = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    return data.types[0] === "administrative_area_level_1";
                  }
                )[0].long_name;

                FinalCity.push({
                  Citycode: city,
                  CityName: city,
                });

                if (
                  FinalCity[0].CityName === "" ||
                  FinalCity[0].CityName === null ||
                  FinalCity[0].CityName === undefined
                ) {
                  this.setState({ PickupCityInput: true });
                } else {
                  this.setState({ PickupCityInput: false });
                }

                var SelectedState = { value: state, label: state };

                this.setState({
                  PickupState: this.state.fromStateList.length
                    ? SelectedState
                    : state,
                  fromStateAutoComplete: this.state.fromStateList.length
                    ? true
                    : false,
                  PickupCity: FinalCity[0].CityName,
                  PickupCityList: FinalCity,
                });
              } else {
                this.setState({
                  PickupCity: "",
                  fromStateAutoComplete: this.state.fromStateList.length
                    ? true
                    : false,
                  PickupCityInput: true,
                  PickupState: "",
                  PickupCityList: [],
                });
              }
            } else {
              this.setState({
                PickupCity: "",
                fromStateAutoComplete: this.state.fromStateList.length
                  ? true
                  : false,
                PickupState: "",
                PickupCityList: [],
                PickupCityInput: true,
              });
            }
          } else {
            cogoToast.error("Zip code not found");
            // this.setState({
            //   fromStateAutoComplete: this.state.fromStateList.length
            //     ? true
            //     : false,
            //   PickupCity: "",
            //   PickupState: "",
            //   PickupCityList: [],
            //   PickupCityInput: true,
            // });
          }
        });
    } else if (type === "dropoffcityzip") {
      var zip = event.target.value;
      var finalCity = [];
      fetch(
        CommonConfig.zipCodeAPIKey(zip, this.state.selectedDropoffCountry.label)
      )
        .then((result) => result.json())
        .then((data) => {
          if (data["status"] === "OK") {
            var IsValidCountry = false;
            var countryShortName = _.filter(
              data["results"][0]["address_components"],
              function(data) {
                return data.types[0] === "country";
              }
            )[0].long_name;

            if (this.state.selectedDropoffCountry.label === countryShortName) {
              IsValidCountry = true;
            }

            if (IsValidCountry) {
              if (
                data["results"][0] &&
                data["results"][0].hasOwnProperty("postcode_localities")
              ) {
                // var CityData = data["results"][0]["postcode_localities"];
                // _.forEach(CityData, function(value, key) {
                //   finalCity.push({
                // Citycode: value,
                // CityName: value,
                //   });
                // });
                var CityData = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    return data.types[0] === "locality";
                  }
                )[0].long_name;

                finalCity.push({
                  Citycode: CityData,
                  CityName: CityData,
                });

                var CityData = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    if (data.types[0] == "locality") {
                      return data.types[0] === "locality";
                    }
                  }
                );

                var CityData2 = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    if (data.types[0] == "neighborhood") {
                      return data.types[0] === "neighborhood";
                    }
                  }
                );

                var CityData3 = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    if (data.types[0] == "administrative_area_level_2") {
                      return data.types[0] === "administrative_area_level_2";
                    }
                  }
                );

                var CityData4 = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    if (data.types[0] == "administrative_area_level_1") {
                      return data.types[0] === "administrative_area_level_1";
                    }
                  }
                );

                if (CityData.length > 0) {
                  CityData = CityData[0].long_name;
                  finalCity.push({
                    Citycode: CityData,
                    CityName: CityData,
                  });
                } else if (CityData2.length > 0) {
                  CityData2 = CityData2[0].long_name;
                  finalCity.push({
                    Citycode: CityData2,
                    CityName: CityData2,
                  });
                } else if (CityData3.length > 0) {
                  CityData3 = CityData3[0].long_name;
                  finalCity.push({
                    Citycode: CityData3,
                    CityName: CityData3,
                  });
                } else if (CityData4.length > 0) {
                  CityData4 = CityData4[0].long_name;
                  finalCity.push({
                    Citycode: CityData4,
                    CityName: CityData4,
                  });
                }

                var state = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    return data.types[0] === "administrative_area_level_1";
                  }
                )[0].long_name;

                var SelectedState = { value: state, label: state };

                if (
                  finalCity[0].CityName === "" ||
                  finalCity[0].CityName === null ||
                  finalCity[0].CityName === undefined
                ) {
                  this.setState({ DropoffCityInput: true });
                } else {
                  this.setState({ DropoffCityInput: false });
                }

                this.setState({
                  DropoffState: this.state.toStateList.length
                    ? SelectedState
                    : state,
                  toStateAutoComplete: this.state.toStateList.length
                    ? true
                    : false,
                  DropoffCityList: finalCity,
                  DropoffCity: finalCity[0].CityName,
                });
              } else if (data["results"][0]) {
                var city = "";

                if (
                  city === "" &&
                  _.filter(data["results"][0]["address_components"], function(
                    data
                  ) {
                    return data.types[0] === "locality";
                  }).length > 0
                ) {
                  city = _.filter(
                    data["results"][0]["address_components"],
                    function(data) {
                      return data.types[0] === "locality";
                    }
                  )[0].short_name;
                } else if (
                  city === "" &&
                  _.filter(data["results"][0]["address_components"], function(
                    data
                  ) {
                    return data.types[0] === "administrative_area_level_3";
                  }).length > 0
                ) {
                  city = _.filter(
                    data["results"][0]["address_components"],
                    function(data) {
                      return data.types[0] === "administrative_area_level_3";
                    }
                  )[0].short_name;
                } else if (
                  city === "" &&
                  _.filter(data["results"][0]["address_components"], function(
                    data
                  ) {
                    return data.types[0] === "political";
                  }).length > 0
                ) {
                  city = _.filter(
                    data["results"][0]["address_components"],
                    function(data) {
                      return data.types[0] === "political";
                    }
                  )[0].short_name;
                } else if (
                  city === "" &&
                  _.filter(data["results"][0]["address_components"], function(
                    data
                  ) {
                    return data.types[0] === "neighborhood";
                  }).length > 0
                ) {
                  city = _.filter(
                    data["results"][0]["address_components"],
                    function(data) {
                      return data.types[0] === "neighborhood";
                    }
                  )[0].short_name;
                } else if (
                  city == "" &&
                  _.filter(data["results"][0]["address_components"], function(
                    data
                  ) {
                    return data.types[0] === "administrative_area_level_2";
                  }).length > 0
                ) {
                  city = _.filter(
                    data["results"][0]["address_components"],
                    function(data) {
                      return data.types[0] === "administrative_area_level_2";
                    }
                  )[0].long_name;
                } else if (
                  city == "" &&
                  _.filter(data["results"][0]["address_components"], function(
                    data
                  ) {
                    return data.types[0] === "administrative_area_level_1";
                  }).length > 0
                ) {
                  city = _.filter(
                    data["results"][0]["address_components"],
                    function(data) {
                      return data.types[0] === "administrative_area_level_1";
                    }
                  )[0].long_name;
                } else if (city === "") {
                  city = "";
                }

                state = _.filter(
                  data["results"][0]["address_components"],
                  function(data) {
                    return data.types[0] === "administrative_area_level_1";
                  }
                )[0].long_name;

                finalCity.push({
                  Citycode: city,
                  CityName: city,
                });

                if (
                  finalCity[0].CityName === "" ||
                  finalCity[0].CityName === null ||
                  finalCity[0].CityName === undefined
                ) {
                  this.setState({ DropoffCityInput: true });
                } else {
                  this.setState({ DropoffCityInput: false });
                }

                var SelectedState = { value: state, label: state };

                this.setState({
                  DropoffState: this.state.toStateList.length
                    ? SelectedState
                    : state,
                  toStateAutoComplete: this.state.toStateList.length
                    ? true
                    : false,
                  DropoffCity: finalCity[0].CityName,
                  DropoffCityList: finalCity,
                });
              } else {
                this.setState({
                  DropoffCity: "",
                  DropoffState: "",
                  DropoffCityList: [],
                  DropoffCityInput: true,
                  toStateAutoComplete: this.state.toStateList.length
                    ? true
                    : false,
                });
              }
            } else {
              this.setState({
                DropoffCity: "",
                toStateAutoComplete: this.state.toStateList.length
                  ? true
                  : false,
                DropoffState: "",
                DropoffCityList: [],
                DropoffCityInput: true,
              });
            }
          } else {
            cogoToast.error("Zip code not found");
            // this.setState({
            //   DropoffCityInput: true,
            //   DropoffCityList: [],
            //   toStateAutoComplete: this.state.toStateList.length ? true : false,
            //   DropoffCity: "",
            //   DropoffState: "",
            // });
          }
        });
    }
  };

  handleAddRow = () => {
    const row = {
      Quantity: 0,
      ActualWeight: 0,
      DimensionL: 0,
      DimensionW: 0,
      DimensionH: 0,
      PackageType: 0,
      Status: "Active",
      SalesLeadPackageDetailID: null,
      SalesLeadManagementID: this.state.SalesLeadManagementID,
      ChargeableWeight: 0,
      CFT: 0,
      CreatedBy: null,
      UpdatedBy: null,
      CreatedOn: null,
      UpdatedOn: null,
      Index: this.state.PackageList.length + 1,
    };
    this.setState({ PackageList: [...this.state.PackageList, row] });
  };

  addCarRow = () => {
    const row = {
      Quantity: 1,
      ActualWeight: 0,
      DimensionL: 0,
      DimensionW: 0,
      DimensionH: 0,
      PackageType: 5,
      Status: "Active",
      SalesLeadPackageDetailID: null,
      SalesLeadManagementID: this.state.SalesLeadManagementID,
      ChargeableWeight: 0,
      CFT: 0,
      CarMake: "",
      CarModel: "",
      CarYear: "",
      CreatedBy: null,
      UpdatedBy: null,
      CreatedOn: null,
      UpdatedOn: null,
      Index: this.state.CarList.length + 1,
    };
    this.setState({ CarList: [...this.state.CarList, row] });
  };

  addTVRow = () => {
    const row = {
      Quantity: 0,
      ActualWeight: 0,
      DimensionL: 0,
      DimensionW: 0,
      DimensionH: 0,
      PackageType: 4,
      Status: "Active",
      SalesLeadPackageDetailID: null,
      SalesLeadManagementID: this.state.SalesLeadManagementID,
      ChargeableWeight: 0,
      CFT: 0,
      CarMake: "",
      TVMake: "",
      TVModel: "",
      CarModel: "",
      CarYear: "",
      CreatedBy: null,
      UpdatedBy: null,
      CreatedOn: null,
      UpdatedOn: null,
      Index: this.state.TVList.length + 1,
    };
    this.setState({ TVList: [...this.state.TVList, row] });
  };

  Calculate = () => {
    if (
      this.state.selectedPickUPCountry.value &&
      this.state.selectedDropoffCountry.value
    ) {
      var TotalChargeWeight = 0;
      var TotalCFT = 0;
      var TotalWeight = 0;
      var TotalChargable = 0;

      var PackageList = [...this.state.PackageList];
      for (var i = 0; i < PackageList.length; i++) {
        var WE = 0;
        var LE = 0;
        var HE = 0;
        var Total = 0;
        var Weight = 0;
        var CFT = 0;
        var Chargable = 0;

        if (PackageList[i].ActualWeight) {
          Weight = PackageList[i].ActualWeight * PackageList[i].Quantity;
        }

        if (PackageList[i].DimensionW) {
          WE = PackageList[i].DimensionW;
        }

        if (PackageList[i].DimensionL) {
          LE = PackageList[i].DimensionL;
        }

        if (PackageList[i].DimensionH) {
          HE = PackageList[i].DimensionH;
        }

        if (
          this.state.selectedPickUPCountry.value === 202 &&
          this.state.selectedDropoffCountry.value === 202
        ) {
          Total =
            Math.ceil(parseFloat((WE * LE * HE) / 166)) *
            PackageList[i].Quantity;
        } else {
          Total =
            Math.ceil(parseFloat((WE * LE * HE) / 139)) *
            PackageList[i].Quantity;
        }

        if (
          this.state.selectedPickUPCountry.value === 89 &&
          this.state.selectedDropoffCountry.value === 202
        ) {
          Total =
            Math.ceil(parseFloat(parseFloat(Total) / parseFloat(2.2))) *
            PackageList[i].Quantity;
        }

        if (Weight > Total) {
          PackageList[i].ChargeableWeight = Weight;
          TotalChargeWeight = parseInt(TotalChargeWeight) + parseInt(Weight);
        } else {
          PackageList[i].ChargeableWeight = Total;
          TotalChargeWeight = parseInt(TotalChargeWeight) + parseInt(Total);
        }

        if (PackageList[i].ChargeableWeight) {
          Chargable = PackageList[i].ChargeableWeight;
        }
        CFT = Math.ceil(
          parseFloat((WE * LE * HE) / 1728) * PackageList[i].Quantity
        );
        PackageList[i].CFT = CFT;
        TotalWeight = TotalWeight + Weight;
        TotalCFT = TotalCFT + CFT;
        TotalChargable = TotalChargable + Chargable;
      }
      this.setState({ PackageList: PackageList });
    }
  };

  handleChangePackage = (idx) => (event) => {
    const { name, value } = event.target;
    const PackageList = [...this.state.PackageList];
    let index = PackageList.findIndex((x) => x.Index === idx);
    PackageList[index][name] = value.replace(/\D/, "");
    this.setState({ PackageList: PackageList });
    this.Calculate();
  };

  handleCarChange = (idx) => (event) => {
    const { name, value } = event.target;
    const CarList = [...this.state.CarList];
    let index = CarList.findIndex((x) => x.Index === idx);
    CarList[index][name] = value;
    this.setState({ CarList: CarList });
  };

  handleTVChange = (idx) => (event) => {
    const { name, value } = event.target;
    const TVList = [...this.state.TVList];
    let index = TVList.findIndex((x) => x.Index === idx);
    TVList[index][name] = value;
    this.setState({ TVList: TVList });
  };

  handleChangePackagecontent = (idx) => (event) => {
    const { value } = event.target;
    const PackageList = [...this.state.PackageList];
    let index = PackageList.findIndex((x) => x.Index === idx);
    PackageList[index]["PackageType"] = value;
    if (value === 2) {
      PackageList[index]["ActualWeight"] = 0.5;
      PackageList[index]["Quantity"] = 1;
      PackageList[index]["DimensionL"] = 10;
      PackageList[index]["DimensionW"] = 13;
      PackageList[index]["DimensionH"] = 1;
      PackageList[index]["ChargeableWeight"] = 0.5;
      PackageList[index]["CFT"] = 0.0;
      this.setState({ PackageList: PackageList });
    } else {
      PackageList[index]["ActualWeight"] = 0;
      PackageList[index]["DimensionL"] = 0;
      PackageList[index]["DimensionW"] = 0;
      PackageList[index]["DimensionH"] = 0;
      PackageList[index]["ChargeableWeight"] = 0;
      PackageList[index]["CFT"] = 0;
      this.setState({ PackageList: PackageList });
    }
  };

  handlePackageRemoveRow = (Index) => () => {
    const packageRemove = [...this.state.PackageList];
    var packageIndex = this.state.PackageList.findIndex(
      (x) => x.Index === Index
    );
    if (packageIndex !== -1) {
      packageRemove[packageIndex]["Status"] = "Inactive";
      if (packageRemove.filter((x) => x.Status === "Active").length === 0) {
        this.setState({
          IsPackageVisible: false,
        });
      }
      this.setState({ PackageList: packageRemove });
    }
  };

  removeCarRow = (Index) => () => {
    const packageRemove = [...this.state.CarList];
    var packageIndex = this.state.CarList.findIndex((x) => x.Index === Index);
    if (packageIndex !== -1) {
      packageRemove[packageIndex]["Status"] = "Inactive";
      if (packageRemove.filter((x) => x.Status === "Active").length === 0) {
        this.setState({
          IsCarVisible: false,
        });
      }
      this.setState({ CarList: packageRemove });
    }
  };

  removeTVRow = (Index) => () => {
    const packageRemove = [...this.state.TVList];
    var packageIndex = this.state.TVList.findIndex((x) => x.Index === Index);
    if (packageIndex !== -1) {
      packageRemove[packageIndex]["Status"] = "Inactive";
      if (packageRemove.filter((x) => x.Status === "Active").length === 0) {
        this.setState({
          IsTvVisible: false,
        });
      }
      this.setState({ TVList: packageRemove });
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

  Packagecontent = () => {
    return this.state.packageType.map((content) => {
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

  otherPackagecontent = () => {
    return this.state.otherPackageType.map((content) => {
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

  Proposaltype = () => {
    return this.state.proposaltype.map((content) => {
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
  // otherPackagecontent
  viewPackages = () => {
    return this.state.PackageList.filter((x) => x.Status === "Active").map(
      (packages, idx) => {
        return (
          <tr>
            <td>
              <input
                type="text"
                name="Quantity"
                value={packages.Quantity}
                onChange={this.handleChangePackage(packages.Index)}
                disabled={packages.PackageType === 2 ? true : false}
              />
            </td>
            <td>
              <div className="table-select">
                <FormControl className={classes.formControl} fullWidth>
                  <Select
                    id="package_number"
                    name="package_number"
                    className="form-control"
                    value={packages.PackageType}
                    onChange={this.handleChangePackagecontent(packages.Index)}
                  >
                    {this.Packagecontent()}
                  </Select>
                </FormControl>
              </div>
            </td>

            <td>
              <input
                type={Text}
                name="ActualWeight"
                value={packages.ActualWeight}
                onChange={this.handleChangePackage(packages.Index)}
                disabled={packages.PackageType === 2 ? true : false}
              />
            </td>
            <td>
              <input
                type={Text}
                name="DimensionL"
                value={packages.DimensionL}
                onChange={this.handleChangePackage(packages.Index)}
                disabled={packages.PackageType === 2 ? true : false}
              />
            </td>
            <td>
              <input
                type={Text}
                name="DimensionW"
                value={packages.DimensionW}
                onChange={this.handleChangePackage(packages.Index)}
                disabled={packages.PackageType === 2 ? true : false}
              />
            </td>
            <td>
              <input
                type={Text}
                name="DimensionH"
                value={packages.DimensionH}
                onChange={this.handleChangePackage(packages.Index)}
                disabled={packages.PackageType === 2 ? true : false}
              />
            </td>
            <td>
              <input
                type={Text}
                name="ChargeableWeight"
                value={packages.ChargeableWeight}
                onChange={this.handleChangePackage(packages.Index)}
                disabled={true}
              />
            </td>
            <td>
              <input
                type={Text}
                name="CFT"
                value={packages.CFT}
                onChange={this.handleChangePackage(packages.Index)}
                disabled={true}
              />
            </td>
            <td>
              <div className="pck-subbtn">
                {/* {idx !== 0 ? ( */}
                <Button
                  justIcon
                  color="danger"
                  className="Plus-btn "
                  onClick={this.handlePackageRemoveRow(packages.Index)}
                >
                  <i className={"fas fa-minus"} />
                </Button>
                {/* ) : null} */}
                {this.state.PackageList.filter((x) => x.Status === "Active")
                  .length ===
                idx + 1 ? (
                  <Button
                    justIcon
                    color="facebook"
                    onClick={() => this.handleAddRow()}
                    className="Plus-btn "
                  >
                    <i className={"fas fa-plus"} />
                  </Button>
                ) : null}
              </div>
            </td>
          </tr>
        );
      }
    );
  };

  viewCarList = () => {
    return this.state.CarList.filter((x) => x.Status === "Active").map(
      (packages, idx) => {
        return (
          <tr>
            <td>
              <input
                type={Text}
                name="Quantity"
                value={packages.Quantity}
                onChange={this.handleCarChange(packages.Index)}
              />
            </td>
            <td>
              <input
                type={Text}
                name="CarMake"
                value={packages.CarMake}
                onChange={this.handleCarChange(packages.Index)}
              />
            </td>
            <td>
              <input
                type={Text}
                name="CarModel"
                value={packages.CarModel}
                onChange={this.handleCarChange(packages.Index)}
              />
            </td>
            <td>
              <input
                type={Text}
                name="CarYear"
                value={packages.CarYear}
                onChange={this.handleCarChange(packages.Index)}
              />
            </td>
            <td>
              <div className="pck-subbtn">
                {/* {idx !== 0 ? ( */}
                <Button
                  justIcon
                  color="danger"
                  className="Plus-btn "
                  onClick={this.removeCarRow(packages.Index)}
                >
                  <i className={"fas fa-minus"} />
                </Button>
                {/* ) : null} */}
                {this.state.CarList.filter((x) => x.Status === "Active")
                  .length ===
                idx + 1 ? (
                  <Button
                    justIcon
                    color="facebook"
                    onClick={() => this.addCarRow()}
                    className="Plus-btn "
                  >
                    <i className={"fas fa-plus"} />
                  </Button>
                ) : null}
              </div>
            </td>
          </tr>
        );
      }
    );
  };

  viewTVList = () => {
    return this.state.TVList.filter((x) => x.Status === "Active").map(
      (packages, idx) => {
        return (
          <tr>
            <td>
              <input
                type={Text}
                name="TVMake"
                value={packages.TVMake}
                onChange={this.handleTVChange(packages.Index)}
              />
            </td>
            <td>
              <input
                type={Text}
                name="TVModel"
                value={packages.TVModel}
                onChange={this.handleTVChange(packages.Index)}
              />
            </td>

            <td>
              <input
                type={Text}
                name="ActualWeight"
                value={packages.ActualWeight}
                onChange={this.handleTVChange(packages.Index)}
              />
            </td>
            <td>
              <input
                type={Text}
                name="DimensionL"
                value={packages.DimensionL}
                onChange={this.handleTVChange(packages.Index)}
              />
            </td>
            <td>
              <input
                type={Text}
                name="DimensionW"
                value={packages.DimensionW}
                onChange={this.handleTVChange(packages.Index)}
              />
            </td>
            <td>
              <input
                type={Text}
                name="DimensionH"
                value={packages.DimensionH}
                onChange={this.handleTVChange(packages.Index)}
              />
            </td>
            <td>
              <input
                type={Text}
                name="ChargeableWeight"
                value={packages.ChargeableWeight}
                onChange={this.handleTVChange(packages.Index)}
                disabled={true}
              />
            </td>
            <td>
              <input
                type={Text}
                name="CFT"
                value={packages.CFT}
                onChange={this.handleTVChange(packages.Index)}
                disabled={true}
              />
            </td>
            <td>
              <div className="pck-subbtn">
                {/* {idx !== 0 ? ( */}
                <Button
                  justIcon
                  color="danger"
                  className="Plus-btn "
                  onClick={this.removeTVRow(packages.Index)}
                >
                  <i className={"fas fa-minus"} />
                </Button>
                {/* ) : null} */}
                {this.state.TVList.filter((x) => x.Status === "Active")
                  .length ===
                idx + 1 ? (
                  <Button
                    justIcon
                    color="facebook"
                    onClick={() => this.addTVRow()}
                    className="Plus-btn "
                  >
                    <i className={"fas fa-plus"} />
                  </Button>
                ) : null}
              </div>
            </td>
          </tr>
        );
      }
    );
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

  handleCancel = () => {
    localStorage.removeItem("SearchCount");
    this.props.history.push({
      pathname: "/admin/SalesLeads",
      state: {
        filterlist:
          this.props.history.location.state &&
          this.props.history.location.state.filterlist
            ? this.props.history.location.state.filterlist
            : null,
        sortlist:
          this.props.history.location.state &&
          this.props.history.location.state.sortlist
            ? this.props.history.location.state.sortlist
            : null,
        statusList:
          this.props.history.location.state &&
          this.props.history.location.state.statusList
            ? this.props.history.location.state.statusList
            : null,
        packageValue:
          this.props.history.location.state &&
          this.props.history.location.state.packageValue
            ? this.props.history.location.state.packageValue
            : null,
        statusfilter:
          this.props.history.location.state &&
          this.props.history.location.state.statusfilter
            ? this.props.history.location.state.statusfilter
            : null,
      },
    });
  };

  viewNotes = () => {
    return this.state.notes
      .filter((x) => x.Status === "Active")
      .map((notes, idx) => {
        return (
          <tr>
            <td style={{ width: "154px" }}>
              {moment(notes.CreatedOn).format(CommonConfig.dateFormat.dateTime)}
            </td>
            <td>
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
              <td style={{ width: "160px" }}>
                <a
                  target="_blank"
                  className="normal-btn"
                  href={fileBase + notes.AttachmentPath}
                >
                  View Image
                </a>
              </td>
            ) : (
              <td style={{ width: "160px" }}>
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
  async validate() {
    let IsFormValid = true;

    // if (CommonConfig.isEmpty(this.state.selectedDropoffCountry) || CommonConfig.isEmpty(this.state.DropoffCountry)) {
    //   IsFormValid = false;
    //   this.setState({
    //     dropoffcountryErr: true,
    //     dropoffcountryHelperText: "Please Enter Dropoff Country",
    //   });
    // }
    // if (CommonConfig.isEmpty(this.state.PickupCountry) || CommonConfig.isEmpty(this.state.selectedPickUPCountry) ) {
    //   IsFormValid = false;
    //   this.setState({
    //     pickupcountryErr: true,
    //     pickupcountryHelperText: "Please Enter Pickup Country",
    //   });
    // }

    if (CommonConfig.isEmpty(this.state.ProposalStatus)) {
      IsFormValid = false;
      this.setState({
        proposalstatusErr: true,
        proposalstatusHelperText: "Please Enter Proposal Status",
      });
    }
    if (CommonConfig.isEmpty(this.state.ContactName)) {
      IsFormValid = false;
      this.setState({
        contactnameErr: true,
        contactnameHelperText: "Please Enter Contact Name",
      });
    }
    if (CommonConfig.isEmpty(this.state.Phone)) {
      IsFormValid = false;
      this.setState({
        phoneErr: true,
        phoneHelperText: "Please Enter Phone Number",
      });
    }
    if (CommonConfig.isEmpty(this.state.EmailAddress)) {
      IsFormValid = false;
      this.setState({
        emailaddressErr: true,
        emailaddressHelperText: "Please Enter emailaddress",
      });
    }

    return IsFormValid;
  }

  handleBlur = (event, type) => {
    if (type === "fullname") {
      this.setState({ checkFullName: true });
      let val = event.target.value;
      if (CommonConfig.isEmpty(val)) {
        this.setState({
          fullnameErr: true,
          fullnameHelperText: "Please enter Full Name",
        });
      }
    }
  };

  handleError = () => {
    this.setState({
      ProposalTypeError: "Please select any one",
      Referrederror: "Please select any one",
      Followuprror: "Please select date",
    });
  };

  handleSave = (redirect) => {
    if (!this.state.ReferredBy) {
      document.getElementById("referrederror").style.display = "block";
      this.handleError();
      return;
    } else {
      document.getElementById("referrederror").style.display = "none";
    }

    if (!this.state.ProposalType) {
      document.getElementById("proposalTypeerror").style.display = "block";
      this.handleError();
      return;
    } else {
      document.getElementById("proposalTypeerror").style.display = "none";
    }

    if (!this.state.StartDate) {
      document.getElementById("followuprror").style.display = "block";
      this.handleError();
      return;
    } else {
      document.getElementById("followuprror").style.display = "none";
    }

    this.validate().then((res) => {
      if (res) {
        var FinalNotes = this.state.notes.filter(
          (x) => x.NoteText !== "" && x.NoteText !== null
        );

        var FinalPackage = [...this.state.PackageList, ...this.state.CarList];
        let PackageList = [...FinalPackage, ...this.state.TVList];
        if (
          !this.state.dropoffcountryErr ||
          !this.state.pickupcountryErr ||
          !this.state.dropoffcityErr ||
          !this.state.leadipaddressErr ||
          !this.state.contactnameErr ||
          !this.state.phoneErr ||
          !this.state.emailaddressErr ||
          !this.state.proposalstatusErr ||
          !this.state.pickupstateErr ||
          !this.state.dropoffstateErr ||
          !this.state.pickupcityErr ||
          !this.state.dropoffcityErr
        ) {
          var pickupState = "";

          if (this.state.fromStateAutoComplete === false) {
            pickupState = this.state.PickupState;
          } else {
            pickupState = this.state.PickupState.value;
          }

          var dropoffState = "";

          if (this.state.toStateAutoComplete === false) {
            dropoffState = this.state.DropoffState;
          } else {
            dropoffState = this.state.DropoffState.value;
          }

          let data = {
            userid: CommonConfig.loggedInUserData().PersonID,
            SalesLeadManagementID: this.state.SalesLeadManagementID,
            ManagedBy: this.state.selectedWorkingOnRequest
              ? this.state.selectedWorkingOnRequest.value
              : null,
            SalesLeadDate: moment(this.state.LeadDate)
              .format("YYYY-MM-DD HH:mm:ss")
              .toString(),
            FromCountryID: this.state.selectedPickUPCountry.value,
            ToCountryID: this.state.selectedDropoffCountry.value,
            SalesLeadsType: this.state.ProposalType,
            ContactName: this.state.ContactName,
            CompanyName: this.state.CompanyName,
            Email: this.state.EmailAddress,
            PhoneNumber: this.state.Phone,
            FromCity: this.state.PickupCity,
            FromState: pickupState,
            FromZipCode: this.state.PickupCityZip,
            ToCity: this.state.DropoffCity,
            ToState: dropoffState,
            ToZipCode: this.state.DropoffCityZip,
            SalesLeadFollowupDate: !CommonConfig.isEmpty(this.state.StartDate)
              ? moment(this.state.StartDate)
                  .format("YYYY-MM-DD HH:mm:ss")
                  .toString()
              : null,
            TentativeMoveDate: !CommonConfig.isEmpty(this.state.TentativeDate)
              ? moment(this.state.TentativeDate)
                  .format("YYYY-MM-DD HH:mm:ss")
                  .toString()
              : null,
            ReferredBy: this.state.ReferredBy,
            IPAddress: this.state.LeadIPAddress,
            MACAddress: null,
            DeliveryType: this.state.DeliveryType,
            ProposalStatus: this.state.ProposalStatus,
            PackageList: PackageList,
            NoteList: FinalNotes,
          };
          let packagetype;
          // for(var i = 0; i< PackageList.length;i++){
          if (PackageList[0].PackageType === 1) {
            packagetype = "Boxes";
          } else if (PackageList[0].PackageType === 2) {
            packagetype = "Document";
          } else if (PackageList[0].PackageType === 3) {
            packagetype = "Furniture";
          } else if (PackageList[0].PackageType === 4) {
            packagetype = "Television";
          } else if (PackageList[0].PackageType === 5) {
            packagetype = "Auto";
          }
          // }
          let manageData = {
            Email: this.state.EmailAddress,
            Phone: this.state.Phone,
            PersonID: CommonConfig.loggedInUserData().PersonID,
            newpackagetype: packagetype,
          };

          this.showLoader();
          try {
            if (this.props.history.location.state.id === "") {
              api
                .post("salesLead/getManagedByPhoneOREmail", manageData)
                .then((result) => {
                  if (result.success) {
                    if (result.data.length > 0) {
                      data.ManagedBy = result.data[0].ManagedBy;
                    }
                    var formData = new FormData();
                    formData.append("data", JSON.stringify(data));
                    if (this.state.Attachments.length > 0) {
                      this.state.Attachments.forEach((file) => {
                        formData.append("Attachments", file);
                      });
                    }
                    api
                      .post("salesLead/addSalesLead", formData)
                      .then((res) => {
                        if (res.success) {
                          this.hideLoader();
                          if (redirect) {
                            localStorage.removeItem("SearchCount");

                            this.props.history.push({
                              pathname: "/admin/SalesLeads",
                              state: {
                                filterlist:
                                  this.props.history.location.state &&
                                  this.props.history.location.state.filterlist
                                    ? this.props.history.location.state
                                        .filterlist
                                    : null,
                                sortlist:
                                  this.props.history.location.state &&
                                  this.props.history.location.state.sortlist
                                    ? this.props.history.location.state.sortlist
                                    : null,
                                packageValue:
                                  this.props.history.location.state &&
                                  this.props.history.location.state.packageValue
                                    ? this.props.history.location.state
                                        .packageValue
                                    : null,
                                statusfilter:
                                  this.props.history.location.state &&
                                  this.props.history.location.state.statusfilter
                                    ? this.props.history.location.state
                                        .statusfilter
                                    : null,
                              },
                            });
                          } else {
                            this.reCallApi();
                          }
                          cogoToast.success("Saleslead updated Sucessfully");
                        } else {
                          this.hideLoader();
                          cogoToast.error("Something went wrong");
                        }
                      })
                      .catch((err) => {
                        this.hideLoader();
                        cogoToast.error("Something went wrong");
                      });
                  }
                })
                .catch((err) => {
                  console.log("error", err);
                });
            } else {
              var formData = new FormData();
              formData.append("data", JSON.stringify(data));
              if (this.state.Attachments.length > 0) {
                this.state.Attachments.forEach((file) => {
                  formData.append("Attachments", file);
                });
              }
              api
                .post("salesLead/addSalesLead", formData)
                .then((res) => {
                  if (res.success) {
                    this.hideLoader();
                    if (redirect) {
                      localStorage.removeItem("SearchCount");

                      this.props.history.push({
                        pathname: "/admin/SalesLeads",
                        state: {
                          filterlist:
                            this.props.history.location.state &&
                            this.props.history.location.state.filterlist
                              ? this.props.history.location.state.filterlist
                              : null,
                          sortlist:
                            this.props.history.location.state &&
                            this.props.history.location.state.sortlist
                              ? this.props.history.location.state.sortlist
                              : null,
                          packageValue:
                            this.props.history.location.state &&
                            this.props.history.location.state.packageValue
                              ? this.props.history.location.state.packageValue
                              : null,
                          statusfilter:
                            this.props.history.location.state &&
                            this.props.history.location.state.statusfilter
                              ? this.props.history.location.state.statusfilter
                              : null,
                        },
                      });
                    } else {
                      this.reCallApi();
                    }
                    cogoToast.success("Saleslead updated Sucessfully");
                  } else {
                    this.hideLoader();
                    cogoToast.error("Something went wrong");
                  }
                })
                .catch((err) => {
                  this.hideLoader();
                  cogoToast.error("Something went wrong");
                });
            }
          } catch (error) {
            this.hideLoader();
            cogoToast.error("Something went wrong");
          }
        } else {
          cogoToast.error(
            "There were found error in the form.Please correct and resubmit"
          );
        }
      } else {
        cogoToast.error("Please correct error and resubmit the form.");
      }
    });
  };

  handleDateChange = (date) => {
    this.setState({ StartDate: date });
  };

  handleLeadDateChange = (date) => {
    this.setState({ LeadDate: date });
  };

  handleTentativeDate = (date) => {
    this.setState({ TentativeDate: date });
  };

  handleSearchBack = () => {
    if (
      this.props.history.location.state &&
      this.props.history.location.state.searchData
    ) {
      window.location.href =
        "/admin/Search/" + this.props.history.location.state.searchData;
    } else {
      cogoToast.error("Search data not found.");
    }
  };

  handleDelete = () => {
    this.setState({
      open: false,
    });
    this.showLoader();
    try {
      let data = {
        SalesLeadManageMentID: this.state.SalesLeadManagementID,
      };
      api.post("salesLead/deleteSalesLeadByID", data).then((result) => {
        if (result.success) {
          this.hideLoader();
          cogoToast.success("Deleted successfully");
          this.props.history.push({
            pathname: "/admin/SalesLeads",
            state: {
              filterlist:
                this.props.history.location.state &&
                this.props.history.location.state.filterlist
                  ? this.props.history.location.state.filterlist
                  : null,
              sortlist:
                this.props.history.location.state &&
                this.props.history.location.state.sortlist
                  ? this.props.history.location.state.sortlist
                  : null,
              packageValue:
                this.props.history.location.state &&
                this.props.history.location.state.packageValue
                  ? this.props.history.location.state.packageValue
                  : null,
              statusfilter:
                this.props.history.location.state &&
                this.props.history.location.state.statusfilter
                  ? this.props.history.location.state.statusfilter
                  : null,
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

  showDiv = (type, packageType) => {
    this.setState({
      [type]: true,
    });
    if (
      packageType === "Car" &&
      this.state.CarList.filter((x) => x.Status === "Active").length === 0
    ) {
      this.addCarRow();
    }
    if (
      packageType === "TV" &&
      this.state.TVList.filter((x) => x.Status === "Active").length === 0
    ) {
      this.addTVRow();
    }
    if (
      packageType === "Package" &&
      this.state.PackageList.filter((x) => x.Status === "Active").length === 0
    ) {
      this.handleAddRow();
    }
  };

  searchSales = (type) => {
    let obj = {
      value: type === "PhoneNumber" ? this.state.Phone : this.state.EmailAdd,
      field: type,
    };
    localStorage.setItem("SearchCount", JSON.stringify(obj));
    this.props.history.push("/admin/SalesLeads");
  };

  handleDocumentSendMail = (e, record, type) => {
    if (type === "Message") {
      let escaped = new Option(record.original.BodyEmail).innerHTML;
      var data = {
        Frommail: record.original.FromEmail,
        TOmail: record.original.ToEmail,
        CCmail: record.original.CCEmail,
        Subjectmail: record.original.SubjectEmail,
        Bodymail: escaped,
        Type: "InvoiceMessage",
      };
      this.setState({
        sendmailopen: !this.state.sendmailopen,
        sendMailInfo: data,
      });
    }
  };

  htmlDecode(input) {
    var e = document.createElement("div");
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  render() {
    const {
      WriteAccess,
      DeleteAccess,
      selectedDropoffCountry,
      selectedPickUPCountry,
      selectedWorkingOnRequest,
      ProposalType,
      ProposalStatus,
      EmailAddress,
      ContactName,
      DropoffCity,
      DropoffState,
      PickupState,
      PickupCity,
      Phone,
      DropoffCityZip,
      PickupCityZip,
      IsTvVisible,
      IsCarVisible,
      IsPackageVisible,
      EmailCount,
      PhoneCount,
      CommuncationList,
    } = this.state;

    const correspondenceColumns = [
      {
        Header: "Email Date",
        width: 100,
        sortMethod: (a, b) => {
          return CommonConfig.dateSortMethod(a, b);
        },
        id: "EmailDate",
        accessor: (data) => {
          return moment(data.CreatedOn).format(
            CommonConfig.dateFormat.dateOnly
          );
        },
        filterable: false,
        sortable: false,
      },
      {
        Header: "Document Name",
        id: "DocumentName",
        accessor: "DocumentType",
        width: 100,
        filterable: false,
        sortable: false,
      },
      {
        Header: "To",
        id: "ToEmail",
        accessor: "ToEmail",
        width: 100,
        filterable: false,
        sortable: false,
      },
      {
        Header: "CC",
        accessor: "CCEmail",
        width: 80,
        filterable: false,
        sortable: false,
      },
      {
        Header: "Subject Line",
        accessor: "SubjectEmail",
        width: 80,
        filterable: false,
        sortable: false,
      },
      {
        Header: "View File",
        accessor: (data) => {
          return data.AttachmentPath ? (
            <a
              href={fileBase + data.AttachmentPath}
              className="normal-btn sm-orange"
              rel="noopener noreferrer"
              target="_blank"
            >
              VIEW FILE
            </a>
          ) : null;
        },
        width: 80,
        id: "AttachmentPath",
        filterable: false,
        sortable: false,
      },
      {
        Header: "View Message",
        Cell: (record) => {
          return (
            <Button
              className="normal-btn sm-orange"
              onClick={(e) => this.handleDocumentSendMail(e, record, "Message")}
            >
              View Message
            </Button>
          );
        },
        id: "BodyEmail",
        width: 110,
        filterable: false,
        sortable: false,
      },
    ];

    const managedby = this.state.managedby.map((managedby) => {
      return { value: managedby.PersonID, label: managedby.Name };
    });
    const proposalstatus = {
      options: this.state.proposalstatus.map((option) => option.label),
    };
    const pickupCity = {
      options: this.state.PickupCityList.map((option) => option.CityName),
    };
    const dropoffCity = {
      options: this.state.DropoffCityList.map((option) => option.CityName),
    };
    const deliverytype = {
      options: this.state.deliverytype.map((x) => x.label),
    };

    const referredby = {
      options: this.state.referredby.map((x) => x.label),
    };

    const dropoffCountry = this.state.CountryList.map((dropoffCountry) => {
      return {
        value: dropoffCountry.CountryID,
        label: dropoffCountry.CountryName,
      };
    });
    const pickupCountry = this.state.CountryList.map((pickupCountry) => {
      return {
        value: pickupCountry.CountryID,
        label: pickupCountry.CountryName,
      };
    });
    const toStateOptions = this.state.toStateList.map((state) => {
      return { value: state.StateName, label: state.StateName };
    });
    const fromStateOptions = this.state.fromStateList.map((state) => {
      return { value: state.StateName, label: state.StateName };
    });

    return (
      <GridContainer className="UserList-outer">
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <Edit />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">
                Customer Information
              </h4>
              {/* {this.state.newurl && this.state.newurl !== "NULL" ? (
                <Tooltip title={this.state.newurl} arrow>
                  <Button
                    className="Plus-btn info-icon"
                    justIcon
                    color="twitter"
                  >
                    <InfoIcon />
                  </Button>
                </Tooltip>
              ) : null} */}
              {this.props.history.location.state.id !== "" ? (
                <div className="mg-info">
                  <br />
                  <p className="text-color-black">
                    Sales Lead ID:
                    <TextField
                      disabled={true}
                      value={this.state.SalesLeadManagementID}
                    />
                  </p>
                </div>
              ) : null}
            </CardHeader>
            <CardBody>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="Contact Name"
                    id="contactname"
                    error={this.state.contactnameErr}
                    helperText={this.state.contactnameHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: ContactName,
                      onChange: (event) =>
                        this.handlechange(event, "contactname"),
                      onFocus: () =>
                        this.setState({
                          contactnameCheck: false,
                          contactnameErr: false,
                          contactnameHelperText: "",
                        }),
                      onBlur: (event) =>
                        this.handlechange(event, "contactname"),
                      endAdornment:
                        this.state.contactnameCheck !== true ? (
                          <Icon className={useStyles.User}>account_box</Icon>
                        ) : this.state.contactnameErr ? (
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
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText={`Email Address`}
                    id="email "
                    error={this.state.emailaddressErr}
                    helperText={this.state.emailaddressHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: EmailAddress,
                      disabled:
                        this.props.history.location.state.id !== ""
                          ? DeleteAccess === 1
                            ? false
                            : true
                          : false,
                      onChange: (event) =>
                        this.handleOnChange(event, "emailaddress"),
                      onFocus: () =>
                        this.setState({
                          emailaddressCheck: false,
                          emailaddressErr: false,
                          emailaddressHelperText: "",
                        }),
                      onBlur: (event) =>
                        this.handlechange(event, "emailaddress"),
                      endAdornment:
                        EmailCount > 1 ? (
                          <a
                            href="javascript:;"
                            onClick={() => this.searchSales("Email")}
                          >
                            <Badge badgeContent={EmailCount} color="primary">
                              <Icon className={useStyles.User}>email</Icon>
                            </Badge>
                          </a>
                        ) : (
                          <Icon className={useStyles.User}>email</Icon>
                        ),
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="Phone"
                    id="phone "
                    error={this.state.phoneErr}
                    helperText={this.state.phoneHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: Phone,
                      disabled:
                        this.props.history.location.state.id !== ""
                          ? DeleteAccess === 1
                            ? false
                            : true
                          : false,
                      onChange: (event) => this.handleOnChange(event, "phone"),
                      onBlur: (event) => this.handlechange(event, "phone"),
                      onFocus: () =>
                        this.setState({
                          phoneCheck: false,
                          phoneErr: false,
                          phoneHelperText: "",
                        }),
                      endAdornment:
                        PhoneCount > 1 ? (
                          <a
                            href="javascript:;"
                            onClick={() => this.searchSales("PhoneNumber")}
                          >
                            <Badge badgeContent={PhoneCount} color="primary">
                              <Icon className={useStyles.User}>phone</Icon>
                            </Badge>
                          </a>
                        ) : (
                          <Icon className={useStyles.User}>phone</Icon>
                        ),
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <Autocomplete
                    options={managedby}
                    id="managedby"
                    getOptionLabel={(option) => option.label}
                    value={selectedWorkingOnRequest}
                    onChange={(event, value) =>
                      this.requestChange(event, value, "managedby")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={this.state.managedbyErr}
                        helperText={this.state.managedbyHelperText}
                        label="Managed By"
                        fullWidth
                      />
                    )}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={3}>
                  <FormControl fullWidth>
                    <Autocomplete
                      options={pickupCountry}
                      id="PickupCountry"
                      getOptionLabel={(option) =>
                        option.label ? option.label : option
                      }
                      value={selectedPickUPCountry}
                      autoSelect
                      onChange={(event, value) => this.FromCountry(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={this.state.pickupcountryErr}
                          helperText={this.state.pickupcountryHelperText}
                          label="Pickup Country"
                          fullWidth
                        />
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <FormControl fullWidth>
                    <CustomInput
                      labelText="Pickupcity Zip"
                      error={this.state.pickupcityzipErr}
                      helperText={this.state.pickupcityzipHelperText}
                      id="pcityzip"
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: PickupCityZip,
                        onBlur: (event) =>
                          this.handleZipChange(event, "pickupcityzip"),
                        onChange: (event) =>
                          this.handlechange(event, "pickupcityzip"),
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={useStyles.inputAdornment}
                          >
                            <Icon className={useStyles.User}>drafts</Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <FormControl fullWidth>
                    {this.state.PickupCityInput === true ? (
                      <CustomInput
                        error={this.state.pickupcityErr}
                        helperText={this.state.pickupcityHelperText}
                        labelText="Pickup City"
                        id="pcity"
                        formControlProps={{ fullWidth: true }}
                        inputProps={{
                          value: PickupCity,
                          onBlur: (event) =>
                            this.handlechange(event, "pickupcity"),
                          onChange: (event) =>
                            this.handlechange(event, "pickupcity"),
                          onFocus: () =>
                            this.setState({
                              pickupcityErr: false,
                              pickupcityHelperText: "",
                            }),
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              className={useStyles.inputAdornment}
                            >
                              <Icon className={useStyles.User}>drafts</Icon>
                            </InputAdornment>
                          ),
                        }}
                      />
                    ) : (
                      <Autocomplete
                        {...pickupCity}
                        id="pcity"
                        value={PickupCity}
                        PickupCity
                        onChange={(event, value) =>
                          this.requestChange(event, value, "pickupcity")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Pickup City"
                            fullWidth
                          />
                        )}
                      />
                    )}
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  {this.state.fromStateAutoComplete === false ? (
                    <CustomInput
                      labelText="Pickup State"
                      id="pstate"
                      error={this.state.pickupstateErr}
                      helperText={this.state.pickupstateHelperText}
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: PickupState,
                        onChange: (event) =>
                          this.handlechange(event, "pickupstate"),
                        onBlur: (event) =>
                          this.handlechange(event, "pickupstate"),
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={useStyles.inputAdornment}
                          >
                            <Icon className={useStyles.User}>public</Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  ) : (
                    <Autocomplete
                      options={fromStateOptions}
                      id="toState"
                      autoSelect
                      getOptionLabel={(option) => option.label}
                      value={PickupState}
                      onChange={(event, value) =>
                        this.requestChange(event, value, "pickupstate")
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Pickup State" fullWidth />
                      )}
                    />
                  )}
                </GridItem>
              </GridContainer>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={3}>
                  <Autocomplete
                    options={dropoffCountry}
                    getOptionLabel={(option) =>
                      option.label ? option.label : option
                    }
                    id="DropoffCountry"
                    autoSelect
                    onChange={(event, value) => this.ToCountry(value)}
                    value={selectedDropoffCountry}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={this.state.dropoffcountryErr}
                        helperText={this.state.dropoffcountryHelperText}
                        label="Dropoff Country"
                        fullWidth
                      />
                    )}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="Dropoff Zip"
                    id="dcityzip"
                    error={this.state.DropoffCityZipErr}
                    helperText={this.state.DropoffCityZipHelperText}
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      value: DropoffCityZip,
                      onBlur: (event) =>
                        this.handleZipChange(event, "dropoffcityzip"),
                      onChange: (event) =>
                        this.handlechange(event, "dropoffcityzip"),
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          className={useStyles.inputAdornment}
                        >
                          {" "}
                          <Icon className={useStyles.User}>drafts</Icon>
                        </InputAdornment>
                      ),
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  {this.state.DropoffCityInput === true ? (
                    <CustomInput
                      error={this.state.dropoffcityErr}
                      helperText={this.state.dropoffcityHelperText}
                      labelText="Dropoff City"
                      id="dcity"
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: DropoffCity,
                        onBlur: (event) =>
                          this.handlechange(event, "dropoffcity"),
                        onChange: (event) =>
                          this.handlechange(event, "dropoffcity"),
                        onFocus: () =>
                          this.setState({
                            dropoffcityErr: false,
                            dropoffcityHelperText: "",
                          }),
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={useStyles.inputAdornment}
                          >
                            <Icon className={useStyles.User}>drafts</Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  ) : (
                    <Autocomplete
                      {...dropoffCity}
                      id="dcity"
                      value={DropoffCity}
                      DropoffCity
                      onChange={(event, value) =>
                        this.requestChange(event, value, "dropoffcity")
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Dropoff City" fullWidth />
                      )}
                    />
                  )}
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  {this.state.toStateAutoComplete === false ? (
                    <CustomInput
                      labelText="Dropoff State"
                      error={this.state.dropoffstateErr}
                      helperText={this.state.dropoffstateHelperText}
                      id="dstate"
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: DropoffState,
                        onChange: (event) =>
                          this.handlechange(event, "dropoffstate"),
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={useStyles.inputAdornment}
                          >
                            <Icon className={useStyles.User}>public</Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  ) : (
                    <Autocomplete
                      options={toStateOptions}
                      id="toState"
                      autoSelect
                      getOptionLabel={(option) => option.label}
                      value={DropoffState}
                      onChange={(event, value) =>
                        this.requestChange(event, value, "dropoffstate")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Dropoff State"
                          fullWidth
                        />
                      )}
                    />
                  )}
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
          <Card className="z-index-9">
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <Edit />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">
                Sales Lead Information
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={3}>
                  <div className="select-spl">
                    <FormControl className={classes.formControl} fullWidth>
                      <InputLabel
                        htmlFor="package_number"
                        className={classes.selectLabel}
                      >
                        Proposal Type
                      </InputLabel>
                      <Select
                        fullWidth={true}
                        // id="package_number"
                        name="package_number"
                        value={ProposalType}
                        onChange={(event, value) =>
                          this.requestChange(event, value, "proposaltype")
                        }
                      >
                        {this.Proposaltype()}
                      </Select>
                    </FormControl>
                    <span
                      id="proposalTypeerror"
                      style={{ color: "red", fontSize: "12px" }}
                    >
                      {this.state.ProposalTypeError}
                    </span>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <FormControl className={classes.formControl} fullWidth>
                    <Autocomplete
                      {...proposalstatus}
                      id="Proposal Status"
                      value={ProposalStatus}
                      onChange={(event, value) =>
                        this.requestChange(event, value, "proposalstatus")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={this.state.proposalstatusErr}
                          helperText={this.state.proposalstatusHelperText}
                          label="Proposal Status"
                          fullWidth
                        />
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <FormControl fullWidth>
                    <Autocomplete
                      {...deliverytype}
                      id="deliverytype"
                      value={this.state.DeliveryType}
                      onChange={(event, value) =>
                        this.requestChange(event, value, "deliverytype")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Delivery Type"
                          fullWidth
                        />
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <FormControl fullWidth>
                    <Autocomplete
                      {...referredby}
                      id="referredby"
                      value={this.state.ReferredBy}
                      onChange={(event, value) =>
                        this.requestChange(event, value, "referredby")
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Referred by" fullWidth />
                      )}
                    />

                    <span
                      id="referrederror"
                      style={{ color: "red", fontSize: "12px" }}
                    >
                      {this.state.Referrederror}
                    </span>
                  </FormControl>
                </GridItem>
              </GridContainer>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={3}>
                  <div className="date-input with-icon">
                    <InputLabel className={classes.label}>Lead Date</InputLabel>
                    <FormControl fullWidth>
                      <Datetime
                        //dateFormat={"DD/MM/YYYY"}
                        value={moment(this.state.LeadDate)}
                        timeFormat={false}
                        selected={moment(this.state.LeadDate)}
                        inputProps={{ placeholder: "Lead Date" }}
                        onChange={this.handleLeadDateChange}
                        isValidDate={valid}
                        closeOnSelect={true}
                      />
                      <Icon className="date-icon">date_range</Icon>
                    </FormControl>
                  </div>
                </GridItem>
                {/* <GridItem xs={12} sm={12} md={4}>
                  <FormControl className={classes.formControl} fullWidth>
                    <CustomInput
                      labelText="Lead Date"
                      id="leaddate"
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        disabled: true,
                        value: moment(this.state.LeadDate).format(
                          CommonConfig.dateFormat.dateOnly
                        ),
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={useStyles.inputAdornment}
                          >
                            <Icon className={useStyles.User}>date_range</Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                </GridItem> */}

                <GridItem xs={12} sm={12} md={3}>
                  <div className="date-input with-icon">
                    <InputLabel className={classes.label}>
                      Followup Date
                    </InputLabel>
                    <FormControl fullWidth>
                      <Datetime
                        //dateFormat={"DD/MM/YYYY"}
                        value={moment(this.state.StartDate)}
                        timeFormat={false}
                        selected={moment(this.state.StartDate)}
                        inputProps={{ placeholder: "Followup Date" }}
                        onChange={this.handleDateChange}
                        isValidDate={valid}
                        closeOnSelect={true}
                      />
                      <Icon className="date-icon">date_range</Icon>
                    </FormControl>
                    <span
                      id="followuprror"
                      style={{ color: "red", fontSize: "12px" }}
                    >
                      {this.state.Followuprror}
                    </span>
                  </div>
                </GridItem>

                <GridItem xs={12} sm={12} md={3}>
                  <div className="date-input">
                    <InputLabel className={classes.label}>
                      Tentative Date
                    </InputLabel>
                    <FormControl fullWidth>
                      <Datetime
                        //dateFormat={"DD/MM/YYYY"}
                        inputProps={{ placeholder: "" }}
                        calendarIcon="true"
                        selected={moment(this.state.TentativeDate)}
                        value={moment(this.state.TentativeDate)}
                        timeFormat={false}
                        onChange={(date) => this.handleTentativeDate(date)}
                        closeOnSelect={true}
                      />
                      <Icon className="date-icon">date_range</Icon>
                    </FormControl>
                  </div>
                </GridItem>

                <GridItem xs={12} sm={12} md={3}>
                  <FormControl fullWidth>
                    <CustomInput
                      labelText="Lead From"
                      id="leadfrom"
                      formControlProps={{ fullWidth: true }}
                      inputProps={{
                        value: this.state.newurl,
                        disabled: true,
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={useStyles.inputAdornment}
                          ></InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
          <Card>
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <Package />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">
                Package Details
              </h4>
              <div style={{ textAlign: "right", marginTop: "12px" }}>
                {this.state.CarList.filter((x) => x.Status === "Active")
                  .length === 0 ? (
                  // <i onClick={() => this.showDiv("IsCarVisible","Car")} class="fas fa-car"></i>
                  <img
                    style={{ width: "32px", marginLeft: "20px" }}
                    src={carSVG}
                    onClick={() => this.showDiv("IsCarVisible", "Car")}
                  />
                ) : null}
                {this.state.TVList.filter((x) => x.Status === "Active")
                  .length === 0 ? (
                  // <i onClick={() => this.showDiv("IsTvVisible","TV")} class="fas fa-tv"></i>
                  <img
                    style={{ width: "32px", marginLeft: "20px" }}
                    src={tvSVG}
                    onClick={() => this.showDiv("IsTvVisible", "TV")}
                  />
                ) : null}
                {this.state.PackageList.filter((x) => x.Status === "Active")
                  .length === 0 ? (
                  // <i onClick={() => this.showDiv("IsPackageVisible","Package")} class="fas fa-box"></i>
                  <img
                    style={{ width: "32px", marginLeft: "20px" }}
                    src={packageSVG}
                    onClick={() => this.showDiv("IsPackageVisible", "Package")}
                  />
                ) : null}
              </div>
            </CardHeader>
            <CardBody>
              {IsPackageVisible ? (
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <div className="package-table no-scroll">
                      <table>
                        <thead>
                          <tr>
                            <th style={{ width: "100px" }}>Quantity</th>
                            <th style={{ width: "140px" }}>Package Type</th>
                            <th style={{ width: "135px" }}>
                              Actual Weight [Lbs.]
                            </th>
                            <th style={{ width: "406px" }} colspan="3">
                              Package Dimension(L*W*H in Inches)
                            </th>
                            <th style={{ width: "140px" }}>
                              Chargeable Weight [Lbs.]
                            </th>
                            <th style={{ width: "137px" }}>CFT</th>
                            <th style={{ width: "81px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>{this.viewPackages()}</tbody>
                      </table>
                    </div>
                  </GridItem>
                </GridContainer>
              ) : null}
              {IsCarVisible ? (
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <div className="package-table no-scroll">
                      <table>
                        <thead>
                          <tr>
                            <th style={{ width: "100px" }}>Car Quantity</th>
                            <th style={{ width: "275px" }}>Car Make</th>
                            <th style={{ width: "406px" }}>Car Model</th>
                            <th style={{ width: "277px" }}>Car Year</th>
                            <th style={{ width: "81px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>{this.viewCarList()}</tbody>
                      </table>
                    </div>
                  </GridItem>
                </GridContainer>
              ) : null}
              {IsTvVisible ? (
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <div className="package-table no-scroll">
                      <table>
                        <thead>
                          <tr>
                            <th style={{ width: "100px" }}>TV Make</th>
                            <th style={{ width: "140px" }}>TV Model</th>
                            <th style={{ width: "135px" }}>
                              Actual Weight [Lbs.]
                            </th>
                            <th style={{ width: "406px" }} colspan="3">
                              Package Dimension(L*W*H in Inches)
                            </th>
                            <th style={{ width: "140px" }}>
                              Chargeable Weight [Lbs.]
                            </th>
                            <th style={{ width: "137px" }}>CFT</th>
                            <th style={{ width: "81px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>{this.viewTVList()}</tbody>
                      </table>
                    </div>
                  </GridItem>
                </GridContainer>
              ) : null}
            </CardBody>
          </Card>
          {this.props.history.location.state.id !== "" ? (
            <Card>
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <AssignmentIcon />
                </CardIcon>
                <h4 className="margin-right-auto text-color-black">
                  Communication
                </h4>
              </CardHeader>
              <CardBody className="shipment-cardbody">
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={12}>
                    <div className="custom-react-table">
                      <ReactTable
                        data={CommuncationList}
                        sortable={true}
                        filterable={true}
                        resizable={false}
                        minRows={2}
                        columns={correspondenceColumns}
                        defaultPageSize={10}
                        align="left"
                        className="-striped -highlight"
                      />
                    </div>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          ) : null}
          {this.props.history.location.state.id !== "" ? (
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
          ) : null}
          <div className="shipment-submit">
            <div className="left">
              {this.props.history.location.state.id !== "" &&
              DeleteAccess === 1 ? (
                <Button color="danger" onClick={this.handleClickOpen}>
                  Delete
                </Button>
              ) : null}
            </div>
            <div className="center">
              {this.props.history.location.state &&
              this.props.history.location.state.searchData ? (
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
                  {this.props.history.location.state.id !== "" ? (
                    <Button onClick={() => this.handleSave(false)} color="rose">
                      Save
                    </Button>
                  ) : null}
                  <Button onClick={() => this.handleSave(true)} color="primary">
                    Save & Exit
                  </Button>
                </>
              ) : null}
              <Button onClick={() => this.handleCancel()} color="secondary">
                Cancel
              </Button>
            </div>
          </div>

          <div>
            <Dialog
              maxWidth={671}
              open={this.state.sendmailopen}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Send Email</DialogTitle>
              <DialogContent>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="From"
                      id="From"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        value: this.state.sendMailInfo.Frommail,
                        disabled:
                          this.state.sendMailInfo.Type === "InvoiceMessage"
                            ? true
                            : false,
                        onChange: (event) => {
                          this.changeFrommail(event, "From");
                        },
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={classes.inputAdornment}
                          >
                            <Icon className={classes.inputAdornmentIcon}>
                              email
                            </Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </GridItem>
                  {/* </GridContainer>
              <GridContainer> */}
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="TO"
                      id="TO"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        value: this.state.sendMailInfo.TOmail,
                        disabled:
                          this.state.sendMailInfo.Type === "InvoiceMessage"
                            ? true
                            : false,
                        onChange: (event) => {
                          this.changetomail(event, "TO");
                        },
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={classes.inputAdornment}
                          >
                            <Icon className={classes.inputAdornmentIcon}>
                              email
                            </Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </GridItem>
                  {/* </GridContainer>
              <GridContainer> */}
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="CC"
                      id="CC"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: (event) => {
                          this.ChangeCCmail(event, "CC");
                        },
                        disabled:
                          this.state.sendMailInfo.Type === "InvoiceMessage"
                            ? true
                            : false,
                        value: this.state.sendMailInfo.CCmail,
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={classes.inputAdornment}
                          >
                            <Icon className={classes.inputAdornmentIcon}>
                              email
                            </Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Subject"
                      id="Subject"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: (event) => {
                          this.ChangeSubjectmail(event, "Subject");
                        },
                        value: this.state.sendMailInfo.Subjectmail,
                        disabled:
                          this.state.sendMailInfo.Type === "InvoiceMessage"
                            ? true
                            : false,
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className={classes.inputAdornment}
                          >
                            <Icon className={classes.inputAdornmentIcon}>
                              email
                            </Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    {this.state.sendMailInfo.Type === "InvoiceMessage" ? (
                      <p>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: this.htmlDecode(
                              this.state.sendMailInfo.Bodymail
                            ),
                          }}
                        ></div>
                      </p>
                    ) : (
                      <textarea
                        name="Body"
                        style={{ width: "550px" }}
                        labelText="Body"
                        disabled={
                          this.state.sendMailInfo.Type === "InvoiceMessage"
                            ? true
                            : false
                        }
                        value={this.state.sendMailInfo.Bodymail}
                        onChange={(event) => this.ChangeMailBody(event, "Body")}
                      ></textarea>
                    )}
                  </GridItem>
                </GridContainer>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => this.setState({ sendmailopen: false })}
                  color="secondary"
                >
                  Cancel
                </Button>
                {/* { this.state.sendMailInfo.Type !== "InvoiceMessage" ? 
              <Button onClick={() => this.handleapiSendMail(this.state.sendMailInfo.Type)} color="primary" autoFocus>
                Send
              </Button>
              : null } */}
              </DialogActions>
            </Dialog>
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
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
      </GridContainer>
    );
  }
}
export default EditSalesLeads;
