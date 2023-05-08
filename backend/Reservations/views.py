import math
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser
from .models import Reservation
from Properties.models import Property
from Users.models import User
from .serializers import ReservationSerializer
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.core.paginator import Paginator
from datetime import date
PAGESIZE = 5
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listview(request, pagenum):
    if pagenum < 1:
        return HttpResponse('NOT FOUND', status=404)
    if request.method == 'GET':
        reservations = Reservation.objects.all()
        filter_user = request.user.id
        reservations = reservations.filter(user=filter_user)
        try:
            data = JSONParser().parse(request)
            filter_status = data.get('status')
            if filter_status is not None:
                reservations = reservations.filter(status=filter_status)
        except Exception as e:
            print(e)
        reservations_count = len(reservations)
        page_count = math.ceil(reservations_count/PAGESIZE)
        reservations_pages = Paginator(reservations, PAGESIZE)
        next_page = None if pagenum >= page_count else pagenum+1
        prev_page = None if pagenum <= 1 else pagenum-1
        try:
            results = reservations_pages.page(pagenum)
        except:
            return HttpResponse('NOT FOUND', status=404)
        
        serializer = ReservationSerializer(results, many=True)
        results_final = {
            "result_count": reservations_count,
            "pagesize": PAGESIZE,
            "page_count": page_count,
            "next_page": next_page,
            "prev_page": prev_page,
            "data": serializer.data,
        }
        return Response(results_final, status=200)
    else:
        return HttpResponse('METHOD NOT ALLOWED', status=405)

@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def editview(request, id):
    if id <= 0:
        return HttpResponse('NOT FOUND', status=404)
    
    res = Reservation.objects.filter(id=id)
    if not res.exists():
        return HttpResponse('NOT FOUND', status=404)
    
    user = User.objects.filter(id=request.user.id)
    if not user.exists():
        return HttpResponse('NOT FOUND', status=404)
    user = User.objects.get(id=request.user.id)
    res = res.filter(user=user.id)
    if not res.exists():
        return HttpResponse('FORBIDDEN', status=403)
    res = Reservation.objects.get(id=id, user=user.id)
    if request.method == 'POST':
        res_data = {}
        try:
            update_status = False
            data = JSONParser().parse(request)
            property = data.get('property')
            start_dt = data.get('start_dt')
            end_dt = data.get('end_dt')
            cost = data.get('cost')
            status = data.get('status')
            host_review_rating = data.get('host_review_rating')
            host_review_comment = data.get('host_review_comment')
            host_review_dt = data.get('host_review_dt')
            user_review_rating = data.get('user_review_rating')
            user_review_comment = data.get('user_review_comment')
            user_review_dt = data.get('user_review_dt')
            host_reply_comment = data.get('host_reply_comment')
            host_reply_dt = data.get('host_reply_dt')
            user_reply_comment = data.get('user_reply_comment')
            user_reply_dt = data.get('user_reply_dt')
            if property is not None:
                res_data['property'] = property
            else:
                raise KeyError
            if start_dt is not None:
                if len(start_dt) > 0:
                    res_data['start_dt'] = start_dt
                else:
                    raise KeyError
            if end_dt is not None:
                if len(end_dt) > 0:
                    res_data['end_dt'] = end_dt
                else:
                    raise KeyError
            if cost is not None:
                if len(cost) > 0:
                    res_data['cost'] = cost
                else:
                    raise KeyError
            if status is not None:
                if len(status) > 0:
                    res_data['status'] = status
                    update_status = True
                else:
                    raise KeyError
            else:
                status = str(Reservation.objects.get(id=id).status)
            if host_review_rating is not None:
                if len(host_review_rating) > 0:
                    res_data['host_review_rating'] = host_review_rating
                else:
                    raise KeyError
            if host_review_comment is not None:
                if len(host_review_comment) > 0:
                    res_data['host_review_comment'] = host_review_comment
                else:
                    raise KeyError
            if host_review_dt is not None:
                if len(host_review_dt) > 0:
                    res_data['host_review_dt'] = host_review_dt
                else:
                    raise KeyError
            if user_review_rating is not None:
                if len(user_review_rating) > 0:
                    res_data['user_review_rating'] = user_review_rating
                else:
                    raise KeyError
            if user_review_comment is not None:
                if len(user_review_comment) > 0:
                    res_data['user_review_comment'] = user_review_comment
                else:
                    raise KeyError
            if user_review_dt is not None:
                if len(user_review_dt) > 0:
                    res_data['user_review_dt'] = user_review_dt
                else:
                    raise KeyError
            if host_reply_comment is not None:
                if len(host_reply_comment) > 0:
                    res_data['host_reply_comment'] = host_reply_comment
                else:
                    raise KeyError
            if host_reply_dt is not None:
                if len(host_reply_dt) > 0:
                    res_data['host_reply_dt'] = host_reply_dt
                else:
                    raise KeyError
            if user_reply_comment is not None:
                if len(user_reply_comment) > 0:
                    res_data['user_reply_comment'] = user_reply_comment
                else:
                    raise KeyError
            if user_reply_dt is not None:
                if len(user_reply_dt) > 0:
                    res_data['user_reply_dt'] = user_reply_dt
                else:
                    raise KeyError
        except KeyError:
            return HttpResponse('INVALID RESERVATION PARAMETERS', status=400)
        if update_status:
            if res_data['status'] == 'cancelled':
                res.status = res_data['status']
                # send notification
            elif res_data['status'] == 'approved':
                if res.status == 'pending':
                    res.status = res_data['status']
                else:
                    res.delete()
                    res.save()
                    # send notification
                    return Response('CANCEL APPROVED', status=200)
            else:
                res.status = res_data['status']
        serializer = ReservationSerializer(res)
        return Response(serializer.data, status=200)
    
    elif request.method == 'DELETE':
        res.delete()
        #res.save()
        return Response('DELETED', status=200)
    else:
        return HttpResponse('METHOD NOT ALLOWED', status=405)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def detailview(request, id):
    if id < 1:
        return HttpResponse('NOT FOUND', status=404)
    
    try:
        res = Reservation.objects.get(id=id)
    except Reservation.DoesNotExist:
        return HttpResponse('NOT FOUND', status=404)
    
    if request.method == 'GET':
        serializer = ReservationSerializer(res, many=False)
        result = dict(serializer.data)
        return Response(result, status=200)
