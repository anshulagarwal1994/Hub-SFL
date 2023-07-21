import React from "react";
// react component for creating dynamic tables

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import HeadsetMic from "@material-ui/icons/HeadsetMic";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import Icon from "@material-ui/core/Icon";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
};

// const [registerEmail, setregisterEmail] = React.useState("");
// const [registerEmailState, setregisterEmailState] = React.useState("");

export default function ReactTables() {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  return (
    <GridContainer className="UserList-outer">
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader className="btn-right-outer" color="primary" icon>
            <CardIcon color="primary">
              <HeadsetMic />
            </CardIcon>
            <h4 className="margin-right-auto text-color-black">Search Leads</h4>
          </CardHeader>
          <CardBody>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <FormControl fullWidth className="input-select-outer">
                  <InputLabel
                    htmlFor="selectshipmenttype"
                    className={classes.selectLabel}
                  >
                    Select Feild
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu,
                    }}
                    classes={{
                      select: classes.select,
                    }}
                    //value={simpleSelect}
                    onChange={(event) => this.handleSimple(event)}
                    inputProps={{
                      name: "doyouneedpickup?",
                      id: "doyouneedpickup",
                    }}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem,
                      }}
                    >
                      Select Feild
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="leadid"
                    >
                      Lead ID
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="leaddate"
                    >
                      Lead Date
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="name"
                    >
                      Name
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="phonenumber "
                    >
                      Phone Number
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="emailid "
                    >
                      Email Id
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="managedby "
                    >
                      Managed by
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="fromcity "
                    >
                      From City
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="fromstate "
                    >
                      From State
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="fromzip"
                    >
                      From Zip
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="fromcountry"
                    >
                      From Country
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="tocity"
                    >
                      To City
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="tostate"
                    >
                      To State
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="tozip "
                    >
                      To Zip
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="tocountry "
                    >
                      To Country
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="contenttype "
                    >
                      Content Type
                    </MenuItem>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <FormControl fullWidth className="input-select-outer">
                  <InputLabel
                    htmlFor="selectshipmenttype"
                    className={classes.selectLabel}
                  >
                    Select Filter
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu,
                    }}
                    classes={{
                      select: classes.select,
                    }}
                    //value={simpleSelect}
                    onChange={(event) => this.handleSimple(event)}
                    inputProps={{
                      name: "selectfilter?",
                      id: "selectfilter",
                    }}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem,
                      }}
                    >
                      Select Filter
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="isequalto"
                    >
                      Is equal to
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="isnotequalto"
                    >
                      Is not equal to
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="startwith"
                    >
                      Start with
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="contains"
                    >
                      Contains
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="doesnotcontain "
                    >
                      Does not Contain
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="endswith "
                    >
                      Ends with
                    </MenuItem>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem xs={12} sm={12} md={3}>
                <CustomInput
                  // success={this.state.firstnameState === "success"}
                  //error={this.state.firstnameState === "error"}
                  labelText={<span>Enter Value</span>}
                  id="entervalue"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) =>
                      this.change(event, "entervalue", "length", 10),
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        className={classes.inputAdornment}
                      >
                        <Icon className={classes.User}>chrome_reader_mode</Icon>
                      </InputAdornment>
                    ),
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={1}>
                <Button justIcon color="facebook" className="Plus-btn mt-20">
                  <i className={"fas fa-plus"} />
                </Button>
              </GridItem>
            </GridContainer>
            <GridContainer className="mt-20" justify="center">
              <Button className="signup-btn">Search</Button>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
