from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates


app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})


@app.post("/profile/set")
async def profile_post():
    # TODO
    return {}


@app.get("/rooms", response_class=HTMLResponse)
async def rooms(request: Request):
    return templates.TemplateResponse("rooms.html", {"request": request})


@app.get("/rooms/{room_id}", response_class=HTMLResponse)
async def room(request: Request, room_id: int):
    return templates.TemplateResponse(
        "room.html", {"request": request, "room_id": room_id}
    )
