
import deepmerge from 'deepmerge';
import operatorResolver from './resolver/operatorResolver';
import customerResolver from './resolver/customerResolver';
import userResolver from './resolver/userResolver';
import subscribResolver from './resolver/subscribResolver';
import adminResolver from './resolver/adminResolver';
import dailysurveyResolver from './resolver/dailysurveyResolver';
import projectResolver from './resolver/projectResolver';
import protocolResolver from './resolver/protocolResolver';
import sessionResolver from './resolver/sessionResolver';
import treatmentResolver from './resolver/treatmentResolver';
import transactionResolver from './resolver/transactionResolver';
import uploadResolver from './resolver/uploadResolver';

const resolvers = deepmerge.all([
    operatorResolver,
    customerResolver,
    userResolver,
    subscribResolver,
    adminResolver,
    dailysurveyResolver,
    projectResolver,
    protocolResolver,
    sessionResolver,
    treatmentResolver,
    transactionResolver,
    uploadResolver,
]);

export default resolvers;