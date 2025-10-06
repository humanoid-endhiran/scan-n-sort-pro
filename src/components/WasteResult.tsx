import { CheckCircle, Recycle, Leaf, Trash2, AlertTriangle, MapPin, Lightbulb } from "lucide-react";
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
      case 'plastic':
        return {
          emoji: '♻️',
          name: 'Plastic',
          icon: <Recycle className="w-5 h-5" />,
          color: 'bg-blue-500 text-white'
        };
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
  
  const hasPlastic = result.items.some(item => item.category === 'plastic') || result.plasticType;

  // Group items by category
  const groupedItems: CategoryGroup[] = ['plastic', 'recyclable', 'organic', 'landfill', 'hazardous']
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

        {hasPlastic && (
          <div className="border-2 border-blue-500 rounded-lg p-4 space-y-4 bg-blue-50 dark:bg-blue-950">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              ♻️ Plastic Upcycling Options
            </h3>
            
            {result.plasticType && (
              <div>
                <p className="text-sm font-medium">Plastic Type:</p>
                <Badge variant="default" className="mt-1">{result.plasticType}</Badge>
              </div>
            )}
            
            {result.upcyclingIdeas && result.upcyclingIdeas.length > 0 && (
              <div>
                <p className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4" />
                  Upcycling Ideas:
                </p>
                <ul className="space-y-2 pl-4">
                  {result.upcyclingIdeas.map((idea, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>{idea}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {result.nearbyCenters && result.nearbyCenters.length > 0 && (
              <div>
                <p className="text-sm font-medium flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  Nearby Recycling Centers:
                </p>
                <div className="space-y-3">
                  {result.nearbyCenters.map((center, index) => (
                    <div key={index} className="bg-card rounded-lg p-3 border">
                      <p className="font-medium text-sm">{center.name}</p>
                      <p className="text-xs text-muted-foreground">{center.type}</p>
                      <p className="text-xs mt-1">{center.address}</p>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="h-auto p-0 mt-1 text-xs"
                        onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(center.name + ' ' + center.address)}`, '_blank')}
                      >
                        📍 View on Map
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Button 
              variant="default" 
              className="w-full"
              onClick={() => alert('Marked as collected! Thank you for recycling.')}
            >
              ♻️ Mark as Collected
            </Button>
          </div>
        )}

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