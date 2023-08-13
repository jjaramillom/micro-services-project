import { Schema, model, Document, Model } from 'mongoose';
import { hash, genSalt, compare } from 'bcrypt';

const SALT_WORK_FACTOR = 10;

export interface IUser {
  id: string;
  email: string;
  password: string;
}

interface IUserMethods {
  isPasswordValid: (this: IUser, receivedPassword: string) => Promise<boolean>;
}

export type UserModel = Model<IUser, {}, IUserMethods>;

const schema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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

schema.pre('save', async function (this: IUser & Document): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!this.isModified('password')) {
      resolve();
    }

    genSalt(SALT_WORK_FACTOR, (error, salt) => {
      if (error) {
        reject(error);
      }

      hash(this.password, salt, (error, hash) => {
        if (error) {
          reject(error);
        }

        this.password = hash;
        resolve();
      });
    });
  });
});

schema.methods.isPasswordValid = async function (receivedPassword) {
  return new Promise((resolve, reject) => {
    compare(receivedPassword, this.password, (error, isMatch) => {
      if (error) {
        return reject(error);
      }
      resolve(isMatch);
    });
  });
};

export default model<IUser, UserModel>('User', schema);
