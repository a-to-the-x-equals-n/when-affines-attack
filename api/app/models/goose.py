
from pathlib import Path
from PIL import Image
from typing import Any
import uuid
import io
import base64 as b64
from app.util import pesticide, larva, heimdahl, HAL9000

_DIR = Path('api/app/models/assets/gooses/')
_DIR.mkdir(parents = True, exist_ok = True)
_AB_DIR = Path('')

class Goose:
    '''
    Handles database operations for goose_images.
    '''
    @pesticide(enabled = False)
    def __init__(self, /, *, conn: Any, cursor: Any, dev: bool = False, verbose: bool = False) -> None:
        '''
        Initializes the database connection.

        Parameters:
        -----------
        host : str
            The database host.

        user : str
            The database username.

        password : str
            The database password.

        database : str
            The name of the database to connect to.

        dev : bool, optional
            Whether to use test image mode.

        verbose : bool, optional
            Enables detailed status messages.
        '''
        self.dev = dev
        self.vb = verbose
        self.conn = conn
        self.cursor = cursor
        heimdahl(f'[INIT CLASS] \'{self.__class__.__name__}\'', (self.vb or self.dev or larva()), threat = 1)

    @pesticide(enabled = True)
    def test_add_img(self, im: Any, /, *, desc: str | None = None) -> int | None:
        '''
        Test-mode image save that skips file-type conversion.

        Parameters:
        -----------
        im : Any
            File path to the image to store.

        desc : str, optional
            Optional description to associate with image.

        Returns:
        --------
        int | None
            Inserted DB row ID, or None on failure.
        '''
        try:
            title = Path(im).stem
            im_path = Path(im)
            ext = im_path.suffix.lower()
            file_content = im_path.open('rb')
            uid = f'{uuid.uuid4()}{ext}'
            fpath = _DIR / uid
            desc = desc if desc is not None else title                      

            with open(fpath, 'wb') as f:
                f.write(file_content.read())

            with Image.open(fpath) as img:
                w, h = img.size
                fmt = img.format.lower() if img.format else ext.lstrip('.')
            size = fpath.stat().st_size

            q = '''INSERT INTO goose_images (title, filepath, description, size, width, height, format)
            VALUES (%s, %s, %s, %s, %s, %s, %s)'''
            meta = (title, str(fpath), desc, size, w, h, fmt)

            self.cursor.execute(q, meta)
            self.conn.commit()

            heimdahl(f'[TEST ADD] {title} → {fpath} ({fmt.upper()})', unveil = larva(), threat = 1)
            return self.cursor.lastrowid

        except Exception as e:
            self.conn.rollback()
            raise HAL9000.SystemFailure(f'Failed to add test image: {e}')

    @pesticide(enabled = True)
    def add_img(self, im: Any, /, *, desc: str | None = None) -> int | None:
        '''
        Saves the uploaded image, extracts metadata, and inserts a DB record.

        Parameters:
        -----------
        im : Any
            The uploaded image object from Flask (request.files['image']).

        desc : str, optional
            Optional description text.

        Returns:
        --------
        int
            The ID of the inserted image row, or None on failure.
        '''
        try:
            if self.dev:
                heimdahl(f'[DEV MODE] Redirecting to test_add_img for: {im}', unveil = (self.vb or larva()), threat = 1)
                return self.test_add_img(im, desc = desc)

            webp = self._to_webp(im, loss = 80)
            title = Path(im.filename).stem
            desc = desc if desc is not None else title
            file = f'{uuid.uuid4()}.webp'
            fpath = _DIR / file

            with open(fpath, 'wb') as f:
                f.write(webp)

            with Image.open(fpath) as im:
                w, h = im.size
                fmt = 'webp'
                size = fpath.stat().st_size

            q = '''INSERT INTO goose_images (title, filepath, description, size, width, height, format)
            VALUES (%s, %s, %s, %s, %s, %s, %s)'''
            meta = (title, str(file), desc, size, w, h, fmt)

            self.cursor.execute(q, meta)
            self.conn.commit()

            heimdahl(f'[INSERT] {title} → {file}', unveil = larva(), threat = 1)
            return self.cursor.lastrowid

        except Exception as e:
            self.conn.rollback()
            raise HAL9000.SystemFailure(f'DB insert failed: {e}')

    def close(self):
        '''
        Closes database cursor and connection.
        '''
        if self.cursor:
            self.cursor.close()
        if self.conn:
            self.conn.close()

    @pesticide(enabled = True)
    def get_images(self) -> list[dict[str, Any]]:
        '''
        Loads all image metadata + base64-encoded image data.

        Returns:
        --------
        list[dict[str, Any]]
            A list of image metadata + image data.
        '''
        try:
            heimdahl('[QUERY] LOADING IMAGES', unveil = (larva()), threat = 2)

            q = 'SELECT id, title, filepath, description, format, upvotes, downvotes FROM goose_images'
            self.cursor.execute(q)
            rows = self.cursor.fetchall()

            results = []
            for r in rows:
                path = _DIR / Path(r['filepath'])
                mime = f'image/{r["format"]}'

                if not path.exists():
                    heimdahl(f'[WARNING] File not found: {path}', unveil = larva(), threat = 2)
                    continue

                with open(path, 'rb') as f:
                    img_b64 = b64.b64encode(f.read()).decode('utf-8')

                results.append({
                    'id': r['id'],
                    'title': r['title'],
                    'description': r['description'],
                    'image': f'data:image/{r["format"]};base64,{img_b64}',
                    'upvotes': r['upvotes'],
                    'downvotes': r['downvotes']
                })

                heimdahl(f'[LOADED] \'{r["title"]}\'', unveil = larva(), threat = 1)

            return results

        except Exception as e:
            raise HAL9000.SystemFailure(f'Could not fetch images: {e}')
        
    @pesticide(enabled = True)
    def get_votes(self, image_id: str) -> dict[str, int]:
        '''
        Gets current vote counts for an image.
        
        Returns:
        --------
        dict[str, int]
            {'upvotes': int, 'downvotes': int}
        '''
        try:
            q = '''SELECT upvotes, downvotes FROM goose_images WHERE id = %s'''
            self.cursor.execute(q, (image_id,))
            result = self.cursor.fetchone()
            return {
                'upvotes': result['upvotes'] if result else 0,
                'downvotes': result['downvotes'] if result else 0
            }
            
        except Exception as e:
            heimdahl(f'[VOTE QUERY FAILED] {image_id}: {e}', unveil = True, threat = 3)
            return {'upvotes': 0, 'downvotes': 0}

    @pesticide(enabled = True)
    def register_vote(self, image_id: str, vote_type: int) -> bool:
        '''
        Registers a vote (up/down) for an image.
        
        Parameters:
        -----------
        image_id : str
            UUID of the target image
        vote_type : int
            1 for upvote, -1 for downvote
            
        Returns:
        --------
        bool
            True if vote was recorded successfully
        '''
        try:
            column = 'upvotes' if vote_type == 1 else 'downvotes'
            q = f'''UPDATE goose_images SET {column} = {column} + 1 WHERE id = %s'''
            self.cursor.execute(q, (image_id,))
            self.conn.commit()
            
            heimdahl(f'[VOTE] {image_id} {column}+1', unveil = larva(), threat = 1)
            return True
            
        except Exception as e:
            self.conn.rollback()
            heimdahl(f'[VOTE FAILED] {image_id}: {e}', unveil=True, threat=3)
            return False

    @staticmethod
    @pesticide(enabled = True)
    def _to_webp(img: Any, loss: int = 85) -> bytes:
        '''
        Converts an image to WebP byte format.

        Parameters:
        -----------
        img : Any
            File-like image object (e.g. from Flask).

        loss : int
            Quality factor for lossy compression (1-100).

        Returns:
        --------
        bytes
            Byte-encoded WebP data.
        '''
        try:
            img = Image.open(img.stream)
            heimdahl('[CONVERT WEBP]', unveil = larva(), threat = 1)

            with io.BytesIO() as o:
                if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                    img.save(o, 'WEBP', quality = loss, lossless = False)
                else:
                    img.convert('RGB').save(o, 'WEBP', quality = loss)
                return o.getvalue()

        except Exception as e:
            raise HAL9000.DecodingError('utf-8', b'webp-bytes', 0, 1) from e

__all__ = ['Goose']