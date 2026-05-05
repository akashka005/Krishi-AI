import pandas as pd
import numpy as np
import os
import random

# Generate 100,000 rows
NUM_ROWS = 100000

print(f"Generating {NUM_ROWS} rows of synthetic telemetry data...")

# Seed for reproducibility
np.random.seed(42)

# Simulate Intents
intents = ['disease_detection', 'weather_forecast', 'crop_advisory', 'market_prices']
intent_actual = np.random.choice(intents, NUM_ROWS, p=[0.4, 0.2, 0.3, 0.1])

# Introduce ~6% error rate for intents
intent_predicted = intent_actual.copy()
error_mask_intent = np.random.rand(NUM_ROWS) < 0.058
# Replace the errors with a random intent
intent_predicted[error_mask_intent] = np.random.choice(intents, size=error_mask_intent.sum())

# Simulate Disease Detection
diseases = ['leaf_blight', 'rust', 'healthy', 'powdery_mildew']
# Generate diseases only where intent is disease_detection
disease_mask = intent_actual == 'disease_detection'
disease_count = disease_mask.sum()
disease_actual = np.full(NUM_ROWS, 'N/A', dtype=object)
disease_actual[disease_mask] = np.random.choice(diseases, disease_count, p=[0.3, 0.25, 0.35, 0.1])

disease_predicted = disease_actual.copy()
# Introduce ~8.5% error rate for diseases
error_mask_disease = (np.random.rand(NUM_ROWS) < 0.085) & disease_mask
disease_predicted[error_mask_disease] = np.random.choice(diseases, size=error_mask_disease.sum())

# Simulate Regional Language Success (0 or 1)
# ~88% success rate
regional_success = (np.random.rand(NUM_ROWS) < 0.883).astype(int)

# Conversation Metrics
# Task Completion (~86%)
task_completed = (np.random.rand(NUM_ROWS) < 0.864).astype(int)

# Fallback Rate (~4%)
fallback_triggered = (np.random.rand(NUM_ROWS) < 0.042).astype(int)

# Avg Messages (poisson distribution centered around 5.8)
messages_per_session = np.random.poisson(lam=5.8, size=NUM_ROWS)

# Satisfaction (CSAT 1-5, biased towards 4 and 5)
csat_scores = np.random.choice([1, 2, 3, 4, 5], NUM_ROWS, p=[0.02, 0.03, 0.10, 0.35, 0.50])

# System Metrics
# Latency in ms (normal distribution centered around 420)
latency_ms = np.random.normal(loc=420, scale=80, size=NUM_ROWS).astype(int)
# Cap minimum latency to 100ms
latency_ms = np.maximum(latency_ms, 100)

# Build DataFrame
df = pd.DataFrame({
    'session_id': [f"sess_{i}" for i in range(NUM_ROWS)],
    'intent_actual': intent_actual,
    'intent_predicted': intent_predicted,
    'disease_actual': disease_actual,
    'disease_predicted': disease_predicted,
    'regional_success': regional_success,
    'task_completed': task_completed,
    'fallback_triggered': fallback_triggered,
    'messages_per_session': messages_per_session,
    'csat_score': csat_scores,
    'latency_ms': latency_ms
})

# Save to backend data directory
output_dir = os.path.join(os.path.dirname(__file__), "..", "data", "evaluation")
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "synthetic_telemetry.csv")

df.to_csv(output_path, index=False)
print(f"✅ Successfully saved telemetry data to {output_path}")
