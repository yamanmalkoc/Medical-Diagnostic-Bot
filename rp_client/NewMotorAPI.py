from adafruit_motorkit import MotorKit
from time import sleep

class motorControl:

    '''
        Initializes both DC motors, left and right. Sets speed to zero by default.
    '''
    def __init__(self):
        #Initialize the COntroller which is used to create the motors
        controller = MotorKit()
        self.left = controller.motor1
        self.right = controller.motor4

    '''
        Sets the speed of the tires to the given value
    '''
    def setSpeed(self, speed):
            self.left.throttle = speed
            self.right.throttle = speed

    '''
        Rotates the bot clockwise at an angle taken as a parameter
			Parameters:
				degree: the degree that the user wants the robot to turn clockwise
    '''
    def rotateCW(self, degree):
        try:
            self.left.throttle = 0.5
            self.right.throttle = -0.5
            sleep(degree * 0.012)
            self.left.throttle = 0
            self.right.throttle = 0
		#Catches exception caused by an I2C miscommunication and calls itself again
        except IOError:
            sleep(0.1)
            print("Error 121 Yaman")
            self.rotate(degree)

    '''
        Rotates the bot counter-clockwise at an angle taken as a parameter
			Parameters:
				degree: the degree that the user wants the robot to turn counter-clockwise
    '''
    def rotateCCW(self, degree):
        try:
            self.left.throttle = -0.5
            self.right.throttle = 0.5
            sleep(degree * 0.012)
            self.left.throttle = 0
            self.right.throttle = 0
        #Catches exception caused by an I2C miscommunication and calls itself again
        except IOError:
            sleep(0.1)
            print("Error 121 Yaman")
            self.rotate(degree)
