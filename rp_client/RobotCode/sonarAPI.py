import RPi.GPIO as GPIO
from time import sleep
import time

TRIG = 4  #Change depending on pin
ECHO = 12 #Change depending on pin

'''
Initializes a sonar, sets up gpio pins and sets the trigger output to low
'''
def init():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(TRIG, GPIO.OUT)
    GPIO.setup(ECHO, GPIO.IN)
    GPIO.output(TRIG,GPIO.LOW)
    sleep(0.1)

'''
Sends out pulse to be able to receive input from sonar
'''
def triggerSonar():
    GPIO.output(TRIG, GPIO.HIGH)
    sleep(0.00001)
    GPIO.output(TRIG, GPIO.LOW)

'''
Based off input from pulse, calculates distance in cm and returns it
'''
def getDistance():
    triggerSonar()
    while(GPIO.input(ECHO) != GPIO.HIGH):
        pass

    start = time.time()

    while (GPIO.input(ECHO) == GPIO.HIGH):
        pass

    end = time.time()
    return (end - start) * 1000000 / 58.3


def cleanup():
    GPIO.cleanup()

