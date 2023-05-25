import React, { Component, useRef } from "react";
import Button from "components/CustomButtons/Button.js";
import Autocomplete from "react-google-autocomplete";
import Geocode from "react-geocode";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import api from "../../../utils/apiClient";
import { CommonConfig } from "../../../utils/constant";
import { getDistance } from "geolib";
const geolib = require("geolib");
Geocode.setApiKey(CommonConfig.apiKey.geoCodeAPI);
Geocode.enableDebug();
export class MapVendor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showingInfoWindow: false,
      showingcurrentmarker: false,
      searchPositionMarker: false,
      activeMarker: {},
      selectedPlace: {},
      filterProps: [],
      sortProps: [],
      serviceValue: [],
      shelters: [],
      ViewContact: false,
      isOpen: false,
      bounds: null,
      zoom: 2,
      distanceShow: 0,
      searchPosition: {
        lat: null,
        lng: null,
      },
      markerPosition: {
        lat: null,
        lng: null,
      },
      center: {
        lat: null,
        lng: null,
      },
    };
  }
  componentDidMount() {
    if (this.props.location.state) {
      this.getMapData(this.props.location.state);
      this.setState({
        serviceValue: this.props.location.state.serviceValue,
        servicelist: this.props.location.state.servicelist,
        vendorList: this.props.location.state.vendorList,
        filterlist: this.props.location.state.filterProps,
        sortlist: this.props.location.state.sortProps,
      });
    }
  }

  getdetails = () => {
    api.get("vendor/converadresslatlng").then((res) => {});
  };

  gotovenderdetails = () => {
    this.props.history.push({
      pathname: "AddEditVendor/",
      state: {
        vendorId: this.state.showMarker.VendorID,
        filterlist: this.state.filterProps,
        sortlist: this.state.sortProps,
        serviceValue: this.state.serviceValue,
      },
    });
  };

  gotback = () => {
    this.props.history.push({
      pathname: "Vendor/",
      state: {
        serviceValue: this.state.serviceValue,
        servicelist: this.state.servicelist,
        vendorList: this.state.vendorList,
        filterlist: this.state.filterProps,
        sortlist: this.state.sortProps,
      },
    });
  };

  getMapData = (data) => {
    if (data.serviceValue) {
    } else {
      data.serviceValue = "";
    }
    api.post("vendor/getMapData", data).then((res) => {
      this.setState({ shelters: res.message });
    });
  };

  onMouseoverMarker = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });

  onMarkerClick = (props, marker, e) => {
    this.state.shelters.forEach((item, key) => {
      if (this.state.searchPosition.lat) {
        if (item.AddressID == props.title) {
          this.setState({ distanceShow: 0 });
          var DistanceX = 0;
          DistanceX = getDistance(
            {
              latitude: this.state.searchPosition.lat,
              longitude: this.state.searchPosition.lng,
            },
            { latitude: item.lat, longitude: item.lng }
          );
          var newDistanceMiles = 0;
          newDistanceMiles = geolib.convertDistance(DistanceX, "mi");
          this.setState({
            distanceShow: parseFloat(newDistanceMiles).toFixed(2),
          });
        }
      }
      if (item.AddressID == props.title) {
        this.setState({
          ViewContact: true,
          showMarker: item,
        });
      }
    });
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });
  };

  distance = (lat1, lon1, lat2, lon2, unit) => {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") {
        dist = dist * 1.609344;
      }
      if (unit == "N") {
        dist = dist * 0.8684;
      }
      if (unit == "M") {
        dist = dist * 0.8684;
      }
      return dist;
    }
  };

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        ViewContact: false,
        showingInfoWindow: false,
        activeMarker: null,
        showMarker: null,
      });
    }
  };

  onPlaceSelected = (place) => {
    const google = window.google;
    const bounds = new google.maps.LatLngBounds();
    if (place.geometry.viewport) {
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
    const latValue = place.geometry.location.lat();
    const lngValue = place.geometry.location.lng();

    this.setState({
      bounds: bounds,
      searchPosition: {
        lat: latValue,
        lng: lngValue,
      },
      zoom: 10,
      searchPositionMarker: true,
      center: {
        lat: latValue,
        lng: lngValue,
      },
    });
  };

  handleClick = (marker, event) => {
    this.setState({ selectedMarker: marker });
  };

  centerMoved = (mapProps, map) => {
    this.setState({
      markerPosition: {
        lat: map.center.lat(),
        lng: map.center.lng(),
      },
    });
  };

  onToggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };
  render() {
    const shelters = this.state.shelters;
    const selectedMarker = this.state.selectedMarker;
    return (
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <div>
          <Autocomplete
            style={{
              width: "75%",
              height: "40px",
              marginTop: "2px",
              marginBottom: "20px",
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              marginTop: `27px`,
              padding: `0 1   2px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              marginRight: "15px",
              alignItems: "start",
              textOverflow: `ellipses`,
            }}
            onPlaceSelected={this.onPlaceSelected}
            types={["(regions)"]}
          />

          <Button
            color="primary"
            style={{ marginRight: "15px" }}
            onClick={() => this.gotback()}
          >
            List View
          </Button>

          {this.state.ViewContact ? (
            <Button
              color="primary"
              style={{ alignItems: "end" }}
              onClick={() => this.gotovenderdetails()}
            >
              View Contact
            </Button>
          ) : null}
        </div>
        <div>
          <Map
            initialCenter={this.state.center}
            center={this.state.center}
            google={this.props.google}
            onClick={this.onMapClicked}
            onReady={this.fetchPlaces}
            style={{ width: "100%", height: "550px", position: "relative" }}
            className={"map"}
            zoom={this.state.zoom}
          >
            {this.state.searchPositionMarker ? (
              <Marker
                icon={"http://maps.google.com/mapfiles/ms/icons/blue.png"}
                title={"Search position."}
                name={"Search Location"}
                position={{
                  lat: this.state.searchPosition.lat,
                  lng: this.state.searchPosition.lng,
                }}
              />
            ) : null}
            {this.state.shelters.map((marker, key) => (
              <Marker
                key={marker.AddressID}
                title={marker.AddressID}
                onClick={this.onMarkerClick}
                position={{ lat: marker.lat, lng: marker.lng }}
              />
            ))}
            <InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}
            >
              {this.state.showMarker ? (
                this.state.showMarker.AddressID ? (
                  <div style={{ width: "400px", height: "240px" }}>
                    {this.state.showMarker.Name ? (
                      <h4>
                        <b>{this.state.showMarker.Name}</b>
                      </h4>
                    ) : null}
                    {this.state.showMarker.AddressID ? (
                      <h5 style={{ margin: "20px 0px -10px 0px" }}>
                        {this.state.showMarker.AddressLine1}{" "}
                        {this.state.showMarker.AddressLine2}
                        {this.state.showMarker.AddressLine3}
                      </h5>
                    ) : null}
                    {this.state.showMarker.AddressID ? (
                      <h5 style={{ margin: "10px 0px -10px 0px" }}>
                        {this.state.showMarker.City}{" "}
                        {this.state.showMarker.ZipCode}
                      </h5>
                    ) : null}
                    {this.state.showMarker.AddressID ? (
                      <h5 style={{ "margin-top": "10px" }}>
                        {this.state.showMarker.Country}
                      </h5>
                    ) : null}
                    {this.state.distanceShow == 0 ? (
                      <h5 style={{ margin: "30px 0px 0px 0px" }}>
                        From Search Location : 0 mile
                      </h5>
                    ) : (
                      <h5 style={{ margin: "30px 0px 0px 0px" }}>
                        From Search Location : {this.state.distanceShow} miles
                      </h5>
                    )}
                    {this.state.showMarker.WebSite ? (
                      <h4>
                        <a href={this.state.showMarker.WebSite} target="_blank">
                          <br></br>Website
                        </a>
                      </h4>
                    ) : null}
                  </div>
                ) : null
              ) : null}
            </InfoWindow>
          </Map>
        </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: CommonConfig.apiKey.geoCodeAPI,
})(MapVendor);
