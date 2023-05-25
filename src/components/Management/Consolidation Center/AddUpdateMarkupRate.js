import React, { Component } from "react";
import SimpleBackdrop from "../../../utils/general";
import ReactTable from "react-table";
import api from "../../../utils/apiClient";
import { CommonConfig } from "../../../utils/constant";
import moment from "moment";
import cogoToast from "cogo-toast";
import UserList from "@material-ui/icons/People";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import Cardbody from "components/Card/CardBody.js";

class AddUpdateMarkupRate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Loading: false,
            MarkupList: [],
            filterProps: [],
            sortProps: [],
            previousFilterList: [],
            previousSortList: [],

        };
    }

    componentDidMount() {
        this.getMarkupList();
        if (
            this.props.history.location.state !== undefined &&
            this.props.history.location.state !== null
        ) {
            this.setState({
                previousFilterList: this.props.history.location.state.filterlist,
                previousSortList: this.props.history.location.state.sortlist,
            });
        } else {
            var defaultSort = {
                id: "CreatedOn",
                desc: true,
            };
            this.setState({ previousSortList: [defaultSort] });
        }
    }

    handleAddRow = () => {
        const row = {
            MarkupID: '',
            StartCFT: "",
            EndCFT: '',
            Markup: '',
            Status:'Active',
            Index: this.state.MarkupList.length+1,
        };
        this.setState({ MarkupList: [...this.state.MarkupList, row] });
    };

    handleDeleteRow = (e, record) => {
        var MarkupList = this.state.MarkupList;
        var id = MarkupList.filter((x) => x.MarkupID === record.MarkupID)
        for(var i = 0;i<MarkupList.length;i++){
            if(id[0].MarkupID === MarkupList[i]["MarkupID"] ){
                MarkupList[i]["Status"] = "Inactive";
            }
        }
        this.setState({ MarkupList: MarkupList });
      };

    saveMarkup = (type) => {
        try {
            this.setState({ Loading: true });
            let UserDetails = {
                Data: this.state.MarkupList
            };
            api.post("userManagement/addUpdateMarkup", UserDetails).then((res) => {
                if (res.success) {
                    window.location.reload();
                } else {
                    cogoToast.error("Something Went Wrong");
                }
            })
                .catch((err) => {
                    this.setState({ Loading: false });
                    cogoToast.error(err);
                });
        } catch (error) {
            this.hideLoader();
            cogoToast.error("Something Went Wrong");
        }
    };

    cancelUser = () => {
        this.props.history.push({
            pathname: "/admin/ConsolidationCenterList",
        });
    };

    getMarkupList() {
        try {
            this.setState({ Loading: true });
            api.get("userManagement/getMarkupList").then((res) => {
                if (res.success) {
                    var objData={};
                    for(var i = 0; i< res.data.length;i++){
                        objData = {
                            Index: i,
                            MarkupID: res.data[i].MarkupID,
                            StartCFT: res.data[i].StartCFT,
                            EndCFT: res.data[i].EndCFT,
                            Markup: res.data[i].Markup,
                            Status: res.data[i].Status,
                          };
                          this.setState({MarkupList: [...this.state.MarkupList, objData]});
                    }
                    this.setState({Loading: false});
                } else {
                    cogoToast.error("Something Went Wrong");
                }
            })
                .catch((err) => {
                    cogoToast.error("Something Went Wrong");
                });
        } catch (error) { }
    }

    addMarkup = () => {
        this.props.history.push("AddConsolidationCenter/");
    };

    handledInput = (e, id, Type) => {
        let OceanMarkupData = this.state.MarkupList;
        let j = OceanMarkupData.findIndex((x) => x.MarkupID === id);

        let x = document.getElementsByTagName("input");
        let val = e.target.value;
        if (Type === "MarkupStartCFT") {
            if (CommonConfig.isEmpty(val)) {
                OceanMarkupData[j].StartCFT = "";
                x[j].className = "form-control is-invalid";
            } else {
                OceanMarkupData[j].StartCFT = val;
            }
        } else if (Type === "MarkupEndCFT") {
            if (CommonConfig.isEmpty(val)) {
                OceanMarkupData[j].EndCFT = "";
                x[j].className = "form-control is-invalid";
            } else {
                OceanMarkupData[j].EndCFT = val;
            }
        } else if (Type === "Charge") {
            if (CommonConfig.isEmpty(val)) {
                OceanMarkupData[j].Markup = "";
                x[j].className = "form-control is-invalid";
            } else {
                OceanMarkupData[j].Markup = val;
            }
        }
        this.setState({ MarkupList: OceanMarkupData });
    };

    handleBlur = (e, id, Type) => {
        let OceanMarkupData = this.state.MarkupList;
        let j = OceanMarkupData.findIndex((x) => x.MarkupID === id);

        let x = document.getElementsByTagName("input");
        let val = e.target.value;
        if (Type === "MarkupStartCFT") {
            OceanMarkupData[j].StartCFT = val;
            x[j].className = "form-control";
        } else if (Type === "MarkupEndCFT") {
            OceanMarkupData[j].EndCFT = val;
            x[j].className = "form-control";
        } else if (Type === "Charge") {
            OceanMarkupData[j].Markup = val;
            x[j].className = "form-control";
        }
        this.setState({ MarkupList: OceanMarkupData });
    };

    setFilterProps = (filterValue) => {
        this.setState({
            filterProps: filterValue.filtered,
            sortProps: filterValue.sorted,
        });
    };

    filterProps = (e) => {
        if (this.state.filterProps !== e.filtered) {
            this.setFilterProps(e);
        }
        if (this.state.sortProps !== e.sorted) {
            this.setFilterProps(e);
        }
        return "";
    };

    editUser = (record) => {
        const { history } = this.props;
        let CenterID = record.original.ID;
        history.push({
            pathname: "AddConsolidationCenter",
            state: CenterID,
            filterlist: this.state.filterProps,
            sortlist: this.state.sortProps,
        });
    };

    renderMarkupData = () => {
        return this.state.MarkupList.filter(
            (x) => x.Status === "Active").map((service) => {
            const {
                MarkupID,
                StartCFT,
                EndCFT,
                Markup,
                Status,
                Index,
            } = service;
            var data = {
                MarkupID: MarkupID,
                StartCFT: StartCFT,
                EndCFT: EndCFT,
                Markup: Markup,
                Status: Status,
                Index:Index,
            };
            return (
                <tr key={MarkupID}>
                    <td>
                        <input
                            type="text"
                            name="StartCFT"
                            id="StartCFT"
                            className="form-control"
                            value={StartCFT}
                            onChange={(event) =>
                                this.handledInput(event, MarkupID, "MarkupStartCFT")
                            }
                            onBlur={(e) =>
                                this.handleBlur(e, MarkupID, "MarkupStartCFT")
                            }
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            name="EndCFT"
                            id="EndCFT"
                            className="form-control"
                            value={EndCFT}
                            onChange={(event) =>
                                this.handledInput(event, MarkupID, "MarkupEndCFT")
                            }
                            onBlur={(e) =>
                                this.handleBlur(e, MarkupID, "MarkupEndCFT")
                            }
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            name="Charge"
                            id="Charge"
                            className="form-control"
                            value={Markup}
                            onChange={(event) =>
                                this.handledInput(event, MarkupID, "Charge")
                            }
                            onBlur={(e) =>
                                this.handleBlur(e, MarkupID, "Charge")
                            }
                        />
                    </td>
                    <td>
                        <div className="align-right">
                            {(MarkupID !== 0) ? (
                                <Button
                                    justIcon
                                    color="danger"
                                    className="Plus-btn"
                                    onClick={(e) => this.handleDeleteRow(e, data)}
                                >
                                    <i className={"fas fa-minus"} />
                                </Button>
                            ) : null}

                            {this.state.MarkupList.length ===
                                Index+1 ? (
                                <div className="align-right">
                                    <Button
                                        justIcon
                                        color="facebook"
                                        onClick={() => this.handleAddRow()}
                                        className="Plus-btn "
                                    >
                                        <i className={"fas fa-plus"} />
                                    </Button>
                                </div>
                            ) : null}
                        </div>
                    </td>
                </tr>
            );
        });
    };

    render() {
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
                            <h4 className="margin-right-auto text-color-black">Markup Rates</h4>
                        </CardHeader>
                        <Cardbody>
                            <div className="shipment-pane mt-20" id="markupdetails">
                                <div className="package-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Start CFT</th>
                                                <th>End CFT</th>
                                                <th>Charge</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>{this.renderMarkupData()}</tbody>
                                    </table>
                                </div>
                            </div>
                        </Cardbody>
                    </Card>
                    <div className="right">
                        <Button color="rose" onClick={() => this.saveMarkup(false)}>
                            Save
                        </Button>
                        <Button color="secondary" onClick={() => this.cancelUser()}>
                            Cancel
                        </Button>
                    </div>
                </GridItem>
            </GridContainer>
        );
    }
}

export default AddUpdateMarkupRate;
