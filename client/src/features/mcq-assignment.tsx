import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Send,
} from "lucide-react";
import type { MCQQuestion } from "./video-upload-with-assignment";
import { RadioGroup, RadioGroupItem } from "@/components/ui/CustomRadioGroup";

interface MCQAssignmentProps {
  questions: MCQQuestion[];
  onComplete: (results: AssignmentResults) => void;
  onBack: () => void;
}

interface Answer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
}

interface AssignmentResults {
  answers: Answer[];
  score: number;
  totalQuestions: number;
  completedAt: Date;
}

export default function MCQAssignment({
  questions,
  onComplete,
  onBack,
}: MCQAssignmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<AssignmentResults | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnsweredCurrent = answers[currentQuestion?.QuestionId] !== undefined;

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const assignmentAnswers: Answer[] = questions.map((question) => ({
      questionId: question.QuestionId,
      selectedOption: answers[question.QuestionId] ?? -1,
      isCorrect: answers[question.QuestionId] === question.correctAnswer,
    }));

    const score = assignmentAnswers.filter((answer) => answer.isCorrect).length;

    const assignmentResults: AssignmentResults = {
      answers: assignmentAnswers,
      score,
      totalQuestions: questions.length,
      completedAt: new Date(),
    };

    setResults(assignmentResults);
    setShowResults(true);
  };

  const handleComplete = () => {
    if (results) {
      onComplete(results);
    }
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (showResults && results) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Assignment Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div
                className={`text-4xl font-bold ${getScoreColor(
                  results.score,
                  results.totalQuestions
                )}`}
              >
                {results.score}/{results.totalQuestions}
              </div>
              <p className="text-muted-foreground mt-2">
                {((results.score / results.totalQuestions) * 100).toFixed(1)}%
                Score
              </p>
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => {
                const answer = results.answers.find(
                  (a) => a.questionId === question.QuestionId
                );
                const isCorrect = answer?.isCorrect ?? false;
                const selectedOption = answer?.selectedOption ?? -1;

                return (
                  <Card
                    key={question.QuestionId}
                    className="border-l-4 border-l-muted"
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">
                            {index + 1}. {question.question}
                          </h4>
                          <div className="space-y-1 text-sm">
                            {question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className={`p-2 rounded ${
                                  optionIndex === question.correctAnswer
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : optionIndex === selectedOption &&
                                      !isCorrect
                                    ? "bg-red-50 text-red-700 border border-red-200"
                                    : "bg-muted/50"
                                }`}
                              >
                                {option}
                                {optionIndex === question.correctAnswer && (
                                  <span className="ml-2 text-xs font-medium">
                                    ✓ Correct
                                  </span>
                                )}
                                {optionIndex === selectedOption &&
                                  !isCorrect && (
                                    <span className="ml-2 text-xs font-medium">
                                      ✗ Your answer
                                    </span>
                                  )}
                              </div>
                            ))}
                          </div>
                          {question.explanation && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                              <strong>Explanation:</strong>{" "}
                              {question.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Upload
            </Button>
            <Button onClick={handleComplete}>Complete Assignment</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <Alert>
        <AlertDescription>
          No questions available for this assignment.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Question {currentQuestionIndex + 1} of {questions.length}
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <h3 className="text-lg font-medium leading-relaxed">
            {currentQuestion.question}
          </h3>

          <RadioGroup
            value={answers[currentQuestion.QuestionId]?.toString() || ""}
            onValueChange={(value) =>
              handleAnswerSelect(
                currentQuestion.QuestionId,
                Number.parseInt(value)
              )
            }
          >
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== questions.length}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Assignment
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!hasAnsweredCurrent}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <Button
                key={index}
                variant={
                  index === currentQuestionIndex
                    ? "default"
                    : answers[questions[index].QuestionId] !== undefined
                    ? "secondary"
                    : "outline"
                }
                size="sm"
                onClick={() => setCurrentQuestionIndex(index)}
                className="w-10 h-10"
              >
                {index + 1}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Click on any question number to navigate directly to it
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
