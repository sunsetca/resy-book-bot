from flask import Flask
from app.core.account_handler import AccountHandler
from bot.resy_api_wrapper import ResyApiWrapper
import firebase_admin
import google.auth
from google.cloud.firestore import Client as FirestoreClient

import os
credentials, project = google.auth.default()
firebase_admin = firebase_admin.initialize_app(options={"projectId": project})
firestore_client = FirestoreClient(project=project,credentials=credentials)
account_handler = AccountHandler(firebase_admin, firestore_client)
resy_wrapper = ResyApiWrapper()

def create_app(test_config=None) -> Flask:
	app = Flask(__name__, instance_relative_config=True)

	if test_config is None:
		app.config.from_object("config.DevelopmentConfig")
	else:
		app.config.from_mapping(test_config)

	try:
		os.makedirs(app.instance_path)
	except OSError:
		pass

	with app.app_context():
		from app.routes import user, base

		app.register_blueprint(user.user_bp)
		app.register_blueprint(base.base_bp)

	return app
