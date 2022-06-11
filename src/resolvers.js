
import deepmerge from 'deepmerge';
import operatorResolver from './graphql/resolver/operatorResolver.js';
import customerResolver from './graphql/resolver/customerResolver.js';
import userResolver from './graphql/resolver/userResolver.js';
import subscriptionResolver from './graphql/resolver/subscriptionResolver.js';
import adminResolver from './graphql/resolver/adminResolver.js';
import dailysurveyResolver from './graphql/resolver/dailysurveyResolver.js';
import projectResolver from './graphql/resolver/projectResolver.js';
import protocolResolver from './graphql/resolver/protocolResolver.js';
import sessionResolver from './graphql/resolver/sessionResolver.js';
import treatmentResolver from './graphql/resolver/treatmentResolver.js';
import transactionResolver from './graphql/resolver/transactionResolver.js';
import singleUploadResolver from './graphql/resolver/singleUploadResolver.js';

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
// module.exports = resolvers