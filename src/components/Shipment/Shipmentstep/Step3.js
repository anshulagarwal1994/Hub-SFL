/*eslint-disable*/
import React , {Component} from 'react';
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import Button from "components/CustomButtons/Button.js";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import api from '../../../utils/apiClient';

// material ui icons


class Step3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commercialList:[],
      
    };
    
  }
  async componentDidMount(){
    await this.getCommercialInvoiceDetail();
  }

  getCommercialInvoiceDetail(){
    try{
      let data = {
        ShippingID : this.props.history.location.state.ShipppingID
      }
      api.post("scheduleshipment/getShipmentCommercialInvoiceByID",data).then(res => {
        if(res.success){
          this.setState({commercialList : res.data});
        }
      }).catch(err => {
        console.log("error..",err);
      })
    }
    catch(err){
      console.log(err);
    }
  }

  removeInvoice = (index) => {
    var commercialList = this.state.commercialList;
    commercialList.splice(index ,1);
    this.setState({commercialList: commercialList});
  }

  addnewRowInvoice = () => {
    const row = { 
      PackageNumber : 0,
      ContentDescription : "",
      Quantity:0,
      ValuePerQuantity:0,
      TotalValue:0,
    }
    this.setState({commercialList: [...this.state.commercialList,row]});
  }

  viewCommercialInvoice = () => {
    return this.state.commercialList.map((commercial,idx) => {
      return (
        
        <tr>
        <td className="text-align-right">
          <CustomInput
              id="proposaltype"
              inputProps={{
                onChange : (event) => this.handleCommercialInvoiceChange(event , "PackageNumber",idx),
                value: commercial.PackageNumber
            }}
            />
        </td>
        <td>
          <div className="width-md">
            <CustomInput
              id="proposaltype"
              inputProps={{
                onChange : (event) => this.handleCommercialInvoiceChange(event , "ContentDescription",idx),
                value: commercial.ContentDescription
              }}
            />
          </div>
        </td>
        <td>
          <CustomInput
              id="proposaltype"
                type="number"
              inputProps={{
                onChange : (event) => this.handleCommercialInvoiceChange(event , "Quantity",idx),
                value: commercial.Quantity
            }}
            />
        </td>
        <td>
            <CustomInput
                id="proposaltype"
                  type="number"
                inputProps={{
                  onChange : (event) => this.handleCommercialInvoiceChange(event , "ValuePerQuantity",idx),
                  value: commercial.ValuePerQuantity
              }}
            />
        </td>
        <td> 
            <CustomInput
                id="proposaltype"
                  type="number"
                inputProps={{
                  onChange : (event) => this.handleCommercialInvoiceChange(event , "TotalValue",idx),
                  value: commercial.TotalValue
              }}
              />
        </td>
        <td>  
          <Button justIcon color="danger"  className="Plus-btn " onClick={() => this.removeInvoice(idx)}>
              <i className={"fas fa-minus"} />
          </Button>
       
        {this.state.commercialList.length === idx+1 ? 
            <Button justIcon color="facebook" onClick={() => this.addnewRowInvoice()} className="Plus-btn ">
                <i className={"fas fa-plus"} />
            </Button>
          
          :
          null
        } 
        </td>
      </tr>
      )
    })
  }

  handleCommercialInvoiceChange = (event , type , idx) => {
    if(type === "PackageNumber"){
      let commercialList = this.state.commercialList;
      if(event.target.value.length < 4){
        commercialList[idx][type] = event.target.value.replace(/\D/,'');
      }
      else{
        commercialList[idx][type] = 0;
      }
      this.setState({commercialList: commercialList});
    }
    else if(type === "ContentDescription"){
      let commercialList = this.state.commercialList;
      commercialList[idx][type] = event.target.value;
      this.setState({commercialList: commercialList});

    }
    else if(type === "Quantity"){
      let commercialList = this.state.commercialList;
      if(event.target.value.length < 4){
        commercialList[idx][type] = event.target.value.replace(/\D/,'');
      }
      else{
        commercialList[idx][type] = 0;
      }
      this.setState({commercialList: commercialList});

    }
    else if(type === "ValuePerQuantity"){
      let commercialList = this.state.commercialList;
      commercialList[idx][type] = event.target.value.replace(/\D/,'');
      this.setState({commercialList: commercialList});

    }
    else if(type === "TotalValue"){
      let commercialList = this.state.commercialList;
      commercialList[idx][type] = event.target.value.replace(/\D/,'');
      this.setState({commercialList: commercialList});

    }
    
  }

  sendState() {
    return this.state;
  }
  
  handleSave = () => {
    console.log("Step3.......");
  }

  render() {

    return (
      <div>
        <GridContainer className="MuiGrid-justify-xs-center">
          <GridItem xs={12} sm={12} md={12}>
            <div className="package-table">
              <table>
                <thead>
                  <tr>
                    <th>Package Number</th>
                    <th>Package Content</th>
                    <th>Quantity</th>
                    <th>Value Per Qty</th>
                    <th>Total Value</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.viewCommercialInvoice()}
                </tbody>
              </table>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Step3.propTypes = {
  classes: PropTypes.object
};

export default withStyles()(Step3);
