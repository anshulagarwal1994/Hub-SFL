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
import { clearConfigCache } from "prettier";

class OceanAutoTrackingList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Loading: false,
      trackingList: [],
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
    this.getOceanTrackingList();
    if (localStorage.getItem("loggedInUserData")) {
      var dataTest = JSON.parse(localStorage.getItem("loggedInUserData"));
      if (dataTest.userModuleAccess[36].WriteAccess === 1) {
        this.setState({ WriteAccess: 1 });
      } else {
        this.setState({ WriteAccess: 0 });
      }
    }
    
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

  getOceanTrackingList() {
    try {
      this.setState({ Loading: true });
      api
        .get("userManagement/getOceanTrackingList")
        .then((res) => {
          if (res.success) {
            this.setState({ trackingList: res.data, Loading: false });
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
    let CardData = this.state.trackingList;
    let j = CardData.findIndex((x) => x.OcenAutoTrackingIntervalId === id);
    let x = document.getElementsByTagName("input");
    let val = e.target.value;
    if (Type === "DateInterval") {
      if (CommonConfig.isEmpty(val)) {
        CardData[j].DateInterval = "";
        x[j].className = "form-control is-invalid";
      } else {
        CardData[j].DateInterval = val;
      }
    }
    this.setState({ trackingList: CardData });
  }

  handleBlur(e, id, Type) {
    let CardData = this.state.trackingList;
    let j = CardData.findIndex((x) => x.OcenAutoTrackingIntervalId === id);
    let x = document.getElementsByTagName("input");
    let val = e.target.value;
    if (Type === "DateInterval") {
      CardData[j].DateInterval = val;
      x[j].className = "form-control";
    }
    this.setState({ trackingList: CardData });
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
    return this.state.trackingList.map((service) => {
      const { OcenAutoTrackingIntervalId, StatusName, DateInterval ,Status } = service;
      return (
        <tr key={OcenAutoTrackingIntervalId}>
          <td>{StatusName}</td>
          <td>
            <input
              type="text"
              name="DateInterval"
              id="DateInterval"
              className="form-control"
              value={DateInterval}
              onChange={(event) =>
                this.handledInput(event, OcenAutoTrackingIntervalId, "DateInterval")
              }
              onBlur={(e) => this.handleBlur(e, OcenAutoTrackingIntervalId, "DateInterval")}
            />
          </td>
          <td>{Status}</td>
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
        Data: this.state.trackingList,
      };
      api
        .post("userManagement/addUpdateOceanTracking", Details)
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
                Ocean Tracking List
              </h4>
            </CardHeader>
            <CardBody>
              <div className="shipment-pane mt-20" id="markupdetails">
                <div className="package-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Interval</th>
                        <th>Status</th>
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

export default OceanAutoTrackingList;
