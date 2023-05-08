import math
from datetime import datetime, date, timedelta
# from dateutil import parser

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated

from .models import Property
from Amenities.models import Amenity
from Users.models import User
from Images.models import Image
from Listings.models import Listing
from django.db.models import Min, Max
from .serializers import PropertySerializer
from Listings.serializers import ListingSerializer
from Images.serializers import ImageSerializer
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.core.paginator import Paginator

from Amenities.constants import AMENITY_TYPES
from Reservations.constants import RESERVATION_STATUS_TYPES

PAGESIZE = 10

@api_view(['POST'])
def listview(request, pagenum):
    if pagenum < 1:
        return HttpResponse("NOT FOUND", status=404)
    if request.method == 'POST':
        properties = Property.objects.all()

        try:
            data = JSONParser().parse(request)
#             print(data)

            # get filter data
            filter_city = data.get('city')
            filter_amenities = data.get('amenities')
            filter_country = data.get('country')
            filter_guests = data.get('guests')
            filter_startdate = data.get('startdate')
            filter_enddate = data.get('enddate')
            filter_minprice = data.get('minprice')
            filter_maxprice = data.get('maxprice')
            filter_minrating = data.get('minrating')
            order_guests = data.get('order_guests')
            order_price = data.get('order_price')
            order_rating = data.get('order_rating')

            # apply filters to properties results where applicable
            if filter_city is not None:
                properties = properties.filter(city=filter_city)

            if filter_country is not None:
                properties = properties.filter(country=filter_country)

            if filter_guests is not None:
                # show properties where max_guests >= filter_guests
                properties = properties.filter(max_guests__gte=filter_guests)

            if filter_amenities is not None and len(filter_amenities) > 0:
                # get amenities where the title is in the filtered_amenities array
                amenities = Amenity.objects.filter(title__in=filter_amenities, property__in=properties)
                # get the property IDs from the amenities list above
                prop_ids = [x.id for x in amenities]
                # filter property IDs from the filtered amenities list
                properties = properties.filter(id__in=prop_ids)

            if filter_startdate is not None:
                pass

            if filter_enddate is not None:
                pass

            if filter_minprice is not None:
                pass

            if filter_maxprice is not None:
                pass

            if filter_minrating is not None:
                pass

            if filter_startdate is not None:
                pass

            if order_guests is not None:
#                 print("ordering by guest count:", order_guests)
                if order_guests == -1:
                    properties = properties.order_by('-max_guests')
                elif order_guests == 1:
                    properties = properties.order_by('max_guests')
#                 print("order:", properties)

            if order_price is not None:
                print("ordering by price:", order_price)
                if order_price == -1:
                    # properties = properties.order_by('-listing__price')
                    properties = properties.annotate(min_price=Min('listings__price')).order_by('-min_price')
                    # properties = properties.order_by('-min_price')
                elif order_price == 1:
                    # properties = properties.order_by('listing__price')
                    properties = properties.annotate(min_price=Min('listings__price')).order_by('min_price')
                    # properties = properties.order_by('min_price')
#                 print("order:", properties)

            if order_rating is not None:
                print("ordering by rating:", order_rating)
                if order_rating == -1:
                    properties = properties.order_by('-reservation__user_review_rating')
                elif order_rating == 1:
                    properties = properties.order_by('reservation__user_review_rating')
#                 print("order:", properties)

        except Exception as e:
            print(e)

        # calculate pagination data
        properties_count = len(properties)
        page_count = math.ceil(properties_count/PAGESIZE)
        properties_pages = Paginator(properties, PAGESIZE)
        next_page = None if pagenum >= page_count else pagenum+1
        prev_page = None if pagenum <= 1 else pagenum-1

        try:
            results = properties_pages.page(pagenum)
        except:
            return HttpResponse("NOT FOUND", status=404)

        serializer = PropertySerializer(results, many=True)

        results_final = {
            "result_count": properties_count,
            "pagesize": PAGESIZE,
            "page_count": page_count,
            "next_page": next_page,
            "prev_page": prev_page,
            "data": serializer.data,
        }

        return Response(results_final, status=200)
    else:
        return HttpResponse("METHOD NOT ALLOWED", status=405)


