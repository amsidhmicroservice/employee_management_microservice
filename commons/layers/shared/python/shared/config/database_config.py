# ======================= config/database_config.py =======================
import boto3

def get_dynamodb_resource():
    """
    Returns a shared DynamoDB resource object.
    This allows DAOs to reuse a single client.
    """
    return boto3.resource("dynamodb")