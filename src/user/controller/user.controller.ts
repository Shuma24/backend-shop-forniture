import { injected } from 'brandi';
import { RouteOptions } from 'fastify';
import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';

import { BaseController } from '../../common/abstract-class/base.controller';
import { userErrors } from '../../common/constants/Errors';
import { HttpResponseCode } from '../../common/constants/HttpResponseCode';
import { TOKENS } from '../../containers/Symbols';
import { IAuthHooks } from '../../hooks/interfaces/user-hook.interface';

import { ILoggerService } from '../../logger/logger.service.interface';
import { IUserController } from '../interfaces/user.controller.interface';
import { deleteUserResponseDTO } from '../dto/delete.dto';
import { ProfileResponseDto } from '../dto/profile-response.dto';
import { IUserService } from '../interfaces/user-service.interface';
import { updateResponseDTO, updateUserBodyDTO, updateUserDTO } from '../dto/update.user.dto';

export class UserController extends BaseController implements IUserController {
  constructor(
    private Logger: ILoggerService,
    private authHook: IAuthHooks,
    private readonly userService: IUserService,
  ) {
    super(Logger);

    this.bindRouts([
      <RouteOptions>{
        method: 'PUT',
        url: '/user/update',
        handler: this.updateCurrentUser.bind(this),
        preHandler: [authHook.authGuard.bind(this.authHook)],
        schema: {
          body: updateUserDTO,
          response: {
            200: updateResponseDTO,
          },
        },
      },

      <RouteOptions>{
        method: 'GET',
        url: '/user/profile',
        handler: this.userProfileInfo.bind(this),
        preHandler: [authHook.authGuard.bind(this.authHook)],
        schema: {
          response: {
            200: ProfileResponseDto,
          },
        },
      },

      <RouteOptions>{
        method: 'DELETE',
        url: '/user/delete',
        handler: this.deleteCurrentUser.bind(this),
        preHandler: [authHook.authGuard.bind(this.authHook)],
        schema: {
          response: {
            200: deleteUserResponseDTO,
          },
        },
      },
    ]);

    this.Logger.info('UserController is initialized.');
  }

  async updateCurrentUser(req: FastifyRequest<{ Body: updateUserBodyDTO }>, reply: FastifyReply) {
    try {
      if (!req.user) {
        return reply
          .code(HttpResponseCode.UNAUTHORIZED)
          .send({ status: false, error: userErrors.UNAUTHORIZED });
      }

      if (!req.body.name && !req.body.email && !req.body.password) {
        throw new Error(userErrors.ERROR_NO_PROPERTY_TO_UPDATE);
      }

      const updatedUser = await this.userService.updateCurrentUser(
        req.user,
        req.body.name,
        req.body.email,
        req.body.password,
      );

      if (!updatedUser) {
        return reply.code(HttpResponseCode.NOT_FOUND).send({
          status: false,
          error: userErrors.ERROR_WHILE_UPDATING_USER,
        });
      }

      return reply.code(HttpResponseCode.OK).send({ status: true, success: true });
    } catch (error) {
      if (error instanceof Error) {
        return reply
          .code(HttpResponseCode.INTERNAL_SERVER)
          .send({ status: false, error: error.message });
      }
    }
  }

  async deleteCurrentUser(req: FastifyRequest, reply: FastifyReply) {
    try {
      if (!req.user) {
        return reply
          .code(HttpResponseCode.UNAUTHORIZED)
          .send({ status: false, error: userErrors.UNAUTHORIZED });
      }

      const user = await this.userService.deleteCurrentUser(req.user);

      if (!user) {
        return reply
          .code(HttpResponseCode.NOT_FOUND)
          .send({ status: false, error: userErrors.ERROR_WHILE_DELETING_USER });
      }

      if (user) {
        reply.clearCookie('refreshToken').removeHeader('Authorization');
      }

      return reply.code(HttpResponseCode.OK).send({ status: true, success: true });
    } catch (error) {
      if (error instanceof Error) {
        return reply
          .code(HttpResponseCode.INTERNAL_SERVER)
          .send({ status: false, error: error.message });
      }
    }
  }

  async userProfileInfo(req: FastifyRequest, reply: FastifyReply) {
    try {
      if (!req.user) {
        return reply
          .send({ status: false, error: userErrors.UNAUTHORIZED })
          .code(HttpResponseCode.UNAUTHORIZED);
      }

      const user = await this.userService.profile(req.user);

      if (!user) {
        return reply
          .send({ status: false, error: userErrors.USER_NOT_FOUND })
          .code(HttpResponseCode.NOT_FOUND);
      }

      return reply.send({ status: true, data: user }).code(HttpResponseCode.OK);
    } catch (error) {
      if (error instanceof Error) {
        return reply
          .send({ status: false, error: error.message })
          .code(HttpResponseCode.INTERNAL_SERVER);
      }
    }
  }
}

injected(UserController, TOKENS.Logger, TOKENS.AuthHooks, TOKENS.UserService);
