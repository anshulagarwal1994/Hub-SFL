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

class Step2 extends React.Component {
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
  render() {
    const { simpleSelect } = this.state;
    return (
      <div>
        <form>
          <GridContainer className="MuiGrid-justify-xs-center">
            <GridItem xs={12} sm={12} md={12}>
              <div className="package-table">
                <table>
                  <thead>
                    <tr>
                      <th>Module Name</th>
                      <th className="align-center">
                        <div className="th-check">
                          Read Access<br></br>
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </th>
                      <th className="align-center">
                        <div className="th-check">
                          Write Access<br></br>
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </th>
                      <th className="align-center">
                        <div className="th-check">
                          Delete Access<br></br>
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </th>
                      <th className="align-center">
                        <div className="th-check">
                          All Access<br></br>
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Call Back</td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Contact Us</td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Schedule Shipment</td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Get Rates</td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Company Management</td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>File a Claim</td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Online Payment</td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Service Management</td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>User Management</td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
                      <td>
                        <div className="th-check">
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() => handleToggle(2)}
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
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
                          />
                        </div>
                      </td>
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

Step2.propTypes = {
  classes: PropTypes.object,
};

export default withStyles()(Step2);
