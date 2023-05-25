import React, { Component } from 'react';
// import CustomInput from "components/CustomInput/CustomInput";
import GridContainer from "components/Grid/GridContainer.js";
import {CommonConfig} from '../../utils/constant';
import ReactTable from "react-table";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CustomInput from "components/CustomInput/CustomInput.js";
import CardBody from "components/Card/CardBody.js";
import InputLabel from "@material-ui/core/InputLabel";
import Card from 'components/Card/Card';
import HeadsetMic from "@material-ui/icons/HeadsetMic";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import { makeStyles } from "@material-ui/core/styles";
import Datetime from "react-datetime";
import FormControl from "@material-ui/core/FormControl";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import cogoToast from 'cogo-toast';
import api from "../../utils/apiClient";
import moment from "moment";
import SimpleBackdrop from "../../utils/general";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Checkbox from '@material-ui/core/Checkbox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;


const useStyles = () => makeStyles(styles);
const classes = useStyles();

class AccountReceivable extends Component {
    constructor(props){
        super(props);
        this.state = { 
            UserName:"",
            // TrackingNumber:"",
            currentLogin:{},
            checkUserName:false,
            FromDate:"",
            ToDate:"",
            ManagedByList:[],
            ManagedBy:"",
            ShipmentTypeList:[],
            ShipmentType:"",
            ServiceNameList:[],
            ServiceName:"",
            SubServiceNameList:[],
            SubServiceName:"",
            StatusList:[] ,
            ShipmentStatus:[],
            StatusQuery:"",
            AccountReceivableReport:[],
            Loading:false,
            Access:[],
            finalAmount:0  
         }
    }

    async componentDidMount(){
        this.setState({
            Access : CommonConfig.getUserAccess("Account Receivable"),
            checkUserName : CommonConfig.getUserAccess("Account Receivable").AllAccess === 1 ? false : true,
            currentLogin : { 
                value : CommonConfig.loggedInUserData().PersonID,
                label: CommonConfig.loggedInUserData().Name
            }
        })
        await this.getManagedBy();
        await this.getShipmentType();
        await this.getStatusList();
    }

    
    showLoader() {
        this.setState({ Loading: true });
    }