@api_view(['POST', 'DELETE'])
# @permission_classes([IsAuthenticated])
def editview(request, pk):
    if pk <= 0:
        return HttpResponse("NOT FOUND", status=404)

    prop = Property.objects.filter(id=pk)
    if not prop.exists():
        return HttpResponse("NOT FOUND", status=404)

    # TODO: uncomment when auth is added back
#     host = User.objects.filter(id=request.user.id)
#     if not host.exists():
#         return HttpResponse("NOT FOUND", status=404)
#     host = User.objects.get(id=request.user.id)
#     prop = prop.filter(host=host.id)
#     if not prop.exists():
#         return HttpResponse("FORBIDDEN", status=403)
#     prop = Property.objects.get(id=pk, host=host.id)
    prop = Property.objects.get(id=pk)

    # TODO: comment when auth is added back
    host = User.objects.get(id=prop.host.id)

    if request.method == 'POST':
        prop_data = {}
        amenities_to_add = []
        amenities_to_delete = []

        # get request data
        try:
            data = JSONParser().parse(request)

            address = data.get('address')
            city = data.get('city')
            province = data.get('province')
            postal = data.get('postal')
            country = data.get('country')
            description = data.get('description')
            name = data.get('name')
            max_guests = data.get('max_guests')
            num_bed = data.get('num_bed')
            num_bath = data.get('num_bath')
            amenities = data.get('amenities')
            print("Update amenities:", amenities)

            if address is not None:
                if len(address) > 0:
#                     prop_data['address'] = address
                    prop.address = address
                else:
                    raise KeyError
            if city is not None:
                if len(city) > 0:
#                     prop_data['city'] = city
                    prop.city = city
                else:
                    raise KeyError
            if province is not None:
                if len(province) > 0:
#                     prop_data['province'] = province
                    prop.province = province
                else:
                    raise KeyError
            if postal is not None:
                if len(postal) > 0:
#                     prop_data['postal'] = postal
                    prop.postal = postal
                else:
                    raise KeyError
            if country is not None:
                if len(country) > 0:
#                     prop_data['country'] = country
                    prop.country = country
                else:
                    raise KeyError
            if description is not None:
                if len(description) > 0:
#                     prop_data['description'] = description
                    prop.description = description
                else:
                    raise KeyError
            if name is not None:
                if len(name) > 0:
#                     prop_data['name'] = name
                    prop.name = name
                else:
                    raise KeyError
            if max_guests is not None:
                if max_guests > 0:
#                     prop_data['max_guests'] = max_guests
                    prop.max_guests = max_guests
                else:
                    raise KeyError
            if num_bed is not None:
                if num_bed > 0:
#                     prop_data['num_bed'] = num_bed
                    prop.num_bed = num_bed
                else:
                    raise KeyError
            if num_bath is not None:
                if num_bath > 0:
#                     prop_data['num_bath'] = num_bath
                    prop.num_bath = num_bath
                else:
                    raise KeyError
            if amenities is not None:
                curr_amenities = [x.title for x in Amenity.objects.filter(property=prop)]
                accepted_amenities = []
                # only keep supported amenities from provided list
                for a in amenities:
                    if a in AMENITY_TYPES and a not in accepted_amenities:
                        accepted_amenities.append(a)
                amenities_to_add = list(set(accepted_amenities) - set(curr_amenities))
                amenities_to_delete = list(set(curr_amenities) - set(accepted_amenities))

#             else:
#                 raise KeyError

        except KeyError:
            return HttpResponse("INVALID PROPERTY PARAMETERS", status=400)

        # Add new amenities for property
        for a in amenities_to_add:
            amenity = Amenity(
                property=prop,
                title=a
            )
            amenity.save()
            print("Add: ", amenity.title)

        # delete old amenities for property
        for a in amenities_to_delete:
            print("Delete: ", a)
            Amenity.objects.filter(title=a, property=prop).delete()

        prop.save()

        listings = Listing.objects.filter(property=prop)

        serializer = PropertySerializer(prop)
        data = serializer.data
        data['host'] = {
            "first_name": host.first_name,
            "last_name": host.last_name,
            "id": host.id
        }

        data['listings']= [{"id": x.id, "start_dt": x.start_dt, "end_dt": x.end_dt, "price": x.price} for x in listings]

        return Response(data, status=200)

    elif request.method == 'DELETE':
        # delete property
        prop.delete()
        # prop.save()
        return Response(status=200)
    else:
        return HttpResponse("METHOD NOT ALLOWED", status=405)


