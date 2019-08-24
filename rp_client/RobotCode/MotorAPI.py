#Demo 3046
#Tweaked turn speed

import Adafruit_MotorHAT
import time
import math
from time import sleep

BLACK = 1
WHITE = 0

class motorControl:

    '''
        Initializes both DC motors, left and right. Sets speed to zero by default.
        Params:
        speed - speed to set initially, default to 0 if not passed in
        addr - TBD
        numLeft - number of left motor
        numRight - number of right motor
    '''
    def __init__(self,speed = 0, addr = 0x60, numLeft = 1, numRight = 4):
        #Initialize the COntroller which is used to create the motors
        controller = Adafruit_MotorHAT.Adafruit_MotorHAT(addr) #this is assuming we want the defaults from the api (freq)
        self._left = controller.getMotor(numLeft)
        self._right = controller.getMotor(numRight)
        self._leftSpeed = speed
        self._rightSpeed = speed
        self._turningLeft = False
        self._turningRight = False
        self.FORWARD = 1
        self.BACKWARD = 2
        self.BRAKE = 3
        self.RELEASE = 4
        self.RADIUS = 0.05
        self.left_turn_count = 0
        self.right_turn_count = 0
        self.consecutive_straight_count = 0
        self.increment_turn_constant = 0
        self.prev_dir = 0

    '''
        Turn the robot left
        Param:
        degrees - amount of degrees we want to turn
    '''
    def turnLeft(self, degrees):
        ''' periodOfTurn = math.pi * 2 * self.RADIUS / self._rightSpeed
        self._left.run(self.RELEASE)
        time.sleep(periodOfTurn)
        self._left.run(self.FORWARD) '''
        prevSpeed = self._leftSpeed
        periodOfTurn = math.pi * 2 * self.RADIUS / self._leftSpeed
        self.setLeftSpeed(0)
        print(periodOfTurn)
        time.sleep(2)
        self.setLeftSpeed(prevSpeed)

    '''
        Set the speed field variable of this class
        Param: speed - the speed to set the bots speed to, speed is in ______
    '''
    def setSpeed(self, speed):
        try:
            self._leftSpeed = speed
            self._rightSpeed = speed
            self._right.setSpeed(speed)
            self._left.setSpeed(speed)
        except IOError:
            sleep(0.1)
            print("Error 121 Yaman")
            self.setSpeed(speed)

    '''
        Turn the robot right
        Param:
        degrees - amount of degrees we want to turn
    '''
    def turnRight(self):
        prevLeftSpeed = self._rightSpeed
        prevRightSpeed = self._leftSpeed
        #periodOfTurn = math.pi * 2 * self.RADIUS / self._rightSpeed
        self.setLeftSpeed(100)
        self.setRightSpeed(0)
        time.sleep(1)
        self.setRightSpeed(prevRightSpeed)
        self.setLeftSpeed(prevLeftSpeed)

    '''
        Rotates the bot clockwise
    '''
    def rotateCW(self, speed):
        try:
            self._leftSpeed = speed
            self._rightSpeed = speed
            self._left.run(self.BACKWARD)
            self._right.run(self.FORWARD)
        except IOError:
            sleep(0.1)
            print("Error 121 Yaman")
            self.rotate(speed)

    '''
        Rotates the bot clockwise
    '''
    def rotateCCW(self, speed):
        try:
            self._leftSpeed = speed
            self._rightSpeed = speed
            self._right.run(self.BACKWARD)
            self._left.run(self.FORWARD)
        except IOError:
            sleep(0.1)
            print("Error 121 Yaman")
            self.rotate(speed)


        '''
        Obtain the current direction of the robot's movement
        If Robot is turning left, return 1
        If robot is turning right, return 2
        If robot is not turning (straight) return 0
    '''
    def getDirection(self):
        if(self._turningLeft): return 1
        if(self._turningRight): return 2
        return 0

    '''
        Update the turns based on the sensor readings and member variables
        @Params:
            - left_sensor, the reading of the left motor
            - right_sensor, the reading of the right motor
    '''
    def updateTurns(self,left_sensor, right_sensor):
        #Update the turns
        if(left_sensor):
            self.left_turn_count += self.left_turn_count
            self.right_turn_count = 0
            self.consecutive_straight_count = 0
            self._turningLeft = True
            self._turningRight = False
        elif(right_sensor):
            self.right_turn_count += self.right_turn_count
            self.left_turn_count = 0
            self.consecutive_straight_count = 0
            self._turningRight = True
            self._turningLeft = False
        else:
            self.consecutive_straight_count += 1

        #Determine the direction
        if(self.consecutive_straight_count > 100):
            self.left_turn_count = 0
            self.right_turn_count = 0
            self._turningLeft = False
            self._turningRight = False

    '''
        Set the speed of the left motor. Updates the field variable of the object
        speed - the speed to set the motor to.
    '''
    def setLeftSpeed(self, speed):
        self._leftSpeed = speed
        self._left.setSpeed(speed)

    '''
    '''
    def stop(self):
        self.setSpeed(0)

    '''
        Set the speed of the right motor. Updates the field variable of the object
        speed - the speed to set the motor to.
    '''
    def setRightSpeed(self, speed):
        self._rightSpeed = speed
        self._right.setSpeed(speed)

    '''
        Start both motors of the robot.
    '''
    def run_both(self):
        self._left.run(self.FORWARD)
        self._right.run(self.FORWARD)


    def run_both_backwards(self):
        try:
            self._left.run(self.BACKWARD)
            self._right.run(self.BACKWARD)
        except IOError:
            sleep(0.1)
            print("Error 121 Yaman2")
            self.run_both_backwards
