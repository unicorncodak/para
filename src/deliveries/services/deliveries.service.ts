import DeliveriesDao from '../daos/deliveries.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { CreateDeliveryDto } from '../dto/create.delivery.dto';
import { PutDeliveryDto } from '../dto/put.delivery.dto';
import { PatchDeliveryDto } from '../dto/patch.delivery.dto';

class DeliveriesService implements CRUD {
    public async create(resource: CreateDeliveryDto) {
        return DeliveriesDao.addDelivery(resource);
    }

    public async deleteById(id: string) {
        return DeliveriesDao.removeDeliveryById(id);
    }

    public async list(limit: number, page: number) {
        return DeliveriesDao.getDeliveries();
    }

    public async patchById(id: string, resource: PatchDeliveryDto) {
        return DeliveriesDao.updateDeliveryById(id, resource);
    }

    async readById(id: string) {
        return DeliveriesDao.getDeliveryById(id);
    }

    public async putById(id: string, resource: PutDeliveryDto) {
        return DeliveriesDao.updateDeliveryById(id, resource);
    }
}

export default new DeliveriesService();