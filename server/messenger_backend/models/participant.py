from django.db import models
from django.db.models import Q

from . import utils
from .user import User
from .conversation import Conversation


class Participant(utils.CustomModel):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        db_column="conversationId",
        related_name="messages",
        related_query_name="message"
    )
    time_last_read = models.DateTimeField(null=True)
