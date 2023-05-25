import React, { Component } from "react";

// core components
import Wizard from "components/Wizard/Wizard.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Step1 from "./Scheduleshipmentstep/Step1.js";
import Step2 from "./Scheduleshipmentstep/Step2.js";
import Step3 from "./Scheduleshipmentstep/Step3.js";
import Step4 from "./Scheduleshipmentstep/Step4";
//import step4_2 from "./Scheduleshipmentstep/Step4(2).js";
import Step5 from "./Scheduleshipmentstep/Step5.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import FlightTakeoff from "@material-ui/icons/FlightTakeoff";

class Scheduleshipment extends Component {
  render() {
    return (
      <GridContainer justify="center" className="schedule-pickup-main-outer">
        <GridItem xs={12} sm={12}>
          <Card>
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <FlightTakeoff />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">
                Schedule Shipment
              </h4>
            </CardHeader>
            <Wizard
              validate
              steps={[
                {
                  stepName: "Schedule Pickup",
                  stepComponent: Step1,
                  stepId: "schedulepickup",
                },
                {
                  stepName: "Sender",
                  stepComponent: Step2,
                  stepId: "senderinformation",
                },
                {
                  stepName: "Recipient",
                  stepComponent: Step3,
                  stepId: "recipientinformation",
                },
                {
                  stepName: "Package",
                  stepComponent: Step4,
                  stepId: "packagedetails",
                },
                // {
                //   stepName: "Service",
                //   stepComponent: step4_2,
                //   stepId: "servicedetails",
                // },
                {
                  stepName: "Payment",
                  stepComponent: Step5,
                  stepId: "paymentdetails",
                },
              ]}
              props={this.props}
              title=""
              subtitle=""
            />
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default Scheduleshipment;
