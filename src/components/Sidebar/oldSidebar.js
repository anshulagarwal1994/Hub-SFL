/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import api from "../../utils/apiClient";
import { CommonConfig } from "../../utils/constant";

// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { NavLink } from "react-router-dom";
import cx from "classnames";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Hidden from "@material-ui/core/Hidden";
import Collapse from "@material-ui/core/Collapse";
import Icon from "@material-ui/core/Icon";
import Management from "@material-ui/icons/SupervisorAccount";
import User from "@material-ui/icons/AccountBox";
import SalesLeadIcon from "@material-ui/icons/Assessment";
import EditSalesLeadIcon from "@material-ui/icons/Edit";
import VendorListIcon from "@material-ui/icons/FormatListBulleted";
import GateRatesIcon from "@material-ui/icons/AttachMoney";
import WebForms from "@material-ui/icons/Public";
import ContactUsIcon from "@material-ui/icons/Contacts";
import CallBackIcon from "@material-ui/icons/Call";
import PaymentIcon from "@material-ui/icons/Payment";
import FileaClaim from "@material-ui/icons/NoteAdd";
import ScheduleshipmentIcon from "@material-ui/icons/LocalShippingTwoTone";
import Shipment from "components/Shipment/Shipment";
import ContactUs from "components/WebForms/ContactUs";
import CallBack from "components/WebForms/CallBack";
import OnlinePayment from "components/WebForms/OnlinePayment";
import FileaClaimList from "components/FileaClaim/FileaClaimList";
import AddaClaim from "components/FileaClaim/AddaClaim";
import ReceiptIcon from "@material-ui/icons/Receipt";
import TodayIcon from "@material-ui/icons/Today";
// core components
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks.js";
import UserList from "components/Management/UserList";
import GetRates from "components/GetRates/GetRates";
import Service from "components/Management/Service/Service";
import VendorList from "components/Management/VendorList";
import SalesLeads from "components/SalesLeads/SalesLeads";
import Scheduleshipment from "components/Scheduleshipment/Scheduleshipment";
import sidebarStyle from "assets/jss/material-dashboard-pro-react/components/sidebarStyle.js";

import DirectionsBoatIcon from "@material-ui/icons/DirectionsBoat";
import BeenhereIcon from "@material-ui/icons/Beenhere";
import ChatIcon from "@material-ui/icons/Chat";
import ArchiveIcon from "@material-ui/icons/Archive";
import LocalMoviesIcon from "@material-ui/icons/LocalMovies";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { Tooltip } from "@material-ui/core";
import { Howl } from "howler";
const msgsound = require("../../messageSound/ChatRequest.mp3");

var ps;

const Components = {
  GetRates: GetRates,
  UserList: UserList,
  Service: Service,
  VendorList: VendorList,
  Scheduleshipment: Scheduleshipment,
  ContactUs: ContactUs,
  CallBack: CallBack,
  OnlinePayment: OnlinePayment,
  FileaClaimList: FileaClaimList,
  SalesLeads: SalesLeads,
  Shipment: Shipment,
  AddaClaim: AddaClaim,
};

const Icons = {
  Management: Management,
  User: User,
  EditSalesLeadIcon: EditSalesLeadIcon,
  VendorListIcon: VendorListIcon,
  GateRatesIcon: GateRatesIcon,
  ScheduleshipmentIcon: ScheduleshipmentIcon,
  WebForms: WebForms,
  ContactUsIcon: ContactUsIcon,
  CallBackIcon: CallBackIcon,
  PaymentIcon: PaymentIcon,
  FileaClaim: FileaClaim,
  SalesLeadIcon: SalesLeadIcon,
  DirectionsBoatIcon: DirectionsBoatIcon,
  BeenhereIcon: BeenhereIcon,
  ArchiveIcon: ArchiveIcon,
  LocalMoviesIcon: LocalMoviesIcon,
  AssignmentIcon: AssignmentIcon,
  ReceiptIcon: ReceiptIcon,
  TodayIcon: TodayIcon,
  ChatIcon: ChatIcon,
};

