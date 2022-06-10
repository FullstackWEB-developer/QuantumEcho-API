const {gql} = require('apollo-server')

const typeDefs = gql`
type Subscription{
    _id:ID!
    coverImage:String
    description:String
    typology:Typology
    status:Status
    roles:Role
    features:Module
    monthlyPrice:Float
    termPeriod:String
    creator:Operator
}

input SubscriptionInput {
    coverImage:String
    description:String
    typology:Typology
    status:Status
    roles:Role
    features:ModuleInput
    monthlyPrice:Float
    termPeriod:String
    creator:OperatorInput
}

enum Typology {
    public
    custom
}  
enum Status {
    published
    unpublished
}
enum Role {
    general_manager
    project_manager
    wellness_operator
}

type Query {
    subscriptionCount : Int!
    subscriptions:[Subscription]
    subscription(_id: ID!): Subscription
}

type Mutation {

    postSubscription(input: SubscriptionInput): Message
    
    updateSubscription(
        _id:ID!
        input:SubscriptionInput
    ):Subscription
  
    deleteSubscription(_id:ID!):Message!

}
`

module.exports = typeDefs