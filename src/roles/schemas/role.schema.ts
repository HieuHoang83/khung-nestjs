import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schema';
export type UserDocument = HydratedDocument<Role>;

//timestamp de tao creatat updateat
//
@Schema({ timestamps: true })
export class Role {
  @Prop()
  name: string;

  @Prop()
  discription: string;

  @Prop()
  isActive: boolean;

  //
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Permission.name })
  permissions: Permission[];

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
export const Roleschema = SchemaFactory.createForClass(Role);
