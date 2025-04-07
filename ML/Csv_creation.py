import pandas as pd

# Constants
TEXT_SIZE = 1600
SUMM_SIZE = 500

# Read the original CSV
train = pd.read_csv(r"C:\Users\mitta\OneDrive - iiit-b\Documents\NLP_Project\train.csv")

# Apply filtering
filtered_train = train[
    (train['article'].apply(lambda x: len(str(x)) < TEXT_SIZE)) &
    (train['highlights'].apply(lambda x: len(str(x)) < SUMM_SIZE))
]

# Save the filtered data to a new CSV
filtered_train.to_csv('filtered_train.csv', index=False)

# Optionally, print the size of the new dataset
print(f"Filtered dataset contains {len(filtered_train)} records.")
