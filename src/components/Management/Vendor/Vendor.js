import React, { Component } from "react";
import ReactTable from "react-table";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Store from "@material-ui/icons/Store";
import api from "../../../utils/apiClient";
import { CommonConfig } from "../../../utils/constant";
import cogoToast from "cogo-toast";
import SimpleBackdrop from "../../../utils/general";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Checkbox from "@material-ui/core/Checkbox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

class Vendor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Loading: false,
      servicelist: [],
      // checkdata:[],
      checkdata: "",
      IsDropDownShow: false,
      serviceValue: [],
      filterProps: [],
      previousFilterList: [],
      sortProps: [],
      previousSortList: [],
      vendorList: [],
      Access: [],
      finalLength: 0,
    };
  }
  serviceOffered = () => {
    let data = {
      stringMapType: "SERVICEOFFERED",
    };

    api.post("stringMap/getstringMap", data).then((result) => {
      if (result.success) {
        const seriveList = result.data.map((type) => {
          return { value: type.Description, label: type.Description };
        });
        var i = 0;
        seriveList.map((OBJ) => {
          OBJ.IsSelected = false;
          OBJ.Index = i;
          i++;
          return OBJ;
        });
        for(let i =0; i < seriveList.length ; i++){
          seriveList[i].Index = i+1;
          console.log("Test = ",seriveList[i].Index);
        }
        var data = 
        {
          value: "All",
          label: "All",
          IsSelected: false,
          Index: 0,
        }
        seriveList.push(data)
        seriveList.sort((a,b) => a.Index - b.Index);

        console.log("ServiceList = ",seriveList);
        this.setState({ servicelist: seriveList });
      }
    });
  };

  addVendor = () => {
    this.props.history.push("/admin/AddEditVendor");
  };

  showLoader() {
    this.setState({ Loading: true });
  }

  hideLoader() {
    this.setState({ Loading: false });
  }

  MapVendor = () => {
    this.props.history.push({
      pathname: "/admin/MapVendor",
      state: {
        serviceValue: this.state.serviceValue,
        servicelist: this.state.servicelist,
        vendorList: this.state.vendorList,
        filterlist: this.state.filterProps,
        sortlist: this.state.sortProps,
      },
    });
  };

  componentDidMount() {
    this.setState({ Access: CommonConfig.getUserAccess("Vendor Management") });
    this.serviceOffered();
    this.getVendorList();
    if (
      this.props.history.location.state !== undefined &&
      this.props.history.location.state !== null
    ) {
      this.setState({
        previousFilterList: this.props.history.location.state.filterlist,
        previousSortList: this.props.history.location.state.sortlist,
        serviceValue:
          this.props.history.location.state.serviceValue !== undefined
            ? this.props.history.location.state.serviceValue
            : this.state.serviceValue,
      });
    } else {
      var finalStatus = {
        id: "services",
        value: "Auto Transport",
      };
      this.setState({ previousFilterList: [finalStatus] });
    }
  }
  getVendorList() {
    try {
      this.showLoader();
      api.get("vendor/getVendorList").then((res) => {
        if (res.success) {
          if (this.state.Access.AllAccess === 1) {
            this.setState({ vendorList: res.data, Loading: false });
          } else {
            var FinalVendorList = [];
            FinalVendorList = res.data.filter(
              (x) => x.PersonID === CommonConfig.loggedInUserData().PersonID
            );
            this.setState({ vendorList: FinalVendorList, Loading: false });
          }
        } else {
          cogoToast.error("Something Went Wrong");
        }
      })
        .catch((err) => {
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) { }
  }

  editVendor = (record) => {
    const { history } = this.props;
    let vendorId = record.original.VendorID;
    history.push({
      pathname: "AddEditVendor/",
      state: {
        vendorId: vendorId,
        filterlist: this.state.filterProps,
        sortlist: this.state.sortProps,
        serviceValue: this.state.serviceValue,
      },
    });
  };

  
  handleCheckboxChange = (e, record, type) => {
    debugger;
    let checkedArr = this.state.servicelist;
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
      this.setState({ serviceValue: previousList });
      let arrType = "previousSelected" + this.state.chatlist;
     
      this.filterMethod("Hello",previousList)
      
    } else{
      // else {
        this.setState({ shipmentquery: "" });
        checkedArr.map((OBJ) => {
          OBJ.IsSelected = e.target.checked;
          return OBJ;
        });
        this.state.shipmentquery = this.state.StatusQuery;
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
          StatusList: checkedArr,
          [arrType]: previousList,
          StatusQuery: this.state.shipmentquery,
        });
  
        this.filterMethod("Hello",previousList)
      // }
    }
    // console.log("checkedArr = ",checkdata);
  };



  filterMethod = (event, value) => {
    console.log("value= ", value);
    this.setState({ serviceValue: value });
    console.log("serviceValue = ",this.state.serviceValue);
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
    if (params.InputProps.startAdornment) {
      params.InputProps.startAdornment.splice(
        0,
        params.InputProps.startAdornment.length
      );
    }
    return <TextField {...params} variant="outlined" label="Services" />;
  };

  renderOption = (option) => {
    let selectedValue =
      this.state.serviceValue.findIndex((x) => x.value === option.value) !== -1
        ? true
        : false;
    return (
      <React.Fragment>
        <Checkbox
          icon={icon}
          checkedIcon={checkedIcon}
          style={{ marginRight: 8 }}
          checked={selectedValue}
        />
        {option.label}
      </React.Fragment>
    );
  };

  optionProps = (option, value) => {
    if (option.value === value.value) {
      return true;
    } else {
      return false;
    }
  };
  activeInactiveVendor = (record, Type) => {
    let data = {
      VendorID: record.original.VendorID,
      Status: Type,
      UserID: CommonConfig.loggedInUserData().PersonID,
    };

    try {
      api
        .post("vendor/activeInactiveVendor", data)
        .then((res) => {
          if (res.success) {
            this.getVendorList();
          } else {
            cogoToast.error("Something Went Wrong");
          }
        })
        .catch((err) => {
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) { }
  };

  render() {
    const { vendorList, servicelist } = this.state;

    const columns = [
      {
        Header: "Name",
        accessor: "Name",
        maxWidth: 160,
      },
      {
        Header: "VendorType",
        accessor: "VendorType",
        width: 100,
      },
      {
        Header: "Services",
        accessor: "services",
        width: 250,
        id: "services",
        Cell: (record) => {
          if (Object.values(record.value).length) {
            return record.value.map((content, index) => {
              return record.value[record.value.length - 1]["serviceName"] ===
                content.serviceName ? (
                <span>{content.serviceName}</span>
              ) : (
                <span>{content.serviceName} | </span>
              );
            });
          } else {
            return null;
          }
        },
        Filter: ({ filter, onChange }) => {
          return <input type="text" />;
        },
        filterable: true,
        filterMethod: (filter, row) => {
          if (this.state.serviceValue.length) {
            if (row.services.length) {
              for (var i = 0; i < this.state.serviceValue.length; i++) {
                for (var j = 0; j < row.services.length; j++) {
                  if (
                    row.services[j]["serviceName"] ===
                    this.state.serviceValue[i].value
                  ) {
                    return row;
                  }
                }
              }
            }
          } else {
            return row;
          }
        },
      },
      {
        Header: "CreatedBy",
        accessor: "CreatedBy",
        width: 100,
      },
      {
        Header: "Status",
        Cell: (record) => {
          if (record.original.Status === "Active") {
            return (
              <Button
                color="success"
                className="table-btn"
                onClick={() => this.activeInactiveVendor(record, "Inactive")}
              >
                Active
              </Button>
            );
          } else {
            return (
              <Button
                color="danger"
                className="table-btn"
                onClick={() => this.activeInactiveVendor(record, "Active")}
              >
                Inactive
              </Button>
            );
          }
        },
        accessor: "Status",
        id: "status",
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
            <div className="table-common-btn">
              <Button
                justIcon
                color="info"
                onClick={() => this.editVendor(record)}
              >
                <i className="fas fa-edit"></i>
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
        <GridContainer className="UserList-outer">
          <GridItem xs={12}>
            <Card>
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <Store />
                </CardIcon>
                <h4 className="margin-right-auto text-color-black">
                  Vendor List
                </h4>

                {/* <div className="filter-top-right-slam">
                  <div className="autocomplete-fs-small">
                    <Autocomplete
                      multiple
                      size="small"
                      id="filtercheckbox"
                      options={servicelist}
                      getOptionLabel={(option) => option.label}
                      getOptionSelected={(option, value) =>
                        this.optionProps(option, value)
                      }
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
                      renderInput={(params) => this.renderInputMethod(params)}
                      value={this.state.serviceValue}
                    />
                  </div>
                  
                </div> */}
                <div class="vendor-top-buttons">
                  <div class="add-vendor-btn">
                    {this.state.Access.WriteAccess === 1 ? (
                      <Button
                        color="primary"
                        className=""
                        onClick={() => this.addVendor()}
                      >
                        Add Vendor
                      </Button>
                    ) : null}

                    {
                      <Button
                        color="primary"
                        className=""
                        onClick={() => this.MapVendor()}
                      >
                        Map View
                      </Button>
                    }
                  </div>

                  <div
                    className="filter-top-right"
                    onMouseLeave={() =>
                      this.setState({ IsDropDownShow: false })
                    }
                    onMouseOver={() => this.setState({ IsDropDownShow: true })}
                  >
                    <Button
                      className="cm-toggle"
                      color="rose"
                    // onClick={() =>
                    //   this.setState({
                    //     IsDropDownShow:
                    //       this.state.IsDropDownShow === true ? false : true,
                    //   })
                    // }
                    >
                     Services <ExpandMoreIcon />
                    </Button>
                    {this.state.IsDropDownShow === true ? (
                      <div className="cm-dropdown" ref={this.state.ref}>
                        <div className="overflow-handle">
                          {this.state.servicelist.map((step, key) => {
                            return (
                              <li>
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={step.IsSelected}
                                    onChange={(e, value) => this.handleCheckboxChange(
                                      e,
                                      step,
                                      step.value
                                    
                                    )}
                                    value={this.state.serviceValue}
                                  />{" "}
                                  {step.value}
                                </label>
                              </li>
                            );
                          })}
                        </div>
                        <div className="cms-wrap">
                          {/* <Button
                            className="cm-search-btn"
                            color="rose"
                          // onClick={() => this.showSearchFilter("Shipment")}
                          >
                            Search
                          </Button> */}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

              </CardHeader>
              <CardBody>
                <ReactTable
                  data={vendorList}
                  minRows={2}
                  pageText={"Total rows : " + this.state.finalLength}
                  defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                  getPaginationProps={(e) => this.checkProps(e)}
                  getTheadFilterProps={(e) => this.filterProps(e)}
                  filterable
                  defaultSorted={this.state.previousSortList}
                  defaultFiltered={this.state.previousFilterList}
                  resizable={false}
                  columns={columns}
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

export default Vendor;
