from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def health(request):
    payload = {
        'ok': True,
    }
    # Avoid leaking deployment details in production.
    if settings.DEBUG:
        payload['debug'] = True
    return Response(payload)

