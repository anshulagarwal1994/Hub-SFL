import React, { Component } from "react";
import ReactTable from "react-table";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import GridContainer from "components/Grid/GridContainer.js";
import moment from "moment";
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

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

class MyShipment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loading: false,
      servicelist: [],
      serviceValue: [],
      filterProps: [],
      previousFilterList: [],
      sortProps: [],
      previousSortList: [],
      shipmentList: [],
      Access: [],
      loggedUser: 0,
      finalLength: 0,
    };
  }

  componentDidMount() {
    this.setState({
      Access: CommonConfig.getUserAccess("Shipment"),
      loggedUser: CommonConfig.loggedInUserData().PersonID,
    });
    this.getShipmentList();
    if (
      this.props.history.location.state !== undefined &&
      this.props.history.location.state !== null
    ) {
      this.setState({
        previousFilterList: this.props.history.location.state.filterlist,
        previousSortList: this.props.history.location.state.sortlist,
      });
    } else {
      var finalSort = {
        id: "ShipmentDate",
        desc: true,
      };
      this.setState({ previousSortList: [finalSort] });
    }
  }

  getShipmentList() {
    try {
      let data = {
        LoginID: CommonConfig.loggedInUserData().PersonID,
      };
      api
        .post("scheduleshipment/getMyShipmentList", data)
        .then((res) => {
          this.setState({ Loading: false });
          if (res.success) {
            this.setState({ shipmentList: res.data });
          } else {
            cogoToast.error("Something Went Wrong");
          }
        })
        .catch((err) => {
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {}
  }

  editShipment = (record) => {
    const { history } = this.props;
    history.push({
      pathname: "MyShipmentNew",
      state: {
        ShipppingID: record.original.ShippingID,
        filterlist: this.state.filterProps,
        sortlist: this.state.sortProps,
      },
    });
  };

  filterMethod = (event, value) => {
    this.setState({ serviceValue: value });
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

  render() {
    const { shipmentList } = this.state;
    const Services = this.state.servicelist.map((service) => {
      return { value: service.Description, label: service.Description };
    });
    const Columns = [
      {
        Header: "Date",
        id: "ShipmentDate",
        accessor: (data) => {
          return moment(data.ShipmentDate).format(
            CommonConfig.dateFormat.dateOnly
          );
        },
        maxWidth: 100,
      },
      {
        Header: "Tracking",
        accessor: "TrackingNumber",
        width: 85,
      },
      {
        Header: "Sender",
        accessor: "FromContactName",
        width: 95,
      },
      {
        Header: "City",
        accessor: "FromCity",
        width: 80,
      },
      {
        Header: "State",
        accessor: "FromState",
        width: 80,
      },
      {
        Header: "Receiver",
        accessor: "ToContactName",
        width: 95,
      },
      {
        Header: "City",
        accessor: "ToCity",
        width: 85,
      },
      {
        Header: "State",
        accessor: "ToState",
        width: 85,
      },
      {
        Header: "Type",
        accessor: "ShipmentType",
        width: 73,
      },
      {
        Header: "Status",
        accessor: "ShipmentStatus",
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
                onClick={() => this.editShipment(record)}
              >
                <i className="fas fa-edit"></i>
              </Button>
            </div>
          );
        },
      },
    ];

    const viewAllcolumns = [
      {
        Header: "Date",
        id: "ShipmentDate",
        sortMethod: (a, b) => {
          return CommonConfig.dateSortMethod(a, b);
        },
        accessor: (data) => {
          return moment(data.ShipmentDate).format(
            CommonConfig.dateFormat.dateOnly
          );
        },
        maxWidth: 85,
      },
      {
        Header: "Tracking",
        accessor: "TrackingNumber",
        width: 83,
      },
      {
        Header: "Managed By",
        accessor: "ManagedByName",
        width: 87,
      },
      {
        Header: "Sender",
        accessor: "FromContactName",
        width: 90,
      },
      {
        Header: "City",
        accessor: "FromCity",
        width: 80,
      },
      {
        Header: "State",
        accessor: "FromState",
        width: 80,
      },
      {
        Header: "Receiver",
        accessor: "ToContactName",
        width: 95,
      },
      {
        Header: "City",
        accessor: "ToCity",
        width: 85,
      },
      {
        Header: "State",
        accessor: "ToState",
        width: 85,
      },
      {
        Header: "Type",
        accessor: "ShipmentType",
        width: 73,
      },
      {
        Header: "Status",
        accessor: "ShipmentStatus",
        width: 100,
      },
      {
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        filterable: false,
        width: 65,
        Cell: (record) => {
          return (
            <div className="table-common-btn">
              <Button
                justIcon
                color="info"
                onClick={() => this.editShipment(record)}
              >
                <i className="fas fa-edit"></i>
              </Button>
            </div>
          );
        },
      },
    ];

    return (
      <GridContainer className="UserList-outer">
        <GridItem xs={12}>
          <Card>
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <Store />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">
                Shipment List
              </h4>
            </CardHeader>
            <CardBody>
              <ReactTable
                data={shipmentList}
                minRows={2}
                pageText={"Total rows : " + this.state.finalLength}
                defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                getPaginationProps={(e) => this.checkProps(e)}
                getTheadFilterProps={(e) => this.filterProps(e)}
                filterable
                defaultSorted={this.state.previousSortList}
                defaultFiltered={this.state.previousFilterList}
                resizable={false}
                columns={
                  this.state.Access.AllAccess === 1 ? viewAllcolumns : Columns
                }
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

export default MyShipment;
