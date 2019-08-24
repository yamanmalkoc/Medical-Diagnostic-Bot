"""
This file includes a series of static methods used to execute the hearing test
"""


import pygame
from time import *

freqRate = 200 #200Hz/s
left_freq = 0
right_freq = 0
cur_channel = -1

def init():
    global channel, sound, start, elapsed, left_freq, right_freq
    pygame.mixer.init()
    sound = pygame.mixer.Sound("sweep.wav")
    channel = pygame.mixer.Channel(0)
    left_freq = 0
    right_freq = 0
    cur_channel = -1

def startLeft():
    global channel, sound, start, cur_channel
    start = time()
    clock()
    channel.play(sound)
    channel.set_volume(1.0, 0.0)

    cur_channel = 0

def startRight():
    global channel, sound, start, cur_channel
    start = time()
    clock()
    channel.play(sound)
    channel.set_volume(0.0, 1.0)

    cur_channel = 1

def pause():
    global start, elapsed, left_freq, right_freq
    channel.pause()
    elapsed = time() - start
    frq = freqEstimate()

    if (cur_channel == 0):
        left_freq = frq
    else:
        right_freq = frq

    return frq

def unpause():
    channel.unpause()

def stop():
    channel.stop()
    left_freq = 0
    right_freq = 0

def freqEstimate():
    global elapsed
    return 200 * elapsed

def get_left_freq():
    return left_freq

def get_right_freq():
    return right_freq
##try:
##    init()
##    startLeft()
##
##    for i in range(1000000):
##        pass
##
##    frq = pause()
##
##    print (frq)
##
##
##except KeyboardInterrupt:
##
##    stop()


##def start():
##    pygame.mixer.init()
##    pygame.mixer.music.load("sweep.wav")
##    pygame.mixer.music.play(-1)
##
##def pause():
##    pygame.mixer.music.pause()
##
##def unpause():
##    pygame.mixer.music.unpause()
##
##def stop():
##    pygame.mixer.music.stop()
##
##try:
##    start()
##    sleep(3)
##    pause()
##    sleep(3)
##    unpause()
##
##except KeyboardInterrupt:
##
##    stop()
