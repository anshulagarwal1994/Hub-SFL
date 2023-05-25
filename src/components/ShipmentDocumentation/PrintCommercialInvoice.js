import React, { Component } from "react";
import moment from "moment";
import { CommonConfig } from "../../utils/constant";
class PrintCommercialInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FromAddress: {},
      FromCountryName: "",
      ToCountryName: "",
      ToAddress: {},
      CommercialList: [],
      TrackingNumberList: [],
      TotalCost: 0,
      TrackingNumber: "",
      MaxPackageNumber: 0,
      CurrentTrackingNumber: "",
      ServiceName: "",
    };
  }
  componentDidMount() {
    let data = JSON.parse(localStorage.getItem("printCommercial"));
    this.setState({
      FromAddress: data.FromAddress.AddressDetail,
      FromCountryName: data.FromAddress.CountryName,
      ToAddress: data.ToAddress.AddressDetail,
      ToCountryName: data.ToAddress.CountryName,
      TrackingNumber: data.TrackingNumber,
      TrackingNumberList: data.DocumentTrackingList,
    });

    let totalCost = 0;
    let maxPacakge = 0;
    for (var i = 0; i < data.CommercialList.length; i++) {
      totalCost = data.CommercialList[i].TotalValue + totalCost;
      maxPacakge = Math.max(data.CommercialList[i].PackageNumber);
    }
    if (data.CommercialList.length < 10) {
      let diff = 10 - data.CommercialList.length;
      for (var j = 0; j < diff; j++) {
        var commercialObj = {
          PackageNumber: "",
          ContentDescription: "",
          Quantity: "",
          ValuePerQuantity: "",
          TotalValue: "",
          Index: "",
        };
        data.CommercialList.push(commercialObj);
      }
    }
    this.setState({
      TotalCost: parseFloat(totalCost).toFixed(2),
      MaxPackageNumber: maxPacakge,
      CommercialList: data.CommercialList,
    });
  }

  trackingNumberChange = (e) => {
    let serviceName = this.state.TrackingNumberList.filter(
      (x) => x.TrackingNumber === e.target.value
    );
    this.setState({
      CurrentTrackingNumber: e.target.value,
      ServiceName: !CommonConfig.isEmpty(serviceName[0])
        ? serviceName[0].Carrier
        : "",
    });
  };

  renderCommercial = () => {
    return this.state.CommercialList.map((commercial, idx) => {
      return (
        <tr>
          <td>{commercial.PackageNumber ? idx + 1 : null}</td>
          <td>{commercial.PackageNumber}</td>
          <td style={{ width: "30%" }}>{commercial.ContentDescription}</td>
          <td>{commercial.Quantity}</td>
          <td>
            {commercial.ValuePerQuantity ? "$" : null}
            {commercial.ValuePerQuantity
              ? parseFloat(commercial.ValuePerQuantity).toFixed(2)
              : null}
          </td>
          <td style={{ width: "10%" }}>
            {commercial.TotalValue ? "$" : null}
            {commercial.TotalValue
              ? parseFloat(commercial.TotalValue).toFixed(2)
              : null}
          </td>
          <td style={{ width: "10%" }}>
            {commercial.TotalValue ? "USD" : null}
          </td>
        </tr>
      );
    });
  };

  renderTrackingNumber = () => {
    return this.state.TrackingNumberList.map((tracking) => {
      return (
        <option value={tracking.TrackingNumber}>
          {tracking.TrackingNumber}
        </option>
      );
    });
  };

  // printDocument = () => {
  //     window.print();
  // }

  render() {
    const {
      FromAddress,
      ToAddress,
      FromCountryName,
      ToCountryName,
      TotalCost,
      TrackingNumber,
    } = this.state;
    return (
      <div>
        <div id="printCommercial" className="commercial-invoice-print">
          <table className="cip-new-table">
            <tr>
              <th
                colspan="7"
                style={{ fontSize: 20 }}
                className="center bg-grey"
              >
                COMMERCIAL INVOICE
              </th>
            </tr>
            <tr>
              <th style={{ width: "60%" }} colspan="4" className="bg-grey">
                DATE OF EXPORTATION
              </th>
              <th style={{ width: "40%" }} colspan="3" className="bg-grey">
                EXPORT REFERENCE - SFL TN
              </th>
            </tr>
            <tr>
              <td colspan="4" style={{ borderRight: "none" }}>
                {moment(FromAddress.ShipmentDate).format("MM/DD/YYYY")}
              </td>
              <td colspan="3" style={{ borderLeft: "none" }}>
                {TrackingNumber}
              </td>
            </tr>
            <tr>
              <th colspan="4" className="bg-grey">
                SHIPPER / EXPORTER
              </th>
              <th colspan="3" className="bg-grey">
                CONSIGNEE
              </th>
            </tr>
            <tr>
              <th colspan="4">COMPLETE NAME : {FromAddress.ContactName}</th>
              <th colspan="3">COMPLETE NAME : {ToAddress.ContactName}</th>
            </tr>
            <tr>
              <th colspan="4">ADDRESS </th>
              <th colspan="3">ADDRESS </th>
            </tr>

            {!CommonConfig.isEmpty(FromAddress.AddressLine1) ||
            !CommonConfig.isEmpty(FromAddress.AddressLine1) ? (
              <tr>
                <td colspan="4">{FromAddress.AddressLine1}</td>
                <td colspan="3">{ToAddress.AddressLine1}</td>
              </tr>
            ) : null}
            {!CommonConfig.isEmpty(FromAddress.AddressLine2) ||
            !CommonConfig.isEmpty(FromAddress.AddressLine2) ? (
              <tr>
                <td colspan="4">{FromAddress.AddressLine2}</td>
                <td colspan="3">{ToAddress.AddressLine2}</td>
              </tr>
            ) : null}

            {!CommonConfig.isEmpty(FromAddress.AddressLine3) ||
            !CommonConfig.isEmpty(FromAddress.AddressLine3) ? (
              <tr>
                <td colspan="4">{FromAddress.AddressLine3}</td>
                <td colspan="3">{ToAddress.AddressLine3}</td>
              </tr>
            ) : null}
            <tr>
              <td colspan="4">
                {FromAddress.City},{FromAddress.State}-{FromAddress.ZipCode},
                {FromCountryName}
              </td>
              <td colspan="3">
                {ToAddress.City},{ToAddress.State}-{ToAddress.ZipCode},
                {ToCountryName}
              </td>
            </tr>
            <tr>
              <th colspan="4" className="bg-grey">
                CONTACT NUMBER : {FromAddress.Phone1}
              </th>
              <th colspan="3" className="bg-grey">
                CONTACT NUMBER : {ToAddress.Phone1}
              </th>
            </tr>
            <tr>
              <th colspan="4" className="bg-grey">
                EMAIL ID{" "}
              </th>
              <th colspan="3" className="bg-grey">
                EMAIL ID{" "}
              </th>
            </tr>
            <tr>
              <td colspan="4" style={{ borderRight: "none" }}>
                {FromAddress.Email}
              </td>
              <td colspan="3" style={{ borderLeft: "none" }}>
                {ToAddress.Email}
              </td>
            </tr>
            <tr>
              <th colspan="4" className="bg-grey">
                COUNTRY OF EXPORT{" "}
              </th>
              <th colspan="3" className="bg-grey">
                IMPORTER IF OTHER THAN CONSIGNEE
              </th>
            </tr>
            <tr>
              <td colspan="4">{FromCountryName}</td>
              <td colspan="3" rowspan="3"></td>
            </tr>
            <tr>
              <th colspan="4" className="bg-grey">
                COUNTRY OF ORIGIN OF GOODS{" "}
              </th>
            </tr>
            <tr>
              <td colspan="4">{FromCountryName}</td>
            </tr>
            <tr>
              <th colspan="4" className="bg-grey">
                COUNTRY OF ULTIMATE DESTINATION{" "}
              </th>
              <th colspan="3" className="bg-grey">
                {this.state.ServiceName} INTERNATIONAL AWB NO
              </th>
            </tr>
            <tr>
              <td colspan="4">{ToCountryName}</td>
              <td colspan="3">
                <select
                  value={this.state.CurrentTrackingNumber}
                  onChange={(e) => this.trackingNumberChange(e)}
                >
                  <option value="">Select Tracking Number</option>
                  {this.renderTrackingNumber()}
                </select>
              </td>
            </tr>
            <tr>
              <th className="left bg-grey">Mark No.</th>
              <th className="left bg-grey">No. of Packages </th>
              <th className="left bg-grey">Complete desc.of Goods</th>
              <th className="left bg-grey">Quantity</th>
              <th className="left bg-grey" style={{ maxWidth: 42 }}>
                Unit Value
              </th>
              <th className="left bg-grey" style={{ width: "15%" }}>
                Total Value
              </th>
              <th className="left bg-grey">Currency USD/Dest</th>
            </tr>

            {this.renderCommercial()}
            <tr>
              <td rowspan="2"></td>
              <td className="bg-grey">Total No. of Packages</td>
              <td rowspan="2" colspan="3"></td>
              <td className="bg-grey" style={{ width: 42 }}>
                Total Value
              </td>
              <td className="bg-grey">Total Currency</td>
            </tr>
            <tr>
              <td className="bg-grey">{this.state.MaxPackageNumber}</td>
              <td className="bg-grey">${TotalCost}</td>
              <td className="bg-grey">USD</td>
            </tr>
            <tr>
              <td colspan="6">
                I DECLARE ALL THE INFORMATION CONTAINED IN THIS INVOICE TO BE
                TRUE AND CORRECT.
              </td>
              <td>Check One</td>
            </tr>
            <tr>
              <td colspan="6" style={{ borderBottom: "none" }}></td>
              <td>F.O.B</td>
            </tr>
            <tr>
              <td
                colspan="6"
                style={{ borderTop: "none", borderBottom: "none" }}
              ></td>
              <td>C&amp;F</td>
            </tr>
            <tr>
              <td rowspan="2" style={{ borderTop: "none" }} colspan="6"></td>
              <td>C.I.F</td>
            </tr>
            <tr>
              <td style={{ borderTop: "none" }}></td>
            </tr>
            <tr>
              <th colspan="6">
                SIGNATURE OF SHIPPER (Name, Title &amp; Signature)
              </th>
              <th>DATE</th>
            </tr>
          </table>
        </div>
        <div>
          {/* <Button onClick={() => this.printDocument()}>Print</Button> */}
        </div>
      </div>
    );
  }
}

export default PrintCommercialInvoice;
