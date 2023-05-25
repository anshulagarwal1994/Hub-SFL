/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
// react components used to create a calendar with events on it
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";

import { useState, useEffect, useRef } from "react";
import SimpleBackdrop from "../../utils/general";
import moment from "moment";
// react component used to create alerts
import { useHistory } from "react-router";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
// import globalize from 'globalize'
import styles from "assets/jss/material-dashboard-pro-react/components/buttonStyle.js";
import api from "../../utils/apiClient";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
// import Tooltip from '@material-ui/core/Tooltip';
// import ReactTooltip from "react-tooltip";
import { CommonConfig } from "../../utils/constant";
import SearchIcon from "@material-ui/icons/Search";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import { Overlay, Tooltip } from "react-bootstrap";
import ReactDOM from "react-dom";
import cogoToast from "cogo-toast";
import {
  currentTimezone,
  getMoment,
  dateRangeHeaderFormat,
  getNow,
  getTimeAsDate,
} from "./dateUtils";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const localizer = momentLocalizer(moment);
const useStyles = makeStyles(styles);
const now = () => new Date();

const gymOffset = moment.tz("America/New_York").utcOffset();
const localOffset = moment().utcOffset();
const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
var offsetHours = '';
if(timeZone === 'Asia/Calcutta'){
  offsetHours = (gymOffset - localOffset) / 60 ;
}
else{
  offsetHours = (gymOffset - localOffset) / 30 ;
}

function Event(event) {
  const history = useHistory();
  const [showTooltip, setShowTooltip] = useState(false);

  const closeTooltip = () => {
    setShowTooltip(false);
  };

  const openTooltip = () => {
    setShowTooltip(true);
  };

  const redirectShipment = () => {
    history.push({
      pathname: "ShipmentNew",
      state: {
        ShipppingID: event.event.ShippingID,
        shipmentstatusList: [{ label: "New Request", value: "New Request" }],
        filterlist: [],
        sortlist: [],
      },
    });
  };

  const getTarget = () => {
    return ReactDOM.findDOMNode(ref.current);
  };

  const ref = useRef(null);

  return (
    <div ref={ref}>
      <span
        onClick={openTooltip}
      >
        {!CommonConfig.isEmpty(event.title) ? event.title : "Not Available"}
      </span>
      <Overlay
        rootClose
        target={getTarget}
        show={showTooltip}
        placement="top"
        onHide={closeTooltip}
      >
        <Tooltip className="calendar-tooltip" id="test">
          <span dangerouslySetInnerHTML={{ __html: event.event.body }}></span>
          <Button color="primary" justIcon onClick={redirectShipment}>
            Open
          </Button>
        </Tooltip>
      </Overlay>
    </div>
  );
}

const startDateChange = (event) => {
  return moment(event.start)
    .clone()
    .add(offsetHours, "hours")
    .toDate();
};
const endDateChange = (event) => {
  return moment(event.end)
    .clone()
    .add(offsetHours, "hours")
    .toDate();
};

