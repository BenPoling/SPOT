import React from "react";
import Img from "react-fix-image-orientation";

const Photo = ({ photo, updateDesc }) => {
  if (photo !== null) {
    photo = photo.reverse();
    const photoArr = photo.map(curr => {
      let thing = "none";
      if (curr.spot.orientation === "6") {
        thing = "rotate(90deg)";
      }
      return (
        <div id={curr.id} key={curr.id} className="photoContainer">
          <div className="photoDiv">
            <Img
              src={curr.spot.photo}
              alt="skateSpot"
              style={{ transform: `${thing}` }}
            />
          </div>
          <div className="descDiv">
            <p>Address: {curr.spot.address}</p>
            <p>City: {curr.city}</p>
            <p
              contentEditable="true"
              ref={ref => {
                window.desc[curr.id] = ref;
              }}
            >
              {curr.spot.description}
            </p>
            <button id={curr.id} onClick={updateDesc}>
              Update
            </button>
          </div>
        </div>
      );
    });
    return <div className="photoArrayContainer">{photoArr}</div>;
  }
  return null;
};

export default Photo;
