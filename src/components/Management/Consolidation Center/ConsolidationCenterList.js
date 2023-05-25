import React, { Component } from "react";
import SimpleBackdrop from "../../../utils/general";
import ReactTable from "react-table";
import api from "../../../utils/apiClient";
import { CommonConfig } from "../../../utils/constant";
import moment from "moment";
import cogoToast from "cogo-toast";
import UserList from "@material-ui/icons/People";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";

class ConsolidationCenterList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Loading: false,
      centerList: [],
      filterProps: [],
      sortProps: [],
      previousFilterList: [],
      previousSortList: [],
    };
  }

  componentDidMount() {
    this.getCenterList();
    if (
      this.props.history.location.state !== undefined &&
      this.props.history.location.state !== null
    ) {
      this.setState({
        previousFilterList: this.props.history.location.state.filterlist,
        previousSortList: this.props.history.location.state.sortlist,
      });
    } else {
      var defaultSort = {
        id: "CreatedOn",
        desc: true,
      };
      this.setState({ previousSortList: [defaultSort] });
    }
  }

  getCenterList() {
    try {
      this.setState({ Loading: true });
      api.get("userManagement/getConsolidationCentreList").then((res) => {
          if (res.success) {
            this.setState({ centerList: res.data, Loading: false });
          } else {
            cogoToast.error("Something Went Wrong");
          }
        })
        .catch((err) => {
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {}
  }

  addUser = () => {
    this.props.history.push("AddConsolidationCenter/");
  };

  addMarkup = () => {
    this.props.history.push("AddUpdateMarkupRate/");
  };
  activeInactiveUser = (record) => {
    let data = {
      CenterID: record.original.ID,
      status: record.original.Status === "Active" ? "Inactive" : "Active",
    };

    try {
      this.setState({ Loading: true });
      api.post("userManagement/activeInactiveCenter", data).then((res) => {
          if (res.success) {
            this.getCenterList();
          } else {
            cogoToast.error("Something Went Wrong");
          }
        })
        .catch((err) => {
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {}
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

  editUser = (record) => {
    const { history } = this.props;
    let CenterID = record.original.ID;
    history.push({
      pathname: "AddConsolidationCenter",
      state: CenterID,
      filterlist: this.state.filterProps,
      sortlist: this.state.sortProps,
    });
  };

  render() {
    const { centerList } = this.state;

    const columns = [
      {
        Header: "Center Name",
        accessor: "CenterName",
        maxWidth: 100,
      },
      {
        Header: "Company Name",
        accessor: "CompanyName",
        maxWidth: 120,
      },
      {
        Header: "Mobile",
        accessor: "Phone1",
        width: 100,
      },
      {
        Header: "Address",
        accessor: "FullAddress",
        width: 120,
      },
      {
        Header: "City",
        accessor: "City",
        width: 100,
      },
      {
        Header: "Zip Code",
        accessor: "ZipCode",
        width: 100,
      },
      {
        id: "CreatedOn",
        Header: "Created On",
        width: 100,
        sortMethod: (a, b) => {
          return CommonConfig.dateSortMethod(a, b);
        },
        accessor: (data) => {
          return moment(data.CreatedOn).format(
            CommonConfig.dateFormat.dateOnly
          );
        },
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
                onClick={() => this.editUser(record)}
              >
                <i className="fas fa-edit"></i>
              </Button>
            </div>
          );
        },
      },
      {
        Header: "Status",
        width: 100,
        Cell: (record) => {
          if (record.original.Status === "Active") {
            return (
              <Button
                color="success"
                className="table-btn"
                onClick={() => this.activeInactiveUser(record)}
              >
                Active
              </Button>
            );
          } else {
            return (
              <Button
                color="danger"
                className="table-btn"
                onClick={() => this.activeInactiveUser(record)}
              >
                Inactive
              </Button>
            );
          }
        },
        sortable: false,
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
                <UserList />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">Consolidation Center List</h4>
              <Button
                color="primary"
                className=""
                onClick={() => this.addUser()}
              >
                Console Center / Rates
              </Button>
              <Button
                color="primary"
                className=""
                onClick={() => this.addMarkup()}
              >
                Markup Rates
              </Button>
            </CardHeader>
            <CardBody>
              <ReactTable
                getTheadFilterProps={(e) => this.filterProps(e)}
                defaultFiltered={this.state.previousFilterList}
                data={centerList}
                defaultSorted={this.state.previousSortList}
                minRows={0}
                filterable
                defaultFilterMethod={CommonConfig.filterCaseInsensitive}
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
    );
  }
}

export default ConsolidationCenterList;
