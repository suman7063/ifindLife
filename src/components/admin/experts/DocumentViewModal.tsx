import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrls: string[];
  expertName: string;
}

const DocumentViewModal: React.FC<DocumentViewModalProps> = ({
  isOpen,
  onClose,
  documentUrls,
  expertName
}) => {
  const handleDownload = async (url: string, index: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${expertName}_certificate_${index + 1}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);
      toast.success('Document downloaded successfully');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download document');
    }
  };

  const handleViewInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Verification Documents - {expertName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {documentUrls.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No documents uploaded</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {documentUrls.map((url, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">
                        Certificate {index + 1}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewInNewTab(url)}
                        className="gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(url, index)}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  {/* Document Preview */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    {url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img
                        src={url}
                        alt={`Certificate ${index + 1}`}
                        className="max-w-full h-auto max-h-64 mx-auto rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : url.toLowerCase().includes('.pdf') ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto mb-3 text-red-500" />
                        <p className="text-sm text-muted-foreground">
                          PDF Document
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Click "View" to open in new tab
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-sm text-muted-foreground">
                          Document Preview Not Available
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Click "View" or "Download" to access
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 text-xs text-muted-foreground">
                    <p>URL: {url}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewModal;