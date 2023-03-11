from flask_wtf import FlaskForm
from wtforms import EmailField, DateField, DateTimeField, FloatField, FieldList, IntegerField, PasswordField, \
	StringField, TimeField
from wtforms.validators import InputRequired


class ResyTokenForm(FlaskForm):
	email = EmailField('email', validators=[InputRequired()])
	resy_token = StringField('resy_token', validators=[InputRequired()])


class ResyFindVenueForm(FlaskForm):
	day = DateField('res_day', format='%m-%d-%Y', validators=[InputRequired()])
	party_size = IntegerField('party_size', validators=[InputRequired()])
	lat = FloatField('latitude', validators=[InputRequired()])
	long = FloatField('longitude', validators=[InputRequired()])


class ResTimeForm(FlaskForm):
	ranking = IntegerField('ranking', validators=[InputRequired()])
	res_time = TimeField('res_time', format='%H:%M', validators=[InputRequired()])
	table_type = StringField('table_type')


class ResyReservationWatchForm(FlaskForm):
	res_live_date = DateTimeField('res_live_date', format='%m-%d-%Y %H:%M:%S', validators=[InputRequired()])
	res_day = DateField('res_day', format='%m-%d-%Y', validators=[InputRequired()])
	party_size = IntegerField('party_size', validators=[InputRequired()])
	venue_id = IntegerField('venue_id')
	res_times = FieldList(StringField('res_times', validators=[InputRequired()]))
