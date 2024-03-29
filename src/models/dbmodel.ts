import { getModelForClass } from '@typegoose/typegoose';
import admin from './admin';
import customer from './customer';
import dailySurvey from './dailySurvey';
import evaluation from './evaluation';
import module from './module';
import operator from './operator';
import project from './project';
import protocol from './protocol';
import session from './session';
import subscrib from './subscrib';
import transaction from './transaction';
import treatment from './treatment';
import treatmentSurvey from './treatmentSurvey';
import moduleSelection from './moduleSelection';
import resonanceGroup from './resonanceGroup';
import resonanceSubGroup from './resonanceSubGroup';
import stripeHistory from './stripehistory'

export const AdminModel = getModelForClass(admin);
export const CustomerModel = getModelForClass(customer);
export const DailySurveyModel = getModelForClass(dailySurvey);
export const EvaluationModel = getModelForClass(evaluation);
export const ModuleModel = getModelForClass(module);
export const OperatorModel = getModelForClass(operator);
export const ProjectModel = getModelForClass(project);
export const ProtocolModel = getModelForClass(protocol);
export const SessionModel = getModelForClass(session);
export const SubscribModel = getModelForClass(subscrib);
export const TransactionModel = getModelForClass(transaction);
export const TreatmentModel = getModelForClass(treatment);
export const TreatmentSurveyModel = getModelForClass(treatmentSurvey);

export const ModuleSelectionModel = getModelForClass(moduleSelection);
export const ResonanceGroupModel = getModelForClass(resonanceGroup);
export const ResonanceSubGroupModel = getModelForClass(resonanceSubGroup);

export const StripeHistoryModel = getModelForClass(stripeHistory);