import { useState } from "react";
import { Header } from "@/components/Header";
import { ScanWaste } from "@/components/ScanWaste";
import { ReportsDashboard } from "@/components/ReportsDashboard";
import { AwarenessTips } from "@/components/AwarenessTips";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'scan' | 'reports' | 'tips'>('scan');

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'scan' && <ScanWaste />}
        {activeTab === 'reports' && <ReportsDashboard />}
        {activeTab === 'tips' && <AwarenessTips />}
      </main>
      
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">
            CleanScan - AI-Powered Waste Classification for a Cleaner Future
          </p>
          <p className="text-xs mt-2">
            Helping citizens, NGOs, and municipalities improve waste management through technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
