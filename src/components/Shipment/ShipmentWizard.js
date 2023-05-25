import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "components/CustomButtons/Button.js";
import wizardStyle from "assets/jss/material-dashboard-pro-react/components/wizardStyle.js";

// let pacakageStep = [];
class ShipmentWizard extends React.Component {
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
      peviousButton: false,
      finishButton: this.props.steps.length === 1 ? true : false,
      width: width,
      movingTabStyle: {
        transition: "transform 0s",
      },
      allStates: {},
      returnState: {},
      props: this.props,
    };

    this.navigationStepChange = this.navigationStepChange.bind(this);
    this.refreshAnimation = this.refreshAnimation.bind(this);
    this.previousButtonClick = this.previousButtonClick.bind(this);
    this.previousButtonClick = this.previousButtonClick.bind(this);
    this.finishButtonClick = this.finishButtonClick.bind(this);
    this.updateWidth = this.updateWidth.bind(this);
  }
  wizard = React.createRef();

  componentDidMount() {
    this.refreshAnimation(0);
    window.addEventListener("resize", this.updateWidth);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWidth);
  }

  updateWidth() {
    this.refreshAnimation(this.state.currentStep);
  }

  navigationStepChange(key) {
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
            this[this.props.steps[i].stepId].validate !== undefined &&
            this[this.props.steps[i].stepId].validate() === false
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

  nextButtonClick() {

    console.log("IN NEXT BTN")
    
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

  deleteVendor = () => {
    this[this.props.steps[this.state.currentStep].stepId].deleteVendorByID();
  };
  finishButtonClick() {
    // if ((this.props.validate === false ) ||
    //   (this.props.validate && ((this[this.props.steps[this.state.currentStep].stepId].validate !== undefined &&
    //     this[this.props.steps[this.state.currentStep].stepId].validate())  ||
    //     this[this.props.steps[this.state.currentStep].stepId].validate === undefined))) {
    //       this.setState(
    //         {
    //           allStates: {
    //             ...this.state.allStates,
    //             [this.props.steps[this.state.currentStep].stepId]: this[
    //               this.props.steps[this.state.currentStep].stepId
    //             ].sendState()
    //           }
    //         }
    //   );

    var returnObj = {};
    returnObj.returnState = this.props.steps[
      this.state.currentStep
    ].returnState;
    returnObj.allStates = this[
      this.props.steps[this.state.currentStep].stepId
    ].state;
    this[this.props.steps[this.state.currentStep].stepId].handleSave(returnObj);

    // }
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

  buttonText = () => {
    if (this.state.currentStep === 0) {
      return this.props.step1SaveButton;
    }
    if (this.state.currentStep === 1) {
      return this.props.step2SaveButton;
    }
    if (this.state.currentStep === 2) {
      return this.props.step3SaveButton;
    }
    if (this.state.currentStep === 3) {
      return this.props.step4SaveButton;
    }
    if (this.state.currentStep === 4) {
      return this.props.step5SaveButton;
    }
    if (this.state.currentStep === 5) {
      return this.props.step6SaveButton;
    }
  };

  render() {
    const { classes, color, steps } = this.props;
    return (
      <div className={classes.wizardContainer} ref={this.wizard}>
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
                  history={this.state.props.history}
                />
              </div>
            );
          })}
        </div>
        <div className={classes.footer}>
          <div className={classes.left}></div>
          <div className={classes.right}>
            <Button
              color="rose"
              className={this.finishButtonClasses}
              onClick={() => this.finishButtonClick()}
            >
              {this.props.SaveButtonText}
            </Button>
          </div>
          <div className={classes.clearfix} />
        </div>
      </div>
    );
  }
}

ShipmentWizard.defaultProps = {
  color: "rose",
  title: "Here should go your title",
  subtitle: "And this would be your subtitle",
  previousButtonText: "Previous",
  previousButtonClasses: "",
  nextButtonClasses: "",
  nextButtonText: "Next",
  finishButtonClasses: "",
  finishButtonText: "Finish",
  SaveButtonText: "Save",
  step1SaveButton: "Step1",
  step2SaveButton: "Step2",
  step3SaveButton: "Step3",
  step4SaveButton: "Step4",
  step5SaveButton: "Step5",
  step6SaveButton: "Step6",
};

ShipmentWizard.propTypes = {
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
  finishButtonClasses: PropTypes.string,
  finishButtonText: PropTypes.string,
  finishButtonClick: PropTypes.func,
  validate: PropTypes.bool,
};

export default withStyles(wizardStyle)(ShipmentWizard);
