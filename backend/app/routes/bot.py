import json
import logging
from flask import Blueprint, request

from app import account_handler, task_handler

resy_bot_bp = Blueprint('resy-bot', __name__, url_prefix='/resy-bot')
bot_logger = logging.getLogger(__name__)

@resy_bot_bp.route('/execute', methods=['POST'])
def execute():
	payload = json.loads(request.get_data().decode())  # will it decode the whole thing?
	print(f"Received a payload to work with {payload}")
	task_body = json.loads(payload['app_engine_http_request']['body'])
	resy_active_res_task = dict(filter(lambda key: key[0] in task_handler.res_task_keys, task_body.items()))
	resy_active_res_task['token'] = account_handler.get_resy_token(account_handler.get_user_id(task_body['email']))
	resp = task_handler.execute_task(resy_active_res_task)
	bot_logger.info("Attempted to execute a reservation request, {status}".format(status=resp.status_code))
	return resp
