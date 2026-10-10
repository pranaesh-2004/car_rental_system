# car_rental_sdk.HealthApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**health_check_get**](HealthApi.md#health_check_get) | **GET** / | Health Check


# **health_check_get**
> object health_check_get()

Health Check

### Example


```python
import car_rental_sdk
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
    api_instance = car_rental_sdk.HealthApi(api_client)

    try:
        # Health Check
        api_response = api_instance.health_check_get()
        print("The response of HealthApi->health_check_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling HealthApi->health_check_get: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

