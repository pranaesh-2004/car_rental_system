# CarResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **int** |  | 
**make** | **str** |  | 
**model** | **str** |  | 
**year** | **int** |  | 
**daily_rate** | **float** |  | 
**available** | **bool** |  | 

## Example

```python
from car_rental_sdk.models.car_response import CarResponse

# TODO update the JSON string below
json = "{}"
# create an instance of CarResponse from a JSON string
car_response_instance = CarResponse.from_json(json)
# print the JSON string representation of the object
print(CarResponse.to_json())

# convert the object into a dict
car_response_dict = car_response_instance.to_dict()
# create an instance of CarResponse from a dict
car_response_from_dict = CarResponse.from_dict(car_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


