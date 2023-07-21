import React, { Component } from "react";
import SimpleBackdrop from "../../utils/general";
import ReactTable from "react-table";
import api from "../../utils/apiClient";
import { CommonConfig } from "../../utils/constant";
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

class UserLists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Loading: false,
      userList: [],
      filterProps: [],
      sortProps: [],
      previousFilterList: [],
      previousSortList: [],
    };
  }

  componentDidMount() {
    this.getUserList();
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

  getUserList() {
    try {
      this.setState({ Loading: true });
      api
        .get("userManagement/getUserList")
        .then((res) => {
          if (res.success) {
            this.setState({ userList: res.data, Loading: false });
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
    this.props.history.push("AddUserNew/");
  };

  activeInactiveUser = (record) => {
    let data = {
      personID: record.original.PersonID,
      status: record.original.Status === "Active" ? "Inactive" : "Active",
    };

    try {
      this.setState({ Loading: true });
      api
        .post("userManagement/activeInactiveUser", data)
        .then((res) => {
          if (res.success) {
            this.getUserList();
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
    let UserID = record.original.PersonID;
    history.push({
      pathname: "EditUser",
      state: UserID,
      filterlist: this.state.filterProps,
      sortlist: this.state.sortProps,
    });
  };

  render() {
    const { userList } = this.state;

    const columns = [
      {
        Header: "Name",
        accessor: "Name",
        maxWidth: 100,
      },
      {
        Header: "User Name",
        accessor: "LoginID",
        maxWidth: 110,
      },
      {
        Header: "Email",
        accessor: "Email",
        width: 200,
      },
      {
        Header: "Mobile",
        accessor: "PhoneNum",
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
        Header: "Account No.",
        accessor: "AccountNumber",
        width: 100,
      },
      {
        Header: "Managed By",
        accessor: "ManagedByName",
        width: 100,
      },
      {
        Header: "Status",
        width: 100,
        sortable: true,
        filterable: true,
        accessor: "Status",

        // Cell: (record) => {
        //   if (record.original.Status === "Active") {
        //     return (
        //       <Button
        //         color="success"
        //         className="table-btn"
        //         onClick={() => this.activeInactiveUser(record)}
        //       >
        //         Active
        //       </Button>
        //     );
        //   } else {
        //     return (
        //       <Button
        //         color="danger"
        //         className="table-btn"
        //         onClick={() => this.activeInactiveUser(record)}
        //       >
        //         Inactive
        //       </Button>
        //     );
        //   }
        // },
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
              <h4 className="margin-right-auto text-color-black">User List</h4>
              <Button
                color="primary"
                className=""
                onClick={() => this.addUser()}
              >
                Add User
              </Button>
            </CardHeader>
            <CardBody>
              <ReactTable
                getTheadFilterProps={(e) => this.filterProps(e)}
                defaultFiltered={this.state.previousFilterList}
                data={userList}
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

export default UserLists;
