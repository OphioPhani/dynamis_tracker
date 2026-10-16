// Canonical muscle registry — single source of truth for anatomy, analytics
// and exercise mapping across Workout / Muscles / History / Progress / Yearly.
// 45 unique entries (duplicates from the original inventory removed).
// ids are snake_case canonical identifiers used by the body map + analytics.
// Real 3D meshes: see data/anatomyMapping.js (BodyParts3D, CC BY 4.0).
import { ANATOMY_MESHES } from './anatomyMapping.js'

export const FILTER_BUCKETS = ['ALL', 'ARMS', 'SHOULDERS', 'CHEST', 'BACK', 'CORE', 'HIPS', 'LEGS', 'LOWER LEG']
const M = (id, name, group, bucket, surface, views, regions, aliases, location, func, role) => ({
  id, name, group, bucket, surface, views, regions, aliases, location, func, role,
  anatomyIds: (ANATOMY_MESHES[id] || []).map((m) => m.name)
})

export const MUSCLE_REGISTRY = [
  // Arms / forearms
  M('biceps_brachii', 'Biceps brachii', 'Arms', 'ARMS', true, ['front'], ['biceps'], ['biceps', 'bicep'], 'Anterior upper arm', 'Elbow flexion and forearm supination', 'Primary in curls and pulling'),
  M('brachialis', 'Brachialis', 'Arms', 'ARMS', true, ['front'], ['brachialis'], ['brachialis'], 'Deep to biceps, distal upper arm', 'Elbow flexion in any grip', 'Primary in hammer and reverse curls'),
  M('brachioradialis', 'Brachioradialis', 'Arms', 'ARMS', true, ['front'], ['brachioradialis'], ['brachioradialis'], 'Lateral forearm', 'Elbow flexion, strongest in neutral grip', 'Primary in hammer curls'),
  M('triceps_brachii', 'Triceps brachii', 'Arms', 'ARMS', true, ['back'], ['triceps'], ['triceps'], 'Posterior upper arm', 'Elbow extension', 'Primary in presses, dips and pushdowns'),
  M('forearm_flexors', 'Forearm flexors', 'Arms', 'ARMS', true, ['front'], ['forearm_front'], ['wrist flexors', 'forearms'], 'Anterior forearm', 'Wrist flexion and grip', 'Primary in wrist curls; stabilizers in pulls'),
  M('forearm_extensors', 'Forearm extensors', 'Arms', 'ARMS', true, ['back'], ['forearm_back'], ['wrist extensors'], 'Posterior forearm', 'Wrist extension', 'Primary in reverse wrist curls'),
  // Shoulders / rotator cuff
  M('anterior_deltoid', 'Anterior deltoid', 'Shoulders', 'SHOULDERS', true, ['front'], ['delt_front'], ['front delt'], 'Front of shoulder', 'Shoulder flexion', 'Primary in presses and front raises'),
  M('lateral_deltoid', 'Lateral deltoid', 'Shoulders', 'SHOULDERS', true, ['front', 'back'], ['delt_side'], ['side delt', 'medial deltoid'], 'Side of shoulder', 'Shoulder abduction', 'Primary in lateral raises'),
  M('posterior_deltoid', 'Posterior deltoid', 'Shoulders', 'SHOULDERS', true, ['back'], ['delt_rear'], ['rear delt'], 'Back of shoulder', 'Horizontal abduction and extension', 'Primary in reverse flys and face pulls'),
  M('supraspinatus', 'Supraspinatus', 'Shoulders', 'SHOULDERS', true, ['back'], ['cuff_top'], ['supraspinatus'], 'Above scapular spine', 'Initiates arm abduction', 'Low-load cuff activation'),
  M('infraspinatus', 'Infraspinatus', 'Shoulders', 'SHOULDERS', true, ['back'], ['cuff_mid'], ['infraspinatus'], 'Below scapular spine', 'External rotation of shoulder', 'Low-load cuff activation'),
  M('teres_minor', 'Teres minor', 'Shoulders', 'SHOULDERS', true, ['back'], ['cuff_low'], ['teres minor'], 'Lateral scapular border', 'External rotation', 'Low-load cuff activation'),
  M('subscapularis', 'Subscapularis', 'Shoulders', 'SHOULDERS', false, [], [], ['subscapularis'], 'Anterior scapula (deep)', 'Internal rotation of shoulder', 'Low-load cuff activation'),
  // Back / scapular
  M('trapezius', 'Trapezius', 'Back', 'BACK', true, ['back'], ['traps'], ['traps', 'upper trap'], 'Neck to mid-back', 'Scapular elevation and retraction', 'Primary in shrugs and rows'),
  M('serratus_anterior', 'Serratus anterior', 'Back', 'BACK', true, ['front'], ['serratus'], ['serratus', 'boxer muscle'], 'Lateral rib cage', 'Scapular protraction', 'Primary in punches and scap push-ups'),
  M('rhomboids', 'Rhomboids', 'Back', 'BACK', true, ['back'], ['rhomboid'], ['rhomboids'], 'Between spine and scapulae', 'Scapular retraction', 'Umbrella group: major + minor'),
  M('rhomboid_major', 'Rhomboid major', 'Back', 'BACK', true, ['back'], ['rhomboid'], ['rhomboid major'], 'Mid-back, below minor', 'Scapular retraction', 'Primary in wide rows'),
  M('rhomboid_minor', 'Rhomboid minor', 'Back', 'BACK', true, ['back'], ['rhomboid'], ['rhomboid minor'], 'Upper mid-back', 'Scapular retraction', 'Primary in retraction holds'),
  M('teres_major', 'Teres major', 'Back', 'BACK', true, ['back'], ['teres_major'], ['teres major'], 'Below shoulder joint', 'Shoulder adduction and extension', 'Assists lats in pulldowns and rows'),
  M('levator_scapulae', 'Levator scapulae', 'Back', 'BACK', true, ['back'], ['levator'], ['levator scapulae'], 'Side of neck to scapula', 'Scapular elevation', 'Low-load postural work'),
  M('latissimus_dorsi', 'Latissimus dorsi', 'Back', 'BACK', true, ['back'], ['lats'], ['lats', 'latissimus'], 'Broad mid/lower back', 'Shoulder adduction and extension', 'Primary in pull-ups and pulldowns'),
  // Spine
  M('erector_spinae', 'Erector spinae', 'Spine', 'BACK', true, ['back'], ['erector'], ['erectors', 'lower back'], 'Along the spine', 'Spinal extension', 'Primary in hyperextensions; isometric in hinges'),
  M('multifidus', 'Multifidus', 'Spine', 'BACK', false, [], [], ['multifidus'], 'Deep spinal segments', 'Segmental spinal stability', 'Stabilizer: bird-dogs, holds'),
  M('rotatores', 'Rotatores', 'Spine', 'BACK', false, [], [], ['rotatores'], 'Deep thoracic spine', 'Segmental rotation stability', 'Stabilizer: controlled rotations'),
  M('semispinalis', 'Semispinalis', 'Spine', 'BACK', false, [], [], ['semispinalis'], 'Deep neck and upper back', 'Neck and thoracic extension', 'Low-load extensor endurance'),
  M('quadratus_lumborum', 'Quadratus lumborum', 'Spine', 'BACK', false, [], [], ['ql', 'quadratus lumborum'], 'Deep lateral lower back', 'Lateral flexion and anti-flexion', 'Stabilizer: side planks, carries'),
  // Core
  M('rectus_abdominis', 'Rectus abdominis', 'Core', 'CORE', true, ['front'], ['abs'], ['abs', 'six pack', 'rectus abdominis'], 'Front of abdomen', 'Trunk flexion', 'Primary in crunches and cable crunches'),
  M('external_obliques', 'External obliques', 'Core', 'CORE', true, ['front'], ['obliques'], ['obliques', 'external oblique'], 'Sides of abdomen', 'Trunk rotation and lateral flexion', 'Primary in woodchoppers and twists'),
  M('internal_obliques', 'Internal obliques', 'Core', 'CORE', false, [], [], ['internal oblique'], 'Deep to external obliques', 'Trunk rotation (opposite side)', 'Primary in rotational chops'),
  M('transverse_abdominis', 'Transverse abdominis', 'Core', 'CORE', false, [], [], ['tva', 'transverse abdominis', 'deep core'], 'Deepest abdominal layer', 'Trunk bracing and stability', 'Stabilizer: planks, dead bugs, bracing'),
  M('diaphragm', 'Diaphragm', 'Core', 'CORE', false, [], [], ['diaphragm', 'breathing muscle'], 'Below rib cage (deep)', 'Breathing', 'Functional: breathing drills and bracing'),
  M('pelvic_floor', 'Pelvic floor', 'Core', 'CORE', false, [], [], ['pelvic floor', 'kegel'], 'Base of pelvis (deep)', 'Pelvic support and pressure control', 'Functional: activation and breathing coordination'),
  // Lower body
  M('quadriceps', 'Quadriceps', 'Lower Body', 'LEGS', true, ['front'], ['quads'], ['quads', 'thighs'], 'Front of thigh', 'Knee extension', 'Primary in squats and leg press'),
  M('rectus_femoris', 'Rectus femoris', 'Lower Body', 'LEGS', true, ['front'], ['rectus_femoris'], ['rectus femoris'], 'Center front thigh (biarticular)', 'Knee extension and hip flexion', 'Isolated by leg extensions'),
  M('hamstrings', 'Hamstrings', 'Lower Body', 'LEGS', true, ['back'], ['hamstrings'], ['hamstrings', 'hammies'], 'Back of thigh', 'Knee flexion and hip extension', 'Primary in curls and hinges'),
  M('glutes', 'Glutes', 'Lower Body', 'HIPS', true, ['back'], ['glutes'], ['glutes', 'butt'], 'Buttocks (group)', 'Hip extension and abduction', 'Umbrella group incl. maximus'),
  M('gluteus_maximus', 'Gluteus maximus', 'Lower Body', 'HIPS', true, ['back'], ['glutes'], ['glute max', 'gluteus maximus'], 'Largest buttock muscle', 'Hip extension', 'Primary in thrusts and hinges'),
  M('adductors', 'Adductors', 'Lower Body', 'HIPS', true, ['front'], ['adductors'], ['adductors', 'inner thigh'], 'Inner thigh', 'Hip adduction', 'Primary in adduction machine and sumo work'),
  M('calves', 'Calves', 'Lower Body', 'LOWER LEG', true, ['back'], ['calves'], ['calves', 'gastrocnemius', 'soleus'], 'Back of lower leg', 'Plantar flexion', 'Primary in calf raises'),
  M('tibialis_anterior', 'Tibialis anterior', 'Lower Body', 'LOWER LEG', true, ['front'], ['tibialis'], ['tibialis anterior', 'shins'], 'Front of shin', 'Dorsiflexion', 'Primary in toe raises'),
  M('iliopsoas', 'Iliopsoas', 'Lower Body', 'HIPS', false, [], [], ['psoas', 'iliopsoas', 'hip flexors'], 'Deep front hip', 'Hip flexion', 'Primary in knee/leg raises'),
  M('tensor_fasciae_latae', 'Tensor fasciae latae', 'Lower Body', 'HIPS', true, ['front'], ['tfl'], ['tfl', 'tensor fasciae latae'], 'Outer front hip', 'Hip abduction and flexion', 'Direct in abduction work'),
  // Chest
  M('pectoralis_major', 'Pectoralis major', 'Chest', 'CHEST', true, ['front'], ['pec_major'], ['pecs', 'chest', 'pectoralis major'], 'Front of chest', 'Horizontal adduction and pressing', 'Primary in bench press and push-ups'),
  M('pectoralis_minor', 'Pectoralis minor', 'Chest', 'CHEST', false, [], [], ['pec minor', 'pectoralis minor'], 'Under major on ribs (deep)', 'Scapular protraction', 'Functional: dips and protraction'),
  M('subclavius', 'Subclavius', 'Chest', 'CHEST', false, [], [], ['subclavius'], 'Below collarbone (deep)', 'Clavicle stabilization', 'Stabilizer: protraction work')
]

export const MUSCLE_BY_ID = new Map(MUSCLE_REGISTRY.map((m) => [m.id, m]))
export const MUSCLE_BY_NAME = new Map(MUSCLE_REGISTRY.map((m) => [m.name, m]))
export const SURFACE_MUSCLES = MUSCLE_REGISTRY.filter((m) => m.surface)
export const DEEP_MUSCLES = MUSCLE_REGISTRY.filter((m) => !m.surface)

export function resolveMuscleId(input) {
  if (!input) return null
  const key = String(input).trim().toLowerCase().replace(/[\s-]+/g, '_')
  if (MUSCLE_BY_ID.has(key)) return key
  for (const m of MUSCLE_REGISTRY) {
    if (m.aliases.some((a) => a.toLowerCase().replace(/[\s-]+/g, '_') === key)) return m.id
  }
  return null
}
