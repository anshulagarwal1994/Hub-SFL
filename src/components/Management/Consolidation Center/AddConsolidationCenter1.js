/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import api from "../../../utils/apiClient";
import { CommonConfig } from "../../../utils/constant";
import moment from "moment";
import cogoToast from "cogo-toast";
import SimpleBackdrop from "../../../utils/general";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import InputLabel from "@material-ui/core/InputLabel";
import _ from "lodash";
import Button from "components/CustomButtons/Button.js";
import ReactTable from "react-table";
import MenuItem from "@material-ui/core/MenuItem";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import { green } from "@material-ui/core/colors";
import { red } from "@material-ui/core/colors";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import Cardbody from "components/Card/CardBody.js";
import Adduser from "@material-ui/icons/AccountCircle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import CardBody from "components/Card/CardBody";

const useStyles = makeStyles(styles);

const classes = () => {
    return useStyles();
};

class AddConsolidationCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Steps: [
                {
                    stepName: "Consolidation Center",
                    stepId: "addconsolidationcenter",
                    classname: "active",
                },
                {
                    stepName: "Service Rates",
                    stepId: "rateservice",
                    classname: "inactive",
                }
            ],
            filterProps: [],
            CenterName: "",
            Email: "",
            EmailID: "",
            Password: "",
            Mobile: "",
            MobileID: "",
            userModules: [],
            consolidationDataList: [],
            ConsolidationCenterDataList: [],

            centernameErr: false,
            emailErr: false,
            passwordErr: false,
            mobileErr: false,
            Loading: false,

            centernameHelperText: "",
            emailHelperText: "",
            passwordHelperText: "",
            mobileHelperText: "",

            checkCenterName: false,
            checkEmail: false,
            checkPassword: false,
            checkMobile: false,
            checkLetter: false,
            checkUpperCase: false,
            checkLowerCase: false,
            checkNumber: false,
            checkSpecialCharacter: false,
            LeadAssignment: false,
            LeadWriteClick: false,


            ConsolidationCenterId: '',
            CompanyName: "",
            companyNameErr: false,
            companyNameHelperText: "",
            checkCompanyName: false,

            ServiceId: '',
            ServiceName: "",
            serviceNameErr: false,
            serviceNameHelperText: "",
            checkServiceName: false,

            AddressLine1: "",
            addressLine1Err: false,
            addressLine1HelperText: "",
            checkAddressLine1: false,

            AddressLine2: "",
            checkAddressLine2: false,
            addressLine2Err: false,
            addressLine2HelperText: "",

            ZipCode: "",
            zipCodeErr: false,
            zipCodeHelperText: "",
            checkZipCode: false,

            City: "",
            cityErr: false,
            cityHelperText: "",
            checkCity: false,

            State: "",
            stateErr: false,
            stateHelperText: "",
            checkState: false,

            Country: '',
            CountryList: [],
            countryErr: false,
            countryHelperText: "",

            CityAutoComplete: false,
            StateAutoComplete: false,
            GoogleAPICityList: [],
            StateList: [],

            Mobile1: "",
            Mobile1ID: null,
            mobile1Err: false,
            mobile1HelperText: "",
            checkMobile1: false,

            RateType: '',
            checkRateType: false,
            Rate: '',
            checkRate: false,
            RateErr: false,
            RateHelperText: "",

            serviceList: [],
            sendmailopen: false,
            chargeopen: false,
            Serviceopen: false,
            chargeList: [],
            isClearance: false,
        };
    }

    componentDidMount() {
        this.showHide();
        this.getCountry();
        this.getCenterList();
        if (this.props.location.state) {
            this.getListData(this.props.location.state);
            this.getServiceList(this.props.location.state);
        }
    }

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


    getServiceList(centerId) {
        try {
            const data = {
                "CenterId": centerId
            }
            api.post("userManagement/getServiceRateList", data).then((res) => {
                if (res.success) {
                    this.setState({ serviceList: res.data });
                } else {
                    cogoToast.error("Something Went Wrong");
                }
            })
                .catch((err) => {
                    cogoToast.error("Something Went Wrong");
                });
        } catch (error) { }
    }

    getCountry() {
        try {
            api.get("location/getCountryList").then((res) => {
                if (res.success) {
                    var Country = res.data;
                    this.setState({ CountryList: Country });
                }
            })
                .catch((err) => {
                    console.log("err..", err);
                });
        } catch (error) { }
    }

    getStates(countryData) {
        try {
            let data = {
                countryId: countryData.value,
            };
            api.post("location/getStateList", data).then((res) => {
                if (res.success) {
                    this.showLoader();

                    this.setState({
                        StateList: res.data,
                        StateAutoComplete: res.data.length ? true : false,
                    });

                    this.hideLoader();
                }
            })
                .catch((err) => {
                    this.hideLoader();
                    cogoToast.error("Something Went Wrong");
                });
        } catch (error) {
            this.hideLoader();
        }
    }

    getListData(centerId) {
        try {
            this.showLoader();
            const data = {
                "CenterId": centerId
            };
            api.post("userManagement/getConsolidationEditData", data).then((res) => {
                if (res.success) {
                    api.get("location/getCountryList").then((res1) => {
                        if (res1.success) {
                            var labeldata = res1.data.filter((x) => x.CountryID === res.data.CountryId);
                            var data = {
                                label: labeldata[0].CountryName,
                                value: res.data.CountryId
                            }
                            this.setState({
                                ConsolidationCenterId: res.data.ID,
                                CenterName: res.data.CenterName === null ? '' : res.data.CenterName,
                                CompanyName: res.data.CompanyName === null ? '' : res.data.CompanyName,
                                AddressLine1: res.data.AddressLine1 === null ? '' : res.data.AddressLine1,
                                AddressLine2: res.data.AddressLine2 === null ? '' : res.data.AddressLine2,
                                Country: data,
                                ZipCode: res.data.ZipCode,
                                // City: citydata,
                                Mobile: res.data.Phone1 === null ? '' : res.data.Phone1,
                            });
                            this.zipChange(res.data.ZipCode);
                            this.hideLoader();
                        }
                    }).catch((err) => {
                        console.log("err..", err);
                    });
                }
            })
                .catch((err) => {
                    this.hideLoader();
                    cogoToast.error("Something Went Wrong");
                });
        } catch (error) {
            this.hideLoader();
            cogoToast.error("Something Went Wrong");
        }
    }

    showLoader = () => {
        this.setState({ Loading: true });
    };

    hideLoader = () => {
        this.setState({ Loading: false });
    };

    handleChange = (event, type) => {
        if (type === "centername") {
            this.setState({ checkCenterName: true });
            let usernameVal = event.target.value;
            if (CommonConfig.isEmpty(usernameVal)) {
                this.setState({
                    CenterName: usernameVal,
                    centernameErr: true,
                    centernameHelperText: "Please enter Center Name",
                });
            } else {
                this.setState({
                    CenterName: usernameVal,
                    centernameErr: false,
                    centernameHelperText: "",
                });
            }
        } else if (type === "mobile") {
            this.setState({ checkMobile: true });
            let mobileVal = event.target.value;
            let regExp = /^[0-9]{10,15}$/;

            if (mobileVal === "" || mobileVal === null) {
                this.setState({
                    Mobile: mobileVal,
                    mobileErr: true,
                    mobileHelperText: "Please enter Mobile Number",
                });
            } else if (mobileVal.trim() !== mobileVal || !mobileVal.match(regExp)) {
                this.setState({
                    Mobile: mobileVal,
                    mobileErr: true,
                    mobileHelperText: "Please enter valid Mobile Number",
                });
            } else {
                this.setState({
                    Mobile: mobileVal,
                    mobileErr: false,
                    mobileHelperText: "",
                });
            }
        } else if (type === "companyname") {
            this.setState({ checkcompanyName: true });
            let companyVal = event.target.value;
            if (companyVal === "" || companyVal === null) {
                this.setState({
                    CompanyName: companyVal,
                    companyNameErr: true,
                    companyNameHelperText: "Please enter Company Name",
                });
            } else {
                this.setState({
                    CompanyName: companyVal,
                    companyNameErr: false,
                    companyNameHelperText: "",
                });
            }
        } else if (type === "addressline1") {
            this.setState({ checkAddressLine1: true });
            let addressVal = event.target.value;
            if (addressVal === "" || addressVal === null) {
                this.setState({
                    AddressLine1: addressVal,
                    addressLine1Err: true,
                    addressLine1HelperText: "Please enter Address Line 1",
                });
            } else {
                this.setState({
                    AddressLine1: addressVal,
                    addressLine1Err: false,
                    addressLine1HelperText: "",
                });
            }
        } else if (type === "addressline2") {
            this.setState({ checkAddressLine2: true });
            let addressVal = event.target.value;
            if (addressVal === "" || addressVal === null) {
                this.setState({
                    AddressLine2: addressVal,
                    addressLine2Err: true,
                    addressLine2HelperText: "Please enter Address Line 2",
                });
            } else {
                this.setState({
                    AddressLine2: addressVal,
                    addressLine2Err: false,
                    addressLine2HelperText: "",
                });
            }
        } else if (type === "zip") {
            this.setState({ checkZipCode: true });
            let addressVal = event.target.value.replace(/\D/g, "");
            if (addressVal === "" || addressVal === null) {
                this.setState({
                    ZipCode: addressVal,
                    zipCodeErr: true,
                    zipCodeHelperText: "Please enter Zip Code",
                });
            } else {
                this.setState({
                    ZipCode: addressVal,
                    zipCodeErr: false,
                    zipCodeHelperText: "",
                });
            }
        } else if (type === "City") {
            this.setState({ City: event.target.value });
        } else if (type === "State") {
            this.setState({ State: event.target.value });
        } else if (type === "servicename") {
            this.setState({ checkserviceName: true });
            let companyVal = event.target.value;
            if (companyVal === "" || companyVal === null) {
                this.setState({
                    ServiceName: companyVal,
                    serviceNameErr: true,
                    serviceNameHelperText: "Please enter Service Name",
                });
            } else {
                this.setState({
                    ServiceName: companyVal,
                    serviceNameErr: false,
                    serviceNameHelperText: "",
                });
            }
        } else if (type === "rate") {
            this.setState({ checkRate: true });
            let companyVal = event.target.value;
            if (companyVal === "" || companyVal === null) {
                this.setState({
                    Rate: companyVal,
                    RateErr: true,
                    RateHelperText: "Please enter Service Name",
                });
            } else {
                this.setState({
                    Rate: companyVal,
                    RateErr: false,
                    RateHelperText: "",
                });
            }
        } else if (type === "rateType") {
            this.setState({ RateType: event.target.value, checkserviceName: true });
        } else if (type === "markupstartcft") {
            this.setState({ checkMarkupStartCFT: true });
            let addressVal = event.target.value;
            if (addressVal === "" || addressVal === null) {
                this.setState({
                    MarkupStartCFT: addressVal,
                    MarkupStartCFTErr: true,
                    MarkupStartCFTHelperText: "Please enter Start CFT",
                });
            } else {
                this.setState({
                    MarkupStartCFT: addressVal,
                    MarkupStartCFTErr: false,
                    MarkupStartCFTHelperText: "",
                });
            }
        } else if (type === "markupendcft") {
            this.setState({ checkMarkupEndCFT: true });
            let addressVal = event.target.value;
            if (addressVal === "" || addressVal === null) {
                this.setState({
                    MarkupEndCFT: addressVal,
                    MarkupEndCFTErr: true,
                    MarkupEndCFTHelperText: "Please enter End CFT",
                });
            } else {
                this.setState({
                    MarkupEndCFT: addressVal,
                    MarkupEndCFTErr: false,
                    MarkupEndCFTHelperText: "",
                });
            }
        } else if (type === "charge") {
            this.setState({ checkCharge: true });
            let addressVal = event.target.value;
            if (addressVal === "" || addressVal === null) {
                this.setState({
                    Charge: addressVal,
                    ChargeErr: true,
                    ChargeHelperText: "Please enter Charge",
                });
            } else {
                this.setState({
                    Charge: addressVal,
                    ChargeErr: false,
                    ChargeHelperText: "",
                });
            }
        }
    };

    handleBlurUser = (event, type) => {
        if (type === "centername") {
            let usernameVal = event.target.value;
            if (CommonConfig.isEmpty(usernameVal)) {
                this.setState({
                    CenterName: usernameVal,
                    centernameErr: true,
                    centernameHelperText: "Please enter Center Name",
                });
            } else {
                this.setState({
                    CenterName: usernameVal,
                    centernameErr: false,
                    centernameHelperText: "",
                });
            }
        }
    };

    handledropdown = (e, id) => {
        let serviceNameList = this.state.consolidationDataList;
        let x = serviceNameList.findIndex((x) => x.ServiceID === id);
        serviceNameList[x].MarkupType = e.target.value;
        this.setState({ consolidationDataList: serviceNameList });
    };

    handleInputChange = (e, access) => {
        let userModules = this.state.userModules;
        let cbVal = e.target.checked;
        let cbName = e.target.name;

        if (access === "Read") {
            let x = userModules.findIndex((x) => x.MenuKey === cbName);
            userModules[x].ReadAccess = cbVal ? 1 : 0;
            this.setState({ userModules: userModules });
        }

        if (access === "Write") {
            let x = userModules.findIndex((x) => x.MenuKey === cbName);
            userModules[x].WriteAccess = cbVal ? 1 : 0;
            this.setState({ userModules: userModules });
            if (cbName === "Sales Lead") {
                this.setState({ LeadAssignment: cbVal, LeadWriteClick: true });
            }
        }

        if (access === "Delete") {
            let x = userModules.findIndex((x) => x.MenuKey === cbName);
            userModules[x].DeleteAccess = cbVal ? 1 : 0;
            this.setState({ userModules: userModules });
        }

        if (access === "All") {
            let x = userModules.findIndex((x) => x.MenuKey === cbName);
            userModules[x].AllAccess = cbVal ? 1 : 0;
            userModules[x].ReadAccess = cbVal ? 1 : 0;
            userModules[x].WriteAccess = cbVal ? 1 : 0;
            userModules[x].DeleteAccess = cbVal ? 1 : 0;
            this.setState({ userModules: userModules });
        }

        if (access === "ReadAll") {
            userModules.forEach((item) => {
                item.ReadAccess = cbVal;
            });
            this.setState({ userModules: userModules });
        }

        if (access === "WriteAll") {
            userModules.forEach((item) => {
                item.WriteAccess = cbVal;
            });
            this.setState({ userModules: userModules });
        }

        if (access === "DeleteAll") {
            userModules.forEach((item) => {
                item.DeleteAccess = cbVal;
            });
            this.setState({ userModules: userModules });
        }

        if (access === "AllAccess") {
            userModules.forEach((item) => {
                item.ReadAccess = cbVal;
                item.WriteAccess = cbVal;
                item.DeleteAccess = cbVal;
                item.AllAccess = cbVal;
            });
            this.setState({ userModules: userModules });
        }
    };

    validate() {
        let IsFormValid = true;
        if (this.state.centernameErr) {
            IsFormValid = false;
        }
        return IsFormValid;
    }

    saveCenter = (redirect) => {
        if (this.validate()) {
            try {
                this.showLoader();
                let UserDetails = {
                    ConsolidationCenterId: this.state.ConsolidationCenterId,
                    CompanyName: this.state.CompanyName,
                    AddressLine1: this.state.AddressLine1,
                    AddressLine2: this.state.AddressLine2,
                    ZipCode: this.state.ZipCode,
                    City: this.state.City.value,
                    State: this.state.State.value,
                    CountryID: this.state.Country.value,
                    CenterName: this.state.CenterName,
                    Phone: this.state.Mobile
                };
                api.post("userManagement/addUpdateConsolidation", UserDetails).then((res) => {
                    if (res.success) {
                        this.props.history.push({
                            pathname: "/admin/ConsolidationCenterList",
                        });
                    } else {
                        cogoToast.error("Something Went Wrong");
                    }
                })
                    .catch((err) => {
                        this.hideLoader();
                        cogoToast.error(err);
                    });
            } catch (error) {
                this.hideLoader();
                cogoToast.error("Something Went Wrong");
            }
        } else {
            cogoToast.error("Please correct error and resubmit the form");
        }
    };

    DeleteCenter = (redirect) => {
        if (this.validate()) {
            try {
                this.showLoader();
                let UserDetails = {
                    ConsolidationCenterId: this.state.ConsolidationCenterId,
                };
                api.post("userManagement/DeleteConsolidationCenter", UserDetails).then((res) => {
                    if (res.success) {
                        this.props.history.push({
                            pathname: "/admin/ConsolidationCenterList",
                        });
                    } else {
                        cogoToast.error("Something Went Wrong");
                    }
                })
                    .catch((err) => {
                        this.hideLoader();
                        cogoToast.error(err);
                    });
            } catch (error) {
                this.hideLoader();
                cogoToast.error("Something Went Wrong");
            }
        } else {
            cogoToast.error("Please correct error and resubmit the form");
        }
    };

    saveService = (redirect) => {
        debugger
        if (this.validate()) {
            try {
                this.showLoader();
                let Details = {
                    ServiceId: this.state.ServiceId,
                    ConsolidationId: this.state.ConsolidationCenterId.value,
                    ServiceName: this.state.ServiceName,
                    Rate: this.state.Rate,
                    RateType: this.state.RateType
                };
                api.post("userManagement/addUpdateServiceRate", Details).then((res) => {
                    if (res.success) {
                        this.props.history.push({
                            pathname: "/admin/ConsolidationCenterList",
                        });
                    } else {
                        cogoToast.error("Something Went Wrong");
                    }
                })
                    .catch((err) => {
                        this.hideLoader();
                        cogoToast.error(err);
                    });
            } catch (error) {
                this.hideLoader();
                cogoToast.error("Something Went Wrong");
            }
        } else {
            cogoToast.error("Please correct error and resubmit the form");
        }
    };

    UpdateCharges = () => {
        try {
            this.setState({ Loading: true });
            let Details = {
                ChargeList: this.state.chargeList,
            };
            var callApi = this.state.isClearance === true ? 'userManagement/UpdateClearancecharges' : 'userManagement/UpdateTransportcharges'
            api.post(callApi, Details).then((res) => {
                if (res.success) {
                    this.props.history.push({
                        pathname: "/admin/ConsolidationCenterList",
                    });
                } else {
                    cogoToast.error("Something Went Wrong");
                }
            })
                .catch((err) => {
                    this.hideLoader();
                    cogoToast.error(err);
                });
        } catch (error) {
            this.hideLoader();
            cogoToast.error("Something Went Wrong");
        }
    };

    getCenterList() {
        try {
            this.setState({ Loading: true });
            api.get("userManagement/getConsolidationCentreList").then((res) => {
                if (res.success) {
                    this.setState({ ConsolidationCenterDataList: res.data, Loading: false });
                } else {
                    cogoToast.error("Something Went Wrong");
                }
            })
                .catch((err) => {
                    cogoToast.error("Something Went Wrong");
                });
        } catch (error) { }
    }

    editService = (record) => {
        var labeldata = this.state.ConsolidationCenterDataList.filter((x) => x.ID === record.original.ConsolidationId);
        var data = {
            label: labeldata[0].CenterName,
            value: record.original.ConsolidationCenterId
        }
        this.setState({
            sendmailopen: !this.state.sendmailopen,
            ServiceId: record.original.ServiceId,
            ConsolidationCenterId: data,
            ServiceName: record.original.ServiceName,
            Rate: record.original.Rate,
            RateType: record.original.RateType
        });
    };

    AddService = (record) => {
        var labeldata = this.state.ConsolidationCenterDataList.filter((x) => x.ID === record);
        var data = {
            label: labeldata[0].CenterName,
            value: record
        }
        this.setState({
            Serviceopen: !this.state.Serviceopen,
            ConsolidationCenterId: data,
        });
    };

    getChargeList(input) {
        try {
            var data = {
                "Type": input
            };
            this.setState({ Loading: true });
            api.post("userManagement/getChargesList", data).then((res) => {
                if (res.success) {
                    this.setState({ chargeList: res.data, Loading: false });
                } else {
                    cogoToast.error("Something Went Wrong");
                }
            })
                .catch((err) => {
                    cogoToast.error("Something Went Wrong");
                });
        } catch (error) { }
    }

    editCharges = (record) => {
        this.getChargeList(record.original.ServiceName);
        this.setState({
            chargeopen: !this.state.chargeopen,
            isClearance: record.original.ServiceName === 'Clearance Charges' ? true : false
        });
    };

    cancelUser = () => {
        this.props.history.push({
            pathname: "/admin/ConsolidationCenterList",
        });
    };

    handleSearchBack = () => {
        if (this.props.history.location.searchData) {
            window.location.href =
                "/admin/Search/" + this.props.history.location.searchData;
        } else {
            cogoToast.error("Search data not found.");
        }
    };

    navigateChange = (key) => {
        let stepsList = this.state.Steps;
        let activeIndex = stepsList.findIndex((x) => x.classname === "active");
        if (key !== activeIndex) {
            stepsList[key]["classname"] = "active";
            stepsList[activeIndex]["classname"] = "inactive";
            this.setState({ Steps: stepsList });
            let divID = stepsList[key]["stepId"];
            let activeDiv = stepsList[activeIndex]["stepId"];
            document.getElementById(divID).style.display = "block";
            document.getElementById(activeDiv).style.display = "none";
        }
    };

    showHide() {
        document.getElementById("addconsolidationcenter").style.display = "block";
        document.getElementById("rateservice").style.display = "none";
    }

    zipChange = (zip) => {
        if (zip.length) {
            fetch(CommonConfig.zipCodeAPIKey(zip, this.state.Country.label))
                .then((result) => result.json())
                .then((data) => {
                    this.showLoader();
                    if (data["status"] === "OK") {
                        if (
                            data["results"][0] &&
                            data["results"][0].hasOwnProperty("postcode_localities")
                        ) {
                            var FinalCity = [];
                            var countryShortName = "";

                            countryShortName = _.filter(
                                data["results"][0]["address_components"],
                                function (data) {
                                    return data.types[0] === "country";
                                }
                            )[0].long_name;
                            var CityData = _.filter(
                                data["results"][0]["address_components"],
                                function (data) {
                                    if (data.types[0] == "locality") {
                                        return data.types[0] === "locality";
                                    }
                                }
                            );

                            var CityData2 = _.filter(
                                data["results"][0]["address_components"],
                                function (data) {
                                    if (data.types[0] == "neighborhood") {
                                        return data.types[0] === "neighborhood";
                                    }
                                }
                            );

                            var CityData3 = _.filter(
                                data["results"][0]["address_components"],
                                function (data) {
                                    if (data.types[0] == "administrative_area_level_2") {
                                        return data.types[0] === "administrative_area_level_2";
                                    }
                                }
                            );

                            var CityData4 = _.filter(
                                data["results"][0]["address_components"],
                                function (data) {
                                    if (data.types[0] == "administrative_area_level_1") {
                                        return data.types[0] === "administrative_area_level_1";
                                    }
                                }
                            );

                            if (CityData.length > 0) {
                                CityData = CityData[0].long_name;
                                FinalCity.push({
                                    City_code: CityData,
                                    Name: CityData,
                                });
                                var SelectedCity = {
                                    value: FinalCity[0].City_code,
                                    label: FinalCity[0].Name,
                                };
                            } else if (CityData2.length > 0) {
                                CityData2 = CityData2[0].long_name;
                                FinalCity.push({
                                    City_code: CityData2,
                                    Name: CityData2,
                                });
                                var SelectedCity = {
                                    value: FinalCity[0].City_code,
                                    label: FinalCity[0].Name,
                                };
                            } else if (CityData3.length > 0) {
                                CityData3 = CityData3[0].long_name;
                                FinalCity.push({
                                    City_code: CityData3,
                                    Name: CityData3,
                                });
                                var SelectedCity = {
                                    value: FinalCity[0].City_code,
                                    label: FinalCity[0].Name,
                                };
                            } else if (CityData4.length > 0) {
                                CityData4 = CityData4[0].long_name;
                                FinalCity.push({
                                    City_code: CityData4,
                                    Name: CityData4,
                                });
                                var SelectedCity = {
                                    value: FinalCity[0].City_code,
                                    label: FinalCity[0].Name,
                                };
                            }

                            var state = _.filter(
                                data["results"][0]["address_components"],
                                function (data) {
                                    return data.types[0] === "administrative_area_level_1";
                                }
                            )[0].long_name;
                            var SelectedState = { value: state, label: state };

                            if (countryShortName === this.state.Country.label) {
                                this.setState({
                                    CityAutoComplete: FinalCity.length ? true : false,
                                    StateAutoComplete: this.state.StateList.length ? true : false,
                                    GoogleAPICityList: FinalCity,
                                    State: this.state.StateList.length ? SelectedState : state,
                                    City: SelectedCity,
                                });
                            } else {
                                this.setState({
                                    CityAutoComplete: false,
                                    StateAutoComplete: this.state.StateList.length ? true : false,
                                    GoogleAPICityList: [],
                                    State: "",
                                    City: "",
                                });
                            }
                            this.hideLoader();
                        } else if (data["results"][0]) {
                            var FinalCity = [];
                            var city = "";
                            var countryShortName = "";

                            countryShortName = _.filter(
                                data["results"][0]["address_components"],
                                function (data) {
                                    return data.types[0] === "country";
                                }
                            )[0].long_name;

                            if (
                                city == "" &&
                                _.filter(data["results"][0]["address_components"], function (
                                    data
                                ) {
                                    return data.types[0] === "locality";
                                }).length > 0
                            ) {
                                city = _.filter(
                                    data["results"][0]["address_components"],
                                    function (data) {
                                        return data.types[0] === "locality";
                                    }
                                )[0].short_name;
                            } else if (
                                city == "" &&
                                _.filter(data["results"][0]["address_components"], function (
                                    data
                                ) {
                                    return data.types[0] === "administrative_area_level_3";
                                }).length > 0
                            ) {
                                city = _.filter(
                                    data["results"][0]["address_components"],
                                    function (data) {
                                        return data.types[0] === "administrative_area_level_3";
                                    }
                                )[0].short_name;
                            } else if (
                                city == "" &&
                                _.filter(data["results"][0]["address_components"], function (
                                    data
                                ) {
                                    return data.types[0] === "political";
                                }).length > 0
                            ) {
                                city = _.filter(
                                    data["results"][0]["address_components"],
                                    function (data) {
                                        return data.types[0] === "political";
                                    }
                                )[0].short_name;
                            } else if (
                                city == "" &&
                                _.filter(data["results"][0]["address_components"], function (
                                    data
                                ) {
                                    return data.types[0] === "neighborhood";
                                }).length > 0
                            ) {
                                city = _.filter(
                                    data["results"][0]["address_components"],
                                    function (data) {
                                        return data.types[0] === "neighborhood";
                                    }
                                )[0].short_name;
                            } else if (
                                city == "" &&
                                _.filter(data["results"][0]["address_components"], function (
                                    data
                                ) {
                                    return data.types[0] === "administrative_area_level_2";
                                }).length > 0
                            ) {
                                city = _.filter(
                                    data["results"][0]["address_components"],
                                    function (data) {
                                        return data.types[0] === "administrative_area_level_2";
                                    }
                                )[0].long_name;
                            } else if (
                                city == "" &&
                                _.filter(data["results"][0]["address_components"], function (
                                    data
                                ) {
                                    return data.types[0] === "administrative_area_level_1";
                                }).length > 0
                            ) {
                                city = _.filter(
                                    data["results"][0]["address_components"],
                                    function (data) {
                                        return data.types[0] === "administrative_area_level_1";
                                    }
                                )[0].long_name;
                            } else if (city == "") {
                                city = "";
                            }

                            var state = _.filter(
                                data["results"][0]["address_components"],
                                function (data) {
                                    return data.types[0] === "administrative_area_level_1";
                                }
                            )[0].long_name;

                            FinalCity.push({
                                City_code: city,
                                Name: city,
                            });

                            var SelectedCity = {
                                value: FinalCity[0].City_code,
                                label: FinalCity[0].Name,
                            };

                            var SelectedState = { value: state, label: state };

                            if (countryShortName === this.state.Country.label) {
                                this.setState({
                                    CityAutoComplete: FinalCity.length ? true : false,
                                    StateAutoComplete: this.state.StateList.length ? true : false,
                                    GoogleAPICityList: FinalCity,
                                    State: this.state.StateList.length ? SelectedState : state,
                                    City: SelectedCity,
                                });
                            } else {
                                this.setState({
                                    CityAutoComplete: false,
                                    StateAutoComplete: this.state.StateList.length ? true : false,
                                    GoogleAPICityList: [],
                                    State: "",
                                    City: "",
                                });
                            }
                            this.hideLoader();
                        }
                    } else {
                        this.setState({
                            CityAutoComplete: false,
                            StateAutoComplete: this.state.StateList.length ? true : false,
                            GoogleAPICityList: [],
                            State: "",
                            City: "",
                        });
                        this.hideLoader();
                    }
                });
        }
    };

    activeInactiveService = (record) => {
        let data = {
            ServiceID: record.original.ServiceId,
            status: record.original.Status === "Active" ? "Inactive" : "Active",
        };
        try {
            this.setState({ Loading: true });
            api.post("userManagement/activeInactiveServiceRate", data).then((res) => {
                if (res.success) {
                    window.location.reload();
                } else {
                    cogoToast.error("Something Went Wrong");
                }
            })
                .catch((err) => {
                    cogoToast.error("Something Went Wrong");
                });
        } catch (error) { }
    };

    handleZipBlur = (e, type) => {
        if (type === "zip") {
            this.zipChange(e.target.value);
        }
    };

    ChangeCountry = (value, type) => {
        if (value !== null) {
            if (type === "Country") {
                this.setState({ Country: value });
                this.getStates(value);
            } else if (type === "City") {
                this.setState({ City: value });
            } else if (type === "State") {
                this.setState({ State: value });
            } else if (type === "Center") {
                this.setState({ ConsolidationCenterId: value });
            }
        }
    };

    handledInput = (e, id, Type) => {
        debugger
        let MarkupData = this.state.chargeList;
        let i = MarkupData.findIndex((x) => x.ChargeId === id);

        let x = document.getElementsByTagName("input");
        let val = e.target.value;
        if (Type === "RateType") {
            if (CommonConfig.isEmpty(val)) {
                MarkupData[i].RateType = "";
                x[i].className = "form-control is-invalid";
            } else {
                MarkupData[i].RateType = val;
            }
        } else if (Type === "Type") {
            if (CommonConfig.isEmpty(val)) {
                MarkupData[i].Type = "";
                x[i].className = "form-control is-invalid";
            } else {
                MarkupData[i].Type = val;
            }
        } else if (Type === "Rate") {
            if (CommonConfig.isEmpty(val)) {
                MarkupData[i].Rate = "";
                x[i].className = "form-control is-invalid";
            } else {
                MarkupData[i].Rate = val;
            }
        } else if (Type === "ChargeName") {
            if (CommonConfig.isEmpty(val)) {
                MarkupData[i].ChargeName = "";
                x[i].className = "form-control is-invalid";
            } else {
                MarkupData[i].ChargeName = val;
            }
        } else if (Type === "StartCFT") {
            if (CommonConfig.isEmpty(val)) {
                MarkupData[i].StartCFT = "";
                x[i].className = "form-control is-invalid";
            } else {
                MarkupData[i].StartCFT = val;
            }
        } else if (Type === "EndCFT") {
            if (CommonConfig.isEmpty(val)) {
                MarkupData[i].EndCFT = "";
                x[i].className = "form-control is-invalid";
            } else {
                MarkupData[i].EndCFT = val;
            }
        }
        this.setState({ chargeList: MarkupData });
    };

    handleBlur = (e, id, Type) => {
        let MarkupData = this.state.chargeList;
        let i = MarkupData.findIndex((x) => x.ChargeId === id);

        let x = document.getElementsByTagName("input");
        let val = e.target.value;
        if (Type === "RateType") {
            MarkupData[i].RateType = val;
            x[i].className = "form-control";
        } else if (Type === "Rate") {
            MarkupData[i].Rate = val;
            x[i].className = "form-control";
        } else if (Type === "ChargeName") {
            MarkupData[i].ChargeName = val;
            x[i].className = "form-control";
        } else if (Type === "Type") {
            MarkupData[i].Type = val;
            x[i].className = "form-control";
        } else if (Type === "StartCFT") {
            MarkupData[i].StartCFT = val;
            x[i].className = "form-control";
        } else if (Type === "EndCFT") {
            MarkupData[i].EndCFT = val;
            x[i].className = "form-control";
        }
        this.setState({ chargeList: MarkupData });
    };

    renderMarkup = () => {
        if (this.state.isClearance === true) {
            return this.state.chargeList.map((service) => {
                const {
                    ChargeId,
                    ChargeName,
                    Rate,
                    RateType,
                    Type,
                } = service;

                return (
                    <tr key={ChargeId}>
                        <td>
                            <input
                                type="text"
                                name="ChargeName"
                                id="ChargeName"
                                className="form-control"
                                value={ChargeName}
                                onChange={(event) =>
                                    this.handledInput(event, ChargeId, "ChargeName")
                                }
                                onBlur={(e) =>
                                    this.handleBlur(e, ChargeId, "ChargeName")
                                }
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                name="Rate"
                                id="Rate"
                                className="form-control"
                                value={Rate}
                                onChange={(event) =>
                                    this.handledInput(event, ChargeId, "Rate")
                                }
                                onBlur={(e) =>
                                    this.handleBlur(e, ChargeId, "Rate")
                                }
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                name="RateType"
                                id="RateType"
                                className="form-control"
                                value={RateType}
                                onChange={(event) =>
                                    this.handledInput(event, ChargeId, "RateType")
                                }
                                onBlur={(e) =>
                                    this.handleBlur(e, ChargeId, "RateType")
                                }
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                name="Type"
                                id="Type"
                                className="form-control"
                                value={Type}
                                onChange={(event) =>
                                    this.handledInput(event, ChargeId, "Type")
                                }
                                onBlur={(e) =>
                                    this.handleBlur(e, ChargeId, "Type")
                                }
                            />
                        </td>
                    </tr>
                );
            });
        }
        else {
            return this.state.chargeList.map((service) => {
                const {
                    ChargeId,
                    StartCFT,
                    Rate,
                    EndCFT,
                } = service;

                return (
                    <tr key={ChargeId}>
                        <td>
                            <input
                                type="text"
                                name="StartCFT"
                                id="StartCFT"
                                className="form-control"
                                value={StartCFT}
                                onChange={(event) =>
                                    this.handledInput(event, ChargeId, "StartCFT")
                                }
                                onBlur={(e) =>
                                    this.handleBlur(e, ChargeId, "StartCFT")
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
                                    this.handledInput(event, ChargeId, "EndCFT")
                                }
                                onBlur={(e) =>
                                    this.handleBlur(e, ChargeId, "EndCFT")
                                }
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                name="Rate"
                                id="Rate"
                                className="form-control"
                                value={Rate}
                                onChange={(event) =>
                                    this.handledInput(event, ChargeId, "Rate")
                                }
                                onBlur={(e) =>
                                    this.handleBlur(e, ChargeId, "Rate")
                                }
                            />
                        </td>
                    </tr>
                );
            });
        }
    };

    handleAddRow = () => {
        if (this.state.isClearance === true) {
            const row = {
                ChargeId: '',
                ChargeName: '',
                Rate: '',
                RateType: '',
                Type: '',
                // Index: this.state.chargeList.length + 1,
            };
            this.setState({ chargeList: [...this.state.chargeList, row] });
        }
        else {
            const row = {
                ChargeId: '',
                StartCFT: "",
                Rate: '',
                EndCFT: '',
                // Index: this.state.chargeList.length + 1,
            };
            this.setState({ chargeList: [...this.state.chargeList, row] });
        }
    };

    render() {
        const {
            CenterName,
            Mobile,
            CompanyName,
            AddressLine1,
            AddressLine2,
            ZipCode,
            City,
            Country,
            serviceList,
            ConsolidationCenterId,
            ServiceName,
            Rate,
            RateType,
            MarkupStartCFT,
            MarkupEndCFT,
            Charge
        } = this.state;

        const columns = [
            {
                Header: "Service Name",
                accessor: "ServiceName",
                maxWidth: 140,
            },
            {
                Header: "Rate",
                maxWidth: 50,
                Cell: (record) => {
                    if (record.original.ServiceName === "Clearance Charges" || record.original.ServiceName === "Transportation Charges") {
                        return (
                            <div className="table-common-btn">
                                <Button
                                    justIcon
                                    color="info"
                                    onClick={() => this.editCharges(record)}
                                ><i className="fas fa-edit"></i>
                                </Button>
                            </div>
                        );
                    } else {
                        return (
                            <div>
                                {record.original.Rate}
                            </div>
                        );
                    }
                },
            },
            {
                Header: "Rate Type",
                accessor: "RateType",
                width: 60,
            },
            {
                id: "CreatedOn",
                Header: "Created On",
                width: 90,
                sortMethod: (a, b) => {
                    return CommonConfig.dateSortMethod(a, b);
                },
                accessor: (data) => {
                    return moment(data.CreatedOn).format(
                        CommonConfig.dateFormat.dateOnly
                    );
                },
            },
            {
                Header: "Actions",
                accessor: "actions",
                sortable: false,
                filterable: false,
                width: 70,
                Cell: (record) => {
                    return (
                        <div className="table-common-btn">
                            <Button
                                justIcon
                                color="info"
                                onClick={() => this.editService(record)}
                            >
                                <i className="fas fa-edit"></i>
                            </Button>
                        </div>
                    );
                },
            },
            {
                Header: "Status",
                width: 100,
                Cell: (record) => {
                    if (record.original.Status === "Active") {
                        return (
                            <Button
                                color="success"
                                className="table-btn"
                                onClick={() => this.activeInactiveService(record)}
                            >
                                Active
                            </Button>
                        );
                    } else {
                        return (
                            <Button
                                color="danger"
                                className="table-btn"
                                onClick={() => this.activeInactiveService(record)}
                            >
                                Inactive
                            </Button>
                        );
                    }
                },
                sortable: false,
                filterable: false,
            },
        ];

        const ConsolidationCenterList = this.state.ConsolidationCenterDataList.map((type) => {
            return { value: type.ID, label: type.CenterName };
        });

        const CityOptions = this.state.GoogleAPICityList.map((city) => {
            return { value: city.City_code, label: city.Name };
        });

        const CountryOptions = this.state.CountryList.map((fromCountry) => {
            return { value: fromCountry.CountryID, label: fromCountry.CountryName };
        });
        return (
            <div>
                <GridContainer className="MuiGrid-justify-xs-center">
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardHeader className="btn-right-outer" color="primary" icon>
                                <CardIcon color="primary">
                                    <Adduser />
                                </CardIcon>
                                <h4 className="margin-right-auto text-color-black">
                                    Consolidation Center Management
                                </h4>
                            </CardHeader>
                            <Cardbody>
                                <div className="shipment-nav">
                                    <ul>
                                        {this.state.Steps.map((step, key) => {
                                            return (
                                                <li>
                                                    <a
                                                        className={step.classname}
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            this.navigateChange(key);
                                                        }}
                                                    >
                                                        <span>{step.stepName}</span>
                                                    </a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <div className="shipment-content">
                                    <div className="shipment-pane mt-20" id="addconsolidationcenter">
                                        <Card>
                                            <CardBody>
                                                <GridContainer>
                                                    <GridItem xs={12} sm={12} md={3}>
                                                        <CustomInput
                                                            labelText={<span>Center Name</span>}
                                                            id="centername"
                                                            error={this.state.centernameErr}
                                                            helperText={this.state.centernameHelperText}
                                                            formControlProps={{ fullWidth: true }}
                                                            inputProps={{
                                                                onFocus: () =>
                                                                    this.setState({
                                                                        checkCenterName: false,
                                                                        centernameErr: false,
                                                                        centernameHelperText: "",
                                                                    }),
                                                                onBlur: (event) =>
                                                                    this.handleBlurUser(event, "centername"),
                                                                onChange: (event) =>
                                                                    this.handleChange(event, "centername"),
                                                                value: CenterName,
                                                                endAdornment:
                                                                    this.state.checkCenterName !== true ? (
                                                                        <Icon>account_circle</Icon>
                                                                    ) : this.state.centernameErr ? (
                                                                        <InputAdornment position="end">
                                                                            <CloseIcon
                                                                                style={{ color: red[500] }}
                                                                                className={useStyles.danger}
                                                                            />
                                                                        </InputAdornment>
                                                                    ) : (
                                                                        <InputAdornment position="end">
                                                                            {" "}
                                                                            <DoneIcon
                                                                                style={{ color: green[500] }}
                                                                                className={useStyles.success}
                                                                            />
                                                                        </InputAdornment>
                                                                    ),
                                                            }}
                                                        />
                                                    </GridItem>
                                                    <GridItem xs={12} sm={12} md={3}>
                                                        <CustomInput
                                                            labelText={<span>Company Name</span>}
                                                            id="CompanyName"
                                                            name="CompanyName"
                                                            variant="outlined"
                                                            formControlProps={{ fullWidth: true }}
                                                            inputProps={{
                                                                onFocus: () =>
                                                                    this.setState({
                                                                        checkcompanyName: false,
                                                                        companyNameErr: false,
                                                                        companyNameHelperText: "",
                                                                    }),
                                                                onBlur: (event) =>
                                                                    this.handleChange(event, "companyname"),
                                                                onChange: (event) =>
                                                                    this.handleChange(event, "companyname"),
                                                                value: CompanyName,
                                                                endAdornment:
                                                                    this.state.checkcompanyName !== true ? (
                                                                        <Icon>person</Icon>
                                                                    ) : (
                                                                        <InputAdornment position="end">
                                                                            {" "}
                                                                            <DoneIcon
                                                                                style={{ color: green[500] }}
                                                                                className={useStyles.success}
                                                                            />
                                                                        </InputAdornment>
                                                                    ),
                                                            }}
                                                        />
                                                    </GridItem>
                                                    <GridItem xs={12} sm={12} md={3}>
                                                        <CustomInput
                                                            labelText={<span>Address Line 1</span>}
                                                            id="addressline1"
                                                            name="addressline1"
                                                            variant="outlined"
                                                            formControlProps={{ fullWidth: true }}
                                                            inputProps={{
                                                                onFocus: () =>
                                                                    this.setState({
                                                                        checkAddressLine1: false,
                                                                        addressLine1Err: false,
                                                                        addressLine1HelperText: "",
                                                                    }),
                                                                onBlur: (event) =>
                                                                    this.handleChange(event, "addressline1"),
                                                                onChange: (event) =>
                                                                    this.handleChange(event, "addressline1"),
                                                                value: AddressLine1,
                                                                endAdornment:
                                                                    this.state.checkAddressLine1 !== true ? (
                                                                        <Icon>person</Icon>
                                                                    ) : (
                                                                        <InputAdornment position="end">
                                                                            {" "}
                                                                            <DoneIcon
                                                                                style={{ color: green[500] }}
                                                                                className={useStyles.success}
                                                                            />
                                                                        </InputAdornment>
                                                                    ),
                                                            }}
                                                        />
                                                    </GridItem>
                                                    <GridItem xs={12} sm={12} md={3}>
                                                        <CustomInput
                                                            labelText={<span>Address Line 2</span>}
                                                            id="addressline2"
                                                            name="addressline2"
                                                            variant="outlined"
                                                            formControlProps={{ fullWidth: true }}
                                                            inputProps={{
                                                                onFocus: () =>
                                                                    this.setState({
                                                                        checkAddressLine2: false,
                                                                        addressLine2Err: false,
                                                                        addressLine2HelperText: "",
                                                                    }),
                                                                onBlur: (event) =>
                                                                    this.handleChange(event, "addressline2"),
                                                                onChange: (event) =>
                                                                    this.handleChange(event, "addressline2"),
                                                                value: AddressLine2,
                                                                endAdornment:
                                                                    this.state.checkAddressLine2 !== true ? (
                                                                        <Icon>person</Icon>
                                                                    ) : (
                                                                        <InputAdornment position="end">
                                                                            {" "}
                                                                            <DoneIcon
                                                                                style={{ color: green[500] }}
                                                                                className={useStyles.success}
                                                                            />
                                                                        </InputAdornment>
                                                                    ),
                                                            }}
                                                        />
                                                    </GridItem>
                                                </GridContainer>
                                                <GridContainer>
                                                    <GridItem xs={12} sm={12} md={3}>
                                                        <Autocomplete
                                                            options={CountryOptions}
                                                            id="Country"
                                                            getOptionLabel={(option) => option.label}
                                                            value={Country}
                                                            autoSelect
                                                            onChange={(event, value) =>
                                                                this.ChangeCountry(value, "Country")
                                                            }
                                                            renderInput={(params) => (
                                                                <TextField {...params} label="Country" />
                                                            )}
                                                        />
                                                    </GridItem>
                                                    <GridItem xs={12} sm={12} md={3}>
                                                        <CustomInput
                                                            labelText={<span>Zip</span>}
                                                            id="zip"
                                                            name="zip"
                                                            variant="outlined"
                                                            error={this.state.zipCodeErr}
                                                            helperText={this.state.zipCodeHelperText}
                                                            formControlProps={{ fullWidth: true }}
                                                            inputProps={{
                                                                onFocus: () =>
                                                                    this.setState({
                                                                        checkZipCode: false,
                                                                        zipCodeErr: false,
                                                                        zipCodeHelperText: "",
                                                                    }),
                                                                onBlur: (event) => this.handleZipBlur(event, "zip"),
                                                                onChange: (event) =>
                                                                    this.handleChange(event, "zip"),
                                                                value: ZipCode,
                                                                endAdornment:
                                                                    this.state.checkZipCode !== true ? (
                                                                        <Icon>person</Icon>
                                                                    ) : this.state.zipCodeErr ? (
                                                                        <InputAdornment position="end">
                                                                            <CloseIcon
                                                                                style={{ color: red[500] }}
                                                                                className={useStyles.danger}
                                                                            />
                                                                        </InputAdornment>
                                                                    ) : (
                                                                        <InputAdornment position="end">
                                                                            {" "}
                                                                            <DoneIcon
                                                                                style={{ color: green[500] }}
                                                                                className={useStyles.success}
                                                                            />
                                                                        </InputAdornment>
                                                                    ),
                                                            }}
                                                        />
                                                    </GridItem>
                                                    <GridItem xs={12} sm={12} md={3}>
                                                        {this.state.CityAutoComplete === false ? (
                                                            <CustomInput
                                                                labelText="City"
                                                                id="city"
                                                                formControlProps={{ fullWidth: true }}
                                                                inputProps={{
                                                                    value: City,
                                                                    onChange: (event) =>
                                                                        this.handleChange(event, "City"),
                                                                    endAdornment: (
                                                                        <InputAdornment
                                                                            position="end"
                                                                            className={classes.inputAdornment}
                                                                        >
                                                                            <Icon>location_city</Icon>
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            />
                                                        ) : (
                                                            <Autocomplete
                                                                options={CityOptions}
                                                                id="fromcity"
                                                                autoSelect
                                                                getOptionLabel={(option) => option.label}
                                                                value={City}
                                                                onChange={(event, value) =>
                                                                    this.ChangeCountry(event, value, "City")
                                                                }
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        margin="normal"
                                                                        label="City"
                                                                        fullWidth
                                                                    />
                                                                )}
                                                            />
                                                        )}
                                                    </GridItem>
                                                    <GridItem xs={12} sm={12} md={3}>
                                                        <CustomInput
                                                            labelText={<span>Phone</span>}
                                                            id="mobile"
                                                            error={this.state.mobileErr}
                                                            helperText={this.state.mobileHelperText}
                                                            formControlProps={{ fullWidth: true }}
                                                            inputProps={{
                                                                onBlur: (event) =>
                                                                    this.handleChange(event, "mobile"),
                                                                onChange: (event) =>
                                                                    this.handleChange(event, "mobile"),
                                                                onFocus: () =>
                                                                    this.setState({
                                                                        checkMobile: false,
                                                                        mobileErr: false,
                                                                        mobileHelperText: "",
                                                                    }),
                                                                value: Mobile,
                                                                endAdornment:
                                                                    this.state.checkMobile !== true ? (
                                                                        <Icon>phone</Icon>
                                                                    ) : this.state.mobileErr ? (
                                                                        <InputAdornment position="end">
                                                                            <CloseIcon
                                                                                style={{ color: red[500] }}
                                                                                className={useStyles.danger}
                                                                            />
                                                                        </InputAdornment>
                                                                    ) : (
                                                                        <InputAdornment position="end">
                                                                            {" "}
                                                                            <DoneIcon
                                                                                style={{ color: green[500] }}
                                                                                className={useStyles.success}
                                                                            />
                                                                        </InputAdornment>
                                                                    ),
                                                            }}
                                                        />
                                                    </GridItem>
                                                </GridContainer>
                                            </CardBody>
                                            <div className="right">
                                                <Button color="rose" onClick={() => this.saveCenter(false)}>
                                                    Save
                                                </Button>
                                                <Button color="secondary" onClick={() => this.cancelUser()}>
                                                    Cancel
                                                </Button>
                                                {this.props.location.state ?
                                                    <Button color="rose" onClick={() => this.DeleteCenter(false)}>
                                                        Delete
                                                    </Button>
                                                    : null}
                                            </div>
                                        </Card>
                                    </div>
                                    <div className="shipment-pane mt-20" id="rateservice">

                                        {this.props.location.state ?
                                            <GridItem xs={12}>
                                                <Card>
                                                    <Cardbody>
                                                        <ReactTable
                                                            getTheadFilterProps={(e) => this.filterProps(e)}
                                                            defaultFiltered={this.state.previousFilterList}
                                                            data={serviceList}
                                                            defaultSorted={this.state.previousSortList}
                                                            minRows={0}
                                                            filterable
                                                            defaultFilterMethod={CommonConfig.filterCaseInsensitive}
                                                            resizable={false}
                                                            columns={columns}
                                                            defaultPageSize={10}
                                                            showPaginationBottom={true}
                                                            className="-striped -highlight"
                                                        />
                                                    </Cardbody>
                                                    <div className="right">
                                                        <Button color="rose" onClick={() => this.AddService(this.state.ConsolidationCenterId)}>
                                                            Add
                                                        </Button>
                                                    </div>
                                                </Card>
                                            </GridItem> :
                                            <Card>
                                                <CardBody>
                                                    <GridContainer>
                                                        <GridItem xs={12} sm={12} md={3}>
                                                            <Autocomplete
                                                                id="combo-box-demo"
                                                                options={ConsolidationCenterList}
                                                                value={ConsolidationCenterId}
                                                                onChange={(event, value) =>
                                                                    this.ChangeCountry(value, "Center")
                                                                }
                                                                getOptionLabel={(option) => option.label}
                                                                renderInput={(params) => (
                                                                    <TextField {...params} label="Consolidation Center" />
                                                                )}
                                                            />
                                                        </GridItem>
                                                        <GridItem xs={12} sm={12} md={3}>
                                                            <CustomInput
                                                                labelText={<span>Service Name</span>}
                                                                id="ServiceName"
                                                                name="ServiceName"
                                                                variant="outlined"
                                                                formControlProps={{ fullWidth: true }}
                                                                inputProps={{
                                                                    onFocus: () =>
                                                                        this.setState({
                                                                            checkServiceName: false,
                                                                            serviceNameErr: false,
                                                                            serviceNameHelperText: "",
                                                                        }),
                                                                    onBlur: (event) =>
                                                                        this.handleChange(event, "servicename"),
                                                                    onChange: (event) =>
                                                                        this.handleChange(event, "servicename"),
                                                                    value: ServiceName,
                                                                    endAdornment:
                                                                        this.state.checkServiceName !== true ? (
                                                                            <Icon>person</Icon>
                                                                        ) : (
                                                                            <InputAdornment position="end">
                                                                                {" "}
                                                                                <DoneIcon
                                                                                    style={{ color: green[500] }}
                                                                                    className={useStyles.success}
                                                                                />
                                                                            </InputAdornment>
                                                                        ),
                                                                }}
                                                            />
                                                        </GridItem>
                                                        <GridItem xs={12} sm={12} md={3}>
                                                            <CustomInput
                                                                labelText={<span>Rate</span>}
                                                                id="rate"
                                                                name="rate"
                                                                variant="outlined"
                                                                formControlProps={{ fullWidth: true }}
                                                                inputProps={{
                                                                    onFocus: () =>
                                                                        this.setState({
                                                                            checkRate: false,
                                                                            RateErr: false,
                                                                            RateHelperText: "",
                                                                        }),
                                                                    onBlur: (event) =>
                                                                        this.handleChange(event, "rate"),
                                                                    onChange: (event) =>
                                                                        this.handleChange(event, "rate"),
                                                                    value: Rate,
                                                                    endAdornment:
                                                                        this.state.checkRate !== true ? (
                                                                            <Icon>person</Icon>
                                                                        ) : (
                                                                            <InputAdornment position="end">
                                                                                {" "}
                                                                                <DoneIcon
                                                                                    style={{ color: green[500] }}
                                                                                    className={useStyles.success}
                                                                                />
                                                                            </InputAdornment>
                                                                        ),
                                                                }}
                                                            />
                                                        </GridItem>
                                                        <GridItem xs={12} sm={12} md={3}>
                                                            <CustomInput
                                                                labelText={<span>Rate Type</span>}
                                                                id="rateType"
                                                                name="rateType"
                                                                variant="outlined"
                                                                formControlProps={{ fullWidth: true }}
                                                                inputProps={{
                                                                    onFocus: () =>
                                                                        this.setState({
                                                                            checkRateType: false,
                                                                            // RateTypeErr: false,
                                                                            // RateTypeHelperText: "",
                                                                        }),
                                                                    onBlur: (event) =>
                                                                        this.handleChange(event, "rateType"),
                                                                    onChange: (event) =>
                                                                        this.handleChange(event, "rateType"),
                                                                    value: RateType,
                                                                    endAdornment:
                                                                        this.state.checkRateType !== true ? (
                                                                            <Icon>person</Icon>
                                                                        ) : (
                                                                            <InputAdornment position="end">
                                                                                {" "}
                                                                                <DoneIcon
                                                                                    style={{ color: green[500] }}
                                                                                    className={useStyles.success}
                                                                                />
                                                                            </InputAdornment>
                                                                        ),
                                                                }}
                                                            />
                                                        </GridItem>
                                                    </GridContainer>
                                                </CardBody>
                                                {this.props.location.state ? null :
                                                    <div className="right">
                                                        <Button color="rose" onClick={() => this.saveService(false)}>
                                                            Save
                                                        </Button>
                                                        <Button color="secondary" onClick={() => this.cancelUser()}>
                                                            Cancel
                                                        </Button>
                                                    </div>}
                                            </Card>
                                        }

                                    </div>
                                </div>
                            </Cardbody>
                        </Card>
                        <div>
                            <Dialog
                                maxWidth={671}
                                open={this.state.sendmailopen}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">Edit Service Rate</DialogTitle>
                                <DialogContent>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={3}>
                                            <Autocomplete
                                                id="combo-box-demo"
                                                options={ConsolidationCenterList}
                                                value={ConsolidationCenterId}
                                                onChange={(event, value) =>
                                                    this.ChangeCountry(value, "Center")
                                                }
                                                getOptionLabel={(option) => option.label}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Consolidation Center" />
                                                )}
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={3}>
                                            <CustomInput
                                                labelText={<span>Service Name</span>}
                                                id="ServiceName"
                                                name="ServiceName"
                                                variant="outlined"
                                                formControlProps={{ fullWidth: true }}
                                                inputProps={{
                                                    onFocus: () =>
                                                        this.setState({
                                                            checkServiceName: false,
                                                            serviceNameErr: false,
                                                            serviceNameHelperText: "",
                                                        }),
                                                    onBlur: (event) =>
                                                        this.handleChange(event, "servicename"),
                                                    onChange: (event) =>
                                                        this.handleChange(event, "servicename"),
                                                    value: ServiceName,
                                                    endAdornment:
                                                        this.state.checkServiceName !== true ? (
                                                            <Icon>person</Icon>
                                                        ) : (
                                                            <InputAdornment position="end">
                                                                {" "}
                                                                <DoneIcon
                                                                    style={{ color: green[500] }}
                                                                    className={useStyles.success}
                                                                />
                                                            </InputAdornment>
                                                        ),
                                                }}
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={3}>
                                            <CustomInput
                                                labelText={<span>Rate</span>}
                                                id="rate"
                                                name="rate"
                                                variant="outlined"
                                                formControlProps={{ fullWidth: true }}
                                                inputProps={{
                                                    onFocus: () =>
                                                        this.setState({
                                                            checkRate: false,
                                                            RateErr: false,
                                                            RateHelperText: "",
                                                        }),
                                                    onBlur: (event) =>
                                                        this.handleChange(event, "rate"),
                                                    onChange: (event) =>
                                                        this.handleChange(event, "rate"),
                                                    value: Rate,
                                                    endAdornment:
                                                        this.state.checkRate !== true ? (
                                                            <Icon>person</Icon>
                                                        ) : (
                                                            <InputAdornment position="end">
                                                                {" "}
                                                                <DoneIcon
                                                                    style={{ color: green[500] }}
                                                                    className={useStyles.success}
                                                                />
                                                            </InputAdornment>
                                                        ),
                                                }}
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={3}>
                                            <CustomInput
                                                labelText={<span>Rate Type</span>}
                                                id="rateType"
                                                name="rateType"
                                                variant="outlined"
                                                formControlProps={{ fullWidth: true }}
                                                inputProps={{
                                                    onFocus: () =>
                                                        this.setState({
                                                            checkRateType: false,
                                                            // RateTypeErr: false,
                                                            // RateTypeHelperText: "",
                                                        }),
                                                    onBlur: (event) =>
                                                        this.handleChange(event, "rateType"),
                                                    onChange: (event) =>
                                                        this.handleChange(event, "rateType"),
                                                    value: RateType,
                                                    endAdornment:
                                                        this.state.checkRateType !== true ? (
                                                            <Icon>person</Icon>
                                                        ) : (
                                                            <InputAdornment position="end">
                                                                {" "}
                                                                <DoneIcon
                                                                    style={{ color: green[500] }}
                                                                    className={useStyles.success}
                                                                />
                                                            </InputAdornment>
                                                        ),
                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        onClick={() => this.setState({ sendmailopen: false })}
                                        color="secondary"
                                    >
                                        Cancel
                                    </Button>

                                    <Button onClick={() => this.saveService()} color="primary" autoFocus>
                                        Update
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                        <div>
                            <Dialog
                                maxWidth={671}
                                open={this.state.chargeopen}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">Charges</DialogTitle>
                                <DialogContent>
                                    <div className="shipment-pane mt-20" id="markupdetails">
                                        {this.state.isClearance === true ?
                                            <div className="package-table">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Charge Name</th>
                                                            <th>Rate</th>
                                                            <th>Rate Type</th>
                                                            <th>Type</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>{this.renderMarkup()}</tbody>
                                                </table>
                                            </div> :
                                            <div className="package-table">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Start CFT</th>
                                                            <th>End CFT</th>
                                                            <th>Rate</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>{this.renderMarkup()}</tbody>
                                                </table>
                                            </div>}
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        onClick={() => this.setState({ chargeopen: false })}
                                        color="secondary"
                                    >
                                        Cancel
                                    </Button>

                                    <Button onClick={() => this.UpdateCharges()} color="primary" autoFocus>
                                        Update
                                    </Button>
                                    <Button
                                        justIcon
                                        color="facebook"
                                        onClick={() => this.handleAddRow()}
                                        className="Plus-btn "
                                    >
                                        <i className={"fas fa-plus"} />
                                    </Button>
                                </DialogActions>
                            </Dialog>

                        </div>
                        <div>
                            <Dialog
                                maxWidth={671}
                                open={this.state.Serviceopen}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">Add Service Rate</DialogTitle>
                                <DialogContent>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={3}>
                                            <Autocomplete
                                                id="combo-box-demo"
                                                options={ConsolidationCenterList}
                                                value={ConsolidationCenterId}
                                                onChange={(event, value) =>
                                                    this.ChangeCountry(value, "Center")
                                                }
                                                getOptionLabel={(option) => option.label}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Consolidation Center" />
                                                )}
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={3}>
                                            <CustomInput
                                                labelText={<span>Service Name</span>}
                                                id="ServiceName"
                                                name="ServiceName"
                                                variant="outlined"
                                                formControlProps={{ fullWidth: true }}
                                                inputProps={{
                                                    onFocus: () =>
                                                        this.setState({
                                                            checkServiceName: false,
                                                            serviceNameErr: false,
                                                            serviceNameHelperText: "",
                                                        }),
                                                    onBlur: (event) =>
                                                        this.handleChange(event, "servicename"),
                                                    onChange: (event) =>
                                                        this.handleChange(event, "servicename"),
                                                    value: ServiceName,
                                                    endAdornment:
                                                        this.state.checkServiceName !== true ? (
                                                            <Icon>person</Icon>
                                                        ) : (
                                                            <InputAdornment position="end">
                                                                {" "}
                                                                <DoneIcon
                                                                    style={{ color: green[500] }}
                                                                    className={useStyles.success}
                                                                />
                                                            </InputAdornment>
                                                        ),
                                                }}
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={3}>
                                            <CustomInput
                                                labelText={<span>Rate</span>}
                                                id="rate"
                                                name="rate"
                                                variant="outlined"
                                                formControlProps={{ fullWidth: true }}
                                                inputProps={{
                                                    onFocus: () =>
                                                        this.setState({
                                                            checkRate: false,
                                                            RateErr: false,
                                                            RateHelperText: "",
                                                        }),
                                                    onBlur: (event) =>
                                                        this.handleChange(event, "rate"),
                                                    onChange: (event) =>
                                                        this.handleChange(event, "rate"),
                                                    value: Rate,
                                                    endAdornment:
                                                        this.state.checkRate !== true ? (
                                                            <Icon>person</Icon>
                                                        ) : (
                                                            <InputAdornment position="end">
                                                                {" "}
                                                                <DoneIcon
                                                                    style={{ color: green[500] }}
                                                                    className={useStyles.success}
                                                                />
                                                            </InputAdornment>
                                                        ),
                                                }}
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={3}>
                                            <CustomInput
                                                labelText={<span>Rate Type</span>}
                                                id="rateType"
                                                name="rateType"
                                                variant="outlined"
                                                formControlProps={{ fullWidth: true }}
                                                inputProps={{
                                                    onFocus: () =>
                                                        this.setState({
                                                            checkRateType: false,
                                                            // RateTypeErr: false,
                                                            // RateTypeHelperText: "",
                                                        }),
                                                    onBlur: (event) =>
                                                        this.handleChange(event, "rateType"),
                                                    onChange: (event) =>
                                                        this.handleChange(event, "rateType"),
                                                    value: RateType,
                                                    endAdornment:
                                                        this.state.checkRateType !== true ? (
                                                            <Icon>person</Icon>
                                                        ) : (
                                                            <InputAdornment position="end">
                                                                {" "}
                                                                <DoneIcon
                                                                    style={{ color: green[500] }}
                                                                    className={useStyles.success}
                                                                />
                                                            </InputAdornment>
                                                        ),
                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>

                                </DialogContent>
                                <DialogActions>
                                    <Button color="rose" onClick={() => this.saveService(false)}>
                                        Save
                                    </Button>
                                    <Button color="secondary" onClick={() => this.setState({ Serviceopen: false })}>
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                        <div className="shipment-submit">
                            <div className="center">
                                {this.props.history.location.searchData ? (
                                    <Button
                                        color="secondary"
                                        onClick={() => this.handleSearchBack()}
                                    >
                                        Back To Search
                                    </Button>
                                ) : null}
                            </div>
                        </div>
                    </GridItem>
                </GridContainer>
                {this.state.Loading === true ? (
                    <div className="loading">
                        <SimpleBackdrop />
                    </div>
                ) : null}
            </div>
        );
    }
}

AddConsolidationCenter.propTypes = {
    classes: PropTypes.object,
};

export default withStyles()(AddConsolidationCenter);
