"""
Django settings for interior-studio backend.
"""

from pathlib import Path
import os
import sys

# Load environment variables from .env or .env.local if present
try:
    import dotenv
    dotenv.load_dotenv(dotenv.find_dotenv())
except ImportError:
    pass

BASE_DIR = Path(__file__).resolve().parent.parent

# Detect local CLI operations (e.g. tests or syntax checks) outside of production
is_cli_dev = any(arg in sys.argv for arg in ['test', 'check', 'makemigrations']) and not os.environ.get('RENDER_EXTERNAL_HOSTNAME')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DJANGO_DEBUG', 'False').lower() in ('true', '1', 'yes')

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')

if not SECRET_KEY:
    if DEBUG or is_cli_dev:
        # Development fallback only - explicit insecure key for local testing
        SECRET_KEY = 'django-insecure-development-key-for-local-use-only'
    else:
        from django.core.exceptions import ImproperlyConfigured
        raise ImproperlyConfigured(
            "DJANGO_SECRET_KEY environment variable is required in production (DEBUG=False)."
        )

# Environment-driven ALLOWED_HOSTS
allowed_hosts_env = os.environ.get('DJANGO_ALLOWED_HOSTS')
render_hostname = os.environ.get('RENDER_EXTERNAL_HOSTNAME')

if allowed_hosts_env:
    ALLOWED_HOSTS = [h.strip() for h in allowed_hosts_env.split(',') if h.strip()]
elif render_hostname:
    ALLOWED_HOSTS = [render_hostname]
elif DEBUG or is_cli_dev:
    # Safe local development defaults
    ALLOWED_HOSTS = ['localhost', '127.0.0.1', '[::1]']
else:
    from django.core.exceptions import ImproperlyConfigured
    raise ImproperlyConfigured(
        "DJANGO_ALLOWED_HOSTS environment variable is required in production (DEBUG=False)."
    )

# Automatically include Render external hostname if set
if render_hostname and render_hostname not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(render_hostname)

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party apps
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    
    # Local apps
    'accounts.apps.AccountsConfig',
    'enquiries.apps.EnquiriesConfig',
    'projects.apps.ProjectsConfig',
    'products.apps.ProductsConfig',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Conditionally activate WhiteNoise for production static asset serving if installed
try:
    import whitenoise  # noqa: F401
    MIDDLEWARE.insert(2, 'whitenoise.middleware.WhiteNoiseMiddleware')
    STORAGES = {
        'default': {
            'BACKEND': 'django.core.files.storage.FileSystemStorage',
        },
        'staticfiles': {
            'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
        },
    }
except ImportError:
    STORAGES = {
        'default': {
            'BACKEND': 'django.core.files.storage.FileSystemStorage',
        },
        'staticfiles': {
            'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage',
        },
    }

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# ==============================================================================
# Database Configuration
# Environment-driven PostgreSQL via DATABASE_URL with safe SQLite development fallback
# ==============================================================================
DATABASE_URL = os.environ.get('DATABASE_URL')
USE_POSTGRES = os.environ.get('USE_POSTGRES', 'False').lower() in ('true', '1', 'yes')

if DATABASE_URL:
    try:
        import dj_database_url
        DATABASES = {
            'default': dj_database_url.parse(
                DATABASE_URL,
                conn_max_age=600,
                conn_health_checks=True,
            )
        }
    except ImportError:
        from django.core.exceptions import ImproperlyConfigured
        raise ImproperlyConfigured(
            "DATABASE_URL is configured, but 'dj-database-url' is not installed in the Python environment. "
            "Please install production dependencies from requirements.txt."
        )
elif USE_POSTGRES:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('POSTGRES_DB', 'interior_studio'),
            'USER': os.environ.get('POSTGRES_USER', 'postgres'),
            'PASSWORD': os.environ.get('POSTGRES_PASSWORD', ''),
            'HOST': os.environ.get('POSTGRES_HOST', 'localhost'),
            'PORT': os.environ.get('POSTGRES_PORT', '5432'),
            'CONN_MAX_AGE': 600,
        }
    }
