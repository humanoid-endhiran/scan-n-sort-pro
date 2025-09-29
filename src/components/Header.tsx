import { Scan, BarChart3, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import cleanScanLogo from "@/assets/cleanscan-logo.png";

interface HeaderProps {
  activeTab: 'scan' | 'reports' | 'tips';
  onTabChange: (tab: 'scan' | 'reports' | 'tips') => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={cleanScanLogo} alt="CleanScan" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold text-primary">CleanScan</h1>
              <p className="text-xs text-muted-foreground">AI Waste Classification</p>
            </div>
          </div>
          
          <nav className="flex gap-2">
            <Button
              variant={activeTab === 'scan' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onTabChange('scan')}
              className="flex items-center gap-2"
            >
              <Scan className="w-4 h-4" />
              <span className="hidden sm:inline">Scan</span>
            </Button>
            <Button
              variant={activeTab === 'reports' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onTabChange('reports')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Reports</span>
            </Button>
            <Button
              variant={activeTab === 'tips' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onTabChange('tips')}
              className="flex items-center gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Tips</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}