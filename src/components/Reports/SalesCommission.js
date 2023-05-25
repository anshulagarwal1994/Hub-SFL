import React, { Component } from 'react';
// import CustomInput from "components/CustomInput/CustomInput";
import GridContainer from "components/Grid/GridContainer.js";
import {CommonConfig} from '../../utils/constant';
import ReactTable from "react-table";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import CardBody from "components/Card/CardBody.js";
import InputLabel from "@material-ui/core/InputLabel";
import Card from 'components/Card/Card';
import Autocomplete from "@material-ui/lab/Autocomplete";
import HeadsetMic from "@material-ui/icons/HeadsetMic";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import FormControl from "@material-ui/core/FormControl";
import cogoToast from 'cogo-toast';
import api from "../../utils/apiClient";
import TextField from "@material-ui/core/TextField";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import Datetime from "react-datetime";
import moment from "moment";
import SimpleBackdrop from "../../utils/general";

const useStyles = () => makeStyles(styles);
const classes = useStyles();

class SalesCommission extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            ShipmentByCommissionList:[],
            finalLength:0,
            finalAmount:0,
            ManagedByList:[],
            ManagedByQuery : "",
            ManagedBy:"",
            checkUserName:false,
            currentLogin:{},
            FromDate:"",
            ToDate:"",
            Loading:false
         }
    }

    viewShipment = (ShippingID) => {
        const { history } = this.props;
        history.push({
          pathname:'ShipmentNew',
          state:{
            ShipppingID : ShippingID,
            filterlist:[],
            sortlist:[],
            FromDate:"",
            ToDate:""
            }
        })
    }
    
    showLoader() {
        this.setState({ Loading: true });
    }

    hideLoader() {
        this.setState({ Loading: false });
    }

    async componentDidMount(){
        
        this.setState({
            Access : CommonConfig.getUserAccess("Sales Commission"),
            checkUserName : CommonConfig.getUserAccess("Sales Commission").AllAccess === 1 ? false : true,
            currentLogin : { 
                value : CommonConfig.loggedInUserData().PersonID,
                label: CommonConfig.loggedInUserData().Name
            }
        })
        await this.getManagedBy();
    }

    searchCommission = () => {
        if(this.validate()){       
            this.showLoader();
            try{
                let data = {
                    ManagedBy : this.state.checkUserName ? this.state.currentLogin.value :  CommonConfig.isEmpty(this.state.ManagedBy) ? '' : this.state.ManagedBy.value,     
                    FromDate : CommonConfig.isEmpty(this.state.FromDate) ? '' : moment(this.state.FromDate).startOf('day').format(CommonConfig.dateFormat.dbDateTime).toString(),
                    ToDate : CommonConfig.isEmpty(this.state.ToDate) ? '' : moment(this.state.ToDate).endOf('day').format(CommonConfig.dateFormat.dbDateTime).toString(),    
                }
                api.post("reports/getShipmentListByCommission",data).then(res => {
                    this.hideLoader();
                    if(res.success){
                        this.setState({ShipmentByCommissionList : res.data});
                    }
                    else{
                        cogoToast.error("Something went wrong");
                    }
                }).catch(err => {
                    this.hideLoader();
                    cogoToast.error("Something went wrong");
                    console.log("error...",err);
                })
            }
            catch(err){
                this.hideLoader();
                console.log("error....",err);
                cogoToast.error("Something went wrong");
            }
        }
        else{
            cogoToast.error("Please enter from/to date");
        }
    }

    validate() {
        let IsValid = true;

        if((!CommonConfig.isEmpty(this.state.FromDate) && CommonConfig.isEmpty(this.state.ToDate)) || (CommonConfig.isEmpty(this.state.FromDate) && !CommonConfig.isEmpty(this.state.ToDate))){
            IsValid = false;
        }
        return IsValid;
    }

    
    getManagedBy(){
        try{
            api.get("scheduleshipment/getShipmentManagedBy").then(res => {
                if(res.success){
                    for(var j = 0 ; j < res.data.length ; j++){
                        this.state.ManagedByList.push(res.data[j]);
                    }
                }
            }).catch(err => {
                cogoToast.error("Something went wrong");
                console.log(err);
            })
        }
        catch(err){
            cogoToast.error("Something went wrong");
            console.log(err);
        }
    }

    resetCommission = () => {
        this.setState({
            ShipmentByCommissionList:[],
            ManagedBy:"",
            FromDate:"",
            ToDate:"",

        })
    }

    selectChange = (event , value , type) => {
        if(value !== null){
            if(type === "ManagedBy"){
                this.setState({ManagedBy:value});
            }
        }
    }

    dateChange = (date , type) => {
        if(type === "FromDate"){
            this.setState({FromDate:date });
        }
        else if(type === "ToDate"){
            this.setState({ToDate:date});
        }
    }

    setLength = (len) => {
        this.setState({finalLength : len});
    }

    finalAmount = (amountData) => {
        let amount = 0
        for(var j = 0; j < amountData.length; j++){
            amount = amount + Number(amountData[j].Amount.replace('$',''));
        }
        this.setState({finalAmount : parseFloat(amount).toFixed(2)});
    }
      
    checkProps = (e) => {
        if(this.state.finalLength !== e.sortedData.length){
            this.setLength(e.sortedData.length);
            this.finalAmount(e.sortedData);
        }
        return '';
    }

    render() { 
        
        const columns = [
            { 
             Header:"Date" ,
             id:"ShipmentDate",
             sortMethod: (a, b) => {
                return CommonConfig.dateSortMethod(a,b);
              },
             accessor: data => {
                return (moment(data.ShipmentDate).format(CommonConfig.dateFormat.dateOnly))
             },
             width:85  
            },
            {
             Header:"Tracking",
             id:"Tracking",
             accessor: "TrackingNumber",
             width:80
            },
            {
             Header:"Contact Name",
             accessor: "ContactName",
             width:100
            },
            {
             Header:"From",
             accessor: "FromCountry",
             width:80
            },
            {
             Header:"To",
             accessor: "ToCountry",
             width:80
            },
            {
             Header:"Status",
             accessor: "ShipmentStatus",
             width:100
            },
            {
             Header:"Shipment",
             accessor: "ShipmentType",
             width:81
            },
            {
             Header:"Service",
             accessor: "ServiceName",
             width:80
            },
            {
             Header:"Sub Service",
             accessor: "SubServiceName",
             width:73
            },
            {
             Header:"Username",
             accessor: "UserName",
             width:90
            },
            {
             Header:"Managed By",
             accessor: "ManagedBy",
             width:90
            },
            {
             Header:"Amount",
             id:"Amount",
             accessor: data => {
                 if(data.CommissionStatus === "Active"){
                    return (CommonConfig.isEmpty(data.CommissionAmount) ? "" : "$ " + parseFloat(data.CommissionAmount).toFixed(2))
                 }
                 else{
                    return (CommonConfig.isEmpty(data.CommissionAmount) ? "" : "$ -" + parseFloat(data.CommissionAmount).toFixed(2))
                 }
                
             },
             width:70
            }
        ]
        const { ShipmentByCommissionList , FromDate ,ToDate , finalLength, finalAmount ,
        ManagedBy , checkUserName , currentLogin } = this.state;
        
        const managedBy = this.state.ManagedByList.map((type) => {
            return { value: type.UserID, label: type.Name };
        });

        return (
            <GridItem> 
                {this.state.Loading === true ?
                    <div className="loading">
                        <SimpleBackdrop/>
                    </div>
                    : 
                    null
                }  
                <GridContainer justify="center">
                    <Card className="z-index-9">
                        <CardHeader className="btn-right-outer" color="primary" icon>
                            <CardIcon color="primary">
                                <HeadsetMic />
                            </CardIcon>
                            <h4 className="margin-right-auto text-color-black">Sales Commission</h4>
                        </CardHeader>
                        <CardBody>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={4} className="z-index-9">
                                    <InputLabel className={classes.label}>
                                        Start Date
                                    </InputLabel>
                                    <FormControl fullWidth>
                                        <Datetime
                                        dateFormat={"MM/DD/YYYY"}
                                        timeFormat={false}
                                        value={FromDate}
                                        onChange={(date) =>
                                            this.dateChange(date, "FromDate")
                                        }
                                        closeOnSelect={true}
                                        renderInput={(params) => (
                                            <TextField {...params} fullWidth />
                                        )}
                                        />
                                    </FormControl>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={4} className="z-index-9">
                                    <InputLabel className={classes.label}>
                                        End Date
                                    </InputLabel>
                                    <FormControl fullWidth>
                                        <Datetime
                                        dateFormat={"MM/DD/YYYY"}
                                        timeFormat={false}
                                        value={ToDate}
                                        onChange={(date) =>
                                            this.dateChange(date, "ToDate")
                                        }
                                        closeOnSelect={true}
                                        renderInput={(params) => (
                                            <TextField {...params} fullWidth />
                                        )}
                                        />
                                    </FormControl>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={3}>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        options={managedBy}
                                        value={checkUserName ? currentLogin : ManagedBy }
                                        disabled={checkUserName}
                                        onChange={(event, value) =>
                                            this.selectChange(event, value, "ManagedBy")
                                        }
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Managed By" />
                                        )}
                                        />
                                </GridItem>
                            </GridContainer>
                            
                            <div className="sub-btn">
                                    <Button className="signup-btn" onClick={() => this.searchCommission()}>
                                        Search
                                    </Button>
                                    <Button className="cancel-btn" onClick={() => this.resetCommission()}>
                                        Reset
                                    </Button>
                            </div>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody>
                            <ReactTable
                                data={ShipmentByCommissionList}
                                minRows = {2}
                                pageText = { `Total rows : ` + finalLength + ` Total Amount : `+ finalAmount}
                                defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                                getPaginationProps = {(e)=> this.checkProps(e)}
                                filterable
                                resizable={false}
                                columns={columns}
                                defaultPageSize={10}
                                showPaginationBottom={true}
                                className="-striped -highlight"
                            />
                        </CardBody>
                    </Card>
                </GridContainer>
            </GridItem>
        );
    }
}
 
export default SalesCommission;