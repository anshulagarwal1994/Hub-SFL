import React, { Component } from "react";
import cogoToast from "cogo-toast";
import api from "../../utils/apiClient";
import SimpleBackdrop from "../../utils/general";
// import moment from "moment";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import ListItemText from "@material-ui/core/ListItemText";
import { NavLink } from "react-router-dom";

// @material-ui/icons
import { CommonConfig } from "../../utils/constant";
import { green } from "@material-ui/core/colors";
import { red } from "@material-ui/core/colors";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import FormControl from "@material-ui/core/FormControl";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import { TextField } from "@material-ui/core";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Typography from "@material-ui/core/Typography";
import styles from "assets/jss/material-dashboard-pro-react/views/registerPageStyle";
import {
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
  MDBContainer,
} from "mdbreact";

import image from "assets/img/left-SIGNUP-image.png";
const moment = require("moment-timezone");
const useStyles = makeStyles(styles);

class RegisterPage extends Component {
  constructor(props) {
    // this.handleBeforeunload = this.handleBeforeunload.bind(this)
    super(props);
    this.state = {
      username1: "",
      fullnameErr: false,
      usernameErr: false,
      emailErr: false,
      passwordErr: false,
      confirmpasswordErr: false,
      mobileErr: false,

      isloggedIn: false,
      Loading: false,

      username: "",
      fullname: "",
      email: "",
      mobile: "",
      password: "",
      confirmpassword: "",

      fullnameHelperText: "",
      usernameHelperText: "",
      emailHelperText: "",
      confirmpasswordHelperText: "",
      passwordHelperText: "",
      mobileHelperText: "",

      checkUserName: false,
      checkFullName: false,
      checkEmail: false,
      checkPassword: false,
      checkConfirmPassword: false,
      checkMobile: false,
      checkLetter: false,
      checkUpperCase: false,
      checkLowerCase: false,
      checkNumber: false,
      checkSpecialCharacter: false,

      userCheckNumber: false,
      userCheckLetter: null,
      userCheckLowerCase: false,
      userCheckSpecialCharacter: false,
      userCheckUpperCase: null,
      userMinCharacter: null,
      userMaxCharacter: null,
      passwordPoup: false,
      userNamePoup: false,
      NofirstInputSpecialCharacter: false,
      SpecialCharactervalid: null,
      specialcharacter: false,
    };
  }

  // async componentDidMount() {
  //   window.onbeforeunload  = function () {
  //     console.log("test data vivek");
  //   }
  // }

  // handleBeforeunload() {
  //  console.log("test data vivek");
  // }

