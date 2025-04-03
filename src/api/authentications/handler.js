import autoBind from 'auto-bind';

import { successResponse } from '../../utils/responseFormatter.js';

class AuthenticationHandler {
  constructor(authenticationService, usersService, tokenManager, validator) {
    this._authenticationService = authenticationService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }

  async registerUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const { username, password, fullname } = request.payload;
    const id = await this._usersService.addUser({ username, password, fullname });
    return successResponse(h, {
      status: 'success',
      data: { userId: id },
      message: 'User berhasil ditambahkan',
      code: 201,
    });
  }

  async postLoginUserHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload);
    const { username, password } = request.payload;
    const userId = await this._authenticationService.verifyUserCredential(username, password);

    const accessToken = this._tokenManager.generateAccessToken({ id: userId });
    const refreshToken = this._tokenManager.generateRefreshToken({ id: userId });

    await this._authenticationService.addRefreshToken(refreshToken, userId);

    return successResponse(h, {
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
      message: 'Authentication berhasil ditambahkan',
      code: 201,
    });
  }

  async putAcessTokenHandler(request, h) {
    this._validator.validatePutAuthenticationPayload(request.payload);
    const { refreshToken } = request.payload;

    await this._authenticationService.verifyRefreshToken(refreshToken);
    const userId = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({ id: userId });
    return successResponse(h, {
      status: 'success',
      data: { accessToken },
      message: 'Access token berhasil diperbarui',
    });
  }

  async deleteAuthenticationHandler(request, h) {
    this._validator.validateDeleteAuthenticationPayload(request.payload);
    const { refreshToken } = request.payload;
    await this._authenticationService.verifyRefreshToken(refreshToken);
    await this._authenticationService.deleteRefreshToken(refreshToken);

    return successResponse(h, {
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    });
  }
}

export default AuthenticationHandler;
