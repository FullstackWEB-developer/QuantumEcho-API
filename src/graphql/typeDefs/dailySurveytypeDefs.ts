const typeDefs = `
type DailySurvey {
    _id:ID
    dateOfSurvey:String
    questions:Questions
    surveyTime:String
    surveyType:String
}

input DailySurveyInput {
    _id:String
    dateOfSurvey:String
    questions:QuestionsInput
    surveyTime:String
    surveyType:SurveyType
}

type Questions {
    question1:Int
    question2:Int
    question3:Int
}

input QuestionsInput {
    question1:Int
    question2:Int
    question3:Int
}

enum SurveyType {
    Morning
    Evening
}

type DailySurveyFixData{
    dateOfSurvey:String
    morningData:DailySurvey
    eveningData:DailySurvey
}

type DailySurveyResult{
    lists:[DailySurveyFixData]
    totalCount:Int
    perCount:Int
}

type Query {
    dailySurveyCount : Int!
    dailySurveys(customerId: String, dateOfSurvey: String, surveyType: String, pageNum:Int):DailySurveyResult
    dailySurvey(condition: DailySurveyInput): DailySurvey
}

type Mutation {

    postDailySurvey(input: DailySurveyInput, customerId:String!): Message
    
    updateDailySurvey(
        _id:ID!
        input:DailySurveyInput
    ):DailySurvey
  
    deleteDailySurvey(_id:ID!):Message!

}
` 



export default typeDefs;
