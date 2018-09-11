module.exports = {
  firstName: {
    in: ['body'],
    isString: true,
    errorMessage: 'firstName is required for creation of a user.'
  },
  lastName: {
    in: ['body'],
    isString: true,
    errorMessage: 'lastName is required for creation of a user.'
  },
  patronymic: {
    in: ['body'],
    isString: true,
    errorMessage: 'patronymic is required for creation of a user.'
  },
  birthDate: {
    in: ['body'],
    isString: true,
    errorMessage: 'birthDate is required for creation of a user.'
  },
  sex: {
    in: ['body'],
    isString: true,
    errorMessage: 'sex is required for creation of a user.'
  },
  passportSeries: {
    in: ['body'],
    isString: true,
    errorMessage: 'passportSeries is required for creation of a user.'
  },
  passportNumber: {
    in: ['body'],
    isString: true,
    errorMessage: 'passportNumber is required for creation of a user.'
  },
  issuedBy: {
    in: ['body'],
    isString: true,
    errorMessage: 'issuedBy is required for creation of a user.'
  },
  issueDate: {
    in: ['body'],
    isString: true,
    errorMessage: 'issueDate is required for creation of a user.'
  },
  identificationNumber: {
    in: ['body'],
    isString: true,
    errorMessage: 'identificationNumber is required for creation of a user.'
  },
  maritalStatus: {
    in: ['body'],
    isString: true,
    errorMessage: 'maritalStatus is required for creation of a user.'
  },
  pensioner: {
    in: ['body'],
    isString: true,
    errorMessage: 'pensioner is required for creation of a user.'
  },
  liableForMilitaryService: {
    in: ['body'],
    isBoolean: true,
    errorMessage: 'liableForMilitaryService is required for creation of a user.'
  }
};