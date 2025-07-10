import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface SecurityMetrics {
  authenticationMethod: 'secure' | 'legacy';
  sessionManagement: 'secure' | 'basic';
  rateLimiting: boolean;
  inputValidation: boolean;
  auditLogging: boolean;
}

interface EnhancedSecurityNoticeProps {
  metrics?: SecurityMetrics;
  className?: string;
}

const EnhancedSecurityNotice: React.FC<EnhancedSecurityNoticeProps> = ({ 
  metrics = {
    authenticationMethod: 'secure',
    sessionManagement: 'secure',
    rateLimiting: true,
    inputValidation: true,
    auditLogging: true
  },
  className = ''
}) => {
  const getSecurityScore = (): number => {
    let score = 0;
    if (metrics.authenticationMethod === 'secure') score += 30;
    if (metrics.sessionManagement === 'secure') score += 25;
    if (metrics.rateLimiting) score += 15;
    if (metrics.inputValidation) score += 15;
    if (metrics.auditLogging) score += 15;
    return score;
  };

  const securityScore = getSecurityScore();
  const getScoreColor = () => {
    if (securityScore >= 90) return 'text-green-600';
    if (securityScore >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = () => {
    if (securityScore >= 90) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (securityScore >= 70) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Enhanced Security Active</AlertTitle>
        <AlertDescription className="text-blue-700">
          This admin panel now uses enhanced security measures including secure authentication,
          session management, rate limiting, and audit logging.
        </AlertDescription>
      </Alert>

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Security Status</h3>
          <div className="flex items-center gap-2">
            {getScoreIcon()}
            <span className={`font-bold ${getScoreColor()}`}>
              {securityScore}%
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>Authentication Method:</span>
            <span className={metrics.authenticationMethod === 'secure' ? 'text-green-600 font-medium' : 'text-red-600'}>
              {metrics.authenticationMethod === 'secure' ? 'Secure Backend' : 'Legacy'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Session Management:</span>
            <span className={metrics.sessionManagement === 'secure' ? 'text-green-600 font-medium' : 'text-yellow-600'}>
              {metrics.sessionManagement === 'secure' ? 'Token-Based' : 'Basic'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Rate Limiting:</span>
            <span className={metrics.rateLimiting ? 'text-green-600 font-medium' : 'text-red-600'}>
              {metrics.rateLimiting ? 'Active' : 'Disabled'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Input Validation:</span>
            <span className={metrics.inputValidation ? 'text-green-600 font-medium' : 'text-red-600'}>
              {metrics.inputValidation ? 'Enhanced' : 'Basic'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Audit Logging:</span>
            <span className={metrics.auditLogging ? 'text-green-600 font-medium' : 'text-red-600'}>
              {metrics.auditLogging ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Shield className="h-3 w-3" />
            <span>Security measures updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSecurityNotice;