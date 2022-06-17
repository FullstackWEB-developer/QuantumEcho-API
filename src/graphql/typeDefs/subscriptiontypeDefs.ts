
const typeDefs = `
type Subscription{
    _id:ID!
    coverImage:String
    description:String
    typology:Typology
    status:Status
    roles:[String]
    features:Module
    monthlyPrice:Float
    termPeriod:String
    creator:String
}

input SubscriptionInput {
    coverImage:String
    description:String
    typology:Typology
    status:Status
    roles:[String]
    features:String
    monthlyPrice:Float
    termPeriod:String
    creator:String
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
    subscriptions(creator:String!):[Subscription]
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

export default typeDefs;