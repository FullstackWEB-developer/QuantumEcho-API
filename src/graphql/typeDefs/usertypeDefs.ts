
const typeDefs = `
type User {
    _id:ID!
    email:String!
    password:String!
    role:[String]!
    accessToken:String
    status:String
}
input UserInput{
    email:String
    password:String
    role:[String]
    accessToken:String
    status:String
}

type Query {
    userCount : Int!
    users:[User]
    user(email: String!): User
}

type Mutation {

    postUser(input: UserInput): Message
    
    updateUser(
        email:String!
        input:UserInput
    ):Operator
  
    deleteUser(email:String!):Message!

}
`

export default typeDefs;