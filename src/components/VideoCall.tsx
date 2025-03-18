
import React, { useState, useEffect } from 'react';
import { IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoCallProps {
  client: any;
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack] | null;
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
  channelName: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ client, tracks, setStart, channelName }) => {
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);
  
  useEffect(() => {
    // Function to initialize users
    const initUsers = async () => {
      client.on('user-published', async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
        await client.subscribe(user, mediaType);
        
        if (mediaType === 'video') {
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
        
        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
      });

      client.on('user-unpublished', (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
        if (mediaType === 'audio') {
          user.audioTrack?.stop();
        }
        if (mediaType === 'video') {
          setUsers((prevUsers) => {
            return prevUsers.filter((u) => u.uid !== user.uid);
          });
        }
      });

      client.on('user-left', (user: IAgoraRTCRemoteUser) => {
        setUsers((prevUsers) => {
          return prevUsers.filter((u) => u.uid !== user.uid);
        });
      });
    };

    initUsers();
    
    return () => {
      client.removeAllListeners();
    };
  }, [client]);

  useEffect(() => {
    if (tracks) {
      const [audioTrack, videoTrack] = tracks;
      
      // Set initial track states
      setIsMuted(audioTrack.muted);
      setIsVideoDisabled(videoTrack.muted);
    }
  }, [tracks]);
  
  const toggleMute = async () => {
    if (tracks) {
      const [audioTrack] = tracks;
      await audioTrack.setMuted(!isMuted);
      setIsMuted(!isMuted);
    }
  };
  
  const toggleVideo = async () => {
    if (tracks) {
      const [, videoTrack] = tracks;
      await videoTrack.setMuted(!isVideoDisabled);
      setIsVideoDisabled(!isVideoDisabled);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        {/* Local Video */}
        <div className="relative rounded-lg overflow-hidden bg-slate-900 aspect-video">
          {tracks && !isVideoDisabled && (
            <div className="h-full w-full">
              {/* Use the videoTrack's play method instead of AgoraVideoPlayer */}
              <div id="local-video" ref={(el) => {
                if (el && tracks) {
                  tracks[1].play(el);
                }
              }} className="h-full w-full"></div>
            </div>
          )}
          {(!tracks || isVideoDisabled) && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <VideoOff className="h-12 w-12 text-white/50" />
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 text-xs rounded">
            You
          </div>
        </div>
        
        {/* Remote Videos */}
        {users.length > 0 && users.map((user) => (
          <div key={user.uid} className="relative rounded-lg overflow-hidden bg-slate-900 aspect-video">
            {user.videoTrack && (
              <div className="h-full w-full">
                {/* Use the videoTrack's play method */}
                <div id={`remote-video-${user.uid}`} ref={(el) => {
                  if (el && user.videoTrack) {
                    user.videoTrack.play(el);
                  }
                }} className="h-full w-full"></div>
              </div>
            )}
            {!user.videoTrack && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                <VideoOff className="h-12 w-12 text-white/50" />
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 text-xs rounded">
              Remote User
            </div>
          </div>
        ))}
        
        {users.length === 0 && (
          <div className="relative rounded-lg overflow-hidden bg-slate-900 aspect-video">
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <p className="text-white/70">Waiting for others to join...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="flex justify-center space-x-4 mt-4">
        <Button 
          onClick={toggleMute} 
          variant="outline" 
          className={`rounded-full p-3 ${isMuted ? 'bg-red-100 border-red-300' : ''}`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        
        <Button 
          onClick={toggleVideo} 
          variant="outline" 
          className={`rounded-full p-3 ${isVideoDisabled ? 'bg-red-100 border-red-300' : ''}`}
          title={isVideoDisabled ? "Turn on camera" : "Turn off camera"}
        >
          {isVideoDisabled ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default VideoCall;
