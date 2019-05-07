import React from "react";
import ReactDOM from "react-dom";
import Photo from "./components/Photo.jsx";
import getOrientation from "./utils/getOrientation.js";

window.desc = {};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      address: "",
      city: "Phoenix",
      photo: "",
      photos: null,
      type: "HandRail",
      typeFilter: "",
      cityFilter: ""
    };
    this.formChange = this.formChange.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
    this.filterOnChange = this.filterOnChange.bind(this);
    this.updateDesc = this.updateDesc.bind(this);
    this.randomSpot = this.randomSpot.bind(this);
  }

  componentDidMount() {
    fetch("http://ec2-54-201-22-186.us-west-2.compute.amazonaws.com/get")
      .then(data => {
        console.log(data);
        return data.json();
      })
      .then(photos => {
        this.setState({
          photos: photos.reverse()
        });
      });
  }

  formChange(e) {
    this.setState({
      [e.currentTarget.id]: e.currentTarget.value
    });
  }

  filterOnChange(e) {
    this.setState(
      {
        [e.currentTarget.id]: e.currentTarget.value
      },
      () => {
        const { cityFilter, typeFilter } = this.state;
        fetch(
          `http://ec2-54-201-22-186.us-west-2.compute.amazonaws.com/filter/?city=${cityFilter}&type=${typeFilter}`,
          {
            method: "GET"
          }
        )
          .then(filterData => filterData.json())
          .then(filterResult => {
            this.setState({
              photos: filterResult.reverse()
            });
          });
      }
    );
  }

  updateDesc(e) {
    console.log(window.desc[e.currentTarget.id].innerText);
    const updateObj = {
      id: e.currentTarget.id,
      description: window.desc[e.currentTarget.id].innerText
    };
    fetch("http://ec2-54-201-22-186.us-west-2.compute.amazonaws.com/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updateObj)
    });
  }

  formSubmit(e) {
    e.preventDefault();
    const { typeFilter, cityFilter } = this.state;
    const body = new FormData(this.formRef);
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
        "http://ec2-54-201-22-186.us-west-2.compute.amazonaws.com/upload",
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
          console.log(resp);
          return resp.json();
        })
        .then(filteredPhotos =>
          this.setState({
            photos: filteredPhotos.reverse()
          })
        )
        .catch(err => console.log(err));
    });
  }

  randomSpot() {
    fetch("http://ec2-54-201-22-186.us-west-2.compute.amazonaws.com/random")
      .then(data => data.json())
      .then(randomSpot =>
        this.setState({
          photos: randomSpot
        })
      )
      .catch(err => console.log(err));
  }

  render() {
    const {
      description,
      address,
      city,
      photo,
      type,
      photos,
      typeFilter,
      cityFilter
    } = this.state;
    return (
      <div className="mainDiv" id="resetForm">
        <h1>SPOT!</h1>
        <div className="formContainer">
          <div className="leftSkate" />
          <form
            className="inputForm"
            onSubmit={this.formSubmit}
            ref={ref => {
              this.formRef = ref;
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
                    this.uploadInput = ref;
                  }}
                />
              </div>
            </div>
            <input type="submit" value="Post!" className="submitButton" />
          </form>
          <div className="rightSkate" />
        </div>
        <div className="filterDiv">
          Filter By: Type:
          <select
            name="typeFilter"
            id="typeFilter"
            onChange={this.filterOnChange}
            value={typeFilter}
          >
            <option />
            <option>HandRail</option>
            <option>HandiCap</option>
            <option>Ledge</option>
            <option>Skatepark</option>
            <option>Other</option>
          </select>
          City:
          <select
            name="cityFilter"
            id="cityFilter"
            onChange={this.filterOnChange}
            value={cityFilter}
          >
            <option />
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
        <div className="randomButtonDiv">
          <button onClick={this.randomSpot} className="randomSpotButton">
            GET RANDOM SPOT
          </button>
        </div>
        <Photo photo={photos} updateDesc={this.updateDesc} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
