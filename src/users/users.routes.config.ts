import { CommonRoutesConfig } from '../common/common.routes.config';
import UsersController from './controllers/users.controller';
import UsersMiddleware from './middleware/users.middleware';
import express from 'express';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import { body } from 'express-validator';

export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/users`)
            .get(UsersController.listUsers)
            .post(
                body('email').isEmail(),
                body('password')
                .isLength({ min: 5 })
                .withMessage('Must include password (5+ characters)'),
                body('firstName').isString(),
                body('lastName').isString(),
                body('role').isString(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                UsersMiddleware.validateSameEmailDoesntExist,
                UsersController.createUser
            );

        this.app.param(`userId`, UsersMiddleware.extractUserId);
        this.app.param(`driverId`, UsersMiddleware.extractUserId);
        this.app
            .route(`/users/:userId`)
            .all(UsersMiddleware.validateUserExists)
            .get(UsersController.getUserById)
            .delete(UsersController.removeUser);
        
        this.app
            .route(`/driver/:driverId/delivery`)
            .all(UsersMiddleware.validateDriverExists)
            .get(UsersController.getDeliveriesByDriverId)

        this.app.put(`/users/:userId`, [
            body('email').isEmail(),
            body('password')
              .isLength({ min: 5 })
              .withMessage('Must include password (5+ characters)'),
            body('firstName').isString(),
            body('lastName').isString(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            UsersMiddleware.validateSameEmailBelongToSameUser,
            UsersController.put,
        ]);

        this.app.patch(`/driver/:driverId`, [
            body('active').isBoolean().optional(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            UsersMiddleware.validatePatchDriverId,
            UsersController.patch,
        ]);

        return this.app;
    }
}