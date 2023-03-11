import json

from flask import Blueprint, request, Response

from app import account_handler, task_handler

resy_bot_bp = Blueprint('resy-bot', __name__, url_prefix='resy-bot')


@resy_bot_bp.route('/execute', methods=['POST'])
def execute():
	payload = json.loads(request.get_data().decode())  # will it decode the whole thing?
	print(f"Received a payload to work with {payload}")
	task_body = json.loads(payload['app_engine_http_request']['body'])
	resy_active_res_task = dict(filter(lambda key: key[0] in task_handler.res_task_keys, task_body.items()))
	resy_active_res_task['token'] = account_handler.get_resy_token(account_handler.get_user_id(task_body['email']))

	if task_handler.execute_task(resy_active_res_task):
		return Response("success", 200)
	else:
		return Response("failure", 500)
