import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Search, Mail, Loader2, Send, Youtube } from "lucide-react";

interface NewsletterSubscriber {
  id: string;
  email: string;
  active: boolean;
  created_at: string;
}

const NewsletterSubscribers = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubscribers, setSelectedSubscribers] = useState<Set<string>>(new Set());
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = subscribers.filter((subscriber) =>
        subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSubscribers(filtered);
    } else {
      setFilteredSubscribers(subscribers);
    }
  }, [searchTerm, subscribers]);

  const fetchSubscribers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("newsletter_subscriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSubscribers(data || []);
      setFilteredSubscribers(data || []);
    } catch (error) {
      console.error("Error fetching newsletter subscribers:", error);
      toast.error("Failed to fetch newsletter subscribers");
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Email", "Status", "Subscribed Date"];
    const rows = filteredSubscribers.map((subscriber) => [
      subscriber.email,
      subscriber.active ? "Active" : "Inactive",
      new Date(subscriber.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Newsletter subscribers exported successfully");
  };

  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .update({ active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setSubscribers(prev =>
        prev.map(sub => sub.id === id ? { ...sub, active: !currentStatus } : sub)
      );
      setFilteredSubscribers(prev =>
        prev.map(sub => sub.id === id ? { ...sub, active: !currentStatus } : sub)
      );

      toast.success(`Subscriber ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error("Error updating subscriber status:", error);
      toast.error("Failed to update subscriber status");
    }
  };

  const toggleSubscriberSelection = (id: string) => {
    const newSelected = new Set(selectedSubscribers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSubscribers(newSelected);
  };

  const toggleSelectAll = () => {
    const activeSubscribers = filteredSubscribers.filter(s => s.active);
    if (selectedSubscribers.size === activeSubscribers.length) {
      setSelectedSubscribers(new Set());
    } else {
      setSelectedSubscribers(new Set(activeSubscribers.map(s => s.id)));
    }
  };

  const handleOpenSendDialog = () => {
    // Only select active subscribers by default
    const activeIds = filteredSubscribers.filter(s => s.active).map(s => s.id);
    setSelectedSubscribers(new Set(activeIds));
    setIsSendDialogOpen(true);
  };

  const handleSendCommunication = async () => {
    if (selectedSubscribers.size === 0) {
      toast.error("Please select at least one subscriber");
      return;
    }

    if (!emailSubject.trim()) {
      toast.error("Please enter a subject");
      return;
    }

    if (!emailMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSending(true);
    try {
      // Get selected subscriber emails
      const selectedEmails = subscribers
        .filter(s => selectedSubscribers.has(s.id) && s.active)
        .map(s => s.email);

      if (selectedEmails.length === 0) {
        toast.error("No active subscribers selected");
        setIsSending(false);
        return;
      }

      // Call Edge Function using Supabase client
      const { data: result, error } = await supabase.functions.invoke('send-newsletter-email', {
        body: {
          emails: selectedEmails,
          subject: emailSubject,
          message: emailMessage,
          youtubeLink: youtubeLink.trim() || undefined,
        },
      });

      if (error) {
        throw error;
      }

      if (!result || !result.success) {
        throw new Error(result?.error || "Failed to send emails");
      }

      toast.success(
        `Successfully sent to ${result.successCount} subscriber(s). ${result.failureCount > 0 ? `${result.failureCount} failed.` : ""}`
      );

      // Reset form
      setEmailSubject("");
      setEmailMessage("");
      setYoutubeLink("");
      setSelectedSubscribers(new Set());
      setIsSendDialogOpen(false);
    } catch (error: any) {
      console.error("Error sending newsletter:", error);
      
      // Better error messages
      let errorMessage = "Unknown error";
      if (error?.message) {
        if (error.message.includes("Failed to send a request to the Edge Function") || 
            error.message.includes("FunctionsFetchError") ||
            error.name === "FunctionsFetchError") {
          errorMessage = "Edge Function not deployed. Please deploy 'send-newsletter-email' function.";
        } else if (error.message.includes("Unauthorized") || error.message.includes("401")) {
          errorMessage = "Unauthorized. Please check your authentication.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(`Failed to send newsletter: ${errorMessage}`);
    } finally {
      setIsSending(false);
    }
  };

  const selectedCount = selectedSubscribers.size;
  const activeFilteredCount = filteredSubscribers.filter(s => s.active).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeCount = subscribers.filter(s => s.active).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Newsletter Subscribers
              </CardTitle>
              <CardDescription>
                View and manage newsletter email subscriptions
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{subscribers.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{activeCount}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              onClick={handleOpenSendDialog} 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={activeFilteredCount === 0}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Communication
            </Button>
            <Button onClick={fetchSubscribers} variant="outline">
              Refresh
            </Button>
          </div>
          {selectedCount > 0 && (
            <div className="mb-4 text-sm text-muted-foreground">
              {selectedCount} subscriber(s) selected
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedSubscribers.size > 0 && selectedSubscribers.size === activeFilteredCount}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-32">Status</TableHead>
                  <TableHead className="w-48">Subscribed Date</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      {searchTerm ? "No subscribers found matching your search" : "No newsletter subscribers yet"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedSubscribers.has(subscriber.id)}
                          onCheckedChange={() => toggleSubscriberSelection(subscriber.id)}
                          disabled={!subscriber.active}
                          aria-label={`Select ${subscriber.email}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{subscriber.email}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            subscriber.active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {subscriber.active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(subscriber.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActiveStatus(subscriber.id, subscriber.active)}
                        >
                          {subscriber.active ? "Deactivate" : "Activate"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Send Communication Dialog */}
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Send Newsletter Communication</DialogTitle>
            <DialogDescription>
              Send an email to {selectedCount} selected subscriber(s). Only active subscribers will receive the email.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Enter email subject"
                disabled={isSending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Enter your message here..."
                rows={8}
                disabled={isSending}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube-link" className="flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-600" />
                YouTube Link (Optional)
              </Label>
              <Input
                id="youtube-link"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={isSending}
              />
              <p className="text-xs text-muted-foreground">
                Paste any YouTube video URL. A "Watch on YouTube" button will be added to the email.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Selected Recipients:</strong> {selectedCount} active subscriber(s)
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-200 mt-1">
                Inactive subscribers are automatically excluded from the send list.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSendDialogOpen(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendCommunication}
              disabled={isSending || !emailSubject.trim() || !emailMessage.trim()}
              className="bg-primary text-primary-foreground"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send to {selectedCount} Subscriber(s)
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsletterSubscribers;

