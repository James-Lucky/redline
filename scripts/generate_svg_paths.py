import json

def generate_paths():
    with open('client/public/data/delhi_district_boundaries.geojson', 'r', encoding='utf-8') as f:
        data = json.load(f)

    min_x, max_x = 3695803.2591803004, 3744631.4663355025
    min_y, max_y = 4481700.982415063, 4534091.615866566
    vw, vh = 560, 600
    padding = 24

    scale_x = (vw - 2 * padding) / (max_x - min_x)
    scale_y = (vh - 2 * padding) / (max_y - min_y)
    scale = min(scale_x, scale_y)

    offset_x = padding + ((vw - 2 * padding) - (max_x - min_x) * scale) / 2
    offset_y = padding + ((vh - 2 * padding) - (max_y - min_y) * scale) / 2

    districts = []

    for f in data['features']:
        props = f['properties']
        name = props['district']
        geom = f['geometry']
        g_type = geom['type']
        coords = geom['coordinates']
        
        path_cmds = []
        
        def process_poly(poly):
            for ring in poly:
                cmds = []
                for i, p in enumerate(ring):
                    sx = round(offset_x + (p[0] - min_x) * scale, 1)
                    sy = round(offset_y + (max_y - p[1]) * scale, 1)
                    if i == 0:
                        cmds.append(f"M{sx},{sy}")
                    else:
                        cmds.append(f"L{sx},{sy}")
                cmds.append("Z")
                path_cmds.append(" ".join(cmds))
                
        if g_type == 'Polygon':
            process_poly(coords)
        elif g_type == 'MultiPolygon':
            for poly in coords:
                process_poly(poly)
                
        full_d = " ".join(path_cmds)
        districts.append({
            "name": name,
            "dtcode": props.get("dtcode", ""),
            "path": full_d,
        })

    print(f"Processed {len(districts)} districts.")

    out_code = f"""// Pre-computed SVG paths for Delhi Administrative Districts from Survey of India (SOI)
export interface DelhiDistrictSvgPath {{
  name: string;
  dtcode: string;
  path: string;
}}

export const DELHI_DISTRICT_PATHS: DelhiDistrictSvgPath[] = {json.dumps(districts, indent=2)};
"""

    with open('client/src/lib/geo/delhiDistrictPaths.ts', 'w', encoding='utf-8') as f:
        f.write(out_code)
    print("Wrote client/src/lib/geo/delhiDistrictPaths.ts successfully.")

if __name__ == '__main__':
    generate_paths()
