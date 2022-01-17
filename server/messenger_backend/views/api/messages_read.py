from re import T
from django.contrib.auth.middleware import get_user
from django.http import HttpResponse, JsonResponse
from django.db.models import OuterRef, Subquery
from messenger_backend.models import Message
from rest_framework.views import APIView


class MessagesRead(APIView):
    """expects { conversationId } in body"""

    def patch(self, request):
        try:
            user = get_user(request)
            if user.is_anonymous:
                return HttpResponse(status=401)
            body = request.data
            conversation_id = body.get("conversationId")

            # Get the last read message for both users in the conversation
            latestReadMessageIDs = {}
            most_recent_one_message_per_user = Message.objects.filter(conversation=conversation_id, senderId=OuterRef('senderId')).order_by('-createdAt')[:1]
            last_read_messages = Message.objects.filter(id__in=Subquery(most_recent_one_message_per_user.values('id')))
            for message in last_read_messages:
                latestReadMessageIDs[message.senderId] = message.id

            if conversation_id:
                messages = Message.objects.filter(conversation=conversation_id, readYN=False).order_by("createdAt")
                for message in messages:
                    message.readYN = True
                Message.objects.bulk_update(messages, ['readYN'])
                return JsonResponse({"latestReadMessageIDs": latestReadMessageIDs, "conversation_id": conversation_id})
        except Exception as e:
            return HttpResponse(status=500)