else:
    # Safe local development default: SQLite
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ==============================================================================
# Cloud Media Storage Integration (Optional via USE_S3)
# ==============================================================================
USE_S3 = os.environ.get('USE_S3', 'False').lower() in ('true', '1', 'yes')
if USE_S3:
    try:
        import storages  # noqa: F401
        AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
        AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')
        AWS_S3_REGION_NAME = os.environ.get('AWS_S3_REGION_NAME', 'auto')
        AWS_S3_ENDPOINT_URL = os.environ.get('AWS_S3_ENDPOINT_URL')
        AWS_DEFAULT_ACL = None
        AWS_S3_FILE_OVERWRITE = False

        STORAGES['default'] = {
            'BACKEND': 'storages.backends.s3boto3.S3Boto3Storage',
        }
    except ImportError:
        from django.core.exceptions import ImproperlyConfigured
        raise ImproperlyConfigured(
            "USE_S3 is enabled, but 'django-storages' or 'boto3' is not installed. "
            "Please install production dependencies from requirements.txt."
        )

# ==============================================================================
# Django REST Framework configuration
# ==============================================================================
REST_FRAMEWORK = {
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.MultiPartParser',
        'rest_framework.parsers.FormParser',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
}

GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', os.environ.get('GOOGLE_OAUTH_CLIENT_ID', ''))


# ==============================================================================
# CORS & CSRF Settings
# ==============================================================================
DEFAULT_FRONTEND_ORIGINS = [
    'https://designtemptation.com',
    'https://www.designtemptation.com',
    'https://design-temptation.vercel.app',
    'https://interior-studio.vercel.app',
]

cors_origins_env = os.environ.get('DJANGO_CORS_ALLOWED_ORIGINS')
if cors_origins_env:
    parsed_origins = [
        origin.strip() for origin in cors_origins_env.split(',') if origin.strip()
    ]
    CORS_ALLOWED_ORIGINS = list(dict.fromkeys(parsed_origins + DEFAULT_FRONTEND_ORIGINS))
    CORS_ALLOW_ALL_ORIGINS = False
elif DEBUG:
    # Local Next.js development origins + production origins
    CORS_ALLOWED_ORIGINS = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ] + DEFAULT_FRONTEND_ORIGINS
    CORS_ALLOW_ALL_ORIGINS = False
else:
    CORS_ALLOWED_ORIGINS = list(DEFAULT_FRONTEND_ORIGINS)
    CORS_ALLOW_ALL_ORIGINS = False

# Allow Vercel preview or branch deployments specifically for Design Temptation projects
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https:\/\/(design-temptation|interior-studio)(-[a-z0-9-]+)?\.vercel\.app$",
]

CORS_ALLOW_CREDENTIALS = True


csrf_trusted_env = os.environ.get('DJANGO_CSRF_TRUSTED_ORIGINS')
if csrf_trusted_env:
    parsed_csrf = [
        origin.strip() for origin in csrf_trusted_env.split(',') if origin.strip()
    ]
    CSRF_TRUSTED_ORIGINS = list(dict.fromkeys(parsed_csrf + DEFAULT_FRONTEND_ORIGINS))
elif DEBUG:
    CSRF_TRUSTED_ORIGINS = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ] + DEFAULT_FRONTEND_ORIGINS
else:
    CSRF_TRUSTED_ORIGINS = list(DEFAULT_FRONTEND_ORIGINS)

if render_hostname:
    render_origin = f'https://{render_hostname}'
    if render_origin not in CSRF_TRUSTED_ORIGINS:
        CSRF_TRUSTED_ORIGINS.append(render_origin)

# ==============================================================================
# Production Security Headers & Cookies (Active only when DEBUG=False)
# ==============================================================================
if not DEBUG:
    # HTTPS redirection - configurable via env for SSL termination behind reverse proxies
    SECURE_SSL_REDIRECT = os.environ.get('DJANGO_SECURE_SSL_REDIRECT', 'True').lower() in ('true', '1', 'yes')
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

    # Cookie security
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True

    # Browser security headers
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'

    # HTTP Strict Transport Security (HSTS)
    SECURE_HSTS_SECONDS = int(os.environ.get('DJANGO_SECURE_HSTS_SECONDS', '31536000'))  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
