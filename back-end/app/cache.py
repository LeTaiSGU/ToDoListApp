import redis
import os
from dotenv import load_dotenv

load_dotenv()
REDIS_URL = os.getenv("REDIS_URL")

r = redis.Redis.from_url(REDIS_URL)
