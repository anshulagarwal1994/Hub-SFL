import React, { Component } from 'react'
import Datetime from "react-datetime";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Icon from "@material-ui/core/Icon";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

const useStyles = () => makeStyles(styles);
const classes = useStyles();

class AllInputs extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <GridItem xs={12}>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                        <FormControl fullWidth>
                            <CustomInput
                                labelText="Name"
                                inputProps={{
                                value:"",
                                }}
                                
                            />
                        </FormControl>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                        <div className="select-spl">
                            <FormControl fullWidth>
                                <InputLabel
                                htmlFor="packagetype"
                                className={classes.selectLabel}
                                    >
                                        All Clear ?
                                    </InputLabel>
                                    <Select
                                        MenuProps={{
                                        className: classes.selectMenu,
                                        }}
                                        classes={{
                                        select: classes.select,
                                        }}
                                        value="No"
                                        // inputProps={{ disabled: ReadOnly }}
                                    >
                                        <MenuItem
                                        value={true}
                                        classes={{
                                            root: classes.selectMenuItem,
                                        }}
                                        >
                                        Yes
                                        </MenuItem>
                                        <MenuItem
                                        value={false}
                                        classes={{
                                            root: classes.selectMenuItem,
                                        }}
                                        >
                                        No
                                        </MenuItem>
                                    </Select>
                            </FormControl>
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                        <div className="date-spl">
                            <InputLabel className={classes.label}>
                                Start Date
                            </InputLabel>
                            <FormControl fullWidth>
                                <Datetime
                                dateFormat={"MM/DD/YYYY"}
                                timeFormat={false}
                                value={new Date()}
                                closeOnSelect={true}
                                renderInput={(params) => (
                                    <TextField {...params} fullWidth />
                                )}
                                />
                            </FormControl>
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                            labelText="Address Line 1"
                            id="proposaltype"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value:"",
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.User}>
                                    location_on
                                  </Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                    </GridItem>
                </GridContainer>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                        <FormControl fullWidth>
                            <CustomInput
                                labelText="Name"
                                inputProps={{
                                value:"",
                                }}
                                
                            />
                        </FormControl>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                        <div className="select-spl">
                            <FormControl fullWidth>
                                <InputLabel
                                htmlFor="packagetype"
                                className={classes.selectLabel}
                                    >
                                        All Clear ?
                                    </InputLabel>
                                    <Select
                                        MenuProps={{
                                        className: classes.selectMenu,
                                        }}
                                        classes={{
                                        select: classes.select,
                                        }}
                                        value="No"
                                        // inputProps={{ disabled: ReadOnly }}
                                    >
                                        <MenuItem
                                        value={true}
                                        classes={{
                                            root: classes.selectMenuItem,
                                        }}
                                        >
                                        Yes
                                        </MenuItem>
                                        <MenuItem
                                        value={false}
                                        classes={{
                                            root: classes.selectMenuItem,
                                        }}
                                        >
                                        No
                                        </MenuItem>
                                    </Select>
                            </FormControl>
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                        <div className="date-spl">
                            <InputLabel className={classes.label}>
                                Start Date
                            </InputLabel>
                            <FormControl fullWidth>
                                <Datetime
                                dateFormat={"MM/DD/YYYY"}
                                timeFormat={false}
                                value={new Date()}
                                closeOnSelect={true}
                                renderInput={(params) => (
                                    <TextField {...params} fullWidth />
                                )}
                                />
                            </FormControl>
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                            labelText="Address Line 1"
                            id="proposaltype"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value:"",
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.User}>
                                    location_on
                                  </Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                    </GridItem>
                </GridContainer>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                        <FormControl fullWidth>
                            <CustomInput
                                labelText="Name"
                                inputProps={{
                                value:"",
                                }}
                                
                            />
                        </FormControl>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                        <div className="select-spl">
                            <FormControl fullWidth>
                                <InputLabel
                                htmlFor="packagetype"
                                className={classes.selectLabel}
                                    >
                                        All Clear ?
                                    </InputLabel>
                                    <Select
                                        MenuProps={{
                                        className: classes.selectMenu,
                                        }}
                                        classes={{
                                        select: classes.select,
                                        }}
                                        value="No"
                                        // inputProps={{ disabled: ReadOnly }}
                                    >
                                        <MenuItem
                                        value={true}
                                        classes={{
                                            root: classes.selectMenuItem,
                                        }}
                                        >
                                        Yes
                                        </MenuItem>
                                        <MenuItem
                                        value={false}
                                        classes={{
                                            root: classes.selectMenuItem,
                                        }}
                                        >
                                        No
                                        </MenuItem>
                                    </Select>
                            </FormControl>
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                        <div className="date-spl">
                            <InputLabel className={classes.label}>
                                Start Date
                            </InputLabel>
                            <FormControl fullWidth>
                                <Datetime
                                dateFormat={"MM/DD/YYYY"}
                                timeFormat={false}
                                value={new Date()}
                                closeOnSelect={true}
                                renderInput={(params) => (
                                    <TextField {...params} fullWidth />
                                )}
                                />
                            </FormControl>
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                        <CustomInput
                            labelText="Address Line 1"
                            id="proposaltype"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value:"",
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.User}>
                                    location_on
                                  </Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                    </GridItem>
                </GridContainer>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                        <Autocomplete
                            id="package_number"
                            options={[]}
                            value={""}
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => <TextField {...params} label="Package"/>}
                        />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                        <div className="select-spl">
                            <FormControl fullWidth>
                                <InputLabel
                                htmlFor="packagetype"
                                className={classes.selectLabel}
                                    >
                                        All Clear ?
                                    </InputLabel>
                                    <Select
                                        MenuProps={{
                                        className: classes.selectMenu,
                                        }}
                                        classes={{
                                        select: classes.select,
                                        }}
                                        value="No"
                                        // inputProps={{ disabled: ReadOnly }}
                                    >
                                        <MenuItem
                                        value={true}
                                        classes={{
                                            root: classes.selectMenuItem,
                                        }}
                                        >
                                        Yes
                                        </MenuItem>
                                        <MenuItem
                                        value={false}
                                        classes={{
                                            root: classes.selectMenuItem,
                                        }}
                                        >
                                        No
                                        </MenuItem>
                                    </Select>
                            </FormControl>
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                        <div className="date-spl">
                            <InputLabel className={classes.label}>
                                Start Date
                            </InputLabel>
                            <FormControl fullWidth>
                                <Datetime
                                dateFormat={"MM/DD/YYYY"}
                                timeFormat={false}
                                value={new Date()}
                                closeOnSelect={true}
                                renderInput={(params) => (
                                    <TextField {...params} fullWidth />
                                )}
                                />
                            </FormControl>
                        </div>
                    </GridItem>
                </GridContainer>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                        <FormControl fullWidth>
                            <CustomInput
                                labelText="Name"
                                inputProps={{
                                value:"",
                                }}
                                
                            />
                        </FormControl>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                        <div className="select-spl">
                            <FormControl fullWidth>
                                <InputLabel
                                htmlFor="packagetype"
                                className={classes.selectLabel}
                                    >
                                        All Clear ?
                                    </InputLabel>
                                    <Select
                                        MenuProps={{
                                        className: classes.selectMenu,
                                        }}
                                        classes={{
                                        select: classes.select,
                                        }}
                                        value="No"
                                        // inputProps={{ disabled: ReadOnly }}
                                    >
                                        <MenuItem
                                        value={true}
                                        classes={{
                                            root: classes.selectMenuItem,
                                        }}
                                        >
                                        Yes
                                        </MenuItem>
                                        <MenuItem
                                        value={false}
                                        classes={{
                                            root: classes.selectMenuItem,
                                        }}
                                        >
                                        No
                                        </MenuItem>
                                    </Select>
                            </FormControl>
                        </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                        <div className="date-spl">
                            <InputLabel className={classes.label}>
                                Start Date
                            </InputLabel>
                            <FormControl fullWidth>
                                <Datetime
                                dateFormat={"MM/DD/YYYY"}
                                timeFormat={false}
                                value={new Date()}
                                closeOnSelect={true}
                                renderInput={(params) => (
                                    <TextField {...params} fullWidth />
                                )}
                                />
                            </FormControl>
                        </div>
                    </GridItem>
                </GridContainer>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                        <FormControl fullWidth>
                            <CustomInput
                                labelText="Name"
                                inputProps={{
                                value:"",
                                }}
                                
                            />
                        </FormControl>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                        <div className="select-spl">
                            <FormControl fullWidth>
                                <InputLabel
                                htmlFor="packagetype"
                                className={classes.selectLabel}
                                    >
                                        All Clear ?
                                    </InputLabel>
                                    <Select
                                        MenuProps={{
                                        className: classes.selectMenu,
                                        }}
                                        classes={{
                                        select: classes.select,
                                        }}
                                        value="No"
                                        // inputProps={{ disabled: ReadOnly }}
                                    >
                                        <MenuItem
                                        value={true}
                                        classes={{
                                            root: classes.selectMenuItem,
                                        }}
                                        >
                                        Yes
                                        </MenuItem>
                                        <MenuItem
                                        value={false}
                                        classes={{
                                            root: classes.selectMenuItem,
                                        }}
                                        >
                                        No
                                        </MenuItem>
                                    </Select>
                            </FormControl>
                        </div>
                    </GridItem>
                </GridContainer>
                <GridContainer>
            
                    
                    <GridItem xs={12} sm={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel
                            htmlFor="packagetype"
                            className={classes.selectLabel}
                                >
                                    All Clear ?
                                </InputLabel>
                                <Select
                                    MenuProps={{
                                    className: classes.selectMenu,
                                    }}
                                    classes={{
                                    select: classes.select,
                                    }}
                                    value="No"
                                    // inputProps={{ disabled: ReadOnly }}
                                >
                                    <MenuItem
                                    value={true}
                                    classes={{
                                        root: classes.selectMenuItem,
                                    }}
                                    >
                                    Yes
                                    </MenuItem>
                                    <MenuItem
                                    value={false}
                                    classes={{
                                        root: classes.selectMenuItem,
                                    }}
                                    >
                                    No
                                    </MenuItem>
                                </Select>
                        </FormControl>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                        <Autocomplete
                        id="combo-box-demo"
                        options={[]}
                        value=""
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => (
                            <TextField {...params} label="Managed By" />
                        )}
                        />

                    </GridItem>
                </GridContainer>
                <GridContainer>
                    
                        
                    <GridItem xs={12} sm={12} md={3}>
                        <Datetime
                        dateFormat={"MM/DD/YYYY"}
                        timeFormat={false}
                        defaultValue={new Date()}
                        closeOnSelect={true}
                        renderInput={(params) => (
                        <TextField 
                        
                        style={{marginTop:"-15px"}}
                        {...params} label="Arrival Date" margin="normal" fullWidth />)}/>
                        <Icon className="date-icon tp-slam">date_range</Icon>
                            
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                        <div className="normal-textarea">
                            <label>Comment</label>
                            <textarea  id="comments" value=""  rows={3} />
                        </div>
                    </GridItem>
                </GridContainer>
                    
                 
                  
                  
            </GridItem>
         );
    }
}
 
export default AllInputs;