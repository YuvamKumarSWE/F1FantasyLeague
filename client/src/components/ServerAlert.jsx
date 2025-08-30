import { useState, useEffect } from 'react';

function ServerAlert() {
  const [alert, setAlert] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleServerSpinUp = (event) => {
      setAlert(event.detail);
      setIsVisible(true);
      
      // Auto-hide after 30 seconds
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setAlert(null), 300); // Allow fade out animation
      }, 30000);
    };

    window.addEventListener('serverSpinUp', handleServerSpinUp);
    
    return () => {
      window.removeEventListener('serverSpinUp', handleServerSpinUp);
    };
  }, []);

  const dismissAlert = () => {
    setIsVisible(false);
    setTimeout(() => setAlert(null), 300);
  };

  if (!alert) return null;

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`}>
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 backdrop-blur-sm p-4 max-w-md mx-auto shadow-lg">
        <div className="flex items-start gap-3">
          <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-300 mb-1">Server Starting Up</h4>
            <p className="text-sm text-blue-200">{alert.message}</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 bg-blue-500/20 rounded-full h-1">
                <div className="bg-blue-400 h-1 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
              <span className="text-xs text-blue-300">~30s</span>
            </div>
          </div>
          <button
            onClick={dismissAlert}
            className="text-blue-400 hover:text-blue-300 transition-colors"
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
