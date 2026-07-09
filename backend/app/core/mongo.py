"""
MongoDB client singleton
"""
from functools import lru_cache

from pymongo import MongoClient

from app.core.config import settings


@lru_cache(maxsize=1)
def get_mongo_client() -> MongoClient:
    return MongoClient(settings.MONGO_URL)


def get_mongo_db():
    """FastAPI dependency — returns the MongoDB database object."""
    client = get_mongo_client()
    return client[settings.MONGO_DB]
