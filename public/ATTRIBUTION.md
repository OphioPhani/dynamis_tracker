# Anatomy attribution — Dynamis Tracker

Interactive 3D muscle geometry:

- **BodyParts3D 4.0**, © The Database Center for Life Science (DBCLS),
  licensed under **CC BY 4.0 International**
  (https://creativecommons.org/licenses/by/4.0/).
  Required credit: "BodyParts3D, © The Database Center for Life Science
  licensed under CC Attribution 4.0 International".
- Repacked for mobile (169 muscle meshes, quantized) from the packaging
  produced by **Human-Atlas** (https://github.com/slorksmo/Human-Atlas —
  application code MIT, anatomy data CC BY 4.0).

Adaptations: per-muscle extraction, uint16 quantization, mobile repack
(`public/models/dynamis-muscles.{json,bin}`); no muscle reshaped.

Evaluated but NOT bundled:
- MuscleMap (https://github.com/Jsplice/MuscleMap, MIT) — 2D vector
  heatmaps with semantic IDs, but no 3D meshes.
- Z-Anatomy — CC BY-NC-SA (non-commercial); excluded for license reasons.

No Innerbody (innerbody.com) assets, code, images or data are used,
copied, scraped or hotlinked anywhere in this project.
