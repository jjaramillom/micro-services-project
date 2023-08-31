import { Schema, model, Model } from 'mongoose';
import Order from './Order';
import { OrderStatus } from '@jjaramillom-tickets/common';

export interface ITicket {
  id: string;
  price: number;
  title: string;
}

interface TicketMethods {
  isReserved(this: ITicket): Promise<boolean>;
}

type TicketModel = Model<ITicket, {}, TicketMethods>;

const schema = new Schema<ITicket, TicketModel, TicketMethods>(
  {
    price: { type: Number, required: true },
    title: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

schema.methods.isReserved = async function () {
  const order = await Order.findOne({
    ticket: this,
    status: { $nin: [OrderStatus.Cancelled] },
  });
  return !!order;
};

export default model<ITicket, TicketModel>('Ticket ', schema);
