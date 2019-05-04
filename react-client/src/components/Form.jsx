import React from "react";

const Form = ({ formChange, formSubmit }) => {
  return (
    <div className="formDIV">
      <form className="inputForm">
        Address:
        <input type="text" id="address" onChange={formChange} />
        Description:
        <input type="text" id="description" onChange={formChange} />
        City:
        <select name="city" id="city" onChange={formChange}>
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
        <input type="file" id="photo" onChange={formChange} />
        <input type="submit" value="submit" onClick={formSubmit} />
      </form>
    </div>
  );
};

export default Form;
