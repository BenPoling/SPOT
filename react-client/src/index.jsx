import React from "react";
import ReactDOM from "react-dom";
import Photo from "./components/Photo.jsx";
import Form from "./components/PostForm.jsx";

window.desc = {};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: null,
      typeFilter: "",
      cityFilter: "",
      view: "photos"
    };
    this.filterOnChange = this.filterOnChange.bind(this);
    this.updateDesc = this.updateDesc.bind(this);
    this.randomSpot = this.randomSpot.bind(this);
    this.postViewChange = this.postViewChange.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  postViewChange() {
    const { view } = this.state;
    if (view === "photos") {
      this.setState({
        view: "post"
      });
    } else {
      this.setState({
        view: "photos"
      });
      this.getAll();
    }
  }

  componentDidMount() {
    this.getAll();
  }

  getAll() {
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
    const { photos, typeFilter, cityFilter, view } = this.state;
    if (view === "photos") {
      return (
        <div className="mainDiv" id="resetForm">
          <h1>SPOT!</h1>
          <div>
            <div className="randomButtonDiv">
              <button onClick={this.postViewChange}>Post A Spot</button>
              <button onClick={this.randomSpot} className="randomSpotButton">
                GET RANDOM SPOT
              </button>
            </div>
            <div className="filterDiv">
              Type:
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
          </div>
          <Photo photo={photos} updateDesc={this.updateDesc} />
        </div>
      );
    } else {
      return (
        <div>
          <Form view={this.postViewChange} />
        </div>
      );
    }
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
