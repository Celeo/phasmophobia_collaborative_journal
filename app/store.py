import json
from typing import Any

from redis import Redis


def get_redis():
    redis = Redis()
    try:
        yield redis
    finally:
        pass


def set_up_room(redis: Redis, room_id: int):
    room_data = {
        "ghostName": "",
        "objectives": ["", "", ""],
        "evidence": [
            # NOTE: This data needs to be the same as in gameData.mjs
            {"short": "emf", "long": "EMF 5", "value": "unknown"},
            {"short": "fingerprints", "long": "Fingerprints", "value": "unknown"},
            {"short": "freezing", "long": "Freezing", "value": "unknown"},
            {"short": "orbs", "long": "Ghost Orbs", "value": "unknown"},
            {"short": "writing", "long": "Book writing", "value": "unknown"},
            {"short": "box", "long": "Spirit Box", "value": "unknown"},
            {"short": "dots", "long": "D.O.T.S Projector", "value": "unknown"},
        ],
    }
    redis.set(str(room_id), json.dumps(room_data))


def update_redis_room(redis: Redis, payload: dict[str, Any]):
    room_id = payload["room"]
    room_data_str = redis.get(str(room_id))
    if not room_data_str:
        return
    room_data = json.loads(room_data_str)
    if payload["action"] == "update-evidence":
        for index, evidence in enumerate(room_data["evidence"]):
            if evidence["short"] == payload["evidence"]:
                room_data["evidence"][index]["value"] = payload["newValue"]
                break
    elif payload["action"] == "update-basic":
        if payload["what"] == "ghostName":
            room_data["ghostName"] = payload["newValue"]
        elif payload["what"].startswith("objective"):
            room_data["objectives"][int(payload["what"][9])] = payload["newValue"]
    redis.set(str(room_id), json.dumps(room_data))


def clear_redis_room(redis: Redis, room: int):
    redis.delete(str(room))
