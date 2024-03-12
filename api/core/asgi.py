"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import chat.routing
import os

from django.core.asgi import get_asgi_application

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from channels.auth import AuthMiddlewareStack

from django_channels_jwt_auth_middleware.auth import JWTAuthMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

django_asgi_app = get_asgi_application()

application=ProtocolTypeRouter({
    'http':django_asgi_app,
    'websocket': AllowedHostsOriginValidator(JWTAuthMiddlewareStack(URLRouter(chat.routing.websocket_urlpatterns)))

})
