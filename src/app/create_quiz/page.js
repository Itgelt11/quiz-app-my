"use client";

import { useState } from "react";
import { supabaseClient } from "../lib/supabase/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const CreateQuiz = () => {
  const supabase = supabaseClient();
  const [quiz, setQuiz] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      point: 1,
      answers: ["", "", "", ""],
      correctIndex: 0,
    },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        point: 1,
        answers: ["", "", "", ""],
        correctIndex: 0,
      },
    ]);
  };

  const updateQuestion = (qIndex, field, value) => {
    const updatedQuestion = questions.map((question, index) => {
      return index === qIndex ? { ...question, [field]: value } : question;
    });
    setQuestions(updatedQuestion);
  };

  const handleAnswer = (questionIndex, answerIndex, value) => {
    const result = questions.map((question, index) => {
      if (questionIndex === index) {
        return {
          ...question,
          answers: question.answers.map((answer, aIndex) => {
            if (answerIndex === aIndex) {
              return value;
            } else {
              return answer;
            }
          }),
        };
      } else {
        return question;
      }
    });
    setQuestions(result);
  };

  const createQuestion = async () => {
    const { data, error } = await supabase.from("quiz_questions").insert({
      question: questions,
    });
  };

  const createQuiz = async () => {
    const response = await supabase
      .from("quiz")
      .insert({
        quizName: quiz,
      })
      .select("*")
      .single();

    const quizId = response.data.id;

    for (let i = 0; i < questions.length; i++) {
      const response = await supabase
        .from("quiz_questions")
        .insert({
          quizId: quizId,
          question: questions[i].question,
          point: questions[i].point,
        })
        .select("*");

      const questionId = response.data[0].id;

      for (let j = 0; j < questions[i].answers.length; j++) {
        await supabase.from("quiz_answers").insert({
          questionId: questionId,
          answers: questions[i].answers[j],
          isCorrect: questions[i].correctIndex === j,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/10 ring-1 ring-violet-500/20">
            <div className="h-5 w-5 rounded-md bg-violet-500" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Create Quiz
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Build your quiz by adding questions, answers, and points.
          </p>
        </div>

        {/* Quiz Information */}
        <Card className="mb-6 border-zinc-800 bg-zinc-950 text-white shadow-2xl shadow-black/20">
          <CardHeader>
            <CardTitle className="text-white">Quiz Information</CardTitle>

            <CardDescription className="text-zinc-500">
              Enter a title for your quiz.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="quiz-title" className="text-zinc-200">
                Quiz Title
              </Label>

              <Input
                id="quiz-title"
                placeholder="Give a title..."
                onChange={(event) => {
                  setQuiz(event.target.value);
                }}
                value={quiz}
                className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-600 focus-visible:border-violet-500 focus-visible:ring-violet-500/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="space-y-5">
          {questions.map((question, index) => {
            return (
              <Card
                key={index}
                className="overflow-hidden border-zinc-800 bg-zinc-950 text-white shadow-2xl shadow-black/20"
              >
                {/* Question Header */}
                <CardHeader className="border-b border-zinc-800 bg-zinc-900/30">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg text-white">
                        Question {index + 1}
                      </CardTitle>

                      <CardDescription className="mt-1 text-zinc-500">
                        Add your question and answer choices.
                      </CardDescription>
                    </div>

                    <div className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-400">
                      {question.point}{" "}
                      {question.point === 1 ? "point" : "points"}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                  {/* Question + Points */}
                  <div className="grid gap-5 md:grid-cols-[1fr_140px]">
                    <div className="space-y-2">
                      <Label
                        htmlFor={`question-${index}`}
                        className="text-zinc-200"
                      >
                        Question
                      </Label>

                      <Input
                        id={`question-${index}`}
                        placeholder="Write your question..."
                        onChange={(event) =>
                          updateQuestion(index, "question", event.target.value)
                        }
                        value={question.question}
                        className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-600 focus-visible:border-violet-500 focus-visible:ring-violet-500/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor={`points-${index}`}
                        className="text-zinc-200"
                      >
                        Points
                      </Label>

                      <Input
                        id={`points-${index}`}
                        placeholder="1"
                        type="number"
                        min={1}
                        onChange={(event) =>
                          updateQuestion(
                            index,
                            "point",
                            Number(event.target.value),
                          )
                        }
                        value={question.point}
                        className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-600 focus-visible:border-violet-500 focus-visible:ring-violet-500/20"
                      />
                    </div>
                  </div>

                  <Separator className="bg-zinc-800" />

                  {/* Answers */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-zinc-200">Answer Choices</Label>

                      <p className="mt-1 text-xs text-zinc-500">
                        Check the box next to the correct answer.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {question.answers.map((answer, asnwerIndex) => {
                        return (
                          <div
                            key={asnwerIndex}
                            className="group flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 transition-colors hover:border-violet-500/30 hover:bg-zinc-900"
                          >
                            {/* Correct answer */}
                            <input
                              type="checkbox"
                              className="h-4 w-4 shrink-0 cursor-pointer accent-violet-500"
                              onChange={(event) =>
                                updateQuestion(
                                  index,
                                  "correctIndex",
                                  asnwerIndex,
                                )
                              }
                            />

                            {/* Answer letter */}
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-800 text-sm font-semibold text-zinc-400">
                              {String.fromCharCode(65 + asnwerIndex)}
                            </div>

                            {/* Answer input */}
                            <Input
                              className="border-0 bg-transparent text-white shadow-none placeholder:text-zinc-600 focus-visible:ring-0"
                              placeholder={`Answer ${asnwerIndex + 1}`}
                              onChange={(event) =>
                                handleAnswer(
                                  index,
                                  asnwerIndex,
                                  event.target.value,
                                )
                              }
                              value={answer}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add Question */}
        <Button
          variant="outline"
          className="mt-6 w-full border-dashed border-zinc-700 bg-transparent text-zinc-300 hover:border-violet-500/50 hover:bg-zinc-900 hover:text-white"
          onClick={addQuestion}
        >
          + Add Question
        </Button>

        {/* Create Quiz */}
        <div className="mt-6 flex justify-end">
          <Button
            size="lg"
            onClick={createQuiz}
            className="w-full bg-violet-600 font-semibold text-white hover:bg-violet-500 sm:w-auto"
          >
            Create Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
