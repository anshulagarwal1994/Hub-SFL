import React, { Component } from "react";
import GridContainer from "components/Grid/GridContainer.js";
import { CommonConfig } from "../../utils/constant";
import GridItem from "components/Grid/GridItem.js";
import { makeStyles } from "@material-ui/core/styles";
import CardBody from "components/Card/CardBody.js";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import Card from "components/Card/Card";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ArchiveIcon from "@material-ui/icons/Archive";
import LocalMoviesIcon from "@material-ui/icons/LocalMovies";
import EditSalesLeadIcon from "@material-ui/icons/Edit";
import VendorListIcon from "@material-ui/icons/FormatListBulleted";
import User from "@material-ui/icons/AccountBox";
import ChatIcon from "@material-ui/icons/Chat";
import ReviewsIcon from "@material-ui/icons/RateReview";

const useStyles = () => makeStyles(styles);
const classes = useStyles();

export class ManagementNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AccountSteps: [
        {
          stepName: "User",
          stepId: "User Management",
          path: "UserList",
          IsAccess: 0,
          Icon: User,
          classname: "inactive",
        },
        {
          stepName: "Service",
          stepId: "Service Management",
          IsAccess: 0,
          path: "Service",
          Icon: EditSalesLeadIcon,
          classname: "inactive",
        },
        {
          stepName: "Vendor",
          stepId: "Vendor Management",
          IsAccess: 0,
          path: "Vendor",
          Icon: VendorListIcon,
          classname: "inactive",
        },
        {
          stepName: "Container",
          stepId: "Container Management",
          IsAccess: 0,
          path: "Container",
          Icon: LocalMoviesIcon,
          classname: "inactive",
        },
        {
          stepName: "Lead Assignment",
          stepId: "Lead Assignment",
          IsAccess: 0,
          path: "LeadUserList",
          Icon: ArchiveIcon,
          classname: "inactive",
        },
        {
          stepName: "Chat Management",
          stepId: "Chat Management",
          IsAccess: 0,
          path: "ChatManagement",
          Icon: ChatIcon,
          classname: "inactive",
        },
        {
          stepName: "Review ",
          stepId: "Review Management",
          IsAccess: 0,
          path: "Review",
          Icon: ReviewsIcon,
          classname: "inactive",
        },
        {
          stepName: "Consolidation Center",
          stepId: "Consolidation Center Management",
          IsAccess: 0,
          path: "ConsolidationCenterList",
          Icon: EditSalesLeadIcon,
          classname: "inactive",
        },
        {
          stepName: "Credit Card",
          stepId: "Credit Card Management",
          IsAccess: 0,
          path: "CreditCardList",
          Icon: EditSalesLeadIcon,
          classname: "inactive",
        },
        {
          stepName: "Ocean Tracking",
          stepId: "Ocean Tracking Management",
          IsAccess: 0,
          path: "OceanAutoTrackingList",
          Icon: EditSalesLeadIcon,
          classname: "inactive",
        },
        {
          stepName: "Bombino Rates",
          stepId: "Bombino Rates Management",
          IsAccess: 0,
          path: "AddUpdateBombinoRates",
          Icon: EditSalesLeadIcon,
          classname: "inactive",
        },

        // {
        //   stepName: "Referred By",
        //   stepId: "Referred Management",
        //   IsAccess: 0,
        //   path: "ReferredBy",
        //   Icon: EditSalesLeadIcon,
        //   classname: "inactive",
        // },
        {
          stepName: "Sales Lead - Referred By",
          stepId: "Sales Lead Reffered",
          IsAccess: 0,
          path: "ReferredBy",
          Icon: EditSalesLeadIcon,
          classname: "inactive",
        },
      ],
      navigate: "",
    };
  }

  componentDidMount() {
    this.showHide();
  }

  showHide() {
    let steps = this.state.AccountSteps;
    steps.map((step) => {
      step.IsAccess = CommonConfig.getUserAccess(step.stepId)
        ? CommonConfig.getUserAccess(step.stepId).ReadAccess
        : 0;
    });
    this.setState({
      AccountSteps: steps,
    });
  }

  accountReportList = () => {
    return this.state.AccountSteps.map((step) => {
      return step.IsAccess === 1 ? (
        <GridItem xs={12} sm={12} md={4}>
          <div
            className="rp-box"
            onClick={(e) => this.reportNavigate(e, step.path)}
          >
            <span className="rp-icon">
              <step.Icon />
            </span>
            <p>{step.stepName}</p>
          </div>
        </GridItem>
      ) : null;
    });
  };

  reportNavigate = (e, path) => {
    this.props.history.push({
      pathname: path,
    });
  };

  render() {
    const { navigate } = this.state;
    return (
      <GridItem>
        <Card>
          <CardHeader className="btn-right-outer" color="primary" icon>
            <CardIcon color="primary">
              <AssignmentIcon />
            </CardIcon>
            <h4 className="margin-right-auto text-color-black">Management</h4>
          </CardHeader>
          <CardBody>
            <div className="rp-outer">
              <GridContainer>{this.accountReportList()}</GridContainer>
            </div>
          </CardBody>
        </Card>
      </GridItem>
    );
  }
}

export default ManagementNavigation;
