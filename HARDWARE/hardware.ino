#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <EEPROM.h>

//Variables
int i = 0;
int statusCode;
const char* ssid = "Default_SSID";
const char* passphrase = "Default_Password";
String st;
String epass = "";
String content;
String esid;
const unsigned long serverRunInterval = 5 * 60 * 1000;
const unsigned long wifitime = 60;


//Function Decalration
bool testWifi(void);
void launchWeb(void);
void setupAP(void);
void execution(void);

//Establishing Local server at port 80 whenever required
ESP8266WebServer server(80);

void setup() {

  Serial.begin(115200);  //Initialising if(DEBUG)Serial Monitor
  Serial.println();
  Serial.println("Disconnecting current wifi connection");
  WiFi.disconnect();
  EEPROM.begin(512);  //Initialasing EEPROM
  delay(10);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.println();
  Serial.println();
  Serial.println("Startup");

  //---------------------------------------- Read eeprom for ssid and pass
}
void loop() {
  while (WiFi.status() == WL_CONNECTED) {
    execution();
    delay(1000);
  }
  for (int i = 0; i < 32; ++i) {
    esid += char(EEPROM.read(i));
  }
  Serial.println();
  Serial.print("SSID: ");
  Serial.println(esid);
  Serial.println("Reading EEPROM pass");


  for (int i = 32; i < 96; ++i) {
    epass += char(EEPROM.read(i));
  }
  Serial.print("PASS: ");
  Serial.println(epass);


  WiFi.begin(esid.c_str(), epass.c_str());
  if (testWifi()) {
    Serial.println("Succesfully Connected!!!");
    return;
  } else {
    Serial.println("Turning the HotSpot On");
    launchWeb();
    setupAP();  // Setup HotSpot
  }

  Serial.println();
  Serial.println("Waiting.");
  unsigned long startTime = millis();
  unsigned long time = millis() - startTime;

  while ((WiFi.status() != WL_CONNECTED) && (time < serverRunInterval)) {
    time = millis() - startTime;
    Serial.print(".");
    delay(100);
    server.handleClient();
  }
}

void execution() {
  Serial.println("code executions");
}


//----------------------------------------------- Fuctions used for WiFi credentials saving and connecting to it which you do not need to change
bool testWifi(void) {
  int c = 0;
  Serial.println("Waiting for Wifi to connect");
  while (c < wifitime) {
    if (WiFi.status() == WL_CONNECTED) {
      return true;
    }
    delay(1000);
    Serial.print("*");
    c++;
  }
  Serial.println("");
  Serial.println("Connect timed out, opening AP");
  return false;
}

void launchWeb() {
  Serial.println("");
  if (WiFi.status() == WL_CONNECTED)
    Serial.println("WiFi connected");
  Serial.print("Local IP: ");
  Serial.println(WiFi.localIP());
  Serial.print("SoftAP IP: ");
  Serial.println(WiFi.softAPIP());
  createWebServer();
  // Start the server
  server.begin();
  Serial.println("Server started");
}

void setupAP(void) {
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);
  int n = WiFi.scanNetworks();
  Serial.println("scan done");
  if (n == 0)
    Serial.println("no networks found");
  else {
    Serial.print(n);
    Serial.println(" networks found");
    for (int i = 0; i < n; ++i) {
      // Print SSID and RSSI for each network found
      Serial.print(i + 1);
      Serial.print(": ");
      Serial.print(WiFi.SSID(i));
      Serial.print(" (");
      Serial.print(WiFi.RSSI(i));
      Serial.print(")");
      Serial.println((WiFi.encryptionType(i) == ENC_TYPE_NONE) ? " " : "*");
      delay(10);
    }
  }
  Serial.println("");
  st = "<ol>";
  for (int i = 0; i < n; ++i) {
    // Print SSID and RSSI for each network found
    st += "<li>";
    st += WiFi.SSID(i);
    st += " (";
    st += WiFi.RSSI(i);

    st += ")";
    st += (WiFi.encryptionType(i) == ENC_TYPE_NONE) ? " " : "*";
    st += "</li>";
  }
  st += "</ol>";
  delay(100);
  WiFi.softAP("Leaf-Reminder", "");
  Serial.println("Initializing_softap_for_wifi credentials_modification");
  launchWeb();
  Serial.println("over");
}

