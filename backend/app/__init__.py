import firebase_admin
import google.auth
from dotenv import load_dotenv
from flask import Flask
from flask_wtf.csrf import CSRFProtect
from google.cloud.firestore import Client as FirestoreClient

from app.core.account_handler import AccountHandler
from app.core.resy_api_wrapper import ResyApiWrapper

load_dotenv()
import os

credentials, project = google.auth.default()
firebase_admin = firebase_admin.initialize_app(options={"projectId": project})
firestore_client = FirestoreClient(project=project, credentials=credentials)
account_handler = AccountHandler(firebase_admin, firestore_client)
resy_wrapper = ResyApiWrapper(os.environ['RESY_URL'],os.environ['RESY_API_KEY'])
csrf = CSRFProtect()

from app.core.task_handler import TaskHandler

task_handler = TaskHandler(project, os.environ['LOCATION'], os.environ['QUEUE'])


def create_app(config_class=None) -> Flask:
	app = Flask(__name__, instance_relative_config=True)

	if config_class is None:
		app.config.from_object("app.config.DevelopmentConfig")
	else:
		app.config.from_object(f"app.config.{config_class}")
	csrf.init_app(app)

	try:
		os.makedirs(app.instance_path)
	except OSError:
		pass

	with app.app_context():
		from app.routes import user, base, resy_interactions

		app.register_blueprint(user.user_bp)
		app.register_blueprint(base.base_bp)
		app.register_blueprint(resy_interactions.resy_bp)

	return app
