import React, { Component } from "react";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import HeadsetMic from "@material-ui/icons/HeadsetMic";
import CheckImage from "./check.svg";
// import SweetAlert from  "../../views/Components/SweetAlert";

// import ReactTable from 'react-table'

class addclaimconformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  redirectAdd = () => {
    this.props.history.push("/admin/AddaClaim");
  }

  render() {
    return (
      
      <Card>
        <CardHeader className="btn-right-outer" color="primary" icon>
            <CardIcon color="primary">
            <HeadsetMic />
            </CardIcon>
            <h4 className="margin-right-auto text-color-black">View Claim</h4>
            <Button color="primary" onClick = {() => this.redirectAdd()}>Add Claim</Button>
        </CardHeader>
        <CardBody>
          <div className="claim-confirm">
            <img src={CheckImage}></img> 
            <h3>You Claim has been successfully submitted.</h3>
            <p>Claims representative will contact you within 1-3 business days.</p>
          </div>
        </CardBody>
      </Card>
      
      
      // {/* <SweetAlert
      //   success
      //   style={{ display: "block", marginTop: "-100px" }}
      //   title="Good job!"
      //   onConfirm={() => hideAlert()}
      //   onCancel={() => hideAlert()}
      //   confirmBtnCssClass={classes.button + " " + classes.success}
      // ></SweetAlert> */}
      // {/* <i class="fa fa-check-circle" aria-hidden="true"></i> */}
      
    );
  }
}
export default addclaimconformation;