import React, { Component } from "react";
import api from "../../../utils/apiClient";
import cogoToast from "cogo-toast";

class ReviewTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
    };
  }

  componentDidMount() {
    console.log("data", this.props.match.params);
    this.UrlClicked();
  }

  UrlClicked = () => {
    api
      .post("ReviewTemplate/UrlClicked")
      .then((res) => {
        if (res.success) {
          cogoToast.success("logout successfully");
        } else {
          cogoToast.error(res.message);
        }
      })
      .catch((err) => {
        console.log("setLock err", err);
      });
  };

  render() {
    return <h4 className="margin-right-auto text-color-black">review</h4>;
  }
}
export default ReviewTemplate;
