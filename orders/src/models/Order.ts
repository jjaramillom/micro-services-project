import { Schema, model, Model } from 'mongoose';
import { OrderStatus } from '@jjaramillom-tickets/common';

import Ticket, { ITicket } from './Ticket';

export interface IOrder {
  id: string;
  status: OrderStatus;
  userId: string;
  ticket: ITicket;
  expiresAt: Date;
}

type OrderModel = Model<IOrder, {}>;

const schema = new Schema<IOrder, OrderModel>(
  {
    status: { type: String, required: true, enum: Object.values(OrderStatus) },
    userId: { type: String, required: true },
    ticket: { type: Schema.Types.ObjectId, ref: Ticket, required: true },
    expiresAt: { type: Date, required: true },
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

export default model<IOrder, OrderModel>('Order ', schema);
