
const typeDefs = `
type Project{
    _id:ID
    projectName:String
    coordinator:Operator
    sessions:[Session]
}

input ProjectInput{
    projectName:String
    coordinator:String
    sessions:[String]
}

type ProjectResult{
  lists:[Project]
  totalCount:Int
  perCount:Int
}

type Query {
  projectCount : Int!
  projects(condition:ProjectInput, pageNum:Int):ProjectResult
  project(_id: ID!): Project
}

type Mutation {

  postProject(input: ProjectInput): Project
  
  updateProject(
    _id:ID!
    input:ProjectInput
  ):Project

  deleteProject(_id:ID!):Message!
}

`

export default typeDefs;