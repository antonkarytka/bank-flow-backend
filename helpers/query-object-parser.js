const parseQueryObject = objectString => {
  objectString = eval('(' + objectString + ')');
  return JSON.parse(JSON.stringify(objectString));
};

module.exports = parseQueryObject;