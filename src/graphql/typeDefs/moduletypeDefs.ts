const typeDefs = `

type Module{
    _id:String
    moduleName:String
}

input ModuleInput{
    moduleName:String
}

type SessionModuleType {
    _id: String
    moduleName: String
    moduleValue: Int
    resonancevalue: Int
    description: String
    picture: String
    resonanceGroups:[ResonanceGroupType]
}

input SessionModuleInput {
    _id: String
    moduleName: String
    moduleValue: Int
    resonancevalue: Int
    description: String
    picture: String
    resonanceGroups: [String]
}

type ResonanceGroupType {
    _id: String
    moduleName: String
    moduleValue: Int
    resonancevalue: Int
    description: String
    picture: String
    resonanceSubGroups:[ResonanceSubGroupType]
}

input ResonanceGroupInput {
    _id: String
    moduleName: String
    moduleValue: Int
    resonancevalue: Int
    description: String
    picture: String
    resonanceSubGroups:[String]
}

type ResonanceSubGroupType {
    _id: String
    moduleName: String
    moduleValue: Int
    resonancevalue: Int
    description: String
    picture: String
}

input ResonanceSubGroupInput {
    _id: String
    moduleName: String
    moduleValue: Int
    resonancevalue: Int
    description: String
    picture: String
}

type Query {
    modules:[Module]
    modulesOfSession:[SessionModuleType]

    postEvalationFakeData:Message
}

type Mutation {
    postModule(input: ModuleInput): Module   
}
`

export default typeDefs;