class SidebarWrapper extends React.Component {
  sidebarWrapper = React.createRef();
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.sidebarWrapper.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
  }

  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }

  render() {
    const { className, user, headerLinks, links } = this.props;

    return (
      <div className={className} ref={this.sidebarWrapper}>
        {user}
        {headerLinks}
        {links}
      </div>
    );
  }
}

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dynamicRoutes: [],
      miniActive: true,
      CallBackList: [],
      callbackLength: 0,
      contactUsLength: 0,
      mounted: true,
      ContactUsList: [],
      salesLeadLength: 0,
      salesLeadList: [],
      shipmentLength: 0,
      shipmentList: [],
      chatCount: 0,
      chatList: [],
      digit: 0,
      id: null,
      tempRequestId: [],
      ...this.getCollapseStates(props.routes),
    };
    this.getUserMenu();
    this.getChatCount();
    this.getGlobalSoundforChat();
  }
  mainPanel = React.createRef();

  async componentDidMount() {
    this.state.id = window.setInterval(() => {
      this.setState({ digit: this.state.digit + 1 });
      this.keepAlive();
    }, 5000);

    await this.checkLoginStatus();

    let resLength = await this.getCallBackList();
    let contactUsLength = await this.getContactUsList();
    let salesLeadLength = await this.getSalesLeadList(
      ' ProposalStatus = "New" '
    );
    this.state.mounted = true;
    let shipmentLength = await this.getShipmentList();

    this.setState({
      callbackLength: resLength,
      contactUsLength: contactUsLength,
      salesLeadLength: salesLeadLength,
      shipmentLength: shipmentLength,
    });
  }

  componentWillUnmount() {
    this.state.mounted = false;
    window.clearInterval(this.state.id);
  }

  checkLoginStatus = () => {
    if (localStorage.getItem("loggedInUserData")) {
      var data = {
        uid: CommonConfig.loggedInUserData().PersonID,
      };

      api.post("authentication/checkLoginStatus", data).then((res) => {
        if (res.data[0].IsLoggedIn == 0) {
          var receiver = document.getElementById("receiver").contentWindow;
          receiver.postMessage("", "https://www.sflworldwide.com");
          localStorage.clear();
          // sessionStorage.clear();
          setTimeout(() => {
            this.props.history.push("/login-page");
          }, 3000);
        }
      });
    }
  };

  keepAlive = () => {
    var data = {
      uid: CommonConfig.loggedInUserData().PersonID,
    };
    api.post("authentication/expireSession", data).then((res) => {
      // console.log("SFL ~ file: Sidebar.js ~ line 191 ~ Sidebar ~ res", res);
    });

    // console.log("Keep Alive", this.state.digit);
  };

  getUserMenu() {
    let data = {
      UserID: CommonConfig.loggedInUserData().PersonID,
    };
    api
      .post("authentication/getUserAccess", data)
      .then((res) => {
        if (res.success) {
          var routesdata = res.Data.sort((a, b) =>
            a.OrderId > b.OrderId ? 1 : b.OrderId > a.OrderId ? -1 : 0
          );
          let shipmentIndex = res.Data.findIndex(
            (x) => x.MenuID === 18 && x.MenuKey === "Shipment"
          );
          let myshipmentIndex = res.Data.findIndex(
            (x) => x.MenuID === 19 && x.MenuKey === "My Shipment"
          );
          if (shipmentIndex !== -1 && myshipmentIndex !== -1) {
            res.Data.splice(myshipmentIndex, 1);
          }
          var obj2 = [];

          for (let i = 0; i < routesdata.length; i++) {
            var parentObj = {};

            (parentObj.name = routesdata[i].MenuName),
              (parentObj.icon = Icons[routesdata[i].icon]),
              (parentObj.collapse = CommonConfig.isEmpty(routesdata[i].Path)
                ? true
                : false),
              (parentObj.currentCollapse = false),
              (parentObj.previousCollapse = false),
              (parentObj.infoIcon = false);
            parentObj.length = 0;
            parentObj.state = routesdata[i].MenuKey;

            if (!CommonConfig.isEmpty(routesdata[i].Path)) {
              (parentObj.path = routesdata[i].Path),
                (parentObj.component = Components[routesdata[i].Component]),
                (parentObj.layout = routesdata[i].layout);
            }

            if (!CommonConfig.isEmpty(routesdata[i].views)) {
              let views = routesdata[i].views;
              let child = [];

              for (let j = 0; j < views.length; j++) {
                let childObj = {};

                (childObj.path = views[j].Path),
                  (childObj.name = views[j].MenuName),
                  (childObj.icon = Icons[views[j].icon]),
                  (childObj.infoIcon = false);
                childObj.length = 0;
                (childObj.component = Components[views[j].Component]),
                  (childObj.layout = views[j].layout);

                child.push(childObj);
              }

              parentObj.views = child;
            }

            obj2.push(parentObj);
          }
          this.setState({ dynamicRoutes: obj2 });
        } else {
        }
      })
      .catch((err) => {});
  }

  getCollapseStates = (routes) => {
    let initialState = {};
    routes.map((prop) => {
      if (prop.collapse) {
        initialState = {
          [prop.state]: this.getCollapseInitialState(prop.views),
          ...this.getCollapseStates(prop.views),
          ...initialState,
        };
      }
      return null;
    });
    return initialState;
  };

  getCollapseInitialState(routes) {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && this.getCollapseInitialState(routes[i].views)) {
        return true;
      } else if (window.location.href.indexOf(routes[i].path) !== -1) {
        return true;
      }
    }
    return false;
  }

  activeRoute = (routeName) => {
    if (
      !(
        window.location.href.includes("/admin/SalesLead") ||
        window.location.href.includes("/admin/EditSalesLeads")
      )
    ) {
      localStorage.removeItem("SearchParams");
    }
    return window.location.href.indexOf(routeName) > -1 ? "active" : "";
  };

  openCollapse(collapse) {
    var st = {};
    st[collapse] = !this.state[collapse];
    this.setState(st);
  }

  async getContactUsList() {
    if (!CommonConfig.isEmpty(CommonConfig.getUserAccess("Contact Us"))) {
      try {
        await api
          .post("contactus/getContactUsList")
          .then((result) => {
            if (result.success) {
              if (CommonConfig.getUserAccess("Contact Us").AllAccess === 1) {
                if (this.state.ContactUsList !== result.data) {
                  this.setState({
                    ContactUsList: result.data.filter(
                      (x) => x.RequestStatus === "New"
                    ),
                  });
                }
              } else {
                let finalData = result.data.filter(
                  (x) =>
                    Number(x.WorkingOnRequest) ===
                      CommonConfig.loggedInUserData().PersonID &&
                    x.RequestStatus === "New"
                );
                if (this.state.ContactUsList !== finalData) {
                  this.setState({ ContactUsList: finalData });
                }
              }
            }
          })
          .catch((err) => {});
      } catch (err) {}
    }
    return this.state.ContactUsList.length;
  }

  async getCallBackList() {
    if (!CommonConfig.isEmpty(CommonConfig.getUserAccess("Call Back"))) {
      try {
        await api
          .post("callback/getCallBackList")
          .then((result) => {
            if (result.data.success) {
              if (CommonConfig.getUserAccess("Call Back").AllAccess === 1) {
                if (this.state.CallBackList !== result.data.data) {
                  this.setState({
                    CallBackList: result.data.data.filter(
                      (x) => x.RequestStatus === "New"
                    ),
                  });
                }
              } else {
                let finalData = result.data.data.filter(
                  (x) =>
                    x.WorkingOnRequest ===
                      CommonConfig.loggedInUserData().PersonID &&
                    x.RequestStatus === "New"
                );
                if (this.state.CallBackList !== finalData) {
                  this.setState({ CallBackList: finalData });
                }
              }
            }
          })
          .catch((err) => {});
      } catch (err) {}
    }
    return this.state.CallBackList.length;
  }

  async getSalesLeadList(params) {
    let data = {
      whereClause: params,
    };

    await api
      .post("salesLead/getSalesLead", data)
      .then((result) => {
        if (result.success) {
          if (CommonConfig.getUserAccess("Sales Lead").AllAccess === 1) {
            if (this.state.salesLeadList !== result.data) {
              this.setState({ salesLeadList: result.Data });
            }
          } else {
            let proposalData = result.Data.filter(
              (x) => x.ManagedBy === CommonConfig.loggedInUserData().PersonID
            );
            if (this.state.salesLeadList !== proposalData) {
              this.setState({ salesLeadList: proposalData });
            }
          }
        }
      })
      .catch((err) => {});
    return this.state.salesLeadList.length;
  }

  soundPlay = () => {
    const sound = new Howl({
      src: msgsound,
      loop: false,
      html5: true,
    });

    sound.play();
  };

  async getGlobalSoundforChat() {
    try {
      if (localStorage.getItem("loggedInUserData")) {
        var sessionData = JSON.parse(localStorage.getItem("loggedInUserData"));

        let userType = CommonConfig.loggedInUserData().UserType;
        let userTypeArray = [];
        if (userType != undefined) {
          userTypeArray = userType.split(",");
        }

        var url = window.location.href;

        if (
          sessionData != null &&
          sessionData.IsAvailableForChat == 1 &&
          userType != ""
        ) {
          if (!url.includes("Chatbot")) {
            await api
              .get("customerChat/getChatCustomerRequest", {})
              .then((res) => {
                if (res.success) {
                  let requestData = res.Data[0];

                  if (requestData.length > 0) {
                    for (var i = 0; i < requestData.length; i++) {
                      let userTypeIndex = userTypeArray.indexOf(
                        requestData[i].SelectedCategory
                      );

                      let localobj = JSON.parse(
                        localStorage.getItem("cancelReqData")
                      );
                      let localobjidx;

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
                          if (
                            userTypeIndex != undefined &&
                            userTypeIndex != null &&
                            userTypeIndex != -1
                          ) {
                            //this.soundPlay();
                          }
                        }
                      }
                    }
                  }
                }
              });
          }
        }
        // if (
        //   sessionData != null &&
        //   sessionData.IsAvailableForChat == 1 &&
        //   userType != ""
        // ) {
        //   if (!url.includes("Chatbot")) {
        //     let data = { AgentId: CommonConfig.loggedInUserData().PersonID };

        //     await api
        //       .post("customerChat/getChatCustomerRequestToAgentId", data)
        //       .then((res) => {
        //         if (res.success) {
        //           var requestData = [];
        //           requestData = res.Data;
        //           if (requestData.length > 0) {
        //             for (var i = 0; i < requestData.length; i++) {
        //               let userTypeIndex = userTypeArray.indexOf(
        //                 requestData[i].SelectedCategory
        //               );

        //               let localobj = JSON.parse(
        //                 localStorage.getItem("cancelReqData")
        //               );
        //               let localobjidx;

        //               if (localobj != null && localobj != undefined) {
        //                 localobjidx = localobj.findIndex(
        //                   (val) => val.id == requestData[i].ID
        //                 );
        //                 if (
        //                   localobjidx != undefined &&
        //                   localobjidx != -1 &&
        //                   localobj[localobjidx].id == requestData[i].ID &&
        //                   localobj[localobjidx].decline == false
        //                 ) {
        //                   if (
        //                     userTypeIndex != undefined &&
        //                     userTypeIndex != null &&
        //                     userTypeIndex != -1
        //                   ) {
        //                     this.soundPlay();
        //                   }
        //                 }
        //               }
        //             }
        //           }
        //         }
        //       });
        //   }
        // }
      }
    } catch (err) {}

    setTimeout(() => {
      this.getGlobalSoundforChat();
    }, 4000);
  }

  async getChatCount() {
    try {
      if (localStorage.getItem("loggedInUserData")) {
        var sessionData = JSON.parse(localStorage.getItem("loggedInUserData"));

        let userType = CommonConfig.loggedInUserData().UserType;

        if (
          sessionData != null &&
          sessionData.IsAvailableForChat == 1 &&
          userType != ""
        ) {
          await api.post("customerChat/sidebarChatCount", {}).then((res) => {
            this.setState({
              chatCount: res.Data[0].sideCount,
            });
          });
        }
      }
    } catch (err) {}
    if (this.state.mounted) {
      setTimeout(() => {
        this.getChatCount();
      }, 2000);
    }
  }

  async getShipmentList() {
    try {
      let data = {
        ContactName: "",
        ContactNumber: "",
        Email: "",
        TrackingNumber: "",
        CardNumber: "",
        AccountNumber: "",
        ConfirmationNumber: "",
        Amount: "",
        LoginID: "",
        IsLike: "0",
        ManagedBy:
          CommonConfig.getUserAccess("Shipment").AllAccess !== 1
            ? CommonConfig.loggedInUserData().PersonID
            : "",
        ShipmentType: "",
        ServiceName: "",
        AllClear: "",
        SubServiceName: "",
        ShipmentDate: "",
        ShipmentStatus: ' AND(sm.ShipmentStatus = "New Request") ',
      };
      await api
        .post("reports/getShipmentReport", data)
        .then((res) => {
          if (res.success) {
            if (this.state.shipmentList !== res.data[0]) {
              this.setState({ shipmentList: res.data[0] });
            }
          }
        })
        .catch((err) => {});
    } catch (err) {}
    return this.state.shipmentList.length;
  }

  createLinks = (routes) => {
    const { classes, color } = this.props;

    return routes.map((prop, key) => {
      if (prop.invisible === false) {
        return null;
      }

      if (prop.collapse) {
        var st = {};
        st[prop["state"]] = !this.state[prop.state];
        prop.previousCollapse = prop.currentCollapse;
        prop.currentCollapse = this.state[prop.state];
        var collapseRoutesLength = Object.entries(
          this.getCollapseStates(routes)
        ).length;
        if (
          !prop.previousCollapse &&
          prop.currentCollapse &&
          prop.currentCollapse !== prop.previousCollapse
        ) {
          for (let i = 10; i < collapseRoutesLength + 10; i++) {
            if (Object.entries(this.state)[i][0] === prop.state) {
              this.state[prop.state] = true;
            } else {
              this.state[Object.entries(this.state)[i][0]] = false;
            }
          }
        }

        const navLinkClasses =
          classes.itemLink +
          " " +
          cx({
            [classes.collapseActive]: this.getCollapseInitialState(prop.views),
          });

        const itemText =
          classes.itemText +
          " " +
          cx({
            [classes.itemTextMini]:
              this.props.miniActive && this.state.miniActive,
            [classes.itemTextMiniRTL]:
              this.props.miniActive && this.state.miniActive,
          });

        const collapseItemText =
          classes.collapseItemText +
          " " +
          cx({
            [classes.collapseItemTextMini]:
              this.props.miniActive && this.state.miniActive,
            [classes.collapseItemTextMiniRTL]:
              this.props.miniActive && this.state.miniActive,
          });

        const itemIcon = classes.itemIcon;

        const caret = classes.caret;
        // console.log("classes....",classes.caret);<i class="fas fa-plus"></i>
        const collapseItemMini = classes.collapseItemMini;
        return (
          <ListItem
            key={key}
            className={cx(
              { [classes.item]: prop.icon !== undefined },
              { [classes.collapseItem]: prop.icon === undefined }
            )}
          >
            <NavLink
              to={"#"}
              className={navLinkClasses}
              onClick={(e) => {
                e.preventDefault();
                this.setState(st);
              }}
            >
              {prop.icon !== undefined ? (
                typeof prop.icon === "string" ? (
                  <Icon className={itemIcon}>{prop.icon}</Icon>
                ) : (
                  <prop.icon className={itemIcon} />
                )
              ) : (
                <span className={collapseItemMini}>{prop.mini}</span>
              )}
              {/* collapse */}
              <ListItemText
                primary={prop.name}
                secondary={
                  // <b
                  //   className={ caret +" " +
                  //               (this.state[prop.state] ? classes.caretActive : "")
                  //             }
                  // />
                  this.state[prop.state] ? (
                    <span className="sidebar-minusIcon">
                      <i className="fas fa-minus"></i>
                    </span>
                  ) : (
                    <span className="sidebar-plusIcon">
                      <i className="fas fa-plus"></i>
                    </span>
                  )
                }
                disableTypography={true}
                className={cx(
                  { [itemText]: prop.icon !== undefined },
                  { [collapseItemText]: prop.icon === undefined }
                )}
              />
              {prop.infoIcon ? (
                <span className="sidebar-infolabel have-icon-right">
                  {prop.length}
                </span>
              ) : null}
            </NavLink>
            <Collapse in={this.state[prop.state]} unmountOnExit>
              <List className={classes.list + " " + classes.collapseList}>
                {this.createLinks(prop.views)}
              </List>
            </Collapse>
          </ListItem>
        );
      }

      if (prop.name === "Call Back") {
        prop.infoIcon = true;
        prop.length = this.state.callbackLength;
      }

      if (prop.name === "Contact Us") {
        prop.infoIcon = true;
        prop.length = this.state.contactUsLength;
      }

      if (prop.name === "Sales Lead") {
        prop.infoIcon = true;
        prop.length = this.state.salesLeadLength;
      }

      if (prop.name === "Shipment") {
        prop.infoIcon = true;
        prop.length = this.state.shipmentLength;
      }

      if (prop.name == "Chat") {
        prop.infoIcon = true;
        prop.length = this.state.chatCount;
      }

      const innerNavLinkClasses =
        classes.collapseItemLink +
        " " +
        cx({ [" " + classes[color]]: this.activeRoute(prop.path) });

      const collapseItemMini = classes.collapseItemMini;

      const navLinkClasses =
        classes.itemLink +
        " " +
        cx({ [" " + classes[color]]: this.activeRoute(prop.path) });

      const itemText =
        classes.itemText +
        " " +
        cx({
          [classes.itemTextMini]:
            this.props.miniActive && this.state.miniActive,
          [classes.itemTextMiniRTL]:
            this.props.miniActive && this.state.miniActive,
        });

      const collapseItemText =
        classes.collapseItemText +
        " " +
        cx({
          [classes.collapseItemTextMini]:
            this.props.miniActive && this.state.miniActive,
          [classes.collapseItemTextMiniRTL]:
            this.props.miniActive && this.state.miniActive,
        });

      const itemIcon = classes.itemIcon;
      return (
        <ListItem
          key={key}
          className={cx(
            { [classes.item]: prop.icon !== undefined },
            { [classes.collapseItem]: prop.icon === undefined }
          )}
        >
          <NavLink
            to={prop.layout + prop.path}
            className={cx(
              { [navLinkClasses]: prop.icon !== undefined },
              { [innerNavLinkClasses]: prop.icon === undefined }
            )}
          >
            {prop.icon !== undefined ? (
              typeof prop.icon === "string" ? (
                <Icon className={itemIcon}>{prop.icon}</Icon>
              ) : (
                <prop.icon className={itemIcon} />
              )
            ) : (
              <span className={collapseItemMini}> {prop.mini} </span>
            )}

            <ListItemText
              primary={prop.name}
              disableTypography={true}
              className={cx(
                { [itemText]: prop.icon !== undefined },
                { [collapseItemText]: prop.icon === undefined }
              )}
            />
            {prop.infoIcon ? (
              <Tooltip title={`New ` + prop.name}>
                <span className="sidebar-infolabel">{prop.length}</span>
              </Tooltip>
            ) : null}
          </NavLink>
        </ListItem>
      );
    });
  };

  render() {
    const {
      classes,
      logo,
      logoMain,
      image,
      logoText,
      routes,
      bgColor,
      rtlActive,
    } = this.props;

    const { dynamicRoutes } = this.state;

    var user = <div></div>;
    var links = (
      <List className={classes.list}>{this.createLinks(dynamicRoutes)}</List>
    );

    const logoNormal =
      classes.logoNormal +
      " " +
      cx({
        [classes.logoNormalSidebarMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.logoNormalSidebarMiniRTL]:
          rtlActive && this.props.miniActive && this.state.miniActive,
        [classes.logoNormalRTL]: rtlActive,
      });
    const logoMini =
      classes.logoMini +
      " " +
      cx({
        [classes.logoMiniRTL]: rtlActive,
      });
    const logoClasses =
      classes.logo +
      " " +
      cx({
        [classes.whiteAfter]: bgColor === "white",
      });

    var brand = (
      <div className={logoClasses}>
        <div className="SFL_main_logo">
          <a
            href="http://sflworldwide.com/"
            target="_blank"
            className={logoMini}
          >
            <img src={logo} alt="logo" className="sidebar-logo-mini" />
          </a>
          <a
            href="http://sflworldwide.com/"
            target="_blank"
            className={logoNormal}
          >
            <img src={logoMain} alt="logo" className="logo-text" />
          </a>
        </div>
      </div>
    );
    const drawerPaper =
      classes.drawerPaper +
      " " +
      cx({
        [classes.drawerPaperMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.drawerPaperRTL]: rtlActive,
      });
    const sidebarWrapper =
      classes.sidebarWrapper +
      " " +
      cx({
        [classes.drawerPaperMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.sidebarWrapperWithPerfectScrollbar]:
          navigator.platform.indexOf("Win") > -1,
      });

    return (
      <div ref={this.mainPanel}>
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={rtlActive ? "left" : "right"}
            open={this.props.open}
            classes={{
              paper: drawerPaper + " " + classes[bgColor + "Background"],
            }}
            onClose={this.props.handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {brand}
            <SidebarWrapper
              className={sidebarWrapper}
              user={user}
              headerLinks={<AdminNavbarLinks rtlActive={rtlActive} />}
              links={links}
            />
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{ backgroundImage: "url(" + image + ")" }}
              />
            ) : null}
          </Drawer>
        </Hidden>

        <Hidden smDown implementation="css">
          <Drawer
            onMouseOver={() => this.setState({ miniActive: false })}
            onMouseOut={() => this.setState({ miniActive: true })}
            anchor={rtlActive ? "right" : "left"}
            variant="permanent"
            open
            classes={{
              paper: drawerPaper + " " + classes[bgColor + "Background"],
            }}
          >
            {brand}
            <SidebarWrapper
              className={sidebarWrapper}
              user={user}
              links={links}
            />
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{ backgroundImage: "url(" + image + ")" }}
              />
            ) : null}
          </Drawer>
        </Hidden>
      </div>
    );
  }
}

Sidebar.defaultProps = {
  bgColor: "blue",
};

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  bgColor: PropTypes.oneOf(["white", "black", "blue"]),
  rtlActive: PropTypes.bool,
  color: PropTypes.oneOf([
    "white",
    "red",
    "orange",
    "green",
    "blue",
    "purple",
    "rose",
  ]),
  logo: PropTypes.string,
  logoText: PropTypes.string,
  image: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  miniActive: PropTypes.bool,
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
};

SidebarWrapper.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object,
  headerLinks: PropTypes.object,
  links: PropTypes.object,
};

export default withStyles(sidebarStyle)(Sidebar);
