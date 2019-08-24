import RPi.GPIO as GPIO
from time import sleep
import sys

LED = 13

def main():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(LED, GPIO.OUT)
    GPIO.output(LED, GPIO.HIGH)
    sleep(0.5)
    GPIO.output(LED, GPIO.LOW)
    sleep(0.5)
    GPIO.output(LED, GPIO.HIGH)
    sleep(0.5)
    GPIO.output(LED, GPIO.LOW)
    sleep(0.5)
    GPIO.output(LED, GPIO.HIGH)
    sleep(0.5)
    GPIO.output(LED, GPIO.LOW)
    sleep(0.5)
    GPIO.cleanup()
    print(12345)
    sys.stdout.flush()


if __name__ == '__main__':
    main()
