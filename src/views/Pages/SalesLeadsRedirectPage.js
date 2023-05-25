import React, { Component } from "react";

import SimpleBackdrop from "../../utils/general";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import Cookies from "universal-cookie";

const useStyles = makeStyles(styles);
const cookies = new Cookies();
class SalesLeadsRedirectPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loading: true,
    };
  }

  componentDidMount = () => {
    this.setState({
      Loading: true,
    });
    var queryString2 = new Array();
    var salesleadId = "";
    if (queryString2.length == 0) {
      if (window.location.search.split("?").length > 1) {
        var params2 = window.location.search.split("?")[1].split("&");
        for (var i = 0; i < params2.length; i++) {
          var key = params2[i].split("=")[0];
          var value = decodeURIComponent(params2[i].split("=")[1]);
          queryString2[key] = value;
        }
      }
    }
    if (queryString2["saleid"] != null) {
      salesleadId = queryString2["saleid"];
    }

    var Reqid = this.props.match.params ? this.props.match.params.id : "";

    var data = window.atob(Reqid);
    var insertdata = data.split("/");

    localStorage.setItem("sealsleadid", salesleadId);
    localStorage.setItem("ServiceType", insertdata[0]);
    localStorage.setItem("Mainname", insertdata[1]);
    localStorage.setItem("Subname", insertdata[2]);
    localStorage.setItem("getRate", insertdata[3]);

    if (localStorage.getItem("loggedInUserData")) {
      this.ScheduleshipmentRedirect();
    } else {
      this.loginRedirect();
    }
  };

  ScheduleshipmentRedirect = () => {
    this.setState({ Loading: false });
    this.props.history.push("/admin/Scheduleshipment");
  };

  loginRedirect = () => {
    this.setState({ Loading: false });
    this.props.history.push("/auth/login-page");
  };

  render() {
    return (
      <div className="signup-page-outer">
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
      </div>
    );
  }
}
export default SalesLeadsRedirectPage;
