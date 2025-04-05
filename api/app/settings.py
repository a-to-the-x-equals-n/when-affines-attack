from .util import GoodDog as dog
from .util import heimdahl

DEV = False
VB = False

heimdahl(f'[ENV FETCH]', True, threat = 0)
IP, PORT, PASSWORD, USER, DB = dog.fetch(dog.where, 'IP', 'PORT', 'PASSWORD', 'DB_USER', 'DATABASE')

__all__ = ['DEV', 'VB', 'IP', 'PORT', 'PASSWORD', 'USER', 'DB'] 