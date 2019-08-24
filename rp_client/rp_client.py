"""
This is the socket.io client hosted on the raspberry PI
"""

import socketio
import blink
import hearing_test
import vision_test
from subprocess import call

sio = socketio.Client()
sio.connect('http://cpen291-5.ece.ubc.ca')

@sio.on('connect')
def on_connect():
    print("Attempting to connect")

@sio.on('message')
def on_message(data):
    print(str(data))

#Actions upon the 'request' event
@sio.on('request')
def on_request(data):
    if (str(data) == 'blink'):
        print('Recieved a blink request from the server')
        blink.main()
        sio.emit('message', 'Blink has finished')
    elif (str(data) == 'start_vision_test'):
        print('Recieved request to start vision test')

#Actions upon the 'dex_test' event
@sio.on('dex_test')
def on_dex_test(data):
    if (data['request'] == 'begin'):
        print('Recieved request to begin dex_test')
        exit_code = call("python3 DexterityTest.py", shell=True)
        sio.emit('dex_test', {'type': 'request_results', 'socketid': data['socketid']})

#Actions upon the 'vision_test' event
@sio.on('vision_test')
def on_vision_test(data):

    if(data['request'] == 'begin_test'):
        print('Recieved request to start vision test')
        vision_test.generateLetter()
        sio.emit('vision_test_result', {'type': 'finish_gen'})

        # else:
        #     sio.emit('vision_test_result', {'type', })
    elif(data['request'] == 'input_letter'):
        print('Recieved user letter input:' + data['data'])
        vision_test.getUserInput(data['data'])
        if (vision_test.generateLetter()):
            score = vision_test.getResult()
            vision_test.reset()
            sio.emit('vision_test_result', {'type': 'score', 'score': str(score), 'socketid': data['socketid']})

    elif(data['request'] == 'reset'):
        print('Recieved request to reset vision test')
        vision_test.reset()


#Actions upon the 'hearing_test' event
@sio.on('hearing_test')
def on_hearing_test(data):
    if (data['request'] == 'start_left'):
        print('Recieved request to start left hearing test')
        hearing_test.init()
        hearing_test.startLeft()

    elif (data['request'] == 'start_right'):
        print('Recieved request to start right hearing test')
        hearing_test.startRight()

    elif (data['request'] == 'finish_left'):
        print('Recieved request to get freq and start next ear hearing test')
        left_freq = hearing_test.pause()
        hearing_test.stop()
        sio.emit('hearing_test_result', {'type': 'finish_left', 'left_freq': str(left_freq), 'socketid': data['socketid']})

    elif (data['request'] == 'finish_right'):
        print('Recieved request to get freq for second ear and finish')
        right_freq = hearing_test.pause()
        hearing_test.stop()
        sio.emit('hearing_test_result', {'type': 'finish_right', 'right_freq': str(right_freq), 'socketid': data['socketid']})

    elif (data['request'] == 'send_data'):
        print('Recieved request return data')

        left_freq = hearing_test.get_left_freq()
        right_freq = hearing_test.get_right_freq()
        hearing_test.stop()

        sio.emit('hearing_test_result', {'type': 'total', 'left_freq': str(left_freq),
                                         'right_freq': str(right_freq)})



    elif (data['request'] == 'stop'):
        print('Recieved request to stop hearing test')
        hearing_test.stop()
