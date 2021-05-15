import PetShop, { IPetShop, IPetShopDocument } from '../models/PetShopModel';

export const createPetShop = async (
   args: IPetShop = {
      name: 'mock-petShop-name',
      dogs: [],
   }
): Promise<IPetShopDocument> => {
   const { name, dogs, ...properties } = args;

   return await new PetShop({
      name,
      dogs,
      ...properties,
   }).save();
};

export const getOrCreatePetShop = async (): Promise<IPetShopDocument> => {
   const personFinded = await PetShop.findOne();

   if (!personFinded) {
      const newPetShop = await createPetShop();
      return newPetShop;
   }

   return personFinded;
};
