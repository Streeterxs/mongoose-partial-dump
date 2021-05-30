import { Model } from 'mongoose';

export const modelToSchema = (model: Model<any>) => model.prototype.schema;
