import json
import logging
from datetime import timezone, timedelta
from typing import Dict

from google.cloud.tasks_v2 import CloudTasksClient, HttpMethod
from google.protobuf import timestamp_pb2

from app import firestore_client
from .resy_client import ResyClient


class TaskHandler:
	res_req_keys = {'email', 'res_day', 'venue_id'}
	res_task_keys = {'email', 'party_size', 'res_day', 'res_times', 'payment_id', 'table_type', 'venue_id'}

	task_builder_logger = logging.getLogger(__name__)

	def __init__(self, project, location, queue):
		self.task_client = CloudTasksClient()
		self.task_parent = CloudTasksClient().queue_path(project, location, queue)

	def create_task(self, payload: Dict):
		task = {
			'app_engine_http_request': {  # Specify the type of request.
				'http_method': HttpMethod.POST,
				'headers': {"Content-type": "application/json"},
				'relative_uri': "/resy-bot/execute"
			}
		}

		# build and save payload to task
		resy_task_payload = dict(filter(lambda key: key[0] in self.res_task_keys, payload.items()))
		task['app_engine_http_request']['body'] = json.dumps(resy_task_payload).encode()

		# create and save timestamp for task
		wakeup = payload['res_live_date'] - timedelta(seconds=10)
		timestamp = timestamp_pb2.Timestamp()
		timestamp.FromDatetime(wakeup.astimezone(timezone.utc))
		task['schedule_time'] = timestamp

		resp = self.task_client.create_task(parent=self.task_parent, task=task)
		self.task_builder_logger.info(f"Created task {resp.name}")

		# save the res request attempt
		resy_task_req = dict(filter(lambda key: key[0] in self.res_req_keys, payload.items()))
		resy_task_req['task_id'] = resp.name[resp.name.rindex('/') + 1:]
		firestore_client.collection(f"reservation_task_request/${resy_task_payload['email']}/tasks").document(resy_task_req['task_id']).create(resy_task_req)
		self.task_builder_logger.info(f"Saved task request {resy_task_req['task_id']}")
		return resp

	def execute_task(self, payload: Dict, resy_client: ResyClient):
		self.task_builder_logger.info("Attempting to process task request {venue}".format(venue=payload['venue_id']))
		return resy_client.book_res(payload)

	def active_tasks(self, email: str):
		resy_req_tasks = firestore_client.collection(f"reservation_task_request/${email}/tasks").limit(10).stream()
		active_tasks = []
		for task in resy_req_tasks:
			active_tasks.append(task.to_dict())
		
		return active_tasks