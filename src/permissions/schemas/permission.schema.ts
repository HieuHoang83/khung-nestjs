import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<Permission>;

//timestamp de tao creatat updateat
//
@Schema({ timestamps: true })
export class Permission {
  @Prop()
  name: string;
  @Prop()
  apiPath: string;

  @Prop()
  method: string;

  @Prop()
  module: string;

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
export const Permissionschema = SchemaFactory.createForClass(Permission);
