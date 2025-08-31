const axios = require('axios');

class PythonBridge {
  constructor() {
    this.pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';
  }

  async sendMessage(message, sessionId = null) {
    try {
      const response = await axios.post(`${this.pythonServiceUrl}/api/chat`, {
        message,
        session_id: sessionId
      }, {
        timeout: 60000
      });
      
      return response.data;
    } catch (error) {
      console.error('Python service error:', error.message);
      throw new Error('Chatbot service unavailable');
    }
  }

  async downloadCsv() {
    try {
      const response = await axios.get(`${this.pythonServiceUrl}/api/download-csv`, {
        responseType: 'stream'
      });
      
      return response;
    } catch (error) {
      console.error('CSV download error:', error.message);
      throw new Error('CSV file not available');
    }
  }

  async healthCheck() {
    try {
      const response = await axios.get(`${this.pythonServiceUrl}/health`);
      return response.data;
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }
}

module.exports = new PythonBridge();