// Anatomy mapping: Dynamis canonical muscle id -> real BodyParts3D meshes.
// Generated from public/models/dynamis-muscles.json. Do not hand-edit.
// One geometry per part, shared by every canonical it belongs to (no
// duplication, no z-fighting). Tap resolution uses canonicals[0].
// Provenance: BodyParts3D 4.0 (c) Database Center for Life Science, CC BY 4.0,
// repacked from Human-Atlas chunk packaging (MIT app, CC BY data).
// 7 muscles have no individual mesh in the source data (see UNMAPPED_MUSCLES)
// and use the honest model-limitation UI instead of fake geometry.
export const ANATOMY_MESHES = {
  "biceps_brachii": [
    {
      "name": "FJ1478",
      "side": "right"
    },
    {
      "name": "FJ1478M",
      "side": "left"
    },
    {
      "name": "FJ1512",
      "side": "right"
    },
    {
      "name": "FJ1512M",
      "side": "left"
    }
  ],
  "brachialis": [
    {
      "name": "FJ1486",
      "side": "right"
    },
    {
      "name": "FJ1486M",
      "side": "left"
    }
  ],
  "brachioradialis": [
    {
      "name": "FJ1487",
      "side": "right"
    },
    {
      "name": "FJ1487M",
      "side": "left"
    }
  ],
  "triceps_brachii": [
    {
      "name": "FJ1477",
      "side": "right"
    },
    {
      "name": "FJ1477M",
      "side": "left"
    },
    {
      "name": "FJ1479",
      "side": "right"
    },
    {
      "name": "FJ1479M",
      "side": "left"
    },
    {
      "name": "FJ1480",
      "side": "right"
    },
    {
      "name": "FJ1480M",
      "side": "left"
    }
  ],
  "forearm_flexors": [
    {
      "name": "FJ1473",
      "side": "right"
    },
    {
      "name": "FJ1473M",
      "side": "left"
    },
    {
      "name": "FJ1475",
      "side": "right"
    },
    {
      "name": "FJ1475M",
      "side": "left"
    },
    {
      "name": "FJ1496",
      "side": "right"
    },
    {
      "name": "FJ1496M",
      "side": "left"
    },
    {
      "name": "FJ1497",
      "side": "right"
    },
    {
      "name": "FJ1497M",
      "side": "left"
    },
    {
      "name": "FJ1499",
      "side": "right"
    },
    {
      "name": "FJ1499M",
      "side": "left"
    },
    {
      "name": "FJ1502",
      "side": "right"
    },
    {
      "name": "FJ1502M",
      "side": "left"
    },
    {
      "name": "FJ1503",
      "side": "right"
    },
    {
      "name": "FJ1503M",
      "side": "left"
    },
    {
      "name": "FJ1518",
      "side": "right"
    },
    {
      "name": "FJ1518M",
      "side": "left"
    }
  ],
  "forearm_extensors": [
    {
      "name": "FJ1472",
      "side": "right"
    },
    {
      "name": "FJ1472M",
      "side": "left"
    },
    {
      "name": "FJ1489",
      "side": "right"
    },
    {
      "name": "FJ1489M",
      "side": "left"
    },
    {
      "name": "FJ1490",
      "side": "right"
    },
    {
      "name": "FJ1490M",
      "side": "left"
    },
    {
      "name": "FJ1491",
      "side": "right"
    },
    {
      "name": "FJ1491M",
      "side": "left"
    },
    {
      "name": "FJ1492",
      "side": "right"
    },
    {
      "name": "FJ1492M",
      "side": "left"
    },
    {
      "name": "FJ1493",
      "side": "right"
    },
    {
      "name": "FJ1493M",
      "side": "left"
    },
    {
      "name": "FJ1494",
      "side": "right"
    },
    {
      "name": "FJ1494M",
      "side": "left"
    },
    {
      "name": "FJ1495",
      "side": "right"
    },
    {
      "name": "FJ1495M",
      "side": "left"
    },
    {
      "name": "FJ1517",
      "side": "right"
    },
    {
      "name": "FJ1517M",
      "side": "left"
    }
  ],
  "anterior_deltoid": [
    {
      "name": "FJ1468",
      "side": "right"
    },
    {
      "name": "FJ1468M",
      "side": "left"
    }
  ],
  "lateral_deltoid": [
    {
      "name": "FJ1467",
      "side": "right"
    },
    {
      "name": "FJ1467M",
      "side": "left"
    }
  ],
  "posterior_deltoid": [
    {
      "name": "FJ1513",
      "side": "right"
    },
    {
      "name": "FJ1513M",
      "side": "left"
    }
  ],
  "supraspinatus": [
    {
      "name": "FJ1506",
      "side": "right"
    },
    {
      "name": "FJ1506M",
      "side": "left"
    }
  ],
  "infraspinatus": [
    {
      "name": "FJ1500",
      "side": "right"
    },
    {
      "name": "FJ1500M",
      "side": "left"
    }
  ],
  "teres_minor": [
    {
      "name": "FJ1508",
      "side": "right"
    },
    {
      "name": "FJ1508M",
      "side": "left"
    }
  ],
  "subscapularis": [
    {
      "name": "FJ1504",
      "side": "right"
    },
    {
      "name": "FJ1504M",
      "side": "left"
    }
  ],
  "trapezius": [
    {
      "name": "FJ1520",
      "side": "right"
    },
    {
      "name": "FJ1520M",
      "side": "left"
    },
    {
      "name": "FJ1521",
      "side": "right"
    },
    {
      "name": "FJ1521M",
      "side": "left"
    },
    {
      "name": "FJ1554",
      "side": "right"
    },
    {
      "name": "FJ1554M",
      "side": "left"
    }
  ],
  "serratus_anterior": [
    {
      "name": "FJ1459",
      "side": "right"
    },
    {
      "name": "FJ1459M",
      "side": "left"
    }
  ],
  "rhomboid_major": [
    {
      "name": "FJ1536",
      "side": "right"
    },
    {
      "name": "FJ1536M",
      "side": "left"
    }
  ],
  "rhomboids": [
    {
      "name": "FJ1536",
      "side": "right"
    },
    {
      "name": "FJ1536M",
      "side": "left"
    },
    {
      "name": "FJ1537",
      "side": "right"
    },
    {
      "name": "FJ1537M",
      "side": "left"
    }
  ],
  "rhomboid_minor": [
    {
      "name": "FJ1537",
      "side": "right"
    },
    {
      "name": "FJ1537M",
      "side": "left"
    }
  ],
  "teres_major": [
    {
      "name": "FJ1507",
      "side": "right"
    },
    {
      "name": "FJ1507M",
      "side": "left"
    }
  ],
  "levator_scapulae": [
    {
      "name": "FJ1532",
      "side": "right"
    },
    {
      "name": "FJ1532M",
      "side": "left"
    }
  ],
  "erector_spinae": [
    {
      "name": "FJ1526",
      "side": "right"
    },
    {
      "name": "FJ1526M",
      "side": "left"
    },
    {
      "name": "FJ1527",
      "side": "right"
    },
    {
      "name": "FJ1527M",
      "side": "left"
    },
    {
      "name": "FJ1528",
      "side": "right"
    },
    {
      "name": "FJ1528M",
      "side": "left"
    },
    {
      "name": "FJ1533",
      "side": "right"
    },
    {
      "name": "FJ1533M",
      "side": "left"
    },
    {
      "name": "FJ1534",
      "side": "right"
    },
    {
      "name": "FJ1534M",
      "side": "left"
    },
    {
      "name": "FJ1535",
      "side": "right"
    },
    {
      "name": "FJ1535M",
      "side": "left"
    },
    {
      "name": "FJ1544",
      "side": "right"
    },
    {
      "name": "FJ1544M",
      "side": "left"
    }
  ],
  "external_obliques": [
    {
      "name": "FJ1452",
      "side": "right"
    },
    {
      "name": "FJ1452M",
      "side": "left"
    }
  ],
  "rotatores": [
    {
      "name": "FJ1522",
      "side": "right"
    },
    {
      "name": "FJ1522M",
      "side": "left"
    },
    {
      "name": "FJ1524",
      "side": "right"
    },
    {
      "name": "FJ1524M",
      "side": "left"
    },
    {
      "name": "FJ1525",
      "side": "center"
    },
    {
      "name": "FJ1525M",
      "side": "center"
    }
  ],
  "semispinalis": [
    {
      "name": "FJ1538",
      "side": "right"
    },
    {
      "name": "FJ1538M",
      "side": "left"
    },
    {
      "name": "FJ1539",
      "side": "right"
    },
    {
      "name": "FJ1539M",
      "side": "left"
    },
    {
      "name": "FJ1540",
      "side": "right"
    },
    {
      "name": "FJ1540M",
      "side": "left"
    }
  ],
  "diaphragm": [
    {
      "name": "FJ3131",
      "side": "center"
    }
  ],
  "rectus_femoris": [
    {
      "name": "FJ1433",
      "side": "right"
    },
    {
      "name": "FJ1433M",
      "side": "left"
    }
  ],
  "quadriceps": [
    {
      "name": "FJ1433",
      "side": "right"
    },
    {
      "name": "FJ1433M",
      "side": "left"
    },
    {
      "name": "FJ1441",
      "side": "right"
    },
    {
      "name": "FJ1441M",
      "side": "left"
    },
    {
      "name": "FJ1442",
      "side": "right"
    },
    {
      "name": "FJ1442M",
      "side": "left"
    },
    {
      "name": "FJ1443",
      "side": "right"
    },
    {
      "name": "FJ1443M",
      "side": "left"
    }
  ],
  "hamstrings": [
    {
      "name": "FJ1395",
      "side": "right"
    },
    {
      "name": "FJ1395M",
      "side": "left"
    },
    {
      "name": "FJ1435",
      "side": "right"
    },
    {
      "name": "FJ1435M",
      "side": "left"
    },
    {
      "name": "FJ1436",
      "side": "right"
    },
    {
      "name": "FJ1436M",
      "side": "left"
    },
    {
      "name": "FJ1444",
      "side": "right"
    },
    {
      "name": "FJ1444M",
      "side": "left"
    }
  ],
  "gluteus_maximus": [
    {
      "name": "FJ1418",
      "side": "right"
    },
    {
      "name": "FJ1418M",
      "side": "left"
    }
  ],
  "glutes": [
    {
      "name": "FJ1418",
      "side": "right"
    },
    {
      "name": "FJ1418M",
      "side": "left"
    },
    {
      "name": "FJ1419",
      "side": "right"
    },
    {
      "name": "FJ1419M",
      "side": "left"
    },
    {
      "name": "FJ1420",
      "side": "right"
    },
    {
      "name": "FJ1420M",
      "side": "left"
    }
  ],
  "adductors": [
    {
      "name": "FJ1401",
      "side": "right"
    },
    {
      "name": "FJ1401M",
      "side": "left"
    },
    {
      "name": "FJ1402",
      "side": "right"
    },
    {
      "name": "FJ1402M",
      "side": "left"
    },
    {
      "name": "FJ1403",
      "side": "right"
    },
    {
      "name": "FJ1403M",
      "side": "left"
    },
    {
      "name": "FJ1404",
      "side": "right"
    },
    {
      "name": "FJ1404M",
      "side": "left"
    }
  ],
  "calves": [
    {
      "name": "FJ1394",
      "side": "right"
    },
    {
      "name": "FJ1394M",
      "side": "left"
    },
    {
      "name": "FJ1397",
      "side": "right"
    },
    {
      "name": "FJ1397M",
      "side": "left"
    },
    {
      "name": "FJ1437",
      "side": "right"
    },
    {
      "name": "FJ1437M",
      "side": "left"
    }
  ],
  "tibialis_anterior": [
    {
      "name": "FJ1439",
      "side": "right"
    },
    {
      "name": "FJ1439M",
      "side": "left"
    }
  ],
  "iliopsoas": [
    {
      "name": "FJ1422",
      "side": "right"
    },
    {
      "name": "FJ1422M",
      "side": "left"
    },
    {
      "name": "FJ1431",
      "side": "right"
    },
    {
      "name": "FJ1431M",
      "side": "left"
    }
  ],
  "tensor_fasciae_latae": [
    {
      "name": "FJ1438",
      "side": "right"
    },
    {
      "name": "FJ1438M",
      "side": "left"
    }
  ],
  "pectoralis_major": [
    {
      "name": "FJ1446",
      "side": "right"
    },
    {
      "name": "FJ1446M",
      "side": "left"
    },
    {
      "name": "FJ1447",
      "side": "right"
    },
    {
      "name": "FJ1447M",
      "side": "left"
    },
    {
      "name": "FJ1464",
      "side": "right"
    },
    {
      "name": "FJ1464M",
      "side": "left"
    }
  ],
  "pectoralis_minor": [
    {
      "name": "FJ1456",
      "side": "right"
    },
    {
      "name": "FJ1456M",
      "side": "left"
    }
  ],
  "subclavius": [
    {
      "name": "FJ1460",
      "side": "right"
    },
    {
      "name": "FJ1460M",
      "side": "left"
    }
  ]
};
export const UNMAPPED_MUSCLES = ["latissimus_dorsi","rectus_abdominis","internal_obliques","transverse_abdominis","multifidus","quadratus_lumborum","pelvic_floor"];
export const MODEL_URL_BASE = '/models/dynamis-muscles';