  validate = (event) => {
    let IsFormValid = true;
    if (CommonConfig.isEmpty(this.state.fullname)) {
      IsFormValid = false;
      this.setState({
        fullnameErr: true,
        fullnameHelperText: "Please enter Full name",
      });
    }
    if (CommonConfig.isEmpty(this.state.username)) {
      IsFormValid = false;
      this.setState({
        usernameErr: true,
        usernameHelperText: "Please enter username",
      });
    }

    if (
      this.state.userCheckLetter === false ||
      this.state.specialcharacter === true ||
      // this.state.NofirstInputSpecialCharacter === false ||
      // this.state.userCheckSpecialCharacter === false ||
      this.state.userMinCharacter === false ||
      // ||
      // this.state.userCheckUpperCase === false
      this.state.userMaxCharacter === false
    ) {
      IsFormValid = false;
      this.setState({
        usernameErr: true,
        usernameHelperText: "Please enter valid username",
      });
    }

    // if (this.state.username.length < 9) {
    //   IsFormValid = false;
    //   this.setState({
    //     usernameErr: true,
    //     usernameHelperText: "Please enter atleast 8 characters",
    //   });
    // }
    if (this.state.emailErr) {
      this.hideLoader();
      IsFormValid = false;
      this.setState({
        emailErr: true,
        emailHelperText: "Please enter valid email",
      });
    }
    if (this.state.fullnameErr) {
      IsFormValid = false;
      this.setState({
        fullnameErr: true,
        fullnameHelperText: "Please enter valid full name",
      });
    }
    if (this.state.mobileErr) {
      IsFormValid = false;
      this.setState({
        mobileErr: true,
        mobileHelperText: "Please enter valid mobile",
      });
    }
    if (this.state.passwordErr) {
      IsFormValid = false;
      this.setState({
        passwordErr: true,
        passwordHelperText: "Please enter valid password",
      });
    }
    if (this.state.confirmpasswordErr) {
      IsFormValid = false;
      this.setState({
        confirmpasswordErr: true,
        confirmpasswordHelperText: "Please enter valid confirm password",
      });
    }
    if (this.state.confirmpassword !== this.state.password) {
      IsFormValid = false;
      this.setState({
        confirmpasswordErr: true,
        confirmpasswordHelperText:
          "Password and Confirm Password does not match",
      });
    }
    if (CommonConfig.isEmpty(this.state.mobile)) {
      IsFormValid = false;
      this.setState({
        mobileErr: true,
        mobileHelperText: "Please enter mobile number",
      });
    }
    if (CommonConfig.isEmpty(this.state.password)) {
      IsFormValid = false;
      this.setState({
        passwordErr: true,
        passwordHelperText: "Please enter password",
      });
    }
    if (CommonConfig.isEmpty(this.state.confirmpassword)) {
      IsFormValid = false;
      this.setState({
        confirmpasswordErr: true,
        confirmpasswordHelperText: "Please enter confirmpassword",
      });
    }
    if (CommonConfig.isEmpty(this.state.email)) {
      IsFormValid = false;
      this.setState({ emailErr: true, emailHelperText: "Please enter email " });
    }
    return IsFormValid;
  };

