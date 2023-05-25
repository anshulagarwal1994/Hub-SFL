import React, { Component } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import cogoToast from 'cogo-toast';
import { NavLink } from "react-router-dom";
import ListItemText from "@material-ui/core/ListItemText";
import SimpleBackdrop from '../../utils/general';

// import LockOutline from "@material-ui/icons/LockOutline";
// @material-ui/core components

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import api from '../../utils/apiClient';
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";

import image from "assets/img/left-SIGNUP-image.png";

const useStyles = makeStyles(styles);

class ForgotpasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailErr: false,
      checkEmail:false,
      emailHelperText: "",
      email : "",
      selectedEmailMy : "",
      Loading  : false
    };
    
  }

    changeForgotPassWord = (event) => {
      this.setState({selectedEmailMy : event.target.value});
    }

    handleChange = (event,type) => {

      if(type === "email")
      {
        this.setState({email : event.target.value});
      }

    }

    Submit = (event) => {
      this.showLoader();
        try{

            let data = {
              email : this.state.email , 
              selectedEmailMy : this.state.selectedEmailMy
            }

              api.post('authentication/forgotPassword', data).then(res => {
                if (res.success) {
                  this.hideLoader();
                  if(res.Data.success){
                    cogoToast.success(res.Data.message);
                  }
                  else{
                    cogoToast.error(res.Data.message);
                  }
                } else {
                  cogoToast.error("Something Went Wrong");
                  this.hideLoader();
                }
              }).catch(err => {
                cogoToast.error("Something Went Wrong");
                this.hideLoader();
              });

        }catch(error){
          cogoToast.error("Something Went Wrong");
          this.hideLoader();
        }

    }

    showLoader = () => {
      this.setState({ Loading: true });
    }
  
    hideLoader = () => {
          this.setState({ Loading: false });
    }

    render()
    {
      
        return (
          <div className="signup-page-outer">
            {this.state.Loading === true ?
                <div className="loading">
                  <SimpleBackdrop/>
                </div>
            : null}
            <GridContainer justify="center">
                <GridItem className="signup-page-outer2">
                  <Card className="Signup-main-outer">
                    <CardBody className="Signup-main-inner">
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={6} className="signup-left-section">
                          <div className="signup-left-outer">
                            <div className="signup-left-inner">
                              <div className="signup-left-text">
                                <h2>Introducing Ship Smart with SFL Worldwide</h2>
                                <p>One Stop Hub for all Domestic & International Shipping and Moving Services</p>
                                <img src={image} alt="SFL Worldwide" />
                              </div>
                            </div>
                          </div>
                        </GridItem>
                        <GridItem xs={12} sm={8} md={6}>
                          <div className="login-logo"></div>
                          <form className="signup-form-outer signin-form-outer">
                            <CustomInput
                              labelText="Email *"
                              id="email"
                              formControlProps={{ fullWidth: true}}
                              inputProps={{
                                          value:this.state.email,
                                          onChange: event => this.handleChange(event, "email"),
                                          endAdornment: <Icon >email</Icon>
                                          }}
                            />
                            <div className="select-spl">
                                <FormControl fullWidth className={useStyles.selectFormControl}>
                                  <InputLabel htmlFor="simple-select" className={useStyles.selectLabel}>
                                    Please Email My
                                  </InputLabel>
                                  
                                    <Select 
                                      value = {this.state.selectedEmailMy}
                                      onChange={(event) => this.changeForgotPassWord(event)}
                                    >
                                        <MenuItem useStyles={{ root: useStyles.selectMenuItem}} value="Password"> Password </MenuItem>
                                        <MenuItem useStyles={{ root: useStyles.selectMenuItem}} value="UserName"> Username </MenuItem>                      
                                    </Select>
                                </FormControl>
                              </div>

                            <CardFooter className="loginpage-footer">
                              <Button className="signup-btn" onClick={(event) => this.Submit(event)} > Submit </Button>
                              <ListItemText className="loginpage-link-outer">Back to
                                <NavLink className="registerpage-login-link" to={"/auth/loginpage"}>Login</NavLink>
                              </ListItemText>
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
export default ForgotpasswordPage;