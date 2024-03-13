import base64
import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.files.base import ContentFile
from django.db.models import Q, Exists, OuterRef
from django.db.models.functions import Coalesce

from .models import User, Connection, Message
from .serializers import UserSerializer, SearchSerializer, RequestSerializer, FriendSerializer, MessageSerializer

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
            
            # Pretty print  python dict
            print('receive', json.dumps(data, indent=2))
            
            
            # Get friend list
            if data_source == 'friend.list':
                self.receive_friend_list(data)

            # Message List
            elif data_source == 'message.list':
                self.receive_message_list(data)
                   
            # Message has been sent
            elif data_source == 'message.send':
                self.receive_message_send(data)
                     
            # User is typing message
            elif data_source == 'message.type':
                self.receive_message_type(data)
             
            # Acccept friend request
            elif data_source == 'request.accept':
                self.receive_request_accept(data)
                    
            # Make friend request
            elif data_source == 'request.connect':
                self.receive_request_connect(data)
                
            # Get requests list 
            elif data_source == 'request.list':
                self.receive_request_list(data)
                
            # search/filter users 
            elif data_source == 'search':
                self.receive_search(data)
                
            # thumbnail upload 
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



    def receive_message_type(self,data):
        user=self.scope['user']
        recipient_username=data.get('username')
        
        data={
            'username':user.username
        }
        self.send_group(recipient_username,'message.type', data)
        
        
    def receive_message_list(self,data):
        user=self.scope['user']
        connectionId=data.get('connectionId')
        page=data.get('page')
        page_size=10
        try:
            connection=  Connection.objects.get(id=connectionId)
        except Connection.DoesNotExist:
            print("Error: couldn't find connection")
            return
        # Get messages
        messages= Message.objects.filter(
            connection=connection
        ).order_by('-created')[page*page_size:(page+1)*page_size]
        # Serialized message
        serialized_messages= MessageSerializer(
            messages,
            context={
                'user':user
            },
            many=True
        )
        # Get recipient friend
        recipient = connection.sender
        if connection.sender == user:
            recipient = connection.receiver
        # Serialize friend 
        serialized_friend= UserSerializer(recipient)
        
        # Count the total number of messages for this connection
        messages_count = Message.objects.filter(
            connection=connection
        ).count()
        
        next_page=page+1 if messages_count>(page+1)*page_size else None
        data = {
            'messages':serialized_messages.data, 
            'next':next_page ,
            'friend': serialized_friend.data
        }
        # Send back to the requestor
        self.send_group(user.username, 'message.list', data)
        
            
        
    def receive_message_send(self,data):
        user=self.scope['user']
        connectionId=data.get('connectionId')
        message_text=data.get('message')
        
        try:
            connection=  Connection.objects.get(
                id=connectionId
            )
        except Connection.DoesNotExist:
            print("Error: couldn't find connection")
            return
        
        message = Message.objects.create(
            connection=connection,
            user=user,
            text=message_text
        )
        
        # Get recipient friend
        recipient = connection.sender
        if connection.sender == user:
            recipient = connection.receiver
            
        
        # Send new message back to sender
        serialized_message= MessageSerializer(
            message,
            context ={
                'user':user
            }
        )
        serialized_friend=UserSerializer(recipient)
        data={
            'message':serialized_message.data,
            'friend':serialized_friend.data   
            }
        self.send_group(user.username, 'message.send', data)
        
        
        # Send new message to receiver
        serialized_message= MessageSerializer(
            message,
            context ={
                'user':recipient
            }
        )
        serialized_friend=UserSerializer(user)
        data={
            'message':serialized_message.data,
            'friend':serialized_friend.data   
            }
        self.send_group(recipient.username, 'message.send', data)
        
        
        
    def receive_friend_list(self,data):
        user= self.scope['user']
        #Latest message subquery
        latest_message=Message.objects.filter(
            connection=OuterRef('id')
        ).order_by('-created')[:1]
        #Get connections for user
        connections=Connection.objects.filter(
            Q(sender =user) | Q(receiver=user),
            accepted=True
        ).annotate(
            latest_text=latest_message.values('text'),
            latest_created=latest_message.values('created')
        ).order_by(
            Coalesce('latest_created','updated').desc()
        )
        serialized=FriendSerializer(connections,
                                    context={'user':user},
                                    many=True)
        #Send data back to requesting user
        self.send_group(user.username, 'friend.list', serialized.data)
        
        
    def receive_request_accept(self,data):
        username=data.get('username')
        #Fetch connection object
        try:
            connection = Connection.objects.get(
                sender__username=username,
                receiver=self.scope['user']
            )
        except Connection.DoesNotExist:
            print("Error: connection doesn't exist")
            return
        # Update the connection
        connection.accepted=True
        connection.save()
        
        serialized= RequestSerializer(connection)
        # Send accepted request to sender
        self.send_group(
            connection.sender.username, 'request.accept', serialized.data
        )
        # Send accepted request to receiver
        self.send_group(
            connection.receiver.username, 'request.accept', serialized.data
        )
        # Send new friend object to sender
        serialized_friend=FriendSerializer(
            connection,
            context={
                'user':connection.sender
            }
        )
        self.send_group(
            connection.sender.username, 'friend.new', serialized_friend.data)
        # Send new friend object to receiver
        serialized_friend=FriendSerializer(
            connection,
            context={
                'user':connection.receiver
            }
        )
        self.send_group(
            connection.receiver.username, 'friend.new', serialized_friend.data)
        
        
        
    def receive_request_list(self, data):
        user =self.scope['user']
        #Get connection made to this user
        connections=Connection.objects.filter(
            receiver = user,
            accepted= False
        )
        serialized=RequestSerializer(connections, many=True)
        #Send requests list back to this user
        self.send_group(user.username, 'request.list', serialized.data)
        
        
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
        ).annotate(
            pending_them=Exists(Connection.objects.filter(
                sender=self.scope['user'],
                receiver=OuterRef('id'),
                accepted=False
            )),
            pending_me=Exists(Connection.objects.filter(
                sender=OuterRef('id'),
                receiver=self.scope['user'],
                accepted=False
            )),
            connected=Exists(Connection.objects.filter(
               Q(sender=self.scope['user'], receiver= OuterRef('id')) |
               Q(receiver=self.scope['user'], sender= OuterRef('id')) ,
               accepted=True

               
            )),
        )
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
