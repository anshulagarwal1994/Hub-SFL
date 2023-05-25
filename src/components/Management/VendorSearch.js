import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import HeadsetMic from "@material-ui/icons/HeadsetMic";
import GridContainer from "components/Grid/GridContainer.js";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Icon from "@material-ui/core/Icon";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Check from "@material-ui/icons/Check";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
};

const useStyles = () => makeStyles(styles);
const classes = useStyles();
export default function ReactTables() {
  const verifyEmail = (value) => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };
  const [checked, setChecked] = React.useState([24, 22]);
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

  return (
    <GridContainer className="UserList-outer">
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader className="btn-right-outer" color="primary" icon>
            <CardIcon color="primary">
              <HeadsetMic />
            </CardIcon>
            <h4 className="margin-right-auto text-color-black">
              Vendor Search
            </h4>
          </CardHeader>
          <CardBody>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <div className="select-spl">
                  <FormControl fullWidth className="input-select-outer">
                    <InputLabel
                      htmlFor="selectshipmenttype"
                      className={classes.selectLabel}
                    >
                      Vendor Name
                    </InputLabel>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu,
                      }}
                      classes={{
                        select: classes.select,
                      }}
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
                        Vendor Name
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        value="isequalto"
                      >
                        SFL WorldWide
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        value="isequalto"
                      >
                        Cognsiun
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <div className="select-spl">
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
                        Is Equal to
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        value="isequalto"
                      >
                        Is Equal to
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </GridItem>
              <GridItem xs={12} sm={12} md={3}>
                <CustomInput
                  labelText={<span>Search Name</span>}
                  id="searchname"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) =>
                      this.change(event, "searchname", "length", 10),
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        className={classes.inputAdornment}
                      >
                        <Icon className={classes.User}>public</Icon>
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
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <div className="select-spl">
                  <FormControl fullWidth className="input-select-outer">
                    <InputLabel
                      htmlFor="selectshipmenttype"
                      className={classes.selectLabel}
                    >
                      Contact Name
                    </InputLabel>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu,
                      }}
                      classes={{
                        select: classes.select,
                      }}
                      onChange={(event) => this.handleSimple(event)}
                      inputProps={{
                        name: "contactname",
                        id: "contactname",
                      }}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem,
                        }}
                      >
                        Contact Name
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        value="purveenshah"
                      >
                        Purveen Shah
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        value="kamalkabra"
                      >
                        Kamal Kabra
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <div className="select-spl">
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
                        Is Equal to
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        value="isequalto"
                      >
                        Is Equal to
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </GridItem>
              <GridItem xs={12} sm={12} md={3}>
                <CustomInput
                  labelText={<span>Search Name</span>}
                  id="searchname"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) =>
                      this.change(event, "searchname", "length", 10),
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        className={classes.inputAdornment}
                      >
                        <Icon className={classes.User}>public</Icon>
                      </InputAdornment>
                    ),
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={1}>
                <Button justIcon color="pinterest" className="Plus-btn mt-20">
                  <i className={"far fa-trash-alt"} />
                </Button>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <h4>Select Service Offered</h4>
              </GridItem>
            </GridContainer>
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
            <GridContainer className="mt-20">
              <GridItem xs={12} sm={12} md={12}>
                <h4>Select Location</h4>
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                  labelText={<span>City</span>}
                  id="city"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) =>
                      this.change(event, "city", "length", 10),
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
                  labelText={<span>State</span>}
                  id="state"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) =>
                      this.change(event, "state", "length", 10),
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        className={classes.inputAdornment}
                      >
                        <Icon className={classes.User}>public</Icon>
                      </InputAdornment>
                    ),
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <CustomInput
                  labelText={<span>Country</span>}
                  id="country"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) =>
                      this.change(event, "country", "length", 10),
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        className={classes.inputAdornment}
                      >
                        <Icon className={classes.User}>public</Icon>
                      </InputAdornment>
                    ),
                  }}
                />
              </GridItem>
            </GridContainer>
            <GridContainer justify="center">
              <Button className="signup-btn">Search Now</Button>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
