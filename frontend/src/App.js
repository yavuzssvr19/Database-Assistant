import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:3001';

function App() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Merhaba! Northwind veritabanı hakkında sorular sorabilirsiniz. Örneğin: "Tüm müşterileri listele" veya "En pahalı ürün hangisi?"',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csvAvailable, setCsvAvailable] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    const messageToSend = inputMessage;
    setInputMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat`, {
        message: messageToSend
      });

      const botMessage = {
        type: 'bot',
        text: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setCsvAvailable(response.data.csv_available);

    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = {
        type: 'bot',
        text: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCSV = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chat/download-csv`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'query_results.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV Download Error:', error);
      alert('CSV dosyası indirilemedi. Lütfen önce bir sorgu yapın.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const exampleQuestions = [
    "Tüm müşterileri listele",
    "En pahalı ürün hangisi?",
    "Kategorilere göre ürün sayısı",
    "En çok sipariş veren müşteri",
    "Beverages kategorisindeki ürünler"
  ];

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <h1>💬 Database Chatbot</h1>
          <p>Veritabanınızı doğal dille sorgulayın</p>
        </div>

        <div className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type} ${message.isError ? 'error' : ''}`}>
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString('tr-TR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message bot loading">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          {csvAvailable && (
            <button className="csv-button" onClick={downloadCSV}>
              📊 CSV İndir
            </button>
          )}
          
          <div className="input-box">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Sorunuzu yazın... (Enter ile gönderin)"
              disabled={isLoading}
              rows="1"
            />
            <button 
              onClick={sendMessage} 
              disabled={isLoading || !inputMessage.trim()}
              className="send-button"
            >
              {isLoading ? '⏳' : '🚀'}
            </button>
          </div>
        </div>

        <div className="examples-container">
          <p>Örnek sorular:</p>
          <div className="examples">
            {exampleQuestions.map((question, index) => (
              <button
                key={index}
                className="example-button"
                onClick={() => setInputMessage(question)}
                disabled={isLoading}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;