# car_rental_sdk.RentalsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**cancel_rental_rentals_rental_id_delete**](RentalsApi.md#cancel_rental_rentals_rental_id_delete) | **DELETE** /rentals/{rental_id} | Cancel Rental


# **cancel_rental_rentals_rental_id_delete**
> RentalResponse cancel_rental_rentals_rental_id_delete(rental_id)

Cancel Rental

### Example


```python
import car_rental_sdk
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
    api_instance = car_rental_sdk.RentalsApi(api_client)
    rental_id = 56 # int | 

    try:
        # Cancel Rental
        api_response = api_instance.cancel_rental_rentals_rental_id_delete(rental_id)
        print("The response of RentalsApi->cancel_rental_rentals_rental_id_delete:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RentalsApi->cancel_rental_rentals_rental_id_delete: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **rental_id** | **int**|  | 

### Return type

[**RentalResponse**](RentalResponse.md)

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

