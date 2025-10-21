import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, RotateCcw, Sparkles, Info, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

export const MeditationActivityScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(600); // 10 minutes placeholder
  const [volume, setVolume] = useState(70);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Placeholder audio - in production, this will be uploaded by admin
  const meditationAudio = {
    title: "Peaceful Mind Journey",
    description: "A calming guided meditation to help you find inner peace and relaxation",
    instructor: "Meditation Guide"
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            handlePause();
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, duration]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlay = () => {
    setIsPlaying(true);
    // In production, play the actual audio file
    // audioRef.current?.play();
  };

  const handlePause = () => {
    setIsPlaying(false);
    // In production, pause the actual audio file
    // audioRef.current?.pause();
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    // In production, reset the actual audio file
    // if (audioRef.current) {
    //   audioRef.current.currentTime = 0;
    // }
  };

  const handleSeek = (value: number[]) => {
    const newTime = Math.floor((value[0] / 100) * duration);
    setCurrentTime(newTime);
    // In production, seek the actual audio file
    // if (audioRef.current) {
    //   audioRef.current.currentTime = newTime;
    // }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    // In production, adjust audio volume
    // if (audioRef.current) {
    //   audioRef.current.volume = value[0] / 100;
    // }
  };

  const progress = (currentTime / duration) * 100;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-ifind-purple/5 via-ifind-aqua/5 to-ifind-teal/5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-ifind-charcoal"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-poppins font-semibold text-ifind-charcoal">Guided Meditation</h1>
        <div className="w-10" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
        {/* Meditation Visual with Progress */}
        <div className="relative w-52 h-52 flex items-center justify-center">
          {/* Outer radiating ring */}
          <div 
            className={`absolute w-48 h-48 rounded-full bg-gradient-to-br from-ifind-purple/20 to-ifind-aqua/20 ${
              isPlaying ? 'animate-[ping_3s_ease-in-out_infinite]' : ''
            }`}
            style={{
              opacity: isPlaying ? 0.4 : 0.2
            }}
          />
          
          {/* Middle radiating ring */}
          <div 
            className={`absolute w-40 h-40 rounded-full bg-gradient-to-br from-ifind-purple/30 to-ifind-aqua/30 ${
              isPlaying ? 'animate-[ping_2.5s_ease-in-out_infinite]' : ''
            }`}
            style={{
              opacity: isPlaying ? 0.6 : 0.3,
              animationDelay: isPlaying ? '0.5s' : '0s'
            }}
          />
          
          {/* Progress ring */}
          <svg className="absolute w-36 h-36 -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="68"
              fill="none"
              stroke="hsl(var(--ifind-purple) / 0.2)"
              strokeWidth="3"
            />
            <circle
              cx="72"
              cy="72"
              r="68"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 68}`}
              strokeDashoffset={`${2 * Math.PI * 68 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--ifind-purple))" />
                <stop offset="100%" stopColor="hsl(var(--ifind-aqua))" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center circle with sparkles */}
          <div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-ifind-purple to-ifind-aqua flex items-center justify-center shadow-lg">
            <Sparkles 
              className={`h-12 w-12 text-white transition-transform duration-1000 ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{
                animationDuration: '8s'
              }}
            />
          </div>
        </div>

        {/* Meditation Info */}
        <div className="text-center space-y-2">
          <h2 className="font-poppins font-semibold text-xl text-ifind-charcoal">
            {meditationAudio.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {meditationAudio.instructor}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <Slider
            value={[progress]}
            onValueChange={handleSeek}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            className="h-14 w-14 rounded-full border-2"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          
          <Button
            size="icon"
            onClick={isPlaying ? handlePause : handlePlay}
            className="h-20 w-20 rounded-full bg-gradient-to-br from-ifind-purple to-ifind-aqua hover:from-ifind-purple/90 hover:to-ifind-aqua/90 shadow-lg"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8 text-white" />
            ) : (
              <Play className="h-8 w-8 text-white ml-1" />
            )}
          </Button>
          
          <div className="h-14 w-14" />
        </div>

        {/* Volume Control */}
        <Card className="w-full p-4 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Volume2 className="h-5 w-5 text-ifind-purple" />
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-10 text-right">{volume}%</span>
          </div>
        </Card>

        {/* Description */}
        <Card className="w-full p-4 bg-white/80 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-ifind-purple/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="h-5 w-5 text-ifind-purple" />
            </div>
            <div>
              <h3 className="font-poppins font-semibold text-ifind-charcoal mb-2">About This Session</h3>
              <p className="text-sm text-muted-foreground">
                {meditationAudio.description}
              </p>
            </div>
          </div>
        </Card>

        {/* What You'll Need */}
        <Card className="w-full p-4 bg-white/80 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-ifind-aqua/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="h-5 w-5 text-ifind-aqua" />
            </div>
            <div>
              <h3 className="font-poppins font-semibold text-ifind-charcoal mb-2">What You'll Need</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• A quiet, comfortable space</li>
                <li>• Headphones or earbuds (recommended)</li>
                <li>• 10-15 minutes of uninterrupted time</li>
                <li>• Comfortable sitting or lying position</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Benefits */}
        <Card className="w-full p-4 bg-gradient-to-br from-ifind-purple/5 to-ifind-aqua/5 border-ifind-purple/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-ifind-purple to-ifind-aqua rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-poppins font-semibold text-ifind-charcoal mb-2">Benefits</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Reduces stress and anxiety</li>
                <li>• Improves focus and clarity</li>
                <li>• Promotes emotional balance</li>
                <li>• Enhances overall well-being</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Hidden audio element - will be used when actual audio is uploaded */}
      {/* <audio ref={audioRef} src="/path-to-meditation-audio.mp3" /> */}
    </div>
  );
};