  handleBlur = (event, type) => {
    // var userNmaeRegex=/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@#$%^&+=._-])[a-zA-Z0-9@#$%^&+=._-]{8,32}$/;
    if (type === "fullname") {
      this.setState({ checkFullName: true });
      let val = event.target.value;
      if (CommonConfig.isEmpty(val)) {
        this.setState({
          fullnameErr: true,
          fullnameHelperText: "Please enter Full Name",
        });
      } else if (val.trim() !== val) {
        this.setState({
          fullnameErr: true,
          fullnameHelperText: "Please enter valid Full Name",
        });
      } else {
        this.setState({
          fullname: val,
          fullnameErr: false,
          fullnameHelperText: "",
        });
      }
    }

    if (type === "username") {
      this.setState({ checkUserName: true });
      let usernameVal = event.target.value;
      // console.log("checkusernameerr", event.target.value.splice(0, 5));
      if (CommonConfig.isEmpty(usernameVal)) {
        this.setState({
          usernameErr: true,
          userCheckNumber: false,
          userCheckLetter: false,
          userCheckUpperCase: false,
          userCheckSpecialCharacter: false,
          userMinCharacter: false,
          userMaxCharacter: false,
          NofirstInputSpecialCharacter: false,
          specialcharacter: false,
          usernameHelperText: "Please enter User Name",
        });
      } else if (usernameVal) {
        if (usernameVal.match(CommonConfig.RegExp.regExpLowerCase)) {
          this.setState({
            username: usernameVal,
            userCheckLetter: true,
            usernameErr: false,
            usernameHelperText: "",
          });
        } else {
          this.setState({
            username: usernameVal,
            userCheckLetter: false,
            usernameErr: false,
            usernameHelperText: "",
          });
        }

        // if (usernameVal.match(CommonConfig.RegExp.regExpUpperCase)) {
        //   this.setState({
        //     username: usernameVal,
        //     userCheckLetter: false,
        //     usernameErr: false,
        //     usernameHelperText: "",
        //   });
        // } else {
        //   this.setState({
        //     username: usernameVal,
        //     // userCheckLetter: true,
        //     usernameErr: false,
        //     usernameHelperText: "",
        //   });
        // }

        if (usernameVal.match(CommonConfig.RegExp.regExpNumber)) {
          this.setState({
            username: usernameVal,
            userCheckNumber: true,
            usernameErr: false,
            usernameHelperText: "",
          });
        } else {
          this.setState({
            username: usernameVal,
            userCheckNumber: false,
            usernameErr: false,
            usernameHelperText: "",
          });
        }

        if (usernameVal.match(CommonConfig.RegExp.regExpUpperCase)) {
          this.setState({
            username: usernameVal,
            userCheckUpperCase: true,

            usernameErr: false,
            usernameHelperText: "",
          });
        } else {
          this.setState({
            username: usernameVal,
            userCheckUpperCase: false,

            usernameErr: false,
            usernameHelperText: "",
          });
        }

        if (usernameVal.length >= 8) {
          this.setState({
            username: usernameVal,
            userMinCharacter: true,
            usernameErr: false,
            usernameHelperText: "",
          });
        } else {
          this.setState({
            username: usernameVal,
            userMinCharacter: false,
            usernameErr: false,
            usernameHelperText: "",
          });
        }

        if (usernameVal.length <= 32) {
          this.setState({
            username: usernameVal,
            userMaxCharacter: true,

            usernameErr: false,
            usernameHelperText: "",
          });
        } else {
          this.setState({
            username: usernameVal,
            userMaxCharacter: false,

            usernameErr: false,
            usernameHelperText: "",
          });
        }

        if (usernameVal.match(CommonConfig.RegExp.userNameSpecialCharacter)) {
          console.log(
            "checkspecial",
            usernameVal.match(CommonConfig.RegExp.userNameSpecialCharacter)
          );
          this.setState({
            username: usernameVal,
            userCheckSpecialCharacter: true,
            SpecialCharactervalid: "",
            usernameErr: false,
            usernameHelperText: "",
          });
        } else {
          this.setState({
            username: usernameVal,
            userCheckSpecialCharacter: false,
            SpecialCharactervalid: "",
            usernameErr: false,
            usernameHelperText: "",
          });
        }

        if (
          (usernameVal.match(CommonConfig.RegExp.NofirstInputSpecialCharacter),
          console.log(
            "checkfirstinput12",
            usernameVal.match(CommonConfig.RegExp.NofirstInputSpecialCharacter)
          ))
        ) {
          this.setState({
            username: usernameVal,
            NofirstInputSpecialCharacter: true,
            usernameErr: false,
            usernameHelperText: "",
          });
        } else {
          this.setState({
            username: usernameVal,
            NofirstInputSpecialCharacter: false,
            usernameErr: false,
            usernameHelperText: "",
          });
        }

        if (usernameVal.match(CommonConfig.RegExp.userErrorSpecial)) {
          this.setState({
            username: usernameVal,
            specialcharacter: true,
            userCheckSpecialCharacter: "",
            usernameErr: false,
            usernameHelperText: "",
          });
        } else {
          this.setState({
            username: usernameVal,
            specialcharacter: false,
            usernameErr: false,
            usernameHelperText: "",
          });
        }
      }
    }

    // userNmaeRegex
    //   else if (usernameVal.length < 8) {
    //     this.setState({
    //       username: usernameVal,
    //       usernameErr: true,
    //       usernameHelperText: "Please enter valid User Name",
    //     });
    //   } else if (
    //     /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@#$%^&+=._-])[a-zA-Z0-9@#$%^&+=._-]{8,32}$/.test(
    //       usernameVal
    //     )
    //   ) {
    //     this.setState({
    //       username: usernameVal,
    //       usernameErr: true,
    //       usernameHelperText:
    //         "Please do not enter space and special character except(@ and .)",
    //     });
    //   } else {
    //     this.setState({
    //       username: usernameVal,
    //       usernameErr: false,
    //       usernameHelperText: "",
    //     });
    //   }
    // }

    if (type === "email") {
      this.setState({ checkEmail: true });
      let emailVal = event.target.value;
      if (CommonConfig.isEmpty(emailVal)) {
        this.setState({
          emailErr: true,
          emailHelperText: "Please enter Email",
        });
      } else if (
        emailVal.trim() !== emailVal ||
        !emailVal.match(CommonConfig.RegExp.email)
      ) {
        this.setState({
          emailErr: true,
          emailHelperText: "Please enter valid Email",
        });
      } else {
        this.setState({
          email: emailVal,
          emailErr: false,
          emailHelperText: "",
        });
      }
    }

    if (type === "mobile") {
      this.setState({ checkMobile: true });
      let mobileVal = event.target.value;
      let regExp = /^[0-9]{10,15}$/;
      if (CommonConfig.isEmpty(mobileVal)) {
        this.setState({
          mobileErr: true,
          mobileHelperText: "Please enter Mobile Number",
        });
      } else if (mobileVal.trim() !== mobileVal || !mobileVal.match(regExp)) {
        this.setState({
          mobileErr: true,
          mobileHelperText: "Please enter valid Mobile Number",
        });
      } else {
        this.setState({
          mobile: mobileVal,
          mobileErr: false,
          mobileHelperText: "",
        });
      }
    }

    if (type === "password") {
      this.setState({ checkPassword: true });
      let passwordVal = event.target.value;
      if (CommonConfig.isEmpty(passwordVal)) {
        this.setState({
          passwordErr: true,
          checkNumber: false,
          checkLetter: false,
          checkLowerCase: false,
          checkSpecialCharacter: false,
          checkUpperCase: false,
          password: passwordVal,
          passwordHelperText: "Please enter Password",
        });
      } else if (passwordVal) {
        if (passwordVal.match(CommonConfig.RegExp.regExpNumber)) {
          this.setState({
            password: passwordVal,
            checkNumber: true,
            passwordErr: false,
            passwordHelperText: "",
          });
        } else {
          this.setState({
            password: passwordVal,
            checkNumber: false,
            passwordErr: false,
            passwordHelperText: "",
          });
        }
        if (passwordVal.match(CommonConfig.RegExp.regExpUpperCase)) {
          this.setState({
            password: passwordVal,
            checkUpperCase: true,
            passwordErr: false,
            passwordHelperText: "",
          });
        } else {
          this.setState({
            password: passwordVal,
            checkUpperCase: false,
            passwordErr: false,
            passwordHelperText: "",
          });
        }
        if (passwordVal.match(CommonConfig.RegExp.regExpLowerCase)) {
          this.setState({
            password: passwordVal,
            checkLowerCase: true,
            passwordErr: false,
            passwordHelperText: "",
          });
        } else {
          this.setState({
            password: passwordVal,
            checkLowerCase: false,
            passwordErr: false,
            passwordHelperText: "",
          });
        }
        if (passwordVal.length >= 8) {
          this.setState({
            password: passwordVal,
            checkLetter: true,
            passwordErr: false,
            passwordHelperText: "",
          });
        } else {
          this.setState({
            password: passwordVal,
            checkLetter: false,
            passwordErr: false,
            passwordHelperText: "",
          });
        }

        if (passwordVal.match(CommonConfig.RegExp.regExpSpecialCharacter)) {
          this.setState({
            password: passwordVal,
            checkSpecialCharacter: true,
            passwordErr: false,
            passwordHelperText: "",
          });
        } else {
          this.setState({
            password: passwordVal,
            checkSpecialCharacter: false,
            passwordErr: false,
            passwordHelperText: "",
          });
        }
        if (/[^A-Za-z@$.%&*!\d]/.test(passwordVal)) {
          this.setState({
            password: passwordVal,
            passwordErr: true,
            passwordHelperText: "Please do not enter space",
          });
        } else {
          this.setState({
            password: passwordVal,
            passwordErr: false,
            passwordHelperText: "",
          });
        }
      } else {
        this.setState({
          passwordErr: false,
          passwordHelperText: "",
          password: passwordVal,
        });
      }
    }

    if (type === "confirmpassword") {
      this.setState({ checkConfirmPassword: true });
      let confirmpasswordVal = event.target.value;
      if (CommonConfig.isEmpty(confirmpasswordVal)) {
        this.setState({
          confirmpasswordErr: true,
          confirmpasswordHelperText: "Please enter Confirm Password",
        });
      } else if (confirmpasswordVal !== this.state.password) {
        this.setState({
          confirmpasswordErr: true,
          confirmpasswordHelperText:
            "Password and Confirm Password does not match",
        });
      } else {
        this.setState({
          confirmpassword: confirmpasswordVal,
          confirmpasswordErr: false,
          confirmpasswordHelperText: "",
        });
      }
    }
  };

