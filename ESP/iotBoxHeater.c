#include <WiFi.h>
#include <WiFiManager.h> 
#include <WiFiClient.h>
#include "config.h"

WiFiClient client;
char static_ip[16] = SERVER_IP;
char static_port[6] = SERVER_PORT;

void setup() {
  Serial.begin(115200); // Debug
  Serial1.begin(9600, SERIAL_8N1, 20, 21); // PIC Connection

  WiFiManager wm;
  WiFiManagerParameter custom_ip("ip", "Target IP", static_ip, 16);
  WiFiManagerParameter custom_port("port", "Target Port", static_port, 6);
  wm.addParameter(&custom_ip);
  wm.addParameter(&custom_port);

  if (!wm.autoConnect("ESP32-Heater-Setup")) {
    ESP.restart();
  }

  strcpy(static_ip, custom_ip.getValue());
  strcpy(static_port, custom_port.getValue());
  Serial.println("System Ready.");
}

void loop() {
  // 1. Handle PIC -> ESP32 (AT Commands & Data)
  if (Serial1.available()) {
    String command = Serial1.readStringUntil('\n');
    command.trim();

    if (command.startsWith("AT+CIPSTART")) {
      // Mimic successful TCP connection
      if (client.connect(static_ip, atoi(static_port))) {
        Serial1.println("CONNECT");
        Serial1.println("OK");
      }
    } 
    else if (command.startsWith("AT+CIPSEND")) {
      // Tell PIC it's ready to receive data
      Serial1.println("OK");
      Serial1.print("> ");
    }
    else if (command.length() >= 10) { 
      // This is the data payload (e.g., "00FE01A403")
      // Calculate real RSSI (0-100 scale for your database)
      int32_t rssi_raw = WiFi.RSSI();
      uint8_t rssi_scaled = map(constrain(rssi_raw, -100, -40), -100, -40, 0, 100);
      
      // Append RSSI to the hex string to make it 12 characters
      char final_payload[14];
      sprintf(final_payload, "%s%02X", command.c_str(), rssi_scaled);
      
      if (client.connected()) {
        client.print(final_payload);
        Serial1.println("SEND OK");
      }
    }
    else {
      // Generic "OK" for any other initialization AT commands
      Serial1.println("OK");
    }
  }

  // 2. Handle Server -> PIC (Feedback/ACKs)
  if (client.available()) {
    while (client.available()) {
      Serial1.write(client.read());
    }
  }
}