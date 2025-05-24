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
import { CheckCircle, XCircle, Send, ArrowLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface MCQQuestion {
  _id: string;
  question: string;
  options: string[];
  answer: string;
}

interface MCQAssignmentProps {
  questions: MCQQuestion[];
  onComplete: (results: AssignmentResults) => void;
  onBack: () => void;
}

interface Answer {
  questionId: string;
  selectedOption: string;
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
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<AssignmentResults | null>(null);

  const handleAnswerSelect = (questionId: string, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = () => {
    // First check if all questions are answered
    if (Object.keys(answers).length !== questions.length) {
      // You can show an alert or toast message here
      alert("Please answer all questions before submitting");
      return;
    }

    const assignmentAnswers: Answer[] = questions.map((question) => ({
      questionId: question._id,
      selectedOption: answers[question._id] ?? "",
      isCorrect: answers[question._id] === question.answer,
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
                  (a) => a.questionId === question._id
                );
                const isCorrect = answer?.isCorrect ?? false;
                const selectedOption = answer?.selectedOption ?? "";

                return (
                  <Card
                    key={question._id}
                    className={`border-l-4 ${
                      isCorrect ? "border-l-green-500" : "border-l-red-500"
                    }`}
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
                                  option === question.answer
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : option === selectedOption && !isCorrect
                                    ? "bg-red-50 text-red-700 border border-red-200"
                                    : "bg-muted/50"
                                }`}
                              >
                                {option}
                                {option === question.answer && (
                                  <span className="ml-2 text-xs font-medium">
                                    ✓ Correct
                                  </span>
                                )}
                                {option === selectedOption && !isCorrect && (
                                  <span className="ml-2 text-xs font-medium">
                                    ✗ Your answer
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
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

  if (questions.length === 0) {
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
          <CardTitle className="text-center">
            MCQ Assignment ({questions.length} Questions)
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {questions.map((question, index) => (
            <div key={question._id} className="space-y-3">
              <h3 className="font-medium text-base">
                {index + 1}. {question.question}
              </h3>
              <RadioGroup
                value={answers[question._id] ?? ""}
                onValueChange={(value) =>
                  handleAnswerSelect(question._id, value)
                }
              >
                {question.options.map((option) => {
                  const optionId = `${question._id}-${option}`;
                  return (
                    <div
                      key={optionId}
                      className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <RadioGroupItem value={option} id={optionId} />
                      <Label
                        htmlFor={optionId}
                        className="cursor-pointer flex-1"
                      >
                        {option}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          ))}
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button onClick={handleSubmit}>
            <Send className="h-4 w-4 mr-2" />
            Submit Assignment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
