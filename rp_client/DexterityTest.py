"""
Running main() executes the main dexterity test on the RP
"""

import RPi.GPIO as GPIO
from time import sleep
from NewMotorAPI import *
import string

'''
	Setup of GPIO pins, 
'''
servo_pin = 4
button_pin = 17
#global variable was required to keep track of the users' score and make it easier to be put up on the database.
points = 0

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

GPIO.setup(servo_pin, GPIO.OUT)
GPIO.setup(button_pin, GPIO.IN)
'''
	Initialization of the motor using the __init__ of the newly created NewMotorAPI.py
'''
motor = motorControl()
servoPWM = GPIO.PWM(servo_pin, 50)

'''
	Runs the whole dexterity text
'''
def main():
    global points
    servoPWM.start(2.5)
    #start functionality
    startPosition(motor)
    sleep(3)
	#upon request 
    for i in range(6):
        sleep(1)
        servoPWM.ChangeDutyCycle(12.5)
        sleep(1)
        servoPWM.ChangeDutyCycle(2.5)
        while(GPIO.input(button_pin)==GPIO.HIGH):
            pass
	#if i is not 0: #if the test is done (i==0) don't run sleep
        sleep(4)
        rotate(motor)
        servoPWM.stop()
    sleep(3)

'''
    Moves bot a few feet backwards, and rotates it counterclockwise slighty to be in first catapulting position
'''
def startPosition(motor):
    #motor.setSpeed(-0.1)
    sleep(5)
    #motor.setSpeed(0)
    #sleep(0.1)
    motor.rotateCCW(30)
    sleep(1)
    #motor.setSpeed(0)

'''
    Rotates the bot a few degrees clockwise
'''
def rotate(motor):
    #if direction 0 then left, 1 the rght
    motor.rotateCW(15)
    sleep(0.5)
    motor.setSpeed(0)

'''
    Makes servo release spoon from catapulting position
'''
#def catapult(servo):


'''
	Tries to call main, if a keyboard interrupt occurs, stops motors/servo and aborts
'''
if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        motor.setSpeed(0)
        servoPWM.stop()
