import React from "react";
import ReactDOM from "react-dom";
import Photo from "./components/Photo.jsx";

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
  }

  componentDidMount() {
    fetch("/get")
      .then(data => data.json())
      .then(photo => {
        console.log(photo);
        this.setState({
          photos: photo
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
        fetch(`/filter/?city=${cityFilter}&type=${typeFilter}`, {
          method: "GET"
        })
          .then(filterData => filterData.json())
          .then(filterResult => {
            this.setState({
              photos: filterResult
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
    fetch("/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify(updateObj)
    });
  }

  formSubmit(e) {
    e.preventDefault();
    const body = new FormData(this.formRef);
    getOrientation(body.get("photo"), or => {
      const orientation = or;
      body.append("orientation", orientation);
      let options = {
        method: "POST",
        body
      };
      fetch("/upload", options).then(() => {
        this.setState({
          description: "",
          address: "",
          city: "Phoenix",
          photo: "",
          type: "HandRail"
        });
      });
    });
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
        <Photo photo={photos} updateDesc={this.updateDesc} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));

function getOrientation(file, callback) {
  var reader = new FileReader();
  reader.onload = function(e) {
    var view = new DataView(e.target.result);
    if (view.getUint16(0, false) != 0xffd8) {
      return callback(-2);
    }
    var length = view.byteLength,
      offset = 2;
    while (offset < length) {
      if (view.getUint16(offset + 2, false) <= 8) return callback(-1);
      var marker = view.getUint16(offset, false);
      offset += 2;
      if (marker == 0xffe1) {
        if (view.getUint32((offset += 2), false) != 0x45786966) {
          return callback(-1);
        }

        var little = view.getUint16((offset += 6), false) == 0x4949;
        offset += view.getUint32(offset + 4, little);
        var tags = view.getUint16(offset, little);
        offset += 2;
        for (var i = 0; i < tags; i++) {
          if (view.getUint16(offset + i * 12, little) == 0x0112) {
            return callback(view.getUint16(offset + i * 12 + 8, little));
          }
        }
      } else if ((marker & 0xff00) != 0xff00) {
        break;
      } else {
        offset += view.getUint16(offset, false);
      }
    }
    return callback(-1);
  };
  reader.readAsArrayBuffer(file);
}
