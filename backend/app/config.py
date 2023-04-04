import os

from dotenv import load_dotenv

load_dotenv()


class Config(object):
	DEBUG = False
	TESTING = False
	WTF_CSRF_ENABLED = True
	RESY_URL = os.environ['RESY_URL']
	SECURITY_CSRF_COOKIE_NAME = os.environ['SECURITY_CSRF_COOKIE_NAME']
	SECRET_KEY = os.urandom(32)
	RESY_API_KEY = os.environ['RESY_API_KEY']
	LOCATION = os.environ['LOCATION']
	QUEUE = os.environ['QUEUE']
	GITHUB_TOKEN = os.environ['GITHUB_TOKEN']
	GITHUB_REPO = os.environ['GITHUB_REPO']
	RESY_BOT_EMAIL = os.environ['RESY_BOT_EMAIL']
	RESY_BOT_DOMAIN = os.environ['RESY_BOT_DOMAIN']


class ProductionConfig(Config):
	DEBUG = False


class StagingConfig(Config):
	DEVELOPMENT = True
	DEBUG = True


class DevelopmentConfig(Config):
	DEVELOPMENT = True
	DEBUG = True
	WTF_CSRF_ENABLED = False


class TestingConfig(Config):
	TESTING = True
	WTF_CSRF_ENABLED = False
