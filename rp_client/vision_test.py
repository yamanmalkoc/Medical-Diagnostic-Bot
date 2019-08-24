"""
A series of static methods used to execute the vision test
"""

from st7920 import ST7920
import random
import string
from time import sleep

'''
counter: keeps track of the number of tests to be performed for each letter size
size: starting size of the letters being displayed on the ST7920 display
points: keeps track of the points earned by the tester
done: a boolean flag to determine whether test is complete or not
'''
counter = -1
size = 8
points = 0 #72 is the max
done = False

'''
This function is used to display a random letter on the
LCD screen of starting size of 'size', decrementing it
over time until the test is complete. It then calls printResult
to display the eyetest score
'''
def generateLetter():
    global size,  counter, answer, done
    s = ST7920()
    s.clear()
    letter = random.choice(string.ascii_letters)
    s.put_text_size(letter.upper(), 44 + 3 * (8 - size), 5 + 3 * (8 - size), size)
    s.redraw()
    counter = counter + 1
    if(counter % 2 == 0):
        size = size - 1
    answer = letter.upper()
    if(size == 0):
        done = True

    return done

'''
This function takes in user's input as a string
and matches against the letter generated to see
whether the user guessed it correctly
'''
def getUserInput(letter):
    global answer, points, size
    if(letter == answer):
        points = points + 8 - size

'''
This function is used to print the score as a percentage
'''
def getResult():
    global points
    score = int(float(points / 56.0) * 100)
    return score

def reset():
    global size, points, done
    size = 8
    points = 0
    done = False
    s = ST7920()
    s.clear()

##while not done:
##    generateLetter()
##    if not done:
##        var = raw_input("Please enter what you see: ")
##        var = str(var)
##        getUserInput(var)
##        print("Score: ", points)
