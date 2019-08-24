
from gpiozero import MCP3008
from time import sleep

temp = MCP3008(1)
counter = 0

def measureTemp():
    global counter
    while counter < 10000:
        sleep(0.1)
        counter = counter + 1
        print((int)(temp.value*10000))
    return temp.value
while True:
    measureTemp()
