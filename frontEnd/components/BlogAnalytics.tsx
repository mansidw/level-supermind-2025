import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Timer } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const BlogAnalytics = ({ blog, isOpen, onClose }) => {
  const [timeRange, setTimeRange] = useState('week');

  const visitorData = [
    { date: 'Mon', visitors: 120 },
    { date: 'Tue', visitors: 150 },
    { date: 'Wed', visitors: 180 },
    { date: 'Thu', visitors: 140 },
    { date: 'Fri', visitors: 160 }
  ];

  const languageData = [
    { language: 'English', users: 450 },
    { language: 'Spanish', users: 320 },
    { language: 'French', users: 280 }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[550px] !max-h-[600px] bg-white/95 backdrop-blur-sm">
        <DialogHeader className="pb-2">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-medium">Analytics: {blog?.blogTitle}</DialogTitle>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
        
        <div className="space-y-3 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-white/50">
              <CardContent className="p-3">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-blue-500" />
                  <div className="ml-2">
                    <p className="text-xs text-gray-500">Total Visitors</p>
                    <h4 className="text-base font-bold">1,234</h4>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/50">
              <CardContent className="p-3">
                <div className="flex items-center">
                  <Timer className="h-4 w-4 text-yellow-500" />
                  <div className="ml-2">
                    <p className="text-xs text-gray-500">Avg. Time</p>
                    <h4 className="text-base font-bold">4m 32s</h4>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-white/50">
              <CardHeader className="p-3">
                <CardTitle className="text-xs font-medium">Visitors Trend</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={visitorData}>
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="visitors" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/50">
              <CardHeader className="p-3">
                <CardTitle className="text-xs font-medium">Language Split</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={languageData}
                        dataKey="users"
                        nameKey="language"
                        cx="50%"
                        cy="50%"
                        outerRadius={35}
                        label={({ language }) => language}
                      >
                        {languageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogAnalytics;