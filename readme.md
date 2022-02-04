# Collabora Integration with Angular WebApp

## Steps to install and run collabora docker image : 
1. Run command ```docker pull collabora/code``` to pull the collabora docker images
2. Run command ```docker run -t -d -p 9980:9980 -e "extra_params=--o:ssl.enable=false" collabora/code``` to start the collabora server
3. Open your browser and visit ```http://youripaddress:9980```. It should return OK if everything is working correctly

## Steps to start wopi host : 
1. Open the server folder in the terminal
2. Run command ```npm install``` to install the dependencies
3. Run command ```npm run dev-start``` to build and start the the server
4. Open your browser and visit ```http://youripaddress:3000```. It should return the url for collabora server along with access_token if everything is working correctly

## Steps to start browser client :
1. Open the client folder in the terminal
2. Run command ```npm install``` to install the dependencies
3. Run command ```ng serve --host 0.0.0.0``` to start the client on your ip address
4. Open your browser and visit ```http://youripaddress:4200```. It should return html page with a input box, create file button & get files button if everything is working correctly

## Steps to test end-to-end integration :
1. After setting up all 3 services correctly visit ```http://youripaddress:4200```
2. Enter a name of a file you want to create in the input box
3. Click the ```create file``` button to create the file with given name
4. Click the ```get files``` button to fetch the list of created files
5. Click on the filename from the list you want to edit. It shoud display a editor with your file name if everything was setup correctly

### *** Note : *** 
1. **_Wherever you find the ip address in client/server code replace it with your machine ip address_**
2. **_Use only your IP address in the browser. It won't work with 127.0.0.1 or localhost_**