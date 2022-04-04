import express from 'express';
import DeliveriesService from '../services/deliveries.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:Deliveries-controller');
class DeliveriesController {
    async listDeliveries(req: express.Request, res: express.Response) {
        const deliveries = await DeliveriesService.list(100, 0);
        res.status(200).send(deliveries);
    }

    async getDeliveryById(req: express.Request, res: express.Response) {
        const delivery = await DeliveriesService.readById(req.body._id);
        res.status(200).json({data: delivery});
    }

    async createDelivery(req: express.Request, res: express.Response) {
        const deliveryId = await DeliveriesService.create(req.body);
        res.status(201).send({ id: deliveryId });
    }

    async patch(req: express.Request, res: express.Response) {
        log(await DeliveriesService.patchById(req.body._id, req.body));
        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        log(await DeliveriesService.putById(req.body._id, req.body));
        res.status(204).send();
    }

    async removeDelivery(req: express.Request, res: express.Response) {
        log(await DeliveriesService.deleteById(req.body._id));
        res.status(204).send();
    }
}

export default new DeliveriesController();