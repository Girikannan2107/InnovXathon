import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { EVENT_CONFIG, validateEventConfiguration } from '../lib/event-config.ts';
import { formatINR, isPlaceholderUrl } from '../lib/utils.ts';

describe('INNOVXATHON 2026 - Event Configuration Integrity', () => {
  test('Prize pool sum must strictly equal the total pool amount', () => {
    const sumIndividualPrizes = EVENT_CONFIG.prizes.items.reduce(
      (acc, item) => acc + item.amount,
      0
    );
    assert.equal(
      sumIndividualPrizes,
      EVENT_CONFIG.prizes.totalPoolAmount,
      `Sum of prizes (₹${sumIndividualPrizes}) does not match total pool (₹${EVENT_CONFIG.prizes.totalPoolAmount})`
    );
    assert.equal(EVENT_CONFIG.prizes.totalPoolAmount, 50000);
  });

  test('Preliminary judging criteria weights must total exactly 100%', () => {
    const prelimSum = EVENT_CONFIG.judgingCriteria.preliminaryStage.criteria.reduce(
      (acc, item) => acc + item.weightPercent,
      0
    );
    assert.equal(
      prelimSum,
      100,
      `Preliminary weights sum to ${prelimSum}%, expected exactly 100%`
    );
  });

  test('Final judging criteria weights must total exactly 100%', () => {
    const finalSum = EVENT_CONFIG.judgingCriteria.finalStage.criteria.reduce(
      (acc, item) => acc + item.weightPercent,
      0
    );
    assert.equal(
      finalSum,
      100,
      `Final stage weights sum to ${finalSum}%, expected exactly 100%`
    );
  });

  test('validateEventConfiguration() should pass with 0 errors', () => {
    const validation = validateEventConfiguration();
    assert.equal(validation.isValid, true);
    assert.equal(validation.errors.length, 0);
  });

  test('Schedule timestamps must be valid ISO 8601 strings and in chronological sequence', () => {
    const regOpen = new Date(EVENT_CONFIG.schedule.registrationOpensISO).getTime();
    const regClose = new Date(EVENT_CONFIG.schedule.registrationClosesISO).getTime();
    const shortlist = new Date(EVENT_CONFIG.schedule.shortlistAnnouncementISO).getTime();
    const eventDate = new Date(EVENT_CONFIG.schedule.eventDateISO).getTime();

    assert.ok(!isNaN(regOpen), 'registrationOpensISO is not a valid date');
    assert.ok(!isNaN(regClose), 'registrationClosesISO is not a valid date');
    assert.ok(!isNaN(shortlist), 'shortlistAnnouncementISO is not a valid date');
    assert.ok(!isNaN(eventDate), 'eventDateISO is not a valid date');

    assert.ok(regOpen < regClose, 'Registration open date must precede close date');
    assert.ok(regClose <= shortlist, 'Registration close date must precede shortlist announcement');
    assert.ok(shortlist < eventDate, 'Shortlist announcement must precede event date');
  });

  test('Currency formatter should output standard Indian Rupee notation', () => {
    const formatted = formatINR(50000);
    assert.match(formatted, /50[,.]?000/);
    assert.ok(formatted.includes('₹') || formatted.includes('INR'));
  });

  test('isPlaceholderUrl correctly identifies placeholder and missing links', () => {
    assert.equal(isPlaceholderUrl('REPLACE_WITH_OFFICIAL_GOOGLE_FORM_URL'), true);
    assert.equal(isPlaceholderUrl(''), true);
    assert.equal(isPlaceholderUrl('#'), true);
    assert.equal(isPlaceholderUrl(null), true);
    assert.equal(isPlaceholderUrl('https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform'), false);
    assert.equal(isPlaceholderUrl('https://maps.app.goo.gl/KVHMxNZo1FzsPkkM8'), false);
  });
});
