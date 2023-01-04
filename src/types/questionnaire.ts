export interface IQuestionnaireQuestion {
  id: number;
  question: string;
  type: "FILE";
}

export interface IQuestionnaireTemplateFile {
  id: number;
  questionnaire: number;
  name: string;
  created: string;
  updated: string;
}

export interface IQuestionnaireTemplate {
  id: number;
  rlc: number;
  name: string;
  notes: string;
  updated: string;
  created: string;
}

export interface IQuestionnaire {
  id: number;
  uuid: string;
  code: string;
  record: number;
  template: IQuestionnaireTemplate;
  answers: IQuestionnaireAnswer[];
  created: string;
  updated: string;
}

interface IQuestionnaireField {
  id: number;
  type: string;
  name: string;
  question: string;
}

export interface IQuestionnaireAnswer {
  id: number;
  data: string;
  field: IQuestionnaireField;
}
