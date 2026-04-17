#include <WiFi.h>
#include <WiFiManager.h> // Install via Library Manager
#include <WiFiUdp.h>
#include "config.h"

// Configuration variables
char static_ip[16] = SERVER_IP;
char static_port[6] = SERVER_PORT;
WiFiUDP udp;

void setup() {
  // Serial0 = Debug, Serial1 = PIC18LF2580(use 9600 for many reasons)
  // C3 Pins: RX=20, TX=21
  Serial.begin(115200);
  Serial1.begin(9600, SERIAL_8N1, 20, 21);

  WiFiManager wm;

  // Add custom fields to the Config Portal
  WiFiManagerParameter custom_ip("ip", "Target IP", static_ip, 16);
  WiFiManagerParameter custom_port("port", "Target Port", static_port, 6);
  wm.addParameter(&custom_ip);
  wm.addParameter(&custom_port);

  // If it can't connect, it opens a portal named "ESP32-Project-Setup"
  if (!wm.autoConnect("ESP32-Project-Setup")) {
    Serial.println("Config failed, resetting...");
    delay(3000);
    ESP.restart();
  }

  // Save the values entered in the portal
  strcpy(static_ip, custom_ip.getValue());
  strcpy(static_port, custom_port.getValue());

  Serial.println("Connected. Transmitting to " + String(static_ip) + ":" + String(static_port));
}

void loop() {
  // 1. Data from PIC -> ESP32 -> Network
  if (Serial1.available()) {
    udp.beginPacket(static_ip, atoi(static_port));
    while (Serial1.available()) {
      udp.write(Serial1.read());
    }
    udp.endPacket();
  }

  // 2. Data from Network -> ESP32 -> PIC
  int packetSize = udp.parsePacket();
  if (packetSize) {
    while (udp.available()) {
      Serial1.write(udp.read());
    }
  }
}