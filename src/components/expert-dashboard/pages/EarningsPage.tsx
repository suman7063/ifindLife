import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Download, 
  ChevronDown,
  DollarSign // Added missing import
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/auth/AuthContext';

interface Payment {
  name: string;
  date: string;
  amount: string;
}

const EarningsPage = () => {
  const { expertProfile } = useAuth();
  const [payments, setPayments] = React.useState<Payment[][]>([
    [
      {
        name: "Consultation Payment",
        date: "November 12, 2023",
        amount: "$50.00",
      },
    ],
    [
      {
        name: "Consultation Payment",
        date: "November 12, 2023",
        amount: "$50.00",
      },
    ],
    [
      {
        name: "Consultation Payment",
        date: "November 12, 2023",
        amount: "$50.00",
      },
    ],
  ]);
  const [paymentsLoading, setPaymentsLoading] = React.useState(false);

  React.useEffect(() => {
    // Simulate loading data
    setPaymentsLoading(true);
    setTimeout(() => {
      setPaymentsLoading(false);
    }, 1500);
  }, []);

  // Fix the property access in JSX - around line 164-165
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Earnings & Payouts</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Earnings</CardTitle>
                <CardDescription>All time earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$1,250.00</div>
                <p className="text-sm text-muted-foreground">
                  Includes all completed consultations
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Available for Payout</CardTitle>
                <CardDescription>Funds ready to be withdrawn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$800.00</div>
                <p className="text-sm text-muted-foreground">
                  Excludes processing fees
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Recent Payouts</CardTitle>
                <CardDescription>Your recent payment transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="space-y-2">
                    <div className="h-14 bg-muted rounded-md animate-pulse" />
                    <div className="h-14 bg-muted rounded-md animate-pulse" />
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No payment transactions yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payments.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{payment[0]?.name || 'Payout'}</p>
                          <p className="text-sm text-muted-foreground">{payment[0]?.date || 'No date available'}</p>
                        </div>
                        <div className="text-sm font-medium">{payment[0]?.amount || '$0.00'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Next Payout</CardTitle>
                <Button variant="ghost" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">November 20, 2023</div>
                <p className="text-sm text-muted-foreground">
                  Estimated date for your next payout
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Payment Method</CardTitle>
                <CardDescription>Your preferred payout method</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Bank Account</p>
                    <p className="text-sm text-muted-foreground">
                      **** **** **** 1234
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="payouts">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Last 7 days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="bg-green-500 text-white hover:bg-green-600">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
          
          <div className="relative overflow-x-auto mt-6">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Transaction ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">View details</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    TRX123456789
                  </th>
                  <td className="px-6 py-4">
                    Nov 15, 2023
                  </td>
                  <td className="px-6 py-4">
                    $50.00
                  </td>
                  <td className="px-6 py-4">
                    Completed
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View details</a>
                  </td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    TRX987654321
                  </th>
                  <td className="px-6 py-4">
                    Nov 10, 2023
                  </td>
                  <td className="px-6 py-4">
                    $75.00
                  </td>
                  <td className="px-6 py-4">
                    Completed
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View details</a>
                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    TRX567891234
                  </th>
                  <td className="px-6 py-4">
                    Nov 05, 2023
                  </td>
                  <td className="px-6 py-4">
                    $100.00
                  </td>
                  <td className="px-6 py-4">
                    Completed
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View details</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EarningsPage;
