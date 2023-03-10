from typing import Dict
import requests, logging
import os
from importlib import import_module
from dotenv import load_dotenv
load_dotenv()

class ResyApiWrapper:
	base_url = "https://api.resy.com"
	auth_url = f"{base_url}/3/auth/mobile"
	get_details_url = f"{base_url}/3/details"
	book_res_url = f"{base_url}/3/book"
	find_res_url = f"{base_url}/4/find"
	api_wrapper_logger = logging.getLogger(__name__)
	config = getattr(import_module('bot.bot_config'), os.environ['ACTIVE_ENV'])

	def __init__(self, resy_token=''):
		self.session = requests.session()
		self.session.headers.update({"Authorization": f"ResyAPI api_key={self.config.RESY_API_KEY}"})
		self.resy_token = resy_token

	def auth_user(self, user_creds):
		self.api_wrapper_logger.info(f"Attempting to authenticate user {user_creds.email}")
		return self.session.post(self.auth_url, data=user_creds)

	def set_resy_token(self, resy_token):
		self.api_wrapper_logger.info("Set resy token")
		self.resy_token = resy_token

	def find_venues(self, search_request: Dict):
		self.api_wrapper_logger.info(f"Attempting to get available reservations for {search_request['email']}")
		return self.session.get(self.find_res_url, data=search_request)

	def get_reservation_details(self, date, party_size, config_id):
		query_params = {
			"day": date,
			"party_size": party_size,
			"config_id": config_id
		}
		self.api_wrapper_logger.info(f"Attempting to get reservation details for {config_id}")
		return self.session.get(self.get_details_url, data=query_params)

	def create_reservation(self, payment_method_id, booking_token):
		query_params = {
			"book_token": booking_token,
			"struct_payment_method": "{id: {payment_method_id}}".format(payment_method_id=payment_method_id)
		}
		self.api_wrapper_logger.info(f"Attempting to create reservation for {booking_token}")
		return self.session.post(self.book_res_url, data=query_params)
