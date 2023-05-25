import React, { Component } from "react";
import cogoToast from 'cogo-toast';
import api from '../../utils/apiClient';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import CardFooter from "components/Card/CardFooter.js";
import Button from "components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";
import SimpleBackdrop from '../../utils/general';
import { CommonConfig } from '../../utils/constant';
import image from "assets/img/left-SIGNUP-image.png";
import FormControl from "@material-ui/core/FormControl";
import { TextField } from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import { MDBPopover, MDBPopoverBody, MDBPopoverHeader, MDBContainer } from "mdbreact";

const passwordText=`One capital (upperCaseLetters) required <br />
                    One small (lowerCaseLetters) required<br /> 
                    One special character required<br />
                    One number required<br />
                    Minimum 8 characters required`

class ResetPassword extends Component{
    constructor(props) {
        super(props);
        this.state = {
          password : "",
          confirmPassword : "",
          CurrentPassword : "",
          passwordErr : false,
          confirmPasswordErr : false,
          currentPasswordErr : false,
          passwordHelperText : "",
          confirmPasswordHelperText: "",
          currentPasswordHelperText : "",
          Loading : false,
          PersonID : '',
          IsLinkExpired : true,
          checkLetter: false,
          checkUpperCase: false,
          checkLowerCase: false,
          checkNumber: false,
          checkSpecialCharacter: false,
          checkPassword: false,
        };
        
    }

    componentDidMount(){   
      this.showLoader();
      this.validateLink();
    }

    validateLink = () => {
        let data = {
            UUID : this.props.match.params.id
        }
        try{
            api.post("authentication/verifyLink",data).then(res => {
                this.hideLoader();
                if(res.success && res.Data && res.Data[0]){
                    this.setState({
                      PersonID : res.Data[0].PersonID,
                      IsLinkExpired : false
                    })
                }
                else{
                    
                    const options = {
                        hideAfter: 5
                    };
                    cogoToast.error("Forgot Password Link Expired",options);
                }
            }).catch(err => {
                cogoToast.error("Something went wrong");
                console.log("error....",err);
            })
        }
        catch(err){
            console.log("err.....",err);
        }
    }

    validate = (event) => {
        let IsFormValid = true;
        if(CommonConfig.isEmpty(this.state.password)){
          IsFormValid = false;
          this.setState({passwordErr:true,passwordHelperText:"Please enter password"});
        }
        if(CommonConfig.isEmpty(this.state.confirmPassword)){
          IsFormValid = false;
          this.setState({confirmPasswordErr:true,confirmPasswordHelperText:"Please enter confirm password"});
        }
        if(this.state.confirmPasswordErr){
          IsFormValid = false;
          this.setState({confirmPasswordErr:true,confirmPasswordHelperText:"Please enter valid confirm password"});
        }
        if(this.state.passwordErr){
            IsFormValid = false;
            this.setState({passwordErr:true,passwordHelperText:"Please enter valid password"});
        }
        if(this.state.password !==  this.state.confirmPassword){
            IsFormValid = false;
            this.setState({confirmPasswordErr:true,confirmPasswordHelperText:"Password and Confirm Password does not match"});
        }
      return IsFormValid
    }

    handleChange = (event,type) => {
        if(type === "password"){
            this.setState({password : event.target.value })
        }
        else if(type === "confirmpassword"){
            this.setState({confirmPassword : event.target.value })
        }
    }

    showLoader = () => {
        this.setState({ Loading: true });
    }
    
    hideLoader = () => {
       this.setState({ Loading: false });
    }

