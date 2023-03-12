from dotenv import load_dotenv

load_dotenv()

import os
from app import create_app

app = create_app(os.environ['ACTIVE_ENV'])

if __name__ == "__main__":
	app.run()
