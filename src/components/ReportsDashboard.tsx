import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Download, Share2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for demonstration
const weeklyScansData = [
  { day: 'Mon', scans: 45, recyclable: 32, landfill: 13 },
  { day: 'Tue', scans: 52, recyclable: 38, landfill: 14 },
  { day: 'Wed', scans: 61, recyclable: 44, landfill: 17 },
  { day: 'Thu', scans: 48, recyclable: 35, landfill: 13 },
  { day: 'Fri', scans: 67, recyclable: 49, landfill: 18 },
  { day: 'Sat', scans: 89, recyclable: 68, landfill: 21 },
  { day: 'Sun', scans: 76, recyclable: 58, landfill: 18 },
];

const categoryData = [
  { name: 'Recyclable', value: 324, color: 'hsl(142 76% 36%)' },
  { name: 'Organic', value: 156, color: 'hsl(85 60% 44%)' },
  { name: 'Plastic', value: 98, color: 'hsl(200 89% 47%)' },
  { name: 'E-Waste', value: 43, color: 'hsl(45 100% 51%)' },
  { name: 'Landfill', value: 114, color: 'hsl(0 65% 51%)' },
];

const totalScans = categoryData.reduce((sum, cat) => sum + cat.value, 0);
const recyclablePercentage = Math.round((categoryData[0].value / totalScans) * 100);

export function ReportsDashboard() {
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Category,Count\n" +
      categoryData.map(row => `${row.name},${row.value}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "waste_classification_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm text-muted-foreground">Total Scans</span>
            </div>
            <div className="text-2xl font-bold">{totalScans.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              +12% this week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-recyclable rounded-full"></div>
              <span className="text-sm text-muted-foreground">Recyclable Rate</span>
            </div>
            <div className="text-2xl font-bold">{recyclablePercentage}%</div>
            <div className="text-xs text-muted-foreground">
              {categoryData[0].value} items
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-landfill rounded-full"></div>
              <span className="text-sm text-muted-foreground">Landfill Rate</span>
            </div>
            <div className="text-2xl font-bold">{Math.round((categoryData[4].value / totalScans) * 100)}%</div>
            <div className="text-xs text-muted-foreground">
              {categoryData[4].value} items
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-organic rounded-full"></div>
              <span className="text-sm text-muted-foreground">Organic Waste</span>
            </div>
            <div className="text-2xl font-bold">{Math.round((categoryData[1].value / totalScans) * 100)}%</div>
            <div className="text-xs text-muted-foreground">
              {categoryData[1].value} items
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trends */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Weekly Scan Trends</CardTitle>
            <Badge variant="secondary">
              <Calendar className="w-3 h-3 mr-1" />
              Last 7 days
            </Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyScansData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="recyclable" stackId="a" fill="hsl(142 76% 36%)" />
                <Bar dataKey="landfill" stackId="a" fill="hsl(0 65% 51%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Waste Category Distribution</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="min-w-0 flex-1">{category.name}</span>
                    <span className="font-medium">{category.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Impact Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-recyclable">2.4 tons</div>
              <div className="text-sm text-muted-foreground">CO₂ Saved Through Recycling</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-organic">890 kg</div>
              <div className="text-sm text-muted-foreground">Organic Waste Composted</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">67%</div>
              <div className="text-sm text-muted-foreground">Waste Diverted from Landfill</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}