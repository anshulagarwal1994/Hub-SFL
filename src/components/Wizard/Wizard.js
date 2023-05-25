import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "components/CustomButtons/Button.js";
import { CommonConfig } from "../../utils/constant";
import wizardStyle from "assets/jss/material-dashboard-pro-react/components/wizardStyle.js";

let pacakageStep = [];
class Wizard extends React.Component {
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
      EditButton: false,
      finishButton: this.props.steps.length === 1 ? true : false,
      width: width,
      movingTabStyle: {
        transition: "transform 0s",
      },
      allStates: {},
      finishDisabled: false,
      props: this.props,
      skipStep1: false,
    };

    this.navigationStepChange = this.navigationStepChange.bind(this);
    this.refreshAnimation = this.refreshAnimation.bind(this);
    this.previousButtonClick = this.previousButtonClick.bind(this);
    this.EditButtonClick = this.EditButtonClick.bind(this);
    this.finishButtonClick = this.finishButtonClick.bind(this);
    this.updateWidth = this.updateWidth.bind(this);
    // this.change = this.change.bind(this);
  }
  wizard = React.createRef();

  componentDidMount() {
    if (!CommonConfig.isEmpty(this.props.props.location.state)) {
      if (this.props.props.location.state.skipstep1 === true) {
        this.setState({ EditButton: true });
      }
    }

    setTimeout(() => {
      if (localStorage.getItem("sealsleadid")) {
        this.navigationStepChange(1, 0);
      }
    }, 3000);

    this.refreshAnimation(0);
    window.addEventListener("resize", this.updateWidth);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWidth);
  }

  updateWidth() {
    this.refreshAnimation(this.state.currentStep);
  }

  navigationStepChange(key, current) {
    debugger;
    if (key > current) {
      this.nextButtonClick();
    } else {
      this.previousButtonClick();
    }

    // if (this.props.steps) {
    //   var validationState = true;
    //   if (key > this.state.currentStep) {
    //     for (var i = this.state.currentStep; i < key; i++) {
    //       if (this[this.props.steps[i].stepId].sendState !== undefined) {
    //         this.setState({
    //           allStates: {
    //             ...this.state.allStates,
    //             [this.props.steps[i].stepId]: this[this.props.steps[i].stepId].sendState()
    //           },
    //         });
    //       }
    //       // if (
    //       //   this[this.props.steps[i].stepId].validate !== undefined &&
    //       //   this[this.props.steps[i].stepId].validate() === false
    //       // ) {
    //       //   validationState = false;
    //       //   break;
    //       // }

    //       // if(this.schedulepickup.state.selectedShipmentType === 'Ocean')
    //       // {
    //       //     let steps = this.props.steps;
    //       //     pacakageStep = steps.filter(x => x.stepName === 'Package');

    //       //       if(pacakageStep.length)
    //       //       {
    //       //         steps.splice(3,1);
    //       //       }
    //       // }else{
    //           // if(pacakageStep.length)
    //           // {
    //             // this.props.steps.splice(3,0 , pacakageStep[0]);
    //             // pacakageStep = [];
    //           // }
    //       // }

    //     }
    //   }

    //   if (validationState) {
    //     this.setState({
    //       currentStep: key,
    //       nextButton: this.props.steps.length > key + 1 ? true : false,
    //       previousButton: key > 0 ? true : false,
    //       finishButton: this.props.steps.length === key + 1 ? true : false
    //     });
    //     this.refreshAnimation(key);
    //   }
    // }
  }

  nextButtonClick() {
    if (
      (this.props.validate &&
        ((this[this.props.steps[this.state.currentStep].stepId].validate !==
          undefined &&
          this[this.props.steps[this.state.currentStep].stepId].validate()) ||
          this[this.props.steps[this.state.currentStep].stepId].validate ===
            undefined)) ||
      this.props.validate === undefined
    ) {
      if (
        this[this.props.steps[this.state.currentStep].stepId].sendState !==
        undefined
      ) {
        this.setState({
          allStates: {
            ...this.state.allStates,
            [this.props.steps[this.state.currentStep].stepId]: this[
              this.props.steps[this.state.currentStep].stepId
            ].sendState(),
          },
        });
      }
      if (this.schedulepickup.state.selectedShipmentType === "Ocean") {
        let steps = this.props.steps;
        pacakageStep = steps.filter((x) => x.stepName === "Package");

        if (pacakageStep.length) {
          steps.splice(3, 1);
        }
      } else {
        if (pacakageStep.length) {
          this.props.steps.splice(3, 0, pacakageStep[0]);
          pacakageStep = [];
        }
      }

      var key = this.state.currentStep + 1;
      this.setState({
        currentStep: key,
        nextButton: this.props.steps.length > key + 1 ? true : false,
        previousButton: key > 0 ? true : false,
        finishButton: this.props.steps.length === key + 1 ? true : false,
      });

      this.refreshAnimation(key);
    }
  }

  previousButtonClick() {
    if (
      this[this.props.steps[this.state.currentStep].stepId].sendState !==
      undefined
    ) {
      this.setState({
        allStates: {
          ...this.state.allStates,
          [this.props.steps[this.state.currentStep].stepId]: this[
            this.props.steps[this.state.currentStep].stepId
          ].sendState(),
        },
      });
    }
    var key = this.state.currentStep - 1;
    if (key >= 0) {
      this.setState({
        currentStep: key,
        nextButton: this.props.steps.length > key + 1 ? true : false,
        previousButton: key > 0 ? true : false,
        finishButton: this.props.steps.length === key + 1 ? true : false,
      });
      this.refreshAnimation(key);
    }
  }
  EditButtonClick() {
    const { history } = this.props.props;
    var stateset = {};
    if (!CommonConfig.isEmpty(this.props.props.location.state)) {
      if (this.props.props.location.state.skipstep1 === true) {
        stateset = this.props.props.location.state.state;
      }
    }
    history.push({
      pathname: "GetRates",
      state: { state: stateset },
    });
  }
  async finishButtonClick() {
    if (
      this.props.validate === false ||
      (this.props.validate &&
        ((this[this.props.steps[this.state.currentStep].stepId].validate !==
          undefined &&
          (await this[this.props.steps[this.state.currentStep].stepId].validate(
            {
              ...this.state.allStates,
              [this.props.steps[this.state.currentStep].stepId]: this[
                this.props.steps[this.state.currentStep].stepId
              ].sendState(),
            }
          ))) ||
          this[this.props.steps[this.state.currentStep].stepId].validate ===
            undefined))
    ) {
      this.setState({ finishDisabled: true });

      this.setState({
        allStates: {
          ...this.state.allStates,
          [this.props.steps[this.state.currentStep].stepId]: this[
            this.props.steps[this.state.currentStep].stepId
          ].sendState(),
        },
      });

      this[
        this.props.steps[this.state.currentStep].stepId
      ].postScheduleShipment(this.state.allStates);
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

  render() {
    const { classes, color, steps } = this.props;

    return (
      <div className={classes.wizardContainer} ref={this.wizard}>
        {/* <Card className={classes.card}> */}
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
                      this.navigationStepChange(key, this.state.currentStep);
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
                  props={this.state.props.props}
                />
              </div>
            );
          })}
          <div className="shipment-submit mt-10">
            <div className="left">
              {this.state.previousButton ? (
                <Button
                  className={this.props.previousButtonClasses}
                  onClick={() => this.previousButtonClick()}
                >
                  {this.props.previousButtonText}
                </Button>
              ) : null}
            </div>
            <div className="right">
              {this.state.EditButton ? (
                <Button
                  color="rose"
                  className={this.props.nextButtonClasses}
                  onClick={() => this.EditButtonClick()}
                >
                  {this.props.EditButtonText}
                </Button>
              ) : null}
              {this.state.nextButton ? (
                <Button
                  color="rose"
                  className={this.props.nextButtonClasses}
                  onClick={() => this.nextButtonClick()}
                >
                  {this.props.nextButtonText}
                </Button>
              ) : null}
              {this.state.finishButton ? (
                <Button
                  disabled={this.state.finishDisabled}
                  color="rose"
                  className={this.finishButtonClasses}
                  onClick={() => this.finishButtonClick()}
                >
                  {this.props.finishButtonText}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
        <div className={classes.footer}>
          <div className={classes.clearfix} />
        </div>
        {/* </Card> */}
      </div>
    );
  }
}

Wizard.defaultProps = {
  color: "rose",
  title: "Here should go your title",
  subtitle: "And this would be your subtitle",
  previousButtonText: "Previous",
  previousButtonClasses: "",
  nextButtonClasses: "",
  nextButtonText: "Next",
  EditButtonText: "Edit",
  finishButtonClasses: "",
  finishButtonText: "Finish",
};

Wizard.propTypes = {
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
  title: PropTypes.string,
  subtitle: PropTypes.string,
  previousButtonClasses: PropTypes.string,
  previousButtonText: PropTypes.string,
  nextButtonClasses: PropTypes.string,
  nextButtonText: PropTypes.string,
  EditButtonText: PropTypes.string,
  finishButtonClasses: PropTypes.string,
  finishButtonText: PropTypes.string,
  finishButtonClick: PropTypes.func,
  validate: PropTypes.bool,
};

export default withStyles(wizardStyle)(Wizard);
