import React, { Component } from "react";
import ReactTable from "react-table";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Store from "@material-ui/icons/Store";
import api from "../../utils/apiClient";
import { CommonConfig } from "../../utils/constant";
import cogoToast from "cogo-toast";
import SimpleBackdrop from "../../utils/general";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Checkbox from "@material-ui/core/Checkbox";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //SearchBar List
      Loading: false,
      serviceValue: [],
      filterProps: [],
      previousFilterList: [
        {
          id: "Model_Name",
          value: "",
        },
      ],
      sortProps: [],
      previousSortList: [],
      searchList: [],
      Access: [],
      SearchAccess: [],
      loggedUser: 0,
      finalLength: 0,

      //SearchBar
      UserName: "",
      currentLogin: {},
      checkUserName: false,
      ManagedByList: [],
      ManagedBy: "",
      expand: false,
      finalLength: 0,
      filterProps: [],
      checkdata: "",
      IsDropDownShow: false,
      statusList: [],
      paymentStatus: [
        { label: "All", value: "All",IsSelected: true, Index: 0},
        { label: "Shipment", value: "Shipment", IsSelected: false, Index: 1},
        { label: "Claim", value: "Claim", IsSelected: false, Index: 2},
        { label: "USER", value: "USER", IsSelected: false, Index: 3},
        { label: "CallBack", value: "CallBack", IsSelected: false, Index: 4},
        { label: "SalesLead", value: "SalesLead", IsSelected: false, Index: 5},
        { label: "ContactUs", value: "ContactUs",IsSelected: false, Index: 6},
      ],
    };
  }

  async componentDidMount() {
    this.setState({
      Access: CommonConfig.getUserAccess("Basic Search"),
      loggedUser: CommonConfig.loggedInUserData().PersonID,
      Loading: true,
      SearchAccess: CommonConfig.getUserAccess("Basic Search"),
      checkUserName:
        CommonConfig.getUserAccess("Basic Search").AllAccess === 1
          ? false
          : true,
      currentLogin: {
        value: CommonConfig.loggedInUserData().PersonID,
        label: CommonConfig.loggedInUserData().Name,
      },
    });
    this.searchData();
    let allFilter = [{ label: "All", value: "All" }];
    this.filterMethod("", allFilter);
    this.state.paymentStatus.map((OBJ) => {
      OBJ.IsSelected = true;
      return OBJ;
    });
  }
  componentDidUpdate(prevState, prevProps) {}
  searchData() {
    try {
      let data = {
        searchData: this.props.match.params.id
          ? this.props.match.params.id
          : "",
      };
      data.searchData = data.searchData.trimEnd();
      if (data.searchData !== "") {
        api
          .post("scheduleshipment/SearchAllDB", data)
          .then((result) => {
            this.setState({ searchList: result.data, Loading: false });
          })
          .catch((err) => {
            this.setState({ Loading: false });
            console.log(err);
          });
      }
    } catch (err) {
      this.setState({ Loading: false });
      console.log("error", err);
    }
  }
  filterMethod = (event, value) => {
    this.setState({ statusList: value });
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

  setLength = (len) => {
    this.setState({ finalLength: len });
  };

  checkProps = (e) => {
    if (this.state.finalLength !== e.sortedData.length) {
      this.setLength(e.sortedData.length);
    }
    return "";
  };
  showLoader() {
    this.setState({ Loading: true });
  }

  hideLoader() {
    this.setState({ Loading: false });
  }

  OpenList(record) {
    const { history } = this.props;
    if (
      record.original.Model_Name === "Shipment" &&
      CommonConfig.getUserAccess("Shipment").ReadAccess
    ) {
      if (
        CommonConfig.getUserAccess("Shipment").AllAccess ||
        Number(record.original.ManagedBy) ===
          Number(CommonConfig.loggedInUserData().PersonID)
      ) {
        history.push({
          pathname: "/admin/ShipmentNew",
          state: {
            searchData: this.props.match.params.id
              ? this.props.match.params.id
              : "",
            ShipppingID: record.original.Id,
            shipmentstatusList: [
              { label: "New Request", value: "New Request" },
            ],
            filterlist: [],
            sortlist: [],
          },
        });
      } else {
        cogoToast.error("You don't have access to this record.");
      }
    } else if (
      record.original.Model_Name === "Claim" &&
      CommonConfig.getUserAccess("File a Claim").ReadAccess
    ) {
      let ClaimID = record.original.Id;
      if (
        CommonConfig.getUserAccess("File a Claim").AllAccess ||
        Number(record.original.ManagedBy) ===
          Number(CommonConfig.loggedInUserData().PersonID)
      ) {
        history.push({
          pathname: "/admin/ViewFileAClaim/" + ClaimID,
          state: {
            searchData: this.props.match.params.id
              ? this.props.match.params.id
              : "",
            filterlist: this.state.filterProps,
            statusList: this.state.statusList,
            sortlist: this.state.sortProps,
          },
        });
      } else {
        cogoToast.error("You don't have access to this record.");
      }
    } else if (
      record.original.Model_Name === "USER" &&
      CommonConfig.getUserAccess("User Management").ReadAccess
    ) {
      let UserID = record.original.Id;
      if (
        CommonConfig.getUserAccess("User Management").AllAccess ||
        Number(record.original.ManagedBy) ===
          Number(CommonConfig.loggedInUserData().PersonID)
      ) {
        history.push({
          pathname: "/admin/EditUser",
          state: UserID,
          filterlist: this.state.filterProps,
          sortlist: this.state.sortProps,
          searchData: this.props.match.params.id
            ? this.props.match.params.id
            : "",
        });
      } else {
        cogoToast.error("You don't have access to this record.");
      }
    } else if (
      record.original.Model_Name === "CallBack" &&
      CommonConfig.getUserAccess("Call Back").ReadAccess
    ) {
      let CallBackID = record.original.Id;
      if (
        CommonConfig.getUserAccess("Call Back").AllAccess ||
        Number(record.original.ManagedBy) ===
          Number(CommonConfig.loggedInUserData().PersonID)
      ) {
        history.push({
          pathname: "/admin/EditCallBack/" + CallBackID,
          state: {
            searchData: this.props.match.params.id
              ? this.props.match.params.id
              : "",
            filterlist: this.state.filterProps,
            sortlist: this.state.sortProps,
            statusList: this.state.statusList,
          },
        });
      } else {
        cogoToast.error("You don't have access to this record.");
      }
    } else if (
      record.original.Model_Name === "Online Payment" &&
      CommonConfig.getUserAccess("Online Payment").ReadAccess
    ) {
      let PaymentID = record.original.Id;
      if (
        CommonConfig.getUserAccess("Online Payment").AllAccess ||
        Number(record.original.ManagedBy) ===
          Number(CommonConfig.loggedInUserData().PersonID)
      ) {
        history.push({
          pathname: "/admin/EditOnlinePayment/" + PaymentID,
          state: {
            searchData: this.props.match.params.id
              ? this.props.match.params.id
              : "",
            filterlist: this.state.filterProps,
            statusList: this.state.statusList,
            sortlist: this.state.sortProps,
          },
        });
      } else {
        cogoToast.error("You don't have access to this record.");
      }
    } else if (
      record.original.Model_Name === "SalesLead" &&
      CommonConfig.getUserAccess("Sales Lead").ReadAccess
    ) {
      if (
        CommonConfig.getUserAccess("Sales Lead").AllAccess ||
        Number(record.original.ManagedBy) ===
          Number(CommonConfig.loggedInUserData().PersonID)
      ) {
        var filterlist = this.state.filterProps;
        filterlist[0]["value"] = this.state.defaultfilterValue;
        this.setState({ filterProps: filterlist });
        history.push({
          pathname: "/admin/EditSalesLeads",
          state: {
            id: record.original.Id,
            filterlist: this.state.filterProps,
            statusfilter:
              this.state.defaultfilterValue != undefined
                ? this.state.defaultfilterValue
                : "",
            packageValue:
              this.state.packageValue != undefined
                ? this.state.packageValue
                : [],
            sortlist: this.state.sortProps,
            searchData: this.props.match.params.id
              ? this.props.match.params.id
              : "",
          },
        });
      } else {
        cogoToast.error("You don't have access to this record.");
      }
    } else if (
      record.original.Model_Name === "ContactUs" &&
      CommonConfig.getUserAccess("Contact Us").ReadAccess
    ) {
      let ContactUsID = record.original.Id;
      if (
        CommonConfig.getUserAccess("Contact Us").AllAccess ||
        Number(record.original.ManagedBy) ===
          Number(CommonConfig.loggedInUserData().PersonID)
      ) {
        history.push({
          pathname: "/admin/EditContactUs/" + ContactUsID,
          state: {
            searchData: this.props.match.params.id
              ? this.props.match.params.id
              : "",
            filterlist: this.state.filterProps,
            statusList: this.state.statusList,
            sortlist: this.state.sortProps,
          },
        });
      } else {
        cogoToast.error("You don't have access to this record.");
      }
    } else {
      cogoToast.error("You don't have access to this module.");
    }
  }

  handleCheckboxChange = (e, record, type) => {
    let checkedArr = this.state.paymentStatus;
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
        this.state.checkdata = [{ label: "All", value: "All" }];
      }
      this.setState({
        paymentStatus: checkedArr,
      });
    }
  };

  searchfilter = () => {
    this.setState({ IsDropDownShow: false });
    try {
      let Query = "";
      let inputdata = this.state.checkdata;
      // this.setState({statusList: checkdata});
      this.filterMethod("", inputdata);
      // if (inputdata === "All") {
      //   Query = inputdata;
      // } else if (inputdata === "") {
      //   this.setState({ CallbackData: [] });
      // } else if (inputdata.length === 1) {
      //   Query = ` AND ( c.ClaimStatus  = "` + inputdata[0].value + `")`;
      // } else {
      //   for (var j = 0; j < inputdata.length; j++) {
      //     if (j === 0) {
      //       Query = ` AND ( c.ClaimStatus  = "` + inputdata[j].value + `"`;
      //     } else {
      //       Query =
      //         Query + ` OR c.ClaimStatus  = "` + inputdata[j].value + `"`;
      //     }
      //   }
      //   if (!CommonConfig.isEmpty(Query)) {
      //     Query = Query + `)`;
      //   }
      // }
      // this.getClaimList(Query);
    } catch (err) {
      cogoToast.error("Something went wrong");
    }
  };

  searchrenderInputMethod = (params) => {
    if (params.InputProps.startAdornment) {
      params.InputProps.startAdornment.splice(
        0,
        params.InputProps.startAdornment.length
      );
    }
    return <TextField {...params} label="Module Name" variant="outlined" />;
  };

  optionProps = (option, value) => {
    if (option.value === value.value) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    const { searchList } = this.state;
    const Columns = [
      {
        Header: "Module Name",
        accessor: "Model_Name",
        maxWidth: 100,
        id: "Model_Name",
        Filter: (filter, onChange) => {
          return <input type="text" />;
        },
        sortable: true,
        filterable: true,
        filterMethod: (filter, row) => {
          if (this.state.statusList.length) {
            if (row.Model_Name) {
              for (var i = 0; i < this.state.statusList.length; i++) {
                if (this.state.statusList[i].value === "All") {
                  return row;
                } else if (row.Model_Name === this.state.statusList[i].value) {
                  return row;
                }
              }
            }
          } else {
            return row;
          }
        },
        width: 100,
        maxWidth: 100,
      },
      {
        Header: "Person Name",
        accessor: "Person_Name",
        width: 100,
      },
      {
        Header: "Email",
        accessor: "Email",
        width: 200,
      },
      {
        Header: "Phone",
        accessor: "Phone",
        width: 100,
      },
      {
        Header: "Tracking/Sales Id",
        accessor: "Tracking/Sales Id",
        width: 100,
      },
      {
        Header: "Managed By",
        accessor: "ManagedByName",
        width: 100,
      },
      {
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        filterable: false,
        width: 70,
        Cell: (record) => {
          return (
            <div>
              <Button
                style={{ width: "50px", height: "20px" }}
                color="info"
                onClick={() => this.OpenList(record)}
              >
                Open
              </Button>
            </div>
          );
        },
      },
    ];
    return (
      <div>
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <Store />
                </CardIcon>
                <h4 className="margin-right-auto text-color-black">
                  Search List
                </h4>
                {/* <div className="filter-top-right1">
                  <div className="autocomplete-fs-small">
                    <Autocomplete
                      multiple
                      size="small"
                      getOptionSelected={(option, value) =>
                        this.optionProps(option, value)
                      }
                      // getOptionSelected={(opt, val) => opt.value === val.value}
                      id="filtercheckbox"
                      options={this.state.paymentStatus}
                      getOptionLabel={(option) => option.label}
                      onChange={(e, value) => this.filterMethod(e, value)}
                      style={{ width: "100%" }}
                      renderOption={(option, { selected }) => (
                        <React.Fragment>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.label}
                        </React.Fragment>
                      )}
                      renderInput={(params) =>
                        this.searchrenderInputMethod(params)
                      }
                      value={this.state.statusList}
                    />
                  </div>
                </div> */}
                <div className="filter-wrap">
                <div
                  className="filter-top-right"
                  onMouseLeave={() => this.setState({ IsDropDownShow: false })}
                  onMouseOver={() => this.setState({ IsDropDownShow: true })}
                >
                  <Button className="cm-toggle" color="rose">
                    Module Name <ExpandMoreIcon />
                  </Button>
                  {this.state.IsDropDownShow === true ? (
                    <div className="cm-dropdown">
                      <div className="overflow-handle">
                        {this.state.paymentStatus.map((step, key) => {
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
              </CardHeader>
              <CardBody>
                <ReactTable
                  data={searchList}
                  minRows={2}
                  pageText={"Total rows : " + this.state.finalLength}
                  defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                  getPaginationProps={(e) => this.checkProps(e)}
                  getTheadFilterProps={(e) => this.filterProps(e)}
                  filterable
                  defaultSorted={this.state.previousSortList}
                  defaultFiltered={this.state.previousFilterList}
                  resizable={false}
                  columns={Columns}
                  defaultPageSize={10}
                  showPaginationBottom={true}
                  className="-striped -highlight"
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default SearchBar;
