import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import MongooseDelete from 'mongoose-delete';
export type UserDocument = HydratedDocument<User>;

//timestamp de tao creatat updateat
//
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop()
  age: number;

  @Prop()
  address: string;

  @Prop()
  createAt: Date;

  @Prop()
  UpdateAt: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
