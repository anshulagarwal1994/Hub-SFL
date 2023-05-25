/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import FormControl from "@material-ui/core/FormControl";
//import FormControlLabel from "@material-ui/core/FormControlLabel";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// material ui icons

const useStyles = makeStyles(styles);
const classes = () => {
  return useStyles();
};

class Scheduleshipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      simpleSelect: "",
      desgin: false,
      code: false,
      develop: false,
      options: [
        {
          value: "India",
          label: "India",
        },
      ],
    };
  }

  handleSimple = (event) => {
    this.setState({ simpleSelect: event.target.value });
  };

  sendState() {
    return this.state;
  }

  FromCountry = () => {
    console.log("From Country");
  };

  render() {
    const { simpleSelect } = this.state;
    const CountryOption = this.state.options.map((option) => {
      return { value: option.value, label: option.label };
    });
    return (
      <div>
        <form>
          <GridContainer>
            <GridItem xs={12} sm={3} md={3}>
              <FormControl fullWidth>
                <Autocomplete
                  options={CountryOption}
                  id="FromCountry"
                  getOptionLabel={(option) =>
                    option.label ? option.label : option
                  }
                  // value={selectedPickUPCountry}
                  autoSelect
                  onChange={(event, value) => this.FromCountry(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={this.state.pickupcountryErr}
                      helperText={this.state.pickupcountryHelperText}
                      label="Package Type"
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
              </FormControl>
              {/* <FormControl
                              fullWidth
                              className="input-select-outer"
                              >
                              <InputLabel
                                  htmlFor="packagetype"
                                  className={classes.selectLabel}
                              >
                                  Package Type <small>(required)</small>
                              </InputLabel>
                              <Select
                                  MenuProps={{
                                      className: classes.selectMenu
                                  }}
                                  classes={{
                                      select: classes.select
                                  }}
                                  value={simpleSelect}
                                  onChange={(event) => this.handleSimple(event)}
                                  inputProps={{
                                      name: "packagetype",
                                      id: "packagetype"
                                  }}
                                  >
                                  <MenuItem
                                      
                                      classes={{
                                          root: classes.selectMenuItem
                                      }}
                                  >
                                      Document (Under 0.5Lbs)
                                  </MenuItem>
                                  <MenuItem
                                      
                                      classes={{
                                          root: classes.selectMenuItem
                                      }}
                                  >
                                      Package
                                  </MenuItem>
                              </Select>
                          </FormControl> */}
            </GridItem>
            <GridItem xs={12} sm={2} md={2}>
              <FormControl fullWidth>
                <Autocomplete
                  options={CountryOption}
                  id="FromCountry"
                  getOptionLabel={(option) =>
                    option.label ? option.label : option
                  }
                  // value={selectedPickUPCountry}
                  autoSelect
                  onChange={(event, value) => this.FromCountry(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={this.state.pickupcountryErr}
                      helperText={this.state.pickupcountryHelperText}
                      label="No. of Packages"
                      margin="normal"
                      fullWidth
                    />
                  )}
                />
              </FormControl>
              {/* <FormControl
                              fullWidth
                              className="input-select-outer"
                              >
                              <InputLabel
                                  htmlFor="packagetype"
                                  className={classes.selectLabel}
                              >
                                  No. of Packeges
                              </InputLabel>
                              <Select
                                  MenuProps={{
                                      className: classes.selectMenu
                                  }}
                                  classes={{
                                      select: classes.select
                                  }}
                                  value={simpleSelect}
                                  onChange={(event) => this.handleSimple(event)}
                                  inputProps={{
                                      name: "packagetype",
                                      id: "packagetype"
                                  }}
                                  >
                                  <MenuItem
                                      
                                      classes={{
                                          root: classes.selectMenuItem
                                      }}
                                  >
                                      1
                                  </MenuItem>
                                  <MenuItem
                                      
                                      classes={{
                                          root: classes.selectMenuItem
                                      }}
                                  >
                                      2
                                  </MenuItem>
                                  <MenuItem
                                      
                                      classes={{
                                          root: classes.selectMenuItem
                                      }}
                                  >
                                      3
                                  </MenuItem>
                              </Select>
                          </FormControl> */}
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <div className="package-table">
                <table>
                  <thead>
                    <tr>
                      <th>Package Type</th>
                      <th>No. of Package</th>
                      <th>Stretch Wrap</th>
                      <th>Repack</th>
                      <th>Crafting</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Document</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <div className="package-table">
                <table>
                  <thead>
                    <tr>
                      <th>Number</th>
                      <th>Sequence</th>
                      <th>TV</th>
                      <th>Stretch</th>
                      <th>Repack</th>
                      <th>Crating</th>
                      <th>Package Content</th>
                      <th>Weight</th>
                      <th>Dim(L)</th>
                      <th>Dim(W)</th>
                      <th>Dim(H)</th>
                      <th>Chargeable Weight</th>
                      <th>CFT</th>
                      <th>Packed Type</th>
                      <th>Added by</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-align-right">1</td>
                      <td></td>
                      <td>No</td>
                      <td>No</td>
                      <td>No</td>
                      <td>No</td>
                      <td>Clothes</td>
                      <td className="text-align-right">62</td>
                      <td className="text-align-right">18</td>
                      <td className="text-align-right">18</td>
                      <td className="text-align-right">24</td>
                      <td className="text-align-right">62</td>
                      <td className="text-align-right">4.5</td>
                      <td>Owner</td>
                      <td>Punit M</td>
                    </tr>
                    <tr>
                      <td className="text-align-right">1</td>
                      <td></td>
                      <td>No</td>
                      <td>No</td>
                      <td>No</td>
                      <td>No</td>
                      <td>Clothes</td>
                      <td className="text-align-right">62</td>
                      <td className="text-align-right">18</td>
                      <td className="text-align-right">18</td>
                      <td className="text-align-right">24</td>
                      <td className="text-align-right">62</td>
                      <td className="text-align-right">4.5</td>
                      <td>Owner</td>
                      <td>Punit M</td>
                    </tr>
                    <tr>
                      <td className="text-align-right">1</td>
                      <td></td>
                      <td>No</td>
                      <td>No</td>
                      <td>No</td>
                      <td>No</td>
                      <td>Clothes</td>
                      <td className="text-align-right">62</td>
                      <td className="text-align-right">18</td>
                      <td className="text-align-right">18</td>
                      <td className="text-align-right">24</td>
                      <td className="text-align-right">62</td>
                      <td className="text-align-right">4.5</td>
                      <td>Owner</td>
                      <td>Punit M</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </GridItem>
          </GridContainer>
        </form>
      </div>
    );
  }
}

Scheduleshipment.propTypes = {
  classes: PropTypes.object,
};

export default withStyles()(Scheduleshipment);
