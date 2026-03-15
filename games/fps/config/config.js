// config/config.js
// Game-wide tuning constants. Loaded as a plain <script> before the
// module script so CONFIG is a global available everywhere.
// See index.html for the reference comment documenting each field.

const CONFIG = {
  // Player
  PLAYER_SPEED:         6,
  PLAYER_SPRINT_SPEED:  12,
  PLAYER_HEIGHT:        1.7,
  PLAYER_MAX_HP:        100,
  PLAYER_RADIUS:        0.4,
  MOUSE_SENSITIVITY:    0.0018,
  JUMP_FORCE:           7,
  GRAVITY:              18,
  PLAYER_RESPAWN_TIME:  5,

  // Energy
  PLAYER_ENERGY_MAX:    100,
  PLAYER_ENERGY_DRAIN:  30,
  PLAYER_ENERGY_REGEN:  15,

  // Gun
  GUN_DAMAGE:           34,
  AMMO_MAX:             12,
  RELOAD_TIME:          1800,
  SHOOT_COOLDOWN:       180,

  // Enemy base values (waves scale HP; type multipliers scale other stats)
  ENEMY_ATTACK_DIST:    1.4,
  ENEMY_ATTACK_RATE:    900,
  WAYPOINT_REACH_DIST:  1.2,

  // Elite enemy (spawned every Nth wave, independent of type system)
  ELITE_WAVE_INTERVAL:  5,
  ELITE_HP_MULTIPLIER:  3.0,
  ELITE_SPEED_MULT:     0.65,
  ELITE_SCALE:          1.85,
  ELITE_COLOR:          0xff7700,
  ELITE_EMISSIVE:       0x441100,
  ELITE_EYE_COLOR:      0xff0000,
  ELITE_EYE_EMISSIVE:   0xff0000,

  // Wave system
  WAVE_INTERVAL:        30,
  WAVE_INITIAL_COUNT:   3,
  WAVE_COUNT_GROWTH:    2,
  WAVE_INITIAL_HP:      100,
  WAVE_HP_GROWTH:       30,

  // Nexus
  NEXUS_MAX_HP:         300,
  NEXUS_DAMAGE:         25,
  NEXUS_REACH_DIST:     2.0,

  // Coins
  COIN_VALUE:           10,
  COIN_PICKUP_DIST:     1.4,
  COIN_BOB_SPEED:       2.2,
  COIN_ROT_SPEED:       2.5,
  COIN_LIFETIME:        20,

  // Path visualisation
  PATH_STRIP_WIDTH:         0.22,
  PATH_STRIP_COLOR:         0x550000,
  PATH_STRIP_EMISSIVE:      0xff1100,
  PATH_STRIP_INTENSITY:     1.4,
  PATH_STRIP_Y:             0.013,
  PATH_NODE_LIGHT_COLOR:    0xff2200,
  PATH_NODE_LIGHT_INTENSITY: 0.9,
  PATH_NODE_LIGHT_DISTANCE:  4.0,

  // Global lighting boost
  AMBIENT_EXTRA_INTENSITY:  0.45,
  SUN_EXTRA_INTENSITY:      0.2,
};
