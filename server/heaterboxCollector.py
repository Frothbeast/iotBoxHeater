import os
import socket
import mysql.connector
import time
from datetime import datetime, timedelta
from dotenv import load_dotenv
import threading
import queue
load_dotenv()

# Create a thread-safe queue
db_queue = queue.Queue()

DB_CONFIG = {
    'host': os.getenv('DB_HOST'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASS'),
    'database': os.getenv('DB_NAME'),
}

def db_worker():
    while True:
        data = db_queue.get() # Wait for data to arrive
        try:
            hex_str = data.decode('ascii').strip()
            
            if len(hex_str) == 20:
                raw_h = int(hex_str[0:4], 16)   
                raw_b = int(hex_str[4:8], 16)   
                fan = int(hex_str[8:9], 16)    
                light = int(hex_str[9:10], 16) 
                heater = int(hex_str[10:11], 16)
                control = int(hex_str[11:12], 16)
                extra = int(hex_str[12:14], 16)
                setpoint = int(hex_str[14:18], 16) 
                rssi = int(hex_str[18:20], 16)

                now = datetime.now()

                conn_db = mysql.connector.connect(**DB_CONFIG)
                cursor = conn_db.cursor()

                query = """
                    INSERT INTO heaterData 
                    (datetime, tempBox, tempHeater, fan, light, heater, control, extra, setpoint, RSSI) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(query, (now, raw_b/10, raw_h/10, fan, light, heater, control, extra, setpoint/10, rssi))

                conn_db.commit()
                cursor.close()
                conn_db.close()
        except Exception as e:
            print(f"Database error: {e}")
        finally:
            db_queue.task_done()

# Start the worker thread before start_collector()
threading.Thread(target=db_worker, daemon=True).start()


def start_collector():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((os.getenv('BIND_HOST'), int(os.getenv('COLLECTOR_PORT'))))
    server_socket.listen(20)

    while True:
        try:
            conn, addr = server_socket.accept()
            data = conn.recv(1024)
            if data:
                db_queue.put(data) # Offload work to thread
                conn.sendall(b"ACK")
            conn.close()
        except Exception as e:
            time.sleep(2)

if __name__ == "__main__":
    start_collector()