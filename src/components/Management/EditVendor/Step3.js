/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Check from "@material-ui/icons/Check";

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

class Step3 extends React.Component {
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
          <GridContainer>
            <GridItem xs={12} sm={12} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    tabIndex={-1}
                    onClick={() => handleToggle(10)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot,
                    }}
                  />
                }
                classes={{
                  label: classes.label,
                  root: classes.labelRoot,
                }}
                label="Auto Transport"
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    tabIndex={-1}
                    onClick={() => handleToggle(11)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot,
                    }}
                  />
                }
                classes={{
                  label: classes.label,
                  root: classes.labelRoot,
                }}
                label="Cargo Consolidators"
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    tabIndex={-1}
                    onClick={() => handleToggle(12)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot,
                    }}
                  />
                }
                classes={{
                  label: classes.label,
                  root: classes.labelRoot,
                }}
                label="Container Haulage"
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    tabIndex={-1}
                    onClick={() => handleToggle(12)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot,
                    }}
                  />
                }
                classes={{
                  label: classes.label,
                  root: classes.labelRoot,
                }}
                label="Customs House Agent"
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    tabIndex={-1}
                    onClick={() => handleToggle(12)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot,
                    }}
                  />
                }
                classes={{
                  label: classes.label,
                  root: classes.labelRoot,
                }}
                label="FCL Booking"
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    tabIndex={-1}
                    onClick={() => handleToggle(12)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot,
                    }}
                  />
                }
                classes={{
                  label: classes.label,
                  root: classes.labelRoot,
                }}
                label="LTL (Less Than Truck Load)"
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    tabIndex={-1}
                    onClick={() => handleToggle(12)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot,
                    }}
                  />
                }
                classes={{
                  label: classes.label,
                  root: classes.labelRoot,
                }}
                label="Local Moving"
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    tabIndex={-1}
                    onClick={() => handleToggle(12)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot,
                    }}
                  />
                }
                classes={{
                  label: classes.label,
                  root: classes.labelRoot,
                }}
                label="Long-Distance Moving"
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    tabIndex={-1}
                    onClick={() => handleToggle(12)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot,
                    }}
                  />
                }
                classes={{
                  label: classes.label,
                  root: classes.labelRoot,
                }}
                label="Towing Companies"
              />
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
