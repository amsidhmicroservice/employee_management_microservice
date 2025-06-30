# ======================= model/response_model.py =======================
import json

def build_success_response(status_code, body):
    return {
        "statusCode": status_code,
        "body": json.dumps(body)
    }
