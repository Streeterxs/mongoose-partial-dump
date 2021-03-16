import {
    databaseTestModule
} from '../../../test/database/memoryDatabase';

const {
    connect,
    clearDatabase,
    closeDatabase
} = databaseTestModule();

beforeAll(() => connect());

afterEach(() => clearDatabase());

afterAll(() => closeDatabase());

it('test', () => {
    expect(true).toBeTruthy();
})