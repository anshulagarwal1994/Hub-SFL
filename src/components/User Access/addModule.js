import React, { Component } from 'react';
import {CommonConfig} from '../../utils/constant';
import api from '../../utils/apiClient';
import cogoToast from "cogo-toast";
import FormControl from '@material-ui/core/FormControl';
import CardIcon from "components/Card/CardIcon.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import HeadsetMic from "@material-ui/icons/HeadsetMic";
import CardHeader from "components/Card/CardHeader.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import TextField from "@material-ui/core/TextField";
import Button from "components/CustomButtons/Button.js";

class addModule extends Component {
    constructor(props){
        super(props);
        this.state = {
            ModuleID:"",
            moduleidErr:false,
            moduleidHelperText:"",

            ModuleName:"",
            modulenameErr:false,
            modulenameHelperText:"",

            ReadAccess:0,
            readaccessErr:false,
            readaccessHelperText:"",

            WriteAccess:0,
            writeaccessErr:false,
            writeaccessHelperText:"",

            DeleteAccess:0,
            deleteaccessErr:false,
            deleteaccessHelperText:"",

            AllAccess:0,
            allaccessErr:false,
            allaccessHelperText:"",



        };
    }

    validate = () => {
      const {WriteAccess , DeleteAccess  , ReadAccess , ModuleID , ModuleName , AllAccess} = this.state;
      let IsValid = true;
      if(CommonConfig.isEmpty(DeleteAccess)){
        IsValid = false
        this.setState({deleteaccessErr:true , deleteaccessHelperText:"Please enter delete access"});
      }
      if(CommonConfig.isEmpty(WriteAccess)){
        IsValid = false
        this.setState({writeaccessErr:true , writeaccessHelperText:"Please enter write access"});
      }
      if(CommonConfig.isEmpty(ModuleID)){
        IsValid = false
        this.setState({moduleidErr:true , moduleidHelperText:"Please enter module id"});
      }
      if(CommonConfig.isEmpty(ModuleName)){
        IsValid = false
        this.setState({modulenameErr:true , modulenameHelperText:"Please enter module name"});
      }
      if(CommonConfig.isEmpty(ReadAccess)){
        IsValid = false
        this.setState({readaccessErr:true, readaccessHelperText:"Please enter read access"});
      }
      if(CommonConfig.isEmpty(AllAccess)){
        IsValid = false
        this.setState({allaccessErr:true, allaccessHelperText:"Please enter all access"});
      }
    
      return (IsValid);
    }

    onChange = (e,type) => {
      if(type === "deleteaccess"){
        if(CommonConfig.isEmpty(e.target.value)){
          this.setState({DeleteAccess:e.target.value , deleteaccessErr:true , deleteaccessHelperText:"Please enter delete access"});
        }
        else{
          this.setState({DeleteAccess:e.target.value , deleteaccessErr:false , deleteaccessHelperText:""});
        }
      }

      else if(type === "readaccess"){
        if(CommonConfig.isEmpty(e.target.value)){
          this.setState({ReadAccess:e.target.value , readaccessErr:true , readaccessHelperText:"Please enter read access"});
        }
        else{
          this.setState({ReadAccess:e.target.value , readaccessErr:false , readaccessHelperText:""});
        }
  
      }

      else if(type === "writeaccess"){
        if(CommonConfig.isEmpty(e.target.value)){
          this.setState({WriteAccess:e.target.value , writeaccessErr:true , writeaccessHelperText:"Please enter write access"});
        }
        else{
          this.setState({WriteAccess:e.target.value , writeaccessErr:false , writeaccessHelperText:""});
        }
  
      }
      
      else if(type === "moduleid"){
        if(CommonConfig.isEmpty(e.target.value)){
          this.setState({ModuleID:e.target.value , moduleidErr:true , moduleidHelperText:"Please enter module id"});
        }
        else{
          this.setState({ModuleID:e.target.value , moduleidErr:false , moduleidHelperText:""});
        }
  
      }
      
      else if(type === "modulename"){
        if(CommonConfig.isEmpty(e.target.value)){
          this.setState({ModuleName:e.target.value , modulenameErr:true , modulenameHelperText:"Please enter module name"});
        }
        else{
          this.setState({ModuleName:e.target.value , modulenameErr:false , modulenameHelperText:""});
        }
  
      }
      
      else if(type === "allaccess"){
        if(CommonConfig.isEmpty(e.target.value)){
          this.setState({AllAccess:e.target.value , allaccessErr:true , allaccessHelperText:"Please enter all access"});
        }
        else{
          this.setState({AllAccess:e.target.value , allaccessErr:false , allaccessHelperText:""});
        }
  
      }

    }

