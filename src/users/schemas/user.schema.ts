import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from 'src/roles/schemas/role.schema';
export type UserDocument = HydratedDocument<User>;

//timestamp de tao creatat updateat
//
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;
  @Prop()
  type: string;
  @Prop()
  password: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  address: string;

  @Prop({ type: Object })
  company: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Role.name })
  role: mongoose.Schema.Types.ObjectId;
  @Prop()
  refreshToken: string;

  @Prop({ type: Object })
  createBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop()
  createAt: Date;

  @Prop({ type: Object })
  Updateby: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop()
  UpdateAt: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
