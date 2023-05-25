/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import api from "../../../utils/apiClient";
import { CommonConfig } from "../../../utils/constant";
import cogoToast from "cogo-toast";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles(styles);
const classes = () => {
  return useStyles();
};

class Step3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceList: [],
      simpleSelect: "",
      desgin: false,
      code: false,
      develop: false,
    };
  }
  componentDidMount() {
    this.getServiceList();
  }
  getServiceList() {
    try {
      api
        .get("userManagement/getServiceList")
        .then((res) => {
          if (res.success) {
            this.setState({ serviceList: res.data });
          } else {
            cogoToast.error("Something Went Wrong");
          }
        })
        .catch((err) => {
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {}
  }

  handledInput = (e, id, MarkupType) => {
    let MarkupData = this.state.serviceList;
    let i = MarkupData.findIndex((x) => x.ServiceID === id);

    let x = document.getElementsByTagName("input");
    let val = e.target.value;

    if (CommonConfig.isEmpty(val)) {
      MarkupData[i].Markup = "";
      x[i].className = "form-control is-invalid";
    } else if (CommonConfig.RegExp.onlyNumber.test(val)) {
    } else {
      if (MarkupType === "USD") {
        MarkupData[i].Markup = val;
      } else if (MarkupType === "Percentage" && val < 100) {
        MarkupData[i].Markup = val;
      }
    }
    this.setState({ serviceList: MarkupData });
  };

  handleBlur = (e, id, MarkupType) => {
    let MarkupData = this.state.serviceList;
    let i = MarkupData.findIndex((x) => x.ServiceID === id);

    let x = document.getElementsByTagName("input");
    let val = Math.round(e.target.value).toFixed(2);

    if (CommonConfig.RegExp.onlyDecimal.test(val)) {
      if (MarkupType === "USD") {
        MarkupData[i].Markup = parseFloat(val).toFixed(2);
        x[i].className = "form-control";
      } else if (MarkupType === "Percentage" && val < 100) {
        MarkupData[i].Markup = parseFloat(val).toFixed(2);
        x[i].className = "form-control";
      }
    } else {
      x[i].className = "form-control is-invalid";
    }
    this.setState({ serviceList: MarkupData });
  };

  handledropdown = (e, id) => {
    let serviceNameList = this.state.serviceList;
    let x = serviceNameList.findIndex((x) => x.ServiceID === id);
    serviceNameList[x].MarkupType = e.target.value;
    this.setState({ serviceList: serviceNameList });
  };

  renderMarkup = () => {
    return this.state.serviceList.map((service) => {
      const {
        ServiceID,
        ServiceName,
        DisplayName,
        Markup,
        EnvelopMarkup,
        MarkupType,
      } = service;

      return (
        <tr key={ServiceID}>
          <td>{ServiceName}</td>
          <td>{DisplayName}</td>
          <td>
            <input
              type="text"
              name="Markup"
              id="Markup"
              className="form-control"
              value={Markup}
              onChange={(event) =>
                this.handledInput(event, ServiceID, MarkupType)
              }
              onBlur={(e) => this.handleBlur(e, ServiceID, MarkupType)}
            />
          </td>
          <td>
            <input
              type="text"
              name="EnvelopMarkup"
              id="EnvelopMarkup"
              className="form-control"
              value={EnvelopMarkup}
              onChange={(event) =>
                this.handledInput(event, ServiceID, MarkupType)
              }
              onBlur={(e) => this.handleBlur(e, ServiceID, MarkupType)}
            />
          </td>
          <td>
            <FormControl fullWidth className={classes.selectFormControl}>
              <Select
                MenuProps={{ className: classes.selectMenu }}
                classes={{ select: classes.select }}
                value={MarkupType}
                inputProps={{
                  name: "simpleSelect",
                  id: "simple-select",
                }}
                onChange={(event) => this.handledropdown(event, ServiceID)}
              >
                <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected,
                  }}
                  value="Percentage"
                >
                  Percentage
                </MenuItem>
                <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected,
                  }}
                  value="USD"
                >
                  USD
                </MenuItem>
              </Select>
            </FormControl>
          </td>
        </tr>
      );
    });
  };

  render() {
    return (
      <div>
        <form>
          <GridContainer className="MuiGrid-justify-xs-center">
            <GridItem xs={12} sm={12} md={12}>
              <div className="package-table">
                <table>
                  <thead>
                    <tr>
                      <th>Service Name</th>
                      <th>Display Name</th>
                      <th>Markup</th>
                      <th>Markup Type</th>
                    </tr>
                  </thead>
                  <tbody>{this.renderMarkup()}</tbody>
                </table>
              </div>
            </GridItem>
          </GridContainer>
        </form>
      </div>
    );
  }
}

Step3.propTypes = {
  classes: PropTypes.object,
};

export default withStyles()(Step3);
