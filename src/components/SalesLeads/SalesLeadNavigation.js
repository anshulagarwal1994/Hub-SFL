import React, { Component } from "react";
import ReactTable from "react-table";
import GridContainer from "components/Grid/GridContainer.js";
import TextField from "@material-ui/core/TextField";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Datetime from "react-datetime";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/core/styles";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import api from "../../utils/apiClient";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import Button from "components/CustomButtons/Button.js";
import { CommonConfig } from "../../utils/constant";
import moment from "moment";
import SimpleBackdrop from "../../utils/general";
import cogoToast from "cogo-toast";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { FormHelperText } from "@material-ui/core";
import SalesLeadIcon from "@material-ui/icons/Assessment";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
  },
  typography: {
    padding: theme.spacing(2),
  },
}));

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
};
const classes = makeStyles(styles);

class SalesLeadNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Steps: [
        {
          stepName: "Sales Lead",
          stepId: "saleslead",
          classname: "active",
        },
        {
          stepName: "Search",
          stepId: "searchsaleslead",
          classname: "inactive",
        },
      ],

      //Sales Lead
      IsDropDownShow: false,
      checkdata: "",
      ProposalData: [],
      AllAccess: 0,
      loggedUser: 0,
      statusList: [],
      requestStatus: [
        { label: "All", value: "All", IsSelected: false, Index: 0 },
        { label: "New", value: "New", IsSelected: true, Index: 1 },
        { label: "Open", value: "Open", IsSelected: false, Index: 2 },
        { label: "Closed", value: "Closed", IsSelected: false, Index: 3 },
        { label: "Cancelled", value: "Cancelled", IsSelected: false, Index: 4 },
        {
          value: "To be Deleted",
          label: "To be Deleted",
          IsSelected: false,
          Index: 5,
        },
      ],
      contentType: [
        { label: "Boxes", value: 1 },
        { label: "Documents", value: 2 },
        { label: "Furniture", value: 3 },
        { label: "Tv", value: 4 },
        { label: "Auto", value: 5 },
      ],
      selectField: [],
      fieldSelected: "",
      filterSelected: "",
      selectFilter: [],
      filterValue: "",
      filtered: [],
      CountryList: [],
      managedby: [],
      filter: {
        field: "",
        error: false,
        fielderror: false,
        filtererror: false,
        fieldhelperText: "",
        filterhelperText: "",
        helperText: "",
        filter: "",
        condition: "",
        filterValue: "",
        Index: 1,
      },
      searchAllAccess: [],
      isEdit: true,
      SearchFinalFilter: [],
      defaultfilterValue: "",
      expand: false,
      finalLength: 0,
      filterProps: [],
      previousFilterList: [],
      sortProps: [],
      previousSortList: [],
      packageValue: [],
      SearchSalesLeadList: [],
      searchFinalLength: 0,
      searchFilterValue: "All",
      searchpreviousFilterList: [
        {
          value: "",
          id: "ProposalStatus",
        },
      ],
      searchsortProps: [],
      searchpreviousSortList: [
        {
          id: "SalesLeadDate",
          desc: true,
        },
      ],
      Loading: false,
      SearchClicked: false,
    };
  }

  async componentDidMount() {
    this.setState({
      AllAccess: CommonConfig.getUserAccess("Sales Lead").AllAccess,
      searchAllAccess: CommonConfig.getUserAccess("Search Sales Lead"),
      loggedUser: CommonConfig.loggedInUserData().PersonID,
    });

    await this.getStringMap();

    await this.getCountry();
    await this.managedby();
    await this.getFilterlist();
    if (localStorage.getItem("SearchCount")) {
      var params = JSON.parse(localStorage.getItem("SearchCount"));
      
      this.showHide("searchsaleslead");
      const filterNew = {
        field: params.field,
        filter: { label: "Is equal to", value: "=" },
        error: false,
        helperText: "",
        filterValue: params.value,
        Index: this.state.filtered.length + 1,
      };
      this.setState({
        searchFilterValue: "All",
        isEdit: false,
        SearchClicked: true,
      });

      if (CommonConfig.getUserAccess("Sales Lead").AllAccess === 1) {
        this.setState({ isEdit: 1 });
      }

      if (CommonConfig.getUserAccess("Sales Lead").AllAccess === 0) {
        this.setState({ AllAccess: 1 });
      }
      let searchStr =
        filterNew.field +
        " " +
        filterNew.filter.value +
        " '" +
        filterNew.filterValue +
        "' ";
      this.setState(
        {
          filtered: [filterNew],
        },
        function() {
          // this.search();
          this.getSearchResults(searchStr);
        }
      );
    } else {
      this.showHide();
      this.setState({ filtered: [this.state.filter] });
    }
    let APIcheck = true;
    if (
      this.props.history.location.state !== undefined &&
      this.props.history.location.state !== null
    ) {
      this.setState({
        previousFilterList:
          this.props.history.location.state &&
          this.props.history.location.state.filterlist
            ? this.props.history.location.state.filterlist
            : this.state.previousFilterList,
        defaultfilterValue:
          this.props.history.location.state.statusfilter !== null &&
          this.props.history.location.state.statusfilter
            ? this.props.history.location.state.statusfilter
            : this.state.defaultfilterValue,
        statusList:
          this.props.history.location.state.statusList !== null &&
          this.props.history.location.state.statusList !== undefined
            ? this.props.history.location.state.statusList
            : this.state.statusList,
        packageValue:
          this.props.history.location.state.packageValue !== undefined
            ? this.props.history.location.state.packageValue
            : this.state.packageValue,
        previousSortList:
          this.props.history.location.state &&
          this.props.history.location.state.sortlist
            ? this.props.history.location.state.sortlist
            : this.state.previousSortList,
      });
      if (
        this.props.history.location.state &&
        this.props.history.location.state.statusList !== undefined
      ) {
        APIcheck = false;
        this.filterMethod("", this.props.history.location.state.statusList);
      }
    } else {
      var finalStatus = [
        {
          id: "ProposalStatus",
          value: "",
        },
      ];
      var finalSort = {
        id: "LeadID",
        desc: true,
      };

      this.setState({
        previousFilterList: finalStatus,
        previousSortList: [finalSort],
      });
    }

    this.setState({ Loading: true });
    if (APIcheck) {
      let newFilter = [{ label: "New", value: "New" }];
      this.filterMethod("", newFilter);
    }
  }

  showHide = (access) => {
    if (
      CommonConfig.getUserAccess("Search Sales Lead") &&
      CommonConfig.getUserAccess("Sales Lead")
    ) {
      if (
        CommonConfig.getUserAccess("Search Sales Lead").ReadAccess === 1 &&
        CommonConfig.getUserAccess("Sales Lead").ReadAccess === 1
      ) {
        if (CommonConfig.isEmpty(access)) {
          document.getElementById("saleslead").style.display = "block";
          document.getElementById("searchsaleslead").style.display = "none";
        } else {
          let key;
          this.state.Steps.map((step, idx) => {
            if (access === step.stepId) {
              key = idx;
              document.getElementById(access).style.display = "block";
            } else {
              document.getElementById("saleslead").style.display = "none";
            }
          });
          let stepsList = this.state.Steps;
          let activeIndex = stepsList.findIndex(
            (x) => x.classname === "active"
          );
          stepsList[key]["classname"] = "active";
          stepsList[activeIndex]["classname"] = "inactive";
          this.setState({ Steps: stepsList });
        }
      }
      if (CommonConfig.getUserAccess("Search Sales Lead").ReadAccess === 0) {
        let currentSteps = this.state.Steps;
        let index = this.state.Steps.findIndex(
          (x) => x.stepId === "searchsaleslead"
        );
        currentSteps.splice(index, 1);
        currentSteps[0]["classname"] = "active";
        this.setState({ Steps: currentSteps });
        document.getElementById("searchsaleslead").style.display = "none";
      }
      if (CommonConfig.getUserAccess("Sales Lead").ReadAccess === 0) {
        let currentSteps = this.state.Steps;
        let index = this.state.Steps.findIndex((x) => x.stepId === "saleslead");
        currentSteps.splice(index, 1);
        currentSteps[0]["classname"] = "active";
        this.setState({ Steps: currentSteps });
        document.getElementById("saleslead").style.display = "none";
      }
    }
  };

  getCountry = () => {
    try {
      api
        .get("location/getCountryList")
        .then((res) => {
          if (res.success) {
            var Country = res.data;
            this.setState({ CountryList: Country });
          }
        })
        .catch((err) => {
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {
      cogoToast.error("Something Went Wrong");
    }
  };

  getStringMap = () => {
    let data = { stringMapType: "SEARCHSALESLEADFIELD" };
    api
      .post("stringMap/getstringMap", data)
      .then((result) => {
        if (result.success) {
          const fieldObj = result.data.map((field) => {
            return { label: field.Description, value: field.StringMapName };
          });
          this.setState({ selectField: fieldObj });
        } else {
          cogoToast.error("Something Went Wrong");
        }
      })
      .catch((err) => {
        cogoToast.error("Something Went Wrong");
      });
  };

  getFilterlist = () => {
    let data = { stringMapType: "SEARCHSALESLEADFILTER" };
    api
      .post("stringMap/getstringMap", data)
      .then((result) => {
        if (result.success) {
          const filterObj = result.data.map((filter) => {
            return { label: filter.Description, value: filter.StringMapName };
          });
          this.setState({ selectFilter: filterObj });
        } else {
          cogoToast.error("Something Went Wrong");
        }
      })
      .catch((err) => {
        cogoToast.error("Something Went Wrong");
      });
  };

  managedby = () => {
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
        .catch((err) => {
          cogoToast.error("Something Went Wrong");
        });
    } catch (err) {
      cogoToast.error("Something Went Wrong");
    }
  };

  getProposalData(params) {
    debugger;
    if (params !== "") {
      if (params === "All") {
        params = "";
      }
      let data = {
        whereClause: params,
      };

      this.setState({ Loading: true });
      api
        .post("salesLead/getSalesLead", data)
        .then((result) => {
          if (result.success) {
            this.setState({ Loading: false });
            if (this.state.AllAccess === 1) {
              this.setState({ ProposalData: result.Data });
            } else {
              let proposalData = result.Data.filter(
                (x) => x.ManagedBy === this.state.loggedUser
              );
              this.setState({ ProposalData: proposalData });
            }
          } else {
            this.setState({ Loading: false });
            cogoToast.error("Something went wrong");
          }
        })
        .catch((err) => {
          cogoToast.error("Something Went Wrong");
        });
    } else {
      this.setState({ ProposalData: [] });
    }
  }

  handleEdit = (record) => {
    this.props.history.push({
      pathname: "/admin/EditSalesLeads",
      state: {
        id: record.original.SalesLeadManagementID,
        filterlist: this.state.filterProps,
        statusList: this.state.statusList.length
          ? this.state.statusList
          : [{ label: "New", value: "New" }],
        statusfilter: this.state.defaultfilterValue,
        packageValue: this.state.packageValue,
        sortlist: this.state.sortProps,
      },
    });
  };

  handleAdd = (record) => {
    this.props.history.push({
      pathname: "/admin/EditSalesLeads",
      state: {
        id: "",
        filterlist: this.state.filterProps,
        statusList: this.state.statusList.length
          ? this.state.statusList
          : [{ label: "New", value: "New" }],
        statusfilter: this.state.defaultfilterValue,
        packageValue: this.state.packageValue,
        sortlist: this.state.sortProps,
      },
    });
  };

  requestChange = (event, idx) => {
    const { name, value } = event.target;
    const filterlist = this.state.filtered;
    for (var i = 0; i < filterlist.length; i++) {
      filterlist[i]["error"] = false;
      filterlist[i]["helperText"] = "";
      filterlist[i]["fielderror"] = false;
      filterlist[i]["fieldhelperText"] = "";
      filterlist[i]["filtererror"] = false;
      filterlist[i]["filterhelperText"] = "";
    }

    if (name === "field") {
      filterlist[idx][name] = value;
      filterlist[idx]["filterValue"] = "";
      filterlist[idx]["filter"] = "";
      filterlist[idx]["error"] = false;
      filterlist[idx]["helperText"] = "";
    } else {
      filterlist[idx][name] = value;
    }

    this.setState({ filtered: filterlist });
  };

  managedBY = (event, type, idx, value) => {
    const filterlist = this.state.filtered;
    filterlist[idx][type] = value;
    filterlist[idx]["error"] = false;
    filterlist[idx]["helperText"] = "";
    this.setState({ filtered: filterlist });
  };

  changeCountry = (event, type, idx, value) => {
    const filterlist = this.state.filtered;
    filterlist[idx][type] = value;
    filterlist[idx]["error"] = false;
    filterlist[idx]["helperText"] = "";
    this.setState({ filtered: filterlist });
  };

  changeContentType = (event, type, idx, value) => {
    const filterList = this.state.filtered;
    filterList[idx][type] = value;
    filterList[idx]["error"] = false;
    filterList[idx]["helperText"] = "";
    this.setState({ filtered: filterList });
  };

  handleLeadDate = (date, idx, type) => {
    const filterlist = this.state.filtered;
    filterlist[idx]["error"] = false;
    filterlist[idx]["helperText"] = "";
    filterlist[idx][type] = moment(date).format(
      CommonConfig.dateFormat.dbDateTime
    );
    this.setState({ filtered: filterlist });
  };

  fieldSelect = () => {
    return this.state.selectField.map((content) => {
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

  filterSelect = () => {
    return this.state.selectFilter.map((content) => {
      return (
        <MenuItem classes={{ root: classes.selectMenuItem }} value={content}>
          {" "}
          {content.label}{" "}
        </MenuItem>
      );
    });
  };

  filterDropDown = () => {
    return this.state.selectFilter
      .filter(
        (x) =>
          x.label !== "Start With" &&
          x.label !== "Contains" &&
          x.label !== "Ends With"
      )
      .map((content) => {
        return (
          <MenuItem classes={{ root: classes.selectMenuItem }} value={content}>
            {" "}
            {content.label}{" "}
          </MenuItem>
        );
      });
  };

  nameFilter = () => {
    return this.state.selectFilter
      .filter((x) => x.label === "Is equal to" || x.label === "Contains")
      .map((content) => {
        return (
          <MenuItem classes={{ root: classes.selectMenuItem }} value={content}>
            {" "}
            {content.label}{" "}
          </MenuItem>
        );
      });
  };

  filterBasic = () => {
    return this.state.selectFilter
      .filter((x) => x.label === "Is equal to")
      .map((content) => {
        return (
          <MenuItem classes={{ root: classes.selectMenuItem }} value={content}>
            {" "}
            {content.label}{" "}
          </MenuItem>
        );
      });
  };

  fieldBasic = () => {
    return this.state.selectField
      .filter(
        (x) =>
          x.label === "Phone Number" ||
          x.label === "Email ID" ||
          x.label === "Name"
      )
      .map((content) => {
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

  samefilter = () => {
    let IsValid = true;
    let filterLength;
    var sameFilter = this.state.filtered;

    for (var i = 0; i < sameFilter.length; i++) {
      if (
        sameFilter[i].field !== "ManagedBy" &&
        sameFilter[i].field !== "FromCountryID" &&
        sameFilter[i].field !== "ToCountryID"
      ) {
        filterLength = this.state.filtered.filter(
          (x) =>
            x.filterValue === sameFilter[i].filterValue &&
            x.filter === sameFilter[i].filter &&
            x.field === sameFilter[i].field
        ).length;
      } else {
        filterLength = this.state.filtered.filter(
          (x) =>
            x.filterValue.value === sameFilter[i].filterValue.value &&
            x.filter === sameFilter[i].filter &&
            x.field === sameFilter[i].field
        ).length;
      }
    }

    if (filterLength >= 2) {
      IsValid = false;
    } else {
      IsValid = true;
    }
    return IsValid;
  };

  validate = () => {
    var finalFilterList = this.state.filtered;
    let IsValid = true;
    for (var i = 0; i < finalFilterList.length; i++) {
      if (
        !CommonConfig.isEmpty(finalFilterList[i]["field"]) &&
        !CommonConfig.isEmpty(finalFilterList[i]["filter"])
      ) {
        if (finalFilterList[i]["field"] === "SalesLeadManagementID") {
          if (CommonConfig.isEmpty(finalFilterList[i]["filterValue"])) {
            IsValid = false;
            finalFilterList[i]["error"] = true;
            finalFilterList[i]["helperText"] = "Please enter Lead ID";
          } else {
            IsValid = true;
            finalFilterList[i]["error"] = false;
            finalFilterList[i]["helperText"] = "";
          }
        }

        if (finalFilterList[i]["field"] === "slm.CreatedOn") {
          if (CommonConfig.isEmpty(finalFilterList[i]["filterValue"])) {
            IsValid = false;
            finalFilterList[i]["error"] = true;
            finalFilterList[i]["helperText"] = "Please select Lead Date";
          } else {
            IsValid = true;
            finalFilterList[i]["error"] = false;
            finalFilterList[i]["helperText"] = "";
          }
        }

        if (finalFilterList[i]["field"] === "ContactName") {
          if (CommonConfig.isEmpty(finalFilterList[i]["filterValue"])) {
            IsValid = false;
            finalFilterList[i]["error"] = true;
            finalFilterList[i]["helperText"] = "Please enter Name";
          } else if (finalFilterList[i]["filterValue"].length < 4) {
            IsValid = false;
            finalFilterList[i]["error"] = true;
            finalFilterList[i]["helperText"] =
              "Please enter atleast 4 character";
          } else {
            IsValid = true;
            finalFilterList[i]["error"] = false;
            finalFilterList[i]["helperText"] = "";
          }
        }

        if (finalFilterList[i]["field"] === "PhoneNumber") {
          if (CommonConfig.isEmpty(finalFilterList[i]["filterValue"])) {
            IsValid = false;
            finalFilterList[i]["error"] = true;
            finalFilterList[i]["helperText"] = "Please enter Phone Number";
          } else {
            IsValid = true;
            finalFilterList[i]["error"] = false;
            finalFilterList[i]["helperText"] = "";
          }
        }

        if (finalFilterList[i]["field"] === "Email") {
          if (CommonConfig.isEmpty(finalFilterList[i]["filterValue"])) {
            IsValid = false;
            finalFilterList[i]["error"] = true;
            finalFilterList[i]["helperText"] = "Please enter Email ID";
          } else {
            IsValid = true;
            finalFilterList[i]["error"] = false;
            finalFilterList[i]["helperText"] = "";
          }
        }

        if (finalFilterList[i]["field"] === "ManagedBy") {
          if (CommonConfig.isEmpty(finalFilterList[i]["filterValue"])) {
            IsValid = false;
            finalFilterList[i]["error"] = true;
            finalFilterList[i]["helperText"] = "Please select managed by";
          } else {
            IsValid = true;
            finalFilterList[i]["error"] = false;
            finalFilterList[i]["helperText"] = "";
          }
        }

        if (finalFilterList[i]["field"] === "FromState") {
          if (CommonConfig.isEmpty(finalFilterList[i]["filterValue"])) {
            IsValid = false;
            finalFilterList[i]["error"] = true;
            finalFilterList[i]["helperText"] = "Please enter From State";
          } else {
            IsValid = true;
            finalFilterList[i]["error"] = false;
            finalFilterList[i]["helperText"] = "";
          }
        }

        if (finalFilterList[i]["field"] === "ToState") {
          if (CommonConfig.isEmpty(finalFilterList[i]["filterValue"])) {
            IsValid = false;
            finalFilterList[i]["error"] = true;
            finalFilterList[i]["helperText"] = "Please enter To State";
          } else {
            IsValid = true;
            finalFilterList[i]["error"] = false;
            finalFilterList[i]["helperText"] = "";
          }
        }

        if (finalFilterList[i]["field"] === "FromZipCode") {
          if (CommonConfig.isEmpty(finalFilterList[i]["filterValue"])) {
            IsValid = false;
            finalFilterList[i]["error"] = true;
            finalFilterList[i]["helperText"] = "Please enter From Zip";
          } else {
            IsValid = true;
            finalFilterList[i]["error"] = false;
            finalFilterList[i]["helperText"] = "";
          }
        }

        if (finalFilterList[i]["field"] === "ToCity") {
          if (CommonConfig.isEmpty(finalFilterList[i]["filterValue"])) {
            IsValid = false;
            finalFilterList[i]["error"] = true;
            finalFilterList[i]["helperText"] = "Please enter To City";
          } else {
            IsValid = true;
            finalFilterList[i]["error"] = false;
            finalFilterList[i]["helperText"] = "";
          }
        }

        if (finalFilterList[i]["field"] === "ToZipCode") {
          if (CommonConfig.isEmpty(finalFilterList[i]["filterValue"])) {
            IsValid = false;
            finalFilterList[i]["error"] = true;
            finalFilterList[i]["helperText"] = "Please enter To Zip";
          } else {
            IsValid = true;
            finalFilterList[i]["error"] = false;
            finalFilterList[i]["helperText"] = "";
          }
        }

        if (finalFilterList[i]["field"] === "ToCountryID") {
          if (CommonConfig.isEmpty(finalFilterList[i]["filterValue"])) {
            IsValid = false;
            finalFilterList[i]["error"] = true;
            finalFilterList[i]["helperText"] = "Please select Country";
          } else {
            IsValid = true;
            finalFilterList[i]["error"] = false;
            finalFilterList[i]["helperText"] = "";
          }
        }

        if (finalFilterList[i]["field"] === "FromCountryID") {
          if (CommonConfig.isEmpty(finalFilterList[i]["filterValue"])) {
            IsValid = false;
            finalFilterList[i]["error"] = true;
            finalFilterList[i]["helperText"] = "Please select Country";
          } else {
            IsValid = true;
            finalFilterList[i]["error"] = false;
            finalFilterList[i]["helperText"] = "";
          }
        }

        if (finalFilterList[i]["field"] === "PackageType") {
          if (CommonConfig.isEmpty(finalFilterList[i]["filterValue"])) {
            IsValid = false;
            finalFilterList[i]["error"] = true;
            finalFilterList[i]["helperText"] = "Please enter Content Type";
          } else {
            IsValid = true;
            finalFilterList[i]["error"] = false;
            finalFilterList[i]["helperText"] = "";
          }
        }

        if (finalFilterList[i]["field"] === "FromCity") {
          if (CommonConfig.isEmpty(finalFilterList[i]["filterValue"])) {
            IsValid = false;
            finalFilterList[i]["error"] = true;
            finalFilterList[i]["helperText"] = "Please enter From City";
          } else {
            IsValid = true;
            finalFilterList[i]["error"] = false;
            finalFilterList[i]["helperText"] = "";
          }
        }
      } else {
        if (CommonConfig.isEmpty(finalFilterList[i]["field"])) {
          IsValid = false;
          finalFilterList[i]["fielderror"] = true;
          finalFilterList[i]["fieldhelperText"] = "Please select one field";
        }
        if (CommonConfig.isEmpty(finalFilterList[i]["filter"])) {
          IsValid = false;
          finalFilterList[i]["filtererror"] = true;
          finalFilterList[i]["filterhelperText"] = "Please select one filter";
        }
      }
    }
    this.setState({ fitered: finalFilterList });
    return IsValid;
  };

  search = () => {
    if (this.validate()) {
      if (this.samefilter()) {
        var filterList = this.state.filtered.map((filter) => {
          var obj = {};
          obj.columnname = filter.field;
          obj.condition = filter.filter.label;
          obj.conditionoperator = filter.filter.value;

          if (filter.filterValue.value) {
            obj.value = filter.filterValue.value;
          } else {
            obj.value = filter.filterValue;
          }

          return obj;
        });

        this.setState({ SearchFinalFilter: filterList });
        var FinalStr = "";
        var operator = "AND";
        for (var i = 0; i < filterList.length; i++) {
          if (
            !(
              filterList[i]["columnname"] === "slm.CreatedOn" &&
              (filterList[i]["condition"] === "Start With" ||
                filterList[i]["condition"] === "Ends With")
            )
          ) {
            if (filterList[i]["condition"] === "Start With") {
              if (i === 0) {
                if(filterList[i]["columnname"] === "slm.CreatedOn"){
                  FinalStr =
                  FinalStr + "date(" +
                  filterList[i]["columnname"] +
                  ") " +
                  filterList[i]["conditionoperator"] +
                  " '" +
                  filterList[i]["value"] +
                  "%'";
                }else{
                  FinalStr =
                  FinalStr + 
                  filterList[i]["columnname"] +
                  " " +
                  filterList[i]["conditionoperator"] +
                  " '" +
                  filterList[i]["value"] +
                  "%'";
                }
              } else {
                if(filterList[i]["columnname"] === "slm.CreatedOn"){
                FinalStr =
                  FinalStr +
                  " " +
                  operator +
                  " " + "date(" +
                  filterList[i]["columnname"] +
                  ") " +
                  filterList[i]["conditionoperator"] +
                  " '" +
                  filterList[i]["value"] +
                  "%" +
                  "'";
                }
                else{
                  FinalStr =
                  FinalStr +
                  " " +
                  operator +
                  " " + 
                  filterList[i]["columnname"] +
                  " " +
                  filterList[i]["conditionoperator"] +
                  " '" +
                  filterList[i]["value"] +
                  "%" +
                  "'";
                }
              }
            } else if (filterList[i]["condition"] === "Ends With") {
              if (i === 0) {
                if(filterList[i]["columnname"] === "slm.CreatedOn"){
                FinalStr =
                  FinalStr + "date(" +
                  filterList[i]["columnname"] +
                  ") " +
                  filterList[i]["conditionoperator"] +
                  " '" +
                  "%" +
                  filterList[i]["value"] +
                  "'";
                }
                else{
                  FinalStr =
                  FinalStr + 
                  filterList[i]["columnname"] +
                  " " +
                  filterList[i]["conditionoperator"] +
                  " '" +
                  "%" +
                  filterList[i]["value"] +
                  "'";
                }
              } else {
                if(filterList[i]["columnname"] === "slm.CreatedOn"){
                FinalStr =
                  FinalStr +
                  " " +
                  operator +
                  " " + "date(" +
                  filterList[i]["columnname"] +
                  ") " +
                  filterList[i]["conditionoperator"] +
                  " '" +
                  "%" +
                  filterList[i]["value"] +
                  "'";
                }else{
                  FinalStr =
                  FinalStr +
                  " " +
                  operator +
                  " " + 
                  filterList[i]["columnname"] +
                  " " +
                  filterList[i]["conditionoperator"] +
                  " '" +
                  "%" +
                  filterList[i]["value"] +
                  "'";
                }
              }
            } else if (filterList[i]["condition"] === "Contains") {
              if (i === 0) {
                if(filterList[i]["columnname"] === "slm.CreatedOn"){
                FinalStr =
                  FinalStr + "date(" +
                  filterList[i]["columnname"] +
                  ") " +
                  filterList[i]["conditionoperator"] +
                  " '%" +
                  filterList[i]["value"] +
                  "%'";
                }else{
                  FinalStr =
                  FinalStr + 
                  filterList[i]["columnname"] +
                  " " +
                  filterList[i]["conditionoperator"] +
                  " '%" +
                  filterList[i]["value"] +
                  "%'";
                }
              } else {
                if(filterList[i]["columnname"] === "slm.CreatedOn"){
                FinalStr =
                  FinalStr +
                  " " +
                  operator +
                  " " + "date(" +
                  filterList[i]["columnname"] +
                  ") " +
                  filterList[i]["conditionoperator"] +
                  " '%" +
                  filterList[i]["value"] +
                  "%'";
                }else{
                  FinalStr =
                  FinalStr +
                  " " +
                  operator +
                  " " +
                  filterList[i]["columnname"] +
                  " " +
                  filterList[i]["conditionoperator"] +
                  " '%" +
                  filterList[i]["value"] +
                  "%'";
                }
              }
            } else {
              if (i === 0) {
                if(filterList[i]["columnname"] === "slm.CreatedOn"){
                FinalStr =
                  FinalStr + "date(" +
                  filterList[i]["columnname"] +
                  ") " +
                  filterList[i]["conditionoperator"] +
                  " '" +
                  filterList[i]["value"] +
                  "'";
                }else{
                  FinalStr =
                  FinalStr + 
                  filterList[i]["columnname"] +
                  " " +
                  filterList[i]["conditionoperator"] +
                  " '" +
                  filterList[i]["value"] +
                  "'";
                }
              } else {
                if(filterList[i]["columnname"] === "slm.CreatedOn"){
                FinalStr =
                  FinalStr +
                  " " +
                  operator +
                  " " + "date(" +
                  filterList[i]["columnname"] +
                  ") " +
                  filterList[i]["conditionoperator"] +
                  " '" +
                  filterList[i]["value"] +
                  "'";
                }else{
                  FinalStr =
                  FinalStr +
                  " " +
                  operator +
                  " " + 
                  filterList[i]["columnname"] +
                  " " +
                  filterList[i]["conditionoperator"] +
                  " '" +
                  filterList[i]["value"] +
                  "'";
                }
              }
            }
          } else {
            if (filterList[i]["condition"] === "Start With") {
              filterList[i]["conditionoperator"] = ">=";
            }

            if (filterList[i]["condition"] === "Ends With") {
              filterList[i]["conditionoperator"] = "<=";
            }

            if (i === 0) {
              if(filterList[i]["columnname"] === "slm.CreatedOn"){
              FinalStr =
                FinalStr + "date(" +
                filterList[i]["columnname"] +
                ") " +
                filterList[i]["conditionoperator"] +
                " '" +
                filterList[i]["value"] +
                "'";
              }else{
                FinalStr =
                FinalStr + 
                filterList[i]["columnname"] +
                " " +
                filterList[i]["conditionoperator"] +
                " '" +
                filterList[i]["value"] +
                "'";
              }
            } else {
              if(filterList[i]["columnname"] === "slm.CreatedOn"){
              FinalStr =
                FinalStr +
                " " +
                operator +
                " " + "date(" +
                filterList[i]["columnname"] +
                ") " +
                filterList[i]["conditionoperator"] +
                " '" +
                filterList[i]["value"] +
                "'";
              }else{
                FinalStr =
                FinalStr +
                " " +
                operator +
                " " + 
                filterList[i]["columnname"] +
                " " +
                filterList[i]["conditionoperator"] +
                " '" +
                filterList[i]["value"] +
                "'";
              }
            }
          }
        }

        this.setState({
          searchFilterValue: "All",
          isEdit: false,
          SearchClicked: true,
        });

        if (CommonConfig.getUserAccess("Sales Lead").AllAccess === 1) {
          this.setState({ isEdit: 1 });
        }

        if (CommonConfig.getUserAccess("Sales Lead").AllAccess === 0) {
          this.setState({ AllAccess: 1 });
        }
        // localStorage.setItem("SearchParams",JSON.stringify(FinalStr));
        this.getSearchResults(FinalStr);
      } else {
        cogoToast.error(
          "There were found same filters.Please check and modify"
        );
      }
    } else {
      cogoToast.error("Please correct error and resubmit form");
    }
  };

  reset = () => {
    const filterlist = this.state.filtered;
    filterlist[0]["field"] = "";
    filterlist[0]["filter"] = "";
    filterlist[0]["error"] = false;
    filterlist[0]["fieldhelperText"] = "";
    filterlist[0]["filterhelperText"] = "";
    filterlist[0]["helperText"] = "";
    filterlist[0]["fielderror"] = false;
    filterlist[0]["filtererror"] = false;
    filterlist[0]["filterValue"] = "";
    filterlist.splice(1, filterlist.length);
    this.setState({
      filtered: filterlist,
      searchFilterValue: "New",
      isEdit: true,
      SearchClicked: false,
      SearchSalesLeadList: [],
    });
    localStorage.removeItem("SearchCount");
    if (CommonConfig.getUserAccess("Sales Lead").AllAccess === 0) {
      this.setState({ AllAccess: 0 });
    }
  };

  filterDelete = (Index) => {
    const filterList = this.state.filtered;
    filterList.splice(Index, 1);
    this.setState({ filtered: filterList });
  };

  addnewFilter = () => {
    var filterList = this.state.filtered;
    var k = 0;
    for (var i = 0; i < filterList.length; i++) {
      if (CommonConfig.isEmpty(filterList[i]["field"])) {
        filterList[i]["fielderror"] = true;
        filterList[i]["fieldhelperText"] = "Please select one field";
        k++;
      }
      if (CommonConfig.isEmpty(filterList[i]["filter"])) {
        filterList[i]["filtererror"] = true;
        filterList[i]["filterhelperText"] = "Please select one filter";
        k++;
      }
      if (CommonConfig.isEmpty(filterList[i]["filterValue"])) {
        filterList[i]["error"] = true;
        filterList[i]["helperText"] = "Please enter value";
        k++;
      }
    }

    if (k === 0) {
      const filterNew = {
        field: "",
        filter: "",
        error: false,
        helperText: "",
        filterValue: "",
        Index: this.state.filtered.length + 1,
      };
      this.setState({ filtered: [...this.state.filtered, filterNew] });
    } else {
      this.setState({ filtered: filterList });
      cogoToast.error("Please fill above filter first.");
    }
  };

  filterRow = () => {
    return this.state.filtered.map((selectfield, idx) => {
      const countrylist = this.state.CountryList.map((countrylist) => {
        return { value: countrylist.CountryID, label: countrylist.CountryName };
      });
      const managedby = this.state.managedby.map((managedby) => {
        return { value: managedby.PersonID, label: managedby.Name };
      });
      const contenttype = this.state.contentType.map((content) => {
        return { value: content.value, label: content.label };
      });
      const status = this.state.requestStatus
        .filter((x) => x.label !== "All")
        .map((status) => {
          return { value: status.value, label: status.label };
        });

      return (
        <tr>
          <td>
            <div className="select-spl">
              <FormControl fullWidth error={selectfield.fielderror}>
                <InputLabel
                  htmlFor="selectshipmenttype"
                  className={classes.selectLabel}
                >
                  Select Field
                </InputLabel>
                <Select
                  fullWidth={true}
                  id="field"
                  name="field"
                  value={selectfield.field}
                  onChange={(event) => this.requestChange(event, idx)}
                >
                  {this.fieldSelect()}
                </Select>
                <FormHelperText>{selectfield.fieldhelperText}</FormHelperText>
              </FormControl>
            </div>
          </td>
          <td>
            <div className="select-spl">
              <FormControl fullWidth error={selectfield.filtererror}>
                <InputLabel
                  htmlFor="selectfilter"
                  className={classes.selectLabel}
                >
                  Select Filter
                </InputLabel>
                <Select
                  fullWidth={true}
                  id="filter"
                  name="filter"
                  value={selectfield.filter}
                  onChange={(event) => this.requestChange(event, idx)}
                >
                  {selectfield.field === "ManagedBy" ||
                  selectfield.field === "ToCountryID" ||
                  selectfield.field === "FromCountryID" ||
                  selectfield.field === "PackageType" ||
                  selectfield.field === "ProposalStatus"
                    ? this.filterDropDown()
                    : this.filterSelect()}
                </Select>
                <FormHelperText>{selectfield.filterhelperText}</FormHelperText>
              </FormControl>
            </div>
          </td>
          <td>
            <div className="mt-slam">
              {selectfield.field === "ManagedBy" ? (
                <Autocomplete
                  options={managedby}
                  id="managedby"
                  name="filterValue"
                  getOptionLabel={(option) =>
                    option.label ? option.label : option
                  }
                  value={selectfield.filterValue}
                  onChange={(event, value) =>
                    this.managedBY(event, "filterValue", idx, value)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={selectfield.error}
                      helperText={selectfield.helperText}
                      label="Managed By"
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
              ) : selectfield.field === "FromCountryID" ||
                selectfield.field === "ToCountryID" ? (
                <Autocomplete
                  options={countrylist}
                  getOptionLabel={(option) =>
                    option.label ? option.label : option
                  }
                  id="countrylist"
                  autoSelect
                  onChange={(event, value) =>
                    this.changeCountry(event, "filterValue", idx, value)
                  }
                  value={selectfield.filterValue}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={selectfield.error}
                      helperText={selectfield.helperText}
                      label="Country"
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
              ) : selectfield.field === "slm.CreatedOn" ? (
                <div className="dt-vs">
                  <FormControl fullWidth>
                    <Datetime
                      dateFormat={"MM/DD/YYYY"}
                      timeFormat={false}
                      selected={moment(selectfield.filterValue)}
                      inputProps={{ placeholder: "Lead Date" }}
                      onChange={(date) =>
                        this.handleLeadDate(date, idx, "filterValue")
                      }
                      closeOnSelect={true}
                      renderInput={(params) => (
                        <TextField
                          style={{ marginTop: "-15px" }}
                          error={selectfield.error}
                          helperText={selectfield.helperText}
                          {...params}
                          label="Select Date"
                          margin="normal"
                          fullWidth
                        />
                      )}
                    />
                    <Icon className="date-icon tp-slam">date_range</Icon>
                  </FormControl>
                </div>
              ) : selectfield.field === "PackageType" ? (
                <Autocomplete
                  options={contenttype}
                  getOptionLabel={(option) =>
                    option.label ? option.label : option
                  }
                  id="content"
                  onChange={(event, value) =>
                    this.changeContentType(event, "filterValue", idx, value)
                  }
                  value={selectfield.filterValue}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={selectfield.error}
                      helperText={selectfield.helperText}
                      label="Content Type"
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
              ) : selectfield.field === "ProposalStatus" ? (
                <Autocomplete
                  options={status}
                  getOptionLabel={(option) =>
                    option.label ? option.label : option
                  }
                  id="content"
                  onChange={(event, value) =>
                    this.changeContentType(event, "filterValue", idx, value)
                  }
                  value={selectfield.filterValue}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={selectfield.error}
                      helperText={selectfield.helperText}
                      label="Status"
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
              ) : (
                <CustomInput
                  labelText="Enter Value"
                  id="filterValue"
                  error={selectfield.error}
                  helperText={selectfield.helperText}
                  formControlProps={{ fullWidth: true }}
                  inputProps={{
                    value: selectfield.filterValue,
                    name: "filterValue",
                    onChange: (event) => this.requestChange(event, idx),
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        className={classes.inputAdornment}
                      >
                        <Icon className={classes.User}>chrome_reader_mode</Icon>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </div>
          </td>
          <td>
            {idx !== 0 ? (
              <Button
                justIcon
                color="danger"
                className="Plus-btn mt-33"
                onClick={() => this.filterDelete(idx)}
              >
                <i className={"fas fa-minus"} />
              </Button>
            ) : null}

            {this.state.filtered.length - 1 === idx ? (
              <Button
                justIcon
                color="facebook"
                onClick={this.addnewFilter}
                className="Plus-btn mt-33"
              >
                <i className={"fas fa-plus"} />
              </Button>
            ) : null}
          </td>
        </tr>
      );
    });
  };

  basicFilter = () => {
    return this.state.filtered.map((selectfield, idx) => {
      return (
        <tr>
          <td>
            <FormControl
              fullWidth
              error={selectfield.fielderror}
              className="select-spl"
            >
              <InputLabel
                htmlFor="selectshipmenttype"
                className={classes.selectLabel}
              >
                Select Field
              </InputLabel>
              <Select
                fullWidth={true}
                id="field"
                name="field"
                value={selectfield.field}
                onChange={(event) => this.requestChange(event, idx)}
              >
                {this.fieldBasic()}
              </Select>
              <FormHelperText>{selectfield.fieldhelperText}</FormHelperText>
            </FormControl>
          </td>
          <td>
            <FormControl
              fullWidth
              error={selectfield.filtererror}
              className="select-spl"
            >
              <InputLabel
                htmlFor="selectfilter"
                className={classes.selectLabel}
              >
                Select Filter
              </InputLabel>
              <Select
                fullWidth={true}
                id="filter"
                name="filter"
                value={selectfield.filter}
                onChange={(event) => this.requestChange(event, idx)}
              >
                {selectfield.field === "ContactName"
                  ? this.nameFilter()
                  : this.filterBasic()}
              </Select>
              <FormHelperText>{selectfield.filterhelperText}</FormHelperText>
            </FormControl>
          </td>
          <td>
            <FormControl fullWidth className="mb-12">
              <CustomInput
                labelText="Enter Value"
                id="filterValue"
                error={selectfield.error}
                margin="normal"
                helperText={selectfield.helperText}
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: selectfield.filterValue,
                  name: "filterValue",
                  onChange: (event) => this.requestChange(event, idx),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      className={classes.inputAdornment}
                    >
                      <Icon className={classes.User}>chrome_reader_mode</Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </td>

          <td>
            {idx !== 0 ? (
              <Button
                justIcon
                color="danger"
                className="Plus-btn mt-18"
                onClick={() => this.filterDelete(idx)}
              >
                <i className={"fas fa-minus"} />
              </Button>
            ) : null}

            {this.state.filtered.length - 1 === idx ? (
              <Button
                justIcon
                color="facebook"
                onClick={this.addnewFilter}
                className="Plus-btn mt-18"
              >
                <i className={"fas fa-plus"} />
              </Button>
            ) : null}
          </td>
        </tr>
      );
    });
  };

  toggle = (e) => {
    this.setState({
      expand: !this.state.expand,
    });
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

  searchfilterMethod = (e) => {
    this.setState({ searchFilterValue: e.target.value });
  };

  ContentFilter = (event, value) => {
    this.setState({ packageValue: value });
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

  searchcheckProps = (e) => {
    if (this.state.searchFinalLength !== e.sortedData.length) {
      this.searchsetLength(e.sortedData.length);
    }
    return "";
  };

  searchsetLength = (len) => {
    this.setState({ searchFinalLength: len });
  };

  getSearchResults = (params) => {
    let data = {
      whereClause: params,
    };

    this.setState({ Loading: true });
    api
      .post("salesLead/getSalesLead", data)
      .then((result) => {
        if (result.success) {
          this.setState({ Loading: false });
          if (this.state.AllAccess === 1) {
            this.setState({ SearchSalesLeadList: result.Data });
          } else {
            let proposalData = result.Data.filter(
              (x) => x.ManagedBy === this.state.loggedUser
            );
            this.setState({ SearchSalesLeadList: proposalData });
          }
        } else {
          this.setState({ Loading: false });
          cogoToast.error("Something went wrong");
        }
      })
      .catch((err) => {
        cogoToast.error("Something Went Wrong");
      });
  };

  filterMethod = (event, value) => {
    if (value !== null) {
      if (value.length !== 0) {
        value = value.filter(
          (v, i, a) => a.findIndex((t) => t.value === v.value) === i
        );
        let query = "";
        let StatusQuery = "";
        let allFilter = value.findIndex((x) => x.value === "All");
        if (allFilter === 0) {
          value.splice(allFilter, 1);
          allFilter = -1;
        }
        if (allFilter === -1) {
          for (var j = 0; j < value.length; j++) {
            if (j === 0) {
              if (value.length === 1) {
                StatusQuery = `  ( ProposalStatus = "` + value[j].value + `")`;
              } else {
                StatusQuery = `  ( ProposalStatus = "` + value[j].value + `"`;
              }
            } else if (j + 1 === value.length) {
              StatusQuery = ` OR ProposalStatus = "` + value[j].value + `")`;
            } else {
              StatusQuery = ` OR ProposalStatus = "` + value[j].value + `"`;
            }
            query = query + StatusQuery;
          }
        } else {
          value = [{ label: "All", value: "All" }];
        }
        this.getProposalData(query);
      } else {
        this.setState({ ProposalData: [] });
      }
      this.setState({ statusList: value });
    }
  };

  // Navigation Methods
  navigateChange = (key) => {
    let stepsList = this.state.Steps;
    let activeIndex = stepsList.findIndex((x) => x.classname === "active");
    if (key !== activeIndex) {
      stepsList[key]["classname"] = "active";
      stepsList[activeIndex]["classname"] = "inactive";
      this.setState({ Steps: stepsList });
      let divID = stepsList[key]["stepId"];
      let activeDiv = stepsList[activeIndex]["stepId"];
      document.getElementById(divID).style.display = "block";
      document.getElementById(activeDiv).style.display = "none";
    }
  };

  renderInputMethod = (params) => {
    return <TextField {...params} label="Status" variant="outlined" />;
  };

  optionProps = (option, value) => {
    if (option.value === value.value) {
      return true;
    } else {
      return false;
    }
  };
  handleCheckboxChange = (e, record, type) => {
    let checkedArr = this.state.requestStatus;
    if (type !== "All") {
      checkedArr
        .filter((x) => x.value === "All")
        .map((OBJ) => {
          OBJ.IsSelected = false;
          return OBJ;
        });
      checkedArr[record.Index]["IsSelected"] = e.target.checked;
      this.setState({
        checkAll: e.target.checked,
        //StatusList[0].IsSelected:true
      });
      let previousList = checkedArr.filter((x) => x.IsSelected === true);
      this.setState({ checkdata: previousList });
    } else {
      checkedArr.map((OBJ) => {
        OBJ.IsSelected = e.target.checked;
        return OBJ;
      });

      this.setState({
        checkAll: e.target.checked,
      });
      let previousList = checkedArr.filter((x) => x.IsSelected === true);
      let arrType = "previousSelectedStatusList";
      if (previousList.length === 0) {
        this.state.checkdata = "";
      } else {
        this.state.checkdata = `All`;
      }
      this.setState({
        requestStatus: checkedArr,
      });
    }
  };
  searchfilter = () => {
    this.setState({ IsDropDownShow: false });
    try {
      let Query = "";
      let inputdata = this.state.checkdata;
      if (inputdata === "All") {
        Query = inputdata;
      } else if (inputdata === "") {
        this.setState({ ProposalData: [] });
      } else if (inputdata.length === 1) {
        Query = `  ( ProposalStatus  = "` + inputdata[0].value + `")`;
      } else {
        for (var j = 0; j < inputdata.length; j++) {
          if (j === 0) {
            Query = `  ( ProposalStatus  = "` + inputdata[j].value + `"`;
          } else {
            Query =
              Query + ` OR ProposalStatus  = "` + inputdata[j].value + `"`;
          }
        }
        if (!CommonConfig.isEmpty(Query)) {
          Query = Query + `)`;
        }
      }
      this.getProposalData(Query);
    } catch (err) {
      cogoToast.error("Something went wrong 3");
    }
  };
  render() {
    const column = [
      {
        Header: "Date",
        id: "SalesLeadDate",
        maxWidth: 85,
        width: 85,
        filterable: true,
        sortable: true,
        sortMethod: (a, b) => {
          return CommonConfig.dateSortMethod(a, b);
        },
        accessor: (data) => {
          if (CommonConfig.isEmpty(data.CreatedOn)) {
            return moment().format("MM/DD/YYYY");
          } else {
            return moment(data.CreatedOn).format(
              CommonConfig.dateFormat.dateOnly
            );
          }
        },
      },
      {
        Header: "Name",
        id: "Name",
        width: 95,
        maxWidth: 95,
        filterable: true,
        sortable: true,
        accessor: "ContactName",
      },
      {
        Header: "Lead",
        id: "LeadID",
        width: 45,
        maxWidth: 45,
        filterable: true,
        sortable: true,
        accessor: "SalesLeadManagementID",
      },
      {
        Header: "From State",
        id: "From State",
        maxWidth: 92,
        filterable: true,
        sortable: true,
        width: 92,
        accessor: "FromState",
      },
      {
        Header: "From Country",
        id: "From Country",
        maxWidth: 96,
        filterable: true,
        sortable: true,
        width: 96,
        accessor: "FromCountry",
      },
      {
        Header: "To State",
        id: "To State",
        maxWidth: 78,
        filterable: true,
        sortable: true,
        width: 78,
        accessor: "ToState",
      },
      {
        Header: "To Country",
        id: "To Country",
        filterable: true,
        sortable: true,
        maxWidth: 96,
        width: 96,
        accessor: "ToCountry",
      },
      {
        Header: "Managed By",
        id: "Managed By",
        maxWidth: 114,
        filterable: true,
        sortable: true,
        width: 114,
        accessor: "ManagedByName",
      },
      {
        Header: "Status",
        maxWidth: 65,
        className: "status-filter",
        filterable: true,
        sortable: true,
        width: 70,
        accessor: "ProposalStatus",
      },
      {
        Header: "Followup",
        id: "FollowUp",
        filterable: true,
        sortable: true,
        width: 85,
        maxWidth: 85,
        accessor: (data) => {
          return moment(data.SalesLeadFollowupDate).isValid()
            ? moment(data.SalesLeadFollowupDate).format(
                CommonConfig.dateFormat.dateOnly
              )
            : "";
        },
      },
      {
        Header: "Actions",
        accessor: "Actions",
        width: 45,
        maxWidth: 50,
        filterable: false,
        Cell: (record) => {
          return this.state.isEdit ? (
            <div className="table-common-btn">
              <Button
                justIcon
                color="info"
                onClick={() => this.handleEdit(record)}
              >
                <i className="fas fa-edit"></i>
              </Button>
            </div>
          ) : record.original.ManagedBy === this.state.loggedUser ? (
            <div className="table-common-btn">
              <Button
                justIcon
                color="info"
                onClick={() => this.handleEdit(record)}
              >
                <i className="fas fa-edit"></i>
              </Button>
            </div>
          ) : (
            <div className="table-common-btn">
              <Button justIcon color="danger" disabled>
                <i className="fas fa-edit"></i>
              </Button>
            </div>
          );
        },
        sortable: false,
      },
    ];

    const searchcolumn = [
      {
        Header: "Date",
        id: "SalesLeadDate",
        sortMethod: (a, b) => {
          return CommonConfig.dateSortMethod(a, b);
        },
        maxWidth: 85,
        width: 85,
        filterable: true,
        sortable: true,
        accessor: (data) => {
          if (CommonConfig.isEmpty(data.CreatedOn)) {
            return moment().format("MM/DD/YYYY");
          } else {
            return moment(data.CreatedOn).format(
              "MM/DD/YYYY"
            );
          }
        },
      },
      {
        Header: "Name",
        id: "Name",
        width: 95,
        maxWidth: 95,
        filterable: true,
        sortable: true,
        accessor: "ContactName",
      },
      {
        Header: "Lead",
        id: "LeadID",
        width: 45,
        maxWidth: 45,
        filterable: true,
        sortable: true,
        accessor: "SalesLeadManagementID",
      },
      {
        Header: "From State",
        id: "From State",
        maxWidth: 92,
        filterable: true,
        sortable: true,
        width: 92,
        accessor: "FromState",
      },
      {
        Header: "From Country",
        id: "From Country",
        maxWidth: 96,
        filterable: true,
        sortable: true,
        width: 96,
        accessor: "FromCountry",
      },
      {
        Header: "To State",
        id: "To State",
        maxWidth: 78,
        filterable: true,
        sortable: true,
        width: 78,
        accessor: "ToState",
      },
      {
        Header: "To Country",
        id: "To Country",
        filterable: true,
        sortable: true,
        maxWidth: 96,
        width: 96,
        accessor: "ToCountry",
      },
      {
        Header: "Managed By",
        id: "Managed By",
        maxWidth: 114,
        filterable: true,
        sortable: true,
        width: 114,
        accessor: "ManagedByName",
      },
      {
        Header: "Status",
        maxWidth: 70,
        filterable: true,
        sortable: true,
        width: 70,
        accessor: "ProposalStatus",
      },
      {
        Header: "Followup",
        id: "FollowUp",
        filterable: true,
        sortable: true,
        width: 85,
        maxWidth: 85,
        accessor: (data) => {
          return moment(data.SalesLeadFollowupDate).isValid()
            ? moment(data.SalesLeadFollowupDate).format(
                CommonConfig.dateFormat.dateOnly
              )
            : "";
        },
      },
      {
        Header: "Actions",
        accessor: "Actions",
        width: 45,
        maxWidth: 50,
        filterable: false,
        Cell: (record) => {
          return this.state.isEdit ? (
            <div className="table-common-btn">
              <Button
                justIcon
                color="info"
                onClick={() => this.handleEdit(record)}
              >
                <i className="fas fa-edit"></i>
              </Button>
            </div>
          ) : record.original.ManagedBy === this.state.loggedUser ? (
            <div className="table-common-btn">
              <Button
                justIcon
                color="info"
                onClick={() => this.handleEdit(record)}
              >
                <i className="fas fa-edit"></i>
              </Button>
            </div>
          ) : (
            <div className="table-common-btn">
              <Button justIcon color="danger" disabled>
                <i className="fas fa-edit"></i>
              </Button>
            </div>
          );
        },
        sortable: false,
      },
    ];

    const {
      ProposalData,
      searchAllAccess,
      searchFinalLength,
      SearchSalesLeadList,
      SearchClicked,
    } = this.state;
    return (
      <GridContainer justify="center" className="schedule-pickup-main-outer">
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
        <GridItem xs={12} sm={12}>
          <Card>
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <SalesLeadIcon />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">Sales Lead</h4>
              {this.state.Steps.findIndex((x) => x.classname === "active") !==
              -1 ? (
                this.state.Steps[
                  this.state.Steps.findIndex((x) => x.classname === "active")
                ]["stepId"] === "saleslead" ? (
              <div className="filter-wrap">
                <div
                  className="filter-top-right"
                  onMouseLeave={() => this.setState({ IsDropDownShow: false })}
                  onMouseOver={() => this.setState({ IsDropDownShow: true })}
                >
                  <Button className="cm-toggle" color="rose">
                  Search SalesLead Status <ExpandMoreIcon />
                      </Button>
                      {this.state.IsDropDownShow === true ? (
                        <div className="cm-dropdown">
                          <div className="overflow-handle">
                            {this.state.requestStatus.map((step, key) => {
                              return (
                                <li>
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={step.IsSelected}
                                      onChange={(e) =>
                                        this.handleCheckboxChange(
                                          e,
                                          step,
                                          step.value
                                        )
                                      }
                                    />{" "}
                                    {step.value}
                                  </label>
                                </li>
                              );
                            })}
                          </div>
                          <div className="cms-wrap">
                            <Button
                              className="cm-search-btn"
                              color="rose"
                              onClick={() => this.searchfilter()}
                            >
                              Search
                            </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
                     ) : null
                     ) : null}        
                       
                                <div className="buttonW">
                            <Button color="primary" onClick = {() => this.handleAdd()}>Add Sales Lead</Button>
                            </div>
                           
                        
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
                <div className="shipment-pane" id="saleslead">
                  <ReactTable
                    className="-striped -highlight"
                    data={ProposalData}
                    filterable
                    defaultSorted={this.state.previousSortList}
                    defaultFiltered={this.state.previousFilterList}
                    minRows={2}
                    defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                    columns={column}
                    pageText={"Total rows : " + this.state.finalLength}
                    resizable={false}
                    defaultPageSize={10}
                    getTheadFilterProps={(e) => this.filterProps(e)}
                    getPaginationProps={(e) => this.checkProps(e)}
                    //PaginationComponent={pagination}
                    showPaginationBottom={true}
                    manualPagination={true}
                  />
                </div>
                <div className="shipment-pane" id="searchsaleslead">
                  {searchAllAccess.ReadAccess === 1 ||
                  searchAllAccess.AllAccess === 1 ? (
                    <GridItem>
                      <GridContainer justify="center">
                        <div className="expand-panel-outer">
                          <GridContainer justify="center">
                            <GridItem xs={12} sm={11} md={11}>
                              <div className="sales-lead-table">
                                <table>
                                  <tbody>
                                    {searchAllAccess.AllAccess === 1
                                      ? this.filterRow()
                                      : this.basicFilter()}
                                  </tbody>
                                </table>
                              </div>
                            </GridItem>
                          </GridContainer>
                        </div>
                        <div className="shipment-submit">
                          <div className="right">
                            <Button
                              color="rose"
                              onClick={(event) => this.search(event)}
                            >
                              Search
                            </Button>
                            <Button
                              color="secondary"
                              onClick={() => this.reset()}
                            >
                              Reset
                            </Button>
                          </div>
                        </div>
                        {SearchClicked ? (
                          <div className="wd-full">
                            <ReactTable
                              data={SearchSalesLeadList}
                              minRows={2}
                              defaultSorted={this.state.searchpreviousSortList}
                              defaultFiltered={
                                this.state.searchpreviousFilterList
                              }
                              pageText={`Total rows : ` + searchFinalLength}
                              defaultFilterMethod={
                                CommonConfig.filterCaseInsensitive
                              }
                              getPaginationProps={(e) =>
                                this.searchcheckProps(e)
                              }
                              filterable
                              resizable={false}
                              columns={searchcolumn}
                              defaultPageSize={10}
                              showPaginationBottom={true}
                              className="-striped -highlight"
                            />
                          </div>
                        ) : null}
                      </GridContainer>
                    </GridItem>
                  ) : null}
                </div>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default SalesLeadNavigation;
