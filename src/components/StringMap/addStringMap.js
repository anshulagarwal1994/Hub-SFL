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

class AddStringMap extends Component {
    constructor(props){
        super(props);
        this.state = {
            StringMapType:"",
            stringmaptypeErr:false,
            stringmaptypehelperText:"",

            StringMapKey:"",
            stringmapkeyErr:false,
            stringmapkeyhelperText:"",

            StringMapName:"",
            stringmapErr:false,
            stringmapkeyhelperText:"",

            Description:"",
            descriptionErr:false,
            descriptionhelperText:"",

            ExtDescription:"",
            extErr:false,
            exthelperText:"",


        };
    }

    validate = () => {
      const {Description , ExtDescription  , StringMapName , StringMapType , StringMapKey} = this.state;
      let IsValid = true;
      if(CommonConfig.isEmpty(ExtDescription)){
        IsValid = false
        this.setState({extErr:true , exthelperText:"Please enter ext description"});
      }
      if(CommonConfig.isEmpty(Description)){
        IsValid = false
        this.setState({descriptionErr:true , descriptionhelperText:"Please enter description"});
      }
      if(CommonConfig.isEmpty(StringMapType)){
        IsValid = false
        this.setState({stringmaptypeErr:true , stringmaptypehelperText:"Please enter stringmaptype"});
      }
      if(CommonConfig.isEmpty(StringMapKey)){
        IsValid = false
        this.setState({stringmapkeyErr:true , stringmapkeyhelperText:"Please enter stringmapkey"});
      }
      if(CommonConfig.isEmpty(StringMapName)){
        IsValid = false
        this.setState({stringmapErr:true, stringmapkeyhelperText:"Please enter stringmapname"});
      }
    
      return (IsValid);
    }

    onChange = (e,type) => {
      if(type === "ext"){
        if(CommonConfig.isEmpty(e.target.value)){
          this.setState({ExtDescription:e.target.value , extErr:true , exthelperText:"Please enter ext description"});
        }
        else{
          this.setState({ExtDescription:e.target.value , extErr:false , exthelperText:""});
        }
      }

      else if(type === "stringmapname"){
        if(CommonConfig.isEmpty(e.target.value)){
          this.setState({StringMapName:e.target.value , stringmapErr:true , stringmapkeyhelperText:"Please enter stringmapname"});
        }
        else{
          this.setState({StringMapName:e.target.value , stringmapErr:false , stringmapkeyhelperText:""});
        }
  
      }

      else if(type === "description"){
        if(CommonConfig.isEmpty(e.target.value)){
          this.setState({Description:e.target.value , descriptionErr:true , descriptionhelperText:"Please enter description number"});
        }
        else{
          this.setState({Description:e.target.value , descriptionErr:false , descriptionhelperText:""});
        }
  
      }
      
      else if(type === "stringmaptype"){
        if(CommonConfig.isEmpty(e.target.value)){
          this.setState({StringMapType:e.target.value , stringmaptypeErr:true , stringmaptypehelperText:"Please enter first name"});
        }
        else{
          this.setState({StringMapType:e.target.value , stringmaptypeErr:false , stringmaptypehelperText:""});
        }
  
      }
      
      else if(type === "stringmapkey"){
        if(CommonConfig.isEmpty(e.target.value)){
          this.setState({StringMapKey:e.target.value , stringmapkeyErr:true , stringmapkeyhelperText:"Please enter stringmapkey"});
        }
        else{
          this.setState({StringMapKey:e.target.value , stringmapkeyErr:false , stringmapkeyhelperText:""});
        }
  
      }

    }

    submit = (e) => {

      if(this.validate()){
        
      let data = {
        StringMapType:this.state.StringMapType,
        StringMapKey:this.state.StringMapKey,
        StringMapName:this.state.StringMapName,
        ExtDescription:this.state.ExtDescription,
        Description:this.state.Description,
        SortOrder:null,
        IsSystemCode:true,
        UserID:CommonConfig.loggedInUserData().PersonID
      }
      try{
        
          api.post("stringMap/addUpdateStringMap",data).then(res => {
            if(res.success){
              cogoToast.success("StringMap Added Successful");
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
        const {StringMapType , stringmaptypeErr , stringmaptypehelperText , StringMapKey , stringmapkeyErr , stringmapkeyhelperText , 
              ExtDescription ,extErr , exthelperText ,Description , descriptionErr , descriptionhelperText , 
              StringMapName ,stringmapErr  } = this.state;
        return(
          <GridContainer className="UserList-outer">
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader className="btn-right-outer" color="primary" icon>
                  <CardIcon color="primary">
                      <HeadsetMic />
                  </CardIcon>
                  <h4>AddStringMap</h4>
                </CardHeader>
                <CardBody>
                  <GridContainer justify="center">
                    <GridItem xs={6}>
                      <FormControl>
                        <TextField
                          value={StringMapType}
                          error={stringmaptypeErr}
                          helperText={stringmaptypehelperText}
                          label="StringMap Type"
                          onChange={(e) => this.onChange(e,"stringmaptype")}
                        />
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <GridContainer justify="center">
                    <GridItem xs={6}>
                      <FormControl>
                        <TextField
                          value={StringMapKey}
                          error={stringmapkeyErr}
                          helperText={stringmapkeyhelperText}
                          label="StringMap Key"
                          onChange={(e) => this.onChange(e,"stringmapkey")}
                        />
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <GridContainer justify="center">
                    <GridItem xs={6}>
                      <FormControl>
                        <TextField
                          value={ExtDescription}
                          error={extErr}
                          helperText={exthelperText}
                          label="ExtDescription"
                          onChange={(e) => this.onChange(e,"ext")}
                        />
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <GridContainer justify="center">
                    <GridItem xs={6}>
                      <FormControl>
                        <TextField
                          value={Description}
                          error={descriptionErr}
                          helperText={descriptionhelperText}
                          label="Description"
                          onChange={(e) => this.onChange(e,"description")}
                        />
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <GridContainer justify="center">
                    <GridItem xs={6}>
                      <FormControl>
                        <TextField
                          type="stringmapname"
                          error={stringmapErr}
                          helperText={stringmapkeyhelperText}
                          value={StringMapName}
                          label="StringMapName"
                          onChange={(e) => this.onChange(e,"stringmapname")}
                        />
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <GridContainer justify="center">
                    <GridItem xs={6}>
                      <Button type="primary" onClick={(e)=>this.submit(e)} className="width-150 mr-4" htmlType="submit">
                        Add StringMap
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
export default AddStringMap;