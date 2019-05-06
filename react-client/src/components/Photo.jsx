import React from "react";
import ExifOrientationImg from "react-exif-orientation-img";

const Photo = ({ photo }) => {
  if (photo !== null) {
    photo = photo.reverse();
    const photoArr = photo.map(curr => {
      return (
        <div id={curr.id} key={curr.id} className="photoContainer">
          <div className="photoDiv">
            <img src={curr.spot.photo} alt="skateSpot" />
          </div>
          <div className="descDiv">
            <p>Address: {curr.spot.address}</p>
            <p>City: {curr.city}</p>
            <p id={curr.id}>{curr.spot.description}</p>
          </div>
        </div>
      );
    });
    return <div className="photoArrayContainer">{photoArr}</div>;
  }
  return null;
};

export default Photo;
