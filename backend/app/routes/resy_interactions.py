import json

from flask import Blueprint, jsonify, request

from app import resy_wrapper, task_handler
from app.forms import ResyFindVenueForm, ResyReservationWatchForm

resy_bp = Blueprint('resy', __name__, url_prefix='/resy')


@resy_bp.route('/search', methods=['POST'])
def search():
	if request.method == 'POST':
		if request.args.get('email') is None or request.args.get('resy_token') is None:
			return 403
		venue_search_form = ResyFindVenueForm()
		if venue_search_form.validate_on_submit():
			resy_wrapper.set_resy_token(request.args.get('resy_token'))
			query_params = {
				"email": request.args.get('email'),
				"lat": venue_search_form.lat.data,
				"long": venue_search_form.long.data,
				"day": venue_search_form.date.data,
				"party_size": venue_search_form.party_size.data
			}
			venues = resy_wrapper.find_venues(query_params)
			return jsonify(venues), 200
		else:
			return 'invalid form submission', 400
	else:
		return 'unauthorized search, please login', 403


@resy_bp.route('/create/', methods=['GET', 'POST'])
def create_resy_task():
	resy_watch_form = ResyReservationWatchForm()
	if request.args.get('email') is None:
		return "please attach email", 403
	if resy_watch_form.validate_on_submit():
		resy_task = {
			'email': request.args.get('email'),
			'task_live_date': resy_watch_form.res_live_date.data,
			'res_date': resy_watch_form.res_live_date.data.strftime('%Y-%M-%D'),
			'party_size': resy_watch_form.party_size.data,
			'venue_id': resy_watch_form.venue_id.data,
			'res_times': [json.loads(res_time) for res_time in resy_watch_form.res_times.data]
		}
		task_handler.create_task(resy_task)
		return "created tasks", 200
	else:
		return "invalid form submission", 400
