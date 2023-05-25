import React, { Component } from 'react';
import * as XLSX from "xlsx";
import GridItem from "../Grid/GridItem.js";
import CustomInput from "../CustomInput/CustomInput.js";
import GridContainer from "../Grid/GridContainer.js";
import CardBody from "../Card/CardBody.js";
import Card from "../Card/Card.js";
import CardHeader from "../Card/CardHeader.js";
import { CommonConfig } from "../../utils/constant.js";
import moment from "moment";
import api from "../../utils/apiClient";
import Button from "../CustomButtons/Button.js";
import cogoToast from 'cogo-toast';
import SimpleBackdrop from "../../utils/general";
import CardIcon from "../Card/CardIcon.js";
import ArchiveIcon from '@material-ui/icons/Archive';
import GateRatesIcon from "@material-ui/icons/AttachMoney";

class BulkShipmentImport extends Component {
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
            issued.ShipmentType = issued.ShipmentType;
            issued.LocationType = issued.LocationType;
            issued.DutiesPaidBy = issued.DutiesPaidBy;
            issued.FromCountryName = issued.FromCountryName;
            issued.FromCountryCode = issued.FromCountryCode;
            issued.FromCompanyName = issued.FromCompanyName;
            issued.FromContactName = issued.FromContactName;
            issued.FromAddrerss = issued.FromAddrerss;
            issued.FromCityName = issued.FromCityName;
            issued.FromStateName = issued.FromStateName;
            issued.FromZipCode = issued.FromZipCode;
            issued.FromPhoneNumber1 = issued.FromPhoneNumber1;
            issued.FromPhoneNumber2 = issued.FromPhoneNumber2;
            issued.FromEmail = issued.FromEmail;
            
            issued.ToCountryName = issued.ToCountryName;
            issued.ToCountryCode = issued.ToCountryCode;
            issued.ToCompanyName = issued.ToCompanyName;
            issued.ToContactName = issued.ToContactName;
            issued.ToAddrerss = issued.ToAddrerss;
            issued.ToCityName = issued.ToCityName;
            issued.ToStateName = issued.ToStateName;
            issued.ToZipCode = issued.ToZipCode;
            issued.ToPhoneNumber1 = issued.ToPhoneNumber1;
            issued.ToPhoneNumber2 = issued.ToPhoneNumber2;
            issued.ToEmail = issued.ToEmail;

