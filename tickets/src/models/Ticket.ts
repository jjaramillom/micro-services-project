import { Schema, model, Document, Model } from 'mongoose';

export interface ITicket {
  id: string;
  title: string;
  userId: string;
  price: number;
}

 type TicketModel = Model<ITicket, {}>;

const schema = new Schema<ITicket, TicketModel>(
  {
    title: { type: String, required: true },
    userId: { type: String, required: true },
    price: { type: Number, required: true },
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

export default model<ITicket, TicketModel>('Ticket', schema);
