from django.contrib.auth.middleware import get_user
from django.http import HttpResponse, JsonResponse
from messenger_backend.models import Message
from rest_framework.views import APIView


class MessagesRead(APIView):
    """expects { conversationId } in body"""

    def patch(self, request):
        try:
            user = get_user(request)
            if user.is_anonymous:
                return HttpResponse(status=401)
            sender_id = user.id
            body = request.data
            conversation_id = body.get("conversationId")
            if conversation_id:
                messages = Message.objects.filter(conversation=conversation_id, readYN=False)
                for message in messages:
                    message.readYN = True
                Message.objects.bulk_update(messages, ['readYN'])
                return JsonResponse({"message": "messages marked as read", "sender_id": sender_id, "conversation_id": conversation_id})
        except Exception as e:
            return HttpResponse(status=500)
