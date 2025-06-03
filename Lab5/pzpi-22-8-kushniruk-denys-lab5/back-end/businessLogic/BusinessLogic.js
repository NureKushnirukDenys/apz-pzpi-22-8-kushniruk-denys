/**
 * Дано:
 * - brightness (0-100) — рівень яскравості лампи у відсотках, зберігається у полі brightness моделі Light.
 * - Всі лампи — люмінесцентні, потужність визначається дискретно:
 *   0–24%: 0 Вт (вимкнено)
 *   25–49%: 9 Вт (450 лм)
 *   50–74%: 14 Вт (700 лм)
 *   75–99%: 19 Вт (900 лм)
 *   100%: 29 Вт (1300 лм)
 * - Для розрахунку економії потрібен масив об'єктів Light за певний період (наприклад, за день/тиждень).
 *
 * Формула:
 *   економія(%) = ((Pmax - Pavg) / Pmax) * 100%
 *   Pmax — максимальна потужність (всі лампи на 100%)
 *   Pavg — середня потужність за період (з урахуванням brightness)
 */

/**
 * Розрахунок потужності лампи за яскравістю (brightness 0-100)
 * @param {number} brightness - Яскравість (0-100)
 * @returns {number} Потужність у Вт
 */
function getPowerByBrightness(brightness) {
  if (brightness === 0) return 0;
  if (brightness >= 1 && brightness <= 24) return 6;
  if (brightness >= 25 && brightness <= 34) return 9;
  if (brightness >= 35 && brightness <= 49) return 12;
  if (brightness >= 50 && brightness <= 54) return 14;
  if (brightness >= 55 && brightness <= 74) return 17;
  if (brightness >= 75 && brightness <= 84) return 19;
  if (brightness >= 85 && brightness <= 99) return 24;
  if (brightness === 100) return 29;
  return 0;
}

/**
 * Розрахунок економії електроенергії
 * @param {Array} lights - Масив об'єктів освітлення за період [{brightness: Number, ...}]
 * @returns {number} Відсоток економії
 */
function calculateEnergySaving(lights) {
  if (!lights.length) return 0;

  const Pmax = lights.length * 29;
  const totalPower = lights.reduce(
    (sum, light) => sum + getPowerByBrightness(light.brightness),
    0
  );
  const Pavg = totalPower / lights.length;
  const saving = ((Pmax - Pavg) / Pmax) * 100;
  return Math.round(saving * 100) / 100;
}

module.exports = { calculateEnergySaving, getPowerByBrightness };
