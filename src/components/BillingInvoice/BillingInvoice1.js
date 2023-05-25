import React, { Component } from "react";
import { CommonConfig } from "../../utils/constant";
import SimpleBackdrop from "../../utils/general";
import api from "../../utils/apiClient";
import Card from "components/Card/Card";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import CardHeader from "components/Card/CardHeader.js";
import ReactTable from "react-table";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import * as XLSX from "xlsx";
import cogoToast from "cogo-toast";

class billingInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      BillingSteps: [
        {
          stepName: "Open / Past Due",
          stepId: "openinvoice",
          Type: "OpenPastDue",
          classname: "active",
        },
        {
          stepName: "Upcoming Invoices",
          stepId: "upcominginvoice",
          Type: "Upcoming",
          classname: "inactive",
        },
        {
          stepName: "Paid Invoices",
          stepId: "paidinvoice",
          Type: "Paid",
          classname: "inactive",
        },
      ],
      Access: {},
      Loading: false,

      OpenPastDue: [],
      PastDue: [],
      Upcoming: [],
      Paid: [],
      ShipmentDetailList: [],
      TrackingDetailList: [],
      AccountDetailList: [],
      checkAll: false,
      Dialogopen: false,
      openFilterList: [],
      openSortList: [],

      pastdueFilterList: [],
      pastdueSortList: [],

      upcomingFilterList: [],
      upcomingSortList: [],

      paidFilterList: [],
      paidSortList: [],

      finalLengthOpen: 0,
      finalLengthPastDue: 0,
      finalLengthUpcoming: 0,
      finalLengthPaid: 0,

      TotalInvoiceAmount: 0,
      TotalReceivedAmount: 0,
      TotalBalance: 0,

      currentTab: "",

      previousSelectedOpen: [],
      previousSelectedPastDue: [],
    };
  }

  componentDidMount() {
    this.setState({
      Access: CommonConfig.getUserAccess("Billing Report"),
      currentTab: "OpenPastDue",
    });
    if (this.props.location.state && this.props.location.state.currentTab) {
      this.showHide(this.props.location.state.currentTab);
      this.getInvoices(this.props.location.state.currentTab);
      this.setState({
        currentTab: this.props.location.state.currentTab,
      });
    } else {
      this.showHide("");
      this.getInvoices("OpenPastDue");
    }
  }

  //-------------------------------------------  Navigation Method  ------------------------  //

  navigateChange = (key) => {
    debugger
    let stepsList = this.state.BillingSteps;
    let activeIndex = stepsList.findIndex((x) => x.classname === "active");
    if (key !== activeIndex) {
      this.setState({
        OpenPastDue: [],
        PastDue: [],
        Upcoming: [],
        Paid: [],
        previousSelectedOpen: [],
        previousSelectedPastDue: [],
        previousSelectedUpcoming: [],
        checkAll: false,
      });
      stepsList[key]["classname"] = "active";
      stepsList[activeIndex]["classname"] = "inactive";
      this.setState({
        BillingSteps: stepsList,
        currentTab: stepsList[key]["Type"],
      });
      let divID = stepsList[key]["stepId"];
      let activeDiv = stepsList[activeIndex]["stepId"];
      document.getElementById(divID).style.display = "block";
      document.getElementById(activeDiv).style.display = "none";
      this.getInvoices(stepsList[key]["Type"]);
    }
  };

  showHide(type) {
    if (!CommonConfig.isEmpty(type)) {
      let stepsList = this.state.BillingSteps;
      let previousTab = stepsList.filter((x) => x.Type === type);
      let activeTab = stepsList.filter((x) => x.classname === "active");
      if (activeTab.length && previousTab.length) {
        if (activeTab[0].Type === previousTab[0].Type) {
          this.state.BillingSteps.map((step) => {
            step.classname === "active"
              ? (document.getElementById(step.stepId).style.display = "block")
              : (document.getElementById(step.stepId).style.display = "none");
          });
        } else {
          this.state.BillingSteps.map((step) => {
            step.Type === previousTab[0].Type
              ? (document.getElementById(step.stepId).style.display = "block")
              : (document.getElementById(step.stepId).style.display = "none");

            step.Type === previousTab[0].Type
              ? (step.classname = "active")
              : (step.classname = "inactive");
          });
        }
      }
    } else {
      this.state.BillingSteps.map((step) => {
        step.classname === "active"
          ? (document.getElementById(step.stepId).style.display = "block")
          : (document.getElementById(step.stepId).style.display = "none");
      });
    }
  }

  getInvoices(Type) {
    debugger
    try {
      let data = {
        InvoiceType: Type,
        AllAccess: CommonConfig.getUserAccess("Billing Report").AllAccess,
        UserID: CommonConfig.loggedInUserData().PersonID,
      };
      this.showLoader();
      api.post("scheduleshipment/getBillingInvoice", data).then((res) => {
        this.hideLoader();
        if (res.success) {
          let openArr = res.data[0];
          openArr = openArr.filter(
            (v, i, a) => a.findIndex((t) => t.ShippingID === v.ShippingID) === i
          );
          var i = 0;
          openArr.map((OBJ) => {
            OBJ.IsSelected = false;
            OBJ.Index = i;
            i++;
            return OBJ;
          });
          console.log('data list ',this.state);
          this.setState({
            [Type]: openArr,
          });
        }
      });
    } catch (err) {
      console.log("error.....", err);
    }
  }

  showLoader() {
    this.setState({ Loading: true });
  }

  hideLoader() {
    this.setState({ Loading: false });
  }

  openmyShipment = (record) => {
    const { history } = this.props;
    history.push({
      pathname: "MyShipmentNew",
      state: {
        ShipppingID: record.original.ShippingID,
        myfilterlist: [],
        type: "MyShipment",
        myshipmentstatusList: [],
        mysortlist: [],
      },
    });
  };

  finalAmountInvoice = (data) => {
    let amount = 0;
    let receivedAmount = 0;
    let invoiceAmount = 0;
    for (var j = 0; j < data.length; j++) {
      amount = amount + Number(data[j].Balance.replace("$ ", ""));
      receivedAmount =
        receivedAmount + Number(data[j].ReceivedAmount.replace("$ ", ""));
      invoiceAmount =
        invoiceAmount + Number(data[j].InvoiceAmount.replace("$ ", ""));
    }
    this.setState({
      TotalInvoiceAmount: invoiceAmount,
      TotalReceivedAmount: receivedAmount,
      TotalBalance: amount,
    });
  };

  InvoiceProps = (e, type) => {
    if (this.state[type] !== e.sortedData.length) {
      this.setLengthInvoice(e.sortedData.length, type);
      this.finalAmountInvoice(e.sortedData);
    }
    return "";
  };

  setLengthInvoice(len, type) {
    this.setState({
      [type]: len,
    });
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
    let Type = this.state.currentTab;
    let checkedArr = this.state[Type];
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
    let previousList = checkedArr.filter((x) => x.IsSelected === true);
    let arrType = "previousSelected" + Type;

    this.setState({
      [Type]: checkedArr,
      [arrType]: previousList,
    });
  };

  PayNow = () => {
    let paidList = this.state[this.state.currentTab];
    paidList = paidList
      .filter((x) => x.IsSelected === true)
      .map((obj) => {
        obj.Balance = Number(
          parseFloat(
            Number(obj.InvoiceAmount) - Number(obj.ReceivedAmount)
          ).toFixed(2)
        );
        return obj;
      });
    this.props.history.push({
      pathname: "confirmOnlinePayment",
      state: {
        paidList: paidList,
        currentTab: this.state.currentTab,
      },
    });
  };

  DownloadExcel = () => {
    this.showLoader();
    let paidList = this.state[this.state.currentTab];
    paidList = paidList
      .filter((x) => x.IsSelected === true)
      .map((obj) => {
        return obj;
      });

      console.log('paidlist',paidList);
    api.post("scheduleshipment/getBillingInvoiceDataForExcel", paidList).then((result) => {
      if (result.data.success) {
        this.hideLoader();
        this.setState({
          ShipmentDetailList: result.data.data.ShipmentDetail,
          TrackingDetailList: result.data.data.TrackingDetail,
          AccountDetailList: result.data.data.AccountDetail,
          Dialogopen: true
        });
      } else {
        this.hideLoader();
        cogoToast.error("Something Went Wrong");
      }
    })
      .catch((err) => {
        this.hideLoader();
        cogoToast.error("Something Went Wrong");
      });

  };

  renderShipmentData = () => {
    return this.state.ShipmentDetailList.map((service) => {
      const {
        AccountNumber,
        ShipDate,
        TrackingNumber,
        TrackingID,
        Carrier,
        ServiceType,
        SubServiceType,
        ShipperCompanyName,
        ShipperName,
        ShipperAddressLine1,
        ShipperAddressLine2,
        ShipperCity,
        ShipperState,
        ShipperZipCode,
        ShipperCountry,
        RecipientName,
        RecipientCompanyName,
        RecipientAddressLine1,
        RecipientAddressLine2,
        RecipientCity,
        RecipientState,
        RecipientZipCode,
        RecipientCountry
      } = service;
      return (
        <tr>
          <td align="left">
            {AccountNumber}
          </td>
          <td align="left">
            {ShipDate}
          </td>
          <td align="left">
          '{TrackingNumber}
          </td>
          <td align="left">
          '{TrackingID}
          </td>
          <td align="left">
            {Carrier}
          </td>
          <td align="left">
            {ServiceType}
          </td>
          <td align="left">
            {SubServiceType}
          </td>
          <td align="left">
            {ShipperCompanyName}
          </td>
          <td align="left">
            {ShipperName}
          </td>
          <td align="left">
            {ShipperAddressLine1}
          </td>
          <td align="left">
            {ShipperAddressLine2}
          </td>
          <td align="left">
            {ShipperCity}
          </td>
          <td align="left">
            {ShipperState}
          </td>
          <td align="left">
            {ShipperZipCode}
          </td>
          <td align="left">
            {ShipperCountry}
          </td>
          <td align="left">
            {RecipientName}
          </td>
          <td align="left">
            {RecipientCompanyName}
          </td>
          <td align="left">
            {RecipientAddressLine1}
          </td>
          <td align="left">
            {RecipientAddressLine2}
          </td>
          <td align="left">
            {RecipientCity}
          </td>
          <td align="left">
            {RecipientState}
          </td>
          <td align="left">
            {RecipientZipCode}
          </td>
          <td align="left">
            {RecipientCountry}
          </td>
        </tr>
      );
    });
  };

  renderTrackingData = () => {
    return this.state.TrackingDetailList.map((service) => {
      const {
        TrackingNumber,
        PackageCount,
        ActualWeight,
        Length,
        Width,
        Height,
        ChargableWeight,
        InsuredValue,
      } = service;
      return (
        <tr>
          <td align="left">
            '{TrackingNumber}
          </td>
          <td align="left">
            {PackageCount}
          </td>
          <td align="left">
            {ActualWeight}
          </td>
          <td align="left">
            {Length}
          </td>
          <td align="left">
            {Width}
          </td>
          <td align="left">
            {Height}
          </td>
          <td align="left">
            {ChargableWeight}
          </td>
          <td align="left">
            {InsuredValue}
          </td>
        </tr>
      );
    });
  };

  renderAccountData = () => {
    return this.state.AccountDetailList.map((service) => {
      const {
        TrackingNumber,
        Date,
        Type,
        ServiceDescription,
        PaymentAccountNumber,
        ConfirmationNumber,
        ServiceQuantity,
        ServiceCost,
        ServiceTotal
      } = service;
      return (
        <tr>
          <td align="left">
            '{TrackingNumber}
          </td>
          <td align="left">
            {Date}
          </td>
          <td align="left">
            {Type}
          </td>
          <td align="left">
            {ServiceDescription}
          </td>
          <td align="left">
            {PaymentAccountNumber}
          </td>
          <td align="left">
            {ConfirmationNumber}
          </td>
          <td align="left">
            {ServiceQuantity}
          </td>
          <td align="left">
            {ServiceCost}
          </td>
          <td align="left">
            {ServiceTotal}
          </td>
        </tr>
      );
    });
  };

  doExcel1 = (tableId1, tableId2, tableId3) => {

    let targetTableElm1 = document.getElementById(tableId1);
    let targetTableElm2 = document.getElementById(tableId2);
    let targetTableElm3 = document.getElementById(tableId3);

    const wb = { SheetNames: [], Sheets: {} };
    var ws1 = XLSX.utils.table_to_book(targetTableElm1).Sheets.Sheet1;
    wb.SheetNames.push("Shipment Detail");
    wb.Sheets["Shipment Detail"] = ws1;

    var ws2 = XLSX.utils.table_to_book(targetTableElm2).Sheets.Sheet1;
    wb.SheetNames.push("Package Detail");
    wb.Sheets["Package Detail"] = ws2;

    var ws3 = XLSX.utils.table_to_book(targetTableElm3).Sheets.Sheet1;
    wb.SheetNames.push("Account Detail");
    wb.Sheets["Account Detail"] = ws3;

    const blob = new Blob([this.s2ab(XLSX.write(wb, { bookType: 'xlsx', type: 'binary' }))], {
      type: "application/octet-stream"
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'BillingInvoiceExcelSheet.xlsx';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.setState({ Dialogopen: false });
  }

  s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  render() {
    const {
      OpenPastDue,
      PastDue,
      Upcoming,
      openFilterList,
      openSortList,
      pastdueFilterList,
      pastdueSortList,
      upcomingFilterList,
      upcomingSortList,
      paidSortList,
      paidFilterList,
      Paid,
    } = this.state;

    let billColumns = [];
    billColumns = [
      {
        Header: (props) => this.checkboxHeader(props),
        Cell: this.renderCheckbox,
        sortable: false,
        filterable: false,
        width: 40,
      },
      {
        Header: "Tracking",
        accessor: "TrackingNumber",
        width: 85,
      },
      {
        Header: "Invoice Date",
        accessor: "InvoiceDate",
        sortMethod: (a, b) => {
          return CommonConfig.dateSortMethod(a, b);
        },
        width: 85,
      },
      {
        Header: "Sender",
        accessor: "FromContactName",
        width: 85,
      },
      {
        Header: "Recipient",
        accessor: "ToContactName",
        width: 85,
      },
    ];

    billColumns =
      this.state.Access.AllAccess === 1
        ? [
          ...billColumns,
          {
            Header: "Username",
            accessor: "LoginID",
            width: 70,
          },
          {
            Header: "Amount",
            sortMethod: (a, b) => {
              a = a.split("$ ")[1] !== undefined ? a.split("$ ")[1] : 0;
              b = b.split("$ ")[1] !== undefined ? b.split("$ ")[1] : 0;
              a = Number(a);
              b = Number(b);
              if (a.length === b.length) {
                return a > b ? 1 : -1;
              }
              return a.length > b.length ? 1 : -1;
            },
            accessor: (data) => {
              return CommonConfig.isEmpty(data.InvoiceAmount)
                ? ""
                : "$ " + parseFloat(data.InvoiceAmount).toFixed(2);
            },
            Footer: (
              <span>
                {CommonConfig.isEmpty(this.state.TotalInvoiceAmount)
                  ? ""
                  : "$ " +
                  parseFloat(this.state.TotalInvoiceAmount)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </span>
            ),
            id: "InvoiceAmount",
            width: 75,
          },
          {
            Header: "Paid",
            sortMethod: (a, b) => {
              a = a.split("$ ")[1] !== undefined ? a.split("$ ")[1] : 0;
              b = b.split("$ ")[1] !== undefined ? b.split("$ ")[1] : 0;
              a = Number(a);
              b = Number(b);
              if (a.length === b.length) {
                return a > b ? 1 : -1;
              }
              return a.length > b.length ? 1 : -1;
            },
            Footer: (
              <span>
                {CommonConfig.isEmpty(this.state.TotalReceivedAmount)
                  ? ""
                  : "$ " +
                  parseFloat(this.state.TotalReceivedAmount)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </span>
            ),
            accessor: (data) => {
              return CommonConfig.isEmpty(data.ReceivedAmount)
                ? ""
                : "$ " + parseFloat(data.ReceivedAmount).toFixed(2);
            },
            id: "ReceivedAmount",
            width: 85,
          },
          {
            Header: "Balance",
            sortMethod: (a, b) => {
              a = a.split("$ ")[1] !== undefined ? a.split("$ ")[1] : 0;
              b = b.split("$ ")[1] !== undefined ? b.split("$ ")[1] : 0;
              a = Number(a);
              b = Number(b);
              if (a.length === b.length) {
                return a > b ? 1 : -1;
              }
              return a.length > b.length ? 1 : -1;
            },
            Footer: (
              <span>
                {CommonConfig.isEmpty(this.state.TotalBalance)
                  ? ""
                  : "$ " +
                  parseFloat(this.state.TotalBalance)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </span>
            ),
            accessor: (data) => {
              return (
                "$ " +
                parseFloat(
                  Number(data.InvoiceAmount) - Number(data.ReceivedAmount)
                ).toFixed(2)
              );
            },
            id: "Balance",
            width: 85,
          },
          {
            Header: "Due Date",
            accessor: "DueDate",
            sortMethod: (a, b) => {
              return CommonConfig.dateSortMethod(a, b);
            },
            Footer:
              <Button style={{ width: "85px", height: "25px" }}
                color="rose" onClick={(e) => this.DownloadExcel()}> Download
              </Button>,
            width: 85,
          },
          {
            Header: "Actions",
            accessor: "actions",
            sortable: false,
            filterable: false,
            width: 70,
            Footer:
              this.state.currentTab === "OpenPastDue" ? (
                <Button
                  style={{ width: "50px", height: "25px" }}
                  color="rose"
                  onClick={() => this.PayNow()}
                >
                  Pay Now
                </Button>
              ) : null,
            Cell: (record) => {
              return (
                <div>
                  <Button
                    style={{ width: "50px", height: "20px" }}
                    color="info"
                    onClick={() => this.openmyShipment(record)}
                  >
                    Open
                  </Button>
                </div>
              );
            },
          },
        ]
        : [
          ...billColumns,
          {
            Header: "Amount",
            sortMethod: (a, b) => {
              a = a.split("$ ")[1] !== undefined ? a.split("$ ")[1] : 0;
              b = b.split("$ ")[1] !== undefined ? b.split("$ ")[1] : 0;
              a = Number(a);
              b = Number(b);
              if (a.length === b.length) {
                return a > b ? 1 : -1;
              }
              return a.length > b.length ? 1 : -1;
            },
            accessor: (data) => {
              return CommonConfig.isEmpty(data.InvoiceAmount)
                ? ""
                : "$ " + parseFloat(data.InvoiceAmount).toFixed(2);
            },
            Footer: (
              <span>
                {CommonConfig.isEmpty(this.state.TotalInvoiceAmount)
                  ? ""
                  : "$ " +
                  parseFloat(this.state.TotalInvoiceAmount)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </span>
            ),
            id: "InvoiceAmount",
            width: 85,
          },
          {
            Header: "Paid",
            sortMethod: (a, b) => {
              a = a.split("$ ")[1] !== undefined ? a.split("$ ")[1] : 0;
              b = b.split("$ ")[1] !== undefined ? b.split("$ ")[1] : 0;
              a = Number(a);
              b = Number(b);
              if (a.length === b.length) {
                return a > b ? 1 : -1;
              }
              return a.length > b.length ? 1 : -1;
            },
            Footer: (
              <span>
                {CommonConfig.isEmpty(this.state.TotalReceivedAmount)
                  ? ""
                  : "$ " +
                  parseFloat(this.state.TotalReceivedAmount)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </span>
            ),
            accessor: (data) => {
              return CommonConfig.isEmpty(data.ReceivedAmount)
                ? ""
                : "$ " + parseFloat(data.ReceivedAmount).toFixed(2);
            },
            id: "ReceivedAmount",
            width: 85,
          },
          {
            Header: "Balance",
            sortMethod: (a, b) => {
              a = a.split("$ ")[1] !== undefined ? a.split("$ ")[1] : 0;
              b = b.split("$ ")[1] !== undefined ? b.split("$ ")[1] : 0;
              a = Number(a);
              b = Number(b);
              if (a.length === b.length) {
                return a > b ? 1 : -1;
              }
              return a.length > b.length ? 1 : -1;
            },
            Footer: (
              <span>
                {CommonConfig.isEmpty(this.state.TotalBalance)
                  ? ""
                  : "$ " +
                  parseFloat(this.state.TotalBalance)
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </span>
            ),
            accessor: (data) => {
              return (
                "$ " +
                parseFloat(
                  Number(data.InvoiceAmount) - Number(data.ReceivedAmount)
                ).toFixed(2)
              );
            },
            id: "Balance",
            width: 85,
          },
          {
            Header: "Due Date",
            accessor: "DueDate",
            sortMethod: (a, b) => {
              return CommonConfig.dateSortMethod(a, b);
            },
            Footer:
              <Button style={{ width: "85px", height: "25px" }}
                color="rose" onClick={(e) => this.DownloadExcel()}> Download
              </Button>,
            width: 85,
          },
          {
            Header: "Actions",
            accessor: "actions",
            sortable: false,
            filterable: false,
            Footer:
              this.state.currentTab === "OpenPastDue" ? (
                <Button
                  style={{ width: "50px", height: "25px" }}
                  color="rose"
                  onClick={() => this.PayNow()}
                >
                  Pay Now
                </Button>
              ) : null,
            width: 70,
            Cell: (record) => {
              return (
                <div>
                  <Button
                    style={{ width: "50px", height: "20px" }}
                    color="info"
                    onClick={() => this.openmyShipment(record)}
                  >
                    Open
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
        <Card>
          <CardHeader className="btn-right-outer" color="primary" icon>
            <CardIcon color="primary">
              <EqualizerIcon />
            </CardIcon>
            <h4 className="margin-right-auto text-color-black">
              Billing Reports
            </h4>
          </CardHeader>
          <CardBody>
            <div className="shipment-nav">
              <ul>
                {this.state.BillingSteps.map((step, key) => {
                  return (
                    <li>
                      <a
                        className={step.classname}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          this.navigateChange(key);
                        }}
                      >
                        <span>{step.stepName}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="shipment-content mt-20">
              <div className="shipment-pane" id="openinvoice">
                <ReactTable
                  data={OpenPastDue}
                  minRows={2}
                  defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                  getPaginationProps={(e) =>
                    this.InvoiceProps(e, "finalLengthOpen")
                  }
                  filterable
                  defaultSorted={openSortList}
                  defaultFiltered={openFilterList}
                  resizable={false}
                  columns={billColumns}
                  defaultPageSize={10}
                  showPaginationBottom={true}
                  className="-striped -highlight"
                />
              </div>
              {/* <div className="shipment-pane" id="pastdueinvoice">
                <ReactTable
                  data={PastDue}
                  minRows={2}
                  defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                  getPaginationProps={(e) =>
                    this.InvoiceProps(e, "finalLengthPastDue")
                  }
                  filterable
                  defaultSorted={pastdueSortList}
                  defaultFiltered={pastdueFilterList}
                  resizable={false}
                  columns={billColumns}
                  defaultPageSize={10}
                  showPaginationBottom={true}
                  className="-striped -highlight"
                />
              </div> */}
              <div className="shipment-pane" id="upcominginvoice">
                <ReactTable
                  data={Upcoming}
                  minRows={2}
                  defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                  getPaginationProps={(e) =>
                    this.InvoiceProps(e, "finalLengthUpcoming")
                  }
                  filterable
                  defaultSorted={upcomingSortList}
                  defaultFiltered={upcomingFilterList}
                  resizable={false}
                  columns={billColumns}
                  defaultPageSize={10}
                  showPaginationBottom={true}
                  className="-striped -highlight"
                />
              </div>
              <div className="shipment-pane" id="paidinvoice">
                <ReactTable
                  data={Paid}
                  minRows={2}
                  defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                  getPaginationProps={(e) =>
                    this.InvoiceProps(e, "finalLengthPaid")
                  }
                  filterable
                  defaultSorted={paidSortList}
                  defaultFiltered={paidFilterList}
                  resizable={false}
                  columns={billColumns}
                  defaultPageSize={10}
                  showPaginationBottom={true}
                  className="-striped -highlight"
                />
              </div>
            </div>
          </CardBody>
        </Card>
        <div className="d-none">
          <table id="table-to-xls1" cellSpacing="10" cellPadding="10">
            <thead>
              <tr>
                <th><font size="+0">Account Number</font></th>
                <th><font size="+0">Ship Date</font></th>
                <th><font size="+0">SFL Tracking</font></th>
                <th><font size="+0">Carrier Tracking</font></th>
                <th><font size="+0">Carrier Name</font></th>
                <th><font size="+0">Service Type</font></th>
                <th><font size="+0">Sub-Service Type</font></th>
                <th><font size="+0">Shipper Company</font></th>
                <th><font size="+0">Shipper Name </font></th>
                <th><font size="+0">Shipper Address Line 1 </font></th>
                <th><font size="+0">Shipper Address Line 2 </font></th>
                <th><font size="+0">Shipper City </font></th>
                <th><font size="+0">Shipper State </font></th>
                <th><font size="+0">Shipper Zip Code </font></th>
                <th><font size="+0">Shipper Country/Territory </font></th>
                <th><font size="+0">Recipient Name </font></th>
                <th><font size="+0">Recipient Company </font></th>
                <th><font size="+0">Recipient Address Line 1 </font></th>
                <th><font size="+0">Recipient Address Line 2 </font></th>
                <th><font size="+0">Recipient City </font></th>
                <th><font size="+0">Recipient State</font></th>
                <th><font size="+0">Recipient Zip Code </font></th>
                <th><font size="+0">Recipient Country/Territory</font></th>
              </tr>
            </thead>
            <tbody>{this.renderShipmentData()}</tbody>
          </table>
        </div>

        <div className="d-none">
          <table id="table-to-xls2" cellSpacing="10" cellPadding="10">
            <thead>
              <tr>
                <th align="left" bgcolor="#D9D9D9"><font size="+0">Tracking Number</font></th>
                <th align="left" bgcolor="#D9D9D9"><font size="+0">Package Count</font></th>
                <th align="left" bgcolor="#D9D9D9"><font size="+0">Actual Weight</font></th>
                <th align="left" bgcolor="#D9D9D9"><font size="+0">Length</font></th>
                <th align="left" bgcolor="#D9D9D9"><font size="+0">Width</font></th>
                <th align="left" bgcolor="#D9D9D9"><font size="+0">Height</font></th>
                <th align="left" bgcolor="#D9D9D9"><font size="+0">Charge Weight</font></th>
                <th align="left" bgcolor="#D9D9D9"><font size="+0">Insurance</font></th>
              </tr>
            </thead>
            <tbody>{this.renderTrackingData()}</tbody>
          </table>
        </div>

        <div className="d-none">
          <table id="table-to-xls3" cellSpacing="10" cellPadding="10">
            <thead>
              <tr>
                <th align="left" bgcolor="#D9D9D9"><font size="+0">Tracking Number</font></th>
                <th align="left" bgcolor="#D9D9D9"><font size="+0">Date</font></th>
                <th align="left" bgcolor="#D9D9D9"><font size="+0">Type</font></th>
                <th align="left" bgcolor="#D9D9D9"><font size="+0">Service Description</font></th>
                <th align="left" bgcolor="#D9D9D9"><font size="+0">Payment Account Number</font></th>
                <th align="left" bgcolor="#D9D9D9"><font size="+0">Payment Confirmation Number</font></th>
                <th align="left" bgcolor="#D9D9D9"><font size="+0">Service Qty</font></th>
                <th align="left" bgcolor="#D9D9D9"><font size="+0">Services Cost</font></th>
                <th align="left" bgcolor="#D9D9D9"><font size="+0">Service Total</font></th>
              </tr>
            </thead>
            <tbody>{this.renderAccountData()}</tbody>
          </table>
        </div>
        <div>
          <Dialog
            maxWidth={671}
            open={this.state.Dialogopen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <div>
                Your Excel Sheet is Generated Successfully.
              </div>

            </DialogContent>
            <DialogActions>
              <Button color="rose" onClick={() => this.doExcel1("table-to-xls1", "table-to-xls2", "table-to-xls3")}>
                Download
              </Button>
              <Button color="danger" onClick={() => this.setState({ Dialogopen: false })}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}

export default billingInvoice;
