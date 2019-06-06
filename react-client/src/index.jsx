import React from "react";
import ReactDOM from "react-dom";
import Photo from "./components/Photo.jsx";
import Form from "./components/PostForm.jsx";
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
    let options = {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    };
    fetch(
      "http://ec2-54-191-206-34.us-west-2.compute.amazonaws.com/get",
      options
    )
      .then(data => {
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
          `http://ec2-54-191-206-34.us-west-2.compute.amazonaws.com/filter/?city=${cityFilter}&type=${typeFilter}`,
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
    const updateObj = {
      id: e.currentTarget.id,
      description: window.desc[e.currentTarget.id].innerText
    };
    fetch("http://ec2-54-191-206-34.us-west-2.compute.amazonaws.com/update", {
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
          // console.log(resp, "THIS IS THE RESPONSE");
          return resp.json();
        })
        .then(filteredPhotos => {
          console.log(filteredPhotos, "PHOTOS ON POST");
          this.setState({
            photos: filteredPhotos.reverse()
          });
        })
        .catch(err => console.log(err, "this is the error!"));
    });
  }

  randomSpot() {
    fetch("http://ec2-54-191-206-34.us-west-2.compute.amazonaws.com/random")
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
        <Form
          submit={this.formSubmit}
          address={address}
          formChange={this.formChange}
          city={city}
          description={description}
          type={type}
          photo={photo}
        />
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
