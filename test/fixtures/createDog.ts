import Dog, { IDog } from '../models/DogModel';

export const createDog = async (args?: IDog) => {
    const { name = 'mock-dog-name', toys = [], ...properties } = args;

    await new Dog({ name, toys, ...properties }).save();
};

export const getOrCreateDog = async () => {
    const dogFinded = await Dog.findOne();

    if (!dogFinded) {
        const newDog = await createDog();
        return newDog;
    }

    return dogFinded;
};
