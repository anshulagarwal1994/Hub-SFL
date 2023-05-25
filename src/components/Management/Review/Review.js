import React, { Component } from "react";
import ReactTable from "react-table";
import api from "../../../utils/apiClient";
import { fileBase } from "../../../utils/config";
import { CommonConfig } from "../../../utils/constant";
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
class Review extends Component {
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
      BusinessUrl: "",
      SiteUrl: "",
      CurrentRecordID: "",
      dataMode: "",
      reviewSiteLogoUrl: "",
      filename: "",
      reviewSiteData: [],
      ReviewTemplateName: "",
      reviewTemplateNammeList: [],
      EmailSubject: "",
      MessageTemplate: "",
      NewMessageTemplate: "",
      MsgTempId: "",
      Steps: [
        {
          stepName: "Review Websites",
          stepId: "reviewWeb",
          classname: "active",
        },
        {
          stepName: "Customize Message",
          stepId: "customizeMSG",
          classname: "inactive",
        },
      ],
    };
  }

  componentDidMount() {
    document.getElementById("customizeMSG").style.display = "none";
    this.getReviewSites();
    this.getReviewTemplate();
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

  updateReviewSiteData = () => {
    if (this.state.dataMode == "Update") {
      this.showLoador();
      var reviewSiteData = {
        SiteName: this.state.SiteName,
        ReviewSiteURL: this.state.SiteUrl,
        BusinessReviewPage: this.state.BusinessUrl,
        SiteLogo: this.state.reviewSiteLogoUrl,
        id: this.state.CurrentRecordID,
      };

      api
        .post("reviewsitemanage/updateReviewSiteData", reviewSiteData)
        .then((res) => {
          this.setState({
            showReviewDialog: false,
          });
          this.getReviewSites();
        });
    }

    if (this.state.dataMode == "Insert") {
      this.showLoador();
      var reviewSiteData = {
        SiteName: this.state.SiteName,
        ReviewSiteURL: this.state.SiteUrl,
        BusinessReviewPage: this.state.BusinessUrl,
        SiteLogo: this.state.reviewSiteLogoUrl,
      };

      api
        .post("reviewsitemanage/insertReviewSiteData", reviewSiteData)
        .then((res) => {
          this.setState({
            showReviewDialog: false,
          });
          this.getReviewSites();
        });
    }
  };

  fileUpload = (event) => {
    const files = event.target.files[0];
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
    if(!allowedExtensions.exec(files.name)){
      cogoToast.error('Please upload file having extensions .jpeg/.jpg/.png/.pdf only.');
    }else{

      if (files.size > 5000000) {
        cogoToast.error("please upload the file maximum 5MB");
      } else {

        const data = new FormData();
    data.append("file", event.target.files[0]);

    var regex = new RegExp("([a-zA-Z0-9s_\\.-:])+(.jpg|.png|.gif)$");
    if (regex.test(event.target.value.toLowerCase())) {
      if (typeof event.target.files != "undefined") {
        var reader = new FileReader();
        var checkImage = false;
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function(e) {
          var image = new Image();
          image.src = e.target.result;
          image.onload = function() {
            var height = this.height;
            var width = this.width;
            if (height < 44 || width < 44) {
              checkImage = false;
              return false;
            } else {
              checkImage = true;
              return true;
            }
          };
        };

        setTimeout(() => {
          if (checkImage) {
            api
              .post("reviewsitemanage/uploadReviewSiteLogo", data)
              .then((res) => {
                cogoToast.success("Logo uploaded successfully");
                if (fileBase.includes("docs.sflworldwide")) {
                  var url = backendurl + "document/" + res.filename;
                } else {
                  var url = backendurl + res.filename;
                }
                this.setState({
                  reviewSiteLogoUrl: url,
                  filename: res.filename,
                });
              });
          } else {
            cogoToast.error("Height or width not matched");
          }
        }, 2000);
      }
    }

      }
    }

    
  };

  activeInactiveReviewSiteStatus = (reviewId, reviewStatus) => {
    this.showLoador();
    var data = {
      reviewId: reviewId,
      reviewStatus: reviewStatus,
    };

    api
      .post("reviewsitemanage/activeInactiveReviewSiteStatus", data)
      .then((res) => {
        this.getReviewSites();
      });
  };

  deleteReviewSite = (reviewId,logo) => {
    this.showLoador();
    // var Attachment = logo.
    var b = logo.split(".com/")
    console.log(b[1])
    var Attachment = b[1]
    var data = {
      reviewId: reviewId,
      Attachment: Attachment,
    };
    api.post("reviewsitemanage/deleteReviewSite", data).then((res) => {
      this.getReviewSites();
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
    this.setState({
      showReviewDialog: true,
      SiteName: record.original.SiteName,
      SiteUrl: record.original.ReviewSiteURL,
      BusinessUrl: record.original.BusinessReviewPage,
      CurrentRecordID: record.original.id,
      reviewSiteLogoUrl: record.original.SiteLogo,
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

  extractContent = (s, space) => {
    var span = document.createElement("span");
    span.innerHTML = s;
    var templinidx;
    var link2;
    var children;
    var finaldata = "";
    if (space) {
      children = span.querySelectorAll("*");
      for (var i = 0; i < children.length; i++) {
        if (children[i].textContent) {
          if (children[i].localName == "a") {
            var link = children[i];
            link2 = link.getAttribute("href");
            children[i].textContent = link2 + " ";
            finaldata += children[i].textContent;
          } else {
            children[i].textContent += " ";
            finaldata += children[i].textContent;
          }
        } else children[i].innerText += " ";
      }
      console.log("finaldata", finaldata);
    }
    return finaldata.replace(/ +/g, " ");
  };
  convert = () => {
    var message = this.state.MessageTemplate;
    this.setState({ NewMessageTemplate: message });
    this.showLoador();
    var data = {
      subject: this.state.EmailSubject,
      msgTemplate: message,
      msgTmpId: this.state.MsgTempId,
    };

    api.post("reviewsitemanage/updateReviewTemplate", data).then((res) => {
      this.hideLoador();
      this.selectChange(
        "",
        this.state.ReviewTemplateName,
        "ReviewTemplateName"
      );
    });
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
      BusinessUrl: "",
      SiteUrl: "",
      dataMode: "Insert",
    });
  };

  CloseDialog = () => {
    this.setState({ showReviewDialog: false });
  };

  handleChangeFrom = (event, value) => {
    if (value == "SiteName") {
      this.setState({ SiteName: event.target.value });
    }

    if (value == "SiteUrl") {
      this.setState({ SiteUrl: event.target.value });
    }

    if (value == "Business") {
      this.setState({ BusinessUrl: event.target.value });
    }

    if (value == "EmailSubject") {
      this.setState({ EmailSubject: event.target.value });
    }

    if (value == "MessageTemplate") {
      const data = event.editor.getData();
      this.setState({ MessageTemplate: data });
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
        maxWidth: 80,
        accessor: "SiteName",
      },
      {
        Header: "Site Logo",
        maxWidth: 80,
        filterable: false,
        Cell: (record) => {
          return (
            <div className="review-site-logo-table">
              <span>
                <img className="reviewLogo" src={record.original.SiteLogo} />
              </span>
            </div>
          );
        },
      },
      {
        Header: "Site URL",
        maxWidth: 200,
        accessor: "ReviewSiteURL",
      },
      {
        Header: "Business Review URL",
        maxWidth: 200,
        accessor: "BusinessReviewPage",
      },
      {
        Header: "Status",
        Cell: (record) => {
          if (record.original.Status === "Active") {
            return (
              <Button
                color="success"
                className="table-btn"
                onClick={() =>
                  this.activeInactiveReviewSiteStatus(
                    record.original.id,
                    "Inactive"
                  )
                }
              >
                Active
              </Button>
            );
          } else {
            return (
              <Button
                color="danger"
                className="table-btn"
                onClick={() =>
                  this.activeInactiveReviewSiteStatus(
                    record.original.id,
                    "Active"
                  )
                }
              >
                Inactive
              </Button>
            );
          }
        },
        sortable: false,
        filterable: false,
        width: 200,
      },
      {
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        width: 80,
        maxWidth: 80,
        Cell: (record) => {
          return (
            <div className="table-common-btn">
              <Button
                justIcon
                color="info"
                onClick={() => this.handleEdit(record)}
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
              <Button
                justIcon
                onClick={() => this.deleteReviewSite(record.original.id,record.original.SiteLogo)}
                color="danger"
              >
                <i class="fas fa-trash"></i>
              </Button>
            </div>
          );
        },
        filterable: false,
      },
    ];
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
                  Review Site Management
                </h4>
                <Button color="primary" onClick={() => this.openDialog()}>
                  Add Review Site
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
                        data={reviewSiteData}
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
                  <div className="shipment-pane" id="customizeMSG">
                    <CardBody>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={3}>
                          <FormControl fullWidth>
                            <Autocomplete
                              id="combo-box-demo"
                              options={reviewTemplateName}
                              value={this.state.ReviewTemplateName}
                              onChange={(event, value) =>
                                this.selectChange(
                                  event,
                                  value,
                                  "ReviewTemplateName"
                                )
                              }
                              getOptionLabel={(option) => option.label}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Template Name"
                                  margin="normal"
                                  fullWidth
                                />
                              )}
                            />
                          </FormControl>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={9}>
                          <FormControl fullWidth>
                            <CustomInput
                              labelText="Email Subject"
                              id="proposaltype"
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                value: this.state.EmailSubject,
                                onChange: (event) =>
                                  this.handleChangeFrom(event, "EmailSubject"),
                              }}
                            />
                          </FormControl>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={12}>
                          <FormControl className="mt-20 full-width">
                            <CKEditor
                              name="Message"
                              id="Message"
                              data={this.state.MessageTemplate}
                              onChange={(e) =>
                                this.handleChangeFrom(e, "MessageTemplate")
                              }
                            />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <Button
                            onClick={() => this.convert()}
                            color="primary"
                          >
                            {" "}
                            Save
                          </Button>
                        </GridItem>
                      </GridContainer>
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
                        value: this.state.SiteName,
                        onChange: (event) =>
                          this.handleChangeFrom(event, "SiteName"),
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Site URL"
                      id="proposaltype"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        value: this.state.SiteUrl,
                        onChange: (event) =>
                          this.handleChangeFrom(event, "SiteUrl"),
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Business Review URL"
                      id="proposaltype"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        value: this.state.BusinessUrl,
                        onChange: (event) =>
                          this.handleChangeFrom(event, "Business"),
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={10}>
                    <CustomInput
                      labelText="Logo name (Image height and width should be 44 x 44)"
                      id="proposaltype"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        value: this.state.filename,
                        disabled: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={2}>
                    <div className="custom-file-browse review-site-logo">
                      <span>Upload</span>
                      <input
                        type="file"
                        name="selectedfile"
                        id="file"
                        className="normal-btn sm-orange"
                        onChange={(event) => this.fileUpload(event)}
                      />
                    </div>
                  </GridItem>
                </GridContainer>
                <div className="img-uploaded file-preview">
                  <div>
                    <span className="img-box-outer">
                      <img alt="Preview" src={this.state.reviewSiteLogoUrl} />
                    </span>
                  </div>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.CloseDialog()} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={() => this.updateReviewSiteData()}
                color="primary"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}

export default Review;
