import React, { Component } from 'react';
import * as XLSX from "xlsx";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import GridContainer from "components/Grid/GridContainer.js";
import CardBody from "components/Card/CardBody.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import { CommonConfig } from "utils/constant.js";
import moment from "moment";
import api from "../../utils/apiClient";
import Button from "components/CustomButtons/Button.js";
import cogoToast from 'cogo-toast';
import SimpleBackdrop from "../../utils/general";
import CardIcon from "components/Card/CardIcon.js";
import ArchiveIcon from '@material-ui/icons/Archive';
import GateRatesIcon from "@material-ui/icons/AttachMoney";

class StandardInvoiceReport extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            file : '',
            ExcelJSONData : [],
            Loading : false,
            isCommitted : false,
            committedLength : 0,
            notCommitedLength: 0,
            notCommitedList : [],
            fileName : '',
            isPreviewClicked : false
         }
    }

    fileUpload = (e) => {
        var fileName = document.getElementById('file').value.toLowerCase();
        if(!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')){
            alert('Please upload *.xlsx file only.');
            return false;
        }
        else{
            this.setState({
                file : e.target.files[0],
                fileName : e.target.files[0] ? e.target.files[0].name : ''
            });
        }
    }

    sheet2arr = (sheet) => {
        var result = [];
        var row;
        var rowNum;
        var colNum;
        var range = XLSX.utils.decode_range(sheet['!ref']);
        for(rowNum = range.s.r; rowNum <= range.e.r; rowNum++){
        row = [];
            for(colNum=range.s.c; colNum<=range.e.c; colNum++){
            var nextCell = sheet[
                XLSX.utils.encode_cell({r: rowNum, c: colNum})
            ];
                if( typeof nextCell === 'undefined' ){
                    row.push(void 0);
                } else {
                    if(nextCell.w !== undefined){
                        if(nextCell.w.includes(",")){
                            nextCell.w.replace(/,/g, "")
                        }
                        row.push(nextCell.w);
                    }
                }
            }
            result.push(row);
        }
        return result;
    };
     
    validate(){
        let IsFormValid = true;
        if(CommonConfig.isEmpty(this.state.file)){
            IsFormValid = false;
        }
        return IsFormValid;
    }

    readFile() {
        if(this.validate()){
            this.setState({isPreviewClicked : true});
            var f = this.state.file;
            const reader = new FileReader();
            reader.onload = (evt) => {
                // evt = on_file_select event
                /* Parse data */
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: "binary" });
                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                //Converting into array of array(removing , from amount)
                let tempData = this.sheet2arr(ws);
                //Looping for formatting JSON from array of array
                let finalJson = this.formatJSON(tempData);

                this.setState({
                ExcelJSONData : finalJson
                })
            };
            reader.readAsBinaryString(f);
        }
        else{
            cogoToast.error("Please select *.xlsx file");
        }
    }

    formatJSON(json){
    var result = [];
        if(json.length > 0){
        let headers = json[0];
        for(var j = 1 ; j < json.length ; j++){
            var obj = {};
            var currentline;
            currentline = json[j];
            for(var i = 0 ; i < headers.length ; i++){
                    obj[headers[i].replace(/ /g,'')] = currentline[i];
            }
            result.push(obj);
        }
        }
        return result;
    }

    viewPaymentIssued = () => {
        return this.state.ExcelJSONData.map((issued,index)=> { 
            issued.OriginalCustomerReference = issued.Tracking;
            issued.ExpressorGroundTrackingID = issued.Confirmation?issued.Confirmation:'';
            issued.NetChargeAmount = issued.Amount;
            issued.VendorName = issued.VendorName;
            issued.PaidStatus = issued.Status;
            issued.InvoiceDate = moment(issued.Date).toDate();
            issued.DatePaid = issued.DatePaid!=undefined?moment(issued.InvoiceDate).toDate():'';
        return (
            <tr key={index}>
                <td className="wd-150">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: moment(issued.InvoiceDate).format(CommonConfig.dateFormat.dateOnly),
                        }}
                    />
                </td>
                <td className="wd-150">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.OriginalCustomerReference,
                        }}
                    />
                </td>
                <td className="wd-150">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.VendorName,
                        }}
                    />
                </td>
                <td className="wd-150">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.InvoiceNumber,
                        }}
                    />
                </td>
                <td className="wd-150">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.ExpressorGroundTrackingID,
                        }}
                    />
                </td>
                <td className="wd-150">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.DatePaid!=''?moment(issued.DatePaid).format(CommonConfig.dateFormat.dateOnly):'',
                        }}
                    />
                </td>
                <td className="wd-150">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.PaidStatus,
                        }}
                    />
                </td>
                <td className="wd-150">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.NetChargeAmount,
                        }}
                    />
                </td>
            </tr>
        )
        })
    }

    viewNotCommitted = () => {
        return this.state.notCommitedList.map((issued,index)=> { 
        return (
            <tr key={index}>
                <td className="wd-150">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: moment(issued.PaymentIssuedDate).format(CommonConfig.dateFormat.dateOnly),
                        }}
                    />
                </td>
                <td className="wd-150">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.TrackingNumber,
                        }}
                    />
                </td>
                <td className="wd-150">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.VendorName,
                        }}
                    />
                </td>
                <td className="wd-150">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.InvoiceNumber,
                        }}
                    />
                </td>
                <td className="wd-150">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.ConfirmationNumber,
                        }}
                    />
                </td>
                <td className="wd-150">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.DatePaid!=''?moment(issued.DatePaid).format(CommonConfig.dateFormat.dateOnly):''
                        }}
                    />
                </td>
                <td className="wd-150">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.PaidStatus,
                        }}
                    />
                </td>
                <td className="wd-150">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.Amount,
                        }}
                    />
                </td>
            </tr>
        )
        })
    }

    showLoader() {
        this.setState({ Loading: true });
    }
    
    hideLoader() {
        this.setState({ Loading: false });
    }

    saveReport = () => {

    let finalJson = [];

    for(var j = 0 ; j < this.state.ExcelJSONData.length ; j++ ){
        let obj = {};
        obj.PaymentIssuedDate = this.state.ExcelJSONData[j]["InvoiceDate"];
        obj.VendorName = this.state.ExcelJSONData[j]["VendorName"];
        obj.DatePaid = this.state.ExcelJSONData[j]["DatePaid"];
        obj.PaidStatus = this.state.ExcelJSONData[j]["PaidStatus"];
        obj.Amount = this.state.ExcelJSONData[j]["NetChargeAmount"];
        obj.InvoiceNumber = this.state.ExcelJSONData[j]["InvoiceNumber"];
        obj.ConfirmationNumber = this.state.ExcelJSONData[j]["ExpressorGroundTrackingID"];
        obj.TrackingNumber = this.state.ExcelJSONData[j]["OriginalCustomerReference"];
        finalJson.push(obj);
    }
    let data = {
        paymentIssued : finalJson,
        userid : CommonConfig.loggedInUserData().PersonID,
    }
    this.showLoader();
    // console.log("data......",data);
    try{
        api.post("scheduleshipment/addIssuedPayments",data).then(res => {
            // console.log("res......",res);
            this.hideLoader();
            if(res.success){
                cogoToast.success("Updated successfully");
                this.setState({
                    isCommitted : true,
                    committedLength : res.data.committed
                })
                if(res.data.notCommitedList.length){
                    this.setState({
                        notCommitedList : res.data.notCommitedList,
                        notCommitedLength : res.data.notCommited,
                    })
                }
                // this.resetReport();
            }
            else{
                cogoToast.error("Something went wrong");
            }

        }).catch(err => {
            cogoToast.error("Something went wrong");
            console.log("error",err);
        })
        
    }
    catch(err){
        cogoToast.error("Something went wrong");
        console.log("error",err);
    }
    }

    resetReport = (type) => {
        this.showLoader();
        if(type === 'clear'){
            document.getElementById('file').value = '';
        }
        this.setState({
            ExcelJSONData : [],
            file : '',
            fileName : '',
            isPreviewClicked : false,
            isCommitted : false,
            committedLength : 0,
            notCommitedLength : 0
        })
        this.hideLoader();
    }

    
      render() {
          const  { fileName , isPreviewClicked } = this.state;
        return (
            <div>
                
                {this.state.Loading === true ? (
                <div className="loading">
                    <SimpleBackdrop />
                </div>
                ) : null}
                <Card>
                    <CardHeader className="btn-right-outer" color="primary" icon>
                        <CardIcon color="primary">
                            <ArchiveIcon />
                        </CardIcon>
                        <h4 className="margin-right-auto text-color-black">Standard Invoice Upload</h4>
                    </CardHeader>
                    <CardBody className="shipment-cardbody mt-20">
                        
                  
                    { !this.state.isCommitted ?
                        <GridContainer>
                            <GridItem xs={12} sm={6} md={6}>
                                <div className ='fedex-file-input'>
                                    <input value = {fileName} disabled = {true} />
                                </div>
                            </GridItem>
                            <GridItem xs={12} sm={6} md={6}>
                                <div className ='fedex-submit'>
                                    <div className="custom-file-browse fedex-upload">
                                        <span>Select File</span>
                                        <input
                                            type="file"
                                            name="selectedfile"
                                            id="file"
                                            accept=".xls,.xlsx"
                                            className="normal-btn sm-orange"
                                            onChange={(event) => this.fileUpload(event)}
                                        />
                                    </div>
                                    <Button className = "preview-file-btn" color = "primary"
                                        onClick={() => {
                                            this.readFile();
                                        }}
                                    >
                                        Preview
                                    </Button>
                                </div>
                                </GridItem>
                                <GridItem xs={12} sm={6} md={3}>
                                </GridItem>
                        </GridContainer>
                        : 
                        <>
                            <h3>Invoice Uploaded Successfully</h3>
                            <div className="invoice-result">
                                <div className="ir-row">
                                    <p>Successfully Inserted Record </p>
                                    <span>{this.state.committedLength}</span>
                                </div>
                                <div className="ir-row">
                                    <p>Total Records Failed </p>
                                    <span>{this.state.notCommitedLength}</span>
                                </div>
                                <div className="ir-row">
                                    <p>Total Records  </p>
                                    <span>{Number(this.state.committedLength + this.state.notCommitedLength)}</span>
                                </div>
                            </div>
                        </>
                    }
                    </CardBody>
                </Card>
                {isPreviewClicked ? 
                 !this.state.isCommitted ? 
                    <Card>
                        <CardHeader className="btn-right-outer" color="primary" icon>
                            <CardIcon color="primary">
                                <GateRatesIcon />
                            </CardIcon>
                            <h4 className="margin-right-auto text-color-black"> 
                                Payment Issued
                            </h4>
                        </CardHeader>
                        <CardBody className="shipment-cardbody">
                            <GridContainer className="MuiGrid-justify-xs-center">
                            <GridItem xs={12} sm={12} md={12}>
                                <div className="package-table accounts-table no-scroll">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Tracking</th>
                                        <th className="acc-wd200">Vendor Name</th>
                                        <th className="wd-125">Invoice No</th>
                                        <th className="wd-125">Confirmation</th>
                                        <th>Date Paid</th>
                                        <th>Paid Status</th>
                                        <th>Amount</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.viewPaymentIssued() }
                                    </tbody>
                                </table>
                                </div>
                            </GridItem>
                            </GridContainer>
                            <div className="shipment-submit">
                                <div className="left">
                                </div>
                                <div className="right">
                                    <Button color = "rose" onClick = {() => this.saveReport()}>
                                        Save & Commit
                                    </Button>
                                    <Button color = "secondary" onClick = {() => this.resetReport("clear")}>
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </CardBody>    
                    </Card>
                        :

                    this.state.notCommitedList.length > 0 ? 
                    <>
                        <Card>
                            <CardHeader className="btn-right-outer" color="primary" icon>
                                <CardIcon color="primary">
                                    <GateRatesIcon />
                                </CardIcon>
                                <h4 className="margin-right-auto text-color-black"> 
                                    Records Failed
                                </h4>
                            </CardHeader>
                            <CardBody className="shipment-cardbody">
                                <GridContainer className="MuiGrid-justify-xs-center">
                                <GridItem xs={12} sm={12} md={12}>
                                    <div className="package-table accounts-table no-scroll">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Tracking</th>
                                            <th className="acc-wd200">Vendor Name</th>
                                            <th className="wd-125">Invoice No</th>
                                            <th className="wd-125">Confirmation</th>
                                            <th>Date Paid</th>
                                            <th>Paid Status</th>
                                            <th>Amount</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.viewNotCommitted()}
                                        </tbody>
                                    </table>
                                    </div>
                                </GridItem>
                                </GridContainer>
                            </CardBody>    
                        </Card>
                        
                        <div className="shipment-submit">
                            <div className="left">
                            </div>
                            <div className="right">
                                <Button color = "rose" onClick = {() => this.resetReport("newinvoice")}>
                                    Upload New Invoice
                                </Button>
                            </div>
                        </div>
                    </>
                        :
                        
                        <div className="shipment-submit">
                            <div className="left">
                            </div>
                            <div className="right">
                                <Button color = "rose" onClick = {() => this.resetReport("newinvoice")}>
                                    Upload New Invoice
                                </Button>
                            </div>
                        </div>
                : 
                    null
                }
          </div>
        );
      }
    }
    
 
export default StandardInvoiceReport;