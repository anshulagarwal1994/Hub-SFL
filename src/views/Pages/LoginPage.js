import React, { Component } from "react";
import cogoToast from "cogo-toast";
import SimpleBackdrop from "../../utils/general";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import { NavLink } from "react-router-dom";
import api from "../../utils/apiClient";
// import moment from "moment";
import Face from "@material-ui/icons/Face";
import { green } from "@material-ui/core/colors";
import { red } from "@material-ui/core/colors";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import image from "assets/img/left-SIGNUP-image.png";
import Cookies from "universal-cookie";

const moment = require("moment-timezone")
const useStyles = makeStyles(styles);
const cookies = new Cookies();
class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameErr: false,
      passwordErr: false,
      isloggedIn: false,
      Loading: false,

      usernameHelperText: "",
      passwordHelperText: "",

      userName: "",
      password: "",

      checkUserName: false,
      checkPassword: false,
    };
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleBlur = (event, type) => {
    if (type === "username") {
      this.setState({ checkUserName: true });
      let usernameVal = event.target.value;

      if (usernameVal === "" || usernameVal === null) {
        this.setState({
          usernameErr: true,
          open: true,
          usernameHelperText: "Please enter User Name",
        });
      } else if (usernameVal.trim() !== usernameVal) {
        this.setState({
          usernameErr: true,
          open: true,
          usernameHelperText: "Please enter valid User Name",
        });
      } else {
        this.setState({
          usernameErr: false,
          open: false,
          usernameHelperText: "",
          userName: usernameVal,
        });
      }
    } else if (type === "password") {
      this.setState({ checkPassword: true });
      let passwordVal = event.target.value;

      if (passwordVal === "" || passwordVal === null) {
        this.setState({
          passwordErr: true,
          open: true,
          passwordHelperText: "Please enter Password",
        });
      } else if (passwordVal.trim() !== passwordVal) {
        this.setState({
          passwordErr: true,
          open: true,
          passwordHelperText: "Please enter valid Password",
        });
      } else {
        this.setState({
          passwordErr: false,
          open: false,
          passwordHelperText: "",
          password: passwordVal,
        });
      }
    }
  };

  handleChange = (event, type) => {
    if (type === "username") {
      this.setState({ userName: event.target.value });
    } else if (type === "password") {
      this.setState({ password: event.target.value });
    }
  };

  login = (event) => {
    event.preventDefault();
    try {
      this.setState({ Loading: true });
      let data = {
        UserName: this.state.userName,
        Password: this.state.password,
      };

      api
        .post("authentication/userLoginAuthenticate", data)
        .then((res) => {
          if (res.success) {
            this.setState({ isloggedIn: true });

            var paperData = {
              paperId: res.Data.SelectedPaperSize,
            };

            api
              .post("userManagement/getPaperSizeByPaperId", paperData)
              .then((res) => {
                localStorage.setItem(
                  "selectedPaperSize",
                  res.data[0].PaperOrgName
                );
              });

            let timeZone = moment.tz.guess();

            const time = moment.tz(res.Data.LastLoginTimestamp);

            const date = time.clone().tz(timeZone);
            let formatDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
            formatDate = moment(formatDate).add(30, "minutes");
            res.Data.LastLoginTimestamp = moment(formatDate).format(
              "YYYY-MM-DD HH:mm:ss"
            );

            localStorage.setItem(
              "loggedInUserData",
              JSON.stringify(res.Data, this.state.isloggedIn)
            );

            var receiver = document.getElementById("receiver").contentWindow;
            receiver.postMessage(
              JSON.stringify(res.Data),
              "https://www.sflworldwide.com"
            );

            setTimeout(() => {
              this.props.history.push("/admin/Scheduleshipment");
            }, 4000);
          } else {
            this.setState({ Loading: false });
            cogoToast.error("Incorrect Username and/or Password");
          }
        })
        .catch((err) => {
          this.setState({ Loading: false });
          
            
            cogoToast.error("Something Went Wrong");
        });
    } catch (error) {
      this.setState({ Loading: false });
      cogoToast.error("Something Went Wrong");
    }
  };

  forgotRedirect = () => {
    this.props.history.push("/auth/forgotpassword-page");
  };

  registerRedirect = () => {
    this.props.history.push("/auth/register-page");
  };

  render() {
    const { usernameErr } = this.state;
    const { passwordErr } = this.state;
    const { checkUserName } = this.state;
    const { checkPassword } = this.state;

    return (
      <div className="signup-page-outer">
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
        <GridContainer justify="center">
          <GridItem className="signup-page-outer2">
            <Card className="Signup-main-outer">
              <CardBody className="Signup-main-inner">
                <GridContainer>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={6}
                    className="signup-left-section"
                  >
                    <div className="signup-left-outer">
                      <div className="signup-left-inner">
                        <div className="signup-left-text">
                          <h2>Introducing Ship Smart with SFL Worldwide</h2>
                          <p>
                            One Stop Hub for all Domestic & International
                            Shipping and Moving Services
                          </p>
                          <img src={image} alt="SFL Worldwide" />
                        </div>
                      </div>
                    </div>
                  </GridItem>
                  <GridItem xs={12} sm={8} md={6}>
                    <div className="login-logo"></div>
                    <form className="signin-form-outer">
                      <iframe
                        id="receiver"
                        style={{ display: "none" }}
                        src="https://www.sflworldwide.com"
                      ></iframe>
                      <CustomInput
                        labelText="Username *"
                        id="username"
                        error={this.state.usernameErr}
                        helperText={this.state.usernameHelperText}
                        formControlProps={{ fullWidth: true }}
                        inputProps={{
                          onChange: (event) =>
                            this.handleChange(event, "username"),
                          onBlur: (event) => this.handleBlur(event, "username"),
                          onFocus: () =>
                            this.setState({
                              usernameErr: false,
                              usernameHelperText: "",
                              checkUserName: false,
                            }),
                          endAdornment: !checkUserName ? (
                            <InputAdornment
                              position="end"
                              className={useStyles.inputAdornment}
                            >
                              <Face className={useStyles.inputAdornmentIcon} />
                            </InputAdornment>
                          ) : usernameErr ? (
                            <InputAdornment position="end">
                              <CloseIcon
                                style={{ color: red[500] }}
                                className={useStyles.danger}
                              />
                            </InputAdornment>
                          ) : (
                            <InputAdornment position="end">
                              {" "}
                              <DoneIcon
                                style={{ color: green[500] }}
                                className={useStyles.success}
                              />{" "}
                            </InputAdornment>
                          ),
                        }}
                      />

                      <CustomInput
                        labelText="Password *"
                        id="password"
                        type="password"
                        error={this.state.passwordErr}
                        helperText={this.state.passwordHelperText}
                        formControlProps={{ fullWidth: true }}
                        inputProps={{
                          onChange: (event) =>
                            this.handleChange(event, "password"),
                          onBlur: (event) => this.handleBlur(event, "password"),
                          onFocus: () =>
                            this.setState({
                              passwordErr: false,
                              passwordHelperText: "",
                              checkPassword: false,
                            }),
                          endAdornment: !checkPassword ? (
                            <InputAdornment
                              position="end"
                              className={useStyles.inputAdornment}
                            >
                              <Icon className={useStyles.inputAdornmentIcon}>
                                lock_outline
                              </Icon>
                            </InputAdornment>
                          ) : passwordErr ? (
                            <InputAdornment position="end">
                              <CloseIcon
                                style={{ color: red[500] }}
                                className={useStyles.danger}
                              />
                            </InputAdornment>
                          ) : (
                            <InputAdornment position="end">
                              {" "}
                              <DoneIcon
                                style={{ color: green[500] }}
                                className={useStyles.success}
                              />{" "}
                            </InputAdornment>
                          ),
                          type: "password",
                          autoComplete: "off",
                        }}
                      />

                      <CardFooter className="loginpage-footer">
                        <div className="shipment-submit">
                          <GridItem xs={12} sm={6} md={6}>
                            <div className="ship-sub-inner">
                              <Button
                                color="rose"
                                id="login"
                                type="Submit"
                                onClick={(event) => this.login(event)}
                              >
                                Login{" "}
                              </Button>
                              <NavLink
                                className="loginpage-register-link"
                                to={"/auth/forgotpassword-page"}
                              >
                                Forgot Username/Password ?
                              </NavLink>
                            </div>
                          </GridItem>
                          <GridItem xs={12} sm={6} md={6}>
                            <div className="ship-sub-inner">
                              <Button
                                color="primary"
                                onClick={() => this.registerRedirect()}
                              >
                                Register
                              </Button>
                            </div>
                          </GridItem>
                        </div>

                        {/* <ListItemText className="register-link-outer">
                              Don't have an account?
                              <Button color="primary" onClick={()=> this.registerRedirect()}>
                                Register 
                              </Button>
                              <NavLink className="loginpage-register-link" to={"/auth/register-page"}>
                                Register
                              </NavLink>
                            </ListItemText> */}
                      </CardFooter>
                    </form>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
export default LoginPage;
