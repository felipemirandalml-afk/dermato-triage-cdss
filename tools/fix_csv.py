import csv
import os

data_path = "d:/dermato-triage-cdss/data/training_cases.csv"
temp_path = "d:/dermato-triage-cdss/data/training_cases_temp.csv"

with open(data_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    expected_cols = len(header)
    
    rows = []
    for i, row in enumerate(reader, 2):
        if len(row) == 29:
            # Row has old format. Insert 15 zeros before the target
            new_row = row[:-1] + ['0'] * (expected_cols - 29) + [row[-1]]
            rows.append(new_row)
        else:
            rows.append(row)

with open(temp_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(rows)

os.replace(temp_path, data_path)
print(f"Fixed {len(rows)} rows in CSV")
