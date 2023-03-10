from flask import Blueprint, jsonify

from app import account_handler, resy_wrapper
from app.forms.resy_form import ResyLinkForm
from app.forms.user_account_forms import RegistrationForm

user_bp = Blueprint('user', __name__, url_prefix='/user')


@user_bp.route('/register', methods=['POST'])
def register():
	reg_form = RegistrationForm()
	new_user = {
		"email": reg_form.email.data,
		"password": reg_form.password.data,
		"first_name": reg_form.first_name.data,
		"phone_number": reg_form.phone_number.data
	}
	registered_user = account_handler.create_new_user_account(new_user)
	return jsonify({"email": registered_user.email, "name": registered_user.display_name}), 200


@user_bp.route('/authorize-resy', methods=['POST'])
def authorize_resy():
	resy_form = ResyLinkForm()
	resy_user_creds = {
		"email": resy_form.email,
		"password": resy_form.password
	}
	user_id = account_handler.get_user_id(resy_user_creds['email'])
	resy_resp = resy_wrapper.auth_user(resy_user_creds)
	account_handler.save_resy_token(user_id, resy_resp['token'])
	return 200
