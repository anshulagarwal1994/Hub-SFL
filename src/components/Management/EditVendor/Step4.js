/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles(styles);
const classes = () => {
  return useStyles();
};
const handleToggle = (value) => {
  const currentIndex = checked.indexOf(value);
  const newChecked = [...checked];

  if (currentIndex === -1) {
    newChecked.push(value);
  } else {
    newChecked.splice(currentIndex, 1);
  }
  setChecked(newChecked);
};
class Step4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      simpleSelect: "",
      desgin: false,
      code: false,
      develop: false,
    };
  }
  handleSimple = (event) => {
    this.setState({ simpleSelect: event.target.value });
  };
  sendState() {
    return this.state;
  }
  render() {
    const { simpleSelect } = this.state;
    return (
      <div>
        <form>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                labelText={<span>Document Name</span>}
                id="documentname"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  onChange: (event) =>
                    this.change(event, "documentname", "length", 10),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      className={classes.inputAdornment}
                    >
                      <Icon className={classes.User}>location_city</Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                labelText={<span>Document Description</span>}
                id="documentdescription"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  onChange: (event) =>
                    this.change(event, "documentdescription", "length", 10),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      className={classes.inputAdornment}
                    >
                      <Icon className={classes.User}>location_city</Icon>
                    </InputAdornment>
                  ),
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              View Document
            </GridItem>
          </GridContainer>
          <GridContainer justify="center">
            <Button>Add Document</Button>
          </GridContainer>
        </form>
      </div>
    );
  }
}

Step4.propTypes = {
  classes: PropTypes.object,
};

export default withStyles()(Step4);
