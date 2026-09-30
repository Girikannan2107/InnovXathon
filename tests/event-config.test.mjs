import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { EVENT_CONFIG, validateEventConfiguration } from '../lib/event-config.ts';
import { formatINR, isPlaceholderUrl } from '../lib/utils.ts';

describe('INNOVXATHON 2026 - Event Configuration Integrity', () => {
  test('Prize pool amount must strictly equal ₹50,000', () => {
    assert.equal(EVENT_CONFIG.prizes.totalPoolAmount, 50000);
    assert.equal(EVENT_CONFIG.metadata.totalPrizePool, 50000);
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

  test('Schedule timestamps must be valid ISO 8601 strings and in chronological sequence (Sep 26 -> Oct 16 -> Oct 20 -> Oct 24)', () => {
    const regOpen = new Date(EVENT_CONFIG.schedule.registrationOpensISO).getTime();
    const regClose = new Date(EVENT_CONFIG.schedule.registrationClosesISO).getTime();
    const shortlist = new Date(EVENT_CONFIG.schedule.shortlistAnnouncementISO).getTime();
    const eventDate = new Date(EVENT_CONFIG.schedule.eventDateISO).getTime();

    assert.ok(!isNaN(regOpen), 'registrationOpensISO is not a valid date');
    assert.ok(!isNaN(regClose), 'registrationClosesISO is not a valid date');
    assert.ok(!isNaN(shortlist), 'shortlistAnnouncementISO is not a valid date');
    assert.ok(!isNaN(eventDate), 'eventDateISO is not a valid date');

    assert.ok(regOpen < regClose, 'Registration open date (26 Sep) must precede close date (16 Oct)');
    assert.ok(regClose <= shortlist, 'Registration close date (16 Oct) must precede shortlist announcement (20 Oct)');
    assert.ok(shortlist < eventDate, 'Shortlist announcement (20 Oct) must precede Grand Finale (24 Oct)');
  });

  test('Coordinators must match official contact specifications', () => {
    assert.equal(EVENT_CONFIG.contacts.coordinators.length, 2);
    assert.equal(EVENT_CONFIG.contacts.coordinators[0].name, 'Lathika M');
    assert.equal(EVENT_CONFIG.contacts.coordinators[0].phone, '+91 81220 51205');
    assert.equal(EVENT_CONFIG.contacts.coordinators[0].telHref, 'tel:+918122051205');

    assert.equal(EVENT_CONFIG.contacts.coordinators[1].name, 'Sujeet S');
    assert.equal(EVENT_CONFIG.contacts.coordinators[1].phone, '+91 63823 56586');
    assert.equal(EVENT_CONFIG.contacts.coordinators[1].telHref, 'tel:+916382356586');
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
