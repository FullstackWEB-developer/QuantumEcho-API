
const deepmerge = require('deepmerge')
const operatorResolver = require('./graphql/resolver/operatorResolver')
const customerResolver = require('./graphql/resolver/customerResolver')
const userResolver = require('./graphql/resolver/userResolver')
const subscriptionResolver = require('./graphql/resolver/subscriptionResolver')
const adminResolver = require('./graphql/resolver/adminResolver')
const dailysurveyResolver = require('./graphql/resolver/dailysurveyResolver')
const projectResolver = require('./graphql/resolver/projectResolver')
const protocolResolver = require('./graphql/resolver/protocolResolver')
const sessionResolver = require('./graphql/resolver/sessionResolver')
const treatmentResolver = require('./graphql/resolver/treatmentResolver')
const transactionResolver = require('./graphql/resolver/transactionResolver')

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
])

module.exports = resolvers