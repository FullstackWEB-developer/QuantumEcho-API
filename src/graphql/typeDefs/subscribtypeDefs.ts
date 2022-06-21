
const typeDefs = `

type Subscrib{
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

input SubscribInput {
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
    subscribCount : Int!
    subscribs(creator:String!):[Subscrib]
    subscrib(_id: ID!): Subscrib
}

type Mutation {

    postSubscrib(input: SubscribInput): Message
    
    updateSubscrib(
        _id:ID!
        input:SubscribInput
    ):Subscrib
  
    deleteSubscrib(_id:ID!):Message!

}
`

export default typeDefs;