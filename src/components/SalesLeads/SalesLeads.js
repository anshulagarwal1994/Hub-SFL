import React from "react";
import ReactTable from "react-table";
import HeadsetMic from "@material-ui/icons/HeadsetMic";
import PhoneCallback from "@material-ui/icons/PhoneCallback";
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
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Autocomplete from "@material-ui/lab/Autocomplete";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
};
const classes = makeStyles(styles);

class ReactTables extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ProposalData: [],
      AllAccess: 0,
      loggedUser: 0,
      statusList: [{ value: "New", label: "New" }],
      requestStatus: [
        { label: "All", value: "All" },
        { label: "New", value: "New" },
        { label: "Open", value: "Open" },
        { label: "Closed", value: "Closed" },
        { label: "Cancelled", value: "Cancelled" },
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
      defaultfilterValue: "New",
      expand: false,
      finalLength: 0,
      filterProps: [],
      previousFilterList: [],
      sortProps: [],
      previousSortList: [],
      packageValue: [],
    };
  }

  componentDidMount() {
    this.setState({
      AllAccess: CommonConfig.getUserAccess("Sales Lead").AllAccess,
      searchAllAccess: CommonConfig.getUserAccess("Search Sales Lead"),
      loggedUser: CommonConfig.loggedInUserData().PersonID,
      filtered: [this.state.filter],
    });
    if (localStorage.getItem("SearchParams")) {
      var params = JSON.parse(localStorage.getItem("SearchParams"));
      this.getProposalData(params);
    } else {
      this.getProposalData();
    }
    this.getStringMap();
    this.getFilterlist();
    this.getCountry();
    this.managedby();

    if (
      this.props.history.location.state !== undefined &&
      this.props.history.location.state !== null
    ) {
      this.setState({
        previousFilterList: this.props.history.location.state.filterlist,
        defaultfilterValue: this.props.history.location.state.statusfilter,
        packageValue:
          this.props.history.location.state.packageValue !== undefined
            ? this.props.history.location.state.packageValue
            : this.state.packageValue,
        previousSortList: this.props.history.location.state.sortlist,
      });
    } else {
      var finalStatus = [
        {
          id: "ProposalStatus",
          value: "New",
        },
        {
          id: "Packages",
          value: "",
        },
      ];
      var finalSort = {
        id: "SalesLeadDate",
        desc: true,
      };

      this.setState({
        previousFilterList: finalStatus,
        defaultfilterValue: "New",
        previousSortList: [finalSort],
      });
    }
  }

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
  }

  handleEdit = (record) => {
    var filterlist = this.state.filterProps;
    filterlist[0]["value"] = this.state.defaultfilterValue;
    this.setState({ filterProps: filterlist });
    this.props.history.push({
      pathname: "/admin/EditSalesLeads",
      state: {
        id: record.original.SalesLeadManagementID,
        filterlist: this.state.filterProps,
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
    filterlist[idx][type] = moment(date).format();
    this.setState({ filtered: filterlist });
  };

  fieldSelect = () => {
    return this.state.selectField
      .filter((x) => x.label !== "Content Type")
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

        if (finalFilterList[i]["field"] === "SalesLeadDate") {
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
              filterList[i]["columnname"] === "SalesLeadDate" &&
              (filterList[i]["condition"] === "Start With" ||
                filterList[i]["condition"] === "Ends With")
            )
          ) {
            if (filterList[i]["condition"] === "Start With") {
              if (i === 0) {
                FinalStr =
                  FinalStr +
                  filterList[i]["columnname"] +
                  " " +
                  filterList[i]["conditionoperator"] +
                  " '" +
                  filterList[i]["value"] +
                  "%'";
              } else {
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
            } else if (filterList[i]["condition"] === "Ends With") {
              if (i === 0) {
                FinalStr =
                  FinalStr +
                  filterList[i]["columnname"] +
                  " " +
                  filterList[i]["conditionoperator"] +
                  " '" +
                  "%" +
                  filterList[i]["value"] +
                  "'";
              } else {
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
            } else if (filterList[i]["condition"] === "Contains") {
              if (i === 0) {
                FinalStr =
                  FinalStr +
                  filterList[i]["columnname"] +
                  " " +
                  filterList[i]["conditionoperator"] +
                  " '%" +
                  filterList[i]["value"] +
                  "%'";
              } else {
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
            } else {
              if (i === 0) {
                FinalStr =
                  FinalStr +
                  filterList[i]["columnname"] +
                  " " +
                  filterList[i]["conditionoperator"] +
                  " '" +
                  filterList[i]["value"] +
                  "'";
              } else {
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
          } else {
            if (filterList[i]["condition"] === "Start With") {
              filterList[i]["conditionoperator"] = ">=";
            }

            if (filterList[i]["condition"] === "Ends With") {
              filterList[i]["conditionoperator"] = "<=";
            }

            if (i === 0) {
              FinalStr =
                FinalStr +
                filterList[i]["columnname"] +
                " " +
                filterList[i]["conditionoperator"] +
                " '" +
                filterList[i]["value"] +
                "'";
            } else {
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

        this.setState({ defaultfilterValue: "All", isEdit: false });

        if (CommonConfig.getUserAccess("Sales Lead").AllAccess === 1) {
          this.setState({ isEdit: 1 });
        }

        if (CommonConfig.getUserAccess("Sales Lead").AllAccess === 0) {
          this.setState({ AllAccess: 1 });
        }
        localStorage.setItem("SearchParams", JSON.stringify(FinalStr));
        this.getProposalData(FinalStr);
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
      defaultfilterValue: "New",
      isEdit: true,
    });

    if (CommonConfig.getUserAccess("Sales Lead").AllAccess === 0) {
      this.setState({ AllAccess: 0 });
    }
    this.getProposalData();
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
            <FormControl
              fullWidth
              error={selectfield.fielderror}
              className="input-select-outer"
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
                {this.fieldSelect()}
              </Select>
              <FormHelperText>{selectfield.fieldhelperText}</FormHelperText>
            </FormControl>
          </td>
          <td>
            <FormControl
              fullWidth
              error={selectfield.filtererror}
              className="input-select-outer"
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
              ) : selectfield.field === "SalesLeadDate" ? (
                <div className="dt-vs">
                  <FormControl fullWidth>
                    <Datetime
                      dateFormat={"MM/DD/YYYY"}
                      timeFormat={false}
                      selected={moment(this.state.StartDate)}
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
                {this.fieldBasic()}
              </Select>
              <FormHelperText>{selectfield.fieldhelperText}</FormHelperText>
            </FormControl>
          </td>
          <td>
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

  filterMethod = (e) => {
    this.setState({ defaultfilterValue: e.target.value });
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

  // filterMethod = (event,value) => {
  //   this.setState({statusList: value});
  // }

  render() {
    const column = [
      {
        Header: "Date",
        id: "SalesLeadDate",
        maxWidth: 85,
        width: 85,
        filterable: true,
        sortable: true,
        accessor: (data) => {
          if (CommonConfig.isEmpty(data.SalesLeadDate)) {
            return moment().format("MM/DD/YYYY");
          } else {
            return moment(data.SalesLeadDate).format(
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
        maxWidth: 70,
        filterable: true,
        filterMethod: (filter, row) => {
          if (this.state.defaultfilterValue === "All") {
            return row;
          } else {
            return row["ProposalStatus"] === this.state.defaultfilterValue;
          }
        },
        Filter: () => {
          return (
            <div className="with-normal-filter">
              <select
                onChange={(e) => this.filterMethod(e)}
                value={this.state.defaultfilterValue}
              >
                {this.state.requestStatus.map((status, i) => {
                  return <option value={status.value}>{status.label}</option>;
                })}
              </select>
            </div>
          );
        },
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
    const { ProposalData, searchAllAccess } = this.state;
    return (
      <GridContainer className="UserList-outer">
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
        <GridItem xs={12}>
          <Card>
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <PhoneCallback />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">Sales Lead</h4>
            </CardHeader>
            <CardBody>
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
            </CardBody>
          </Card>
          {searchAllAccess.ReadAccess === 1 ||
          searchAllAccess.AllAccess === 1 ? (
            <Card className="pb-15">
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <HeadsetMic />
                </CardIcon>
                <h4 className="margin-right-auto text-color-black">
                  Search Leads
                </h4>
                <button className="expand-icon" onClick={(e) => this.toggle(e)}>
                  <ExpandMoreIcon />
                </button>
              </CardHeader>

              <div style={{ display: this.state.expand ? "block" : "none" }}>
                <CardBody>
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
                </CardBody>
              </div>
              <div className="shipment-submit mt-10">
                <div className="right">
                  <Button color="rose" onClick={(event) => this.search(event)}>
                    Search
                  </Button>
                  <Button color="secondary" onClick={() => this.reset()}>
                    Reset
                  </Button>
                </div>
              </div>
            </Card>
          ) : null}
        </GridItem>
      </GridContainer>
    );
  }
}
export default ReactTables;
