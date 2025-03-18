
import { useState } from 'react';
import AgoraRTC, { IAgoraRTCClient, IMicrophoneAudioTrack, ICameraVideoTrack } from 'agora-rtc-sdk-ng';

// Setup Agora client
const APP_ID = "your-agora-app-id"; // Replace with actual Agora App ID

export const useAgora = () => {
  const createClient = () => {
    return AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  };

  const createMicrophoneTrack = async () => {
    return await AgoraRTC.createMicrophoneAudioTrack();
  };

  const createCameraTrack = async () => {
    return await AgoraRTC.createCameraVideoTrack();
  };

  // Generate a token for joining a channel
  const generateToken = (channelName: string) => {
    // In a production app, token should be generated on the server
    // This is a placeholder for demo purposes only
    return `006${APP_ID}${Date.now()}${channelName}`;
  };

  // Generate a unique channel name for a call between expert and user
  const generateChannelName = (expertId: string, userId: string) => {
    return `call_${expertId}_${userId}_${Date.now()}`;
  };

  return {
    createClient,
    createMicrophoneTrack,
    createCameraTrack,
    generateToken,
    generateChannelName
  };
};
