import time
import google.generativeai as genai

# 🔥 **TOKEN ve RATE LIMIT Yönetimi için Global Değişkenler**
MAX_TOKENS = 500  # Her istekte en fazla 500 token üretilebilir
CONTEXT_WINDOW = 1000  # Toplam 1000 tokenlık bir pencere var
WARNING_THRESHOLD = 0.8  # %80 dolduğunda uyarı ver

# 📌 **Gemini Modelini Başlat**


def count_tokens(text, model):
    """Google Gemini API kullanarak metindeki token sayısını hesaplar."""
    response = model.count_tokens(text)
    return response.total_tokens  # Gerçek token sayısı döndürülür

def get_token_usage(prompt, response_text, model):
    """Girilen metnin ve model yanıtının token kullanımını hesaplar."""
    input_tokens = count_tokens(prompt, model)
    output_tokens = count_tokens(response_text,model)
    total_tokens = input_tokens + output_tokens
    return input_tokens, output_tokens, total_tokens


# 📌 **API Talebi İçin Otomatik Retry (Rate Limit Hatasına Karşı)**
def api_request_with_retry(request_func, *args, **kwargs):
    retries = 1
    max_retries = 3
    api_error_shown = False  # API hatası mesajını sadece bir kez yazdırmak için

    while retries <= max_retries:
        try:
            return request_func(*args, **kwargs)
        except Exception as e:
            error_message = str(e).lower()

            if "429" in error_message:  # Rate Limit Hatası
                if not api_error_shown:
                    print(f"⚠ API Rate Limit Hatası: {e}")
                    api_error_shown = True

                wait_time = 2 ** retries  # Exponential backoff
                print(f"⏳ API sınırına ulaşıldı! {wait_time} saniye bekleniyor... ({retries}/{max_retries})")
                time.sleep(wait_time)
                retries += 1
            else:
                print(f"❌ API Hatası: {e}")
                return None

    print("❌ Maksimum tekrar sayısına ulaşıldı, API isteği başarısız oldu.")
    return None

def calculate_gemini_cost(input_tokens, output_tokens):
    """
    Gemini API kullanımının tahmini maliyetini hesaplar.
    
    Pricing model (Per 1 Million Tokens):
    - Input:
        * Up to 128k tokens: $0.075 / 1M tokens
        * More than 128k tokens: $0.15 / 1M tokens
    - Output:   
        * Up to 128k tokens: $0.30 / 1M tokens
        * More than 128k tokens: $0.60 / 1M tokens
        
    Args:
        input_tokens (int): Giriş token sayısı
        output_tokens (int): Çıkış token sayısı
        
    Returns:
        float: Toplam maliyet (USD)
    """
    # Calculate the cost of input tokens:
    if input_tokens <= 128_000:
        input_cost = (input_tokens / 1_000_000) * 0.075
    else:
        input_cost = (input_tokens / 1_000_000) * 0.15

    # Calculate the output cost:
    if output_tokens <= 128_000:
        output_cost = (output_tokens / 1_000_000) * 0.30
    else:
        output_cost = (output_tokens / 1_000_000) * 0.60

    return input_cost + output_cost