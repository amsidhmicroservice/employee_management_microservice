# shared/common/decorators.py
import functools
from shared.common.logger import logger

def log_operation(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        logger.info(f"Starting {func.__name__}")
        try:
            result = func(*args, **kwargs)
            logger.info(f"Completed {func.__name__}")
            return result
        except Exception as e:
            logger.error(f"Error in {func.__name__}: {str(e)}")
            raise
    return wrapper