import base64
import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.files.base import ContentFile
from django.db.models import Q

from .models import User, Connection
from .serializers import UserSerializer, SearchSerializer, RequestSerializer

class ChatConsumer(WebsocketConsumer):
    
    def connect(self):
        user = self.scope['user']
        print(user, user.is_authenticated)
        if not user or not user.is_authenticated:
            # Reject the connection if the user is not authenticated
            self.close()
            return
        
        #Save username to use as a group name for this user
        self.username=user.username
        
        #Join this user to a group with their username
        async_to_sync(self.channel_layer.group_add)(
            self.username, self.channel_name
        )
        print('added to the group')
        self.accept()
        
    def disconnect(self, close_code):
        # Leave the group when the connection is closed
        async_to_sync(self.channel_layer.group_discard)(
            self.username, self.channel_name
        )
        
    # -------------------------------------------------------
    #     Handle requests that are being pushed from the app
    # -------------------------------------------------------
    
    def receive(self, text_data):
        try:
            # Receive message from the websocket
            data = json.loads(text_data)
            # Process the received data
            data_source = data.get('source')
            filename = data.get('filename')
            # print(filename)
            base64=data.get('base64')
            # print(base64)
            # print('receive: Source:', data_source, ', Filename:', filename)
    # def receive(self, text_data):
    #         # Receive message from websocket
    #         data =json.loads(text_data)
    #         data_source= data.get('source')
            
    #         # Pretty print  python dict
            print('receive', json.dumps(data, indent=2))
            
            # search/filter users 
            if data_source == 'search':
                self.receive_search(data)
                
            # Make friend request
            elif data_source == 'request.connect':
                self.receive_request_connect(data)
                
            elif data_source == 'thumbnail':
                self.receive_thumbnail(data)

            else:
                print("Received unknown message type:", data_source)
        except json.JSONDecodeError as e:
            # Log and handle JSON decoding errors
            print("Error decoding JSON:", e)
            # Optionally, you can send an error message back to the client
            self.send_error_message("Invalid JSON format")
        except Exception as e:
            # Log and handle other exceptions
            print("Error processing message:", e)
            # Optionally, you can send an error message back to the client
            self.send_error_message("An error occurred while processing your request")

    def receive_request_connect(self, data):
        username= data.get('username')
        #Attempt to fetch the receiving user
        try:
            receiver=User.objects.get(username=username)
        except User.DoesNotExist:
            print('Error : User not found')
            return 
        # Create connection
        connection, _=Connection.objects.get_or_create(
            sender =self.scope['user'],
            receiver=receiver
        )
        #Serialized connection
        serialized=RequestSerializer(connection)
        # Send back to sender
        self.send_group(connection.sender.username, 'request.connect', serialized.data)
        # Send to receiver
        self.send_group(
            connection.receiver.username, 'request.connect', serialized.data
        )
            
    def receive_search(self, data):
        query=data.get('query')
        # Get users from query search term
        users=User.objects.filter(
            Q(username__istartswith=query) |
            Q(first_name__istartswith=query) |
            Q(last_name__istartswith=query) 
        ).exclude(
            username=self.username
        )
        # .annotate(
        #     pending_them=Exists(Connection)
        #     pending_me=...
        #     connected=...
        # )
        #serialize results
        serialized= SearchSerializer(users, many=True)
        # Send search results back to this user
        self.send_group(self.username, 'search', serialized.data)
    
    def receive_thumbnail(self, data):
        user = self.scope['user']
    # Check if the 'base64' key exists in the data
        if 'base64' in data:
        # Get the value of 'base64' key
            image_str = data.get('base64')
            # print(image_str)
        # Check if image_str is not None or empty
        if image_str:
            # Convert base64 data to Django ContentFile
            image = ContentFile(base64.b64decode(image_str))
            # Update the thumbnail field
            filename = data.get('filename')
            # print(filename)
            user.thumbnail.save(filename, image, save=True)
            # Serialize user
            serialized = UserSerializer(user) 
            # print(serialized.data)
            # Send updated user data including new thumbnail
            self.send_group(self.username, 'thumbnail', serialized.data)
        else:
            print("No 'base64' key found or it is empty in the received data.")


        
    #-----------------------------------------
    #   Catch/all broadcast to client helpers
    #-----------------------------------------
    
    
    def send_group(self, group, source, data):
        response = {
            'type':'broadcast_group',
            'source': source,
            'data': data
        }
        async_to_sync(self.channel_layer.group_send)(
            group, response
        )
        
    def broadcast_group (self, data):
        '''
        data:
        - type: 'broadcat_group
        - source: where it originated from
        - data: data sent
        '''
        data.pop('type')
        '''
        return-data:
        - source: where it originated from
        - data: data sent
        '''
        self.send(text_data=json.dumps(data))

    
    
# def receive(self, text_data):
#     try:
#         # Receive message from the websocket
#         data = json.loads(text_data)
#         # Process the received data here
#         self.handle_message(data)
#     except json.JSONDecodeError as e:
#         # Log and handle JSON decoding errors
#         print("Error decoding JSON:", e)
#         # Optionally, you can send an error message back to the client
#         self.send_error_message("Invalid JSON format")
#     except Exception as e:
#         # Log and handle other exceptions
#         print("Error processing message:", e)
#         # Optionally, you can send an error message back to the client
#         self.send_error_message("An error occurred while processing your request")

        
#     def handle_message(self, data):
#         # Implement your message handling logic here
#         print('Received message:', data)
#         # Optionally, you can send a response back to the client
#         self.send_message("Your message was received")
        
#     def send_message(self, message):
#         # Send a message back to the client
#         self.send(json.dumps({
#             'type': 'chat.message',
#             'message': message
#         }))
        
    def send_error_message(self, error_message):
        # Send an error message back to the client
        self.send(json.dumps({
            'type': 'chat.error',
            'error_message': error_message
        }))
