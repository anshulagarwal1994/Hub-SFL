/*!

=========================================================
* Material Dashboard PRO React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Switch, Redirect } from "react-router-dom";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import { UnauthenticatedRoute, AuthenticatedRoute } from "./utils/authenticate";
// import cogoToast from "cogo-toast";
import AuthLayout from "layouts/Auth.js";
// import RtlLayout from "layouts/RTL.js";
import AdminLayout from "layouts/Admin.js";
import "assets/scss/material-dashboard-pro-react.scss?v=1.8.0";
const hist = createBrowserHistory();
ReactDOM.render(
  <Router history={hist}>
    <Switch>
      {/* <Route path="/rtl" component={RtlLayout} /> */}
      <UnauthenticatedRoute path="/auth" component={AuthLayout} />
      <AuthenticatedRoute path="/admin" component={AdminLayout} />
      <Redirect from="/" to="/auth/login-page" />
    </Switch>
  </Router>,
  document.getElementById("root")
);
