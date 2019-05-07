module.exports = queryObj => {
  let quer = "SELECT * FROM allSpots";
  let options = [];
  for (let key in queryObj) {
    if (queryObj[key] === "") {
      continue;
    }
    options.push([key, queryObj[key]]);
  }
  if (options.length === 1) {
    quer += ` WHERE ${options[0][0]}='${options[0][1]}'`;
  } else if (options.length === 2) {
    quer += ` WHERE ${options[0][0]}='${options[0][1]}' AND ${options[1][0]}='${
      options[1][1]
    }'`;
  }
  return quer;
};
