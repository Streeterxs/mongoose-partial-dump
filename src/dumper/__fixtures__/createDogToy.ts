import DogToy, { IDogToy } from './DogToyModel';

export const createDogToy = async (args?: IDogToy) => {
    const { name = 'mock-dogToy-name', ...properties } = args;

    await new DogToy({ name, ...properties }).save();
};

export const getOrCreateDogToy = async () => {
    const dogToyFinded = await DogToy.findOne();

    if (!dogToyFinded) {
        const newDogToy = await createDogToy();
        return newDogToy;
    }

    return dogToyFinded;
};
