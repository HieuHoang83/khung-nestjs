import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<Company>;

//timestamp de tao creatat updateat
//
@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  logo: string;

  @Prop({ type: Object })
  createBy: {
    _id: string;
    email: string;
  };
  @Prop()
  createAt: Date;

  @Prop({ type: Object })
  Updateby: {
    _id: string;
    email: string;
  };
  @Prop()
  UpdateAt: Date;
}
export const Companyschema = SchemaFactory.createForClass(Company);
