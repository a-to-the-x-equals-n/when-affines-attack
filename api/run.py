# --- APP ---
from app import settings
# --- UTIL ---
import argparse
from app.util import heimdahl

def parse_args():
    parser = argparse.ArgumentParser(description = 'Run the Flask app.')
    parser.add_argument(
        '-D', '--dev',
        action = 'store_true',
        help = 'development or production mode'
    )
    parser.add_argument(
        '-V', '--verbose',
        action = 'store_true',
        help = 'Enable verbose logging'
    )
    return parser.parse_args()

if __name__ == '__main__':
    args = parse_args()
    settings.DEV = args.dev
    settings.VB = args.verbose

    from app import state, routes
    heimdahl(f'[RUNNING] \'{"TEST" if args.dev else "PRODUCTION"}\' MODE', unveil = args.verbose, threat = 1)

    try: 
        state.app.run(host = settings.IP, port = settings.PORT, debug = settings.DEV or settings.VB, threaded = False)
    finally:
        state.goose.close()
        heimdahl(f'[CLOSED] \'{state.goose.__class__.__name__}\'', unveil = True, threat = 3)