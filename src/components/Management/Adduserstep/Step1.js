/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import api from '../../../utils/apiClient';
import cogoToast from 'cogo-toast';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import { green } from "@material-ui/core/colors";
import { red } from "@material-ui/core/colors";
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';

const useStyles = makeStyles(styles);

const classes = () => {
  return useStyles();
};

class Step1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID   : this.props.match.params.id,
      fullName :"",
      userName :"",
      Email    :"",
      Password :"",
      Mobile   :"",
      
      fullnameErr: false,
      usernameErr: false,
      emailErr: false,
      passwordErr: false,
      mobileErr: false,
      
     
      fullnameHelperText: "",
      usernameHelperText: "",
      emailHelperText: "",
      passwordHelperText: "",
      mobileHelperText: "",
      mobileLength:"",
      
      
      open: false,
  
      checkFullname: false,
      checkUserName: false,
      checkEmail:false,
      checkPassword:false,
      checkMobile:false,
      checkLetter:false,
      checkUpperCase:false,
      checkLowerCase:false,
      checkNumber:false,
      checkSpecialCharacter:false
    };
    
  }

  handleChange = (event, type) => {

    if (type === "fullname") {
      let val = event.target.value;
      this.setState({checkFullname: true});
        if (val === "" || val === null) {
            this.setState({fullName:val , fullnameErr: true,fullnameHelperText: "Please enter Full Name" });
        } else if (val.trim() !== val) {
            this.setState({fullName:val , fullnameErr: true, fullnameHelperText: "Please enter valid Full Name"}); 
        } else { 
            this.setState({ fullName:val , fullnameErr: false, fullnameHelperText: "" });
        }
    } 
    else if (type === "username") {
        this.setState({ checkUserName: true });
        let usernameVal = event.target.value;
         if (usernameVal === "" || usernameVal === null) {
             this.setState({userName:usernameVal ,usernameErr: true,open: true,usernameHelperText: "Please enter User Name"});
         } else if (usernameVal.trim() !== usernameVal) {
            this.setState({userName:usernameVal ,usernameErr: true,open: true,usernameHelperText: "Please enter valid User Name"});
         }else {
            this.setState({userName:usernameVal ,usernameErr: false,open: false,usernameHelperText: ""});
         }
    }
    else if(type==="email"){
        this.setState({ checkEmail: true });
        let emailVal = event.target.value;
        let regExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9-]+\.[A-Z]{2,6}$/ig;
         if (emailVal === "" || emailVal === null) {
           this.setState({Email:emailVal, emailErr: true,open: true,emailHelperText: "Please enter Email"});
          }else if (emailVal.trim() !== emailVal || !emailVal.match(regExp)) {
            this.setState({Email:emailVal, emailErr: true,open: true,emailHelperText: "Please enter valid Email"});
          }else {
            this.setState({Email:emailVal, emailErr: false,open: false,emailHelperText: ""});
          }
    }
    else if(type==="mobile"){
        this.setState({ checkMobile: true });
        let mobileVal = event.target.value;
        let mobileLen=event.target.value.length;
        let regExp =/^[0-9]{10,15}$/;
        this.setState({mobileLength : mobileLen});
        
         if (mobileVal === "" || mobileVal === null) {
             this.setState({Mobile:mobileVal , mobileErr: true,open: true,mobileHelperText: "Please enter Mobile Number"});
          }else if (mobileVal.trim() !== mobileVal || !mobileVal.match(regExp)) {
             this.setState({Mobile:mobileVal , mobileErr: true,open: true,mobileHelperText: "Please enter valid Mobile Number"});
          }else {
            this.setState({Mobile:mobileVal ,mobileErr: false,open: false,mobileHelperText: ""});
          }
    }
    else if(type==="password"){
          this.setState({ checkPassword: true });
          let passwordVal = event.target.value;
          let passwordLen=event.target.value.length;
    
          let regExpNumber=/[0-9]/g;
          let regExpUpperCase=/[A-Z]/g;
          let regExpLowerCase=/[a-z]/g;
          let regExpSpecialCharacter=/[!@#$%^&*(),.?":{}|<>]/g;
          let regExp = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/;
          this.setState({passwordLength : passwordLen});
  
          if (passwordVal === "" || passwordVal === null || passwordVal === undefined){
                  this.setState({passwordErr: true,open: true,passwordHelperText: "Please enter password"});
           }else if(passwordVal) {
                if(passwordVal.match(regExpNumber)){
                    this.setState({checkNumber:true});
                }else{
                    this.setState({checkNumber:false});
                }if(passwordVal.match(regExpUpperCase)){
                    this.setState({checkUpperCase:true});
                }else{
                  this.setState({checkUpperCase:false});
                }if(passwordVal.match(regExpLowerCase))
                {
                  this.setState({checkLowerCase:true});
                }else{
                    this.setState({checkLowerCase:false});
                }if(passwordVal.match(regExpSpecialCharacter)){
                    this.setState({checkSpecialCharacter:true});
                }else{
                    this.setState({checkSpecialCharacter:false});}
                }
          else {
              this.setState({passwordErr: false,passwordHelperText: ""});
              }
    }  
  };

  componentDidMount(){

    this.getUserDetailById();
  }

  getUserDetailById(){
    try{
      let data = {
        userId : this.state.userID
      }
      api.post('userManagement/getUserDataByID',data).then(res => {
        if (res.success) {
          let userData = res.data[0];
          this.setState({
             fullName: userData.Name,
             Email : userData.Email ,
             userName : userData.LoginID,
             Mobile : userData.PhoneNum
          });
        }    
      }).catch(err => {
         cogoToast.error("Something Went Wrong");
      });
    }catch(error){

    }
  }

  render() {

    const { usernameErr , emailErr , mobileErr , passwordErr ,checkPassword ,  checkNumber ,
            checkUpperCase , checkLowerCase , checkSpecialCharacter , fullName , userName , Email , Mobile} = this.state;

    return (
      <div>
        <GridContainer className="MuiGrid-justify-xs-center">
          <GridItem xs={12} sm={12} md={6}>
            
                <form>
                    <CustomInput labelText={<span>Full Name</span>} id="fullname" name="fullname" variant="outlined"
                    error={this.state.fullnameErr} helperText={this.state.fullnameHelperText}
                    formControlProps={{ fullWidth: true}}
                    inputProps={{
                      onFocus: () => this.setState({checkFullname: false, fullnameErr: false, fullnameHelperText: ""}),
                      onBlur: event => this.handleChange(event, "fullname"),
                      onChange: event => this.handleChange(event, "fullname"),
                      value:fullName,
                      endAdornment: (this.state.checkFullname !== true ? (<Icon>person</Icon>) :
                      this.state.fullnameErr ? (<InputAdornment position="end"> 
                      <CloseIcon style={{ color: red[500] }}className={useStyles.danger}/></InputAdornment>) :
                      ( <InputAdornment position="end"> <DoneIcon style={{ color: green[500] }} className={useStyles.success} /></InputAdornment>) )
                      }}/>

                    <CustomInput labelText={<span>User Name</span>} id="username"
                    error={usernameErr} 
                    formControlProps={{ fullWidth: true }}
                    inputProps={{
                      onFocus: () => this.setState({checkUserName: false, usernameErr: false, usernameHelperText: ""}),
                      onBlur: event => this.handleChange(event, "username"),
                      onChange: event => this.handleChange(event, "username"),
                      value : userName,
                      endAdornment: (this.state.checkUserName !== true ? ( <Icon>account_circle</Icon>) : 
                      this.state.usernameErr ? (<InputAdornment position="end"> 
                      <CloseIcon style={{ color: red[500] }}className={useStyles.danger}/></InputAdornment>) :
                      ( <InputAdornment position="end"> <DoneIcon style={{ color: green[500] }} className={useStyles.success} /></InputAdornment>) )
                      }}/>
                  
                    <CustomInput labelText="Email" id="Email"
                      error={emailErr}
                      formControlProps={{ fullWidth: true }}
                      helperText={this.state.emailHelperText}
                      inputProps={{
                          onBlur: event => this.handleChange(event, "email"),
                          onChange: event => this.handleChange(event, "email"),
                          value : Email,
                          onFocus: () => this.setState({ emailErr: false, emailHelperText: "",checkEmail:false }),
                        endAdornment:( this.state.checkEmail !== true ? ( <Icon >email</Icon>) : 
                        this.state.emailErr ? (<InputAdornment position="end"> 
                      <CloseIcon style={{ color: red[500] }}className={useStyles.danger}/></InputAdornment>) :
                      ( <InputAdornment position="end"> <DoneIcon style={{ color: green[500] }} className={useStyles.success} /></InputAdornment>) )
                      }}/>
                    
                    {this.state.userID ? (null):(
                    <CustomInput labelText={<span> Password <small>(required)</small> </span> } id="password"
                     error={passwordErr}
                     formControlProps={{  fullWidth: true }}
                     aria-describedby="simple-popover"
                     helperText={this.state.passwordHelperText}
                     inputProps={{
                     onBlur: event => this.handleChange(event, "password"),
                     onFocus: () => this.setState({checkPassword: false, passwordErr: false, passwordHelperText: ""}),
                     endAdornment:checkPassword ? (<InputAdornment position="end" className={classes.inputAdornment}> <Popover
                     id="password"
                     open={checkPassword}
                     onClose={()=> this.setState({checkPassword:false})}
                     anchorOrigin={{
                         vertical: 'center',
                         horizontal: 'right',
                       }}
                       transformOrigin={{
                         vertical: 'top',
                         horizontal: 'left',
                       }}
                   >

                        <React.Fragment>
                            <Typography color="inherit">Minimun 6-8 characters</Typography>
                            {!checkUpperCase ?
                            (<CloseIcon fontSize="small"  style={{ color: red[500] }}className={classes.danger}/>)
                            :(<DoneIcon style={{ color: green[500] }} className={classes.success} />) }{"One upper case"}.<br/> 
                            {!checkLowerCase ?
                            (<CloseIcon fontSize="small"  style={{ color: red[500] }}className={classes.danger}/>)
                            :(<DoneIcon style={{ color: green[500] }} className={classes.success} />) } {"One lower case"}.<br/>
                            {!checkSpecialCharacter ?
                              (<CloseIcon fontSize="small"  style={{ color: red[500] }}className={classes.danger}/>)
                              :(<DoneIcon style={{ color: green[500] }} className={classes.success} />) }{"One special character (@,#,$)"}.<br/>
                            {!checkNumber ?
                              (<CloseIcon fontSize="small"  style={{ color: red[500] }}className={classes.danger}/>)
                            :(<DoneIcon style={{ color: green[500] }} className={classes.success} />) } {"At least one number"}.
                      </React.Fragment>
                      
                     </Popover> <Icon>lock</Icon> </InputAdornment>):(undefined)}}      
                    />)}

                    <CustomInput labelText={<span>Mobile</span>} id="mobile" 
                      error={mobileErr}
                      helperText={this.state.mobileHelperText}
                      formControlProps={{fullWidth: true}}
                      inputProps={{ 
                        onBlur: event => this.handleChange(event, "mobile"),
                        onChange: event => this.handleChange(event, "mobile"),
                        onFocus: () => this.setState({checkMobile: false, mobileErr: false, mobileHelperText: ""}),
                        value : Mobile,
                        endAdornment:(this.state.checkMobile !== true ? (<Icon>phone</Icon>) : 
                        mobileErr ? (<InputAdornment position="end"> 
                      <CloseIcon style={{ color: red[500] }}className={useStyles.danger}/></InputAdornment>) :
                      ( <InputAdornment position="end"> <DoneIcon style={{ color: green[500] }} className={useStyles.success} /></InputAdornment>) )
                      }}
                    />
                </form>
             
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Step1.propTypes = {
  classes: PropTypes.object
};

export default withStyles()(Step1);
