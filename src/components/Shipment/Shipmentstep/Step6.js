/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// material ui icons

const useStyles = makeStyles(styles);
const classes = () => {
  return useStyles();
};

class Step6 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  sendState() {
    return this.state;
  }

  render() {
    return (
      <div>
        <GridContainer className="MuiGrid-justify-xs-center">
          <GridItem xs={12} sm={12} md={12}>
            <div className="package-table">
              <h3>Insurance</h3>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Insurance Provider</th>
                    <th>Insurance Type</th>
                    <th>Insurance Amount</th>
                    <th>Premium (%)</th>
                    <th>Deductible Amount</th>
                    <th>Minumum Premium</th>
                    <th>Preminum Amount</th>
                    <th>Expiry Date</th>
                    <th>Added by</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>15-02-2020</td>
                    <td>SFL Worldwide</td>
                    <td>All Risk Insurance</td>
                    <td>$2,000</td>
                    <td>5</td>
                    <td>$500</td>
                    <td>$1,000</td>
                    <td>$100.00</td>
                    <td>15-02-2021</td>
                    <td>Purveen Shah</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="package-table">
              <h3>Claims</h3>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Tracking Number</th>
                    <th>Are You?</th>
                    <th>Amount Requested</th>
                    <th>Amount Adjusted</th>
                    <th>Amount Status</th>
                    <th>Follow Up Date</th>
                    <th>Comments</th>
                    <th>Desired Resolution</th>
                    <th>View Attachment</th>
                    <th>Claims Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>10-02-2020</td>
                    <td>1510325324</td>
                    <td>Sender</td>
                    <td>$100</td>
                    <td>$75.00</td>
                    <td>Payable</td>
                    <td>05-02-2020</td>
                    <td>Click Here</td>
                    <td>Click Here</td>
                    <td>Click Here</td>
                    <td>Approved</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Step6.propTypes = {
  classes: PropTypes.object,
};

export default withStyles()(Step6);
