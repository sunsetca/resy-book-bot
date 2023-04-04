import json

from flask import Blueprint, Response, request

from app import account_handler, resy_client, task_handler
from app.forms.resy_form import ResyTokenForm
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
	if registered_user is None:
		return Response("User already exists", 400)
	return Response(response=json.dumps({"email": registered_user.email, "name": registered_user.display_name}),
	                status=201)


@user_bp.route('/authorize-resy', methods=['POST'])
def authorize_resy():
	resy_form = ResyTokenForm()
	resy_user_creds = {
		"email": resy_form.email.data,
		"resy_token": resy_form.resy_token.data
	}
	user_id = account_handler.get_user_id(resy_user_creds['email'])
	account_handler.save_resy_token(user_id, resy_user_creds['resy_token'])
	return Response(status=201)


@user_bp.route('/delete-resy-token', methods=['POST'])
def delete_resy_token():
	email = request.args.get('email')
	user_id = account_handler.get_user_id(email)
	account_handler.remove_resy_token(user_id)
	return Response(status=200)


@user_bp.route('/user-profile', methods=['GET'])
def get_user_profile():
	user_id = request.args.get('userId')
	active_token = account_handler.valid_resy_token(user_id)
	tasks = task_handler.active_tasks(user_id)

	return Response(response=json.dumps({'tasks': tasks, 'activeToken': active_token}), status=200)


@user_bp.route('/check-token', methods=['GET'])
def check_token():
	user_id = request.args.get('userId')
	resy_token = account_handler.get_resy_token(user_id)
	resp = resy_client.auth_check({"token": resy_token, "uid": user_id})
	if resp.status_code == 200:
		return Response(status=200)
	else:
		account_handler.remove_resy_token(user_id)
		return Response(status=401)
