import time
import google.generativeai as genai

MAX_TOKENS = 500
CONTEXT_WINDOW = 1000
WARNING_THRESHOLD = 0.8

def count_tokens(text, model):
    """Calculate the number of tokens in the text using the Google Gemini API."""
    response = model.count_tokens(text)
    return response.total_tokens

def get_token_usage(prompt, response_text, model):
    """Calculate the token usage for the given prompt and response using the model."""
    input_tokens = count_tokens(prompt, model)
    output_tokens = count_tokens(response_text, model)
    total_tokens = input_tokens + output_tokens
    return input_tokens, output_tokens, total_tokens

def api_request_with_retry(request_func, *args, **kwargs):
    """Perform an API request with automatic retries on rate limit errors."""
    retries = 1
    max_retries = 3
    api_error_shown = False

    while retries <= max_retries:
        try:
            return request_func(*args, **kwargs)
        except Exception as e:
            error_message = str(e).lower()

            if "429" in error_message:
                if not api_error_shown:
                    print(f"⚠ API Rate Limit Error: {e}")
                    api_error_shown = True

                wait_time = 2 ** retries
                print(f"⏳ Rate limit reached! Waiting {wait_time} seconds... ({retries}/{max_retries})")
                time.sleep(wait_time)
                retries += 1
            else:
                print(f"❌ API Error: {e}")
                return None

    print("❌ Maximum retries reached, API request failed.")
    return None

def calculate_gemini_cost(input_tokens, output_tokens):
    """
    Estimate the cost of using the Gemini API based on token usage.

    Pricing model (per 1 million tokens):
    - Input:
        * Up to 128k tokens: $0.075 per 1M tokens
        * More than 128k tokens: $0.15 per 1M tokens
    - Output:
        * Up to 128k tokens: $0.30 per 1M tokens
        * More than 128k tokens: $0.60 per 1M tokens

    Args:
        input_tokens (int): Number of input tokens
        output_tokens (int): Number of output tokens

    Returns:
        float: Total cost in USD
    """
    if input_tokens <= 128_000:
        input_cost = (input_tokens / 1_000_000) * 0.075
    else:
        input_cost = (input_tokens / 1_000_000) * 0.15

    if output_tokens <= 128_000:
        output_cost = (output_tokens / 1_000_000) * 0.30
    else:
        output_cost = (output_tokens / 1_000_000) * 0.60

    return input_cost + output_cost
