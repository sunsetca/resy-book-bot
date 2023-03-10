import os
from dotenv import load_dotenv


load_dotenv()
class Config(object):
	DEBUG = False
	TESTING = False
	CSRF_ENABLED = True
	RESY_API_KEY = os.environ['RESY_API_KEY']

class ProductionConfig(Config):
	DEBUG = False

class StagingConfig(Config):
	DEVELOPMENT = True
	DEBUG = True

class DevelopmentConfig(Config):
	DEVELOPMENT = True
	DEBUG = True
	CSRF_ENABLED = False

class TestingConfig(Config):
	TESTING = True