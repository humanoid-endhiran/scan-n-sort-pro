import { useState } from "react";
import { ChevronLeft, ChevronRight, Award, Target, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const tips = [
  {
    title: "The 3 R's: Reduce, Reuse, Recycle",
    content: "Always prioritize reducing consumption first, then reusing items, and finally recycling. This hierarchy maximizes environmental benefit.",
    category: "General"
  },
  {
    title: "Clean Before You Recycle",
    content: "Rinse containers to remove food residue. Contaminated recyclables can spoil entire batches and end up in landfills.",
    category: "Recycling"
  },
  {
    title: "Know Your Plastic Numbers",
    content: "Check the recycling number inside the triangular symbol. Numbers 1, 2, and 5 are widely recyclable, while others may not be accepted locally.",
    category: "Plastic"
  },
  {
    title: "Composting Basics",
    content: "Mix green materials (food scraps, grass) with brown materials (leaves, paper) in a 3:1 ratio for healthy compost.",
    category: "Organic"
  },
  {
    title: "E-Waste Contains Valuable Materials",
    content: "Old electronics contain precious metals like gold and silver. Always take them to certified e-waste recyclers.",
    category: "E-Waste"
  },
  {
    title: "Battery Safety First",
    content: "Never put batteries in regular trash. They contain toxic materials and should go to specialized collection points.",
    category: "Hazardous"
  }
];

const achievements = [
  { id: 1, name: "First Scan", description: "Complete your first waste scan", earned: true, icon: "🎯" },
  { id: 2, name: "Eco Warrior", description: "Scan 10 recyclable items", earned: true, icon: "♻️" },
  { id: 3, name: "Waste Expert", description: "Scan 50 items total", earned: false, icon: "🏆" },
  { id: 4, name: "Compost Champion", description: "Identify 20 organic items", earned: false, icon: "🌱" },
  { id: 5, name: "E-Waste Guardian", description: "Properly classify 5 electronic items", earned: true, icon: "⚡" },
];

export function AwarenessTips() {
  const [currentTip, setCurrentTip] = useState(0);
  const userScans = 27; // Mock user progress
  const nextBadgeTarget = 50;
  const progress = (userScans / nextBadgeTarget) * 100;

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Gamification Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Scans completed</span>
              <span className="font-medium">{userScans} / {nextBadgeTarget}</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {nextBadgeTarget - userScans} more scans to unlock "Waste Expert" badge
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`text-center p-3 rounded-lg border ${
                  achievement.earned 
                    ? 'bg-primary/10 border-primary/20' 
                    : 'bg-muted/50 border-muted'
                }`}
              >
                <div className="text-2xl mb-1">{achievement.icon}</div>
                <div className="text-xs font-medium">{achievement.name}</div>
                {achievement.earned && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    Earned
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rotating Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Daily Waste Tip
            </span>
            <Badge variant="outline">{tips[currentTip].category}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="min-h-[120px] flex items-center">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">{tips[currentTip].title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {tips[currentTip].content}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={prevTip}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="flex gap-2">
                {tips.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTip(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentTip ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextTip}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reference Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-recyclable/10 border-recyclable/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-recyclable flex items-center gap-2">
              ♻️ Recyclables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Clean plastic bottles & containers</li>
              <li>• Paper, cardboard, newspapers</li>
              <li>• Glass bottles & jars</li>
              <li>• Aluminum & steel cans</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-organic/10 border-organic/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-organic flex items-center gap-2">
              🌱 Compost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Fruit & vegetable scraps</li>
              <li>• Coffee grounds & tea bags</li>
              <li>• Eggshells & yard waste</li>
              <li>• Uncoated paper products</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-ewaste/10 border-ewaste/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-ewaste flex items-center gap-2">
              ⚡ E-Waste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Phones, tablets, computers</li>
              <li>• Batteries & chargers</li>
              <li>• Small appliances</li>
              <li>• Light bulbs & cables</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}