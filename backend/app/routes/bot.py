import json
import logging
from flask import Blueprint, request

from app import account_handler, task_handler, resy_client

resy_bot_bp = Blueprint('resy-bot', __name__, url_prefix='/resy-bot')
bot_logger = logging.getLogger("resy-bot-logger")

@resy_bot_bp.route('/execute', methods=['POST'])
def execute():
	payload = json.loads(request.get_data().decode())
	bot_logger.info(f"Received a payload to work with {payload}")
	resy_active_res_task = dict(filter(lambda key: key[0] in task_handler.res_task_keys, payload.items()))
	resy_active_res_task['token'] = account_handler.get_resy_token(account_handler.get_user_id(payload['email']))
	resp = task_handler.execute_task(resy_active_res_task, resy_client)
	bot_logger.info("Attempted to execute a reservation request, {status}".format(status=resp.status_code))
	return resp
