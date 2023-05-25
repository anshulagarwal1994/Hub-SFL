/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";
import Icon from "@material-ui/core/Icon";
import Button from "components/CustomButtons/Button.js";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import { green } from "@material-ui/core/colors";
import {CommonConfig} from '../../../utils/constant';
import api from '../../../utils/apiClient';
import { red } from "@material-ui/core/colors";
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import Autocomplete from "@material-ui/lab/Autocomplete";
import moment from 'moment';

// material ui icons

const useStyles = makeStyles(styles);
const classes = () => {
  return useStyles();
};

class Step4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      simpleSelect: "",
      PaymentList : [{
        len : 1
      }],
      paymentReceived : [{
        len : 1
      }],
      paymentIssued : [{
        len : 1
      }],
      paymentMethod : [{
        len : 1
      }],
      ServiceDescriptionList : [],
      PaymentTypeList : [],
      VendorList : [],
      PaymentMethodType: [
        {value:"Bank",label:"Bank"},
        {value:"Credit Card",label:"Credit Card"},
        // {value:"AMERICAN EXPRESS",label:"AMERICAN EXPRESS"},
        // {value:"RUPAY",label:"RUPAY"},
      ],
      yesNo: [
        {value:"Yes",label:"Yes"},
        {value:"No",label:"No"},
        {value:"N/A",label:"N/A"}  
    ],
      

    };
    
  }

  async componentDidMount() {
    await this.getAccountDetail();
    await this.getServiceDescription();
    await this.getpaymentType();
    await this.getVendorName();
  }

  getAccountDetail(){
    try{
      let data = {
        ShippingID : this.props.history.location.state.ShipppingID
      }
      api.post("scheduleshipment/getAccountDetail",data).then(res => {
        if(res.success){
          this.setState({
            PaymentList : res.data.InvoiceData,
            paymentReceived : res.data.PaymentReceivedData,
            paymentIssued : res.data.PaymentIssuedData,
            paymentMethod : res.data.PaymentDetailData,

          })
        }
      }).catch(err => {
        console.log("error...",err);
      })
    }
    catch(err){
      console.log("error",err);
    }

  }

  sendState() {
    return this.state;
  }

  getServiceDescription() {
    
    try{
        let data = {
            stringMapType:"INVENTORY"
        }

        api.post("stringMap/getstringMap",data).then( result => {
            this.setState({ServiceDescriptionList : result.data})
        }).catch(err => {
            console.log(err);
        })
    }
    catch(err) {
        console.log("error", err);
    }
  }

  getpaymentType() {
      
    try{
      let data = {
          stringMapType:"PAYMENTTYPE"
      }

      api.post("stringMap/getstringMap",data).then( result => {
          this.setState({PaymentTypeList : result.data})
      }).catch(err => {
          console.log(err);
      })
    }
    catch(err) {
        console.log("error", err);
    }
  }
  
  getVendorName() {
    try{
        api.get("vendor/getVendorNameList").then( result => {
            this.setState({VendorList : result.data})
        }).catch(err => {
            console.log(err);
        })
    }
    catch(err) {
        console.log("error", err);
    }
    
  }

  renderServiceDescription = () => {
      return this.state.ServiceDescriptionList.map( content =>{
        return(
            <MenuItem classes={{root: classes.selectMenuItem}} value={content.Description} > {content.Description}  </MenuItem> 
        )
    })
  }

  addnewRowInvoice = () => {
    const row = {
      len:this.state.PaymentList + 1 
    }
    this.setState({PaymentList : [...this.state.PaymentList,row]});
  }

  addRowPaymentReceived = () => {
    const row = {
      len:this.state.paymentReceived + 1 
    }
    this.setState({paymentReceived : [...this.state.paymentReceived,row]});
  }

  addRowPaymentIssued = () => {
    const row = {
      len:this.state.paymentIssued + 1 
    }
    this.setState({paymentIssued : [...this.state.paymentIssued,row]});
  }

  addRowPaymentMethod = () => {
    const row = {
      len:this.state.paymentMethod + 1 
    }
    this.setState({paymentMethod : [...this.state.paymentMethod,row]});
  }

  removePaymentRecieved = (index) => {
    var paymentList = this.state.paymentReceived;
    paymentList.splice(index , 1);
    this.setState({paymentReceived : paymentList});
  }
  
  removePaymentIssued = (index) => {
    var paymentList = this.state.paymentIssued;
    paymentList.splice(index , 1);
    this.setState({paymentIssued : paymentList});
  }

  removeInvoice = (index) => {
    var paymentList = this.state.PaymentList;
    paymentList.splice(index , 1);
    this.setState({PaymentList : paymentList});
  }
  
  removePaymentMethod = (index) => {
    var paymentList = this.state.paymentMethod;
    paymentList.splice(index , 1);
    this.setState({paymentMethod : paymentList});
  }

  selectChange = (value , type) => {
    console.log("value.....type.....",value,type);
  }

  yesNo = () => {
    return this.state.yesNo.map( content =>{
        return(
            <MenuItem classes={{root: classes.selectMenuItem}} value={content.value} > {content.label}  </MenuItem> 
        )
    })
  }

  viewInvoice = () => {
    const ServiceList = this.state.ServiceDescriptionList.map(type => {return {value:type.Description , label:type.Description}});
    return this.state.PaymentList.map((payment,idx) => {
      const ServiceDescription = {
        value: payment.ServiceDescription,
        label: payment.ServiceDescription
      }
      return (
        
        <tr>
        <td>
            <CustomInput
              inputProps={{
                value:moment(payment.InvoiceDate).format(CommonConfig.dateFormat.dateOnly)
              }} />
        </td>
        <td>
          <div>
                <Autocomplete 
                id="package_number" 
                options = {ServiceList}
                value = {ServiceDescription}
                getOptionLabel={(option) => option.label}
                onChange={(value) => this.selectChange(value,"Service")} 
                renderInput={(params) => <TextField {...params}  />}
                />
          </div>
        </td>
        <td className="text-align-right">
            <CustomInput
            inputProps={{
              value:payment.Description
            }} />
        </td>
        <td className="text-align-right">
            <CustomInput
            inputProps={{
              value:payment.Quantity
            }} />
          </td>
        <td className="text-align-right">
            <CustomInput 
            inputProps={{
              value:payment.Amount
            }} />          
        </td>
        <td className="text-align-right">
            <CustomInput 
                inputProps={{
                  value:payment.TotalAmount
                }} />  
        </td>
        <td>
              <span>{payment.CreatedByName}</span>
        </td>
        <td>
          <Button justIcon color="danger"  className="Plus-btn " onClick={() => this.removeInvoice(idx)}>
              <i className={"fas fa-minus"} />
          </Button>
        {this.state.PaymentList.length === idx+1 ? 
           <Button justIcon color="facebook" onClick={() => this.addnewRowInvoice()} className="Plus-btn ">
              <i className={"fas fa-plus"} />
            </Button>
         
        : null
        }
        </td>
      </tr>
      )
    })
  }

  viewPaymentIssued = () => {
    const VendorList = this.state.VendorList.map(type => {return {value:type.VendorName , label:type.VendorName}});
    return this.state.paymentIssued.map((payment ,idx) => {
      const vendorName = {
        value : payment.VendorName, label : payment.VendorName
      }
      return(
        <tr>
                    <td>
                      <CustomInput
                        inputProps={{
                          value:moment(payment.PaymentIssuedDate).format(CommonConfig.dateFormat.dateOnly)
                        }} />
                      </td>
                    <td>
                    <Autocomplete 
                        id="package_number" 
                        options = {VendorList}
                        value={vendorName}
                        getOptionLabel={(option) => option.label}
                        onChange={(value) => this.selectChange(value,"VendorName")} 
                        renderInput={(params) => <TextField {...params}  />}
                        />
                    </td>
                    <td className="text-align-right">
                        <CustomInput
                        inputProps={{
                          value:payment.InvoiceNumber
                        }} />
                    </td>
                    <td className="text-align-right">
                      <CustomInput
                        inputProps={{
                          value:moment(payment.DatePaid).format(CommonConfig.dateFormat.dateOnly)
                        }} />
                    </td>
                    <td>
                      <div className="table-select">
                          <FormControl className={classes.formControl} fullWidth> 
                          <Select id="package_number" value = {payment.PaidStatus} name="package_number" className="form-control" onChange={() => this.handleChangePackagecontent()}>
                              {this.yesNo()}</Select>
                          </FormControl>
                      </div>
                    </td>
                    <td className="text-align-right">
                      <CustomInput
                        inputProps={{
                          value:payment.Amount
                        }} />
                        </td>
                        <td>
                              <span>{payment.CreatedByName}</span>
                        </td>
                        <td>
                            <Button justIcon color="danger"  className="Plus-btn " onClick={() => this.removePaymentIssued(idx)}>
                                <i className={"fas fa-minus"} />
                            </Button>
                          {this.state.paymentIssued.length === idx+1 ? 
                              <Button justIcon color="facebook" onClick={() => this.addRowPaymentIssued()} className="Plus-btn ">
                                      <i className={"fas fa-plus"} />
                              </Button>
                            : null
                          }
                        </td>
        </tr>

      )
    })
  }

  viewPaymentMethod = () => {
    const PaymentMethodType = this.state.PaymentMethodType.map(type => {return {value:type.value , label:type.label}});
    return this.state.paymentMethod.map((method,idx) => {
      const Paymentmethod = {
        value : method.PaymentType, label : method.PaymentType
      }
      return (
                  <tr>
                    <td>
                    <Autocomplete 
                        id="package_number" 
                        options = {PaymentMethodType}
                        value = {Paymentmethod}
                        getOptionLabel={(option) => option.label}
                        onChange={(value) => this.selectChange(value,"PaymentMethod")} 
                        renderInput={(params) => <TextField {...params}  />}
                        />
                    </td>
                    <td>
                      <CustomInput 
                          inputProps={{
                            value:method.PaymentType === "Credit Card" ? method.CardName : method.NameonAccount
                          }}
                        />
                    </td>
                    <td>
                        <CustomInput 
                          inputProps={{
                            value:method.PaymentType === "Credit Card" ? method.CardNumber : method.AccountNumber
                          }}
                        />
                        {
                        method.PaymentType === "Bank" ?
                          <CustomInput 
                              inputProps={{
                                value:method.RoutingNumber
                              }}
                          />
                          : null
                        }
                      </td>
                    {/* <td className="text-align-right">
                        <CustomInput 
                            inputProps={{
                              value:method.RoutingNumber
                            }}
                        />
                    </td> */}
                   <td className="text-align-right">
                      <CustomInput 
                            inputProps={{
                              value:moment(method.PaidDate).format(CommonConfig.dateFormat.dateOnly)
                            }}
                        />
                    </td>
                   <td className="text-align-right">
                      <CustomInput 
                            inputProps={{
                              value:method.CardExpiry
                            }}
                        />
                    </td>
                   <td className="text-align-right">
                      <CustomInput 
                            inputProps={{
                              value:method.CardZipCode
                            }}
                        />
                    </td>
                   <td className="text-align-right">
                      <CustomInput 
                            inputProps={{
                              value:method.InvoiceAmount
                            }}
                        />
                    </td>
                    <td>
                          <span>{method.CreatedByName}</span>
                    </td>
                    <td>
                      <Button justIcon color="danger"  className="Plus-btn " onClick={() => this.removePaymentMethod(idx)}>
                          <i className={"fas fa-minus"} />
                      </Button>
                    {this.state.paymentMethod.length === idx+1 ? 
                        <Button justIcon color="facebook" onClick={() => this.addRowPaymentMethod()} className="Plus-btn ">
                                <i className={"fas fa-plus"} />
                        </Button>
                      : null
                    }
                    </td>
                  </tr>
      )
    })
  }

  paymentReceived = () => {
    const PaymentTypeList = this.state.PaymentTypeList.map(type => {return {value:type.Description , label:type.Description}});
    return this.state.paymentReceived.map((payment ,idx) => {
      const paymentType = {
        value:payment.PaymentType, label : payment.PaymentType
      }
      return(
        
        <tr>
        <td>
            <CustomInput 
                  inputProps={{
                    value:moment(payment.PaymentReceivedDate).format(CommonConfig.dateFormat.dateOnly)
                  }}
              />
        </td>
        <td>
          <Autocomplete 
              id="package_number" 
              options = {PaymentTypeList}
              value={paymentType}
              getOptionLabel={(option) => option.label}
              onChange={(value) => this.selectChange(value,"PaymentType")} 
              renderInput={(params) => <TextField {...params}  />}
              />
        </td>
        <td className="text-align-right">
            <CustomInput 
                  inputProps={{
                    value:payment.ConfirmationNumber
                  }}
              />
        </td>
        <td className="text-align-right">
            <CustomInput 
                  // inputProps={{
                  //   value:payment.ConfirmationNumber
                  // }}
              />
        </td>
        <td className="text-align-right">
            <CustomInput 
                  inputProps={{
                    value:payment.Amount
                  }}
              />
        </td>
        <td>
              <span>{payment.CreatedByName}</span>
        </td>
        <td>
            <Button justIcon color="danger"  className="Plus-btn " onClick={() => this.removePaymentRecieved(idx)}>
                <i className={"fas fa-minus"} />
            </Button>
          {this.state.paymentMethod.length === idx+1 ? 
              <Button justIcon color="facebook" onClick={() => this.addRowPaymentReceived()} className="Plus-btn ">
                      <i className={"fas fa-plus"} />
              </Button>
            : null
          }
        </td>
      </tr>
      )
    })
  }

  
  handleSave = () => {
    console.log("Step4.......");
  }


  render() {

    return (
      <div>
        <GridContainer className="MuiGrid-justify-xs-center">
          <GridItem xs={12} sm={12} md={12}>
            <div className="policy-heading">
              <h3>Invoice</h3>
            </div>
            <div className="package-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Service</th>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Cost</th>
                    <th>Total</th>
                    <th>Updated By</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.viewInvoice()}
                  <tr>
                    <td className="text-align-right" colSpan="5"><b>Total Cost:</b></td>
                    <td className="text-align-right"><CustomInput /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </GridItem>
        </GridContainer>
        
        <GridContainer className="MuiGrid-justify-xs-center">
          <GridItem xs={12} sm={12} md={12}>
            <div className="policy-heading">
              <h3>Payment Received</h3>
              <div className="ph-btn">
              </div>
            </div>
            <div className="package-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Payment Type</th>
                    <th>Confirmation</th>
                    <th>TBD</th>
                    <th>Amount</th>
                    <th>Updated By</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.paymentReceived()}
                  <tr>
                    <td className="text-align-right" colSpan="4"><b>Total Cost:</b></td>
                    <td className="text-align-right"><CustomInput /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </GridItem>
        </GridContainer>
        
        <GridContainer className="MuiGrid-justify-xs-center">
          <GridItem xs={12} sm={12} md={12}>
            <div className="policy-heading">
              <h3>Payment Issued</h3>
              <div className="ph-btn">
              </div>
            </div>
            <div className="package-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Vendor Name</th>
                    <th>Invoice Number</th>
                    <th>Date Paid</th>
                    <th>Paid Status</th>
                    <th>Amount</th>
                    <th>Updated By</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.viewPaymentIssued()}
                  <tr>
                    <td className="text-align-right" colSpan="5"><b>Total Cost:</b></td>
                    <td className="text-align-right"><CustomInput /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </GridItem>
        </GridContainer>
        
        <GridContainer className="MuiGrid-justify-xs-center">
          <GridItem xs={12} sm={12} md={12}>
            <div className="policy-heading">
              <h3>Payment Method</h3>
              <div className="ph-btn">
              </div>
            </div>
            <div className="package-table">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Number</th>
                    <th>Date Paid</th>
                    <th>Exp Date</th>
                    <th>Zipcode</th>
                    <th>Amount</th>
                    <th>Updated By</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.viewPaymentMethod()}
                </tbody>
              </table>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Step4.propTypes = {
  classes: PropTypes.object
};

export default withStyles()(Step4);
