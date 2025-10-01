import { CheckCircle, Recycle, Leaf, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WasteClassification, WasteItem } from "./ScanWaste";

interface WasteResultProps {
  result: WasteClassification;
  onNewScan: () => void;
}

interface CategoryGroup {
  category: string;
  emoji: string;
  name: string;
  icon: JSX.Element;
  color: string;
  items: WasteItem[];
}

export function WasteResult({ result, onNewScan }: WasteResultProps) {
  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'recyclable': 
        return { 
          emoji: '♻️', 
          name: 'Recyclable',
          icon: <Recycle className="w-5 h-5" />,
          color: 'bg-recyclable text-recyclable-foreground'
        };
      case 'organic': 
        return { 
          emoji: '🌱', 
          name: 'Organic / Compostable',
          icon: <Leaf className="w-5 h-5" />,
          color: 'bg-organic text-organic-foreground'
        };
      case 'landfill': 
        return { 
          emoji: '🗑', 
          name: 'Landfill',
          icon: <Trash2 className="w-5 h-5" />,
          color: 'bg-landfill text-landfill-foreground'
        };
      case 'hazardous': 
        return { 
          emoji: '⚠️', 
          name: 'Hazardous / Unknown',
          icon: <AlertTriangle className="w-5 h-5" />,
          color: 'bg-destructive text-destructive-foreground'
        };
      default: 
        return { 
          emoji: '❓', 
          name: 'Unknown',
          icon: <AlertTriangle className="w-5 h-5" />,
          color: 'bg-muted text-muted-foreground'
        };
    }
  };

  // Group items by category
  const groupedItems: CategoryGroup[] = ['recyclable', 'organic', 'landfill', 'hazardous']
    .map(category => {
      const items = result.items.filter(item => item.category === category);
      const config = getCategoryConfig(category);
      return {
        category,
        emoji: config.emoji,
        icon: config.icon,
        color: config.color,
        name: config.name,
        items
      };
    })
    .filter(group => group.items.length > 0);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          Classification Result
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Detected Items ({result.items.length})</h3>
          
          {groupedItems.map((group, groupIndex) => (
            <div key={groupIndex} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{group.emoji}</span>
                <h4 className="font-semibold text-lg">{group.name}</h4>
              </div>
              
              <div className="space-y-2 pl-2">
                {group.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm">
                      {item.description} <span className="text-muted-foreground">({item.confidence}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {result.tips.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Helpful Tips</h3>
            <div className="flex flex-wrap gap-2">
              {result.tips.map((tip, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tip}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button onClick={onNewScan} className="flex-1">
            Scan Another Item
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            Share Result
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}