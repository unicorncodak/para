import mongooseService from '../../common/services/mongoose.service';
import debug from 'debug';
import { CreateUserDto } from '../dto/create.user.dto';
import { PatchUserDto } from '../dto/patch.user.dto';
import { PutUserDto } from '../dto/put.user.dto';

const log: debug.IDebugger = debug('app:users-dao');

class UsersDao {
    Schema = mongooseService.getMongoose().Schema;

    userSchema = new this.Schema({
        email: { type: String, required: true, unique: true},
        password: { type: String, select: false },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        role: { type: String, required: true, enum: ['customer', 'driver'] },
        active: { type: Boolean, default: true },
    }, { timestamps: true });

    User = mongooseService.getMongoose().model('Users', this.userSchema);

    constructor() {
        log('Created new instance of UsersDao');
    }

    public async addUser(userFields: CreateUserDto): Promise<CreateUserDto> {
        const user = new this.User({
            ...userFields
        });
        const newUser: CreateUserDto = await user.save();
        return newUser;
    }

    public async getUserByEmail(email: string) {
        return this.User.findOne({ email: email }).exec();
    }

    public async getUsers() {
        return this.User.find().exec();
    }

    public async getUserByEmailWithPassword(email: string) {
        return this.User.findOne({ email: email })
            .select('_id email +password')
            .exec();
    }

    public async removeUserById(userId: string) {
        return this.User.deleteOne({ _id: userId }).exec();
    }

    public async getUserById(userId: string) {
        return this.User.findOne({ _id: userId }).exec();
    }

    public async updateUserById(
        userId: string,
        userFields: PatchUserDto | PutUserDto
    ) {
        const existingUser = await this.User.findOneAndUpdate(
            { _id: userId },
            { $set: userFields },
            { new: true }
        ).exec();
        return existingUser;
    }
}

export default new UsersDao();