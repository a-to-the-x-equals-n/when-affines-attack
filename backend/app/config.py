from .util.goodboy import GoodDog as dog
from .models.dataman import DataMan
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 
db = DataMan() 

try:
    IP, PORT = dog.fetch(dog.where, 'IP', 'PORT')
except FileNotFoundError:
    dir = dog.find('.env', mode = 'parent')
    IP, PORT = dog.fetch(dir, 'IP', 'PORT')


if __name__ == '__main__':
    print(f'IP: {IP}, PORT: {PORT}')