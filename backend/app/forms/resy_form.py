from flask_wtf import FlaskForm
from wtforms import EmailField, DateField, FloatField, FormField, FieldList, IntegerField, PasswordField, StringField, TimeField
from wtforms.validators import InputRequired, Length

class ResyLinkForm(FlaskForm):
	email = EmailField('email', validators=[InputRequired()])
	password = PasswordField('password', validators=[InputRequired(), Length(min=5)])


class ResyFindVenueForm(FlaskForm):
	date = DateField('res_date', validators=[InputRequired()])
	party_size = IntegerField('party_size', validators=[InputRequired()])
	lat = FloatField('latitude', validators=[InputRequired()])
	long = FloatField('longitude', validators=[InputRequired()])

class ResTimeForm(FlaskForm):
	ranking = IntegerField('ranking', validators=[InputRequired()])
	res_time = TimeField('res_time', validators=[InputRequired()])
	table_type = StringField('table_type')

class ResyReservationWatchForm(FlaskForm):
	res_live_date = DateField('res_live_date', validators=[InputRequired()])
	res_date = DateField('res_date', validators=[InputRequired()])
	party_size = IntegerField('party_size', validators=[InputRequired()])
	venue_id = IntegerField('venue_id')
	res_times = FieldList(FormField(ResTimeForm))
