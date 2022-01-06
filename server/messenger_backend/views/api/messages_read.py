from django.contrib.auth.middleware import get_user
from django.http import HttpResponse, JsonResponse
from messenger_backend.models import Conversation, Message
from online_users import online_users
from rest_framework.views import APIView


class MessagesRead(APIView):
    """expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)"""
    def get(self, request):
        print('Testing if MessagesRead works with get', request)
        return JsonResponse({"message": 'test was a success'})

    def patch(self, request):
        print('Function: patch', request.body)
        try:
            user = get_user(request)
            if user.is_anonymous:
                return HttpResponse(status=401)
            sender_id = user.id
            body = request.data
            conversation_id = body.get("conversationId")
            print('checkpoint a', body, conversation_id)
            # if we already know conversation id, we can save time and just add it to message and return
            if conversation_id:
                conversation = Conversation.objects.filter(id=conversation_id).first()
                print('checkpoint a', body, conversation_id)
                messages = Message.objects.filter(conversationId=conversation_id)
                print('checkpoint c', messages)
                for message in messages:
                    message.readYN = True
                print('checkpoint e', messages)
                Message.objects.bulk_update(messages)
                return JsonResponse({"message": message_json, "sender": sender})
                return JsonResponse({"message": 'success'})

            # if we don't have conversation id, find a conversation to m       ake sure it doesn't already exist
            conversation = Conversation.find_conversation(sender_id, recipient_id)
            message = Message(senderId=sender_id, text=text, conversation=conversation)
            message.save()
            message_json = message.to_dict()
            return JsonResponse({"message": message_json, "sender": sender})
        except Exception as e:
            return HttpResponse(status=500)
