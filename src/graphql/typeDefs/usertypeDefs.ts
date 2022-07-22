

const typeDefs = `

type User {
    _id:ID!
    cognitoId:String
    email:String!
    password:String
    role:[String]!
    accessToken:String
    status:String
    lastAccess:String
    customer:[Customer]
    operator:[Operator]
}

input UserInput{
    email:String
    cognitoId:String
    password:String
    role:[String]
    accessToken:String
    status:String
}

type UserResult{
    lists:[User]
    totalCount:Int
    perCount:Int
  }

input UserSearchInput {
    role:[String]
    userName:String
    status:String
    lastAccess:String
}

type Query {
    userCount : Int!
    users(cognitoId:String, condition:UserSearchInput, pageNum:Int):UserResult
    user(email: String!): User
}

type Mutation {

    postUser(input: UserInput): Message
    
    updateUser(
        email:String!
        input:UserInput
        authCheck:Boolean
    ):Operator

    updateUserData(_id:String!, input:UserInput):Message

    updateUserWithCustomer(
        email:String!
        input:UserInput
    ):Customer

    upateUserWithAdmin(
        email:String!
        input:UserInput
    ):Admin
  
    deleteUser(email:String!):Message!

}
`

export default typeDefs;