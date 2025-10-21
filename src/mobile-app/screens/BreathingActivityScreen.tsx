import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, RotateCcw, Wind, Info } from 'lucide-react';

export const BreathingActivityScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const phaseDurations = {
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 2
  };

  const phaseColors = {
    inhale: 'from-ifind-aqua to-ifind-teal',
    hold: 'from-ifind-teal to-ifind-purple',
    exhale: 'from-ifind-purple to-ifind-aqua',
    rest: 'from-ifind-aqua/50 to-ifind-teal/50'
  };

  const phaseInstructions = {
    inhale: 'Breathe In',
    hold: 'Hold',
    exhale: 'Breathe Out',
    rest: 'Rest'
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Move to next phase
            const phases: Array<'inhale' | 'hold' | 'exhale' | 'rest'> = ['inhale', 'hold', 'exhale', 'rest'];
            const currentIndex = phases.indexOf(phase);
            const nextPhase = phases[(currentIndex + 1) % phases.length];
            
            if (nextPhase === 'inhale') {
              setCyclesCompleted((c) => c + 1);
            }
            
            setPhase(nextPhase);
            return phaseDurations[nextPhase];
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, phase]);

  const handleReset = () => {
    setIsPlaying(false);
    setPhase('inhale');
    setCountdown(4);
    setCyclesCompleted(0);
  };

  const getCircleStyle = (size: number) => {
    let scale = 1;
    let opacity = 0.3;
    
    switch (phase) {
      case 'inhale':
        scale = 1.6;
        opacity = size === 38 ? 0.2 : size === 32 ? 0.4 : 0.7;
        break;
      case 'hold':
        scale = 1.6;
        opacity = size === 38 ? 0.3 : size === 32 ? 0.5 : 0.9;
        break;
      case 'exhale':
        scale = 0.9;
        opacity = size === 38 ? 0.15 : size === 32 ? 0.3 : 0.6;
        break;
      case 'rest':
        scale = 0.9;
        opacity = size === 38 ? 0.1 : size === 32 ? 0.2 : 0.5;
        break;
    }
    
    const duration = phaseDurations[phase];
    return {
      transform: `scale(${scale})`,
      opacity,
      transition: `all ${duration}s ease-in-out`
    };
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-ifind-aqua/5 via-ifind-teal/5 to-ifind-purple/5">
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
        <h1 className="font-poppins font-semibold text-ifind-charcoal">Mindful Breathing</h1>
        <div className="w-10" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        {/* Breathing Circle Animation */}
        <div className="relative w-52 h-52 flex items-center justify-center">
          <div 
            className={`absolute w-38 h-38 rounded-full bg-gradient-to-br ${phaseColors[phase]}`}
            style={getCircleStyle(38)}
          />
          <div 
            className={`absolute w-32 h-32 rounded-full bg-gradient-to-br ${phaseColors[phase]}`}
            style={getCircleStyle(32)}
          />
          <div 
            className={`absolute w-26 h-26 rounded-full bg-gradient-to-br ${phaseColors[phase]} flex items-center justify-center shadow-lg`}
            style={getCircleStyle(26)}
          >
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-1">{countdown}</div>
              <div className="text-xs font-medium">{phaseInstructions[phase]}</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <Card className="w-full p-4 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="text-2xl font-bold text-ifind-charcoal">{cyclesCompleted}</div>
              <div className="text-xs text-muted-foreground">Cycles</div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-ifind-charcoal">{cyclesCompleted * 14}s</div>
              <div className="text-xs text-muted-foreground">Duration</div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-ifind-charcoal">4-4-4-2</div>
              <div className="text-xs text-muted-foreground">Pattern</div>
            </div>
          </div>
        </Card>

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
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-20 w-20 rounded-full bg-gradient-to-br from-ifind-teal to-ifind-aqua hover:from-ifind-teal/90 hover:to-ifind-aqua/90 shadow-lg"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8 text-white" />
            ) : (
              <Play className="h-8 w-8 text-white ml-1" />
            )}
          </Button>
          
          <div className="h-14 w-14" />
        </div>

        {/* Instructions */}
        <Card className="w-full p-4 bg-white/80 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-ifind-aqua/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="h-5 w-5 text-ifind-aqua" />
            </div>
            <div>
              <h3 className="font-poppins font-semibold text-ifind-charcoal mb-2">How It Works</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Breathe in for 4 seconds</li>
                <li>• Hold your breath for 4 seconds</li>
                <li>• Breathe out for 4 seconds</li>
                <li>• Rest for 2 seconds</li>
                <li>• Repeat for 5-10 minutes</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Benefits */}
        <Card className="w-full p-4 bg-gradient-to-br from-ifind-teal/5 to-ifind-aqua/5 border-ifind-teal/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-ifind-teal to-ifind-aqua rounded-full flex items-center justify-center flex-shrink-0">
              <Wind className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-poppins font-semibold text-ifind-charcoal mb-2">Benefits</h3>
              <p className="text-sm text-muted-foreground">
                This breathing pattern helps reduce stress, lower heart rate, improve focus, and boost energy levels naturally.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
