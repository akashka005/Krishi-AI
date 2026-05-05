import sqlite3

conn = sqlite3.connect('farm_ai.db')
cursor = conn.cursor()

try:
    print("Adding full_name column...")
    cursor.execute("ALTER TABLE users ADD COLUMN full_name VARCHAR")
except sqlite3.OperationalError as e:
    print(f"Error adding full_name: {e}")

try:
    print("Adding location column...")
    cursor.execute("ALTER TABLE users ADD COLUMN location VARCHAR")
except sqlite3.OperationalError as e:
    print(f"Error adding location: {e}")

try:
    print("Adding primary_crop column...")
    cursor.execute("ALTER TABLE users ADD COLUMN primary_crop VARCHAR")
except sqlite3.OperationalError as e:
    print(f"Error adding primary_crop: {e}")

conn.commit()
conn.close()
print("Database migration complete.")
