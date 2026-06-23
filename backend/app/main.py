from fastapi import FastAPI
from app.database.mongodb import database
from app.api.auth_routes import router as auth_router
from app.api.user_routes import router as user_router

app = FastAPI(title="TalkFlow API")
app.include_router(user_router)


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


app.include_router(auth_router)