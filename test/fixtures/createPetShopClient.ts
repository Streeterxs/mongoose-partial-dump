import PetShopClient, {
    IPetShopClient,
    IPetShopClientDocument,
} from '../models/PetShopClientModel';

import { getOrCreateDogOwner } from './createDogOwner';
import { getOrCreatePetShop } from './createPetShop';

export const createPetShopClient = async (
    args: IPetShopClient = {}
): Promise<IPetShopClientDocument> => {
    const {
        petShop = (await getOrCreatePetShop())._id,
        dogOwner = (await getOrCreateDogOwner())._id,
        ...properties
    } = args;

    return await new PetShopClient({ petShop, dogOwner, ...properties }).save();
};

export const getOrCreatePetShopClient = async (): Promise<IPetShopClientDocument> => {
    const personFinded = await PetShopClient.findOne();

    if (!personFinded) {
        const newPetShopClient = await createPetShopClient();
        return newPetShopClient;
    }

    return personFinded;
};
