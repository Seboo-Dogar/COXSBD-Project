"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function AnalyticsCard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const stages = [
    { name: "Design", value: 80, color: "bg-green-500" },
    { name: "Development", value: 47, color: "bg-purple-500" },
    { name: "Release", value: 27, color: "bg-yellow-500" },
  ];
  return (
    <>
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Sessions this month
            </span>
            <span className="text-sm text-muted-foreground">Sessions</span>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="flex flex-col items-start space-y-4">
            {/* Big Number 46 with +7% */}
            <div className="flex items-baseline gap-4">
              <span className="text-6xl font-bold tracking-tight">46</span>
              <div className="flex items-center gap-1 text-orange-500 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>7%</span>
              </div>
            </div>

            {/* Orange gradient sparkline */}
            <svg width="140" height="50" className="mt-2">
              <defs>
                <linearGradient
                  id="orangeGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#fdba74" />
                </linearGradient>
              </defs>
              <polyline
                fill="none"
                stroke="url(#orangeGradient)"
                strokeWidth="4"
                points="0,35 25,30 50,33 75,25 100,27 125,23 140,20"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Optional: subtle divider if needed */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-right">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                + View full report
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full max-w-md shadow-sm bg-white">
        <CardContent className="pt-6 space-y-2">
          {/* Top small labels exactly like screenshot */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Skill tracker</span>
            <span className="text-muted-foreground">Skill tracker</span>
          </div>

          {/* Big number + green percentage + arrow */}
          <div className="flex items-baseline gap-4">
            <span className="text-6xl font-bold tracking-tight">127h</span>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+12%</span>
            </div>
          </div>

          {/* Green mountain-like sparkline exactly matching the screenshot */}
          <svg width="140" height="50" className="mt-1">
            <defs>
              <linearGradient
                id="greenGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#86efac" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke="url(#greenGradient)"
              strokeWidth="4"
              points="0,35 25,32 50,28 75,25 100,20 125,18 140,15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Bottom text exactly as in screenshot */}
          <div className="pt-2 text-sm text-muted-foreground">
            Average speed per session
          </div>

          {/* View full report link */}
          <div className="mt-3 text-right">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              + View full report
            </a>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-md">
        <CardContent className="pt-6 space-y-8">
          {stages.map((stage) => (
            <div key={stage.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {stage.name}
                </h3>

                {/* percent text NOT gray */}
                <span className="text-sm font-medium text-gray-900">
                  {stage.value}%
                </span>
              </div>

              <Progress
                value={stage.value}
                className="h-4 bg-gray-100"
                percentCompleteColor={stage.color}
              >
                <div
                  className={`h-full rounded-full transition-all duration-700 `}
                  style={{ width: `${stage.value}%` }}
                />
              </Progress>
            </div>
          ))}

          <div className="pt-4 text-right">
            <a
              href="#"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              + View full report
            </a>
          </div>
        </CardContent>
      </Card>

      <Card className="">
        <CardContent className="">
          {/* Header with icons */}

          <CalendarComponent
            mode="single" // 'single', 'multiple', or 'range'
            selected={selectedDate}
            onSelect={setSelectedDate}
          />
        </CardContent>
      </Card>
    </>
  );
}
