import { useState, useEffect } from 'react';
import { aiService } from '../services';

/**
 * Format markdown-like text (bold, italic, lists, etc.)
 * @param {string} text - Text with markdown formatting
 * @returns {JSX.Element} - Formatted text
 */
const formatMessage = (text) => {
  if (!text) return null;

  // Split by newlines to preserve line breaks
  const lines = text.split('\n');
  
  return lines.map((line, lineIndex) => {
    // Process inline formatting within each line
    const parts = [];
    let currentIndex = 0;
    let key = 0;

    // Regex patterns for markdown
    const boldPattern = /\*\*(.+?)\*\*/g;
    const italicPattern = /\*(.+?)\*/g;
    
    // First, find all bold matches
    const boldMatches = [...line.matchAll(boldPattern)];
    
    if (boldMatches.length > 0) {
      boldMatches.forEach((match) => {
        // Add text before the match
        if (match.index > currentIndex) {
          const textBefore = line.slice(currentIndex, match.index);
          // Check for italics in the text before
          const italicMatches = [...textBefore.matchAll(italicPattern)];
          if (italicMatches.length > 0) {
            let italicIndex = 0;
            italicMatches.forEach((italicMatch) => {
              if (italicMatch.index > italicIndex) {
                parts.push(<span key={`${lineIndex}-${key++}`}>{textBefore.slice(italicIndex, italicMatch.index)}</span>);
              }
              parts.push(<em key={`${lineIndex}-${key++}`}>{italicMatch[1]}</em>);
              italicIndex = italicMatch.index + italicMatch[0].length;
            });
            if (italicIndex < textBefore.length) {
              parts.push(<span key={`${lineIndex}-${key++}`}>{textBefore.slice(italicIndex)}</span>);
            }
          } else {
            parts.push(<span key={`${lineIndex}-${key++}`}>{textBefore}</span>);
          }
        }
        
        // Add bold text
        parts.push(<strong key={`${lineIndex}-${key++}`}>{match[1]}</strong>);
        currentIndex = match.index + match[0].length;
      });
      
      // Add remaining text
      if (currentIndex < line.length) {
        const remaining = line.slice(currentIndex);
        const italicMatches = [...remaining.matchAll(italicPattern)];
        if (italicMatches.length > 0) {
          let italicIndex = 0;
          italicMatches.forEach((italicMatch) => {
            if (italicMatch.index > italicIndex) {
              parts.push(<span key={`${lineIndex}-${key++}`}>{remaining.slice(italicIndex, italicMatch.index)}</span>);
            }
            parts.push(<em key={`${lineIndex}-${key++}`}>{italicMatch[1]}</em>);
            italicIndex = italicMatch.index + italicMatch[0].length;
          });
          if (italicIndex < remaining.length) {
            parts.push(<span key={`${lineIndex}-${key++}`}>{remaining.slice(italicIndex)}</span>);
          }
        } else {
          parts.push(<span key={`${lineIndex}-${key++}`}>{remaining}</span>);
        }
      }
    } else {
      // No bold, just check for italics
      const italicMatches = [...line.matchAll(italicPattern)];
      if (italicMatches.length > 0) {
        italicMatches.forEach((match) => {
          if (match.index > currentIndex) {
            parts.push(<span key={`${lineIndex}-${key++}`}>{line.slice(currentIndex, match.index)}</span>);
          }
          parts.push(<em key={`${lineIndex}-${key++}`}>{match[1]}</em>);
          currentIndex = match.index + match[0].length;
        });
        if (currentIndex < line.length) {
          parts.push(<span key={`${lineIndex}-${key++}`}>{line.slice(currentIndex)}</span>);
        }
      } else {
        // No formatting, just return the line
        parts.push(<span key={`${lineIndex}-${key++}`}>{line}</span>);
      }
    }

    return (
      <div key={lineIndex}>
        {parts}
        {lineIndex < lines.length - 1 && <br />}
      </div>
    );
  });
};

/**
 * AI Chatbot Component
 * A floating chatbot widget for asking F1-related questions
 * @param {boolean} isOpen - Controlled state for whether the chat is open (optional)
 * @param {Function} onClose - Callback when the chat should be closed (optional)
 */
