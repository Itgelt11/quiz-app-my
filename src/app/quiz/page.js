"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "../lib/supabase/client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Page = () => {
  const supabase = supabaseClient();
  const [quiz, setQuiz] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getQuiz = async () => {
      const response = await supabase.from("quiz").select("*");
      setQuiz(response.data);
    };
    getQuiz();
  });

  const handleRedirect = (quizId) => {
    router.push(`/quiz/${quizId}`);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge
              variant="outline"
              className="mb-3 border-violet-500/30 bg-violet-500/10 text-violet-400"
            >
              Quiz Dashboard
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your Quizzes
            </h1>

            <p className="mt-2 text-sm text-zinc-500 sm:text-base">
              Select a quiz and start testing your knowledge.
            </p>
          </div>

          <Badge
            variant="secondary"
            className="w-fit bg-zinc-900 px-4 py-2 text-zinc-400"
          >
            {quiz.length} {quiz.length === 1 ? "Quiz" : "Quizzes"}
          </Badge>
        </div>

        {/* Quiz cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quiz.map((item) => {
            return (
              <Card
                key={item.id}
                className="group overflow-hidden border-zinc-800 bg-zinc-900/60 text-white shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-zinc-900 hover:shadow-violet-950/20"
                onClick={() => {
                  handleRedirect(item.id);
                }}
              >
                <CardHeader className="pb-4">
                  {/* Icon */}
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                    <svg
                      className="h-5 w-5 text-violet-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>

                  <CardTitle className="line-clamp-2 text-xl font-semibold">
                    {item.quizName}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3.75 9h16.5M5.25 5.25h13.5a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-12a1.5 1.5 0 011.5-1.5z"
                      />
                    </svg>

                    <span>
                      {new Date(item.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-zinc-800/80 pt-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-zinc-400 hover:bg-violet-500/10 hover:text-violet-400"
                  >
                    <span>Open quiz</span>

                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Empty state */}
        {quiz.length === 0 && (
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              <h2 className="text-lg font-semibold text-white">
                No quizzes found
              </h2>

              <p className="mt-2 max-w-sm text-sm text-zinc-500">
                Your quizzes will appear here once you create one.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default Page;
