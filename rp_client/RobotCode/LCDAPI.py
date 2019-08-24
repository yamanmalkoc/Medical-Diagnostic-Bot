 

#Still need to implement remote control setup LCD function

from Adafruit_CharLCD import *
import RPi.GPIO as GPIO
import time

'''
    API To setup LCD and KeyPad, write to LCD and get input from KeyPad.
    
    **Pins must be updated below!**
'''
rs = 22              #set pins for LCD
en = 17
d4 = 25
d5 = 24
d6 = 23
d7 = 18
    
class LCDControl:
    '''
        Initializes LCD using Adafruit library initialize function and KeyPad with GPIO
    '''
    def __init__(self):
        global row0, row1, row2, row3, column0, column1, column2, rs, en, d4, d5, d6, d7
        #LCD SETUP using Adafruit init function
        self.thisLCD = Adafruit_CharLCD(rs, en, d4, d5, d6, d7, 16, 2)

    '''
        Sets LCD display for a certain message.
    '''
    def displayMessage(self, message):
        self.thisLCD.clear()
        self.thisLCD.message(message)
        
		
		
		
		
		
		
		
		
		
		
