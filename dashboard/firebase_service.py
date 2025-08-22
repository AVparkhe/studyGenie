import firebase_admin
from firebase_admin import credentials, firestore
from functools import lru_cache

@lru_cache(maxsize=1)
def get_db():
    cred = credentials.Certificate("firebase-key.json")
    try:
        firebase_admin.get_app()
    except ValueError:
        firebase_admin.initialize_app(cred)
    return firestore.client()

def get_scores(collection_name="scores"):
    """
    Fetch all docs from the 'scores' collection.
    Returns list of dicts with 'Marks' and 'Subject'.
    """
    db = get_db()
    docs = db.collection(collection_name).stream()
    data = []
    for d in docs:
        obj = d.to_dict()
        obj["__id"] = d.id
        data.append(obj)
    return data
