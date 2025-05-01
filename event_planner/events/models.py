from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    # Event title, e.g., "Team Meeting"
    title = models.CharField(max_length=100)
    # Optional description, e.g., "Discuss project"
    description = models.TextField(blank=True)
    # Date and time, e.g., "2025-04-17 10:00"
    date = models.DateTimeField()
    # Location, e.g., "Office"
    location = models.CharField(max_length=100)
    # Who created it, links to User
    organizer = models.ForeignKey(User, on_delete=models.CASCADE)
    # When event was created
    created_at = models.DateTimeField(auto_now_add=True)

    # Shows title in admin
    def __str__(self):
        return self.title

class RSVP(models.Model):
    # Which event, links to Event
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    # Who’s RSVPing, links to User
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # RSVP choice: Yes, No, Maybe
    status = models.CharField(max_length=10, choices=[('yes', 'Yes'), ('no', 'No'), ('maybe', 'Maybe')])
    # When RSVP was made
    created_at = models.DateTimeField(auto_now_add=True)

    # Shows user-event in admin
    def __str__(self):
        return f"{self.user} - {self.event}"

class Comment(models.Model):
    # Which event, links to Event
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    # Who commented, links to User
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # Comment text, e.g., "I’ll bring snacks!"
    text = models.TextField()
    # When comment was made
    created_at = models.DateTimeField(auto_now_add=True)

    # Shows user-event in admin
    def __str__(self):
        return f"{self.user} - {self.event}"