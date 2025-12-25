"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { MoreVertical, Flag, Share } from "lucide-react";
import { Progress } from "../ui/progress";
export default function SecondRow() {
  return (
    <>
      <Card className="w-full max-w-sm overflow-hidden bg-black text-white shadow-xl">
        <CardContent className="p-0">
          {/* Top label */}
          <div className="bg-gray-900 px-4 py-2">
            <p className="text-sm text-gray-400">Job Post</p>
          </div>

          {/* Main content - Google-like job card */}
          <div className="bg-white text-black p-5">
            <div className="flex gap-4">
              {/* Google logo placeholder */}
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                <span className="text-2xl font-bold text-red-500">G</span>
              </div>

              <div className="flex-1 space-y-1">
                <h3 className="font-medium text-gray-900">
                  Senior product designer
                </h3>
                <p className="text-sm text-gray-600">Google</p>
              </div>

              {/* Tag-like element on the right */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                <span className="text-xs text-gray-500">i</span>
              </div>
            </div>

            {/* Progress bar placeholder */}
            <div className="mt-6 h-2 w-full rounded-full bg-gray-200">
              <div className="h-full w-3/4 rounded-full bg-gray-300" />
            </div>

            {/* Small text below progress */}
            <p className="mt-2 text-xs text-gray-500">Applied 2 days ago</p>
          </div>

          {/* Bottom bar */}
          <div className="bg-gray-800 px-4 py-3">
            <p className="text-center text-sm text-gray-400">
              ← Tap to edit the widget
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full max-w-sm overflow-hidden shadow-lg">
        <CardContent className="p-6 space-y-6">
          {/* Header: Avatar + Name + Online Badge */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-12 w-12 ring-4 ring-purple-200">
                <AvatarImage src="" alt="Dorie" />
                <AvatarFallback>D</AvatarFallback>
              </Avatar>
              {/* Online indicator */}
              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold">Dorie</h3>
            </div>

            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-800"
            >
              EXPERT
            </Badge>
          </div>

          {/* Message Title / Preview */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold leading-tight">
              Try not just Wash business build
            </h2>

            {/* Blurred message preview lines */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-gray-200/70 blur-sm" />
              <div className="h-4 w-11/12 rounded bg-gray-200/70 blur-sm" />
              <div className="h-4 w-10/12 rounded bg-gray-200/70 blur-sm" />
              <div className="h-4 w-full rounded bg-gray-200/70 blur-sm" />
              <div className="h-4 w-9/12 rounded bg-gray-200/70 blur-sm" />
            </div>
          </div>

          {/* Footer: Messages Button + Unread Count */}
          <div className="flex items-center justify-between">
            <Button className="rounded-full bg-blue-600 hover:bg-blue-700 px-6">
              Messages
            </Button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold">
              3
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-md overflow-hidden shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Upload your CV</h2>
            <p className="text-sm text-muted-foreground">
              We will analyze your CV to provide tailored recommendations
            </p>
          </div>

          {/* Dashed upload area with file icon */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12">
            <div className="flex flex-col items-center gap-4">
              {/* Large blue file icon */}
              <div className="p-6 bg-blue-100 rounded-2xl">
                <FileText className="h-16 w-16 text-blue-600" />
              </div>

              {/* Upload instruction */}
              <p className="text-lg text-gray-700 font-medium">
                Drag & Drop your file
              </p>

              {/* Or browse button */}
              <Button
                variant="link"
                className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium"
              >
                or browse file
              </Button>
            </div>
          </div>

          {/* Optional: subtle upload icon at bottom (if needed) */}
          {/* <Upload className="mx-auto h-6 w-6 text-muted-foreground" /> */}
        </CardContent>
      </Card>

      <Card className="w-full max-w-md overflow-hidden shadow-lg">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Upcoming courses
            </h3>
            <Button variant="link" className="text-blue-600 p-0 h-auto">
              View all
            </Button>
          </div>

          {/* Course Item */}
          <div className="space-y-4">
            {/* Logo + Title + More */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* Figma logo placeholder (multicolor) */}
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center text-white font-bold text-xl">
                  F
                </div>

                <div>
                  <h4 className="text-xl font-bold">Figma Pro</h4>
                  <p className="text-sm text-muted-foreground">
                    Get hands-on experience learning...
                  </p>
                </div>
              </div>

              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={87} className="h-3">
                <div className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600" />
              </Progress>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">14 / 16:22</span>
                <span className="font-semibold">87%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-8 pt-4">
              <Button className="rounded-full bg-black text-white hover:bg-gray-800 px-8">
                Join lesson
              </Button>
              <Button variant="ghost" size="icon">
                <Flag className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
