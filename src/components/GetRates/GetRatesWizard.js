import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import FlightTakeoff from "@material-ui/icons/FlightTakeoff";
import withStyles from "@material-ui/core/styles/withStyles";
import wizardStyle from "assets/jss/material-dashboard-pro-react/components/wizardStyle.js";
import { CommonConfig } from "utils/constant";

let getRateSteps = [];

class GetRatesWizard extends React.Component {
  constructor(props) {
    super(props);

    var width;
    if (this.props.steps.length === 1) {
      width = "100%";
    } else {
      if (window.innerWidth < 600) {
        if (this.props.steps.length !== 3) {
          width = "50%";
        } else {
          width = 100 / 3 + "%";
        }
      } else {
        if (this.props.steps.length === 2) {
          width = "50%";
        } else {
          width = 100 / 3 + "%";
        }
      }
    }

    this.state = {
      currentStep: 0,
      color: this.props.color,
      nextButton: this.props.steps.length > 1 ? true : false,
      previousButton: false,
      finishButton: this.props.steps.length === 1 ? true : false,
      width: width,
      movingTabStyle: {
        transition: "transform 0s",
      },
      allStates: {},
      finalGetResults: [],
      finalOceanResult: [],
      DallasTotal: 0,
      SecaucusTotal: 0,
      HaywardTotal: 0,
      DallasCostToal: 0,
      SecaucusCostTotal: 0,
      HaywardCostTotal: 0,
      props: this.props,
    };
    this.navigationStepChange = this.navigationStepChange.bind(this);
    this.refreshAnimation = this.refreshAnimation.bind(this);
    this.updateWidth = this.updateWidth.bind(this);
  }
  wizard = React.createRef();

