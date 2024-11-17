import CryptoJS from 'crypto-js'

/**
 * 对字符串进行 MD5 加密
 * @param {string} str - 要加密的字符串
 * @returns {string} MD5 加密后的字符串
 */
export const md5 = str => CryptoJS.MD5(str).toString(CryptoJS.enc.Hex)
