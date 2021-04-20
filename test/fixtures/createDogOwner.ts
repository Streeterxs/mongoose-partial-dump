import DogOwner, {
    IDogOwner,
    IDogOwnerDocument,
} from '../models/DogOwnerModel';

import { getOrCreateDog } from './createDog';
import { getOrCreatePerson } from './createPerson';

export const createDogOwner = async (
    args: IDogOwner = {}
): Promise<IDogOwnerDocument> => {
    const {
        dog = (await getOrCreateDog())._id,
        person = (await getOrCreatePerson())._id,
        ...properties
    } = args;

    return await new DogOwner({ dog, person, ...properties }).save();
};

export const getOrCreateDogOwner = async (): Promise<IDogOwnerDocument> => {
    const dogFinded = await DogOwner.findOne();

    if (!dogFinded) {
        const newDogOwner = await createDogOwner();
        return newDogOwner;
    }

    return dogFinded;
};
