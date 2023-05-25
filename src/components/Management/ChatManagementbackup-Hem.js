import React, { Component } from "react";
import api from "../../utils/apiClient";
import SimpleBackdrop from "../../utils/general";
import ReactTable from "react-table";
import { CommonConfig } from "utils/constant";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import { ForumOutlined } from "@material-ui/icons";
import { Checkbox, FormControlLabel } from "@material-ui/core";

class ChatManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Loading: false,
      AgentList: [],
      ReadAccessChecked: false,
      WriteAccessChecked: false,
      DeleteAccessChecked: false,
      AllAccessChecked: false,
    };
  }

  componentDidMount() {
    this.getAgentList();
  }

  showLoador = () => {
    this.setState({ Loading: true });
  };

  hideLoador = () => {
    this.setState({ Loading: false });
  };

  updateUserAccess(e, record, value) {
    this.showLoador();
    let cbVal = e.target.checked;
    var data = {
      AcccessType: value,
      IsChecked: cbVal ? 1 : 0,
      userId: record.original.PersonId,
      moduleId: 35,
    };

    api.post("chatManagementAPI/updateUserAccess", data).then((res) => {
      this.getAgentList();
    });
  }

  changeUserAccessType(e, record, value) {
    if (e.target.checked == false) {
      var tempAccessArr = record.original.AcccessType.split(",");

      var tempAccessIdx = tempAccessArr.indexOf(value);
      if (tempAccessIdx > -1) {
        tempAccessArr.splice(tempAccessIdx, 1);
      }

      var newValue = "";
      if (tempAccessArr.length > 1) {
        newValue = tempAccessArr.join(",");
      } else {
        newValue = tempAccessArr[0];
      }

      if (newValue == undefined || newValue == null) {
        newValue = "";
      }
      var data = {
        newValue: newValue,
        personId: record.original.PersonId,
      };

      api.post("chatManagementAPI/changeUserAccessType", data).then((res) => {
        this.getAgentList();
      });
    } else {
      if (record.original.AcccessType == "") {
        var newValue = value;
      } else {
        var newValue = record.original.AcccessType + "," + value;
      }

      var data = {
        newValue: newValue,
        personId: record.original.PersonId,
      };

      api.post("chatManagementAPI/changeUserAccessType", data).then((res) => {
        this.getAgentList();
      });
    }
  }

  getAgentList() {
    this.showLoador();
    api.post("chatManagementAPI/getAgentList", {}).then((res) => {
      this.hideLoador();
      if (res.success) {
        this.setState({ AgentList: res.data[0] });
      }
    });
  }

  activeInactiveAgentStatus(agentId, IsAvailableForChat) {
    var data = {
      agentId: agentId,
      IsAvailableForChat: IsAvailableForChat,
    };
    api.post("customerChat/updateAgentChatActiveStatus", data).then((res) => {
      this.getAgentList();
      var sessionData = JSON.parse(localStorage.getItem("loggedInUserData"));
      if (res.Data.success == true) {
        if (sessionData.PersonID == agentId) {
          if (IsAvailableForChat == 0) {
            sessionData.IsAvailableForChat = 0;
          } else {
            sessionData.IsAvailableForChat = 1;
          }
          localStorage.setItem("loggedInUserData", JSON.stringify(sessionData));
        }
      }
    });
  }

  render() {
    const { AgentList } = this.state;

    const columns = [
      {
        Header: "User Name",
        maxWidth: 120,
        accessor: "UserName",
      },
      {
        Header: () => {
          return <div style={{ textAlign: "center" }}>Chat Module</div>;
        },
        maxWidth: 200,

        columns: [
          {
            Header: "Read",
            Cell: (record) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={record.original.ReadAccess}
                      onChange={(e) =>
                        this.updateUserAccess(e, record, "ReadAccess")
                      }
                    />
                  }
                  classes={{}}
                />
              );
            },
            maxWidth: 70,
            sortable: false,
            filterable: false,
          },
          {
            Header: "Write",
            Cell: (record) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={record.original.WriteAccess}
                      onChange={(e) =>
                        this.updateUserAccess(e, record, "WriteAccess")
                      }
                    />
                  }
                  classes={{}}
                />
              );
            },
            maxWidth: 70,
            sortable: false,
            filterable: false,
          },
          {
            Header: "Delete",
            Cell: (record) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={record.original.DeleteAccess}
                      onChange={(e) =>
                        this.updateUserAccess(e, record, "DeleteAccess")
                      }
                    />
                  }
                  classes={{}}
                />
              );
            },
            maxWidth: 70,
            sortable: false,
            filterable: false,
          },
          {
            Header: "All",
            Cell: (record) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={record.original.AllAccess}
                      onChange={(e) =>
                        this.updateUserAccess(e, record, "AllAccess")
                      }
                    />
                  }
                  classes={{}}
                />
              );
            },
            maxWidth: 70,
            sortable: false,
            filterable: false,
          },
        ],
      },
      {
        Header: () => {
          return <div style={{ textAlign: "center" }}>Chat Department</div>;
        },
        columns: [
          {
            Header: "Get Quote",
            width: 80,
            sortable: false,
            filterable: false,
            Cell: (record) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) =>
                        this.changeUserAccessType(e, record, "getQuoteLink")
                      }
                      checked={
                        record.original.AcccessType != null &&
                        record.original.AcccessType.includes("getQuoteLink")
                          ? true
                          : false
                      }
                    />
                  }
                  classes={{}}
                />
              );
            },
          },
          {
            Header: "Schedule Shipment",
            width: 120,
            sortable: false,
            filterable: false,
            Cell: (record) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) =>
                        this.changeUserAccessType(e, record, "scheduleLink")
                      }
                      checked={
                        record.original.AcccessType != null &&
                        record.original.AcccessType.includes("scheduleLink")
                          ? true
                          : false
                      }
                    />
                  }
                  classes={{}}
                />
              );
            },
          },
          {
            Header: "Track Shipment",
            width: 100,
            sortable: false,
            filterable: false,
            Cell: (record) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) =>
                        this.changeUserAccessType(
                          e,
                          record,
                          "trackShipmentLink"
                        )
                      }
                      checked={
                        record.original.AcccessType != null &&
                        record.original.AcccessType.includes(
                          "trackShipmentLink"
                        )
                          ? true
                          : false
                      }
                    />
                  }
                  classes={{}}
                />
              );
            },
          },
        ],
      },
      {
        Header: "Available For Chat",
        Cell: (record) => {
          if (record.original.IsAvailableForChat === "Yes") {
            return (
              <Button
                color="success"
                className="table-btn"
                onClick={() =>
                  this.activeInactiveAgentStatus(record.original.PersonId, 0)
                }
              >
                Active
              </Button>
            );
          } else {
            return (
              <Button
                color="danger"
                className="table-btn"
                onClick={() =>
                  this.activeInactiveAgentStatus(record.original.PersonId, 1)
                }
              >
                Inactive
              </Button>
            );
          }
        },
        sortable: false,
        filterable: false,
        width: 200,
      },
    ];

    return (
      <GridContainer className="UserList-outer">
        {this.state.Loading === true ? (
          <div className="loading">
            <SimpleBackdrop />
          </div>
        ) : null}
        <GridItem xs={12}>
          <Card>
            <CardHeader className="btn-right-outer" color="primary" icon>
              <CardIcon color="primary">
                <ForumOutlined />{" "}
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">Agent List</h4>
            </CardHeader>
            <CardBody>
              <ReactTable
                data={AgentList}
                minRows={0}
                filterable
                defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                resizable={false}
                columns={columns}
                defaultPageSize={10}
                showPaginationBottom={true}
                className="-striped -highlight chatMgtList"
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default ChatManagement;
