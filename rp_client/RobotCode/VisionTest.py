from MotorAPI import *
from LCDAPI import *
import RPi.GPIO as GPIO
from time import sleep
import string
import random

def main(letter_input):
    default_speed = 50

    #Create a new motorControl object and lcd object
    robot = motorControl()
    lcd =  LCDControl()

    #CODE TO GET THE INPUT FROM THE SERVER
    letter_to_display = random.choice(string.ascii_letters)
    
    move_backward(robot,default_speed,30)
    
    lcd.display(letter_to_display)

    

    
if __name__ == "__main__":
    main()
