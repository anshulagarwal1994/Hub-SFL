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
import { clearConfigCache } from "prettier";

class CreditCardList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Loading: false,
      userList: [],
      filterProps: [],
      sortProps: [],
      previousFilterList: [],
      previousSortList: [],
      Access: [],
      test: "",
      PersonID: "",
      WriteAccess: 0,
    };
  }

  componentDidMount() {
    this.getUserList();
    if (localStorage.getItem("loggedInUserData")) {
      debugger;
      var dataTest = JSON.parse(localStorage.getItem("loggedInUserData"));

      if (dataTest.userModuleAccess[36].WriteAccess === 1) {
        this.setState({ WriteAccess: 1 });
      } else {
        this.setState({ WriteAccess: 0 });
      }
    }

    this.UpdateLimitOnLoad();
    this.setState({ Access: CommonConfig.getUserAccess("Lead Assignment") }); // Need to changes the userAccesss
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
  UpdateLimitOnLoad = () => {
    debugger;

    try {
      var data = {
        Personid: CommonConfig.loggedInUserData().PersonID,
      };
      api
        .post("authorizeNet/UpdateLimitOnLoad", data)
        .then((result) => {
          if (result.success) {
            console.log(result);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  };

  getUserList() {
    try {
      this.setState({ Loading: true });
      api
        .get("userManagement/getTransactionLimitList")
        .then((res) => {
          if (res.success) {
            this.setState({ userList: res.data, Loading: false });
          } else {
            this.setState({ Loading: false });
            cogoToast.error("Something Went Wrong");
          }
        })
        .catch((err) => {
          this.setState({ Loading: false });
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {
      console.log("error: ", error);
    }
  }

  handledInput(e, id, Type) {
    let CardData = this.state.userList;
    let j = CardData.findIndex((x) => x.PersonID === id);
    let x = document.getElementsByTagName("input");
    let val = e.target.value;
    if (Type === "DailyLimit") {
      if (CommonConfig.isEmpty(val)) {
        CardData[j].DailyLimit = "";
        x[j].className = "form-control is-invalid";
      } else {
        CardData[j].DailyLimit = val;
      }
    } else if (Type === "TotalLimit") {
      if (CommonConfig.isEmpty(val)) {
        CardData[j].TotalLimit = "";
        x[j].className = "form-control is-invalid";
      } else {
        CardData[j].TotalLimit = val;
      }
    }
    this.setState({ userList: CardData });
  }

  handleBlur(e, id, Type) {
    let CardData = this.state.userList;
    let j = CardData.findIndex((x) => x.PersonID === id);
    let x = document.getElementsByTagName("input");
    let val = e.target.value;
    if (Type === "DailyLimit") {
      CardData[j].DailyLimit = val;
      x[j].className = "form-control";
    } else if (Type === "TotalLimit") {
      CardData[j].TotalLimit = val;
      x[j].className = "form-control";
    }
    this.setState({ userList: CardData });
  }

  setFilterProps(filterValue) {
    this.setState({
      filterProps: filterValue.filtered,
      sortProps: filterValue.sorted,
    });
  }

  filterProps(e) {
    if (this.state.filterProps !== e.filtered) {
      this.setFilterProps(e);
    }
    if (this.state.sortProps !== e.sorted) {
      this.setFilterProps(e);
    }
    return "";
  }

  renderData() {
    return this.state.userList.map((service) => {
      const { PersonID, Name, DailyLimit, TotalLimit, Balance } = service;
      return (
        <tr key={PersonID}>
          <td>{Name}</td>
          <td>
            <input
              type="text"
              name="DailyLimit"
              id="DailyLimit"
              className="form-control"
              value={DailyLimit}
              onChange={(event) =>
                this.handledInput(event, PersonID, "DailyLimit")
              }
              onBlur={(e) => this.handleBlur(e, PersonID, "DailyLimit")}
            />
          </td>
          <td>
            <input
              type="text"
              name="TotalLimit"
              id="TotalLimit"
              className="form-control"
              value={TotalLimit}
              onChange={(event) =>
                this.handledInput(event, PersonID, "TotalLimit")
              }
              onBlur={(e) => this.handleBlur(e, PersonID, "TotalLimit")}
            />
          </td>
          <td>{Balance}</td>
        </tr>
      );
    });
  }

  cancel() {
    this.props.history.push({
      pathname: "/admin/ManagementNavigation",
    });
  }

  save() {
    try {
      this.setState({ Loading: true });
      let Details = {
        Data: this.state.userList,
      };
      api
        .post("userManagement/addUpdateCardLimit", Details)
        .then((res) => {
          if (res.success) {
            window.location.reload();
          } else {
            cogoToast.error("Something Went Wrong");
          }
        })
        .catch((err) => {
          this.setState({ Loading: false });
          cogoToast.error(err);
        });
    } catch (error) {
      this.hideLoader();
      cogoToast.error("Something Went Wrong");
    }
  }

  render() {
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
              <h4 className="margin-right-auto text-color-black">
                Credit Card List
              </h4>
            </CardHeader>
            <CardBody>
              <div className="shipment-pane mt-20" id="markupdetails">
                <div className="package-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Transaction Limit</th>
                        <th>Daily Limit</th>
                        <th>Daily Balance</th>
                      </tr>
                    </thead>
                    <tbody>{this.renderData()}</tbody>
                  </table>
                </div>
              </div>
            </CardBody>
          </Card>
          <div className="right">
            {this.state.WriteAccess === 1 ? (
              <Button color="rose" onClick={() => this.save(false)}>
                Save
              </Button>
            ) : null}
            <Button color="secondary" onClick={() => this.cancel()}>
              Cancel
            </Button>
          </div>
        </GridItem>
      </GridContainer>
    );
  }
}

export default CreditCardList;
