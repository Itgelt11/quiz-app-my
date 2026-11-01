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

const Login = () => {
  const supabase = supabaseClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logIn = async () => {
    const response = await supabase.auth.signInWithPassword({
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
            Welcome back
          </CardTitle>

          <CardDescription className="text-zinc-400">
            Enter your email and password to sign in.
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
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-zinc-200"
                >
                  Password
                </Label>
              </div>

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

            {/* Login */}
            <Button
              onClick={logIn}
              size="lg"
              className="w-full bg-violet-600 font-semibold text-white transition-colors hover:bg-violet-500"
            >
              Login
            </Button>

            {/* Signup */}
            <p className="text-center text-sm text-zinc-500">
              Don't have an account?{" "}
              <span className="cursor-pointer font-medium text-violet-400 transition-colors hover:text-violet-300 hover:underline">
                Sign up
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