  showLoader() {
    this.setState({ Loading: true });
  }

  hideLoader() {
    this.setState({ Loading: false });
  }

  signUP = (event) => {
    if (this.validate(event)) {
      this.showLoader();
      try {
        let UserDetails = {
          AccountNumber: "",
          ManagedBy: "",
          CompanyName: "",
          AddressLine1: "",
          AddressLine2: "",
          AddressLine3: "",
          ZipCode: "",
          City: "",
          State: "",
          ContactName: "",
          CountryID: "",
          UserDetailID: null,
        };
        let data = {
          Name: this.state.fullname,
          UserName: this.state.username,
          Password: this.state.password,
          Phone: this.state.mobile,
          Email: this.state.email,
          Phone2: "",
          UserDetails: UserDetails,
        };

        api
          .post("authentication/userRegister", data)
          .then((res) => {
            // this.hideLoader();
            if (res.success) {
              this.login(data);
            } else {
              cogoToast.error(res.message);
              this.hideLoader();
            }
          })
          .catch((err) => {
            cogoToast.error(err);
            this.hideLoader();
          });
      } catch (error) {
        cogoToast.error("Something Went Wrong");
        this.hideLoader();
      }
    }
    // else {
    //   this.hideLoader();
    // }
  };

  login(data) {
    try {
      api
        .post("authentication/userLoginAuthenticate", data)
        .then((res) => {
          if (res.success) {
            this.setState({ isloggedIn: true });
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

            // sessionStorage.setItem(
            //   "loggedInUserData",
            //   JSON.stringify(res.Data, this.state.isloggedIn)
            // );

            var receiver = document.getElementById("receiver").contentWindow;
            receiver.postMessage(
              JSON.stringify(res.Data),
              "https://www.sflworldwide.com"
            );

            setTimeout(() => {
              this.props.history.push("/admin/Scheduleshipment");
              this.hideLoader();
            }, 4000);
            // this.hideLoader();
          } else {
            this.setState({ Loading: false });
            cogoToast.error(res.message);
          }
        })
        .catch((err) => {
          cogoToast.error(err);
        });
    } catch (error) {
      cogoToast.error("Something Went Wrong");
    }
  }

