from app.config import app, IP, PORT

if __name__ == '__main__':
    app.run(host = IP, port = PORT, debug = True, threaded = False)