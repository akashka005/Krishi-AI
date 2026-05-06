from fastapi import Depends, HTTPException, status
from pydantic import BaseModel

class MockUser:
    def __init__(self):
        self.phone_number = "anonymous"
        self.full_name = "Anonymous Farmer"
        self.tier = "Free"
        self.queries_remaining = 100
        self.credits = 0

def get_current_user() -> MockUser:
    return MockUser()