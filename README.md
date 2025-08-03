# 🤖 SQLite Multi-Agent Chatbot System

An advanced multi-agent system that queries SQLite databases using natural language with modern LLM technologies. This project offers a professional database interface equipped with **grounding techniques** and **comprehensive security measures**.

## 🎯 Project Purpose

This system enables users to express complex database queries in natural language without requiring SQL knowledge. It provides secure, accurate, and user-friendly database interaction through a multi-agent architecture using Google Gemini API.

## 🏗️ Multi-Agent Architecture

### 🔥 **Agent Structure**
- **SQL Agent**: Converts natural language queries to SQL
- **Natural Language Agent**: Transforms JSON results into natural language responses  
- **Orchestrator Agent**: Coordinates all processes and performs security controls

### 🎯 **Grounding Techniques**

#### 1. **Schema-Based Grounding**
```python
# Database schema embedded in agents
database_schema = """
- Categories: CategoryID, CategoryName, Description
- Customers: CustomerID, CustomerName, ContactName, Address, City, PostalCode, Country
- Products: ProductID, ProductName, SupplierID, CategoryID, Unit, Price
# ... other tables
"""
```

#### 2. **Structured JSON Responses**
```python
# Gemini API with JSON schema for structured responses
"response_schema": {
    "type": "object",
    "properties": {
        "sql_query": {"type": "string"},
        "explanation": {"type": "string"}
    }
}
```

#### 3. **Real-time Data Grounding**
- SQL results are structured in JSON format
- NL Agent converts real database results to natural language
- Prevents hallucination, uses only real data

## 🛡️ Security Techniques

### 🔐 **Layered Security Approach**

#### 1. **Input Sanitization**
```python
def sanitize_input(text):
    # SQL injection pattern detection
    sql_patterns = [r"--", r"DROP\s+TABLE", r"DELETE\s+FROM", ...]
    
    # Prompt injection protection  
    GUARDLIST = [r"system prompt", r"ignore instructions", ...]
    
    # Dangerous character removal
    text = re.sub(r"[;'\"\(\)]", " ", text)
```

#### 2. **SQL Query Validation**
```python
def validate_sql_query(sql_query):
    # Allow only SELECT queries
    if not clean_query.startswith('SELECT'):
        return False
        
    # Block dangerous commands
    dangerous_patterns = [r'\bINSERT\b', r'\bUPDATE\b', r'\bDELETE\b', ...]
```

#### 3. **Multi-Layer Prompt Injection Protection**
- **Agent-level protection**: Each agent performs its own security control
- **Pattern-based detection**: Detects known injection patterns
- **History-based analysis**: Identifies continuous injection attempts
- **Content filtering**: Automatically filters harmful content

#### 4. **Rate Limiting & Error Handling**
```python
def api_request_with_retry(request_func, *args, **kwargs):
    # Retry with exponential backoff
    # Rate limit protection
    # Graceful error handling
```

## 🎨 Interface and Application

### **Gradio Web Interface**
- **Modern Chat UI**: Real-time chat interface
- **Smart CSV Download**: Automatic CSV download button
- **Example Queries**: Ready-to-use sample queries
- **Responsive Design**: Mobile-compatible design

### **Key Features**
- 🔄 **Real-time Processing**: Instant query processing
- 📊 **Auto CSV Export**: Automatic CSV file creation
- 🎯 **Intelligent Responses**: Context-aware natural language responses
- 🛡️ **Security First**: Security-focused design

## 🚀 Provided Services

### 📋 **Core Services**

#### 1. **Natural Language to SQL Translation**
- Turkish and English support
- Complex JOIN queries  
- Aggregate functions
- Subquery support

#### 2. **Intelligent Data Processing**
```
User Query → SQL Agent → Database → JSON → NL Agent → Natural Language Response
```

#### 3. **Data Export Services**
- **CSV Export**: Automatic CSV file creation
- **Download Management**: Smart download button
- **Format Optimization**: Pandas-optimized format

#### 4. **Performance Monitoring**
- **Token Usage Tracking**: API usage tracking
- **Cost Calculation**: Cost calculation
- **Error Analytics**: Error analysis and reporting

### 🎯 **Advanced Features**

#### **Multi-Language Support**
- Turkish query → SQL → Turkish response
- English query → SQL → English response

#### **Schema Intelligence**
- Automatic table/column mapping
- Smart JOIN suggestions
- Data type validation

#### **Error Recovery**
- Graceful error handling
- User-friendly error messages
- Automatic retry mechanisms

## 🛠️ Installation and Usage

### **Requirements**
```bash
pip install gradio google-generativeai python-dotenv pandas sqlite3
```

### **Environment Setup**
```bash
# Create .env file
GEMINIAPI=your_gemini_api_key
DB_PATH=path_to_your_database.db
```

### **Running**
```bash
python chat_bot.py
```

### **Example Usage**
```
👤 "Who is the supplier of the highest priced product?"
🤖 "The highest priced product is Côte de Blaye and its supplier is Aux joyeux ecclésiastiques."

👤 "Show all products in the 'Beverages' category."  
🤖 "Here are all products in the Beverages category: Chai, Chang, Guaraná Fantástica..."
```

## 📊 Technical Details

### **API Integration**
- **Google Gemini 2.5 Pro**: Main LLM model
- **Structured Output**: Controlled output with JSON schema
- **Safety Settings**: Active content filtering

### **Database Support**
- **SQLite**: Primary database engine
- **Schema Validation**: Automatic schema validation
- **Query Optimization**: Performance optimization

### **Security Architecture**
```
User Input → Sanitization → Agent Processing → SQL Validation → Database → Response
     ↓              ↓              ↓              ↓           ↓         ↓
   Filter      Pattern Check   Role-based     SELECT-only   Secure    Safe Output
   Injection   Detection       Security       Validation    Execute   Delivery
```

## 📁 Project Structure

```
├── chat_bot.py              # Main application (Multi-agent system)
├── calculate_token.py       # Token calculation utilities  
├── .env                     # Environment variables
├── query_results/           # CSV export files
└── README.md               # This file
```

## 🔧 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📜 License

MIT License - See [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- **Google Gemini API**: Powerful LLM infrastructure
- **Gradio**: Modern web interface
- **SQLite**: Reliable database engine

---

**🔥 This project is a practical implementation of LLM grounding techniques and security best practices!**