
import React, { createContext, useContext } from 'react';

export interface AgoraConfiguration {
  appId: string;
  certificate?: string;
  enableDualStream: boolean;
  enableCloudRecording: boolean;
  enableNetworkQualityReport: boolean;
  maxParticipants: number;
  videoProfile: {
    width: number;
    height: number;
    framerate: number;
    bitrate: number;
  };
  audioProfile: {
    sampleRate: number;
    bitrate: number;
    channels: number;
  };
}

const defaultConfig: AgoraConfiguration = {
  appId: '9b3ad657507642f98a52d47893780e8e', // Match backend App ID
  enableDualStream: true,
  enableCloudRecording: true,
  enableNetworkQualityReport: true,
  maxParticipants: 2,
  videoProfile: {
    width: 1280,
    height: 720,
    framerate: 30,
    bitrate: 1000
  },
  audioProfile: {
    sampleRate: 48000,
    bitrate: 128,
    channels: 2
  }
};

interface AgoraConfigContextType {
  config: AgoraConfiguration;
  updateConfig: (updates: Partial<AgoraConfiguration>) => void;
  isConfigured: boolean;
}

const AgoraConfigContext = createContext<AgoraConfigContextType | null>(null);

export const useAgoraConfig = () => {
  const context = useContext(AgoraConfigContext);
  if (!context) {
    throw new Error('useAgoraConfig must be used within AgoraConfigProvider');
  }
  return context;
};

interface AgoraConfigProviderProps {
  children: React.ReactNode;
  appId?: string;
  initialConfig?: Partial<AgoraConfiguration>;
}

export const AgoraConfigProvider: React.FC<AgoraConfigProviderProps> = ({
  children,
  appId = '9b3ad657507642f98a52d47893780e8e', // Match backend App ID
  initialConfig = {}
}) => {
  const [config, setConfig] = React.useState<AgoraConfiguration>({
    ...defaultConfig,
    ...initialConfig,
    appId: appId || initialConfig.appId || '9b3ad657507642f98a52d47893780e8e'
  });

  const updateConfig = React.useCallback((updates: Partial<AgoraConfiguration>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const isConfigured = Boolean(config.appId);

  const value: AgoraConfigContextType = {
    config,
    updateConfig,
    isConfigured
  };

  return (
    <AgoraConfigContext.Provider value={value}>
      {children}
    </AgoraConfigContext.Provider>
  );
};

export default AgoraConfigProvider;
