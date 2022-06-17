
import deepmerge from 'deepmerge';
import operatorResolver from './resolver/operatorResolver';
import customerResolver from './resolver/customerResolver';
import userResolver from './resolver/userResolver';
import subscriptionResolver from './resolver/subscriptionResolver';
import adminResolver from './resolver/adminResolver';
import dailysurveyResolver from './resolver/dailysurveyResolver';
import projectResolver from './resolver/projectResolver';
import protocolResolver from './resolver/protocolResolver';
import sessionResolver from './resolver/sessionResolver';
import treatmentResolver from './resolver/treatmentResolver';
import transactionResolver from './resolver/transactionResolver';
import singleUploadResolver from './resolver/singleUploadResolver';

const resolvers = deepmerge.all([
    operatorResolver,
    customerResolver,
    userResolver,
    subscriptionResolver,
    adminResolver,
    dailysurveyResolver,
    projectResolver,
    protocolResolver,
    sessionResolver,
    treatmentResolver,
    transactionResolver,
    singleUploadResolver,
]);

export default resolvers;