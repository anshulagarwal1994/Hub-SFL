import React from "react";
// react component for creating dynamic tables

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import HeadsetMic from "@material-ui/icons/HeadsetMic";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import Icon from "@material-ui/core/Icon";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Check from "@material-ui/icons/Check";

const styles = {
    cardIconTitle: {
        ...cardTitle,
        marginTop: "15px",
        marginBottom: "0px"
    }
};

// const [registerEmail, setregisterEmail] = React.useState("");
// const [registerEmailState, setregisterEmailState] = React.useState("");

export default function ReactTables() {

    const useStyles = makeStyles(styles);
    const classes = useStyles();

    const [checked, setChecked] = React.useState([24, 22]);

    const handleToggle = value => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const verifyEmail = value => {
        var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (emailRex.test(value)) {
            return true;
        }
        return false;
    };

    return (
        <GridContainer className="UserList-outer">
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader className="btn-right-outer" color="primary" icon>
                        <CardIcon color="primary">
                            <HeadsetMic />
                        </CardIcon>
                        <h4 className="margin-right-auto text-color-black">Edit Proposal</h4>
                    </CardHeader>
                    <CardBody>
                        <GridContainer justify="center">
                            <GridItem xs={12} sm={12} md={4}>
                                <CustomInput
                                    // success={this.state.firstnameState === "success"}
                                    //error={this.state.firstnameState === "error"}
                                    labelText={
                                        <span>
                                            Managed by
                                            </span>
                                    }
                                    id="managedby"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event => this.change(event, "managedby", "length", 10),
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className={classes.inputAdornment}
                                            >
                                                <Icon className={classes.User}>
                                                    perm_identity
                                                    </Icon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <CustomInput
                                    // success={this.state.firstnameState === "success"}
                                    //error={this.state.firstnameState === "error"}
                                    labelText={
                                        <span>
                                            Contact Name
                                            </span>
                                    }
                                    id="contactname"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event => this.change(event, "contactname", "length", 10),
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className={classes.inputAdornment}
                                            >
                                                <Icon className={classes.User}>
                                                    account_box
                                                    </Icon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <CustomInput
                                    // success={this.state.firstnameState === "success"}
                                    //error={this.state.firstnameState === "error"}
                                    labelText={
                                        <span>
                                            Pickup Country
                                            </span>
                                    }
                                    id="pickupcountry"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event => this.change(event, "pickupcountry", "length", 10),
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className={classes.inputAdornment}
                                            >
                                                <Icon className={classes.User}>
                                                    public
                                                    </Icon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <CustomInput
                                    // success={this.state.firstnameState === "success"}
                                    //error={this.state.firstnameState === "error"}
                                    labelText={
                                        <span>
                                            Dropoff Country
                                            </span>
                                    }
                                    id="dropoffcountry"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event => this.change(event, "dropoffcountry", "length", 10),
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className={classes.inputAdornment}
                                            >
                                                <Icon className={classes.User}>
                                                    public
                                                    </Icon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <CustomInput
                                    // success={this.state.firstnameState === "success"}
                                    //error={this.state.firstnameState === "error"}
                                    labelText={
                                        <span>
                                            Lead Date
                                            </span>
                                    }
                                    id="leaddate"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event => this.change(event, "leaddate", "length", 10),
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className={classes.inputAdornment}
                                            >
                                                <Icon className={classes.User}>
                                                    date_range
                                                    </Icon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <CustomInput
                                    // success={this.state.firstnameState === "success"}
                                    //error={this.state.firstnameState === "error"}
                                    labelText={
                                        <span>
                                            Referred by?
                                            </span>
                                    }
                                    id="referredby"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event => this.change(event, "referredby", "length", 10),
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className={classes.inputAdornment}
                                            >
                                                <Icon className={classes.User}>
                                                    supervised_user_circle
                                                    </Icon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <CustomInput
                                    // success={this.state.firstnameState === "success"}
                                    //error={this.state.firstnameState === "error"}
                                    labelText={
                                        <span>
                                            Comments
                                            </span>
                                    }
                                    id="comments"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event => this.change(event, "comments", "length", 10),
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className={classes.inputAdornment}
                                            >
                                                <Icon className={classes.User}>
                                                    chat_bubble
                                                    </Icon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={4}>
                                <CustomInput
                                    // success={this.state.firstnameState === "success"}
                                    //error={this.state.firstnameState === "error"}
                                    labelText={
                                        <span>
                                            Proposal Type
                                            </span>
                                    }
                                    id="proposaltype"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event => this.change(event, "proposaltype", "length", 10),
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className={classes.inputAdornment}
                                            >
                                                <Icon className={classes.User}>
                                                    receipt
                                                </Icon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <CustomInput
                                    //success={registerEmailState === "success"}
                                    //error={registerEmailState === "error"}
                                    labelText="Email Address *"
                                    id="registeremail"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className={classes.inputAdornment}
                                            >
                                                <Icon className={classes.inputAdornmentIcon}>
                                                    email
                                                </Icon>
                                            </InputAdornment>
                                        ),
                                        onChange: event => {
                                            if (verifyEmail(event.target.value)) {
                                                // setregisterEmailState("success");
                                            } else {
                                                // setregisterEmailState("error");
                                            }
                                            // setregisterEmail(event.target.value);
                                        },
                                        type: "email"
                                    }}
                                />
                                <CustomInput
                                    // success={this.state.firstnameState === "success"}
                                    //error={this.state.firstnameState === "error"}
                                    labelText={
                                        <span>
                                            Pickup City /Zip
                                            </span>
                                    }
                                    id="pickupcityzip"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event => this.change(event, "pickupcityzip", "length", 10),
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className={classes.inputAdornment}
                                            >
                                                <Icon className={classes.User}>
                                                    location_city
                                                </Icon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <CustomInput
                                    // success={this.state.firstnameState === "success"}
                                    //error={this.state.firstnameState === "error"}
                                    labelText={
                                        <span>
                                            Dropoff City/Zip
                                            </span>
                                    }
                                    id="dropoffcityzip"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event => this.change(event, "dropoffcityzip", "length", 10),
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className={classes.inputAdornment}
                                            >
                                                <Icon className={classes.User}>
                                                    location_city
                                                </Icon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <CustomInput
                                    // success={this.state.firstnameState === "success"}
                                    //error={this.state.firstnameState === "error"}
                                    labelText={
                                        <span>
                                            Follow-up Date
                                            </span>
                                    }
                                    id="followupdate"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event => this.change(event, "followupdate", "length", 10),
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className={classes.inputAdornment}
                                            >
                                                <Icon className={classes.User}>
                                                    date_range
                                                </Icon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <CustomInput
                                    // success={this.state.firstnameState === "success"}
                                    //error={this.state.firstnameState === "error"}
                                    labelText={
                                        <span>
                                            Lead IP Address
                                            </span>
                                    }
                                    id="leadipaddress"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event => this.change(event, "leadipaddress", "length", 10),
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className={classes.inputAdornment}
                                            >
                                                <Icon className={classes.User}>
                                                    public
                                                </Icon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={4}>
                                <CustomInput
                                    // success={this.state.firstnameState === "success"}
                                    //error={this.state.firstnameState === "error"}
                                    labelText={
                                        <span>
                                            Proposal Status
                                            </span>
                                    }
                                    id="proposalstatus"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event => this.change(event, "proposalstatus", "length", 10),
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className={classes.inputAdornment}
                                            >
                                                <Icon className={classes.User}>
                                                    chrome_reader_mode
                                                </Icon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <CustomInput
                                    // success={this.state.firstnameState === "success"}
                                    //error={this.state.firstnameState === "error"}
                                    labelText={
                                        <span>
                                            Phone
                                            </span>
                                    }
                                    id="phone"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event => this.change(event, "phone", "length", 10),
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className={classes.inputAdornment}
                                            >
                                                <Icon className={classes.User}>
                                                    local_phone
                                                </Icon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <CustomInput
                                    // success={this.state.firstnameState === "success"}
                                    //error={this.state.firstnameState === "error"}
                                    labelText={
                                        <span>
                                            Pickup State
                                            </span>
                                    }
                                    id="pickupstate"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event => this.change(event, "pickupstate", "length", 10),
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className={classes.inputAdornment}
                                            >
                                                <Icon className={classes.User}>
                                                    date_range
                                                </Icon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <CustomInput
                                    // success={this.state.firstnameState === "success"}
                                    //error={this.state.firstnameState === "error"}
                                    labelText={
                                        <span>
                                            Dropoff State
                                            </span>
                                    }
                                    id="dropoffstate"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event => this.change(event, "dropoffstate", "length", 10),
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className={classes.inputAdornment}
                                            >
                                                <Icon className={classes.User}>
                                                    public
                                                </Icon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <CustomInput
                                    // success={this.state.firstnameState === "success"}
                                    //error={this.state.firstnameState === "error"}
                                    labelText={
                                        <span>
                                            Tentative Date
                                            </span>
                                    }
                                    id="tentativedate"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event => this.change(event, "tentativedate", "length", 10),
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className={classes.inputAdornment}
                                            >
                                                <Icon className={classes.User}>
                                                    date_range
                                                </Icon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <CustomInput
                                    // success={this.state.firstnameState === "success"}
                                    //error={this.state.firstnameState === "error"}
                                    labelText={
                                        <span>
                                            Delivery Type
                                            </span>
                                    }
                                    id="deliverytype"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event => this.change(event, "deliverytype", "length", 10),
                                        endAdornment: (
                                            <InputAdornment
                                                position="end"
                                                className={classes.inputAdornment}
                                            >
                                                <Icon className={classes.User}>
                                                    local_shipping
                                                </Icon>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <GridContainer>
                                    <GridItem xs={12} sm={12}>
                                        <FormLabel
                                            className={
                                                classes.labelHorizontal +
                                                " " +
                                                classes.labelHorizontalRadioCheckbox
                                            }
                                        >
                                            Content
                                        </FormLabel>
                                    </GridItem>
                                    <GridItem xs={12} sm={12}>
                                        <div className={classes.inlineChecks}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        tabIndex={-1}
                                                        onClick={() => handleToggle(10)}
                                                        checkedIcon={
                                                            <Check className={classes.checkedIcon} />
                                                        }
                                                        icon={<Check className={classes.uncheckedIcon} />}
                                                        classes={{
                                                            checked: classes.checked,
                                                            root: classes.checkRoot
                                                        }}
                                                    />
                                                }
                                                classes={{
                                                    label: classes.label,
                                                    root: classes.labelRoot
                                                }}
                                                label="Envelop"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        tabIndex={-1}
                                                        onClick={() => handleToggle(11)}
                                                        checkedIcon={
                                                            <Check className={classes.checkedIcon} />
                                                        }
                                                        icon={<Check className={classes.uncheckedIcon} />}
                                                        classes={{
                                                            checked: classes.checked,
                                                            root: classes.checkRoot
                                                        }}
                                                    />
                                                }
                                                classes={{
                                                    label: classes.label,
                                                    root: classes.labelRoot
                                                }}
                                                label="Boxes"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        tabIndex={-1}
                                                        onClick={() => handleToggle(12)}
                                                        checkedIcon={
                                                            <Check className={classes.checkedIcon} />
                                                        }
                                                        icon={<Check className={classes.uncheckedIcon} />}
                                                        classes={{
                                                            checked: classes.checked,
                                                            root: classes.checkRoot
                                                        }}
                                                    />
                                                }
                                                classes={{
                                                    label: classes.label,
                                                    root: classes.labelRoot
                                                }}
                                                label="Furniture"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        tabIndex={-1}
                                                        onClick={() => handleToggle(12)}
                                                        checkedIcon={
                                                            <Check className={classes.checkedIcon} />
                                                        }
                                                        icon={<Check className={classes.uncheckedIcon} />}
                                                        classes={{
                                                            checked: classes.checked,
                                                            root: classes.checkRoot
                                                        }}
                                                    />
                                                }
                                                classes={{
                                                    label: classes.label,
                                                    root: classes.labelRoot
                                                }}
                                                label="TV"
                                            />
                                        </div>
                                    </GridItem>
                                </GridContainer>
                            </GridItem>
                        </GridContainer>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                                <h3>Package Details</h3>
                                <div className="package-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Quantity</th>
                                                <th>Package Content</th>
                                                <th>Actual Weight [Lbs.]</th>
                                                <th>Package Dimension</th>
                                                <th>Chargeable Weight [Lbs.]</th>
                                                <th>CFT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    10
                                                </td>
                                                <td>
                                                    Box
                                                </td>
                                                <td>
                                                    30
                                                </td>
                                                <td>
                                                    18x18x24
                                                </td>
                                                <td>
                                                    56
                                                </td>
                                                <td>
                                                    45
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <GridContainer justify="center">
                                        <GridItem>
                                            <Button justify="center">Add New Row</Button>
                                        </GridItem>
                                    </GridContainer>
                                </div>
                            </GridItem>
                        </GridContainer>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                                <h3>Notes</h3>
                                <div className="package-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Comments</th>
                                                <th>Attachment</th>
                                                <th>Added By</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    12/15/2020
                                                </td>
                                                <td>
                                                    This is comments area where user will enter whatever
                                                </td>
                                                <td>
                                                    View
                                                </td>
                                                <td>
                                                    Punit M
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </GridItem>
                        </GridContainer>
                        <GridContainer justify="center">
                            <Button className="signup-btn">
                                Save
                            </Button>
                            <Button className="cancel-btn">
                                Cancel
                            </Button>
                        </GridContainer>
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>
    );
}
