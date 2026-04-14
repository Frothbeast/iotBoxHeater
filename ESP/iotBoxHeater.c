#include <Arduino.h>

// Pin Definitions
const int PIN_NTC_BOX    = 0;  // GPIO 0
const int PIN_NTC_HEATER = 1;  // GPIO 1
const int PIN_HEATER     = 10; // GPIO 10
const int PIN_FAN        = 8;  // GPIO 8

// PWM Timing (0.1 Hz = 10 Second Period)
const unsigned long PERIOD_MS = 10000;

// Shared Globals
volatile float box_setpoint = 25.0;
volatile float current_temp_box = 0.0;
volatile float current_temp_heater = 0.0;
volatile int duty_cycle = 0; // 0-255

// --- Task 1: Control & Logic (Runs at 10Hz) ---
void TaskControl(void *pvParameters) {
  for (;;) {
    // 1. Read 12-bit ADCs (0-4095)
    int raw_box = analogRead(PIN_NTC_BOX);
    int raw_heater = analogRead(PIN_NTC_HEATER);
    
    // 2. Convert to Celsius (Using your PIC logic adjusted for 3.3V/4095)
    current_temp_box = (raw_box / 4095.0) * 100.0; 
    current_temp_heater = (raw_heater / 4095.0) * 100.0;

    // 3. Simple Proportional Control
    float error = box_setpoint - current_temp_box;
    duty_cycle = constrain((int)(error * 50), 0, 255);

    // 4. Safety Cutoff
    if (current_temp_heater > 80.0) duty_cycle = 0;

    vTaskDelay(pdMS_TO_TICKS(100)); 
  }
}

// --- Task 2: 0.1 Hz Heater Drive ---
void TaskHeaterPWM(void *pvParameters) {
  pinMode(PIN_HEATER, OUTPUT);
  for (;;) {
    int active_duty = duty_cycle; // Snapshot for this cycle
    
    unsigned long on_time = (active_duty * PERIOD_MS) / 255;
    unsigned long off_time = PERIOD_MS - on_time;

    if (on_time > 0) {
      digitalWrite(PIN_HEATER, HIGH);
      vTaskDelay(pdMS_TO_TICKS(on_time));
    }
    if (off_time > 0) {
      digitalWrite(PIN_HEATER, LOW);
      vTaskDelay(pdMS_TO_TICKS(off_time));
    }
  }
}

void setup() {
  Serial.begin(115200);
  
  // Configure ADC for 0-3.3V range
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db); 

  // Create tasks (C3 is single-core, but FreeRTOS manages time-slicing)
  xTaskCreate(TaskControl, "Control", 4096, NULL, 2, NULL);
  xTaskCreate(TaskHeaterPWM, "Heater", 2048, NULL, 1, NULL);
}

void loop() {
  // FreeRTOS handles the tasks. Serial/WiFi would go here or in a 3rd task.
}