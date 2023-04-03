import firebase_admin
import google.auth
import logging
from logging.config import dictConfig
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect
from google.cloud.firestore import Client as FirestoreClient

load_dotenv()
import os

# external imports that need to be instantiated first for internal app dependencies
credentials, project = google.auth.default()
firebase_admin = firebase_admin.initialize_app(options={"projectId": project})
firestore_client = FirestoreClient(project=project, credentials=credentials)

# internal app dependencies
from .core.resy_api_wrapper import ResyApiWrapper
from .core.account_handler import AccountHandler
from .core.task_handler import TaskHandler
from .core.resy_client import ResyClient

dictConfig({
		'version': 1,
		'formatters': {'default': {
			'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
		}},
		'handlers': {'wsgi': {
			'class': 'logging.StreamHandler',
			'stream': 'ext://flask.logging.wsgi_errors_stream',
			'formatter': 'default'
		}},
		'root': {
			'level': 'INFO',
			'handlers': ['wsgi']
		}
	})

logger = logging.getLogger(__name__)

account_handler = AccountHandler(firebase_admin, firestore_client, logger.getChild("account_handler"))
resy_wrapper = ResyApiWrapper(os.environ['RESY_URL'], os.environ['RESY_API_KEY'], logger.getChild("resy_wrapper"))
task_handler = TaskHandler(project, os.environ['LOCATION'], os.environ['QUEUE'], logger.getChild("task_handler"))
resy_client = ResyClient(resy_wrapper, logger.getChild("resy_client"))
csrf = CSRFProtect()

def create_app() -> Flask:
	app = Flask(__name__, instance_relative_config=True, static_folder='build/static', template_folder='build')
	active_env = os.environ['ACTIVE_ENV']

	if active_env is None:
		app.config.from_object("app.config.DevelopmentConfig")
	else:
		app.config.from_object(f"app.config.{active_env}")

	csrf.init_app(app)
	CORS(app)

	try:
		os.makedirs(app.instance_path)
	except OSError:
		pass

	with app.app_context():
		from .routes import user, base, resy_interactions, bot

		app.register_blueprint(user.user_bp)
		app.register_blueprint(base.base_bp)
		app.register_blueprint(resy_interactions.resy_bp)
		app.register_blueprint(bot.resy_bot_bp)

	return app