const AIChatbot = ({ isOpen: controlledIsOpen, onClose }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rateLimit, setRateLimit] = useState(null);

  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  
  // Sync controlled state changes
  useEffect(() => {
    if (controlledIsOpen !== undefined) {
      setInternalIsOpen(controlledIsOpen);
    }
  }, [controlledIsOpen]);

  const toggleChat = () => {
    if (onClose && isOpen) {
      onClose();
    } else if (!onClose) {
      setInternalIsOpen(!internalIsOpen);
    } else {
      setInternalIsOpen(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;

    // Add user message to chat
    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input and show loading
    setQuery('');
    setLoading(true);
    setError(null);

    try {
      // Get AI response
      const response = await aiService.chat(query);
      
      if (response.success) {
        const aiMessage = { 
          role: 'assistant', 
          content: response.data.response 
        };
        setMessages(prev => [...prev, aiMessage]);
        
        // Update rate limit info
        if (response.rateLimit) {
          setRateLimit(response.rateLimit);
        }
      } else {
        setError(response.message || 'Failed to get response');
      }
    } catch (err) {
      console.error('Error:', err);
      let errorMsg = err.response?.data?.message || 'Failed to communicate with AI';
      
      // Check if it's an API key error
      if (errorMsg.includes('API key') || errorMsg.includes('configuration')) {
        errorMsg = 'AI chatbot is currently disabled by the owner. Please try again later.';
      }
      
      setError(errorMsg);
      
      // Check if it's a rate limit error
      if (err.response?.status === 429 && err.response?.data?.rateLimit) {
        setRateLimit(err.response.data.rateLimit);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        className="chatbot-float-button" 
        onClick={toggleChat}
        aria-label="Open AI Chatbot"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="header-content">
              <h3>F1 AI Assistant</h3>
              <button 
                className="close-button" 
                onClick={toggleChat}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p>Ask me anything about Formula 1!</p>
            {rateLimit && (
              <div className="rate-limit-info">
                Queries remaining: {rateLimit.remaining}/{rateLimit.limit}
              </div>
            )}
            {messages.length > 0 && (
              <button onClick={clearChat} className="clear-btn">
                Clear Chat
              </button>
            )}
          </div>

          <div className="chatbot-messages">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <h4>👋 Welcome!</h4>
                <p>Try asking:</p>
                <ul>
                  <li>"When is the next race?"</li>
                  <li>"Tell me about Max Verstappen"</li>
                  <li>"Current championship standings?"</li>
                </ul>
              </div>
            ) : (
              messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`message ${message.role}`}
                >
                  <div className="message-content">
                    {formatMessage(message.content)}
                  </div>
                </div>
              ))
            )}
            
            {loading && (
              <div className="message assistant loading">
                <div className="message-content">
                  Thinking...
                </div>
              </div>
            )}
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="chatbot-input-form">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about F1..."
              disabled={loading}
              className="chatbot-input"
            />
            <button 
              type="submit" 
              disabled={loading || !query.trim()}
              className="chatbot-submit"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        /* Floating Chat Button */
        .chatbot-float-button {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e10600 0%, #c10500 100%);
          color: white;
          border: none;
          font-size: 32px;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(225, 6, 0, 0.5);
          z-index: 1000;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chatbot-float-button:hover {
          transform: scale(1.15);
          box-shadow: 0 8px 30px rgba(225, 6, 0, 0.7);
        }

        .chatbot-float-button:active {
          transform: scale(0.95);
        }

        /* Chat Window */
        .chatbot-window {
          position: fixed;
          bottom: 120px;
          right: 30px;
          width: 420px;
          height: 650px;
          background: #1a1a1a;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
          z-index: 999;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
          border: 1px solid rgba(225, 6, 0, 0.3);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .chatbot-window {
            width: calc(100vw - 20px);
            height: calc(100vh - 140px);
            right: 10px;
            bottom: 100px;
          }
          
          .chatbot-float-button {
            bottom: 20px;
            right: 20px;
            width: 65px;
            height: 65px;
          }
        }

        .chatbot-header {
          background: linear-gradient(135deg, #e10600 0%, #c10500 100%);
          color: white;
          padding: 20px;
          border-radius: 20px 20px 0 0;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .chatbot-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }

        .close-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.35);
        }

        .chatbot-header p {
          margin: 0 0 10px 0;
          opacity: 0.95;
          font-size: 14px;
        }

        .rate-limit-info {
          margin-top: 10px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 6px;
          font-size: 12px;
          display: inline-block;
          font-weight: 500;
        }

        .clear-btn {
          margin-top: 10px;
          padding: 7px 14px;
          background: rgba(255, 255, 255, 0.25);
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          font-size: 12px;
          margin-left: 8px;
          font-weight: 500;
          transition: background 0.2s;
        }

        .clear-btn:hover {
          background: rgba(255, 255, 255, 0.35);
        }

        .chatbot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: #1a1a1a;
        }

        .chatbot-messages::-webkit-scrollbar {
          width: 8px;
        }

        .chatbot-messages::-webkit-scrollbar-track {
          background: #0a0a0a;
        }

        .chatbot-messages::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }

        .chatbot-messages::-webkit-scrollbar-thumb:hover {
          background: #444;
        }

        .welcome-message {
          text-align: center;
          color: #999;
          padding: 20px 0;
        }

        .welcome-message h4 {
          color: #fff;
          margin: 0 0 10px 0;
        }

        .welcome-message p {
          margin: 10px 0;
          font-size: 14px;
          color: #aaa;
        }

        .welcome-message ul {
          list-style: none;
          padding: 0;
          margin-top: 15px;
        }

        .welcome-message li {
          background: #2a2a2a;
          padding: 12px;
          margin: 8px 0;
          border-radius: 8px;
          border-left: 3px solid #e10600;
          font-size: 13px;
          text-align: left;
          color: #ccc;
          transition: background 0.2s;
        }

        .welcome-message li:hover {
          background: #333;
        }

        .message {
          margin-bottom: 12px;
          display: flex;
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.user {
          justify-content: flex-end;
        }

        .message.assistant {
          justify-content: flex-start;
        }

        .message-content {
          max-width: 75%;
          padding: 12px 16px;
          border-radius: 14px;
          word-wrap: break-word;
          font-size: 14px;
          line-height: 1.6;
        }

        .message-content strong {
          font-weight: 700;
          color: inherit;
        }

        .message-content em {
          font-style: italic;
          color: inherit;
        }

        .message.assistant .message-content strong {
          color: #fff;
        }

        .message.user .message-content {
          background: linear-gradient(135deg, #e10600 0%, #c10500 100%);
          color: white;
          border-radius: 14px 14px 4px 14px;
        }

        .message.assistant .message-content {
          background: #2a2a2a;
          color: #e0e0e0;
          border: 1px solid #333;
          border-radius: 14px 14px 14px 4px;
        }

        .message.loading .message-content {
          background: #2a2a2a;
          color: #888;
          font-style: italic;
        }

        .error-message {
          background: rgba(225, 6, 0, 0.15);
          color: #ff5555;
          padding: 12px;
          border-radius: 8px;
          margin-top: 10px;
          font-size: 13px;
          border: 1px solid rgba(225, 6, 0, 0.3);
        }

        .chatbot-input-form {
          display: flex;
          gap: 10px;
          padding: 18px;
          background: #0a0a0a;
          border-top: 1px solid #333;
        }

        .chatbot-input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #333;
          border-radius: 24px;
          font-size: 14px;
          transition: all 0.2s;
          background: #1a1a1a;
          color: #fff;
        }

        .chatbot-input::placeholder {
          color: #666;
        }

        .chatbot-input:focus {
          outline: none;
          border-color: #e10600;
          background: #222;
        }

        .chatbot-submit {
          padding: 12px 24px;
          background: linear-gradient(135deg, #e10600 0%, #c10500 100%);
          color: white;
          border: none;
          border-radius: 24px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s;
        }

        .chatbot-submit:hover:not(:disabled) {
          background: linear-gradient(135deg, #ff1801 0%, #d10600 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(225, 6, 0, 0.4);
        }

        .chatbot-submit:disabled {
          background: #333;
          cursor: not-allowed;
          color: #666;
        }
      `}</style>
    </>
  );
};

export default AIChatbot;