  componentDidMount() {
    this.refreshAnimation(0);
    window.addEventListener("resize", this.updateWidth);

    let steps = this.props.steps;

    const GetRateAirAccess = CommonConfig.getUserAccess("Get Rate - AIR");
    const GetRateOceanAccess = CommonConfig.getUserAccess("Get Rate - Ocean");

    if (!GetRateAirAccess.ReadAccess) {
      getRateSteps = steps.filter((x) => x.stepName === "Ocean");

      if (getRateSteps.length) {
        steps.splice(0, 1);
      }
    }
    if (!GetRateOceanAccess.ReadAccess) {
      getRateSteps = steps.filter((x) => x.stepName === "Air / Ground");

      if (getRateSteps.length) {
        steps.splice(1, 1);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWidth);
  }

  updateWidth() {
    this.refreshAnimation(this.state.currentStep);
  }

  async GetRateData() {
    debugger;
    if (this.state.currentStep == 0) {
      if (this[this.props.steps[this.state.currentStep].stepId].validate()) {
        let data = await this[
          this.props.steps[this.state.currentStep].stepId
        ].GetRateData();

        this.setState({ finalGetResults: data });
      }
    } else if (this.state.currentStep == 1) {
      if (this[this.props.steps[this.state.currentStep].stepId].validate()) {
        let data = await this[
          this.props.steps[this.state.currentStep].stepId
        ].GetOceanRate();

        let IsUPSError = false;

        var DallasTotal = 0;
        var SecaucusTotal = 0;
        var HaywardTotal = 0;
        var DallasCostToal = 0;
        var SecaucusCostTotal = 0;
        var HaywardCostTotal = 0;

        for (var i = 0; i < data.length; i++) {
          if (data[i].IsError) {
            DallasTotal = 0.0;
            SecaucusTotal = 0.0;
            DallasCostToal = 0.0;
            SecaucusCostTotal = 0.0;
            HaywardTotal = 0.0;
            HaywardCostTotal = 0.0;
            break;
          }
          console.log("data[i].col0 = ", data[i].col0);
          console.log("data[i].col0 = ", data[i].col1);
          console.log("data[i].col0 = ", data[i].col2);

          if (data[i].col0 != undefined) {
            DallasTotal += Number(data[i].col0.Rate);
            DallasCostToal += Number(data[i].col0.costPrice);
          }

          if (data[i].col1 != undefined) {
            SecaucusTotal += Number(data[i].col1.Rate);
            SecaucusCostTotal += Number(data[i].col1.costPrice);
          }

          if (data[i].col2 != undefined) {
            HaywardTotal += Number(data[i].col2.Rate);
            HaywardCostTotal += Number(data[i].col2.costPrice);
          }
        }
        this.setState({
          finalOceanResult: data,
          DallasTotal: DallasTotal.toFixed(2),
          SecaucusTotal: SecaucusTotal.toFixed(2),
          DallasCostToal: DallasCostToal.toFixed(2),
          SecaucusCostTotal: SecaucusCostTotal.toFixed(2),
          HaywardTotal: HaywardTotal.toFixed(2),
          HaywardCostTotal: HaywardCostTotal.toFixed(2),
        });
      }
    }
  }

  ResetGetRateData() {
    if (this.state.currentStep == 0) {
      this[this.props.steps[this.state.currentStep].stepId].ResetGetRateData();
      this.setState({ finalGetResults: [] });
    } else {
      this[this.props.steps[this.state.currentStep].stepId].ResetGetRateData();
      this.setState({ finalOceanResult: [] });
    }
  }

  navigationStepChange(key) {
    this.setState({
      finalGetResults: [],
      finalOceanResult: [],
    });
    if (this.props.steps) {
      var validationState = true;
      if (key > this.state.currentStep) {
        for (var i = this.state.currentStep; i < key; i++) {
          if (this[this.props.steps[i].stepId].sendState !== undefined) {
            this.setState({
              allStates: {
                ...this.state.allStates,
                [this.props.steps[i].stepId]: this[
                  this.props.steps[i].stepId
                ].sendState(),
              },
            });
          }
          if (
            this[this.props.steps[i].stepId].isValidated !== undefined &&
            this[this.props.steps[i].stepId].isValidated() === false
          ) {
            validationState = false;
            break;
          }
        }
      }
      if (validationState) {
        this.setState({
          currentStep: key,
          nextButton: this.props.steps.length > key + 1 ? true : false,
          previousButton: key > 0 ? true : false,
          finishButton: this.props.steps.length === key + 1 ? true : false,
        });
        this.refreshAnimation(key);
      }
    }
  }

  refreshAnimation(index) {
    var total = this.props.steps.length;
    var li_width = 100 / total;
    var total_steps = this.props.steps.length;
    var move_distance =
      this.wizard.current.children[0].offsetWidth / total_steps;
    var index_temp = index;
    var vertical_level = 0;

    var mobile_device = window.innerWidth < 600 && total > 3;

    if (mobile_device) {
      move_distance = this.wizard.current.children[0].offsetWidth / 2;
      index_temp = index % 2;
      li_width = 50;
    }

    this.setState({ width: li_width + "%" });

    var step_width = move_distance;
    move_distance = move_distance * index_temp;

    var current = index + 1;

    if (current === 1 || (mobile_device === true && index % 2 === 0)) {
      move_distance -= 8;
    } else if (
      current === total_steps ||
      (mobile_device === true && index % 2 === 1)
    ) {
      move_distance += 8;
    }

    if (mobile_device) {
      vertical_level = parseInt(index / 2, 10);
      vertical_level = vertical_level * 38;
    }
    var movingTabStyle = {
      width: step_width,
      transform:
        "translate3d(" + move_distance + "px, " + vertical_level + "px, 0)",
      transition: "all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)",
    };
    this.setState({ movingTabStyle: movingTabStyle });
  }

  bookShipment = (data) => {
    debugger;
    var url = window.location.href;
    console.log("url", url);
    localStorage.setItem("getRate", data.Rates);
    localStorage.setItem("rate url", url);
    // localStorage.setItem("shipping type");
    this.props.props.history.push({
      pathname: "/admin/Scheduleshipment",
      state: {
        GetRateData: this[this.props.steps[this.state.currentStep].stepId].state
          .FinalGetRate,
        ServiceName: data.ServiceDisplayName,
        ServiceType: data.ServiceType,
        skipstep1: true,
        MainServiceName: data.MainServiceName,
        state: this[this.props.steps[this.state.currentStep].stepId].state,
      },
    });
  };

  sendRateEmail = () => {
    this[this.props.steps[this.state.currentStep].stepId].sendGetRateEmail(
      this.state.finalGetResults
    );
  };
  render() {
    const { classes, color, steps } = this.props;
    const GetRateAccess = CommonConfig.getUserAccess("Get Rates");
    const GetRateAirAccess = CommonConfig.getUserAccess("Get Rate - AIR");
    const GetRateOceanAccess = CommonConfig.getUserAccess("Get Rate - Ocean");

    return (
      <div className={classes.wizardContainer} ref={this.wizard}>
        <Card className={classes.card}>
          <CardHeader className="btn-right-outer" color="primary" icon>
            <CardIcon color="primary">
              <FlightTakeoff />
            </CardIcon>
            <h4 className="margin-right-auto text-color-black">Get Rate</h4>
          </CardHeader>
          {GetRateAirAccess.ReadAccess === 1 &&
          GetRateOceanAccess.ReadAccess === 1 ? (
            <div className={classes.wizardNavigation}>
              <ul className={classes.nav}>
                {steps.map((prop, key) => {
                  return (
                    <li
                      className={classes.steps}
                      key={key}
                      style={{ width: this.state.width }}
                    >
                      <a
                        href="#pablo"
                        className={classes.stepsAnchor}
                        onClick={(e) => {
                          e.preventDefault();
                          this.navigationStepChange(key);
                        }}
                      >
                        {prop.stepName}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div
                className={classes.movingTab + " " + classes[color]}
                style={this.state.movingTabStyle}
              >
                {steps[this.state.currentStep].stepName}
              </div>
            </div>
          ) : null}
          <div className={classes.content}>
            {steps.map((prop, key) => {
              const stepContentClasses = cx({
                [classes.stepContentActive]: this.state.currentStep === key,
                [classes.stepContent]: this.state.currentStep !== key,
              });
              return (
                <div className={stepContentClasses} key={key}>
                  <prop.stepComponent
                    innerRef={(node) => (this[prop.stepId] = node)}
                    allStates={this.state.allStates}
                    match={this.state.props.match}
                    props={this.state.props.props}
                  />
                </div>
              );
            })}
            <div className="shipment-submit">
              <div className="right">
                <Button color="rose" onClick={() => this.GetRateData()}>
                  Get Rate
                </Button>
                <Button
                  color="secondary"
                  onClick={() => this.ResetGetRateData()}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
          <div className={classes.footer}>
            <div className={classes.clearfix} />
          </div>
        </Card>
        {this.state.finalGetResults.length ? (
          <Card>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <h3>Rate Details</h3>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <div className="package-table">
                    <table>
                      <thead>
                        <tr>
                          <th style={{ width: "50%" }}>Service Type</th>
                          <th style={{ width: "25%" }}>Delivery Date</th>
                          <th
                            style={{ width: "15%" }}
                            className="tbl-align-right"
                          >
                            Rates
                          </th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.finalGetResults.map((data, key) => {
                          return (
                            <tr key={key}>
                              <td>{data.ServiceDisplayName}</td>
                              <td>{data.Delivery_Date}</td>
                              <td className="tbl-align-right">
                                {data.Rates != 0
                                  ? "$ " + data.Rates.toFixed(2)
                                  : "Call for Rates"}
                              </td>
                              <td>
                                <Button
                                  disabled={
                                    data.Rates != 0 ? data.IsError : true
                                  }
                                  color="success"
                                  onClick={() => this.bookShipment(data)}
                                >
                                  Book
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                        <tr>
                          <td colSpan="4">
                            <Button
                              color="success"
                              onClick={() => this.sendRateEmail()}
                            >
                              Send Email
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        ) : this.state.finalOceanResult.length ? (
          <Card>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <h3>Rate Details</h3>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <div className="package-table">
                    {!GetRateAccess.AllAccess ? (
                      <table>
                        <thead>
                          <tr>
                            <th width="40%">Services</th>
                            {this.state.finalOceanResult?.[0]?.col0?.label ? (
                              <th>
                                {this.state.finalOceanResult[0].col0.label}
                              </th>
                            ) : (
                              ""
                            )}
                            {this.state.finalOceanResult?.[0]?.col1?.label ? (
                              <th>
                                {this.state.finalOceanResult[0].col1.label}
                              </th>
                            ) : (
                              ""
                            )}
                            {this.state.finalOceanResult?.[0]?.col2?.label ? (
                              <th>
                                {this.state.finalOceanResult[0].col2.label}
                              </th>
                            ) : (
                              ""
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.finalOceanResult.map((data, key) => {
                            if (data.IsError) {
                              return (
                                <tr key={key}>
                                  <td>{data.Service}</td>
                                  <td style={{ color: "red" }}>
                                    {" "}
                                    Error ({data.col0.Rate})
                                  </td>
                                  <td style={{ color: "red" }}>
                                    {" "}
                                    Error ({data.col1.Rate})
                                  </td>
                                </tr>
                              );
                            } else {
                              return (
                                <tr key={key}>
                                  <td>{data.Service}</td>
                                  {data?.col0?.Rate ? (
                                    <td>$ {data.col0.Rate}</td>
                                  ) : (
                                    ""
                                  )}
                                  {data?.col1?.Rate ? (
                                    <td>$ {data.col1.Rate}</td>
                                  ) : (
                                    ""
                                  )}
                                  {data?.col2?.Rate ? (
                                    <td>$ {data.col2.Rate}</td>
                                  ) : (
                                    ""
                                  )}
                                </tr>
                              );
                            }
                          })}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td>
                              <b>Total</b>
                            </td>
                            {this.state?.DallasTotal === "0.00" ? (
                              ""
                            ) : (
                              <td>
                                <b>{this.state.DallasTotal}</b>
                              </td>
                            )}

                            {this.state?.SecaucusTotal === "0.00" ? (
                              ""
                            ) : (
                              <td>
                                <b>{this.state.SecaucusTotal}</b>
                              </td>
                            )}

                            {this.state?.HaywardTotal === "0.00" ? (
                              ""
                            ) : (
                              <td>
                                <b>{this.state.HaywardTotal}</b>
                              </td>
                            )}
                          </tr>
                        </tfoot>
                      </table>
                    ) : (
                      <table>
                        <thead>
                          <tr>
                            <th></th>
                            <th className="align-center" colSpan="2">
                              {this.state.finalOceanResult[0].col0.label}
                            </th>
                            {this.state.finalOceanResult?.[0]?.col1?.label ? (
                              <th className="align-center" colSpan="2">
                                {this.state.finalOceanResult[0].col1.label}
                              </th>
                            ) : (
                              ""
                            )}

                            {/* {this.state.finalOceanResult.map((data, key) => {}
                             */}

                            {this.state.finalOceanResult[0].col2 !=
                            undefined ? (
                              <th className="align-center" colSpan="2">
                                {this.state.finalOceanResult[0].col2.label}
                              </th>
                            ) : null}
                          </tr>
                          <tr>
                            <th width="40%">Services</th>
                            {this.state.finalOceanResult?.[0]?.col0?.label ? (
                              <th className="wd-150">Cost</th>
                            ) : (
                              ""
                            )}
                            {this.state.finalOceanResult?.[0]?.col0?.label ? (
                              <th className="wd-150">Rate</th>
                            ) : (
                              ""
                            )}
                            {this.state.finalOceanResult?.[0]?.col1?.label ? (
                              <th className="wd-150">Cost</th>
                            ) : (
                              ""
                            )}
                            {this.state.finalOceanResult?.[0]?.col1?.label ? (
                              <th className="wd-150">Rate</th>
                            ) : (
                              ""
                            )}
                            {this.state.finalOceanResult?.[0]?.col2?.label ? (
                              <th className="wd-150">Cost</th>
                            ) : (
                              ""
                            )}
                            {this.state.finalOceanResult?.[0]?.col2?.label ? (
                              <th className="wd-150">Rate</th>
                            ) : (
                              ""
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.finalOceanResult.map((data, key) => {
                            if (data.IsError) {
                              return (
                                <tr key={key}>
                                  <td> {data.Service}</td>
                                  <td style={{ color: "red" }}>
                                    {" "}
                                    Error ({data.col0.costPrice})
                                  </td>
                                  <td style={{ color: "red" }}>
                                    {" "}
                                    Error ({data.col0.Rate})
                                  </td>
                                  <td style={{ color: "red" }}>
                                    {" "}
                                    Error ({data.col1.costPrice})
                                  </td>
                                  <td style={{ color: "red" }}>
                                    {" "}
                                    Error ({data.col1.Rate})
                                  </td>
                                </tr>
                              );
                            } else {
                              return (
                                console.log(
                                  "checkCostData",
                                  data?.col0?.costPrice
                                ),
                                console.log(
                                  "checkCostData1",
                                  data?.col1?.costPrice
                                ),
                                console.log("checkCostData2", data.col2),
                                (
                                  <tr key={key}>
                                    {data?.Service ? (
                                      <td> {data.Service}</td>
                                    ) : (
                                      ""
                                    )}
                                    {data?.col0?.costPrice ? (
                                      <td>$ {data.col0.costPrice}</td>
                                    ) : (
                                      ""
                                    )}
                                    {data?.col0?.Rate ? (
                                      <td>$ {data.col0.Rate}</td>
                                    ) : (
                                      ""
                                    )}
                                    {data?.col1?.costPrice ? (
                                      <td>$ {data.col1.costPrice}</td>
                                    ) : (
                                      ""
                                    )}
                                    {data?.col1?.Rate ? (
                                      <td>$ {data.col1.Rate}</td>
                                    ) : (
                                      ""
                                    )}
                                    {data?.col2?.costPrice ? (
                                      <td>$ {data.col2.costPrice}</td>
                                    ) : (
                                      ""
                                    )}
                                    {data?.col2?.Rate ? (
                                      <td>$ {data.col2.Rate}</td>
                                    ) : (
                                      ""
                                    )}
                                  </tr>
                                )
                              );
                            }
                          })}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td>
                              <b>Total</b>
                            </td>

                            {this.state.DallasCostToal === "0.00" ? (
                              ""
                            ) : (
                              <td>
                                <b>{this.state.DallasCostToal}</b>
                              </td>
                            )}

                            {this.state.DallasTotal === "0.00" ? (
                              ""
                            ) : (
                              <td>
                                <b>{this.state.DallasTotal}</b>
                              </td>
                            )}

                            {this.state.SecaucusCostTotal === "0.00" ? (
                              ""
                            ) : (
                              <td>
                                <b>{this.state.SecaucusCostTotal}</b>
                              </td>
                            )}

                            {this.state.SecaucusTotal === "0.00" ? (
                              ""
                            ) : (
                              <td>
                                <b>{this.state.SecaucusTotal}</b>
                              </td>
                            )}

                            {this.state.HaywardCostTotal === "0.00" ? (
                              ""
                            ) : (
                              <td>
                                <b>{this.state.HaywardCostTotal}</b>
                              </td>
                            )}

                            {this.state.HaywardTotal === "0.00" ? (
                              ""
                            ) : (
                              <td>
                                <b>{this.state.HaywardTotal}</b>
                              </td>
                            )}
                          </tr>
                        </tfoot>
                      </table>
                    )}
                  </div>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        ) : null}
      </div>
    );
  }
}

GetRatesWizard.defaultProps = {
  color: "rose",
};
GetRatesWizard.propTypes = {
  classes: PropTypes.object.isRequired,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      stepName: PropTypes.string.isRequired,
      stepComponent: PropTypes.object.isRequired,
      stepId: PropTypes.string.isRequired,
    })
  ).isRequired,
  color: PropTypes.oneOf([
    "primary",
    "warning",
    "danger",
    "success",
    "info",
    "rose",
  ]),
};
export default withStyles(wizardStyle)(GetRatesWizard);
