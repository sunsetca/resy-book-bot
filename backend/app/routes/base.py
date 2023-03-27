from flask import Blueprint, render_template

base_bp = Blueprint('base', __name__)


@base_bp.route('/', defaults={'path': ''})
@base_bp.route('/<path:path>')
def root(path):  # put application's code here
	return render_template('index.html')
