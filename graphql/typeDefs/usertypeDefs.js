const {gql} = require("apollo-server")

const typeDefs = gql`
type User {
    _id:ID!
    email:String!
    password:String!
}
input UserInput{
    email:String!
    password:String!
}

type Query {
    userCount : Int!
    users:[User]
    user(userId: ID!): User
}

type Mutation {

    postUser(input: UserInput): Message
    
    updateUser(
        userId:ID!
        input:UserInput
    ):User
  
    deleteUser(userId:ID!):Message!

}
`

module.exports = typeDefs