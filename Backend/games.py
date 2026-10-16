import requests
import os
from dotenv import load_dotenv
from database import SessionLocal
import models
from sqlalchemy import select

load_dotenv()

API_KEY = os.getenv("CFBD_API_KEY")
if API_KEY is None:
    raise RuntimeError("CFBD_API_KEY environment variable is not set")

url = "https://api.collegefootballdata.com/"
headers = {"Authorization": f"Bearer {API_KEY}"}

schools = ["Alabama", "Arkansas", "Auburn", "Florida", "Georgia", "Kentucky", "LSU", "Mississippi State", "Missouri", "Ole Miss", "South Carolina", "Tennessee", "Texas A&M", "Vanderbilt","Texas", "Oklahoma"]
conferences = ["SEC", "Big 12", "ACC", "Big Ten"]

for school in schools:
    response = requests.get(url + "games/players", headers=headers, params={"year": 2026, "week": 6, "team": school})
    if response.status_code == 200:
        data = response.json()
        if data == []:
            print(f"{school} had a bye week in week 6")
            continue
        with SessionLocal() as session:
            statement = select(models.Game).where(models.Game.cfbd_id == data[0]["id"])
            existing_game = session.execute(statement).scalar_one_or_none()
            if existing_game is None:
                new_game = models.Game(
                    cfbd_id=data[0]["id"],
                    week=6,
                    home_team=data[0]["teams"][1]["team"],
                    away_team=data[0]["teams"][0]["team"],
                    boxscore=data[0]["teams"]
                )
                session.add(new_game)
                session.commit()
                print(f"Added new game: {data[0]['teams'][0]['team']} vs {data[0]['teams'][1]['team']} (Week 6)")
    else:
        raise Exception(f"Error fetching games for {school}: {response.status_code} - {response.text}")