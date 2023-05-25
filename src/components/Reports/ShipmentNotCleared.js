import React, { Component } from "react";
// import CustomInput from "components/CustomInput/CustomInput";
import GridContainer from "components/Grid/GridContainer.js";
import { CommonConfig } from "../../utils/constant";
import ReactTable from "react-table";
import GridItem from "components/Grid/GridItem.js";
import CardBody from "components/Card/CardBody.js";

import Card from "components/Card/Card";
import HeadsetMic from "@material-ui/icons/HeadsetMic";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import cogoToast from "cogo-toast";
import api from "../../utils/apiClient";
import moment from "moment";

class ShipmentNotCleared extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ShipmentNotClearedList: [],
      finalLength: 0,
      finalAmount: 0,
      Access: {},
    };
  }

  viewShipment = (ShippingID) => {
    const { history } = this.props;
    history.push({
      pathname: "ShipmentNew",
      state: {
        ShipppingID: ShippingID,
        filterlist: [],
        sortlist: [],
      },
    });
  };

  componentDidMount = () => {
    this.setState({
      Access: CommonConfig.getUserAccess("Shipment Not Cleared"),
    });
    this.getShipmentList();
  };

  getShipmentList = () => {
    try {
      api
        .get("reports/getShipmentAllCleared")
        .then((res) => {
          if (res.success) {
            if (this.state.Access.AllAccess === 1) {
              this.setState({ ShipmentNotClearedList: res.data });
            } else {
              let shipmentList = res.data.filter(
                (x) =>
                  x.ManagedName === CommonConfig.loggedInUserData().PersonID
              );
              this.setState({ ShipmentNotClearedList: shipmentList });
            }
          }
        })
        .catch((err) => {
          cogoToast.error("Something went wrong");
          console.log("error...", err);
        });
    } catch (err) {
      console.log("error....", err);
      cogoToast.error("Something went wrong");
    }
  };

  setLength = (len) => {
    this.setState({ finalLength: len });
  };

  finalAmount = (amountData) => {
    let amount = 0;
    for (var j = 0; j < amountData.length; j++) {
      amount = amount + Number(amountData[j].Amount.replace("$", ""));
    }
    this.setState({ finalAmount: parseFloat(amount).toFixed(2) });
  };

  checkProps = (e) => {
    if (this.state.finalLength !== e.sortedData.length) {
      this.setLength(e.sortedData.length);
      this.finalAmount(e.sortedData);
    }
    return "";
  };

  render() {
    const columns = [
      {
        Header: "Date",
        id: "ShipmentDate",
        accessor: (data) => {
          return moment(data.ShipmentDate).format(
            CommonConfig.dateFormat.dateOnly
          );
        },
        width: 85,
      },
      {
        Header: "Tracking",
        id: "Tracking",
        accessor: "TrackingNumber",
        width: 90,
      },
      {
        Header: "Contact Name",
        accessor: "ContactName",
        width: 90,
      },
      {
        Header: "From",
        accessor: "FromCountry",
        width: 80,
      },
      {
        Header: "To",
        accessor: "ToCountry",
        width: 80,
      },
      {
        Header: "Status",
        accessor: "ShipmentStatus",
        width: 100,
      },
      {
        Header: "Shipment",
        accessor: "ShipmentType",
        width: 81,
      },
      {
        Header: "Service",
        accessor: "ServiceName",
        width: 80,
      },
      {
        Header: "Sub Service",
        accessor: "SubServiceName",
        width: 73,
      },
      {
        Header: "Username",
        accessor: "UserName",
        width: 90,
      },
      {
        Header: "Managed By",
        accessor: "ManagedBy",
        width: 90,
      },
      {
        Header: "Amount",
        id: "Amount",
        accessor: (data) => {
          return CommonConfig.isEmpty(data.FinalAmount)
            ? ""
            : "$ " + parseFloat(data.FinalAmount).toFixed(2);
        },
        width: 70,
      },
    ];
    const { ShipmentNotClearedList, finalLength, finalAmount } = this.state;
    return (
      <GridItem>
        <GridContainer justify="center">
          <Card>
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <HeadsetMic />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">
                Shipment Not Cleared
              </h4>
            </CardHeader>
            <CardBody>
              <ReactTable
                data={ShipmentNotClearedList}
                minRows={2}
                pageText={
                  `Total rows : ` +
                  finalLength +
                  ` Total Amount : ` +
                  finalAmount
                }
                defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                getPaginationProps={(e) => this.checkProps(e)}
                filterable
                resizable={false}
                columns={columns}
                defaultPageSize={10}
                showPaginationBottom={true}
                className="-striped -highlight"
              />
            </CardBody>
          </Card>
        </GridContainer>
      </GridItem>
    );
  }
}

export default ShipmentNotCleared;
