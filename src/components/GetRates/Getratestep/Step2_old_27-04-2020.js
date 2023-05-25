import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Grid from '@material-ui/core/Grid';
import api from '../../../utils/apiClient';
import { CommonConfig } from '../../../utils/constant';
import cogoToast from 'cogo-toast';
import _ from 'lodash';

const useStyles = () => makeStyles(styles);
const classes = useStyles();

class Step2 extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            CountryList : [],
            Loading: false,
            FromCountry : {},
            ToCountry : {},
            FromSelectedCountry : {},
            ToSelectedCountry : {},
            FromSelectedCity : {},
            FromFedExSelectedCity: {},
            FromUPSSelectedCity: {},
            FromCityList: [],
            FromFedExCityList: [],
            FromUPSCityList: [],
            ToCityList: [],
            ToFedExCityList: [],
            ToUPSCityList: [],
            No_TV : [
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '5', label: '5' },
                { value: '6', label: '6' },
                { value: '7', label: '7' },
                { value: '8', label: '8' },
                { value: '9', label: '9' },
                { value: '10', label: '10' },
            ],
            Eligible_for_TR: [
                { value: '1', label: 'Yes' },
                { value: '0', label: 'No' },
            ]
        };
    }

    componentDidMount() {
        this.GetCountry();
    }

    showLoader = () => {
        this.setState({ Loading: true });
    }

    hideLoader = () => {
        this.setState({ Loading: false });
    }

    GetCountry() {
        try {
            api.get('location/getCountryList').then(res => {
                
                if (res.success) {
                    this.hideLoader();
                    var Country = res.data;
    
                    var FromselectedCountryList = _.filter(Country, { 'CountryCode': 'US' });
                    var ToselectedCountryList = _.filter(Country , {'CountryCode' : 'IN'});

                    var FromSelectedCountry = {
                        value: FromselectedCountryList[0].CountryID,
                        label: FromselectedCountryList[0].CountryName
                    };

                    var ToSelectedCountry = {
                        value: ToselectedCountryList[0].CountryID,
                        label: ToselectedCountryList[0].CountryName
                    }; 
    
                    this.setState({
                                    FromSelectedCountry: FromSelectedCountry,
                                    ToSelectedCountry: ToSelectedCountry,
                                    FromCountry: FromselectedCountryList[0],
                                    ToCountry: ToselectedCountryList[0],
                                    CountryList: Country
                                 });
    
                }
            }).catch(err => {
                console.log("err...", err);
                cogoToast.error("Something Went Wrong");
            });
        } catch (error) {
           
        }
    }

    appendTV(){
       const No_OF_TV = this.state.No_TV;
       return No_OF_TV.map(no => {
            return(
                <MenuItem value={no.value} > {no.value}  </MenuItem>
            )
       }); 
    }

    appendEligibleforTR(){
       const EligibleTR = this.state.Eligible_for_TR;
       return EligibleTR.map(no => {
            return(
                <MenuItem value={no.value} > {no.label}  </MenuItem>
            )
       });
    }

    ChangeFromCountry = (event) => {

        if (CommonConfig.isEmpty(event)) {
            return null
        }

        var SelectedCountry = _.findIndex(this.state.CountryList, function (country) {
            return country.CountryName === event.label;
        });

        var SelectedCity = {};

        var FromCountry = this.state.FromCountry;
        FromCountry = this.state.CountryList[SelectedCountry];        

        if (FromCountry.CountryCode === 'US') {
            SelectedCity = { label: 'Select City' };
        } else if (FromCountry.IsFedexCity === 0 && FromCountry.IsUpsCity === 0) {
            SelectedCity = { value: 'Not Required', label: 'Not Required' };
        } else {
            SelectedCity = { label: 'Select City' };
        }

        this.setState({
            FromSelectedCountry: event,
            FromSelectedCity: SelectedCity,
            FromFedExSelectedCity: SelectedCity,
            FromUPSSelectedCity: SelectedCity,
            FromFedExCityList: [],
            FromUPSCityList: [], 
            FromCityList: []        
        });


        if (FromCountry.IsFedexCity) {
            var CityData = { CityType: 'FedEx', CountryId: FromCountry.CountryID };
            this.showLoader();
            api.post('location/getCityList', CityData).then(res => {
                if (res.success) {
                    this.setState({ FromFedExCityList: res.data });
                    this.hideLoader();
                } else {
                    this.setState({ FromFedExCityList: [] });
                    this.hideLoader();
                }
            }).catch(error => {
                cogoToast.error("Something Went Wrong");
            });
        }

        if (FromCountry.IsUpsCity) {
            var CityData = { CityType: 'UPS', CountryId: FromCountry.CountryID };
            this.showLoader();
            api.post('location/getCityList', CityData).then(res => {
                if (res.success) {
                    this.setState({ FromUPSCityList: res.data });
                    this.hideLoader();
                } else {
                    this.setState({ FromUPSCityList: [] });
                    this.hideLoader();
                }
            }).catch(error => {
                cogoToast.error("Something Went Wrong");
            });
        }
      
        this.setState({FromCountry : FromCountry});

    }

    ChangeToCountry = (event) => {

        if (CommonConfig.isEmpty(event)) {
            return null
        }

        var SelectedCountry = _.findIndex(this.state.CountryList, function (country) {
            return country.CountryName === event.label;
        });

        var SelectedCity = {};

        var ToCountry = this.state.ToCountry;
        ToCountry = this.state.CountryList[SelectedCountry];

        if (ToCountry.CountryCode === 'US') {
            SelectedCity = { label: 'Select City' };
        } else if (ToCountry.IsFedexCity === 0 && ToCountry.IsUpsCity === 0) {
            SelectedCity = { value: 'Not Required', label: 'Not Required' };
        } else {
            SelectedCity = { label: 'Select City' };
        }

        this.setState({
            ToCityList: [],
            ToFedExCityList: [],
            ToUPSCityList: [],
        });

        if (ToCountry.IsFedexCity) {
            var CityData = { CityType: 'FedEx', CountryId: ToCountry.CountryID };
            this.showLoader();
            api.post('location/getCityList', CityData).then(res => {
                if (res.success) {
                    this.setState({ ToFedExCityList: res.data });
                    this.hideLoader();
                } else {
                    this.setState({ ToFedExCityList: [] });
                    this.hideLoader();
                }
            }).catch(error => {
                cogoToast.error("Something Went Wrong");
            });
        }

        if (ToCountry.IsUpsCity) {
            var CityData = { CityType: 'UPS', CountryId: ToCountry.CountryID };
            this.showLoader();
            api.post('location/getCityList', CityData).then(res => {
                if (res.success) {
                    this.setState({ ToUPSCityList: res.data });
                    this.hideLoader();
                } else {
                    this.setState({ ToUPSCityList: [] });
                    this.hideLoader();
                }
            }).catch(error => {
                cogoToast.error("Something Went Wrong");
            });
        }

        this.setState({ToCountry : ToCountry});
        
    }

    ChangeFromZipUS = () => {

    }

    ChangeToZipUS = () => {

    }

    ChangeFromCity = () => {

    }

    ChangeToCity = () => {

    }


    render() {

        const FromCountryOptions = this.state.CountryList.map(fromCountry => { return { value: fromCountry.CountryID, label: fromCountry.CountryName } });
        const ToCountryOptions = this.state.CountryList.map(tocountry => { return { value: tocountry.CountryID, label: tocountry.CountryName } });

        var FromFedExCityListDisplay = this.state.FromFedExCityList.map(city => { return { value: city.CityCode, label: city.CityName } });
        var FromUPSCityListDisplay = this.state.FromUPSCityList.map(city => { return { value: city.CityCode, label: city.CityName } });
        var FromCityListDisplay = this.state.FromCityList.map(city => { return { value: city.City_code, label: city.Name } });

        var ToFedExCityListDisplay = this.state.ToFedExCityList.map(city => { return { value: city.CityCode, label: city.CityName } });
        var ToUPSCityListDisplay = this.state.ToUPSCityList.map(city => { return { value: city.CityCode, label: city.CityName } });
        var ToCityListDisplay = this.state.ToCityList.map(city => { return { value: city.City_code, label: city.Name } });

        var FromSection =
            <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                    <FormControl fullWidth>
                        <Autocomplete
                            options={FromCountryOptions}
                            id="FromCountry"
                            getOptionLabel={option => option.label}
                            value={this.state.FromSelectedCountry}
                            autoSelect
                            onChange={(event, value) => this.ChangeFromCountry(value)}
                            renderInput={params => (
                                <TextField {...params} label="From Country" margin="normal" fullWidth />)} />
                    </FormControl>
                </GridItem>

                {(this.state.FromCountry.CountryCode === 'US') ? (
                    <GridItem xs={12} sm={12} md={4}>
                        <FormControl fullWidth>
                            <CustomInput id="FromZipCode" labelText="From Zip Code" fullWidth
                                inputProps={{
                                    onBlur: (e) => this.ChangeFromZipUS(e)
                                }}
                            />
                        </FormControl>
                    </GridItem>
                ) : (this.state.FromCountry.IsFedexCity === 1) ? (
                    <GridItem xs={12} sm={12} md={4}>
                        <FormControl fullWidth>
                            <Autocomplete
                                options={FromFedExCityListDisplay}
                                id="FromFedExCity"
                                getOptionLabel={option => option.label}
                                value={this.state.FromFedExSelectedCity}
                                autoSelect
                                onChange={(event, value) => this.ChangeFromCity(value, "FedEx")}
                                renderInput={params => (
                                    <TextField {...params} label="From FedEX City" margin="normal" fullWidth />)} />
                        </FormControl>
                    </GridItem>
                ) : (
                            <GridItem xs={12} sm={12} md={4}>
                                <FormControl fullWidth>
                                    <TextField id="fromUpsZipCode" label="From Zip Code" fullWidth onBlur={(e) => this.ChangeFromZipUS(e)} />
                                </FormControl>
                            </GridItem>
                        )}

                {(this.state.FromCountry.CountryCode === 'US' || this.state.FromCountry.IsFedexCity === 0) ? (
                    <GridItem xs={12} sm={12} md={4}>

                        <Autocomplete
                            options={FromCityListDisplay}
                            id="FromCity"
                            getOptionLabel={option => option.label}
                            value={this.state.FromSelectedCity}
                            disabled={this.state.FromCountry.CountryCode !== 'US' && this.state.FromCountry.IsFedexCity === 0 ? true : false}
                            autoSelect
                            onChange={(event, value) => this.ChangeFromCity(value)}
                            renderInput={params => (
                                <TextField {...params} label="From City" margin="normal" fullWidth />)} />

                    </GridItem>
                ) : (this.state.FromCountry.IsUpsCity === 1) ? (
                    <GridItem xs={12} sm={12} md={4}>
                        <FormControl fullWidth>
                            <Autocomplete
                                options={FromUPSCityListDisplay}
                                id="FromUPSCity"
                                getOptionLabel={option => option.label}
                                value={this.state.FromUPSSelectedCity}
                                autoSelect
                                onChange={(event, value) => this.ChangeFromCity(value, "UPS")}
                                renderInput={params => (
                                    <TextField {...params} label="From City(UPS)" margin="normal" fullWidth />)} />
                        </FormControl>
                    </GridItem>
                ) : (
                            <GridItem xs={12} sm={12} md={4}>
                                <FormControl fullWidth>
                                    <TextField id="standard-basic" label="From Zip Code" margin="normal" fullWidth onBlur={(e) => this.ChangeFromZipUS(e)} />
                                </FormControl>
                            </GridItem>
                        )}
            </GridContainer>

        var ToSection =
             <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <Autocomplete
                            options={ToCountryOptions}
                            id="toCountry"
                            getOptionLabel={option => option.label}
                            value={this.state.ToSelectedCountry}
                            autoSelect
                            onChange={(event, value) => this.ChangeToCountry(value)}
                            renderInput={params => (
                                <TextField {...params} label="To Country" margin="normal" fullWidth />)} />
                    </Grid>

                    {(this.state.CountryCode === 'US') ? (
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <CustomInput labelText="To Zip Code" id="ToZipCode" fullWidth
                                    inputProps={{
                                        onBlur: (e) => this.ChangeToZipUS(e)
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        ) : (this.state.ToCountry.IsFedexCity === 1) ? (
                            <Grid item xs={4}>
                                <Autocomplete
                                    options={ToFedExCityListDisplay}
                                    id="ToFedExCity"
                                    getOptionLabel={option => option.label}
                                    value={this.state.ToFedExSelectedCity}
                                    autoSelect
                                    onChange={(event, value) => this.ChangeToCity(value, "FedEx")}
                                    renderInput={params => (
                                        <TextField {...params} label="To City (FedEx)" margin="normal" fullWidth />)} />
                            </Grid>
                        ) : (
                            <Grid item xs={4}>
                                <FormControl fullWidth>
                                    <CustomInput labelText="To Zip Code" fullWidth inputProps={{ onBlur: (e) => this.ChangeToZipUS(e) }} />
                                </FormControl>
                            </Grid>
                        )}

                    {(this.state.ToCountry.CountryCode === 'US' || this.state.ToCountry.IsFedexCity === 0) ? (
                        <Grid item xs={4}>
                            <Autocomplete
                                options={ToCityListDisplay}
                                id="toCity"
                                getOptionLabel={option => option.label}
                                value={this.state.ToSelectedCity}
                                disabled={this.state.ToCountry.CountryCode !== 'US' && this.state.ToCountry.IsFedexCity === 0 ? true : false}
                                autoSelect
                                onChange={(event, value) => this.ChangeToCity(value)}
                                renderInput={params => (
                                    <TextField {...params} label="To City" margin="normal" fullWidth />)} />
                        </Grid>
                        ) : (this.state.ToCountry.IsUpsCity === 1) ? (
                            <Grid item xs={4}>
                            <Autocomplete
                                options={ToUPSCityListDisplay}
                                id="ToUPSCity"
                                getOptionLabel={option => option.label}
                                value={this.state.ToUPSSelectedCity}
                                autoSelect
                                onChange={(event, value) => this.ChangeToCity(value, "UPS")}
                                renderInput={params => (
                                    <TextField {...params} label="To City (UPS)" margin="normal" fullWidth />)} />
                        </Grid>
                        ) : (
                            <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <CustomInput labelText="To Zip Code" fullWidth inputProps={{ onBlur: (e) => this.ChangeToZipUS(e) }} />
                                    </FormControl>
                                </Grid>
                        )}
              </Grid>

        return (
            <div>
                <GridContainer>
                    <GridItem md="12">
                        {FromSection}
                        {ToSection}
                    </GridItem>                     
                </GridContainer>
               
                <GridContainer>
                    <GridItem xs={12} sm={4} md={4}>
                        <FormControl className="mb18" fullWidth>
                            <InputLabel htmlFor="selectshipmenttype" className={classes.selectLabel}>No of TVs?</InputLabel>
                            <Select>
                                {this.appendTV()}    
                            </Select>
                        </FormControl>
                    </GridItem>
                    <GridItem xs={12} sm={4} md={4}>
                        <FormControl className="mb18" fullWidth>
                            <InputLabel htmlFor="selectshipmenttype" className={classes.selectLabel}>Eligible for TR?</InputLabel>
                            <Select>
                               {this.appendEligibleforTR()}
                            </Select>
                        </FormControl>
                    </GridItem>
                    <GridItem xs={12} sm={4} md={4}>
                        <FormControl className="mb18" fullWidth>
                            <InputLabel htmlFor="selectshipmenttype" className={classes.selectLabel}>Original Passport Available?</InputLabel>
                            <Select>
                                <MenuItem  value=""> Yes </MenuItem>
                                <MenuItem  value=""> No </MenuItem>
                            </Select>
                        </FormControl>
                    </GridItem>
                </GridContainer>
                <GridContainer>
                    <GridItem xs={12} sm={4} md={4}>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel htmlFor="selectshipmenttype" className={classes.selectLabel}>Pickup Type?</InputLabel>
                            <Select fullWidth={true}
                                MenuProps={{ className: classes.selectMenu }}
                                classes={{ select: classes.select }}>
                                <MenuItem classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }} value="State Name 1">Option 1</MenuItem>
                                <MenuItem classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }} value="State Name 2">Option 2 </MenuItem>
                            </Select>
                        </FormControl>
                    </GridItem>
                    <GridItem xs={12} sm={4} md={4}>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel htmlFor="selectshipmenttype" className={classes.selectLabel}>Enter Volume</InputLabel>
                            <Select fullWidth={true}
                                MenuProps={{ className: classes.selectMenu }}
                                classes={{ select: classes.select }}>
                                <MenuItem classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }} value="State Name 1">Option 1 </MenuItem>
                                <MenuItem classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }} value="State Name 2">Option 2 </MenuItem>
                            </Select>
                        </FormControl>
                    </GridItem>
                </GridContainer>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <h3>Package Details</h3>
                        <div className="package-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>No of Packages</th>
                                        <th>Weight</th>
                                        <th>Dimensions</th>
                                        <th>Chargeable Weight</th>
                                        <th>CFT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>10</td>
                                        <td>50</td>
                                        <td>18x18x24</td>
                                        <td>56</td>
                                        <td>4.5</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>65</td>
                                        <td>63x35x12</td>
                                        <td>75</td>
                                        <td>8.5</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4"><b>Total</b></td>
                                        <td><b>13</b></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </GridItem>
                </GridContainer>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <h3>Rate Quote</h3>
                        <div className="package-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Services</th>
                                        <th>Dallas TX 75234</th>
                                        <th>07094, Secaucus NJ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Door to Warehouse (FedEx)</td>
                                        <td>$ 300.00</td>
                                        <td>$ 318.00</td>
                                    </tr>
                                    <tr>
                                        <td>Door to Warehouse (FedEx)</td>
                                        <td>$ 300.00</td>
                                        <td>$ 318.00</td>
                                    </tr>
                                    <tr>
                                        <td>Door to Warehouse (FedEx)</td>
                                        <td>$ 300.00</td>
                                        <td>$ 318.00</td>
                                    </tr>
                                    <tr>
                                        <td>Door to Warehouse (FedEx)</td>
                                        <td>$ 300.00</td>
                                        <td>$ 318.00</td>
                                    </tr>
                                    <tr>
                                        <td>Door to Warehouse (FedEx)</td>
                                        <td>$ 300.00</td>
                                        <td>$ 318.00</td>
                                    </tr>
                                    <tr>
                                        <td>Door to Warehouse (FedEx)</td>
                                        <td>$ 300.00</td>
                                        <td>$ 318.00</td>
                                    </tr>
                                    <tr>
                                        <td><b>Total</b></td>
                                        <td><b>$ 1450.00</b></td>
                                        <td><b>$ 1250.00</b></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </GridItem>
                </GridContainer>
            </div>
        )
    }
}

export default withStyles()(Step2);

