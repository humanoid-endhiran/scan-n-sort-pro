import { useState, useRef } from "react";
import { Upload, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WasteResult } from "./WasteResult";

export interface WasteItem {
  category: 'recyclable' | 'organic' | 'plastic' | 'ewaste' | 'landfill';
  confidence: number;
  instructions: string;
  description: string;
}

export interface WasteClassification {
  items: WasteItem[];
  tips: string[];
}

export function ScanWaste() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<WasteClassification | null>(null);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const mockAnalyzeWaste = async (): Promise<WasteClassification> => {
    // Demo outputs - cycles between 2 specific scenarios
    const demoResults: WasteClassification[] = [
      {
        items: [
          {
            category: 'organic',
            confidence: 95,
            instructions: 'Add to compost bin',
            description: 'Vegetable and fruit scraps'
          },
          {
            category: 'recyclable',
            confidence: 89,
            instructions: 'Flatten and place in paper recycling',
            description: 'Paper packaging'
          },
          {
            category: 'plastic',
            confidence: 87,
            instructions: 'Rinse and recycle if local rules allow',
            description: 'Plastic wrap or bottle'
          }
        ],
        tips: ['Compost organic waste separately', 'Keep paper dry before recycling', 'Check local recycling symbols']
      },
      {
        items: [
          {
            category: 'landfill',
            confidence: 75,
            instructions: 'Donate if usable, otherwise dispose in trash',
            description: 'Old clothing'
          },
          {
            category: 'ewaste',
            confidence: 94,
            instructions: 'Drop off at e-waste facility',
            description: 'Used batteries'
          },
          {
            category: 'recyclable',
            confidence: 90,
            instructions: 'Remove staples, recycle with paper',
            description: 'Magazines and notebooks'
          }
        ],
        tips: ['Clothes in good condition can be donated', 'Batteries must not go in regular trash', 'Separate paper from bindings']
      }
    ];
    
    return demoResults[categoryIndex];
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      const classification = await mockAnalyzeWaste();
      setResult(classification);
      // Move to next result in sequence
      setCategoryIndex((prev) => (prev + 1) % 2);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewScan = () => {
    setSelectedImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Scan Your Waste
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedImage ? (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Upload or capture an image</p>
              <p className="text-muted-foreground mb-4">
                Take a clear photo of the waste item for accurate classification
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Waste item to analyze"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              
              {!result && (
                <div className="flex gap-3">
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={isAnalyzing}
                    className="flex-1"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Waste'
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleNewScan}>
                    New Scan
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <WasteResult result={result} onNewScan={handleNewScan} />
      )}
    </div>
  );
}