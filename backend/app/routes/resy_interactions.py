import json

from flask import Blueprint, Response, request, jsonify
from werkzeug.datastructures import MultiDict

from app import resy_client, task_handler
from app.forms import ResyFindVenueForm, ResyReservationWatchForm

resy_bp = Blueprint('resy', __name__, url_prefix='/resy')


@resy_bp.route('/search', methods=['POST'])
def search():
	if request.method == 'POST':
		if request.args.get('email') is None and request.headers.get('RESY-AUTH-TOKEN') is None:
			return Response(status=403)
		venue_search_form = ResyFindVenueForm(request.form)
		print(venue_search_form.data)
		if venue_search_form.validate_on_submit():
			query_params = {
				"lat": venue_search_form.lat.data,
				"long": venue_search_form.lon.data,
				"day": venue_search_form.day.data,
				"party_size": venue_search_form.party_size.data,
				"limit": 50
			}
			resy_client.set_token(request.headers.get('RESY-AUTH-TOKEN'))
			venues = resy_client.find_venue(request.args.get('email'), query_params)
			return Response(response=json.dumps(venues), status=200)
		else:
			return Response(response=json.dumps({"reason": "invalid form submission", "detail": venue_search_form.errors}), status=400)
	else:
		return Response(response="unauthorized search, please login", status=403)


@resy_bp.route('/venue-details', methods=['GET'])
def venue_details():
	if request.method == 'GET':
		if request.headers.get('RESY-AUTH-TOKEN') is None:
			return Response(status=403)
		print(dict(request.headers))
		resy_client.set_token(request.headers.get('RESY-AUTH-TOKEN'))
		venue_details = resy_client.get_venue_details(request.args.get('venue_id'))
		return Response(response=json.dumps(venue_details), status=200)
	else:
		return Response(response="unauthorized search, please login", status=403)


@resy_bp.route('/create', methods=['GET', 'POST'])
def create_resy_task():
	uid = request.args.get('uid')
	if uid is None:
		return Response("please attach user id", 403)

	form_data = {**request.form, **{f"resTimes-{i}": request.form.get(f"resTimes-{i}") for i in range(5) if request.form.get(f"resTimes-{i}") is not None}}
	resy_watch_form = ResyReservationWatchForm(MultiDict(form_data))
	print(resy_watch_form.data)
	if resy_watch_form.validate_on_submit():
		res_day = resy_watch_form.resDay.data.strftime('%Y-%m-%d')
		resy_task = {
		'uid': resy_watch_form.uid.data,
		'res_live_date': resy_watch_form.resLiveDate.data,
		'res_day': res_day,
		'party_size': resy_watch_form.partySize.data,
		'venue_id': resy_watch_form.venue_id.data,
		'res_times': [f"{res_day} {res_time}" for res_time in resy_watch_form.resTimes.data]
		}
		resp = task_handler.create_task(resy_task)
		return Response(response=resp.name, status=201)
	else:
		return Response(response=json.dumps({"reason": "invalid form submission", "detail": resy_watch_form.errors}), status=400)
