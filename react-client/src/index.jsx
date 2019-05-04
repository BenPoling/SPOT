import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import Form from "./components/Form.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      address: "",
      city: "Phoenix",
      photo: null
    };
    this.formChange = this.formChange.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
  }

  componentDidMount() {
    // $.ajax({
    //   url: "/items",
    //   success: data => {
    //     this.setState({
    //       items: data
    //     });
    //   },
    //   error: err => {
    //     console.log("err", err);
    //   }
    // });
  }

  formChange(e) {
    this.setState({
      [e.currentTarget.id]: e.currentTarget.value
    });
  }

  formSubmit(e) {
    e.preventDefault();
    const { description, address, city } = this.state;
    let data = {
      description,
      address,
      city,
      photo: this.uploadInput.files[0]
    };
    const body = new FormData(this.formRef);
    let options = {
      method: "POST",
      body
    };
    // options.body = new FormData();
    // for (let key in data) {
    //   options.body.append(key, data[key]);
    // }
    fetch("/upload", options);
  }

  render() {
    return (
      <div className="formDIV">
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
            onChange={this.formChange}
          />
          Description:
          <input
            type="text"
            name="description"
            id="description"
            onChange={this.formChange}
          />
          City:
          <select name="city" id="city" onChange={this.formChange}>
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
          Photo:
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={this.formChange}
            ref={ref => {
              this.uploadInput = ref;
            }}
          />
          <input type="submit" value="submit" />
        </form>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
