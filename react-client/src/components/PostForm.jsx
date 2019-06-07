import React, { Component } from "react";
import getOrientation from "../utils/getOrientation.js";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      address: "",
      city: "Phoenix",
      type: "HandRail",
      photo: ""
    };
    this.formSubmit = this.formSubmit.bind(this);
    this.formChange = this.formChange.bind(this);
  }

  formChange(e) {
    this.setState({
      [e.currentTarget.id]: e.currentTarget.value
    });
  }

  formSubmit(e) {
    e.preventDefault();
    const { typeFilter, cityFilter } = this.state;
    const body = new FormData(window.desc["formRef"]);
    getOrientation(body.get("photo"), or => {
      const orientation = or;
      body.append("orientation", orientation);
      body.append("cityFilter", cityFilter);
      body.append("typeFilter", typeFilter);
      let options = {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body
      };
      fetch(
        "http://ec2-54-191-206-34.us-west-2.compute.amazonaws.com/upload",
        options
      )
        .then(resp => {
          this.setState({
            description: "",
            address: "",
            city: "Phoenix",
            photo: "",
            type: "HandRail"
          });
          return resp.json();
        })
        .then(filteredPhotos => {
          this.props.view();
        })
        .catch(err => console.log(err, "this is the error!"));
    });
  }

  render() {
    const { address, description, city, type, photo } = this.state;
    return (
      <div className="formContainer">
        <div className="leftSkate" />
        <form
          className="inputForm"
          onSubmit={this.formSubmit}
          ref={ref => {
            window.desc["formRef"] = ref;
          }}
        >
          Address:
          <input
            type="text"
            name="address"
            id="address"
            value={address}
            onChange={this.formChange}
          />
          <div className="citySelectDiv">
            City:
            <select
              name="city"
              id="city"
              onChange={this.formChange}
              value={city}
            >
              <option>Phoenix</option>
              <option>Tempe</option>
              <option>Mesa</option>
              <option>Scottsdale</option>
              <option>Gilbert</option>
              <option>Chandler</option>
              <option>Queen Creek</option>
              <option>Apache Junction</option>
              <option>Glendale</option>
              <option>Peoria</option>
              <option>Surprise</option>
              <option>Goodyear</option>
            </select>
          </div>
          Description:
          <textarea
            type="text"
            name="description"
            id="description"
            value={description}
            onChange={this.formChange}
          />
          <div className="typePhotoSelectDiv">
            <div className="typeSelectDiv">
              Type:
              <select
                name="type"
                id="type"
                onChange={this.formChange}
                value={type}
              >
                <option>HandRail</option>
                <option>HandiCap</option>
                <option>Ledge</option>
                <option>Skatepark</option>
                <option>Cruise Spot</option>
                <option>Creative</option>
                <option>Other</option>
              </select>
            </div>
            <div className="photoFileDiv">
              Photo:
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                value={photo}
                onChange={this.formChange}
                ref={ref => {
                  window.desc["uploadInput"] = ref;
                }}
              />
            </div>
          </div>
          <input type="submit" value="Post!" className="submitButton" />
          <button onClick={this.props.view}>Go Back</button>
        </form>
        <div className="rightSkate" />
      </div>
    );
  }
}

export default Form;
