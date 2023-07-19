---
layout: samples
title: 'API Documentation Writing Sample #1'
image: 
permalink: /api/
---

The following is an example that shows how a user could connect with a basic Token API to a web application. 

# GET - Get Access Token 

https://sandbox.sample/Token 

## Description 

To allow your application to access the platform and other APIs, you must use the **Token API**.

This method will log you into the platform with your credentials and provide you with an access token for your application.

Your application may call the **Token API** multiple times. Every time you call the **Token API** with valid credentials, the platform issues a new token to your application and discards any existing tokens. 

It's recommended to call the **Token API** once, store the token, and reuse it until its expiry. When your token expires, call the API again to receive a new token.

**Note**: The token issued by the **Token API** is only valid for 15 days from its issue date. Check the expiry date of your token with the `.expires` response parameter, or refer to the `expires_in` parameter for the length of time, in seconds, until your token expires.

## Request Body

In the **Token API** request body, you must include a `grant_type` of `password`, and your username and password for the platform.

## Returns

The **Token API** returns a `200 OK` response code, and an access token:

| **Attribute** | **Description** |
| :----------   | :-------------- |
| access_token | Your client application's access token, which you can use to access additional platform APIs. 
| token_type | The token type of the Token API. The token type is `bearer`.
| expires_in | The amount of time, in seconds, before the access token expires. When the Token API first issues a token, the `expires_in` value equals 14 days, in seconds. |
| userName | The username that generated the access token. |
| userId | The unique User ID assigned to the username in the system. | 
| role | The role assigned to the user in the system. | 
| .issued | The date and time that the API issued the access token. Format: `Mon/Tue/Wed/Thurs/Fri/Sat/Sun. DD mmm YYYY HH:MM:SS GMT` 
| .expires | The date and time that the access token expires. Format: `Mon/Tue/Wed/Thurs/Fri/Sat/Sun. DD mmm YYYY HH:MM:SS GMT` |

## Authorization 

Basic Auth 

### Headers 

**Content-Type** application/json 

### Body (urlencoded)

**grant_type** - Specify the grant_type value as `password`. 

**username** - The username you use to access the platform. 

**password** - The password for the username you use to access the platform. 

## Example Request 

```
curl --location --request GET 'https://sandbox.sample/Token' \
--header 'Content-Type: application/json' \
--data-urlencode 'grant_type=password' \
--data-urlencode 'username=username' \
--data-urlencode 'password=password'
```

## Example Response 

```json
{
    "access_token": "_OKlRyxchDiJgKXaOoz6gHMLNjmGGZHr27kyDG6NgbMlnOUJqatgglDePpDCCzRxr1Mj0jtked0pTJDhuJOt1cWeGrigebwvXacwYPJBc2_QxEsgsJX2WMGOvY7TGarhwflE7oDO_0OPU5QrywLZMuBlTGCGOLhwnGYZ9Mb-_EwCxKRl5dAdSd5_1GUeKEa8OpMs7Rm9JuyOfyVmlQWYzebeaPdVC_t4RR9ie8zrcHUEy7n9aHxkh4OXc7DFg4HjaBHAdWFySg0ZCWaCEwVCZggNJSN2XTrMbiWxkp9sMGIKdsMC7JLWk8J94idHfvm0JvjpZ2PtwH-L1aRzwsxqz4u95dp5Zoe9j3YSvqVOhEOEVXHueynpdUnLEvXMJ7Kg-WiwTh4UP7p8z2K1bdsCKaZdIHIjmSbsXmd0NDK-CzusBgpFpFEO5VWa0-2OOuk0KNM_35kxOzHzR9DMsl-lmRB9hFBRjjbHIB_OUeQN_SgJdELCLsqaZSRruHAAREwK7CLv3kwgQY5LTHdh4sxqKcUj8mS4YDOg-zlni5pig24",
    "token_type": "bearer",
    "expires_in": 1209599,
    "userName": "user@example.com",
    "userId": "614a1d03-873d-489e-9ab5-fb53b0a0c64f",
    "role": "Administrator",
    ".issued": "Sun, 13 Sep 2020 09:35:33 GMT",
    ".expires": "Sun, 27 Sep 2020 09:35:33 GMT"
}
```