import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { CommonConfig } from "../../utils/constant";
import { makeStyles } from "@material-ui/core/styles";
import api from "../../utils/apiClient";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";
import Hidden from "@material-ui/core/Hidden";
import Popper from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
import { useHistory } from "react-router-dom";
import Button from "components/CustomButtons/Button.js";
import styles from "assets/jss/material-dashboard-pro-react/components/adminNavbarLinksStyle.js";
import SimpleBackdrop from "../../utils/general";
import cogoToast from "cogo-toast";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const [openProfile, setOpenProfile] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [Loading, setLoading] = React.useState(false);
  const [isLogOut, setIsLogOut] = useState(true);
  const searchSpace = (event) => {
    let keyword = event.target.value;
    setSearch(keyword);
  };

  const handleClickProfile = (event) => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  let history = useHistory();

  const handleCloseProfile = () => {
    setOpenProfile(null);
  };
  const handleOpenProfile = () => {
    setOpenProfile(null);
    history.push("/admin/ProfilePage");
  };
  const releaseLock = () => {
    let data = {
      ShippingID: "",
      UserID: CommonConfig.loggedInUserData().PersonID,
      ReleaseAll: 1,
    };
    api
      .post("scheduleshipment/releaseShipmentLockByID", data)
      .then((res) => {
        if (res.success) {
        } else {
        }
      })
      .catch((err) => {
        console.log("setLock err", err);
      });
  };
  const inActiveChatStatus = () => {
    var chatData = {
      agentId: CommonConfig.loggedInUserData().PersonID,
      IsAvailableForChat: 0,
    };
    api
      .post("customerChat/updateAgentChatActiveStatus", chatData)
      .then((res) => {});
  };

  const onLogOut = () => {
    releaseLock();
    inActiveChatStatus();
    setLoading(true);
    var receiver = document.getElementById("receiver").contentWindow;
    receiver.postMessage("", "https://www.sflworldwide.com");
    localStorage.clear();
    setTimeout(() => {
      history.push("/login-page");
      setLoading(false);
    }, 3000);
  };

  if (props.props && props.props.location) {
    if (props.props.location.isLogOut && isLogOut) {
      setIsLogOut(false);
      onLogOut();
    }
  }

  const _handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      onSearch();
    }
  };

  const onSearch = () => {
    if (search !== null && search.length > 3) {
      if (history.location.pathname.substring(1, 14) == "admin/Search/") {
        history.replace("/admin/ReSearch/" + search);
      } else {
        history.replace("/admin/Search/" + search);
      }
    } else {
      cogoToast.error("Please Enter at least 4 characters");
    }
    setSearch("");
  };

  const classes = useStyles();
  const dropdownItem = classNames(classes.dropdownItem, classes.primaryHover);
  const managerClasses = classNames({ [classes.managerClasses]: true });

  return (
    <div className="header-right-part">
      {Loading === true ? (
        <div className="loading">
          <SimpleBackdrop />
        </div>
      ) : null}
      {CommonConfig.getUserAccess("Basic Search").ReadAccess ? (
        <div className="header-search">
          <input
            type="text"
            placeholder="Enter item to be searched"
            value={search}
            onKeyDown={_handleKeyDown}
            onChange={(e) => searchSpace(e)}
          />
          <Button
            color="transparent"
            aria-haspopup="true"
            className={classes.buttonLink}
            onClick={onSearch}
          >
            <i className="fa fa-search" aria-hidden="true"></i>
          </Button>
        </div>
      ) : null}

      <div className={managerClasses}>
        <div className="top-right-user-icon">
          <iframe
            id="receiver"
            style={{ display: "none" }}
            src="https://www.sflworldwide.com"
          ></iframe>
          <Button
            color="transparent"
            aria-owns={openProfile ? "profile-menu-list" : null}
            aria-haspopup="true"
            onClick={handleClickProfile}
            className={classes.buttonLink}
            muiClasses={{ label: CommonConfig.loggedInUserData().Name }}
          >
            <label className={classes.buttonLink}>
              {CommonConfig.loggedInUserData().Name}{" "}
              <i className="fa fa-caret-down" aria-hidden="true"></i>
            </label>
            <Hidden mdUp implementation="css">
              <span className={classes.linkText}>Profile</span>
            </Hidden>
          </Button>
          <Popper
            open={Boolean(openProfile)}
            anchorEl={openProfile}
            transition
            disablePortal
            placement="bottom"
            className={classNames({
              [classes.popperClose]: !openProfile,
              [classes.popperResponsive]: true,
              [classes.popperNav]: true,
            })}
          >
            {({ TransitionProps }) => (
              <Grow
                {...TransitionProps}
                id="profile-menu-list"
                style={{ transformOrigin: "0 0 0" }}
              >
                <Paper className={classes.dropdown}>
                  <ClickAwayListener onClickAway={handleCloseProfile}>
                    <MenuList role="menu">
                      <MenuItem
                        onClick={handleOpenProfile}
                        className={dropdownItem}
                      >
                        {" "}
                        Profile{" "}
                      </MenuItem>
                      <Divider light />
                      <MenuItem onClick={onLogOut} className={dropdownItem}>
                        {" "}
                        Log out{" "}
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    </div>
  );
}
