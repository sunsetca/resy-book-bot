from flask import Blueprint, jsonify, make_response, request
from app import resy_wrapper
from app.forms import ResyFindVenueForm, ResyReservationWatchForm

resy_bp = Blueprint('resy', __name__, url_prefix='/resy')

@resy_bp.route('/search', methods=['POST'])
def search():
	if request.method == 'POST':
		if request.args.get('email') is None or request.args.get('resy_token') is None:
			return make_response(403)
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
			return make_response(200, jsonify(venues))
		else:
			return make_response(400, 'invalid form submission')
	else:
		return make_response(403, 'unauthorized search, please login')


@resy_bp.route('/create', methods=['POST'])
def create_resy_task():
	if request.args.get('email') is None or request.args.get('resy_token') is None:
		return make_response(403)
	resy_watch_form = ResyReservationWatchForm()
	if resy_watch_form.validate_on_submit():
		resy_wrapper.set_resy_token(request.args.get('resy_token'))
		query_params = {
			"task_live_date": resy_watch_form.res_live_date.data,
			"res_req_date": resy_watch_form.res_date.data,
			"party_size": resy_watch_form.party_size.data,
			"venue_id": resy_watch_form.venue_id.data,
			"res_times": [res_time for res_time in resy_watch_form.venue_id.data]
		}

		return make_response(200, 'created tasks')
	else:
		return make_response(400, 'invalid form submission')
