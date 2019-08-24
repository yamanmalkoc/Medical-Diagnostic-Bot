import RPi.GPIO as GPIO


pin = 4
#GPIO.setup(GPIO.BCM)

GPIO.setmode(GPIO.BCM)
GPIO.setup(pin,GPIO.IN)

while True:
    print(GPIO.input(pin))
