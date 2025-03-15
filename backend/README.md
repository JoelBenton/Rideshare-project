Firebase Admin Setup - https://firebase.google.com/docs/admin/setup?hl=en&authuser=0&_gl=1*1kgarh7*_ga*MjA1NzU2NzA4NS4xNzMyMTg4ODYy*_ga_CW55HF8NVT*MTczMjU1MTY0My4zLjEuMTczMjU1NDI5NS4zNS4wLjA.

## Approach for Authentication

Summary of This Approach:

    •	Frontend:
    •	The user registers with email and password using Firebase.
    •	After registration, Firebase provides the ID token (JWT).
    •	The frontend sends the ID token and username to the backend for storage.
    •	Backend:
    •	The backend verifies the Firebase ID token to authenticate the user.
    •	The backend stores the username and firebaseUid but does not store the email.
    •	Firebase manages the email securely and ensures its uniqueness.

Why This is a Good Approach:

    1.	Email Management: Firebase manages email-related concerns such as uniqueness, verification, and password recovery. Your backend doesn’t need to worry about email at all.
    2.	Security: Since you don’t store the email in your backend, you reduce the exposure of sensitive information in your database. The email is stored and managed by Firebase, which is a secure service for handling user authentication.
    3.	Simpler Backend: The backend only needs to handle the username and firebaseUid, reducing the complexity and scope of your backend user management.
    4.	Firebase Authentication: By leveraging Firebase’s authentication system, you can offload the security concerns related to password management, token verification, and user authentication to Firebase, which is optimized for this purpose.
    5.	Flexibility: If you later want to add additional authentication methods (Google, Facebook, etc.), Firebase handles these seamlessly, and your backend remains focused on non-authentication logic.

Potential Drawback:

The main trade-off is that your backend will be somewhat dependent on Firebase for user authentication and email management.


## How to setup Docker instance of Backend for Running in a Server

### 1. Setup Docker image

Navigate to your project folder on the Raspberry Pi and build the Docker image:

```
docker build -t adonis-app .
```

This might take a few minutes as it installs dependencies.

### 2. Step 3: Run the Container Manually (For Testing)

Before setting it up in Portainer (If using), test the container to ensure it works:

```
docker run -p 3333:3333 --env-file .env adonis-app
```

- If you need hot reloading, mount the project directory:
```
docker run -p 3333:3333 -v /home/pi/adonis-app:/app adonis-app
```

### 3. Deploy via Portainer

1. Access Portainer
2. Create a New Container
	1.	Click “Containers” > “Add container”
	2.	Name the container: adonis-app
	3.	Use your built image:
In the Image field, type: `adonis-app`
    4.	Set the network settings: Under Port mapping, add: `Host: 3333 | Container: 3333`
    5.	Mount Volumes (Optional, for Hot Reloading): `/home/pi/adonis-app:/app`
    6.	Set Environment Variables
       1. Click “Env” and add: `Key: PORT Value: 3333`
    7. Command to run: `NPM RUN DEV`
    8. Click Deploy Container



