import json
import numpy as np
import pandas as pd

print('hello')

with open('../data/ga_blk_v03.json', 'r') as f:
    data = json.load(f)

oconee_blocks = [d for d in data['features'] if (d["properties"]["STATEFP10"] + d["properties"]["COUNTYFP10"]) == "13219"]
data["features"] = oconee_blocks


with open('../data/oconee_blk_geojson.json', 'w') as outfile:
    json.dump(data, outfile)