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
import api from "../../../utils/apiClient";
import { CommonConfig } from "../../../utils/constant";
import cogoToast from "cogo-toast";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

class Container extends Component {
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
      containerList: [],
      Access: [],
      finalLength: 0,
    };
  }

  addContainer = () => {
    this.props.history.push("/admin/AddContainer");
  };

  componentDidMount() {
    this.setState({
      Access: CommonConfig.getUserAccess("Container Management"),
    });
    //   this.serviceOffered();
    this.getContainerList();
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
  getContainerList() {
    try {
      api
        .get("container/containerList")
        .then((res) => {
          if (res.success) {
            if (this.state.Access.AllAccess === 1) {
              this.setState({ containerList: res.data, Loading: false });
            } else {
              var finalContainerList = [];
              finalContainerList = res.data.filter(
                (x) => x.CreatedBy === CommonConfig.loggedInUserData().PersonID
              );
              this.setState({
                containerList: finalContainerList,
                Loading: false,
              });
            }
          } else {
            cogoToast.error("Something Went Wrong");
          }
        })
        .catch((err) => {
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {}
  }

  editContainer = (record) => {
    const { history } = this.props;
    let containerId = record.original.ContainerID;
    history.push({
      pathname: "EditContainer",
      state: {
        containerId: containerId,
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
    const { containerList } = this.state;
    const columns = [
      {
        Header: "Date",
        id: "date",
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
        maxWidth: 84,
      },
      {
        Header: "Name",
        accessor: "ContainerName",
        width: 119,
      },
      {
        Header: "Size",
        accessor: "ContainerSize",
        width: 75,
      },
      {
        Header: "Load Date",
        id: "loaddate",
        accessor: (data) => {
          if (CommonConfig.isEmpty(data.LoadDate)) {
            return null;
          } else {
            return moment(data.LoadDate).format(
              CommonConfig.dateFormat.dateOnly
            );
          }
        },
        width: 84,
      },
      {
        Header: "Number",
        accessor: "ContainerNumber",
        width: 108,
      },
      {
        Header: "POD",
        accessor: "PlaceOfDeliveryByOnCarrier",
        width: 102,
      },
      {
        Header: "ETA",
        id: "arrivaldate",
        accessor: (data) => {
          if (CommonConfig.isEmpty(data.ArrivalDate)) {
            return null;
          } else {
            return moment(data.ArrivalDate).format(
              CommonConfig.dateFormat.dateOnly
            );
          }
        },
        width: 85,
      },
      {
        Header: "SC",
        accessor: "TotalShipment",
        width: 38,
      },
      {
        Header: "PC",
        accessor: "TotalPackages",
        width: 38,
      },
      {
        Header: "CFT",
        accessor: "CFT",
        width: 60,
      },
      {
        Header: "Status",
        accessor: "CurrentStatus",
        width: 75,
      },
      {
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        filterable: false,
        width: 55,
        Cell: (record) => {
          return (
            <div className="table-common-btn">
              <Button
                justIcon
                color="info"
                onClick={() => this.editContainer(record)}
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
                Container List
              </h4>
              {this.state.Access.WriteAccess === 1 ? (
                <Button
                  color="primary"
                  className=""
                  onClick={() => this.addContainer()}
                >
                  Add Container
                </Button>
              ) : null}
            </CardHeader>
            <CardBody>
              <ReactTable
                data={containerList}
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
    );
  }
}

export default Container;
