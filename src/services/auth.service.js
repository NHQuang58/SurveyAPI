const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { JWT } = require('../models');

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * check password with hass
 */
const checkPassword = async (password, truePassword) => {
  return bcrypt.compare(password, truePassword);
};

/**
 * Login with username and password
 */
const loginUserNameAndPassword = async (username, password) => {
  const user = await userService.getUserByUsername(username);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect username');
  }
  const isPasswordCorrect = await checkPassword(password, user.passWord);
  if (!isPasswordCorrect) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};
/**
 * Logout with refresh token
 */
const logoutSQL = async (refreshToken) => {
  const refreshTokenDoc = await JWT.findOne({ where: { token: refreshToken, type: tokenTypes.REFRESH } });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.destroy();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};
/**
 * Refresh refresh token
 */
const refreshAuthSQL = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyTokenSQL(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserByPk(refreshTokenDoc.userID);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.destroy();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};
/**
 * Reset password
 */
const resetPasswordSQL = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyTokenSQL(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserByPk(resetPasswordTokenDoc.userID);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserByPk(user.userID, { passWord: newPassword });
    await JWT.destroy({ where: { userID: user.userID, type: tokenTypes.RESET_PASSWORD } });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};
/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};
/**
 * Verify email
 */
const verifyEmailSQL = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyTokenSQL(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserByPk(verifyEmailTokenDoc.userID);
    if (!user) {
      throw new Error();
    }
    await JWT.destroy({ where: { userID: user.userID, type: tokenTypes.VERIFY_EMAIL } });
    await userService.updateUserByPk(user.userID, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  loginUserNameAndPassword,
  logout,
  logoutSQL,
  refreshAuth,
  refreshAuthSQL,
  resetPassword,
  resetPasswordSQL,
  verifyEmail,
  verifyEmailSQL,
};
