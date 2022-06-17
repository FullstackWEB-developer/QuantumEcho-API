
const typeDefs = `
type Session{
    sessionId:ID!
    teamMembers:[Operator]
    sessionTitle:String
    sessionInfo:String
    sessionStartDate:String
    sessionEndDate:String
    conversionTable:String
    randomFactor:String
    causes:String
    effects:String
    selectedTreatments:[String]
    treatmentSurveys:[Treatment]
    interview:Interview
}
input SessionInput{
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
    symptoms:String
    goals:String
    additionalInfo:String
}

input InterviewInput {
    repeptorImages:[String]
    motherNameOrRelativeName:String
    fatherNameOrRelativeName:String
    symptoms:String
    goals:String
    additionalInfo:String
}

type Query {
    sessionCount : Int!
    sessions:[Session]
    session(_id: ID!): Session
}

type Mutation {

    postSession(input: SessionInput): Message
    
    updateSession(
        _id:ID!
        input:SessionInput
    ):Subscription
  
    deleteSession(_id:ID!):Message!

}

`

export default typeDefs;