import React,{Component} from "react";
import cogoToast from 'cogo-toast';
import SimpleBackdrop from '../../utils/general';
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import { NavLink } from "react-router-dom";
import ListItemText from "@material-ui/core/ListItemText";
import api from '../../utils/apiClient';
import {apiBase} from '../../utils/config';
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
import Cookies from 'universal-cookie';

const useStyles = makeStyles(styles);
const cookies = new Cookies();
class RedirectToMyShipment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Loading:true,
    };
    
  }

    componentDidMount = () => {
        var Reqid = this.props.match.params?this.props.match.params.id:'';
        var data = window.atob(Reqid);
        var insertdata=data.split("/");
        localStorage.setItem('ShippingID',insertdata[0]);
        localStorage.setItem('Page','MyShipmentNew');
        localStorage.setItem('tab',insertdata[1]);
        if(localStorage.getItem('loggedInUserData')){
            var record ={
                pathname:'MyShipmentNew',
                ShippingID:insertdata[0],
                tab:insertdata[1]
            };
          this.editShipment(record); 
        }
        else{
          this.loginRedirect(); 
        }
    }

    editShipment = (record) => {
        const { history } = this.props;
          history.push({
            pathname:'MyShipmentNew',
            state:{
              ShipppingID : record.ShippingID,
              filterlist:'',
              sortlist:'',
              tab:record.tab
            }
          })
      }

    loginRedirect = () => {
      this.setState({Loading:false});
      this.props.history.push("/auth/login-page");
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
            </div>
        );
    }
}
export default RedirectToMyShipment;
