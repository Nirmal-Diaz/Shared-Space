# Shared-Space
A simple file sharing app that works on HTTP using client-server architecture

## PREREQUISITES
1. Node.js
2. npm

## UPDATE DEPENDENCIES
1. Run command "npm update" from the project root
2. Make sure the "./node_modules" is created

## CREATE A LOCAL AREA NETWORK(LAN)
1. Just connect to a single router from all the devices you want to share files between

## SETUP THE SERVER
1. Run command "npm start" from the project root
2. Now the PC that executed the above command is configured as the server
3. Note down the IP address of the server (Hint: Just ask the OS what it is)

## HOW TO USE
1. Navigate to "http://ServerIpAddress:80" using the browser on the device that has the file to be uploaded
* "ServerIpAddress" should be replaced by the IP address of your server (eg: 192.169.1.5)
2. You will be represented by an interface that has a "+" button at the bottom ("+" button happens to be the upload button)
3. Use the upload button to add any file to the server
* Uploaded files will be located at "./shared/transferSpace" on the server
4. Navigate to "http://ServerIpAddress:80" using the browser on the device that you want the file to be downloaded
* "ServerIpAddress" should be replaced by the IP address of your server (eg: 192.169.1.5)
5. You will see all the uploaded files
6. Click on the icon next to any file to download that file
