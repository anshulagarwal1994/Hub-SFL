import React, { Component } from "react";
import Wizard from "components/Wizard/Wizard.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import Adduser from "@material-ui/icons/AccountCircle";

import Step1 from "./Adduserstep/Step1";
import Step2 from "./Adduserstep/Step2";
import Step3 from "./Adduserstep/Step3";

class AddUser extends Component {
  render() {
    return (
      <GridContainer justify="center" className="schedule-pickup-main-outer">
        <GridItem xs={12} sm={12}>
          <Card>
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <Adduser />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">
                {!this.props.match.params.id ? "Add User" : "Edit User"}
              </h4>
            </CardHeader>
            <Wizard
              steps={[
                {
                  stepName: "User Details",
                  stepComponent: Step1,
                  stepId: "userdetails",
                  props: this.props,
                },
                {
                  stepName: "Access Details",
                  stepComponent: Step2,
                  stepId: "accessdetails",
                },
                {
                  stepName: "Markup Details",
                  stepComponent: Step3,
                  stepId: "markupdetails",
                },
              ]}
              title=""
              subtitle=""
              match={this.props.match}
            />
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default AddUser;
