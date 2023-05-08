import math
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from django.core.paginator import Paginator
from Users.models import User
from .models import Notification
from .serializers import NotificationSerializer
PAGESIZE = 5
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listview(request, pagenum):
    if pagenum < 1:
        return HttpResponse('NOT FOUND', status=404)
    if request.method == 'GET':
        notifications = Notification.objects.filter(user=request.user)
        try:
            data = JSONParser().parse(request)
            
            # Find unread notifications
            filter_read = data.get('is_read')
            if filter_read is not None:
                notifications = Notification.objects.all().difference(filter_read)
        except Exception as e:
            print(e)
        notifications_count = len(notifications)
        page_count = math.ceil(notifications_count/PAGESIZE)
        notifications_pages = Paginator(notifications, PAGESIZE)
        next_page = None if pagenum >= page_count else pagenum+1
        prev_page = None if pagenum <= 1 else pagenum-1
        try:
            results = notifications_pages.page(pagenum)
        except:
            return HttpResponse('NOT FOUND', status=404)
        
        serializer = NotificationSerializer(results, many=True)
        results_final = {
            "result_count": notifications_count,
            "pagesize": PAGESIZE,
            "page_count": page_count,
            "next_page": next_page,
            "prev_page": prev_page,
            "data": serializer.data,
        }
        return Response(results_final, status=200)
    
    else:
        return HttpResponse('METHOD NOT ALLOWED', status=405)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createview(request):
    if request.method == 'POST':
        notif_data = {}
        try:
            data = JSONParser().parse(request)
            user = data.get('user')
            dt = data.get('dt')
            url = data.get('url')
            message = data.get('message')
            is_read = data.get('is_read')
            if user is not None:
                notif_data['user'] = user
            else:
                raise KeyError
            if dt is not None:
                if len(dt) > 0:
                    notif_data['dt'] = dt
                else:
                    raise KeyError
            if url is not None:
                if len(url) > 0:
                    notif_data['url'] = url
                else:
                    raise KeyError
            if message is not None:
                if len(message) > 0:
                    notif_data['message'] = message
                else:
                    raise KeyError
            if is_read is not None:
                notif_data['is_read'] = is_read
            else:
                raise KeyError
        except KeyError:
            return Response(status=400)
        new_notif = Notification(
            user = User.objects.get(pk=user),
            dt = notif_data['dt'],
            url = notif_data['url'],
            message = notif_data['message'],
            is_read = notif_data['is_read']
        )
        new_notif.save()
        serializer = NotificationSerializer(new_notif, many=False)
        return Response(serializer.data, status=200)
    
@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def editview(request, pk):
    if pk <= 0:
        return Response(status=404)
    
    notif = Notification.objects.filter(id=pk)
    if not notif.exists():
        return HttpResponse('NOT FOUND', status=404)
    
    if request.method == 'POST':
        notif_data = {}
        try:
            data = JSONParser().parse(request)
            user = data.get('user')
            dt = data.get('dt')
            url = data.get('url')
            message = data.get('message')
            is_read = data.get('is_read')
            if user is not None:
                if len(user) > 0:
                    notif_data['user'] = user
                else:
                    raise KeyError
            if dt is not None:
                if len(dt) > 0:
                    notif_data['dt'] = dt
                else:
                    raise KeyError
            if url is not None:
                if len(url) > 0:
                    notif_data['url'] = url
                else:
                    raise KeyError
            if message is not None:
                if len(message) > 0:
                    notif_data['message'] = message
                else:
                    raise KeyError
            if is_read is not None:
                if len(is_read) > 0:
                    notif_data['is_read'] = is_read
                else:
                    raise KeyError
        except KeyError:
            return Response(status=400)
        
        serializer = NotificationSerializer(notif)
        return Response(serializer.data, status=200)
    
    elif request.method == 'DELETE':
        notif.delete()
        #notif.save()
        return Response('DELETED', status=200)
    else:
        return HttpResponse('METHOD NOT ALLOWED', status=405)
    
@api_view(['GET'])
def detailview(request, id):
    if id <= 0:
        return Response(status=404)
    
    try:
        notif = Notification.objects.get(id=id)
    except Notification.DoesNotExist:
        return HttpResponse('NOT FOUND', status=404)
    
    # Get notification details
    if request.method == 'GET':
        notif.is_read = True
        serializer = NotificationSerializer(notif, many=False)
        result = dict(serializer.data)
        return Response(result)
    else:
        return HttpResponse('METHOD NOT ALLOWED', status=405)