    reset = (event) => {
        if(this.validate(event)){
            let isMatch = this.state.password.localeCompare(this.state.confirmPassword);
            
            if(isMatch === 0){
                this.showLoader();

                try{
                    let data = {
                        userID : this.state.PersonID,
                        Password : this.state.password,
                        // CurrentPassword : this.state.CurrentPassword
                    }
                    api.post('authentication/resetPassword', data).then(res => {
                        if (res.success) {
                            this.hideLoader();
                            cogoToast.success("Password updated successfully");
                            this.props.history.push("/auth/login-page");
                        } 
                        else {
                            cogoToast.error("Something went wrong");
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
            else{
                cogoToast.error("Password Not Match");
            }
        }

    }

    handleBlur = (event, type) => {
      
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
                passwordHelperText: "Please enter Password"
              });
            } else if (passwordVal) {
                let isError = false;
              if (passwordVal.match(CommonConfig.RegExp.regExpNumber)) {
                this.setState({ password: passwordVal, checkNumber: true, passwordErr: false, passwordHelperText: "" });
              }
              else {
                isError = true;
                this.setState({ password: passwordVal, checkNumber: false, passwordErr: true, passwordHelperText: "" });
              }
              if (passwordVal.match(CommonConfig.RegExp.regExpUpperCase)) {
                this.setState({ password: passwordVal, checkUpperCase: true, passwordErr: false, passwordHelperText: "" });
              }
              else {
                isError = true;
                this.setState({ password: passwordVal, checkUpperCase: false, passwordErr: true, passwordHelperText: "" });
              }
              if (passwordVal.match(CommonConfig.RegExp.regExpLowerCase)) {
                this.setState({ password: passwordVal, checkLowerCase: true, passwordErr: false, passwordHelperText: "" });
              }
              else {
                isError = true;
                this.setState({ password: passwordVal, checkLowerCase: false, passwordErr: true, passwordHelperText: "" });
              }
              if (passwordVal.length >= 8) {
                this.setState({ password: passwordVal, checkLetter: true, passwordErr: false, passwordHelperText: "" });
              }
              else {
                isError = true;
                this.setState({ password: passwordVal, checkLetter: false, passwordErr: true, passwordHelperText: "" });
              }
              if (passwordVal.match(CommonConfig.RegExp.regExpSpecialCharacter)) {
                this.setState({ password: passwordVal, checkSpecialCharacter: true, passwordErr: false, passwordHelperText: "" });
              }
              else {
                isError = true;
                this.setState({ password: passwordVal, checkSpecialCharacter: false, passwordErr: true, passwordHelperText: "" });
              }
              if(isError){
                this.setState({passwordErr : true});
              }
            }
            else {
              this.setState({ passwordErr: false, passwordHelperText: "", password: passwordVal });
            }
        }
      
        else if(type === "confirmpassword"){ 
            let confirmPasswordVal = event.target.value;
            if (confirmPasswordVal === "" || confirmPasswordVal === null) {
              this.setState({confirmPasswordErr: true,open: true,confirmPasswordHelperText: "Please enter Confirm Password"});
            }
            else if(confirmPasswordVal!==this.state.password){
                cogoToast.error("Password Not Match");
            }
            else {
              this.setState({confirmPassword:confirmPasswordVal,confirmPasswordErr: false,confirmPasswordHelperText: ""});
            }
        }
                      
    };


    render(){
    const { checkNumber, checkUpperCase, checkLowerCase, checkSpecialCharacter, checkLetter } = this.state;
        return(
            <div className="signup-page-outer">
            {this.state.Loading === true ?
                <div className="loading">
                    <SimpleBackdrop/>
                </div>
            : null
            }
            <GridContainer justify="center">
                <GridItem className="signup-page-outer2">
                  <Card className="Signup-main-outer">  
                    
                    {this.state.IsLinkExpired ? 
                        null
                        :
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
                        <GridItem xs={12} sm={12} md={6}>
                            <div className="login-logo"></div>
                            <form className="signin-form-outer">
                                <MDBContainer>
                                    <MDBPopover className="ps-popover-outer" placement="bottom" popover id="popper1">
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
                                                onChange: (event) => this.handleBlur(event, "password"),
                                                onBlur: (event) => this.handleBlur(event, "password"),
                                                onFocus: () => this.setState({ passwordErr: false, passwordHelperText: "", checkPassword: true })
                                            }} 
                                        />
                                        </FormControl>
                                        <div className="ps-popover-inner">
                                            <MDBPopoverHeader>Your password must have:</MDBPopoverHeader>
                                            <MDBPopoverBody>
                                            <React.Fragment>
                                                {checkUpperCase ? <Typography style={{ color: "#2E7D32" }}><i class="far fa-check-circle"></i>One uppercase letter</Typography> :
                                                <Typography color="error"><i class="far fa-check-circle"></i>One uppercase letter</Typography>}
                                                {checkLowerCase ? <Typography style={{ color: "#2E7D32" }}><i class="far fa-check-circle"></i>One lowercase letter</Typography> :
                                                <Typography color="error"><i class="far fa-check-circle"></i>One lowercase letter</Typography>}
                                                {checkSpecialCharacter ? <Typography style={{ color: "#2E7D32" }}><i class="far fa-check-circle"></i>One special character</Typography> :
                                                <Typography color="error"><i class="far fa-check-circle"></i>One special character</Typography>}
                                                {checkNumber ? <Typography style={{ color: "#2E7D32" }}><i class="far fa-check-circle"></i>One number</Typography> :
                                                <Typography color="error"><i class="far fa-check-circle"></i>One number</Typography>}
                                                {checkLetter ? <Typography style={{ color: "#2E7D32" }}><i class="far fa-check-circle"></i>Minimum 8 characters</Typography> :
                                                <Typography color="error"><i class="far fa-check-circle"></i>Minimum 8 characters</Typography>}
                                            </React.Fragment>
                                            </MDBPopoverBody>
                                        </div>
                                    </MDBPopover>
                                </MDBContainer>
                                
                                <CustomInput
                                    labelText="Confirm Password *"
                                    id="confirm password"
                                    error = {this.state.confirmPasswordErr}
                                    helperText = {this.state.confirmPasswordHelperText}
                                    formControlProps={{ fullWidth: true}}
                                    inputProps={{
                                                value:this.state.confirmPassword,
                                                onChange: event => this.handleChange(event, "confirmpassword"),
                                                onBlur : (event) => this.handleBlur(event , "confirmpassword"),
                                                endAdornment: <Icon >lock_outline</Icon>,
                                                type: "password",
                                                }}
                                />

                            <CardFooter className="loginpage-footer">
                                <Button className="signup-btn" onClick={(event) => this.reset(event)} > Reset Password </Button>
                            </CardFooter>  
                          </form>
                        </GridItem>
                      </GridContainer>
                    </CardBody>
                    }
                  </Card>
                </GridItem>
              </GridContainer>
            
            </div>
        )
    }
}

export default ResetPassword;