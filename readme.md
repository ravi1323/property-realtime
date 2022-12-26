# events
  - user:signin
  - user:signin:fail
  - user:signin:success
  -----
  - user:signup
    - payload
      ```json
      {
        "firstname": "ravi",
        "lastname": "vora",
        "email": "webbyworking@gmail.com",
        "phone": "9328620376",
        "password": "ravi@123$",
        "confirm_password": "ravi@123$"
      }
      ```
  - user:signup:fail
  - user:signup:success
