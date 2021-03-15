# brilliant-lunch
Meeting Time Caclulator


# Setup


Run `npm install` to install dependencies.

Run `npm start` to run the project.


# Example request to calculate meeting time

```
curl -X POST \
  http://localhost:5030/api/lunch \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: d12b30ab-72b2-4d0f-8424-3299226e5841' \
  -H 'cache-control: no-cache' \
  -d '[{"Start": 225, "End": 285}, {"Start": 210, "End": 270}, {"Start": 180, "End": 240}, {"Start": 240, "End": 300}, {"Start": 300, "End": 360}, {"Start": 270, "End": 330} ]'
```
