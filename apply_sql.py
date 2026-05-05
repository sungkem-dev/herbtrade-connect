import json
import subprocess
import sys

with open('/home/ubuntu/herblocx/supabase_schema.sql', 'r') as f:
    sql_content = f.read()

input_data = {
    "project_id": "nunkvjgxmzzmwapxaxhu",
    "name": "initial_schema_and_rls",
    "query": sql_content
}

cmd = [
    "manus-mcp-cli", "tool", "call", "apply_migration",
    "--server", "supabase",
    "--input", json.dumps(input_data)
]

result = subprocess.run(cmd, capture_output=True, text=True)
print(result.stdout)
if result.stderr:
    print("Error:", result.stderr, file=sys.stderr)
