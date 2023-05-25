import React, { Component } from "react";
import api from "../../utils/apiClient";
import SimpleBackdrop from "../../utils/general";
import ReactTable from "react-table";
import { CommonConfig } from "utils/constant";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import cogoToast from "cogo-toast";
import CustomInput from "components/CustomInput/CustomInput";
import { ForumOutlined } from "@material-ui/icons";
import Radio from "@material-ui/core/Radio";
import ShowMoreText from "react-show-more-text";
import {
  Checkbox,
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  TextField,
} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";

class ChatManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Steps: [
        {
          stepName: "Agent List",
          stepId: "agentlist",
          classname: "active",
        },
        {
          stepName: "Keyword Not found",
          stepId: "keywordnotfound",
          classname: "inactive",
        },
        {
          stepName: "Keyword Management",
          stepId: "keywordmanage",
          classname: "inactive",
        },
      ],
      Loading: false,
      KeywordList: [],
      KeywordListAllData: [],
      AgentList: [],
      ReadAccessChecked: false,
      WriteAccessChecked: false,
      DeleteAccessChecked: false,
      AllAccessChecked: false,
      keyword: "",
      selectedKeywordType: "Answer",
      answerType: "Answer",
      hyperlink: "Hyperlink",
      url: "",
      link_name: "",
      answer: "",
      selectedcompareType: "equal",
      equal: "equal",
      compare: "compare",
    };
  }

  componentDidMount() {
    document.getElementById("keywordnotfound").style.display = "none";
    document.getElementById("keywordmanage").style.display = "none";
    this.getAgentList();
    this.keywordNotFound();
    this.keywordData();
  }

  showLoador = () => {
    this.setState({ Loading: true });
  };

  openDeleteRequestModal(recordDeleteId) {
    console.log(recordDeleteId);
    this.setState({ DeleteRequest: true, DeleteRequestId: recordDeleteId });
  }

  openDeleteRequestModalKeyword(recordDeleteId) {
    console.log(recordDeleteId);
    this.setState({
      DeleteRequestKeyword: true,
      DeleteRequestIdKeyword: recordDeleteId,
    });
  }

  closedeletemodal = () => {
    this.setState({ DeleteRequest: false });
  };

  openDialog = () => {
    debugger;
    this.setState({
      showKeywordDialog: true,
      keyword: "",
      selectedKeywordType: "Answer",
      url: "",
      link_name: "",
      answer: "",
      selectedcompareType: "equal",
      dataMode: "Insert",
    });
  };

  handleEdit = (record) => {
    console.log(record);
    this.setState({
      showKeywordDialog: true,

      keyword: record.original.keywords,
      selectedKeywordType: record.original.type,
      url: record.original.url,
      link_name: record.original.link_name,
      answer: record.original.answer,
      selectedcompareType: record.original.searchType,
      CurrentRecordID: record.original.id,
      dataMode: "Update",
    });
  };

  handleDelete(recordDeleteId) {
    this.setState({ DeleteRequest: false });
    let deleteData = {
      cusId: recordDeleteId,
    };

    api.post("chatManagementAPI/deleteChatById", deleteData).then((res) => {
      if (res.success) {
        cogoToast.success("Record Deleted Successfully");
        let data = {
          cusid: 0,
          agentId: CommonConfig.loggedInUserData().PersonID,
        };
        this.keywordNotFound();
      }
    });
  }

  closedeletemodalKeyword = () => {
    this.setState({ DeleteRequestKeyword: false });
  };

  handleDeleteKeyword(recordDeleteId) {
    console.log(recordDeleteId);
    this.setState({ DeleteRequestKeyword: false });
    let deleteData = {
      cusId: recordDeleteId,
    };

    api
      .post("chatManagementAPI/deleteChatByIdForKeyword", deleteData)
      .then((res) => {
        if (res.success) {
          cogoToast.success("Record Deleted Successfully");
          let data = {
            cusid: 0,
            agentId: CommonConfig.loggedInUserData().PersonID,
          };
          this.keywordData();
        }
      });
  }

  hideLoador = () => {
    this.setState({ Loading: false });
  };

  updateUserAccess(e, record, value) {
    this.showLoador();
    let cbVal = e.target.checked;
    var data = {
      AcccessType: value,
      IsChecked: cbVal ? 1 : 0,
      userId: record.original.PersonId,
      moduleId: 35,
    };

    api.post("chatManagementAPI/updateUserAccess", data).then((res) => {
      this.getAgentList();
    });
  }

  changeUserAccessType(e, record, value) {
    if (e.target.checked == false) {
      var tempAccessArr = record.original.AcccessType.split(",");

      var tempAccessIdx = tempAccessArr.indexOf(value);
      if (tempAccessIdx > -1) {
        tempAccessArr.splice(tempAccessIdx, 1);
      }

      var newValue = "";
      if (tempAccessArr.length > 1) {
        newValue = tempAccessArr.join(",");
      } else {
        newValue = tempAccessArr[0];
      }

      if (newValue == undefined || newValue == null) {
        newValue = "";
      }
      var data = {
        newValue: newValue,
        personId: record.original.PersonId,
      };

      api.post("chatManagementAPI/changeUserAccessType", data).then((res) => {
        this.getAgentList();
      });
    } else {
      if (record.original.AcccessType == "") {
        var newValue = value;
      } else {
        var newValue = record.original.AcccessType + "," + value;
      }

      var data = {
        newValue: newValue,
        personId: record.original.PersonId,
      };

      api.post("chatManagementAPI/changeUserAccessType", data).then((res) => {
        this.getAgentList();
      });
    }
  }

  getAgentList() {
    this.showLoador();
    api.post("chatManagementAPI/getAgentList", {}).then((res) => {
      this.hideLoador();
      if (res.success) {
        this.setState({ AgentList: res.data[0] });
      }
    });
  }

  keywordNotFound() {
    this.showLoador();
    api.post("chatManagementAPI/getKeywords", {}).then((res) => {
      this.hideLoador();
      if (res.success) {
        this.setState({ KeywordList: res.Data });
      }
    });
  }

  keywordData() {
    this.showLoador();
    api.post("chatManagementAPI/keywordData", {}).then((res) => {
      this.hideLoador();
      if (res.success) {
        this.setState({ KeywordListAllData: res.Data[0] });
      }
    });
  }

  // Navigation Methods
  navigateChange = (key) => {
    let stepsList = this.state.Steps;
    let activeIndex = stepsList.findIndex((x) => x.classname === "active");
    if (key !== activeIndex) {
      stepsList[key]["classname"] = "active";
      stepsList[activeIndex]["classname"] = "inactive";
      this.setState({ Steps: stepsList });
      let divID = stepsList[key]["stepId"];
      let activeDiv = stepsList[activeIndex]["stepId"];
      document.getElementById(divID).style.display = "block";
      document.getElementById(activeDiv).style.display = "none";
    }
  };

  changevalueOption(event) {
    this.setState({
      selectedKeywordType:
        event.target.value == "Answer" ? "Answer" : "Hyperlink",
    });

    if (event.target.value == "Answer") {
      this.setState({ url: "" });

      this.setState({ link_name: "" });
    }
    // else {
    //   this.setState({ keyword: "" });
    // }

    console.log(event.target.value);
  }

  handleChangeFrom = (event, value) => {
    if (value == "keyword") {
      this.setState({ keyword: event.target.value });
    }

    if (value == "Answer") {
      this.setState({ answer: event.target.value });
    }

    if (value == "Url") {
      this.setState({ url: event.target.value });
    }

    if (value == "Url Name") {
      this.setState({ link_name: event.target.value });
    }
  };
  CloseDialog = () => {
    this.setState({
      showKeywordDialog: false,
    });
  };

  updateKeywordData = () => {
    if (this.state.dataMode == "Update") {
      this.showLoador();
      var reviewSiteData = {
        keyword: this.state.keyword,
        selectedKeywordType: this.state.selectedKeywordType,
        url: this.state.url,
        link_name: this.state.link_name,
        answer: this.state.answer,
        selectedcompareType: this.state.selectedcompareType,
        id: this.state.CurrentRecordID,
      };

      api
        .post("chatManagementAPI/updateKeywordData", reviewSiteData)
        .then((res) => {
          this.setState({
            showKeywordDialog: false,
          });
          this.keywordData();
        });
    }

    if (this.state.dataMode == "Insert") {
      this.showLoador();
      var reviewSiteData = {
        keyword: this.state.keyword,
        selectedKeywordType: this.state.selectedKeywordType,
        url: this.state.url,
        link_name: this.state.link_name,
        answer: this.state.answer,
        selectedcompareType: this.state.selectedcompareType,
      };

      console.log(reviewSiteData);

      api
        .post("chatManagementAPI/insertKeywordData", reviewSiteData)
        .then((res) => {
          if (res.success) {
            cogoToast.success("Record Inserted Successfully");
            this.setState({
              showKeywordDialog: false,
            });
            this.keywordData();
          }
        });
    }
  };

  changevalueOptionCompare(event) {
    this.setState({
      selectedcompareType: event.target.value == "equal" ? "equal" : "compare",
    });

    console.log(event.target.value);
  }

  activeInactiveAgentStatus(agentId, IsAvailableForChat) {
    var data = {
      agentId: agentId,
      IsAvailableForChat: IsAvailableForChat,
    };
    api.post("customerChat/updateAgentChatActiveStatus", data).then((res) => {
      this.getAgentList();
      var sessionData = JSON.parse(localStorage.getItem("loggedInUserData"));
      if (res.Data.success == true) {
        if (sessionData.PersonID == agentId) {
          if (IsAvailableForChat == 0) {
            sessionData.IsAvailableForChat = 0;
          } else {
            sessionData.IsAvailableForChat = 1;
          }
          localStorage.setItem("loggedInUserData", JSON.stringify(sessionData));
        }
      }
    });
  }
  stripeErrorTemplate(rowData) {
    return (
      <div>
        <ShowMoreText
          className="fullText"
          lines={2}
          more="Show more"
          less="Show less"
          anchorClass=""
          onClick={this.executeOnClick}
          expanded={false}
        >
          {rowData.StripeErrorMessage}
        </ShowMoreText>
      </div>
    );
  }
  render() {
    const { AgentList, KeywordList, KeywordListAllData } = this.state;

    const columns = [
      {
        Header: "User Name",
        maxWidth: 120,
        accessor: "UserName",
        // Footer: (
        //   <Button style={{ width: "110px", height: "20px" }} color="rose">
        //     Update Access
        //   </Button>
        // ),
        // columns: [{ accessor: "UserName", sortable: true, filterable: true ,maxWidth: 100,}],
      },
      {
        Header: () => {
          return <div style={{ textAlign: "center" }}>Chat Module</div>;
        },
        maxWidth: 200,

        columns: [
          {
            Header: "Read",
            Cell: (record) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={record.original.ReadAccess}
                      onChange={(e) =>
                        this.updateUserAccess(e, record, "ReadAccess")
                      }
                    />
                  }
                  classes={{}}
                />
              );
            },
            maxWidth: 70,
            sortable: false,
            filterable: false,
          },
          {
            Header: "Write",
            Cell: (record) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={record.original.WriteAccess}
                      onChange={(e) =>
                        this.updateUserAccess(e, record, "WriteAccess")
                      }
                    />
                  }
                  classes={{}}
                />
              );
            },
            maxWidth: 70,
            sortable: false,
            filterable: false,
          },
          {
            Header: "Delete",
            Cell: (record) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={record.original.DeleteAccess}
                      onChange={(e) =>
                        this.updateUserAccess(e, record, "DeleteAccess")
                      }
                    />
                  }
                  classes={{}}
                />
              );
            },
            maxWidth: 70,
            sortable: false,
            filterable: false,
          },
          {
            Header: "All",
            Cell: (record) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={record.original.AllAccess}
                      onChange={(e) =>
                        this.updateUserAccess(e, record, "AllAccess")
                      }
                    />
                  }
                  classes={{}}
                />
              );
            },
            maxWidth: 70,
            sortable: false,
            filterable: false,
          },
        ],
      },
      {
        Header: () => {
          return <div style={{ textAlign: "center" }}>Chat Department</div>;
        },
        columns: [
          {
            Header: "Get Quote",
            width: 80,
            sortable: false,
            filterable: false,
            Cell: (record) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) =>
                        this.changeUserAccessType(e, record, "getQuoteLink")
                      }
                      checked={
                        record.original.AcccessType != null &&
                        record.original.AcccessType.includes("getQuoteLink")
                          ? true
                          : false
                      }
                    />
                  }
                  classes={{}}
                />
              );
            },
          },
          {
            Header: "Schedule Shipment",
            width: 120,
            sortable: false,
            filterable: false,
            Cell: (record) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) =>
                        this.changeUserAccessType(e, record, "scheduleLink")
                      }
                      checked={
                        record.original.AcccessType != null &&
                        record.original.AcccessType.includes("scheduleLink")
                          ? true
                          : false
                      }
                    />
                  }
                  classes={{}}
                />
              );
            },
          },
          {
            Header: "Track Shipment",
            width: 100,
            sortable: false,
            filterable: false,
            Cell: (record) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) =>
                        this.changeUserAccessType(
                          e,
                          record,
                          "trackShipmentLink"
                        )
                      }
                      checked={
                        record.original.AcccessType != null &&
                        record.original.AcccessType.includes(
                          "trackShipmentLink"
                        )
                          ? true
                          : false
                      }
                    />
                  }
                  classes={{}}
                />
              );
            },
          },
        ],
      },
      {
        Header: "Available For Chat",
        Cell: (record) => {
          if (record.original.IsAvailableForChat === "Yes") {
            return (
              <Button
                color="success"
                className="table-btn"
                onClick={() =>
                  this.activeInactiveAgentStatus(record.original.PersonId, 0)
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
                  this.activeInactiveAgentStatus(record.original.PersonId, 1)
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
    ];

    const KeywordListData = [
      {
        Header: "Id",
        accessor: "id",
        width: 50,
      },

      {
        Header: "Keyword",
        accessor: "keyword",
        width: 350,
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
                onClick={() => this.openDeleteRequestModal(record.original.id)}
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

    const KeywordListDataLinks = [
      {
        Header: "Id",
        accessor: "id",
        width: 50,
      },

      {
        Header: "Keyword",
        accessor: "keywords",
        width: 350,
        Cell: (record) => {
          return (
            <div>
              <ShowMoreText
                className="fullText"
                lines={2}
                more="Show more"
                less="Show less"
                anchorClass=""
                onClick={this.executeOnClick}
                expanded={false}
              >
                {record.original.keywords}
              </ShowMoreText>
            </div>
          );
        },
      },
      {
        Header: "Answer/URL",

        //accessor: "answer === null" ? "url" : "answer",
        //accessor: "answer",
        Cell: (row) => {
          const data = row.original;
          //data.answer === null ? data.url : data.answer;
          if (data.answer === null) {
            return data.url;
          } else {
            return data.answer;
          }
        },
        width: 350,
      },
      // {
      //   Header: "URL",
      //   accessor: "url",
      //   width: 75,
      // },
      {
        Header: "Link name",
        accessor: "link_name",
        width: 250,
        // body: this.stripeErrorTemplate.bind(this),
        Cell: (record) => {
          return (
            <div>
              <ShowMoreText
                className="fullText"
                lines={2}
                more="Show more"
                less="Show less"
                anchorClass=""
                onClick={this.executeOnClick}
                expanded={false}
              >
                {record.original.link_name}
              </ShowMoreText>
            </div>
          );
        },
      },
      {
        Header: "Delete",
        accessor: "delete",
        sortable: false,
        width: 50,
        // maxWidth: 80,
        Cell: (record) => {
          return (
            <div className="table-common-btn">
              <Button
                justIcon
                onClick={() =>
                  this.openDeleteRequestModalKeyword(record.original.id)
                }
                color="danger"
              >
                <i class="fas fa-trash"></i>
              </Button>
            </div>
          );
        },
        filterable: false,
      },

      {
        Header: "Edit",
        accessor: "edit",
        sortable: false,
        width: 50,
        // maxWidth: 80,
        Cell: (record) => {
          return (
            <div className="table-common-btn">
              <Button
                justIcon
                onClick={() => this.handleEdit(record)}
                color="info"
              >
                <i class="fas fa-edit"></i>
              </Button>
            </div>
          );
        },
        filterable: false,
      },
    ];

    return (
      <GridContainer className="UserList-outer">
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
        <GridItem xs={12}>
          <Card>
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <ForumOutlined />{" "}
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">Agent List</h4>
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
                <div className="shipment-pane" id="agentlist">
                  <ReactTable
                    data={AgentList}
                    minRows={0}
                    filterable
                    defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                    resizable={false}
                    columns={columns}
                    defaultPageSize={10}
                    showPaginationBottom={true}
                    className="-striped -highlight chatMgtList"
                  />
                </div>

                <div className="shipment-pane" id="keywordnotfound">
                  <ReactTable
                    data={KeywordList}
                    minRows={0}
                    filterable
                    textAlign={"left"}
                    defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                    resizable={false}
                    columns={KeywordListData}
                    defaultPageSize={10}
                    showPaginationBottom={true}
                    className="-striped -highlight chatMgtList"
                  />
                </div>

                <div className="shipment-pane" id="keywordmanage">
                  <Button color="primary" onClick={() => this.openDialog()}>
                    Add Keywords
                  </Button>
                  <ReactTable
                    data={KeywordListAllData}
                    minRows={0}
                    filterable
                    defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                    resizable={false}
                    columns={KeywordListDataLinks}
                    defaultPageSize={10}
                    showPaginationBottom={true}
                    className="-striped -highlight chatMgtList"
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </GridItem>
        <div>
          <Modal
            open={this.state.DeleteRequest}
            onClose={this.closedeletemodal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="requestModal">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Delete?
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Are you sure, you want to delete this chat?
              </Typography>

              <div>
                <Button onClick={this.closedeletemodal}>No</Button>
                <Button
                  color="danger"
                  onClick={() => this.handleDelete(this.state.DeleteRequestId)}
                >
                  Delete
                </Button>
              </div>
            </Box>
          </Modal>

          <Modal
            open={this.state.DeleteRequestKeyword}
            onClose={this.closedeletemodalKeyword}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="requestModal">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Delete?
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Are you sure, you want to delete this keyword?
              </Typography>

              <div>
                <Button onClick={this.closedeletemodalKeyword}>No</Button>
                <Button
                  color="danger"
                  onClick={() =>
                    this.handleDeleteKeyword(this.state.DeleteRequestIdKeyword)
                  }
                >
                  Delete
                </Button>
              </div>
            </Box>
          </Modal>
        </div>

        <div>
          <Dialog
            open={this.state.showKeywordDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <h3>Add Keyword</h3>
                    <CustomInput
                      labelText="Keywords"
                      id="proposaltype"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        value: this.state.keyword,
                        onChange: (event) =>
                          this.handleChangeFrom(event, "keyword"),
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <div className="radio-box mt-20">
                      <label className="full-width">
                        Selected Keyword Type
                      </label>
                      <label>
                        <Radio
                          name="Hyperlink"
                          value={this.state.hyperlink}
                          Hyperlink
                          checked={
                            this.state.selectedKeywordType === "Hyperlink"
                              ? true
                              : false
                          }
                          onChange={(event) => this.changevalueOption(event)}
                        />
                        HyperLink
                      </label>
                      <label>
                        <Radio
                          name="Answer"
                          value={this.state.answerType}
                          checked={
                            this.state.selectedKeywordType === "Answer"
                              ? true
                              : false
                          }
                          onChange={(event) => this.changevalueOption(event)}
                        />
                        Answer
                      </label>
                    </div>
                  </GridItem>
                  {this.state.selectedKeywordType === "Answer" ? (
                    <GridItem xs={12} sm={12} md={12}>
                      <CustomInput
                        labelText="Answer"
                        id="proposaltype"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          value: this.state.answer,
                          onChange: (event) =>
                            this.handleChangeFrom(event, "Answer"),
                        }}
                      />
                    </GridItem>
                  ) : null}

                  {this.state.selectedKeywordType === "Hyperlink" ? (
                    <div xs={12} sm={12} md={12}>
                      <GridItem xs={12} sm={12} md={12}>
                        <CustomInput
                          labelText="Url"
                          id="proposaltype"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            value: this.state.url,
                            onChange: (event) =>
                              this.handleChangeFrom(event, "Url"),
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12}>
                        <CustomInput
                          labelText="Url Name"
                          id="proposaltype"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            value: this.state.link_name,
                            onChange: (event) =>
                              this.handleChangeFrom(event, "Url Name"),
                          }}
                        />
                      </GridItem>
                    </div>
                  ) : null}

                  <GridItem xs={12} sm={12} md={12}>
                    <div className="radio-box mt-20">
                      <label className="full-width">
                        Selected Compare Type
                      </label>
                      <label>
                        <Radio
                          name="Equal"
                          value={this.state.equal}
                          checked={
                            this.state.selectedcompareType === "equal"
                              ? true
                              : false
                          }
                          onChange={(event) =>
                            this.changevalueOptionCompare(event)
                          }
                        />
                        Equal
                      </label>
                      <label>
                        <Radio
                          name="Compare"
                          value={this.state.compare}
                          checked={
                            this.state.selectedcompareType === "compare"
                              ? true
                              : false
                          }
                          onChange={(event) =>
                            this.changevalueOptionCompare(event)
                          }
                        />
                        Compare
                      </label>
                    </div>
                  </GridItem>
                </GridContainer>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.CloseDialog()} color="secondary">
                Cancel
              </Button>
              <Button onClick={() => this.updateKeywordData()} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </GridContainer>
    );
  }
}

export default ChatManagement;
