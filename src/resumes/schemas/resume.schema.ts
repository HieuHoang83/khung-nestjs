import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Company } from 'src/companies/schemas/company.schema';
import { Job } from 'src/jobs/schemas/job.schema';
export type UserDocument = HydratedDocument<Resume>;

//timestamp de tao creatat updateat
//
@Schema({ timestamps: true })
export class Resume {
  @Prop()
  email: string;
  @Prop()
  userId: string;
  @Prop({ required: true })
  url: string;
  //tao dieu kien de join vs bang company khi can
  @Prop({ required: true ,type: mongoose.Schema.Types.ObjectId,ref:Company.name })
  companyId: mongoose.Schema.Types.ObjectId;
  @Prop({ required: true ,type: mongoose.Schema.Types.ObjectId,ref:Job.name })
  jobId: string;
  @Prop()
  status: string;
  @Prop({type:Array<Object>})
  history: {
    status: string;
    updateAt: Date;
    updateBy: {
      _id: mongoose.Schema.Types.ObjectId;
      email: string;
    };
  }[];

  @Prop({ type: Object })
  createBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop()
  createAt: Date;
  @Prop({ type: Object })
  updateBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop()
  UpdateAt: Date;
}
export const Resumeschema = SchemaFactory.createForClass(Resume);
