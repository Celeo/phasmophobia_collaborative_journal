import sqlite3
from sqlite3 import Connection

from fastapi import FastAPI, Request, Depends, WebSocket
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates


app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


def get_db():
    db = sqlite3.connect("data.db")
    try:
        yield db
    finally:
        db.close()


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})


@app.get("/rooms", response_class=HTMLResponse)
async def rooms(request: Request):
    return templates.TemplateResponse("rooms.html", {"request": request})


@app.get("/rooms/{room_id}", response_class=HTMLResponse)
async def room(request: Request, room_id: int):
    return templates.TemplateResponse(
        "room.html", {"request": request, "room_id": room_id}
    )


@app.get("/rooms/{room_id}/data", response_class=HTMLResponse)
async def room_data(request: Request, room_id: int, db: Connection = Depends(get_db)):
    # TODO
    return {}


@app.websocket("/ws")
async def websocket_connection(websocket: WebSocket, db: Connection = Depends(get_db)):
    await websocket.accept()
    while True:
        data = await websocket.receive_json()
        print("Got data from client:", data)
        # TODO:
        #   Parse
        #   Update DB
        #   Send update to all people
        await websocket.send_json({"message": "TODO"})
