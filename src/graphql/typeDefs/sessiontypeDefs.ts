
const typeDefs = `
type Session{
    _id:ID
    teamMembers:[Operator]
    sessionTitle:String
    sessionInfo:String
    interview:Interview
    sessionStartDate:String
    sessionEndDate:String
    conversionTable:String
    randomFactor:String
    causes:String
    effects:String
    selectedTreatments:[String]
    treatmentSurveys:[Treatment]
}

input SessionInput{
    _id:ID
    teamMembers:[OperatorInput]
    sessionTitle:String
    sessionInfo:String
    sessionStartDate:String
    sessionEndDate:String
    conversionTable:String
    randomFactor:String
    causes:String
    effects:String
    selectedTreatments:[String]
    treatmentSurveys:[TreatmentInput]
    interview:InterviewInput
}

type Interview {
    repeptorImages:[String]
    motherNameOrRelativeName:String
    fatherNameOrRelativeName:String
    symptoms:[String]
    goals:[String]
    additionalInfo:String
}

input InterviewInput {
    repeptorImages:[String]
    motherNameOrRelativeName:String
    fatherNameOrRelativeName:String
    symptoms:[String]
    goals:[String]
    additionalInfo:String
}

type SessionResult{
    lists:[Session]
    totalCount:Int
    perCount:Int
  }

type Query {
    sessionCount : Int!
    sessions(condition:SessionInput, pageNum:Int):SessionResult
    session(_id: ID!): Session
}

type Mutation {

    postSession(input: SessionInput): Session
    
    updateSession(
        _id:ID!
        input:SessionInput
    ):Session
  
    deleteSession(_id:ID!):Message!

}

`

export default typeDefs;