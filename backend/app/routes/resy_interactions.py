import json

from flask import Blueprint, Response, request

from app import resy_wrapper, task_handler
from app.forms import ResyFindVenueForm, ResyReservationWatchForm

resy_bp = Blueprint('resy', __name__, url_prefix='/resy')


@resy_bp.route('/search', methods=['POST'])
def search():
	if request.method == 'POST':
		if request.args.get('email') is None and request.headers.get('RESY-AUTH-TOKEN') is None:
			return Response(status=403)
		venue_search_form = ResyFindVenueForm()
		if venue_search_form.validate_on_submit():
			resy_wrapper.set_resy_token(request.headers.get('RESY-AUTH-TOKEN'))
			query_params = {
				"lat": venue_search_form.lat.data,
				"long": venue_search_form.long.data,
				"day": venue_search_form.day.data,
				"party_size": venue_search_form.party_size.data,
				"limit": 50
			}
			venues = resy_wrapper.find_venues(request.args.get('email'), query_params)
			return Response(response=json.dumps(venues.json()), status=200)
		else:
			print(venue_search_form.errors.items())
			return Response(response="invalid form submission", status=400)
	else:
		return Response(response="unauthorized search, please login", status=403)


@resy_bp.route('/create', methods=['GET', 'POST'])
def create_resy_task():
	resy_watch_form = ResyReservationWatchForm()
	if request.args.get('email') is None:
		return "please attach email", 403
	if resy_watch_form.validate_on_submit():
		resy_task = {
			'email': request.args.get('email'),
			'task_live_date': resy_watch_form.res_live_date.data,
			'res_day': resy_watch_form.res_day.data.strftime('%m-%d-%Y'),
			'party_size': resy_watch_form.party_size.data,
			'venue_id': resy_watch_form.venue_id.data,
			'res_times': [json.loads(res_time) for res_time in resy_watch_form.res_times.data]
		}
		task_handler.create_task(resy_task)
		return Response(response="created tasks", status=201)
	else:
		return Response(response="invalid form submission", status=400)
