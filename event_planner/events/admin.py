from django.contrib import admin
from .models import Event, RSVP, Comment

admin.site.register(Event)
admin.site.register(RSVP)
admin.site.register(Comment)