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

const Signup = () => {
  const supabase = supabaseClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    const response = await supabase.auth.signUp({
      email: email,
      password: password,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950 text-white shadow-2xl shadow-black/50">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/10 ring-1 ring-violet-500/20">
            <div className="h-5 w-5 rounded-md bg-violet-500" />
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Create an account
          </CardTitle>

          <CardDescription className="text-zinc-400">
            Sign up to get started with your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-zinc-200"
              >
                Email
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                value={email}
                className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:border-violet-500 focus-visible:ring-violet-500/20"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-zinc-200"
              >
                Password
              </Label>

              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                value={password}
                className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:border-violet-500 focus-visible:ring-violet-500/20"
              />
            </div>

            {/* Signup */}
            <Button
              onClick={signUp}
              size="lg"
              className="w-full bg-violet-600 font-semibold text-white transition-colors hover:bg-violet-500"
            >
              Sign up
            </Button>

            <p className="text-center text-sm text-zinc-500">
              By signing up, you agree to our terms and privacy policy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