  render() {
    const {
      usernameErr,
      fullnameErr,
      emailErr,
      mobileErr,
      confirmpasswordErr,
      checkConfirmPassword,
      checkFullName,
      checkMobile,
      checkUserName,
      checkNumber,
      checkUpperCase,
      checkLowerCase,
      checkSpecialCharacter,
      checkLetter,
      userCheckNumber,
      userCheckLetter,
      userCheckSpecialCharacter,
      userMinCharacter,
      userMaxCharacter,
      userCheckUpperCase,
      NofirstInputSpecialCharacter,
      SpecialCharactervalid,
      specialcharacter,
    } = this.state;
    console.log("specialcharacter11", NofirstInputSpecialCharacter);

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
                  <GridItem xs={12} sm={12} md={6}>
                    <div className="login-logo"></div>
                    <form className="signup-form-outer">
                      <CustomInput
                        labelText={<span>Full Name</span>}
                        id="fullname"
                        name="fullname"
                        variant="outlined"
                        error={this.state.fullnameErr}
                        helperText={this.state.fullnameHelperText}
                        formControlProps={{ fullWidth: true }}
                        inputProps={{
                          onBlur: (event) => this.handleBlur(event, "fullname"),
                          onFocus: () =>
                            this.setState({
                              fullnameErr: false,
                              fullnameHelperText: "",
                              checkFullName: false,
                            }),
                          endAdornment:
                            checkFullName !== true ? (
                              <Icon>person</Icon>
                            ) : fullnameErr ? (
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
                                />
                              </InputAdornment>
                            ),
                          autoComplete: "none",
                        }}
                      />
                      {/* <MDBPopover
                        className="ps-popover-outer"
                        placement="bottom"
                        popover
                        id="popper1"
                      > */}
                      <div className="pop-wrap">
                        <FormControl fullWidth className="pass-input">
                          <TextField
                            label="User Name"
                            labelText="User Name"
                            id="username"
                            error={this.state.usernameErr}
                            helperText={this.state.usernameHelperText}
                            formControlProps={{ fullWidth: true }}
                            inputProps={{
                              onChange: (event) =>
                                this.handleBlur(event, "username"),
                              onFocus: () =>
                                this.setState({
                                  usernameErr: false,
                                  usernameHelperText: "",
                                  checkUserName: false,
                                  userNamePoup: true,
                                }),
                              onBlur: () => {
                                this.setState({
                                  userNamePoup: false,
                                });
                              },
                              endAdornment:
                                checkUserName !== true ? (
                                  <Icon>person</Icon>
                                ) : usernameErr ||
                                  userCheckLetter === false ||
                                  userMinCharacter === false ||
                                  userMaxCharacter === false ? (
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
                                    />
                                  </InputAdornment>
                                ),
                              autoComplete: "none",
                            }}
                            onChange={(event) => {
                              event.target.value.length <= 33 &&
                                this.setState({
                                  username1: event.target.value,
                                });
                            }}
                            value={
                              this.state.username1 ? this.state.username1 : ""
                            }
                          />
                        </FormControl>

                        {this.state.userNamePoup === true ? (
                          <div className="ps-popover-inner">
                            <MDBPopoverBody>
                              <MDBPopoverHeader>
                                User name must have:
                              </MDBPopoverHeader>
                              <React.Fragment>
                                {userCheckLetter === true ||
                                userCheckUpperCase === true ? (
                                  <Typography style={{ color: "#2E7D32" }}>
                                    <i class="far fa-check-circle"></i>Must be
                                    between letters from a to z
                                  </Typography>
                                ) : userCheckLetter === false ||
                                  userCheckUpperCase === false ? (
                                  <Typography color="error">
                                    <i className="far fa-check-circle"></i>
                                    Must be between letters from a to z
                                  </Typography>
                                ) : userCheckLetter === null ||
                                  userCheckUpperCase === null ? (
                                  <Typography color="black">
                                    <i className="far fa-check-circle"></i>
                                    Must be between letters from a to z
                                  </Typography>
                                ) : (
                                  <Typography color="black">
                                    <i className="far fa-check-circle"></i>
                                    Must be between letters from a to z
                                  </Typography>
                                )}

                                {userCheckNumber === true ? (
                                  <Typography style={{ color: "#2E7D32" }}>
                                    <i class="far fa-check-circle"></i>Can
                                    contain any numbers from 0 through 9
                                  </Typography>
                                ) : (
                                  <Typography color="black">
                                    <i class="far fa-check-circle"></i>Can
                                    contain any numbers from 0 through 9
                                  </Typography>
                                )}

                                {userCheckSpecialCharacter === true ? (
                                  <Typography style={{ color: "#2E7D32" }}>
                                    <i class="far fa-check-circle"></i>Can
                                    contain special characters : @ . - _
                                  </Typography>
                                ) : userCheckSpecialCharacter === false ? (
                                  <Typography color="black">
                                    <i class="far fa-check-circle"></i>Can
                                    contain special characters : @ . - _
                                  </Typography>
                                ) : specialcharacter === true ? (
                                  <Typography color="error">
                                    <i class="far fa-check-circle"></i>Can
                                    contain special characters : @ . - _
                                  </Typography>
                                ) : (
                                  <Typography style={{ color: "#dab813" }}>
                                    <i class="far fa-check-circle"></i>Can
                                    contain special characters : @ . - _
                                  </Typography>
                                )}

                                {userMinCharacter === true &&
                                userMaxCharacter === true ? (
                                  <Typography style={{ color: "#2E7D32" }}>
                                    <i class="far fa-check-circle"></i>Must be
                                    between 8 to 32 characters long
                                  </Typography>
                                ) : userMinCharacter === false &&
                                  userMaxCharacter === false ? (
                                  <Typography color="error">
                                    <i class="far fa-check-circle"></i>Must be
                                    between 8 to 32 characters long
                                  </Typography>
                                ) : userMinCharacter === null &&
                                  userMaxCharacter === null ? (
                                  <Typography color="black">
                                    <i class="far fa-check-circle"></i>Must be
                                    between 8 to 32 characters long
                                  </Typography>
                                ) : (
                                  <Typography color="black">
                                    <i class="far fa-check-circle"></i>Must be
                                    between 8 to 32 characters long
                                  </Typography>
                                )}
                              </React.Fragment>
                            </MDBPopoverBody>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      {/* </MDBPopover> */}
                      <div className="pop-wrap">
                        <GridContainer>
                          <GridItem xs={12} sm={6} md={6} className="pln">
                            <MDBContainer>
                              {/* <MDBPopover
                                className="ps-popover-outer"
                                placement="bottom"
                                popover
                                id="popper1"
                              > */}

                              <FormControl fullWidth className="pass-input">
                                <TextField
                                  label="Password"
                                  id="password"
                                  type="password"
                                  error={this.state.passwordErr}
                                  value={this.state.password}
                                  formControlProps={{ fullWidth: true }}
                                  aria-describedby="simple-popover"
                                  helperText={this.state.passwordHelperText}
                                  inputProps={{
                                    onChange: (event) =>
                                      this.handleBlur(event, "password"),
                                    onBlur: (event) =>
                                      this.handleBlur(event, "password"),

                                    onFocus: () =>
                                      this.setState({
                                        passwordErr: false,
                                        passwordHelperText: "",
                                        checkPassword: true,
                                        passwordPoup: true,
                                      }),

                                    onBlur: () => {
                                      this.setState({
                                        passwordPoup: false,
                                      });
                                    },
                                    autoComplete: "new-password",
                                  }}
                                />
                              </FormControl>

                              {/* </MDBPopover> */}
                            </MDBContainer>
                          </GridItem>
                          <GridItem xs={12} sm={6} md={6} className="prn">
                            <CustomInput
                              labelText="Confirm Password"
                              error={this.state.confirmpasswordErr}
                              helperText={this.state.confirmpasswordHelperText}
                              formControlProps={{ fullWidth: true }}
                              inputProps={{
                                onBlur: (event) =>
                                  this.handleBlur(event, "confirmpassword"),
                                onFocus: () =>
                                  this.setState({
                                    confirmpasswordErr: false,
                                    confirmpasswordHelperText: "",
                                    checkConfirmPassword: false,
                                  }),
                                endAdornment:
                                  checkConfirmPassword !== true ? (
                                    <Icon>lock_outline</Icon>
                                  ) : confirmpasswordErr ? (
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
                                      />
                                    </InputAdornment>
                                  ),
                                autoComplete: "new-password",
                                type: "password",
                              }}
                            />
                          </GridItem>
                        </GridContainer>
                        {this.state.passwordPoup === true ? (
                          <div className="ps-popover-inner">
                            <MDBPopoverBody>
                              <MDBPopoverHeader>
                                Your password must have:
                              </MDBPopoverHeader>
                              <React.Fragment>
                                {checkUpperCase ? (
                                  <Typography style={{ color: "#2E7D32" }}>
                                    <i class="far fa-check-circle"></i>One
                                    uppercase letter
                                  </Typography>
                                ) : (
                                  <Typography color="error">
                                    <i className="far fa-check-circle"></i>
                                    One uppercase letter
                                  </Typography>
                                )}
                                {checkLowerCase ? (
                                  <Typography style={{ color: "#2E7D32" }}>
                                    <i class="far fa-check-circle"></i>One
                                    lowercase letter
                                  </Typography>
                                ) : (
                                  <Typography color="error">
                                    <i class="far fa-check-circle"></i>One
                                    lowercase letter
                                  </Typography>
                                )}
                                {checkSpecialCharacter ? (
                                  <Typography style={{ color: "#2E7D32" }}>
                                    <i class="far fa-check-circle"></i>One
                                    special character
                                  </Typography>
                                ) : (
                                  <Typography color="error">
                                    <i class="far fa-check-circle"></i>One
                                    special character
                                  </Typography>
                                )}
                                {checkNumber ? (
                                  <Typography style={{ color: "#2E7D32" }}>
                                    <i class="far fa-check-circle"></i>One
                                    number
                                  </Typography>
                                ) : (
                                  <Typography color="error">
                                    <i class="far fa-check-circle"></i>One
                                    number
                                  </Typography>
                                )}
                                {checkLetter ? (
                                  <Typography style={{ color: "#2E7D32" }}>
                                    <i class="far fa-check-circle"></i>
                                    Minimum 8 characters
                                  </Typography>
                                ) : (
                                  <Typography color="error">
                                    <i class="far fa-check-circle"></i>
                                    Minimum 8 characters
                                  </Typography>
                                )}
                              </React.Fragment>
                            </MDBPopoverBody>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>

                      <CustomInput
                        labelText="Contact Number"
                        id="contactnumber"
                        error={this.state.mobileErr}
                        helperText={this.state.mobileHelperText}
                        formControlProps={{ fullWidth: true }}
                        inputProps={{
                          onFocus: () =>
                            this.setState({
                              mobileErr: false,
                              mobileHelperText: "",
                              checkMobile: false,
                            }),
                          onBlur: (event) => this.handleBlur(event, "mobile"),
                          endAdornment:
                            checkMobile !== true ? (
                              <Icon>phone</Icon>
                            ) : mobileErr ? (
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
                          autoComplete: "none",
                        }}
                      />

                      <CustomInput
                        labelText="Email Address *"
                        error={this.state.emailErr}
                        formControlProps={{ fullWidth: true }}
                        helperText={this.state.emailHelperText}
                        inputProps={{
                          onBlur: (event) => this.handleBlur(event, "email"),
                          onFocus: () =>
                            this.setState({
                              emailErr: false,
                              emailHelperText: "",
                              checkEmail: false,
                            }),
                          endAdornment:
                            this.state.checkEmail !== true ? (
                              <Icon>email</Icon>
                            ) : emailErr ? (
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
                          type: "email",
                        }}
                      />

                      <div className="align-center">
                        <Button
                          className="signup-btn"
                          onClick={(event) => this.signUP(event)}
                        >
                          Signup
                        </Button>
                        <ListItemText className="loginpage-link-outer">
                          {" "}
                          Back to
                          <NavLink
                            className="registerpage-login-link"
                            to={"/auth/loginpage"}
                          >
                            Login
                          </NavLink>
                        </ListItemText>
                      </div>
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
export default RegisterPage;
