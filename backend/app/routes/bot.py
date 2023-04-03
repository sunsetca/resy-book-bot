import json

from flask import Blueprint, request, Response

from app import account_handler, task_handler, resy_client, logger

resy_bot_bp = Blueprint('resy-bot', __name__, url_prefix='/resy-bot')
bot_logger = logger.getChild("resy-bot-logger")


@resy_bot_bp.route('/execute', methods=['POST'])
def execute():
	payload = json.loads(request.get_data().decode())
	bot_logger.info(f"Received a payload to work with {payload}")
	resy_active_res_task = dict(filter(lambda key: key[0] in task_handler.res_task_keys, payload.items()))
	resy_active_res_task['token'] = account_handler.get_resy_token(resy_active_res_task['uid'])
	resy_active_res_task['email'] = account_handler.get_user_email(resy_active_res_task['uid'])
	resp = task_handler.execute(resy_active_res_task, resy_client)
	bot_logger.info("Attempted to execute a reservation request, {status}".format(status=resp.status_code))
	task_id = request.headers.get('X-CloudTasks-TaskName').split('/')[-1]
	account_handler.delete_reservation_request(resy_active_res_task['uid'], task_id)
	bot_logger.info("Deleted the reservation request from the firestore")
	return resp


@resy_bot_bp.route('/check-auth', methods=['POST'])
def check_auth():
	payload: dict = json.loads(request.get_data().decode())
	bot_logger.info(f"Received a payload to check auth {payload}")
	auth_task = {
		'uid': payload['uid'],
		'task_type': payload['task_type'],
		'token': account_handler.get_resy_token(payload['uid'])
	}
	resp = task_handler.execute(auth_task, resy_client)
	bot_logger.info("Attempted to execute an auth check request, {status}".format(status=resp.status_code))
	if resp.status_code == 401:
		account_handler.remove_resy_token(payload['uid'])
		body = f"""
		Hello, <br>
		Your Resy token has expired, please <a href="https://rip-resy.uc.r.appspot.com/user/{payload['uid']}/resy-auth/">login to your account</a> and update your token.
		<br>
		<br>
		Thank you,<br>
		Rip Resy
		"""
		account_handler.send_email(account_handler.get_user_email(payload['uid']), "RIP Resy Update" ,body)
		return Response(status=200)
	elif resp.status_code == 500:
		bot_logger.info("An error occurred when attempting to check auth, server issue, check logs")
		return resp
	else:
		return resp