    hideLoader() {
        this.setState({ Loading: false });
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
    
    getShipmentType(){
        try{
            let data = {
                stringMapType: "SHIPMENTTYPE",
              };
        
            api.post("stringMap/getstringMap", data).then((result) => {
                this.setState({ ShipmentTypeList: result.data });
            }).catch((err) => {
                console.log(err);
            });
        }
        catch(err){
            cogoToast.error("Something went wrong");
            console.log(err);
        }
    }

    
    getServiceByShipmentType(serviceType) {
        try {
            let data = {
                ServiceType : serviceType
            }
        api.post("userManagement/getServiceByShipmentType",data).then((result) => {
            if (result.success) {
                this.setState({
                ServiceNameList: result.data,
                });
            }
            })
            .catch((err) => {
            console.log(err);
            });
        } catch (err) {
        console.log("error", err);
        }
    }

    getSubserviceName(ServiceName , ShipmentType){
        try {
            let data = {
                ServiceName : ServiceName,
                ServiceType : ShipmentType
            }
        api.post("userManagement/getSubserviceName",data).then((result) => {
            if (result.success) {
                this.setState({
                SubServiceNameList: result.data
                });
            }
            }).catch((err) => {
            console.log(err);
            });
        } catch (err) {
        console.log("error", err);
        } 
    }
  
    getStatusList = () => {
        try {
        let data = {
            stringMapType: "SHIPMENTSTATUS",
        };

        api.post("stringMap/getstringMap", data).then((result) => {
            this.setState({ StatusList: result.data });
            })
            .catch((err) => {
            console.log(err);
            });
        } catch (err) {
        console.log("error", err);
        }
    };

    dateChange = (date , type) => {
        if(type === "FromDate"){
            this.setState({FromDate:date });
        }
        else if(type === "ToDate"){
            this.setState({ToDate:date});
        }
    }

    selectChange = (event , value , type) => {
        if(value !== null){
            if(type === "ManagedBy"){
                this.setState({ManagedBy:value});
            }
            else if(type === "ShipmentType"){
                this.setState({
                    ShipmentType:value,
                    ServiceName:"",
                    SubServiceName:"",
                    ServiceNameList:[],
                    SubServiceNameList:[]
                });
                this.getServiceByShipmentType(value.value);
            }
            else if(type === "ServiceName"){
                this.setState({
                    ServiceName:value,
                    SubServiceName:"",
                    SubServiceNameList:[]

                });
                this.getSubserviceName(value.value , this.state.ShipmentType.value);
            }
            else if(type === "SubServiceName"){
                this.setState({SubServiceName:value});
            }
            else if(type === "ShipmentStatus"){
                let query = '';
                let StatusQuery = '';
                for(var j = 0;j < value.length;j++){
                    if(j === 0){
                        if(value.length === 1 ){
                            StatusQuery = ` AND ( sm.ShipmentStatus = "`+value[j].value +`")`;
                        }
                        else{
                            StatusQuery = ` AND ( sm.ShipmentStatus = "`+value[j].value +`"`;
                        }
                        
                    }
                    else if(j + 1 === value.length){
                        StatusQuery = ` OR sm.ShipmentStatus = "`+value[j].value +`")`;
                    }
                    else{
                        StatusQuery = ` OR sm.ShipmentStatus = "`+value[j].value +`"`;
                    }
                    query = query + StatusQuery;
                }
                this.setState({ShipmentStatus:value , StatusQuery:query});
            }
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

    validate(){
        let IsValid = true;

        if((!CommonConfig.isEmpty(this.state.FromDate) && CommonConfig.isEmpty(this.state.ToDate)) || (CommonConfig.isEmpty(this.state.FromDate) && !CommonConfig.isEmpty(this.state.ToDate))){
                IsValid = false;
        }
        return IsValid;
    }

    handleChange = (e,type) => {
        if(type === "UserName"){
            this.setState({UserName : e.target.value});
        }
        // if(type == "TrackingNumber"){
            
        //     this.setState({TrackingNumber : e.target.value});
        // }
    }

    searchReport(){
        if(this.validate()){
            try{
                let data = {
                    FromDate : CommonConfig.isEmpty(this.state.FromDate) ? '' : moment(this.state.FromDate).startOf('day').format(CommonConfig.dateFormat.dbDateTime).toString(),
                    ToDate : CommonConfig.isEmpty(this.state.ToDate) ? '' : moment(this.state.ToDate).endOf('day').format(CommonConfig.dateFormat.dbDateTime).toString(),
                    UserName : CommonConfig.isEmpty(this.state.UserName) ? '' : this.state.UserName,
                    ManagedBy : this.state.checkUserName ? this.state.currentLogin.value :  CommonConfig.isEmpty(this.state.ManagedBy) ? '' : this.state.ManagedBy.value,
                    ShipmentType : CommonConfig.isEmpty(this.state.ShipmentType) ? '' : this.state.ShipmentType.value,
                    ServiceName : CommonConfig.isEmpty(this.state.ServiceName) ? '' : this.state.ServiceName.value,
                    SubServiceName : CommonConfig.isEmpty(this.state.SubServiceName) ? '' : this.state.SubServiceName.value,
                    ShipmentStatus : CommonConfig.isEmpty(this.state.StatusQuery) ? '' : this.state.StatusQuery,
                    // TrackingNumber: this.state.TrackingNumber,
                }
                this.showLoader();
                api.post("reports/getAccountReceivableReport",data).then(res => {
                    this.hideLoader();
                    if(res.success){
                        this.setState({AccountReceivableReport : res.data});
                    }
                    else{
                        cogoToast.error("Something went wrong");
                    }
                }).catch(err => {
                    this.hideLoader();
                    console.log("err",err);
                })
            }
            catch(err){
                this.hideLoader();
                console.log("err",err);
            }
        }
        else{
            cogoToast.error("Please enter from/to date");
        }
    }

    viewShipment = (ShippingID) => {
        const { history } = this.props;
        history.push({
          pathname:'ShipmentNew',
          state:{
            ShipppingID : ShippingID,
            filterlist:[],
            sortlist:[]
            }
        })
    }

    resetReport = () => {
        this.showLoader();
        this.setState({
            FromDate:"",
            ToDate:"",
            UserName:"",
            ManagedBy:"",
            ShipmentType:"",
            ServiceName:"",
            SubServiceName:"",
            StatusQuery:"",
            // TrackingNumber:"",
            ShipmentStatus:[],
            ServiceNameList:[],
            SubServiceNameList:[],
            AccountReceivableReport:[]
        })
        this.hideLoader();
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
                return (CommonConfig.isEmpty(data.FinalAmount) ? "" : "$ " + parseFloat(data.FinalAmount).toFixed(2))
             },
             width:70
            }
        ]
        const { 
            checkUserName,UserName,FromDate,ToDate,ManagedBy,ShipmentType,ServiceName,SubServiceName,
            ShipmentStatus ,AccountReceivableReport , currentLogin ,finalAmount
        } = this.state;
        const shipmentType = this.state.ShipmentTypeList.map((type) => {
            return { value: type.Description, label: type.Description };
        });
        const statusList = this.state.StatusList.map((type) => {
            return { value: type.Description, label: type.Description };
        });
        const managedBy = this.state.ManagedByList.map((type) => {
            return { value: type.UserID, label: type.Name };
        });
        const serviceName = this.state.ServiceNameList.map((type) => {
            return { value: type.MainServiceName, label: type.MainServiceName };
        });
        const subServiceName = this.state.SubServiceNameList.map((type) => {
            return { value: type.ServiceName, label: type.ServiceName };
        });
        return (  
            <GridItem xs={12} sm={12} md={12}>
            {this.state.Loading === true ? (
              <div className="loading">
                <SimpleBackdrop />
              </div>
            ) : null}
                <Card className="z-index-9">
                        <CardHeader className="btn-right-outer" color="primary" icon>
                            <CardIcon color="primary">
                                <HeadsetMic />
                            </CardIcon>
                            <h4 className="margin-right-auto text-color-black">Account Receivable</h4>
                        </CardHeader>
                    <CardBody>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={3} className="z-index-9">
                                <div className="date-input mt-15">
                                    <InputLabel className={classes.label}>
                                        From Date
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
                                </div>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={3}>
                                <div className="date-input mt-15">
                                    <InputLabel className={classes.label}>
                                        To Date
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
                                </div>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={3}>
                                <CustomInput
                                labelText="User Name"
                                formControlProps={{
                                    fullWidth: true,
                                }}
                                inputProps={{
                                    onChange: (event) => this.handleChange(event,"UserName"),
                                    value: UserName
                                }}
                                />
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
                                        <TextField {...params} label="Managed By" margin="normal" />
                                    )}
                                    />
                            </GridItem>
                        </GridContainer>
                        
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={3}>
                                <Autocomplete
                                    id="combo-box-demo"
                                    options={shipmentType}
                                    value={ShipmentType}
                                    onChange={(event, value) =>
                                        this.selectChange(event, value, "ShipmentType")
                                    }
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Shipment Type" />
                                    )}
                                    />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={3}>
                                <Autocomplete
                                    id="combo-box-demo"
                                    options={serviceName}
                                    value={ServiceName}
                                    onChange={(event, value) =>
                                        this.selectChange(event, value, "ServiceName")
                                    }
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Service Type" />
                                    )}
                                    />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={3}>
                                <Autocomplete
                                    id="combo-box-demo"
                                    options={subServiceName}
                                    value={SubServiceName}
                                    onChange={(event, value) =>
                                        this.selectChange(event, value, "SubServiceName")
                                    }
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Sub Service Type" />
                                    )}
                                    />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={3}>
                                <div className="multiselect">
                                    <Autocomplete 
                                        multiple
                                        size="small"
                                        id="filtercheckbox"
                                        options={statusList}
                                        value={ShipmentStatus}
                                        getOptionLabel={(option) => option.label}
                                        onChange={(event, value) =>
                                            this.selectChange(event, value, "ShipmentStatus")
                                        }
                                        style={{width: "100%"}}
                                        renderOption={(option, { selected }) => (
                                            <React.Fragment>
                                                <Checkbox
                                                    icon={icon}
                                                    checkedIcon={checkedIcon}
                                                    style={{ marginRight: 8 }}
                                                    checked={selected}
                                                />
                                                {option.label}
                                            </React.Fragment>
                                            )}
                                        renderInput={params => (
                                            <TextField {...params} label="Status" variant="outlined" />
                                        )}
                                    />
                                </div>
                            </GridItem>

                            
                        </GridContainer>
                        
                        <div className="sub-btn">
                                <Button className="signup-btn" onClick={() => this.searchReport()}>
                                    Search
                                </Button>
                                <Button className="cancel-btn" onClick={() => this.resetReport()}>
                                    Reset
                                </Button>
                        </div>
                    </CardBody>
                </Card>
                <GridContainer justify="center">
                    <Card>
                        <CardBody>
                            <ReactTable
                                data={AccountReceivableReport}
                                minRows = {2}
                                pageText = { `Total rows : ` + this.state.finalLength + ` Total Amount : `+ finalAmount}
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
 
export default AccountReceivable;