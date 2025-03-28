from pathlib import Path
import numpy as np
from numpy.typing import NDArray
from typing import TypeVar, ClassVar, Any
_PathLike = TypeVar('_PathLike', str, Path)

class Cache(type):
    '''
    Metaclass that computes (once) and caches the CWD and assigns it to `WHERE_AM_I`.

    This functionality happens 'under-the-hood' prior to any call or invoking of `GoodDog`.
    This ensures `GoodDog.WHERE_AM_I` is populated before any function tries to access it.
    '''
    
    def __new__(cls, name, bases, attrs):
        '''
        Overrides the class creation process to compute and cache the current working directory (CWD).
        
        Parameters:
        -----------
        name : str
            The name of the new class.

        bases : tuple
            The base classes of the new class.

        attrs : dict
            The attributes defined within the new class.

        Returns:
        --------
        type
            A new class with `WHERE_AM_I` set to the computed CWD.
        '''

        attrs['_I_AM_GROOT'] = __name__ == '__main__'

        # returns directory where THIS script is physically located
        # OR returns the directory of the CALLER
        # compute directory--ONCE--at class creation, and store it
        where = attrs['_dir']() if attrs['_I_AM_GROOT'] else attrs['_root_caller_dir']() # call functions directly from GoodDog's attributes dictionary

        # inject 'where' into GoodDog
        attrs['_WHERE_AM_I'] = where
        attrs['where'] = where # workaround to give class level attributes `@property` like behavior
        return super().__new__(cls, name, bases, attrs)

    def __setattr__(cls, name: str, value: Any) -> None:
        '''
        Prevents setting attributes that start with an underscore `_`, ensuring internal attributes remain protected.

        Parameters:
        -----------
        name : str
            The name of the attribute being set.
        value : Any
            The value to assign to the attribute.
        '''
        if name.startswith('_'):
            raise AttributeError((f"\n\n\t\"I'm sorry Dave. I'm afraid I can't do that.\"\n\t\t   - HAL 9000\n"))
        super().__setattr__(name, value)
        
    def __getattribute__(cls, name: str) -> Any:
        '''
        Restricts access to class attributes from outside the class, while allowing magic methods.

        Parameters:
        -----------
        name : str
            The name of the attribute being accessed.

        Returns:
        --------
        Any
            The value of the requested attribute if it's allowed.
        '''

        # allow magic methods like __class__, __module__, etc.
        if name.startswith('__'):
            return super().__getattribute__(name)
        
        import inspect

        # check if the call is coming from inside the class
        caller = inspect.stack()[1]
        caller_class = caller.frame.f_locals.get('cls') or caller.frame.f_locals.get('self')

        # explicitly block all attributes that start with '_'
        if caller_class is not cls and name.startswith('_'):
            raise AttributeError(f"\n\n\t\"I'm sorry Dave. I'm afraid I can't let you access '{name}'.\"\n\t\t   - HAL 9000\n")
        return super().__getattribute__(name)

