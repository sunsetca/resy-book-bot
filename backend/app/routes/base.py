from flask import Blueprint

base_bp = Blueprint('base', __name__)


@base_bp.route('/')
def hello_world():  # put application's code here
	return 'Hello World!'
