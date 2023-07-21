import React, { Component } from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";
// @material-ui/icons
import HeadsetMic from "@material-ui/icons/HeadsetMic";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import SimpleBackdrop from "../../utils/general";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import api from "../../utils/apiClient";
import moment from "moment";
import momentTimezone from "moment-timezone";
import { CommonConfig } from "../../utils/constant";
import cogoToast from "cogo-toast";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Checkbox from "@material-ui/core/Checkbox";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

class OnlinePayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PaymentData: [],
      AllAccess: 0,
      loggedUser: 0,
      finalLength: 0,
      filterProps: [],
      previousFilterList: [],
      sortProps: [],
      previousSortList: [],
      statusList: [],
      paymentStatus: [
        { label: "All", value: "All", IsSelected: false, Index: 0 },
        { label: "New", value: "New", IsSelected: true, Index: 1 },
        { label: "Open", value: "Open", IsSelected: false, Index: 2 },
        { label: "Closed", value: "Closed", IsSelected: false, Index: 3 },
        { label: "Cancelled", value: "Cancelled", IsSelected: false, Index: 4 },
      ],
    };
  }

  showLoador = () => {
    this.setState({ Loading: true });
  };

  hideLoador = () => {
    this.setState({ Loading: false });
  };

  componentDidMount() {
    this.setState({
      AllAccess: CommonConfig.getUserAccess("Online Payment").AllAccess,
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
        id: "PaymentStatus",
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

  getPaymentData = (whereClause) => {
    debugger;
    console.log("whereclouse", whereClause);
    if (whereClause !== "") {
      let data = {};
      if (!CommonConfig.isEmpty(whereClause)) {
        data.StatusQuery = whereClause;
      }
      try {
        this.showLoador();
        api
          .post("payment/getPaymentList", data)
          .then((result) => {
            console.log("list...", result);
            if (result.success) {
              this.hideLoador();
              if (this.state.AllAccess === 1) {
                this.setState({ PaymentData: result.data });
              } else {
              }
            } else {
              this.hideLoador();
              cogoToast.error("Something went wrong");
            }
          })
          .catch((err) => {
            this.hideLoador();
            cogoToast.error("Something went wrong");
          });
      } catch (err) {
        this.hideLoador();
        cogoToast.error("Something Went Wrong");
      }
    } else {
      this.setState({ PaymentData: [] });
    }
  };

  handleEdit(record) {
    let PaymentID = record.original.PaymentID;
    this.props.history.push({
      pathname: "EditOnlinePayment/" + PaymentID,
      state: {
        filterlist: this.state.filterProps,
        statusList: this.state.statusList,
        sortlist: this.state.sortProps,
      },
    });
  }
  handleCheckboxChange = (e, record, type) => {
    debugger;
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
        this.state.checkdata = `All`;
      }
      this.setState({
        paymentStatus: checkedArr,
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
        this.setState({ PaymentData: [] });
      } else if (inputdata.length === 1) {
        Query = ` AND ( p.PaymentStatus  = "` + inputdata[0].value + `")`;
      } else {
        for (var j = 0; j < inputdata.length; j++) {
          if (j === 0) {
            Query = ` AND ( p.PaymentStatus  = "` + inputdata[j].value + `"`;
          } else {
            Query =
              Query + ` OR p.PaymentStatus  = "` + inputdata[j].value + `"`;
          }
        }
        if (!CommonConfig.isEmpty(Query)) {
          Query = Query + `)`;
        }
      }
      console.log("query: ", Query);
      //  this.getProposalData(Query);
      this.getPaymentData(Query);
    } catch (err) {
      cogoToast.error("Something went wrong 3");
    }
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
                StatusQuery =
                  ` AND ( p.PaymentStatus = "` + value[j].value + `")`;
              } else {
                StatusQuery =
                  ` AND ( p.PaymentStatus = "` + value[j].value + `"`;
              }
            } else if (j + 1 === value.length) {
              StatusQuery = ` OR p.PaymentStatus = "` + value[j].value + `")`;
            } else {
              StatusQuery = ` OR p.PaymentStatus = "` + value[j].value + `"`;
            }
            query = query + StatusQuery;
          }
        } else {
          value = [{ label: "All", value: "All" }];
        }
        this.getPaymentData(query);
      } else {
        this.setState({ PaymentData: [] });
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
    const { PaymentData } = this.state;
    const column = [
      {
        Header: "Name",
        accessor: "ContactName",
        width: 120,
        maxWidth: 120,
      },
      {
        Header: "Phone",
        accessor: "PhoneNum",
        width: 120,
        maxWidth: 120,
      },
      {
        Header: "Tracking",
        accessor: "TrackingNumber",
        width: 100,
        maxWidth: 100,
      },
      {
        Header: "Status",
        accessor: "PaymentStatus",
        sortable: true,
        width: 160,
        maxWidth: 160,
      },
      {
        Header: "Type",
        accessor: "PaymentType",
        width: 120,
        maxWidth: 120,
      },
      {
        Header: "Amount",
        id: "Amount",
        accessor: (data) => {
          return "$ " + Number(data.InvoiceAmount).toFixed(2);
        },
        width: 120,
        maxWidth: 120,
      },
      {
        id: "CreatedOn",
        sortMethod: (a, b) => {
          return CommonConfig.dateSortMethod(a, b);
        },
        Header: "Created On",
        accessor: (data) => {
          return momentTimezone(data.CreatedOn)
            .tz(CommonConfig.UStimezone)
            .format(CommonConfig.dateFormat.dateOnly);
        },
        width: 120,
        maxWidth: 120,
      },
      {
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        Cell: (record) => {
          return (
            <div className="table-common-btn align-right">
              <Button
                justIcon
                color="info"
                onClick={() => this.handleEdit(record)}
              >
                <i class="fas fa-edit"></i>
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
                <HeadsetMic />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">
                Online Payment Request
              </h4>

              {/* <div className="filter-top-right">
                              
                                <div className="autocomplete-fs-small">
                                  <Autocomplete 
                                  multiple
                                  size="small"
                                  id="filtercheckbox"
                                  options={this.state.paymentStatus}
                                  getOptionSelected = {(option,value) => this.optionProps(option,value)}
                                  getOptionLabel={(option) => option.label}
                                  onChange ={(e,value) => this.filterMethod(e,value)}
                                  style={{width: "100%"}}
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
                    Online payment Status <ExpandMoreIcon />
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
                data={PaymentData}
                filterable
                defaultSorted={this.state.previousSortList}
                defaultFiltered={this.state.previousFilterList}
                getTheadFilterProps={(e) => this.filterProps(e)}
                minRows={2}
                defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                resizable={false}
                columns={column}
                defaultPageSize={10}
                pageText={"Total rows : " + this.state.finalLength}
                getPaginationProps={(e) => this.checkProps(e)}
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
export default OnlinePayment;
