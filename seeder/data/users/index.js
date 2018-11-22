const models = require('../../../models');
const { MARITAL_STATUS, SEX } = require('../../../models/user/constants');
const { data: cities } = require('../cities');
const { data: citizenships } = require('../citizenships');

const users = {};

users['andrew_calyatka'] = {
  id: '02dcc07f-3ce3-44b6-a477-32ca88df577e',
  firstName: 'Andrew',
  lastName: 'Calyatka',
  patronymic: 'Vyacheslavovich',
  sex: SEX.MALE,
  birthDate: new Date('December 31, 1997'),
  birthPlace: 'Borovochka',
  address: 'vulica Karla Libnekhta',
  passportSeries: 'MP',
  passportNumber: '9231437',
  issuedBy: 'Borovskiy Voenkomat',
  issueDate: new Date('July 1, 2012'),
  identificationNumber: '832194654832123',
  homePhone: '472312',
  mobilePhone: '+375298430123',
  email: 'baby_tape@gmail.com',
  job: 'iTransition',
  jobPosition: 'Software Developer',
  maritalStatus: MARITAL_STATUS.SINGLE,
  pensioner: true,
  salary: 100,
  liableForMilitaryService: true,
  cityId: cities['Vitebsk'].id,
  citizenshipId: citizenships['Ukraine'].id
};

users['uladzislau_kirichenka'] = {
  id: '18f6ca40-630c-41a9-ac61-f5e78b9abe82',
  firstName: 'Uladzislau',
  lastName: 'Kirichenka',
  patronymic: 'Maratovich',
  sex: SEX.MALE,
  birthDate: new Date('January 1, 1998'),
  birthPlace: 'Minsk',
  address: 'stanciya metro Spartiunaya',
  passportSeries: 'MP',
  passportNumber: '8912365',
  issuedBy: 'Oktyabrskiy ROVD',
  issueDate: new Date('July 1, 2012'),
  identificationNumber: '2312741923741248',
  homePhone: '871255',
  mobilePhone: '+375296739944',
  email: 'orange@gmail.com',
  job: 'iTechArt',
  jobPosition: 'Software Developer',
  maritalStatus: MARITAL_STATUS.MARRIED,
  pensioner: false,
  salary: 10000,
  liableForMilitaryService: false,
  cityId: cities['Minsk'].id,
  citizenshipId: citizenships['Ukraine'].id
};


module.exports = {
  data: users,
  model: models.User
};