import React, { Component } from "react";
import ReactTable from "react-table";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import api from "../../utils/apiClient";
import SimpleBackdrop from "../../utils/general";
// import moment from "moment";
import cogoToast from "cogo-toast";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TextField from "@material-ui/core/TextField";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Checkbox from "@material-ui/core/Checkbox";
import { CommonConfig } from "../../utils/constant";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import Modal from "@material-ui/core/Modal";
import { Howl } from "howler";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
const moment = require("moment-timezone")
const logoimag = require("../../assets/img/logo.png");
const msgsound = require("../../messageSound/NewMessagenotification.mp3");
const msgRequestsound = require("../../messageSound/ChatRequest.mp3");
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
let divID;
var chatmessages;
var tempId = [];
var filterDataValue = [];
var tempRequest = [];
var isTempId = false;
var tabAlreeadyOpen = false;
const useStyles = makeStyles(styles);
const classes = () => {
  //return useStyles();
};
class ChatReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ChatListData: [],
      AllAccess: 0,
      Loading: false,
      transferchatto: "",
      transferchatFrom: "",
      loggedUser: 0,
      loggedUserName: "",
      finalLength: 0,
      IsAvailableForChat: 0,
      statusLabel: "",
      notListMode: false,
      neweChatRequestCount: 0,
      mounted: false,
      connectedCustomers: {},
      cusId: 0,
      currentTab: undefined,
      statusList: [],
      cusName: "",
      message: "",
      cancelRequest: false,
      cancelRequestArr: [],
      openRequestModal: false,
      openRequestModalToAgent: false,
      DeleteRequest: false,
      DeleteRequestId: 0,
      requestMessage: "",
      requestHeader: "",
      alreadyAccepted: false,
      cusStatusLine: "",
      hasDeleteAccesss: 0,
      checkAll: false,
      open: false,
      endchat: false,
      close: false,
      selectedAgent: "",
      options: [],
      endchatclose: false,
      chatlist: "",
      checkstaus: "",
      openedTab: [],
      selectedCustomerChatLoaded: [],
      checkdata: "",
      checkdata2: [
        { label: "New", value: "New" },
        { label: "In Progress", value: "In Progress" },
      ],
      AgentList: [],
      TempAgentList: [],
      showAgentList: false,
      popupclose: false,
      NewTab: [
        {
          stepName: "Chat List",
          stepId: "chatList",
          classname: "active",
        },
      ],
      IsDropDownShow: false,
      requestStatus: [
        { label: "All", value: "All", IsSelected: false, Index: 0 },
        {
          label: "In Progress",
          value: "In Progress",
          IsSelected: true,
          Index: 1,
        },
        { label: "New", value: "New", IsSelected: true, Index: 2 },
        { label: "Closed", value: "Closed", IsSelected: false, Index: 3 },
        {
          label: "Pending Agent",
          value: "Pending Agent",
          IsSelected: false,
          Index: 4,
        },
      ],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.state.mounted = true;

    this.getAgentList();
    this.setState({
      AllAccess: CommonConfig.getUserAccess("Chatbot").AllAccess,
      loggedUser: CommonConfig.loggedInUserData().PersonID,
      loggedUserName: CommonConfig.loggedInUserData().Name,
      hasDeleteAccesss: CommonConfig.getUserAccess("Chatbot").DeleteAccess,
    });

    let data = {
      cusid: 0,
      agentId: CommonConfig.loggedInUserData().PersonID,
    };

    this.setState({
      IsAvailableForChat: CommonConfig.loggedInUserData().IsAvailableForChat,
    });

    if (CommonConfig.loggedInUserData().IsAvailableForChat) {
      this.setState({ statusLabel: "Active" });
    } else {
      this.setState({ statusLabel: "Inactive" });
    }

    this.state.statusList.push(this.state.requestStatus[1]);
    this.state.statusList.push(this.state.requestStatus[2]);

    if (localStorage.getItem("openedTab")) {
      var openedTabData = JSON.parse(localStorage.getItem("openedTab"));

      openedTabData.forEach((val) => {
        this.state.NewTab.push({
          stepName: val.stepName,
          stepId: val.stepId,
          classname: "inactive",
        });
        this.createNewCustomerTab(val.stepId, val.stepName);
      });
    } else {
    }
    this.getChatList(data);
    this.searchfilter();
    this.getCustomerRequest();
    this.getChatCustomerRequestToAgentId();
  }

  soundPlay = () => {
    const sound = new Howl({
      src: msgsound,
      loop: false,
      html5: true,
    });
    sound.play();
  };
  soundPlayRequest = () => {
    const sound = new Howl({
      src: msgRequestsound,
      loop: false,
      html5: true,
    });

    sound.play();
  };

  navigateChange = (key) => {
    var newChatElements = {};

    let stepsList = this.state.NewTab;
    let activeIndex = stepsList.findIndex((x) => x.classname === "active");
    if (key !== activeIndex) {
      setTimeout(() => {
        stepsList[key]["classname"] = "active";
        stepsList[activeIndex]["classname"] = "inactive";
        this.setState({ Steps: stepsList });

        divID = stepsList[key]["stepId"];
        let activeDiv = stepsList[activeIndex]["stepId"];
        let selecteddiv = document.getElementById(divID);
        newChatElements.customerId = divID;
        newChatElements.window = selecteddiv;
        this.setCurrentTab(newChatElements);
        document.getElementById(divID).style.display = "block";
        document.getElementById(activeDiv).style.display = "none";

        if (key == 0) {
          let newLoadData = {
            cusid: 0,
            agentId: CommonConfig.loggedInUserData().PersonID,
          };
          this.getChatList(newLoadData);
        }
      }, 300);
    }
    if (key > 0) {
      setTimeout(() => {
        this.getChatData(divID);
        this.getCustomerStatus();
        if (!tabAlreeadyOpen) {
          let pData = {
            cusid: divID,
            agentId: this.state.loggedUser,
          };
          var isChatLoaded = false;
          if (this.state.selectedCustomerChatLoaded.length > 0) {
            this.state.selectedCustomerChatLoaded.map((value) => {
              if (divID == value.id && value.isChatloaded == true) {
                isChatLoaded = true;
              }
            });
          }

          if (!isChatLoaded) {
            this.getSelectedChatList(pData);
          }
        }
      }, 500);
    }
  };

  componentWillUnmount() {
    this.state.mounted = false;
    window.clearInterval(this.state.id);
  }
  updateIsAvailableForChat = (value) => {
    let pData = {
      agentId: CommonConfig.loggedInUserData().PersonID,
      IsAvailableForChat: value,
    };
    api.post("customerChat/updateAgentChatActiveStatus", pData).then((res) => {
      var sessionData = JSON.parse(localStorage.getItem("loggedInUserData"));
      if (res.Data.success == true) {
        if (value == false) {
          sessionData.IsAvailableForChat = 0;
          this.setState({ statusLabel: "Inactive" });
        } else {
          sessionData.IsAvailableForChat = 1;
          this.setState({ statusLabel: "Active" });
        }
        localStorage.setItem("loggedInUserData", JSON.stringify(sessionData));
        this.setState({ IsAvailableForChat: value });
        //this.getAgentList();
      }
    });
  };

  checkUserType(usertype) {
    return usertype;
  }

  getCustomerRequest = () => {
    let userType = CommonConfig.loggedInUserData().UserType;
    let userTypeArray = [];
    if (userType != undefined) {
      userTypeArray = userType.split(",");
    }

    var sessionData = JSON.parse(localStorage.getItem("loggedInUserData"));
    if (
      sessionData != null &&
      sessionData.IsAvailableForChat == 1 &&
      userType != ""
    ) {
      api.get("customerChat/getChatCustomerRequest", {}).then((res) => {
        if (res.success) {
          let requestData = res.Data[0];

          if (requestData.length > 0) {
            for (var i = 0; i < requestData.length; i++) {
              let userTypeIndex = userTypeArray.indexOf(
                requestData[i].SelectedCategory
              );

              let obj = this.state.cancelRequestArr.find(
                (o) => o.id === requestData[i].ID
              );

              let localobj = JSON.parse(localStorage.getItem("cancelReqData"));
              let localobjidx;
              // if (localobj != null && localobj != undefined) {

              // }

              if (localobj != null && localobj != undefined) {
                localobjidx = localobj.findIndex(
                  (val) => val.id == requestData[i].ID
                );
                if (
                  localobjidx != undefined &&
                  localobjidx != -1 &&
                  localobj[localobjidx].id == requestData[i].ID &&
                  localobj[localobjidx].decline == false
                ) {
                  // if (
                  //   !tempRequest.includes(requestData[i].ID) ||
                  //   tempRequest.length == 0
                  // ) {
                  if (
                    userTypeIndex != undefined &&
                    userTypeIndex != null &&
                    userTypeIndex != -1
                  ) {
                    this.soundPlay();
                    const url = window.location.href;

                    tempRequest.push(requestData[i].ID);
                    var modal = document.getElementById("myModel");
                    document.getElementById("myModal").style.display = "block";
                    // var modal2 = document.getElementById("myModalforAgent");
                    // modal2.style.display = "block";
                    // document.getElementById("chatModalP").innerHTML =
                    //   requestData[i].Name + " is requesting for chat";
                    if (url.includes("Chatbot")) {
                      this.soundPlayRequest();
                    }

                    this.setState({
                      requestHeader: "New Request",
                      requestMessage:
                        requestData[i].Name + " is requesting for chat",
                      openRequestModal: true,

                      cusId: requestData[i].ID,
                      cusName: requestData[i].Name,
                    });
                    // }
                  }
                } else {
                  if (localStorage.getItem("cancelReqData")) {
                    let newlocalobj = JSON.parse(
                      localStorage.getItem("cancelReqData")
                    );

                    let localobjidxnew = newlocalobj.findIndex(
                      (val) => val.id == requestData[i].ID
                    );

                    if (
                      localobjidxnew == undefined ||
                      localobjidxnew == null ||
                      localobjidxnew == -1
                    ) {
                      this.state.cancelRequestArr.push({
                        id: requestData[i].ID,
                        decline: false,
                      });
                      newlocalobj.push({
                        id: requestData[i].ID,
                        decline: false,
                      });

                      localStorage.setItem(
                        "cancelReqData",
                        JSON.stringify(newlocalobj)
                      );
                    }
                  } else {
                    this.state.cancelRequestArr.push({
                      id: requestData[i].ID,
                      decline: false,
                    });
                    localStorage.setItem(
                      "cancelReqData",
                      JSON.stringify(this.state.cancelRequestArr)
                    );
                  }
                }
              } else {
                if (localStorage.getItem("cancelReqData")) {
                  let localobj2 = JSON.parse(
                    localStorage.getItem("cancelReqData")
                  );
                  let localobjidx2 = localobj2.findIndex(
                    (val) => val.id == requestData[i].ID
                  );

                  if (
                    localobjidx2 == undefined ||
                    localobjidx2 == null ||
                    localobjidx2 == -1
                  ) {
                    this.state.cancelRequestArr.push({
                      id: requestData[i].ID,
                      decline: false,
                    });
                    localobj2.push({
                      id: requestData[i].ID,
                      decline: false,
                    });

                    localStorage.setItem(
                      "cancelReqData",
                      JSON.stringify(localobj2)
                    );
                  }
                } else {
                  this.state.cancelRequestArr.push({
                    id: requestData[i].ID,
                    decline: false,
                  });
                  localStorage.setItem(
                    "cancelReqData",
                    JSON.stringify(this.state.cancelRequestArr)
                  );
                }
              }
            }
          } else {
            // modal.style.display = "none";
            this.setState({ openRequestModal: false });
          }
        }
      });
    } else {
      // modal.style.display = "none";
      this.setState({ openRequestModal: false });
    }
    setTimeout(() => {
      // if (this.state.cancelRequest == false) {
      this.getCustomerRequest();
      // }
    }, 4000);
  };

  getChatCustomerRequestToAgentId = () => {
    console.log("chat report..");
    let userType = CommonConfig.loggedInUserData().UserType;
    let userTypeArray = [];
    if (userType != undefined) {
      userTypeArray = userType.split(",");
    }

    var sessionData = JSON.parse(localStorage.getItem("loggedInUserData"));
    if (
      sessionData != null &&
      sessionData.IsAvailableForChat == 1 &&
      userType != ""
    ) {
      let data = { AgentId: CommonConfig.loggedInUserData().PersonID };
      api
        .post("customerChat/getChatCustomerRequestToAgentId", data)
        .then((res) => {
          if (res.success) {
            //let requestData = res.Data[0];
            if (res.Data.length > 0) {
              this.setState({
                transferchatto: sessionData.Name,
                transferchatFrom: res.Data[0].TransferchatFrom,
              });

              var requestData = [(requestData = res.Data[0])];

              if (requestData.length > 0) {
                for (var i = 0; i < requestData.length; i++) {
                  let userTypeIndex = userTypeArray.indexOf(
                    requestData[i].SelectedCategory
                  );

                  let obj = this.state.cancelRequestArr.find(
                    (o) => o.id === requestData[i].ID
                  );

                  let localobj = JSON.parse(
                    localStorage.getItem("cancelReqData")
                  );
                  let localobjidx;
                  // if (localobj != null && localobj != undefined) {

                  // }

                  if (localobj != null && localobj != undefined) {
                    localobjidx = localobj.findIndex(
                      (val) => val.id == requestData[i].ID
                    );
                    if (
                      localobjidx != undefined &&
                      localobjidx != -1 &&
                      localobj[localobjidx].id == requestData[i].ID &&
                      localobj[localobjidx].decline == false
                    ) {
                      // if (
                      //   !tempRequest.includes(requestData[i].ID) ||
                      //   tempRequest.length == 0
                      // ) {
                      // if (
                      //   userTypeIndex != undefined &&
                      //   userTypeIndex != null &&
                      //   userTypeIndex != -1
                      // ) {
                      this.soundPlay();
                      const url = window.location.href;

                      tempRequest.push(requestData[i].ID);
                      // var modal = document.getElementById("myModel");
                      // document.getElementById("myModal").style.display = "block";
                      var modal2 = document.getElementById("myModalforAgent");
                      // modal2.style.display = "block";
                      document.getElementById("myModalforAgent").style.display =
                        "block";
                      // document.getElementById("chatModalP").innerHTML =
                      //   requestData[i].Name + " is requesting for chat";
                      if (url.includes("Chatbot")) {
                        this.soundPlayRequest();
                      }

                      this.setState({
                        requestHeader: "Chat Request ",
                        requestMessage:
                          "chat transfer request from " +
                          this.state.transferchatFrom +
                          " to " +
                          this.state.transferchatto,
                        openRequestModalToAgent: true,
                        cusId: requestData[i].ID,
                        cusName: requestData[i].Name,
                      });
                      // }
                      // }
                    } else {
                      if (localStorage.getItem("cancelReqData")) {
                        let newlocalobj = JSON.parse(
                          localStorage.getItem("cancelReqData")
                        );

                        let localobjidxnew = newlocalobj.findIndex(
                          (val) => val.id == requestData[i].ID
                        );

                        if (
                          localobjidxnew == undefined ||
                          localobjidxnew == null ||
                          localobjidxnew == -1
                        ) {
                          this.state.cancelRequestArr.push({
                            id: requestData[i].ID,
                            decline: false,
                          });
                          newlocalobj.push({
                            id: requestData[i].ID,
                            decline: false,
                          });

                          localStorage.setItem(
                            "cancelReqData",
                            JSON.stringify(newlocalobj)
                          );
                        }
                      } else {
                        this.state.cancelRequestArr.push({
                          id: requestData[i].ID,
                          decline: false,
                        });
                        localStorage.setItem(
                          "cancelReqData",
                          JSON.stringify(this.state.cancelRequestArr)
                        );
                      }
                    }
                  } else {
                    if (localStorage.getItem("cancelReqData")) {
                      let localobj2 = JSON.parse(
                        localStorage.getItem("cancelReqData")
                      );
                      let localobjidx2 = localobj2.findIndex(
                        (val) => val.id == requestData[i].ID
                      );

                      if (
                        localobjidx2 == undefined ||
                        localobjidx2 == null ||
                        localobjidx2 == -1
                      ) {
                        this.state.cancelRequestArr.push({
                          id: requestData[i].ID,
                          decline: false,
                        });
                        localobj2.push({
                          id: requestData[i].ID,
                          decline: false,
                        });

                        localStorage.setItem(
                          "cancelReqData",
                          JSON.stringify(localobj2)
                        );
                      }
                    } else {
                      this.state.cancelRequestArr.push({
                        id: requestData[i].ID,
                        decline: false,
                      });
                      localStorage.setItem(
                        "cancelReqData",
                        JSON.stringify(this.state.cancelRequestArr)
                      );
                    }
                  }
                }
              } else {
                // modal.style.display = "none";

                this.setState({ openRequestModalToAgent: false });
              }
            }
          }
        });
    } else {
      // modal.style.display = "none";

      this.setState({ openRequestModalToAgent: false });
    }
    if (this.state.alreadyAccepted === false) {
      setTimeout(() => {
        // if (this.state.cancelRequest == false) {
        this.getChatCustomerRequestToAgentId();
        // }
      }, 4000);
    }
  };
  scrollToBottom() {
    this.state.currentTab.window.childNodes[0].childNodes[1].scrollTop = this.state.currentTab.window.childNodes[0].childNodes[1].scrollHeight;
  }

  urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
      return (
        '<a style="color: #fff; text-decoration: underline;" target="_blank" href="' +
        url +
        '">' +
        url +
        "</a>"
      );
    });
  }

  chatMessageRight(newMessage, msgTime, cusid) {
    var chatMsgRow = document.createElement("div");
    chatMsgRow.setAttribute("class", "chat-message-row");

    var chatMsgRight = document.createElement("div");
    chatMsgRight.setAttribute("class", "chat-message right");

    var chatMsgSpan = document.createElement("span");
    var chatMsgImage = document.createElement("img");

    chatMsgImage.setAttribute("src", logoimag);

    var chatMsgTime = document.createElement("span");
    chatMsgTime.setAttribute("class", "msg-time");
    chatMsgTime.innerHTML = msgTime;

    var chatMsgText = document.createElement("p");
    chatMsgText.innerHTML = newMessage;

    chatMsgSpan.append(chatMsgImage);
    chatMsgRight.append(chatMsgSpan);
    chatMsgRight.append(chatMsgTime);
    chatMsgRight.append(chatMsgText);

    chatMsgRow.append(chatMsgRight);

    // this.state.currentTab.window.childNodes[0].childNodes[1].append(chatMsgRow);

    if (cusid != "") {
      if (this.state.currentTab.customerId == cusid) {
        this.state.currentTab.window.childNodes[0].childNodes[1].append(
          chatMsgRow
        );
      }
    } else {
      this.state.currentTab.window.childNodes[0].childNodes[1].append(
        chatMsgRow
      );
    }
  }
  chatMessageLeft(newMessage, msgTime, cusid) {
    var chatMsgRow = document.createElement("div");
    chatMsgRow.setAttribute("class", "chat-message-row");

    var chatMsgLeft = document.createElement("div");
    chatMsgLeft.setAttribute("class", "chat-message left");

    var chatMsgTime = document.createElement("span");
    chatMsgTime.setAttribute("class", "msg-time");
    chatMsgTime.innerHTML = msgTime;

    var chatMsgText = document.createElement("p");
    chatMsgText.innerHTML = newMessage;

    chatMsgLeft.append(chatMsgTime);
    chatMsgLeft.append(chatMsgText);

    chatMsgRow.append(chatMsgLeft);

    if (cusid != "") {
      if (this.state.currentTab.customerId == cusid) {
        this.state.currentTab.window.childNodes[0].childNodes[1].append(
          chatMsgRow
        );
      }
    } else {
      this.state.currentTab.window.childNodes[0].childNodes[1].append(
        chatMsgRow
      );
    }
  }

  loadjoinNotification(msg) {
    var notifyMain = document.createElement("div");
    notifyMain.setAttribute("class", "chat-message-row");

    var agentjoin = document.createElement("div");
    agentjoin.setAttribute("class", "agent-joined-alert");

    var notifymsg = document.createElement("p");
    // var msg = CommonConfig.loggedInUserData().Name + " joined the chat";
    notifymsg.innerHTML = msg;

    agentjoin.append(notifymsg);
    notifyMain.append(agentjoin);

    this.state.currentTab.window.childNodes[0].childNodes[1].append(notifyMain);
  }

  joinNotification() {
    var notifyMain = document.createElement("div");
    notifyMain.setAttribute("class", "chat-message-row");

    var agentjoin = document.createElement("div");
    agentjoin.setAttribute("class", "agent-joined-alert");

    var notifymsg = document.createElement("p");
    var msg =
      CommonConfig.loggedInUserData().Name +
      " joined the chat at " +
      moment()
        .tz("America/Chicago")
        .format("MM/DD/YYYY hh:mm A");
    notifymsg.innerHTML = msg;

    agentjoin.append(notifymsg);
    notifyMain.append(agentjoin);

    this.state.currentTab.window.childNodes[0].childNodes[1].append(notifyMain);

    var insertChatData = {
      ChatId: divID,
      CustomerId: divID,
      ProviderId: this.state.loggedUser,
      LineText: msg,
      LineFrom: "notification",
    };

    api
      .post("customerChat/insertChatMasterData", insertChatData)
      .then((res) => {});
  }

  AgentNotification(inputdata) {
    //111this.state.AgentList.map
    var username = [];
    this.state.AgentList.map((x) => {
      if (x.PersonId == inputdata.Agentid) {
        username.push(x);
        console.log("name..", username[0].Name);
      }
    });

    var notifyMain = document.createElement("div");
    notifyMain.setAttribute("class", "chat-message-row");

    var agentjoin = document.createElement("div");
    agentjoin.setAttribute("class", "agent-joined-alert");

    var notifymsg = document.createElement("p");
    var msg =
      "Chat is transfer to " +
      username[0].Name +
      " please wait till he accepts " +
      moment()
        .tz("America/Chicago")
        .format("MM/DD/YYYY hh:mm A");
    notifymsg.innerHTML = msg;

    agentjoin.append(notifymsg);
    notifyMain.append(agentjoin);

    this.state.currentTab.window.childNodes[0].childNodes[1].append(notifyMain);

    var insertChatData = {
      ChatId: divID,
      CustomerId: divID,
      ProviderId: this.state.loggedUser,
      LineText: msg,
      LineFrom: "notification",
    };

    api
      .post("customerChat/insertChatMasterData", insertChatData)
      .then((res) => {});
  }
  CancelAgentNotification(inputdata) {
    var notifyMain = document.createElement("div");
    notifyMain.setAttribute("class", "chat-message-row");

    var agentjoin = document.createElement("div");
    agentjoin.setAttribute("class", "agent-joined-alert");

    var notifymsg = document.createElement("p");
    var msg =
      "Agent is not available at that time so chat transfer to chatbot" +
      moment()
        .tz("America/Chicago")
        .format("MM/DD/YYYY hh:mm A");
    notifymsg.innerHTML = msg;

    agentjoin.append(notifymsg);
    notifyMain.append(agentjoin);

    this.state.currentTab.window.childNodes[0].childNodes[1].append(notifyMain);

    var insertChatData = {
      ChatId: inputdata,
      CustomerId: divID,
      ProviderId: this.state.loggedUser,
      LineText: msg,
      LineFrom: "notification",
    };

    api
      .post("customerChat/insertChatMasterData", insertChatData)
      .then((res) => {});
  }
  loadLeftNotification(msg) {
    var notifyMain = document.createElement("div");
    notifyMain.setAttribute("class", "chat-message-row");

    var agentjoin = document.createElement("div");
    agentjoin.setAttribute("class", "agent-joined-alert");

    var notifymsg = document.createElement("p");
    // var msg = CommonConfig.loggedInUserData().Name + " joined the chat";
    notifymsg.innerHTML = msg;

    agentjoin.append(notifymsg);
    notifyMain.append(agentjoin);

    this.state.currentTab.window.childNodes[0].childNodes[1].append(notifyMain);
  }

  leftNotification() {
    var notifyMain = document.createElement("div");
    notifyMain.setAttribute("class", "chat-message-row");

    var agentjoin = document.createElement("div");
    agentjoin.setAttribute("class", "agent-joined-alert");

    var notifymsg = document.createElement("p");
    var msg =
      CommonConfig.loggedInUserData().Name +
      " left the chat at " +
      moment()
        .tz("America/Chicago")
        .format("MM/DD/YYYY hh:mm A");
    notifymsg.innerHTML = msg;

    agentjoin.append(notifymsg);
    notifyMain.append(agentjoin);

    this.state.currentTab.window.childNodes[0].childNodes[1].append(notifyMain);

    var insertChatData = {
      ChatId: divID,
      CustomerId: divID,
      ProviderId: this.state.loggedUser,
      LineText: msg,
      LineFrom: "notification",
    };

    api
      .post("customerChat/insertChatMasterData", insertChatData)
      .then((res) => {});
  }

  sendMessage = (event) => {
    event.preventDefault();
    var messageText = document.getElementById("m").value;
    var dt = new Date();

    var text = messageText;
    var html = this.urlify(text);

    //================== CREATE LI TAG FOR MESSAGE STORE ===========================
    if (messageText != "") {
      var msgTime =
        "You" +
        " - " +
        moment()
          .tz("America/Chicago")
          .format("MM/DD/YYYY hh:mm A");

      this.chatMessageRight(html, msgTime, "");

      var shouldScroll =
        this.state.currentTab.window.childNodes[0].childNodes[1].scrollTop +
          this.state.currentTab.window.childNodes[0].childNodes[1]
            .clientHeight ===
        this.state.currentTab.window.childNodes[0].childNodes[1].scrollHeight;
      if (!shouldScroll) {
        this.scrollToBottom();
      }
      //================== CREATE LI TAG FOR MESSAGE STORE END===========================
      this.setState({ message: "" });
      document.getElementById("m").value = "";
      var insertChatData = {
        ChatId: divID,
        CustomerId: divID,
        ProviderId: this.state.loggedUser,
        LineText: html,
        LineFrom: "Operator",
      };

      api
        .post("customerChat/insertChatMasterData", insertChatData)
        .then((res) => {});
    }
  };

  setCurrentTab = (target) => {
    if (this.state.currentTab === target) return;
    this.state.currentTab = target;
    var contentWrapper = document.querySelectorAll("#newuser");
    [].forEach.call(contentWrapper, function(el) {
      el.style.display = "none";
    });
    target.window.style.display = "block";
  };
  trasferchatToAgent = () => {
    let data = {
      Agentid: this.state.selectedAgent,
      chatid: divID,
      assignBy: this.state.loggedUserName,
    };

    this.AgentNotification(data);

    api.post("customerChat/trasferchatToAgent", data).then((res) => {
      this.hideLoador();
      if (res.success) {
        cogoToast.success("chat transfer successfully");
        this.setState({
          popupclose: true,
          showAgentList: false,
          selectedAgent: "",
        });
      }
    });
  };

  transferchat = () => {
    this.setState({ showAgentList: true });
  };
  getAgentList() {
    api.post("chatManagementAPI/getAgentList", {}).then((res) => {
      if (res.success) {
        var tempstore = [];
        for (var i = 0; i < res.data[0].length; i++) {
          if (res.data[0][i].IsAvailableForChat === "Yes") {
            tempstore.push(res.data[0][i]);
          }
        }
        this.setState({ AgentList: tempstore });
        this.setState({ options: tempstore });
        console.log("22222222", tempstore);

        // res.data[0].map((x) =>{} x.IsAvailableForChat === "Yes"
        // this.state.AgentList.push(x));
        //  this.setState({ AgentList: res.data[0] });
        // res.Data[0].map((x) => {
        //   debugger;
        //   if (x.IsAvailableForChat == "Yes") {
        //     this.state.AgentList.push(x);
        //   }
        // });
        //
      }
    });
    setTimeout(() => {
      //this.setState({ TempAgentLst: [] });
      this.getAgentList();
    }, 4000);
  }
  createNewCustomerTab = (customerId, name) => {
    var newChatElements = {};
    newChatElements.customerId = customerId;
    newChatElements.window = document.createElement("ul");
    newChatElements.window.style.display = "none";
    newChatElements.window.setAttribute("class", "chat-window");
    newChatElements.window.setAttribute("id", "newuser");

    this.state.connectedCustomers[customerId] = newChatElements;

    setTimeout(() => {
      document.getElementById("chatWindows").append(newChatElements.window);
    }, 2000);

    if (!this.state.currentTab) {
      this.setCurrentTab(newChatElements);
    }
  };

  updateCustomerData = (tempId) => {
    let acceptData = {
      from: "operator",
      isConnectedWithAgent: 0,
      cusid: tempId,
      providerId: this.state.loggedUser,
    };
    api.post("customerChat/updateCustomerData", acceptData).then((res) => {});
  };

  acceptRequest = () => {
    this.showLoador();

    let acceptData = {
      from: "operator",
      isConnectedWithAgent: 1,
      cusid: this.state.cusId,
      providerId: this.state.loggedUser,
    };

    let agentConnectionData = {
      cusId: this.state.cusId,
    };

    api
      .post("customerChat/getIsAgentConnected", agentConnectionData)
      .then((res) => {
        let isConnectedWithAgent = res.Data[0].IsConnectedWithAgent;

        if (isConnectedWithAgent == 0) {
          api
            .post("customerChat/updateCustomerData", acceptData)
            .then((res) => {
              this.setState({ openRequestModal: false });
              // this.setState({ openRequestModalToAgent: false });
              var modal = document.getElementById("myModal");
              modal.style.display = "none";
              this.hideLoador();

              tabAlreeadyOpen = false;

              this.addOpenTabSessionData(this.state.cusName, this.state.cusId);

              for (var i = 0; i < this.state.NewTab.length; i++) {
                if (this.state.NewTab[i].stepId == this.state.cusId) {
                  tabAlreeadyOpen = true;
                  break;
                } else {
                  tabAlreeadyOpen = false;
                }
              }

              if (tabAlreeadyOpen) {
                let activeIndex = this.state.NewTab.findIndex(
                  (x) => x.stepId === this.state.cusId
                );
                this.navigateChange(activeIndex);
              } else {
                this.state.NewTab.push({
                  stepName: this.state.cusName,
                  stepId: this.state.cusId,
                  classname: "inactive",
                });
                this.createNewCustomerTab(this.state.cusId, this.state.cusName);
                let activeIndex = this.state.NewTab.findIndex(
                  (x) => x.stepId === this.state.cusId
                );
                this.navigateChange(activeIndex);
              }

              let newLoadData = {
                cusid: 0,
                agentId: CommonConfig.loggedInUserData().PersonID,
              };
              this.getChatList(newLoadData);

              setTimeout(() => {
                this.joinNotification();
              }, 2000);
            });
        } else {
          this.hideLoador();

          this.setState({
            requestHeader: "Sorry!",
            alreadyAccepted: true,
            openRequestModal: true,
            // openRequestModalToAgent: true,
            requestMessage: "Chat already accepted",
          });
          var modal = document.getElementById("myModal");
          document.getElementById("myModal").style.display = "block";
        }
      });
  };
  acceptRequestToAgent = () => {
    debugger;
    let acceptData = {
      from: "operator",
      isConnectedWithAgent: 1,
      cusid: this.state.cusId,
      providerId: this.state.loggedUser,
    };

    let agentConnectionData = {
      cusId: this.state.cusId,
    };

    api
      .post("customerChat/getIsAgentConnected", agentConnectionData)
      .then((res) => {
        let isConnectedWithAgent = res.Data[0].IsConnectedWithAgent;
        let isStatus = res.Data[0].Status;
        if (isConnectedWithAgent == 0 || isStatus == "Pending Agent") {
          api
            .post("customerChat/updateCustomerData", acceptData)
            .then((res) => {
              this.setState({
                openRequestModal: false,
                //  openRequestModal: true,
              });
              this.setState({ openRequestModalToAgent: false });
              var modal = document.getElementById("myModalforAgent");
              modal.style.display = "none";
              this.hideLoador();

              tabAlreeadyOpen = false;

              this.addOpenTabSessionData(this.state.cusName, this.state.cusId);

              for (var i = 0; i < this.state.NewTab.length; i++) {
                if (this.state.NewTab[i].stepId == this.state.cusId) {
                  tabAlreeadyOpen = true;
                  break;
                } else {
                  tabAlreeadyOpen = false;
                }
              }

              if (tabAlreeadyOpen) {
                let activeIndex = this.state.NewTab.findIndex(
                  (x) => x.stepId === this.state.cusId
                );
                this.navigateChange(activeIndex);
              } else {
                this.state.NewTab.push({
                  stepName: this.state.cusName,
                  stepId: this.state.cusId,
                  classname: "inactive",
                });
                this.createNewCustomerTab(this.state.cusId, this.state.cusName);
                let activeIndex = this.state.NewTab.findIndex(
                  (x) => x.stepId === this.state.cusId
                );
                this.navigateChange(activeIndex);
              }

              let newLoadData = {
                cusid: 0,
                agentId: CommonConfig.loggedInUserData().PersonID,
              };
              this.getChatList(newLoadData);

              setTimeout(() => {
                this.joinNotification();
              }, 2000);
            });
        } else {
          this.hideLoador();
          document.getElementById("myModalforAgent").style.display = "none";
          this.setState({
            //   requestHeader: "Sorry!",
            openRequestModal: true,
            //   openRequestModalToAgent: true,
            //   requestMessage: "Chat already accepted",
          });
          // var modal = document.getElementById("myModalforAgent");
          // document.getElementById("myModalforAgent").style.display = "block";
        }
      });
  };
  closeTab = (e) => {
    let currentTabIndex;
    if (tempRequest.length > 0) {
      currentTabIndex = tempRequest.indexOf(divID);
    }

    if (currentTabIndex > -1) {
      tempRequest.splice(currentTabIndex, 1);
    }

    if (e.target.title == "closeIcon") {
      this.showLoador();
      setTimeout(() => {
        this.navigateChange(0);
        var tempId = divID;
        setTimeout(() => {
          const index = this.state.NewTab.findIndex((x) => x.stepId == tempId);
          if (index > -1) {
            this.state.NewTab.splice(index, 1);
          }
          this.hideLoador();
          this.removeOpenTabSessionData(tempId);
          let selectedCustomerChatLoadedIndex;
          if (this.state.selectedCustomerChatLoaded.length > 0) {
            selectedCustomerChatLoadedIndex = this.state.selectedCustomerChatLoaded.findIndex(
              (x) => x.id == tempId
            );
          }

          if (selectedCustomerChatLoadedIndex > -1) {
            this.state.selectedCustomerChatLoaded.splice(
              selectedCustomerChatLoadedIndex,
              1
            );
          }
        }, 600);
        this.hideLoador();
      }, 2000);
    } else {
      this.leftNotification(); // Agent left notification

      this.showLoador();
      setTimeout(() => {
        this.navigateChange(0);
        var tempId = divID;
        this.updateCustomerData(tempId);
        setTimeout(() => {
          const index = this.state.NewTab.findIndex((x) => x.stepId == tempId);
          if (index > -1) {
            this.state.NewTab.splice(index, 1);
          }
          let newLoadData = {
            cusid: 0,
            agentId: CommonConfig.loggedInUserData().PersonID,
          };
          this.getChatList(newLoadData);
          this.removeOpenTabSessionData(tempId);
          let selectedCustomerChatLoadedIndex;
          if (this.state.selectedCustomerChatLoaded.length > 0) {
            selectedCustomerChatLoadedIndex = this.state.selectedCustomerChatLoaded.findIndex(
              (x) => x.id == tempId
            );
          }

          if (selectedCustomerChatLoadedIndex > -1) {
            this.state.selectedCustomerChatLoaded.splice(
              selectedCustomerChatLoadedIndex,
              1
            );
          }
        }, 600);
        this.hideLoador();
      }, 2000);
    }
  };

  getCustomerStatus = () => {
    let statusData = {
      cusid: divID,
    };
    api.post("customerChat/getCustomerStatus", statusData).then((res) => {
      if (res.Data[0].length > 0) {
        if (res.Data[0][0].isConnected == 0) {
          this.setState({ cusStatusLine: "Customer is disconnected" });
          var form = document.getElementById("chat-form");
          var elements = form.elements;
          for (var i = 0, len = elements.length; i < len; ++i) {
            // elements[i].readOnly = true;
            //elements[i].style.opacity = 0.5;
            // elements[i].disabled = true;
            elements[i].style.cursor = "pointer";
          }
          // this.showLoador();
          // setTimeout(() => {
          //   this.navigateChange(0);
          //   var tempId = divID;
          //   setTimeout(() => {
          //     const index = this.state.NewTab.findIndex(
          //       (x) => x.stepId == tempId
          //     );
          //     if (index > -1) {
          //       this.state.NewTab.splice(index, 1);
          //     }
          //   }, 600);
          //   this.hideLoador();
          // }, 5000);
        } else {
          if (this.state.mounted) {
            this.getCustomerStatus();
          }
        }
      }
    });
  };

  closemodal = (val) => {
    this.setState({
      cancelRequest: true,
      openRequestModal: false,
      openRequestModalToAgent: false,
    });
    var modal = document.getElementById("myModal");
    document.getElementById("myModal").style.display = "none";
    var cookiedata = JSON.parse(localStorage.getItem("cancelReqData"));
    let cookieidx = cookiedata.findIndex((i) => i.id == val);
    cookiedata[cookieidx].decline = true;
    localStorage.setItem("cancelReqData", JSON.stringify(cookiedata));
    let data = {
      chatid: cookiedata[0].id,
    };

    api
      .post("customerChat/CancelRequestByAgentandtrasferchatbot", data)
      .then((res) => {});
    //this.CancelAgentNotification(data.chatid);
  };
  closemodalToAgent = (val) => {
    this.setState({
      cancelRequest: true,
      openRequestModal: false,
      openRequestModalToAgent: false,
    });
    var modal = document.getElementById("myModalforAgent");
    document.getElementById("myModalforAgent").style.display = "none";
    var cookiedata = JSON.parse(localStorage.getItem("cancelReqData"));
    let cookieidx = cookiedata.findIndex((i) => i.id == val);
    cookiedata[cookieidx].decline = true;
    localStorage.setItem("cancelReqData", JSON.stringify(cookiedata));

    let data = {
      chatid: cookiedata[0].id,
    };

    // this.CancelAgentNotification(data.chatid);
    api.post("customerChat/CancelRequestByAgent", data).then((res) => {});
    this.CancelAgentNotification(data.chatid);
  };

  getChatData = (cusId) => {
    var chatData = {
      cusId: cusId,
      from: "operator",
    };
    api.post("customerChat/getChatData", chatData).then((res) => {
      if (res.Data[0].length > 0) {
        if (tempId.length > 0) {
          if (tempId.includes(res.Data[0][0].ID)) {
            isTempId = false;
          } else {
            isTempId = true;
          }
        } else {
          isTempId = true;
        }

        if (isTempId) {
          if (this.state.currentTab.customerId == res.Data[0][0].CustomerId) {
            this.soundPlay();
            tempId.push(res.Data[0][0].ID);
            var messageText = res.Data[0][0].LineText;
            var msgTime = moment()
              .tz("America/Chicago")
              .format("hh:mm A");
            this.chatMessageLeft(messageText, msgTime, "");
            var shouldScroll =
              this.state.currentTab.window.childNodes[0].childNodes[1]
                .scrollTop +
                this.state.currentTab.window.childNodes[0].childNodes[1]
                  .clientHeight ===
              this.state.currentTab.window.childNodes[0].childNodes[1]
                .scrollHeight;
            if (!shouldScroll) {
              this.scrollToBottom();
            }
          }
        }
      }
    });
    setTimeout(() => {
      this.getChatData(cusId);
    }, 2500);
  };

  generateLink() {}

  getSelectedChatList = (pData) => {
    this.showLoador();
    api.post("customerChat/getChatList", pData).then((res) => {
      this.hideLoador();
      this.state.selectedCustomerChatLoaded.push({
        id: divID,
        isChatloaded: true,
      });
      for (var i = 0; i < res.Data[0].length; i++) {
        if (res.Data[0][i].LineFrom == "Operator") {
          if (res.Data[0][i].IsLink == "Yes") {
            var htmltemp = res.Data[0][i].LinkTemplate;
            var linkhtml = document.createElement("div");
            linkhtml.innerHTML = htmltemp;
            this.state.currentTab.window.childNodes[0].childNodes[1].append(
              linkhtml
            );
          } else {
            var msgTime =
              res.Data[0][i].AgentName +
              " - " +
              moment(res.Data[0][i].CreatedOn)
                .tz("America/Chicago")
                .format("MM/DD/YYYY hh:mm A");
            this.chatMessageRight(
              res.Data[0][i].LineText,
              msgTime,
              pData.cusid
            );
            setTimeout(() => {
              var shouldScroll =
                this.state.currentTab.window.childNodes[0].childNodes[1]
                  .scrollTop +
                  this.state.currentTab.window.childNodes[0].childNodes[1]
                    .clientHeight ===
                this.state.currentTab.window.childNodes[0].childNodes[1]
                  .scrollHeight;
              if (!shouldScroll) {
                this.scrollToBottom();
              }
            }, 1000);
          }
        } else if (res.Data[0][i].LineFrom == "Customer") {
          var msgTime = moment(res.Data[0][i].CreatedOn)
            .tz("America/Chicago")
            .format("MM/DD/YYYY hh:mm A");
          this.chatMessageLeft(res.Data[0][i].LineText, msgTime, pData.cusid);
          setTimeout(() => {
            var shouldScroll =
              this.state.currentTab.window.childNodes[0].childNodes[1]
                .scrollTop +
                this.state.currentTab.window.childNodes[0].childNodes[1]
                  .clientHeight ===
              this.state.currentTab.window.childNodes[0].childNodes[1]
                .scrollHeight;
            if (!shouldScroll) {
              this.scrollToBottom();
            }
          }, 1000);
        } else if (res.Data[0][i].LineFrom == "notification") {
          if (res.Data[0][i].LineText.includes("joined")) {
            this.loadjoinNotification(res.Data[0][i].LineText);
          } else {
            this.loadLeftNotification(res.Data[0][i].LineText);
          }
        } else {
          var msgTime =
            res.Data[0][i].AgentName +
            " - " +
            moment(res.Data[0][i].CreatedOn)
              .tz("America/Chicago")
              .format("MM/DD/YYYY hh:mm A");
          this.chatMessageRight(res.Data[0][i].LineText, msgTime, pData.cusid);
          setTimeout(() => {
            var shouldScroll =
              this.state.currentTab.window.childNodes[0].childNodes[1]
                .scrollTop +
                this.state.currentTab.window.childNodes[0].childNodes[1]
                  .clientHeight ===
              this.state.currentTab.window.childNodes[0].childNodes[1]
                .scrollHeight;
            if (!shouldScroll) {
              this.scrollToBottom();
            }
          }, 1000);
        }
      }
    });
  };
  getChatList = (pData) => {
    this.showLoador();
    api.post("customerChat/getChatList", pData).then((res) => {
      if (res.success) {
        if (res.Data[0].length > 0) {
          if (pData.cusid == 0) {
            if (CommonConfig.loggedInUserData().IsAllChatAccess == 1) {
              if (this.state.statusList.length == 0) {
                this.state.statusList.push(this.state.requestStatus[0]);
                this.filterMethod("", this.state.statusList);
              } else {
                this.filterMethod("", this.state.statusList);
              }
            } else {
              res.Data[0].map((value) => {
                if (value.AgentId == CommonConfig.loggedInUserData().PersonID) {
                  this.state.ChatListData.push(value);
                }
              });

              if (this.state.statusList.length === 0) {
                this.state.statusList.push(this.state.requestStatus[0]);
                this.filterMethod("", this.state.statusList);
              } else {
                this.filterMethod("", this.state.statusList);
              }
            }
            this.hideLoador();
          }
        } else {
          this.hideLoador();
        }
      } else {
        this.hideLoador();
      }
    });
  };
  openDeleteRequestModal(recordDeleteId) {
    this.setState({ DeleteRequest: true, DeleteRequestId: recordDeleteId });
  }

  closedeletemodal = () => {
    this.setState({ DeleteRequest: false });
  };

  handleDelete(recordDeleteId) {
    this.setState({ DeleteRequest: false });
    let deleteData = {
      cusId: recordDeleteId,
    };

    api.post("customerChat/deleteChatById", deleteData).then((res) => {
      if (res.success) {
        cogoToast.success("Record Deleted Successfully");
        let data = {
          cusid: 0,
          agentId: CommonConfig.loggedInUserData().PersonID,
        };
        this.getChatList(data);
      }
    });
  }

  removeOpenTabSessionData(cid) {
    var idx = this.state.openedTab.findIndex((x) => x.stepId == cid);

    if (idx > -1) {
      this.state.openedTab.splice(idx, 1);
    }

    if (localStorage.getItem("openedTab")) {
      var openTabSessionData = JSON.parse(localStorage.getItem("openedTab"));

      var openTabSessionDataIndex = openTabSessionData.findIndex(
        (x) => x.stepId == cid
      );
      if (openTabSessionDataIndex > -1) {
        openTabSessionData.splice(openTabSessionDataIndex, 1);
      }
    }
    localStorage.setItem("openedTab", JSON.stringify(openTabSessionData));
  }

  addOpenTabSessionData(cName, cid) {
    this.state.openedTab.push({
      stepName: cName,
      stepId: cid,
    });

    localStorage.setItem("openedTab", JSON.stringify(this.state.openedTab));
  }

  handleEdit(record) {
    debugger;
    this.showLoador();
    tabAlreeadyOpen = false;
    for (var i = 0; i < this.state.NewTab.length; i++) {
      if (this.state.NewTab[i].stepId == record.original.ID) {
        tabAlreeadyOpen = true;
        break;
      } else {
        tabAlreeadyOpen = false;
      }
    }

    if (tabAlreeadyOpen) {
      let activeIndex = this.state.NewTab.findIndex(
        (x) => x.stepId === record.original.ID
      );

      this.navigateChange(activeIndex);
    } else {
      this.addOpenTabSessionData(record.original.Name, record.original.ID);

      this.state.NewTab.push({
        stepName: record.original.Name,
        stepId: record.original.ID,
        classname: "inactive",
      });

      this.createNewCustomerTab(record.original.ID, record.original.Name);

      let activeIndex = this.state.NewTab.findIndex(
        (x) => x.stepId === record.original.ID
      );

      this.navigateChange(activeIndex);
    }
    this.hideLoador();
  }

  renderInputMethod = (params) => {
    return <TextField {...params} variant="outlined" label="Status" />;
  };

  showLoador = () => {
    this.setState({ Loading: true });
  };

  hideLoador = () => {
    this.setState({ Loading: false });
  };

  optionProps = (option, value) => {
    if (option.value === value.value) {
      return true;
    } else {
      return false;
    }
  };

  getFilterData(params) {
    if (params === "") {
      this.setState({ ChatListData: [] });
    } else {
      let data = {
        whereClause: params,
      };
      this.setState({ Loading: true });
      api
        .post("customerChat/getChatList", data)
        .then((result) => {
          if (result.success) {
            filterDataValue = [];
            this.setState({ Loading: false });
            if (CommonConfig.loggedInUserData().IsAllChatAccess == 1) {
              this.setState({ ChatListData: result.Data[0] });

              let openArr = this.state.ChatListData;
              var i = 0;
              openArr.map((OBJ) => {
                OBJ.IsSelected = false;
                OBJ.Index = i;
                i++;
                return OBJ;
              });
              let Type = "chatlist";
              this.setState({
                [Type]: openArr,
              });
              console.log(".....", this.state.chatlist);
            } else {
              result.Data[0].map((value) => {
                if (value.AgentId == CommonConfig.loggedInUserData().PersonID) {
                  filterDataValue.push(value);
                }
              });
              //this.setState({ ChatListData: filterDataValue });
              let openArr = filterDataValue;
              openArr = openArr.filter(
                (v, i, a) =>
                  a.findIndex((t) => t.CommisionId === v.CommisionId) === i
              );
              var i = 0;
              openArr.map((OBJ) => {
                OBJ.IsSelected = false;
                OBJ.Index = i;
                i++;
                return OBJ;
              });

              this.setState({
                ChatListData: openArr,
              });
            }
          } else {
            this.setState({ Loading: false });
            cogoToast.error("Something went wrong");
          }
        })
        .catch((err) => {
          cogoToast.error("Something Went Wrong");
        });
    }
  }

  filterMethod = (event, value) => {
    if (value !== null) {
      if (value.length !== 0) {
        value = value.filter(
          (v, i, a) => a.findIndex((t) => t.value === v.value) === i
        );
        let query = "";
        let StatusQuery = "";
        let allFilter = value.findIndex((x) => x.value === "All");
        if (allFilter === 0) {
          // value.splice(allFilter, 1);
          // allFilter = -1;
        }
        if (allFilter != 0 || value.length > 1) {
          for (var j = 0; j < value.length; j++) {
            if (j === 0) {
              if (value.length === 1) {
                StatusQuery = `  ( ccd.Status = "` + value[j].value + `") `;
              } else {
                StatusQuery = `  ( ccd.Status = "` + value[j].value + `" `;
              }
            } else if (j + 1 === value.length) {
              StatusQuery = ` OR ccd.Status = "` + value[j].value + `") `;
            } else {
              StatusQuery = ` OR ccd.Status = "` + value[j].value + `" `;
            }
            query = query + StatusQuery;
          }
        } else {
          value = [{ label: "All", value: "All" }];
        }
        // this.getFilterData(query);
      } else {
        this.setState({ ChatListData: [] });
      }
      this.setState({ statusList: value });
    }
  };
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
    let Type = "chatlist";

    let checkedArr = this.state.chatlist;
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
    let arrType = "previousSelected" + this.state.chatlist;
    this.setState({ checkdata: previousList });
    this.setState({
      Type: checkedArr,
      [arrType]: previousList,
    });
  };

  handleCheckboxChange2 = (e, record, type) => {
    let checkedArr = this.state.requestStatus;
    if (type !== "All") {
      checkedArr
        .filter((x) => x.value === "All")
        .map((OBJ) => {
          OBJ.IsSelected = false;
          return OBJ;
        });
      checkedArr[record.Index]["IsSelected"] = e.target.checked;
      // this.setState({
      //   checkAll2: e.target.checked,
      //   //StatusList[0].IsSelected:true
      // });
      let previousList = checkedArr.filter((x) => x.IsSelected === true);
      this.setState({ checkdata2: previousList });
    } else {
      checkedArr.map((OBJ) => {
        OBJ.IsSelected = e.target.checked;
        return OBJ;
      });

      // this.setState({
      //   checkAll2: e.target.checked,
      // });
      let previousList = checkedArr.filter((x) => x.IsSelected === true);
      let arrType = "previousSelectedStatusList";
      if (previousList.length === 0) {
        this.state.checkdata2 = "";
      } else {
        this.state.checkdata2 = `All`;
      }
      this.setState({
        requestStatus: checkedArr,
      });
    }
  };

  searchfilter = () => {
    debugger;
    this.setState({ IsDropDownShow: false });
    try {
      let Query = "";
      let inputdata = this.state.checkdata2;
      if (inputdata === "All") {
        Query = inputdata;
      } else if (inputdata === "") {
        this.setState({ ChatListData: [] });
      } else if (inputdata.length === 1) {
        Query = `  ( ccd.Status  = "` + inputdata[0].value + `")`;
      } else {
        for (var j = 0; j < inputdata.length; j++) {
          if (j === 0) {
            Query = `  ( ccd.Status  = "` + inputdata[j].value + `"`;
          } else {
            Query = Query + ` OR ccd.Status  = "` + inputdata[j].value + `"`;
          }
        }
        if (!CommonConfig.isEmpty(Query)) {
          Query = Query + `)`;
        }
      }
      this.getFilterData(Query);
    } catch (err) {
      cogoToast.error("Something went wrong");
    }
  };

  deletedata = () => {
    if (this.state.checkdata.length > 0) {
      this.setState({ open: true });
    } else {
      cogoToast.error("Please select the data");
    }
  };
  Endchatdata = () => {
    if (this.state.checkdata.length > 0) {
      this.setState({ endchat: true });
    } else {
      cogoToast.error("Please select the data");
    }
  };
  handleClickCancel3 = () => {
    this.setState({ popupclose: true, showAgentList: false });
  };
  handleClickCancel2 = () => {
    this.setState({ endchatclose: true, endchat: false });
  };
  handleClickCancel = () => {
    this.setState({
      close: true,
      open: false,
    });
  };
  handleEndchat = () => {
    this.setState({ endchat: false });
    console.log("first", this.state.checkdata);
    let data = this.state.checkdata;
    api.post("customerChat/EndChatById", data).then((res) => {
      if (res.success) {
        cogoToast.success("chat End successfully.");
        this.setState({ checkdata: "" });
        this.searchfilter();
        // let newdata = {
        //   cusid: 0,
        //   agentId: CommonConfig.loggedInUserData().PersonID,
        // };
        // this.setState({ checkdata: "" });
        // this.getChatList(newdata);
      }
    });
  };
  handleChange(e) {
    this.setState({ selectedAgent: e.target.value });
  }
  agentlistMenu = () => {
    //this.state.AgentList.PersonId
    // console.log("this.state.AgentList", this.state.AgentList);
    var newArray = [];
    for (var i = 0; i < this.state.AgentList.length; i++) {
      if (this.state.AgentList[i].PersonId !== this.state.loggedUser) {
        newArray.push(this.state.AgentList[i]);
      }
    }
    this.state.AgentList = newArray;
    // console.log("newArray = ", newArray);
    // console.log("newArray 2 = ", this.state.AgentList);
    // if (this.state.AgentList[i].PersonId !== this.state.loggedUser) {
    return this.state.AgentList.map((yn) => {
      return (
        <MenuItem
          classes={{ root: classes.selectMenuItem }}
          value={yn.PersonId}
        >
          {" "}
          {yn.UserName}{" "}
        </MenuItem>
      );
    });
    // }
    // return this.state.AgentList.map((yn) => {

    //   // let val =
    //   //   yn.PersonId !=== loggedUser
    //   //     ? true
    //   //     : yn.Description === "No"
    //   //     ? false
    //   //     : yn.Description;
    //   return (
    //     <MenuItem
    //       classes={{ root: classes.selectMenuItem }}
    //       value={yn.PersonId}
    //     >
    //       {" "}
    //       {yn.UserName}{" "}
    //     </MenuItem>
    //   );
    // });
  };
  handleDelete = () => {
    this.setState({ open: false });
    let data = this.state.checkdata;
    api.post("customerChat/deltecheckedChatById", data).then((res) => {
      if (res.success) {
        // setTimeout(() => {
        //   let newdata = {
        //     cusid: 0,
        //     agentId: CommonConfig.loggedInUserData().PersonID,
        //   };

        //   this.getChatList(newdata);
        //   this.setState({ checkdata: "" });
        // }, 3000);
        this.setState({ checkdata: "" });
        this.searchfilter();
        cogoToast.success("data delete successfully.");
      }
    });
  };

  render() {
    const { ChatListData, checkstaus } = this.state;
    let chatColumns = [];
    // const { classes } = this.props;
    var checkstatus = {};
    checkstatus = this.state.chatlist[0];
    // Object.keys(checkstatus)
    // ? key.Status
    // : ""
    // console.log("test", Object.values(this.state.chatlist[0]));
    for (var i = 0; i < ChatListData.length; i++) {
      this.state.checkstaus = this.state.ChatListData[i].Status;
      chatColumns =
        // ChatListData[i].Status === "New" && this.state.hasDeleteAccesss
        //   ?
        [
          {
            Header: (props) => this.checkboxHeader(props),
            Cell: this.renderCheckbox,
            sortable: false,
            filterable: false,
            width: 40,
          },
        ];
      // : [];
    }
    const column = [
      ...chatColumns,
      {
        Header: "Customer Name",
        accessor: "Name",
        width: 150,
        filterable: true,
        sortable: true,
        maxWidth: 150,
      },
      {
        Header: "Phone",
        accessor: "Mobile",
        filterable: true,
        sortable: true,
        width: 100,
        maxWidth: 150,
      },
      {
        Header: "Email",
        accessor: "Email",
        filterable: true,
        sortable: true,
        width: 200,
        maxWidth: 450,
      },
      {
        Header: "Agent Name",
        accessor: "AgentName",
        filterable: true,
        sortable: true,
        width: 150,
        maxWidth: 450,
      },
      {
        Header: "Status",
        accessor: "Status",
        filterable: true,
        sortable: true,
        width: 120,
        maxWidth: 450,
      },
      {
        id: "CreatedOn",
        Header: "Created On",
        filterable: true,
        sortMethod: (a, b) => {
          return CommonConfig.dateSortMethod(a, b);
        },
        sortable: true,
        accessor: (data) => {
          return moment(data.CreatedOn)
            .tz("America/Chicago")
            .format(CommonConfig.dateFormat.dateTimeHrsMin);
        },
        width: 150,
        maxWidth: 200,
      },
      {
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        width: 80,
        maxWidth: 150,
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
    ];
    const agentcolumn = [
      {
        Header: "Agent Name",
        accessor: "UserName",
        width: 150,
        filterable: true,
        sortable: true,
        maxWidth: 150,
      },
      {
        Header: "Actions",
        accessor: "PersonId",
        sortable: false,
        width: 150,
        maxWidth: 150,
        Cell: (record) => {
          return (
            <div className="shipment-submit  mt-20">
              <Button
                color="rose"
                onClick={() => this.trasferchatToAgent(record)}
              >
                send chat
              </Button>
            </div>
          );
        },
        filterable: false,
      },
    ];
    // if (this.state.hasDeleteAccesss == 1) {
    //   column.push({
    //     Header: "Delete",
    //     accessor: "delete",
    //     sortable: false,
    //     width: 50,
    //     maxWidth: 80,
    //     Cell: (record) => {
    //       return (
    //         <div className="table-common-btn">
    //           <Button
    //             justIcon
    //             onClick={() => this.openDeleteRequestModal(record.original.ID)}
    //             color="danger"
    //           >
    //             <i class="fas fa-trash"></i>
    //           </Button>
    //         </div>
    //       );
    //     },
    //     filterable: false,
    //   });
    // }
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
                <ChatIcon />
              </CardIcon>

              <h4 className="margin-right-auto text-color-black">Chat List</h4>
              <div className="outerContainer">
                <div className="chat-status">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={this.state.IsAvailableForChat}
                          onChange={(e) =>
                            this.updateIsAvailableForChat(e.target.checked)
                          }
                          name="chatAvailability"
                        />
                      }
                      label={"Your chat status is " + this.state.statusLabel}
                      labelPlacement="start"
                    />
                  </FormGroup>
                </div>
              </div>

              {this.state.NewTab.findIndex((x) => x.classname === "active") !==
              -1 ? (
                this.state.NewTab[
                  this.state.NewTab.findIndex((x) => x.classname === "active")
                ]["stepId"] === "chatList" ? (
                  <div className="filter-wrap">
                    <div className="outerContainer">
                      <div
                        className="filter-top-right"
                        onMouseLeave={() =>
                          this.setState({ IsDropDownShow: false })
                        }
                        onMouseOver={() =>
                          this.setState({ IsDropDownShow: true })
                        }
                      >
                        <Button className="cm-toggle" color="rose">
                          Chat Status <ExpandMoreIcon />
                        </Button>
                        {this.state.IsDropDownShow === true ? (
                          <div className="cm-dropdown">
                            <div className="overflow-handle">
                              {this.state.requestStatus.map((step, key) => {
                                return (
                                  <li>
                                    <label>
                                      <input
                                        type="checkbox"
                                        checked={step.IsSelected}
                                        onChange={(e) =>
                                          this.handleCheckboxChange2(
                                            e,
                                            step,
                                            step.value
                                          )
                                        }
                                      />{" "}
                                      {step.value}
                                    </label>
                                  </li>
                                );
                              })}
                            </div>
                            <div className="cms-wrap">
                              <Button
                                className="cm-search-btn"
                                color="rose"
                                onClick={() => this.searchfilter()}
                              >
                                Search
                              </Button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null
              ) : null}
            </CardHeader>

            <CardBody className="chatbot-card">
              <div className="shipment-nav chatbot-tabs">
                <ul>
                  {this.state.NewTab.map((step, key) => {
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
                          {key > 0 ? (
                            <i
                              onClick={(e) => this.closeTab(e)}
                              class="fas fa-times close-chat"
                              title="closeIcon"
                            ></i>
                          ) : null}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="shipment-content mt-20">
                <div className="shipment-pane" id="chatList">
                  <ReactTable
                    data={ChatListData}
                    defaultPageSize={10}
                    minRows={2}
                    resizable={false}
                    columns={column}
                    pageText={"Total rows : " + ChatListData.length}
                    defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                    showPaginationBottom={true}
                    className="-striped -highlight chatReport"
                  />
                </div>

                {this.state.NewTab.map((step, key) => {
                  if (key > 0) {
                    return (
                      <div className="shipment-pane" id={step.stepId}>
                        <div className="chat-container">
                          <ul id="chatTabs" className="chatTabs"></ul>
                          <div id="chatWindows" className="chatMain"></div>

                          <form
                            id="chat-form"
                            className="chat-form"
                            onSubmit={(e) => this.sendMessage(e)}
                          >
                            <div
                              className="customer-status"
                              style={{ display: "none" }}
                            >
                              <p>{this.state.cusStatusLine}</p>
                            </div>
                            <div className="chat-send-message">
                              <div className="input-for-chat">
                                <input
                                  placeholder="Type something..."
                                  id="m"
                                  value={this.state.message}
                                  onChange={({ target: { value } }) =>
                                    this.setState({ message: value })
                                  }
                                  autoComplete="off"
                                  onKeyPress={(event) =>
                                    event.key === "Enter"
                                      ? this.sendMessage(event)
                                      : null
                                  }
                                />
                              </div>
                              <div className="chat-submit-opt">
                                <button
                                  className="Send"
                                  onClick={(e) => this.sendMessage(e)}
                                >
                                  Send
                                </button>
                                <button
                                  className="transfer-chat"
                                  onClick={(e) => this.transferchat(e)}
                                >
                                  Transfer Chat
                                </button>
                                <button
                                  className="end-chat"
                                  onClick={(e) => this.closeTab(e)}
                                >
                                  End Chat
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </CardBody>
            {this.state.hasDeleteAccesss ? (
              <div
                className="cms-wrap"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  // height: '100vh',
                }}
              >
                <div>
                  <Button color="rose" onClick={() => this.deletedata()}>
                    Delete
                  </Button>
                </div>
                <div
                  style={{
                    width: "5vh",
                  }}
                ></div>
                <div>
                  <Button color="rose" onClick={() => this.Endchatdata()}>
                    End Chat
                  </Button>
                </div>
              </div>
            ) : null}
          </Card>
        </GridItem>

        <div id="myModal" className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{this.state.requestHeader}</h2>
            </div>
            <div className="modal-body">
              <div className="chat-request">
                <i className="far fa-comments"></i>
                <p id="chatModalP"> {this.state.requestMessage}</p>
              </div>
            </div>
            <div className="modal-footer">
              {this.state.alreadyAccepted ? (
                <button
                  onClick={() => this.closemodal()}
                  type="button"
                  className=" cancelbtn"
                >
                  Close
                </button>
              ) : (
                <div>
                  <button
                    onClick={() => this.closemodal(this.state.cusId)}
                    type="button"
                    className=" cancelbtn"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => this.acceptRequest(e)}
                    type="button"
                    className="deletebtn"
                  >
                    Accept
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* <div id="myModalforAgent" className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{this.state.requestHeader}</h2>
            </div>
            <div className="modal-body">
              <div className="chat-request">
                <i className="far fa-comments"></i>
                <p id="chatModalP"> {this.state.requestMessage}</p>
              </div>
            </div>
            <div className="modal-footer">
              {this.state.alreadyAccepted ? (
                <button
                  onClick={() => this.closemodalToAgent()}
                  type="button"
                  className=" cancelbtn"
                >
                  Close
                </button>
              ) : (
                <div>
                  <button
                    onClick={() => this.closemodalToAgent(this.state.cusId)}
                    type="button"
                    className=" cancelbtn"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => this.acceptRequestToAgent(e)}
                    type="button"
                    className="deletebtn"
                  >
                    Accept
                  </button>
                </div>
              )}
            </div>
          </div>
        </div> */}
        {!this.state.alreadyAccepted ? (
          <div id="myModalforAgent" className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{this.state.requestHeader}</h2>
              </div>
              <div className="modal-body">
                <div className="chat-request">
                  <i className="far fa-comments"></i>
                  <p id="chatModalP"> {this.state.requestMessage}</p>
                </div>
              </div>
              <div className="modal-footer">
                <div>
                  <button
                    onClick={() => this.closemodalToAgent(this.state.cusId)}
                    type="button"
                    className=" cancelbtn"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => this.acceptRequestToAgent(e)}
                    type="button"
                    className="deletebtn"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
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
        </div>
        <div>
          <Dialog
            open={this.state.open}
            onClose={this.state.close}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Confirm Delete"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure want to delete?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClickCancel} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleDelete} color="primary" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <div>
          <Dialog
            open={this.state.endchat}
            onClose={this.state.endchatclose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Confirm Chat End"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure want to EndChat?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClickCancel2} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleEndchat} color="primary" autoFocus>
                End Chat
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        {/* // {this.state.showAgentList === true ? ( */}
        <div>
          <Dialog
            open={this.state.showAgentList}
            onClose={this.state.popupclose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Transfer Chat"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {/* <ReactTable
                  data={this.state.AgentList}
                  resizable={false}
                  columns={agentcolumn}
                  minRows={2}
                  showPaginationBottom={false}
                /> */}
                {/* <select
                  value={this.state.selectedAgent}
                  onChange={this.handleChange}
                >
                  <option value={0}>{"--select--"}</option>
                  {this.state.options.map((option) => (
                    <option value={option.PersonId}>{option.UserName}</option>
                  ))}
                </select> */}
                <FormControl fullWidth className={classes.selectFormControl}>
                  <Select
                    MenuProps={{ className: classes.selectMenu }}
                    classes={{ select: classes.select }}
                    value={this.state.selectedAgent}
                    inputProps={{
                      name: "simpleSelect",
                      id: "simple-select",
                    }}
                    onChange={this.handleChange}
                    //  onChange={(event) => this.handledropdown(event, ServiceID)}
                  >
                    {/* <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="USD"
                    >
                      USD
                    </MenuItem> */}
                    {this.agentlistMenu()}
                  </Select>
                </FormControl>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClickCancel3} color="primary">
                Close
              </Button>
              <Button color="rose" onClick={() => this.trasferchatToAgent()}>
                send chat
              </Button>
            </DialogActions>
          </Dialog>
          {/* <div className="shipment-pane" id="chatList"> */}
          {/* <ReactTable
                data={this.state.AgentList}
                defaultPageSize={10}
                minRows={2}
                resizable={false}
                columns={agentcolumn}
                pageText={"Total rows : " + ChatListData.length}
                defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                showPaginationBottom={true}
                className="-striped -highlight chatReport"
              /> */}
          {/* </div> */}
        </div>
        {/* ) : null} */}
      </GridContainer>
    );
  }
}
ChatReport.propTypes = {
  classes: PropTypes.object,
};
export default ChatReport;
