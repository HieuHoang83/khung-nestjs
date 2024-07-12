import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import MongooseDelete from 'mongoose-delete';
export type companyDocument = HydratedDocument<company>;

//timestamp de tao creatat updateat
//
@Schema({ timestamps: true })
export class company {
  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop()
  description: string;

  @Prop()
  createAt: Date;

  @Prop()
  createBy: {
    _id: string;
    email: string;
  };

  @Prop()
  UpdateAt: Date;

  @Prop()
  Update: {
    _id: string;
    email: string;
  };

  @Prop()
  deleteBy: {
    _id: string;
    email: string;
  };
}
export const companySchema = SchemaFactory.createForClass(company);
