import React, { useState, useEffect } from 'react';

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 80%, 100% { opacity: 0.3; }
    40% { opacity: 1; }
  }
`;
document.head.appendChild(style);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm here to help you navigate the website. Ask me anything!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8081/chatbot/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentInput })
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { text: data.answer, sender: 'bot' }]);
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, { text: 'Sorry, I encountered an error. Please try again.', sender: 'bot' }]);
    }
    setLoading(false);
  };

  return (
    <>
      <div style={{
        position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000
      }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            border: 'none', color: 'white', fontSize: '24px',
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          💬
        </button>
      </div>

      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '20px',
          width: '350px', height: '500px', backgroundColor: 'white',
          borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', zIndex: 1000
        }}>
          <div style={{
            padding: '15px', background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white', borderRadius: '15px 15px 0 0', fontWeight: 'bold',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span>Navigation Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none', border: 'none', color: 'white',
                fontSize: '18px', cursor: 'pointer', padding: '0',
                width: '24px', height: '24px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              ✕
            </button>
          </div>
          
          <div style={{
            flex: 1, padding: '15px', overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: '12px',
            backgroundColor: '#f8f9fa'
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '8px'
              }}>
                <div style={{
                  backgroundColor: msg.sender === 'user' ? '#007bff' : 'white',
                  color: msg.sender === 'user' ? 'white' : '#333',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  maxWidth: '85%',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.sender === 'bot' && (
                    <div style={{
                      fontSize: '12px',
                      color: '#666',
                      marginBottom: '4px',
                      fontWeight: '500'
                    }}>
                      🤖 Assistant
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '8px'
              }}>
                <div style={{
                  backgroundColor: 'white',
                  color: '#666',
                  padding: '12px 16px',
                  borderRadius: '18px 18px 18px 4px',
                  fontSize: '14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    animation: 'pulse 1.5s infinite'
                  }}></div>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    animation: 'pulse 1.5s infinite 0.2s'
                  }}></div>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    animation: 'pulse 1.5s infinite 0.4s'
                  }}></div>
                  <span>Assistant is typing...</span>
                </div>
              </div>
            )}
          </div>
          
          <div style={{
            padding: '15px', borderTop: '1px solid #e9ecef',
            display: 'flex', gap: '10px', backgroundColor: 'white'
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything about the website..."
              style={{
                flex: 1, padding: '12px 16px', border: '2px solid #e9ecef',
                borderRadius: '25px', outline: 'none', fontSize: '14px',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                padding: '8px 15px', backgroundColor: '#007bff',
                color: 'white', border: 'none', borderRadius: '20px',
                cursor: 'pointer'
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;