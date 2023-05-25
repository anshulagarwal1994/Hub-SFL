import React, { Children, Component } from "react";

import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
// import InputAdornment from "@material-ui/core/InputAdornment";
// import InputLabel from "@material-ui/core/InputLabel";
// import Select from "@material-ui/core/Select";
// import api from "../../../utils/apiClient";
// import { CommonConfig } from "../../../utils/constant";
// import cogoToast from "cogo-toast";
// import Autocomplete from "@material-ui/lab/Autocomplete";
// import FormHelperText from "@material-ui/core/FormHelperText";
// import FormControl from "@material-ui/core/FormControl";
import withStyles from "@material-ui/core/styles/withStyles";
// import Icon from "@material-ui/core/Icon";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
// import TextField from "@material-ui/core/TextField";
// import Datetime from "react-datetime";
// import moment from "moment";
import Button from "components/CustomButtons/Button.js";

// core components
// import GridContainer from "components/Grid/GridContainer.js";
// import GridItem from "components/Grid/GridItem.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
// import SimpleBackdrop from "../../../utils/general";
// // material ui icons

// import MenuItem from "@material-ui/core/MenuItem";
// import Dialog from "@material-ui/core/Dialog";
// import DialogActions from "@material-ui/core/DialogActions";
// import DialogContentText from "@material-ui/core/DialogContentText";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import DialogContent from "@material-ui/core/DialogContent";

const useStyles = makeStyles(styles);
// const classes = () => {
//   return useStyles();
// };

class Scheduleshipment extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="package-table">
        <table>
          <thead>
            <tr>
              <th>Service Type</th>
              <th>Delivery Date</th>
              <th className="tbl-align-right">Rates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SFL Saver</td>
              <td>7 to 14 Days</td>
              <td className="tbl-align-right">$ 37.50</td>
              <td>
                <Button color="success">Book</Button>
              </td>
            </tr>
            <tr>
              <td>Fedex International Priority</td>
              <td>09/05/2022 07:13:18 pm</td>
              <td className="tbl-align-right">$ 38.57</td>
              <td>
                <Button color="success">Book</Button>
              </td>
            </tr>
            <tr>
              <td>Fedex International Economy</td>
              <td>09/05/2022 07:13:18 pm</td>
              <td className="tbl-align-right">$ 39.31</td>
              <td>
                <Button color="success">Book</Button>
              </td>
            </tr>
            <tr>
              <td>DHL Express</td>
              <td>5 Business Days</td>
              <td className="tbl-align-right">$ 47.90</td>
              <td>
                <Button color="success">Book</Button>
              </td>
            </tr>
            <tr>
              <td>UPS Worldwide Saver</td>
              <td>09/12/2022</td>
              <td className="tbl-align-right">$ 69.34</td>
              <td>
                <Button color="success">Book</Button>
              </td>
            </tr>
            {/* <tr>
              <td colspan="4">
                <Button color="success">Book</Button>
              </td>
            </tr> */}
          </tbody>
        </table>
      </div>
    );
  }
}

Scheduleshipment.propTypes = {
  classes: PropTypes.object,
};

export default withStyles()(Scheduleshipment);
