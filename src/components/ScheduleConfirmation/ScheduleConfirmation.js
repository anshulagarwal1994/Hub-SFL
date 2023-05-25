import React, { Component } from "react";

// react component for creating dynamic tables
// @material-ui/icons
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import { fileBase } from "../../utils/config";
import Right from "../../assets/img/check.svg";
import error from "../../assets/img/error.svg";
import box from "../../assets/img/box-receive.png";
import downloadImage from "../../assets/img/downloadimage.svg";

class ScheduleConfirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackingNumber: "",
      from_address: {},
      to_address: {},
      packages: [],
      commercial: [],
      payment_online: {},
      payment_bank: {},
      shipments: {},
      paymentType: "",
      isPackage: true,
      showGetrate: true,
      showGetrateError: false,
      Attachments: [],
      data: {},
      FedexTrackingNumber: "",
      AttachmentsLink1: "",
      AttachmentsLink2: "",
      LableError: "",
    };
  }

  componentDidMount() {
    debugger
    if (localStorage.getItem("shipmentObj")) {
      let data = JSON.parse(localStorage.getItem("shipmentObj"));

      let attachData = data.Attachments;
      let mainLabelIndex, commInvoiceIndex;
      let attachpath = "";
      let attachPath2 = "";
      if (data.data) {
        if (attachData.length > 0 && data.data.MasterTrackingId) {
          let labelFileName =
            "Label_" + data.data.MasterTrackingId.TrackingNumber;
          mainLabelIndex = attachData.findIndex(
            (x) => x.FileName === labelFileName
          );
          commInvoiceIndex = attachData.findIndex(
            (x) => x.DocumentType === "Commercial Invoice"
          );
          if (mainLabelIndex !== -1) {
            attachpath = attachData[mainLabelIndex]["AttachmentPath"];
          } else {
            attachpath = attachData[0]["AttachmentPath"];
          }
          if (commInvoiceIndex !== -1) {
            attachPath2 = attachData[commInvoiceIndex]["path"];
          }
        }
      }

      this.setState({
        Attachments: data.Attachments,
        trackingNumber: data.trackingNumber,
        from_address: data.Second_data.from_address,
        to_address: data.Second_data.to_address,
        packages: data.Second_data.packages,
        commercial: data.Second_data.commercial,
        payment_online: data.Second_data.PaymentData[0],
        payment_bank: data.Second_data.PaymentData[0],
        paymentType: data.Second_data.paymentType,
        shipments: data.Second_data.shipments,
        isPackage:
          data.Second_data.shipments.package_type === "Documents (Under 0.5Lbs)"
            ? false
            : true,
        // showGetrate: false,
        // showGetrateError: false,
        showGetrate: data.showGetrate,
        showGetrateError: data.showGetrateError,
        data: data.data,
        FedexTrackingNumber:
          Object.keys(data.data).length !== 0
            ? data.data.success
              ? data.data.MasterTrackingId.TrackingNumber
              : ""
            : "",
        AttachmentsLink1:
          data.Attachments.length != 0 ? fileBase + attachpath : "",
        AttachmentsLink2: data.Attachments.length > 1 ? attachPath2 : "",
        LableError: Object.keys(data.data).length !== 0 ? data.data.data : "",
      });
    }
  }

  render() {
    const {
      from_address,
      to_address,
      packages,
      commercial,
      TotalCommercialvalue,
      paymentType,
      payment_online,
      payment_bank,
      shipments,
      FedexTrackingNumber,
      AttachmentsLink1,
      AttachmentsLink2,
      LableError,
    } = this.state;

    return (
      <GridContainer>
        <div className="sc-shipment-outer">
          <div className="scs-header">
            <GridContainer>
              <GridItem md="6">
                <div className="scs-headerinner">
                  <h4>SHIPMENT SCHEDULED SUCCESSFULLY </h4>
                  <p>TRACKING NUMBER</p>
                  <span>{this.state.trackingNumber}</span>
                  {/* <span>Thank you for scheduling your shipment with SFL Worldwide.</span> */}
                </div>
              </GridItem>
              <GridItem md="6">
                <div className="ssc-header-img">
                  <img style={{ textAlign: "center" }} src={Right} alt="SFL" />
                </div>
              </GridItem>
            </GridContainer>
          </div>
          <div className="scs-content">
            <h3>Thank you for scheduling your shipment with SFL Worldwide.</h3>
            <GridContainer>
              <GridItem md="6">
                <div className="scs-table">
                  <p>
                    <span>
                      <i className="fa fa-user"></i>Sender Name:
                    </span>
                    <i>{from_address.contact_name}</i>
                  </p>
                  {this.state.showGetrate ? (
                    <p>
                      <span>
                        <i class="fa fa-ship" aria-hidden="true"></i>Shipment
                        Type:
                      </span>
                      <i>{shipments.shipment_type}</i>
                    </p>
                  ) : (
                    <p>
                      <span>
                        <i class="fa fa-truck" aria-hidden="true"></i>Tracking
                        Number:
                      </span>
                      <i>{this.state.trackingNumber}</i>
                    </p>
                  )}
                  {this.state.showGetrate ? (
                    <p>
                      <span>
                        <i class="fa fa-truck" aria-hidden="true"></i>SFL
                        Number:
                      </span>
                      <i>{this.state.trackingNumber}</i>
                    </p>
                  ) : null}
                </div>
              </GridItem>
              <GridItem md="6">
                <div className="scs-table">
                  <p>
                    <span>
                      <i className="fa fa-user"></i>Recipient Name:
                    </span>
                    <i>{to_address.contact_name}</i>
                  </p>
                  {this.state.showGetrate ? (
                    <p>
                      <span>
                        <i class="fa fa-ship" aria-hidden="true"></i>Service:
                      </span>
                      <i>{shipments.ServiceName}</i>
                    </p>
                  ) : (
                    <p>
                      <span>
                        <i class="fa fa-truck" aria-hidden="true"></i>Shipment
                        Type:
                      </span>
                      <i>{shipments.shipment_type}</i>
                    </p>
                  )}
                  {this.state.showGetrate ? (
                    <p>
                      <span>
                        <i class="fa fa-truck" aria-hidden="true"></i>FedEx
                        Number:
                      </span>
                      <i>{FedexTrackingNumber}</i>
                    </p>
                  ) : null}
                </div>
              </GridItem>
            </GridContainer>
          </div>
          {this.state.showGetrate ? (
            this.state.showGetrateError ? (
              <div className="scs-error">
                <GridContainer>
                  <GridItem md="3">
                    <div className="scs-error-img">
                      <img src={error} alt="SFL" />
                    </div>
                  </GridItem>
                  <GridItem md="9">
                    <div className="scs-error-inner">
                      <h3>Error</h3>
                      <h5>Generating Shipping Label</h5>
                      <p>
                        Sorry we have encountered error in generating FedEx
                        shipping label; please contact your sales representative
                        or contact our office at 1-800-691-2335 for further
                        assistance.
                      </p>
                      {/* <h5><b>Error Code:</b> AS6534124</h5> */}
                      <h5>Error Message:</h5>
                      <p>{LableError}</p>
                    </div>
                  </GridItem>
                </GridContainer>
              </div>
            ) : (
              <div className="scs-download">
                <GridContainer>
                  <GridItem md="6">
                    <div className="scs-download-img">
                      <img src={downloadImage} alt="SFL" />
                    </div>
                  </GridItem>
                  <GridItem md="6">
                    <div className="scs-download-content">
                      <p>
                        Please find below link to download your prepaid shipping
                        label and commercial invoice for your shipment.{" "}
                      </p>
                      {AttachmentsLink1 != "" ? (
                        <div className="scs-download-btn">
                          <butoon
                            onClick={(event) => {
                              event.preventDefault();
                              window.open(AttachmentsLink1);
                            }}
                          >
                            <i class="fa fa-download" aria-hidden="true"></i>
                            Download
                          </butoon>
                          <span>Prepaid Shipping Label</span>
                        </div>
                      ) : null}
                      {AttachmentsLink2 != "" ? (
                        <div className="scs-download-btn">
                          <butoon
                            onClick={(event) => {
                              event.preventDefault();
                              window.open(AttachmentsLink2);
                            }}
                          >
                            <i class="fa fa-download" aria-hidden="true"></i>
                            Download
                          </butoon>
                          <span>Commercial Invoice</span>
                        </div>
                      ) : null}
                    </div>
                  </GridItem>
                </GridContainer>
              </div>
            )
          ) : (
            <div className="scs-steps">
              <h3>How does shipping works with SFL Worldwide?</h3>
              <GridContainer>
                <GridItem md="5">
                  <div className="scs-steps-video">
                    <iframe
                      src="https://www.youtube.com/embed/ldTbD6h1CjM"
                      frameborder="0"
                      allow="autoplay; encrypted-media"
                      allowfullscreen
                      title="video"
                    />
                  </div>
                </GridItem>
                <GridItem md="7">
                  <div className="scs-steps-inner">
                    <h4>Step 1:</h4>
                    <p>
                      After scheduling your shipment, you will receive a call
                      from our associates to go over your shipment.
                    </p>
                    <h4>Step 2:</h4>
                    <p>
                      You will receive an email with a prepaid shipping label
                      and a commercial invoice if required. As a standard
                      process, we advise you to print the shipping label and
                      securely paste it on your box or envelope.
                    </p>
                    <h4>International Shipment:</h4>
                    <p>
                      You will receive an email with a prepaid shipping
                      label/document and a commercial invoice if required. As a
                      standard process, we advise you to print the shipping
                      label/document and securely paste it on your box or
                      envelope.
                    </p>
                    <h4>Step 3:</h4>
                    <p>
                      Depending upon the selected service, we will arrange a
                      door pickup or you may drop your package at the nearest
                      drop off location provided by us.
                    </p>
                  </div>
                </GridItem>
              </GridContainer>
            </div>
          )}
          <div className="scs-instruction">
            <GridContainer>
              <GridItem md="8">
                <h3>Dropoff &amp; Pickup Instructions</h3>
                <ul>
                  <li>
                    If you have requested door pickup; pickup will be scheduled
                    within 1-2 business days from shipment scheduled date. Same
                    day pickup is not avalible
                  </li>
                  <li>
                    With door pickup it is customer’s responsibility to bring
                    shipment to front door; pickup person will not go inside
                    customer’s property for pickup.
                  </li>
                  <li>
                    All required documentations have been completed prior to
                    pickup.
                  </li>
                  <li>
                    Make sure items are property packed and sealed prior to
                    pickup date. Pickup crew will not wait while items are being
                    packed at the time of pickup.
                  </li>
                  <li>
                    Standard pickup is schedule anytime between 9AM to 6PM local
                    standard time; someone has to be avaliable during this time
                    to avoid any delay in pickups.
                  </li>
                  <li>
                    Customer will be provided with pickup confirmation number
                    and carrier contact number to coordinate door pickup
                  </li>
                  <li>
                    If there is any access code please advise your sales
                    association so it can be mentioned on pickup request. If
                    pickup person is not able to access your location it will
                    delay and cancel the pickup.
                  </li>
                  <li>
                    Make sure to securely paste label on box; if you used
                    bag/suitcase use bag tags to secure labels on box. You can
                    get bag tags for free from any FedEx or UPS store.
                  </li>
                  <li>
                    Make sure your shipment is scanned at time of drop and you
                    get drop off receipt.
                  </li>
                </ul>
              </GridItem>
              <GridItem md="4">
                <div className="box-img">
                  <img src={box} alt="SFL" />
                </div>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </GridContainer>
    );
  }
}

export default ScheduleConfirmation;
