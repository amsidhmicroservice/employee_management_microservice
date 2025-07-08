def handle_auth(event, context):
    try:
        print('This is event {}', event)
        auth = 'Deny'

        # Check if required fields exist
        if 'authorizationToken' not in event:
            raise ValueError("Authorization token is required")
        if 'methodArn' not in event:
            raise ValueError("Method ARN is required")

        if event['authorizationToken'] == "Nk27T19mFSTjvKFP":
            auth = 'Allow'

        auth_response = {
            "principalId": "user",
            "policyDocument": {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Action": "execute-api:Invoke",
                        "Effect": auth,
                        "Resource": event['methodArn']
                    }
                ]
            }
        }
        return auth_response
    except Exception as e:
        print(f"Error in authorization: {str(e)}")
        raise