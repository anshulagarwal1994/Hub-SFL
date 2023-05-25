import React, { Component } from "react";
import ReactTable from "react-table";
import UserList from "@material-ui/icons/People";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import api from "../../utils/apiClient";
import { CommonConfig } from "../../utils/constant";
import cogoToast from "cogo-toast";
import SimpleBackdrop from "../../utils/general";

class addVendor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Loading: false,
      vendorList: [],
    };
  }
  componentDidMount() {
    this.getVendorList();
  }
  getVendorList() {
    try {
      api
        .get("vendor/getVendorList")
        .then((res) => {
          if (res.success) {
            this.setState({ vendorList: res.data, Loading: false });
          } else {
            cogoToast.error("Something Went Wrong");
          }
        })
        .catch((err) => {
          this.hideLoader();
          console.log("err..", err);
          cogoToast.error("Something Went Wrong");
        });
    } catch (error) {
      this.hideLoader();
      console.log("error..", error);
      cogoToast.error("Something Went Wrong");
    }
  }
  addVendor = () => {
    this.props.history.push("/admin/EditVendor");
  };

  render() {
    const { vendorList } = this.state;

    const columns = [
      {
        Header: "Name",
        accessor: "Name",
      },
      {
        Header: "Website",
        accessor: "Website",
      },
      {
        Header: "VendorType",
        accessor: "VendorType",
      },
      {
        Header: "CratedBy",
        accessor: "CreatedBy",
      },
      {
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        filterable: false,
        width: 70,
        Cell: (record) => {
          return (
            <Button justIcon color="info" onClick={() => this.editUser(record)}>
              <i className="fas fa-edit"></i>
            </Button>
          );
        },
      },
      {
        Header: "Status",
        width: 100,
        Cell: (record) => {
          if (record.original.Status === "Active") {
            return (
              <Button color="success" className="">
                Active
              </Button>
            );
          } else {
            return (
              <Button color="danger" className="">
                Inactive
              </Button>
            );
          }
        },
        sortable: false,
        filterable: false,
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
                <UserList />
              </CardIcon>
              <h4 className="margin-right-auto text-color-black">
                Vendor List
              </h4>
              <Button color="primary" className="" onClick={addVendor}>
                Add Vendor
              </Button>
            </CardHeader>
            <CardBody>
              <ReactTable
                data={vendorList}
                minRows={2}
                filterable
                defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                resizable={false}
                columns={columns}
                defaultPageSize={10}
                showPaginationBottom={true}
                className="-striped -highlight"
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default addVendor;
