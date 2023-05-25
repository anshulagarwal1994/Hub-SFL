import React, { Component } from "react";
import ReactTable from "react-table";
// import api from "../utils/apiClient";
import api from "../../utils/apiClient";

import { CommonConfig } from "../../utils/constant";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import SimpleBackdrop from "utils/general";
import CKEditor from "ckeditor4-react";
import ReviewsIcon from "@material-ui/icons/RateReview";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  TextField,
} from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput";
import Autocomplete from "@material-ui/lab/Autocomplete";
import cogoToast from "cogo-toast";

// const backendurl = "https://hubuatapi.sflworldwide.com/"; //cloud production
const backendurl = "https://hubapi.sflworldwide.com/"; //Hostgater production
class ReferredBy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Loading: false,
      serviceList: [],
      filterProps: [],
      sortProps: [],
      previousFilterList: [],
      previousSortList: [],
      showReviewDialog: false,
      SiteName: "",
      SiteNameEdit: null,
      SiteIdEdit: null,
      reviewSiteData: [],
      ReviewTemplateName: "",
      reviewTemplateNammeList: [],
      Steps: [
        {
          stepName: "Referred By",
          stepId: "reviewWeb",
          classname: "active",
        },
      ],

      siteData: [],
    };
  }

  componentDidMount() {
    // document.getElementById("customizeMSG").style.display = "none";
    this.getReviewSites();
    this.getReviewTemplate();
    this.getReferredSite();
  }

  getReviewSites = () => {
    this.showLoador();
    api.post("reviewsitemanage/getReviewSites", {}).then((res) => {
      if (res.success) {
        this.hideLoador();
        this.setState({ reviewSiteData: res.data });
      }
    });
  };

  getReviewTemplate = () => {
    api.post("reviewsitemanage/getReviewTemplate", {}).then((res) => {
      if (res.success) {
        this.setState({ reviewTemplateNammeList: res.data });
      }
    });
  };

  addReferredSite = () => {
    this.showLoador();
    var reviewSiteData = {
      refference: this.state.SiteName,
      refferenceId: this.state.SiteIdEdit ? this.state.SiteIdEdit : "",
    };

    api
      .post(
        "https://hubapi.sflworldwide.com/contactus/AddSaleLeadReff",
        reviewSiteData
      )
      .then((res) => {
        if (res.success) {
          console.log("CheckRessData", res);
          if (res.success === true) {
            this.hideLoador();
            this.CloseDialog();
            this.getReferredSite();
            
            if( this.state.SiteIdEdit){
              cogoToast.success("Updated Successfully");
            }else{
              cogoToast.success("Added Successfully");
            }
          }
          else{
            cogoToast.error("Something went wrong");
          }
        }
        
      });
  };

  getReferredSite = () => {
    this.showLoador();
    api.get("contactus/spGetSalesLeadReff", {}).then((res) => {
      this.hideLoador();
      console.log("getCheckRessData", res.data);
      this.hideLoador();
      var getSiteData = res.data.map((item) => ({
        id: item.SalesLeadReffID,
        label: item.Refference,
        Status: item.Status,
      }));
      this.setState({
        siteData: getSiteData,
      });
    });
  };

  activeInactiveReviewSiteStatus = (reviewId, reviewStatus) => {
    this.showLoador();
    var data = {
      reviewId: this.state.siteData?.SalesLeadReffID,
      reviewStatus: this.state.siteData?.Status,
    };

    api
      .post("reviewsitemanage/activeInactiveReviewSiteStatus", data)
      .then((res) => {
        this.getReviewSites();
      });
  };

  deleteReviewSite = (reviewId) => {
    this.showLoador();
    // var Attachment = logo.
   
    var data = {
      refference: "Delete",
      refferenceId: reviewId.id,
      
    };
    
    api.post("https://hubapi.sflworldwide.com/contactus/AddSaleLeadReff", data).then((res) => {
      this.getReferredSite();
    });
  };

  navigateChange = (key) => {
    let stepsList = this.state.Steps;
    let activeIndex = stepsList.findIndex((x) => x.classname === "active");

    if (key !== activeIndex) {
      stepsList[key]["classname"] = "active";
      stepsList[activeIndex]["classname"] = "inactive";
      this.setState({ Steps: stepsList });
      let divID = stepsList[key]["stepId"];
      let activeDiv = stepsList[activeIndex]["stepId"];

      console.log("activeDiv", document.getElementById(divID));
      console.log("divID", document.getElementById(activeDiv));

      document.getElementById(divID).style.display = "block";
      document.getElementById(activeDiv).style.display = "none";
    }
  };

  handleEdit = (record) => {
    console.log("datacheckrowrrr", record.label);
    this.setState({
      showReviewDialog: true,
      SiteNameEdit: record.label,
      SiteIdEdit: record.id,

      dataMode: "Update",
    });
  };

  selectChange = (event, value, type) => {
    if (type === "ReviewTemplateName") {
      this.showLoador();
      this.setState({ ReviewTemplateName: value });
      this.setState({ MsgTempId: value.value });
      var data = {
        msgTmpId: value.value,
      };
      api.post("reviewsitemanage/getAllReviewTemplate", data).then((res) => {
        if (res.success) {
          this.setState({ EmailSubject: res.data[0].TemplateSubject });
          this.setState({ MessageTemplate: res.data[0].TemplateMessage });
          this.hideLoador();
        }
      });
    }
  };

  showLoador = () => {
    this.setState({ Loading: true });
  };

  hideLoador = () => {
    this.setState({ Loading: false });
  };

  openDialog = () => {
    this.setState({
      showReviewDialog: true,
      SiteName: "",
      SiteIdEdit:""
    });
  };

  CloseDialog = () => {
    this.setState({ showReviewDialog: false });
  };

  handleChangeFrom = (event, value) => {
    if (value == "SiteName") {
      this.setState({ SiteName: event.target.value });
    }
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

  render() {
    const { reviewSiteData } = this.state;
    const reviewTemplateName = this.state.reviewTemplateNammeList.map(
      (review) => {
        return { value: review.MessageTemplateId, label: review.TamplateName };
      }
    );

    const columns = [
      {
        Header: "Site Name",
        maxWidth: 150,
        accessor: "label",
      },

      // {
      //   Header: "Status",
      //   Cell: (record) => {
      //     console.log("checkActivedaataaa", record);
      //     if (record.original.Status === "Active") {
      //       return (
      //         <Button
      //           color="success"
      //           className="table-btn"
      //           onClick={() =>
      //             this.activeInactiveReviewSiteStatus(
      //               record.original.id,
      //               "Inactive"
      //             )
      //           }
      //         >
      //           Active
      //         </Button>
      //       );
      //     } else {
      //       return (
      //         <Button
      //           color="danger"
      //           className="table-btn"
      //           onClick={() =>
      //             this.activeInactiveReviewSiteStatus(
      //               record.original.id,
      //               "Active"
      //             )
      //           }
      //         >
      //           Inactive
      //         </Button>
      //       );
      //     }
      //   },
      //   sortable: false,
      //   filterable: false,
      //   width: 200,
      // },
      {
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        width: 80,
        maxWidth: 80,
        // Cell: (props) => {
        //     const rowIdx = props.row.original.ClientID;
        //     return (
        //       <div className="table-action">
        //         <span
        //           onClick={() => {
        //             getClientDetail(rowIdx).then((res) => {
        //               if (res.status === 200) {
        //                 navigate(`/client/edit/${rowIdx}`, {
        //                   state: { id: rowIdx, data: res.data[0] },
        //                 });
        //               }
        //             });
        //           }}
        //           style={{ cursor: "pointer" }}
        //           className="table-action-btn edit"
        //         >
        //           <PencilFill />
        //         </span>

        //         <span
        //           onClick={async () => {
        //             const conf = await confirm(
        //               "Are you really want to delete this client?"
        //             );
        //             if (conf) {
        //               await ClientService.deleteClient(rowIdx).then(() => {
        //                 getClients();
        //               });
        //             }
        //           }}
        //           style={{ cursor: "pointer" }}
        //           className="table-action-btn delete"
        //         >
        //           <TrashFill />
        //         </span>
        //       </div>
        //     );
        //   },
        Cell: (record) => {
          const rowIdx = record.row._original;
          console.log("checkeditdatttae", rowIdx);
          return (
            <div className="table-common-btn">
              <Button
                justIcon
                color="info"
                onClick={() => this.handleEdit(rowIdx)}
              >
                <i className="fas fa-edit"></i>
              </Button>
            </div>
          );
        },
        filterable: false,
      },
      {
        Header: "Delete",
        accessor: "delete",
        sortable: false,
        width: 50,
        maxWidth: 80,
        Cell: (record) => {
          return (
            
            <div className="table-common-btn">
              {/* <Button
                justIcon
                onClick={() =>
                  this.deleteReviewSite(
                    record.original.id,
                    record.original.SiteLogo
                  )
                }
                color="danger"
              >
                <i class="fas fa-trash"></i>
              </Button> */}

{CommonConfig.getUserAccess("Sales Lead Reffered").DeleteAccess ===
              1 ? (
                <Button
                  justIcon
                  color="danger"
                  onClick={() =>
                    this.deleteReviewSite(record.row._original)
                  }
                >
                  <i class="fas fa-trash"></i>
                </Button>
              ) : null}
            </div>
          );
        },
        filterable: false,
      },
    ];
    console.log("reviewSiteDatavvv", this.state.SiteName);
    return (
      <div>
        <GridContainer justify="center" className="schedule-pickup-main-outer">
          {this.state.Loading === true ? (
            <div className="loading">
              <SimpleBackdrop />
            </div>
          ) : null}
          <GridItem xs={12} sm={12}>
            <Card className="z-index-9">
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <ReviewsIcon />
                </CardIcon>
                <h4 className="margin-right-auto text-color-black">
                  Referred Management
                </h4>
                <Button color="primary" onClick={() => this.openDialog()}>
                  Referred By
                </Button>
              </CardHeader>
              <CardBody>
                <div className="shipment-nav">
                  <ul>
                    {this.state.Steps.map((step, key) => {
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
                  <div className="shipment-pane" id="reviewWeb">
                    <CardBody>
                      <ReactTable
                        data={this.state.siteData}
                        minRows={0}
                        filterable
                        defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                        resizable={false}
                        columns={columns}
                        defaultPageSize={10}
                        showPaginationBottom={true}
                        className="-striped -highlight chatMgtList"
                      />
                    </CardBody>
                  </div>
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <div>
          <Dialog
            open={this.state.showReviewDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Site Name"
                      id="proposaltype"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        value: this.state.SiteName
                          ? this.state.SiteName
                          : this.state.SiteNameEdit,
                        onChange: (event) =>
                          this.handleChangeFrom(event, "SiteName"),
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.CloseDialog()} color="secondary">
                Cancel
              </Button>
              <Button onClick={() => this.addReferredSite()} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}

export default ReferredBy;
