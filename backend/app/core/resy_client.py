import logging
import traceback
from typing import Dict, List, Tuple

from flask import Response
from polling import poll
from sortedcontainers import SortedList

from . import ResyApiWrapper


class ResyClient:
	find_venue_keys = {'lat', 'long', 'day', 'party_size', 'venue_id'}

	def __init__(self, resy_api: ResyApiWrapper, logger: logging.Logger):
		self.resy_api = resy_api
		self.resy_client_logger = logger

	def auth_check(self, payload: Dict) -> Response:
		self.resy_api.set_resy_token(payload['token'])
		try:
			res_list = self.get_res_list(payload['uid'])
			if res_list.status_code == 200:
				return Response(status=200)
			else:
				self.resy_client_logger.info(f"Failed user auth, recieved status code {res_list.status_code}")
				return Response(status=401)
		except Exception as e:
			self.resy_client_logger.error(f"Error occurred while checking user auth: {e}")
			return Response(status=500)

	def book_res(self, payload: Dict) -> Response:
		self.resy_api.set_resy_token(payload['token'])
		venue_query = {
			'lat': "0",
			'long': "0",
			'day': payload['res_day'],
			'party_size': payload['party_size'],
			'venue_id': payload['venue_id']
		}
		try:
			# we're always going to assume that the venue id is the exact venue we need, no exceptions
			found_venue = self.find_live_reservations(venue_query, .5).json()['results']['venues'][0]
			venue_slots = SortedList(
				[(slot['date']['start'], slot['config']['token']) for slot in found_venue['slots']],
				key=lambda s: s[0])
			priority_list = build_priority_list(venue_slots, payload['res_times'])
			details_resp = self.submit_details_request(priority_list, payload['res_day'], payload['party_size'])
			book_token = details_resp['book_token']['value']
			payment_id = details_resp['user']['payment_methods'][0]['id']
			booking_resp = self.resy_api.create_reservation(payment_id, book_token).json()
			res_list = self.get_res_list(payload['uid']).json()
			confirmed_reservation = any(booking_resp['reservation_id'] == res['reservation_id'] for res in res_list['reservations'])

		except BaseException as e:
			exception_traceback = traceback.format_exc()
			self.resy_client_logger.error("Unable to book {error}".format(error=exception_traceback))
			return Response(response=str(exception_traceback), status=500)

		self.resy_client_logger.info("Reservation status of booking for {uid} at {venue} is {res_status}"
		                             .format(uid=payload['uid'], venue=payload['venue_id'],
		                                     res_status=confirmed_reservation))

		return Response(response="Booked reservation", status=200)

	def submit_details_request(self, res_priorities: List[Tuple], day: str, party_size: int):
		details_request = {
			'day': day,
			'party_size': party_size
		}
		for priority in res_priorities:
			details_request['config_id'] = priority[1]
			details_resp = self.resy_api.get_reservation_details(details_request)
			if details_resp.status_code == 200:
				return details_resp.json()
			else:
				self.resy_client_logger.error(f"Resy response error {details_resp.status_code}, {details_resp.text}")
		self.resy_client_logger.error("Unable to receive booking details")
		return None

	def find_live_reservations(self, venue_query, retry_interval_ms):
		# set timeout to 20s to account for early live, you want to hit the window AT that time
		self.resy_client_logger.info(f"Attempting to find live reservations for: {venue_query}")
		return poll(
			lambda: self.resy_api.find_venue(venue_query),
			check_success=lambda resp: len(resp.json()['results']['venues'][0]['slots']) > 0,
			step=retry_interval_ms,
			timeout=10
		)

	def find_venue(self, uid, query):
		self.resy_client_logger.info(f"Attempting to search for available restaurants for: {uid}")
		result = self.resy_api.find_venue(query)
		if result.status_code == 200:
			json_resp = result.json()
			batched_results = {'search': [], 'primary': {}}
			if len(json_resp['results']['venues']) > 0:
				for res in json_resp['results']['venues']:
					result_lat = res['venue']['location']['geo']['lat']
					result_long = res['venue']['location']['geo']['lon']
					restaurant = res['venue']['name']
					id = res['venue']['id']['resy']
					neighborhood = res['venue']['location']['neighborhood']
					batched_results['search'].append({'id': id, 'name': restaurant, 'neighborhood': neighborhood, 'lat': result_lat, 'long': result_long})

					if (round(query.get('lat'), 3) == round(result_lat, 3)) and (round(query.get('long'), 3) == round(result_long, 3)):
						batched_results['primary'] = {'id': id, 'name': restaurant, 'neighborhood': neighborhood}
						self.resy_client_logger.info(f"Found restaurant: {restaurant} for {uid}")
			return batched_results
		else:
			self.resy_client_logger.error(f"Resy response error {result.status_code}, {result.text}")
			return None

	def get_venue_details(self, venue_id):
		self.resy_client_logger.info(f"Attempting to get details for restaurant: {venue_id}")
		result = self.resy_api.get_venue_details(venue_id)
		if result.status_code == 200:
			venue = result.json()
			venue_details = {
				'id': venue['id']['resy'],
				'name': venue['name'],
				'website': venue['links']['web'],
				'neighborhood': venue['location']['neighborhood'],
				'lat': venue['location']['latitude'],
				'lon': venue['location']['longitude']
			}
			return venue_details
		else:
			self.resy_client_logger.error(f"Resy response error {result.status_code}, {result.text}")
			return None

	def get_res_list(self, uid):
		return self.resy_api.get_res_list(uid)
	
	def set_token(self, token):
		self.resy_api.set_resy_token(token)
		return

def build_priority_list(venue_slots: SortedList, res_times: List[str]) -> List[Tuple]:
	priority_list = []
	for res in res_times:
		slot_idx = venue_slots.bisect((res,))
		if slot_idx > -1:
			priority_list.append(venue_slots[slot_idx - 1])
	return priority_list
