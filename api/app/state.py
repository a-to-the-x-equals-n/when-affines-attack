from flask import Flask
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from app.settings import IP, USER, PASSWORD, DB
import app.settings as settings
from app.models import Goose
from app.util import heimdahl, HAL9000

app = Flask(__name__)
CORS(app) 

try:
    CONNECTION = mysql.connector.connect(host = IP, user = USER, password = PASSWORD, database = DB)
    CURSOR = CONNECTION.cursor(dictionary = True)
    goose = Goose(conn = CONNECTION, cursor = CURSOR, dev = settings.DEV, verbose = settings.VB)
    heimdahl(f"[CONNECTED] USER: '{USER}' DB: '{DB}'", unveil = settings.VB, threat = 0)
except Error as e:
    raise HAL9000.SystemFailure(f'Could not connect to DB: {e}')

heimdahl(f"[CONNECTED] USER: '{USER}' DB: '{DB}'", unveil = settings.VB, threat = 0)

__all__ = ['app', 'goose']