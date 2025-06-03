
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, VideoOff, Download, Share } from 'lucide-react';
import { toast } from 'sonner';

interface CallRecordingControlsProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  recordingDuration?: number;
  className?: string;
}

export const CallRecordingControls: React.FC<CallRecordingControlsProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  onDownload,
  onShare,
  recordingDuration = 0,
  className = ''
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = useCallback(async () => {
    setIsProcessing(true);
    try {
      await onStartRecording();
      toast.success('Recording started');
    } catch (error) {
      toast.error('Failed to start recording');
    } finally {
      setIsProcessing(false);
    }
  }, [onStartRecording]);

  const handleStopRecording = useCallback(async () => {
    setIsProcessing(true);
    try {
      await onStopRecording();
      toast.success('Recording stopped');
    } catch (error) {
      toast.error('Failed to stop recording');
    } finally {
      setIsProcessing(false);
    }
  }, [onStopRecording]);

  const handleDownload = useCallback(() => {
    if (onDownload) {
      onDownload();
      toast.success('Download started');
    }
  }, [onDownload]);

  const handleShare = useCallback(() => {
    if (onShare) {
      onShare();
      toast.success('Share options opened');
    }
  }, [onShare]);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {!isRecording ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleStartRecording}
          disabled={isProcessing}
          className="flex items-center space-x-1"
        >
          <Video className="h-4 w-4" />
          <span>Record</span>
        </Button>
      ) : (
        <>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleStopRecording}
            disabled={isProcessing}
            className="flex items-center space-x-1"
          >
            <VideoOff className="h-4 w-4" />
            <span>Stop</span>
          </Button>
          
          <Badge variant="destructive" className="animate-pulse">
            REC {formatDuration(recordingDuration)}
          </Badge>
        </>
      )}

      {!isRecording && recordingDuration > 0 && (
        <div className="flex items-center space-x-1">
          {onDownload && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          
          {onShare && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-1"
            >
              <Share className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export const useCallRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedFile, setRecordedFile] = useState<string | null>(null);

  const startRecording = useCallback(async () => {
    try {
      // In a real implementation, you would start Agora cloud recording
      console.log('Starting call recording...');
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start duration counter
      const interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      console.log('Stopping call recording...');
      setIsRecording(false);
      
      // Simulate recording file generation
      const recordingId = `recording_${Date.now()}`;
      setRecordedFile(recordingId);
      
      return recordingId;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      throw error;
    }
  }, []);

  const downloadRecording = useCallback(() => {
    if (recordedFile) {
      // In a real implementation, you would download from cloud storage
      console.log('Downloading recording:', recordedFile);
      toast.info('Recording download would start here');
    }
  }, [recordedFile]);

  const shareRecording = useCallback(() => {
    if (recordedFile) {
      // In a real implementation, you would generate share links
      console.log('Sharing recording:', recordedFile);
      toast.info('Recording share dialog would open here');
    }
  }, [recordedFile]);

  return {
    isRecording,
    recordingDuration,
    recordedFile,
    startRecording,
    stopRecording,
    downloadRecording,
    shareRecording
  };
};