@api_view(['GET'])
def detailview(request, pk):
    if pk <= 0:
        return HttpResponse("NOT FOUND", status=404)

    prop = Property.objects.filter(id=pk)
    if not prop.exists():
        return HttpResponse("NOT FOUND", status=404)
    prop = prop.get(id=pk)

    host = User.objects.get(id=prop.host.id)

    # get property details
    if request.method == 'GET':
#         print("In property details for: ", pk)
        serializer = PropertySerializer(prop, many=False)
#         print("After serializer:")
#         print(serializer)
        result = dict(serializer.data)

        # get images
        images = Image.objects.filter(property=prop)
        if images==None: images = []
        images = [(x.num, "http://localhost:8000"+x.image.url) for x in images]

        listings = Listing.objects.filter(property=prop)

        result['images'] = images
        result['host'] = {
            "first_name": host.first_name,
            "last_name": host.last_name,
            "id": host.id
        }

        result['listings'] = [{"id": x.id, "start_dt": x.start_dt, "end_dt": x.end_dt, "price": x.price} for x in listings]


        return Response(result, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createview(request):
    userid = request.user.id
    if request.method == 'POST':
        prop_data = {}
        accepted_amenities = []

        try:
            data = JSONParser().parse(request)

            address = data.get('address')
            city = data.get('city')
            province = data.get('province')
            postal = data.get('postal')
            country = data.get('country')
            description = data.get('description')
            name = data.get('name')
            max_guests = data.get('max_guests')
            num_bed = data.get('num_bed')
            num_bath = data.get('num_bath')
            amenities = data.get('amenities')

            if address is not None and len(address) > 0:
                prop_data['address'] = address
            else:
                raise KeyError
            if city is not None and len(city) > 0:
                prop_data['city'] = city
            else:
                raise KeyError
            if province is not None and len(province) > 0:
                prop_data['province'] = province
            else:
                raise KeyError
            if postal is not None and len(postal) > 0:
                prop_data['postal'] = postal
            else:
                raise KeyError
            if country is not None and len(country) > 0:
                prop_data['country'] = country
            else:
                raise KeyError
            if description is not None and len(description) > 0:
                prop_data['description'] = description
            else:
                raise KeyError
            if name is not None and len(name) > 0:
                prop_data['name'] = name
            else:
                raise KeyError
            if max_guests is not None and max_guests > 0:
                prop_data['max_guests'] = max_guests
            else:
                raise KeyError
            if num_bed is not None and num_bed > 0:
                prop_data['num_bed'] = num_bed
            else:
                raise KeyError
            if num_bath is not None and num_bath > 0:
                prop_data['num_bath'] = num_bath
            else:
                raise KeyError("num_bath invalid")
            if amenities is not None:
                for a in amenities:
                    if a in AMENITY_TYPES and a not in accepted_amenities:
                        accepted_amenities.append(a)
            else:
                raise KeyError

        except KeyError:
            return HttpResponse("INVALID PROPERTY PARAMETERS", status=400)

        new_prop = Property(
            host=User.objects.get(pk=userid),
            address=prop_data['address'],
            city=prop_data['city'],
            province=prop_data['province'],
            postal=prop_data['postal'],
            country=prop_data['country'],
            description=prop_data['description'],
            name=prop_data['name'],
            max_guests=prop_data['max_guests'],
            num_bed=prop_data['num_bed'],
            num_bath=prop_data['num_bath'],
        )
        new_prop.save()

        # create amenities
        for a in accepted_amenities:
            new_amenity = Amenity(
                property=new_prop,
                title=a
            )
            new_amenity.save()

        serializer = PropertySerializer(new_prop, many=False)
#         print("after serializer:", serializer)

        return Response(serializer.data, status=200)

'''
LISTINGS
'''
@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def listingcreateview(request, propid):
    if propid < 1:
        return HttpResponse("NOT FOUND", status=404)
    if request.method == 'POST':
        # uncomment when auth is available
#         property = Property.objects.filter(id=propid, host=User.objects.get(id=request.user.id))
        property = Property.objects.filter(id=propid)
        if not property.exists():
            return HttpResponse("NOT FOUND", status=404)
        property = property.get(id=propid, )

        listings = Listing.objects.filter(property=property)

        listing_data = {}

        try:
            data = JSONParser().parse(request)

            # get filter data
            start_dt = data.get('start_dt')
            end_dt = data.get('end_dt')
            price = data.get('price')

            # apply filters to properties results where applicable
            if start_dt is not None:
                # start_dt = datetime.strptime(start_dt, '%Y-%m-%d')
                listing_data['start_dt'] = start_dt
            else:
                raise KeyError

            if end_dt is not None:
                # end_dt = datetime.strptime(end_dt, '%Y-%m-%d')
                listing_data['end_dt'] = end_dt
            else:
                raise KeyError

            if start_dt >= end_dt:
                raise ValueError("End Date cannot be on or before Start Date")

            overlap_0_0 = listings.filter(start_dt__gte=start_dt, end_dt__lte=end_dt,) & \
                          listings.filter(start_dt__lte=end_dt, end_dt__gte=start_dt,)
            overlap_0_1 = listings.filter(start_dt__gte=start_dt, end_dt__gte=end_dt,) & \
                          listings.filter(start_dt__lte=end_dt, end_dt__gte=start_dt,)
            overlap_1_0 = listings.filter(start_dt__lte=start_dt, end_dt__lte=end_dt,) & \
                          listings.filter(start_dt__lte=end_dt, end_dt__gte=start_dt,)
            overlap_1_1 = listings.filter(start_dt__lte=start_dt, end_dt__gte=end_dt,) & \
                          listings.filter(start_dt__lte=end_dt, end_dt__gte=start_dt,)

#             print("new start_dt:", start_dt)
#             print("new end_dt:", end_dt)
#
#             print("All listings: ", listings.all())
#
#             print("overlap 0_0:", overlap_0_0)
#             print("overlap 0_1:", overlap_0_1)
#             print("overlap 1_0:", overlap_1_0)
#             print("overlap 1_1:", overlap_1_1)

            if len(overlap_0_0)+len(overlap_0_1)+len(overlap_1_0)+len(overlap_1_1) > 0:
                raise ValueError("Conflicting listing date range")

            if price is not None and price > 0:
                listing_data['price'] = price
            else:
                raise KeyError

        except KeyError as e:
            return HttpResponse(e, status=400)
        except ValueError as e:
            return HttpResponse(e, status=404)

        new_listing = Listing(
            property=property,
            start_dt=listing_data['start_dt'],
            end_dt=listing_data['end_dt'],
            price=listing_data['price'],
        )

        new_listing.save()

        serializer = ListingSerializer(new_listing, many=False)

        return Response(serializer.data, status=200)
    else:
        return HttpResponse("METHOD NOT ALLOWED", status=405)


@api_view(['POST'])
def listinglistview(request, propid, pagenum):
    if pagenum < 1:
        return HttpResponse("NOT FOUND", status=404)
    if request.method == 'POST':
        prop = Property.objects.filter(id=propid)
        if not prop.exists():
            return HttpResponse("NOT FOUND", status=404)

        prop = prop.get(id=propid)

        listings = Listing.objects.filter(property=prop).order_by('start_dt')
        print(listings)

        try:
            data = JSONParser().parse(request)

            # get filter data
            start = data.get('start_dt')
            end = data.get('end_dt')

            print("start_dt:", start)
            print("end_dt:", end)

            # apply filters to properties results where applicable
            if start is None or start=='':
                raise KeyError
            elif isinstance(start, str):
                print("before start convert")
                start = datetime.strptime(start, '%Y-%m-%d').date()

            if end is None or end=='':
                raise KeyError
            elif isinstance(end, str):
                print("before end convert")
                end = datetime.strptime(end, '%Y-%m-%d').date()

            if start > end:
                raise KeyError("Start date must be on or after end date")

            for x in listings:
                print("all listings:", x.start_dt, " ", x.end_dt, ":", x.price)

            # WORKING
            # overlap_start = listings.filter(start_dt__lte=start) & listings.filter(start_dt__gte=end)
            # overlap_end =  listings.filter(end_dt__gte=start) & listings.filter(start_dt__lte=end)

            # WORKING for 2023-04-23 to 2023-05-06
            # overlap_start = listings.filter(start_dt__lte=start) | listings.filter(start_dt__lte=end)
            # overlap_end =  listings.filter(end_dt__gte=start) | listings.filter(start_dt__gte=end)

            overlap_start = listings.filter(start_dt__lte=start) | listings.filter(start_dt__lte=end)
            overlap_end =  listings.filter(end_dt__gte=start) | listings.filter(start_dt__gte=end)
#             before_start = listings.filter()

            listings = overlap_start & overlap_end
            print("here")

            delta = timedelta(days=1)
            print("there")

            listing_dates = []
            for x in listings:
                s = x.start_dt
                e = x.end_dt

                while(s <= e):
                    print(s)
                    try:
                        listing_dates.append(s.isoformat())
                        s += delta
                    except Exception as e:
                        print(e)
                print("Listing dates:", listing_dates)

            start_copy = start
            reservation_dates = []
            while (start_copy <= end):
                reservation_dates.append(start_copy.isoformat())
                start_copy += delta
            print("Reservation dates:", reservation_dates)

            for x in reservation_dates:
                if not x in listing_dates:
                    raise Exception("Dates not available")

            print(listings)

        except Exception as e:
            return HttpResponse(e, status=404)
        except KeyError as e:
            return HttpResponse(e, status=404)

        # calculate pagination data
        listings_count = len(listings)
        page_count = math.ceil(listings_count / PAGESIZE)
        listings_pages = Paginator(listings, PAGESIZE)
        next_page = None if pagenum >= page_count else pagenum + 1
        prev_page = None if pagenum <= 1 else pagenum - 1

        try:
            results = listings_pages.page(pagenum)
        except:
            return HttpResponse("NOT FOUND", status=404)

        serializer = ListingSerializer(results, many=True)

        results_final = {
            "result_count": listings_count,
            "pagesize": PAGESIZE,
            "page_count": page_count,
            "next_page": next_page,
            "prev_page": prev_page,
            "data": serializer.data,
        }

        return Response(results_final, status=200)
    else:
        return HttpResponse("METHOD NOT ALLOWED", status=405)


@api_view(['GET'])
def listingdetailview(request, propid, listid):
    prop = Property.objects.filter(id=propid)
    if not prop.exists():
        return HttpResponse("NOT FOUND", status=404)

    prop = prop.get(id=propid)

    listing = Listing.objects.filter(id=listid, property=prop)

    if not listing.exists():
        return HttpResponse("NOT FOUND", status=404)

    listing = listing.get(id=listid)

    if request.method == 'GET':
        serializer = ListingSerializer(listing, many=False)
        result = dict(serializer.data)

        # amenities = [x.title for x in Amenity.objects.filter(property=prop)]
        # result['amenities'] = amenities

        return Response(result, status=200)
    else:
        return HttpResponse("METHOD NOT ALLOWED", status=405)

@api_view(['POST', 'DELETE'])
# @permission_classes([IsAuthenticated])
def listingupdateview(request, propid, listid):
    # uncomment when auth is available
#     prop = Property.objects.filter(id=propid, host=User.objects.get(id=request.user.id))
    prop = Property.objects.filter(id=propid)
    if not prop.exists():
        return HttpResponse("NOT FOUND", status=404)

    prop = prop.get(id=propid)

    listing = Listing.objects.filter(id=listid, property=prop)

    if not listing.exists():
        return HttpResponse("NOT FOUND", status=404)

    listing = listing.get(id=listid)

    if request.method == 'POST':
        listings = Listing.objects.filter(property=prop).exclude(id=listid)

        listing_data = {}

        try:
            update_start = False
            update_end = False
            update_price = False
            data = JSONParser().parse(request)

            # get filter data
            start_dt = data.get('start_dt')
            end_dt = data.get('end_dt')
            price = data.get('price')

            # apply filters to properties results where applicable
            if start_dt is not None:
                if len(start_dt) > 0:
                    # start_dt = str(datetime.strptime(start_dt, '%Y-%m-%d'))
                    listing_data['start_dt'] = start_dt
                    update_start = True
                else:
                    raise KeyError
            else:
                start_dt = str(Listing.objects.get(id=listid).start_dt)

            if end_dt is not None:
                if len(end_dt) > 0:
                    # end_dt = str(datetime.strptime(end_dt, '%Y-%m-%d'))
                    listing_data['end_dt'] = end_dt
                    update_end = True
                else:
                    raise KeyError
            else:
                end_dt = str(Listing.objects.get(id=listid).end_dt)

            if update_start or update_end:
                if start_dt >= end_dt:
                    raise ValueError("End Date cannot be on or before Start Date")

                listing_overlap_0_0 = listings.filter(start_dt__gte=start_dt, end_dt__lte=end_dt, ) & \
                                      listings.filter(start_dt__lte=end_dt, end_dt__gte=start_dt, )
                listing_overlap_0_1 = listings.filter(start_dt__gte=start_dt, end_dt__gte=end_dt, ) & \
                                      listings.filter(start_dt__lte=end_dt, end_dt__gte=start_dt, )
                listing_overlap_1_0 = listings.filter(start_dt__lte=start_dt, end_dt__lte=end_dt, ) & \
                                      listings.filter(start_dt__lte=end_dt, end_dt__gte=start_dt, )
                listing_overlap_1_1 = listings.filter(start_dt__lte=start_dt, end_dt__gte=end_dt, ) & \
                                      listings.filter(start_dt__lte=end_dt, end_dt__gte=start_dt, )

                if len(listing_overlap_0_0) + len(listing_overlap_0_1) + len(listing_overlap_1_0) + len(listing_overlap_1_1) > 0:
                    raise ValueError("Conflicting listing date range")

            if price is not None:
                if price > 0:
                    listing_data['price'] = price
                    update_price = True
                else:
                    raise KeyError

        except KeyError as e:
            return HttpResponse(e, status=400)
        except ValueError as e:
            return HttpResponse(e, status=404)

        if update_start:
            listing.start_dt = listing_data['start_dt']
        if update_end:
            listing.end_dt = listing_data['end_dt']
        if update_price:
            listing.price = listing_data['price']

        listing.save()

        serializer = ListingSerializer(listing, many=False)

        return Response(serializer.data, status=200)
    elif request.method == 'DELETE':
        listing.delete()
        return HttpResponse("Listing Deleted", status=200)
    else:
        return HttpResponse("METHOD NOT ALLOWED", status=405)


@api_view(['POST', 'GET'])
# @permission_classes([IsAuthenticated])
def uploadImage(request, propid, imagenum):
    print("upload image")
    if request.method=='POST': #  and request.FILES['upload']:
        if imagenum <= 0 or imagenum > 5:
            return HttpResponse("NOT FOUND", status=404)

#         prop = Property.objects.filter(id=propid, host=User.objects.get(id=request.user.id))
        prop = Property.objects.filter(id=propid)
        if not prop.exists():
            return HttpResponse("NOT FOUND", status=404)

        prop = prop.get(id=propid)

        print(request.content_type)
        if request.content_type.startswith('multipart'):
            post, files = request.parse_file_upload(request.META, request)
            file = files['file']
            print(file)
            image = Image()
            image.num = imagenum
            image.image = file
            image.property = prop
            image.save()
#             request.FILES.update(files)
#
#             request.POST = post.dict()


#         print(request.FILES.get("image"))
#         file = request.FILES.get("image")
# #         file = file[0]
#         print(file.filename)

#         image = Image()
#         image.file = file
#         image.num = imagenum
#         image.property = prop
#         image.save()
        serializer = ImageSerializer(image)
        print(serializer.data)
        data = serializer.data
        data['url'] = "http://localhost:8000"+data['image']
        return Response(data, status=200)
#         return HttpResponse(status=200)

    elif request.method=='GET':
        if imagenum <= 0 or imagenum > 5:
            return HttpResponse("NOT FOUND", status=404)

        prop = Property.objects.filter(id=propid, host=User.objects.get(id=request.user.id))
        if not prop.exists():
            return HttpResponse("NOT FOUND", status=404)

        prop = prop.get(id=propid)

        img = Image.objects.get(property=prop, num=imagenum)

        serializer = ImageSerializer(img)

        return JsonResponse(serializer.data, status=200)