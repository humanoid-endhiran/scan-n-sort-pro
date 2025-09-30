import { CheckCircle, Recycle, Leaf, Trash2, Zap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WasteClassification, WasteItem } from "./ScanWaste";

interface WasteResultProps {
  result: WasteClassification;
  onNewScan: () => void;
}

export function WasteResult({ result, onNewScan }: WasteResultProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'recyclable': return <Recycle className="w-6 h-6" />;
      case 'organic': return <Leaf className="w-6 h-6" />;
      case 'plastic': return <Recycle className="w-6 h-6" />;
      case 'ewaste': return <Zap className="w-6 h-6" />;
      case 'landfill': return <Trash2 className="w-6 h-6" />;
      default: return <AlertTriangle className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'recyclable': return 'bg-recyclable text-recyclable-foreground';
      case 'organic': return 'bg-organic text-organic-foreground';
      case 'plastic': return 'bg-plastic text-plastic-foreground';
      case 'ewaste': return 'bg-ewaste text-ewaste-foreground';
      case 'landfill': return 'bg-landfill text-landfill-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'recyclable': return 'Recyclable';
      case 'organic': return 'Organic/Compost';
      case 'plastic': return 'Plastic';
      case 'ewaste': return 'E-Waste';
      case 'landfill': return 'Landfill';
      default: return 'Unknown';
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          Classification Result
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-center">Detected Items ({result.items.length})</h3>
          {result.items.map((item, index) => (
            <div key={index} className="border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getCategoryColor(item.category)}`}>
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <div className="font-semibold">{item.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {getCategoryName(item.category)} • {item.confidence}% confidence
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground pl-11">
                {item.instructions}
              </div>
            </div>
          ))}
        </div>

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