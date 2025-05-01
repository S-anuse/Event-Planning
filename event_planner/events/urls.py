from django.urls import path
from .views import EventListCreate, RSVPListCreate, CommentListCreate, UserCreate

urlpatterns = [
    path('events/', EventListCreate.as_view(), name='event-list'),
    path('rsvps/', RSVPListCreate.as_view(), name='rsvp-list'),
    path('comments/', CommentListCreate.as_view(), name='comment-list'),
    path('users/', UserCreate.as_view(), name='user-create'),
]