void createWebServer() {
  {
    server.on("/", []() {
      IPAddress ip = WiFi.softAPIP();
      String ipStr = String(ip[0]) + '.' + String(ip[1]) + '.' + String(ip[2]) + '.' + String(ip[3]);

      content = "<!DOCTYPE HTML>\r\n<html>";
      content += "<head><title>Wi-Fi Configuration</title></head>";
      content += "<style>";
      content += "body {";
      content += "  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;";
      content += "  text-align: center;";
      content += "  background-color: #000;";
      content += "  color: #fff;";
      content += "}";
      content += ".container {";
      content += "  max-width: 600px;";
      content += "  margin: 0 auto;";
      content += "  background: linear-gradient(to bottom, #4CAF50, #388E3C);";
      content += "  border: 2px solid #ddd;";
      content += "  padding: 20px;";
      content += "  border-radius: 5px;";
      content += "  background-color: #111;";
      content += "  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);";
      content += "  transition: transform 0.3s ease;";  // Add a transition effect
      content += "}";
      content += ".container:hover {";
      content += "  transform: scale(1.02);";  // Enlarge the container on hover
      content += "}";
      content += "h1 {";
      content += "  color: black;";
      content += "  font-size: 40px;";      // Increase font size for the title
      content += "  margin-bottom: 20px;";  // Add margin below the title
      content += "}";
      content += ".input-container {";
      content += "  text-align: left;";
      content += "  margin: 0 20px;";
      content += "}";
      content += "label {";
      content += "  display: block;";
      content += "  margin-bottom: 10px;";  // Increase margin below labels
      content += "  color: #4CAF50;";       // Change label color
      content += "}";
      content += "input[type='text'], input[type='password'] {";
      content += "  width: 100%;";
      content += "  padding: 10px;";
      content += "  margin-bottom: 20px;";        // Increase margin below input fields
      content += "  border: 1px solid #4CAF50;";  // Change border color
      content += "  border-radius: 3px;";
      content += "  background-color: #222;";  // Change input field background color
      content += "  color: white;";            // Change text color
      content += "  font-size: 20px;";
      content += "  margin-right: 20px;";
      content += "}";
      content += "input[type='submit'] {";
      content += "  background-color: #4CAF50;";
      content += "  color: #fff;";
      content += "  padding: 10px 20px;";
      content += "  border: none;";
      content += "  border-radius: 3px;";
      content += "  cursor: pointer;";
      content += "  font-size: 16px;";
      content += "  transition: background-color 0.3s ease;";
      content += "}";
      content += "input[type='submit']:hover {";
      content += "  background-color: #45a049;";
      content += "  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);";  // Add a box shadow on hover
      content += "}";

      content += "</style>";
      content += "<body>";
      content += "<div class='container'>";
      content += "<h1>Leaf-Reminder</h1>";  // Added the title here
      content += "<p>Current IP Address: " + ipStr + "</p>";

      // Form for configuring Wi-Fi SSID and password
      content += "<form action=\"/scan\" method=\"POST\"><input type=\"submit\" value=\"scan\"></form>";
      content += st;
      content += "<form method='get' action='setting'>";
      content += "<label for='ssid'>SSID: </label><input type='text' name='ssid' placeholder='Enter SSID' required>";
      content += "<label for='pass'>Password:</label><input type='password' name='pass' placeholder='Enter Password' required>";
      content += "<input type='submit' value='Save Wi-Fi Credentials'>";
      content += "</form>";
      content += "</div></body></html>";
      server.send(200, "text/html", content);
    });
    server.on("/scan", []() {
      //setupAP();
      IPAddress ip = WiFi.softAPIP();
      String ipStr = String(ip[0]) + '.' + String(ip[1]) + '.' + String(ip[2]) + '.' + String(ip[3]);

      content = "<!DOCTYPE HTML>\r\n<html>Go back and check the page";
      server.send(200, "text/html", content);
    });

    server.on("/setting", []() {
      String qsid = server.arg("ssid");
      String qpass = server.arg("pass");
      if (qsid.length() > 0 && qpass.length() > 0) {
        Serial.println("clearing eeprom");
        for (int i = 0; i < 96; ++i) {
          EEPROM.write(i, 0);
        }
        Serial.println(qsid);
        Serial.println("");
        Serial.println(qpass);
        Serial.println("");

        Serial.println("writing eeprom ssid:");
        for (int i = 0; i < qsid.length(); ++i) {
          EEPROM.write(i, qsid[i]);
          Serial.print("Wrote: ");
          Serial.println(qsid[i]);
        }
        Serial.println("writing eeprom pass:");
        for (int i = 0; i < qpass.length(); ++i) {
          EEPROM.write(32 + i, qpass[i]);
          Serial.print("Wrote: ");
          Serial.println(qpass[i]);
        }
        EEPROM.commit();

        content = "{\"Success\":\"saved to eeprom... reset to boot into new wifi\"}";
        statusCode = 200;
        ESP.reset();
      } else {
        content = "{\"Error\":\"404 not found\"}";
        statusCode = 404;
        Serial.println("Sending 404");
      }
      server.sendHeader("Access-Control-Allow-Origin", "*");
      server.send(statusCode, "application/json", content);
    });
  }
}
