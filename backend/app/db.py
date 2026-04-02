import json
import os

DATA_FILE = "database.json"

class JSONDatabase:
    def __init__(self):
        self.file = DATA_FILE
        if not os.path.exists(self.file):
            self.save({"users": [], "records": []})

    def load(self):
        try:
            with open(self.file, "r") as f:
                return json.load(f)
        except Exception:
            return {"users": [], "records": []}

    def save(self, dict_data):
        with open(self.file, "w") as f:
            json.dump(dict_data, f, default=str)

db_instance = JSONDatabase()

def get_database():
    return db_instance
