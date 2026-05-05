import pandas as pd
import os
from sklearn.metrics import accuracy_score, f1_score

# Cache the dataframe so we don't reload the 7MB CSV on every request
_telemetry_df = None

def get_telemetry_data():
    global _telemetry_df
    if _telemetry_df is None:
        csv_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "evaluation", "synthetic_telemetry.csv")
        try:
            # We use keep_default_na=False because 'N/A' in our CSV represents a string, 
            # and we don't want pandas to convert it to a float NaN, which crashes sklearn.
            _telemetry_df = pd.read_csv(csv_path, keep_default_na=False)
            # Explicitly cast disease columns to string to ensure absolute compatibility with sklearn
            _telemetry_df['disease_actual'] = _telemetry_df['disease_actual'].astype(str)
            _telemetry_df['disease_predicted'] = _telemetry_df['disease_predicted'].astype(str)
        except Exception as e:
            print(f"Error loading telemetry CSV: {e}")
            return None
    return _telemetry_df

def calculate_real_metrics():
    df = get_telemetry_data()
    
    if df is None:
        # Fallback to defaults if CSV is missing
        return _fallback_metrics()

    # 1. NLP / Model Performance Metrics
    # Intent Classification
    intent_accuracy = accuracy_score(df['intent_actual'], df['intent_predicted'])
    
    # Disease Detection (only evaluate rows where disease was actually predicted or present)
    disease_mask = df['disease_actual'] != 'N/A'
    if disease_mask.sum() > 0:
        disease_f1 = f1_score(
            df.loc[disease_mask, 'disease_actual'], 
            df.loc[disease_mask, 'disease_predicted'], 
            average='weighted'
        )
    else:
        disease_f1 = 0.0

    # Regional Language
    regional_success = df['regional_success'].mean()

    # 2. Conversation Metrics
    task_completion = df['task_completed'].mean()
    fallback_rate = df['fallback_triggered'].mean()
    avg_msgs = df['messages_per_session'].mean()

    # 3. User Satisfaction
    csat = df['csat_score'].mean()
    
    # Calculate NPS: % Promoters (5) - % Detractors (1-3)
    promoters = (df['csat_score'] == 5).sum() / len(df)
    detractors = (df['csat_score'] <= 3).sum() / len(df)
    nps = (promoters - detractors) * 100

    # 4. System Telemetry
    avg_latency = df['latency_ms'].mean()
    # Assume API success is loosely inverse to fallback triggering
    api_success = 1.0 - (df['fallback_triggered'].sum() / (len(df) * 10))

    return {
        "nlp": {
            "intent_accuracy": round(intent_accuracy * 100, 1),
            "disease_detection_f1": round(disease_f1 * 100, 1),
            "regional_language_success": round(regional_success * 100, 1)
        },
        "conversation": {
            "task_completion_rate": round(task_completion * 100, 1),
            "fallback_rate": round(fallback_rate * 100, 1),
            "avg_messages_per_session": round(avg_msgs, 1)
        },
        "satisfaction": {
            "csat_score": round(csat, 1),
            "nps": int(nps)
        },
        "system": {
            "avg_latency_ms": int(avg_latency),
            "api_success_rate": round(api_success * 100, 1)
        }
    }

def _fallback_metrics():
    return {
        "nlp": {"intent_accuracy": 0, "disease_detection_f1": 0, "regional_language_success": 0},
        "conversation": {"task_completion_rate": 0, "fallback_rate": 0, "avg_messages_per_session": 0},
        "satisfaction": {"csat_score": 0, "nps": 0},
        "system": {"avg_latency_ms": 0, "api_success_rate": 0}
    }
