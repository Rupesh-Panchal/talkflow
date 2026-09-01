from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.database.mongodb import database

from app.api.auth_routes import router as auth_router
from app.api.user_routes import router as user_router
from app.api.conversation_routes import router as conversation_router
from app.api.message_routes import router as message_router 

from app.ws.routes import router as ws_router

app = FastAPI(title="TalkFlow API")

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(conversation_router)
app.include_router(message_router)  

app.include_router(ws_router)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
async def root():
    return {
        "message": "TalkFlow Backend Running"
    }


@app.get("/test-db")
async def test_db():
    collections = await database.list_collection_names()

    return {
        "status": "connected",
        "collections": collections
    }