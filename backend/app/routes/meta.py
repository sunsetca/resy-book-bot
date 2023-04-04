import json
from flask import Blueprint, request, Response
from app import logger, github_client

meta_bp = Blueprint('meta', __name__, url_prefix='/meta-api')
meta_logger = logger.getChild("meta-logger")


@meta_bp.route('/create-issue', methods=['POST'])
def create_issue():
    payload = {
        "title": request.form.get('title'),
        "body": request.form.get('body'),
        "level": int(request.form.get('level'))
    }
    meta_logger.info(f"Received a payload to create an issue {payload}")
    github_client.create_issue(payload['title'], payload['body'], payload['level'])
    return Response(status=201)
