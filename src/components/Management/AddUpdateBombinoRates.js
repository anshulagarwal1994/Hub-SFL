/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import api from "../../utils/apiClient";
import { CommonConfig } from "../../utils/constant";
import cogoToast from "cogo-toast";
import SimpleBackdrop from "../../utils/general";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import _ from "lodash";
import Button from "components/CustomButtons/Button.js";
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
import CardBody from "components/Card/CardBody";

const useStyles = makeStyles(styles);

const classes = () => {
    return useStyles();
};

class AddUpdateBombinoRates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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

            ServiceId: '',
            CompanyName: "",
            companyNameErr: false,
            companyNameHelperText: "",
            checkCompanyName: false,

            FirstLBS: "",
            FirstLBSErr: false,
            FirstLBSHelperText: "",

            AdditionalLBS: "",
            AdditionalLBSErr: false,
            AdditionalLBSHelperText: "",

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
        this.getCountry();
        this.getBombinoData();
    }

    getBombinoData() {
        try {
            this.showLoader();
            api.post("userManagement/getBombinoData").then((res) => {
                if (res.success) {
                    api.get("location/getCountryList").then((res1) => {
                        if (res1.success) {
                            var labeldata = res1.data.filter((x) => x.CountryCode === res.data[0].CountryCode);
                            var data = {
                                label: labeldata[0].CountryName,
                                value: res.data[0].CountryCode
                            } 
                            this.getStates(data);
                            this.setState({
                                Country: data, ZipCode: res.data[0].PostalCode, FirstLBS: res.data[0].FirstLBS,
                                AdditionalLBS: res.data[0].AdditionalLBS, ServiceId: res.data[0].ServiceID
                            });
                            this.zipChange(res.data[0].PostalCode);
                        }
                        this.hideLoader();
                    });
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

    showLoader = () => {
        this.setState({ Loading: true });
    };

    hideLoader = () => {
        this.setState({ Loading: false });
    };

    handleChange = (event, type) => {
        if (type === "companyname") {
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
        } else if (type === "FirstLBS") {
            this.setState({ FirstLBS: event.target.value });
        } else if (type === "AdditionalLBS") {
            this.setState({ AdditionalLBS: event.target.value });
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
        }
    };

    saveRates = () => {
        try {
            this.showLoader();
            let Details = {
                ServiceId: this.state.ServiceId,
                State: this.state.State,
                FirstLBS: this.state.FirstLBS,
                AdditionalLBS: this.state.AdditionalLBS,
                ZipCode: this.state.ZipCode,
                City: this.state.City.value,
                CountryCode: this.state.Country.value,
            };
            api.post("userManagement/addUpdateBombinoRates", Details).then((res) => {
                if (res.success) {
                    cogoToast.success("Rates Updated");
                    window.location.reload();
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

    cancelUser = () => {
        this.props.history.push({
            pathname: "/admin/ManagementNavigation",
        });
    };

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
            }
        }
    };

    render() {
        const {
            State,
            FirstLBS,
            AdditionalLBS,
            ZipCode,
            City,
            Country,
        } = this.state;

        const CityOptions = this.state.GoogleAPICityList.map((city) => {
            return { value: city.City_code, label: city.Name };
        });

        const CountryOptions = this.state.CountryList.map((fromCountry) => {
            return { value: fromCountry.CountryCode, label: fromCountry.CountryName };
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
                                    Bombino Rates
                                </h4>
                            </CardHeader>
                            <Cardbody>
                                <Card>
                                    <CardBody>
                                        <GridContainer xs={12} sm={12} md={12}>
                                            <GridItem xs={4} sm={4} md={4}>
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
                                            <GridItem xs={4} sm={4} md={4}>
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
                                            <GridItem xs={4} sm={4} md={4}>
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
                                        </GridContainer>
                                        <GridContainer xs={12} sm={12} md={12}>
                                            <GridItem xs={4} sm={4} md={4}>
                                                <CustomInput
                                                    labelText={<span>State</span>}
                                                    id="State"
                                                    name="State"
                                                    variant="outlined"
                                                    formControlProps={{ fullWidth: true }}
                                                    inputProps={{
                                                        onBlur: (event) =>
                                                            this.handleChange(event, "State"),
                                                        onChange: (event) =>
                                                            this.handleChange(event, "State"),
                                                        value: State,
                                                        endAdornment:
                                                            <Icon className={useStyles.User}>public</Icon>
                                                    }}
                                                />
                                            </GridItem>
                                            <GridItem xs={4} sm={4} md={4}>
                                                <CustomInput
                                                    labelText={<span>First LBS</span>}
                                                    id="FirstLBS"
                                                    name="FirstLBS"
                                                    variant="outlined"
                                                    formControlProps={{ fullWidth: true }}
                                                    inputProps={{
                                                        onFocus: () =>
                                                            this.setState({
                                                                FirstLBSErr: false,
                                                                FirstLBSHelperText: "",
                                                            }),
                                                        onBlur: (event) =>
                                                            this.handleChange(event, "FirstLBS"),
                                                        onChange: (event) =>
                                                            this.handleChange(event, "FirstLBS"),
                                                        value: FirstLBS,
                                                        endAdornment:
                                                            <Icon>person</Icon>
                                                    }}
                                                />
                                            </GridItem>
                                            <GridItem xs={4} sm={4} md={4}>
                                                <CustomInput
                                                    labelText={<span>Additional LBS</span>}
                                                    id="AdditionalLBS"
                                                    name="AdditionalLBS"
                                                    variant="outlined"
                                                    formControlProps={{ fullWidth: true }}
                                                    inputProps={{
                                                        onFocus: () =>
                                                            this.setState({
                                                                checkAddressLine2: false,
                                                                AdditionalLBSErr: false,
                                                                AdditionalLBSHelperText: "",
                                                            }),
                                                        onBlur: (event) =>
                                                            this.handleChange(event, "AdditionalLBS"),
                                                        onChange: (event) =>
                                                            this.handleChange(event, "AdditionalLBS"),
                                                        value: AdditionalLBS,
                                                        endAdornment:
                                                            <Icon>person</Icon>
                                                    }}
                                                />
                                            </GridItem>
                                        </GridContainer>
                                    </CardBody>
                                    <div className="right">
                                        <Button color="rose" onClick={() => this.saveRates(false)}>
                                            Save
                                        </Button>
                                        <Button color="secondary" onClick={() => this.cancelUser()}>
                                            Cancel
                                        </Button>

                                    </div>
                                </Card>

                            </Cardbody>
                        </Card>
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

AddUpdateBombinoRates.propTypes = {
    classes: PropTypes.object,
};

export default withStyles()(AddUpdateBombinoRates);
