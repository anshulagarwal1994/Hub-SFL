import React, { Component } from "react";
import ReactTable from "react-table";
import api from "../../../utils/apiClient";
import { CommonConfig } from "../../../utils/constant";
import cogoToast from "cogo-toast";
import LocalShipping from "@material-ui/icons/LocalShipping";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";

class Service extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Loading: false,
      serviceList: [],
      filterProps: [],
      sortProps: [],
      previousFilterList: [],
      previousSortList: [],
    };
  }

  activeInactiveUser = (record) => {
    let data = {
      serviceID: record.original.ServiceID,
      status: record.original.Status === "Active" ? "Inactive" : "Active",
    };
    try {
      this.setState({ Loading: true });
      api
        .post("userManagement/activeInactiveService", data)
        .then((res) => {
          if (res.success) {
            this.getServiceList();
          } else {
            cogoToast.error("Something Went Wrong");
          }
        })
        .catch((err) => {
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {}
  };
  componentDidMount() {
    this.getServiceList();
    if (
      this.props.history.location.state !== undefined &&
      this.props.history.location.state !== null
    ) {
      this.setState({
        previousFilterList: this.props.history.location.state.filterlist,
        previousSortList: this.props.history.location.state.sortlist,
      });
    }
  }

  gotoedit = (record) => {
    let ServiceID = record.original.ServiceID;
    const { history } = this.props;
    history.push({
      pathname: "/admin/EditService",
      state: {
        Id: ServiceID,
        filterlist: this.state.filterProps,
        sortlist: this.state.sortProps,
      },
    });
  };

  addService = () => {
    this.props.history.push("/admin/AddService");
  };

  getServiceList() {
    try {
      this.setState({ Loading: true });
      api
        .get("userManagement/getServiceList")
        .then((res) => {
          if (res.success) {
            this.setState({ serviceList: res.data, Loading: false });
          } else {
            cogoToast.error("Something Went Wrong");
          }
        })
        .catch((err) => {
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {}
  }

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
  render() {
    const { serviceList } = this.state;

    const columns = [
      {
        Header: "Shipment Type",
        accessor: "ServiceType",
        width: 100,
        maxWidth: 100,
        minWidth: 100,
      },
      {
        Header: "Service Name",
        accessor: "MainServiceName",
        width: 155,
        maxWidth: 100,
        minWidth: 100,
      },
      {
        Header: "Sub Service Name",
        accessor: "ServiceName",
        width: 155,
        maxWidth: 100,
        minWidth: 100,
      },

      {
        Header: "Display Name",
        accessor: "DisplayName",
        foldable: true,
        width: 155,
      },
      {
        Header: "Package Markup",
        accessor: "Markup",
        width: 70,
      },
      {
        Header: "Envelop Markup",
        accessor: "EnvelopMarkup",
        width: 70,
      },
      {
        Header: "Default MarkUp Type",
        accessor: "MarkupType",
        width: 105,
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
              <Button justIcon color="info">
                <i
                  className="fas fa-edit"
                  onClick={() => this.gotoedit(record)}
                ></i>
              </Button>
            </div>
          );
        },
      },
      {
        Header: "Status",
        accessor: "Status",
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
        <GridItem xs={12}>
          <Card>
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <LocalShipping />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">
                Service List
              </h4>
              <Button
                color="primary"
                className=""
                onClick={() => this.addService()}
              >
                Add Service
              </Button>
            </CardHeader>
            <CardBody>
              <ReactTable
                data={serviceList}
                defaultFiltered={this.state.previousFilterList}
                defaultSorted={this.state.previousSortList}
                minRows={0}
                defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                filterable
                resizable={false}
                getTheadFilterProps={(e) => this.filterProps(e)}
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

export default Service;
