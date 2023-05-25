import React from "react";
import PropTypes from "prop-types";
// core components
import withStyles from "@material-ui/core/styles/withStyles";
import { CommonConfig } from "../../utils/constant";

import api from "../../utils/apiClient";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";

import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import { makeStyles } from "@material-ui/core/styles";

import SimpleBackdrop from "../../utils/general";

const useStyles = () => makeStyles(styles);
const classes = useStyles();

class esign_employee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Invoicedata: [],
      InvoicePaydata: [],
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
      Service: "",
      Mode: "",
      TotalInvoiceAmount: 0,
      totalCFT: 0,
      insurancevalue: "Not Applicable",
      Loading: false,
      InsuranceList: [
        { value: "Not Applicable", label: "Not Applicable" },
        { value: "Mover’s Liability", label: "Mover’s Liability" },
        { value: "All Risk Policy 1", label: "All Risk Policy 1" },
        { value: "All Risk Policy 2", label: "All Risk Policy 2" },
      ],
      In_ExSelectList: [
        { value: "Inclusions", label: "Inclusions" },
        { value: "Exclusions", label: "Exclusions" },
        { value: "Not Applicable", label: "Not Applicable" },
      ],
      In_ExList: [
        { value: "Door pickup", label: "Door pickup" },
        { value: "Lift gate truck charges", label: "Lift gate truck charges" },
        { value: "Trucking to warehouse", label: "Trucking to warehouse" },
        {
          value: "Basic export import custom clearance",
          label: "Basic export import custom clearance",
        },
        {
          value: "Ocean freight from warehouse to destination port",
          label: "Ocean freight from warehouse to destination port",
        },
        {
          value: "Port to Port transportation charges",
          label: "Port to Port transportation charges",
        },
        {
          value: "Preparation of overseas shipping documentations",
          label: "Preparation of overseas shipping documentations",
        },
        {
          value: "Indian customs filling and documentations",
          label: "Indian customs filling and documentations",
        },
        {
          value:
            "De-stuffing, opening and repacking during customs inspections, single strapping on each box after customs examinations and loading, concur charges",
          label:
            "De-stuffing, opening and repacking during customs inspections, single strapping on each box after customs examinations and loading, concur charges",
        },
        {
          value: "Unloading up to 2nd floor or above with elevator access",
          label: "Unloading up to 2nd floor or above with elevator access",
        },
        { value: "Delivery to residence", label: "Delivery to residence" },

        {
          value: "Overweight or oversize charges.",
          label: "Overweight or oversize charges.",
        },
        {
          value: "Abnormal access / Parking Permits",
          label: "Abnormal access / Parking Permits",
        },
        {
          value: "Port Charges, Union Charges and D.O. Charges at Destination",
          label: "Port Charges, Union Charges and D.O. Charges at Destination",
        },
        {
          value: "Custom Duties, Taxes and Octroi Charges at Destination.",
          label: "Custom Duties, Taxes and Octroi Charges at Destination.",
        },
        {
          value: "Stair carry / Long carry",
          label: "Stair carry / Long carry",
        },
        {
          value: "Demurrage and Detention charges",
          label: "Demurrage and Detention charges",
        },
        {
          value: "Split pickup and Delivery charges",
          label: "Split pickup and Delivery charges",
        },
        {
          value: "Crating Piano and Pool table handling charges",
          label: "Crating Piano and Pool table handling charges",
        },
        {
          value: "Storage at Origin or Destination",
          label: "Storage at Origin or Destination",
        },
        {
          value: "Palletizing fees at $45.00 per pallet",
          label: "Palletizing fees at $45.00 per pallet",
        },
        {
          value:
            "Palletizing is done for the protection of your cargo and adds 20% to 30% the volume of your shipment, please factor this in your calculation, cannot be estimated until actual measurement is done",
          label:
            "Palletizing is done for the protection of your cargo and adds 20% to 30% the volume of your shipment, please factor this in your calculation, cannot be estimated until actual measurement is done",
        },
        {
          value: "Packing Material at Cost",
          label: "Packing Material at Cost",
        },
        {
          value: "AES Filing cost $ 90.00 if value of goods are above $2500.00",
          label: "AES Filing cost $ 90.00 if value of goods are above $2500.00",
        },
      ],
      In_ExValue: [
        "Inclusions",
        "Inclusions",
        "Inclusions",
        "Inclusions",
        "Inclusions",
        "Inclusions",
        "Inclusions",
        "Inclusions",
        "Inclusions",
        "Inclusions",
        "Inclusions",
        "Exclusions",
        "Exclusions",
        "Exclusions",
        "Exclusions",
        "Exclusions",
        "Exclusions",
        "Exclusions",
        "Exclusions",
        "Exclusions",
        "Exclusions",
        "Exclusions",
        "Exclusions",
        "Exclusions",
      ],
      isSubmitClick: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isSubmitClick) {
      this.handlesave();
    }
  }

  async componentDidMount() {
    let totalCost = 0;
    for (var i = 0; i < this.props.InvoiceData.length; i++) {
      totalCost = this.props.InvoiceData[i].TotalAmount + totalCost;
    }
    let totalCFT = 0;
    for (var i = 0; i < this.props.shipmentstatusList.PackageList.length; i++) {
      totalCFT = this.props.shipmentstatusList.PackageList[i].CFT + totalCFT;
    }
    this.setState({
      propData: this.props,
      FromAddress: this.props.FromAddress.AddressDetail,
      ShipmentType: this.props.FromAddress.AddressDetail.ShipmentType,
      FromCountryName: this.props.FromAddress.CountryName,
      DocumentManagedBy: this.props.DocumentManagedBy,
      BookingDate: this.props.FromAddress.AddressDetail.ShipmentDate,
      ToAddress: this.props.ToAddress.AddressDetail,
      ToCountryName: this.props.ToAddress.CountryName,
      TrackingNumber: this.props.TrackingNumber,
      TotalReceivedCost: this.props.TotalReceivedCost,
      DatePaidOn: this.props.DatePaidOn,
      ShippingID: this.props.ShippingID,
      Service: this.props.shipmentstatusList.SubServiceName.value,
      Mode: this.props.shipmentstatusList.ShipmentType.value,
      InvoicePaydata: this.props.InvoiceData,
      TotalInvoiceAmount: totalCost,
      totalCFT: totalCFT,
      isSubmitClick: this.props.isSubmitClick,
    });
  }

  handleChangeinsurancevalue = (event) => {
    const { value } = event.target;
    if (value !== null) {
      this.setState({ insurancevalue: value.value });
    }
  };

  renderInsurancelist = () => {
    return this.state.InsuranceList.map((content) => {
      return (
        <MenuItem
          classes={{ root: classes.selectMenuItem }}
          value={content.value}
        >
          {" "}
          {content.label}{" "}
        </MenuItem>
      );
    });
  };

  renderIn_ExSelectList = () => {
    return this.state.In_ExSelectList.map((content) => {
      return (
        <MenuItem
          classes={{ root: classes.selectMenuItem }}
          value={content.value}
        >
          {" "}
          {content.label}{" "}
        </MenuItem>
      );
    });
  };

  ListOfIn_EX = (type) => {
    return this.state.In_ExList.map((content, idx) => {
      if (this.state.In_ExValue[idx] == type) {
        return (
          <div>
            <li style={{ height: "60px", float: "left", width: "70%" }}>
              {content.label}
            </li>
            <FormControl
              style={{ height: "60px", float: "right", width: "30%" }}
              className={classes.formControl}
              fullWidth
            >
              <Select
                id="package_number"
                name="package_number"
                value={this.state.In_ExValue[idx]}
                className="form-control"
                onChange={(event) => this.handleChangeIn_Exvalue(event, idx)}
              >
                {this.renderIn_ExSelectList()}
              </Select>
            </FormControl>
          </div>
        );
      }
    });
  };

  handleChangeIn_Exvalue = (event, index) => {
    const { value } = event.target;
    const PackageList = this.state.In_ExValue;
    if (value !== null) {
      PackageList[index] = value;
    }
    this.setState({ In_ExValue: PackageList });
  };

  ValueOfIn_EX = (type) => {
    return this.state.In_ExValue.map((content, idx) => {
      if (content == type) {
        return (
          <div
            className="package-select table-select small"
            style={{ height: "40px", width: "100%" }}
          >
            <FormControl className={classes.formControl} fullWidth>
              <Select
                id="package_number"
                name="package_number"
                value={content}
                className="form-control"
                onChange={(event) => this.handleChangeIn_Exvalue(event, idx)}
              >
                {this.renderIn_ExSelectList()}
              </Select>
            </FormControl>
          </div>
        );
      }
    });
  };

  renderInvoice = () => {
    return this.state.InvoicePaydata.map((invoice, idx) => {
      return (
        <tr>
          <td
            style={{
              border: "1px solid #000",
              padding: "5px",
              width: "20px",
              textAlign: "center",
            }}
          >
            {idx + 1}.
          </td>
          <td style={{ border: "1px solid #000", padding: "5px" }}>
            {invoice.ServiceDescription}
            {invoice.Description ? " - " + invoice.Description : ""}
          </td>
          <td
            style={{
              border: "1px solid #000",
              padding: "5px",
              textAlign: "right",
              width: "170px",
            }}
          >
            {invoice.TotalAmount ? "$" : null}
            {invoice.TotalAmount
              ? parseFloat(invoice.TotalAmount).toFixed(2)
              : null}
          </td>
        </tr>
      );
    });
  };

  handlesave = () => {
    try {
      this.showLoader();
      var data = {
        ShippingID: this.props.ShippingID,
        TrackingNumber: this.state.TrackingNumber,
        UserID: CommonConfig.loggedInUserData().PersonID,
        In_ExList: this.state.In_ExList,
        In_ExValue: this.state.In_ExValue,
      };
      api
        .post("scheduleshipment/GenerateContractOcean", data)
        .then((res) => {
          this.hideLoader();
          if (res.success) {
            if (res.data.message) {
              this.props.generatePath(res.data.message.AttachmentPath);
            }
          }
        })
        .catch((err) => {
          this.hideLoader();
          console.log(err);
        });
    } catch (error) {
      this.hideLoader();
      console.log(error);
    }
  };

  showLoader() {
    this.setState({ Loading: true });
  }

  hideLoader() {
    this.setState({ Loading: false });
  }

  render() {
    const {
      FromAddress,
      ShipmentType,
      FromCountryName,
      DocumentManagedBy,
      Service,
      Mode,
      InvoicePaydata,
      ToAddress,
      ToCountryName,
      TrackingNumber,
      TotalInvoiceAmount,
    } = this.state;
    return (
      <div className="esign-employee-table">
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
        <table style={{ width: "100%", marginTop: "30px" }}>
          <tr>
            <td
              colspan="4"
              style={{
                border: "1px solid #000",
                textAlign: "center",
                padding: "5px",
                fontSize: "15px",
                fontWeight: "bold",
                color: "#fff",
                background: "#002060",
              }}
            >
              Contract for Overseas Relocation Services (LCL)
            </td>
          </tr>
          <tr>
            <td
              style={{ border: "1px solid #000", width: "20%", padding: "5px" }}
            >
              <b>Customer Name</b>
            </td>
            <td
              style={{ border: "1px solid #000", width: "30%", padding: "5px" }}
            >
              {FromAddress.ContactName}
            </td>
            <td
              style={{
                border: "1px solid #000",
                width: "20%",
                padding: "5px",
                textAlign: "right",
              }}
            >
              <b>Quote Ref.:</b>
            </td>
            <td
              style={{ border: "1px solid #000", width: "30%", padding: "5px" }}
            >
              {TrackingNumber}
            </td>
          </tr>
          <tr>
            <td
              style={{ border: "1px solid #000", width: "20%", padding: "5px" }}
            >
              <b>Origin City:</b>
            </td>
            <td
              style={{ border: "1px solid #000", width: "30%", padding: "5px" }}
            >
              {FromAddress.City}, {FromAddress.State} - {FromAddress.ZipCode},{" "}
              {FromCountryName}
            </td>
            <td
              style={{
                border: "1px solid #000",
                width: "20%",
                padding: "5px",
                textAlign: "right",
              }}
            >
              <b>Delivery City:</b>
            </td>
            <td
              style={{ border: "1px solid #000", width: "30%", padding: "5px" }}
            >
              {ToAddress.City}, {ToAddress.State} - {ToAddress.ZipCode},{" "}
              {ToCountryName}
            </td>
          </tr>
          <tr>
            <td
              style={{ border: "1px solid #000", width: "20%", padding: "5px" }}
            >
              <b>Phone:</b>
            </td>
            <td
              style={{ border: "1px solid #000", width: "30%", padding: "5px" }}
            >
              {FromAddress.Phone1}
              {!CommonConfig.isEmpty(FromAddress.Phone2) ? "," : ""}
              {FromAddress.Phone2}
            </td>
            <td
              style={{
                border: "1px solid #000",
                width: "20%",
                padding: "5px",
                textAlign: "right",
              }}
            >
              <b>Email Id:</b>
            </td>
            <td
              style={{ border: "1px solid #000", width: "30%", padding: "5px" }}
            >
              <a href="#">{FromAddress.Email}</a>
            </td>
          </tr>
          <tr>
            <td
              style={{ border: "1px solid #000", width: "20%", padding: "5px" }}
            >
              <b>Est. Volume</b>
            </td>
            <td
              style={{ border: "1px solid #000", width: "30%", padding: "5px" }}
            >
              {this.state.totalCFT}
            </td>
            <td
              style={{
                border: "1px solid #000",
                width: "20%",
                padding: "5px",
                textAlign: "right",
              }}
            >
              <b>Tracking No.</b>
            </td>
            <td
              style={{ border: "1px solid #000", width: "30%", padding: "5px" }}
            >
              {TrackingNumber}
            </td>
          </tr>
          <tr>
            <td
              style={{ border: "1px solid #000", width: "20%", padding: "5px" }}
            >
              <b>Commodity</b>
            </td>
            <td
              style={{ border: "1px solid #000", width: "30%", padding: "5px" }}
            >
              HHG
            </td>
            <td
              style={{
                border: "1px solid #000",
                width: "20%",
                padding: "5px",
                textAlign: "right",
              }}
            >
              <b>Mode</b>
            </td>
            <td
              style={{ border: "1px solid #000", width: "30%", padding: "5px" }}
            >
              {Mode}
            </td>
          </tr>
          <tr>
            <td
              style={{ border: "1px solid #000", width: "20%", padding: "5px" }}
            >
              <b>Service</b>
            </td>
            <td
              style={{ border: "1px solid #000", width: "30%", padding: "5px" }}
            >
              {Service}
            </td>
            <td
              style={{
                border: "1px solid #000",
                width: "20%",
                padding: "5px",
                textAlign: "right",
              }}
            >
              <b>Sales Rep.</b>
            </td>
            <td
              style={{ border: "1px solid #000", width: "30%", padding: "5px" }}
            >
              {DocumentManagedBy}
            </td>
          </tr>
        </table>

        <table style={{ width: "100%", marginTop: "20px" }}>
          <tr>
            <td
              colspan="2"
              style={{
                fontWeight: "bold",
                padding: "5px",
                border: "1px solid #000",
                background: "#ffc000",
              }}
            >
              DESCRIPTION OF SERVICES
            </td>
            <td
              style={{
                fontWeight: "bold",
                padding: "5px",
                border: "1px solid #000",
                background: "#ffc000",
                textAlign: "right",
              }}
            >
              COST (IN USD)
            </td>
          </tr>
          {this.renderInvoice()}
          <tr>
            <td
              colspan="2"
              style={{
                fontWeight: "bold",
                padding: "5px",
                border: "1px solid #000",
                background: "#ffc000",
                textAlign: "right",
              }}
            >
              TOTAL Cost:
            </td>
            <td
              style={{
                fontWeight: "bold",
                padding: "5px",
                border: "1px solid #000",
                background: "#ffc000",
                textAlign: "right",
              }}
            >
              $ {TotalInvoiceAmount}
            </td>
          </tr>
        </table>

        <table style={{ width: "100%", marginTop: "20px" }}>
          <tr>
            <td
              colspan="2"
              style={{
                border: "1px solid #000",
                textAlign: "center",
                padding: "5px",
                fontSize: "15px",
                fontWeight: "bold",
                color: "#fff",
                background: "#002060",
              }}
            >
              Best Price{" "}
              <span style={{ borderBottom: "1px solid #fff" }}>Guaranteed</span>
              . We Will Meet or Beat the Best Door to Door Rates!
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontWeight: "bold",
                padding: "5px",
                border: "1px solid #000",
                background: "#ffc000",
                width: "50%",
              }}
            >
              Inclusions
            </td>
            <td
              style={{
                fontWeight: "bold",
                padding: "5px",
                border: "1px solid #000",
                background: "#ffc000",
                width: "50%",
              }}
            >
              Exclusions (If Applicable)
            </td>
          </tr>
          <tr>
            <td
              className="plr-20"
              style={{ width: "50%", border: "1px solid #000" }}
            >
              <ul>{this.ListOfIn_EX("Inclusions")}</ul>
            </td>
            <td
              className="plr-20"
              style={{ width: "50%", border: "1px solid #000" }}
            >
              <ul>{this.ListOfIn_EX("Exclusions")}</ul>
            </td>
          </tr>
        </table>

        <table style={{ width: "100%", marginTop: "20px" }} class="page">
          <tr>
            <td
              colspan="3"
              style={{
                border: "1px solid #000",
                textAlign: "center",
                padding: "5px",
                fontSize: "15px",
                fontWeight: "bold",
                color: "#fff",
                background: "#002060",
              }}
            >
              Insurance Options
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontWeight: "bold",
                padding: "5px",
                border: "1px solid #000",
                background: "#ffc000",
                width: "33.33%",
                textAlign: "center",
              }}
            >
              Mover’s Liability
            </td>
            <td
              style={{
                fontWeight: "bold",
                padding: "5px",
                border: "1px solid #000",
                background: "#ffc000",
                width: "33.33%",
                textAlign: "center",
              }}
            >
              Selective Risk Policy
            </td>
            <td
              style={{
                fontWeight: "bold",
                padding: "5px",
                border: "1px solid #000",
                background: "#ffc000",
                width: "33.33%",
                textAlign: "center",
              }}
            >
              All Risk Policy
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontWeight: "bold",
                border: "1px solid #000",
                padding: "5px",
                textAlign: "center",
              }}
            >
              $0 Deductible
            </td>
            <td
              style={{
                fontWeight: "bold",
                border: "1px solid #000",
                padding: "5px",
                textAlign: "center",
              }}
            >
              $250 Deductible
            </td>
            <td
              style={{
                fontWeight: "bold",
                border: "1px solid #000",
                padding: "5px",
                textAlign: "center",
              }}
            >
              $1000 Deductible
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: "1px solid #000",
                padding: "5px",
                textAlign: "center",
              }}
            >
              No premium
            </td>
            <td
              style={{
                border: "1px solid #000",
                padding: "5px",
                textAlign: "center",
              }}
            >
              5.00% premium with<br></br>a $50 minimum
            </td>
            <td
              style={{
                border: "1px solid #000",
                padding: "5px",
                textAlign: "center",
              }}
            >
              3.00% premium with<br></br>a $300 minimum
            </td>
          </tr>
          {/* <tr>
      <td style={{border: '1px solid #000', padding:'5px',textAlign: 'center'}}>Maximum Mover liability of<br></br>$0.60 per lbs. / package</td>
      <td style={{border: '1px solid #000', padding:'5px',textAlign: 'center'}}>Detailed breakup of valued<br></br>goods to be packed by MOVERS</td>
      <td style={{border: '1px solid #000', padding:'5px',textAlign: 'center'}}>Detailed breakup of valued<br></br>goods to be packed by MOVERS</td>
    </tr> */}
        </table>

        <table style={{ width: "100%", marginTop: "20px" }}>
          <tr>
            <td>
              <b>Mover’s Liability Explained:</b>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                Movers Liability provides Loss Only coverage of $0.60 Per LBS
                per article or package. Movers Liability does not provide any
                coverage on missing or damaged items not mentioned on the
                packing list.
              </p>
            </td>
          </tr>
        </table>

        <table style={{ width: "100%", marginTop: "20px" }}>
          <tr>
            <td>
              <b>Selective Risk Explained:</b>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                Under Selective Risk Insurance shipper can insurance selective
                item(s) and does not need to take insurance on entire shipment.
                Your shipment is covered against risks such as breakage, damage,
                theft, fire, earthquake, collision, accidents, etc. Shipment
                packed by owner is not covered under Selective Risk Insurance.
                If the shipment is Packed by owner and required repacking at our
                warehouse; selective risk insurance will be activated from SFL
                Worldwide warehouse once items are inspected and repacked
                professionally. Shipment will be covered at current value and
                does not cover shipping charges, packing charges, customs duty
                etc. It is shipper responsibility to review and accept terms and
                condition offered by the insurance company or selects any other
                insurance provider if needed.
              </p>
            </td>
          </tr>
        </table>

        <table style={{ width: "100%", marginTop: "20px" }}>
          <tr>
            <td>
              <b>All Risk Explained:</b>
            </td>
          </tr>
          <tr>
            <p>
              Your shipment is covered against risks such as breakage, damage,
              theft, fire, earthquake, collision, accidents, etc. Shipment
              packed by owner is not covered under All Risk Insurance. If the
              shipment is Packed by owner and required repacking at our
              warehouse; all risk insurance will be activated from SFL Worldwide
              warehouse once items are inspected and repacked professionally.
              Shipment will be covered at current value and does not cover
              shipping charges, packing charges, customs duty etc. SFL Worldwide
              will take insurance from 3rd party Insurance Company and will not
              be responsible or liable for any judgment made by the insurance
              company. It is shipper responsibility to review and accept terms
              and condition offered by the insurance company or selects any
              other insurance provider if needed.
            </p>
          </tr>
        </table>

        <table style={{ width: "100%", marginTop: "20px" }} class="page">
          <tr>
            <td
              colspan="2"
              style={{
                border: "1px solid #000",
                textAlign: "center",
                padding: "5px",
                fontSize: "15px",
                fontWeight: "bold",
                color: "#fff",
                background: " #002060",
                width: "70%",
              }}
            >
              Documents Required at Origin
            </td>
            <td
              rowspan="2"
              style={{
                border: "1px solid #000",
                textAlign: "center",
                padding: "5px",
                fontSize: "15px",
                fontWeight: "bold",
                color: "#fff",
                background: " #002060",
              }}
            >
              Documents Required at Destination
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontWeight: "bold",
                padding: "5px",
                border: "1px solid #000",
                background: "#ffc000",
              }}
            >
              Foreign Passport Holder(s)
            </td>
            <td
              style={{
                fontWeight: "bold",
                padding: "5px",
                border: "1px solid #000",
                background: "#ffc000",
              }}
            >
              Indian Passport Holder(s)
            </td>
          </tr>
          <tr>
            <td
              className="plr-10"
              style={{ border: "1px solid #000", verticalAlign: "top" }}
            >
              <ul>
                <li>
                  Scanned copy of passport photo page only (not the entire
                  passport)
                </li>
                <li>Copy of Visa / OCI / PIO card</li>
                <li>
                  Copy of EIN number / Authorization to us to apply for and
                  obtain EIN on your behalf
                </li>
                <li>Signatures on export forms that will be provided by us</li>
              </ul>
            </td>
            <td
              className="plr-10"
              style={{ border: "1px solid #000", verticalAlign: "top" }}
            >
              <ul>
                <li>
                  Scanned copy of passport photo page (not entire passport)
                </li>
                <li>Signatures on export forms that will be provided by us</li>
              </ul>
            </td>
            <td
              className="plr-10"
              style={{ border: "1px solid #000", verticalAlign: "top" }}
            >
              <ul>
                <li>Original Passport</li>
                <li>OCI / PIO Card, if holding foreign passport</li>
                <li>Signature on Customs forms that will be provided by us</li>
              </ul>
            </td>
          </tr>
        </table>

        <table style={{ width: "100%", marginTop: "20px" }}>
          <tr>
            <td>
              <b>
                Shipper's presence in India when the shipment reaches is
                mandatory. If the shipper has not arrived into India or has to
                travel out again when the shipment reaches, we cannot clear it
                and additional charges may incur. We would need Original
                Passport along with Customer's Signatures on Custom
                Documentation which will be provided by SFL Worldwide as without
                this document we won't able to clear shipment from customs and
                additional charges will incur which SFL Worldwide will not be
                liable for.
              </b>
            </td>
          </tr>
          <tr>
            <td style={{ paddingTop: "20px" }}>
              <b>Transit Times:</b> SFL Worldwide is only liable for loss of
              entire package or article that is expressly stated in the
              household goods descriptive inventory and may occur while your
              shipment is in our physical possession. Our maximum liability for
              such loss is limited to an amount not exceeding $0.60 per pound
              package. SFL Worldwide will not be liable for any damage or
              missing content inside any package or article. Our liability only
              covers if entire box/package/article is missing. We are not liable
              for loss or damage that may occur after the shipment leaves our
              physical possession.
            </td>
          </tr>
          <tr>
            <td style={{ paddingTop: "20px" }}>
              <b>Our Liability:</b> SFL Worldwide is only liable for loss of
              entire package or article that is expressly stated in the
              household goods descriptive inventory and may occur while your
              shipment is in our physical possession. Our maximum liability for
              such loss is limited to an amount not exceeding $0.60 per pound
              package. SFL Worldwide will not be liable for any damage or
              missing content inside any package or article. Our liability only
              covers if entire box/package/article is missing. We are not liable
              for loss or damage that may occur after the shipment leaves our
              physical possession.
              <br></br>
              An optional extended protection plan for your household goods,
              personal effects and automobiles moving by land, sea and/or air is
              available subject to your application, acceptance, payment of
              premiums and compliance with the terms and conditions of our 3rd
              party insurance underwriter at least 4 days prior to the pickup of
              your shipment. SFL Worldwide, LLC does recommend that you purchase
              an extended protection plan for your shipment.
            </td>
          </tr>
          <tr>
            <td style={{ paddingTop: "20px" }}>
              If the shipment arrives at the warehouse in damaged condition, we
              can either return shipment back to the shipper or dispose shipment
              at written confirmation from the shipper. Depending upon the
              option selected to and from shipping charges and disposal fees
              will be applied. SFL Worldwide is not liable for any damage of
              loss of the shipment arrived in damaged conditional at SFL or its
              authorized receiving center. If your shipment does not arrive
              within 3 weeks from pickup date to our warehouse or we are not
              able to trace the part or full shipment, SFL Worldwide will
              compensate under Movers Liability Converge.
            </td>
          </tr>
        </table>

        <table class="page">
          <tr>
            <td style={{ paddingTop: "20px" }}>
              <b>Quote Validity:</b> We appreciate and thank you for the
              opportunity to submit this proposal for international relocation
              services. The scope of services to be performed by SFL Worldwide
              and its agents are limited to the performance of only those
              services expressly stated in this proposal. Please note, that our
              services are entirely flexible and can be adapted to your changing
              requirements. The prices stated herein are valid for a period of
              Thirty (30) days from the date of this proposal.
            </td>
          </tr>
          <tr>
            <td style={{ paddingTop: "20px" }}>
              <b>Payment Terms:</b> All charges, as above must be paid by check
              or wire transfer within seven days from the receipt of our trade
              invoice after pickup of your shipment. Credit Card will be only
              accepted for payment under $500.00 and credit card fees will be
              charged at 3% if payment is being made by Credit Card. If payment
              is not made by due date late fees of $35.00 and interest of 14.99
              % per annum will be applied.
            </td>
          </tr>
          <tr>
            <td style={{ paddingTop: "20px" }}>
              <b>Weight Limit:</b> You are allowed to keep the weight equal to
              the dimensional weight of the box. For Example: If you are using a
              box with dimension 18x18x24 Inches, so the dimensional weight of
              this box is 56lbs therefore you can fill this box up to 56 lbs.
              Here if the actual weight exceeds the allowed limit you will be
              charged as $2/lb. for additional Lbs. If any of your box is more
              than 50lbs then there will be additional Charge of $25.00 for that
              particular box for Over Weight Charges.
              <br></br>
              Overseas shipping entails handling of cargo multiple times and
              therefore standard boxes do not have the quality or cardboard
              strength to sustain all the handling. You must buy Double Walled
              or Heavy-Duty boxes to ship your belongings which is easily
              available from Home Depot or Lowes Stores. If boxes are received
              in damaged condition to our warehouse additional $ 25.00 repacking
              charges per box will be applied to repack damaged boxes.
            </td>
          </tr>
        </table>

        {/* <table style={{ width: '100%', marginTop: "20px" }}>
          <tr>
            <td style={{ border: '1px solid #000', textAlign: 'center', padding: '5px', fontSize: '15px', fontWeight: 'bold', 'color': '#fff', background: ' #002060', width: '50%' }}>Dimensional Weight (Lbs)</td>
            <td style={{ border: '1px solid #000', textAlign: 'center', padding: '5px', fontSize: '15px', fontWeight: 'bold', 'color': '#fff', background: ' #002060', width: '50%' }}>Cubic Ft.</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', textAlign: 'center', padding: '5px' }}>
              <img style={{ maxWidth: '100%' }} src={dimensional_logo} alt="" />
            </td>
            <td style={{ border: '1px solid #000', textAlign: 'center', padding: '5px' }}>
              <img style={{ maxWidth: '100%' }} src={cubitlogo} alt="" />
            </td>
          </tr>
        </table> */}

        <table style={{ width: "100%", marginTop: "20px" }} class="page">
          <tr>
            <td
              style={{
                border: "1px solid #000",
                textAlign: "center",
                padding: "5px",
                fontSize: "15px",
                fontWeight: "bold",
                color: "#fff",
                background: " #002060",
                width: "50%",
              }}
            >
              Your rights and responsibilities
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #000" }} className="plr-20">
              <ul>
                <li>Our House Bill of Lading is the title to your cargo.</li>
                <li>
                  By signing this contract, you agree that our Household Goods
                  Descriptive Inventory is the official document that contains
                  the pickup date, delivery date, quantity and description of
                  your packages shipped and received.
                </li>
                <li>
                  You agree to denote damages to items during packing or loading
                  at the origin in our Household Goods Descriptive Inventory
                  prior to signing and dating at the origin.
                </li>
                <li>
                  You agree to denote any missing or damaged packages along with
                  your signature upon delivery of your shipment in our Household
                  Goods Descriptive Inventory prior to signing and dating at the
                  destination.
                </li>
                <li>
                  In the event that your shipment is not delivered in whole, you
                  agree to submit your claim in writing to us within 120 days
                  after pickup. We will attempt to locate your shipment within 4
                  weeks of receiving your written claim. If we are unable to
                  locate your shipment in four weeks and if you have purchased
                  an extended protection plan with us, we will file a claim with
                  the insurance company during the fifth week. If you have not
                  purchased an extended protection plan or if your claim is
                  denied by the insurance company you will be compensated per
                  Movers Liability stated above.
                </li>
                <li>
                  In the event that your shipment is delivered in part or in the
                  case of any damages, you agree to submit your claim in writing
                  to us within 7 days after delivery. You agree to denote the
                  missing / damaged packages in our Household Goods Descriptive
                  Inventory during delivery. Upon receipt of your written claim
                  and if you have purchased an All-Risk insurance extended
                  protection plan with us we will file a claim with the
                  insurance company. If you have not purchased All Risk
                  Insurance or if your insurance claim is denied by the
                  insurance company you will be compensated per Movers Liability
                  stated above.
                </li>
                <li>
                  You may address your claim to SFL Worldwide at
                  contact@sflworldwide.com or By Faxing at 1-888-609-0778
                </li>
                <li>
                  Please confirm acceptance of this proposal by signing and
                  returning this proposal along with booking deposit USD 250.00
                  so that we can lock the rates and process your booking.
                  Balance Payment is due in full upon receipt of our Invoice
                  which will be sent after pickup of your shipment.
                </li>
                <li>
                  Service provided pursuant to this NVOCC Negotiated Rate
                  Arrangement (NRA) is subject to Carrier's governing rules
                  tariff, which is accessible at www.dpiusa.com in compliance
                  with FMC Regulations as provided in 46 CFR 532.7.”
                </li>
                <li>
                  Any legal disputes will be subject to the jurisdiction of
                  Texas State Law where SFL Worldwide LLC is registered.
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: "1px solid #000",
                fontSize: "13px",
                textAlign: "center",
                fontWeight: "bold",
                padding: "15px 5px",
              }}
            >
              SFL Worldwide LLc<br></br>
              3364 Garden Brook Drive, Farmers Branch, TX - 75234<br></br>
              Website: www.SFLWorldwide.com | Fax: 888-609-0778
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: "1px solid #000",
                textAlign: "center",
                padding: "5px",
                fontSize: "15px",
                fontWeight: "bold",
                color: "#fff",
                background: " #002060",
                width: "50%",
              }}
            >
              Signature Confirmation{" "}
              <i style={{ fontWeight: "normal" }}>
                (Please sign when ready to confirm)
              </i>
              :
            </td>
          </tr>
          <tr>
            <td
              style={{
                height: "80px",
                border: "1px solid #000",
                borderWidth: "1px 1px 0 1px",
                padding: "0 10px",
              }}
            >
              <table style={{ width: "100%" }}>
                <tr>
                  <td style={{ padding: "5px 0", width: "30%" }}></td>
                  <td style={{ padding: "5px 0", width: "50%" }}></td>
                  <td style={{ padding: "5px 0", textAlign: "right" }}>
                    {DocumentManagedBy}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: "1px solid #000",
                padding: "0 10px",
                borderWidth: "0 1px 1px 1px",
              }}
            >
              <table style={{ width: "100%", borderTop: "1px solid #000" }}>
                <tr>
                  <td style={{ padding: "5px 0", width: "30%" }}>
                    Customer Signature
                  </td>
                  <td style={{ padding: "5px 0", width: "50%" }}>Date</td>
                  <td style={{ padding: "5px 0", textAlign: "right" }}>
                    Working on Proposal
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="3"
                    style={{ textAlign: "center", paddingBottom: "5px" }}
                  >
                    By signing above, you agree that they are incorporated
                    herein by reference and apply to this account.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <div>
          {/* <Button onClick={() => this.handlesave()}>Submit</Button> */}
        </div>
      </div>
    );
  }
}
esign_employee.propTypes = {
  classes: PropTypes.object,
};

export default withStyles()(esign_employee);
