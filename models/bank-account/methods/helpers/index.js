const {
  BANK_CODE,
  BELARUSIAN_NATIONAL_BANK_WEIGHT_COEFFICIENTS
} = require('../../constants');


const splitByThreeCharacters = string => string.match(/.{1,3}/g);


const generateControlKey = ({ bankCode, individualAccountNumber, weightCoefficients }) => {
  const temporaryAccountNumber = splitByThreeCharacters(`${bankCode}${individualAccountNumber}0`);

  const lastDigitsSum = temporaryAccountNumber.reduce((sum, accountNumberPart, index) => {
    const multiplied = accountNumberPart * weightCoefficients[index];
    const lastMultipliedDigit = multiplied % 10;

    return sum + lastMultipliedDigit;
  }, 0);

  return (lastDigitsSum * 3) % 10;
};


/**
 * Information about generating an account number can be found here:
 * https://infobank.by/prosmotr-bankovskoj-novosti/itemid/9070/
 */
const generateBankAccountNumber = () => {
  const individualAccountNumber = Math.floor(Math.random() * 100000000);
  const controlKey = generateControlKey({
    bankCode: BANK_CODE,
    individualAccountNumber,
    weightCoefficients: BELARUSIAN_NATIONAL_BANK_WEIGHT_COEFFICIENTS
  });

  return `${BANK_CODE}${individualAccountNumber}${controlKey}`;
};


module.exports = {
  generateBankAccountNumber
};