#TODO 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createreviewview(request):
    if request.method == 'GET':
        responsedata = {
            "id": 123,
            "email": "test@email.com"
        }
        return Response(responsedata)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createview(request):
    userid = request.user.id
    if request.method == 'POST':
        res_data = {}
        try:
            data = JSONParser().parse(request)
            propertyid = data.get('property')
            start_dt = data.get('start_dt')
            end_dt = data.get('end_dt')
            cost = data.get('cost')
            status = data.get('status')
            host_review_rating = data.get('host_review_rating')
            host_review_comment = data.get('host_review_comment')
            host_review_dt = data.get('host_review_dt')
            user_review_rating = data.get('user_review_rating')
            user_review_comment = data.get('user_review_comment')
            user_review_dt = data.get('user_review_dt')
            host_reply_comment = data.get('host_reply_comment')
            host_reply_dt = data.get('host_reply_dt')
            user_reply_comment = data.get('user_reply_comment')
            user_reply_dt = data.get('user_reply_dt')
            if propertyid is not None:
                res_data['property'] = propertyid
            else:
                raise KeyError
            if start_dt is not None:
                if len(start_dt) > 0:
                    res_data['start_dt'] = start_dt
                else:
                    raise KeyError
            if end_dt is not None:
                if len(end_dt) > 0:
                    res_data['end_dt'] = end_dt
                else:
                    raise KeyError
            if cost is not None:
                if len(cost) > 0:
                    res_data['cost'] = cost
                else:
                    raise KeyError
            if status is not None:
                if len(status) > 0:
                    res_data['status'] = status
                else:
                    raise KeyError
            if host_review_rating is not None:
                res_data['host_review_rating'] = host_review_rating
            else:
                res_data['host_review_rating'] = None
            if host_review_comment is not None:
                res_data['host_review_comment'] = host_review_comment
            else:
                res_data['host_review_comment'] = None
            if host_review_dt is not None:
                res_data['host_review_dt'] = host_review_dt
            else:
                res_data['host_review_dt'] = None
            if user_review_rating is not None:
                res_data['user_review_rating'] = user_review_rating
            else:
                res_data['user_review_rating'] = None
            if user_review_comment is not None:
                res_data['user_review_comment'] = user_review_comment
            else:
                res_data['user_review_comment'] = None
            if user_review_dt is not None:
                res_data['user_review_dt'] = user_review_dt
            else:
                res_data['user_review_dt'] = None
            if host_reply_comment is not None:
                res_data['host_reply_comment'] = host_reply_comment
            else:
                res_data['host_reply_comment'] = None
            if host_reply_dt is not None:
                res_data['host_reply_dt'] = host_reply_dt
            else:
                res_data['host_reply_dt'] = None
            if user_reply_comment is not None:
                res_data['user_reply_comment'] = user_reply_comment
            else:
                res_data['user_reply_comment'] = None
            if user_reply_dt is not None:
                res_data['user_reply_dt'] = user_reply_dt
            else:
                res_data['user_reply_dt'] = None
        except KeyError:
            return HttpResponse('INVALID RESERVATION PARAMETERS', status=400)
        
        new_res = Reservation(
            property = Property.objects.get(pk=propertyid), 
            user = User.objects.get(pk=userid), 
            start_dt = res_data['start_dt'], 
            end_dt = res_data['end_dt'], 
            cost = res_data['cost'], 
            status = res_data['status'], 
            host_review_rating = res_data['host_review_rating'], 
            host_review_comment = res_data['host_review_comment'], 
            host_review_dt = res_data['host_review_dt'], 
            user_review_rating = res_data['user_review_rating'], 
            user_review_comment = res_data['user_review_comment'], 
            user_review_dt = res_data['user_review_dt'], 
            host_reply_comment = res_data['host_reply_comment'], 
            host_reply_dt = res_data['host_reply_dt'], 
            user_reply_comment = res_data['user_reply_comment'], 
            user_reply_dt = res_data['user_reply_dt'], 
        )
        
        new_res.save()
        serializer = ReservationSerializer(new_res, many=False)
        return Response(serializer.data, status=200)

