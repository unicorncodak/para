import express from 'express';
import DeliveriesService from '../services/deliveries.service';
import debug from 'debug';
import mongoose from 'mongoose';

const log: debug.IDebugger = debug('app:users-controller');
class DeliveriesMiddleware {
  async extractDeliveryId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
      if(mongoose.Types.ObjectId.isValid(req.params.deliveryId)){
        req.body._id = req.params.deliveryId;
        next();
      } else {
        res.status(404).send({
            error: `Delivery ${req.params.deliveryId} not found`,
        });
      }
  }

  async castIdToMongoObjectId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
      if(mongoose.Types.ObjectId.isValid(req.body.driver_id) && mongoose.Types.ObjectId.isValid(req.body.customer_id)){
        next();
      } else {
        res.status(404).send({
            error: "All IDs must be casted to MongoDB Object Id",
        });
      }
  }

  async validateDeliveryExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
      const delivery = await DeliveriesService.readById(req.params.deliveryId);
      if (delivery) {
          next();
      } else {
          res.status(404).send({
              error: `User ${req.params.deliveryId} not found`,
          });
      }
  }

  async validateDateObject(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
      if(isNaN(Date.parse(req.body.pick_up_time)) || isNaN(Date.parse(req.body.drop_off_time)) ){
        res.status(400).send({
          error: "Bad request: Date must be valid",
        });
      } else {
        req.body.pick_up_time = new Date(req.body.pick_up_time)
        req.body.drop_off_time = new Date(req.body.drop_off_time)
        next();
      }
  }
}

export default new DeliveriesMiddleware();