// Credits: https://github.com/manishsaraan/email-validator/blob/master/index.js
//
// Thanks to:
// http://fightingforalostcause.net/misc/2006/compare-email-regex.php
// http://thedailywtf.com/Articles/Validating_Email_Addresses.aspx
// http://stackoverflow.com/questions/201323/what-is-the-best-regular-expression-for-validating-email-addresses/201378#201378
// https://en.wikipedia.org/wiki/Email_address  The format of an email address is local-part@domain, where the 
// local part may be up to 64 octets long and the domain may have a maximum of 255 octets.[4]
//

const regex = /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

/**
 * Validate that a string is an email.
 * @param {String} value (required): The value to validate
 * @param {Object} rule (required): Object containing the requirements for the value to be valid.
 * @param {String} [rule.type]: the expected type of the value.
 * @returns {Boolean}
 */
module.exports = function emailValidator(value, rule) {
  if(!rule.type || rule.type !== "email") {
    return true; // if the "email" rule has not been defined for this value, bypass this validator
  }

  if(!value || typeof value !== "string") {
    return false;
  }
  
  const emailParts = value.split("@");
  
  if(emailParts.length !== 2) {
    return false;
  }
  
  const [account, address] = emailParts;
  
  if(account.length > 64 || address.length > 255) {
    return false;
  }
  
  const domainParts = address.split(".");
    
  if(domainParts.some(part => part.length > 63)) {
    return false;
  }
  
  return regex.test(value);
};