    submit = (e) => {

      if(this.validate()){
        
      let data = {
        ModuleID:this.state.ModuleID,
        ModuleName:this.state.ModuleName,
        ReadAccess:this.state.ReadAccess,
        DeleteAccess:this.state.DeleteAccess,
        WriteAccess:this.state.WriteAccess,
        AllAccess:this.state.AllAccess,
        SortOrder:null,
        userId:CommonConfig.loggedInUserData().PersonID
      }
      try{
        
          api.post("authentication/addModule",data).then(res => {
            if(res.success){
              cogoToast.success("Module Added Successful");
            }
            else{
              cogoToast.error("Something went wrong");
            }
          });
      }

      catch(err){
      }
    }
    else{
      cogoToast.error("Please correct error and resubmit form");
    }

    }

    render(){
        const {ModuleID , moduleidErr , moduleidHelperText , ModuleName , modulenameErr , modulenameHelperText , 
              DeleteAccess ,deleteaccessErr , deleteaccessHelperText ,WriteAccess , writeaccessErr , writeaccessHelperText , 
              ReadAccess ,readaccessErr , AllAccess , allaccessErr ,allaccessHelperText  } = this.state;
        return(
          <GridContainer className="UserList-outer">
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader className="btn-right-outer" color="primary" icon>
                  <CardIcon color="primary">
                      <HeadsetMic />
                  </CardIcon>
                  <h4>Add Module</h4>
                </CardHeader>
                <CardBody>
                  <GridContainer justify="center">
                    <GridItem xs={6}>
                      <FormControl>
                        <TextField
                          value={ModuleID}
                          error={moduleidErr}
                          helperText={moduleidHelperText}
                          label="Module ID"
                          onChange={(e) => this.onChange(e,"moduleid")}
                        />
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <GridContainer justify="center">
                    <GridItem xs={6}>
                      <FormControl>
                        <TextField
                          value={ModuleName}
                          error={modulenameErr}
                          helperText={modulenameHelperText}
                          label="Module Name"
                          onChange={(e) => this.onChange(e,"modulename")}
                        />
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <GridContainer justify="center">
                    <GridItem xs={6}>
                      <FormControl>
                        <TextField
                          value={DeleteAccess}
                          error={deleteaccessErr}
                          helperText={deleteaccessHelperText}
                          label="Delete Access"
                          onChange={(e) => this.onChange(e,"deleteaccess")}
                        />
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <GridContainer justify="center">
                    <GridItem xs={6}>
                      <FormControl>
                        <TextField
                          value={WriteAccess}
                          error={writeaccessErr}
                          helperText={writeaccessHelperText}
                          label="Write Access"
                          onChange={(e) => this.onChange(e,"writeaccess")}
                        />
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <GridContainer justify="center">
                    <GridItem xs={6}>
                      <FormControl>
                        <TextField
                          type="readaccess"
                          error={readaccessErr}
                          helperText={modulenameHelperText}
                          value={ReadAccess}
                          label="Read Access"
                          onChange={(e) => this.onChange(e,"readaccess")}
                        />
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <GridContainer justify="center">
                    <GridItem xs={6}>
                      <FormControl>
                        <TextField
                          type="allaccess"
                          error={allaccessErr}
                          helperText={allaccessHelperText}
                          value={AllAccess}
                          label="All Access"
                          onChange={(e) => this.onChange(e,"allaccess")}
                        />
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <GridContainer justify="center">
                    <GridItem xs={6}>
                      <Button type="primary" onClick={(e)=>this.submit(e)} className="width-150 mr-4" htmlType="submit">
                        Add Module
                      </Button>
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        );
    }

}
export default addModule;