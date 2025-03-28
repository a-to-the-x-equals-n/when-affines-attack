import json
from pathlib import Path

class DataMan:
    '''
    Manages loading and saving of classmate data in a JSON file.
    '''

    def __init__(self, file: str = 'dbase/classmates.json'):
        '''
        Initializes the DataMan instance.

        Parameters:
        -----------
        file : str, optional
            The filename where classmate data is stored. Defaults to `'classmates.json'`.
        '''
        dir = Path(__file__).parent     # get models directory
        self.fname = dir / Path(file)   # ensure file path is handled correctly


    def load(self) -> list:
        '''
        Loads classmates from a JSON file.

        Returns:
        --------
        list
            A list of classmates loaded from the file, or an empty list if the file is missing or corrupted.
        '''
        try:
            return json.loads(self.fname.read_text())
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f'Error loading file {self.file} ({e})')  
            return []                                      


    def save(self, data: list) -> bool:
        '''
        Saves classmates to a JSON file.

        Parameters:
        -----------
        data : list
            The list of classmates to be saved.

        Returns:
        --------
        bool
            `True` if the file was saved successfully, `False` if an error occurred.
        '''
        try:
            self.fname.write_text(json.dumps(data, indent = 4))
            return True
        except Exception as e:
            print(f'Error saving file: {e}')
            return False



