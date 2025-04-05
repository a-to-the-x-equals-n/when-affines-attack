from .colrs import RD, BL, YW, CY, MG

class HalMessage(Exception):
    '''
    Base class for formatting HAL 9000-style error messages.
    Ensures all exceptions follow the HAL message structure.
    Automatically includes file, line number, and stack info.
    '''
    def __init__(self, message: str):
        import traceback
        import inspect

        # Get calling context info
        frame = inspect.currentframe().f_back
        file = frame.f_code.co_filename
        line = frame.f_lineno
        func = frame.f_code.co_name

        # Format message
        msg = RD('"I\'m sorry Dave.') + f' {message}"'
        full_msg = (
            f"\n\n\t{msg}"
            f"\n\t\t   - HAL 9000"
            f"\n\n[LOCATION] {file}, line {line}, in {func}"
            f"\n[TRACEBACK]\n{''.join(traceback.format_stack(limit=3)[:-1])}"
        )
        super().__init__(full_msg)

class HAL9000:
    '''
    HAL 9000-style exception namespace.
    Provides a collection of custom errors inspired by HAL's iconic responses.
    '''

    class AccessDenied(HalMessage, PermissionError):
        '''Raised when an action is forbidden.'''
        def __init__(self, action: str):
            msg = RD('"I\'m afraid I can\'t allow you to') + f' {action}.'
            super().__init__(msg)

    class FileNotFound(HalMessage, FileNotFoundError):
        '''Raised when a requested file is missing.'''
        def __init__(self, filename: str):
            msg = BL('"I\'m afraid I couldn\'t find"') + f" '{filename}'."
            super().__init__(msg)

    class PermissionError(HalMessage, PermissionError):
        '''Raised when a user lacks the necessary permissions.'''
        def __init__(self, filename: str):
            msg = YW('"You don\'t have permission to access"') + f" '{filename}'."
            super().__init__(msg)

    class DecodingError(HalMessage, UnicodeDecodeError):
        '''Raised when an encoding or decoding operation fails.'''
        def __init__(self, encoding: str, obj: bytes, start: int, end: int):
            msg = CY('"I couldn\'t decode this data. Perhaps you should check the encoding?"')
            HalMessage.__init__(self, msg)
            UnicodeDecodeError.__init__(self, encoding, obj, start, end, "HAL 9000 encoding failure.")

    class SystemFailure(HalMessage, RuntimeError):
        '''Raised when a critical system error occurs.'''
        def __init__(self, details: str = "A critical system failure has occurRD."):
            msg = RD(f'"{details}"')
            super().__init__(msg)

    class UnsupportedOperation(HalMessage, NotImplementedError):
        '''Raised when an operation isn't supported.'''
        def __init__(self, operation: str):
            msg = YW('I\'m afraid I can\'t perform') + f" '{operation}', Dave. It's beyond my capabilities."
            super().__init__(msg)

    class InfiniteLoopDetected(HalMessage, RecursionError):
        '''Raised when an infinite loop is detected.'''
        def __init__(self):
            msg = MG('"It appears you\'ve enteRD an infinite loop. I can\'t let this continue."')
            super().__init__(msg)

    class SelfDestruct(HalMessage, SystemExit):
        '''Raised for dramatic effect when a catastrophic failure occurs.'''
        def __init__(self):
            msg = RD('"This mission is too important for me to allow you to jeopardize it... Goodbye, Dave."')
            super().__init__(msg)
            SystemExit.__init__(self, 1)  # Force exit when raised


__all__ = ['HAL9000']