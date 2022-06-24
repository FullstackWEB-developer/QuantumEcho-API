
const typeDefs = `
type Project{
    projectId:ID!
    projectName:String
    coordinator:Operator
    sessions:[Session]
}
input ProjectInput{
    projectName:String
    coordinator:OperatorInput
    sessions:[SessionInput]
}

input ProjectSessionInput {
  sessionId:String
  operatorId:[String]
}

type Query {
  projectCount : Int!
  projects:[Project]
  project(_id: ID!): Project
}

type Mutation {

  postProject(input: ProjectInput, sessions:ProjectSessionInput): Message!
  
  updateProject(
    _id:ID!
    input:ProjectInput
  ):Project

  deleteProject(_id:ID!):Message!
}

`

export default typeDefs;