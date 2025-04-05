from typing import Callable, TypeVar, Any
import threading
from .colrs import RD, BU, YW
import functools

# thread-local storage to track nested debug states
BUGS = _debug_stack = threading.local()
F = TypeVar('F', bound = Callable)  # generic function type

class pesticide:
    def __init__(self, *, enabled: bool = False):
        self.enabled = enabled

    def __call__(self, func: F) -> F:
        @functools.wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            if not hasattr(_debug_stack, 'nest'):
                _debug_stack.nest = []

            _debug_stack.nest.append(self.enabled)

            class_name = None
            if args:
                class_name = args[0].__class__.__name__

            if self.enabled:
                if class_name:
                    print(f'{RD("[DEBUG]")} {BU("Calling")} \'{class_name}.{func.__name__}\'')
                else:
                    print(f'{RD("[DEBUG]")} {BU("Calling")} \'{func.__name__}\'')

            try:
                return func(*args, **kwargs)
            finally:
                _debug_stack.nest.pop()

                if self.enabled:
                    if class_name:
                        print(f'{RD("[DEBUG]")} {YW("Exiting")} \'{class_name}.{func.__name__}\'')
                    else:
                        print(f'{RD("[DEBUG]")} {YW("Exiting")} \'{func.__name__}\'')


        return wrapper

    @staticmethod
    def larva() -> bool:
        '''Returns True if the current function is in debug mode.'''
        return hasattr(BUGS, 'nest') and BUGS.nest and BUGS.nest[-1]
    
larva = pesticide.larva
__all__ = ['pesticide', 'larva']