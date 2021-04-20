import Dog, { IDog, IDogDocument } from '../models/DogModel';

export const createDog = async (
    args: IDog = {
        name: 'mock-dog-name',
        toys: [],
    }
): Promise<IDogDocument> => {
    const { name, toys, ...properties } = args;

    return await new Dog({ name, toys, ...properties }).save();
};

export const getOrCreateDog = async (): Promise<IDogDocument> => {
    const dogFinded = await Dog.findOne();

    if (!dogFinded) {
        const newDog = await createDog();
        return newDog;
    }

    return dogFinded;
};
