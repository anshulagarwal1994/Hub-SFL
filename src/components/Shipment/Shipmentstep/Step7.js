/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
// material ui icons
import ReactTable from "react-table";
import moment from "moment";
import { CommonConfig } from "../../../utils/constant";
const useStyles = makeStyles(styles);
const classes = () => {
  return useStyles();
};

class Step7 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Attachments: [],
      objAttachment: {
        Index: 0,
        FileName: "",
        Status: "Active",
        DocumentCreatedOn: moment().format(CommonConfig.dateFormat.dateOnly),
        DocumentCreatedBy: CommonConfig.loggedInUserData().Name,
      },
    };
  }

  sendState() {
    return this.state;
  }

  // componentDidMount(){
  //   this.setState({ Attachments: [this.state.objAttachment] });
  // }

  AddNewRowData = () => {
    let attachments = this.state.Attachments;
    let IsValid = true;
    for (let i = 0; i < this.state.Attachments.length; i++) {
      if (!attachments[i].hasOwnProperty("AttachmentName")) {
        IsValid = false;
      }
    }
    var AttachmentList = this.state.Attachments.filter(
      (x) => x.Status === "Active" && (x.FileName === "" || x.FileName === null)
    );
    if (AttachmentList.length === 0 && IsValid) {
      const objAttachment = {
        Index: AttachmentList.filter((x) => x.Status === "Active").length + 1,
        FileName: "",
        Status: "Active",
        DocumentCreatedOn: moment().format(CommonConfig.dateFormat.dateOnly),
        DocumentCreatedBy: CommonConfig.loggedInUserData().Name,
      };
      this.setState({
        Attachments: [...this.state.Attachments, objAttachment],
      });
    } else {
      cogoToast.error("Please fill above row first");
    }
  };

  handleDocumentChange = (e, record) => {
    var Index = this.state.Attachments.indexOf(record.original);
    this.state.Attachments[Index]["FileName"] = e.target.value;
    this.setState({ Attachments: [...this.state.Attachments] });
  };

  fileUpload = (event, record) => {
    const files = event.target.files[0];
    let AttachmentList = this.state.Attachments;
    let Index = this.state.Attachments.indexOf(record.original);
    AttachmentList[Index]["AttachmentName"] = files.name;
    AttachmentList[Index]["AttachmentType"] = files.type;
    AttachmentList[Index]["AttachmentID"] = null;
    AttachmentList[Index]["Status"] = "Active";
    this.setState({
      Attachments: AttachmentList,
      AttachmentList: [...this.state.AttachmentList, files],
    });
  };

  handleDocumentDelete = (e, record) => {
    var AttachmentList = this.state.Attachments;
    var Index = AttachmentList.indexOf(record);
    AttachmentList[Index]["Status"] = "Inactive";
    this.setState({ Attachments: AttachmentList });
  };

  renderDocumentName = (cellInfo) => {
    return (
      <div className="table-input-slam">
        <CustomInput
          inputProps={{
            value: cellInfo.original.FileName,
            // disabled:cellInfo.original.AttachmentPath,
            onChange: (event) => this.handleDocumentChange(event, cellInfo),
          }}
        />
      </div>
    );
  };

  handleSave = () => {
    console.log("Step6.......");
  };
  async componentDidMount() {
    await this.setState({ Attachments: [this.state.objAttachment] });
  }
  render() {
    const columns = [
      {
        Header: "Document Name",
        accessor: "Name",
        width: 220,
        maxWidth: 220,
        Cell: this.renderDocumentName,
      },
      {
        Header: "CreatedOn",
        accessor: "DocumentCreatedOn",
        width: 220,
        maxWidth: 220,
      },
      {
        Header: "Added By",
        accessor: "DocumentCreatedBy",
        width: 280,
        maxWidth: 280,
      },
      {
        Header: "Attachment",
        accessor: "actions",
        width: 80,
        filterable: false,
        sortable: false,
        Cell: (record) => {
          return <div>View File</div>;
        },
      },
      {
        width: 100,
        filterable: false,
        sortable: false,
        Header: "Actions",
        Cell: (record) => {
          return record.original.AttachmentPath ? (
            <div className="align-right">
              {this.state.Access.DeleteAccess === 1 ? (
                <Button
                  justIcon
                  color="danger"
                  className="Plus-btn"
                  onClick={(e) => this.handleDocumentDelete(e, record.original)}
                >
                  <i className={"fas fa-minus"} />
                </Button>
              ) : null}
            </div>
          ) : this.state.Attachments.filter((x) => x.Status === "Active")
              .length ===
            record.index + 1 ? (
            <div className="align-right">
              <Button
                justIcon
                color="facebook"
                onClick={() => this.AddNewRowData()}
                className="Plus-btn "
              >
                <i className={"fas fa-plus"} />
              </Button>
            </div>
          ) : null;
        },
      },
    ];

    return (
      <div>
        <form>
          <GridContainer>
            <GridItem xs={12} sm={6} md={6}>
              <h3 className="margin-right-auto text-color-black">
                Documentation
              </h3>
            </GridItem>
          </GridContainer>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12}>
              <ReactTable
                data={this.state.Attachments.filter(
                  (x) => x.Status === "Active"
                )}
                sortable={true}
                filterable={true}
                resizable={false}
                // defaultSorted={[
                //     {
                //       id: "CreatedOn",
                //       desc: true
                //     }
                //   ]}
                minRows={2}
                columns={columns}
                defaultPageSize={10}
                align="center"
                className="-striped -highlight"
              />
            </GridItem>
          </GridContainer>
        </form>
        {/* <GridContainer className="MuiGrid-justify-xs-center">
          <GridItem xs={12} sm={12} md={12}>
            <div className="package-table">
              <h3>Documentation</h3>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Document Name</th>
                    <th>Action</th>
                    <th>Uploaded by</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Auto Generated</td>
                    <td>Shipper Profile</td>
                    <td>View</td>
                    <td>Auto</td>
                  </tr>
                  <tr>
                    <td>Auto Generated</td>
                    <td>Shipper Profile</td>
                    <td>View</td>
                    <td>Auto</td>
                  </tr>
                  <tr>
                    <td>Auto Generated</td>
                    <td>Shipper Profile</td>
                    <td>View</td>
                    <td>Auto</td>
                  </tr>
                  <tr>
                    <td>Auto Generated</td>
                    <td>Shipper Profile</td>
                    <td>View</td>
                    <td>Auto</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="package-table">
              <h3>Pending Documentation</h3>
              <table>
                <thead>
                  <tr>
                    <th>Valued Inventory</th>
                    <th>Signed Contract</th>
                    <th>Photo Id</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Click to view</td>
                    <td>Click to Upload</td>
                    <td>Click to Upload</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </GridItem>
        </GridContainer> */}
      </div>
    );
  }
}

Step7.propTypes = {
  classes: PropTypes.object,
};

export default withStyles()(Step7);
