import express from 'express';
import usersService from '../services/users.service';
import argon2 from 'argon2';
import debug from 'debug';

const log: debug.IDebugger = debug('app:users-controller');
class UsersController {
    async listUsers(req: express.Request, res: express.Response) {
        const users = await usersService.list(100, 0);
        res.status(200).send(users);
    }

    async getUserById(req: express.Request, res: express.Response) {
        const user = await usersService.readById(req.body._id);
        res.status(200).json({data: user});
    }

    async getDeliveriesByDriverId(req: express.Request, res: express.Response) {
        if(req.query.summary && req.query.summary === '1'){
            const summary = await usersService.getDriverDeliverySummary(req.body._id)
            res.status(200).json({data: summary});
        } else {
            const deliveries = await usersService.getDeliveriesByDriverId(req.body._id);
            res.status(200).json({data: deliveries});
        }
    }

    async createUser(req: express.Request, res: express.Response) {
        try {
            req.body.password = await argon2.hash(req.body.password);
            const userId = await usersService.create(req.body);
            res.status(201).send({ id: userId });
        } catch (err) {
            res.status(201).send(err);
        }
    }

    async patch(req: express.Request, res: express.Response) {
        const user = await usersService.patchById(req.body._id, req.body)
        log(user);
        res.status(200).json({data: user});
    }

    async put(req: express.Request, res: express.Response) {
        const user = await usersService.putById(req.body._id, req.body)
        log(user);
        res.status(200).json({data: user});
    }

    async getDriverDeliverySummary(req: express.Request, res: express.Response) {
        const user = await usersService.getDriverDeliverySummary(req.body._id)
        log(user);
        res.status(200).json({data: user});
    }

    async removeUser(req: express.Request, res: express.Response) {
        log(await usersService.deleteById(req.body._id));
        res.status(200).send();
    }
}

export default new UsersController();