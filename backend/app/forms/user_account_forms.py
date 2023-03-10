from flask_wtf import FlaskForm
from wtforms import StringField, EmailField, PasswordField
from wtforms.validators import InputRequired, Length


class RegistrationForm(FlaskForm):
	email = EmailField('email', validators=[InputRequired()])
	password = PasswordField('password', validators=[InputRequired(), Length(min=5)])
	first_name = StringField('first_name', validators=[InputRequired()])
	phone_number = StringField('phone_number', validators=[InputRequired()])


class LoginForm(FlaskForm):
	email = EmailField('email', validators=[InputRequired()])
	password = PasswordField('password', validators=[InputRequired(), Length(min=5)])
