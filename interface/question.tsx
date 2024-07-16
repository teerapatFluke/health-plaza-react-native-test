export interface Question {
  question: string;
  answer: Answer[];
  choose?: number;
  correct?: boolean;
}
export interface Answer {
  choiceText: string;
  isAnswer: boolean;
}
