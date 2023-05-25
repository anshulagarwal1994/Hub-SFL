import React, { Component } from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";
// @material-ui/icons
import PhoneCallback from "@material-ui/icons/PhoneCallback";
// core components
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import { CommonConfig } from "../../utils/constant";
import api from "../../utils/apiClient";
import SimpleBackdrop from "../../utils/general";
import moment from "moment";
import cogoToast from "cogo-toast";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Checkbox from "@material-ui/core/Checkbox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

class CallBack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CallbackData: [],
      checkdata: "",
      AllAccess: 0,
      Loading: false,
      loggedUser: 0,
      finalLength: 0,
      statusList: [],
      filterProps: [],
      previousFilterList: [],
      sortProps: [],
      previousSortList: [],
      requestStatus: [
        { label: "All", value: "All", IsSelected: false, Index: 0 },
        { label: "New", value: "New", IsSelected: true, Index: 1 },
        { label: "Open", value: "Open", IsSelected: false, Index: 2 },
        { label: "Closed", value: "Closed", IsSelected: false, Index: 3 },
        { label: "Cancelled", value: "Cancelled", IsSelected: false, Index: 4 },
      ],
    };
  }
  componentDidMount() {
    this.setState({
      AllAccess: CommonConfig.getUserAccess("Call Back").AllAccess,
    });
    this.setState({ loggedUser: CommonConfig.loggedInUserData().PersonID });
    let APIcheck = true;
    if (
      this.props.history.location.state !== undefined &&
      this.props.history.location.state !== null
    ) {
      this.setState({
        previousFilterList: this.props.history.location.state.filterlist,
        previousSortList: this.props.history.location.state.sortlist,
        statusList:
          this.props.history.location.state.statusList !== undefined
            ? this.props.history.location.state.statusList
            : this.state.statusList,
      });

      if (this.props.history.location.state.statusList !== undefined) {
        APIcheck = false;
        this.filterMethod("", this.props.history.location.state.statusList);
      }
    } else {
      var finalStatus = {
        id: "RequestStatus",
        value: "",
      };
      var finalSort = {
        id: "CreatedOn",
        desc: true,
      };
      this.setState({
        previousFilterList: [finalStatus],
        previousSortList: [finalSort],
      });
    }
    if (APIcheck) {
      let newFilter = [{ label: "New", value: "New" }];
      this.filterMethod("", newFilter);
    }
  }

  showLoador = () => {
    this.setState({ Loading: true });
  };

  hideLoador = () => {
    this.setState({ Loading: false });
  };
  handleCheckboxChange = (e, record, type) => {
    debugger;
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
      debugger;
      let Query = "";
      let inputdata = this.state.checkdata;
      if (inputdata === "All") {
        Query = inputdata;
      } else if (inputdata === "") {
        this.setState({ CallbackData: [] });
      } else if (inputdata.length === 1) {
        Query = ` AND ( c.RequestStatus  = "` + inputdata[0].value + `")`;
      } else {
        for (var j = 0; j < inputdata.length; j++) {
          if (j === 0) {
            Query = ` AND ( c.RequestStatus  = "` + inputdata[j].value + `"`;
          } else {
            Query =
              Query + ` OR c.RequestStatus  = "` + inputdata[j].value + `"`;
          }
        }
        if (!CommonConfig.isEmpty(Query)) {
          Query = Query + `)`;
        }
      }
      console.log("query: ", Query);
      //  this.getProposalData(Query);
      this.getCallbackData(Query);
    } catch (err) {
      cogoToast.error("Something went wrong 3");
    }
  };
  getCallbackData(whereClause) {
    if (whereClause !== "") {
      debugger;
      console.log("whereclause", whereClause);
      let data = {};
      if (!CommonConfig.isEmpty(whereClause)) {
        data.StatusQuery = whereClause;
      }
      try {
        this.showLoador();
        api
          .post("callback/getCallBackList", data)
          .then((result) => {
            debugger;
            if (result.data.success) {
              this.hideLoador();
              if (this.state.AllAccess === 1) {
                this.setState({ CallbackData: result.data.data });
              } else {
                let finalData = result.data.data.filter(
                  (x) => x.WorkingOnRequest === this.state.loggedUser
                );
                this.setState({ CallbackData: finalData });
              }
            } else {
              this.hideLoador();
              cogoToast.error("Something went wrong1");
            }
          })
          .catch((err) => {
            this.hideLoador();
            cogoToast.error("Something went wrong2");
          });
      } catch (err) {
        this.hideLoador();
        cogoToast.error("Something Went Wrong3");
      }
    } else {
      this.setState({ CallbackData: [] });
    }
  }

  handleEdit(record) {
    let CallBackID = record.original.CallBackID;
    this.props.history.push({
      pathname: "EditCallBack/" + CallBackID,
      state: {
        filterlist: this.state.filterProps,
        sortlist: this.state.sortProps,
        statusList: this.state.statusList,
      },
    });
  }

  filterMethod = (event, value) => {
    //let value = this.state.checkdata;
    debugger;
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
                StatusQuery =
                  ` AND ( c.RequestStatus = "` + value[j].value + `")`;
              } else {
                StatusQuery =
                  ` AND ( c.RequestStatus = "` + value[j].value + `"`;
              }
            } else if (j + 1 === value.length) {
              StatusQuery = ` OR c.RequestStatus = "` + value[j].value + `")`;
            } else {
              StatusQuery = ` OR c.RequestStatus = "` + value[j].value + `"`;
            }
            query = query + StatusQuery;
          }
        } else {
          value = [{ label: "All", value: "All" }];
        }
        this.getCallbackData(query);
      } else {
        this.setState({ CallbackData: [] });
      }
      this.setState({ statusList: value });
    }
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

  renderInputMethod = (params) => {
    // if(params.InputProps.startAdornment)
    // {
    //   params.InputProps.startAdornment.splice(0,params.InputProps.startAdornment.length)
    // }
    return <TextField {...params} variant="outlined" label="Status" />;
  };

  optionProps = (option, value) => {
    if (option.value === value.value) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    const { CallbackData } = this.state;
    const column = [
      {
        Header: "Name",
        accessor: "CustomerName",
        width: 100,
        filterable: true,
        sortable: true,
        maxWidth: 150,
      },
      {
        Header: "Phone",
        accessor: "PhoneNum",
        filterable: true,
        sortable: true,
        width: 100,
        maxWidth: 150,
      },
      {
        Header: "Time to Call",
        accessor: "TimeToCall",
        filterable: true,
        sortable: true,
        width: 200,
        maxWidth: 450,
      },
      {
        Header: "Status",
        id: "RequestStatus",
        accessor: "RequestStatus",
        sortable: true,
        filterable: true,
        width: 150,
        maxWidth: 250,
      },
      {
        Header: "Managed By",
        accessor: "Name",
        filterable: true,
        sortable: true,
        width: 150,
        maxWidth: 250,
      },
      {
        id: "CreatedOn",
        Header: "Created On",
        filterable: true,
        sortMethod: (a, b) => {
          return CommonConfig.dateSortMethod(a, b);
        },
        sortable: true,
        accessor: (data) => {
          return moment(data.CreatedOn).format(
            CommonConfig.dateFormat.dateOnly
          );
        },
        width: 150,
        maxWidth: 200,
      },
      {
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        width: 100,
        maxWidth: 150,
        Cell: (record) => {
          return (
            <div className="table-common-btn">
              <Button
                justIcon
                color="info"
                onClick={() => this.handleEdit(record)}
              >
                <i className="fas fa-edit"></i>
              </Button>
            </div>
          );
        },
        filterable: false,
      },
    ];
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
              <h4 className="margin-right-auto text-color-black">Call Back</h4>

              {/* <div className="filter-top-right">
                <div className="autocomplete-fs-small">
                  <Autocomplete
                    multiple
                    size="small"
                    id="filtercheckbox"
                    options={this.state.requestStatus}
                    getOptionLabel={(option) => option.label}
                    onChange={(e, value) => this.filterMethod(e, value)}
                    getOptionSelected={(option, value) =>
                      this.optionProps(option, value)
                    }
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
                    renderInput={(params) => this.renderInputMethod(params)}
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
                    Call Back Status <ExpandMoreIcon />
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
            </CardHeader>
            <CardBody>
              <ReactTable
                data={CallbackData}
                defaultPageSize={10}
                minRows={2}
                defaultSorted={this.state.previousSortList}
                defaultFiltered={this.state.previousFilterList}
                resizable={false}
                columns={column}
                getTheadFilterProps={(e) => this.filterProps(e)}
                pageText={"Total rows : " + this.state.finalLength}
                getPaginationProps={(e) => this.checkProps(e)}
                defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                showPaginationBottom={true}
                className="-striped -highlight"
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}
export default CallBack;