            issued.PackageType = issued.PackageType;
            issued.TotalPackage = issued.TotalPackage;
            issued.PaymentType = issued.PaymentType;
            issued.PerPackageWeight = issued.PerPackageWeight;
            issued.UnitOfWeight = issued.UnitOfWeight;
            issued.BoxLength = issued.BoxLength;
            issued.BoxWidth = issued.BoxWidth;
            issued.BoxHeight = issued.BoxHeight;
            issued.BoxChargableWeight = issued.BoxChargableWeight;
            issued.InsuredValue = issued.InsuredValue;
            issued.TotalWeight = issued.TotalWeight;
            issued.TotalInsuredValue = issued.TotalInsuredValue;
        return (
            <tr key={index}>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.ShipmentType,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.LocationType,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.DutiesPaidBy,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.FromCountryName,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.FromCountryCode,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.FromCompanyName,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.FromContactName,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.FromAddrerss,
                        }}
                    />
                </td>
                
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.FromCityName,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.FromStateName,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.FromZipCode,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.FromPhoneNumber1,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.FromPhoneNumber2,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.FromEmail,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.ToCountryName,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.ToCountryCode,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.ToCompanyName,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.ToContactName,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.ToAddrerss,
                        }}
                    />
                </td>
                
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.ToCityName,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.ToStateName,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.ToZipCode,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.ToPhoneNumber1,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.ToPhoneNumber2,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.ToEmail,
                        }}
                    />
                </td>

                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.PackageType,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.TotalPackage,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.PaymentType,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.PerPackageWeight,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.UnitOfWeight,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.BoxLength,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.BoxWidth,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.BoxHeight,
                        }}
                    />
                </td>
                
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.BoxChargableWeight,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.InsuredValue,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.TotalWeight,
                        }}
                    />
                </td>
                <td className="wd-80">
                    <CustomInput
                        inputProps={{
                            disabled : true,
                            value: issued.TotalInsuredValue,
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
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.ShipmentType,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.LocationType,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.DutiesPaidBy,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.FromCountryName,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.FromCountryCode,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.FromCompanyName,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.FromContactName,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.FromAddrerss,
                            }}
                        />
                    </td>
                    
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.FromCityName,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.FromStateName,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.FromZipCode,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.FromPhoneNumber1,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.FromPhoneNumber2,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.FromEmail,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.ToCountryName,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.ToCountryCode,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.ToCompanyName,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.ToContactName,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.ToAddrerss,
                            }}
                        />
                    </td>
                    
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.ToCityName,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.ToStateName,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.ToZipCode,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.ToPhoneNumber1,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.ToPhoneNumber2,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.ToEmail,
                            }}
                        />
                    </td>
    
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.PackageType,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.TotalPackage,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.PaymentType,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.PerPackageWeight,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.UnitOfWeight,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.BoxLength,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.BoxWidth,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.BoxHeight,
                            }}
                        />
                    </td>
                    
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.BoxChargableWeight,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.InsuredValue,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.TotalWeight,
                            }}
                        />
                    </td>
                    <td className="wd-80">
                        <CustomInput
                            inputProps={{
                                disabled : true,
                                value: issued.TotalInsuredValue,
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
            obj.ShipmentType = this.state.ExcelJSONData[j]["ShipmentType"];
            obj.LocationType = this.state.ExcelJSONData[j]["LocationType"];
            obj.DutiesPaidBy = this.state.ExcelJSONData[j]["DutiesPaidBy"];
            obj.FromCountryName = this.state.ExcelJSONData[j]["FromCountryName"];
            obj.FromCountryCode = this.state.ExcelJSONData[j]["FromCountryCode"];
            obj.FromCompanyName = this.state.ExcelJSONData[j]["FromCompanyName"];
            obj.FromContactName = this.state.ExcelJSONData[j]["FromContactName"];
            obj.FromAddrerss = this.state.ExcelJSONData[j]["FromAddrerss"];
            obj.FromCityName = this.state.ExcelJSONData[j]["FromCityName"];
            obj.FromStateName = this.state.ExcelJSONData[j]["FromStateName"];
            obj.FromZipCode = this.state.ExcelJSONData[j]["FromZipCode"];
            obj.FromPhoneNumber1 = this.state.ExcelJSONData[j]["FromPhoneNumber1"];
            obj.FromPhoneNumber2 = this.state.ExcelJSONData[j]["FromPhoneNumber2"];
            obj.FromEmail = this.state.ExcelJSONData[j]["FromEmail"];
            
            obj.ToCountryName = this.state.ExcelJSONData[j]["ToCountryName"];
            obj.ToCountryCode = this.state.ExcelJSONData[j]["ToCountryCode"];
            obj.ToCompanyName = this.state.ExcelJSONData[j]["ToCompanyName"];
            obj.ToContactName = this.state.ExcelJSONData[j]["ToContactName"];
            obj.ToAddrerss = this.state.ExcelJSONData[j]["ToAddrerss"];
            obj.ToCityName = this.state.ExcelJSONData[j]["ToCityName"];
            obj.ToStateName = this.state.ExcelJSONData[j]["ToStateName"];
            obj.ToZipCode = this.state.ExcelJSONData[j]["ToZipCode"];
            obj.ToPhoneNumber1 = this.state.ExcelJSONData[j]["ToPhoneNumber1"];
            obj.ToPhoneNumber2 = this.state.ExcelJSONData[j]["ToPhoneNumber2"];
            obj.ToEmail = this.state.ExcelJSONData[j]["ToEmail"];

            obj.PackageType = this.state.ExcelJSONData[j]["PackageType"];
            obj.TotalPackage = this.state.ExcelJSONData[j]["TotalPackage"];
            obj.PaymentType = this.state.ExcelJSONData[j]["PaymentType"];
            obj.PerPackageWeight = this.state.ExcelJSONData[j]["PerPackageWeight"];
            obj.UnitOfWeight = this.state.ExcelJSONData[j]["UnitOfWeight"];
            obj.BoxLength = this.state.ExcelJSONData[j]["BoxLength"];
            obj.BoxWidth = this.state.ExcelJSONData[j]["BoxWidth"];
            obj.BoxHeight = this.state.ExcelJSONData[j]["BoxHeight"];
            obj.BoxChargableWeight = this.state.ExcelJSONData[j]["BoxChargableWeight"];
            obj.InsuredValue = this.state.ExcelJSONData[j]["InsuredValue"];
            obj.TotalWeight = this.state.ExcelJSONData[j]["TotalWeight"];
            obj.TotalInsuredValue = this.state.ExcelJSONData[j]["TotalInsuredValue"];
            finalJson.push(obj);
        }
        let data = {
            paymentIssued : finalJson,
            userid : CommonConfig.loggedInUserData().PersonID,
        }
        this.showLoader();
        try{
            api.post("scheduleshipment/InsertBulkShipment",data).then(res => {
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
                        <h4 className="margin-right-auto text-color-black">Bulk Shipment Import</h4>
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
                            <h3>Shipment Imported Successfully</h3>
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
                                Import Shipments
                            </h4>
                        </CardHeader>
                        <CardBody className="shipment-cardbody">
                            <GridContainer className="MuiGrid-justify-xs-center">
                            <GridItem xs={12} sm={12} md={12}>
                                <div className="scroll">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Shipment Type</th>
                                        <th>Location Type</th>
                                        <th>Duties Paid By</th>
                                        <th>From Country Name</th>
                                        <th>From Country Code</th>
                                        <th>From Company Name</th>
                                        <th>From Contact Name</th>
                                        <th>From Addrerss</th>
                                        <th>From City Name</th>
                                        <th>From State Name</th>
                                        <th>From Zip Code</th>
                                        <th>From Phone Number 1</th>
                                        <th>From Phone Number 2</th>
                                        <th>From Email</th>
                                        <th>To Country Name</th>
                                        <th>To Country Code</th>
                                        <th>To Company Name</th>
                                        <th>To Contact Name</th>
                                        <th>To Addrerss</th>
                                        <th>To City Name</th>
                                        <th>To State Name</th>
                                        <th>To Zip Code</th>
                                        <th>To Phone Number 1</th>
                                        <th>To Phone Number 2</th>
                                        <th>To Email</th>
                                        <th>Package Type</th>
                                        <th>Total Package</th>
                                        <th>Payment Type</th>
                                        <th>Per Package Weight</th>
                                        <th>Unit Of Weight</th>
                                        <th>Box Length</th>
                                        <th>Box Width</th>
                                        <th>Box Height</th>
                                        <th>Chargable Weight</th>
                                        <th>Insured Value</th>
                                        <th>Total Weight</th>
                                        <th>Total Insured Value</th>
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
                                  <div className="scroll">
                                    <table>
                                        <thead>
                                        <tr>
                                        <th>Shipment Type</th>
                                        <th>Location Type</th>
                                        <th>Duties Paid By</th>
                                        <th>From Country Name</th>
                                        <th>From Country Code</th>
                                        <th>From Company Name</th>
                                        <th>From Contact Name</th>
                                        <th>From Addrerss</th>
                                        <th>From City Name</th>
                                        <th>From State Name</th>
                                        <th>From Zip Code</th>
                                        <th>From Phone Number 1</th>
                                        <th>From Phone Number 2</th>
                                        <th>From Email</th>
                                        <th>To Country Name</th>
                                        <th>To Country Code</th>
                                        <th>To Company Name</th>
                                        <th>To Contact Name</th>
                                        <th>To Addrerss</th>
                                        <th>To City Name</th>
                                        <th>To State Name</th>
                                        <th>To Zip Code</th>
                                        <th>To Phone Number 1</th>
                                        <th>To Phone Number 2</th>
                                        <th>To Email</th>
                                        <th>Package Type</th>
                                        <th>Total Package</th>
                                        <th>Payment Type</th>
                                        <th>Per Package Weight</th>
                                        <th>Unit Of Weight</th>
                                        <th>Box Length</th>
                                        <th>Box Width</th>
                                        <th>Box Height</th>
                                        <th>Chargable Weight</th>
                                        <th>Insured Value</th>
                                        <th>Total Weight</th>
                                        <th>Total Insured Value</th>
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
                                    Upload New File
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
                                    Upload New File
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
    
 
export default BulkShipmentImport;