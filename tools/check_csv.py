import csv

data_path = "d:/dermato-triage-cdss/data/training_cases.csv"
with open(data_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    expected_cols = len(header)
    print(f"Header has {expected_cols} columns")
    for i, row in enumerate(reader, 2):
        if len(row) != expected_cols:
            if i > 1160: # Just show some of the new ones if failing
                print(f"Line {i} has {len(row)} columns: {row}")
        else:
             # Check if any numeric column contains a string
            for j, val in enumerate(row):
                 if j == 0: # Age
                     try:
                         float(val)
                     except:
                         print(f"Line {i} Col {j} is not numeric: {val}")
