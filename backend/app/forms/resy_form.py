from flask_wtf import FlaskForm
from wtforms import EmailField, DateField, DateTimeField, FloatField, FieldList, IntegerField, StringField, TimeField
from wtforms.validators import InputRequired


class ResyTokenForm(FlaskForm):
	email = EmailField('email', validators=[InputRequired()])
	resy_token = StringField('resyToken', validators=[InputRequired()])


class ResyFindVenueForm(FlaskForm):
	day = DateField('day', format='%Y-%m-%d', validators=[InputRequired()])
	party_size = IntegerField('partySize', validators=[InputRequired()])
	lat = FloatField('latitude', validators=[InputRequired()])
	lon = FloatField('longitude', validators=[InputRequired()])


class ResTimeForm(FlaskForm):
	ranking = IntegerField('ranking', validators=[InputRequired()])
	res_time = TimeField('resTime', format='%H:%M', validators=[InputRequired()])
	table_type = StringField('tableType')


class ResyReservationWatchForm(FlaskForm):
	uid = StringField('uid', validators=[InputRequired()])
	resLiveDate = DateTimeField('resLiveDate', format='%Y-%m-%d %H:%M:%S', validators=[InputRequired()])
	resDay = DateField('resDay', format='%Y-%m-%d', validators=[InputRequired()])
	partySize = IntegerField('partySize', validators=[InputRequired()])
	venue_id = IntegerField('venue_id', validators=[InputRequired()])
	resTimes = FieldList(StringField('resTimes', validators=[InputRequired()]))
