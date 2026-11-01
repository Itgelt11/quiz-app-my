"use client";

import { supabaseClient } from "@/app/lib/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@base-ui/react";
import { isEmptyHTMLPrelude } from "next/dist/server/app-render/postponed-state";

const Page = () => {
  const params = useParams();
  const supabase = supabaseClient();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [point, setPoint] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const getQuiz = async () => {
      const response = await supabase
        .from("quiz_questions")
        .select("*, quiz_answers(*)")
        .eq("quizId", params.quizId);

      setQuestions(response.data);
    };

    getQuiz();
  }, []);

  const quizId = params.quizId;

  const handleAnswer = (questionId, answerId) => {
    setAnswers({ ...answers, [questionId]: answerId });
  };

  const submit = async () => {
    let totalPoint = 0;
    let myScore = 0;
    for (let i = 0; i < questions.length; i++) {
      totalPoint = totalPoint + questions[i].point;
      const correctAnswer = questions[i].quiz_answers.find((answer) => {
        return answer.isCorrect;
      });
      if (answers[correctAnswer.questionId] === correctAnswer.id) {
        myScore = myScore + questions[i].point;
      }
    }
    setResult({ totalPoint, myScore });

    const { data } = await supabase
      .from("quiz_attempts")
      .insert({
        quizId: quizId,
        totalScore: totalPoint,
        score: myScore,
      })
      .select("*");

    const attemptId = data[0].id;

    for (let i = 0; i < questions.length; i++) {
      const correctAnswer = questions[i].quiz_answers.find((answer) => {
        return answer.isCorrect;
      });

      await supabase.from("quiz_attempts_answers").insert({
        attemptId: attemptId,
        answerId: answers[questions[i].id],
        isCorrect: correctAnswer.id === answers[questions[i].id],
      });
    }
  };

  const getBorderStyle = ({ isCorrect, isSelected }) => {
    if (result && isCorrect) return "border-green-500";
    if (result && isSelected) return "border-red-500";
    if (isSelected) return "border-blue-500";
  };

  useEffect(() => {
    const getScore = async () => {
      const response = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("quizId", quizId);
      console.log(response);

      let i = response.data.length;

      setPoint(response.data[i - 1].totalScore);
      setScore(response.data[i - 1].score);
    };
    getScore();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge
              variant="outline"
              className="mb-3 border-violet-500/30 bg-violet-500/10 text-violet-400"
            >
              Quiz Questions
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Questions & Answers
            </h1>

            <p className="mt-2 text-sm text-zinc-500 sm:text-base">
              Review the questions and answer choices for this quiz.
            </p>
          </div>

          <Badge
            variant="secondary"
            className="w-fit bg-zinc-900 px-4 py-2 text-zinc-400"
          >
            {questions.length}{" "}
            {questions.length === 1 ? "Question" : "Questions"}
          </Badge>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, index) => {
            return (
              <Card
                key={question.id}
                className="group overflow-hidden border-zinc-800 bg-zinc-900/60 text-white shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/40 hover:bg-zinc-900 hover:shadow-violet-950/20"
              >
                <CardHeader className="border-b border-zinc-800/80 pb-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Question number */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-sm font-semibold text-violet-400">
                        {index + 1}
                      </div>

                      <div>
                        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
                          Question {index + 1}
                        </p>

                        <CardTitle className="text-lg font-semibold leading-7 text-white sm:text-xl">
                          {question.question}
                        </CardTitle>
                      </div>
                    </div>

                    {/* Points */}
                    <Badge
                      variant="outline"
                      className="shrink-0 border-violet-500/20 bg-violet-500/10 text-violet-400"
                    >
                      {question.point} pts
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />

                    <span className="text-sm font-medium text-zinc-400">
                      Answer choices
                    </span>
                  </div>

                  <div className="grid gap-3">
                    {question?.quiz_answers?.map((answer, answerIndex) => {
                      return (
                        <div
                          key={answer.id}
                          onClick={() => handleAnswer(question.id, answer.id)}
                          className={`group/answer flex items-center gap-3 rounded-xl border bg-zinc-950/50 p-4 transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/[0.04] ${getBorderStyle(
                            {
                              isCorrect: answer.isCorrect,
                              isSelected: answers[question.id] === answer.id,
                            },
                          )}`}
                        >
                          {/* Answer letter */}
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-sm font-medium text-zinc-500 transition-colors group-hover/answer:border-violet-500/20 group-hover/answer:bg-violet-500/10 group-hover/answer:text-violet-400">
                            {String.fromCharCode(65 + answerIndex)}
                          </div>

                          {/* Answer */}
                          <span className="text-sm font-medium text-zinc-300 transition-colors group-hover/answer:text-white">
                            {answer.answers}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty state */}
        {questions.length === 0 && (
          <Card className="border-dashed border-zinc-800 bg-zinc-900/30">
            <CardContent className="flex min-h-[300px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
                <svg
                  className="h-6 w-6 text-violet-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 6.75h7.5M8.25 10.5h7.5M8.25 14.25h4.5M6 3.75h12A1.5 1.5 0 0119.5 5.25v13.5A1.5 1.5 0 0118 20.25H6a1.5 1.5 0 01-1.5-1.5V5.25A1.5 1.5 0 016 3.75z"
                  />
                </svg>
              </div>

              <h2 className="text-lg font-semibold text-white">
                No questions found
              </h2>

              <p className="mt-2 max-w-sm text-sm text-zinc-500">
                Questions for this quiz will appear here once they are created.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Submit */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={submit}
            className="rounded-xl bg-violet-600 px-6 py-2.5 font-semibold text-white shadow-lg shadow-violet-950/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-500 hover:shadow-xl hover:shadow-violet-900/30 active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            Submit
          </Button>
        </div>

        {/* Current result */}
        {result && (
          <Card className="mt-6 overflow-hidden border-violet-500/20 bg-zinc-900/60 text-white shadow-lg shadow-black/20">
            <CardHeader className="border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M12 3.75l2.25 1.5 2.75-.25 1.25 2.5 2.25 1.5-.75 2.75.75 2.75-2.25 1.5-1.25 2.5-2.75-.25L12 20.25l-2.25-1.5-2.75.25-1.25-2.5-2.25-1.5.75-2.75-.75-2.75 2.25-1.5 1.25-2.5 2.75.25L12 3.75Z"
                    />
                  </svg>
                </div>

                <div>
                  <CardTitle className="text-lg font-semibold">
                    Quiz Result
                  </CardTitle>
                  <p className="mt-1 text-sm text-zinc-500">
                    Your result for this attempt
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-4 pt-5 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                <p className="text-sm font-medium text-zinc-500">
                  Total Points
                </p>
                <p className="mt-2 text-2xl font-bold text-violet-400">
                  {result.totalPoint}
                </p>
              </div>

              <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.05] p-4">
                <p className="text-sm font-medium text-zinc-500">Your Score</p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {result.myScore}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Last attempt */}
        <Card className="mt-6 overflow-hidden border-zinc-800 bg-zinc-900/60 text-white shadow-lg shadow-black/20 transition-colors hover:border-violet-500/30">
          <CardHeader className="border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l2.5 2.5M20.25 12a8.25 8.25 0 1 1-2.42-5.83M20.25 4.5v4.75H15.5"
                  />
                </svg>
              </div>

              <div>
                <CardTitle className="text-lg font-semibold">
                  Last Attempt
                </CardTitle>
                <p className="mt-1 text-sm text-zinc-500">
                  Your previous quiz performance
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-4 pt-5 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 transition-colors hover:border-violet-500/30">
              <p className="text-sm font-medium text-zinc-500">
                Previous Score
              </p>
              <p className="mt-2 text-2xl font-bold text-white">{score}</p>
            </div>

            <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.05] p-4 transition-colors hover:bg-violet-500/[0.08]">
              <p className="text-sm font-medium text-zinc-500">
                Previous Points
              </p>
              <p className="mt-2 text-2xl font-bold text-violet-400">{point}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Page;