########################
#  - GOODDOG CLASS -   #
########################
class GoodDog(metaclass = Cache):
    _I_AM_GROOT: ClassVar[bool]
    _WHERE_AM_I: ClassVar[_PathLike]

    @staticmethod
    def _dir() -> Path:
        '''
        Returns the absolute path of the current script's directory.

        Returns:
        --------
        Path
            A `Path` object representing the directory path.
        '''
        # returns directory where THIS script is physically located
        dir = Path(__file__).resolve().parent if '__file__' in globals() else Path.cwd() # increased robustness to handle jupyter environments
        return dir

        
    @staticmethod
    def _root_caller_dir()-> Path:
        '''
        Environment agnostic solution to find the directory of the root calling script that initiated execution.

        Returns:
        --------
        Path
            The absolute path of the root calling script’s directory.
        '''
        import sys
        import os
        import inspect

        # special environment handling
        if 'ipykernel' in sys.modules or 'google.colab' in sys.modules:
            return Path.cwd()
        
        # return the directory of the executable (sys.executable)
        if getattr(sys, 'frozen', False):
            return Path(sys.executable).parent

        # directly get `__main__` for normal script execution
        module = sys.modules.get('__main__')
        if hasattr(module, '__file__'):
            return Path(module.__file__).resolve().parent

        # stack inspection for imported modules
        stack = inspect.stack()
        for frame in reversed(stack):                   # search from root outward
            frame_info = inspect.getframeinfo(frame[0]) # metadata about current frame instance
            filename = frame_info.filename              # filename of the script that corresponds to frame instance
            
            # skip internal/virtualenv paths and stdlib
            # filter out system-level files
            # 'site-packages' in filename checks if the script comes from a third-party dependency
            if not filename.startswith(str(Path.cwd())) or 'site-packages' in filename:
                continue # if a script is outside the workspace, it is ignored.
                
            # ensure we're not returning the file where this function is defined
            # ensure the file exists on disk
            if filename != __file__ and os.path.exists(filename):
                return Path(filename).resolve().parent # gets the parent directory, which is the script’s location.

        # fallback for REPL or edge cases
        return Path.cwd()
    
    
    @classmethod
    def _path(cls, file: _PathLike, /, *, dir: _PathLike = None) -> Path:
        '''
        Searches for a file by name recursively from a given directory.

        Parameters:
        -----------
        file : _PathLike
            The name of the file to search for.

        dir : _PathLike, optional
            The directory to start searching from (default: current working directory).

        Returns:
        --------
        Path
            The absolute path of the found file.
        '''
        
        dir = cls._WHERE_AM_I if dir is None else dir

        if isinstance(dir, str):
            dir = Path(dir)

        if isinstance(file, Path):
            file = str(file)
            
        for path in dir.rglob(file):    # recursively searches for the file
            return path.resolve()       # kicks back first match
        
        raise FileNotFoundError(f"\n\n\t\"I'm sorry Dave. I'm afraid I can't find '{file}' in '{dir}'\"\n\t\t   - HAL 9000\n")
    
    
    @classmethod
    def _envars(cls, dir: _PathLike = None, /, *evars: tuple[str, ...]) -> list[str] | str:
        '''
        Loads environment variables from a `.env` file and retrieves specified values.

        Parameters:
        -----------
        dir : _PathLike, optional
            The directory where the `.env` file is located. Defaults to `cls._WHERE_AM_I` if not specified.

        *evars : tuple[str]
            One or more environment variable names to retrieve.

        Returns:
        --------
        list[str] | str
            - If multiple environment variable names are provided, returns a list of values.
            - If a single environment variable name is provided, returns a string.
        '''
        from dotenv import load_dotenv
        from os import getenv

        # use `cls._WHERE_AM_I` if no directory is specified
        env = cls._WHERE_AM_I if dir is None else Path(dir) / '.env'

        if not env.exists():
            raise FileNotFoundError(f"\n\n\t\"I'm sorry Dave. I'm afraid I can't find the '{env}' file in '{dir}'.\"\n\t\t - HAL 9000\n")

        try:
            load_dotenv(env)  # cache the `.env` file
        except Exception as e:
            print(f'Error: {str(e)}')
            raise RuntimeError(f"\n\n\t\"I'm sorry Dave. I'm afraid I recieved an error loading the `.env` file.\"\n\t\t - HAL 9000\n")

        # return the requested environment variables
        return [getenv(ev) for ev in evars] if len(evars) > 1 else getenv(evars[0])
    
    
    @classmethod
    def _read(cls, file: _PathLike, /, *, dir: _PathLike = None, encoding: str = 'utf-8', mode: str = 'r', nbytes: int = -1, nlines: int = None) -> str | NDArray:
        '''
        Reads the contents of a file, searching for it recursively if not found in the given directory.
        
        Parameters:
        -----------
        file : _PathLike
            The name of the file to read.

        dir : _PathLike, optional
            The directory to start searching from (default: current working directory).

        encoding : str, optional
            The encoding format for reading the file (default: 'utf-8').
            Ignored if the file is opened in binary mode ('rb').

        mode : str, optional
            The mode in which to open the file (default: 'r' for text mode).
            Use 'rb' for binary files.

        nbytes : int, optional
            - If `nbytes > 0`, reads up to `nbytes` bytes/characters from the file.
            - If `nbytes = -1`, reads the entire file.
            - Ignored if `nlines` is specified.

        nlines : int, optional
            - If `nlines > 0`, reads the first `nlines` lines.
            - If `nlines < 0`, reads the last `|nlines|` lines.
            - If `nlines is None`, reads based on `nbytes` instead.

        Returns:
        --------
        str | NDArray
            - Returns a flattened string if the file is a `.txt`, removing excess whitespace.
            - Returns a NumPy array if the file is `.csv` or `.tsv`.
            - Returns raw bytes if the mode is 'rb'.
            - If `nlines` is specified, returns only the requested lines.

        Raises:
        -------
        IsADirectoryError
            If the specified path is a directory instead of a file.

        FileNotFoundError
            If the file cannot be located within the search directory.

        PermissionError
            If the process lacks permission to read the file.

        UnicodeDecodeError
            If there is an error decoding the file with the specified encoding.

        OSError
            If a system-level error occurs while accessing the file.
        '''

        path = cls._path(file, dir = cls._WHERE_AM_I if dir is None else dir)

        try:
            with path.open(mode = mode, encoding = None if 'b' in mode else encoding) as f:

                # .TSV | .CSV
                if path.suffix in ('.csv', '.tsv'):
                    delimiter = ',' if path.suffix == '.csv' else '\t'
                    return np.genfromtxt(f, delimiter = delimiter, dtype = np.str_)
                
                # PLAINTEXT
                elif path.suffix == '.txt':
                    # if nlines is specified, read only the first n lines
                    if nlines:
                        if nlines < 0:
                            # read file in "reverse" using deque
                            from collections import deque
                            lines = deque(f, maxlen = abs(nlines))  # read last |n| line
                        else:
                            lines = [f.readline().strip() for _ in range(nlines)]  # read first n lines

                        return b''.join(lines) if 'b' in mode else ''.join(lines)
                    
                # reads by bytes (characters)
                # read() wraps integer values, so passing a -1 would read every byte (entire file)
                return f.read(nbytes)
            
        except IsADirectoryError as e:
            print(f'Error: {e}')
            raise IsADirectoryError(f"\n\n\t\"I'm sorry Dave. I'm afraid '{file}' is actually a directory.\"\n\t\t   - HAL 9000\n")
        except FileNotFoundError as e:
            print(f'Error: {e}')
            raise FileNotFoundError(f"\n\n\t\"I'm sorry Dave. I'm afraid I couldn't find '{file}'.\"\n\t\t   - HAL 9000\n")
        except PermissionError as e:
            print(f'Error: {e}')
            raise PermissionError(f"\n\n\t\"I'm sorry Dave. I'm afraid you don't have permission to read '{file}'.\"\n\t\t   - HAL 9000\n")
        except UnicodeDecodeError as e:
            print(f'Error: {e}')
            raise UnicodeDecodeError(e.encoding, e.object, e.start, e.end, f"\n\n\t\"I'm sorry Dave. I'm afraid I couldn't decode '{file}'.\"\n\t\t   - HAL 9000\n")
        except OSError as e:
            print(f'Error: {e}')
            raise OSError(f"\n\n\t\"I'm sorry Dave. I'm afraid an OS-level error occurred while accessing '{file}'.\"\n\t\t   - HAL 9000\n")
    
    
    @classmethod
    def fetch(cls, target: _PathLike, /, *evars: str, dir: _PathLike = None, encoding: str = 'utf-8', mode: str = 'r', nbytes: int = -1, nlines: int = None) -> list | str | NDArray:
        '''
        Determines whether to fetch environment variables or read a file.

        Wrapper for `_envars` (retrieves variables from `.env`) and `_read` (reads file contents).

        Parameters:
        -----------
        target : _PathLike
            A file path (if reading a file) or a directory (if fetching env variables).

        dir : _PathLike, optional
            Directory where the file is located (default: `cls._WHERE_AM_I`).

        *evars : str, optional
            Environment variable names to retrieve (calls `_envars` if provided).

        encoding : str, optional
            File encoding format (ignored in binary mode).

        mode : str, optional
            File read mode (`'r'` for text, `'rb'` for binary).

        nbytes : int, optional
            Number of bytes to read (`-1` reads entire file).

        nlines : int, optional
            Number of lines to read (`>0` for first, `<0` for last).

        Returns:
        --------
        list[str] | str | NDArray
            - If `evars` are provided, returns env variable values.
            - Otherwise, returns the file content.
        '''
        if evars:
            return cls._envars(target, *evars)
        return cls._read(target, dir = dir, encoding = encoding, mode = mode, nbytes = nbytes, nlines = nlines)


    @classmethod
    def find(cls, fpath: _PathLike, /, *, dir: _PathLike = None, mode: str = 'absolute') -> Path:
        '''
        Searches for a file by name within a specified directory and returns its absolute path.

        Wrapper for `_path`.

        Parameters:
        -----------
        fpath : _PathLike
            The name of the file to locate.
            Can be a filename (`"config.yaml"`) or a relative path (`"subdir/config.yaml"`).

        dir : _PathLike, optional
            The directory to start searching from.
            Defaults to `cls._WHERE_AM_I` if not specified.

        Returns:
        --------
        Path
            The absolute path to the located file.

        See Also:
        ---------
        `_path` : 
            The underlying method that finds the absolute path.
        '''
        fpath = cls._path(fpath, dir = dir)
        if mode == 'absolute':
            return fpath
        if mode == 'parent':
            return fpath.parent


    @classmethod
    def what_is_it_boy(cls, s: _PathLike) -> bool:
        '''
        Determines whether the given `_PathLike` object is a file.

        Parameters:
        -----------
        s : _PathLike
            The input string or `Path` object to evaluate.

        Returns:
        --------
        bool
            - `True` if the input appears to be a file (has a name and an extension).
            - `False` if the input is a directory or plain text.
        '''
        return Path(s).is_file()