# CarCreate


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**make** | **str** |  | 
**model** | **str** |  | 
**year** | **int** |  | 
**daily_rate** | **float** |  | 
**available** | **bool** |  | [optional] [default to True]

## Example

```python
from car_rental_sdk.models.car_create import CarCreate

# TODO update the JSON string below
json = "{}"
# create an instance of CarCreate from a JSON string
car_create_instance = CarCreate.from_json(json)
# print the JSON string representation of the object
print(CarCreate.to_json())

# convert the object into a dict
car_create_dict = car_create_instance.to_dict()
# create an instance of CarCreate from a dict
car_create_from_dict = CarCreate.from_dict(car_create_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


