// Auto-generated from legacy 5-day plan — 45 muscles / 135 exercises. Do not hand-edit.
export const DAY_META = {
  "Monday": {
    "focus": "Upper Body",
    "desc": "Chest \u00b7 Shoulders \u00b7 Arms",
    "color": "#ef4444",
    "train": true
  },
  "Tuesday": {
    "focus": "Lower Body + Core",
    "desc": "Quads \u00b7 Adductors \u00b7 Calves \u00b7 Abs",
    "color": "#22c55e",
    "train": true
  },
  "Wednesday": {
    "focus": "REST",
    "desc": "Recovery \u00b7 Walk \u00b7 Sleep",
    "color": "#6b7280",
    "train": false
  },
  "Thursday": {
    "focus": "Back + Shoulders + Arms",
    "desc": "Lats \u00b7 Rhomboids \u00b7 Cuff",
    "color": "#a855f7",
    "train": true
  },
  "Friday": {
    "focus": "Chest + Upper + Core",
    "desc": "Pec minor \u00b7 Serratus \u00b7 Posture",
    "color": "#f97316",
    "train": true
  },
  "Saturday": {
    "focus": "Lower + Posterior + Core",
    "desc": "Hams \u00b7 Glutes \u00b7 Deep core",
    "color": "#06b6d4",
    "train": true
  },
  "Sunday": {
    "focus": "REST",
    "desc": "Recovery \u00b7 Mobility",
    "color": "#6b7280",
    "train": false
  }
};

export const GROUP_COLORS = {
  "Arms": "#3b82f6",
  "Shoulders": "#f97316",
  "Upper Back": "#a855f7",
  "Spine / Core": "#06b6d4",
  "Chest": "#ef4444",
  "Lower Body": "#22c55e"
};

export const RANK_META = { good:{label:'GOOD',color:'#22c55e'}, better:{label:'BETTER',color:'#eab308'}, best:{label:'BEST',color:'#3b82f6'} };

export const REQUIRED_MUSCLES = [
  "Adductors",
  "Anterior deltoid",
  "Biceps brachii",
  "Brachialis",
  "Brachioradialis",
  "Calves",
  "Diaphragm",
  "Erector spinae",
  "External obliques",
  "Forearm extensors",
  "Forearm flexors",
  "Glutes",
  "Gluteus maximus",
  "Hamstrings",
  "Iliopsoas",
  "Infraspinatus",
  "Internal obliques",
  "Lateral deltoid",
  "Latissimus dorsi",
  "Levator scapulae",
  "Multifidus",
  "Pectoralis major",
  "Pectoralis minor",
  "Pelvic floor",
  "Posterior deltoid",
  "Quadratus lumborum",
  "Quadriceps",
  "Rectus abdominis",
  "Rectus femoris",
  "Rhomboid major",
  "Rhomboid minor",
  "Rhomboids",
  "Rotatores",
  "Semispinalis",
  "Serratus anterior",
  "Subclavius",
  "Subscapularis",
  "Supraspinatus",
  "Tensor fasciae latae",
  "Teres major",
  "Teres minor",
  "Tibialis anterior",
  "Transverse abdominis",
  "Trapezius",
  "Triceps brachii"
];

