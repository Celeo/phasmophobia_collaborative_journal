import json

from fastapi import FastAPI, Request, Depends, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from redis import Redis

from .websocket import ConnectionManager
from .store import get_redis, set_up_room, update_redis_room, clear_redis_room


app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")
manager = ConnectionManager()


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Return the homepage."""
    return templates.TemplateResponse("home.html", {"request": request})


@app.get("/rooms", response_class=HTMLResponse)
async def rooms(request: Request):
    """Return the page to navigate to a room."""
    return templates.TemplateResponse("rooms.html", {"request": request})


@app.get("/rooms/{room_id}", response_class=HTMLResponse)
async def room(request: Request, room_id: int, redis: Redis = Depends(get_redis)):
    """Load a room.

    This triggers a call to redis to set up a fresh room by
    the `room_id` if one does not exist.
    """
    if len(redis.keys(str(room_id))) == 0:
        set_up_room(redis, room_id)
    return templates.TemplateResponse(
        "room.html", {"request": request, "room_id": room_id}
    )


@app.get("/rooms/{room_id}/data")
async def room_data(room_id: int, redis: Redis = Depends(get_redis)):
    """Get the current state of the room.

    The clients maintain their own state, which _should_ each
    be accurate, but as not all clients may join before
    one of the clients start making changes to the room's state.
    """
    data = redis.get(str(room_id))
    if data:
        return json.loads(data.decode("utf-8"))
    return {}


@app.websocket("/ws")
async def websocket_connection(websocket: WebSocket, redis: Redis = Depends(get_redis)):
    """Websocket connection.

    This implementation is very simple, as most of the logic
    for implementing with the app lives on the frontend.

    The only parts that the server are responsible for are:

        1. The websocket server
        2. Broadcasting client messages to all clients
        3. Storing a copy of the room's data

    The "log" of changes are only maintained for active
    websocket clients; it is not persisted.
    """
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            if data["action"] == "update-evidence":
                update_redis_room(redis, data)
            elif data["action"] == "clear-room":
                clear_redis_room(redis, data["room"])
            await manager.broadcast_json(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
