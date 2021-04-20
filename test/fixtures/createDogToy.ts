import DogToy, { IDogToy, IDogToyDocument } from '../models/DogToyModel';

export const createDogToy = async (
    args: IDogToy = {
        name: 'mock-dogToy-name',
    }
): Promise<IDogToyDocument> => {
    const { name, ...properties } = args;

    return await new DogToy({ name, ...properties }).save();
};

export const getOrCreateDogToy = async (): Promise<IDogToyDocument> => {
    const dogToyFinded = await DogToy.findOne();

    if (!dogToyFinded) {
        const newDogToy = await createDogToy();
        return newDogToy;
    }

    return dogToyFinded;
};
