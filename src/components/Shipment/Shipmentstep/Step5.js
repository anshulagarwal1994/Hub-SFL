/*eslint-disable*/
import React, { Component } from 'react';
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import CloseIcon from "@material-ui/icons/Close";
import Button from "components/CustomButtons/Button.js";
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from "@material-ui/icons/Done";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import api from '../../../utils/apiClient';
import { green } from "@material-ui/core/colors";
import { red } from "@material-ui/core/colors";
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
// material ui icons
import { CommonConfig } from "utils/constant";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ReactTable from "react-table";
import moment from 'moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
const useStyles = makeStyles(styles);

class Step5 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trackingNumberList: [],
      ServiceList: [],
      SubServiceList: [],
      activeInactive:[
        {value:"Active",label:"Active"},
        {value:"Inactive",label:"Inactive"} 
      ]

    };

  }

  getService() {
    try {
      api.get("userManagement/getServiceName").then(result => {
        if (result.success) {
          this.setState({ ServiceList: result.data.ServiceName, SubServiceList: result.data.SubServiceName });
        }
      }).catch(err => {
        console.log(err);
      })
    }
    catch (err) {
      console.log("error", err);
    }
  }

  sendState() {
    return this.state;
  }


  async componentDidMount() {
    await this.getService();
    this.addnewRowTrackingNumber();

  }

  removeTrackingNumber = (index) => {
    var trackingNumberList = this.state.trackingNumberList;
    trackingNumberList.splice(index, 1);
    this.setState({ trackingNumberList: trackingNumberList });
  }

  addnewRowTrackingNumber = () => {
    const row = {
      tracking_id: '',
      Carrier: '',
      Type: '',
      Comments: '',
      Added_by: CommonConfig.loggedInUserData().Name
    }
    this.setState({ trackingNumberList: [...this.state.trackingNumberList, row] });
  }

  activeInactive = () => {
    return this.state.activeInactive.map( content =>{
        return(
            <MenuItem classes={{root: useStyles.selectMenuItem}} value={content.value} > {content.label}  </MenuItem> 
        )
    })
}

  viewTrackingNumber = () => {
    const serviceName = this.state.ServiceList.map(type => { return { value: type.MainServiceName, label: type.MainServiceName } });
    const subServiceName = this.state.SubServiceList.map(type => { return { value: type.ServiceName, label: type.ServiceName } });
    return this.state.trackingNumberList.map((trackingnumber, idx) => {
      return (

        <tr>
          <td className="text-align-right">

            <CustomInput
              id="proposaltype"
              inputProps={{
                value: idx + 1
              }}
            />
          </td>
          <td>

            <CustomInput
              id="proposaltype"
              
              inputProps={{
                disabled: true,
                value: moment().format(CommonConfig.dateFormat.dateOnly),
                onChange: event => this.change(event, "Username"),
                // endAdornment: (
                //   <InputAdornment
                //     position="end"
                //     className={classes.inputAdornment}
                //   >
                //     <Icon className={classes.User}>
                //       person
                //                                             </Icon>
                //   </InputAdornment>
                // )
              }}
            />
          </td>
          <td className="text-align-right">

            <CustomInput
              id="proposaltype"
              type="number"
              inputProps={{
                value: trackingnumber.tracking_id
              }}
            />
          </td>
          <td>
            <div>
            <Autocomplete
              id="combo-box-demo"
              options={serviceName}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => <TextField {...params} />}
            >
            </Autocomplete>
            </div>
            {/* <CustomInput
              id="proposaltype"
              type="number"
              inputProps={{
                value: trackingnumber.Carrier
              }}
            /> */}
          </td>
          <td className="text-align-right">

            <CustomInput
              id="proposaltype"
              type="number"
              inputProps={{
                value: trackingnumber.Comments
              }}
            />
          </td>
          <td className="text-align-right">
{/* 
            <CustomInput
              id="proposaltype"
              type="number"
              inputProps={{
                disabled:true,
                value: 
              }}
            /> */}
            <span>{trackingnumber.Added_by}</span>
          </td>
          <td>
                    <div className="table-select">
                        <FormControl className={useStyles.formControl} fullWidth> 
                        <Select id="package_number" name="package_number" className="form-control" onChange={() => this.handleChangePackagecontent()}>
                            {this.activeInactive()}</Select>
                        </FormControl>
                    </div>
                </td>
          <td>
            <Button justIcon color="danger"  className="Plus-btn" onClick={() => this.removeTrackingNumber(idx)}>
              <i className={"fas fa-minus"} />
            </Button>
            {this.state.trackingNumberList.length === idx + 1 ?
              <Button justIcon color="facebook" onClick={() => this.addnewRowTrackingNumber()} className="Plus-btn ">
                <i className={"fas fa-plus"} />
              </Button>
              : null
            } </td>
        </tr>
      )
    })
  }


  handleSave = () => {
    console.log("Step5.......");
  }

  render() {
    const { usernameErr } = this.state;
    const { emailErr } = this.state;
    const { mobileErr } = this.state;
    const { passwordErr } = this.state;
    const { checkPassword } = this.state;
    const { checkNumber } = this.state;
    const { checkUpperCase } = this.state;
    const { checkLowerCase } = this.state;
    const { checkSpecialCharacter } = this.state;



    return (
      <div>
        <GridContainer className="MuiGrid-justify-xs-center">
          <GridItem xs={12} sm={12} md={12}>
            <div className="package-table">
              <table>
                <thead>
                  <tr>
                    			
                    <th>Number</th>
                    <th>Date</th>
                    <th>Tracking Id</th>
                    <th>Carrier</th>
                    <th>Comments</th>
                    <th>Added by</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* <tr>
                    <td className="text-align-right">1</td>
                    <td>Clothes</td>
                    <td className="text-align-right">10</td>
                    <td className="text-align-right">$3.00</td>
                    <td className="text-align-right">$30.00</td>
                  </tr> */}
                  {this.viewTrackingNumber()}
                </tbody>
              </table>
            </div>
          </GridItem>
        </GridContainer>
        {/* <GridContainer className="MuiGrid-justify-xs-center">
          <GridItem xs={12} sm={12} md={12}>
            <h3>Tracking Number</h3>
            <div className="package-table">
              <table>
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Date</th>
                    <th>Tracking Id</th>
                    <th>Carrier</th>
                    <th>Type</th>
                    <th>Comments</th>
                    <th>Added by</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>02-05-2020 08:30AM</td>
                    <td>1510312424</td>
                    <td>SFL Worldwode</td>
                    <td>Master</td>
                    <td></td>
                    <td>Purveen S.</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>02-05-2020 08:30AM</td>
                    <td>1510312424</td>
                    <td>Bombino Express</td>
                    <td>Master</td>
                    <td></td>
                    <td>Purveen S.</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>02-05-2020 08:30AM</td>
                    <td>1510312424</td>
                    <td>UPS</td>
                    <td>Child</td>
                    <td></td>
                    <td>Purveen S.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </GridItem>
        </GridContainer> */}
        <GridContainer className="MuiGrid-justify-xs-center">
          <GridItem xs={12} sm={12} md={12}>
            <h3>Tracking Details</h3>
            <div className="package-table">
              <table>
                <thead>
                  <tr>
                    <th>Actual Date</th>
                    <th>Online Date</th>
                    <th>Updates</th>
                    <th>Added by</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>02-05-2020 12:00AM</td>
                    <td>02-05-2020 05:30PM</td>
                    <td>Prepaid shipping label send to shipper</td>
                    <td>Purveen S</td>
                  </tr>
                  <tr>
                    <td>02-05-2020 12:00AM</td>
                    <td>02-05-2020 05:30PM</td>
                    <td>Shipment drop off at drop off location</td>
                    <td>Purveen S</td>
                  </tr>
                  <tr>
                    <td>02-05-2020 12:00AM</td>
                    <td>02-05-2020 05:30PM</td>
                    <td>Delivered</td>
                    <td>Purveen S</td>
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

Step5.propTypes = {
  classes: PropTypes.object
};

export default withStyles()(Step5);
