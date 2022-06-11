const {gql} = require('apollo-server-express')

const typeDefs = gql`
type Admin {
    _id:ID!
    phoneNumber:String
    address:Address
    firstName:String
    lastName:String
    email:String
    subscriptions:[Subscription]
    subRole:String
}

input AdminInput {
    phoneNumber:String
    address:AddressInput
    firstName:String
    lastName:String
    email:String
    subscriptions:[SubscriptionInput]
    subRole:String
}

type Query {
    adminCount : Int!
    admins:[Admin]
    admin(_id: ID!): Admin
}

type Mutation {

    postAdmin(input: AdminInput): Message
    
    updateAdmin(
        _id:ID!
        input:AdminInput
    ):Admin
  
    deleteAdmin(_id:ID!):Message!

}
`

module.exports = typeDefs