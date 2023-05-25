import React, { useState, useRef } from "react";
import cx from "classnames";
import { Switch, Route, Redirect } from "react-router-dom";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { makeStyles } from "@material-ui/core/styles";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import routes from "routes.js";
import styles from "assets/jss/material-dashboard-pro-react/layouts/adminStyle.js";
import IdleTimer from "react-idle-timer";
import { IdleTimeOutModal } from "./modal/IdleModal";

var ps;

const useStyles = makeStyles(styles);

export default function Dashboard(props) {
  const [timeoutDuration, setTimeoutDuration] = useState(1000 * 60 * 30);
  const [showModal, setShowModal] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const idleTimer = useRef();

  // const initialState = {
  //   timeout: 1000 * 60 * 30,
  //   showModal: false,
  //   userLoggedIn: false,
  //   isTimedOut: false,
  //   idleTimer: null
  // };

  // const [idleTimerData, setIdleTimerData] = useState(initialState);
  // var idleTimer = React.createRef();
  const { ...rest } = props;
  // states and functions
  // console.log("props.....",props.location.key);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [miniActive, setMiniActive] = React.useState(false);
  const [color, setColor] = React.useState("blue");
  const [bgColor, setBgColor] = React.useState("blue");
  const [logo, setLogo] = React.useState(require("assets/img/logo-icon.png"));
  const [logoMain, setlogoMain] = React.useState(
    require("assets/img/logo-main.png")
  );

  const classes = useStyles();
  const mainPanelClasses =
    classes.mainPanel +
    " " +
    cx({
      [classes.mainPanelSidebarMini]: miniActive,
      [classes.mainPanelWithPerfectScrollbar]:
        navigator.platform.indexOf("Win") > -1,
    });
  // ref for main panel div
  const mainPanel = React.createRef();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getRoute = () => {
    return window.location.pathname !== "/admin/full-screen-maps";
  };

  const getActiveRoute = (routes) => {
    let activeRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  const sidebarMinimize = () => {
    setMiniActive(!miniActive);
    console.log("Here there = ",miniActive )

    if(miniActive == true){
      var element = document.getElementById("myDIVcloseOpen");
      element.classList.remove("Close-Menu");
      element.classList.add("Open-Menu");
    }else{
      var element = document.getElementById("myDIVcloseOpen");
      element.classList.remove("Open-Menu");
      element.classList.add("Close-Menu");
    }

  };

  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      console.log("Here there bye")
      setMobileOpen(false);
    }
  };

  // Idle idleTimer functions

  // const onAction = (e) => {
  //   // console.log('user did something', e);
  //   setIdleTimerData((idleTimerData) => ({ ...idleTimerData, isTimedOut: false }));
  // };

  // const onActive = (e) => {
  //   // console.log('user is active', e);
  //   setIdleTimerData((idleTimerData) => ({ ...idleTimerData, isTimedOut: false }));
  // };

  // const onIdle = (e) => {
  //   // console.log('user is idle', e);
  //   const isTimedOut = idleTimerData.isTimedOut;
  //   if (isTimedOut) {
  //     // props.history.push('/');
  //   } else {
  //     setIdleTimerData((idleTimerData) => ({ ...idleTimerData, showModal: true }));
  //     idleTimerData.idleTimer.reset();
  //     setIdleTimerData((idleTimerData) => ({ ...idleTimerData, isTimedOut: true }));
  //   }
  // };

  // const handleClose = () => {
  //   setIdleTimerData((idleTimerData) => ({ ...idleTimerData, showModal: false }));
  // };

  // const handleLogout = () => {
  //   setIdleTimerData((idleTimerData) => ({ ...idleTimerData, showModal: false }));
  //   // sessionStorage.clear();
  //   // props.history.push('/auth/login-page');
  //   // HeaderLinks.onLogOut();
  //   props.history.push({
  //     isLogOut: true,
  //   });
  // };

  const onAction = () => {
    setIsTimedOut(false);
  };

  const onActive = (e) => {
    setIsTimedOut(false);
  };

  const onIdle = (e) => {
    if (!isTimedOut) {
      setShowModal(true);
      idleTimer.current.reset();
      setIsTimedOut(true);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleLogout = () => {
    setShowModal(false);
    props.history.push({
      isLogOut: true,
    });
  };

  return (
    <div className={classes.wrapper}>
      {/* <IdleTimer
        ref={ref => { idleTimerData.idleTimer = ref; }}
        element={document}
        onActive={onActive}
        onIdle={onIdle}
        onAction={onAction}
        debounce={250}
        timeout={idleTimerData.timeout} /> */}
      <IdleTimer
        ref={idleTimer}
        element={document}
        onActive={onActive}
        onIdle={onIdle}
        onAction={onAction}
        debounce={250}
        timeout={timeoutDuration}
      />

      <Sidebar
        routes={routes}
        logoText={"SFL Worldwide"}
        logo={logo}
        logoMain={logoMain}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        bgColor={bgColor}
        miniActive={miniActive}
        {...rest}
      />
      <div
        className={
          miniActive
            ? mainPanelClasses + " sidebar-minitoggle"
            : mainPanelClasses
        }
        ref={mainPanel}
      >
        <AdminNavbar
          sidebarMinimize={sidebarMinimize.bind(this)}
          miniActive={miniActive}
          brandText={getActiveRoute(routes)}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />

        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>
              <Switch>
                {getRoutes(routes)}
                <Redirect from="/" to="/auth/login-page" />
              </Switch>
              {/* <IdleTimeOutModal
                showModal={idleTimerData.showModal}
                handleClose={handleClose}
                handleLogout={handleLogout}
              /> */}
              <IdleTimeOutModal
                showModal={showModal}
                handleClose={handleClose}
                handleLogout={handleLogout}
              />
            </div>
          </div>
        ) : (
          <div className={classes.map}>
            <Switch>
              {getRoutes(routes)}
              <Redirect from="/" to="/auth/login-page" />
            </Switch>
          </div>
        )}
        {window.location.href.includes("Chatbot") ? null : getRoute() ? (
          <Footer fluid />
        ) : null}
      </div>
    </div>
  );
}
