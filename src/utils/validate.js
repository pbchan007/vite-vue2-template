
/**
 * @param {string} path
 * @returns {Boolean}
 */
 export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path);
  }
  
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  export function validUsername(str) {
    // const valid_map = ['admin', 'editor']
    // return valid_map.indexOf(str.trim()) >= 0
    return str.trim().length > 0;
  }
  
  /**
   * @param {string} url
   * @returns {Boolean}
   */
  
  export function validURL(url) {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return reg.test(url);
  }
  
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  export function validLowerCase(str) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
  }
  
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  export function validUpperCase(str) {
    const reg = /^[A-Z]+$/;
    return reg.test(str);
  }
  
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  export function validAlphabets(str) {
    const reg = /^[A-Za-z]+$/;
    return reg.test(str);
  }
  
  /**
   * @param {string} email
   * @returns {Boolean}
   */
  
  // eslint-disable-next-line no-useless-escape
  export const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  export function validEmail(email) {
    return emailReg.test(email);
  }
  
  /**
   * @param {string} mobile
   * @returns {Boolean}
   */
  
  export const mobileReg = /^1\d{10}$/;
  
  export function validMobile(mobile) {
    return mobileReg.test(mobile);
  }
  
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  export function isString(str) {
    if (typeof str === "string" || str instanceof String) {
      return true;
    }
    return false;
  }
  
  /**
   * @param {Array} arg
   * @returns {Boolean}
   */
  export function isArray(arg) {
    if (typeof Array.isArray === "undefined") {
      return Object.prototype.toString.call(arg) === "[object Array]";
    }
    return Array.isArray(arg);
  }
  
  /**
   * 金额校验  大于0
   */
  export const validateAmount = [
    {
      type: "string",
      pattern: /^[0-9]+\.{0,1}[0-9]{0,2}$/,
      message: "请输入至多两位小数的数值"
    }
  ];
  export const validateAmount6 = [
    {
      type: "string",
      pattern: /^[0-9]+\.{0,1}[0-9]{0,6}$/,
      message: "请输入至多六位小数的数值"
    }
  ];
  
  const checkNumberRanges = (rule, value, callback) => {
    if (value < 0 || value > 100) {
      callback(new Error("请输入0 - 100% 范围内数字"));
    } else {
      callback();
    }
  };
  
  /**
   * 比率校验 0 -100%
   */
  export const validateRate = [
    ...validateAmount,
    { validator: checkNumberRanges, trigger: "blur" }
  ];
  
  export const validateRate6 = [
    ...validateAmount6,
    { validator: checkNumberRanges, trigger: "blur" }
  ];
  