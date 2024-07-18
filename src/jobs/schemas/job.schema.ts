import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<Job>;

//timestamp de tao creatat updateat
//
@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  skills: string[];

  @Prop({ type: Object, required: true })
  company: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    logo: string;
  };

  @Prop()
  location: string;

  @Prop()
  salary: number;

  @Prop()
  quantity: number;

  @Prop()
  lever: string;

  @Prop()
  description: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  isActive: boolean;

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
export const Jobschema = SchemaFactory.createForClass(Job);
