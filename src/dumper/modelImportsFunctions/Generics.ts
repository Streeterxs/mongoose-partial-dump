import { Model } from 'mongoose';

export const genericNewDocumentByModel = (ModelInputed: Model<any>) => {
  const newDocumentByList = async (documentList, company) => {
    for (const document of documentList) {
      await new ModelInputed({ ...document, company }).save();
    }
  };

  return newDocumentByList;
};

// TODO make this work
export const createNewDocument = async (
  payload: any,
  CustomModel: Model<any>,
) => {
  const newDocument = new CustomModel({ ...payload });
  await newDocument.save();
  newDocument.updatedAt = payload.updatedAt;
  await newDocument.save({ timestamps: false });
};
