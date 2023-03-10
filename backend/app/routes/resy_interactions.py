from flask import Blueprint, jsonify, make_response, request
from app import resy_wrapper
from app.forms import ResyFindVenueForm, ResyReservationWatchForm

resy_bp = Blueprint('resy', __name__, url_prefix='/resy')

@resy_bp.route('/search', methods=['GET', 'POST'])
def search():
	if request.method == 'GET':
		pass
	elif request.method == 'POST':
		if request.args.get('email') is None or request.args.get('resy_token') is None:
			return make_response(403)
		venue_search_form = ResyFindVenueForm()
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
		return make_response(403)


@resy_bp.route('/create', methods=['POST'])
def create_resy_task():
	if request.args.get('email') is None or request.args.get('resy_token') is None:
		return make_response(403)
	resy_watch_form = ResyReservationWatchForm()
