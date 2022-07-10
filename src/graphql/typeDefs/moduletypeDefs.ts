const typeDefs = `
type Module{
    _id:String
    moduleName:String
}
input ModuleInput{
    moduleName:String
}
type Query {
    modules:[Module]
}
type Mutation {
    postModule(input: ModuleInput): Module

}
`

export default typeDefs;