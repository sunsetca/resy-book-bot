from typing import Dict, List, Tuple
from sortedcontainers import SortedList
import logging
from . import ResyApiWrapper
from flask import Response


class ResyClient:
	find_venue_keys = {'lat', 'long', 'day', 'party_size', 'venue_id'}
	resy_client_logger = logging.getLogger(__name__)

	def __init__(self, resy_api: ResyApiWrapper):
		self.resy_api = resy_api

	def book_res(self, payload: Dict) -> Response:
		venue_query = {
			'lat': "0",
			'long': "0",
			'day': payload['res_day'],
			'party_size': payload['party_size'],
			'venue_id': payload['venue_id']
		}
		try:
			found_venue = self.resy_api.find_venue(payload['email'], venue_query)
			venue_slots = SortedList([(slot['start'], slot['config']['token']) for slot in found_venue['slots']],
			                         key= lambda s:s[0])
			priority_list = self.build_priority_list(venue_slots, payload['res_times'])
			details_resp = self.submit_details_request(priority_list, payload['res_day'], payload['party_size'])
			book_token = details_resp['book_token']['value']
			payment_id = details_resp['user']['payment_methods']['id']
			booking_resp = self.resy_api.create_reservation(payment_id, book_token).json()
			res_list = self.resy_api.get_res_list(payload['email']).json()
			confirmed_reservation = any(booking_resp['resy_token'] == res['resy_token'] for res in res_list['reservations'])

		except BaseException as e:
			self.resy_client_logger.error("Unable to book {error}".format(error=str(e)))
			return Response(response=str(e), status=500)

		self.resy_client_logger.info("Reservation status of booking for {email} at {venue} is {res_status}"
		                             .format(email=payload['email'], venue=payload['venue_id'],
		                                     res_status=confirmed_reservation))

		return Response(response="Booked reservation", status=200)


	def build_priority_list(self, venue_slots: SortedList, res_times: List[str]) -> List[Tuple]:
		priority_list = []
		for res in res_times:
			slot_idx = venue_slots.bisect((res,))
			if slot_idx > -1:
				priority_list.append(venue_slots[slot_idx + 1])
		return priority_list


	def submit_details_request(self, res_priorities: List[Tuple], day: str, party_size: int):
		details_request = {
			'day': day,
			'party_size': party_size
		}
		for priority in res_priorities:
			details_request['config-id'] = priority[1]
			details_resp = self.resy_api.get_reservation_details(details_request)
			if details_resp.status_code == 200:
				return details_resp.json()
		self.resy_client_logger.error("Unable to receive booking details")
		return None
