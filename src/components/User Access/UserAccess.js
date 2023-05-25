import React, { Component } from "react";
import { CommonConfig } from "../../utils/constant";
import api from "../../utils/apiClient";
import cogoToast from "cogo-toast";
import CardIcon from "components/Card/CardIcon.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import HeadsetMic from "@material-ui/icons/HeadsetMic";
import CardHeader from "components/Card/CardHeader.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import TextField from "@material-ui/core/TextField";
import Button from "components/CustomButtons/Button.js";
import Autocomplete from "@material-ui/lab/Autocomplete";

class UserAccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ModuleID: 0,
      moduleidErr: false,
      moduleidHelperText: "",
      moduleList: [],

      UserID: 0,
      useridHelperText: "",
      useridErr: "",
      userList: [],
    };
  }

  componentDidMount() {
    this.getModulelist();
    this.getUserlist();
  }

  getModulelist() {
    try {
      api
        .get("authentication/getModuleName")
        .then((res) => {
          if (res.success) {
            this.setState({ moduleList: res.data });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error..", err);
    }
  }

  getUserlist() {
    try {
      api
        .get("authentication/getLoginID")
        .then((res) => {
          if (res.success) {
            this.setState({ userList: res.data });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error..", err);
    }
  }

  selectChange = (event, value, type) => {
    if (type === "modulename") {
      this.setState({ ModuleID: value });
    } else if (type === "userid") {
      this.setState({ UserID: value });
    }
  };

  handleSave = (e) => {
    try {
      let data = {
        UserID: this.state.UserID.value,
        userId: CommonConfig.loggedInUserData().PersonID,
        ModuleID: this.state.ModuleID.value,
      };
      api.post("authentication/accessUserModule", data).then((res) => {
        if (res.success) {
          cogoToast.success("User Access Granted");
        } else {
          cogoToast.error("Something went wrong");
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const {
      moduleidHelperText,
      moduleidErr,
      ModuleID,
      UserID,
      useridHelperText,
      useridErr,
    } = this.state;
    const ModuleList = this.state.moduleList.map((module) => {
      return { value: module.ModuleID, label: module.ModuleName };
    });
    const UserList = this.state.userList.map((user) => {
      return { value: user.SecurityUserID, label: user.LoginID };
    });

    return (
      <GridContainer className="UserList-outer">
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <HeadsetMic />
              </CardIcon>
              <h4>Add User Access</h4>
            </CardHeader>
            <CardBody>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={4}>
                  <Autocomplete
                    options={ModuleList}
                    getOptionLabel={(option) =>
                      option.label ? option.label : option
                    }
                    id="modulename"
                    value={ModuleID}
                    onChange={(event, value) =>
                      this.selectChange(event, value, "modulename")
                    }
                    onFocus={() =>
                      this.setState({
                        moduleidErr: false,
                        moduleidHelperText: "",
                      })
                    }
                    ManagedBy
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        label="Module Name"
                        error={moduleidErr}
                        helperText={moduleidHelperText}
                        fullWidth
                      />
                    )}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <Autocomplete
                    options={UserList}
                    getOptionLabel={(option) =>
                      option.label ? option.label : option
                    }
                    id="userid"
                    value={UserID}
                    onChange={(event, value) =>
                      this.selectChange(event, value, "userid")
                    }
                    onFocus={() =>
                      this.setState({ useridErr: false, useridHelperText: "" })
                    }
                    ManagedBy
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        label="User Name"
                        error={useridErr}
                        helperText={useridHelperText}
                        fullWidth
                      />
                    )}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer justify="center">
                <GridItem xs={6}>
                  <Button
                    type="primary"
                    onClick={(e) => this.handleSave(e)}
                    className="width-150 mr-4"
                    htmlType="submit"
                  >
                    Add User Access
                  </Button>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default UserAccess;
