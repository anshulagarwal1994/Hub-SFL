/*eslint-disable*/
import React, { Component } from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
//import FormControlLabel from "@material-ui/core/FormControlLabel";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import api from "../../../utils/apiClient";

// material ui icons

import MenuItem from "@material-ui/core/MenuItem";
import { CommonConfig } from "utils/constant";

const useStyles = makeStyles(styles);
const classes = () => {
  return useStyles();
};

class Scheduleshipment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      simpleSelect: "",
      ShipmentType: "",
      options: [
        {
          value: "India",
          label: "India",
        },
      ],
      PackageList: [],
      PackageType: "",
      packageType: [
        { value: 1, label: "Boxes" },
        { value: 2, label: "Documents" },
        { value: 3, label: "Furniture" },
        { value: 4, label: "TV" },
        { value: 5, label: "Auto" },
      ],
      YesNo: [{ value: true, label: "Yes" }, { value: false, label: "No" }],
      packedBy: [
        { value: "Owner", label: "Owner" },
        { value: "Mover", label: "Mover" },
      ],
      TotalPackages: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    // console.log("nextProps......step2",nextProps.allStates.customerdetails.FromAddress.ShipmentType);
    if (nextProps.allStates.customerdetails != undefined) {
      this.setState({
        ShipmentType:
          nextProps.allStates.customerdetails.FromAddress.ShipmentType,
      });
    }
  }

  async componentDidMount() {
    // ;
    await this.getPackageDetail();
  }

  getPackageDetail() {
    // ;
    try {
      let data = {
        ShippingID: this.props.history.location.state.ShipppingID,
      };
      api
        .post("scheduleshipment/getShipmentPackageByID", data)
        .then((res) => {
          if (res.success) {
            if (res.data.length) {
              this.setState({
                PackageList: res.data,
                PackageType: res.data[0].PackageType,
                TotalPackages: res.data[0].TotalPackages,
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  }

  handleChangePackage = (event, type, idx) => {
    const { value } = event.target;
    const PackageList = this.state.PackageList;
    if (type === "PackageContent" || type === "Insurance") {
      PackageList[idx][type] = value;
    } else if (type === "Sequence" || type === "EstimetedWeight") {
      if (value.length < 4) {
        PackageList[idx][type] = value.replace(/\D/, "");
      } else {
        PackageList[idx][type] = 0;
      }
    } else if (type === "Height" || type === "Width" || type === "Length") {
      if (value.length < 3) {
        PackageList[idx][type] = value.replace(/\D/, "");
      } else {
        PackageList[idx][type] = 0;
      }
    } else if (type === "ChargableWeight" || type === "CFT") {
      PackageList[idx][type] = value.replace(/\D/, "");
    } else if (type === "Insurance") {
      if (value.length < 5) {
        PackageList[idx][type] = value.replace(/\D/, "");
      } else {
        PackageList[idx][type] = 0;
      }
    }
    // else{
    //
    // }
    this.setState({ PackageList: PackageList });
  };

  selectChange = (event, type, index) => {
    if (type === "TV") {
      let packgeList = this.state.PackageList;
      packgeList[index][type] = event.target.value;
      this.setState({ PackageList: packgeList });
    } else if (type === "Stretch") {
      let packgeList = this.state.PackageList;
      packgeList[index][type] = event.target.value;
      this.setState({ PackageList: packgeList });
    } else if (type === "Crating") {
      let packgeList = this.state.PackageList;
      packgeList[index][type] = event.target.value;
      this.setState({ PackageList: packgeList });
    } else if (type === "Repack") {
      let packgeList = this.state.PackageList;
      packgeList[index][type] = event.target.value;
      this.setState({ PackageList: packgeList });
    } else if (type === "PackedType") {
      let packgeList = this.state.PackageList;
      packgeList[index][type] = event.target.value;
      this.setState({ PackageList: packgeList });
    }
  };

  yesNo = () => {
    return this.state.YesNo.map((content) => {
      return (
        <MenuItem
          classes={{ root: classes.selectMenuItem }}
          value={content.value}
        >
          {" "}
          {content.label}{" "}
        </MenuItem>
      );
    });
  };

  packedBy = () => {
    return this.state.packedBy.map((content) => {
      return (
        <MenuItem
          classes={{ root: classes.selectMenuItem }}
          value={content.value}
        >
          {" "}
          {content.label}{" "}
        </MenuItem>
      );
    });
  };

  addPackageRow = () => {
    var row = {};
    if (this.state.ShipmentType == "Ocean") {
      row = {
        EstimetedWeight: 0,
        Height: 0,
        Length: 0,
        Width: 0,
        ChargableWeight: 0,
        CreatedBy: CommonConfig.loggedInUserData().Name,
        TV: false,
        Crating: false,
        Stretch: false,
        Repack: false,
        PackageContent: "",
        CFT: 0,
        PackedType: "",
      };
    } else {
      row = {
        EstimetedWeight: 0,
        Height: 0,
        Length: 0,
        Width: 0,
        ChargableWeight: 0,
        CreatedBy: CommonConfig.loggedInUserData().Name,
        Insurance: 0,
      };
    }
    this.setState({ PackageList: [...this.state.PackageList, row] });
  };

  removePackageRow = (index) => {
    var PackageList = this.state.PackageList;
    PackageList.splice(index, 1);
    this.setState({ PackageList: PackageList });
  };

  viewPackage = () => {
    return this.state.PackageList.map((packages, idx) => {
      return (
        <tr>
          <td className="text-align-right">
            <CustomInput
              id="number"
              // type="number"
              inputProps={{
                value: idx + 1,
              }}
            />
          </td>
          {this.state.ShipmentType == "Ocean" ? (
            <>
              <td>
                <CustomInput
                  type="number"
                  name="sequence"
                  id="sequence"
                  inputProps={{
                    value: packages.Sequence,
                    onChange: (event) =>
                      this.handleChangePackage(event, "Sequence", idx),
                  }}
                />
              </td>
              <td>
                <div className="table-select small">
                  <FormControl className={classes.formControl} fullWidth>
                    <Select
                      id="package_number"
                      name="package_number"
                      value={packages.TV}
                      className="form-control"
                      onChange={(event) => this.selectChange(event, "TV", idx)}
                    >
                      {this.yesNo()}
                    </Select>
                  </FormControl>
                </div>
              </td>
              <td>
                <div className="table-select small">
                  <FormControl className={classes.formControl} fullWidth>
                    <Select
                      id="package_number"
                      name="package_number"
                      value={packages.Stretch}
                      className="form-control"
                      onChange={(event) =>
                        this.selectChange(event, "Stretch", idx)
                      }
                    >
                      {this.yesNo()}
                    </Select>
                  </FormControl>
                </div>
              </td>
              <td>
                <div className="table-select small">
                  <FormControl className={classes.formControl} fullWidth>
                    <Select
                      id="package_number"
                      name="package_number"
                      value={packages.Repack}
                      className="form-control"
                      onChange={(event) =>
                        this.selectChange(event, "Repack", idx)
                      }
                    >
                      {this.yesNo()}
                    </Select>
                  </FormControl>
                </div>
              </td>
              <td>
                <div className="table-select small">
                  <FormControl className={classes.formControl} fullWidth>
                    <Select
                      id="package_number"
                      name="package_number"
                      value={packages.Crating}
                      className="form-control"
                      onChange={(event) =>
                        this.selectChange(event, "Crating", idx)
                      }
                    >
                      {this.yesNo()}
                    </Select>
                  </FormControl>
                </div>
              </td>
              <td>
                <div className="width-md">
                  <CustomInput
                    type="number"
                    name="packagecontent"
                    id="proposaltype"
                    inputProps={{
                      value: packages.PackageContent,
                      onChange: (event) =>
                        this.handleChangePackage(event, "PackageContent", idx),
                    }}
                  />
                </div>
              </td>
            </>
          ) : null}
          <td>
            <CustomInput
              id="proposaltype"
              type="weight"
              name="weight"
              inputProps={{
                value: packages.EstimetedWeight,
                onChange: (event) =>
                  this.handleChangePackage(event, "EstimetedWeight", idx),
              }}
            />
          </td>
          <td>
            <CustomInput
              type="length"
              name="length"
              id="proposaltype"
              inputProps={{
                value: packages.Length,
                onChange: (event) =>
                  this.handleChangePackage(event, "Length", idx),
              }}
            />
          </td>
          <td>
            <CustomInput
              type="number"
              name="width"
              id="proposaltype"
              inputProps={{
                value: packages.Width,
                onChange: (event) =>
                  this.handleChangePackage(event, "Width", idx),
              }}
            />
          </td>
          <td>
            <CustomInput
              type="number"
              name="height"
              id="proposaltype"
              inputProps={{
                value: packages.Height,
                onChange: (event) =>
                  this.handleChangePackage(event, "Height", idx),
              }}
            />
          </td>
          <td>
            <CustomInput
              type="number"
              name="chargableweight"
              id="proposaltype"
              inputProps={{
                value: packages.ChargableWeight,
                onChange: (event) =>
                  this.handleChangePackage(event, "ChargableWeight", idx),
              }}
            />
          </td>
          {this.state.ShipmentType !== "Ocean" ? (
            <td>
              <CustomInput
                type="number"
                name="insurance"
                id="insurance"
                inputProps={{
                  value: packages.Insurance,
                  onChange: (event) =>
                    this.handleChangePackage(event, "Insurance", idx),
                }}
              />
            </td>
          ) : null}

          {this.state.ShipmentType === "Ocean" ? (
            <>
              <td>
                <CustomInput
                  type="number"
                  name="cft"
                  id="proposaltype"
                  inputProps={{
                    value: packages.CFT,
                    onChange: (event) =>
                      this.handleChangePackage(event, "CFT", idx),
                  }}
                />
              </td>
              <td>
                <div className="table-select">
                  <FormControl className={classes.formControl} fullWidth>
                    <Select
                      id="package_number"
                      name="package_number"
                      className="form-control"
                      onChange={(event) =>
                        this.selectChange(event, "PackedType", idx)
                      }
                    >
                      {this.packedBy()}
                    </Select>
                  </FormControl>
                </div>
              </td>
            </>
          ) : null}
          <td>
            <span>{packages.CreatedBy}</span>
          </td>
          <td>
            <div className="pck-subbtn">
              <Button
                justIcon
                color="danger"
                className="Plus-btn "
                onClick={() => this.removePackageRow(idx)}
              >
                <i className={"fas fa-minus"} />
              </Button>
              {/* <DeleteIcon  onClick={() => this.removePackageRow(idx)} /> */}
              {this.state.PackageList.length === idx + 1 ? (
                // <Icon color="secondary" onClick={() => this.addPackageRow()}>add_circle</Icon>
                <Button
                  justIcon
                  color="facebook"
                  onClick={() => this.addPackageRow()}
                  className="Plus-btn "
                >
                  <i className={"fas fa-plus"} />
                </Button>
              ) : null}
            </div>
          </td>
          {/* {this.state.PackageList.length === idx+1 ? 
                <td className="text-align-right"><Button onClick = {() => this.addPackageRow()}>Add Row</Button></td>
                : null
                } */}
        </tr>
      );
    });
  };

  handleSave = (allStates) => {
    console.log("Step2.......", allStates);
  };

  render() {
    const { PackageType, TotalPackages } = this.state;
    const CountryOption = this.state.options.map((option) => {
      return { value: option.value, label: option.label };
    });
    return (
      <div>
        <form>
          <GridContainer>
            <GridItem xs={12} sm={3} md={3}>
              <FormControl fullWidth className="input-select-outer">
                <InputLabel
                  htmlFor="packagetype"
                  className={classes.selectLabel}
                >
                  Package Type <small>(required)</small>
                </InputLabel>
                <Select
                  MenuProps={{
                    className: classes.selectMenu,
                  }}
                  classes={{
                    select: classes.select,
                  }}
                  value={PackageType}
                  onChange={(event) => this.handleSimple(event)}
                  inputProps={{
                    name: "packagetype",
                    id: "packagetype",
                  }}
                >
                  <MenuItem
                    value="Envelop"
                    classes={{
                      root: classes.selectMenuItem,
                    }}
                  >
                    Document (Under 0.5Lbs)
                  </MenuItem>
                  <MenuItem
                    value="Package"
                    classes={{
                      root: classes.selectMenuItem,
                    }}
                  >
                    Package
                  </MenuItem>
                </Select>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={2} md={2}>
              <FormControl fullWidth className="input-select-outer">
                <InputLabel
                  htmlFor="packagetype"
                  className={classes.selectLabel}
                >
                  No. of Packeges
                </InputLabel>
                <Select
                  MenuProps={{
                    className: classes.selectMenu,
                  }}
                  classes={{
                    select: classes.select,
                  }}
                  value={TotalPackages}
                  onChange={(event) => this.handleSimple(event)}
                  inputProps={{
                    name: "packagetype",
                    id: "packagetype",
                  }}
                >
                  <MenuItem
                    value="1"
                    classes={{
                      root: classes.selectMenuItem,
                    }}
                  >
                    1
                  </MenuItem>
                  <MenuItem
                    value="2"
                    classes={{
                      root: classes.selectMenuItem,
                    }}
                  >
                    2
                  </MenuItem>
                  <MenuItem
                    value="3"
                    classes={{
                      root: classes.selectMenuItem,
                    }}
                  >
                    3
                  </MenuItem>
                </Select>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <div className="package-table">
                <table>
                  <thead>
                    <tr>
                      <th>Number</th>
                      {this.state.ShipmentType === "Ocean" ? (
                        <>
                          <th>Sequence</th>
                          <th>TV</th>
                          <th>Stretch</th>
                          <th>Repack</th>
                          <th>Crating</th>
                          <th>Package Content</th>
                        </>
                      ) : null}
                      <th>Weight</th>
                      <th>Dim(L)</th>
                      <th>Dim(W)</th>
                      <th>Dim(H)</th>
                      <th>Chargeable Weight</th>
                      {this.state.ShipmentType !== "Ocean" ? (
                        <th>Insurance</th>
                      ) : null}
                      {this.state.ShipmentType === "Ocean" ? (
                        <>
                          <th>CFT</th>
                          <th>Packed Type</th>
                        </>
                      ) : null}
                      <th>Added by</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>{this.viewPackage()}</tbody>
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
