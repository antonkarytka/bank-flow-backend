const models = require('../../../models');

const citizenships = {};

citizenships['Belarus'] = {
  id: 'c0abea43-35c9-7c52-05ec-8f74e6674b0e',
  name: 'Belarus'
};

citizenships['Ukraine'] = {
  id: 'aaaa0044-60e0-4ee6-8357-ec5bf25c4c76',
  name: 'Ukraine'
};

citizenships['Russia'] = {
  id: '28affb2d-5dd1-50ed-69d0-6dfcda7b672f',
  name: 'Russia'
};

citizenships['Poland'] = {
  id: 'b3ee950f-60e0-4ee6-8357-ec5bf25c4c76',
  name: 'Poland'
};


module.exports = {
  data: citizenships,
  model: models.Citizenship
};