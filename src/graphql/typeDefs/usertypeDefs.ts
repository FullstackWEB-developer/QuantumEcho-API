
const typeDefs = `
type User {
    _id:ID!
    username:String!    
    email:String!
    password:String!
    role:[String]!
    accessToken:String
    status:String
}
input UserInput{
    username:String  
    email:String
    password:String
    role:[String]
    accessToken:String
    status:String
}

type Query {
    userCount : Int!
    users:[User]
    user(username: String!): User
}

type Mutation {

    postUser(input: UserInput): Message
    
    updateUser(
        username:String!
        input:UserInput
    ):Operator
  
    deleteUser(username:String!):Message!

}
`

export default typeDefs;