# RentalResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **int** |  | 
**car_id** | **int** |  | 
**user_name** | **str** |  | 
**start_date** | **datetime** |  | 
**end_date** | **datetime** |  | 
**rental_date** | **datetime** |  | 
**cancelled_at** | **datetime** |  | [optional] 

## Example

```python
from car_rental_sdk.models.rental_response import RentalResponse

# TODO update the JSON string below
json = "{}"
# create an instance of RentalResponse from a JSON string
rental_response_instance = RentalResponse.from_json(json)
# print the JSON string representation of the object
print(RentalResponse.to_json())

# convert the object into a dict
rental_response_dict = rental_response_instance.to_dict()
# create an instance of RentalResponse from a dict
rental_response_from_dict = RentalResponse.from_dict(rental_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


