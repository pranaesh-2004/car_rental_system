# car_rental_sdk.CarsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_car_cars_post**](CarsApi.md#create_car_cars_post) | **POST** /cars/ | Create Car
[**get_car_cars_car_id_get**](CarsApi.md#get_car_cars_car_id_get) | **GET** /cars/{car_id} | Get Car
[**get_cars_cars_get**](CarsApi.md#get_cars_cars_get) | **GET** /cars/ | Get Cars
[**rent_car_cars_car_id_rent_post**](CarsApi.md#rent_car_cars_car_id_rent_post) | **POST** /cars/{car_id}/rent | Rent Car


# **create_car_cars_post**
> CarResponse create_car_cars_post(car_create)

Create Car

### Example


```python
import car_rental_sdk
from car_rental_sdk.models.car_create import CarCreate
from car_rental_sdk.models.car_response import CarResponse
from car_rental_sdk.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = car_rental_sdk.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with car_rental_sdk.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = car_rental_sdk.CarsApi(api_client)
    car_create = car_rental_sdk.CarCreate() # CarCreate | 

    try:
        # Create Car
        api_response = api_instance.create_car_cars_post(car_create)
        print("The response of CarsApi->create_car_cars_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling CarsApi->create_car_cars_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **car_create** | [**CarCreate**](CarCreate.md)|  | 

### Return type

[**CarResponse**](CarResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_car_cars_car_id_get**
> CarResponse get_car_cars_car_id_get(car_id)

Get Car

### Example


```python
import car_rental_sdk
from car_rental_sdk.models.car_response import CarResponse
from car_rental_sdk.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = car_rental_sdk.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with car_rental_sdk.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = car_rental_sdk.CarsApi(api_client)
    car_id = 56 # int | 

    try:
        # Get Car
        api_response = api_instance.get_car_cars_car_id_get(car_id)
        print("The response of CarsApi->get_car_cars_car_id_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling CarsApi->get_car_cars_car_id_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **car_id** | **int**|  | 

### Return type

[**CarResponse**](CarResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_cars_cars_get**
> List[CarResponse] get_cars_cars_get(start_date=start_date, end_date=end_date)

Get Cars

### Example


```python
import car_rental_sdk
from car_rental_sdk.models.car_response import CarResponse
from car_rental_sdk.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = car_rental_sdk.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with car_rental_sdk.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = car_rental_sdk.CarsApi(api_client)
    start_date = '2013-10-20' # date |  (optional)
    end_date = '2013-10-20' # date |  (optional)

    try:
        # Get Cars
        api_response = api_instance.get_cars_cars_get(start_date=start_date, end_date=end_date)
        print("The response of CarsApi->get_cars_cars_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling CarsApi->get_cars_cars_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **start_date** | **date**|  | [optional] 
 **end_date** | **date**|  | [optional] 

### Return type

[**List[CarResponse]**](CarResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **rent_car_cars_car_id_rent_post**
> RentalResponse rent_car_cars_car_id_rent_post(car_id, rental_create)

Rent Car

### Example


```python
import car_rental_sdk
from car_rental_sdk.models.rental_create import RentalCreate
from car_rental_sdk.models.rental_response import RentalResponse
from car_rental_sdk.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = car_rental_sdk.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with car_rental_sdk.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = car_rental_sdk.CarsApi(api_client)
    car_id = 56 # int | 
    rental_create = car_rental_sdk.RentalCreate() # RentalCreate | 

    try:
        # Rent Car
        api_response = api_instance.rent_car_cars_car_id_rent_post(car_id, rental_create)
        print("The response of CarsApi->rent_car_cars_car_id_rent_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling CarsApi->rent_car_cars_car_id_rent_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **car_id** | **int**|  | 
 **rental_create** | [**RentalCreate**](RentalCreate.md)|  | 

### Return type

[**RentalResponse**](RentalResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

