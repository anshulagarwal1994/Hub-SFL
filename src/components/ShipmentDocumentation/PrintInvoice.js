import React from "react";
import PropTypes from "prop-types";
// core components
import withStyles from "@material-ui/core/styles/withStyles";
import moment from "moment";
import { CommonConfig } from "../../utils/constant";
import SFLlogo from "../../assets/img/SFL_logo.png";
import cogoToast from "cogo-toast";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import api from "../../utils/apiClient";
const ref = React.createRef();

class PrintInvoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Invoicedata: [],
      FromAddress: {},
      ToAddress: {},
      TrackingNumber: "",
      ShipmentType: "",
      FromCountryName: "",
      ToCountryName: "",
      BookingDate: "",
      TotalCost: 0,
      InvoiceDate: "",
      InvoiceDueDate: "",
      TotalReceivedCost: 0,
      DatePaidOn: "",
      ShippingID: "",
    };
  }

  async componentDidMount() {
    let data = JSON.parse(localStorage.getItem("printInvoice"));
    this.setState({
      propData: data,
      FromAddress: data.FromAddress.AddressDetail,
      ShipmentType: data.FromAddress.AddressDetail.ShipmentType,
      FromCountryName: data.FromAddress.CountryName,
      DocumentManagedBy: data.DocumentManagedBy,
      BookingDate: data.FromAddress.AddressDetail.ShipmentDate,
      ToAddress: data.ToAddress.AddressDetail,
      ToCountryName: data.ToAddress.CountryName,
      TrackingNumber: data.TrackingNumber,
      TotalReceivedCost: data.TotalReceivedCost,
      DatePaidOn: data.DatePaidOn,
      ShippingID: data.ShippingID,
      GeneratePDF: data.GeneratePDF,
      InvoiceDueDate: data.DocumentInvoiceDueDate,
    });
    data.InvoiceData.sort(function(a, b) {
      return new Date(b.InvoiceDate) - new Date(a.InvoiceDate);
    });
    let totalCost = 0;
    let invoiceDate = "";
    for (var i = 0; i < data.InvoiceData.length; i++) {
      totalCost = data.InvoiceData[i].TotalAmount + totalCost;
      invoiceDate = data.InvoiceData[0].InvoiceDate;
      var date = new Date(invoiceDate);
      date.setDate(date.getDate() + 7);
    }
    if (data.InvoiceData.length < 10) {
      let diff = 10 - data.InvoiceData.length;
      for (var j = 0; j < diff; j++) {
        var invoiceObj = {
          ServiceDescription: "",
          Quantity: "",
          Amount: "",
          TotalAmount: "",
          Index: "",
        };
        data.InvoiceData.push(invoiceObj);
      }
    }
    this.setState({
      TotalCost: totalCost,
      Invoicedata: data.InvoiceData,
      InvoiceDate: invoiceDate,
      // InvoiceDueDate : date
    });
  }

  renderInvoice = () => {
    return this.state.Invoicedata.map((invoice, idx) => {
      return (
        <tr>
          <td>
            {invoice.ServiceDescription}
            {invoice.Description ? " - " + invoice.Description : ""}
          </td>
          {/* <td>{invoice.Description}</td> */}
          <td className="right">{invoice.Quantity}</td>
          <td className="right">
            {invoice.Amount ? "$" : null}
            {invoice.Amount}
          </td>
          <td className="right">
            {invoice.TotalAmount ? "$" : null}
            {invoice.TotalAmount
              ? parseFloat(invoice.TotalAmount).toFixed(2)
              : null}
          </td>
        </tr>
      );
    });
  };

  generatePDF = () => {
    var input = document.getElementById("invoiceTable");
    html2canvas(input).then((canvas) => {
      var options = {
        compressPdf: true,
      };
      var pdf = new jsPDF(options);
      var imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "JPEG", -2.4, 0);
      var doc = btoa(pdf.output());
      let data = {
        dateTime: new Date().getTime(),
        ShippingID: this.state.ShippingID,
        pdfBase64: doc,
      };
      api
        .post("scheduleshipment/DownloadInvoice", data)
        .then((res) => {
          if (res.success) {
            cogoToast.success("Invoice Generated");
          } else {
            cogoToast.error("Invoice Generation Error");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      // pdf.save('download.pdf');
    });
  };

  render() {
    const {
      FromAddress,
      ShipmentType,
      TotalReceivedCost,
      FromCountryName,
      InvoiceDate,
      TotalCost,
      DocumentManagedBy,
      DatePaidOn,
      ToAddress,
      InvoiceDueDate,
      ToCountryName,
      TrackingNumber,
      BookingDate,
    } = this.state;
    return (
      <div>
        <div class="book" id="PrintInvoice">
          <div class="page" id="printInvoice">
            <table ref={ref} className="invoice-table" id="invoiceTable">
              <tr>
                <td style={{ width: "50%" }}>
                  <img src={SFLlogo} alt="SFL" />
                </td>
                <td style={{ width: "50%" }} className="right">
                  SFL Worldwide LLC<br></br>
                  3364 Garden Brook Drive, Farmers Branch, TX 75234<br></br>
                  Phone: 972-255-7447 | Fax : 1-888-609-0778
                </td>
              </tr>
              <tr>
                <td colspan="2" className="center">
                  <h3>INVOICE</h3>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <table className="invoice-table-inner">
                    <tr>
                      <td rowspan="2" style={{ width: "50%" }}>
                        <b>From:</b> {FromAddress.ContactName}
                        <br />
                        {FromAddress.AddressLine1}
                        {!CommonConfig.isEmpty(FromAddress.AddressLine2)
                          ? ","
                          : ""}
                        {FromAddress.AddressLine2}
                        {!CommonConfig.isEmpty(FromAddress.AddressLine3)
                          ? ","
                          : ""}
                        {FromAddress.AddressLine3}
                        <br />
                        {FromAddress.City}, {FromAddress.State} -{" "}
                        {FromAddress.ZipCode}, {FromCountryName}
                        <br />
                        {FromAddress.Phone1}
                        {!CommonConfig.isEmpty(FromAddress.Phone2) ? "," : ""}
                        {FromAddress.Phone2}
                      </td>
                      <td>
                        Invoice Number<br></br>
                        <b>{TrackingNumber}</b>
                      </td>
                      <td>
                        Invoice Date<br></br>
                        <b>{moment(InvoiceDate).format("MM/DD/YYYY")}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Tracking Number<br></br>
                        <b>{TrackingNumber}</b>
                      </td>
                      <td>
                        Booking Date<br></br>
                        <b>{moment(BookingDate).format("MM/DD/YYYY")}</b>
                      </td>
                    </tr>
                    <tr>
                      <td rowspan="2">
                        <b>To:</b> {ToAddress.ContactName}
                        <br />
                        {ToAddress.AddressLine1}
                        {!CommonConfig.isEmpty(ToAddress.AddressLine2)
                          ? ","
                          : ""}
                        {ToAddress.AddressLine2}
                        {!CommonConfig.isEmpty(ToAddress.AddressLine3)
                          ? ","
                          : ""}
                        {ToAddress.AddressLine3}
                        <br />
                        {ToAddress.City}, {ToAddress.State} -{" "}
                        {ToAddress.ZipCode}, {ToCountryName}
                        <br />
                        {ToAddress.Phone1}
                        {!CommonConfig.isEmpty(ToAddress.Phone2) ? "," : ""}
                        {ToAddress.Phone2}
                      </td>
                      <td>
                        Mode of Shipment<br></br>
                        <b>{ShipmentType}</b>
                      </td>
                      <td>
                        Invoice Due Date<br></br>
                        <b>{moment(InvoiceDueDate).format("MM/DD/YYYY")}</b>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        Sales Representative<br></br>
                        <b>{DocumentManagedBy}</b>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <table className="invoice-table-inner">
                    <tr>
                      <th style={{ width: "60%", textAlign: "left" }}>
                        Service Type - Description
                      </th>
                      {/* <th className="right">Description</th> */}
                      <th className="right">Quantity</th>
                      <th className="right">Cost</th>
                      <th className="right">Total Cost</th>
                    </tr>
                    {this.renderInvoice()}
                    <tr>
                      <th className="right" colspan="3">
                        Gross Amount :
                      </th>
                      <th className="right">
                        $ {parseFloat(TotalCost).toFixed(2)}
                      </th>
                    </tr>
                    <tr>
                      <th className="right" colspan="3">
                        Paid on{" "}
                        {DatePaidOn
                          ? moment(DatePaidOn).format(
                              CommonConfig.dateFormat.dateOnly
                            )
                          : ""}
                        :
                      </th>
                      <th className="right">
                        $ {parseFloat(TotalReceivedCost).toFixed(2)}
                      </th>
                    </tr>
                    <tr>
                      <th className="right" colspan="3">
                        Balance :
                      </th>
                      <th className="right">
                        $ {parseFloat(TotalCost - TotalReceivedCost).toFixed(2)}
                      </th>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <table className="invoice-table-inner">
                    <tr>
                      <td>
                        <b>Payment Terms</b>: All charges, as above must be paid
                        by check or wire transfer within seven days from the
                        receipt of our trade invoice after pickup of your
                        shipment. Credit Card will be only accepted for payment
                        under $500.00 and credit card fees will be charged at 3%
                        if payment is being made by Credit Card. If payment is
                        not made by due date late fees of $35.00 and interest of
                        14.99 % per annum will be applied.<br></br>
                        <br></br>
                        {/* Payment should be mailed at below address<br></br><br></br>
                                                    SFL Worldwide LLc<br></br><br></br>
                                                    3364 Garden Brook Drive, Farmers Branch, TX 75234, United States<br></br><br></br>
                                                    Thanks<br></br>
                                                    SFL Worldwide */}
                        <b>Method of Payment</b>
                        <br />
                        <br />
                        <table
                          className="invoice-table-inner"
                          style={{ marginBottom: "10px" }}
                        >
                          <tr>
                            <th style={{ textAlign: "left" }}>Zelle Payment</th>
                            <th style={{ textAlign: "left" }}>
                              Bank (ACH) Payment
                            </th>
                            <th style={{ textAlign: "left" }}>
                              Credit Card Payment
                            </th>
                            <th style={{ textAlign: "left" }}>Pay by Mail</th>
                          </tr>
                          <tr>
                            <td style={{ width: "31%" }}>
                              Zelle payment is fast, safe and secure free bank
                              to bank transfer via your email or phone number..
                              <br />
                              <br />
                              Zelle Email:{" "}
                              <a href="mailto:contact@sflworldwide.com">
                                contact@sflworldwide.com
                              </a>
                              <br />
                              Zelle Name: SFL Worldwide LLC
                              <br />
                              <b>
                                <span style={{ color: "red" }}>
                                  Please mention tracking number in memo field.{" "}
                                </span>
                              </b>
                            </td>
                            <td style={{ width: "23%" }}>
                              ACH payment is safe, secure and free electronic
                              bank-to-bank payment authorized in USA.
                              <br />
                              <br />
                              <a href="https://www.sflworldwide.com/pay">
                                www.sflworldwide.com/pay
                              </a>
                            </td>
                            <td style={{ width: "23%" }}>
                              On type and value of shipment; credit card fees
                              may be applied on credit card payments.
                              <br />
                              <br />
                              <a href="https://www.sflworldwide.com/pay">
                                www.sflworldwide.com/pay
                              </a>
                            </td>
                            <td style={{ width: "23%" }}>
                              Below our registered address to mail physical
                              check for your shipment.
                              <br />
                              <br />
                              SFL Worldwide LLC
                              <br />
                              3364 Garden Brook Drive
                              <br />
                              Farmers Branch TX 75063
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Subject To Texas - United States Jurisdiction<br></br>
                        contact@SFLWorldwide.com | www.SFLWorldwide.com | SFL
                        WORLDWIDE LLC | FMC Licence No.: 025184
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div></div>
      </div>
    );
  }
}
PrintInvoice.propTypes = {
  classes: PropTypes.object,
};

export default withStyles()(PrintInvoice);
