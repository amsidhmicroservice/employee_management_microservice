import sys
import os
import logging

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../commons/layers/shared/python')))

from shared.common.logger import logger


def test_logger_is_logger_instance():
    assert isinstance(logger, logging.Logger)
