
import RPi.GPIO as GPIO
from time import sleep
#from MotorAPI import *
from LCDAPI import *


def main():
    #motor = motorControl()
    #motor.setSpeed(0)
    #motor.run_both()

    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    
    servo_pin = 2
    button_pin = 3
    
    GPIO.setup(servo_pin, GPIO.OUT)
    GPIO.setup(button_pin, GPIO.IN)
    
    #servoPWM = GPIO.PWM(servo_pin, 50)   #freq of 50Hz
    #servoPWM.start(2.5)


    #start functionality
    #startPosition(motor)
    sleep(3)
    for i in range(6):
        servoPWM = GPIO.PWM(servo_pin, 50)
        servoPWM.start(12.5)
        sleep(1)
        servoPWM.ChangeDutyCycle(2.5)
        sleep(1)
        servoPWM.ChangeDutyCycle(12.5)
            
        servoPWM.stop()
        while(GPIO.input(button_pin)==GPIO.HIGH):
            print(GPIO.input(button_pin))                                    
            pass

        sleep(2)
        #rotate(motor)
        #sleep(3)
    
'''
    Moves bot a few feet backwards, and rotates it counterclockwise slighty to be in first catapulting position
'''
def startPosition(motor):
    motor.run_both_backwards()
    motor.setSpeed(30)
    sleep(5)
    robot.setSpeed(0)
    motor.run_both()
    motor.rotateCCW(10)
    sleep(1)
    robot.setSpeed(0)
    robot.run_both()

'''
    Rotates the bot a few degrees clockwise
'''
def rotate(motor):
    #if direction 0 then left, 1 the rght
    robot.setSpeed(30)
    robot.rotateCW(30)
    sleep(0.5)
    robot.setSpeed(0)
    robot.run_both()
    
'''
    Makes servo release spoon from catapulting position
'''
#def catapult(servo):
    

    
if __name__ == "__main__":
    main()
