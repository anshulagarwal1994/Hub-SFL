import React, { Component } from "react";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import GetRatesWizard from "../GetRates/GetRatesWizard";
import Step1 from "./Getratestep/Step1.js";
import Step2 from "./Getratestep/Step2.js";

class GetRates extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <GridContainer className="UserList-outer">
        <GridItem xs={12} sm={12} md={12}>
          <GridContainer
            justify="center"
            className="schedule-pickup-main-outer"
          >
            <GridItem xs={12} sm={12}>
              <GetRatesWizard
                className="mb-0"
                steps={[
                  {
                    stepName: "Air / Ground",
                    stepComponent: Step1,
                    stepId: "getRateAir",
                  },
                  {
                    stepName: "Ocean",
                    stepComponent: Step2,
                    stepId: "getRateOcean",
                  },
                ]}
                props={this.props}
              />
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
    );
  }
}

export default GetRates;
