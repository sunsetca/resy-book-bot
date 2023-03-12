import json
import logging
from typing import Dict
from urllib.parse import urlencode

from requests import Session


class ResyApiWrapper:
	api_wrapper_logger = logging.getLogger(__name__)

	def __init__(self, resy_url, resy_api_key, resy_token=''):
		self.session = Session()
		self.session.headers.update(
			{
				'authorization': "ResyAPI api_key=\"{resy_api_key}\"".format(resy_api_key=resy_api_key),
				'user-agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
				              "(KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
				'x-origin': "https://resy.com"
			})
		self.resy_token = resy_token
		self.base_url = f"https://{resy_url}"

	def auth_user(self, user_creds):
		# basically dead because resy api refuses any attempt to auth through the api
		self.api_wrapper_logger.info(f"Attempting to authenticate user {user_creds['email']}")
		self.session.headers.update({"Content-Type": "application/x-www-form-urlencoded"})
		resy_resp = self.session.post(f"{self.base_url}/3/auth/password", data=user_creds)
		if resy_resp.status_code == 200:
			return resy_resp.json()
		self.api_wrapper_logger.error(
			f"Received {resy_resp.status_code} on request for resources. Resy Reason: {resy_resp.text}")
		return {'error': "error, view logs"}

	def set_resy_token(self, resy_token):
		self.api_wrapper_logger.info("Set resy token")
		self.resy_token = resy_token
		self.session.headers.update({"x-resy-auth-token": resy_token})

	def find_venue(self, search_request: Dict):
		self.api_wrapper_logger.info(f"Attempting to get available reservations: {search_request}")
		find_venues_url = f"{self.base_url}/4/find?" + urlencode(search_request)
		return self.session.get(url=find_venues_url)

	def get_reservation_details(self, booking_request):
		self.api_wrapper_logger.info(f"Attempting to get reservation details for {booking_request['config_id']}")
		res_details_url = f"{self.base_url}/3/details?" + urlencode(booking_request, encoding='UTF-8')
		return self.session.get(res_details_url)

	def create_reservation(self, payment_method_id, booking_token):
		self.session.headers.update({"Content-Type": "application/x-www-form-urlencoded"})
		query_params = {
			"book_token": booking_token,
			"struct_payment_method": json.dumps({'id': payment_method_id})
		}
		self.api_wrapper_logger.info(f"Attempting to create reservation for {booking_token}")
		resp = self.session.post(f"{self.base_url}/3/book", data=query_params)
		return resp

	def get_res_list(self, user_id):
		self.api_wrapper_logger.info(f"Attempting to check reservation for {user_id}")
		return self.session.get(f"{self.base_url}/3/user/reservations")
