import api from "../utils/apiClient";

export class CommonConfig {
  static isEmpty = function(value) {
    if (value === undefined || value === null || value === "") {
      return true;
    } else {
      if (typeof value === "string") {
        return value.trim() === "";
      } else {
        return false;
      }
    }
  };

  static dateFormat = {
    dateTime: "MM/DD/YYYY hh:mm:ss A",
    dateOnly: "MM/DD/YYYY",
    forDatePicker: "DD-MM-YYYY",
    yearOnly: "YYYY",
    dbDateTime: "YYYY-MM-DD HH:mm:ss",
    dbDateOnly: "YYYY-MM-DD",
    timeOnly: "HH:mm",
    time12Only: "h:mm A",
    dateTimeHrsMin: "MM/DD/YYYY hh:mm A",
  };

  static loggedInUserData = function() {
    if (localStorage.getItem("loggedInUserData")) {
      return JSON.parse(localStorage.getItem("loggedInUserData"));
    } else {
      return "";
    }
  };

  static getUserAccess = function(moduleName) {
    if (localStorage.getItem("loggedInUserData")) {
      let data = JSON.parse(localStorage.getItem("loggedInUserData"))
        .userModuleAccess;

      let moduleAccess = data.find((x) => x.MenuKey === moduleName);

      return moduleAccess;
    } else {
      return "";
    }
  };

  static getIPAddress = function() {};

  static filterCaseInsensitive = function(filter, row) {
    const id = filter.pivotId || filter.id;
    const content = row[id];

    if (typeof content !== "undefined") {
      if (typeof content === "object" && content !== null && content.key) {
        return String(content.key)
          .toLowerCase()
          .includes(filter.value.toLowerCase());
      } else {
        return String(content)
          .toLowerCase()
          .includes(filter.value.toLowerCase());
      }
    }

    return true;
  };

  static releaseLockShipment = function() {
    let success = false;
    let data = {
      ShippingID: "",
      UserID: this.loggedInUserData().PersonID,
      ReleaseAll: 1,
    };
    api
      .post("scheduleshipment/releaseShipmentLockByID", data)
      .then((res) => {
        if (res.success) {
          // cogoToast.success("Shipment unlocked successfully");
          success = true;
        } else {
          // cogoToast.error(res.message);
        }
      })
      .catch((err) => {
        console.log("setLock err", err);
      });
    return success;
  };

  static dateSortMethod = function(a, b) {
    if (a) {
      a = a.split("/");
      a = new Date(a[2], a[0] - 1, a[1]).getTime();
    }
    if (b) {
      b = b.split("/");
      b = new Date(b[2], b[0] - 1, b[1]).getTime();
    }
    return a > b ? 1 : -1;
  };

  static RegExp = {
    number: /^[0-9\b]+$/,
    onlyNumber: /[a-zA-Z~`!@#$%^&*()_+=-{}|:"<>?,;']+$/,
    onlyDecimal: /^[0-9]+(\.[0-9][0-9])?$/,
    phoneNumber: /^([0-9]+\s?)*$/g,
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    companyName: /[!@~`#$%^*()_+\-=\[\]{};':"\\|<>\/?]/,
    zipCode: /^([a-zA-Z0-9]+\s?)*$/g,
    regExpNumber: /[0-9]/g,
    regExpUpperCase: /[A-Z]/g,
    regExpLowerCase: /[a-z]/g,
    regExpSpecialCharacter: /[!@#$%^&*(),.?":{}|<>]/g,
    userNameSpecialCharacter: /[@#$%*._-]/g,
  };

  static zipCodeAPIKey = function(zipCode, countryName) {
    // return `https://maps.googleapis.com/maps/api/geocode/json?address="` + zipCode + `"&key=AIzaSyDIU6hx3WQi16Xd-5HlRgT6_QtLgpv1KKQ`

    return (
      `https://maps.googleapis.com/maps/api/geocode/json?&key=AIzaSyDIU6hx3WQi16Xd-5HlRgT6_QtLgpv1KKQ&components=country:` +
      countryName +
      `|postal_code:` +
      zipCode +
      ``
    );

    // return `https://maps.googleapis.com/maps/api/geocode/json?address=` + zipCode + `&components=country:=` + countryName + `|postal_code=` + zipCode + `&key=AIzaSyDIU6hx3WQi16Xd-5HlRgT6_QtLgpv1KKQ`
    // apiKey : 'AIzaSyDIU6hx3WQi16Xd-5HlRgT6_QtLgpv1KKQ'
  };
  static EmailAPIKey = function(Email) {
    return (
      `https://api.listwisehq.com/clean/deep.php?email=` +
      Email +
      `&api_key=67f3cba671614b7aa9d0bd97e74b0653`
    );

    // return `https://maps.googleapis.com/maps/api/geocode/json?address=` + zipCode + `&components=country:=` + countryName + `|postal_code=` + zipCode + `&key=AIzaSyDIU6hx3WQi16Xd-5HlRgT6_QtLgpv1KKQ`
    // apiKey : 'AIzaSyDIU6hx3WQi16Xd-5HlRgT6_QtLgpv1KKQ'
  };
  static timezoneAPI = function(lat, lon) {
    return (
      `https://maps.googleapis.com/maps/api/timezone/json?location=` +
      lat +
      `,` +
      lon +
      `&timestamp=1458000000&key=AIzaSyDIU6hx3WQi16Xd-5HlRgT6_QtLgpv1KKQ`
    );
  };

  static apiKey = {
    geoCodeAPI: "AIzaSyDIU6hx3WQi16Xd-5HlRgT6_QtLgpv1KKQ",
  };
}
