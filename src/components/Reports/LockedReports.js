import React, { Component } from "react";
import { CommonConfig } from "../../utils/constant";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import ReactTable from "react-table";
import CardBody from "components/Card/CardBody.js";
import Card from "components/Card/Card";
import moment from "moment";
import api from "../../utils/apiClient";
import cogoToast from "cogo-toast";
import LockIcon from "@material-ui/icons/Lock";
import CardIcon from "components/Card/CardIcon.js";
import Button from "components/CustomButtons/Button.js";
import CardHeader from "components/Card/CardHeader.js";
import SimpleBackdrop from "../../utils/general";
class LockedReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lockedShipments: [],
      checkAll: false,
      Loading: false,
      tab: "Lock",
    };
  }

  componentDidMount() {
    this.getLockedShipmentReport();
  }

  showLoader() {
    this.setState({ Loading: true });
  }

  hideLoader() {
    this.setState({ Loading: false });
  }

  getLockedShipmentReport() {
    let data = {
      UserID: 0,
    };
    try {
      this.showLoader();
      api
        .post("reports/getLockedShipmentReport", data)
        .then((res) => {
          this.hideLoader();
          if (res.success) {
            var i = 0;
            res.data.map((obj) => {
              obj.IsSelected = false;
              obj.Index = i;
              i++;
              return obj;
            });
            this.setState({
              lockedShipments: res.data,
            });
          }
        })
        .catch((err) => {
          cogoToast.error("Something went wrong");
          console.log(err);
        });
    } catch (err) {
      cogoToast.error("Something went wrong");
      console.log(err);
    }
  }

  checkboxHeader = (props) => {
    return (
      <div>
        <input
          type="checkbox"
          checked={this.state.checkAll}
          onChange={(e) => this.handleCheckboxChange(e, props, "All")}
        />
      </div>
    );
  };

  renderCheckbox = (record) => {
    // let index = this.state.lockedShipments.filter(x => x.Index === record.original.Index);
    // let isSelected = index[0] ? index[0]["IsSelected"] : false;
    return (
      <div>
        <input
          type="checkbox"
          checked={record.original.IsSelected}
          onChange={(e) => this.handleCheckboxChange(e, record, "Single")}
        />
      </div>
    );
  };

  handleCheckboxChange = (e, record, type) => {
    let checkedArr = this.state.lockedShipments;
    if (type === "Single") {
      checkedArr[record.original.Index]["IsSelected"] = e.target.checked;
    } else {
      let propsArr = record.data.map((x) => x._original);
      checkedArr.map((OBJ) => {
        OBJ.IsSelected =
          propsArr.findIndex((x) => x.Index === OBJ.Index) !== -1
            ? e.target.checked
            : OBJ.IsSelected;
        return OBJ;
      });

      this.setState({
        checkAll: e.target.checked,
      });
    }
    this.setState({ lockedShipments: checkedArr });
  };

  releaseNow = () => {
    let data = {
      LockedShipments: this.state.lockedShipments.filter(
        (x) => x.IsSelected === true
      ),
    };
    try {
      this.showLoader();
      api
        .post("scheduleShipment/releaseLockedShipmentReport", data)
        .then((res) => {
          this.hideLoader();
          if (res.success) {
            this.getLockedShipmentReport();
          }
        })
        .catch((err) => {
          cogoToast.error("Something went wrong");
          console.log(err);
        });
    } catch (err) {
      cogoToast.error("Something went wrong");
      console.log(err);
    }
  };

  render() {
    const { lockedShipments } = this.state;
    let unclearColumns = [];
    unclearColumns =
      this.state.tab === "Lock"
        ? [
            {
              Header: (props) => this.checkboxHeader(props),
              Cell: this.renderCheckbox,
              sortable: false,
              filterable: false,
              width: 40,
            },
          ]
        : [];
    unclearColumns = [
      ...unclearColumns,
      {
        Header: "Date",
        id: "ShipmentDate",
        sortMethod: (a, b) => {
          return CommonConfig.dateSortMethod(a, b);
        },
        accessor: (data) => {
          return data.ShipmentDate;
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
        Header: "Locked By Name",
        accessor: "LockedByName",
        width: 170,
      },
      {
        Header: "Last Login",
        id: "LastLoginTimeStamp",
        accessor: (data) => {
          let newLastLoginTime = moment(data.LastLoginTimeStamp).format(
            "MM/DD/YYYY h:mm a"
          );
          return newLastLoginTime;
        },
        width: 170,
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
      //   {
      //     Header: "Shipment",
      //     accessor: "ShipmentType",
      //     width: 81,
      //   },
      //   {
      //     Header: "Service",
      //     accessor: "ServiceName",
      //     width: 80,
      //   },
      //   {
      //     Header: "Sub Service",
      //     accessor: "SubServiceName",
      //     width: 73,
      //   },
      {
        Header: "Managed By",
        accessor: "ManagedByName",
        width: 90,
        Footer: (
          <Button
            style={{ width: "85px", height: "20px" }}
            color="rose"
            onClick={() => this.releaseNow()}
          >
            Release Now
          </Button>
        ),
      },
    ];
    return (
      <div>
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
        <GridItem>
          <GridContainer justify="center">
            <Card className="z-index-9">
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <LockIcon />
                </CardIcon>
                <h4 className="margin-right-auto text-color-black">
                  Locked Shipments
                </h4>
              </CardHeader>
              <CardBody>
                <ReactTable
                  data={lockedShipments}
                  minRows={2}
                  // pageText = { 'Total rows : ' + finalLengthUnclear +'\xa0\xa0\xa0\xa0\xa0\xa0\xa0'  + ' Total Amount : $ '+ finalAmountUnclear.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +'\xa0\xa0\xa0\xa0\xa0\xa0\xa0' }
                  defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                  defaultSorted={[]}
                  defaultFiltered={[]}
                  // getPaginationProps = {(e)=> this.checkPropsUnclear(e)}
                  filterable
                  resizable={false}
                  columns={unclearColumns}
                  defaultPageSize={10}
                  showPaginationBottom={true}
                  className="-striped -highlight all-account-react"
                />
              </CardBody>
            </Card>
          </GridContainer>
        </GridItem>
      </div>
    );
  }
}

export default LockedReports;
