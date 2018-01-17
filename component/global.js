
module.exports = {
  auth_key:{
    grant_type:'client_credentials',
    client_id:1,
    client_secret:'NKbqe8ovfMetW8WYimVN7MtNHSsy6tCo6mm7WU9Y'
  },
  url: 'https://diadiem.kingmap.vn/api/',
  url_media: 'https://diadiem.kingmap.vn',
  secret_key: {
    token_type: "Bearer",
    expires_in: 1296000,
    access_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImFhZDZmOWNiNzVlYjkxZTJlMDU1NmI4OWQ2MmQxMDkwMjgxNTk4ZWZiYjQyZmM0NWY3N2Y1N2Y1ZjlmYzJlNjkxN2UyNDA5YTQxYTkxZTMzIn0.eyJhdWQiOiIxIiwianRpIjoiYWFkNmY5Y2I3NWViOTFlMmUwNTU2Yjg5ZDYyZDEwOTAyODE1OThlZmJiNDJmYzQ1Zjc3ZjU3ZjVmOWZjMmU2OTE3ZTI0MDlhNDFhOTFlMzMiLCJpYXQiOjE1MTM4MjEyNjgsIm5iZiI6MTUxMzgyMTI2OCwiZXhwIjoxNTE1MTE3MjY4LCJzdWIiOiIiLCJzY29wZXMiOltdfQ.r5PrjinuMUdrlYqPvH_p5xJg_MKRB7VDDDFAj-GeGxeoS4QnXvQC13kmAMQtU6WGLTF5oCT1rjnPRoum2KNrz7GHXVMpdRL9ynZnalg0V0zfL5_WSnYucGQo0UgpbPSyzPqCgPCbhjc5TTf8_udt-uXgRTJiLI8UvugCDdEqnvX1lvrMbPYIqY6hbVyaGyB7NDrpc4ipY3wLdg4uPOoHGNno4Shak1iIuXL3nNlGvg_4H0VJhluIwb4_TkzD4QvtfKb0qecbIeK4p5esHEKedmxCPjm2bKxkbRmUHwpQQGm2KVueLv2DLquw5oOTJUQbJYwxhk3KP_2ofYTdn8-BmDGGRe6QdQe-CVOsZqvq9oN5gmrv-hp0t7QZ442CRLAQxUJYmyYMdmBg2Om0yxHtNJXI8eNQfETCb2FooDmKZfGNjoqIBNwQFvyJIzIVin3waU8SUKjyuSqzj9MqmY8ifnOSaAzO5mOpKykUBQP6zPH0fftm6AKg2ZrYr-dvXoyHe0bbVBcXrDm80sPgOUclpqceYuD1xSptNJndh6gw9C4ip0qhdP0Qo_xgGr-9t6PsueM9-E2zUlXnml3s1Z4bHutPv2Nl6F93Cnvsw8i5eI-7SzBsrAjeYOK04EuWUp0NG-X10jM2eNdjlJIANkD44Wz1NPDtt539wvBkzB3vN-o"
},
  country: [],
  city:[],
  style_map: [{
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [{
        "visibility": "off"
      }]
  },
  {
    "featureType": "poi",
    "stylers": [{
        "visibility": "off"
      }]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [{
        "visibility": "off"
      }]
  },
  {
    "featureType": "transit",
    "stylers": [{
        "visibility": "off"
      }]
  }],
  style_map_ios: [
    {
    	"featureType": "poi.business",
    	"stylers": [{"visibility": "off"}]
     },
     {
    	"featureType": "poi.park",
    	"elementType": "labels.text",
    	"stylers": [{
    			"visibility": "off"
    }]
  }],
};
