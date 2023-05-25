import React , { Component } from "react";
import VendorWizard from "components/Management/Vendor/VendorWizard";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import Adduser from "@material-ui/icons/AccountCircle";
import Step1 from "../Management/Vendor/VendorSteps/Step1";
import Step2 from "../Management/Vendor/VendorSteps/Step2";
import {CommonConfig} from '../../utils/constant';

class Adduserstep extends Component{
  
  render(){

     const{history} = this.props;
     const vendorId = !CommonConfig.isEmpty(history.location.state) ? history.location.state.vendorId : '';

      return (
        <GridContainer justify="center" className="EditVendor-mian-outer">
          <GridItem xs={12} sm={12}>
            <Card>
              <CardHeader className="btn-right-outer" color="primary" icon>
                <CardIcon color="primary">
                  <Adduser />
                </CardIcon>
                  <h4 className="margin-right-auto text-color-black">{CommonConfig.isEmpty(vendorId) ? 'Add Vendor' : 'Edit Vendor'}</h4>
              </CardHeader>
              <VendorWizard
                validate 
                steps={[
                  { stepName: "Vendor Details", stepComponent: Step1, stepId: "vendordetails" },
                  { stepName: "Contact Details", stepComponent: Step2, stepId: "contactdetails" },
                ]}
                history = {this.props.history}
                title = ""
                subtitle = ""
              />
            </Card>
          </GridItem>
        </GridContainer>
      );
  }
}

export default Adduserstep;