export const WORKOUT_PLAN = [
  {
    "day": "Monday",
    "focus": "Upper Body",
    "group": "Arms",
    "muscle": "Biceps brachii",
    "exercises": [
      {
        "rank": "good",
        "name": "Standing Dumbbell Curl",
        "equipment": "Dumbbells",
        "grip": "Supinated",
        "gripDetail": "Shoulder-width, palms forward",
        "primary": [
          "Biceps brachii"
        ],
        "secondary": [
          "Brachialis",
          "Brachioradialis",
          "Forearm flexors"
        ],
        "stabilizers": [
          "Anterior deltoid",
          "Trapezius (upper)",
          "Erector spinae"
        ],
        "sets": "3-4",
        "reps": "10-12",
        "rest": "90 sec",
        "technique": "Stand tall, elbows pinned at sides. Curl dumbbells to shoulder height, lower over 2-3 sec with full elbow extension.",
        "formCue": "Keep elbows fixed; no swinging. Squeeze biceps at top without shrugging.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Accessible, bilateral or alternating, easy to learn and overload with minimal equipment.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "EZ-Bar Curl",
        "equipment": "EZ bar",
        "grip": "Supinated (angled)",
        "gripDetail": "Shoulder-width on EZ bends, underhand",
        "primary": [
          "Biceps brachii"
        ],
        "secondary": [
          "Brachialis",
          "Forearm flexors",
          "Anterior deltoid"
        ],
        "stabilizers": [
          "Erector spinae",
          "Trapezius",
          "Wrist stabilizers"
        ],
        "sets": "3-4",
        "reps": "8-12",
        "rest": "90 sec",
        "technique": "Stand with EZ-bar at thighs. Curl to chest level keeping upper arms vertical, lower under control without locking elbows harshly.",
        "formCue": "Wrists neutral on angled grips; elbows stay in front of torso plane.",
        "difficulty": "Intermediate",
        "rationale": "BETTER: EZ angles reduce wrist strain vs straight bar, allows heavier loading than dumbbells with stable bilateral path.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Incline Dumbbell Curl",
        "equipment": "Dumbbells + Adjustable bench (30-45 deg)",
        "grip": "Supinated",
        "gripDetail": "Shoulder-width, palms forward, arms hanging behind torso",
        "primary": [
          "Biceps brachii"
        ],
        "secondary": [
          "Brachialis",
          "Brachioradialis"
        ],
        "stabilizers": [
          "Anterior deltoid",
          "Rotator cuff",
          "Erector spinae"
        ],
        "sets": "3-4",
        "reps": "8-12",
        "rest": "90 sec",
        "technique": "Lie back on incline bench, arms hang straight. Curl without moving upper arm, supinate hard at top, lower to full stretch.",
        "formCue": "Let biceps fully lengthen at bottom; do not let shoulders roll forward.",
        "difficulty": "Intermediate",
        "rationale": "BEST: Puts long head under greatest stretch at bottom, largest ROM, strong hypertrophy stimulus with strict form.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Monday",
    "focus": "Upper Body",
    "group": "Arms",
    "muscle": "Brachialis",
    "exercises": [
      {
        "rank": "good",
        "name": "Dumbbell Hammer Curl",
        "equipment": "Dumbbells",
        "grip": "Neutral",
        "gripDetail": "Shoulder-width, palms facing each other",
        "primary": [
          "Brachialis"
        ],
        "secondary": [
          "Biceps brachii",
          "Brachioradialis",
          "Forearm flexors"
        ],
        "stabilizers": [
          "Anterior deltoid",
          "Trapezius"
        ],
        "sets": "3-3",
        "reps": "10-12",
        "rest": "75 sec",
        "technique": "Curl with neutral grip, thumbs up, elbows pinned. Lower slowly to full extension.",
        "formCue": "Do not rotate wrists; keep hammer path vertical.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Simple neutral-grip mass builder for brachialis, elbow-friendly and accessible.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Cable Rope Hammer Curl",
        "equipment": "Cable machine + Rope attachment",
        "grip": "Neutral (rope)",
        "gripDetail": "Close-neutral, thumbs up, elbows at sides",
        "primary": [
          "Brachialis"
        ],
        "secondary": [
          "Biceps brachii",
          "Brachioradialis"
        ],
        "stabilizers": [
          "Anterior deltoid",
          "Erector spinae"
        ],
        "sets": "3-4",
        "reps": "10-15",
        "rest": "75 sec",
        "technique": "Face cable, rope at bottom pulley. Curl rope to chest, split rope ends slightly at top, control eccentric.",
        "formCue": "Keep upper arms vertical; avoid leaning back to cheat.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Constant cable tension removes bottom rest, better resistance curve than dumbbells.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Preacher Hammer Curl (Dumbbell)",
        "equipment": "Dumbbells + Preacher bench",
        "grip": "Neutral",
        "gripDetail": "Shoulder-width neutral, single or both arms",
        "primary": [
          "Brachialis"
        ],
        "secondary": [
          "Biceps brachii (short head)",
          "Brachioradialis"
        ],
        "stabilizers": [
          "Anterior deltoid",
          "Forearm extensors"
        ],
        "sets": "3-4",
        "reps": "8-12",
        "rest": "90 sec",
        "technique": "Brace upper arms on preacher pad, chest against pad. Curl to 90 %+ without lifting elbows, lower to near-full extension.",
        "formCue": "Do not hyperextend elbows at bottom; keep shoulders down.",
        "difficulty": "Intermediate",
        "rationale": "BEST: Preacher pad eliminates cheating, isolates brachialis through strict ROM with stretch emphasis.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Monday",
    "focus": "Upper Body",
    "group": "Arms",
    "muscle": "Brachioradialis",
    "exercises": [
      {
        "rank": "good",
        "name": "Dumbbell Reverse Curl",
        "equipment": "Dumbbells",
        "grip": "Pronated (overhand)",
        "gripDetail": "Shoulder-width, palms down",
        "primary": [
          "Brachioradialis"
        ],
        "secondary": [
          "Brachialis",
          "Forearm extensors",
          "Biceps brachii"
        ],
        "stabilizers": [
          "Anterior deltoid",
          "Wrist stabilizers"
        ],
        "sets": "2-3",
        "reps": "12-15",
        "rest": "60 sec",
        "technique": "Hold dumbbells overhand, elbows at sides. Curl to chest height, lower slowly.",
        "formCue": "Use light-moderate weight; wrists straight, no flicking.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Direct pronated stimulus for brachioradialis, minimal equipment.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "EZ-Bar Reverse Curl",
        "equipment": "EZ bar",
        "grip": "Pronated (angled overhand)",
        "gripDetail": "Shoulder-width on EZ bends",
        "primary": [
          "Brachioradialis"
        ],
        "secondary": [
          "Brachialis",
          "Forearm extensors"
        ],
        "stabilizers": [
          "Anterior deltoid",
          "Erector spinae"
        ],
        "sets": "3-4",
        "reps": "10-15",
        "rest": "75 sec",
        "technique": "Stand tall, overhand EZ grip. Curl to chest, pause, lower over 2 sec.",
        "formCue": "Keep elbows pinned; avoid shrugging under load.",
        "difficulty": "Intermediate",
        "rationale": "BETTER: EZ angles ease wrist stress vs straight bar, allows progressive overload.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Cable Reverse Curl (Straight Bar)",
        "equipment": "Cable machine + Straight bar",
        "grip": "Pronated",
        "gripDetail": "Shoulder-width overhand",
        "primary": [
          "Brachioradialis"
        ],
        "secondary": [
          "Brachialis",
          "Forearm extensors",
          "Biceps brachii"
        ],
        "stabilizers": [
          "Anterior deltoid",
          "Erector spinae"
        ],
        "sets": "3-4",
        "reps": "12-15",
        "rest": "60 sec",
        "technique": "Face cable at bottom pulley, overhand grip. Curl bar to chest, squeeze, lower with control.",
        "formCue": "Torso rigid; do not use hips to swing weight up.",
        "difficulty": "Intermediate",
        "rationale": "BEST: Cable keeps tension through full ROM including fully lengthened position, best pump with joint-friendly loading.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Monday",
    "focus": "Upper Body",
    "group": "Arms",
    "muscle": "Triceps brachii",
    "exercises": [
      {
        "rank": "good",
        "name": "Rope Pushdown",
        "equipment": "Cable machine + Rope",
        "grip": "Pronated to Neutral",
        "gripDetail": "Close grip, rope ends, elbows at sides",
        "primary": [
          "Triceps brachii (all heads)"
        ],
        "secondary": [
          "Anconeus",
          "Forearm extensors"
        ],
        "stabilizers": [
          "Anterior deltoid",
          "Latissimus dorsi (shoulder stabilizer)",
          "Erector spinae"
        ],
        "sets": "3-4",
        "reps": "10-15",
        "rest": "75 sec",
        "technique": "Elbows pinned at sides. Push rope down to full elbow extension, split rope at bottom, return to 90 deg.",
        "formCue": "Shoulders down; only forearms move.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Accessible isolation, easy to learn, elbow-friendly with rope allowing natural wrist path.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "EZ-Bar Skullcrusher (Lying Extension)",
        "equipment": "EZ bar + Flat bench",
        "grip": "Pronated (angled)",
        "gripDetail": "Close grip on EZ bends, overhand",
        "primary": [
          "Triceps brachii (long head emphasis)"
        ],
        "secondary": [
          "Anconeus"
        ],
        "stabilizers": [
          "Anterior deltoid",
          "Rotator cuff",
          "Erector spinae"
        ],
        "sets": "3-4",
        "reps": "8-12",
        "rest": "90 sec",
        "technique": "Lie on bench, bar over shoulders. Lower to forehead/above head by bending elbows only, extend without flaring.",
        "formCue": "Keep upper arms vertical; control eccentric to protect elbows.",
        "difficulty": "Intermediate",
        "rationale": "BETTER: Long-head stretch under load gives superior hypertrophy vs pushdown, good overload potential.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Overhead Cable Extension (Rope)",
        "equipment": "Cable machine + Rope, bench optional",
        "grip": "Neutral (overhead)",
        "gripDetail": "Close-neutral overhead, back to stack",
        "primary": [
          "Triceps brachii (long head)"
        ],
        "secondary": [
          "Anconeus"
        ],
        "stabilizers": [
          "Rotator cuff",
          "Erector spinae",
          "Trapezius (lower)"
        ],
        "sets": "3-4",
        "reps": "10-15",
        "rest": "90 sec",
        "technique": "Face away from cable, rope overhead. Extend elbows overhead to full lockout, lower behind head for deep stretch.",
        "formCue": "Ribcage down; do not arch lower back to cheat.",
        "difficulty": "Intermediate",
        "rationale": "BEST: Overhead position maximally lengthens long head, cable gives even resistance, best growth + safest heavy loading.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Monday",
    "focus": "Upper Body",
    "group": "Arms",
    "muscle": "Forearm flexors",
    "exercises": [
      {
        "rank": "good",
        "name": "Seated Dumbbell Wrist Curl",
        "equipment": "Dumbbells + Bench",
        "grip": "Supinated",
        "gripDetail": "Shoulder-width, palms up, forearms on thighs",
        "primary": [
          "Forearm flexors"
        ],
        "secondary": [
          "Brachialis"
        ],
        "stabilizers": [
          "Biceps brachii (stabilizer)",
          "Wrist stabilizers"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "60 sec",
        "technique": "Sit, forearms on thighs, wrists beyond knees. Curl wrists up, squeeze, lower to full stretch.",
        "formCue": "Only wrists move; forearms stay planted.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Simple direct wrist-flexor work, minimal load needed.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Seated Barbell Wrist Curl",
        "equipment": "Barbell + Bench",
        "grip": "Supinated",
        "gripDetail": "Shoulder-width underhand",
        "primary": [
          "Forearm flexors"
        ],
        "secondary": [
          "Brachialis"
        ],
        "stabilizers": [
          "Biceps brachii"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "60 sec",
        "technique": "Same setup with barbell. Curl wrists through full ROM, pause at top.",
        "formCue": "Light weight; full stretch without pain.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Bilateral barbell allows slightly more load and even wrist path.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Cable Wrist Curl (Straight Bar)",
        "equipment": "Cable machine + Straight bar + Bench",
        "grip": "Supinated",
        "gripDetail": "Shoulder-width underhand, low pulley",
        "primary": [
          "Forearm flexors"
        ],
        "secondary": [
          "Brachialis",
          "Biceps brachii"
        ],
        "stabilizers": [
          "Forearm extensors (antagonist stabilizer)"
        ],
        "sets": "3-4",
        "reps": "12-20",
        "rest": "60 sec",
        "technique": "Sit facing cable, forearms on thighs. Curl bar toward you against cable tension, control return.",
        "formCue": "Keep tension throughout; do not let stack touch down.",
        "difficulty": "Beginner",
        "rationale": "BEST: Constant tension eliminates rest at bottom, smoothest resistance for small flexors.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Monday",
    "focus": "Upper Body",
    "group": "Arms",
    "muscle": "Forearm extensors",
    "exercises": [
      {
        "rank": "good",
        "name": "Dumbbell Reverse Wrist Curl",
        "equipment": "Dumbbells",
        "grip": "Pronated",
        "gripDetail": "Shoulder-width, palms down, forearms on thighs",
        "primary": [
          "Forearm extensors"
        ],
        "secondary": [
          "Brachioradialis"
        ],
        "stabilizers": [
          "Forearm flexors (antagonist)"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "60 sec",
        "technique": "Forearms on thighs, wrists extended beyond knees. Extend wrists up, lower slowly.",
        "formCue": "Use very light weight; strict wrist-only motion.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Direct extensor isolation, balances flexor training.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Barbell Reverse Wrist Curl",
        "equipment": "Barbell",
        "grip": "Pronated (overhand)",
        "gripDetail": "Shoulder-width overhand",
        "primary": [
          "Forearm extensors"
        ],
        "secondary": [
          "Brachioradialis"
        ],
        "stabilizers": [
          "Wrist stabilizers"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "60 sec",
        "technique": "Seated, forearms on thighs, overhand bar. Lift backs of hands up, lower under control.",
        "formCue": "Elbows and forearms fixed; avoid elbow lifting.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Barbell allows even bilateral loading with easy micro-progression.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Cable Reverse Wrist Curl",
        "equipment": "Cable machine + Straight bar",
        "grip": "Pronated",
        "gripDetail": "Shoulder-width overhand, low pulley",
        "primary": [
          "Forearm extensors"
        ],
        "secondary": [
          "Brachioradialis",
          "Brachialis"
        ],
        "stabilizers": [
          "Anterior deltoid (postural)"
        ],
        "sets": "3-3",
        "reps": "12-20",
        "rest": "60 sec",
        "technique": "Sit sideways or facing cable, forearms braced. Extend wrists against cable, control eccentric.",
        "formCue": "Maintain neutral wrist alignment; no ulnar deviation.",
        "difficulty": "Beginner",
        "rationale": "BEST: Cable tension throughout ROM prevents momentum, ideal for small extensors.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Monday",
    "focus": "Upper Body",
    "group": "Shoulders",
    "muscle": "Anterior deltoid",
    "exercises": [
      {
        "rank": "good",
        "name": "Dumbbell Front Raise",
        "equipment": "Dumbbells",
        "grip": "Pronated (overhand)",
        "gripDetail": "Shoulder-width, palms down, alternating or both",
        "primary": [
          "Anterior deltoid"
        ],
        "secondary": [
          "Lateral deltoid",
          "Pectoralis major (clavicular)",
          "Serratus anterior"
        ],
        "stabilizers": [
          "Trapezius (upper)",
          "Erector spinae"
        ],
        "sets": "2-3",
        "reps": "10-15",
        "rest": "60 sec",
        "technique": "Raise dumbbells to shoulder height with slight elbow bend, lower slowly. No swinging.",
        "formCue": "Stop at shoulder height; do not shrug.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Simple isolation, light loads, easy to feel front delt.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Barbell Overhead Press (Standing)",
        "equipment": "Barbell",
        "grip": "Pronated",
        "gripDetail": "Shoulder-width to slightly wider, overhand",
        "primary": [
          "Anterior deltoid"
        ],
        "secondary": [
          "Lateral deltoid",
          "Triceps brachii",
          "Pectoralis major (clavicular)"
        ],
        "stabilizers": [
          "Erector spinae",
          "Glutes",
          "Rotator cuff"
        ],
        "sets": "3-4",
        "reps": "6-10",
        "rest": "120 sec",
        "technique": "Press bar from chin to overhead lockout, head moves slightly back then forward. Brace glutes/core.",
        "formCue": "Ribcage down; do not hyperextend lumbar.",
        "difficulty": "Intermediate",
        "rationale": "BETTER: Compound overload builds overall shoulder mass and strength efficiently.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Seated Dumbbell Shoulder Press",
        "equipment": "Dumbbells + Adjustable bench (85 deg)",
        "grip": "Pronated to Neutral",
        "gripDetail": "Shoulder-width, palms forward, elbows 45 deg",
        "primary": [
          "Anterior deltoid"
        ],
        "secondary": [
          "Lateral deltoid",
          "Triceps brachii",
          "Supraspinatus"
        ],
        "stabilizers": [
          "Trapezius",
          "Erector spinae",
          "Rotator cuff"
        ],
        "sets": "3-4",
        "reps": "6-12",
        "rest": "120 sec",
        "technique": "Sit supported, dumbbells at shoulders. Press to overhead without clanging, lower to ear level.",
        "formCue": "Back flat on bench; avoid excessive arch.",
        "difficulty": "Intermediate",
        "rationale": "BEST: Supported torso allows safe heavy loading, dumbbells permit natural shoulder path and full ROM.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Monday",
    "focus": "Upper Body",
    "group": "Shoulders",
    "muscle": "Lateral deltoid",
    "exercises": [
      {
        "rank": "good",
        "name": "Dumbbell Lateral Raise",
        "equipment": "Dumbbells",
        "grip": "Neutral to Pronated",
        "gripDetail": "Shoulder-width, slight bend, palms down at top",
        "primary": [
          "Lateral deltoid"
        ],
        "secondary": [
          "Anterior deltoid",
          "Posterior deltoid",
          "Supraspinatus"
        ],
        "stabilizers": [
          "Trapezius (upper)",
          "Serratus anterior"
        ],
        "sets": "3-4",
        "reps": "12-20",
        "rest": "60 sec",
        "technique": "Raise arms to sides to shoulder height, lead with elbows, lower over 2 sec.",
        "formCue": "Do not shrug; stop at shoulder height.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Classic isolation, minimal setup.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Single-Arm Cable Lateral Raise",
        "equipment": "Cable machine + Single handle (D-handle)",
        "grip": "Neutral",
        "gripDetail": "Single-arm, opposite hand on rack, low pulley",
        "primary": [
          "Lateral deltoid"
        ],
        "secondary": [
          "Supraspinatus",
          "Anterior deltoid"
        ],
        "stabilizers": [
          "Trapezius",
          "Obliques (anti-lean)"
        ],
        "sets": "3-4",
        "reps": "12-20",
        "rest": "60 sec",
        "technique": "Stand sideways to cable, handle at opposite thigh. Raise to shoulder height, control down across body.",
        "formCue": "Lean slightly away; no torso swing.",
        "difficulty": "Intermediate",
        "rationale": "BETTER: Cable matches strength curve, tension at bottom where dumbbell is unloaded.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Machine Lateral Raise",
        "equipment": "Lateral raise machine",
        "grip": "Neutral (pads)",
        "gripDetail": "Shoulder-width, elbows on pads",
        "primary": [
          "Lateral deltoid"
        ],
        "secondary": [
          "Supraspinatus",
          "Serratus anterior"
        ],
        "stabilizers": [
          "Trapezius",
          "Rotator cuff"
        ],
        "sets": "3-4",
        "reps": "10-20",
        "rest": "75 sec",
        "technique": "Sit, elbows on pads, raise to shoulder height, pause, lower slowly.",
        "formCue": "Seat height so shoulders align with pivot; no shrugging.",
        "difficulty": "Beginner",
        "rationale": "BEST: Fixed path removes cheating, easiest to push near failure safely with drop sets.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Monday",
    "focus": "Upper Body",
    "group": "Chest",
    "muscle": "Pectoralis major",
    "exercises": [
      {
        "rank": "good",
        "name": "Push-Up",
        "equipment": "Bodyweight",
        "grip": "Pronated (hands)",
        "gripDetail": "Shoulder-width to slightly wider, fingers forward",
        "primary": [
          "Pectoralis major"
        ],
        "secondary": [
          "Anterior deltoid",
          "Triceps brachii"
        ],
        "stabilizers": [
          "Serratus anterior",
          "Rectus abdominis",
          "Erector spinae"
        ],
        "sets": "3-4",
        "reps": "8-20",
        "rest": "75 sec",
        "technique": "Plank position, chest to 2-3 cm off floor, elbows ~45 deg, push to lockout without sagging.",
        "formCue": "Body in straight line; protract scapulae at top.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Zero equipment, scalable, teaches scapular control.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Dumbbell Bench Press",
        "equipment": "Dumbbells + Flat bench",
        "grip": "Pronated to Neutral",
        "gripDetail": "Shoulder-width to 1.5x, palms forward",
        "primary": [
          "Pectoralis major"
        ],
        "secondary": [
          "Anterior deltoid",
          "Triceps brachii"
        ],
        "stabilizers": [
          "Rotator cuff",
          "Serratus anterior"
        ],
        "sets": "3-4",
        "reps": "8-12",
        "rest": "120 sec",
        "technique": "Lie on bench, dumbbells at chest. Press to overhead, lower to chest stretch with elbows 45-75 deg.",
        "formCue": "Feet planted; do not bounce at bottom.",
        "difficulty": "Intermediate",
        "rationale": "BETTER: Greater ROM and stretch than barbell, each arm independent, shoulder-friendly.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Barbell Bench Press",
        "equipment": "Barbell + Flat bench + Rack",
        "grip": "Pronated",
        "gripDetail": "Medium-wide (1.5x shoulder), overhand",
        "primary": [
          "Pectoralis major"
        ],
        "secondary": [
          "Anterior deltoid",
          "Triceps brachii"
        ],
        "stabilizers": [
          "Latissimus dorsi",
          "Rotator cuff",
          "Serratus anterior"
        ],
        "sets": "3-5",
        "reps": "5-10",
        "rest": "150 sec",
        "technique": "Unrack, lower bar to mid-chest with control, touch lightly, drive to lockout with leg drive.",
        "formCue": "Retract scapulae; wrists stacked over elbows.",
        "difficulty": "Intermediate",
        "rationale": "BEST: Highest absolute loading and progressive overload for chest, proven mass and strength builder.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Monday",
    "focus": "Upper Body",
    "group": "Upper Back",
    "muscle": "Trapezius",
    "exercises": [
      {
        "rank": "good",
        "name": "Dumbbell Shrug",
        "equipment": "Dumbbells",
        "grip": "Neutral",
        "gripDetail": "Shoulder-width, palms in",
        "primary": [
          "Trapezius (upper)"
        ],
        "secondary": [
          "Levator scapulae",
          "Rhomboids"
        ],
        "stabilizers": [
          "Erector spinae",
          "Forearm flexors (grip)"
        ],
        "sets": "3-4",
        "reps": "10-20",
        "rest": "75 sec",
        "technique": "Stand tall, dumbbells at sides. Elevate shoulders straight up, pause 1 sec, lower fully.",
        "formCue": "No rolling shoulders; head neutral.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Simple upper-trap mass builder, minimal technique demand.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Smith Machine Shrug",
        "equipment": "Smith machine",
        "grip": "Pronated (overhand)",
        "gripDetail": "Shoulder-width overhand",
        "primary": [
          "Trapezius (upper, middle)"
        ],
        "secondary": [
          "Levator scapulae",
          "Rhomboids"
        ],
        "stabilizers": [
          "Erector spinae",
          "Forearm flexors"
        ],
        "sets": "3-4",
        "reps": "8-15",
        "rest": "90 sec",
        "technique": "Stand in Smith, bar at thighs. Shrug straight up, squeeze, lower under control.",
        "formCue": "Do not bend elbows; keep bar close.",
        "difficulty": "Intermediate",
        "rationale": "BETTER: Fixed bar allows heavier loading without balance demand.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Barbell Shrug (Heavy)",
        "equipment": "Barbell",
        "grip": "Pronated (overhand, mixed optional)",
        "gripDetail": "Shoulder-width to slightly wider",
        "primary": [
          "Trapezius (upper)"
        ],
        "secondary": [
          "Levator scapulae",
          "Rhomboids",
          "Erector spinae (isometric)"
        ],
        "stabilizers": [
          "Glutes",
          "Forearm flexors",
          "Rotator cuff"
        ],
        "sets": "4-4",
        "reps": "8-15",
        "rest": "120 sec",
        "technique": "Hold bar at thighs, brace. Shrug to ears, 1-sec hold, lower to full stretch over 2 sec.",
        "formCue": "Straps if grip fails; no bouncing with knees.",
        "difficulty": "Advanced",
        "rationale": "BEST: Maximum loading potential for trap hypertrophy with full stretch and peak contraction.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Tuesday",
    "focus": "Lower Body + Core",
    "group": "Lower Body",
    "muscle": "Quadriceps",
    "exercises": [
      {
        "rank": "good",
        "name": "Goblet Squat",
        "equipment": "Dumbbell",
        "grip": "Neutral (goblet)",
        "gripDetail": "Close, hands cupping DB at chest",
        "primary": [
          "Quadriceps"
        ],
        "secondary": [
          "Glutes",
          "Adductors"
        ],
        "stabilizers": [
          "Erector spinae",
          "Rectus abdominis",
          "Calves"
        ],
        "sets": "3-4",
        "reps": "8-15",
        "rest": "90 sec",
        "technique": "Hold DB at chest, squat hips down keeping chest up, knees track over toes, drive through mid-foot.",
        "formCue": "Elbows inside knees at bottom; heels flat.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Teaches upright squat pattern with minimal load and low injury risk.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Leg Press",
        "equipment": "Leg press machine",
        "grip": "Neutral (feet)",
        "gripDetail": "Shoulder-width, feet mid-platform, toes slightly out",
        "primary": [
          "Quadriceps"
        ],
        "secondary": [
          "Glutes",
          "Hamstrings (slight)",
          "Calves"
        ],
        "stabilizers": [
          "Erector spinae (supported)",
          "Transverse abdominis"
        ],
        "sets": "3-4",
        "reps": "8-15",
        "rest": "120 sec",
        "technique": "Sit with back flat, lower platform to 90-deg knees, press without locking knees hard.",
        "formCue": "Do not let lower back round off pad; knees aligned.",
        "difficulty": "Beginner",
        "rationale": "BETTER: High stability allows heavy quad loading without spinal load or balance limit.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Barbell Back Squat",
        "equipment": "Barbell + Squat rack",
        "grip": "Pronated (bar on back)",
        "gripDetail": "Shoulder-width hands, medium-wide stance",
        "primary": [
          "Quadriceps"
        ],
        "secondary": [
          "Glutes",
          "Adductors",
          "Erector spinae"
        ],
        "stabilizers": [
          "Rectus abdominis",
          "Transverse abdominis",
          "Calves"
        ],
        "sets": "4-5",
        "reps": "5-10",
        "rest": "150 sec",
        "technique": "Bar on upper back, brace, squat to parallel or below, knees track toes, drive up.",
        "formCue": "Chest up, knees out; maintain neutral spine.",
        "difficulty": "Advanced",
        "rationale": "BEST: King of quad mass and strength, maximal systemic load and progression.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Tuesday",
    "focus": "Lower Body + Core",
    "group": "Lower Body",
    "muscle": "Rectus femoris",
    "exercises": [
      {
        "rank": "good",
        "name": "Walking Lunge (Bodyweight/Dumbbell)",
        "equipment": "Bodyweight or Dumbbells",
        "grip": "Neutral",
        "gripDetail": "Hip-width stance, DBs at sides",
        "primary": [
          "Rectus femoris",
          "Quadriceps (vastii)"
        ],
        "secondary": [
          "Glutes",
          "Hamstrings"
        ],
        "stabilizers": [
          "Erector spinae",
          "Obliques",
          "Calves"
        ],
        "sets": "3-3",
        "reps": "10-14 steps/leg",
        "rest": "75 sec",
        "technique": "Long stride, front knee 90 deg, torso upright, push through front heel. Alternate legs.",
        "formCue": "Front knee over ankle; do not let torso lean forward.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Trains rectus femoris as knee extensor + hip flexor stabilizer through functional stride. Explicitly hits rectus femoris within quad group.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Bulgarian Split Squat",
        "equipment": "Dumbbells + Bench",
        "grip": "Neutral",
        "gripDetail": "Hip-width, rear foot on bench",
        "primary": [
          "Rectus femoris",
          "Quadriceps"
        ],
        "secondary": [
          "Glutes",
          "Adductors"
        ],
        "stabilizers": [
          "Erector spinae",
          "Transverse abdominis"
        ],
        "sets": "3-4",
        "reps": "8-12 /leg",
        "rest": "90 sec",
        "technique": "Front foot forward, lower until front thigh parallel, rear knee toward floor. Drive up.",
        "formCue": "Upright torso emphasizes rectus femoris length at hip.",
        "difficulty": "Intermediate",
        "rationale": "BETTER: Unilateral overload with deep knee flexion and hip extension stretch, strong rectus femoris stimulus.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Seated Leg Extension (Reclined Slightly)",
        "equipment": "Leg extension machine",
        "grip": "Neutral (ankle pad)",
        "gripDetail": "Hip-width, ankles behind pad, recline 10-15 deg",
        "primary": [
          "Rectus femoris"
        ],
        "secondary": [
          "Quadriceps (vastus lateralis/medialis)"
        ],
        "stabilizers": [
          "Iliopsoas (hip stabilizer)",
          "Rectus abdominis"
        ],
        "sets": "3-4",
        "reps": "10-15",
        "rest": "75 sec",
        "technique": "Sit slightly reclined to lengthen rectus femoris across hip. Extend knees to lockout, squeeze 1 sec, lower slowly.",
        "formCue": "Recline increases rectus femoris stretch; do not use momentum.",
        "difficulty": "Beginner",
        "rationale": "BEST: Only open-chain knee extension isolates rectus femoris directly; reclined torso maximizes its length-tension. Explicit rectus femoris isolation.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Tuesday",
    "focus": "Lower Body + Core",
    "group": "Lower Body",
    "muscle": "Adductors",
    "exercises": [
      {
        "rank": "good",
        "name": "Sumo Dumbbell Squat",
        "equipment": "Dumbbell",
        "grip": "Neutral (goblet)",
        "gripDetail": "Wide stance (1.5-2x shoulder), toes out 30-45 deg",
        "primary": [
          "Adductors"
        ],
        "secondary": [
          "Quadriceps",
          "Glutes"
        ],
        "stabilizers": [
          "Erector spinae",
          "Transverse abdominis"
        ],
        "sets": "3-3",
        "reps": "10-15",
        "rest": "75 sec",
        "technique": "Wide stance holding DB between legs. Squat keeping knees over toes, squeeze inner thighs to stand.",
        "formCue": "Knees track toes; chest up.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Wide stance increases adductor demand with no machine needed.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Standing Cable Hip Adduction",
        "equipment": "Cable machine + Ankle strap",
        "grip": "Neutral (ankle)",
        "gripDetail": "Single-leg, strap on working ankle, low pulley",
        "primary": [
          "Adductors"
        ],
        "secondary": [
          "Glutes (medius stabilizer)",
          "Quadriceps"
        ],
        "stabilizers": [
          "Obliques",
          "Erector spinae"
        ],
        "sets": "2-3",
        "reps": "12-20 /leg",
        "rest": "60 sec",
        "technique": "Stand sideways to cable, working leg out to side. Pull leg across body past midline, control return.",
        "formCue": "Support rail for balance; slow controlled arc.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Direct single-leg adduction through full ROM with constant tension.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Seated Hip Adduction Machine",
        "equipment": "Hip adduction machine",
        "grip": "Neutral (knee pads)",
        "gripDetail": "Wide start, knees on pads",
        "primary": [
          "Adductors"
        ],
        "secondary": [
          "Quadriceps (slight)"
        ],
        "stabilizers": [
          "Erector spinae",
          "Transverse abdominis"
        ],
        "sets": "3-4",
        "reps": "10-20",
        "rest": "75 sec",
        "technique": "Sit, squeeze pads together to midline, 1-sec hold, return to stretch under control.",
        "formCue": "Back flat; do not tilt pelvis to cheat.",
        "difficulty": "Beginner",
        "rationale": "BEST: Most stable isolation, easiest progressive overload for adductors.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Tuesday",
    "focus": "Lower Body + Core",
    "group": "Lower Body",
    "muscle": "Calves",
    "exercises": [
      {
        "rank": "good",
        "name": "Standing Bodyweight Calf Raise",
        "equipment": "Bodyweight (step/block)",
        "grip": "Neutral (feet)",
        "gripDetail": "Hip-width, balls of feet on edge",
        "primary": [
          "Calves (gastrocnemius, soleus)"
        ],
        "secondary": [
          "Tibialis anterior (antagonist stabilizer)"
        ],
        "stabilizers": [
          "Quadriceps",
          "Glutes"
        ],
        "sets": "3-3",
        "reps": "15-25",
        "rest": "45 sec",
        "technique": "Rise onto toes high, pause 1 sec, lower heel below step for stretch.",
        "formCue": "Full ROM; no bouncing.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Zero equipment, high-rep base builder.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Dumbbell Standing Calf Raise",
        "equipment": "Dumbbells + Step",
        "grip": "Neutral",
        "gripDetail": "Hip-width, DBs at sides",
        "primary": [
          "Calves"
        ],
        "secondary": [
          "Tibialis anterior"
        ],
        "stabilizers": [
          "Forearm flexors (grip)",
          "Erector spinae"
        ],
        "sets": "3-4",
        "reps": "12-20",
        "rest": "60 sec",
        "technique": "Single or double leg on step with DBs. Full stretch to peak contraction.",
        "formCue": "Knees straight (gastroc emphasis); control eccentric.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Added load enables progressive overload beyond bodyweight.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Standing Calf Raise Machine",
        "equipment": "Calf raise machine",
        "grip": "Neutral",
        "gripDetail": "Shoulder-width, shoulders under pads",
        "primary": [
          "Calves (gastrocnemius emphasis)"
        ],
        "secondary": [
          "Soleus"
        ],
        "stabilizers": [
          "Erector spinae",
          "Transverse abdominis"
        ],
        "sets": "4-4",
        "reps": "10-20",
        "rest": "75 sec",
        "technique": "Shoulders under pads, balls of feet on platform. Lower deep, drive to full plantarflexion, pause.",
        "formCue": "Knee locked but soft; pause at top and bottom.",
        "difficulty": "Intermediate",
        "rationale": "BEST: Heaviest stable loading, full stretch, easy to program heavy + high-rep.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Tuesday",
    "focus": "Lower Body + Core",
    "group": "Lower Body",
    "muscle": "Tibialis anterior",
    "exercises": [
      {
        "rank": "good",
        "name": "Wall Toe Raise",
        "equipment": "Bodyweight (wall)",
        "grip": "N/A - Bodyweight",
        "gripDetail": "Hip-width, back against wall, feet forward",
        "primary": [
          "Tibialis anterior"
        ],
        "secondary": [
          "Calves (antagonist)"
        ],
        "stabilizers": [
          "Quadriceps"
        ],
        "sets": "2-3",
        "reps": "15-25",
        "rest": "45 sec",
        "technique": "Back to wall, feet forward. Lift toes toward shins, heels stay down, lower slowly.",
        "formCue": "High reps, burn is normal; heels planted.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Zero equipment shin builder, ideal for beginners and shin-splint prevention. Functional.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Resistance Band Dorsiflexion",
        "equipment": "Resistance bands + Bench",
        "grip": "Neutral (band over foot)",
        "gripDetail": "Seated, band anchored, foot through loop",
        "primary": [
          "Tibialis anterior"
        ],
        "secondary": [
          "Forearm extensors (none - isolated)"
        ],
        "stabilizers": [
          "Quadriceps (stabilizer)"
        ],
        "sets": "2-3",
        "reps": "15-25",
        "rest": "45 sec",
        "technique": "Sit with leg extended, band pulling foot down. Pull toes toward shin against band, control return.",
        "formCue": "Anchor band securely; full dorsiflexion.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Adjustable band tension allows progression beyond bodyweight.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Seated Dumbbell Tibialis Raise",
        "equipment": "Dumbbell + Bench/block",
        "grip": "Neutral",
        "gripDetail": "Seated, DB across toes, heels on block",
        "primary": [
          "Tibialis anterior"
        ],
        "secondary": [
          "Calves (antagonist stabilizer)"
        ],
        "stabilizers": [
          "Quadriceps"
        ],
        "sets": "3-3",
        "reps": "12-20",
        "rest": "60 sec",
        "technique": "Sit, heels on block, DB resting on toes. Pull toes up toward shin, pause, lower.",
        "formCue": "Light DB; secure it with hands if needed at start.",
        "difficulty": "Intermediate",
        "rationale": "BEST: Direct loaded dorsiflexion, easiest to progressively overload long-term.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Tuesday",
    "focus": "Lower Body + Core",
    "group": "Lower Body",
    "muscle": "Tensor fasciae latae",
    "exercises": [
      {
        "rank": "good",
        "name": "Banded Lateral Walk",
        "equipment": "Resistance band (mini-band)",
        "grip": "Neutral",
        "gripDetail": "Hip-width, band above knees",
        "primary": [
          "Tensor fasciae latae"
        ],
        "secondary": [
          "Glutes (medius/minimus)",
          "Quadriceps"
        ],
        "stabilizers": [
          "Obliques",
          "Erector spinae"
        ],
        "sets": "2-3",
        "reps": "12-20 steps/dir",
        "rest": "45 sec",
        "technique": "Quarter-squat, steps sideways keeping band tension, toes forward. Control return.",
        "formCue": "Knees out; do not let band pull knees in.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Functional TFL + glute medius activation, ideal warm-up and prehab. Functional.",
        "mode": "Functional"
      },
      {
        "rank": "better",
        "name": "Standing Cable Hip Abduction",
        "equipment": "Cable machine + Ankle strap",
        "grip": "Neutral (ankle)",
        "gripDetail": "Single-leg, strap, low pulley, support rail",
        "primary": [
          "Tensor fasciae latae"
        ],
        "secondary": [
          "Glutes (medius)",
          "Quadriceps"
        ],
        "stabilizers": [
          "Obliques",
          "Erector spinae"
        ],
        "sets": "2-3",
        "reps": "12-20 /leg",
        "rest": "60 sec",
        "technique": "Stand sideways, working leg near pulley. Abduct leg to 30-40 deg, control return.",
        "formCue": "Torso tall; no leaning away.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Constant tension isolates TFL/abductors through clean ROM.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Seated Hip Abduction Machine (Lean Forward)",
        "equipment": "Hip abduction machine",
        "grip": "Neutral (knee pads)",
        "gripDetail": "Hip-width start, slight forward lean",
        "primary": [
          "Tensor fasciae latae"
        ],
        "secondary": [
          "Glutes (medius/minimus)"
        ],
        "stabilizers": [
          "Erector spinae",
          "Transverse abdominis"
        ],
        "sets": "3-3",
        "reps": "12-20",
        "rest": "60 sec",
        "technique": "Sit leaning slightly forward (more TFL). Open knees wide, pause, return slowly.",
        "formCue": "Light-moderate load; TFL is small - do not go excessively heavy.",
        "difficulty": "Beginner",
        "rationale": "BEST: Stable machine allows focused TFL overload with forward lean bias. Small muscle - moderate load.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Tuesday",
    "focus": "Lower Body + Core",
    "group": "Lower Body",
    "muscle": "Iliopsoas",
    "exercises": [
      {
        "rank": "good",
        "name": "Standing Knee Raise",
        "equipment": "Bodyweight",
        "grip": "Neutral",
        "gripDetail": "Hip-width, hands on hips or rail",
        "primary": [
          "Iliopsoas"
        ],
        "secondary": [
          "Quadriceps (rectus femoris)",
          "Abdominals"
        ],
        "stabilizers": [
          "Glutes (stance leg)",
          "Erector spinae"
        ],
        "sets": "2-3",
        "reps": "12-20 /leg",
        "rest": "45 sec",
        "technique": "Stand tall, lift knee to hip height, pause, lower slowly. No trunk lean.",
        "formCue": "Pelvis neutral; avoid rounding lower back.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Bodyweight hip-flexor activation, safe entry point. Functional.",
        "mode": "Functional"
      },
      {
        "rank": "better",
        "name": "Hanging Knee Raise",
        "equipment": "Pull-up bar / Captain's chair",
        "grip": "Pronated (bar) or Neutral (arm pads)",
        "gripDetail": "Shoulder-width overhand",
        "primary": [
          "Iliopsoas"
        ],
        "secondary": [
          "Rectus abdominis",
          "Quadriceps"
        ],
        "stabilizers": [
          "Latissimus dorsi",
          "Grip flexors"
        ],
        "sets": "3-3",
        "reps": "10-15",
        "rest": "75 sec",
        "technique": "Hang, lift knees to 90 deg+ with posterior pelvic tilt, lower without swinging.",
        "formCue": "No swinging; initiate with pelvis tuck.",
        "difficulty": "Intermediate",
        "rationale": "BETTER: Adds anti-swing core demand while strengthening psoas through larger ROM.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Standing Cable Hip Flexion (Ankle Strap)",
        "equipment": "Cable machine + Ankle strap",
        "grip": "Neutral (ankle)",
        "gripDetail": "Single-leg, strap, low pulley behind",
        "primary": [
          "Iliopsoas"
        ],
        "secondary": [
          "Quadriceps (rectus femoris)",
          "Abdominals"
        ],
        "stabilizers": [
          "Glutes",
          "Erector spinae"
        ],
        "sets": "3-3",
        "reps": "10-15 /leg",
        "rest": "60 sec",
        "technique": "Face away from cable, strap on ankle. Drive knee up to 90 deg against cable, control down.",
        "formCue": "Light-moderate; brace core to prevent back arch.",
        "difficulty": "Intermediate",
        "rationale": "BEST: Only directly loadable hip-flexion with progressive cable resistance.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Tuesday",
    "focus": "Lower Body + Core",
    "group": "Spine / Core",
    "muscle": "Rectus abdominis",
    "exercises": [
      {
        "rank": "good",
        "name": "Crunch",
        "equipment": "Bodyweight (mat)",
        "grip": "N/A - Bodyweight",
        "gripDetail": "Shoulder-width, hands across chest",
        "primary": [
          "Rectus abdominis"
        ],
        "secondary": [
          "External obliques"
        ],
        "stabilizers": [
          "Hip flexors",
          "Neck stabilizers"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "45 sec",
        "technique": "Lie knees bent, curl ribcage toward pelvis lifting shoulder blades, lower slowly.",
        "formCue": "Chin off chest; exhale on crunch.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Basic trunk flexion, minimal spinal load when done short-range.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Hanging Knee Raise (Strict)",
        "equipment": "Pull-up bar",
        "grip": "Pronated",
        "gripDetail": "Shoulder-width overhand",
        "primary": [
          "Rectus abdominis (lower)"
        ],
        "secondary": [
          "Iliopsoas",
          "External obliques"
        ],
        "stabilizers": [
          "Latissimus dorsi",
          "Grip"
        ],
        "sets": "3-3",
        "reps": "10-15",
        "rest": "75 sec",
        "technique": "Hang, posteriorly tilt pelvis then lift knees. Lower with control, no swing.",
        "formCue": "Pelvic tilt first - do not just lift legs with hip flexors.",
        "difficulty": "Intermediate",
        "rationale": "BETTER: Trains lower abs with pelvic tilt plus grip/hang benefits.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Kneeling Cable Crunch",
        "equipment": "Cable machine + Rope",
        "grip": "Neutral (rope behind head)",
        "gripDetail": "Kneeling, rope behind head, hips fixed",
        "primary": [
          "Rectus abdominis"
        ],
        "secondary": [
          "External obliques"
        ],
        "stabilizers": [
          "Hip flexors",
          "Latissimus dorsi"
        ],
        "sets": "3-4",
        "reps": "10-20",
        "rest": "60 sec",
        "technique": "Kneel facing cable, rope behind head. Flex spine bringing ribs to pelvis, hips fixed, squeeze.",
        "formCue": "Hips stay fixed; move thoracic spine, not hips.",
        "difficulty": "Intermediate",
        "rationale": "BEST: Only heavily loadable ab flexion with full stretch and progressive overload.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Tuesday",
    "focus": "Lower Body + Core",
    "group": "Spine / Core",
    "muscle": "External obliques",
    "exercises": [
      {
        "rank": "good",
        "name": "Russian Twist (Bodyweight)",
        "equipment": "Bodyweight (mat)",
        "grip": "Neutral (hands together)",
        "gripDetail": "Seated, knees bent, feet grounded or lifted",
        "primary": [
          "External obliques"
        ],
        "secondary": [
          "Internal obliques",
          "Rectus abdominis"
        ],
        "stabilizers": [
          "Hip flexors",
          "Erector spinae"
        ],
        "sets": "2-3",
        "reps": "12-20 total",
        "rest": "45 sec",
        "technique": "Sit leaning back 45 deg, rotate torso side to side, hands touch floor each side.",
        "formCue": "Move shoulders, not just arms; spine long.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Accessible rotation, bodyweight scalable.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Dumbbell Side Bend (Standing Oblique Focus)",
        "equipment": "Dumbbell",
        "grip": "Neutral",
        "gripDetail": "Shoulder-width, single DB at side",
        "primary": [
          "External obliques"
        ],
        "secondary": [
          "Internal obliques",
          "Quadratus lumborum"
        ],
        "stabilizers": [
          "Erector spinae",
          "Trapezius"
        ],
        "sets": "2-3",
        "reps": "12-20 /side",
        "rest": "45 sec",
        "technique": "Stand with DB one side, bend sideways toward DB then return past neutral with oblique squeeze.",
        "formCue": "Small ROM; do not lean forward/back.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Adds lateral-flexion load directly to obliques.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Cable Woodchopper (High-to-Low)",
        "equipment": "Cable machine + D-handle",
        "grip": "Pronated to Neutral",
        "gripDetail": "Athletic stance, high pulley, hands together",
        "primary": [
          "External obliques"
        ],
        "secondary": [
          "Internal obliques",
          "Rectus abdominis",
          "Serratus anterior"
        ],
        "stabilizers": [
          "Glutes",
          "Transverse abdominis"
        ],
        "sets": "3-3",
        "reps": "10-15 /side",
        "rest": "60 sec",
        "technique": "Pull handle diagonally from high to opposite hip rotating torso, hips stable, control return.",
        "formCue": "Rotate through torso; arms stay relatively straight.",
        "difficulty": "Intermediate",
        "rationale": "BEST: Diagonal loaded rotation best matches oblique fiber direction with constant tension.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Thursday",
    "focus": "Back + Shoulders + Arms",
    "group": "Shoulders",
    "muscle": "Posterior deltoid",
    "exercises": [
      {
        "rank": "good",
        "name": "Bent-Over Dumbbell Reverse Fly",
        "equipment": "Dumbbells",
        "grip": "Neutral to Pronated",
        "gripDetail": "Shoulder-width, palms facing each other to down",
        "primary": [
          "Posterior deltoid"
        ],
        "secondary": [
          "Rhomboids",
          "Trapezius (middle)",
          "Infraspinatus"
        ],
        "stabilizers": [
          "Erector spinae",
          "Hamstrings (hinge)"
        ],
        "sets": "3-3",
        "reps": "12-20",
        "rest": "60 sec",
        "technique": "Hinge 45 deg, arms hang. Raise arms to sides to shoulder height, squeeze shoulder blades, lower.",
        "formCue": "Slight elbow bend; no shrugging.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Minimal equipment rear-delt isolation.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Face Pull (Rope)",
        "equipment": "Cable machine + Rope",
        "grip": "Neutral (rope, thumbs up)",
        "gripDetail": "Shoulder-width, rope at eye level",
        "primary": [
          "Posterior deltoid"
        ],
        "secondary": [
          "Rhomboids",
          "Trapezius (middle/lower)",
          "Infraspinatus",
          "Teres minor"
        ],
        "stabilizers": [
          "Erector spinae",
          "Rotator cuff"
        ],
        "sets": "3-4",
        "reps": "12-20",
        "rest": "60 sec",
        "technique": "Pull rope to forehead, elbows high, externally rotate so knuckles face ceiling, control return.",
        "formCue": "Elbows at shoulder height; do not pull to chin.",
        "difficulty": "Intermediate",
        "rationale": "BETTER: Combines horizontal abduction + external rotation, healthier for shoulders.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Reverse Pec Deck",
        "equipment": "Reverse pec deck machine",
        "grip": "Neutral",
        "gripDetail": "Shoulder-width, hands on handles, chest on pad",
        "primary": [
          "Posterior deltoid"
        ],
        "secondary": [
          "Rhomboids",
          "Trapezius (middle)",
          "Infraspinatus"
        ],
        "stabilizers": [
          "Erector spinae",
          "Rotator cuff"
        ],
        "sets": "3-4",
        "reps": "12-20",
        "rest": "60 sec",
        "technique": "Chest on pad, arms straight-ish. Open arms to sides, squeeze, return without letting stack slam.",
        "formCue": "Seat so handles at shoulder height.",
        "difficulty": "Beginner",
        "rationale": "BEST: Fixed path removes momentum, easiest to isolate rear delts to failure safely.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Thursday",
    "focus": "Back + Shoulders + Arms",
    "group": "Shoulders",
    "muscle": "Supraspinatus",
    "exercises": [
      {
        "rank": "good",
        "name": "Side-Lying Dumbbell Abduction (Light)",
        "equipment": "Light dumbbell + Mat",
        "grip": "Neutral",
        "gripDetail": "Single-arm, light DB at side",
        "primary": [
          "Supraspinatus"
        ],
        "secondary": [
          "Lateral deltoid (slight)",
          "Serratus anterior"
        ],
        "stabilizers": [
          "Rotator cuff (co-contraction)"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "45 sec",
        "technique": "Lie on side, bottom arm under head, top arm holds light DB. Lift arm 0-60 deg in scapular plane, lower slowly.",
        "formCue": "Very light (1-3 kg); pain-free ROM only.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Gentle isolated initiation of abduction, ideal for cuff health. Low-load, controlled.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Low-Pulley Cable Scaption",
        "equipment": "Cable machine + Single handle",
        "grip": "Neutral",
        "gripDetail": "Single-arm, thumb up, low pulley",
        "primary": [
          "Supraspinatus"
        ],
        "secondary": [
          "Anterior deltoid",
          "Serratus anterior"
        ],
        "stabilizers": [
          "Rotator cuff",
          "Trapezius (lower)"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "45 sec",
        "technique": "Stand sideways, handle at side. Lift arm 30 deg forward of frontal plane (scapular plane) to 80 deg, lower.",
        "formCue": "Thumb up; do not shrug or go above shoulder initially.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Cable tension matches cuff strength curve, smooth and joint-friendly.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Full-Can Dumbbell Raise (Light)",
        "equipment": "Light dumbbells",
        "grip": "Neutral (thumbs up)",
        "gripDetail": "Shoulder-width, 30 deg forward (scapular plane)",
        "primary": [
          "Supraspinatus"
        ],
        "secondary": [
          "Anterior deltoid",
          "Serratus anterior"
        ],
        "stabilizers": [
          "Trapezius (lower)",
          "Rotator cuff"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "45 sec",
        "technique": "Hold light DBs thumbs up, raise in scapular plane to ~90 deg, pause, lower over 2-3 sec.",
        "formCue": "Light load, controlled; stop if pinching pain.",
        "difficulty": "Beginner",
        "rationale": "BEST: Full-can position maximizes supraspinatus with minimal impingement risk vs empty-can. Low-load stability.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Thursday",
    "focus": "Back + Shoulders + Arms",
    "group": "Shoulders",
    "muscle": "Infraspinatus",
    "exercises": [
      {
        "rank": "good",
        "name": "Side-Lying External Rotation (Light DB)",
        "equipment": "Light dumbbell + Mat",
        "grip": "Neutral",
        "gripDetail": "Elbow at side (90 deg), light DB",
        "primary": [
          "Infraspinatus"
        ],
        "secondary": [
          "Teres minor",
          "Posterior deltoid"
        ],
        "stabilizers": [
          "Rotator cuff (co-contraction)"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "45 sec",
        "technique": "Lie on side, elbow tucked with towel roll. Rotate forearm up from belly to vertical, lower slowly.",
        "formCue": "Elbow pinned; towel prevents cheating.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Gold-standard isolated external rotation, minimal equipment. Low-load.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Standing Cable External Rotation (Elbow at Side)",
        "equipment": "Cable machine + Single handle",
        "grip": "Neutral",
        "gripDetail": "Elbow 90 deg tucked, pulley at elbow height",
        "primary": [
          "Infraspinatus"
        ],
        "secondary": [
          "Teres minor"
        ],
        "stabilizers": [
          "Posterior deltoid (stabilizer)",
          "Rotator cuff"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "45 sec",
        "technique": "Stand sideways, elbow tucked. Rotate forearm outward 90 deg, control return.",
        "formCue": "No shoulder hiking; slow tempo.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Constant cable tension through rotation, easy micro-loading.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Cable External Rotation (Arm Supported on Bench)",
        "equipment": "Cable + Bench + Single handle",
        "grip": "Neutral",
        "gripDetail": "Elbow supported at 90 deg on bench",
        "primary": [
          "Infraspinatus"
        ],
        "secondary": [
          "Teres minor",
          "Posterior deltoid"
        ],
        "stabilizers": [
          "Serratus anterior"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "45 sec",
        "technique": "Kneel with elbow on bench at shoulder height. Rotate forearm up, pause, lower.",
        "formCue": "Supported elbow removes cheating for strict cuff isolation.",
        "difficulty": "Beginner",
        "rationale": "BEST: Supported position eliminates torso compensation, strictest infraspinatus stimulus. Low-load.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Thursday",
    "focus": "Back + Shoulders + Arms",
    "group": "Shoulders",
    "muscle": "Teres minor",
    "exercises": [
      {
        "rank": "good",
        "name": "Banded External Rotation",
        "equipment": "Resistance band",
        "grip": "Neutral",
        "gripDetail": "Elbows at sides, band at chest height",
        "primary": [
          "Teres minor"
        ],
        "secondary": [
          "Infraspinatus",
          "Posterior deltoid"
        ],
        "stabilizers": [
          "Rotator cuff"
        ],
        "sets": "2-3",
        "reps": "15-25",
        "rest": "30 sec",
        "technique": "Hold band, elbows tucked. Pull hands apart rotating outward, pause, return.",
        "formCue": "Wrists straight; elbows pinned.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Light functional cuff activation, great warm-up. Indirect/Stabilization + Direct light.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Dumbbell Side-Lying ER (Neutral)",
        "equipment": "Light dumbbell + Mat",
        "grip": "Neutral",
        "gripDetail": "Elbow tucked 90 deg, neutral wrist",
        "primary": [
          "Teres minor"
        ],
        "secondary": [
          "Infraspinatus"
        ],
        "stabilizers": [
          "Posterior deltoid"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "45 sec",
        "technique": "Same as infraspinatus side-lying but focus on 0-45 deg outer range where teres minor dominates, slow tempo.",
        "formCue": "Light DB, strict form.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Slight angle variation biases teres minor outer-range function. Low-load.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Cable ER at 30 deg Abduction",
        "equipment": "Cable machine + Single handle",
        "grip": "Neutral",
        "gripDetail": "Shoulder 30 deg abducted, elbow 90 deg",
        "primary": [
          "Teres minor"
        ],
        "secondary": [
          "Infraspinatus",
          "Posterior deltoid"
        ],
        "stabilizers": [
          "Serratus anterior",
          "Rotator cuff"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "45 sec",
        "technique": "Stand, upper arm slightly away from body on towel. Externally rotate, pause 1 sec, lower.",
        "formCue": "Do not shrug; keep scapula set down and back.",
        "difficulty": "Beginner",
        "rationale": "BEST: 30-deg abduction aligns teres minor line of pull for most direct stimulus. Controlled low-load.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Thursday",
    "focus": "Back + Shoulders + Arms",
    "group": "Shoulders",
    "muscle": "Subscapularis",
    "exercises": [
      {
        "rank": "good",
        "name": "Banded Internal Rotation",
        "equipment": "Resistance band (door anchor)",
        "grip": "Neutral",
        "gripDetail": "Elbow at side 90 deg, band at elbow height",
        "primary": [
          "Subscapularis"
        ],
        "secondary": [
          "Pectoralis major",
          "Latissimus dorsi",
          "Teres major"
        ],
        "stabilizers": [
          "Rotator cuff"
        ],
        "sets": "2-3",
        "reps": "15-25",
        "rest": "30 sec",
        "technique": "Elbow tucked, rotate forearm across belly against band, control return.",
        "formCue": "Elbow pinned; no shoulder shrug.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Safe entry internal rotation for front-of-shoulder cuff. Low-load. Functional.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Side-Lying Internal Rotation (Light DB)",
        "equipment": "Light dumbbell + Mat",
        "grip": "Neutral",
        "gripDetail": "Bottom arm, elbow 90 deg",
        "primary": [
          "Subscapularis"
        ],
        "secondary": [
          "Pectoralis major",
          "Anterior deltoid"
        ],
        "stabilizers": [
          "Rotator cuff"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "45 sec",
        "technique": "Lie on working side? Actually lie on back? Use side-lying bottom-arm IR: rotate DB from floor toward belly.",
        "formCue": "Very light; pain-free.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Gravity-loaded IR isolates subscapularis through internal rotation.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Standing Cable Internal Rotation",
        "equipment": "Cable machine + Single handle",
        "grip": "Neutral",
        "gripDetail": "Elbow tucked, pulley at elbow height",
        "primary": [
          "Subscapularis"
        ],
        "secondary": [
          "Pectoralis major",
          "Latissimus dorsi"
        ],
        "stabilizers": [
          "Rotator cuff",
          "Serratus anterior"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "45 sec",
        "technique": "Stand sideways, handle in working hand. Pull across torso keeping elbow tucked, squeeze 1 sec.",
        "formCue": "Torso still; do not rotate trunk to cheat.",
        "difficulty": "Beginner",
        "rationale": "BEST: Cable gives even resistance and easy progression for often-neglected subscapularis.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Thursday",
    "focus": "Back + Shoulders + Arms",
    "group": "Upper Back",
    "muscle": "Latissimus dorsi",
    "exercises": [
      {
        "rank": "good",
        "name": "Straight-Arm Cable Pulldown",
        "equipment": "Cable machine + Straight bar",
        "grip": "Pronated",
        "gripDetail": "Shoulder-width overhand, arms straight",
        "primary": [
          "Latissimus dorsi"
        ],
        "secondary": [
          "Teres major",
          "Posterior deltoid",
          "Triceps (long head)"
        ],
        "stabilizers": [
          "Rectus abdominis",
          "Erector spinae"
        ],
        "sets": "3-3",
        "reps": "10-15",
        "rest": "75 sec",
        "technique": "Hinge slightly, arms straight. Pull bar from overhead to thighs by depressing shoulders, control up.",
        "formCue": "Arms straight but elbows soft; initiate with lats not arms.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Isolates lats without biceps dominance, great mind-muscle connection.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Lat Pulldown (Medium Pronated)",
        "equipment": "Lat pulldown machine",
        "grip": "Pronated",
        "gripDetail": "Medium-wide (1.5x shoulder) overhand",
        "primary": [
          "Latissimus dorsi"
        ],
        "secondary": [
          "Biceps brachii",
          "Brachialis",
          "Teres major",
          "Posterior deltoid"
        ],
        "stabilizers": [
          "Erector spinae",
          "Rotator cuff"
        ],
        "sets": "3-4",
        "reps": "8-12",
        "rest": "90 sec",
        "technique": "Sit, thighs under pads. Pull bar to upper chest leaning slightly back, squeeze, control up to stretch.",
        "formCue": "Chest up; do not swing dramatically.",
        "difficulty": "Intermediate",
        "rationale": "BETTER: Heavy bilateral vertical pull with high overload and lat stretch.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Pull-Up (or Assisted Pull-Up)",
        "equipment": "Pull-up bar / Assisted machine",
        "grip": "Pronated",
        "gripDetail": "Shoulder-width to slightly wider overhand",
        "primary": [
          "Latissimus dorsi"
        ],
        "secondary": [
          "Biceps brachii",
          "Teres major",
          "Rhomboids",
          "Trapezius (lower)"
        ],
        "stabilizers": [
          "Rectus abdominis",
          "Erector spinae",
          "Grip flexors"
        ],
        "sets": "3-4",
        "reps": "5-12",
        "rest": "120 sec",
        "technique": "Hang full stretch, pull chest to bar, lower to full extension over 2 sec. Use assistance to hit rep range.",
        "formCue": "No kipping; full ROM each rep.",
        "difficulty": "Advanced",
        "rationale": "BEST: Highest lat activation and functional strength, scalable via assistance/weight. Gold standard.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Thursday",
    "focus": "Back + Shoulders + Arms",
    "group": "Upper Back",
    "muscle": "Teres major",
    "exercises": [
      {
        "rank": "good",
        "name": "Narrow Straight-Arm Pulldown",
        "equipment": "Cable machine + Straight bar (narrow)",
        "grip": "Pronated (narrow)",
        "gripDetail": "Close (hip-width) overhand",
        "primary": [
          "Teres major"
        ],
        "secondary": [
          "Latissimus dorsi",
          "Posterior deltoid"
        ],
        "stabilizers": [
          "Triceps (long head)",
          "Rectus abdominis"
        ],
        "sets": "3-3",
        "reps": "12-15",
        "rest": "60 sec",
        "technique": "Narrow overhand grip, arms straight. Pull to thighs focusing on armpit/back squeeze.",
        "formCue": "Keep shoulders down; feel teres (behind armpit).",
        "difficulty": "Beginner",
        "rationale": "GOOD: Narrow path biases teres major over lat width. Direct.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Close-Grip Supinated Lat Pulldown",
        "equipment": "Lat pulldown + V-handle or supinated",
        "grip": "Supinated (underhand)",
        "gripDetail": "Close, underhand",
        "primary": [
          "Teres major"
        ],
        "secondary": [
          "Latissimus dorsi",
          "Biceps brachii",
          "Posterior deltoid"
        ],
        "stabilizers": [
          "Erector spinae",
          "Rotator cuff"
        ],
        "sets": "3-4",
        "reps": "8-12",
        "rest": "90 sec",
        "technique": "Close underhand grip to upper chest, elbows tight to sides, squeeze armpits.",
        "formCue": "Elbows in front, not flared.",
        "difficulty": "Intermediate",
        "rationale": "BETTER: Close tucked elbows increase teres major + lower-lat contribution with biceps assist for heavier load.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Neutral-Grip Seated Cable Row (Close)",
        "equipment": "Seated row + V-handle",
        "grip": "Neutral (close V)",
        "gripDetail": "Close-neutral, elbows tucked",
        "primary": [
          "Teres major"
        ],
        "secondary": [
          "Latissimus dorsi",
          "Rhomboid major/minor",
          "Biceps brachii"
        ],
        "stabilizers": [
          "Erector spinae",
          "Trapezius"
        ],
        "sets": "3-4",
        "reps": "8-12",
        "rest": "90 sec",
        "technique": "Sit tall, V-handle. Row to lower ribs with elbows scraping sides, squeeze 1 sec, stretch forward.",
        "formCue": "Retract then depress scapulae; do not round lower back.",
        "difficulty": "Intermediate",
        "rationale": "BEST: Tucked neutral row maximally shortens teres major with heavy safe loading and scap control.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Thursday",
    "focus": "Back + Shoulders + Arms",
    "group": "Upper Back",
    "muscle": "Rhomboids",
    "exercises": [
      {
        "rank": "good",
        "name": "Seated Cable Row (V-Handle)",
        "equipment": "Seated row machine + V-handle",
        "grip": "Neutral (close)",
        "gripDetail": "Close-neutral, elbows tucked",
        "primary": [
          "Rhomboids (umbrella)"
        ],
        "secondary": [
          "Latissimus dorsi",
          "Biceps brachii",
          "Posterior deltoid"
        ],
        "stabilizers": [
          "Erector spinae",
          "Trapezius"
        ],
        "sets": "3-4",
        "reps": "10-15",
        "rest": "75 sec",
        "technique": "Row handle to navel, squeeze shoulder blades 1 sec, stretch forward with control.",
        "formCue": "Torso upright with slight hinge; no jerking.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Accessible horizontal pull teaching scapular retraction. Covers rhomboid group generally.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Chest-Supported Dumbbell Row",
        "equipment": "Dumbbells + Incline bench (30 deg)",
        "grip": "Neutral",
        "gripDetail": "Shoulder-width neutral, chest on bench",
        "primary": [
          "Rhomboids"
        ],
        "secondary": [
          "Latissimus dorsi",
          "Biceps brachii",
          "Posterior deltoid"
        ],
        "stabilizers": [
          "Erector spinae",
          "Trapezius"
        ],
        "sets": "3-4",
        "reps": "8-12",
        "rest": "90 sec",
        "technique": "Chest on incline bench, row dumbbells to ribs, squeeze blades, lower to stretch.",
        "formCue": "No lower-back cheating due to support.",
        "difficulty": "Intermediate",
        "rationale": "BETTER: Chest support removes momentum, stricter rhomboid squeeze.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Seated Row Machine (Neutral, Retraction Focus)",
        "equipment": "Seated row machine",
        "grip": "Neutral (handles)",
        "gripDetail": "Shoulder-width neutral, chest supported",
        "primary": [
          "Rhomboids"
        ],
        "secondary": [
          "Trapezius (middle)",
          "Latissimus dorsi",
          "Posterior deltoid"
        ],
        "stabilizers": [
          "Erector spinae",
          "Biceps brachii"
        ],
        "sets": "3-4",
        "reps": "8-12",
        "rest": "90 sec",
        "technique": "Set chest pad, row with 2-sec squeeze on every rep emphasizing blades together.",
        "formCue": "Light enough to fully retract; do not shrug.",
        "difficulty": "Intermediate",
        "rationale": "BEST: Machine stability + chest support allows heaviest strict retraction volume for rhomboid mass.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Thursday",
    "focus": "Back + Shoulders + Arms",
    "group": "Upper Back",
    "muscle": "Rhomboid major",
    "exercises": [
      {
        "rank": "good",
        "name": "Prone Dumbbell Reverse Fly (Bench)",
        "equipment": "Dumbbells + Flat bench",
        "grip": "Neutral",
        "gripDetail": "Shoulder-width, palms in, light",
        "primary": [
          "Rhomboid major"
        ],
        "secondary": [
          "Rhomboid minor",
          "Posterior deltoid",
          "Trapezius (middle)"
        ],
        "stabilizers": [
          "Erector spinae",
          "Rotator cuff"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "60 sec",
        "technique": "Lie prone on bench, arms hang. Lift to sides with retraction, pause, lower. Explicit major focus via wider arc.",
        "formCue": "Wide arc with blades squeezing hard.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Prone position isolates mid-back retractors including rhomboid major. Direct.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Wide-Grip Seated Cable Row (Retraction Hold)",
        "equipment": "Seated row + Wide straight bar",
        "grip": "Pronated (wide)",
        "gripDetail": "Wide overhand,elbows flared 45 deg",
        "primary": [
          "Rhomboid major"
        ],
        "secondary": [
          "Rhomboid minor",
          "Trapezius (middle)",
          "Posterior deltoid"
        ],
        "stabilizers": [
          "Erector spinae",
          "Biceps brachii"
        ],
        "sets": "3-4",
        "reps": "10-15",
        "rest": "75 sec",
        "technique": "Wide overhand row to lower chest, hold retraction 2 sec each rep.",
        "formCue": "Flared elbows bias upper-mid back (major).",
        "difficulty": "Intermediate",
        "rationale": "BETTER: Wide grip + hold increases rhomboid-major time under tension.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Chest-Supported T-Bar Row (Wide)",
        "equipment": "T-bar / Chest-supported row",
        "grip": "Pronated to Neutral",
        "gripDetail": "Wide overhand",
        "primary": [
          "Rhomboid major"
        ],
        "secondary": [
          "Latissimus dorsi",
          "Trapezius",
          "Biceps brachii"
        ],
        "stabilizers": [
          "Erector spinae",
          "Rear deltoid"
        ],
        "sets": "3-4",
        "reps": "8-12",
        "rest": "90 sec",
        "technique": "Chest on pad, wide grip. Row to chest, 1-sec squeeze, stretch. Heavy but strict.",
        "formCue": "Support prevents cheating; full retraction.",
        "difficulty": "Advanced",
        "rationale": "BEST: Heaviest strict horizontal pull for rhomboid-major thickness with stability.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Thursday",
    "focus": "Back + Shoulders + Arms",
    "group": "Upper Back",
    "muscle": "Rhomboid minor",
    "exercises": [
      {
        "rank": "good",
        "name": "Banded Scapular Retraction",
        "equipment": "Resistance band (anchor)",
        "grip": "Neutral",
        "gripDetail": "Shoulder-width, arms straight",
        "primary": [
          "Rhomboid minor"
        ],
        "secondary": [
          "Rhomboid major",
          "Trapezius (middle)"
        ],
        "stabilizers": [
          "Serratus anterior (antagonist)",
          "Rotator cuff"
        ],
        "sets": "2-3",
        "reps": "15-25",
        "rest": "30 sec",
        "technique": "Arms straight holding band at chest height. Squeeze blades together without bending elbows, hold 2 sec.",
        "formCue": "Straight arms isolates scapular retractors (minor).",
        "difficulty": "Beginner",
        "rationale": "GOOD: Pure retraction without arm pull, ideal for small rhomboid minor activation. Functional.",
        "mode": "Functional"
      },
      {
        "rank": "better",
        "name": "Incline Dumbbell Shrug (Prone, Light)",
        "equipment": "Dumbbells + Incline bench (30 deg)",
        "grip": "Neutral",
        "gripDetail": "Shoulder-width neutral, chest on bench",
        "primary": [
          "Rhomboid minor"
        ],
        "secondary": [
          "Rhomboid major",
          "Trapezius (middle)"
        ],
        "stabilizers": [
          "Erector spinae"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "60 sec",
        "technique": "Prone on incline, arms hang. Retract/squeeze blades up and together (shrug back, not up), lower.",
        "formCue": "Small controlled motion; light weight.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Prone retraction shrug directly loads rhomboid minor's scapular action. Low-load.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Straight-Arm Cable Scap Retraction",
        "equipment": "Cable machine + Straight bar",
        "grip": "Pronated",
        "gripDetail": "Shoulder-width overhand, arms straight",
        "primary": [
          "Rhomboid minor"
        ],
        "secondary": [
          "Rhomboid major",
          "Trapezius (middle/lower)"
        ],
        "stabilizers": [
          "Latissimus dorsi",
          "Erector spinae"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "45 sec",
        "technique": "Face cable, arms straight at shoulder height. Pull shoulders back/down (retract+depress) without bending elbows.",
        "formCue": "Arms stay straight; motion is shoulder blades only.",
        "difficulty": "Beginner",
        "rationale": "BEST: Most isolated rhomboid-minor pattern - pure scapular retraction under constant tension.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Friday",
    "focus": "Chest + Upper + Core",
    "group": "Chest",
    "muscle": "Pectoralis minor",
    "exercises": [
      {
        "rank": "good",
        "name": "Scapular Push-Up",
        "equipment": "Bodyweight",
        "grip": "Pronated (hands)",
        "gripDetail": "Shoulder-width, fingers forward",
        "primary": [
          "Pectoralis minor"
        ],
        "secondary": [
          "Serratus anterior",
          "Pectoralis major (clavicular)"
        ],
        "stabilizers": [
          "Rectus abdominis",
          "Rotator cuff"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "45 sec",
        "technique": "Push-up plank but only protract/retract shoulder blades (push floor away, sink between shoulders). Elbows straight.",
        "formCue": "Straight elbows; small 5-8 cm motion.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Direct protraction trains pec minor's scapular action safely. Functional.",
        "mode": "Functional"
      },
      {
        "rank": "better",
        "name": "Incline Dumbbell Fly (Deep Stretch)",
        "equipment": "Dumbbells + Incline bench (30 deg)",
        "grip": "Neutral to Pronated",
        "gripDetail": "Wide arc, palms facing each other to forward",
        "primary": [
          "Pectoralis minor"
        ],
        "secondary": [
          "Pectoralis major",
          "Anterior deltoid"
        ],
        "stabilizers": [
          "Serratus anterior",
          "Rotator cuff"
        ],
        "sets": "2-3",
        "reps": "10-15",
        "rest": "75 sec",
        "technique": "Incline bench, slight elbow bend. Lower DBs wide for deep stretch, bring together with protraction squeeze.",
        "formCue": "Light-moderate; do not overstretch shoulders.",
        "difficulty": "Intermediate",
        "rationale": "BETTER: Incline angle + deep stretch biases clavicular/pec-minor fibers with protraction finish.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Chest Dip (Lean Forward, Deep)",
        "equipment": "Parallel bars / Assisted dip machine",
        "grip": "Neutral (bars)",
        "gripDetail": "Shoulder-width neutral on bars",
        "primary": [
          "Pectoralis minor"
        ],
        "secondary": [
          "Pectoralis major",
          "Anterior deltoid",
          "Triceps brachii"
        ],
        "stabilizers": [
          "Serratus anterior",
          "Erector spinae"
        ],
        "sets": "3-4",
        "reps": "6-12",
        "rest": "120 sec",
        "technique": "Lean forward 20-30 deg, lower to deep stretch, drive up with chest protraction at top.",
        "formCue": "Shoulders down; avoid shrugging; use assistance if needed.",
        "difficulty": "Advanced",
        "rationale": "BEST: Deep loaded stretch + protraction gives strongest pec-minor stimulus among compounds.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Friday",
    "focus": "Chest + Upper + Core",
    "group": "Chest",
    "muscle": "Subclavius",
    "exercises": [
      {
        "rank": "good",
        "name": "Wall Slide with Scap Protraction",
        "equipment": "Bodyweight (wall)",
        "grip": "Neutral",
        "gripDetail": "Shoulder-width, forearms on wall",
        "primary": [
          "Subclavius (stabilizer)"
        ],
        "secondary": [
          "Serratus anterior",
          "Pectoralis minor"
        ],
        "stabilizers": [
          "Rotator cuff",
          "Trapezius (lower)"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "30 sec",
        "technique": "Forearms on wall, slide up while pushing shoulders forward (protract). Return with control.",
        "formCue": "Ribs down; do not shrug. Tiny clavicle stabilizer - light functional work only.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Gentle clavicle/scap control, safe for tiny subclavius. Functional / Indirect.",
        "mode": "Functional"
      },
      {
        "rank": "better",
        "name": "Supine Dumbbell Scap Protraction (Light)",
        "equipment": "Light dumbbells + Flat bench",
        "grip": "Neutral",
        "gripDetail": "Shoulder-width, arms vertical",
        "primary": [
          "Subclavius"
        ],
        "secondary": [
          "Serratus anterior",
          "Pectoralis minor"
        ],
        "stabilizers": [
          "Rotator cuff"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "30 sec",
        "technique": "Lie on bench, light DBs straight up. Push DBs toward ceiling by protracting shoulders (lift upper back slightly).",
        "formCue": "Straight elbows; 3-5 cm scap motion.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Adds light load to protraction for subclavius + serratus co-activation. Low-load.",
        "mode": "Functional"
      },
      {
        "rank": "best",
        "name": "Standing Cable Scap Protraction (Straight Arm)",
        "equipment": "Cable machine + D-handle (light)",
        "grip": "Neutral",
        "gripDetail": "Single-arm, straight arm at chest height",
        "primary": [
          "Subclavius"
        ],
        "secondary": [
          "Serratus anterior",
          "Pectoralis major"
        ],
        "stabilizers": [
          "Rotator cuff",
          "Obliques"
        ],
        "sets": "2-3",
        "reps": "12-20 /side",
        "rest": "30 sec",
        "technique": "Face away? Actually face cable, arm straight. Punch forward protracting scapula against light cable, return.",
        "formCue": "Very light; stabilize torso.",
        "difficulty": "Beginner",
        "rationale": "BEST: Most direct loadable protraction for subclavius function with constant tension. Still low-load stabilization.",
        "mode": "Functional"
      }
    ]
  },
  {
    "day": "Friday",
    "focus": "Chest + Upper + Core",
    "group": "Upper Back",
    "muscle": "Serratus anterior",
    "exercises": [
      {
        "rank": "good",
        "name": "Scapular Push-Up",
        "equipment": "Bodyweight",
        "grip": "Pronated",
        "gripDetail": "Shoulder-width hands",
        "primary": [
          "Serratus anterior"
        ],
        "secondary": [
          "Pectoralis minor",
          "Pectoralis major"
        ],
        "stabilizers": [
          "Rectus abdominis",
          "Rotator cuff"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "45 sec",
        "technique": "Plank, elbows locked. Let chest sink between shoulders then push floor away rounding upper back.",
        "formCue": "Full protraction at top; 2-sec hold.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Foundational serratus activation, zero equipment. Functional.",
        "mode": "Functional"
      },
      {
        "rank": "better",
        "name": "Supine Dumbbell Punch (Serratus Punch)",
        "equipment": "Light dumbbells + Flat bench",
        "grip": "Neutral",
        "gripDetail": "Shoulder-width, single or double arm",
        "primary": [
          "Serratus anterior"
        ],
        "secondary": [
          "Pectoralis major",
          "Anterior deltoid"
        ],
        "stabilizers": [
          "Rotator cuff"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "45 sec",
        "technique": "Lie on bench, DB straight up. Punch toward ceiling lifting shoulder off bench, lower.",
        "formCue": "Light DB; protract fully.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Loaded protraction increases serratus demand.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Single-Arm Cable Serratus Punch",
        "equipment": "Cable machine + D-handle",
        "grip": "Neutral",
        "gripDetail": "Single-arm at chest height, athletic stance",
        "primary": [
          "Serratus anterior"
        ],
        "secondary": [
          "Pectoralis major",
          "Anterior deltoid"
        ],
        "stabilizers": [
          "Obliques",
          "Erector spinae"
        ],
        "sets": "3-3",
        "reps": "12-20 /side",
        "rest": "45 sec",
        "technique": "Stand facing away? Face? Stand with cable behind, punch forward with protraction, control return.",
        "formCue": "Core braced; no trunk rotation.",
        "difficulty": "Intermediate",
        "rationale": "BEST: Standing cable adds core + full protraction ROM under constant tension.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Friday",
    "focus": "Chest + Upper + Core",
    "group": "Upper Back",
    "muscle": "Levator scapulae",
    "exercises": [
      {
        "rank": "good",
        "name": "Prone Chin Tuck + Scap Depression",
        "equipment": "Bodyweight (mat)",
        "grip": "N/A - Bodyweight",
        "gripDetail": "Prone, forehead on towel",
        "primary": [
          "Levator scapulae (stabilizer)"
        ],
        "secondary": [
          "Deep neck flexors",
          "Trapezius (lower)"
        ],
        "stabilizers": [
          "Erector spinae",
          "Multifidus"
        ],
        "sets": "2-3",
        "reps": "10-15 holds",
        "rest": "30 sec",
        "technique": "Lie prone, tuck chin, gently lift head 1-2 cm holding 5 sec, set shoulder blades down. Low-load mobility/stability.",
        "formCue": "Pain-free; tiny motion.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Gentle neck/scap control for often-tight levator. Functional / Mobility.",
        "mode": "Functional"
      },
      {
        "rank": "better",
        "name": "Dumbbell Farmer's Shrug Hold",
        "equipment": "Dumbbells",
        "grip": "Neutral",
        "gripDetail": "Shoulder-width, heavy-ish DBs at sides",
        "primary": [
          "Levator scapulae"
        ],
        "secondary": [
          "Trapezius (upper)",
          "Rhomboids"
        ],
        "stabilizers": [
          "Erector spinae",
          "Grip flexors"
        ],
        "sets": "2-3",
        "reps": "20-40 sec holds",
        "rest": "60 sec",
        "technique": "Hold heavy DBs, elevate scapulae slightly then set down 2 cm (depressed), walk or stand holding.",
        "formCue": "Neck long; do not jut chin.",
        "difficulty": "Intermediate",
        "rationale": "BETTER: Loaded scap elevation/depression endurance for levator + trap. Controlled.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Chest-Supported Incline Shrug (Neutral)",
        "equipment": "Dumbbells + Incline bench",
        "grip": "Neutral",
        "gripDetail": "Shoulder-width neutral, chest on bench",
        "primary": [
          "Levator scapulae"
        ],
        "secondary": [
          "Trapezius (upper)",
          "Rhomboids"
        ],
        "stabilizers": [
          "Erector spinae",
          "Rotator cuff"
        ],
        "sets": "2-3",
        "reps": "12-20",
        "rest": "60 sec",
        "technique": "Chest on 30-deg incline, arms hang. Shrug shoulders toward ears with neutral neck, 1-sec hold, lower.",
        "formCue": "Light-moderate; neck neutral, no poking chin.",
        "difficulty": "Beginner",
        "rationale": "BEST: Supported position isolates scapular elevators without spinal cheating, safest loading. Low-moderate load.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Friday",
    "focus": "Chest + Upper + Core",
    "group": "Spine / Core",
    "muscle": "Erector spinae",
    "exercises": [
      {
        "rank": "good",
        "name": "Superman (Prone Extension)",
        "equipment": "Bodyweight (mat)",
        "grip": "N/A - Bodyweight",
        "gripDetail": "Prone, arms overhead",
        "primary": [
          "Erector spinae"
        ],
        "secondary": [
          "Glutes",
          "Multifidus"
        ],
        "stabilizers": [
          "Hamstrings",
          "Rotator cuff"
        ],
        "sets": "2-3",
        "reps": "10-15",
        "rest": "60 sec",
        "technique": "Lie prone, lift chest + arms + legs slightly, hold 2 sec, lower. No hyperextension.",
        "formCue": "Look down; lift 10-15 cm only.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Bodyweight posterior-chain endurance, safe entry.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "45-Deg Hyperextension",
        "equipment": "Hyperextension bench (Roman chair)",
        "grip": "N/A - Bodyweight / plate",
        "gripDetail": "Hip-width, arms crossed or at head",
        "primary": [
          "Erector spinae"
        ],
        "secondary": [
          "Glutes",
          "Hamstrings"
        ],
        "stabilizers": [
          "Trapezius",
          "Rotator cuff"
        ],
        "sets": "3-3",
        "reps": "10-15",
        "rest": "75 sec",
        "technique": "Hips on pad, lower torso to 90 deg, raise to neutral (not hyperextended), squeeze glutes.",
        "formCue": "Neutral spine; do not overextend.",
        "difficulty": "Intermediate",
        "rationale": "BETTER: Full hinge ROM with optional added load.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Barbell Romanian Deadlift (Moderate)",
        "equipment": "Barbell",
        "grip": "Pronated (overhand)",
        "gripDetail": "Shoulder-width overhand, hip-width stance",
        "primary": [
          "Erector spinae (isometric)"
        ],
        "secondary": [
          "Hamstrings",
          "Glutes"
        ],
        "stabilizers": [
          "Latissimus dorsi",
          "Trapezius",
          "Grip"
        ],
        "sets": "3-4",
        "reps": "8-12",
        "rest": "120 sec",
        "technique": "Hinge hips back with soft knees, bar slides down shins to mid-shin, drive hips forward. Spine neutral.",
        "formCue": "Lats tight (bend bar); flat back throughout.",
        "difficulty": "Advanced",
        "rationale": "BEST: Heaviest functional erector loading as anti-flexion stabilizer with hip-hinge mastery.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Friday",
    "focus": "Chest + Upper + Core",
    "group": "Spine / Core",
    "muscle": "Multifidus",
    "exercises": [
      {
        "rank": "good",
        "name": "Prone Opposite Arm-Leg Lift",
        "equipment": "Bodyweight (mat)",
        "grip": "N/A - Bodyweight",
        "gripDetail": "Prone, arms forward",
        "primary": [
          "Multifidus"
        ],
        "secondary": [
          "Erector spinae",
          "Glutes"
        ],
        "stabilizers": [
          "Rotator cuff",
          "Hamstrings"
        ],
        "sets": "2-3",
        "reps": "8-12 /side",
        "rest": "45 sec",
        "technique": "Lift opposite arm + leg 10 cm, hold 3-5 sec, alternate. Pelvis stays level.",
        "formCue": "Slow; no rocking.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Gentle segmental stabilizer activation. Functional.",
        "mode": "Functional"
      },
      {
        "rank": "better",
        "name": "Bird-Dog with 5-sec Hold",
        "equipment": "Bodyweight (mat)",
        "grip": "N/A - Bodyweight",
        "gripDetail": "Quadruped, hands under shoulders",
        "primary": [
          "Multifidus"
        ],
        "secondary": [
          "Erector spinae",
          "Glutes",
          "Transverse abdominis"
        ],
        "stabilizers": [
          "Rotator cuff",
          "Hamstrings"
        ],
        "sets": "2-3",
        "reps": "6-10 /side",
        "rest": "45 sec",
        "technique": "Extend opposite arm/leg to neutral, hold 5 sec with flat back, switch. Brace lightly.",
        "formCue": "Hips level; do not rotate.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Gold-standard multifidus endurance with anti-rotation demand. Functional.",
        "mode": "Functional"
      },
      {
        "rank": "best",
        "name": "Prone Back Extension Hold (Isometric)",
        "equipment": "Bodyweight / Hyperextension bench",
        "grip": "N/A - Bodyweight",
        "gripDetail": "Prone, hands at sides or crossed",
        "primary": [
          "Multifidus"
        ],
        "secondary": [
          "Erector spinae",
          "Glutes"
        ],
        "stabilizers": [
          "Hamstrings",
          "Transverse abdominis"
        ],
        "sets": "2-3",
        "reps": "20-45 sec holds",
        "rest": "60 sec",
        "technique": "Hold neutral back-extension position (chest slightly lifted) for time, breathe normally.",
        "formCue": "Neutral neck; stop if cramping sharply.",
        "difficulty": "Intermediate",
        "rationale": "BEST: Sustained isometric best builds deep multifidus endurance. Low-load, controlled.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Friday",
    "focus": "Chest + Upper + Core",
    "group": "Spine / Core",
    "muscle": "Semispinalis",
    "exercises": [
      {
        "rank": "good",
        "name": "Prone Cobra (Chin Tuck)",
        "equipment": "Bodyweight (mat)",
        "grip": "N/A - Bodyweight",
        "gripDetail": "Prone, arms at sides",
        "primary": [
          "Semispinalis"
        ],
        "secondary": [
          "Multifidus",
          "Deep neck extensors"
        ],
        "stabilizers": [
          "Glutes",
          "Scapular stabilizers"
        ],
        "sets": "2-3",
        "reps": "10-15",
        "rest": "30 sec",
        "technique": "Tuck chin, lift chest slightly squeezing blades, hold 3 sec. Small ROM.",
        "formCue": "Eyes down; do not crank neck back.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Light thoracic/neck extensor activation. Functional.",
        "mode": "Functional"
      },
      {
        "rank": "better",
        "name": "Stability Head-Nod Extension (Hands Support)",
        "equipment": "Bodyweight",
        "grip": "N/A - Hands behind head",
        "gripDetail": "Prone or seated, hands lightly behind head",
        "primary": [
          "Semispinalis"
        ],
        "secondary": [
          "Multifidus",
          "Trapezius"
        ],
        "stabilizers": [
          "Erector spinae"
        ],
        "sets": "2-3",
        "reps": "10-15",
        "rest": "30 sec",
        "technique": "Support head weight with hands, extend thoracic slightly, nod chin. Controlled.",
        "formCue": "Hands guide, not pull neck.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Adds gentle manual support to safely load deep extensors.",
        "mode": "Functional"
      },
      {
        "rank": "best",
        "name": "Prone Incline Cobra (Light DB)",
        "equipment": "Light dumbbells + Incline bench",
        "grip": "Neutral",
        "gripDetail": "Prone on incline, light DBs at sides",
        "primary": [
          "Semispinalis"
        ],
        "secondary": [
          "Multifidus",
          "Rhomboids",
          "Posterior deltoid"
        ],
        "stabilizers": [
          "Erector spinae"
        ],
        "sets": "2-3",
        "reps": "10-15",
        "rest": "45 sec",
        "technique": "Chest on incline, light DBs. Lift chest + pinch blades, hold 2 sec. Low load.",
        "formCue": "Very light; posture endurance, not heavy row.",
        "difficulty": "Beginner",
        "rationale": "BEST: Slight load increases semispinalis endurance stimulus while supported. Low-load.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Friday",
    "focus": "Chest + Upper + Core",
    "group": "Spine / Core",
    "muscle": "Rotatores",
    "exercises": [
      {
        "rank": "good",
        "name": "Cat-Cow with Rotation",
        "equipment": "Bodyweight (mat)",
        "grip": "N/A - Bodyweight",
        "gripDetail": "Quadruped",
        "primary": [
          "Rotatores (stabilizer)"
        ],
        "secondary": [
          "Multifidus",
          "Erector spinae"
        ],
        "stabilizers": [
          "Obliques",
          "Transverse abdominis"
        ],
        "sets": "2-3",
        "reps": "8-12 /side",
        "rest": "30 sec",
        "technique": "Cat-cow flow then thread one arm under + rotate open. Slow breathing.",
        "formCue": "Move segmentally; no forcing end-range.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Gentle segmental rotation mobility for deep rotatores. Functional / Mobility.",
        "mode": "Functional"
      },
      {
        "rank": "better",
        "name": "Quadruped Thoracic Rotation (Open Book)",
        "equipment": "Bodyweight (mat)",
        "grip": "N/A - Bodyweight",
        "gripDetail": "Quadruped or side-lying",
        "primary": [
          "Rotatores"
        ],
        "secondary": [
          "Multifidus",
          "External obliques"
        ],
        "stabilizers": [
          "Glutes",
          "Serratus anterior"
        ],
        "sets": "2-3",
        "reps": "8-12 /side",
        "rest": "30 sec",
        "technique": "One hand behind head, rotate elbow toward opposite arm then open to ceiling, eyes follow.",
        "formCue": "Hips stable; rotate thoracic only.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Controlled rotation trains rotatores as segmental stabilizers. Functional.",
        "mode": "Functional"
      },
      {
        "rank": "best",
        "name": "Half-Kneeling Cable Rotation (Light)",
        "equipment": "Cable machine + D-handle (light)",
        "grip": "Neutral",
        "gripDetail": "Half-kneeling, handle at chest height",
        "primary": [
          "Rotatores"
        ],
        "secondary": [
          "External/Internal obliques",
          "Multifidus"
        ],
        "stabilizers": [
          "Glutes",
          "Transverse abdominis"
        ],
        "sets": "2-3",
        "reps": "10-15 /side",
        "rest": "45 sec",
        "technique": "Half-kneel perpendicular to cable. Rotate torso pulling handle across, hips fixed, control return.",
        "formCue": "Very light; hips square.",
        "difficulty": "Intermediate",
        "rationale": "BEST: Light loaded rotation is closest to progressive rotatores training. Low-load, controlled.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Saturday",
    "focus": "Lower + Posterior + Core",
    "group": "Lower Body",
    "muscle": "Hamstrings",
    "exercises": [
      {
        "rank": "good",
        "name": "Dumbbell Romanian Deadlift",
        "equipment": "Dumbbells",
        "grip": "Neutral",
        "gripDetail": "Hip-width, DBs in front of thighs",
        "primary": [
          "Hamstrings"
        ],
        "secondary": [
          "Glutes",
          "Erector spinae"
        ],
        "stabilizers": [
          "Latissimus dorsi",
          "Grip"
        ],
        "sets": "3-4",
        "reps": "10-15",
        "rest": "90 sec",
        "technique": "Hinge hips back, DBs slide down shins to stretch, drive hips forward squeezing hamstrings.",
        "formCue": "Soft knees; flat back.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Hip-hinge stretch + accessible load, teaches hamstring lengthening.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Seated Leg Curl",
        "equipment": "Seated leg curl machine",
        "grip": "Neutral (ankle pad)",
        "gripDetail": "Hip-width, back on pad",
        "primary": [
          "Hamstrings"
        ],
        "secondary": [
          "Calves (gastroc)"
        ],
        "stabilizers": [
          "Quadriceps (antagonist)"
        ],
        "sets": "3-4",
        "reps": "10-15",
        "rest": "75 sec",
        "technique": "Sit, pad above heels. Curl to 90 deg+, squeeze, lower to full stretch without hips lifting.",
        "formCue": "Hips down; full ROM.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Seated (hip-flexed) position lengthens hamstrings for strong growth stimulus.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Lying Leg Curl",
        "equipment": "Lying leg curl machine",
        "grip": "Neutral (ankle pad)",
        "gripDetail": "Hip-width prone, pad above heels",
        "primary": [
          "Hamstrings"
        ],
        "secondary": [
          "Calves",
          "Glutes"
        ],
        "stabilizers": [
          "Erector spinae",
          "Rectus abdominis"
        ],
        "sets": "3-4",
        "reps": "8-15",
        "rest": "75 sec",
        "technique": "Lie prone, hips pressed to pad. Curl heels to glutes, squeeze, lower slowly.",
        "formCue": "No hip lift; control eccentric.",
        "difficulty": "Intermediate",
        "rationale": "BEST: Prone position with peak contraction + stretch, easiest to overload safely.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Saturday",
    "focus": "Lower + Posterior + Core",
    "group": "Lower Body",
    "muscle": "Glutes",
    "exercises": [
      {
        "rank": "good",
        "name": "Glute Bridge (Bodyweight)",
        "equipment": "Bodyweight (mat)",
        "grip": "N/A - Bodyweight",
        "gripDetail": "Hip-width, knees bent 90 deg",
        "primary": [
          "Glutes (maximus focus)"
        ],
        "secondary": [
          "Hamstrings",
          "Quadriceps"
        ],
        "stabilizers": [
          "Transverse abdominis",
          "Erector spinae"
        ],
        "sets": "2-3",
        "reps": "15-25",
        "rest": "45 sec",
        "technique": "Back on floor, drive hips to full extension squeezing glutes 1 sec, lower without arching.",
        "formCue": "Knees out; ribs down.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Foundational glute activation, zero equipment. Covers glute group generally.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Dumbbell Hip Thrust",
        "equipment": "Dumbbell + Bench",
        "grip": "Neutral",
        "gripDetail": "Upper back on bench, DB on hips",
        "primary": [
          "Glutes"
        ],
        "secondary": [
          "Hamstrings",
          "Quadriceps"
        ],
        "stabilizers": [
          "Erector spinae",
          "Transverse abdominis"
        ],
        "sets": "3-4",
        "reps": "10-20",
        "rest": "75 sec",
        "technique": "Shoulders on bench, DB on hips. Thrust to full lockout, squeeze 1 sec, lower.",
        "formCue": "Chin tucked; knees track toes.",
        "difficulty": "Intermediate",
        "rationale": "BETTER: Elevated thrust increases ROM and load vs floor bridge.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Barbell Hip Thrust",
        "equipment": "Barbell + Bench + Pad",
        "grip": "Pronated (hands on bar)",
        "gripDetail": "Shoulder-width hands, hip-width feet",
        "primary": [
          "Glutes"
        ],
        "secondary": [
          "Hamstrings",
          "Quadriceps"
        ],
        "stabilizers": [
          "Erector spinae",
          "Latissimus dorsi"
        ],
        "sets": "3-4",
        "reps": "8-15",
        "rest": "120 sec",
        "technique": "Bar on hips with pad, back on bench. Thrust to lockout, 1-sec hold, lower controlled.",
        "formCue": "Full lockout; do not hyperextend lumbar.",
        "difficulty": "Advanced",
        "rationale": "BEST: Maximum glute loading with progressive barbell weight, top hypertrophy movement.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Saturday",
    "focus": "Lower + Posterior + Core",
    "group": "Lower Body",
    "muscle": "Gluteus maximus",
    "exercises": [
      {
        "rank": "good",
        "name": "Cable Pull-Through",
        "equipment": "Cable machine + Rope (low pulley)",
        "grip": "Neutral (rope between legs)",
        "gripDetail": "Hip-width, rope between legs, facing away",
        "primary": [
          "Gluteus maximus (explicit)"
        ],
        "secondary": [
          "Hamstrings",
          "Erector spinae"
        ],
        "stabilizers": [
          "Latissimus dorsi",
          "Transverse abdominis"
        ],
        "sets": "3-3",
        "reps": "12-20",
        "rest": "60 sec",
        "technique": "Face away, hinge back letting rope pull through legs, drive hips forward squeezing glutes hard.",
        "formCue": "Back flat; feel glute max stretch then lockout. Explicit glute-max hinge.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Teaches hip-hinge with constant glute-max tension, low back stress. Explicit maximus focus.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Barbell Romanian Deadlift (Glute Focus)",
        "equipment": "Barbell",
        "grip": "Pronated",
        "gripDetail": "Shoulder-width, hip-width stance, slight knee bend",
        "primary": [
          "Gluteus maximus"
        ],
        "secondary": [
          "Hamstrings",
          "Erector spinae"
        ],
        "stabilizers": [
          "Latissimus dorsi",
          "Grip"
        ],
        "sets": "3-4",
        "reps": "8-12",
        "rest": "120 sec",
        "technique": "Hinge with slightly more knee bend and forward hip drive, squeeze glutes at lockout 1 sec.",
        "formCue": "Push hips forward, not just up.",
        "difficulty": "Intermediate",
        "rationale": "BETTER: Heavy hinge overloads maximus lengthened position. Explicit maximus.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Barbell Hip Thrust (Maximus Peak)",
        "equipment": "Barbell + Bench",
        "grip": "Pronated",
        "gripDetail": "Feet hip-width, bar on hips",
        "primary": [
          "Gluteus maximus"
        ],
        "secondary": [
          "Hamstrings",
          "Quadriceps (slight)"
        ],
        "stabilizers": [
          "Erector spinae",
          "Transverse abdominis"
        ],
        "sets": "4-4",
        "reps": "8-15",
        "rest": "120 sec",
        "technique": "Full thrust to posterior pelvic tilt at top (tuck tailbone), 2-sec squeeze. Explicit maximus peak contraction.",
        "formCue": "Posterior tilt at top maximizes maximus shortening.",
        "difficulty": "Advanced",
        "rationale": "BEST: Peak-contraction + heavy load is unmatched for gluteus-maximus hypertrophy. Explicit distinct maximus isolation.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Saturday",
    "focus": "Lower + Posterior + Core",
    "group": "Spine / Core",
    "muscle": "Quadratus lumborum",
    "exercises": [
      {
        "rank": "good",
        "name": "Side Plank (Knees or Feet)",
        "equipment": "Bodyweight (mat)",
        "grip": "Neutral (forearm)",
        "gripDetail": "Side-lying, forearm under shoulder",
        "primary": [
          "Quadratus lumborum"
        ],
        "secondary": [
          "External/Internal obliques",
          "Glutes (medius)"
        ],
        "stabilizers": [
          "Transverse abdominis",
          "Serratus anterior"
        ],
        "sets": "2-3",
        "reps": "20-45 sec /side",
        "rest": "45 sec",
        "technique": "Stack legs, lift hips forming straight line, hold breathing normally.",
        "formCue": "Hips forward; do not sag.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Bodyweight lateral-trunk endurance for QL. Functional.",
        "mode": "Functional"
      },
      {
        "rank": "better",
        "name": "Dumbbell Side Bend",
        "equipment": "Dumbbell",
        "grip": "Neutral",
        "gripDetail": "Standing, single DB at side",
        "primary": [
          "Quadratus lumborum"
        ],
        "secondary": [
          "External/Internal obliques"
        ],
        "stabilizers": [
          "Erector spinae",
          "Trapezius"
        ],
        "sets": "2-3",
        "reps": "12-20 /side",
        "rest": "45 sec",
        "technique": "Hold DB one side, bend toward DB then return past neutral using opposite QL/obliques.",
        "formCue": "Small ROM; upright.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Direct lateral-flexion loading for QL.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Suitcase Carry (Unilateral Farmer's)",
        "equipment": "Heavy dumbbell/kettlebell",
        "grip": "Neutral",
        "gripDetail": "Single-sided, DB at side",
        "primary": [
          "Quadratus lumborum"
        ],
        "secondary": [
          "External/Internal obliques",
          "Trapezius",
          "Glutes"
        ],
        "stabilizers": [
          "Transverse abdominis",
          "Grip flexors"
        ],
        "sets": "3-3",
        "reps": "20-40 meters /side",
        "rest": "60 sec",
        "technique": "Hold heavy DB one side, walk tall without leaning, brace. Switch sides.",
        "formCue": "Do not lean away; ribs down.",
        "difficulty": "Intermediate",
        "rationale": "BEST: Heavy anti-lateral-flexion is functional QL strength with grip + core. Low-spine-load.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Saturday",
    "focus": "Lower + Posterior + Core",
    "group": "Spine / Core",
    "muscle": "Internal obliques",
    "exercises": [
      {
        "rank": "good",
        "name": "Bicycle Crunch",
        "equipment": "Bodyweight (mat)",
        "grip": "N/A - Hands behind head",
        "gripDetail": "Supine, hands lightly at head",
        "primary": [
          "Internal obliques"
        ],
        "secondary": [
          "External obliques",
          "Rectus abdominis"
        ],
        "stabilizers": [
          "Hip flexors",
          "Neck stabilizers"
        ],
        "sets": "2-3",
        "reps": "12-20 total",
        "rest": "45 sec",
        "technique": "Bring opposite elbow to knee rotating torso, extend other leg, alternate slowly.",
        "formCue": "Rotate torso, not just elbows.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Bodyweight rotation hits both oblique layers.",
        "mode": "Direct"
      },
      {
        "rank": "better",
        "name": "Cable Side Rotation (Low-to-High Chop)",
        "equipment": "Cable machine + D-handle",
        "grip": "Neutral",
        "gripDetail": "Half-kneeling or standing, low pulley",
        "primary": [
          "Internal obliques"
        ],
        "secondary": [
          "External obliques",
          "Rectus abdominis"
        ],
        "stabilizers": [
          "Glutes",
          "Transverse abdominis"
        ],
        "sets": "2-3",
        "reps": "10-15 /side",
        "rest": "60 sec",
        "technique": "Pull handle from low hip to opposite shoulder rotating torso, control return.",
        "formCue": "Hips stable; torso rotates.",
        "difficulty": "Intermediate",
        "rationale": "BETTER: Loaded diagonal rotation matches internal-oblique fiber direction.",
        "mode": "Direct"
      },
      {
        "rank": "best",
        "name": "Cable Woodchopper (Low-to-High)",
        "equipment": "Cable machine + D-handle/rope",
        "grip": "Neutral to Pronated",
        "gripDetail": "Athletic stance, low pulley",
        "primary": [
          "Internal obliques"
        ],
        "secondary": [
          "External obliques",
          "Serratus anterior",
          "Rectus abdominis"
        ],
        "stabilizers": [
          "Glutes",
          "Transverse abdominis"
        ],
        "sets": "3-3",
        "reps": "10-15 /side",
        "rest": "60 sec",
        "technique": "Chop from low to high across body with straight-ish arms, pivot back foot slightly.",
        "formCue": "Power from torso, not arms.",
        "difficulty": "Intermediate",
        "rationale": "BEST: Full diagonal loaded pattern maximally recruits internal obliques with constant tension.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Saturday",
    "focus": "Lower + Posterior + Core",
    "group": "Spine / Core",
    "muscle": "Transverse abdominis",
    "exercises": [
      {
        "rank": "good",
        "name": "Abdominal Bracing (Supine)",
        "equipment": "Bodyweight (mat)",
        "grip": "N/A - Bodyweight",
        "gripDetail": "Supine, knees bent",
        "primary": [
          "Transverse abdominis"
        ],
        "secondary": [
          "Pelvic floor",
          "Diaphragm"
        ],
        "stabilizers": [
          "Rectus abdominis",
          "Multifidus"
        ],
        "sets": "2-3",
        "reps": "5-10 breaths x 3",
        "rest": "30 sec",
        "technique": "Lie knees bent, brace abs as if expecting punch (30% effort), breathe normally behind brace, hold.",
        "formCue": "Breathe while braced; do not hold breath.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Foundational deep-core activation without spinal movement. Functional.",
        "mode": "Functional"
      },
      {
        "rank": "better",
        "name": "Dead Bug",
        "equipment": "Bodyweight (mat)",
        "grip": "N/A - Bodyweight",
        "gripDetail": "Supine, arms up, knees 90 deg",
        "primary": [
          "Transverse abdominis"
        ],
        "secondary": [
          "Rectus abdominis",
          "Hip flexors"
        ],
        "stabilizers": [
          "Multifidus",
          "Pelvic floor"
        ],
        "sets": "2-3",
        "reps": "8-12 /side",
        "rest": "45 sec",
        "technique": "Press lower back to floor, extend opposite arm/leg, return. Alternate slowly.",
        "formCue": "Back stays glued; exhale on extension.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Dynamic anti-extension trains TVA while limbs move. Functional.",
        "mode": "Functional"
      },
      {
        "rank": "best",
        "name": "Forearm Plank",
        "equipment": "Bodyweight (mat)",
        "grip": "Neutral (forearms)",
        "gripDetail": "Forearms shoulder-width, toes hip-width",
        "primary": [
          "Transverse abdominis"
        ],
        "secondary": [
          "Rectus abdominis",
          "External/Internal obliques"
        ],
        "stabilizers": [
          "Glutes",
          "Serratus anterior",
          "Quadriceps"
        ],
        "sets": "3-3",
        "reps": "20-60 sec holds",
        "rest": "60 sec",
        "technique": "Forearms + toes, body straight, squeeze glutes + brace, breathe. Stop when hips sag.",
        "formCue": "Ribs down; neck neutral.",
        "difficulty": "Beginner",
        "rationale": "BEST: Gold-standard TVA endurance with full-body tension, scalable via time/load.",
        "mode": "Direct"
      }
    ]
  },
  {
    "day": "Saturday",
    "focus": "Lower + Posterior + Core",
    "group": "Spine / Core",
    "muscle": "Diaphragm",
    "exercises": [
      {
        "rank": "good",
        "name": "Supine Diaphragmatic Breathing (360)",
        "equipment": "Bodyweight (mat)",
        "grip": "N/A - Breathing",
        "gripDetail": "Supine, knees bent, hands on ribs/belly",
        "primary": [
          "Diaphragm"
        ],
        "secondary": [
          "Transverse abdominis",
          "Pelvic floor"
        ],
        "stabilizers": [
          "Intercostals",
          "Multifidus"
        ],
        "sets": "2-3",
        "reps": "8-12 breaths",
        "rest": "30 sec",
        "technique": "Inhale 4 sec expanding belly + lower ribs 360 deg, exhale 6 sec drawing ribs down. Nasal inhale.",
        "formCue": "Shoulders stay down; belly + ribs expand, not chest lift.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Foundational breathing mechanics for all lifting. Functional / Breathing.",
        "mode": "Functional"
      },
      {
        "rank": "better",
        "name": "90/90 Breathing with Heel Dig",
        "equipment": "Bodyweight (wall/bench)",
        "grip": "N/A - Breathing",
        "gripDetail": "Supine, hips/knees 90 deg on bench",
        "primary": [
          "Diaphragm"
        ],
        "secondary": [
          "Transverse abdominis",
          "Hamstrings",
          "Pelvic floor"
        ],
        "stabilizers": [
          "Intercostals"
        ],
        "sets": "2-3",
        "reps": "8-12 breaths",
        "rest": "30 sec",
        "technique": "Feet on bench 90/90, dig heels lightly, inhale into back/sides, exhale fully drawing ribs down.",
        "formCue": "Lower back lightly into floor on exhale.",
        "difficulty": "Beginner",
        "rationale": "BETTER: 90/90 position optimizes diaphragm zone of apposition for deeper activation. Functional.",
        "mode": "Functional"
      },
      {
        "rank": "best",
        "name": "Crocodile Breathing (Prone) + Brace",
        "equipment": "Bodyweight (mat)",
        "grip": "N/A - Breathing",
        "gripDetail": "Prone, forehead on hands",
        "primary": [
          "Diaphragm"
        ],
        "secondary": [
          "Transverse abdominis",
          "Pelvic floor",
          "Intercostals"
        ],
        "stabilizers": [
          "Multifidus",
          "Glutes"
        ],
        "sets": "2-3",
        "reps": "8-12 breaths",
        "rest": "30 sec",
        "technique": "Lie prone, breathe into floor pushing belly into ground, 4-sec inhale, 6-sec exhale with light brace.",
        "formCue": "Feel belly press into floor; quiet upper chest.",
        "difficulty": "Beginner",
        "rationale": "BEST: Prone pressure gives tactile feedback for full diaphragmatic expansion + bracing transfer to lifts. Functional.",
        "mode": "Functional"
      }
    ]
  },
  {
    "day": "Saturday",
    "focus": "Lower + Posterior + Core",
    "group": "Spine / Core",
    "muscle": "Pelvic floor",
    "exercises": [
      {
        "rank": "good",
        "name": "Supine Kegel (Pelvic Floor Activation)",
        "equipment": "Bodyweight (mat)",
        "grip": "N/A - Bodyweight",
        "gripDetail": "Supine, knees bent",
        "primary": [
          "Pelvic floor"
        ],
        "secondary": [
          "Transverse abdominis",
          "Diaphragm"
        ],
        "stabilizers": [
          "Glutes",
          "Adductors"
        ],
        "sets": "2-3",
        "reps": "10-15 reps (5-sec holds)",
        "rest": "30 sec",
        "technique": "Gently lift pelvic floor (stop-urine cue 30% effort), hold 5 sec breathing normally, fully relax.",
        "formCue": "Gentle 30%; do not bear down; fully relax between reps.",
        "difficulty": "Beginner",
        "rationale": "GOOD: Safe isolated pelvic-floor awareness. Functional.",
        "mode": "Functional"
      },
      {
        "rank": "better",
        "name": "Glute Bridge with Kegel + Exhale",
        "equipment": "Bodyweight (mat)",
        "grip": "N/A - Bodyweight",
        "gripDetail": "Supine, knees bent hip-width",
        "primary": [
          "Pelvic floor"
        ],
        "secondary": [
          "Glutes (maximus)",
          "Transverse abdominis",
          "Diaphragm"
        ],
        "stabilizers": [
          "Hamstrings"
        ],
        "sets": "2-3",
        "reps": "10-15",
        "rest": "45 sec",
        "technique": "Inhale relax, exhale lift pelvic floor + bridge hips up, hold 3 sec, lower with inhale.",
        "formCue": "Coordinate exhale-lift, inhale-lower.",
        "difficulty": "Beginner",
        "rationale": "BETTER: Integrates pelvic floor with glute + breath coordination. Functional.",
        "mode": "Functional"
      },
      {
        "rank": "best",
        "name": "Deep Squat Breathing with Pelvic Floor",
        "equipment": "Bodyweight",
        "grip": "N/A - Bodyweight",
        "gripDetail": "Deep squat hold (assisted if needed)",
        "primary": [
          "Pelvic floor"
        ],
        "secondary": [
          "Diaphragm",
          "Transverse abdominis",
          "Glutes",
          "Adductors"
        ],
        "stabilizers": [
          "Calves",
          "Thoracic extensors"
        ],
        "sets": "2-3",
        "reps": "8-12 breaths",
        "rest": "30 sec",
        "technique": "Hold deep squat (doorframe assist if needed). Inhale relax/lengthen pelvic floor, exhale gently lift. Breathe 360.",
        "formCue": "Knees track toes; heels down if possible.",
        "difficulty": "Beginner",
        "rationale": "BEST: Length-tension + breathing in squat integrates pelvic floor functionally for lifting. Functional.",
        "mode": "Functional"
      }
    ]
  }
];

export function exerciseById(muscle, rank){
  const m = WORKOUT_PLAN.find(x=>x.muscle===muscle);
  if(!m) return null;
  return m.exercises.find(e=>e.rank===rank) || null;
}
export function musclesForDay(day){ return WORKOUT_PLAN.filter(x=>x.day===day); }
