const models = require('../../../models');

const cities = {};

cities['Brest'] = {
  id: 'f36562cb-b583-e545-c85d-7148b0c09a3a',
  name: 'Brest'
};

cities['Gomel'] = {
  id: '1d11215a-f034-7f19-04fa-fb025324de17',
  name: 'Gomel'
};

cities['Grodno'] = {
  id: 'b3950bb0-15a6-1caf-7410-a40e7277a4cc',
  name: 'Grodno'
};

cities['Minsk'] = {
  id: '0e39a2ff-663d-ba85-3bf5-9538896fa8ca',
  name: 'Minsk'
};

cities['Mogilev'] = {
  id: '32821260-7edd-c9da-92ce-a3c19ccd2d3d',
  name: 'Mogilev'
};

cities['Vitebsk'] = {
  id: 'b71ca31b-6a9d-c8a3-5664-ff60eda94f9b',
  name: 'Vitebsk'
};


module.exports = {
  data: cities,
  model: models.City
};