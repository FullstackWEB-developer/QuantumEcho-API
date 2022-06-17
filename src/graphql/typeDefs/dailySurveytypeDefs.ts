
const typeDefs = `
type DailySurvey {
    _id:ID!
    dateOfSurvey:String
    questions:Questions
}
input DailySurveyInput {
    dateOfSurvey:String
    questions:QuestionsInput
}
enum QuestionOption {
    q_1
    q_2
    q_3
    q_4
    q_5
    q_6  
    q_7
    q_8
    q_9
    q_10
}
type Questions {
    question1:QuestionOption
    question2:QuestionOption
    question3:QuestionOption
}

input QuestionsInput {
    question1:QuestionOption
    question2:QuestionOption
    question3:QuestionOption
}

type Query {
    daliySurveyCount : Int!
    daliySurveys:[DailySurvey]
    daliySurvey(_id: ID!): DailySurvey
}

type Mutation {

    postDailySurvey(input: DailySurveyInput): Message
    
    updateDailySurvey(
        _id:ID!
        input:DailySurveyInput
    ):DailySurvey
  
    deleteDailySurvey(_id:ID!):Message!

}
`

export default typeDefs;