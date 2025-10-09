import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Search, Users } from "lucide-react";

interface WaitlistEntry {
  id: string;
  email: string;
  subscriber_number: number;
  created_at: string;
}

const WaitlistViewer = () => {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [filteredWaitlist, setFilteredWaitlist] = useState<WaitlistEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchWaitlist();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = waitlist.filter((entry) =>
        entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.subscriber_number.toString().includes(searchTerm)
      );
      setFilteredWaitlist(filtered);
    } else {
      setFilteredWaitlist(waitlist);
    }
  }, [searchTerm, waitlist]);

  const fetchWaitlist = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("waitlist")
        .select("*")
        .order("subscriber_number", { ascending: true });

      if (error) throw error;

      setWaitlist(data || []);
      setFilteredWaitlist(data || []);
    } catch (error) {
      console.error("Error fetching waitlist:", error);
      toast({
        title: "Error",
        description: "Failed to fetch waitlist data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Subscriber Number", "Email", "Joined Date"];
    const rows = filteredWaitlist.map((entry) => [
      entry.subscriber_number,
      entry.email,
      new Date(entry.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `souli-waitlist-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Waitlist exported successfully",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Souli Waitlist
              </CardTitle>
              <CardDescription>
                View and manage waitlist subscribers
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-2xl font-bold text-primary">
              <Users className="w-6 h-6" />
              {waitlist.length}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by email or subscriber number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Subscriber #</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-48">Joined Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWaitlist.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No waitlist entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWaitlist.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        #{entry.subscriber_number}
                      </TableCell>
                      <TableCell>{entry.email}</TableCell>
                      <TableCell>
                        {new Date(entry.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitlistViewer;
