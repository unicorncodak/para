import mongooseService from '../../common/services/mongoose.service';
import debug from 'debug';
import { CreateDeliveryDto } from '../dto/create.delivery.dto';
import { PatchDeliveryDto } from '../dto/patch.delivery.dto';
import { PutDeliveryDto } from '../dto/put.delivery.dto';

const log: debug.IDebugger = debug('app:deliveries-dao');

class DeliveriesDao {
    Schema = mongooseService.getMongoose().Schema;

    deliverySchema = new this.Schema({
      driver_id: { type: this.Schema.Types.ObjectId, required: true, ref : "User"},
      order_accept_time: { type: Date, default: Date.now},
      customer_id: { type: String, required: true },
      business_name: { type: String, required: true },
      base_pay: { type: Number, required: true },
      order_subtotal: { type: Number, required: true },
      driver_tip: { type: Number, required: true },
      pick_up_time: { type: Date, required: true },
      drop_off_time: { type: Date, required: true },
    }, { timestamps: true });

    Delivery = mongooseService.getMongoose().model('Delivery', this.deliverySchema);

    constructor() {
        log('Created new instance of DeliveriesDao');
    }

    public async addDelivery(deliveryFields: CreateDeliveryDto): Promise<CreateDeliveryDto> {
        const delivery = new this.Delivery({
            ...deliveryFields
        });
        const newDelivery: CreateDeliveryDto = await delivery.save();
        return newDelivery;
    }

    public async getDeliveriesByDriver(driverId: string) {
        return this.Delivery.find({driver_id: driverId }).exec();
    }

    public async getDeliveries() {
      return this.Delivery.find().populate('User').exec();
    }

    public async removeDeliveryById(deliveryId: string) {
        return this.Delivery.deleteOne({ _id: deliveryId }).exec();
    }

    public async getDeliveryById(deliveryId: string) {
        return this.Delivery.findOne({ _id: deliveryId }).exec();
    }

    public async getDeliverySummary(driverId: string) {
      const mongoose = mongooseService.getMongoose()
      return this.Delivery.aggregate([
        // First total per day. Rounding dates with math here
        {
          '$match': {
            'driver_id': new mongoose.Types.ObjectId(driverId)
          }
        },
        { 
          "$group": {
            "_id": {
                "$add": [
                    { "$subtract": [
                        { "$subtract": [ "$createdAt", new Date(0) ] },
                        { "$mod": [
                            { "$subtract": [ "$createdAt", new Date(0) ] },
                            1000 * 60 * 60 * 24
                        ]},
                                                
                    ]},
                    new Date(0),
                ]
                
            },
            "week": { "$first": { "$week": "$createdAt" } },
            "month": { "$first": { "$month": "$createdAt" } },
            "total_earnings": { "$sum": "$base_pay" }
        }},
    
        // Then group by week
        { "$group": {
            "_id": "$week",
            "month": { "$first": "$month" },
            "days": {
                "$push": {
                    "day": "$_id",
                    "total_earnings": "$total_earnings"
                }
            },
            "total_earnings": { "$sum": "$total_earnings" }
        }},
    
        // Then group by month
        { "$group": {
            "_id": "$month",
            "weeks": {
                "$push": {
                    "week": "$_id",
                    "total_earnings": "$total_earnings",
                    "days": "$days"
                }
            },
            "total_earnings": { "$sum": "$total_earnings" }
        }}
    ])
    }

    public async updateDeliveryById(
        deliveryId: string,
        deliveryFields: PatchDeliveryDto | PutDeliveryDto
    ) {
        const existingDelivery = await this.Delivery.findOneAndUpdate(
            { _id: deliveryId },
            { $set: deliveryFields },
            { new: true }
        ).exec();

        return existingDelivery;
    }
}

export default new DeliveriesDao();