function ShipmentCalender(props) {
  const classes = useStyles();
  const [events, setEvents] = React.useState([]);
  const [ServiceList, setServiceList] = React.useState([]);
  const [SubServiceList, setSubServiceList] = React.useState([]);
  const [SubServicename, setSubServicename] = React.useState(true);
  const [ServiceName, setServiceName] = React.useState([]);
  const [SubServiceName, setSubServiceName] = React.useState([]);
  const [shipmentTypeList, setshipmentTypeList] = React.useState([]);
  const [Access, setAccess] = React.useState({});
  const [ShipmentType, setShipmentType] = React.useState([]);
  const [StatusList, setStatusList] = React.useState([]);
  const [ShipmentStatus, setShipmentStatus] = React.useState([]);
  const [currentMonth, setcurrentMonth] = React.useState("");
  const [currentYear, setcurrentYear] = React.useState("");
  const [PickupProviderList, setPickupProviderList] = React.useState([]);
  const [PickupName, setPickupName] = React.useState([]);
  const [Loading, setLoading] = React.useState(false);

  useEffect(() => {
    setAccess(CommonConfig.getUserAccess("Shipment Calendar"));
    getShipmentType();
    getStatusList();
    getVendorList();
    SearchClick(moment().format("M"), moment().format("YYYY"));
  }, []);

  const showLoader = () => {
    setLoading(true);
  };
  const hideLoader = () => {
    setLoading(false);
  };

  const eventColors = (event) => {
    var style = {
      backgroundColor: event.color,
    };
    return {
      style: style,
    };
  };
  const SearchClick = (pMonth, pYear) => {
    let statusList = ShipmentStatus.filter((x) => x.value !== "All");
    let pickupNameList = PickupName.filter((x) => x.value !== "All");
    showLoader();
    let data = {
      ShipmentType: ShipmentType.filter((x) => x.value !== "Select All").map(
        (a) => a.value
      ),
      ServiceType: ServiceName.filter((x) => x.value !== "Select All").map(
        (a) => a.value
      ),
      SubServiceType: SubServiceName.filter(
        (x) => x.value !== "Select All"
      ).map((a) => a.value),
      ShipmentStatus: statusList.map((a) => a.value),
      PickupName: pickupNameList.map((a) => a.value),
      Access: CommonConfig.getUserAccess("Shipment Calendar").AllAccess,
      currentMonth: CommonConfig.isEmpty(pMonth)
        ? CommonConfig.isEmpty(currentMonth)
          ? moment().format("M")
          : currentMonth
        : pMonth,
      currentYear: CommonConfig.isEmpty(pYear)
        ? CommonConfig.isEmpty(currentYear)
          ? moment().format("YYYY")
          : currentYear
        : pYear,
      UserID: CommonConfig.loggedInUserData().PersonID,
    };
    try {
      api.post("reports/getShipmentCalendarList", data).then((res) => {
        hideLoader();
        const events = [];
        for (let i = 0; i < res.data.length; i++) {
          events.push({
            title: res.data[i].TitleContent,
            body: res.data[i].ToopTipContent,
            allDay: true,
            ShippingID: res.data[i].ShippingID,
            // start: convertDateTimeToDate(event.start, timeZoneName),
            // end: convertDateTimeToDate(event.end, timeZoneName),
            start: res.data[i].PickupDate.toString(),
            end: res.data[i].PickupDate.toString(),
            color: res.data[i].RowColor,
          });
        }
        setEvents(events);
      })
        .catch((error) => { });
    } catch (err) { }
  };

  const getServiceByShipmentType = (serviceType) => {
    try {
      let data = {
        ServiceType: serviceType
          .filter((x) => x.value !== "Select All")
          .map((a) => a.value),
      };
      api
        .post("userManagement/getServiceByAllShipmentType", data)
        .then((result) => {
          if (result.success) {
            let arr = [{ MainServiceName: "Select All" }];
            arr = [...arr, ...result.data];
            setServiceList(arr);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  };

  const getStatusList = () => {
    try {
      showLoader();
      let data = {
        stringMapType: "SHIPMENTSTATUS",
      };

      api.post("stringMap/getstringMap", data).then((result) => {
        const statusList = result.data.map((type) => {
          return { value: type.Description, label: type.Description };
        });
        setStatusList(statusList);
        hideLoader();
      })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  };

  const getVendorList = () => {
    try {
      showLoader();
      api.get("scheduleshipment/getPickupVendorList").then((res) => {
          if (res.success) {
           const providerList = res.data.map((type) => {
            return { value: type.VendorID, label: type.Name };
          });
          setPickupProviderList(providerList);
          hideLoader();
      } else {
        cogoToast.error("Something Went Wrong");
      }
        })
        .catch((err) => {
          cogoToast.error('Something Went Wrong!');
        });
    } catch (err) {
      console.log("error...", err);
    }
  };

  const getSubserviceName = (ServiceName, ShipmentType) => {
    try {
      let data = {
        ServiceName: ServiceName.filter((x) => x.value !== "Select All").map(
          (a) => a.value
        ),
        ServiceType: ShipmentType.filter((x) => x.value !== "Select All").map(
          (a) => a.value
        ),
      };
      api
        .post("userManagement/getAllSubserviceName", data)
        .then((result) => {
          if (result.success) {
            let arr = [{ ServiceName: "Select All" }];
            arr = [...arr, ...result.data];
            setSubServiceList(arr);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("error", err);
    }
  };

  const getShipmentType = () => {
    try {
      showLoader();
      let data = {
        stringMapType: "SHIPMENTTYPE",
      };

      api.post("stringMap/getstringMap", data).then((result) => {
          let arr = [{ Description: "Select All" }];
          arr = [...arr, ...result.data];
          setshipmentTypeList(arr);
          hideLoader();
        })
        .catch((err) => {
          hideLoader();
          console.log(err);
        });
    } catch (err) {
      hideLoader();
      console.log("error", err);
    }
  };

  const selectChange = (event, value, type) => {
    if (value != null) {
      if (type === "ServiceType") {
        let allFilter = value.findIndex((x) => x.value === "Select All");
        if (allFilter === 0 && value.length > 1) {
          value.splice(allFilter, 1);
          allFilter = -1;
        }
        if (allFilter !== -1) {
          value = [{ label: "Select All", value: "Select All" }];
        }
        setSubServicename(false);
        setServiceName(value);
        setSubServiceName([]);
        setSubServiceList([]);
        if (value.length > 0) {
          getSubserviceName(value, ShipmentType);
        }
      } else if (type === "SubServiceType") {
        let allFilter = value.findIndex((x) => x.value === "Select All");
        if (allFilter === 0 && value.length > 1) {
          value.splice(allFilter, 1);
          allFilter = -1;
        }
        if (allFilter !== -1) {
          value = [{ label: "Select All", value: "Select All" }];
        }
        setSubServiceName(value);
      } else if (type === "ShipmentType") {
        let allFilter = value.findIndex((x) => x.value === "Select All");
        if (allFilter === 0 && value.length > 1) {
          value.splice(allFilter, 1);
          allFilter = -1;
        }
        if (allFilter !== -1) {
          value = [{ label: "Select All", value: "Select All" }];
        }
        setShipmentType(value);
        setSubServiceName([]);
        setServiceName([]);
        setSubServiceList([]);
        setServiceList([]);
        getServiceByShipmentType(value);
      } else if (type === "Status") {
        let allFilter = value.findIndex((x) => x.value === "All");
        if (allFilter === 0 && value.length > 1) {
          value.splice(allFilter, 1);
          allFilter = -1;
        }
        if (allFilter !== -1) {
          value = [{ label: "All", value: "All" }];
        }
        setShipmentStatus(value);
      } else if (type === "Pickup") {
        let allFilter = value.findIndex((x) => x.value === "All");
        if (allFilter === 0 && value.length > 1) {
          value.splice(allFilter, 1);
          allFilter = -1;
        }
        if (allFilter !== -1) {
          value = [{ label: "All", value: "All" }];
        }
        setPickupName(value);
      }
    }
  };

  const optionPropsShipmentType = (option, value) => {
    if (option.value === value.value) {
      return true;
    } else {
      return false;
    }
  };

  const optionPropsServiceName = (option, value) => {
    if (option.value === value.value) {
      return true;
    } else {
      return false;
    }
  };

  const optionPropsSubServiceName = (option, value) => {
    if (option.value === value.value) {
      return true;
    } else {
      return false;
    }
  };

  const optionPropsStatus = (option, value) => {
    if (option.value === value.value) {
      return true;
    } else {
      return false;
    }
  };

  const navigateEvent = (focusDate, flipUnit, prevOrNext) => {
    const currMonth = moment(focusDate).format("M");
    const currYear = moment(focusDate).format("YYYY");

    setcurrentMonth(currMonth);
    setcurrentYear(currYear);

    SearchClick(currMonth, currYear);
  };

  const serviceNameL = ServiceList.map((type) => {
    return { value: type.MainServiceName, label: type.MainServiceName };
  });

  const subServiceL = SubServiceList.map((type) => {
    return { value: type.ServiceName, label: type.ServiceName };
  });

  const shipmentType = shipmentTypeList.map((type) => {
    return { value: type.Description, label: type.Description };
  });

  const IconStyle = {
    cursor: "pointer"
  };

  return (
    <div>
      {Loading === true ? (
        <div className="loading">
          <SimpleBackdrop />
        </div>
      ) : null}
      <GridContainer className="UserList-outer ml-auto">
        <GridItem xs={12} sm={3} md={2}>
          <div className="multiselect">
            <Autocomplete
              multiple
              size="small"
              id="filtercheckbox"
              options={shipmentType}
              value={ShipmentType}
              onChange={(event, value) =>
                selectChange(event, value, "ShipmentType")
              }
              getOptionSelected={(option, value) =>
                optionPropsShipmentType(option, value)
              }
              getOptionLabel={(option) => option.label}
              style={{ width: "100%" }}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.label}
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Shipment Type"
                  variant="outlined"
                />
              )}
            />
          </div>
        </GridItem>
        <GridItem xs={12} sm={3} md={2}>
          <div className="multiselect">
            <Autocomplete
              multiple
              size="small"
              id="filtercheckbox"
              options={serviceNameL}
              value={ServiceName}
              getOptionSelected={(option, value) =>
                optionPropsServiceName(option, value)
              }
              onChange={(event, value) =>
                selectChange(event, value, "ServiceType")
              }
              getOptionLabel={(option) => option.label}
              style={{ width: "100%" }}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.label}
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Service Type"
                  variant="outlined"
                />
              )}
            />
          </div>
        </GridItem>
        <GridItem xs={12} sm={3} md={2}>
          <div className="multiselect">
            <Autocomplete
              multiple
              size="small"
              id="filtercheckbox"
              disabled={SubServicename}
              value={SubServiceName}
              options={subServiceL}
              getOptionSelected={(option, value) =>
                optionPropsSubServiceName(option, value)
              }
              onChange={(event, value) =>
                selectChange(event, value, "SubServiceType")
              }
              getOptionLabel={(option) => option.label}
              style={{ width: "100%" }}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.label}
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sub Service Type"
                  variant="outlined"
                />
              )}
            />
          </div>
        </GridItem>
        <GridItem xs={12} sm={3} md={2}>
          <div className="multiselect">
            <Autocomplete
              multiple
              size="small"
              id="filtercheckbox"
              options={StatusList}
              value={ShipmentStatus}
              getOptionSelected={(option, value) =>
                optionPropsStatus(option, value)
              }
              onChange={(event, value) => selectChange(event, value, "Status")}
              getOptionLabel={(option) => option.label}
              style={{ width: "100%" }}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.label}
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Shipment Status"
                  variant="outlined"
                />
              )}
            />
          </div>
        </GridItem>
        <GridItem xs={12} sm={3} md={3}>
          <div className="multiselect">
            <Autocomplete
              multiple
              size="small"
              id="filtercheckbox"
              options={PickupProviderList}
              value={PickupName}
              getOptionSelected={(option, value) =>
                optionPropsStatus(option, value)
              }
              onChange={(event, value) => selectChange(event, value, "Pickup")}
              getOptionLabel={(option) => option.label}
              style={{ width: "100%" }}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.label}
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Pickup Provider"
                  variant="outlined"
                />
              )}
            />
          </div>
        </GridItem>
        <GridItem xs={12} sm={3} md={1}>
          <Button
            color="primary"
            style={{ marginTop: "15px", marginBottom: "0px" }}
            justIcon
            onClick={() => SearchClick()}
          >
            <SearchIcon />
          </Button>
        </GridItem>
      </GridContainer>

      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody calendar>
              <div className="shipment-calendar">
                <div className="cal-slug">
                  <div className="cal-slug-inner air">
                    <span></span>
                    <p>Air</p>
                  </div>
                  <div className="cal-slug-inner ground">
                    <span></span>
                    <p>Ground</p>
                  </div>
                  <div className="cal-slug-inner ocean">
                    <span></span>
                    <p>Ocean</p>
                  </div>
                </div>
                <BigCalendar
                  selectable
                  popup
                  tooltipAccessor={null}
                  // getNow={() => getNow(now, m)}
                  components={{ event: Event }}
                  onNavigate={(focusDate, flipUnit, prevOrNext) =>
                    navigateEvent(focusDate, flipUnit, prevOrNext)
                  }
                  localizer={localizer}
                  timeslots={24}
                  startAccessor={(event) => startDateChange(event)}
                  endAccessor={(event) => endDateChange(event)}
                  // step={1}
                  events={events}
                  views={{ month: true, week: true, day: true }}
                  defaultView="month"
                  scrollToTime={new Date(1970, 1, 1, 6)}
                  defaultDate={new Date()}
                  // date = {currentDate}
                  eventPropGetter={eventColors}
                  style={IconStyle}
                />
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

ShipmentCalender.propTypes = {
  classes: PropTypes.object,
};

export default ShipmentCalender;
