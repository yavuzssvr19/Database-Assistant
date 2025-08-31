from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from chatbot_service import ChatbotService

app = Flask(__name__)
CORS(app)

chatbot_service = ChatbotService()

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message', '')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
            
        response = chatbot_service.process_message(message)
        
        return jsonify({
            'response': response,
            'csv_available': chatbot_service.has_csv_file()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download-csv', methods=['GET'])
def download_csv():
    try:
        csv_path = chatbot_service.get_last_csv_path()
        if csv_path and os.path.exists(csv_path):
            return send_file(csv_path, as_attachment=True)
        return jsonify({'error': 'No CSV file available'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)