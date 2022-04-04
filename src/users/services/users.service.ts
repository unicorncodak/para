import UsersDao from '../daos/users.dao';
import DeliveriesDao from '../../deliveries/daos/deliveries.dao'
import { CRUD } from '../../common/interfaces/crud.interface';
import { CreateUserDto } from '../dto/create.user.dto';
import { PutUserDto } from '../dto/put.user.dto';
import { PatchUserDto } from '../dto/patch.user.dto';

class UsersService implements CRUD {
    public async create(resource: CreateUserDto) {
        return UsersDao.addUser(resource);
    }

    public async deleteById(id: string) {
        return UsersDao.removeUserById(id);
    }

    public async list(limit: number, page: number) {
        return UsersDao.getUsers();
    }

    public async patchById(id: string, resource: PatchUserDto) {
        return UsersDao.updateUserById(id, resource);
    }

    async readById(id: string) {
        return UsersDao.getUserById(id);
    }

    async getDeliveriesByDriverId(id: string) {
        return DeliveriesDao.getDeliveriesByDriver(id);
    }

    public async putById(id: string, resource: PutUserDto) {
        return UsersDao.updateUserById(id, resource);
    }

    async getUserByEmail(email: string) {
        return UsersDao.getUserByEmail(email);
    }

    async getDriverDeliverySummary(driverId: string) {
        return DeliveriesDao.getDeliverySummary(driverId);
    }

    async getUserByEmailWithPassword(email: string) {
        return UsersDao.getUserByEmailWithPassword(email);
    }
}

export default new UsersService();