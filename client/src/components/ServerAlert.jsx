import { useState, useEffect } from 'react';

function ServerAlert() {
  const [alert, setAlert] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleServerSpinUp = (event) => {
      setAlert({ ...event.detail, alertType: 'spinup' });
      setIsVisible(true);
      
      // Auto-hide after 30 seconds
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setAlert(null), 300);
      }, 30000);
    };

    const handleServerError = (event) => {
      setAlert({ ...event.detail, alertType: 'error' });
      setIsVisible(true);
      
      // Auto-hide after 15 seconds for errors
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setAlert(null), 300);
      }, 15000);
    };

    window.addEventListener('serverSpinUp', handleServerSpinUp);
    window.addEventListener('serverError', handleServerError);
    
    return () => {
      window.removeEventListener('serverSpinUp', handleServerSpinUp);
      window.removeEventListener('serverError', handleServerError);
    };
  }, []);

  const dismissAlert = () => {
    setIsVisible(false);
    setTimeout(() => setAlert(null), 300);
  };

  const getAlertConfig = (alert) => {
    switch (alert.type) {
      case 'spinup':
        return {
          borderColor: 'border-blue-500/20',
          bgColor: 'bg-blue-500/10',
          iconBg: 'bg-blue-500/20',
          iconColor: 'bg-blue-400',
          textColor: 'text-blue-300',
          messageColor: 'text-blue-200',
          title: 'Server Starting Up',
          showProgress: true,
          duration: '~30s'
        };
      case 'unavailable':
        return {
          borderColor: 'border-orange-500/20',
          bgColor: 'bg-orange-500/10',
          iconBg: 'bg-orange-500/20',
          iconColor: 'bg-orange-400',
          textColor: 'text-orange-300',
          messageColor: 'text-orange-200',
          title: 'Server Unavailable',
          showProgress: false,
          duration: null
        };
      case 'network':
        return {
          borderColor: 'border-red-500/20',
          bgColor: 'bg-red-500/10',
          iconBg: 'bg-red-500/20',
          iconColor: 'bg-red-400',
          textColor: 'text-red-300',
          messageColor: 'text-red-200',
          title: 'Connection Error',
          showProgress: false,
          duration: null
        };
      case 'server_error':
        return {
          borderColor: 'border-yellow-500/20',
          bgColor: 'bg-yellow-500/10',
          iconBg: 'bg-yellow-500/20',
          iconColor: 'bg-yellow-400',
          textColor: 'text-yellow-300',
          messageColor: 'text-yellow-200',
          title: 'Server Error',
          showProgress: false,
          duration: null
        };
      default:
        return {
          borderColor: 'border-gray-500/20',
          bgColor: 'bg-gray-500/10',
          iconBg: 'bg-gray-500/20',
          iconColor: 'bg-gray-400',
          textColor: 'text-gray-300',
          messageColor: 'text-gray-200',
          title: 'Server Issue',
          showProgress: false,
          duration: null
        };
    }
  };

  if (!alert) return null;

  const config = getAlertConfig(alert);

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`}>
      <div className={`rounded-xl border ${config.borderColor} ${config.bgColor} backdrop-blur-sm p-4 max-w-md mx-auto shadow-lg`}>
        <div className="flex items-start gap-3">
          <div className={`h-5 w-5 rounded-full ${config.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
            <div className={`h-2 w-2 rounded-full ${config.iconColor} animate-pulse`}></div>
          </div>
          <div className="flex-1">
            <h4 className={`text-sm font-semibold ${config.textColor} mb-1`}>{config.title}</h4>
            <p className={`text-sm ${config.messageColor}`}>{alert.message}</p>
            {config.showProgress && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-current/20 rounded-full h-1">
                  <div className="bg-current h-1 rounded-full animate-pulse" style={{width: '60%'}}></div>
                </div>
                <span className={`text-xs ${config.textColor}`}>{config.duration}</span>
              </div>
            )}
            {alert.status && (
              <p className={`text-xs ${config.messageColor} mt-2 opacity-75`}>
                Status: {alert.status}
              </p>
            )}
            {alert.type === 'unavailable' && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className={`px-3 py-1 text-xs rounded-md ${config.bgColor} ${config.textColor} border border-current/20 hover:bg-current/20 transition-colors`}
                >
                  Refresh Page
                </button>
                <button
                  onClick={dismissAlert}
                  className={`px-3 py-1 text-xs rounded-md ${config.textColor} hover:bg-current/20 transition-colors`}
                >
                  Dismiss
                </button>
              </div>
            )}
            {alert.type === 'network' && (
              <div className="mt-3">
                <button
                  onClick={() => window.location.reload()}
                  className={`px-3 py-1 text-xs rounded-md ${config.bgColor} ${config.textColor} border border-current/20 hover:bg-current/20 transition-colors`}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
          <button
            onClick={dismissAlert}
            className={`${config.textColor} hover:opacity-75 transition-colors`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServerAlert;
