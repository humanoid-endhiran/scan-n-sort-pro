import { useState, useRef } from "react";
import { Upload, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WasteResult } from "./WasteResult";

export interface WasteItem {
  category: 'recyclable' | 'organic' | 'landfill' | 'hazardous';
  confidence: number;
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
  const [language, setLanguage] = useState<string>("english");
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

  const analyzeWaste = async (imageData: string, selectedLanguage: string): Promise<WasteClassification> => {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/classify-waste`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData, language: selectedLanguage })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to classify waste');
    }

    return response.json();
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    try {
      const classification = await analyzeWaste(selectedImage, language);
      setResult(classification);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to analyze waste. Please try again.');
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
          <div className="flex items-center gap-2 mb-4">
            <label className="text-sm font-medium">Language:</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">हिन्दी (Hindi)</SelectItem>
                <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
                <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
              </SelectContent>
            </Select>
          </div>

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