import React from "react";

const Form = ({
  submit,
  address,
  formChange,
  city,
  description,
  type,
  photo
}) => {
  return (
    <div className="formContainer">
      <div className="leftSkate" />
      <form
        className="inputForm"
        onSubmit={submit}
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
          onChange={formChange}
        />
        <div className="citySelectDiv">
          City:
          <select name="city" id="city" onChange={formChange} value={city}>
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
          onChange={formChange}
        />
        <div className="typePhotoSelectDiv">
          <div className="typeSelectDiv">
            Type:
            <select name="type" id="type" onChange={formChange} value={type}>
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
              onChange={formChange}
              ref={ref => {
                window.desc["uploadInput"] = ref;
              }}
            />
          </div>
        </div>
        <input type="submit" value="Post!" className="submitButton" />
      </form>
      <div className="rightSkate" />
    </div>
  );
};

export default Form;
