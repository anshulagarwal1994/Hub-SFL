/*eslint-disable*/
import React from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import DeleteIcon from "@material-ui/icons/Delete";
import MenuItem from "@material-ui/core/MenuItem";
import api from "../../../../utils/apiClient";
import FormHelperText from "@material-ui/core/FormHelperText";
import { CommonConfig } from "../../../../utils/constant";
import SimpleBackdrop from "../../../../utils/general";
import cogoToast from "cogo-toast";
import { fileBase } from "../../../../utils/config";
import moment from "moment";
import ReactTable from "react-table";

class Step1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ServiceList: [],
      simpleSelect: "",
      vendorName: "",
      vendorNameErr: false,
      vendorNameHelperText: "",

      vendorWebsite: "",

      vendorType: "",
      vendorTypeErr: false,
      vendorTypeHelperText: "",

      carrierLink: "",
      carrierLinkErr: false,
      carrierLinkHelperText: "",

      isBulkUpload: false,
      offeredService: [],
      Attachments: [],
      DocumentList: [],
      AttachmentList: [],
      Loading: false,
      createdBy: CommonConfig.loggedInUserData().Name,
      comments: "",
      open: false,
      vendorId: !CommonConfig.isEmpty(this.props.history.location.state)
        ? this.props.history.location.state.vendorId
        : "",

      objAttachment: {
        Index: 0,
        FileName: "",
        Status: "Active",
        DocumentCreatedOn: moment().format(CommonConfig.dateFormat.dateOnly),
        DocumentCreatedBy: CommonConfig.loggedInUserData().Name,
      },
      Access: [],
    };
  }
  async componentDidMount() {
    this.setState({ Access: CommonConfig.getUserAccess("Vendor Management") });
    if (CommonConfig.isEmpty(this.state.vendorId)) {
      this.setState({ Attachments: [this.state.objAttachment] });
    }
    await this.getServiceList();

    if (!CommonConfig.isEmpty(this.state.vendorId)) {
      await this.getVendorDetails(this.state.vendorId);
    }
  }

  getServiceList() {
    try {
      api.get("vendor/getServiceList").then((res) => {
          if (res.success) {
            for (var i = 0; i < res.data.length; i++) {
              res.data[i].isChecked = false;
            }
            this.setState({ ServiceList: res.data });
          }
        })
        .catch((err) => {
          console.log("err..", err);
        });
    } catch (error) {
      console.log("err..", error);
    }
  }
  handleChange = (event, type) => {
    let val = event.target.value;

    if (type === "vendorName") {
      this.setState({ vendorName: val });
    } else if (type === "website") {
      this.setState({ vendorWebsite: val });
    } else if (type === "carrierLink") {
      this.setState({ carrierLink: val });
    } else if (type === "comments") {
      this.setState({ comments: val });
    }
  };

  handleBlur = (event, type) => {
    let val = event.target.value;

    if (type === "vendorName") {
      if (!CommonConfig.isEmpty(val)) {
        if (val.length > 54) {
          this.setState({
            vendorName: val,
            vendorNameErr: true,
            vendorNameHelperText: "Please Enter valid Vender Name.",
          });
        } else if (CommonConfig.RegExp.companyName.test(val)) {
          this.setState({
            vendorName: val,
            vendorNameErr: true,
            vendorNameHelperText: "Please Enter valid Vender Name.",
          });
        } else {
          this.setState({
            vendorName: val,
            vendorNameErr: false,
            vendorNameHelperText: "",
          });
        }
      } else if (CommonConfig.isEmpty(val)) {
        this.setState({
          vendorName: val,
          vendorNameErr: true,
          vendorNameHelperText: "Please Enter Vender Name.",
        });
      }
    } else if (type === "website") {
      this.setState({ vendorWebsite: val });
    } else if (type === "carrierLink") {
      this.setState({ carrierLink: val });
    }
  };

  ServiceMapping = (event, key) => {
    let ServiceList = this.state.ServiceList;
    if (event.target.checked) {
      var MappedServices = [
        {
          Id: Number(event.target.value),
          serviceName: event.target.name,
        },
      ];
      ServiceList[key].isChecked = event.target.checked;
      this.setState({
        offeredService: this.state.offeredService.concat(MappedServices),
        ServiceList: ServiceList,
      });
    } else {
      let Services = this.state.offeredService;
      var index = Services.findIndex(
        (x) => x.Id === Number(event.target.value)
      );
      Services.splice(index, 1);
      ServiceList[key].isChecked = event.target.checked;
      this.setState({ offeredService: Services, ServiceList: ServiceList });
    }
  };

  sendState() {
    return this.state;
  }

  appendServices() {
    const Services = this.state.ServiceList;
    debugger
    return Services.map((service, key) => {
      return (
        <GridItem xs={12} sm={12} md={3} key={key}>
          <FormControlLabel
            control={
              <Checkbox
                checked={service.isChecked}
                value={service.ServiceId}
                name={service.ServiceName}
                onChange={(event) => this.ServiceMapping(event, key)}
              />
            }
            label={service.ServiceName}
          />
        </GridItem>
      );
    });
  }

  changeDropDown = (event, type) => {
    if (type === "vendorType") {
      this.setState({
        vendorType: event.target.value,
        vendorTypeErr: false,
        vendorNameHelperText: "",
      });
    } else if (type === "bulkUpload") {
      this.setState({ isBulkUpload: event.target.value });
    }
  };

  showLoader = () => {
    this.setState({ Loading: true });
  };

  hideLoader = () => {
    this.setState({ Loading: false });
  };

  getVendorDetails(vendorId) {
    try {
      this.showLoader();
      api.get("vendor/getVendorById/" + vendorId).then((res) => {
          if (res.success) {
            this.hideLoader();
            let allServiceList = this.state.ServiceList;

            for (var i = 0; i < allServiceList.length; i++) {
              for (var j = 0; j < res.data.services.length; j++) {
                if (
                  allServiceList[i].ServiceId === res.data.services[j].Id &&
                  allServiceList[i].ServiceName ===
                    res.data.services[j].serviceName
                ) {
                  allServiceList[i].isChecked = true;
                }
              }
            }
            for (var i = 0; i < res.data.DocumentList.length; i++) {
              var filesList = res.data.DocumentList[i];
              filesList.DocumentCreatedOn = moment(
                filesList.DocumentCreatedOn
              ).format(CommonConfig.dateFormat.dateOnly);
              this.state.Attachments.push(filesList);
            }
            this.setState({
              vendorName: res.data.Name,
              vendorWebsite: res.data.Website,
              vendorType: res.data.VendorType,
              ServiceList: allServiceList,
              comments: res.data.Comments,
              carrierLink: res.data.CarrierLink,
              offeredService: res.data.services,
              createdBy: res.data.CreatedBy,
              isBulkUpload: res.data.IsBulkUpload === 1 ? true : false,
            });
            this.setState({
              Attachments: [
                ...this.state.Attachments,
                this.state.objAttachment,
              ],
            });
          }
        })
        .catch((err) => {
          this.hideLoader();
          console.log("err..", err);
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {
      this.hideLoader();
      console.log("err..", error);
      cogoToast.error("Something Went Wrong");
    }
  }
  validate() {
    let IsFormValid = true;

    if (CommonConfig.isEmpty(this.state.vendorName)) {
      IsFormValid = false;
      this.setState({
        vendorNameErr: true,
        vendorNameHelperText: "Please Enter Vendor Name",
      });
    }

    if (CommonConfig.isEmpty(this.state.vendorType)) {
      IsFormValid = false;
      this.setState({
        vendorTypeErr: true,
        vendorTypeHelperText: "Please Select Vendor type",
      });
    }

    if (!this.state.offeredService.length) {
      IsFormValid = false;
      cogoToast.error("Please Select one Service");
    }
    return IsFormValid;
  }

  AddNewRowData = () => {
    let attachments = this.state.Attachments;
    let IsValid = true;
    for (let i = 0; i < this.state.Attachments.length; i++) {
      if (!attachments[i].hasOwnProperty("AttachmentName")) {
        IsValid = false;
      }
    }
    var AttachmentList = this.state.Attachments.filter(
      (x) => x.Status === "Active" && (x.FileName === "" || x.FileName === null)
    );
    if (AttachmentList.length === 0 && IsValid) {
      const objAttachment = {
        Index: AttachmentList.filter((x) => x.Status === "Active").length + 1,
        FileName: "",
        Status: "Active",
        DocumentCreatedOn: moment().format(CommonConfig.dateFormat.dateOnly),
        DocumentCreatedBy: CommonConfig.loggedInUserData().Name,
      };
      this.setState({
        Attachments: [...this.state.Attachments, objAttachment],
      });
    } else {
      cogoToast.error("Please fill above row first");
    }
  };

  handleDocumentChange = (e, record) => {
    var Index = this.state.Attachments.indexOf(record.original);
    this.state.Attachments[Index]["FileName"] = e.target.value;
    this.setState({ Attachments: [...this.state.Attachments] });
  };

  stringTruncate = (filename) => {
    var maxLength = 15;
    if (filename !== undefined && filename !== null) {
      if (filename.length > 15) {
        filename = filename.substring(0, maxLength) + "...";
      } else {
        filename = filename;
      }
    }
    return filename;
  };

  fileUpload = (event, record) => {
    const files = event.target.files[0];
    console.log("FileSizes = ", files)
    console.log("FileSizes = ", files.size)
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
    if(!allowedExtensions.exec(files.name)){
      cogoToast.error('Please upload file having extensions .jpeg/.jpg/.png/.pdf only.');
    }else{

      if (files.size > 5000000) {
        cogoToast.error("please upload the file maximum 5MB");
      } else {
        let AttachmentList = this.state.Attachments;
        let Index = this.state.Attachments.indexOf(record.original);
        let dateNow = new Date().getTime();
        AttachmentList[Index]["DateTime"] = dateNow;
        AttachmentList[Index]["AttachmentName"] = files.name;
        AttachmentList[Index]["AttachmentType"] = files.type;
        AttachmentList[Index]["AttachmentID"] = null;
        AttachmentList[Index]["Status"] = "Active";
        this.setState({
          Attachments: AttachmentList,
          AttachmentList: [...this.state.AttachmentList, files],
        });
      }

    }
    
  };

  handleDocumentDelete = (e, record) => {
    console.log("Records = ", record);
    var data = {
      Attachments:record
    }
    api
        .post("/vendor/deleteVendorSingleDocument", data)
        .then((res) => {
          if (res.success) {
            this.hideLoader();
            
          }
        })
        .catch((err) => {
          console.log("error", err);
        });

    
    var AttachmentList = this.state.Attachments;
    var Index = AttachmentList.indexOf(record);
    AttachmentList[Index]["Status"] = "Inactive";
    this.setState({ Attachments: AttachmentList });
  };

  renderDocumentName = (cellInfo) => {
    return (
      <div className="table-input-slam">
        <CustomInput
          inputProps={{
            value: cellInfo.original.FileName,
            onChange: (event) => this.handleDocumentChange(event, cellInfo),
          }}
        />
      </div>
    );
  };

  render() {
    const columns = [
      {
        Header: "Document Name",
        accessor: "Name",
        width: 220,
        maxWidth: 220,
        Cell: this.renderDocumentName,
      },
      {
        Header: "CreatedOn",
        accessor: "DocumentCreatedOn",
        width: 220,
        sortMethod: (a, b) => {
          return CommonConfig.dateSortMethod(a, b);
        },
        maxWidth: 220,
      },
      {
        Header: "Added By",
        accessor: "DocumentCreatedBy",
        width: 280,
        maxWidth: 280,
      },
      {
        Header: "Attachment",
        accessor: "actions",
        width: 80,
        filterable: false,
        sortable: false,
        Cell: (record) => {
          return (
            <div>
              {record.original.AttachmentPath ? (
                <div>
                  <a
                    href={fileBase + record.original.AttachmentPath}
                    className="normal-btn sm-orange"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    View File
                  </a>
                </div>
              ) : this.state.Access.WriteAccess === 1 ? (
                <div>
                  <div className="custom-file-browse">
                    <span>Upload</span>
                    <input
                      type="file"
                      name="selectedfile"
                      id="file"
                      style={{ width: 140, border: 0 }}
                      onChange={(event) => this.fileUpload(event, record)}
                    />
                  </div>
                  <p>{this.stringTruncate(record.original.AttachmentName)}</p>
                </div>
              ) : null}
            </div>
          );
        },
      },
      {
        width: 100,
        filterable: false,
        sortable: false,
        Header: "Actions",
        Cell: (record) => {
          return record.original.AttachmentPath ? (
            <div className="align-right">
              {this.state.Access.DeleteAccess === 1 ? (
                <DeleteIcon
                  onClick={(e) => this.handleDocumentDelete(e, record.original)}
                />
              ) : null}
            </div>
          ) : this.state.Attachments.filter((x) => x.Status === "Active")
              .length ===
            record.index + 1 ? (
            <div className="align-right">
              <Icon color="secondary" onClick={() => this.AddNewRowData()}>
                add_circle
              </Icon>
            </div>
          ) : null;
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
        <form>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                error={this.state.vendorNameErr}
                helperText={this.state.vendorNameHelperText}
                labelText="Vendor Name"
                id="vendorName"
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon className="requiredicon">perm_identity</Icon>
                    </InputAdornment>
                  ),
                  value: this.state.vendorName,
                  onChange: (e) => this.handleChange(e, "vendorName"),
                  onBlur: (e) => this.handleBlur(e, "vendorName"),
                  onFocus: (event) =>
                    this.setState({
                      vendorNameErr: false,
                      vendorNameHelperText: "",
                    }),
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                labelText={<span> Vendor Website </span>}
                id="companywebsite"
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  value: this.state.vendorWebsite,
                  onChange: (e) => this.handleChange(e, "website"),
                  onBlur: (e) => this.handleBlur(e, "website"),
                  onFocus: (e) =>
                    this.setState({
                      vendorWebsiteErr: false,
                      vendorWebsiteHelperText: "",
                    }),
                  endAdornment: (
                    <InputAdornment position="end">
                      {" "}
                      <Icon>public</Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                labelText="Added By"
                id="addedby"
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon className="requiredicon">location_city </Icon>
                    </InputAdornment>
                  ),
                  value: this.state.createdBy,
                  disabled: true,
                }}
              />
            </GridItem>
          </GridContainer>

          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <div className="select-spl">
                <FormControl error={this.state.vendorTypeErr} fullWidth>
                  <InputLabel>Vendor Type</InputLabel>
                  <Select
                    value={this.state.vendorType}
                    onChange={(event) =>
                      this.changeDropDown(event, "vendorType")
                    }
                    onFocus={() =>
                      this.setState({
                        vendorTypeErr: false,
                        vendorTypeHelperText: "",
                      })
                    }
                    inputProps={{
                      name: "vendorType",
                      id: "vendorType",
                    }}
                  >
                    <MenuItem value="payable"> Payable </MenuItem>
                    <MenuItem value="receivable"> Receivable </MenuItem>
                    <MenuItem value="Both"> Both </MenuItem>
                  </Select>
                  <FormHelperText>
                    {this.state.vendorTypeHelperText}
                  </FormHelperText>
                </FormControl>
              </div>
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <div className="select-spl">
                <FormControl fullWidth>
                  <InputLabel>Bulk Upload</InputLabel>
                  <Select
                    value={this.state.isBulkUpload}
                    onChange={(event) =>
                      this.changeDropDown(event, "bulkUpload")
                    }
                    inputProps={{
                      name: "bulkupload",
                      id: "bulkupload",
                    }}
                  >
                    <MenuItem value={true}> Yes </MenuItem>
                    <MenuItem value={false}> No </MenuItem>
                  </Select>
                </FormControl>
              </div>
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                labelText={<span>Carrier Link</span>}
                id="carrierlink"
                formControlProps={{ fullWidth: true }}
                inputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon>location_city</Icon>
                    </InputAdornment>
                  ),
                  value: this.state.carrierLink,
                  onChange: (e) => this.handleChange(e, "carrierLink"),
                  onBlur: (e) => this.handleBlur(e, "carrierLink"),
                  onFocus: () =>
                    this.setState({
                      carrierLinkErr: false,
                      carrierLinkHelperText: "",
                    }),
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <div className="normal-textarea">
                <h3>Comments</h3>
                <textarea
                  aria-label="minimum height"
                  rowsMin={3}
                  value={this.state.comments}
                  id="comments"
                  onChange={(event) => this.handleChange(event, "comments")}
                  required
                />
              </div>
            </GridItem>
          </GridContainer>

          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <h3>Service Offered</h3>
            </GridItem>
            {this.appendServices()}
          </GridContainer>

          <GridContainer>
            <GridItem xs={12} sm={6} md={6}>
              <h3 className="margin-right-auto text-color-black">
                Documentation
              </h3>
            </GridItem>
          </GridContainer>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12}>
              <ReactTable
                data={this.state.Attachments.filter(
                  (x) => x.Status === "Active"
                )}
                sortable={true}
                filterable={true}
                resizable={false}
                minRows={2}
                columns={columns}
                defaultPageSize={10}
                align="center"
                className="-striped -highlight"
              />
            </GridItem>
          </GridContainer>
        </form>
      </div>
    );
  }
}

export default withStyles()(Step1);
