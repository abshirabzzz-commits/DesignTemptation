"""
WSGI config for interior-studio backend.
"""

import os
from django.core.wsgi import get_wsgi_application

# Load environment variables from .env if present
try:
    import dotenv
    dotenv.load_dotenv(dotenv.find_dotenv())
except ImportError:
    pass

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = get_wsgi_application()
