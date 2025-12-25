"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const courses = [
  {
    title: "Figma Pro",
    subtitle: "Advanced prototyping techniques",
    badge: "1",
    bgImage:
      "https://img.freepik.com/premium-vector/pink-peach-gradient-abstract-blurred-wallpaper-texture_13978-230.jpg",
    iconImage:
      "https://s3-alpha.figma.com/hub/file/5182952693/5acbd847-0911-44d7-b1c6-d0fc17b74e3b-cover.png",
  },
  {
    title: "UI Design",
    subtitle: "Design systems & best practices",
    badge: "1",
    bgImage:
      "https://static.vecteezy.com/system/resources/previews/018/991/298/non_2x/soft-gradient-abstract-in-pastel-purple-and-pink-colors-gradient-background-blurred-gradient-texture-decorative-element-wallpaper-vector.jpg",
    iconImage:
      "https://www.creativefabrica.com/wp-content/uploads/2023/02/18/Abstract-pastel-color-background-design-Graphics-61598226-1.jpg",
  },
  {
    title: "Sketch Advance",
    subtitle: "Expert Sketch & Plugins",
    badge: "1",
    bgImage:
      "https://img.freepik.com/free-vector/soft-yellow-watercolor-simple-texture-background-vector_1055-11888.jpg",
    iconImage:
      "https://www.sketchappsources.com/resources/source-image/zondicons.png",
  },
];

export default function ThirdRow() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Course Recommendations
        </h2>
        <Button variant="link" className="text-blue-600">
          View all
        </Button>
      </div>

      {/* Grid of 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Card
            key={course.title}
            className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{
              backgroundImage: `url(${course.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <CardContent className="p-6 h-full flex flex-col justify-between backdrop-blur-sm bg-white/30">
              <div className="space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                  <img
                    src={course.iconImage}
                    alt={`${course.title} icon`}
                    className="h-24 w-24 rounded-2xl shadow-md object-cover"
                  />
                </div>

                {/* Title & Badge */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    {course.title}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="bg-white/80 text-gray-800"
                  >
                    {course.badge}
                  </Badge>
                </div>

                {/* Subtitle */}
                <p className="text-sm text-gray-700">{course.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        <Card className="w-full max-w-sm overflow-hidden shadow-lg">
          <CardContent className="p-6 space-y-6 bg-gradient-to-br from-purple-50 via-white to-pink-50">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-700">
                Skills & Badges
              </h3>
              <Button variant="ghost" size="sm" className="text-gray-500">
                View all
              </Button>
            </div>

            {/* Main Badge Section */}
            <div className="space-y-4">
              {/* Large number */}
              <div className="text-center">
                <h2 className="text-5xl font-bold text-gray-900">1350+</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Total badges earned
                </p>
              </div>

              {/* Badge icons row */}
              <div className="flex items-center justify-center gap-4">
                {/* Placeholder for colorful badge icons */}
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-md" />
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 shadow-md" />
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-red-500 shadow-md" />
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md" />
              </div>
            </div>

            {/* Optional action */}
            <div className="text-center pt-4">
              <Button variant="outline" className="rounded-full">
                View badges
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
