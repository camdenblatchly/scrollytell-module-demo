import json
import numpy as np
import pandas as pd

print('hello')

with open('../data-raw/ga_blk_v02.json', 'r') as f:
    data = json.load(f)

ga_tract_rurality = pd.read_csv('../data-raw/ga_tract_rurality.csv', dtype = {"geoid": "category"})

blocks = data["objects"]["tl_2018_13_tabblock10"]["geometries"]

for i in range(0, len(blocks)):
	block = blocks[i]
	geoid_tract = block["properties"]["STATEFP10"] + block["properties"]["COUNTYFP10"] + block["properties"]["TRACTCE10"]

	tract_rurality = ga_tract_rurality[ga_tract_rurality['geoid'] == geoid_tract].reset_index(drop=True)

	if len(tract_rurality) > 0:
		blocks[i]["properties"]["rural_ruca"] = int(tract_rurality.at[0, "rural_ruca"])
		blocks[i]["properties"]["rural_ruca"] = int(tract_rurality.at[0, "rural_ruca"])
		blocks[i]["properties"]["rural_forhp"] = int(tract_rurality.at[0, "rural_forhp"])
		blocks[i]["properties"]["rural_fhfa"] = int(tract_rurality.at[0, "rural_fhfa"])
		blocks[i]["properties"]["rural_cdc"] = int(tract_rurality.at[0, "rural_cdc"])
		blocks[i]["properties"]["rural_cbsa_2013"] = int(tract_rurality.at[0, "rural_cbsa_2013"])


data["objects"]["tl_2018_13_tabblock10"]["geometries"] = blocks

with open('../data-raw/ga_blk_v02_with_rurality.json', 'w') as outfile:
    json.dump(data, outfile)