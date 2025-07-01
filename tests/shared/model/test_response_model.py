import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../commons/layers/shared/python')))

from shared.model.response_model import build_success_response
import json


def test_build_success_response():
    resp = build_success_response(200, {"message": "OK"})
    assert resp["statusCode"] == 200
    assert json.loads(resp["body"]) == {"message": "OK"}
