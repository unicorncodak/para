import { CommonRoutesConfig } from '../common/common.routes.config';
import DeliveriesController from './controllers/deliveries.controller';
import DeliveriesMiddleware from './middleware/delivery.middleware';
import express from 'express';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import { body } from 'express-validator';

export class DeliveriesRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'DeliveriesRoutes');
    }
    
    configureRoutes(): express.Application {
        this.app
            .route(`/deliveries`)
            .get(DeliveriesController.listDeliveries)
            .post(
                body('driver_id').isString(),
                body('customer_id').isString(),
                body('business_name').isString(),
                body('base_pay').isInt(),
                body('order_subtotal').isInt(),
                body('driver_tip').isInt(),
                body('pick_up_time').isString(),
                body('drop_off_time').isString(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                DeliveriesMiddleware.castIdToMongoObjectId,
                DeliveriesMiddleware.validateDateObject,
                DeliveriesController.createDelivery
            );

        this.app.param(`deliveryId`, DeliveriesMiddleware.extractDeliveryId);
        this.app
            .route(`/deliveries/:deliveryId`)
            .all(DeliveriesMiddleware.validateDeliveryExists)
            .get(DeliveriesController.getDeliveryById)
            .delete(DeliveriesController.removeDelivery);

        this.app.put(`/deliveries/:deliveryId`, [
            body('driver_id').isString(),
            body('order_accept_time').isDate(),
            body('customer_id').isString(),
            body('business_name').isString(),
            body('base_pay').isInt(),
            body('order_subtotal').isInt(),
            body('driver_tip').isInt(),
            body('pick_up_time').isDate(),
            body('drop_off_time').isDate(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            DeliveriesMiddleware.validateDeliveryExists,
            DeliveriesController.put,
        ]);

        this.app.patch(`/deliveries/:deliveryId`, [
            body('driver_id').isString().optional(),
            body('order_accept_time').isDate().optional(),
            body('customer_id').isString().optional(),
            body('business_name').isString().optional(),
            body('base_pay').isInt().optional(),
            body('order_subtotal').isInt().optional(),
            body('driver_tip').isInt().optional(),
            body('pick_up_time').isDate().optional(),
            body('drop_off_time').isDate().optional(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            DeliveriesMiddleware.validateDeliveryExists,
            DeliveriesController.patch,
        ]);

        return this.app;
    }
}